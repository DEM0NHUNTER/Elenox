/**
 * Route controller validating stateless query registration tokens.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export default function VerifyEmail(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }

    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => {
        setStatus('success');
        toast.success('Cryptographic identity verified.');
        setTimeout(() => navigate('/login'), 2500);
      })
      .catch(() => setStatus('error'));
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center font-mono p-6 bg-background">
      <Card className="w-full max-w-md p-6 text-center border-border bg-card">
        <h2 className="text-lg font-bold text-foreground uppercase tracking-wider mb-4">Verification Handshake</h2>
        <div className="inline-flex justify-center mb-2">
          {status === 'verifying' && <Badge variant="info">Executing validation...</Badge>}
          {status === 'success' && <Badge variant="success">Handshake valid. Routing...</Badge>}
          {status === 'error' && <Badge variant="error">Token assertion invalid or expired.</Badge>}
        </div>
        <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-widest">
          &gt; Secure Vault Deployment Loop
        </p>
      </Card>
    </div>
  );
}