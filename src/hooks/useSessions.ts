/**
 * Hook package tracking session collections and managing optimistic caching modifications.
 * Requires package: @tanstack/react-query
 */
import { useQuery, useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useApi } from '../utils/api';
import type { Session } from '../types';

interface UseSessionsReturn {
  sessions: Session[];
  isLoading: boolean;
  isError: boolean;
  deleteSession: UseMutationResult<void, Error, string, { previousSessions: Session[] | undefined }>;
}

export function useSessions(): UseSessionsReturn {
  const apiFetch = useApi();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading, isError } = useQuery<Session[], Error>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await apiFetch('/api/sessions');
      if (!res.ok) throw new Error('Failed to fetch session collections index');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });

  const deleteSession = useMutation<void, Error, string, { previousSessions: Session[] | undefined }>({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/sessions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Session removal transaction rejected');
    },
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ['sessions'] });
      const previousSessions = queryClient.getQueryData<Session[]>(['sessions']);

      queryClient.setQueryData<Session[]>(['sessions'], (old) =>
        old?.filter((s: Session) => s.id !== deletedId) || []
      );

      return { previousSessions };
    },
    onError: (_err: Error, _deletedId: string, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(['sessions'], context.previousSessions);
      }
      toast.error('Eviction failure. Reverting layout state matrices.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  return { sessions, isLoading, isError, deleteSession };
}