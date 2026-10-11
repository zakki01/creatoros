export type ContractStatus =
  | 'draft'
  | 'under_review'
  | 'needs_changes'
  | 'awaiting_creator'
  | 'accepted'
  | 'funded'
  | 'active'
  | 'deliverable_submitted'
  | 'client_review'
  | 'revision_requested'
  | 'approved'
  | 'payout_pending'
  | 'paid'
  | 'completed'
  | 'declined'
  | 'expired'
  | 'cancelled'
  | 'disputed'
  | 'refunded';

export type DeliverableFormat = '9:16' | '16:9' | '1:1' | '4:5' | 'Custom';

export type DeliverableItemType =
  | 'Reel'
  | 'Video'
  | 'Photo'
  | 'Carousel'
  | 'Shot'
  | 'Blog'
  | 'UGC'
  | 'Design'
  | 'Story'
  | 'Other';

export interface ContractFile {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  category: 'brief' | 'guideline' | 'asset' | 'deliverable' | 'dispute_evidence';
  uploaderId?: string;
  uploaderName?: string;
}

export interface ContractDeliverable {
  id: string;
  type: DeliverableItemType;
  quantity: number;
  format: DeliverableFormat;
  duration?: string;
  resolution?: string;
  specifications: string;
  referenceFiles: ContractFile[];
  dueDate: string;
  status: 'pending' | 'submitted' | 'revision' | 'approved';
}

export type UsageRightType =
  | 'Organic Social'
  | 'Paid Ads'
  | 'Website'
  | 'Email'
  | 'Commercial'
  | 'Print'
  | 'Other';

export type UsageDuration = '30 Days' | '90 Days' | '6 Months' | '1 Year' | 'Custom';
export type UsageTerritory = 'Local' | 'National' | 'Worldwide' | 'Custom';
export type UsageExclusivity = 'None' | 'Category' | 'Full' | 'Custom';
export type UsageOwnership = 'creator_retains' | 'brand_license' | 'full_transfer';

export interface ContractUsageRights {
  usageTypes: UsageRightType[];
  duration: UsageDuration;
  customDuration?: string;
  territory: UsageTerritory;
  customTerritory?: string;
  exclusivity: UsageExclusivity;
  customExclusivity?: string;
  ownership: UsageOwnership;
}

export interface ContractTerms {
  includedRevisions: number; // default: 2 rounds included
  reviewPeriodDays: number; // default: 3 business days
  creatorResponseDeadlineDays: number; // default: 3 days
  cancellationTerms: string;
  lateDeliveryTerms: string;
  additionalWorkTerms: string;
  confidentiality: boolean;
  communicationGuidelines: string;
}

export type PaymentProviderType = 'stripe' | 'paypal';

export type ContractPaymentStatus =
  | 'unfunded'
  | 'escrow_funded'
  | 'in_dispute'
  | 'payout_processing'
  | 'paid'
  | 'refunded';

export interface ContractPayment {
  creatorPayment: number;
  platformFeeRate: number; // e.g. 0.10 (10%)
  platformFee: number;
  protectionAmountRate: number; // e.g. 0.20 (20%)
  protectionAmount: number;
  totalAmount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  provider: PaymentProviderType;
  paymentStatus: ContractPaymentStatus;
  transactionId?: string;
  fundedAt?: string;
  paidAt?: string;
}

export interface ContractRiskWarning {
  id: string;
  code: string;
  title: string;
  reason: string;
  recommendation: string;
  stepIndex: number;
  severity: 'warning' | 'critical';
  dismissed?: boolean;
}

export interface ContractDelivery {
  id: string;
  deliverableId: string;
  version: number;
  submittedAt: string;
  creatorNotes: string;
  files: ContractFile[];
  status: 'submitted' | 'revision_requested' | 'approved';
  brandFeedback?: string;
  brandActionDate?: string;
}

export interface AmendmentChangeItem {
  field: string;
  label: string;
  previousValue: any;
  newValue: any;
}

export interface ContractAmendment {
  id: string;
  version: number;
  requestedBy: 'brand' | 'creator';
  requestedByName: string;
  requestedAt: string;
  reason: string;
  changes: AmendmentChangeItem[];
  status: 'pending' | 'approved' | 'rejected';
  respondedAt?: string;
}

export interface DisputeResolution {
  outcome: 'release_to_creator' | 'refund_to_brand' | 'partial_split' | 'contract_cancelled';
  creatorAmount: number;
  brandRefundAmount: number;
  resolvedBy: string;
  resolvedAt: string;
  notes: string;
}

export interface ContractDispute {
  id: string;
  openedBy: 'brand' | 'creator';
  openedByName: string;
  openedAt: string;
  reason: string;
  description: string;
  evidenceFiles: ContractFile[];
  status: 'open' | 'under_review' | 'resolved';
  resolution?: DisputeResolution;
}

export interface ContractAuditEvent {
  id: string;
  contractId: string;
  actorId: string;
  actorName: string;
  actorRole: 'brand' | 'creator' | 'super_admin' | 'system';
  action: string;
  timestamp: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface BrandContract {
  id: string;
  contractNumber: string; // e.g. CR-2026-8491
  brandId: string;
  brandName: string;
  brandLogo: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorCategory: string;
  creatorVerified: boolean;
  campaignId?: string;
  campaignName?: string;
  projectName: string;
  description: string;
  startDate: string;
  deadline: string;
  deliverables: ContractDeliverable[];
  payment: ContractPayment;
  usageRights: ContractUsageRights;
  terms: ContractTerms;
  status: ContractStatus;
  risks: ContractRiskWarning[];
  files: ContractFile[];
  deliveries: ContractDelivery[];
  amendments: ContractAmendment[];
  dispute?: ContractDispute;
  auditTrail: ContractAuditEvent[];
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  acceptedAt?: string;
  completedAt?: string;
  version: number;
}

export interface ContractPlatformConfig {
  platformFeePercentage: number; // default: 10
  minFee: number;
  maxFee: number;
  whoPaysFee: 'brand' | 'creator' | 'split';
  protectionPercentage: number; // default: 20
  defaultApprovalWindowDays: number; // default: 3
  defaultCreatorResponseDays: number; // default: 3
  defaultRevisionLimit: number; // default: 2
  minProjectAmount: number; // default: 50
  maxProjectAmount: number; // default: 100000
  allowedDeliverableTypes: DeliverableItemType[];
  allowedUsageTypes: UsageRightType[];
  paymentProviders: {
    stripe: boolean;
    paypal: boolean;
  };
}

export interface ContractTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  badge?: string;
  suggestedDeliverables: Partial<ContractDeliverable>[];
  suggestedRights: Partial<ContractUsageRights>;
  suggestedTerms: Partial<ContractTerms>;
}
