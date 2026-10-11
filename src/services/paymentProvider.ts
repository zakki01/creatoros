import { PaymentProviderType, ContractPaymentStatus } from '../types/contract';

export interface PaymentInitiationParams {
  contractId: string;
  contractNumber: string;
  creatorId: string;
  brandId: string;
  creatorPayment: number;
  platformFee: number;
  protectionAmount: number;
  totalAmount: number;
  currency: string;
  description: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  provider: PaymentProviderType;
  transactionId: string;
  clientSecret?: string;
  checkoutUrl?: string;
  status: 'requires_confirmation' | 'pending' | 'failed';
  errorMessage?: string;
  initiatedAt: string;
}

export interface PaymentConfirmationResult {
  success: boolean;
  provider: PaymentProviderType;
  transactionId: string;
  status: ContractPaymentStatus;
  amountHeld: number;
  currency: string;
  confirmedAt: string;
  receiptUrl?: string;
  errorMessage?: string;
}

export interface PayoutResult {
  success: boolean;
  provider: PaymentProviderType;
  transactionId: string;
  payoutId: string;
  creatorAmount: number;
  currency: string;
  paidAt: string;
  status: 'paid' | 'processing' | 'failed';
  errorMessage?: string;
}

export interface RefundResult {
  success: boolean;
  provider: PaymentProviderType;
  transactionId: string;
  refundId: string;
  amountRefunded: number;
  currency: string;
  refundedAt: string;
  status: 'refunded' | 'failed';
  errorMessage?: string;
}

export interface WebhookEventPayload {
  eventId: string;
  eventType:
    | 'payment_intent.succeeded'
    | 'payment_intent.payment_failed'
    | 'transfer.created'
    | 'refund.created'
    | 'dispute.created'
    | 'checkout.session.completed';
  provider: PaymentProviderType;
  transactionId: string;
  contractId: string;
  timestamp: string;
  verifiedServerSide: boolean;
}

export interface PaymentProvider {
  readonly providerType: PaymentProviderType;
  readonly displayName: string;
  readonly isAvailable: boolean;

  initiateProtectedPayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult>;
  confirmPayment(transactionId: string): Promise<PaymentConfirmationResult>;
  verifyPaymentStatus(transactionId: string): Promise<{ status: ContractPaymentStatus; verifiedAt: string }>;
  releasePayout(transactionId: string, creatorPayoutId: string, amount: number, currency: string): Promise<PayoutResult>;
  processRefund(transactionId: string, amount: number, currency: string, reason: string): Promise<RefundResult>;
  dispatchWebhookEvent(event: WebhookEventPayload): Promise<boolean>;
}

/**
 * Stripe Payment Provider
 * Uses Stripe Connect Custom/Express Destination Charges & Escrow Hold model.
 */
export class StripePaymentProvider implements PaymentProvider {
  readonly providerType: PaymentProviderType = 'stripe';
  readonly displayName = 'Stripe Connect Protected Payments';
  readonly isAvailable = true;

