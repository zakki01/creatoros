import React, { useEffect, useRef } from 'react';
import { Camera, CameraOff, Sparkles } from 'lucide-react';
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
        return 'w-full max-w-2xl aspect-video';
      case '1:1':
        return 'w-full max-w-md aspect-square';
      case '9:16':
      default:
        return 'w-[320px] sm:w-[360px] h-[568px] sm:h-[640px] aspect-[9/16]';
    }
  };

  const isLive = connectionState === 'live';

  return (
    <div className="flex flex-col items-center justify-center relative w-full select-none">
      {/* Video Viewport Container */}
      <div
        className={`relative rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl transition-all duration-300 flex items-center justify-center ${getAspectClasses()}`}
      >
        {displayStream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />

            {/* In-viewport overlays */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              {/* Scene Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md border border-white/10 text-white">
                <Sparkles
                  className="w-3.5 h-3.5"
                  style={{ color: activeScene.accentColor }}
                />
                <span>{activeScene.name}</span>
              </div>

              {/* 9:16 Social Frame Grid Indicator */}
              <div className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
                {aspectRatio}
              </div>
            </div>

            {/* Live watermark indicator */}
            {isLive && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-emerald-500/30 text-[11px] font-mono text-emerald-400 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>DECART REALTIME</span>
              </div>
            )}
          </>
        ) : (
          /* Empty / Permission State */
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 text-zinc-400">
            {errorMessage ? (
              <div className="space-y-3 max-w-xs">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <CameraOff className="w-6 h-6" />
                </div>
                <p className="text-xs text-rose-300 font-medium">{errorMessage}</p>
                <button
                  onClick={onRequestCamera}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
                >
                  Retry Camera
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-w-xs">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200">Camera Inactive</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Enable your webcam to start the Live Creator Engine preview.
                  </p>
                </div>
                <button
                  onClick={onRequestCamera}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors"
                >
                  Enable Camera
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
