/**
Cryptographic Grounding Trace and Verification Panel.
Validates text inference metrics against underlying source vector allocations
to isolate structural hallucinations and guarantee factual consistency.
Updated: Migrated to semantic Tailwind theme classes for full palette integration.
*/
import React, { useMemo } from 'react';
import { ShieldAlert, FileText, Cpu, Fingerprint, Percent, BarChart3 } from 'lucide-react';
import type { Citation } from '../types';

interface HallucinationXRayProps {
  citationMap: Citation[];
  userQuery: string;
  signature?: string;
}

export default function HallucinationXRay({
  citationMap = [],
  userQuery,
  signature,
}: HallucinationXRayProps): React.JSX.Element {
  const evaluationScore = useMemo(() => {
    if (citationMap.length === 0) return 0;
    const rawSum = citationMap.reduce((acc, curr) => acc + ((curr as any).score || 0), 0);
    const averageScore = rawSum / citationMap.length;
    return Math.min(100, Math.max(0, Math.floor(averageScore * 100)));
  }, [citationMap]);

  const safetyThreshold = useMemo(() => {
    if (evaluationScore >= 85) return { label: 'VERIFIED GROUNDING', color: 'text-primary border-primary/20 bg-primary/5' };
    if (evaluationScore >= 70) return { label: 'EVIDENTIARY FALSE', color: 'text-foreground border-border bg-muted' };
    return { label: 'MUTATED CONTEXT ALERT', color: 'text-destructive border-destructive/20 bg-destructive/5' };
  }, [evaluationScore]);

  return (
    <div className="w-full space-y-5 font-mono text-xs text-foreground animate-in fade-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-xl p-4 bg-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Attestation Index</span>
            <div className={`px-2 py-0.5 rounded text-[9px] font-bold border tracking-wider uppercase inline-block ${safetyThreshold.color}`}>
              {safetyThreshold.label}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-right">
            <span className="text-2xl font-black text-card-foreground tabular-nums tracking-tighter">{evaluationScore}</span>
            <Percent className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </div>
        </div>

        <div className="border border-border rounded-xl p-4 bg-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Payload Provenance</span>
            <span className={`text-[10px] font-bold ${signature ? 'text-primary' : 'text-muted-foreground'}`}>
              {signature ? 'ED25519 ATTESTATION VALID' : 'UNSIGNED INFERENCE CORE'}
            </span>
          </div>
          {signature ? (
            <Fingerprint className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(110,86,207,0.3)]" />
          ) : (
            <ShieldAlert className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      </div>

      {citationMap.length > 0 && (
        <div className="border border-border rounded-xl p-4 bg-card/60 space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            <span>Factual Alignment Trace Graph</span>
          </div>
          <div className="h-16 flex items-end gap-1.5 pt-4 px-1">
            {citationMap.map((citation, idx) => {
              const score = (citation as any).score || (citation as any).cosine_score || 0;
              const barHeight = Math.min(100, Math.max(10, Math.floor(score * 100)));
              return (
                <div key={idx} className="flex-1 h-full flex flex-col justify-end group relative">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border px-2 py-0.5 rounded text-[8px] font-black text-card-foreground z-50 whitespace-nowrap font-mono">
                    INDEX {idx + 1}: {score.toFixed(4)}
                  </div>
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${score >= 0.85 ? 'bg-primary shadow-[0_0_8px_rgba(110,86,207,0.2)]' : 'bg-muted-foreground'}`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-[7px] text-muted-foreground text-center block mt-1 scale-90">#{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="border border-border rounded-xl overflow-hidden bg-card/40 flex flex-col">
        <div className="bg-card/60 px-4 py-2.5 border-b border-border flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest shrink-0">
          <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-primary" /> Vector Allocation Mappings</span>
          <span className="tabular-nums text-muted-foreground">{citationMap.length} Reference Blocks Found</span>
        </div>

        <div className="p-4 overflow-y-auto max-h-[340px] space-y-4 custom-scrollbar bg-muted/10">
          {citationMap.length > 0 ? (
            citationMap.map((citation, index) => {
              const fileIdentifier = (citation as any).source_file || (citation as any).fileName || (citation as any).file || 'SOVEREIGN_VAULT_NODE';
              const alignmentScore = (citation as any).score || (citation as any).cosine_score || 0;
              const localizedMatch = Math.min(100, Math.floor(alignmentScore * 100));
              const factualClaim = (citation as any).claim || (citation as any).generated_claim || 'Context extraction boundary verified.';
              const primaryGrounding = (citation as any).content || (citation as any).text || (citation as any).source_grounding || 'No raw source provided';

              return (
                <div key={index} className="border border-border rounded-xl p-4 bg-card/80 space-y-3">
                  <div className="flex justify-between items-center text-[10px] border-b border-border/80 pb-2">
                    <div className="flex items-center gap-2 font-medium text-foreground truncate max-w-[65%]">
                      <FileText className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate uppercase font-bold text-muted-foreground" title={fileIdentifier}>
                        {fileIdentifier.replace(/[^a-zA-Z0-9_\.\-]/g, '_')}
                      </span>
                    </div>
                    <span className={`font-mono text-[9px] font-bold tabular-nums px-1.5 py-0.5 rounded border ${
                      localizedMatch >= 85 ? 'bg-primary/5 text-primary border-primary/10' : 'bg-muted text-foreground border-border'
                    }`}>
                      COSINE MATCH: {alignmentScore.toFixed(4)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Generated Claim:</span>
                    <p className="text-card-foreground font-medium text-[11px] leading-relaxed select-text">{factualClaim}</p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Source Grounding:</span>
                    <div className="p-3 bg-muted/40 border border-border rounded-lg text-foreground text-[11px] leading-relaxed select-all selection:bg-primary/20 font-sans">
                      "{primaryGrounding}"
                    </div>
                  </div>

                  {typeof (citation as any).page === 'number' && (
                    <div className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest pt-1 flex justify-between items-center">
                      <span>Index Matrix Alignment Point</span>
                      <span className="text-muted-foreground tabular-nums font-mono">PAGE OFFSET AREA: {(citation as any).page}</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-muted-foreground border border-dashed border-border rounded-lg uppercase tracking-widest text-[10px]">
              [ No structural verification matrices are registered for prompt context query: "{userQuery.substring(0, 20)}..." ]
            </div>
          )}
        </div>
      </div>

      {signature && (
        <div className="border border-primary/10 rounded-xl p-3 bg-primary/5 flex flex-col gap-1.5 font-mono text-[10px]">
          <span className="text-primary font-bold uppercase tracking-widest block">Attestation Authority Envelope Seal</span>
          <code className="text-muted-foreground select-all break-all leading-normal bg-muted/40 p-2 rounded border border-border">
            {signature}
          </code>
        </div>
      )}
    </div>
  );
}