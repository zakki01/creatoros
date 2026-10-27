import React from 'react';
import { Sparkles, Shield, Clock, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { LiveConnectionState } from '../../../types';

export type CameraStatus = 'idle' | 'requesting' | 'ready' | 'error';
export type TransportStatus = 'unconfigured' | 'connecting' | 'live' | 'error' | 'idle';
export type ARStatus = 'unavailable' | 'initializing' | 'ready' | 'error';

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
  arStatus?: ARStatus;
  faceDetected?: boolean;
  faceConfidence?: number;
  selectedProvider?: 'livekit' | 'decart' | 'local';
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
  arStatus = 'ready',
  faceDetected = false,
  faceConfidence = 0,
  selectedProvider = 'local',
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

  const getUnconfiguredText = () => {
    if (selectedProvider === 'livekit') return 'LiveKit is not configured';
    if (selectedProvider === 'decart') return 'Decart is not configured';
    return 'Live transport unavailable';
  };

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
      {/* 1. Camera Subsystem Status */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          cameraStatus === 'ready'
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
            : cameraStatus === 'requesting'
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse'
            : cameraStatus === 'idle'
            ? 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]'
            : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/25'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            cameraStatus === 'ready'
              ? 'bg-emerald-500'
              : cameraStatus === 'requesting'
              ? 'bg-amber-400 animate-ping'
              : cameraStatus === 'idle'
              ? 'bg-zinc-400'
              : 'bg-rose-500'
          }`}
        />
        <span>
          {cameraStatus === 'ready'
            ? 'Camera Ready'
            : cameraStatus === 'requesting'
            ? 'Requesting Cam'
            : cameraStatus === 'idle'
            ? 'Camera Standby'
            : 'Camera Error'}
        </span>
      </div>

      {/* 2. Live Transport Subsystem Status (Truthful LiveKit / Decart / Local Preview) */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          effectiveTransport === 'live'
            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse'
            : effectiveTransport === 'connecting'
            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/35'
            : effectiveTransport === 'error'
            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
            : effectiveTransport === 'unconfigured'
            ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-mono text-[10px]'
            : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]'
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
            ? getUnconfiguredText()
            : 'Transport Ready'}
        </span>

        {/* Retry Button on Transport Failure */}
        {effectiveTransport === 'error' && onRetryTransport && (
          <button
            type="button"
            onClick={onRetryTransport}
            className="ml-1 px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900/60 hover:bg-rose-300 text-rose-900 dark:text-rose-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            title={transportError || 'Retry connection'}
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Retry</span>
          </button>
        )}
      </div>

      {/* 3. AR Face Landmark Tracking Engine Status */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          faceDetected
            ? 'bg-sky-500/10 text-[#007E93] dark:text-[#00B4D8] border border-sky-500/25'
            : arStatus === 'ready'
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
            : arStatus === 'initializing'
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 animate-pulse'
            : 'bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]'
        }`}
      >
        <Sparkles className="w-3 h-3 text-[#007E93] dark:text-[#00B4D8]" />
        <span>
          {faceDetected
            ? `Face Detected (${Math.round(faceConfidence * 100)}%)`
            : arStatus === 'ready'
            ? 'AR Ready'
            : arStatus === 'initializing'
            ? 'AR Initializing'
            : 'AR Unavailable'}
        </span>
      </div>

      {/* 4. Active Recording Indicator */}
      {isRecording && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-[11px] font-mono font-bold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span>
            REC {Math.floor(recordingSeconds / 60)}:
            {(recordingSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}

      {/* 5. Cost Protection Duration Timer (Active when Live) */}
      {isLive && (
        <div className="flex items-center gap-2 pl-1 border-l border-[var(--border)]">
          <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-secondary)]">
            <Clock className="w-3 h-3 text-[#007E93]" />
            <span
              className={
                remainingSeconds < 300
                  ? 'text-rose-700 dark:text-rose-400 font-bold animate-pulse'
                  : ''
              }
            >
              {Math.floor(remainingSeconds / 60)}:
              {(remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div
            className="w-16 h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden"
            title={`Cost protection: ${remainingSeconds}s remaining`}
          >
            <div
              className={`h-full transition-all duration-1000 ${
                progressPct < 20
                  ? 'bg-rose-500'
                  : progressPct < 40
                  ? 'bg-amber-500'
                  : 'bg-[#007E93]'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
