import { AuthUser } from '../features/auth/types';
import {
  Campaign,
  Creator,
  OutreachItem,
  PaymentMilestone,
  Conversation,
} from '../types';
import { DirectMessage } from '../types/messaging';
import { SocialPost } from '../types/socialFeed';
import { BrandContract } from '../types/contract';
import { ShowcaseProject } from '../services/showcaseMediaService';

/**
 * Controlled Demo Identities (Exactly TWO accounts)
 */
export const DEMO_CREATOR_ACCOUNT: AuthUser = {
  id: 'demo-creator-01',
  name: 'CreatorOS Demo Creator',
  email: 'demo.creator@creatoros.ai',
  role: 'creator',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  handle: '@democreator',
  isDemo: true,
  is_demo: true,
  account_type: 'demo',
  provider: 'demo',
};

export const DEMO_BRAND_ACCOUNT: AuthUser = {
  id: 'demo-brand-01',
  name: 'CreatorOS Demo Brand',
  email: 'demo.brand@creatoros.ai',
  role: 'business',
  avatarUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
  handle: '@demobrand',
  isDemo: true,
  is_demo: true,
  account_type: 'demo',
  provider: 'demo',
};

export const DEMO_BRAND_PROFILE = {
  id: 'demo-brand-01',
  name: 'CreatorOS Demo Brand',
  handle: '@demobrand',
  logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80',
  category: 'Streetwear & Lifestyle',
  location: 'Bengaluru',
  bio: 'Official CreatorOS Demo Brand showcasing seamless creator partnerships, contract lifecycles, and campaign briefs.',
  activeCampaignsCount: 1,
  creatorsPartnered: 1,
  avgBudget: '₹40,000 – ₹80,000',
  openBrief: 'CreatorOS 2026 Showcase Campaign',
  badge: 'Verified Demo Brand',
  is_demo: true,
  account_type: 'demo',
};

export const DEMO_CREATOR_PROFILE: Creator = {
  id: 'demo-creator-01',
  name: 'CreatorOS Demo Creator',
  handle: '@democreator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  category: 'Fashion & Streetwear',
  bio: 'Official CreatorOS Demo Creator portfolio illustrating 4K lookbooks, UGC content, and live streaming.',
  location: 'Mumbai, India',
  languages: ['English', 'Hindi'],
  platforms: [
    { platform: 'Instagram', handle: '@democreator', followers: 85000, engagementRate: 4.8, verified: true },
    { platform: 'YouTube', handle: 'DemoCreatorTV', followers: 40000, engagementRate: 5.2, verified: true },
  ],
  totalFollowers: 125000,
  followers: '125K',
  engagementRate: 4.8,
  avgEngagement: 4.8,
  estimatedRate: 45000,
  minimumRate: 35000,
  rateCard: {
    Reel: 45000,
    Story: 15000,
    Post: 25000,
    Live: 50000,
    UGC: 30000,
  },
  verified: true,
  verifiedBadges: ['Verified Creator', 'Top 5% Delivery Reliability', 'Fast Responder'],
  reliabilityMetrics: {
    onTimeDelivery: 98,
    briefCompliance: 96,
    communication: 95,
    contentQuality: 98,
    campaignPerformance: 94,
    responseReliability: 96,
  },
  audienceBreakdown: {
    topLocations: [
      { city: 'Mumbai', pct: 40 },
      { city: 'Bengaluru', pct: 30 },
      { city: 'Delhi NCR', pct: 20 },
      { city: 'Others', pct: 10 },
    ],
    ageSplit: [
      { range: '18-24', pct: 55 },
      { range: '25-34', pct: 35 },
      { range: '35+', pct: 10 },
    ],
    genderSplit: { male: 60, female: 38, other: 2 },
  },
  pastCampaignsCount: 12,
  testimonials: [
    {
      id: 't-demo-01',
      brandName: 'CreatorOS Demo Brand',
      brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
      authorName: 'Alex Vance',
      authorRole: 'Brand Director',
      rating: 5,
      comment: 'Flawless execution, delivered before deadline with pristine 4K color grading.',
      date: 'Oct 2026',
      verifiedCampaign: 'CreatorOS 2026 Showcase Campaign',
    },
  ],
  portfolio: [
    {
      id: 'port-demo-01',
      title: 'Cinematic Streetwear Lookbook',
      platform: 'Instagram',
      type: 'Reel',
      thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      views: 120000,
      engagement: 5.4,
      campaignName: 'CreatorOS 2026 Showcase Campaign',
    },
  ],
  availability: 'Available',
  availabilityStatus: 'Available',
  availableDates: 'Available for Q4 Drops',
};

