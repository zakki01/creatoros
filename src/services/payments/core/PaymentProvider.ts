import {
  CreatePaymentParams,
  PaymentResult,
  PayoutParams,
  PayoutResult,
  RefundParams,
  RefundResult,
  NormalizedWebhookEvent,
} from './PaymentTypes';
import { PaymentProviderId, PaymentIntentStatus } from './PaymentStatus';

export interface PaymentProvider {
  readonly providerId: PaymentProviderId;
  readonly displayName: string;
  readonly isEnabled: boolean;

  /**
   * Initialize a server-verified payment intent or checkout session
   */
  createPayment(params: CreatePaymentParams): Promise<PaymentResult>;

  /**
   * Fetch current payment state from upstream provider
   */
  getPayment(transactionId: string): Promise<{ status: PaymentIntentStatus; amount: number; currency: string }>;

  /**
   * Cancel an uncaptured or pending payment
   */
  cancelPayment(transactionId: string, reason?: string): Promise<boolean>;

  /**
   * Initiate a full or partial refund
   */
  refundPayment(params: RefundParams): Promise<RefundResult>;

  /**
   * Initiate an outbound creator payout
   */
  createPayout(params: PayoutParams): Promise<PayoutResult>;

  /**
   * Verify and parse an incoming cryptographic webhook payload
   */
  verifyWebhook(rawPayload: string, headers: Record<string, string>): Promise<NormalizedWebhookEvent>;
}
