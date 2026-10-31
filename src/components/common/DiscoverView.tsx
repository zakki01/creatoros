import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  UserPlus,
  Check,
  CheckCircle,
  Building,
  Clock,
  Play,
  Volume2,
  VolumeX,
  X,
  Send,
  ExternalLink,
  ShieldCheck,
  MapPin,
  TrendingUp,
  DollarSign,
  Layers,
  Film,
  Users,
  Briefcase,
  Copy,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Plus,
  Camera,
  PenTool,
  Flag,
  ArrowRight,
  BookOpen,
  MoreHorizontal,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { SocialPost, PostComment, FeedCategory, PostContentType } from '../../types/socialFeed';
import { ConnectModal } from './ConnectModal';
import { BrandProfileModal } from './BrandProfileModal';
import { PitchToBrandModal } from './PitchToBrandModal';
import { ApproachCreatorModal } from '../business/ApproachCreatorModal';
import { getRelationshipActions, RelationshipState } from '../../services/profileActionResolver';
import { CreatorProfile } from '../creator/CreatorProfile';
import { CreatePostModal } from './CreatePostModal';
import { BlogPostModal } from './BlogPostModal';
import { ReportContentModal } from './ReportContentModal';
import { MyPostsModal } from './MyPostsModal';
import { PostCard } from './PostCard';
import { CommentsView } from './CommentsView';
import { ShareModal } from './ShareModal';
import { PostDetailModal } from './PostDetailModal';
import { SpatialCard } from '../ui/SpatialCard';
import { SpatialEmptyState } from '../ui/SpatialEmptyState';
import { Avatar } from '../ui/Avatar';
import { Creator } from '../../types';
import { DEMO_BRAND_PROFILE } from '../../data/demoFixtures';