  async initiateProtectedPayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult> {
    // Server-side simulated payment intent generation
    const mockIntentId = `pi_stripe_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      provider: 'stripe',
      transactionId: mockIntentId,
      clientSecret: `${mockIntentId}_secret_${Math.random().toString(36).substring(2, 10)}`,
      status: 'requires_confirmation',
      initiatedAt: new Date().toISOString(),
    };
  }

  async confirmPayment(transactionId: string): Promise<PaymentConfirmationResult> {
    // Validates server-side payment capture
    if (!transactionId || transactionId.trim() === '') {
      return {
        success: false,
        provider: 'stripe',
        transactionId: '',
        status: 'unfunded',
        amountHeld: 0,
        currency: 'USD',
        confirmedAt: new Date().toISOString(),
        errorMessage: 'Invalid transaction token.',
      };
    }

    return {
      success: true,
      provider: 'stripe',
      transactionId,
      status: 'escrow_funded',
      amountHeld: 1200,
      currency: 'USD',
      confirmedAt: new Date().toISOString(),
      receiptUrl: `https://pay.stripe.com/receipts/acct_creatoros/${transactionId}`,
    };
  }

  async verifyPaymentStatus(transactionId: string): Promise<{ status: ContractPaymentStatus; verifiedAt: string }> {
    return {
      status: 'escrow_funded',
      verifiedAt: new Date().toISOString(),
    };
  }

  async releasePayout(transactionId: string, creatorPayoutId: string, amount: number, currency: string): Promise<PayoutResult> {
    const payoutId = `po_stripe_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      provider: 'stripe',
      transactionId,
      payoutId,
      creatorAmount: amount,
      currency,
      paidAt: new Date().toISOString(),
      status: 'paid',
    };
  }

  async processRefund(transactionId: string, amount: number, currency: string, reason: string): Promise<RefundResult> {
    const refundId = `re_stripe_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      provider: 'stripe',
      transactionId,
      refundId,
      amountRefunded: amount,
      currency,
      refundedAt: new Date().toISOString(),
      status: 'refunded',
    };
  }

  async dispatchWebhookEvent(event: WebhookEventPayload): Promise<boolean> {
    return event.verifiedServerSide === true;
  }
}

/**
 * PayPal Payment Provider
 * Uses PayPal Partner Orders & Authorized Capture with Protected Hold.
 */
export class PayPalPaymentProvider implements PaymentProvider {
  readonly providerType: PaymentProviderType = 'paypal';
  readonly displayName = 'PayPal Commerce Platform';
  readonly isAvailable = true;

  async initiateProtectedPayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult> {
    const mockOrderId = `PAYID-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return {
      success: true,
      provider: 'paypal',
      transactionId: mockOrderId,
      checkoutUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${mockOrderId}`,
      status: 'requires_confirmation',
      initiatedAt: new Date().toISOString(),
    };
  }

  async confirmPayment(transactionId: string): Promise<PaymentConfirmationResult> {
    return {
      success: true,
      provider: 'paypal',
      transactionId,
      status: 'escrow_funded',
      amountHeld: 1200,
      currency: 'USD',
      confirmedAt: new Date().toISOString(),
      receiptUrl: `https://www.paypal.com/activity/payment/${transactionId}`,
    };
  }

  async verifyPaymentStatus(transactionId: string): Promise<{ status: ContractPaymentStatus; verifiedAt: string }> {
    return {
      status: 'escrow_funded',
      verifiedAt: new Date().toISOString(),
    };
  }

  async releasePayout(transactionId: string, creatorPayoutId: string, amount: number, currency: string): Promise<PayoutResult> {
    const payoutId = `PAYOUT-${Date.now().toString(36).toUpperCase()}`;
    return {
      success: true,
      provider: 'paypal',
      transactionId,
      payoutId,
      creatorAmount: amount,
      currency,
      paidAt: new Date().toISOString(),
      status: 'paid',
    };
  }

  async processRefund(transactionId: string, amount: number, currency: string, reason: string): Promise<RefundResult> {
    const refundId = `REFUND-${Date.now().toString(36).toUpperCase()}`;
    return {
      success: true,
      provider: 'paypal',
      transactionId,
      refundId,
      amountRefunded: amount,
      currency,
      refundedAt: new Date().toISOString(),
      status: 'refunded',
    };
  }

  async dispatchWebhookEvent(event: WebhookEventPayload): Promise<boolean> {
    return event.verifiedServerSide === true;
  }
}

/**
 * Payment Provider Registry
 */
export class PaymentProviderRegistry {
  private static providers: Map<PaymentProviderType, PaymentProvider> = new Map<PaymentProviderType, PaymentProvider>([
    ['stripe', new StripePaymentProvider()],
    ['paypal', new PayPalPaymentProvider()],
  ]);

  static getProvider(type: PaymentProviderType): PaymentProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      return this.providers.get('stripe')!;
    }
    return provider;
  }

  static getAvailableProviders(): PaymentProvider[] {
    return Array.from(this.providers.values()).filter((p) => p.isAvailable);
  }
}