export const DEMO_CAMPAIGN: Campaign = {
  id: 'camp-demo-01',
  name: 'CreatorOS 2026 Showcase Campaign',
  brandName: 'CreatorOS Demo Brand',
  brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
  objective: 'Brand Awareness',
  budgetTotal: 80000,
  budget: 80000,
  budgetSpent: 45000,
  revenueGenerated: 120000,
  status: 'Active',
  health: 'Healthy',
  progress: 65,
  creators: { target: 1, confirmed: 1 },
  content: { target: 2, submitted: 1 },
  published: { target: 2, published: 1 },
  aiInsight: 'High engagement across sneaker communities; ROI performing 1.4x above category benchmark.',
  targetAudience: {
    location: ['Mumbai', 'Bengaluru', 'Delhi'],
    ageRange: '18-28',
    gender: 'All',
    interests: ['Streetwear', 'Sneakers', 'Fashion', 'Urban Culture'],
    language: 'English, Hindi',
  },
  platforms: ['Instagram', 'YouTube'],
  deliverables: [
    {
      type: 'Reel',
      count: 1,
      ratePerUnit: 35000,
    },
    {
      type: 'Story',
      count: 2,
      ratePerUnit: 5000,
    },
  ],
  timeline: {
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    submissionDeadline: '2026-11-05',
  },
  brandGuidelines: '4K vertical video. Emphasize street aesthetic and genuine lifestyle integration.',
};

export const DEMO_OUTREACH: OutreachItem = {
  id: 'outreach-demo-01',
  campaignId: 'camp-demo-01',
  campaignName: 'CreatorOS 2026 Showcase Campaign',
  creatorId: 'demo-creator-01',
  creator: DEMO_CREATOR_PROFILE,
  stage: 'Confirmed',
  lastContactDate: '2 hours ago',
  nextAction: 'Review submitted 4K lookbook reel',
  proposedFee: 45000,
  messages: [
    {
      id: 'm-1',
      sender: 'brand',
      message: 'Excited to invite you to the CreatorOS 2026 Showcase Campaign!',
      timestamp: '2026-10-01T10:00:00Z',
    },
    {
      id: 'm-2',
      sender: 'creator',
      message: 'Brief accepted! Looking forward to delivering the 4K cut.',
      timestamp: '2026-10-01T10:30:00Z',
    },
  ],
  aiDraftProposal: 'Collaborate on a high-retention 4K lookbook reel with verified platform escrow.',
};

export const DEMO_PAYMENT: PaymentMilestone = {
  id: 'pay-demo-01',
  campaignId: 'camp-demo-01',
  campaignName: 'CreatorOS 2026 Showcase Campaign',
  creatorId: 'demo-creator-01',
  creatorName: 'CreatorOS Demo Creator',
  creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  milestone: 'Advance',
  amount: 22500,
  status: 'paid',
  dueDate: '2026-10-15',
  paidDate: '2026-10-15',
  invoiceNumber: 'INV-2026-DEMO-01',
};

