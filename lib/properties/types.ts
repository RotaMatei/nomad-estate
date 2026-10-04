import type { InvestmentGoalTagEnum, LocationBenefitTagEnum, PropertyType } from './labels';

/** Shape returned by the current Nest API `/property/retrieve-search` (Prisma Property + relations). */
export interface ApiPropertySummary {
  id: string;
  title: string;
  description?: string;
  type?: PropertyType;
  status?: string;
  price: number | string;
  yield: number | string;
  score: number;
  bedrooms: number;
  bathrooms: number;
  totalArea: number | string;
  cityId?: number;
  countryId?: number;
  latitude?: number | string;
  longitude?: number | string;
  createdAt?: string;
  propertyPictures?: { id: string; imageData: string; altText?: string | null; isPrimary: boolean }[];
  propertyInvestmentGoalTags?: { investmentGoalTag: InvestmentGoalTagEnum }[];
  propertyLocationBenefitTags?: { locationBenefitTag: LocationBenefitTagEnum }[];
}

/** Normalised listing used by every new UI component. */
export interface Listing {
  id: string;
  title: string;
  type: PropertyType | null;
  price: number;
  yieldPct: number;
  score: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  lat: number | null;
  lng: number | null;
  cityId: number | null;
  countryId: number | null;
  cityName: string | null;
  countryName: string | null;
  countryCode: string | null;
  image: string | null;
  goals: InvestmentGoalTagEnum[];
  benefits: LocationBenefitTagEnum[];
  createdAt: string | null;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  currency?: string;
  currencySymbol?: string;
}
