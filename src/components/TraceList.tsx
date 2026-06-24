/**
 * Tabular dashboard tracking live openTelemetry transaction frames.
 * Mapped fully to the semantic design system.
 */
import React, { useState, useMemo } from 'react';

import TraceDetail from './TraceDetail';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export interface SpanAttributes {
  "semantic.summary"?: string;
  "axiosigil.is_xray"?: boolean;
  [key: string]: any;
}

export interface Trace {
  trace_id: string;
  span_id: string;
  parent_span_id: string | null;
  name: string;
  start_time_ns: number;
  end_time_ns: number;
  status: string;
  attributes: SpanAttributes;
}

interface TraceListProps {
  traces?: Trace[];
}

export default function TraceList({ traces = [] }: TraceListProps): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [xrayOnly, setXrayOnly] = useState(false);

  const filteredTraces = useMemo(() => {
    return traces.filter((trace) => {
      const term = searchTerm.toLowerCase();
      const isXRay = Boolean(trace.attributes?.['axiosigil.is_xray']);

      if (xrayOnly && !isXRay) return false;

      return (
        trace.name.toLowerCase().includes(term) ||
        trace.trace_id.toLowerCase().includes(term) ||
        (trace.attributes?.['semantic.summary'] || '').toLowerCase().includes(term)
      );
    });
  }, [traces, searchTerm, xrayOnly]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Filter traces by ID, summary, or span name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md px-4 py-2 bg-input border border-border rounded-sm text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono placeholder:text-muted-foreground"
        />
        <Button
          variant={xrayOnly ? "primary" : "outline"}
          onClick={() => setXrayOnly(!xrayOnly)}
        >
          {xrayOnly ? "SHOWING X-RAY ONLY" : "FILTER BY X-RAY"}
        </Button>
      </div>

      <div className="bg-card/50 border border-border rounded-sm overflow-x-auto">
        <table className="w-full text-left text-sm font-mono whitespace-nowrap">
          <thead className="bg-muted/80 border-b border-border text-muted-foreground uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Operation Span</th>
              <th className="px-4 py-3">Semantic Summary</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredTraces.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground uppercase tracking-widest text-[10px]">
                  [ NO TRACES MATCHING FILTER CRITERIA ]
                </td>
              </tr>
            ) : (
              filteredTraces.map((trace, index) => {
                const isXRay = trace.attributes?.['axiosigil.is_xray'];
                return (
                  <tr
                    key={trace.span_id}
                    onClick={() => setSelectedTrace(trace)}
                    className="stagger-item hover:bg-muted/40 transition-colors cursor-pointer"
                    style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{trace.name}</span>
                        {isXRay && <Badge variant="info">X-RAYED</Badge>}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">ID: {trace.trace_id.slice(0, 16)}...</div>
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-sm truncate">
                      {trace.attributes?.['semantic.summary'] || <span className="text-muted-foreground/70">[ NO SEMANTIC ATTRS ]</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {((trace.end_time_ns - trace.start_time_ns) / 1000000).toFixed(1)} ms
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={trace.status === 'ERROR' ? 'error' : 'success'}>{trace.status || 'OK'}</Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedTrace && <TraceDetail trace={selectedTrace} onClose={() => setSelectedTrace(null)} />}
    </div>
  );
}