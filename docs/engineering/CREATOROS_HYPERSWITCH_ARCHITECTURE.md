# CreatorOS Hyperswitch Payment Orchestration Architecture Assessment

**Document Version:** 1.0.0-PROD  
**Date:** November 11, 2026  
**Auditor / Infrastructure Engineer:** Payment Systems & Cloud Infrastructure Lead  
**Evaluation Target:** Juspay Hyperswitch (`https://github.com/juspay/hyperswitch`)  
**Status Verdict:** `ARCHITECTURE READY` (Sandbox Prepared, Feature Flag Guarded)

---

## 1. Executive Summary

This engineering document provides a thorough technical evaluation of **Juspay Hyperswitch** as a unified payment and payout orchestration layer for **CreatorOS**.

Hyperswitch is an open-source, high-performance financial switch developed in **Rust** by Juspay Technologies under the Apache 2.0 license. It routes inbound payments, outbound disbursements, and post-transaction events (refunds, disputes) across 50+ payment connectors worldwide.

### Core Verdict
- **Hyperswitch Assessment Status:** `ARCHITECTURE READY`
- **Recommended Immediate Strategy:** CreatorOS utilizes the **Provider-Agnostic Payment Adapter Layer** with direct Stripe, PayPal, and Controlled Manual UPI rails active in production, while Hyperswitch is pre-wired behind `HYPERSWITCH_ENABLED=false` and sandbox-ready.
- **Key Finding on Serverless Compatibility:** Hyperswitch **cannot run as an embedded serverless function on Vercel**. It requires a dedicated persistent container or virtual machine hosting the compiled Rust binary, a dedicated PostgreSQL database, and a Redis cluster for stateful transaction caching.

---

## 2. Technical Stack & Engine Deep-Dive

### 2.1 Engine Internals
- **Language & Runtime:** Rust (Tokio asynchronous runtime).
- **Web Framework:** Actix-web / Axum (depending on upstream release branch).
- **ORM / Persistence:** Diesel & SQLx targeting PostgreSQL with connection pooling.
- **Caching & Ephemeral Locks:** Redis (used for distributed locking, rate limiting, and idempotency deduplication).
- **Cryptographic Enclaves:** AES-256-GCM and KMS integration for tokenized Cardholder Data Environment (CDE) protection.

```
                    ┌──────────────────────────────────────────────┐
                    │            CreatorOS Web Application          │
                    │      (Next.js / React / Vercel Edge/Node)    │
                    └──────────────────────┬───────────────────────┘
                                           │
                        HTTPS / JSON + API Key (HMAC Auth)
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          Hyperswitch Router Service                              │
│                (Rust / Tokio / Actix-web Container on AWS / GCP)                 │
│                                                                                  │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐    │
│   │   Routing Engine    │   │  Smart Retry / Fall │   │ Cryptographic Vault │    │
│   │  (Geo, Cost, Health)│   │  (Auto Failover)    │   │  (Tokenized VPA/PAN)│    │
│   └──────────┬──────────┘   └──────────┬──────────┘   └──────────┬──────────┘    │
└──────────────┼─────────────────────────┼─────────────────────────┼───────────────┘
               │                         │                         │
      ┌────────┴────────┐       ┌────────┴────────┐       ┌────────┴────────┐
      ▼                 ▼       ▼                 ▼       ▼                 ▼
┌───────────┐     ┌───────────┐   ┌───────────┐     ┌───────────┐   ┌───────────┐
│  Stripe   │     │  PayPal   │   │ Razorpay  │     │ Cashfree  │   │  Adyen    │
│ Connector │     │ Connector │   │ Connector │     │ Connector │   │ Connector │
└───────────┘     └───────────┘   └───────────┘     └───────────┘   └───────────┘
```

---

## 3. Connector Matrix & Financial Rail Capabilities

### 3.1 Stripe Connector
- **Inbound Payments:** Complete support for Cards, Apple Pay, Google Pay, and ACH via Stripe PaymentIntents API.
- **Outbound Payouts:** Hyperswitch supports payout requests routed to Stripe, but multi-party creator marketplace payouts rely heavily on **Stripe Connect** (Custom/Express connected accounts with manual or automated balance transfer schedules).
- **3D Secure (3DS):** Frictionless flow supported through Hyperswitch unified SDK and redirect URLs.

### 3.2 PayPal Connector
- **Inbound Payments:** Complete support for PayPal Wallet and PayPal Checkout sessions.
- **Outbound Payouts:** Hyperswitch integrates with PayPal Payouts API (`/v1/payments/payouts`), allowing batched disbursements to PayPal email addresses.

