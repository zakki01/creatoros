import React from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  DollarSign,
  Download,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PaymentStatus } from '../../types';

export const PaymentsWorkspace: React.FC = () => {
  const { payments, releasePayment } = useAppState();

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" size="sm" dot>Paid</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm" dot>Escrow Held (Pending)</Badge>;
      case 'upcoming':
        return <Badge variant="neutral" size="sm">Upcoming Milestone</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
              Payments & Milestone Escrow
            </h1>
            <Badge variant="brand" size="sm">
              Secured Payouts
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Automated milestone escrow releases: Contract Signature → Advance → Content Approval → Final Drop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Card className="px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 text-center">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase">Total Settled</span>
            <p className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ₹{(totalPaid / 1000).toLocaleString()}k
            </p>
          </Card>
          <Card className="px-4 py-2 border border-amber-500/30 bg-amber-500/10 text-center">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase">In Escrow</span>
            <p className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
              ₹{(totalPending / 1000).toLocaleString()}k
            </p>
          </Card>
        </div>
      </div>

      {/* Mobile Payments Card List (Section 14: Mobile Table Alternative) */}
      <div className="space-y-3 md:hidden">
        {payments.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={p.creatorAvatar}
                  alt={p.creatorName}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-[var(--border)] shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                    {p.creatorName}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">{p.invoiceNumber}</p>
                </div>
              </div>
              <div>{getStatusBadge(p.status)}</div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border)]/50">
              <span className="text-[var(--text-secondary)]">{p.campaignName}</span>
              <span className="px-2 py-0.5 rounded-lg bg-[var(--surface-muted)] text-[var(--text-secondary)] text-[10px] font-mono border border-[var(--border)]">
                {p.milestone}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">Amount</span>
                <span className="text-base font-bold font-mono text-[var(--text-primary)]">
                  ₹{p.amount.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">Timeline</span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {p.paidDate ? `Paid ${p.paidDate}` : `Due ${p.dueDate}`}
                </span>
              </div>
            </div>

            {p.status === 'pending' && (
              <div className="pt-2 border-t border-[var(--border)]/50">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => releasePayment(p.id)}
                  className="w-full min-h-[44px] justify-center text-xs font-semibold"
                >
                  Release Payout
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Payments Table */}
      <Card className="overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-muted)] text-[var(--text-secondary)] border-b border-[var(--border)] uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Milestone</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due / Paid Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--surface-muted)] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[var(--text-muted)] font-medium">
                    {p.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={p.creatorAvatar}
                        alt={p.creatorName}
                        className="w-6 h-6 rounded-lg object-cover ring-1 ring-[var(--border)]"
                      />
                      <span className="font-semibold text-[var(--text-primary)]">{p.creatorName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)]">{p.campaignName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-[var(--surface-muted)] text-[var(--text-secondary)] text-[11px] font-medium border border-[var(--border)]">
                      {p.milestone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-primary)]">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(p.status)}</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">
                    {p.paidDate ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Paid on {p.paidDate}</span>
                    ) : (
                      <span>Due {p.dueDate}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === 'pending' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => releasePayment(p.id)}
                        className="text-xs min-h-[36px]"
                      >
                        Release Payout
                      </Button>
                    ) : p.status === 'paid' ? (
                      <span className="text-xs text-[var(--text-muted)] font-mono flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">Awaiting Content</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
