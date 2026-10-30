import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
  Trash2,
  Eye,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { ContentReport } from '../../types/socialFeed';

export const AdminReportsView: React.FC = () => {
  const {
    contentReports,
    resolveReport,
    deleteSocialPost,
    toggleUserSuspension,
    logAdminAction,
    triggerCelebration,
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'investigating' | 'resolved' | 'dismissed'>('all');

  const filteredReports = contentReports.filter((report) => {
    const matchesSearch =
      report.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterHandle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleInvestigate = (report: ContentReport) => {
    resolveReport(report.id, 'investigating', 'Super Admin assigned ticket to active review pool');
    logAdminAction(
      'INVESTIGATE_REPORT',
      report.id,
      'report',
      'warning',
      `Ticket #${report.id.slice(0, 8)} moved to Investigating`
    );
    triggerCelebration();
  };

  const handleTakeDown = (report: ContentReport) => {
    if (report.targetType === 'post') {
      deleteSocialPost(report.targetId);
    }
    resolveReport(report.id, 'resolved', `Enforced content takedown on target ${report.targetType} #${report.targetId.slice(0, 8)}`);
    logAdminAction(
      'TAKEDOWN_CONTENT',
      report.targetId,
      report.targetType,
      'warning',
      `Target content removed pursuant to safety report ${report.id.slice(0, 8)}`
    );
    triggerCelebration();
  };

  const handleSuspendAccount = (report: ContentReport) => {
    toggleUserSuspension(report.targetId);
    resolveReport(report.id, 'resolved', `Associated violator account #${report.targetId.slice(0, 8)} suspended indefinitely`);
    logAdminAction(
      'SUSPEND_USER_FROM_REPORT',
      report.targetId,
      'user',
      'warning',
      `User account suspended directly from report queue`
    );
    triggerCelebration();
  };

  const handleDismiss = (report: ContentReport) => {
    resolveReport(report.id, 'dismissed', 'Reviewed and dismissed: No actionable policy violation detected.');
    logAdminAction(
      'DISMISS_REPORT',
      report.id,
      'report',
      'success',
      `Report ticket #${report.id.slice(0, 8)} dismissed after inspection`
    );
    triggerCelebration();
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight">
            Trust &amp; Safety Report Center
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans font-light">
            Manage user violation tickets, copyright infringement notices, spam flags, and community disputes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {filteredReports.length} tickets matching filters
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reporter handle, target ID, or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'All Status' },
              { id: 'pending', label: 'Pending' },
              { id: 'investigating', label: 'Investigating' },
              { id: 'resolved', label: 'Resolved' },
              { id: 'dismissed', label: 'Dismissed' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Ticket Stream */}
      <div className="space-y-3.5">
        {filteredReports.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto" />
            <h4 className="text-sm font-medium text-[var(--text-primary)]">No Reports Found</h4>
            <p className="text-xs text-[var(--text-muted)]">
              There are no reports matching the selected filters.
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isPending = report.status === 'pending';
            const isInvestigating = report.status === 'investigating';
            const isResolved = report.status === 'resolved';

            return (
              <div
                key={report.id}
                className={`p-5 rounded-2xl bg-[var(--surface)] border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-xs ${
                  isPending
                    ? 'border-rose-500/40 bg-rose-500/5'
                    : isInvestigating
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : 'border-[var(--border)]'
                }`}
              >
                {/* Ticket Details */}
                <div className="space-y-2 max-w-2xl min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      {report.reason}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)] uppercase">
                      {report.targetType} #{report.targetId.slice(0, 10)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        isPending
                          ? 'bg-rose-500 text-white animate-pulse'
                          : isInvestigating
                          ? 'bg-amber-500 text-zinc-950'
                          : isResolved
                          ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-primary)] font-sans leading-relaxed">
                    {report.details || 'Community member reported this item citing terms violation.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--text-muted)] font-mono">
                    <span>Filed by <strong className="text-[var(--text-secondary)]">{report.reporterHandle || report.reporterName}</strong></span>
                    <span>{new Date(report.createdAt).toLocaleString()}</span>
                    {report.adminNotes && (
                      <span className="text-amber-500">Note: {report.adminNotes}</span>
                    )}
                  </div>
                </div>

                {/* Admin Actions Bar */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                  {isPending && (
                    <button
                      onClick={() => handleInvestigate(report)}
                      className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 transition-all cursor-pointer"
                    >
                      Investigate
                    </button>
                  )}

                  {/* Take Down Content */}
                  <button
                    onClick={() => handleTakeDown(report)}
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Takedown Content</span>
                  </button>

                  {/* Suspend Account */}
                  <button
                    onClick={() => handleSuspendAccount(report)}
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-[var(--surface-muted)] hover:bg-rose-500/20 border border-[var(--border)] hover:border-rose-500/30 text-[var(--text-secondary)] hover:text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Ban className="w-3 h-3 text-rose-400" />
                    <span>Suspend User</span>
                  </button>

                  {/* Dismiss */}
                  <button
                    onClick={() => handleDismiss(report)}
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
