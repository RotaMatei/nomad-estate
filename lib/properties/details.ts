'use client';

import { useQuery } from '@tanstack/react-query';
import { env } from '@/app/config/env';
import api from '@/app/lib/api';
import { toListing } from './normalize';
import { errorStatus } from '@/lib/auth/session';
import type { ApiPropertySummary, Country, Listing } from './types';

interface Picture {
  id: string;
  imageData: string;
  altText?: string | null;
  isPrimary: boolean;
}

/** `/property/retrieve-details/:id`: the Property row plus one array per feature table. */
export interface ApiPropertyDetails extends ApiPropertySummary {
  agencyId?: string;
  agentId?: string;
  streetAddress?: string;
  postalCode?: string;
  constructionDate?: string;
  builtArea?: number | string;
  landArea?: number | string;
  rooms?: number;
  floors?: number | null;
  floorLevel?: number | null;
  energyEfficiencyRating?: string;
  orientation?: string;
  parking?: string;
  balconyType?: string;
  propertyTaxes?: number | string | null;
  HOAFees?: number | string | null;
  picture?: Picture[];
  investmentGoal?: { investmentGoalTag: string }[];
  locationBenefit?: { locationBenefitTag: string }[];
  heatingSystem?: Record<string, unknown>[];
  coolingSystem?: Record<string, unknown>[];
  kitchen?: Record<string, unknown>[];
  security?: Record<string, unknown>[];
  utility?: Record<string, unknown>[];
  smartHomeFeature?: Record<string, unknown>[];
  otherFeature?: Record<string, unknown>[];
}

export interface AgencySummary {
  id: string;
  companyName?: string;
  email?: string;
  phoneNumber?: string;
  companyWebsite?: string;
  establishedYear?: number;
}

export const FEATURE_GROUPS = [
  ['heatingSystem', 'Heating'],
  ['coolingSystem', 'Cooling'],
  ['kitchen', 'Kitchen'],
  ['security', 'Security'],
  ['utility', 'Utilities'],
  ['smartHomeFeature', 'Smart home'],
  ['otherFeature', 'Other'],
] as const;

/** "UNDERFLOOR_HEATING" → "Underfloor heating". Feature enums are shown as the API names them. */
export const humanize = (v: string) => {
  const s = v.replace(/_/g, ' ').toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const toNum = (v: unknown) => {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : null;
};

export interface PropertyDetails {
  listing: Listing;
  raw: ApiPropertyDetails;
  pictures: Picture[];
  features: { label: string; items: string[] }[];
  taxes: number | null;
  hoaFees: number | null;
  pricePerM2: number | null;
  agency: AgencySummary | null;
}

export function usePropertyDetails(id: string) {
  return useQuery({
    queryKey: ['property-details', id],
    queryFn: async (): Promise<PropertyDetails> => {
      const { data: raw } = await api.get<ApiPropertyDetails>(`/property/retrieve-details/${id}`);
      // Names and the agency are separate calls until the Rust API returns them joined (PROGRESS B2).
      const [country, city, agency] = await Promise.all([
        raw.countryId != null ? api.get<Country>(`/countries/retrieve/${raw.countryId}`).then((r) => r.data, () => null) : null,
        raw.cityId != null ? api.get<{ name?: string }>(`/cities/retrieve/${raw.cityId}`).then((r) => r.data, () => null) : null,
        raw.agencyId ? api.get<AgencySummary>(`/agency/retrieve/${raw.agencyId}`).then((r) => r.data, () => null) : null,
      ]);

      const pictures = raw.picture ?? raw.propertyPictures ?? [];
      const listing = toListing(
        {
          ...raw,
          propertyPictures: pictures,
          propertyInvestmentGoalTags: (raw.investmentGoal ?? raw.propertyInvestmentGoalTags ?? []) as ApiPropertySummary['propertyInvestmentGoalTags'],
          propertyLocationBenefitTags: (raw.locationBenefit ?? raw.propertyLocationBenefitTags ?? []) as ApiPropertySummary['propertyLocationBenefitTags'],
        },
        new Map(country ? [[country.id, country]] : []),
        new Map(raw.cityId != null && city?.name ? [[raw.cityId, city.name]] : []),
      );

      const features = FEATURE_GROUPS.map(([key, label]) => ({
        label,
        items: (raw[key] ?? [])
          .map((row) => row[key])
          .filter((v): v is string => typeof v === 'string' && v !== 'NONE')
          .map(humanize),
      })).filter((g) => g.items.length > 0);

      return {
        listing,
        raw,
        pictures: [...pictures].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)),
        features,
        taxes: toNum(raw.propertyTaxes),
        hoaFees: toNum(raw.HOAFees),
        pricePerM2: listing.area > 0 ? listing.price / listing.area : null,
        agency,
      };
    },
    retry: (count, error) => errorStatus(error) !== 404 && count < 1,
  });
}

export const CONTACT_METHODS = ['EMAIL', 'CALL', 'CHAT', 'FORM'] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];
export const CONTACT_METHOD_LABEL: Record<ContactMethod, string> = {
  EMAIL: 'Email me',
  CALL: 'Call me',
  CHAT: 'Chat on the platform',
  FORM: 'No preference',
};

export async function sendInquiry(input: { userId: string; propertyId: string; agentId: string; message: string; contactMethod: ContactMethod }) {
  await api.post('/inquiry/create', input);
}

export interface PricePoint {
  changedAt: string;
  price: number;
  yield: number;
  status: string;
  source: string;
}

/** Every recorded change of a listing's price, yield or status, oldest first. Rust API only: Nest keeps no history. */
export function usePriceHistory(id: string) {
  return useQuery({
    queryKey: ['price-history', id],
    enabled: env.apiFlavor === 'rust' && !!id,
    staleTime: 5 * 60_000,
    queryFn: async ({ signal }) => (await api.get<{ currency: string; points: PricePoint[] }>(`/property/price-history/${id}`, { signal })).data,
  });
}
