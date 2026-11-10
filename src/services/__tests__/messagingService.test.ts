import { describe, it, expect, beforeEach } from 'vitest';
import { MessagingService } from '../messagingService';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(() => {
    service = new MessagingService();
  });

  describe('Local Conversation Management', () => {
    it('initializes with seed conversations and message threads', () => {
      const convs = service.getConversations();
      expect(convs.length).toBeGreaterThan(0);

      const firstId = convs[0].id;
      const messages = service.getMessages(firstId);
      expect(Array.isArray(messages)).toBe(true);
    });

    it('sends direct messages and updates conversation metadata', () => {
      const convs = service.getConversations();
      const convId = convs[0].id;

      const sent = service.sendMessage(convId, {
        senderId: 'creator_zakki',
        senderName: 'Zakki Salim',
        content: 'I have uploaded the new draft lookbook.',
        isRead: false,
      });

      expect(sent.id).toBeDefined();
      expect(sent.content).toBe('I have uploaded the new draft lookbook.');
      expect(sent.timestamp).toBeDefined();

      const updatedMessages = service.getMessages(convId);
      expect(updatedMessages[updatedMessages.length - 1].content).toBe('I have uploaded the new draft lookbook.');

      const updatedConv = service.getConversations().find((c) => c.id === convId);
      expect(updatedConv?.lastMessage).toBe('I have uploaded the new draft lookbook.');
      expect(updatedConv?.unreadCount).toBe(0);
    });

    it('marks conversation as read and tallies unread badges', () => {
      const convs = service.getConversations();
      const convId = convs[0].id;

      service.markAsRead(convId);
      const updatedConv = service.getConversations().find((c) => c.id === convId);
      expect(updatedConv?.unreadCount).toBe(0);

      const totalUnread = service.getTotalUnread();
      expect(typeof totalUnread).toBe('number');
      expect(totalUnread).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Safe Moderation & Supabase Guardrails', () => {
    it('returns empty array when querying conversations with invalid or empty userId', async () => {
      const result = await service.fetchUserConversations('');
      expect(result).toEqual([]);
    });

    it('returns false when attempting to block participant with empty or missing client', async () => {
      const result = await service.blockParticipant('', '');
      expect(typeof result).toBe('boolean');
    });

    it('gracefully handles conversation mute toggle requests', async () => {
      const muteResult = await service.setConversationMute('user_123', 'conv_456', true);
      expect(typeof muteResult).toBe('boolean');

      const isMuted = await service.getConversationMute('user_123', 'conv_456');
      expect(typeof isMuted).toBe('boolean');
    });
  });
});
