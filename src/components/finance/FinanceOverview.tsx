import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  FinancialBalanceSummary,
  UserPaymentMethod,
  UserTaxProfile,
  IdentityVerificationRecord,
  PayoutRequestItem,
  FinanceService,
} from '../../services/financeService';
import { Badge } from '../ui/Badge';
import { SpatialCard } from '../ui/SpatialCard';

interface FinanceOverviewProps {
  userId?: string;
  balances?: FinancialBalanceSummary;
  paymentMethods?: UserPaymentMethod[];
  taxProfile?: UserTaxProfile | null;
  kycRecord?: IdentityVerificationRecord | null;
  payoutRequests?: PayoutRequestItem[];
  onRequestPayout: () => void;
  onNavigateTab: (tabId: any) => void;
}

export const FinanceOverview: React.FC<FinanceOverviewProps> = ({
  userId = '',
  balances: initialBalances,
  paymentMethods: initialMethods,
  taxProfile: initialTax,
  kycRecord: initialKyc,
  payoutRequests: initialPayouts,
  onRequestPayout,
  onNavigateTab,
}) => {
  const [balances, setBalances] = React.useState<FinancialBalanceSummary>(
    initialBalances || { availableBalance: 0, pendingBalance: 0, inEscrowBalance: 0, lifetimeEarnings: 0, currency: 'USD' }
  );
  const [paymentMethods, setPaymentMethods] = React.useState<UserPaymentMethod[]>(initialMethods || []);
  const [taxProfile, setTaxProfile] = React.useState<UserTaxProfile | null>(initialTax || null);
  const [kycRecord, setKycRecord] = React.useState<IdentityVerificationRecord | null>(initialKyc || null);
  const [payoutRequests, setPayoutRequests] = React.useState<PayoutRequestItem[]>(initialPayouts || []);

  React.useEffect(() => {
    if (userId && (!initialBalances || !initialMethods || !initialTax || !initialKyc || !initialPayouts)) {
      Promise.all([
        FinanceService.getBalanceSummary(userId),
        FinanceService.getPaymentMethods(userId),
        FinanceService.getTaxProfile(userId),
        FinanceService.getIdentityVerification(userId),
        FinanceService.getPayoutRequests(userId),
      ]).then(([b, m, t, k, p]) => {
        if (!initialBalances) setBalances(b);
        if (!initialMethods) setPaymentMethods(m);
        if (!initialTax) setTaxProfile(t);
        if (!initialKyc) setKycRecord(k);
        if (!initialPayouts) setPayoutRequests(p);
      }).catch(() => {});
    }
  }, [userId]);
  const preferredMethod = paymentMethods.find((m) => m.isPreferred) || paymentMethods[0];
  const isKycVerified = kycRecord && kycRecord.status === 'VERIFIED';
  const isTaxVerified = taxProfile && taxProfile.verificationStatus === 'verified';

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Dominant Balance Card */}
      <SpatialCard surface={3} glowColor="emerald" className="p-6 sm:p-7 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(124,92,255,0.15) 60%, transparent 80%)',
          }}
        />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block">
                Total Available For Payout
              </span>
              <Badge variant="success" size="sm" dot>
                0% Escrow Hold Fee
              </Badge>
            </div>
            <p className="text-3xl sm:text-4xl font-bold font-mono text-[var(--text-primary)] tracking-tight mt-1">
              ${balances.availableBalance.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Cleared milestone earnings ready for disbursement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRequestPayout}
              className="min-h-[44px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Request Payout</span>
            </button>
          </div>
        </div>

        {/* Sub-balances Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[var(--border)] relative z-10">
          <div className="p-3.5 rounded-xl surface-2">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-mono font-medium block">
              Pending / In Escrow
            </span>
            <p className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
              ${balances.pendingBalance.toLocaleString()}
            </p>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
              Awaiting milestone approval
            </span>
          </div>

          <div className="p-3.5 rounded-xl surface-2">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono font-medium block">
              Processing Disbursements
            </span>
            <p className="text-lg font-bold font-mono text-[var(--text-primary)] mt-0.5">
              $
              {payoutRequests
                .filter((p) => p.status === 'PAYOUT_PROCESSING' || p.status === 'PAYOUT_PENDING')
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </p>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
              In transit to payment rail
            </span>
          </div>

          <div className="p-3.5 rounded-xl surface-2">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-mono font-medium block">
              Lifetime Earned
            </span>
            <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              ${balances.lifetimeEarnings.toLocaleString()}
            </p>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
              Total historical settlement
            </span>
          </div>
        </div>
      </SpatialCard>

      {/* Compliance & Payout Readiness Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Payout Method Card */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Payout Method</span>
              <CreditCard className="w-4 h-4 text-zinc-500" />
            </div>
            {preferredMethod ? (
              <div>
                <span className="text-sm font-bold text-[var(--text-primary)] block">
                  {preferredMethod.providerType.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {preferredMethod.identifier}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  Active Preferred Method
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xs text-amber-500 font-semibold block">No Method Configured</span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Connect PayPal, Stripe, or UPI to receive earnings.
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigateTab('payout_info')}
            className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-semibold text-[var(--primary)] hover:underline flex items-center justify-between cursor-pointer"
          >
            <span>Manage Methods</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Identity Verification Card */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Identity Verification</span>
              <ShieldCheck className="w-4 h-4 text-zinc-500" />
            </div>
            {isKycVerified ? (
              <div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Identity</span>
                </div>
                <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                  Document verified & eligible for global payouts.
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xs text-amber-500 font-semibold block">
                  {kycRecord ? kycRecord.status.replace('_', ' ') : 'Not Started'}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Submit government ID to unlock payouts.
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigateTab('identity')}
            className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-semibold text-[var(--primary)] hover:underline flex items-center justify-between cursor-pointer"
          >
            <span>{isKycVerified ? 'View KYC Details' : 'Complete Verification'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tax Information Card */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Tax Profile</span>
              <FileText className="w-4 h-4 text-zinc-500" />
            </div>
            {isTaxVerified ? (
              <div>
                <span className="text-sm font-bold text-[var(--text-primary)] block">
                  PAN: {taxProfile.taxIdMasked}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Residency: {taxProfile.taxResidency}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  Tax Form Certified
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xs text-amber-500 font-semibold block">Action Required</span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Submit PAN / Tax ID for compliance withholding.
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigateTab('tax_info')}
            className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-semibold text-[var(--primary)] hover:underline flex items-center justify-between cursor-pointer"
          >
            <span>{isTaxVerified ? 'Edit Tax Details' : 'Configure Tax Info'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Payout Activity Preview */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Payout Requests</h3>
          <button
            onClick={() => onNavigateTab('payout_history')}
            className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
          >
            View All ({payoutRequests.length})
          </button>
        </div>

        {payoutRequests.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-xl text-xs text-[var(--text-muted)] space-y-1">
            <Clock className="w-6 h-6 mx-auto text-zinc-500 opacity-40 mb-2" />
            <span className="font-semibold text-[var(--text-secondary)] block">No Payout Requests Yet</span>
            <span>Once contract milestones are approved, request payouts here with 1-click.</span>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {payoutRequests.slice(0, 3).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">
                    ${p.amount.toLocaleString()} ({p.methodType.toUpperCase()})
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    {p.recipientIdentifier} • {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Badge
                  variant={p.status === 'PAYOUT_COMPLETED' ? 'success' : 'warning'}
                  size="sm"
                >
                  {p.status.replace('PAYOUT_', '')}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
