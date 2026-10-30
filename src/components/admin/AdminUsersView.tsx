import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';

export const AdminUsersView: React.FC = () => {
  const {
    creators,
    suspendedUserIds,
    toggleUserSuspension,
    toggleCreatorVerification,
    logAdminAction,
    triggerCelebration,
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'creator' | 'business' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'suspended'>('all');

  // Hardcoded known platform accounts to supplement creators roster
  const platformBrands = [
    {
      id: 'brand-aura',
      name: 'Aura Streetwear Co.',
      handle: '@aurastreetwear',
      email: 'partnerships@aurastreetwear.io',
      role: 'business' as const,
      verified: true,
      category: 'Streetwear & Apparel',
      location: 'Mumbai, India',
      followers: '48.2K',
      engagement: '6.4%',
      avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'brand-luxe',
      name: 'Luxe Audio Tech',
      handle: '@luxeaudio',
      email: 'creator-ops@luxeaudio.com',
      role: 'business' as const,
      verified: true,
      category: 'Consumer Electronics',
      location: 'Bengaluru, India',
      followers: '82.1K',
      engagement: '4.9%',
      avatar: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'brand-zenith',
      name: 'Zenith Organic Botanicals',
      handle: '@zenithbeauty',
      email: 'marketing@zenithbotanicals.in',
      role: 'business' as const,
      verified: false,
      category: 'Clean Beauty & Wellness',
      location: 'Delhi NCR, India',
      followers: '19.4K',
      engagement: '8.1%',
      avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const platformAdmins = [
    {
      id: 'admin-root',
      name: 'Super Admin Operator',
      handle: '@admin.root',
      email: 'security-root@creatoros.internal',
      role: 'admin' as const,
      verified: true,
      category: 'System Infrastructure',
      location: 'Global Control Plane',
      followers: 'Internal',
      engagement: 'N/A',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    },
  ];

  // Map creators to unified account structure
  const creatorAccounts = creators.map((c) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
    email: `${c.handle.replace('@', '')}@creators.creatoros.internal`,
    role: 'creator' as const,
    verified: c.verified,
    category: c.category,
    location: c.location,
    followers: c.followers,
    engagement: c.engagementRate,
    avatar: c.avatar,
  }));

  const allAccounts = [...creatorAccounts, ...platformBrands, ...platformAdmins];

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

  const handleToggleSuspend = (account: typeof allAccounts[0]) => {
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

  const handleToggleVerify = (account: typeof allAccounts[0]) => {
    if (account.role === 'creator') {
      toggleCreatorVerification(account.id);
      const nextVerified = !account.verified;
      logAdminAction(
        nextVerified ? 'GRANT_VERIFICATION' : 'REVOKE_VERIFICATION',
        account.id,
        'creator',
        'success',
        `Creator badge ${nextVerified ? 'GRANTED' : 'REVOKED'} for ${account.handle}`
      );
      triggerCelebration();
    }
  };

  const handleResetAccess = (account: typeof allAccounts[0]) => {
    logAdminAction(
      'FORCE_PASSWORD_RESET',
      account.id,
      account.role,
      'warning',
      `Sent emergency magic link reset email to ${account.email}`
    );
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
              {filteredAccounts.map((account) => {
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
