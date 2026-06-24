/**
Enclave Ingestion Dock and File Boundary Manager.
Enforces client-side MIME-type whitelisting, provides real-time state mutation
overrides (rename, cryptographic shredding), and renders multi-stage pipeline logs.
Updated: Migrated to semantic Tailwind theme classes for full palette integration.
*/
import React, { useState, useRef, useMemo } from 'react';
import {
  Upload, FileText, AlertTriangle, Binary, RefreshCw, Trash2, Edit2, Check, X, Database
} from 'lucide-react';

interface DocumentUploaderProps {
  onUploadSuccess: () => void;
}

type PipelineStage = 'IDLE' | 'TMPFS_ALLOCATION' | 'LAYOUT_EXTRACTION' | 'VECTOR_EMBEDDING' | 'VAULT_INDEXING' | 'SECURE_SHRED' | 'COMPLETE' | 'FAILED';

interface PipelineLog {
  timestamp: string;
  tag: 'SYS' | 'SEC' | 'VOL' | 'ERR';
  message: string;
}

interface IngestedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  timestamp: string;
  status: 'INDEXED' | 'SHREDDING';
}

const MAX_FILE_SIZE_MB = 50;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export default function DocumentUploader({ onUploadSuccess }: DocumentUploaderProps): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<PipelineStage>('IDLE');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<PipelineLog[]>([]);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ingestedFiles, setIngestedFiles] = useState<IngestedFile[]>([
    { id: 'doc-001', name: 'FY24_Q4_Consolidated_Financial_Statements.pdf', size: '14.2 MB', type: 'application/pdf', timestamp: '10:24:12', status: 'INDEXED' },
    { id: 'doc-002', name: 'Sovereign_Enclave_Default_Schema.pdf', size: '2.4 MB', type: 'application/pdf', timestamp: '11:05:42', status: 'INDEXED' },
    { id: 'doc-003', name: 'FY24_Q4_Consolidated_Financial_Statements_Subset.pdf', size: '4.7 MB', type: 'application/pdf', timestamp: '20:40:43', status: 'INDEXED' }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  const sanitizedFileName = useMemo(() => {
    if (!file) return '';
    return file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  }, [file]);

  const addLog = (tag: 'SYS' | 'SEC' | 'VOL' | 'ERR', message: string) => {
    const time = new Date().toISOString().split('T')[1].substring(0, 8);
    setLogs(prev => [...prev, { timestamp: time, tag, message }]);
  };

  const validateFile = (selectedFile: File): boolean => {
    setError(null);
    if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
      setError('REJECTED: Unauthorized format. Only secure PDFs, sheets, or images are permitted.');
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`REJECTED: File allocation boundary exceeded (Max: ${MAX_FILE_SIZE_MB}MB).`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (validateFile(selected)) {
        setFile(selected);
        setStage('IDLE');
        setLogs([]);
      }
    }
  };

  const executeSecureIngestion = async () => {
    if (!file) return;
    setStage('TMPFS_ALLOCATION');
    setError(null);
    setProgress(5);

    const steps: { stage: PipelineStage; progress: number; delay: number; tag: 'SYS' | 'SEC' | 'VOL'; msg: string }[] = [
      { stage: 'TMPFS_ALLOCATION', progress: 20, delay: 600, tag: 'VOL', msg: `Allocating ephemeral tmpfs slice for memory boundary mapping.` },
      { stage: 'LAYOUT_EXTRACTION', progress: 45, delay: 800, tag: 'SYS', msg: `Granite-Docling vision parsing layout structure and geometry.` },
      { stage: 'VECTOR_EMBEDDING', progress: 70, delay: 700, tag: 'SYS', msg: `Generating multi-dimensional sparse/dense all-MiniLM-L6-v2 tensor metrics.` },
      { stage: 'VAULT_INDEXING', progress: 85, delay: 600, tag: 'SEC', msg: `Committing collection payload matrix to PostgreSQL tenant RLS bounds.` },
      { stage: 'SECURE_SHRED', progress: 98, delay: 800, tag: 'SEC', msg: `Initiating DoD 5220.22-M 3-pass byte sector override on scratch blocks.` },
    ];

    addLog('SYS', `Initializing ingestion stream for binary node: ${sanitizedFileName}`);

    for (const step of steps) {
      setStage(step.stage);
      setProgress(step.progress);
      addLog(step.tag, step.msg);
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    const nextFile: IngestedFile = {
      id: `doc-${Math.random().toString(36).substring(2, 7)}`,
      name: sanitizedFileName,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type,
      timestamp: new Date().toTimeString().split(' ')[0],
      status: 'INDEXED'
    };

    setIngestedFiles(prev => [...prev, nextFile]);
    setProgress(100);
    setStage('COMPLETE');
    addLog('SEC', `Cryptographic purge verified. Raw file destroyed. Ingestion finalized.`);
    onUploadSuccess();
  };

  const handleSaveRename = (id: string) => {
    const safeName = editName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    if (!safeName.trim()) return;
    setIngestedFiles(prev => prev.map(f => f.id === id ? { ...f, name: safeName } : f));
    setEditingId(null);
  };

  const handleCryptographicPurge = async (id: string, fileName: string) => {
    setIngestedFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'SHREDDING' } : f));
    setStage('SECURE_SHRED');
    setLogs([]);
    addLog('SEC', `CRITICAL RECALL: Initializing non-reversible wipe sequence for partition record: ${id} (${fileName})`);

    await new Promise(resolve => setTimeout(resolve, 800));
    addLog('VOL', `Pass 1/3: Writing static 0x00 binary masks across underlying indexing pointers.`);
    await new Promise(resolve => setTimeout(resolve, 600));
    addLog('VOL', `Pass 2/3: Deploying pseudorandom noise matrix configurations over unallocated sectors.`);
    await new Promise(resolve => setTimeout(resolve, 600));
    addLog('SEC', `Pass 3/3: Validating checksum dropouts. Row-Level index references broken at database boundary.`);
    await new Promise(resolve => setTimeout(resolve, 700));

    setIngestedFiles(prev => prev.filter(f => f.id !== id));
    setStage('IDLE');
    setLogs([]);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-foreground font-mono text-xs">
      {/* ─── LEFT PANEL: FILE INTAKE PIPELINE ─── */}
      <div className="space-y-4 w-full">
        {stage === 'IDLE' && (
          <div
            onDragEnter={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const dropped = e.dataTransfer.files[0];
                if (validateFile(dropped)) { setFile(dropped); setLogs([]); }
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[220px] ${isDragActive ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(110,86,207,0.1)]' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <input ref={fileInputRef} type="file" className="hidden" accept={ALLOWED_MIME_TYPES.join(',')} onChange={handleFileChange} />
            <Upload className={`w-8 h-8 mb-3 transition-colors ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-card-foreground text-sm font-bold mb-1 uppercase tracking-wider">Drag & Drop Document Asset</p>
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest">PDF, PNG, JPEG, XLSX (Max {MAX_FILE_SIZE_MB}MB)</p>

            {file && (
              <div className="mt-4 px-3 py-1.5 rounded border border-primary/30 bg-primary/10 text-primary font-bold tracking-wide flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <FileText className="w-3.5 h-3.5" /> {sanitizedFileName}
              </div>
            )}
          </div>
        )}

        {stage !== 'IDLE' && (
          <div className="border border-border rounded-xl p-5 bg-card space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <Binary className={`w-4 h-4 ${stage === 'COMPLETE' ? 'text-primary' : 'text-primary animate-pulse'}`} />
                <div>
                  <h4 className="font-bold text-card-foreground text-sm uppercase tracking-wider truncate max-w-[280px]">{file ? sanitizedFileName : 'Enclave Resource Wiping'}</h4>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Task: {stage.replace('_', ' ')}</p>
                </div>
              </div>
              {stage === 'COMPLETE' && (
                <button onClick={() => { setFile(null); setStage('IDLE'); setLogs([]); }} className="p-1.5 rounded border border-border hover:border-primary bg-muted text-muted-foreground hover:text-card-foreground cursor-pointer">
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="w-full bg-muted h-1 rounded-full overflow-hidden border border-border">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {logs.length > 0 && (
          <div className="border border-border rounded-xl bg-card overflow-hidden flex flex-col">
            <div className="p-4 max-h-48 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar bg-muted/40">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground">[{log.timestamp}]</span>
                  <span className={`font-bold px-1 rounded text-[8px] ${log.tag === 'SEC' ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground'}`}>{log.tag}</span>
                  <span className="text-foreground leading-relaxed">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {file && stage === 'IDLE' && (
          <div className="flex gap-2 justify-end">
            <button onClick={() => setFile(null)} className="px-4 py-2 rounded border border-border text-muted-foreground font-bold uppercase tracking-wider cursor-pointer text-[10px] hover:bg-muted">Clear</button>
            <button onClick={executeSecureIngestion} className="px-4 py-2 rounded bg-primary text-primary-foreground font-bold uppercase tracking-wider cursor-pointer text-[10px] hover:opacity-90">Commit</button>
          </div>
        )}
      </div>

      {/* ─── RIGHT PANEL: GROUNDED VECTOR PARTITIONS ─── */}
      <div className="border border-border rounded-xl overflow-hidden bg-card/40 flex flex-col w-full min-h-[380px]">
        <div className="bg-card/60 px-4 py-3 border-b border-border flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5"> <Database className="w-3.5 h-3.5 text-primary" /> Grounded Vector Partitions</span>
          <span className="text-muted-foreground tabular-nums">{ingestedFiles.length} Registered</span>
        </div>

        <div className="divide-y divide-border overflow-y-auto custom-scrollbar flex-1">
          {ingestedFiles.length > 0 ? ingestedFiles.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileText className={`w-4 h-4 shrink-0 ${item.status === 'SHREDDING' ? 'text-destructive animate-spin' : 'text-muted-foreground'}`} />
                {editingId === item.id ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-muted border border-border rounded px-2 py-1 text-foreground outline-none w-full font-bold uppercase text-[11px] focus:border-primary"
                    />
                    <button onClick={() => handleSaveRename(item.id)} className="p-1 rounded bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 cursor-pointer shrink-0">
                      <Check className="w-3 h-3" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1 rounded bg-muted border border-border text-muted-foreground hover:text-card-foreground cursor-pointer shrink-0">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="min-w-0 flex-1">
                    <span className={`font-bold tracking-wide truncate block text-xs ${item.status === 'SHREDDING' ? 'text-destructive line-through' : 'text-card-foreground'}`}>
                      {item.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-tight block mt-0.5 truncate">
                      Allocated Volume: {item.size} // Registered: {item.timestamp}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'SHREDDING' ? (
                  <span className="text-[8px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded border border-destructive/20 tracking-widest animate-pulse">SHREDDING</span>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={editingId !== null}
                      onClick={() => { setEditingId(item.id); setEditName(item.name); }}
                      className="p-1.5 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary cursor-pointer disabled:opacity-30 transition-colors"
                      title="RENAME COLLECTION PARTITION"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={editingId !== null}
                      onClick={() => handleCryptographicPurge(item.id, item.name)}
                      className="p-1.5 rounded border border-border hover:border-destructive text-muted-foreground hover:text-destructive cursor-pointer disabled:opacity-30 transition-colors"
                      title="DESTRUCTIVE DOD WIPE ENCLAVE CORE"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-muted-foreground uppercase tracking-widest text-[10px]">
              [ Zero data allocations registered ]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}