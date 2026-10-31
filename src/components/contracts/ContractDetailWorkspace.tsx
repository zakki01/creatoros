import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Download,
  AlertCircle,
  ExternalLink,
  Plus,
  RefreshCw,
  Send,
} from 'lucide-react';
import { BrandContract, ContractStatus, DisputeResolution } from '../../types/contract';
import { ContractService } from '../../services/contractService';
import { ContractStatusBadge } from './ContractStatusBadge';

interface ContractDetailWorkspaceProps {
  contractId: string;
  viewerRole?: 'brand' | 'creator' | 'admin';
  onBack: () => void;
  onOpenMessages?: (creatorId: string) => void;
}

export const ContractDetailWorkspace: React.FC<ContractDetailWorkspaceProps> = ({
  contractId,
  viewerRole = 'brand',
  onBack,
  onOpenMessages,
}) => {
  const [contract, setContract] = useState<BrandContract | null>(() =>
    ContractService.getContractById(contractId)
  );

  const [activeTab, setActiveTab] = useState<
    'overview' | 'deliverables' | 'timeline' | 'amendments' | 'dispute'
  >('deliverables');

  // Interactive modal states
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  const [approvingDeliverableId, setApprovingDeliverableId] = useState<string | null>(null);

  const [isAmendmentModalOpen, setIsAmendmentModalOpen] = useState(false);
  const [amendmentReason, setAmendmentReason] = useState('');
  const [amendmentChanges, setAmendmentChanges] = useState('Add 1 additional Instagram Story');

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Missed delivery deadline');
  const [disputeDescription, setDisputeDescription] = useState('');

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!contract) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-[var(--text-primary)]">Contract Not Found</h3>
        <p className="text-xs text-zinc-500">
          The requested agreement reference does not exist or has been archived.
        </p>
        <button
          onClick={onBack}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] text-zinc-800 text-xs font-semibold cursor-pointer"
        >
          Return to Contracts
        </button>
      </div>
    );
  }

  // Reload helper
  const reloadContract = () => {
    const updated = ContractService.getContractById(contract.id);
    if (updated) setContract({ ...updated });
  };

  // Actions
  const handleApprove = async (delId: string) => {
    const res = await ContractService.approveDeliverable(contract.id, delId);
    if (res.success) {
      setActionFeedback('Deliverable approved! Protected payment released.');
      reloadContract();
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleRequestRevisionSubmit = () => {
    if (!selectedDeliverableId || !revisionFeedback.trim()) return;
    const res = ContractService.requestRevision(
      contract.id,
      selectedDeliverableId,
      revisionFeedback
    );
    if (res.success) {
      setActionFeedback('Revision requested. Creator notified.');
      setIsRevisionModalOpen(false);
      setRevisionFeedback('');
      reloadContract();
      setTimeout(() => setActionFeedback(null), 4000);
    } else {
      alert(res.error);
    }
  };

  const handleRequestAmendmentSubmit = () => {
    if (!amendmentReason.trim()) return;
    const res = ContractService.requestAmendment(
      contract.id,
      viewerRole === 'creator' ? 'creator' : 'brand',
      viewerRole === 'creator' ? contract.creatorName : contract.brandName,
      amendmentReason,
      [
        {
          field: 'scope',
          label: 'Scope Addition',
          previousValue: 'Existing deliverables',
          newValue: amendmentChanges,
        },
      ]
    );
    if (res.success) {
      setActionFeedback('Amendment requested. Both parties must approve.');
      setIsAmendmentModalOpen(false);
      setAmendmentReason('');
      reloadContract();
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleOpenDisputeSubmit = () => {
    if (!disputeDescription.trim()) return;
    const res = ContractService.openDispute(
      contract.id,
      viewerRole === 'creator' ? 'creator' : 'brand',
      viewerRole === 'creator' ? contract.creatorName : contract.brandName,
      disputeReason,
      disputeDescription
    );
    if (res.success) {
      setActionFeedback('Dispute opened. Funds frozen for Super Admin review.');
      setIsDisputeModalOpen(false);
      reloadContract();
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  // Stepper timeline milestones
  const steps = [
    { label: 'Created', done: true },
    { label: 'Sent', done: Boolean(contract.sentAt) },
    { label: 'Accepted', done: Boolean(contract.acceptedAt) },
    { label: 'Funded', done: contract.payment.paymentStatus !== 'unfunded' },
    {
      label: 'Delivered',
      done: contract.deliveries && contract.deliveries.length > 0,
    },
    {
      label: 'Approved',
      done: contract.status === 'completed' || contract.status === 'paid',
    },
    { label: 'Paid', done: contract.payment.paymentStatus === 'paid' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 md:pb-12 animate-fade-in font-sans">
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)]/90 border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-zinc-100 text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
            title="Back to contracts"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-display">
                {contract.projectName}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)]">
                {contract.contractNumber}
              </span>
              <ContractStatusBadge status={contract.status} size="sm" />
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Contracting between <strong className="text-zinc-800">{contract.brandName}</strong> and{' '}
              <strong className="text-zinc-800">{contract.creatorName}</strong>
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenMessages && (
            <button
              onClick={() => onOpenMessages(contract.creatorId)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
              <span>Project Chat</span>
            </button>
          )}

          {contract.status !== 'disputed' && contract.status !== 'completed' && (
            <button
              onClick={() => setIsDisputeModalOpen(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-medium border border-rose-200 transition-colors cursor-pointer"
            >
              Open Dispute
            </button>
          )}
        </div>
      </div>

      {/* Global Action Toast Notification */}
      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 2. Stepper Lifecycle Pipeline */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full text-[10px] font-mono flex items-center justify-center font-bold ${
                    s.done
                      ? 'bg-emerald-500 text-black'
                      : 'bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] text-zinc-500'
                  }`}
                >
                  {s.done ? '✓' : i + 1}
                </span>
                <span
                  className={`text-xs font-medium ${
                    s.done ? 'text-[var(--text-primary)] font-semibold' : 'text-zinc-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    s.done ? 'bg-emerald-500/40' : 'bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-black/[0.08] pb-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'deliverables', label: 'Deliverables & Submissions' },
          { id: 'overview', label: 'Agreement Terms' },
          { id: 'timeline', label: 'Audit Trail' },
          { id: 'amendments', label: `Amendments (${contract.amendments?.length || 0})` },
          { id: 'dispute', label: contract.dispute ? 'Active Dispute' : 'Dispute Policy' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`min-h-[44px] px-4 py-2 rounded-t-xl text-xs font-medium transition-all cursor-pointer border-b-2 ${
              activeTab === tab.id
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold bg-[var(--primary)]/10'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Content */}

      {/* DELIVERABLES & SUBMISSIONS TAB */}
      {activeTab === 'deliverables' && (
        <div className="space-y-4">
          {/* Review countdown banner if in client_review */}
          {contract.status === 'client_review' && viewerRole === 'brand' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-500/30 text-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-800 shrink-0" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">Deliverable Under Brand Review</h4>
                  <p className="text-[11px] text-zinc-500">
                    Review window: {contract.terms.reviewPeriodDays} business days. Please approve work or request revisions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Deliverables List */}
          <div className="grid grid-cols-1 gap-4">
            {contract.deliverables.map((del, index) => {
              const deliveryHistory = contract.deliveries.filter(
                (d) => d.deliverableId === del.id
              );
              const latestDelivery = deliveryHistory[deliveryHistory.length - 1];

              return (
                <div
                  key={del.id}
                  className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] font-mono text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                          {del.type} × {del.quantity}
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          Format: {del.format} • Due: {del.dueDate}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase font-bold ${
                        del.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-500/30'
                          : del.status === 'submitted'
                          ? 'bg-amber-50 text-amber-800 border border-amber-500/30 animate-pulse'
                          : del.status === 'revision'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] text-zinc-500'
                      }`}
                    >
                      {del.status}
                    </span>
                  </div>

                  <p className="text-[var(--text-secondary)] leading-relaxed bg-zinc-50 p-3 rounded-xl border border-[var(--border)]">
                    {del.specifications}
                  </p>

                  {/* Submission History / Preview */}
                  {latestDelivery ? (
                    <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[var(--primary-hover)] font-mono">
                          Submission v{latestDelivery.version}
                        </span>
                        <span className="text-zinc-500">
                          {new Date(latestDelivery.submittedAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-[var(--text-secondary)]">{latestDelivery.creatorNotes}</p>

                      {/* Attached files preview */}
                      {latestDelivery.files && latestDelivery.files.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {latestDelivery.files.map((f) => (
                            <div
                              key={f.id}
                              className="p-2.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                                <span className="font-mono text-zinc-800">{f.name}</span>
                              </div>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {(f.sizeBytes / (1024 * 1024)).toFixed(1)} MB
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Brand actions for submitted deliverable */}
                      {del.status === 'submitted' && viewerRole === 'brand' && (
                        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
                          <button
                            type="button"
                            onClick={() => setApprovingDeliverableId(del.id)}
                            className="min-h-[44px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDeliverableId(del.id);
                              setIsRevisionModalOpen(true);
                            }}
                            className="min-h-[44px] px-4 py-2 rounded-xl bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Request Revision</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-500 italic p-3 bg-zinc-50 rounded-xl border border-[var(--border)]">
                      Creator has not submitted assets for this deliverable yet.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AGREEMENT TERMS TAB */}
      {activeTab === 'overview' && (
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 text-xs text-[var(--text-secondary)] shadow-sm">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] font-display">Contract Terms & Rights</h3>
              <p className="text-[11px] text-zinc-500 font-mono">Version {contract.version}</p>
            </div>
            <button
              onClick={() => setIsAmendmentModalOpen(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] hover:bg-zinc-200 text-zinc-800 text-xs font-semibold cursor-pointer"
            >
              + Amend
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Channels</span>
              <p className="font-semibold text-[var(--text-primary)]">
                {contract.usageRights.usageTypes.join(', ')}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Duration & Territory</span>
              <p className="font-semibold text-[var(--text-primary)]">
                {contract.usageRights.duration} • {contract.usageRights.territory}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Revisions Included</span>
              <p className="font-semibold text-[var(--text-primary)]">
                {contract.terms.includedRevisions} revision rounds
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Approval Window</span>
              <p className="font-semibold text-[var(--text-primary)]">
                {contract.terms.reviewPeriodDays} business days
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[var(--border)]">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">Cancellation Policy</span>
            <p className="text-[var(--text-secondary)] leading-relaxed bg-zinc-50 p-3 rounded-xl border border-[var(--border)]">
              {contract.terms.cancellationTerms}
            </p>
          </div>
        </div>
      )}

      {/* AUDIT TRAIL TAB */}
      {activeTab === 'timeline' && (
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[var(--text-primary)] font-display">
            Immutable Chronological Audit Trail
          </h3>

          <div className="space-y-3">
            {contract.auditTrail.map((event) => (
              <div
                key={event.id}
                className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-primary)]">{event.action}</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] text-zinc-500">
                      {event.actorRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{event.details}</p>
                </div>

                <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AMENDMENTS TAB */}
      {activeTab === 'amendments' && (
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[var(--text-primary)] font-display">Formal Contract Amendments</h3>
            <button
              onClick={() => setIsAmendmentModalOpen(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold cursor-pointer"
            >
              + Amend
            </button>
          </div>

          {contract.amendments && contract.amendments.length > 0 ? (
            <div className="space-y-3">
              {contract.amendments.map((amd) => (
                <div
                  key={amd.id}
                  className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--text-primary)]">Amendment v{amd.version}</span>
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full ${
                        amd.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800'
                          : amd.status === 'pending'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {amd.status}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    <strong>Reason:</strong> {amd.reason}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 italic">No amendments proposed yet for this contract.</p>
          )}
        </div>
      )}

      {/* DISPUTE TAB */}
      {activeTab === 'dispute' && (
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[var(--text-primary)] font-display">Dispute Resolution</h3>

          {contract.dispute ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-rose-800 uppercase font-mono">
                  Active Dispute: {contract.dispute.reason}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Opened {new Date(contract.dispute.openedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">{contract.dispute.description}</p>
              <div className="p-3 bg-zinc-50 rounded-lg text-[var(--text-secondary)] border border-[var(--border)] text-[11px]">
                Status: <strong>{contract.dispute.status}</strong>. Evidence gathered: contract
                clauses, direct messages, delivery logs, and payment escrow record. Super Admin
                arbitration pending.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
              <p className="text-[var(--text-secondary)]">
                No disputes exist on this agreement. If a delivery milestone is breached or communication has broken down, either party may file a formal dispute.
              </p>
              <button
                onClick={() => setIsDisputeModalOpen(true)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 font-semibold cursor-pointer"
              >
                Open Dispute
              </button>
            </div>
          )}
        </div>
      )}

      {/* APPROVE DELIVERABLE CONFIRMATION MODAL */}
      {approvingDeliverableId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl text-[var(--text-primary)] border-emerald-500/30 space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-[var(--text-primary)] font-display">Approve Deliverable</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Approve this submission? Protected payment will be released to{' '}
              <strong className="text-[var(--text-primary)]">{contract.creatorName}</strong>.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setApprovingDeliverableId(null)}
                className="min-h-[44px] px-4 rounded-xl bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] text-[var(--text-secondary)] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = approvingDeliverableId;
                  setApprovingDeliverableId(null);
                  handleApprove(id);
                }}
                className="min-h-[44px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVISION REQUEST MODAL */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl text-[var(--text-primary)] border-[var(--border)] space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-[var(--text-primary)] font-display">Request Revision</h3>
            <p className="text-zinc-500">
              Revision{' '}
              {(contract.deliveries?.filter((d) => d.deliverableId === selectedDeliverableId)?.length || 0) + 1} of{' '}
              {contract.terms.includedRevisions} rounds. Describe the required adjustments.
            </p>

            <textarea
              rows={4}
              placeholder="e.g. Please trim intro to 3 seconds and highlight product texture..."
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-none"
            />

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] text-[var(--text-secondary)] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestRevisionSubmit}
                className="min-h-[44px] px-5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold cursor-pointer"
              >
                Request Revision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AMENDMENT REQUEST MODAL */}
      {isAmendmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl text-[var(--text-primary)] border-[var(--border)] space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-[var(--text-primary)] font-display">Propose Amendment</h3>
            <p className="text-zinc-500">
              Contract amendments modify agreed terms and require approval by both parties.
            </p>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Reason
              </label>
              <input
                type="text"
                placeholder="e.g. Additional video requested"
                value={amendmentReason}
                onChange={(e) => setAmendmentReason(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Proposed Change
              </label>
              <textarea
                rows={3}
                value={amendmentChanges}
                onChange={(e) => setAmendmentChanges(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAmendmentModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] text-[var(--text-secondary)] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestAmendmentSubmit}
                className="min-h-[44px] px-5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPUTE MODAL */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl text-[var(--text-primary)] border-rose-500/30 space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-rose-800 font-display">Dispute Resolution</h3>
            <p className="text-zinc-500">
              Opening a dispute freezes funds and escalates this agreement to Super Admin arbitration.
            </p>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Reason
              </label>
              <select
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Missed delivery deadline">Missed delivery deadline</option>
                <option value="Deliverable non-compliance with brief">
                  Deliverable non-compliance with brief
                </option>
                <option value="Unresponsive creator">Unresponsive creator</option>
                <option value="Unauthorized scope expansion">Unauthorized scope expansion</option>
                <option value="Payment breach">Payment breach</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Details & Evidence
              </label>
              <textarea
                rows={4}
                placeholder="Explain the issue in detail..."
                value={disputeDescription}
                onChange={(e) => setDisputeDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDisputeModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)] text-[var(--text-secondary)] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOpenDisputeSubmit}
                className="min-h-[44px] px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
