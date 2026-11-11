import { PaymentProvider } from '../../core/PaymentProvider';
import { PaymentProviderId, PaymentIntentStatus, PayoutStatus } from '../../core/PaymentStatus';
import {
  CreatePaymentParams,
  PaymentResult,
  PayoutParams,
  PayoutResult,
  RefundParams,
  RefundResult,
  NormalizedWebhookEvent,
} from '../../core/PaymentTypes';
import { FeeCalculator } from '../../fees/FeeCalculator';
import { WebhookVerifier } from '../../security/WebhookVerifier';
import { PaymentError } from '../../core/PaymentErrors';

export class StripeAdapter implements PaymentProvider {
  readonly providerId = PaymentProviderId.STRIPE;
  readonly displayName = 'Stripe Connect Protected Payments';
  readonly isEnabled = true;

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    if (!params.amount || params.amount <= 0) {
      throw new PaymentError('Payment amount must be greater than zero.');
    }

    const breakdown = FeeCalculator.calculateBreakdown(params.amount, params.currency);
    const mockIntentId = `pi_stripe_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      success: true,
      provider: PaymentProviderId.STRIPE,
      transactionId: mockIntentId,
      status: PaymentIntentStatus.REQUIRES_ACTION,
      amount: breakdown.creatorAmount,
      platformFee: breakdown.platformFeeAmount,
      totalPayable: breakdown.totalPayable,
      currency: params.currency,
      clientSecret: `${mockIntentId}_secret_${Math.random().toString(36).substring(2, 10)}`,
      checkoutUrl: `https://checkout.stripe.com/c/pay/${mockIntentId}`,
      createdAt: new Date().toISOString(),
    };
  }

  async getPayment(transactionId: string): Promise<{ status: PaymentIntentStatus; amount: number; currency: string }> {
    return {
      status: PaymentIntentStatus.SUCCEEDED,
      amount: 1000,
      currency: 'USD',
    };
  }

  async cancelPayment(transactionId: string, reason?: string): Promise<boolean> {
    return true;
  }

  async refundPayment(params: RefundParams): Promise<RefundResult> {
    return {
      success: true,
      refundId: `re_stripe_${Date.now().toString(36)}`,
      transactionId: params.transactionId,
      amountRefunded: params.amount || 0,
      currency: params.currency,
      status: 'REFUNDED',
      refundedAt: new Date().toISOString(),
    };
  }

  async createPayout(params: PayoutParams): Promise<PayoutResult> {
    const payoutId = `po_stripe_${Date.now().toString(36)}`;
    return {
      success: true,
      provider: PaymentProviderId.STRIPE,
      payoutId,
      status: PayoutStatus.PAYOUT_COMPLETED,
      amount: params.amount,
      currency: params.currency,
      recipientIdentifier: params.recipientIdentifier,
      completedAt: new Date().toISOString(),
    };
  }

  async verifyWebhook(rawPayload: string, headers: Record<string, string>): Promise<NormalizedWebhookEvent> {
    const sig = headers['stripe-signature'] || headers['Stripe-Signature'];
    WebhookVerifier.verifySignature(rawPayload, sig);

    let parsed: any = {};
    try {
      parsed = JSON.parse(rawPayload);
    } catch {
      parsed = {};
    }

    const eventId = parsed.id || `evt_stripe_${Date.now()}`;
    WebhookVerifier.enforceIdempotency(eventId);

    return {
      eventId,
      provider: PaymentProviderId.STRIPE,
      eventType: parsed.type === 'payment_intent.succeeded' ? 'payment.succeeded' : 'payment.failed',
      transactionId: parsed.data?.object?.id,
      amount: parsed.data?.object?.amount ? parsed.data.object.amount / 100 : undefined,
      currency: parsed.data?.object?.currency?.toUpperCase() || 'USD',
      timestamp: new Date().toISOString(),
      rawPayload: parsed,
      verified: true,
    };
  }
}
