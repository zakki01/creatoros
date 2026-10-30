import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CreditCard,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  Sliders,
  History,
  Smartphone,
  Laptop,
  KeyRound,
  FileCheck2,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ReportCenterModal } from '../common/ReportCenterModal';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'Creator Owner' | 'Manager / Agent' | 'Editor & Videographer' | 'Financial Assistant' | 'Viewer';
  status: 'active' | 'invited';
  avatar: string;
}

export const CreatorAdminWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'governance' | 'campaigns' | 'finance' | 'security'>('team');
  const [isReportCenterOpen, setIsReportCenterOpen] = useState(false);

  // Collaborators
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: 'collab-1',
      name: 'Rohan Sharma',
      email: 'rohan@sharmacreative.in',
      role: 'Creator Owner',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'collab-2',
      name: 'Karan Varma',
      email: 'karan@talentmgmt.in',
      role: 'Manager / Agent',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'collab-3',
      name: 'Tanvi Shah',
      email: 'tanvi.cuts@gmail.com',
      role: 'Editor & Videographer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
  ]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Collaborator['role']>('Editor & Videographer');

  // Governance preferences
  const [governance, setGovernance] = useState({
    requireManagerSignOff: true,
    autoWatermarkDrafts: true,
    portfolioPublic: true,
    minimumFee: 35000,
    autoDeclineLowBids: true,
    blockGamblingCrypto: true,
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    setCollaborators([
      ...collaborators,
      {
        id: `collab-${Date.now()}`,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        status: 'invited',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      },
    ]);
    setInviteName('');
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display">
              Settings
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Account, team, and security settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="w-4 h-4 text-emerald-500" />}
            onClick={() => setIsReportCenterOpen(true)}
            className="border-[var(--border)] text-[var(--text-primary)] cursor-pointer"
          >
            Media Kit & Reports
          </Button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[var(--surface-muted)] rounded-xl border border-[var(--border)] overflow-x-auto">
        {[
          { id: 'team', label: `Team & Collaborators (${collaborators.length})`, icon: Users },
          { id: 'governance', label: 'Content Governance', icon: Sliders },
          { id: 'campaigns', label: 'Deal Filters & Terms', icon: ShieldCheck },
          { id: 'finance', label: 'Finance & Tax Invoicing', icon: CreditCard },
          { id: 'security', label: 'Security & Audit Logs', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--accent)] text-white font-semibold border border-[var(--border)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Team & Collaborators */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Studio Collaborators</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Give your video editors, agents, and business managers appropriate operational access.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              onClick={() => setIsInviteOpen(true)}
              className="cursor-pointer"
            >
              Invite Collaborator
            </Button>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden divide-y divide-[var(--border)]">
            {collaborators.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--surface-elevated)] transition-colors">
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-[var(--border)]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text-primary)]">{c.name}</span>
                      {c.status === 'invited' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Invite Pending
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">{c.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)]">
                    {c.role}
                  </span>
                  {c.role !== 'Creator Owner' && (
                    <button
                      onClick={() => handleRemoveCollaborator(c.id)}
                      className="p-1.5 text-[var(--text-muted)] hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remove access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Invite Modal */}
          {isInviteOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl space-y-4">
                <h3 className="text-base font-bold text-[var(--text-primary)] font-display">Invite Team Member</h3>
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      required
                      className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1">Work Email</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. vikram@studio.in"
                      required
                      className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1">Role & Authority</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] focus:outline-none cursor-pointer"
                    >
                      <option value="Manager / Agent">Manager / Agent (Can review & negotiate deals)</option>
                      <option value="Editor & Videographer">Editor & Videographer (Can upload drafts only)</option>
                      <option value="Financial Assistant">Financial Assistant (Can view invoices & taxes)</option>
                      <option value="Viewer">Viewer (Read-only access)</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsInviteOpen(false)} className="cursor-pointer">
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit" className="cursor-pointer">
                      Send Invite
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Content Governance */}
      {activeTab === 'governance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] font-display flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--accent)]" />
              <span>Draft & Delivery Controls</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                <div>
                  <span className="text-xs font-semibold text-[var(--text-primary)] block">Require Internal Sign-off</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Editor drafts must be approved by Manager before submitting to brand</span>
                </div>
                <input
                  type="checkbox"
                  checked={governance.requireManagerSignOff}
                  onChange={(e) => setGovernance({ ...governance, requireManagerSignOff: e.target.checked })}
                  className="rounded border-[var(--border)] bg-[var(--input)] text-[var(--accent)] focus:ring-0 cursor-pointer w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                <div>
                  <span className="text-xs font-semibold text-[var(--text-primary)] block">Auto-Watermark Review Drafts</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Burn "CreatorOS Review Draft" watermark into video files until signed off</span>
                </div>
                <input
                  type="checkbox"
                  checked={governance.autoWatermarkDrafts}
                  onChange={(e) => setGovernance({ ...governance, autoWatermarkDrafts: e.target.checked })}
                  className="rounded border-[var(--border)] bg-[var(--input)] text-[var(--accent)] focus:ring-0 cursor-pointer w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                <div>
                  <span className="text-xs font-semibold text-[var(--text-primary)] block">Public Portfolio Showcase</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Display verified delivered work in public CreatorOS Discovery</span>
                </div>
                <input
                  type="checkbox"
                  checked={governance.portfolioPublic}
                  onChange={(e) => setGovernance({ ...governance, portfolioPublic: e.target.checked })}
                  className="rounded border-[var(--border)] bg-[var(--input)] text-[var(--accent)] focus:ring-0 cursor-pointer w-4 h-4"
                />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
              <span>Standard Contract Defaults</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">Licensing Period Default</span>
                <span className="font-semibold text-[var(--text-primary)] mt-1 block">12 Months Digital Organic & Whitelisted Paid Ads</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">Exclusivity Window</span>
                <span className="font-semibold text-[var(--text-primary)] mt-1 block">30 Days Category Exclusivity (Sneakers / Streetwear)</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">Revision Limit</span>
                <span className="font-semibold text-[var(--text-primary)] mt-1 block">Up to 2 Creative Revisions within Brief Scope</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Deal Filters & Terms */}
      {activeTab === 'campaigns' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-display">Inbound Sponsorship Guardrails</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Automate deal qualification so your studio only reviews high-quality brand briefs.</p>
            </div>
            <Badge variant="success" size="sm">Active Filters</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
              <label className="font-semibold text-[var(--text-primary)] block">Minimum Acceptable Offer Fee</label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  value={governance.minimumFee}
                  onChange={(e) => setGovernance({ ...governance, minimumFee: Number(e.target.value) })}
                  className="bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono w-36 focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Inbound offers below this floor will receive an automated polite counter-quote.</p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
              <label className="font-semibold text-[var(--text-primary)] block">Blacklisted Brand Categories</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Real Money Gaming', 'Crypto & Forex', 'Tobacco / Vaping', 'Unregulated Supplements'].map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    ✕ {cat}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Offers in these categories are automatically declined.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Finance & Tax Invoicing */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] font-display flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <span>Verified Payout Channel</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">Direct Bank Payout</span>
                <span className="text-emerald-500 font-mono flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <p className="text-[var(--text-primary)] font-mono">HDFC Bank ••••• 4921</p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">IFSC: HDFC0001892 • UPI: rohan@okhdfcbank</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">PAN & GST Compliance</span>
                <span className="text-emerald-500 font-mono flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Compliant
                </span>
              </div>
              <p className="text-[var(--text-primary)] font-mono">PAN: ABCPS••••R</p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">GSTIN: 27AABCS9912Q1ZX (18% Invoicing)</p>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-display flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[var(--accent)]" />
                <span>Tax Invoices & Withholding</span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReportCenterOpen(true)}
                className="text-xs border-[var(--border)] text-[var(--text-secondary)] cursor-pointer"
              >
                Export All
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { no: 'INV-2026-089', brand: 'Aura Streetwear', amount: '₹35,000', date: 'Oct 02, 2026', status: 'Paid' },
                { no: 'INV-2026-074', brand: 'Nike India', amount: '₹47,500', date: 'Sep 18, 2026', status: 'Paid' },
                { no: 'INV-2026-061', brand: 'Puma Running', amount: '₹45,000', date: 'Aug 29, 2026', status: 'Paid' },
              ].map((inv) => (
                <div key={inv.no} className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[var(--text-primary)] font-semibold block">{inv.no}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">{inv.brand} • {inv.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[var(--text-primary)] block">{inv.amount}</span>
                    <span className="text-[10px] text-emerald-500 font-mono font-semibold">{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 5: Security & Audit Logs */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] font-display flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-500" />
              <span>Active Sessions & 2FA</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--text-primary)] block">Chrome on Windows 11</span>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">Mumbai, India • Current session</span>
                  </div>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--text-primary)] block">CreatorOS Mobile App (iOS)</span>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">iPhone 15 Pro • 3 hours ago</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-[var(--text-muted)] hover:text-red-400 cursor-pointer">
                  Revoke
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] font-display flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--text-muted)]" />
              <span>Immutable Audit Trail</span>
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {[
                { action: 'Team invite sent to tanvi.cuts@gmail.com', time: 'Yesterday, 18:22' },
                { action: 'Updated minimum sponsorship floor to ₹35,000', time: '3 days ago' },
                { action: 'Verified GSTIN tax registration certificate', time: '1 week ago' },
                { action: '2FA Authenticator verified on device', time: '2 weeks ago' },
              ].map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] flex justify-between items-center">
                  <span className="text-[var(--text-secondary)] text-[11px] truncate">{log.action}</span>
                  <span className="text-[10px] text-[var(--text-muted)] shrink-0 ml-2">{log.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Reusable Report Center Modal */}
      <ReportCenterModal
        isOpen={isReportCenterOpen}
        onClose={() => setIsReportCenterOpen(false)}
        defaultReportType="creator"
      />
    </div>
  );
};