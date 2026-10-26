import React, { useState } from 'react';
import {
  Eye,
  Heart,
  MousePointer,
  DollarSign,
  TrendingUp,
  Download,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SpatialCard } from '../ui/SpatialCard';
import { ReportCenterModal } from '../common/ReportCenterModal';

export const CreatorAnalytics: React.FC = () => {
  const { creators } = useAppState();
  const creator = creators[0];
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const personalMetrics = [
    { label: 'Views', value: '1.37M', delta: '+24%', icon: Eye },
    { label: 'Engagement', value: '5.4%', delta: '+0.8%', icon: Heart },
    { label: 'Link Clicks', value: '29.4K', delta: '+31%', icon: MousePointer },
    { label: 'Conversions', value: '1,130', delta: '+18%', icon: TrendingUp },
    { label: 'Earned', value: '₹1.27L', delta: '+45%', icon: DollarSign },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display tracking-tight">
              Analytics
            </h1>
            <Badge variant="success" size="sm" dot>
              Verified
            </Badge>
          </div>
          <p className="text-xs text-zinc-600 mt-0.5">
            30-day reach and campaign performance
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          leftIcon={<Download className="w-3.5 h-3.5 text-emerald-700" />}
          onClick={() => setIsReportModalOpen(true)}
        >
          Export Kit
        </Button>
      </div>

      {/* Primary KPI Spatial Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {personalMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <SpatialCard key={idx} surface={2} interactive className="p-4 space-y-2">
              <div className="flex items-center justify-between text-zinc-600">
                <span className="text-[11px] font-medium truncate">{m.label}</span>
                <Icon className="w-3.5 h-3.5 text-[#007E93]" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-900 font-mono tracking-tight">
                  {m.value}
                </p>
                <span className="text-[10px] text-emerald-700 font-mono font-semibold">
                  {m.delta}
                </span>
              </div>
            </SpatialCard>
          );
        })}
      </div>

      {/* Dimensional Reach Curve (Section 14: soft gradients, glowing active points, minimal labels) */}
      <SpatialCard surface={2} className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 font-display">
              Reach Velocity
            </h3>
            <p className="text-[11px] text-zinc-600">
              184K impressions · +18% vs last 30d
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-500/30">
            Peak: 48.2K / day
          </span>
        </div>

        <div className="relative h-44 w-full pt-2">
          <svg
            viewBox="0 0 600 160"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="spatialChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007E93" stopOpacity="0.38" />
                <stop offset="65%" stopColor="#8EDCE5" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#EDF3F6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="spatialChartStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#007E93" />
                <stop offset="55%" stopColor="#8EDCE5" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <filter id="pointGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle horizontal reference lines */}
            <line x1="0" y1="35" x2="600" y2="35" stroke="rgba(100,116,139,0.18)" strokeDasharray="4 4" />
            <line x1="0" y1="85" x2="600" y2="85" stroke="rgba(100,116,139,0.18)" strokeDasharray="4 4" />
            <line x1="0" y1="135" x2="600" y2="135" stroke="rgba(100,116,139,0.18)" />

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
            <circle cx="200" cy="90" r="4.5" fill="#7C5CFF" filter="url(#pointGlow)" />
            <circle cx="410" cy="52" r="5" fill="#38BDF8" filter="url(#pointGlow)" />
            <circle cx="596" cy="18" r="5.5" fill="#10B981" filter="url(#pointGlow)" />
          </svg>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Current</span>
          </div>
        </div>
      </SpatialCard>

      {/* Top Content Showcase */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 font-display px-1">
          Top Sponsored Deliverables
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creator.portfolio.map((item, idx) => (
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
                  <span className="font-mono font-semibold">{(item.views / 1000).toFixed(0)}K Views</span>
                  <span className="font-mono text-emerald-800 font-semibold">
                    {(item.engagement / 1000).toFixed(1)}K Likes
                  </span>
                </div>
              </div>

              <div className="p-3.5">
                <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-zinc-600 mt-0.5">{item.type}</p>
              </div>
            </SpatialCard>
          ))}
        </div>
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

