import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Check,
  ShieldCheck,
  Plus,
  FileText,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { OutreachItem } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Tabs } from '../ui/Tabs';
import { Modal } from '../ui/Modal';

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
  onNavigateToCreators?: () => void;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({
  campaignId,
  onBack,
  onNavigateToCreators,
}) => {
  const {
    campaigns,
    creators,
    submissions,
    outreachItems,
    approveContent,
    requestChanges,
    sendOutreachMessage,
    triggerCelebration,
  } = useAppState();

  const campaign = campaigns.find((c) => c.id === campaignId) || campaigns[0];
  const [activeTab, setActiveTab] = useState('overview');

  // Submissions for this campaign
  const campaignSubmissions = submissions.filter((s) => s.campaignId === campaign.id);
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Outreach for this campaign
  const campaignOutreach = outreachItems.filter((o) => o.campaignId === campaign.id);
  const [selectedOutreach, setSelectedOutreach] = useState<OutreachItem | null>(null);
  const [outreachReply, setOutreachReply] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'creators', label: `Creators (${campaign.creators.confirmed}/${campaign.creators.target})` },
    { id: 'content', label: `Content (${campaignSubmissions.length})` },
    { id: 'timeline', label: 'Timeline' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'payments', label: 'Payments' },
    { id: 'messages', label: `Messages (${campaignOutreach.length})` },
    { id: 'settings', label: 'Settings' },
  ];

  const handleApproveSub = (subId: string) => {
    approveContent(subId, reviewFeedback || 'Approved for rollout.');
    setReviewFeedback('');
    triggerCelebration();
  };

  const handleRequestChangesSub = (subId: string) => {
    if (!reviewFeedback.trim()) {
      alert('Please provide feedback notes explaining the revision needed.');
      return;
    }
    requestChanges(subId, reviewFeedback);
    setReviewFeedback('');
  };

  const handleSendMessage = () => {
    if (!selectedOutreach || !outreachReply.trim()) return;
    sendOutreachMessage(selectedOutreach.id, 'brand', outreachReply);
    setOutreachReply('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Campaigns</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 font-display">
              {campaign.name}
            </h1>
            <Badge
              variant={campaign.health === 'Healthy' ? 'success' : 'warning'}
              size="sm"
              dot
            >
              {campaign.health === 'Healthy' ? 'On track' : 'Needs attention'}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400">
            {campaign.objective} • Ends {campaign.timeline.endDate}
          </p>
        </div>

        {/* Quick Campaign Action */}
        <div className="flex items-center gap-2">
          {onNavigateToCreators && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToCreators}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Add Creators
            </Button>
          )}
        </div>
      </div>

      {/* Campaign Summary Strip (Requested: Budget, Creators, Content, Published, Revenue) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <div>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Budget</span>
          <span className="text-sm font-semibold font-mono text-zinc-200 mt-0.5 block">
            ₹{(campaign.budgetSpent / 100000).toFixed(1)}L / ₹{(campaign.budgetTotal / 100000).toFixed(1)}L
          </span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Creators</span>
          <span className="text-sm font-semibold font-mono text-zinc-200 mt-0.5 block">
            {campaign.creators.confirmed} <span className="text-zinc-500 text-xs font-normal">/ {campaign.creators.target}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Content</span>
          <span className="text-sm font-semibold font-mono text-zinc-200 mt-0.5 block">
            {campaign.content.submitted} <span className="text-zinc-500 text-xs font-normal">/ {campaign.content.target}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Published</span>
          <span className="text-sm font-semibold font-mono text-zinc-200 mt-0.5 block">
            {campaign.published.published} <span className="text-zinc-500 text-xs font-normal">/ {campaign.published.target}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Revenue</span>
          <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block">
            ₹{(campaign.revenueGenerated / 100000).toFixed(1)}L
          </span>
        </div>
      </div>

      {/* Campaign Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Progress */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-300 font-medium">Campaign Overall Progress</span>
              <span className="font-mono font-semibold text-zinc-200">{campaign.progress}%</span>
            </div>
            <Progress value={campaign.progress} size="md" color="brand" />
          </div>

          {/* Contextual AI Insight Card (As specified in prompt) */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-indigo-300">Campaign AI Insight</span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {campaign.aiInsight}
              </p>
            </div>
          </div>

          {/* Audience & Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Target Audience
              </h3>
              <div className="space-y-2 text-xs text-zinc-400">
                <p>• <strong>Locations:</strong> {campaign.targetAudience.location.join(', ')}</p>
                <p>• <strong>Age Range:</strong> {campaign.targetAudience.ageRange}</p>
                <p>• <strong>Affinity / Interests:</strong> {campaign.targetAudience.interests.join(', ')}</p>
                <p>• <strong>Languages:</strong> {campaign.targetAudience.language}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Creative Guidelines
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {campaign.brandGuidelines}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {campaign.platforms.map((p) => (
                  <span key={p} className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CREATORS */}
      {activeTab === 'creators' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Creators assigned and confirmed for {campaign.name}.
            </p>
            {onNavigateToCreators && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToCreators}
                className="text-xs"
              >
                Discover More Creators
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creators.slice(0, 4).map((creator) => (
              <div
                key={creator.id}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700/60"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-zinc-200">{creator.name}</h4>
                      {creator.verified && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono">@{creator.handle}</p>
                    <p className="text-[11px] text-zinc-400">{creator.location}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-zinc-200">
                      ${(creator.estimatedRate).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      {creator.reliabilityMetrics.onTimeDelivery}% on-time
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      window.history.pushState(
                        {},
                        '',
                        `/brand/contracts/new?creatorId=${creator.id}&campaignId=${campaign.id}`
                      );
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="min-h-[36px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-indigo-600/30"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Create Contract</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Conversations & Contract Negotiations for this campaign</span>
          </div>

          <div className="space-y-3">
            {campaignOutreach.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedOutreach(item)}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.creator.avatar}
                    alt={item.creator.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">{item.creator.name}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Next: <span className="text-zinc-300">{item.nextAction}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-zinc-200">
                    ₹{item.proposedFee.toLocaleString()}
                  </span>
                  <Badge variant="brand" size="sm">
                    {item.stage}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-xs text-indigo-400">
                    Open Thread
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONTENT & APPROVALS (With AI Brief Check) */}
      {activeTab === 'content' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Creator video & image draft submissions for review</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {campaignSubmissions.map((sub) => (
              <Card key={sub.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={sub.creatorAvatar}
                      alt={sub.creatorName}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-zinc-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{sub.creatorName}</h4>
                      <p className="text-[11px] text-zinc-500 font-mono">@{sub.creatorHandle}</p>
                    </div>
                  </div>
                  <Badge
                    variant={sub.status === 'approved' ? 'success' : 'warning'}
                    size="sm"
                    dot
                  >
                    {sub.status === 'approved' ? 'Approved' : 'Needs Review'}
                  </Badge>
                </div>

                <p className="text-xs font-semibold text-zinc-100">{sub.title}</p>

                {/* AI Brief Check Checklist (As specified in prompt) */}
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs space-y-1.5">
                  <span className="font-semibold text-zinc-300 text-[11px] uppercase tracking-wider block">
                    AI Brief Check
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      {sub.aiPreCheck.productVisible ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>Product Visible</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      {sub.aiPreCheck.brandMention ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>Brand Tagged</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      {sub.aiPreCheck.requiredCta ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>Required CTA</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      {sub.aiPreCheck.durationCompliant ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>Duration Valid</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <span className="text-[11px] text-zinc-500 font-mono">{sub.deliverableType}</span>
                  {sub.status !== 'approved' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRequestChangesSub(sub.id)}
                        className="text-xs"
                      >
                        Request Changes
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveSub(sub.id)}
                        className="text-xs"
                      >
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Approved for Publishing</span>
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Execution Roadmap
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { phase: '1. Discovery & Selection', status: 'Completed', date: 'Sept 01 - Sept 08' },
                { phase: '2. Outreach & Smart Contracts', status: 'Completed', date: 'Sept 09 - Sept 18' },
                { phase: '3. Physical Product Seeding', status: 'Completed', date: 'Sept 19 - Sept 24' },
                { phase: '4. Content Submission & AI Pre-Checks', status: 'Active (2 days remaining)', date: 'Sept 25 - Oct 10' },
                { phase: '5. Publishing Wave', status: 'Upcoming', date: 'Oct 12 - Oct 24' },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between"
                >
                  <span className="font-medium text-zinc-200">{p.phase}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-mono text-[11px]">{p.date}</span>
                    <Badge variant={p.status.includes('Completed') ? 'success' : p.status.includes('Active') ? 'brand' : 'neutral'} size="sm">
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase">Tracked Reach</span>
              <p className="text-lg font-bold font-mono text-zinc-100 mt-0.5">2.42M</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase">Avg CTR</span>
              <p className="text-lg font-bold font-mono text-zinc-100 mt-0.5">3.6%</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase">Effective CPA</span>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">₹228</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase">Blended ROAS</span>
              <p className="text-lg font-bold font-mono text-indigo-400 mt-0.5">3.82x</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PAYMENTS & ESCROW */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">Allocated Campaign Budget</span>
              <p className="text-xl font-bold font-mono text-zinc-100">₹{campaign.budgetTotal.toLocaleString()}</p>
              <span className="text-[10px] text-zinc-500 font-mono">100% Escrow Funded</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] font-mono text-emerald-400 uppercase">Disbursed Milestones</span>
              <p className="text-xl font-bold font-mono text-emerald-400">₹{campaign.budgetSpent.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-500/80 font-mono">Released to Creators</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
              <span className="text-[11px] font-mono text-amber-400 uppercase">Pending In Escrow</span>
              <p className="text-xl font-bold font-mono text-amber-400">₹{(campaign.budgetTotal - campaign.budgetSpent).toLocaleString()}</p>
              <span className="text-[10px] text-amber-500/80 font-mono">Awaiting Review Approval</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200">Creator Milestone Payouts</h3>
              <Badge variant="brand" size="sm">Smart Escrow Locked</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              {creators.slice(0, 3).map((creator, idx) => {
                const milestoneAmount = idx === 0 ? 35000 : idx === 1 ? 40000 : 30000;
                const isPaid = idx === 1;
                return (
                  <div key={creator.id} className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={creator.avatar} alt={creator.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-700" />
                      <div>
                        <h4 className="font-semibold text-zinc-200">{creator.name}</h4>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          Deliverable: {idx === 0 ? '1 Reel + 2 Stories' : idx === 1 ? '1 Skit Reel' : '1 Reel Draft'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-100">₹{milestoneAmount.toLocaleString()}</span>
                      {isPaid ? (
                        <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Disbursed
                        </span>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            triggerCelebration();
                            alert(`Escrow payout of ₹${milestoneAmount.toLocaleString()} released to ${creator.name}`);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-xs text-white cursor-pointer"
                        >
                          Release Payout
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SETTINGS & STRATEGY */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Campaign Parameters & Governance</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Configure campaign briefing, legal agreements, and simulated creator mix.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <span className="font-semibold text-zinc-200 block">Brief Objective</span>
                <p className="text-zinc-400">{campaign.objective}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <span className="font-semibold text-zinc-200 block">Category & Niches</span>
                <div className="flex flex-wrap gap-1.5">
                  {(campaign.targetAudience?.interests || ['Sneakers', 'Streetwear', 'Fashion']).map((cat: string) => (
                    <span key={cat} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Architecture Simulation */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                AI Strategic Campaign Architecture
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: 'Scenario A: 20 Micro Creators', reach: '850K - 1.4M', cpa: '₹220 - ₹280', note: 'Best for direct ROAS' },
                  { title: 'Scenario B: 5 Mid-Tier Creators', reach: '1.3M - 2.0M', cpa: '₹270 - ₹340', note: 'Best for brand prestige' },
                  { title: 'Scenario C: Hybrid (Adopted)', reach: '2.2M - 3.6M', cpa: '₹240 - ₹310', note: 'Balanced flagship hype' },
                ].map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5 text-xs">
                    <span className="font-semibold text-zinc-200">{s.title}</span>
                    <div className="text-[11px] text-zinc-400 space-y-0.5 font-mono">
                      <p>Reach: {s.reach}</p>
                      <p>CPA: {s.cpa}</p>
                    </div>
                    <span className="text-[10px] text-indigo-400 block pt-1">{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outreach Message Thread Modal */}
      {selectedOutreach && (
        <Modal
          isOpen={!!selectedOutreach}
          onClose={() => setSelectedOutreach(null)}
          title={`Conversation: ${selectedOutreach.creator.name}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 max-h-60 overflow-y-auto">
              {selectedOutreach.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'brand' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-xl leading-relaxed ${
                      m.sender === 'brand'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <p>{m.message}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">{m.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={outreachReply}
                onChange={(e) => setOutreachReply(e.target.value)}
                placeholder="Type reply to creator..."
                className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500"
              />
              <Button variant="primary" size="sm" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
