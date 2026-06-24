/**
 * Administrative Panel Control Component.
 * Synchronized with the global semantic CSS variable theme configurations and modular color profiles.
 * Includes asynchronous triggering for 30-day compliance audit generation.
 */
import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Bell, BellOff, Shield, Users, FlaskConical, Scale, CreditCard, Palette, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button } from './ui/Button';
import BillingManager from './BillingManager';
import { useSettings } from '../contexts/SettingsContext';
import { PaletteManager } from '../utils/PaletteManager';
import { useApi } from '../utils/api';
import type { PaletteType } from '../utils/PaletteManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  onScrollToUserManagement: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  userRole,
  onScrollToUserManagement,
}: SettingsModalProps): React.JSX.Element | null {
  const { theme, setTheme, notificationsEnabled, setNotificationsEnabled } = useSettings();
  const apiFetch = useApi();

  const [experimental, setExperimental] = useState(false);
  const [activePalette, setActivePalette] = useState<PaletteType>('default');
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing'>('profile');

  // Synchronize persisted state definitions on initialization
  useEffect(() => {
    const savedExperimental = localStorage.getItem('axiosigil_experimental');
    if (savedExperimental === 'true') setExperimental(true);

    // Mount localized data matrix for configuration profile switching
    setActivePalette(PaletteManager.getStoredPalette());
  }, []);

  const handleExperimentalToggle = (): void => {
    const newValue = !experimental;
    setExperimental(newValue);
    localStorage.setItem('axiosigil_experimental', String(newValue));
  };

  const handlePaletteChange = (palette: PaletteType): void => {
    setActivePalette(palette);
    PaletteManager.applyPalette(palette);
  };

  const handleGenerateReport = async (): Promise<void> => {
    const loadingToast = toast.loading('Aggregating tenant compliance data...');
    try {
      const res = await apiFetch('/api/compliance/report', { method: 'POST' });
      if (!res.ok) {
        if (res.status === 403) throw new Error('Manager or Admin clearance required.');
        throw new Error('Failed to dispatch aggregation task.');
      }
      toast.success('Compliance audit dispatched to processing pool.', { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.', { id: loadingToast });
    }
  };

  if (!isOpen) return null;
  const isAdmin = userRole.toUpperCase() === 'ADMIN';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div
        className="w-full max-w-md rounded-xl shadow-2xl border flex flex-col p-6 relative overflow-hidden bg-card border-border"
        style={{ maxHeight: '90vh' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close configuration modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> System Settings
        </h2>

        <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground">
              User Preferences
            </h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50 border-border"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span className="text-sm font-mono text-foreground">Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                </div>
                <span className="text-xs text-muted-foreground">Click to toggle</span>
              </button>

              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-full flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50 border-border"
              >
                <div className="flex items-center gap-3">
                  {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  <span className="text-sm font-mono text-foreground">Notifications: {notificationsEnabled ? 'On' : 'Off'}</span>
                </div>
                <span className="text-xs text-muted-foreground">Click to toggle</span>
              </button>

              {/* Modular Palette Switcher Selection Interface */}
              <div className="p-3 rounded-lg border border-border bg-background/30 space-y-2">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Palette className="w-4 h-4 text-primary" />
                  <span className="text-sm font-mono text-foreground">Color Profile Engine</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { id: 'default', label: 'Default Mode' },
                    { id: 'quantum-rose', label: 'Quantum Rose' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePaletteChange(p.id as PaletteType)}
                      className={`py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activePalette === p.id
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-shadow-color'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground">
                Administrative Controls
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'billing' ? 'profile' : 'billing')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50 ${activeTab === 'billing' ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-sm font-mono text-foreground">Billing Management</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono uppercase">{activeTab === 'billing' ? 'Open' : 'Close'}</span>
                </button>

                {activeTab === 'billing' && (
                  <div className="p-1 border border-border rounded-lg bg-background/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <BillingManager currentTier="Pilot" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => { onScrollToUserManagement(); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-muted/50 border-border"
                >
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-mono text-foreground">User Management Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={handleExperimentalToggle}
                  className="w-full flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50 border-border"
                >
                  <div className="flex items-center gap-3">
                    <FlaskConical className={`w-4 h-4 ${experimental ? 'text-chart-4' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-mono text-foreground">Experimental Features</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono uppercase">{experimental ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-muted-foreground">
              <Scale className="w-4 h-4" /> Legal & Compliance
            </h3>
            <div className="flex flex-col gap-3 ml-6">
              <Link to="/terms" state={{ returnPath: '/dashboard' }} onClick={onClose} className="text-[10px] uppercase font-mono hover:underline transition-all text-primary">Terms of Service</Link>
              <Link to="/privacy" state={{ returnPath: '/dashboard' }} onClick={onClose} className="text-[10px] uppercase font-mono hover:underline transition-all text-primary">Privacy Policy</Link>
              <Link to="/security" state={{ returnPath: '/dashboard' }} onClick={onClose} className="text-[10px] uppercase font-mono hover:underline transition-all text-primary">Security Protocol</Link>

              {isAdmin && (
                <div className="mt-2">
                  <Button variant="outline" size="sm" fullWidth onClick={handleGenerateReport}>
                    <FileText className="w-4 h-4 mr-2" /> GENERATE 30-DAY AUDIT REPORT
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex justify-end shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}