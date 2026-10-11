import React, { useState } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle,
  XCircle,
  UserCheck,
  RotateCcw,
  Sparkles,
  Building2,
  User,
  ExternalLink,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';

export const AdminUsersView: React.FC = () => {
  const {
    creators,
    toggleCreatorVerification,
    toggleUserSuspension,
    suspendedUserIds,
    logAdminAction,
    triggerCelebration,
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'creator' | 'business' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Combine creators and static brand accounts to provide a comprehensive directory
  const allAccounts = [
    // Creators
    ...creators.map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      avatar: c.avatar,
      role: 'creator' as const,
      category: c.category || c.niche || 'Digital Creator',
      followers: c.totalFollowers ? `${(c.totalFollowers / 1000).toFixed(0)}K` : c.followers || '180K',
      engagement: `${c.avgEngagement || c.engagementRate || 5.8}%`,
      verified: Boolean(c.verified),
      joined: 'Mar 2025',
      location: c.location || 'Mumbai, IN',
      email: `${c.handle.replace('@', '')}@creatoros.internal`,
    })),
    // Brands
    {
      id: 'brand-aura',
      name: 'Aura Streetwear Co.',
      handle: '@aurastreetwear',
      avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
      role: 'business' as const,
      category: 'Streetwear & Lifestyle',
      followers: '420K',
      engagement: '6.4%',
      verified: true,
      joined: 'Jan 2025',
      location: 'Mumbai & Bengaluru',
      email: 'partnerships@aurastreetwear.co',
    },
    {
      id: 'brand-cult',
      name: 'Cult Collective',
      handle: '@cult_creative',
      avatar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&auto=format&fit=crop&q=80',
      role: 'business' as const,
      category: 'Creative Studio & Apparel',
      followers: '210K',
      engagement: '7.1%',
      verified: true,
      joined: 'Feb 2025',
      location: 'New Delhi',
      email: 'collab@cultcollective.in',
    },
    {
      id: 'brand-neon',
      name: 'Neon Kinetics',
      handle: '@neonkinetics',
      avatar: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&auto=format&fit=crop&q=80',
      role: 'business' as const,
      category: 'Gaming & Tech Hardware',
      followers: '850K',
      engagement: '8.2%',
      verified: false,
      joined: 'Apr 2025',
      location: 'Bengaluru',
      email: 'influencers@neonkinetics.io',
    },
    // Super Admins
    {
      id: 'admin-001',
      name: 'Alex Vance (Super Admin)',
      handle: '@alex.vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin' as const,
      category: 'Platform Security & Operations',
      followers: 'N/A',
      engagement: 'N/A',
      verified: true,
      joined: 'Jan 2024',
      location: 'San Francisco & Remote',
      email: 'alex@creatoros.internal',
    },
  ];

  const filteredAccounts = allAccounts.filter((account) => {
    // Role filter
    if (roleFilter !== 'all' && account.role !== roleFilter) return false;

    // Status filter
    const isSuspended = suspendedUserIds.includes(account.id);
    if (statusFilter === 'verified' && !account.verified) return false;
    if (statusFilter === 'suspended' && !isSuspended) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        account.name.toLowerCase().includes(q) ||
        account.handle.toLowerCase().includes(q) ||
        account.category.toLowerCase().includes(q) ||
        account.email.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const handleToggleVerify = (account: any) => {
    toggleCreatorVerification(account.id);
    logAdminAction(
      account.verified ? 'REVOKE_VERIFICATION' : 'GRANT_VERIFICATION',
      account.id,
      account.role,
      'success',
      `Verification ${account.verified ? 'revoked from' : 'granted to'} ${account.name}`
    );
    triggerCelebration();
  };

  const handleToggleSuspend = (account: any) => {
    const isSuspended = suspendedUserIds.includes(account.id);
    toggleUserSuspension(account.id);
    logAdminAction(
      isSuspended ? 'REINSTATE_USER' : 'SUSPEND_USER',
      account.id,
      account.role,
      isSuspended ? 'success' : 'warning',
      `Account ${isSuspended ? 'reinstated' : 'suspended and access blocked'}: ${account.name}`
    );
    triggerCelebration();
  };

  const handleResetAccess = (account: any) => {
    logAdminAction(
      'RESET_SECURITY_CREDENTIALS',
      account.id,
      account.role,
      'success',
      `Generated one-time temporary security passphrase for ${account.handle}`
    );
    triggerCelebration();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight">
            User Governance &amp; Directory
          </h2>
          <p className="text-xs text-zinc-400 font-sans font-light">
            Manage creator and brand accounts, enforce identity verification, handle suspensions, and audit credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">
            Showing {filteredAccounts.length} of {allAccounts.length} accounts
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, handle, vertical, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500/50"
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
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
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
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="overflow-hidden rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-zinc-900/40 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th className="py-3.5 px-4 font-semibold">User / Handle</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Niche / Category</th>
                <th className="py-3.5 px-4 font-semibold">Reach / Metrics</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs">
              {filteredAccounts.map((account) => {
                const isSuspended = suspendedUserIds.includes(account.id);

                return (
                  <tr
                    key={account.id}
                    className={`hover:bg-zinc-900/40 transition-colors ${
                      isSuspended ? 'bg-rose-950/10 opacity-75' : ''
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
                          <div className="flex items-center gap-1.5 font-medium text-white truncate">
                            <span>{account.name}</span>
                            {account.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono truncate">
                            {account.handle} • {account.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      {account.role === 'creator' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                          CREATOR
                        </span>
                      )}
                      {account.role === 'business' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                          BRAND
                        </span>
                      )}
                      {account.role === 'admin' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                          SUPER ADMIN
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-zinc-300 font-sans">
                      {account.category}
                      <span className="block text-[10px] text-zinc-500 font-mono">
                        {account.location}
                      </span>
                    </td>

                    {/* Reach */}
                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      <div>{account.followers}</div>
                      <span className="text-[10px] text-zinc-500">
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
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" />
                          ACTIVE
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {account.role === 'admin' ? (
                        <span className="text-[11px] font-mono text-zinc-600">Protected Account</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Verify Toggle */}
                          <button
                            onClick={() => handleToggleVerify(account)}
                            className={`p-1.5 rounded-lg border text-xs font-sans transition-all cursor-pointer ${
                              account.verified
                                ? 'bg-sky-500/15 border-sky-500/30 text-sky-300 hover:bg-sky-500/25'
                                : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
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
                                : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30'
                            }`}
                            title={isSuspended ? 'Reinstate user access' : 'Suspend account'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Access */}
                          <button
                            onClick={() => handleResetAccess(account)}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-xs font-sans transition-all cursor-pointer"
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
