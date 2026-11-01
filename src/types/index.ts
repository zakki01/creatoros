export type UserRole = 'business' | 'creator' | 'super_admin';

export type AiAutomationLevel = 'manual' | 'assisted' | 'autopilot';

export interface Workspace {
  id: string;
  name: string;
  type: UserRole;
  avatarUrl: string;
  currency: string;
  handle?: string;
  niche?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workspaceId: string;
  avatarUrl: string;
  title?: string;
  handle?: string;
  bio?: string;
  coverUrl?: string;
  location?: string;
  website?: string;
  industry?: string;
  category?: string;
  notificationsCount?: number;
}

export type CampaignObjective =
  | 'Increase Sales'
  | 'Brand Awareness'
  | 'Product Launch'
  | 'Generate Leads'
  | 'Drive App Installs'
  | 'UGC'
  | 'Event Promotion';

export type Platform = 'Instagram' | 'YouTube' | 'TikTok' | 'X' | 'Snapchat';

export type DeliverableType =
  | 'Reel'
  | 'Post'
  | 'Story'
  | 'YouTube Video'
  | 'Short'
  | 'UGC'
  | 'Live';

export type CampaignStatus = 'Draft' | 'Active' | 'Review' | 'Completed' | 'Paused';

export type CampaignHealth = 'Healthy' | 'Needs Attention' | 'At Risk';

export interface CampaignDeliverableRequirement {
  type: DeliverableType;
  count: number;
  ratePerUnit: number;
}

export interface AiPlanRecommendation {
  creatorMix: { tier: string; count: number; percentage: number; description: string }[];
  suggestedBudgetAllocation: { category: string; amount: number; percentage: number }[];
  campaignTimeline: { phase: string; duration: string; focus: string }[];
  suggestedDeliverables: string[];
  kpis: { metric: string; target: string; benchmark: string }[];
  trackingStrategy: string;
  strategicNote: string;
}

export interface Campaign {
  id: string;
  name: string;
  title?: string;
  brandId?: string;
  brandName: string;
  brandLogo: string;
  objective: CampaignObjective;
  budgetTotal: number;
  budget?: number; // alias for budgetTotal
  budgetSpent: number;
  revenueGenerated: number;
  status: CampaignStatus;
  health: CampaignHealth;
  progress: number; // 0 - 100
  creators: { confirmed: number; target: number };
  content: { submitted: number; target: number };
  published: { published: number; target: number };
  aiInsight: string;
  targetAudience: {
    location: string[];
    ageRange: string;
    gender: string;
    interests: string[];
    language: string;
  };
  platforms: Platform[];
  deliverables: CampaignDeliverableRequirement[];
  timeline: {
    startDate: string;
    endDate: string;
    submissionDeadline: string;
  };
  brandGuidelines: string;
  aiRecommendations?: AiPlanRecommendation;
}

export interface ReliabilityMetrics {
  onTimeDelivery: number; // e.g. 96%
  briefCompliance: number; // e.g. 98%
  communication: number; // e.g. 92%
  contentQuality: number; // e.g. 94%
  campaignPerformance: number; // e.g. 91%
  responseReliability: number; // e.g. 89%
}

export interface CreatorTestimonial {
  id: string;
  brandName: string;
  brandLogo?: string;
  authorName: string;
  authorRole: string;
  rating: number;
  comment: string;
  date: string;
  verifiedCampaign: string;
}

export interface CreatorPortfolioItem {
  id: string;
  title: string;
  platform: Platform;
  type: DeliverableType;
  views: number;
  engagement: number;
  thumbnail: string;
  videoUrl?: string;
  campaignName?: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverUrl?: string;
  category: string;
  niche?: string;
  followers?: string;
  engagementRate?: number;
  bio: string;
  location: string;
  languages: string[];
  platforms: {
    platform: Platform;
    handle: string;
    followers: number;
    engagementRate: number;
    verified: boolean;
  }[];
  totalFollowers: number;
  avgEngagement: number;
  estimatedRate: number;
  rateCard: Partial<Record<DeliverableType, number>>;
  pricing?: { reel?: number; post?: number; story?: number; live?: number; shot?: number };
  verified: boolean;
  verifiedBadges: string[];
  reliabilityMetrics: ReliabilityMetrics;
  audienceBreakdown: {
    topLocations: { city: string; pct: number }[];
    ageSplit: { range: string; pct: number }[];
    genderSplit: { male: number; female: number; other: number };
  };
  pastCampaignsCount: number;
  testimonials: CreatorTestimonial[];
  portfolio: CreatorPortfolioItem[];
  availability: 'Available' | 'Limited Spots' | 'Booked until Nov';
  availabilityStatus?: 'Available' | 'Limited Availability' | 'Booked';
  availableDates?: string;
  minimumRate?: number;
  aiMatchScore?: number;
  aiMatchFactors?: {
    audienceMatch: string;
    contentRelevance: string;
    historicalPerformance: string;
    budgetCompatibility: string;
    location: string;
    reliability: string;
  };
}

