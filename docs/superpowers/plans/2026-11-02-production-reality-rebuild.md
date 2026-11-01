# CreatorOS — Production Reality Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild CreatorOS from a client-side demo into an authentic, production-ready SaaS platform powered by Supabase Auth, PostgreSQL schema, Storage, Realtime messaging, and strict server-side authorization.

**Architecture:** Standardize on Supabase Auth for all identity and session handling (`auth.users`), PostgreSQL `public.profiles` + `creator_profiles` / `brand_profiles` for authoritative roles and profiles, Supabase Storage (`creatoros-media`) for assets, and Supabase Database (`conversations`, `messages`, `user_reports`, `user_blocks`, `conversation_settings`) for real messaging and moderation. Eliminate client-side credential storage in localStorage, fake IDs (`usr_timestamp_random`), prefilled demo accounts, fake toasts, and hardcoded brand fallbacks.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, `@supabase/supabase-js`, PostgreSQL 17 (Supabase), Vercel Serverless Functions.

**Spec:** User Prompt: *CreatorOS — PRODUCTION REALITY REBUILD (Remove Demo Architecture + Real Email Authentication + Real Brand/Creator Profiles + Functional Messaging)*.

---

## Global Constraints

- **Auth Standard:** Single authoritative Supabase client via `@supabase/supabase-js` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser.
- **No Password in localStorage:** Zero storage of passwords, hashes, fake accounts, or auth tokens in `localStorage`.
- **Demo Mode Isolation:** `VITE_ENABLE_DEMO=false` default. Controlled demo accounts cannot leak into public production flows.
- **Real Database Persistence:** Every account, profile, conversation, message, report, and block must be a real record in Supabase.
- **Role Authority:** Role originates from database `public.profiles.role` (`creator`, `business`, `super_admin`). No client-side role spoofing.
- **Zero Fake UX:** No fake call toasts, no fake profile toasts, no hardcoded `Aura Streetwear Co.` fallback, no fake statistics (`4,800+`, `₹4.2 Cr+`).

---

## Review Focus

1. **Email Sign-up without Confirmation Leak:** When a user signs up with Supabase Auth requiring email confirmation, the app must display "Check your email" instead of letting them enter unverified.
2. **Profile Type Mismatch:** Clicking a Brand profile must NEVER open `CreatorProfile`. Profile routing must resolve strictly from database role/type.
3. **Message Menu Clipping/Stacking:** Contextual three-dot menu in `DirectMessagesView` must render with high z-index (`z-[200]`) / fixed portal and never be clipped or occluded by message bubbles.
4. **Token Verification Security:** `/api/auth/verify` must verify token with Supabase Auth server-side, never trusting `split('.').length === 3` or `x-creatoros-role`.
5. **Clean Empty States:** Real new user accounts must see clean, actionable empty states with 0 demo conversations, 0 fake campaigns, and 0 fake payments.

---

## Task Decomposition

### Task 1: Supabase Client Foundation & Authentication Service Rebuild
**Files:**
- Create: `src/services/supabaseClient.ts`
- Modify: `src/features/auth/services/authService.ts`
- Modify: `src/features/auth/types.ts`
- Test: `scripts/test-supabase-auth-service.cjs`

- [ ] **Step 1:** Create `src/services/supabaseClient.ts` importing `createClient` from `@supabase/supabase-js` using `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`.
- [ ] **Step 2:** Refactor `src/features/auth/services/authService.ts`:
  - Remove `REGISTERED_ACCOUNTS_KEY` and client-side password storage.
  - Implement `signUpWithEmail({ email, password, role, name })` calling `supabase.auth.signUp()`.
  - Implement `loginWithEmail({ email, password })` calling `supabase.auth.signInWithPassword()`.
  - Implement `signOut()` calling `supabase.auth.signOut()`.
  - Implement `resetPassword(email)` calling `supabase.auth.resetPasswordForEmail()`.
  - Implement `getSession()` and `onAuthStateChange()` for real session sync.
  - Guard `loginAsDemo()` strictly with `import.meta.env.VITE_ENABLE_DEMO === 'true'`.
- [ ] **Step 3:** Run `scripts/test-supabase-auth-service.cjs` to verify Supabase Auth client methods.
- [ ] **Step 4:** Commit changes: `feat(auth): integrate Supabase Auth and eliminate client-side password storage`.

---

### Task 2: Public Authentication UI Hardening
**Files:**
- Modify: `src/features/auth/components/WelcomeAuth.tsx`
- Modify: `src/features/auth/components/ForgotPasswordModal.tsx`
- Modify: `src/components/common/TopBar.tsx`
- Test: `scripts/test-auth-ui-cleanliness.cjs`

