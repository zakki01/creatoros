import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CreditCard,
  Sliders,
  History,
  Lock,
  Download,
  KeyRound,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { TeamManagementSettings } from './TeamManagementSettings';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ReportCenterModal } from '../common/ReportCenterModal';

export const BrandAdminWorkspace: React.FC = () => {
  const { teamMembers, auditLogs } = useAppState();

  const [activeTab, setActiveTab] = useState<'rbac' | 'permissions' | 'financial' | 'security'>('rbac');
  const [isReportCenterOpen, setIsReportCenterOpen] = useState(false);

  // Policy configuration
  const [policies, setPolicies] = useState({
    spendApprovalThreshold: 100000,
    requireTwoSignOffsForDrafts: true,
    autoReleaseEscrowOnDeliverableApproval: true,
    enforceMfaForAllAdmins: true,
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
              Brand Administration & Governance
            </h1>
            <Badge variant="brand" size="sm">
              Enterprise Governance
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Enterprise RBAC, team delegation, financial escrow policies, and immutable security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="w-4 h-4 text-emerald-400" />}
            onClick={() => setIsReportCenterOpen(true)}
            className="border-zinc-200 text-zinc-800 cursor-pointer"
          >
            Audit & Compliance Export
          </Button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white shadow-xs rounded-xl border border-zinc-200 overflow-x-auto">
        {[
          { id: 'rbac', label: `Team & RBAC (${teamMembers.length})`, icon: Users },
          { id: 'permissions', label: 'Campaign & Content Policies', icon: Sliders },
          { id: 'financial', label: 'Financial Thresholds & Escrow', icon: CreditCard },
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
                  ? 'bg-zinc-800 text-white font-semibold border border-black/[0.08] shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-850/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0096C7]' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Team & RBAC (Integrated with existing TeamManagementSettings) */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <TeamManagementSettings />
        </div>
      )}

      {/* Tab 2: Campaign & Content Policies */}
      {activeTab === 'permissions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 font-display flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0096C7]" />
              <span>Spend & Approval Delegation</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white shadow-xs border border-zinc-200 space-y-2">
                <span className="font-semibold text-zinc-800 block">Single Sign-off Budget Limit</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-zinc-500">₹</span>
                  <input
                    type="number"
                    value={policies.spendApprovalThreshold}
                    onChange={(e) => setPolicies({ ...policies, spendApprovalThreshold: Number(e.target.value) })}
                    className="bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-xs text-zinc-900 font-mono w-40"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">Campaigns exceeding this budget require Finance Manager dual-authorization.</p>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white shadow-xs border border-zinc-200">
                <div>
                  <span className="font-semibold text-zinc-800 block">Mandatory 2-Step Creative Sign-off</span>
                  <span className="text-[11px] text-zinc-500">Content Manager + Legal Brand Safety review required</span>
                </div>
                <input
                  type="checkbox"
                  checked={policies.requireTwoSignOffsForDrafts}
                  onChange={(e) => setPolicies({ ...policies, requireTwoSignOffsForDrafts: e.target.checked })}
                  className="rounded text-indigo-500 focus:ring-0 cursor-pointer w-4 h-4"
                />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Brand Safety Standards</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white shadow-xs border border-zinc-200 space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 uppercase block">Creator Screening Threshold</span>
                <p className="font-semibold text-zinc-800">Minimum Platform Reputation 85% & Zero Safety Violations</p>
                <p className="text-[11px] text-zinc-500 mt-1">CreatorOS automatically flags influencers with audience authenticity below 80%.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white shadow-xs border border-zinc-200 space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 uppercase block">FTC / ASCI Disclosure Rule</span>
                <p className="font-semibold text-zinc-800">Enforce #Ad / #Collab watermarks and caption verification on all deliverables</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Financial Thresholds & Escrow */}
      {activeTab === 'financial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 font-display flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Escrow Funding & Auto-Disbursement</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white shadow-xs border border-zinc-200">
                <div>
                  <span className="font-semibold text-zinc-800 block">Auto-Release on Content Approval</span>
                  <span className="text-[11px] text-zinc-500">Release milestone payout within 24h once deliverables are approved</span>
                </div>
                <input
                  type="checkbox"
                  checked={policies.autoReleaseEscrowOnDeliverableApproval}
                  onChange={(e) => setPolicies({ ...policies, autoReleaseEscrowOnDeliverableApproval: e.target.checked })}
                  className="rounded text-indigo-500 focus:ring-0 cursor-pointer w-4 h-4"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-white shadow-xs border border-zinc-200 space-y-2">
                <span className="font-semibold text-zinc-800 block">Corporate Escrow Balance</span>
                <p className="text-xl font-bold font-mono text-emerald-400">₹4,50,000</p>
                <p className="text-[11px] text-zinc-500">Locked in ICICI Commercial Escrow Account for active campaigns.</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 font-display flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#0096C7]" />
              <span>Corporate Tax & Invoicing Entity</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-white shadow-xs border border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Entity Details</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <p className="text-zinc-800 font-medium">Aura Streetwear Lifestyle Pvt Ltd</p>
              <p className="text-[11px] text-zinc-500 font-mono">CIN: U74999MH2022PTC192837</p>
              <p className="text-[11px] text-zinc-500 font-mono">GSTIN: 27AABCA4829Q1ZM</p>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Security & Audit Logs */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 font-display flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Authentication & MFA Enforcement</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white shadow-xs border border-zinc-200">
                <div>
                  <span className="font-semibold text-zinc-800 block">Enforce 2FA For All Workspace Members</span>
                  <span className="text-[11px] text-zinc-500">Require Google Authenticator or hardware security keys</span>
                </div>
                <input
                  type="checkbox"
                  checked={policies.enforceMfaForAllAdmins}
                  onChange={(e) => setPolicies({ ...policies, enforceMfaForAllAdmins: e.target.checked })}
                  className="rounded text-indigo-500 focus:ring-0 cursor-pointer w-4 h-4"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-white shadow-xs border border-zinc-200 space-y-1">
                <span className="font-semibold text-zinc-800 block">Single Sign-On (SSO / SAML 2.0)</span>
                <p className="text-[11px] text-zinc-500">Okta & Google Workspace SSO connected for @aurastreetwear.co</p>
                <Badge variant="brand" size="sm">Connected</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 font-display flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-500" />
              <span>Immutable Audit Logs ({auditLogs.length})</span>
            </h3>

            <div className="space-y-2 text-xs font-mono max-h-72 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-zinc-50 border border-white/5 space-y-1">
                  <div className="flex justify-between text-zinc-700 text-[11px]">
                    <span className="font-semibold text-zinc-800">{log.action}</span>
                    <span className="text-[10px] text-zinc-500">{log.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate">{log.details}</p>
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
        defaultReportType="governance"
      />
    </div>
  );
};
