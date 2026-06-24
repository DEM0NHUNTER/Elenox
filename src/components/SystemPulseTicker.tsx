/**
 * Continuous, low-salience feedback loop displaying simulated backend telemetry.
 */
import { useEffect, useState } from 'react';

const EVENTS = [
  { type: 'CRYPTO', msg: 'Ed25519 Trace 0x8f4a...e9b2 signed and verified', color: 'var(--chart-1)' },
  { type: 'SECURITY', msg: 'PostgreSQL RLS enforced: tenant_882 isolated', color: 'var(--primary)' },
  { type: 'VAULT', msg: 'Ephemeral tmpfs shredded (3-pass DoD overwrite)', color: 'var(--chart-4)' },
  { type: 'RAG', msg: 'ms-marco cross-encoder reranked 42 vector chunks', color: 'var(--primary)' },
  { type: 'INGEST', msg: 'Granite-Docling layout extraction complete', color: 'var(--chart-4)' },
];

const SystemPulseTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % EVENTS.length);
        setIsTransitioning(false);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const event = EVENTS[currentIndex];

  return (
    <div className="system-pulse">
      <div className="pulse-indicator">
        <span className="pulse-dot" style={{ background: event.color, boxShadow: `0 0 8px ${event.color}` }} />
        <span className="pulse-live">LIVE TELEMETRY</span>
      </div>
      <div className={`pulse-content ${isTransitioning ? 'hidden' : ''}`}>
        <span className="pulse-type" style={{ color: event.color }}>[{event.type}]</span>
        <span className="pulse-msg">{event.msg}</span>
      </div>
    </div>
  );
};

export default SystemPulseTicker;