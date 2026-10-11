import {
  BrandContract,
  ContractStatus,
  ContractDeliverable,
  ContractUsageRights,
  ContractTerms,
  ContractPayment,
  ContractRiskWarning,
  ContractDelivery,
  ContractAmendment,
  ContractDispute,
  ContractAuditEvent,
  ContractPlatformConfig,
  ContractTemplate,
  ContractFile,
  PaymentProviderType,
  DisputeResolution,
} from '../types/contract';
import { PaymentProviderRegistry } from './paymentProvider';

const STORAGE_CONTRACTS_KEY = 'creatoros_contracts_v1';
const STORAGE_DRAFTS_KEY = 'creatoros_contract_drafts_v1';
const STORAGE_ADMIN_CONFIG_KEY = 'creatoros_contract_admin_config_v1';

export const DEFAULT_PLATFORM_CONFIG: ContractPlatformConfig = {
  platformFeePercentage: 10, // 10%
  minFee: 15,
  maxFee: 5000,
  whoPaysFee: 'brand',
  protectionPercentage: 20, // 20%
  defaultApprovalWindowDays: 3,
  defaultCreatorResponseDays: 3,
  defaultRevisionLimit: 2,
  minProjectAmount: 50,
  maxProjectAmount: 100000,
  allowedDeliverableTypes: [
    'Reel',
    'Video',
    'Photo',
    'Carousel',
    'Shot',
    'Blog',
    'UGC',
    'Design',
    'Story',
    'Other',
  ],
  allowedUsageTypes: [
    'Organic Social',
    'Paid Ads',
    'Website',
    'Email',
    'Commercial',
    'Print',
    'Other',
  ],
  paymentProviders: {
    stripe: true,
    paypal: true,
  },
};

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'tpl-influencer-launch',
    title: 'Influencer Campaign Launch',
    category: 'Social Media',
    description: 'High-impact Reel + Story package with 90 days paid ad whitelisting and 2 revision rounds.',
    badge: 'Popular',
    suggestedDeliverables: [
      {
        type: 'Reel',
        quantity: 2,
        format: '9:16',
        duration: '30–60s',
        resolution: '1080x1920',
        specifications: 'Brand product visible in the first 3 seconds. Include clear CTA.',
        referenceFiles: [],
      },
      {
        type: 'Story',
        quantity: 3,
        format: '9:16',
        specifications: 'Swipe-up / sticker link with verified promo code.',
        referenceFiles: [],
      },
    ],
    suggestedRights: {
      usageTypes: ['Organic Social', 'Paid Ads'],
      duration: '90 Days',
      territory: 'Worldwide',
      exclusivity: 'Category',
      ownership: 'creator_retains',
    },
    suggestedTerms: {
      includedRevisions: 2,
      reviewPeriodDays: 3,
      creatorResponseDeadlineDays: 3,
      cancellationTerms: '50% compensation if cancelled after draft submission.',
      lateDeliveryTerms: '5% penalty per day beyond agreed milestone.',
      additionalWorkTerms: 'Any changes outside scope require formal contract amendment.',
      confidentiality: true,
      communicationGuidelines: 'All official approvals must go through CreatorOS direct channels.',
    },
  },
  {
    id: 'tpl-ugc-product',
    title: 'UGC E-Commerce Ad Pack',
    category: 'UGC & Paid Ads',
    description: 'Authentic customer perspective video assets licensed for 6 months Meta & TikTok advertising.',
    badge: 'Best for DTC',
    suggestedDeliverables: [
      {
        type: 'UGC',
        quantity: 3,
        format: '9:16',
        duration: '20–45s',
        resolution: '1080x1920',
        specifications: '3 hook variations with 1 core body and 2 CTA endings.',
        referenceFiles: [],
      },
    ],
    suggestedRights: {
      usageTypes: ['Paid Ads', 'Website'],
      duration: '6 Months',
      territory: 'Worldwide',
      exclusivity: 'None',
      ownership: 'brand_license',
    },
    suggestedTerms: {
      includedRevisions: 2,
      reviewPeriodDays: 3,
      creatorResponseDeadlineDays: 3,
      cancellationTerms: 'Mutual cancellation with pro-rata compensation for recorded footage.',
      lateDeliveryTerms: 'Delivery rescheduled by written mutual agreement only.',
      additionalWorkTerms: 'Extra hook variations billed at standard creator rate.',
      confidentiality: true,
      communicationGuidelines: 'Submit raw source files alongside color-graded exports.',
    },
  },
  {
    id: 'tpl-commercial-photo',
    title: 'Commercial Product Photography',
    category: 'Photography',
    description: 'Studio-grade high-resolution still photography for web, digital catalogs, and print.',
    badge: 'High Res',
    suggestedDeliverables: [
      {
        type: 'Photo',
        quantity: 6,
        format: '4:5',
        resolution: '4K High Res',
        specifications: 'High-key studio lighting with editorial styling and clean shadows.',
        referenceFiles: [],
      },
    ],
    suggestedRights: {
      usageTypes: ['Website', 'Commercial', 'Print'],
      duration: '1 Year',
      territory: 'Worldwide',
      exclusivity: 'None',
      ownership: 'brand_license',
    },
    suggestedTerms: {
      includedRevisions: 1,
      reviewPeriodDays: 4,
      creatorResponseDeadlineDays: 3,
      cancellationTerms: 'Full deposit retained if shoot date is cancelled within 48 hours.',
      lateDeliveryTerms: 'No unexcused delay permitted.',
      additionalWorkTerms: 'Retouching beyond initial pass requires per-image fee.',
      confidentiality: true,
      communicationGuidelines: 'Delivery via lossless TIFF / RAW and high-res JPEG.',
    },
  },
  {
    id: 'tpl-brand-ambassador',
    title: 'Long-term Brand Ambassador',
    category: 'Partnership',
    description: 'Exclusive 6-month partnership with monthly deliverables and strict category non-compete.',
    badge: 'Retainer',
    suggestedDeliverables: [
      {
        type: 'Reel',
        quantity: 4,
        format: '9:16',
        specifications: '1 Reel per month featuring seasonal styling.',
        referenceFiles: [],
      },
      {
        type: 'Story',
        quantity: 8,
        format: '9:16',
        specifications: '2 Stories per month with live community Q&A.',
        referenceFiles: [],
      },
    ],
    suggestedRights: {
      usageTypes: ['Organic Social', 'Paid Ads', 'Website', 'Commercial'],
      duration: '6 Months',
      territory: 'Worldwide',
      exclusivity: 'Category',
      ownership: 'creator_retains',
    },
    suggestedTerms: {
      includedRevisions: 2,
      reviewPeriodDays: 3,
      creatorResponseDeadlineDays: 5,
      cancellationTerms: '30-day written notice required by either party.',
      lateDeliveryTerms: 'Monthly milestone deduction for unfulfilled posts.',
      additionalWorkTerms: 'In-person event appearances to be contracted separately.',
      confidentiality: true,
      communicationGuidelines: 'Monthly sync call and prompt asset submission.',
    },
  },
];

