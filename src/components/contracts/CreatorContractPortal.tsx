import React, { useState, useMemo } from 'react';
import {
  FileText,
  ShieldCheck,
  Check,
  X,
  Upload,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Paperclip,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { BrandContract, ContractFile, DeliverableItemType } from '../../types/contract';
import { ContractService } from '../../services/contractService';
import { ContractStatusBadge } from './ContractStatusBadge';
import { SpatialEmptyState } from '../ui/SpatialEmptyState';

interface CreatorContractPortalProps {
  creatorId?: string;
  onOpenMessages?: (brandId: string) => void;
}

type TabType = 'all' | 'pending' | 'active' | 'review' | 'completed' | 'disputed';

export const CreatorContractPortal: React.FC<CreatorContractPortalProps> = ({
  creatorId = 'cr-01',
  onOpenMessages,
}) => {
  const [contracts, setContracts] = useState<BrandContract[]>(() =>
    ContractService.getAllContracts({ creatorId })
  );

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Confirmation Modals
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState<string>('Scope');
  const [customDeclineNote, setCustomDeclineNote] = useState('');

  // Deliverable Submission Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'EditorialCut_4K_ProRes.mp4',
    'ColorGrade_LutPack.cube',
  ]);

  // Raise Issue (Dispute) Modal
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeCategory, setDisputeCategory] = useState<string>('Scope');
  const [disputeDescription, setDisputeDescription] = useState('');

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const reloadContracts = () => {
    const list = ContractService.getAllContracts({ creatorId });
    setContracts(list);
  };

  // Filtered contracts per tab
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      switch (activeTab) {
        case 'pending':
          return c.status === 'awaiting_creator';
        case 'active':
          return c.status === 'active' || c.status === 'funded' || c.status === 'revision_requested';
        case 'review':
          return c.status === 'client_review' || c.status === 'deliverable_submitted';
        case 'completed':
          return c.status === 'completed' || c.status === 'paid';
        case 'disputed':
          return c.status === 'disputed';
        case 'all':
        default:
          return true;
      }
    });
  }, [contracts, activeTab, searchQuery]);

  // Selected contract
  const selectedContract = useMemo(() => {
    if (selectedContractId) {
      const found = contracts.find((c) => c.id === selectedContractId);
      if (found) return found;
    }
    return filteredContracts[0] || contracts[0] || null;
  }, [contracts, selectedContractId, filteredContracts]);

  // Tab counts
  const counts = useMemo(() => ({
    all: contracts.length,
    pending: contracts.filter((c) => c.status === 'awaiting_creator').length,
    active: contracts.filter((c) => c.status === 'active' || c.status === 'revision_requested').length,
    review: contracts.filter((c) => c.status === 'client_review' || c.status === 'deliverable_submitted').length,
    completed: contracts.filter((c) => c.status === 'completed' || c.status === 'paid').length,
    disputed: contracts.filter((c) => c.status === 'disputed').length,
  }), [contracts]);

  // Action handlers
  const handleAcceptConfirm = () => {
    if (!selectedContract) return;
    const res = ContractService.acceptContract(selectedContract.id);
    if (res.success) {
      setActionFeedback('Contract accepted. Work is now in progress.');
      setIsAcceptModalOpen(false);
      reloadContracts();
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  const handleDeclineConfirm = () => {
    if (!selectedContract) return;
    const reasonText = customDeclineNote.trim() ? `${declineReason} - ${customDeclineNote}` : declineReason;
    const res = ContractService.declineContract(selectedContract.id, reasonText);
    if (res.success) {
      setActionFeedback('Contract declined.');
      setIsDeclineModalOpen(false);
      setCustomDeclineNote('');
      reloadContracts();
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  const handleSubmitWorkConfirm = () => {
    if (!selectedContract || !selectedDeliverableId) return;

    const files: ContractFile[] = uploadedFiles.map((fn, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: fn,
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      sizeBytes: 24500000,
      mimeType: 'video/mp4',
      uploadedAt: new Date().toISOString(),
      category: 'deliverable',
    }));

    const res = ContractService.submitDeliverable(
      selectedContract.id,
      selectedDeliverableId,
      deliveryNotes || 'Final deliverables exported in 4K ProRes.',
      files
    );

    if (res.success) {
      setActionFeedback('Deliverables submitted. Brand notified for review.');
      setIsSubmitModalOpen(false);
      setDeliveryNotes('');
      reloadContracts();
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  const handleOpenDisputeConfirm = () => {
    if (!selectedContract || !disputeDescription.trim()) return;
    const res = ContractService.openDispute(
      selectedContract.id,
      'creator',
      selectedContract.creatorName,
      disputeCategory,
      disputeDescription
    );
    if (res.success) {
      setActionFeedback('Issue raised. Super Admin governance reviewing.');
      setIsDisputeModalOpen(false);
      setDisputeDescription('');
      reloadContracts();
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  // Stepper helper
  const getTimelineSteps = (c: BrandContract) => {
    const isAccepted = Boolean(c.acceptedAt) || c.status !== 'awaiting_creator';
    const isFunded = c.payment.paymentStatus === 'escrow_funded' || c.payment.paymentStatus === 'paid';
    const isSubmitted = c.deliveries.length > 0 || c.status === 'client_review' || c.status === 'approved' || c.status === 'completed';
    const isApproved = c.status === 'approved' || c.status === 'payout_pending' || c.status === 'completed' || c.status === 'paid';
    const isPaid = c.payment.paymentStatus === 'paid' || c.status === 'completed';

    return [
      { label: 'Created', state: 'done' },
      { label: 'Funded', state: isFunded ? 'done' : 'upcoming' },
      { label: 'Accepted', state: isAccepted ? 'done' : c.status === 'awaiting_creator' ? 'current' : 'upcoming' },
      { label: 'In Progress', state: c.status === 'active' || c.status === 'revision_requested' ? 'current' : isSubmitted ? 'done' : 'upcoming' },
      { label: 'Brand Review', state: c.status === 'client_review' ? 'current' : isApproved ? 'done' : 'upcoming' },
      { label: 'Payout', state: c.status === 'payout_pending' ? 'current' : isPaid ? 'done' : 'upcoming' },
      { label: 'Completed', state: isPaid ? 'done' : 'upcoming' },
    ];
  };

  return (
    <div className="space-y-5 animate-fade-in font-sans pb-24 md:pb-12 text-[var(--text-primary)]">
      {/* 1. Header: Clean title, zero marketing blurbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight font-display">
            Contracts
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage your brand partnerships and active agreements.
          </p>
        </div>

        {/* Global Action Feedback Alert */}
        {actionFeedback && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}
      </div>

      {/* 2. Role-Aware Spatial Tabs Bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] overflow-x-auto scrollbar-none shadow-inner">
        {[
          { id: 'all', label: 'All', count: counts.all },
          { id: 'pending', label: 'Pending', count: counts.pending },
          { id: 'active', label: 'Active', count: counts.active },
          { id: 'review', label: 'Review', count: counts.review },
          { id: 'completed', label: 'Completed', count: counts.completed },
          { id: 'disputed', label: 'Disputed', count: counts.disputed },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id
                    ? 'bg-sky-50 text-sky-800 font-bold'
                    : 'bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Main Workspace: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Spatial Contracts List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredContracts.length === 0 ? (
            <SpatialEmptyState
              objectType="document"
              title="No Contracts"
              subtitle="Brand agreements will appear here."
            />
          ) : (
            filteredContracts.map((c) => {
              const isSelected = selectedContract?.id === c.id;
              const isAwaiting = c.status === 'awaiting_creator';

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContractId(c.id)}
                  className={`group p-4 rounded-2xl transition-all cursor-pointer relative overflow-hidden bg-[var(--surface)] border ${
                    isSelected
                      ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30 shadow-md'
                      : 'border-[var(--border)] hover:border-[var(--border-strong)] shadow-xs'
                  }`}
                >
                  {/* Top: Brand Logo, Brand Name & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={c.brandLogo}
                        alt={c.brandName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {c.brandName}
                        </h4>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                          {c.contractNumber}
                        </p>
                      </div>
                    </div>

                    <ContractStatusBadge status={c.status} viewerRole="creator" size="sm" />
                  </div>

                  {/* Project Name */}
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] mt-2.5 truncate">
                    {c.projectName}
                  </h3>

                  {/* Bottom: Money, Due Date & Quick Actions */}
                  <div className="pt-2.5 mt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-700 text-sm">
                        ${c.payment.creatorPayment.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] font-sans">
                        · Due {new Date(c.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isAwaiting ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedContractId(c.id);
                              setIsAcceptModalOpen(true);
                            }}
                            className="depth-btn-primary px-2.5 py-1 rounded-lg text-slate-950 text-[11px] font-sans font-semibold cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedContractId(c.id);
                              setIsDeclineModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-sans font-semibold cursor-pointer transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContractId(c.id);
                          }}
                          className="px-3 py-1 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-sans font-semibold cursor-pointer transition-colors"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Progressive Disclosure Detail View (7 Cols) */}
        {selectedContract ? (
          <div className="lg:col-span-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm p-4 sm:p-6 space-y-6 text-xs text-[var(--text-secondary)] relative overflow-hidden">
            {/* Header: Brand, Project, Status */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-[#007E93] font-semibold">
                    {selectedContract.contractNumber}
                  </span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {selectedContract.brandName}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-display mt-0.5">
                  {selectedContract.projectName}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ContractStatusBadge status={selectedContract.status} viewerRole="creator" size="md" />
                {onOpenMessages && (
                  <button
                    onClick={() => onOpenMessages(selectedContract.brandId)}
                    className="p-2 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    title="Message Brand"
                    aria-label="Message Brand"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Awaiting Acceptance Decision Card */}
            {selectedContract.status === 'awaiting_creator' && (
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-300/80 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-[#007E93]" />
                    <span>Response Needed</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-800 font-semibold bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    Expires in 2d 8h
                  </span>
                </div>

                <p className="text-zinc-700 text-[11px] leading-relaxed">
                  Review terms, deliverables, and guaranteed payment below. Accepting locks this project into your active workspace.
                </p>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsDeclineModalOpen(true)}
                    className="min-h-[44px] px-4 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold cursor-pointer border border-[var(--border)] transition-colors shadow-xs"
                  >
                    Decline
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAcceptModalOpen(true)}
                    className="min-h-[44px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            )}

            {/* Revision Requested Callout */}
            {selectedContract.status === 'revision_requested' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <RefreshCw className="w-4 h-4 text-amber-500" />
                    <span>Revision Requested</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                    Round 1 of {selectedContract.terms.includedRevisions}
                  </span>
                </div>

                {selectedContract.deliveries[0]?.brandFeedback && (
                  <p className="text-[var(--text-primary)] text-xs italic bg-[var(--surface)] p-2.5 rounded-lg border border-amber-500/20">
                    "{selectedContract.deliveries[0].brandFeedback}"
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDeliverableId(selectedContract.deliverables[0]?.id || null);
                      setIsSubmitModalOpen(true);
                    }}
                    className="min-h-[44px] px-4 rounded-xl bg-[#007E93] hover:bg-[#006779] text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Submit Revision
                  </button>
                </div>
              </div>
            )}

            {/* Deliverables Section (Level 2) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                  Deliverables
                </h3>
                {selectedContract.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => {
                      const firstPending = selectedContract.deliverables.find((d) => d.status !== 'approved');
                      setSelectedDeliverableId(firstPending?.id || selectedContract.deliverables[0]?.id || null);
                      setIsSubmitModalOpen(true);
                    }}
                    className="min-h-[36px] px-3.5 rounded-xl bg-[#007E93] hover:bg-[#006779] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit Work</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {selectedContract.deliverables.map((del) => {
                  const hasDelivery = selectedContract.deliveries.find((d) => d.deliverableId === del.id);

                  return (
                    <div
                      key={del.id}
                      className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--text-primary)] text-xs">
                            {del.type} × {del.quantity}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]">
                            {del.format}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Due {new Date(del.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {del.specifications}
                      </p>

                      {hasDelivery && (
                        <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-[11px]">
                          <span className="font-mono text-[#007E93] font-semibold">
                            Version {hasDelivery.version} Submitted
                          </span>
                          <span className="text-zinc-500 font-mono text-[10px]">
                            {new Date(hasDelivery.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment & Terms (Level 2 & 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1">
                <span className="text-[10px] uppercase text-zinc-500 block">Payment</span>
                <span className="text-base font-bold text-emerald-700">
                  ${selectedContract.payment.creatorPayment.toLocaleString()}
                </span>
                <p className="text-[10px] text-[var(--text-muted)] font-sans">
                  {selectedContract.payment.paymentStatus === 'escrow_funded'
                    ? 'Protection funded ✓'
                    : selectedContract.payment.paymentStatus === 'paid'
                    ? 'Paid ✓'
                    : 'Unfunded'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1">
                <span className="text-[10px] uppercase text-zinc-500 block">Terms</span>
                <p className="text-[var(--text-primary)] text-[11px] font-sans truncate">
                  Usage: {selectedContract.usageRights.duration} • {selectedContract.usageRights.territory}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] font-sans">
                  Revisions: {selectedContract.terms.includedRevisions} rounds included
                </p>
              </div>
            </div>

            {/* Visual Progress Stepper (Section 17, 56) */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
                Timeline
              </h3>

              <div className="flex items-center justify-between gap-1 overflow-x-auto py-2 scrollbar-none">
                {getTimelineSteps(selectedContract).map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center min-w-[60px] text-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] mb-1 font-bold ${
                        step.state === 'done'
                          ? 'bg-emerald-600 text-white'
                          : step.state === 'current'
                          ? 'bg-[#00B4D8] text-slate-950 font-bold animate-pulse'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {step.state === 'done' ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-medium truncate ${
                        step.state === 'done'
                          ? 'text-zinc-700'
                          : step.state === 'current'
                          ? 'text-[#007E93] font-bold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Raise Issue / Support Action */}
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                Need to amend scope or report a delivery issue?
              </span>
              <button
                type="button"
                onClick={() => setIsDisputeModalOpen(true)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Raise Issue
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-muted)]">
            Select a contract to review details.
          </div>
        )}
      </div>

      {/* 4. Sticky Mobile Action Bar (Section 13) */}
      {selectedContract && selectedContract.status === 'awaiting_creator' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[var(--surface)]/95 backdrop-blur-xl border-t border-[var(--border)] flex items-center gap-3 shadow-lg">
          <button
            type="button"
            onClick={() => setIsDeclineModalOpen(true)}
            className="flex-1 min-h-[44px] rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs border border-zinc-300 cursor-pointer"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setIsAcceptModalOpen(true)}
            className="flex-1 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Accept
          </button>
        </div>
      )}

      {/* 5. Accept Confirmation Dialog (Section 14) */}
      {isAcceptModalOpen && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-4 text-xs shadow-2xl text-[var(--text-primary)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Accept this contract?</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
              You'll commit to the listed deliverables, deadline and terms for <strong>${selectedContract.payment.creatorPayment.toLocaleString()} USD</strong>.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsAcceptModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAcceptConfirm}
                className="min-h-[44px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Decline Reason Dialog (Section 15) */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-4 text-xs shadow-2xl text-[var(--text-primary)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Decline contract?</h3>
            <div className="space-y-2">
              <label className="text-[11px] text-[var(--text-secondary)] block font-medium">Reason (optional)</label>
              {['Budget', 'Timeline', 'Scope', 'Terms', 'Other'].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] cursor-pointer hover:bg-[var(--surface)]"
                >
                  <input
                    type="radio"
                    name="declineReason"
                    value={reason}
                    checked={declineReason === reason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="text-[#00B4D8] focus:ring-0"
                  />
                  <span className="text-[var(--text-primary)] text-xs">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeclineConfirm}
                className="min-h-[44px] px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Deliverable Submission Modal (Section 19-20) */}
      {isSubmitModalOpen && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-4 text-xs shadow-2xl text-[var(--text-primary)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Submit Work</h3>

            {/* Deliverable Picker */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[var(--text-secondary)] font-medium">Deliverable</label>
              <select
                value={selectedDeliverableId || ''}
                onChange={(e) => setSelectedDeliverableId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent)]"
              >
                {selectedContract.deliverables.map((del) => (
                  <option key={del.id} value={del.id}>
                    {del.type} × {del.quantity} ({del.format})
                  </option>
                ))}
              </select>
            </div>

            {/* Attached Files Simulation */}
            <div className="p-3.5 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] text-center space-y-1.5">
              <Upload className="w-5 h-5 text-[#007E93] mx-auto" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">2 files attached</p>
              <ul className="text-[10px] text-zinc-500 font-mono space-y-0.5">
                {uploadedFiles.map((fn, i) => (
                  <li key={i}>{fn}</li>
                ))}
              </ul>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[var(--text-secondary)] font-medium">Notes (optional)</label>
              <textarea
                rows={2}
                placeholder="Notes for brand review..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent)] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitWorkConfirm}
                className="min-h-[44px] px-5 rounded-xl bg-[#007E93] hover:bg-[#006779] text-white font-bold cursor-pointer"
              >
                Submit Work
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Raise Issue (Dispute) Modal (Section 30) */}
      {isDisputeModalOpen && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-4 text-xs shadow-2xl text-[var(--text-primary)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Raise Issue</h3>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[var(--text-secondary)] font-medium">Category</label>
              <select
                value={disputeCategory}
                onChange={(e) => setDisputeCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent)]"
              >
                {['Payment', 'Scope', 'Deadline', 'Deliverable', 'Revision', 'Usage', 'Other'].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[var(--text-secondary)] font-medium">Describe issue</label>
              <textarea
                rows={3}
                placeholder="Explain the issue for platform arbitration..."
                value={disputeDescription}
                onChange={(e) => setDisputeDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent)] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDisputeModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!disputeDescription.trim()}
                onClick={handleOpenDisputeConfirm}
                className="min-h-[44px] px-5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
