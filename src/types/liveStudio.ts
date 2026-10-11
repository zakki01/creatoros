export type AspectRatio = '9:16' | '16:9' | '1:1';

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
  provider: 'decart' | 'mock';
  apiKey: string;
  apiEndpoint: string;
  defaultModel: string;
  maxSessionDurationSec: number;
  enableAudio: boolean;
  defaultFps: number;
}
