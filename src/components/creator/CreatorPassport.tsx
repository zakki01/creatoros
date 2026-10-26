import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Share2,
  Download,
  MapPin,
  Star,
  Eye,
  Heart,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { InstagramIcon, YouTubeIcon } from '../common/PlatformIcons';
import { useAppState } from '../../context/StateContext';
import { Avatar } from '../ui/Avatar';
import { SpatialCard } from '../ui/SpatialCard';
import { Tabs } from '../ui/Tabs';
import { useToast } from '../ui/Toast';

interface CredentialItem {
  id: 'identity' | 'experience' | 'channels' | 'reputation';
  label: string;
  title: string;
  summary: string;
  meta: string;
}

const CREDENTIAL_INDICATORS: CredentialItem[] = [
  {
    id: 'identity',
    label: 'Identity',
    title: 'Identity Verified',
    summary: 'Government ID & biometric liveness verified via CreatorOS Trust Layer.',
    meta: 'KYC Level 3 · Active',
  },
  {
    id: 'experience',
    label: 'Experience',
    title: 'Brand Experience',
    summary: '24 completed commercial campaigns with 100% on-time delivery.',
    meta: '24 Projects · 0 Disputes',
  },
  {
    id: 'channels',
    label: 'Channels',
    title: 'Channels Verified',
    summary: 'First-party OAuth API telemetry connected for Instagram & YouTube.',
    meta: '449K Combined Reach · Live Sync',
  },
  {
    id: 'reputation',
    label: 'Reputation',
    title: 'Reputation Score 96/100',
    summary: 'Top 1% creator reliability, responsiveness, and brand repeat rate.',
    meta: '4.9★ Brand Rating',
  },
];

