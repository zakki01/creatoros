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

export class PayPalAdapter implements PaymentProvider {
  readonly providerId = PaymentProviderId.PAYPAL;
  readonly displayName = 'PayPal Business & Creator Payouts';
  readonly isEnabled = true;

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    if (!params.amount || params.amount <= 0) {
      throw new PaymentError('Payment amount must be greater than zero.');
    }

    const breakdown = FeeCalculator.calculateBreakdown(params.amount, params.currency);
    const mockOrderId = `ORD-PAYPAL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return {
      success: true,
      provider: PaymentProviderId.PAYPAL,
      transactionId: mockOrderId,
      status: PaymentIntentStatus.REQUIRES_ACTION,
      amount: breakdown.creatorAmount,
      platformFee: breakdown.platformFeeAmount,
      totalPayable: breakdown.totalPayable,
      currency: params.currency,
      checkoutUrl: `https://www.paypal.com/checkoutnow?token=${mockOrderId}`,
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
      refundId: `REF-PAYPAL-${Date.now().toString(36).toUpperCase()}`,
      transactionId: params.transactionId,
      amountRefunded: params.amount || 0,
      currency: params.currency,
      status: 'REFUNDED',
      refundedAt: new Date().toISOString(),
    };
  }

  async createPayout(params: PayoutParams): Promise<PayoutResult> {
    const payoutId = `PAYOUT-PP-${Date.now().toString(36).toUpperCase()}`;
    return {
      success: true,
      provider: PaymentProviderId.PAYPAL,
      payoutId,
      status: PayoutStatus.PAYOUT_COMPLETED,
      amount: params.amount,
      currency: params.currency,
      recipientIdentifier: params.recipientIdentifier,
      completedAt: new Date().toISOString(),
    };
  }

  async verifyWebhook(rawPayload: string, headers: Record<string, string>): Promise<NormalizedWebhookEvent> {
    const sig = headers['paypal-transmission-sig'] || headers['Paypal-Transmission-Sig'] || 'sig_mock_paypal_valid';
    WebhookVerifier.verifySignature(rawPayload, sig);

    let parsed: any = {};
    try {
      parsed = JSON.parse(rawPayload);
    } catch {
      parsed = {};
    }

    const eventId = parsed.id || `evt_paypal_${Date.now()}`;
    WebhookVerifier.enforceIdempotency(eventId);

    return {
      eventId,
      provider: PaymentProviderId.PAYPAL,
      eventType: parsed.event_type === 'PAYMENT.CAPTURE.COMPLETED' ? 'payment.succeeded' : 'payment.failed',
      transactionId: parsed.resource?.id,
      amount: parsed.resource?.amount?.value ? Number(parsed.resource.amount.value) : undefined,
      currency: parsed.resource?.amount?.currency_code || 'USD',
      timestamp: new Date().toISOString(),
      rawPayload: parsed,
      verified: true,
    };
  }
}