export const DEMO_CONTRACT: BrandContract = {
  id: 'contract-demo-01',
  contractNumber: 'CR-2026-DEMO-01',
  brandId: 'demo-brand-01',
  brandName: 'CreatorOS Demo Brand',
  brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
  creatorId: 'demo-creator-01',
  creatorName: 'CreatorOS Demo Creator',
  creatorHandle: '@democreator',
  creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  creatorCategory: 'Fashion & Streetwear',
  creatorVerified: true,
  campaignId: 'camp-demo-01',
  campaignName: 'CreatorOS 2026 Showcase Campaign',
  projectName: 'CreatorOS 2026 Showcase Lookbook',
  description: '4K cinematic reel featuring streetwear capsule items with guaranteed escrow protection.',
  startDate: '2026-10-01',
  deadline: '2026-11-15',
  deliverables: [
    {
      id: 'del-demo-01',
      type: 'Reel',
      quantity: 1,
      format: '9:16',
      duration: '30–60s',
      resolution: '1080x1920',
      specifications: 'Brand capsule pieces featured with dynamic transition.',
      referenceFiles: [],
      dueDate: '2026-11-05',
      status: 'submitted',
    },
  ],
  payment: {
    creatorPayment: 45000,
    platformFeeRate: 0.1,
    platformFee: 4500,
    protectionAmountRate: 0.2,
    protectionAmount: 9000,
    totalAmount: 49500,
    currency: 'INR',
    provider: 'stripe',
    paymentStatus: 'escrow_funded',
    fundedAt: '2026-10-01T10:00:00Z',
  },
  usageRights: {
    usageTypes: ['Organic Social', 'Paid Ads'],
    duration: '90 Days',
    territory: 'Worldwide',
    exclusivity: 'Category',
    ownership: 'creator_retains',
  },
  terms: {
    includedRevisions: 2,
    reviewPeriodDays: 3,
    creatorResponseDeadlineDays: 3,
    cancellationTerms: '50% compensation if cancelled after draft submission.',
    lateDeliveryTerms: '5% penalty per day beyond agreed milestone.',
    additionalWorkTerms: 'Any changes outside scope require formal contract amendment.',
    confidentiality: true,
    communicationGuidelines: 'All official approvals must go through CreatorOS direct channels.',
  },
  status: 'active',
  risks: [],
  files: [],
  deliveries: [],
  amendments: [],
  auditTrail: [
    {
      id: 'aud-demo-1',
      contractId: 'contract-demo-01',
      actorId: 'demo-brand-01',
      actorName: 'CreatorOS Demo Brand',
      actorRole: 'brand',
      action: 'Contract Drafted & Escrow Funded',
      timestamp: '2026-10-01T10:00:00.000Z',
      details: 'Initial contract created and escrow funded.',
      metadata: { verifiedHash: '0xabc123demo01' },
    },
  ],
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: new Date().toISOString(),
  sentAt: '2026-10-01T10:00:00.000Z',
  acceptedAt: '2026-10-01T11:00:00.000Z',
  version: 1,
};

export const DEMO_CONVERSATION: Conversation = {
  id: 'conv-demo-01',
  participantId: 'demo-brand-01',
  participantName: 'CreatorOS Demo Brand',
  participantHandle: '@demobrand',
  participantAvatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
  participantRole: 'business',
  participantBadge: 'Verified Brand',
  isOnline: true,
  lastMessage: 'Welcome to CreatorOS! Contract milestones and deliverables are live.',
  lastTimestamp: 'Just now',
  unreadCount: 0,
  campaignContext: {
    id: 'camp-demo-01',
    name: 'CreatorOS 2026 Showcase Campaign',
    agreedFee: 45000,
    milestone: 'Advance Escrow Funded',
  },
};

export const DEMO_MESSAGES: DirectMessage[] = [
  {
    id: 'msg-demo-1',
    conversationId: 'conv-demo-01',
    senderId: 'demo-brand-01',
    senderName: 'CreatorOS Demo Brand',
    senderRole: 'business',
    senderAvatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
    content: 'Welcome to CreatorOS! We are excited to collaborate on the 2026 Showcase Campaign.',
    timestamp: '10:00 AM',
    uploadStatus: 'sent',
  },
  {
    id: 'msg-demo-2',
    conversationId: 'conv-demo-01',
    senderId: 'demo-creator-01',
    senderName: 'CreatorOS Demo Creator',
    senderRole: 'creator',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    content: 'Thank you! Excited to collaborate and test deliverables with the new Live Studio.',
    timestamp: '10:05 AM',
    uploadStatus: 'sent',
  },
];

