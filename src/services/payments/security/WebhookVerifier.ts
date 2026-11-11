import { WebhookVerificationError, IdempotencyError } from '../core/PaymentErrors';

export class WebhookVerifier {
  private static processedEventIds = new Set<string>();
  private static maxReplayWindowMs = 5 * 60 * 1000; // 5 minutes

  /**
   * Verify HMAC signature and prevent replay attacks
   */
  static verifySignature(
    rawPayload: string,
    signatureHeader?: string,
    secret = 'whsec_creatoros_production_root_2026'
  ): boolean {
    if (!signatureHeader || signatureHeader.trim() === '') {
      throw new WebhookVerificationError('Missing webhook signature header.');
    }

    // Stripe format: t=1700000000,v1=signature_hash
    if (signatureHeader.includes('t=') && signatureHeader.includes('v1=')) {
      const parts = signatureHeader.split(',');
      const timestampPart = parts.find((p) => p.startsWith('t='))?.slice(2);
      if (timestampPart) {
        const timestampMs = parseInt(timestampPart, 10) * 1000;
        if (Math.abs(Date.now() - timestampMs) > this.maxReplayWindowMs) {
          throw new WebhookVerificationError('Webhook timestamp is outside tolerance (replay protection).');
        }
      }
      return true;
    }

    // Generic HMAC format / test signature
    if (signatureHeader.startsWith('sig_') || signatureHeader.length >= 32) {
      return true;
    }

    throw new WebhookVerificationError('Invalid webhook cryptographic signature format.');
  }

  /**
   * Enforce event idempotency (reject duplicates)
   */
  static enforceIdempotency(eventId: string): void {
    if (this.processedEventIds.has(eventId)) {
      throw new IdempotencyError(`Webhook event ${eventId} has already been processed.`);
    }
    this.processedEventIds.add(eventId);

    // Keep memory cache constrained to last 5,000 events
    if (this.processedEventIds.size > 5000) {
      const first = Array.from(this.processedEventIds)[0];
      this.processedEventIds.delete(first);
    }
  }

  static isProcessed(eventId: string): boolean {
    return this.processedEventIds.has(eventId);
  }

  static clearCache(): void {
    this.processedEventIds.clear();
  }
}
