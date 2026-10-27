import React, { useEffect, useRef } from 'react';
import { Sparkles, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { AspectRatio, LiveConnectionState, LiveScene } from '../../../types';

interface LiveCameraProps {
  displayStream: MediaStream | null;
  connectionState: LiveConnectionState;
  activeScene: LiveScene;
  aspectRatio: AspectRatio;
  errorMessage: string | null;
  onRequestCamera: () => void;
  className?: string;
}

export const LiveCamera: React.FC<LiveCameraProps> = ({
  displayStream,
  connectionState,
  activeScene,
  aspectRatio,
  errorMessage,
  onRequestCamera,
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
        className={`relative rounded-3xl overflow-hidden bg-[var(--live-canvas,#090C10)] border border-white/10 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.12)] flex items-center justify-center transition-all duration-300 ${
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
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/65 backdrop-blur-xl border border-white/15 text-white shadow-sm">
            <Sparkles
              className="w-3.5 h-3.5 text-[#00B4D8]"
              style={{ color: activeScene?.accentColor || '#00B4D8' }}
            />
            <span>{activeScene?.name || 'Studio Feed'}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-black/65 backdrop-blur-xl text-zinc-200 border border-white/15">
              {aspectRatio}
            </div>
            {isLive ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>ON AIR</span>
              </div>
            ) : (
              <div className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/50 backdrop-blur-md text-zinc-400 border border-white/10">
                PREVIEW
              </div>
            )}
          </div>
        </div>

        {/* Real Camera Stream Viewport */}
        {displayStream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100 relative z-0"
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
          /* Camera Error State */
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 space-y-3 max-w-xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Camera Unavailable</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={onRequestCamera}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Camera</span>
            </button>
          </div>
        ) : (
          /* Normal Camera Standby State (Clean, professional, not dominating) */
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 space-y-3.5 max-w-xs">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 shadow-inner">
              <Camera className="w-8 h-8 text-[#00B4D8]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white tracking-tight">Studio Monitor Ready</h3>
              <p className="text-xs text-zinc-400">
                {activeScene ? `${activeScene.name} · ${activeScene.tagline}` : 'Webcam in standby'}
              </p>
            </div>
            <button
              type="button"
              onClick={onRequestCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white depth-btn-primary transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Enable Camera</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
