import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { ConnectModal } from './ConnectModal';
import { BlogPostModal } from './BlogPostModal';
import { PitchToBrandModal } from './PitchToBrandModal';
import { ShareProfileModal } from './ShareProfileModal';
import { resolveProfileActions } from '../../services/profileActionResolver';
import { Send, Share2 } from 'lucide-react';
import { SocialPost } from '../../types/socialFeed';

interface BrandProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandData?: {
    id: string;
    name: string;
    handle: string;
    logo: string;
    coverUrl?: string;
    bio?: string;
    location?: string;
    category?: string;
    activeCampaignsCount?: number;
    creatorsPartnered?: number;
    avgBudget?: string;
  };
  onOpenMessage?: (brandId: string) => void;
}

export const BrandProfileModal: React.FC<BrandProfileModalProps> = ({
  isOpen,
  onClose,
  brandData = {
    id: 'brand-aura',
    name: 'Aura Streetwear Co.',
    handle: '@aurastreetwear',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80',
    bio: 'Contemporary streetwear and urban aesthetics crafted for modern subcultures. We collaborate with visionary creators, sneaker collectors, and digital artists across India.',
    location: 'Mumbai & Bengaluru, India',
    category: 'Streetwear & Lifestyle',
    activeCampaignsCount: 3,
    creatorsPartnered: 52,
    avgBudget: '₹35,000 – ₹75,000',
  },
  onOpenMessage,
}) => {
  const { connections, socialPosts, setCreatorActiveTab, role, userProfile } = useAppState();
  const [activeTab, setActiveTab] = useState<'about' | 'content' | 'reels' | 'shots' | 'blogs' | 'campaigns'>('about');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedBlogModal, setSelectedBlogModal] = useState<SocialPost | null>(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [targetCampaignPitch, setTargetCampaignPitch] = useState<string | undefined>(undefined);

  const isOwnProfile = userProfile?.id === brandData.id;
  const profileActions = resolveProfileActions({
    viewerRole: role,
    profileRole: 'business',
    isOwnProfile,
  });

  const brandShots = socialPosts.filter(
    (p) =>
      p.contentType === 'shot' &&
      (p.authorHandle === brandData.handle || (p.authorRole || p.authorType) === 'business')
  );

  const brandBlogs = socialPosts.filter(
    (p) =>
      p.contentType === 'blog' &&
      (p.authorHandle === brandData.handle || (p.authorRole || p.authorType) === 'business')
  );

  if (!isOpen) return null;

  const connectionState = connections[brandData.id] || 'connect';

  const sampleBrandPosts = [
    {
      id: 'b-p1',
      title: 'Summer Drop 2026 Lookbook',
      creator: 'Rohan Sharma (@rohan.kicks)',
      thumbnail: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
      views: '142K',
      engagement: '6.4%',
    },
    {
      id: 'b-p2',
      title: 'Monochrome Streetwear Cut',
      creator: 'Aanya Deshmukh (@aanya_style)',
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      views: '89K',
      engagement: '5.8%',
    },
    {
      id: 'b-p3',
      title: 'Night Shift Sneaker Macro',
      creator: 'Kabir Verma (@kabir.creates)',
      thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
      views: '210K',
      engagement: '7.1%',
    },
  ];

  const sampleReels = [
    {
      id: 'r-1',
      title: 'Seamless Fit Transition',
      creator: '@rohan.kicks',
      thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&auto=format&fit=crop&q=80',
      views: '340K',
    },
    {
      id: 'r-2',
      title: 'Unboxing Neon Limited Pack',
      creator: '@aanya_style',
      thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
      views: '185K',
    },
  ];

  const sampleCampaigns = [
    {
      id: 'camp-aura-1',
      title: 'Summer Collection — Lookbook & Transitions',
      budget: '₹35,000 – ₹60,000 / deliverable',
      deliverables: '1x 4K Reel + 2x Stories',
      deadline: 'Oct 24, 2026',
      niche: 'Streetwear, Sneakers & Editorial',
      status: 'Accepting Pitches',
    },
    {
      id: 'camp-aura-2',
      title: 'Monochrome Cargo Series',
      budget: '₹40,000 flat',
      deliverables: '2x High-res In-feed Carousels',
      deadline: 'Nov 05, 2026',
      niche: 'High Fashion & UGC',
      status: 'Scouting 3 Creators',
    },
  ];

  const handleMessageClick = () => {
    onClose();
    if (onOpenMessage) {
      onOpenMessage(brandData.id);
    } else {
      setCreatorActiveTab('messages');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-hidden">
        <div
          className="relative w-full h-full sm:h-auto max-h-full sm:max-h-[92vh] max-w-3xl rounded-none sm:rounded-3xl bg-[var(--surface-elevated)] text-[var(--text-primary)] border-0 sm:border border-[var(--border)] shadow-2xl overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close brand profile"
            className="absolute top-3 right-3 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 text-white hover:text-white hover:bg-black/90 transition-all cursor-pointer backdrop-blur-sm border border-[var(--border)]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Cover Banner */}
          <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-[var(--surface-subtle)]">
            <img
              src={brandData.coverUrl || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80'}
              alt={brandData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c11] via-black/40 to-transparent" />
          </div>

          {/* Profile Header Info */}
          <div className="px-6 pb-4 -mt-12 relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-3.5">
                <img
                  src={brandData.logo}
                  alt={brandData.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#0c0c11] shadow-xl bg-[var(--surface-subtle)] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[var(--text-primary)] font-display">{brandData.name}</h2>
                    <span className="p-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-mono">{brandData.handle}</p>
                  <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
                    <span>{brandData.location}</span>
                    <span>•</span>
                    <span className="text-[var(--primary)]">{brandData.category}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons (Strict Profile Relationship Resolution) */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Primary: Pitch to Brand */}
                {profileActions.canPitch && (
                  <button
                    onClick={() => {
                      setTargetCampaignPitch(undefined);
                      setIsPitchModalOpen(true);
                    }}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Pitch to Brand</span>
                  </button>
                )}

                {/* Share Profile */}
                {profileActions.canShare && (
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="min-h-[42px] px-3 py-2 rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-muted)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>Share</span>
                  </button>
                )}

                {/* Direct Message */}
                {profileActions.canMessage && (
                  <button
                    onClick={handleMessageClick}
                    className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-muted)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>Message</span>
                  </button>
                )}

                {/* Connect is strictly guarded by relationship resolver (Never allowed for Creator -> Brand) */}
                {profileActions.canConnect && (
                  connectionState === 'connected' ? (
                    <button
                      disabled
                      className="min-h-[42px] px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Connected ✓</span>
                    </button>
                  ) : connectionState === 'pending' ? (
                    <button
                      disabled
                      className="min-h-[42px] px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-500/30 text-amber-800 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsConnectModalOpen(true)}
                      className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-recessed)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Open Briefs</span>
                <span className="text-sm font-bold text-[var(--text-primary)] font-mono mt-0.5 block">
                  {brandData.activeCampaignsCount} Active
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Creators Partnered</span>
                <span className="text-sm font-bold text-[var(--text-primary)] font-mono mt-0.5 block">
                  {brandData.creatorsPartnered}+ Creators
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Avg Rate / Creator</span>
                <span className="text-sm font-bold text-emerald-700 font-mono mt-0.5 block">
                  {brandData.avgBudget}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Payment Escrow</span>
                <span className="text-sm font-bold text-[var(--primary)] font-mono mt-0.5 block">
                  100% Guaranteed
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-[var(--border)] pt-1 overflow-x-auto">
              {[
                { id: 'about', label: 'About', icon: Info },
                { id: 'content', label: 'Content', icon: Layers },
                { id: 'reels', label: 'Reels', icon: Film },
                { id: 'shots', label: `Shots (${brandShots.length})`, icon: Camera },
                { id: 'blogs', label: `Blogs (${brandBlogs.length})`, icon: BookOpen },
                { id: 'campaigns', label: 'Campaigns', icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'border-[var(--primary)] text-[var(--primary-hover)]'
                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            <div className="pt-2 min-h-[220px]">
              {/* ABOUT TAB */}
              {activeTab === 'about' && (
                <div className="space-y-4 text-xs animate-fade-in">
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">
                      Brand Overview
                    </h4>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{brandData.bio}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
                    <h5 className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>Creator Collaboration Standards</span>
                    </h5>
                    <ul className="space-y-1 text-[var(--text-muted)] text-[11px] list-disc list-inside">
                      <li>4K vertical resolution (9:16) with color grading approved against brand palette.</li>
                      <li>Turnaround within 5–7 business days with up to 1 creative revision included.</li>
                      <li>Escrow released within 24 hours of final content delivery and validation.</li>
                      <li>Whitelisting / dark-posting usage rights covered under standard license.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* CONTENT TAB */}
              {activeTab === 'content' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                  {sampleBrandPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group rounded-xl overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all"
                    >
                      <div className="relative h-28 overflow-hidden">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-1.5 left-2 right-2 flex justify-between text-[10px] text-[var(--text-secondary)] font-mono">
                          <span>{post.views} views</span>
                          <span className="text-emerald-700">{post.engagement}</span>
                        </div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{post.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">{post.creator}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* REELS TAB */}
              {activeTab === 'reels' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
                  {sampleReels.map((reel) => (
                    <div
                      key={reel.id}
                      className="group relative rounded-xl overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)] aspect-[9/16]"
                    >
                      <img
                        src={reel.thumbnail}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                        <span className="text-[10px] text-[var(--primary)] font-mono">{reel.creator}</span>
                        <p className="text-xs font-semibold text-white leading-tight line-clamp-2">
                          {reel.title}
                        </p>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1">{reel.views} plays</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SHOTS TAB */}
              {activeTab === 'shots' && (
                <div className="space-y-3 animate-fade-in">
                  {brandShots.length === 0 ? (
                    <div className="p-8 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-1">
                      <Camera className="w-6 h-6 text-[var(--text-secondary)] mx-auto" />
                      <p className="text-xs text-[var(--text-muted)]">No photography shots published by brand yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {brandShots.map((shot) => (
                        <div
                          key={shot.id}
                          className="group relative rounded-xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] aspect-[4/5]"
                        >
                          <img
                            src={shot.mediaUrl}
                            alt={shot.content || shot.caption || 'Shot image'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                            <p className="text-[11px] text-[var(--text-primary)] line-clamp-2">{shot.content || shot.caption}</p>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1">{shot.likesCount || shot.likes || 0} likes</span>
                          </div>
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
                    <div className="p-8 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-1">
                      <BookOpen className="w-6 h-6 text-[var(--text-secondary)] mx-auto" />
                      <p className="text-xs text-[var(--text-muted)]">No editorial articles published by brand yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {brandBlogs.map((blog) => (
                        <div
                          key={blog.id}
                          onClick={() => setSelectedBlogModal(blog)}
                          className="rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] p-3.5 space-y-2 cursor-pointer group transition-all"
                        >
                          {blog.blogCoverImage && (
                            <div className="h-28 rounded-lg overflow-hidden bg-[var(--surface-subtle)]">
                              <img
                                src={blog.blogCoverImage}
                                alt={blog.blogTitle || 'Cover'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                            <span>✍ {blog.blogReadingTime || '4 min read'}</span>
                            <span>•</span>
                            <span>{new Date(blog.createdAt || blog.timestamp || Date.now()).toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-hover)] transition-colors line-clamp-1">
                            {blog.blogTitle || blog.content || blog.caption}
                          </h4>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 font-light">
                            {blog.content || blog.caption}
                          </p>
                          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px]">
                            <span className="text-[var(--text-muted)] font-mono">{blog.likesCount || blog.likes || 0} claps</span>
                            <span className="text-[var(--primary)] group-hover:text-[#005564] font-medium flex items-center gap-1">
                              Read Article →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CAMPAIGNS TAB */}
              {activeTab === 'campaigns' && (
                <div className="space-y-3 animate-fade-in">
                  {sampleCampaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[var(--border-strong)] transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[var(--text-primary)]">{camp.title}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-500/20">
                            {camp.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Deliverables: <strong className="text-[var(--text-primary)]">{camp.deliverables}</strong> • Niche: {camp.niche}
                        </p>
                        <p className="text-[10px] font-mono text-[var(--text-muted)]">
                          Deadline: {camp.deadline}
                        </p>
                      </div>

                      <div className="flex items-center sm:flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-bold font-mono text-emerald-700">
                          {camp.budget}
                        </span>
                        <button
                          onClick={() => {
                            setTargetCampaignPitch(camp.title);
                            setIsPitchModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Pitch for this Brief</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pitch to Brand Modal */}
      <PitchToBrandModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        brandData={{
          id: brandData.id,
          name: brandData.name,
          handle: brandData.handle,
          logo: brandData.logo,
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
          avatar: brandData.logo,
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
          avatar: brandData.logo,
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
