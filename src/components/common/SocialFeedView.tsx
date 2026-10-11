import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  QrCode,
  Send,
  Image as ImageIcon,
  Check,
  Compass,
  Users,
  Briefcase,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { FeedCategory, SocialPost } from '../../types/socialFeed';

const REACTION_GIFS = [
  { label: 'Fire', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' },
  { label: 'Mind Blown', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
  { label: 'Applause', url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif' },
  { label: 'Creative', url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
];

export const SocialFeedView: React.FC = () => {
  const {
    socialPosts,
    togglePostLike,
    addPostComment,
    createSocialPost,
    role,
    userProfile,
  } = useAppState();

  const [activeCategory, setActiveCategory] = useState<FeedCategory | 'all'>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeGifPickerPostId, setActiveGifPickerPostId] = useState<string | null>(null);
  const [selectedQrPost, setSelectedQrPost] = useState<SocialPost | null>(null);
  const [copiedLinkPostId, setCopiedLinkPostId] = useState<string | null>(null);
  const [appliedPostIds, setAppliedPostIds] = useState<Set<string>>(new Set());

  const filteredPosts = socialPosts.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    createSocialPost({
      content: newPostContent,
      category: activeCategory === 'all' ? 'discover' : activeCategory,
    });
    setNewPostContent('');
  };

  const handleAddComment = (postId: string, gifUrl?: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim() && !gifUrl) return;

    addPostComment(postId, text, gifUrl);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setActiveGifPickerPostId(null);
  };

  const handleShareLink = (postId: string, url?: string) => {
    const shareUrl = url || window.location.href;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLinkPostId(postId);
    setTimeout(() => setCopiedLinkPostId(null), 2500);
  };

  const handleApplyOpportunity = (postId: string) => {
    setAppliedPostIds((prev) => new Set([...prev, postId]));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Professional Network</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Live Feed
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Connect with creators, discover collaborative campaigns, and explore viral content workflows.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('discover')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'discover'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Discover</span>
          </button>
          <button
            onClick={() => setActiveCategory('following')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'following'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Following</span>
          </button>
          <button
            onClick={() => setActiveCategory('opportunity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'opportunity'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Classifieds</span>
          </button>
        </div>
      </div>

      {/* Create Post Bar */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-sm">
        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="flex gap-3">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700/60 shrink-0"
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={
                role === 'business'
                  ? 'Share an update, open casting brief, or industry insight with creators...'
                  : 'Share a BTS shoot, creative technique, or new campaign milestone...'
              }
              rows={2}
              className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 resize-none"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <span className="text-[11px] text-zinc-500 font-mono">
                Posting as <strong className="text-zinc-300 font-semibold">{userProfile.name}</strong> ({role})
              </span>
            </div>
            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-600/30"
            >
              <Send className="w-3 h-3" />
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isOpportunity = post.category === 'opportunity' && post.campaignOpportunity;
          const opp = post.campaignOpportunity;
          const isApplied = appliedPostIds.has(post.id);

          return (
            <article
              key={post.id}
              className={`rounded-2xl border bg-zinc-950/70 p-5 backdrop-blur-sm transition-all hover:border-zinc-700/80 ${
                isOpportunity
                  ? 'border-amber-500/30 ring-1 ring-amber-500/10'
                  : 'border-zinc-800/80'
              }`}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700/60"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-100">{post.authorName}</span>
                      <span className="text-[11px] text-zinc-500">{post.authorHandle}</span>
                      {post.authorBadge && (
                        <span className={`text-[10px] px-2 py-0.2 rounded-full font-medium ${
                          post.authorType === 'business'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {post.authorBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{post.timestamp}</span>
                  </div>
                </div>

                {isOpportunity && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>Classified Opportunity</span>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line mb-3">
                {post.content}
              </p>

              {/* Opportunity Classified Box */}
              {isOpportunity && opp && (
                <div className="my-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                        Brief & Compensation
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{opp.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {opp.budgetFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80">
                    <div>
                      <strong className="text-zinc-300">Deliverables:</strong> {opp.deliverablesSummary}
                    </div>
                    <div>
                      <strong className="text-zinc-300">Target Niche:</strong> {opp.requiredNiche}
                    </div>
                    <div>
                      <strong className="text-zinc-300">Deadline:</strong> {opp.deadline}
                    </div>
                    <div>
                      <strong className="text-zinc-300">Location:</strong> {opp.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedQrPost(post)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                        title="Display Classified QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR Code</span>
                      </button>
                      <button
                        onClick={() => handleShareLink(post.id, opp.publicUrl)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                      >
                        {copiedLinkPostId === post.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Share URL</span>
                          </>
                        )}
                      </button>
                    </div>

                    {role === 'creator' ? (
                      <button
                        onClick={() => handleApplyOpportunity(post.id)}
                        disabled={isApplied}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isApplied
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer'
                        }`}
                      >
                        {isApplied ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            Application Submitted
                          </span>
                        ) : (
                          'Express Interest / Apply'
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-500 font-mono">
                        Active Brand Campaign Listing
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Media Preview if attached */}
              {post.mediaUrl && (
                <div className="my-3 rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900/40 max-h-96 flex items-center justify-center">
                  <img
                    src={post.mediaUrl}
                    alt="Post attachment"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Action Buttons: Like, Comment, Share */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-900 text-xs text-zinc-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => togglePostLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.likedByMe ? 'text-rose-500' : 'hover:text-rose-400'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.likedByMe ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                    <span className="font-mono">{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-mono">{post.commentsCount}</span>
                  </div>

                  <button
                    onClick={() => handleShareLink(post.id)}
                    className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="font-mono">{post.sharesCount}</span>
                  </button>
                </div>

                {copiedLinkPostId === post.id && !isOpportunity && (
                  <span className="text-[11px] text-emerald-400 font-medium animate-fade-in">
                    Link copied to clipboard!
                  </span>
                )}
              </div>

              {/* Comments Section */}
              <div className="mt-4 pt-3 border-t border-zinc-900 space-y-3">
                {/* Existing comments list */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2.5">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5 text-xs">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 rounded-xl bg-zinc-900/60 p-2.5 border border-zinc-850">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-zinc-200 text-[11px]">
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {comment.timestamp}
                            </span>
                          </div>
                          {comment.content && (
                            <p className="text-zinc-300 text-xs mt-1 leading-snug">
                              {comment.content}
                            </p>
                          )}
                          {comment.gifUrl && (
                            <div className="mt-2 rounded-lg overflow-hidden max-w-xs border border-zinc-800">
                              <img src={comment.gifUrl} alt="Reaction GIF" className="w-full h-auto" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment input */}
                <div className="relative flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                    placeholder="Write a comment or response..."
                    className="flex-1 bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                  />

                  {/* GIF picker toggle */}
                  <button
                    onClick={() =>
                      setActiveGifPickerPostId(
                        activeGifPickerPostId === post.id ? null : post.id
                      )
                    }
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-mono font-bold"
                    title="Attach GIF"
                  >
                    GIF
                  </button>

                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  {/* GIF Picker Popover */}
                  {activeGifPickerPostId === post.id && (
                    <div className="absolute right-0 bottom-10 z-20 w-64 rounded-xl bg-zinc-900 border border-zinc-800 p-2 shadow-xl animate-scale-in">
                      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-[11px] text-zinc-400 font-medium">
                        <span>Select Reaction GIF</span>
                        <button
                          onClick={() => setActiveGifPickerPostId(null)}
                          className="text-zinc-500 hover:text-zinc-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-2">
                        {REACTION_GIFS.map((gif, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddComment(post.id, gif.url)}
                            className="group relative rounded-lg overflow-hidden border border-zinc-800 hover:border-indigo-500 transition-colors"
                          >
                            <img src={gif.url} alt={gif.label} className="w-full h-16 object-cover" />
                            <span className="absolute bottom-1 left-1 px-1 rounded bg-black/60 text-[9px] text-zinc-300">
                              {gif.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* QR Code Modal for Classified Ads */}
      {selectedQrPost && selectedQrPost.campaignOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl text-center">
            <button
              onClick={() => setSelectedQrPost(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex p-3 rounded-2xl bg-white mb-4">
              {/* Simulated Crisp QR code pattern */}
              <div className="w-44 h-44 bg-zinc-950 p-2 rounded-lg flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-4 border-white rounded-md" />
                  <div className="w-10 h-10 border-4 border-white rounded-md" />
                </div>
                <div className="flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-4 border-white rounded-md" />
                  <div className="w-6 h-6 bg-white rounded-sm" />
                </div>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white">
              {selectedQrPost.campaignOpportunity.title}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Scan with any mobile device to view public campaign brief & media requirements.
            </p>
            <div className="mt-4 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono truncate">
              {selectedQrPost.campaignOpportunity.publicUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
