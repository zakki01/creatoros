import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Users,
  Film,
  Send,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const CampaignTimeline: React.FC = () => {
  const { campaigns, activeCampaignId, setActiveCampaignId } = useAppState();

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];

  const timelineStages = [
    {
      id: 'brief',
      name: 'Brief Preparation',
      status: 'completed',
      date: 'Sept 01 - Sept 04',
      blockers: null,
      description: 'Brand aesthetic guidelines, 3M reflective showcase rules locked.',
    },
    {
      id: 'selection',
      name: 'Creator Selection',
      status: 'completed',
      date: 'Sept 05 - Sept 09',
      blockers: null,
      description: '25 creators shortlisted based on 90%+ AI affinity scores in Mumbai & Delhi.',
    },
    {
      id: 'outreach',
      name: 'Outreach & Contracting',
      status: 'completed',
      date: 'Sept 10 - Sept 18',
      blockers: null,
      description: '18 creators confirmed, digital contracts and 50% advance released.',
    },
    {
      id: 'samples',
      name: 'Product Sample Delivery',
      status: 'completed',
      date: 'Sept 19 - Sept 24',
      blockers: null,
      description: 'Physical sneaker shipments dispatched via Express Logistics.',
    },
    {
      id: 'submission',
      name: 'Content Submission & AI Pre-Check',
      status: 'active',
      date: 'Sept 25 - Oct 08',
      blockers: '2 creators delayed in transit; draft deadline in 48h',
      description: '12 drafts submitted, automated checks for logo visibility & duration run.',
    },
    {
      id: 'approval',
      name: 'Brand Review & Approvals',
      status: 'active',
      date: 'Sept 28 - Oct 12',
      blockers: '3 drafts awaiting final review sign-off',
      description: 'Marketing team inspection, revision loops, and scheduled drop dates.',
    },
    {
      id: 'publishing',
      name: 'Coordinated Publishing Wave',
      status: 'upcoming',
      date: 'Oct 10 - Oct 22',
      blockers: null,
      description: 'Staggered Instagram Reels and Story frames with custom discount links.',
    },
    {
      id: 'analytics',
      name: 'Post-Campaign ROI & Learning',
      status: 'upcoming',
      date: 'Oct 23 - Oct 30',
      blockers: null,
      description: 'Full attribution modeling, ROAS calculation, and AI model weight fine-tuning.',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
              Campaign Timeline & Blockers
            </h1>
            <Badge variant="brand" size="sm">
              Live Progress
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Tracking execution milestones for <strong className="text-[var(--text-primary)]">"{activeCampaign.name}"</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {campaigns.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCampaignId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                c.id === activeCampaign.id
                  ? 'bg-[#007E93] text-white shadow-sm'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Overdue / Blocker Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-400">
            Active Milestone Blocker Detected: Content Submission Wave 1
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Publishing wave was scheduled for Friday; 2 creators are delayed in transit due to courier delivery latency. AI recommends auto-adjusting wave 1 schedule by 24h to synchronize creator release impact.
          </p>
        </div>
      </div>

      {/* Visual Pipeline Timeline Cards */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border)]">
        {timelineStages.map((stage, idx) => {
          const isDone = stage.status === 'completed';
          const isActive = stage.status === 'active';
          return (
            <div key={stage.id} className="relative group">
              {/* Timeline Pin */}
              <div
                className={`absolute -left-6 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : isActive
                    ? 'bg-[#00B4D8] border-indigo-400 text-white ring-4 ring-[#007E93]/20 animate-pulse-subtle'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>

              {/* Stage Card */}
              <Card
                className={`p-5 space-y-3 transition-all ${
                  isActive
                    ? 'bg-[var(--surface-elevated)] border-[#00B4D8]/60 shadow-lg'
                    : 'bg-[var(--surface)] border-[var(--border)] opacity-80 group-hover:opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-semibold text-[var(--text-muted)]">
                      Phase {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-display">
                      {stage.name}
                    </h3>
                    <Badge
                      variant={isDone ? 'success' : isActive ? 'brand' : 'neutral'}
                      size="sm"
                    >
                      {stage.status.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>{stage.date}</span>
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {stage.description}
                </p>

                {stage.blockers && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[11px] text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>Active Blocker:</strong> {stage.blockers}</span>
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
