import React, { useState } from 'react';
import { AuthTab, LoginCredentials, SignUpCredentials } from '../types';
import { AuthService } from '../services/authService';
import { SocialLoginButtons } from './SocialLoginButtons';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { DemoAccessCard } from './DemoAccessCard';
import { OAuthNoticeModal } from './OAuthNoticeModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { useAppState } from '../../../context/StateContext';
import { UserRole } from '../../../types';

export interface ResponsiveAuthPanelProps {
  initialTab?: AuthTab;
  onAuthSuccess?: (role: UserRole) => void;
  className?: string;
}

export const ResponsiveAuthPanel: React.FC<ResponsiveAuthPanelProps> = ({
  initialTab = 'login',
  onAuthSuccess,
  className = '',
}) => {
  const { setRole, triggerCelebration } = useAppState();

  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [oauthNoticeProvider, setOauthNoticeProvider] = useState<'google' | 'apple' | 'facebook' | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleLoginSubmit = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await AuthService.loginWithEmail(credentials);
      setRole(user.role);
      triggerCelebration();
      onAuthSuccess?.(user.role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (credentials: SignUpCredentials) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await AuthService.signUpWithEmail(credentials);
      setRole(user.role);
      triggerCelebration();
      onAuthSuccess?.(user.role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = async (selectedRole: UserRole) => {
    setIsLoading(true);
    try {
      const user = await AuthService.loginAsDemo(selectedRole);
      setRole(user.role);
      triggerCelebration();
      onAuthSuccess?.(user.role);
    } catch (err: any) {
      setErrorMessage(err.message);
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

  return (
    <div
      className={`glass-primary rounded-3xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between space-y-6 text-left relative overflow-hidden shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85)] ${className}`}
    >
      {/* Specular Top Edge Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="space-y-6">
        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-medium font-display text-white tracking-tight">
              {activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </h3>
            <p className="text-xs text-zinc-400 font-sans font-light">
              {activeTab === 'login'
                ? 'Access your dedicated Creator or Brand workspace.'
                : 'Select your immutable account type to get started.'}
            </p>
          </div>

          {/* Minimal Tab Switcher Pill */}
          <div className="flex p-0.5 rounded-xl bg-black/40 border border-white/[0.08] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)] shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'btn-soft-primary font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white font-medium'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'btn-soft-primary font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white font-medium'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        {activeTab === 'login' ? (
          <LoginForm
            onSubmit={handleLoginSubmit}
            onForgotPassword={() => setIsForgotModalOpen(true)}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        ) : (
          <SignUpForm
            onSubmit={handleSignUpSubmit}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}

        {/* Social Authentication */}
        <div className="space-y-4">
          <SocialLoginButtons onSelectProvider={handleSocialSelect} />

          {/* Quick 1-Click Demo Access Card */}
          <DemoAccessCard
            onSelectDemo={handleDemoSelect}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Footer Assurance */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-sans text-zinc-500">
        <span>Protected with Milestone Escrow</span>
        <span>CreatorOS Engine v2.4</span>
      </div>

      {/* OAuth Notice Modal */}
      <OAuthNoticeModal
        provider={oauthNoticeProvider}
        isOpen={Boolean(oauthNoticeProvider)}
        onClose={() => setOauthNoticeProvider(null)}
        onContinueAsDemo={() => {
          setOauthNoticeProvider(null);
          handleDemoSelect('creator');
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
