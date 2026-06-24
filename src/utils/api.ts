/**
 * Shared API fetch utility hook.
 * Abstracts default request configurations, enforcing multi-tenant credential inclusion across sessions.
 */
import { useCallback } from 'react';

export type ApiFetchFn = (url: string, options?: RequestInit) => Promise<Response>;

export function useApi(): ApiFetchFn {
  const apiFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    return fetch(url, { ...options, credentials: 'include' });
  }, []);

  return apiFetch;
}