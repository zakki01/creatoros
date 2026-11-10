/**
 * CreatorOS Private Beta Access & Invite Code Management Engine
 * Enforces closed-alpha velvet rope gating, single/multi-use code validation,
 * waitlist applications, and founding member badge attribution.
 */

export interface BetaInviteCode {
  code: string;
  roleConstraint: 'all' | 'creator' | 'business';
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  notes?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface WaitlistEntry {
  id: string;
  fullName: string;
  email: string;
  role: 'creator' | 'business';
  handle: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  inviteCodeIssued?: string;
  submittedAt: string;
}

export interface InviteValidationResult {
  valid: boolean;
  code?: string;
  badge?: string;
  error?: string;
  roleConstraint?: string;
}

const STORAGE_CODES_KEY = 'creatoros_beta_invite_codes_v1';
const STORAGE_WAITLIST_KEY = 'creatoros_beta_waitlist_v1';

export class BetaAccessService {
  private codes: BetaInviteCode[] = [];
  private waitlist: WaitlistEntry[] = [];
  private initialized = false;

  constructor() {
    this.initDefaults();
  }

  private initDefaults(): void {
    if (this.initialized) return;

    try {
      const savedCodes = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_CODES_KEY) : null;
      if (savedCodes) {
        this.codes = JSON.parse(savedCodes);
      } else {
        // Initial master seed codes
        this.codes = [
          {
            code: 'ALPHA-2026',
            roleConstraint: 'all',
            maxUses: 500,
            usedCount: 0,
            isActive: true,
            notes: 'Official CreatorOS Founding Cohort Master Key',
            createdAt: new Date().toISOString(),
          },
          {
            code: 'CREATOR-VIP',
            roleConstraint: 'creator',
            maxUses: 100,
            usedCount: 0,
            isActive: true,
            notes: 'VIP Creator Fast-track Pass',
            createdAt: new Date().toISOString(),
          },
          {
            code: 'BRAND-VIP',
            roleConstraint: 'business',
            maxUses: 50,
            usedCount: 0,
            isActive: true,
            notes: 'Alpha Brand Partner Accreditation Key',
            createdAt: new Date().toISOString(),
          },
        ];
        this.saveCodes();
      }

      const savedWaitlist = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_WAITLIST_KEY) : null;
      if (savedWaitlist) {
        this.waitlist = JSON.parse(savedWaitlist);
      } else {
        this.waitlist = [];
      }

