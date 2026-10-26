# CreatorOS — Agent Architecture & Engineering Standards

## 1. Core Principles
- **Preserve Working Functionality**: Never rewrite what works. Inspect first, verify existing implementations, and make minimal surgical edits.
- **Evidence-Based Engineering**: Every claim of "PASS" or "FIXED" must be backed by real execution logs, build passes, or test outputs.
- **Caveman Terse Style**: Omit conversational filler. Report in high-density format: `FILE:LINE — FINDING — IMPACT — FIX`.

---

## 2. Architectural Boundaries & Rules

### Auth & Security
- **Single Source of Truth**: Welcome page auth resides strictly in `src/features/auth/components/WelcomeAuth.tsx` & `WelcomePage.tsx`. No duplicate auth headers or modal forms.
- **Zero Client-Side Trust**: Client states (balances, permissions, roles) are UI projections only. Real enforcement occurs server-side via Supabase Row-Level Security (RLS) or backend API verification.
- **Admin Enclave**: `/admin` is strictly isolated. Regular users navigating to `/admin` receive a 403 Forbidden `AccessDeniedPage`. Admin credentials require MFA verification.
- **Token Storage**: In production, prefer secure HttpOnly cookie sessions over raw `localStorage`. Never store production secrets, service-role keys, or payment tokens in client storage.

### Contracts & Payments
- **Unidirectional Creation**: Only Brands create contracts. Creators review, negotiate, accept, submit deliverables, and dispute. Creators MUST NOT have contract-creation capabilities.
- **Fee Transparency**: Standard 10% platform fee displayed to brands prior to payment initiation.
- **State Machine**: Contract lifecycle is strictly managed:
  `DRAFT → SUBMITTED → UNDER_REVIEW → REVISION_REQUIRED → APPROVED → FUNDED → AWAITING_CREATOR → ACCEPTED → ACTIVE → DELIVERABLE_SUBMITTED → CLIENT_REVIEW → REVISION_REQUESTED → APPROVED → PAYOUT_PENDING → PAID → COMPLETED`.
  Exceptions: `CANCELLED`, `DISPUTED`, `EXPIRED`, `REFUNDED`.
- **Payment Verification**: No fake banking. Real integration abstraction via `PaymentProvider` (Stripe Connect & PayPal). Webhooks must enforce cryptographic signature validation and idempotency keys.

### CreatorOS Live & AR
- **Modular Pipeline**: `Camera → Face/AR Tracking → Effect Engine → Renderer → LiveKit/WebRTC → Viewer`.
- **Provider-Independent**: Do not tightly couple the app to a single proprietary vendor. Support fallback to local WebGL / MediaPipe effects and graceful quality degradation on low-tier hardware.
- **Moderation Enforced**: Hosts and designated moderators can mute, kick, ban, and hide inappropriate chat or stream content.

### Virtual Gifts & Ledgers
- **Immutable Ledger**: Double-entry ledger architecture. Purchases, coin balances, gift transfers, and payouts are tracked with immutable audit records. No client-side balance mutations.

---

## 3. Design System & UX Standards
- **Aesthetic**: Premium Light Studio environment combining Soft UI (subtle neumorphic insets/depth) and Liquid Glass (frosted translucent panels for navigation and floating overlays).
- **No Neon / No Gaming HUDs**: High-contrast typography (`#0F172A`), balanced electric cyan accents (`#00869B` / `#00B4D8`), soft studio surface backgrounds (`#EDF0F4`).
- **Touch & Accessibility**: Minimum 44px clickable touch targets. WCAG 2.1 AA contrast compliance. Respect `prefers-reduced-motion`.
- **Responsive Target Matrix**: 320px, 375px, 390px, 430px, 768px, 1024px, 1440px+. Never squeeze desktop multi-column layouts into mobile viewports.

---

## 4. Verification Checklist
- `npm run build`: Must pass `tsc -b && vite build` with 0 TypeScript/Vite errors.
- `npm run lint`: Must pass `oxlint` with 0 errors.
- Routes: All public (`/`, `/terms`, `/privacy`, `/support`), creator, brand, and admin routes must render without runtime crashes or uncaught console exceptions.
