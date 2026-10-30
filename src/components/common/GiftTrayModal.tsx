import React, { useState } from 'react';
import { Gift, Coins, Sparkles, X, Plus, Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { BuyCoinsModal } from './BuyCoinsModal';
import {
  VirtualGift,
  VIRTUAL_GIFTS_CATALOG,
  GiftLedgerService,
} from '../../services/giftLedgerService';

export interface GiftTrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  senderId?: string;
  senderName?: string;
  liveSessionId?: string;
  onGiftSent?: (gift: VirtualGift) => void;
}

export const GiftTrayModal: React.FC<GiftTrayModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  senderId = 'user_current',
  senderName = 'Community Member',
  liveSessionId,
  onGiftSent,
}) => {
  const [balance, setBalance] = useState<number>(() =>
    GiftLedgerService.getUserCoinBalance(senderId)
  );
  const [selectedGift, setSelectedGift] = useState<VirtualGift>(
    VIRTUAL_GIFTS_CATALOG[0]
  );
  const [isSending, setIsSending] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleSendGift = async () => {
    if (balance < selectedGift.coinCost) {
      setIsBuyModalOpen(true);
      return;
    }

    setIsSending(true);
    try {
      await GiftLedgerService.sendGift({
        senderId,
        senderName,
        recipientId,
        recipientName,
        giftId: selectedGift.id,
        liveSessionId,
      });
      const newBal = GiftLedgerService.getUserCoinBalance(senderId);
      setBalance(newBal);
      if (onGiftSent) onGiftSent(selectedGift);
      onClose();
    } catch {
      setIsBuyModalOpen(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 text-[var(--text-primary)]">
        <div className="studio-card-soft rounded-3xl w-full max-w-md p-6 bg-[var(--surface)] border border-[var(--border)] shadow-2xl relative select-none">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Balance Bar */}
          <div className="flex items-center justify-between mb-5 pr-8">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Send Creator Gift</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>{balance}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBuyModalOpen(true)}
                className="p-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors cursor-pointer"
                title="Buy Coins"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] mb-4">
            Rewarding <span className="font-semibold text-[var(--text-primary)]">{recipientName}</span> directly.
            Creator receives 70% revenue share.
          </p>

          {/* Catalog Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5 max-h-[280px] overflow-y-auto p-1">
            {VIRTUAL_GIFTS_CATALOG.map((g: VirtualGift) => {
              const isSelected = selectedGift.id === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGift(g)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-xs ring-2 ring-[var(--accent)]/30 scale-102'
                      : 'border-[var(--border)] hover:border-[var(--accent)]/40 bg-[var(--surface-muted)]'
                  }`}
                >
                  <span className="text-3xl mb-1.5 filter drop-shadow-xs">{g.icon}</span>
                  <span className="text-xs font-semibold text-[var(--text-primary)] text-center leading-tight line-clamp-1">
                    {g.name}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mt-1">
                    <Coins className="w-3 h-3" />
                    <span>{g.coinCost}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <div className="text-xs text-[var(--text-muted)]">
              Cost:{' '}
              <span className="font-bold text-[var(--text-primary)]">
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
                className="flex items-center gap-1.5 cursor-pointer"
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
