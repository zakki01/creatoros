import { PaymentBreakdown } from '../core/PaymentTypes';

export class FeeCalculator {
  private static defaultPlatformFeeRate = 0.10; // 10%
  private static defaultEscrowHoldFeeRate = 0.00; // 0% hold fee policy

  /**
   * Calculate exact breakdown with round-to-cent precision.
   * Prevents client modification of platform fee or holding fee.
   */
  static calculateBreakdown(
    creatorGrossAmount: number,
    currency = 'USD',
    platformFeeRate = this.defaultPlatformFeeRate
  ): PaymentBreakdown {
    const gross = Math.max(0, Number(creatorGrossAmount) || 0);
    const feeRate = Math.max(0, Number(platformFeeRate) || 0.10);

    // Platform fee = 10% of creator compensation
    const platformFeeAmount = Math.round(gross * feeRate * 100) / 100;

    // Escrow holding fee = Exactly 0% ($0.00)
    const escrowHoldFeeAmount = 0.00;

    // Total payable by brand = Gross Creator Amount + Platform Fee
    const totalPayable = Math.round((gross + platformFeeAmount) * 100) / 100;

    return {
      creatorAmount: gross,
      platformFeeRate: feeRate,
      platformFeeAmount,
      escrowHoldFeeRate: this.defaultEscrowHoldFeeRate,
      escrowHoldFeeAmount,
      totalPayable,
      currency,
    };
  }

  /**
   * Set dynamic server-side platform fee percentage
   */
  static setPlatformFeeRate(rate: number): void {
    if (rate >= 0 && rate <= 0.5) {
      this.defaultPlatformFeeRate = rate;
    }
  }

  static getPlatformFeeRate(): number {
    return this.defaultPlatformFeeRate;
  }
}
