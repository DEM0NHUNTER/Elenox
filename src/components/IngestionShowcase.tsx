/**
Interactive visualization of the Universal Ingestion Engine.
Demonstrates how different document types are securely parsed, embedded,
and cryptographically shredded, reinforcing the zero-trust data handling promise.
Updated: Replaced custom CSS classes with semantic Tailwind theme utilities.
*/
import React, { useState, useEffect } from 'react';

type DocType = 'pdf' | 'image' | 'excel';

interface PipelineStep {
  id: string;
  label: string;
  detail: string;
  engine?: string;
}

const ingestionPipelines: Record<DocType, PipelineStep[]> = {
  pdf: [
    { id: 'ingest', label: 'Ephemeral Ingest', detail: 'Decrypted into isolated tmpfs memory boundary', engine: 'tmpfs' },
    { id: 'parse', label: 'Layout Extraction', detail: 'Structural analysis and text extraction', engine: 'Unstructured/Granite-Docling' },
    { id: 'embed', label: 'Semantic Embedding', detail: 'Dense vector generation for hybrid search', engine: 'MiniLM' },
    { id: 'store', label: 'Vector Vault', detail: 'Indexed with BM25 Sparse + Dense vectors', engine: 'Qdrant' },
    { id: 'shred', label: 'Cryptographic Shred', detail: '3-pass DoD 5220.22-M byte overwrite', engine: 'secure_delete' },
  ],
  image: [
    { id: 'ingest', label: 'Ephemeral Ingest', detail: 'Decrypted into isolated tmpfs memory boundary', engine: 'tmpfs' },
    { id: 'parse', label: 'Optical Character Recognition', detail: 'Vision encoder extracts text from scanned docs', engine: 'Microsoft TrOCR' },
    { id: 'embed', label: 'Semantic Embedding', detail: 'Dense vector generation for hybrid search', engine: 'MiniLM' },
    { id: 'store', label: 'Vector Vault', detail: 'Indexed with BM25 Sparse + Dense vectors', engine: 'Qdrant' },
    { id: 'shred', label: 'Cryptographic Shred', detail: '3-pass DoD 5220.22-M byte overwrite', engine: 'secure_delete' },
  ],
  excel: [
    { id: 'ingest', label: 'Ephemeral Ingest', detail: 'Decrypted into isolated tmpfs memory boundary', engine: 'tmpfs' },
    { id: 'parse', label: 'Tabular Parsing', detail: 'Direct conversion to Markdown tables', engine: 'Pandas' },
    { id: 'embed', label: 'Semantic Embedding', detail: 'Dense vector generation for hybrid search', engine: 'MiniLM' },
    { id: 'store', label: 'Vector Vault', detail: 'Indexed with BM25 Sparse + Dense vectors', engine: 'Qdrant' },
    { id: 'shred', label: 'Cryptographic Shred', detail: '3-pass DoD 5220.22-M byte overwrite', engine: 'secure_delete' },
  ],
};

const docTypes: { id: DocType; label: string; icon: string }[] = [
  { id: 'pdf', label: 'PDF / Text', icon: '📄' },
  { id: 'image', label: 'Scanned Image', icon: '🖼️' },
  { id: 'excel', label: 'Structured Data', icon: '📊' },
];

export default function IngestionShowcase(): React.JSX.Element {
  const [activeType, setActiveType] = useState<DocType>('pdf');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const steps = ingestionPipelines[activeType];

  const handleTypeChange = (type: DocType) => {
    setActiveType(type);
    setActiveStepIndex(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section id="ingestion" className="py-24 px-8 max-w-7xl mx-auto text-center relative bg-background">
      <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
        Universal Ingestion Engine
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-16 text-lg">
        Select a document type to visualize the secure, ephemeral parsing pipeline. Raw data never touches persistent storage.
      </p>

      <div className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {docTypes.map((type) => (
            <button
              key={type.id}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                activeType === type.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-background'
              }`}
              onClick={() => handleTypeChange(type.id)}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {steps.map((step, index) => {
            const isActive = index === activeStepIndex;
            const isComplete = index < activeStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isActive ? 'border-primary bg-primary/5' : isComplete ? 'border-border bg-muted' : 'border-border bg-card'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-primary' : isComplete ? 'bg-primary/50' : 'bg-muted-foreground'}`} />
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${isComplete ? 'bg-primary/50' : 'bg-border'}`} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`font-semibold ${isActive ? 'text-primary' : 'text-card-foreground'}`}>{step.label}</span>
                    {step.engine && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                        {step.engine}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}