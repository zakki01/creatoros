import React from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const BusinessAiInsights: React.FC<{ onOpenCampaign: (id: string) => void }> = ({
  onOpenCampaign,
}) => {
  const { campaigns } = useAppState();

  const insights = [
    {
      id: 'ins-01',
      category: 'Audience Saturation',
      title: 'Mumbai Streetwear Audience Overlap Detected',
      description:
        'Rohan Sharma and Dev Mehta share approximately 28% audience overlap in Mumbai. Staggering their posting dates by 4 days will prevent ad fatigue and maximize net unique reach.',
      campaignId: 'camp-01',
      actionText: 'View Summer Collection',
    },
    {
      id: 'ins-02',
      category: 'Conversion Velocity',
      title: 'High CTR Trend on Unboxing Reels',
      description:
        'Short-form vertical video featuring physical packaging unboxings is currently generating a 4.1% CTR, which is 1.8x higher than lifestyle try-on static posts.',
      campaignId: 'camp-02',
      actionText: 'View Mumbai Sneaker Launch',
    },
    {
      id: 'ins-03',
      category: 'Schedule Risk',
      title: 'Courier Transit Delay in North Region',
      description:
        'Deliveries to Delhi creators are experiencing a 24-hour transit delay. CreatorOS recommends shifting wave 1 content deadlines by 1 day to keep publishing synchronized.',
      campaignId: 'camp-01',
      actionText: 'Adjust Timeline',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-zinc-900 font-display">
            AI Insights
          </h1>
          <Sparkles className="w-4 h-4 text-[#0096C7]" />
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Contextual intelligence and algorithmic optimizations across your active campaigns.
        </p>
      </div>

      {/* Insights Stream */}
      <div className="space-y-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200 hover:border-zinc-300 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-medium text-[#0096C7] uppercase tracking-wider bg-indigo-950/40 px-2 py-0.5 rounded border border-[#00B4D8]/20">
                {item.category}
              </span>
              <button
                onClick={() => onOpenCampaign(item.campaignId)}
                className="text-xs text-zinc-500 hover:text-zinc-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
