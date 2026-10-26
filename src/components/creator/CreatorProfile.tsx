import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Share2,
  MapPin,
  Sparkles,
  Star,
  Eye,
  Heart,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  LogOut,
  Plus,
  Play,
  Film,
  Layers,
  BarChart3,
  MessageSquare,
  UserPlus,
  Check,
  Clock,
  X,
  ExternalLink,
  Pin,
  Camera,
  BookOpen,
  FileText,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { SpatialCard } from '../ui/SpatialCard';
import { SpatialEmptyState } from '../ui/SpatialEmptyState';
import { InstagramIcon, YouTubeIcon } from '../common/PlatformIcons';
import { AgeVerificationModal } from './AgeVerificationModal';
import { ConnectModal } from '../common/ConnectModal';
import { BlogPostModal } from '../common/BlogPostModal';
import { Creator } from '../../types';
import { SocialPost } from '../../types/socialFeed';

interface CreatorProfileProps {
  creatorData?: Creator;
  isPublicView?: boolean;
  onOpenMessage?: (creatorId: string) => void;
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({
  creatorData,
  isPublicView = false,
  onOpenMessage,
}) => {
  const {
    creators,
    socialPosts,
    togglePostPin,
    triggerCelebration,
    ageVerification,
    role,
    connections,
    addCreatorShowcase,
    setCreatorActiveTab,
  } = useAppState();

  const creator = creatorData || creators[0]; // Default Rohan Sharma

  // Tabs: Showcase, Reels, Shots, Blogs, Campaigns, About, Analytics
  const [activeTab, setActiveTab] = useState<'showcase' | 'reels' | 'shots' | 'blogs' | 'campaigns' | 'about' | 'analytics'>('showcase');
  const [copied, setCopied] = useState(false);
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAddShowcaseOpen, setIsAddShowcaseOpen] = useState(false);
  const [selectedBlogModal, setSelectedBlogModal] = useState<SocialPost | null>(null);

  const creatorShots = socialPosts.filter(
    (p) =>
      p.contentType === 'shot' &&
      (p.authorHandle === creator.handle || (p.authorRole || p.authorType) === 'creator')
  );

  const creatorBlogs = socialPosts.filter(
    (p) =>
      p.contentType === 'blog' &&
      (p.authorHandle === creator.handle || (p.authorRole || p.authorType) === 'creator')
  );

  // New Showcase Form State
  const [showcaseTitle, setShowcaseTitle] = useState('');
  const [showcaseType, setShowcaseType] = useState('Reel');
  const [showcaseCampaign, setShowcaseCampaign] = useState('');
  const [showcaseThumbnail, setShowcaseThumbnail] = useState(
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80'
  );
  const [showcaseViews, setShowcaseViews] = useState('180000');
  const [showcaseEngagement, setShowcaseEngagement] = useState('12000');

  const connectionState = connections[creator.id] || 'connect';
  const isOwnProfile = role === 'creator' && !isPublicView && creator.id === 'cr-01';

  const publicUrl = `https://creatoros.com/creator/${creator.handle.replace('@', '')}`;

  const handleShare = () => {
    navigator.clipboard?.writeText?.(publicUrl);
    setCopied(true);
    triggerCelebration();
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCreateShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseTitle.trim()) return;

    const newItem = {
      id: `port-${Date.now()}`,
      title: showcaseTitle,
      type: showcaseType,
      campaignName: showcaseCampaign || 'Independent Production',
      thumbnail: showcaseThumbnail,
      views: parseInt(showcaseViews) || 120000,
      engagement: parseInt(showcaseEngagement) || 8500,
    };

