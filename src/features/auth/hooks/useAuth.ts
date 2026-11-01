import { useState } from 'react';
import { useAppState } from '../../../context/StateContext';
import { AuthService } from '../services/authService';
import { AuthUser, LoginCredentials, SignUpCredentials, SignUpResult } from '../types';
import { UserRole } from '../../../types';

export function useAuth() {
  const {
    authUser,
    isAuthenticated,
    login: setContextLogin,
    logout: setContextLogout,
    triggerCelebration,
  } = useAppState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithEmail = async (credentials: LoginCredentials): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await AuthService.loginWithEmail(credentials);
      setContextLogin(user);
      triggerCelebration();
      return user;
    } catch (err: any) {
      const msg = err.message || 'Failed to sign in. Please verify your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (credentials: SignUpCredentials): Promise<SignUpResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await AuthService.signUpWithEmail(credentials);
      if (result.user) {
        setContextLogin(result.user);
        triggerCelebration();
      }
      return result;
    } catch (err: any) {
      const msg = err.message || 'Failed to create account.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (role: UserRole = 'creator', initialTab?: string): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await AuthService.loginAsDemo(role);
      setContextLogin(user, initialTab);
      triggerCelebration();
      return user;
    } catch (err: any) {
      const msg = err.message || 'Failed to access demo.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setError(null);
    setContextLogout();
  };

  return {
    user: authUser,
    isAuthenticated,
    isLoading,
    error,
    clearError: () => setError(null),
    loginWithEmail,
    signUpWithEmail,
    loginAsDemo,
    logout,
  };
}
