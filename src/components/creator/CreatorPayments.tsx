import React from 'react';
import {
  Clock,
  Download,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Badge } from '../ui/Badge';
import { SpatialCard } from '../ui/SpatialCard';

export const CreatorPayments: React.FC = () => {
  const { payments, creators } = useAppState();
  const currentCreator = creators[0];

  const creatorPayments = payments.filter((p) => p.creatorId === currentCreator.id);

  const totalPaid = creatorPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = creatorPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalUpcoming = creatorPayments
    .filter((p) => p.status === 'upcoming')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalEarnings = totalPaid + totalPending + totalUpcoming;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
              Earnings
            </h1>
            <Badge variant="success" size="sm" dot>
              Escrow Protected
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Instant payouts to HDFC Bank (•••• 4921)
          </p>
        </div>
      </div>

      {/* Dominant Spatial Financial Summary (Section 15) */}
      <SpatialCard
        surface={3}
        glowColor="emerald"
        className="p-6 sm:p-7 relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(124,92,255,0.15) 60%, transparent 80%)',
          }}
        />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block">
              Total Earned
            </span>
            <p className="text-3xl sm:text-4xl font-bold font-mono text-[var(--text-primary)] tracking-tight mt-1" spellCheck={false}>
              ₹{totalEarnings.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full md:w-auto md:min-w-[380px]">
            <div className="p-3.5 rounded-xl surface-2">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-mono font-medium block">Available</span>
              <p className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5" spellCheck={false}>
                ₹{totalPaid.toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 rounded-xl surface-2">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-mono font-medium block">Pending</span>
              <p className="text-base sm:text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5" spellCheck={false}>
                ₹{totalPending.toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 rounded-xl surface-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono font-medium block">Paid</span>
              <p className="text-base sm:text-lg font-bold font-mono text-[var(--text-primary)] mt-0.5" spellCheck={false}>
                ₹{totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </SpatialCard>

      {/* Escrow Milestone Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl surface-2 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--text-primary)] block">1. Escrow</span>
            <span className="text-[10px] text-[var(--text-secondary)]">Funds locked</span>
          </div>
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
        </div>

        <div className="p-3.5 rounded-xl surface-2 border-emerald-500/25 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">2. Advance</span>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">50% released</span>
          </div>
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
        </div>

        <div className="p-3.5 rounded-xl surface-2 border-[#007E93]/25 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">3. Review</span>
            <span className="text-[10px] text-[var(--text-secondary)]">Brand sign-off</span>
          </div>
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
        </div>

        <div className="p-3.5 rounded-xl surface-1 flex items-center justify-between opacity-75">
          <div>
            <span className="text-xs font-semibold text-[var(--text-muted)] block">4. Payout</span>
            <span className="text-[10px] text-[var(--text-muted)]">Instant ACH</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0" />
        </div>
      </div>

      {/* Compact Spatial Remittance Rows (Replacing traditional HTML table) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
            Payout History
          </h3>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">Instant ACH / UPI</span>
        </div>

        <div className="space-y-2.5">
          {creatorPayments.map((p) => (
            <SpatialCard
              key={p.id}
              surface={2}
              interactive
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    p.status === 'paid'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  ₹
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                      {p.campaignName}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md surface-3 text-[var(--text-secondary)] text-[10px] font-mono border border-[var(--border)]">
                      {p.milestone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">
                    <span>{p.invoiceNumber}</span>
                    <span>·</span>
                    <span>{p.paidDate ? p.paidDate : `Due ${p.dueDate}`}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                <span className="text-sm sm:text-base font-mono font-bold text-[var(--text-primary)]">
                  ₹{p.amount.toLocaleString()}
                </span>

                <Badge
                  variant={p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'neutral'}
                  size="sm"
                  dot
                >
                  {p.status === 'paid' ? 'Paid' : p.status === 'pending' ? 'Pending' : 'Upcoming'}
                </Badge>

                <button
                  className="depth-btn-secondary px-2.5 py-1.5 rounded-lg text-[var(--text-primary)] text-xs font-mono inline-flex items-center gap-1 cursor-pointer"
                  title="Download Receipt"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>PDF</span>
                </button>
              </div>
            </SpatialCard>
          ))}
        </div>
      </div>
    </div>
  );
};

