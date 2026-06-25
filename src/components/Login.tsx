/**
Core application gateway login component.
Authenticates client handshakes and handles state shakes during interface rejections.
Explicitly routes to the secure /dashboard upon successful verification.
Updated: Integrates API_BASE routing and tunnel security bypass headers for decoupled Vercel deployments.
*/
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Lock, Terminal, Activity, ChevronLeft, Loader2, KeyRound } from 'lucide-react';
import { useTextScramble } from '../hooks/useTextScramble';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config'; // Injected the routing matrix

export default function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const scrambledError = useTextScramble(errorMsg, !!errorMsg, 300);

  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => setIsShaking(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      // Targeted Edit: Route through API_BASE and apply the Ngrok HTML bypass header
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);
        toast.success('Zero-trust session established.', {
          style: { background: '#6e56cf', color: '#FFFFFF' },
        });
        navigate('/dashboard', { replace: true });
      } else {
        setIsShaking(true);
        setErrorMsg(data.detail || 'INVALID_SIGNATURE: Master Orchestrator rejected handshake.');
      }
    } catch {
      setIsShaking(true);
      setErrorMsg('NETWORK_FAULT: Telemetry endpoint unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background font-mono flex flex-col text-xs text-foreground select-none relative overflow-x-hidden">
      <div className="absolute top-6 left-6 z-50">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to HomePage
        </Link>
      </div>

      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(110, 86, 207, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(110, 86, 207, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className={`w-full max-w-sm border border-border rounded-xl p-6 bg-card space-y-5 shadow-2xl transition-transform duration-75 ${isShaking ? 'translate-x-[-6px] rotate-[-1deg]' : ''}`}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary rounded-t-xl" />

          <div className="border-b border-border pb-4 text-center space-y-1">
            <div className="mx-auto w-9 h-9 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(110,86,207,0.1)]">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-bold text-card-foreground uppercase tracking-widest text-sm">Login Portal</h3>
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-1.5 mt-1">
              <Activity className="w-3 h-3 text-primary animate-pulse" /> Active Security Handshake
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Email</label>
              <div className="relative flex items-center bg-input rounded-lg border border-border focus-within:border-primary/50 px-3 py-2 transition-colors">
                <Terminal className="w-3.5 h-3.5 text-muted-foreground mr-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ADMIN@AXIOSIGIL.INTERNAL"
                  className="bg-transparent text-foreground border-none outline-none tracking-wide placeholder:text-muted-foreground w-full focus:ring-0 uppercase text-[11px]"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Passphrase</label>
              <div className="relative flex items-center bg-input rounded-lg border border-border focus-within:border-primary/50 px-3 py-2 transition-colors">
                <KeyRound className="w-3.5 h-3.5 text-muted-foreground mr-2.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="bg-transparent text-foreground border-none outline-none tracking-widest placeholder:text-muted-foreground w-full focus:ring-0 text-[11px]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive flex items-start gap-2.5 font-medium animate-in fade-in duration-200">
                <Terminal className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="leading-relaxed whitespace-pre-wrap">&gt; {scrambledError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(110,86,207,0.1)] enabled:cursor-pointer disabled:cursor-not-allowed disabled:border disabled:border-border mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-border/60 flex justify-center text-[10px] text-muted-foreground font-mono uppercase tracking-tight">
            <Link to="/register" className="text-primary/80 hover:text-primary transition-colors">
              [ Don't have an account? Register]
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full pb-8 pt-4 flex justify-center gap-8 text-[10px] font-mono tracking-widest uppercase text-muted-foreground z-50 relative">
        <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        <Link to="/security" className="hover:text-primary transition-colors">Security Protocol</Link>
      </div>
    </div>
  );
}