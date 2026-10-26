import React, { useState, useRef } from 'react';
import {
  Users,
  Lock,
  Zap,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { UserRole } from '../../../types';
import { BrandLogo } from '../../../components/common/BrandLogo';
import { CreatorShowcaseVideo } from './CreatorShowcaseVideo';
import { WelcomeAuth } from './WelcomeAuth';
import { AuthTab } from '../types';

interface WelcomePageProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
  onDemoAccess: (role: UserRole) => void;
  initialAuthTab?: AuthTab;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onGetStarted,
  onSignIn,
  onDemoAccess,
  initialAuthTab = 'login',
}) => {
  const [authTab, setAuthTab] = useState<AuthTab>(initialAuthTab);
  const authSectionRef = useRef<HTMLDivElement>(null);

  const scrollToAuth = (targetTab: AuthTab) => {
    setAuthTab(targetTab);
    if (authSectionRef.current) {
      authSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSignInClick = () => {
    scrollToAuth('login');
    onSignIn?.();
  };

  const handleGetStartedClick = () => {
    scrollToAuth('signup');
    onGetStarted?.();
  };

  return (
    <div className="min-h-screen w-full bg-[#07070A] text-zinc-100 flex flex-col justify-between selection:bg-cyan-500/25 selection:text-cyan-100 overflow-x-hidden font-sans relative">
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC BACKDROP                                                   */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-indigo-600/[0.08] via-cyan-600/[0.05] to-transparent blur-[160px]" />
        <div className="absolute top-[60%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[140px]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. MINIMAL HEADER                                                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#07070A]/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo size="md" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSignInClick}
              className="px-4 py-1.5 rounded-full text-xs font-sans font-medium text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer bg-white/[0.06] hover:bg-white/[0.1] border border-white/10"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleGetStartedClick}
              className="px-4 py-1.5 rounded-full text-xs font-sans font-semibold active:scale-95 cursor-pointer bg-white text-zinc-950 hover:bg-zinc-100 transition-all inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CORE MAIN STAGE (DESKTOP 2-COLUMNS | MOBILE 1-COLUMN)                  */}
      {/* ========================================================================= */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-12 flex-1 flex flex-col justify-center space-y-8 sm:space-y-10 relative z-10">
        
        {/* Split Grid: Left Showcase Video Stage | Right Single Auth Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Visual / Video Stage */}
          <div className="lg:col-span-7 w-full flex flex-col justify-center">
            <CreatorShowcaseVideo />
          </div>

          {/* Right Column: Single Floating Authentication Card */}
          <div
            ref={authSectionRef}
            className="lg:col-span-5 w-full flex flex-col justify-center items-center"
          >
            <WelcomeAuth
              initialTab={authTab}
              onAuthSuccess={onDemoAccess}
            />
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 4. COMPACT 1-ROW TRUST & TELEMETRY STRIP                                */}
        {/* ======================================================================= */}
        <section aria-label="Platform Telemetry" className="w-full pt-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Metric 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md flex flex-col justify-between space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-mono uppercase tracking-wider text-[10px]">Creators</span>
                <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
                  4,800+
                </div>
                <p className="text-[10px] text-zinc-400 font-sans">Verified active creators</p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md flex flex-col justify-between space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-mono uppercase tracking-wider text-[10px]">Escrow</span>
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 tracking-tight">
                  ₹4.2 Cr+
                </div>
                <p className="text-[10px] text-zinc-400 font-sans">Secured milestone funds</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md flex flex-col justify-between space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-mono uppercase tracking-wider text-[10px]">Latency</span>
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
                  &lt;120ms
                </div>
                <p className="text-[10px] text-zinc-400 font-sans">Real-time sync SLA</p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md flex flex-col justify-between space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-mono uppercase tracking-wider text-[10px]">Fulfillment</span>
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
                  99.4%
                </div>
                <p className="text-[10px] text-zinc-400 font-sans">Contract success rate</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 5. MINIMAL CLEAN FOOTER                                                    */}
      {/* ========================================================================= */}
      <footer className="w-full border-t border-white/[0.06] bg-[#07070A]/90 backdrop-blur-xl py-6 text-xs text-zinc-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
              onClick={handleSignInClick}
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
