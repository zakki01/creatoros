export type AspectRatio = '9:16' | '16:9' | '1:1';

// Subsystem Explicit State Enums (Strictly Decoupled)
export type CameraState =
  | 'camera_idle'
  | 'camera_requesting'
  | 'camera_ready'
  | 'camera_error';

export type ARState =
  | 'ar_initializing'
  | 'ar_ready'
  | 'ar_unavailable'
  | 'face_detected'
  | 'face_not_detected';

export type RecordingState =
  | 'recording_idle'
  | 'recording'
  | 'recording_ready'
  | 'recording_error';

export type TransportState =
  | 'transport_unconfigured'
  | 'transport_connecting'
  | 'transport_live'
  | 'transport_error'
  | 'transport_disconnected';

export type ARTrackerStatus = 'unavailable' | 'initializing' | 'ready' | 'error';

export interface ARTrackingState {
  status: ARTrackerStatus;
  faceDetected: boolean;
  confidence: number;
  landmarks: FaceLandmarks | null;
}

export type HonestNetworkStatus =
  | 'Connecting'
  | 'Live'
  | 'Reconnecting'
  | 'Poor connection'
  | 'Disconnected';

export interface FaceLandmarks {
  detected: boolean;
  confidence: number;
  faceBox: { x: number; y: number; width: number; height: number };
  forehead: { x: number; y: number; z?: number };
  leftEye: { x: number; y: number; z?: number };
  rightEye: { x: number; y: number; z?: number };
  eyeCenter: { x: number; y: number };
  nose: { x: number; y: number; z?: number };
  leftCheek: { x: number; y: number; z?: number };
  rightCheek: { x: number; y: number; z?: number };
  mouth: { x: number; y: number; z?: number };
  chin: { x: number; y: number; z?: number };
  roll: number; // Head tilt in radians
  pitch: number;
  yaw: number;
  eyeDistance: number;
  rawPoints?: Array<{ x: number; y: number; z: number }>;
}

export interface EffectDefinition {
  id: string;
  name: string;
  tagline: string;
  category: 'clean' | 'beauty' | 'accessory' | 'animated';
  thumbnailUrl?: string;
  isAvailable: boolean;
  unavailableReason?: string;
}

export type LiveSceneId =
  | 'cinematic'
  | 'cyberpunk'
  | 'luxury'
  | 'fashion'
  | 'music_video'
  | 'gaming';

export interface SceneFilterStyle {
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  sepia: number;
  tintRgb?: string;
}

export interface LiveScene {
  id: LiveSceneId;
  name: string;
  tagline: string;
  description: string;
  prompt: string;
  accentColor: string;
  bgGradient: string;
  thumbnailUrl?: string;
  tags: string[];
  filterStyle: SceneFilterStyle;
}

export interface LiveReferenceImage {
  id: string;
  name: string;
  dataUrl: string;
  uploadedAt: string;
}

export type LiveConnectionState =
  | 'idle'
  | 'requesting_camera'
  | 'ready'
  | 'connecting'
  | 'live'
  | 'paused'
  | 'error';

export type LiveRecordingState = 'idle' | 'recording' | 'previewing';

export interface LiveRecordedClip {
  id: string;
  blob: Blob;
  url: string;
  durationSec: number;
  aspectRatio: AspectRatio;
  sceneId: LiveSceneId;
  sceneName: string;
  createdAt: string;
}

export interface LiveProviderCapabilities {
  supportsRealtimeTransformation: boolean;
  supportsReferenceImage: boolean;
  supportsAudio: boolean;
  supportedAspectRatios: AspectRatio[];
  maxDurationSeconds: number;
  models: string[];
}

export interface LiveConnectOptions {
  inputStream: MediaStream;
  scene: LiveScene;
  referenceImageDataUrl?: string | null;
  aspectRatio: AspectRatio;
}

export interface ILiveAIProvider {
  readonly id: string;
  readonly name: string;
  isConfigured(): boolean;
  getCapabilities(): LiveProviderCapabilities;
  connect(options: LiveConnectOptions): Promise<MediaStream>;
  disconnect(): Promise<void>;
  updateScene(scene: LiveScene): Promise<void>;
  updateReferenceImage(dataUrl: string | null): Promise<void>;
}

export interface LiveEngineConfig {
  enabled: boolean;
  provider: 'decart' | 'livekit' | 'webrtc' | 'mock';
  apiKey: string;
  apiEndpoint: string;
  defaultModel: string;
  maxSessionDurationSec: number;
  enableAudio: boolean;
  defaultFps: number;
}

export type ArEffectType =
  | 'face_mask'
  | 'face_decoration'
  | 'animated_face'
  | 'beauty_filter'
  | 'background'
  | 'color_lut'
  | 'accessory_3d';

export interface ArEffect {
  id: string;
  creatorId?: string;
  name: string;
  description: string;
  thumbnail: string;
  previewUrl?: string;
  assets: {
    textureUrl?: string;
    model3dUrl?: string;
    lutUrl?: string;
    renderEngine?: string;
  };
  type: ArEffectType;
  version: string;
  status: 'active' | 'archived';
  moderationStatus: 'approved' | 'pending' | 'flagged';
  performanceTier: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface LiveParticipant {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'host' | 'guest' | 'viewer' | 'moderator';
  isMuted: boolean;
  isBanned: boolean;
  joinedAt: string;
}

export interface LiveChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'chat' | 'gift' | 'system' | 'moderation';
  giftIcon?: string;
  giftName?: string;
  timestamp: string;
}

export type NetworkQuality = 'excellent' | 'good' | 'poor' | 'reconnecting';