export const DiscoverView: React.FC = () => {
  const {
    socialPosts,
    togglePostLike,
    togglePostSave,
    connections,
    creators,
    triggerCelebration,
    setCreatorActiveTab,
    featureFlags,
    role,
    userProfile,
    outreachItems,
    authUser,
  } = useAppState();

  // Approach / Invite Creator Modal State
  const [approachTargetCreator, setApproachTargetCreator] = useState<Creator | null>(null);

  // Navigation & Sub-tabs: 'For You' | 'Creators' | 'Brands' | 'Reels' | 'Shots' | 'Blogs' | 'Trending'
  const [subTab, setSubTab] = useState<
    'for_you' | 'creators' | 'brands' | 'reels' | 'shots' | 'blogs' | 'trending'
  >('for_you');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedContentType, setSelectedContentType] = useState<string>('All');
  const [, setSelectedEngagement] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Modals & Panels State
  const [activeCommentPost, setActiveCommentPost] = useState<SocialPost | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<SocialPost | null>(null);
  const [selectedDetailPost, setSelectedDetailPost] = useState<SocialPost | null>(null);
  const [, setCopiedSharePostId] = useState<string | null>(null);
  const [connectTarget, setConnectTarget] = useState<{
    id: string;
    name: string;
    handle: string;
    avatar: string;
    role: 'creator' | 'business' | 'super_admin';
    category?: string;
  } | null>(null);

  const [selectedBrandModalData, setSelectedBrandModalData] = useState<any | null>(null);
  const [selectedCreatorModal, setSelectedCreatorModal] = useState<Creator | null>(null);
  const [pitchTargetBrand, setPitchTargetBrand] = useState<any | null>(null);

  // New Creation, Blog Reading, Reporting & Management Modals
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<SocialPost | null>(null);
  const [isMyPostsOpen, setIsMyPostsOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    id: string;
    type: 'post' | 'reel' | 'shot' | 'blog' | 'comment' | 'creator' | 'brand';
    title?: string;
    ownerId: string;
    ownerName: string;
  } | null>(null);

  // Video playback states
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Contextual More Menu
  const [openMoreMenuPostId, setOpenMoreMenuPostId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenMoreMenuPostId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filter Categories
  const categoryOptions = ['All', 'Streetwear & Sneakers', 'High Fashion', 'Tech & Lifestyle', 'Fitness', 'Art & UGC'];
  const locationOptions = ['All', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Goa'];

  // Brands Directory Data (Zero prefilled data for real users; controlled demo fixture for demo accounts)
  const isDemoSession = Boolean(authUser?.is_demo || authUser?.isDemo);
  const brandsDirectory = useMemo(() => {
    return isDemoSession ? [DEMO_BRAND_PROFILE] : [];
  }, [isDemoSession]);

  // Filtered Posts Calculation
  const filteredPosts = useMemo(() => {
    return socialPosts.filter((post) => {
      if (post.moderationStatus === 'removed' || post.moderationStatus === 'hidden') {
        return false;
      }
      if (post.postStatus && post.postStatus !== 'published') {
        return false;
      }

      if (subTab === 'reels' && (post.contentType !== 'reel' && !post.isReel)) return false;
      if (subTab === 'shots' && post.contentType !== 'shot') return false;
      if (subTab === 'blogs' && post.contentType !== 'blog') return false;
      if (subTab === 'brands' && post.authorType !== 'business') return false;
      if (subTab === 'creators' && post.authorType !== 'creator') return false;
      if (subTab === 'trending') {
        const isTrending = post.discoveryBadge?.includes('Trending') || post.likes > 1500;
        if (!isTrending) return false;
      }

      if (selectedContentType !== 'All') {
        const mapped = selectedContentType.toLowerCase();
        if (mapped === 'reels' && post.contentType !== 'reel' && !post.isReel) return false;
        if (mapped === 'shots' && post.contentType !== 'shot') return false;
        if (mapped === 'blogs' && post.contentType !== 'blog') return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          post.authorName.toLowerCase().includes(query) ||
          post.authorHandle.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          (post.blogTitle && post.blogTitle.toLowerCase().includes(query)) ||
          post.tags?.some((t) => t.toLowerCase().includes(query)) ||
          post.location?.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      if (selectedLocation !== 'All' && post.location) {
        if (!post.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      if (verifiedOnly && !post.authorVerified) {
        return false;
      }

      return true;
    });
  }, [socialPosts, subTab, searchQuery, selectedLocation, selectedContentType, verifiedOnly]);

  const handleShareClick = (post: SocialPost) => {
    const shareUrl = `${window.location.origin}/discover/post/${post.id}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedSharePostId(post.id);
    triggerCelebration();
    setTimeout(() => setCopiedSharePostId(null), 2500);
  };

  const handleOpenAuthorProfile = (post: SocialPost) => {
    if (post.authorType === 'business') {
      const brand = brandsDirectory.find((b) => b.id === post.authorId) || {
        id: post.authorId,
        name: post.authorName,
        handle: post.authorHandle,
        logo: post.authorAvatar,
        category: 'Streetwear & Lifestyle',
        location: post.location || 'Mumbai, India',
        bio: 'Official brand profile and campaign publishing partner.',
      };
      setSelectedBrandModalData(brand);
    } else {
      const creator = creators.find((c) => c.id === post.authorId) || creators[0];
      setSelectedCreatorModal(creator);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in font-sans relative">
      {/* 1. MINIMAL SPATIAL DISCOVER TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 font-display">
          Discover
        </h1>

        {/* Action Controls: [Search] [Filters] [+ Create] */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 rounded-xl surface-2 text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            aria-label="Filters"
            className={`min-h-[38px] px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              showFilterDrawer || selectedLocation !== 'All' || verifiedOnly || selectedContentType !== 'All'
                ? 'surface-3 border-[var(--primary)]/50 text-[var(--primary)]'
                : 'surface-2 text-zinc-700 hover:text-zinc-900'
            }`}
            title="Filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => setIsMyPostsOpen(true)}
            aria-label="My Posts"
            className="min-h-[38px] px-3 py-2 rounded-xl surface-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            title="My Posts"
          >
            <Bookmark className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {featureFlags.posting && (
            <button
              onClick={() => setIsCreatePostOpen(true)}
              aria-label="Create post"
              className="min-h-[38px] px-3.5 py-2 rounded-xl depth-btn-primary text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SPATIAL SUB-NAV TABS: For You | Creators | Brands | Reels | Shots | Blogs | Trending */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center p-1 rounded-2xl surface-2 gap-1 shrink-0">
          {[
            { id: 'for_you', label: 'For You', icon: Sparkles },
            { id: 'creators', label: 'Creators', icon: Users },
            { id: 'brands', label: 'Brands', icon: Briefcase },
            { id: 'reels', label: 'Reels', icon: Film },
            { id: 'shots', label: 'Shots', icon: Camera },
            { id: 'blogs', label: 'Blogs', icon: PenTool },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'depth-btn-primary text-white'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Location Pills */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          {locationOptions.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition-all cursor-pointer ${
                selectedLocation === loc
                  ? 'surface-3 text-[var(--text-primary)] border-[var(--accent)]/35'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface)] border border-[var(--border)]'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER DRAWER */}
      {showFilterDrawer && (
        <div className="p-4 rounded-2xl surface-3 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
            <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Filters</span>
            </span>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLocation('All');
                setSelectedContentType('All');
                setSelectedEngagement('All');
                setVerifiedOnly(false);
              }}
              className="text-[11px] text-zinc-500 hover:text-[var(--primary)]"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[10px] uppercase font-mono text-[var(--text-muted)] block mb-1">Format</label>
              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl p-1.5 text-xs text-[var(--text-primary)]"
              >
                <option value="All">All</option>
                <option value="Reels">Reels</option>
                <option value="Shots">Shots</option>
                <option value="Blogs">Blogs</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[var(--text-muted)] block mb-1">Niche</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl p-1.5 text-xs text-[var(--text-primary)]"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[var(--text-muted)] block mb-1">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl p-1.5 text-xs text-[var(--text-primary)]"
              >
                {locationOptions.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-xl bg-[var(--input)] shadow-sm border border-[var(--border)]">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-0"
                />
                <span className="text-xs text-[var(--text-primary)] font-medium">Verified</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB VIEWS */}

      {/* A. CREATORS TAB VIEW (Section 10 Spatial Creator Cards) */}
      {subTab === 'creators' && (
        <div className="space-y-4 animate-fade-in">
          {creators.length === 0 ? (
            <SpatialEmptyState
              objectType="gallery"
              title="No creators yet"
              subtitle="Verified creators will appear here as they publish showcases and join CreatorOS."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creators.map((c) => {
              const cState = connections[c.id] || 'connect';
              const isInvited = outreachItems?.some((item) => item.creatorId === c.id);
              const isCollaborating = cState === 'active_campaign';
              const relationshipState: RelationshipState = isCollaborating
                ? 'active'
                : isInvited
                ? 'invited'
                : cState === 'connected'
                ? 'connected'
                : 'none';

              const creatorActions = getRelationshipActions({
                viewerRole: role,
                profileRole: 'creator',
                isOwnProfile: userProfile?.id === c.id,
                relationshipState,
              });

              const latestWorkImg =
                c.portfolio?.[0]?.thumbnail ||
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80';

              return (
                <SpatialCard
                  key={c.id}
                  surface={2}
                  tilt
                  glare
                  glowColor="sky"
                  className="p-5 flex flex-col justify-between space-y-4"
                >
                  {/* Top: [Avatar] Name ✓ + Category · Location */}
                  <div className="flex items-center justify-between gap-3">
                    <div
                      onClick={() => setSelectedCreatorModal(c)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <Avatar
                        src={c.avatar}
                        name={c.name}
                        size="lg"
                        verified
                      />
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[var(--primary)] transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {c.niche} · {c.location.split(',')[0]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Concise Reputation & Projects Line */}
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-700">
                    <span className="text-emerald-700 font-semibold">96 Reputation</span>
                    <span className="text-zinc-600">·</span>
                    <span>{c.pastCampaignsCount || 12} Projects</span>
                  </div>

                  {/* Latest Work Visual Preview */}
                  <div
                    onClick={() => setSelectedCreatorModal(c)}
                    className="relative h-40 w-full rounded-2xl overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)] cursor-pointer group/img"
                  >
                    <img
                      src={latestWorkImg}
                      alt={`${c.name} latest work`}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-[10px] font-mono text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-black/[0.08]">
                      Latest Work
                    </span>
                  </div>

                  {/* Actions: [View] [Action via Resolver] */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <button
                      onClick={() => setSelectedCreatorModal(c)}
                      className="px-3.5 py-1.5 rounded-xl depth-btn-secondary text-xs font-semibold text-zinc-800 hover:text-zinc-950 transition-all cursor-pointer"
                    >
                      View
                    </button>

                    {/* Brand viewing Creator: [Invite] / [Invitation Sent] / [Active] */}
                    {creatorActions.primaryAction === 'invite_campaign' && (
                      creatorActions.primaryButton?.disabled ? (
                        <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{creatorActions.primaryButton.label}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setApproachTargetCreator(c)}
                          className="px-4 py-1.5 rounded-xl depth-btn-primary text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Invite</span>
                        </button>
                      )
                    )}

                    {/* Creator viewing Creator: [Connect] / [Connected] */}
                    {creatorActions.primaryAction === 'connect' && (
                      cState === 'connected' ? (
                        <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setConnectTarget({
                              id: c.id,
                              name: c.name,
                              handle: c.handle,
                              avatar: c.avatar,
                              role: 'creator',
                              category: c.category,
                            })
                          }
                          className="px-4 py-1.5 rounded-xl depth-btn-primary text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </button>
                      )
                    )}
                  </div>
                </SpatialCard>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* B. BRANDS TAB VIEW (Spatial Brand Cards) */}
      {subTab === 'brands' && (
        <div className="space-y-4 animate-fade-in">
          {brandsDirectory.length === 0 ? (
            <SpatialEmptyState
              objectType="brief"
              title="No brands yet"
              subtitle="Partner brands and open briefs will be listed here once verified."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {brandsDirectory.map((b) => {
              const bState = connections[b.id] || 'connect';
              const brandActions = getRelationshipActions({
                viewerRole: role,
                profileRole: 'business',
                isOwnProfile: userProfile?.id === b.id,
                relationshipState: bState === 'connected' ? 'connected' : 'none',
              });
              return (
                <SpatialCard
                  key={b.id}
                  surface={2}
                  tilt
                  glare
                  glowColor="sky"
                  className="p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      onClick={() => setSelectedBrandModalData(b)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <Avatar
                        src={b.logo}
                        name={b.name}
                        size="lg"
                        verified
                      />
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[var(--primary)] transition-colors">
                          {b.name}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {b.category} · {b.location}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30">
                      {b.badge}
                    </span>
                  </div>

                  {/* Cover Image + Brief Overlay */}
                  <div
                    onClick={() => setSelectedBrandModalData(b)}
                    className="relative h-36 w-full rounded-2xl overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)] cursor-pointer group/cover"
                  >
                    <img
                      src={b.coverUrl}
                      alt={b.name}
                      className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase text-amber-800 block">
                          Open Brief
                        </span>
                        <p className="text-xs font-semibold text-white truncate">
                          {b.openBrief}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 shrink-0">
                        {b.avgBudget}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <button
                      onClick={() => setSelectedBrandModalData(b)}
                      className="px-3.5 py-1.5 rounded-xl depth-btn-secondary text-xs font-semibold text-zinc-800 hover:text-zinc-950 transition-all cursor-pointer"
                    >
                      View
                    </button>

                    {/* Creator viewing Brand: [Pitch to Brand] */}
                    {brandActions.primaryAction === 'pitch' && (
                      <button
                        onClick={() => setPitchTargetBrand(b)}
                        className="px-4 py-1.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Pitch to Brand</span>
                      </button>
                    )}

                    {/* Brand viewing Brand: [Connect] / [Connected] */}
                    {brandActions.primaryAction === 'connect' && (
                      bState === 'connected' ? (
                        <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setConnectTarget({
                              id: b.id,
                              name: b.name,
                              handle: b.handle,
                              avatar: b.logo,
                              role: 'business',
                              category: b.category,
                            })
                          }
                          className="px-4 py-1.5 rounded-xl depth-btn-primary text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <Building className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </button>
                      )
                    )}
                  </div>
                </SpatialCard>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* C. REELS TAB VIEW */}
      {subTab === 'reels' && (
        <div className="space-y-4 animate-fade-in">
          {filteredPosts.filter((p) => p.isReel || p.contentType === 'reel').length === 0 ? (
            <SpatialEmptyState
              objectType="camera"
              title="No reels yet"
              subtitle="Upload 9:16 vertical reels and cinematic edits to inspire the community."
              actionLabel="Create Reel"
              onAction={() => setIsCreatePostOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredPosts
                .filter((p) => p.isReel || p.contentType === 'reel')
                .map((reel) => {
                const isPlaying = playingVideoId === reel.id;
                const authorConnected = connections[reel.authorId] || 'connect';

                return (
                  <div
                    key={reel.id}
                    className="relative rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] aspect-[9/16] group shadow-xl flex flex-col justify-between"
                  >
                    {isPlaying && reel.videoUrl ? (
                      <video
                        src={reel.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={reel.mediaUrl}
                        alt={reel.content}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/40 pointer-events-none" />

                    {/* Top Bar on Reel */}
                    <div className="relative z-10 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-black/[0.08]">
                          🎬 Reel
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/[0.08]">
                          {reel.duration || '0:30'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPlayingVideoId(isPlaying ? null : reel.id)}
                          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-all cursor-pointer"
                          title={isPlaying ? 'Pause video' : 'Play video'}
                        >
                          {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>

                        {/* Hick's Law: Contextual More Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMoreMenuPostId(openMoreMenuPostId === reel.id ? null : reel.id);
                            }}
                            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-white flex items-center justify-center transition-all cursor-pointer"
                            title="More options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openMoreMenuPostId === reel.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-9 w-44 rounded-xl bg-[var(--surface-elevated)] shadow-lg border border-[var(--border)] p-1 z-30 animate-slide-up text-left text-[var(--text-primary)]"
                            >
                              <button
                                onClick={() => {
                                  handleShareClick(reel);
                                  setOpenMoreMenuPostId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                              >
                                <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                                <span>Copy Link</span>
                              </button>
                              <button
                                onClick={() => {
                                  setReportTarget({
                                    id: reel.id,
                                    type: 'reel',
                                    title: reel.content,
                                    ownerId: reel.authorId,
                                    ownerName: reel.authorName,
                                  });
                                  setOpenMoreMenuPostId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                              >
                                <Flag className="w-3.5 h-3.5 text-rose-400" />
                                <span>Report Reel</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Floating Stack */}
                    <div className="relative z-10 p-3.5 flex items-end justify-between gap-3">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div
                          onClick={() => handleOpenAuthorProfile(reel)}
                          className="flex items-center gap-2 cursor-pointer group/author"
                        >
                          <img
                            src={reel.authorAvatar}
                            alt={reel.authorName}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-white/30"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white truncate block group-hover/author:text-[#7DE4F1]">
                              {reel.authorName}
                            </span>
                            <span className="text-[10px] text-zinc-700 font-mono block">
                              {reel.authorHandle}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-white/95 line-clamp-2 leading-snug">
                          {reel.content}
                        </p>

                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-black/55 text-white/90 px-2 py-1 rounded-md backdrop-blur-sm w-fit max-w-full truncate">
                          <Volume2 className="w-3 h-3 shrink-0 text-[var(--primary)]" />
                          <span className="truncate">Original Sound • Anamorphic Master</span>
                        </div>
                      </div>

                      {/* Right Action Stack */}
                      <div className="flex flex-col items-center gap-3 shrink-0">
                        <button
                          onClick={() => togglePostLike(reel.id)}
                          className="flex flex-col items-center gap-1 cursor-pointer"
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                              reel.likedByMe
                                ? 'bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/40'
                                : 'bg-black/60 text-white hover:bg-black/90'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${reel.likedByMe ? 'fill-current' : ''}`} />
                          </div>
                          <span className="text-[10px] font-mono text-white">
                            {(reel.likes / 1000).toFixed(1)}k
                          </span>
                        </button>

                        <button
                          onClick={() => setActiveCommentPost(reel)}
                          className="flex flex-col items-center gap-1 cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-all">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono text-white">
                            {reel.commentsCount}
                          </span>
                        </button>

                        <button
                          onClick={() => setActiveSharePost(reel)}
                          className="flex flex-col items-center gap-1 cursor-pointer"
                          title="Share reel"
                        >
                          <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-all">
                            <Share2 className="w-4 h-4" />
                          </div>
                        </button>

                        <button
                          onClick={() => togglePostSave(reel.id)}
                          className="flex flex-col items-center gap-1 cursor-pointer"
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                              reel.savedByMe
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-black/60 text-white hover:bg-black/90'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${reel.savedByMe ? 'fill-current' : ''}`} />
                          </div>
                        </button>

                        {authorConnected === 'connected' ? (
                          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-500/40 text-emerald-700 flex items-center justify-center" title="Connected">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setConnectTarget({
                                id: reel.authorId,
                                name: reel.authorName,
                                handle: reel.authorHandle,
                                avatar: reel.authorAvatar,
                                role: reel.authorType,
                              })
                            }
                            className="w-9 h-9 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center justify-center shadow-lg shadow-teal-900/20 cursor-pointer"
                            title="Connect"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          )}
        </div>
      )}

      {/* D. DEFAULT FEED: For You / Shots / Blogs / Trending */}
      {(subTab === 'for_you' || subTab === 'shots' || subTab === 'blogs' || subTab === 'trending') && (
        <div className="space-y-6 max-w-xl mx-auto">
          {filteredPosts.length === 0 ? (
            <SpatialEmptyState
              objectType="camera"
              title="Feed is quiet"
              subtitle="Be the first to share a Reel, Shot, or Blog with the CreatorOS community."
              actionLabel="Create Post"
              onAction={() => setIsCreatePostOpen(true)}
            />
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onOpenComments={(p) => setActiveCommentPost(p)}
                onOpenShare={(p) => setActiveSharePost(p)}
                onOpenDetail={(p) => setSelectedDetailPost(p)}
                onOpenConnect={(target) => setConnectTarget(target)}
                onOpenAuthorProfile={(authorId) => {
                  const creator = creators.find((c) => c.id === authorId);
                  if (creator) {
                    setSelectedCreatorModal(creator);
                  } else {
                    const brand = brandsDirectory.find((b) => b.id === authorId);
                    if (brand) setSelectedBrandModalData(brand);
                  }
                }}
                onReportPost={(p) =>
                  setReportTarget({
                    id: p.id,
                    type: p.isReel ? 'reel' : p.contentType === 'blog' ? 'blog' : 'shot',
                    title: p.content,
                    ownerId: p.authorId,
                    ownerName: p.authorName,
                  })
                }
              />
            ))
          )}
        </div>
      )}

      {/* MOBILE COMPACT FLOATING ACTION BUTTON */}
      {featureFlags.posting && (
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="sm:hidden fixed bottom-6 right-6 z-40 w-13 h-13 rounded-full bg-[var(--primary)] text-white shadow-xl shadow-teal-900/20 flex items-center justify-center hover:bg-[var(--primary)] active:scale-95 transition-all border border-[var(--primary)]/30 cursor-pointer"
          title="Create Post"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* CONTEXTUAL COMMENTS EXPERIENCE (Desktop Right Panel + Mobile Bottom Sheet) */}
      {activeCommentPost && (
        <CommentsView
          post={
            socialPosts.find((p) => p.id === activeCommentPost.id) || activeCommentPost
          }
          onClose={() => setActiveCommentPost(null)}
        />
      )}

      {/* COMPACT SOCIAL SHARE SHEET */}
      {activeSharePost && (
        <ShareModal
          post={activeSharePost}
          onClose={() => setActiveSharePost(null)}
          onNavigateToMessages={() => setCreatorActiveTab && setCreatorActiveTab('messages')}
        />
      )}

      {/* POST DETAIL MODAL (No duplicate text, clean detail & brief deep dive) */}
      {selectedDetailPost && (
        <PostDetailModal
          post={
            socialPosts.find((p) => p.id === selectedDetailPost.id) || selectedDetailPost
          }
          onClose={() => setSelectedDetailPost(null)}
          onOpenConnect={() => {
            setConnectTarget({
              id: selectedDetailPost.authorId,
              name: selectedDetailPost.authorName,
              handle: selectedDetailPost.authorHandle,
              avatar: selectedDetailPost.authorAvatar,
              role: selectedDetailPost.authorType,
            });
          }}
        />
      )}

      {/* 5. CREATE POST COMPOSER MODAL */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      {/* 6. BLOG ARTICLE READING MODAL */}
      <BlogPostModal
        isOpen={!!selectedBlogPost}
        post={selectedBlogPost}
        onClose={() => setSelectedBlogPost(null)}
      />

      {/* 7. MY POSTS MANAGEMENT MODAL */}
      <MyPostsModal
        isOpen={isMyPostsOpen}
        onClose={() => setIsMyPostsOpen(false)}
        onOpenCreateNew={() => setIsCreatePostOpen(true)}
      />

      {/* 8. REPORT CONTENT MODAL */}
      <ReportContentModal
        isOpen={!!reportTarget}
        target={reportTarget}
        onClose={() => setReportTarget(null)}
      />

      {/* 9. CONNECT MODAL */}
      <ConnectModal
        isOpen={!!connectTarget}
        onClose={() => setConnectTarget(null)}
        target={connectTarget}
      />

      {/* 10. BRAND PROFILE MODAL */}
      <BrandProfileModal
        isOpen={!!selectedBrandModalData}
        onClose={() => setSelectedBrandModalData(null)}
        brandData={selectedBrandModalData || undefined}
        onOpenMessage={() => {
          setSelectedBrandModalData(null);
          setCreatorActiveTab('messages');
        }}
      />

      {/* 10b. PITCH TO BRAND MODAL */}
      <PitchToBrandModal
        isOpen={!!pitchTargetBrand}
        onClose={() => setPitchTargetBrand(null)}
        brandData={
          pitchTargetBrand || {
            id: 'brand-aura',
            name: 'Aura Streetwear Co.',
            handle: '@aurastreetwear',
            logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
            category: 'Streetwear & Lifestyle',
          }
        }
      />

      {/* 10c. APPROACH / INVITE CREATOR MODAL */}
      {approachTargetCreator && (
        <ApproachCreatorModal
          isOpen={!!approachTargetCreator}
          onClose={() => setApproachTargetCreator(null)}
          creator={approachTargetCreator}
          onSuccess={() => {
            setApproachTargetCreator(null);
            triggerCelebration();
          }}
        />
      )}

      {/* 11. CREATOR PROFILE MODAL */}
      {selectedCreatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] p-6 shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCreatorModal(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:text-white hover:bg-black/90 transition-all cursor-pointer backdrop-blur-sm border border-black/[0.08]"
            >
              <X className="w-4 h-4" />
            </button>

            <CreatorProfile
              creatorData={selectedCreatorModal}
              isPublicView={true}
              onOpenMessage={() => {
                setSelectedCreatorModal(null);
                setCreatorActiveTab('messages');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
