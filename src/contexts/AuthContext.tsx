/**
 * Security Route Interceptor.
 * Patched for UI Development Mode to ensure public screens do not trigger loops.
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute(): React.JSX.Element {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Define explicitly public routes that must NEVER be trapped by the security guard
  const publicPaths = ['/', '/login', '/register', '/terms', '/privacy', '/security'];

  if (publicPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
        Synchronizing UI Layer State...
      </div>
    );
  }

  // If no mock user is assigned and they are trying to view protected assets, route to login portal
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}