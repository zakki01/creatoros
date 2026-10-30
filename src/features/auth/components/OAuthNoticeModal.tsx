import React from 'react';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../../../components/common/BrandLogo';

interface OAuthNoticeModalProps {
  provider: 'google' | 'apple' | 'facebook' | null;
  isOpen: boolean;
  onClose: () => void;
  onContinueAsDemo: () => void;
}

export const OAuthNoticeModal: React.FC<OAuthNoticeModalProps> = ({
  provider,
  isOpen,
  onClose,
  onContinueAsDemo,
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
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
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
            Continue with {providerName}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Secure single sign-on is verifying authentication with {providerName}. You can proceed with instant platform access or enter your registered account credentials.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onContinueAsDemo();
            }}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-xs font-semibold transition-all cursor-pointer active:scale-98 shadow-xs"
          >
            <span>Proceed to Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