export const CreatorPassport: React.FC = () => {
  const { creators, triggerCelebration } = useAppState();
  const toast = useToast();
  const creator = creators[0]; // Rohan Sharma

  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [activeCredential, setActiveCredential] = useState<CredentialItem | null>(null);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    triggerCelebration();
    toast.success('Passport link copied');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExport = () => {
    toast.success('Passport credential exported');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'channels', label: 'Channels' },
    { id: 'proof', label: 'Proof' },
    { id: 'history', label: 'History' },
  ];

  const reachFormatted = `${Math.round(creator.totalFollowers / 1000)}K`;

  return (
    <div className="space-y-5 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Compact Page Title Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display tracking-tight">
            Passport
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-500/30 whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            Verified ID
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            data-testid="passport-share-btn"
            className="depth-btn-secondary min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-900 flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            data-testid="passport-export-btn"
            className="depth-btn-primary min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 3D Spatial Identity Card Hero (Desktop & Mobile Intentional Layout) */}
      <div
        data-testid="passport-identity-card"
        className="relative rounded-3xl p-5 sm:p-7 overflow-hidden border border-[#D4DEE7] bg-gradient-to-br from-white via-[#F7FAFC] to-[#EAF5F6] shadow-[0_12px_32px_-18px_rgba(23,37,54,0.24),inset_0_1px_0_rgba(255,255,255,0.98)] backdrop-blur-2xl"
      >
        {/* Subtle Emerald Verification Glow + Soft Purple Ambient Light */}
        <div
          className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full opacity-35 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(0,126,147,0.18) 0%, rgba(0,126,147,0.03) 65%, transparent 80%)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(0,126,147,0.10) 0%, rgba(0,126,147,0.025) 65%, transparent 80%)',
          }}
        />

        <div className="relative z-10 flex flex-col gap-5">
          {/* Top Identity Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* 3D Avatar with Floating Verification Seal */}
              <div className="relative shrink-0">
                <Avatar
                  src={creator.avatar}
                  name={creator.name}
                  size="2xl"
                  ring="success"
                  className="rounded-2xl shadow-[0_8px_20px_rgba(23,37,54,0.16)]"
                />
                <div
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center ring-2 ring-white shadow-[0_4px_12px_rgba(16,185,129,0.5)]"
                  title="Verified Identity"
                >
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Name, Handle, Category & Status */}
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display tracking-tight truncate">
                    {creator.name}
                  </h2>
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold"
                    title="Verified"
                  >
                    ✓
                  </span>
                </div>

                <p className="text-xs font-mono text-zinc-500">
                  @{creator.handle.replace('@', '')}
                </p>

                <p className="text-xs sm:text-sm font-medium text-zinc-700">
                  Streetwear &amp; Sneaker Culture
                </p>

                {/* Status Line */}
                <div className="flex items-center gap-2 pt-1 text-xs text-zinc-600 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    Verified
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="font-medium text-zinc-700">96 Reputation</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-emerald-800 font-medium">{creator.availability}</span>
                </div>
              </div>
            </div>

            {/* Compact 4-Metric Spatial Row */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-white/80 border border-zinc-200 rounded-2xl p-3 sm:px-4 sm:py-3 backdrop-blur-xl shrink-0">
              <div className="text-center px-1 sm:px-2">
                <p className="text-base sm:text-lg font-bold text-emerald-700 font-mono leading-tight">
                  96
                </p>
                <span className="text-[10px] text-zinc-500 font-medium">Reputation</span>
              </div>
              <div className="text-center px-1 sm:px-2 border-l border-zinc-200">
                <p className="text-base sm:text-lg font-bold text-zinc-900 font-mono leading-tight">
                  {reachFormatted}
                </p>
                <span className="text-[10px] text-zinc-500 font-medium">Reach</span>
              </div>
              <div className="text-center px-1 sm:px-2 border-l border-zinc-200">
                <p className="text-base sm:text-lg font-bold text-zinc-900 font-mono leading-tight">
                  {creator.avgEngagement}%
                </p>
                <span className="text-[10px] text-zinc-500 font-medium">Engagement</span>
              </div>
              <div className="text-center px-1 sm:px-2 border-l border-zinc-200">
                <p className="text-base sm:text-lg font-bold text-zinc-900 font-mono leading-tight">
                  {creator.pastCampaignsCount}
                </p>
                <span className="text-[10px] text-zinc-500 font-medium">Projects</span>
              </div>
            </div>
          </div>

          {/* Compact Credential Indicators Row: ✓ Identity · ✓ Experience · ✓ Channels · ✓ Reputation */}
          <div className="pt-3 border-t border-zinc-200 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {CREDENTIAL_INDICATORS.map((cred) => {
                const isSelected = activeCredential?.id === cred.id;
                return (
                  <button
                    key={cred.id}
                    type="button"
                    onClick={() =>
                      setActiveCredential(isSelected ? null : cred)
                    }
                    data-testid={`passport-credential-${cred.id}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
                        : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{cred.label}</span>
                  </button>
                );
              })}

              <span className="ml-auto hidden md:inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                {creator.location}
              </span>
            </div>

            {/* Expandable Credential Detail Strip */}
            {activeCredential && (
              <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200 flex items-center justify-between gap-3 animate-fade-in">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-800">
                      {activeCredential.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {activeCredential.meta}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700">{activeCredential.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCredential(null)}
                  className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 shrink-0"
                  aria-label="Close credential details"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Short Secondary Tabs: Overview | Channels | Proof | History */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {/* Bio Section (2-3 lines with More toggle) */}
          <SpatialCard surface={2} className="md:col-span-2 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 font-display">Bio</h3>
              <span className="text-[11px] text-zinc-500">
                {creator.languages.join(' · ')}
              </span>
            </div>

            <div>
              <p
                className={`text-xs sm:text-sm text-zinc-700 leading-relaxed ${
                  bioExpanded ? '' : 'line-clamp-2'
                }`}
              >
                {creator.bio} Specialized in high-retention sneaker storytelling, 4K macro cinematography, and culturally grounded Gen-Z streetwear launches across India.
              </p>
              <button
                type="button"
                onClick={() => setBioExpanded(!bioExpanded)}
                data-testid="passport-bio-more-btn"
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#007E93] hover:text-[#006779] cursor-pointer"
              >
                <span>{bioExpanded ? 'Less' : 'More'}</span>
                {bioExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="pt-2 flex flex-wrap gap-1.5">
              {creator.verifiedBadges.map((b, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-500/25 text-[11px] font-medium text-emerald-800"
                >
                  <CheckCircle className="w-3 h-3" />
                  {b}
                </span>
              ))}
            </div>
          </SpatialCard>

          {/* Compact Rates Card */}
          <SpatialCard surface={2} className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 font-display">Rates</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {Object.entries(creator.rateCard).map(([format, fee]) => (
                <div
                  key={format}
                  className="p-2.5 rounded-xl bg-white border border-zinc-200"
                >
                  <p className="text-[11px] text-zinc-500 truncate">{format}</p>
                  <p className="text-sm font-bold font-mono text-zinc-900 mt-0.5">
                    ₹{fee?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </SpatialCard>
        </div>
      )}

      {/* TAB 2: CHANNELS */}
      {activeTab === 'channels' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {creator.platforms.map((p, idx) => (
            <SpatialCard key={idx} surface={2} className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                    {p.platform === 'Instagram' ? (
                      <InstagramIcon className="w-5 h-5 text-pink-400" />
                    ) : (
                      <YouTubeIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-zinc-900">{p.platform}</h4>
                      {p.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">{p.handle}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-500/30">
                  Synced
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-white border border-zinc-200">
                  <span className="text-[10px] text-zinc-500">Followers</span>
                  <p className="text-base font-bold font-mono text-zinc-900 mt-0.5">
                    {(p.followers / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-zinc-200">
                  <span className="text-[10px] text-zinc-500">Engagement</span>
                  <p className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                    {p.engagementRate}%
                  </p>
                </div>
              </div>
            </SpatialCard>
          ))}
        </div>
      )}

      {/* TAB 3: PROOF (Portfolio + Verified Demographics) */}
      {activeTab === 'proof' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {creator.portfolio.map((p) => (
              <SpatialCard key={p.id} surface={2} className="overflow-hidden group">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
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
                <div className="p-3.5">
                  <p className="text-xs font-semibold text-zinc-900 line-clamp-1">{p.title}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {p.type} · {p.campaignName}
                  </p>
                </div>
              </SpatialCard>
            ))}
          </div>

          <SpatialCard surface={2} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-zinc-800">Top Cities</h4>
              <div className="space-y-2">
                {creator.audienceBreakdown.topLocations.map((loc, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-700">{loc.city}</span>
                      <span className="font-mono text-zinc-600">{loc.pct}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${loc.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-zinc-800">Age Split</h4>
              <div className="space-y-2">
                {creator.audienceBreakdown.ageSplit.map((a, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-700">{a.range}</span>
                      <span className="font-mono text-zinc-600">{a.pct}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#007E93] h-full rounded-full"
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SpatialCard>
        </div>
      )}

      {/* TAB 4: HISTORY (Verified Brand Reviews & Completed Projects) */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {creator.testimonials.map((t) => (
            <SpatialCard key={t.id} surface={2} className="p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">{t.brandName}</h4>
                  <p className="text-[11px] text-zinc-500">
                    {t.authorName} · {t.authorRole}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-800">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold font-mono">{t.rating}.0</span>
                </div>
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed">"{t.comment}"</p>
              <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                <span>{t.verifiedCampaign}</span>
                <span>{t.date}</span>
              </div>
            </SpatialCard>
          ))}
        </div>
      )}
    </div>
  );
};
