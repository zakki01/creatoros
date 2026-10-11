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
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md">
      {/* Left: Status Badges */}
      <div className="flex items-center gap-2.5">
        {/* Live Transformation Status */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isLive
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
              : connectionState === 'connecting'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLive
                ? 'bg-rose-500'
                : connectionState === 'connecting'
                ? 'bg-amber-400 animate-ping'
                : 'bg-zinc-500'
            }`}
          />
          <span>
            {isLive
              ? 'LIVE TRANSFORMATION'
              : connectionState === 'connecting'
              ? 'CONNECTING DECART...'
              : 'CAMERA READY'}
          </span>
        </div>

        {/* Recording Badge */}
        {isRecording && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600/20 text-red-300 border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono">REC {recordingSeconds}s</span>
          </div>
        )}

        {/* Engine Tier Badge */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-zinc-800/50">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>
            {isProviderConfigured ? 'Decart Mirage (Realtime)' : 'Decart Engine (Preview Mode)'}
          </span>
        </div>
      </div>

      {/* Right: Cost Protection Timer */}
      <div className="flex items-center gap-3">
        {isLive && (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-400">Limit:</span>
              <span
                className={`font-mono text-xs font-semibold ${
                  remainingSeconds <= 10 ? 'text-amber-400 font-bold' : 'text-zinc-200'
                }`}
              >
                {remainingSeconds}s
              </span>
            </div>
            {/* Visual countdown bar */}
            <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  remainingSeconds <= 10 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div
          className="flex items-center gap-1 text-[11px] text-zinc-500 cursor-help"
          title="Automatic cost protection: Live transformation pauses after session limit to preserve API credits."
        >
          <Shield className="w-3 h-3 text-zinc-400" />
          <span className="hidden md:inline">Cost Protection Active</span>
        </div>
      </div>
    </div>
  );
};
