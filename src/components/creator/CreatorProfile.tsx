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
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
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
    logout,
    ageVerification,
    role,
    connections,
    addCreatorShowcase,
    setCreatorActiveTab,
  } = useAppState();

  const creator = creatorData || creators[0]; // Default Rohan Sharma

  // Tabs: Showcase, Reels, Shots, Blogs, About & Bio, Campaigns, Analytics
  const [activeTab, setActiveTab] = useState<'showcase' | 'reels' | 'shots' | 'blogs' | 'about' | 'campaigns' | 'analytics'>('showcase');
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
    { id: 'about', label: 'About & Bio' },
    { id: 'campaigns', label: 'Campaigns' },
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
      {/* Unified Hero Profile Header (Mobile-first, clean hierarchy) */}
      <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        {/* Top: Avatar, Name, Handle, Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-lg shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-white font-display">
                  {creator.name}
                </h1>
                {creator.verified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <Badge variant="success" size="sm" dot>
                  Verified Pro
                </Badge>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {creator.handle} • Sneaker historian
              </p>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{creator.location}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{creator.availability}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-stretch sm:self-auto justify-end">
            {isOwnProfile ? (
              <>
                <button
                  onClick={handleShare}
                  className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{copied ? 'Copied Link!' : 'Share Profile'}</span>
                </button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsAgeModalOpen(true)}
                  leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  className="flex-1 sm:flex-none min-h-[44px] text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 cursor-pointer"
                >
                  {ageVerification.ageVerified ? '18+ Verified' : 'Verify Age'}
                </Button>

                <button
                  onClick={() => setIsAddShowcaseOpen(true)}
                  className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Work</span>
                </button>
              </>
            ) : (
              <>
                {connectionState === 'connected' ? (
                  <button
                    disabled
                    className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Connected ✓</span>
                  </button>
                ) : connectionState === 'pending' ? (
                  <button
                    disabled
                    className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                  </button>
                ) : connectionState === 'active_campaign' ? (
                  <button
                    disabled
                    className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Active Campaign</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Connect</span>
                  </button>
                )}

                <button
                  onClick={handleMessageClick}
                  className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Message</span>
                </button>

                <button
                  onClick={handleShare}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                  title="Share profile link"
                  aria-label="Share profile link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-none">
          {creator.bio}
        </p>

        {/* Key Stats Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-center">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">Followers</span>
            <p className="text-sm sm:text-base font-bold font-mono text-zinc-100 mt-0.5">
              {(creator.totalFollowers / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-center">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">Engagement</span>
            <p className="text-sm sm:text-base font-bold font-mono text-emerald-400 mt-0.5">
              {creator.avgEngagement}%
            </p>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-center">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">Est. Rate</span>
            <p className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
              ₹{(creator.rateCard?.Reel ? (creator.rateCard.Reel / 1000).toFixed(0) : '35')}K
            </p>
          </div>
          <div className="hidden sm:block p-2.5 sm:p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-center">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">Commercial Score</span>
            <p className="text-sm sm:text-base font-bold font-mono text-indigo-400 mt-0.5">
              98/100
            </p>
          </div>
        </div>
      </div>

      {/* Tabs navigation: Showcase, Reels, Shots, Blogs, About & Bio, Campaigns, Analytics */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-zinc-800/80 pb-px overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-indigo-500 text-white font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ABOUT (Bio placed here, after Latest Work) */}
      {activeTab === 'about' && (
        <div className="space-y-6 animate-fade-in">
          {/* Bio & Badges Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
              Biography & Creative Direction
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
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
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {p.platform === 'Instagram' ? (
                      <InstagramIcon className="w-5 h-5 text-pink-400" />
                    ) : (
                      <YouTubeIcon className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{p.platform}</h4>
                      <span className="text-[11px] text-zinc-500 font-mono">{p.handle}</span>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-2">
                  <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 uppercase">Followers</span>
                    <p className="text-sm font-bold font-mono text-zinc-100">
                      {(p.followers / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 uppercase">Engagement</span>
                    <p className="text-sm font-bold font-mono text-emerald-400">
                      {p.engagementRate}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audited Commercial Ledger */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                Audited Commercial Reputation
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Score: 98 / 100 (Tier 1)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">On-Time Delivery</span>
                <span className="text-lg font-bold text-zinc-100 font-mono mt-1 block">98%</span>
                <span className="text-[10px] text-emerald-400 mt-1 block">Top 2% on platform</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Brief Compliance</span>
                <span className="text-lg font-bold text-zinc-100 font-mono mt-1 block">99%</span>
                <span className="text-[10px] text-indigo-400 mt-1 block">Zero revision penalties</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Response Velocity</span>
                <span className="text-lg font-bold text-zinc-100 font-mono mt-1 block">2.1 Hours</span>
                <span className="text-[10px] text-emerald-400 mt-1 block">Instant in-app messaging</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHOWCASE */}
      {activeTab === 'showcase' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-1">
            <p className="text-xs text-zinc-400">
              Showing {creator.portfolio.length} verified commercial deliverables and original cuts.
            </p>
            <button
              onClick={() => setIsAddShowcaseOpen(true)}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Work</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {creator.portfolio.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden space-y-2 group hover:border-zinc-700 transition-all"
              >
                <div className="relative h-44 overflow-hidden bg-zinc-950">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-indigo-300 border border-white/10">
                      {p.type}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between text-xs text-white">
                    <span className="font-mono">{(p.views / 1000).toFixed(0)}K views</span>
                    <span className="font-mono text-emerald-400">{(p.engagement / 1000).toFixed(1)}K</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-zinc-200 line-clamp-1">{p.title}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{p.type} • {p.campaignName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REELS */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          {reelsList.map((reel) => (
            <div
              key={reel.id}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900/60 border border-zinc-800 aspect-[9/16] hover:border-zinc-700 transition-all"
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <span className="text-[10px] text-indigo-400 font-mono">{reel.brand}</span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {reel.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-300 font-mono pt-1">
                    <span>{reel.views} plays</span>
                    <span className="text-emerald-400">{reel.engagement} likes</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: SHOTS (High-Res Photography) */}
      {activeTab === 'shots' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-1">
            <p className="text-xs text-zinc-400">
              Showing {creatorShots.length} high-resolution editorial photography captures &amp; aesthetics.
            </p>
          </div>

          {creatorShots.length === 0 ? (
            <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
              <Camera className="w-8 h-8 text-zinc-600 mx-auto" />
              <h4 className="text-xs font-semibold text-zinc-300">No Shots Published Yet</h4>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                Photography shots published to Discover will appear here in the creator portfolio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {creatorShots.map((shot) => (
                <div
                  key={shot.id}
                  className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 aspect-[4/5] hover:border-zinc-700 transition-all cursor-pointer"
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
                              : 'bg-black/60 text-zinc-300 hover:text-white'
                          }`}
                          title={shot.isPinned ? 'Unpin shot' : 'Pin shot to profile'}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-200 line-clamp-2 leading-tight">
                        {shot.content || shot.caption}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-1">
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
          <div className="flex items-center justify-between pb-1">
            <p className="text-xs text-zinc-400">
              Showing {creatorBlogs.length} long-form articles, essays, and creative culture breakdowns.
            </p>
          </div>

          {creatorBlogs.length === 0 ? (
            <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-zinc-600 mx-auto" />
              <h4 className="text-xs font-semibold text-zinc-300">No Editorial Articles Yet</h4>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                Articles published through CreatorOS editorial studio will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creatorBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => setSelectedBlogModal(blog)}
                  className="rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-white/20 p-5 flex flex-col justify-between space-y-4 transition-all group cursor-pointer"
                >
                  <div className="space-y-3">
                    {blog.blogCoverImage && (
                      <div className="h-44 rounded-xl overflow-hidden bg-zinc-900">
                        <img
                          src={blog.blogCoverImage}
                          alt={blog.blogTitle || 'Blog cover'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">
                        ✍ {blog.blogReadingTime || '5 min read'}
                      </span>
                      <span>{new Date(blog.createdAt || blog.timestamp || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                      {blog.blogTitle || blog.content || blog.caption}
                    </h3>

                    <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
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
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
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
                  className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{c.brand}</span>
                      <p className="text-[11px] text-zinc-400">{c.campaign}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400">{c.payout}</span>
                      <span className="block text-[10px] text-emerald-500 font-mono">Verified Escrow</span>
                    </div>
                  </div>
                  <p className="text-zinc-300 italic pt-1">"{c.comment}"</p>
                  <div className="flex items-center gap-1 text-amber-400 text-[11px]">
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
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-xs">
              <h3 className="font-semibold text-zinc-200">Top Locations</h3>
              {creator.audienceBreakdown.topLocations.map((loc, idx) => (
                <div key={idx} className="flex justify-between text-zinc-400 py-1 border-b border-zinc-800/60">
                  <span>{loc.city}</span>
                  <span className="font-mono text-zinc-200">{loc.pct}%</span>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-xs">
              <h3 className="font-semibold text-zinc-200">Age Bracket</h3>
              {creator.audienceBreakdown.ageSplit.map((age, idx) => (
                <div key={idx} className="flex justify-between text-zinc-400 py-1 border-b border-zinc-800/60">
                  <span>{age.range} years</span>
                  <span className="font-mono text-zinc-200">{age.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Standard Rate Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
              Standard Commercial Rates
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {Object.entries(creator.rateCard).map(([fmt, fee]) => (
                <div key={fmt} className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-center">
                  <span className="text-zinc-400 block">{fmt}</span>
                  <span className="text-base font-bold font-mono text-zinc-100 mt-1 block">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-md rounded-2xl bg-[#0c0c10] border border-white/[0.08] p-6 shadow-2xl text-zinc-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddShowcaseOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Add Showcase Work</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Highlight your latest high-impact reel, editorial lookbook, or campaign deliverable.
            </p>

            <form onSubmit={handleCreateShowcase} className="space-y-3.5 pt-1">
              <div>
                <label className="text-xs text-zinc-300 font-medium block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={showcaseTitle}
                  onChange={(e) => setShowcaseTitle(e.target.value)}
                  placeholder="e.g. Summer Streetwear Color Grade Reel"
                  className="w-full rounded-xl bg-zinc-900/60 border border-white/[0.08] p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs text-zinc-300 font-medium block mb-1">
                    Deliverable Format
                  </label>
                  <select
                    value={showcaseType}
                    onChange={(e) => setShowcaseType(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900/60 border border-white/[0.08] p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500/60"
                  >
                    <option value="Reel">4K Reel</option>
                    <option value="Carousel">In-Feed Carousel</option>
                    <option value="Lookbook">Editorial Lookbook</option>
                    <option value="Story Series">Story Series</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-300 font-medium block mb-1">
                    Brand / Client
                  </label>
                  <input
                    type="text"
                    value={showcaseCampaign}
                    onChange={(e) => setShowcaseCampaign(e.target.value)}
                    placeholder="e.g. Aura Streetwear Co."
                    className="w-full rounded-xl bg-zinc-900/60 border border-white/[0.08] p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 font-medium block mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={showcaseThumbnail}
                  onChange={(e) => setShowcaseThumbnail(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl bg-zinc-900/60 border border-white/[0.08] p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs text-zinc-300 font-medium block mb-1">
                    Verified Plays / Views
                  </label>
                  <input
                    type="number"
                    value={showcaseViews}
                    onChange={(e) => setShowcaseViews(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900/60 border border-white/[0.08] p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-300 font-medium block mb-1">
                    Engagement Count
                  </label>
                  <input
                    type="number"
                    value={showcaseEngagement}
                    onChange={(e) => setShowcaseEngagement(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900/60 border border-white/[0.08] p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddShowcaseOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 cursor-pointer"
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
