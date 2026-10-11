/**
 * CreatorOS Design System Tokens
 * Strict adherence to mobile-first UX, 44px touch targets,
 * high-contrast dark aesthetic, and container/breakpoint rules.
 */

export const tokens = {
  colors: {
    // Surface hierarchy
    bgBase: '#070709',       // Deepest canvas background
    bgSurface: '#0c0c11',    // Standard card & sheet surface
    bgElevated: '#14141b',   // Popover & elevated card surface
    bgSubtle: '#181822',     // Hover & subtle interactive fills

    // Borders & Dividers
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderMedium: 'rgba(255, 255, 255, 0.14)',
    borderStrong: 'rgba(255, 255, 255, 0.24)',

    // Text Hierarchy
    textPrimary: '#f4f4f5',   // zinc-100 (titles, prominent labels)
    textSecondary: '#a1a1aa', // zinc-400 (descriptions, handles)
    textMuted: '#71717a',     // zinc-500 (timestamps, inactive states)

    // Semantic Accents
    primary: '#6366f1',       // indigo-500
    primaryHover: '#4f46e5',  // indigo-600
    primaryLight: 'rgba(99, 102, 241, 0.12)',

    success: '#10b981',       // emerald-500
    successLight: 'rgba(16, 185, 129, 0.12)',

    danger: '#f43f5e',        // rose-500
    dangerLight: 'rgba(244, 63, 94, 0.12)',

    warning: '#f59e0b',       // amber-500
    warningLight: 'rgba(245, 158, 11, 0.12)',
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
