import React, { useState } from 'react';
import { X, DollarSign, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { FinanceService, UserPaymentMethod, IdentityVerificationRecord } from '../../services/financeService';

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  availableBalance?: number;
  paymentMethods?: UserPaymentMethod[];
  kycRecord?: IdentityVerificationRecord | null;
  onSuccess: () => void;
}

export const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  isOpen,
  onClose,
  userId,
  availableBalance = 0,
  paymentMethods: initialMethods,
  kycRecord: initialKyc,
  onSuccess,
}) => {
  const [methods, setMethods] = useState<UserPaymentMethod[]>(initialMethods || []);
  const [kyc, setKyc] = useState<IdentityVerificationRecord | null>(initialKyc || null);

  React.useEffect(() => {
    if (initialMethods) setMethods(initialMethods);
  }, [initialMethods]);

  React.useEffect(() => {
    if (initialKyc !== undefined) setKyc(initialKyc);
  }, [initialKyc]);

  React.useEffect(() => {
    if (isOpen && (!initialMethods || initialKyc === undefined)) {
      Promise.all([
        FinanceService.getPaymentMethods(userId),
        FinanceService.getIdentityVerification(userId),
      ]).then(([mList, kRecord]) => {
        setMethods(mList);
        setKyc(kRecord);
        const preferred = mList.find((m) => m.isPreferred) || mList[0];
        if (preferred) setSelectedMethodId(preferred.id);
      });
    }
  }, [isOpen, userId]);

  const [amount, setAmount] = useState<string>(availableBalance > 0 ? String(availableBalance) : '');
  const [selectedMethodId, setSelectedMethodId] = useState<string>(() => {
    const list = initialMethods || [];
    const preferred = list.find((m) => m.isPreferred) || list[0];
    return preferred ? preferred.id : '';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isKycVerified = kyc && kyc.status === 'VERIFIED';
  const hasEligibleMethod = methods.length > 0;
  const selectedMethod = methods.find((m) => m.id === selectedMethodId) || methods[0];

  const handleConfirmPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid payout amount greater than $0.00.');
      return;
    }
    if (parsedAmount > availableBalance && availableBalance > 0) {
      setError(`Requested amount ($${parsedAmount}) exceeds available balance ($${availableBalance}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await FinanceService.requestPayout(userId, {
        contractId: `manual_balance_req_${Date.now()}`,
        amount: parsedAmount,
        currency: 'USD',
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Failed to request payout.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Request Milestone Payout</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Disburse cleared escrow earnings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmPayout} className="p-6 space-y-4">
          {!isKycVerified ? (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Identity Verification Required</span>
                <span>Government identity verification must be completed and approved before payouts can be disbursed.</span>
              </div>
            </div>
          ) : !hasEligibleMethod ? (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">No Payout Method Found</span>
                <span>Please configure a PayPal, Stripe Connect, or UPI payout method first in Payout Information.</span>
              </div>
            </div>
          ) : null}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
              Payout Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-mono text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={!isKycVerified || !hasEligibleMethod}
                className="w-full min-h-[40px] pl-7 pr-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all disabled:opacity-50"
              />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Available to disburse: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${availableBalance.toLocaleString()}</span>
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
              Disbursement Method
            </label>
            <select
              value={selectedMethodId}
              onChange={(e) => setSelectedMethodId(e.target.value)}
              disabled={!hasEligibleMethod}
              className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              {methods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.providerType.toUpperCase()} — {m.identifier} {m.isPreferred ? '(Preferred)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-750 text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5">
            <div className="flex justify-between">
              <span>Platform Disbursement Fee</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">$0.00 (0%)</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Settlement</span>
              <span className="font-mono">1 – 2 Business Days</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isKycVerified || !hasEligibleMethod}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Request'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
