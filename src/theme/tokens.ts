/**
 * CreatorOS Centralized Design Tokens
 * Light Studio Theme & True Dark Mode Surface System
 *
 * OFFICIAL CREATOROS PALETTE:
 * LIGHT THEME:
 *   Background: #F0F0F0
 *   Primary: #105BFF
 *   Accent: #FF77BC
 *
 * DARK THEME:
 *   Background: #02070A
 *   Primary: #0297DE
 *   Accent: #FC734D
 */

export const lightTokens = {
  colors: {
    // CreatorOS Brand Identity
    brandPrimary: '#105BFF',
    brandSecondary: '#475569',
    brandAccent: '#FF77BC',
    brandAccentHover: '#F062AA',
    brandAccentLight: 'rgba(255, 119, 188, 0.15)',

    // Primary Action
    primary: '#105BFF',
    primaryHover: '#0D4BD9',
    primaryActive: '#093EB8',
    primarySoft: 'rgba(16, 91, 255, 0.12)',
    primaryForeground: '#FFFFFF',

    // Creative Accent
    accent: '#FF77BC',
    accentHover: '#F062AA',
    accentSoft: 'rgba(255, 119, 188, 0.15)',
    accentForeground: '#FFFFFF',

    // Surfaces & Foundation
    background: '#F0F0F0',
    surface: '#FFFFFF',
    surfaceElevated: '#F8F9FA',
    surfaceSubtle: '#EBEBEB',
    surfaceRecessed: '#E4E4E6',
    surfaceInput: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',

    // Typography
    textPrimary: '#0A0F1D',
    textSecondary: '#475569',
    textTertiary: '#64748B',
    textDisabled: '#A1A1AA',
    textInverse: '#FFFFFF',

    // Borders & Dividers
    border: '#D8D8DC',
    borderSubtle: 'rgba(0, 0, 0, 0.05)',
    borderStrong: '#A0A0A8',
    borderFocus: '#105BFF',

    // Feedback
    success: '#047857',
    warning: '#92400E',
    danger: '#B4233C',
    info: '#105BFF',
  },
} as const;

export const darkTokens = {
  colors: {
    // CreatorOS Brand Identity
    brandPrimary: '#0297DE',
    brandSecondary: '#A0B0BF',
    brandAccent: '#FC734D',
    brandAccentHover: '#EB633D',
    brandAccentLight: 'rgba(252, 115, 77, 0.15)',

    // Primary Action
    primary: '#0297DE',
    primaryHover: '#0283C2',
    primaryActive: '#0170A4',
    primarySoft: 'rgba(2, 151, 222, 0.15)',
    primaryForeground: '#FFFFFF',

    // Creative Accent
    accent: '#FC734D',
    accentHover: '#EB633D',
    accentSoft: 'rgba(252, 115, 77, 0.15)',
    accentForeground: '#02070A',

    // Surfaces & Foundation (True Dark Surface Hierarchy based on #02070A)
    background: '#02070A',
    sidebar: '#050D13',
    surface: '#08121A',
    surfaceElevated: '#0E1C27',
    surfaceSubtle: '#101F2B',
    surfaceRecessed: '#040A0F',
    surfaceInput: '#060E14',
    surfaceGlass: 'rgba(8, 18, 26, 0.85)',

    // Typography
    textPrimary: '#F4F7FA',
    textSecondary: '#A0B0BF',
    textTertiary: '#6E7F8E',
    textDisabled: '#42505C',
    textInverse: '#02070A',

    // Borders & Dividers
    border: 'rgba(255, 255, 255, 0.08)',
    borderSubtle: 'rgba(255, 255, 255, 0.04)',
    borderStrong: 'rgba(255, 255, 255, 0.16)',
    borderFocus: '#0297DE',

    // Feedback
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#0297DE',
  },
} as const;

export const tokens = {
  colors: {
    brandPrimary: '#105BFF',
    brandSecondary: '#475569',
    brandAccent: '#FF77BC',
    brandAccentHover: '#F062AA',
    brandAccentLight: 'rgba(255, 119, 188, 0.15)',

    surfaceStudio: '#F0F0F0',
    surfaceCard: '#FFFFFF',
    surfaceCardHighlight: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',
    surfaceRecessed: '#E4E4E6',
    surfaceInput: '#FFFFFF',

    textPrimary: '#0A0F1D',
    textSecondary: '#475569',
    textMuted: '#71717A',
    textInverse: '#FFFFFF',

    borderSubtle: 'rgba(0, 0, 0, 0.05)',
    borderMedium: '#D8D8DC',
    borderHighlight: 'rgba(255, 255, 255, 0.95)',
    borderFocus: '#105BFF',

    success: '#047857',
    warning: '#92400E',
    danger: '#B4233C',
  },

  shadows: {
    cardFloating:
      '0 16px 36px -14px rgba(10, 15, 29, 0.12), 0 4px 10px -3px rgba(10, 15, 29, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.95)',
    controlRaised:
      '0 4px 12px rgba(16, 91, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(0, 0, 0, 0.06)',
    controlRecessed:
      'inset 2px 2px 5px rgba(10, 15, 29, 0.08), inset -1px -1px 3px rgba(255, 255, 255, 0.8)',
    inputRecessed:
      'inset 0 1px 3px rgba(10, 15, 29, 0.05), 0 1px 0 rgba(255, 255, 255, 0.8)',
    pillActive:
      '0 3px 8px rgba(16, 91, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
    accentActive:
      '0 3px 12px rgba(255, 119, 188, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
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
