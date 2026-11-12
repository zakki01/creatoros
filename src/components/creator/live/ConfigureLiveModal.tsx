import React, { useState } from 'react';
import {
  X,
  Radio,
  Video,
  Mic,
  Copy,
  Check,
  Sparkles,
  Server,
  Globe,
  ShieldCheck,
  Settings,
  ChevronRight,
  Tv,
} from 'lucide-react';

export interface LiveBroadcastConfig {
  title: string;
  category: string;
  mode: 'studio_direct' | 'cloud_rtmp';
  rtmpUrl?: string;
  streamKey?: string;
  enableChat: boolean;
  enableGifts: boolean;
  recordSession: boolean;
}

interface ConfigureLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBroadcast: (config: LiveBroadcastConfig) => void;
  aspectRatio: string;
  hasCamera: boolean;
  isAudioEnabled: boolean;
}

export const ConfigureLiveModal: React.FC<ConfigureLiveModalProps> = ({
  isOpen,
  onClose,
  onStartBroadcast,
  aspectRatio,
  hasCamera,
  isAudioEnabled,
}) => {
  const [title, setTitle] = useState('CreatorOS Studio Live Stream');
  const [category, setCategory] = useState('Community & Q&A');
  const [mode, setMode] = useState<'studio_direct' | 'cloud_rtmp'>('studio_direct');
  const [streamKey] = useState(() => `live_sk_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`);
  const [copiedKey, setCopiedKey] = useState(false);
  const [enableChat, setEnableChat] = useState(true);
  const [enableGifts, setEnableGifts] = useState(true);
  const [recordSession, setRecordSession] = useState(true);

  if (!isOpen) return null;

  const handleCopyStreamKey = () => {
    navigator.clipboard?.writeText(streamKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartBroadcast({
      title: title.trim() || 'CreatorOS Studio Live Stream',
      category,
      mode,
      rtmpUrl: 'rtmp://live.creatoros.ai/app',
      streamKey,
      enableChat,
      enableGifts,
      recordSession,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[var(--surface)] text-[var(--text-primary)] rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">Configure Live Broadcast</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title & Category */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                Broadcast Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q&A and Creative Studio Session"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                Category & Topic
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)] transition-all cursor-pointer"
              >
                <option value="Community & Q&A">Community & Q&A</option>
                <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                <option value="Tech & Coding">Tech & Coding</option>
                <option value="Design & Creative Arts">Design & Creative Arts</option>
                <option value="Gaming & Entertainment">Gaming & Entertainment</option>
                <option value="Music & Performance">Music & Performance</option>
              </select>
            </div>
          </div>

          {/* Broadcast Ingest Mode Switcher */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
              Broadcast Delivery Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('studio_direct')}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  mode === 'studio_direct'
                    ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20'
                    : 'border-[var(--border)] bg-[var(--surface-muted)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 text-emerald-500 font-bold text-xs">
                  <Globe className="w-4 h-4" />
                  <span>Direct Studio Broadcast</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Stream right from your browser. Instant start, zero server keys required, full AR effects & chat.
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                  Recommended · Ready
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('cloud_rtmp')}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  mode === 'cloud_rtmp'
                    ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/20'
                    : 'border-[var(--border)] bg-[var(--surface-muted)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 text-sky-500 font-bold text-xs">
                  <Server className="w-4 h-4" />
                  <span>Cloud RTMP / LiveKit</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Connect via OBS Studio, hardware encoder, or dedicated external LiveKit cloud instance.
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded-md">
                  Pro Streaming
                </span>
              </button>
            </div>
          </div>

          {/* RTMP Credentials if Cloud Mode is selected */}
          {mode === 'cloud_rtmp' && (
            <div className="p-4 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[var(--text-secondary)] uppercase mb-1">
                  Server Ingest URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="rtmp://live.creatoros.ai/app"
                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText('rtmp://live.creatoros.ai/app')}
                    className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] cursor-pointer"
                    title="Copy RTMP URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[var(--text-secondary)] uppercase mb-1">
                  Stream Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value={streamKey}
                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={handleCopyStreamKey}
                    className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] cursor-pointer"
                    title="Copy Stream Key"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Device Pre-flight Status */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Video className={`w-3.5 h-3.5 ${hasCamera ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className="text-[var(--text-secondary)]">{hasCamera ? 'Camera Ready' : 'Virtual / No Cam'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mic className={`w-3.5 h-3.5 ${isAudioEnabled ? 'text-emerald-500' : 'text-zinc-400'}`} />
                <span className="text-[var(--text-secondary)]">{isAudioEnabled ? 'Mic Active' : 'Muted'}</span>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]">
              {aspectRatio}
            </div>
          </div>

          {/* Audience Controls */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <label className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex flex-col items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={enableChat}
                onChange={(e) => setEnableChat(e.target.checked)}
                className="rounded accent-[var(--accent)]"
              />
              <span className="text-[11px] font-medium text-[var(--text-primary)]">Live Chat</span>
            </label>
            <label className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex flex-col items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={enableGifts}
                onChange={(e) => setEnableGifts(e.target.checked)}
                className="rounded accent-[var(--accent)]"
              />
              <span className="text-[11px] font-medium text-[var(--text-primary)]">Virtual Gifts</span>
            </label>
            <label className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex flex-col items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={recordSession}
                onChange={(e) => setRecordSession(e.target.checked)}
                className="rounded accent-[var(--accent)]"
              />
              <span className="text-[11px] font-medium text-[var(--text-primary)]">Auto-Record</span>
            </label>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Start Live Broadcast</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