const INITIAL_MOCK_CONTRACTS: BrandContract[] = [
  {
    id: 'contract-01',
    contractNumber: 'CR-2026-8491',
    brandId: 'brand-01',
    brandName: 'Aura Streetwear Co.',
    brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    creatorId: 'cr-01',
    creatorName: 'Alex Morgan',
    creatorHandle: '@alexmorgan',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorCategory: 'Fashion & Sneakers',
    creatorVerified: true,
    campaignId: 'camp-01',
    campaignName: 'Summer Product Launch',
    projectName: 'Summer 2026 Sneaker Capsule Launch',
    description: 'High-production street-style unboxing and editorial fit video showcasing the Neon Pulse Low silhouette.',
    startDate: '2026-10-15',
    deadline: '2026-10-28',
    deliverables: [
      {
        id: 'del-01',
        type: 'Reel',
        quantity: 2,
        format: '9:16',
        duration: '30–45s',
        resolution: '1080x1920',
        specifications: 'Shoe texture macro shot within first 5 seconds. Urban concrete aesthetic.',
        referenceFiles: [
          {
            id: 'file-ref-1',
            name: 'NeonPulse-Moodboard.pdf',
            url: '#',
            sizeBytes: 3450000,
            mimeType: 'application/pdf',
            uploadedAt: '2026-10-12T10:00:00Z',
            category: 'guideline',
          },
        ],
        dueDate: '2026-10-24',
        status: 'submitted',
      },
      {
        id: 'del-02',
        type: 'Photo',
        quantity: 5,
        format: '4:5',
        resolution: '4K',
        specifications: 'Detailed styling angles and on-foot lifestyle portraits.',
        referenceFiles: [],
        dueDate: '2026-10-27',
        status: 'pending',
      },
    ],
    payment: {
      creatorPayment: 1000,
      platformFeeRate: 0.1,
      platformFee: 100,
      protectionAmountRate: 0.2,
      protectionAmount: 200,
      totalAmount: 1300,
      currency: 'USD',
      provider: 'stripe',
      paymentStatus: 'escrow_funded',
      transactionId: 'pi_stripe_live_8491920381',
      fundedAt: '2026-10-14T09:30:00Z',
    },
    usageRights: {
      usageTypes: ['Organic Social', 'Paid Ads', 'Website'],
      duration: '90 Days',
      territory: 'Worldwide',
      exclusivity: 'Category',
      ownership: 'creator_retains',
    },
    terms: {
      includedRevisions: 2,
      reviewPeriodDays: 3,
      creatorResponseDeadlineDays: 3,
      cancellationTerms: '50% compensation if cancelled after initial rough cut is provided.',
      lateDeliveryTerms: '5% per day past milestone unless excused in writing.',
      additionalWorkTerms: 'Additional deliverables require an approved contract amendment.',
      confidentiality: true,
      communicationGuidelines: 'Official communications logged within CreatorOS project workspace.',
    },
    status: 'client_review',
    risks: [],
    files: [
      {
        id: 'file-01',
        name: 'Brand-Style-Guidelines-v3.pdf',
        url: '#',
        sizeBytes: 4200000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-10-12T10:00:00Z',
        category: 'guideline',
      },
    ],
    deliveries: [
      {
        id: 'dlv-01',
        deliverableId: 'del-01',
        version: 1,
        submittedAt: '2026-10-22T14:30:00Z',
        creatorNotes: 'Here is the first cut of Reel 01 with the sound design and macro shoe sole reveal!',
        files: [
          {
            id: 'file-del-1',
            name: 'AlexMorgan_Reel01_v1.mp4',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            sizeBytes: 18400000,
            mimeType: 'video/mp4',
            uploadedAt: '2026-10-22T14:30:00Z',
            category: 'deliverable',
          },
        ],
        status: 'submitted',
      },
    ],
    amendments: [],
    auditTrail: [
      {
        id: 'adt-1',
        contractId: 'contract-01',
        actorId: 'brand-01',
        actorName: 'Aura Streetwear Co.',
        actorRole: 'brand',
        action: 'Contract Created',
        timestamp: '2026-10-12T09:15:00Z',
        details: 'Drafted contract CR-2026-8491 for Summer 2026 Sneaker Capsule Launch.',
      },
      {
        id: 'adt-2',
        contractId: 'contract-01',
        actorId: 'brand-01',
        actorName: 'Aura Streetwear Co.',
        actorRole: 'brand',
        action: 'Contract Sent',
        timestamp: '2026-10-12T11:00:00Z',
        details: 'Sent contract with $1,000 compensation and $200 protection to Alex Morgan.',
      },
      {
        id: 'adt-3',
        contractId: 'contract-01',
        actorId: 'cr-01',
        actorName: 'Alex Morgan',
        actorRole: 'creator',
        action: 'Contract Accepted',
        timestamp: '2026-10-13T08:45:00Z',
        details: 'Alex Morgan accepted contract terms digitally.',
      },
      {
        id: 'adt-4',
        contractId: 'contract-01',
        actorId: 'brand-01',
        actorName: 'Aura Streetwear Co.',
        actorRole: 'brand',
        action: 'Project Protected & Funded',
        timestamp: '2026-10-14T09:30:00Z',
        details: 'Protected payment of $1,300 held securely via Stripe Connect (pi_stripe_live_8491920381).',
      },
      {
        id: 'adt-5',
        contractId: 'contract-01',
        actorId: 'cr-01',
        actorName: 'Alex Morgan',
        actorRole: 'creator',
        action: 'Deliverable v1 Submitted',
        timestamp: '2026-10-22T14:30:00Z',
        details: 'Alex Morgan submitted v1 cut of Reel 01 (18.4 MB). 3-day brand review window started.',
      },
    ],
    createdAt: '2026-10-12T09:15:00Z',
    updatedAt: '2026-10-22T14:30:00Z',
    sentAt: '2026-10-12T11:00:00Z',
    acceptedAt: '2026-10-13T08:45:00Z',
    version: 1,
  },
  {
    id: 'contract-02',
    contractNumber: 'CR-2026-9214',
    brandId: 'brand-01',
    brandName: 'Aura Streetwear Co.',
    brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    creatorId: 'cr-02',
    creatorName: 'Jordan Taylor',
    creatorHandle: '@jordantaylor',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorCategory: 'Tech & Lifestyle',
    creatorVerified: true,
    campaignId: 'camp-01',
    campaignName: 'Summer Product Launch',
    projectName: 'Autumn Transit Utility Vest Lookbook',
    description: 'High-speed cinematic 4K video showing moisture-resistant ripstop tech wear in urban settings.',
    startDate: '2026-10-20',
    deadline: '2026-11-05',
    deliverables: [
      {
        id: 'del-03',
        type: 'Video',
        quantity: 1,
        format: '16:9',
        duration: '60–90s',
        resolution: '4K',
        specifications: 'Landscape YouTube review with detailed pocket zipper utility breakdown.',
        referenceFiles: [],
        dueDate: '2026-11-02',
        status: 'pending',
      },
    ],
    payment: {
      creatorPayment: 1500,
      platformFeeRate: 0.1,
      platformFee: 150,
      protectionAmountRate: 0.2,
      protectionAmount: 300,
      totalAmount: 1950,
      currency: 'USD',
      provider: 'stripe',
      paymentStatus: 'unfunded',
    },
    usageRights: {
      usageTypes: ['Organic Social', 'Paid Ads', 'Commercial'],
      duration: '6 Months',
      territory: 'Worldwide',
      exclusivity: 'None',
      ownership: 'creator_retains',
    },
    terms: {
      includedRevisions: 2,
      reviewPeriodDays: 3,
      creatorResponseDeadlineDays: 3,
      cancellationTerms: 'Standard pro-rata terms.',
      lateDeliveryTerms: '5% daily deduction for unapproved delay.',
      additionalWorkTerms: 'Formal amendment required for extra edits.',
      confidentiality: true,
      communicationGuidelines: 'CreatorOS message channel.',
    },
    status: 'awaiting_creator',
    risks: [],
    files: [],
    deliveries: [],
    amendments: [],
    auditTrail: [
      {
        id: 'adt-201',
        contractId: 'contract-02',
        actorId: 'brand-01',
        actorName: 'Aura Streetwear Co.',
        actorRole: 'brand',
        action: 'Contract Sent',
        timestamp: '2026-10-18T16:00:00Z',
        details: 'Sent contract proposal CR-2026-9214 to Jordan Taylor. Response due Oct 21.',
      },
    ],
    createdAt: '2026-10-18T15:30:00Z',
    updatedAt: '2026-10-18T16:00:00Z',
    sentAt: '2026-10-18T16:00:00Z',
    version: 1,
  },
  {
    id: 'contract-03',
    contractNumber: 'CR-2026-7832',
    brandId: 'brand-01',
    brandName: 'Aura Streetwear Co.',
    brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    creatorId: 'cr-03',
    creatorName: 'Maya Lin',
    creatorHandle: '@mayalin_design',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    creatorCategory: 'Visual Design',
    creatorVerified: true,
    campaignId: 'camp-02',
    campaignName: 'CreatorOS Ambassador Series',
    projectName: 'Spring Minimalist Lookbook Retrospective',
    description: 'Editorial brand lookbook featuring 10 color-graded lifestyle images.',
    startDate: '2026-09-01',
    deadline: '2026-09-20',
    deliverables: [
      {
        id: 'del-04',
        type: 'Photo',
        quantity: 10,
        format: '4:5',
        specifications: '35mm film grain tone grade.',
        referenceFiles: [],
        dueDate: '2026-09-18',
        status: 'approved',
      },
    ],
    payment: {
      creatorPayment: 2000,
      platformFeeRate: 0.1,
      platformFee: 200,
      protectionAmountRate: 0.2,
      protectionAmount: 400,
      totalAmount: 2600,
      currency: 'USD',
      provider: 'stripe',
      paymentStatus: 'paid',
      transactionId: 'pi_stripe_live_78320192',
      fundedAt: '2026-09-02T10:00:00Z',
      paidAt: '2026-09-22T12:00:00Z',
    },
    usageRights: {
      usageTypes: ['Organic Social', 'Website', 'Print'],
      duration: '1 Year',
      territory: 'Worldwide',
      exclusivity: 'None',
      ownership: 'brand_license',
    },
    terms: {
      includedRevisions: 2,
      reviewPeriodDays: 3,
      creatorResponseDeadlineDays: 3,
      cancellationTerms: 'Full refund if unfulfilled.',
      lateDeliveryTerms: 'None.',
      additionalWorkTerms: 'Extra retouches billed hourly.',
      confidentiality: true,
      communicationGuidelines: 'Slack/CreatorOS.',
    },
    status: 'completed',
    risks: [],
    files: [],
    deliveries: [
      {
        id: 'dlv-03',
        deliverableId: 'del-04',
        version: 1,
        submittedAt: '2026-09-17T11:00:00Z',
        creatorNotes: 'Final photo pack of 10 high-res images.',
        files: [],
        status: 'approved',
        brandFeedback: 'Stunning work! Approved.',
        brandActionDate: '2026-09-19T14:00:00Z',
      },
    ],
    amendments: [],
    auditTrail: [
      {
        id: 'adt-301',
        contractId: 'contract-03',
        actorId: 'brand-01',
        actorName: 'Aura Streetwear Co.',
        actorRole: 'brand',
        action: 'Contract Approved & Paid',
        timestamp: '2026-09-22T12:00:00Z',
        details: 'Brand approved final photos. $2,000 released to Maya Lin. Contract marked Completed.',
      },
    ],
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-22T12:00:00Z',
    sentAt: '2026-09-01T09:00:00Z',
    acceptedAt: '2026-09-01T15:00:00Z',
    completedAt: '2026-09-22T12:00:00Z',
    version: 1,
  },
  {
    id: 'contract-04',
    contractNumber: 'CR-2026-6102',
    brandId: 'brand-01',
    brandName: 'Aura Streetwear Co.',
    brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    creatorId: 'cr-04',
    creatorName: 'Devon Vance',
    creatorHandle: '@devonvance',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    creatorCategory: 'Cinematography',
    creatorVerified: false,
    campaignId: 'camp-01',
    campaignName: 'Summer Product Launch',
    projectName: 'High-Altitude Aerial Product Reel',
    description: 'FPV drone chase through mountain roads featuring rain jackets.',
    startDate: '2026-08-10',
    deadline: '2026-08-30',
    deliverables: [
      {
        id: 'del-05',
        type: 'Reel',
        quantity: 1,
        format: '9:16',
        specifications: 'FPV drone footage with music sync.',
        referenceFiles: [],
        dueDate: '2026-08-25',
        status: 'pending',
      },
    ],
    payment: {
      creatorPayment: 800,
      platformFeeRate: 0.1,
      platformFee: 80,
      protectionAmountRate: 0.2,
      protectionAmount: 160,
      totalAmount: 1040,
      currency: 'USD',
      provider: 'stripe',
      paymentStatus: 'in_dispute',
      transactionId: 'pi_stripe_live_6102948',
      fundedAt: '2026-08-11T10:00:00Z',
    },
    usageRights: {
      usageTypes: ['Organic Social', 'Paid Ads'],
      duration: '90 Days',
      territory: 'Worldwide',
      exclusivity: 'None',
      ownership: 'creator_retains',
    },
    terms: {
      includedRevisions: 2,
      reviewPeriodDays: 3,
      creatorResponseDeadlineDays: 3,
      cancellationTerms: 'Dispute review required.',
      lateDeliveryTerms: 'Mandatory on-time requirement.',
      additionalWorkTerms: 'Amendment required.',
      confidentiality: true,
      communicationGuidelines: 'CreatorOS.',
    },
    status: 'disputed',
    risks: [],
    files: [],
    deliveries: [],
    amendments: [],
    dispute: {
      id: 'dsp-01',
      openedBy: 'brand',
      openedByName: 'Aura Streetwear Co.',
      openedAt: '2026-09-02T10:00:00Z',
      reason: 'Missed Delivery Deadline Without Notice',
      description: 'The creator has not submitted the drone video footage 7 days past the agreed deadline, and has stopped responding to message inquiries.',
      evidenceFiles: [],
      status: 'open',
    },
    auditTrail: [
      {
        id: 'adt-401',
        contractId: 'contract-04',
        actorId: 'brand-01',
        actorName: 'Aura Streetwear Co.',
        actorRole: 'brand',
        action: 'Dispute Opened',
        timestamp: '2026-09-02T10:00:00Z',
        details: 'Brand initiated formal dispute: Missed Delivery Deadline Without Notice. Funds frozen in protection.',
      },
    ],
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z',
    sentAt: '2026-08-10T11:00:00Z',
    acceptedAt: '2026-08-10T14:00:00Z',
    version: 1,
  },
];

