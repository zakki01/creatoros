import React, { useState } from 'react';
import { Coins, Check, Sparkles, X, ShieldCheck, Loader2 } from 'lucide-react';
import { COIN_PACKAGES, CoinPackage, GiftLedgerService } from '../../services/giftLedgerService';
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
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      // Simulate verified server-side Stripe checkout
      await new Promise((r) => setTimeout(r, 800));
      const mockTxId = `pi_coins_${Date.now()}`;
      const entry = await GiftLedgerService.purchaseCoins(userId, selectedPkg.id, mockTxId);

      toast.success(
        `Added ${selectedPkg.coins + selectedPkg.bonusCoins} CreatorOS Coins to your vault!`
      );
      onCoinsPurchased?.(entry.balanceAfter);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Payment failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="studio-card-soft rounded-3xl w-full max-w-lg p-6 sm:p-8 bg-white border border-zinc-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-sm">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Buy CreatorOS Coins</h3>
            <p className="text-xs text-zinc-500">
              Support your favorite creators during live streams and direct drops.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {COIN_PACKAGES.map((pkg) => {
            const isSelected = selectedPkg.id === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPkg(pkg)}
                className={`relative p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#00869B] bg-cyan-50/50 shadow-md ring-2 ring-[#00869B]/20'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00869B] text-white uppercase tracking-wider shadow-sm">
                    Popular
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-lg mb-1">
                  <Coins className="w-5 h-5" />
                  <span>{pkg.coins}</span>
                  {pkg.bonusCoins > 0 && (
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold">
                      +{pkg.bonusCoins} bonus
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-zinc-900">${pkg.priceUsd.toFixed(2)}</div>
                <div className="text-[11px] text-zinc-500">{pkg.name}</div>
              </button>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 mb-6 flex items-center gap-2 text-xs text-zinc-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Encrypted 256-bit Stripe checkout. Coins instantly deposited into ledger.</span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePurchase}
            disabled={isProcessing}
            className="flex items-center gap-2 studio-btn-primary px-6"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Vault Deposit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Pay ${selectedPkg.priceUsd.toFixed(2)}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
