/**
 * Billing Management Interface for Tenant Administrators.
 * Interfaces with Stripe Checkout to securely handle SaaS tier upgrades.
 */
import React, { useState } from 'react';
import { CreditCard, CheckCircle, Server, Shield, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useApi } from '../utils/api';
import { colors, alpha } from '../theme/theme';

interface BillingManagerProps {
  currentTier: string;
}

export default function BillingManager({ currentTier }: BillingManagerProps): React.JSX.Element {
  const apiFetch = useApi();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    const loadingToast = toast.loading('Initializing secure payment gateway...');

    try {
      const res = await apiFetch('/api/billing/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ plan_tier: 'professional' })
      });

      if (!res.ok) {
        throw new Error('Failed to reach payment provider. Please try again.');
      }

      const data = await res.json();
      // Redirect the user entirely to the hosted Stripe Checkout URL
      window.location.href = data.checkout_url;

    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-500" /> Current Plan Deployment
          </h3>
          <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
            Your organization is currently operating on the <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">{currentTier}</span> tier.
          </p>
        </div>

        {currentTier.toLowerCase() !== 'professional' && (
          <Button onClick={handleUpgrade} disabled={isProcessing} className="shrink-0 group">
            {isProcessing ? 'Connecting...' : 'Upgrade to Professional'}
            {!isProcessing && <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        )}
      </Card>

      {/* Feature Breakdown Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border space-y-4" style={{ backgroundColor: alpha(colors.bgSecondary, 0.5), borderColor: colors.border }}>
          <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.textTertiary }}>Pilot (Free)</h4>
          <ul className="space-y-2 text-xs font-medium" style={{ color: colors.textSecondary }}>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" style={{ color: colors.accentGreen }} /> 100 LLM Queries / Month</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" style={{ color: colors.accentGreen }} /> 50MB Vault Storage</li>
            <li className="flex items-center gap-2 opacity-50"><Shield className="w-3.5 h-3.5" /> No SLA Guarantee</li>
          </ul>
        </Card>

        <Card className="p-5 border space-y-4 relative overflow-hidden" style={{ backgroundColor: alpha(colors.accentCyan, 0.05), borderColor: colors.accentCyan }}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard className="w-16 h-16" style={{ color: colors.accentCyan }} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: colors.accentCyan }}>Professional (€199/mo)</h4>
          <ul className="space-y-2 text-xs font-medium relative z-10" style={{ color: colors.textPrimary }}>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" style={{ color: colors.accentCyan }} /> 5,000 LLM Queries / Month</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" style={{ color: colors.accentCyan }} /> 5GB Secure Vault Storage</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" style={{ color: colors.accentCyan }} /> Priority Email Support</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}