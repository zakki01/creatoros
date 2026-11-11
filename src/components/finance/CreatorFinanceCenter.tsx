import React, { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  ShieldCheck,
  DollarSign,
  History,
  Lock,
} from 'lucide-react';
import { FinanceOverview } from './FinanceOverview';
import { PayoutSettings } from './PayoutSettings';
import { TaxInformationView } from './TaxInformationView';
import { IdentityVerificationView } from './IdentityVerificationView';
import { EarningsHistoryView } from './EarningsHistoryView';
import { PayoutHistoryView } from './PayoutHistoryView';
import { RequestPayoutModal } from './RequestPayoutModal';
import { Badge } from '../ui/Badge';

export type FinanceTab =
  | 'overview'
  | 'payout_info'
  | 'tax_info'
  | 'identity'
  | 'earnings'
  | 'payout_history';

interface CreatorFinanceCenterProps {
  userId: string;
  initialTab?: FinanceTab;
}

export const CreatorFinanceCenter: React.FC<CreatorFinanceCenterProps> = ({
  userId,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>(initialTab);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const tabs: { id: FinanceTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'payout_info', label: 'Payout Methods', icon: CreditCard },
    { id: 'tax_info', label: 'Tax Information', icon: FileText },
    { id: 'identity', label: 'Identity Verification', icon: ShieldCheck },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'payout_history', label: 'Payout History', icon: History },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
              Finance & Payout Center
            </h1>
            <Badge variant="success" size="sm" dot>
              Escrow Protected
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Compliant global creator financial settlement via PayPal, Stripe Connect, and UPI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-white" />
            <span>Request Payout</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[var(--border)] scrollbar-none flex-nowrap -mx-1 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-sm font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <FinanceOverview
            userId={userId}
            onRequestPayout={() => setIsPayoutModalOpen(true)}
            onNavigateTab={(t: string) => setActiveTab(t as FinanceTab)}
          />
        )}

        {activeTab === 'payout_info' && (
          <PayoutSettings userId={userId} />
        )}

        {activeTab === 'tax_info' && (
          <TaxInformationView userId={userId} />
        )}

        {activeTab === 'identity' && (
          <IdentityVerificationView userId={userId} />
        )}

        {activeTab === 'earnings' && (
          <EarningsHistoryView userId={userId} />
        )}

        {activeTab === 'payout_history' && (
          <PayoutHistoryView userId={userId} />
        )}
      </div>

      {/* Request Payout Modal */}
      <RequestPayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        userId={userId}
        availableBalance={0}
        onSuccess={() => {
          setIsPayoutModalOpen(false);
          setActiveTab('payout_history');
        }}
      />
    </div>
  );
};
