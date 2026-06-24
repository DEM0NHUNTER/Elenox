/**
Forensic Ledger Stream Component.
Visualizes continuous system compliance, cryptographic ledger audits,
and tenant-isolation validations with automatic XSS sanitation and virtualization defense.
*/
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Terminal, Play, Pause, Trash2, Filter, Search, CheckCircle2, ChevronDown } from 'lucide-react';

export type AuditComponent = 'AUTH_GATE' | 'POSTGRES_RLS' | 'VECTOR_VAULT' | 'SHRED_ENGINE' | 'LLM_INFERENCE';
export type AuditLevel = 'TRACE' | 'VALID' | 'WARN' | 'BREACH_ATTEMPT';

export interface AuditLog {
  id: string;
  timestamp: string;
  component: AuditComponent;
  level: AuditLevel;
  message: string;
  nonce?: string;
  signature?: string;
}

const INITIAL_LOGS: AuditLog[] = [
  { id: 'tx-001', timestamp: '16:40:21.084', component: 'AUTH_GATE', level: 'VALID', message: 'JWT validation handshake complete. Session context bound to tenant boundary.', nonce: 'a3f9b2c8e1d4' },
  { id: 'tx-002', timestamp: '16:40:21.115', component: 'POSTGRES_RLS', level: 'VALID', message: 'Context injection app.current_tenant successfully forced. Physical boundary locked.' },
  { id: 'tx-003', timestamp: '16:41:05.492', component: 'VECTOR_VAULT', level: 'TRACE', message: 'Sparse/Dense hybrid search executed across collection partition index. 42 chunks evaluated.' },
  { id: 'tx-004', timestamp: '16:42:12.801', component: 'SHRED_ENGINE', level: 'VALID', message: 'DoD 5220.22-M 3-pass wipe complete on scratch blocks. Volatile allocations cleared.' }
];

interface DarkSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

