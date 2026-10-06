'use client';

import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useAfterFirstPaint } from '@/hooks/use-after-first-paint';
import type { SearchFilters } from '@/lib/properties/filters';
import { LOW_CONFIDENCE, clearHandoff, fetchAiFeatures, hasFilters, parseSearch, peekHandoff, toFilters, type ParsedSearch } from './search';

/** Whether the server offers an AI feature. False until it has been asked, and when it cannot be asked. */
export function useAiFeature(name: string) {
  const enabled = useAfterFirstPaint();
  const { data } = useQuery({ queryKey: ['ai-features'], queryFn: fetchAiFeatures, staleTime: 5 * 60_000, enabled });
  return data?.[name] === true;
}

/** What the search bar says about the last description. */
export type AskNote =
  /** The filters were set from the description. `unparsed` is what found no filter. */
  | { kind: 'applied'; unparsed: string[]; currency: string | null }
  /** Not sure enough to apply: offered instead. */
  | { kind: 'suggest'; parsed: ParsedSearch }
  /** Nothing in the sentence was a filter: names were searched. */
  | { kind: 'names'; text: string };

type SetFilters = (patch: Partial<SearchFilters> | null) => void;

/**
 * Search by description on the search page. Filters are set only when the person submits a sentence or accepts a
 * suggestion. The sentence itself stays in the page: only the filters it produced go into the URL, so a shared link
 * carries the search and nothing the person typed.
 */
export function useAskSearch(filters: SearchFilters, setFilters: SetFilters, onApplied?: () => void) {
  const enabled = useAiFeature('search');
  // Arriving from the home page's search box: it has already read the sentence and, when it was sure, put the
  // filters in the URL. Start with the sentence and what was made of it.
  const [text, setText] = React.useState(() => peekHandoff()?.text ?? '');
  const [note, setNote] = React.useState<AskNote | null>(() => {
    const arrived = peekHandoff();
    if (!arrived) return null;
    if (arrived.parsed.confidence >= LOW_CONFIDENCE) return { kind: 'applied', unparsed: arrived.parsed.unparsed, currency: arrived.parsed.currency };
    return hasFilters(arrived.parsed) ? { kind: 'suggest', parsed: arrived.parsed } : null;
  });
  React.useEffect(() => clearHandoff(), []);
  const [busy, setBusy] = React.useState(false);
  const latest = React.useRef(0);

  const apply = React.useCallback(
    (parsed: ParsedSearch) => {
      setFilters(toFilters(parsed));
      setNote({ kind: 'applied', unparsed: parsed.unparsed, currency: parsed.currency });
      onApplied?.();
    },
    [setFilters, onApplied],
  );

  const submit = React.useCallback(
    async (raw: string) => {
      const sentence = raw.trim();
      const run = ++latest.current;
      setText(sentence);
      if (!sentence) {
        setNote(null);
        if (filters.q) setFilters({ q: '' });
        return;
      }
      if (!enabled) {
        setFilters({ q: sentence });
        return;
      }
      setBusy(true);
      try {
        const parsed = await parseSearch(sentence, navigator.language);
        if (run !== latest.current) return;
        if (!hasFilters(parsed)) {
          setFilters({ q: sentence });
          setNote({ kind: 'names', text: sentence });
        } else if (parsed.confidence >= LOW_CONFIDENCE) {
          apply(parsed);
        } else {
          setNote({ kind: 'suggest', parsed });
        }
      } catch {
        // the reader is down: the box still searches, by name
        if (run === latest.current) {
          setFilters({ q: sentence });
          setNote(null);
        }
      } finally {
        if (run === latest.current) setBusy(false);
      }
    },
    [enabled, filters.q, setFilters, apply],
  );

  return {
    enabled,
    /** The sentence last submitted */
    text,
    busy,
    note,
    submit,
    accept: apply,
    searchNames: () => {
      setFilters({ q: text });
      setNote(null);
    },
    dismiss: () => setNote(null),
  };
}

export type AskSearch = ReturnType<typeof useAskSearch>;
