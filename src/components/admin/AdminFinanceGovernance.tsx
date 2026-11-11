import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  Ban,
  Clock,
  Layers,
  FileText,
  CreditCard,
  Building,
  Info,
  Loader2,
} from 'lucide-react';
import { SpatialCard } from '../ui/SpatialCard';
import { Badge } from '../ui/Badge';
import { SpatialEmptyState } from '../ui/SpatialEmptyState';
import {
  FinanceService,
  PayoutRequestItem,
} from '../../services/financeService';

export const AdminFinanceGovernance: React.FC = () => {
  const [payouts, setPayouts] = useState<PayoutRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<'all' | 'upi' | 'paypal' | 'stripe'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Approval Modal State
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequestItem | null>(null);
  const [utrReference, setUtrReference] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  // Rejection Modal State
  const [rejectingPayout, setRejectingPayout] = useState<PayoutRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    loadAllPayouts();
  }, []);

  const loadAllPayouts = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const data = await FinanceService.getAllPayoutsAdmin();
      setPayouts(data);
    } catch {
      setActionError('Failed to fetch platform payout requests.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveWithUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;
    if (!utrReference.trim() || utrReference.trim().length < 6) {
      setActionError('Valid Bank UTR / Transaction Reference (min 6 characters) is required.');
      return;
    }

    setIsApproving(true);
    try {
      const res = await FinanceService.adminApproveUpiPayout(
        selectedPayout.id,
        utrReference.trim(),
        'super_admin'
      );
      if (res.success) {
        setActionSuccess(`Payout ${selectedPayout.id.slice(0, 8)} approved and settled with UTR: ${utrReference.toUpperCase()}`);
        setSelectedPayout(null);
        setUtrReference('');
        await loadAllPayouts();
      } else {
        setActionError(res.error || 'Approval failed.');
      }
    } catch {
      setActionError('An error occurred during approval.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPayout) return;
    if (!rejectReason.trim()) {
      setActionError('A valid rejection reason must be supplied to the creator.');
      return;
    }

    setIsRejecting(true);
    try {
      const res = await FinanceService.adminRejectPayout(
        rejectingPayout.id,
        rejectReason.trim(),
        'super_admin'
      );
      if (res.success) {
        setActionSuccess(`Payout ${rejectingPayout.id.slice(0, 8)} rejected. Funds returned to creator balance.`);
        setRejectingPayout(null);
        setRejectReason('');
        await loadAllPayouts();
      } else {
        setActionError(res.error || 'Rejection failed.');
      }
    } catch {
      setActionError('An error occurred during rejection.');
    } finally {
      setIsRejecting(false);
    }
  };

  // Filter calculations
  const filtered = payouts.filter((p) => {
    if (filterMethod !== 'all' && p.methodType !== filterMethod) return false;
    if (filterStatus === 'pending') {
      if (p.status !== 'PAYOUT_REQUESTED' && p.status !== 'PAYOUT_PENDING' && p.status !== 'PAYOUT_PROCESSING') return false;
    } else if (filterStatus === 'completed') {
      if (p.status !== 'PAYOUT_COMPLETED') return false;
    } else if (filterStatus === 'failed') {
      if (p.status !== 'PAYOUT_FAILED' && p.status !== 'PAYOUT_CANCELLED') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.creatorId.toLowerCase().includes(q) ||
        p.recipientIdentifier.toLowerCase().includes(q) ||
        (p.manualUtrReference && p.manualUtrReference.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingCount = payouts.filter(
    (p) => p.status === 'PAYOUT_REQUESTED' || p.status === 'PAYOUT_PENDING' || p.status === 'PAYOUT_PROCESSING'
  ).length;

  const pendingUpiCount = payouts.filter(
    (p) =>
      p.methodType === 'upi' &&
      (p.status === 'PAYOUT_REQUESTED' || p.status === 'PAYOUT_PENDING')
  ).length;

  const totalVolume = payouts
    .filter((p) => p.status === 'PAYOUT_COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
              Financial Governance & Payouts
            </h1>
            <Badge variant="danger" size="sm" dot>
              Authority Mode
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Audit, execute, and verify outbound creator settlements across PayPal, Stripe Connect, and UPI Nodal accounts.
          </p>
        </div>

        <button
          onClick={loadAllPayouts}
          disabled={isLoading}
          className="px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SpatialCard surface={2} className="p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
            Pending Action
          </span>
          <p className="text-2xl font-bold font-mono text-amber-500 mt-1">
            {pendingCount}
          </p>
          <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block">
            {pendingUpiCount} UPI manual settlements
          </span>
        </SpatialCard>

        <SpatialCard surface={2} className="p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
            Disbursed Volume
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">
            ${totalVolume.toLocaleString()}
          </p>
          <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block">
            Settled to verified creators
          </span>
        </SpatialCard>

        <SpatialCard surface={2} className="p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
            Platform Fee Take
          </span>
          <p className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            10.0%
          </p>
          <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block">
            0% escrow holding fee enforced
          </span>
        </SpatialCard>

        <SpatialCard surface={2} className="p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
            Hyperswitch Status
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-bold text-indigo-500 font-mono">
              PREPARED
            </span>
            <Badge variant="brand" size="sm">Sandbox Ready</Badge>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block">
            Feature-flagged (Off by default)
          </span>
        </SpatialCard>
      </div>

      {/* Main Governance Table Card */}
      <SpatialCard surface={1} className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Creator, or VPA..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Method Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl text-xs surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All Methods</option>
              <option value="upi">UPI VPAs</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl text-xs surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed / Cancelled</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-[var(--text-secondary)]">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-[var(--brand-primary)]" />
            <span>Loading payout records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <SpatialEmptyState
            icon={DollarSign}
            title="No payout requests found"
            description="When creators request payouts from their contracts or escrow milestones, they will appear here for audit, verification, and nodal settlement."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                  <th className="py-3 px-3">Request ID</th>
                  <th className="py-3 px-3">Creator / User</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Recipient Identifier</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Settlement Reference</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filtered.map((item) => {
                  const isPending =
                    item.status === 'PAYOUT_REQUESTED' ||
                    item.status === 'PAYOUT_PENDING';

                  return (
                    <tr key={item.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                      <td className="py-3 px-3 font-mono text-[var(--text-secondary)]">
                        {item.id.slice(0, 10)}...
                      </td>
                      <td className="py-3 px-3 font-mono text-[var(--text-primary)]">
                        {item.creatorId.slice(0, 12)}...
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold uppercase text-[10px] px-1.5 py-0.5 rounded surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)]">
                          {item.methodType}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[var(--text-primary)]">
                        {item.recipientIdentifier}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[var(--text-primary)]">
                        ${item.amount.toLocaleString()} {item.currency}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            item.status === 'PAYOUT_COMPLETED'
                              ? 'success'
                              : isPending
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                          dot
                        >
                          {item.status.replace('PAYOUT_', '')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {item.manualUtrReference ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            UTR: {item.manualUtrReference}
                          </span>
                        ) : item.providerPayoutId ? (
                          <span className="text-[var(--text-secondary)]">
                            {item.providerPayoutId.slice(0, 14)}...
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)] italic">Awaiting settlement</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedPayout(item);
                                setUtrReference('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectingPayout(item);
                                setRejectReason('');
                              }}
                              className="px-2.5 py-1 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 font-medium text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <Ban className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[var(--text-muted)]">Locked</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SpatialCard>

      {/* Manual UPI Approval Modal with Bank UTR */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <SpatialCard surface={3} className="max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Approve Payout Disbursement
              </h3>
              <button
                onClick={() => setSelectedPayout(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              Confirm that the outbound funds of <strong>${selectedPayout.amount} {selectedPayout.currency}</strong> have been initiated through the banking portal to <strong>{selectedPayout.recipientIdentifier}</strong>.
            </p>

            <form onSubmit={handleApproveWithUtr} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Bank UTR / Transaction Reference Number *
                </label>
                <input
                  type="text"
                  value={utrReference}
                  onChange={(e) => setUtrReference(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC000192837482"
                  className="w-full px-3 py-2 rounded-xl text-sm font-mono uppercase surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                  required
                  autoFocus
                />
                <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                  This UTR will be recorded in the financial audit log and displayed to the creator.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  disabled={isApproving}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApproving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors"
                >
                  {isApproving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isApproving ? 'Recording...' : 'Confirm & Mark Completed'}
                </button>
              </div>
            </form>
          </SpatialCard>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingPayout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <SpatialCard surface={3} className="max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="text-base font-bold text-red-600">
                Reject Payout Request
              </h3>
              <button
                onClick={() => setRejectingPayout(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              Rejecting will return <strong>${rejectingPayout.amount} {rejectingPayout.currency}</strong> to the creator's available escrow balance and notify them with the reason.
            </p>

            <form onSubmit={handleRejectPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Invalid VPA address or KYC re-verification required."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl text-xs surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                  required
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setRejectingPayout(null)}
                  disabled={isRejecting}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRejecting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors"
                >
                  {isRejecting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isRejecting ? 'Rejecting...' : 'Reject Request'}
                </button>
              </div>
            </form>
          </SpatialCard>
        </div>
      )}
    </div>
  );
};
