/**
 * Tri-Layer Force-Directed Graph Architecture (Overhauled UI).
 * Fully aligned to the new semantic CSS variable palette.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Search, Zap, BrainCircuit, ShieldCheck } from 'lucide-react';
import { alpha } from '../theme/theme';

declare global {
  interface Navigator {
    gpu?: any;
  }
}

interface TelemetrySpan {
  key: string;
  value: string;
  highlight?: boolean;
}

interface PhysicsNode {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  spans: TelemetrySpan[];
}

interface Edge {
  source: string;
  target: string;
}

const initialNodes: Omit<PhysicsNode, 'x' | 'y' | 'vx' | 'vy'>[] = [
  {
    id: 'retrieval',
    title: 'Hybrid Retrieval',
    subtitle: 'Qdrant Vector Vault',
    icon: <Search className="w-6 h-6" />,
    radius: 45,
    color: '#64b5f6', // chart-3
    spans: [
      { key: 'Sparse (BM25)', value: '42 chunks' },
      { key: 'Dense (MiniLM)', value: '42 chunks' },
      { key: 'Latency', value: '18ms', highlight: true }
    ]
  },
  {
    id: 'llm',
    title: 'Ollama Inference',
    subtitle: 'Local Qwen 2.5',
    icon: <Zap className="w-6 h-6" />,
    radius: 45,
    color: '#ff79c6', // chart-5
    spans: [
      { key: 'Tokens/Sec', value: '42.5 t/s', highlight: true },
      { key: 'VRAM Usage', value: '4.8 GB' },
      { key: 'Latency', value: '840ms' }
    ]
  },
  {
    id: 'orchestrator',
    title: 'Zero-Trust Orchestrator',
    subtitle: 'LangChain Controller',
    icon: <BrainCircuit className="w-7 h-7" />,
    radius: 55,
    color: '#a48fff', // primary/chart-1
    spans: [
      { key: 'Context Size', value: '16.4k tokens' },
      { key: 'Signatures', value: 'Verified', highlight: true },
      { key: 'Latency', value: '4ms' }
    ]
  },
  {
    id: 'verify',
    title: 'Hallucination X-Ray',
    subtitle: 'Cryptographic Grounding',
    icon: <ShieldCheck className="w-6 h-6" />,
    radius: 40,
    color: '#4db6ac', // chart-4
    spans: [
      { key: 'Fuzzy Match', value: '98.4%', highlight: true },
      { key: 'Semantic Match', value: '94.2%' },
      { key: 'Verdict', value: 'EXACT_MATCH' }
    ]
  }
];

const initialEdges: Edge[] = [
  { source: 'retrieval', target: 'orchestrator' },
  { source: 'orchestrator', target: 'llm' },
  { source: 'llm', target: 'verify' },
  { source: 'verify', target: 'orchestrator' }
];

export default function InteractiveDAG(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNodeId, setActiveNodeId] = useState<string>('orchestrator');

  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const activeNode = initialNodes.find(n => n.id === activeNodeId) || initialNodes[2];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const nodes: PhysicsNode[] = initialNodes.map((n) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0
    }));

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const tick = () => {
      const pushForce = 9000;
      const pullForce = 0.04;
      const centerForce = 0.02;
      const damping = 0.85;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = pushForce / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          nodes[i].vx += fx;
          nodes[i].vy += fy;
          nodes[j].vx -= fx;
          nodes[j].vy -= fy;
        }
      }

      initialEdges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const diff = dist - 280;
          const fx = (dx / dist) * diff * pullForce;
          const fy = (dy / dist) * diff * pullForce;
          source.vx += fx;
          source.vy += fy;
          target.vx -= fx;
          target.vy -= fy;
        }
      });

      nodes.forEach(node => {
        node.vx += (width / 2 - node.x) * centerForce;
        node.vy += (height / 2 - node.y) * centerForce;

        node.vx *= damping;
        node.vy *= damping;

        node.x += node.vx;
        node.y += node.vy;

        node.x = Math.max(node.radius + 20, Math.min(width - node.radius - 20, node.x));
        node.y = Math.max(node.radius + 20, Math.min(height - node.radius - 20, node.y));

        const el = nodeRefs.current[node.id];
        if (el) {
          el.style.transform = `translate(${node.x}px, ${node.y}px)`;
        }
      });

      ctx.clearRect(0, 0, width, height);

      initialEdges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
          const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
          gradient.addColorStop(0, alpha(source.color, 0.4));
          gradient.addColorStop(1, alpha(target.color, 0.4));

          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();

          const time = Date.now() / 1500;
          const progress = (time + (source.x * 0.01)) % 1;

          const px = source.x + (target.x - source.x) * progress;
          const py = source.y + (target.y - source.y) * progress;

          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = alpha(target.color, 0.2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 10;
          ctx.shadowColor = target.color;
          ctx.fill();

          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[600px] bg-background overflow-hidden border-y border-border/60 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]">

      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(${alpha('#a48fff', 0.15)} 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="absolute inset-0 z-0 pointer-events-none">
        {initialNodes.map((node) => {
          const isActive = activeNodeId === node.id;
          const diameter = node.radius * 2;

          return (
            <div
              key={node.id}
              ref={(el) => { nodeRefs.current[node.id] = el; }}
              className="absolute top-0 left-0 flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-500 ease-out"
              style={{
                width: diameter,
                height: diameter,
                marginLeft: -node.radius,
                marginTop: -node.radius,
              }}
              onClick={() => setActiveNodeId(node.id)}
            >
              <svg className={`absolute inset-0 w-full h-full ${isActive ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_12s_linear_infinite]'}`}>
                <circle
                  cx="50%" cy="50%" r="48%"
                  fill="none"
                  stroke={alpha(node.color, isActive ? 0.8 : 0.3)}
                  strokeWidth={isActive ? "2" : "1"}
                  strokeDasharray={isActive ? "8 4 2 4" : "4 8"}
                />
                {isActive && (
                  <circle
                    cx="50%" cy="50%" r="42%"
                    fill="none"
                    stroke={alpha(node.color, 0.4)}
                    strokeWidth="1"
                    strokeDasharray="12 4"
                    className="animate-[spin_3s_linear_infinite_reverse]"
                  />
                )}
              </svg>

              <div
                className={`relative flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100 hover:scale-105'}`}
                style={{
                  width: diameter * 0.75,
                  height: diameter * 0.75,
                  backgroundColor: alpha(node.color, isActive ? 0.15 : 0.05),
                  boxShadow: isActive
                    ? `0 0 30px ${alpha(node.color, 0.4)}, inset 0 0 15px ${alpha(node.color, 0.2)}`
                    : `inset 0 0 10px ${alpha(node.color, 0.1)}`
                }}
              >
                <div style={{ color: isActive ? 'var(--foreground)' : node.color }}>
                  {node.icon}
                </div>
              </div>

              <div className={`absolute top-[110%] w-max text-center pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                <div className="text-[10px] font-bold text-foreground uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {node.title}
                </div>
                {isActive && (
                  <div className="text-[8px] text-primary font-mono mt-0.5 uppercase tracking-widest animate-pulse">
                    [ Active Node ]
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 z-10 p-6 pointer-events-none flex flex-row justify-between items-start gap-6 max-h-full">

        <div className="pointer-events-auto shrink-0 bg-card/60 border border-border/80 backdrop-blur-xl rounded-2xl p-2.5 shadow-lg flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-chart-5 to-transparent opacity-50" />

          {initialNodes.map(node => (
            <button
              key={node.id}
              type="button"
              title={`${node.title} - ${node.subtitle}`}
              onClick={() => setActiveNodeId(node.id)}
              className={`relative p-3.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center group outline-none ${
                activeNodeId === node.id
                  ? 'bg-muted/80 shadow-inner'
                  : 'hover:bg-muted/40'
              }`}
            >
              {activeNodeId === node.id && (
                <div
                  className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: node.color }}
                />
              )}
              <div
                className={`relative z-10 transition-colors duration-300 ${activeNodeId === node.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
                style={{ color: activeNodeId === node.id ? node.color : undefined }}
              >
                {node.icon}
              </div>
            </button>
          ))}
        </div>

        {activeNode && (
          <div className="pointer-events-auto w-full max-w-[320px] shrink-0 bg-card/70 border border-border/80 backdrop-blur-xl rounded-2xl text-left overflow-hidden flex flex-col shadow-lg max-h-full">
            <div className="p-4 border-b border-border/60 flex items-center gap-3 shrink-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 opacity-80" style={{ backgroundColor: activeNode.color }} />

              <div
                className="flex items-center justify-center p-1.5 rounded-lg"
                style={{ backgroundColor: alpha(activeNode.color, 0.1), color: activeNode.color }}
              >
                {activeNode.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-foreground font-bold text-xs uppercase tracking-widest truncate">{activeNode.title}</span>
                <span className="text-[9px] text-muted-foreground font-mono tracking-wider truncate">{activeNode.subtitle}</span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar">
              {activeNode.spans.map(span => (
                <div key={span.key} className="flex flex-col gap-1 font-mono">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-widest">{span.key}</span>
                  <span className={`text-xs ${span.highlight ? 'font-bold' : 'text-foreground'}`} style={{ color: span.highlight ? activeNode.color : undefined }}>
                    {span.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 p-3 text-[9px] text-muted-foreground uppercase tracking-widest font-mono flex items-center justify-between border-t border-border/60 shrink-0">
              <span>Trace Integrity</span>
              <span className="text-chart-4 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> OK</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}