export const DEMO_SOCIAL_POST: SocialPost = {
  id: 'post-demo-01',
  authorId: 'demo-creator-01',
  authorName: 'CreatorOS Demo Creator',
  authorHandle: '@democreator',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  authorType: 'creator',
  content: 'Testing the CreatorOS Live Studio AR filters and instant contract escrow! 🚀',
  mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
  mediaType: 'image',
  contentType: 'shot',
  likes: 18,
  likedByMe: false,
  commentsCount: 2,
  sharesCount: 3,
  category: 'Fashion & Sneakers',
  timestamp: '2 hours ago',
  postStatus: 'published',
  moderationStatus: 'approved',
  comments: [],
};

export const DEMO_SHOWCASE_PROJECT: ShowcaseProject = {
  id: 'proj-demo-01',
  title: 'Summer Lookbook & Cinematic Reels',
  client: 'CreatorOS Demo Brand',
  category: 'Streetwear & Lifestyle',
  deliverableFormat: '9:16 Vertical Reel',
  description: 'Official CreatorOS demo showcase featuring 4K video reel with verified analytics.',
  creatorRole: 'Director & Lead Editor',
  createdAt: '2026-10-18T10:00:00Z',
  updatedAt: '2026-10-20T14:00:00Z',
  views: 240000,
  engagement: 12500,
  isMetricsVerified: true,
  videos: [
    {
      id: 'vid-demo-1',
      name: 'Demo_Lookbook_Cinematic.mp4',
      sizeBytes: 24500000,
      formattedSize: '23.4 MB',
      durationSec: 28,
      formattedDuration: '00:28',
      width: 1080,
      height: 1920,
      mimeType: 'video/mp4',
      url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=80',
      uploadedAt: '2026-10-18T10:00:00Z',
    },
  ],
};

/**
 * Universal safe current creator resolver.
 * Protects every creator view against `creators[0]` undefined exceptions.
 */
export function getSafeCurrentCreator(
  creators: Creator[],
  userProfile?: { id?: string; name?: string; handle?: string; avatarUrl?: string },
  authUser?: { id?: string; name?: string; handle?: string; avatarUrl?: string; is_demo?: boolean; isDemo?: boolean } | null
): Creator {
  const isDemo = Boolean(authUser?.is_demo || authUser?.isDemo);
  if (isDemo) {
    return DEMO_CREATOR_PROFILE;
  }
  const found = creators.find((c) => c.id === userProfile?.id || c.id === authUser?.id);
  if (found) return found;
  if (creators.length > 0) return creators[0];

  return {
    id: userProfile?.id || authUser?.id || 'creator-me',
    name: userProfile?.name || authUser?.name || 'Creator',
    handle: userProfile?.handle || authUser?.handle || '@creator',
    avatar: userProfile?.avatarUrl || authUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    category: 'Digital Creator',
    niche: 'Content Creation',
    followers: '0',
    engagementRate: 0,
    bio: 'Welcome to your Creator profile. Start publishing content or connect brand campaigns to build your reputation.',
    location: 'Global',
    languages: ['English'],
    platforms: [],
    totalFollowers: 0,
    avgEngagement: 0,
    estimatedRate: 0,
    rateCard: {
      Reel: 0,
      Story: 0,
      'YouTube Video': 0,
      Short: 0,
      UGC: 0,
    },
    verified: false,
    verifiedBadges: [],
    reliabilityMetrics: {
      onTimeDelivery: 100,
      briefCompliance: 100,
      communication: 100,
      contentQuality: 100,
      campaignPerformance: 100,
      responseReliability: 100,
    },
    audienceBreakdown: {
      topLocations: [],
      ageSplit: [],
      genderSplit: { male: 0, female: 0, other: 0 },
    },
    pastCampaignsCount: 0,
    testimonials: [],
    portfolio: [],
    availability: 'Available',
    availabilityStatus: 'Available',
  };
}
