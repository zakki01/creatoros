/**
 * CreatorOS AR & Face Effect System
 * Provider-agnostic catalog of face masks, 3D accessories, beauty filters,
 * and automatic performance degradation fallback handlers.
 */

import { ArEffect } from '../../types/liveStudio';

export const AR_EFFECTS_CATALOG: ArEffect[] = [
  {
    id: 'eff-beauty-luxe',
    name: 'Studio Luxe Glow',
    description: 'Subtle skin smoothing, eye sharpening, and soft diffused lighting.',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    assets: { lutUrl: '/assets/luts/studio-luxe.png' },
    type: 'beauty_filter',
    version: '1.2.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'low',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-15T00:00:00Z',
  },
  {
    id: 'eff-cyber-visor',
    name: 'Cyberpunk Neon Visor',
    description: '3D chromatic glass HUD with animated holographic telemetry.',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=120&auto=format&fit=crop&q=80',
    assets: { model3dUrl: '/assets/models/cyber-visor.glb' },
    type: 'accessory_3d',
    version: '2.0.1',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'high',
    createdAt: '2026-10-05T00:00:00Z',
    updatedAt: '2026-10-20T00:00:00Z',
  },
  {
    id: 'eff-golden-crown',
    name: 'Gilded Laurel Crown',
    description: 'Tracked golden leaf tiara reflecting room ambient highlights.',
    thumbnail: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    assets: { model3dUrl: '/assets/models/laurel-crown.glb' },
    type: 'accessory_3d',
    version: '1.0.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'high',
    createdAt: '2026-10-10T00:00:00Z',
    updatedAt: '2026-10-20T00:00:00Z',
  },
  {
    id: 'eff-chroma-tears',
    name: 'Prismatic Face Decals',
    description: 'Iridescent star stickers and shimmer highlights under both cheekbones.',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    assets: { textureUrl: '/assets/textures/prism-stars.png' },
    type: 'face_decoration',
    version: '1.1.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'medium',
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-22T00:00:00Z',
  },
  {
    id: 'eff-film-35mm',
    name: '35mm Kodak Portra Grade',
    description: 'True film grain, subtle halation, warm highlights, and gentle contrast roll-off.',
    thumbnail: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    assets: { lutUrl: '/assets/luts/kodak-portra.png' },
    type: 'color_lut',
    version: '1.0.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'low',
    createdAt: '2026-10-14T00:00:00Z',
    updatedAt: '2026-10-22T00:00:00Z',
  },
];

/**
 * Performance Fallback Manager
 * Automatically downgrades effect complexity when frame rate drops below target
 */
export class EffectPerformanceManager {
  private static frameTimes: number[] = [];
  private static currentFps = 60;

  static recordFrame(): void {
    const now = performance.now();
    this.frameTimes.push(now);
    if (this.frameTimes.length > 30) {
      this.frameTimes.shift();
      const delta = (this.frameTimes[this.frameTimes.length - 1] - this.frameTimes[0]) / 30;
      this.currentFps = Math.round(1000 / delta);
    }
  }

  static getFps(): number {
    return this.currentFps;
  }

  static shouldDowngrade(effect: ArEffect): boolean {
    // If FPS drops below 24 and effect is heavy 3D tier, downgrade to lightweight 2D
    return this.currentFps < 24 && effect.performanceTier === 'high';
  }

  static getSafeFallbackEffect(effect: ArEffect): ArEffect {
    if (this.shouldDowngrade(effect)) {
      return AR_EFFECTS_CATALOG.find((e) => e.performanceTier === 'low') || effect;
    }
    return effect;
  }
}
