# CreatorOS Mobile-First Product UX Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild CreatorOS as a genuine mobile-first creator/brand professional social platform with role-aware onboarding, fully editable profiles, 5-destination primary navigation, complete mobile navigation parity, zero accidental default data, and productive empty states across all screen sizes (320px to 1920px).

**Architecture:** Implement a unified underlying product architecture with progressive disclosure on mobile. Cleanly separate demo fixtures from real production state, enforce interactive onboarding for new users, build multi-section mobile-friendly profile editors with public preview, and reconstruct mobile views (Profiles, Messages, Create, Live, Settings) into dedicated touch-first layouts with minimum 44px hit targets and safe-area insets.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS 3.4, Vite 8, Lucide React, Puppeteer Core (E2E verification), Edge browser runtime.

**Spec:** USER_REQUEST specification for CreatorOS — Mobile-First Product UX Rebuild.

## Global Constraints

- Mobile is NOT a reduced desktop version; it is the primary interaction layer (70% mobile target).
- Light Theme Palette: Canvas `#F0F0F0`, Primary `#105BFF`, Accent `#FF77BC`.
- Dark Theme Palette: Canvas `#02070A`, Primary `#0297DE`, Accent `#FC734D`.
- Zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`) across all 11 breakpoints: 320, 360, 375, 390, 430, 480, 768, 1024, 1280, 1440, 1920.
- Interactive hit targets must be $\ge 44 \times 44\text{px}$ on mobile.
- Support iOS/Android safe areas (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`).
- Zero manufactured credibility: no fake followers, reviews, earnings, or partnerships for real accounts.
- Controlled demo mode strictly isolated: demo data appears ONLY when explicitly logged in as `demo.creator@creatoros.ai` or `demo.brand@creatoros.ai`.

## Review Focus

1. **New User Registration Flow:** After signing up with a new email, the user must enter the role-aware Onboarding flow, not an empty or half-filled dashboard.
2. **Profile Edit Persistence:** Any edits made in Creator or Brand Edit Profile (name, handle, avatar, bio, rates, skills, location, preferences) must persist after page reload and be reflected in the public preview.
3. **Primary Mobile Navigation Parity:** Bottom navigation has 5 persistent destinations (Home, Discover, Create, Messages, Profile) while TopBar has a visible 44px+ `Apps` button opening the complete application directory without losing desktop features.
4. **Mobile Single-Column Messaging:** Mobile view must show conversation list OR conversation thread with back button, never squished dual columns.
5. **Dark Mode Surface Integrity:** No hardcoded white cards, borders, or modal backgrounds in dark mode across any screen or modal.

---

### Task 1: Forensic Audit & Default Data Sanitization in State Management

**Files:**
- Modify: `src/context/StateContext.tsx`
- Modify: `src/features/auth/services/authService.ts`
- Modify: `src/data/demoFixtures.ts`
- Modify: `src/data/mockData.ts`
- Test: `scripts/test-state-sanitization.cjs`

- [ ] **Step 1: Write verification script `scripts/test-state-sanitization.cjs`** to assert that non-demo sessions initialize with empty arrays (`campaigns: []`, `outreach: []`, `payments: []`, `attention: []`, `submissions: []`, `posts: []`) and real user identity (no Karan Singhania / Rohan Sharma fallbacks).
- [ ] **Step 2: Run verification script** to observe current fallback failures.
- [ ] **Step 3: Refactor `StateContext.tsx`** to ensure `userProfile`, `workspace`, and collections never merge `INITIAL_USER_PROFILES` for authenticated standard users.
- [ ] **Step 4: Update `getSafeCurrentCreator` in `demoFixtures.ts`** to construct a clean blank creator profile for new creator accounts instead of defaulting to `creators[0]` (Rohan Sharma) or Unsplash avatar.
- [ ] **Step 5: Run verification script** to confirm 100% pass and commit: `git commit -m "fix(state): sanitize production defaults and isolate demo fixtures"`.

---

### Task 2: Role-Aware Interactive Onboarding Wizard (Creator & Brand)

