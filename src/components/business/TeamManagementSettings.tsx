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
    <div className="space-y-6 pt-6 border-t border-[var(--border)]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Team & Role-Based Access Control (RBAC)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#007E93]/10 text-[#00B4D8] border border-[#00B4D8]/20">
              Enterprise Security
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage collaborators, assign role permissions, and view immutable audit trails.
          </p>
        </div>

        {/* Tab switch & Invite button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'members'
                  ? 'bg-[#007E93] text-white font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Members ({teamMembers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-[#007E93] text-white font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <History className="w-3 h-3 text-[var(--text-muted)]" />
              <span>Audit Log</span>
            </button>
          </div>

          {canManageUsers && (
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#007E93] hover:bg-[#006779] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Current User Active Role Pill */}
      <div className="p-3 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[var(--text-secondary)]">
            Your Active Role:{' '}
            <strong className="text-[var(--text-primary)] font-mono uppercase tracking-wider">{businessRole.replace('_', ' ')}</strong>
          </span>
        </div>
        <span className="text-[var(--text-muted)] text-[11px]">
          {ROLE_DESCRIPTIONS[businessRole]}
        </span>
      </div>

      {/* Tab: Members List */}
      {activeTab === 'members' && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface-subtle)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-[var(--border)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{member.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-mono ${
                        member.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">{member.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <select
                  value={member.role}
                  disabled={!canManageUsers || member.role === 'business_owner'}
                  onChange={(e) => updateTeamMemberRole(member.id, e.target.value as BusinessRole)}
                  className="bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] disabled:opacity-60"
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
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-[#00B4D8] text-[11px]">
                    [{log.action}]
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">{log.category}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">by {log.actorName} ({log.actorRole})</span>
                </div>
                <p className="text-[var(--text-secondary)] text-[11px]">{log.details}</p>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#00B4D8]" />
                <span>Invite Workspace Collaborator</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Jordan Blake"
                  className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="jordan@company.com"
                  className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as BusinessRole)}
                  className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]"
                >
                  <option value="business_admin">Admin</option>
                  <option value="campaign_manager">Campaign Manager</option>
                  <option value="content_manager">Content Manager</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="analyst">Analyst</option>
                  <option value="viewer">Viewer</option>
                </select>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  {ROLE_DESCRIPTIONS[inviteRole]}
                </p>
              </div>

              {/* Permission Preview */}
              <div className="p-3 rounded-lg bg-[var(--surface-subtle)] shadow-xs border border-[var(--border)]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block mb-1.5">
                  Granted Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_PERMISSIONS[inviteRole].map((perm: string) => (
                    <span
                      key={perm}
                      className="px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[10px] font-mono text-[#00B4D8] border border-[var(--border)] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                      <span>{perm.replace('can', '')}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#007E93] hover:bg-[#006779] text-white text-xs font-semibold shadow-sm cursor-pointer"
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
