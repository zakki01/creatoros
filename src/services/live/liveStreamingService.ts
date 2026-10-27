/**
 * CreatorOS Modular Live Streaming Architecture
 * Implements provider-independent video pipeline:
 * Camera -> Face/AR Tracking -> Effect Engine -> LiveKit/WebRTC -> Viewer
 */

import {
  LiveConnectionState,
  LiveParticipant,
  LiveChatMessage,
  NetworkQuality,
  ArEffect,
} from '../../types/liveStudio';
import { AR_EFFECTS_CATALOG } from './arEffectCatalog';
import { liveKitSingleton } from './liveKitService';

export interface LiveRoomState {
  roomId: string;
  hostId: string;
  hostName: string;
  isHost: boolean;
  connectionState: LiveConnectionState;
  networkQuality: NetworkQuality;
  viewerCount: number;
  participants: LiveParticipant[];
  messages: LiveChatMessage[];
  activeEffect: ArEffect;
}

export type LiveRoomListener = (state: LiveRoomState) => void;

class LiveStreamingServiceSingleton {
  private currentState: LiveRoomState = {
    roomId: 'room-studio-live-01',
    hostId: 'cr-01',
    hostName: 'Rohan Sharma',
    isHost: true,
    connectionState: 'idle',
    networkQuality: 'excellent',
    viewerCount: 0,
    participants: [],
    messages: [
      {
        id: 'msg-live-1',
        senderId: 'sys-01',
        senderName: 'CreatorOS Studio',
        content: 'Broadcasting workspace initialized. Connect LiveKit to stream worldwide.',
        type: 'system',
        timestamp: 'Just now',
      },
    ],
    activeEffect: AR_EFFECTS_CATALOG[0],
  };

  private listeners = new Set<LiveRoomListener>();

  constructor() {
    // Sync with LiveKit WebRTC events
    liveKitSingleton.subscribeViewerCount((count) => {
      this.currentState.viewerCount = count;
      this.notify();
    });

    liveKitSingleton.subscribeNetwork((status) => {
      let q: NetworkQuality = 'excellent';
      if (status === 'Poor connection') q = 'poor';
      else if (status === 'Reconnecting') q = 'reconnecting';
      this.currentState.networkQuality = q;
      this.notify();
    });

    liveKitSingleton.subscribeChat((msg) => {
      if (!this.currentState.messages.some((m) => m.id === msg.id)) {
        this.currentState.messages.push(msg);
        this.notify();
      }
    });
  }

  subscribe(listener: LiveRoomListener): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener({ ...this.currentState });
    }
  }

  getState(): LiveRoomState {
    return { ...this.currentState };
  }

  setConnectionState(status: LiveConnectionState): void {
    this.currentState.connectionState = status;
    if (status !== 'live') {
      this.currentState.viewerCount = 0;
    }
    this.notify();
  }

  setNetworkQuality(quality: NetworkQuality): void {
    this.currentState.networkQuality = quality;
    this.notify();
  }

  setActiveEffect(effect: ArEffect): void {
    this.currentState.activeEffect = effect;
    this.notify();
  }

  sendMessage(
    senderId: string,
    senderName: string,
    content: string,
    type: 'chat' | 'gift' | 'system' | 'moderation' = 'chat',
    giftIcon?: string,
    giftName?: string
  ): void {
    const newMessage: LiveChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      senderId,
      senderName,
      content,
      type,
      giftIcon,
      giftName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.currentState.messages.push(newMessage);
    this.notify();

    // Broadcast over LiveKit WebRTC Data Channel if connected
    liveKitSingleton.sendChatMessage(newMessage).catch(() => {});
  }

  // Host Moderation Actions
  muteParticipant(participantId: string): void {
    const p = this.currentState.participants.find((item) => item.id === participantId);
    if (p) {
      p.isMuted = !p.isMuted;
      this.sendMessage(
        'system',
        'System',
        `${p.name} was ${p.isMuted ? 'muted' : 'unmuted'} by the host.`,
        'moderation'
      );
      this.notify();
    }
  }

  kickParticipant(participantId: string): void {
    const p = this.currentState.participants.find((item) => item.id === participantId);
    if (p) {
      this.currentState.participants = this.currentState.participants.filter((item) => item.id !== participantId);
      this.currentState.viewerCount = Math.max(0, this.currentState.viewerCount - 1);
      this.sendMessage(
        'system',
        'System',
        `${p.name} was removed from the live room.`,
        'moderation'
      );
      this.notify();
    }
  }

  banParticipant(participantId: string): void {
    const p = this.currentState.participants.find((item) => item.id === participantId);
    if (p) {
      p.isBanned = true;
      this.currentState.participants = this.currentState.participants.filter((item) => item.id !== participantId);
      this.currentState.viewerCount = Math.max(0, this.currentState.viewerCount - 1);
      this.sendMessage(
        'system',
        'System',
        `${p.name} has been banned from this live stream by the host.`,
        'moderation'
      );
      this.notify();
    }
  }
}

export const LiveStreamingService = new LiveStreamingServiceSingleton();
