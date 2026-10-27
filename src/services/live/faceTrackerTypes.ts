/**
 * CreatorOS Face Tracker Core Types & Interface Contract
 * 
 * Provides an authoritative, decoupled tracker abstraction supporting:
 * - MediaPipe Face Landmarker (Default, 478-point 3D mesh)
 * - Jeeliz FaceFilter (Adapter / evaluation target)
 */

import { FaceLandmarks } from '../../types';

export type FaceTrackerEngineType = 'mediapipe' | 'jeeliz';

export type FaceTrackerStatus = 
  | 'uninitialized'
  | 'initializing'
  | 'ready'
  | 'tracking'
  | 'error'
  | 'unavailable';

export interface FaceTrackerResult extends FaceLandmarks {
  engineType: FaceTrackerEngineType;
  inferenceTimeMs?: number;
}

export interface IFaceTracker {
  getEngineType(): FaceTrackerEngineType;
  getStatus(): FaceTrackerStatus;
  init(video?: HTMLVideoElement): Promise<boolean>;
  detect(video: HTMLVideoElement, timestamp?: number): FaceTrackerResult | null;
  getLastResult(): FaceTrackerResult | null;
  destroy(): void;
}
