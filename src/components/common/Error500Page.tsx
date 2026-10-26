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
    <div className="min-h-screen w-full bg-[#EAECEF] text-zinc-900 flex flex-col justify-between font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Header */}
      <header className="w-full border-b border-black/[0.08] bg-[#EAECEF]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleHome}
            className="flex items-center gap-3 cursor-pointer"
          >
            <BrandLogo size="sm" />
          </button>
          <span className="text-xs font-mono text-zinc-500">
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
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-white border border-black/[0.08] text-[11px] font-mono font-bold text-rose-300">
              500
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
              Something went wrong
            </h1>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
              We encountered an unexpected server error while processing your request. The issue has been automatically logged for our operations team.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReload}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#007E93] hover:bg-[#006779] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>

            <a
              href="/support"
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-white shadow-sm hover:bg-zinc-100 border border-black/[0.08] text-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-zinc-500" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-black/[0.06] py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>CreatorOS • Incident Response Active</span>
          <div className="flex items-center gap-4 text-zinc-500">
            <a href="/terms" className="hover:text-zinc-800 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-zinc-800 transition-colors">Privacy</a>
            <a href="/support" className="hover:text-zinc-800 transition-colors">Support Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
