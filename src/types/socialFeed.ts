export type PostContentType = 'reel' | 'shot' | 'blog';

export type FeedCategory =
  | 'for_you'
  | 'creators'
  | 'brands'
  | 'reels'
  | 'shots'
  | 'blogs'
  | 'trending'
  | 'discover'
  | 'following'
  | 'opportunity';

export type DiscoveryBadge =
  | '✨ Recommended'
  | '🔥 Trending'
  | 'New Creator'
  | 'Popular in Mumbai'
  | 'Great Match'
  | 'Looking for Creators'
  | 'New Campaign';

export type ConnectionState = 'connect' | 'pending' | 'connected' | 'active_campaign';

export type PostStatus = 'published' | 'draft' | 'scheduled' | 'archived';

export type ModerationStatus = 'approved' | 'hidden' | 'flagged' | 'removed';

export interface CampaignOpportunityMeta {
  campaignId: string;
  title: string;
  brandName: string;
  budgetFormatted: string;
  deliverablesSummary: string;
  deadline: string;
  location: string;
  publicUrl: string;
  requiredNiche: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorType: 'creator' | 'business' | 'super_admin';
  authorVerified?: boolean;
  content: string;
  gifUrl?: string;
  timestamp: string;
  moderationStatus?: ModerationStatus;
  likes?: number;
  likedByMe?: boolean;
  reaction?: string;
  parentId?: string;
  replyCount?: number;
  replies?: PostComment[];
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorType: 'creator' | 'business' | 'super_admin';
  authorVerified?: boolean;
  authorBadge?: string;
  discoveryBadge?: string;
  contentType: PostContentType; // 'reel' | 'shot' | 'blog'
  content: string; // legacy / combined text
  shortExcerpt?: string; // 1-2 sentence preview for feed cards ONLY
  fullContent?: string; // Complete text for full post reader / blog modal ONLY
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  isReel?: boolean;
  aspectRatio?: '9:16' | '16:9' | '1:1' | '4:5';
  duration?: string;
  tags?: string[];
  location?: string;
  timestamp: string;
  likes: number;
  likedByMe: boolean;
  myReaction?: string;
  reactionsCount?: Record<string, number>;
  commentsCount: number;
  sharesCount: number;
  savedByMe?: boolean;
  category: FeedCategory | string;
  campaignOpportunity?: CampaignOpportunityMeta;
  comments?: PostComment[];

  // Blog specifics
  blogTitle?: string;
  blogCoverImage?: string;
  blogContent?: string; // Rich article markdown/text
  blogArticleImages?: string[];
  blogReadingTime?: string; // e.g. "4 min read"

  // Compatibility aliases
  caption?: string; // alias for content
  createdAt?: string; // alias for timestamp
  likesCount?: number; // alias for likes
  authorRole?: 'creator' | 'business' | 'super_admin'; // alias for authorType

  // Post Lifecycle & Moderation
  postStatus?: PostStatus; // 'published' | 'draft' | 'scheduled' | 'archived'
  isPinned?: boolean;
  moderationStatus?: ModerationStatus; // 'approved' | 'hidden' | 'flagged' | 'removed'
  scheduledDate?: string;
  impressions?: number;
}

export type ReportReason =
  | 'Spam'
  | 'Harassment'
  | 'Inappropriate Content'
  | 'Copyright'
  | 'Fake Account'
  | 'Scam'
  | 'Other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed' | 'investigating';

export interface ContentReport {
  id: string;
  targetId: string;
  targetType: 'post' | 'reel' | 'shot' | 'blog' | 'comment' | 'creator' | 'brand';
  targetTitle?: string;
  targetOwnerId: string;
  targetOwnerName: string;
  reporterId: string;
  reporterName: string;
  reporterHandle?: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  createdAt: string;
  resolutionNote?: string;
  adminNotes?: string;
}

export interface PlatformFeatureFlags {
  discover: boolean;
  posting: boolean;
  reels: boolean;
  shots: boolean;
  blogs: boolean;
  comments: boolean;
  likes: boolean;
  sharing: boolean;
  saves: boolean;
  connections: boolean;
  messaging: boolean;
  campaigns: boolean;
  creatorVerification: boolean;
  brandVerification: boolean;

  // Compatibility aliases
  discoverFeed?: boolean;
  postCreation?: boolean;
  reelsEnabled?: boolean;
  shotsEnabled?: boolean;
  blogsEnabled?: boolean;
  commentsEnabled?: boolean;
  likesEnabled?: boolean;
  sharingEnabled?: boolean;
  savesEnabled?: boolean;
  connectSystem?: boolean;
  directMessaging?: boolean;
  campaignMarketplace?: boolean;
}

export interface PlatformSettings {
  allowCreatorPosts: boolean;
  allowBrandPosts: boolean;
  requirePostApproval: boolean;
  maxDailyUploads: number;
  escrowCommissionRate: number; // percentage, e.g. 5
  defaultCurrency: string;
  maintenanceMode: boolean;

  // Operational limits
  maxVideoSizeMb?: number;
  maxBlogWords?: number;
  rateLimitPerMinute?: number;
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  targetType: 'creator' | 'brand' | 'post' | 'report' | 'settings' | 'user' | 'feature_flag' | 'system' | 'flag' | string;
  date: string;
  timestamp?: string; // alias for date
  ipAddress?: string;
  result: 'success' | 'warning' | 'failed';
  details?: string;
}
