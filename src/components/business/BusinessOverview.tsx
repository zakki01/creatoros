import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

interface BusinessOverviewProps {
  onNavigate: (tab: string) => void;
  onOpenCampaign: (campaignId: string) => void;
  onOpenCreateCampaign: () => void;
}

export const BusinessOverview: React.FC<BusinessOverviewProps> = ({
  onNavigate,
  onOpenCampaign,
  onOpenCreateCampaign,
}) => {
  const {
    workspace,
    campaigns,
    creators,
    attentionItems,
    submissions,
    resolveAttentionItem,
  } = useAppState();

  const activeAttention = attentionItems.filter((i) => !i.resolved);
  const pendingApprovals = submissions.filter((s) => s.status === 'submitted');

  const totalSpent = campaigns.reduce((sum, c) => sum + c.budgetSpent, 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budgetTotal, 0);

  const handleAttentionAction = (item: typeof attentionItems[0]) => {
    if (item.actionType === 'review') {
      onOpenCampaign(item.campaignId);
    } else if (item.actionType === 'send_reminder') {
      onOpenCampaign(item.campaignId);
    } else if (item.actionType === 'view_campaign') {
      onOpenCampaign(item.campaignId);
    } else {
      resolveAttentionItem(item.id);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* 1. Header (Command Center Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display tracking-tight">
            Good morning, {workspace.name}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Here's what needs your attention today across active campaigns.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenCreateCampaign}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-xs"
        >
          New Campaign
        </Button>
      </div>

      {/* 2. Top Summary KPI Strip (Active campaigns, Creators, Pending approvals, Budget/spend) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-black/[0.08] backdrop-blur-xl hover:border-black/15 transition-all duration-200">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Active Campaigns
          </span>
          <span className="text-2xl font-bold font-mono text-zinc-900 mt-1 block">
            {campaigns.filter((c) => c.status === 'Active').length}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-black/[0.08] backdrop-blur-xl hover:border-black/15 transition-all duration-200">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Creators in Roster
          </span>
          <span className="text-2xl font-bold font-mono text-zinc-900 mt-1 block">
            {creators.length}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-black/[0.08] backdrop-blur-xl hover:border-black/15 transition-all duration-200">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Pending Approvals
          </span>
          <span className="text-2xl font-bold font-mono text-[#007E93] mt-1 block">
            {pendingApprovals.length}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-black/[0.08] backdrop-blur-xl hover:border-black/15 transition-all duration-200">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Budget / Spend
          </span>
          <span className="text-2xl font-bold font-mono text-zinc-900 mt-1 block">
            ₹{(totalSpent / 100000).toFixed(1)}L <span className="text-xs text-zinc-500 font-normal">/ ₹{(totalBudget / 100000).toFixed(1)}L</span>
          </span>
        </div>
      </div>

      {/* 3. "NEEDS YOUR ATTENTION" (3-5 Actionable Items) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider">
            Needs your attention
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            {activeAttention.length} active
          </span>
        </div>

        {activeAttention.length === 0 ? (
          <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-500">
            No blockers or delays detected right now. Everything is moving on schedule.
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeAttention.slice(0, 4).map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white shadow-xs border border-black/[0.08] hover:border-black/15 backdrop-blur-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-mono font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold text-zinc-800">{item.title}</h3>
                      <span className="text-[11px] text-zinc-500 font-mono">[{item.campaignName}]</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resolveAttentionItem(item.id)}
                    className="text-xs cursor-pointer"
                  >
                    Resolve
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAttentionAction(item)}
                    className="text-xs cursor-pointer"
                  >
                    {item.actionType === 'review'
                      ? 'Review'
                      : item.actionType === 'send_reminder'
                      ? 'Send Reminder'
                      : 'View Campaign'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. "YOUR CAMPAIGNS" (Cards with Status, Progress, Creators, Content, Budget) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider">
            Your campaigns
          </h2>
          <button
            onClick={() => onNavigate('campaigns')}
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => onOpenCampaign(camp.id)}
              className="p-5 rounded-2xl bg-white shadow-xs border border-black/[0.08] hover:border-black/15 backdrop-blur-xl cursor-pointer transition-all duration-200 space-y-4 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#007E93] transition-colors">
                    {camp.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{camp.objective}</p>
                </div>
                <Badge
                  variant={camp.health === 'Healthy' ? 'success' : 'warning'}
                  size="sm"
                  dot
                >
                  {camp.health === 'Healthy' ? 'On track' : 'Attention'}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Progress</span>
                  <span className="font-mono">{camp.progress}%</span>
                </div>
                <Progress value={camp.progress} size="sm" color="brand" />
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-zinc-200/60 text-zinc-500">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Creators</span>
                  <span className="font-mono text-zinc-800">
                    {camp.creators.confirmed} / {camp.creators.target}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Content</span>
                  <span className="font-mono text-zinc-800">
                    {camp.content.submitted} / {camp.content.target}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Budget Spent</span>
                  <span className="font-mono text-zinc-800">
                    ₹{(camp.budgetSpent / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. "AI INSIGHTS" (Only Useful Contextual Recommendations) */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#007E93]" />
          <span>AI insights</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-[#00B4D8]/20 hover:border-[#00B4D8]/40 backdrop-blur-xl transition-all duration-200 space-y-1.5 text-xs">
            <span className="font-semibold text-zinc-800 block">
              Optimal Publishing Window: Mumbai Cohort
            </span>
            <p className="text-zinc-500 leading-relaxed font-light">
              Historical drop data indicates engagement lifts by 22% when sneaker reels are scheduled between 6:30 PM - 8:30 PM IST on Thursdays.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-[#00B4D8]/20 hover:border-[#00B4D8]/40 backdrop-blur-xl transition-all duration-200 space-y-1.5 text-xs">
            <span className="font-semibold text-zinc-800 block">
              Deliverable Velocity Recommendation
            </span>
            <p className="text-zinc-500 leading-relaxed font-light">
              2 creators in Summer Collection have drafts ready. Approving by Friday locks in weekend algorithmic surge for the product link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
