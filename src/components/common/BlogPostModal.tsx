import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ShieldCheck,
  Clock,
  Send,
  UserPlus,
  Check,
  ExternalLink,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { SocialPost, PostComment } from '../../types/socialFeed';
import { ConnectModal } from './ConnectModal';

interface BlogPostModalProps {
  post: SocialPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BlogPostModal: React.FC<BlogPostModalProps> = ({
  post,
  isOpen,
  onClose,
}) => {
  const {
    togglePostLike,
    togglePostSave,
    addPostComment,
    connections,
    userProfile,
    role,
    triggerCelebration,
  } = useAppState();

  const [commentInput, setCommentInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  if (!isOpen || !post) return null;

  const isLiked = post.likedByMe;
  const isSaved = post.savedByMe;
  const connectionState = connections[post.authorId] || 'connect';

  const handleShare = () => {
    const url = `${window.location.origin}/discover/blog/${post.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    triggerCelebration();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    addPostComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div
          className="relative w-full max-w-3xl rounded-2xl bg-[#0c0c11] border border-white/[0.08] shadow-2xl text-zinc-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Sticky Bar */}
          <div className="p-3.5 sm:p-4 border-b border-white/[0.08] bg-[#0c0c11]/95 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                ✍ Editorial Article
              </span>
              <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                {post.blogReadingTime || '4 min read'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Like in Top Bar */}
              <button
                onClick={() => togglePostLike(post.id)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isLiked
                    ? 'border-rose-500/30 bg-rose-500/15 text-rose-400 font-semibold'
                    : 'border-white/[0.08] text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-mono">{post.likes}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="Share article link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Reading Content */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-6 space-y-7 text-zinc-200">
            {/* Cover Banner */}
            {post.blogCoverImage && (
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] w-full bg-zinc-950 border border-white/[0.06] shadow-lg">
                <img
                  src={post.blogCoverImage}
                  alt={post.blogTitle || 'Cover'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            )}

            {/* Title & Author Meta */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display leading-tight tracking-tight">
                {post.blogTitle || post.content}
              </h1>

              {/* Author Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-950/70 border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">{post.authorName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">
                      {post.authorHandle} • {post.timestamp} • {post.blogReadingTime || '4 min read'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {connectionState === 'connected' ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Connected ✓</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setIsConnectOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="space-y-4 text-sm leading-relaxed text-zinc-300 font-sans border-t border-b border-white/[0.06] py-6">
              {post.blogContent ? (
                post.blogContent.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-xl font-bold text-white font-display pt-3 pb-1">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-base font-semibold text-white pt-2 pb-0.5">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote
                        key={idx}
                        className="pl-4 border-l-2 border-indigo-500 text-zinc-200 italic my-3 bg-zinc-950/40 py-2 rounded-r-xl"
                      >
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  return (
                    <p key={idx} className="text-zinc-300 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })
              ) : (
                <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              )}
            </div>

            {/* Embedded Article Imagery */}
            {post.blogArticleImages && post.blogArticleImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {post.blogArticleImages.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/[0.06] aspect-video">
                    <img src={img} alt={`Asset ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {post.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.06] text-indigo-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <div className="space-y-4 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white font-display">
                  Discussion & Responses ({post.commentsCount})
                </h4>
              </div>

              {/* Inline Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Join the discussion or share feedback..."
                  className="flex-1 bg-zinc-900 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </form>

              {/* Existing Comments List */}
              <div className="space-y-2.5 pt-2">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.04] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-white">{comment.authorName}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {comment.authorHandle}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-zinc-300 pl-7">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 py-3">No responses yet. Be the first to share your thoughts!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConnectModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        target={{
          id: post.authorId,
          name: post.authorName,
          handle: post.authorHandle,
          avatar: post.authorAvatar,
          role: post.authorType,
        }}
      />
    </>
  );
};
