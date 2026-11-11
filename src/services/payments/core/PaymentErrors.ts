export class PaymentError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly details?: any;

  constructor(message: string, code = 'PAYMENT_ERROR', status = 400, details?: any) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class IdempotencyError extends PaymentError {
  constructor(message = 'Duplicate transaction detected. Idempotency key conflict.') {
    super(message, 'IDEMPOTENCY_CONFLICT', 409);
    this.name = 'IdempotencyError';
  }
}

export class ProviderConnectionError extends PaymentError {
  constructor(provider: string, message = 'Failed to connect to upstream payment provider.') {
    super(`[${provider}] ${message}`, 'PROVIDER_UNAVAILABLE', 503);
    this.name = 'ProviderConnectionError';
  }
}

export class WebhookVerificationError extends PaymentError {
  constructor(message = 'Invalid webhook cryptographic signature or replay detected.') {
    super(message, 'WEBHOOK_VERIFICATION_FAILED', 401);
    this.name = 'WebhookVerificationError';
  }
}

export class PayoutIneligibleError extends PaymentError {
  constructor(message = 'Creator is not currently eligible for payout.') {
    super(message, 'PAYOUT_INELIGIBLE', 422);
    this.name = 'PayoutIneligibleError';
  }
}
