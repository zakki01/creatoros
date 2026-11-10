import { describe, it, expect, beforeEach } from 'vitest';
import { betaAccessService } from '../betaAccessService';

describe('BetaAccessService', () => {
  beforeEach(() => {
    localStorage.clear();
    (betaAccessService as any).initialized = false;
    (betaAccessService as any).initDefaults();
  });

  describe('Invite Code Validation', () => {
    it('validates default master invite code ALPHA-2026', () => {
      const result = betaAccessService.validateInviteCode('ALPHA-2026', 'creator');
      expect(result.valid).toBe(true);
      expect(result.code).toBe('ALPHA-2026');
      expect(result.badge).toBe('Founding Creator');
    });

    it('rejects nonexistent or empty invite codes', () => {
      const emptyResult = betaAccessService.validateInviteCode('', 'creator');
      expect(emptyResult.valid).toBe(false);
      expect(emptyResult.error).toContain('Invite code is required');

      const invalidResult = betaAccessService.validateInviteCode('FAKE-CODE-999', 'creator');
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.error).toContain('Invalid or unrecognized invite code');
    });

    it('enforces role constraints (e.g. brand code cannot be used by creator)', () => {
      const result = betaAccessService.validateInviteCode('BRAND-VIP', 'creator');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('This invite code is reserved for brand accounts');

      const brandResult = betaAccessService.validateInviteCode('BRAND-VIP', 'business');
      expect(brandResult.valid).toBe(true);
      expect(brandResult.badge).toBe('Alpha Brand Partner');
    });

    it('enforces maximum redemption limits', () => {
      // Create single-use code
      betaAccessService.generateInviteCode({
        code: 'SINGLE-USE-1',
        roleConstraint: 'all',
        maxUses: 1,
      });

      // 1st redemption succeeds
      const r1 = betaAccessService.redeemInviteCode('SINGLE-USE-1', 'user_1', 'u1@test.com');
      expect(r1.success).toBe(true);

      // 2nd redemption fails due to exhaustion
      const r2 = betaAccessService.validateInviteCode('SINGLE-USE-1', 'creator');
      expect(r2.valid).toBe(false);
      expect(r2.error).toContain('maximum redemption limit');
    });

    it('rejects expired invite codes', () => {
      betaAccessService.generateInviteCode({
        code: 'EXPIRED-CODE',
        roleConstraint: 'all',
        maxUses: 10,
        expiresAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      });

      const result = betaAccessService.validateInviteCode('EXPIRED-CODE', 'creator');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('has expired');
    });
  });

  describe('Waitlist Management', () => {
    it('submits waitlist applicant and returns queue position', () => {
      const entry = betaAccessService.submitWaitlist({
        fullName: 'Aarav Mehta',
        email: 'aarav@fashion.com',
        role: 'creator',
        handle: '@aaravfashion',
        category: 'Streetwear',
      });

      expect(entry.id).toBeDefined();
      expect(entry.status).toBe('pending');

      const waitlist = betaAccessService.getWaitlist();
      expect(waitlist.some((w) => w.email === 'aarav@fashion.com')).toBe(true);
    });

    it('prevents duplicate submissions with same email', () => {
      betaAccessService.submitWaitlist({
        fullName: 'Zara Khan',
        email: 'zara@style.com',
        role: 'creator',
        handle: '@zarastyle',
        category: 'Lifestyle',
      });

      expect(() => {
        betaAccessService.submitWaitlist({
          fullName: 'Zara Khan',
          email: 'zara@style.com',
          role: 'creator',
          handle: '@zarastyle',
          category: 'Lifestyle',
        });
      }).toThrow('already registered on the private beta waitlist');
    });

    it('allows admin to approve waitlist entry and issue unique invite code', () => {
      const entry = betaAccessService.submitWaitlist({
        fullName: 'Kabir Verma',
        email: 'kabir@brand.com',
        role: 'business',
        handle: '@kabirbrand',
        category: 'Footwear',
      });

      const approval = betaAccessService.approveWaitlistEntry(entry.id);
      expect(approval.success).toBe(true);
      expect(approval.inviteCode).toBeDefined();

      // Verify the generated code can be redeemed
      const check = betaAccessService.validateInviteCode(approval.inviteCode!, 'business');
      expect(check.valid).toBe(true);
    });
  });
});
