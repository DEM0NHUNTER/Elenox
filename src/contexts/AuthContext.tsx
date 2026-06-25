/**
 * Cryptographic Identity Lease and Session Claims Provider.
 * Enforces in-memory authentication states and maintains background checks.
 * UI-ONLY MOCK MODE: Network dependencies removed for local interface development.
 */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  company_id: string;
  is_developer?: boolean;
  dev_mode_active?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (profile: UserProfile) => void;
  logout: () => void;
  syncSessionIdentity: () => Promise<void>;
  updateUserPreferences: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const syncSessionIdentity = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Offline UI Mock: Pulls directly from local storage, no network calls.
      const cached = sessionStorage.getItem('axios_user_profile');
      if (cached) {
        setUser(JSON.parse(cached));
        return;
      }
      // If no session exists, strictly unauthenticated (allows public routing)
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncSessionIdentity();
  }, []);

  const login = (profile: UserProfile) => {
    sessionStorage.setItem('axios_user_profile', JSON.stringify(profile));
    setUser(profile);
    setIsLoading(false);
  };

  const logout = () => {
    sessionStorage.removeItem('axios_user_profile');
    setUser(null);
    setIsLoading(false);
  };

  const updateUserPreferences = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      sessionStorage.setItem('axios_user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, syncSessionIdentity, updateUserPreferences }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be mounted inside an explicit AuthProvider boundary.');
  }
  return context;
}