import { AiProviderConfig, AiProviderType } from '../types';

const STORAGE_KEY = 'creatoros_byok_config_v1';

class ByokAiService {
  getConfig(): AiProviderConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          provider: parsed.provider || 'creatoros',
          activeProvider: parsed.activeProvider || parsed.provider || 'creatoros',
          apiKey: parsed.apiKey || '',
          apiKeys: parsed.apiKeys || {},
          isConfigured: Boolean(parsed.isConfigured),
          modelName: parsed.modelName || 'CreatorOS Neural Engine v2.4 (Default)',
          usageCount: parsed.usageCount || 142,
        };
      }
    } catch {
      // fallback
    }
    return {
      provider: 'creatoros',
      activeProvider: 'creatoros',
      apiKey: '',
      apiKeys: {},
      isConfigured: true,
      modelName: 'CreatorOS Neural Engine v2.4 (Default)',
      usageCount: 142,
    };
  }

  saveConfig(config: AiProviderConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save AI config:', e);
    }
  }

  updateConfig(partial: Partial<AiProviderConfig>): AiProviderConfig {
    const current = this.getConfig();
    const updated: AiProviderConfig = {
      ...current,
      ...partial,
      apiKeys: {
        ...current.apiKeys,
        ...(partial.apiKeys || {}),
      },
    };
    this.saveConfig(updated);
    return updated;
  }

  generateViralHooks(topic: string, niche: string): string[] {
    const cleanTopic = topic || 'Urban Streetwear Essentials';
    return [
      `Stop styling ${cleanTopic} like it is 2019 — here is the modern 3-step layered look.`,
      `The one ${niche} essential everyone asked me about in Bandra this weekend.`,
      `I tested every high-street brand for ${cleanTopic} so you do not waste your money on thin cotton.`,
    ];
  }

  generateReelScript(topic: string, requirements?: string): string {
    const cleanTopic = topic || 'Summer street drop collection';
    return `[0:00 - 0:03] HOOK: Quick transition showing oversized silhouette against brutalist architecture.\n` +
      `[0:03 - 0:15] PROBLEM: Why typical ${cleanTopic} looks washed out on camera without proper structure.\n` +
      `[0:15 - 0:35] SOLUTION: Highlighting texture pairing, muted earth tones, and ${requirements || 'the signature drop'}.\n` +
      `[0:35 - 0:45] CALL TO ACTION: Check the link in bio for the early drop before it sells out.`;
  }

  generateCaptions(topic: string, hashtags: string[] = []): string {
    const cleanTopic = topic || 'Unfiltered street aesthetic for the summer drop';
    const tagList = hashtags.length > 0 ? hashtags.join(' ') : '#streetwear #creatoros #lookbook #aesthetic';
    return `Unfiltered street aesthetic for ${cleanTopic}. The silhouette drape speaks for itself. Which layer would you rock?\n\n${tagList}`;
  }

  generateCreatorIdea(type: 'hook' | 'script' | 'caption' | 'reel_concept', topic: string, niche: string): {
    title: string;
    content: string;
    tips: string[];
  } {
    const cleanTopic = topic || 'Urban Streetwear Essentials';
    const cleanNiche = niche || 'Fashion & Lifestyle';

    if (type === 'hook') {
      return {
        title: '3 Viral Hook Variations',
        content: `1. "Stop buying generic streetwear until you see this Mumbai drop."\n2. "The one fit everyone asked me about in Bandra this weekend."\n3. "Is this brand quietly making the cleanest silhouette in India right now?"`,
        tips: ['Deliver the first line in under 1.8 seconds', 'Start with motion or product close-up'],
      };
    }

    if (type === 'script') {
      return {
        title: '30-Second Reel Script (Colaba Golden Hour)',
        content: `[0:00-0:03] HOOK: "If you want that quiet luxury streetwear look without the import taxes, watch this."\n[0:03-0:12] SHOWCASE: Fast cut B-roll wearing oversized heavyweight tee + textured trousers against Colaba architecture.\n[0:12-0:22] DETAIL: Close-up on 280 GSM stitching, collar rigidity, drop shoulder silhouette.\n[0:22-0:30] CTA: "Drop code AURA20 for early access link in my bio. What color would you rock?"`,
        tips: ['Sync cuts to beat on second 0:03, 0:07, and 0:12', 'Natural audio mixed with 60% ambient jazz/lo-fi'],
      };
    }

    if (type === 'caption') {
      return {
        title: 'High-Engagement Caption & Hashtags',
        content: `Craft over hype. Tested this new oversized drop all week through Bombay heat—the 280 GSM cotton drape is crazy.\n\nUse code AURA20 for 20% off. Which fit is your favorite 1 or 2?\n\n#StreetwearIndia #ColabaStyle #MenswearEssentials #CreatorOS #AuraStreetwear`,
        tips: ['First 2 lines visible before "More" button', 'Ask a single direct question for comment velocity'],
      };
    }

    return {
      title: 'Reel Concept & Visual Architecture',
      content: `Concept: "Day in the Life: Styling One Piece 3 Ways"\nSetting: Industrial coffee bar + sunset rooftop\nColor Palette: Charcoal, warm amber, muted slate\nDeliverables: 1x 9:16 Reel (4K) + 2x Stories showing unboxing`,
      tips: ['Arri 35mm warmth setting in Live Studio', 'Capture vertical b-roll at 60fps for slow motion'],
    };
  }
}

export const byokAiService = new ByokAiService();
