'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'spplpf-theme';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Read initial theme from DOM attribute (which was set by anti-flash script) or storage
  useEffect(() => {
    setIsMounted(true);
    try {
      const domTheme = document.documentElement.getAttribute('data-theme') as Theme | null;
      if (domTheme === 'dark' || domTheme === 'light') {
        setThemeState(domTheme);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (stored === 'dark' || stored === 'light') {
          setThemeState(stored);
          document.documentElement.setAttribute('data-theme', stored);
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const initialTheme = prefersDark ? 'dark' : 'light';
          setThemeState(initialTheme);
          document.documentElement.setAttribute('data-theme', initialTheme);
        }
      }
    } catch {
      // Storage unavailable fallback
    }
  }, []);

  // Listen for system theme changes if no explicit preference is stored
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const hasManual = localStorage.getItem(STORAGE_KEY);
        if (!hasManual) {
          const next = e.matches ? 'dark' : 'light';
          setThemeState(next);
          document.documentElement.setAttribute('data-theme', next);
        }
      } catch {
        // Fallback
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
        document.documentElement.setAttribute('data-theme', e.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Storage unavailable fallback
    }
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
