/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--primary)',
        background: 'var(--background)',
        foreground: 'var(--text-primary)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-soft)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        brand: {
          primary: 'var(--primary)',
          accent: 'var(--accent)',
          text: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          secondary: 'var(--surface-elevated)',
          tertiary: 'var(--surface-muted)',
          dark: '#02070A',
          darkSecondary: '#08121A',
          darkTertiary: '#0E1C27',
          0: 'var(--surface-0)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
          4: 'var(--surface-4)',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 30px -10px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.02)',
        'premium-hover': '0 20px 40px -15px rgba(0,0,0,0.12), 0 8px 12px -4px rgba(0,0,0,0.04)',
        'glow': '0 0 25px -5px rgba(16, 91, 255, 0.25)',
        'depth-1': 'var(--depth-1)',
        'depth-2': 'var(--depth-2)',
        'depth-3': 'var(--depth-3)',
        'spatial-soft': 'var(--shadow-soft)',
        'spatial-medium': 'var(--shadow-medium)',
        'spatial-floating': 'var(--shadow-floating)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
