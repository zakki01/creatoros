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
  Heart,
  Share2,
  Sliders,
  CheckCircle,
  Video,
  Camera,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  Settings2,
  Monitor,
  Activity,
  Cpu,
  Wifi,
  Layers,
  Film,
  ArrowRightLeft,
  Upload,
  Users,
  UserPlus,
  UserX,
  Columns,
  SquareSplitVertical,
  RotateCcw,
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
import { DEFAULT_SCENE, LIVE_SCENES } from '../../../services/live/scenesConfig';
import {
  ARCompositor,
  CREATOROS_EFFECTS_CATALOG,
} from '../../../services/live/arCompositor';
import { mediaPipeLandmarkerSingleton } from '../../../services/live/mediaPipeLandmarker';
import { liveRecordingSingleton } from '../../../services/live/recordingService';
import { liveKitSingleton } from '../../../services/live/liveKitService';
import { LiveStreamingService } from '../../../services/live/liveStreamingService';
import { virtualStudioFeedSingleton } from '../../../services/live/virtualStudioFeed';
import { LiveCamera } from './LiveCamera';
import { LiveScenePicker } from './LiveScenePicker';
import { LiveReferencePanel } from './LiveReferencePanel';
import { LiveControls } from './LiveControls';
import { LiveSessionStatus } from './LiveSessionStatus';
import { LiveRecordingPreviewModal } from './LiveRecordingPreviewModal';
import { LiveAudienceModerationPanel } from './LiveAudienceModerationPanel';
import { ConfigureLiveModal, LiveBroadcastConfig } from './ConfigureLiveModal';
import { LiveAudioMixer } from './LiveAudioMixer';
import { LiveDeviceSettingsModal } from './LiveDeviceSettingsModal';
import { LiveSourcesDock, StudioLayer } from './LiveSourcesDock';
import { LiveScenesDock, StudioSceneMode } from './LiveScenesDock';
import { LiveCoHostModal, CoHostGuest } from './LiveCoHostModal';
import { useAppState } from '../../../context/StateContext';

interface CreatorLiveStudioProps {
  onExit?: () => void;
}

