import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
  Users,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Percent,
  Download,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SpatialEmptyState } from '../ui/SpatialEmptyState';
import { useAppState } from '../../context/StateContext';
import { ReportCenterModal } from '../common/ReportCenterModal';
import { DEMO_CAMPAIGN } from '../../data/demoFixtures';

export const BusinessAnalytics: React.FC = () => {
  const { campaigns, activeCampaignId, authUser } = useAppState();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const isDemo = Boolean(authUser?.is_demo || authUser?.isDemo);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0] || (isDemo ? DEMO_CAMPAIGN : null);

  if (!activeCampaign && campaigns.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
                Campaign Analytics & Attribution
              </h1>
              <Badge variant="brand" size="sm">
                Real-Time Tracking
              </Badge>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              End-to-end performance and creator-level ROI
            </p>
          </div>
        </div>

        <SpatialEmptyState
          title="No Campaign Analytics Available"
          description="Launch a brand campaign or invite creators to start receiving live attribution, ROAS tracking, and engagement metrics."
          icon={BarChart3}
        />
      </div>
    );
  }

  const primaryMetrics = [
    { label: 'Total Reach', value: '2.42M', delta: '+18.4%', trend: 'up', icon: Eye },
    { label: 'Total Impressions', value: '3.86M', delta: '+22.1%', trend: 'up', icon: BarChart3 },
    { label: 'Video Views', value: '1.92M', delta: '+14.6%', trend: 'up', icon: Eye },
    { label: 'Avg Engagement Rate', value: '5.4%', delta: '+1.2%', trend: 'up', icon: TrendingUp },
    { label: 'Direct Clicks', value: '44,200', delta: '+28.0%', trend: 'up', icon: MousePointer },
    { label: 'Click-Through Rate (CTR)', value: '3.6%', delta: '+0.8%', trend: 'up', icon: Percent },
    { label: 'Tracked Conversions', value: '1,840', delta: '+34.2%', trend: 'up', icon: Users },
    { label: 'Total Revenue', value: '₹8,70,000', delta: '+41.0%', trend: 'up', icon: DollarSign },
    { label: 'Effective CPA', value: '₹228', delta: '-12.5%', trend: 'good', icon: DollarSign },
    { label: 'Blended ROAS', value: '3.82x', delta: '+0.6x', trend: 'good', icon: Sparkles },
  ];

  const demoPerformances = [
    {
      name: 'CreatorOS Demo Creator',
      handle: '@democreator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      category: 'Fashion & Streetwear',
      deliverables: '1 Reel + 2 Stories',
      spend: 45000,
      views: 125000,
      clicks: 8400,
      conversions: 320,
      revenue: 120000,
      roas: 2.67,
      status: 'Top Performer',
    },
  ];

  const creatorPerformances = isDemo ? demoPerformances : [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
              Campaign Analytics & Attribution
            </h1>
            <Badge variant="brand" size="sm">
              Real-Time Tracking
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            End-to-end performance and creator-level ROI for <strong className="text-[var(--text-primary)]">"{activeCampaign.name}"</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="success" size="md">
            ROAS 3.82x (Goal: 2.5x)
          </Badge>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="w-4 h-4 text-emerald-500" />}
            onClick={() => setIsReportModalOpen(true)}
            className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] cursor-pointer"
          >
            Export & Share Report
          </Button>
        </div>
      </div>

      {/* High-Level Metric Tiles (10 Key Spec Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {primaryMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Card key={idx} className="p-4 space-y-2">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="text-[11px] font-medium truncate">{m.label}</span>
                <Icon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--text-primary)] font-mono tracking-tight">
                  {m.value}
                </p>
                <span className="text-[10px] text-emerald-500 font-mono font-medium">
                  {m.delta} vs forecasted
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Creator-Level Performance Breakdown (Specified in requirements) */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
              Creator-Level Performance & Attribution
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Exact spend, revenue, and individual return on ad spend (ROAS) per partner.
            </p>
          </div>
          <Badge variant="brand" size="sm">
            Shopify Webhook Verified
          </Badge>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-b border-[var(--border)] uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Creator Partner</th>
                <th className="py-3 px-4">Deliverables</th>
                <th className="py-3 px-4">Spend</th>
                <th className="py-3 px-4">Video Views</th>
                <th className="py-3 px-4">Clicks</th>
                <th className="py-3 px-4">Conversions</th>
                <th className="py-3 px-4">Generated Revenue</th>
                <th className="py-3 px-4">ROAS</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {creatorPerformances.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[var(--text-secondary)] font-normal">
                    No creator-level performance data recorded yet.
                  </td>
                </tr>
              ) : (
                creatorPerformances.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[var(--surface-subtle)] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-[var(--border)]"
                        />
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{c.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)] font-mono">{c.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-secondary)] font-mono">{c.deliverables}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-zinc-800">
                      ₹{(c.spend / 1000).toFixed(0)}K
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-700">
                      {(c.views / 1000).toFixed(0)}K
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-700">
                      {c.clicks.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-zinc-800">
                      {c.conversions}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      ₹{(c.revenue / 100000).toFixed(1)}L
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[var(--primary)] text-sm">
                        {c.roas.toFixed(1)}x
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge variant="brand" size="sm">
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ReportCenterModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultReportType="campaign"
      />
    </div>
  );
};
