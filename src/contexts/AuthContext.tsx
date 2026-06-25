/**
 * Cryptographic Identity Lease and Session Claims Provider.
 * Enforces in-memory authentication states and maintains background checks
 * against secure HttpOnly cookie domains. Routes all traffic through API_BASE
 * to support decoupled Edge/Vercel deployments.
 */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_BASE } from '../config';

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
      // Explicitly prepend API_BASE to route traffic down the remote tunnel
      const response = await fetch(`${API_BASE}/api/auth/session`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          const profile: UserProfile = {
            id: String(data.user.id),
            full_name: String(data.user.full_name),
            email: String(data.user.email),
            role: String(data.user.role),
            company_id: String(data.user.company_id),
            is_developer: Boolean(data.user.is_developer),
            dev_mode_active: Boolean(data.user.dev_mode_active)
          };
          setUser(profile);
          sessionStorage.setItem('axios_user_profile', JSON.stringify(profile));
          return;
        }
      }

      // Clear volatile state if unauthorized
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem('axios_user_profile');
        sessionStorage.removeItem('SIGIL_SANDBOX_AUTH');
        setUser(null);
        return;
      }

      throw new Error('Gateway Offline');
    } catch (err) {
      // Fallback to cached session if the backend network drops
      const cached = sessionStorage.getItem('axios_user_profile');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
          return;
        } catch {}
      }

      // Ephemeral sandbox fallback for offline development
      if (sessionStorage.getItem('SIGIL_SANDBOX_AUTH') === 'true') {
        console.warn('Enclave server offline. Emulating persistence check layout properties.');
        setUser({
          id: 'usr-dev-001',
          full_name: 'Lead Enclave Operator',
          email: 'dev@axiosigil.internal',
          role: 'admin',
          company_id: 'SIGIL_SANDBOX_DEV',
          is_developer: true,
          dev_mode_active: true
        });
        return;
      }

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncSessionIdentity();
  }, []);

  const login = (profile: UserProfile) => {
    if (profile.id === 'usr-dev-001') {
      sessionStorage.setItem('SIGIL_SANDBOX_AUTH', 'true');
    }
    sessionStorage.setItem('axios_user_profile', JSON.stringify(profile));
    setUser(profile);
    setIsLoading(false);
  };

  const logout = () => {
    sessionStorage.removeItem('SIGIL_SANDBOX_AUTH');
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