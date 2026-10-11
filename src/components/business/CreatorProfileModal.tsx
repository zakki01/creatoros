import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Star,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  TrendingUp,
  MessageSquare,
  DollarSign,
  FileCheck,
  Send,
  Eye,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { InstagramIcon, YouTubeIcon } from '../common/PlatformIcons';
import { Creator, Campaign } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { useAppState } from '../../context/StateContext';

interface CreatorProfileModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (creatorId: string) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  isOpen,
  onClose,
  onInvite,
}) => {
  const { campaigns, activeCampaignId, inviteCreator } = useAppState();
  const [activeTab, setActiveTab] = useState('overview');
  const [invited, setInvited] = useState(false);

  if (!creator) return null;

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];

  const handleInvite = () => {
    inviteCreator(creator.id, activeCampaign.id, creator.estimatedRate);
    setInvited(true);
    if (onInvite) onInvite(creator.id);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'audience', label: 'Audience Demographics' },
    { id: 'portfolio', label: 'Verified Content' },
    { id: 'reputation', label: 'Platform Reliability' },
    { id: 'testimonials', label: `Testimonials (${creator.testimonials.length})` },
    { id: 'rates', label: 'Rate Card' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-3">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-10 h-10 rounded-2xl object-cover ring-1 ring-zinc-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-100 font-display">
                {creator.name}
              </h2>
              {creator.verified && (
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              )}
              <span className="text-xs text-zinc-500 font-mono">@{creator.handle}</span>
            </div>
            <p className="text-xs text-zinc-400">{creator.category} • {creator.location}</p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-zinc-400">
            Targeting for: <strong className="text-zinc-200">{activeCampaign?.name}</strong>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={invited}
              onClick={handleInvite}
              leftIcon={invited ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            >
              {invited ? 'Invited to Campaign' : `Invite (₹${creator.estimatedRate.toLocaleString()})`}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Sub-navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Bio & Top Badges */}
            <div className="space-y-2.5">
              <p className="text-xs text-zinc-300 leading-relaxed">{creator.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {creator.verifiedBadges.map((badge, idx) => (
                  <Badge key={idx} variant="brand" size="sm">
                    {badge}
                  </Badge>
                ))}
                <Badge variant="neutral" size="sm">
                  {creator.pastCampaignsCount} Verified Platform Drops
                </Badge>
              </div>
            </div>

            {/* AI Fit Analysis Box (Explainable Intelligence) */}
            {creator.aiMatchFactors && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      Why This Creator Matches ({creator.aiMatchScore}% Campaign Fit)
                    </h4>
                  </div>
                  <Badge variant="brand" size="sm">
                    Verified Fit
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="font-semibold text-zinc-300 block">Audience Match:</span>
                    <span className="text-zinc-400 text-[11px]">{creator.aiMatchFactors.audienceMatch}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="font-semibold text-zinc-300 block">Content Aesthetic:</span>
                    <span className="text-zinc-400 text-[11px]">{creator.aiMatchFactors.contentRelevance}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="font-semibold text-zinc-300 block">Historical Performance:</span>
                    <span className="text-zinc-400 text-[11px]">{creator.aiMatchFactors.historicalPerformance}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="font-semibold text-zinc-300 block">Location Logistics:</span>
                    <span className="text-zinc-400 text-[11px]">{creator.aiMatchFactors.location}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-medium">Total Followers</p>
                <p className="text-lg font-bold text-zinc-100 font-mono mt-0.5">
                  {(creator.totalFollowers / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-medium">Avg Engagement</p>
                <p className="text-lg font-bold text-indigo-400 font-mono mt-0.5">
                  {creator.avgEngagement}%
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-medium">On-Time Delivery</p>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {creator.reliabilityMetrics.onTimeDelivery}%
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-medium">Estimated Rate</p>
                <p className="text-lg font-bold text-zinc-100 font-mono mt-0.5">
                  ₹{(creator.estimatedRate / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIENCE DEMOGRAPHICS */}
        {activeTab === 'audience' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Top Cities */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-200">Top Audience Cities</h4>
                <div className="space-y-2">
                  {creator.audienceBreakdown.topLocations.map((loc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-300">{loc.city}</span>
                        <span className="font-mono text-zinc-400">{loc.pct}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${loc.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age Split */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-200">Age Distribution</h4>
                <div className="space-y-2">
                  {creator.audienceBreakdown.ageSplit.map((age, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-300">{age.range} years</span>
                        <span className="font-mono text-zinc-400">{age.pct}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${age.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gender Split */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <h4 className="text-xs font-semibold text-zinc-200">Gender Ratio</h4>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-zinc-400">
                  Male: <strong className="text-zinc-200 font-mono">{creator.audienceBreakdown.genderSplit.male}%</strong>
                </span>
                <span className="text-zinc-400">
                  Female: <strong className="text-zinc-200 font-mono">{creator.audienceBreakdown.genderSplit.female}%</strong>
                </span>
                <span className="text-zinc-400">
                  Other: <strong className="text-zinc-200 font-mono">{creator.audienceBreakdown.genderSplit.other}%</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PORTFOLIO / VERIFIED CONTENT */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            {creator.portfolio.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="brand" size="sm">
                      {item.type}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-mono">
                      <Eye className="w-3.5 h-3.5 text-zinc-300" />
                      {(item.views / 1000).toFixed(0)}K views
                    </span>
                    <span className="flex items-center gap-1 font-mono text-pink-300">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      {(item.engagement / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-zinc-200 line-clamp-1">{item.title}</p>
                  {item.campaignName && (
                    <p className="text-[10px] text-zinc-500 mt-0.5">Campaign: {item.campaignName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: REPUTATION & RELIABILITY RADAR */}
        {activeTab === 'reputation' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h4 className="text-xs font-semibold text-zinc-200 mb-1">
                Internal Platform Reliability Scores
              </h4>
              <p className="text-[11px] text-zinc-400 mb-4">
                These scores are verified by CreatorOS based on historical prompt compliance, milestone delivery timelines, and response latencies.
              </p>

              <div className="space-y-3">
                {[
                  { label: 'On-Time Delivery', score: creator.reliabilityMetrics.onTimeDelivery, desc: 'Deliverables uploaded on or before campaign deadline' },
                  { label: 'Brief Compliance', score: creator.reliabilityMetrics.briefCompliance, desc: 'Adherence to mandatory brand tags, CTAs, and framing specifications' },
                  { label: 'Communication Velocity', score: creator.reliabilityMetrics.communication, desc: 'Response rate within 24 hours of brand inquiry' },
                  { label: 'Content Quality Score', score: creator.reliabilityMetrics.contentQuality, desc: 'Lighting, audio fidelity, and high-res format' },
                  { label: 'Campaign Conversion Performance', score: creator.reliabilityMetrics.campaignPerformance, desc: 'Achieved or exceeded forecasted click-through benchmarks' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-zinc-300">{item.label}</span>
                        <span className="text-[10px] text-zinc-500 ml-2 hidden sm:inline">{item.desc}</span>
                      </div>
                      <span className="font-mono font-bold text-indigo-400">{item.score}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-3 animate-fade-in">
            {creator.testimonials.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                      {t.brandName.slice(0, 1)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-zinc-200">{t.brandName}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">
                        {t.authorName} ({t.authorRole})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold font-mono">{t.rating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed">"{t.comment}"</p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                  <span>Verified Campaign: {t.verifiedCampaign}</span>
                  <span>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: RATE CARD */}
        {activeTab === 'rates' && (
          <div className="space-y-3 animate-fade-in">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-semibold text-zinc-200">Standard Rate Card</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(creator.rateCard).map(([format, price]) => (
                  <div
                    key={format}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-300 font-medium">{format}</span>
                    <span className="font-mono font-bold text-zinc-100">
                      ₹{price?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
