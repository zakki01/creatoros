import React, { useEffect, useRef } from 'react';
import { Sparkles, Camera, AlertCircle, RefreshCw, Wand2, Video } from 'lucide-react';
import { AspectRatio, LiveConnectionState, LiveScene } from '../../../types';

interface LiveCameraProps {
  displayStream: MediaStream | null;
  connectionState: LiveConnectionState;
  activeScene: LiveScene;
  aspectRatio: AspectRatio;
  errorMessage: string | null;
  onRequestCamera: () => void;
  isVirtualFeed?: boolean;
  onToggleVirtualFeed?: () => void;
  className?: string;
}

export const LiveCamera: React.FC<LiveCameraProps> = ({
  displayStream,
  connectionState,
  activeScene,
  aspectRatio,
  errorMessage,
  onRequestCamera,
  isVirtualFeed = false,
  onToggleVirtualFeed,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && displayStream) {
      videoRef.current.srcObject = displayStream;
    }
  }, [displayStream]);

  const isLive = connectionState === 'live';

  // Compute layout style so the viewport fills parent space without collapsing
  const getViewportStyle = (): React.CSSProperties => {
    switch (aspectRatio) {
      case '16:9':
        return {
          aspectRatio: '16 / 9',
          width: '100%',
          maxWidth: '880px',
          maxHeight: '100%',
        };
      case '1:1':
        return {
          aspectRatio: '1 / 1',
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%',
        };
      case '9:16':
      default:
        return {
          aspectRatio: '9 / 16',
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%',
        };
    }
  };

  return (
    <div className={`w-full h-full flex items-center justify-center relative overflow-hidden select-none p-1 sm:p-2 ${className}`}>
      {/* Studio Monitor Bezel Container */}
      <div
        data-testid="hero-camera-monitor"
        className={`relative rounded-3xl overflow-hidden bg-[var(--live-canvas,#090C10)] border border-white/15 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.15)] flex items-center justify-center transition-all duration-300 ${
          aspectRatio === '16:9' ? 'aspect-[16/9]' : aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[9/16]'
        }`}
        style={getViewportStyle()}
      >
        {/* Subtle scene backdrop when camera stream is not active */}
        {!displayStream && activeScene?.thumbnailUrl && (
          <img
            src={activeScene.thumbnailUrl}
            alt={activeScene.name}
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105 pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none z-10" />

        {/* Top Monitor Bezel Overlay */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/65 backdrop-blur-xl border border-white/15 text-white shadow-sm pointer-events-none">
              <Sparkles
                className="w-3.5 h-3.5 text-[var(--primary)]"
                style={{ color: activeScene?.accentColor || 'var(--primary)' }}
              />
              <span>{activeScene?.name || 'Studio Feed'}</span>
            </div>

            {/* Virtual / Camera Source Switcher pill */}
            {onToggleVirtualFeed && (
              <button
                type="button"
                onClick={onToggleVirtualFeed}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-xl border transition-all cursor-pointer shadow-sm ${
                  isVirtualFeed
                    ? 'bg-purple-600/75 hover:bg-purple-600 text-white border-purple-400/40'
                    : 'bg-black/60 hover:bg-black/80 text-zinc-300 border-white/15 hover:text-white'
                }`}
                title={isVirtualFeed ? 'Switch to Physical Camera' : 'Switch to Virtual Studio Feed'}
              >
                {isVirtualFeed ? (
                  <>
                    <Wand2 className="w-3 h-3 text-purple-200" />
                    <span>Virtual Feed</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3 h-3 text-sky-300" />
                    <span>Webcam</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-black/65 backdrop-blur-xl text-zinc-200 border border-white/15 pointer-events-none">
              {aspectRatio}
            </div>
            {isLive ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider animate-pulse pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>ON AIR</span>
              </div>
            ) : (
              <div className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/50 backdrop-blur-md text-zinc-400 border border-white/10 pointer-events-none">
                PREVIEW
              </div>
            )}
          </div>
        </div>

        {/* Real / Virtual Camera Stream Viewport */}
        {displayStream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover relative z-0 ${
                isVirtualFeed ? '' : 'transform -scale-x-100'
              }`}
            />

            {/* Live broadcast indicator */}
            {isLive && (
              <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/35 text-[10px] font-mono text-emerald-400 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>BROADCASTING</span>
              </div>
            )}
          </>
        ) : errorMessage ? (
          /* Camera Error / Fallback State */
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 space-y-3 max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Physical Camera Unavailable</h3>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-xs">{errorMessage}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 w-full justify-center">
              <button
                type="button"
                onClick={onRequestCamera}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer w-full sm:w-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Permission</span>
              </button>
              {onToggleVirtualFeed && (
                <button
                  type="button"
                  onClick={onToggleVirtualFeed}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[var(--primary)] hover:opacity-90 shadow-md transition-all cursor-pointer w-full sm:w-auto"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Use Virtual Studio Feed</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Normal Camera Standby State */
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 space-y-3.5 max-w-sm">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 shadow-inner">
              <Camera className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white tracking-tight">Studio Monitor Ready</h3>
              <p className="text-xs text-zinc-400">
                {activeScene ? `${activeScene.name} · ${activeScene.tagline}` : 'Enable camera or start virtual stream'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onRequestCamera}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[var(--primary)] hover:opacity-90 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Enable Camera</span>
              </button>
              {onToggleVirtualFeed && (
                <button
                  type="button"
                  onClick={onToggleVirtualFeed}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                >
                  <Wand2 className="w-3.5 h-3.5 text-purple-300" />
                  <span>Virtual Studio Feed</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