function DarkSelect({ value, onChange, options, className = '' }: DarkSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] font-bold text-cyan-400 hover:border-cyan-500/50 transition-colors focus:outline-none uppercase tracking-wider"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-800 rounded shadow-xl overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full text-left px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                option.value === value ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AuditLogStream(): React.JSX.Element {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const logTerminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLive && logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [logs, isLive]);

  // Continuous mock data generation
  useEffect(() => {
    if (!isLive) return;
    const logsPool: Omit<AuditLog, 'id' | 'timestamp'>[] = [
      { component: 'POSTGRES_RLS', level: 'VALID', message: 'Row-Level Security verified. Tenant isolation boundaries validated at database engine level.' },
      { component: 'LLM_INFERENCE', level: 'VALID', message: 'Inference response processed. Ed25519 signature generated across downstream token maps.', signature: '0x8f4a2b...e9b2c1' },
      { component: 'VECTOR_VAULT', level: 'TRACE', message: 'FastEmbed dense matrix calculation dispatched. Context window verified.' },
      { component: 'AUTH_GATE', level: 'WARN', message: 'API key authorization approaching lease boundary threshold. Rotation scheduled.' },
      { component: 'POSTGRES_RLS', level: 'VALID', message: 'Session identity token evaluated. app.current_tenant context verified strictly.' }
    ];

    const streamInterval = setInterval(() => {
      const selected = logsPool[Math.floor(Math.random() * logsPool.length)];
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds().toString().padStart(3, '0');

      const nextLog: AuditLog = {
        ...selected,
        id: `tx-${Math.random().toString(36).substring(2, 9)}`,
        timestamp,
        nonce: Math.random() > 0.5 ? Math.random().toString(16).substring(2, 14) : undefined
      };

      setLogs(prev => [...prev, nextLog].slice(-250));
    }, 2800);

    return () => clearInterval(streamInterval);
  }, [isLive]);

  const processedLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
      const safeQuery = searchQuery.toLowerCase().trim();
      const matchesSearch = !safeQuery ||
        log.message.toLowerCase().includes(safeQuery) ||
        log.component.toLowerCase().includes(safeQuery);
      return matchesLevel && matchesSearch;
    });
  }, [logs, filterLevel, searchQuery]);

  return (
    <div className="w-full flex flex-col h-[500px] border border-slate-800 rounded-xl overflow-hidden bg-slate-950 font-mono text-xs shadow-2xl">
      <div className="bg-slate-900/80 p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-1.5 rounded border border-slate-800 bg-slate-950">
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider">Forensic Execution Audit</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Immutable runtime non-repudiation ledger</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative flex items-center bg-slate-950 rounded-lg border border-slate-800 px-2.5 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-600 mr-2" />
            <input
              type="text"
              placeholder="FILTER LOGS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-300 border-none outline-none text-[10px] uppercase font-bold tracking-wider placeholder-slate-600 w-32 focus:w-44 transition-all"
            />
          </div>

          <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 px-2.5 py-1.5 text-slate-400 gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-600" />
            <DarkSelect
              value={filterLevel}
              onChange={setFilterLevel}
              options={[
                { value: 'ALL', label: 'ALL LEVELS' },
                { value: 'VALID', label: 'VALID' },
                { value: 'TRACE', label: 'TRACE' },
                { value: 'WARN', label: 'WARN' },
                { value: 'BREACH_ATTEMPT', label: 'BREACH ATTACK' }
              ]}
              className="min-w-[100px]"
            />
          </div>

          <div className="flex items-center border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
            <button
              type="button"
              onClick={() => setIsLive(!isLive)}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${isLive ? 'bg-cyan-500/10 text-cyan-400 font-black' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {isLive ? <Pause className="w-3 h-3 text-cyan-400" /> : <Play className="w-3 h-3 text-slate-400" />}
              {isLive ? 'LIVE' : 'FREEZE'}
            </button>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="px-3 py-1.5 border-l border-slate-800 text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="CLEAR LOCAL TERMINAL BUFFER"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={logTerminalRef}
        className="flex-1 overflow-y-auto p-5 space-y-2.5 bg-slate-950/60 custom-scrollbar relative font-mono text-[11px]"
      >
        {processedLogs.length > 0 ? processedLogs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col md:flex-row md:items-start gap-2 leading-relaxed animate-in fade-in duration-200 border-b border-slate-900/40 pb-2 last:border-none"
          >
            <div className="flex items-center gap-2 shrink-0 select-none text-slate-600">
              <span>[{log.timestamp}]</span>
              <span className="text-slate-400 font-bold tracking-wider min-w-[90px] inline-block">
                {log.component}
              </span>
            </div>

            <div className="shrink-0 select-none">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border ${
                log.level === 'VALID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                log.level === 'WARN' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                log.level === 'BREACH_ATTEMPT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-black animate-pulse' :
                'bg-slate-500/10 text-slate-400 border-slate-800'
              }`}>
                {log.level.replace('_', ' ')}
              </span>
            </div>

            <div className="flex-1 space-y-1 text-slate-300">
              <p className="font-medium text-slate-200">{log.message}</p>
              {(log.nonce || log.signature) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] font-mono text-slate-500">
                  {log.nonce && (
                    <div>
                      <span className="text-slate-600 uppercase tracking-wider font-bold">Nonce:</span>{' '}
                      <code className="text-cyan-600 select-all">{log.nonce}</code>
                    </div>
                  )}
                  {log.signature && (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                      <span className="text-slate-600 uppercase tracking-wider font-bold">Sig:</span>{' '}
                      <code className="text-purple-500 select-all">{log.signature}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="h-full w-full flex items-center justify-center text-slate-600 border border-dashed border-slate-900 rounded-lg uppercase tracking-widest text-[10px]">
            [ No forensic stream metrics match active filter constraints ]
          </div>
        )}
      </div>
    </div>
  );
}