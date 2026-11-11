import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  FileSpreadsheet,
  ArrowUpRight,
} from 'lucide-react';
import { SpatialCard } from '../ui/SpatialCard';
import { Badge } from '../ui/Badge';
import { SpatialEmptyState } from '../ui/SpatialEmptyState';
import { useAppState } from '../../context/StateContext';

interface EarningsHistoryViewProps {
  userId: string;
}

export const EarningsHistoryView: React.FC<EarningsHistoryViewProps> = ({ userId }) => {
  const { payments } = useAppState();
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');

  // Filter creator payments strictly belonging to this authenticated user
  const userPayments = (payments || []).filter((p) => p.creatorId === userId);

  const filtered = userPayments.filter((p) => {
    if (filterStatus === 'paid') return p.status === 'paid';
    if (filterStatus === 'pending') return p.status === 'pending' || p.status === 'upcoming';
    return true;
  });

  const totalEarned = userPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = userPayments
    .filter((p) => p.status === 'pending' || p.status === 'upcoming')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleExportCSV = () => {
    if (userPayments.length === 0) return;
    const headers = ['Payment ID', 'Campaign', 'Milestone', 'Amount', 'Currency', 'Status', 'Date', 'Invoice'];
    const rows = userPayments.map((p) => [
      p.id,
      p.campaignName || 'Campaign Milestone',
      p.milestone || 'Deliverable',
      p.amount,
      'USD',
      p.status,
      p.paidDate || p.dueDate || new Date().toISOString(),
      p.invoiceNumber || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CreatorOS_Earnings_Statement_${userId.slice(0, 6)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SpatialCard surface={2} className="p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block">
            Net Paid Earnings
          </span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)] mt-1">
            ${totalEarned.toLocaleString()}
          </p>
          <span className="text-xs text-[var(--text-muted)] mt-1 block">
            Milestones cleared & disbursed to your selected payout method.
          </span>
        </SpatialCard>

        <SpatialCard surface={2} className="p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold block">
            Pending Escrow Balances
          </span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)] mt-1">
            ${totalPending.toLocaleString()}
          </p>
          <span className="text-xs text-[var(--text-muted)] mt-1 block">
            Held securely in platform escrow awaiting brand milestone approval.
          </span>
        </SpatialCard>
      </div>

      {/* Itemized Table */}
      <SpatialCard surface={1} className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Itemized Milestone Earnings
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Every completed campaign milestone and its escrow settlement status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl p-0.5 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('paid')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'paid'
                    ? 'bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'pending'
                    ? 'bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                Pending
              </button>
            </div>

            {userPayments.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <SpatialEmptyState
            icon={DollarSign}
            title="No earnings history found"
            description="When brands fund milestones and approve your campaign deliverables, your itemized earnings and payouts will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] bg-slate-50 dark:bg-slate-900/60">
                  <th className="py-3 px-3">Milestone / Campaign</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Escrow Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-[var(--text-primary)]">
                      {item.campaignName || 'Campaign Milestone'} ({item.milestone})
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-[var(--text-primary)]">
                      ${item.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={item.status === 'paid' ? 'success' : 'warning'}
                        size="sm"
                        dot
                      >
                        {item.status === 'paid' ? 'Paid Out' : 'Held in Escrow'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">
                      {item.paidDate ? new Date(item.paidDate).toLocaleDateString() : item.dueDate ? `Due ${item.dueDate}` : 'Recent'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={handleExportCSV}
                        className="text-[var(--primary)] hover:underline inline-flex items-center gap-1 text-[11px]"
                      >
                        Receipt <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SpatialCard>
    </div>
  );
};
