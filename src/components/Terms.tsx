/**
 * Global Enterprise Terms of Service component.
 */
import React from 'react';
import { Shield, ChevronLeft, Scale, AlertTriangle, Server, XCircle, Globe, CreditCard, Copyright } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import LegalFooter from './LegalFooter';

export default function Terms(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.returnPath || '/';

  return (
    <div className="min-h-screen flex flex-col font-mono bg-background text-muted-foreground">
      <header className="px-8 py-6 border-b z-10 sticky top-0 backdrop-blur-md border-primary/20 bg-card/90">
        <button onClick={() => navigate(returnPath)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest hover:text-foreground transition-colors mb-4 text-primary">
          <ChevronLeft className="w-4 h-4" /> Return to Application
        </button>
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold uppercase tracking-widest text-foreground">Master Software License & Terms of Service</h1>
        </div>
        <p className="text-[10px] mt-2 text-muted-foreground uppercase tracking-widest">Last Updated: June 10, 2026</p>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-12">
        <div className="space-y-12 text-sm leading-relaxed">

          <section className="p-5 border rounded-sm bg-chart-2/5 border-chart-2">
            <h2 className="text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2 text-chart-2">
              <AlertTriangle className="w-4 h-4" /> Binding Agreement Notice
            </h2>
            <p className="text-xs text-foreground">
              These Terms of Service ("Agreement") constitute a legally binding contract between AxioSigil ("Company") and the entity or individual deploying or utilizing the software infrastructure ("Client"). By initializing, deploying, or logging into the AxioSigil containerized environment via the "Click-Wrap" acceptance gate, you unconditionally agree to be bound by this Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest flex items-center gap-2 border-b pb-2 text-foreground border-border">
              <Server className="w-5 h-5 text-muted-foreground" /> 1. Nature of the Software & Architecture
            </h2>
            <p className="mb-3">
              <strong>1.1. Sovereign Infrastructure:</strong> AxioSigil is provided as a decentralized, self-hosted, air-gapped software infrastructure package. We provide the containerized codebase, user interface, and orchestration logic.
            </p>
            <p>
              <strong>1.2. Zero Data Exhaust:</strong> The Company does not host, monitor, parse, or transmit your proprietary data to external cloud providers. The Client is solely responsible for providing, securing, and maintaining the physical or virtual host infrastructure upon which AxioSigil is deployed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest flex items-center gap-2 border-b pb-2 text-foreground border-border">
              <Scale className="w-5 h-5 text-muted-foreground" /> 2. Data Protection & Sovereignty (GDPR & PDPL)
            </h2>
            <p className="mb-3">
              <strong>2.1. Roles of the Parties:</strong> Under the EU General Data Protection Regulation (GDPR) and UAE Federal Decree-Law No. 45 of 2021 (PDPL), the Client acts exclusively as the <strong>Data Controller</strong>. Because the software runs entirely within the Client’s isolated perimeter, the Company does not act as a Data Processor and has no visibility of Client data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest flex items-center gap-2 border-b pb-2 text-foreground border-border">
              <AlertTriangle className="w-5 h-5 text-muted-foreground" /> 3. Stochastic Generation & Hallucination Disclaimer
            </h2>
            <p className="mb-3">
              <strong>3.1. Probabilistic Outputs:</strong> AxioSigil integrates Large Language Models (LLMs) which operate as probabilistic engines. The Company <strong>does not guarantee</strong> the absolute mathematical, factual, or contextual accuracy of any generated text.
            </p>
            <p>
              <strong>3.2. Human-in-the-Loop Requirement:</strong> Artificial Intelligence outputs must not be used as the sole basis for high-consequence operational, financial, medical, or legal decisions. The Company explicitly disclaims all liability for errors, omissions, or downstream losses resulting from system-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest flex items-center gap-2 border-b pb-2 text-foreground border-border">
              <Copyright className="w-5 h-5 text-muted-foreground" /> 4. Intellectual Property & Data Ownership
            </h2>
            <p className="mb-3">
              <strong>4.1. Client Data:</strong> The Client retains all right, title, and interest in and to all input data, documents, and proprietary vectors uploaded to the system.
            </p>
            <p>
              <strong>4.2. Generated Outputs:</strong> Subject to the Client's compliance with this Agreement, the Client is granted ownership of the specific outputs generated by the software for their internal business use. The Company claims no ownership over Client-specific RAG pipeline generations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest flex items-center gap-2 border-b pb-2 text-foreground border-border">
              <CreditCard className="w-5 h-5 text-muted-foreground" /> 5. SaaS Billing, Quotas & Suspensions
            </h2>
            <p className="mb-3">
              <strong>5.1. Subscription Quotas:</strong> Accounts operating under Cloud SaaS tiers are subject to strict monthly query and storage quotas. Exceeding these thresholds will result in immediate API restriction until the subsequent billing cycle or an account upgrade is executed.
            </p>
            <p>
              <strong>5.2. Termination for Cause:</strong> The Company reserves the right to immediately suspend or terminate access without refund if the Client violates the Acceptable Use Policy, fails to remit payment, or attempts to circumvent quota enforcement parameters.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest flex items-center gap-2 border-b pb-2 text-foreground border-border">
              <Globe className="w-5 h-5 text-muted-foreground" /> 6. Export Compliance & Acceptable Use
            </h2>
            <p className="mb-3">
              <strong>6.1. Sanctions Compliance:</strong> The Software incorporates cryptographic routing which may be subject to export controls. The Client warrants they are not located in, under the control of, or a national of any country subject to comprehensive US, EU, or UN sanctions.
            </p>
            <p>
              <strong>6.2. Prohibited Uses:</strong> The Client shall not utilize AxioSigil to process classified defense articles, facilitate illegal activities, generate sexually explicit material, or engage in automated phishing/social engineering.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest flex items-center gap-2 border-b pb-2 text-foreground border-border">
              <XCircle className="w-5 h-5 text-muted-foreground" /> 7. Limitation of Liability & Governing Law
            </h2>
            <p className="mb-3">
              <strong>7.1. "AS IS" Delivery:</strong> THE SOFTWARE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
            </p>
            <p className="mb-3">
              <strong>7.2. Liability Cap:</strong> IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES. The Company's total cumulative liability shall strictly not exceed the total amount paid by the Client to the Company in the twelve (12) months preceding the claim.
            </p>
            <p className="mb-3">
              <strong>7.3. Governing Law:</strong> This Agreement shall be governed by and construed in accordance with the laws of [INSERT SPECIFIC JURISDICTION, e.g., the State of Delaware], without regard to its conflict of law principles.
            </p>
            <p>
              <strong>7.4. Dispute Resolution:</strong> Any dispute arising out of this Agreement shall be resolved exclusively through final and binding arbitration in [INSERT CITY, JURISDICTION]. The Client expressly waives any right to participate in a class action lawsuit or class-wide arbitration.
            </p>
          </section>

        </div>
      </main>

      <LegalFooter />
    </div>
  );
}