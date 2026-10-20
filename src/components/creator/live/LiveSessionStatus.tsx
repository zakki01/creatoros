import React from 'react';
import { Sparkles, Shield, Clock } from 'lucide-react';
import { LiveConnectionState } from '../../../types';

interface LiveSessionStatusProps {
  connectionState: LiveConnectionState;
  isProviderConfigured: boolean;
  remainingSeconds: number;
  maxDurationSeconds: number;
  isRecording: boolean;
  recordingSeconds: number;
}

export const LiveSessionStatus: React.FC<LiveSessionStatusProps> = ({
  connectionState,
  isProviderConfigured,
  remainingSeconds,
  maxDurationSeconds,
  isRecording,
  recordingSeconds,
}) => {
  const isLive = connectionState === 'live';
  const progressPct = isLive
    ? Math.max(0, Math.min(100, (remainingSeconds / maxDurationSeconds) * 100))
    : 100;

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-2xl surface-2">
      {/* Live Transformation Status */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          isLive
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/35 animate-pulse'
            : connectionState === 'connecting'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35'
            : 'bg-white/[0.05] text-zinc-300 border border-white/10'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isLive
              ? 'bg-rose-500'
              : connectionState === 'connecting'
              ? 'bg-amber-400 animate-ping'
              : 'bg-emerald-400'
          }`}
        />
        <span>
          {isLive
            ? 'Live AI'
            : connectionState === 'connecting'
            ? 'Connecting'
            : 'Ready'}
        </span>
      </div>

      {/* Recording Badge */}
      {isRecording && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-600/20 text-rose-300 border border-rose-500/35">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-mono">REC {recordingSeconds}s</span>
        </div>
      )}

      {/* Engine Tier Badge */}
      <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.06]">
        <Sparkles className="w-3 h-3 text-indigo-400" />
        <span>{isProviderConfigured ? 'Cloud' : 'Preview'}</span>
      </div>

      {/* Cost Protection Timer */}
      {isLive && (
        <div className="flex items-center gap-2 pl-1">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span
            className={`font-mono text-xs font-semibold ${
              remainingSeconds <= 10 ? 'text-amber-400' : 'text-zinc-200'
            }`}
          >
            {remainingSeconds}s
          </span>
          <div className="w-12 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                remainingSeconds <= 10 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      <div
        className="p-1 text-zinc-400 hover:text-zinc-200 cursor-help"
        title="Cost protection active: Pauses automatically after session limit."
      >
        <Shield className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
