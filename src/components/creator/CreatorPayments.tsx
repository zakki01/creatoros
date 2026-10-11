import React from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  DollarSign,
  Download,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PaymentStatus } from '../../types';

export const CreatorPayments: React.FC = () => {
  const { payments, creators } = useAppState();
  const currentCreator = creators[0];

  const creatorPayments = payments.filter((p) => p.creatorId === currentCreator.id);

  const totalPaid = creatorPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = creatorPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalUpcoming = creatorPayments
    .filter((p) => p.status === 'upcoming')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalEarnings = totalPaid + totalPending + totalUpcoming;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 font-display">
              Earnings & Payout Milestones
            </h1>
            <Badge variant="success" size="sm" dot>
              Direct Bank Escrow
            </Badge>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Automated milestone payouts released directly into your registered bank account.
          </p>
        </div>

        <div className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-xl">
          Account: <strong className="text-zinc-200">HDFC Bank (•••• 4921)</strong>
        </div>
      </div>

      {/* 4 Financial Tiles (Total, Paid, Pending, Upcoming as specified) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase font-medium">Total Contracted</span>
          <p className="text-xl font-bold font-mono text-zinc-100">
            ₹{totalEarnings.toLocaleString()}
          </p>
          <span className="text-[10px] text-zinc-500">Across active drops</span>
        </Card>

        <Card className="p-4 space-y-1 border-emerald-500/30 bg-emerald-950/20">
          <span className="text-[10px] text-emerald-400 uppercase font-medium">Paid (Deposited)</span>
          <p className="text-xl font-bold font-mono text-emerald-400">
            ₹{totalPaid.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-500 font-medium">Settled in bank</span>
        </Card>

        <Card className="p-4 space-y-1 border-amber-500/30 bg-amber-950/20">
          <span className="text-[10px] text-amber-400 uppercase font-medium">Pending Release</span>
          <p className="text-xl font-bold font-mono text-amber-300">
            ₹{totalPending.toLocaleString()}
          </p>
          <span className="text-[10px] text-amber-400/80">In milestone escrow</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase font-medium">Upcoming Milestones</span>
          <p className="text-xl font-bold font-mono text-zinc-300">
            ₹{totalUpcoming.toLocaleString()}
          </p>
          <span className="text-[10px] text-zinc-500">Post-publishing</span>
        </Card>
      </div>

      {/* Payment Timeline Specification (Contract -> Advance -> Content Approval -> Final Payment) */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100 font-display">
              Campaign Payment Timeline Model
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              CreatorOS locks brand funds in escrow upfront so you never need to chase invoices.
            </p>
          </div>
          <Badge variant="brand" size="sm">
            Automated Escrow
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">1. Contract Execution</span>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-zinc-400">Funds locked in escrow</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300">2. Advance Payout</span>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-emerald-400/80">50% upfront transferred</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300">3. Content Approval</span>
              <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-zinc-400">Triggered upon brand sign-off</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1 opacity-70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300">4. Final Payment</span>
              <span className="text-[10px] text-zinc-500">Upcoming</span>
            </div>
            <p className="text-[11px] text-zinc-500">Released after post goes live</p>
          </div>
        </div>
      </Card>

      {/* Transaction Records Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Invoices & Remittance Receipts
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">Instant Bank ACH / UPI</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Milestone</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {creatorPayments.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-850/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-zinc-400 font-medium">
                    {p.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">{p.campaignName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-300 text-[11px]">
                      {p.milestone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-100">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'neutral'}
                      size="sm"
                      dot
                    >
                      {p.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">
                    {p.paidDate ? p.paidDate : `Due ${p.dueDate}`}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 text-xs font-mono inline-flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
