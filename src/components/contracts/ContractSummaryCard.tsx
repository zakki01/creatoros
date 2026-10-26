import React from 'react';
import { ShieldCheck, Calendar, ArrowRight, Clock, FileText } from 'lucide-react';
import { BrandContract } from '../../types/contract';
import { ContractStatusBadge } from './ContractStatusBadge';

interface ContractSummaryCardProps {
  contract: BrandContract;
  onOpen: (contractId: string) => void;
  viewerRole?: 'brand' | 'creator' | 'admin';
}

export const ContractSummaryCard: React.FC<ContractSummaryCardProps> = ({
  contract,
  onOpen,
  viewerRole = 'brand',
}) => {
  const isAwaitingReview =
    contract.status === 'client_review' || contract.status === 'deliverable_submitted';

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: contract.payment.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(contract.payment.creatorPayment);

  const formattedDate = new Date(contract.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const lastUpdated = new Date(contract.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={() => onOpen(contract.id)}
      className="group relative p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-black/[0.08] hover:border-black/20 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 shadow-xs hover:shadow-sm"
    >
      {/* Top Row: Creator Avatar, Name & Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={contract.creatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={contract.creatorName || 'Creator'}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/10"
            />
            {contract.creatorVerified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-2 ring-white">
                ✓
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-zinc-900 truncate group-hover:text-[#0096C7] transition-colors">
                {contract.creatorName || 'Unassigned Creator'}
              </h4>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate">
              {contract.creatorHandle || '@creator'} • {contract.contractNumber}
            </p>
          </div>
        </div>

        <ContractStatusBadge status={contract.status} size="sm" />
      </div>

      {/* Middle: Project Title & Deliverables Summary */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-zinc-900 line-clamp-1">
          {contract.projectName}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="truncate">
            {contract.deliverables.map((d) => `${d.quantity} ${d.type}`).join(', ') || 'No deliverables'}
          </span>
        </div>
      </div>

      {/* Bottom Row: Amount, Due Date, and Action */}
      <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Compensation</span>
            <span className="font-bold text-zinc-900 font-mono text-sm">{formattedAmount}</span>
          </div>

          <div className="hidden sm:block h-6 w-px bg-zinc-200" />

          <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Due {formattedDate}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(contract.id);
          }}
          className="min-h-[44px] min-w-[70px] px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-[#00B4D8] text-zinc-800 hover:text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-200 hover:border-[#00B4D8]"
        >
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Urgent indicator if review pending */}
      {isAwaitingReview && viewerRole === 'brand' && (
        <div className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </div>
      )}
    </div>
  );
};
