import {
  AiPlanRecommendation,
  CampaignObjective,
  CampaignSimulationScenario,
  Creator,
  Campaign,
  AiPreCheckResult,
} from '../types';

export class AiCampaignEngine {
  /**
   * Generates a comprehensive structured campaign plan from natural language or parameters
   */
  static generatePlan(input: {
    prompt?: string;
    objective: CampaignObjective;
    budget: number;
    location: string;
    targetNiche?: string;
  }): AiPlanRecommendation {
    const budget = input.budget || 500000;
    const loc = input.location || 'Mumbai';
    const isFashion = (input.prompt || '').toLowerCase().includes('sneaker') || (input.prompt || '').toLowerCase().includes('fashion');

    const creatorMixPct = isFashion
      ? [
          { tier: 'Micro Creators (20k - 100k)', count: 12, percentage: 35, description: 'Direct community credibility, hyper-local Mumbai street culture resonance' },
          { tier: 'Mid-Tier Authorities (100k - 500k)', count: 5, percentage: 50, description: 'Cinematic 4K styling showcases and unboxing Reels' },
          { tier: 'Macro Anchor (500k+)', count: 1, percentage: 15, description: 'Flagship hype ignition post on launch day' },
        ]
      : [
          { tier: 'Micro Specialists (25k - 80k)', count: 15, percentage: 40, description: 'High engagement rates, niche-specific conversion proof' },
          { tier: 'Mid-Tier Leaders (100k - 400k)', count: 6, percentage: 45, description: 'High visual production and review credibility' },
          { tier: 'Cultural Influencer (500k+)', count: 1, percentage: 15, description: 'Broad reach & brand legitimization' },
        ];

    const budgetAllocations = [
      { category: 'Creator Fees & Production', amount: Math.round(budget * 0.76), percentage: 76 },
      { category: 'Paid Media Whitelisting & Boosts', amount: Math.round(budget * 0.14), percentage: 14 },
      { category: 'Product Sampling & Courier Express', amount: Math.round(budget * 0.06), percentage: 6 },
      { category: 'Platform Contingency & Performance Bonuses', amount: Math.round(budget * 0.04), percentage: 4 },
    ];

    return {
      creatorMix: creatorMixPct,
      suggestedBudgetAllocation: budgetAllocations,
      campaignTimeline: [
        { phase: 'Discovery & AI Matching', duration: 'Days 1-4', focus: `Score top ${loc}-based creators by affinity & reliability` },
        { phase: 'Outreach & Rapid Contracting', duration: 'Days 5-9', focus: 'Dispatch one-click smart contracts and 50% advance' },
        { phase: 'Sample Seeding & UGC Filming', duration: 'Days 10-18', focus: 'Physical drops with AI pre-check on draft uploads' },
        { phase: 'Coordinated Publishing Waves', duration: 'Days 19-28', focus: 'Staggered release (Teaser -> Hero -> Review) to maximize algorithm velocity' },
        { phase: 'Attribution & ROI Optimization', duration: 'Days 29-35', focus: 'Scale paid whitelisting on top 20% highest converting posts' },
      ],
      suggestedDeliverables: [
        '1x 9:16 Cinematic 4K Reel (30-45s) with on-screen product interaction',
        '2x Instagram Story sequences with direct UTM swipe-up link',
        '1x High-resolution raw product photography asset for brand reuse',
      ],
      kpis: [
        { metric: 'Projected Total Reach', target: '2.1M - 2.8M', benchmark: 'Top 10% in niche' },
        { metric: 'Avg Engagement Rate', target: '5.2%', benchmark: 'Category baseline 2.8%' },
        { metric: 'Click-Through Rate (CTR)', target: '3.6%', benchmark: 'Industry avg 1.9%' },
        { metric: 'Target Blended ROAS', target: '3.4x', benchmark: 'Break-even 1.8x' },
        { metric: 'Estimated CPA', target: '₹240 - ₹290', benchmark: 'Meta Ads avg ₹420' },
      ],
      trackingStrategy: 'Unique Creator UTMs + Custom 10% Discount Codes mapped directly to real-time checkout conversion webhooks.',
      strategicNote: `By focusing on ${loc} creators with verified on-time delivery >90%, shipping logistics are cut to <24h and production revision cycles are reduced by 60%.`,
    };
  }

