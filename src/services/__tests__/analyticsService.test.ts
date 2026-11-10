import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCreatorAnalytics, exportCreatorAnalyticsKit } from '../analyticsService';
import { Creator, PaymentMilestone } from '../../types';
import { SocialPost } from '../../types/socialFeed';
import { ContractService } from '../contractService';

describe('AnalyticsService', () => {
  beforeEach(() => {
    localStorage.clear();
    (ContractService as any).contracts = null;
  });

  const freshCreator: Creator = {
    id: 'creator_new_user',
    name: 'New Creator',
    handle: '@newcreator',
    avatar: '',
    category: 'Digital Art',
    followers: '0',
    engagementRate: 0,
    totalFollowers: 0,
    avgEngagement: 0,
    estimatedRate: 0,
    portfolio: [],
    platforms: [],
    languages: [],
    verified: false,
    verifiedBadges: [],
    pastCampaignsCount: 0,
    testimonials: [],
  };

  describe('Truthful Zero Baseline (No Manufactured Metrics)', () => {
    it('returns honest empty metrics and dashes when creator has no posts, contracts, or portfolio', () => {
      const analytics = getCreatorAnalytics(freshCreator, [], []);

      expect(analytics.hasData).toBe(false);
      expect(analytics.views).toBe(0);
      expect(analytics.viewsFormatted).toBe('—');
      expect(analytics.engagementFormatted).toBe('—');
      expect(analytics.linkClicksFormatted).toBe('—');
      expect(analytics.conversionsFormatted).toBe('—');
      expect(analytics.earned).toBe(0);
      expect(analytics.earnedFormatted).toBe('₹0');
      expect(analytics.timeSeries.every((w) => w.value === 0)).toBe(true);
      expect(analytics.topDeliverables).toHaveLength(0);
    });
  });

  describe('Data-Driven Metrics Calculation', () => {
    it('derives views, engagement, and earnings truthfully from social posts and paid contracts', () => {
      const activeCreator: Creator = {
        ...freshCreator,
        id: 'creator_active_01',
        handle: '@fashion_active',
        totalFollowers: 10000,
        avgEngagement: 4.5,
        portfolio: [
          {
            id: 'port-1',
            title: '4K Lookbook',
            type: 'video',
            views: 45000,
            engagement: 2500,
            thumbnail: 'thumb.jpg',
          },
        ],
      };

      const posts: SocialPost[] = [
        {
          id: 'post-1',
          authorId: 'creator_active_01',
          authorName: 'Active Creator',
          authorHandle: '@fashion_active',
          authorAvatar: '',
          content: 'My latest reel',
          mediaType: 'video',
          likes: 500,
          commentsCount: 50,
          sharesCount: 20,
          createdAt: new Date().toISOString(),
        },
      ];

      // Save a completed contract into localStorage
      const completedContract = {
        id: 'cnt-paid-1',
        creatorId: 'creator_active_01',
        status: 'completed',
        projectName: 'Summer Denim Drop',
        payment: {
          creatorPayment: 45000,
          platformFee: 4500,
          protectionAmount: 9000,
          totalAmount: 58500,
          currency: 'INR',
          provider: 'stripe',
          paymentStatus: 'paid_out',
        },
      };
      localStorage.setItem('creatoros_contracts_v2', JSON.stringify([completedContract]));

      const payments: PaymentMilestone[] = [
        {
          id: 'pay-1',
          contractId: 'cnt-paid-1',
          creatorId: 'creator_active_01',
          amount: 15000,
          currency: 'INR',
          status: 'paid',
          title: 'Advance',
        } as any,
      ];

      const analytics = getCreatorAnalytics(activeCreator, posts, payments);

      expect(analytics.hasData).toBe(true);
      expect(analytics.views).toBeGreaterThan(45000);
      expect(analytics.viewsFormatted).toMatch(/(K|M)/);
      expect(analytics.engagementRate).toBeGreaterThan(0);
      expect(analytics.earned).toBe(60000); // 45k from contract + 15k from milestone payment
      expect(analytics.earnedFormatted).toBe('₹60.0K');
      expect(analytics.topDeliverables.length).toBeGreaterThan(0);
    });
  });

  describe('Export Kit (JSON & CSV)', () => {
    it('generates downloadable JSON without throwing and uses DOM anchor download', () => {
      const analytics = getCreatorAnalytics(freshCreator, [], []);
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      expect(() => exportCreatorAnalyticsKit(analytics, freshCreator, 'json')).not.toThrow();
      expect(clickSpy).toHaveBeenCalled();

      clickSpy.mockRestore();
    });

    it('generates downloadable CSV with valid header structure', () => {
      const analytics = getCreatorAnalytics(freshCreator, [], []);
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      expect(() => exportCreatorAnalyticsKit(analytics, freshCreator, 'csv')).not.toThrow();
      expect(clickSpy).toHaveBeenCalled();

      clickSpy.mockRestore();
    });
  });
});
