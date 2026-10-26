import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Clock,
  Filter,
  Search,
  ExternalLink,
  MessageSquare,
  Ban,
  Trash2,
  FileText,
  User,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { ContentReport, ReportReason, ReportStatus } from '../../types/socialFeed';

export const AdminReportsView: React.FC = () => {
  const {
    contentReports,
    resolveReport,
    setPostModerationStatus,
    toggleUserSuspension,
    logAdminAction,
    triggerCelebration,
  } = useAppState();

  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const filteredReports = contentReports.filter((report) => {
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (reasonFilter !== 'all' && report.reason !== reasonFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (report.reporterHandle || report.reporterName || '').toLowerCase().includes(q) ||
        report.targetId.toLowerCase().includes(q) ||
        (report.details && report.details.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDismiss = (report: ContentReport) => {
    resolveReport(report.id, 'dismissed', 'Reviewed by Super Admin: No violation found.');
    logAdminAction(
      'DISMISS_REPORT',
      report.id,
      'report',
      'success',
      `Report #${report.id} dismissed as unfounded.`
    );
    triggerCelebration();
  };

  const handleTakeDown = (report: ContentReport) => {
    // If it's a post, set its status to removed
    if (report.targetType === 'post' || report.targetType === 'reel' || report.targetType === 'shot' || report.targetType === 'blog') {
      setPostModerationStatus(report.targetId, 'removed');
    }
    resolveReport(report.id, 'resolved', 'Violation confirmed. Content removed from public platform.');
    logAdminAction(
      'TAKEDOWN_CONTENT',
      report.targetId,
      'post',
      'warning',
      `Content removed per report #${report.id} for ${report.reason}`
    );
    triggerCelebration();
  };

  const handleSuspendAccount = (report: ContentReport) => {
    toggleUserSuspension(report.targetId);
    resolveReport(report.id, 'resolved', `Account suspended due to confirmed ${report.reason}.`);
    logAdminAction(
      'SUSPEND_REPORTED_USER',
      report.targetId,
      'user',
      'failed',
      `User account suspended following community report investigation #${report.id}`
    );
    triggerCelebration();
  };

  const handleInvestigate = (report: ContentReport) => {
    resolveReport(report.id, 'investigating', 'Assigned to Trust & Safety investigation team.');
    logAdminAction(
      'INVESTIGATE_REPORT',
      report.id,
      'report',
      'warning',
      `Report #${report.id} escalated to active investigation`
    );
    triggerCelebration();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-zinc-900 tracking-tight">
            Trust &amp; Safety Report Center
          </h2>
          <p className="text-xs text-zinc-500 font-sans font-light">
            Manage user violation tickets, copyright infringement notices, spam flags, and community disputes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">
            {filteredReports.length} tickets matching filters
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white shadow-sm border border-black/[0.08] backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reporter handle, target ID, or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white shadow-sm border border-black/[0.08] text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-sky-500/50"
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
                  ? 'bg-[#007E93] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
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
          <div className="p-12 rounded-2xl bg-zinc-50 border border-black/[0.08] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
            <h4 className="text-sm font-medium text-zinc-900">No Reports Found</h4>
            <p className="text-xs text-zinc-500">
              There are no reports matching the selected filters.
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isPending = report.status === 'pending';
            const isInvestigating = report.status === 'investigating';
            const isResolved = report.status === 'resolved';
            const isDismissed = report.status === 'dismissed';

            return (
              <div
                key={report.id}
                className={`p-5 rounded-2xl bg-white shadow-sm border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 ${
                  isPending
                    ? 'border-rose-500/40 bg-rose-950/5'
                    : isInvestigating
                    ? 'border-amber-500/40 bg-amber-950/5'
                    : 'border-black/[0.08]'
                }`}
              >
                {/* Ticket Details */}
                <div className="space-y-2 max-w-2xl min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      {report.reason}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-zinc-700 border border-black/[0.08] uppercase">
                      {report.targetType} #{report.targetId.slice(0, 10)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        isPending
                          ? 'bg-rose-500 text-white animate-pulse'
                          : isInvestigating
                          ? 'bg-amber-500 text-zinc-950'
                          : isResolved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/30'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-800 font-sans leading-relaxed">
                    {report.details || 'Community member reported this item citing terms violation.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 font-mono">
                    <span>Filed by <strong className="text-zinc-700">{report.reporterHandle || report.reporterName}</strong></span>
                    <span>{new Date(report.createdAt).toLocaleString()}</span>
                    {report.adminNotes && (
                      <span className="text-amber-800">Note: {report.adminNotes}</span>
                    )}
                  </div>
                </div>

                {/* Admin Actions Bar */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                  {isPending && (
                    <button
                      onClick={() => handleInvestigate(report)}
                      className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-amber-50 hover:bg-amber-50 border border-amber-500/30 text-amber-800 transition-all cursor-pointer"
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
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-white hover:bg-rose-950/40 border border-black/[0.08] hover:border-rose-500/30 text-zinc-700 hover:text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Ban className="w-3 h-3 text-rose-400" />
                    <span>Suspend User</span>
                  </button>

                  {/* Dismiss */}
                  <button
                    onClick={() => handleDismiss(report)}
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-white hover:bg-zinc-100 border border-black/[0.08] text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
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
