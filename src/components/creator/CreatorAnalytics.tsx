import React, { useState } from 'react';
import {
  Eye,
  Heart,
  MousePointer,
  DollarSign,
  TrendingUp,
  Download,
  PlusCircle,
  Compass,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { getSafeCurrentCreator } from '../../data/demoFixtures';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SpatialCard } from '../ui/SpatialCard';
import { ReportCenterModal } from '../common/ReportCenterModal';
import { useToast } from '../ui/Toast';
import {
  getCreatorAnalytics,
  exportCreatorAnalyticsKit,
} from '../../services/analyticsService';

export interface CreatorAnalyticsProps {
  onNavigate?: (tab: string) => void;
  onOpenSubmissionModal?: () => void;
}

export const CreatorAnalytics: React.FC<CreatorAnalyticsProps> = ({
  onNavigate,
  onOpenSubmissionModal,
}) => {
  const {
    creators,
    userProfile,
    authUser,
    socialPosts,
    payments,
    setCreatorActiveTab,
  } = useAppState();

  const handleNavigate = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      setCreatorActiveTab(tab);
    }
  };

  const creator = getSafeCurrentCreator(creators, userProfile, authUser);
  const toast = useToast();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Derive truthful, real-time analytics
  const analytics = getCreatorAnalytics(creator, socialPosts, payments);

  const personalMetrics = [
    {
      label: 'Views',
      value: analytics.viewsFormatted,
      delta: analytics.hasData ? analytics.viewsDelta : '—',
      icon: Eye,
    },
    {
      label: 'Engagement',
      value: analytics.engagementFormatted,
      delta: analytics.hasData ? analytics.engagementDelta : '—',
      icon: Heart,
    },
    {
      label: 'Link Clicks',
      value: analytics.linkClicksFormatted,
      delta: analytics.hasData ? analytics.linkClicksDelta : '—',
      icon: MousePointer,
    },
    {
      label: 'Conversions',
      value: analytics.conversionsFormatted,
      delta: analytics.hasData ? analytics.conversionsDelta : '—',
      icon: TrendingUp,
    },
    {
      label: 'Earned',
      value: analytics.earnedFormatted,
      delta: analytics.hasData ? analytics.earnedDelta : '—',
      icon: DollarSign,
    },
  ];

  const handleQuickExport = () => {
    try {
      exportCreatorAnalyticsKit(analytics, creator, 'json');
      toast.success('Analytics summary kit downloaded');
    } catch {
      setIsReportModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-[calc(96px+env(safe-area-inset-bottom,20px))] sm:pb-12 max-w-5xl mx-auto w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
              Analytics
            </h1>
            {creator.verified && (
              <Badge variant="success" size="sm" dot>
                Verified
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            30-day reach and campaign performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Download className="w-3.5 h-3.5 text-emerald-500" />}
            onClick={handleQuickExport}
            data-testid="analytics-export-kit-btn"
          >
            Export Kit
          </Button>
        </div>
      </div>

      {/* Honest Empty State Guidance Callout if user has zero activity */}
      {!analytics.hasData && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] font-display">
                Analytics Vault
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Metrics update automatically as you publish content and complete brand campaigns.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onOpenSubmissionModal) {
                  onOpenSubmissionModal();
                } else {
                  handleNavigate('content');
                }
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Content</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('campaigns')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-muted)] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Opportunities</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI Spatial Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {personalMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <SpatialCard key={idx} surface={2} interactive className="p-4 space-y-2">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-medium truncate">{m.label}</span>
                <Icon className="w-3.5 h-3.5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--text-primary)] font-mono tracking-tight">
                  {m.value}
                </p>
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    m.delta === '—'
                      ? 'text-[var(--text-muted)]'
                      : 'text-emerald-500 dark:text-emerald-400'
                  }`}
                >
                  {m.delta}
                </span>
              </div>
            </SpatialCard>
          );
        })}
      </div>

      {/* Dimensional Reach Curve */}
      <SpatialCard surface={2} className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] font-display">
              Reach Velocity
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {analytics.reachVelocityImpressionsFormatted}
              {analytics.hasData ? ' · 30-day telemetry' : ' · zero recorded events'}
            </p>
          </div>
          {analytics.hasData && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              {analytics.reachPeakFormatted}
            </span>
          )}
        </div>

        {analytics.hasData ? (
          <div className="relative h-44 w-full pt-2">
            <svg
              viewBox="0 0 600 160"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="spatialChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="var(--primary)" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="spatialChartStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter id="pointGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Reference gridlines */}
              <line
                x1="0"
                y1="35"
                x2="600"
                y2="35"
                stroke="var(--border)"
                strokeOpacity="0.6"
                strokeDasharray="4 4"
              />
              <line
                x1="0"
                y1="85"
                x2="600"
                y2="85"
                stroke="var(--border)"
                strokeOpacity="0.6"
                strokeDasharray="4 4"
              />
              <line
                x1="0"
                y1="135"
                x2="600"
                y2="135"
                stroke="var(--border)"
                strokeOpacity="0.6"
              />

              {/* Area under curve */}
              <path
                d="M0,125 C80,118 130,85 200,90 C270,95 330,45 410,52 C480,58 530,22 600,18 L600,150 L0,150 Z"
                fill="url(#spatialChartFill)"
              />

              {/* Dimensional glowing stroke */}
              <path
                d="M0,125 C80,118 130,85 200,90 C270,95 330,45 410,52 C480,58 530,22 600,18"
                fill="none"
                stroke="url(#spatialChartStroke)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Glowing Active Nodes */}
              <circle cx="200" cy="90" r="4.5" fill="var(--primary)" filter="url(#pointGlow)" />
              <circle cx="410" cy="52" r="5" fill="#38BDF8" filter="url(#pointGlow)" />
              <circle cx="596" cy="18" r="5.5" fill="#10B981" filter="url(#pointGlow)" />
            </svg>

            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Current</span>
            </div>
          </div>
        ) : (
          <div className="h-44 w-full rounded-xl bg-[var(--surface-muted)]/50 border border-dashed border-[var(--border)] flex flex-col items-center justify-center p-6 text-center">
            <BarChart3 className="w-8 h-8 text-[var(--text-muted)] stroke-1 mb-2" />
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              No reach activity recorded yet
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-sm">
              Once your content is published and viewed, your reach velocity curve will render here.
            </p>
          </div>
        )}
      </SpatialCard>

      {/* Top Sponsored Deliverables */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] font-display px-1">
          Top Sponsored Deliverables
        </h3>

        {analytics.topDeliverables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.topDeliverables.map((item, idx) => (
              <SpatialCard
                key={item.id}
                surface={2}
                interactive
                tilt
                className="overflow-hidden group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="brand" size="sm">
                      #{idx + 1}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between text-xs text-white">
                    <span className="font-mono font-semibold">
                      {(item.views / 1000).toFixed(0)}K Views
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {(item.likes / 1000).toFixed(1)}K Likes
                    </span>
                  </div>
                </div>

                <div className="p-3.5">
                  <h4 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.type}</p>
                </div>
              </SpatialCard>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--border)] text-center space-y-2">
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              No sponsored deliverables completed yet.
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Deliverables from completed brand collaborations will be verified and showcased here.
            </p>
          </div>
        )}
      </div>

      {/* Reusable Report Center Modal */}
      <ReportCenterModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultReportType="creator"
      />
    </div>
  );
};
