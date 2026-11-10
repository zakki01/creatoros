import { describe, it, expect } from 'vitest';
import { getSafeCurrentCreator, DEMO_CREATOR_PROFILE } from '../demoFixtures';
import { Creator } from '../../types';

describe('DemoFixtures & Identity Boundary Isolation', () => {
  const existingCreators: Creator[] = [
    {
      id: 'creator_alice_123',
      name: 'Alice Wonder',
      handle: '@alicewonder',
      avatar: 'https://images.unsplash.com/alice.jpg',
      category: 'Streetwear',
      followers: '50K',
      totalFollowers: 50000,
      engagementRate: 5.1,
      avgEngagement: 5.1,
      estimatedRate: 35000,
      bio: 'Fashion creator based in Mumbai',
      location: 'Mumbai',
      languages: ['English'],
      platforms: [],
      rateCard: {},
      verified: true,
      verifiedBadges: ['Verified Creator'],
      reliabilityMetrics: {
        onTimeDelivery: 99,
        briefCompliance: 98,
        communication: 95,
        contentQuality: 98,
        campaignPerformance: 96,
        responseReliability: 97,
      },
      audienceBreakdown: {
        topLocations: [],
        ageSplit: [],
        genderSplit: { male: 50, female: 50, other: 0 },
      },
      pastCampaignsCount: 4,
      testimonials: [],
      portfolio: [],
    },
    {
      id: 'creator_bob_456',
      name: 'Bob Builder',
      handle: '@bobbuilder',
      avatar: 'https://images.unsplash.com/bob.jpg',
      category: 'Design',
      followers: '20K',
      totalFollowers: 20000,
      engagementRate: 3.2,
      avgEngagement: 3.2,
      estimatedRate: 15000,
      bio: 'Design enthusiast',
      location: 'Bengaluru',
      languages: ['English'],
      platforms: [],
      rateCard: {},
      verified: false,
      verifiedBadges: [],
      reliabilityMetrics: {
        onTimeDelivery: 90,
        briefCompliance: 90,
        communication: 90,
        contentQuality: 90,
        campaignPerformance: 90,
        responseReliability: 90,
      },
      audienceBreakdown: {
        topLocations: [],
        ageSplit: [],
        genderSplit: { male: 50, female: 50, other: 0 },
      },
      pastCampaignsCount: 1,
      testimonials: [],
      portfolio: [],
    },
  ];

  describe('getSafeCurrentCreator', () => {
    it('accurately resolves to the authenticated user matching their user ID', () => {
      const authUser = {
        id: 'creator_bob_456',
        name: 'Bob Builder',
        handle: '@bobbuilder',
      };

      const resolved = getSafeCurrentCreator(existingCreators, undefined, authUser);
      expect(resolved.id).toBe('creator_bob_456');
      expect(resolved.name).toBe('Bob Builder');
      expect(resolved.handle).toBe('@bobbuilder');
    });

    it('NEVER defaults to creators[0] when an authenticated user has no prior record', () => {
      const freshUser = {
        id: 'user_fresh_789',
        name: 'Charlie Fresh',
        handle: '@charliefresh',
        avatarUrl: 'https://images.unsplash.com/charlie.jpg',
      };

      const resolved = getSafeCurrentCreator(existingCreators, undefined, freshUser);

      // Must NOT be Alice (creators[0]) or Bob (creators[1])
      expect(resolved.id).toBe('user_fresh_789');
      expect(resolved.name).toBe('Charlie Fresh');
      expect(resolved.handle).toBe('@charliefresh');
      expect(resolved.followers).toBe('0');
      expect(resolved.totalFollowers).toBe(0);
      expect(resolved.engagementRate).toBe(0);
      expect(resolved.verified).toBe(false);
      expect(resolved.verifiedBadges).toEqual([]);
    });

    it('handles empty input arguments safely without throwing', () => {
      const resolved = getSafeCurrentCreator([], undefined, null);
      expect(resolved.id).toBe('');
      expect(resolved.name).toBe('Creator');
      expect(resolved.handle).toBe('@creator');
      expect(resolved.totalFollowers).toBe(0);
    });
  });
});
