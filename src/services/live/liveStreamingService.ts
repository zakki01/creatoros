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
    hostId: 'cr-101',
    hostName: 'Rohan Sharma',
    isHost: true,
    connectionState: 'idle',
    networkQuality: 'excellent',
    viewerCount: 0,
    participants: [
      {
        id: 'usr-v-01',
        name: 'Aarav Mehta',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80',
        role: 'viewer',
        isMuted: false,
        isBanned: false,
        joinedAt: '5m ago',
      },
      {
        id: 'usr-v-02',
        name: 'Maya Patel',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80',
        role: 'moderator',
        isMuted: false,
        isBanned: false,
        joinedAt: '12m ago',
      },
      {
        id: 'usr-v-03',
        name: 'Priya Sen',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80',
        role: 'viewer',
        isMuted: false,
        isBanned: false,
        joinedAt: '2m ago',
      },
    ],
    messages: [
      {
        id: 'msg-live-1',
        senderId: 'usr-v-01',
        senderName: 'Aarav Mehta',
        content: 'The lighting in this setup looks unreal! 🎬',
        type: 'chat',
        timestamp: '10:42 AM',
      },
      {
        id: 'msg-live-2',
        senderId: 'usr-v-02',
        senderName: 'Maya Patel',
        content: 'Welcome everyone! Keep questions friendly in the chat.',
        type: 'system',
        timestamp: '10:43 AM',
      },
      {
        id: 'msg-live-3',
        senderId: 'usr-v-03',
        senderName: 'Priya Sen',
        content: 'Sent a Studio Espresso!',
        type: 'gift',
        giftIcon: '☕',
        giftName: 'Studio Espresso',
        timestamp: '10:44 AM',
      },
    ],
    activeEffect: AR_EFFECTS_CATALOG[0],
  };

  private listeners = new Set<LiveRoomListener>();

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
    if (status === 'live') {
      this.currentState.viewerCount = Math.max(1, this.currentState.participants.length);
    } else {
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
