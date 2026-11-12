import React, { useEffect, useRef } from 'react';
import {
  Sparkles,
  Camera,
  AlertCircle,
  RefreshCw,
  Wand2,
  Video,
  Monitor,
  MessageSquare,
  Trophy,
  Clock,
} from 'lucide-react';
import { AspectRatio, LiveConnectionState, LiveScene } from '../../../types';
import { StudioSceneMode } from './LiveScenesDock';

export interface LiveCameraProps {
  displayStream: MediaStream | null;
  connectionState: LiveConnectionState;
  activeScene: LiveScene;
  aspectRatio: AspectRatio;
  errorMessage: string | null;
  onRequestCamera: () => void;
  isVirtualFeed?: boolean;
  onToggleVirtualFeed?: () => void;
  className?: string;
  // Streamlabs Extensions
  screenStream?: MediaStream | null;
  isScreenSharing?: boolean;
  showChatOverlay?: boolean;
  showGoalOverlay?: boolean;
  showWatermark?: boolean;
  sceneMode?: StudioSceneMode;
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
  screenStream = null,
  isScreenSharing = false,
  showChatOverlay = true,
  showGoalOverlay = true,
  showWatermark = true,
  sceneMode = 'main_cam',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && displayStream) {
      videoRef.current.srcObject = displayStream;
    }
    if (pipVideoRef.current && displayStream) {
      pipVideoRef.current.srcObject = displayStream;
    }
  }, [displayStream]);

  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  const isLive = connectionState === 'live';

  // Compute CSS filter styling and tint overlay from active scene or custom filter
  const filterStyle = activeScene?.filterStyle;
  const cssFilter = filterStyle
    ? `brightness(${filterStyle.brightness ?? 1}) contrast(${filterStyle.contrast ?? 1}) saturate(${filterStyle.saturate ?? 1}) hue-rotate(${filterStyle.hueRotate ?? 0}deg) sepia(${filterStyle.sepia ?? 0})`
    : 'none';

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

  const isIntermission = sceneMode === 'intermission';
  const isScreenMode = (isScreenSharing && Boolean(screenStream)) || sceneMode === 'screen_pip';

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <div
        style={getViewportStyle()}
        className="relative bg-zinc-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center group"
      >
        {/* Top Viewport HUD Overlays */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            {/* Active Preset Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/65 backdrop-blur-xl text-white border border-white/15 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
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

            {isScreenMode && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Monitor className="w-3 h-3" />
                <span>Screen Share</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-black/65 backdrop-blur-xl text-zinc-200 border border-white/15 pointer-events-none">
              {aspectRatio}
            </div>
            {isLive && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider animate-pulse pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>ON AIR</span>
              </div>
            )}
          </div>
        </div>

        {/* Streamlabs Goal Widget Overlay (Top Center) */}
        {showGoalOverlay && !isIntermission && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 shadow-md">
              <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-zinc-200 font-semibold">Follower Goal:</span>
                <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-amber-400 rounded-full" />
                </div>
                <span className="text-amber-400 font-bold">85 / 100</span>
              </div>
            </div>
          </div>
        )}

        {/* INTERMISSION / BRB SCENE OVERLAY */}
        {isIntermission ? (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-purple-950/60 via-zinc-950 to-black space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center animate-pulse shadow-2xl">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white font-display">
                Starting Soon / Intermission
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs font-mono">
                Stream will resume shortly. Stay tuned for live updates.
              </p>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-white">
              00 : 03 : 45
            </div>
          </div>
        ) : isScreenMode && screenStream ? (
          /* SCREEN SHARE + PIP VIEW */
          <div className="relative w-full h-full overflow-hidden">
            {/* Screen Video Feed (Background / Main) */}
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain bg-black"
            />

            {/* PiP Floating Webcam (Bottom Right) */}
            {displayStream && (
              <div className="absolute bottom-4 right-4 z-20 w-36 sm:w-44 aspect-video rounded-xl overflow-hidden border-2 border-sky-400/80 shadow-2xl bg-zinc-950">
                <video
                  ref={pipVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ filter: cssFilter }}
                  className={`w-full h-full object-cover ${isVirtualFeed ? '' : 'transform -scale-x-100'}`}
                />
                <div className="absolute bottom-1 left-1.5 text-[8px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-white border border-white/10">
                  Host Cam
                </div>
              </div>
            )}
          </div>
        ) : displayStream ? (
          /* REGULAR WEBCAM / VIRTUAL FEED VIEWPORT */
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ filter: cssFilter }}
              className={`w-full h-full object-cover relative z-0 transition-[filter] duration-300 ${
                isVirtualFeed ? '' : 'transform -scale-x-100'
              }`}
            />

            {/* Cinematic scene color tint overlay */}
            {filterStyle?.tintRgb && (
              <div
                className="absolute inset-0 pointer-events-none z-10 transition-colors duration-300"
                style={{
                  backgroundColor: filterStyle.tintRgb,
                  mixBlendMode: 'color',
                }}
              />
            )}

            {/* Custom Instagram filter / frame overlay if present */}
            {filterStyle?.customOverlayUrl && (
              <div
                className="absolute inset-0 pointer-events-none z-10 bg-center bg-cover transition-opacity duration-300 mix-blend-screen opacity-90"
                style={{ backgroundImage: `url(${filterStyle.customOverlayUrl})` }}
              />
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
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all cursor-pointer w-full sm:w-auto shadow-sm"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Use Virtual Feed</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Camera Initializing */
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center animate-pulse">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-zinc-400">Requesting Camera Feed...</span>
          </div>
        )}

        {/* Streamlabs Live Chat Overlay (Bottom Left on Canvas) */}
        {showChatOverlay && !isIntermission && (
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none max-w-[70%] space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white">
              <MessageSquare className="w-3 h-3 text-sky-400" />
              <span className="font-semibold text-sky-300">Live Chatbox Widget</span>
            </div>
          </div>
        )}

        {/* CreatorOS Watermark (Bottom Right) */}
        {showWatermark && !isIntermission && (
          <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
            <div className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-mono text-zinc-400">
              CreatorOS Studio
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
