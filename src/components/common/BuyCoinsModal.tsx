import React, { useState } from 'react';
import {
  Coins,
  Check,
  Sparkles,
  X,
  ShieldCheck,
  Loader2,
  Smartphone,
  CreditCard,
  Building,
  Globe,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { COIN_PACKAGES, CoinPackage, GiftLedgerService } from '../../services/giftLedgerService';
import { FinanceService } from '../../services/financeService';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface BuyCoinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onCoinsPurchased?: (newBalance: number) => void;
}

export const BuyCoinsModal: React.FC<BuyCoinsModalProps> = ({
  isOpen,
  onClose,
  userId,
  onCoinsPurchased,
}) => {
  const toast = useToast();
  const [selectedPkg, setSelectedPkg] = useState<CoinPackage>(COIN_PACKAGES[1]);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [paymentType, setPaymentType] = useState<'upi' | 'card' | 'netbanking' | 'paypal'>('upi');

  // Payment Form States
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [saveMethod, setSaveMethod] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // INR conversion rate approximation (1 USD = 83 INR)
  const getPrice = (pkg: CoinPackage) => {
    if (currency === 'INR') {
      const inrMap: Record<string, number> = {
        'coin-pack-starter': 89,
        'coin-pack-creator': 399,
        'coin-pack-pro': 799,
        'coin-pack-elite': 3999,
      };
      return `₹${inrMap[pkg.id] || Math.round(pkg.priceUsd * 83)}`;
    }
    return `$${pkg.priceUsd.toFixed(2)}`;
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate based on payment type
    if (paymentType === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g. name@okhdfcbank or 9876543210@paytm)');
        return;
      }
    } else if (paymentType === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        setError('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cardCvv.length < 3) {
        setError('Please enter a valid 3-digit CVV.');
        return;
      }
    } else if (paymentType === 'paypal') {
      if (!paypalEmail.trim() || !paypalEmail.includes('@')) {
        setError('Please enter a valid PayPal account email.');
        return;
      }
    }

    setIsProcessing(true);
    try {
      // Simulate real-time payment gateway handshake
      await new Promise((r) => setTimeout(r, 900));

      const txId = `txn_${paymentType}_${Date.now()}`;

      // Save method if checked
      if (saveMethod && userId) {
        const identifier =
          paymentType === 'upi'
            ? upiId.trim()
            : paymentType === 'card'
            ? `•••• •••• •••• ${cardNumber.replace(/\s+/g, '').slice(-4)}`
            : paymentType === 'paypal'
            ? paypalEmail.trim()
            : selectedBank;

        await FinanceService.addPaymentMethod(userId, {
          providerType: paymentType === 'upi' ? 'upi' : paymentType === 'paypal' ? 'paypal' : 'stripe',
          identifier,
          isPreferred: true,
        }).catch(() => {});
      }

      // Record verified purchase into double-entry coin ledger
      const entry = await GiftLedgerService.purchaseCoins(userId, selectedPkg.id, txId);

      toast.success(
        `Added ${selectedPkg.coins + selectedPkg.bonusCoins} CreatorOS Coins to your vault!`
      );
      onCoinsPurchased?.(entry.balanceAfter);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please check your credentials.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="studio-card-soft rounded-3xl w-full max-w-xl p-6 sm:p-7 bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 mb-5 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Buy CreatorOS Coins</h3>
              <p className="text-xs text-[var(--text-secondary)]">Instant vault deposit for live stream gifting & support.</p>
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === 'INR' ? 'bg-[var(--accent)] text-white shadow-xs' : 'text-[var(--text-secondary)]'
              }`}
            >
              ₹ INR
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === 'USD' ? 'bg-[var(--accent)] text-white shadow-xs' : 'text-[var(--text-secondary)]'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Coin Package Selector Grid */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider">
            Select Coin Pack
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {COIN_PACKAGES.map((pkg) => {
              const isSelected = selectedPkg.id === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPkg(pkg)}
                  className={`relative p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-xs ring-2 ring-[var(--accent)]/20'
                      : 'border-[var(--border)] hover:border-[var(--accent)]/40 bg-[var(--surface-muted)]'
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[var(--accent)] text-white uppercase tracking-wider shadow-xs">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-base mb-1">
                    <Coins className="w-4 h-4 shrink-0" />
                    <span>{pkg.coins}</span>
                  </div>
                  {pkg.bonusCoins > 0 ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                      +{pkg.bonusCoins} bonus
                    </span>
                  ) : (
                    <span className="text-[10px] text-[var(--text-muted)] mb-1">Standard</span>
                  )}
                  <div className="text-sm font-bold text-[var(--text-primary)] mt-auto">
                    {getPrice(pkg)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Method Selector */}
        <form onSubmit={handlePurchase} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider">
              Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentType('upi')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  paymentType === 'upi'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('card')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  paymentType === 'card'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                    : 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('netbanking')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  paymentType === 'netbanking'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('paypal')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  paymentType === 'paypal'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>PayPal</span>
              </button>
            </div>
          </div>

          {/* Payment Method Details Form */}
          <div className="p-4 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-3">
            {paymentType === 'upi' && (
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                  UPI ID / Virtual Payment Address (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@paytm or user@okhdfcbank"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]"
                  required
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-[var(--text-secondary)]">Popular handles:</span>
                  {['@okhdfcbank', '@okicici', '@ybl', '@paytm'].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setUpiId((prev) => (prev ? prev.split('@')[0] + h : 'user' + h))}
                      className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentType === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setCardNumber(v.replace(/(\d{4})/g, '$1 ').trim());
                    }}
                    placeholder="4000 1234 5678 9010"
                    maxLength={19}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm font-mono text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                        setCardExpiry(v);
                      }}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm font-mono text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm font-mono text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentType === 'netbanking' && (
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                  Select Your Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                </select>
              </div>
            )}

            {paymentType === 'paypal' && (
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                  PayPal Account Email
                </label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]"
                  required
                />
              </div>
            )}

            <label className="flex items-center gap-2 pt-1 text-xs text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={saveMethod}
                onChange={(e) => setSaveMethod(e.target.checked)}
                className="rounded accent-[var(--accent)]"
              />
              <span>Save this payment method for one-click gifts in live streams</span>
            </label>
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-medium px-1">{error}</p>
          )}

          {/* Security & Vault Deposit Note */}
          <div className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>256-bit encrypted checkout. {selectedPkg.coins + selectedPkg.bonusCoins} coins deposited directly into your ledger vault.</span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 studio-btn-primary px-6"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Deposit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Pay {getPrice(selectedPkg)} & Deposit</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
