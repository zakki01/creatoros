import { describe, it, expect, beforeEach } from 'vitest';
import {
  FeeCalculator,
  WebhookVerifier,
  StripeAdapter,
  PayPalAdapter,
  UpiAdapter,
  HyperswitchAdapter,
  PaymentService,
  PaymentIntentStatus,
  PayoutStatus,
  PaymentProviderId,
} from '../payments';

describe('Payment & Payout Modular Architecture Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    WebhookVerifier.clearCache();
  });

  describe('FeeCalculator & 0% Escrow Holding Policy', () => {
    it('calculates 10% platform fee and guarantees 0% escrow holding fee', () => {
      const breakdown = FeeCalculator.calculateBreakdown(1000);
      expect(breakdown.creatorAmount).toBe(1000);
      expect(breakdown.platformFeeRate).toBe(0.10);
      expect(breakdown.platformFeeAmount).toBe(100);
      expect(breakdown.escrowHoldFeeRate).toBe(0.00);
      expect(breakdown.escrowHoldFeeAmount).toBe(0);
      expect(breakdown.totalPayable).toBe(1100);
    });

    it('handles custom volume tiers if defined while retaining 0% escrow hold', () => {
      const breakdown = FeeCalculator.calculateBreakdown(5000, 'USD', 0.08); // 8% enterprise tier
      expect(breakdown.platformFeeAmount).toBe(400);
      expect(breakdown.escrowHoldFeeAmount).toBe(0);
      expect(breakdown.totalPayable).toBe(5400);
    });
  });

  describe('WebhookVerifier Security & Replay Prevention', () => {
    const secret = 'whsec_test_secret_key_12345';
    const rawPayload = JSON.stringify({ id: 'evt_9999', type: 'payment_intent.succeeded' });

    it('verifies valid Stripe timestamp format within replay tolerance', () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const signatureHeader = `t=${currentTimestamp},v1=mock_hash_signature_value`;

      const isValid = WebhookVerifier.verifySignature(rawPayload, signatureHeader, secret);
      expect(isValid).toBe(true);
    });

    it('rejects stale webhooks older than 5 minutes to prevent replay attacks', () => {
      const staleTimestamp = Math.floor(Date.now() / 1000) - 305; // 305s ago (> 300s window)
      const signatureHeader = `t=${staleTimestamp},v1=mock_hash_signature_value`;

      expect(() => {
        WebhookVerifier.verifySignature(rawPayload, signatureHeader, secret);
      }).toThrow('replay protection');
    });

    it('enforces event idempotency to prevent duplicate transaction credits', () => {
      expect(WebhookVerifier.isProcessed('evt_first_seen')).toBe(false);
      WebhookVerifier.enforceIdempotency('evt_first_seen');
      expect(WebhookVerifier.isProcessed('evt_first_seen')).toBe(true);

      // Duplicate processing triggers IdempotencyError
      expect(() => {
        WebhookVerifier.enforceIdempotency('evt_first_seen');
      }).toThrow('already been processed');
    });
  });

  describe('UPI Adapter & Manual Payout Workflow Engine', () => {
    const upiAdapter = new UpiAdapter();

    it('generates compliant UPI Intent and QR payloads for Indian transactions', async () => {
      const paymentRes = await upiAdapter.createPayment({
        contractId: 'cnt_upi_001',
        contractNumber: 'CNT-2026-001',
        amount: 2500,
        currency: 'INR',
        brandId: 'brand_001',
        creatorId: 'creator_001',
        provider: PaymentProviderId.UPI,
        description: 'Brand milestone deposit',
      });

      expect(paymentRes.status).toBe(PaymentIntentStatus.PENDING);
      expect(paymentRes.clientSecret).toContain('upi://pay');
      expect(paymentRes.clientSecret).toContain('am=2750'); // 2500 gross + 10% platform fee
    });

    it('requires a verified bank UTR reference before confirming manual UPI payouts', async () => {
      // 1. Missing UTR -> returns PAYOUT_PROCESSING awaiting bank nodal transfer
      const pendingPayout = await upiAdapter.createPayout({
        contractId: 'cnt_upi_001',
        creatorId: 'creator_001',
        amount: 5000,
        currency: 'INR',
        recipientIdentifier: 'creator@okhdfcbank',
      });
      expect(pendingPayout.status).toBe(PayoutStatus.PAYOUT_PROCESSING);

      // 2. Supplying bank UTR reference -> confirms settlement
      const settledPayout = await upiAdapter.createPayout({
        contractId: 'cnt_upi_001',
        creatorId: 'creator_001',
        amount: 5000,
        currency: 'INR',
        recipientIdentifier: 'creator@okhdfcbank',
        manualUtrReference: 'HDFC000987654321',
      });
      expect(settledPayout.status).toBe(PayoutStatus.PAYOUT_COMPLETED);
      expect(settledPayout.manualUtrReference).toBe('HDFC000987654321');
    });
  });

  describe('Hyperswitch Adapter Feature Guard & Architecture Assessment', () => {
    const hyperswitch = new HyperswitchAdapter();

    it('guards live requests when HYPERSWITCH_ENABLED is false (Sandbox Ready)', async () => {
      const payment = await hyperswitch.createPayment({
        contractId: 'cnt_hs_01',
        contractNumber: 'CNT-2026-002',
        amount: 100,
        currency: 'USD',
        brandId: 'brand_hs',
        creatorId: 'creator_hs',
        provider: PaymentProviderId.HYPERSWITCH,
      });

      expect(payment.status).toBe(PaymentIntentStatus.REQUIRES_ACTION);
      expect(payment.provider).toBe(PaymentProviderId.HYPERSWITCH);
    });

    it('returns truthful payout capability requirements for Hyperswitch', async () => {
      const payoutRes = await hyperswitch.createPayout({
        contractId: 'cnt_hs_01',
        creatorId: 'creator_hs',
        amount: 50,
        currency: 'USD',
        recipientIdentifier: 'hyperswitch_payout_cust_1',
      });

      expect(payoutRes.provider).toBe(PaymentProviderId.HYPERSWITCH);
      expect(payoutRes.status).toBe(PayoutStatus.PAYOUT_COMPLETED);
    });
  });

  describe('PaymentService Orchestrator & Idempotency Engine', () => {
    it('initiates contract payment and registers all providers', async () => {
      const available = PaymentService.getAvailableProviders();
      expect(available.length).toBe(4);
      expect(available.map((p) => p.id)).toContain('stripe');
      expect(available.map((p) => p.id)).toContain('paypal');
      expect(available.map((p) => p.id)).toContain('upi');
      expect(available.map((p) => p.id)).toContain('hyperswitch');

      const payment = await PaymentService.initiateContractPayment({
        contractId: 'cnt_srv_001',
        contractNumber: 'CNT-2026-003',
        brandId: 'brand_123',
        creatorId: 'creator_456',
        amount: 400,
        currency: 'USD',
        provider: PaymentProviderId.STRIPE,
      });

      expect(payment.transactionId).toBeDefined();
      expect(payment.status).toBe(PaymentIntentStatus.REQUIRES_ACTION);
    });
  });
});
