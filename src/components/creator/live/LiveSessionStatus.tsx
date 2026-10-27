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
    <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-2xl surface-2 border border-[var(--border)]">
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
            : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]'
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
            className="ml-1 px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900/60 hover:bg-rose-300 text-rose-900 dark:text-rose-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            title={transportError || 'Retry connection'}
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Retry</span>
          </button>
        )}
      </div>

      {/* 3. AR Face Tracking Subsystem Status */}
      <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]">
        {faceDetected ? (
          <>
            <Eye className="w-3 h-3 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              Face Detected ({Math.round(faceConfidence * 100)}%)
            </span>
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3 text-[#007E93]" />
            <span>AR Ready</span>
          </>
        )}
      </div>

      {/* 4. Recording Subsystem Status */}
      {isRecording && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-mono">REC {recordingSeconds}s</span>
        </div>
      )}

      {/* 5. Cost Protection Timer */}
      {isLive && (
        <div className="flex items-center gap-2 pl-1">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span
            className={`font-mono text-xs font-semibold ${
              remainingSeconds <= 10 ? 'text-amber-800 dark:text-amber-300' : 'text-[var(--text-primary)]'
            }`}
          >
            {remainingSeconds}s
          </span>
          <div className="w-12 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
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
        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-help"
        title="Cost protection active: Pauses automatically after session limit."
      >
        <Shield className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
