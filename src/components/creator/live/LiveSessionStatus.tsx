import React from 'react';
import { Sparkles, Shield, Clock, RefreshCw } from 'lucide-react';
import { LiveConnectionState } from '../../../types';

export type CameraStatus = 'idle' | 'requesting' | 'ready' | 'error';
export type TransportStatus = 'unconfigured' | 'connecting' | 'live' | 'error' | 'idle';

interface LiveSessionStatusProps {
  connectionState: LiveConnectionState;
  cameraStatus?: CameraStatus;
  transportStatus?: TransportStatus;
  transportError?: string | null;
  onRetryTransport?: () => void;
  isProviderConfigured: boolean;
  remainingSeconds: number;
  maxDurationSeconds: number;
  isRecording: boolean;
  recordingSeconds: number;
}

export const LiveSessionStatus: React.FC<LiveSessionStatusProps> = ({
  connectionState,
  cameraStatus = 'ready',
  transportStatus,
  transportError,
  onRetryTransport,
  isProviderConfigured,
  remainingSeconds,
  maxDurationSeconds,
  isRecording,
  recordingSeconds,
}) => {
  const effectiveTransport: TransportStatus =
    transportStatus ||
    (connectionState === 'live'
      ? 'live'
      : connectionState === 'connecting'
      ? 'connecting'
      : connectionState === 'error'
      ? 'error'
      : !isProviderConfigured
      ? 'unconfigured'
      : 'idle');

  const isLive = effectiveTransport === 'live';
  const progressPct = isLive
    ? Math.max(0, Math.min(100, (remainingSeconds / maxDurationSeconds) * 100))
    : 100;

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-2xl surface-2 border border-zinc-200/80">
      {/* 1. Camera Subsystem Status */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          cameraStatus === 'ready'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : cameraStatus === 'requesting'
            ? 'bg-amber-50 text-amber-800 border border-amber-300 animate-pulse'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            cameraStatus === 'ready'
              ? 'bg-emerald-500'
              : cameraStatus === 'requesting'
              ? 'bg-amber-400'
              : 'bg-rose-500'
          }`}
        />
        <span>{cameraStatus === 'ready' ? 'Camera Ready' : cameraStatus === 'requesting' ? 'Requesting Cam' : 'Camera Error'}</span>
      </div>

      {/* 2. Live Transport Subsystem Status (LiveKit / Decart Truthful) */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          effectiveTransport === 'live'
            ? 'bg-rose-50 text-rose-800 border border-rose-200 animate-pulse'
            : effectiveTransport === 'connecting'
            ? 'bg-amber-50 text-amber-800 border border-amber-500/35'
            : effectiveTransport === 'error'
            ? 'bg-rose-50 text-rose-800 border border-rose-300'
            : effectiveTransport === 'unconfigured'
            ? 'bg-amber-50 text-amber-900 border border-amber-200 font-mono text-[10px]'
            : 'bg-white text-zinc-700 border border-zinc-200'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            effectiveTransport === 'live'
              ? 'bg-rose-500'
              : effectiveTransport === 'connecting'
              ? 'bg-amber-400 animate-ping'
              : effectiveTransport === 'error'
              ? 'bg-rose-600'
              : effectiveTransport === 'unconfigured'
              ? 'bg-amber-500'
              : 'bg-emerald-400'
          }`}
        />
        <span>
          {effectiveTransport === 'live'
            ? 'LIVE'
            : effectiveTransport === 'connecting'
            ? 'Connecting...'
            : effectiveTransport === 'error'
            ? 'Live service unavailable'
            : effectiveTransport === 'unconfigured'
            ? 'BLOCKED — LiveKit configuration required'
            : 'Transport Ready'}
        </span>

        {/* Retry Button on Transport Failure */}
        {effectiveTransport === 'error' && onRetryTransport && (
          <button
            type="button"
            onClick={onRetryTransport}
            className="ml-1 px-1.5 py-0.5 rounded bg-rose-200/80 hover:bg-rose-300 text-rose-900 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            title={transportError || 'Retry connection'}
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Retry</span>
          </button>
        )}
      </div>

      {/* 3. Recording Subsystem Status */}
      {isRecording && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-mono">REC {recordingSeconds}s</span>
        </div>
      )}

      {/* 4. AR Filter & Landmark Indicator */}
      <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono text-zinc-600 bg-white border border-zinc-200">
        <Sparkles className="w-3 h-3 text-[#007E93]" />
        <span>AR Active</span>
      </div>

      {/* 5. Cost Protection Timer */}
      {isLive && (
        <div className="flex items-center gap-2 pl-1">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span
            className={`font-mono text-xs font-semibold ${
              remainingSeconds <= 10 ? 'text-amber-800' : 'text-zinc-800'
            }`}
          >
            {remainingSeconds}s
          </span>
          <div className="w-12 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
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
        className="p-1 text-zinc-400 hover:text-zinc-800 cursor-help"
        title="Cost protection active: Pauses automatically after session limit."
      >
        <Shield className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
