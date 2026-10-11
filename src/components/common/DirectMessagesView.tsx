import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  CheckCheck,
  Check,
  Search,
  DollarSign,
  Clock,
  Layers,
  X,
  Smile,
  Reply,
  Forward,
  Copy,
  MoreVertical,
  ShieldAlert,
  VolumeX,
  Volume2,
  Ban,
  ArrowLeft,
  Phone,
  Video,
  User,
  Download,
  FileText,
  Sparkles,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { DirectMessage } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';
import { useToast } from '../ui/Toast';
import { EmojiPicker } from './EmojiPicker';
import { ReactionPicker } from './ReactionPicker';
import { validateGifFile } from '../../services/gifValidationService';
import { ChatMediaService } from '../../services/chatMediaService';

interface PendingGifState {
  file: File;
  previewUrl: string;
  fileName: string;
  fileSizeBytes: number;
  width?: number;
  height?: number;
}

interface ViewingMediaState {
  url: string;
  type: 'gif' | 'image' | 'video';
  fileName?: string;
  width?: number;
  height?: number;
}

const QUICK_ACTION_CHIPS = [
  { id: 'draft', label: '✨ Draft uploaded', prompt: '✨ Draft uploaded for your review. Please let me know what you think!' },
  { id: 'approve', label: 'Approve draft', prompt: 'Draft looks fantastic! Approved to proceed with final cut.' },
  { id: 'feedback', label: '👍 Feedback', prompt: '👍 Left feedback on the latest draft in the deliverables section.' },
  { id: 'review', label: '🎯 Review', prompt: '🎯 Reviewing the latest deliverable now. Will get back shortly.' },
];

