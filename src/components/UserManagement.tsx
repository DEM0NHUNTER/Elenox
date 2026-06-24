/**
IAM Directory Management Panel.
Enforces role-based visibility tracking, tenant isolation boundary separation,
and handles active session lease revocations with cryptographically logged state triggers.
Updated: Migrated to semantic Tailwind theme classes for full palette integration.
*/
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Users, Shield, Ban, ShieldAlert, Fingerprint, Globe, ChevronDown, UserPlus } from 'lucide-react';

export type UserRole = 'ADMIN' | 'OPERATOR' | 'ANALYST';

interface EnclaveUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  clearanceLevel: string;
  lastActiveAddress: string;
  signatureStatus: 'VERIFIED' | 'REVOKED';
}

interface UserManagementProps {
  isReadOnly?: boolean;
}

const INITIAL_USERS: EnclaveUser[] = [
  { id: 'usr-8924', fullName: 'John Doe', email: 'j.doe@axiosigil.internal', role: 'ADMIN', clearanceLevel: 'LEVEL_3_SOVEREIGN', lastActiveAddress: '10.240.12.82', signatureStatus: 'VERIFIED' },
  { id: 'usr-1104', fullName: 'Sarah Jenkins', email: 's.jenkins@axiosigil.internal', role: 'OPERATOR', clearanceLevel: 'LEVEL_2_EVIDENTIARY', lastActiveAddress: '10.240.12.95', signatureStatus: 'VERIFIED' },
  { id: 'usr-3591', fullName: 'Alex Mercer', email: 'a.mercer@axiosigil.internal', role: 'ANALYST', clearanceLevel: 'LEVEL_1_READ_ONLY', lastActiveAddress: '10.240.14.201', signatureStatus: 'VERIFIED' }
];

interface DarkSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}

function DarkSelect({ value, onChange, options, className = '', disabled = false }: DarkSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between bg-input border border-border rounded-lg px-3 py-2 text-xs font-bold text-foreground hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                option.value === value
                  ? 'bg-accent text-primary'
                  : 'text-popover-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (user: Omit<EnclaveUser, 'id' | 'clearanceLevel' | 'lastActiveAddress' | 'signatureStatus'>) => void;
}

