import React from 'react';
import { Sparkles, Square, Circle, Mic, MicOff, RefreshCw, Settings2, Wand2, Camera } from 'lucide-react';
import { AspectRatio, LiveConnectionState } from '../../../types';
import { TransportStatus } from './LiveSessionStatus';

interface LiveControlsProps {
  connectionState: LiveConnectionState;
  transportStatus?: TransportStatus;
  hasCamera: boolean;
  isRecording: boolean;
  recordingSeconds: number;
  aspectRatio: AspectRatio;
  isAudioEnabled: boolean;
  onToggleLive: () => void;
  onToggleRecording: () => void;
  onSelectAspectRatio: (aspect: AspectRatio) => void;
  onToggleAudio: () => void;
  onRetryTransport?: () => void;
  onToggleDrawer?: () => void;
  isDrawerOpen?: boolean;
  onToggleCamera?: () => void;
}

export const LiveControls: React.FC<LiveControlsProps> = ({
  connectionState,
  transportStatus,
  hasCamera,
  isRecording,
  recordingSeconds,
  aspectRatio,
  isAudioEnabled,
  onToggleLive,
  onToggleRecording,
  onSelectAspectRatio,
  onToggleAudio,
  onRetryTransport,
  onToggleDrawer,
  isDrawerOpen = false,
  onToggleCamera,
}) => {
  const isLive = transportStatus === 'live' || connectionState === 'live';
  const isConnecting = transportStatus === 'connecting' || connectionState === 'connecting';
  const isError = transportStatus === 'error' || connectionState === 'error';
  const isUnconfigured = transportStatus === 'unconfigured';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm max-w-3xl w-full">
      {/* 1. Aspect Ratio Selector */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
        {(['9:16', '16:9', '1:1'] as AspectRatio[]).map((aspect) => (
          <button
            key={aspect}
            type="button"
            onClick={() => onSelectAspectRatio(aspect)}
            disabled={isLive || isRecording}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              aspectRatio === aspect
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
            } ${isLive || isRecording ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            {aspect}
          </button>
        ))}
      </div>

      {/* 2. Media Hardware & Tools Toggles (Camera, Mic, AR Drawer) */}
      <div className="flex items-center gap-2">
        {/* Camera Toggle */}
        {onToggleCamera && (
          <button
            type="button"
            onClick={onToggleCamera}
            aria-label={hasCamera ? 'Disable Camera' : 'Enable Camera'}
            title={hasCamera ? 'Camera Active' : 'Enable Camera'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              hasCamera
                ? 'bg-[var(--surface-muted)] hover:bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)]'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-500'
            }`}
          >
            <Camera className="w-4 h-4" />
          </button>
        )}

        {/* Mic Toggle */}
        <button
          type="button"
          aria-label="Toggle Microphone"
          onClick={onToggleAudio}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isAudioEnabled
              ? 'bg-[var(--surface-muted)] hover:bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)]'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-500'
          }`}
          title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isAudioEnabled ? (
            <Mic className="w-4 h-4" />
          ) : (
            <MicOff className="w-4 h-4" />
          )}
        </button>

        {/* AR Effects Drawer Toggle */}
        {onToggleDrawer && (
          <button
            type="button"
            onClick={onToggleDrawer}
            aria-label="Toggle AR Effects Drawer"
            title="AR Effects & Scenes"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
              isDrawerOpen
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                : 'bg-[var(--surface-muted)] hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border)]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Effects</span>
          </button>
        )}
      </div>

      {/* 3. Primary Broadcasting / Recording Actions */}
      <div className="flex items-center gap-2">
        {/* Record Clip Button */}
        <button
          type="button"
          onClick={onToggleRecording}
          disabled={!hasCamera}
          className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_-4px_rgba(244,63,94,0.6)] animate-pulse'
              : 'bg-[var(--surface-muted)] hover:bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)]'
          } ${!hasCamera ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isRecording ? (
            <>
              <Square className="w-3.5 h-3.5 fill-white" />
              <span className="font-mono">Stop ({recordingSeconds}s)</span>
            </>
          ) : (
            <>
              <Circle className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Record</span>
            </>
          )}
        </button>

        {/* Go Live / Retry / Configure Live Button */}
        {isError && onRetryTransport ? (
          <button
            type="button"
            onClick={onRetryTransport}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        ) : isUnconfigured ? (
          <button
            type="button"
            onClick={onToggleLive}
            disabled={!hasCamera || isConnecting}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold depth-btn-primary text-white transition-all cursor-pointer ${
              !hasCamera ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Configure Live transport or preview locally"
          >
            <Settings2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Configure Live</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggleLive}
            disabled={!hasCamera || isConnecting}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isLive
                ? 'depth-btn-secondary text-[var(--text-primary)]'
                : 'depth-btn-primary text-white'
            } ${!hasCamera || isConnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--primary)]" />
                <span>Connecting...</span>
              </>
            ) : isLive ? (
              <>
                <Square className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>End Broadcast</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Go Live</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
