import React, { useState, useEffect } from 'react';
import {
  Mail,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Ticket,
  Building2,
  Sparkles,
} from 'lucide-react';
import { AuthService } from '../services/authService';
import { BetaAccessService } from '../../../services/betaAccessService';
import { OtpVerificationService } from '../../../services/otpVerificationService';
import { RequestBetaAccessModal } from './RequestBetaAccessModal';
import { supabase } from '../../../services/supabaseClient';
import { OAuthNoticeModal } from './OAuthNoticeModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { useAppState } from '../../../context/StateContext';
import { UserRole } from '../../../types';

export type AuthPanelMode = 'signin' | 'register';

export interface WelcomeAuthProps {
  initialMode?: AuthPanelMode;
  onAuthSuccess?: (role: UserRole) => void;
  className?: string;
}

export const WelcomeAuth: React.FC<WelcomeAuthProps> = ({
  initialMode = 'signin',
  onAuthSuccess,
  className = '',
}) => {
  const { setRole, triggerCelebration, login } = useAppState();

  const [mode, setMode] = useState<AuthPanelMode>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'creator' | 'business'>('creator');

  // Form Fields - Clean initial values (ZERO DEMO PREFILL)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return (p.get('invite') || '').toUpperCase();
    }
    return '';
  });
  const [inviteFeedback, setInviteFeedback] = useState<string | null>(null);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationPendingEmail, setVerificationPendingEmail] = useState<string | null>(null);

  // OTP Verification States for Registration & Confirmation
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [otpDispatchedCode, setOtpDispatchedCode] = useState<string | null>(null);
  const [isVerifyingPendingOtp, setIsVerifyingPendingOtp] = useState(false);
  const [pendingOtpError, setPendingOtpError] = useState<string | null>(null);
  const [pendingOtpSuccess, setPendingOtpSuccess] = useState(false);

  useEffect(() => {
    if (verificationPendingEmail) {
      setOtpCodeInput('');
      setPendingOtpError(null);
      setPendingOtpSuccess(false);
      const res = OtpVerificationService.sendOtp(verificationPendingEmail, 'email_verification');
      if (res.success && res.code) {
        setOtpDispatchedCode(res.code);
      }
    }
  }, [verificationPendingEmail]);

  // Real-time Invite Code Verification
  useEffect(() => {
    if (inviteCode.trim()) {
      const res = BetaAccessService.validateInviteCode(inviteCode.trim(), selectedRole);
      if (res.valid) {
        setInviteFeedback(res.badge || 'Verified Beta VIP Pass');
      } else {
        setInviteFeedback(null);
      }
    } else {
      setInviteFeedback(null);
    }
  }, [inviteCode, selectedRole]);

  // URL Hash Verification State (e.g. expired or invalid tokens)
  const [urlAuthError, setUrlAuthError] = useState<{ code?: string; description?: string } | null>(null);
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Modals
  const [oauthNoticeProvider, setOauthNoticeProvider] = useState<
    'google' | 'apple' | 'facebook' | null
  >(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Synchronize when initialMode changes externally
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode]);

  // Check URL hash for Supabase auth errors (e.g. expired email confirmation link)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && (hash.includes('error=') || hash.includes('error_code='))) {
        const cleanHash = hash.replace(/^[#?]/, '');
        const params = new URLSearchParams(cleanHash);
        const error = params.get('error');
        const errorCode = params.get('error_code');
        const rawDescription = params.get('error_description');

        if (error || errorCode) {
          const description = rawDescription
            ? decodeURIComponent(rawDescription.replace(/\+/g, ' '))
            : errorCode === 'otp_expired'
            ? 'Your email verification link has expired. Please request a new link.'
            : 'The verification link is invalid or expired.';

          setUrlAuthError({
            code: errorCode || error || undefined,
            description,
          });
        }
      }
    } catch (err) {
      console.warn('[WelcomeAuth] Failed to parse URL hash error:', err);
    }
  }, []);

  const handleResendConfirmation = async (emailToResend: string) => {
    const targetEmail = (emailToResend || email || resendEmail).trim().toLowerCase();
    if (!targetEmail) {
      setErrorMessage('Please enter your email to receive a new confirmation link.');
      return;
    }
    setIsResending(true);
    setResendSuccess(false);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
      });
      if (error) throw error;
      setResendSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend confirmation email.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name or company name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter your password.');
        return;
      }

      // Private Beta Invite Code Requirement
      const inviteValidation = BetaAccessService.validateInviteCode(inviteCode.trim(), selectedRole);
      if (!inviteValidation.valid) {
        setErrorMessage(inviteValidation.error || 'A valid VIP invite code is required to join the private beta.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'signin') {
        const user = await AuthService.loginWithEmail({ email: trimmedEmail, password });
        login(user);
        triggerCelebration();
        onAuthSuccess?.(user.role);
      } else {
        const result = await AuthService.signUpWithEmail({
          name: name.trim(),
          email: trimmedEmail,
          password,
          role: selectedRole,
        });

        if (inviteCode.trim()) {
          BetaAccessService.redeemInviteCode(
            inviteCode.trim(),
            result.user?.id || 'pending_usr',
            trimmedEmail
          );
        }

        if (result.emailConfirmationRequired) {
          setVerificationPendingEmail(trimmedEmail);
        } else if (result.user) {
          login(result.user);
          triggerCelebration();
          onAuthSuccess?.(result.user.role);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || `${mode === 'signin' ? 'Sign in' : 'Registration'} failed.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPendingOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otpCodeInput).trim();
    if (!verificationPendingEmail) return;
    if (code.length < 6) {
      setPendingOtpError('Please enter the 6-digit confirmation code.');
      return;
    }
    setIsVerifyingPendingOtp(true);
    setPendingOtpError(null);
    try {
      const res = await OtpVerificationService.verifyOtpAsync(
        verificationPendingEmail,
        code,
        'email_verification'
      );
      if (res.success) {
        setPendingOtpSuccess(true);
        OtpVerificationService.markTargetVerified(verificationPendingEmail, 'email_verification');

        const authUser = {
          id: res.session?.user?.id || `usr_${Date.now()}`,
          email: verificationPendingEmail,
          role: selectedRole,
          name: name || res.session?.user?.user_metadata?.name || 'CreatorOS User',
          handle: `@${(name || 'user').toLowerCase().replace(/[^a-z0-9_]/g, '') || 'creator'}`,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          provider: 'email' as const,
          isBetaUser: true,
          badge: selectedRole === 'business' ? 'Verified Brand Partner' : 'Verified Founding Creator',
        };
        AuthService.saveSession(authUser);
        login(authUser);
        triggerCelebration();
        setTimeout(() => {
          onAuthSuccess?.(selectedRole);
        }, 1200);
      } else {
        setPendingOtpError(res.error || 'Invalid verification code. Please check and try again.');
      }
    } catch {
      setPendingOtpError('Failed to verify OTP code.');
    } finally {
      setIsVerifyingPendingOtp(false);
    }
  };

  const handleSocialSelect = (provider: 'google' | 'apple' | 'facebook') => {
    setErrorMessage(null);
    setOauthNoticeProvider(provider);
  };

  // Dedicated Screen: Email Verification & OTP Confirmation
  if (verificationPendingEmail) {
    return (
      <div
        className={`studio-card-soft rounded-[28px] p-6 sm:p-8 lg:p-9 w-full max-w-[440px] mx-auto select-none transition-all text-center space-y-4 animate-fade-in ${className}`}
      >
        <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">
            Verify Email &amp; Activate Account
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Enter the 6-digit OTP code dispatched to confirm your identity:
          </p>
          <p className="text-xs font-mono font-bold text-[var(--primary)] bg-[var(--surface-muted)] py-1 px-3 rounded-lg inline-block border border-[var(--border)]">
            {verificationPendingEmail}
          </p>
        </div>

        {/* Real-time Dispatch Preview (Guarantees zero friction if spam filtered) */}
        {otpDispatchedCode && (
          <div className="p-3 rounded-xl bg-blue-50/90 dark:bg-sky-950/40 border border-blue-200 dark:border-sky-800 text-left text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-blue-800 dark:text-sky-300">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Verification OTP Dispatched:</span>
              </span>
              <span className="font-mono text-[10px] bg-blue-200/60 dark:bg-sky-900/60 px-1.5 py-0.5 rounded">
                Valid 10m
              </span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="font-mono text-sm font-bold text-blue-700 dark:text-sky-300 tracking-wider">
                OTP: {otpDispatchedCode}
              </span>
              <button
                type="button"
                onClick={() => {
                  setOtpCodeInput(otpDispatchedCode);
                  handleVerifyPendingOtp(otpDispatchedCode);
                }}
                className="text-[11px] font-bold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Auto-Fill &amp; Confirm</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {pendingOtpError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pendingOtpError}</span>
          </div>
        )}

        {pendingOtpSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Account verified! Entering CreatorOS...</span>
          </div>
        )}

        {/* 6-Digit Code Input */}
        <div className="space-y-3 pt-1">
          <input
            type="text"
            maxLength={6}
            value={otpCodeInput}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtpCodeInput(val);
              setPendingOtpError(null);
              if (val.length === 6) {
                handleVerifyPendingOtp(val);
              }
            }}
            placeholder="• • • • • •"
            className="w-full text-center font-mono font-bold text-2xl tracking-[0.3em] py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 dark:focus:border-sky-500 transition-all shadow-xs"
          />

          <button
            type="button"
            onClick={() => handleVerifyPendingOtp()}
            disabled={isVerifyingPendingOtp || pendingOtpSuccess || otpCodeInput.length < 6}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shadow-xs"
          >
            {isVerifyingPendingOtp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white dark:text-slate-950" />
                <span>Verifying OTP...</span>
              </>
            ) : (
              <span>Verify &amp; Activate Account</span>
            )}
          </button>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
            <button
              type="button"
              onClick={() => handleResendConfirmation(verificationPendingEmail)}
              disabled={isResending}
              className="text-blue-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Resending...' : 'Resend Link / OTP'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVerificationPendingEmail(null);
                setMode('signin');
              }}
              className="hover:underline text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`studio-card-soft rounded-[28px] p-6 sm:p-8 lg:p-9 w-full max-w-[430px] mx-auto select-none transition-all ${className}`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP SEGMENTED SWITCHER: [ Sign in ] | [ Register <UserPlus /> ]
         ───────────────────────────────────────────────────────────── */}
      <div className="auth-pdf-tab-track rounded-full p-1.5 flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer text-center ${
            mode === 'signin'
              ? 'auth-pdf-pill-active'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
          }`}
        >
          Sign in
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'register'
              ? 'auth-pdf-pill-active'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
          }`}
        >
          <span>Register</span>
          <UserPlus className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ROLE TOGGLE: CREATOR | BRAND (ONLY SHOWN IN REGISTER MODE)
         ───────────────────────────────────────────────────────────── */}
      {mode === 'register' && (
        <div className="flex items-center gap-2.5 mb-5 animate-fade-in">
          <button
            type="button"
            onClick={() => setSelectedRole('creator')}
            className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              selectedRole === 'creator'
                ? 'auth-pdf-role-active'
                : 'auth-pdf-role-inactive'
            }`}
          >
            Creator
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('business')}
            className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              selectedRole === 'business'
                ? 'auth-pdf-role-active'
                : 'auth-pdf-role-inactive'
            }`}
          >
            Brand
          </button>
        </div>
      )}

      {/* URL Hash Auth Error (e.g. Expired Confirmation Link) */}
      {urlAuthError && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs space-y-2 animate-fade-in text-left">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">{urlAuthError.description}</p>
              {urlAuthError.code === 'otp_expired' && (
                <p className="text-[11px] text-[var(--text-muted)]">
                  Verification links are time-limited. Enter your email below to receive a new link.
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 h-8 px-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-primary)] outline-none"
            />
            <button
              type="button"
              disabled={isResending || (!resendEmail && !email)}
              onClick={() => handleResendConfirmation(resendEmail || email)}
              className="px-3 h-8 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1 cursor-pointer"
            >
              {isResending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Resend Link'}
            </button>
          </div>
          {resendSuccess && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>A fresh confirmation link has been sent to your inbox.</span>
            </p>
          )}
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="flex-1 font-medium">{errorMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. INPUT FORM
         ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Beta Invite Code Field (Register Mode Only) */}
        {mode === 'register' && (
          <div className="space-y-1.5 text-left animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 font-sans">
                <span>Beta Invite Code</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                  Invite-Only
                </span>
              </label>
              <button
                type="button"
                onClick={() => setIsWaitlistModalOpen(true)}
                className="text-[11px] text-[var(--primary)] hover:underline font-semibold cursor-pointer"
              >
                Request Beta Access
              </button>
            </div>
            <div className="studio-input-soft rounded-lg flex items-center px-3.5 py-2.5">
              <Ticket className="w-4 h-4 text-purple-500 mr-2.5 shrink-0" />
              <input
                type="text"
                name="inviteCode"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. ALPHA-2026 or CREATOR-VIP"
                disabled={isLoading}
                autoComplete="off"
                className="w-full text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 bg-transparent outline-none font-mono uppercase font-bold tracking-wider"
              />
              {inviteFeedback && (
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap">
                  ✓ {inviteFeedback}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Name Field (Register Mode Only) */}
        {mode === 'register' && (
          <div className="space-y-1.5 text-left animate-fade-in">
            <label className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 block font-sans">
              {selectedRole === 'business' ? 'Brand / Company Name' : 'Full Name'}
            </label>
            <div className="studio-input-soft rounded-lg flex items-center px-3.5 py-2.5">
              <User className="w-4 h-4 text-zinc-500 mr-2.5 shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'business' ? 'Acme Studios' : 'Jane Doe'}
                disabled={isLoading}
                autoComplete="name"
                className="w-full text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 bg-transparent outline-none font-sans"
              />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 block font-sans">
            Email
          </label>
          <div className="studio-input-soft rounded-lg flex items-center px-3.5 py-2.5">
            <Mail className="w-4 h-4 text-zinc-500 mr-2.5 shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              autoComplete="email"
              className="w-full text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 bg-transparent outline-none font-sans"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 block font-sans">
            Password
          </label>
          <div className="studio-input-soft rounded-lg flex items-center px-3 py-2">
            <span className="w-6 h-6 rounded bg-[#7A828F] text-white flex items-center justify-center mr-2.5 shrink-0 shadow-sm">
              <KeyRound className="w-3.5 h-3.5" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              className="w-full text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 bg-transparent outline-none font-sans"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="text-zinc-500 hover:text-zinc-600 p-1 cursor-pointer transition-colors focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Forgot password link (Sign in mode only) */}
          {mode === 'signin' && (
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[11px] sm:text-xs text-[var(--primary)] hover:underline italic font-semibold cursor-pointer transition-colors focus:outline-none"
              >
                Forgot password
              </button>
            </div>
          )}
        </div>

        {/* Confirm Password Field (Register Mode Only) */}
        {mode === 'register' && (
          <div className="space-y-1.5 text-left animate-fade-in">
            <label className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 block font-sans">
              Confirm Password
            </label>
            <div className="studio-input-soft rounded-lg flex items-center px-3 py-2">
              <span className="w-6 h-6 rounded bg-[#7A828F] text-white flex items-center justify-center mr-2.5 shrink-0 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 bg-transparent outline-none font-sans"
              />
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            4. PRIMARY ACTION BUTTON (Sign in / Register)
           ───────────────────────────────────────────────────────────── */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`studio-btn-primary w-full py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center cursor-pointer ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 text-zinc-900">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <span>{mode === 'signin' ? 'Sign in' : 'Create Account'}</span>
            )}
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. SOCIAL LOGIN SQUIRCLES (Google, Facebook, Apple)
           ───────────────────────────────────────────────────────────── */}
        <div className="pt-3 flex items-center justify-center gap-4">
          {/* Google */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialSelect('google')}
            aria-label="Continue with Google"
            title="Continue with Google"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-4.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
              />
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialSelect('facebook')}
            aria-label="Continue with Facebook"
            title="Continue with Facebook"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#1877F2] shadow-[0_2px_8px_rgba(24,119,242,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* Apple */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialSelect('apple')}
            aria-label="Continue with Apple"
            title="Continue with Apple"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.25)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.96 2.77.99.08 2.06-.52 2.68-1.27z" />
            </svg>
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            6. QUICK DEMO EVALUATION BUTTONS (BRAND & CREATOR)
           ───────────────────────────────────────────────────────────── */}
        <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 mt-3 text-center">
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">
            One-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={async () => {
                setMode('signin');
                setEmail('demo.brand@creatoros.ai');
                setPassword('demo123456');
                setErrorMessage(null);
                setIsLoading(true);
                try {
                  const user = await AuthService.loginWithEmail({
                    email: 'demo.brand@creatoros.ai',
                    password: 'demo123456',
                  });
                  login(user);
                  triggerCelebration();
                  onAuthSuccess?.('business');
                } catch (err: any) {
                  setErrorMessage(err.message || 'Failed to enter Demo Brand.');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 border border-blue-200/60 dark:border-sky-800/60 text-blue-700 dark:text-sky-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Demo Brand</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={async () => {
                setMode('signin');
                setEmail('demo.creator@creatoros.ai');
                setPassword('demo123456');
                setErrorMessage(null);
                setIsLoading(true);
                try {
                  const user = await AuthService.loginWithEmail({
                    email: 'demo.creator@creatoros.ai',
                    password: 'demo123456',
                  });
                  login(user);
                  triggerCelebration();
                  onAuthSuccess?.('creator');
                } catch (err: any) {
                  setErrorMessage(err.message || 'Failed to enter Demo Creator.');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="px-2.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300/60 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Creator</span>
            </button>
          </div>
        </div>
      </form>

      {/* OAuth Notice Modal */}
      <OAuthNoticeModal
        provider={oauthNoticeProvider}
        isOpen={Boolean(oauthNoticeProvider)}
        onClose={() => setOauthNoticeProvider(null)}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />

      {/* Request Beta Access Waitlist Modal */}
      <RequestBetaAccessModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
        defaultRole={selectedRole}
        onUseCode={(code) => {
          setInviteCode(code);
          setIsWaitlistModalOpen(false);
        }}
      />
    </div>
  );
};
