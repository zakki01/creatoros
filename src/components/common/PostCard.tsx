import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ShieldCheck,
  UserPlus,
  Check,
  MoreHorizontal,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  MapPin,
  Flag,
  Copy,
  ExternalLink,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { SocialPost } from '../../types/socialFeed';
import { useAppState } from '../../context/StateContext';
import { ReactionPicker } from './ReactionPicker';

export interface PostCardProps {
  post: SocialPost;
  onOpenComments: (post: SocialPost) => void;
  onOpenShare: (post: SocialPost) => void;
  onOpenDetail: (post: SocialPost) => void;
  onOpenConnect: (target: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    role: 'creator' | 'business' | 'super_admin';
  }) => void;
  onOpenAuthorProfile?: (authorId: string, role: string) => void;
  onReportPost?: (post: SocialPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onOpenComments,
  onOpenShare,
  onOpenDetail,
  onOpenConnect,
  onOpenAuthorProfile,
  onReportPost,
}) => {
  const { togglePostLike, togglePostSave, connections } = useAppState();

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<any>(null);

  const isConnected = connections[post.authorId] === 'connected';
  const opp = post.campaignOpportunity;
  const isReel = post.contentType === 'reel' || post.isReel;
  const isBlog = post.contentType === 'blog';

  // Double-tap to like on media
  const handleMediaTouchOrClick = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected!
      if (!post.likedByMe) {
        togglePostLike(post.id);
      }
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 900);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      // Single tap on reel toggles play/pause
      if (isReel && videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  // Long press on Like button for mobile
  const handleTouchStartLike = () => {
    longPressTimerRef.current = setTimeout(() => {
      setShowReactionPicker(true);
    }, 450);
  };

  const handleTouchEndLike = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  return (
    <article
      className="relative rounded-3xl surface-2 overflow-hidden transition-all duration-200 hover:border-black/15 hover:-translate-y-0.5 select-none"
      aria-label={`Post by ${post.authorName}`}
    >
      {/* Top specular highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      {/* 1. CREATOR / BRAND HEADER (Author first) */}
      <header className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b border-black/[0.06]">
        <div
          onClick={() => onOpenAuthorProfile && onOpenAuthorProfile(post.authorId, post.authorType)}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
        >
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-[#007E93]/35 transition-all shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs text-zinc-900 group-hover:text-[#007E93] transition-colors truncate">
                {post.authorName}
              </span>
              {post.authorVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-[#007E93] shrink-0" />
              )}
              <span className="text-[11px] text-zinc-500 font-mono truncate">
                {post.authorHandle}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
              <span>{post.timestamp}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 truncate">
                    <MapPin className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
                    {post.location}
                  </span>
                </>
              )}
              {/* Content format pill */}
              <span>•</span>
              <span className="text-zinc-700 font-semibold">
                {isReel ? '🎬 Reel' : isBlog ? '✍ Blog' : '📸 Shot'}
              </span>
            </div>
          </div>
        </div>

        {/* Header Right: Connect CTA + Contextual More Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {isConnected ? (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-500/20 text-emerald-700 text-xs font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span className="hidden sm:inline">Connected</span>
            </span>
          ) : (
            <button
              onClick={() =>
                onOpenConnect({
                  id: post.authorId,
                  name: post.authorName,
                  handle: post.authorHandle,
                  avatar: post.authorAvatar,
                  role: post.authorType,
                })
              }
              className="px-3 py-1 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>
          )}

          {/* Contextual More Menu (•••) */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreMenu(!showMoreMenu);
              }}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="More post options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-8 w-44 rounded-xl bg-white shadow-sm border border-black/[0.08] shadow-2xl p-1 z-30 animate-slide-up text-left"
              >
                <button
                  onClick={() => {
                    onOpenShare(post);
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Share Post</span>
                </button>
                <button
                  onClick={() => {
                    onOpenDetail(post);
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  <span>View Details</span>
                </button>
                {onReportPost && (
                  <button
                    onClick={() => {
                      onReportPost(post);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer border-t border-black/[0.04] mt-1 pt-1"
                  >
                    <Flag className="w-3.5 h-3.5 text-rose-400" />
                    <span>Report Post</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. MEDIA FIRST (Large visually dominating canvas with Double-Tap to Like) */}
      <div
        className="relative w-full bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none group"
        onClick={handleMediaTouchOrClick}
      >
        {isReel && post.videoUrl ? (
          <div className="relative w-full aspect-[9/16] sm:aspect-[4/5] max-h-[580px] flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={post.videoUrl}
              poster={post.mediaUrl}
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Play/Pause Center Indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-black/15 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            )}
            {/* Audio Mute/Unmute Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-black/15 hover:bg-black/90 transition-all cursor-pointer z-10"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : isBlog ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(post);
            }}
            className="w-full relative aspect-[16/9] overflow-hidden"
          >
            <img
              src={post.blogCoverImage || post.mediaUrl}
              alt={post.blogTitle || 'Blog Cover'}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[10px] font-mono text-[#007E93] uppercase tracking-wider block mb-1">
                {post.blogReadingTime || '4 min read'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 font-display">
                {post.blogTitle || post.content}
              </h3>
            </div>
          </div>
        ) : post.mediaUrl ? (
          <div className="relative w-full aspect-[4/5] sm:aspect-square max-h-[560px] flex items-center justify-center bg-black">
            <img
              src={post.mediaUrl}
              alt={post.content}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {/* Double-Tap Heart Animation Overlay (Section 6) */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="animate-heart-pop text-rose-500 drop-shadow-2xl">
              <Heart className="w-24 h-24 fill-current text-rose-500 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* 3. SOCIAL ENGAGEMENT ACTION ROW */}
      <div className="px-2 sm:px-3 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button with Tap / Long-Press Reaction Tray */}
          <div className="relative">
            <button
              onClick={() => togglePostLike(post.id)}
              onTouchStart={handleTouchStartLike}
              onTouchEnd={handleTouchEndLike}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowReactionPicker(!showReactionPicker);
              }}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-all active:scale-90 cursor-pointer ${
                post.likedByMe ? 'text-rose-600 font-semibold' : 'text-zinc-700 hover:text-zinc-900'
              }`}
              title="Like / React (Press & hold for reaction tray)"
              aria-label="Like post"
            >
              {post.myReaction && post.myReaction !== '❤️' ? (
                <span className="text-lg leading-none">{post.myReaction}</span>
              ) : (
                <Heart className={`w-5 h-5 ${post.likedByMe ? 'fill-current' : ''}`} />
              )}
            </button>

            {/* Reaction Tray Popover */}
            {showReactionPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-40">
                <ReactionPicker
                  onSelectReaction={(rxn) => {
                    togglePostLike(post.id, rxn);
                    setShowReactionPicker(false);
                  }}
                  onClose={() => setShowReactionPicker(false)}
                  currentReaction={post.myReaction}
                />
              </div>
            )}
          </div>

          {/* Comment Button (44px hit-box) */}
          <button
            onClick={() => onOpenComments(post)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-zinc-700 hover:text-zinc-900 transition-all active:scale-90 cursor-pointer"
            title="Comments"
            aria-label="View comments"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Share Button (44px hit-box) */}
          <button
            onClick={() => onOpenShare(post)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-zinc-700 hover:text-zinc-900 transition-all active:scale-90 cursor-pointer"
            title="Share"
            aria-label="Share post"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Save / Bookmark Button (44px hit-box) */}
        <button
          onClick={() => togglePostSave(post.id)}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-all active:scale-90 cursor-pointer ${
            post.savedByMe ? 'text-[#007E93]' : 'text-zinc-500 hover:text-zinc-900'
          }`}
          title={post.savedByMe ? 'Remove from saved' : 'Save drop'}
          aria-label="Save post"
        >
          <Bookmark className={`w-5 h-5 ${post.savedByMe ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* 4. ENGAGEMENT SUMMARY & SHORT CAPTION */}
      <div className="px-3.5 sm:px-4 py-2 space-y-1.5 text-xs text-left">
        {/* Likes Count */}
        <div className="font-semibold text-zinc-900">
          <span className="font-mono">{post.likes.toLocaleString()}</span> likes
        </div>

        {/* Short Caption with 'more' opening Detail View (Strictly single excerpt, zero duplicate) */}
        <div className="text-zinc-700 leading-relaxed">
          <strong className="text-zinc-900 mr-1.5 font-semibold">{post.authorName}</strong>
          <span className="line-clamp-2 inline">
            {post.shortExcerpt || post.content}
          </span>
          <button
            onClick={() => onOpenDetail(post)}
            className="text-zinc-500 hover:text-zinc-700 ml-1.5 font-medium cursor-pointer"
          >
            more
          </button>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono text-[#007E93] hover:text-[#007E93] cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 5. COMPACT CAMPAIGN BRIEF (Section 16: Casting Call / Opportunity) */}
        {opp && (
          <div className="mt-2 p-2.5 rounded-xl bg-white shadow-sm border border-black/[0.08] flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-amber-800 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-800" />
                Casting Call
              </span>
              <h4 className="text-xs font-bold text-zinc-900 truncate">{opp.title}</h4>
              <p className="text-[10px] text-zinc-500 font-mono truncate">{opp.requiredNiche} • {opp.budgetFormatted}</p>
            </div>
            <button
              onClick={() => onOpenDetail(post)}
              className="text-[11px] font-semibold text-[#007E93] hover:text-[#007E93] shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>View Brief</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* 6. COMMENTS TEASER (Section 1: Clicking opens Comments experience) */}
        <div className="pt-1">
          <button
            onClick={() => onOpenComments(post)}
            className="text-[11px] text-zinc-500 hover:text-zinc-500 font-mono cursor-pointer transition-colors block"
          >
            View all {post.commentsCount || 0} comments
          </button>
        </div>
      </div>
    </article>
  );
};
