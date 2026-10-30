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
    <div className="surface-soft-recessed p-4 rounded-2xl space-y-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Explore Controlled Demos</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
          Demo Sandbox
        </span>
      </div>

      <p className="text-[11px] text-[var(--text-muted)]">
        Explore controlled demo workflows with isolated contracts, deliverables, and briefs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {/* Creator Demo */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectDemo('creator')}
          className="btn-soft-raised flex items-center justify-between p-3 rounded-xl text-left transition-all group cursor-pointer bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo size="xs" iconOnly />
            <div className="truncate">
              <span className="text-xs font-semibold text-[var(--text-primary)] block truncate group-hover:text-[var(--accent)]">
                Demo Creator
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block truncate font-mono">
                demo.creator@creatoros.ai
              </span>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Brand Demo */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectDemo('business')}
          className="btn-soft-raised flex items-center justify-between p-3 rounded-xl text-left transition-all group cursor-pointer bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-[var(--text-primary)] block truncate group-hover:text-[var(--accent)]">
                Demo Brand
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block truncate font-mono">
                demo.brand@creatoros.ai
              </span>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <p className="text-[10px] text-[var(--text-muted)] text-center font-mono">
        Zero prefilled data for new users • 2 controlled demo accounts
      </p>
    </div>
  );
};
