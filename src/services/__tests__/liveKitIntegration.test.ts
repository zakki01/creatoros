import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LiveKitService } from '../live/liveKitService';

describe('LiveKit Integration & WebRTC Session Management', () => {
  let service: LiveKitService;

  beforeEach(() => {
    service = new LiveKitService();
    vi.restoreAllMocks();
  });

  it('initializes in transport_unconfigured state with 0 viewers', () => {
    expect(service.getState()).toBe('transport_unconfigured');
    expect(service.getNetworkStatus()).toBe('Disconnected');
    expect(service.getViewerCount()).toBe(0);
    expect(service.isLive()).toBe(false);
  });

  it('notifies subscribers on transport state changes', () => {
    const states: string[] = [];
    const unsubscribe = service.subscribeState((st) => {
      states.push(st);
    });

    expect(states).toContain('transport_unconfigured');
    unsubscribe();
  });

  it('requests and receives session tokens with host publishing grants', async () => {
    const fakeTokenResponse = {
      token: 'jwt.livekit.sample.token',
      wsUrl: 'wss://livekit.creatoros.ai',
      roomName: 'room_live_zakki_101',
      identity: 'creator_zakki',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => fakeTokenResponse,
    } as any);

    const details = await service.requestSessionToken({
      roomName: 'room_live_zakki_101',
      identity: 'creator_zakki',
      isHost: true,
    });

    expect(details.token).toBe('jwt.livekit.sample.token');
    expect(details.wsUrl).toBe('wss://livekit.creatoros.ai');
    expect(details.identity).toBe('creator_zakki');
  });

  it('handles backend token endpoint failure with informative error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: 'LiveKit SFU cluster unavailable' }),
    } as any);

    await expect(
      service.requestSessionToken({
        roomName: 'room_fail',
        identity: 'creator_fail',
        isHost: false,
      })
    ).rejects.toThrow('LiveKit SFU cluster unavailable');
  });
});
