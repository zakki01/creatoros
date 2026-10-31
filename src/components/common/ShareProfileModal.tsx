import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  MessageSquare,
  Share2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    role: 'creator' | 'business';
    category?: string;
    followers?: string;
    engagementRate?: number;
    availabilityStatus?: string;
    verified?: boolean;
    bio?: string;
  };
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
  isOpen,
  onClose,
  profileData,
}) => {
  const { conversations, sendDirectMessage, setActiveConversationId, setCreatorActiveTab, campaigns, inviteCreator, role } =
    useAppState();
  const [copied, setCopied] = useState(false);
  const [sentChatId, setSentChatId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '');
  const [campaignShared, setCampaignShared] = useState(false);

  if (!isOpen) return null;

  const publicUrl = `https://creatoros.ai/${profileData.role === 'business' ? 'brand' : 'creator'}/${profileData.handle.replace('@', '')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `${profileData.name} on CreatorOS`,
          text: `Check out ${profileData.name} (${profileData.handle}) on CreatorOS`,
          url: publicUrl,
        });
      } catch (err) {
        // User cancelled or share dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareToCampaign = () => {
    if (!selectedCampaignId) return;
    inviteCreator(profileData.id, selectedCampaignId, 25000);
    setCampaignShared(true);
    setTimeout(() => setCampaignShared(false), 2500);
  };

  const handleShareToConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);

    // Send rich profile card into chat
    sendDirectMessage(
      `Shared profile: ${profileData.name} (${profileData.handle})`,
      undefined,
      undefined,
      {
        messageType: 'profile_card',
        customId: `card-${Date.now()}`,
      }
    );

    setSentChatId(conversationId);
    setTimeout(() => {
      onClose();
      setCreatorActiveTab('messages');
    }, 800);
  };

  const shareText = encodeURIComponent(
    `Check out ${profileData.name} on CreatorOS (${profileData.handle}): ${publicUrl}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-muted)]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--text-primary)] font-display">Share Profile</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-[var(--surface)]/10 hover:bg-black/10 dark:hover:bg-[var(--surface)]/15 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Preview */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center gap-3.5 shadow-xs">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-14 h-14 rounded-2xl object-cover ring-1 ring-[var(--primary)]/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">{profileData.name}</h4>
                {profileData.verified && <ShieldCheck className="w-4 h-4 text-[var(--primary)] shrink-0" />}
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono">{profileData.handle}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--text-secondary)]">
                {profileData.category && <span>{profileData.category}</span>}
                {profileData.availabilityStatus && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {profileData.availabilityStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 1. Copy Public Link & Native Share */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)] block">Public Profile URL</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2 text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface-muted)] rounded-xl border border-[var(--border)] truncate select-all">
                {publicUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleNativeShare}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-[var(--surface-muted)] hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-primary)] border border-[var(--border)] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Share via device system dialog"
              >
                <Share2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>Share...</span>
              </button>
            </div>
          </div>

          {/* Share to Brand Campaign */}
          {role === 'business' && profileData.role === 'creator' && campaigns.length > 0 && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/60">
              <label className="text-xs font-semibold text-teal-900 flex items-center justify-between">
                <span>Add Creator to Campaign Brief</span>
                <span className="text-[10px] text-teal-700 font-mono">Brand Workspace</span>
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[var(--surface)] rounded-xl border border-teal-200 text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.brandName})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleShareToCampaign}
                  disabled={campaignShared}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {campaignShared ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{campaignShared ? 'Added ✓' : 'Add to Brief'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Send Direct to Active Conversations */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
              <span>Send Directly to CreatorOS Chat</span>
              <span className="text-[10px] text-[var(--text-muted)]">1-Click Rich Profile Card</span>
            </label>

            <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
              {conversations.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] italic p-3 text-center">No active chats found.</p>
              ) : (
                conversations.map((conv) => {
                  const isSent = sentChatId === conv.id;
                  return (
                    <div
                      key={conv.id}
                      className="p-2.5 rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface-muted)] hover:bg-[var(--surface-muted)] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={conv.participantAvatar}
                          alt={conv.participantName}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                            {conv.participantName}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                            {conv.participantHandle}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleShareToConversation(conv.id)}
                        disabled={isSent}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSent
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-200 hover:bg-[var(--primary)] hover:text-white text-[var(--text-primary)]'
                        }`}
                      >
                        {isSent ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3 h-3" />}
                        <span>{isSent ? 'Sent ✓' : 'Send'}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 3. External Sharing Channels */}
          <div className="space-y-2 pt-1 border-t border-zinc-100">
            <span className="text-xs font-semibold text-[var(--text-primary)] block">External Share Channels</span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-emerald-50 hover:border-emerald-300 text-[var(--text-primary)] hover:text-emerald-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-sky-50 hover:border-sky-300 text-[var(--text-primary)] hover:text-sky-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>X / Twitter</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  publicUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-blue-50 hover:border-blue-300 text-[var(--text-primary)] hover:text-blue-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
