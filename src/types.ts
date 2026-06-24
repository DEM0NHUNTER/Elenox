/**
 * Shared Type interface mappings defining multi-tenant workspace structures.
 */
export type CitationVerdict =
  | 'EXACT_MATCH'
  | 'FUZZY_MATCH'
  | 'SEMANTIC_MATCH'
  | 'HALLUCINATION'
  | 'NO_SOURCE_PROVIDED'
  | 'VALID_REFUSAL';

export interface Citation {
  generated_sentence: string;
  source_quote: string;
  is_hallucination: boolean;
  match_score: number;
  verdict: CitationVerdict;
  document_name?: string;
  page_number?: number;
  source_excerpt?: string;
  breakdown?: {
    exact: number;
    fuzzy: number;
    numeric: number;
    semantic: number;
  };
}

export interface SessionEntry {
  id: string;
  timestamp: string;
  query: string;
  citations: Citation[];
  signature?: string;
}

export interface Session {
  id: string;
  name: string;
  createdAt: string;
  entries: SessionEntry[];
}