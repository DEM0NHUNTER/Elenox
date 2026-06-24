/**
Sovereign Tenant Registration Node.
Manages identity registration requests, executes strict multi-tenant
partition validation, and maps payloads to FastAPI Form requirements.
Updated: Migrated to semantic Tailwind theme classes for full palette integration.
*/
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Lock, Mail, Loader2, ShieldAlert, User, Building, UserPlus, ChevronLeft } from 'lucide-react';

export default function RegisterCompany(): React.JSX.Element {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const secureTenantCode = useMemo(() => {
    return companyId.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase().trim();
  }, [companyId]);

  const isFormValid = useMemo(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (
      fullName.trim().length >= 2 &&
      secureTenantCode.length >= 3 &&
      emailRegex.test(email) &&
      password.length >= 12 &&
      password === confirmPassword &&
      captchaToken !== null &&
      agreedToTerms
    );
  }, [fullName, secureTenantCode, email, password, confirmPassword, captchaToken, agreedToTerms]);

  const handleRegistrationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setRegistrationError(null);

    try {
      const payload = new URLSearchParams();
      payload.append('company_name', secureTenantCode);
      payload.append('admin_email', email.toLowerCase().trim());
      payload.append('admin_password', password);
      payload.append('captcha_token', captchaToken || '');
      payload.append('terms_accepted_at', new Date().toISOString());

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('REGISTRATION_REJECTED: Operator identifier or tenant space already allocated.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'GATEWAY_FAULT: Perimeter orchestrator rejected partition request.');
      }

      navigate('/login');
    } catch (err: any) {
      setRegistrationError(err?.message || 'CRITICAL: Structural boundary isolation allocation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background font-mono flex flex-col text-xs text-foreground select-none relative overflow-x-hidden">
      <div className="absolute top-6 left-6 z-50">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Landing
        </Link>
      </div>

      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(110, 86, 207, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(110, 86, 207, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="flex-1 flex items-center justify-center p-6 relative z-10 my-8">
        <div className="w-full max-w-sm border border-border rounded-xl p-6 bg-card space-y-5 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary rounded-t-xl" />

          <div className="border-b border-border pb-4 text-center space-y-1">
            <div className="mx-auto w-9 h-9 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(110,86,207,0.1)]">
              <UserPlus className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-bold text-foreground uppercase tracking-widest text-sm">Enclave Space Request</h3>
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Allocate dynamic isolation capabilities</p>
          </div>

          <form onSubmit={handleRegistrationRequest} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Full Name</label>
              <div className="relative flex items-center bg-input rounded-lg border border-border focus-within:border-primary/50 px-3 py-2 transition-colors">
                <User className="w-3.5 h-3.5 text-muted-foreground mr-2.5 shrink-0" />
                <input type="text" required value={fullName} disabled={isSubmitting} onChange={(e) => setFullName(e.target.value)} placeholder="FIRST LAST" className="bg-transparent text-foreground border-none outline-none tracking-wide placeholder:text-muted-foreground w-full focus:ring-0 uppercase text-[11px]" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Company Name</label>
              <div className="relative flex items-center bg-input rounded-lg border border-border focus-within:border-primary/50 px-3 py-2 transition-colors">
                <Building className="w-3.5 h-3.5 text-muted-foreground mr-2.5 shrink-0" />
                <input type="text" required value={companyId} disabled={isSubmitting} onChange={(e) => setCompanyId(e.target.value)} placeholder="ORG_PARTITION_ID" className="bg-transparent text-foreground border-none outline-none tracking-wide placeholder:text-muted-foreground w-full focus:ring-0 uppercase text-[11px]" />
              </div>
              {companyId && companyId !== secureTenantCode && (
                <p className="text-[9px] text-primary font-bold mt-1 uppercase tracking-tight">Sanitizing Key: {secureTenantCode}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Administrative Email</label>
              <div className="relative flex items-center bg-input rounded-lg border border-border focus-within:border-primary/50 px-3 py-2 transition-colors">
                <Mail className="w-3.5 h-3.5 text-muted-foreground mr-2.5 shrink-0" />
                <input type="email" required value={email} disabled={isSubmitting} onChange={(e) => setEmail(e.target.value)} placeholder="ADMIN@AXIOSIGIL.INTERNAL" className="bg-transparent text-foreground border-none outline-none tracking-wide placeholder:text-muted-foreground w-full focus:ring-0 uppercase text-[11px]" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Passphrase (Min 12 Chars)</label>
              <div className="relative flex items-center bg-input rounded-lg border border-border focus-within:border-primary/50 px-3 py-2 transition-colors">
                <Lock className="w-3.5 h-3.5 text-muted-foreground mr-2.5 shrink-0" />
                <input type="password" required value={password} disabled={isSubmitting} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••••••" className="bg-transparent text-foreground border-none outline-none tracking-widest placeholder:text-muted-foreground w-full focus:ring-0 text-[11px]" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Confirm Passphrase</label>
              <div className="relative flex items-center bg-input rounded-lg border border-border focus-within:border-primary/50 px-3 py-2 transition-colors">
                <Lock className="w-3.5 h-3.5 text-muted-foreground mr-2.5 shrink-0" />
                <input type="password" required value={confirmPassword} disabled={isSubmitting} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••••••••••" className="bg-transparent text-foreground border-none outline-none tracking-widest placeholder:text-muted-foreground w-full focus:ring-0 text-[11px]" />
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer mt-4 group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input type="checkbox" required checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="peer appearance-none w-3.5 h-3.5 border border-border rounded-sm bg-input checked:bg-primary checked:border-primary transition-all cursor-pointer outline-none focus:ring-2 focus:ring-primary/30" />
                <svg className="absolute w-2.5 h-2.5 text-primary-foreground pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[10px] text-muted-foreground leading-relaxed tracking-wide">
                I accept the <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</Link>, and consent to the defined Sovereign AI telemetry boundaries.
              </span>
            </label>

            <div className="flex justify-center mt-2 scale-90 sm:scale-100 origin-center">
              <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'dummy-key'} onChange={(token) => setCaptchaToken(token)} />
            </div>

            {registrationError && (
              <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive flex items-start gap-2.5 font-medium animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{registrationError}</span>
              </div>
            )}

            <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(110,86,207,0.1)] enabled:cursor-pointer disabled:cursor-not-allowed mt-4">
              {isSubmitting ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Generating Crypto Matrix...</span></>
              ) : (
                <span>Deploy Vault</span>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-border/60 flex justify-center text-[10px] text-muted-foreground font-mono uppercase tracking-tight">
            <Link to="/login" className="text-primary/80 hover:text-primary transition-colors">[ Existing Account? Login ]</Link>
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