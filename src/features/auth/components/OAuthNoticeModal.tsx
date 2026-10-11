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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-zinc-100 font-display">
            Continue with {providerName}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
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
            className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer active:scale-98"
          >
            <BrandLogo size="xs" iconOnly />
            <span>Continue to CreatorOS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Use Email & Password
          </button>
        </div>
      </div>
    </div>
  );
};