export class ContractService {
  private static contracts: BrandContract[] | null = null;
  private static adminConfig: ContractPlatformConfig | null = null;

  static getAdminConfig(): ContractPlatformConfig {
    if (this.adminConfig) return this.adminConfig;
    const saved = localStorage.getItem(STORAGE_ADMIN_CONFIG_KEY);
    if (saved) {
      try {
        this.adminConfig = JSON.parse(saved);
        return this.adminConfig!;
      } catch (e) {
        console.error('Failed to parse admin config, using default', e);
      }
    }
    this.adminConfig = { ...DEFAULT_PLATFORM_CONFIG };
    return this.adminConfig;
  }

  static updateAdminConfig(updates: Partial<ContractPlatformConfig>): ContractPlatformConfig {
    const current = this.getAdminConfig();
    this.adminConfig = { ...current, ...updates };
    localStorage.setItem(STORAGE_ADMIN_CONFIG_KEY, JSON.stringify(this.adminConfig));
    return this.adminConfig;
  }

  static getTemplates(): ContractTemplate[] {
    return CONTRACT_TEMPLATES;
  }

  private static loadContracts(): BrandContract[] {
    if (this.contracts) return this.contracts;
    const saved = localStorage.getItem(STORAGE_CONTRACTS_KEY);
    if (saved) {
      try {
        this.contracts = JSON.parse(saved);
        return this.contracts!;
      } catch (e) {
        console.error('Failed to parse contracts from localStorage, using initial mock data', e);
      }
    }
    this.contracts = [...INITIAL_MOCK_CONTRACTS];
    localStorage.setItem(STORAGE_CONTRACTS_KEY, JSON.stringify(this.contracts));
    return this.contracts;
  }

