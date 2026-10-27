/**
 * CreatorOS LiveKit Realtime WebRTC Transport Service
 *
 * Implements real browser WebRTC transport using livekit-client.
 * Communicates with server-side endpoint POST /api/live/session to obtain signed JWT tokens.
 * Publishes the processed MediaStream (canvas video + mic audio).
 *
 * Features:
 * - Real viewer & participant counting (room.remoteParticipants.size; never fakes numbers)
 * - Honest connection quality telemetry (Connecting, Live, Reconnecting, Poor connection, Disconnected)
 * - Real-time WebRTC data channel messaging for live chat and virtual gifts
 * - Automatic reconnection handling
 */

import {
  Room,
  RoomEvent,
  Track,
  ConnectionQuality,
  LocalVideoTrack,
  LocalAudioTrack,
  DataPacket_Kind,
} from 'livekit-client';
import {
  TransportState,
  HonestNetworkStatus,
  LiveParticipant,
  LiveChatMessage,
} from '../../types';

export interface LiveKitSessionConfig {
  creatorId: string;
  creatorName: string;
  roomName?: string;
  role?: 'host' | 'viewer';
}

export interface LiveKitSessionDetails {
  token: string;
  wsUrl: string;
  roomName: string;
  identity: string;
}

export class LiveKitService {
  private room: Room | null = null;
  private state: TransportState = 'transport_unconfigured';
  private networkStatus: HonestNetworkStatus = 'Disconnected';
  private participants: LiveParticipant[] = [];
  private viewerCount = 0;
  private stateListeners = new Set<(state: TransportState) => void>();
  private networkListeners = new Set<(status: HonestNetworkStatus) => void>();
  private viewerCountListeners = new Set<(count: number) => void>();
  private chatListeners = new Set<(msg: LiveChatMessage) => void>();
  private activeVideoPublication: any = null;
  private activeAudioPublication: any = null;
  private lastSessionDetails: LiveKitSessionDetails | null = null;

  constructor() {
    this.updateState('transport_unconfigured');
  }

  public getState(): TransportState {
    return this.state;
  }

  public getNetworkStatus(): HonestNetworkStatus {
    return this.networkStatus;
  }

  public getViewerCount(): number {
    return this.viewerCount;
  }

  public getParticipants(): LiveParticipant[] {
    return this.participants;
  }

  public isLive(): boolean {
    return this.state === 'transport_live';
  }

