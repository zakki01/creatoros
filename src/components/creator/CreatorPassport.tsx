import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon, YouTubeIcon } from '../common/PlatformIcons';
import { useAppState } from '../../context/StateContext';
import { Avatar } from '../ui/Avatar';
import { SpatialCard } from '../ui/SpatialCard';
import { Tabs } from '../ui/Tabs';
import { useToast } from '../ui/Toast';
import { getSafeCurrentCreator } from '../../data/demoFixtures';
import { ContractService } from '../../services/contractService';

interface CredentialItem {
  id: 'identity' | 'experience' | 'channels' | 'reputation';
  label: string;
  title: string;
  summary: string;
  meta: string;
  active: boolean;
}

interface CreatorPassportProps {
  onBack?: () => void;
}

export const CreatorPassport: React.FC<CreatorPassportProps> = ({ onBack }) => {
  const {
    creators,
    triggerCelebration,
    setCreatorActiveTab,
    userProfile,
    authUser,
  } = useAppState();

  const toast = useToast();
  const creator = getSafeCurrentCreator(creators, userProfile, authUser);

  const handleNavigateBack = () => {
    if (onBack) {
      onBack();
    } else {
      setCreatorActiveTab('profile');
    }
  };

  // Browser back / popstate and keyboard Escape support
  useEffect(() => {
    const handlePopState = () => {
      handleNavigateBack();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleNavigateBack();
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [activeCredential, setActiveCredential] = useState<CredentialItem | null>(null);

  // Compute real credentials from database state
  const isIdentityVerified = Boolean(creator.verified || (userProfile as any)?.verified);
  const contracts = ContractService.getAllContracts({ creatorId: creator.id });
  const completedProjectsCount =
    creator.pastCampaignsCount ||
    contracts.filter((c) => c.status === 'completed' || c.status === 'paid').length;
  const connectedPlatformsCount = creator.platforms ? creator.platforms.length : 0;
  const reputationScore =
    creator.reliabilityMetrics?.campaignPerformance && creator.reliabilityMetrics.campaignPerformance > 0
      ? Math.round(creator.reliabilityMetrics.campaignPerformance)
      : null;

  const reachFormatted =
    creator.totalFollowers && creator.totalFollowers > 0
      ? creator.totalFollowers >= 1000
        ? `${Math.round(creator.totalFollowers / 1000)}K`
        : creator.totalFollowers.toString()
      : '0';

  const credentialIndicators: CredentialItem[] = [
    {
      id: 'identity',
      label: 'Identity',
      title: isIdentityVerified ? 'Identity Verified' : 'Identity Verification Pending',
      summary: isIdentityVerified
        ? 'Government ID and biometric verification confirmed via CreatorOS Trust Layer.'
        : 'Complete identity verification in settings to activate your verified trust seal.',
      meta: isIdentityVerified ? 'KYC Verified · Active' : 'Unverified · Level 0',
      active: isIdentityVerified,
    },
    {
      id: 'experience',
      label: 'Experience',
      title: 'Brand Experience',
      summary:
        completedProjectsCount > 0
          ? `${completedProjectsCount} completed commercial campaigns with verified on-time deliverables.`
          : 'No commercial campaigns completed yet on CreatorOS.',
      meta: `${completedProjectsCount} Projects`,
      active: completedProjectsCount > 0,
    },
    {
      id: 'channels',
      label: 'Channels',
      title: connectedPlatformsCount > 0 ? 'Channels Verified' : 'Channels Pending',
      summary:
        connectedPlatformsCount > 0
          ? `${creator.platforms.map((p) => p.platform).join(', ')} telemetry synced.`
          : 'No social channels connected yet. Connect your channels to sync live reach.',
      meta: connectedPlatformsCount > 0 ? `${reachFormatted} Reach` : '0 Connected',
      active: connectedPlatformsCount > 0,
    },
    {
      id: 'reputation',
      label: 'Reputation',
      title: reputationScore !== null ? `Reputation Score ${reputationScore}/100` : 'Reputation Score Pending',
      summary:
        reputationScore !== null
          ? 'Calculated from punctuality, brief compliance, and brand feedback.'
          : 'Reputation score unlocks after completing your first brand collaboration.',
      meta: reputationScore !== null ? `${reputationScore} / 100` : 'No Score Yet',
      active: reputationScore !== null,
    },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    triggerCelebration();
    toast.success('Passport link copied');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExport = () => {
    const passportData = {
      creatorosPassportVersion: '2.0',
      exportedAt: new Date().toISOString(),
      creator: {
        id: creator.id,
        name: creator.name,
        handle: creator.handle,
        category: creator.category || userProfile?.category || 'Creator',
        location: creator.location || userProfile?.location || 'Global',
        verified: isIdentityVerified,
        totalReach: creator.totalFollowers || 0,
        reputationScore: reputationScore || 0,
        completedProjects: completedProjectsCount,
        rateCard: creator.rateCard || {},
        connectedPlatforms: (creator.platforms || []).map((p) => ({
          platform: p.platform,
          handle: p.handle,
          verified: p.verified,
        })),
      },
      verificationSignature: `os_sig_${Math.random().toString(36).substring(2, 12)}`,
    };

    const blob = new Blob([JSON.stringify(passportData, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creatoros-passport-${creator.handle.replace('@', '') || 'creator'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Passport credential exported');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'channels', label: 'Channels' },
    { id: 'proof', label: 'Proof' },
    { id: 'history', label: 'History' },
  ];

  const categoryDisplay = creator.category || userProfile?.category || 'Digital Creator';
  const bioText =
    creator.bio ||
    userProfile?.bio ||
    'Welcome to your Creator Passport. Complete your profile and collaborate with brands to build your verified reputation.';

  return (
    <div className="space-y-5 animate-fade-in max-w-5xl mx-auto w-full overflow-x-hidden pb-[calc(96px+env(safe-area-inset-bottom,20px))] sm:pb-12">
      {/* Responsive Navigation Header (Mobile-First, Zero Cramping at 320px–430px) */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
        {/* Desktop Breadcrumb Navigation: ← Profile / Passport */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={handleNavigateBack}
            data-testid="passport-back-desktop-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-xs font-semibold text-[var(--text-primary)] transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:-translate-x-0.5 transition-transform" />
            <span>← Profile</span>
          </button>
          <span className="text-[var(--text-muted)] font-mono">/</span>
          <h1 className="text-xl font-bold text-[var(--text-primary)] font-display tracking-tight flex items-center gap-2">
            <span>Passport</span>
            {isIdentityVerified && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified ID
              </span>
            )}
          </h1>
        </div>

        {/* Mobile Header: Clean ← Passport (no cramped badges) */}
        <div className="flex sm:hidden items-center gap-1 min-w-0">
          <button
            type="button"
            onClick={handleNavigateBack}
            data-testid="passport-back-mobile-btn"
            className="flex items-center gap-2 px-2 py-1.5 -ml-1 rounded-xl text-[var(--text-primary)] hover:bg-[var(--surface-muted)] active:scale-95 transition-all cursor-pointer"
            aria-label="Back to Profile"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            <span className="text-lg font-bold text-[var(--text-primary)] font-display truncate">
              Passport
            </span>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            data-testid="passport-share-btn"
            className="depth-btn-secondary min-h-[34px] sm:min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            data-testid="passport-export-btn"
            className="depth-btn-primary min-h-[34px] sm:min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 3D Spatial Identity Card Hero */}
      <div
        data-testid="passport-identity-card"
        className="relative rounded-3xl p-4 sm:p-7 overflow-hidden border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl backdrop-blur-2xl text-[var(--text-primary)]"
      >
        {/* Subtle Verification Ambient Glow */}
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
            <div className="flex items-center gap-3.5 sm:gap-4">
              {/* 3D Avatar with Optional Floating Verification Seal */}
              <div className="relative shrink-0">
                <Avatar
                  src={creator.avatar}
                  name={creator.name}
                  size="2xl"
                  ring={isIdentityVerified ? 'success' : undefined}
                  className="rounded-2xl shadow-[0_8px_20px_rgba(23,37,54,0.16)]"
                />
                {isIdentityVerified && (
                  <div
                    className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center ring-2 ring-[var(--surface)] shadow-[0_4px_12px_rgba(16,185,129,0.5)]"
                    title="Verified Identity"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </div>

              {/* Name, Handle, Category & Status */}
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight truncate">
                    {creator.name}
                  </h2>
                  {isIdentityVerified && (
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold"
                      title="Verified"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <p className="text-xs font-mono text-[var(--text-muted)]">
                  @{creator.handle ? creator.handle.replace('@', '') : 'creator'}
                </p>

                <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
                  {categoryDisplay}
                </p>

                {/* Status Line */}
                <div className="flex items-center gap-2 pt-1 text-xs text-[var(--text-secondary)] flex-wrap">
                  {isIdentityVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[var(--text-muted)] font-medium">
                      Unverified
                    </span>
                  )}
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="font-medium text-[var(--text-secondary)]">
                    {reputationScore !== null ? `${reputationScore} Reputation` : 'No Score Yet'}
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--primary)] font-medium">
                    {creator.availability || 'Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Compact 4-Metric Spatial Row */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl p-2.5 sm:px-4 sm:py-3 backdrop-blur-xl shrink-0 text-[var(--text-primary)]">
              <div className="text-center px-1 sm:px-2">
                <p className="text-base sm:text-lg font-bold text-[var(--primary)] font-mono leading-tight">
                  {reputationScore !== null ? reputationScore : '—'}
                </p>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">Reputation</span>
              </div>
              <div className="text-center px-1 sm:px-2 border-l border-[var(--border)]">
                <p className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-mono leading-tight">
                  {reachFormatted}
                </p>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">Reach</span>
              </div>
              <div className="text-center px-1 sm:px-2 border-l border-[var(--border)]">
                <p className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-mono leading-tight">
                  {creator.avgEngagement > 0 ? `${creator.avgEngagement}%` : '0%'}
                </p>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">Engagement</span>
              </div>
              <div className="text-center px-1 sm:px-2 border-l border-[var(--border)]">
                <p className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-mono leading-tight">
                  {completedProjectsCount}
                </p>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">Projects</span>
              </div>
            </div>
          </div>

          {/* Compact Credential Indicators Row */}
          <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2.5">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {credentialIndicators.map((cred) => {
                const isSelected = activeCredential?.id === cred.id;
                return (
                  <button
                    key={cred.id}
                    type="button"
                    onClick={() => setActiveCredential(isSelected ? null : cred)}
                    data-testid={`passport-credential-${cred.id}`}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-xs'
                        : cred.active
                        ? 'bg-[var(--surface-muted)] hover:bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)]'
                        : 'bg-[var(--surface-muted)]/50 text-[var(--text-muted)] border-[var(--border)] opacity-75'
                    }`}
                  >
                    {cred.active ? (
                      <span className="text-emerald-500 font-bold">✓</span>
                    ) : (
                      <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                    )}
                    <span>{cred.label}</span>
                  </button>
                );
              })}

              {creator.location && (
                <span className="ml-auto hidden md:inline-flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  {creator.location}
                </span>
              )}
            </div>

            {/* Expandable Credential Detail Strip */}
            {activeCredential && (
              <div className="p-3 rounded-2xl bg-[var(--surface)] border border-emerald-500/30 flex items-center justify-between gap-3 animate-fade-in">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {activeCredential.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                      {activeCredential.meta}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">{activeCredential.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCredential(null)}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0 cursor-pointer"
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
          {/* Bio Section */}
          <SpatialCard surface={2} className="md:col-span-2 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] font-display">Bio</h3>
              {creator.languages && creator.languages.length > 0 && (
                <span className="text-[11px] text-[var(--text-muted)]">
                  {creator.languages.join(' · ')}
                </span>
              )}
            </div>

            <div>
              <p
                className={`text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed ${
                  bioExpanded ? '' : 'line-clamp-3'
                }`}
              >
                {bioText}
              </p>
              {bioText.length > 120 && (
                <button
                  type="button"
                  onClick={() => setBioExpanded(!bioExpanded)}
                  data-testid="passport-bio-more-btn"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] cursor-pointer"
                >
                  <span>{bioExpanded ? 'Less' : 'More'}</span>
                  {bioExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {creator.verifiedBadges && creator.verifiedBadges.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {creator.verifiedBadges.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle className="w-3 h-3" />
                    {b}
                  </span>
                ))}
              </div>
            )}
          </SpatialCard>

          {/* Rates Card */}
          <SpatialCard surface={2} className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] font-display">
              Rate Card
            </h3>
            {creator.rateCard && Object.keys(creator.rateCard).length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(creator.rateCard).map(([format, fee]) => (
                  <div
                    key={format}
                    className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <p className="text-[11px] text-[var(--text-muted)] truncate">{format}</p>
                    <p className="text-sm font-bold font-mono text-[var(--text-primary)] mt-0.5">
                      ₹{fee?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-dashed border-[var(--border)] text-center">
                <p className="text-xs text-[var(--text-muted)]">No rates published yet.</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  Configure your standard deliverables in Profile Settings.
                </p>
              </div>
            )}
          </SpatialCard>
        </div>
      )}

      {/* TAB 2: CHANNELS */}
      {activeTab === 'channels' && (
        <div className="animate-fade-in">
          {creator.platforms && creator.platforms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creator.platforms.map((p, idx) => (
                <SpatialCard key={idx} surface={2} className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center">
                        {p.platform === 'Instagram' ? (
                          <InstagramIcon className="w-5 h-5 text-pink-400" />
                        ) : (
                          <YouTubeIcon className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[var(--text-primary)]">
                            {p.platform}
                          </h4>
                          {p.verified && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>
                        <span className="text-xs text-[var(--text-muted)] font-mono">{p.handle}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                      Synced
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--text-muted)]">Followers</span>
                      <p className="text-base font-bold font-mono text-[var(--text-primary)] mt-0.5">
                        {p.followers >= 1000 ? `${(p.followers / 1000).toFixed(0)}K` : p.followers}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--text-muted)]">Engagement</span>
                      <p className="text-base font-bold font-mono text-emerald-500 dark:text-emerald-400 mt-0.5">
                        {p.engagementRate}%
                      </p>
                    </div>
                  </div>
                </SpatialCard>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[var(--surface-elevated)] border border-dashed border-[var(--border)] text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[var(--text-muted)] mx-auto stroke-1" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                No social channels connected yet
              </p>
              <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto">
                Connect your YouTube or Instagram accounts in Profile Settings to sync verified follower telemetry and engagement rates.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROOF (Portfolio + Verified Demographics) */}
      {activeTab === 'proof' && (
        <div className="space-y-4 animate-fade-in">
          {creator.portfolio && creator.portfolio.length > 0 ? (
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
                    <p className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {p.type} · {p.campaignName}
                    </p>
                  </div>
                </SpatialCard>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[var(--surface-elevated)] border border-dashed border-[var(--border)] text-center space-y-2">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                No showcase projects added yet
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Showcase deliverables from your favorite brand partnerships or self-produced media here.
              </p>
            </div>
          )}

          {/* Demographic Telemetry if present */}
          {creator.audienceBreakdown?.topLocations &&
            creator.audienceBreakdown.topLocations.length > 0 && (
              <SpatialCard surface={2} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-[var(--text-primary)]">Top Cities</h4>
                  <div className="space-y-2">
                    {creator.audienceBreakdown.topLocations.map((loc, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--text-secondary)]">{loc.city}</span>
                          <span className="font-mono text-[var(--text-secondary)]">{loc.pct}%</span>
                        </div>
                        <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${loc.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {creator.audienceBreakdown.ageSplit && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold text-[var(--text-primary)]">Age Split</h4>
                    <div className="space-y-2">
                      {creator.audienceBreakdown.ageSplit.map((a, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-secondary)]">{a.range}</span>
                            <span className="font-mono text-[var(--text-secondary)]">{a.pct}%</span>
                          </div>
                          <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[var(--primary)] h-full rounded-full"
                              style={{ width: `${a.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </SpatialCard>
            )}
        </div>
      )}

      {/* TAB 4: HISTORY (Verified Brand Reviews & Completed Projects) */}
      {activeTab === 'history' && (
        <div className="animate-fade-in">
          {creator.testimonials && creator.testimonials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creator.testimonials.map((t) => (
                <SpatialCard key={t.id} surface={2} className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">{t.brandName}</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {t.authorName} · {t.authorRole}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold font-mono">{t.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    "{t.comment}"
                  </p>
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] pt-1">
                    <span>{t.verifiedCampaign}</span>
                    <span>{t.date}</span>
                  </div>
                </SpatialCard>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[var(--surface-elevated)] border border-dashed border-[var(--border)] text-center space-y-2">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                No campaign reviews or history recorded yet
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Brand ratings and reviews from completed CreatorOS contracts will be verified and recorded here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
