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
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            OPEN
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-[#0096C7] border border-[#00B4D8]/30">
            IN PROGRESS
          </span>
        );
      case 'WAITING_FOR_USER':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            WAITING USER
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            RESOLVED
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-500 border border-zinc-300">
            CLOSED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display">
              Support Desk & Triage
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-300">
              {tickets.length} Active Tickets
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Resolve user inquiries, investigate escrow holds, manage technical tickets, and maintain platform audit trails.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white shadow-sm border border-black/[0.08] text-xs">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">Open</span>
            <span className="font-bold text-amber-400 font-mono">
              {tickets.filter((t) => t.status === 'OPEN').length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white shadow-sm border border-black/[0.08] text-xs">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">In Progress</span>
            <span className="font-bold text-[#0096C7] font-mono">
              {tickets.filter((t) => t.status === 'IN_PROGRESS').length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white shadow-sm border border-black/[0.08] text-xs">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">Resolved</span>
            <span className="font-bold text-emerald-400 font-mono">
              {tickets.filter((t) => t.status === 'RESOLVED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter / Search Controls Strip */}
      <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-black/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by #CR number, user, email, or keywords..."
            className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-600 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-white border border-zinc-200 gap-1 text-xs">
            {['all', 'OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`min-h-[36px] px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
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
            className="min-h-[44px] px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-700 focus:outline-none cursor-pointer"
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
            <div className="p-8 rounded-2xl bg-zinc-50 border border-black/[0.06] text-center text-xs text-zinc-500">
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
                      ? 'bg-zinc-850 border-[#00B4D8]/50 shadow-lg ring-1 ring-indigo-500/30'
                      : 'bg-white shadow-sm border-black/[0.06] hover:bg-zinc-850 hover:border-black/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#0096C7]">
                      #{t.ticketNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(t.status)}
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-500">
                        {t.priority}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-900 line-clamp-1 mb-1">
                    {t.subject}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-black/[0.04]">
                    <span className="flex items-center gap-1.5 truncate">
                      {t.userRole === 'business' ? (
                        <Building2 className="w-3 h-3 text-[#0096C7] shrink-0" />
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
            <div className="rounded-3xl bg-white shadow-sm border border-black/[0.08] p-5 sm:p-6 space-y-6 backdrop-blur-xl">
              {/* Ticket Administrative Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-black/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#0096C7]">
                      Ticket #{selectedTicket.ticketNumber}
                    </span>
                    {getStatusBadge(selectedTicket.status)}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-700">
                      {selectedTicket.issueType}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 font-display">
                    {selectedTicket.subject}
                  </h3>
                  <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-2">
                    <span>
                      User: <strong className="text-zinc-800">{selectedTicket.userName}</strong> ({selectedTicket.userEmail})
                    </span>
                    <span>•</span>
                    <span>Assignee: <strong className="text-zinc-800">{selectedTicket.assignedAdmin || 'Unassigned'}</strong></span>
                  </div>
                </div>

                {/* Quick Admin Actions */}
                <div className="flex items-center gap-2 sm:shrink-0 flex-wrap">
                  <select
                    value={statusChangeValue}
                    onChange={(e) => {
                      if (e.target.value) handleUpdateStatus(e.target.value as TicketStatus);
                    }}
                    className="min-h-[38px] px-2.5 py-1 rounded-xl bg-white border border-zinc-200 text-[11px] font-semibold text-zinc-800 cursor-pointer"
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
                    className="min-h-[38px] px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-800 text-[11px] font-semibold transition-colors cursor-pointer"
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
                          ? 'bg-amber-950/25 border-amber-500/40 text-amber-200 shadow-sm'
                          : isStaff
                          ? 'bg-[#00B4D8]/10 border-[#00B4D8]/30 text-zinc-800'
                          : 'bg-white border-black/[0.06] text-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-black/[0.04]">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          {isInternal ? (
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                          ) : isStaff ? (
                            <Shield className="w-3.5 h-3.5 text-[#0096C7]" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-sky-400" />
                          )}
                          <span>{msg.senderName}</span>
                          {isInternal && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 uppercase font-bold">
                              Internal Staff Note (Hidden from User)
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
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
              <form onSubmit={handleSendAdminReply} className="pt-3 border-t border-black/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-700">
                    Respond to User or Leave Internal Note
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-zinc-300 bg-white text-amber-500 focus:ring-0"
                    />
                    <Lock className="w-3 h-3 text-amber-400" />
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
                  className={`w-full p-3 rounded-xl border text-xs text-zinc-900 placeholder:text-zinc-600 focus:outline-none resize-none ${
                    isInternalNote
                      ? 'bg-amber-950/20 border-amber-500/40 focus:border-amber-400'
                      : 'bg-white border-zinc-200 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]'
                  }`}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">
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
                        : 'bg-[#00B4D8] hover:bg-[#0096C7] text-white shadow-sm shadow-xs'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternalNote ? 'Save Internal Note' : 'Send User Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-zinc-50 border border-black/[0.06] text-center text-xs text-zinc-500">
              Select a ticket from the left queue to inspect details and respond.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
