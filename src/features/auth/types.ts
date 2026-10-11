import { UserRole } from '../../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  handle?: string;
  isDemo?: boolean;
  provider: 'email' | 'google' | 'apple' | 'facebook' | 'demo';
}

export type AuthMode = 'welcome' | 'auth' | 'app';
export type AuthTab = 'login' | 'signup';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  handle?: string;
}

export interface OAuthProviderStatus {
  provider: 'google' | 'apple' | 'facebook';
  configured: boolean;
  clientId?: string;
}
