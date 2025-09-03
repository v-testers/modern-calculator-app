import React, { useEffect, useState } from 'react';
import type { ThemeMode } from '../types/theme';
import { ThemeContext } from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('calculator-theme') as ThemeMode;
    return savedTheme || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('calculator-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'colorful'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};