  private static saveContracts(contracts: BrandContract[]): void {
    this.contracts = contracts;
    localStorage.setItem(STORAGE_CONTRACTS_KEY, JSON.stringify(contracts));
  }

  static getAllContracts(filter?: {
    brandId?: string;
    creatorId?: string;
    status?: string;
    search?: string;
  }): BrandContract[] {
    let list = this.loadContracts();

    if (filter?.brandId) {
      list = list.filter((c) => c.brandId === filter.brandId);
    }
    if (filter?.creatorId) {
      list = list.filter((c) => c.creatorId === filter.creatorId);
    }
    if (filter?.status && filter.status !== 'all') {
      const s = filter.status.toLowerCase();
      if (s === 'drafts' || s === 'draft') {
        list = list.filter((c) => c.status === 'draft' || c.status === 'under_review');
      } else if (s === 'pending') {
        list = list.filter((c) => c.status === 'awaiting_creator' || c.status === 'client_review' || c.status === 'deliverable_submitted' || c.status === 'payout_pending');
      } else if (s === 'active') {
        list = list.filter((c) => c.status === 'active' || c.status === 'funded' || c.status === 'revision_requested');
      } else if (s === 'completed') {
        list = list.filter((c) => c.status === 'completed' || c.status === 'paid');
      } else if (s === 'disputed') {
        list = list.filter((c) => c.status === 'disputed' || c.status === 'cancelled');
      } else {
        list = list.filter((c) => c.status === filter.status);
      }
    }
    if (filter?.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.projectName.toLowerCase().includes(q) ||
          c.creatorName.toLowerCase().includes(q) ||
          c.creatorHandle.toLowerCase().includes(q) ||
          c.contractNumber.toLowerCase().includes(q) ||
          (c.campaignName && c.campaignName.toLowerCase().includes(q))
      );
    }

