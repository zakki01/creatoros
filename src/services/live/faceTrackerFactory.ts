/**
 * CreatorOS Face Tracker Factory
 * 
 * Factory responsible for providing the appropriate IFaceTracker implementation.
 * Defaults to MediaPipeTracker (478-point 3D landmark mesh).
 * Supports JeelizTrackerAdapter as an alternative engine.
 */

import { IFaceTracker, FaceTrackerEngineType } from './faceTrackerTypes';
import { MediaPipeTracker } from './mediaPipeTracker';
import { JeelizTrackerAdapter } from './jeelizTrackerAdapter';

export class FaceTrackerFactory {
  private static mediapipeInstance: MediaPipeTracker | null = null;
  private static jeelizInstance: JeelizTrackerAdapter | null = null;
  private static activeEngine: FaceTrackerEngineType = 'mediapipe';

  public static getTracker(engine: FaceTrackerEngineType = this.activeEngine): IFaceTracker {
    if (engine === 'jeeliz') {
      if (!this.jeelizInstance) {
        this.jeelizInstance = new JeelizTrackerAdapter();
      }
      return this.jeelizInstance;
    }

    if (!this.mediapipeInstance) {
      this.mediapipeInstance = new MediaPipeTracker();
    }
    return this.mediapipeInstance;
  }

  public static setActiveEngine(engine: FaceTrackerEngineType): void {
    this.activeEngine = engine;
  }

  public static getActiveEngine(): FaceTrackerEngineType {
    return this.activeEngine;
  }
}
