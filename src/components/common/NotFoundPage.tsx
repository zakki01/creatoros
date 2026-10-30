import React from 'react';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NotFoundPageProps {
  onGoHome?: () => void;
  onGoBack?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onGoHome,
  onGoBack,
}) => {
  const handleHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text-primary)] flex flex-col justify-between font-sans selection:bg-[var(--accent)]/10 selection:text-[var(--accent)]">
      {/* Header Bar */}
      <header className="w-full border-b border-[var(--border)] bg-[var(--header)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleHome}
            className="flex items-center gap-3 cursor-pointer"
          >
            <BrandLogo size="sm" />
          </button>
          <button
            onClick={handleHome}
            className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            CreatorOS Network
          </button>
        </div>
      </header>

      {/* Main 404 Canvas */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-6 animate-fade-in">
          {/* Visual Indicator */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center shadow-2xl">
              <Compass className="w-10 h-10 animate-pulse-subtle" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono font-bold text-[var(--text-secondary)]">
              404
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
              Page not found
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist, has been archived, or was moved to another route.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleHome}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Go Home</span>
            </button>

            <button
              onClick={handleBack}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>CreatorOS • Professional Creative Operating System</span>
          <div className="flex items-center gap-4 text-[var(--text-muted)]">
            <a href="/terms" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="/support" className="hover:text-[var(--text-primary)] transition-colors">Support Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