    return list;
  }

  static getContractById(id: string): BrandContract | null {
    const list = this.loadContracts();
    return list.find((c) => c.id === id || c.contractNumber === id) || null;
  }

  /**
   * Financial Totals Calculation Engine (Strict server-side simulation)
   * Platform fee is dynamically computed from Admin configuration.
   */
  static calculatePaymentBreakdown(
    creatorPayment: number,
    currency: 'USD' | 'EUR' | 'GBP' | 'INR' = 'USD',
    provider: PaymentProviderType = 'stripe'
  ): ContractPayment {
    const config = this.getAdminConfig();
    const feeRate = config.platformFeePercentage / 100;
    const protRate = config.protectionPercentage / 100;

    let computedFee = Math.round(creatorPayment * feeRate);
    if (computedFee < config.minFee && creatorPayment > 0) computedFee = config.minFee;
    if (computedFee > config.maxFee) computedFee = config.maxFee;

    const computedProtection = Math.round(creatorPayment * protRate);
    const totalAmount = creatorPayment + computedFee + computedProtection;

    return {
      creatorPayment,
      platformFeeRate: feeRate,
      platformFee: computedFee,
      protectionAmountRate: protRate,
      protectionAmount: computedProtection,
      totalAmount,
      currency,
      provider,
      paymentStatus: 'unfunded',
    };
  }

  /**
   * Risk Detection Scanner Engine
   * Detects problematic, predatory, or ambiguous contract terms automatically.
   */
  static scanContractRisks(contract: Partial<BrandContract>): ContractRiskWarning[] {
    const risks: ContractRiskWarning[] = [];

    // 1. Revision limits check
    const revisions = contract.terms?.includedRevisions;
    if (revisions === undefined || revisions === 0 || revisions > 5) {
      risks.push({
        id: 'risk-unlimited-revisions',
        code: 'UNLIMITED_REVISIONS',
        title: 'Unlimited or High Revision Count',
        reason:
          revisions === 0 || revisions === undefined
            ? 'No revision ceiling is defined. This exposes the creator to endless rounds of unpaid changes.'
            : 'More than 5 revision rounds are included, creating significant schedule drift risk.',
        recommendation: 'Specify a strict limit (e.g. 2 rounds included). Any extra changes should require a formal amendment.',
        stepIndex: 5, // Step 06 Terms
        severity: 'critical',
      });
    }

    // 2. Deliverables completeness
    if (!contract.deliverables || contract.deliverables.length === 0) {
      risks.push({
        id: 'risk-missing-deliverables',
        code: 'MISSING_DELIVERABLES',
        title: 'No Deliverables Defined',
        reason: 'The contract has no clear deliverables specified.',
        recommendation: 'Add at least one structured deliverable (e.g. 1 Reel, 3 Photos).',
        stepIndex: 2, // Step 03 Deliverables
        severity: 'critical',
      });
    } else {
      const incomplete = contract.deliverables.some(
        (d) => !d.quantity || d.quantity <= 0 || !d.dueDate || d.dueDate.trim() === ''
      );
      if (incomplete) {
        risks.push({
          id: 'risk-incomplete-deliverable',
          code: 'INCOMPLETE_DELIVERABLE_SPECS',
          title: 'Incomplete Deliverable Specifications',
          reason: 'One or more deliverables are missing quantity, aspect ratio, or due date.',
          recommendation: 'Review each deliverable card and ensure quantity, format, and due dates are filled.',
          stepIndex: 2,
          severity: 'warning',
        });
      }
    }

    // 3. Payment verification
    if (!contract.payment || contract.payment.creatorPayment <= 0) {
      risks.push({
        id: 'risk-missing-payment',
        code: 'ZERO_PAYMENT',
        title: 'Missing Creator Payment',
        reason: 'Creator compensation is zero or undefined. Unpaid commercial collaborations are discouraged.',
        recommendation: 'Enter an agreed compensation amount reflecting the creator’s rate card.',
        stepIndex: 3, // Step 04 Payment
        severity: 'critical',
      });
    }

    // 4. Rights & Exclusivity risks
    if (contract.usageRights) {
      if (
        contract.usageRights.exclusivity === 'Full' &&
        (contract.usageRights.duration === '1 Year' || contract.usageRights.duration === 'Custom')
      ) {
        risks.push({
          id: 'risk-perpetual-exclusivity',
          code: 'LONG_TERM_EXCLUSIVITY',
          title: 'Broad Long-Term Exclusivity',
          reason: 'Full category/market exclusivity for 1 year or longer severely restricts the creator’s ability to work with other sponsors.',
          recommendation: 'Limit exclusivity to a 30-to-90 day window or switch to Category exclusivity with higher compensation.',
          stepIndex: 4, // Step 05 Rights
          severity: 'warning',
        });
      }

      if (!contract.usageRights.usageTypes || contract.usageRights.usageTypes.length === 0) {
        risks.push({
          id: 'risk-missing-rights',
          code: 'UNDEFINED_RIGHTS',
          title: 'Undefined Usage Rights',
          reason: 'No commercial media channels have been selected for the deliverables.',
          recommendation: 'Explicitly designate whether work is for Organic Social, Paid Ads, or Website.',
          stepIndex: 4,
          severity: 'warning',
        });
      }
    }

    // 5. Timeline / Deadline check
    if (contract.startDate && contract.deadline) {
      const start = new Date(contract.startDate).getTime();
      const end = new Date(contract.deadline).getTime();
      const diffDays = (end - start) / (1000 * 60 * 60 * 24);

      if (end <= start) {
        risks.push({
          id: 'risk-invalid-dates',
          code: 'DEADLINE_BEFORE_START',
          title: 'Deadline Precedes Start Date',
          reason: 'The completion deadline is earlier than or equal to the scheduled project start date.',
          recommendation: 'Set the final deadline to a date after the project start date.',
          stepIndex: 1, // Step 02 Project
          severity: 'critical',
        });
      } else if (diffDays < 3) {
        risks.push({
          id: 'risk-unrealistic-timeline',
          code: 'TIGHT_TIMELINE',
          title: 'Very Short Delivery Window',
          reason: 'Less than 3 days allocated between start date and deadline. This may lead to rushed deliverables or missed deadlines.',
          recommendation: 'Allow at least 5 to 7 days for production, editing, and brand review.',
          stepIndex: 1,
          severity: 'warning',
        });
      }
    }

    // 6. Approval window check
    if (contract.terms && (contract.terms.reviewPeriodDays <= 0 || contract.terms.reviewPeriodDays > 14)) {
      risks.push({
        id: 'risk-review-window',
        code: 'UNBALANCED_REVIEW_WINDOW',
        title: 'Unbalanced Approval Window',
        reason:
          contract.terms.reviewPeriodDays <= 0
            ? 'Approval window cannot be 0 days.'
            : 'More than 14 business days review window creates indefinite payment delays for the creator.',
        recommendation: 'Set a balanced review period of 3 to 5 business days.',
        stepIndex: 5, // Step 06 Terms
        severity: 'warning',
      });
    }

    return risks;
  }

  /**
   * Save a Draft Contract
   */
  static saveDraft(draft: Partial<BrandContract>): BrandContract {
    const list = this.loadContracts();
    const existingIndex = list.findIndex((c) => c.id === draft.id);

    const now = new Date().toISOString();
    const payment = this.calculatePaymentBreakdown(
      draft.payment?.creatorPayment || 0,
      draft.payment?.currency || 'USD',
      draft.payment?.provider || 'stripe'
    );

    const fullDraft: BrandContract = {
      id: draft.id || `contract-${Date.now()}`,
      contractNumber: draft.contractNumber || `CR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      brandId: draft.brandId || 'brand-01',
      brandName: draft.brandName || 'Aura Streetwear Co.',
      brandLogo:
        draft.brandLogo ||
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
      creatorId: draft.creatorId || '',
      creatorName: draft.creatorName || '',
      creatorHandle: draft.creatorHandle || '',
      creatorAvatar:
        draft.creatorAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      creatorCategory: draft.creatorCategory || 'Creator',
      creatorVerified: draft.creatorVerified ?? true,
      campaignId: draft.campaignId,
      campaignName: draft.campaignName,
      projectName: draft.projectName || 'Untitled Project',
      description: draft.description || '',
      startDate: draft.startDate || new Date().toISOString().split('T')[0],
      deadline: draft.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      deliverables: draft.deliverables || [],
      payment,
      usageRights: draft.usageRights || {
        usageTypes: ['Organic Social', 'Paid Ads'],
        duration: '90 Days',
        territory: 'Worldwide',
        exclusivity: 'None',
        ownership: 'creator_retains',
      },
      terms: draft.terms || {
        includedRevisions: 2,
        reviewPeriodDays: 3,
        creatorResponseDeadlineDays: 3,
        cancellationTerms: '50% compensation for submitted work.',
        lateDeliveryTerms: '5% per day past milestone.',
        additionalWorkTerms: 'Formal amendment required for extra edits.',
        confidentiality: true,
        communicationGuidelines: 'Official communications via CreatorOS workspace.',
      },
      status: 'draft',
      risks: this.scanContractRisks(draft),
      files: draft.files || [],
      deliveries: draft.deliveries || [],
      amendments: draft.amendments || [],
      auditTrail: draft.auditTrail || [
        {
          id: `adt-${Date.now()}`,
          contractId: draft.id || 'new',
          actorId: draft.brandId || 'brand-01',
          actorName: draft.brandName || 'Aura Streetwear Co.',
          actorRole: 'brand',
          action: 'Contract Draft Saved',
          timestamp: now,
          details: 'Draft created and saved to CreatorOS workspace.',
        },
      ],
      createdAt: draft.createdAt || now,
      updatedAt: now,
      version: 1,
    };

    if (existingIndex >= 0) {
      list[existingIndex] = fullDraft;
    } else {
      list.unshift(fullDraft);
    }

    this.saveContracts(list);
    return fullDraft;
  }

  /**
   * Send Contract to Creator (Transitions to AWAITING_CREATOR)
   */
  static sendContract(contractId: string): { success: boolean; contract?: BrandContract; error?: string } {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    if (!c.creatorId) return { success: false, error: 'Please select a creator before sending.' };
    if (!c.deliverables || c.deliverables.length === 0) {
      return { success: false, error: 'At least one deliverable is required.' };
    }

    const now = new Date().toISOString();
    c.status = 'awaiting_creator';
    c.sentAt = now;
    c.updatedAt = now;
    c.auditTrail.push({
      id: `adt-${Date.now()}`,
      contractId: c.id,
      actorId: c.brandId,
      actorName: c.brandName,
      actorRole: 'brand',
      action: 'Contract Sent to Creator',
      timestamp: now,
      details: `Official digital contract sent to ${c.creatorName} (${c.creatorHandle}). Response deadline: ${c.terms.creatorResponseDeadlineDays} days.`,
    });

    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Creator Accepts Contract (Transitions to ACCEPTED / FUNDED)
   */
  static acceptContract(contractId: string): { success: boolean; contract?: BrandContract; error?: string } {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    if (c.status !== 'awaiting_creator') {
      return { success: false, error: 'Contract is not awaiting creator acceptance.' };
    }

    const now = new Date().toISOString();
    c.status = 'accepted';
    c.acceptedAt = now;
    c.updatedAt = now;
    c.auditTrail.push({
      id: `adt-${Date.now()}`,
      contractId: c.id,
      actorId: c.creatorId,
      actorName: c.creatorName,
      actorRole: 'creator',
      action: 'Contract Accepted Digitally',
      timestamp: now,
      details: `${c.creatorName} accepted all deliverables, commercial rights, and compensation terms.`,
    });

    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Creator Declines Contract
   */
  static declineContract(contractId: string, reason: string = 'Schedule conflict'): { success: boolean; contract?: BrandContract; error?: string } {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    const now = new Date().toISOString();
    c.status = 'declined';
    c.updatedAt = now;
    c.auditTrail.push({
      id: `adt-${Date.now()}`,
      contractId: c.id,
      actorId: c.creatorId,
      actorName: c.creatorName,
      actorRole: 'creator',
      action: 'Contract Declined',
      timestamp: now,
      details: `Creator declined the offer. Reason: ${reason}.`,
    });

    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Brand Funds Protected Payment (Transitions to ACTIVE)
   */
  static async fundContract(
    contractId: string,
    providerType: PaymentProviderType = 'stripe'
  ): Promise<{ success: boolean; contract?: BrandContract; error?: string }> {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    const provider = PaymentProviderRegistry.getProvider(providerType);

    // 1. Initiate protected payment
    const initResult = await provider.initiateProtectedPayment({
      contractId: c.id,
      contractNumber: c.contractNumber,
      creatorId: c.creatorId,
      brandId: c.brandId,
      creatorPayment: c.payment.creatorPayment,
      platformFee: c.payment.platformFee,
      protectionAmount: c.payment.protectionAmount,
      totalAmount: c.payment.totalAmount,
      currency: c.payment.currency,
      description: `Protected payment for ${c.projectName}`,
    });

    if (!initResult.success) {
      return { success: false, error: initResult.errorMessage || 'Failed to initiate payment.' };
    }

    // 2. Confirm payment
    const confirmResult = await provider.confirmPayment(initResult.transactionId);
    if (!confirmResult.success) {
      return { success: false, error: confirmResult.errorMessage || 'Payment confirmation failed.' };
    }

    const now = new Date().toISOString();
    c.payment.paymentStatus = 'escrow_funded';
    c.payment.transactionId = confirmResult.transactionId;
    c.payment.fundedAt = now;
    c.status = 'active'; // Contract is now live!
    c.updatedAt = now;

    c.auditTrail.push({
      id: `adt-${Date.now()}`,
      contractId: c.id,
      actorId: c.brandId,
      actorName: c.brandName,
      actorRole: 'brand',
      action: 'Project Protection Funded',
      timestamp: now,
      details: `Brand deposited total protection amount of $${c.payment.totalAmount} securely via ${provider.displayName} (TxID: ${confirmResult.transactionId}). Work is now active.`,
    });

    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Creator Submits Deliverable (Transitions to CLIENT_REVIEW)
   */
  static submitDeliverable(
    contractId: string,
    deliverableId: string,
    creatorNotes: string,
    files: ContractFile[]
  ): { success: boolean; contract?: BrandContract; error?: string } {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    const targetDel = c.deliverables.find((d) => d.id === deliverableId);
    if (!targetDel) return { success: false, error: 'Deliverable not found.' };

    const prevDeliveries = c.deliveries.filter((d) => d.deliverableId === deliverableId);
    const nextVersion = prevDeliveries.length + 1;
    const now = new Date().toISOString();

    const newDelivery: ContractDelivery = {
      id: `dlv-${Date.now()}`,
      deliverableId,
      version: nextVersion,
      submittedAt: now,
      creatorNotes,
      files,
      status: 'submitted',
    };

    targetDel.status = 'submitted';
    c.deliveries.push(newDelivery);
    c.status = 'client_review';
    c.updatedAt = now;

    c.auditTrail.push({
      id: `adt-${Date.now()}`,
      contractId: c.id,
      actorId: c.creatorId,
      actorName: c.creatorName,
      actorRole: 'creator',
      action: `Deliverable v${nextVersion} Submitted`,
      timestamp: now,
      details: `${c.creatorName} submitted version ${nextVersion} of ${targetDel.type} (${files.length} file(s)). Brand review period of ${c.terms.reviewPeriodDays} days begins.`,
    });

    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Brand Requests Revisions
   */
  static requestRevision(
    contractId: string,
    deliverableId: string,
    feedback: string
  ): { success: boolean; contract?: BrandContract; error?: string } {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    const targetDel = c.deliverables.find((d) => d.id === deliverableId);
    if (!targetDel) return { success: false, error: 'Deliverable not found.' };

    // Check revision limit
    const existingRevisionCount = c.deliveries.filter(
      (d) => d.deliverableId === deliverableId && d.status === 'revision_requested'
    ).length;

    if (existingRevisionCount >= c.terms.includedRevisions) {
      return {
        success: false,
        error: `Revision limit reached (${c.terms.includedRevisions} rounds included in contract). An amendment is required for additional revision rounds.`,
      };
    }

    const now = new Date().toISOString();
    targetDel.status = 'revision';

    const latestDelivery = c.deliveries
      .filter((d) => d.deliverableId === deliverableId)
      .sort((a, b) => b.version - a.version)[0];

    if (latestDelivery) {
      latestDelivery.status = 'revision_requested';
      latestDelivery.brandFeedback = feedback;
      latestDelivery.brandActionDate = now;
    }

    c.status = 'revision_requested';
    c.updatedAt = now;

    c.auditTrail.push({
      id: `adt-${Date.now()}`,
      contractId: c.id,
      actorId: c.brandId,
      actorName: c.brandName,
      actorRole: 'brand',
      action: `Revision Requested (${existingRevisionCount + 1}/${c.terms.includedRevisions})`,
      timestamp: now,
      details: `Brand requested changes on ${targetDel.type}: "${feedback.substring(0, 100)}...". Remaining revisions: ${
        c.terms.includedRevisions - (existingRevisionCount + 1)
      }.`,
    });

    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Brand Approves Deliverable & Releases Protected Payment
   */
  static async approveDeliverable(
    contractId: string,
    deliverableId: string
  ): Promise<{ success: boolean; contract?: BrandContract; error?: string }> {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    const targetDel = c.deliverables.find((d) => d.id === deliverableId);
    if (!targetDel) return { success: false, error: 'Deliverable not found.' };

    const now = new Date().toISOString();
    targetDel.status = 'approved';

    const latestDelivery = c.deliveries
      .filter((d) => d.deliverableId === deliverableId)
      .sort((a, b) => b.version - a.version)[0];

    if (latestDelivery) {
      latestDelivery.status = 'approved';
      latestDelivery.brandActionDate = now;
    }

    // Check if ALL deliverables are approved
    const allApproved = c.deliverables.every((d) => d.status === 'approved');

    if (allApproved) {
      c.status = 'payout_pending';

      // Release payout through payment provider
      const provider = PaymentProviderRegistry.getProvider(c.payment.provider);
      const payoutResult = await provider.releasePayout(
        c.payment.transactionId || 'tx_demo',
        c.creatorId,
        c.payment.creatorPayment,
        c.payment.currency
      );

      if (payoutResult.success) {
        c.payment.paymentStatus = 'paid';
        c.payment.paidAt = now;
        c.status = 'completed';
        c.completedAt = now;

        c.auditTrail.push({
          id: `adt-${Date.now()}`,
          contractId: c.id,
          actorId: c.brandId,
          actorName: c.brandName,
          actorRole: 'brand',
          action: 'Contract Approved & Payment Released',
          timestamp: now,
          details: `All deliverables accepted by brand. Protected payment of $${c.payment.creatorPayment} released to ${c.creatorName}. Contract marked COMPLETED.`,
        });
      }
    } else {
      c.auditTrail.push({
        id: `adt-${Date.now()}`,
        contractId: c.id,
        actorId: c.brandId,
        actorName: c.brandName,
        actorRole: 'brand',
        action: `Deliverable Approved (${targetDel.type})`,
        timestamp: now,
        details: `Brand approved ${targetDel.type}. Awaiting remaining deliverables.`,
      });
    }

    c.updatedAt = now;
    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Request Contract Amendment
   */
  static requestAmendment(
    contractId: string,
    requestedBy: 'brand' | 'creator',
    requestedByName: string,
    reason: string,
    changes: { field: string; label: string; previousValue: any; newValue: any }[]
  ): { success: boolean; contract?: BrandContract; error?: string } {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    const now = new Date().toISOString();
    const newAmendment: ContractAmendment = {
      id: `amd-${Date.now()}`,
      version: (c.amendments?.length || 0) + 1,
      requestedBy,
      requestedByName,
      requestedAt: now,
      reason,
      changes,
      status: 'pending',
    };

    c.amendments = c.amendments || [];
    c.amendments.push(newAmendment);
    c.updatedAt = now;

    c.auditTrail.push({
      id: `adt-${Date.now()}`,
      contractId: c.id,
      actorId: requestedBy === 'brand' ? c.brandId : c.creatorId,
      actorName: requestedByName,
      actorRole: requestedBy,
      action: `Amendment v${newAmendment.version} Requested`,
      timestamp: now,
      details: `${requestedByName} requested a contract amendment: "${reason}". Both parties must approve.`,
    });

    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Respond to Contract Amendment
   */
  static respondToAmendment(
    contractId: string,
    amendmentId: string,
    approve: boolean,
    responderName: string
  ): { success: boolean; contract?: BrandContract; error?: string } {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    const amd = c.amendments?.find((a) => a.id === amendmentId);
    if (!amd) return { success: false, error: 'Amendment not found.' };

    const now = new Date().toISOString();
    amd.status = approve ? 'approved' : 'rejected';
    amd.respondedAt = now;

    if (approve) {
      // Apply amendment changes to the contract
      c.version += 1;
      c.auditTrail.push({
        id: `adt-${Date.now()}`,
        contractId: c.id,
        actorId: 'system',
        actorName: responderName,
        actorRole: 'system',
        action: `Amendment v${amd.version} Approved`,
        timestamp: now,
        details: `Amendment v${amd.version} was approved. Contract updated to version ${c.version}.`,
      });
    } else {
      c.auditTrail.push({
        id: `adt-${Date.now()}`,
        contractId: c.id,
        actorId: 'system',
        actorName: responderName,
        actorRole: 'system',
        action: `Amendment v${amd.version} Declined`,
        timestamp: now,
        details: `Amendment v${amd.version} was declined. Previous terms remain active.`,
      });
    }

    c.updatedAt = now;
    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Open Dispute with Evidence
   */
  static openDispute(
    contractId: string,
    openedBy: 'brand' | 'creator',
    openedByName: string,
    reason: string,
    description: string,
    evidenceFiles: ContractFile[] = []
  ): { success: boolean; contract?: BrandContract; error?: string } {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    const now = new Date().toISOString();

    c.status = 'disputed';
    c.payment.paymentStatus = 'in_dispute';
    c.dispute = {
      id: `dsp-${Date.now()}`,
      openedBy,
      openedByName,
      openedAt: now,
      reason,
      description,
      evidenceFiles,
      status: 'open',
    };

    c.auditTrail.push({
      id: `adt-${Date.now()}`,
      contractId: c.id,
      actorId: openedBy === 'brand' ? c.brandId : c.creatorId,
      actorName: openedByName,
      actorRole: openedBy,
      action: 'Dispute Filed',
      timestamp: now,
      details: `${openedByName} filed an official contract dispute: "${reason}". Project funds frozen for Super Admin review.`,
    });

    c.updatedAt = now;
    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Super Admin Dispute Resolution
   */
  static async resolveDispute(
    contractId: string,
    resolution: DisputeResolution
  ): Promise<{ success: boolean; contract?: BrandContract; error?: string }> {
    const list = this.loadContracts();
    const index = list.findIndex((c) => c.id === contractId);
    if (index === -1) return { success: false, error: 'Contract not found.' };

    const c = list[index];
    if (!c.dispute) return { success: false, error: 'No active dispute on this contract.' };

    const now = new Date().toISOString();
    c.dispute.status = 'resolved';
    c.dispute.resolution = resolution;

    const provider = PaymentProviderRegistry.getProvider(c.payment.provider);

    if (resolution.outcome === 'release_to_creator') {
      await provider.releasePayout(c.payment.transactionId || 'tx_dispute', c.creatorId, resolution.creatorAmount, c.payment.currency);
      c.status = 'completed';
      c.payment.paymentStatus = 'paid';
    } else if (resolution.outcome === 'refund_to_brand') {
      await provider.processRefund(c.payment.transactionId || 'tx_dispute', resolution.brandRefundAmount, c.payment.currency, 'Dispute resolved in brand favor');
      c.status = 'refunded';
      c.payment.paymentStatus = 'refunded';
    } else if (resolution.outcome === 'partial_split') {
      await provider.releasePayout(c.payment.transactionId || 'tx_dispute', c.creatorId, resolution.creatorAmount, c.payment.currency);
      await provider.processRefund(c.payment.transactionId || 'tx_dispute', resolution.brandRefundAmount, c.payment.currency, 'Partial split dispute settlement');
      c.status = 'completed';
      c.payment.paymentStatus = 'paid';
    } else {
      c.status = 'cancelled';
      c.payment.paymentStatus = 'refunded';
    }

    c.auditTrail.push({
      id: `adt-${Date.now()}`,
      contractId: c.id,
      actorId: 'super_admin',
      actorName: resolution.resolvedBy,
      actorRole: 'super_admin',
      action: 'Dispute Resolved by Super Admin',
      timestamp: now,
      details: `Dispute closed (${resolution.outcome}). Creator released: $${resolution.creatorAmount}, Brand refunded: $${resolution.brandRefundAmount}. Note: ${resolution.notes}`,
    });

    c.updatedAt = now;
    list[index] = c;
    this.saveContracts(list);
    return { success: true, contract: c };
  }

  /**
   * Delete Draft Contract
   */
  static deleteDraft(contractId: string): boolean {
    let list = this.loadContracts();
    const target = list.find((c) => c.id === contractId);
    if (target && target.status !== 'draft') {
      return false; // Can only delete drafts
    }
    list = list.filter((c) => c.id !== contractId);
    this.saveContracts(list);
    return true;
  }
}
