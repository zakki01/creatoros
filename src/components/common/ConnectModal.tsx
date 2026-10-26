import React, { useState } from 'react';
import { X, Send, Sparkles, Check, ShieldCheck } from 'lucide-react';
import { useAppState } from '../../context/StateContext';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    role: 'creator' | 'business' | 'super_admin';
    category?: string;
    badge?: string;
  } | null;
  onSuccess?: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  target,
  onSuccess,
}) => {
  const { connectWithEntity, role: myRole, userProfile } = useAppState();
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !target) return null;

  const quickPitches =
    myRole === 'business'
      ? [
          'Loved your recent lookbook! Would love to partner on our upcoming campaign.',
          'Checking your availability for a 4K product reel shoot this month.',
          'Great aesthetic! We are scouting creators for our exclusive summer roster.',
        ]
      : [
          'Hey team! Huge fan of the brand. Would love to pitch for your open briefs.',
          'Sent over my portfolio and verified engagement metrics for consideration.',
          'Excited about your upcoming product drop! Let’s explore a partnership.',
        ];

  const handleSend = () => {
    connectWithEntity(
      target.id,
      target.name,
      target.handle,
      target.avatar,
      target.role,
      note.trim() || undefined
    );
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setNote('');
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-2xl bg-white text-zinc-900 border border-black/[0.08] p-6 shadow-2xl text-zinc-900 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-500/30 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900">Connection Request Sent!</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              {target.name} has been notified and a direct messaging channel was initialized in your Inbox.
            </p>
          </div>
        ) : (
          <>
            {/* Header / Target Card */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-black/[0.06]">
              <img
                src={target.avatar}
                alt={target.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-zinc-900 truncate">{target.name}</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#007E93] shrink-0" />
                </div>
                <p className="text-xs text-zinc-500 font-mono truncate">{target.handle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00B4D8]/10 text-[#007E93] border border-[#00B4D8]/20">
                    {target.role === 'business' ? 'Brand / Business' : 'Verified Creator'}
                  </span>
                  {target.category && (
                    <span className="text-[10px] text-zinc-500 truncate">
                      • {target.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Note Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-zinc-700 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#007E93]" />
                  <span>Personalized Note (Optional)</span>
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  {note.length}/250
                </span>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 250))}
                rows={3}
                placeholder={`Introduce ${userProfile.name} or share brief campaign details...`}
                className="w-full rounded-xl bg-white shadow-sm border border-black/[0.08] p-3 text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/60 focus:ring-1 focus:ring-[#007E93]/25 resize-none transition-all"
              />
            </div>

            {/* Quick Pitch Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Quick Prompts
              </span>
              <div className="space-y-1">
                {quickPitches.map((pitch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNote(pitch)}
                    className="w-full text-left text-[11px] text-zinc-500 hover:text-zinc-800 bg-zinc-50 hover:bg-zinc-100/50 border border-black/[0.04] rounded-lg px-2.5 py-1.5 transition-all truncate"
                  >
                    "{pitch}"
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/40 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#007E93] hover:bg-[#006779] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Request</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
