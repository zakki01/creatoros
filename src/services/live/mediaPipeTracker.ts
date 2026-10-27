/**
 * MediaPipe Face Landmarker Tracker Implementation
 * 
 * Production default face tracker for CreatorOS.
 * Backed by @mediapipe/tasks-vision (WebAssembly + WebGL GPU delegate).
 * Computes 478 3D normalized landmarks, real head rotation (roll atan2, pitch, yaw),
 * dynamic inter-ocular eye distance, and anchors for accessories.
 */

import { IFaceTracker, FaceTrackerEngineType, FaceTrackerStatus, FaceTrackerResult } from './faceTrackerTypes';
import { mediaPipeLandmarkerSingleton, MediaPipeLandmarkerService } from './mediaPipeLandmarker';

export class MediaPipeTracker implements IFaceTracker {
  private service: MediaPipeLandmarkerService;
  private status: FaceTrackerStatus = 'uninitialized';
  private lastResult: FaceTrackerResult | null = null;

  constructor() {
    this.service = mediaPipeLandmarkerSingleton;
  }

  public getEngineType(): FaceTrackerEngineType {
    return 'mediapipe';
  }

  public getStatus(): FaceTrackerStatus {
    const arState = this.service.getARState();
    if (arState === 'ar_unavailable') return 'unavailable';
    if (arState === 'ar_initializing') return 'initializing';
    if (arState === 'face_detected') return 'tracking';
    if (arState === 'ar_ready' || arState === 'face_not_detected') return 'ready';
    return this.status;
  }

  public async init(): Promise<boolean> {
    this.status = 'initializing';
    try {
      const ok = await this.service.init();
      this.status = ok ? 'ready' : 'unavailable';
      return ok;
    } catch (err) {
      console.warn('[MediaPipeTracker] Init failed:', err);
      this.status = 'error';
      return false;
    }
  }

  public detect(video: HTMLVideoElement, timestamp?: number): FaceTrackerResult | null {
    const startTime = performance.now();
    const landmarks = this.service.detectVideoFrame(video, timestamp);
    const inferenceTimeMs = performance.now() - startTime;

    if (!landmarks) {
      if (this.lastResult && !landmarks) {
        this.lastResult = null;
      }
      return null;
    }

    this.lastResult = {
      ...landmarks,
      engineType: 'mediapipe',
      inferenceTimeMs,
    };

    return this.lastResult;
  }

  public getLastResult(): FaceTrackerResult | null {
    return this.lastResult;
  }

  public destroy(): void {
    this.service.destroy();
    this.status = 'uninitialized';
    this.lastResult = null;
  }
}
