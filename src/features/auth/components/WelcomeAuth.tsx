import React, { useState, useEffect } from 'react';
import {
  Mail,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { AuthService } from '../services/authService';
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
  const { setRole, triggerCelebration } = useAppState();

  const [mode, setMode] = useState<AuthPanelMode>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('creator');

  // Form Fields
  const [email, setEmail] = useState('creator@demo.creatoros.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [oauthNoticeProvider, setOauthNoticeProvider] = useState<'google' | 'apple' | 'facebook' | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Synchronize when initialMode changes externally
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signin') {
        const user = await AuthService.loginWithEmail({ email, password });
        setRole(user.role);
        triggerCelebration();
        onAuthSuccess?.(user.role);
      } else {
        // Derive name if not explicitly prompted in the minimal PDF layout
        const derivedName = email.split('@')[0] || 'Creator';
        const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

        const user = await AuthService.signUpWithEmail({
          name: formattedName,
          email,
          password,
          role: selectedRole,
        });
        setRole(user.role);
        triggerCelebration();
        onAuthSuccess?.(user.role);
      }
    } catch (err: any) {
      setErrorMessage(err.message || `${mode === 'signin' ? 'Sign in' : 'Registration'} failed.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSelect = (provider: 'google' | 'apple' | 'facebook') => {
    const configured =
      provider === 'google'
        ? Boolean((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID)
        : provider === 'apple'
        ? Boolean((import.meta as any).env?.VITE_APPLE_CLIENT_ID)
        : Boolean((import.meta as any).env?.VITE_FACEBOOK_APP_ID);

    if (!configured) {
      setOauthNoticeProvider(provider);
      return;
    }

    AuthService.loginWithSocial(provider as any).catch((err) => {
      setErrorMessage(err.message);
    });
  };

  const handleDemoFallback = async (demoRole: UserRole) => {
    setIsLoading(true);
    try {
      const user = await AuthService.loginAsDemo(demoRole);
      setRole(user.role);
      triggerCelebration();
      onAuthSuccess?.(user.role);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`studio-card-soft rounded-[28px] p-6 sm:p-8 lg:p-9 w-full max-w-[430px] mx-auto select-none transition-all ${className}`}
    >
      {/* ======================================================================= */}
      {/* 1. TOP SEGMENTED SWITCHER: [ Sign in ] | [ Register <UserPlus /> ]      */}
      {/* ======================================================================= */}
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
              : 'text-zinc-700 hover:text-zinc-950'
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
              : 'text-zinc-700 hover:text-zinc-950'
          }`}
        >
          <span>Register</span>
          <UserPlus className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* ======================================================================= */}
      {/* 2. ROLE TOGGLE: CREATOR | BRAND (ONLY SHOWN IN REGISTER MODE)           */}
      {/* ======================================================================= */}
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

      {/* Error Notice */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="flex-1 font-medium">{errorMessage}</span>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. INPUT FORM                                                           */}
      {/* ======================================================================= */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs sm:text-sm font-bold text-zinc-900 block font-sans">
            Email
          </label>
          <div className="studio-input-soft rounded-lg flex items-center px-3.5 py-2.5">
            <Mail className="w-4 h-4 text-zinc-500 mr-2.5 shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@demo.creatoros.ai"
              disabled={isLoading}
              autoComplete="email"
              className="w-full text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-500 bg-transparent outline-none font-sans"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs sm:text-sm font-bold text-zinc-900 block font-sans">
            Password
          </label>
          <div className="studio-input-soft rounded-lg flex items-center px-3 py-2">
            {/* Key icon badge matching PDF reference */}
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
              className="w-full text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-500 bg-transparent outline-none font-sans"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="text-zinc-500 hover:text-zinc-600 p-1 cursor-pointer transition-colors focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Forgot password link */}
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-[11px] sm:text-xs text-[#1E7BB8] hover:text-[#0F5A8F] italic font-semibold cursor-pointer transition-colors focus:outline-none"
            >
              Forgot password
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. PRIMARY ACTION BUTTON (Sign in / Register)                         */}
        {/* ===================================================================== */}
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
              <span>{mode === 'signin' ? 'Sign in' : 'Register'}</span>
            )}
          </button>
        </div>

        {/* ===================================================================== */}
        {/* 5. SOCIAL LOGIN SQUIRCLES (Google, Facebook, Apple)                   */}
        {/* ===================================================================== */}
        <div className="pt-3 flex items-center justify-center gap-4">
          {/* Google Squircle */}
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

          {/* Facebook Squircle */}
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

          {/* Apple Squircle */}
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
      </form>

      {/* OAuth Notice Modal */}
      <OAuthNoticeModal
        provider={oauthNoticeProvider}
        isOpen={Boolean(oauthNoticeProvider)}
        onClose={() => setOauthNoticeProvider(null)}
        onContinueAsDemo={() => {
          const provider = oauthNoticeProvider;
          setOauthNoticeProvider(null);
          if (provider) {
            handleDemoFallback(selectedRole);
          }
        }}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};
