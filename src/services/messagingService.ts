import { Conversation, DirectMessage, MessageType, AttachmentType } from '../types/messaging';
import { supabase } from './supabaseClient';

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
      milestone: 'Draft Review Pending',
    },
  },
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
      campaignName: 'Global Summer Drop 2026',
    },
    {
      id: 'msg-2',
      conversationId: 'conv-aura-rohan',
      senderId: 'creator-rohan',
      senderName: 'Rohan Sharma',
      senderRole: 'creator',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: 'Thanks team! Excited to work together. Shooting the lookbook on 4K 60fps with the oversized hoodie sample.',
      timestamp: 'Yesterday at 4:20 PM',
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
      attachmentType: 'image',
    },
  ],
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMsg);

    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessage = newMsg.content || (newMsg.attachmentType === 'gif' ? 'Sent a GIF' : 'Sent an attachment');
      conv.lastTimestamp = newMsg.timestamp;
      conv.unreadCount = 0;
    }

    return newMsg;
  }

  markAsRead(conversationId: string): void {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.unreadCount = 0;
    }
  }

  getTotalUnread(): number {
    return this.conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  }

  // =========================================================================
  // SUPABASE REAL PRODUCTION PERSISTENCE METHODS
  // =========================================================================

  /**
   * Fetches real conversations for an authenticated user from public.conversations.
   */
  async fetchUserConversations(userId: string): Promise<Conversation[]> {
    if (!supabase || !userId) return [];

    try {
      const { data: convRows, error } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_one,
          participant_two,
          last_message_at,
          created_at
        `)
        .or(`participant_one.eq.${userId},participant_two.eq.${userId}`)
        .order('last_message_at', { ascending: false });

      if (error || !convRows) {
        console.warn('Error fetching conversations from Supabase:', error?.message);
        return [];
      }

      const results: Conversation[] = [];

      for (const row of convRows) {
        const otherId = row.participant_one === userId ? row.participant_two : row.participant_one;

        // Fetch other participant profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url, role')
          .eq('id', otherId)
          .maybeSingle();

        // Fetch last message
        const { data: lastMsg } = await supabase
          .from('messages')
          .select('content, message_type, attachment_url, created_at, is_read, sender_id')
          .eq('conversation_id', row.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Count unread
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', row.id)
          .eq('is_read', false)
          .neq('sender_id', userId);

        const role = (profile?.role as any) || 'creator';
        const name = profile?.display_name || 'Participant';
        const handle = `@${name.toLowerCase().replace(/\s+/g, '')}`;

        results.push({
          id: row.id,
          participantId: otherId,
          participantName: name,
          participantHandle: handle,
          participantAvatar: profile?.avatar_url || '',
          participantRole: role,
          participantBadge: role === 'business' ? 'Verified Brand' : 'Verified Creator',
          lastMessage: lastMsg?.content || (lastMsg?.message_type === 'gif' ? 'Sent a GIF' : lastMsg?.attachment_url ? 'Sent an attachment' : 'Started conversation'),
          lastTimestamp: lastMsg?.created_at
            ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unreadCount: unreadCount || 0,
          isOnline: true,
        });
      }

      return results;
    } catch (err) {
      console.warn('Exception in fetchUserConversations:', err);
      return [];
    }
  }

  /**
   * Fetches real messages for a conversation from public.messages.
   */
  async fetchMessages(conversationId: string): Promise<DirectMessage[]> {
    if (!supabase || !conversationId) return [];

    try {
      const { data: rows, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          message_type,
          attachment_url,
          media_metadata,
          is_read,
          contract_reference_id,
          created_at,
          profiles!messages_sender_id_fkey (display_name, avatar_url, role)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error || !rows) {
        console.warn('Error fetching messages from Supabase:', error?.message);
        return [];
      }

      return rows.map((r: any) => {
        const senderProfile = r.profiles || {};
        return {
          id: r.id,
          conversationId: r.conversation_id,
          senderId: r.sender_id,
          senderName: senderProfile.display_name || 'User',
          senderRole: (senderProfile.role as any) || 'creator',
          senderAvatar: senderProfile.avatar_url || '',
          content: r.content || '',
          timestamp: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messageType: r.message_type as MessageType,
          attachmentUrl: r.attachment_url,
          attachmentType: r.attachment_url ? (r.message_type as AttachmentType) : undefined,
          mediaMetadata: r.media_metadata,
        };
      });
    } catch (err) {
      console.warn('Exception in fetchMessages:', err);
      return [];
    }
  }

  /**
   * Sends a real message to public.messages and bumps conversation last_message_at.
   */
  async sendRealMessage(params: {
    conversationId: string;
    senderId: string;
    content: string;
    messageType?: MessageType;
    attachmentUrl?: string;
    mediaMetadata?: any;
    contractReferenceId?: string;
  }): Promise<DirectMessage | null> {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: params.conversationId,
          sender_id: params.senderId,
          content: params.content,
          message_type: params.messageType || 'text',
          attachment_url: params.attachmentUrl || null,
          media_metadata: params.mediaMetadata || null,
          contract_reference_id: params.contractReferenceId || null,
        })
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          message_type,
          attachment_url,
          media_metadata,
          created_at,
          profiles!messages_sender_id_fkey (display_name, avatar_url, role)
        `)
        .single();

      if (error || !data) {
        console.error('Failed to insert message into Supabase:', error?.message);
        return null;
      }

      // Bump conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', params.conversationId);

      const profile = (data as any).profiles || {};
      return {
        id: data.id,
        conversationId: data.conversation_id,
        senderId: data.sender_id,
        senderName: profile.display_name || 'User',
        senderRole: profile.role || 'creator',
        senderAvatar: profile.avatar_url || '',
        content: data.content || '',
        timestamp: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messageType: data.message_type as MessageType,
        attachmentUrl: data.attachment_url,
        attachmentType: data.attachment_url ? (data.message_type as AttachmentType) : undefined,
        mediaMetadata: data.media_metadata,
      };
    } catch (err) {
      console.error('Exception in sendRealMessage:', err);
      return null;
    }
  }

  /**
   * Submits a Trust & Safety report into public.user_reports.
   */
  async submitUserReport(
    reporterId: string,
    reportedUserId: string,
    reason: string,
    conversationId?: string,
    messageId?: string
  ): Promise<{ success: boolean; id?: string }> {
    if (!supabase) return { success: false };

    try {
      const { data, error } = await supabase
        .from('user_reports')
        .insert({
          reporter_id: reporterId,
          reported_user_id: reportedUserId,
          reason,
          conversation_id: conversationId || null,
          message_id: messageId || null,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) {
        console.warn('Failed to insert user report:', error.message);
        return { success: false };
      }

      return { success: true, id: data?.id };
    } catch (err) {
      console.error('Exception in submitUserReport:', err);
      return { success: false };
    }
  }

  /**
   * Blocks a user in public.user_blocks.
   */
  async blockParticipant(blockerId: string, blockedUserId: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('user_blocks')
        .insert({
          blocker_id: blockerId,
          blocked_user_id: blockedUserId,
        });

      if (error) {
        console.warn('Failed to insert user block:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception in blockParticipant:', err);
      return false;
    }
  }

  /**
   * Sets mute setting in public.conversation_settings.
   */
  async setConversationMute(userId: string, conversationId: string, isMuted: boolean): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('conversation_settings')
        .upsert(
          {
            user_id: userId,
            conversation_id: conversationId,
            is_muted: isMuted,
          },
          { onConflict: 'user_id,conversation_id' }
        );

      if (error) {
        console.warn('Failed to set conversation mute in Supabase:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception in setConversationMute:', err);
      return false;
    }
  }

  /**
   * Gets mute setting from public.conversation_settings.
   */
  async getConversationMute(userId: string, conversationId: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { data } = await supabase
        .from('conversation_settings')
        .select('is_muted')
        .eq('user_id', userId)
        .eq('conversation_id', conversationId)
        .maybeSingle();

      return Boolean(data?.is_muted);
    } catch {
      return false;
    }
  }
}

export const messagingService = new MessagingService();
