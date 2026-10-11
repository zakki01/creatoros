import React, { useState } from 'react';
import {
  Eye,
  Heart,
  MousePointer,
  DollarSign,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Film,
  Lock,
  Download,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ReportCenterModal } from '../common/ReportCenterModal';

export const CreatorAnalytics: React.FC = () => {
  const { creators } = useAppState();
  const creator = creators[0];
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const personalMetrics = [
    { label: 'Total Content Views', value: '1.37M', delta: '+24%', icon: Eye },
    { label: 'Avg Engagement Rate', value: '5.4%', delta: '+0.8%', icon: Heart },
    { label: 'Total Bio Link Clicks', value: '29,400', delta: '+31%', icon: MousePointer },
    { label: 'Direct Conversions', value: '1,130', delta: '+18%', icon: TrendingUp },
    { label: 'Total Earned', value: '₹1,27,500', delta: '+45%', icon: DollarSign },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 font-display">
              Personal Performance Analytics
            </h1>
            <Badge variant="success" size="sm" dot>
              Channel Verified
            </Badge>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Track your reach, engagement, click-through conversions, and cumulative earnings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="w-4 h-4 text-emerald-400" />}
            onClick={() => setIsReportModalOpen(true)}
            className="border-zinc-800 text-zinc-200 cursor-pointer"
          >
            Export Verified Kit
          </Button>
        </div>
      </div>

      {/* Primary KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {personalMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Card key={idx} className="p-4 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[11px] font-medium truncate">{m.label}</span>
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-100 font-mono tracking-tight">
                  {m.value}
                </p>
                <span className="text-[10px] text-emerald-400 font-mono font-medium">
                  {m.delta} this month
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Best-Performing Content Showcase */}
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-zinc-100 font-display">
            Best-Performing Sponsored Content
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Ranked by video view retention and verified promo link click velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {creator.portfolio.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden space-y-2 group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="brand" size="sm">
                    Rank #{idx + 1}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between text-xs text-white">
                  <span className="font-mono">{(item.views / 1000).toFixed(0)}K Views</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {(item.engagement / 1000).toFixed(1)}K Likes
                  </span>
                </div>
              </div>

              <div className="p-3.5 space-y-1">
                <h4 className="text-xs font-semibold text-zinc-200 line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-zinc-400">
                  Deliverable format: <strong className="text-zinc-300">{item.type}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reusable Report Center Modal */}
      <ReportCenterModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultReportType="creator"
      />
    </div>
  );
};
