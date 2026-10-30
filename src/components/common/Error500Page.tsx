import React from 'react';
import { AlertCircle, RefreshCw, Home, LifeBuoy } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface Error500PageProps {
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const Error500Page: React.FC<Error500PageProps> = ({
  onRetry,
  onGoHome,
}) => {
  const handleReload = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text-primary)] flex flex-col justify-between font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Header */}
      <header className="w-full border-b border-[var(--border)] bg-[var(--header)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleHome}
            className="flex items-center gap-3 cursor-pointer"
          >
            <BrandLogo size="sm" />
          </button>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            System Status: Monitoring
          </span>
        </div>
      </header>

      {/* Main Error Canvas */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-6 animate-fade-in">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-2xl shadow-rose-600/10">
              <AlertCircle className="w-10 h-10 animate-pulse-subtle" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono font-bold text-rose-400">
              500
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
              We encountered an unexpected server error while processing your request. The issue has been automatically logged for our operations team.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReload}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>

            <a
              href="/support"
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>CreatorOS • Incident Response Active</span>
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
