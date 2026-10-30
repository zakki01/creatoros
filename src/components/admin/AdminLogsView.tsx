import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  Terminal,
  Shield,
  Layers,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';

export const AdminLogsView: React.FC = () => {
  const { adminActivityLogs } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<'all' | 'success' | 'warning' | 'failed'>('all');

  const filteredLogs = adminActivityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResult = resultFilter === 'all' || log.result === resultFilter;

    return matchesSearch && matchesResult;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(adminActivityLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `creatoros_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight">
            Security &amp; Administrative Audit Trail
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans font-light">
            Immutable log of all moderation interventions, role transitions, feature flag toggles, and system security events.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="px-3.5 py-2 rounded-xl text-xs font-sans font-medium bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Export JSON</span>
        </button>
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
            placeholder="Search audit actions, admin identity, target IDs, or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Result Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(
            [
              { id: 'all', label: 'All Results' },
              { id: 'success', label: 'Success' },
              { id: 'warning', label: 'Warning' },
              { id: 'failed', label: 'Failed' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              onClick={() => setResultFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                resultFilter === st.id
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">Admin</th>
                <th className="py-3.5 px-4 font-semibold">Action</th>
                <th className="py-3.5 px-4 font-semibold">Target / Resource</th>
                <th className="py-3.5 px-4 font-semibold">Details</th>
                <th className="py-3.5 px-4 font-semibold text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {filteredLogs.map((log) => {
                const isSuccess = log.result === 'success';
                const isWarning = log.result === 'warning';
                const isFailed = log.result === 'failed';

                return (
                  <tr key={log.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)] whitespace-nowrap text-[11px]">
                      {new Date(log.date || log.timestamp || Date.now()).toLocaleString()}
                    </td>

                    {/* Admin */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px] font-mono font-bold">
                          A
                        </div>
                        <span className="font-medium text-[var(--text-primary)]">{log.adminName}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)] font-bold">
                        {log.action}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)] whitespace-nowrap">
                      <span className="text-[var(--text-muted)] text-[10px] uppercase mr-1">{log.targetType}:</span>
                      <span>{log.target}</span>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 text-[var(--text-secondary)] font-sans max-w-md truncate">
                      {log.details || '—'}
                    </td>

                    {/* Result */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isSuccess && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          SUCCESS
                        </span>
                      )}
                      {isWarning && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          WARNING
                        </span>
                      )}
                      {isFailed && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          <XCircle className="w-3 h-3" />
                          FAILED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
