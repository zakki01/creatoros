import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export type Theme = ResolvedTheme;

export interface ThemeContextType {
  /** Active resolved theme ('light' or 'dark') */
  theme: ResolvedTheme;
  /** User's explicit theme preference ('light', 'dark', or 'system') */
  themePreference: ThemePreference;
  /** Active resolved theme ('light' or 'dark') */
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_STORAGE_KEY = 'creatoros_theme_v1';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        return stored as ThemePreference;
      }
      return 'light'; // Default to pristine light studio theme
    } catch {
      return 'light';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark') return 'dark';
      if (stored === 'light') return 'light';
      if (stored === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Track system media query in real-time when preference is 'system'
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolved = () => {
      if (themePreference === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(themePreference);
      }
    };

    updateResolved();

    const handler = (e: MediaQueryListEvent) => {
      if (themePreference === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [themePreference]);

  // Sync to DOM data-theme and Tailwind dark class, persist in localStorage
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      if (resolvedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    } catch (err) {
      console.warn('Failed to persist theme:', err);
    }
  }, [resolvedTheme, themePreference]);

  const toggleTheme = () => {
    setThemePreference((prev) => {
      const current = prev === 'system' ? resolvedTheme : prev;
      return current === 'light' ? 'dark' : 'light';
    });
  };

  const setTheme = (pref: ThemePreference) => {
    setThemePreference(pref);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        themePreference,
        resolvedTheme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
