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
    <div className="min-h-screen w-full bg-[#070709] text-zinc-100 flex flex-col justify-between font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header Bar */}
      <header className="w-full border-b border-white/[0.08] bg-[#070709]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleHome}
            className="flex items-center gap-3 cursor-pointer"
          >
            <BrandLogo size="sm" />
          </button>
          <button
            onClick={handleHome}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
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
            <div className="w-20 h-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-2xl shadow-indigo-600/10">
              <Compass className="w-10 h-10 animate-pulse-subtle" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-zinc-300">
              404
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Page not found
            </h1>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist, has been archived, or was moved to another route.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleHome}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Go Home</span>
            </button>

            <button
              onClick={handleBack}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>CreatorOS • Professional Creative Operating System</span>
          <div className="flex items-center gap-4 text-zinc-400">
            <a href="/terms" className="hover:text-zinc-200 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-zinc-200 transition-colors">Privacy</a>
            <a href="/support" className="hover:text-zinc-200 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
