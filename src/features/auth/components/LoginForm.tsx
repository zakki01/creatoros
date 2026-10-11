import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { LoginCredentials } from '../types';
import { PasswordField } from './PasswordField';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  onForgotPassword: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  isLoading,
  errorMessage,
}) => {
  const [email, setEmail] = useState('creator@demo.creatoros.ai');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    try {
      await onSubmit({ email, password, rememberMe });
    } catch (err: any) {
      setLocalError(err.message || 'Failed to sign in. Please try again.');
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

      {/* Email Field */}
      <div className="space-y-1.5 text-left">
        <label className="text-xs font-medium text-zinc-300">Email Address</label>
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="creator@example.com"
            disabled={isLoading}
            autoComplete="username"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Password Field with PasswordField Component */}
      <PasswordField
        id="login-password"
        value={password}
        onChange={setPassword}
        disabled={isLoading}
        autoComplete="current-password"
        rightLabelAction={
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
          >
            Forgot password?
          </button>
        }
      />

      {/* Remember Me */}
      <div className="flex items-center gap-2 pt-0.5">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
        />
        <label htmlFor="rememberMe" className="text-xs text-zinc-400 cursor-pointer select-none">
          Keep me signed in on this device
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all ${
          isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-indigo-600/35'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign In to CreatorOS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
};
