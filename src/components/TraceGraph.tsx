/**
 * Visual timeline layout component graph rendering system.
 */
import React, { useMemo, useState } from 'react';
import { ReactFlow, Controls, Background, MiniMap, type Node, type Edge, Position } from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';

import TraceDetail from './TraceDetail';
import { Card } from './ui/Card';
import type { Trace } from './TraceList';

export interface TraceGraphProps { traces: Trace[]; onNodeClick?: (spanId: string) => void; selectedSpanId?: string | null; }

function getFallbackSummary(spanName: string): string {
  const summaryMap: Record<string, string> = {
    'enterprise_xray_query': 'Sovereign RAG Query Executed',
    'zero_trust_orchestrator': 'Zero‑Trust Orchestration',
    'LangChain.chain': 'LangChain Operation',
    'ChatOllama.chat': 'LLM Generation',
    'retrieve_and_rerank': 'Vector Retrieval & Reranking',
    'document_ingestion': 'Document Ingested into Vault',
    'health_check': 'System Health Check',
  };
  return summaryMap[spanName] || `Executed span: ${spanName}`;
}

export default function TraceGraph({ traces = [], onNodeClick, selectedSpanId }: TraceGraphProps): React.JSX.Element {
  const isControlled = Boolean(onNodeClick);
  const [internalSelectedTrace, setInternalSelectedTrace] = useState<Trace | null>(null);

  const graphElements = useMemo(() => {
    const formattedNodes: Node[] = [];
    const formattedEdges: Edge[] = [];

    traces.forEach((trace) => {
      const isSelected = isControlled ? selectedSpanId === trace.span_id : internalSelectedTrace?.span_id === trace.span_id;
      const isError = trace.status === 'ERROR';

      formattedNodes.push({
        id: trace.span_id,
        position: { x: 0, y: 0 },
        data: {
          label: (
            <div className={`p-3 rounded-lg border text-left min-w-[220px] transition-all bg-card ${isSelected ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]' : isError ? 'border-destructive' : 'border-border'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isError ? 'text-destructive' : 'text-primary'}`}>
                  {trace.name}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {((trace.end_time_ns - trace.start_time_ns) / 1000000).toFixed(1)}ms
                </span>
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {trace.attributes?.['semantic.summary'] || getFallbackSummary(trace.name)}
              </div>
            </div>
          ),
        },
        style: { border: 'none', background: 'transparent', padding: 0 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      if (trace.parent_span_id) {
        formattedEdges.push({
          id: `e-${trace.parent_span_id}-${trace.span_id}`,
          source: trace.parent_span_id,
          target: trace.span_id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: isError ? 'var(--destructive)' : 'var(--primary)', strokeWidth: 2 },
        });
      }
    });

    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 80 });
    g.setDefaultEdgeLabel(() => ({}));

    formattedNodes.forEach(node => g.setNode(node.id, { width: 250, height: 80 }));
    formattedEdges.forEach(edge => g.setEdge(edge.source, edge.target));
    dagre.layout(g);

    const laidOutNodes = formattedNodes.map(node => {
      const nodeLayout = g.node(node.id);
      return { ...node, position: { x: nodeLayout.x - 125, y: nodeLayout.y - 40 } };
    });

    return { nodes: laidOutNodes, edges: formattedEdges };
  }, [traces, selectedSpanId, internalSelectedTrace, isControlled]);

  if (traces.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center font-mono text-xs uppercase tracking-widest text-muted-foreground bg-card border-border">
        [ No transaction traces available for node rendering ]
      </Card>
    );
  }

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={graphElements.nodes}
        edges={graphElements.edges}
        onNodeClick={(_, node) => {
          const target = traces.find(t => t.span_id === node.id);
          if (target) {
            if (isControlled && onNodeClick) {
              onNodeClick(node.id);
            } else {
              setInternalSelectedTrace(target);
            }
          }
        }}
        fitView
      >
        <Background gap={20} size={1} color="var(--muted)" />
        <Controls showInteractive={false} />
        <MiniMap nodeColor="var(--primary)" maskColor="var(--background)" />
      </ReactFlow>

      {!isControlled && internalSelectedTrace && (
        <div className="absolute inset-0 z-50 p-6 bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <TraceDetail trace={internalSelectedTrace} onClose={() => setInternalSelectedTrace(null)} />
        </div>
      )}
    </div>
  );
}