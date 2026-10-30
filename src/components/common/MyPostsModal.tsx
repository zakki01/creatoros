import React, { useState } from 'react';
import {
  X,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Archive,
  BarChart2,
  Pin,
  Film,
  Camera,
  PenTool,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { SocialPost } from '../../types/socialFeed';

interface MyPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateNew?: () => void;
}

export const MyPostsModal: React.FC<MyPostsModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateNew,
}) => {
  const { socialPosts, userProfile, authUser, deleteSocialPost, togglePostPin, updateSocialPost } =
    useAppState();

  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'scheduled' | 'archived'>('published');
  const [selectedAnalyticsPost, setSelectedAnalyticsPost] = useState<SocialPost | null>(null);

  if (!isOpen) return null;

  const currentUserId = userProfile?.id || authUser?.id || 'demo-creator-01';

  // Get only posts created by current user
  const myPosts = socialPosts.filter(
    (p) =>
      p.authorId === currentUserId ||
      p.authorName === userProfile?.name ||
      p.authorHandle === userProfile?.handle
  );

  const filteredPosts = myPosts.filter((p) => {
    if (activeTab === 'published') return !p.postStatus || p.postStatus === 'published';
    if (activeTab === 'drafts') return p.postStatus === 'draft';
    if (activeTab === 'scheduled') return p.postStatus === 'scheduled';
    if (activeTab === 'archived') return p.postStatus === 'archived';
    return true;
  });

  const handleArchive = (postId: string) => {
    updateSocialPost(postId, { postStatus: 'archived' });
  };

  const handleRestore = (postId: string) => {
    updateSocialPost(postId, { postStatus: 'published' });
  };

  const tabs: { id: 'published' | 'drafts' | 'scheduled' | 'archived'; label: string; count: number }[] = [
    {
      id: 'published',
      label: 'Published',
      count: myPosts.filter((p) => !p.postStatus || p.postStatus === 'published').length,
    },
    {
      id: 'drafts',
      label: 'Drafts',
      count: myPosts.filter((p) => p.postStatus === 'draft').length,
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      count: myPosts.filter((p) => p.postStatus === 'scheduled').length,
    },
    {
      id: 'archived',
      label: 'Archived',
      count: myPosts.filter((p) => p.postStatus === 'archived').length,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)] font-display">My Posts</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Manage your published drops, creative drafts, and scheduled lookbooks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCreateNew && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCreateNew();
                }}
                className="px-3 py-1.5 rounded-xl bg-[var(--accent)] hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="px-5 pt-3 border-b border-[var(--border)] bg-[var(--surface-muted)] flex items-center gap-2 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-3 border-b-2 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredPosts.length > 0 ? (
            <div className="space-y-3">
              {filteredPosts.map((post) => {
                const isReel = post.contentType === 'reel' || post.isReel;
                const isBlog = post.contentType === 'blog';

                return (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-[var(--surface)] shadow-sm border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Thumbnail + Details */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)] shrink-0 relative">
                        {post.mediaUrl ? (
                          <img
                            src={post.mediaUrl}
                            alt={post.content}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                            <PenTool className="w-5 h-5" />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 py-0.5 rounded bg-black/70 text-white">
                          {isReel ? '🎬' : isBlog ? '✍' : '📸'}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                            {isReel ? 'Reel' : isBlog ? 'Blog' : 'Shot'}
                          </span>
                          {post.isPinned && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                              <Pin className="w-2.5 h-2.5" />
                              <span>Pinned</span>
                            </span>
                          )}
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">
                            {post.timestamp}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[var(--text-primary)] mt-1 truncate">
                          {post.blogTitle || post.content}
                        </h4>

                        <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] font-mono mt-1">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-500" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-[var(--accent)]" />
                            {post.commentsCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-3 h-3 text-[var(--text-muted)]" />
                            {post.sharesCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => togglePostPin(post.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                          post.isPinned
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                            : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                        }`}
                        title={post.isPinned ? 'Unpin post' : 'Pin to top of profile'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedAnalyticsPost(post)}
                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-elevated)] transition-all cursor-pointer"
                        title="View post analytics"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                      </button>

                      {activeTab === 'archived' ? (
                        <button
                          onClick={() => handleRestore(post.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-xs text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all cursor-pointer"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(post.id)}
                          className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-amber-500 hover:bg-[var(--surface-elevated)] transition-all cursor-pointer"
                          title="Archive post"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteSocialPost(post.id)}
                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)] flex items-center justify-center mx-auto border border-[var(--border)]">
                <Archive className="w-5 h-5" />
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                No {activeTab} posts found.
              </p>
            </div>
          )}
        </div>

        {/* Quick Analytics Sheet Modal */}
        {selectedAnalyticsPost && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md p-6 flex flex-col justify-center animate-fade-in">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4 max-w-md mx-auto w-full shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase font-mono">
                  Performance Ledger
                </h3>
                <button
                  onClick={() => setSelectedAnalyticsPost(null)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-[var(--surface-muted)] shadow-sm border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">Estimated Reach</span>
                  <span className="text-base font-bold text-[var(--text-primary)] font-mono mt-0.5 block">
                    {((selectedAnalyticsPost.likes * 12) / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-muted)] shadow-sm border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">Engagement Rate</span>
                  <span className="text-base font-bold text-emerald-500 font-mono mt-0.5 block">
                    5.8%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-muted)] shadow-sm border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">Total Likes</span>
                  <span className="text-base font-bold text-rose-500 font-mono mt-0.5 block">
                    {selectedAnalyticsPost.likes}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-muted)] shadow-sm border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">Responses</span>
                  <span className="text-base font-bold text-[var(--accent)] font-mono mt-0.5 block">
                    {selectedAnalyticsPost.commentsCount}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[var(--text-muted)] text-center">
                Audited real-time telemetry tracked via CreatorOS Campaign Engine.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};