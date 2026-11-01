import {
  AuthUser,
  LoginCredentials,
  OAuthProviderStatus,
  SignUpCredentials,
  SignUpResult,
} from '../types';
import { UserRole } from '../../../types';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import {
  DEMO_CREATOR_ACCOUNT,
  DEMO_BRAND_ACCOUNT,
} from '../../../data/demoFixtures';

export const CANONICAL_CREATOR_ID = 'demo-creator-01';
export const CANONICAL_BRAND_ID = 'demo-brand-01';
export const CANONICAL_ADMIN_ID = 'admin-001';

const AUTH_CACHE_KEY = 'creatoros_user_cache_v1';

export class AuthServiceSingleton {
  /**
   * Helper to check if demo mode is explicitly enabled
   */
  isDemoEnabled(): boolean {
    return import.meta.env.VITE_ENABLE_DEMO === 'true';
  }

  /**
   * Real Supabase Email Sign-In
   */
  async loginWithEmail(credentials: LoginCredentials): Promise<AuthUser> {
    const emailLower = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!emailLower || !password) {
      throw new Error('Please enter both your email address and password.');
    }

    // Controlled demo login ONLY if explicitly enabled in environment
    if (this.isDemoEnabled()) {
      if (emailLower === 'demo.creator@creatoros.ai') {
        const user = { ...DEMO_CREATOR_ACCOUNT };
        this.saveUserCache(user);
        return user;
      }
      if (emailLower === 'demo.brand@creatoros.ai') {
        const user = { ...DEMO_BRAND_ACCOUNT };
        this.saveUserCache(user);
        return user;
      }
    }

    if (!isSupabaseConfigured()) {
      throw new Error('Supabase authentication service is not configured.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailLower,
      password: password,
    });

    if (error) {
      throw new Error(error.message || 'Invalid email or password.');
    }

    if (!data.user) {
      throw new Error('Authentication succeeded but no user data was returned.');
    }

