/**
 * Custom hook interfacing with TanStack Query.
 * Fetches conversational records linked to an active target chat session identifier.
 * Requires package: @tanstack/react-query
 */
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useApi } from '../utils/api';
import type { SessionEntry } from '../types';

export function useActiveSession(sessionId: string | null): UseQueryResult<SessionEntry[], Error> {
  const apiFetch = useApi();

  return useQuery<SessionEntry[], Error>({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const res = await apiFetch(`/api/sessions/${sessionId}`);
      if (!res.ok) throw new Error('Failed to load session transaction traces');
      const data = await res.json();
      return data.entries || [];
    },
    enabled: Boolean(sessionId),
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}