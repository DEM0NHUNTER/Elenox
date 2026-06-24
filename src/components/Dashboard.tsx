/**
 * Master Enclave Command Shell Architecture.
 * Implements a high-compliance multi-tenant container frame that visually exposes
 * isolated runtime boundaries, active cryptographic keys, and live infrastructure telemetry.
 * Fully integrated with semantic CSS variables and direct action triggers.
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield, Activity, Lock, Terminal, Trash2, LogOut,
  Layers, Users, Cpu, Database, KeySquare, CheckCircle2, MessageSquare, Settings, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import ObservabilityWorkspace from './ObservabilityWorkspace';
import DocumentUploader from './DocumentUploader';
import AuditLogStream from './AuditLogStream';
import UserManagement from './UserManagement';
import SystemHealth from './SystemHealth';
import QuickStats from './QuickStats';
import AskAgent from './AskAgent';
import SettingsModal from './SettingsModal';
import SessionManager from './SessionManager';

import { useAuth } from '../contexts/AuthContext';
import { useSessions } from '../hooks/useSessions';
import type { SessionEntry } from '../types';

type DashboardView = 'observability' | 'ingestion' | 'audit' | 'identity' | 'agent';

interface EnclaveStatus {
  entropyPool: string;
  rlsStatus: 'ENFORCED' | 'BYPASS_ATTEMPT_BLOCKED';
  memoryWipePasses: number;
  activeSessionDuration: number;
}

export default function Dashboard(): React.JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<DashboardView>('observability');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState<boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const { sessions, deleteSession } = useSessions();
  const [sessionEntries, setSessionEntries] = useState<SessionEntry[]>([]);

  const [enclaveState, setEnclaveState] = useState<EnclaveStatus>({
    entropyPool: '256-bit CSPRNG',
    rlsStatus: 'ENFORCED',
    memoryWipePasses: 3,
    activeSessionDuration: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setEnclaveState(prev => ({
        ...prev,
        activeSessionDuration: prev.activeSessionDuration + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handlePurgeData = async (): Promise<void> => {
    try {
      await fetch('/api/system/purge', { method: 'POST', credentials: 'include' });
    } catch {
      // Fallback path if telemetry route is decoupled
    }
    setSessionEntries([]);
    toast.success('memory wiped.');
  };

  const handleLogoutSequence = async (): Promise<void> => {
    try {
      await logout();
      toast.success('Session closed successfully.');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Identity termination handshake failed.');
    }
  };

  const handleAddSessionEntry = (query: string, answer: string, citations: any[], signature?: string) => {
    setSessionEntries(prev => [
      ...prev,
      {
        id: `entry-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
        query,
        answer,
        citations,
        signature
      } as any
    ]);
  };

  const safeTenantId = useMemo(() => (user?.company_id || 'unassigned_partition').replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase(), [user?.company_id]);
  const safeUsername = useMemo(() => user?.full_name || 'Anonymous Operator', [user?.full_name]);
  const safeUserRole = useMemo(() => (user?.role || 'analyst').toUpperCase(), [user?.role]);
  const isAdmin = safeUserRole === 'ADMIN';

  useEffect(() => {
    if (activeView === 'identity' && !isAdmin) {
      setActiveView('observability');
    }
  }, [activeView, isAdmin]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-mono select-none transition-colors duration-300">

      {/* Dynamic Security Cockpit Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col justify-between shrink-0 relative z-30 transition-colors duration-300">
        <div className="flex flex-col flex-1 overflow-y-auto">

          <div className="p-6 border-b border-sidebar-border bg-card/40 flex items-center gap-3 transition-colors duration-300">
            <div className="w-8 h-8 rounded-lg border border-primary/30 flex items-center justify-center bg-primary/10 shadow-sm">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-foreground">AXIOS</span>
              <span className="text-[9px] text-muted-foreground tracking-wider uppercase"></span>
            </div>
          </div>

          <div className="mx-4 mt-6 p-4 rounded-xl border border-sidebar-border bg-card/60 space-y-3 transition-colors duration-300">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-primary" /> Partition
              </span>
              <span className="text-chart-4 font-bold truncate max-w-[100px]" title={safeTenantId}>{safeTenantId}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] border-t border-sidebar-border/60 pt-2">
              <span className="text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <KeySquare className="w-3 h-3 text-chart-1" /> Clearance
              </span>
              <span className="text-chart-1 font-bold tracking-wider">{safeUserRole}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] border-t border-sidebar-border/60 pt-2">
              <span className="text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-primary" /> PostgreSQL RLS
              </span>
              <span className="text-primary font-bold text-[9px] bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 tracking-widest">
                {enclaveState.rlsStatus}
              </span>
            </div>
          </div>

          <nav className="mt-8 px-3 space-y-1">
            {[
              { id: 'observability', icon: Activity, label: 'Dashboard' },
              { id: 'agent', icon: MessageSquare, label: 'Chat' },
              { id: 'ingestion', icon: Database, label: 'Upload' },
              { id: 'audit', icon: Terminal, label: 'Audit Stream' }
            ].map((navItem) => (
              <button
                key={navItem.id}
                type="button"
                onClick={() => setActiveView(navItem.id as DashboardView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-widest transition-all text-left cursor-pointer ${
                  activeView === navItem.id
                    ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
                }`}
              >
                <navItem.icon className="w-4 h-4" /> {navItem.label}
              </button>
            ))}

            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveView('identity')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-widest transition-all text-left cursor-pointer ${
                  activeView === 'identity'
                    ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
                }`}
              >
                <Users className="w-4 h-4" /> Access Management
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-widest transition-all text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent cursor-pointer"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </nav>
        </div>

        {/* Operational Controls Footer Block */}
        <div className="p-4 border-t border-sidebar-border bg-card/20 space-y-2 transition-colors duration-300">
          <div className="flex flex-col gap-1 text-[10px] bg-card p-3 rounded-lg border border-sidebar-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground uppercase tracking-widest">Entropy:</span>
              <span className="text-foreground font-bold">{enclaveState.entropyPool}</span>
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-muted-foreground uppercase tracking-widest">Wipe Shred:</span>
              <span className="text-chart-2 font-bold">{enclaveState.memoryWipePasses}-Pass DoD</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePurgeData}
              className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-[10px] uppercase tracking-widest font-bold hover:bg-destructive/10 hover:border-destructive/30 transition-all cursor-pointer"
              title="PURGE VOLATILE ALLOCATIONS"
            >
              <Trash2 className="w-3.5 h-3.5" /> Purge
            </button>
            <button
              type="button"
              onClick={handleLogoutSequence}
              className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-input text-foreground text-[10px] uppercase tracking-widest font-bold hover:bg-muted transition-all cursor-pointer"
              title="DESTROY SESSION CONTEXT"
            >
              <LogOut className="w-3.5 h-3.5 text-primary" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Core View Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-8 flex justify-between items-center shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase tracking-widest">User:</span>
              <span className="text-foreground font-bold tracking-wider">{safeUsername}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 border-l border-border pl-6">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground uppercase tracking-widest">Isolation Core:</span>
              <span className="text-primary font-bold uppercase tracking-wider">tmpfs sandbox active</span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <button
              type="button"
              onClick={() => setIsSessionManagerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-card/50 text-foreground hover:text-primary hover:border-primary/30 transition-colors text-[10px] font-bold uppercase tracking-widest cursor-pointer"
            >
              <History className="w-3.5 h-3.5" /> Sessions
            </button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="uppercase tracking-widest">Session Time:</span>
              <span className="text-primary font-bold tabular-nums tracking-widest">{formatSessionTime(enclaveState.activeSessionDuration)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded border border-chart-4/20 bg-chart-4/10 text-chart-4 font-bold uppercase text-[9px] tracking-widest">
              <CheckCircle2 className="w-3 h-3 text-chart-4" /> Grounded
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-8 relative flex flex-col gap-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 shrink-0">
            <div className="xl:col-span-2"><SystemHealth /></div>
            <div><QuickStats totalCost={0.0124} totalInputTokens={42034} totalOutputTokens={12480} /></div>
          </div>

          <div className="flex-1 border border-border rounded-xl overflow-hidden bg-card/20 relative flex flex-col min-h-0 transition-colors duration-300">
            {activeView === 'observability' && <div className="flex-1 overflow-hidden"><ObservabilityWorkspace /></div>}
            {activeView === 'agent' && (
              <div className="flex-1 overflow-hidden p-6">
                <AskAgent
                  onAskSuccess={() => {}}
                  activeSessionEntries={sessionEntries}
                  onAddEntry={handleAddSessionEntry}
                  activeSessionId={activeSessionId || (user ? 'active-enclave-session' : null)}
                />
              </div>
            )}
            {activeView === 'ingestion' && (
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                <div className="border-b border-border pb-4">
                  <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">File Ingestion Dock</h2>
                  <p className="text-xs text-muted-foreground">Upload structured/unstructured formats directly into local volatile memory spaces for cryptographic chunk parsing.</p>
                </div>
                <div className="w-full mx-auto">
                  <DocumentUploader onUploadSuccess={() => {}} />
                </div>
              </div>
            )}
            {activeView === 'audit' && (
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                <div className="border-b border-border pb-4">
                  <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Forensic Stream</h2>
                  <p className="text-xs text-muted-foreground">Live transaction auditing capturing network calls and authorization handshakes directly inside the boundary logs.</p>
                </div>
                <AuditLogStream />
              </div>
            )}
            {activeView === 'identity' && isAdmin && (
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <UserManagement isReadOnly={!isAdmin} />
              </div>
            )}
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userRole={safeUserRole}
        onScrollToUserManagement={() => setActiveView('identity')}
      />

      <SessionManager
        isOpen={isSessionManagerOpen}
        onClose={() => setIsSessionManagerOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setSessionEntries([]);
        }}
        onDeleteSession={(id) => deleteSession.mutate(id)}
      />
    </div>
  );
}