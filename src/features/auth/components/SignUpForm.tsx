import React, { useState, useEffect } from 'react';
import { Mail, User, AtSign, ArrowRight, Loader2, AlertCircle, UserCheck, Building2, Key, CheckCircle, Sparkles } from 'lucide-react';
import { SignUpCredentials } from '../types';
import { UserRole } from '../../../types';
import { PasswordField } from './PasswordField';
import { betaAccessService } from '../../../services/betaAccessService';
import { RequestBetaAccessModal } from './RequestBetaAccessModal';

interface SignUpFormProps {
  onSubmit: (credentials: SignUpCredentials) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  isLoading,
  errorMessage,
}) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('creator');
  const [inviteCode, setInviteCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('invite');
      if (p) return p.toUpperCase();
      return localStorage.getItem('creatoros_invite_code') || '';
    }
    return '';
  });
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  const [inviteBadge, setInviteBadge] = useState<string | null>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (inviteCode) {
      const res = betaAccessService.validateInviteCode(inviteCode, role);
      setInviteValid(res.valid);
      setInviteBadge(res.valid ? (res.badge || 'Verified Access') : null);
    }
  }, [inviteCode, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name || !email || !password) {
      setLocalError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    // Strict Private Beta Invite Gate
    const validation = betaAccessService.validateInviteCode(inviteCode, role);
    if (!validation.valid) {
      setLocalError(validation.error || 'A valid invite code is required to register during Private Beta.');
      return;
    }

    try {
      await onSubmit({ name, handle: handle ? `@${handle.replace(/^@/, '')}` : undefined, email, password, role });
      // Redeem invite code
      betaAccessService.redeemInviteCode(inviteCode, email, email);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create account.');
    }
  };

  const displayError = localError || errorMessage;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {displayError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Private Beta Gating Banner */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Private Beta Admission</span>
          </div>
          <button
            type="button"
            onClick={() => setIsWaitlistOpen(true)}
            className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-900 underline cursor-pointer"
          >
            Request Access
          </button>
        </div>

        {/* Invite Code Input */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-700">Beta Invite Code</label>
            {inviteValid === true && inviteBadge && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>{inviteBadge}</span>
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              required
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="e.g. ALPHA-2026"
              disabled={isLoading}
              className={`input-soft-recessed w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-900 placeholder:text-zinc-500 focus:outline-none transition-all ${
                inviteValid === true
                  ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  : inviteValid === false
                  ? 'border-rose-400 focus:ring-1 focus:ring-rose-400'
                  : ''
              }`}
            />
            <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Role Selector Pill */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-medium text-zinc-700">Account Type</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 border border-zinc-200 shadow-inner rounded-xl">
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                role === 'creator'
                  ? 'btn-soft-primary font-semibold shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${role === 'creator' ? 'text-zinc-950' : 'text-sky-400'}`} />
              <span>Content Creator</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('business')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                role === 'business'
                  ? 'btn-soft-primary font-semibold shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${role === 'business' ? 'text-zinc-950' : 'text-[var(--primary)]'}`} />
              <span>Brand / Agency</span>
            </button>
          </div>
        </div>

        {/* Name and Handle in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                disabled={isLoading}
                className="input-soft-recessed w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-500 focus:outline-none transition-all"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Handle</label>
            <div className="relative">
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@alexcreates"
                disabled={isLoading}
                className="input-soft-recessed w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-500 focus:outline-none transition-all font-mono"
              />
              <AtSign className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-medium text-zinc-700">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@domain.com"
              disabled={isLoading}
              autoComplete="username"
              className="input-soft-recessed w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-500 focus:outline-none transition-all"
            />
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Password with PasswordField */}
        <PasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="At least 6 characters"
          disabled={isLoading}
          autoComplete="new-password"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`btn-soft-primary w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer active:scale-[0.99] transition-all ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
              <span>Verifying Invite &amp; Creating...</span>
            </>
          ) : (
            <>
              <span>Claim Invite &amp; Enter</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-900" />
            </>
          )}
        </button>
      </form>

      <RequestBetaAccessModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        onUseCode={(code) => {
          setInviteCode(code);
          setIsWaitlistOpen(false);
        }}
      />
    </>
  );
};
