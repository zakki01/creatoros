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
          className: 'bg-zinc-100 text-zinc-700 border-zinc-200 shadow-xs',
          dotColor: 'bg-zinc-500',
        };
      case 'under_review':
        return {
          label: 'Platform Review',
          className: 'bg-amber-50 text-amber-800 border-amber-200/90 shadow-xs',
          dotColor: 'bg-amber-500',
        };
      case 'needs_changes':
        return {
          label: 'Changes Required',
          className: 'bg-rose-50 text-rose-800 border-rose-200/90 shadow-xs',
          dotColor: 'bg-rose-500',
        };
      case 'awaiting_creator':
        return {
          label: viewerRole === 'creator' ? 'Awaiting Response' : 'Sent',
          className: 'bg-amber-50 text-amber-800 border-amber-200/90 shadow-xs',
          dotColor: 'bg-amber-500',
        };
      case 'accepted':
        return {
          label: 'Signed',
          className: 'bg-purple-50 text-purple-800 border-purple-200/90 shadow-xs',
          dotColor: 'bg-purple-500',
        };
      case 'funded':
      case 'active':
        return {
          label: 'Active',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 shadow-xs',
          dotColor: 'bg-emerald-500',
        };
      case 'deliverable_submitted':
      case 'client_review':
        return {
          label: viewerRole === 'creator' ? 'Brand Review' : 'Review Work',
          className: 'bg-amber-50 text-amber-800 border-amber-200/90 shadow-xs',
          dotColor: 'bg-amber-500',
        };
      case 'revision_requested':
        return {
          label: 'Revision',
          className: 'bg-amber-50 text-amber-800 border-amber-200/90 shadow-xs',
          dotColor: 'bg-amber-500',
        };
      case 'approved':
        return {
          label: 'Approved',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 shadow-xs',
          dotColor: 'bg-emerald-500',
        };
      case 'payout_pending':
        return {
          label: 'Payout Pending',
          className: 'bg-purple-50 text-purple-800 border-purple-200/90 shadow-xs',
          dotColor: 'bg-purple-500',
        };
      case 'paid':
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 shadow-xs',
          dotColor: 'bg-emerald-500',
        };
      case 'declined':
        return {
          label: 'Declined',
          className: 'bg-rose-50 text-rose-800 border-rose-200/90 shadow-xs',
          dotColor: 'bg-rose-500',
        };
      case 'expired':
        return {
          label: 'Expired',
          className: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          dotColor: 'bg-zinc-400',
        };
      case 'disputed':
        return {
          label: 'Disputed',
          className: 'bg-rose-50 text-rose-800 border-rose-200/90 shadow-xs',
          dotColor: 'bg-rose-500',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          dotColor: 'bg-zinc-400',
        };
      case 'refunded':
        return {
          label: 'Refunded',
          className: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          dotColor: 'bg-zinc-400',
        };
      default:
        return {
          label: (s as string).replace(/_/g, ' '),
          className: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          dotColor: 'bg-zinc-500',
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

