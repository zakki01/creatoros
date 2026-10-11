export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'creator' | 'business' | 'super_admin';
  senderAvatar: string;
  content: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'file';
  campaignId?: string;
  campaignName?: string;
  reactions?: Record<string, number>;
  myReaction?: string;
  replyToId?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantHandle: string;
  participantAvatar: string;
  participantRole: 'creator' | 'business' | 'super_admin';
  participantBadge?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isOnline?: boolean;
  campaignContext?: {
    id: string;
    name: string;
    agreedFee: number;
    milestone: string;
  };
}
