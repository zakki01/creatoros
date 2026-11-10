import { describe, it, expect } from 'vitest';
import { trustSafetyService } from '../trustSafetyService';

describe('TrustSafetyService', () => {
  describe('18+ Age Verification Engine', () => {
    it('approves users who are 18 years or older', () => {
      // 25 years ago
      const dob25 = new Date();
      dob25.setFullYear(dob25.getFullYear() - 25);
      const dobStr = dob25.toISOString().split('T')[0];

      const result = trustSafetyService.verifyAge(dobStr);
      expect(result.success).toBe(true);
      expect(result.is18Plus).toBe(true);
      expect(result.age).toBe(25);
      expect(result.message).toContain('successfully approved');
    });

    it('strictly rejects underage users (< 18)', () => {
      // 15 years ago
      const dob15 = new Date();
      dob15.setFullYear(dob15.getFullYear() - 15);
      const dobStr = dob15.toISOString().split('T')[0];

      const result = trustSafetyService.verifyAge(dobStr);
      expect(result.success).toBe(false);
      expect(result.is18Plus).toBe(false);
      expect(result.age).toBe(15);
      expect(result.message).toContain('strictly an 18+ platform');
    });

    it('rejects invalid or missing dates gracefully', () => {
      const emptyResult = trustSafetyService.verifyAge('');
      expect(emptyResult.success).toBe(false);
      expect(emptyResult.is18Plus).toBe(false);

      const invalidResult = trustSafetyService.verifyAge('not-a-real-date');
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.message).toContain('Invalid date');
    });
  });

  describe('Automated Media Safety & Policy Scanner', () => {
    it('blocks uploads with child safety or minor risk keywords', () => {
      const result = trustSafetyService.scanMedia('summer_kid_shoot.mp4');
      expect(result.status).toBe('block');
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.flags).toContain('Child Safety / Potential Minor Risk');
    });

    it('blocks uploads with explicit adult / NSFW keywords', () => {
      const result = trustSafetyService.scanMedia('nude_art_photo.jpg');
      expect(result.status).toBe('block');
      expect(result.confidence).toBeGreaterThan(0.95);
      expect(result.flags).toContain('NSFW Content');
    });

    it('flags borderline content for human moderation review', () => {
      const result = trustSafetyService.scanMedia('flagged_review_video.mp4');
      expect(result.status).toBe('human_review');
      expect(result.flags).toContain('Brand Safety Review');
    });

    it('allows clean, compliant media assets', () => {
      const result = trustSafetyService.scanMedia('cinematic_lookbook_autumn.mp4');
      expect(result.status).toBe('allow');
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.flags).toContain('Clean');
      expect(result.flags).toContain('18+ Verified');
    });
  });

  describe('Baseline Verification Profiles', () => {
    it('provides verified badges for compliant creator baseline', () => {
      const profile = trustSafetyService.getInitialCreatorVerification();
      expect(profile.ageVerified).toBe(true);
      expect(profile.identityVerified).toBe(true);
      expect(profile.verifiedBadges).toContain('18+ Verified');
    });

    it('provides business verification badges for brands', () => {
      const profile = trustSafetyService.getInitialBusinessVerification();
      expect(profile.businessVerified).toBe(true);
      expect(profile.verifiedBadges).toContain('Business Verified');
      expect(profile.verifiedBadges).toContain('Escrow Approved');
    });
  });
});