**Files:**
- Create: `src/components/onboarding/OnboardingFlow.tsx`
- Create: `src/components/onboarding/CreatorOnboardingWizard.tsx`
- Create: `src/components/onboarding/BrandOnboardingWizard.tsx`
- Modify: `src/context/StateContext.tsx`
- Modify: `src/features/auth/components/WelcomeAuth.tsx`
- Modify: `src/features/auth/components/WelcomePage.tsx`
- Modify: `src/App.tsx`
- Test: `scripts/test-onboarding-flow.cjs`

- [ ] **Step 1: Create `CreatorOnboardingWizard.tsx`** implementing the 6-step flow:
  1. Choose what you do (multi-select: Video Creator, Photographer, Designer, Editor, Musician, Influencer, UGC Creator, Gamer, Artist, Other).
  2. Professional profile (Avatar, Display Name, @handle, Bio, Location, Languages, Primary Category, Skills tags).
  3. Showcase work (Initial portfolio item title, type, link/media).
  4. Work preferences (Availability status, Available from date).
  5. Rates (Starting rate, services, negotiable toggle).
  6. Live interactive profile preview + "Complete Profile" button.
- [ ] **Step 2: Create `BrandOnboardingWizard.tsx`** implementing the 4-step flow:
  1. Brand identity (Brand Name, Logo, Cover, @handle, Industry, Company size, Location).
  2. About & business (Description, Mission, Products, Website URL, Business email).
  3. Collaboration preferences (Creator categories, Platforms, Typical budget, Campaign types).
  4. Live interactive brand profile preview + "Complete Brand Setup" button.
- [ ] **Step 3: Create `OnboardingFlow.tsx` container** routing between Creator and Brand onboarding, supporting progress indicator, step navigation, and safe persistence to `StateContext`.
- [ ] **Step 4: Wire onboarding state into `StateContext.tsx` & `App.tsx`** so uncompleted profiles trigger `OnboardingFlow` immediately upon signup before accessing the main workspace.
- [ ] **Step 5: Write and run `scripts/test-onboarding-flow.cjs`** to verify both Creator and Brand onboarding steps, data persistence, and completion redirect. Commit: `git commit -m "feat(onboarding): role-aware interactive onboarding for creators and brands"`.

---

### Task 3: Highly Editable Profile System

**Files:**
- Create: `src/components/creator/EditCreatorProfileModal.tsx`
- Create: `src/components/business/EditBrandProfileModal.tsx`
- Modify: `src/context/StateContext.tsx`
- Modify: `src/types/index.ts`
- Test: `scripts/test-profile-editing.cjs`

- [ ] **Step 1: Create `EditCreatorProfileModal.tsx`** following Section 10's mobile-friendly sectional editor (tap-into sub-editors on mobile, 2-column on desktop):
  - Identity (Photo, Cover, Name, Handle, Bio)
  - Professional (Categories, Skills, Experience, Services, Languages, Location)
  - Work (Showcase, Reels, Shots, Blogs, Portfolio links)
  - Availability (Status, Date)
  - Rates (Starting rate, Service rate cards, Negotiable toggle)
  - Social (Instagram, YouTube, TikTok, LinkedIn, Website, Other)
  - About (Rich description)
  - Privacy (Public profile toggle, contact/rate visibility)
  - "Preview as Public" toggle and sticky Save.
- [ ] **Step 2: Create `EditBrandProfileModal.tsx`** for Brand profiles:
  - Brand Identity (Logo, Cover, Brand Name, Handle, Industry, Size)
  - About (Company description, Mission, Products/services)
  - Business (Website, Location, Business email, Social links)
  - Collaboration (Target creator categories, Content formats, Budget ranges, Campaign types)
  - Brand Guidelines & Assets (Guidelines description, asset download links)
  - "Preview as Public" toggle and sticky Save.
- [ ] **Step 3: Add `updateCreatorProfile` and `updateBrandProfile` methods to `StateContext.tsx`** with real `localStorage` and Supabase sync.
- [ ] **Step 4: Write and run `scripts/test-profile-editing.cjs`** to verify editing, saving, page reload persistence, and public view reflection. Commit: `git commit -m "feat(profile): comprehensive sectional profile editors for creators and brands"`.

---

### Task 4: Mobile Profile Screen Rebuild

