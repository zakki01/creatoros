import React from 'react';
import { Building2, Sparkles, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../../../components/common/BrandLogo';
import { UserRole } from '../../../types';

interface DemoAccessCardProps {
  onSelectDemo: (role: UserRole) => void;
  disabled?: boolean;
}

export const DemoAccessCard: React.FC<DemoAccessCardProps> = ({
  onSelectDemo,
  disabled = false,
}) => {
  return (
    <div className="surface-soft-recessed p-4 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Explore CreatorOS</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800/80 text-zinc-300 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          Instant preview
        </span>
      </div>

      <p className="text-[11px] text-zinc-400">
        Instantly explore with active campaigns, contracts, and deliverables.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {/* Creator Demo */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectDemo('creator')}
          className="btn-soft-raised flex items-center justify-between p-3 rounded-xl text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo size="xs" iconOnly />
            <div className="truncate">
              <span className="text-xs font-semibold text-zinc-200 block truncate group-hover:text-sky-300">
                Creator Experience
              </span>
              <span className="text-[10px] text-zinc-500 block truncate">
                Rohan Sharma (Fashion)
              </span>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Brand Demo */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectDemo('business')}
          className="btn-soft-raised flex items-center justify-between p-3 rounded-xl text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-zinc-200 block truncate group-hover:text-indigo-300">
                Brand Workspace
              </span>
              <span className="text-[10px] text-zinc-500 block truncate">
                Aura Streetwear Co.
              </span>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <p className="text-[10px] text-zinc-500 text-center font-mono">
        Active interactive sandbox.
      </p>
    </div>
  );
};
