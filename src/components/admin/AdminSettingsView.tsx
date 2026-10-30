import React, { useState } from 'react';
import {
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Sliders,
  Zap,
  Server,
  Lock,
  Layers,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { PlatformFeatureFlags, PlatformSettings } from '../../types/socialFeed';

export const AdminSettingsView: React.FC = () => {
  const {
    featureFlags,
    toggleFeatureFlag,
    platformSettings,
    updatePlatformSettings,
    logAdminAction,
    triggerCelebration,
  } = useAppState();

  const [localSettings, setLocalSettings] = useState<PlatformSettings>({ ...platformSettings });
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (key: keyof PlatformFeatureFlags, label: string) => {
    toggleFeatureFlag(key);
    const nextVal = !featureFlags[key];
    logAdminAction(
      nextVal ? 'ENABLE_FEATURE_FLAG' : 'DISABLE_FEATURE_FLAG',
      key,
      'flag',
      nextVal ? 'success' : 'warning',
      `Feature flag ${label} turned ${nextVal ? 'ON' : 'OFF'}`
    );
    triggerCelebration();
  };

  const handleSaveOperationalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings(localSettings);
    logAdminAction(
      'UPDATE_OPERATIONAL_SETTINGS',
      'system_config',
      'system',
      'success',
      `Operational thresholds saved: MaxVideo=${localSettings.maxVideoSizeMb}MB, RateLimit=${localSettings.rateLimitPerMinute}req/m`
    );
    setIsSaved(true);
    triggerCelebration();
    setTimeout(() => setIsSaved(false), 3000);
  };

  const flagSections = [
    {
      title: 'Discovery & Social Feed Modules',
      description: 'Control user discovery, feed feeds, and publishing formats across the app.',
      flags: [
        { key: 'discover' as const, label: 'Discover Public Feed', desc: 'Allows all users to browse community reels, shots, and blogs.' },
        { key: 'posting' as const, label: 'Post Creation Engine', desc: 'Master switch allowing creators and brands to publish new posts.' },
        { key: 'reels' as const, label: 'Vertical Video Reels (9:16)', desc: 'Short-form cinematic video uploads and vertical player.' },
        { key: 'shots' as const, label: 'Editorial Photography Shots', desc: 'High-res photography showcases and image aspect ratio engine.' },
        { key: 'blogs' as const, label: 'Long-Form Editorial Blogs', desc: 'Rich Markdown articles, reading views, and cover imagery.' },
      ],
    },
    {
      title: 'Social Engagement & Networking',
      description: 'Fine-tune community interaction, commenting, reactions, and direct connections.',
      flags: [
        { key: 'connections' as const, label: 'Professional Connect System', desc: 'Allows creators and brands to establish mutual business connections.' },
        { key: 'messaging' as const, label: 'Direct Messages & Chat', desc: 'Peer-to-peer real-time direct messaging with attachments and emojis.' },
        { key: 'comments' as const, label: 'Post Comments & Discussions', desc: 'User discussion threads beneath published feed items.' },
        { key: 'likes' as const, label: 'Likes & Claps System', desc: 'Interaction reaction buttons on posts and articles.' },
        { key: 'sharing' as const, label: 'Social Sharing & Links', desc: 'Share sheet generation for external referrals.' },
        { key: 'saves' as const, label: 'Collections & Bookmarks', desc: 'Personal moodboards and saved deliverables.' },
      ],
    },
    {
      title: 'Monetization & Compliance Governance',
      description: 'Regulate financial transactions, milestone escrows, and KYB/KYC verification.',
      flags: [
        { key: 'campaigns' as const, label: 'Campaign Marketplace', desc: 'Brand campaign briefs, discovery, and creator pitching engine.' },
        { key: 'creatorVerification' as const, label: 'Mandatory Creator Verification', desc: 'Requires 18+ age verification and government ID before accepting brand deals.' },
        { key: 'brandVerification' as const, label: 'Mandatory Brand KYB', desc: 'Requires business registry validation before publishing campaigns.' },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-[var(--text-primary)]">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight">
          Platform Governance &amp; Feature Controls
        </h2>
        <p className="text-xs text-[var(--text-secondary)] font-sans font-light">
          Real-time toggles across 14 platform sub-systems, rate limits, upload quotas, and emergency protocols.
        </p>
      </div>

      {/* Feature Flags Bento Groups */}
      <div className="space-y-6">
        {flagSections.map((sec, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-xs space-y-4"
          >
            <div className="border-b border-[var(--border)] pb-3">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-wide font-mono uppercase">
                {sec.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
                {sec.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {sec.flags.map((flag) => {
                const isActive = featureFlags[flag.key];

                return (
                  <div
                    key={flag.key}
                    onClick={() => handleToggle(flag.key, flag.label)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isActive
                        ? 'bg-[var(--surface-elevated)] border-[var(--accent)]/40 hover:border-[var(--accent)] shadow-xs'
                        : 'bg-[var(--surface-muted)]/50 border-[var(--border)] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-[var(--text-primary)] block">
                          {flag.label}
                        </span>
                        <p className="text-[11px] text-[var(--text-muted)] font-light leading-snug">
                          {flag.desc}
                        </p>
                      </div>

                      <div className="shrink-0 mt-0.5">
                        {isActive ? (
                          <div className="w-9 h-5 rounded-full bg-[var(--accent)] p-0.5 flex items-center justify-end">
                            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                          </div>
                        ) : (
                          <div className="w-9 h-5 rounded-full bg-[var(--surface-muted)] p-0.5 flex items-center justify-start border border-[var(--border)]">
                            <div className="w-4 h-4 rounded-full bg-[var(--text-muted)] shadow-xs" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[10px] font-mono">
                      <span className="text-[var(--text-muted)]">Status</span>
                      <span className={isActive ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'text-[var(--text-muted)]'}>
                        {isActive ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Operational Thresholds & Server Form */}
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-wide font-mono uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              Operational Limits &amp; Parameters
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
              Set file upload constraints, network rate limiting, and escrow platform commissions.
            </p>
          </div>

          {isSaved && (
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings Applied
            </span>
          )}
        </div>

        <form onSubmit={handleSaveOperationalSettings} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--text-muted)] uppercase">
              Max Reel Video Upload
            </label>
            <div className="relative">
              <input
                type="number"
                value={localSettings.maxVideoSizeMb}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, maxVideoSizeMb: parseInt(e.target.value) || 100 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                MB
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Default: 500 MB per video</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--text-muted)] uppercase">
              Max Blog Word Count
            </label>
            <div className="relative">
              <input
                type="number"
                value={localSettings.maxBlogWords}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, maxBlogWords: parseInt(e.target.value) || 2000 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                words
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Default: 10,000 words</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--text-muted)] uppercase">
              Rate Limit / User
            </label>
            <div className="relative">
              <input
                type="number"
                value={localSettings.rateLimitPerMinute}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, rateLimitPerMinute: parseInt(e.target.value) || 60 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                req/min
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Protects against automated scraping</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--text-muted)] uppercase">
              Escrow Platform Fee
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={5}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-xs text-[var(--text-muted)]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                % fee
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Configured in smart contracts</span>
          </div>

          <div className="md:col-span-2 lg:col-span-4 pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-sans font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Operational Parameters</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