      this.initialized = true;
    } catch {
      this.codes = [];
      this.waitlist = [];
    }
  }

  private saveCodes(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(this.codes));
      }
    } catch {}
  }

  private saveWaitlist(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_WAITLIST_KEY, JSON.stringify(this.waitlist));
      }
    } catch {}
  }

  /**
   * Validates an invite code against role and usage parameters.
   */
  validateInviteCode(codeStr: string, targetRole: 'creator' | 'business' | string = 'all'): InviteValidationResult {
    this.initDefaults();

    if (!codeStr || !codeStr.trim()) {
      return { valid: false, error: 'Invite code is required for Private Beta registration.' };
    }

    const cleanCode = codeStr.trim().toUpperCase();
    const entry = this.codes.find((c) => c.code.toUpperCase() === cleanCode);

    if (!entry) {
      return {
        valid: false,
        error: 'Invalid or unrecognized invite code. Please request beta access.',
      };
    }

    if (!entry.isActive) {
      return { valid: false, error: 'This invite code has been deactivated.' };
    }

    if (entry.expiresAt && new Date(entry.expiresAt).getTime() < Date.now()) {
      return { valid: false, error: 'This invite code has expired.' };
    }

    if (entry.usedCount >= entry.maxUses) {
      return {
        valid: false,
        error: `This invite code has reached its maximum redemption limit (${entry.maxUses} uses).`,
      };
    }

    // Role constraint verification
    if (entry.roleConstraint !== 'all') {
      const normalizedRole = targetRole === 'business' || targetRole === 'brand' ? 'business' : 'creator';
      if (entry.roleConstraint !== normalizedRole) {
        return {
          valid: false,
          error: `This invite code is reserved for ${entry.roleConstraint === 'business' ? 'brand' : 'creator'} accounts only.`,
        };
      }
    }

    const badge =
      targetRole === 'business' || targetRole === 'brand'
        ? 'Alpha Brand Partner'
        : 'Founding Creator';

    return {
      valid: true,
      code: entry.code,
      badge,
      roleConstraint: entry.roleConstraint,
    };
  }

  /**
   * Redeems an invite code upon successful user creation.
   */
  redeemInviteCode(
    codeStr: string,
    userId: string,
    email: string
  ): { success: boolean; badge?: string; error?: string } {
    const check = this.validateInviteCode(codeStr, 'all');
    if (!check.valid) return { success: false, error: check.error };

    const cleanCode = codeStr.trim().toUpperCase();
    const entry = this.codes.find((c) => c.code.toUpperCase() === cleanCode);
    if (!entry) return { success: false, error: 'Code not found.' };

    entry.usedCount += 1;
    this.saveCodes();

    return {
      success: true,
      badge: check.badge,
    };
  }

  /**
   * Submits a new user application to the private beta waitlist.
   */
  submitWaitlist(params: {
    fullName: string;
    email: string;
    role: 'creator' | 'business';
    handle: string;
    category: string;
  }): WaitlistEntry {
    this.initDefaults();

    const normalizedEmail = params.email.trim().toLowerCase();
    const existing = this.waitlist.find((w) => w.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('This email is already registered on the private beta waitlist.');
    }

    const entry: WaitlistEntry = {
      id: `wtl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: params.fullName.trim(),
      email: normalizedEmail,
      role: params.role,
      handle: params.handle.trim(),
      category: params.category.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    this.waitlist.unshift(entry);
    this.saveWaitlist();
    return entry;
  }

  /**
   * Admin approves a waitlist applicant and generates a personalized invite code.
   */
  approveWaitlistEntry(entryId: string): { success: boolean; inviteCode?: string } {
    this.initDefaults();
    const entry = this.waitlist.find((w) => w.id === entryId);
    if (!entry) return { success: false };

    const prefix = entry.role === 'business' ? 'BRAND' : 'CREATOR';
    const code = `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    this.generateInviteCode({
      code,
      roleConstraint: entry.role,
      maxUses: 1,
      notes: `Issued to waitlist applicant ${entry.fullName} (${entry.email})`,
    });

    entry.status = 'approved';
    entry.inviteCodeIssued = code;
    this.saveWaitlist();

    return { success: true, inviteCode: code };
  }

  /**
   * Creates a new custom or batch invite code (Admin only).
   */
  generateInviteCode(params: {
    code: string;
    roleConstraint?: 'all' | 'creator' | 'business';
    maxUses?: number;
    notes?: string;
    expiresAt?: string;
  }): BetaInviteCode {
    this.initDefaults();

    const cleanCode = params.code.trim().toUpperCase();
    const existing = this.codes.find((c) => c.code.toUpperCase() === cleanCode);
    if (existing) {
      existing.maxUses = params.maxUses ?? existing.maxUses;
      existing.isActive = true;
      existing.notes = params.notes ?? existing.notes;
      this.saveCodes();
      return existing;
    }

    const newCode: BetaInviteCode = {
      code: cleanCode,
      roleConstraint: params.roleConstraint || 'all',
      maxUses: params.maxUses ?? 1,
      usedCount: 0,
      isActive: true,
      notes: params.notes,
      expiresAt: params.expiresAt,
      createdAt: new Date().toISOString(),
    };

    this.codes.unshift(newCode);
    this.saveCodes();
    return newCode;
  }

  getAllCodes(): BetaInviteCode[] {
    this.initDefaults();
    return [...this.codes];
  }

  getWaitlist(): WaitlistEntry[] {
    this.initDefaults();
    return [...this.waitlist];
  }

  // Static convenience proxies
  static validateInviteCode(code: string, targetRole?: 'creator' | 'business') {
    return betaAccessService.validateInviteCode(code, targetRole);
  }

  static redeemInviteCode(code: string, userId: string, email: string) {
    return betaAccessService.redeemInviteCode(code, userId, email);
  }

  static submitWaitlist(entry: Omit<WaitlistEntry, 'id' | 'status' | 'submittedAt'>) {
    return betaAccessService.submitWaitlist(entry);
  }

  static approveWaitlistEntry(id: string) {
    return betaAccessService.approveWaitlistEntry(id);
  }

  static generateInviteCode(params: {
    code: string;
    roleConstraint?: 'all' | 'creator' | 'business';
    maxUses?: number;
    notes?: string;
    expiresAt?: string;
  }) {
    return betaAccessService.generateInviteCode(params);
  }

  static getAllInviteCodes(): BetaInviteCode[] {
    return betaAccessService.getAllCodes();
  }

  static getWaitlist(): WaitlistEntry[] {
    return betaAccessService.getWaitlist();
  }
}

export const betaAccessService = new BetaAccessService();