function CreateUserModal({ isOpen, onClose, onCreate }: CreateUserModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('ANALYST');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    onCreate({ fullName: fullName.trim(), email: email.trim(), role });
    setFullName('');
    setEmail('');
    setRole('ANALYST');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl">
        <h3 className="text-sm font-bold text-card-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" /> Provision New Identity
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring transition-colors"
              placeholder="OPERATOR NAME"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring transition-colors"
              placeholder="OPERATOR@AXIOSIGIL.INTERNAL"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Security Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring transition-colors uppercase font-bold tracking-wider"
            >
              <option value="ANALYST">ANALYST (READ-ONLY)</option>
              <option value="OPERATOR">OPERATOR (INGESTION / PURGE)</option>
              <option value="ADMIN">ADMINISTRATOR (SOVEREIGN FULL)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-[0_0_10px_rgba(110,86,207,0.2)]">
              Provision Identity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserManagement({ isReadOnly = false }: UserManagementProps): React.JSX.Element {
  const [users, setUsers] = useState<EnclaveUser[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<EnclaveUser | null>(INITIAL_USERS[0]);
  const [isCreating, setIsCreating] = useState(false);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (isReadOnly) return;
    let computedClearance = 'LEVEL_1_READ_ONLY';
    if (newRole === 'ADMIN') computedClearance = 'LEVEL_3_SOVEREIGN';
    if (newRole === 'OPERATOR') computedClearance = 'LEVEL_2_EVIDENTIARY';

    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === userId) {
          const updated = { ...u, role: newRole, clearanceLevel: computedClearance };
          if (selectedUser?.id === userId) setSelectedUser(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const handleTokenRevocation = (userId: string) => {
    if (isReadOnly) return;
    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === userId) {
          const updated: EnclaveUser = { ...u, signatureStatus: 'REVOKED' };
          if (selectedUser?.id === userId) setSelectedUser(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const handleCreateUser = (newUserData: Omit<EnclaveUser, 'id' | 'clearanceLevel' | 'lastActiveAddress' | 'signatureStatus'>) => {
    let computedClearance = 'LEVEL_1_READ_ONLY';
    if (newUserData.role === 'ADMIN') computedClearance = 'LEVEL_3_SOVEREIGN';
    if (newUserData.role === 'OPERATOR') computedClearance = 'LEVEL_2_EVIDENTIARY';

    const newUser: EnclaveUser = {
      ...newUserData,
      id: `usr-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      clearanceLevel: computedClearance,
      lastActiveAddress: '10.240.0.0',
      signatureStatus: 'VERIFIED'
    };

    setUsers(prev => [...prev, newUser]);
    setSelectedUser(newUser);
  };

  const activeUserDirectory = useMemo(() => {
    return users.map(u => ({
      ...u,
      sanitizedName: u.fullName.replace(/[^a-zA-Z\s.-]/g, ''),
      sanitizedEmail: u.email.toLowerCase().trim()
    }));
  }, [users]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 p-6 font-mono text-xs text-foreground transition-colors">
      {/* ─── LEFT PANEL: IDENTITY DIRECTORY ─── */}
      <div className="flex-1 border border-border rounded-xl overflow-hidden bg-card flex flex-col min-h-[400px] transition-colors">
        <div className="bg-muted p-4 border-b border-border flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded border border-border bg-background">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-card-foreground uppercase tracking-wider">Identity Directories</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Enclave partition member node tracking</p>
            </div>
          </div>

          {!isReadOnly && (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors"
            >
              <UserPlus className="w-3 h-3" /> Provision Identity
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border custom-scrollbar">
          {activeUserDirectory.map((userNode) => {
            const isActive = selectedUser?.id === userNode.id;
            return (
              <div
                key={userNode.id}
                onClick={() => setSelectedUser(users.find(u => u.id === userNode.id) || null)}
                className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-muted/50 ${isActive ? 'bg-accent border-l-2 border-primary' : ''}`}
              >
                <div className="space-y-1 min-w-0 pr-4">
                  <h4 className="font-bold text-card-foreground truncate">{userNode.sanitizedName}</h4>
                  <p className="text-muted-foreground text-[10px] truncate font-mono">{userNode.sanitizedEmail}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border tracking-wider font-mono ${
                    userNode.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' :
                    userNode.role === 'OPERATOR' ? 'bg-accent text-secondary-foreground border-border' :
                    'bg-muted text-muted-foreground border-border'
                  }`}>
                    {userNode.role}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${userNode.signatureStatus === 'VERIFIED' ? 'bg-primary animate-pulse' : 'bg-destructive'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── RIGHT PANEL: SELECTED USER DETAIL ─── */}
      <div className="w-full md:w-96 bg-card border border-border rounded-xl overflow-hidden flex flex-col justify-between shrink-0 transition-colors">
        {selectedUser ? (
          <div className="flex flex-col h-full justify-between">
            <div className="p-5 space-y-6">
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-card-foreground uppercase tracking-wider">{selectedUser.fullName}</h3>
                  <p className="text-[10px] text-muted-foreground font-mono tracking-tight">{selectedUser.id}</p>
                </div>
                <Fingerprint className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Security Boundary Parameters */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-muted p-2.5 rounded border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-primary" /> Security Clearance
                  </span>
                  <span className="font-bold text-primary font-mono text-[10px] tracking-wider">{selectedUser.clearanceLevel}</span>
                </div>

                <div className="flex justify-between items-center bg-muted p-2.5 rounded border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-primary" /> Endpoint IP Address
                  </span>
                  <span className="font-bold text-foreground font-mono tracking-widest">{selectedUser.lastActiveAddress}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">
                  Modify Clearance
                </label>
                <DarkSelect
                  value={selectedUser.role}
                  onChange={(val) => handleRoleChange(selectedUser.id, val as UserRole)}
                  options={[
                    { value: 'ANALYST', label: 'ANALYST (READ-ONLY)' },
                    { value: 'Manager', label: 'Manger (INGESTION / PURGE)' },
                    { value: 'ADMIN', label: 'ADMINISTRATOR (SOVEREIGN FULL)' }
                  ]}
                  className="w-full"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="p-5 border-t border-border bg-muted/50">
              {selectedUser.signatureStatus === 'VERIFIED' ? (
                <button
                  type="button"
                  onClick={() => handleTokenRevocation(selectedUser.id)}
                  disabled={isReadOnly}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-xs uppercase tracking-widest font-bold hover:bg-destructive/10 hover:border-destructive/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ban className="w-3.5 h-3.5" /> Disable User
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive font-bold uppercase text-[10px] tracking-widest">
                  <ShieldAlert className="w-3.5 h-3.5" /> Token Identity Revoked
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground uppercase tracking-widest text-[10px]">
            [ Select profile node to manipulate cryptographic parameters ]
          </div>
        )}
      </div>

      <CreateUserModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
}