import { PaymentIntentStatus, PayoutStatus, PaymentProviderId } from './PaymentStatus';

export interface PaymentBreakdown {
  creatorAmount: number;
  platformFeeRate: number; // e.g. 0.10 (10%)
  platformFeeAmount: number;
  escrowHoldFeeRate: number; // 0.00 (0% hold fee policy)
  escrowHoldFeeAmount: number;
  totalPayable: number;
  currency: string;
}

export interface CreatePaymentParams {
  contractId: string;
  contractNumber: string;
  brandId: string;
  creatorId: string;
  amount: number;
  currency: string;
  provider: PaymentProviderId;
  description: string;
  idempotencyKey: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  provider: PaymentProviderId;
  transactionId: string;
  status: PaymentIntentStatus;
  amount: number;
  platformFee: number;
  totalPayable: number;
  currency: string;
  clientSecret?: string;
  checkoutUrl?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface PayoutParams {
  contractId: string;
  creatorId: string;
  amount: number;
  currency: string;
  provider: PaymentProviderId;
  recipientIdentifier: string; // PayPal email, UPI VPA, Stripe account
  idempotencyKey?: string;
  manualUtrReference?: string;
  metadata?: Record<string, any>;
}

export interface PayoutResult {
  success: boolean;
  provider: PaymentProviderId;
  payoutId: string;
  status: PayoutStatus;
  amount: number;
  currency: string;
  recipientIdentifier: string;
  manualUtrReference?: string;
  errorMessage?: string;
  completedAt?: string;
}

export interface RefundParams {
  transactionId: string;
  amount?: number; // Partial refund if specified, otherwise full
  currency: string;
  reason: string;
  idempotencyKey: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  transactionId: string;
  amountRefunded: number;
  currency: string;
  status: 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'FAILED';
  errorMessage?: string;
  refundedAt: string;
}

export interface NormalizedWebhookEvent {
  eventId: string;
  provider: PaymentProviderId;
  eventType:
    | 'payment.succeeded'
    | 'payment.failed'
    | 'payout.completed'
    | 'payout.failed'
    | 'refund.succeeded'
    | 'dispute.opened';
  transactionId?: string;
  payoutId?: string;
  contractId?: string;
  amount?: number;
  currency?: string;
  timestamp: string;
  rawPayload: any;
  verified: boolean;
}