export type OutreachStage =
  | 'Selected'
  | 'Contacted'
  | 'Replied'
  | 'Interested'
  | 'Negotiating'
  | 'Confirmed'
  | 'Declined';

export interface OutreachMessage {
  id: string;
  sender: 'brand' | 'creator';
  message: string;
  timestamp: string;
}

export interface OutreachItem {
  id: string;
  campaignId: string;
  campaignName: string;
  creatorId: string;
  creator: Creator;
  stage: OutreachStage;
  lastContactDate: string;
  nextAction: string;
  proposedFee: number;
  messages: OutreachMessage[];
  aiDraftProposal: string;
  pitchDetails?: {
    brandId?: string;
    brandName?: string;
    portfolioItems?: Array<{ title: string; url?: string; thumbnail?: string }>;
    pitchDeckFileName?: string;
    pitchDeckFileSize?: number;
    availability?: string;
    deliverableTypes?: string[];
    usageRights?: string;
    targetDeadline?: string;
  };
}

export type ContentStatus =
  | 'draft'
  | 'submitted'
  | 'changes_requested'
  | 'approved'
  | 'published';

export interface AiPreCheckResult {
  productVisible: boolean;
  productNotes: string;
  brandMention: boolean;
  brandNotes: string;
  requiredCta: boolean;
  ctaNotes: string;
  durationCompliant: boolean;
  durationNotes: string;
  overallStatus: 'passed' | 'warning' | 'failed';
}

export interface RevisionEntry {
  version: number;
  submittedAt: string;
  notes: string;
  mediaUrl: string;
  feedbackFromBrand?: string;
  feedbackStatus?: 'approved' | 'rejected' | 'changes_requested';
  actionDate?: string;
}

export interface ContentSubmission {
  id: string;
  campaignId: string;
  campaignName: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  deliverableType: DeliverableType;
  title: string;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  caption: string;
  hashtags: string[];
  cta: string;
  status: ContentStatus;
  submittedAt: string;
  aiPreCheck: AiPreCheckResult;
  revisionHistory: RevisionEntry[];
  brandFeedback?: string;
  publishedUrl?: string;
  performance?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'upcoming';
export type MilestoneType = 'Contract' | 'Advance' | 'Content approval' | 'Final payment';

export interface PaymentMilestone {
  id: string;
  campaignId: string;
  campaignName: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  milestone: MilestoneType;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  invoiceNumber: string;
}

export interface AiAttentionItem {
  id: string;
  title: string;
  description: string;
  severity: 'urgent' | 'warning' | 'info';
  type: 'creator_delayed' | 'pending_approval' | 'budget_drift' | 'schedule_risk';
  campaignId: string;
  campaignName: string;
  recommendedAction: string;
  actionType: 'review' | 'resolve' | 'view_campaign' | 'send_reminder';
  actionTargetId?: string;
  resolved?: boolean;
}

export interface CampaignSimulationScenario {
  id: string;
  name: string;
  strategyTitle: string;
  description: string;
  creatorBreakdown: string;
  creatorCount: number;
  projectedReach: { min: string; max: string };
  contentVolume: string;
  projectedEngagement: string;
  projectedClicks: { min: string; max: string };
  conversionPotential: string;
  estimatedCpa: string;
  confidenceScore: number;
  riskFactor: 'Low' | 'Moderate' | 'High';
  recommendationTag: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'system' | 'campaign' | 'approval' | 'payment';
  targetRole: UserRole;
  actionLink?: string;
}

export * from './liveStudio';
export * from './rbac';
export * from './socialFeed';
export * from './messaging';
export * from './trustSafety';
export * from './contract';

