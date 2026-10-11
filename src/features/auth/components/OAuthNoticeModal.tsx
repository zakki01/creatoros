import React from 'react';
import { X, Key, Info, ArrowRight } from 'lucide-react';
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
      ? 'Google OAuth'
      : provider === 'apple'
      ? 'Apple Sign In'
      : 'Facebook Login';

  const envVar =
    provider === 'google'
      ? 'VITE_GOOGLE_CLIENT_ID'
      : provider === 'apple'
      ? 'VITE_APPLE_CLIENT_ID'
      : 'VITE_FACEBOOK_APP_ID';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-zinc-100 font-display">
            Self-Hosted {providerName} Notice
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            As a commercial downloadable script for CodeCudos, social authentication requires adding your client credentials in your deployment environment:
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-indigo-300">
            {envVar}=your_client_id_here
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Evaluating for CodeCudos?</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            You can test the complete product, campaigns, content submissions, and Live Studio with zero configuration using Demo Creator mode.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onContinueAsDemo();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/20 transition-all cursor-pointer"
          >
            <BrandLogo size="xs" iconOnly />
            <span>Continue as Demo Creator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Close & Use Email Login
          </button>
        </div>
      </div>
    </div>
  );
};