**Files:**
- Modify: `src/components/creator/CreatorProfile.tsx`
- Modify: `src/components/common/BrandProfileModal.tsx`
- Modify: `src/components/common/ShareProfileModal.tsx`
- Test: `scripts/test-mobile-profile-layout.cjs`

- [ ] **Step 1: Rebuild mobile header and layout in `CreatorProfile.tsx`** strictly matching Section 13:
  - Cover with safe-area close button ($44\text{px}+$ touch target)
  - Centered/stacked avatar with verification badge
  - Display Name, verified pill, @username, Short bio, Location · Category
  - Role-aware primary action:
    - Own profile: **Edit Profile** + **Share Profile**
    - Creator viewing Creator: **Connect**
    - Brand viewing Creator: **Invite to Campaign**
  - Secondary actions: Message, Share
  - Real stats: Followers, Following / Collaborations (or "0" if new, no fake numbers)
  - Horizontally scrollable tabs: Showcase, Reels, Shots, Blogs, Campaigns, About
  - Productive empty states for tabs when no content exists.
- [ ] **Step 2: Rebuild `BrandProfileModal.tsx`** with the same clean mobile social profile structure:
  - Cover, Logo, Brand Name, verified badge, @username, Bio, Location · Industry
  - Role-aware action:
    - Own profile: **Edit Profile** + **Share Profile**
    - Creator viewing Brand: **Pitch to Brand**
    - Brand viewing Brand: **Connect**
  - Real metrics (Open Briefs, Partnered Creators, Typical Budget, or "No active briefs" if new)
  - Scrollable tabs: About, Campaigns, Content, Guidelines, Contact.
- [ ] **Step 3: Enhance `ShareProfileModal.tsx`** to provide quick 1-tap Copy Link, Native Web Share API integration, WhatsApp, and external share options.
- [ ] **Step 4: Write and run `scripts/test-mobile-profile-layout.cjs`** across 320px, 375px, 390px, 430px. Commit: `git commit -m "feat(profile): mobile-first profile layout with role-aware actions and share sheet"`.

---

### Task 5: Mobile-First Navigation & Create Flow Integration

**Files:**
- Create: `src/components/common/CreateSheetModal.tsx`
- Modify: `src/components/common/MobileBottomNav.tsx`
- Modify: `src/components/common/MobileAppsDrawer.tsx`
- Modify: `src/components/common/TopBar.tsx`
- Modify: `src/components/creator/CreatorLayout.tsx`
- Modify: `src/components/business/BusinessLayout.tsx`
- Test: `scripts/test-navigation-parity.cjs`

- [ ] **Step 1: Create `CreateSheetModal.tsx`** offering a full-screen mobile creation flow for:
  - Reel (Vertical short-form video)
  - Shot (Visual still / photo)
  - Blog (Article / story)
  - Live Studio (Spatial camera stream)
- [ ] **Step 2: Update `MobileBottomNav.tsx`** to standard 5 persistent destinations:
  `Home`, `Discover`, `Create` (+ highlight button), `Messages`, `Profile`.
- [ ] **Step 3: Update `TopBar.tsx`** with a prominent, accessible `[Apps]` / `[☰]` grid button ($\ge 44\text{px}$ hit target) on mobile header next to brand logo.
- [ ] **Step 4: Update `BusinessLayout.tsx` & `CreatorLayout.tsx`** to wire the 5 bottom destinations, `CreateSheetModal`, and `MobileAppsDrawer`.
- [ ] **Step 5: Write and run `scripts/test-navigation-parity.cjs`** to verify all 12+ desktop workspaces remain accessible via Mobile Apps Drawer. Commit: `git commit -m "feat(navigation): 5-destination bottom nav, create sheet, and discoverable apps menu"`.

---

### Task 6: Mobile Messaging & Settings Master-Detail Architecture

**Files:**
- Modify: `src/components/common/DirectMessagesView.tsx`
- Modify: `src/components/business/SettingsWorkspace.tsx`
- Modify: `src/components/creator/CreatorProfile.tsx` (Settings integration)
- Test: `scripts/test-mobile-messages-settings.cjs`

