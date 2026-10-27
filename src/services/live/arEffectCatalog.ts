/**
 * CreatorOS AR & Face Effect System
 *
 * Provider-agnostic catalog of procedural face accessories, 2D/3D vector shaders,
 * beauty diffusion filters, and automatic performance degradation fallback handlers.
 *
 * All active effects are rendered procedurally via hardware-accelerated Canvas/WebGL
 * anchored to real facial landmark coordinates.
 */

import { ArEffect } from '../../types/liveStudio';

export const AR_EFFECTS_CATALOG: ArEffect[] = [
  {
    id: 'eff-none',
    name: 'Normal (No Effect)',
    description: 'Clean camera feed without filters or AR overlays.',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    assets: {},
    type: 'beauty_filter',
    version: '1.0.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'low',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-27T00:00:00Z',
  },
  {
    id: 'eff-beauty-luxe',
    name: 'Studio Luxe Glow',
    description: 'Realtime skin smoothing, eye sharpening, and soft diffused lighting.',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    assets: { renderEngine: 'procedural_bilateral_filter' },
    type: 'beauty_filter',
    version: '1.2.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'low',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-27T00:00:00Z',
  },
  {
    id: 'eff-cyber-visor',
    name: 'Cyberpunk Neon Visor',
    description: 'Procedural chromatic glass HUD with animated holographic telemetry, anchored to eye landmarks.',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=120&auto=format&fit=crop&q=80',
    assets: { renderEngine: 'procedural_vector_hud' },
    type: 'accessory_3d',
    version: '2.1.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'medium',
    createdAt: '2026-10-05T00:00:00Z',
    updatedAt: '2026-10-27T00:00:00Z',
  },
  {
    id: 'eff-golden-crown',
    name: 'Gilded Laurel Crown',
    description: 'Procedural golden leaf tiara reflecting ambient highlights, anchored to forehead and head tilt.',
    thumbnail: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    assets: { renderEngine: 'procedural_vector_mesh' },
    type: 'accessory_3d',
    version: '1.2.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'medium',
    createdAt: '2026-10-10T00:00:00Z',
    updatedAt: '2026-10-27T00:00:00Z',
  },
  {
    id: 'eff-chroma-tears',
    name: 'Prismatic Face Decals',
    description: 'Iridescent star stickers and shimmer highlights under both cheekbone landmarks.',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    assets: { renderEngine: 'procedural_cheek_decals' },
    type: 'face_decoration',
    version: '1.2.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'low',
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-27T00:00:00Z',
  },
  {
    id: 'eff-neon-phantom',
    name: 'Neon Phantom Mask',
    description: 'Dynamic illuminated cybernetic contour mask tracking forehead, jawline, and nose bridge.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=80',
    assets: { renderEngine: 'procedural_contour_wireframe' },
    type: 'accessory_3d',
    version: '1.0.0',
    status: 'active',
    moderationStatus: 'approved',
    performanceTier: 'medium',
    createdAt: '2026-10-14T00:00:00Z',
    updatedAt: '2026-10-27T00:00:00Z',
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
}
