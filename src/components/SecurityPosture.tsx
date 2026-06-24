/**
 * Visualizes the dual-mode deployment architecture and cryptographic standards.
 * Reinforces the "Zero-Trust" narrative by explicitly detailing the security
 * boundaries for both Air-Gapped and SaaS environments.
 */
const SecurityPosture = () => {
  return (
    <section id="architecture" className="security-section">
      <h2 className="section-title">Sovereign Architecture</h2>
      <p className="security-subtitle">
        Choose the deployment model that matches your compliance mandate.
        Both modes enforce mathematical zero-trust boundaries.
      </p>

      <div className="security-grid">
        <div className="security-card">
          <div className="security-card__header">
            <span className="security-card__icon">🏢</span>
            <h3>Enterprise Air-Gapped</h3>
          </div>
          <p>Deploy entirely within your physical perimeter. No public cloud dependencies, no data exfiltration.</p>
          <ul>
            <li>Local Object Vault (tmpfs)</li>
            <li>PostgreSQL RLS Multi-tenancy</li>
            <li>DoD-style 3-Pass Secure Delete</li>
            <li>Dynamic CPU/GPU Profiles</li>
          </ul>
        </div>

        <div className="security-card">
          <div className="security-card__header">
            <span className="security-card__icon">☁️</span>
            <h3>Sovereign SaaS</h3>
          </div>
          <p>Managed infrastructure with strict logical isolation, cryptographic billing, and enterprise identity integration.</p>
          <ul>
            <li>Stripe Webhook Integration</li>
            <li>Redis-backed Quota Limits</li>
            <li>SSO / Active Directory Ready</li>
            <li>Tenant-Isolated Vector Spaces</li>
          </ul>
        </div>
      </div>

      <div className="crypto-standards">
        <div className="crypto-badge">Ed25519 Signed Traces</div>
        <div className="crypto-badge">Post-Quantum Resistant</div>
        <div className="crypto-badge">OpenTelemetry Native</div>
        <div className="crypto-badge">Hybrid Vector Search</div>
      </div>
    </section>
  );
};

export default SecurityPosture;