export type TicketIssueType =
  | 'Account'
  | 'Login'
  | 'Payments'
  | 'Contracts'
  | 'Campaigns'
  | 'Messages'
  | 'Content'
  | 'Verification'
  | 'Technical Issue'
  | 'Other';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_USER'
  | 'RESOLVED'
  | 'CLOSED';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'creator' | 'brand' | 'admin' | 'support';
  message: string;
  isInternalNote?: boolean; // Hidden from non-admin users
  attachments?: {
    name: string;
    url: string;
    sizeBytes?: number;
  }[];
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. #CR-10248
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'creator' | 'business' | 'super_admin';
  issueType: TicketIssueType;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAdmin?: string;
  attachments?: {
    name: string;
    url: string;
    sizeBytes?: number;
  }[];
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
