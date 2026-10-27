/**
 * CreatorOS Realtime Recording Service
 * 
 * Works 100% independently of LiveKit.
 * Records the single processed MediaStream (containing camera video, active AR, and microphone audio).
 * If AR is unavailable, falls back cleanly to recording the raw camera stream.
 */

import { LiveRecordedClip, RecordingState, AspectRatio, LiveSceneId } from '../../types';

export class LiveRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private recordingStartTime = 0;
  private recordingTimer: number | null = null;
  private state: RecordingState = 'recording_idle';
  private stateListeners = new Set<(state: RecordingState, seconds: number) => void>();
  private elapsedSeconds = 0;
  private lastClip: LiveRecordedClip | null = null;

  public getState(): RecordingState {
    return this.state;
  }

  public getElapsedSeconds(): number {
    return this.elapsedSeconds;
  }

  public getLastClip(): LiveRecordedClip | null {
    return this.lastClip;
  }

  public subscribe(listener: (state: RecordingState, seconds: number) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.state, this.elapsedSeconds);
    return () => this.stateListeners.delete(listener);
  }

  private setState(newState: RecordingState) {
    this.state = newState;
    this.stateListeners.forEach((fn) => fn(this.state, this.elapsedSeconds));
  }

  /**
   * Starts recording the provided stream (processed or raw camera)
   */
  public start(stream: MediaStream): boolean {
    if (this.state === 'recording') {
      console.warn('[LiveRecordingService] Already recording');
      return false;
    }

    if (!stream || stream.getVideoTracks().length === 0) {
      this.setState('recording_error');
      console.error('[LiveRecordingService] Cannot record: Stream contains no active video tracks');
      return false;
    }

    this.recordedChunks = [];
    this.elapsedSeconds = 0;

    // Determine optimal supported MIME type
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ];
    let selectedMime = '';
    for (const mime of mimeTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    try {
      const options: MediaRecorderOptions = selectedMime ? { mimeType: selectedMime } : {};
      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (err) => {
        console.error('[LiveRecordingService] MediaRecorder error:', err);
        this.stopTimer();
        this.setState('recording_error');
      };

      this.mediaRecorder.start(1000); // 1-second chunks
      this.recordingStartTime = Date.now();
      this.setState('recording');

      // Start elapsed seconds ticker
      this.recordingTimer = window.setInterval(() => {
        this.elapsedSeconds = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        this.stateListeners.forEach((fn) => fn(this.state, this.elapsedSeconds));
      }, 1000);

      return true;
    } catch (err) {
      console.error('[LiveRecordingService] Failed to initialize MediaRecorder:', err);
      this.setState('recording_error');
      return false;
    }
  }

  /**
   * Stops the active recording session and packages the final LiveRecordedClip
   */
  public async stop(options: {
    aspectRatio?: AspectRatio;
    sceneId?: LiveSceneId;
    sceneName?: string;
  } = {}): Promise<LiveRecordedClip | null> {
    if (this.state !== 'recording' || !this.mediaRecorder) {
      return this.lastClip;
    }

    this.stopTimer();

    return new Promise<LiveRecordedClip | null>((resolve) => {
      if (!this.mediaRecorder) {
        this.setState('recording_idle');
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'video/webm';
        const finalBlob = new Blob(this.recordedChunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(finalBlob);

        const clip: LiveRecordedClip = {
          id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          blob: finalBlob,
          url: videoUrl,
          durationSec: Math.max(1, this.elapsedSeconds),
          aspectRatio: options.aspectRatio || '9:16',
          sceneId: options.sceneId || 'cinematic',
          sceneName: options.sceneName || 'Live Studio Broadcast',
          createdAt: new Date().toISOString(),
        };

        this.lastClip = clip;
        this.setState('recording_ready');
        resolve(clip);
      };

      try {
        this.mediaRecorder.stop();
      } catch (err) {
        console.error('[LiveRecordingService] Error stopping recorder:', err);
        this.setState('recording_error');
        resolve(null);
      }
    });
  }

  private stopTimer() {
    if (this.recordingTimer !== null) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  public reset(): void {
    this.stopTimer();
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {}
    }
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.elapsedSeconds = 0;
    this.lastClip = null;
    this.setState('recording_idle');
  }
}

export const liveRecordingSingleton = new LiveRecordingService();
