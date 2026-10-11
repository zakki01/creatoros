import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  History,
  Lock,
  X,
} from 'lucide-react';

import { useAppState } from '../../context/StateContext';
import { BusinessRole, TeamMember } from '../../types/rbac';
import { ROLE_PERMISSIONS } from '../../services/permissionService';

const ROLE_DESCRIPTIONS: Record<BusinessRole, string> = {
  business_owner: 'Complete ownership. Full financial, administrative, and campaign authority.',
  business_admin: 'Admin access. Manage campaigns, team members, and content approvals.',
  campaign_manager: 'Create and run campaigns, negotiate with creators, and manage milestones.',
  content_manager: 'Review creative deliverables, request revisions, and approve content.',
  finance_manager: 'Manage budgets, view invoices, and authorize escrow payment releases.',
  analyst: 'Read-only access to campaign analytics, conversion attribution, and ROI metrics.',
  viewer: 'View-only access without edit, review, or payment authority.',
};

export const TeamManagementSettings: React.FC = () => {
  const {
    teamMembers,
    auditLogs,
    addTeamMember,
    updateTeamMemberRole,
    removeTeamMember,
    businessRole,
    hasPermission,
  } = useAppState();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<BusinessRole>('campaign_manager');
  const [activeTab, setActiveTab] = useState<'members' | 'audit'>('members');

  const canManageUsers = hasPermission('canManageUsers');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    addTeamMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'invited',
      joinedDate: 'Just now',
      lastActive: 'Never',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    });

    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-800/80">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-200">
              Team & Role-Based Access Control (RBAC)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Enterprise Security
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage collaborators, assign role permissions, and view immutable audit trails.
          </p>
        </div>

        {/* Tab switch & Invite button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'members'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Members ({teamMembers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <History className="w-3 h-3 text-zinc-400" />
              <span>Audit Log</span>
            </button>
          </div>

          {canManageUsers && (
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-600/30 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Current User Active Role Pill */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-300">
            Your Active Role:{' '}
            <strong className="text-white font-mono uppercase tracking-wider">{businessRole.replace('_', ' ')}</strong>
          </span>
        </div>
        <span className="text-zinc-500 text-[11px]">
          {ROLE_DESCRIPTIONS[businessRole]}
        </span>
      </div>

      {/* Tab: Members List */}
      {activeTab === 'members' && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 divide-y divide-zinc-800/80 overflow-hidden">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700/60"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-100">{member.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-mono ${
                        member.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">{member.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <select
                  value={member.role}
                  disabled={!canManageUsers || member.role === 'business_owner'}
                  onChange={(e) => updateTeamMemberRole(member.id, e.target.value as BusinessRole)}
                  className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                >
                  <option value="business_owner">Owner</option>
                  <option value="business_admin">Admin</option>
                  <option value="campaign_manager">Campaign Manager</option>
                  <option value="content_manager">Content Manager</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="analyst">Analyst</option>
                  <option value="viewer">Viewer</option>
                </select>

                {canManageUsers && member.role !== 'business_owner' && (
                  <button
                    type="button"
                    onClick={() => removeTeamMember(member.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove team member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === 'audit' && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 divide-y divide-zinc-800/80 overflow-hidden">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-indigo-400 text-[11px]">
                    [{log.action}]
                  </span>
                  <span className="text-zinc-200 font-medium">{log.category}</span>
                  <span className="text-[10px] text-zinc-500">by {log.actorName} ({log.actorRole})</span>
                </div>
                <p className="text-zinc-400 text-[11px]">{log.details}</p>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-850">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span>Invite Workspace Collaborator</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Jordan Blake"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="jordan@company.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as BusinessRole)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="business_admin">Admin</option>
                  <option value="campaign_manager">Campaign Manager</option>
                  <option value="content_manager">Content Manager</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="analyst">Analyst</option>
                  <option value="viewer">Viewer</option>
                </select>
                <p className="text-[11px] text-zinc-400 mt-1">
                  {ROLE_DESCRIPTIONS[inviteRole]}
                </p>
              </div>

              {/* Permission Preview */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">
                  Granted Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_PERMISSIONS[inviteRole].map((perm: string) => (
                    <span
                      key={perm}
                      className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-indigo-300 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{perm.replace('can', '')}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
