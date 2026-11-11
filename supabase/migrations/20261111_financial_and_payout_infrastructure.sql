-- ============================================================================
-- CreatorOS Production Financial, Tax, Identity & Payout Infrastructure
-- Migration: 20261111_financial_and_payout_infrastructure.sql
-- ============================================================================

-- Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. CREATOR PAYOUT PROFILES (Legal Personal/Business Identity)
-- Kept separate from public creator handle and portfolio profile.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creator_payout_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  legal_name TEXT NOT NULL,
  display_name TEXT,
  country TEXT NOT NULL DEFAULT 'IN',
  account_type TEXT NOT NULL DEFAULT 'individual' CHECK (account_type IN ('individual', 'business')),
  business_name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_payout_profiles_user ON public.creator_payout_profiles(user_id);

-- ----------------------------------------------------------------------------
-- 2. PAYMENT METHODS (PayPal, Stripe Connect, UPI)
-- Direct bank collection is strictly disabled per architecture decision.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('paypal', 'stripe', 'upi')),
  identifier TEXT NOT NULL, -- e.g. PayPal email, UPI VPA (user@okhdfcbank)
  is_preferred BOOLEAN NOT NULL DEFAULT false,
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'restricted')),
  provider_account_id TEXT, -- Stripe Connected Account ID (acct_...) or PayPal Payer ID
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_provider ON public.payment_methods(provider_type);

-- ----------------------------------------------------------------------------
-- 3. TAX PROFILES (Country-aware Tax Records e.g. India PAN / GSTIN)
-- Sensitive identifiers are masked for client display; private access strictly enforced.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tax_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  country TEXT NOT NULL DEFAULT 'IN',
  tax_id_type TEXT NOT NULL DEFAULT 'pan' CHECK (tax_id_type IN ('pan', 'ein', 'ssn', 'vat', 'other')),
  tax_id_masked TEXT NOT NULL, -- e.g. ABCDE****F
  tax_id_encrypted TEXT,
  gstin TEXT, -- Optional Indian GSTIN
  legal_business_name TEXT NOT NULL,
  tax_residency TEXT NOT NULL DEFAULT 'India',
  classification TEXT NOT NULL DEFAULT 'individual' CHECK (classification IN ('individual', 'business', 'sole_proprietorship')),
  billing_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  document_storage_path TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_tax_profiles_user ON public.tax_profiles(user_id);

-- ----------------------------------------------------------------------------
-- 4. IDENTITY VERIFICATION RECORDS (KYC State Machine)
-- Private document paths, expiring signed URLs only, no public access.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.identity_verification_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  id_type TEXT NOT NULL CHECK (id_type IN ('passport', 'national_id', 'driving_license', 'aadhaar')),
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN (
    'NOT_STARTED', 'PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'REQUIRES_RESUBMISSION', 'EXPIRED'
  )),
  document_storage_path TEXT, -- Private bucket reference
  id_number_masked TEXT,
  rejection_reason TEXT,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_notes TEXT,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_identity_verification_user ON public.identity_verification_records(user_id);
CREATE INDEX IF NOT EXISTS idx_identity_verification_status ON public.identity_verification_records(status);

-- ----------------------------------------------------------------------------
-- 5. PAYMENT TRANSACTIONS (Authoritative Brand Inbound Transactions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE RESTRICT,
  brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL, -- Creator gross amount
  platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Server-configured 10% fee
  protection_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- $0.00 holding fee
  total_payable NUMERIC(10, 2) NOT NULL, -- Gross + Platform Fee
  currency TEXT NOT NULL DEFAULT 'USD',
  provider TEXT NOT NULL DEFAULT 'stripe' CHECK (provider IN ('stripe', 'paypal', 'hyperswitch', 'manual_upi')),
  provider_transaction_id TEXT UNIQUE,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN (
    'CREATED', 'PENDING', 'REQUIRES_ACTION', 'AUTHORIZED', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED', 'PARTIALLY_REFUNDED', 'DISPUTED'
  )),
  receipt_url TEXT,
  failure_reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_contract ON public.payment_transactions(contract_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_brand ON public.payment_transactions(brand_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_creator ON public.payment_transactions(creator_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_idempotency ON public.payment_transactions(idempotency_key);

-- ----------------------------------------------------------------------------
-- 6. PAYOUT REQUESTS & RECORDS (Outbound Creator Payouts Lifecycle)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payout_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE RESTRICT,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payout_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('paypal', 'stripe', 'upi')),
  recipient_identifier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PAYOUT_REQUESTED' CHECK (status IN (
    'NOT_ELIGIBLE', 'ELIGIBLE', 'PAYOUT_REQUESTED', 'PAYOUT_PENDING', 'PAYOUT_PROCESSING', 'PAYOUT_COMPLETED', 'PAYOUT_FAILED', 'PAYOUT_CANCELLED'
  )),
  provider_payout_id TEXT, -- Stripe Transfer ID or PayPal Payout Item ID
  manual_utr_reference TEXT, -- Bank transfer UTR for manual UPI disbursement
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failure_reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_payout_requests_creator ON public.payout_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_contract ON public.payout_requests(contract_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON public.payout_requests(status);

-- ----------------------------------------------------------------------------
-- 7. FINANCIAL AUDIT LOGS (Immutable Auditing for Sensitive Movements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financial_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL, -- e.g. ESCROW_OVERRIDE, MANUAL_UPI_APPROVED, PAYMENT_CAPTURED, REFUND_ISSUED
  entity_type TEXT NOT NULL, -- 'contract', 'payment_transaction', 'payout_request', 'tax_profile'
  entity_id TEXT NOT NULL,
  justification TEXT,
  previous_state JSONB,
  new_state JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_financial_audit_actor ON public.financial_audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_financial_audit_entity ON public.financial_audit_logs(entity_type, entity_id);

-- ----------------------------------------------------------------------------
-- 8. PLATFORM FEE SETTINGS (Server-Authoritative Global Parameters)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_fee_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fee_percentage NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
  holding_fee_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Insert default platform fee row if not exists
INSERT INTO public.platform_fee_settings (id, fee_percentage, holding_fee_percentage)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 10.00, 0.00)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.creator_payout_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_fee_settings ENABLE ROW LEVEL SECURITY;

-- creator_payout_profiles
CREATE POLICY "Users can manage own payout profile"
  ON public.creator_payout_profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super Admins can view payout profiles"
  ON public.creator_payout_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );

-- payment_methods
CREATE POLICY "Users can manage own payment methods"
  ON public.payment_methods
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super Admins can view payment methods"
  ON public.payment_methods
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );

-- tax_profiles
CREATE POLICY "Users can manage own tax profile"
  ON public.tax_profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super Admins can view tax profiles"
  ON public.tax_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );

-- identity_verification_records
CREATE POLICY "Users can view and request identity verification"
  ON public.identity_verification_records
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super Admins can review identity verifications"
  ON public.identity_verification_records
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );

-- payment_transactions
CREATE POLICY "Parties can view their own payment transactions"
  ON public.payment_transactions
  FOR SELECT
  USING (
    auth.uid() = brand_id OR
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );

-- payout_requests
CREATE POLICY "Creators can view and create payout requests"
  ON public.payout_requests
  FOR ALL
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Super Admins can manage payout requests"
  ON public.payout_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );

-- financial_audit_logs
CREATE POLICY "Super Admins can view financial audit logs"
  ON public.financial_audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );

-- platform_fee_settings
CREATE POLICY "Authenticated users can view platform fee settings"
  ON public.platform_fee_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super Admins can update platform fee settings"
  ON public.platform_fee_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );
