import React from 'react';
import { X, Check, Zap, Sparkles, Shield, Rocket } from 'lucide-react';
import { useAppState } from '../../context/StateContext';

export const ProUpgradeModal: React.FC = () => {
  const { isProModalOpen, setIsProModalOpen, trialDaysLeft, upgradeToPro, role } = useAppState();

  if (!isProModalOpen) return null;

  const isTrialActive = trialDaysLeft > 0 && trialDaysLeft < 30;
  const isProActive = trialDaysLeft >= 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[var(--accent)]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsProModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-8">
          {isTrialActive && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>7-Day Free Trial Active ({trialDaysLeft} days remaining)</span>
            </div>
          )}
          {isProActive && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Pro Membership Active</span>
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-mono">
            Elevate Your {role === 'business' ? 'Brand' : 'Creator'} Operating System
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-2">
            Unlock real-time Live Studio streaming, unlimited classified campaigns, escrow protection, and BYOK AI inference.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Starter Plan */}
          <div className="rounded-xl p-5 border border-[var(--border)] bg-[var(--surface-muted)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Starter
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]">
                  {isProActive ? 'Standard Base' : 'Current Base'}
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-2xl font-bold text-[var(--text-primary)]">$0</span>
                <span className="text-xs text-[var(--text-muted)]">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)] mt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Up to 3 active campaigns
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Standard creator passport & media kit
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Default CreatorOS AI assistant
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Downgrade safety (Zero data loss)
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <span className="block text-center text-xs text-[var(--text-muted)] font-medium">
                Included forever
              </span>
            </div>
          </div>

          {/* Pro Plan (Semantic Theme-Aligned in Light and Dark mode) */}
          <div className="relative rounded-xl p-5 border-2 border-[var(--primary)] bg-[var(--surface-elevated)] flex flex-col justify-between shadow-xl">
            <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                  <span>CreatorOS Pro</span>
                </h3>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">$49</span>
                <span className="text-xs text-[var(--text-muted)]">/ month billed annually</span>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)] mt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Unlimited campaigns & applications
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Decart Live Creator Studio (Sub-35ms)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> BYOK AI (Claude 3.5, GPT-4o, Gemini 1.5)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Automated 18+ Child Safety & NSFW Scan
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Team RBAC & Audit Log exporting
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <button
                onClick={upgradeToPro}
                data-testid="activate-pro-btn"
                className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>{isProActive ? 'Renew Pro Membership' : 'Activate Pro Membership'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Safe Downgrade Guarantee Notice */}
        <div className="p-3 rounded-lg bg-[var(--surface-muted)] shadow-sm border border-[var(--border)] text-[11px] text-[var(--text-secondary)] flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>Graceful Downgrade Protection:</strong> If you ever choose to cancel, your existing data, past contracts, and creator passport assets remain 100% accessible. We never delete historical work.
          </span>
        </div>
      </div>
    </div>
  );
};
