// Country answers with citations: asks the AI API (`POST /api/ai/ask`) and reads its answer as it is written.
import { env } from '@/app/config/env';

export interface AnswerSource {
  /** The number the answer cites it by: [1], [2] */
  number: number;
  title: string;
  publisher: string;
  url: string;
  language: string;
  /** A person has confirmed this is the right, official page */
  reviewed: boolean;
  heading: string;
  text: string;
}

export type AnswerOutcome =
  /** Written from the sources */
  | 'answered'
  /** No document answers the question */
  | 'no_source'
  /** The writer was not available: the closest passages are shown on their own */
  | 'passages_only';

export interface AnswerEnd {
  outcome: AnswerOutcome;
  cited: number[];
  /** The answer cites nothing, or something that was not among the sources: treat it with suspicion */
  unsupported: boolean;
}

export interface AskHandlers {
  onSources: (sources: AnswerSource[]) => void;
  onText: (delta: string) => void;
  onDone: (end: AnswerEnd) => void;
}

export const MAX_QUESTION_CHARS = 400;

const base = () => env.aiApiUrl.replace(/\/$/, '').replace(/\/api$/, '') + '/api/ai';

/** Countries that have documents to answer from, by ISO code. Empty when the feature is off or cannot be reached. */
export async function fetchAnswerCountries(): Promise<string[]> {
  try {
    const response = await fetch(`${base()}/ask/countries`, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return [];
    const body: unknown = await response.json();
    return Array.isArray(body) ? body.map((row) => String((row as { countryCode?: unknown }).countryCode ?? '').toUpperCase()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/** Splits a server-sent event stream into `{ event, data }`. Incomplete events wait in `rest` for the next chunk. */
export function readEvents(buffer: string): { events: { event: string; data: string }[]; rest: string } {
  const blocks = buffer.split(/\r?\n\r?\n/);
  const rest = blocks.pop() ?? '';
  const events = blocks
    .map((block) => {
      let event = 'message';
      const data: string[] = [];
      for (const line of block.split(/\r?\n/)) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
      }
      return { event, data: data.join('\n') };
    })
    .filter((e) => e.data !== '');
  return { events, rest };
}

/**
 * Asks a question about one country. Resolves when the answer has ended; rejects when the service refuses or
 * cannot be reached (the message is fit to show).
 */
export async function askCountry(question: string, countryCode: string, handlers: AskHandlers, signal?: AbortSignal): Promise<void> {
  const response = await fetch(`${base()}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ question: question.slice(0, MAX_QUESTION_CHARS), countryCode }),
    signal,
  });
  if (!response.ok || !response.body) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? 'Answers are not available right now. Try again in a moment.');
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let ended = false;
  for (;;) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const { events, rest } = readEvents(done ? `${buffer}\n\n` : buffer);
    buffer = rest;
    for (const { event, data } of events) {
      let payload: unknown;
      try {
        payload = JSON.parse(data);
      } catch {
        continue;
      }
      if (event === 'sources' && Array.isArray(payload)) handlers.onSources(payload as AnswerSource[]);
      else if (event === 'text') handlers.onText(String((payload as { delta?: unknown }).delta ?? ''));
      else if (event === 'error') throw new Error(String((payload as { message?: unknown }).message ?? 'Answers are not available right now.'));
      else if (event === 'done') {
        ended = true;
        const end = payload as Partial<AnswerEnd>;
        handlers.onDone({ outcome: end.outcome ?? 'passages_only', cited: Array.isArray(end.cited) ? end.cited : [], unsupported: end.unsupported === true });
      }
    }
    if (done) break;
  }
  if (!ended) throw new Error('The answer was cut short. Try again.');
}
