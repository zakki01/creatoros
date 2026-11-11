import { describe, it, expect, beforeEach } from 'vitest';
import { FinanceService } from '../financeService';

describe('FinanceService Unit Tests', () => {
  const testUserId = 'user_test_fin_1001';

  beforeEach(() => {
    localStorage.clear();
  });

  describe('Validation Utilities', () => {
    it('validates Indian PAN formats accurately', () => {
      expect(FinanceService.validatePAN('ABCDE1234F')).toBe(true);
      expect(FinanceService.validatePAN('abcde1234f')).toBe(true); // Case-insensitive trim
      expect(FinanceService.validatePAN('ABCDE1234')).toBe(false); // Missing checksum letter
      expect(FinanceService.validatePAN('12345ABCDE')).toBe(false); // Wrong positions
      expect(FinanceService.validatePAN('ABCDEF1234')).toBe(false);
      expect(FinanceService.validatePAN('')).toBe(false);
    });

    it('masks PAN identifiers securely for client presentation', () => {
      expect(FinanceService.maskPAN('ABCDE1234F')).toBe('ABCDE****F');
      expect(FinanceService.maskPAN('abcde1234f')).toBe('ABCDE****F');
      expect(FinanceService.maskPAN('SHORT')).toBe('**********');
    });

    it('validates Indian GSTIN formats correctly', () => {
      // 15 chars: 2 state digits + 10 PAN chars + 1 entity digit + 'Z' + 1 checksum
      expect(FinanceService.validateGSTIN('27ABCDE1234F1Z5')).toBe(true);
      expect(FinanceService.validateGSTIN('07AAAAA0000A1Z5')).toBe(true);
      expect(FinanceService.validateGSTIN('27ABCDE1234F15')).toBe(false); // Too short
      expect(FinanceService.validateGSTIN('')).toBe(false);
    });

    it('validates UPI Virtual Payment Address (VPA) correctly', () => {
      expect(FinanceService.validateUPI('creator@okhdfcbank')).toBe(true);
      expect(FinanceService.validateUPI('first.last@upi')).toBe(true);
      expect(FinanceService.validateUPI('user_name-123@icici')).toBe(true);
      expect(FinanceService.validateUPI('plain_identifier')).toBe(false); // No @
      expect(FinanceService.validateUPI('@okhdfcbank')).toBe(false); // Missing handle
      expect(FinanceService.validateUPI('creator@')).toBe(false); // Missing provider
      expect(FinanceService.validateUPI('')).toBe(false);
    });

    it('validates email addresses for PayPal accounts', () => {
      expect(FinanceService.validateEmail('creator@example.com')).toBe(true);
      expect(FinanceService.validateEmail('creator.finance@domain.co.uk')).toBe(true);
      expect(FinanceService.validateEmail('invalid-email')).toBe(false);
      expect(FinanceService.validateEmail('')).toBe(false);
    });
  });

  describe('Payout Profile Persistence', () => {
    it('saves and retrieves personal/business payout profiles', async () => {
      const res = await FinanceService.savePayoutProfile(testUserId, {
        legalName: 'Aarav Sharma',
        displayName: 'Aarav Tech',
        country: 'IN',
        accountType: 'individual',
        email: 'aarav@creatoros.test',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
      });

      expect(res.success).toBe(true);
      expect(res.profile?.legalName).toBe('Aarav Sharma');

      const loaded = await FinanceService.getPayoutProfile(testUserId);
      expect(loaded).not.toBeNull();
      expect(loaded?.legalName).toBe('Aarav Sharma');
      expect(loaded?.city).toBe('Bengaluru');
    });

    it('rejects profiles with invalid legal names or invalid emails', async () => {
      const res1 = await FinanceService.savePayoutProfile(testUserId, {
        legalName: 'A', // Too short
        country: 'IN',
        accountType: 'individual',
        email: 'valid@example.com',
      });
      expect(res1.success).toBe(false);

      const res2 = await FinanceService.savePayoutProfile(testUserId, {
        legalName: 'Valid Name',
        country: 'IN',
        accountType: 'individual',
        email: 'not-an-email',
      });
      expect(res2.success).toBe(false);
    });
  });

  describe('Payment Methods Management', () => {
    it('adds and enforces preferred payout methods', async () => {
      const addRes = await FinanceService.addPaymentMethod(testUserId, {
        providerType: 'upi',
        identifier: 'aarav@okhdfcbank',
      });

      expect(addRes.success).toBe(true);
      expect(addRes.method?.identifier).toBe('aarav@okhdfcbank');
      expect(addRes.method?.isPreferred).toBe(true); // First method becomes preferred automatically

      const methods = await FinanceService.getPaymentMethods(testUserId);
      expect(methods.length).toBe(1);
      expect(methods[0].providerType).toBe('upi');
    });

    it('prevents adding invalid identifiers for specified payment types', async () => {
      const badUpi = await FinanceService.addPaymentMethod(testUserId, {
        providerType: 'upi',
        identifier: 'bad_upi_string',
      });
      expect(badUpi.success).toBe(false);

      const badPaypal = await FinanceService.addPaymentMethod(testUserId, {
        providerType: 'paypal',
        identifier: 'not-an-email',
      });
      expect(badPaypal.success).toBe(false);
    });
  });

  describe('Tax Profile Compliance', () => {
    it('persists encrypted/masked tax profiles and billing addresses', async () => {
      const saveRes = await FinanceService.saveTaxProfile(testUserId, {
        country: 'IN',
        taxIdType: 'pan',
        taxId: 'ABCDE1234F',
        legalBusinessName: 'Aarav Sharma Tech',
        taxResidency: 'India',
        classification: 'individual',
        billingAddress: {
          addressLine1: 'MG Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'IN',
        },
      });

      expect(saveRes.success).toBe(true);
      expect(saveRes.profile?.taxIdMasked).toBe('ABCDE****F');

      const loaded = await FinanceService.getTaxProfile(testUserId);
      expect(loaded?.taxIdMasked).toBe('ABCDE****F');
      expect(loaded?.billingAddress.city).toBe('Bengaluru');
    });
  });

  describe('Identity Verification & Payout Eligibility State Machine', () => {
    it('enforces KYC submission before payout requests can be created', async () => {
      // 1. Attempt payout before KYC
      const failReq = await FinanceService.requestPayout(testUserId, {
        contractId: 'contract_100',
        amount: 250,
      });
      expect(failReq.success).toBe(false);
      expect(failReq.error).toContain('Identity verification is required');

      // 2. Submit KYC documents
      const kycRes = await FinanceService.submitIdentityVerification(testUserId, {
        idType: 'passport',
        idNumber: 'Z12345678',
      });
      expect(kycRes.success).toBe(true);
      expect(kycRes.record?.status).toBe('IN_REVIEW');

      // 3. Payout still blocked until VERIFIED status
      const stillBlocked = await FinanceService.requestPayout(testUserId, {
        contractId: 'contract_100',
        amount: 250,
      });
      expect(stillBlocked.success).toBe(false);
    });

    it('allows payouts when KYC is verified and a valid method exists', async () => {
      // Add valid method
      await FinanceService.addPaymentMethod(testUserId, {
        providerType: 'upi',
        identifier: 'aarav@okhdfcbank',
      });

      // Manually set KYC to VERIFIED in local fallback
      const kycRecord = {
        id: 'kyc_verified_1',
        userId: testUserId,
        idType: 'passport',
        status: 'VERIFIED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`creatoros_finance_kyc_${testUserId}`, JSON.stringify(kycRecord));

      const payout = await FinanceService.requestPayout(testUserId, {
        contractId: 'contract_101',
        amount: 500,
      });

      expect(payout.success).toBe(true);
      expect(payout.request?.status).toBe('PAYOUT_REQUESTED');
      expect(payout.request?.amount).toBe(500);
      expect(payout.request?.recipientIdentifier).toBe('aarav@okhdfcbank');
    });
  });

  describe('Admin Financial Governance (Godmode)', () => {
    it('approves UPI manual payout with bank UTR and records audit state', async () => {
      // Seed a payout request
      const payoutItem = {
        id: 'req_test_gov_1',
        contractId: 'cnt_123',
        creatorId: testUserId,
        amount: 300,
        currency: 'USD',
        methodType: 'upi' as const,
        recipientIdentifier: 'creator@upi',
        status: 'PAYOUT_REQUESTED' as const,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        `creatoros_finance_payout_reqs_${testUserId}`,
        JSON.stringify([payoutItem])
      );

      // Approve with bank UTR
      const utr = 'HDFC000192837465';
      const approveRes = await FinanceService.adminApproveUpiPayout('req_test_gov_1', utr, 'super_admin');
      expect(approveRes.success).toBe(true);

      const all = await FinanceService.getAllPayoutsAdmin();
      const updated = all.find((p) => p.id === 'req_test_gov_1');
      expect(updated?.status).toBe('PAYOUT_COMPLETED');
      expect(updated?.manualUtrReference).toBe(utr);
    });

    it('rejects payout with justification when required', async () => {
      const payoutItem = {
        id: 'req_test_gov_2',
        contractId: 'cnt_124',
        creatorId: testUserId,
        amount: 150,
        currency: 'USD',
        methodType: 'upi' as const,
        recipientIdentifier: 'invalid@upi',
        status: 'PAYOUT_REQUESTED' as const,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        `creatoros_finance_payout_reqs_${testUserId}`,
        JSON.stringify([payoutItem])
      );

      const rejectRes = await FinanceService.adminRejectPayout(
        'req_test_gov_2',
        'VPA does not accept business nodal payments',
        'super_admin'
      );
      expect(rejectRes.success).toBe(true);

      const all = await FinanceService.getAllPayoutsAdmin();
      const updated = all.find((p) => p.id === 'req_test_gov_2');
      expect(updated?.status).toBe('PAYOUT_FAILED');
      expect(updated?.failureReason).toBe('VPA does not accept business nodal payments');
    });
  });
});
