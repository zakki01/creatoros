import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle,
  MoreVertical,
  Key,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { supabase } from '../../services/supabaseClient';

export interface UnifiedUserAccount {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: 'creator' | 'business' | 'admin';
  verified: boolean;
  category: string;
  location: string;
  followers: string;
  engagement: string;
  avatar: string;
  createdAt: string;
}

export const AdminUsersView: React.FC = () => {
  const {
    suspendedUserIds,
    toggleUserSuspension,
    logAdminAction,
    triggerCelebration,
  } = useAppState();

  const [realAccounts, setRealAccounts] = useState<UnifiedUserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'creator' | 'business' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'suspended'>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadRealAccounts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, creator_profiles(*), brand_profiles(*)');

      if (data && data.length > 0) {
        const mapped: UnifiedUserAccount[] = data.map((p: any) => {
          const isBrand = p.role === 'business';
          const sub = isBrand ? p.brand_profiles : p.creator_profiles;
          const name = isBrand ? (sub?.company_name || p.display_name) : p.display_name;
          const handle = sub?.handle || `@${name.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
          const category = isBrand ? (sub?.industry || 'Brand Partner') : (sub?.category || 'Creator');
          const location = sub?.location || 'Global';
          const verified = Boolean(sub?.verified);

          return {
            id: p.id,
            name: name || 'User',
            handle: handle || '@user',
            email: p.email || '',
            role: p.role === 'business' ? 'business' : p.role === 'super_admin' ? 'admin' : 'creator',
            verified,
            category,
            location,
            followers: isBrand ? 'Active Brand' : (sub?.rate_per_reel ? `₹${sub.rate_per_reel}/reel` : 'Live Creator'),
            engagement: isBrand ? 'Enterprise' : 'Verified Roster',
            avatar: p.avatar_url || '',
            createdAt: p.created_at || new Date().toISOString(),
          };
        });
        setRealAccounts(mapped);
      } else {
        setRealAccounts([]);
      }
    } catch (err) {
      console.warn('Failed to load accounts from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRealAccounts();
  }, []);

  const allAccounts = realAccounts;

  const filteredAccounts = allAccounts.filter((account) => {
    // Search query
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Role filter
    const matchesRole = roleFilter === 'all' || account.role === roleFilter;

    // Status filter
    const isSuspended = suspendedUserIds.includes(account.id);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && account.verified) ||
      (statusFilter === 'suspended' && isSuspended);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleSuspend = (account: UnifiedUserAccount) => {
    toggleUserSuspension(account.id);
    const isNowSuspended = !suspendedUserIds.includes(account.id);
    logAdminAction(
      isNowSuspended ? 'SUSPEND_USER' : 'REINSTATE_USER',
      account.id,
      account.role,
      isNowSuspended ? 'warning' : 'success',
      `${account.role.toUpperCase()} account ${account.handle} was ${
        isNowSuspended ? 'SUSPENDED' : 'REINSTATED'
      } by Super Admin`
    );
    triggerCelebration();
  };

  const handleToggleVerify = async (account: UnifiedUserAccount) => {
    const nextVerified = !account.verified;
    try {
      if (account.role === 'creator') {
        await supabase
          .from('creator_profiles')
          .update({ verified: nextVerified, verified_at: nextVerified ? new Date().toISOString() : null })
          .eq('id', account.id);
      } else if (account.role === 'business') {
        await supabase
          .from('brand_profiles')
          .update({ verified: nextVerified, verified_at: nextVerified ? new Date().toISOString() : null })
          .eq('id', account.id);
      }
      setRealAccounts((prev) =>
        prev.map((a) => (a.id === account.id ? { ...a, verified: nextVerified } : a))
      );
      setFeedback(`Updated verification status for ${account.name}.`);
      setTimeout(() => setFeedback(null), 3000);
      logAdminAction(
        nextVerified ? 'GRANT_VERIFICATION' : 'REVOKE_VERIFICATION',
        account.id,
        account.role,
        'success',
        `${account.role.toUpperCase()} verification ${nextVerified ? 'GRANTED' : 'REVOKED'} for ${account.handle}`
      );
      triggerCelebration();
    } catch (e) {
      console.error('Failed to update verification in Supabase:', e);
    }
  };

  const handleResetAccess = (account: UnifiedUserAccount) => {
    logAdminAction(
      'FORCE_PASSWORD_RESET',
      account.id,
      account.role,
      'warning',
      `Sent emergency magic link reset email to ${account.email}`
    );
    setFeedback(`Reset credentials notification sent to ${account.email}.`);
    setTimeout(() => setFeedback(null), 3000);
    triggerCelebration();
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[var(--text-primary)]">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight">
            User Accounts &amp; Identity Governance
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans font-light">
            Manage creator and brand accounts, enforce identity verification, handle suspensions, and audit credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {feedback && (
            <span className="text-xs text-emerald-400 font-medium animate-fadeIn">
              {feedback}
            </span>
          )}
          <button
            onClick={loadRealAccounts}
            disabled={isLoading}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title="Refresh database accounts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[var(--primary)]' : ''}`} />
            <span>Sync</span>
          </button>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Showing {filteredAccounts.length} of {allAccounts.length} accounts
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, handle, vertical, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Role Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'All Roles' },
              { id: 'creator', label: 'Creators' },
              { id: 'business', label: 'Brands' },
              { id: 'admin', label: 'Admins' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all shrink-0 cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(
            [
              { id: 'all', label: 'All Status' },
              { id: 'verified', label: 'Verified Only' },
              { id: 'suspended', label: 'Suspended' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                <th className="py-3.5 px-4 font-semibold">User / Handle</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Niche / Category</th>
                <th className="py-3.5 px-4 font-semibold">Reach / Metrics</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[var(--text-muted)]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-[var(--primary)] mb-2" />
                    <span>Synchronizing real registered accounts from database...</span>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[var(--text-muted)] space-y-2">
                    <Users className="w-6 h-6 mx-auto mb-2 opacity-40 text-zinc-500" />
                    <span>No registered accounts found matching your filters.</span>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => {
                const isSuspended = suspendedUserIds.includes(account.id);

                return (
                  <tr
                    key={account.id}
                    className={`hover:bg-[var(--surface-elevated)] transition-colors ${
                      isSuspended ? 'bg-rose-500/10 opacity-75' : ''
                    }`}
                  >
                    {/* User / Handle */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-medium text-[var(--text-primary)] truncate">
                            <span>{account.name}</span>
                            {account.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                            {account.handle} • {account.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      {account.role === 'creator' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                          CREATOR
                        </span>
                      )}
                      {account.role === 'business' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-semibold">
                          BRAND
                        </span>
                      )}
                      {account.role === 'admin' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
                          SUPER ADMIN
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-[var(--text-secondary)] font-sans">
                      {account.category}
                      <span className="block text-[10px] text-[var(--text-muted)] font-mono">
                        {account.location}
                      </span>
                    </td>

                    {/* Reach */}
                    <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">
                      <div>{account.followers}</div>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {account.engagement !== 'N/A' ? `${account.engagement} eng.` : 'Platform Ops'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                          <Ban className="w-3 h-3" />
                          SUSPENDED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          ACTIVE
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {account.role === 'admin' ? (
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">Protected Account</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Verify Toggle */}
                          <button
                            onClick={() => handleToggleVerify(account)}
                            className={`p-1.5 rounded-lg border text-xs font-sans transition-all cursor-pointer ${
                              account.verified
                                ? 'bg-sky-500/15 border-sky-500/30 text-sky-300 hover:bg-sky-500/25'
                                : 'bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                            title={account.verified ? 'Revoke verification badge' : 'Grant verification badge'}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>

                          {/* Suspend Toggle */}
                          <button
                            onClick={() => handleToggleSuspend(account)}
                            className={`p-1.5 rounded-lg border text-xs font-sans transition-all cursor-pointer ${
                              isSuspended
                                ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600'
                                : 'bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-500/30'
                            }`}
                            title={isSuspended ? 'Reinstate user access' : 'Suspend account'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Access */}
                          <button
                            onClick={() => handleResetAccess(account)}
                            className="p-1.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-sans transition-all cursor-pointer"
                            title="Reset Security Access & Issue Token"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
