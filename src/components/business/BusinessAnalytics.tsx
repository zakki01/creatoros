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
import { useAppState } from '../../context/StateContext';
import { ReportCenterModal } from '../common/ReportCenterModal';

export const BusinessAnalytics: React.FC = () => {
  const { campaigns, activeCampaignId } = useAppState();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];

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

  const creatorPerformances = [
    {
      name: 'Rohan Sharma',
      handle: '@rohan.kicks',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      category: 'Sneaker Culture',
      deliverables: '1 Reel + 2 Stories',
      spend: 35000,
      views: 640000,
      clicks: 14800,
      conversions: 620,
      revenue: 295000,
      roas: 8.4,
      status: 'Top Performer',
    },
    {
      name: 'Dev Mehta',
      handle: '@devmehtavlogs',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      category: 'Youth Humour',
      deliverables: '1 Skit Reel',
      spend: 40000,
      views: 1450000,
      clicks: 18200,
      conversions: 510,
      revenue: 242000,
      roas: 6.05,
      status: 'High Viral Lift',
    },
    {
      name: 'Aanya Deshmukh',
      handle: '@aanya_style',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      category: 'High Fashion',
      deliverables: '1 Reel + 1 Story',
      spend: 30000,
      views: 520000,
      clicks: 8600,
      conversions: 380,
      revenue: 182000,
      roas: 6.06,
      status: 'High AOV',
    },
    {
      name: 'Maya Patel',
      handle: '@mayapatel.fit',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      category: 'Fitness',
      deliverables: '1 Wear-Test Reel',
      spend: 45000,
      views: 780000,
      clicks: 9400,
      conversions: 330,
      revenue: 151000,
      roas: 3.35,
      status: 'Steady Performer',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
              Campaign Analytics & Attribution
            </h1>
            <Badge variant="brand" size="sm">
              Real-Time Tracking
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            End-to-end performance and creator-level ROI for <strong className="text-zinc-800">"{activeCampaign.name}"</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="success" size="md">
            ROAS 3.82x (Goal: 2.5x)
          </Badge>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="w-4 h-4 text-emerald-700" />}
            onClick={() => setIsReportModalOpen(true)}
            className="border-zinc-200 text-zinc-800 cursor-pointer"
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
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[11px] font-medium truncate">{m.label}</span>
                <Icon className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-900 font-mono tracking-tight">
                  {m.value}
                </p>
                <span className="text-[10px] text-emerald-700 font-mono font-medium">
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
            <h3 className="text-base font-bold text-zinc-900 font-display">
              Creator-Level Performance & Attribution
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Exact spend, revenue, and individual return on ad spend (ROAS) per partner.
            </p>
          </div>
          <Badge variant="brand" size="sm">
            Shopify Webhook Verified
          </Badge>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-white shadow-xs text-zinc-500 border-b border-zinc-200 uppercase text-[10px] font-semibold tracking-wider">
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
            <tbody className="divide-y divide-zinc-800/80">
              {creatorPerformances.map((c, idx) => (
                <tr key={idx} className="hover:bg-zinc-100 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-zinc-700"
                      />
                      <div>
                        <p className="font-semibold text-zinc-800">{c.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{c.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500 font-mono">{c.deliverables}</td>
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
                    <span className="font-mono font-bold text-[#007E93] text-sm">
                      {c.roas.toFixed(1)}x
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge variant="brand" size="sm">
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
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
