import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';
import { INVESTMENT_GOAL_TAGS, LOCATION_BENEFIT_TAGS, PROPERTY_TYPES } from './labels';

export const SORTS = ['relevance', 'yield', 'score', 'price-asc', 'price-desc', 'newest'] as const;
export type SortKey = (typeof SORTS)[number];

export const SORT_LABEL: Record<SortKey, string> = {
  relevance: 'Best match',
  yield: 'Highest yield',
  score: 'Highest score',
  'price-asc': 'Price, low to high',
  'price-desc': 'Price, high to low',
  newest: 'Newest',
};

/** Every search filter lives in the URL → shareable, back-button friendly, survives refresh. */
export const filterParsers = {
  q: parseAsString.withDefault(''),
  countries: parseAsArrayOf(parseAsInteger).withDefault([]),
  cities: parseAsArrayOf(parseAsString).withDefault([]),
  type: parseAsStringLiteral(PROPERTY_TYPES),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  minYield: parseAsFloat,
  minScore: parseAsInteger,
  beds: parseAsInteger,
  goals: parseAsArrayOf(parseAsStringLiteral(INVESTMENT_GOAL_TAGS)).withDefault([]),
  benefits: parseAsArrayOf(parseAsStringLiteral(LOCATION_BENEFIT_TAGS)).withDefault([]),
  sort: parseAsStringLiteral(SORTS).withDefault('relevance'),
};

/** UI-only state that is also nice to share: the selected listing. */
export const selectionParsers = {
  selected: parseAsString,
};

export function useSearchFilters() {
  return useQueryStates(filterParsers, { history: 'replace', clearOnDefault: true });
}

export type SearchFilters = ReturnType<typeof useSearchFilters>[0];

export function countActiveFilters(f: SearchFilters) {
  let n = 0;
  if (f.countries.length) n++;
  if (f.cities.length) n++;
  if (f.type) n++;
  if (f.minPrice != null || f.maxPrice != null) n++;
  if (f.minYield != null) n++;
  if (f.minScore != null) n++;
  if (f.beds != null) n++;
  n += f.goals.length + f.benefits.length;
  return n;
}

/** Map URL filters to the current Nest API body (FilterDto + InvG/LocB). */
export function toSearchBody(f: SearchFilters, countryNames: (id: number) => string | undefined) {
  const body: Record<string, unknown> = {
    minimumPrice: f.minPrice ?? undefined,
    maximumPrice: f.maxPrice ?? undefined,
    propertyType: f.type ?? undefined,
    minimumScore: f.minScore ?? undefined,
    minimumYield: f.minYield ?? undefined,
    minimumNoBedrooms: f.beds ?? undefined,
    countryIds: f.countries.length ? f.countries : undefined,
    countryTags: f.countries.length
      ? f.countries.map(countryNames).filter((x): x is string => !!x)
      : undefined,
    cityTags: f.cities.length ? f.cities : undefined,
    InvG: f.goals.length ? f.goals : undefined,
    LocB: f.benefits.length ? f.benefits : undefined,
  };
  for (const k of Object.keys(body)) if (body[k] === undefined) delete body[k];
  return body;
}

/** Selected listing and the "Search this area" box (west, south, east, north). */
export function useSelection() {
  return useQueryStates({ ...selectionParsers, area: parseAsArrayOf(parseAsFloat) }, { history: 'replace' });
}

export type Area = [west: number, south: number, east: number, north: number];

export function inArea(lat: number | null, lng: number | null, area: number[] | null) {
  if (!area || area.length !== 4) return true;
  if (lat == null || lng == null) return false;
  const [w, s, e, n] = area;
  if (lat < s || lat > n) return false;
  // a box that crosses the antimeridian has west > east
  return w <= e ? lng >= w && lng <= e : lng >= w || lng <= e;
}

export const flagEmoji = (code: string | null | undefined) =>
  code && /^[A-Za-z]{2}$/.test(code)
    ? String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
    : '';

/** "No filters": used where the full catalogue is shown outside the search page (home hero, featured markets). */
export const DEFAULT_FILTERS: SearchFilters = {
  q: '',
  countries: [],
  cities: [],
  type: null,
  minPrice: null,
  maxPrice: null,
  minYield: null,
  minScore: null,
  beds: null,
  goals: [],
  benefits: [],
  sort: 'relevance',
};
