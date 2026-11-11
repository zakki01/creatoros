import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  Building,
  Info,
  Loader2,
} from 'lucide-react';
import { SpatialCard } from '../ui/SpatialCard';
import { Badge } from '../ui/Badge';
import {
  FinanceService,
  UserTaxProfile,
  AccountClassification,
} from '../../services/financeService';

interface TaxInformationViewProps {
  userId: string;
}

export const TaxInformationView: React.FC<TaxInformationViewProps> = ({ userId }) => {
  const [taxProfile, setTaxProfile] = useState<UserTaxProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [country, setCountry] = useState('IN');
  const [taxIdType, setTaxIdType] = useState<'pan' | 'ein' | 'ssn' | 'vat' | 'other'>('pan');
  const [taxId, setTaxId] = useState('');
  const [gstin, setGstin] = useState('');
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [taxResidency, setTaxResidency] = useState('India');
  const [classification, setClassification] = useState<AccountClassification | 'sole_proprietorship'>('individual');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Unmask toggle
  const [showTaxId, setShowTaxId] = useState(false);

  useEffect(() => {
    loadTaxProfile();
  }, [userId]);

  const loadTaxProfile = async () => {
    setIsLoading(true);
    try {
      const data = await FinanceService.getTaxProfile(userId);
      if (data) {
        setTaxProfile(data);
        setCountry(data.country || 'IN');
        setTaxIdType(data.taxIdType || 'pan');
        setTaxId(data.taxIdMasked || '');
        setGstin(data.gstin || '');
        setLegalBusinessName(data.legalBusinessName || '');
        setTaxResidency(data.taxResidency || 'India');
        setClassification(data.classification || 'individual');
        setAddressLine1(data.billingAddress?.addressLine1 || '');
        setCity(data.billingAddress?.city || '');
        setStateVal(data.billingAddress?.state || '');
        setPostalCode(data.billingAddress?.postalCode || '');
      } else {
        // Default to editing if no tax record exists yet
        setIsEditing(true);
      }
    } catch {
      setError('Unable to load tax profile. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (taxProfile) {
      setCountry(taxProfile.country || 'IN');
      setTaxIdType(taxProfile.taxIdType || 'pan');
      setTaxId(taxProfile.taxIdMasked || '');
      setGstin(taxProfile.gstin || '');
      setLegalBusinessName(taxProfile.legalBusinessName || '');
      setTaxResidency(taxProfile.taxResidency || 'India');
      setClassification(taxProfile.classification || 'individual');
      setAddressLine1(taxProfile.billingAddress?.addressLine1 || '');
      setCity(taxProfile.billingAddress?.city || '');
      setStateVal(taxProfile.billingAddress?.state || '');
      setPostalCode(taxProfile.billingAddress?.postalCode || '');
      setIsEditing(false);
    }
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (!legalBusinessName.trim()) {
      setError('Legal name as printed on tax records is required.');
      return;
    }

    if (country === 'IN' && taxIdType === 'pan') {
      // If user hasn't modified an already masked PAN, preserve it
      if (taxId.includes('*')) {
        if (!taxProfile) {
          setError('Please enter a valid 10-character PAN (e.g. ABCDE1234F).');
          return;
        }
      } else {
        if (!FinanceService.validatePAN(taxId)) {
          setError('Invalid Indian PAN format. Must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).');
          return;
        }
      }

      if (gstin.trim() && !FinanceService.validateGSTIN(gstin)) {
        setError('Invalid GSTIN format. Must be 15 alphanumeric characters matching Indian GST rules.');
        return;
      }
    } else {
      if (!taxId.trim()) {
        setError('Tax identification number is required.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const result = await FinanceService.saveTaxProfile(userId, {
        country,
        taxIdType,
        taxId: taxId.includes('*') && taxProfile ? taxProfile.taxIdMasked : taxId,
        gstin: gstin.trim() || undefined,
        legalBusinessName: legalBusinessName.trim(),
        taxResidency: taxResidency.trim(),
        classification,
        billingAddress: {
          addressLine1: addressLine1.trim(),
          city: city.trim(),
          state: stateVal.trim(),
          postalCode: postalCode.trim(),
          country,
        },
      });

      if (result.success && result.profile) {
        setTaxProfile(result.profile);
        setIsEditing(false);
        setSuccessMsg('Tax information verified and saved securely.');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(result.error || 'Failed to save tax information.');
      }
    } catch {
      setError('An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--text-secondary)]">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-[var(--brand-primary)]" />
        <span>Loading tax records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
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

      {/* Overview & Status Banner */}
      <SpatialCard surface={2} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Tax Information & W-8 / 206AA Compliance
              </h2>
              <Badge
                variant={taxProfile ? 'success' : 'warning'}
                size="sm"
                dot
              >
                {taxProfile ? 'Tax Profile Active' : 'Action Required'}
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Encrypted at rest. Tax details are used solely for withholding compliance, TDS certificates, and reporting.
            </p>
          </div>
        </div>

        {!isEditing && taxProfile && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Tax Info
          </button>
        )}
      </SpatialCard>

      {/* Tax Form */}
      <SpatialCard surface={1} className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono">
              Tax Residency & Classification
            </h3>
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Lock className="w-3 h-3" /> PCI-DSS & SOC2 Safe
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Country of Tax Residency
              </label>
              <select
                disabled={!isEditing}
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  if (e.target.value === 'IN') {
                    setTaxIdType('pan');
                    setTaxResidency('India');
                  } else if (e.target.value === 'US') {
                    setTaxIdType('ssn');
                    setTaxResidency('United States');
                  } else {
                    setTaxIdType('other');
                    setTaxResidency(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl text-sm surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] disabled:opacity-70"
              >
                <option value="IN">India (IN)</option>
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
                <option value="AU">Australia (AU)</option>
                <option value="SG">Singapore (SG)</option>
                <option value="AE">United Arab Emirates (AE)</option>
                <option value="OTHER">Other / Global</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Tax Entity Classification
              </label>
              <select
                disabled={!isEditing}
                value={classification}
                onChange={(e) => setClassification(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-sm surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] disabled:opacity-70"
              >
                <option value="individual">Individual / Sole Proprietor</option>
                <option value="business">Registered Business / Company / LLP</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Legal Name (Must match government tax records) *
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={legalBusinessName}
                onChange={(e) => setLegalBusinessName(e.target.value)}
                placeholder="e.g. Rahul Sharma or TechSparks Media LLP"
                className="w-full px-3 py-2 rounded-xl text-sm surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] disabled:opacity-70"
                required
              />
            </div>
          </div>

          {/* Tax Identification (PAN / GSTIN / SSN) */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono mb-4">
              Tax Identifiers & Compliance
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 flex items-center justify-between">
                  <span>
                    {country === 'IN' ? 'PAN (Permanent Account Number) *' : 'Tax ID Number (TIN / SSN / EIN) *'}
                  </span>
                  {!isEditing && taxProfile && (
                    <button
                      type="button"
                      onClick={() => setShowTaxId(!showTaxId)}
                      className="text-[11px] text-[var(--brand-primary)] hover:underline flex items-center gap-1"
                    >
                      {showTaxId ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showTaxId ? 'Mask' : 'Reveal'}
                    </button>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={isEditing ? 'text' : showTaxId ? 'text' : 'password'}
                    disabled={!isEditing}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value.toUpperCase())}
                    placeholder={country === 'IN' ? 'e.g. ABCDE1234F' : 'Tax ID Number'}
                    maxLength={country === 'IN' ? 10 : 30}
                    className="w-full px-3 py-2 rounded-xl text-sm font-mono surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] uppercase disabled:opacity-70"
                    required
                  />
                </div>
                {country === 'IN' && (
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Standard 10-character Indian alphanumeric identifier.
                  </p>
                )}
              </div>

              {country === 'IN' && (
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    GSTIN (Optional — only if registered under GST)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 27ABCDE1234F1Z5 (15 digits)"
                    maxLength={15}
                    className="w-full px-3 py-2 rounded-xl text-sm font-mono surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] uppercase disabled:opacity-70"
                  />
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Leave blank if your annual turnover is below the GST registration threshold.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Billing Address for Tax Invoicing */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono mb-4">
              Registered Tax Address
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street address, unit, building"
                  className="w-full px-3 py-2 rounded-xl text-sm surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] disabled:opacity-70"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  City
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3 py-2 rounded-xl text-sm surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] disabled:opacity-70"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  placeholder="State"
                  className="w-full px-3 py-2 rounded-xl text-sm surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] disabled:opacity-70"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Postal / PIN Code
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal Code"
                  className="w-full px-3 py-2 rounded-xl text-sm surface-2 border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] disabled:opacity-70"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
              {taxProfile && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-3)] transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? 'Verifying & Saving...' : 'Save Tax Information'}
              </button>
            </div>
          )}
        </form>
      </SpatialCard>

      {/* Advisory Note */}
      <div className="p-4 rounded-xl surface-2 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex items-start gap-3">
        <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Tax Compliance Notice:</strong> CreatorOS complies with applicable tax withholding laws (such as Section 194J / 194O of the Indian Income Tax Act where applicable). Providing your PAN ensures appropriate TDS deduction rates (e.g. 1% or 2% vs 20% default withholding without PAN). This information is never shared with third parties except statutory authorities upon lawful request.
        </p>
      </div>
    </div>
  );
};
