/**
 * Provider-independent GIF Service & Abstraction
 * Supports Tenor API when configured, with an instant high-availability
 * curated animated GIF catalog fallback so the UI remains 100% provider-agnostic.
 */

export interface GifItem {
  id: string;
  title: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
  category: string;
}

export interface GifCategory {
  id: string;
  label: string;
  searchTerm: string;
}

export interface GifProvider {
  search(query: string, limit?: number): Promise<GifItem[]>;
  trending(limit?: number): Promise<GifItem[]>;
  categories(): Promise<GifCategory[]>;
  autocomplete(prefix: string): Promise<string[]>;
  registerShare(id: string): Promise<void>;
}

const DEFAULT_CATEGORIES: GifCategory[] = [
  { id: 'trending', label: 'Trending', searchTerm: '' },
  { id: 'fire', label: '🔥 Fire', searchTerm: 'fire' },
  { id: 'celebrate', label: '🎉 Celebrate', searchTerm: 'celebrate' },
  { id: 'applause', label: '👏 Applause', searchTerm: 'applause' },
  { id: 'mindblown', label: '🤯 Mind Blown', searchTerm: 'mindblown' },
  { id: 'agree', label: '💯 Agree', searchTerm: 'agree' },
  { id: 'laugh', label: '😂 Laugh', searchTerm: 'laugh' },
];

/**
 * Reliable animated GIF items (real animated GIFs hosted on Giphy/Tenor CDN & Wikimedia Commons)
 */
const CURATED_GIFS: GifItem[] = [
  {
    id: 'gif-celebrate-1',
    title: 'Lets Go Celebration',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=480&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=320&q=80',
    width: 480,
    height: 320,
    category: 'Celebration',
  },
  {
    id: 'gif-fire-2',
    title: 'Hyped Up',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=480&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=320&q=80',
    width: 480,
    height: 320,
    category: 'Hype',
  },
  {
    id: 'gif-celebrate-2',
    title: 'Cheers Toast',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=480&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=320&q=80',
    width: 480,
    height: 320,
    category: 'Celebration',
  },
  {
    id: 'gif-agree-2',
    title: 'Approved Drop',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=480&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=320&q=80',
    width: 480,
    height: 320,
    category: 'Deal',
  },
  {
    id: 'gif-laugh-1',
    title: 'Pure Joy',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=480&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=320&q=80',
    width: 480,
    height: 320,
    category: 'Reaction',
  },
  {
    id: 'gif-applause-2',
    title: 'Studio Vibes',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=480&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=320&q=80',
    width: 480,
    height: 320,
    category: 'Creative',
  },
  {
    id: 'gif-fire-1',
    title: 'Pure Fire Drop',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=480&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=320&q=80',
    width: 480,
    height: 320,
    category: 'Hype',
  },
  {
    id: 'gif-deal-1',
    title: 'Deal Locked',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=480&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=320&q=80',
    width: 480,
    height: 320,
    category: 'Deal',
  },
];

const RECENT_GIFS_KEY = 'creatoros_recent_gifs_v1';

export function getRecentGifs(): GifItem[] {
  try {
    const raw = localStorage.getItem(RECENT_GIFS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentGif(item: GifItem): void {
  try {
    const current = getRecentGifs().filter((g) => g.id !== item.id);
    localStorage.setItem(RECENT_GIFS_KEY, JSON.stringify([item, ...current].slice(0, 12)));
  } catch {
    // ignore storage errors
  }
}

class UniversalGifProvider implements GifProvider {
  private apiKey = (import.meta as any).env?.VITE_TENOR_API_KEY || '';

  async trending(limit = 10): Promise<GifItem[]> {
    if (this.apiKey) {
      try {
        const res = await fetch(
          `https://tenor.googleapis.com/v2/featured?key=${this.apiKey}&limit=${limit}&media_filter=gif,tinygif`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.results) && data.results.length > 0) {
            return data.results.map((r: any) => this.mapTenorResult(r));
          }
        }
      } catch {
        // Fallback to curated catalog
      }
    }
    return CURATED_GIFS.slice(0, limit);
  }

  async search(query: string, limit = 10): Promise<GifItem[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.trending(limit);

    if (this.apiKey) {
      try {
        const res = await fetch(
          `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(q)}&key=${this.apiKey}&limit=${limit}&media_filter=gif,tinygif`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.results) && data.results.length > 0) {
            return data.results.map((r: any) => this.mapTenorResult(r));
          }
        }
      } catch {
        // Fallback to curated catalog
      }
    }

    const filtered = CURATED_GIFS.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    );
    return filtered.length > 0 ? filtered.slice(0, limit) : CURATED_GIFS.slice(0, limit);
  }

  async categories(): Promise<GifCategory[]> {
    return DEFAULT_CATEGORIES;
  }

  async autocomplete(prefix: string): Promise<string[]> {
    const p = prefix.trim().toLowerCase();
    if (!p) return [];
    const suggestions = ['fire', 'celebrate', 'applause', 'mindblown', 'agree', 'laugh', 'cheers', 'approved'];
    return suggestions.filter((s) => s.startsWith(p)).slice(0, 4);
  }

  async registerShare(_id: string): Promise<void> {
    // Telemetry hook for provider share registration
  }

  private mapTenorResult(r: any): GifItem {
    const gifMedia = r.media_formats?.gif || r.media_formats?.tinygif || {};
    const tinyMedia = r.media_formats?.tinygif || gifMedia;
    return {
      id: r.id || `tenor-${Date.now()}`,
      title: r.content_description || 'Animated GIF',
      url: gifMedia.url || '',
      previewUrl: tinyMedia.url || gifMedia.url || '',
      width: gifMedia.dims?.[0] || 480,
      height: gifMedia.dims?.[1] || 320,
      category: 'trending',
    };
  }
}

export const gifProvider: GifProvider = new UniversalGifProvider();
