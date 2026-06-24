/**
Industry Alignment Matrix.
Maps AxioSigil's zero-trust capabilities directly to the specific
compliance mandates and pain points of high-stakes enterprise sectors.
Updated: Replaced custom CSS classes with semantic Tailwind theme utilities.
*/
import React from 'react';

interface IndustryData {
  sector: string;
  icon: string;
  mandate: string;
  features: string[];
}

const industries: IndustryData[] = [
  {
    sector: 'Defense & Intelligence',
    icon: '🛡️',
    mandate: 'Absolute Air-Gapped Sovereignty',
    features: ['Local LLM Inference (Zero Cloud Dependency)', 'DoD-Style 3-Pass Secure Delete', 'Hardware-Agnostic CPU/GPU Profiles'],
  },
  {
    sector: 'Finance & M&A',
    icon: '📊',
    mandate: 'Cryptographic Audit & Zero Exfiltration',
    features: ['Ed25519 Signed Trace Logs', 'PostgreSQL RLS Multi-Tenancy', 'Ephemeral Object Vault (tmpfs)'],
  },
  {
    sector: 'Healthcare',
    icon: '🏥',
    mandate: 'HIPAA-Aligned Isolation & Precision',
    features: ['Tenant-Isolated Vector Spaces', 'Cross-Encoder Reranking (ms-marco)', 'Strict Data Boundary Enforcement'],
  },
  {
    sector: 'Legal & Compliance',
    icon: '⚖️',
    mandate: 'Verifiable Citations & Zero Hallucination',
    features: ['Hallucination X-Ray Forensics', 'Exact/Semantic/Numeric Match Scoring', 'Tamper-Proof Evidentiary Grounding'],
  },
];

export default function IndustryMatrix(): React.JSX.Element {
  return (
    <section id="industries" className="py-24 px-8 max-w-7xl mx-auto text-center relative bg-background">
      <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
        Engineered for High-Stakes Sectors
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
        AxioSigil is not a generic AI wrapper. It is a mathematically verifiable observability platform built for the strict compliance mandates of regulated industries.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-8">
        {industries.map((item) => (
          <div key={item.sector} className="bg-card border border-border rounded-2xl p-8 transition-all hover:border-primary/50 hover:bg-muted">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-lg font-semibold text-card-foreground">{item.sector}</h3>
            </div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-5">{item.mandate}</p>
            <ul className="flex flex-col gap-2">
              {item.features.map((feature) => (
                <li key={feature} className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="text-primary font-bold text-lg leading-none mt-0.5">›</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}