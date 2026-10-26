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
  WifiOff,
  Coins,
} from 'lucide-react';
import {
  LiveStreamingService,
  LiveRoomState,
} from '../../../services/live/liveStreamingService';
import { GiftTrayModal } from '../../common/GiftTrayModal';
import { Button } from '../../ui/Button';

interface LiveAudienceModerationPanelProps {
  isHost?: boolean;
  currentUserId?: string;
  currentUserName?: string;
}

export const LiveAudienceModerationPanel: React.FC<LiveAudienceModerationPanelProps> = ({
  isHost = true,
  currentUserId = 'cr-101',
  currentUserName = 'Rohan Sharma',
}) => {
  const [roomState, setRoomState] = useState<LiveRoomState>(() =>
    LiveStreamingService.getState()
  );
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
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

  return (
    <div className="w-full h-full flex flex-col bg-white/80 backdrop-blur-xl border border-zinc-200/80 rounded-3xl overflow-hidden shadow-lg select-none">
      {/* Top Header & Telemetry */}
      <div className="p-3.5 border-b border-zinc-200/80 flex items-center justify-between bg-zinc-50/60">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat ({roomState.messages.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('participants')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'participants'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Viewers ({roomState.viewerCount})</span>
          </button>
        </div>

        {/* Network & Live Status */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <Wifi className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stable HD</span>
          </div>
          <button
            type="button"
            onClick={() => setIsGiftTrayOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span>Send Gift</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
        {activeTab === 'chat' ? (
          <>
            {roomState.messages.map((msg) => {
              const isGift = msg.type === 'gift';
              const isModeration = msg.type === 'moderation';
              const isSystem = msg.type === 'system';

              if (isGift) {
                return (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-transparent border border-amber-500/20 flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{msg.giftIcon || '🎁'}</span>
                      <div>
                        <span className="font-bold text-zinc-900">{msg.senderName}</span>
                        <span className="text-zinc-600"> sent a {msg.giftName || 'Gift'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400">{msg.timestamp}</span>
                  </div>
                );
              }

              if (isModeration || isSystem) {
                return (
                  <div
                    key={msg.id}
                    className="py-1 px-2.5 rounded-lg bg-zinc-100 border border-zinc-200/60 text-[11px] text-zinc-600 flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
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
                    <span className="font-semibold text-zinc-800 text-[11px]">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-zinc-400">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-2xl max-w-[85%] ${
                      isMe
                        ? 'bg-[#00869B] text-white rounded-tr-sm'
                        : 'bg-zinc-100 text-zinc-900 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </>
        ) : (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Audience &amp; Guests
            </div>
            {roomState.participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/70"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {p.role === 'moderator' && (
                        <span className="px-1.5 py-0.2 rounded-md bg-cyan-100 text-[#00869B] text-[10px] font-semibold">
                          Mod
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400">Joined {p.joinedAt}</div>
                  </div>
                </div>

                {isHost && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => LiveStreamingService.muteParticipant(p.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        p.isMuted
                          ? 'bg-rose-100 text-rose-600'
                          : 'hover:bg-zinc-200/80 text-zinc-600'
                      }`}
                      title={p.isMuted ? 'Unmute participant' : 'Mute participant'}
                    >
                      {p.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => LiveStreamingService.kickParticipant(p.id)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Kick from live room"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => LiveStreamingService.banParticipant(p.id)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Ban from stream"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Composer */}
      {activeTab === 'chat' && (
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-zinc-200/80 bg-zinc-50/70 flex items-center gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a friendly message..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#00869B] shadow-inner"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="p-2 rounded-xl bg-[#00869B] text-white hover:bg-[#006C80] disabled:opacity-40 transition-colors cursor-pointer"
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
