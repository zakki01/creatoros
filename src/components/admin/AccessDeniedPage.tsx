import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, Terminal } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface AccessDeniedPageProps {
  onBackToApp?: () => void;
  onGoToAdminLogin?: () => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  onBackToApp = () => {
    window.location.href = '/';
  },
  onGoToAdminLogin = () => {
    window.location.href = '/admin/login';
  },
}) => {
  return (
    <div className="min-h-screen w-full bg-[#EAECEF] text-zinc-900 flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Background Security Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-rose-950/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" iconOnly />
          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
            CreatorOS Security Gateway
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-rose-400" />
          <span>403 FORBIDDEN</span>
        </div>
      </header>

      {/* Main Denial Card */}
      <main className="relative z-10 max-w-lg mx-auto w-full text-center space-y-6 my-auto py-8">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_50px_rgba(244,63,94,0.2)]">
            <ShieldAlert className="w-10 h-10 animate-pulse text-rose-400" />
          </div>
          <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold tracking-wider uppercase">
            Restricted
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Access Denied
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-md mx-auto">
            This endpoint requires verified Super Admin Root Authority. Your current session does not possess clearances for the Command Center.
          </p>
        </div>

        {/* Security telemetry box */}
        <div className="p-3.5 rounded-xl bg-white shadow-sm border border-zinc-200 font-mono text-left text-[11px] text-zinc-500 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-900 pb-1 mb-1">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Terminal className="w-3 h-3 text-rose-400" />
              <span>SECURITY LOG</span>
            </span>
            <span className="text-[10px]">AUTH_RULE_36</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Resource:</span>
            <span className="text-zinc-700 truncate max-w-[240px]">{window.location.pathname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Disposition:</span>
            <span className="text-rose-400 font-semibold">RBAC Isolation Enforced</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onBackToApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white shadow-sm hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-800 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-500" />
            <span>Return to Workspace</span>
          </button>

          <button
            type="button"
            onClick={onGoToAdminLogin}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center max-w-5xl mx-auto w-full">
        <p className="text-[11px] text-zinc-600 font-mono">
          CreatorOS Security Framework • Confidential & Protected
        </p>
      </footer>
    </div>
  );
};
