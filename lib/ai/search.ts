// Search by description: one sentence in, the search page's filters out. The reading is done by the AI API
// (`POST /api/ai/search/parse`); this module asks for it and fits the answer to the filters the page already has.
import { createSerializer } from 'nuqs/server';
import { env } from '@/app/config/env';
import { DEFAULT_FILTERS } from '@/lib/properties/filters';
import { INVESTMENT_GOAL_TAGS, LOCATION_BENEFIT_TAGS, PROPERTY_TYPES } from '@/lib/properties/labels';
import { SORTS, filterParsers, type SearchFilters } from '@/lib/properties/search-params';

export interface ParsedChip {
  field: string;
  value: string | number;
  label: string;
}

export interface ParsedSearch {
  /** Only what the sentence asked for, under the names of the search page's URL */
  filters: Record<string, unknown>;
  chips: ParsedChip[];
  /** Parts of the sentence that became no filter, in the person's words */
  unparsed: string[];
  /** 0 to 1 */
  confidence: number;
  language: string;
  /** The currency the person wrote prices in, if they named one. Nothing is converted. */
  currency: string | null;
  source: 'rules' | 'model';
}

/** Under this the reading is offered as a suggestion instead of being applied. Same value as the API's. */
export const LOW_CONFIDENCE = 0.6;
export const MAX_CHARS = 300;

const base = () => env.aiApiUrl.replace(/\/$/, '').replace(/\/api$/, '') + '/api/ai';

/** Which AI features the server offers. Everything is off when it cannot be asked. */
export async function fetchAiFeatures(): Promise<Record<string, boolean>> {
  try {
    const response = await fetch(`${base()}/features`, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return {};
    const body: unknown = await response.json();
    return body && typeof body === 'object' ? (body as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

/** Reads a sentence. Throws when the service cannot answer: the caller falls back to a plain name search. */
export async function parseSearch(text: string, locale?: string): Promise<ParsedSearch> {
  const response = await fetch(`${base()}/search/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.slice(0, MAX_CHARS), locale }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`search parser answered ${response.status}`);
  const body = (await response.json()) as Partial<ParsedSearch>;
  return {
    filters: body.filters && typeof body.filters === 'object' ? body.filters : {},
    chips: Array.isArray(body.chips) ? body.chips : [],
    unparsed: Array.isArray(body.unparsed) ? body.unparsed.filter((p): p is string => typeof p === 'string') : [],
    confidence: typeof body.confidence === 'number' ? body.confidence : 0,
    language: typeof body.language === 'string' ? body.language : 'en',
    currency: typeof body.currency === 'string' ? body.currency : null,
    source: body.source === 'model' ? 'model' : 'rules',
  };
}

const wholeNumber = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : null);
const oneOf = <T extends string>(allowed: readonly T[], v: unknown): T | null => (allowed as readonly unknown[]).includes(v) ? (v as T) : null;
const listOf = <T extends string>(allowed: readonly T[], v: unknown): T[] => (Array.isArray(v) ? v.filter((x): x is T => (allowed as readonly unknown[]).includes(x)) : []);

/**
 * The reading as a complete set of filters: a description replaces the search, it does not add to it. The API has
 * already checked every value; they are checked again here because the URL parsers would silently drop a bad one.
 */
export function toFilters(parsed: ParsedSearch): SearchFilters {
  const f = parsed.filters;
  return {
    ...DEFAULT_FILTERS,
    q: typeof f.q === 'string' ? f.q : '',
    countries: Array.isArray(f.countries) ? f.countries.filter((id): id is number => Number.isInteger(id)) : [],
    cities: Array.isArray(f.cities) ? f.cities.filter((c): c is string => typeof c === 'string' && c.length > 0) : [],
    type: oneOf(PROPERTY_TYPES, f.type),
    minPrice: wholeNumber(f.minPrice),
    maxPrice: wholeNumber(f.maxPrice),
    minYield: typeof f.minYield === 'number' ? f.minYield : null,
    minScore: wholeNumber(f.minScore),
    beds: wholeNumber(f.beds),
    goals: listOf(INVESTMENT_GOAL_TAGS, f.goals),
    benefits: listOf(LOCATION_BENEFIT_TAGS, f.benefits),
    sort: oneOf(SORTS, f.sort) ?? 'relevance',
  };
}

export const hasFilters = (parsed: ParsedSearch) => Object.keys(parsed.filters).length > 0;

const serialize = createSerializer(filterParsers);

/** The search page showing these filters. */
export const searchHref = (filters: Partial<SearchFilters>) => `/properties${serialize(filters)}`.replace(/\?$/, '');

/**
 * A sentence read on one page and shown on the next (home → search). It is handed over in memory, not in the URL:
 * what a person typed may hold more than they would want in a link or in their browser history.
 */
let handoff: { text: string; parsed: ParsedSearch } | null = null;

export const leaveHandoff = (text: string, parsed: ParsedSearch) => {
  handoff = { text, parsed };
};
export const peekHandoff = () => handoff;
export const clearHandoff = () => {
  handoff = null;
};
