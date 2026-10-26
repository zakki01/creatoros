import React, { useState } from 'react';
import {
  Film,
  Camera,
  BookOpen,
  CheckCircle,
  EyeOff,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { ModerationStatus, PostContentType, SocialPost } from '../../types/socialFeed';
import { BlogPostModal } from '../common/BlogPostModal';

export const AdminModerationView: React.FC = () => {
  const {
    socialPosts,
    setPostModerationStatus,
    logAdminAction,
    triggerCelebration,
  } = useAppState();

  const [typeFilter, setTypeFilter] = useState<'all' | PostContentType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ModerationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPost, setPreviewPost] = useState<SocialPost | null>(null);

  const filteredPosts = socialPosts.filter((post) => {
    if (typeFilter !== 'all' && post.contentType !== typeFilter) return false;
    if (statusFilter !== 'all' && post.moderationStatus !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const text = (post.content || post.caption || '').toLowerCase();
      return (
        text.includes(q) ||
        post.authorName.toLowerCase().includes(q) ||
        post.authorHandle.toLowerCase().includes(q) ||
        (post.blogTitle && post.blogTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleUpdateStatus = (post: SocialPost, status: ModerationStatus) => {
    setPostModerationStatus(post.id, status);
    logAdminAction(
      `SET_MODERATION_${status.toUpperCase()}`,
      post.id,
      'post',
      status === 'approved' ? 'success' : status === 'removed' ? 'failed' : 'warning',
      `Post by ${post.authorHandle} set to ${status}`
    );
    triggerCelebration();
  };

  const handleWarnAuthor = (post: SocialPost) => {
    logAdminAction(
      'SEND_CONTENT_WARNING',
      post.authorHandle,
      post.authorType || post.authorRole || 'creator',
      'warning',
      `Formal trust & safety warning issued to ${post.authorHandle} regarding content #${post.id}`
    );
    triggerCelebration();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-zinc-900 tracking-tight">
            Content Moderation Hub
          </h2>
          <p className="text-xs text-zinc-500 font-sans font-light">
            Review, approve, hide, or take down published Reels, Shots, and Editorial Blogs across CreatorOS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">
            {filteredPosts.length} posts matching criteria
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white shadow-sm border border-black/[0.08] backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption, blog title, or creator handle..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white shadow-sm border border-black/[0.08] text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>

        {/* Format Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'All Formats' },
              { id: 'reel', label: '🎬 Reels' },
              { id: 'shot', label: '📸 Shots' },
              { id: 'blog', label: '✍ Blogs' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all shrink-0 cursor-pointer ${
                typeFilter === tab.id
                  ? 'bg-[#00B4D8] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(
            [
              { id: 'all', label: 'All Status' },
              { id: 'flagged', label: 'Flagged' },
              { id: 'approved', label: 'Approved' },
              { id: 'hidden', label: 'Hidden' },
              { id: 'removed', label: 'Removed' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Moderation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => {
          const isFlagged = post.moderationStatus === 'flagged';
          const isHidden = post.moderationStatus === 'hidden';
          const isRemoved = post.moderationStatus === 'removed';

          return (
            <div
              key={post.id}
              className={`rounded-2xl bg-white shadow-sm border p-4 flex flex-col justify-between space-y-4 transition-all ${
                isFlagged
                  ? 'border-rose-500/50 shadow-lg shadow-rose-950/20'
                  : isRemoved
                  ? 'border-zinc-200 opacity-60'
                  : isHidden
                  ? 'border-amber-500/40'
                  : 'border-black/[0.08] hover:border-black/15'
              }`}
            >
              {/* Card Header: Author info & Format Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-white block truncate">
                      {post.authorName}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono block truncate">
                      {post.authorHandle} • {(post.authorType || post.authorRole || 'creator').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content Type Badge */}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white border border-black/[0.08] text-zinc-700 shrink-0">
                  {post.contentType === 'reel' ? '🎬 REEL' : post.contentType === 'shot' ? '📸 SHOT' : '✍ BLOG'}
                </span>
              </div>

              {/* Media Thumbnail / Preview */}
              <div
                onClick={() => setPreviewPost(post)}
                className="relative rounded-xl overflow-hidden bg-white aspect-video group cursor-pointer"
              >
                <img
                  src={post.mediaUrl || post.blogCoverImage || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800'}
                  alt={post.content || post.caption || 'Media thumbnail'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-medium text-white gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Content</span>
                </div>

                {/* Status Indicator Pill */}
                <div className="absolute top-2 left-2">
                  {post.moderationStatus === 'flagged' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500 text-white font-bold animate-pulse">
                      FLAGGED
                    </span>
                  )}
                  {post.moderationStatus === 'hidden' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500 text-zinc-950 font-bold">
                      HIDDEN
                    </span>
                  )}
                  {post.moderationStatus === 'removed' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-500 font-bold">
                      REMOVED
                    </span>
                  )}
                  {post.moderationStatus === 'approved' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/80 text-white">
                      APPROVED
                    </span>
                  )}
                </div>
              </div>

              {/* Caption or Article Title */}
              <div className="space-y-1">
                {post.blogTitle && (
                  <h4 className="text-xs font-semibold text-zinc-900 line-clamp-1">
                    {post.blogTitle}
                  </h4>
                )}
                <p className="text-xs text-zinc-700 line-clamp-2 font-light">
                  {post.content || post.caption}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono pt-1">
                  <span>{post.likesCount || post.likes || 0} likes</span>
                  <span>{post.commentsCount} comments</span>
                  <span>{new Date(post.createdAt || post.timestamp || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-black/[0.08] flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  {/* Approve */}
                  <button
                    onClick={() => handleUpdateStatus(post, 'approved')}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-300 text-xs transition-all cursor-pointer"
                    title="Approve / Mark Clean"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>

                  {/* Hide */}
                  <button
                    onClick={() => handleUpdateStatus(post, 'hidden')}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/20 text-amber-300 text-xs transition-all cursor-pointer"
                    title="Hide / Unlist from Feeds"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => handleUpdateStatus(post, 'removed')}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-300 text-xs transition-all cursor-pointer"
                    title="Hard Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Restore */}
                  {(isHidden || isRemoved) && (
                    <button
                      onClick={() => handleUpdateStatus(post, 'approved')}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-700 text-xs transition-all cursor-pointer"
                      title="Restore to Active Feed"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Warn Author Button */}
                <button
                  onClick={() => handleWarnAuthor(post)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-950/30 border border-black/[0.08] hover:border-rose-500/30 text-zinc-500 hover:text-rose-300 text-[11px] font-sans transition-all flex items-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Warn</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Blog Article Reader Modal if selected */}
      {previewPost && previewPost.contentType === 'blog' && (
        <BlogPostModal
          post={previewPost}
          isOpen={Boolean(previewPost)}
          onClose={() => setPreviewPost(null)}
        />
      )}
    </div>
  );
};
