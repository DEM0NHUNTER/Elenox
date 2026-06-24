import { useState } from 'react';

type DeploymentMode = 'enterprise' | 'saas';

interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

/**
 * Interactive demonstrator for the Dual-Mode Architecture.
 * Allows users to toggle between SaaS and Enterprise Air-Gapped modes,
 * visually proving the platform's ability to adapt to strict compliance mandates.
 */
const DeploymentModeDemonstrator = () => {
  const [mode, setMode] = useState<DeploymentMode>('enterprise');

  const enterpriseFeatures: FeatureItem[] = [
    { icon: '🖥️', title: 'Local LLM Inference', desc: 'Qwen2.5:7b runs entirely on your local CPU/GPU with zero cloud dependency.' },
    { icon: '🗄️', title: 'Ephemeral tmpfs Vault', desc: 'Documents parsed in memory and destroyed via 3-pass DoD-style byte overwrite.' },
    { icon: '🔒', title: 'Air-Gapped Network', desc: 'Zero outbound connections required. Absolute data sovereignty maintained.' },
  ];

  const saasFeatures: FeatureItem[] = [
    { icon: '☁️', title: 'Managed Sovereign Cloud', desc: 'Tenant-isolated vector spaces with logical zero-trust boundaries and RLS.' },
    { icon: '💳', title: 'Cryptographic Billing', desc: 'Stripe webhook integration with Redis-backed quota rate-limiting.' },
    { icon: '🔑', title: 'Enterprise SSO Ready', desc: 'Seamless scaffolding for Okta, Entra ID, and custom SAML identity providers.' },
  ];

  const activeFeatures = mode === 'enterprise' ? enterpriseFeatures : saasFeatures;

  return (
    <section id="deployment" className="deployment-section">
      <h2 className="section-title">Adapt to Your Compliance Mandate</h2>
      <p className="deployment-subtitle">
        Toggle between deployment modes to see how AxioSigil dynamically reconfigures
        its security boundaries and infrastructure to match your exact regulatory requirements.
      </p>

      <div className="mode-toggle-container">
        <button
          className={`mode-toggle-btn ${mode === 'enterprise' ? 'active' : ''}`}
          onClick={() => setMode('enterprise')}
        >
          Enterprise Air-Gapped
        </button>
        <button
          className={`mode-toggle-btn ${mode === 'saas' ? 'active' : ''}`}
          onClick={() => setMode('saas')}
        >
          Sovereign SaaS
        </button>
      </div>

      <div className="mode-features-grid" key={mode}>
        {activeFeatures.map((feature, index) => (
          <div key={feature.title} className="mode-feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="mode-feature-icon">{feature.icon}</div>
            <h3 className="mode-feature-title">{feature.title}</h3>
            <p className="mode-feature-desc">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mode-env-hint">
        <span className="env-label">Environment Configuration:</span>
        <span className="env-var">DEPLOYMENT_MODE={mode === 'enterprise' ? '"enterprise"' : '"saas"'}</span>
      </div>
    </section>
  );
};

export default DeploymentModeDemonstrator;