import React, { useEffect, useState, useRef } from 'react';
import { UserRole } from '../../../types';
import { BrandLogo } from '../../../components/common/BrandLogo';
import { CreatorShowcaseVideo } from './CreatorShowcaseVideo';
import { WelcomeAuth, AuthPanelMode } from './WelcomeAuth';

interface WelcomePageProps {
  onDemoAccess: (role: UserRole) => void;
  initialAuthMode?: AuthPanelMode;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onDemoAccess,
  initialAuthMode = 'signin',
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Single passive RAF scroll listener for subtle depth & parallax
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia) {
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
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

  // Subtle 3D Depth & Parallax Calculations
  const videoDepthTransform = prefersReducedMotion
    ? undefined
    : `translateY(${Math.min(18, scrollY * 0.025).toFixed(1)}px)`;

  const authDepthTransform = prefersReducedMotion
    ? undefined
    : `translateY(${Math.min(12, scrollY * 0.015).toFixed(1)}px)`;

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full welcome-studio-bg text-zinc-900 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-900 overflow-x-hidden font-sans relative"
    >
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC OVERLAY                                                    */}
      {/* Controlled soft ambient lighting that lets the studio wall show through    */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        {/* Soft radial spotlight over the studio backdrop */}
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-white/40 via-cyan-500/[0.04] to-transparent blur-[120px]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. PUBLIC HEADER — STRICTLY ONLY CREATOROS LOGO                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--header)] backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <BrandLogo size="md" variant="light" />
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN HERO COMPOSITION                                                  */}
      {/* Desktop: [ VIDEO (minmax 1.35fr) ]  [ AUTH (minmax 360px, 0.8fr) ]        */}
      {/* Mobile:  [ VIDEO ] -> [ AUTH ]                                            */}
      {/* ========================================================================= */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-10 sm:pb-14 flex-1 flex flex-col justify-center space-y-8 sm:space-y-10 relative z-10">
        
        {/* Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          {/* Left Column: Visual / Video Stage */}
          <div
            style={{ transform: videoDepthTransform }}
            className="lg:col-span-7 w-full flex flex-col justify-center transition-transform duration-200 ease-out"
          >
            <CreatorShowcaseVideo />
          </div>

          {/* Right Column: Single WelcomeAuth Component */}
          <div
            style={{ transform: authDepthTransform }}
            className="lg:col-span-5 w-full flex flex-col justify-center items-center transition-transform duration-200 ease-out"
          >
            <WelcomeAuth
              initialMode={initialAuthMode}
              onAuthSuccess={onDemoAccess}
            />
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 4. COMPACT HORIZONTAL PLATFORM CAPABILITIES STRIP                       */}
        {/* ======================================================================= */}
        <section
          aria-label="Platform Capabilities"
          className="w-full pt-1 sm:pt-2"
        >
          <div className="w-full rounded-2xl bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)] shadow-xs px-4 sm:px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
              {/* Feature 1 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-2 sm:pt-0 sm:px-3 first:px-0">
                <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] tracking-tight">
                  Verified Identity
                </span>
                <span className="text-[11px] font-sans text-[var(--text-secondary)] mt-0.5">
                  Direct Creator &amp; Brand onboarding
                </span>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-2 sm:pt-0 sm:px-3">
                <span className="text-xs sm:text-sm font-bold text-[var(--primary)] tracking-tight">
                  Milestone Escrow
                </span>
                <span className="text-[11px] font-sans text-[var(--text-secondary)] mt-0.5">
                  Clear terms &amp; deliverable approvals
                </span>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-2 sm:pt-0 sm:px-3">
                <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] tracking-tight">
                  Live Studio
                </span>
                <span className="text-[11px] font-sans text-[var(--text-secondary)] mt-0.5">
                  AI camera &amp; spatial 3D scenes
                </span>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-2 sm:pt-0 sm:px-3">
                <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] tracking-tight">
                  Direct Messages
                </span>
                <span className="text-[11px] font-sans text-[var(--text-secondary)] mt-0.5">
                  Real-time briefs &amp; collaboration
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 5. MINIMAL CLEAN FOOTER                                                    */}
      {/* ========================================================================= */}
      <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-xl py-6 text-xs text-[var(--text-secondary)] font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="xs" variant="light" />
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-secondary)] font-medium">Creators &amp; Brands</span>
          </div>

          <div className="flex items-center flex-wrap gap-5 sm:gap-7 text-[var(--text-secondary)] font-medium">
            <a href="/terms" className="hover:text-[var(--text-primary)] transition-colors">
              Terms
            </a>
            <a href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
              Privacy
            </a>
            <a href="/support" className="hover:text-zinc-900 transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
