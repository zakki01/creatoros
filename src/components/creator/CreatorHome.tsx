import React from 'react';
import {
  Clock,
  CheckCircle2,
  CreditCard,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Plus,
  Video,
  Film,
  Layers,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { SpatialCard } from '../ui/SpatialCard';
import { Creator } from '../../types';

interface CreatorHomeProps {
  onNavigate: (tab: string) => void;
  onOpenSubmissionModal: () => void;
}

export const CreatorHome: React.FC<CreatorHomeProps> = ({
  onNavigate,
  onOpenSubmissionModal,
}) => {
  const {
    outreachItems,
    payments,
    submissions,
    creators,
    authUser,
    userProfile,
  } = useAppState();

  const currentCreator: Creator =
    creators.find((c) => c.id === userProfile.id || c.id === authUser?.id) ||
    creators[0] || {
      id: authUser?.id || 'demo-creator-01',
      name: authUser?.name || 'Creator',
      handle: authUser?.handle || '@creator',
      avatar:
        authUser?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: '',
      category: 'Fashion & Lifestyle',
      location: 'Mumbai',
      niche: 'Creator',
      totalFollowers: 0,
      followers: '0',
      engagementRate: '0%',
      tier: 'Verified Pro',
      verified: true,
      minimumRate: 0,
      estimatedRate: 0,
      availabilityStatus: 'Available',
      availableDates: 'Available Now',
      rates: { reel: 0, story: 0, post: 0, live: 0 },
      platforms: ['Instagram', 'YouTube'],
      metrics: {
        averageViews: '0',
        completionRate: '0%',
        audienceDemographics: { topCountry: 'IN', topAge: '18-24' },
      },
    };

  const incomingOpportunities = outreachItems.filter(
    (i) =>
      i.creatorId === currentCreator.id &&
      (i.stage === 'Contacted' || i.stage === 'Interested')
  );

  const activeCampaignItems = outreachItems.filter(
    (i) => i.creatorId === currentCreator.id && i.stage === 'Confirmed'
  );

  const creatorPayments = payments.filter((p) => p.creatorId === currentCreator.id);
  const paidEarnings = creatorPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingEarnings = creatorPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const creatorSubmissions = submissions.filter((s) => s.creatorId === currentCreator.id);
  const draftsCount = creatorSubmissions.filter(
    (s) => s.status === 'draft' || s.status === 'changes_requested'
  ).length;
  const pendingApprovalCount = creatorSubmissions.filter((s) => s.status === 'submitted').length;
  const approvedCount = creatorSubmissions.filter((s) => s.status === 'approved').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Section: Creator Identity + Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Avatar
            src={currentCreator.avatar}
            name={currentCreator.name}
            size="lg"
            verified
            ring="primary"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
                {currentCreator.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Verified
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {currentCreator.category || currentCreator.niche} · {currentCreator.location}
            </p>
          </div>
        </div>

        {/* Clean Tactile Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            onClick={() => onNavigate('passport')}
          >
            Passport
          </Button>

          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onOpenSubmissionModal}
          >
            Submit Work
          </Button>
        </div>
      </div>

      {/* Hero Row: 3D Live Studio Feature Card + Actionable Contract Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Hero Feature Card: Live Studio */}
        <SpatialCard
          surface={1}
          tilt
          glare
          glowColor="sky"
          onClick={() => onNavigate('live')}
          className="lg:col-span-7 p-6 sm:p-7 group shadow-sm"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 w-64 h-64 rounded-full bg-[var(--primary)]/10 blur-3xl group-hover:bg-[var(--primary)]/18 transition-all duration-300"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 h-full">
            <div className="space-y-3 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                <span>3D AI Environment</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
                  Live Studio
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                  Create and record in real time with spatial AI
                </p>
              </div>
              <div className="pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Video className="w-3.5 h-3.5" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('live');
                  }}
                >
                  Open Studio
                </Button>
              </div>
            </div>

            {/* Expressive 3D Camera / Studio Object */}
            <div className="relative shrink-0 self-center sm:self-auto">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[var(--surface-muted)] border border-[var(--border)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_12px_28px_-8px_rgba(15,23,42,0.14)] flex items-center justify-center animate-float-slow">
                <svg
                  viewBox="0 0 120 120"
                  className="w-24 h-24 drop-shadow-[0_10px_20px_rgba(0,180,216,0.3)] group-hover:scale-105 transition-transform duration-300"
                >
                  <defs>
                    <linearGradient id="heroCamBody" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="55%" stopColor="#0077B6" />
                      <stop offset="100%" stopColor="#023E8A" />
                    </linearGradient>
                    <linearGradient id="heroCamLens" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#CAF0F8" />
                      <stop offset="45%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="#03045E" />
                    </linearGradient>
                    <linearGradient id="heroRim" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="60" cy="102" rx="34" ry="5" fill="rgba(15,23,42,0.18)" />
                  <rect x="26" y="28" width="68" height="50" rx="15" fill="url(#heroCamBody)" stroke="url(#heroRim)" strokeWidth="1.5" transform="rotate(-5 60 53)" />
                  <rect x="20" y="34" width="78" height="54" rx="16" fill="url(#heroCamBody)" stroke="url(#heroRim)" strokeWidth="1.5" />
                  <rect x="34" y="25" width="24" height="10" rx="5" fill="#0096C7" stroke="url(#heroRim)" strokeWidth="1.2" />
                  <circle cx="59" cy="61" r="20" fill="#0B1320" stroke="url(#heroRim)" strokeWidth="2" />
                  <circle cx="59" cy="61" r="14" fill="url(#heroCamLens)" />
                  <circle cx="54" cy="56" r="4.5" fill="rgba(255,255,255,0.75)" />
                  <circle cx="64" cy="66" r="2" fill="rgba(202,240,248,0.65)" />
                  <circle cx="84" cy="44" r="3.5" fill="#10B981" />
                </svg>
              </div>
            </div>
          </div>
        </SpatialCard>

        {/* Contract Activity Card */}
        <SpatialCard
          surface={1}
          tilt
          glare
          glowColor="amber"
          onClick={() => onNavigate('contracts')}
          className="lg:col-span-5 p-6 flex flex-col justify-between gap-4 border border-amber-500/30 shadow-sm"
        >
          {activeCampaignItems.length > 0 ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-500 flex items-center justify-center shadow-xs shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Active Agreement
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">
                      {activeCampaignItems[0].campaignName}
                    </h3>
                  </div>
                </div>
                <span className="text-lg font-bold font-mono text-emerald-500 dark:text-emerald-400">
                  ₹{activeCampaignItems[0].proposedFee.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)] font-mono">Deliverables in Progress</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('contracts');
                  }}
                >
                  View Contract
                </Button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-muted)] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    No active contracts
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Formal brand agreements and escrow releases appear here.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[var(--border)] flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('contracts');
                  }}
                >
                  Contracts Hub
                </Button>
              </div>
            </div>
          )}
        </SpatialCard>
      </div>

      {/* Key Spatial Cards Grid: Opportunity, Content Pipeline, Earnings, Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Opportunity */}
        <SpatialCard
          surface={1}
          tilt
          glare
          glowColor="sky"
          onClick={() => onNavigate('opportunities')}
          className="p-5 flex flex-col justify-between space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              Opportunity
            </span>
            {incomingOpportunities.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-display">
              {incomingOpportunities.length} New
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
              {incomingOpportunities.length > 0
                ? `${incomingOpportunities[0].campaignName} · ₹${incomingOpportunities[0].proposedFee.toLocaleString()}`
                : 'No pending brand invitations'}
            </p>
          </div>
          <div className="flex items-center text-xs text-[var(--accent)] font-medium gap-1 pt-1">
            <span>View opportunities →</span>
          </div>
        </SpatialCard>

        {/* Card 2: Content Pipeline */}
        <SpatialCard
          surface={1}
          tilt
          glare
          onClick={() => onNavigate('content')}
          className="p-5 flex flex-col justify-between space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Content Pipeline
            </span>
            <Film className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-0.5 text-center">
            <div className="p-2 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
              <span className="text-base font-bold font-mono text-[var(--text-primary)]">
                {draftsCount}
              </span>
              <p className="text-[10px] text-[var(--text-muted)]">Drafts</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25">
              <span className="text-base font-bold font-mono text-amber-500 dark:text-amber-400">
                {pendingApprovalCount}
              </span>
              <p className="text-[10px] text-amber-500 dark:text-amber-400">Pending</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <span className="text-base font-bold font-mono text-emerald-500 dark:text-emerald-400">
                {approvedCount}
              </span>
              <p className="text-[10px] text-emerald-500 dark:text-emerald-400">Approved</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium gap-1">
            <span>Deliverables →</span>
          </div>
        </SpatialCard>

        {/* Card 3: Earnings */}
        <SpatialCard
          surface={1}
          tilt
          glare
          glowColor="emerald"
          onClick={() => onNavigate('earnings')}
          className="p-5 flex flex-col justify-between space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-500 dark:text-emerald-400 font-semibold">
              Earnings
            </span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-mono">
              ₹{pendingEarnings.toLocaleString()}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Available: <span className="text-emerald-500 dark:text-emerald-400 font-mono font-medium">₹{paidEarnings.toLocaleString()}</span>
            </p>
          </div>
          <div className="flex items-center text-xs text-emerald-500 dark:text-emerald-400 font-medium gap-1 pt-1">
            <span>Payouts →</span>
          </div>
        </SpatialCard>

        {/* Card 4: Analytics */}
        <SpatialCard
          surface={1}
          tilt
          glare
          glowColor="sky"
          onClick={() => onNavigate('analytics')}
          className="p-5 flex flex-col justify-between space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Reach
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-mono">
              {currentCreator.followers || '0'}
            </h3>
            <p className="text-xs text-emerald-500 dark:text-emerald-400 font-mono mt-0.5">
              {currentCreator.engagementRate || '0%'} engagement
            </p>
          </div>
          <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium gap-1 pt-1">
            <span>Analytics →</span>
          </div>
        </SpatialCard>
      </div>

      {/* Active Campaigns Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-base font-bold text-[var(--text-primary)] font-display">Active Campaigns</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('campaigns')}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="text-xs"
          >
            All ({activeCampaignItems.length})
          </Button>
        </div>

        {activeCampaignItems.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
            No active campaigns. Verified brand campaigns and deliverables appear here once confirmed.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCampaignItems.map((item) => (
              <SpatialCard
                key={item.id}
                surface={1}
                glare
                className="p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{item.campaignName}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Brand Campaign
                    </p>
                  </div>
                  <Badge variant="success" size="sm" dot>
                    Active
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)] text-[11px]">Milestone</span>
                    <span className="font-semibold text-emerald-500 dark:text-emerald-400 text-[11px]">Deliverable Cut</span>
                  </div>
                  <div className="w-full bg-[var(--surface-recessed)] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--primary)] to-emerald-500 h-full rounded-full w-2/3" />
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Signed
                    </span>
                    <span className="text-amber-500 font-medium">Review</span>
                    <span>Payout</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border)]">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="font-mono text-[11px]">In progress</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-primary)] font-mono font-semibold">
                      ₹{item.proposedFee.toLocaleString()}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={onOpenSubmissionModal}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </SpatialCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
