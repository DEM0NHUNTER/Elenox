/**
Static compliance statement specifying text isolation constraints.
Expanded to cover SaaS billing data processors (Stripe), Log Retention,
and mandatory Data Subject Request (DSR) contact mechanisms.
Updated: Removed hardcoded theme.ts imports in favor of semantic Tailwind classes.
*/
import React from 'react';
import { EyeOff, ChevronLeft, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import LegalFooter from './LegalFooter';

export default function Privacy(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.returnPath || '/';

  return (
    <div className="min-h-screen flex flex-col font-mono bg-background text-foreground">
      <header className="px-8 py-6 border-b z-10 border-primary/20 bg-card">
        <button onClick={() => navigate(returnPath)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest hover:text-primary transition-colors mb-4 text-primary">
          <ChevronLeft className="w-4 h-4" /> Return to Application
        </button>
        <div className="flex items-center gap-3">
          <EyeOff className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold uppercase tracking-widest text-card-foreground">Privacy Policy</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-12">
        <div className="space-y-8 text-sm leading-relaxed">
          <section className="p-4 border rounded-sm bg-primary/5 border-primary">
            <h2 className="text-xs font-bold mb-2 uppercase tracking-widest text-primary">Zero Data Exhaust Declaration</h2>
            <p>
              AxioSigil is engineered to be structurally incapable of exfiltrating your document vectors. We do not collect, process, or sell your proprietary documents or internal chat queries.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-widest text-card-foreground">1. Local Processing & Telemetry</h2>
            <p className="mb-3">
              All LLM inference occurs strictly via local nodes. Live metrics (traces, verification rates) are generated via OpenTelemetry arrays and broadcast exclusively over secure WebSockets within your tenant boundary. They are not synced to our external servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-widest text-card-foreground">2. SaaS Billing Sub-Processors</h2>
            <p>
              While your documents remain air-gapped, if you utilize our hosted SaaS tier, your account administrative data (Company Name, Admin Email) and payment methodologies are securely transmitted to our payment sub-processor (Stripe). We do not store raw credit card Primary Account Numbers (PANs) on AxioSigil servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-widest text-card-foreground">3. Data Subject Rights & Retention</h2>
            <p className="mb-3">
              Administrators retain the explicit right to access, rectify, or execute the "Total Annihilation Protocol" to erase their tenant environments entirely.
            </p>
            <p className="mb-3">
              <strong>Log Retention:</strong> Security audit logs charting account authentications and failed credential stuffing attempts are retained locally within your container parameters and are automatically rotated per your internal Docker configurations.
            </p>
            <p>
              <strong>Children's Privacy:</strong> Our services are strictly intended for enterprise and professional use. We do not knowingly collect personal information from children under the age of 16 (or 13 in the US, per COPPA).
            </p>
          </section>

          <section className="p-4 border rounded-sm border-border">
            <h2 className="text-lg font-bold mb-3 uppercase tracking-widest flex items-center gap-2 text-card-foreground">
              <Mail className="w-5 h-5 text-muted-foreground" /> 4. Contact & Data Subject Requests
            </h2>
            <p>
              To exercise your data rights or for privacy-related inquiries, please contact our Data Protection Officer at: <strong className="text-card-foreground">privacy@axiosigil.com</strong> {/* REPLACE WITH ACTUAL EMAIL */}
            </p>
          </section>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}