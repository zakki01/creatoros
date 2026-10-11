/**
 * INTEGRATION INTERFACES SPECIFICATION
 * Clean abstractions to decouple UI/State from real external APIs (Meta Graph, YouTube Data API v3, TikTok for Business, Stripe, AWS S3).
 */

export interface MetaGraphConnector {
  authenticateOAuth(clientId: string, redirectUri: string): Promise<{ accessToken: string; expiresAt: number }>;
  getInstagramInsights(instagramBusinessId: string, mediaId: string): Promise<{
    impressions: number;
    reach: number;
    saved: number;
    shares: number;
    videoViews: number;
  }>;
  verifyCreatorCollaboration(mediaId: string, brandUsername: string): Promise<boolean>;
}

export interface YouTubeConnector {
  getChannelStats(channelId: string): Promise<{ subscriberCount: number; videoCount: number; avgViewCount: number }>;
  getVideoMetrics(videoId: string): Promise<{ views: number; likes: number; comments: number }>;
}

export interface TikTokConnector {
  getCreatorMetrics(creatorOpenId: string): Promise<{ followerCount: number; avgWatchDuration: number }>;
  getCampaignSparkAdsAuth(authCode: string): Promise<{ sparkAuthToken: string }>;
}

export interface PaymentGatewayConnector {
  createEscrowPayment(params: {
    campaignId: string;
    creatorId: string;
    amount: number;
    currency: string;
    milestone: string;
  }): Promise<{ transactionId: string; escrowStatus: 'held' | 'released' | 'refunded' }>;
  releaseMilestone(transactionId: string): Promise<{ status: 'success' | 'failed'; releasedAt: string }>;
}

export interface CloudStorageConnector {
  generatePresignedUploadUrl(params: {
    fileName: string;
    mimeType: string;
    fileSizeBytes: number;
    folder: 'campaign_briefs' | 'creator_deliverables' | 'contracts';
  }): Promise<{ uploadUrl: string; finalCdnUrl: string; signedToken: string }>;
}

export interface WebhookEventDispatcher {
  onContentSubmitted(callback: (submissionId: string) => void): void;
  onMilestoneApproved(callback: (milestoneId: string) => void): void;
  onCampaignCreated(callback: (campaignId: string) => void): void;
}
