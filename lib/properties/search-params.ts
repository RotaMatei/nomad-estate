// What a property search looks like in the URL and on the wire. No hooks here: the server page reads the same
// definitions to fetch the first results before the HTML is sent (see `prefetch.ts`).
import { parseAsArrayOf, parseAsFloat, parseAsInteger, parseAsString, parseAsStringLiteral, type inferParserType } from 'nuqs/server';
import { INVESTMENT_GOAL_TAGS, LOCATION_BENEFIT_TAGS, PROPERTY_TYPES } from './labels';

export const SORTS = ['relevance', 'yield', 'score', 'price-asc', 'price-desc', 'newest'] as const;
export type SortKey = (typeof SORTS)[number];

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

/** Selected listing and the "Search this area" box (west, south, east, north). */
export const selectionParsers = {
  selected: parseAsString,
  area: parseAsArrayOf(parseAsFloat),
};

export type SearchFilters = inferParserType<typeof filterParsers>;

/** Rows per request. The list asks for the next page as the reader nears the end of what is loaded. */
export const PAGE_SIZE = 40;

/** The filters as the Rust API's `/property/search` and `/property/geo` take them. */
export function rustFilters(filters: SearchFilters, area: number[] | null | undefined) {
  return {
    q: filters.q.trim() || undefined,
    countryIds: filters.countries,
    cityNames: filters.cities,
    type: filters.type ?? undefined,
    minPrice: filters.minPrice ?? undefined,
    maxPrice: filters.maxPrice ?? undefined,
    minYield: filters.minYield ?? undefined,
    minScore: filters.minScore ?? undefined,
    minBedrooms: filters.beds ?? undefined,
    goals: filters.goals,
    benefits: filters.benefits,
    bbox: area && area.length === 4 ? area : undefined,
  };
}

/** Cache key of the paged list. The server prefetch and the client hook must build the same one. */
export const searchKey = (where: ReturnType<typeof rustFilters>, sort: SortKey) => ['property-search', 'rust', where, sort] as const;
