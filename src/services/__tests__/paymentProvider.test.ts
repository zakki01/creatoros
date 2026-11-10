import { describe, it, expect, beforeEach } from 'vitest';
import {
  WebhookSecurityManager,
  StripePaymentProvider,
  PayPalPaymentProvider,
  PaymentProviderRegistry,
} from '../paymentProvider';

describe('PaymentProvider & Webhook Security', () => {
  describe('WebhookSecurityManager', () => {
    beforeEach(() => {
      // Clear processed events
      (WebhookSecurityManager as any).processedEvents = new Set<string>();
      (WebhookSecurityManager as any).idempotencyLedger = new Map();
    });

    it('validates genuine signatures and rejects missing/malformed signatures', () => {
      expect(WebhookSecurityManager.verifySignature('{}', undefined)).toBe(false);
      expect(WebhookSecurityManager.verifySignature('{}', '')).toBe(false);
      expect(WebhookSecurityManager.verifySignature('{}', 'invalid_short')).toBe(false);

      // Timestamped v1 signature
      expect(
        WebhookSecurityManager.verifySignature('{"event":"charge.succeeded"}', 't=1698765432,v1=abcdef0123456789abcdef0123456789')
      ).toBe(true);

      // Long mock signature
      expect(
        WebhookSecurityManager.verifySignature('{}', 'sig_abcdef0123456789abcdef0123456789')
      ).toBe(true);
    });

    it('enforces idempotency and prevents duplicate event processing', () => {
      const eventId = 'evt_test_charge_1001';

      expect(WebhookSecurityManager.isDuplicate(eventId)).toBe(false);

      WebhookSecurityManager.recordEvent(eventId, { status: 'processed', amount: 5000 });

      expect(WebhookSecurityManager.isDuplicate(eventId)).toBe(true);
      expect(WebhookSecurityManager.getProcessedCount()).toBe(1);
    });
  });

  describe('StripePaymentProvider', () => {
    const provider = new StripePaymentProvider();

    it('initiates escrow protected payment intent', async () => {
      const result = await provider.initiateProtectedPayment({
        contractId: 'contract_123',
        brandId: 'brand_01',
        creatorId: 'creator_01',
        amount: 2500,
        currency: 'USD',
        idempotencyKey: 'idem_key_999',
      });

      expect(result.success).toBe(true);
      expect(result.provider).toBe('stripe');
      expect(result.transactionId).toMatch(/^pi_stripe_/);
      expect(result.clientSecret).toBeDefined();
      expect(result.status).toBe('requires_confirmation');
    });

    it('confirms payment intent and holds funds in escrow', async () => {
      const confirmation = await provider.confirmPayment('pi_stripe_sample_txn');
      expect(confirmation.success).toBe(true);
      expect(confirmation.status).toBe('escrow_funded');
      expect(confirmation.receiptUrl).toContain('pay.stripe.com');
    });

    it('rejects confirmation with empty or invalid transaction token', async () => {
      const confirmation = await provider.confirmPayment('');
      expect(confirmation.success).toBe(false);
      expect(confirmation.status).toBe('unfunded');
      expect(confirmation.errorMessage).toBeDefined();
    });

    it('releases payout to creator upon milestone completion', async () => {
      const payout = await provider.releasePayout('pi_stripe_123', 'acct_creator_dest', 2000, 'USD');
      expect(payout.success).toBe(true);
      expect(payout.payoutId).toBeDefined();
      expect(payout.status).toBe('paid');
    });

    it('processes refund on cancellation or dispute resolution', async () => {
      const refund = await provider.processRefund('pi_stripe_123', 2500, 'USD', 'Contract cancelled');
      expect(refund.success).toBe(true);
      expect(refund.refundId).toBeDefined();
      expect(refund.status).toBe('refunded');
    });
  });

  describe('PaymentProviderRegistry', () => {
    it('retrieves configured payment providers', () => {
      const stripe = PaymentProviderRegistry.getProvider('stripe');
      expect(stripe).toBeInstanceOf(StripePaymentProvider);

      const paypal = PaymentProviderRegistry.getProvider('paypal');
      expect(paypal).toBeInstanceOf(PayPalPaymentProvider);

      const all = PaymentProviderRegistry.getAvailableProviders();
      expect(all.length).toBeGreaterThanOrEqual(2);
    });

    it('falls back safely to default stripe provider when unknown type requested', () => {
      const fallback = PaymentProviderRegistry.getProvider('unknown' as any);
      expect(fallback).toBeInstanceOf(StripePaymentProvider);
    });
  });
});