- [ ] **Step 1:** In `WelcomeAuth.tsx`, clear initial values (`email = ""`, `password = ""`), add placeholder `you@example.com`.
- [ ] **Step 2:** In register mode, add `confirmPassword` field and validate matching passwords before submission.
- [ ] **Step 3:** Handle Supabase signup response: if `user` created but `session` is null (awaiting email verification), display a dedicated "Check your email" confirmation screen.
- [ ] **Step 4:** In `ForgotPasswordModal.tsx`, invoke `AuthService.resetPassword(email)` and show real feedback.
- [ ] **Step 5:** Remove `handleDemoFallback`, `loginAsDemo`, and demo buttons from public production view.
- [ ] **Step 6:** In `TopBar.tsx`, remove "Reset Demo State" button in production.
- [ ] **Step 7:** Run `scripts/test-auth-ui-cleanliness.cjs` to confirm 0 hardcoded credentials or demo buttons.
- [ ] **Step 8:** Commit changes: `fix(auth-ui): remove demo credentials and implement real Supabase email auth UI`.

---

### Task 3: StateContext & Database Identity Synchronization
**Files:**
- Modify: `src/context/StateContext.tsx`
- Modify: `src/types.ts`
- Test: `scripts/test-state-identity-sync.cjs`

- [ ] **Step 1:** In `StateContext.tsx`, hook into `supabase.auth.onAuthStateChange` to listen for `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`, `USER_UPDATED`.
- [ ] **Step 2:** On `SIGNED_IN`, query `public.profiles` by `session.user.id`:
  - If profile exists, query `creator_profiles` or `brand_profiles` to hydrate `userProfile` and `workspace`.
  - Set `role` to `profile.role` (`creator` or `business`).
- [ ] **Step 3:** If profile is missing or brand name / creator handle is not finalized, trigger `isOnboarded: false` to complete profile.
- [ ] **Step 4:** On `SIGNED_OUT`, clear all user state, conversations, and workspace caches.
- [ ] **Step 5:** Remove hardcoded user names (`Karan Singhania`, `Rohan Sharma`) from initial state fallbacks.
- [ ] **Step 6:** Run `scripts/test-state-identity-sync.cjs` to verify identity hydration.
- [ ] **Step 7:** Commit changes: `feat(state): synchronize authoritative user identity and role from Supabase profiles`.

---

### Task 4: Real Brand & Creator Profiles, Storage Uploads & Routing
**Files:**
- Modify: `src/components/common/BrandProfileModal.tsx`
- Modify: `src/components/creator/CreatorProfile.tsx`
- Create: `src/components/business/EditBrandProfileModal.tsx`
- Create: `src/components/creator/EditCreatorProfileModal.tsx`
- Modify: `src/services/mediaUploadService.ts`
- Test: `scripts/test-profile-crud.cjs`

- [ ] **Step 1:** In `BrandProfileModal.tsx`, remove default hardcoded object `Aura Streetwear Co.` and fake posts. Render clean state from database props.
- [ ] **Step 2:** Add role-aware action matrix in `BrandProfileModal`:
  - Own profile: **Edit Brand Profile** + **Share Profile**.
  - Creator viewer: **Pitch to Brand** + **Message** + **Share**.
  - Brand viewer: **Connect** + **Message** + **Share**.
- [ ] **Step 3:** In `CreatorProfile.tsx`, add role-aware actions:
  - Own profile: **Edit Creator Profile** + **Share Profile**.
  - Brand viewer: **Invite to Campaign** + **Message** + **Share**.
- [ ] **Step 4:** Implement `EditBrandProfileModal.tsx` allowing brand users to edit logo, cover, bio, industry, company size, and website, saving directly to Supabase `brand_profiles` and `profiles`.
- [ ] **Step 5:** Implement `EditCreatorProfileModal.tsx` allowing creator users to edit avatar, cover, bio, category, rates, location, and social links, saving to `creator_profiles` and `profiles`.
- [ ] **Step 6:** Update `mediaUploadService.ts` to upload files directly to Supabase Storage `creatoros-media/${userId}/${Date.now()}_${sanitizedFileName}` and return public URL.
- [ ] **Step 7:** Run `scripts/test-profile-crud.cjs` to verify database profile updates and storage URLs.
- [ ] **Step 8:** Commit changes: `feat(profiles): implement real Brand and Creator profile editing and Supabase Storage uploads`.

