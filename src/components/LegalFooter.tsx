/**
 * Minimal, premium footer providing essential legal links and brand closure.
 * Maintains the dark, sophisticated aesthetic of the platform.
 */
const LegalFooter = () => {
  return (
    <footer className="legal-footer">
      <div className="legal-footer__inner">
        <div className="legal-footer__brand">
          <span className="legal-footer__logo">◈</span>
          <span>AxioSigil</span>
        </div>
        <div className="legal-footer__links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/security">Security</a>
          <a href="/status">Status</a>
        </div>
        <div className="legal-footer__copy">
          © {new Date().getFullYear()} Axios. All rights reserved. Zero-Trust Autonomy AI.
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;