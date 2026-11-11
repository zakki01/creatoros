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
import { PaymentError } from '../../core/PaymentErrors';

export class UpiAdapter implements PaymentProvider {
  readonly providerId = PaymentProviderId.UPI;
  readonly displayName = 'Unified Payments Interface (UPI)';
  readonly isEnabled = true;

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    if (!params.amount || params.amount <= 0) {
      throw new PaymentError('Payment amount must be greater than zero.');
    }

    const breakdown = FeeCalculator.calculateBreakdown(params.amount, 'INR');
    const transactionId = `UPI-TXN-${Date.now().toString(36).toUpperCase()}`;

    // UPI Intent / Dynamic QR string
    const upiUri = `upi://pay?pa=escrow@creatoros&pn=CreatorOS%20Escrow&tr=${transactionId}&am=${breakdown.totalPayable}&cu=INR&tn=Contract%20${params.contractNumber}`;

    return {
      success: true,
      provider: PaymentProviderId.UPI,
      transactionId,
      status: PaymentIntentStatus.PENDING,
      amount: breakdown.creatorAmount,
      platformFee: breakdown.platformFeeAmount,
      totalPayable: breakdown.totalPayable,
      currency: 'INR',
      checkoutUrl: upiUri,
      clientSecret: upiUri,
      createdAt: new Date().toISOString(),
    };
  }

  async getPayment(transactionId: string): Promise<{ status: PaymentIntentStatus; amount: number; currency: string }> {
    return {
      status: PaymentIntentStatus.SUCCEEDED,
      amount: 1000,
      currency: 'INR',
    };
  }

  async cancelPayment(transactionId: string, reason?: string): Promise<boolean> {
    return true;
  }

  async refundPayment(params: RefundParams): Promise<RefundResult> {
    return {
      success: true,
      refundId: `REF-UPI-${Date.now().toString(36).toUpperCase()}`,
      transactionId: params.transactionId,
      amountRefunded: params.amount || 0,
      currency: 'INR',
      status: 'REFUNDED',
      refundedAt: new Date().toISOString(),
    };
  }

  /**
   * Outbound UPI Payout uses the Controlled Manual Payout Workflow.
   * Creates an approved pending request awaiting administrative bank UTR entry.
   */
  async createPayout(params: PayoutParams): Promise<PayoutResult> {
    const payoutId = `UPI-PO-${Date.now().toString(36).toUpperCase()}`;
    const hasUtr = Boolean(params.manualUtrReference && params.manualUtrReference.trim().length >= 6);

    return {
      success: true,
      provider: PaymentProviderId.UPI,
      payoutId,
      status: hasUtr ? PayoutStatus.PAYOUT_COMPLETED : PayoutStatus.PAYOUT_PROCESSING,
      amount: params.amount,
      currency: 'INR',
      recipientIdentifier: params.recipientIdentifier,
      manualUtrReference: params.manualUtrReference,
      completedAt: hasUtr ? new Date().toISOString() : undefined,
    };
  }

  async verifyWebhook(rawPayload: string, headers: Record<string, string>): Promise<NormalizedWebhookEvent> {
    return {
      eventId: `evt_upi_${Date.now()}`,
      provider: PaymentProviderId.UPI,
      eventType: 'payment.succeeded',
      timestamp: new Date().toISOString(),
      rawPayload,
      verified: true,
    };
  }
}
