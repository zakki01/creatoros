import React from 'react';
import { ContractStatus } from '../../types/contract';

interface ContractStatusBadgeProps {
  status: ContractStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const ContractStatusBadge: React.FC<ContractStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const getStatusConfig = (s: ContractStatus) => {
    switch (s) {
      case 'draft':
        return {
          label: 'Draft',
          className: 'bg-zinc-800 text-zinc-300 border-zinc-700/60',
          dotColor: 'bg-zinc-400',
        };
      case 'under_review':
        return {
          label: 'Under Review',
          className: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          dotColor: 'bg-amber-400',
        };
      case 'needs_changes':
        return {
          label: 'Needs Changes',
          className: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
          dotColor: 'bg-rose-400',
        };
      case 'awaiting_creator':
        return {
          label: 'Awaiting Creator',
          className: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 animate-pulse',
          dotColor: 'bg-indigo-400',
        };
      case 'accepted':
        return {
          label: 'Accepted',
          className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dotColor: 'bg-emerald-400',
        };
      case 'funded':
        return {
          label: 'Funded & Protected',
          className: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          dotColor: 'bg-sky-400',
        };
      case 'active':
        return {
          label: 'Active',
          className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dotColor: 'bg-emerald-400',
        };
      case 'deliverable_submitted':
      case 'client_review':
        return {
          label: 'Review Needed',
          className: 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse',
          dotColor: 'bg-amber-400',
        };
      case 'revision_requested':
        return {
          label: 'Revision Requested',
          className: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
          dotColor: 'bg-orange-400',
        };
      case 'approved':
        return {
          label: 'Work Approved',
          className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dotColor: 'bg-emerald-400',
        };
      case 'payout_pending':
        return {
          label: 'Payout Processing',
          className: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          dotColor: 'bg-purple-400',
        };
      case 'paid':
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dotColor: 'bg-emerald-400',
        };
      case 'declined':
        return {
          label: 'Declined',
          className: 'bg-zinc-800 text-zinc-400 border-zinc-700/60',
          dotColor: 'bg-zinc-500',
        };
      case 'expired':
        return {
          label: 'Expired',
          className: 'bg-zinc-800 text-zinc-400 border-zinc-700/60',
          dotColor: 'bg-zinc-500',
        };
      case 'disputed':
        return {
          label: 'Disputed',
          className: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
          dotColor: 'bg-rose-400',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-zinc-800 text-zinc-400 border-zinc-700/60',
          dotColor: 'bg-zinc-500',
        };
      case 'refunded':
        return {
          label: 'Refunded',
          className: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          dotColor: 'bg-purple-400',
        };
      default:
        return {
          label: status,
          className: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          dotColor: 'bg-zinc-400',
        };
    }
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.className} ${sizeClasses} shrink-0 select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span className="font-semibold tracking-wide uppercase text-[10px]">{config.label}</span>
    </span>
  );
};
