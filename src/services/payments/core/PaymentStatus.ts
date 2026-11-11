/**
 * CreatorOS Authoritative Payment & Payout Lifecycles
 * Standardized server-controlled finite state machines.
 */

export enum PaymentIntentStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
  AUTHORIZED = 'AUTHORIZED',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  DISPUTED = 'DISPUTED',
}

export enum PayoutStatus {
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  ELIGIBLE = 'ELIGIBLE',
  PAYOUT_REQUESTED = 'PAYOUT_REQUESTED',
  PAYOUT_PENDING = 'PAYOUT_PENDING',
  PAYOUT_PROCESSING = 'PAYOUT_PROCESSING',
  PAYOUT_COMPLETED = 'PAYOUT_COMPLETED',
  PAYOUT_FAILED = 'PAYOUT_FAILED',
  PAYOUT_CANCELLED = 'PAYOUT_CANCELLED',
}

export enum PaymentProviderId {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  UPI = 'upi',
  HYPERSWITCH = 'hyperswitch',
  MANUAL_UPI = 'manual_upi',
}
