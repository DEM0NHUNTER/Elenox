/**
Role-Based Access Control perimeter route protection guard.
Intercepts navigation threads to hold page parsing layout blocks
until background authentication handshakes evaluate identity claims.
Updated: Migrated to semantic Tailwind theme classes for full palette integration.
*/
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-background font-mono flex flex-col items-center justify-center text-xs text-primary gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="uppercase tracking-widest animate-pulse">Synchronizing Security Enclave Matrix...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}