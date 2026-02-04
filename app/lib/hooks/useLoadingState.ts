import { useState, useCallback } from 'react';

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing loading and error states
 */
export function useLoadingState(initialLoading = false) {
  const [state, setState] = useState<LoadingState>({
    loading: initialLoading,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null });
  }, []);

  const execute = useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T | null> => {
      setState({ loading: true, error: null });
      try {
        const result = await asyncFn();
        setState({ loading: false, error: null });
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        setState({ loading: false, error: message });
        return null;
      }
    },
    [],
  );

  return {
    ...state,
    setLoading,
    setError,
    reset,
    execute,
  };
}
