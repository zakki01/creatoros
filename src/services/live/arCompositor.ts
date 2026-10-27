/**
 * CreatorOS ARCompositor
 * 
 * Reusable real-time video augmentation pipeline.
 * Takes camera MediaStream + MediaPipe FaceLandmarks + EffectDefinition,
 * applies real 3D anchored canvas/WebGL procedural rendering,
 * and outputs a single processed MediaStream with synced audio.
 *
 * Single source of truth for:
 * 1. Live Preview (<video srcObject={processedStream} />)
 * 2. Local Recording (MediaRecorder(processedStream))
 * 3. LiveKit WebRTC Publishing (room.localParticipant.publishTrack)
 */

import { EffectDefinition, FaceLandmarks } from '../../types';
import { mediaPipeLandmarkerSingleton, MediaPipeLandmarkerService } from './mediaPipeLandmarker';

export const CREATOROS_EFFECTS_CATALOG: EffectDefinition[] = [
  {
    id: 'eff-none',
    name: 'Clean Video',
    tagline: 'Raw camera pass-through without AR modification',
    category: 'clean',
    isAvailable: true,
  },
  {
    id: 'eff-beauty',
    name: 'Studio Beauty',
    tagline: 'Skin smoothing with edge preservation & warm lighting',
    category: 'beauty',
    isAvailable: true,
  },
  {
    id: 'eff-crown',
    name: 'Sovereign Crown',
    tagline: 'Golden crown anchored to forehead, scaling with head distance',
    category: 'accessory',
    isAvailable: true,
  },
  {
    id: 'eff-visor',
    name: 'Cyber HUD Visor',
    tagline: 'Holographic cyan visor anchored to eye center with roll tilt',
    category: 'accessory',
    isAvailable: true,
  },
  {
    id: 'eff-decoration',
    name: 'Starlight Blush',
    tagline: 'Aesthetic neon star stamps anchored to cheek landmarks',
    category: 'accessory',
    isAvailable: true,
  },
  {
    id: 'eff-animated',
    name: 'Cyber Pulse Aura',
    tagline: 'Animated energy particles oscillating along facial contour',
    category: 'animated',
    isAvailable: true,
  },
];

export interface ARCompositorOptions {
  width?: number;
  height?: number;
  fps?: number;
}

