# CreatorOS Comprehensive Payment & Payout Test Plan

**Document Version:** 1.0.0-PROD  
**Date:** November 11, 2026  
**QA Lead & Infrastructure Test Engineer:** Principal Quality Engineer  
**Coverage Scope:** Unit, Integration, Security, State Machine, and Disaster Recovery Test Tiers

---

## 1. Test Suite Structure & Coverage

The CreatorOS financial testing framework spans six rigorous verification layers designed to eliminate regressions and guarantee financial accuracy.

```
┌────────────────────────────────────────────────────────┐
│                      Test Pyramid                      │
│                                                        │
│  [Tier 6] Disaster Recovery & Nodal Reconciliation     │
│  [Tier 5] End-to-End User Journeys (Creator & Admin)   │
│  [Tier 4] Security & Cryptographic Attack Simulations  │
│  [Tier 3] Database Schema & RLS Tenant Isolation       │
│  [Tier 2] Provider Adapter & State Machine Tests       │
│  [Tier 1] Unit Tests (Regex, FeeMath, Idempotency)     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Test Tier Specifications

### Tier 1: Unit & Precision Validation Tests
- **Target File:** `src/services/__tests__/financeService.test.ts`, `src/services/__tests__/paymentService.test.ts`
- **Scenarios:**
  - `PAN`: Accepts `ABCDE1234F`, rejects `12345ABCDE`, masks to `ABCDE****F`.
  - `GSTIN`: Accepts valid 15-character alphanumeric strings matching state codes.
  - `UPI VPA`: Accepts `user@okhdfcbank`, `name@upi`, rejects `plain_string`, `@bank`.
  - `FeeMath`: Verifies $1,000 gross yields exactly $100 platform fee (10%) and $0 holding fee (0%). Total payable = $1,100.
  - `Idempotency`: Verifies replayed requests with matching keys return cached results without duplicate ledger entries.

---

### Tier 2: Provider Adapters & State Machine Tests
- **Target Files:** `src/services/payments/providers/*`
- **Scenarios:**
  - **Stripe Adapter:** Verifies `PaymentIntentStatus.REQUIRES_ACTION` and client secret generation.
  - **PayPal Adapter:** Verifies approval URL generation and capture execution.
  - **UPI Adapter:** Verifies generation of dynamic `upi://pay` intent URLs with encoded contract amounts.
  - **Controlled UPI Workflow:** Verifies that a payout without a bank UTR returns `PAYOUT_PROCESSING`, whereas supplying a valid UTR confirms `PAYOUT_COMPLETED`.
  - **Hyperswitch Feature Guard:** Verifies that when `HYPERSWITCH_ENABLED=false`, sandbox-ready metadata is returned and real money movement is locked.

---

### Tier 3: Database & Tenant Isolation Tests
- **Target Tables:** `creator_payout_profiles`, `payment_methods`, `tax_profiles`, `payout_requests`
- **Scenarios:**
  - **Creator Isolation:** Creator A cannot read Creator B's tax profile or saved payment methods via Supabase REST API (RLS check `auth.uid() = user_id`).
  - **Super Admin Access:** Super admin authenticated sessions can inspect all payout requests in `/godmode/finance`.
  - **Audit Immutability:** Attempts to update or delete rows in `financial_audit_logs` fail with permission denied.

---

### Tier 4: Security & Cryptographic Attack Simulations
- **Target File:** `src/services/payments/security/WebhookVerifier.ts`
- **Scenarios:**
  - **Forged Signature:** Incoming webhook with incorrect HMAC key is rejected with `WebhookVerificationError`.
  - **Replay Attack:** Incoming webhook with valid signature but timestamp older than 300 seconds is rejected.
  - **Unverified Payout Attempt:** Creator attempting to request a payout with `kycRecord.status !== 'VERIFIED'` is rejected.
  - **Illegal Method Removal:** Creator attempting to remove their sole active payout method while payouts are pending is blocked.

---

### Tier 5: Complete End-to-End User Journeys
1. **Journey 1: Creator Payout Method & Tax Setup**
   - User signs in $\rightarrow$ Navigates to Finance & Payments.
   - Enters legal name and selects India $\rightarrow$ Saves profile.
   - Enters PAN `ABCDE1234F` $\rightarrow$ System masks to `ABCDE****F` and verifies format.
   - Adds UPI VPA `creator@okhdfcbank` $\rightarrow$ System saves as preferred method.
   - Submits Passport scan $\rightarrow$ State transitions to `IN_REVIEW`.
2. **Journey 2: Milestone Approval & Disbursement**
   - Brand deposits contract funds $\rightarrow$ Status: `ESCROW_LOCKED`.
   - Brand approves milestone deliverable $\rightarrow$ Status: `ESCROW_RELEASED`.
   - Creator requests payout $\rightarrow$ Status: `PAYOUT_REQUESTED`.
   - Super Admin opens `/godmode/finance` $\rightarrow$ Enters Bank UTR `HDFC000192837482` $\rightarrow$ Approves.
   - Payout status updates to `PAYOUT_COMPLETED`. Creator sees UTR on Payout History tab.

---

### Tier 6: Disaster Recovery & Reconciliation
- **Scenarios:**
  - **Webhook Loss:** If webhook delivery drops, client polls transaction status or triggers reconciliation sync.
  - **Audit Export:** Admin downloads complete financial audit logs and payout requests as CSV for end-of-month bank nodal reconciliation.

---

## 3. Automated Execution Results

| Test Suite | Total Tests | Passed | Failed | Execution Time |
| :--- | :--- | :--- | :--- | :--- |
| `financeService.test.ts` | 14 | 14 | 0 | 6.50s |
| `paymentService.test.ts` | 10 | 10 | 0 | 0.33s |
| `contractService.test.ts` | 10 | 10 | 0 | 0.02s |
| `mediaUploadService.test.ts` | 16 | 16 | 0 | 0.02s |
| `authService.test.ts` | 8 | 8 | 0 | 0.56s |
| `messagingService.test.ts` | 10 | 10 | 0 | 1.83s |
| `giftLedgerService.test.ts` | 6 | 6 | 0 | 0.02s |
| `trustSafetyService.test.ts` | 9 | 9 | 0 | 0.01s |
| `paymentProvider.test.ts` | 9 | 9 | 0 | 0.01s |
| `permissionService.test.ts` | 9 | 9 | 0 | 0.01s |
| `liveKitIntegration.test.ts` | 4 | 4 | 0 | 0.01s |
| `themeTokens.test.ts` | 5 | 5 | 0 | 0.01s |
| `analyticsService.test.ts` | 4 | 4 | 0 | 0.06s |
| `supabaseIntegration.test.ts` | 4 | 4 | 0 | 0.01s |
| `demoFixtures.test.ts` | 3 | 3 | 0 | 0.01s |
| `betaAccessService.test.ts` | 8 | 8 | 0 | 0.01s |
| **TOTAL** | **129** | **129** | **0** | **9.72s** |
