import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  Lock,
  Calendar,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { ageVerification, verifyAge } = useAppState();

  const [dob, setDob] = useState('2000-05-15');
  const [docNumber, setDocNumber] = useState('ID-492049-CR');
  const [docType, setDocType] = useState('Passport / National ID');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyAge(dob, docNumber);
    setSubmissionFeedback(result.message);
    if (result.success) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl p-6 md:p-8 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight font-mono">
              18+ Age & Child Safety Verification
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              CreatorOS enforces strict 18+ creator onboarding and automated child safety protections.
            </p>
          </div>
        </div>

        {/* Current Status Box */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block">
              Passport Status
            </span>
            <span className="font-semibold text-zinc-800 mt-0.5 block">
              {ageVerification.ageVerified ? '18+ Verified Adult' : 'Verification Required'}
            </span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              ageVerification.ageVerified
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/20'
                : 'bg-amber-50 text-amber-800 border border-amber-500/20'
            }`}
          >
            {ageVerification.ageVerified ? (
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </span>
            ) : (
              'Pending Verification'
            )}
          </span>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Date of Birth (Must be 18+ to accept commercial brand campaigns)</span>
            </label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-secondary)]">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] cursor-pointer"
              >
                <option value="Passport">Passport</option>
                <option value="National ID">National Identity Card</option>
                <option value="Driver License">Driver's License</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-secondary)]">Document Number / Hash</label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          {/* Child Safety & Automated Moderation Note */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-[11px] text-[var(--text-muted)] space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
              <Lock className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Automated Deliverable Moderation Scan</span>
            </div>
            <p className="leading-relaxed">
              Every deliverable submitted to CreatorOS undergoes an automated media safety pipeline:
              detecting minor presence, age-risk signals, and prohibited content. Submissions that do not comply are blocked from commercial publishing.
            </p>
          </div>

          {submissionFeedback && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-500/20 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{submissionFeedback}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-900"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
            >
              Submit 18+ Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
