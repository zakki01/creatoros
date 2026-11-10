import React, { useState } from 'react';
import { X, Sparkles, Mail, User, AtSign, Building2, UserCheck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { betaAccessService, WaitlistEntry } from '../../../services/betaAccessService';

interface RequestBetaAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseCode?: (code: string) => void;
  defaultRole?: 'creator' | 'business';
}

export const RequestBetaAccessModal: React.FC<RequestBetaAccessModalProps> = ({
  isOpen,
  onClose,
  onUseCode,
  defaultRole = 'creator',
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'creator' | 'business'>(defaultRole);
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState('Fashion & Streetwear');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEntry, setSubmittedEntry] = useState<WaitlistEntry | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !handle) {
      setError('Please fill in your name, email, and social handle.');
      return;
    }

    setIsSubmitting(true);
    try {
      const entry = betaAccessService.submitWaitlist({
        fullName,
        email,
        role,
        handle,
        category,
      });
      setSubmittedEntry(entry);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden text-zinc-900 animate-scale-in">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-6 text-white text-left relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Private Beta Admission</span>
          </div>
          <h2 className="text-lg font-bold">Apply for CreatorOS Access</h2>
          <p className="text-xs text-zinc-300 mt-1">
            We review creator and brand applications in curated cohorts to guarantee verified partnership escrow.
          </p>
        </div>

        <div className="p-6">
          {submittedEntry ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">Application Received</h3>
                <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto">
                  You are registered on the private beta waitlist as{' '}
                  <span className="font-semibold text-zinc-900">{submittedEntry.email}</span>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-left space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium text-[11px]">
                    Pending Verification
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Target Role</span>
                  <span className="text-zinc-800 font-semibold capitalize">{submittedEntry.role}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Handle</span>
                  <span className="text-zinc-800 font-mono text-[11px]">{submittedEntry.handle}</span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500">
                Check your inbox for personal invite code delivery during our weekly onboarding release.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {error}
                </div>
              )}

              {/* Role Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">I am joining as</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setRole('creator')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      role === 'creator' ? 'bg-white shadow-sm text-zinc-900 font-semibold' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Creator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('business')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      role === 'business' ? 'bg-white shadow-sm text-zinc-900 font-semibold' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Brand / Agency</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Handle & Category */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Social Handle / Link</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="@alexcreates"
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-zinc-200 text-xs font-mono focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                    />
                    <AtSign className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Niche</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-white"
                  >
                    <option value="Fashion & Streetwear">Fashion & Streetwear</option>
                    <option value="Tech & Design">Tech & Design</option>
                    <option value="Fitness & Health">Fitness & Health</option>
                    <option value="Beauty & Lifestyle">Beauty & Lifestyle</option>
                    <option value="Gaming & Esports">Gaming & Esports</option>
                    <option value="Audio & Music">Audio & Music</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer active:scale-[0.99] transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Beta Application</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onUseCode?.('ALPHA-2026');
                  }}
                  className="text-[11px] text-zinc-500 hover:text-zinc-800 underline cursor-pointer"
                >
                  Have a VIP Code? Enter Code Instead
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
