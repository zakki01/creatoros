import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Lock,
} from 'lucide-react';
import {
  CreatorPayoutProfile,
  UserPaymentMethod,
  FinanceService,
  PayoutProviderType,
} from '../../services/financeService';
import { Badge } from '../ui/Badge';

interface PayoutSettingsProps {
  userId: string;
  payoutProfile?: CreatorPayoutProfile | null;
  paymentMethods?: UserPaymentMethod[];
  onRefresh?: () => void;
}

export const PayoutSettings: React.FC<PayoutSettingsProps> = ({
  userId,
  payoutProfile: initialProfile,
  paymentMethods: initialMethods,
  onRefresh,
}) => {
  const [profile, setProfile] = useState<CreatorPayoutProfile | null>(initialProfile || null);
  const [methods, setMethods] = useState<UserPaymentMethod[]>(initialMethods || []);
  const [isSelfLoading, setIsSelfLoading] = useState(!initialProfile && !initialMethods);

  React.useEffect(() => {
    if (initialProfile !== undefined) setProfile(initialProfile);
  }, [initialProfile]);

  React.useEffect(() => {
    if (initialMethods !== undefined) setMethods(initialMethods);
  }, [initialMethods]);

  React.useEffect(() => {
    if (!initialProfile || !initialMethods) {
      loadSelfData();
    }
  }, [userId]);

  const loadSelfData = async () => {
    try {
      const [prof, meths] = await Promise.all([
        FinanceService.getPayoutProfile(userId),
        FinanceService.getPaymentMethods(userId),
      ]);
      setProfile(prof);
      setMethods(meths);
      if (prof) {
        setLegalName(prof.legalName || '');
        setDisplayName(prof.displayName || '');
        setCountry(prof.country || 'IN');
        setAccountType(prof.accountType || 'individual');
        setBusinessName(prof.businessName || '');
        setAddressLine1(prof.addressLine1 || '');
        setCity(prof.city || '');
        setState(prof.state || '');
        setPostalCode(prof.postalCode || '');
        setPhone(prof.phone || '');
        setEmail(prof.email || '');
      }
    } catch {} finally {
      setIsSelfLoading(false);
    }
  };

  const handleDataRefresh = () => {
    loadSelfData();
    if (onRefresh) onRefresh();
  };

  // 1. Legal Personal Information Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [legalName, setLegalName] = useState(initialProfile?.legalName || '');
  const [displayName, setDisplayName] = useState(initialProfile?.displayName || '');
  const [country, setCountry] = useState(initialProfile?.country || 'IN');
  const [accountType, setAccountType] = useState<'individual' | 'business'>(
    initialProfile?.accountType || 'individual'
  );
  const [businessName, setBusinessName] = useState(initialProfile?.businessName || '');
  const [addressLine1, setAddressLine1] = useState(initialProfile?.addressLine1 || '');
  const [city, setCity] = useState(initialProfile?.city || '');
  const [state, setState] = useState(initialProfile?.state || '');
  const [postalCode, setPostalCode] = useState(initialProfile?.postalCode || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [email, setEmail] = useState(initialProfile?.email || '');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 2. Add New Method State
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<PayoutProviderType>('upi');
  const [methodIdentifier, setMethodIdentifier] = useState('');
  const [isSavingMethod, setIsSavingMethod] = useState(false);
  const [methodFeedback, setMethodFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Delete Confirmation State
  const [methodToDelete, setMethodToDelete] = useState<UserPaymentMethod | null>(null);

  // Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFeedback(null);
    setIsSavingProfile(true);

    try {
      const res = await FinanceService.savePayoutProfile(userId, {
        legalName,
        displayName,
        country,
        accountType,
        businessName,
        addressLine1,
        city,
        state,
        postalCode,
        phone,
        email,
      });

      if (res.success) {
        setProfileFeedback({ type: 'success', message: 'Legal payout identity saved successfully.' });
        setIsEditingProfile(false);
        handleDataRefresh();
        setTimeout(() => setProfileFeedback(null), 4000);
      } else {
        setProfileFeedback({ type: 'error', message: res.error || 'Failed to save profile.' });
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Add Method Handler
  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setMethodFeedback(null);
    setIsSavingMethod(true);

    try {
      const res = await FinanceService.addPaymentMethod(userId, {
        providerType: selectedProvider,
        identifier: methodIdentifier,
        isPreferred: methods.length === 0,
      });

      if (res.success) {
        setMethodFeedback({ type: 'success', message: 'Payout method added successfully.' });
        setIsAddingMethod(false);
        setMethodIdentifier('');
        handleDataRefresh();
        setTimeout(() => setMethodFeedback(null), 4000);
      } else {
        setMethodFeedback({ type: 'error', message: res.error || 'Failed to add method.' });
      }
    } finally {
      setIsSavingMethod(false);
    }
  };

  // Set Preferred Method
  const handleSetPreferred = async (methodId: string) => {
    await FinanceService.setPreferredPaymentMethod(userId, methodId);
    handleDataRefresh();
  };

  // Confirm Delete Method
  const handleConfirmDelete = async () => {
    if (!methodToDelete) return;
    const res = await FinanceService.deletePaymentMethod(userId, methodToDelete.id);
    if (res.success) {
      setMethodToDelete(null);
      handleDataRefresh();
    } else {
      setMethodFeedback({ type: 'error', message: res.error || 'Failed to remove payout method.' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans text-[var(--text-primary)]">
      {/* ------------------------------------------------------------- */}
      {/* 1. LEGAL PERSONAL & BUSINESS IDENTITY                          */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Legal Payout Identity</h3>
              <Badge variant="neutral" size="sm">
                Private & Encrypted
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Legal name, address, and residency for tax compliance. Kept strictly separate from your public creator handle.
            </p>
          </div>

          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer transition-all self-start sm:self-auto shadow-xs active:scale-95"
            >
              Edit Identity
            </button>
          )}
        </div>

        {profileFeedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              profileFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            }`}
          >
            {profileFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{profileFeedback.message}</span>
          </div>
        )}

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="As shown on government ID"
                  className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Account Classification *
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as any)}
                  className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all cursor-pointer"
                >
                  <option value="individual">Individual / Sole Creator</option>
                  <option value="business">Registered Business / Agency</option>
                </select>
              </div>

              {accountType === 'business' && (
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Registered Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Legal corporate entity name"
                    className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Official Financial Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="billing@example.com"
                  className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Residential / Business Address
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street address line 1"
                  className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  State & Postal Code
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all"
                  />
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400001"
                    className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 dark:font-bold text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
              >
                {isSavingProfile ? 'Saving...' : 'Save Legal Identity'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Legal Name</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 block mt-0.5">
                {profile?.legalName || 'Not configured'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Account Type</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize block mt-0.5">
                {profile?.accountType || 'Individual'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Financial Email</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 block mt-0.5 truncate">
                {profile?.email || 'Not configured'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Country / Tax Base</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 block mt-0.5">
                {profile?.country === 'IN' ? 'India (IN)' : profile?.country || 'India (IN)'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SUPPORTED PAYOUT METHODS (PayPal, Stripe Connect, UPI)     */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Supported Payout Rails</h3>
              <Badge variant="success" size="sm">
                No Direct Bank Collection
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Securely connect PayPal, Stripe Connect onboarding, or UPI for direct milestone disbursements.
            </p>
          </div>

          {!isAddingMethod && (
            <button
              onClick={() => setIsAddingMethod(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 dark:font-bold text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-white dark:text-slate-950" />
              <span>Add Payout Method</span>
            </button>
          )}
        </div>

        {methodFeedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              methodFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            }`}
          >
            {methodFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{methodFeedback.message}</span>
          </div>
        )}

        {/* Add Method Drawer/Form */}
        {isAddingMethod && (
          <form
            onSubmit={handleAddMethod}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Configure New Payout Rail
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'upi', label: 'UPI (India Instant)', desc: 'VPA: user@okhdfcbank' },
                { id: 'paypal', label: 'PayPal (Global)', desc: 'Email address' },
                { id: 'stripe', label: 'Stripe Connect', desc: 'Host-managed onboarding' },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => {
                    setSelectedProvider(p.id as any);
                    setMethodIdentifier('');
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedProvider === p.id
                      ? 'border-blue-600 dark:border-sky-400 bg-blue-50/70 dark:bg-sky-950/40 shadow-xs'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">{p.label}</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                {selectedProvider === 'paypal'
                  ? 'PayPal Account Email Address *'
                  : selectedProvider === 'upi'
                  ? 'UPI ID / Virtual Payment Address (VPA) *'
                  : 'Stripe Account Email / Onboarding Tag *'}
              </label>
              <input
                type={selectedProvider === 'paypal' ? 'email' : 'text'}
                required
                value={methodIdentifier}
                onChange={(e) => setMethodIdentifier(e.target.value)}
                placeholder={
                  selectedProvider === 'paypal'
                    ? 'creator.payouts@paypal.me'
                    : selectedProvider === 'upi'
                    ? 'creator@okaxis'
                    : 'creator@stripe.com'
                }
                className="w-full min-h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-sky-500 transition-all"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                {selectedProvider === 'upi'
                  ? 'Must match standard UPI VPA format (e.g. handle@bank). Disbursements use the controlled manual verification queue.'
                  : selectedProvider === 'paypal'
                  ? 'Earnings will be automatically routed via PayPal Payouts.'
                  : 'Requires Stripe Connect Custom/Express verification before live payouts.'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingMethod(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingMethod}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
              >
                {isSavingMethod ? 'Validating...' : 'Save & Link Rail'}
              </button>
            </div>
          </form>
        )}

        {/* Existing Payout Methods List */}
        <div className="space-y-3">
          {methods.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <CreditCard className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 block text-sm">No Active Payout Methods</span>
              <span className="text-slate-600 dark:text-slate-400">Add a verified PayPal, Stripe Connect, or UPI account to enable instant payout requests.</span>
            </div>
          ) : (
            methods.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs uppercase text-blue-600 dark:text-sky-400">
                    {m.providerType.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {m.providerType === 'upi' ? 'UPI Virtual Payment Address' : m.providerType.toUpperCase()}
                      </span>
                      {m.isPreferred && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 font-mono">
                          PREFERRED
                        </span>
                      )}
                      <Badge
                        variant={m.verificationStatus === 'verified' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {m.verificationStatus}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300 block mt-0.5">
                      {m.identifier}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!m.isPreferred && (
                    <button
                      onClick={() => handleSetPreferred(m.id)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-all"
                    >
                      Make Preferred
                    </button>
                  )}
                  <button
                    onClick={() => setMethodToDelete(m)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                    title="Remove method"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {methodToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <ShieldAlert className="w-6 h-6" />
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Confirm Method Removal</h4>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Are you sure you want to remove <span className="font-mono font-bold text-[var(--text-primary)]">{methodToDelete.identifier}</span>?
              {methodToDelete.isPreferred && methods.length > 1 && (
                <span className="block mt-1 text-amber-500">
                  This is your preferred payout rail. Another linked method will be nominated.
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => setMethodToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Remove Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
