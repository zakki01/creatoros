import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { AdminAuthService } from '../../features/auth/services/authService';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onExitToPublic?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onExitToPublic = () => {
    window.location.href = '/';
  },
}) => {
  const [email, setEmail] = useState('alex.admin@creatoros.ai');
  const [password, setPassword] = useState('admin123456');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer !== null && lockoutTimer > 0) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Administrative email and password are required.');
      }

      await AdminAuthService.login({
        email,
        password,
        twoFactorCode: twoFactorCode.trim() || undefined,
      });

      onLoginSuccess();
    } catch (err: any) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 4) {
        setLockoutTimer(30);
        setErrorMessage('Too many failed authorization attempts. Security throttle active for 30s.');
        const interval = setInterval(() => {
          setLockoutTimer((prev) => {
            if (prev === null || prev <= 1) {
              clearInterval(interval);
              setAttempts(0);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrorMessage(err.message || 'Authorization failed. Check your security credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('alex.admin@creatoros.ai');
    setPassword('admin123456');
    setTwoFactorCode('849201');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text-primary)] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Background Ambience - High Security Grid & Pulse */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-rose-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Top Security Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" iconOnly />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[var(--text-primary)] uppercase">
              CreatorOS
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
              ROOT ENCLAVE
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExitToPublic}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Portal</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto py-8">
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] backdrop-blur-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-1">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-sans">
              CreatorOS Command Center
            </h1>
            <p className="text-xs text-rose-400 font-mono tracking-wide">
              Super Admin Access
            </p>
          </div>

          {/* Security Alert / Error */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Authentication Notice</span>
                <span className="text-[11px] leading-relaxed block text-rose-400">
                  {errorMessage}
                </span>
              </div>
            </div>
          )}

          {lockoutTimer !== null && lockoutTimer > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-500 font-mono">
              <span>Security Lockdown:</span>
              <span className="font-bold">{lockoutTimer}s remaining</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-mono font-medium text-[var(--text-secondary)] flex items-center justify-between">
                <span>Admin Email</span>
                <span className="text-[10px] text-[var(--text-muted)]">Root Account</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@creatoros.ai"
                  required
                  disabled={isLoading || (lockoutTimer !== null && lockoutTimer > 0)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-mono font-medium text-[var(--text-secondary)] flex items-center justify-between">
                <span>Password</span>
                <span className="text-[10px] text-[var(--text-muted)]">Encrypted Key</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={isLoading || (lockoutTimer !== null && lockoutTimer > 0)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Optional 2FA Code */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-mono font-medium text-[var(--text-secondary)] flex items-center justify-between">
                <span>2FA Verification Code</span>
                <span className="text-[10px] text-[var(--text-muted)]">(Optional for Sandbox)</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit code e.g. 849201"
                  disabled={isLoading || (lockoutTimer !== null && lockoutTimer > 0)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 transition-all font-mono tracking-widest"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading || (lockoutTimer !== null && lockoutTimer > 0)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white text-xs font-semibold font-sans tracking-wide transition-all shadow-lg shadow-rose-950/40 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Authorize & Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox Preset Helper */}
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Root Sandbox Profile:</span>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="text-rose-400 hover:text-rose-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Autofill Credentials
            </button>
          </div>
        </div>

        {/* Security telemetry notice */}
        <div className="mt-4 p-3 rounded-xl bg-zinc-50 border border-zinc-900 text-center font-mono text-[10px] text-zinc-600 space-y-1">
          <p className="flex items-center justify-center gap-1.5 text-zinc-500">
            <Terminal className="w-3 h-3 text-rose-500/70" />
            <span>CR-SEC-KERNEL • Strict RBAC Boundary Enforced</span>
          </p>
          <p>Direct login endpoint is isolated from public creator/brand workflows.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <p className="text-[11px] text-zinc-600 font-mono">
          CreatorOS Autonomous Governance & Security Enclave
        </p>
      </footer>
    </div>
  );
};
