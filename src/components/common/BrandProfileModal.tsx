import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Sparkles,
  MessageSquare,
  UserPlus,
  Check,
  Clock,
  Layers,
  Film,
  Info,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Award,
  Camera,
  BookOpen,
  Edit3,
  Send,
  Share2,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { ConnectModal } from './ConnectModal';
import { BlogPostModal } from './BlogPostModal';
import { PitchToBrandModal } from './PitchToBrandModal';
import { ShareProfileModal } from './ShareProfileModal';
import { EditBrandProfileModal } from '../business/EditBrandProfileModal';
import { resolveProfileActions } from '../../services/profileActionResolver';
import { supabase } from '../../services/supabaseClient';
import { SocialPost } from '../../types/socialFeed';

export interface BrandData {
  id: string;
  name: string;
  handle: string;
  logo?: string;
  coverUrl?: string;
  bio?: string;
  location?: string;
  category?: string;
  website?: string;
  activeCampaignsCount?: number;
  creatorsPartnered?: number;
  avgBudget?: string;
}

interface BrandProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandData?: BrandData;
  brandId?: string;
  onOpenMessage?: (brandId: string) => void;
}

export const BrandProfileModal: React.FC<BrandProfileModalProps> = ({
  isOpen,
  onClose,
  brandData: incomingBrandData,
  brandId,
  onOpenMessage,
}) => {
  const { connections, socialPosts, campaigns, role, userProfile } = useAppState();
  const [activeTab, setActiveTab] = useState<'about' | 'content' | 'reels' | 'shots' | 'blogs' | 'campaigns'>('about');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedBlogModal, setSelectedBlogModal] = useState<SocialPost | null>(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditBrandModalOpen, setIsEditBrandModalOpen] = useState(false);
  const [targetCampaignPitch, setTargetCampaignPitch] = useState<string | undefined>(undefined);
  const [fetchedBrand, setFetchedBrand] = useState<BrandData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine target brand ID
  const effectiveId = incomingBrandData?.id || brandId || (role === 'business' ? userProfile?.id : undefined);

  // Fetch brand profile if only brandId was passed and not provided directly
  useEffect(() => {
    if (!isOpen) return;

    if (incomingBrandData) {
      setFetchedBrand(null);
      return;
    }

    if (!effectiveId) return;

    // If viewing own brand profile
    if (role === 'business' && userProfile?.id === effectiveId) {
      setFetchedBrand({
        id: userProfile.id,
        name: userProfile.title || userProfile.name,
        handle: userProfile.handle || '@brand',
        logo: userProfile.avatarUrl || '',
        coverUrl: userProfile.coverUrl || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        category: userProfile.industry || 'Retail & Lifestyle',
        website: userProfile.website || '',
        activeCampaignsCount: campaigns.filter((c) => c.brandId === userProfile.id).length,
        creatorsPartnered: 0,
        avgBudget: '₹25,000 – ₹50,000',
      });
      return;
    }

    // Fetch from Supabase
    setIsLoading(true);
    const fetchBrand = async () => {
      try {
        const { data: bProfile } = await supabase
          .from('brand_profiles')
          .select('*, profiles(*)')
          .eq('id', effectiveId)
          .maybeSingle();

        if (bProfile) {
          const profile = bProfile.profiles || {};
          setFetchedBrand({
            id: bProfile.id,
            name: bProfile.company_name || profile.display_name || 'Brand',
            handle: bProfile.handle || `@${(bProfile.company_name || 'brand').toLowerCase().replace(/\s+/g, '')}`,
            logo: profile.avatar_url || '',
            coverUrl: bProfile.cover_url || profile.cover_url || '',
            bio: bProfile.bio || '',
            location: bProfile.location || '',
            category: bProfile.industry || 'Retail & Lifestyle',
            website: bProfile.website || '',
            activeCampaignsCount: campaigns.filter((c) => c.brandId === bProfile.id).length,
            creatorsPartnered: 0,
            avgBudget: '₹25,000 – ₹50,000',
          });
        }
      } catch (err) {
        console.warn('Failed to load brand profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [isOpen, incomingBrandData, effectiveId, role, userProfile, campaigns]);

  if (!isOpen) return null;

  const brandData = incomingBrandData || fetchedBrand;

  if (!brandData && !isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
        <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl p-6 text-center max-w-sm w-full space-y-3">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Brand profile not found</p>
          <p className="text-xs text-[var(--text-secondary)]">The requested brand workspace does not exist or has been removed.</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold cursor-pointer hover:bg-[var(--primary)]/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!brandData) {
    return null;
  }

  const isOwnProfile = userProfile?.id === brandData.id;
  const profileActions = resolveProfileActions({
    viewerRole: role,
    profileRole: 'business',
    isOwnProfile,
  });

  const connectionState = connections[brandData.id] || 'connect';

  const brandCampaigns = campaigns.filter((c) => c.brandId === brandData.id);
  const brandPosts = socialPosts.filter(
    (p) => p.authorId === brandData.id || p.authorHandle === brandData.handle
  );
  const brandReels = brandPosts.filter((p) => p.contentType === 'reel');
  const brandShots = brandPosts.filter((p) => p.contentType === 'shot');
  const brandBlogs = brandPosts.filter((p) => p.contentType === 'blog');

  const handleMessageClick = () => {
    if (onOpenMessage) {
      onOpenMessage(brandData.id);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 text-[var(--text-primary)]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
            aria-label="Close brand profile"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Cover Banner */}
          <div className="relative h-36 sm:h-48 md:h-56 w-full bg-[var(--surface-subtle)] overflow-hidden">
            {brandData.coverUrl ? (
              <img
                src={brandData.coverUrl}
                alt={brandData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[var(--primary)]/20 via-[var(--surface-subtle)] to-[var(--accent)]/10" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-elevated)] via-transparent to-transparent opacity-90" />
          </div>

          {/* Profile Header Info */}
          <div className="px-4 sm:px-6 pb-6 -mt-12 sm:-mt-14 relative z-10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3.5 sm:gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-[var(--surface-elevated)] shadow-xl bg-[var(--surface-subtle)] overflow-hidden shrink-0 flex items-center justify-center">
                  {brandData.logo ? (
                    <img
                      src={brandData.logo}
                      alt={brandData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-[var(--primary)] font-display">
                      {brandData.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
                      {brandData.name}
                    </h2>
                    <span className="p-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono">{brandData.handle}</p>
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 flex-wrap pt-0.5">
                    {brandData.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                        <span>{brandData.location}</span>
                      </span>
                    )}
                    {brandData.location && <span>•</span>}
                    <span className="text-[var(--primary)] font-medium">{brandData.category || 'Brand'}</span>
                    {brandData.website && (
                      <>
                        <span>•</span>
                        <a
                          href={brandData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-[var(--text-secondary)] inline-flex items-center gap-1"
                        >
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                {isOwnProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditBrandModalOpen(true)}
                      className="col-span-1 sm:col-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:bg-[var(--primary)]/90"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Brand Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsShareModalOpen(true)}
                      className="col-span-1 sm:col-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-muted)] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Share</span>
                    </button>
                  </>
                ) : (
                  <>
                    {profileActions.canPitch && (
                      <button
                        type="button"
                        onClick={() => {
                          setTargetCampaignPitch(undefined);
                          setIsPitchModalOpen(true);
                        }}
                        className="col-span-2 sm:col-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                        <span>Pitch to Brand</span>
                      </button>
                    )}

                    {profileActions.canMessage && (
                      <button
                        type="button"
                        onClick={handleMessageClick}
                        className="col-span-1 sm:col-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-muted)] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>Message</span>
                      </button>
                    )}

                    {profileActions.canShare && (
                      <button
                        type="button"
                        onClick={() => setIsShareModalOpen(true)}
                        className="col-span-1 sm:col-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-muted)] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>Share</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--surface-muted)]/70 border border-[var(--border)]">
              <div className="p-3 rounded-xl bg-[var(--surface-card)]/50 border border-[var(--border)]/40 flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Active Campaigns
                </span>
                <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-mono mt-1 block">
                  {brandCampaigns.length} Active
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] mt-0.5">Verified Opportunities</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-card)]/50 border border-[var(--border)]/40 flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Industry Focus
                </span>
                <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-mono mt-1 block truncate">
                  {brandData.category || 'General'}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] mt-0.5">Primary Vertical</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-card)]/50 border border-[var(--border)]/40 flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Escrow Guarantee
                </span>
                <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                  100% Locked
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] mt-0.5">Milestone Protection</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-card)]/50 border border-[var(--border)]/40 flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Response Time
                </span>
                <span className="text-sm sm:text-base font-bold text-[var(--primary)] font-mono mt-1 block">
                  &lt; 24 Hours
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] mt-0.5">Direct Brief Channel</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[var(--border)] pt-2 overflow-x-auto no-scrollbar scroll-smooth">
              {[
                { id: 'about', label: 'About', icon: Info },
                { id: 'campaigns', label: `Campaigns (${brandCampaigns.length})`, icon: Award },
                { id: 'content', label: `Posts (${brandPosts.length})`, icon: Layers },
                { id: 'reels', label: `Reels (${brandReels.length})`, icon: Film },
                { id: 'shots', label: `Shots (${brandShots.length})`, icon: Camera },
                { id: 'blogs', label: `Blogs (${brandBlogs.length})`, icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'border-[var(--primary)] text-[var(--primary)]'
                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            <div className="pt-2 min-h-[200px]">
              {/* ABOUT TAB */}
              {activeTab === 'about' && (
                <div className="space-y-4 text-xs animate-fade-in">
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">
                      Brand Overview
                    </h4>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {brandData.bio || 'This brand has not provided a public overview yet.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
                    <h5 className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>Creator Collaboration Standards</span>
                    </h5>
                    <ul className="space-y-1 text-[var(--text-muted)] text-[11px] list-disc list-inside">
                      <li>Clear deliverable briefs with pre-funded milestone escrow on contract signing.</li>
                      <li>Standard turnaround within agreed schedule with transparent feedback loops.</li>
                      <li>Instant payout release upon deliverable verification and sign-off.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* CAMPAIGNS TAB */}
              {activeTab === 'campaigns' && (
                <div className="space-y-3 animate-fade-in">
                  {brandCampaigns.length === 0 ? (
                    <div className="p-8 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-2">
                      <Award className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                      <p className="text-xs font-medium text-[var(--text-secondary)]">No active campaigns currently open for pitches.</p>
                      <p className="text-[11px] text-[var(--text-muted)]">Check back soon or message the brand directly to discuss custom partnerships.</p>
                    </div>
                  ) : (
                    brandCampaigns.map((camp) => (
                      <div
                        key={camp.id}
                        className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[var(--border-strong)] transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[var(--text-primary)]">{camp.name || camp.title}</h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              Active
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            Budget: <strong className="text-[var(--text-primary)]">₹{camp.budget?.toLocaleString() || 'Negotiable'}</strong>
                          </p>
                        </div>

                        {role === 'creator' && (
                          <button
                            type="button"
                            onClick={() => {
                              setTargetCampaignPitch(camp.name || camp.title);
                              setIsPitchModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs self-start sm:self-center"
                          >
                            <Send className="w-3 h-3" />
                            <span>Pitch for this Brief</span>
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* CONTENT TAB */}
              {activeTab === 'content' && (
                <div className="space-y-3 animate-fade-in">
                  {brandPosts.length === 0 ? (
                    <div className="p-8 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-2">
                      <Layers className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                      <p className="text-xs font-medium text-[var(--text-secondary)]">No public content published by brand yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {brandPosts.map((post) => (
                        <div
                          key={post.id}
                          className="group rounded-xl overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)] p-3 space-y-2"
                        >
                          {post.mediaUrl && (
                            <div className="h-28 rounded-lg overflow-hidden bg-[var(--surface-subtle)]">
                              <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <p className="text-xs text-[var(--text-primary)] line-clamp-2">{post.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* REELS TAB */}
              {activeTab === 'reels' && (
                <div className="space-y-3 animate-fade-in">
                  {brandReels.length === 0 ? (
                    <div className="p-8 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-2">
                      <Film className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                      <p className="text-xs font-medium text-[var(--text-secondary)]">No video reels published yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {brandReels.map((reel) => (
                        <div key={reel.id} className="relative rounded-xl overflow-hidden aspect-[9/16] bg-black">
                          <img src={reel.mediaUrl} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex flex-col justify-end text-white text-[11px]">
                            <p className="line-clamp-2">{reel.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SHOTS TAB */}
              {activeTab === 'shots' && (
                <div className="space-y-3 animate-fade-in">
                  {brandShots.length === 0 ? (
                    <div className="p-8 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-2">
                      <Camera className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                      <p className="text-xs font-medium text-[var(--text-secondary)]">No photography shots published yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {brandShots.map((shot) => (
                        <div key={shot.id} className="rounded-xl overflow-hidden aspect-[4/5] bg-[var(--surface-subtle)]">
                          <img src={shot.mediaUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* BLOGS TAB */}
              {activeTab === 'blogs' && (
                <div className="space-y-3 animate-fade-in">
                  {brandBlogs.length === 0 ? (
                    <div className="p-8 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-2">
                      <BookOpen className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                      <p className="text-xs font-medium text-[var(--text-secondary)]">No editorial articles published yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {brandBlogs.map((blog) => (
                        <div
                          key={blog.id}
                          onClick={() => setSelectedBlogModal(blog)}
                          className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-3.5 space-y-2 cursor-pointer group"
                        >
                          <h4 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                            {blog.blogTitle || blog.content}
                          </h4>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{blog.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Brand Profile Modal (When Own Profile) */}
      {isEditBrandModalOpen && (
        <EditBrandProfileModal
          isOpen={isEditBrandModalOpen}
          onClose={() => setIsEditBrandModalOpen(false)}
          initialData={{
            name: brandData.name,
            handle: brandData.handle,
            industry: brandData.category,
            bio: brandData.bio,
            website: brandData.website,
            location: brandData.location,
            avatarUrl: brandData.logo,
            coverUrl: brandData.coverUrl,
          }}
        />
      )}

      {/* Pitch to Brand Modal */}
      <PitchToBrandModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        brandData={{
          id: brandData.id,
          name: brandData.name,
          handle: brandData.handle,
          logo: brandData.logo || '',
          category: brandData.category,
        }}
        initialCampaignTitle={targetCampaignPitch}
      />

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profileData={{
          id: brandData.id,
          name: brandData.name,
          handle: brandData.handle,
          avatar: brandData.logo || '',
          role: 'business',
          category: brandData.category,
          bio: brandData.bio,
          verified: true,
        }}
      />

      {/* Connect Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        target={{
          id: brandData.id,
          name: brandData.name,
          handle: brandData.handle,
          avatar: brandData.logo || '',
          role: 'business',
          category: brandData.category,
        }}
      />

      {/* Blog Article Reader Modal */}
      {selectedBlogModal && (
        <BlogPostModal
          post={selectedBlogModal}
          isOpen={Boolean(selectedBlogModal)}
          onClose={() => setSelectedBlogModal(null)}
        />
      )}
    </>
  );
};
