import { useEffect, useRef, useState } from 'react';
import LandingBackground from './LandingBackground';
import Navbar from './Navbar';
import InteractiveDAG from './InteractiveDAG';
import SecurityPosture from './SecurityPosture';
import IndustryMatrix from './IndustryMatrix';
import DeploymentModeDemonstrator from './DeploymentModeDemonstrator';
import SystemPulseTicker from './SystemPulseTicker';
import RequestAccessModal from './RequestAccessModal';
import LegalFooter from './LegalFooter';
import { Badge } from './ui/Badge';

const useScrollReveal = () => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const useTextScramble = (text: string, isActive: boolean) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isActive) { setDisplayText(text); return; }
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let frame = 0;
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    for (let i = 0; i < text.length; i++) {
      queue.push({ from: chars[Math.floor(Math.random() * chars.length)], to: text[i], start: i * 2, end: i * 2 + 10 });
    }
    let cancel = false;
    const update = () => {
      let output = ''; let complete = 0;
      for (let i = 0; i < queue.length; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) { complete++; output += to; }
        else if (frame >= start) {
          if (!char || Math.random() < 0.28) { char = chars[Math.floor(Math.random() * chars.length)]; queue[i].char = char; }
          output += char;
        } else { output += from; }
      }
      setDisplayText(output);
      if (complete < queue.length) { frame++; if (!cancel) requestAnimationFrame(update); }
      else { setDisplayText(text); }
    };
    update();
    return () => { cancel = true; };
  }, [text, isActive]);

  return displayText;
};

const InteractiveProof = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleVerify = () => {
    if (isScanning) return;
    setIsScanning(true); setScanComplete(false);
    setTimeout(() => { setIsScanning(false); setScanComplete(true); }, 1500);
  };

  return (
    <section id="proof" className="proof-section">
      <h2 className="section-title">Experience Calibrated Trust</h2>
      <p className="proof-subtitle">Don't just take our word for it. Interact with a live verification of our cryptographic grounding.</p>
      <div className="proof-container">
        <div className="proof-terminal">
          <div className="proof-terminal__header">
            <span className="proof-terminal__dot"></span>
            <span>Query: "What is the Q3 revenue growth?"</span>
          </div>
          <div className="proof-terminal__body">
            <p className="proof-ai-response">"According to the Q3 Financial Report, revenue grew by <mark>14.2%</mark> year-over-year, driven primarily by a <mark>22% increase</mark> in enterprise subscriptions."</p>
            <button className={`proof-verify-btn ${isScanning ? 'scanning' : ''}`} onClick={handleVerify} disabled={isScanning}>
              {isScanning ? 'Computing Ed25519 Hash...' : 'X-Ray Verification'}
            </button>
          </div>
        </div>
        <div className={`proof-xray ${scanComplete ? 'active' : ''}`}>
          <div className="xray-header">
            <h4>Hallucination X-Ray</h4>
            <span className={`xray-status ${scanComplete ? 'valid' : ''}`}>{scanComplete ? '✓ CRYPTOGRAPHICALLY VERIFIED' : 'AWAITING SCAN'}</span>
          </div>
          <div className="xray-metrics">
            <div className="xray-metric"><span className="metric-label">Exact Match</span><div className="metric-bar"><div className="metric-fill" style={{ width: scanComplete ? '98%' : '0%' }}></div></div><span className="metric-value">98%</span></div>
            <div className="xray-metric"><span className="metric-label">Semantic Match</span><div className="metric-bar"><div className="metric-fill semantic" style={{ width: scanComplete ? '96%' : '0%' }}></div></div><span className="metric-value">96%</span></div>
            <div className="xray-metric"><span className="metric-label">Numeric Match</span><div className="metric-bar"><div className="metric-fill numeric" style={{ width: scanComplete ? '100%' : '0%' }}></div></div><span className="metric-value">100%</span></div>
          </div>
          <div className="xray-signature">
            <span className="sig-label">Ed25519 Trace Signature:</span>
            <code className="sig-hash">{scanComplete ? '0x8f4a2b...e9b2c1' : '---'}</code>
          </div>
        </div>
      </div>
    </section>
  );
};

