/**
 * Component for inspecting granular trace payloads.
 * Stripped of static colors, utilizing global layout contexts.
 */
import React from 'react';
import { X, Lock } from 'lucide-react';

import HallucinationXRay from './HallucinationXRay';
import { IconButton } from './ui/IconButton';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { escapeHtml } from '../utils/htmlEscape';
import type { Trace } from './TraceList';

interface TraceDetailProps { trace: Trace; onClose: () => void; }

function safeParseJSON(data: any): any[] {
  if (!data) return [];
  try {
    let parsed = typeof data === 'string' ? JSON.parse(data) : data;
    if (!Array.isArray(parsed) && parsed.generated_sentence) parsed = [parsed];
    return Array.isArray(parsed) ? parsed : (parsed.citations || []);
  } catch { return []; }
}

function normalizeCitations(citations: any[]): any[] {
  if (!Array.isArray(citations)) return [];
  return citations.map(c => {
    let safe = { ...c };
    if (safe.generated_sentence && typeof safe.generated_sentence === 'object') { safe = { ...safe, ...safe.generated_sentence }; }
    return {
      ...safe,
      generated_sentence: String(safe.generated_sentence || ''),
      source_quote: String(safe.source_quote || ''),
      verdict: String(safe.verdict || 'PENDING'),
      match_score: Number(safe.match_score || 0)
    };
  });
}

export default function TraceDetail({ trace, onClose }: TraceDetailProps): React.JSX.Element {
  const attrs = trace.attributes || {};
  const rawXRayData = attrs['hallucination_map'] || attrs['citations'];
  const hasXRay = Boolean(rawXRayData);
  const parsedCitationMap = normalizeCitations(safeParseJSON(rawXRayData));

  const jsonString = JSON.stringify(trace, null, 2);
  const highlightedJson = escapeHtml(jsonString).replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'text-chart-2';
      if (/^"/.test(match)) { cls = (/:$/.test(match)) ? 'text-primary' : 'text-chart-4'; }
      else if (/true|false/.test(match)) { cls = 'text-chart-1'; }
      else if (/null/.test(match)) { cls = 'text-muted-foreground'; }
      return `<span class="${cls}">${match}</span>`;
    }
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-4xl z-50 flex shadow-2xl animate-in slide-in-from-right duration-300 font-mono">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xs -z-10" onClick={onClose} />

      <div className="w-full h-full flex flex-col overflow-y-auto p-6 border-l bg-card border-border">
        <div className="flex justify-between items-center border-b pb-4 mb-6 border-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground tracking-wider uppercase">{trace.name}</h2>
              <Badge variant={trace.status === 'ERROR' ? 'error' : 'success'}>{trace.status}</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">SPAN_ID: {trace.span_id} / TRACE_ID: {trace.trace_id}</p>
          </div>
          <IconButton icon={<X className="w-4 h-4" />} label="Close Panel" onClick={onClose} />
        </div>

        {attrs['agent_signature'] && (
          <Card className="p-4 border border-chart-4/20 bg-chart-4/5 mb-6">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 mt-0.5 text-chart-4" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-chart-4/80">Cryptographic Non-Repudiation Signature</span>
                <p className="text-xs break-all select-all font-bold text-foreground">{attrs['agent_signature']}</p>
              </div>
            </div>
          </Card>
        )}

        {hasXRay && (
          <div className="border-t border-border pt-6 mb-6">
            <h3 className="text-[10px] font-bold text-muted-foreground mb-4 uppercase tracking-widest">Mathematical Grounding Trace</h3>
            <HallucinationXRay citationMap={parsedCitationMap} userQuery="[ Telemetry Reconstruction ]" />
          </div>
        )}

        <div className="border-t border-border pt-6">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Raw OpenTelemetry Payload</h3>
          <Card className="p-4 bg-input border-border overflow-x-auto">
            <pre className="text-[10px] leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlightedJson }} />
          </Card>
        </div>
      </div>
    </div>
  );
}