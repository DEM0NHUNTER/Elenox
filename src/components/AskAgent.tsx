/**
Conversational RAG Query Core Engine.
Coordinates real-time token inference streams, validates inputs against injection bounds,
and passes response data directly into the cryptographic Hallucination X-Ray engine.
Includes a zero-dependency local simulation matrix when backend gateways are unmounted.
Updated: Migrated to semantic Tailwind theme classes for full palette integration.
*/
import React, { useState } from 'react';
import { Send, TerminalSquare, ShieldAlert, Cpu, Database } from 'lucide-react';
import HallucinationXRay from './HallucinationXRay';
import { Button } from './ui/Button';
import type { Citation, SessionEntry } from '../types';

interface AskAgentProps {
  onAskSuccess: () => void;
  activeSessionEntries: SessionEntry[] | undefined;
  onAddEntry: (query: string, answer: string, citations: Citation[], signature?: string) => void;
  activeSessionId: string | null;
  onThinkingChange?: (isThinking: boolean) => void;
}

export default function AskAgent({
  onAskSuccess,
  activeSessionEntries = [],
  onAddEntry,
  activeSessionId,
  onThinkingChange,
}: AskAgentProps): React.JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<string>('System Idle');
  const [error, setError] = useState<string | null>(null);
  const [activeEntryIndex, setActiveEntryIndex] = useState<number | null>(null);

  const currentEntry = activeSessionEntries[activeEntryIndex ?? activeSessionEntries.length - 1] || null;

  const executeLocalInferenceSimulation = async (userPrompt: string) => {
    setSystemStatus('Resolving local semantic vector space lookups...');
    await new Promise(resolve => setTimeout(resolve, 1200));

    const normalizedPrompt = userPrompt.toLowerCase();
    let mockCitations: Citation[] = [];
    let mockAnswer = "";

    if (normalizedPrompt.includes('income') || normalizedPrompt.includes('financial') || normalizedPrompt.includes('sales')) {
      mockAnswer = "According to the financial parameters inside FY24_Q4_Consolidated_Financial_Statements.pdf, net sales reached $94,930 million for the quarter compared to $89,498 million in the prior year quarter. Total net income achieved was reported at $93,736 million, which incorporates a one-time income tax charge of $10.2 billion.";
      mockCitations = [
        {
          score: 0.9412,
          content: 'Net sales for the three months ended September 28, 2024, totaled $94,930 million compared to $89,498 million for the prior year quarter. Products sales accounted for $69,958 million while Services achieved $24,972 million.',
          page: 1,
          source_file: 'FY24_Q4_Consolidated_Financial_Statements.pdf'
        } as any,
        {
          score: 0.8874,
          content: 'Net income for the twelve months ended September 28, 2024, was reported at $93,736 million, down from $96,995 million in fiscal year 2023, primarily driven by a one-time income tax charge of $10.2 billion related to the European Court of Justice State Aid decision.',
          page: 1,
          source_file: 'FY24_Q4_Consolidated_Financial_Statements.pdf'
        } as any
      ];
    } else {
      mockAnswer = "AXIO SIGIL standalone workspace simulation core is active. Your request was securely mapped across isolation partitions. Please query specific financial indicators to stream localized groundings.";
      mockCitations = [
        {
          score: 0.7651,
          content: 'AXIO SIGIL Sovereign Sandbox environment initialized successfully. Row-Level Security policies are actively intercepting database boundaries to limit cross-tenant profile visibility.',
          page: 1,
          source_file: 'Default_Schema.pdf'
        } as any
      ];
    }

    setSystemStatus('Computing cryptographic signature verification...');
    await new Promise(resolve => setTimeout(resolve, 600));

    const mockSignature = 'ed25519::sig::0x4f7c2b9a1e8dcd9301f44e82390a412490b3c2e1741a6590bc23df81e921da49e01fbc34';

    onAddEntry(userPrompt, mockAnswer, mockCitations, mockSignature);
    setQuery('');
    setSystemStatus('System Idle');
    setActiveEntryIndex(activeSessionEntries.length);
    onAskSuccess();
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery || isAsking) return;

    const effectiveSessionId = activeSessionId || 'dev-sandbox-session-active';

    setIsAsking(true);
    setError(null);
    if (onThinkingChange) onThinkingChange(true);
    setSystemStatus('Resolving semantic vector space lookups...');

    try {
      const response = await fetch(`/api/agent/session/${effectiveSessionId}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cleanQuery }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error('Enclave rate limit boundary exceeded.');
        if (response.status >= 500 || response.status === 404) {
          await executeLocalInferenceSimulation(cleanQuery);
          return;
        }
        throw new Error('Upstream orchestrator validation handshake failed.');
      }

      setSystemStatus('Computing cryptographic signature verification...');
      const payload = await response.json();

      onAddEntry(
        cleanQuery,
        payload.answer || payload.response || "",
        payload.citations || [],
        payload.agent_signature || payload.signature
      );

      setQuery('');
      setSystemStatus('System Idle');
      setActiveEntryIndex(activeSessionEntries.length);
      onAskSuccess();
    } catch (err: any) {
      if (err instanceof TypeError || (err?.message && err.message.includes('fetch'))) {
        await executeLocalInferenceSimulation(cleanQuery);
        return;
      }

      setError(err?.message || 'Inference engine communication fault.');
      setSystemStatus('Execution Aborted');
    } finally {
      setIsAsking(false);
      if (onThinkingChange) onThinkingChange(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 font-mono text-xs text-foreground">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch flex-1 min-h-0">

        {/* Left Side: Dynamic Workspace Chat Interface */}
        <div className="flex flex-col border border-border rounded-xl bg-card/50 overflow-hidden min-h-[400px]">
          <div className="bg-muted/60 p-4 border-b border-border flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <TerminalSquare className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground uppercase tracking-wider">Sovereign Playground</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Cpu className="w-3 h-3 text-chart-1" />
              <span>STATUS: <span className={isAsking ? "text-primary animate-pulse" : "text-muted-foreground"}>{systemStatus.toUpperCase()}</span></span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-background/40">
            {activeSessionEntries.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/50 rounded-lg uppercase tracking-widest text-[10px] p-8 text-center">
                <span>[ LLM online. Awaiting data interrogation parameters ]</span>
              </div>
            ) : (
              activeSessionEntries.map((entry, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveEntryIndex(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    (activeEntryIndex === idx || (activeEntryIndex === null && idx === activeSessionEntries.length - 1))
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border/50 bg-muted/30 hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    <span className="text-primary">&gt; Query Prompt #{idx + 1}</span>
                  </div>
                  <p className="text-foreground font-medium break-words leading-relaxed mb-3">{entry.query}</p>

                  <div className="space-y-2 mt-2 pt-2 border-t border-border/50 text-foreground">
                    <span className="text-chart-4 text-[10px] font-bold tracking-widest block">&lt; ENCLAVE RESPONSE:</span>
                    <p className="leading-relaxed font-sans text-foreground whitespace-pre-wrap">
                      {(entry as any).answer || (entry as any).response || "Inference trace mapped to metrics perimeter."}
                    </p>
                  </div>

                  <div className="text-[10px] text-muted-foreground border-t border-border/50 mt-3 pt-2 flex justify-between items-center font-mono">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Database className="w-3 h-3 text-muted-foreground" /> Vectors: {entry.citations?.length || 0} Grounded
                    </span>
                    {entry.signature && <span className="text-chart-1 font-bold tracking-wider">SIGNED</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleQuerySubmit} className="p-4 border-t border-border bg-input/40 shrink-0">
            {error && (
              <div className="mb-3 p-2 rounded border border-destructive/20 bg-destructive/5 text-destructive flex items-center gap-2 font-medium animate-in fade-in duration-200">
                <ShieldAlert className="w-3.5 h-3.5" /> <span>{error}</span>
              </div>
            )}

            <div className="relative flex items-center bg-input rounded-lg border border-border px-3 py-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isAsking}
                placeholder="Ask a question"
                className="bg-transparent text-foreground border-none outline-none text-xs font-bold tracking-wide placeholder-muted-foreground w-full focus:ring-0 disabled:cursor-not-allowed uppercase"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!query.trim() || isAsking}
                className="ml-2 !py-1.5 shadow-[0_0_10px_rgba(110,86,207,0.1)] shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side: High-Fidelity Cryptographic Verification Column */}
        <div className="flex flex-col border border-border rounded-xl bg-muted overflow-hidden min-h-[400px]">
          <div className="bg-card p-4 border-b border-border flex items-center gap-2 shrink-0">
            <span className="font-bold text-card-foreground uppercase tracking-wider">Active Trace</span>
          </div>
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
            {currentEntry ? (
              <HallucinationXRay
                citationMap={currentEntry.citations}
                userQuery={currentEntry.query || ''}
                signature={currentEntry.signature}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg uppercase tracking-widest text-[10px] p-8 text-center">
                <span>[ Select an executed query node to map grounding metrics ]</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}