---

### Task 5: Real Supabase Messaging, Moderation & Z-Index Header Architecture
**Files:**
- Modify: `src/services/messagingService.ts`
- Modify: `src/components/common/DirectMessagesView.tsx`
- Test: `scripts/test-real-messaging.cjs`

- [ ] **Step 1:** In `messagingService.ts`, implement real Supabase queries:
  - `fetchUserConversations(userId)`: queries `conversations` where `participant_one = userId OR participant_two = userId`, joins `profiles`.
  - `fetchMessages(conversationId)`: queries `messages` ordered by `created_at ASC`.
  - `sendRealMessage(conversationId, senderId, content, messageType, attachmentUrl)`: inserts into `messages`.
  - `subscribeToConversation(conversationId, callback)`: uses Supabase Realtime channel.
  - `submitUserReport(reporterId, reportedUserId, reason, conversationId)`: inserts into `user_reports`.
  - `blockParticipant(blockerId, blockedUserId)`: inserts into `user_blocks`.
  - `setConversationMute(userId, conversationId, isMuted)`: upserts `conversation_settings`.
- [ ] **Step 2:** In `DirectMessagesView.tsx`:
  - Replace fake phone/video toasts with honest "Coming soon" disabled tooltips or hide if inactive.
  - Profile button: opens real participant profile (`openProfile(activeConv.participantId)`).
  - Contextual three-dot menu: Rebuild with `z-[200]` and fixed popover placement so it is never occluded or clipped by message streams.
  - Wire Mute, Report, and Block to real `messagingService` methods.
  - If a user is blocked, display disabled blocked state in message composer.
  - Remove hardcoded contract `#CR-2026-8491` and campaign chip unless `conversation.contract_reference_id` exists in the record.
- [ ] **Step 3:** Run `scripts/test-real-messaging.cjs` to verify conversation querying and message insertion.
- [ ] **Step 4:** Commit changes: `feat(messaging): implement real database messaging, Realtime sync, moderation, and z-index fixes`.

---

### Task 6: Serverless Security Hardening & Zero Fake Data Audit
**Files:**
- Modify: `api/auth/verify.ts`
- Modify: `api/auth/demo.ts`
- Modify: `src/components/business/BusinessOverview.tsx`
- Modify: `src/components/creator/CreatorHome.tsx`
- Test: `scripts/test-security-endpoints.cjs`

- [ ] **Step 1:** In `api/auth/verify.ts`, replace `split('.').length === 3` with real Supabase Auth token verification via `supabase.auth.getUser(token)`. Reject unauthorized tokens.
- [ ] **Step 2:** In `api/auth/demo.ts`, check `process.env.VITE_ENABLE_DEMO === 'true'` and return 403 Forbidden in production.
- [ ] **Step 3:** Audit and remove fake social proof stats (`4,800+`, `₹4.2 Cr+`, `99.4%`, `52+ Creators`).
- [ ] **Step 4:** Ensure empty states for Campaigns, Contracts, Content, and Messages show clean onboarding invitations without fake placeholder records.
- [ ] **Step 5:** Run `scripts/test-security-endpoints.cjs` to verify signature checks and demo lockout.
- [ ] **Step 6:** Commit changes: `fix(security): enforce server-side Supabase JWT verification and sanitize statistics`.

---

### Task 7: Production Build, Testing & Live Deployment Verification
**Files:**
- Modify: `package.json`
- Create: `scripts/verify-production-reality-full.cjs`
- Output: `CREATOROS_PRODUCTION_REALITY_REBUILD_VERIFICATION_REPORT.md`

- [ ] **Step 1:** Run `npm run build` (`tsc -b && vite build`) to ensure 0 TypeScript or bundling errors.
- [ ] **Step 2:** Run `scripts/verify-production-reality-full.cjs` to test:
  - Zero local storage passwords.
  - Clean authentication forms.
  - Real profile editing with Supabase.
  - Real messaging and z-index positioning.
  - Live API security.
- [ ] **Step 3:** Push all commits to `origin/main`.
- [ ] **Step 4:** Trigger fresh production deployment on Vercel for `creatoros-fawn-iota.vercel.app` via Vercel MCP.
- [ ] **Step 5:** Inspect live deployment at `https://creatoros-fawn-iota.vercel.app/` with Puppeteer, take live screenshots, and verify live assets.
- [ ] **Step 6:** Generate comprehensive final forensic report `CREATOROS_PRODUCTION_REALITY_REBUILD_VERIFICATION_REPORT.md`.
