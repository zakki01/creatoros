import React, { useState } from 'react';
import {
  LifeBuoy,
  Search,
  Filter,
  Send,
  Lock,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  Eye,
  FileText,
  User,
  Building2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { SupportService } from '../../services/supportService';
import { SupportTicket, TicketStatus, TicketIssueType } from '../../types/support';

export const AdminSupportDesk: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Reply form states
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [statusChangeValue, setStatusChangeValue] = useState<TicketStatus | ''>('');

  const tickets = SupportService.getAllTickets({
    status: statusFilter,
    issueType: typeFilter,
    search: searchQuery,
  });

  const selectedTicket = selectedTicketId
    ? SupportService.getTicketById(selectedTicketId)
    : tickets[0] || null;

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    SupportService.addReply(
      selectedTicket.id,
      replyMessage,
      {
        id: 'admin-001',
        name: 'Sarah Connor (Super Admin)',
        role: 'admin',
      },
      isInternalNote
    );

    setReplyMessage('');
    setIsInternalNote(false);
  };

  const handleUpdateStatus = (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    SupportService.updateTicketStatus(selectedTicket.id, newStatus);
    setStatusChangeValue('');
  };

  const handleAssign = (adminName: string) => {
    if (!selectedTicket) return;
    SupportService.assignTicket(selectedTicket.id, adminName);
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            OPEN
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
            IN PROGRESS
          </span>
        );
      case 'WAITING_FOR_USER':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            WAITING USER
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            RESOLVED
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]">
            CLOSED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-[var(--text-primary)]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display">
              Support Desk & Triage
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
              {tickets.length} Active Tickets
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Resolve user inquiries, investigate escrow holds, manage technical tickets, and maintain platform audit trails.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[var(--surface)] shadow-sm border border-[var(--border)] text-xs">
            <span className="text-[var(--text-muted)] text-[10px] uppercase font-mono block">Open</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
              {tickets.filter((t) => t.status === 'OPEN').length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[var(--surface)] shadow-sm border border-[var(--border)] text-xs">
            <span className="text-[var(--text-muted)] text-[10px] uppercase font-mono block">In Progress</span>
            <span className="font-bold text-[var(--accent)] font-mono">
              {tickets.filter((t) => t.status === 'IN_PROGRESS').length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[var(--surface)] shadow-sm border border-[var(--border)] text-xs">
            <span className="text-[var(--text-muted)] text-[10px] uppercase font-mono block">Resolved</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {tickets.filter((t) => t.status === 'RESOLVED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter / Search Controls Strip */}
      <div className="p-3.5 rounded-2xl bg-[var(--surface)] shadow-sm border border-[var(--border)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by #CR number, user, email, or keywords..."
            className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] gap-1 text-xs">
            {['all', 'OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`min-h-[36px] px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {st === 'all' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Issue Type Select */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Contracts">Contracts</option>
            <option value="Payments">Payments</option>
            <option value="Account">Account</option>
            <option value="Verification">Verification</option>
            <option value="Technical Issue">Technical Issue</option>
          </select>
        </div>
      </div>

      {/* Main Split Layout: Tickets List (5 cols) & Workbench (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 space-y-2.5">
          {tickets.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
              No matching support tickets found.
            </div>
          ) : (
            tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[var(--surface-elevated)] border-[var(--accent)]/50 shadow-lg ring-1 ring-[var(--accent)]/25'
                      : 'bg-[var(--surface)] shadow-sm border-[var(--border)] hover:bg-[var(--surface-elevated)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-[var(--accent)]">
                      #{t.ticketNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(t.status)}
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                        {t.priority}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1 mb-1">
                    {t.subject}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border)]">
                    <span className="flex items-center gap-1.5 truncate">
                      {t.userRole === 'business' ? (
                        <Building2 className="w-3 h-3 text-[var(--accent)] shrink-0" />
                      ) : (
                        <User className="w-3 h-3 text-sky-400 shrink-0" />
                      )}
                      <span className="truncate">{t.userName}</span>
                    </span>
                    <span className="font-mono text-[10px] shrink-0">
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Ticket Workbench */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="rounded-3xl bg-[var(--surface)] shadow-sm border border-[var(--border)] p-5 sm:p-6 space-y-6 backdrop-blur-xl">
              {/* Ticket Administrative Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[var(--accent)]">
                      Ticket #{selectedTicket.ticketNumber}
                    </span>
                    {getStatusBadge(selectedTicket.status)}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                      {selectedTicket.issueType}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
                    {selectedTicket.subject}
                  </h3>
                  <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-2">
                    <span>
                      User: <strong className="text-[var(--text-primary)]">{selectedTicket.userName}</strong> ({selectedTicket.userEmail})
                    </span>
                    <span>•</span>
                    <span>Assignee: <strong className="text-[var(--text-primary)]">{selectedTicket.assignedAdmin || 'Unassigned'}</strong></span>
                  </div>
                </div>

                {/* Quick Admin Actions */}
                <div className="flex items-center gap-2 sm:shrink-0 flex-wrap">
                  <select
                    value={statusChangeValue}
                    onChange={(e) => {
                      if (e.target.value) handleUpdateStatus(e.target.value as TicketStatus);
                    }}
                    className="min-h-[38px] px-2.5 py-1 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[11px] font-semibold text-[var(--text-primary)] cursor-pointer"
                  >
                    <option value="">Change Status...</option>
                    <option value="OPEN">Mark Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="WAITING_FOR_USER">Waiting for User</option>
                    <option value="RESOLVED">Mark Resolved</option>
                    <option value="CLOSED">Close Ticket</option>
                  </select>

                  <button
                    onClick={() => handleAssign('Sarah Connor')}
                    className="min-h-[38px] px-3 py-1 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Assign to Me
                  </button>
                </div>
              </div>

              {/* Messages / Activity Feed */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {selectedTicket.messages.map((msg) => {
                  const isStaff = msg.senderRole === 'admin' || msg.senderRole === 'support';
                  const isInternal = msg.isInternalNote;

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border text-xs ${
                        isInternal
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 shadow-sm'
                          : isStaff
                          ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--text-primary)]'
                          : 'bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[var(--border)]">
                        <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          {isInternal ? (
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                          ) : isStaff ? (
                            <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-sky-400" />
                          )}
                          <span>{msg.senderName}</span>
                          {isInternal && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 uppercase font-bold">
                              Internal Staff Note (Hidden from User)
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Admin Reply & Internal Note Composer */}
              <form onSubmit={handleSendAdminReply} className="pt-3 border-t border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">
                    Respond to User or Leave Internal Note
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-[var(--border)] bg-[var(--input)] text-amber-500 focus:ring-0"
                    />
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>Internal Staff Note (Hidden from User)</span>
                  </label>
                </div>

                <textarea
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={
                    isInternalNote
                      ? 'Add private administrative notes, risk analysis, or investigation findings...'
                      : 'Type official response message to user...'
                  }
                  className={`w-full p-3 rounded-xl border text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none resize-none ${
                    isInternalNote
                      ? 'bg-amber-500/10 border-amber-500/30 focus:border-amber-400'
                      : 'bg-[var(--input)] border-[var(--border)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]'
                  }`}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    {isInternalNote
                      ? '🔒 Note visible only to Super Admins'
                      : '✉ Official reply will be emailed and notified to user'}
                  </span>
                  <button
                    type="submit"
                    disabled={!replyMessage.trim()}
                    className={`min-h-[44px] px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95 ${
                      isInternalNote
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-600/30'
                        : 'bg-[var(--accent)] hover:opacity-90 text-white shadow-sm'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternalNote ? 'Save Internal Note' : 'Send User Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
              Select a ticket from the left queue to inspect details and respond.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};