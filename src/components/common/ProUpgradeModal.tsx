import React from 'react';
import { X, Check, Zap, Sparkles, Shield, Rocket } from 'lucide-react';
import { useAppState } from '../../context/StateContext';

export const ProUpgradeModal: React.FC = () => {
  const { isProModalOpen, setIsProModalOpen, trialDaysLeft, upgradeToPro, role } = useAppState();

  if (!isProModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-950 border border-zinc-800/80 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsProModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>7-Day Free Trial Active ({trialDaysLeft} days remaining)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono">
            Elevate Your {role === 'business' ? 'Brand' : 'Creator'} Operating System
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Unlock real-time Live Studio streaming, unlimited classified campaigns, escrow protection, and BYOK AI inference.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Starter Plan */}
          <div className="rounded-xl p-5 border border-zinc-800/80 bg-zinc-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Starter</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Current Base</span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-2xl font-bold text-white">$0</span>
                <span className="text-xs text-zinc-500">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-400 mt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-500" /> Up to 3 active campaigns
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-500" /> Standard creator passport & media kit
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-500" /> Default CreatorOS AI assistant
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-500" /> Downgrade safety (Zero data loss)
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/60">
              <span className="block text-center text-xs text-zinc-500 font-medium">Included forever</span>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-xl p-5 border-2 border-indigo-500/60 bg-gradient-to-b from-indigo-950/20 to-zinc-900/60 flex flex-col justify-between shadow-lg shadow-indigo-950/40">
            <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>CreatorOS Pro</span>
                </h3>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-extrabold text-white">$49</span>
                <span className="text-xs text-zinc-400">/ month billed annually</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300 mt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Unlimited campaigns & applications
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Decart Live Creator Studio (Sub-35ms)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> BYOK AI (Claude 3.5, GPT-4o, Gemini 1.5)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Automated 18+ Child Safety & NSFW Scan
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Team RBAC & Audit Log exporting
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-500/20">
              <button
                onClick={upgradeToPro}
                className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Activate Pro Membership</span>
              </button>
            </div>
          </div>
        </div>

        {/* Safe Downgrade Guarantee Notice */}
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Graceful Downgrade Protection:</strong> If you ever choose to cancel, your existing data, past contracts, and creator passport assets remain 100% accessible. We never delete historical work.
          </span>
        </div>
      </div>
    </div>
  );
};