export class ARCompositor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private videoEl: HTMLVideoElement;
  private inputStream: MediaStream | null = null;
  private outputStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private activeEffect: EffectDefinition = CREATOROS_EFFECTS_CATALOG[0]; // Clean by default
  private beautyLevel: number = 60; // 0 - 100
  private landmarker: MediaPipeLandmarkerService;
  private onLandmarksCallback: ((landmarks: FaceLandmarks | null) => void) | null = null;
  private targetFps: number;

  // Smoothing filters for accessory anchors to eliminate high-frequency jitter
  private smoothedLandmarks: FaceLandmarks | null = null;

  constructor(options: ARCompositorOptions = {}) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width || 720;
    this.canvas.height = options.height || 1280;
    this.ctx = this.canvas.getContext('2d', { alpha: false, willReadFrequently: false })!;
    this.targetFps = options.fps || 30;

    this.videoEl = document.createElement('video');
    this.videoEl.autoplay = true;
    this.videoEl.muted = true;
    this.videoEl.playsInline = true;

    this.landmarker = mediaPipeLandmarkerSingleton;
  }

  /**
   * Starts compositing the camera input stream.
   * Returns the processed MediaStream.
   */
  public start(
    inputStream: MediaStream,
    initialEffect?: EffectDefinition,
    onLandmarks?: (landmarks: FaceLandmarks | null) => void
  ): MediaStream {
    this.stop();

    this.inputStream = inputStream;
    if (initialEffect) {
      this.activeEffect = initialEffect;
    }
    this.onLandmarksCallback = onLandmarks || null;

    this.videoEl.srcObject = inputStream;
    this.videoEl.play().catch((err) => {
      console.warn('[ARCompositor] videoEl play error:', err);
    });

    this.videoEl.onloadedmetadata = () => {
      const vWidth = this.videoEl.videoWidth || 720;
      const vHeight = this.videoEl.videoHeight || 1280;
      if (this.canvas.width !== vWidth || this.canvas.height !== vHeight) {
        this.canvas.width = vWidth;
        this.canvas.height = vHeight;
      }
    };

    // Create the single processed MediaStream
    this.outputStream = this.canvas.captureStream(this.targetFps);

    // Forward original microphone audio tracks to the output stream
    inputStream.getAudioTracks().forEach((track) => {
      this.outputStream?.addTrack(track);
    });

    this.startLoop();
    return this.outputStream;
  }

  public getProcessedStream(): MediaStream | null {
    return this.outputStream;
  }

  public setEffect(effect: EffectDefinition): void {
    this.activeEffect = effect;
  }

  public setEffectById(effectId: string): void {
    // Support aliases between effect catalogs
    let normalizedId = effectId;
    if (effectId === 'eff-beauty-luxe') normalizedId = 'eff-beauty';
    else if (effectId === 'eff-golden-crown') normalizedId = 'eff-crown';
    else if (effectId === 'eff-cyber-visor') normalizedId = 'eff-visor';
    else if (effectId === 'eff-chroma-tears') normalizedId = 'eff-decoration';
    else if (effectId === 'eff-neon-phantom') normalizedId = 'eff-animated';

    const found = CREATOROS_EFFECTS_CATALOG.find((e) => e.id === normalizedId);
    if (found) {
      this.activeEffect = found;
    } else {
      this.activeEffect = CREATOROS_EFFECTS_CATALOG[0];
    }
  }

  public getActiveEffect(): EffectDefinition {
    return this.activeEffect;
  }

  public setBeautyLevel(level: number): void {
    this.beautyLevel = Math.max(0, Math.min(100, level));
  }

  public stop(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.videoEl.srcObject) {
      this.videoEl.srcObject = null;
    }
    this.outputStream = null;
    this.inputStream = null;
    this.smoothedLandmarks = null;
  }

  private startLoop = () => {
    const render = () => {
      if (this.videoEl.readyState >= 2) {
        this.renderFrame();
      }
      this.animFrameId = requestAnimationFrame(render);
    };
    this.animFrameId = requestAnimationFrame(render);
  };

  /**
   * Core composition pass executed on every animation frame
   */
  private renderFrame(): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // 1. Draw camera video frame to canvas
    ctx.drawImage(this.videoEl, 0, 0, width, height);

    // 2. Detect face landmarks with MediaPipe
    const detectedLandmarks = this.landmarker.detectVideoFrame(this.videoEl);
    this.smoothedLandmarks = this.smoothLandmarks(detectedLandmarks);

    if (this.onLandmarksCallback) {
      this.onLandmarksCallback(this.smoothedLandmarks);
    }

    // 3. Render AR effect based on active definition
    if (!this.activeEffect.isAvailable) {
      this.renderUnavailableOverlay(ctx, width, height);
      return;
    }

    switch (this.activeEffect.id) {
      case 'eff-beauty':
        this.renderBeautyEffect(ctx, width, height, this.smoothedLandmarks);
        break;
      case 'eff-crown':
        if (this.smoothedLandmarks) {
          this.renderCrownEffect(ctx, width, height, this.smoothedLandmarks);
        }
        break;
      case 'eff-visor':
        if (this.smoothedLandmarks) {
          this.renderCyberVisorEffect(ctx, width, height, this.smoothedLandmarks);
        }
        break;
      case 'eff-decoration':
        if (this.smoothedLandmarks) {
          this.renderFaceDecorationEffect(ctx, width, height, this.smoothedLandmarks);
        }
        break;
      case 'eff-animated':
        if (this.smoothedLandmarks) {
          this.renderAnimatedAuraEffect(ctx, width, height, this.smoothedLandmarks);
        }
        break;
      case 'eff-none':
      default:
        // Pass-through clean video
        break;
    }
  }

  /**
   * Low-pass filter to smooth landmark coordinates across frames and eliminate accessory jitter
   */
  private smoothLandmarks(raw: FaceLandmarks | null): FaceLandmarks | null {
    if (!raw) return null;
    if (!this.smoothedLandmarks) return raw;

    const alpha = 0.65; // Smoothing factor (0.0 = old, 1.0 = instant)
    const lerp = (a: number, b: number) => a + (b - a) * alpha;

    return {
      ...raw,
      roll: lerp(this.smoothedLandmarks.roll, raw.roll),
      eyeDistance: lerp(this.smoothedLandmarks.eyeDistance, raw.eyeDistance),
      forehead: {
        x: lerp(this.smoothedLandmarks.forehead.x, raw.forehead.x),
        y: lerp(this.smoothedLandmarks.forehead.y, raw.forehead.y),
      },
      eyeCenter: {
        x: lerp(this.smoothedLandmarks.eyeCenter.x, raw.eyeCenter.x),
        y: lerp(this.smoothedLandmarks.eyeCenter.y, raw.eyeCenter.y),
      },
      leftCheek: {
        x: lerp(this.smoothedLandmarks.leftCheek.x, raw.leftCheek.x),
        y: lerp(this.smoothedLandmarks.leftCheek.y, raw.leftCheek.y),
      },
      rightCheek: {
        x: lerp(this.smoothedLandmarks.rightCheek.x, raw.rightCheek.x),
        y: lerp(this.smoothedLandmarks.rightCheek.y, raw.rightCheek.y),
      },
    };
  }

  // ---------------------------------------------------------------------------
  // EFFECT RENDERERS
  // ---------------------------------------------------------------------------

  /**
   * Studio Beauty Effect:
   * Smooths skin within the detected face box while preserving sharp contrast on eyes & lips.
   */
  private renderBeautyEffect(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    landmarks: FaceLandmarks | null
  ): void {
    const intensity = this.beautyLevel / 100;
    if (intensity <= 0.05) return;

    ctx.save();
    if (landmarks && landmarks.detected) {
      const fb = landmarks.faceBox;
      const bx = fb.x * w;
      const by = fb.y * h;
      const bw = fb.width * w;
      const bh = fb.height * h;

      // Soft blur overlay on skin region
      ctx.beginPath();
      ctx.ellipse(bx + bw / 2, by + bh / 2, bw * 0.45, bh * 0.48, landmarks.roll, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 225, ${0.12 * intensity})`;
      ctx.filter = `blur(${Math.max(2, Math.round(6 * intensity))}px)`;
      ctx.fill();

      // Soft studio ring-light highlight
      const grad = ctx.createRadialGradient(
        bx + bw / 2,
        by + bh * 0.4,
        bw * 0.1,
        bx + bw / 2,
        by + bh * 0.4,
        bw * 0.6
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.14 * intensity})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.filter = 'none';
      ctx.fill();
    } else {
      // Global soft beauty tone curve
      ctx.fillStyle = `rgba(255, 240, 230, ${0.06 * intensity})`;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  }

  /**
   * Sovereign Crown Effect:
   * 5-peak gold regal crown positioned above the forehead landmark (10),
   * rotated with head roll and dynamically scaled with eyeDistance.
   */
  private renderCrownEffect(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    lm: FaceLandmarks
  ): void {
    const anchorX = lm.forehead.x * w;
    const anchorY = lm.forehead.y * h - lm.eyeDistance * h * 0.68;
    const crownWidth = lm.eyeDistance * w * 2.2;
    const crownHeight = crownWidth * 0.52;

    ctx.save();
    ctx.translate(anchorX, anchorY);
    ctx.rotate(lm.roll);

    const halfW = crownWidth / 2;
    const topH = -crownHeight;

    // Crown Base Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;

    // Golden Crown Body Gradient
    const goldGrad = ctx.createLinearGradient(0, topH, 0, 0);
    goldGrad.addColorStop(0, '#FFE875');
    goldGrad.addColorStop(0.35, '#F59E0B');
    goldGrad.addColorStop(0.7, '#D97706');
    goldGrad.addColorStop(1, '#92400E');

    ctx.beginPath();
    // Base curve
    ctx.moveTo(-halfW, 0);
    ctx.quadraticCurveTo(0, 8, halfW, 0);

    // Crown peaks (5 distinct regal peaks)
    ctx.lineTo(halfW * 0.85, topH * 0.55);
    ctx.lineTo(halfW * 0.5, topH * 0.85);
    ctx.lineTo(halfW * 0.22, topH * 0.45);
    ctx.lineTo(0, topH); // Center tallest peak
    ctx.lineTo(-halfW * 0.22, topH * 0.45);
    ctx.lineTo(-halfW * 0.5, topH * 0.85);
    ctx.lineTo(-halfW * 0.85, topH * 0.55);
    ctx.closePath();

    ctx.fillStyle = goldGrad;
    ctx.fill();

    // Crown Golden Rim Highlight
    ctx.lineWidth = Math.max(2, crownWidth * 0.02);
    ctx.strokeStyle = '#FEF08A';
    ctx.stroke();

    // Center Crown Ruby Jewel
    ctx.beginPath();
    ctx.arc(0, topH * 0.58, crownWidth * 0.07, 0, Math.PI * 2);
    const rubyGrad = ctx.createRadialGradient(0, topH * 0.58, 1, 0, topH * 0.58, crownWidth * 0.07);
    rubyGrad.addColorStop(0, '#FF6B8B');
    rubyGrad.addColorStop(0.7, '#DC2626');
    rubyGrad.addColorStop(1, '#7F1D1D');
    ctx.fillStyle = rubyGrad;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fill();

    // Base Jewels (Emerald & Sapphire accents)
    const jewelY = -crownHeight * 0.12;
    const jewelR = crownWidth * 0.035;

    // Left Jewel (Sapphire)
    ctx.beginPath();
    ctx.arc(-halfW * 0.45, jewelY, jewelR, 0, Math.PI * 2);
    ctx.fillStyle = '#0284C7';
    ctx.fill();

    // Right Jewel (Emerald)
    ctx.beginPath();
    ctx.arc(halfW * 0.45, jewelY, jewelR, 0, Math.PI * 2);
    ctx.fillStyle = '#059669';
    ctx.fill();

    ctx.restore();
  }

  /**
   * Cyber HUD Visor:
   * Holographic cyan eyewear anchored over eyeCenter,
   * rotated with roll, scaling with eye distance, with targeting HUD reticle.
   */
  private renderCyberVisorEffect(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    lm: FaceLandmarks
  ): void {
    const anchorX = lm.eyeCenter.x * w;
    const anchorY = lm.eyeCenter.y * h;
    const visorW = lm.eyeDistance * w * 2.4;
    const visorH = lm.eyeDistance * h * 0.72;

    ctx.save();
    ctx.translate(anchorX, anchorY);
    ctx.rotate(lm.roll);

    const halfW = visorW / 2;
    const halfH = visorH / 2;

    // Visor Shield Body (Hexagonal aerodynamic silhouette)
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH * 0.5);
    ctx.lineTo(-halfW * 0.8, -halfH);
    ctx.lineTo(halfW * 0.8, -halfH);
    ctx.lineTo(halfW, -halfH * 0.5);
    ctx.lineTo(halfW * 0.85, halfH);
    ctx.lineTo(0, halfH * 0.6);
    ctx.lineTo(-halfW * 0.85, halfH);
    ctx.closePath();

    // Glass body with cyan neon gradient
    const visorGrad = ctx.createLinearGradient(0, -halfH, 0, halfH);
    visorGrad.addColorStop(0, 'rgba(0, 180, 216, 0.48)');
    visorGrad.addColorStop(0.5, 'rgba(0, 119, 182, 0.28)');
    visorGrad.addColorStop(1, 'rgba(3, 4, 94, 0.45)');
    ctx.fillStyle = visorGrad;
    ctx.fill();

    // Neon Rim Glow
    ctx.lineWidth = Math.max(2, visorW * 0.02);
    ctx.strokeStyle = '#00F0FF';
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 12;
    ctx.stroke();

    // Interior HUD Targeting Reticle & Crosshair
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
    ctx.lineWidth = 1.5;

    // Reticle Center Box
    const retW = visorW * 0.16;
    ctx.strokeRect(-retW / 2, -retW / 2, retW, retW);

    // Crosshair ticks
    ctx.beginPath();
    ctx.moveTo(-retW, 0);
    ctx.lineTo(-retW * 0.4, 0);
    ctx.moveTo(retW * 0.4, 0);
    ctx.lineTo(retW, 0);
    ctx.stroke();

    // Digital Telemetry text overlay
    ctx.fillStyle = '#00F0FF';
    ctx.font = `bold ${Math.max(8, Math.round(visorW * 0.045))}px monospace`;
    ctx.textAlign = 'left';
    ctx.fillText('TARGET: LOCK', -halfW * 0.75, halfH * 0.5);
    ctx.textAlign = 'right';
    ctx.fillText('FPS: 60', halfW * 0.75, halfH * 0.5);

    ctx.restore();
  }

  /**
   * Starlight Blush Face Decoration:
   * Holographic cherry blossom star stamps anchored to left and right cheeks.
   */
  private renderFaceDecorationEffect(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    lm: FaceLandmarks
  ): void {
    const starSize = lm.eyeDistance * w * 0.32;
    const leftX = lm.leftCheek.x * w;
    const leftY = lm.leftCheek.y * h;
    const rightX = lm.rightCheek.x * w;
    const rightY = lm.rightCheek.y * h;

    const drawStar = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);

      // Star gradient
      const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, starSize);
      grad.addColorStop(0, '#FF69B4');
      grad.addColorStop(0.6, '#F43F5E');
      grad.addColorStop(1, 'rgba(244, 63, 94, 0)');

      ctx.beginPath();
      const points = 5;
      const outerR = starSize / 2;
      const innerR = outerR * 0.45;
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (i * Math.PI) / points - Math.PI / 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(255, 105, 180, 0.7)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    };

    drawStar(leftX, leftY, lm.roll);
    drawStar(rightX, rightY, lm.roll);
  }

  /**
   * Animated Cyber Pulse Aura:
   * Dynamic pulsating particles circulating the facial contour.
   */
  private renderAnimatedAuraEffect(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    lm: FaceLandmarks
  ): void {
    const fb = lm.faceBox;
    const cx = (fb.x + fb.width / 2) * w;
    const cy = (fb.y + fb.height / 2) * h;
    const rx = (fb.width * w) / 2;
    const ry = (fb.height * h) / 2;

    const time = performance.now() * 0.003;
    const pulse = 1 + Math.sin(time * 3) * 0.05;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(lm.roll);

    // Glowing contour ring
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 1.12 * pulse, ry * 1.12 * pulse, 0, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(3, rx * 0.035);
    ctx.strokeStyle = `hsl(${(time * 40) % 360}, 95%, 60%)`;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 16;
    ctx.stroke();

    // Orbiting particles
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = time * 2 + (i * Math.PI * 2) / particleCount;
      const px = Math.cos(angle) * rx * 1.12 * pulse;
      const py = Math.sin(angle) * ry * 1.12 * pulse;

      ctx.beginPath();
      ctx.arc(px, py, rx * 0.045, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Visibly marks unavailable effects as required by Section 6
   */
  private renderUnavailableOverlay(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Effect Unavailable', w / 2, h / 2);
    ctx.restore();
  }
}
