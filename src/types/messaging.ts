export type MessageType = 'text' | 'image' | 'video' | 'file' | 'gif' | 'profile_card';
export type AttachmentType = 'image' | 'video' | 'file' | 'gif';

export interface GifMetadata {
  mimeType: 'image/gif';
  fileName: string;
  fileSize: number;
  width?: number;
  height?: number;
  storagePath: string;
  storageUrl: string;
  thumbnailUrl?: string;
  createdAt?: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'creator' | 'business' | 'super_admin';
  senderAvatar: string;
  content: string;
  timestamp: string;
  messageType?: MessageType;
  attachmentUrl?: string;
  attachmentType?: AttachmentType;
  mediaMetadata?: GifMetadata;
  uploadStatus?: 'uploading' | 'sent' | 'failed';
  uploadProgress?: number;
  campaignId?: string;
  campaignName?: string;
  reactions?: Record<string, number>;
  myReaction?: string;
  replyToId?: string;
  profileCardData?: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    role: 'creator' | 'business';
    category?: string;
    followers?: string;
    engagementRate?: number;
    availabilityStatus?: string;
    verified?: boolean;
    bio?: string;
  };
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
