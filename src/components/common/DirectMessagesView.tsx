import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  CheckCheck,
  Search,
  Sparkles,
  DollarSign,
  Clock,
  Layers,
  X,
  Smile,
  Reply,
  Forward,
  Copy,
  Check,
  MoreVertical,
  ShieldAlert,
  VolumeX,
  Volume2,
  Ban,
  ArrowLeft,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { DirectMessage } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmojiPicker } from './EmojiPicker';
import { ReactionPicker } from './ReactionPicker';
import { Tooltip } from '../ui/Tooltip';

const EMOJI_OPTIONS = ['❤️', '😂', '🔥', '👍', '👏', '😍', '😮', '😢'];

const RECENT_EMOJIS_DEFAULT = ['🔥', '❤️', '👍', '👏', '🙌', '✨', '🎯', '👟', '🚀', '💯', '😍', '🎉'];

const ALL_EMOJIS = [
  '😊', '😂', '🔥', '❤️', '👍', '👏',
  '🙌', '✨', '🎯', '👟', '🚀', '💯',
  '😍', '🤩', '😎', '🤝', '💼', '📸',
  '🎬', '🎨', '🎉', '⚡', '💡', '💬',
  '👌', '🙏', '💪', '👀', '🏆', '📈',
];

export const DirectMessagesView: React.FC = () => {
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendDirectMessage,
    role,
  } = useAppState();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Emoji picker state
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('creatoros_recent_emojis');
      return saved ? JSON.parse(saved) : RECENT_EMOJIS_DEFAULT;
    } catch {
      return RECENT_EMOJIS_DEFAULT;
    }
  });

  const handleSelectEmoji = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    setRecentEmojis((prev) => {
      const updated = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 12);
      try {
        localStorage.setItem('creatoros_recent_emojis', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Advanced messaging state
  const [replyingTo, setReplyingTo] = useState<DirectMessage | null>(null);
  const [forwardingMsg, setForwardingMsg] = useState<DirectMessage | null>(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('deliverable_breach');

  // Message Reactions state: msgId -> emoji -> count
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({
    'msg-2': { '🔥': 2, '❤️': 1 },
    'msg-3': { '👍': 1 },
  });

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  const filteredConversations = conversations.filter(
    (c) =>
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participantHandle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() && !attachedImage) return;

    let finalContent = messageInput;
    if (replyingTo) {
      finalContent = `[Replying to ${replyingTo.senderName}: "${replyingTo.content.substring(0, 45)}..."]\n${messageInput}`;
    }

    sendDirectMessage(
      finalContent,
      attachedImage || undefined,
      attachedImage ? 'image' : undefined
    );

    setMessageInput('');
    setAttachedImage(null);
    setReplyingTo(null);
  };

  const handleQuickPrompt = (promptText: string) => {
    setMessageInput(promptText);
  };

  const handleMockAttachment = () => {
    if (attachedImage) {
      setAttachedImage(null);
    } else {
      setAttachedImage('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80');
    }
  };

  const handleCopyText = (msg: DirectMessage) => {
    navigator.clipboard?.writeText(msg.content);
    setCopiedMsgId(msg.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setReactions((prev) => {
      const msgReactions = { ...(prev[msgId] || {}) };
      if (msgReactions[emoji]) {
        msgReactions[emoji] += 1;
      } else {
        msgReactions[emoji] = 1;
      }
      return { ...prev, [msgId]: msgReactions };
    });
    setActiveReactionMsgId(null);
  };

  const handleForwardTo = (targetConvId: string) => {
    if (!forwardingMsg) return;
    setActiveConversationId(targetConvId);
    sendDirectMessage(`[Forwarded from ${forwardingMsg.senderName}]: ${forwardingMsg.content}`);
    setForwardingMsg(null);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6.5rem)] rounded-2xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md flex overflow-hidden shadow-2xl animate-fade-in relative">
      {/* Left Sidebar: Conversations List (100% on mobile when viewing list) */}
      <div
        className={`${
          showMobileChat ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 border-r border-zinc-800/80 flex-col shrink-0 bg-zinc-950/40`}
      >
        {/* Search header */}
        <div className="p-3.5 border-b border-zinc-800/80">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white tracking-tight">Direct Messages</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
              Encrypted
            </span>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/80">
          {filteredConversations.map((conv) => {
            const isSelected = activeConv?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  setShowMobileChat(true);
                }}
                className={`w-full p-3 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900/80 border-l-2 border-indigo-500'
                    : 'hover:bg-zinc-900/30'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700/60"
                  />
                  {conv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {conv.participantName}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono shrink-0 ml-1">
                      {conv.lastTimestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 truncate mb-1">
                    {conv.lastMessage}
                  </p>

                  {conv.campaignContext && (
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800/80 text-[10px] text-indigo-300 font-mono truncate max-w-full">
                      <Layers className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{conv.campaignContext.name}</span>
                    </div>
                  )}
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-1">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Canvas: Chat Thread (100% on mobile when viewing chat) */}
      {activeConv ? (
        <div
          className={`${
            !showMobileChat ? 'hidden md:flex' : 'flex'
          } flex-1 flex-col min-w-0 bg-zinc-950/20`}
        >
          {/* Thread Header */}
          <div className="p-3 sm:p-3.5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Mobile Back Button to conversation list */}
              <button
                type="button"
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 -ml-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <img
                src={activeConv.participantAvatar}
                alt={activeConv.participantName}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-1 ring-zinc-700/60 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] sm:max-w-[200px]">
                    {activeConv.participantName}
                  </h3>
                  {activeConv.participantBadge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium shrink-0">
                      {activeConv.participantBadge}
                    </span>
                  )}
                  {isMuted && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 flex items-center gap-1 shrink-0">
                      <VolumeX className="w-3 h-3" /> Muted
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">
                  <span>{activeConv.participantHandle}</span>
                  <span className="mx-1">•</span>
                  <span className={activeConv.isOnline ? 'text-emerald-400' : 'text-zinc-500'}>
                    {activeConv.isOnline ? 'Online now' : 'Active recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Context Pill & Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {activeConv.campaignContext && (
                <div className="hidden lg:flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-medium max-w-[160px] truncate">
                    <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{activeConv.campaignContext.name}</span>
                  </div>
                  <span className="text-zinc-600">|</span>
                  <div className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                    <DollarSign className="w-3 h-3" />
                    <span>{activeConv.campaignContext.agreedFee.toLocaleString()}</span>
                  </div>
                  <span className="text-zinc-600">|</span>
                  <div className="flex items-center gap-1 text-amber-400 font-mono text-[10px]">
                    <Clock className="w-3 h-3" />
                    <span>{activeConv.campaignContext.milestone}</span>
                  </div>
                </div>
              )}

              {/* Thread Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Thread options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {isHeaderMenuOpen && (
                  <div className="absolute right-0 top-8 z-40 w-44 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl py-1 text-xs text-zinc-300 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMuted(!isMuted);
                        setIsHeaderMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                    >
                      {isMuted ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-400" />}
                      <span>{isMuted ? 'Unmute Notifications' : 'Mute Thread'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsReportModalOpen(true);
                        setIsHeaderMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-800 flex items-center gap-2 text-amber-400 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Report User</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsBlockModalOpen(true);
                        setIsHeaderMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-800 flex items-center gap-2 text-rose-400 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Block Contact</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeMessages.map((msg) => {
              const isMine =
                msg.senderRole === role ||
                (role === 'business' && msg.senderId === 'brand-aura') ||
                (role === 'creator' && msg.senderId === 'creator-rohan');

              const msgReactions = reactions[msg.id] || {};

              return (
                <div
                  key={msg.id}
                  className={`group relative flex items-end gap-2.5 max-w-lg ${
                    isMine ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700/60 shrink-0 mb-1"
                  />

                  <div className="relative">
                    {/* Hover Action Bar */}
                    <div
                      className={`absolute -top-7 ${
                        isMine ? 'right-0' : 'left-0'
                      } hidden group-hover:flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg px-1.5 py-0.5 shadow-lg z-20`}
                    >
                      {/* Reaction Popover Toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)
                        }
                        className="p-1 hover:text-amber-400 text-zinc-400 rounded transition-colors cursor-pointer"
                        title="Add reaction"
                      >
                        <Smile className="w-3.5 h-3.5" />
                      </button>

                      {/* Reply */}
                      <button
                        type="button"
                        onClick={() => setReplyingTo(msg)}
                        className="p-1 hover:text-indigo-400 text-zinc-400 rounded transition-colors cursor-pointer"
                        title="Reply quote"
                      >
                        <Reply className="w-3.5 h-3.5" />
                      </button>

                      {/* Forward */}
                      <button
                        type="button"
                        onClick={() => setForwardingMsg(msg)}
                        className="p-1 hover:text-emerald-400 text-zinc-400 rounded transition-colors cursor-pointer"
                        title="Forward"
                      >
                        <Forward className="w-3.5 h-3.5" />
                      </button>

                      {/* Copy */}
                      <button
                        type="button"
                        onClick={() => handleCopyText(msg)}
                        className="p-1 hover:text-zinc-200 text-zinc-400 rounded transition-colors cursor-pointer"
                        title="Copy message"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Reaction Emoji Picker Popover */}
                    {activeReactionMsgId === msg.id && (
                      <div
                        className={`absolute -top-12 ${
                          isMine ? 'right-0' : 'left-0'
                        } z-40 animate-fade-in`}
                      >
                        <ReactionPicker
                          onSelectReaction={(emoji) => handleToggleReaction(msg.id, emoji)}
                          onClose={() => setActiveReactionMsgId(null)}
                          position="top"
                        />
                      </div>
                    )}

                    {/* Bubble Content */}
                    <div
                      onDoubleClick={() => handleToggleReaction(msg.id, '❤️')}
                      className={`rounded-2xl p-3 text-xs space-y-1.5 cursor-pointer select-none transition-transform active:scale-[0.99] ${
                        isMine
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                          : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800/80 rounded-bl-none'
                      }`}
                    >
                      {msg.campaignName && (
                        <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-200 opacity-90 flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5" />
                          <span>Campaign: {msg.campaignName}</span>
                        </div>
                      )}

                      {msg.content && (
                        <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                      )}

                      {msg.attachmentUrl && (
                        <div className="rounded-lg overflow-hidden border border-black/20 my-1 max-w-sm">
                          <img
                            src={msg.attachmentUrl}
                            alt="Attachment preview"
                            className="w-full h-auto max-h-60 object-cover"
                          />
                        </div>
                      )}

                      <div
                        className={`text-[9px] font-mono flex items-center justify-end gap-1 ${
                          isMine ? 'text-indigo-200' : 'text-zinc-500'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isMine && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>

                    {/* Reaction Badges Under Bubble */}
                    {Object.keys(msgReactions).length > 0 && (
                      <div
                        className={`flex items-center gap-1 mt-1 ${
                          isMine ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {Object.entries(msgReactions).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] hover:border-zinc-700 transition-colors cursor-pointer"
                          >
                            <span>{emoji}</span>
                            <span className="font-mono text-[10px] text-zinc-400 font-semibold">
                              {count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Composer Area */}
          <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/60 space-y-2">
            {/* Quoted Reply Preview Bar */}
            {replyingTo && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-indigo-500/30 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold text-indigo-300 block text-[11px]">
                      Replying to {replyingTo.senderName}
                    </span>
                    <span className="text-zinc-400 text-[11px] truncate block">
                      {replyingTo.content.substring(0, 75)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-zinc-500 hover:text-white p-1 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Short Quick-Action Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <button
                type="button"
                onClick={() => handleQuickPrompt('✨ Draft uploaded')}
                className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 shrink-0 transition-colors cursor-pointer text-[11px] flex items-center gap-1"
              >
                <span>✨</span>
                <span>Draft uploaded</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Approve draft')}
                className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 shrink-0 transition-colors cursor-pointer text-[11px]"
              >
                Approve draft
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('👍 Feedback')}
                className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 shrink-0 transition-colors cursor-pointer text-[11px] flex items-center gap-1"
              >
                <span>👍</span>
                <span>Feedback</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('🎯 Review')}
                className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 shrink-0 transition-colors cursor-pointer text-[11px] flex items-center gap-1"
              >
                <span>🎯</span>
                <span>Review</span>
              </button>
            </div>

            {/* Attachment preview if selected */}
            {attachedImage && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800 w-fit">
                <img src={attachedImage} alt="Attachment" className="w-10 h-10 object-cover rounded-lg" />
                <span className="text-xs text-zinc-300">lookbook-draft-cut.jpg</span>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="text-zinc-500 hover:text-white px-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Form [ 📎 ] [ 😊 ] [ Type your message... ] [ Send ] */}
            <form onSubmit={handleSend} className="flex items-center gap-1.5 relative">
              {/* Attachment Button */}
              <button
                type="button"
                onClick={handleMockAttachment}
                className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                  attachedImage
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                }`}
                title="Attach media or deliverable sample"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Emoji Button & Compact Dark Glass Popover */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isEmojiPickerOpen
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                  }`}
                  title="Insert emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {isEmojiPickerOpen && (
                  <div className="absolute bottom-11 left-0 z-50">
                    <EmojiPicker
                      onSelect={(emoji) => {
                        handleSelectEmoji(emoji);
                        setIsEmojiPickerOpen(false);
                      }}
                      onClose={() => setIsEmojiPickerOpen(false)}
                      position="top"
                    />
                  </div>
                )}
              </div>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={
                  replyingTo
                    ? `Reply to ${replyingTo.senderName}...`
                    : 'Type your message, deliverable update, or campaign question...'
                }
                className="flex-1 bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60"
              />

              <button
                type="submit"
                disabled={!messageInput.trim() && !attachedImage}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-600/30 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-center p-8 text-zinc-500 text-xs">
          Select a conversation from the left to start messaging.
        </div>
      )}

      {/* Forward Message Modal */}
      {forwardingMsg && (
        <Modal
          isOpen={!!forwardingMsg}
          onClose={() => setForwardingMsg(null)}
          title="Forward Message"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 italic">
              "{forwardingMsg.content}"
            </div>
            <p className="font-semibold text-zinc-400">Select conversation to forward to:</p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {conversations
                .filter((c) => c.id !== activeConv?.id)
                .map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleForwardTo(conv.id)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={conv.participantAvatar} alt={conv.participantName} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span className="font-semibold text-zinc-200 block">{conv.participantName}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{conv.participantHandle}</span>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-400 font-medium">Forward →</span>
                  </button>
                ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Block Modal */}
      {isBlockModalOpen && (
        <Modal
          isOpen={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          title={`Block ${activeConv?.participantName}?`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-400">
              They will no longer be able to message you or invite you to active campaigns. Active signed escrow milestones remain legally binding.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsBlockModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`${activeConv?.participantName} has been blocked.`);
                  setIsBlockModalOpen(false);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
              >
                Confirm Block
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title="Report CreatorOS User"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-400">
              Submit an immutable Trust & Safety report for investigation by platform compliance officers.
            </p>
            <div className="space-y-2">
              <label className="font-semibold text-zinc-300 block">Violation Reason</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="deliverable_breach">Deliverable Breach / Non-Delivery</option>
                <option value="harassment">Unprofessional Conduct / Harassment</option>
                <option value="fraud">Fraudulent Metrics / Fake Followers</option>
                <option value="impersonation">Identity Impersonation</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsReportModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('Trust & Safety report submitted with encrypted transcript.');
                  setIsReportModalOpen(false);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white cursor-pointer"
              >
                Submit Report
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
