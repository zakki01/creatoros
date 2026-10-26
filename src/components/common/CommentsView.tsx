import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Heart,
  Smile,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
} from 'lucide-react';
import { SocialPost, PostComment } from '../../types/socialFeed';
import { useAppState } from '../../context/StateContext';
import { EmojiPicker, SelectedGifPayload } from './EmojiPicker';
import { ReactionPicker } from './ReactionPicker';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';

export interface CommentsViewProps {
  post: SocialPost;
  onClose: () => void;
}

export const CommentsView: React.FC<CommentsViewProps> = ({ post, onClose }) => {
  const {
    userProfile,
    addPostComment,
    toggleCommentLike,
    addCommentReply,
  } = useAppState();

  const [commentText, setCommentText] = useState('');
  const [pendingGif, setPendingGif] = useState<SelectedGifPayload | null>(null);
  const [replyingTo, setReplyingTo] = useState<PostComment | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeReactionCommentId, setActiveReactionCommentId] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({
    'c-101': true,
  });

  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
    if (!text && !pendingGif) return;

    if (replyingTo) {
      addCommentReply(post.id, replyingTo.id, text, pendingGif?.url);
      setExpandedReplies((prev) => ({ ...prev, [replyingTo.id]: true }));
      setReplyingTo(null);
    } else {
      addPostComment(post.id, text, pendingGif?.url);
    }

    setCommentText('');
    setPendingGif(null);
    setShowEmojiPicker(false);

    setTimeout(() => {
      if (commentsListRef.current) {
        commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
      }
    }, 80);
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

  const primaryMediaUrl = post.mediaUrl;

  return (
    <>
      {/* Subtle Backdrop: keeps post visible on left on desktop and partially visible behind bottom sheet on mobile */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Desktop Left Post Context Preview (sm+): ensures post media/content is always visible on the left while commenting */}
      {primaryMediaUrl && (
        <div
          className="hidden lg:flex fixed inset-y-8 left-8 right-[420px] z-40 items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto max-w-[440px] w-full rounded-3xl overflow-hidden bg-white/95 border border-black/[0.08] shadow-[0_28px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col"
          >
            <div className="px-4 py-3 flex items-center gap-2.5 border-b border-black/[0.06]">
              <Avatar
                src={post.authorAvatar}
                name={post.authorName}
                size="xs"
                verified={post.authorVerified}
              />
              <span className="text-xs font-semibold text-zinc-900 truncate">
                {post.authorName}
              </span>
              <span className="text-[11px] text-zinc-500 truncate">
                {post.authorHandle}
              </span>
            </div>
            <div className="relative aspect-[4/5] max-h-[62vh] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={primaryMediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover"
              />
            </div>
            {post.caption && (
              <div className="px-4 py-3 text-xs text-zinc-700 line-clamp-2 border-t border-black/[0.06]">
                <span className="font-semibold text-zinc-900 mr-1.5">{post.authorName}</span>
                {post.caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive Social Comments Panel:
          - Desktop (sm+): Compact Right Panel (w-[390px])
          - Mobile (<sm): Bottom Sheet (max-h-[72dvh], rounded-t-3xl) leaving post partially visible behind sheet
      */}
      <aside
        className="fixed z-50 flex flex-col bg-white/98 border-black/[0.08] shadow-[0_-20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-zinc-900 transition-all duration-300 overflow-hidden
          inset-x-0 bottom-0 max-h-[72dvh] rounded-t-3xl border-t
          sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-full sm:w-[390px] sm:rounded-none sm:border-l sm:border-t-0 animate-in slide-in-from-bottom sm:slide-in-from-right duration-200"
        role="dialog"
        aria-label="Comments"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div
          className="sm:hidden w-full pt-2.5 pb-1 flex justify-center cursor-pointer select-none"
          onClick={onClose}
        >
          <div className="w-9 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Clean Header: ONLY Comments + Count + [X] */}
        <header className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">
              Comments
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.07] text-zinc-700 font-medium">
              {totalCommentsCount}
            </span>
          </div>

          <IconButton
            aria-label="Close comments"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="-mr-1 text-zinc-500 hover:text-zinc-900"
          >
            <X className="w-4 h-4" />
          </IconButton>
        </header>

        {/* Compact Social Comments List */}
        <div
          ref={commentsListRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 focus:outline-none scrollbar-thin min-h-0"
        >
          {comments.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-1.5">
              <Smile className="w-5 h-5 text-zinc-500" />
              <p className="text-xs font-medium text-zinc-700">No comments yet</p>
            </div>
          ) : (
            comments.map((comment) => {
              const replies = comment.replies || [];
              const hasReplies = replies.length > 0;
              const isRepliesOpen = expandedReplies[comment.id];

              return (
                <div key={comment.id} className="space-y-2">
                  {/* Compact Comment Row */}
                  <div className="flex items-start gap-2.5">
                    <Avatar
                      src={comment.authorAvatar}
                      name={comment.authorName}
                      size="xs"
                      verified={comment.authorVerified}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-semibold text-zinc-900 truncate">
                          {comment.authorName}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {comment.timestamp}
                        </span>
                      </div>

                      {comment.content && (
                        <p className="text-xs text-zinc-800 mt-0.5 leading-relaxed break-words">
                          {comment.content}
                        </p>
                      )}

                      {comment.gifUrl && (
                        <div className="mt-1.5 relative w-44 h-28 rounded-xl overflow-hidden border border-white/[0.1] bg-white">
                          <img
                            src={comment.gifUrl}
                            alt="Comment GIF"
                            className="w-full h-full object-cover block"
                          />
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-[#0096C7] border border-black/[0.08]">
                            GIF
                          </span>
                        </div>
                      )}

                      {/* Compact Actions: ♡ Like | Reaction | Reply */}
                      <div className="flex items-center gap-3.5 mt-1.5 text-[11px] text-zinc-500">
                        <button
                          type="button"
                          onClick={() => toggleCommentLike(post.id, comment.id)}
                          className={`flex items-center gap-1 transition-colors cursor-pointer ${
                            comment.likedByMe
                              ? 'text-rose-400 font-medium'
                              : 'hover:text-zinc-800'
                          }`}
                        >
                          <Heart
                            className={`w-3 h-3 ${comment.likedByMe ? 'fill-current' : ''}`}
                          />
                          <span>
                            {comment.likes && comment.likes > 0 ? comment.likes : 'Like'}
                          </span>
                        </button>

                        {/* Reaction Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReactionCommentId(
                                activeReactionCommentId === comment.id ? null : comment.id
                              )
                            }
                            className="flex items-center gap-1 hover:text-zinc-800 transition-colors cursor-pointer"
                          >
                            <span>{comment.reaction || '😊'}</span>
                            <span>React</span>
                          </button>

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

                        <button
                          type="button"
                          onClick={() => handleStartReply(comment)}
                          className="hover:text-zinc-900 transition-colors cursor-pointer font-medium"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Compact Threaded Replies */}
                  {hasReplies && (
                    <div className="pl-8 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => toggleRepliesExpansion(comment.id)}
                        className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-800 font-medium cursor-pointer transition-colors"
                      >
                        <div className="w-4 h-px bg-white/15" />
                        <span>
                          {isRepliesOpen
                            ? 'Hide replies'
                            : `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
                        </span>
                        {isRepliesOpen ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {isRepliesOpen && (
                        <div className="space-y-2.5 pt-0.5 pl-2.5 border-l border-black/[0.08]">
                          {replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-2">
                              <Avatar
                                src={reply.authorAvatar}
                                name={reply.authorName}
                                size="xs"
                                verified={reply.authorVerified}
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-xs font-semibold text-zinc-900 truncate">
                                    {reply.authorName}
                                  </span>
                                  <span className="text-[10px] text-zinc-500">
                                    {reply.timestamp}
                                  </span>
                                </div>

                                {reply.content && (
                                  <p className="text-xs text-zinc-700 mt-0.5 leading-relaxed break-words">
                                    {reply.content}
                                  </p>
                                )}

                                {reply.gifUrl && (
                                  <div className="mt-1.5 relative w-fit max-w-[180px] rounded-xl overflow-hidden border border-black/[0.08] bg-black/50">
                                    <img
                                      src={reply.gifUrl}
                                      alt="Reply GIF"
                                      className="max-h-32 w-auto object-contain block"
                                    />
                                    <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/75 text-[8px] font-bold text-[#0096C7]">
                                      GIF
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500">
                                  <button
                                    type="button"
                                    onClick={() => toggleCommentLike(post.id, reply.id)}
                                    className={`flex items-center gap-1 transition-colors cursor-pointer ${
                                      reply.likedByMe ? 'text-rose-400' : 'hover:text-zinc-800'
                                    }`}
                                  >
                                    <Heart
                                      className={`w-2.5 h-2.5 ${reply.likedByMe ? 'fill-current' : ''}`}
                                    />
                                    <span>
                                      {reply.likes && reply.likes > 0 ? reply.likes : 'Like'}
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStartReply(comment)}
                                    className="hover:text-zinc-900 cursor-pointer"
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

        {/* Replying To Bar */}
        {replyingTo && (
          <div className="px-4 py-1.5 bg-indigo-950/40 border-t border-[#00B4D8]/20 text-[11px] text-[#0096C7] flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1.5 truncate">
              <CornerDownRight className="w-3 h-3 text-[#0096C7] shrink-0" />
              Replying to <strong className="text-zinc-900">{replyingTo.authorName}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setReplyingTo(null);
                setCommentText('');
              }}
              className="text-zinc-500 hover:text-zinc-900 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Attached GIF Preview Bar (when user picks/uploads a GIF from EmojiPicker) */}
        {pendingGif && (
          <div className="px-4 py-2 bg-white/95 border-t border-black/[0.08] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-black border border-black/[0.08] shrink-0">
                <img
                  src={pendingGif.url}
                  alt={pendingGif.title || 'GIF'}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[8px] font-bold text-[#0096C7]">
                  GIF
                </span>
              </div>
              <span className="text-xs text-zinc-800 truncate">
                {pendingGif.title || 'Animated GIF'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPendingGif(null)}
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-white/10"
              aria-label="Remove GIF"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Persistent Bottom Composer: [avatar] [ Add a comment... 😊 ] [Send] */}
        <footer className="p-3 border-t border-black/[0.08] bg-[#09090d]/95 backdrop-blur-md pb-safe relative shrink-0 z-10">
          {showEmojiPicker && (
            <div className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-3 sm:absolute sm:bottom-full sm:mb-2 z-50 flex justify-end">
              <EmojiPicker
                onSelect={(emoji) => {
                  setCommentText((prev) => prev + emoji);
                  commentInputRef.current?.focus();
                }}
                onSelectGif={(gif) => {
                  setPendingGif(gif);
                  setShowEmojiPicker(false);
                  commentInputRef.current?.focus();
                }}
                onClose={() => setShowEmojiPicker(false)}
                position="top"
              />
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
            <Avatar
              src={userProfile.avatarUrl}
              name={userProfile.name}
              size="xs"
              className="shrink-0"
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
                data-testid="comment-composer-input"
                className="w-full bg-white/90 border border-white/[0.1] rounded-xl pl-3 pr-9 py-2 min-h-[40px] text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/70 transition-all"
              />

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                data-testid="comment-emoji-gif-btn"
                className={`absolute right-1.5 w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  showEmojiPicker || pendingGif
                    ? 'text-[#0096C7] bg-[#00B4D8]/10'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
                title="Emoji & GIF"
                aria-label="Emoji & GIF"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!commentText.trim() && !pendingGif}
              data-testid="comment-send-btn"
              className="min-w-[40px] min-h-[40px] px-3 rounded-xl bg-[#00B4D8] hover:bg-[#0096C7] disabled:opacity-40 text-zinc-900 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
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
