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
} from 'lucide-react';
import {
  AspectRatio,
  LiveConnectionState,
  LiveRecordedClip,
  LiveReferenceImage,
  LiveScene,
} from '../../../types';
import { DEFAULT_SCENE } from '../../../services/live/scenesConfig';
import {
  createLiveAIProvider,
  getStoredLiveEngineConfig,
} from '../../../services/live/liveAIProvider';
import { AR_EFFECTS_CATALOG } from '../../../services/live/arEffectCatalog';
import { faceTrackerSingleton } from '../../../services/live/faceTracker';
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
  const [studioTab, setStudioTab] = useState<'audience' | 'scenes'>('audience');
  const [config] = useState(getStoredLiveEngineConfig);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [augmentedStream, setAugmentedStream] = useState<MediaStream | null>(null);
  const [transformedStream, setTransformedStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<LiveConnectionState>('idle');
  const [activeScene, setActiveScene] = useState<LiveScene>(DEFAULT_SCENE);
  const [referenceImage, setReferenceImage] = useState<LiveReferenceImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real AR & Face Landmark Effect states
  const [activeEffectId, setActiveEffectId] = useState<string | null>('eff-beauty-luxe');
  const [beautyLevel, setBeautyLevel] = useState<number>(60);
  const [mobileDrawer, setMobileDrawer] = useState<'none' | 'effects' | 'gifts' | 'chat'>('none');
  const [mobileComments, setMobileComments] = useState<Array<{ id: string; user: string; text: string }>>([
    { id: 'c1', user: 'sneakerhead_mumbai', text: 'Bro those kicks in the background are 🔥🔥🔥' },
    { id: 'c2', user: 'aanya_style', text: 'Lighting is crisp! Loved the transition drop' },
    { id: 'c3', user: 'rahul_visuals', text: 'What camera setup are you streaming from?' },
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [viewerCount, setViewerCount] = useState(1420);

  // Cost protection & countdown state
  const [remainingSeconds, setRemainingSeconds] = useState(config.maxSessionDurationSec || 60);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedClip, setRecordedClip] = useState<LiveRecordedClip | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Refs
  const providerRef = useRef(createLiveAIProvider(config));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<any>(null);
  const recordingIntervalRef = useRef<any>(null);
  const recordingSecondsRef = useRef(0);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleShareStream = async () => {
    const liveUrl = `https://creatoros.ai/live/${userProfile?.name?.toLowerCase().replace(/\s+/g, '.') || 'rohan.kicks'}`;
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `${userProfile?.name || 'Creator'} is LIVE on CreatorOS`,
          text: `Join my live stream and chat in real-time!`,
          url: liveUrl,
        });
      } catch {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(liveUrl);
      setMobileComments((prev) => [
        ...prev,
        { id: `sys-${Date.now()}`, user: 'System', text: 'Live stream link copied to clipboard! 📋' },
      ]);
    }
  };

  // Request camera on mount
  const requestCamera = async (targetFacingMode?: 'user' | 'environment') => {
    try {
      const mode = targetFacingMode || facingMode;
      setErrorMessage(null);
      setConnectionState('requesting_camera');

      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      faceTrackerSingleton.stop();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: { ideal: mode },
        },
        audio: isAudioEnabled,
      });

      setCameraStream(stream);

      // Start computer-vision face landmark tracker & AR filters
      const trackedStream = faceTrackerSingleton.start(stream, activeEffectId || undefined);
      setAugmentedStream(trackedStream);
      setConnectionState('ready');
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser to start streaming.'
          : 'Unable to access camera device. Check your camera connection and try again.'
      );
      setConnectionState('error');
    }
  };

  const handleFlipCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    await requestCamera(nextMode);
  };

  useEffect(() => {
    requestCamera();
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      faceTrackerSingleton.stop();
      providerRef.current.disconnect();
      clearInterval(countdownIntervalRef.current);
      clearInterval(recordingIntervalRef.current);
    };
  }, []);

  // Update Face Tracker effect in real-time
  const handleSelectEffect = (effectId: string | null) => {
    setActiveEffectId(effectId);
    faceTrackerSingleton.setEffect(effectId);
  };

  const handleUpdateBeauty = (level: number) => {
    setBeautyLevel(level);
    faceTrackerSingleton.setBeautyLevel(level);
  };

  // Sync mobile video element
  useEffect(() => {
    const stream = transformedStream || augmentedStream || cameraStream;
    if (mobileVideoRef.current && stream) {
      mobileVideoRef.current.srcObject = stream;
    }
  }, [transformedStream, augmentedStream, cameraStream]);

  // Handle scene change
  const handleSelectScene = (scene: LiveScene) => {
    setActiveScene(scene);
    if (connectionState === 'live') {
      providerRef.current.updateScene(scene);
    }
  };

  const handleReferenceImageChange = (image: LiveReferenceImage | null) => {
    setReferenceImage(image);
    if (connectionState === 'live') {
      providerRef.current.updateReferenceImage(image?.dataUrl || null);
    }
  };

  // Start / Stop Live AI transformation
  const handleToggleLive = async () => {
    if (connectionState === 'live') {
      stopLiveSession();
    } else if (cameraStream) {
      try {
        setConnectionState('connecting');
        const liveStream = await providerRef.current.connect({
          inputStream: augmentedStream || cameraStream,
          scene: activeScene,
          referenceImageDataUrl: referenceImage?.dataUrl,
          aspectRatio,
        });

        setTransformedStream(liveStream);
        setConnectionState('live');
        setRecordingSeconds(0);
        setRemainingSeconds(config.maxSessionDurationSec || 60);

        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = setInterval(() => {
          setRecordingSeconds((s) => s + 1);
          setRemainingSeconds((prev) => {
            if (prev <= 1) {
              stopLiveSession();
              return 0;
            }
            return prev - 1;
          });
          // fluctuate viewers naturally
          setViewerCount((v) => Math.max(100, v + (Math.floor(Math.random() * 9) - 4)));
        }, 1000);
      } catch (err: any) {
        console.error('Live connect error:', err);
        // Fallback to local loop streaming with AR effects active
        setConnectionState('live');
        setRecordingSeconds(0);
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = setInterval(() => {
          setRecordingSeconds((s) => s + 1);
          setViewerCount((v) => Math.max(100, v + (Math.floor(Math.random() * 9) - 4)));
        }, 1000);
      }
    }
  };

  const stopLiveSession = async () => {
    clearInterval(countdownIntervalRef.current);
    await providerRef.current.disconnect();
    setTransformedStream(null);
    setConnectionState('ready');
    setRecordingSeconds(0);
  };

  const handleToggleAudio = () => {
    if (cameraStream) {
      const audioTracks = cameraStream.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !isAudioEnabled));
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const streamToRecord = transformedStream || augmentedStream || cameraStream;
    if (!streamToRecord) return;

    recordedChunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    try {
      const recorder = new MediaRecorder(streamToRecord, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const clip: LiveRecordedClip = {
          id: `clip-${Date.now()}`,
          blob,
          url,
          durationSec: recordingSecondsRef.current,
          aspectRatio,
          sceneId: activeScene.id,
          sceneName: activeScene.name,
          createdAt: new Date().toLocaleTimeString(),
        };
        setRecordedClip(clip);
        setIsPreviewOpen(true);
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;

      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          recordingSecondsRef.current = prev + 1;
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Recording initialization error:', err);
    }
  };

  const stopRecording = () => {
    clearInterval(recordingIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSendMobileComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setMobileComments((prev) => [
      ...prev.slice(-8),
      {
        id: `c-${Date.now()}`,
        user: userProfile?.name || 'You',
        text: newCommentText.trim(),
      },
    ]);
    setNewCommentText('');
  };

  const isConfigured = Boolean(config.apiKey && config.apiKey.trim().length > 0);
  const displayStream = transformedStream || augmentedStream || cameraStream;
  const isLive = connectionState === 'live';

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE CAMERA-FIRST 9:16 LAYOUT (TikTok LIVE / Instagram Reels Model)   */}
      {/* ========================================================================= */}
      <div className="block lg:hidden fixed inset-0 z-50 w-full h-[100dvh] bg-black overflow-hidden select-none flex flex-col justify-between text-white">
        {/* Main Full-Height 100dvh Camera Stream */}
        <video
          ref={mobileVideoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform ${
            facingMode === 'user' ? '-scale-x-100' : ''
          }`}
        />

        {/* Ambient Top & Bottom Vignettes for HUD Readability */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

        {/* Floating Top Bar Overlay */}
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

            {/* Host Pill */}
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
                {isLive ? `LIVE ${formatDuration(recordingSeconds)}` : 'STANDBY'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewer Count Pill */}
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono shadow-md">
              <Eye className="w-3.5 h-3.5 text-rose-400" />
              <span>{viewerCount.toLocaleString()}</span>
            </div>

            {/* Transport State Badge */}
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/15 text-[10px] font-mono shadow-md">
              {!isConfigured ? (
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  BLOCKED — credentials required
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LiveKit Active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Floating Right Control Column (Fitts's Law 44px Touch Targets) */}
        <div className="absolute right-3.5 top-24 z-20 flex flex-col items-center gap-3 text-white">
          {/* 1. Flip Camera (Facing mode toggle) */}
          <button
            type="button"
            onClick={handleFlipCamera}
            aria-label="Flip Camera"
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-xs active:scale-90 transition-transform shadow-lg cursor-pointer"
          >
            <RotateCw className="w-5 h-5 text-zinc-200" />
          </button>

          {/* 2. AR Effects Drawer */}
          <button
            type="button"
            onClick={() => setMobileDrawer(mobileDrawer === 'effects' ? 'none' : 'effects')}
            aria-label="AR Effects"
            className={`w-11 h-11 rounded-full backdrop-blur-md border flex flex-col items-center justify-center text-xs active:scale-90 transition-all shadow-lg cursor-pointer ${
              activeEffectId
                ? 'bg-[#007E93] text-white border-white/40 shadow-teal-500/30'
                : 'bg-black/50 border-white/20 text-white'
            }`}
          >
            <Wand2 className="w-5 h-5" />
          </button>

          {/* 3. Beauty Smoothing */}
          <button
            type="button"
            onClick={() => handleUpdateBeauty(beautyLevel === 0 ? 60 : 0)}
            aria-label="Beauty Filter"
            className={`w-11 h-11 rounded-full backdrop-blur-md border flex flex-col items-center justify-center text-xs active:scale-90 transition-all shadow-lg cursor-pointer ${
              beautyLevel > 0
                ? 'bg-pink-600 text-white border-white/40 shadow-pink-500/30'
                : 'bg-black/50 border-white/20 text-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* 4. Mic / Mute */}
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label="Toggle Microphone"
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-xs active:scale-90 transition-transform shadow-lg cursor-pointer"
          >
            {isAudioEnabled ? (
              <Mic className="w-5 h-5 text-emerald-400" />
            ) : (
              <MicOff className="w-5 h-5 text-rose-400" />
            )}
          </button>

          {/* 5. Virtual Gifts Tray */}
          <button
            type="button"
            onClick={() => setMobileDrawer(mobileDrawer === 'gifts' ? 'none' : 'gifts')}
            aria-label="Virtual Gifts"
            className="w-11 h-11 rounded-full bg-amber-500/90 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center text-xs active:scale-90 transition-transform shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Gift className="w-5 h-5 text-white" />
          </button>

          {/* 6. Share Stream */}
          <button
            type="button"
            onClick={handleShareStream}
            aria-label="Share Stream"
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-xs active:scale-90 transition-transform shadow-lg cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-zinc-200" />
          </button>
        </div>

        {/* Floating Bottom Chat Overlay & Controls */}
        <div className="relative z-20 p-4 pb-safe space-y-3">
          {/* Live Chat Stream (Translucent cards floating over camera) */}
          <div className="max-h-44 overflow-y-auto space-y-2 pr-1 text-xs text-white no-scrollbar">
            {mobileComments.slice(-4).map((cm) => (
              <div
                key={cm.id}
                className="bg-black/55 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10 w-fit max-w-[85%] shadow-md flex items-baseline gap-2"
              >
                <span className="font-bold text-[#00B4D8] shrink-0">{cm.user}:</span>
                <span className="text-zinc-100 break-words">{cm.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom Actions Row */}
          <div className="flex items-center gap-2 pt-1">
            <form onSubmit={handleSendMobileComment} className="flex-1 flex items-center relative">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Say something nice..."
                className="w-full pl-4 pr-10 py-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#007E93]"
              />
              <button
                type="submit"
                aria-label="Send Comment"
                className="absolute right-2 p-1.5 rounded-full text-zinc-300 hover:text-white active:scale-95 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={handleToggleLive}
              className={`min-h-[44px] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer ${
                isLive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{isLive ? 'End Live' : 'Go Live'}</span>
            </button>
          </div>
        </div>

        {/* Camera Permission / Error Recovery Modal */}
        {(connectionState === 'error' || errorMessage) && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 text-center animate-fade-in">
            <div className="max-w-xs space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10">
                <Video className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Camera Access Required</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {errorMessage || 'CreatorOS requires camera permissions to broadcast your vertical stream.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => requestCamera()}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#007E93] hover:bg-[#006779] text-white text-xs font-bold shadow-lg shadow-teal-900/30 active:scale-95 transition-transform cursor-pointer"
              >
                Allow Camera &amp; Try Again
              </button>
            </div>
          </div>
        )}

        {/* Mobile AR Effects Bottom Sheet */}
        {mobileDrawer === 'effects' && (
          <div className="absolute inset-x-0 bottom-0 z-30 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-700 rounded-t-3xl p-4 pb-8 text-white animate-slide-up space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
                  Face Landmarks & AR Filters
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawer('none')}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 max-h-56 overflow-y-auto no-scrollbar">
              <button
                type="button"
                onClick={() => handleSelectEffect(null)}
                className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 border text-center transition-all cursor-pointer ${
                  !activeEffectId ? 'border-white bg-white/20 shadow-md' : 'border-zinc-800 bg-zinc-800/80 hover:bg-zinc-800'
                }`}
              >
                <span className="text-xl">🚫</span>
                <span className="text-[10px] text-zinc-300 font-medium">None</span>
              </button>

              {AR_EFFECTS_CATALOG.map((eff) => {
                const isSelected = activeEffectId === eff.id;
                return (
                  <button
                    key={eff.id}
                    type="button"
                    onClick={() => handleSelectEffect(eff.id)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 border text-center transition-all cursor-pointer ${
                      isSelected ? 'border-[#00F0FF] bg-[#00F0FF]/25 shadow-lg shadow-cyan-500/20' : 'border-zinc-800 bg-zinc-800/80 hover:bg-zinc-800'
                    }`}
                  >
                    <img src={eff.thumbnail} alt={eff.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10" />
                    <span className="text-[10px] text-zinc-200 truncate w-full font-medium">{eff.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Gifts Bottom Sheet */}
        {mobileDrawer === 'gifts' && (
          <div className="absolute inset-x-0 bottom-0 z-30 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-700 rounded-t-3xl p-4 pb-8 text-white animate-slide-up space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Virtual Live Gifts
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawer('none')}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 text-center">
              {[
                { name: 'Rose', coins: 10, icon: '🌹' },
                { name: 'Kicks', coins: 50, icon: '👟' },
                { name: 'Crown', coins: 250, icon: '👑' },
                { name: 'Rocket', coins: 1000, icon: '🚀' },
              ].map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => {
                    setMobileComments((prev) => [
                      ...prev,
                      { id: `g-${Date.now()}`, user: userProfile?.name || 'Supporter', text: `Sent a ${g.name}! ${g.icon}` },
                    ]);
                    setMobileDrawer('none');
                  }}
                  className="p-3 rounded-2xl bg-zinc-800/90 border border-zinc-700/80 hover:border-amber-400 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="text-xs font-semibold">{g.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono">{g.coins} Coins</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP MULTI-PANEL LIVE STUDIO                                        */}
      {/* ========================================================================= */}
      <div className="hidden lg:block space-y-4 animate-fade-in p-6 max-w-6xl mx-auto">
        {/* Studio Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                title="Exit Live Studio"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display tracking-tight">
                Live Studio
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#007E93]/10 text-[#006779] border border-[#007E93]/25">
                <Sparkles className="w-3 h-3 text-[#007E93]" />
                Realtime AI &amp; Face Tracking
              </span>
            </div>
          </div>

          <LiveSessionStatus
            connectionState={connectionState}
            isProviderConfigured={isConfigured}
            remainingSeconds={remainingSeconds}
            maxDurationSeconds={config.maxSessionDurationSec || 60}
            isRecording={isRecording}
            recordingSeconds={recordingSeconds}
          />
        </div>

        {/* Main Studio Viewport & Side Configuration */}
        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-7 flex flex-col items-center justify-center space-y-3">
            <LiveCamera
              displayStream={displayStream}
              connectionState={connectionState}
              activeScene={activeScene}
              aspectRatio={aspectRatio}
              errorMessage={errorMessage}
              onRequestCamera={requestCamera}
            />

            {/* Studio Controls */}
            <div className="w-full">
              <LiveControls
                connectionState={connectionState}
                hasCamera={Boolean(cameraStream)}
                isRecording={isRecording}
                recordingSeconds={recordingSeconds}
                aspectRatio={aspectRatio}
                isAudioEnabled={isAudioEnabled}
                onToggleLive={handleToggleLive}
                onToggleRecording={handleToggleRecording}
                onSelectAspectRatio={setAspectRatio}
                onToggleAudio={handleToggleAudio}
              />
            </div>
          </div>

          {/* Right: Tabbed Moderation vs AR Effects & Scenes */}
          <div className="col-span-5 space-y-4">
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-200/70">
              <button
                type="button"
                onClick={() => setStudioTab('audience')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  studioTab === 'audience'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Audience &amp; Chat</span>
              </button>
              <button
                type="button"
                onClick={() => setStudioTab('scenes')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  studioTab === 'scenes'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>AR Effects &amp; Scene</span>
              </button>
            </div>

            {studioTab === 'audience' ? (
              <div className="h-[520px]">
                <LiveAudienceModerationPanel isHost={true} />
              </div>
            ) : (
              <div className="space-y-5 surface-2 p-5 rounded-3xl border border-zinc-200/80">
                {/* Active AR Filter Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-900 block font-display">
                    Tracked AR Accessories &amp; Beauty
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectEffect(null)}
                      className={`p-2 rounded-xl text-xs border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                        !activeEffectId ? 'bg-[#007E93]/10 border-[#007E93] font-semibold' : 'bg-white border-zinc-200'
                      }`}
                    >
                      <span>🚫 Clean Video (No AR)</span>
                    </button>
                    {AR_EFFECTS_CATALOG.map((eff) => {
                      const isSel = activeEffectId === eff.id;
                      return (
                        <button
                          key={eff.id}
                          type="button"
                          onClick={() => handleSelectEffect(eff.id)}
                          className={`p-2 rounded-xl text-xs border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                            isSel ? 'bg-[#007E93]/10 border-[#007E93] text-[#007E93] font-semibold' : 'bg-white border-zinc-200 text-zinc-800'
                          }`}
                        >
                          <img src={eff.thumbnail} alt={eff.name} className="w-6 h-6 rounded-md object-cover" />
                          <span className="truncate">{eff.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-zinc-200" />

                <LiveScenePicker
                  selectedScene={activeScene}
                  onSelectScene={handleSelectScene}
                  disabled={isRecording}
                />

                <div className="h-px bg-zinc-200" />

                <LiveReferencePanel
                  referenceImage={referenceImage}
                  onReferenceImageChange={handleReferenceImageChange}
                  disabled={isRecording}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recorded Clip Preview & Submit Modal */}
      <LiveRecordingPreviewModal
        clip={recordedClip}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
};
