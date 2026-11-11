/**
 * CreatorOS Virtual Studio Camera Feed
 * 
 * Generates an authentic, high-definition simulated video & audio MediaStream
 * for Creator Studio when physical webcam access is unavailable or in sandbox mode.
 * 
 * Features:
 * 1. 30 FPS HTML5 Canvas pipeline with spatial studio lighting & ambient particles.
 * 2. Stylized animated creator avatar with natural breathing, head sway, blinking eyes, and dynamic mouth motion.
 * 3. Synthetic face landmarks synchronized with avatar motion, so MediaPipe AR effects
 *    (Sovereign Crown, Cyber Visor, Starlight Blush, Cyber Pulse Aura, Studio Beauty)
 *    anchor, scale, and render procedurally in real-time.
 * 4. Synthetic microphone audio stream (clean ambient studio tone) so recording & audio meters operate.
 */

import { FaceLandmarks, AspectRatio } from '../../types';

export class VirtualStudioFeed {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private stream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private isRunning: boolean = false;
  private aspectRatio: AspectRatio = '9:16';
  private frameCount: number = 0;

  // Real-time animated landmark coordinates
  private currentLandmarks: FaceLandmarks = {
    detected: true,
    confidence: 0.98,
    faceBox: { x: 0.25, y: 0.2, width: 0.5, height: 0.6 },
    forehead: { x: 360, y: 320, z: 0 },
    leftEye: { x: 290, y: 420, z: -5 },
    rightEye: { x: 430, y: 420, z: -5 },
    eyeCenter: { x: 360, y: 420 },
    nose: { x: 360, y: 470, z: -25 },
    leftCheek: { x: 270, y: 520, z: -10 },
    rightCheek: { x: 450, y: 520, z: -10 },
    mouth: { x: 360, y: 580, z: 5 },
    chin: { x: 360, y: 680, z: 15 },
    pitch: 0,
    yaw: 0,
    roll: 0,
    eyeDistance: 140,
  };

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 720;
    this.canvas.height = 1280;
    this.ctx = this.canvas.getContext('2d', { alpha: false })!;
  }

  public start(aspectRatio: AspectRatio = '9:16'): MediaStream {
    this.stop();
    this.aspectRatio = aspectRatio;
    this.updateCanvasDimensions();
    this.isRunning = true;
    this.frameCount = 0;

    // Capture 30 FPS video track
    const canvasStream = this.canvas.captureStream(30);

    // Generate ambient studio audio track via Web Audio API
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const dest = this.audioCtx.createMediaStreamDestination();

        // Very subtle studio room tone (sub-audible 40Hz with tiny gain so meters register activity)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(40, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);

        osc.connect(gain);
        gain.connect(dest);
        osc.start();

        dest.stream.getAudioTracks().forEach((track) => {
          canvasStream.addTrack(track);
        });
      }
    } catch (e) {
      console.warn('[VirtualStudioFeed] AudioContext initialization skipped:', e);
    }

    this.stream = canvasStream;
    this.renderLoop();
    return this.stream;
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }

  public setAspectRatio(aspect: AspectRatio): void {
    if (this.aspectRatio !== aspect) {
      this.aspectRatio = aspect;
      this.updateCanvasDimensions();
    }
  }

  public getLandmarks(): FaceLandmarks {
    return this.currentLandmarks;
  }

  public getStream(): MediaStream | null {
    return this.stream;
  }

  private updateCanvasDimensions(): void {
    if (this.aspectRatio === '16:9') {
      this.canvas.width = 1280;
      this.canvas.height = 720;
    } else if (this.aspectRatio === '1:1') {
      this.canvas.width = 720;
      this.canvas.height = 720;
    } else {
      this.canvas.width = 720;
      this.canvas.height = 1280;
    }
  }

  private renderLoop = () => {
    if (!this.isRunning) return;

    this.frameCount++;
    const t = this.frameCount * 0.03;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Head kinematics (natural subtle sway & breathing)
    const swayX = Math.sin(t * 0.8) * 12;
    const swayY = Math.cos(t * 0.6) * 6;
    const breathe = Math.sin(t * 1.2) * 4;
    const headRoll = Math.sin(t * 0.5) * 0.04;

    const centerX = w / 2 + swayX;
    const centerY = (this.aspectRatio === '16:9' ? h * 0.52 : h * 0.44) + swayY;
    const faceRadius = (this.aspectRatio === '16:9' ? 140 : 170) + breathe;

    // 1. Studio Backdrop (Dynamic Gradient + Ambient Lighting)
    const bgGrad = ctx.createRadialGradient(w / 2, h * 0.35, 50, w / 2, h / 2, Math.max(w, h));
    bgGrad.addColorStop(0, '#13233A');
    bgGrad.addColorStop(0.5, '#0B1522');
    bgGrad.addColorStop(1, '#050A10');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Studio Accent Keylight Rim (Vibrant Magenta & Cyan Glow)
    const rimGrad = ctx.createRadialGradient(w * 0.2, h * 0.25, 20, w * 0.2, h * 0.25, w * 0.6);
    rimGrad.addColorStop(0, 'rgba(16, 91, 255, 0.25)');
    rimGrad.addColorStop(1, 'rgba(16, 91, 255, 0)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, 0, w, h);

    const rimRight = ctx.createRadialGradient(w * 0.8, h * 0.25, 20, w * 0.8, h * 0.25, w * 0.6);
    rimRight.addColorStop(0, 'rgba(255, 119, 188, 0.20)');
    rimRight.addColorStop(1, 'rgba(255, 119, 188, 0)');
    ctx.fillStyle = rimRight;
    ctx.fillRect(0, 0, w, h);

    // Floating Bokeh Orbs in Background
    for (let i = 0; i < 5; i++) {
      const orbX = (w * 0.15 * i + Math.sin(t * 0.4 + i) * 30 + w * 0.2) % w;
      const orbY = (h * 0.18 * i + Math.cos(t * 0.3 + i * 2) * 20 + h * 0.15) % h;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 18 + i * 8, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(16, 91, 255, 0.12)' : 'rgba(255, 119, 188, 0.10)';
      ctx.fill();
    }

    // 2. Creator Shoulders / Studio Silhouette
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(headRoll * 0.3);

    const shoulderY = faceRadius * 1.25;
    const shoulderGrad = ctx.createLinearGradient(0, shoulderY, 0, shoulderY + 300);
    shoulderGrad.addColorStop(0, '#1E293B');
    shoulderGrad.addColorStop(1, '#0F172A');

    ctx.beginPath();
    ctx.ellipse(0, shoulderY + 80, faceRadius * 1.8, 110, 0, 0, Math.PI * 2);
    ctx.fillStyle = shoulderGrad;
    ctx.fill();

    // Studio Shirt Collar Line
    ctx.beginPath();
    ctx.moveTo(-faceRadius * 0.4, shoulderY + 15);
    ctx.quadraticCurveTo(0, shoulderY + 55, faceRadius * 0.4, shoulderY + 15);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Neck
    ctx.beginPath();
    ctx.rect(-faceRadius * 0.3, faceRadius * 0.6, faceRadius * 0.6, faceRadius * 0.7);
    ctx.fillStyle = '#E2B195';
    ctx.fill();

    // 3. Creator Face & Head
    ctx.rotate(headRoll * 0.7);

    // Stylized Face Shadow & Base
    ctx.beginPath();
    ctx.ellipse(0, 0, faceRadius * 0.82, faceRadius, 0, 0, Math.PI * 2);
    const skinGrad = ctx.createLinearGradient(-faceRadius * 0.5, -faceRadius, faceRadius * 0.5, faceRadius);
    skinGrad.addColorStop(0, '#FCD3B8');
    skinGrad.addColorStop(0.6, '#F5BE9E');
    skinGrad.addColorStop(1, '#E29F78');
    ctx.fillStyle = skinGrad;
    ctx.fill();

    // Hair
    ctx.beginPath();
    ctx.ellipse(0, -faceRadius * 0.65, faceRadius * 0.88, faceRadius * 0.55, 0, Math.PI, Math.PI * 2);
    ctx.fillStyle = '#1E1B18';
    ctx.fill();

    // Eyes with Natural Blinking Animation
    // Blink every ~3.5 seconds
    const blinkCycle = (this.frameCount % 110);
    const isBlinking = blinkCycle > 103;
    const eyeHeight = isBlinking ? 2 : 12;

    const leftEyeX = -faceRadius * 0.34;
    const rightEyeX = faceRadius * 0.34;
    const eyeY = -faceRadius * 0.12;

    // Eyeballs / lashes
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, 14, eyeHeight, 0, 0, Math.PI * 2);
    ctx.ellipse(rightEyeX, eyeY, 14, eyeHeight, 0, 0, Math.PI * 2);
    ctx.fillStyle = isBlinking ? '#475569' : '#FFFFFF';
    ctx.fill();

    if (!isBlinking) {
      // Irises (Dark Cocoa)
      ctx.beginPath();
      ctx.arc(leftEyeX + Math.sin(t * 0.5) * 2, eyeY, 7, 0, Math.PI * 2);
      ctx.arc(rightEyeX + Math.sin(t * 0.5) * 2, eyeY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#2B1700';
      ctx.fill();

      // Catchlights
      ctx.beginPath();
      ctx.arc(leftEyeX + 3, eyeY - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(rightEyeX + 3, eyeY - 2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    // Eyebrows
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#27221E';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(leftEyeX - 16, eyeY - 18);
    ctx.quadraticCurveTo(leftEyeX, eyeY - 24, leftEyeX + 16, eyeY - 17);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightEyeX - 16, eyeY - 17);
    ctx.quadraticCurveTo(rightEyeX, eyeY - 24, rightEyeX + 16, eyeY - 18);
    ctx.stroke();

    // Nose
    ctx.beginPath();
    ctx.moveTo(0, -faceRadius * 0.05);
    ctx.quadraticCurveTo(7, faceRadius * 0.16, 0, faceRadius * 0.22);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#C98561';
    ctx.stroke();

    // Cheeks (Subtle Natural Blush)
    ctx.beginPath();
    ctx.arc(leftEyeX - 4, faceRadius * 0.18, 20, 0, Math.PI * 2);
    ctx.arc(rightEyeX + 4, faceRadius * 0.18, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.18)';
    ctx.fill();

    // Mouth / Smile (Animated with subtle talking cadence)
    const mouthOpen = Math.abs(Math.sin(t * 2)) * 5;
    ctx.beginPath();
    ctx.moveTo(-faceRadius * 0.22, faceRadius * 0.44);
    ctx.quadraticCurveTo(0, faceRadius * 0.44 + 8 + mouthOpen, faceRadius * 0.22, faceRadius * 0.44);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#9F1239';
    ctx.stroke();

    ctx.restore();

    // 4. Update Synthetic Face Landmarks for AR Tracking Integration
    this.currentLandmarks = {
      detected: true,
      confidence: 0.98,
      faceBox: {
        x: (centerX - faceRadius * 0.8) / w,
        y: (centerY - faceRadius) / h,
        width: (faceRadius * 1.6) / w,
        height: (faceRadius * 2) / h,
      },
      forehead: {
        x: centerX,
        y: centerY - faceRadius * 0.72,
        z: 0,
      },
      leftEye: {
        x: centerX - faceRadius * 0.34,
        y: centerY - faceRadius * 0.12,
        z: -5,
      },
      rightEye: {
        x: centerX + faceRadius * 0.34,
        y: centerY - faceRadius * 0.12,
        z: -5,
      },
      eyeCenter: {
        x: centerX,
        y: centerY - faceRadius * 0.12,
      },
      nose: {
        x: centerX,
        y: centerY + faceRadius * 0.18,
        z: -25,
      },
      leftCheek: {
        x: centerX - faceRadius * 0.48,
        y: centerY + faceRadius * 0.18,
        z: -10,
      },
      rightCheek: {
        x: centerX + faceRadius * 0.48,
        y: centerY + faceRadius * 0.18,
        z: -10,
      },
      mouth: {
        x: centerX,
        y: centerY + faceRadius * 0.46,
        z: 5,
      },
      chin: {
        x: centerX,
        y: centerY + faceRadius * 0.95,
        z: 15,
      },
      pitch: swayY * 0.01,
      yaw: swayX * 0.01,
      roll: headRoll,
      eyeDistance: faceRadius * 0.68,
    };

    // 5. Watermark Studio HUD Badge
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.roundRect(16, h - 42, 185, 26, 13);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#105BFF';
    ctx.beginPath();
    ctx.arc(28, h - 29, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText('VIRTUAL STUDIO CAMERA', 38, h - 25);
    ctx.restore();

    this.animFrameId = requestAnimationFrame(this.renderLoop);
  };
}

export const virtualStudioFeedSingleton = new VirtualStudioFeed();