const PricingTiers = ({ onSelectTier }: { onSelectTier: () => void }) => {
  const reveal = useScrollReveal();

  return (
    <section id="pricing" className={`section ${reveal.isVisible ? 'reveal-visible' : ''}`} ref={reveal.ref as React.RefObject<HTMLDivElement>}>
      <h2 className="section-title">Licensing Tiers</h2>
      <p className="pricing-subtitle">Transparent deployment models scaled for compliance requirements and infrastructure control.</p>
      <div className="pricing-grid">

        {/* Cloud Developer Tier */}
        <div className="pricing-card">
          <div className="pricing-card__header">
            <h3>Cloud Sandbox</h3>
            <div className="pricing-card__price">$0<span>/mo</span></div>
            <p>Shared tenant environment for PoC and evaluation.</p>
          </div>
          <ul className="pricing-card__features">
            <li>Standard RAG Ingestion Pipeline</li>
            <li>Multi-tenant Isolation Boundaries</li>
            <li>Basic Cryptographic Tracing</li>
            <li>Community Forum Support</li>
          </ul>
          <button className="btn-secondary w-full mt-auto" onClick={onSelectTier}>Start Building</button>
        </div>

        {/* Dedicated Enterprise Tier (Featured) */}
        <div className="pricing-card featured">
          <div className="pricing-badge">Most Secure</div>
          <div className="pricing-card__header">
            <h3>Dedicated VPC</h3>
            <div className="pricing-card__price">$2,500<span>/mo</span></div>
            <p>Single-tenant cloud infrastructure for production workloads.</p>
          </div>
          <ul className="pricing-card__features">
            <li>Dedicated Kubernetes Cluster</li>
            <li>Strict PostgreSQL RLS Policies</li>
            <li>Full Ed25519 Audit Logging</li>
            <li>SOC2 Type II Compliance Reports</li>
            <li>24/7 Priority Engineering Support</li>
          </ul>
          <button className="btn-primary w-full mt-auto" onClick={onSelectTier}>Deploy VPC</button>
        </div>

        {/* Air-Gapped Sovereign Tier */}
        <div className="pricing-card">
          <div className="pricing-card__header">
            <h3>Air-Gapped Sovereign</h3>
            <div className="pricing-card__price">Custom</div>
            <p>Hardware-agnostic installation for completely disconnected environments.</p>
          </div>
          <ul className="pricing-card__features">
            <li>Zero-External-Network Requirement</li>
            <li>Local Model Execution (CPU/GPU)</li>
            <li>DoD 5220.22-M Memory Wiping</li>
            <li>Custom IAM & Active Directory Sync</li>
            <li>Dedicated Deployment Engineer</li>
          </ul>
          <button className="btn-secondary w-full mt-auto" onClick={onSelectTier}>Contact Sales</button>
        </div>

      </div>
    </section>
  );
};

