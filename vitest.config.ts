import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/services/permissionService.ts',
        'src/services/analyticsService.ts',
        'src/services/trustSafetyService.ts',
        'src/services/giftLedgerService.ts',
        'src/services/supabaseClient.ts',
        'src/data/demoFixtures.ts',
        'src/theme/tokens.ts',
      ],
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 70,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname || '.', './src'),
    },
  },
});
