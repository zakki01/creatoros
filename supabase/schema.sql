-- =============================================================================
-- CREATOROS PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- PostgreSQL / Supabase
-- Version: 2.4.0 (Production Release)
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. ENUMS & DOMAINS
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('creator', 'business', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE contract_status AS ENUM (
    'draft',
    'awaiting_creator',
    'accepted',
    'funded',
    'active',
    'client_review',
    'revision_requested',
    'approved',
    'payout_pending',
    'paid',
    'completed',
    'disputed',
    'cancelled',
    'declined'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'WAITING_FOR_USER',
    'RESOLVED',
    'CLOSED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 2. USERS & PROFILES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'creator',
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Creator Specific Metadata
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Fashion & Lifestyle',
  bio TEXT,
  location TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  rate_per_reel NUMERIC(10, 2) DEFAULT 500.00,
  rate_per_shot NUMERIC(10, 2) DEFAULT 250.00,
  rate_per_blog NUMERIC(10, 2) DEFAULT 350.00,
  stripe_account_id TEXT,
  paypal_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Brand Specific Metadata
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  industry TEXT NOT NULL DEFAULT 'Retail & Fashion',
  website TEXT,
  bio TEXT,
  location TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- 3. DISCOVER FEED: POSTS, COMMENTS, REACTIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_role user_role NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('Reel', 'Shot', 'Blog')),
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  media_urls TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  duration TEXT,
  aspect_ratio TEXT DEFAULT '9:16',
  category TEXT NOT NULL DEFAULT 'Fashion & Style',
  tags TEXT[] DEFAULT '{}',
  like_count INT NOT NULL DEFAULT 0,
  comment_count INT NOT NULL DEFAULT 0,
  share_count INT NOT NULL DEFAULT 0,
  moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'pending', 'flagged', 'removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  like_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'message')),
  target_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(user_id, target_type, target_id, emoji)
);

-- =============================================================================
-- 4. DIRECT MESSAGING & CONVERSATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_one UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_two UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(participant_one, participant_two)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'gif', 'video', 'file')),
  attachment_url TEXT,
  media_metadata JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  contract_reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- 5. CAMPAIGNS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  objective TEXT,
  budget NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'paused', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- 6. COMMERCIAL CONTRACTS & DELIVERABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number TEXT UNIQUE NOT NULL, -- e.g. CR-2026-8491
  brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  deadline DATE NOT NULL,
  status contract_status NOT NULL DEFAULT 'draft',
  
  -- Financial Terms
  creator_payment NUMERIC(10, 2) NOT NULL,
  platform_fee NUMERIC(10, 2) NOT NULL,
  protection_amount NUMERIC(10, 2) NOT NULL,
  total_deposit NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_provider TEXT NOT NULL DEFAULT 'stripe',
  payment_status TEXT NOT NULL DEFAULT 'unfunded',
  transaction_id TEXT,
  
  -- Usage Rights
  usage_types TEXT[] NOT NULL DEFAULT '{"Organic Social"}',
  usage_duration TEXT NOT NULL DEFAULT '90 Days',
  usage_territory TEXT NOT NULL DEFAULT 'Worldwide',
  usage_exclusivity TEXT NOT NULL DEFAULT 'None',
  usage_ownership TEXT NOT NULL DEFAULT 'creator_retains',
  
  -- Governance Terms
  included_revisions INT NOT NULL DEFAULT 2,
  review_period_days INT NOT NULL DEFAULT 3,
  cancellation_terms TEXT,
  late_delivery_terms TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.contract_deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- Reel, Video, Photo, Story, Post
  quantity INT NOT NULL DEFAULT 1,
  format TEXT NOT NULL DEFAULT '9:16',
  duration TEXT,
  resolution TEXT DEFAULT '1080x1920',
  specifications TEXT,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'revision_requested', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.contract_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deliverable_id UUID NOT NULL REFERENCES public.contract_deliverables(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  creator_notes TEXT,
  asset_urls TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'revision_requested')),
  brand_feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.contract_disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  raised_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  evidence_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved')),
  arbitration_outcome TEXT,
  brand_refund_amount NUMERIC(10, 2),
  creator_payout_amount NUMERIC(10, 2),
  arbitrated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  resolved_at TIMESTAMPTZ
);

-- =============================================================================
-- 7. SUPPORT TICKETS & ADMIN DESK
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL, -- e.g. CR-10248
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'OPEN',
  assigned_admin_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL,
  message TEXT NOT NULL,
  is_internal_note BOOLEAN NOT NULL DEFAULT false,
  attachment_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- 8. AUDIT LOGS & NOTIFICATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- contract, payment, ticket, message, moderation
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Is current user Super Admin?
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public read, user can update self, admin can manage all
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_super_admin());

-- Creator Profiles RLS
CREATE POLICY "Creator profiles are viewable by everyone"
  ON public.creator_profiles FOR SELECT USING (true);

CREATE POLICY "Users can manage own creator profile"
  ON public.creator_profiles FOR ALL
  USING (auth.uid() = id OR public.is_super_admin())
  WITH CHECK (auth.uid() = id OR public.is_super_admin());

