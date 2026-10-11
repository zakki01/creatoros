export interface WelcomeBannerItem {
  id: string;
  mode: 'creator' | 'brand';
  headline: string;
  supportingLine: string;
  actionText: string;
  badge: string;
  focalTag: string;
  statusTag: string;
  image: string;
  alt: string;
  accentColor: string;
}

export const CREATOR_BANNERS: WelcomeBannerItem[] = [
  {
    id: 'creator-01',
    mode: 'creator',
    headline: 'CREATE WITHOUT LIMITS.',
    supportingLine: 'Turn ideas into content.',
    actionText: 'Start Creating',
    badge: '35MM CINEMATOGRAPHY',
    focalTag: '4K UHD • ARRI ALEXA GRADE',
    statusTag: 'Live Camera Engine Active',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&auto=format&fit=crop&q=85',
    alt: 'Cinematic creator filming outdoors with anamorphic lens',
    accentColor: '#38bdf8', // electric sky blue
  },
  {
    id: 'creator-02',
    mode: 'creator',
    headline: 'CREATE WITHOUT LIMITS.',
    supportingLine: 'Turn ideas into content.',
    actionText: 'Start Creating',
    badge: 'EDITORIAL DIRECTION',
    focalTag: 'HIGH-FIDELITY CAMPAIGN STILLS',
    statusTag: 'Color Grade: Muted Earth & Cashmere',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=85',
    alt: 'Fashion editorial model posing in studio daylight',
    accentColor: '#38bdf8',
  },
  {
    id: 'creator-03',
    mode: 'creator',
    headline: 'CREATE WITHOUT LIMITS.',
    supportingLine: 'Turn ideas into content.',
    actionText: 'Start Creating',
    badge: 'AUDIO-VISUAL MOTION',
    focalTag: '9:16 VERTICAL CINEMA',
    statusTag: 'Realtime Audio Sync: 128 BPM',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=85',
    alt: 'Dynamic creator with neon lighting and urban backdrop',
    accentColor: '#38bdf8',
  },
  {
    id: 'creator-04',
    mode: 'creator',
    headline: 'CREATE WITHOUT LIMITS.',
    supportingLine: 'Turn ideas into content.',
    actionText: 'Start Creating',
    badge: 'STUDIO RIGGING & CAPTURE',
    focalTag: 'PRO RES 422 HQ • 24 FPS',
    statusTag: 'Milestone Deliverables Ready',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1600&auto=format&fit=crop&q=85',
    alt: 'Cinematic monitor rig and studio filming gear',
    accentColor: '#38bdf8',
  },
];

export const BRAND_BANNERS: WelcomeBannerItem[] = [
  {
    id: 'brand-01',
    mode: 'brand',
    headline: 'BUILD YOUR BRAND VISUALLY.',
    supportingLine: 'Create campaigns that stand out.',
    actionText: 'Create Campaign',
    badge: 'CAMPAIGN ARCHITECTURE',
    focalTag: 'GLOBAL PRODUCT LAUNCH',
    statusTag: '6 Verified Creators Onboarded',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=85',
    alt: 'High-end minimalist brand space with curated lighting',
    accentColor: '#818cf8', // refined indigo/violet
  },
  {
    id: 'brand-02',
    mode: 'brand',
    headline: 'BUILD YOUR BRAND VISUALLY.',
    supportingLine: 'Create campaigns that stand out.',
    actionText: 'Create Campaign',
    badge: 'PRODUCT SHOWCASE',
    focalTag: 'COMMERCIAL STILLS & REELS',
    statusTag: 'Milestone Escrow: Protected',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1600&auto=format&fit=crop&q=85',
    alt: 'Minimalist product design and contemporary branding objects',
    accentColor: '#818cf8',
  },
  {
    id: 'brand-03',
    mode: 'brand',
    headline: 'BUILD YOUR BRAND VISUALLY.',
    supportingLine: 'Create campaigns that stand out.',
    actionText: 'Create Campaign',
    badge: 'CULTURE & INFLUENCE',
    focalTag: 'MULTI-CREATOR CAMPAIGN',
    statusTag: 'Contract Verification: 100% Passed',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop&q=85',
    alt: 'Contemporary streetwear campaign model in bold color',
    accentColor: '#818cf8',
  },
  {
    id: 'brand-04',
    mode: 'brand',
    headline: 'BUILD YOUR BRAND VISUALLY.',
    supportingLine: 'Create campaigns that stand out.',
    actionText: 'Create Campaign',
    badge: 'EDITORIAL RELEASE',
    focalTag: 'TARGET REACH: 2.4M IMPRESSIONS',
    statusTag: 'Automated Rights & Deliverable QC',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85',
    alt: 'High-fashion editorial collection campaign imagery',
    accentColor: '#818cf8',
  },
];

/**
 * Gets or selects a persistent banner index for the current session.
 * Prevents rapid switching during interaction, but rotates deterministically on new sessions.
 */
export function getSessionBanner(mode: 'creator' | 'brand'): WelcomeBannerItem {
  const list = mode === 'creator' ? CREATOR_BANNERS : BRAND_BANNERS;
  const storageKey = `creatoros_banner_idx_${mode}`;

  try {
    const stored = sessionStorage.getItem(storageKey);
    if (stored !== null) {
      const idx = parseInt(stored, 10);
      if (!isNaN(idx) && idx >= 0 && idx < list.length) {
        return list[idx];
      }
    }

    // Pick a new index for this session
    const prevKey = `creatoros_banner_prev_${mode}`;
    const prevIdx = parseInt(sessionStorage.getItem(prevKey) || '-1', 10);
    let newIdx = Math.floor(Math.random() * list.length);
    if (newIdx === prevIdx && list.length > 1) {
      newIdx = (newIdx + 1) % list.length;
    }

    sessionStorage.setItem(storageKey, String(newIdx));
    sessionStorage.setItem(prevKey, String(newIdx));
    return list[newIdx];
  } catch {
    return list[0];
  }
}

/**
 * Switches to a specific banner index or cycles to the next one for testing/exploration.
 */
export function setSessionBannerIndex(mode: 'creator' | 'brand', index: number): WelcomeBannerItem {
  const list = mode === 'creator' ? CREATOR_BANNERS : BRAND_BANNERS;
  const safeIdx = Math.max(0, Math.min(index, list.length - 1));
  try {
    sessionStorage.setItem(`creatoros_banner_idx_${mode}`, String(safeIdx));
  } catch {
    // Ignore storage issues
  }
  return list[safeIdx];
}
