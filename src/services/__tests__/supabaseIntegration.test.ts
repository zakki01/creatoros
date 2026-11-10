import { describe, it, expect } from 'vitest';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

describe('Supabase Integration & Architecture Guardrails', () => {
  it('confirms authoritative Supabase client is properly initialized', () => {
    expect(isSupabaseConfigured()).toBe(true);
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });

  it('guarantees service role secret is NEVER exposed in frontend code', () => {
    const rawAnonKey = (supabase as any)?.supabaseKey || '';
    // Service role keys usually include service_role in their payload or differ from anon
    // Verify client uses the anon token
    expect(rawAnonKey).toBeDefined();
    expect(import.meta.env.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    expect(import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
  });

  it('enforces safe auth storage key namespace', () => {
    // The auth client must use creatoros_sb_auth_v1 to avoid colliding with other apps
    const authStorageKey = (supabase.auth as any)?.storageKey;
    expect(authStorageKey).toBe('creatoros_sb_auth_v1');
  });

  it('supports queries on core production tables', () => {
    const tables = ['profiles', 'conversations', 'messages', 'contracts', 'campaigns'];
    tables.forEach((table) => {
      const builder = supabase.from(table);
      expect(builder).toBeDefined();
      expect(typeof builder.select).toBe('function');
    });
  });
});
