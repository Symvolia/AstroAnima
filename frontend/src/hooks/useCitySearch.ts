import { useEffect, useState } from 'react';
import { searchCitiesWorld } from '../services/citySearch';
import { useStore } from '../store/useStore';
import type { GeoPlace } from '../types';

export function useCitySearch(query: string, enabled: boolean) {
  const lang = useStore((s) => s.language);
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      void searchCitiesWorld(query, lang, 12, controller.signal)
        .then((rows) => {
          if (!controller.signal.aborted) setResults(rows);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 280);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, lang, enabled]);

  return { results, loading };
}
