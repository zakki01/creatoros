import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { AspectRatio, LiveConnectionState, LiveScene } from '../../../types';

interface LiveCameraProps {
  displayStream: MediaStream | null;
  connectionState: LiveConnectionState;
  activeScene: LiveScene;
  aspectRatio: AspectRatio;
  errorMessage: string | null;
  onRequestCamera: () => void;
}

export const LiveCamera: React.FC<LiveCameraProps> = ({
  displayStream,
  connectionState,
  activeScene,
  aspectRatio,
  errorMessage,
  onRequestCamera,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && displayStream) {
      videoRef.current.srcObject = displayStream;
    }
  }, [displayStream]);

  // Dimension classes based on AspectRatio
  const getAspectClasses = () => {
    switch (aspectRatio) {
      case '16:9':
        return 'w-full h-[320px] sm:h-[380px] aspect-video';
      case '1:1':
        return 'w-full max-w-[380px] h-[340px] sm:h-[380px] aspect-square';
      case '9:16':
      default:
        return 'w-full max-w-[330px] h-[360px] sm:h-[400px] aspect-[9/16]';
    }
  };

  const isLive = connectionState === 'live';

  return (
    <div className="flex flex-col items-center justify-center relative w-full select-none">
      {/* Ambient Studio Rim Light behind Monitor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-72 h-72 rounded-full blur-3xl opacity-25 transition-colors duration-500"
        style={{ backgroundColor: activeScene.accentColor }}
      />

      {/* 3D Studio Monitor Viewport Container */}
      <div
        className={`relative rounded-3xl overflow-hidden surface-3 border border-white/15 shadow-[0_28px_60px_-14px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.22)] transition-all duration-300 flex items-center justify-center ${getAspectClasses()}`}
      >
        {/* Subtle scene backdrop preview when camera is off */}
        {!displayStream && activeScene.thumbnailUrl && (
          <img
            src={activeScene.thumbnailUrl}
            alt={activeScene.name}
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105 pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

        {/* Top Monitor Bezel Overlay */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/65 backdrop-blur-xl border border-white/15 text-white shadow-sm">
            <Sparkles
              className="w-3.5 h-3.5"
              style={{ color: activeScene.accentColor }}
            />
            <span>{activeScene.name}</span>
          </div>

          <div className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-black/65 backdrop-blur-xl text-zinc-200 border border-white/15">
            {aspectRatio}
          </div>
        </div>

        {displayStream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100 relative z-10"
            />

            {/* Live watermark indicator */}
            {isLive && (
              <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/35 text-[10px] font-mono text-emerald-400 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE AI</span>
              </div>
            )}
          </>
        ) : (
          /* 3D Studio Camera Object State */
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="animate-float-slow">
              <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-[0_18px_28px_rgba(99,102,241,0.35)]">
                <defs>
                  <linearGradient id="studioCamBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#312e81" />
                    <stop offset="55%" stopColor="#1e1b4b" />
                    <stop offset="100%" stopColor="#09090b" />
                  </linearGradient>
                  <linearGradient id="studioCamLens" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a5b4fc" />
                    <stop offset="50%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </linearGradient>
                </defs>
                <ellipse cx="60" cy="104" rx="32" ry="5" fill="rgba(0,0,0,0.6)" />
                <rect x="26" y="28" width="68" height="50" rx="15" fill="url(#studioCamBody)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" transform="rotate(-4 60 53)" />
                <rect x="22" y="34" width="76" height="54" rx="16" fill="url(#studioCamBody)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <rect x="36" y="25" width="24" height="10" rx="5" fill="#4338ca" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <circle cx="60" cy="61" r="20" fill="#07070A" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <circle cx="60" cy="61" r="14" fill="url(#studioCamLens)" />
                <circle cx="55" cy="56" r="4.5" fill="rgba(255,255,255,0.6)" />
                <circle cx="84" cy="44" r="3" fill={errorMessage ? '#f43f5e' : '#34d399'} />
              </svg>
            </div>

            <div className="space-y-1 max-w-[220px]">
              <h3 className="text-sm font-semibold text-white">
                {errorMessage ? 'Camera Standby' : 'Studio Monitor'}
              </h3>
              <p className="text-xs text-zinc-400">
                {errorMessage ? 'Connect camera to start' : `${activeScene.name} · ${activeScene.tagline}`}
              </p>
            </div>

            <button
              onClick={onRequestCamera}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white depth-btn-primary transition-all cursor-pointer"
            >
              Enable Camera
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
