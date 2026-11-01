import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface OAuthNoticeModalProps {
  provider: 'google' | 'apple' | 'facebook' | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OAuthNoticeModal: React.FC<OAuthNoticeModalProps> = ({
  provider,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !provider) return null;

  const providerName =
    provider === 'google'
      ? 'Google'
      : provider === 'apple'
      ? 'Apple'
      : 'Facebook';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in text-[var(--text-primary)]">
      <div className="relative w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
            {providerName} Sign-In Unavailable
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {providerName} OAuth sign-in is currently unavailable on this deployment. Please sign in or create an account using your verified email address and password.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            Back to Email Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
