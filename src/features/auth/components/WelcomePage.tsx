import React, { useState } from 'react';
import {
  Film,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Users,
  Video,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { UserRole } from '../../../types';
import { BrandLogo } from '../../../components/common/BrandLogo';
import { DynamicWelcomeBanner } from './DynamicWelcomeBanner';
import { ResponsiveAuthPanel } from './ResponsiveAuthPanel';
import { getSessionBanner } from '../../../data/welcomeBanners';
import { useAppState } from '../../../context/StateContext';

interface WelcomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreLiveStudio: () => void;
  onDemoAccess: (role: UserRole) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onGetStarted,
  onSignIn,
  onExploreLiveStudio,
  onDemoAccess,
}) => {
  const [activeBanner] = useState(() => {
    return getSessionBanner('creator');
  });

  return (
    <div className="min-h-screen w-full bg-[#070709] text-zinc-100 flex flex-col justify-between selection:bg-sky-500/30 selection:text-sky-100 overflow-x-hidden font-sans relative">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Editorial Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#070709]/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onExploreLiveStudio}
              className="hidden md:inline-flex items-center gap-2 text-xs font-sans font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-sky-400" />
              <span>Live Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            </button>

            <button
              onClick={() => onDemoAccess('creator')}
              className="hidden sm:inline-block text-xs font-sans font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Explore Creator
            </button>

            <button
              onClick={() => onDemoAccess('business')}
              className="hidden sm:inline-block text-xs font-sans font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Explore Brand
            </button>

            <button
              onClick={onSignIn}
              className="px-4 py-1.5 rounded-full text-xs font-sans font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Experience Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-20 relative z-10">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC SPLIT WELCOME / AUTH EXPERIENCE                              */}
        {/* ========================================================================= */}
        <section className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* LEFT / MAIN AREA: Large Dynamic Creative Banner (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <DynamicWelcomeBanner
                banner={activeBanner}
                experienceMode="creator"
                onActionClick={onGetStarted}
                onExploreStudioClick={onExploreLiveStudio}
                className="flex-1"
              />
            </div>

            {/* RIGHT / SECONDARY AREA: Clean Authentication Panel (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <ResponsiveAuthPanel
                onAuthSuccess={onDemoAccess}
                className="flex-1"
              />
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 2. LIVE METRICS BENTO STRIP (TELEMETRY & CONFIDENCE)                     */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-2 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono uppercase tracking-wider text-[10px]">Active Network</span>
              <Users className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                4,800+
              </div>
              <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                Verified creators across 32 creative verticals
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-2 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono uppercase tracking-wider text-[10px]">Escrow Security</span>
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tracking-tight">
                ₹4.2 Cr+
              </div>
              <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                100% milestone protected; zero unpaid work
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-2 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono uppercase tracking-wider text-[10px]">Live AI Latency</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                &lt;120ms
              </div>
              <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                Realtime 35mm camera transformation
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-2 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono uppercase tracking-wider text-[10px]">Quality Standard</span>
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                99.4%
              </div>
              <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                On-time submission & automated compliance
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CREATOR SHOWCASE (VISUALLY DOMINANT TILES)                             */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6 text-left">
            <div className="space-y-1">
              <span className="text-xs font-sans font-medium uppercase tracking-widest text-sky-400">
                Creative Architecture
              </span>
              <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-white font-display">
                Engineered for Creators & High-Impact Brands.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light max-w-md">
              From 35mm film transformations to milestone-locked releases and verified brand collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">

            {/* Tile 1: Video (7 Cols) */}
            <div className="md:col-span-7 group relative rounded-3xl overflow-hidden border border-white/10 bg-black/60 min-h-[360px] flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 hover:border-white/20">
              <img
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=85"
                alt="Cinematic Video"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-white/10 backdrop-blur-md text-white border border-white/15">
                  01 • Cinematic Video
                </span>
                <h3 className="text-2xl font-medium font-display text-white">
                  Realtime Camera Grading
                </h3>
                <p className="text-xs text-zinc-300 font-sans font-light max-w-lg leading-relaxed">
                  Webcam feeds transformed into 35mm footage with instant film grain and shallow depth.
                </p>
              </div>
            </div>

            {/* Tile 2: Editorial Photography (5 Cols) */}
            <div className="md:col-span-5 group relative rounded-3xl overflow-hidden border border-white/10 bg-black/60 min-h-[360px] flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 hover:border-white/20">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=85"
                alt="Editorial Photography"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-white/10 backdrop-blur-md text-white border border-white/15">
                  02 • Photography
                </span>
                <h3 className="text-2xl font-medium font-display text-white">
                  Editorial Visual Stories
                </h3>
                <p className="text-xs text-zinc-300 font-sans font-light leading-relaxed">
                  Studio lookbooks and campaign stills delivered with pristine color fidelity.
                </p>
              </div>
            </div>

            {/* Tile 3: 9:16 Social Reels (5 Cols) */}
            <div className="md:col-span-5 group relative rounded-3xl overflow-hidden border border-white/10 bg-black/60 min-h-[320px] flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 hover:border-white/20">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&auto=format&fit=crop&q=85"
                alt="Social Content Gear"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-white/10 backdrop-blur-md text-white border border-white/15">
                  03 • Social Content
                </span>
                <h3 className="text-xl font-medium font-display text-white">
                  9:16 Vertical Storytelling
                </h3>
                <p className="text-xs text-zinc-300 font-sans font-light leading-relaxed">
                  Fast short-form clips recorded and submitted to brand milestones in minutes.
                </p>
              </div>
            </div>

            {/* Tile 4: Brand Releases (7 Cols) */}
            <div className="md:col-span-7 group relative rounded-3xl overflow-hidden border border-white/10 bg-black/60 min-h-[320px] flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 hover:border-white/20">
              <img
                src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&auto=format&fit=crop&q=85"
                alt="Creative Moodboard"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-white/10 backdrop-blur-md text-white border border-white/15">
                  04 • Releases
                </span>
                <h3 className="text-xl font-medium font-display text-white">
                  Milestone-Locked Releases
                </h3>
                <p className="text-xs text-zinc-300 font-sans font-light max-w-lg leading-relaxed">
                  Guaranteed upfront escrow with automated balance releases upon deliverable sign-off.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. VISUAL WORKFLOW (IDEA → CREATE → EDIT → PUBLISH)                      */}
        {/* ========================================================================= */}
        <section className="space-y-10">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-sans font-medium uppercase tracking-widest text-sky-400">
              The Creative Flow
            </span>
            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-white font-display">
              From Concept to Release.
            </h2>
            <p className="text-xs text-zinc-400 font-sans font-light">
              Frictionless pipeline built for creators and brands who value visual craft.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Step 1: IDEA */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 space-y-3 hover:border-white/20 transition-all">
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-white/5 bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
                  alt="Idea Inspiration"
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                  BRIEF LOCKED
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">01 • IDEA</span>
                <h4 className="text-sm font-medium font-display text-white">Concept & Brief</h4>
                <p className="text-[11px] text-zinc-400 font-sans font-light">Direct campaign alignment with clear visual goals.</p>
              </div>
            </div>

            {/* Step 2: CREATE */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 space-y-3 hover:border-white/20 transition-all">
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-white/5 bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80"
                  alt="Camera Viewfinder"
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600/80 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>LIVE CAPTURE</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">02 • CREATE</span>
                <h4 className="text-sm font-medium font-display text-white">Live AI Capture</h4>
                <p className="text-[11px] text-zinc-400 font-sans font-light">Realtime scene styling and 9:16 clip recording.</p>
              </div>
            </div>

            {/* Step 3: EDIT */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 space-y-3 hover:border-white/20 transition-all">
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-white/5 bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80"
                  alt="Studio Editing"
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                  QC PASSED
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">03 • EDIT</span>
                <h4 className="text-sm font-medium font-display text-white">Review & Submission</h4>
                <p className="text-[11px] text-zinc-400 font-sans font-light">Automated resolution checks and compliance verification.</p>
              </div>
            </div>

            {/* Step 4: PUBLISH */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 space-y-3 hover:border-white/20 transition-all">
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-white/5 bg-zinc-900 flex items-center justify-center p-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                  alt="Published Release"
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 font-mono">ESCROW RELEASED</span>
                  <span className="text-white font-medium">₹35,000</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">04 • PUBLISH</span>
                <h4 className="text-sm font-medium font-display text-white">Release & Payout</h4>
                <p className="text-[11px] text-zinc-400 font-sans font-light">Instant release directly to your registered account.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Minimal Footer */}
      <footer className="border-t border-white/[0.06] bg-[#070709] py-8 text-xs text-zinc-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="xs" />
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Next-Generation Creator & Brand Network</span>
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
            <span className="hidden md:inline text-zinc-600">•</span>
            <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono">Systems Operational</span>
            </div>
            <button onClick={onSignIn} className="hover:text-zinc-200 transition-colors cursor-pointer">
              Sign In
            </button>
            <button onClick={onGetStarted} className="hover:text-zinc-200 transition-colors cursor-pointer">
              Create Account
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
