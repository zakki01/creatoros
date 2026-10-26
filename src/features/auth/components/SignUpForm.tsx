import React, { useState } from 'react';
import { Mail, User, AtSign, ArrowRight, Loader2, AlertCircle, UserCheck, Building2 } from 'lucide-react';
import { SignUpCredentials } from '../types';
import { UserRole } from '../../../types';
import { PasswordField } from './PasswordField';

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
  const [localError, setLocalError] = useState<string | null>(null);

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

    try {
      await onSubmit({ name, handle: handle ? `@${handle.replace(/^@/, '')}` : undefined, email, password, role });
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create account.');
    }
  };

  const displayError = localError || errorMessage;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

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
            <Building2 className={`w-3.5 h-3.5 ${role === 'business' ? 'text-zinc-950' : 'text-[#007E93]'}`} />
            <span>Brand / Agency</span>
          </button>
        </div>
        <p className="text-[10px] text-zinc-500 font-mono mt-1">
          Immutable account type. Tailors your dedicated workspace, legal escrow, and permissions.
        </p>
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
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <span>Create Account &amp; Enter</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-900" />
          </>
        )}
      </button>
    </form>
  );
};
