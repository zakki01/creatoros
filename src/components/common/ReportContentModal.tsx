import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Check, Send } from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { ReportReason } from '../../types/socialFeed';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    id: string;
    type: 'post' | 'reel' | 'shot' | 'blog' | 'comment' | 'creator' | 'brand';
    title?: string;
    ownerId: string;
    ownerName: string;
  } | null;
}

const REPORT_REASONS: { reason: ReportReason; description: string }[] = [
  { reason: 'Spam', description: 'Repetitive advertising, bot traffic, or commercial link dumping' },
  { reason: 'Harassment', description: 'Bullying, targeted intimidation, or abusive commentary' },
  { reason: 'Inappropriate Content', description: 'Violates platform safety guidelines or commercial policy' },
  { reason: 'Copyright', description: 'Infringing footage, audio tracks, or intellectual property' },
  { reason: 'Fake Account', description: 'Impersonating another creator, agency, or brand' },
  { reason: 'Scam', description: 'Fraudulent payment terms, off-platform escrow evasion' },
  { reason: 'Other', description: 'Other community guideline or terms violations' },
];

export const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  onClose,
  target,
}) => {
  const { submitReport, userProfile } = useAppState();
  const [selectedReason, setSelectedReason] = useState<ReportReason>('Inappropriate Content');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !target) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      targetId: target.id,
      targetType: target.type,
      targetTitle: target.title || `Content by ${target.ownerName}`,
      targetOwnerId: target.ownerId,
      targetOwnerName: target.ownerName,
      reporterId: userProfile.id || 'usr-reporter',
      reporterName: userProfile.name || 'Anonymous User',
      reason: selectedReason,
      details: details.trim() || undefined,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDetails('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#0c0c11] border border-white/[0.08] p-6 shadow-2xl text-zinc-100 space-y-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Report Submitted</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Thank you for keeping CreatorOS safe. Our Super Admin Trust & Safety moderation desk has queued this item for investigation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">Report Content</h3>
                <p className="text-[11px] text-zinc-400">
                  Target: <strong className="text-zinc-200">{target.ownerName}</strong> ({target.type})
                </p>
              </div>
            </div>

            {/* Reasons List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block font-semibold">
                Reason for Report
              </label>
              {REPORT_REASONS.map((item) => (
                <label
                  key={item.reason}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedReason === item.reason
                      ? 'bg-rose-500/10 border-rose-500/40 text-white'
                      : 'bg-zinc-900/40 border-white/[0.04] text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={item.reason}
                    checked={selectedReason === item.reason}
                    onChange={() => setSelectedReason(item.reason)}
                    className="mt-0.5 text-rose-500 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-semibold block">{item.reason}</span>
                    <span className="text-[10px] text-zinc-500 block leading-tight">
                      {item.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Additional details */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400 block">
                Additional Context (Optional)
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Include relevant timestamps, handles, or context..."
                className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-rose-600/30 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
