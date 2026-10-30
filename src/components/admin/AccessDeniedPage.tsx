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
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text-primary)] flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Background Security Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-rose-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" iconOnly />
          <span className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
            CreatorOS Security Gateway
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-rose-400" />
          <span>403 FORBIDDEN</span>
        </div>
      </header>

      {/* Main Denial Card */}
      <main className="relative z-10 max-w-lg mx-auto w-full text-center space-y-6 my-auto py-8">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-[0_0_50px_rgba(244,63,94,0.15)]">
            <ShieldAlert className="w-10 h-10 animate-pulse text-rose-400" />
          </div>
          <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold tracking-wider uppercase">
            Restricted
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-sans">
            Access Denied
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
            This endpoint requires verified Super Admin Root Authority. Your current session does not possess clearances for the Command Center.
          </p>
        </div>

        {/* Security telemetry box */}
        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] font-mono text-left text-[11px] text-[var(--text-muted)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)] border-b border-[var(--border)] pb-1 mb-1">
            <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <Terminal className="w-3 h-3 text-rose-400" />
              <span>SECURITY LOG</span>
            </span>
            <span className="text-[10px]">AUTH_RULE_36</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Resource:</span>
            <span className="text-[var(--text-secondary)] truncate max-w-[240px]">{window.location.pathname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Disposition:</span>
            <span className="text-rose-400 font-semibold">RBAC Isolation Enforced</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onBackToApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Return to Workspace</span>
          </button>

          <button
            type="button"
            onClick={onGoToAdminLogin}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center max-w-5xl mx-auto w-full">
        <p className="text-[11px] text-[var(--text-muted)] font-mono">
          CreatorOS Security Framework • Confidential &amp; Protected
        </p>
      </footer>
    </div>
  );
};
