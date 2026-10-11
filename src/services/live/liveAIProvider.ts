import { ILiveAIProvider, LiveEngineConfig } from '../../types';
import { DecartProvider } from './decartProvider';

export const LIVE_CONFIG_STORAGE_KEY = 'creatoros_live_engine_config_v1';

export const DEFAULT_LIVE_ENGINE_CONFIG: LiveEngineConfig = {
  enabled: true,
  provider: 'decart',
  apiKey: '',
  apiEndpoint: 'https://api.decart.ai/v1',
  defaultModel: 'mirage-realtime-v1',
  maxSessionDurationSec: 30, // 30 seconds default session duration (cost protection)
  enableAudio: true,
  defaultFps: 30,
};

export function getStoredLiveEngineConfig(): LiveEngineConfig {
  try {
    const raw = localStorage.getItem(LIVE_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_LIVE_ENGINE_CONFIG;
    return { ...DEFAULT_LIVE_ENGINE_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_LIVE_ENGINE_CONFIG;
  }
}

export function saveStoredLiveEngineConfig(config: Partial<LiveEngineConfig>): LiveEngineConfig {
  const current = getStoredLiveEngineConfig();
  const updated: LiveEngineConfig = { ...current, ...config };
  try {
    localStorage.setItem(LIVE_CONFIG_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save Live Engine config:', err);
  }
  return updated;
}

export function createLiveAIProvider(config?: LiveEngineConfig): ILiveAIProvider {
  const resolvedConfig = config || getStoredLiveEngineConfig();
  return new DecartProvider(resolvedConfig);
}
