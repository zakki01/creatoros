import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Info } from 'lucide-react';
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
import { LiveCamera } from './LiveCamera';
import { LiveScenePicker } from './LiveScenePicker';
import { LiveReferencePanel } from './LiveReferencePanel';
import { LiveControls } from './LiveControls';
import { LiveSessionStatus } from './LiveSessionStatus';
import { LiveRecordingPreviewModal } from './LiveRecordingPreviewModal';

export const CreatorLiveStudio: React.FC = () => {
  const [config] = useState(getStoredLiveEngineConfig);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [transformedStream, setTransformedStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<LiveConnectionState>('idle');
  const [activeScene, setActiveScene] = useState<LiveScene>(DEFAULT_SCENE);
  const [referenceImage, setReferenceImage] = useState<LiveReferenceImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cost protection & countdown state
  const [remainingSeconds, setRemainingSeconds] = useState(config.maxSessionDurationSec || 30);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedClip, setRecordedClip] = useState<LiveRecordedClip | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Provider and MediaRecorder refs
  const providerRef = useRef(createLiveAIProvider(config));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<any>(null);
  const recordingIntervalRef = useRef<any>(null);

  // Request camera on mount
  const requestCamera = async () => {
    try {
      setErrorMessage(null);
      setConnectionState('requesting_camera');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: isAudioEnabled,
      });
      setCameraStream(stream);
      setConnectionState('ready');
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser.'
          : 'Unable to access camera device. Check your webcam connection.'
      );
      setConnectionState('error');
    }
  };

  useEffect(() => {
    requestCamera();
    return () => {
      // Clean up camera on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      providerRef.current.disconnect();
      clearInterval(countdownIntervalRef.current);
      clearInterval(recordingIntervalRef.current);
    };
  }, []);

  // Update scene in live provider
  const handleSelectScene = (scene: LiveScene) => {
    setActiveScene(scene);
    if (connectionState === 'live') {
      providerRef.current.updateScene(scene);
    }
  };

  // Update reference image in live provider
  const handleReferenceImageChange = (image: LiveReferenceImage | null) => {
    setReferenceImage(image);
    if (connectionState === 'live') {
      providerRef.current.updateReferenceImage(image?.dataUrl || null);
    }
  };

  // Start / Stop Live AI transformation
  const handleToggleLive = async () => {
    if (connectionState === 'live') {
      // Stop Live
      stopLiveSession();
    } else if (cameraStream) {
      // Start Live
      try {
        setConnectionState('connecting');
        const liveStream = await providerRef.current.connect({
          inputStream: cameraStream,
          scene: activeScene,
          referenceImageDataUrl: referenceImage?.dataUrl,
          aspectRatio,
        });

        setTransformedStream(liveStream);
        setConnectionState('live');
        setRemainingSeconds(config.maxSessionDurationSec || 30);

        // Start countdown timer (cost protection)
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
        console.error('Live connect error:', err);
        setConnectionState('ready');
      }
    }
  };

  const stopLiveSession = async () => {
    clearInterval(countdownIntervalRef.current);
    await providerRef.current.disconnect();
    setTransformedStream(null);
    setConnectionState('ready');
  };

  // Audio mute/unmute
  const handleToggleAudio = () => {
    if (cameraStream) {
      const audioTracks = cameraStream.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !isAudioEnabled));
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Recording
  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const streamToRecord = transformedStream || cameraStream;
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

  const recordingSecondsRef = useRef(0);

  const stopRecording = () => {
    clearInterval(recordingIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const isConfigured = Boolean(config.apiKey && config.apiKey.trim().length > 0);
  const displayStream = transformedStream || cameraStream;

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 font-display">
              Live Creator Engine
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Decart Powered
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Realtime AI camera transformation for TikTok, Reels & campaign deliverables.
          </p>
        </div>
      </div>

      {/* Unconfigured Decart Notice (Self-hosted commercial clarity) */}
      {!isConfigured && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Decart Live Engine running in local Preview Mode. Configure your Decart API Key in Business Settings for full cloud inference.
            </span>
          </div>
        </div>
      )}

      {/* Top Status & Cost Protection Bar */}
      <LiveSessionStatus
        connectionState={connectionState}
        isProviderConfigured={isConfigured}
        remainingSeconds={remainingSeconds}
        maxDurationSeconds={config.maxSessionDurationSec || 30}
        isRecording={isRecording}
        recordingSeconds={recordingSeconds}
      />

      {/* Main Studio Viewport & Side Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Center/Left: Live Camera Viewport */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
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

        {/* Right: Scene Picker & Reference Panel */}
        <div className="lg:col-span-5 space-y-5">
          <LiveScenePicker
            selectedScene={activeScene}
            onSelectScene={handleSelectScene}
            disabled={isRecording}
          />

          <LiveReferencePanel
            referenceImage={referenceImage}
            onReferenceImageChange={handleReferenceImageChange}
            disabled={isRecording}
          />

          {/* Quick Tips */}
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2 text-xs text-zinc-400">
            <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Studio Pro-Tips</span>
            </div>
            <ul className="space-y-1 text-[11px] text-zinc-400 list-disc list-inside">
              <li>Record 5 to 15-second clips for optimal social media hook retention.</li>
              <li>Switch scenes dynamically to test cinematic looks before recording.</li>
              <li>Submitting clips connects directly to brand campaigns with AI pre-checks.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recorded Clip Preview & Submit Modal */}
      <LiveRecordingPreviewModal
        clip={recordedClip}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
