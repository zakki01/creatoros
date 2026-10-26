import React, { useState } from 'react';
import { Gift, Coins, Plus, X, Send, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  VIRTUAL_GIFTS_CATALOG,
  VirtualGift,
  GiftLedgerService,
} from '../../services/giftLedgerService';
import { BuyCoinsModal } from './BuyCoinsModal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface GiftTrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  liveSessionId?: string;
  onGiftSent?: (gift: VirtualGift) => void;
}

export const GiftTrayModal: React.FC<GiftTrayModalProps> = ({
  isOpen,
  onClose,
  senderId,
  senderName,
  recipientId,
  recipientName,
  liveSessionId,
  onGiftSent,
}) => {
  const toast = useToast();
  const [selectedGift, setSelectedGift] = useState<VirtualGift>(VIRTUAL_GIFTS_CATALOG[0]);
  const [balance, setBalance] = useState<number>(() =>
    GiftLedgerService.getUserCoinBalance(senderId)
  );
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSendGift = async () => {
    if (balance < selectedGift.coinCost) {
      setIsBuyModalOpen(true);
      return;
    }

    setIsSending(true);
    try {
      const res = await GiftLedgerService.sendGift({
        senderId,
        senderName,
        recipientId,
        recipientName,
        giftId: selectedGift.id,
        liveSessionId,
      });

      setBalance(res.remainingBalance);

      // Trigger celebratory particle explosion
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00869B', '#F59E0B', '#10B981', '#EC4899'],
      });

      toast.success(`Sent ${selectedGift.name} to ${recipientName}!`);
      onGiftSent?.(selectedGift);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send gift.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="studio-card-soft rounded-3xl w-full max-w-md p-6 bg-white border border-zinc-200 shadow-2xl relative select-none">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Balance Bar */}
          <div className="flex items-center justify-between mb-5 pr-8">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#00869B]" />
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Send Creator Gift</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 font-bold text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>{balance}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBuyModalOpen(true)}
                className="p-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#00869B] hover:bg-cyan-100 transition-colors"
                title="Buy Coins"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-zinc-500 mb-4">
            Rewarding <span className="font-semibold text-zinc-800">{recipientName}</span> directly.
            Creator receives 70% revenue share.
          </p>

          {/* Catalog Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5 max-h-[280px] overflow-y-auto p-1">
            {VIRTUAL_GIFTS_CATALOG.map((g) => {
              const isSelected = selectedGift.id === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGift(g)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#00869B] bg-cyan-50/60 shadow-md ring-2 ring-[#00869B]/20 scale-102'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <span className="text-3xl mb-1.5 filter drop-shadow-sm">{g.icon}</span>
                  <span className="text-xs font-semibold text-zinc-800 text-center leading-tight line-clamp-1">
                    {g.name}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1">
                    <Coins className="w-3 h-3" />
                    <span>{g.coinCost}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
            <div className="text-xs text-zinc-500">
              Cost:{' '}
              <span className="font-bold text-zinc-800">
                {selectedGift.coinCost} Coins (${(selectedGift.coinCost * 0.01).toFixed(2)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendGift}
                disabled={isSending}
                className="studio-btn-primary flex items-center gap-1.5"
              >
                {isSending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Send {selectedGift.icon}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BuyCoinsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        userId={senderId}
        onCoinsPurchased={(newBal) => setBalance(newBal)}
      />
    </>
  );
};
