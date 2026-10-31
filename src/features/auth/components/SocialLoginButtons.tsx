import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface SocialLoginButtonsProps {
  onSelectProvider: (provider: 'google' | 'facebook' | 'apple' | 'auth0') => void;
  disabled?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onSelectProvider,
  disabled = false,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Primary Auth0 Enterprise / Single Sign-On */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectProvider('auth0')}
        className={`w-full h-10 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary-hover)] border border-[var(--primary)]/30 transition-all focus:outline-none focus:ring-1 focus:ring-sky-400 active:scale-98 cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
        <span>Continue with Auth0 Enterprise SSO</span>
      </button>

      <div className="flex items-center justify-center gap-3">
        {/* Google Icon Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectProvider('google')}
          aria-label="Continue with Google"
          title="Continue with Google"
          className={`btn-soft-raised flex-1 min-h-[44px] h-11 min-w-[44px] rounded-xl flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-sky-400/40 active:scale-95 group ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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

        {/* Facebook Icon Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectProvider('facebook')}
          aria-label="Continue with Facebook"
          title="Continue with Facebook"
          className={`btn-soft-raised flex-1 min-h-[44px] h-11 min-w-[44px] rounded-xl flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-sky-400/40 active:scale-95 group ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <svg className="w-4 h-4 fill-[#1877F2] shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* Apple Icon Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectProvider('apple')}
          aria-label="Continue with Apple"
          title="Continue with Apple"
          className={`btn-soft-raised flex-1 min-h-[44px] h-11 min-w-[44px] rounded-xl flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-sky-400/40 active:scale-95 group ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <svg className="w-4 h-4 fill-current text-white shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.96 2.77.99.08 2.06-.52 2.68-1.27z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
