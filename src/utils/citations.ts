/**
 * Normalization utilities for processing raw RAG citation models.
 * Enforces strict typing boundaries and populates default properties for downstream components.
 */
import type { Citation, CitationVerdict } from '../types';

export const normalizeCitations = (citations: any[]): Citation[] => {
  if (!Array.isArray(citations)) return [];

  return citations.map(c => {
    let safe = { ...c };
    if (safe.generated_sentence && typeof safe.generated_sentence === 'object') {
      safe = { ...safe, ...safe.generated_sentence };
    }

    return {
      generated_sentence: String(safe.generated_sentence ?? 'Data missing'),
      source_quote: String(safe.source_quote ?? 'No source provided'),
      is_hallucination: Boolean(safe.is_hallucination),
      match_score: Number(safe.match_score) || 0,
      verdict: String(safe.verdict ?? 'UNKNOWN') as CitationVerdict,
      document_name: safe.document_name ? String(safe.document_name) : undefined,
      page_number: safe.page_number ? Number(safe.page_number) : undefined,
      source_excerpt: safe.source_excerpt ? String(safe.source_excerpt) : undefined,
      breakdown: safe.breakdown ? {
        exact: Number(safe.breakdown.exact) || 0,
        fuzzy: Number(safe.breakdown.fuzzy) || 0,
        numeric: Number(safe.breakdown.numeric) || 0,
        semantic: Number(safe.breakdown.semantic) || 0,
      } : undefined,
    };
  });
};