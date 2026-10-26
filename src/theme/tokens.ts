/**
 * CreatorOS Centralized Design Tokens
 * Light Studio Theme & Neumorphic-Glass Hybrid Foundation
 */

export const tokens = {
  colors: {
    // CreatorOS Brand Identity (derived from official logo emblem)
    brandPrimary: '#123047', // Charcoal deep slate
    brandSecondary: '#365267', // Studio medium slate
    brandAccent: '#00869B', // Electric Cyan / Ocean Blue
    brandAccentHover: '#006C80',
    brandAccentLight: 'rgba(0, 180, 216, 0.12)',

    // Surface Grays & Studio Foundation
    surfaceStudio: '#EDF0F4',
    surfaceCard: '#F7F9FC',
    surfaceCardHighlight: '#FFFFFF',
    surfaceGlass: 'rgba(245, 247, 250, 0.78)',
    surfaceRecessed: '#E2E7ED',
    surfaceInput: '#FFFFFF',

    // Typography
    textPrimary: '#0F172A',
    textSecondary: '#4E5F72',
    textMuted: '#64758A',
    textInverse: '#FFFFFF',

    // Borders & Dividers
    borderSubtle: 'rgba(0, 0, 0, 0.08)',
    borderMedium: 'rgba(0, 0, 0, 0.14)',
    borderHighlight: 'rgba(255, 255, 255, 0.85)',
    borderFocus: '#00B4D8',

    // Feedback
    success: '#047857',
    warning: '#92400E',
    danger: '#B4233C',
  },

  shadows: {
    // Soft UI / Neumorphism
    cardFloating:
      '0 16px 36px -14px rgba(23, 37, 54, 0.18), 0 4px 10px -3px rgba(23, 37, 54, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.95)',
    controlRaised:
      '0 4px 12px rgba(15, 23, 42, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(0, 0, 0, 0.06)',
    controlRecessed:
      'inset 2px 2px 5px rgba(15, 23, 42, 0.14), inset -1px -1px 3px rgba(255, 255, 255, 0.8)',
    inputRecessed:
      'inset 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 0 rgba(255, 255, 255, 0.8)',
    pillActive:
      '0 3px 8px rgba(15, 23, 42, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
    accentActive:
      '0 3px 12px rgba(0, 180, 216, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
  },

  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    card: '28px',
    full: '9999px',
  },

  typography: {
    fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
} as const;

export type ThemeTokens = typeof tokens;
