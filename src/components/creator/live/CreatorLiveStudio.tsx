import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  Wand2,
  Gift,
  Mic,
  MicOff,
  RotateCw,
  Eye,
  Radio,
  X,
  Send,
  Share2,
  Sliders,
  CheckCircle,
  Video,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  AspectRatio,
  LiveConnectionState,
  LiveRecordedClip,
  LiveReferenceImage,
  LiveScene,
  CameraState,
  ARState,
  RecordingState,
  TransportState,
  HonestNetworkStatus,
  EffectDefinition,
  FaceLandmarks,
} from '../../../types';
import { DEFAULT_SCENE } from '../../../services/live/scenesConfig';
import {
  ARCompositor,
  CREATOROS_EFFECTS_CATALOG,
} from '../../../services/live/arCompositor';
import { mediaPipeLandmarkerSingleton } from '../../../services/live/mediaPipeLandmarker';
import { liveRecordingSingleton } from '../../../services/live/recordingService';
import { liveKitSingleton } from '../../../services/live/liveKitService';
import { LiveStreamingService } from '../../../services/live/liveStreamingService';
import { LiveCamera } from './LiveCamera';
import { LiveScenePicker } from './LiveScenePicker';
import { LiveReferencePanel } from './LiveReferencePanel';
import { LiveControls } from './LiveControls';
import { LiveSessionStatus } from './LiveSessionStatus';
import { LiveRecordingPreviewModal } from './LiveRecordingPreviewModal';
import { LiveAudienceModerationPanel } from './LiveAudienceModerationPanel';
import { useAppState } from '../../../context/StateContext';

interface CreatorLiveStudioProps {
  onExit?: () => void;
}

