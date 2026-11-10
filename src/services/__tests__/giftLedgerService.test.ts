import { describe, it, expect, beforeEach } from 'vitest';
import {
  GiftLedgerService,
  COIN_PACKAGES,
  VIRTUAL_GIFTS_CATALOG,
} from '../giftLedgerService';

describe('GiftLedgerService', () => {
  beforeEach(() => {
    localStorage.clear();
    (GiftLedgerService as any).initialSetupDone = false;
    (GiftLedgerService as any).ensureSeedData();
  });

  describe('Catalog & Packages', () => {
    it('provides standard coin packages with valid pricing and coin values', () => {
      expect(COIN_PACKAGES.length).toBeGreaterThanOrEqual(4);
      COIN_PACKAGES.forEach((pkg) => {
        expect(pkg.id).toBeDefined();
        expect(pkg.coins).toBeGreaterThan(0);
        expect(pkg.priceUsd).toBeGreaterThan(0);
      });
    });

    it('contains diverse virtual gifts with calibrated coin costs', () => {
      expect(VIRTUAL_GIFTS_CATALOG.length).toBeGreaterThanOrEqual(5);
      VIRTUAL_GIFTS_CATALOG.forEach((gift) => {
        expect(gift.id).toBeDefined();
        expect(gift.coinCost).toBeGreaterThan(0);
        expect(['common', 'rare', 'epic', 'legendary']).toContain(gift.rarity);
      });
    });
  });

  describe('Ledger Double-Entry Operations', () => {
    it('credits user account upon verified coin purchase', async () => {
      const userId = 'creator_test_ledger_user';
      const initialBalance = GiftLedgerService.getUserCoinBalance(userId);
      expect(initialBalance).toBe(0);

      const starterPack = COIN_PACKAGES[0];
      const entry = await GiftLedgerService.purchaseCoins(userId, starterPack.id, 'pi_stripe_pack_test');

      expect(entry.amount).toBe(starterPack.coins + starterPack.bonusCoins);
      expect(entry.balanceAfter).toBe(starterPack.coins + starterPack.bonusCoins);

      const currentBalance = GiftLedgerService.getUserCoinBalance(userId);
      expect(currentBalance).toBe(starterPack.coins + starterPack.bonusCoins);
    });

    it('throws error when attempting to purchase with invalid package ID', async () => {
      await expect(
        GiftLedgerService.purchaseCoins('user_test', 'nonexistent_pack', 'pi_test')
      ).rejects.toThrow('Invalid coin package selected.');
    });

    it('sends virtual gift, debiting sender and crediting creator rewards with platform fee margin', async () => {
      const senderId = 'sender_user_01';
      const recipientId = 'creator_recipient_01';

      // 1. Fund sender with coins
      await GiftLedgerService.purchaseCoins(senderId, 'coin-pack-creator', 'pi_test_funding'); // 600 coins
      const balanceBefore = GiftLedgerService.getUserCoinBalance(senderId);

      const gift = VIRTUAL_GIFTS_CATALOG.find((g) => g.id === 'gift-rose')!; // 10 coins
      expect(gift).toBeDefined();

      // 2. Send gift
      const result = await GiftLedgerService.sendGift({
        senderId,
        senderName: 'Test Fan',
        recipientId,
        recipientName: 'Star Creator',
        giftId: gift.id,
        liveSessionId: 'session_live_101',
      });

      expect(result.remainingBalance).toBe(balanceBefore - gift.coinCost);
      expect(result.transaction.coinAmount).toBe(gift.coinCost);
      expect(result.transaction.creatorEarningUsd).toBeGreaterThan(0);
      expect(result.transaction.platformFeeUsd).toBeGreaterThan(0);

      // Verify recipient earnings tally
      const creatorTotalUsd = GiftLedgerService.getCreatorRewardBalanceUsd(recipientId);
      expect(creatorTotalUsd).toBe(result.transaction.creatorEarningUsd);
    });

    it('rejects gift sending if sender has insufficient coin balance', async () => {
      const brokeSenderId = 'broke_fan_01';
      const expensiveGift = VIRTUAL_GIFTS_CATALOG.find((g) => g.id === 'gift-rocket')!; // 1000 coins

      await expect(
        GiftLedgerService.sendGift({
          senderId: brokeSenderId,
          senderName: 'Broke Fan',
          recipientId: 'creator_01',
          recipientName: 'Creator',
          giftId: expensiveGift.id,
        })
      ).rejects.toThrow('Insufficient CreatorOS Coins');
    });
  });
});
