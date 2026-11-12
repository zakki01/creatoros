import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Link2,
  Copy,
  Check,
  Sparkles,
  Radio,
  Mic,
  MicOff,
  X,
  Share2,
  LayoutGrid,
  Columns,
  SquareSplitVertical,
} from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Avatar } from '../../ui/Avatar';
import { useToast } from '../../ui/Toast';

export interface CoHostGuest {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  isMuted: boolean;
  videoStreamUrl?: string;
  connectedAt: string;
}

export const VERIFIED_COHOST_CANDIDATES: CoHostGuest[] = [
  {
    id: 'guest-sophia',
    name: 'Sophia Chen',
    handle: '@sophiastyle',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Lifestyle & Streetwear Creator',
    isMuted: false,
    videoStreamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-her-phone-42407-large.mp4',
    connectedAt: new Date().toISOString(),
  },
  {
    id: 'guest-elena',
    name: 'Elena Rostova',
    handle: '@elenamakeup',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Beauty & Aesthetics Creator',
    isMuted: false,
    videoStreamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-talking-to-camera-on-video-call-42866-large.mp4',
    connectedAt: new Date().toISOString(),
  },
  {
    id: 'guest-marcus',
    name: 'Marcus Sterling',
    handle: '@marcuscreative',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Tech & High-FPS Gaming',
    isMuted: false,
    videoStreamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-talking-on-a-video-call-on-laptop-42996-large.mp4',
    connectedAt: new Date().toISOString(),
  },
  {
    id: 'guest-kai',
    name: 'Kai Takahashi',
    handle: '@kaistudio',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Music Producer & DJ',
    isMuted: false,
    videoStreamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-playing-acoustic-guitar-at-home-43758-large.mp4',
    connectedAt: new Date().toISOString(),
  },
];

export const LIVE_CHAT_VIEWERS: CoHostGuest[] = [
  {
    id: 'viewer-alex',
    name: 'Alex Rivera',
    handle: '@alexrivera',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    role: 'VIP Subscriber',
    isMuted: false,
    connectedAt: new Date().toISOString(),
  },
  {
    id: 'viewer-priya',
    name: 'Priya Sharma',
    handle: '@priyacreates',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Top Fan (Gift Badge)',
    isMuted: false,
    connectedAt: new Date().toISOString(),
  },
  {
    id: 'viewer-liam',
    name: 'Liam Vance',
    handle: '@liamvance',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'Community Moderator',
    isMuted: false,
    connectedAt: new Date().toISOString(),
  },
];

interface LiveCoHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoHost: CoHostGuest | null;
  onConnectCoHost: (guest: CoHostGuest) => void;
  onDisconnectCoHost: () => void;
  splitLayout: 'side-by-side' | 'top-bottom' | 'pip';
  onChangeSplitLayout: (layout: 'side-by-side' | 'top-bottom' | 'pip') => void;
}

export const LiveCoHostModal: React.FC<LiveCoHostModalProps> = ({
  isOpen,
  onClose,
  currentCoHost,
  onConnectCoHost,
  onDisconnectCoHost,
  splitLayout,
  onChangeSplitLayout,
}) => {
  const [activeTab, setActiveTab] = useState<'creators' | 'chat' | 'invite'>('creators');
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const inviteLink = 'https://creatoros.live/join/collab-room-studio-01';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(inviteLink);
    setCopied(true);
    toast.success('Co-Host join link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Split-Screen & Co-Host Collab"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Active Co-Host Status Banner if Connected */}
        {currentCoHost ? (
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar src={currentCoHost.avatar} name={currentCoHost.name} size="md" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[var(--text-primary)] truncate">
                    {currentCoHost.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-600 text-white animate-pulse">
                    LIVE TOGETHER
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate">{currentCoHost.role}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnectCoHost}
              className="border-rose-500/40 text-rose-500 hover:bg-rose-500/10 cursor-pointer shrink-0"
              leftIcon={<UserX className="w-3.5 h-3.5" />}
            >
              End Collab
            </Button>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-secondary)]">
            Invite another creator or viewer to join your stream in a dual split-screen broadcast.
          </p>
        )}

        {/* Split Screen Layout Selector */}
        <div className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
          <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
              <span>Split-Screen Layout</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
              {splitLayout.replace('-', ' ')}
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'side-by-side', label: '50/50 Side-by-Side', icon: Columns },
              { id: 'top-bottom', label: 'Top / Bottom', icon: SquareSplitVertical },
              { id: 'pip', label: 'Picture-in-Picture', icon: LayoutGrid },
            ].map((layout) => {
              const Icon = layout.icon;
              const isSelected = splitLayout === layout.id;
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => onChangeSplitLayout(layout.id as any)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500 text-[var(--text-primary)] font-semibold shadow-xs'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span className="text-[11px] leading-tight font-medium">{layout.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setActiveTab('creators')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'creators'
                ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Verified Creators
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Live Chat Viewers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invite')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'invite'
                ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Guest Link
          </button>
        </div>

        {/* Tab 1: Verified Creators */}
        {activeTab === 'creators' && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {VERIFIED_COHOST_CANDIDATES.map((creator) => {
              const isCurrent = currentCoHost?.id === creator.id;
              return (
                <div
                  key={creator.id}
                  className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between gap-3 hover:border-sky-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={creator.avatar} name={creator.name} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[var(--text-primary)] truncate">
                          {creator.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {creator.handle}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">
                        {creator.role}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isCurrent ? 'secondary' : 'primary'}
                    disabled={isCurrent}
                    onClick={() => onConnectCoHost(creator)}
                    className="shrink-0 cursor-pointer text-xs"
                    leftIcon={isCurrent ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  >
                    {isCurrent ? 'Connected' : 'Connect Co-Host'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Live Chat Viewers */}
        {activeTab === 'chat' && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {LIVE_CHAT_VIEWERS.map((viewer) => {
              const isCurrent = currentCoHost?.id === viewer.id;
              return (
                <div
                  key={viewer.id}
                  className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between gap-3 hover:border-sky-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={viewer.avatar} name={viewer.name} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[var(--text-primary)] truncate">
                          {viewer.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                          {viewer.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono">
                        {viewer.handle}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isCurrent ? 'secondary' : 'primary'}
                    disabled={isCurrent}
                    onClick={() => onConnectCoHost(viewer)}
                    className="shrink-0 cursor-pointer text-xs"
                    leftIcon={isCurrent ? <Check className="w-3.5 h-3.5" /> : <Radio className="w-3.5 h-3.5" />}
                  >
                    {isCurrent ? 'In Stream' : 'Bring on Screen'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Guest Join Link */}
        {activeTab === 'invite' && (
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-primary)] block">
                Direct WebRTC Studio Invitation URL
              </span>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Share this secure link with a guest co-host. When they open it, their camera and microphone will instantly sync into your split-screen broadcast.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-xs font-mono text-[var(--text-primary)] select-all focus:outline-none"
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleCopyLink}
                className="shrink-0 cursor-pointer"
                leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