    addCreatorShowcase(creator.id, newItem);
    setIsAddShowcaseOpen(false);
    setShowcaseTitle('');
    setShowcaseCampaign('');
  };

  const handleMessageClick = () => {
    if (onOpenMessage) {
      onOpenMessage(creator.id);
    } else {
      setCreatorActiveTab('messages');
    }
  };

  const tabs = [
    { id: 'showcase', label: 'Showcase' },
    { id: 'reels', label: 'Reels' },
    { id: 'shots', label: `Shots (${creatorShots.length})` },
    { id: 'blogs', label: `Blogs (${creatorBlogs.length})` },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'about', label: 'About' },
    { id: 'analytics', label: 'Analytics' },
  ];

  // Specific reel mock items
  const reelsList = [
    {
      id: 'cr-r1',
      title: 'Macro Sole Texture & 4K Lighting Grade',
      brand: 'Aura Streetwear Co.',
      views: '240K',
      engagement: '14.2K',
      duration: '0:34',
      thumbnail: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'cr-r2',
      title: 'Jordan Retro High Restomod Showcase',
      brand: 'UrbanKicks India',
      views: '380K',
      engagement: '22.8K',
      duration: '0:48',
      thumbnail: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'cr-r3',
      title: 'Monochrome Streetwear Transitions',
      brand: 'Aura Streetwear Co.',
      views: '190K',
      engagement: '11.5K',
      duration: '0:28',
      thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* 1. Digital Portfolio Spatial Hero Header */}
      <SpatialCard
        surface={3}
        glowColor="purple"
        className="p-5 sm:p-7 space-y-5 relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(124,92,255,0.45) 0%, rgba(56,189,248,0.15) 60%, transparent 80%)',
          }}
        />

        {/* Top: 3D Avatar, Name, Category, Location & Availability */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <Avatar
              src={creator.avatar}
              name={creator.name}
              size="2xl"
              verified={creator.verified}
              ring="primary"
              className="rounded-2xl"
            />
            <div className="min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display tracking-tight">
                  {creator.name}
                </h1>
                {creator.verified && (
                  <span className="text-emerald-700 font-bold text-sm" title="Verified Creator">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 font-medium mt-0.5">
                {creator.category || 'Sneaker & Streetwear'} Creator
              </p>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{creator.location}</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">{creator.availability}</span>
              </p>
            </div>
          </div>

          {/* Concise Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-stretch sm:self-auto justify-end">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setCreatorActiveTab('passport')}
                  className="depth-btn-secondary flex-1 sm:flex-none min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-500/30 text-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Passport</span>
                </button>

                <button
                  onClick={handleShare}
                  className="depth-btn-secondary flex-1 sm:flex-none min-h-[40px] px-3.5 py-2 rounded-xl text-xs text-zinc-800 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  onClick={() => setIsAddShowcaseOpen(true)}
                  className="depth-btn-primary flex-1 sm:flex-none min-h-[40px] px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Work</span>
                </button>
              </>
            ) : (
              <>
                {connectionState === 'connected' ? (
                  <button
                    disabled
                    className="flex-1 sm:flex-none min-h-[42px] px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Connected</span>
                  </button>
                ) : connectionState === 'pending' ? (
                  <button
                    disabled
                    className="flex-1 sm:flex-none min-h-[42px] px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-500/30 text-amber-800 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="depth-btn-primary flex-1 sm:flex-none min-h-[42px] px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                )}

                <button
                  onClick={handleMessageClick}
                  className="depth-btn-secondary flex-1 sm:flex-none min-h-[42px] px-3.5 py-2 rounded-xl text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => {
                    window.history.pushState({}, '', `/brand/contracts/new?creatorId=${creator.id}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="depth-btn-primary flex-1 sm:flex-none min-h-[42px] px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Create Contract</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4 Spatial Reputation & Portfolio Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 relative z-10">
          <div className="p-3 rounded-xl surface-2 text-center">
            <span className="text-base sm:text-lg font-bold font-mono text-[#007E93] block">
              96
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">Reputation</span>
          </div>
          <div className="p-3 rounded-xl surface-2 text-center">
            <span className="text-base sm:text-lg font-bold font-mono text-zinc-900 block">
              {(creator.totalFollowers / 1000).toFixed(0)}K
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">Followers</span>
          </div>
          <div className="p-3 rounded-xl surface-2 text-center">
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-700 block">
              {creator.avgEngagement}%
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">Engagement</span>
          </div>
          <div className="p-3 rounded-xl surface-2 text-center">
            <span className="text-base sm:text-lg font-bold font-mono text-zinc-900 block">
              12
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">Campaigns</span>
          </div>
        </div>
      </SpatialCard>

      {/* Spatial Tabs Pill Bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl surface-1 border border-white/[0.07] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'surface-3 text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ABOUT */}
      {activeTab === 'about' && (
        <div className="space-y-6 animate-fade-in">
          {/* Bio & Badges Card */}
          <div className="p-5 rounded-2xl surface-2 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider font-mono">
              Biography
            </h3>
            <p className="text-xs text-zinc-700 leading-relaxed max-w-3xl">
              {creator.bio}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {creator.verifiedBadges.map((badge, idx) => (
                <Badge key={idx} variant="success" size="sm">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {badge}
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Social Platform Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {creator.platforms.map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl surface-2 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {p.platform === 'Instagram' ? (
                      <InstagramIcon className="w-5 h-5 text-pink-400" />
                    ) : (
                      <YouTubeIcon className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800">{p.platform}</h4>
                      <span className="text-[11px] text-zinc-500 font-mono">{p.handle}</span>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-2">
                  <div className="p-2.5 rounded-lg surface-1">
                    <span className="text-[10px] text-zinc-500 uppercase">Followers</span>
                    <p className="text-sm font-bold font-mono text-zinc-900">
                      {(p.followers / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg surface-1">
                    <span className="text-[10px] text-zinc-500 uppercase">Engagement</span>
                    <p className="text-sm font-bold font-mono text-emerald-700">
                      {p.engagementRate}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audited Commercial Ledger */}
          <div className="p-5 rounded-2xl surface-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider font-mono">
                Reputation Metrics
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                96 Reputation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl surface-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">On-Time Delivery</span>
                <span className="text-lg font-bold text-zinc-900 font-mono mt-1 block">98%</span>
              </div>
              <div className="p-3.5 rounded-xl surface-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Brief Compliance</span>
                <span className="text-lg font-bold text-zinc-900 font-mono mt-1 block">99%</span>
              </div>
              <div className="p-3.5 rounded-xl surface-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Response Time</span>
                <span className="text-lg font-bold text-zinc-900 font-mono mt-1 block">2.1h</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHOWCASE (Featured Work Gallery with 3D Spatial Depth) */}
      {activeTab === 'showcase' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-zinc-900 font-display">
              Featured Work
            </h2>
            <button
              onClick={() => setIsAddShowcaseOpen(true)}
              className="depth-btn-primary px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Work</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {creator.portfolio.map((p) => (
              <SpatialCard
                key={p.id}
                surface={2}
                interactive
                tilt
                glare
                className="overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden bg-[#DFE3E8]">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[#007E93] border border-white/15">
                      {p.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between text-xs text-white">
                    <span className="font-mono font-semibold">{(p.views / 1000).toFixed(0)}K views</span>
                    <span className="font-mono text-emerald-700 font-semibold">{(p.engagement / 1000).toFixed(1)}K</span>
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="text-xs font-bold text-zinc-900 line-clamp-1">{p.title}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{p.campaignName}</p>
                </div>
              </SpatialCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REELS */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          {reelsList.map((reel) => (
            <SpatialCard
              key={reel.id}
              surface={2}
              interactive
              tilt
              className="group relative overflow-hidden aspect-[9/16]"
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-between p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-sm">
                    {reel.duration}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#007E93] font-mono">{reel.brand}</span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {reel.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-700 font-mono pt-1">
                    <span>{reel.views} plays</span>
                    <span className="text-emerald-700">{reel.engagement} likes</span>
                  </div>
                </div>
              </div>
            </SpatialCard>
          ))}
        </div>
      )}

      {/* TAB: SHOTS (High-Res Photography) */}
      {activeTab === 'shots' && (
        <div className="space-y-4 animate-fade-in">
          {creatorShots.length === 0 ? (
            <SpatialEmptyState
              objectType="gallery"
              title="No Shots Yet"
              subtitle="Publish high-resolution photography to showcase your visual style."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {creatorShots.map((shot) => (
                <div
                  key={shot.id}
                  className="group relative rounded-2xl overflow-hidden surface-2 aspect-[4/5] hover:border-black/15 transition-all cursor-pointer"
                >
                  <img
                    src={shot.mediaUrl}
                    alt={shot.content || shot.caption || 'Shot image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/60 text-white backdrop-blur-sm">
                        SHOT
                      </span>
                      {isOwnProfile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePostPin(shot.id);
                          }}
                          className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
                            shot.isPinned
                              ? 'bg-amber-500 text-zinc-950 font-bold'
                              : 'bg-black/60 text-white hover:text-white'
                          }`}
                          title={shot.isPinned ? 'Unpin shot' : 'Pin shot to profile'}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-800 line-clamp-2 leading-tight">
                        {shot.content || shot.caption}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                        <span>{shot.likesCount || shot.likes || 0} likes</span>
                        <span>{shot.commentsCount} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: BLOGS (Editorial Long-Form Articles) */}
      {activeTab === 'blogs' && (
        <div className="space-y-4 animate-fade-in">
          {creatorBlogs.length === 0 ? (
            <SpatialEmptyState
              objectType="document"
              title="No Blogs Yet"
              subtitle="Write editorial breakdowns and creative essays."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creatorBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => setSelectedBlogModal(blog)}
                  className="rounded-2xl bg-white border border-black/[0.08] shadow-sm hover:border-black/15 p-5 flex flex-col justify-between space-y-4 transition-all group cursor-pointer"
                >
                  <div className="space-y-3">
                    {blog.blogCoverImage && (
                      <div className="h-44 rounded-xl overflow-hidden bg-[#DFE3E8]">
                        <img
                          src={blog.blogCoverImage}
                          alt={blog.blogTitle || 'Blog cover'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                      <span className="px-2 py-0.5 rounded bg-white border border-black/[0.08] text-zinc-700">
                        ✍ {blog.blogReadingTime || '5 min read'}
                      </span>
                      <span>{new Date(blog.createdAt || blog.timestamp || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-[#007E93] transition-colors line-clamp-2 leading-snug">
                      {blog.blogTitle || blog.content || blog.caption}
                    </h3>

                    <p className="text-xs text-zinc-500 font-light line-clamp-2 leading-relaxed">
                      {blog.content || blog.caption}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-zinc-500">
                      {blog.likesCount || blog.likes || 0} claps • {blog.commentsCount} comments
                    </span>
                    <span className="text-sky-400 group-hover:text-sky-300 font-medium text-xs flex items-center gap-1">
                      <span>Read Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-fade-in">
          {/* Brand Collabs */}
          <div className="p-5 rounded-2xl bg-white border border-black/[0.08] shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider font-mono">
              Completed Brand Partnerships
            </h3>

            <div className="space-y-3">
              {[
                {
                  brand: 'Aura Streetwear Co.',
                  campaign: 'Summer Collection Lookbook',
                  status: 'Completed & Paid',
                  deliverables: '1x 4K Reel + 2x Stories',
                  payout: '₹40,000',
                  rating: 5.0,
                  comment: 'Exceptional visual polish. Rohan delivered 3 days ahead of schedule.',
                },
                {
                  brand: 'UrbanKicks India',
                  campaign: 'Sneaker Retro Launch Series',
                  status: 'Completed & Paid',
                  deliverables: '2x High-res Carousels',
                  payout: '₹35,000',
                  rating: 5.0,
                  comment: 'Top performing creator on this campaign. High CTR on tracking link.',
                },
              ].map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-900 text-sm">{c.brand}</span>
                      <p className="text-[11px] text-zinc-500">{c.campaign}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700">{c.payout}</span>
                      <span className="block text-[10px] text-emerald-500 font-mono">Verified Escrow</span>
                    </div>
                  </div>
                  <p className="text-zinc-700 italic pt-1">"{c.comment}"</p>
                  <div className="flex items-center gap-1 text-amber-800 text-[11px]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono font-bold">{c.rating}.0</span>
                    <span className="text-zinc-500 ml-1">• {c.deliverables}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Audience Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-black/[0.08] shadow-sm space-y-3 text-xs">
              <h3 className="font-semibold text-zinc-800">Top Locations</h3>
              {creator.audienceBreakdown.topLocations.map((loc, idx) => (
                <div key={idx} className="flex justify-between text-zinc-500 py-1 border-b border-zinc-200/60">
                  <span>{loc.city}</span>
                  <span className="font-mono text-zinc-800">{loc.pct}%</span>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.08] shadow-sm space-y-3 text-xs">
              <h3 className="font-semibold text-zinc-800">Age Bracket</h3>
              {creator.audienceBreakdown.ageSplit.map((age, idx) => (
                <div key={idx} className="flex justify-between text-zinc-500 py-1 border-b border-zinc-200/60">
                  <span>{age.range} years</span>
                  <span className="font-mono text-zinc-800">{age.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Standard Rate Card */}
          <div className="p-5 rounded-2xl bg-white border border-black/[0.08] shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider font-mono">
              Standard Commercial Rates
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {Object.entries(creator.rateCard).map(([fmt, fee]) => (
                <div key={fmt} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                  <span className="text-zinc-500 block">{fmt}</span>
                  <span className="text-base font-bold font-mono text-zinc-900 mt-1 block">
                    ₹{fee?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 18+ Verification Modal */}
      <AgeVerificationModal
        isOpen={isAgeModalOpen}
        onClose={() => setIsAgeModalOpen(false)}
      />

      {/* Connect Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        target={{
          id: creator.id,
          name: creator.name,
          handle: creator.handle,
          avatar: creator.avatar,
          role: 'creator',
          category: creator.category,
        }}
      />

      {/* Add Showcase Modal */}
      {isAddShowcaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-md rounded-2xl bg-white border border-black/[0.08] p-6 shadow-2xl text-zinc-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddShowcaseOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#007E93]" />
              <h3 className="text-base font-bold text-zinc-900">Add Showcase Work</h3>
            </div>
            <p className="text-xs text-zinc-500">
              Highlight your latest high-impact reel, editorial lookbook, or campaign deliverable.
            </p>

            <form onSubmit={handleCreateShowcase} className="space-y-3.5 pt-1">
              <div>
                <label className="text-xs text-zinc-700 font-medium block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={showcaseTitle}
                  onChange={(e) => setShowcaseTitle(e.target.value)}
                  placeholder="e.g. Summer Streetwear Color Grade Reel"
                  className="w-full rounded-xl bg-white border border-zinc-300 p-2.5 text-xs text-zinc-900 shadow-xs focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] placeholder-zinc-500 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs text-zinc-700 font-medium block mb-1">
                    Deliverable Format
                  </label>
                  <select
                    value={showcaseType}
                    onChange={(e) => setShowcaseType(e.target.value)}
                    className="w-full rounded-xl bg-white border border-zinc-300 p-2.5 text-xs text-zinc-900 shadow-xs focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/60"
                  >
                    <option value="Reel">4K Reel</option>
                    <option value="Carousel">In-Feed Carousel</option>
                    <option value="Lookbook">Editorial Lookbook</option>
                    <option value="Story Series">Story Series</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-700 font-medium block mb-1">
                    Brand / Client
                  </label>
                  <input
                    type="text"
                    value={showcaseCampaign}
                    onChange={(e) => setShowcaseCampaign(e.target.value)}
                    placeholder="e.g. Aura Streetwear Co."
                    className="w-full rounded-xl bg-white border border-zinc-300 p-2.5 text-xs text-zinc-900 shadow-xs focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] placeholder-zinc-500 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-700 font-medium block mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={showcaseThumbnail}
                  onChange={(e) => setShowcaseThumbnail(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl bg-white border border-zinc-300 p-2.5 text-xs text-zinc-900 shadow-xs focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] placeholder-zinc-500 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs text-zinc-700 font-medium block mb-1">
                    Verified Plays / Views
                  </label>
                  <input
                    type="number"
                    value={showcaseViews}
                    onChange={(e) => setShowcaseViews(e.target.value)}
                    className="w-full rounded-xl bg-white border border-zinc-300 p-2.5 text-xs text-zinc-900 shadow-xs focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/60"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-700 font-medium block mb-1">
                    Engagement Count
                  </label>
                  <input
                    type="number"
                    value={showcaseEngagement}
                    onChange={(e) => setShowcaseEngagement(e.target.value)}
                    className="w-full rounded-xl bg-white border border-zinc-300 p-2.5 text-xs text-zinc-900 shadow-xs focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddShowcaseOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-500 hover:text-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#007E93] hover:bg-[#006779] shadow-sm shadow-teal-900/20 cursor-pointer"
                >
                  Publish to Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Article Reader Modal */}
      {selectedBlogModal && (
        <BlogPostModal
          post={selectedBlogModal}
          isOpen={Boolean(selectedBlogModal)}
          onClose={() => setSelectedBlogModal(null)}
        />
      )}
    </div>
  );
};
