'use client';

import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Sparkles, TriangleAlert } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { MAX_QUESTION_CHARS, askCountry, fetchAnswerCountries, type AnswerEnd, type AnswerSource } from '@/lib/ai/ask';
import { useAiFeature } from '@/lib/ai/use-ask-search';

const STARTERS = ['What taxes do I pay when I buy?', 'Can foreigners own property here?', 'How is rental income taxed?'];

interface Answer {
  question: string;
  sources: AnswerSource[];
  text: string;
  end: AnswerEnd | null;
  error: string | null;
}

/** The answer's text with its citations ([1], [2]) turned into links to the sources below. */
function AnswerText({ text, sources, anchor }: { text: string; sources: AnswerSource[]; anchor: string }) {
  const known = new Set(sources.map((s) => s.number));
  return (
    <p className="max-w-prose whitespace-pre-line">
      {text.split(/(\[\d{1,2}\])/).map((part, i) => {
        const n = /^\[(\d{1,2})\]$/.exec(part)?.[1];
        if (!n || !known.has(Number(n))) return <React.Fragment key={i}>{part}</React.Fragment>;
        return (
          <a
            key={i}
            href={`#${anchor}-${n}`}
            aria-label={`Source ${n}`}
            className="tabular mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 align-text-top text-[0.6875rem] font-medium text-secondary-foreground no-underline hover:bg-foreground hover:text-background"
          >
            {n}
          </a>
        );
      })}
    </p>
  );
}

/**
 * "Ask about buying in {country}": a question answered from official documents, with the passages it was written
 * from. Shown only where the server offers it and has documents for the country.
 */
export function AskCountry({ countryCode, countryName }: { countryCode: string; countryName: string }) {
  const on = useAiFeature('rag');
  const { data: countries } = useQuery({ queryKey: ['ai-answer-countries'], queryFn: fetchAnswerCountries, staleTime: 10 * 60_000, enabled: on });
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState<Answer | null>(null);
  const [busy, setBusy] = React.useState(false);
  const running = React.useRef<AbortController | null>(null);
  const anchor = React.useId().replace(/:/g, '');
  React.useEffect(() => () => running.current?.abort(), []);

  if (!on || !countries?.includes(countryCode.toUpperCase())) return null;

  const ask = async (raw: string) => {
    const asked = raw.trim();
    if (!asked || busy) return;
    running.current?.abort();
    const controller = new AbortController();
    running.current = controller;
    setBusy(true);
    setAnswer({ question: asked, sources: [], text: '', end: null, error: null });
    const update = (patch: (a: Answer) => Partial<Answer>) => setAnswer((a) => (a && a.question === asked ? { ...a, ...patch(a) } : a));
    try {
      await askCountry(
        asked,
        countryCode,
        {
          onSources: (sources) => update(() => ({ sources })),
          onText: (delta) => update((a) => ({ text: a.text + delta })),
          onDone: (end) => update(() => ({ end })),
        },
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) update(() => ({ error: error instanceof Error ? error.message : 'Answers are not available right now.' }));
    } finally {
      if (running.current === controller) setBusy(false);
    }
  };

  const cited = answer?.end?.outcome === 'answered' && answer.end.cited.length > 0 ? new Set(answer.end.cited) : null;
  const shown = answer ? (cited ? answer.sources.filter((s) => cited.has(s.number)) : answer.sources) : [];

  return (
    <section aria-labelledby="ask-title">
      <h2 id="ask-title" className="text-xl font-semibold">
        Ask about buying in {countryName}
      </h2>
      <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
        <Sparkles className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <span>Answers are written by AI from official sources and cite them. Not legal, tax or financial advice.</span>
      </p>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
      >
        <Input
          value={question}
          maxLength={MAX_QUESTION_CHARS}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Your question, in any language"
          aria-label={`Your question about buying property in ${countryName}`}
          className="h-10 flex-1"
        />
        <Button type="submit" className="h-10" disabled={busy || !question.trim()}>
          {busy && <Spinner aria-label="Looking for an answer" />}
          Ask
        </Button>
      </form>
      <ul aria-label="Example questions" className="mt-3 flex flex-wrap gap-2">
        {STARTERS.map((starter) => (
          <li key={starter}>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setQuestion(starter);
                void ask(starter);
              }}
              className="h-8 rounded-full border px-3 text-sm transition-colors hover:bg-accent disabled:opacity-50"
            >
              {starter}
            </button>
          </li>
        ))}
      </ul>

      {answer && (
        <div className="mt-6 rounded-xl border bg-card p-5" aria-live="polite" aria-busy={busy}>
          <p className="text-sm font-medium">{answer.question}</p>

          <div className="mt-3 text-[0.9375rem] leading-relaxed">
            {answer.error ? (
              <p className="text-destructive">{answer.error}</p>
            ) : answer.text ? (
              <AnswerText text={answer.text} sources={answer.sources} anchor={anchor} />
            ) : answer.end?.outcome === 'passages_only' ? (
              <p className="text-muted-foreground">
                The answer could not be written right now. These are the passages of official sources closest to your question.
              </p>
            ) : (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Spinner aria-hidden />
                Reading the official sources
              </p>
            )}
          </div>

          {answer.end?.unsupported && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              This answer could not be tied to the sources below. Read them before relying on it.
            </p>
          )}

          {shown.length > 0 && (
            <div className="mt-5 border-t pt-4">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{cited ? 'Sources cited' : 'Sources'}</h3>
              <ol className="mt-2 space-y-3">
                {shown.map((source) => (
                  <li key={source.number} id={`${anchor}-${source.number}`} className="scroll-mt-28 text-sm">
                    <div className="flex items-baseline gap-2">
                      <span className="tabular inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-secondary px-1 text-[0.6875rem] font-medium">
                        {source.number}
                      </span>
                      <div className="min-w-0">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                        >
                          {source.title}
                          <ExternalLink className="ml-1 inline size-3 align-baseline" aria-hidden />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                        <p className="text-muted-foreground">
                          {source.publisher}
                          {!source.reviewed && ' · not yet checked by our team'}
                        </p>
                        <details className="mt-1">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Show the passage</summary>
                          <blockquote lang={source.language} className="mt-2 border-l-2 pl-3 whitespace-pre-line text-muted-foreground">
                            {source.text}
                          </blockquote>
                        </details>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
