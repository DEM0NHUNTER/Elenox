/**
 * Observability Workspace and Telemetry Matrix Core.
 * Renders real-time security postures, row-level verification counts,
 * and infrastructure metrics via standard React loops and CSS animations.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Activity, ShieldCheck, Cpu, Layers, Radio, ShieldAlert } from 'lucide-react';

interface MetricNode {
  timestamp: string;
  throughput: number;
  latency: number;
  complianceRate: number;
}

interface IsolationMetric {
  partitionId: string;
  activeContexts: number;
  verificationStatus: 'SECURE' | 'DEGRADED';
}

export default function ObservabilityWorkspace(): React.JSX.Element {
  const [streamData, setStreamData] = useState<MetricNode[]>([]);
  const [activePartitions, setActivePartitions] = useState<IsolationMetric[]>([
    { partitionId: 'SYS_CORE_SECURE', activeContexts: 14, verificationStatus: 'SECURE' },
    { partitionId: 'TENANT_ALPHA_VOL', activeContexts: 8, verificationStatus: 'SECURE' },
    { partitionId: 'TENANT_BETA_PRIME', activeContexts: 5, verificationStatus: 'SECURE' }
  ]);

  // Generate historical data array upon container lifecycle mounting
  useEffect(() => {
    const historicalNodes: MetricNode[] = Array.from({ length: 12 }).map((_, idx) => {
      const date = new Date(Date.now() - (12 - idx) * 5000);
      return {
        timestamp: date.toTimeString().split(' ')[0],
        throughput: Math.floor(Math.random() * 40) + 120,
        latency: Math.floor(Math.random() * 15) + 35,
        complianceRate: 100
      };
    });
    setStreamData(historicalNodes);
  }, []);

  // Maintain continuous chart stream synchronization via atomic state intervals
  useEffect(() => {
    const streamInterval = setInterval(() => {
      const now = new Date();
      const nextNode: MetricNode = {
        timestamp: now.toTimeString().split(' ')[0],
        throughput: Math.floor(Math.random() * 50) + 110,
        latency: Math.floor(Math.random() * 20) + 30,
        complianceRate: Math.random() > 0.01 ? 100 : 99.8
      };

      setStreamData(prev => [...prev.slice(1), nextNode]);

      // Simulate minor shifts in active tenant evaluation profiles
      setActivePartitions(prev =>
        prev.map(p => ({
          ...p,
          activeContexts: Math.max(1, p.activeContexts + (Math.random() > 0.5 ? 1 : -1))
        }))
      );
    }, 5000);

    return () => clearInterval(streamInterval);
  }, []);

  // Compute total processing volumes via lightweight array operations
  const currentSummary = useMemo(() => {
    if (streamData.length === 0) return { avgThroughput: 0, avgLatency: 0 };
    const total = streamData.reduce((acc, curr) => ({
      t: acc.t + curr.throughput,
      l: acc.l + curr.latency
    }), { t: 0, l: 0 });

    return {
      avgThroughput: Math.floor(total.t / streamData.length),
      avgLatency: Math.floor(total.l / streamData.length)
    };
  }, [streamData]);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-1 bg-transparent font-mono text-xs text-slate-300">

      {/* ─── TELEMETRY TICKERS AND OVERVIEWS ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60 flex items-center gap-4">
          <div className="p-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Core Throughput</span>
            <span className="text-sm font-bold text-white tabular-nums">{currentSummary.avgThroughput} REQ/S</span>
          </div>
        </div>

        <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60 flex items-center gap-4">
          <div className="p-2 rounded-lg border border-purple-500/20 bg-purple-500/5 text-purple-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Transit Latency</span>
            <span className="text-sm font-bold text-slate-300 tabular-nums">{currentSummary.avgLatency} MS</span>
          </div>
        </div>

        <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60 flex items-center gap-4">
          <div className="p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Isolation Health</span>
            <span className="text-sm font-bold text-emerald-400 tracking-wider">100.00% COMPLIANT</span>
          </div>
        </div>

        <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60 flex items-center gap-4">
          <div className="p-2 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Active Kernels</span>
            <span className="text-sm font-bold text-white tabular-nums">4 ONLINE</span>
          </div>
        </div>
      </div>

      {/* ─── TELEMETRY GRAPH VISUALIZATION PANEL ────────────────────────────── */}
      <div className="flex-1 min-h-[250px] border border-slate-800 rounded-xl p-5 bg-slate-950/40 flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">Real-Time Boundary Traffic</h3>
          </div>
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest animate-pulse">Streaming 5000ms Ticks</span>
        </div>

        {/* CSS Chart Bar Render Sequence */}
        <div className="flex-1 flex items-end gap-3 pt-6 pb-2 px-2 h-full">
          {streamData.map((node, idx) => {
            const normalizedHeight = Math.min(100, Math.max(15, ((node.throughput - 80) / 100) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[8px] text-slate-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity font-mono tabular-nums">
                  {node.throughput}
                </div>
                <div className="w-full bg-slate-900/60 rounded border border-slate-800 relative overflow-hidden flex items-end h-[80%]">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-900/40 via-cyan-500/30 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)] rounded-sm transition-all duration-500"
                    style={{ height: `${normalizedHeight}%` }}
                  />
                </div>
                <span className="text-[8px] text-slate-600 select-none tracking-tight font-mono whitespace-nowrap">
                  {node.timestamp.substring(3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── ACTIVE MULTI-TENANT PARTITION DIRECTORY ───────────────────────── */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/20 shrink-0">
        <div className="bg-slate-900/40 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>Active Context </span>
          <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
        </div>
        <div className="divide-y divide-slate-900/60 bg-slate-950/40">
          {activePartitions.map((partition) => (
            <div key={partition.partitionId} className="px-4 py-3 flex items-center justify-between font-mono">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                <span className="font-bold text-white tracking-wider text-[11px]">{partition.partitionId}</span>
              </div>
              <div className="flex items-center gap-6 text-[10px]">
                <div className="text-slate-500 uppercase tracking-tight">
                  Cryptographic Contexts: <span className="text-slate-300 font-bold tabular-nums">{partition.activeContexts}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-widest">
                  {partition.verificationStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}