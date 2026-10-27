import React from 'react';
import { Sparkles, Clock, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import {
  CameraState,
  ARState,
  RecordingState,
  TransportState,
  HonestNetworkStatus,
} from '../../../types';

export type CameraStatus = 'idle' | 'requesting' | 'ready' | 'error';
export type TransportStatus = 'unconfigured' | 'connecting' | 'live' | 'error' | 'idle';
export type ARStatus = 'unavailable' | 'initializing' | 'ready' | 'error';

interface LiveSessionStatusProps {
  cameraState: CameraState;
  arState: ARState;
  recordingState: RecordingState;
  transportState: TransportState;
  networkStatus: HonestNetworkStatus;
  viewerCount: number;
  faceDetected: boolean;
  faceConfidence: number;
  remainingSeconds: number;
  maxDurationSeconds: number;
  recordingSeconds: number;
  transportError?: string | null;
  onRetryTransport?: () => void;
  // Backward compatibility props
  cameraStatus?: any;
  transportStatus?: any;
  arStatus?: any;
  connectionState?: any;
  isProviderConfigured?: boolean;
  isRecording?: boolean;
}

export const LiveSessionStatus: React.FC<LiveSessionStatusProps> = ({
  cameraState,
  arState,
  recordingState,
  transportState,
  networkStatus,
  viewerCount = 0,
  faceDetected = false,
  faceConfidence = 0,
  remainingSeconds,
  maxDurationSeconds,
  recordingSeconds,
  transportError,
  onRetryTransport,
  // Backward compatibility fallbacks
  cameraStatus,
  transportStatus,
  arStatus,
  isRecording,
}) => {
  // Normalize states
  const effectiveCamera: CameraState =
    cameraState ||
    (cameraStatus === 'ready'
      ? 'camera_ready'
      : cameraStatus === 'requesting'
      ? 'camera_requesting'
      : cameraStatus === 'idle'
      ? 'camera_idle'
      : 'camera_error');

  const effectiveTransport: TransportState =
    transportState ||
    (transportStatus === 'live'
      ? 'transport_live'
      : transportStatus === 'connecting'
      ? 'transport_connecting'
      : transportStatus === 'error'
      ? 'transport_error'
      : 'transport_unconfigured');

  const isLive = effectiveTransport === 'transport_live';
  const effectiveRecording = isRecording || recordingState === 'recording';

  const progressPct = isLive
    ? Math.max(0, Math.min(100, (remainingSeconds / maxDurationSeconds) * 100))
    : 100;

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
      {/* 1. Camera Status */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          effectiveCamera === 'camera_ready'
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
            : effectiveCamera === 'camera_requesting'
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse'
            : effectiveCamera === 'camera_idle'
            ? 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]'
            : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/25'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            effectiveCamera === 'camera_ready'
              ? 'bg-emerald-500'
              : effectiveCamera === 'camera_requesting'
              ? 'bg-amber-400 animate-ping'
              : effectiveCamera === 'camera_idle'
              ? 'bg-zinc-400'
              : 'bg-rose-500'
          }`}
        />
        <span>
          {effectiveCamera === 'camera_ready'
            ? 'Camera Ready'
            : effectiveCamera === 'camera_requesting'
            ? 'Requesting Cam...'
            : effectiveCamera === 'camera_idle'
            ? 'Standby — Offline'
            : 'Camera Error'}
        </span>
      </div>

      {/* 2. Media Transport Status (PREVIEW -> CONNECTING -> LIVE / LIVE TRANSPORT UNAVAILABLE) */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          isLive
            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse'
            : effectiveTransport === 'transport_connecting'
            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/35'
            : effectiveTransport === 'transport_error'
            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
            : effectiveCamera === 'camera_ready'
            ? 'bg-sky-500/10 text-[#007E93] dark:text-[#00B4D8] border border-sky-500/25'
            : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isLive
              ? 'bg-rose-500'
              : effectiveTransport === 'transport_connecting'
              ? 'bg-amber-400 animate-ping'
              : effectiveTransport === 'transport_error'
              ? 'bg-rose-600'
              : effectiveCamera === 'camera_ready'
              ? 'bg-[#007E93]'
              : 'bg-amber-500'
          }`}
        />
        <span>
          {isLive
            ? 'LIVE'
            : effectiveTransport === 'transport_connecting'
            ? 'CONNECTING'
            : effectiveTransport === 'transport_error'
            ? 'LIVE TRANSPORT UNAVAILABLE'
            : effectiveCamera === 'camera_ready'
            ? 'PREVIEW'
            : 'LIVE TRANSPORT UNAVAILABLE'}
        </span>

        {effectiveTransport === 'transport_error' && onRetryTransport && (
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

      {/* 3. MediaPipe Face Landmark Tracking Engine Status */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          faceDetected
            ? 'bg-sky-500/10 text-[#007E93] dark:text-[#00B4D8] border border-sky-500/25'
            : arState === 'ar_ready'
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
            : arState === 'ar_initializing'
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 animate-pulse'
            : 'bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]'
        }`}
      >
        <Sparkles className="w-3 h-3 text-[#007E93] dark:text-[#00B4D8]" />
        <span>
          {faceDetected
            ? `Face Detected (${Math.round(faceConfidence * 100)}%)`
            : arState === 'ar_ready' || arStatus === 'ready'
            ? 'AR Ready'
            : arState === 'ar_initializing'
            ? 'AR Initializing...'
            : 'AR Unavailable'}
        </span>
      </div>

      {/* 4. Real Participant Count (0 when not live, real participants when live) */}
      {isLive && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
          <span>{viewerCount} Viewers</span>
        </div>
      )}

      {/* 5. Honest Network Status */}
      {isLive && (
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            networkStatus === 'Live'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
              : networkStatus === 'Poor connection'
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25'
              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/25'
          }`}
        >
          {networkStatus === 'Disconnected' ? (
            <WifiOff className="w-3 h-3" />
          ) : (
            <Wifi className="w-3 h-3" />
          )}
          <span>{networkStatus}</span>
        </div>
      )}

      {/* 6. Active Recording Indicator */}
      {effectiveRecording && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-[11px] font-mono font-bold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span>
            REC {Math.floor(recordingSeconds / 60)}:
            {(recordingSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}

      {/* 7. Cost Protection Duration Timer (Active when Live) */}
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
