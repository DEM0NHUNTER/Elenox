/**
 * Root Application router wrapper.
 * Organizes path structures and isolates active layouts using a strict authentication boundary.
 */
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Landing from './components/Landing';
import Login from './components/Login';
import RegisterCompany from './components/RegisterCompany';
import Dashboard from './components/Dashboard';
import VerifyEmail from './components/VerifyEmail';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Security from './components/Security';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useApi } from './utils/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface RequireAuthProps {
  children: React.ReactNode;
}

function RequireAuth({ children }: RequireAuthProps): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E17]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F0FF]" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRouter(): React.JSX.Element {
  const apiFetch = useApi();
  const [deploymentMode, setDeploymentMode] = useState<'SAAS' | 'ENTERPRISE' | null>(null);

  useEffect(() => {
    // Fetch the architectural mode from the backend on initial load
    apiFetch('/api/system/mode')
      .then((res) => {
        if (!res.ok) throw new Error('System configuration unreachable');
        return res.json();
      })
      .then((data: { mode: string; version: string }) => {
        if (data.mode === 'SAAS' || data.mode === 'ENTERPRISE') {
          setDeploymentMode(data.mode);
        } else {
          setDeploymentMode('ENTERPRISE');
        }
      })
      .catch(() => {
        // Fail-safe security state: Default to closed Enterprise mode if network or backend fails
        setDeploymentMode('ENTERPRISE');
      });
  }, [apiFetch]);

  if (!deploymentMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E17]">
        <div className="animate-pulse w-8 h-8 rounded-full bg-[#00F0FF]/50" />
      </div>
    );
  }

  const isEnterprise = deploymentMode === 'ENTERPRISE';

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0A0E17',
            color: '#00F0FF',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            fontFamily: 'monospace',
            fontSize: '12px',
          },
        }}
      />
      <Routes>
        {/* ── Dynamic Public Boundaries ── */}
        <Route
          path="/"
          element={isEnterprise ? <Navigate to="/login" replace /> : <Landing />}
        />

        <Route path="/login" element={<Login />} />

        {/* Conditional Route Tree Generation */}
        {!isEnterprise ? (
          <>
            <Route path="/register" element={<RegisterCompany />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/security" element={<Security />} />
          </>
        ) : (
          <>
            {/* Catch-all explicitly mapping SaaS routes to secure login under Enterprise mode */}
            <Route path="/register" element={<Navigate to="/login" replace />} />
            <Route path="/verify" element={<Navigate to="/login" replace />} />
            <Route path="/terms" element={<Navigate to="/login" replace />} />
            <Route path="/privacy" element={<Navigate to="/login" replace />} />
            <Route path="/security" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* ── Secure Application Boundary ── */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}