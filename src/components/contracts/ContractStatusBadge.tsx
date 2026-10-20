import React from 'react';
import { ContractStatus } from '../../types/contract';

interface ContractStatusBadgeProps {
  status: ContractStatus;
  viewerRole?: 'brand' | 'creator' | 'admin';
  size?: 'sm' | 'md' | 'lg';
}

export const ContractStatusBadge: React.FC<ContractStatusBadgeProps> = ({
  status,
  viewerRole = 'creator',
  size = 'md',
}) => {
  const getStatusConfig = (s: ContractStatus) => {
    switch (s) {
      case 'draft':
        return {
          label: 'Draft',
          className: 'bg-zinc-900/90 text-zinc-300 border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
          dotColor: 'bg-zinc-400',
        };
      case 'under_review':
        return {
          label: 'Platform Review',
          className: 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-[0_0_14px_-3px_rgba(245,158,11,0.35)]',
          dotColor: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
        };
      case 'needs_changes':
        return {
          label: 'Changes Required',
          className: 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-[0_0_14px_-3px_rgba(244,63,94,0.35)]',
          dotColor: 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
        };
      case 'awaiting_creator':
        return {
          label: viewerRole === 'creator' ? 'Awaiting Response' : 'Sent',
          className: 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-[0_0_14px_-3px_rgba(245,158,11,0.38)]',
          dotColor: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.85)]',
        };
      case 'accepted':
        return {
          label: 'Signed',
          className: 'bg-purple-500/15 text-purple-300 border-purple-500/35 shadow-[0_0_14px_-3px_rgba(168,85,247,0.4)]',
          dotColor: 'bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.85)]',
        };
      case 'funded':
      case 'active':
        return {
          label: 'Active',
          className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 shadow-[0_0_14px_-3px_rgba(16,185,129,0.38)]',
          dotColor: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.85)]',
        };
      case 'deliverable_submitted':
      case 'client_review':
        return {
          label: viewerRole === 'creator' ? 'Brand Review' : 'Review Work',
          className: 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-[0_0_14px_-3px_rgba(245,158,11,0.35)]',
          dotColor: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
        };
      case 'revision_requested':
        return {
          label: 'Revision',
          className: 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-[0_0_14px_-3px_rgba(245,158,11,0.35)]',
          dotColor: 'bg-amber-400',
        };
      case 'approved':
        return {
          label: 'Approved',
          className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 shadow-[0_0_14px_-3px_rgba(16,185,129,0.38)]',
          dotColor: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.85)]',
        };
      case 'payout_pending':
        return {
          label: 'Payout Pending',
          className: 'bg-purple-500/15 text-purple-300 border-purple-500/35 shadow-[0_0_14px_-3px_rgba(168,85,247,0.38)]',
          dotColor: 'bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.85)]',
        };
      case 'paid':
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_16px_-3px_rgba(16,185,129,0.42)]',
          dotColor: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]',
        };
      case 'declined':
        return {
          label: 'Declined',
          className: 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-[0_0_14px_-3px_rgba(244,63,94,0.35)]',
          dotColor: 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
        };
      case 'expired':
        return {
          label: 'Expired',
          className: 'bg-zinc-900 text-zinc-400 border-white/10',
          dotColor: 'bg-zinc-500',
        };
      case 'disputed':
        return {
          label: 'Disputed',
          className: 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-[0_0_14px_-3px_rgba(244,63,94,0.38)]',
          dotColor: 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.85)]',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-zinc-900 text-zinc-400 border-white/10',
          dotColor: 'bg-zinc-500',
        };
      case 'refunded':
        return {
          label: 'Refunded',
          className: 'bg-zinc-900 text-zinc-400 border-white/10',
          dotColor: 'bg-zinc-500',
        };
      default:
        return {
          label: (s as string).replace(/_/g, ' '),
          className: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          dotColor: 'bg-zinc-400',
        };
    }
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-md transition-all ${sizeClasses} ${config.className} shrink-0 select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor}`} />
      <span className="font-semibold tracking-tight">{config.label}</span>
    </span>
  );
};

