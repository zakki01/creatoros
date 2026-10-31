import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Sliders,
  FileText,
  Lock,
  ArrowRight,
  RefreshCw,
  XCircle,
  Eye,
} from 'lucide-react';
import {
  BrandContract,
  ContractPlatformConfig,
  DisputeResolution,
} from '../../types/contract';
import { ContractService } from '../../services/contractService';
import { ContractStatusBadge } from './ContractStatusBadge';

export const AdminContractsGovernance: React.FC = () => {
  const [contracts, setContracts] = useState<BrandContract[]>(() =>
    ContractService.getAllContracts()
  );
  const [config, setConfig] = useState<ContractPlatformConfig>(() =>
    ContractService.getAdminConfig()
  );

  const [activeView, setActiveView] = useState<'contracts' | 'disputes' | 'config'>('contracts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dispute resolution modal state
  const [selectedDisputeContract, setSelectedDisputeContract] = useState<BrandContract | null>(null);
  const [disputeOutcome, setDisputeOutcome] = useState<
    'release_to_creator' | 'refund_to_brand' | 'partial_split' | 'contract_cancelled'
  >('partial_split');
  const [creatorSplitAmount, setCreatorSplitAmount] = useState(400);
  const [brandRefundAmount, setBrandRefundAmount] = useState(400);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const [feedback, setFeedback] = useState<string | null>(null);

  const reloadContracts = () => {
    setContracts(ContractService.getAllContracts());
  };

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const disputedContracts = contracts.filter((c) => c.status === 'disputed' || Boolean(c.dispute));

  // Handle dispute resolution
  const handleResolveDispute = async () => {
    if (!selectedDisputeContract) return;

    const resolution: DisputeResolution = {
      outcome: disputeOutcome,
      creatorAmount:
        disputeOutcome === 'release_to_creator'
          ? selectedDisputeContract.payment.creatorPayment
          : disputeOutcome === 'partial_split'
          ? creatorSplitAmount
          : 0,
      brandRefundAmount:
        disputeOutcome === 'refund_to_brand'
          ? selectedDisputeContract.payment.totalAmount
          : disputeOutcome === 'partial_split'
          ? brandRefundAmount
          : 0,
      resolvedBy: 'Super Admin Governance',
      resolvedAt: new Date().toISOString(),
      notes: resolutionNotes || 'Arbitrated under CreatorOS fair performance guidelines.',
    };

    const res = await ContractService.resolveDispute(selectedDisputeContract.id, resolution);
    if (res.success) {
      setFeedback('Dispute arbitrated successfully! Funds released per resolution.');
      setSelectedDisputeContract(null);
      reloadContracts();
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Handle platform config update
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    ContractService.updateAdminConfig(config);
    setFeedback('Platform contract configuration updated successfully.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-16 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display">
              Commercial Contract Governance
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
              Super Admin Enclave
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Arbitrate contract disputes, inspect immutable audit trails, and manage global fee and protection policies.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] self-start sm:self-auto">
          {[
            { id: 'contracts', label: `All Agreements (${contracts.length})` },
            { id: 'disputes', label: `Disputes Queue (${disputedContracts.length})` },
            { id: 'config', label: 'Platform Policy & Fees' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id as any)}
              className={`min-h-[36px] px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeView === v.id
                  ? 'bg-[var(--surface-elevated)] text-[var(--accent)] border border-[var(--border)] font-bold shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. CONTRACTS TABLE VIEW */}
      {activeView === 'contracts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search by contract ID, brand, creator, or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] pl-9 pr-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-[44px] px-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="client_review">In Review</option>
              <option value="awaiting_creator">Awaiting Creator</option>
              <option value="completed">Completed</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>

          {/* Mobile Admin Contracts Card List */}
          <div className="space-y-3 md:hidden">
            {filteredContracts.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--primary)] uppercase font-semibold">
                      {c.contractNumber}
                    </span>
                    <h4 className="font-bold text-[var(--text-primary)] text-sm mt-0.5">{c.brandName}</h4>
                  </div>
                  <ContractStatusBadge status={c.status} size="sm" />
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)]/50">
                  <img
                    src={c.creatorAvatar}
                    alt={c.creatorName}
                    className="w-6 h-6 rounded-md object-cover"
                  />
                  <span className="text-[var(--text-secondary)] font-medium">{c.creatorName}</span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-[var(--text-secondary)] truncate">{c.projectName}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">Total Value</span>
                    <span className="text-base font-bold font-mono text-emerald-500 dark:text-emerald-400">
                      ${c.payment.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {c.status === 'disputed' ? (
                    <button
                      onClick={() => setSelectedDisputeContract(c)}
                      className="min-h-[44px] px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Arbitrate
                    </button>
                  ) : (
                    <span className="text-[var(--text-muted)] text-[11px] font-mono">Governed</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-muted)] text-[var(--text-secondary)] border-b border-[var(--border)] uppercase text-[10px] font-semibold tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Contract ID</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Creator</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] font-sans">
                  {filteredContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{c.contractNumber}</td>
                      <td className="py-3.5 px-4 font-semibold text-[var(--text-primary)]">{c.brandName}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={c.creatorAvatar}
                            alt={c.creatorName}
                            className="w-6 h-6 rounded-md object-cover"
                          />
                          <span className="text-[var(--text-primary)]">{c.creatorName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)] max-w-xs truncate">
                        {c.projectName}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-500 dark:text-emerald-400">
                        ${c.payment.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <ContractStatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {c.status === 'disputed' ? (
                          <button
                            onClick={() => setSelectedDisputeContract(c)}
                            className="min-h-[36px] px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                          >
                            Arbitrate
                          </button>
                        ) : (
                          <span className="text-[var(--text-muted)] text-[11px] font-mono">Governed</span>
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

      {/* 2. DISPUTES QUEUE VIEW */}
      {activeView === 'disputes' && (
        <div className="space-y-4">
          {disputedContracts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {disputedContracts.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-[var(--surface)] border border-rose-500/30 shadow-xs space-y-4 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-rose-400 font-bold">
                          {c.contractNumber}
                        </span>
                        <ContractStatusBadge status={c.status} size="sm" />
                      </div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mt-1">{c.projectName}</h4>
                      <p className="text-[var(--text-muted)] text-[11px]">
                        Brand: <strong className="text-[var(--text-primary)]">{c.brandName}</strong> • Creator:{' '}
                        <strong className="text-[var(--text-primary)]">{c.creatorName}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedDisputeContract(c)}
                      className="min-h-[44px] px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-rose-600/30"
                    >
                      Open Arbitration Workbench
                    </button>
                  </div>

                  {c.dispute && (
                    <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1.5">
                      <span className="font-bold text-rose-400 font-mono text-[11px]">
                        Dispute Reason: {c.dispute.reason}
                      </span>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{c.dispute.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Dispute Queue Empty</h4>
              <p className="text-xs text-[var(--text-muted)]">
                100% of contracts are operating smoothly without active disputes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. PLATFORM CONFIGURATION & FEE POLICIES */}
      {activeView === 'config' && (
        <form
          onSubmit={handleSaveConfig}
          className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-6 text-xs max-w-3xl"
        >
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
              Contract Platform Policies & Financial Rules
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Configure dynamic platform fees, project protection ratios, and default governance windows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Platform Fee Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={config.platformFeePercentage}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    platformFeePercentage: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">Default: 10%</span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Project Protection Escrow Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={config.protectionPercentage}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    protectionPercentage: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">Default: 20%</span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Default Brand Review Window (Days)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={config.defaultApprovalWindowDays}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    defaultApprovalWindowDays: parseInt(e.target.value) || 3,
                  }))
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Default Revision Limit (Rounds)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.defaultRevisionLimit}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    defaultRevisionLimit: parseInt(e.target.value) || 2,
                  }))
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border)] flex justify-end">
            <button
              type="submit"
              className="min-h-[44px] px-6 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Save Platform Policies
            </button>
          </div>
        </form>
      )}

      {/* ARBITRATION WORKBENCH MODAL */}
      {selectedDisputeContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-mono text-rose-400 font-bold block">
                  Dispute Arbitration Workbench
                </span>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-display mt-0.5">
                  {selectedDisputeContract.contractNumber}: {selectedDisputeContract.projectName}
                </h3>
              </div>
              <ContractStatusBadge status="disputed" size="sm" />
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
              <div className="flex justify-between text-[var(--text-muted)] font-mono">
                <span>Total Protected Escrow:</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">
                  ${selectedDisputeContract.payment.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)] font-mono">
                <span>Creator Payment:</span>
                <span className="text-[var(--text-primary)]">
                  ${selectedDisputeContract.payment.creatorPayment.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Arbitration Resolution Ruling
              </label>
              <select
                value={disputeOutcome}
                onChange={(e) => setDisputeOutcome(e.target.value as any)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="partial_split">
                  Partial Split Settlement (50% Creator / 50% Brand Refund)
                </option>
                <option value="release_to_creator">
                  Ruling in Favor of Creator (Full Release of Funds)
                </option>
                <option value="refund_to_brand">
                  Ruling in Favor of Brand (Full Refund to Brand)
                </option>
                <option value="contract_cancelled">
                  Cancel Contract (Pro-Rata Settlement)
                </option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                Super Admin Determination Statement
              </label>
              <textarea
                rows={3}
                placeholder="Document the legal and factual basis for this determination..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDisputeContract(null)}
                className="min-h-[44px] px-4 rounded-xl bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)] font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleResolveDispute}
                className="min-h-[44px] px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer shadow-md shadow-rose-600/30"
              >
                Execute Ruling & Disburse Escrow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
