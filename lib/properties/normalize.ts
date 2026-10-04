import type { ApiPropertySummary, Country, Listing } from './types';

const num = (v: unknown): number | null => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

export function toListing(
  p: ApiPropertySummary,
  countries: Map<number, Country>,
  cities: Map<number, string>,
): Listing {
  const lat = num(p.latitude);
  const lng = num(p.longitude);
  const country = p.countryId != null ? countries.get(p.countryId) : undefined;
  const pics = p.propertyPictures ?? [];
  const primary = pics.find((x) => x.isPrimary) ?? pics[0];
  return {
    id: p.id,
    title: p.title,
    type: p.type ?? null,
    price: num(p.price) ?? 0,
    yieldPct: num(p.yield) ?? 0,
    score: num(p.score) ?? 0,
    bedrooms: p.bedrooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    area: num(p.totalArea) ?? 0,
    lat: lat != null && Math.abs(lat) <= 90 ? lat : null,
    lng: lng != null && Math.abs(lng) <= 180 ? lng : null,
    cityId: p.cityId ?? null,
    countryId: p.countryId ?? null,
    cityName: p.cityId != null ? (cities.get(p.cityId) ?? null) : null,
    countryName: country?.name ?? null,
    countryCode: country?.code ?? null,
    image: primary?.imageData || null,
    goals: (p.propertyInvestmentGoalTags ?? []).map((t) => t.investmentGoalTag),
    benefits: (p.propertyLocationBenefitTags ?? []).map((t) => t.locationBenefitTag),
    createdAt: p.createdAt ?? null,
  };
}
