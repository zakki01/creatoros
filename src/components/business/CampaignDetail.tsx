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
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Campaigns</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
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
          <p className="text-xs text-[var(--text-secondary)]">
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)]">
        <div>
          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">Budget</span>
          <span className="text-sm font-semibold font-mono text-[var(--text-primary)] mt-0.5 block">
            ₹{(campaign.budgetSpent / 100000).toFixed(1)}L / ₹{(campaign.budgetTotal / 100000).toFixed(1)}L
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">Creators</span>
          <span className="text-sm font-semibold font-mono text-[var(--text-primary)] mt-0.5 block">
            {campaign.creators.confirmed} <span className="text-[var(--text-muted)] text-xs font-normal">/ {campaign.creators.target}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">Content</span>
          <span className="text-sm font-semibold font-mono text-[var(--text-primary)] mt-0.5 block">
            {campaign.content.submitted} <span className="text-[var(--text-muted)] text-xs font-normal">/ {campaign.content.target}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">Published</span>
          <span className="text-sm font-semibold font-mono text-[var(--text-primary)] mt-0.5 block">
            {campaign.published.published} <span className="text-[var(--text-muted)] text-xs font-normal">/ {campaign.published.target}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">Revenue</span>
          <span className="text-sm font-bold font-mono text-emerald-500 mt-0.5 block">
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
          <div className="p-5 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-primary)] font-medium">Campaign Overall Progress</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">{campaign.progress}%</span>
            </div>
            <Progress value={campaign.progress} size="md" color="brand" />
          </div>

          {/* Contextual AI Insight Card (As specified in prompt) */}
          <div className="p-4 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[var(--primary)]">Campaign AI Insight</span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {campaign.aiInsight}
              </p>
            </div>
          </div>

          {/* Audience & Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-3">
              <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Target Audience
              </h3>
              <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                <p>• <strong className="text-[var(--text-primary)]">Locations:</strong> {campaign.targetAudience.location.join(', ')}</p>
                <p>• <strong className="text-[var(--text-primary)]">Age Range:</strong> {campaign.targetAudience.ageRange}</p>
                <p>• <strong className="text-[var(--text-primary)]">Affinity / Interests:</strong> {campaign.targetAudience.interests.join(', ')}</p>
                <p>• <strong className="text-[var(--text-primary)]">Languages:</strong> {campaign.targetAudience.language}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-3">
              <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Creative Guidelines
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {campaign.brandGuidelines}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {campaign.platforms.map((p) => (
                  <span key={p} className="text-[11px] bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)] px-2 py-0.5 rounded-md">
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
            <p className="text-xs text-[var(--text-secondary)]">
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
                className="p-4 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-[var(--border)]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">{creator.name}</h4>
                      {creator.verified && <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">@{creator.handle}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">{creator.location}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-[var(--text-primary)]">
                      ₹{(creator.estimatedRate).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-500 block font-mono">
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
                    className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
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
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Conversations & Contract Negotiations for this campaign</span>
          </div>

          <div className="space-y-3">
            {campaignOutreach.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedOutreach(item)}
                className="p-4 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)] hover:border-[var(--border-strong)] cursor-pointer transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.creator.avatar}
                    alt={item.creator.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-[var(--border)]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">{item.creator.name}</h4>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                      Next: <span className="text-[var(--text-primary)]">{item.nextAction}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    ₹{item.proposedFee.toLocaleString()}
                  </span>
                  <Badge variant="brand" size="sm">
                    {item.stage}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-xs text-[var(--primary)]">
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
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
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
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-[var(--border)]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">{sub.creatorName}</h4>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono">@{sub.creatorHandle}</p>
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

                <p className="text-xs font-semibold text-[var(--text-primary)]">{sub.title}</p>

                {/* AI Brief Check Checklist (As specified in prompt) */}
                <div className="p-3 rounded-xl bg-[var(--surface-subtle)] shadow-xs border border-[var(--border)] text-xs space-y-1.5">
                  <span className="font-semibold text-[var(--text-primary)] text-[11px] uppercase tracking-wider block">
                    AI Brief Check
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      {sub.aiPreCheck.productVisible ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>Product Visible</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      {sub.aiPreCheck.brandMention ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>Brand Tagged</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      {sub.aiPreCheck.requiredCta ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      <span>Required CTA</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      {sub.aiPreCheck.durationCompliant ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>Duration Valid</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">{sub.deliverableType}</span>
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
                    <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
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
          <div className="p-4 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-3">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
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
                  className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-between"
                >
                  <span className="font-medium text-[var(--text-primary)]">{p.phase}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-muted)] font-mono text-[11px]">{p.date}</span>
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
            <div className="p-4 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase">Tracked Reach</span>
              <p className="text-lg font-bold font-mono text-[var(--text-primary)] mt-0.5">2.42M</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase">Avg CTR</span>
              <p className="text-lg font-bold font-mono text-[var(--text-primary)] mt-0.5">3.6%</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase">Effective CPA</span>
              <p className="text-lg font-bold font-mono text-emerald-500 mt-0.5">₹228</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase">Blended ROAS</span>
              <p className="text-lg font-bold font-mono text-[var(--primary)] mt-0.5">3.82x</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PAYMENTS & ESCROW */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-1">
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Allocated Campaign Budget</span>
              <p className="text-xl font-bold font-mono text-[var(--text-primary)]">₹{campaign.budgetTotal.toLocaleString()}</p>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">100% Escrow Funded</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
              <span className="text-[11px] font-mono text-emerald-400 uppercase">Disbursed Milestones</span>
              <p className="text-xl font-bold font-mono text-emerald-400">₹{campaign.budgetSpent.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-400/80 font-mono">Released to Creators</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
              <span className="text-[11px] font-mono text-amber-400 uppercase">Pending In Escrow</span>
              <p className="text-xl font-bold font-mono text-amber-400">₹{(campaign.budgetTotal - campaign.budgetSpent).toLocaleString()}</p>
              <span className="text-[10px] text-amber-400/80 font-mono">Awaiting Review Approval</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Creator Milestone Payouts</h3>
              <Badge variant="brand" size="sm">Smart Escrow Locked</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              {creators.slice(0, 3).map((creator, idx) => {
                const milestoneAmount = idx === 0 ? 35000 : idx === 1 ? 40000 : 30000;
                const isPaid = idx === 1;
                return (
                  <div key={creator.id} className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={creator.avatar} alt={creator.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-[var(--border)]" />
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)]">{creator.name}</h4>
                        <span className="text-[11px] text-[var(--text-muted)] font-mono">
                          Deliverable: {idx === 0 ? '1 Reel + 2 Stories' : idx === 1 ? '1 Skit Reel' : '1 Reel Draft'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[var(--text-primary)]">₹{milestoneAmount.toLocaleString()}</span>
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
          <div className="p-5 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Campaign Parameters & Governance</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Configure campaign briefing, legal agreements, and simulated creator mix.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
                <span className="font-semibold text-[var(--text-primary)] block">Brief Objective</span>
                <p className="text-[var(--text-secondary)]">{campaign.objective}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
                <span className="font-semibold text-[var(--text-primary)] block">Category & Niches</span>
                <div className="flex flex-wrap gap-1.5">
                  {(campaign.targetAudience?.interests || ['Sneakers', 'Streetwear', 'Fashion']).map((cat: string) => (
                    <span key={cat} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Architecture Simulation */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                AI Strategic Campaign Architecture
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: 'Scenario A: 20 Micro Creators', reach: '850K - 1.4M', cpa: '₹220 - ₹280', note: 'Best for direct ROAS' },
                  { title: 'Scenario B: 5 Mid-Tier Creators', reach: '1.3M - 2.0M', cpa: '₹270 - ₹340', note: 'Best for brand prestige' },
                  { title: 'Scenario C: Hybrid (Adopted)', reach: '2.2M - 3.6M', cpa: '₹240 - ₹310', note: 'Balanced flagship hype' },
                ].map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1.5 text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">{s.title}</span>
                    <div className="text-[11px] text-[var(--text-secondary)] space-y-0.5 font-mono">
                      <p>Reach: {s.reach}</p>
                      <p>CPA: {s.cpa}</p>
                    </div>
                    <span className="text-[10px] text-[var(--primary)] block pt-1">{s.note}</span>
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
            <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2 max-h-60 overflow-y-auto">
              {selectedOutreach.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'brand' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-xl leading-relaxed ${
                      m.sender === 'brand'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)]'
                    }`}
                  >
                    <p>{m.message}</p>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] mt-1">{m.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={outreachReply}
                onChange={(e) => setOutreachReply(e.target.value)}
                placeholder="Type reply to creator..."
                className="flex-1 bg-[var(--input)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
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