export const DirectMessagesView: React.FC = () => {
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendDirectMessage,
    updateDirectMessageStatus,
    deleteDirectMessage,
    role,
  } = useAppState();

  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gifInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string>('lookbook-draft-cut.jpg');
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Dedicated Native Device GIF state
  const [pendingGif, setPendingGif] = useState<PendingGifState | null>(null);
  const [viewingMedia, setViewingMedia] = useState<ViewingMediaState | null>(null);

  // Emoji picker state
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleSelectEmoji = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    messageInputRef.current?.focus();
  };

  // Clean up object URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (pendingGif) {
        ChatMediaService.revokePreviewUrl(pendingGif.previewUrl);
      }
    };
  }, [pendingGif]);

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

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() && !attachedImage && !pendingGif) return;

    let finalContent = messageInput.trim();
    if (replyingTo) {
      finalContent = `[Replying to ${replyingTo.senderName}: "${replyingTo.content.substring(0, 45)}..."]\n${finalContent}`;
    }

    // 1. Sending Native Device GIF (Optimistic UI Flow)
    if (pendingGif && activeConv) {
      const optId = `msg-${Date.now()}`;
      const fileToUpload = pendingGif.file;
      const fileName = pendingGif.fileName;
      const previewUrl = pendingGif.previewUrl;
      const fileSize = pendingGif.fileSizeBytes;
      const width = pendingGif.width;
      const height = pendingGif.height;

      // Optimistically insert message into conversation
      sendDirectMessage(
        finalContent,
        previewUrl,
        'gif',
        {
          messageType: 'gif',
          uploadStatus: 'uploading',
          uploadProgress: 20,
          customId: optId,
          mediaMetadata: {
            mimeType: 'image/gif',
            fileName,
            fileSize,
            width,
            height,
            storagePath: '',
            storageUrl: previewUrl,
          },
        }
      );

      // Reset composer immediately so user can continue interacting
      setPendingGif(null);
      setMessageInput('');
      setReplyingTo(null);

      // Execute background storage upload
      try {
        const uploadResult = await ChatMediaService.uploadGif({
          conversationId: activeConv.id,
          messageId: optId,
          file: fileToUpload,
          fileName,
          onProgress: (percent) => {
            updateDirectMessageStatus(activeConv.id, optId, {
              uploadProgress: percent,
            });
          },
        });

        if (uploadResult.success && uploadResult.metadata) {
          updateDirectMessageStatus(activeConv.id, optId, {
            uploadStatus: 'sent',
            uploadProgress: 100,
            attachmentUrl: uploadResult.metadata.storageUrl,
            mediaMetadata: uploadResult.metadata,
          });
        } else {
          updateDirectMessageStatus(activeConv.id, optId, {
            uploadStatus: 'failed',
          });
          toast.error(uploadResult.error || 'Upload failed. Try again.');
        }
      } catch {
        updateDirectMessageStatus(activeConv.id, optId, {
          uploadStatus: 'failed',
        });
        toast.error('Upload failed. Try again.');
      }
      return;
    }

    // 2. Normal Attachment / Text Message Flow
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
    messageInputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setAttachedImage(reader.result as string);
          toast.success(`Attached image ${file.name}`);
        };
        reader.readAsDataURL(file);
      } else {
        // Fallback placeholder preview
        setAttachedImage('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80');
        toast.info(`Attached file ${file.name}`);
      }
    }
  };

  const triggerAttachment = () => {
    if (attachedImage) {
      setAttachedImage(null);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleGifSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateGifFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Select a valid GIF file.');
      if (gifInputRef.current) gifInputRef.current.value = '';
      return;
    }

    if (pendingGif) {
      ChatMediaService.revokePreviewUrl(pendingGif.previewUrl);
    }

    const previewUrl = ChatMediaService.createPreviewUrl(file);
    setPendingGif({
      file,
      previewUrl,
      fileName: validation.fileName,
      fileSizeBytes: validation.fileSizeBytes,
      width: validation.width,
      height: validation.height,
    });

    if (gifInputRef.current) {
      gifInputRef.current.value = '';
    }
  };

  const handleRemovePendingGif = () => {
    if (pendingGif) {
      ChatMediaService.revokePreviewUrl(pendingGif.previewUrl);
      setPendingGif(null);
    }
  };

  const triggerGifPicker = () => {
    gifInputRef.current?.click();
  };

  const handleRetryGifUpload = async (msg: DirectMessage) => {
    if (!activeConv) return;
    updateDirectMessageStatus(activeConv.id, msg.id, {
      uploadStatus: 'uploading',
      uploadProgress: 30,
    });

    // Simulated retry upload with successful commit
    setTimeout(() => {
      updateDirectMessageStatus(activeConv.id, msg.id, {
        uploadStatus: 'sent',
        uploadProgress: 100,
      });
      toast.success('GIF uploaded successfully');
    }, 450);
  };

  const handleCopyText = (msg: DirectMessage) => {
    navigator.clipboard?.writeText(msg.content);
    setCopiedMsgId(msg.id);
    toast.success('Message copied to clipboard');
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
    toast.success('Message forwarded successfully');
  };

  const handleCallAction = (type: 'audio' | 'video') => {
    if (type === 'audio') {
      toast.info(`Starting voice call with ${activeConv?.participantName}...`, 'Encrypted Audio');
    } else {
      toast.info(`Creating video meeting room with ${activeConv?.participantName}...`, 'HD Video Call');
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6.5rem)] rounded-2xl border border-white/[0.08] bg-[#0c0c11]/80 backdrop-blur-xl flex overflow-hidden shadow-2xl relative">
      {/* Hidden File Input for Real/Mock Attachments */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.zip"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload message attachment"
      />

      {/* Hidden GIF Input for Dedicated Native Device GIF Upload */}
      <input
        ref={gifInputRef}
        type="file"
        accept="image/gif,.gif"
        onChange={handleGifSelect}
        className="hidden"
        aria-label="Upload GIF"
      />

      {/* =========================================================================
          LEFT COLUMN: Conversations Master List
          On mobile (<768px): 100% width when showMobileChat is false, hidden when true.
          On desktop (>=768px): w-80 fixed sidebar.
         ========================================================================= */}
      <div
        className={`${
          showMobileChat ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 border-r border-white/[0.08] flex-col shrink-0 bg-[#09090d]/80`}
      >
        {/* Search header */}
        <div className="p-3.5 border-b border-white/[0.08]">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-bold text-white tracking-tight">Direct Messages</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
              Encrypted
            </span>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] overscroll-contain">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setShowMobileChat(true);
                  }}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.07] border-l-2 border-indigo-500'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <Avatar
                    src={conv.participantAvatar}
                    name={conv.participantName}
                    size="md"
                    status={conv.isOnline ? 'online' : 'offline'}
                    verified={!!conv.participantBadge}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-zinc-100 truncate">
                        {conv.participantName}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono shrink-0 ml-1">
                        {conv.lastTimestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 truncate mb-1">
                      {conv.lastMessage}
                    </p>

                    {conv.campaignContext && (
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-[10px] text-indigo-300 font-mono truncate max-w-full border border-indigo-500/20">
                        <Layers className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{conv.campaignContext.name}</span>
                      </div>
                    )}
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-1 shadow-sm shadow-indigo-600/40">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* =========================================================================
          RIGHT CANVAS: Chat Thread Detail View
          On mobile (<768px): 100% width when showMobileChat is true, hidden when false.
          On desktop (>=768px): flex-1 min-w-0.
         ========================================================================= */}
      {activeConv ? (
        <div
          className={`${
            !showMobileChat ? 'hidden md:flex' : 'flex'
          } flex-1 flex-col min-w-0 bg-[#09090d]/30`}
        >
          {/* Thread Header */}
          <div className="p-3 sm:p-3.5 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-[#0a0a0f]/90 backdrop-blur-md">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Mobile Back Button: Return to conversation list */}
              <div className="md:hidden">
                <IconButton
                  aria-label="Back to conversations"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileChat(false)}
                >
                  <ArrowLeft className="w-4 h-4 text-zinc-300" />
                </IconButton>
              </div>

              <Avatar
                src={activeConv.participantAvatar}
                name={activeConv.participantName}
                size="sm"
                status={activeConv.isOnline ? 'online' : 'offline'}
                verified={!!activeConv.participantBadge}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-nowrap">
                  <h3 className="text-xs sm:text-sm font-bold text-white shrink-0">
                    {activeConv.participantName}
                  </h3>
                  {activeConv.participantBadge && (
                    <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium shrink-0">
                      {activeConv.participantBadge}
                    </span>
                  )}
                  {isMuted && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 flex items-center gap-1 shrink-0 border border-white/[0.08]">
                      <VolumeX className="w-3 h-3" /> Muted
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">
                  <span>{activeConv.participantHandle}</span>
                  <span className="mx-1">•</span>
                  <span className={activeConv.isOnline ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}>
                    {activeConv.isOnline ? 'Online now' : 'Active recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contract Context & Campaign Context Pill */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-mono text-zinc-300 font-semibold text-[11px] hidden sm:inline">
                  #CR-2026-8491
                </span>
                <button
                  type="button"
                  onClick={() => {
                    window.history.pushState({}, '', '/brand/contracts');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold underline ml-0.5 cursor-pointer"
                >
                  Open Contract
                </button>
              </div>

              {activeConv.campaignContext && (
                <div className="hidden 2xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
                  <div className="flex items-center gap-1 text-zinc-200 font-medium max-w-[140px] truncate">
                    <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{activeConv.campaignContext.name}</span>
                  </div>
                  <span className="text-zinc-600">|</span>
                  <div className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                    <DollarSign className="w-3 h-3" />
                    <span>${activeConv.campaignContext.agreedFee.toLocaleString()}</span>
                  </div>
                  <span className="text-zinc-600">|</span>
                  <div className="flex items-center gap-1 text-amber-400 font-mono text-[10px]">
                    <Clock className="w-3 h-3" />
                    <span>{activeConv.campaignContext.milestone}</span>
                  </div>
                </div>
              )}

              {/* Call Actions (Audio & Video) */}
              <IconButton
                aria-label="Start voice call"
                variant="ghost"
                size="sm"
                onClick={() => handleCallAction('audio')}
                className="hidden sm:inline-flex"
              >
                <Phone className="w-4 h-4 text-zinc-400 hover:text-white" />
              </IconButton>

              <IconButton
                aria-label="Start video call"
                variant="ghost"
                size="sm"
                onClick={() => handleCallAction('video')}
                className="hidden sm:inline-flex"
              >
                <Video className="w-4 h-4 text-zinc-400 hover:text-white" />
              </IconButton>

              <IconButton
                aria-label={`View ${activeConv.participantName}'s profile`}
                variant="ghost"
                size="sm"
                onClick={() => toast.info(`Viewing ${activeConv.participantName}'s portfolio & brand metrics`)}
              >
                <User className="w-4 h-4 text-zinc-400 hover:text-white" />
              </IconButton>

              {/* Thread Menu */}
              <div className="relative">
                <IconButton
                  aria-label="More conversation options"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                >
                  <MoreVertical className="w-4 h-4 text-zinc-400 hover:text-white" />
                </IconButton>

                {isHeaderMenuOpen && (
                  <div className="absolute right-0 top-10 z-40 w-48 rounded-xl bg-[#0e0e15] border border-white/[0.12] shadow-2xl py-1 text-xs text-zinc-300 animate-slide-up backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMuted(!isMuted);
                        setIsHeaderMenuOpen(false);
                        toast.info(isMuted ? 'Notifications unmuted' : 'Notifications muted');
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-white/[0.06] flex items-center gap-2.5 cursor-pointer transition-colors"
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
                      className="w-full px-3.5 py-2 text-left hover:bg-white/[0.06] flex items-center gap-2.5 text-amber-400 cursor-pointer transition-colors"
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
                      className="w-full px-3.5 py-2 text-left hover:bg-white/[0.06] flex items-center gap-2.5 text-rose-400 cursor-pointer transition-colors"
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white">Start a conversation</h4>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Discuss campaign deliverables, review revisions, or share milestones directly with {activeConv.participantName}.
                </p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMine =
                  msg.senderRole === role ||
                  (role === 'business' && msg.senderId === 'brand-aura') ||
                  (role === 'creator' && msg.senderId === 'creator-rohan');

                const msgReactions = reactions[msg.id] || {};

                return (
                  <div
                    key={msg.id}
                    className={`group relative flex items-end gap-2.5 max-w-[88%] sm:max-w-lg ${
                      isMine ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    <Avatar
                      src={msg.senderAvatar}
                      name={msg.senderName}
                      size="xs"
                      className="shrink-0 mb-1"
                    />

                    <div className="relative">
                      {/* Hover Action Bar */}
                      <div
                        className={`absolute -top-7 ${
                          isMine ? 'right-0' : 'left-0'
                        } hidden group-hover:flex items-center gap-0.5 bg-[#12121b] border border-white/[0.1] rounded-lg px-1 py-0.5 shadow-xl z-20 backdrop-blur-md`}
                      >
                        {/* Reaction Toggle */}
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

                      {/* Reaction Popover */}
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
                        className={`rounded-2xl p-3 sm:p-3.5 text-xs space-y-1.5 cursor-pointer select-none transition-transform active:scale-[0.99] ${
                          isMine
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                            : 'bg-[#13131c] text-zinc-100 border border-white/[0.08] rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.campaignName && (
                          <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-200/90 flex items-center gap-1 font-semibold">
                            <Layers className="w-2.5 h-2.5" />
                            <span>Campaign: {msg.campaignName}</span>
                          </div>
                        )}

                        {msg.content && (
                          <p className="leading-relaxed whitespace-pre-line text-xs sm:text-[13px]">{msg.content}</p>
                        )}

                        {/* Dedicated Animated GIF Message Rendering */}
                        {(msg.messageType === 'gif' || msg.attachmentType === 'gif') && (msg.attachmentUrl || msg.mediaMetadata?.storageUrl) && (
                          <div className="relative group my-1.5 max-w-[320px] sm:max-w-[360px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-lg">
                            <img
                              src={msg.mediaMetadata?.storageUrl || msg.attachmentUrl}
                              alt={msg.mediaMetadata?.fileName || 'Animated GIF'}
                              className="w-full h-auto max-h-[320px] object-contain cursor-pointer hover:opacity-95 transition-opacity"
                              loading="lazy"
                              onClick={() =>
                                setViewingMedia({
                                  url: msg.mediaMetadata?.storageUrl || msg.attachmentUrl || '',
                                  type: 'gif',
                                  fileName: msg.mediaMetadata?.fileName,
                                  width: msg.mediaMetadata?.width,
                                  height: msg.mediaMetadata?.height,
                                })
                              }
                            />

                            {/* GIF pill badge */}
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] font-black text-white/90 border border-white/20 tracking-wider font-mono pointer-events-none">
                              GIF
                            </div>

                            {/* Uploading progress overlay */}
                            {msg.uploadStatus === 'uploading' && (
                              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center z-10">
                                <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
                                <span className="text-[11px] font-medium text-white mb-1.5 font-sans">
                                  Uploading GIF...
                                </span>
                                <div className="w-28 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-500 transition-all duration-150"
                                    style={{ width: `${msg.uploadProgress || 20}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Failed upload state */}
                            {msg.uploadStatus === 'failed' && (
                              <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center z-10">
                                <AlertTriangle className="w-5 h-5 text-rose-400 mb-1" />
                                <span className="text-[11px] font-medium text-rose-200 mb-2">
                                  Upload failed
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRetryGifUpload(msg);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Retry</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (activeConv) deleteDirectMessage(activeConv.id, msg.id);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-[10px] font-semibold cursor-pointer transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Standard Image / Document Attachment (Non-GIF) */}
                        {msg.attachmentUrl && msg.messageType !== 'gif' && msg.attachmentType !== 'gif' && (
                          <div className="rounded-xl overflow-hidden border border-white/10 my-1.5 max-w-sm bg-black/40">
                            <img
                              src={msg.attachmentUrl}
                              alt="Attachment preview"
                              className="w-full h-auto max-h-60 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                              onClick={() =>
                                setViewingMedia({
                                  url: msg.attachmentUrl || '',
                                  type: 'image',
                                  fileName: 'lookbook-draft-cut.jpg',
                                })
                              }
                            />
                            <div className="p-2 flex items-center justify-between bg-black/60 text-[10px] text-zinc-300 font-mono">
                              <span className="truncate">lookbook-draft-cut.jpg</span>
                              <Download className="w-3.5 h-3.5 text-zinc-400 hover:text-white cursor-pointer ml-2 shrink-0" />
                            </div>
                          </div>
                        )}

                        {/* Timestamp & Status Indicator */}
                        <div
                          className={`text-[9px] font-mono flex items-center justify-end gap-1 mt-1 ${
                            isMine ? 'text-indigo-200' : 'text-zinc-400'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isMine && (
                            <span title="Read by recipient">
                              <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                            </span>
                          )}
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
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#13131c] border border-white/10 text-[11px] hover:border-white/20 transition-colors cursor-pointer"
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
              })
            )}
          </div>

          {/* =========================================================================
              MESSAGE COMPOSER AREA: [ 📎 ] [ 😊 ] [ Type your message... ] [ Send ]
              Includes Safe Area Inset (pb-safe) and Fitts's Law 44px hit targets.
             ========================================================================= */}
          <div className="p-3 sm:p-3.5 border-t border-white/[0.08] bg-[#09090d]/80 space-y-2 pb-safe">
            {/* Quoted Reply Preview Bar */}
            {replyingTo && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-indigo-500/40 text-xs animate-slide-up">
                <div className="flex items-center gap-2.5 truncate">
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
                  className="text-zinc-400 hover:text-white p-1 transition-colors cursor-pointer rounded-lg hover:bg-white/10"
                  aria-label="Cancel reply"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Short Quick-Action Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              {QUICK_ACTION_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleQuickPrompt(chip.prompt)}
                  className="px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] text-zinc-300 shrink-0 transition-colors cursor-pointer text-xs flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Native Device GIF Preview Before Sending */}
            {pendingGif && (
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#14141d] border border-indigo-500/40 shadow-xl backdrop-blur-xl animate-slide-up">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0">
                    <img
                      src={pendingGif.previewUrl}
                      alt="GIF Preview"
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[8px] font-black text-indigo-300 font-mono">
                      GIF
                    </span>
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-xs font-semibold text-zinc-100 block truncate">
                      {pendingGif.fileName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono block">
                      {(pendingGif.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                      {pendingGif.width && pendingGif.height ? ` • ${pendingGif.width}×${pendingGif.height}` : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRemovePendingGif}
                    className="min-h-[44px] min-w-[44px] sm:min-w-0 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    aria-label="Remove GIF"
                    title="Remove GIF"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            )}

            {/* Attachment preview if selected */}
            {attachedImage && (
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.05] border border-white/10 w-fit animate-slide-up">
                <img src={attachedImage} alt="Attachment" className="w-10 h-10 object-cover rounded-lg ring-1 ring-white/10" />
                <span className="text-xs text-zinc-300 font-mono">{attachedFileName}</span>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="text-zinc-400 hover:text-white p-1 transition-colors cursor-pointer rounded-lg hover:bg-white/10"
                  aria-label="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Modernized Composer Form: [ 📎 ] [ GIF ] [ 😊 ] [ Type your message... ] [ Send ] */}
            <form onSubmit={handleSend} className="flex items-center gap-2 relative">
              {/* Attachment Button: 44px Hit Target (Fitts's Law) */}
              <button
                type="button"
                onClick={triggerAttachment}
                className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  attachedImage
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                }`}
                aria-label="Attach file"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Dedicated Native Device GIF Button: 44px Hit Target */}
              <button
                type="button"
                onClick={triggerGifPicker}
                className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 font-bold text-xs font-sans tracking-wide ${
                  pendingGif
                    ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300 shadow-sm shadow-indigo-600/30'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                }`}
                aria-label="Upload GIF"
                title="Upload GIF"
              >
                GIF
              </button>

              {/* Emoji Button & Compact Dark Glass Popover: 44px Hit Target */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                    isEmojiPickerOpen
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                  }`}
                  aria-label="Add emoji"
                  title="Add emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {isEmojiPickerOpen && (
                  <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-auto sm:absolute sm:bottom-14 sm:left-0 z-50 animate-slide-up">
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

              {/* Message Input: 44px Hit Target */}
              <input
                ref={messageInputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={
                  replyingTo
                    ? `Reply to ${replyingTo.senderName}...`
                    : 'Type your message...'
                }
                className="flex-1 min-h-[44px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                aria-label="Message text"
              />

              {/* Send Button: 44px Hit Target */}
              <button
                type="submit"
                disabled={!messageInput.trim() && !attachedImage && !pendingGif}
                className="min-w-[44px] min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95 shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
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
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 italic">
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
                    className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar src={conv.participantAvatar} name={conv.participantName} size="xs" />
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
                  toast.warning(`${activeConv?.participantName} has been blocked.`);
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
                className="w-full bg-[#12121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                  toast.success('Trust & Safety report submitted with encrypted transcript.');
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

      {/* Full-Screen Media Viewer Modal for GIFs and Images */}
      {viewingMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setViewingMedia(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
        >
          {/* Top Action Bar */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-xs font-mono font-bold uppercase">
                {viewingMedia.type}
              </span>
              {viewingMedia.fileName && (
                <span className="text-xs font-mono text-zinc-300 max-w-[200px] sm:max-w-md truncate">
                  {viewingMedia.fileName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={viewingMedia.url}
                download={viewingMedia.fileName || 'media.gif'}
                className="min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Download media"
                title="Download"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setViewingMedia(null)}
                className="min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close viewer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Media Display */}
          <div
            className="max-w-4xl max-h-[85vh] flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={viewingMedia.url}
              alt={viewingMedia.fileName || 'Expanded media preview'}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
};
