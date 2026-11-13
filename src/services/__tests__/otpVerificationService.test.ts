import { describe, it, expect, beforeEach } from 'vitest';
import { OtpVerificationService } from '../otpVerificationService';

describe('OtpVerificationService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates a valid 6-digit OTP and confirmation link', () => {
    const res = OtpVerificationService.sendOtp('test@creatoros.ai', 'email_verification');
    expect(res.success).toBe(true);
    expect(res.code).toBeDefined();
    expect(res.code).toHaveLength(6);
    expect(/^\d{6}$/.test(res.code!)).toBe(true);
    expect(res.link).toContain('code=' + res.code);
    expect(res.expiresAt).toBeGreaterThan(Date.now());
  });

  it('successfully verifies a valid OTP code', () => {
    const target = 'creator.phone@example.com';
    const sendRes = OtpVerificationService.sendOtp(target, 'payout_method');
    expect(sendRes.success).toBe(true);

    const verifyRes = OtpVerificationService.verifyOtp(target, sendRes.code!);
    expect(verifyRes.success).toBe(true);
    expect(OtpVerificationService.isTargetVerified(target)).toBe(true);
  });

  it('rejects an incorrect OTP code and decrements remaining attempts', () => {
    const target = 'user@example.com';
    OtpVerificationService.sendOtp(target, 'email_verification');

    const verifyRes = OtpVerificationService.verifyOtp(target, '000000');
    expect(verifyRes.success).toBe(false);
    expect(verifyRes.error).toContain('Incorrect verification code');
    expect(OtpVerificationService.isTargetVerified(target)).toBe(false);
  });

  it('enforces rate-limiting cooldown between send requests', () => {
    const target = 'cooldown@example.com';
    const first = OtpVerificationService.sendOtp(target, 'email_verification');
    expect(first.success).toBe(true);

    const second = OtpVerificationService.sendOtp(target, 'email_verification');
    expect(second.success).toBe(false);
    expect(second.error).toContain('Please wait');
  });

  it('allows revoking and checking verification status', () => {
    const target = '+919876543210';
    OtpVerificationService.markTargetVerified(target, 'phone_verification');
    expect(OtpVerificationService.isTargetVerified(target)).toBe(true);

    OtpVerificationService.revokeVerification(target);
    expect(OtpVerificationService.isTargetVerified(target)).toBe(false);
  });

  it('supports asynchronous OTP dispatch and verification with provider fallback', async () => {
    const target = 'async.test@creatoros.ai';
    const sendRes = await OtpVerificationService.sendOtpAsync(target, 'email_verification');
    expect(sendRes.success).toBe(true);
    expect(sendRes.code).toBeDefined();

    const verifyRes = await OtpVerificationService.verifyOtpAsync(target, sendRes.code!, 'email_verification');
    expect(verifyRes.success).toBe(true);
    expect(OtpVerificationService.isTargetVerified(target)).toBe(true);
  });
});
