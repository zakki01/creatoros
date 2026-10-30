import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Eye,
  Film,
  Flame,
  Globe,
  Layers,
  Lock,
  MessageSquare,
  Radio,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';

interface AdminOverviewViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({ onNavigateTab }) => {
  const {
    creators,
    campaigns,
    socialPosts,
    contentReports,
    featureFlags,
    platformSettings,
    updatePlatformSettings,
    adminActivityLogs,
    suspendedUserIds,
    triggerCelebration,
    logAdminAction,
  } = useAppState();

  const totalUsers = creators.length + 8; // Creators + Brand entities + Admins
  const totalCreators = creators.length;
  const verifiedCreators = creators.filter((c) => c.verified).length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'Active');
  const totalEscrowSecured = campaigns.reduce((sum, c) => sum + (c.budgetTotal || c.budget || 0), 0);

  const reelPosts = socialPosts.filter((p) => p.contentType === 'reel');
  const shotPosts = socialPosts.filter((p) => p.contentType === 'shot');
  const blogPosts = socialPosts.filter((p) => p.contentType === 'blog');

  const pendingReports = contentReports.filter((r) => r.status === 'pending');
  const flaggedPosts = socialPosts.filter((p) => p.moderationStatus === 'flagged');

  const handleToggleMaintenance = () => {
    const nextState = !platformSettings.maintenanceMode;
    updatePlatformSettings({ maintenanceMode: nextState });
    logAdminAction(
      nextState ? 'ENABLE_MAINTENANCE_MODE' : 'DISABLE_MAINTENANCE_MODE',
      'system',
      'system',
      'warning',
      nextState ? 'System placed in Maintenance Mode' : 'System restored to Normal Operation'
    );
    triggerCelebration();
  };

  const handleSimulateHealthCheck = () => {
    logAdminAction('RUN_TELEMETRY_HEALTH_CHECK', 'engine-v2.4', 'system', 'success', 'All 12 microservices passed latency benchmarks');
    triggerCelebration();
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[var(--text-primary)]">
      {/* 1. Command Center Telemetry Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--surface)] via-[var(--surface-muted)] to-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-rose-500/15 border border-rose-500/30 text-rose-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-rose-400" />
                Root Command Center
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Telemetry Operational
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)] hidden sm:inline">
                Cluster: ap-south-mumbai-01
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-[var(--text-primary)] tracking-tight">
              CreatorOS Command Center
            </h1>
            <p className="text-sm text-[var(--text-secondary)] font-sans max-w-2xl font-light">
              Real-time platform oversight, autonomous trust &amp; safety enforcement, content moderation, and distributed system controls.
            </p>
          </div>

          {/* Quick Action Control Strip */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleSimulateHealthCheck}
              className="px-3.5 py-2 rounded-xl text-xs font-sans font-medium bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Run Health Check</span>
            </button>

            <button
              onClick={handleToggleMaintenance}
              className={`px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                platformSettings.maintenanceMode
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 ring-2 ring-amber-400/40'
                  : 'bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                {platformSettings.maintenanceMode ? 'Exit Maintenance' : 'Emergency Maint.'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Realtime Telemetry Strip (Telemetry & Health) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">API Response</span>
            <div className="text-xl font-bold font-mono text-emerald-500 dark:text-emerald-400">14.2 ms</div>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">99.99% under 50ms</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Escrow Security</span>
            <div className="text-xl font-bold font-mono text-sky-400">100% OK</div>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">0 disputes unhandled</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">CDN Cache Ratio</span>
            <div className="text-xl font-bold font-mono text-[var(--accent)]">99.4%</div>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">Edge hit rate optimal</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Moderation AI</span>
            <div className="text-xl font-bold font-mono text-purple-400">Active</div>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">Automated filters online</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Radio className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Core Operational Bento Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Users & Network */}
        <div
          onClick={() => onNavigateTab('users')}
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all cursor-pointer group space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
              {totalUsers} Accounts
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
              {totalCreators} creators ({verifiedCreators} verified) • {suspendedUserIds.length} suspended
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>Identity verification</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-medium">96.8% valid</span>
          </div>
        </div>

        {/* Metric 2: Content Network (Reels, Shots, Blogs) */}
        <div
          onClick={() => onNavigateTab('moderation')}
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all cursor-pointer group space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
              {socialPosts.length} Live Posts
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
              {reelPosts.length} Reels • {shotPosts.length} Shots • {blogPosts.length} Blogs
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>Flagged for review</span>
            <span className={flaggedPosts.length > 0 ? 'text-amber-500 font-medium' : 'text-[var(--text-muted)]'}>
              {flaggedPosts.length} flagged
            </span>
          </div>
        </div>

        {/* Metric 3: Campaigns & Capital Escrow */}
        <div
          onClick={() => onNavigateTab('overview')}
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all cursor-pointer group space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-500 dark:text-emerald-400 tracking-tight">
              ₹{(totalEscrowSecured / 100000).toFixed(1)}L Escrow
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
              {campaigns.length} campaigns ({activeCampaigns.length} active in market)
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>Milestone payout success</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-medium">99.8%</span>
          </div>
        </div>

        {/* Metric 4: Trust & Reports Queue */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all cursor-pointer group space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <span>{pendingReports.length}</span>
              {pendingReports.length > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500 text-white font-bold animate-pulse">
                  NEEDS REVIEW
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
              Pending violation reports across posts &amp; accounts
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>Total tickets logged</span>
            <span className="text-[var(--text-muted)]">{contentReports.length} total</span>
          </div>
        </div>
      </div>

      {/* 4. Split Section: Pending Reports Queue + Live Feature Flags Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Urgent Reports Attention (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                Urgent Reports Queue
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-sky-400 hover:text-sky-300 font-sans font-medium cursor-pointer"
            >
              View All ({contentReports.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingReports.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto" />
                <h4 className="text-sm font-medium text-[var(--text-primary)]">Queue is Clean</h4>
                <p className="text-xs text-[var(--text-muted)]">
                  No pending abuse or violation reports at this moment.
                </p>
              </div>
            ) : (
              pendingReports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-[var(--surface)] border border-rose-500/20 hover:border-rose-500/40 transition-all flex items-start justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 font-bold">
                        {report.reason}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {report.targetType.toUpperCase()} #{report.targetId.slice(0, 8)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                      {report.details || 'Community member flagged this content as violating platform standards.'}
                    </p>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono">
                      Reported by {report.reporterHandle || report.reporterName} • {new Date(report.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateTab('reports')}
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-all shrink-0 cursor-pointer"
                  >
                    Investigate
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Platform Feature Flags Snapshot (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                Feature Engine Status
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('settings')}
              className="text-xs text-sky-400 hover:text-sky-300 font-sans font-medium cursor-pointer"
            >
              Configure All (14) →
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3 shadow-xs">
            {[
              { label: 'Discover Feed', key: 'discover', active: featureFlags.discover },
              { label: 'Post Creation', key: 'posting', active: featureFlags.posting },
              { label: 'Reels Engine', key: 'reels', active: featureFlags.reels },
              { label: 'Blog Publishing', key: 'blogs', active: featureFlags.blogs },
              { label: 'Direct Messaging', key: 'messaging', active: featureFlags.messaging },
              { label: 'Campaign Marketplace', key: 'campaigns', active: featureFlags.campaigns },
            ].map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]/40"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      f.active ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-zinc-600'
                    }`}
                  />
                  <span className="text-xs font-medium text-[var(--text-primary)]">{f.label}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    f.active
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  {f.active ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Live Admin Audit Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono">
              Live Audit Trail
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('logs')}
            className="text-xs text-sky-400 hover:text-sky-300 font-sans font-medium cursor-pointer"
          >
            Full Audit Logs →
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="divide-y divide-[var(--border)]">
            {adminActivityLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-muted)] text-[var(--text-secondary)] font-semibold border border-[var(--border)]">
                    {log.action}
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">{log.details || log.target}</span>
                </div>
                <div className="flex items-center gap-4 text-[var(--text-muted)] font-mono text-[11px] shrink-0">
                  <span>by {log.adminName}</span>
                  <span>{new Date(log.date || log.timestamp || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
