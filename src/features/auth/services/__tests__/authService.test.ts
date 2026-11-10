import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService, AdminAuthService } from '../authService';
import { AuthUser } from '../../types';

describe('AuthService & AdminAuthService Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    // Reset lockout
    (AdminAuthService as any).failedAttempts = 0;
    (AdminAuthService as any).lockoutUntil = 0;
  });

  describe('Session Storage & Persistence', () => {
    const mockUser: AuthUser = {
      id: 'usr-test-123',
      name: 'Test Creator',
      email: 'test@creatoros.ai',
      role: 'creator',
      handle: '@testcreator',
      avatarUrl: 'https://example.com/avatar.jpg',
      is_demo: false,
      isDemo: false,
      account_type: 'standard',
      provider: 'email',
    };

    it('should save and retrieve session from localStorage', () => {
      expect(AuthService.getStoredSession()).toBeNull();
      AuthService.saveSession(mockUser);
      const retrieved = AuthService.getStoredSession();
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(mockUser.id);
      expect(retrieved?.email).toBe(mockUser.email);
      expect(retrieved?.role).toBe('creator');
    });

    it('should clear stored session', () => {
      AuthService.saveSession(mockUser);
      expect(AuthService.getStoredSession()).not.toBeNull();
      AuthService.clearSession();
      expect(AuthService.getStoredSession()).toBeNull();
    });

    it('should correctly report demo status based on environment', () => {
      const isDemo = AuthService.isDemoEnabled();
      expect(typeof isDemo).toBe('boolean');
    });

    it('should provide OAuth provider configurations with required fields', () => {
      const providers = AuthService.getOAuthStatus();
      expect(providers.length).toBeGreaterThan(0);
      providers.forEach((p) => {
        expect(p).toHaveProperty('provider');
        expect(p).toHaveProperty('configured');
      });
    });
  });

  describe('AdminAuthService Security & Role Controls', () => {
    it('should fail login with empty or invalid credentials', async () => {
      await expect(
        AdminAuthService.login({ email: '', password: '' })
      ).rejects.toThrow();

      await expect(
        AdminAuthService.login({ email: 'hacker@malicious.com', password: 'Password123!' })
      ).rejects.toThrow(/access denied/i);
    });

    it('should correctly authenticate super admin with valid credentials', async () => {
      const session = await AdminAuthService.login({
        email: 'admin@creatoros.ai',
        password: 'AdminPassword2026!',
      });
      expect(session).toHaveProperty('token');
      expect(session.role).toBe('super_admin');
      expect(session.email).toBe('admin@creatoros.ai');
      expect(AdminAuthService.isSuperAdmin()).toBe(true);
    });

    it('should enforce lockout policy after 5 consecutive failed login attempts', async () => {
      const badCreds = { email: 'admin@creatoros.ai', password: 'short' };

      for (let i = 0; i < 5; i++) {
        try {
          await AdminAuthService.login(badCreds);
        } catch {
          // Expected failed attempts
        }
      }

      // 6th attempt must trigger lockout error
      await expect(AdminAuthService.login(badCreds)).rejects.toThrow(/locked/i);
    });

    it('should clear admin session on logout', async () => {
      await AdminAuthService.login({
        email: 'admin@creatoros.ai',
        password: 'AdminPassword2026!',
      });
      expect(AdminAuthService.getStoredSession()).not.toBeNull();
      AdminAuthService.logout();
      expect(AdminAuthService.getStoredSession()).toBeNull();
      expect(AdminAuthService.isSuperAdmin()).toBe(false);
    });
  });
});
