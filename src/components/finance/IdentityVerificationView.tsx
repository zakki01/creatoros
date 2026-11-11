import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Upload,
  Lock,
  FileCheck,
  Clock,
  RefreshCw,
  AlertTriangle,
  Loader2,
  FileText,
} from 'lucide-react';
import { SpatialCard } from '../ui/SpatialCard';
import { Badge } from '../ui/Badge';
import {
  FinanceService,
  IdentityVerificationRecord,
  IdentityVerificationStatus,
} from '../../services/financeService';

interface IdentityVerificationViewProps {
  userId: string;
}

export const IdentityVerificationView: React.FC<IdentityVerificationViewProps> = ({ userId }) => {
  const [kycRecord, setKycRecord] = useState<IdentityVerificationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [idType, setIdType] = useState<'passport' | 'national_id' | 'driving_license' | 'aadhaar'>('passport');
  const [idNumber, setIdNumber] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    loadKyc();
  }, [userId]);

  const loadKyc = async () => {
    setIsLoading(true);
    try {
      const data = await FinanceService.getIdentityVerification(userId);
      setKycRecord(data);
    } catch {
      setError('Unable to load identity verification records.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!idNumber.trim() || idNumber.trim().length < 4) {
      setError('A valid identification document number is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await FinanceService.submitIdentityVerification(userId, {
        idType,
        idNumber: idNumber.trim(),
        documentPath: selectedFileName ? `kyc/${userId}/${selectedFileName}` : undefined,
      });

      if (result.success && result.record) {
        setKycRecord(result.record);
        setIdNumber('');
        setSelectedFileName(null);
        setSuccessMsg('Your identity documents have been submitted securely and are currently under review.');
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setError(result.error || 'Failed to submit identity verification.');
      }
    } catch {
      setError('An unexpected error occurred during document upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: IdentityVerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge variant="success" dot size="sm">Verified Account</Badge>;
      case 'IN_REVIEW':
      case 'PENDING':
        return <Badge variant="warning" dot size="sm">Under Review (24-48 hrs)</Badge>;
      case 'REJECTED':
      case 'REQUIRES_RESUBMISSION':
        return <Badge variant="danger" dot size="sm">Action Required</Badge>;
      case 'EXPIRED':
        return <Badge variant="neutral" dot size="sm">Expired</Badge>;
      default:
        return <Badge variant="neutral" dot size="sm">Not Started</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--text-secondary)]">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-[var(--brand-primary)]" />
        <span>Loading verification status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feedback Messages */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KYC Status Banner */}
      <SpatialCard surface={2} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                KYC Identity Verification
              </h2>
              {getStatusBadge(kycRecord?.status || 'NOT_STARTED')}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Required by international anti-money laundering (AML) and financial compliance laws before processing payouts.
            </p>
          </div>
        </div>
      </SpatialCard>

      {/* Active Verified State Display */}
      {kycRecord?.status === 'VERIFIED' && (
        <SpatialCard surface={1} className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Your Identity is Fully Verified
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                You are certified for unlimited escrow releases, PayPal, Stripe, and UPI payouts.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl surface-2 border border-[var(--border-subtle)] text-xs">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">Document Type</span>
                  <span className="font-semibold text-[var(--text-primary)] capitalize mt-0.5 block">
                    {kycRecord.idType.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">Document ID</span>
                  <span className="font-mono font-semibold text-[var(--text-primary)] mt-0.5 block">
                    {kycRecord.idNumberMasked || '••••••••'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">Verified At</span>
                  <span className="text-[var(--text-secondary)] mt-0.5 block">
                    {kycRecord.verifiedAt ? new Date(kycRecord.verifiedAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SpatialCard>
      )}

      {/* In Review State Display */}
      {kycRecord?.status === 'IN_REVIEW' && (
        <SpatialCard surface={1} className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Documents Under Review
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Our compliance team is verifying your submission. Verification typically takes between 12 to 24 hours. You will be notified once complete.
              </p>
              <div className="mt-4 p-4 rounded-xl surface-2 border border-[var(--border-subtle)] text-xs">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">Submitted Document</span>
                <span className="font-semibold text-[var(--text-primary)] capitalize mt-0.5 block">
                  {kycRecord.idType.replace('_', ' ')} ({kycRecord.idNumberMasked})
                </span>
                <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                  Submitted on {new Date(kycRecord.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </SpatialCard>
      )}

      {/* Submission Form (Shown when NOT_STARTED, REJECTED, REQUIRES_RESUBMISSION) */}
      {(!kycRecord || kycRecord.status === 'NOT_STARTED' || kycRecord.status === 'REJECTED' || kycRecord.status === 'REQUIRES_RESUBMISSION') && (
        <SpatialCard surface={1} className="p-6">
          {kycRecord?.status === 'REJECTED' && (
            <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Previous Submission Was Rejected:</strong> {kycRecord.rejectionReason || 'Document was unreadable or details did not match your legal profile.'}
                <p className="mt-1">Please submit a clearer, government-issued document below.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                Submit Government Identification
              </h3>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-bit AES Storage
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Document Type *
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-sm surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                >
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID Card</option>
                  <option value="driving_license">Driver's License</option>
                  <option value="aadhaar">Aadhaar Card (India)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Document / Registration Number *
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. Z1234567 or DL-12345678"
                  className="w-full px-3 py-2 rounded-xl text-sm font-mono surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                  required
                />
              </div>
            </div>

            {/* Document Upload Area */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                Upload Scanned Copy or High-Resolution Photo *
              </label>
              <div className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-primary)] rounded-2xl p-6 text-center transition-colors surface-2/50 relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFileName(file.name);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-[var(--surface-3)] flex items-center justify-center text-[var(--brand-primary)] mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  {selectedFileName ? (
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-primary)] flex items-center justify-center gap-1.5">
                        <FileCheck className="w-4 h-4" /> {selectedFileName}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Click to select a different file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Click or drag document to upload
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        PNG, JPG, or PDF up to 10 MB. Both sides required for cards.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Uploading & Encrypting...' : 'Submit Documents for Verification'}
              </button>
            </div>
          </form>
        </SpatialCard>
      )}
    </div>
  );
};
