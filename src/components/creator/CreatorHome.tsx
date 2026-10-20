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
  } = useAppState();

  const currentCreator = creators[0]; // Rohan Sharma by default

  const incomingOpportunities = outreachItems.filter(
    (i) => i.creatorId === currentCreator.id && (i.stage === 'Contacted' || i.stage === 'Interested')
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
  ).length || 1;
  const pendingApprovalCount = creatorSubmissions.filter((s) => s.status === 'submitted').length || 1;
  const approvedCount = creatorSubmissions.filter((s) => s.status === 'approved').length || 2;

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
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                {currentCreator.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/12 text-emerald-300 border border-emerald-500/30 shadow-[0_0_16px_-4px_rgba(16,185,129,0.4)]">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                96 Reputation
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {currentCreator.niche} · {currentCreator.location}
            </p>
          </div>
        </div>

        {/* Clean Tactile Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
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
        {/* Hero Feature Card: Live Studio (3D visual object + action) */}
        <SpatialCard
          surface={3}
          tilt
          glare
          glowColor="indigo"
          onClick={() => onNavigate('live')}
          className="lg:col-span-7 p-6 sm:p-7 bg-gradient-to-br from-indigo-950/55 via-[#131320]/90 to-[#0B0B12]/95 border-indigo-500/30 group"
        >
          {/* Ambient radial 3D studio light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all duration-300"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 h-full">
            <div className="space-y-3 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>3D AI Environment</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                  Live Studio
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                  Create in real time
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
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-indigo-500/15 to-purple-500/5 border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_20px_40px_-12px_rgba(0,0,0,0.8)] flex items-center justify-center animate-float-slow">
                <svg
                  viewBox="0 0 120 120"
                  className="w-24 h-24 drop-shadow-[0_14px_24px_rgba(99,102,241,0.45)] group-hover:scale-105 transition-transform duration-300"
                >
                  <defs>
                    <linearGradient id="heroCamBody" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4338ca" />
                      <stop offset="55%" stopColor="#1e1b4b" />
                      <stop offset="100%" stopColor="#09090b" />
                    </linearGradient>
                    <linearGradient id="heroCamLens" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a5b4fc" />
                      <stop offset="45%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#1e1b4b" />
                    </linearGradient>
                    <linearGradient id="heroRim" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="60" cy="102" rx="34" ry="5" fill="rgba(0,0,0,0.55)" />
                  <rect x="26" y="28" width="68" height="50" rx="15" fill="url(#heroCamBody)" stroke="url(#heroRim)" strokeWidth="1.5" transform="rotate(-5 60 53)" />
                  <rect x="20" y="34" width="78" height="54" rx="16" fill="url(#heroCamBody)" stroke="url(#heroRim)" strokeWidth="1.5" />
                  <rect x="34" y="25" width="24" height="10" rx="5" fill="#4f46e5" stroke="url(#heroRim)" strokeWidth="1.2" />
                  <circle cx="59" cy="61" r="20" fill="#07070A" stroke="url(#heroRim)" strokeWidth="2" />
                  <circle cx="59" cy="61" r="14" fill="url(#heroCamLens)" />
                  <circle cx="54" cy="56" r="4.5" fill="rgba(255,255,255,0.65)" />
                  <circle cx="64" cy="66" r="2" fill="rgba(199,210,254,0.55)" />
                  <circle cx="84" cy="44" r="3.5" fill="#34d399" />
                </svg>
              </div>
            </div>
          </div>
        </SpatialCard>

        {/* Contract Activity Card (Spatial Surface 3) */}
        <SpatialCard
          surface={3}
          tilt
          glare
          glowColor="amber"
          onClick={() => onNavigate('contracts')}
          className="lg:col-span-5 p-6 flex flex-col justify-between gap-4 border-amber-500/25"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shadow-[0_0_20px_-4px_rgba(245,158,11,0.35)] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-500/12 px-2 py-0.5 rounded-full border border-amber-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Awaiting Signature
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Aura Streetwear Co.
                </h3>
              </div>
            </div>
            <span className="text-lg font-bold font-mono text-emerald-400">$1,500</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.07]">
            <span className="text-xs text-zinc-400 font-mono">Summer Capsule · 2 Deliverables</span>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('contracts');
              }}
            >
              Review
            </Button>
          </div>
        </SpatialCard>
      </div>

      {/* Key Spatial Cards Grid: Opportunity, Content Pipeline, Earnings, Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Opportunity */}
        <SpatialCard
          surface={2}
          tilt
          glare
          glowColor="indigo"
          onClick={() => onNavigate('opportunities')}
          className="p-5 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-semibold">
              Opportunity
            </span>
            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)] animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-display">
              {Math.max(1, incomingOpportunities.length)} New
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 truncate">
              Nike Summer Launch · ₹45,000
            </p>
          </div>
          <div className="flex items-center text-xs text-indigo-300 font-medium gap-1 pt-1">
            <span>View offer →</span>
          </div>
        </SpatialCard>

        {/* Card 2: Content Pipeline */}
        <SpatialCard
          surface={2}
          tilt
          glare
          onClick={() => onNavigate('content')}
          className="p-5 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Content Pipeline
            </span>
            <Film className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-0.5 text-center">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <span className="text-base font-bold font-mono text-white">{draftsCount}</span>
              <p className="text-[10px] text-zinc-400">Drafts</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25">
              <span className="text-base font-bold font-mono text-amber-300">{pendingApprovalCount}</span>
              <p className="text-[10px] text-amber-300">Pending</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <span className="text-base font-bold font-mono text-emerald-300">{approvedCount}</span>
              <p className="text-[10px] text-emerald-300">Approved</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-zinc-300 font-medium gap-1">
            <span>Deliverables →</span>
          </div>
        </SpatialCard>

        {/* Card 3: Earnings */}
        <SpatialCard
          surface={2}
          tilt
          glare
          glowColor="emerald"
          onClick={() => onNavigate('earnings')}
          className="p-5 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
              Earnings
            </span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-mono">
              ₹{(pendingEarnings || 82000).toLocaleString()}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Available: <span className="text-emerald-400 font-mono font-medium">₹{(paidEarnings || 127500).toLocaleString()}</span>
            </p>
          </div>
          <div className="flex items-center text-xs text-emerald-300 font-medium gap-1 pt-1">
            <span>Payouts →</span>
          </div>
        </SpatialCard>

        {/* Card 4: Analytics */}
        <SpatialCard
          surface={2}
          tilt
          glare
          glowColor="sky"
          onClick={() => onNavigate('analytics')}
          className="p-5 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Reach
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-mono">
              1.37M
            </h3>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">
              +24% reach · 5.4% eng
            </p>
          </div>
          <div className="flex items-center text-xs text-zinc-300 font-medium gap-1 pt-1">
            <span>Analytics →</span>
          </div>
        </SpatialCard>
      </div>

      {/* Active Campaigns Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-display">Active Campaigns</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCampaignItems.map((item) => (
            <SpatialCard
              key={item.id}
              surface={2}
              glare
              className="p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{item.campaignName}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Aura Streetwear Co.
                  </p>
                </div>
                <Badge variant="success" size="sm" dot>
                  Active
                </Badge>
              </div>

              {/* Dimensional Milestone Bar */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-[11px]">Milestone</span>
                  <span className="font-semibold text-emerald-400 text-[11px]">Draft Review</span>
                </div>
                <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full w-2/3 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Signed
                  </span>
                  <span className="text-amber-300 font-medium">Review</span>
                  <span>Payout</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-mono text-[11px]">48h left</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-mono font-semibold">
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
      </div>
    </div>
  );
};

