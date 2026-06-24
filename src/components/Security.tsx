/**
Public document detailing isolation constraints and container capabilities.
Expanded to cover Responsible Disclosure, Incident Response, External Audits,
and explicit Encryption standards.
Updated: Migrated to semantic Tailwind theme classes for full palette integration.
*/
import React from 'react';
import { Lock, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import LegalFooter from './LegalFooter';

export default function Security(): React.JSX.Element {
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
          <Lock className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold uppercase tracking-widest text-foreground">Security Protocol & SLA</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-12">
        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-widest text-foreground">1. Application Sandboxing</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Ephemeral Storage:</strong> All document parsing is processed in temporary file systems. Raw data is instantly shredded post-embedding.</li>
              <li><strong className="text-foreground">Least Privilege execution:</strong> Application containers execute under UID 10001. Root execution is mathematically prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-widest text-foreground">2. Cryptography & Annihilation</h2>
            <p className="mb-3 text-muted-foreground">
              Every RAG pipeline generation event is appended with an Ed25519 cryptographic hash, ensuring tamper-evident non-repudiation in the Audit Ledger.
            </p>
            <p className="mb-3 text-muted-foreground">
              The "Shred Vault" protocol initiates a hard-delete sequence across the Qdrant database, bypassing soft-deletion flags to physically overwrite multi-tenant partition sectors.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Encryption Standards:</strong> All data in transit is secured via TLS 1.3. Data at rest within the SaaS tier is encrypted using AES-256-GCM. Self-hosted deployments inherit the encryption standards configured by the Client's infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-widest text-foreground">3. Incident Response & Breach Notification</h2>
            <p className="text-muted-foreground">
              In the event of a confirmed vulnerability bypassing the isolation constraints of the SaaS environment, AxioSigil commits to an Incident Response SLA notifying the registered Administrative Email within seventy-two (72) hours of confirmed discovery, adhering strictly to GDPR notification standards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 uppercase tracking-widest text-foreground">4. Responsible Disclosure (Bug Bounty)</h2>
            <p className="text-muted-foreground">
              We authorize independent security researchers to conduct non-destructive testing against their own isolated instances. Researchers must not target adjacent tenant namespaces or execute Denial of Service (DoS) attacks against the API Gateway. Discoveries should be routed through our encrypted PGP channel.
            </p>
          </section>

          <section className="p-4 border rounded-sm flex items-start gap-3 border-border bg-muted/50">
            <ShieldCheck className="w-5 h-5 mt-0.5 text-primary" />
            <div>
              <h3 className="text-xs font-bold mb-1 uppercase tracking-widest text-primary">Compliance Alignment</h3>
              <p className="text-xs text-muted-foreground">
                Our security architecture is designed to align with SOC 2 Type II and ISO 27001 control frameworks. Enterprise clients may request our latest third-party penetration test summary under NDA.
              </p>
            </div>
          </section>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}