- [ ] **Step 1: Refactor `DirectMessagesView.tsx`** for mobile (< 768px):
  - When no conversation is active: show full-screen conversation list with search.
  - When a conversation is selected: show full-screen conversation thread with `← Back` button to list.
  - Desktop retains clean 2-column layout.
- [ ] **Step 2: Refactor `SettingsWorkspace.tsx`** for mobile (< 768px):
  - Mobile drill-down menu (Account >, Privacy >, Notifications >, Security >, Appearance >, Billing >, Verification >).
  - Tapping a section displays that settings panel with a `← Back to Settings` header button.
- [ ] **Step 3: Write and run `scripts/test-mobile-messages-settings.cjs`** to verify mobile master-detail navigation without column squeezing. Commit: `git commit -m "feat(ux): master-detail mobile views for messages and settings"`.

---

### Task 7: Mobile-First Live Studio Camera Experience

**Files:**
- Modify: `src/components/creator/live/CreatorLiveStudio.tsx`
- Test: `scripts/test-mobile-live.cjs`

- [ ] **Step 1: Re-architect `CreatorLiveStudio.tsx`** for mobile (< 768px):
  - Full-screen `h-[100dvh]` camera stage with touch-first controls.
  - Floating overlays: Top bar (live status, viewer count, flip camera, exit), bottom bar (mic mute, AR filter picker, camera toggle, chat input).
  - Floating transparent comment ticker at bottom-left.
- [ ] **Step 2: Write and run `scripts/test-mobile-live.cjs`** to verify full-screen viewport and zero horizontal overflow. Commit: `git commit -m "feat(live): mobile-first 100dvh camera live studio"`.

---

### Task 8: Empty States & Meaningless Statistics Elimination

**Files:**
- Modify: `src/components/business/BusinessOverview.tsx`
- Modify: `src/components/creator/CreatorHome.tsx`
- Modify: `src/components/creator/CreatorCampaigns.tsx`
- Modify: `src/components/contracts/CreatorContractPortal.tsx`
- Modify: `src/components/business/ContractsWorkspace.tsx`
- Modify: `src/components/business/PaymentsWorkspace.tsx`
- Test: `scripts/test-productive-empty-states.cjs`

- [ ] **Step 1: Replace hardcoded/fake numbers** in `BusinessOverview.tsx` and `CreatorHome.tsx` for new users with role-aware onboarding cards:
  - New Creator: "Welcome, [Name]", profile completeness indicator, "Add showcase work", "Discover brands", "Find opportunities".
  - New Brand: "Welcome, [Brand]", profile completeness indicator, "Create first campaign", "Discover creators", "Invite talent".
- [ ] **Step 2: Implement productive empty states** across Campaigns, Contracts, Content, and Payments answering: 1) What is this? 2) Why is it empty? 3) What can I do next? With primary action button.
- [ ] **Step 3: Write and run `scripts/test-productive-empty-states.cjs`** to verify empty state clarity and zero manufactured statistics. Commit: `git commit -m "fix(ux): productive empty states and removal of fake statistics"`.

---

### Task 9: Comprehensive Multi-Viewport Automated Verification & Production Build

**Files:**
- Create: `scripts/verify-full-mobile-first-suite.cjs`
- Modify: package.json (if scripts needed)

- [ ] **Step 1: Create `scripts/verify-full-mobile-first-suite.cjs`** covering:
  - 11 Viewports: 320, 360, 375, 390, 430, 480, 768, 1024, 1280, 1440, 1920.
  - Zero horizontal overflow check.
  - 44px+ touch target hit-box check.
  - Safe-area insets check.
  - Dark mode white surfaces scan (0 `#ffffff` cards).
  - New Creator user journey (signup -> onboarding -> profile -> discover -> pitch).
  - New Brand user journey (signup -> onboarding -> profile -> discover -> invite).
  - Profile edit and save persistence check.
  - Capture artifact screenshots across key resolutions.
- [ ] **Step 2: Run `npm run typecheck` and `npm run build`** to ensure 0 errors.
- [ ] **Step 3: Run `node scripts/verify-full-mobile-first-suite.cjs`** and confirm 100% pass.
- [ ] **Step 4: Push to `origin/main`** and verify production readiness.
- [ ] **Step 5: Produce comprehensive final forensic report** conforming to Section 55.