### 3.3 Indian Domestic UPI Rails
- **NPCI Connectivity Reality:** Hyperswitch **does not connect directly to NPCI** (National Payments Corporation of India). Direct NPCI UPI switch connectivity is restricted by the Reserve Bank of India (RBI) strictly to scheduled commercial banks and licensed Payment Aggregators (PAs).
- **How Hyperswitch Handles UPI:** Hyperswitch routes Indian UPI traffic through upstream Indian domestic connectors (such as Razorpay, Cashfree, PayU, or Billdesk).
- **Outbound UPI Disbursements:** Outbound payments to a UPI Virtual Payment Address (e.g., `creator@okhdfcbank`) cannot be fulfilled via Stripe US or PayPal US accounts. They must pass through an Indian Nodal/Escrow account via domestic payout APIs (RazorpayX, Cashfree Payouts) or via CreatorOS's **Controlled Manual Nodal Bank Transfer Workflow** with recorded bank UTR numbers.

---

## 4. Deployment Models Evaluated

| Dimension | Model A: Self-Hosted Hyperswitch | Model B: Hyperswitch Cloud | Model C: Direct Provider + Hyperswitch Adapter (Current) |
| :--- | :--- | :--- | :--- |
| **Hosting Infrastructure** | AWS ECS / EKS / GCP Cloud Run (Docker, Min 2 vCPU, 4GB RAM) | Managed SaaS by Juspay | Vercel Serverless + Supabase |
| **Dependencies** | Postgres 15+, Redis 7+, AWS KMS | Managed by vendor | Supabase PostgreSQL + Edge Functions |
| **Operational Overhead** | High (Rust maintenance, DB migrations, KMS key rotation) | Low (API integration only) | Minimal (Standard TypeScript SDKs) |
| **Monthly Cost** | ~$150-$300 (EC2/ECS + RDS + ElastiCache) | Usage-based tier | $0 additional infrastructure overhead |
| **Multi-Processor Routing** | Dynamic multi-gateway failover | Dynamic multi-gateway failover | Single provider per transaction type |
| **Production Risk** | High if self-hosted without dedicated DevOps team | Dependent on third-party SLA | Zero risk; direct provider SDKs |

### Architectural Decision
**Model C (Current Implementation) with Hyperswitch Prepared Behind a Feature Flag:**
CreatorOS maintains direct integrations with Stripe, PayPal, and UPI for immediate zero-friction operation. The `HyperswitchAdapter` implements the common `PaymentProvider` interface, allowing instant redirection of all traffic through Hyperswitch once the external Docker container or Hyperswitch Cloud account is provisioned.

---

## 5. API Mapping & Adapter Contract

The CreatorOS `HyperswitchAdapter` (`src/services/payments/providers/hyperswitch/HyperswitchAdapter.ts`) normalizes CreatorOS parameters to Hyperswitch REST endpoints:

### 5.1 Inbound Payments: `/payments`
```
CreatorOS CreatePaymentParams
  ├── amount (cents/integers)       ──►  Hyperswitch /payments body:
  ├── currency ('USD', 'INR')             ├── amount
  ├── contractId                          ├── currency
  └── returnUrl                           ├── capture_method: "automatic"
                                          ├── client_secret
                                          └── metadata: { contract_id, brand_id }
```

### 5.2 Outbound Creator Payouts: `/payouts/create`
```
CreatorOS PayoutParams
  ├── amount                        ──►  Hyperswitch /payouts/create body:
  ├── currency                            ├── amount
  ├── recipientIdentifier (email/VPA)     ├── currency
  └── payoutMethodId                      ├── payout_type: "customer"
                                          ├── payout_method_data: { ... }
                                          └── confirm: false (manual nodal review)
```

### 5.3 Webhook Handling: `/webhooks`
Hyperswitch sends signed webhook payloads with event types such as `payment_succeeded`, `payment_failed`, `payout_success`, and `payout_failed`. The CreatorOS `WebhookVerifier` validates the payload signature before triggering the state transition in `payment_transactions` and `payout_requests`.

---

## 6. Activation Criteria & Step-by-Step Migration Plan

When CreatorOS scales to require automated least-cost multi-acquirer routing:

1. **Step 1: Container Deployment**
   Deploy `juspay/hyperswitch-router:latest` on AWS ECS Fargate or GCP Cloud Run with attached Amazon RDS PostgreSQL and Amazon ElastiCache Redis.
2. **Step 2: Credential Configuration**
   Populate environment variables:
   - `HYPERSWITCH_API_BASE_URL=https://api.hyperswitch.creatoros.com`
   - `HYPERSWITCH_API_KEY=hs_live_sec_...`
   - `HYPERSWITCH_PUBLISHABLE_KEY=hs_pub_...`
   - `HYPERSWITCH_WEBHOOK_SECRET=whsec_hs_...`
3. **Step 3: Connector Provisioning**
   In the Hyperswitch Control Center, register Stripe and PayPal merchant API keys, along with Indian domestic payout credentials.
4. **Step 4: Flag Toggle**
   Update `HYPERSWITCH_ENABLED=true` in Vercel production environment variables. All payment calls automatically route through the Hyperswitch orchestrator with zero application code changes.
