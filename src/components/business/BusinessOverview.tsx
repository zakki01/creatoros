import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  Users,
  Film,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Avatar } from '../ui/Avatar';

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
    outreachItems,
    resolveAttentionItem,
  } = useAppState();

  const activeAttention = attentionItems.filter((i) => !i.resolved);
  const pendingApprovals = submissions.filter((s) => s.status === 'submitted');
  const activeCampaigns = campaigns.filter((c) => c.status === 'Active');

  const totalSpent = campaigns.reduce((sum, c) => sum + (c.budgetSpent || 0), 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budgetTotal || 0), 0);

  // An account is first-time if there are no campaigns and no active outreach
  const isFirstTimeBrand = campaigns.length === 0 && outreachItems.length === 0;

  const handleAttentionAction = (item: typeof attentionItems[0]) => {
    if (item.actionType === 'review' || item.actionType === 'send_reminder' || item.actionType === 'view_campaign') {
      onOpenCampaign(item.campaignId);
    } else {
      resolveAttentionItem(item.id);
    }
  };

  // Determine dynamic greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-16 text-[var(--text-primary)]">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER SECTION
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)] font-display tracking-tight">
            {greeting}, {workspace.name}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {isFirstTimeBrand
              ? "Find creators, launch a campaign & manage everything from one workspace."
              : "Here is what needs your attention today across active campaigns and creators."}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('discover')}
            leftIcon={<Compass className="w-3.5 h-3.5" />}
            className="text-xs min-h-[44px] justify-center"
          >
            Discover Creators
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreateCampaign}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs min-h-[44px] justify-center"
          >
            Create Campaign
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FIRST-TIME BRAND ONBOARDING WORKSPACE
         ───────────────────────────────────────────────────────────── */}
      {isFirstTimeBrand && (
        <div className="space-y-6">
          {/* Welcome Hero / Primary Task Callout */}
          <div className="p-5 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="max-w-xl space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Welcome to CreatorOS</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display">
                Let's get your first campaign started.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Connect with verified creators, define deliverables, track submissions, and handle milestone contracts with complete transparency.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 pt-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                onClick={onOpenCreateCampaign}
                leftIcon={<Plus className="w-4 h-4" />}
                className="text-xs font-semibold min-h-[44px] justify-center"
              >
                Create Campaign
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate('discover')}
                leftIcon={<Compass className="w-4 h-4" />}
                className="text-xs min-h-[44px] justify-center"
              >
                Discover Creators
              </Button>
            </div>
          </div>

          {/* Calm, Linear Onboarding Progress Checklist */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Getting Started
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Follow these 5 steps to launch your first creator collaboration.
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                1 of 5 completed
              </span>
            </div>

            <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[var(--accent)] h-full w-1/5 rounded-full transition-all duration-300" />
            </div>

            <div className="space-y-2 pt-1">
              {/* Step 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)]/60 text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium text-[var(--text-primary)]">Create your brand profile</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-500 font-semibold">Done</span>
              </div>

              {/* Step 2 */}
              <div
                onClick={() => onNavigate('discover')}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs cursor-pointer transition-colors group min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <Circle className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                  <span className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Discover creators
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors font-mono">
                  <span>Explore talent</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 3 */}
              <div
                onClick={onOpenCreateCampaign}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs cursor-pointer transition-colors group min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <Circle className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                  <span className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Create your first campaign
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors font-mono">
                  <span>Build brief</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 4 */}
              <div
                onClick={() => onNavigate('discover')}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs cursor-pointer transition-colors group min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <Circle className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                  <span className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Invite a creator
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors font-mono">
                  <span>Send invite</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]/60 text-xs opacity-75 min-h-[44px]">
                <div className="flex items-center gap-3">
                  <Circle className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  <span className="text-[var(--text-secondary)]">Start your first collaboration</span>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">Automatic</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. ACTIVE ACCOUNT: COMPACT METRICS STRIP (REPLACES 4 GIANT CARDS)
         ───────────────────────────────────────────────────────────── */}
      {!isFirstTimeBrand && (
        <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)]/60 flex flex-col justify-between">
              <span className="text-[10px] sm:text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">
                Active Campaigns
              </span>
              <span className="text-lg sm:text-2xl font-bold font-mono text-[var(--text-primary)] mt-1 block">
                {activeCampaigns.length}
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)]/60 flex flex-col justify-between">
              <span className="text-[10px] sm:text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">
                Creators in Roster
              </span>
              <span className="text-lg sm:text-2xl font-bold font-mono text-[var(--text-primary)] mt-1 block">
                {creators.length}
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)]/60 flex flex-col justify-between">
              <span className="text-[10px] sm:text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">
                Pending Approvals
              </span>
              <span className="text-lg sm:text-2xl font-bold font-mono text-[var(--accent)] mt-1 block">
                {pendingApprovals.length}
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)]/60 flex flex-col justify-between">
              <span className="text-[10px] sm:text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">
                Budget / Spend
              </span>
              <span className="text-lg sm:text-2xl font-bold font-mono text-[var(--text-primary)] mt-1 block">
                ₹{(totalSpent / 100000).toFixed(1)}L{' '}
                <span className="text-xs text-[var(--text-muted)] font-normal">
                  / ₹{(totalBudget / 100000).toFixed(1)}L
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. "NEEDS YOUR ATTENTION" (ONLY WHEN ITEMS EXIST)
         ───────────────────────────────────────────────────────────── */}
      {!isFirstTimeBrand && activeAttention.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Needs your attention
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {activeAttention.length} active
            </span>
          </div>

          <div className="space-y-2">
            {activeAttention.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] shadow-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-[var(--surface-muted)] text-[var(--text-secondary)] text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[var(--border)]">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        {item.title}
                      </h3>
                      {item.campaignName && (
                        <span className="text-[10px] text-[var(--text-muted)] font-mono bg-[var(--surface-muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                          {item.campaignName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t border-[var(--border)]/40 sm:border-t-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resolveAttentionItem(item.id)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer min-h-[40px]"
                  >
                    Resolve
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAttentionAction(item)}
                    className="text-xs cursor-pointer min-h-[40px]"
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
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. CAMPAIGNS SECTION
         ───────────────────────────────────────────────────────────── */}
      {!isFirstTimeBrand && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Your campaigns
            </h2>
            <button
              onClick={() => onNavigate('campaigns')}
              className="text-xs text-[var(--accent)] hover:underline transition-colors cursor-pointer font-medium"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => onOpenCampaign(camp.id)}
                className="p-5 rounded-2xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] shadow-xs cursor-pointer transition-all duration-200 space-y-4 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {camp.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">{camp.objective}</p>
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
                  <div className="flex justify-between text-xs text-[var(--text-muted)]">
                    <span>Progress</span>
                    <span className="font-mono text-[var(--text-primary)]">{camp.progress}%</span>
                  </div>
                  <Progress value={camp.progress} size="sm" color="brand" />
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-[var(--border)] text-[var(--text-muted)]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Creators</span>
                    <span className="font-mono text-[var(--text-primary)] font-semibold">
                      {camp.creators.confirmed} / {camp.creators.target}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Content</span>
                    <span className="font-mono text-[var(--text-primary)] font-semibold">
                      {camp.content.submitted} / {camp.content.target}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Budget Spent</span>
                    <span className="font-mono text-[var(--text-primary)] font-semibold">
                      ₹{(camp.budgetSpent / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. DISCOVERY PREVIEW: REAL PLATFORM CREATORS
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Verified Creator Network</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Browse top talent available for instant collaboration and campaign deliverables.
            </p>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs text-[var(--accent)] hover:underline transition-colors cursor-pointer font-medium"
          >
            Explore all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {creators.slice(0, 3).map((creator) => (
            <div
              key={creator.id}
              onClick={() => onNavigate('discover')}
              className="p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] shadow-xs transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-[var(--border)] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                      {creator.name}
                    </span>
                    {creator.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] truncate font-mono">
                    @{creator.handle}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] truncate">
                    {creator.category}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold font-mono text-[var(--text-primary)] block">
                  {creator.engagementRate || '4.2%'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Eng</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
