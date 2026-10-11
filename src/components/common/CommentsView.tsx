import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Heart,
  Smile,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CornerDownRight,
  Sparkles,
} from 'lucide-react';
import { SocialPost, PostComment } from '../../types/socialFeed';
import { useAppState } from '../../context/StateContext';
import { EmojiPicker } from './EmojiPicker';
import { ReactionPicker } from './ReactionPicker';

export interface CommentsViewProps {
  post: SocialPost;
  onClose: () => void;
}

export const CommentsView: React.FC<CommentsViewProps> = ({ post, onClose }) => {
  const {
    userProfile,
    role,
    addPostComment,
    toggleCommentLike,
    addCommentReply,
  } = useAppState();

  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<PostComment | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeReactionCommentId, setActiveReactionCommentId] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentsListRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle focus when replying
  const handleStartReply = (comment: PostComment) => {
    setReplyingTo(comment);
    setCommentText(`@${comment.authorHandle.replace('@', '')} `);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 50);
  };

  const handleSubmitComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    if (replyingTo) {
      addCommentReply(post.id, replyingTo.id, text);
      // Auto-expand replies for this comment
      setExpandedReplies((prev) => ({ ...prev, [replyingTo.id]: true }));
      setReplyingTo(null);
    } else {
      addPostComment(post.id, text);
    }

    setCommentText('');
    setShowEmojiPicker(false);

    // Scroll to bottom
    setTimeout(() => {
      if (commentsListRef.current) {
        commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
      }
    }, 100);
  };

  const toggleRepliesExpansion = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const comments = post.comments || [];
  const totalCommentsCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  return (
    <>
      {/* Subtle overlay allowing the background post to remain clearly visible */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[3px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Responsive Container:
          - Desktop (sm+): Right-side Contextual Panel (w-[420px])
          - Mobile (<sm): Modern Bottom Sheet (rounded-t-3xl, max-h-[85dvh], dynamic content height)
      */}
      <aside
        className="fixed z-50 flex flex-col bg-[#0c0c11]/98 border-white/[0.12] shadow-2xl backdrop-blur-2xl text-zinc-100 transition-all duration-300 overflow-hidden
          inset-x-0 bottom-0 max-h-[85dvh] rounded-t-3xl border-t
          sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-full sm:w-[420px] sm:rounded-none sm:border-l sm:border-t-0 animate-in slide-in-from-bottom sm:slide-in-from-right duration-250"
        role="dialog"
        aria-label="Comments"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div
          className="sm:hidden w-full pt-3 pb-1 flex justify-center cursor-pointer select-none"
          onClick={onClose}
        >
          <div className="w-10 h-1 bg-white/25 rounded-full hover:bg-white/40 transition-colors" />
        </div>

        {/* Panel Header */}
        <header className="px-4 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Comments</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 font-mono font-medium">
                {totalCommentsCount}
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate max-w-[280px]">
              On {post.authorName}’s {post.contentType}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            aria-label="Close comments"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Comments Scrollable Feed */}
        <div
          ref={commentsListRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-4 focus:outline-none scrollbar-thin min-h-0"
        >
          {comments.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-zinc-500">
                <Smile className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-zinc-300">No comments yet</p>
              <p className="text-[11px] text-zinc-400">
                Be the first to share your thoughts on this drop.
              </p>
            </div>
          ) : (
            comments.map((comment) => {
              const replies = comment.replies || [];
              const hasReplies = replies.length > 0;
              const isRepliesOpen = expandedReplies[comment.id];

              return (
                <div key={comment.id} className="group/comment space-y-2">
                  {/* Top-level Comment Row */}
                  <div className="flex items-start gap-2.5 relative">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                    />

                    <div className="flex-1 min-w-0 pr-1">
                      {/* Name & Handle & Time */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-white truncate">
                          {comment.authorName}
                        </span>
                        {comment.authorVerified && (
                          <ShieldCheck className="w-3 h-3 text-indigo-400 shrink-0" />
                        )}
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {comment.timestamp}
                        </span>
                      </div>

                      {/* Comment Content */}
                      <p className="text-xs text-zinc-200 mt-0.5 leading-relaxed break-words">
                        {comment.content}
                      </p>

                      {/* Comment Actions (Like + Reply) */}
                      <div className="flex items-center gap-3.5 mt-1.5 text-[11px] text-zinc-400">
                        {/* Like button with reaction tray trigger */}
                        <div className="relative">
                          <button
                            onClick={() => toggleCommentLike(post.id, comment.id)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setActiveReactionCommentId(
                                activeReactionCommentId === comment.id ? null : comment.id
                              );
                            }}
                            className={`flex items-center gap-1 transition-colors cursor-pointer ${
                              comment.likedByMe
                                ? 'text-rose-400 font-medium'
                                : 'hover:text-zinc-200'
                            }`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                comment.likedByMe ? 'fill-current' : ''
                              }`}
                            />
                            {comment.likes && comment.likes > 0 ? (
                              <span className="font-mono text-[10px]">
                                {comment.likes}
                              </span>
                            ) : null}
                          </button>

                          {/* Reaction Tray for comment */}
                          {activeReactionCommentId === comment.id && (
                            <div className="absolute bottom-full left-0 mb-1 z-30">
                              <ReactionPicker
                                onSelectReaction={(rxn) => {
                                  toggleCommentLike(post.id, comment.id, rxn);
                                  setActiveReactionCommentId(null);
                                }}
                                onClose={() => setActiveReactionCommentId(null)}
                                currentReaction={comment.reaction}
                              />
                            </div>
                          )}
                        </div>

                        {/* Reply button */}
                        <button
                          onClick={() => handleStartReply(comment)}
                          className="hover:text-zinc-200 transition-colors font-medium cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline Reply Threads (Section 4) */}
                  {hasReplies && (
                    <div className="pl-9 space-y-2.5 pt-0.5">
                      <button
                        onClick={() => toggleRepliesExpansion(comment.id)}
                        className="text-[11px] text-zinc-400 hover:text-indigo-400 flex items-center gap-1.5 font-mono cursor-pointer transition-colors"
                      >
                        <span className="w-5 h-px bg-zinc-700" />
                        {isRepliesOpen ? (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            <span>Hide {replies.length} replies</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            <span>View {replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
                          </>
                        )}
                      </button>

                      {isRepliesOpen && (
                        <div className="space-y-3 pt-1 border-l border-white/[0.06] pl-3 ml-2">
                          {replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-2 text-left">
                              <img
                                src={reply.authorAvatar}
                                alt={reply.authorName}
                                className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[11px] font-semibold text-white">
                                    {reply.authorName}
                                  </span>
                                  {reply.authorVerified && (
                                    <ShieldCheck className="w-2.5 h-2.5 text-indigo-400" />
                                  )}
                                  <span className="text-[9px] text-zinc-400 font-mono">
                                    {reply.timestamp}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed break-words">
                                  {reply.content}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-400">
                                  <button
                                    onClick={() => toggleCommentLike(post.id, reply.id)}
                                    className={`flex items-center gap-1 transition-colors cursor-pointer ${
                                      reply.likedByMe ? 'text-rose-400' : 'hover:text-zinc-200'
                                    }`}
                                  >
                                    <Heart className={`w-3 h-3 ${reply.likedByMe ? 'fill-current' : ''}`} />
                                    {reply.likes && reply.likes > 0 ? (
                                      <span className="font-mono">{reply.likes}</span>
                                    ) : null}
                                  </button>
                                  <button
                                    onClick={() => handleStartReply(comment)}
                                    className="hover:text-zinc-200 cursor-pointer"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Replying indicator banner */}
        {replyingTo && (
          <div className="px-4 py-1.5 bg-indigo-950/40 border-t border-indigo-500/20 text-[11px] text-indigo-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CornerDownRight className="w-3 h-3 text-indigo-400" />
              Replying to <strong className="text-white">{replyingTo.authorName}</strong>
            </span>
            <button
              onClick={() => {
                setReplyingTo(null);
                setCommentText('');
              }}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bottom Composer */}
        <footer className="p-3 pb-5 sm:pb-3 border-t border-white/[0.08] bg-[#09090d] relative shrink-0 z-10 shadow-lg">
          {showEmojiPicker && (
            <div className="absolute bottom-full right-3 mb-2 z-50">
              <EmojiPicker
                onSelect={(emoji) => {
                  setCommentText((prev) => prev + emoji);
                  commentInputRef.current?.focus();
                }}
                onClose={() => setShowEmojiPicker(false)}
                position="top"
              />
            </div>
          )}

          <form
            onSubmit={handleSubmitComment}
            className="flex items-center gap-2"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white/10 hidden sm:block"
            />

            <div className="flex-1 relative flex items-center">
              <input
                ref={commentInputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  replyingTo
                    ? `Reply to @${replyingTo.authorHandle.replace('@', '')}...`
                    : 'Add a comment...'
                }
                className="w-full bg-zinc-900 border border-white/[0.12] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 transition-all font-sans"
              />

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-2 p-1.5 text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
                title="Insert emoji"
                aria-label="Insert emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95 shadow-sm shadow-indigo-600/30"
              aria-label="Send comment"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </footer>
      </aside>
    </>
  );
};
