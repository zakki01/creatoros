import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  Ticket,
  Users,
  CheckCircle2,
  Copy,
  Plus,
  Search,
  Filter,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  BetaAccessService,
  BetaInviteCode,
  WaitlistEntry,
} from '../../services/betaAccessService';

export const AdminBetaWaitlistView: React.FC = () => {
  const [inviteCodes, setInviteCodes] = useState<BetaInviteCode[]>(() =>
    BetaAccessService.getAllInviteCodes()
  );
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() =>
    BetaAccessService.getWaitlist()
  );
  const [activeTab, setActiveTab] = useState<'waitlist' | 'codes'>('waitlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New code form state
  const [newCode, setNewCode] = useState('');
  const [newRole, setNewRole] = useState<'all' | 'creator' | 'business'>('all');
  const [newMaxUses, setNewMaxUses] = useState(50);
  const [newNotes, setNewNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const reload = () => {
    setInviteCodes(BetaAccessService.getAllInviteCodes());
    setWaitlist(BetaAccessService.getWaitlist());
    setFeedback('Beta access data reloaded.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setIsGenerating(true);
    try {
      const created = BetaAccessService.generateInviteCode({
        code: newCode.trim().toUpperCase(),
        roleConstraint: newRole,
        maxUses: Number(newMaxUses) || 50,
        notes: newNotes.trim() || 'VIP Beta Pass',
      });

      setInviteCodes(BetaAccessService.getAllInviteCodes());
      setNewCode('');
      setNewNotes('');
      setFeedback(`Invite code ${created.code} successfully minted and active!`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err.message || 'Failed to create code.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveApplicant = (id: string) => {
    const res = BetaAccessService.approveWaitlistEntry(id);
    if (res.success && res.inviteCode) {
      setWaitlist(BetaAccessService.getWaitlist());
      setInviteCodes(BetaAccessService.getAllInviteCodes());
      setFeedback(
        `Applicant approved! Generated VIP code: ${res.inviteCode}. Invitation dispatched.`
      );
      setTimeout(() => setFeedback(null), 5000);
    } else {
      setFeedback('Failed to approve applicant.');
    }
  };

  const handleCopyLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://creatoros.ai';
    const link = `${origin}/?invite=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(link);
    setFeedback(`Invite link copied to clipboard: ${link}`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredWaitlist = useMemo(() => {
    return waitlist.filter((entry) => {
      const matchesSearch =
        entry.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.handle && entry.handle.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [waitlist, searchQuery, statusFilter]);

  const pendingCount = waitlist.filter((w) => w.status === 'pending').length;
  const approvedCount = waitlist.filter((w) => w.status === 'approved').length;
  const totalRedemptions = inviteCodes.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-surface to-indigo-950/30 border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Ticket className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Private Beta &amp; VIP Invite Control
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  PLATFORM SCARCITY ENGINE
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Curate alpha user intake • Mint exclusive invite codes • Approve high-value creators and brands
              </p>
            </div>
          </div>

          <button
            onClick={reload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--text-secondary)] transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-purple-400" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-purple-500/20">
          <div className="p-3 rounded-2xl bg-[var(--surface-muted)]/50 border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Pending Applicants</span>
            <span className="text-lg font-bold font-mono text-amber-400">{pendingCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface-muted)]/50 border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Approved VIPs</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{approvedCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface-muted)]/50 border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Active Master Codes</span>
            <span className="text-lg font-bold font-mono text-purple-400">{inviteCodes.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface-muted)]/50 border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Total Redemptions</span>
            <span className="text-lg font-bold font-mono text-[var(--text-primary)]">{totalRedemptions}</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab('waitlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'waitlist'
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Waitlist Queue ({waitlist.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('codes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'codes'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-purple-400 hover:bg-purple-500/10'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Invite Codes ({inviteCodes.length})</span>
        </button>
      </div>

      {/* View 1: Waitlist Queue */}
      {activeTab === 'waitlist' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search applicants by name, email or handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--text-muted)]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-secondary)] focus:outline-none"
              >
                <option value="all">All Applicants</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-muted)] text-[var(--text-secondary)] border-b border-[var(--border)] uppercase text-[10px] font-semibold tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Handle / Profile</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredWaitlist.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[var(--text-primary)]">{entry.fullName}</div>
                        <div className="text-[11px] text-[var(--text-muted)] font-mono">{entry.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                            entry.role === 'creator'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {entry.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">
                        {entry.handle || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)] max-w-xs truncate">
                        {entry.category || 'High-growth creator application'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[var(--text-muted)] text-[11px]">
                        {new Date(entry.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {entry.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            PENDING
                          </span>
                        )}
                        {entry.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            APPROVED
                          </span>
                        )}
                        {entry.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            REJECTED
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {entry.status === 'pending' ? (
                          <button
                            onClick={() => handleApproveApplicant(entry.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Approve &amp; Issue Pass</span>
                          </button>
                        ) : (
                          <span className="text-[var(--text-muted)] font-mono text-[11px]">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Invite Code Generator & Directory */}
      {activeTab === 'codes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Code Generator Form */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Mint New VIP Invite Code</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Create a custom code for influencers, partner agencies, or private investor networks.
            </p>

            <form onSubmit={handleCreateCode} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[var(--text-muted)]">Code String</label>
                <input
                  type="text"
                  placeholder="e.g. FORBES-VIP or CREATOR-2026"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] font-mono uppercase focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[var(--text-muted)]">Role Restriction</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-secondary)] focus:outline-none"
                >
                  <option value="all">Any Role (Creator or Brand)</option>
                  <option value="creator">Creators Only</option>
                  <option value="business">Brands Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[var(--text-muted)]">Max Redemptions</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[var(--text-muted)]">Campaign Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Exclusive cohort batch"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !newCode.trim()}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-600/20 disabled:opacity-50"
              >
                Mint &amp; Activate Code
              </button>
            </form>
          </div>

          {/* Right: Code Directory */}
          <div className="lg:col-span-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Active VIP Pass Inventory</h3>
              <span className="text-xs font-mono text-purple-400 font-semibold">
                {inviteCodes.length} active codes
              </span>
            </div>

            <div className="divide-y divide-[var(--border)] max-h-[500px] overflow-y-auto">
              {inviteCodes.map((c) => (
                <div key={c.code} className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--surface-elevated)] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[var(--text-primary)] tracking-wide">
                        {c.code}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold ${
                          c.roleConstraint === 'creator'
                            ? 'bg-purple-500/10 text-purple-400'
                            : c.roleConstraint === 'business'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-zinc-500/10 text-zinc-400'
                        }`}
                      >
                        {c.roleConstraint}
                      </span>
                      {c.isActive ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                          REVOKED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">{c.notes}</p>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">
                      Redeemed: <strong className="text-[var(--text-primary)]">{c.usedCount}</strong> / {c.maxUses}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(c.code)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--text-secondary)] transition-all cursor-pointer"
                      title="Copy Direct Invite Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
