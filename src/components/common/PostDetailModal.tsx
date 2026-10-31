import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ShieldCheck,
  MapPin,
  Sparkles,
  Briefcase,
  Play,
  Volume2,
  VolumeX,
  UserPlus,
  Check,
  ArrowRight,
} from 'lucide-react';
import { SocialPost } from '../../types/socialFeed';
import { useAppState } from '../../context/StateContext';
import { CommentsView } from './CommentsView';
import { ReactionPicker } from './ReactionPicker';
import { ShareModal } from './ShareModal';

export interface PostDetailModalProps {
  post: SocialPost;
  onClose: () => void;
  onOpenConnect?: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onOpenConnect,
}) => {
  const {
    togglePostLike,
    togglePostSave,
    connections,
    role,
  } = useAppState();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isConnected = connections[post.authorId] === 'connected';
  const opp = post.campaignOpportunity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-[var(--text-muted)] hover:text-white border border-[var(--border)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Media or Article Cover (Media-First) */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative min-h-[320px] md:min-h-[520px]">
          {post.isReel && post.videoUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                src={post.videoUrl}
                poster={post.mediaUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full max-h-[520px] object-contain"
              />
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 hover:bg-black/90 transition-all cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          ) : post.mediaUrl ? (
            <img
              src={post.mediaUrl}
              alt={post.content}
              className="w-full h-full max-h-[520px] object-cover"
            />
          ) : (
            <div className="p-8 text-center text-[var(--text-muted)] font-mono text-xs">
              No media attached
            </div>
          )}
        </div>

        {/* Right: Author info, Full Content, Campaign Brief Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-5 md:p-6 overflow-y-auto max-h-[520px] scrollbar-thin text-[var(--text-primary)]">
          <div className="space-y-4">
            {/* Author Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--border)]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[var(--text-primary)]">
                      {post.authorName}
                    </span>
                    {post.authorVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
                    <span>{post.authorHandle}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Connect CTA */}
              {isConnected ? (
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </span>
              ) : (
                <button
                  onClick={onOpenConnect}
                  className="px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              )}
            </div>

            {/* Format & Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)] font-mono">
                {post.contentType === 'reel' ? '🎬 Reel' : post.contentType === 'blog' ? '✍ Blog' : '📸 Shot'}
              </span>
              {post.discoveryBadge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                  {post.discoveryBadge}
                </span>
              )}
              {post.location && (
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
                  {post.location}
                </span>
              )}
            </div>

            {/* Blog Title if blog */}
            {post.blogTitle && (
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-display">
                {post.blogTitle}
              </h2>
            )}

            {/* Full Post Description */}
            <div className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line space-y-2">
              <p>{post.fullContent || post.blogContent || post.content}</p>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono text-[var(--accent)] hover:underline cursor-pointer"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Full Campaign Opportunity Brief Section */}
            {opp && (
              <div className="p-4 rounded-xl bg-[var(--surface-muted)] shadow-sm border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-amber-500 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Commercial Brief
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    {opp.budgetFormatted}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{opp.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{opp.deliverablesSummary}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border)]">
                  <div>Deadline: <strong className="text-[var(--text-primary)]">{opp.deadline}</strong></div>
                  <div>Location: <strong className="text-[var(--text-primary)]">{opp.location}</strong></div>
                  <div>Niche: <strong className="text-[var(--text-primary)]">{opp.requiredNiche}</strong></div>
                  <div>Brand: <strong className="text-[var(--text-primary)]">{opp.brandName}</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Engagement Action Bar */}
          <div className="pt-4 border-t border-[var(--border)] space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                {/* Like with Reaction trigger */}
                <div className="relative">
                  <button
                    onClick={() => togglePostLike(post.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowReactionPicker(!showReactionPicker);
                    }}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      post.likedByMe ? 'text-rose-400 font-semibold' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-current' : ''}`} />
                    <span className="font-mono text-xs">{post.likes}</span>
                  </button>

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

                {/* Comment Button */}
                <button
                  onClick={() => setShowComments(true)}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-mono text-xs">{post.commentsCount}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="font-mono text-xs">{post.sharesCount}</span>
                </button>
              </div>

              {/* Bookmark Save */}
              <button
                onClick={() => togglePostSave(post.id)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  post.savedByMe ? 'text-[var(--primary)] bg-[var(--primary)]/10' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${post.savedByMe ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Quick view comments trigger */}
            <button
              onClick={() => setShowComments(true)}
              className="text-xs text-[var(--primary)] hover:text-[var(--primary)] font-medium block cursor-pointer"
            >
              View conversation ({post.commentsCount} comments) →
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Comments Drawer */}
      {showComments && (
        <CommentsView
          post={post}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Embedded Share Modal */}
      {showShareModal && (
        <ShareModal
          post={post}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