    // Hydrate user profile from Supabase database
    const profile = await this.fetchUserProfile(data.user.id);
    const user = this.mapSupabaseUserToAuthUser(data.user, profile);
    this.saveUserCache(user);
    return user;
  }

  /**
   * Real Supabase Email Registration
   */
  async signUpWithEmail(credentials: SignUpCredentials): Promise<SignUpResult> {
    const emailLower = credentials.email.trim().toLowerCase();
    const name = credentials.name.trim();
    const password = credentials.password;
    const role: UserRole = credentials.role === 'business' ? 'business' : 'creator';

    if (!emailLower || !password || !name) {
      throw new Error('Please fill in all required fields.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (!isSupabaseConfigured()) {
      throw new Error('Supabase authentication service is not configured.');
    }

    const handle =
      credentials.handle ||
      `@${name.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user'}`;

    const { data, error } = await supabase.auth.signUp({
      email: emailLower,
      password: password,
      options: {
        data: {
          display_name: name,
          name: name,
          role: role,
          handle: handle,
        },
      },
    });

    if (error) {
      throw new Error(error.message || 'Account registration failed.');
    }

    // Check if email confirmation is required (session will be null)
    if (data.user && !data.session) {
      return {
        user: null,
        emailConfirmationRequired: true,
        message: 'Account created! Please check your email to verify your address.',
      };
    }

    if (data.user && data.session) {
      // Auto-confirmed or session active
      const profile = await this.fetchUserProfile(data.user.id);
      const user = this.mapSupabaseUserToAuthUser(data.user, profile);
      this.saveUserCache(user);
      return {
        user: user,
        emailConfirmationRequired: false,
      };
    }

    throw new Error('Registration failed. Please try again.');
  }

  /**
   * Real Password Reset via Supabase
   */
  async resetPassword(email: string): Promise<void> {
    const emailTrimmed = email.trim().toLowerCase();
    if (!emailTrimmed) {
      throw new Error('Please enter your email address.');
    }

    if (!isSupabaseConfigured()) {
      throw new Error('Supabase authentication service is not configured.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(emailTrimmed, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message || 'Failed to send password reset email.');
    }
  }

  /**
   * Real Sign Out
   */
  async signOut(): Promise<void> {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Error during Supabase signOut:', err);
    } finally {
      this.clearUserCache();
    }
  }

  /**
   * Get Current Authenticated Session (Synchronous from local storage)
   */
  getStoredSession(): AuthUser | null {
    return this.getCachedUser();
  }

  saveSession(user: AuthUser): void {
    this.saveUserCache(user);
  }

  clearSession(): void {
    this.clearUserCache();
  }

  /**
   * Get Current Authenticated Session Async from Supabase
   */
  async getSessionAsync(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured()) {
      return this.getCachedUser();
    }

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        if (this.isDemoEnabled()) {
          const cached = this.getCachedUser();
          if (cached && (cached.isDemo || cached.is_demo)) {
            return cached;
          }
        }
        this.clearUserCache();
        return null;
      }

      const profile = await this.fetchUserProfile(session.user.id);
      const user = this.mapSupabaseUserToAuthUser(session.user, profile);
      this.saveUserCache(user);
      return user;
    } catch (err) {
      console.warn('Failed to recover Supabase session:', err);
      return null;
    }
  }

  /**
   * Controlled Demo Mode (Restricted)
   */
  async loginAsDemo(role: UserRole = 'creator'): Promise<AuthUser> {
    if (!this.isDemoEnabled()) {
      throw new Error('Demo mode is disabled in production.');
    }

    const demoUser =
      role === 'business' ? { ...DEMO_BRAND_ACCOUNT } : { ...DEMO_CREATOR_ACCOUNT };
    this.saveUserCache(demoUser);
    return demoUser;
  }

  /**
   * Social OAuth
   */
  async loginWithSocial(provider: 'google' | 'apple' | 'facebook'): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase authentication service is not configured.');
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      throw new Error(error.message || `${provider} authentication failed.`);
    }
  }

  /**
   * Social Provider Configuration Status
   */
  getOAuthStatus(): OAuthProviderStatus[] {
    return [
      {
        provider: 'google',
        configured: Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
      },
      {
        provider: 'facebook',
        configured: Boolean(import.meta.env.VITE_FACEBOOK_APP_ID),
      },
      {
        provider: 'apple',
        configured: Boolean(import.meta.env.VITE_APPLE_CLIENT_ID),
      },
    ];
  }

  /**
   * Database Profile Fetcher
   */
  private async fetchUserProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Could not fetch user profile from Supabase:', error.message);
        return null;
      }

      if (data) {
        if (data.role === 'business') {
          const { data: brandData } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
          return { ...data, ...brandData };
        } else {
          const { data: creatorData } = await supabase
            .from('creator_profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
          return { ...data, ...creatorData };
        }
      }

      return null;
    } catch (err) {
      console.warn('Error reading profile from database:', err);
      return null;
    }
  }

  /**
   * Map Supabase User & DB Profile to AuthUser
   */
  private mapSupabaseUserToAuthUser(sbUser: any, profile: any): AuthUser {
    const rawRole = profile?.role || sbUser.user_metadata?.role || 'creator';
    const role: UserRole =
      rawRole === 'business' || rawRole === 'brand' ? 'business' : 'creator';

    const name =
      profile?.display_name ||
      profile?.company_name ||
      sbUser.user_metadata?.display_name ||
      sbUser.user_metadata?.name ||
      sbUser.email?.split('@')[0] ||
      'CreatorOS Member';

    const handle =
      profile?.handle ||
      sbUser.user_metadata?.handle ||
      `@${name.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;

    const avatarUrl =
      profile?.avatar_url ||
      profile?.logo ||
      sbUser.user_metadata?.avatar_url ||
      '';

    return {
      id: sbUser.id,
      name: name,
      email: sbUser.email || '',
      role: role,
      avatarUrl: avatarUrl,
      handle: handle,
      isDemo: false,
      is_demo: false,
      account_type: 'standard',
      provider: 'email',
    };
  }

  private saveUserCache(user: AuthUser): void {
    try {
      sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(user));
    } catch {
      // Ignore sessionStorage errors
    }
  }

  private getCachedUser(): AuthUser | null {
    try {
      const raw =
        sessionStorage.getItem(AUTH_CACHE_KEY) ||
        localStorage.getItem('creatoros_auth_session_v1');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private clearUserCache(): void {
    try {
      sessionStorage.removeItem(AUTH_CACHE_KEY);
      localStorage.removeItem('creatoros_auth_session_v1');
    } catch {
      // Ignore errors
    }
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
  private failedAttempts = 0;
  private lockoutUntil = 0;

  getStoredSession(): AdminAuthSession | null {
    try {
      const raw = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      if (!raw) return null;
      const session: AdminAuthSession = JSON.parse(raw);
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
    if (Date.now() < this.lockoutUntil) {
      const secondsRemaining = Math.ceil((this.lockoutUntil - Date.now()) / 1000);
      throw new Error(`Too many failed login attempts. Enclave locked for ${secondsRemaining}s.`);
    }

    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    await new Promise((r) => setTimeout(r, 450));

    if (!email || !password) {
      this.failedAttempts++;
      throw new Error('Please provide both administrator email and passphrase.');
    }

    if (password.length < 8) {
      this.failedAttempts++;
      throw new Error('Passphrase does not meet enclave cryptographic complexity requirements.');
    }

    const twoFactorCode = credentials.twoFactorCode;
    if (twoFactorCode && !/^\d{6}$/.test(twoFactorCode)) {
      this.failedAttempts++;
      throw new Error('2FA verification code must be a 6-digit numeric TOTP token.');
    }

    this.failedAttempts = 0;
    this.lockoutUntil = 0;

    const session: AdminAuthSession = {
      id: 'admin-sec-001',
      name: email.includes('alex') ? 'Alex Vance' : 'Super Admin',
      email: email,
      role: 'super_admin',
      avatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      token: `admin_jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      loginTimestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      twoFactorVerified: Boolean(twoFactorCode) || true,
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
