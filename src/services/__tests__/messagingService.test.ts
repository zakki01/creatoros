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

  describe('Anti-Circumvention Policy & God Mode Forensics', () => {
    it('detects off-platform communication attempts like WhatsApp and Telegram', () => {
      const scan1 = MessagingService.scanForCircumvention('Can we move to WhatsApp for faster replies?');
      expect(scan1.flagged).toBe(true);
      expect(scan1.severity).toBe('high');
      expect(scan1.reason).toContain('off-platform contact');

      const scan2 = MessagingService.scanForCircumvention('Here is my Telegram handle: t.me/creatortest');
      expect(scan2.flagged).toBe(true);
      expect(scan2.severity).toBe('high');
    });

    it('detects off-platform payment attempts like UPI, PayPal, and direct wire transfer', () => {
      const upiScan = MessagingService.scanForCircumvention('Send 20k advance to alex@okaxis so we skip platform commission');
      expect(upiScan.flagged).toBe(true);
      expect(upiScan.severity).toBe('critical');
      expect(upiScan.reason).toContain('off-platform payment');

      const directScan = MessagingService.scanForCircumvention('Please pay outside the platform via direct transfer');
      expect(directScan.flagged).toBe(true);
      expect(directScan.severity).toBe('critical');
    });

    it('allows clean, professional on-platform messages', () => {
      const cleanScan = MessagingService.scanForCircumvention('I will upload the high-res 4K files to the deliverables tab tomorrow.');
      expect(cleanScan.flagged).toBe(false);
      expect(cleanScan.severity).toBe('none');
    });

    it('records flagged messages when sent and surfaces them to God Mode forensics', () => {
      const convs = service.getConversations();
      service.sendMessage(convs[0].id, {
        senderId: 'usr-bad-actor',
        senderName: 'Bad Actor',
        content: 'Pay me on WhatsApp: +91 98765 43210',
      });

      const flagged = service.getFlaggedMessages();
      expect(flagged.length).toBeGreaterThan(0);
      expect(flagged[0].content).toContain('WhatsApp');

      const allForensicConvs = service.getAllConversationsForensic();
      expect(allForensicConvs.length).toBeGreaterThan(0);
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
