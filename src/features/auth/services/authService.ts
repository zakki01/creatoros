import {
  AuthUser,
  LoginCredentials,
  OAuthProviderStatus,
  SignUpCredentials,
} from '../types';
import { UserRole } from '../../../types';

const AUTH_STORAGE_KEY = 'creatoros_auth_session_v1';

export interface IAuthProvider {
  readonly id: string;
  readonly name: string;
  isConfigured(): boolean;
  login(credentials?: any): Promise<AuthUser>;
}

export class EmailAuthProvider implements IAuthProvider {
  readonly id = 'email';
  readonly name = 'Email & Password';

  isConfigured(): boolean {
    return true;
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    // Validate credentials
    if (!credentials.email || !credentials.password) {
      throw new Error('Please provide both email and password.');
    }
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const name = credentials.email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    return {
      id: `usr-${Date.now()}`,
      name: formattedName,
      email: credentials.email,
      role: 'creator',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      handle: `@${name.toLowerCase()}`,
      provider: 'email',
      isDemo: false,
    };
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthUser> {
    if (!credentials.email || !credentials.password || !credentials.name) {
      throw new Error('Please fill in all required fields.');
    }
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    return {
      id: `usr-${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      role: credentials.role,
      avatarUrl:
        credentials.role === 'creator'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80',
      handle: credentials.handle || `@${credentials.name.toLowerCase().replace(/\s+/g, '')}`,
      provider: 'email',
      isDemo: false,
    };
  }
}

export class GoogleAuthProvider implements IAuthProvider {
  readonly id = 'google';
  readonly name = 'Google OAuth';

  isConfigured(): boolean {
    // Check if client configured Google Client ID in self-hosted env
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    return Boolean(clientId && clientId.trim().length > 0);
  }

  async login(): Promise<AuthUser> {
    if (!this.isConfigured()) {
      throw new Error(
        'Google OAuth is not configured. Please supply VITE_GOOGLE_CLIENT_ID in your environment, or continue using Demo Creator mode.'
      );
    }
    // Production OAuth redirect or popup handler
    throw new Error('Redirecting to Google OAuth endpoint...');
  }
}

export class AppleAuthProvider implements IAuthProvider {
  readonly id = 'apple';
  readonly name = 'Apple Sign In';

  isConfigured(): boolean {
    const clientId = (import.meta as any).env?.VITE_APPLE_CLIENT_ID;
    return Boolean(clientId && clientId.trim().length > 0);
  }

  async login(): Promise<AuthUser> {
    if (!this.isConfigured()) {
      throw new Error(
        'Apple Sign In is not configured. Please supply VITE_APPLE_CLIENT_ID in your environment, or continue using Demo Creator mode.'
      );
    }
    throw new Error('Redirecting to Apple ID endpoint...');
  }
}

export class FacebookAuthProvider implements IAuthProvider {
  readonly id = 'facebook';
  readonly name = 'Facebook Login';

  isConfigured(): boolean {
    const appId = (import.meta as any).env?.VITE_FACEBOOK_APP_ID;
    return Boolean(appId && appId.trim().length > 0);
  }

  async login(): Promise<AuthUser> {
    if (!this.isConfigured()) {
      throw new Error(
        'Facebook Login is not configured. Please supply VITE_FACEBOOK_APP_ID in your environment, or continue using Demo Creator mode.'
      );
    }
    throw new Error('Redirecting to Facebook Login endpoint...');
  }
}

export class DemoAuthProvider implements IAuthProvider {
  readonly id = 'demo';
  readonly name = 'Demo Sandbox';

  isConfigured(): boolean {
    return true;
  }

  async login(role: UserRole = 'creator'): Promise<AuthUser> {
    if (role === 'super_admin') {
      return {
        id: 'admin-001',
        name: 'Alex Vance (Super Admin)',
        email: 'alex.admin@creatoros.ai',
        role: 'super_admin',
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        handle: '@alex.vance',
        provider: 'demo',
        isDemo: true,
      };
    }

    if (role === 'creator') {
      return {
        id: 'cr-101',
        name: 'Rohan Sharma',
        email: 'rohan.sharma@creatoros.ai',
        role: 'creator',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        handle: '@rohansharma_style',
        provider: 'demo',
        isDemo: true,
      };
    }

    return {
      id: 'biz-001',
      name: 'Aura Streetwear Co.',
      email: 'partnerships@aurastreetwear.com',
      role: 'business',
      avatarUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
      handle: '@aurastreetwear',
      provider: 'demo',
      isDemo: true,
    };
  }
}

class AuthServiceSingleton {
  private emailProvider = new EmailAuthProvider();
  private googleProvider = new GoogleAuthProvider();
  private appleProvider = new AppleAuthProvider();
  private facebookProvider = new FacebookAuthProvider();
  private demoProvider = new DemoAuthProvider();

  getStoredSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  saveSession(user: AuthUser): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (err) {
      console.error('Failed to store auth session:', err);
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear auth session:', err);
    }
  }

  getOAuthStatus(): OAuthProviderStatus[] {
    return [
      {
        provider: 'google',
        configured: this.googleProvider.isConfigured(),
      },
      {
        provider: 'facebook',
        configured: this.facebookProvider.isConfigured(),
      },
      {
        provider: 'apple',
        configured: this.appleProvider.isConfigured(),
      },
    ];
  }

  async loginWithEmail(credentials: LoginCredentials): Promise<AuthUser> {
    const user = await this.emailProvider.login(credentials);
    this.saveSession(user);
    return user;
  }

  async signUpWithEmail(credentials: SignUpCredentials): Promise<AuthUser> {
    const user = await this.emailProvider.signUp(credentials);
    this.saveSession(user);
    return user;
  }

  async loginAsDemo(role: UserRole = 'creator'): Promise<AuthUser> {
    const user = await this.demoProvider.login(role);
    this.saveSession(user);
    return user;
  }

  async loginWithSocial(provider: 'google' | 'apple' | 'facebook'): Promise<AuthUser> {
    if (provider === 'google') {
      return this.googleProvider.login();
    }
    if (provider === 'apple') {
      return this.appleProvider.login();
    }
    return this.facebookProvider.login();
  }
}

export const AuthService = new AuthServiceSingleton();

export const ADMIN_AUTH_STORAGE_KEY = 'creatoros_admin_session_v1';

export interface AdminAuthSession {
  id: string;
  name: string;
  email: string;
  role: 'super_admin';
  avatarUrl?: string;
  token: string;
  loginTimestamp: number;
  expiresAt: number;
  twoFactorVerified: boolean;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

class AdminAuthServiceSingleton {
  getStoredSession(): AdminAuthSession | null {
    try {
      const raw = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      if (!raw) return null;
      const session: AdminAuthSession = JSON.parse(raw);
      // Check session expiry (e.g., 24 hours)
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  saveSession(session: AdminAuthSession): void {
    try {
      localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.error('Failed to store admin session:', err);
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear admin session:', err);
    }
  }

  async login(credentials: AdminLoginCredentials): Promise<AdminAuthSession> {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    // Simulate server-side admin authentication and security check
    await new Promise((r) => setTimeout(r, 650));

    // Validation: Admin email requirement or standard mock credentials
    if (!email || !password) {
      throw new Error('Please enter both admin email and password.');
    }

    if (password.length < 6) {
      throw new Error('Invalid credentials. Password too short.');
    }

    // Two factor verification validation (if entered, check format)
    const twoFactorEntered = Boolean(credentials.twoFactorCode?.trim());
    if (twoFactorEntered && credentials.twoFactorCode?.trim().length !== 6) {
      throw new Error('2FA verification code must be a 6-digit numeric token.');
    }

    const session: AdminAuthSession = {
      id: 'admin-sec-001',
      name: email.includes('alex') ? 'Alex Vance' : 'Super Admin',
      email: email,
      role: 'super_admin',
      avatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      token: `admin_jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      loginTimestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours validity
      twoFactorVerified: twoFactorEntered || true,
    };

    this.saveSession(session);
    return session;
  }

  logout(): void {
    this.clearSession();
  }

  isSuperAdmin(): boolean {
    const session = this.getStoredSession();
    return session !== null && session.role === 'super_admin';
  }
}

export const AdminAuthService = new AdminAuthServiceSingleton();

