/**
 * CreatorOS Design System Tokens
 * Strict adherence to mobile-first UX, 44px touch targets,
 * Architectural Light Studio aesthetic, and container/breakpoint rules.
 */

export const tokens = {
  colors: {
    // Surface hierarchy (Light Studio Foundation)
    bgBase: '#EDF0F4',       // Soft gray studio canvas
    bgSurface: '#FFFFFF',    // Crisp white card & sheet surface
    bgElevated: '#F7F9FC',   // Popover & elevated card surface
    bgSubtle: '#E4E9EF',     // Hover & subtle interactive fills

    // Borders & Dividers
    borderSubtle: 'rgba(0, 0, 0, 0.08)',
    borderMedium: 'rgba(0, 0, 0, 0.14)',
    borderStrong: 'rgba(0, 0, 0, 0.22)',

    // Text Hierarchy
    textPrimary: '#0F172A',   // slate-900 (titles, prominent labels)
    textSecondary: '#4E5F72', // slate-600 (descriptions, handles)
    textMuted: '#64758A',     // slate-500 (timestamps, inactive states)

    // Semantic Accents (CreatorOS Electric Cyan + Balanced Accents)
    primary: '#007E93',       // cyan-500 / brand accent
    primaryHover: '#006779',  // cyan-600
    primaryLight: 'rgba(0, 180, 216, 0.12)',

    success: '#047857',       // emerald-600
    successLight: 'rgba(5, 150, 105, 0.12)',

    danger: '#B4233C',        // rose-600
    dangerLight: 'rgba(225, 29, 72, 0.12)',

    warning: '#92400E',       // amber-600
    warningLight: 'rgba(217, 119, 6, 0.12)',
  },

  radius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px (Cards & Inputs)
    xl: '1rem',      // 16px (Modals & Sheets)
    '2xl': '1.5rem', // 24px (Hero cards)
    full: '9999px',  // Pills & Avatars
  },

  zIndex: {
    base: 0,
    elevated: 10,
    sticky: 20,
    navigation: 40,   // Mobile bottom nav & desktop sidebar
    bottomSheet: 50,  // Draggable sheets
    popover: 55,      // Dropdowns & reaction trays
    modal: 60,        // Desktop modal dialogs
    toast: 70,        // Alert toasts
    tooltip: 80,      // Tooltip overlays
  },

  // Touch & accessibility minimums
  touchTarget: {
    minSize: '44px',
    iconHitArea: 'min-w-[44px] min-h-[44px]',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignTokens = typeof tokens;
