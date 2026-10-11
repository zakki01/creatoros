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
    <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Explore CreatorOS</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/50">
          Instant preview
        </span>
      </div>

      <p className="text-[11px] text-zinc-400">
        Instantly explore with active campaigns, deliverables, and Live Studio.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {/* Creator Demo */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectDemo('creator')}
          className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 hover:bg-sky-950/20 border border-zinc-800 hover:border-sky-500/40 text-left transition-all group cursor-pointer"
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
          className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 hover:bg-indigo-950/20 border border-zinc-800 hover:border-indigo-500/40 text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
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
