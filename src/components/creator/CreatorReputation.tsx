import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  Clock,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { getSafeCurrentCreator } from '../../data/demoFixtures';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const CreatorReputation: React.FC = () => {
  const { creators, userProfile, authUser } = useAppState();
  const creator = getSafeCurrentCreator(creators, userProfile, authUser);

  const metrics = [
    {
      title: 'On-Time Delivery',
      score: creator.reliabilityMetrics.onTimeDelivery,
      benchmark: 'Platform avg: 82%',
      desc: 'Deliverables uploaded on or before the agreed contract milestone date.',
      trend: '+4% this quarter',
    },
    {
      title: 'Brief Compliance',
      score: creator.reliabilityMetrics.briefCompliance,
      benchmark: 'Platform avg: 86%',
      desc: 'Adherence to mandatory brand tags, CTAs, audio guidelines, and aspect ratios.',
      trend: 'Zero revision requests on last 3 drops',
    },
    {
      title: 'Communication Velocity',
      score: creator.reliabilityMetrics.communication,
      benchmark: 'Platform avg: 78%',
      desc: 'Average brand message response time is under 3.5 hours.',
      trend: 'Fast Responder Badge Active',
    },
    {
      title: 'Content Production Quality',
      score: creator.reliabilityMetrics.contentQuality,
      benchmark: 'Platform avg: 85%',
      desc: '4K resolution, color grade fidelity, and studio sound clarity.',
      trend: 'Top 2% in category',
    },
    {
      title: 'Campaign Performance Lift',
      score: creator.reliabilityMetrics.campaignPerformance,
      benchmark: 'Platform avg: 74%',
      desc: 'Exceeded forecasted CTR and engagement benchmarks across historical collaborations.',
      trend: '4.2x avg ROAS across 4 drops',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
              Creator Reputation & Trust Index
            </h1>
            <Badge variant="success" size="sm" dot>
              96 / 100 Score
            </Badge>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Explainable commercial reliability scores calculated from verified brand campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-100 border border-zinc-200 text-zinc-600 px-3.5 py-1.5 rounded-xl">
          <Award className="w-3.5 h-3.5 text-emerald-700" />
          <span>Tier: Top 1% Verified Partner</span>
        </div>
      </div>

      {/* Main Reputation Scoreboard (No generic stars - deep explainability) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">{m.title}</h3>
                <span className="text-[10px] text-zinc-500 font-mono">{m.benchmark}</span>
              </div>
              <span className="text-xl font-bold font-mono text-emerald-700">
                {m.score}%
              </span>
            </div>

            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#007E93] to-[#4CC6D7] h-full rounded-full"
                style={{ width: `${m.score}%` }}
              />
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">{m.desc}</p>

            <div className="pt-1 text-[11px] font-medium text-emerald-700/90 flex items-center gap-1.5 border-t border-zinc-200">
              <CheckCircle2 className="w-3 h-3" />
              <span>{m.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Verified Brand Testimonials Stream */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-zinc-900 font-display flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-800 fill-current" />
          <span>Verified Client Testimonials ({creator.testimonials.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {creator.testimonials.map((t) => (
            <Card key={t.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-800">{t.brandName}</h4>
                  <p className="text-[11px] text-zinc-400">
                    {t.authorName} • {t.authorRole}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-800">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold font-mono">{t.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-zinc-700 italic leading-relaxed">
                "{t.comment}"
              </p>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-200">
                <span>Campaign: <strong className="text-zinc-400">{t.verifiedCampaign}</strong></span>
                <span>{t.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
