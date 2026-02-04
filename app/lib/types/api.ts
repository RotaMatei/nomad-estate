/**
 * Shared API response types
 * These types match the backend API response structures
 */

/**
 * Country market data from AI API
 * Matches CountryMarketDataResponseDto from nomad-estate-ai-api
 */
export interface CountryMarketData {
  id: number;
  countryName: string;
  countryIsoCode: string;
  lastUpdated: Date | string;
  aiMarketScore: string | null;
  rentalYieldProxy: string | null;
  regulationLegal: string | null;
  transactionFriction: string | null;
  currencyStability: string | null;
  legalFramework: string | null;
  marketLiquidityProxy: string | null;
  mortgageAvailability: string | null;
  macroEconomics: string | null;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Paginated country market data response
 */
export type PaginatedCountryMarketData = PaginatedResponse<CountryMarketData>;
