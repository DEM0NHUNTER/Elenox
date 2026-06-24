/**
Premium glassmorphic conversion modal.
Captures deployment preferences to qualify high-compliance enterprise leads.
Updated: Replaced legacy CSS class dependencies with semantic Tailwind theme utilities.
*/
import { useState, useEffect } from 'react';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestAccessModal = ({ isOpen, onClose }: RequestAccessModalProps) => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [mode, setMode] = useState<'enterprise' | 'saas'>('enterprise');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail(''); setCompany(''); setIsSuccess(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={handleClose}>
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-xl" onClick={handleClose}>✕</button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-2xl text-primary">✓</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Access Request Received</h3>
            <p className="text-muted-foreground text-sm">Our sovereign deployment team will contact you shortly to verify your compliance requirements.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-foreground mb-2">Request Sovereign Access</h3>
            <p className="text-muted-foreground text-sm mb-6">Join the vanguard of high-compliance organizations verifying their AI.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="email" placeholder="Corporate Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder="Organization Name" required value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />

              <div className="flex bg-muted rounded-lg p-1 mb-2">
                <button type="button" className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'enterprise' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setMode('enterprise')}>Air-Gapped</button>
                <button type="button" className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'saas' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setMode('saas')}>Sovereign SaaS</button>
              </div>

              <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Request Deployment'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestAccessModal;