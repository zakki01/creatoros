import React, { useEffect, useState, useRef } from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  BadgeCheck,
  Building2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { UserRole } from '../../../types';
import { BrandLogo } from '../../../components/common/BrandLogo';
import { CreatorShowcaseVideo } from './CreatorShowcaseVideo';
import { ResponsiveAuthPanel } from './ResponsiveAuthPanel';
import { SpatialTiltCard } from '../../../components/ui/SpatialTiltCard';

interface WelcomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onDemoAccess: (role: UserRole) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onGetStarted,
  onSignIn,
  onDemoAccess,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Monitor scroll for subtle spatial depth & parallax with a single passive RAF loop
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia) {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY || window.pageYOffset || 0);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Subtle headline parallax
  const headlineParallax = prefersReducedMotion
    ? undefined
    : `translateY(${Math.min(16, scrollY * 0.02).toFixed(1)}px)`;

  // Subtle background atmospheric shift
  const bgAtmosphericShift = prefersReducedMotion
    ? undefined
    : `translateY(${Math.min(40, scrollY * 0.04).toFixed(1)}px)`;

  return (
    <div className="min-h-screen w-full bg-[#060608] text-zinc-100 flex flex-col selection:bg-sky-500/25 selection:text-sky-100 overflow-x-hidden font-sans relative">
      {/* ========================================================================= */}
      {/* 1. LAYERED BACKGROUND DEPTH                                               */}
      {/* ========================================================================= */}
      {/* Layer 1: Near-black canvas (#060608) */}
      
      {/* Layer 2: Large Blurred Indigo Atmospheric Light */}
      <div
        aria-hidden="true"
        style={{ transform: bgAtmosphericShift }}
        className="pointer-events-none absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1100px] h-[640px] bg-gradient-to-b from-indigo-600/[0.11] via-sky-600/[0.05] to-transparent blur-[140px] opacity-85 transition-transform duration-300 ease-out"
      />

      {/* Layer 3: Subtle Sky Ambient Light Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[700px] right-[-200px] w-[600px] h-[500px] bg-sky-500/[0.035] rounded-full blur-[160px]"
      />

      {/* Layer 4: Deep Purple Secondary Light Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[1400px] left-[-200px] w-[600px] h-[500px] bg-purple-600/[0.03] rounded-full blur-[160px]"
      />

      {/* ========================================================================= */}
      {/* 2. MINIMAL PUBLIC WELCOME HEADER                                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#060608]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo size="md" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSignIn}
              className="btn-soft-raised px-4 py-1.5 rounded-full text-xs font-sans font-medium text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="btn-soft-primary px-4 py-1.5 rounded-full text-xs font-sans font-semibold active:scale-95 cursor-pointer hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN SPATIAL EXPERIENCE BODY                                           */}
      {/* ========================================================================= */}
      <main className="welcome-page w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-16 sm:pb-20 space-y-12 sm:space-y-16 relative z-10">
        
        {/* ======================================================================= */}
        {/* HERO INTRO: MINIMAL CLEAN HIERARCHY                                      */}
        {/* ======================================================================= */}
        <section
          ref={heroRef}
          style={{ transform: headlineParallax }}
          className="hero-section w-full flex flex-col items-center text-center space-y-4 pt-2 sm:pt-4 transition-transform duration-200 ease-out"
        >
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-sky-300">
                CreatorOS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white font-display leading-[1.06]">
              Creators &amp; brands,
              <br />
              connected to create better work.
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light max-w-lg mx-auto">
              The operating system for creators &amp; brands.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onGetStarted}
                className="btn-soft-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-sans font-semibold cursor-pointer active:scale-95 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
              </button>

              <button
                type="button"
                onClick={() => onDemoAccess('creator')}
                className="btn-soft-glass inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium text-zinc-300 hover:text-white cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Explore Sandbox</span>
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SPATIAL STAGE: DESKTOP 2-COLUMN (VIDEO LEFT | SIGN IN RIGHT)            */}
        {/* MOBILE SINGLE-COLUMN (VIDEO -> STATS -> SIGN IN)                         */}
        {/* ======================================================================= */}
        <section className="spatial-stage-section w-full">
          {/* Responsive Area Grid:
              Mobile: [video] -> [stats] -> [login]
              Desktop (lg): [video (7 cols)] | [login (5 cols)]
                            [stats (12 cols)] */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start [grid-template-areas:'video'_'stats'_'login'] lg:[grid-template-areas:'video_login'_'stats_stats']">
            
            {/* 1. SHOWCASE VIDEO (LEFT ON DESKTOP, TOP ON MOBILE) */}
            <div className="[grid-area:video] lg:col-span-7 w-full h-full flex flex-col justify-center">
              <CreatorShowcaseVideo scrollY={scrollY} />
            </div>

            {/* 2. SIGN IN / REGISTER PANEL (RIGHT ON DESKTOP, 3RD ON MOBILE) */}
            <div className="[grid-area:login] lg:col-span-5 w-full">
              <ResponsiveAuthPanel onAuthSuccess={onDemoAccess} />
            </div>

            {/* 3. TELEMETRY STRIP (FULL WIDTH ROW 2 ON DESKTOP, 2ND ON MOBILE) */}
            <div className="[grid-area:stats] lg:col-span-12 w-full pt-2 sm:pt-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Card 1: Creators */}
                <SpatialTiltCard
                  maxTilt={2}
                  glowColor="sky"
                  className="glass-primary p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-2 border border-white/[0.08]"
                  style={{ transform: prefersReducedMotion ? undefined : 'translateY(0px)' }}
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono uppercase tracking-wider text-[10px]">Creators</span>
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                      4,800+
                    </div>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Verified active creators</p>
                  </div>
                </SpatialTiltCard>

                {/* Card 2: Escrow */}
                <SpatialTiltCard
                  maxTilt={2}
                  glowColor="emerald"
                  className="glass-primary p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-2 border border-white/[0.08]"
                  style={{ transform: prefersReducedMotion ? undefined : 'translateY(4px)' }}
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono uppercase tracking-wider text-[10px]">Escrow</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                      ₹4.2 Cr+
                    </div>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Secured milestone funds</p>
                  </div>
                </SpatialTiltCard>

                {/* Card 3: Latency */}
                <SpatialTiltCard
                  maxTilt={2}
                  glowColor="amber"
                  className="glass-primary p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-2 border border-white/[0.08]"
                  style={{ transform: prefersReducedMotion ? undefined : 'translateY(2px)' }}
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono uppercase tracking-wider text-[10px]">Latency</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                      &lt;120ms
                    </div>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Real-time sync SLA</p>
                  </div>
                </SpatialTiltCard>

                {/* Card 4: Fulfillment */}
                <SpatialTiltCard
                  maxTilt={2}
                  glowColor="indigo"
                  className="glass-primary p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-2 border border-white/[0.08]"
                  style={{ transform: prefersReducedMotion ? undefined : 'translateY(6px)' }}
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono uppercase tracking-wider text-[10px]">Fulfillment</span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                      99.4%
                    </div>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Contract success rate</p>
                  </div>
                </SpatialTiltCard>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 3: CREATOR & BRAND VALUE DUALITY (SPATIAL PERSPECTIVE)           */}
        {/* ======================================================================= */}
        <section className="duality-section space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400 font-semibold">
              Unified Operating System
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white font-display">
              Two Perspectives. One Unified Architecture.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Purpose-built tools for creator sovereignty and enterprise brand governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Perspective A: Creators */}
            <SpatialTiltCard
              maxTilt={2}
              glowColor="sky"
              className="glass-primary p-6 sm:p-8 rounded-3xl border border-white/[0.09] space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-sky-400" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                  For Creators
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-medium text-white font-display">
                  Sovereign Creative Ownership
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Direct contracts, locked escrow before production begins, milestone payouts, and unified portfolio analytics. No agency middlemen taking 40%.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>100% Guaranteed Payout on Milestone Approval</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Integrated Video &amp; Deliverable Inspection Suite</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Zero Net-60 Waiting — Instant Settlement</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDemoAccess('creator')}
                className="btn-soft-glass w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Preview Creator Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </button>
            </SpatialTiltCard>

            {/* Perspective B: Brands */}
            <SpatialTiltCard
              maxTilt={2}
              glowColor="indigo"
              className="glass-primary p-6 sm:p-8 rounded-3xl border border-white/[0.09] space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  For Brands
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-medium text-white font-display">
                  Guaranteed Campaign Velocity
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Discover verified creators with authentic audience demographics. Enforce milestone delivery criteria, manage usage rights, and measure live ROI.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Milestone-Locked Funds Retained until Sign-off</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Unified Licensing &amp; Usage Rights Management</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Multi-Creator Campaign Analytics &amp; Escrow Vaults</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDemoAccess('business')}
                className="btn-soft-glass w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Preview Brand Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </SpatialTiltCard>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 4: 4-STAGE PIPELINE (DISCOVER -> CONNECT -> COLLABORATE -> PAID) */}
        {/* ======================================================================= */}
        <section className="pipeline-section space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-400 font-semibold">
              The Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white font-display">
              The 4-Stage Operating Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              From discovery to settlement, every milestone is verified through code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <SpatialTiltCard
              maxTilt={2}
              className="surface-soft-recessed p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400">01</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Stage 1</span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-semibold text-white">Discover</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  AI-matched verified creators by niche, engagement quality, and historical fulfillment scores.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
                Live audience telemetry
              </div>
            </SpatialTiltCard>

            {/* Step 2 */}
            <SpatialTiltCard
              maxTilt={2}
              className="surface-soft-recessed p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">02</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Stage 2</span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-semibold text-white">Connect</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Standardized smart proposals replace messy email chains, DM negotiations, and lost briefs.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
                Immutable milestone terms
              </div>
            </SpatialTiltCard>

            {/* Step 3 */}
            <SpatialTiltCard
              maxTilt={2}
              className="surface-soft-recessed p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">03</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Stage 3</span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-semibold text-white">Collaborate</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Funds locked in escrow upfront. Revisions, video drafts, and assets review inside dedicated sandboxes.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
                100% Escrow protected
              </div>
            </SpatialTiltCard>

            {/* Step 4 */}
            <SpatialTiltCard
              maxTilt={2}
              className="surface-soft-recessed p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">04</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Stage 4</span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-semibold text-white">Get Paid</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Deliverable signed off → contract releases funds immediately into creator wallet. Zero settlement delay.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
                Instant digital settlement
              </div>
            </SpatialTiltCard>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 5: TRUST & SECURITY SIGNALS                                     */}
        {/* ======================================================================= */}
        <section className="trust-section space-y-6 pt-6">
          <div className="glass-primary p-6 sm:p-10 rounded-3xl border border-white/[0.09] space-y-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold">
                  Enterprise Infrastructure
                </span>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white font-display">
                  Engineered with Milestone Escrow &amp; SLA Guarantees
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400 shrink-0">
                CreatorOS SLA 99.4%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Milestone Escrow Vaults</span>
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Capital is locked in verified escrow before production begins, eliminating non-payment risks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                  <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Immutable Contracts</span>
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Cryptographic delivery hashes and clear usage licenses prevent post-delivery scope creep.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                  <BadgeCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Integrated Inspection</span>
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Real-time media playback, revision tracking, and automated deliverable verification in-browser.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant Payouts</span>
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Zero net-60 invoice terms. Approved milestones trigger direct payment distribution immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 6: FINAL SPATIAL CTA                                            */}
        {/* ======================================================================= */}
        <section className="final-cta-section pt-6">
          <div className="glass-primary p-8 sm:p-12 rounded-3xl border border-white/[0.1] text-center space-y-6 relative overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)]">
            {/* Top specular highlight line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />

            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-sky-400">
                Ready to Experience CreatorOS?
              </span>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white font-display">
                The operating system for creators &amp; brands.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light">
                Join thousands of creators and brands executing milestone campaigns with zero friction.
              </p>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-3.5 pt-2">
              <button
                type="button"
                onClick={onGetStarted}
                className="btn-soft-primary px-7 py-3 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
              </button>

              <button
                type="button"
                onClick={() => onDemoAccess('creator')}
                className="btn-soft-glass px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-zinc-200 hover:text-white inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Launch Interactive Demo</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 4. MINIMAL DARK GLASS FOOTER                                              */}
      {/* ========================================================================= */}
      <footer className="mt-auto border-t border-white/[0.06] bg-[#060608]/90 backdrop-blur-xl py-8 text-xs text-zinc-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <BrandLogo size="xs" />
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Operating System for Creators &amp; Brands</span>
          </div>

          <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-zinc-400">
            <a href="/terms" className="hover:text-zinc-200 transition-colors">
              Terms
            </a>
            <a href="/privacy" className="hover:text-zinc-200 transition-colors">
              Privacy
            </a>
            <a href="/support" className="hover:text-zinc-200 transition-colors">
              Support
            </a>
            <button
              type="button"
              onClick={onSignIn}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