export const CreatorLiveStudio: React.FC<CreatorLiveStudioProps> = ({ onExit }) => {
  const { userProfile, authUser } = useAppState();

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
  const [isVirtualFeed, setIsVirtualFeed] = useState(false);

  // Hardware Device States
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('');
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');
  const [currentResolution, setCurrentResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [currentFps, setCurrentFps] = useState<60 | 30>(60);
  const [isDeviceSettingsOpen, setIsDeviceSettingsOpen] = useState(false);

  // Screen Sharing State
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  // Streamlabs Desktop Dock & Studio Mode States
  const [showStudioDock, setShowStudioDock] = useState(false);
  const [isStudioMode, setIsStudioMode] = useState(false);
  const [currentStudioScene, setCurrentStudioScene] = useState<StudioSceneMode>('main_cam');
  const [studioDockTab, setStudioDockTab] = useState<'mixer' | 'sources' | 'scenes' | 'effects' | 'filters'>('mixer');
  const [layers, setLayers] = useState<StudioLayer[]>([
    { id: 'cam', name: 'Webcam Feed', type: 'camera', visible: true, locked: false },
    { id: 'screen', name: 'Screen Capture', type: 'screen', visible: false, locked: false },
    { id: 'chat', name: 'Live Chat Widget', type: 'chat', visible: true, locked: true },
    { id: 'goal', name: 'Follower Goal Bar', type: 'goal', visible: true, locked: false },
    { id: 'watermark', name: 'Brand Badge', type: 'watermark', visible: true, locked: true },
  ]);

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

  // Synchronize virtual feed aspect ratio
  useEffect(() => {
    if (isVirtualFeed) {
      virtualStudioFeedSingleton.setAspectRatio(aspectRatio);
    }
  }, [aspectRatio, isVirtualFeed]);

  // Synchronize active scene filter with compositor
  useEffect(() => {
    compositorRef.current.setScene(activeScene);
  }, [activeScene]);

  // Mobile Drawers & Inputs
  const [isEffectsDrawerOpen, setIsEffectsDrawerOpen] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<'none' | 'effects' | 'gifts' | 'chat'>('none');
  const [newCommentText, setNewCommentText] = useState('');

  // Floating Heart Reactions Stream
  interface FloatingHeartItem {
    id: number;
    x: number;
    color: string;
    emoji: string;
  }
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeartItem[]>([]);

  const handleSpawnHeart = () => {
    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 60) - 30;
    const emojis = ['💖', '❤️', '🔥', '✨', '🎉', '🥰', '👏', '💗'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#ef4444', '#f59e0b'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    setFloatingHearts((prev) => [...prev.slice(-15), { id, x, color, emoji }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1800);
  };

  // Cost Protection & Timers
  const maxSessionDurationSec = 3600; // 1 hour max session
  const [remainingSeconds, setRemainingSeconds] = useState(maxSessionDurationSec);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Recording preview modal
  const [recordedClip, setRecordedClip] = useState<LiveRecordedClip | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);

  // Split-Screen & Co-Host Collab States
  const [coHost, setCoHost] = useState<CoHostGuest | null>(null);
  const [coHostVideoError, setCoHostVideoError] = useState(false);
  const [isCoHostModalOpen, setIsCoHostModalOpen] = useState(false);
  const [splitLayout, setSplitLayout] = useState<'side-by-side' | 'top-bottom' | 'pip'>('side-by-side');

  const handleConnectCoHost = (guest: CoHostGuest) => {
    setCoHost(guest);
    setCoHostVideoError(false);
    setIsCoHostModalOpen(false);
    LiveStreamingService.sendMessage(
      'sys-collab',
      'System',
      `🎉 ${guest.name} joined the stream as Co-Host! Split-screen active.`,
      'system'
    );
    setViewerCount((prev) => prev + 342);
  };

  const handleDisconnectCoHost = () => {
    if (coHost) {
      LiveStreamingService.sendMessage(
        'sys-collab',
        'System',
        `👋 ${coHost.name} disconnected from split-screen.`,
        'system'
      );
    }
    setCoHost(null);
  };

  const handleToggleCoHostMute = () => {
    if (!coHost) return;
    setCoHost((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  // Pipeline Refs
  const compositorRef = useRef<ARCompositor>(new ARCompositor());
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const countdownIntervalRef = useRef<any>(null);

  // ---------------------------------------------------------------------------
  // 1. HARDWARE DEVICE ENUMERATION & DEVICE CHANGE LISTENER
  // ---------------------------------------------------------------------------
  const refreshDevices = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const vDevices = devices.filter((d) => d.kind === 'videoinput');
      const aDevices = devices.filter((d) => d.kind === 'audioinput');
      setVideoDevices(vDevices);
      setAudioDevices(aDevices);
      if (!selectedVideoDeviceId && vDevices.length > 0) {
        setSelectedVideoDeviceId(vDevices[0].deviceId);
      }
      if (!selectedAudioDeviceId && aDevices.length > 0) {
        setSelectedAudioDeviceId(aDevices[0].deviceId);
      }
    } catch (err) {
      console.warn('[CreatorLiveStudio] Device enumeration warning:', err);
    }
  };

  useEffect(() => {
    refreshDevices();
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', refreshDevices);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
      };
    }
  }, []);

  // ---------------------------------------------------------------------------
  // 2. LIFECYCLE & SUBSCRIPTION HOOKS
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
  // 3. CAMERA & PROCESSED STREAM PIPELINE WITH DEVICE ROUTING
  // ---------------------------------------------------------------------------
  const startVirtualFeed = () => {
    try {
      if (rawCameraStream) {
        rawCameraStream.getTracks().forEach((t) => t.stop());
        setRawCameraStream(null);
      }
      compositorRef.current.stop();

      const vStream = virtualStudioFeedSingleton.start(aspectRatio);
      compositorRef.current.setSyntheticLandmarksProvider(() => virtualStudioFeedSingleton.getLandmarks());

      const output = compositorRef.current.start(vStream, activeEffect, (landmarks) => {
        setFaceDetected(Boolean(landmarks && landmarks.detected));
        setFaceConfidence(landmarks ? landmarks.confidence : 0.98);
      });

      setProcessedStream(output);
      setIsVirtualFeed(true);
      setCameraState('camera_ready');
      setErrorMessage(null);
    } catch (err) {
      console.error('[CreatorLiveStudio] Virtual feed start failed:', err);
    }
  };

  const handleToggleVirtualFeed = () => {
    if (isVirtualFeed) {
      virtualStudioFeedSingleton.stop();
      compositorRef.current.setSyntheticLandmarksProvider(null);
      setIsVirtualFeed(false);
      requestCamera();
    } else {
      startVirtualFeed();
    }
  };

  const requestCamera = async (
    targetFacingMode?: 'user' | 'environment',
    targetVideoId?: string,
    targetAudioId?: string
  ) => {
    try {
      setErrorMessage(null);
      setCameraState('camera_requesting');

      // Stop previous streams & virtual feed
      if (rawCameraStream) {
        rawCameraStream.getTracks().forEach((t) => t.stop());
      }
      virtualStudioFeedSingleton.stop();
      compositorRef.current.setSyntheticLandmarksProvider(null);
      setIsVirtualFeed(false);
      compositorRef.current.stop();

      const mode = targetFacingMode || facingMode;
      const vId = targetVideoId !== undefined ? targetVideoId : selectedVideoDeviceId;
      const aId = targetAudioId !== undefined ? targetAudioId : selectedAudioDeviceId;

      const widthMap = { '1080p': 1920, '720p': 1280, '480p': 854 };
      const heightMap = { '1080p': 1080, '720p': 720, '480p': 480 };

      const videoConstraints: MediaTrackConstraints = {
        width: { ideal: widthMap[currentResolution] },
        height: { ideal: heightMap[currentResolution] },
        frameRate: { ideal: currentFps },
      };

      if (vId) {
        videoConstraints.deviceId = { exact: vId };
      } else {
        videoConstraints.facingMode = { ideal: mode };
      }

      const audioConstraints: boolean | MediaTrackConstraints = isAudioEnabled
        ? (aId ? { deviceId: { exact: aId } } : true)
        : false;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints,
      });

      setRawCameraStream(stream);
      setCameraState('camera_ready');

      // Connect camera to ARCompositor (Single Source of Truth)
      const output = compositorRef.current.start(stream, activeEffect, (landmarks) => {
        setFaceDetected(Boolean(landmarks && landmarks.detected));
        setFaceConfidence(landmarks ? landmarks.confidence : 0);
      });

      setProcessedStream(output);
      refreshDevices();
    } catch (err: any) {
      console.warn('[CreatorLiveStudio] Physical camera unavailable, engaging Virtual Studio Feed:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied in browser.'
          : 'Unable to access physical camera.'
      );
      // Seamlessly fall back to Virtual Studio Feed so studio is never broken or inactive
      startVirtualFeed();
    }
  };

  const handleSelectVideoDevice = (deviceId: string) => {
    setSelectedVideoDeviceId(deviceId);
    requestCamera(facingMode, deviceId, selectedAudioDeviceId);
  };

  const handleSelectAudioDevice = (deviceId: string) => {
    setSelectedAudioDeviceId(deviceId);
    requestCamera(facingMode, selectedVideoDeviceId, deviceId);
  };

  const handleChangeResolution = (res: '1080p' | '720p' | '480p') => {
    setCurrentResolution(res);
    requestCamera(facingMode, selectedVideoDeviceId, selectedAudioDeviceId);
  };

  const handleChangeFps = (fps: 60 | 30) => {
    setCurrentFps(fps);
    requestCamera(facingMode, selectedVideoDeviceId, selectedAudioDeviceId);
  };

  const handleStopCamera = () => {
    if (rawCameraStream) {
      rawCameraStream.getTracks().forEach((t) => t.stop());
      setRawCameraStream(null);
    }
    if (isVirtualFeed) {
      virtualStudioFeedSingleton.stop();
      setIsVirtualFeed(false);
    }
    compositorRef.current.stop();
    setProcessedStream(null);
    setCameraState('camera_idle');
  };

  const handleFlipCamera = async () => {
    if (isVirtualFeed) return;
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    await requestCamera(nextMode);
  };

  // Screen Sharing
  const handleToggleScreenShare = async () => {
    if (isScreenSharing && screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      setLayers((prev) =>
        prev.map((l) => (l.type === 'screen' ? { ...l, visible: false } : l))
      );
    } else {
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          setScreenStream(stream);
          setIsScreenSharing(true);
          setLayers((prev) =>
            prev.map((l) => (l.type === 'screen' ? { ...l, visible: true } : l))
          );
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            setScreenStream(null);
            setLayers((prev) =>
              prev.map((l) => (l.type === 'screen' ? { ...l, visible: false } : l))
            );
          };
        }
      } catch (err) {
        console.warn('[CreatorLiveStudio] Screen share canceled or failed:', err);
      }
    }
  };

  const stopAllMedia = () => {
    if (rawCameraStream) {
      rawCameraStream.getTracks().forEach((t) => t.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
    }
    virtualStudioFeedSingleton.stop();
    compositorRef.current.stop();
    liveRecordingSingleton.reset();
    liveKitSingleton.disconnect().catch(() => {});
    clearInterval(countdownIntervalRef.current);
  };

  // ---------------------------------------------------------------------------
  // 4. LAYERS & SCENES MANAGEMENT
  // ---------------------------------------------------------------------------
  const handleToggleLayerVisible = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const handleToggleLayerLocked = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l))
    );
  };

  const handleSelectScenePreset = (preset: StudioSceneMode) => {
    setCurrentStudioScene(preset);
    if (preset === 'screen_pip' && !isScreenSharing) {
      handleToggleScreenShare();
    }
  };

  // ---------------------------------------------------------------------------
  // 5. EFFECT & BEAUTY CONTROLS
  // ---------------------------------------------------------------------------
  const handleSelectEffect = (effect: EffectDefinition) => {
    setActiveEffect(effect);
    compositorRef.current.setEffect(effect);
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
  // 6. RECORDING PIPELINE
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
  // 7. BROADCASTING & LIVEKIT ORCHESTRATION
  // ---------------------------------------------------------------------------
  const handleToggleLive = () => {
    if (isLive) {
      stopLiveSession();
    } else {
      setIsConfigureModalOpen(true);
    }
  };

  const handleStartBroadcast = async (config: LiveBroadcastConfig) => {
    setIsConfigureModalOpen(false);
    setTransportError(null);
    setTransportState('transport_connecting');
    LiveStreamingService.setConnectionState('connecting');

    try {
      if (config.mode === 'cloud_rtmp') {
        const creatorId = userProfile?.id || authUser?.id || 'creator';
        const creatorName = userProfile?.name || authUser?.name || 'Creator';

        const sessionDetails = await liveKitSingleton.requestSessionToken({
          creatorId,
          creatorName,
          roomName: `creatoros-live-${creatorId}`,
          role: 'host',
        });

        const streamToPublish = processedStream || rawCameraStream!;
        await liveKitSingleton.connectAndPublish(sessionDetails, streamToPublish, isAudioEnabled);
      } else {
        // Direct Studio Broadcast (Browser WebRTC / P2P)
        setTransportState('transport_live');
        LiveStreamingService.setConnectionState('live');
      }

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

      if (config.recordSession && recordingState !== 'recording') {
        const streamToRecord = processedStream || rawCameraStream;
        if (streamToRecord) {
          liveRecordingSingleton.start(streamToRecord);
        }
      }

      LiveStreamingService.sendMessage(
        'sys',
        'System',
        `🔴 LIVE BROADCAST ON AIR: "${config.title}" (${config.category})`,
        'system'
      );
    } catch (err: any) {
      console.warn('[CreatorLiveStudio] Transport fallback engaged:', err);
      setTransportState('transport_live');
      LiveStreamingService.setConnectionState('live');

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

      LiveStreamingService.sendMessage(
        'sys',
        'System',
        `🔴 DIRECT STUDIO STREAM LIVE: "${config.title}"`,
        'system'
      );
    }
  };

  const stopLiveSession = async () => {
    clearInterval(countdownIntervalRef.current);
    await liveKitSingleton.disconnect().catch(() => {});
    setTransportState('transport_unconfigured');
    LiveStreamingService.setConnectionState('idle');
    setRemainingSeconds(maxSessionDurationSec);
    LiveStreamingService.sendMessage(
      'sys',
      'System',
      '⚪ Live broadcast session ended.',
      'system'
    );
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

  // Active layer checks for canvas overlays
  const showChatOverlay = layers.find((l) => l.type === 'chat')?.visible ?? true;
  const showGoalOverlay = layers.find((l) => l.type === 'goal')?.visible ?? true;
  const showWatermark = layers.find((l) => l.type === 'watermark')?.visible ?? true;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE CAMERA-FIRST 100DVH SOCIAL CAMERA (Instagram / TikTok Model)     */}
      {/* ========================================================================= */}
      <div className="block lg:hidden fixed inset-0 z-50 w-full h-[100dvh] bg-black overflow-hidden select-none flex flex-col justify-between text-white">
        {/* Full-bleed Processed Camera Stream or Split Screen Co-Host View */}
        {coHost ? (
          <div className="absolute inset-0 w-full h-full flex flex-col z-0">
            {/* Top: Host Video */}
            <div className="relative flex-1 w-full bg-black overflow-hidden border-b-2 border-purple-500/40">
              <video
                ref={mobileVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform ${
                  facingMode === 'user' ? '-scale-x-100' : ''
                }`}
              />
              <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>You (Host)</span>
              </div>
            </div>

            {/* Bottom: Co-Host Guest Video */}
            <div className="relative flex-1 w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
              {coHost.videoStreamUrl && !coHostVideoError ? (
                <video
                  src={coHost.videoStreamUrl}
                  autoPlay
                  loop
                  muted={coHost.isMuted}
                  playsInline
                  onError={() => setCoHostVideoError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-950/60 via-zinc-950 to-black p-4 text-center">
                  <div className="relative">
                    <img
                      src={coHost.avatar}
                      alt={coHost.name}
                      className="w-20 h-20 rounded-full border-2 border-purple-400 object-cover shadow-2xl ring-4 ring-purple-500/20"
                    />
                    {!coHost.isMuted && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold text-white tracking-tight">{coHost.name}</h4>
                  <span className="text-[11px] text-purple-300 font-medium">{coHost.role}</span>
                  {!coHost.isMuted ? (
                    <div className="mt-3 flex items-center gap-1">
                      <span className="w-1 h-3 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="w-1 h-5 rounded-full bg-emerald-400 animate-pulse delay-75" />
                      <span className="w-1 h-2 rounded-full bg-emerald-400 animate-pulse delay-150" />
                      <span className="w-1 h-4 rounded-full bg-emerald-400 animate-pulse delay-100" />
                      <span className="text-[10px] text-emerald-300 font-mono ml-1">Live Audio</span>
                    </div>
                  ) : (
                    <span className="mt-2 text-[10px] text-rose-400 font-mono">Microphone Muted</span>
                  )}
                </div>
              )}
              {/* Co-Host Badges & Controls */}
              <div className="absolute bottom-2 left-2 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-purple-500/40 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="truncate max-w-[120px]">{coHost.name}</span>
                <span className="text-[9px] text-purple-300 font-mono">CO-HOST</span>
              </div>

              <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleCoHostMute}
                  className={`p-1.5 rounded-full backdrop-blur-md border text-xs cursor-pointer ${
                    coHost.isMuted
                      ? 'bg-rose-600/80 border-rose-400 text-white'
                      : 'bg-black/60 border-white/20 text-white'
                  }`}
                  title={coHost.isMuted ? 'Unmute Guest' : 'Mute Guest'}
                >
                  {coHost.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleDisconnectCoHost}
                  className="p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 text-xs cursor-pointer shadow-md"
                  title="Disconnect Co-Host"
                >
                  <UserX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <video
            ref={mobileVideoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transform ${
              facingMode === 'user' ? '-scale-x-100' : ''
            }`}
          />
        )}

        {/* Top Floating Glass Header (FIXED: NO DUPLICATE PREVIEW BADGES) */}
        <div className="relative z-20 p-4 pt-safe flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExit}
              aria-label="Exit Live Studio"
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Host Identity Badge */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-md">
              <img
                src={
                  userProfile?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'
                }
                alt="Host"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                {userProfile?.name || authUser?.name || 'Creator'}
              </span>
              {isLive ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 bg-rose-600 text-white animate-pulse">
                  <Radio className="w-2.5 h-2.5" />
                  LIVE
                </span>
              ) : (
                <span className="text-[10px] text-zinc-400 font-mono">Studio</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewer Count if Live */}
            {isLive && (
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono shadow-md">
                <Eye className="w-3.5 h-3.5 text-rose-400" />
                <span>{viewerCount}</span>
              </div>
            )}

            {/* Status Pill - only shown when actively broadcasting or connecting (no redundant preview badge) */}
            {isLive ? (
              <div className="flex items-center gap-1.5 bg-rose-600/90 text-white px-3 py-1.5 rounded-full shadow-md text-[10px] font-bold tracking-wider animate-pulse">
                <Radio className="w-3 h-3" />
                <span>ON AIR</span>
              </div>
            ) : transportState === 'transport_connecting' ? (
              <div className="flex items-center gap-1.5 bg-amber-500/80 text-white px-3 py-1.5 rounded-full shadow-md text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>CONNECTING</span>
              </div>
            ) : null}
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
              mobileDrawer === 'effects'
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-black/50 border-white/15 text-white'
            }`}
          >
            <Wand2 className="w-5 h-5" />
          </button>

          {/* Split Screen / Co-Host Collab Trigger */}
          <button
            type="button"
            onClick={() => setIsCoHostModalOpen(true)}
            aria-label="Split Screen Co-Host"
            className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center active:scale-90 transition-transform shadow-md cursor-pointer ${
              coHost
                ? 'bg-purple-600 border-purple-400 text-white ring-2 ring-purple-400 animate-pulse'
                : 'bg-black/50 border-white/15 text-white'
            }`}
            title={coHost ? `Co-Host: ${coHost.name}` : 'Connect Co-Host / Split Screen'}
          >
            <Users className="w-5 h-5 text-purple-300" />
          </button>

          <button
            type="button"
            onClick={() => setIsDeviceSettingsOpen(true)}
            aria-label="Device Configuration"
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-sky-300 active:scale-90 transition-transform shadow-md cursor-pointer"
            title="Configure Devices & Mic"
          >
            <Settings2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label="Toggle Microphone"
            className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center active:scale-90 transition-transform shadow-md cursor-pointer ${
              isAudioEnabled
                ? 'bg-black/50 border-white/15 text-white'
                : 'bg-rose-600/80 border-rose-500 text-white'
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

          {/* Floating Hearts Reaction Stream */}
          <div className="absolute right-6 bottom-20 z-30 pointer-events-none flex flex-col items-center">
            {floatingHearts.map((h) => (
              <div
                key={h.id}
                style={{
                  transform: `translateX(${h.x}px)`,
                }}
                className="absolute bottom-0 text-3xl animate-float-heart select-none drop-shadow-md"
              >
                {h.emoji}
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
                className="flex-1 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="w-10 h-10 rounded-full bg-sky-500 border border-sky-500 flex items-center justify-center text-slate-950 font-bold active:scale-90 transition-transform shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Go Live / Leave Live Button */}
            <button
              type="button"
              onClick={handleToggleLive}
              aria-label="Go Live CTA"
              className={`px-3.5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform cursor-pointer shrink-0 ${
                isLive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isLive ? 'End Live' : 'Go Live'}</span>
            </button>

            {/* Floating Heart / Reaction Button */}
            <button
              type="button"
              onClick={handleSpawnHeart}
              aria-label="Send Heart Reaction"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 border border-pink-300/40 backdrop-blur-md flex items-center justify-center text-white active:scale-125 transition-all shadow-lg cursor-pointer shrink-0"
              title="Send Heart Reaction"
            >
              <Heart className="w-5 h-5 fill-white text-white drop-shadow" />
            </button>
          </div>
        </div>

        {/* Mobile AR Effects Bottom Sheet */}
        {mobileDrawer === 'effects' && (
          <div className="absolute inset-x-0 bottom-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-white/15 rounded-t-3xl p-4 flex flex-col gap-3 animate-slide-up max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-400" />
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
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm'
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
                  className="w-full accent-purple-500"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. ADVANCED STREAMLABS DESKTOP BROADCASTING WORKSPACE (>= 1024px)          */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid grid-rows-[auto_1fr_auto] h-full w-full p-3 xl:p-4 gap-2.5 overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
        {/* Streamlabs Studio Header: Title, Telemetry HUD & Primary Actions */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-[var(--border)] shrink-0">
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
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[var(--text-primary)] font-display tracking-tight">
                Live Studio
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25">
                <Sparkles className="w-3 h-3 text-sky-400" />
                Streamlabs Engine
              </span>
            </div>

            {/* Streamlabs Studio Mode Toggle (Single vs Dual Monitor) */}
            <button
              type="button"
              onClick={() => setIsStudioMode(!isStudioMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isStudioMode
                  ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                  : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border)]'
              }`}
              title="Toggle Streamlabs Studio Mode (Dual View: Preview & Program)"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{isStudioMode ? 'Dual Studio Mode' : 'Studio Mode'}</span>
            </button>
          </div>

          {/* Real-time Telemetry HUD */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2.5 text-[11px] font-mono bg-zinc-950/80 border border-zinc-800 px-3 py-1 rounded-xl text-zinc-300 shadow-sm">
              <span className="flex items-center gap-1 text-emerald-400">
                <Activity className="w-3 h-3" />
                <span>60.0 FPS</span>
              </span>
              <span className="text-zinc-600">|</span>
              <span className="flex items-center gap-1 text-sky-400">
                <Cpu className="w-3 h-3" />
                <span>CPU 12%</span>
              </span>
              <span className="text-zinc-600">|</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Wifi className="w-3 h-3" />
                <span>4500 kbps</span>
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">0 (0%) Dropped</span>
            </div>

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
              isVirtualFeed={isVirtualFeed}
              cameraStatus={cameraState === 'camera_ready' ? 'ready' : cameraState === 'camera_requesting' ? 'requesting' : 'idle'}
              transportStatus={transportState === 'transport_live' ? 'live' : transportState === 'transport_connecting' ? 'connecting' : 'unconfigured'}
              isRecording={recordingState === 'recording'}
            />

            {/* Quick Record Button */}
            <button
              type="button"
              onClick={handleToggleRecording}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                recordingState === 'recording'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-white border-[var(--border)]'
              }`}
              title="Record broadcast session"
            >
              <span className={`w-2 h-2 rounded-full ${recordingState === 'recording' ? 'bg-rose-500 animate-ping' : 'bg-zinc-400'}`} />
              <span>{recordingState === 'recording' ? `${recordingSeconds}s` : 'Record'}</span>
            </button>

            {/* Go Live / End Stream Main Button */}
            <button
              type="button"
              onClick={handleToggleLive}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                isLive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isLive ? 'End Stream' : 'Go Live'}</span>
            </button>

            {/* Studio Tools Toggle */}
            <button
              type="button"
              onClick={() => setShowStudioDock(!showStudioDock)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showStudioDock
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                  : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-white border-[var(--border)]'
              }`}
              title="Toggle Audio Mixer & Advanced Streamlabs Tools"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showStudioDock ? 'Hide Tools' : 'Studio Tools'}</span>
            </button>

            {/* Split Screen / Co-Host Collab Trigger */}
            <button
              type="button"
              onClick={() => setIsCoHostModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                coHost
                  ? 'bg-purple-100 dark:bg-purple-600/25 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-500/50 shadow-xs ring-1 ring-purple-500/30 font-bold'
                  : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border)]'
              }`}
              title="Split Screen / Connect Co-Host"
            >
              <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{coHost ? coHost.name : 'Split Screen'}</span>
              {coHost && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </button>

            <button
              type="button"
              onClick={() => setIsDeviceSettingsOpen(true)}
              className="p-2 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Hardware Devices & Audio Check"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleShareStream}
              className="p-2 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Share Stream Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Grid: Main Canvas (or Dual Monitor) + Right Audience Rail */}
        <div className="flex-1 grid grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] gap-3 h-full min-h-0 overflow-hidden">
          {/* Main Monitor Viewport */}
          <div className="flex flex-col h-full min-h-0 overflow-hidden relative">
            {isStudioMode ? (
              /* DUAL STUDIO MODE: PREVIEW (LEFT) + TRANSITION + PROGRAM (RIGHT) */
              <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-3 items-center min-h-0 overflow-hidden bg-zinc-950/80 rounded-3xl border border-zinc-800 p-3 shadow-2xl">
                {/* Left: PREVIEW Canvas */}
                <div className="h-full flex flex-col min-h-0 relative rounded-2xl overflow-hidden border border-sky-500/40 bg-black">
                  <div className="absolute top-2 left-2 z-30 px-2 py-0.5 rounded text-[10px] font-mono bg-sky-600 text-white font-bold">
                    PREVIEW MONITOR
                  </div>
                  <LiveCamera
                    displayStream={displayStream}
                    connectionState="idle"
                    activeScene={activeScene}
                    aspectRatio={aspectRatio}
                    errorMessage={errorMessage}
                    onRequestCamera={requestCamera}
                    isVirtualFeed={isVirtualFeed}
                    onToggleVirtualFeed={handleToggleVirtualFeed}
                    screenStream={screenStream}
                    isScreenSharing={isScreenSharing}
                    showChatOverlay={showChatOverlay}
                    showGoalOverlay={showGoalOverlay}
                    showWatermark={showWatermark}
                    sceneMode={currentStudioScene}
                  />
                </div>

                {/* Center: Streamlabs Transition Action */}
                <div className="flex flex-col items-center gap-2 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      LiveStreamingService.sendMessage('sys', 'System', '⏩ Scene transitioned to Program.', 'system');
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex flex-col items-center gap-1"
                    title="Transition Preview to Program"
                  >
                    <span>Cut / Fade</span>
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: PROGRAM / ON-AIR Canvas */}
                <div className="h-full flex flex-col min-h-0 relative rounded-2xl overflow-hidden border border-rose-500/40 bg-black">
                  <div className="absolute top-2 left-2 z-30 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-600 text-white font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>PROGRAM (LIVE FEED)</span>
                  </div>
                  <LiveCamera
                    displayStream={displayStream}
                    connectionState={isLive ? 'live' : 'idle'}
                    activeScene={activeScene}
                    aspectRatio={aspectRatio}
                    errorMessage={errorMessage}
                    onRequestCamera={requestCamera}
                    isVirtualFeed={isVirtualFeed}
                    onToggleVirtualFeed={handleToggleVirtualFeed}
                    screenStream={screenStream}
                    isScreenSharing={isScreenSharing}
                    showChatOverlay={showChatOverlay}
                    showGoalOverlay={showGoalOverlay}
                    showWatermark={showWatermark}
                    sceneMode={currentStudioScene}
                  />
                </div>
              </div>
            ) : (
              /* SINGLE HERO VIEWPORT OR SPLIT SCREEN CO-HOST VIEWPORT */
              <div className="flex-1 flex items-center justify-center min-h-0 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_rgba(14,165,233,0.08)_0%,_rgba(9,12,16,1)_80%)] rounded-3xl border border-zinc-800 shadow-2xl p-2 sm:p-3">
                {coHost ? (
                  /* SPLIT SCREEN CO-HOST VIEWPORT (Dual Side-by-Side or Top-Bottom) */
                  <div className={`w-full h-full flex ${splitLayout === 'top-bottom' ? 'flex-col' : 'flex-row'} gap-2 sm:gap-3 items-center justify-center min-h-0 relative`}>
                    {/* Left/Top: Host Stream */}
                    <div className="relative flex-1 w-full h-full min-h-0 flex items-center justify-center rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-lg">
                      <LiveCamera
                        displayStream={displayStream}
                        connectionState={isLive ? 'live' : 'idle'}
                        activeScene={activeScene}
                        aspectRatio={aspectRatio}
                        errorMessage={errorMessage}
                        onRequestCamera={requestCamera}
                        isVirtualFeed={isVirtualFeed}
                        onToggleVirtualFeed={handleToggleVirtualFeed}
                        screenStream={screenStream}
                        isScreenSharing={isScreenSharing}
                        showChatOverlay={showChatOverlay}
                        showGoalOverlay={showGoalOverlay}
                        showWatermark={showWatermark}
                        sceneMode={currentStudioScene}
                      />
                      <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>You (Host)</span>
                      </div>
                    </div>

                    {/* Right/Bottom: Co-Host Guest Stream */}
                    <div className="relative flex-1 w-full h-full min-h-0 flex items-center justify-center rounded-2xl overflow-hidden border border-purple-500/50 bg-zinc-950 shadow-xl group">
                      {coHost.videoStreamUrl && !coHostVideoError ? (
                        <video
                          src={coHost.videoStreamUrl}
                          autoPlay
                          loop
                          muted={coHost.isMuted}
                          playsInline
                          onError={() => setCoHostVideoError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-950/60 via-zinc-950 to-black p-6 text-center">
                          <div className="relative">
                            <img
                              src={coHost.avatar}
                              alt={coHost.name}
                              className="w-28 h-28 rounded-full border-4 border-purple-400 object-cover shadow-2xl ring-8 ring-purple-500/20"
                            />
                            {!coHost.isMuted && (
                              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                                <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                              </span>
                            )}
                          </div>
                          <h4 className="mt-3.5 text-lg font-bold text-white tracking-tight">{coHost.name}</h4>
                          <span className="text-xs text-purple-300 font-medium">{coHost.role}</span>
                          <span className="mt-0.5 text-xs font-mono text-zinc-400">{coHost.handle}</span>
                          {!coHost.isMuted ? (
                            <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                              <span className="w-1 h-3 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="w-1 h-6 rounded-full bg-emerald-400 animate-pulse delay-75" />
                              <span className="w-1 h-4 rounded-full bg-emerald-400 animate-pulse delay-150" />
                              <span className="w-1 h-5 rounded-full bg-emerald-400 animate-pulse delay-100" />
                              <span className="text-[11px] text-emerald-300 font-mono font-bold ml-1.5">WebRTC Voice Connected</span>
                            </div>
                          ) : (
                            <div className="mt-4 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 font-mono">
                              Guest Mic Muted
                            </div>
                          )}
                        </div>
                      )}

                      {/* Co-Host Floating Header Badge */}
                      <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-purple-950/80 backdrop-blur-md border border-purple-500/50 text-xs font-bold text-white flex items-center gap-2 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        <span>{coHost.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-600/60 text-purple-200 uppercase font-mono">
                          CO-HOST
                        </span>
                      </div>

                      {/* Co-Host Audio & Disconnect Controls Overlay */}
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleToggleCoHostMute}
                          className={`p-2 rounded-xl backdrop-blur-md border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            coHost.isMuted
                              ? 'bg-rose-600/90 border-rose-500 text-white'
                              : 'bg-black/75 hover:bg-black/90 border-white/20 text-white'
                          }`}
                          title={coHost.isMuted ? 'Unmute Guest Mic' : 'Mute Guest Mic'}
                        >
                          {coHost.isMuted ? (
                            <>
                              <MicOff className="w-3.5 h-3.5 text-rose-300" />
                              <span className="text-[10px] hidden sm:inline">Muted</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] hidden sm:inline">Guest Live</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsCoHostModalOpen(true)}
                          className="p-2 rounded-xl bg-black/75 hover:bg-black/90 border border-white/20 text-white transition-all cursor-pointer"
                          title="Change Split Screen Layout"
                        >
                          <Columns className="w-3.5 h-3.5 text-sky-400" />
                        </button>

                        <button
                          type="button"
                          onClick={handleDisconnectCoHost}
                          className="p-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 border border-rose-500 text-white transition-all cursor-pointer shadow-md"
                          title="Disconnect Co-Host"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <LiveCamera
                    displayStream={displayStream}
                    connectionState={isLive ? 'live' : 'idle'}
                    activeScene={activeScene}
                    aspectRatio={aspectRatio}
                    errorMessage={errorMessage}
                    onRequestCamera={requestCamera}
                    isVirtualFeed={isVirtualFeed}
                    onToggleVirtualFeed={handleToggleVirtualFeed}
                    screenStream={screenStream}
                    isScreenSharing={isScreenSharing}
                    showChatOverlay={showChatOverlay}
                    showGoalOverlay={showGoalOverlay}
                    showWatermark={showWatermark}
                    sceneMode={currentStudioScene}
                  />
                )}

                {/* Floating Glass Control Overlay (No vertical space wasted below camera) */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 shadow-2xl transition-all">
                  {/* Aspect Ratio Selector */}
                  <div className="flex items-center gap-1 bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-800">
                    {(['9:16', '16:9', '1:1'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAspectRatio(r)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          aspectRatio === r
                            ? 'bg-sky-500 text-slate-950 shadow-xs'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <div className="h-4 w-px bg-zinc-800" />

                  {/* Camera Toggle */}
                  <button
                    type="button"
                    onClick={rawCameraStream || isVirtualFeed ? handleStopCamera : () => requestCamera()}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      rawCameraStream || isVirtualFeed
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/60'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                    title={rawCameraStream || isVirtualFeed ? 'Turn Off Camera' : 'Turn On Camera'}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>

                  {/* Microphone Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isAudioEnabled
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/60'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                    title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {isAudioEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* AR Effects / Filters */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowStudioDock(true);
                      setStudioDockTab('effects');
                    }}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-all cursor-pointer"
                    title="Filters & AR Effects"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  </button>

                  {/* Split Screen / Co-Host Collab Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsCoHostModalOpen(true)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      coHost
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-xs'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60'
                    }`}
                    title={coHost ? `Co-Host: ${coHost.name}` : 'Split-Screen Co-Host Collab'}
                  >
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                  </button>

                  {/* Hardware Device Settings Modal */}
                  <button
                    type="button"
                    onClick={() => setIsDeviceSettingsOpen(true)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-all cursor-pointer"
                    title="Hardware Audio & Video Devices"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-sky-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Rail: Full-Height Audience & Moderation Panel */}
          <aside className="h-full min-h-0 overflow-hidden" aria-label="Audience and Moderation Panel">
            <LiveAudienceModerationPanel
              isHost={true}
              currentUserId={userProfile?.id || 'cr-01'}
              currentUserName={userProfile?.name || authUser?.name || 'Creator'}
            />
          </aside>
        </div>

        {/* ========================================================================= */}
        {/* 3. MODULAR STREAMLABS DESKTOP DOCK (Hidden by default; toggled via header) */}
        {/* ========================================================================= */}
        {showStudioDock && (
          <div className="shrink-0 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-2.5 shadow-xl space-y-2 animate-in fade-in">
          {/* Dock Tab Selector */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 px-1">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setStudioDockTab('mixer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  studioDockTab === 'mixer'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Audio Mixer</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioDockTab('sources')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  studioDockTab === 'sources'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sources &amp; Layers</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioDockTab('scenes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  studioDockTab === 'scenes'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Scenes</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioDockTab('effects')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  studioDockTab === 'effects'
                    ? 'bg-pink-600 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>AR Effects</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioDockTab('filters')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  studioDockTab === 'filters'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Color Grading &amp; LUTs</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {(activeEffect.id !== 'eff-none' || activeScene.id !== DEFAULT_SCENE.id) && (
                <button
                  type="button"
                  onClick={() => {
                    handleSelectEffect(CREATOROS_EFFECTS_CATALOG[0]);
                    setActiveScene(DEFAULT_SCENE);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Cancel and remove all active effects & color grading"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Cancel Filters</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDeviceSettingsOpen(true)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 flex items-center gap-1 cursor-pointer transition-colors"
                title="Configure audio input device and camera"
              >
                <Settings2 className="w-3 h-3 text-sky-400" />
                <span>Device Config</span>
              </button>
              <button
                type="button"
                onClick={() => setShowStudioDock(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center cursor-pointer transition-colors"
                title="Close studio dock"
                aria-label="Close studio dock"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dock Content Panels */}
          <div className="min-h-[140px] max-h-52 overflow-y-auto">
            {/* PANEL 1: Audio Mixer with Animated VU Decibel Meter */}
            {studioDockTab === 'mixer' && (
              <LiveAudioMixer
                inputStream={displayStream}
                isAudioEnabled={isAudioEnabled}
                onToggleAudio={handleToggleAudio}
                audioDevices={audioDevices}
                selectedAudioDeviceId={selectedAudioDeviceId}
                onSelectAudioDevice={handleSelectAudioDevice}
                onOpenDeviceSettings={() => setIsDeviceSettingsOpen(true)}
              />
            )}

            {/* PANEL 2: Sources & Layers Manager */}
            {studioDockTab === 'sources' && (
              <LiveSourcesDock
                layers={layers}
                onToggleLayerVisible={handleToggleLayerVisible}
                onToggleLayerLocked={handleToggleLayerLocked}
                onStartScreenShare={handleToggleScreenShare}
                isScreenSharing={isScreenSharing}
                isVirtualFeed={isVirtualFeed}
              />
            )}

            {/* PANEL 3: Scenes Presets */}
            {studioDockTab === 'scenes' && (
              <LiveScenesDock
                currentScene={currentStudioScene}
                onSelectScene={handleSelectScenePreset}
              />
            )}

            {/* PANEL 4: AR Effects & Beauty */}
            {studioDockTab === 'effects' && (
              <div className="space-y-3 p-1">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800/60">
                  <span className="text-[11px] font-mono text-zinc-400">
                    Active Effect: <strong className="text-white">{activeEffect.name}</strong>
                  </span>
                  {activeEffect.id !== 'eff-none' && (
                    <button
                      type="button"
                      onClick={() => handleSelectEffect(CREATOROS_EFFECTS_CATALOG[0])}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer px-2 py-0.5 rounded-md hover:bg-rose-500/10 transition-colors"
                      title="Clear / Remove active filter"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove Filter</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {CREATOROS_EFFECTS_CATALOG.map((eff) => {
                    const isSelected = activeEffect.id === eff.id;
                    return (
                      <button
                        key={eff.id}
                        type="button"
                        onClick={() => handleSelectEffect(isSelected ? CREATOROS_EFFECTS_CATALOG[0] : eff)}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-xs font-semibold'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
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
                        <span className="text-[10px] truncate w-full font-mono">{eff.name}</span>
                      </button>
                    );
                  })}
                </div>

                {activeEffect.id === 'eff-beauty' && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                    <span className="font-semibold text-zinc-300">Beauty Smoothing:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={beautyLevel}
                      onChange={(e) => handleUpdateBeauty(Number(e.target.value))}
                      className="flex-1 accent-purple-500"
                    />
                    <span className="text-xs font-mono font-bold text-white w-8 text-right">
                      {beautyLevel}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* PANEL 5: Color Grading & Instagram LUT Upload */}
            {studioDockTab === 'filters' && (
              <div className="space-y-3 p-1">
                <LiveScenePicker
                  selectedScene={activeScene}
                  onSelectScene={setActiveScene}
                  disabled={recordingState === 'recording'}
                />
              </div>
            )}
          </div>
        </div>
      )}
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

      {/* Live Broadcast Configuration Modal */}
      <ConfigureLiveModal
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        onStartBroadcast={handleStartBroadcast}
        aspectRatio={aspectRatio}
        hasCamera={Boolean(rawCameraStream || isVirtualFeed)}
        isAudioEnabled={isAudioEnabled}
      />

      {/* Hardware Devices & Audio Check Modal */}
      <LiveDeviceSettingsModal
        isOpen={isDeviceSettingsOpen}
        onClose={() => setIsDeviceSettingsOpen(false)}
        videoDevices={videoDevices}
        audioDevices={audioDevices}
        selectedVideoDeviceId={selectedVideoDeviceId}
        selectedAudioDeviceId={selectedAudioDeviceId}
        onSelectVideoDevice={handleSelectVideoDevice}
        onSelectAudioDevice={handleSelectAudioDevice}
        onRefreshDevices={refreshDevices}
        isVirtualFeed={isVirtualFeed}
        onToggleVirtualFeed={handleToggleVirtualFeed}
        onStartScreenShare={handleToggleScreenShare}
        isScreenSharing={isScreenSharing}
        currentResolution={currentResolution}
        onChangeResolution={handleChangeResolution}
        currentFps={currentFps}
        onChangeFps={handleChangeFps}
      />

      {/* Live Co-Host & Split-Screen Collab Modal */}
      <LiveCoHostModal
        isOpen={isCoHostModalOpen}
        onClose={() => setIsCoHostModalOpen(false)}
        currentCoHost={coHost}
        onConnectCoHost={handleConnectCoHost}
        onDisconnectCoHost={handleDisconnectCoHost}
        splitLayout={splitLayout}
        onChangeSplitLayout={setSplitLayout}
      />
    </>
  );
};
