import { SupportTicket, TicketStatus, TicketIssueType, TicketPriority, TicketMessage } from '../types/support';

const STORAGE_TICKETS_KEY = 'creatoros_support_tickets_v1';

const INITIAL_MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-10248',
    ticketNumber: 'CR-10248',
    userId: 'biz-101',
    userName: 'Aura Streetwear Co.',
    userEmail: 'partnerships@aurastreetwear.com',
    userRole: 'business',
    issueType: 'Contracts',
    subject: 'Escrow hold question regarding contract #CR-2026-8491',
    description: 'We funded the protected hold for Alex Morgan, but wanted to verify how the 3-day review window auto-approval triggers if our creative director is out of office.',
    priority: 'medium',
    status: 'IN_PROGRESS',
    assignedAdmin: 'Sarah Connor',
    attachments: [],
    messages: [
      {
        id: 'msg-01',
        senderId: 'biz-101',
        senderName: 'Aura Streetwear Co.',
        senderRole: 'brand',
        message: 'We funded the protected hold for Alex Morgan, but wanted to verify how the 3-day review window auto-approval triggers if our creative director is out of office.',
        timestamp: '2026-10-10T10:15:00Z',
      },
      {
        id: 'msg-02',
        senderId: 'admin-001',
        senderName: 'Sarah Connor (Support Lead)',
        senderRole: 'support',
        message: 'Hello Aura team! The 3-day review window countdown starts the moment the creator submits v1. If you need an extension, you can submit an Amendment or request a revision round directly from the Active Workspace.',
        timestamp: '2026-10-10T11:30:00Z',
      },
      {
        id: 'msg-03',
        senderId: 'admin-001',
        senderName: 'Sarah Connor',
        senderRole: 'admin',
        isInternalNote: true,
        message: 'Internal note: Brand has high transaction volume. Verified their Stripe Connect balance is healthy.',
        timestamp: '2026-10-10T11:31:00Z',
      },
    ],
    createdAt: '2026-10-10T10:15:00Z',
    updatedAt: '2026-10-10T11:30:00Z',
  },
  {
    id: 'tkt-10249',
    ticketNumber: 'CR-10249',
    userId: 'cr-01',
    userName: 'Alex Morgan',
    userEmail: 'alex@creatoros.ai',
    userRole: 'creator',
    issueType: 'Payments',
    subject: 'Stripe Express Payout schedule inquiry',
    description: 'I completed my lookbook reels milestone yesterday. Can you confirm when the protected release transfers to my connected bank account?',
    priority: 'high',
    status: 'OPEN',
    attachments: [],
    messages: [
      {
        id: 'msg-11',
        senderId: 'cr-01',
        senderName: 'Alex Morgan',
        senderRole: 'creator',
        message: 'I completed my lookbook reels milestone yesterday. Can you confirm when the protected release transfers to my connected bank account?',
        timestamp: '2026-10-11T14:20:00Z',
      },
    ],
    createdAt: '2026-10-11T14:20:00Z',
    updatedAt: '2026-10-11T14:20:00Z',
  },
];

export class SupportService {
  private static tickets: SupportTicket[] | null = null;

  private static loadTickets(): SupportTicket[] {
    if (this.tickets) return this.tickets;
    const saved = localStorage.getItem(STORAGE_TICKETS_KEY);
    if (saved) {
      try {
        this.tickets = JSON.parse(saved);
        return this.tickets!;
      } catch (e) {
        console.error('Failed to parse tickets, using fallback', e);
      }
    }
    this.tickets = [...INITIAL_MOCK_TICKETS];
    this.saveTickets(this.tickets);
    return this.tickets;
  }

  private static saveTickets(tickets: SupportTicket[]): void {
    this.tickets = tickets;
    localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
  }

  static getAllTickets(filter?: {
    status?: string;
    issueType?: string;
    search?: string;
  }): SupportTicket[] {
    let list = this.loadTickets();

    if (filter?.status && filter.status !== 'all') {
      list = list.filter((t) => t.status.toLowerCase() === filter.status!.toLowerCase());
    }

    if (filter?.issueType && filter.issueType !== 'all') {
      list = list.filter((t) => t.issueType.toLowerCase() === filter.issueType!.toLowerCase());
    }

    if (filter?.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.userName.toLowerCase().includes(q) ||
          t.userEmail.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static getTicketsByUser(userId: string): SupportTicket[] {
    const list = this.loadTickets();
    return list
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static getTicketById(ticketId: string): SupportTicket | null {
    const list = this.loadTickets();
    return list.find((t) => t.id === ticketId || t.ticketNumber === ticketId) || null;
  }

  static createTicket(params: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'creator' | 'business' | 'super_admin';
    issueType: TicketIssueType;
    subject: string;
    description: string;
    priority?: TicketPriority;
    attachments?: { name: string; url: string; sizeBytes?: number }[];
  }): SupportTicket {
    const list = this.loadTickets();
    const ticketSeq = Math.floor(10000 + Math.random() * 90000);
    const now = new Date().toISOString();

    const newTicket: SupportTicket = {
      id: `tkt-${ticketSeq}`,
      ticketNumber: `CR-${ticketSeq}`,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      userRole: params.userRole,
      issueType: params.issueType,
      subject: params.subject,
      description: params.description,
      priority: params.priority || 'medium',
      status: 'OPEN',
      attachments: params.attachments || [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: params.userId,
          senderName: params.userName,
          senderRole: params.userRole === 'business' ? 'brand' : 'creator',
          message: params.description,
          attachments: params.attachments,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newTicket, ...list];
    this.saveTickets(updated);

    return newTicket;
  }

  static addReply(
    ticketId: string,
    message: string,
    sender: {
      id: string;
      name: string;
      role: 'user' | 'creator' | 'brand' | 'admin' | 'support';
    },
    isInternalNote = false
  ): SupportTicket | null {
    const list = this.loadTickets();
    const idx = list.findIndex((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (idx === -1) return null;

    const ticket = { ...list[idx] };
    const now = new Date().toISOString();

    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      message,
      isInternalNote,
      timestamp: now,
    };

    ticket.messages = [...ticket.messages, newMsg];
    ticket.updatedAt = now;

    // Auto-update status if admin replied to user
    if ((sender.role === 'admin' || sender.role === 'support') && !isInternalNote) {
      if (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') {
        ticket.status = 'WAITING_FOR_USER';
      }
    } else if (sender.role === 'brand' || sender.role === 'creator' || sender.role === 'user') {
      if (ticket.status === 'WAITING_FOR_USER') {
        ticket.status = 'IN_PROGRESS';
      }
    }

    list[idx] = ticket;
    this.saveTickets(list);
    return ticket;
  }

  static updateTicketStatus(ticketId: string, newStatus: TicketStatus): SupportTicket | null {
    const list = this.loadTickets();
    const idx = list.findIndex((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (idx === -1) return null;

    const ticket = { ...list[idx] };
    ticket.status = newStatus;
    ticket.updatedAt = new Date().toISOString();
    if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
      ticket.resolvedAt = ticket.updatedAt;
    }

    list[idx] = ticket;
    this.saveTickets(list);
    return ticket;
  }

  static assignTicket(ticketId: string, adminName: string): SupportTicket | null {
    const list = this.loadTickets();
    const idx = list.findIndex((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (idx === -1) return null;

    const ticket = { ...list[idx] };
    ticket.assignedAdmin = adminName;
    ticket.status = 'IN_PROGRESS';
    ticket.updatedAt = new Date().toISOString();

    list[idx] = ticket;
    this.saveTickets(list);
    return ticket;
  }
}
