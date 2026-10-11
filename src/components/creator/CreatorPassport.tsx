import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Share2,
  Download,
  MapPin,
  Sparkles,
  Star,
  Eye,
  Heart,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
} from 'lucide-react';
import { InstagramIcon, YouTubeIcon } from '../common/PlatformIcons';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';

export const CreatorPassport: React.FC = () => {
  const { creators, triggerCelebration } = useAppState();
  const creator = creators[0]; // Rohan Sharma

  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    triggerCelebration();
    setTimeout(() => setCopied(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Identity & Bio' },
    { id: 'platforms', label: 'Verified Channels' },
    { id: 'audience', label: 'Verified Demographics' },
    { id: 'portfolio', label: 'Top Portfolio' },
    { id: 'history', label: `Campaign History (${creator.pastCampaignsCount})` },
    { id: 'testimonials', label: `Verified Reviews (${creator.testimonials.length})` },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 font-display">
              Creator Passport™
            </h1>
            <Badge variant="success" size="sm" dot>
              Cryptographically Verified
            </Badge>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Your official universal influencer identity, verified channel metrics, and commercial reputation score.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-4 h-4 text-emerald-400" />}
          >
            {copied ? 'Passport Link Copied!' : 'Share Public Passport'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500"
            leftIcon={<Award className="w-4 h-4" />}
          >
            Export PDF Credential
          </Button>
        </div>
      </div>

      {/* Hero Passport Badge Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/30 border border-emerald-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-20 h-20 rounded-3xl object-cover ring-2 ring-emerald-500/50 shadow-xl"
              />
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-black p-1 rounded-full ring-2 ring-zinc-950">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-display">
                  {creator.name}
                </h2>
                <Badge variant="brand" size="sm">
                  Top 1% Creator
                </Badge>
                <Badge variant="success" size="sm">
                  Reputation 96/100
                </Badge>
              </div>
              <p className="text-xs text-zinc-400 font-mono">@{creator.handle} • {creator.category}</p>
              <div className="flex items-center gap-3 text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {creator.location}
                </span>
                <span>•</span>
                <span>Languages: {creator.languages.join(', ')}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Status: {creator.availability}</span>
              </div>
            </div>
          </div>

          {/* Quick Key Metrics */}
          <div className="flex items-center gap-4 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] text-zinc-500 uppercase font-medium">Total Reach</span>
              <p className="text-lg font-bold text-zinc-100 font-mono">
                {(creator.totalFollowers / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-zinc-500 uppercase font-medium">Avg Engagement</span>
              <p className="text-lg font-bold text-emerald-400 font-mono">
                {creator.avgEngagement}%
              </p>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-zinc-500 uppercase font-medium">Completed Drops</span>
              <p className="text-lg font-bold text-zinc-100 font-mono">
                {creator.pastCampaignsCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB: PROFILE & BIO */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 font-display">Biography & Creative Manifesto</h3>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
              {creator.bio}
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-zinc-400 mb-2">Verified Badges & Accreditations</h4>
              <div className="flex flex-wrap gap-2">
                {creator.verifiedBadges.map((b, idx) => (
                  <Badge key={idx} variant="success" size="md">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {b}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 font-display">Standard Deliverable Rates</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(creator.rateCard).map(([format, fee]) => (
                <div key={format} className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center">
                  <p className="text-[11px] text-zinc-400">{format}</p>
                  <p className="text-base font-bold font-mono text-zinc-100 mt-0.5">
                    ₹{fee?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB: VERIFIED CHANNELS */}
      {activeTab === 'platforms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in">
          {creator.platforms.map((p, idx) => (
            <Card key={idx} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-200">
                    {p.platform === 'Instagram' ? (
                      <InstagramIcon className="w-5 h-5 text-pink-400" />
                    ) : (
                      <YouTubeIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-zinc-100">{p.platform}</h4>
                      {p.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">{p.handle}</span>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  Live API Sync
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-500 uppercase">Followers</span>
                  <p className="text-base font-bold font-mono text-zinc-100 mt-0.5">
                    {(p.followers / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-500 uppercase">Engagement Rate</span>
                  <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                    {p.engagementRate}%
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB: AUDIENCE */}
      {activeTab === 'audience' && (
        <Card className="p-6 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300">Geographic Audience Footprint</h4>
              <div className="space-y-2">
                {creator.audienceBreakdown.topLocations.map((loc, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300">{loc.city}</span>
                      <span className="font-mono text-zinc-400">{loc.pct}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${loc.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300">Age Demographics</h4>
              <div className="space-y-2">
                {creator.audienceBreakdown.ageSplit.map((a, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300">{a.range}</span>
                      <span className="font-mono text-zinc-400">{a.pct}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB: PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in">
          {creator.portfolio.map((p) => (
            <Card key={p.id} className="overflow-hidden group space-y-2">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    {(p.views / 1000).toFixed(0)}K
                  </span>
                  <span className="flex items-center gap-1 font-mono text-pink-300">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {(p.engagement / 1000).toFixed(1)}K
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-zinc-200 line-clamp-1">{p.title}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{p.type} • {p.campaignName}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4 animate-fade-in">
          {creator.testimonials.map((t) => (
            <Card key={t.id} className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-100">{t.brandName}</h4>
                  <p className="text-[10px] text-zinc-500">{t.authorName} ({t.authorRole})</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold font-mono">{t.rating}.0</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 italic leading-relaxed">"{t.comment}"</p>
              <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                <span>Verified Campaign: {t.verifiedCampaign}</span>
                <span>{t.date}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
