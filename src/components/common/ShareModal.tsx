import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  Share2,
  ExternalLink,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { SocialPost } from '../../types/socialFeed';
import { useAppState } from '../../context/StateContext';

export interface ShareModalProps {
  post: SocialPost;
  onClose: () => void;
  onNavigateToMessages?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  post,
  onClose,
  onNavigateToMessages,
}) => {
  const { conversations, sendDirectMessage, setActiveConversationId } = useAppState();
  const [copied, setCopied] = useState(false);
  const [sentConvId, setSentConvId] = useState<string | null>(null);

  const postUrl = `${window.location.origin}/discover#${post.id}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendViaDM = (convId: string) => {
    setActiveConversationId(convId);
    sendDirectMessage(
      `Check out this drop by ${post.authorName}: "${post.content.slice(0, 60)}..." ${postUrl}`,
      post.mediaUrl,
      post.isReel ? 'video' : 'image'
    );
    setSentConvId(convId);
    setTimeout(() => {
      onClose();
      if (onNavigateToMessages) onNavigateToMessages();
    }, 800);
  };

  const handleExternalShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.authorName} on CreatorOS`,
          text: post.content.slice(0, 100),
          url: postUrl,
        });
        onClose();
      } catch {
        // User cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 space-y-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Share Drop</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Send to Connected Messages */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider font-semibold block">
            Send via Direct Message
          </span>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {conversations.slice(0, 5).map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSendViaDM(conv.id)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer min-w-[64px]"
              >
                <div className="relative">
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--border)]"
                  />
                  {sentConvId === conv.id && (
                    <div className="absolute inset-0 bg-emerald-500/80 rounded-full flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] font-medium truncate max-w-[60px] text-center">
                  {conv.participantName.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Share Action Rows */}
        <div className="space-y-1.5 border-t border-[var(--border)] pt-3">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--surface-muted)] shadow-sm hover:bg-[var(--surface-elevated)] border border-[var(--border)] transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)]">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--text-primary)] block">
                  {copied ? 'Link Copied to Clipboard!' : 'Copy Link'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  Direct permalink to this content
                </span>
              </div>
            </div>
            {copied && <span className="text-xs text-emerald-500 font-mono font-bold">Copied ✓</span>}
          </button>

          {/* External Share */}
          <button
            onClick={handleExternalShare}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--surface-muted)] shadow-sm hover:bg-[var(--surface-elevated)] border border-[var(--border)] transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)]">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--text-primary)] block">
                  Share Externally
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  WhatsApp, X, Instagram, Telegram
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
