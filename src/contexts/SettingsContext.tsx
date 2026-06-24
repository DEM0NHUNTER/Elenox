/**
 * Global Context provider for user interface settings.
 * Manages WCAG accessibility constraints, seamless theme transitions, and telemetry notifications.
 */
import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';

interface SettingsState {
  theme: 'dark' | 'light';
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
}

interface SettingsContextType extends SettingsState {
  setTheme: (theme: 'dark' | 'light') => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(true);

  // Track the transition timeout to prevent race conditions if the user rapidly toggles
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Synchronize with persistent storage on initialization
    const savedTheme = localStorage.getItem('axiosigil_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedAnimations = localStorage.getItem('axiosigil_animations');
    const savedNotifications = localStorage.getItem('axiosigil_notifications');

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setThemeState('light');
      document.documentElement.classList.remove('dark');
    } else {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    }

    if (savedAnimations === 'false') {
      setAnimationsEnabledState(false);
      document.documentElement.classList.add('reduce-motion');
    } else {
      setAnimationsEnabledState(true);
      document.documentElement.classList.remove('reduce-motion');
    }

    if (savedNotifications === 'false') {
      setNotificationsEnabledState(false);
    }
  }, []);

  const setTheme = (newTheme: 'dark' | 'light'): void => {
    if (newTheme === theme) return;

    setThemeState(newTheme);
    localStorage.setItem('axiosigil_theme', newTheme);

    // 1. Inject the transition class to force smooth color interpolation
    document.documentElement.classList.add('theme-transitioning');

    // 2. Swap the actual tailwind target class
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    // 3. Clear any existing timeouts to handle rapid toggling gracefully
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // 4. Remove the class after the CSS transition completes (500ms + 100ms buffer)
    transitionTimeoutRef.current = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      transitionTimeoutRef.current = null;
    }, 600);
  };

  const setAnimationsEnabled = (enabled: boolean): void => {
    setAnimationsEnabledState(enabled);
    localStorage.setItem('axiosigil_animations', String(enabled));
    document.documentElement.classList.toggle('reduce-motion', !enabled);
  };

  const setNotificationsEnabled = (enabled: boolean): void => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem('axiosigil_notifications', String(enabled));
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        animationsEnabled,
        notificationsEnabled,
        setTheme,
        setAnimationsEnabled,
        setNotificationsEnabled
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider boundary.');
  }
  return context;
}