-- Brand Profiles RLS
CREATE POLICY "Brand profiles are viewable by everyone"
  ON public.brand_profiles FOR SELECT USING (true);

CREATE POLICY "Users can manage own brand profile"
  ON public.brand_profiles FOR ALL
  USING (auth.uid() = id OR public.is_super_admin())
  WITH CHECK (auth.uid() = id OR public.is_super_admin());

-- Contracts: Brands and Creators can only view their own contracts
CREATE POLICY "Users view own contracts"
  ON public.contracts FOR SELECT
  USING (brand_id = auth.uid() OR creator_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Brands can create contracts"
  ON public.contracts FOR INSERT
  WITH CHECK (brand_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Contract parties can update own contract"
  ON public.contracts FOR UPDATE
  USING (brand_id = auth.uid() OR creator_id = auth.uid() OR public.is_super_admin());

-- Contract Deliverables RLS
CREATE POLICY "Contract parties see deliverables"
  ON public.contract_deliverables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_id AND (c.brand_id = auth.uid() OR c.creator_id = auth.uid())
    ) OR public.is_super_admin()
  );

CREATE POLICY "Contract parties manage deliverables"
  ON public.contract_deliverables FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_id AND (c.brand_id = auth.uid() OR c.creator_id = auth.uid())
    ) OR public.is_super_admin()
  );

-- Contract Deliveries RLS
CREATE POLICY "Contract parties see deliveries"
  ON public.contract_deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contract_deliverables cd
      JOIN public.contracts c ON c.id = cd.contract_id
      WHERE cd.id = deliverable_id AND (c.brand_id = auth.uid() OR c.creator_id = auth.uid())
    ) OR public.is_super_admin()
  );

CREATE POLICY "Contract parties manage deliveries"
  ON public.contract_deliveries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contract_deliverables cd
      JOIN public.contracts c ON c.id = cd.contract_id
      WHERE cd.id = deliverable_id AND (c.brand_id = auth.uid() OR c.creator_id = auth.uid())
    ) OR public.is_super_admin()
  );

-- Contract Disputes RLS
CREATE POLICY "Contract parties see disputes"
  ON public.contract_disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_id AND (c.brand_id = auth.uid() OR c.creator_id = auth.uid())
    ) OR public.is_super_admin()
  );

CREATE POLICY "Contract parties raise disputes"
  ON public.contract_disputes FOR INSERT
  WITH CHECK (
    raised_by_id = auth.uid() AND
    (
      EXISTS (
        SELECT 1 FROM public.contracts c
        WHERE c.id = contract_id AND (c.brand_id = auth.uid() OR c.creator_id = auth.uid())
      ) OR public.is_super_admin()
    )
  );

-- Support Tickets: Users can only see own tickets; Admins see all
CREATE POLICY "Users see own support tickets"
  ON public.support_tickets FOR SELECT
  USING (user_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Users can create support tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_super_admin());

-- Ticket Messages: Non-admin users cannot see is_internal_note = true
CREATE POLICY "Users see non-internal ticket messages"
  ON public.ticket_messages FOR SELECT
  USING (
    public.is_super_admin()
    OR (
      is_internal_note = false
      AND EXISTS (
        SELECT 1 FROM public.support_tickets st
        WHERE st.id = ticket_id AND st.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users and admins can post ticket messages"
  ON public.ticket_messages FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR (
      is_internal_note = false
      AND EXISTS (
        SELECT 1 FROM public.support_tickets st
        WHERE st.id = ticket_id AND st.user_id = auth.uid()
      )
    )
  );

-- Posts: Approved posts viewable by everyone
CREATE POLICY "Approved posts viewable by everyone"
  ON public.posts FOR SELECT
  USING (moderation_status = 'approved' OR author_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Authors can manage own posts"
  ON public.posts FOR ALL
  USING (author_id = auth.uid() OR public.is_super_admin());

-- Messages: Participants can read and write to own conversations
CREATE POLICY "Participants see conversation messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
    )
    OR public.is_super_admin()
  );

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
    )
    OR public.is_super_admin()
  );

-- Notifications: Users only see own notifications
CREATE POLICY "Users see own notifications"
  ON public.notifications FOR ALL
  USING (user_id = auth.uid());

-- =============================================================================
-- 10. CHAT MEDIA & GIF STORAGE BUCKET POLICIES
-- =============================================================================

-- Bucket creation for chat media (chat-media/{conversation_id}/{message_id}/{filename})
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', false)
ON CONFLICT (id) DO NOTHING;

-- Storage: Participants can view/download chat media from their conversations
CREATE POLICY "Participants access conversation media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'chat-media'
    AND (
      public.is_super_admin()
      OR EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id::text = (storage.foldername(name))[1]
          AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
      )
    )
  );

-- Storage: Authorized participants can upload chat media
CREATE POLICY "Participants upload conversation media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'chat-media'
    AND (
      public.is_super_admin()
      OR EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id::text = (storage.foldername(name))[1]
          AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
      )
    )
  );