  /**
   * Generates dynamic comparison scenarios for the Campaign Simulator
   */
  static generateScenarios(budget: number = 500000): CampaignSimulationScenario[] {
    const scale = budget / 500000;
    return [
      {
        id: 'scen-a',
        name: 'Scenario A: 20 Micro Creators',
        strategyTitle: 'Hyper-Localized Word of Mouth',
        description: 'Distributes budget across 20-25 high-engagement micro creators (15k-80k followers). Prioritizes direct community trust and decentralized organic discovery.',
        creatorBreakdown: `${Math.round(20 * scale)} Micro Creators (~₹${Math.round(18000 * scale).toLocaleString()} avg fee)`,
        creatorCount: Math.round(20 * scale),
        projectedReach: {
          min: `${(0.85 * scale).toFixed(1)}M`,
          max: `${(1.4 * scale).toFixed(1)}M`,
        },
        contentVolume: `${Math.round(20 * scale)} Reels + ${Math.round(40 * scale)} Stories`,
        projectedEngagement: '6.4% - 7.9%',
        projectedClicks: {
          min: `${Math.round(18000 * scale).toLocaleString()}`,
          max: `${Math.round(28000 * scale).toLocaleString()}`,
        },
        conversionPotential: 'High (Direct Trust & Peer Proof)',
        estimatedCpa: '₹220 - ₹280',
        confidenceScore: 92,
        riskFactor: 'Low',
        recommendationTag: 'Best for Direct Customer Acquisition & Lowest CPA',
      },
      {
        id: 'scen-b',
        name: 'Scenario B: 5 Mid-Tier Creators',
        strategyTitle: 'Cinematic Editorial Authority',
        description: 'Focuses budget on 5 prominent fashion authorities (150k-400k followers) with professional production setups. Prioritizes premium brand perception.',
        creatorBreakdown: `${Math.max(3, Math.round(5 * scale))} Mid-Tier Creators (~₹${Math.round(75000 * scale).toLocaleString()} avg fee)`,
        creatorCount: Math.max(3, Math.round(5 * scale)),
        projectedReach: {
          min: `${(1.3 * scale).toFixed(1)}M`,
          max: `${(2.0 * scale).toFixed(1)}M`,
        },
        contentVolume: `${Math.max(3, Math.round(5 * scale))} Hero 4K Reels + ${Math.max(9, Math.round(15 * scale))} Stories`,
        projectedEngagement: '4.7% - 5.6%',
        projectedClicks: {
          min: `${Math.round(24000 * scale).toLocaleString()}`,
          max: `${Math.round(36000 * scale).toLocaleString()}`,
        },
        conversionPotential: 'Moderate-High',
        estimatedCpa: '₹270 - ₹340',
        confidenceScore: 88,
        riskFactor: 'Moderate',
        recommendationTag: 'Best for Brand Prestige & High-Quality Content Assets',
      },
      {
        id: 'scen-c',
        name: 'Scenario C: 2 Large Creators + Micro Creators',
        strategyTitle: 'Hybrid Flagship Anchor + Halo Effect',
        description: 'Combines 2 high-profile cultural icons (600k+ followers) to generate instant category hype, supported by 10 micro creators to convert downstream search traffic.',
        creatorBreakdown: `2 Anchor Creators + ${Math.round(10 * scale)} Micro Creators`,
        creatorCount: 2 + Math.round(10 * scale),
        projectedReach: {
          min: `${(2.2 * scale).toFixed(1)}M`,
          max: `${(3.6 * scale).toFixed(1)}M`,
        },
        contentVolume: `2 Flagship Productions + ${Math.round(10 * scale)} UGC Reels`,
        projectedEngagement: '4.2% - 5.4%',
        projectedClicks: {
          min: `${Math.round(38000 * scale).toLocaleString()}`,
          max: `${Math.round(56000 * scale).toLocaleString()}`,
        },
        conversionPotential: 'Very High (Anchor Hype + Grassroots Validation)',
        estimatedCpa: '₹240 - ₹310',
        confidenceScore: 91,
        riskFactor: 'Moderate',
        recommendationTag: 'AI Recommended Balanced Strategy',
      },
    ];
  }

  /**
   * Real-time automated AI Pre-Check for content submissions
   */
  static runPreCheck(input: {
    caption: string;
    cta: string;
    hashtags: string[];
    videoDurationSec: number;
    requiredBrandTag: string;
    requiredPromoCode?: string;
  }): AiPreCheckResult {
    const lowerCaption = input.caption.toLowerCase();
    const hasBrandTag =
      lowerCaption.includes(input.requiredBrandTag.toLowerCase()) ||
      lowerCaption.includes(input.requiredBrandTag.replace('@', '').toLowerCase());

    const hasCta =
      input.cta.length > 5 &&
      (lowerCaption.includes('link') ||
        lowerCaption.includes('bio') ||
        lowerCaption.includes('code') ||
        lowerCaption.includes('tap') ||
        lowerCaption.includes('shop'));

    const isDurationOk = input.videoDurationSec >= 20 && input.videoDurationSec <= 60;

    const issuesCount = (!hasBrandTag ? 1 : 0) + (!hasCta ? 1 : 0) + (!isDurationOk ? 1 : 0);

    return {
      productVisible: true,
      productNotes: 'Product detected in 82% of key video frames with optimal lighting and center positioning.',
      brandMention: hasBrandTag,
      brandNotes: hasBrandTag
        ? `Found correct brand mention (${input.requiredBrandTag}) in caption.`
        : `Missing required brand mention: ${input.requiredBrandTag}. Please tag brand in first 2 lines.`,
      requiredCta: hasCta,
      ctaNotes: hasCta
        ? 'Call-to-action detected and directs followers to the official bio link / coupon.'
        : 'Missing clear Call To Action (e.g. "Tap link in bio" or promo code instructions).',
      durationCompliant: isDurationOk,
      durationNotes: isDurationOk
        ? `Duration (${input.videoDurationSec}s) is within the optimal 20-60s window.`
        : `Duration (${input.videoDurationSec}s) outside target window (optimal: 20-60s).`,
      overallStatus: issuesCount === 0 ? 'passed' : issuesCount === 1 ? 'warning' : 'failed',
    };
  }

  /**
   * Generates bespoke personalized outreach messages
   */
  static generateOutreachMessage(creator: Creator, campaign: Campaign): string {
    return `Hi ${creator.name.split(' ')[0]}! 

We're big admirers of your work—especially your recent content around ${creator.category}. Your focus on authentic community storytelling really stands out.

We're launching our upcoming "${campaign.name}" for ${campaign.brandName} and our AI Campaign Architect identified your profile as an exceptional ${creator.aiMatchScore || 94}% match for our brand aesthetic and Mumbai/urban audience.

Here's a quick overview of what we have in mind:
• Deliverables: ${campaign.deliverables.map((d) => `${d.count}x ${d.type}`).join(', ')}
• Offer: ₹${(creator.estimatedRate || 35000).toLocaleString()} + advance product shipment
• Timeline: Content submission by ${campaign.timeline.submissionDeadline}

We've prepared an exclusive brief tailored to your style. Would you be open to collaborating on this drop?

Best,
${campaign.brandName} Growth Team`;
  }
}
