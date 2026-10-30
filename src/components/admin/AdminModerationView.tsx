import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { SocialPost } from '../../types/socialFeed';
import { BlogPostModal } from '../common/BlogPostModal';

export const AdminModerationView: React.FC = () => {
  const {
    socialPosts,
    setPostModerationStatus,
    deleteSocialPost,
    logAdminAction,
    triggerCelebration,
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'reel' | 'shot' | 'blog'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'flagged' | 'approved' | 'hidden' | 'removed'>('all');
  const [previewPost, setPreviewPost] = useState<SocialPost | null>(null);

  const filteredPosts = socialPosts.filter((post) => {
    const matchesSearch =
      post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.blogTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorHandle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || post.contentType === typeFilter;
    const matchesStatus =
      statusFilter === 'all' || post.moderationStatus === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleUpdateStatus = (post: SocialPost, newStatus: SocialPost['moderationStatus']) => {
    if (!newStatus) return;
    setPostModerationStatus(post.id, newStatus);
    logAdminAction(
      'MODERATE_POST',
      post.id,
      post.contentType,
      newStatus === 'approved' ? 'success' : 'warning',
      `Post ${post.id.slice(0, 8)} status set to ${newStatus.toUpperCase()} by Super Admin`
    );
    triggerCelebration();
  };

  const handleDelete = (post: SocialPost) => {
    deleteSocialPost(post.id);
    logAdminAction(
      'DELETE_POST_PERMANENT',
      post.id,
      post.contentType,
      'warning',
      `Post ${post.id.slice(0, 8)} permanently removed by Super Admin`
    );
    triggerCelebration();
  };

  const handleWarnAuthor = (post: SocialPost) => {
    logAdminAction(
      'ISSUE_POLICY_WARNING',
      post.authorId,
      'user',
      'warning',
      `Policy breach warning sent to ${post.authorHandle} regarding post ${post.id.slice(0, 8)}`
    );
    triggerCelebration();
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight">
            Content Moderation &amp; Feed Governance
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans font-light">
            Review community uploads, Vertical Reels, Photography Shots, and Blog posts for policy compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {filteredPosts.length} posts matching criteria
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption, blog title, or creator handle..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
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
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
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
              className={`rounded-2xl bg-[var(--surface)] border p-4 flex flex-col justify-between space-y-4 transition-all shadow-xs ${
                isFlagged
                  ? 'border-rose-500/50 shadow-md shadow-rose-950/20'
                  : isRemoved
                  ? 'border-[var(--border)] opacity-60'
                  : isHidden
                  ? 'border-amber-500/40'
                  : 'border-[var(--border)] hover:border-[var(--accent)]/40'
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
                    <span className="text-xs font-medium text-[var(--text-primary)] block truncate">
                      {post.authorName}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono block truncate">
                      {post.authorHandle} • {(post.authorType || post.authorRole || 'creator').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content Type Badge */}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)] shrink-0">
                  {post.contentType === 'reel' ? '🎬 REEL' : post.contentType === 'shot' ? '📸 SHOT' : '✍ BLOG'}
                </span>
              </div>

              {/* Media Thumbnail / Preview */}
              <div
                onClick={() => setPreviewPost(post)}
                className="relative rounded-xl overflow-hidden bg-[var(--surface-muted)] aspect-video group cursor-pointer"
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
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shadow-sm ${
                      isFlagged
                        ? 'bg-rose-500 text-white'
                        : isRemoved
                        ? 'bg-zinc-800 text-zinc-300'
                        : isHidden
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {post.moderationStatus || 'APPROVED'}
                  </span>
                </div>
              </div>

              {/* Content Caption / Summary */}
              <div className="space-y-1">
                {post.contentType === 'blog' && (
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1">
                    {post.blogTitle}
                  </h4>
                )}
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 font-light">
                  {post.caption || post.content || 'No text caption provided.'}
                </p>
                <div className="text-[10px] text-[var(--text-muted)] font-mono pt-1">
                  Published {new Date(post.createdAt || post.timestamp || Date.now()).toLocaleDateString()} • {post.likesCount || post.likes || 0} claps
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5">
                  {/* Approve */}
                  <button
                    onClick={() => handleUpdateStatus(post, 'approved')}
                    className="p-1.5 rounded-lg bg-[var(--surface-muted)] hover:bg-emerald-500/20 text-[var(--text-secondary)] hover:text-emerald-500 dark:hover:text-emerald-400 text-xs transition-all cursor-pointer"
                    title="Approve Post"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>

                  {/* Hide from Feed */}
                  <button
                    onClick={() => handleUpdateStatus(post, 'hidden')}
                    className="p-1.5 rounded-lg bg-[var(--surface-muted)] hover:bg-amber-500/20 text-[var(--text-secondary)] hover:text-amber-500 text-xs transition-all cursor-pointer"
                    title="Hide Post from Discovery"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>

                  {/* Flag for Takedown */}
                  <button
                    onClick={() => handleUpdateStatus(post, 'flagged')}
                    className="p-1.5 rounded-lg bg-[var(--surface-muted)] hover:bg-rose-500/20 text-[var(--text-secondary)] hover:text-rose-400 text-xs transition-all cursor-pointer"
                    title="Flag Content for Review"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(post)}
                    className="p-1.5 rounded-lg bg-[var(--surface-muted)] hover:bg-rose-500/20 text-[var(--text-secondary)] hover:text-rose-400 text-xs transition-all cursor-pointer"
                    title="Permanently Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Restore */}
                  {(isHidden || isRemoved) && (
                    <button
                      onClick={() => handleUpdateStatus(post, 'approved')}
                      className="p-1.5 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] text-xs transition-all cursor-pointer"
                      title="Restore to Active Feed"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Warn Author Button */}
                <button
                  onClick={() => handleWarnAuthor(post)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] hover:bg-rose-500/20 border border-[var(--border)] hover:border-rose-500/30 text-[var(--text-muted)] hover:text-rose-400 text-[11px] font-sans transition-all flex items-center gap-1 cursor-pointer"
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
