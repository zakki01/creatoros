import { Conversation, DirectMessage } from '../types/messaging';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-aura-rohan',
    participantId: 'creator-rohan',
    participantName: 'Rohan Sharma',
    participantHandle: '@rohansharma',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    participantRole: 'creator',
    participantBadge: 'Top Rated Creator',
    lastMessage: 'Hey! I just uploaded the first draft cut with the dynamic 3D transitions. Let me know your thoughts!',
    lastTimestamp: '10:45 AM',
    unreadCount: 1,
    isOnline: true,
    campaignContext: {
      id: 'camp-aura-summer',
      name: 'Global Summer Drop 2026',
      agreedFee: 3200,
      milestone: 'Draft Review Pending'
    }
  },
  {
    id: 'conv-techpulse-elena',
    participantId: 'creator-elena',
    participantName: 'Elena Rostova',
    participantHandle: '@elenacreates',
    participantAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    participantRole: 'creator',
    participantBadge: 'Verified Creator',
    lastMessage: 'The script looks solid! We approved the B-roll sequence. Ready for recording.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    campaignContext: {
      id: 'camp-techpulse-anc',
      name: 'Studio Pro ANC Review Blitz',
      agreedFee: 4500,
      milestone: 'Script Approved'
    }
  },
  {
    id: 'conv-hydraboost-marcus',
    participantId: 'creator-marcus',
    participantName: 'Marcus Vance',
    participantHandle: '@marcusfit',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    participantRole: 'creator',
    participantBadge: 'Fitness Specialist',
    lastMessage: 'Escrow payment released for Milestone 2. Great working with you Marcus!',
    lastTimestamp: 'Oct 3',
    unreadCount: 0,
    isOnline: true,
    campaignContext: {
      id: 'camp-hydraboost-launch',
      name: 'HydraBoost Pre-workout Launch',
      agreedFee: 2800,
      milestone: 'Completed & Paid'
    }
  }
];

export const INITIAL_MESSAGES: Record<string, DirectMessage[]> = {
  'conv-aura-rohan': [
    {
      id: 'msg-1',
      conversationId: 'conv-aura-rohan',
      senderId: 'brand-aura',
      senderName: 'Aura Streetwear Co.',
      senderRole: 'business',
      senderAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      content: 'Hi Rohan! Welcome aboard for the Summer Drop 2026 campaign. We love your moodboard.',
      timestamp: 'Yesterday at 3:15 PM',
      campaignId: 'camp-aura-summer',
      campaignName: 'Global Summer Drop 2026'
    },
    {
      id: 'msg-2',
      conversationId: 'conv-aura-rohan',
      senderId: 'creator-rohan',
      senderName: 'Rohan Sharma',
      senderRole: 'creator',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: 'Thanks team! Excited to work together. Shooting the lookbook on 4K 60fps with the oversized hoodie sample.',
      timestamp: 'Yesterday at 4:20 PM'
    },
    {
      id: 'msg-3',
      conversationId: 'conv-aura-rohan',
      senderId: 'creator-rohan',
      senderName: 'Rohan Sharma',
      senderRole: 'creator',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: 'Hey! I just uploaded the first draft cut with the dynamic 3D transitions. Let me know your thoughts!',
      timestamp: '10:45 AM',
      attachmentUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      attachmentType: 'image'
    }
  ]
};

export class MessagingService {
  private conversations: Conversation[] = [...INITIAL_CONVERSATIONS];
  private messages: Record<string, DirectMessage[]> = { ...INITIAL_MESSAGES };

  getConversations(): Conversation[] {
    return this.conversations;
  }

  getMessages(conversationId: string): DirectMessage[] {
    return this.messages[conversationId] || [];
  }

  sendMessage(conversationId: string, message: Omit<DirectMessage, 'id' | 'timestamp'>): DirectMessage {
    const newMsg: DirectMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMsg);

    // Update conversation last message
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = newMsg.content;
      conv.lastTimestamp = newMsg.timestamp;
      conv.unreadCount = 0;
    }

    return newMsg;
  }

  markAsRead(conversationId: string): void {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.unreadCount = 0;
    }
  }

  getTotalUnread(): number {
    return this.conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  }
}

export const messagingService = new MessagingService();
