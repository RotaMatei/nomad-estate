import { hasFilters, searchHref, toFilters, type ParsedSearch } from '../search';

const parsed = (filters: Record<string, unknown>): ParsedSearch => ({
  filters,
  chips: [],
  unparsed: [],
  confidence: 0.9,
  language: 'en',
  currency: null,
  source: 'rules',
});

describe('search by description', () => {
  it('turns a reading into a complete set of filters', () => {
    const filters = toFilters(
      parsed({ cities: ['Lisbon'], type: 'APARTMENT', maxPrice: 400000, beds: 2, benefits: ['COASTAL_ACCESS'], sort: 'price-asc', minYield: 6.5 }),
    );
    expect(filters).toEqual({
      q: '',
      countries: [],
      cities: ['Lisbon'],
      type: 'APARTMENT',
      minPrice: null,
      maxPrice: 400000,
      minYield: 6.5,
      minScore: null,
      beds: 2,
      goals: [],
      benefits: ['COASTAL_ACCESS'],
      sort: 'price-asc',
    });
  });

  it('drops values the search page does not have', () => {
    const filters = toFilters(parsed({ type: 'CASTLE', goals: ['HIGH_ROI', 'GET_RICH'], countries: [2, 'Spain', 3.5], sort: 'luck', beds: '2' }));
    expect(filters.type).toBeNull();
    expect(filters.goals).toEqual(['HIGH_ROI']);
    expect(filters.countries).toEqual([2]);
    expect(filters.sort).toBe('relevance');
    expect(filters.beds).toBeNull();
  });

  it('knows an empty reading', () => {
    expect(hasFilters(parsed({}))).toBe(false);
    expect(hasFilters(parsed({ beds: 2 }))).toBe(true);
  });

  it('writes the filters into the search page address, and nothing else', () => {
    const href = searchHref(toFilters(parsed({ countries: [3, 2], type: 'VILLA', maxPrice: 900000 })));
    expect(href).toBe('/properties?countries=3,2&type=VILLA&maxPrice=900000');
    expect(searchHref(toFilters(parsed({})))).toBe('/properties');
  });
});
