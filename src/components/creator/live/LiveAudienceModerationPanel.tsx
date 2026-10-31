import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  MessageSquare,
  Gift,
  Mic,
  MicOff,
  UserX,
  ShieldAlert,
  Send,
  Sparkles,
  Wifi,
  Coins,
  ShieldCheck,
  Ban,
} from 'lucide-react';
import {
  LiveStreamingService,
  LiveRoomState,
} from '../../../services/live/liveStreamingService';
import { GiftTrayModal } from '../../common/GiftTrayModal';

interface LiveAudienceModerationPanelProps {
  isHost?: boolean;
  currentUserId?: string;
  currentUserName?: string;
  className?: string;
}

export const LiveAudienceModerationPanel: React.FC<LiveAudienceModerationPanelProps> = ({
  isHost = true,
  currentUserId = 'cr-101',
  currentUserName = 'Rohan Sharma',
  className = '',
}) => {
  const [roomState, setRoomState] = useState<LiveRoomState>(() =>
    LiveStreamingService.getState()
  );
  const [activeTab, setActiveTab] = useState<'chat' | 'participants' | 'moderation' | 'gifts'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [isGiftTrayOpen, setIsGiftTrayOpen] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = LiveStreamingService.subscribe((state) => {
      setRoomState(state);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [roomState.messages, activeTab]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    LiveStreamingService.sendMessage(currentUserId, currentUserName, chatInput.trim(), 'chat');
    setChatInput('');
  };

  const isLive = roomState.connectionState === 'live';
  const effectiveViewerCount = isLive ? roomState.viewerCount : 0;
  const giftMessages = roomState.messages.filter((m) => m.type === 'gift');

  return (
    <div className={`w-full h-full flex flex-col bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-lg select-none ${className}`}>
      {/* Top Header & Telemetry */}
      <div className="p-3 border-b border-[var(--border)] flex flex-col gap-2.5 bg-[var(--surface-muted)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat ({roomState.messages.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('participants')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'participants'
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Viewers ({effectiveViewerCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('moderation')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'moderation'
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Moderation Center"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Mod</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gifts')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'gifts'
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Gifts Stream"
            >
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xl:inline">Gifts</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsGiftTrayOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/20 text-xs transition-colors cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send Gift</span>
          </button>
        </div>

        {/* Real Network / Studio Telemetry (Truthful: Local Preview vs Live) */}
        <div className="flex items-center justify-between text-[11px] px-1 text-[var(--text-muted)] font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
            <span>{isLive ? 'Live Stream Active' : 'Local Preview Mode'}</span>
          </div>
          <div>
            {isLive ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                Live Broadcast
              </span>
            ) : (
              <span>Standby — Offline</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Tab Content Rail (Fills 100% of available height) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-0">
        {/* TAB 1: LIVE CHAT */}
        {activeTab === 'chat' && (
          <>
            {roomState.messages.map((msg) => {
              const isGift = msg.type === 'gift';
              const isModeration = msg.type === 'moderation';
              const isSystem = msg.type === 'system';

              if (isGift) {
                return (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-transparent border border-amber-500/25 flex items-center justify-between text-xs animate-in fade-in"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{msg.giftIcon || '🎁'}</span>
                      <div>
                        <span className="font-bold text-[var(--text-primary)]">{msg.senderName}</span>
                        <span className="text-[var(--text-secondary)]"> sent a {msg.giftName || 'Gift'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{msg.timestamp}</span>
                  </div>
                );
              }

              if (isModeration || isSystem) {
                return (
                  <div
                    key={msg.id}
                    className="py-1 px-2.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{msg.content}</span>
                  </div>
                );
              }

              const isMe = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col text-xs ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-[var(--text-primary)] text-[11px]">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-2xl max-w-[85%] break-words ${
                      isMe
                        ? 'bg-[var(--primary)] text-white rounded-tr-xs shadow-xs'
                        : 'bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)] rounded-tl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </>
        )}

        {/* TAB 2: AUDIENCE & VIEWERS */}
        {activeTab === 'participants' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">
              <span>Audience Members ({roomState.participants.length})</span>
              <span>{isLive ? 'Active' : 'Offline'}</span>
            </div>
            {roomState.participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)]"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--border)]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {p.role === 'moderator' && (
                        <span className="px-1.5 py-0.2 rounded-md bg-[var(--primary)]/15 text-[var(--primary)] text-[10px] font-semibold">
                          Mod
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">Joined {p.joinedAt}</div>
                  </div>
                </div>

                {isHost && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => LiveStreamingService.muteParticipant(p.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        p.isMuted
                          ? 'bg-rose-500/20 text-rose-700'
                          : 'hover:bg-[var(--surface)] text-[var(--text-secondary)]'
                      }`}
                      title={p.isMuted ? 'Unmute' : 'Mute'}
                    >
                      {p.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => LiveStreamingService.kickParticipant(p.id)}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Kick"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: MODERATION CENTER */}
        {activeTab === 'moderation' && (
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Live Stream Moderation
            </div>
            <div className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-primary)]">Host Role</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  Active Host
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                You have full moderation rights over audience chat, participant microphones, and stream safety.
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  LiveStreamingService.sendMessage('system', 'System', 'Chat was cleared by the host.', 'moderation');
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Clear Chat History</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  roomState.participants.forEach((p) => {
                    if (!p.isMuted) LiveStreamingService.muteParticipant(p.id);
                  });
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <MicOff className="w-3.5 h-3.5 text-rose-500" />
                <span>Mute All Audience Mics</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: GIFTS & DONATIONS */}
        {activeTab === 'gifts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                Virtual Gifts Log ({giftMessages.length})
              </div>
              <button
                type="button"
                onClick={() => setIsGiftTrayOpen(true)}
                className="text-xs text-[var(--primary)] font-bold hover:underline cursor-pointer"
              >
                Open Tray →
              </button>
            </div>

            {giftMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-2 text-[var(--text-muted)]">
                <Gift className="w-8 h-8 opacity-40" />
                <p className="text-xs">No gifts received yet in this session.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {giftMessages.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{g.giftIcon || '🎁'}</span>
                      <div>
                        <div className="text-xs font-bold text-[var(--text-primary)]">{g.senderName}</div>
                        <div className="text-[11px] text-[var(--text-secondary)]">{g.giftName || 'Gift'}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{g.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Composer (visible on Chat tab) */}
      {activeTab === 'chat' && (
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-[var(--border)] bg-[var(--surface-muted)] flex items-center gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a friendly message..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] shadow-inner"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="p-2 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Gift Modal */}
      <GiftTrayModal
        isOpen={isGiftTrayOpen}
        onClose={() => setIsGiftTrayOpen(false)}
        senderId={currentUserId}
        senderName={currentUserName}
        recipientId={roomState.hostId}
        recipientName={roomState.hostName}
        liveSessionId={roomState.roomId}
        onGiftSent={(g) => {
          LiveStreamingService.sendMessage(
            currentUserId,
            currentUserName,
            `Sent a ${g.name}!`,
            'gift',
            g.icon,
            g.name
          );
        }}
      />
    </div>
  );
};
