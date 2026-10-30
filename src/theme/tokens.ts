/**
 * CreatorOS Centralized Design Tokens
 * Light Studio Theme & Neumorphic-Glass Hybrid Foundation
 */

/**
 * CreatorOS Centralized Design Tokens
 * Light Studio Theme & True Dark Mode Surface System
 */

export const lightTokens = {
  colors: {
    // CreatorOS Brand Identity
    brandPrimary: '#123047',
    brandSecondary: '#365267',
    brandAccent: '#00869B',
    brandAccentHover: '#006C80',
    brandAccentLight: 'rgba(0, 134, 155, 0.12)',

    // Surfaces & Foundation
    background: '#EDF0F4',
    surface: '#FFFFFF',
    surfaceElevated: '#F7F9FC',
    surfaceSubtle: '#F1F4F8',
    surfaceRecessed: '#E2E7ED',
    surfaceInput: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.82)',

    // Typography
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#64748B',
    textDisabled: '#94A3B8',
    textInverse: '#FFFFFF',

    // Borders & Dividers
    border: '#D5DDE6',
    borderSubtle: 'rgba(0, 0, 0, 0.06)',
    borderStrong: '#94A3B8',
    borderFocus: '#00869B',

    // Feedback
    success: '#047857',
    warning: '#92400E',
    danger: '#B4233C',
    info: '#00869B',
  },
} as const;

export const darkTokens = {
  colors: {
    // CreatorOS Brand Identity
    brandPrimary: '#00B4D8',
    brandSecondary: '#94A3B8',
    brandAccent: '#00B4D8',
    brandAccentHover: '#0096B4',
    brandAccentLight: 'rgba(0, 180, 216, 0.15)',

    // Surfaces & Foundation (True Dark Surface Hierarchy)
    background: '#0B0D11',
    sidebar: '#10131A',
    surface: '#151922',
    surfaceElevated: '#1A1F29',
    surfaceSubtle: '#1E232E',
    surfaceRecessed: '#11151C',
    surfaceInput: '#11151C',
    surfaceGlass: 'rgba(21, 25, 34, 0.85)',

    // Typography
    textPrimary: '#F4F7FA',
    textSecondary: '#A9B2C0',
    textTertiary: '#737D8C',
    textDisabled: '#4A5260',
    textInverse: '#0B0D11',

    // Borders & Dividers
    border: 'rgba(255, 255, 255, 0.08)',
    borderSubtle: 'rgba(255, 255, 255, 0.04)',
    borderStrong: 'rgba(255, 255, 255, 0.16)',
    borderFocus: '#00B4D8',

    // Feedback
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#00B4D8',
  },
} as const;

export const tokens = {
  colors: {
    brandPrimary: '#123047',
    brandSecondary: '#365267',
    brandAccent: '#00869B',
    brandAccentHover: '#006C80',
    brandAccentLight: 'rgba(0, 180, 216, 0.12)',

    surfaceStudio: '#EDF0F4',
    surfaceCard: '#F7F9FC',
    surfaceCardHighlight: '#FFFFFF',
    surfaceGlass: 'rgba(245, 247, 250, 0.78)',
    surfaceRecessed: '#E2E7ED',
    surfaceInput: '#FFFFFF',

    textPrimary: '#0F172A',
    textSecondary: '#4E5F72',
    textMuted: '#64758A',
    textInverse: '#FFFFFF',

    borderSubtle: 'rgba(0, 0, 0, 0.08)',
    borderMedium: 'rgba(0, 0, 0, 0.14)',
    borderHighlight: 'rgba(255, 255, 255, 0.85)',
    borderFocus: '#00B4D8',

    success: '#047857',
    warning: '#92400E',
    danger: '#B4233C',
  },

  shadows: {
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
