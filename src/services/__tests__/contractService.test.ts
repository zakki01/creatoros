import { describe, it, expect, beforeEach } from 'vitest';
import { ContractService } from '../contractService';
import { BrandContract } from '../../types/contract';

describe('ContractService', () => {
  beforeEach(() => {
    localStorage.clear();
    (ContractService as any).contracts = null;
    (ContractService as any).adminConfig = null;
  });

  describe('Financial Calculations & Fee Breakdown', () => {
    it('accurately calculates platform commission, protection hold, and brand total from creator payment', () => {
      // Creator payment 1000 USD
      const breakdown = ContractService.calculatePaymentBreakdown(1000, 'USD', 'stripe');

      expect(breakdown.creatorPayment).toBe(1000);
      expect(breakdown.platformFeeRate).toBe(0.1); // 10%
      expect(breakdown.platformFee).toBe(100);
      expect(breakdown.protectionAmountRate).toBe(0); // 0% holding fee
      expect(breakdown.protectionAmount).toBe(0);
      expect(breakdown.totalAmount).toBe(1000); // 1000 held in escrow at 0% holding fee
      expect(breakdown.currency).toBe('USD');
      expect(breakdown.provider).toBe('stripe');
      expect(breakdown.paymentStatus).toBe('unfunded');
    });

    it('handles zero creator payment rates cleanly without charging fees', () => {
      const breakdown = ContractService.calculatePaymentBreakdown(0, 'USD', 'stripe');
      expect(breakdown.creatorPayment).toBe(0);
      expect(breakdown.platformFee).toBe(0);
      expect(breakdown.totalAmount).toBe(0);
    });
  });

  describe('Automated Contract Risk Scanner', () => {
    it('flags contracts with missing deliverables, unlimited revisions, and zero compensation as critical', () => {
      const highRiskContract: Partial<BrandContract> = {
        projectName: '',
        deliverables: [],
        terms: {
          includedRevisions: 0, // unlimited
          reviewPeriodDays: 3,
          creatorResponseDeadlineDays: 3,
          cancellationTerms: '',
          lateDeliveryTerms: '',
          additionalWorkTerms: '',
          confidentiality: true,
          communicationGuidelines: '',
        },
      };

      const warnings = ContractService.scanContractRisks(highRiskContract);
      const severities = warnings.map((w) => w.severity);
      expect(severities).toContain('critical');

      const codes = warnings.map((w) => w.code);
      expect(codes).toContain('UNLIMITED_REVISIONS');
      expect(codes).toContain('MISSING_DELIVERABLES');
    });

    it('passes low-risk, well-specified contracts without critical flags', () => {
      const safeContract: Partial<BrandContract> = {
        projectName: 'Q4 Lookbook Video Campaign',
        payment: {
          creatorPayment: 5000,
          platformFeeRate: 0.1,
          platformFee: 500,
          protectionAmountRate: 0.2,
          protectionAmount: 1000,
          totalAmount: 6500,
          currency: 'USD',
          provider: 'stripe',
          paymentStatus: 'escrow_funded',
        },
        deliverables: [
          {
            id: 'del-1',
            type: 'Reel',
            title: '4K Cinematic Reel',
            quantity: 1,
            aspectRatio: '9:16',
            format: '4K MP4',
            requirements: ['Include product showcase', 'Brand logo in first 3s'],
            dueDate: '2026-12-15',
            status: 'pending',
          },
        ],
        terms: {
          includedRevisions: 2,
          reviewPeriodDays: 3,
          creatorResponseDeadlineDays: 3,
          cancellationTerms: '50% compensation for submitted work.',
          lateDeliveryTerms: '5% per day past milestone.',
          additionalWorkTerms: 'Formal amendment required for extra edits.',
          confidentiality: true,
          communicationGuidelines: 'Official communications via CreatorOS workspace.',
        },
      };

      const warnings = ContractService.scanContractRisks(safeContract);
      const criticalRisks = warnings.filter((w) => w.severity === 'critical');
      expect(criticalRisks.length).toBe(0);
    });
  });

  describe('Contract Lifecycle State Transitions', () => {
    it('executes draft creation -> send -> accept -> fund -> submit deliverable -> approve -> complete', async () => {
      // 1. Create Draft
      const draft = ContractService.saveDraft({
        projectName: 'Summer Fashion Drop',
        brandId: 'brand_aurastyle',
        brandName: 'Aura Style',
        creatorId: 'creator_zakki',
        creatorName: 'Zakki Salim',
        deliverables: [
          {
            id: 'del-101',
            type: 'Reel',
            title: 'Main Showcase Reel',
            quantity: 1,
            aspectRatio: '9:16',
            dueDate: '2026-12-20',
            requirements: ['Feature denim collection'],
            status: 'pending',
          },
        ],
      });

      expect(draft.id).toBeDefined();
      expect(draft.status).toBe('draft');

      // 2. Send Contract to Creator
      const sendResult = ContractService.sendContract(draft.id);
      expect(sendResult.success).toBe(true);
      expect(sendResult.contract?.status).toBe('awaiting_creator');

      // 3. Creator Accepts Contract
      const acceptResult = ContractService.acceptContract(draft.id);
      expect(acceptResult.success).toBe(true);
      expect(acceptResult.contract?.status).toBe('active');

      // 4. Brand Funds Escrow
      const fundResult = await ContractService.fundContract(draft.id, 'stripe');
      expect(fundResult.success).toBe(true);
      expect(fundResult.contract?.payment.paymentStatus).toBe('escrow_funded');

      // 5. Creator Submits Deliverable
      const submitResult = ContractService.submitDeliverable(
        draft.id,
        'del-101',
        'Here is the final cut in 4K 60fps.',
        [
          {
            id: 'file-1',
            name: 'showcase_4k.mp4',
            size: 25000000,
            url: 'https://cdn.creatoros.ai/deliverables/video1.mp4',
            type: 'video',
            uploadedAt: new Date().toISOString(),
          },
        ]
      );
      expect(submitResult.success).toBe(true);
      expect(submitResult.contract?.status).toBe('client_review');

      // 6. Brand Approves Deliverable & Triggers Payout
      const approveResult = await ContractService.approveDeliverable(draft.id, 'del-101');
      expect(approveResult.success).toBe(true);
      expect(approveResult.contract?.status).toBe('completed');
      expect(approveResult.contract?.payment.paymentStatus).toBe('paid');
    });

    it('handles revision request loop appropriately', () => {
      const draft = ContractService.saveDraft({
        projectName: 'Accessory Feature',
        brandId: 'brand_01',
        creatorId: 'creator_01',
        deliverables: [
          {
            id: 'del-acc',
            type: 'Reel',
            title: 'Accessory Reel',
            quantity: 1,
            aspectRatio: '9:16',
            dueDate: '2026-12-10',
            requirements: ['Show jewelry in natural sunlight'],
            status: 'pending',
          },
        ],
      });

      ContractService.sendContract(draft.id);
      ContractService.acceptContract(draft.id);

      // Submit deliverable
      ContractService.submitDeliverable(draft.id, 'del-acc', 'Draft cut', [
        {
          id: 'file-acc',
          name: 'rough.mp4',
          size: 10000000,
          url: 'https://cdn.creatoros.ai/rough.mp4',
          type: 'video',
          uploadedAt: new Date().toISOString(),
        },
      ]);

      // Brand requests revision
      const revisionResult = ContractService.requestRevision(
        draft.id,
        'del-acc',
        'Please adjust color grading and re-record voiceover.'
      );

      expect(revisionResult.success).toBe(true);
      expect(revisionResult.contract?.status).toBe('revision_requested');
    });

    it('supports dispute escalation and administrative resolution', async () => {
      const contract = ContractService.saveDraft({
        projectName: 'Disputed Partnership',
        brandId: 'brand_01',
        creatorId: 'creator_01',
      });

      ContractService.sendContract(contract.id);
      ContractService.acceptContract(contract.id);

      // Open Dispute
      const disputeResult = ContractService.openDispute(
        contract.id,
        'creator_01',
        'Brand did not deliver agreed props',
        'Scope Breach'
      );
      expect(disputeResult.success).toBe(true);
      expect(disputeResult.contract?.status).toBe('disputed');
      expect(disputeResult.contract?.dispute?.status).toBe('open');

      // Resolve Dispute via Admin
      const resolveResult = await ContractService.resolveDispute(
        contract.id,
        'Brand will compensate partial advance; contract gracefully cancelled.',
        'creator'
      );
      expect(resolveResult.success).toBe(true);
      expect(resolveResult.contract?.dispute?.status).toBe('resolved');
    });

    it('permits draft deletion', () => {
      const draft = ContractService.saveDraft({
        projectName: 'Temporary Draft',
        brandId: 'brand_01',
      });

      const deleted = ContractService.deleteDraft(draft.id);
      expect(deleted).toBe(true);

      const found = ContractService.getContractById(draft.id);
      expect(found).toBeNull();
    });

    it('allows Super Admin God Mode to force release escrow to creator', async () => {
      const draft = ContractService.saveDraft({
        projectName: 'God Mode Release Test',
        brandId: 'brand_test',
        brandName: 'Test Brand',
        creatorId: 'creator_test',
        creatorName: 'Test Creator',
      });
      ContractService.sendContract(draft.id);
      ContractService.acceptContract(draft.id);

      const result = await ContractService.forceReleaseEscrow(
        draft.id,
        'Creator fulfilled agreement; brand unresponsive'
      );
      expect(result.success).toBe(true);
      expect(result.contract?.status).toBe('completed');
      expect(result.contract?.payment.paymentStatus).toBe('paid');
      expect(result.contract?.auditTrail.some((a) => a.action === 'GODMODE_FORCE_RELEASE_ESCROW')).toBe(true);
    });

    it('allows Super Admin God Mode to force refund escrow to brand', async () => {
      const draft = ContractService.saveDraft({
        projectName: 'God Mode Refund Test',
        brandId: 'brand_test_2',
        brandName: 'Test Brand 2',
        creatorId: 'creator_test_2',
        creatorName: 'Test Creator 2',
      });
      ContractService.sendContract(draft.id);
      ContractService.acceptContract(draft.id);

      const result = await ContractService.forceRefundEscrow(
        draft.id,
        'Creator abandoned delivery deadlines without notice'
      );
      expect(result.success).toBe(true);
      expect(result.contract?.status).toBe('cancelled');
      expect(result.contract?.payment.paymentStatus).toBe('refunded');
      expect(result.contract?.auditTrail.some((a) => a.action === 'GODMODE_FORCE_REFUND_ESCROW')).toBe(true);
    });
  });
});