const NextFeatures = () => {
  const reveal = useScrollReveal();

  const roadmapItems = [
    {
      quarter: "Q4 2026",
      title: "Post-Quantum Cryptography",
      description: "Upgrading all tracing and ledger signatures to NIST-approved post-quantum algorithms (Kyber/Dilithium) to ensure future-proof attestation."
    },
    {
      quarter: "Q1 2027",
      title: "Multi-Modal Forensic RAG",
      description: "Expanding the structural parsing engine to support cryptographic grounding against audio transcripts and video frame metadata."
    },
    {
      quarter: "Q2 2027",
      title: "Autonomous Remediation Agents",
      description: "Self-healing security that automatically rewrite misaligned RLS policies when anomalous access patterns are detected."
    }
  ];

  return (
    <section id="roadmap" className={`section ${reveal.isVisible ? 'reveal-visible' : ''}`} ref={reveal.ref as React.RefObject<HTMLDivElement>}>
      <h2 className="section-title">Strategic Roadmap</h2>
      <p className="roadmap-subtitle">Continuous hardening of the intelligence boundary.</p>
      <div className="roadmap-grid">
        {roadmapItems.map((item, index) => (
          <div key={index} className="roadmap-card" style={{ transitionDelay: `${index * 0.15}s` }}>
            <div className="roadmap-quarter">{item.quarter}</div>
            <h3 className="roadmap-title">{item.title}</h3>
            <p className="roadmap-desc">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Landing = () => {
  const heroReveal = useScrollReveal();
  const featuresReveal = useScrollReveal();
  const architectureReveal = useScrollReveal();
  const headline = useTextScramble("Witness Your Data's Journey.", heroReveal.isVisible);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <div className="landing-container">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LandingBackground />
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        .landing-container { position: relative; background: #0B0F19; color: #E2E8F0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; min-height: 100vh; overflow-x: hidden; }

        /* --- Navbar --- */
        .ax-navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 3rem; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); background: transparent; }
        .ax-navbar--scrolled { background: rgba(11, 15, 25, 0.7); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(56, 189, 248, 0.1); padding: 0.75rem 3rem; }
        .ax-navbar__brand { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 700; color: #F8FAFC; letter-spacing: -0.02em; }
        .ax-navbar__logo { color: #38BDF8; font-size: 1.5rem; }
        .ax-navbar__links { display: flex; gap: 2.5rem; }
        .ax-navbar__links a { color: #94A3B8; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
        .ax-navbar__links a:hover, .ax-navbar__links a.active { color: #38BDF8; }
        .ax-navbar__actions { display: flex; gap: 1rem; align-items: center; }
        .ax-btn-ghost { background: transparent; border: none; color: #E2E8F0; font-weight: 500; cursor: pointer; font-size: 0.9rem; }
        .ax-btn-primary-sm { background: linear-gradient(135deg, #38BDF8 0%, #2DD4BF 100%); color: #0B0F19; font-weight: 600; padding: 0.5rem 1.25rem; border-radius: 6px; border: none; cursor: pointer; font-size: 0.9rem; transition: transform 0.2s; }
        .ax-btn-primary-sm:hover { transform: translateY(-1px); }
        .ax-navbar__mobile-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; }
        .hamburger { width: 24px; height: 2px; background: #E2E8F0; position: relative; transition: all 0.3s; display: block; }
        .hamburger::before, .hamburger::after { content: ''; position: absolute; width: 24px; height: 2px; background: #E2E8F0; transition: all 0.3s; left: 0; }
        .hamburger::before { top: -8px; } .hamburger::after { top: 8px; }
        .hamburger.open { background: transparent; } .hamburger.open::before { top: 0; transform: rotate(45deg); } .hamburger.open::after { top: 0; transform: rotate(-45deg); }
        @media (max-width: 768px) {
          .ax-navbar { padding: 1rem 1.5rem; } .ax-navbar--scrolled { padding: 0.75rem 1.5rem; }
          .ax-navbar__mobile-toggle { display: block; z-index: 101; }
          .ax-navbar__links { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 15, 25, 0.95); backdrop-filter: blur(20px); flex-direction: column; justify-content: center; align-items: center; gap: 2.5rem; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
          .ax-navbar__links.open { opacity: 1; pointer-events: auto; } .ax-navbar__links a { font-size: 1.25rem; }
          .ax-navbar__actions { display: none; }
        }

        /* --- Hero & Sections --- */
        .hero-section { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 2rem; position: relative; }
        .hero-badge { margin-bottom: 1.5rem; opacity: 0; transform: translateY(20px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .hero-headline { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; line-height: 1.1; margin-bottom: 1.5rem; background: linear-gradient(135deg, #F8FAFC 0%, #94A3B8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.02em; opacity: 0; transform: translateY(20px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s; }
        .hero-subheadline { font-size: clamp(1rem, 2vw, 1.25rem); color: #94A3B8; max-width: 600px; margin-bottom: 2.5rem; line-height: 1.6; opacity: 0; transform: translateY(20px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s; }
        .hero-actions { display: flex; gap: 1rem; opacity: 0; transform: translateY(20px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s; }
        .reveal-visible .hero-badge, .reveal-visible .hero-headline, .reveal-visible .hero-subheadline, .reveal-visible .hero-actions { opacity: 1; transform: translateY(0); }

        .section { padding: 6rem 2rem; max-width: 1200px; margin: 0 auto; position: relative; }
        .section-title { font-size: 2.5rem; font-weight: 700; text-align: center; margin-bottom: 4rem; background: linear-gradient(135deg, #F8FAFC 0%, #38BDF8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .feature-card { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(56, 189, 248, 0.1); border-radius: 16px; padding: 2rem; transition: all 0.4s ease; opacity: 0; transform: translateY(40px); }
        .feature-card:hover { border-color: rgba(56, 189, 248, 0.4); transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); }
        .reveal-visible .feature-card { opacity: 1; transform: translateY(0); }
        .reveal-visible .feature-card:nth-child(1) { transition-delay: 0.1s; } .reveal-visible .feature-card:nth-child(2) { transition-delay: 0.2s; } .reveal-visible .feature-card:nth-child(3) { transition-delay: 0.3s; }
        .feature-icon { width: 48px; height: 48px; background: rgba(56, 189, 248, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; color: #38BDF8; font-size: 1.5rem; }
        .feature-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: #F8FAFC; }
        .feature-desc { color: #94A3B8; line-height: 1.6; font-size: 0.95rem; }

        /* --- System Pulse Ticker --- */
        .system-pulse { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 1.5rem; background: rgba(11, 15, 25, 0.6); backdrop-filter: blur(8px); border: 1px solid rgba(56, 189, 248, 0.1); border-radius: 99px; padding: 0.5rem 1.25rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.8rem; white-space: nowrap; overflow: hidden; max-width: 90vw; opacity: 0; transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 1s; }
        .reveal-visible .system-pulse { opacity: 1; }
        .pulse-indicator { display: flex; align-items: center; gap: 0.5rem; }
        .pulse-dot { width: 6px; height: 6px; border-radius: 50%; animation: pulse-glow 2s infinite; }
        @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse-live { color: #64748B; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; }
        .pulse-content { display: flex; align-items: center; gap: 0.5rem; opacity: 1; transform: translateY(0); transition: opacity 0.3s ease, transform 0.3s ease; }
        .pulse-content.hidden { opacity: 0; transform: translateY(-8px); }
        .pulse-type { font-weight: 700; font-size: 0.75rem; }
        .pulse-msg { color: #94A3B8; }

        /* --- Interactive Proof --- */
        .proof-section { padding: 8rem 2rem; max-width: 1200px; margin: 0 auto; text-align: center; position: relative; }
        .proof-subtitle { color: #94A3B8; max-width: 600px; margin: 0 auto 4rem auto; font-size: 1.1rem; }
        .proof-container { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; text-align: left; align-items: center; }
        @media (max-width: 900px) { .proof-container { grid-template-columns: 1fr; } }
        .proof-terminal { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .proof-terminal__header { background: rgba(11, 15, 25, 0.8); padding: 0.75rem 1.25rem; border-bottom: 1px solid rgba(56, 189, 248, 0.1); display: flex; align-items: center; gap: 0.75rem; color: #94A3B8; font-size: 0.85rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
        .proof-terminal__dot { width: 8px; height: 8px; background: #38BDF8; border-radius: 50%; box-shadow: 0 0 8px #38BDF8; }
        .proof-terminal__body { padding: 2rem; }
        .proof-ai-response { color: #E2E8F0; line-height: 1.7; font-size: 1.05rem; margin-bottom: 2rem; }
        .proof-ai-response mark { background: rgba(45, 212, 191, 0.2); color: #2DD4BF; padding: 0.1em 0.3em; border-radius: 4px; font-weight: 600; }
        .proof-verify-btn { background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.4); color: #A855F7; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; }
        .proof-verify-btn:hover:not(:disabled) { background: rgba(168, 85, 247, 0.2); transform: translateY(-2px); }
        .proof-verify-btn.scanning { cursor: wait; opacity: 0.7; }
        .proof-xray { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 12px; padding: 2rem; opacity: 0.4; transform: translateX(20px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .proof-xray.active { opacity: 1; transform: translateX(0); border-color: rgba(45, 212, 191, 0.4); box-shadow: 0 0 30px rgba(45, 212, 191, 0.1); }
        .xray-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(226, 232, 240, 0.1); }
        .xray-header h4 { color: #F8FAFC; font-size: 1.1rem; margin: 0; }
        .xray-status { font-size: 0.75rem; font-weight: 700; color: #64748B; letter-spacing: 0.05em; } .xray-status.valid { color: #2DD4BF; }
        .xray-metrics { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem; }
        .xray-metric { display: grid; grid-template-columns: 100px 1fr 50px; align-items: center; gap: 1rem; }
        .metric-label { color: #94A3B8; font-size: 0.85rem; }
        .metric-bar { height: 6px; background: rgba(226, 232, 240, 0.1); border-radius: 3px; overflow: hidden; }
        .metric-fill { height: 100%; background: linear-gradient(90deg, #38BDF8, #2DD4BF); border-radius: 3px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .metric-fill.semantic { background: linear-gradient(90deg, #A855F7, #38BDF8); } .metric-fill.numeric { background: linear-gradient(90deg, #2DD4BF, #38BDF8); }
        .metric-value { color: #F8FAFC; font-size: 0.9rem; font-weight: 600; text-align: right; font-family: ui-monospace, monospace; }
        .xray-signature { background: rgba(11, 15, 25, 0.6); padding: 1rem; border-radius: 8px; border: 1px dashed rgba(56, 189, 248, 0.2); display: flex; flex-direction: column; gap: 0.5rem; }
        .sig-label { color: #64748B; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .sig-hash { color: #38BDF8; font-family: ui-monospace, monospace; font-size: 0.9rem; }

        /* --- Pricing Section --- */
        .pricing-subtitle, .roadmap-subtitle { color: #94A3B8; max-width: 600px; margin: 0 auto 4rem auto; font-size: 1.1rem; text-align: center; }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto; }
        .pricing-card { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(226, 232, 240, 0.1); border-radius: 16px; padding: 2.5rem 2rem; display: flex; flex-direction: column; opacity: 0; transform: translateY(40px); transition: all 0.4s ease; position: relative; }
        .reveal-visible .pricing-card { opacity: 1; transform: translateY(0); }
        .reveal-visible .pricing-card:nth-child(2) { transition-delay: 0.15s; }
        .reveal-visible .pricing-card:nth-child(3) { transition-delay: 0.3s; }
        .pricing-card.featured { background: rgba(15, 23, 42, 0.8); border-color: rgba(56, 189, 248, 0.4); transform: scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .reveal-visible .pricing-card.featured { transform: scale(1.02) translateY(0); }
        .pricing-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #38BDF8 0%, #2DD4BF 100%); color: #0B0F19; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 1rem; border-radius: 99px; letter-spacing: 0.05em; text-transform: uppercase; }
        .pricing-card__header { margin-bottom: 2rem; border-bottom: 1px solid rgba(226, 232, 240, 0.1); padding-bottom: 2rem; }
        .pricing-card__header h3 { font-size: 1.25rem; font-weight: 600; color: #F8FAFC; margin-bottom: 1rem; }
        .pricing-card__price { font-size: 2.5rem; font-weight: 700; color: #38BDF8; margin-bottom: 1rem; }
        .pricing-card__price span { font-size: 1rem; color: #64748B; font-weight: 500; }
        .pricing-card__header p { color: #94A3B8; font-size: 0.95rem; line-height: 1.5; }
        .pricing-card__features { list-style: none; padding: 0; margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .pricing-card__features li { color: #E2E8F0; font-size: 0.95rem; display: flex; align-items: flex-start; gap: 0.75rem; }
        .pricing-card__features li::before { content: '✓'; color: #2DD4BF; font-weight: bold; }
        .w-full { width: 100%; } .mt-auto { margin-top: auto; }

        /* --- Roadmap Section --- */
        .roadmap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .roadmap-card { background: rgba(11, 15, 25, 0.6); border: 1px solid rgba(56, 189, 248, 0.1); border-radius: 12px; padding: 2rem; opacity: 0; transform: translateY(30px); transition: all 0.5s ease; border-left: 4px solid #38BDF8; }
        .roadmap-card:hover { border-left-color: #A855F7; background: rgba(15, 23, 42, 0.8); }
        .reveal-visible .roadmap-card { opacity: 1; transform: translateY(0); }
        .roadmap-quarter { display: inline-block; background: rgba(56, 189, 248, 0.1); color: #38BDF8; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 4px; margin-bottom: 1rem; letter-spacing: 0.05em; }
        .roadmap-title { font-size: 1.1rem; font-weight: 600; color: #F8FAFC; margin-bottom: 0.75rem; }
        .roadmap-desc { color: #94A3B8; font-size: 0.9rem; line-height: 1.6; }

        /* --- Security & Industry --- */
        .security-section, .industry-section, .deployment-section { padding: 8rem 2rem; max-width: 1200px; margin: 0 auto; text-align: center; position: relative; }
        .security-subtitle, .industry-subtitle, .deployment-subtitle { color: #94A3B8; max-width: 650px; margin: 0 auto 4rem auto; font-size: 1.1rem; line-height: 1.6; }
        .security-grid, .industry-grid, .mode-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; text-align: left; margin-bottom: 2rem; }
        .security-card, .industry-card, .mode-feature-card { background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(226, 232, 240, 0.08); border-radius: 16px; padding: 2rem; transition: all 0.4s ease; }
        .security-card:hover, .industry-card:hover, .mode-feature-card:hover { border-color: rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.7); transform: translateY(-4px); }
        .security-card__header, .industry-card__header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
        .security-card__icon, .industry-card__icon { font-size: 1.5rem; }
        .security-card h3, .industry-card h3, .mode-feature-title { color: #F8FAFC; font-size: 1.15rem; margin: 0; font-weight: 600; }
        .security-card p, .industry-card p, .mode-feature-desc { color: #94A3B8; line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.9rem; }
        .security-card ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .security-card li { color: #E2E8F0; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; }
        .security-card li::before { content: '✓'; color: #2DD4BF; font-weight: bold; }
        .crypto-standards { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
        .crypto-badge { background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); color: #A855F7; padding: 0.5rem 1.25rem; border-radius: 99px; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.02em; }
        .industry-card__mandate { color: #38BDF8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem; }
        .industry-card__features { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }
        .industry-card__features li { color: #94A3B8; font-size: 0.9rem; display: flex; align-items: flex-start; gap: 0.5rem; line-height: 1.4; }
        .industry-card__features li::before { content: '›'; color: #2DD4BF; font-weight: bold; font-size: 1.1rem; line-height: 1; margin-top: 1px; }

        /* --- Deployment Mode --- */
        .mode-toggle-container { display: inline-flex; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; padding: 0.25rem; margin-bottom: 3rem; }
        .mode-toggle-btn { background: transparent; border: none; color: #94A3B8; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; }
        .mode-toggle-btn.active { background: linear-gradient(135deg, #38BDF8 0%, #2DD4BF 100%); color: #0B0F19; box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3); }
        .mode-feature-card { animation: fadeInUp 0.5s ease forwards; opacity: 0; }
        .mode-feature-icon { font-size: 2rem; margin-bottom: 1rem; }
        .mode-env-hint { display: inline-flex; align-items: center; gap: 0.75rem; background: rgba(11, 15, 25, 0.8); border: 1px dashed rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 0.75rem 1.5rem; font-family: ui-monospace, monospace; }
        .env-label { color: #64748B; font-size: 0.85rem; }
        .env-var { color: #38BDF8; font-size: 0.9rem; font-weight: 600; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* --- Modal --- */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease; }
        .modal-content { background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 16px; padding: 2.5rem; max-width: 480px; width: 90%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }
        .modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #64748B; font-size: 1.25rem; cursor: pointer; transition: color 0.2s; }
        .modal-close:hover { color: #F8FAFC; }
        .modal-title { font-size: 1.5rem; font-weight: 700; color: #F8FAFC; margin-bottom: 0.5rem; }
        .modal-subtitle { color: #94A3B8; font-size: 0.95rem; margin-bottom: 2rem; }
        .modal-form { display: flex; flex-direction: column; gap: 1rem; }
        .modal-input { background: rgba(11, 15, 25, 0.6); border: 1px solid rgba(226, 232, 240, 0.1); border-radius: 8px; padding: 0.75rem 1rem; color: #F8FAFC; font-size: 0.95rem; transition: border-color 0.2s; }
        .modal-input:focus { outline: none; border-color: #38BDF8; }
        .modal-toggle { display: flex; background: rgba(11, 15, 25, 0.6); border-radius: 8px; padding: 0.25rem; }
        .toggle-btn { flex: 1; background: transparent; border: none; color: #94A3B8; padding: 0.5rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .toggle-btn.active { background: rgba(56, 189, 248, 0.2); color: #38BDF8; }
        .modal-submit { background: linear-gradient(135deg, #38BDF8 0%, #2DD4BF 100%); color: #0B0F19; font-weight: 700; padding: 0.85rem; border-radius: 8px; border: none; cursor: pointer; font-size: 1rem; transition: transform 0.2s; margin-top: 0.5rem; }
        .modal-submit:hover:not(:disabled) { transform: translateY(-2px); }
        .modal-submit:disabled { opacity: 0.7; cursor: wait; }
        .modal-success { text-align: center; padding: 2rem 0; }
        .success-icon { width: 64px; height: 64px; background: rgba(45, 212, 191, 0.1); border: 2px solid #2DD4BF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #2DD4BF; margin: 0 auto 1.5rem; }
        .modal-success h3 { color: #F8FAFC; font-size: 1.25rem; margin-bottom: 0.5rem; }
        .modal-success p { color: #94A3B8; font-size: 0.95rem; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* --- Footer & CTA --- */
        .legal-footer { background: rgba(11, 15, 25, 0.8); border-top: 1px solid rgba(56, 189, 248, 0.1); padding: 3rem 2rem; margin-top: 4rem; position: relative; }
        .legal-footer__inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; text-align: center; }
        .legal-footer__brand { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 700; color: #F8FAFC; }
        .legal-footer__logo { color: #38BDF8; font-size: 1.5rem; }
        .legal-footer__links { display: flex; gap: 2rem; }
        .legal-footer__links a { color: #94A3B8; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
        .legal-footer__links a:hover { color: #F8FAFC; }
        .legal-footer__copy { color: #64748B; font-size: 0.8rem; }
        .architecture-section { text-align: center; padding: 8rem 2rem; background: radial-gradient(circle at center, rgba(56, 189, 248, 0.05) 0%, transparent 70%); position: relative; }
        .btn-primary { background: linear-gradient(135deg, #38BDF8 0%, #2DD4BF 100%); color: #0B0F19; font-weight: 600; padding: 0.75rem 2rem; border-radius: 8px; border: none; cursor: pointer; transition: all 0.3s ease; font-size: 1rem; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(56, 189, 248, 0.3); }
        .btn-secondary { background: transparent; color: #E2E8F0; font-weight: 600; padding: 0.75rem 2rem; border-radius: 8px; border: 1px solid rgba(226, 232, 240, 0.2); cursor: pointer; transition: all 0.3s ease; font-size: 1rem; }
        .btn-secondary:hover { border-color: #E2E8F0; background: rgba(226, 232, 240, 0.05); }
      `}</style>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <section id="hero" className={`hero-section ${heroReveal.isVisible ? 'reveal-visible' : ''}`} ref={heroReveal.ref as React.RefObject<HTMLDivElement>}>
          <div className="hero-badge"><Badge variant="info">Zero-Trust Sovereign AI</Badge></div>
          <h1 className="hero-headline">{headline}</h1>
          <p className="hero-subheadline">Cryptographically Auditable RAG for high-compliance sectors. Observe every inference, validate every citation, and maintain absolute data sovereignty.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={openModal}>Start the Journey</button>
            <button className="btn-secondary" onClick={() => document.getElementById('observability')?.scrollIntoView({ behavior: 'smooth' })}>View Architecture</button>
          </div>
          <SystemPulseTicker />
        </section>

        <section id="features" className={`section ${featuresReveal.isVisible ? 'reveal-visible' : ''}`} ref={featuresReveal.ref as React.RefObject<HTMLDivElement>}>
          <h2 className="section-title">Engineered for Absolute Certainty</h2>
          <div className="features-grid">
            <div className="feature-card"><div className="feature-icon">⚡</div><h3 className="feature-title">Cryptographic Hallucination X-Ray</h3><p className="feature-desc">Forensic breakdown of every AI statement. Validate Exact, Fuzzy, Semantic, and Numeric matches against source documents, secured by Ed25519 signatures.</p></div>
            <div className="feature-card"><div className="feature-icon">🔍</div><h3 className="feature-title">Live DAG Observability</h3><p className="feature-desc">Real-time, interactive telemetry of the entire RAG pipeline. Watch data flow through vectorization, cross-encoder reranking, and LLM inference.</p></div>
            <div className="feature-card"><div className="feature-icon">🛡️</div><h3 className="feature-title">Hardware Autonomy</h3><p className="feature-desc">Deploy entirely offline on your own infrastructure. Dynamic profiles for CPU or GPU execution with mathematically enforced multi-tenant isolation.</p></div>
          </div>
        </section>

        <InteractiveProof />
        <InteractiveDAG />
        <SecurityPosture />
        <IndustryMatrix />
        <DeploymentModeDemonstrator />

        {/* Inserted Pricing and Roadmap sections */}
        <PricingTiers onSelectTier={openModal} />
        <NextFeatures />

        <section className={`architecture-section ${architectureReveal.isVisible ? 'reveal-visible' : ''}`} ref={architectureReveal.ref as React.RefObject<HTMLDivElement>}>
          <h2 className="section-title">Ready to Audit Your AI?</h2>
          <p className="hero-subheadline" style={{opacity: 1, transform: 'none', margin: '0 auto 2.5rem auto'}}>Join the vanguard of defense, finance, and healthcare organizations demanding mathematical proof from their artificial intelligence.</p>
          <button className="btn-primary" onClick={openModal}>Request Deployment</button>
        </section>

        <LegalFooter />
      </div>

      <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Landing;