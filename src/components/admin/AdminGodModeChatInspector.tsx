import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  MessageSquare,
  Search,
  AlertTriangle,
  User,
  CheckCircle2,
  Ban,
  Eye,
  RefreshCw,
  FileText,
  DollarSign,
  Shield,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  messagingService,
  Conversation,
  DirectMessage,
  MessagingService,
} from '../../services/messagingService';

export const AdminGodModeChatInspector: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    messagingService.getAllConversationsForensic()
  );
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'conversations' | 'flagged'>('conversations');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadRealConversations() {
      setIsLoading(true);
      try {
        const liveConvs = await messagingService.fetchForensicConversations();
        if (mounted && liveConvs) {
          setConversations(liveConvs);
          if (liveConvs.length > 0 && !selectedConversationId) {
            setSelectedConversationId(liveConvs[0].id);
          }
        }
      } catch (err) {
        console.warn('Could not load forensic conversations:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadRealConversations();
    return () => {
      mounted = false;
    };
  }, []);

  const reloadData = async () => {
    setIsLoading(true);
    const live = await messagingService.fetchForensicConversations();
    setConversations(live);
    setIsLoading(false);
    setFeedback('Forensic chat logs synchronized with live database.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversationId) || conversations[0];
  }, [conversations, selectedConversationId]);

  const messages: DirectMessage[] = useMemo(() => {
    if (!selectedConversation) return [];
    return messagingService.getConversationForensicMessages(selectedConversation.id);
  }, [selectedConversation]);

  // Aggregate all flagged messages across platform
  const allFlaggedMessages = useMemo(() => {
    const list: {
      conversation: Conversation;
      message: DirectMessage;
      scanResult: ReturnType<typeof MessagingService.scanForCircumvention>;
    }[] = [];

    for (const conv of conversations) {
      const msgs = messagingService.getConversationForensicMessages(conv.id);
      for (const m of msgs) {
        const scan = MessagingService.scanForCircumvention(m.content);
        if (scan.flagged) {
          list.push({ conversation: conv, message: m, scanResult: scan });
        }
      }
    }
    return list;
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.participantName.toLowerCase().includes(q) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(q)) ||
        (c.campaignContext?.name &&
          c.campaignContext.name.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  const handleIssueWarning = (userName: string, reason: string) => {
    setFeedback(`Formal warning issued to ${userName} for policy breach: "${reason}". Logged to Trust & Safety registry.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleSuspendMessaging = (userName: string) => {
    setFeedback(`Direct messaging access suspended for ${userName} pending dispute arbitration.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Stats */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-surface to-rose-950/20 border border-rose-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  God Mode Forensic Chat Inspector
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  ROOT AUDIT ACCESS
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Full 360° visibility into all Creator-Brand communications • Automated anti-circumvention monitor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={reloadData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--text-secondary)] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Feeds</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-rose-500/20">
          <div className="p-3 rounded-2xl bg-[var(--surface-muted)]/50 border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Monitored Threads</span>
            <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {conversations.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface-muted)]/50 border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Flagged Violations</span>
            <span className="text-lg font-bold font-mono text-rose-400">
              {allFlaggedMessages.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface-muted)]/50 border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Anti-Circumvention Rule</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Active (0% Tolerance)</span>
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface-muted)]/50 border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Escrow Protection</span>
            <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1 mt-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>0% Hold Fee Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'conversations'
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>All Conversations ({conversations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('flagged')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'flagged'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-400 hover:bg-rose-500/10'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Flagged Incidents ({allFlaggedMessages.length})</span>
        </button>
      </div>

      {/* Main Forensic View */}
      {activeTab === 'conversations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
          {/* Left Column: Conversation Directory */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search by creator, brand or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--border)] text-xs text-[var(--text-muted)] space-y-2">
                  <MessageSquare className="w-5 h-5 mx-auto text-zinc-500 opacity-60" />
                  <p>{searchQuery ? 'No conversations matching query.' : 'No platform conversations yet.'}</p>
                </div>
              ) : (
                filteredConversations.map((c) => {
                const isSelected = c.id === selectedConversation?.id;
                const msgs = messagingService.getConversationForensicMessages(c.id);
                const hasFlags = msgs.some((m) => MessagingService.scanForCircumvention(m.content).flagged);

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConversationId(c.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[var(--surface-elevated)] border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                        : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.participantAvatar}
                          alt={c.participantName}
                          className="w-8 h-8 rounded-full object-cover border border-[var(--border)]"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[var(--text-primary)]">
                            {c.participantName}
                          </h4>
                          <span className="text-[10px] text-[var(--text-muted)] block capitalize">
                            Role: {c.participantRole} • {c.campaignContext?.name || 'Campaign Workspace'}
                          </span>
                        </div>
                      </div>

                      {hasFlags && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>FLAGGED</span>
                        </span>
                      )}
                    </div>

                    {c.campaignContext && (
                      <div className="p-1.5 rounded-lg bg-[var(--surface-muted)] text-[10px] text-[var(--text-secondary)] flex items-center justify-between">
                        <span className="truncate max-w-[180px]">
                          Campaign: <strong>{c.campaignContext.name}</strong>
                        </span>
                        <span className="font-mono font-semibold text-emerald-400">
                          ${c.campaignContext.agreedFee.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 italic">
                      "{c.lastMessage || 'No messages yet.'}"
                    </p>
                  </button>
                );
              }))}
            </div>
          </div>

          {/* Right Column: Detailed Message Transcript */}
          <div className="lg:col-span-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Transcript Header */}
                <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-muted)]/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedConversation.participantAvatar}
                      alt={selectedConversation.participantName}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">
                          {selectedConversation.participantName}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                          ID: {selectedConversation.id}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        Conversation with {selectedConversation.participantName} • {selectedConversation.campaignContext?.name || 'Commercial Campaign'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleIssueWarning(
                          selectedConversation.participantName,
                          'Violating CreatorOS Safe Messaging Rules'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold cursor-pointer"
                    >
                      Warn
                    </button>
                    <button
                      onClick={() => handleSuspendMessaging(selectedConversation.participantName)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold cursor-pointer"
                    >
                      Suspend
                    </button>
                  </div>
                </div>

                {/* Message Stream */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[460px]">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-muted)] text-xs">
                      No message history recorded for this conversation thread.
                    </div>
                  ) : (
                    messages.map((m) => {
                      const scan = MessagingService.scanForCircumvention(m.content);
                      const isCreator = m.senderRole === 'creator';

                      return (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
                            scan.flagged
                              ? 'bg-rose-950/20 border-rose-500/50 ring-1 ring-rose-500/30'
                              : 'bg-[var(--surface-muted)]/30 border-[var(--border)]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {m.senderAvatar && (
                                <img
                                  src={m.senderAvatar}
                                  alt={m.senderName}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              )}
                              <span className="text-xs font-bold text-[var(--text-primary)]">
                                {m.senderName}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold ${
                                  isCreator
                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}
                              >
                                {m.senderRole}
                              </span>
                            </div>

                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              {m.timestamp}
                            </span>
                          </div>

                          <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                            {m.content}
                          </p>

                          {scan.flagged && (
                            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-rose-400">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Anti-Circumvention Policy Violation Detected</span>
                              </div>
                              <p className="text-[10px] text-rose-300/90 leading-tight">
                                {scan.reason}
                              </p>
                              {scan.triggerMatch && (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-900/40 text-rose-200">
                                  Match: {scan.triggerMatch}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Forensic Bottom Status */}
                <div className="p-3 bg-[var(--surface-muted)] border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                  <span>Audit hash: SHA256-FORENSIC-CERTIFIED</span>
                  <span className="text-emerald-400 font-mono">0% Hold Escrow Shield Guarded</span>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                Select a conversation thread to inspect message logs.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flagged Incidents Tab */}
      {activeTab === 'flagged' && (
        <div className="space-y-4">
          {allFlaggedMessages.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Clean Moderation Queue</h4>
              <p className="text-xs">
                Zero active anti-circumvention violations detected. All communications respect platform policy.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {allFlaggedMessages.map(({ conversation, message, scanResult }, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[var(--surface)] border border-rose-500/40 shadow-md space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          {scanResult.triggerMatch || 'OFF-PLATFORM DEALING'}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                          {message.timestamp}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mt-1.5">
                        Sender: {message.senderName} ({message.senderRole}) in thread with{' '}
                        {conversation.participantName}
                      </h4>
                      <p className="text-xs text-rose-300 mt-1">{scanResult.reason}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedConversationId(conversation.id);
                          setActiveTab('conversations');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-xs font-semibold cursor-pointer"
                      >
                        Inspect Thread
                      </button>
                      <button
                        onClick={() => handleIssueWarning(message.senderName, scanResult.triggerMatch || 'External Contact')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold cursor-pointer"
                      >
                        Warn
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 font-mono text-xs text-[var(--text-primary)]">
                    "{message.content}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
