# Private Beta Engine & Secret `/godmode` Command Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform CreatorOS into a private invite-only platform with anti-circumvention enforcement, zero escrow holding fee transparency, and a secret, air-gapped `/godmode` Super Admin investigation portal.

**Architecture:** Client-side invite validation backed by `betaAccessService` (with Supabase persistence), transparent escrow calculation in `contractService`, real-time chat keyword scanner in `messagingService`, and an isolated, unlinked `/godmode` route in `App.tsx` providing forensic chat inspection and escrow overrides.

**Tech Stack:** React 19, TypeScript, Vitest, Puppeteer-core, Tailwind CSS, Lucide React, Supabase.

**Spec:** [docs/superpowers/plans/2026-11-10-private-beta-godmode.md](file:///C:/Users/zakki/.gemini/antigravity/scratch/creatoros/docs/superpowers/plans/2026-11-10-private-beta-godmode.md)

## Global Constraints

- Secret Super Admin must be at `/godmode` and completely unlinked from Creator Studio, Brand Portal, and landing pages.
- Non-admin visitors navigating to `/godmode` without session see a 404 Not Found page.
- Escrow hold fee must be exactly 0% (₹0); platform transaction fee is charged strictly at milestone settlement.
- Anti-circumvention policy must warn users in chat and flag off-platform payment attempts (WhatsApp, UPI, PayPal, phone numbers) for admin review.
- All unit and E2E tests must pass with 0 errors and 0 build warnings.

## Review Focus

- Uninvited registration attempts must be prevented without an invite code.
- Auto-filling invite code from `/?invite=CODE` must work seamlessly.
- Escrow calculation must show 0% holding fee and 10% completion fee.
- Admin force-release and force-refund actions must update contract payment status and record audit logs.
- God Mode chat inspector must render conversations between any creator and brand with flagged keywords highlighted.

---

### Task 1: Beta Access & Invite Code Service (`betaAccessService.ts`)

**Files:**
- Create: `src/services/betaAccessService.ts`
- Test: `src/services/__tests__/betaAccessService.test.ts`

- [ ] Write failing unit test in `src/services/__tests__/betaAccessService.test.ts` verifying code validation (valid, invalid, expired, max uses reached, role restrictions), waitlist submission, and code creation.
- [ ] Implement `betaAccessService.ts`:
  - Interface `BetaInviteCode` (`code`, `roleConstraint`, `maxUses`, `usedCount`, `isActive`, `expiresAt`, `notes`).
  - Interface `WaitlistEntry` (`id`, `fullName`, `email`, `role`, `handle`, `category`, `status`, `submittedAt`).
  - Methods: `validateInviteCode(code, role)`, `redeemInviteCode(code, userId, email)`, `submitWaitlist(entry)`, `generateInviteCode(params)`, `getWaitlist()`, `approveWaitlistEntry(id)`.
  - Default master codes: `ALPHA-2026`, `CREATOR-VIP`, `BRAND-VIP`.
- [ ] Run `npx vitest run src/services/__tests__/betaAccessService.test.ts` to verify all tests pass.
- [ ] Commit changes: `git commit -m "feat(beta): implement beta access and invite code service with unit tests"`.

---

### Task 2: Gated Registration & Waitlist UI on Welcome Screen

**Files:**
- Modify: `src/features/auth/components/SignUpForm.tsx`
- Modify: `src/features/auth/components/WelcomePage.tsx`
- Modify: `src/features/auth/components/WelcomeAuth.tsx`

- [ ] Update `SignUpForm.tsx` to include an **Invite Code** field:
  - Auto-fills from URL query parameter `/?invite=...`.
  - Real-time inline verification using `betaAccessService.validateInviteCode`.
  - Displays green badge on valid code (`✓ Verified VIP Pass`) or clear error if missing/invalid.
  - Links to "Don't have an invite code? Request Beta Access".
- [ ] Create `RequestBetaAccessModal.tsx` in `src/features/auth/components/`:
  - 3-field modal: Full Name, Email, Role (Creator or Brand), Primary Handle/Link.
  - Submits to `betaAccessService.submitWaitlist`.
  - Displays success ticket confirmation with queue status.
- [ ] Award "Founding Creator" / "Alpha Brand" badge upon account creation in `authService.ts`.
- [ ] Verify manually and via Vitest.
- [ ] Commit changes: `git commit -m "feat(auth): add invite-only gating and request access waitlist modal"`.

---

### Task 3: Zero Holding Fee Escrow Model & Anti-Circumvention Policy

**Files:**
- Modify: `src/services/contractService.ts`
- Modify: `src/services/messagingService.ts`
- Modify: `src/components/contracts/BrandContractModal.tsx`
- Test: `src/services/__tests__/contractService.test.ts`
- Test: `src/services/__tests__/messagingService.test.ts`

- [ ] Update `ContractService.calculatePaymentBreakdown` in `src/services/contractService.ts`:
  - Set `protectionAmountRate: 0` (0% escrow holding fee).
  - Explicit `escrowHoldingFee: 0`.
  - Platform fee (10%) calculated for deduction strictly on milestone approval and release.
  - Update pre-signature disclosure labels.
- [ ] Update `messagingService.ts`:
  - Implement `scanMessageForCircumvention(content: string)`:
    - Regex patterns for phone numbers, WhatsApp, UPI handles (`@okaxis`, `@okhdfcbank`, `@paytm`), PayPal, external crypto.
    - Flags flagged messages in `moderation_chat_flags`.
  - Add anti-circumvention warning banner component to direct message header.
- [ ] Update unit tests in `contractService.test.ts` and `messagingService.test.ts`.
- [ ] Run vitest to ensure all tests pass.
- [ ] Commit changes: `git commit -m "feat(escrow): implement 0% escrow hold fee and anti-circumvention chat monitor"`.

---

### Task 4: Secret Air-Gapped `/godmode` Route & Authentication

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/admin/AdminLoginPage.tsx`
- Modify: `src/components/admin/SuperAdminLayout.tsx`

- [ ] Update `App.tsx`:
  - Set route `/godmode` as the exclusive superadmin entry point.
  - Ensure unauthenticated visits to `/godmode` show dedicated `AdminLoginPage`.
  - Route `/godmode/login` renders `AdminLoginPage`.
  - If a logged-in Creator or Brand visits `/godmode`, render 404 `NotFoundPage` (complete air-gap).
  - Remove any `/admin` references from client-facing layouts.
- [ ] Verify that Creator Studio and Brand Portal have zero links or buttons to `/godmode`.
- [ ] Commit changes: `git commit -m "feat(security): isolate superadmin godmode route at /godmode with stealth access"`.

---

### Task 5: God Mode Modules: Chat Inspector & Escrow Override

**Files:**
- Create: `src/components/admin/AdminGodModeChatInspector.tsx`
- Modify: `src/components/contracts/AdminContractsGovernance.tsx`
- Create: `src/components/admin/AdminBetaWaitlistView.tsx`
- Modify: `src/components/admin/SuperAdminLayout.tsx`

- [ ] Implement `AdminGodModeChatInspector.tsx`:
  - Dropdown to select any conversation thread between any Creator and Brand.
  - Live message viewer displaying chronological message timeline, attachments, and timestamps.
  - **Flagged Incidents Tab**: Highlights messages with anti-circumvention or harassment triggers with one-click user warning/suspension.
- [ ] Upgrade `AdminContractsGovernance.tsx`:
  - Add **Force Release Escrow to Creator** button (releases locked funds immediately).
  - Add **Force Refund Escrow to Brand** button (reverses escrow hold).
  - Prompt for mandatory admin reason and log to `auditTrail`.
- [ ] Implement `AdminBetaWaitlistView.tsx`:
  - Table of waitlist applicants with one-click **"Approve & Issue Invite Code"**.
  - Invite Code Generator: create custom codes (`ALPHA-50`), set max redemptions, expiry, and copy direct invite link.
- [ ] Connect new views into `SuperAdminLayout.tsx` tabs: `Overview`, `Beta Invites`, `Chat Inspector`, `Contracts Governance`, `Users`, `Moderation`, `Audit Logs`.
- [ ] Commit changes: `git commit -m "feat(godmode): implement chat forensic inspector, escrow override and beta invite manager"`.

---

### Task 6: Comprehensive Verification, E2E Testing, Production Build & Deploy

**Files:**
- Modify: `scripts/run-all-e2e.cjs`

- [ ] Add E2E tests in `scripts/run-all-e2e.cjs`:
  - Verify uninvited registration blocked without invite code.
  - Verify registration succeeds with `ALPHA-2026` invite code.
  - Verify `/godmode` stealth routing and login.
  - Verify God Mode Chat Inspector and Escrow Override controls.
- [ ] Run full test suite: `npm test` and `npm run test:e2e`.
- [ ] Run `npm run build` and `npm run lint`.
- [ ] Package clean production archives via `node scripts/package-zip.cjs`.
- [ ] Push commit to GitHub `main` and deploy to Vercel.
- [ ] Commit changes: `git commit -m "chore(release): complete private beta engine and godmode release certification"`.
