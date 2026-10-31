import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Send,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Paperclip,
  ChevronRight,
  MessageSquare,
  Search,
} from 'lucide-react';
import { SupportService } from '../../services/supportService';
import { SupportTicket, TicketIssueType, TicketPriority, TicketStatus } from '../../types/support';
import { useAppState } from '../../context/StateContext';
import { BrandLogo } from '../common/BrandLogo';

interface SupportPortalProps {
  onBack?: () => void;
}

export const SupportPortal: React.FC<SupportPortalProps> = ({ onBack }) => {
  const { userProfile, role } = useAppState();

  const currentUserId = userProfile?.id || (role === 'business' ? 'biz-101' : 'cr-01');
  const currentUserName = userProfile?.name || (role === 'business' ? 'Aura Streetwear Co.' : 'Alex Morgan');
  const currentUserEmail = userProfile?.email || (role === 'business' ? 'partnerships@aurastreetwear.com' : 'alex@creatoros.ai');

  const [activeTab, setActiveTab] = useState<'my_tickets' | 'new_ticket'>('my_tickets');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // New ticket form state
  const [issueType, setIssueType] = useState<TicketIssueType>('Contracts');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdNotice, setCreatedNotice] = useState<string | null>(null);

  // Reply message in ticket thread
  const [replyText, setReplyText] = useState('');

  // Tickets list
  const userTickets = SupportService.getTicketsByUser(currentUserId);
  const selectedTicket = selectedTicketId
    ? SupportService.getTicketById(selectedTicketId)
    : userTickets[0] || null;

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const newTicket = SupportService.createTicket({
      userId: currentUserId,
      userName: currentUserName,
      userEmail: currentUserEmail,
      userRole: role === 'business' ? 'business' : 'creator',
      issueType,
      subject,
      description,
      priority,
    });

    setIsSubmitting(false);
    setCreatedNotice(`Ticket #${newTicket.ticketNumber} created successfully! Our team will respond shortly.`);
    setSubject('');
    setDescription('');
    setSelectedTicketId(newTicket.id);
    setActiveTab('my_tickets');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    SupportService.addReply(selectedTicket.id, replyText, {
      id: currentUserId,
      name: currentUserName,
      role: role === 'business' ? 'brand' : 'creator',
    });

    setReplyText('');
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-500/30">
            OPEN
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30">
            IN PROGRESS
          </span>
        );
      case 'WAITING_FOR_USER':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            ACTION REQUIRED
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-500/30">
            RESOLVED
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-600 border border-zinc-300">
            CLOSED
          </span>
        );
    }
  };

  const issueTypes: TicketIssueType[] = [
    'Account',
    'Login',
    'Payments',
    'Contracts',
    'Campaigns',
    'Messages',
    'Content',
    'Verification',
    'Technical Issue',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans selection:bg-[var(--primary)]/20 selection:text-[var(--primary)]">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack ? onBack : () => (window.location.href = '/')}
              className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <BrandLogo size="sm" />
            <span className="text-[var(--text-tertiary)] hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-[var(--text-secondary)] hidden sm:inline">
              Support Center
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('new_ticket');
                setCreatedNotice(null);
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Ticket</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner Alert if Ticket was just created */}
        {createdNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium">{createdNotice}</span>
            </div>
            <button
              onClick={() => setCreatedNotice(null)}
              className="text-xs text-emerald-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-3">
          <button
            onClick={() => setActiveTab('my_tickets')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'my_tickets'
                ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>My Tickets ({userTickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new_ticket')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'new_ticket'
                ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise Ticket</span>
          </button>
        </div>

        {/* Tab 1: Raise Ticket Form */}
        {activeTab === 'new_ticket' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 shadow-sm animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">Raise Support Ticket</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Describe the problem and our operations team will triage your issue promptly.
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                    Issue Category *
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as TicketIssueType)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
                  >
                    {issueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                    Urgency / Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
                  >
                    <option value="low">Low (General guidance)</option>
                    <option value="medium">Medium (Standard request)</option>
                    <option value="high">High (Active milestone impact)</option>
                    <option value="urgent">Urgent (Payment / security blocker)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short, specific summary of the inquiry or issue..."
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context, relevant contract reference numbers (#CR-...), or steps to reproduce..."
                  className="w-full p-3.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-y"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach Screenshot or Log</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-slate-950 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: My Tickets Split View */}
        {activeTab === 'my_tickets' && (
          <div>
            {userTickets.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-tertiary)] flex items-center justify-center mx-auto">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">No tickets raised yet</h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                  If you encounter payment queries, contract questions, or technical issues, raise a ticket and our team will assist you.
                </p>
                <button
                  onClick={() => setActiveTab('new_ticket')}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-slate-950 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Raise Your First Ticket</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Tickets List Column (5 cols) */}
                <div className="lg:col-span-5 space-y-2.5">
                  {userTickets.map((t) => {
                    const isSelected = selectedTicket?.id === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[var(--surface-elevated)] border-[var(--primary)]/50 shadow-md'
                            : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-subtle)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-mono font-bold text-[var(--primary)]">
                            #{t.ticketNumber}
                          </span>
                          {getStatusBadge(t.status)}
                        </div>

                        <h4 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1 mb-1">
                          {t.subject}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-1">
                          <span>{t.issueType}</span>
                          <span className="font-mono text-[10px]">
                            {new Date(t.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ticket Detail Conversation Column (7 cols) */}
                <div className="lg:col-span-7">
                  {selectedTicket ? (
                    <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-5 sm:p-6 space-y-6 shadow-sm">
                      {/* Ticket Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[var(--border)]">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-[var(--primary)]">
                              Ticket #{selectedTicket.ticketNumber}
                            </span>
                            {getStatusBadge(selectedTicket.status)}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)]">
                              {selectedTicket.issueType}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
                            {selectedTicket.subject}
                          </h3>
                        </div>

                        <div className="text-right sm:shrink-0 text-[11px] text-[var(--text-secondary)]">
                          <div>Created {new Date(selectedTicket.createdAt).toLocaleDateString()}</div>
                          <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
                            Priority: {selectedTicket.priority}
                          </div>
                        </div>
                      </div>

                      {/* Messages Thread (Filters out internal admin notes for user view) */}
                      <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                        {selectedTicket.messages
                          .filter((m) => !m.isInternalNote)
                          .map((msg) => {
                            const isStaff = msg.senderRole === 'admin' || msg.senderRole === 'support';
                            return (
                              <div
                                key={msg.id}
                                className={`p-4 rounded-2xl border text-xs ${
                                  isStaff
                                    ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--text-primary)] ml-4'
                                    : 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-primary)] mr-4'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[var(--border)]">
                                  <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                                    {isStaff && <LifeBuoy className="w-3.5 h-3.5 text-[var(--primary)]" />}
                                    <span>{msg.senderName}</span>
                                    {isStaff && (
                                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--primary)]/20 text-[var(--primary)]">
                                        Staff
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <p className="leading-relaxed whitespace-pre-wrap text-[var(--text-secondary)]">{msg.message}</p>
                              </div>
                            );
                          })}
                      </div>

                      {/* Reply Input Form */}
                      {selectedTicket.status !== 'CLOSED' ? (
                        <form onSubmit={handleSendReply} className="pt-2 border-t border-[var(--border)] space-y-2.5">
                          <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                            Add Reply
                          </label>
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response to the support team..."
                            className="w-full p-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-none"
                          />
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={!replyText.trim()}
                              className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Reply</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--text-secondary)] text-center font-mono">
                          This ticket has been marked Closed. If you need further assistance, please raise a new ticket.
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 bg-[var(--surface)] text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="xs" />
            <span className="text-[var(--text-tertiary)]">•</span>
            <span>CreatorOS Help & Operations Desk</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="/support" className="text-[var(--text-primary)] font-medium transition-colors">Support</a>
            <a href="mailto:support@creatoros.ai" className="hover:text-[var(--text-primary)] transition-colors">support@creatoros.ai</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
