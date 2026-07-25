import React, { createContext, useContext, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Settings } from '@/types';

interface ThemeContextType {
  theme: Settings['theme'];
  setTheme: (theme: Settings['theme']) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeClasses = {
  dark: 'dark bg-gray-950 text-white',
  light: 'light bg-white text-gray-950',
  oled: 'oled bg-black text-white',
  spotify: 'spotify bg-gray-900 text-white',
  glassmorphism: 'glassmorphism bg-white/20 text-white',
  neon: 'neon bg-gray-950 text-white',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    root.className = themeClasses[settings.theme];

    switch (settings.theme) {
      case 'spotify':
        root.style.setProperty('--color-primary', '#1db954');
        root.style.setProperty('--color-accent', '#1ed760');
        break;
      case 'neon':
        root.style.setProperty('--color-primary', '#00ff00');
        root.style.setProperty('--color-accent', '#00ff88');
        break;
      default:
        root.style.setProperty('--color-primary', settings.accentColor);
        root.style.setProperty('--color-accent', settings.accentColor);
    }
  }, [settings.theme, settings.accentColor]);

  const setTheme = (theme: Settings['theme']) => {
    updateSettings({ theme });
  };

  return (
    <ThemeContext.Provider value={{ theme: settings.theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
