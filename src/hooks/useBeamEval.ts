import { useCallback, useEffect, useRef, useState } from "react";
import { evalBeamApi, type EvalBeamPayload } from "@/lib/beams";

interface BeamEvalState {
  results: Record<string, any>;
  loading: Record<string, boolean>;
  error: Record<string, string>;
}

/**
 * Debounced beam evaluation per key ("groupIndex-beamIndex").
 * `requestEval` takes a factory so dimensions are read at execution time.
 * Returning `null` from the factory clears any previous result for the key.
 */
export function useBeamEval(): BeamEvalState & {
  clearEval: (key: string) => void;
  requestEval: (key: string, buildPayload: () => EvalBeamPayload | null) => void;
} {
  const [state, setState] = useState<BeamEvalState>({
    results: {},
    loading: {},
    error: {},
  });
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const timers = timersRef.current;
    return () => Object.values(timers).forEach(clearTimeout);
  }, []);

  const removeFrom = (
    record: Record<string, any>,
    key: string,
  ): Record<string, any> => {
    const next = { ...record };
    delete next[key];
    return next;
  };

  const clearEval = useCallback((key: string) => {
    setState(({ results, loading, error }) => ({
      results: removeFrom(results, key),
      loading: removeFrom(loading, key),
      error: removeFrom(error, key),
    }));
  }, []);

  const requestEval = useCallback(
    (key: string, buildPayload: () => EvalBeamPayload | null) => {
      setTimeout(() => {
        const payload = buildPayload();
        if (!payload) {
          clearEval(key);
          return;
        }

        if (timersRef.current[key]) clearTimeout(timersRef.current[key]);
        setState((p) => ({ ...p, loading: { ...p.loading, [key]: true }, error: removeFrom(p.error, key) }));

        timersRef.current[key] = setTimeout(async () => {
          try {
            const result = await evalBeamApi(payload);
            setState((p) => ({
              ...p,
              results: { ...p.results, [key]: result },
              error: removeFrom(p.error, key),
            }));
          } catch (err: any) {
            setState((p) => ({
              ...p,
              error: { ...p.error, [key]: err.message || "Eval failed" },
              results: removeFrom(p.results, key),
            }));
          } finally {
            setState((p) => ({
              ...p,
              loading: { ...p.loading, [key]: false },
            }));
          }
        }, 600);
      }, 0);
    },
    [clearEval],
  );

  return { ...state, clearEval, requestEval };
}
