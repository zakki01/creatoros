# CreatorOS — Commercial Creative Operating System

> Next-generation platform bridging creators and enterprise brands through verified discovery, commercial contracts, protected milestone escrow holds, and collaborative campaign delivery.

---

## 1. Overview & Architecture

CreatorOS is an independent, mobile-first creative network engineered for high-trust commercial partnerships:

- **Discover Network**: Multi-format creative stream (`Reels`, `Shots`, `Blogs`, `Trending`) with contextual interaction (like, react, comment, share, save, connect).
- **Brand Workspace**: Campaign organization, creator discovery, structured rate cards, and direct communication.
- **Commercial Contract Engine**: 8-step contract builder, automated predatory-term risk scanner, structured deliverables, and 13-stage lifecycle state machine.
- **Protected Payments**: Escrow holds via Stripe Connect and PayPal Commerce Platform with automated 10% platform fee calculation and 20% Project Protection reserve.
- **Creator Portal**: Digital agreement review (accept/counter/decline), deliverable file upload versioning (v1, v2), and protected payout tracking.
- **Super Admin Governance**: Dispute arbitration workbench, platform fee policy management, content moderation, and operational support triage.
- **Support System**: User ticket submission (`/support`), status tracking (`#CR-10248`), and internal staff workbench (`/admin/support`).
- **Legal Compliance**: Comprehensive Terms of Service (`/terms`) and Privacy Policy (`/privacy`).

---

## 2. Technology Stack

- **Core**: React 19, TypeScript 5.9, Vite 8.3
- **Styling & Design System**: Tailwind CSS v3, Roboto typography hierarchy, subtle glassmorphic surfaces, fluid 200ms transitions, `prefers-reduced-motion` compliance.
- **Iconography**: Lucide React
- **Database & Backend Ready**: Supabase (PostgreSQL with Row Level Security, Storage, Auth, and Realtime)
- **Payment Abstraction**: `PaymentProvider` interface supporting Stripe Connect and PayPal Commerce Platform
- **Automated Verification**: Puppeteer end-to-end browser testing suite with 0px horizontal overflow enforcement

---

## 3. Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/your-org/creatoros.git
cd creatoros

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Start Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

---

## 4. Environment Variables

Configure the following variables in `.env.local` for local execution or your Vercel / hosting provider settings:

| Variable | Description |
| :--- | :--- |
| `VITE_APP_URL` | Application root URL (e.g. `https://creatoros.ai` or `http://localhost:5173`) |
| `VITE_SUPABASE_URL` | Supabase project API endpoint URL |
| `VITE_SUPABASE_ANON_KEY` | Public client anonymous Supabase key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side privileged key (Keep private, never commit to browser) |
| `DATABASE_URL` | Direct PostgreSQL connection string for migrations |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID for Single Sign-On |
| `VITE_APPLE_CLIENT_ID` | Apple Sign In Client Service ID |
| `VITE_FACEBOOK_APP_ID` | Facebook Developer App ID |
| `STRIPE_SECRET_KEY` | Stripe API Secret Key |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook verification secret |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Client Key |
| `PAYPAL_CLIENT_ID` | PayPal REST API Client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal REST API Secret |

---

## 5. Application Route Structure

### Public & Community
- `/`: Welcome & Dynamic Creative Showcase (or default authenticated workspace)
- `/terms` (`/legal/terms`): Operational Terms of Service (27 structured sections)
- `/privacy` (`/legal/privacy`): Platform Privacy & Data Governance Notice
- `/support`: Support Portal & Ticket Submission (`/support/tickets/new`)
- `/404`: Polished 404 Not Found error recovery
- `/500`: System 500 error boundary recovery

### Brand Experience (`/brand/*`)
- `/brand/contracts`: Commercial Contract Management Dashboard
- `/brand/contracts/new`: 8-step Contract Builder with Autosave & Risk Scanner
- `/brand/contracts/:id`: Active Delivery Workspace (revisions, milestones, review timer)

### Creator Experience (`/creator/*`)
- `/creator`: Creator workspace with portfolio, proposals, and contracts portal

### Super Admin Command Center (`/admin/*`)
- `/admin/login`: Dedicated, isolated administrative authentication
- `/admin`: Command Center overview & platform metrics
- `/admin/contracts`: Contracts Table & Dispute Arbitration Workbench
- `/admin/support`: Support Desk & Ticket Triage (with internal notes)
- `/admin/moderation`: Content moderation and flag resolutions

---

## 6. Database Deployment (Supabase)

The production database schema is declared in [`supabase/schema.sql`](supabase/schema.sql). To deploy:

1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste the contents of `supabase/schema.sql` and execute.
4. All tables and Row Level Security (RLS) policies will be automatically provisioned.

---

## 7. Production Build & Deployment

```bash
# Typecheck and compile production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel
1. Connect the GitHub repository in [Vercel](https://vercel.com).
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Configure environment variables in Vercel project settings matching `.env.example`.

---

## 8. License & Commercial Rights

Copyright © 2026 CreatorOS Inc. All rights reserved. Commercial use subject to authorized licensing agreements.
