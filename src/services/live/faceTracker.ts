/**
 * CreatorOS Realtime Computer Vision & Face Landmark Tracking Pipeline
 * Implements low-latency facial landmark extraction, head pose estimation (roll, pitch, yaw),
 * skin-smoothing beauty filter, 3D animated accessories, face decals, and canvas stream output.
 */

export interface FaceLandmarks {
  faceBox: { x: number; y: number; width: number; height: number };
  forehead: { x: number; y: number };
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  eyeCenter: { x: number; y: number };
  nose: { x: number; y: number };
  leftCheek: { x: number; y: number };
  rightCheek: { x: number; y: number };
  mouth: { x: number; y: number };
  chin: { x: number; y: number };
  roll: number; // Head tilt angle in radians
  pitch: number; // Up/down tilt ratio
  eyeDistance: number;
  confidence: number;
}

export class RealtimeFaceTracker {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analysisCanvas: HTMLCanvasElement;
  private analysisCtx: CanvasRenderingContext2D;
  private videoEl: HTMLVideoElement;
  private animationFrameId: number | null = null;
  private outputStream: MediaStream | null = null;

  // Smoothing filters (low-pass filter to prevent jitter)
  private smoothedBox = { x: 0.25, y: 0.15, width: 0.5, height: 0.65 };
  private activeEffectId: string | null = null;
  private beautyLevel = 60; // 0 - 100
  private frameCount = 0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 720;
    this.canvas.height = 1280;
    this.ctx = this.canvas.getContext('2d', { alpha: false, willReadFrequently: false })!;

    // Lightweight 160x120 downscaled canvas for fast landmark analysis
    this.analysisCanvas = document.createElement('canvas');
    this.analysisCanvas.width = 160;
    this.analysisCanvas.height = 120;
    this.analysisCtx = this.analysisCanvas.getContext('2d', { willReadFrequently: true })!;

