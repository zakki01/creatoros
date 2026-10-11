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
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

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

  // Opportunities: outreach items where stage is Contacted or Interested
  const incomingOpportunities = outreachItems.filter(
    (i) => i.creatorId === currentCreator.id && (i.stage === 'Contacted' || i.stage === 'Interested')
  );

  // Active accepted campaigns
  const activeCampaignItems = outreachItems.filter(
    (i) => i.creatorId === currentCreator.id && i.stage === 'Confirmed'
  );

  // Creator's payments
  const creatorPayments = payments.filter((p) => p.creatorId === currentCreator.id);
  const paidEarnings = creatorPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingEarnings = creatorPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const upcomingEarnings = creatorPayments
    .filter((p) => p.status === 'upcoming')
    .reduce((sum, p) => sum + p.amount, 0);

  // Content counts
  const creatorSubmissions = submissions.filter((s) => s.creatorId === currentCreator.id);
  const draftsCount = creatorSubmissions.filter(
    (s) => s.status === 'draft' || s.status === 'changes_requested'
  ).length || 1;
  const pendingApprovalCount = creatorSubmissions.filter((s) => s.status === 'submitted').length || 1;
  const approvedCount = creatorSubmissions.filter((s) => s.status === 'approved').length || 2;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header with Verified Status & Uniform Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 font-display tracking-tight">
              Good morning, {currentCreator.name}
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CreatorOS Verified</span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Reputation: 96/100 • 3 Active Contracts • Escrow Protected
          </p>
        </div>

        {/* Uniform Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Video className="w-4 h-4 text-indigo-400" />}
            onClick={() => onNavigate('live')}
            className="border-indigo-500/30 hover:border-indigo-500/60 text-zinc-200 cursor-pointer"
          >
            Live Studio
          </Button>
          <Button
            variant="outline"
            size="md"
            leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
            onClick={() => onNavigate('passport')}
            className="border-zinc-800 hover:border-zinc-700 text-zinc-200 cursor-pointer"
          >
            Passport
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onOpenSubmissionModal}
            className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20 text-white cursor-pointer"
          >
            Submit Draft
          </Button>
        </div>
      </div>

      {/* Visual Live Studio Banner */}
      <div
        className="glass-bento p-5 sm:p-6 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-zinc-950/80 to-zinc-950/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-200 group"
        onClick={() => onNavigate('live')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">Live Studio</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Realtime
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-medium mt-0.5">
              AI-powered live creation
            </p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Create • Record • Submit
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-xs shadow-indigo-600/20 cursor-pointer"
        >
          Open Studio →
        </Button>
      </div>

      {/* Top 5 Bento Quick Stats: Opportunities, Earnings, Content, Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bento 1: Opportunities */}
        <div
          className="glass-bento p-5 border border-indigo-500/25 bg-gradient-to-br from-indigo-950/30 to-zinc-950/90 rounded-2xl space-y-3 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer"
          onClick={() => onNavigate('opportunities')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Invitations
            </span>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-100 font-display">
              {Math.max(1, incomingOpportunities.length)} New Opportunity
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Nike Summer Launch • ₹45,000
            </p>
          </div>
          <div className="flex items-center text-xs text-indigo-400 font-medium gap-1 pt-1">
            <span>Review offers →</span>
          </div>
        </div>

        {/* Bento 2: Content Pipeline */}
        <div
          className="glass-bento p-5 border border-white/10 bg-zinc-950/70 rounded-2xl space-y-3 hover:border-white/20 transition-all duration-200 cursor-pointer"
          onClick={() => onNavigate('content')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Content Pipeline
            </span>
            <Film className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5">
              <span className="text-lg font-bold font-mono text-zinc-200">{draftsCount}</span>
              <p className="text-[10px] text-zinc-400 mt-0.5">Drafts</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-lg font-bold font-mono text-amber-400">{pendingApprovalCount}</span>
              <p className="text-[10px] text-amber-300 mt-0.5">Pending</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-lg font-bold font-mono text-emerald-400">{approvedCount}</span>
              <p className="text-[10px] text-emerald-300 mt-0.5">Approved</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-zinc-300 font-medium gap-1">
            <span>View all deliverables →</span>
          </div>
        </div>

        {/* Bento 3: Earnings Breakdown */}
        <div
          className="glass-bento p-5 border border-emerald-500/25 bg-gradient-to-br from-emerald-950/30 to-zinc-950/90 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer"
          onClick={() => onNavigate('earnings')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Earnings
            </span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-100 font-mono">
              ₹{(pendingEarnings || 82000).toLocaleString()}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Available: <span className="text-emerald-400 font-mono font-medium">₹{(paidEarnings || 127500).toLocaleString()}</span>
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1">
            <span>Pending Escrow</span>
            <span className="text-emerald-400 font-medium">Payout details →</span>
          </div>
        </div>

        {/* Bento 4: Performance Analytics */}
        <div
          className="glass-bento p-5 border border-white/10 bg-zinc-950/70 rounded-2xl space-y-3 hover:border-white/20 transition-all duration-200 cursor-pointer"
          onClick={() => onNavigate('analytics')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Analytics
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-100 font-mono">
              1.37M
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-emerald-400 font-mono font-medium">+24% reach</span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-300 font-mono">5.4% eng</span>
            </div>
          </div>
          <div className="flex items-center text-xs text-zinc-300 font-medium gap-1 pt-1">
            <span>View performance →</span>
          </div>
        </div>
      </div>

      {/* Active Campaigns Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-bold text-zinc-100 font-display">Active Campaigns</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('campaigns')}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            All Campaigns ({activeCampaignItems.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCampaignItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-200 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">{item.campaignName}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Brand: <span className="text-zinc-200 font-medium">Aura Streetwear Co.</span>
                  </p>
                </div>
                <Badge variant="success" size="sm" dot>
                  Active
                </Badge>
              </div>

              {/* Progress Milestones */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-[11px]">Current Milestone</span>
                  <span className="font-semibold text-emerald-400 text-[11px]">Content Draft Review</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-2/3" />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Signed
                  </span>
                  <span className="text-amber-400 font-medium">Draft Review (Now)</span>
                  <span>Payout Release</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-mono text-[11px]">Due in 48 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-200 font-mono font-semibold">
                    ₹{item.proposedFee.toLocaleString()}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onOpenSubmissionModal}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                  >
                    Submit Draft
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Reputation Snapshot */}
      <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Platform Reputation Score: 96 / 100</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Verified across {currentCreator.pastCampaignsCount} completed brand deliverables.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('passport')}
            className="text-xs cursor-pointer border-zinc-800 text-zinc-300"
          >
            Passport Breakdown
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { label: 'On-Time Delivery', score: currentCreator.reliabilityMetrics.onTimeDelivery },
            { label: 'Brief Compliance', score: currentCreator.reliabilityMetrics.briefCompliance },
            { label: 'Communication', score: currentCreator.reliabilityMetrics.communication },
            { label: 'Content Quality', score: currentCreator.reliabilityMetrics.contentQuality },
            { label: 'Campaign ROAS Lift', score: currentCreator.reliabilityMetrics.campaignPerformance },
          ].map((m, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-center"
            >
              <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-wide">{m.label}</p>
              <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                {m.score}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