export const CreatorLiveStudio: React.FC<CreatorLiveStudioProps> = ({ onExit }) => {
  const { userProfile } = useAppState();

  // Decoupled Subsystem States
  const [cameraState, setCameraState] = useState<CameraState>('camera_requesting');
  const [arState, setArState] = useState<ARState>('ar_initializing');
  const [recordingState, setRecordingState] = useState<RecordingState>('recording_idle');
  const [transportState, setTransportState] = useState<TransportState>('transport_unconfigured');
  const [networkStatus, setNetworkStatus] = useState<HonestNetworkStatus>('Disconnected');
  const [viewerCount, setViewerCount] = useState(0);

  // Landmark tracking telemetry
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceConfidence, setFaceConfidence] = useState(0);

  // Stream pipeline (Single Source of Truth)
  const [rawCameraStream, setRawCameraStream] = useState<MediaStream | null>(null);
  const [processedStream, setProcessedStream] = useState<MediaStream | null>(null);

  // Studio Settings & Customization
  const [activeScene, setActiveScene] = useState<LiveScene>(DEFAULT_SCENE);
  const [activeEffect, setActiveEffect] = useState<EffectDefinition>(CREATOROS_EFFECTS_CATALOG[0]);
  const [beautyLevel, setBeautyLevel] = useState<number>(60);
  const [referenceImage, setReferenceImage] = useState<LiveReferenceImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transportError, setTransportError] = useState<string | null>(null);

  // Studio UI Navigation
  const [studioTab, setStudioTab] = useState<'effects' | 'scenes' | 'reference'>('effects');
  const [isEffectsDrawerOpen, setIsEffectsDrawerOpen] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<'none' | 'effects' | 'gifts' | 'chat'>('none');
  const [newCommentText, setNewCommentText] = useState('');

  // Cost Protection & Timers
  const maxSessionDurationSec = 3600; // 1 hour max session
  const [remainingSeconds, setRemainingSeconds] = useState(maxSessionDurationSec);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Recording preview modal
  const [recordedClip, setRecordedClip] = useState<LiveRecordedClip | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Pipeline Refs
  const compositorRef = useRef<ARCompositor>(new ARCompositor());
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const countdownIntervalRef = useRef<any>(null);

  // ---------------------------------------------------------------------------
  // 1. LIFECYCLE & SUBSCRIPTION HOOKS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Subscribe to MediaPipe Face Landmarker state
    const unsubLandmarker = mediaPipeLandmarkerSingleton.subscribe((state, landmarks) => {
      setArState(state);
      setFaceDetected(Boolean(landmarks && landmarks.detected));
      setFaceConfidence(landmarks ? landmarks.confidence : 0);
    });

    // Subscribe to LiveKit Transport
    const unsubTransport = liveKitSingleton.subscribeState((st) => {
      setTransportState(st);
      LiveStreamingService.setConnectionState(st === 'transport_live' ? 'live' : 'idle');
    });

    const unsubNetwork = liveKitSingleton.subscribeNetwork((net) => {
      setNetworkStatus(net);
    });

    const unsubViewers = liveKitSingleton.subscribeViewerCount((count) => {
      setViewerCount(count);
    });

    // Subscribe to Recording
    const unsubRecording = liveRecordingSingleton.subscribe((recSt, sec) => {
      setRecordingState(recSt);
      setRecordingSeconds(sec);
    });

    // Initial Camera Request
    requestCamera();

    return () => {
      unsubLandmarker();
      unsubTransport();
      unsubNetwork();
      unsubViewers();
      unsubRecording();
      stopAllMedia();
    };
  }, []);

  // Sync processedStream with mobile video element
  useEffect(() => {
    if (mobileVideoRef.current && processedStream) {
      mobileVideoRef.current.srcObject = processedStream;
    }
  }, [processedStream]);

  // ---------------------------------------------------------------------------
  // 2. CAMERA & PROCESSED STREAM PIPELINE
  // ---------------------------------------------------------------------------
  const requestCamera = async (targetFacingMode?: 'user' | 'environment') => {
    try {
      setErrorMessage(null);
      setCameraState('camera_requesting');

      // Stop previous streams
      if (rawCameraStream) {
        rawCameraStream.getTracks().forEach((t) => t.stop());
      }
      compositorRef.current.stop();

      const mode = targetFacingMode || facingMode;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: { ideal: mode },
        },
        audio: isAudioEnabled,
      });

      setRawCameraStream(stream);
      setCameraState('camera_ready');

      // Connect camera to ARCompositor (Single Source of Truth)
      const output = compositorRef.current.start(stream, activeEffect, (landmarks) => {
        setFaceDetected(Boolean(landmarks && landmarks.detected));
        setFaceConfidence(landmarks ? landmarks.confidence : 0);
      });

      setProcessedStream(output);
    } catch (err: any) {
      console.error('[CreatorLiveStudio] Camera access error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser to start streaming.'
          : 'Unable to access camera device. Check your camera connection and try again.'
      );
      setCameraState('camera_error');
    }
  };

  const handleStopCamera = () => {
    if (rawCameraStream) {
      rawCameraStream.getTracks().forEach((t) => t.stop());
      setRawCameraStream(null);
    }
    compositorRef.current.stop();
    setProcessedStream(null);
    setCameraState('camera_idle');
  };

  const handleFlipCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    await requestCamera(nextMode);
  };

  const stopAllMedia = () => {
    if (rawCameraStream) {
      rawCameraStream.getTracks().forEach((t) => t.stop());
    }
    compositorRef.current.stop();
    liveRecordingSingleton.reset();
    liveKitSingleton.disconnect().catch(() => {});
    clearInterval(countdownIntervalRef.current);
  };

  // ---------------------------------------------------------------------------
  // 3. EFFECT & BEAUTY CONTROLS
  // ---------------------------------------------------------------------------
  const handleSelectEffect = (effect: EffectDefinition) => {
    setActiveEffect(effect);
    compositorRef.current.setEffect(effect);
  };

  const handleSelectEffectById = (effectId: string) => {
    const found = CREATOROS_EFFECTS_CATALOG.find((e) => e.id === effectId) || CREATOROS_EFFECTS_CATALOG[0];
    handleSelectEffect(found);
  };

  const handleUpdateBeauty = (level: number) => {
    setBeautyLevel(level);
    compositorRef.current.setBeautyLevel(level);
  };

  const handleToggleAudio = () => {
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);
    if (rawCameraStream) {
      rawCameraStream.getAudioTracks().forEach((t) => (t.enabled = nextState));
    }
    if (processedStream) {
      processedStream.getAudioTracks().forEach((t) => (t.enabled = nextState));
    }
    liveKitSingleton.toggleMicrophone(nextState).catch(() => {});
  };

  // ---------------------------------------------------------------------------
  // 4. RECORDING PIPELINE (Independent of LiveKit)
  // ---------------------------------------------------------------------------
  const handleToggleRecording = async () => {
    if (recordingState === 'recording') {
      const clip = await liveRecordingSingleton.stop({
        aspectRatio,
        sceneId: activeScene.id,
        sceneName: activeScene.name,
      });
      if (clip) {
        setRecordedClip(clip);
        setIsPreviewOpen(true);
      }
    } else {
      const streamToRecord = processedStream || rawCameraStream;
      if (streamToRecord) {
        liveRecordingSingleton.start(streamToRecord);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // 5. LIVEKIT WEBRTC BROADCAST PIPELINE
  // ---------------------------------------------------------------------------
  const handleToggleLive = async () => {
    if (transportState === 'transport_live') {
      await stopLiveSession();
      return;
    }

    if (!processedStream && !rawCameraStream) {
      await requestCamera();
      return;
    }

    try {
      setTransportError(null);
      setTransportState('transport_connecting');

      const creatorId = userProfile?.id || 'cr-01';
      const creatorName = userProfile?.name || 'Rohan Sharma';

      // 1. Fetch authentic signed JWT session token from server endpoint
      const sessionDetails = await liveKitSingleton.requestSessionToken({
        creatorId,
        creatorName,
        roomName: `creatoros-live-${creatorId}`,
        role: 'host',
      });

      // 2. Connect to LiveKit Room and publish processed media stream
      const streamToPublish = processedStream || rawCameraStream!;
      await liveKitSingleton.connectAndPublish(sessionDetails, streamToPublish, isAudioEnabled);

      // Start duration countdown
      setRemainingSeconds(maxSessionDurationSec);
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            stopLiveSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('[CreatorLiveStudio] Go Live failed:', err);
      setTransportState('transport_error');
      setTransportError(err?.message || 'Live transport unavailable: Connection failed.');
    }
  };

  const stopLiveSession = async () => {
    clearInterval(countdownIntervalRef.current);
    await liveKitSingleton.disconnect();
    setRemainingSeconds(maxSessionDurationSec);
  };

  const handleSendMobileComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    LiveStreamingService.sendMessage(
      userProfile?.id || 'cr-01',
      userProfile?.name || 'You',
      newCommentText.trim(),
      'chat'
    );
    setNewCommentText('');
  };

  const handleShareStream = async () => {
    const liveUrl = `https://creatoros.ai/live/${userProfile?.name?.toLowerCase().replace(/\s+/g, '.') || 'rohan.kicks'}`;
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `${userProfile?.name || 'Creator'} is LIVE on CreatorOS`,
          text: `Join my live broadcast with real-time AR & chat!`,
          url: liveUrl,
        });
      } catch {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(liveUrl);
      LiveStreamingService.sendMessage('sys', 'System', 'Live stream URL copied to clipboard! 📋', 'system');
    }
  };

  const isLive = transportState === 'transport_live';
  const displayStream = processedStream || rawCameraStream;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE CAMERA-FIRST 100DVH SOCIAL CAMERA (Instagram / TikTok Model)     */}
      {/* ========================================================================= */}
      <div className="block lg:hidden fixed inset-0 z-50 w-full h-[100dvh] bg-black overflow-hidden select-none flex flex-col justify-between text-white">
        {/* Full-bleed Processed Camera Stream */}
        <video
          ref={mobileVideoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform ${
            facingMode === 'user' ? '-scale-x-100' : ''
          }`}
        />

        {/* Ambient Top & Bottom Gradients for HUD Readability */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

        {/* Floating Top Bar (Translucent Liquid Glass) */}
        <div className="relative z-20 p-4 pt-safe flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            {/* Exit Studio Button */}
            <button
              type="button"
              onClick={onExit}
              aria-label="Exit Live Studio"
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Host Profile Pill */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-md">
              <img
                src={
                  userProfile?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'
                }
                alt="Host"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-semibold">{userProfile?.name || 'Rohan Sharma'}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isLive ? 'bg-rose-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                <Radio className="w-2.5 h-2.5" />
                {isLive ? 'LIVE' : 'PREVIEW'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Real Viewer Count */}
            {isLive && (
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono shadow-md">
                <Eye className="w-3.5 h-3.5 text-rose-400" />
                <span>{viewerCount}</span>
              </div>
            )}

            {/* Honest Status Badge */}
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/15 text-[10px] font-mono shadow-md">
              {transportState === 'transport_live' ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              ) : transportState === 'transport_connecting' ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  CONNECTING
                </span>
              ) : (
                <span className="text-zinc-300 font-medium">PREVIEW</span>
              )}
            </div>
          </div>
        </div>

        {/* Floating Right Action Rail */}
        <div className="absolute right-4 top-24 z-20 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleFlipCamera}
            aria-label="Flip Camera"
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white active:scale-90 transition-transform shadow-md cursor-pointer"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileDrawer(mobileDrawer === 'effects' ? 'none' : 'effects')}
            aria-label="AR Effects"
            className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center active:scale-90 transition-transform shadow-md cursor-pointer ${
              mobileDrawer === 'effects' || activeEffect.id !== 'eff-none'
                ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                : 'bg-black/50 border-white/15 text-white'
            }`}
          >
            <Wand2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label="Toggle Microphone"
            className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center active:scale-90 transition-transform shadow-md cursor-pointer ${
              isAudioEnabled ? 'bg-black/50 border-white/15 text-white' : 'bg-rose-500/80 border-rose-400 text-white'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileDrawer(mobileDrawer === 'gifts' ? 'none' : 'gifts')}
            aria-label="Virtual Gifts"
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-amber-300 active:scale-90 transition-transform shadow-md cursor-pointer"
          >
            <Gift className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleShareStream}
            aria-label="Share Stream"
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white active:scale-90 transition-transform shadow-md cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Social HUD */}
        <div className="relative z-20 p-4 pb-safe flex flex-col gap-3">
          {/* Recent Live Chat Messages */}
          <div className="max-h-36 overflow-y-auto flex flex-col gap-1.5 pointer-events-auto pr-12 scrollbar-none">
            {LiveStreamingService.getState().messages.slice(-4).map((msg) => (
              <div
                key={msg.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-xs w-fit max-w-[85%]"
              >
                <span className="font-semibold text-sky-400">{msg.senderName}:</span>
                <span className="text-white/90">{msg.content}</span>
              </div>
            ))}
          </div>

          {/* Comment Composer & Live Controls Row */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSendMobileComment} className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Say something nice..."
                className="flex-1 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:border-[var(--primary)]"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="w-10 h-10 rounded-full bg-[var(--primary)] border border-[var(--primary)] flex items-center justify-center text-white active:scale-90 transition-transform shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Go Live / Leave Live Button */}
            <button
              type="button"
              onClick={handleToggleLive}
              aria-label="Go Live CTA"
              className={`px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform cursor-pointer shrink-0 ${
                isLive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isLive ? 'End Live' : 'Go Live'}</span>
            </button>
          </div>
        </div>

        {/* Mobile AR Effects Bottom Sheet */}
        {mobileDrawer === 'effects' && (
          <div className="absolute inset-x-0 bottom-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-white/15 rounded-t-3xl p-4 flex flex-col gap-3 animate-slide-up max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm font-bold">MediaPipe AR Effects</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawer('none')}
                className="p-1 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {CREATOROS_EFFECTS_CATALOG.map((eff) => {
                const isSelected = activeEffect.id === eff.id;
                return (
                  <button
                    key={eff.id}
                    type="button"
                    onClick={() => handleSelectEffect(eff)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--primary)]/30 border-[var(--primary)] text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">
                      {eff.id === 'eff-none'
                        ? '🚫'
                        : eff.id === 'eff-beauty'
                        ? '✨'
                        : eff.id === 'eff-crown'
                        ? '👑'
                        : eff.id === 'eff-visor'
                        ? '🥽'
                        : eff.id === 'eff-decoration'
                        ? '🌸'
                        : '⚡'}
                    </span>
                    <span className="text-[11px] font-semibold truncate w-full">{eff.name}</span>
                  </button>
                );
              })}
            </div>

            {activeEffect.id === 'eff-beauty' && (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs text-zinc-300 font-semibold">
                  <span>Smoothing Intensity</span>
                  <span>{beautyLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={beautyLevel}
                  onChange={(e) => handleUpdateBeauty(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP RESPONSIVE BROADCASTING WORKSPACE (CSS Grid at >= 1024px)       */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid grid-rows-[auto_1fr] h-full w-full p-4 xl:p-6 gap-3 overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
        {/* Studio Top Bar */}
        <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-3">
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="p-2 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Exit Live Studio"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[var(--text-primary)] font-display tracking-tight">
                Live Studio
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--primary)]/10 text-[var(--primary-hover)] dark:text-[var(--primary)] border border-[var(--primary)]/25">
                <Sparkles className="w-3 h-3 text-[var(--primary)]" />
                Broadcasting Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LiveSessionStatus
              cameraState={cameraState}
              arState={arState}
              recordingState={recordingState}
              transportState={transportState}
              networkStatus={networkStatus}
              viewerCount={viewerCount}
              faceDetected={faceDetected}
              faceConfidence={faceConfidence}
              remainingSeconds={remainingSeconds}
              maxDurationSeconds={maxSessionDurationSec}
              recordingSeconds={recordingSeconds}
              transportError={transportError}
              onRetryTransport={handleToggleLive}
              // Backward compatibility
              cameraStatus={cameraState === 'camera_ready' ? 'ready' : cameraState === 'camera_requesting' ? 'requesting' : 'idle'}
              transportStatus={transportState === 'transport_live' ? 'live' : transportState === 'transport_connecting' ? 'connecting' : 'unconfigured'}
              isRecording={recordingState === 'recording'}
            />

            <button
              type="button"
              onClick={handleShareStream}
              className="p-2 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Share Stream"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid: Left Hero Viewport (1fr) + Right Audience Rail (340px) */}
        <div className="grid grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] gap-4 h-full min-h-0 overflow-hidden">
          {/* Left Hero Workspace */}
          <div className="flex flex-col h-full min-h-0 overflow-hidden gap-2.5">
            {/* HERO CAMERA VIEWPORT: Fills available workspace, aspect-ratio preserved */}
            <div className="flex-1 flex items-center justify-center min-h-0 relative overflow-hidden bg-[var(--live-canvas,#090C10)] rounded-3xl border border-white/10 shadow-lg p-2">
              <LiveCamera
                displayStream={displayStream}
                connectionState={isLive ? 'live' : 'idle'}
                activeScene={activeScene}
                aspectRatio={aspectRatio}
                errorMessage={errorMessage}
                onRequestCamera={requestCamera}
              />
            </div>

            {/* STUDIO CONTROLS ROW: Anchored directly below camera viewport */}
            <div className="shrink-0 flex items-center justify-center">
              <LiveControls
                connectionState={isLive ? 'live' : 'idle'}
                transportStatus={isLive ? 'live' : transportState === 'transport_connecting' ? 'connecting' : 'unconfigured'}
                hasCamera={Boolean(rawCameraStream)}
                isRecording={recordingState === 'recording'}
                recordingSeconds={recordingSeconds}
                aspectRatio={aspectRatio}
                isAudioEnabled={isAudioEnabled}
                onToggleLive={handleToggleLive}
                onToggleRecording={handleToggleRecording}
                onSelectAspectRatio={setAspectRatio}
                onToggleAudio={handleToggleAudio}
                onRetryTransport={handleToggleLive}
                onToggleDrawer={() => setIsEffectsDrawerOpen(!isEffectsDrawerOpen)}
                isDrawerOpen={isEffectsDrawerOpen}
                onToggleCamera={rawCameraStream ? handleStopCamera : () => requestCamera()}
              />
            </div>

            {/* COLLAPSIBLE TOOLS DRAWER: Only visible when opened by user */}
            {isEffectsDrawerOpen && (
              <div className="shrink-0 max-h-56 overflow-y-auto rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3 shadow-md animate-fade-in">
                <div className="flex items-center justify-between gap-1.5 p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStudioTab('effects')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        studioTab === 'effects'
                          ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Wand2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>AR Effects &amp; Beauty</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioTab('scenes')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        studioTab === 'scenes'
                          ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>Scene Lighting</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioTab('reference')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        studioTab === 'reference'
                          ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>Reference</span>
                    </button>
                  </div>
                </div>

                {/* Tab 1: AR Effects & Beauty */}
                {studioTab === 'effects' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {CREATOROS_EFFECTS_CATALOG.map((eff) => {
                        const isSelected = activeEffect.id === eff.id;
                        return (
                          <button
                            key={eff.id}
                            type="button"
                            onClick={() => handleSelectEffect(eff)}
                            className={`p-2 rounded-xl flex flex-col items-center gap-1 text-center border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--text-primary)] shadow-xs font-semibold'
                                : 'bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)]'
                            }`}
                          >
                            <span className="text-base">
                              {eff.id === 'eff-none'
                                ? '🚫'
                                : eff.id === 'eff-beauty'
                                ? '✨'
                                : eff.id === 'eff-crown'
                                ? '👑'
                                : eff.id === 'eff-visor'
                                ? '🥽'
                                : eff.id === 'eff-decoration'
                                ? '🌸'
                                : '⚡'}
                            </span>
                            <span className="text-[10px] truncate w-full">{eff.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {activeEffect.id === 'eff-beauty' && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">Beauty Smoothing:</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={beautyLevel}
                          onChange={(e) => handleUpdateBeauty(Number(e.target.value))}
                          className="flex-1 accent-[var(--primary)]"
                        />
                        <span className="text-xs font-mono font-bold text-[var(--text-primary)] w-8 text-right">
                          {beautyLevel}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Scene Lighting */}
                {studioTab === 'scenes' && (
                  <LiveScenePicker
                    selectedScene={activeScene}
                    onSelectScene={setActiveScene}
                    disabled={recordingState === 'recording'}
                  />
                )}

                {/* Tab 3: Reference Image */}
                {studioTab === 'reference' && (
                  <LiveReferencePanel
                    referenceImage={referenceImage}
                    onReferenceImageChange={setReferenceImage}
                    disabled={recordingState === 'recording'}
                  />
                )}
              </div>
            )}
          </div>

          {/* Right Rail: Full-Height Audience & Moderation Panel */}
          <aside className="h-full min-h-0 overflow-hidden" aria-label="Audience and Moderation Panel">
            <LiveAudienceModerationPanel
              isHost={true}
              currentUserId={userProfile?.id || 'cr-01'}
              currentUserName={userProfile?.name || 'Rohan Sharma'}
            />
          </aside>
        </div>
      </div>

      {/* Recording Preview Modal */}
      {recordedClip && (
        <LiveRecordingPreviewModal
          clip={recordedClip}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setRecordedClip(null);
          }}
          onSubmittedSuccess={() => {
            setIsPreviewOpen(false);
            setRecordedClip(null);
          }}
        />
      )}
    </>
  );
};
