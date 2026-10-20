import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  Sparkles,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { BrandContract } from '../../types/contract';
import { ContractService } from '../../services/contractService';
import { ContractSummaryCard } from '../contracts/ContractSummaryCard';
import { ContractBuilderPage } from '../contracts/ContractBuilderPage';
import { ContractDetailWorkspace } from '../contracts/ContractDetailWorkspace';

interface ContractsWorkspaceProps {
  initialContractId?: string | null;
  initialCreatorId?: string | null;
  initialCampaignId?: string | null;
  initialMode?: 'list' | 'new' | 'detail';
  onNavigateToMessages?: (creatorId: string) => void;
}

export const ContractsWorkspace: React.FC<ContractsWorkspaceProps> = ({
  initialContractId = null,
  initialCreatorId = null,
  initialCampaignId = null,
  initialMode = 'list',
  onNavigateToMessages,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'new' | 'detail'>(() => {
    if (initialContractId) return 'detail';
    if (initialCreatorId || initialMode === 'new') return 'new';
    return 'list';
  });

  const [activeContractId, setActiveContractId] = useState<string | null>(initialContractId);
  const [activeTab, setActiveTab] = useState<
    'all' | 'drafts' | 'review' | 'awaiting_creator' | 'active' | 'review_work' | 'completed' | 'disputed'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [contracts, setContracts] = useState<BrandContract[]>(() =>
    ContractService.getAllContracts()
  );

  const reloadContracts = () => {
    setContracts(ContractService.getAllContracts());
  };

  const handleOpenContract = (contractId: string) => {
    setActiveContractId(contractId);
    setViewMode('detail');
  };

  const handleContractCreated = (contractId: string) => {
    reloadContracts();
    setActiveContractId(contractId);
    setViewMode('detail');
  };

  // If in Create New Contract mode
  if (viewMode === 'new') {
    return (
      <ContractBuilderPage
        initialCreatorId={initialCreatorId}
        initialCampaignId={initialCampaignId}
        onBack={() => {
          reloadContracts();
          setViewMode('list');
        }}
        onContractCreated={handleContractCreated}
      />
    );
  }

  // If in Contract Detail Workspace mode
  if (viewMode === 'detail' && activeContractId) {
    return (
      <ContractDetailWorkspace
        contractId={activeContractId}
        viewerRole="brand"
        onBack={() => {
          reloadContracts();
          setViewMode('list');
          setActiveContractId(null);
        }}
        onOpenMessages={onNavigateToMessages}
      />
    );
  }

  // Filter contracts
  const filteredContracts = contracts.filter((c) => {
    // Search query
    const matchesSearch =
      c.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creatorHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'drafts') return c.status === 'draft';
    if (activeTab === 'review') return c.status === 'under_review';
    if (activeTab === 'awaiting_creator') return c.status === 'awaiting_creator';
    if (activeTab === 'active') return c.status === 'active' || c.status === 'funded';
    if (activeTab === 'review_work')
      return c.status === 'client_review' || c.status === 'deliverable_submitted';
    if (activeTab === 'completed')
      return c.status === 'completed' || c.status === 'paid' || c.status === 'payout_pending';
    if (activeTab === 'disputed') return c.status === 'disputed' || c.status === 'cancelled';
    return true;
  });

  // Tab counts
  const tabCounts = {
    all: contracts.length,
    drafts: contracts.filter((c) => c.status === 'draft').length,
    review: contracts.filter((c) => c.status === 'under_review').length,
    awaiting_creator: contracts.filter((c) => c.status === 'awaiting_creator').length,
    active: contracts.filter((c) => c.status === 'active' || c.status === 'funded').length,
    review_work: contracts.filter(
      (c) => c.status === 'client_review' || c.status === 'deliverable_submitted'
    ).length,
    completed: contracts.filter(
      (c) => c.status === 'completed' || c.status === 'paid' || c.status === 'payout_pending'
    ).length,
    disputed: contracts.filter((c) => c.status === 'disputed' || c.status === 'cancelled').length,
  };

  // Metric sums
  const activeCount = contracts.filter((c) => c.status === 'active' || c.status === 'funded').length;
  const totalProtectedFunds = contracts
    .filter((c) => c.payment.paymentStatus === 'escrow_funded')
    .reduce((sum, c) => sum + c.payment.totalAmount, 0);
  const pendingApprovals = contracts.filter(
    (c) => c.status === 'client_review' || c.status === 'deliverable_submitted'
  ).length;

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-16">
      {/* 1. Header with Prominent "+ Create Contract" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              Contracts
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/25">
              Protected Escrow
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Commercial agreements, deliverable tracking, and escrow payments.
          </p>
        </div>

        <button
          onClick={() => setViewMode('new')}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Contract</span>
        </button>
      </div>

      {/* 2. Compact Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Active Projects</span>
          <p className="text-base font-bold text-white font-mono">{activeCount}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Funds in Protection</span>
          <p className="text-base font-bold text-emerald-400 font-mono">
            ${totalProtectedFunds.toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Pending Reviews</span>
          <p className="text-base font-bold text-amber-400 font-mono">{pendingApprovals}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Dispute-Free Rate</span>
          <p className="text-base font-bold text-indigo-400 font-mono">98.4%</p>
        </div>
      </div>

      {/* 3. Navigation Filter Tabs (All, Drafts, Review, Awaiting Creator, Active, Review Work, Completed, Disputed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All', count: tabCounts.all },
            { id: 'drafts', label: 'Drafts', count: tabCounts.drafts },
            { id: 'review', label: 'Review', count: tabCounts.review },
            { id: 'awaiting_creator', label: 'Awaiting Creator', count: tabCounts.awaiting_creator },
            { id: 'active', label: 'Active', count: tabCounts.active },
            { id: 'review_work', label: 'Review Work', count: tabCounts.review_work },
            { id: 'completed', label: 'Completed', count: tabCounts.completed },
            { id: 'disputed', label: 'Disputed', count: tabCounts.disputed },
          ].map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-zinc-800 text-white border border-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isCurrent
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-9 pr-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 4. Contracts Cards Grid (Responsive, compact, no huge table squeezed onto mobile) */}
      {filteredContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContracts.map((c) => (
            <ContractSummaryCard
              key={c.id}
              contract={c}
              onOpen={handleOpenContract}
              viewerRole="brand"
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 text-center space-y-4">
          <FileText className="w-10 h-10 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              {activeTab === 'drafts'
                ? 'No saved drafts'
                : activeTab === 'review'
                ? 'No contracts under review'
                : activeTab === 'awaiting_creator'
                ? 'No contracts awaiting creator response'
                : activeTab === 'active'
                ? 'No active contracts currently running'
                : activeTab === 'review_work'
                ? 'No deliverables pending brand review'
                : activeTab === 'completed'
                ? 'No completed contracts yet'
                : activeTab === 'disputed'
                ? 'Zero disputes'
                : 'No contracts found'}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Create a contract to collaborate with creators under protected payments.
            </p>
          </div>

          <button
            onClick={() => setViewMode('new')}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Contract</span>
          </button>
        </div>
      )}
    </div>
  );
};