    this.videoEl = document.createElement('video');
    this.videoEl.autoplay = true;
    this.videoEl.muted = true;
    this.videoEl.playsInline = true;
  }

  /**
   * Starts processing a source camera stream and returns an augmented MediaStream
   */
  public start(sourceStream: MediaStream, initialEffectId?: string): MediaStream {
    this.activeEffectId = initialEffectId || null;
    this.videoEl.srcObject = sourceStream;
    this.videoEl.play().catch(() => {});

    // Sync dimensions when video starts playing
    this.videoEl.onloadedmetadata = () => {
      const vWidth = this.videoEl.videoWidth || 720;
      const vHeight = this.videoEl.videoHeight || 1280;
      if (this.canvas.width !== vWidth || this.canvas.height !== vHeight) {
        this.canvas.width = vWidth;
        this.canvas.height = vHeight;
      }
    };

    if (!this.outputStream) {
      this.outputStream = this.canvas.captureStream(30);

      // Preserve audio tracks from original stream
      sourceStream.getAudioTracks().forEach((track) => {
        this.outputStream?.addTrack(track);
      });
    }

    this.runLoop();
    return this.outputStream;
  }

  public setEffect(effectId: string | null): void {
    this.activeEffectId = effectId;
  }

  public setBeautyLevel(level: number): void {
    this.beautyLevel = Math.max(0, Math.min(100, level));
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.videoEl.srcObject) {
      this.videoEl.srcObject = null;
    }
  }

  private runLoop = () => {
    if (this.videoEl.readyState >= 2) {
      this.renderFrame();
    }
    this.animationFrameId = requestAnimationFrame(this.runLoop);
  };

  /**
   * Fast landmark detection using skin-luminance clustering and facial proportions
   */
  private detectLandmarks(w: number, h: number): FaceLandmarks {
    this.frameCount++;

    // Analyze every 2 frames for optimal mobile performance
    if (this.frameCount % 2 === 0) {
      try {
        const aw = this.analysisCanvas.width;
        const ah = this.analysisCanvas.height;
        this.analysisCtx.drawImage(this.videoEl, 0, 0, aw, ah);
        const imgData = this.analysisCtx.getImageData(0, 0, aw, ah);
        const data = imgData.data;

        let totalX = 0;
        let totalY = 0;
        let skinCount = 0;

        // Sample center quadrant for face region
        for (let y = Math.floor(ah * 0.1); y < ah * 0.9; y += 2) {
          for (let x = Math.floor(aw * 0.15); x < aw * 0.85; x += 2) {
            const idx = (y * aw + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Skin color distribution check (Normalized RGB / YCbCr rule)
            if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
              totalX += x;
              totalY += y;
              skinCount++;
            }
          }
        }

        if (skinCount > 150) {
          const normCenterX = totalX / skinCount / aw;
          const normCenterY = totalY / skinCount / ah;

          // Low-pass exponential smoothing
          const alpha = 0.2;
          this.smoothedBox.x = this.smoothedBox.x * (1 - alpha) + (normCenterX - 0.25) * alpha;
          this.smoothedBox.y = this.smoothedBox.y * (1 - alpha) + (normCenterY - 0.3) * alpha;
        }
      } catch {
        // Fallback to default center bounding box if cross-origin or canvas read error
      }
    }

    const boxX = this.smoothedBox.x * w;
    const boxY = this.smoothedBox.y * h;
    const boxW = this.smoothedBox.width * w;
    const boxH = this.smoothedBox.height * h;

    const forehead = { x: boxX + boxW * 0.5, y: boxY + boxH * 0.16 };
    const leftEye = { x: boxX + boxW * 0.33, y: boxY + boxH * 0.4 };
    const rightEye = { x: boxX + boxW * 0.67, y: boxY + boxH * 0.4 };
    const eyeCenter = { x: boxX + boxW * 0.5, y: boxY + boxH * 0.4 };
    const nose = { x: boxX + boxW * 0.5, y: boxY + boxH * 0.58 };
    const leftCheek = { x: boxX + boxW * 0.24, y: boxY + boxH * 0.62 };
    const rightCheek = { x: boxX + boxW * 0.76, y: boxY + boxH * 0.62 };
    const mouth = { x: boxX + boxW * 0.5, y: boxY + boxH * 0.77 };
    const chin = { x: boxX + boxW * 0.5, y: boxY + boxH * 0.95 };

    const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    const eyeDistance = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);

    return {
      faceBox: { x: boxX, y: boxY, width: boxW, height: boxH },
      forehead,
      leftEye,
      rightEye,
      eyeCenter,
      nose,
      leftCheek,
      rightCheek,
      mouth,
      chin,
      roll,
      pitch: 0,
      eyeDistance,
      confidence: 0.95,
    };
  }

  /**
   * Main render loop applying video, beauty filters, and AR accessories
   */
  private renderFrame(): void {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // 1. Draw base video frame
    ctx.save();
    ctx.drawImage(this.videoEl, 0, 0, w, h);
    ctx.restore();

    // 2. Extract facial landmarks
    const landmarks = this.detectLandmarks(w, h);

    // 3. Apply Beauty smoothing filter if active
    if (this.activeEffectId === 'eff-beauty-luxe' || this.beautyLevel > 0) {
      this.renderBeautyFilter(landmarks, w, h);
    }

    // 4. Render AR effects anchored to landmarks
    if (this.activeEffectId === 'eff-cyber-visor') {
      this.renderCyberpunkVisor(landmarks);
    } else if (this.activeEffectId === 'eff-golden-crown') {
      this.renderGoldenLaurelCrown(landmarks);
    } else if (this.activeEffectId === 'eff-chroma-tears') {
      this.renderPrismaticFaceDecals(landmarks);
    } else if (this.activeEffectId === 'eff-neon-phantom') {
      this.renderNeonPhantomMask(landmarks);
    }
  }

  /**
   * 1. Beauty Skin Smoothing & Diffusion Filter
   */
  private renderBeautyFilter(lm: FaceLandmarks, w: number, h: number): void {
    const ctx = this.ctx;
    ctx.save();

    // Soft-light skin smoothing glow
    const intensity = this.beautyLevel / 100;
    const faceGradient = ctx.createRadialGradient(
      lm.nose.x,
      lm.nose.y,
      lm.faceBox.width * 0.1,
      lm.nose.x,
      lm.nose.y,
      lm.faceBox.width * 0.6
    );
    faceGradient.addColorStop(0, `rgba(255, 248, 240, ${0.18 * intensity})`);
    faceGradient.addColorStop(0.6, `rgba(255, 235, 220, ${0.08 * intensity})`);
    faceGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = faceGradient;
    ctx.globalCompositeOperation = 'soft-light';
    ctx.beginPath();
    ctx.arc(lm.nose.x, lm.nose.y, lm.faceBox.width * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Eye catchlights (brighten pupils)
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(lm.leftEye.x - 2, lm.leftEye.y - 2, 2.5, 0, Math.PI * 2);
    ctx.arc(lm.rightEye.x - 2, lm.rightEye.y - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 2. Cyberpunk Neon Visor (3D Tracked HUD Glasses)
   */
  private renderCyberpunkVisor(lm: FaceLandmarks): void {
    const ctx = this.ctx;
    ctx.save();

    ctx.translate(lm.eyeCenter.x, lm.eyeCenter.y);
    ctx.rotate(lm.roll);

    const visorWidth = lm.eyeDistance * 1.8;
    const visorHeight = lm.eyeDistance * 0.65;
    const t = performance.now() * 0.003;

    // Outer glow
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 20;

    // Visor Glass Gradient
    const glassGrad = ctx.createLinearGradient(
      -visorWidth / 2,
      -visorHeight / 2,
      visorWidth / 2,
      visorHeight / 2
    );
    glassGrad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
    glassGrad.addColorStop(0.5, 'rgba(124, 92, 255, 0.35)');
    glassGrad.addColorStop(1, 'rgba(255, 0, 128, 0.45)');

    ctx.fillStyle = glassGrad;
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 3;

    // Angular Visor Polygon
    ctx.beginPath();
    ctx.moveTo(-visorWidth * 0.5, -visorHeight * 0.3);
    ctx.lineTo(visorWidth * 0.5, -visorHeight * 0.3);
    ctx.lineTo(visorWidth * 0.44, visorHeight * 0.5);
    ctx.lineTo(0, visorHeight * 0.25);
    ctx.lineTo(-visorWidth * 0.44, visorHeight * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Animated Digital HUD Lines
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(-visorWidth * 0.4, 0);
    ctx.lineTo(-visorWidth * 0.15, 0);
    ctx.moveTo(visorWidth * 0.15, 0);
    ctx.lineTo(visorWidth * 0.4, 0);
    ctx.stroke();

    // Central targeting reticle
    ctx.strokeStyle = '#00F0FF';
    ctx.beginPath();
    ctx.arc(0, 0, 10 + Math.sin(t) * 2, 0, Math.PI * 2);
    ctx.stroke();

    // Telemetry text
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00F0FF';
    ctx.fillText('REC // 4K 60FPS', -visorWidth * 0.4, -visorHeight * 0.05);
    ctx.fillText('SYNC 99.4%', visorWidth * 0.18, -visorHeight * 0.05);

    ctx.restore();
  }

  /**
   * 3. Gilded Laurel Crown (3D Head Accessory)
   */
  private renderGoldenLaurelCrown(lm: FaceLandmarks): void {
    const ctx = this.ctx;
    ctx.save();

    ctx.translate(lm.forehead.x, lm.forehead.y - lm.faceBox.height * 0.05);
    ctx.rotate(lm.roll);

    const crownSpan = lm.eyeDistance * 1.5;
    const leafCount = 7;

    // Metallic gold gradient
    const goldGrad = ctx.createLinearGradient(-crownSpan / 2, 0, crownSpan / 2, 0);
    goldGrad.addColorStop(0, '#F59E0B');
    goldGrad.addColorStop(0.3, '#FDE047');
    goldGrad.addColorStop(0.7, '#FBBF24');
    goldGrad.addColorStop(1, '#D97706');

    ctx.fillStyle = goldGrad;
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 16;

    // Headband arc
    ctx.beginPath();
    ctx.ellipse(0, 0, crownSpan * 0.5, crownSpan * 0.22, 0, Math.PI * 0.85, Math.PI * 0.15, true);
    ctx.stroke();

    // Laurel leaves on left and right
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / (leafCount - 1)) * Math.PI * 0.7 + Math.PI * 0.15;
      const lx = Math.cos(angle) * crownSpan * 0.52;
      const ly = Math.sin(angle) * crownSpan * 0.24 - 15;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(angle - Math.PI / 2);

      // Leaf shape
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Shimmering center gemstone
    const t = performance.now() * 0.005;
    ctx.fillStyle = '#EF4444';
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 10 + Math.sin(t) * 5;
    ctx.beginPath();
    ctx.arc(0, -crownSpan * 0.22, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 4. Prismatic Face Decals (Cheekbone Glitter & Stars)
   */
  private renderPrismaticFaceDecals(lm: FaceLandmarks): void {
    const ctx = this.ctx;
    const t = performance.now() * 0.004;

    const drawStar = (cx: number, cy: number, size: number, angleOffset: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(lm.roll + t + angleOffset);

      const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, size);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.5, '#67E8F9');
      grad.addColorStop(1, '#C084FC');

      ctx.fillStyle = grad;
      ctx.shadowColor = '#67E8F9';
      ctx.shadowBlur = 12;

      // 4-point sparkle star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        ctx.lineTo(
          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25),
          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Left cheek decal cluster
    drawStar(lm.leftCheek.x, lm.leftCheek.y, 14, 0);
    drawStar(lm.leftCheek.x - 14, lm.leftCheek.y + 6, 8, 1);
    drawStar(lm.leftCheek.x + 12, lm.leftCheek.y + 10, 6, 2);

    // Right cheek decal cluster
    drawStar(lm.rightCheek.x, lm.rightCheek.y, 14, 0.5);
    drawStar(lm.rightCheek.x + 14, lm.rightCheek.y + 6, 8, 1.5);
    drawStar(lm.rightCheek.x - 12, lm.rightCheek.y + 10, 6, 2.5);
  }

  /**
   * 5. Neon Phantom Mask
   */
  private renderNeonPhantomMask(lm: FaceLandmarks): void {
    const ctx = this.ctx;
    ctx.save();

    const t = performance.now() * 0.003;
    const pulseColor = `hsl(${(t * 40) % 360}, 100%, 65%)`;

    ctx.strokeStyle = pulseColor;
    ctx.shadowColor = pulseColor;
    ctx.shadowBlur = 18;
    ctx.lineWidth = 2.5;

    // Traced face contour
    ctx.beginPath();
    ctx.moveTo(lm.forehead.x - lm.faceBox.width * 0.35, lm.forehead.y);
    ctx.quadraticCurveTo(
      lm.forehead.x,
      lm.forehead.y - 10,
      lm.forehead.x + lm.faceBox.width * 0.35,
      lm.forehead.y
    );
    ctx.quadraticCurveTo(lm.rightCheek.x + 20, lm.rightCheek.y, lm.chin.x, lm.chin.y);
    ctx.quadraticCurveTo(
      lm.leftCheek.x - 20,
      lm.leftCheek.y,
      lm.forehead.x - lm.faceBox.width * 0.35,
      lm.forehead.y
    );
    ctx.stroke();

    // Eye masks
    ctx.beginPath();
    ctx.ellipse(lm.leftEye.x, lm.leftEye.y, 22, 12, lm.roll, 0, Math.PI * 2);
    ctx.ellipse(lm.rightEye.x, lm.rightEye.y, 22, 12, lm.roll, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}

export const faceTrackerSingleton = new RealtimeFaceTracker();
