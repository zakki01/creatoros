export type AiProviderType = 'creatoros' | 'openai' | 'anthropic' | 'gemini' | 'default';

export interface VerificationStatus {
  ageVerified: boolean;
  dateOfBirth?: string;
  identityVerified: boolean;
  socialVerified: boolean;
  businessVerified: boolean;
  creatorOsApproved: boolean;
  verifiedBadges: string[];
}

export interface ModerationScanResult {
  status: 'allow' | 'block' | 'human_review';
  confidence: number;
  flags: string[];
  message: string;
}

export interface AiProviderConfig {
  provider: AiProviderType;
  activeProvider: AiProviderType;
  apiKey?: string;
  apiKeys: Record<string, string>;
  isConfigured: boolean;
  modelName: string;
  usageCount: number;
}

export interface SubscriptionStatus {
  tier: 'standard' | 'pro' | 'agency' | 'enterprise';
  isTrial: boolean;
  trialDaysLeft: number;
  billingCycle: 'monthly' | 'annual';
  renewalDate: string;
}
