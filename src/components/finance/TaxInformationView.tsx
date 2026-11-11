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
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-[var(--primary)]" />
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
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs active:scale-95"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Tax Info
          </button>
        )}
      </SpatialCard>

      {/* Tax Form */}
      <SpatialCard surface={1} className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Tax Residency & Classification
            </h3>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> PCI-DSS & SOC2 Safe
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
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
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
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
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Tax Entity Classification
              </label>
              <select
                disabled={!isEditing}
                value={classification}
                onChange={(e) => setClassification(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <option value="individual">Individual / Sole Proprietor</option>
                <option value="business">Registered Business / Company / LLP</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Legal Name (Must match government tax records) <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={legalBusinessName}
                onChange={(e) => setLegalBusinessName(e.target.value)}
                placeholder="e.g. Rahul Sharma or TechSparks Media LLP"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Tax Identification (PAN / GSTIN / SSN) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Tax Identifiers & Compliance
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>
                    {country === 'IN' ? 'PAN (Permanent Account Number) *' : 'Tax ID Number (TIN / SSN / EIN) *'}
                  </span>
                  {!isEditing && taxProfile && (
                    <button
                      type="button"
                      onClick={() => setShowTaxId(!showTaxId)}
                      className="text-[11px] font-semibold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 uppercase transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                {country === 'IN' && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Standard 10-character Indian alphanumeric identifier.
                  </p>
                )}
              </div>

              {country === 'IN' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    GSTIN (Optional — only if registered under GST)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 27ABCDE1234F1Z5 (15 digits)"
                    maxLength={15}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 uppercase transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Leave blank if your annual turnover is below the GST registration threshold.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Billing Address for Tax Invoicing */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Registered Tax Address
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street address, unit, building"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  State / Province
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  placeholder="State"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Postal / PIN Code
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal Code"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              {taxProfile && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 dark:font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin text-white dark:text-slate-950" />}
                {isSaving ? 'Verifying & Saving...' : 'Save Tax Information'}
              </button>
            </div>
          )}
        </form>
      </SpatialCard>

      {/* Advisory Note */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-900 dark:text-slate-100">Tax Compliance Notice:</strong> CreatorOS complies with applicable tax withholding laws (such as Section 194J / 194O of the Indian Income Tax Act where applicable). Providing your PAN ensures appropriate TDS deduction rates (e.g. 1% or 2% vs 20% default withholding without PAN). This information is never shared with third parties except statutory authorities upon lawful request.
        </p>
      </div>
    </div>
  );
};
