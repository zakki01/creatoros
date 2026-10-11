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
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Role Selector Pill */}
      <div className="space-y-1.5 text-left">
        <label className="text-xs font-medium text-zinc-300">Account Type</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('creator')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              role === 'creator'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Content Creator</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('business')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              role === 'business'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
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
          <label className="text-xs font-medium text-zinc-300">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              disabled={isLoading}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Handle</label>
          <div className="relative">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@alexcreates"
              disabled={isLoading}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
            <AtSign className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5 text-left">
        <label className="text-xs font-medium text-zinc-300">Email Address</label>
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@domain.com"
            disabled={isLoading}
            autoComplete="username"
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
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
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 transition-all ${
          isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-emerald-600/35'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <span>Create Account & Enter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
};