-- =============================================================================
-- 11. CREATOROS LIVE & AR PIPELINE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.live_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Creative Studio',
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  stream_provider TEXT NOT NULL DEFAULT 'webrtc' CHECK (stream_provider IN ('webrtc', 'livekit', 'decart')),
  room_id TEXT UNIQUE NOT NULL,
  active_scene_id TEXT,
  viewer_count INT NOT NULL DEFAULT 0,
  peak_viewers INT NOT NULL DEFAULT 0,
  is_recorded BOOLEAN NOT NULL DEFAULT false,
  recording_url TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.live_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('host', 'guest', 'viewer', 'moderator')),
  is_muted BOOLEAN NOT NULL DEFAULT false,
  is_banned BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  left_at TIMESTAMPTZ,
  UNIQUE(session_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.live_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'chat' CHECK (message_type IN ('chat', 'gift', 'system', 'warning')),
  gift_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.ar_effects (
  id TEXT PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Filter', -- Filter, 3D Face, Mask, Studio LUT
  thumbnail_url TEXT NOT NULL,
  preview_url TEXT,
  asset_url TEXT NOT NULL,
  performance_tier TEXT NOT NULL DEFAULT 'medium' CHECK (performance_tier IN ('low', 'medium', 'high', 'extreme')),
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- 12. VIRTUAL COINS, GIFTS & DOUBLE-ENTRY LEDGERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.coin_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  coins INT NOT NULL,
  bonus_coins INT NOT NULL DEFAULT 0,
  price_usd NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.coin_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'gift_sent', 'gift_received', 'payout', 'refund')),
  amount INT NOT NULL, -- positive for credit, negative for debit
  balance_after INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'COINS',
  reference_id TEXT, -- external transaction ID or gift transaction ID
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.gift_catalog (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_emoji TEXT NOT NULL,
  coin_cost INT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  animation_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.gift_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  live_session_id UUID REFERENCES public.live_sessions(id) ON DELETE SET NULL,
  gift_id TEXT NOT NULL REFERENCES public.gift_catalog(id),
  coin_amount INT NOT NULL,
  creator_earning_usd NUMERIC(10, 2) NOT NULL,
  platform_fee_usd NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'disputed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- 13. WEBHOOK IDEMPOTENCY & FINANCIAL AUDIT
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT UNIQUE NOT NULL, -- Provider event ID (e.g. evt_123 or paypal webhook id)
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'paypal', 'livekit')),
  event_type TEXT NOT NULL,
  signature_header TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('pending', 'processed', 'failed', 'duplicate')),
  error_message TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- 14. PLATFORM FEATURE FLAGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.platform_feature_flags (
  key TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- 15. RLS POLICIES FOR NEW SUBSYSTEMS
-- =============================================================================

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ar_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_feature_flags ENABLE ROW LEVEL SECURITY;

-- Live Sessions
CREATE POLICY "Public live sessions viewable"
  ON public.live_sessions FOR SELECT USING (true);

CREATE POLICY "Host manage own live session"
  ON public.live_sessions FOR ALL
  USING (host_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (host_id = auth.uid() OR public.is_super_admin());

-- Live Participants
CREATE POLICY "Participants view session members"
  ON public.live_participants FOR SELECT USING (true);

CREATE POLICY "Users join session or host manages"
  ON public.live_participants FOR ALL
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.live_sessions s
      WHERE s.id = session_id AND s.host_id = auth.uid()
    ) OR
    public.is_super_admin()
  );

-- Live Chat Messages
CREATE POLICY "Live chat viewable by everyone in session"
  ON public.live_chat_messages FOR SELECT USING (true);

CREATE POLICY "Participants send live chat"
  ON public.live_chat_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    NOT EXISTS (
      SELECT 1 FROM public.live_participants lp
      WHERE lp.session_id = live_chat_messages.session_id AND lp.user_id = auth.uid() AND lp.is_banned = true
    )
  );

-- AR Effects & Catalog
CREATE POLICY "AR effects viewable by everyone"
  ON public.ar_effects FOR SELECT USING (is_approved = true OR public.is_super_admin());

CREATE POLICY "Coin packages and gifts viewable by everyone"
  ON public.coin_packages FOR SELECT USING (is_active = true OR public.is_super_admin());

CREATE POLICY "Gift catalog viewable by everyone"
  ON public.gift_catalog FOR SELECT USING (is_active = true OR public.is_super_admin());

-- Financial Ledgers: STRICT User Isolation & Admin Access
CREATE POLICY "Users view own coin ledger"
  ON public.coin_ledger FOR SELECT
  USING (user_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Gift transactions viewable by parties"
  ON public.gift_transactions FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid() OR public.is_super_admin());

-- Webhooks & Flags: Strictly Super Admin
CREATE POLICY "Webhooks super admin only"
  ON public.webhook_events FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "Feature flags public read, admin write"
  ON public.platform_feature_flags FOR SELECT USING (true);

CREATE POLICY "Feature flags admin manage"
  ON public.platform_feature_flags FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());
