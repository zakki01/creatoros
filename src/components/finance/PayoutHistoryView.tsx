import React, { useState, useEffect } from 'react';
import {
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Ban,
  Loader2,
  DollarSign,
} from 'lucide-react';
import { SpatialCard } from '../ui/SpatialCard';
import { Badge } from '../ui/Badge';
import { SpatialEmptyState } from '../ui/SpatialEmptyState';
import {
  FinanceService,
  PayoutRequestItem,
} from '../../services/financeService';
import { RequestPayoutModal } from './RequestPayoutModal';

interface PayoutHistoryViewProps {
  userId: string;
}

export const PayoutHistoryView: React.FC<PayoutHistoryViewProps> = ({ userId }) => {
  const [requests, setRequests] = useState<PayoutRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [userId]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await FinanceService.getPayoutRequests(userId);
      setRequests(data);
    } catch {
      setError('Unable to load payout history.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (requestId: string) => {
    if (!confirm('Are you sure you want to cancel this payout request? The funds will remain in your available escrow balance.')) {
      return;
    }
    setCancellingId(requestId);
    try {
      const res = await FinanceService.cancelPayoutRequest(userId, requestId);
      if (res.success) {
        await loadRequests();
      } else {
        setError(res.error || 'Failed to cancel payout request.');
      }
    } catch {
      setError('An error occurred while cancelling.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: PayoutRequestItem['status']) => {
    switch (status) {
      case 'PAYOUT_COMPLETED':
        return <Badge variant="success" dot size="sm">Completed</Badge>;
      case 'PAYOUT_PROCESSING':
      case 'PAYOUT_PENDING':
        return <Badge variant="brand" dot size="sm">Processing</Badge>;
      case 'PAYOUT_REQUESTED':
        return <Badge variant="warning" dot size="sm">Requested</Badge>;
      case 'PAYOUT_FAILED':
        return <Badge variant="danger" dot size="sm">Failed</Badge>;
      case 'PAYOUT_CANCELLED':
        return <Badge variant="neutral" dot size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="neutral" dot size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <SpatialCard surface={1} className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Payout Disbursements
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Audited transfer records to your verified PayPal, Stripe, or UPI account.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadRequests}
              disabled={isLoading}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh payouts"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 dark:font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-white dark:text-slate-950" />
              <span>Request Payout</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-[var(--text-secondary)]">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-[var(--primary)]" />
            <span>Loading payout history...</span>
          </div>
        ) : requests.length === 0 ? (
          <SpatialEmptyState
            icon={ArrowDownLeft}
            title="No payout disbursements yet"
            description="When you request a payout from your cleared campaign deliverables, your transaction history and bank settlement references (UTR) will appear here."
            actionLabel="Request Payout"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] bg-slate-50 dark:bg-slate-900/60">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Method & Recipient</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Settlement / UTR</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {requests.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                    <td className="py-3 px-3 text-[var(--text-secondary)] font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold uppercase text-[10px] px-1.5 py-0.5 rounded surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)]">
                          {item.methodType}
                        </span>
                        <span className="font-mono text-[var(--text-primary)]">
                          {item.recipientIdentifier}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[var(--text-primary)]">
                      ${item.amount.toLocaleString()} {item.currency}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-3">
                      {item.manualUtrReference ? (
                        <div className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                          UTR: {item.manualUtrReference}
                        </div>
                      ) : item.providerPayoutId ? (
                        <div className="font-mono text-[11px] text-[var(--text-secondary)]">
                          Ref: {item.providerPayoutId.slice(0, 16)}...
                        </div>
                      ) : item.status === 'PAYOUT_FAILED' ? (
                        <div className="text-[11px] text-red-500">
                          {item.failureReason || 'Declined'}
                        </div>
                      ) : (
                        <span className="text-[var(--text-muted)] italic text-[11px]">Pending bank batch</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {item.status === 'PAYOUT_REQUESTED' && (
                        <button
                          onClick={() => handleCancel(item.id)}
                          disabled={cancellingId === item.id}
                          className="text-xs text-red-500 hover:text-red-600 hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          {cancellingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Ban className="w-3 h-3" />
                          )}
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SpatialCard>

      {/* Payout Modal */}
      <RequestPayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        availableBalance={0}
        onSuccess={() => {
          loadRequests();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
