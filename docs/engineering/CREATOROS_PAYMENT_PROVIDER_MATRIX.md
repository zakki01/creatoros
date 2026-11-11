# CreatorOS Payment & Payout Provider Matrix

**Document Version:** 1.0.0-PROD  
**Date:** November 11, 2026  
**Auditor:** Senior Payment Infrastructure Architect  
**Scope:** Evaluation of Inbound Processing, Outbound Creator Settlements, and Regulatory Compliance

---

## 1. Provider Comparison Matrix

| Feature / Dimension | PayPal | Stripe Connect | UPI (Direct Nodal) | Juspay Hyperswitch | Plaid / Direct Bank OAuth |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Operational Role** | Global Wallet & Payout Rail | Marketplace Acquirer & Payout Rail | Indian Domestic Instant Rail | Multi-Processor Orchestrator | **DISCARDED / BANNED** |
| **Inbound Payments (Brand)** | Supported (Checkout / Wallet) | Supported (Cards, ACH, Apple Pay) | Supported (Dynamic QR / Intent) | Supported (Smart Routing) | Not Applicable |
| **Outbound Payouts (Creator)** | Supported (Mass Payouts API) | Supported (Transfers to Connect) | Supported (Manual Nodal Transfer + UTR) | Supported (via Connectors) | Direct collection banned |
| **Geographic Coverage** | 200+ countries | 46+ countries | India (Domestic Only) | Global (Depends on connectors) | N/A (Security Risk) |
| **Settlement Currency** | USD, EUR, GBP, AUD, CAD (25+) | 135+ Currencies | INR Only | Multi-currency normalization | N/A |
| **Identity / KYC Requirements** | PayPal account verification | Stripe KYC onboarding (Passport, ID) | CreatorOS KYC (PAN / ID) + Bank VPA | Delegated to Acquirers / Connectors | N/A |
| **Tax Information Requirements** | W-8BEN / W-9 on file | 1099-K / W-8 / W-9 automated | Indian PAN mandatory (TDS 194J/194O) | Pass-through metadata | N/A |
| **CreatorOS Fee Policy** | 10% platform, 0% holding fee | 10% platform, 0% holding fee | 10% platform, 0% holding fee | 10% platform, 0% holding fee | N/A |
| **Provider Transaction Fees** | ~2.9% + $0.30 (Inbound), $0.25 (Payout) | ~2.9% + $0.30 (Inbound), $2/mo + 0.25% | ~0.0% to 0.5% (Domestic nodal) | Gateway fees + switch usage | N/A |
| **Dispute / Chargeback Liability** | Seller Protection eligible | Handled via Stripe Dashboard | Extremely low / Irreversible | Unified dispute aggregation | N/A |
| **Current Platform Status** | **ACTIVE (Direct)** | **ACTIVE (Direct)** | **ACTIVE (Manual Nodal)** | **SANDBOX READY (Guarded)** | **STRICTLY EXCLUDED** |

---

## 2. Product Decisions & Rationale

### 2.1 Why Direct Bank Credentials (Plaid / Open Banking) Are Discarded
1. **Security & Regulatory Exposure:** Storing raw routing numbers or holding OAuth tokens to creator bank accounts introduces catastrophic PCI-DSS/SOC2 scope expansions and liability in the event of credential theft.
2. **Global Creator Fragility:** Plaid operates primarily in the US and parts of the UK/EU. For Indian, Southeast Asian, and Latin American creators, direct bank linking fails or requires fragmented regional aggregators.
3. **Fraud & Chargeback Isolation:** Paying creators via PayPal, Stripe Connect, or regulated UPI VPA endpoints isolates CreatorOS from direct banking liability.

### 2.2 Why UPI Uses the Controlled Manual Nodal Workflow
1. **NPCI Regulation:** In India, direct automated outward remittances to third-party VPAs require an RBI-authorized Payment Aggregator license or direct nodal banking APIs (e.g. ICICI Corporate Internet Banking API, RazorpayX).
2. **Auditability & Zero Fraud Risk:** CreatorOS enforces a two-man rule:
   - Creator submits withdrawal request $\rightarrow$ Validated against KYC and available escrow balance.
   - Platform Finance Officer executes transfer via corporate bank portal $\rightarrow$ Inputs the immutable 12-digit **Bank UTR (Unique Transaction Reference)** into `/godmode/finance`.
   - System updates payout record to `PAYOUT_COMPLETED`, audit logs the action, and displays the UTR to the creator.

---

## 3. Financial Fee Architecture

CreatorOS enforces a transparent and predictable fee breakdown:

$$\text{Total Payable by Brand} = \text{Creator Gross Compensation} + \text{Platform Fee (10\%) } + \text{Escrow Holding Fee (0\%)}$$

- **Gross Creator Compensation:** The agreed milestone budget (e.g. $1,000.00).
- **Platform Fee:** Fixed at 10.0% ($100.00). Deducted upon milestone clearance.
- **Escrow Holding Fee Policy:** **0.00% ($0.00)**. CreatorOS does not charge fees for funds held safely in escrow pending brand deliverable approval.
- **Net Creator Disbursement:** $1,000.00 disbursed via preferred rail (minus any third-party recipient currency conversion charged by PayPal or creator's local bank).