  public subscribeState(listener: (state: TransportState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => this.stateListeners.delete(listener);
  }

  public subscribeNetwork(listener: (status: HonestNetworkStatus) => void): () => void {
    this.networkListeners.add(listener);
    listener(this.networkStatus);
    return () => this.networkListeners.delete(listener);
  }

  public subscribeViewerCount(listener: (count: number) => void): () => void {
    this.viewerCountListeners.add(listener);
    listener(this.viewerCount);
    return () => this.viewerCountListeners.delete(listener);
  }

  public subscribeChat(listener: (msg: LiveChatMessage) => void): () => void {
    this.chatListeners.add(listener);
    return () => this.chatListeners.delete(listener);
  }

  private updateState(newState: TransportState) {
    this.state = newState;
    this.stateListeners.forEach((fn) => fn(this.state));
  }

  private updateNetwork(newStatus: HonestNetworkStatus) {
    this.networkStatus = newStatus;
    this.networkListeners.forEach((fn) => fn(this.networkStatus));
  }

  private updateViewerCount(count: number) {
    this.viewerCount = count;
    this.viewerCountListeners.forEach((fn) => fn(this.viewerCount));
  }

  /**
   * Requests a signed LiveKit JWT session token from the secure server endpoint
   */
  public async requestSessionToken(config: LiveKitSessionConfig): Promise<LiveKitSessionDetails> {
    const res = await fetch('/api/live/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch LiveKit token: HTTP ${res.status}`);
    }

    const data = await res.json();
    this.lastSessionDetails = {
      token: data.token,
      wsUrl: data.wsUrl,
      roomName: data.roomName,
      identity: data.identity,
    };
    return this.lastSessionDetails;
  }

  /**
   * Connects to LiveKit Room and publishes the processed MediaStream
   */
  public async connectAndPublish(
    sessionDetails: LiveKitSessionDetails,
    processedStream: MediaStream,
    isAudioEnabled: boolean = true
  ): Promise<void> {
    this.updateState('transport_connecting');
    this.updateNetwork('Connecting');

    try {
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      this.setupRoomEventHandlers(this.room);

      // Connect to LiveKit WebRTC server
      await this.room.connect(sessionDetails.wsUrl, sessionDetails.token);

      // Publish processed canvas video track
      const videoTrack = processedStream.getVideoTracks()[0];
      if (videoTrack) {
        const localVideo = new LocalVideoTrack(videoTrack);
        this.activeVideoPublication = await this.room.localParticipant.publishTrack(localVideo, {
          name: 'camera-ar',
          source: Track.Source.Camera,
        });
      }

      // Publish microphone audio track if enabled
      const audioTrack = processedStream.getAudioTracks()[0];
      if (audioTrack && isAudioEnabled) {
        const localAudio = new LocalAudioTrack(audioTrack);
        this.activeAudioPublication = await this.room.localParticipant.publishTrack(localAudio, {
          name: 'microphone',
          source: Track.Source.Microphone,
        });
      }

      // Transition to LIVE only after tracks are published
      this.updateState('transport_live');
      this.updateNetwork('Live');
      this.syncParticipants();
    } catch (err: any) {
      console.error('[LiveKitService] Connection/publish failed:', err);
      this.updateState('transport_error');
      this.updateNetwork('Disconnected');
      throw err;
    }
  }

  /**
   * Broadcasts a chat message or virtual gift over the WebRTC data channel
   */
  public async sendChatMessage(message: LiveChatMessage): Promise<void> {
    if (!this.room || this.state !== 'transport_live') {
      // Local preview mode: deliver locally
      this.chatListeners.forEach((fn) => fn(message));
      return;
    }

    try {
      const payload = new TextEncoder().encode(JSON.stringify(message));
      await this.room.localParticipant.publishData(payload, { reliable: true });
      // Notify local listeners
      this.chatListeners.forEach((fn) => fn(message));
    } catch (err) {
      console.warn('[LiveKitService] Failed to publish chat payload:', err);
      this.chatListeners.forEach((fn) => fn(message));
    }
  }

  public async toggleMicrophone(enabled: boolean): Promise<void> {
    if (this.activeAudioPublication && this.activeAudioPublication.track) {
      if (enabled) {
        await this.activeAudioPublication.track.unmute();
      } else {
        await this.activeAudioPublication.track.mute();
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.room) {
      try {
        await this.room.disconnect();
      } catch (err) {
        console.warn('[LiveKitService] Error disconnecting room:', err);
      }
      this.room = null;
    }

    this.activeVideoPublication = null;
    this.activeAudioPublication = null;
    this.participants = [];
    this.updateViewerCount(0);
    this.updateState('transport_disconnected');
    this.updateNetwork('Disconnected');
  }

  private setupRoomEventHandlers(room: Room) {
    room.on(RoomEvent.Connected, () => {
      this.updateState('transport_live');
      this.updateNetwork('Live');
      this.syncParticipants();
    });

    room.on(RoomEvent.ParticipantConnected, () => {
      this.syncParticipants();
    });

    room.on(RoomEvent.ParticipantDisconnected, () => {
      this.syncParticipants();
    });

    room.on(RoomEvent.Reconnecting, () => {
      this.updateNetwork('Reconnecting');
    });

    room.on(RoomEvent.Reconnected, () => {
      this.updateState('transport_live');
      this.updateNetwork('Live');
      this.syncParticipants();
    });

    room.on(RoomEvent.Disconnected, () => {
      this.updateState('transport_disconnected');
      this.updateNetwork('Disconnected');
      this.updateViewerCount(0);
      this.participants = [];
    });

    room.on(RoomEvent.ConnectionQualityChanged, (quality: ConnectionQuality) => {
      switch (quality) {
        case ConnectionQuality.Excellent:
        case ConnectionQuality.Good:
          this.updateNetwork('Live');
          break;
        case ConnectionQuality.Poor:
          this.updateNetwork('Poor connection');
          break;
        default:
          break;
      }
    });

    // Handle incoming data channel messages (Chat, Gifts)
    room.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: any) => {
      try {
        const text = new TextDecoder().decode(payload);
        const data = JSON.parse(text) as LiveChatMessage;
        if (participant && !data.senderId) {
          data.senderId = participant.identity;
          data.senderName = participant.name || participant.identity;
        }
        this.chatListeners.forEach((fn) => fn(data));
      } catch (err) {
        console.warn('[LiveKitService] Failed to decode incoming DataReceived payload:', err);
      }
    });
  }

  private syncParticipants() {
    if (!this.room) {
      this.updateViewerCount(0);
      this.participants = [];
      return;
    }

    // Real remote viewer count
    const remotes = Array.from(this.room.remoteParticipants.values());
    this.updateViewerCount(remotes.length);

    this.participants = remotes.map((p) => ({
      id: p.identity,
      name: p.name || p.identity,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.identity)}`,
      role: 'viewer',
      isMuted: false,
      isBanned: false,
      joinedAt: new Date().toISOString(),
    }));
  }
}

export const liveKitSingleton = new LiveKitService();
