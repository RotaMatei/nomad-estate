import api from './api';
import { PropertyFormData } from '../components/createPropertyComponents/types';
import type {
  CoolingSystemEnum,
  HeatingSystemEnum,
  KitchenEnum,
  SecurityEnum,
  UtilityEnum,
  SmartHomeFeatureEnum,
  OtherFeatureEnum,
  InvestmentGoalTagEnum,
  LocationBenefitTagEnum,
} from '../components/createPropertyComponents/Enums';
import type {
  CoolingSystemCreateDto,
  HeatingSystemCreateDto,
  KitchenCreateDto,
  SecurityCreateDto,
  UtilityCreateDto,
  SmartHomeFeatureCreateDto,
  OtherFeatureCreateDto,
  InvestmentGoalTagCreateDto,
  LocationBenefitTagCreateDto,
  PictureCreateDto,
} from './propertyDtos';

// Only these fields are MANDATORY for property creation
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used for RequiredField type inference
const REQUIRED_FIELDS = [
  'agencyId',
  'agentId',
  'title',
  'description',
  'type',
  'status',
  'price',
  'countryId',
  'cityId',
  'streetAddress',
  'latitude',
  'longitude',
  'rooms',
  'bedrooms',
  'bathrooms',
  'floorLevel',
  'orientation',
  'totalArea',
] as const;

/**
 * Fetch available agents for an agency
 */
export async function getAgentsForAgency(agencyId: string) {
  try {
    const { data } = await api.get(`/agent/retrieve/agents-for-agency/${agencyId}`);
    return data;
  } catch {
    return [];
  }
}

type RequiredField = (typeof REQUIRED_FIELDS)[number];

function ensureNumber(n: unknown): n is number {
  return typeof n === 'number' && !isNaN(n);
}

function ensureString(s: unknown): s is string {
  return typeof s === 'string' && s.trim().length > 0;
}

// Removed base64 helpers; images are now handled via hosted URLs only.

export function validateAndMapPropertyDto(form: PropertyFormData) {
  const missing: string[] = [];

  // Validate only required fields
  const checkString = (key: RequiredField) => {
    if (!ensureString(form[key])) missing.push(key);
  };
  const checkNumber = (key: RequiredField) => {
    if (!ensureNumber(form[key])) missing.push(key);
  };

  // String fields
  ['agencyId', 'agentId', 'title', 'description', 'type', 'status', 'streetAddress', 'orientation'].forEach((k) => checkString(k as RequiredField));

  // Number fields
  ['price', 'countryId', 'cityId', 'latitude', 'longitude', 'rooms', 'bedrooms', 'bathrooms', 'floorLevel', 'totalArea'].forEach((k) => checkNumber(k as RequiredField));

  if (missing.length) {
    return { ok: false as const, missing };
  }

  // Validate floorLevel is not negative
  const floorLevel = form.floorLevel as number;
  if (floorLevel < 0) {
    return { ok: false as const, missing: ['floorLevel (cannot be negative)'] };
  }

  // Helper to safely parse optional fields

  const optionalStringOrArray = (v: unknown): string | undefined => {
    if (Array.isArray(v)) {
      // For arrays, take the first element if it exists and is a string
      return v.length > 0 && typeof v[0] === 'string' && v[0].trim().length > 0 ? v[0] : undefined;
    }
    return typeof v === 'string' && v.trim().length > 0 ? v : undefined;
  };

  const optionalNumber = (v: unknown): number | undefined => (typeof v === 'number' && !isNaN(v) && v >= 0 ? v : undefined);
  const optionalString = (v: unknown): string | undefined => (typeof v === 'string' && v.trim().length > 0 ? v : undefined);
  const optionalStringOrArrayFirst = (v: unknown): string | undefined => {
    if (Array.isArray(v)) {
      const first = v.find(x => typeof x === 'string' && x.trim().length > 0);
      return typeof first === 'string' ? first : undefined;
    }
    return optionalString(v);
  };
  const optionalDate = (v: unknown): string | undefined => {
    if (typeof v !== 'string' || v.trim().length === 0) return undefined;
    const d = new Date(v);
    return !isNaN(d.getTime()) ? d.toISOString() : undefined;
  };

  // Map to DTO - send all fields that backend expects, with defaults for optional ones
  // NOTE: Date fields are sent as ISO strings; backend converts them to Date objects
  const dto: Record<string, unknown> = {
    agencyId: form.agencyId as string,
    agentId: form.agentId as string,
    title: form.title as string,
    description: form.description as string,
    type: form.type as string,
    status: form.status as string,
    price: form.price as number,
    countryId: form.countryId as number,
    cityId: form.cityId as number,
    streetAddress: form.streetAddress as string,
    latitude: form.latitude as number,
    longitude: form.longitude as number,
    rooms: form.rooms as number,
    bedrooms: form.bedrooms as number,
    bathrooms: form.bathrooms as number,
    floorLevel: form.floorLevel as number,
    orientation: form.orientation as string,
    // Provide defaults for non-required fields
    yield: optionalNumber(form.yield) ?? 0,
    score: optionalNumber(form.score) ?? 0,
    stateId: optionalNumber(form.stateId),  // nullable in schema - send undefined if not provided
    postalCode: optionalString(form.postalCode) ?? '',
    constructionDate: optionalDate(form.constructionDate) ?? new Date().toISOString(),
    builtArea: optionalNumber(form.builtArea) ?? 0,
    landArea: optionalNumber(form.landArea) ?? 0,
    totalArea: optionalNumber(form.totalArea) ?? 0,
    floors: optionalNumber(form.floors),  // nullable in schema
    energyEfficiencyRating: optionalString(form.energyEfficiencyRating) ?? 'A',
  parking: optionalStringOrArrayFirst(form.parking) ?? 'NONE',
    balconyType: optionalString(form.balconyType) ?? 'NONE',
    balconyTotalSize: optionalNumber(form.balconyTotalSize) ?? 0,
    balconyNumber: optionalNumber(form.balconyNumber) ?? 0,
    ownershipStatus: form.ownershipStatus ?? true,
    propertyTaxes: optionalNumber(form.propertyTaxes) ?? 0,
    HOAFees: optionalNumber(form.HOAFees) ?? 0,
    availabilityDateStart: optionalDate(form.availabilityDateStart) ?? new Date().toISOString(),
    availabilityDateEnd: optionalDate(form.availabilityDateEnd),  // nullable in schema
    // Multi-select fields (take first value if array)
  };

  return { ok: true as const, dto };
}

export async function createProperty(form: PropertyFormData) {
  const result = validateAndMapPropertyDto(form);
  if (!result.ok) {
    const msg = `Missing or invalid fields: ${result.missing.join(', ')}`;
    throw new Error(msg);
  }
  const { dto } = result;

  try {
    // Create the property first
    const { data: createdProperty } = await api.post('/property/create', dto);

    const propertyId: string = createdProperty.id as string;

    // Helper: normalize a string | string[] | undefined into an array of strings
    const toArray = (v: unknown): string[] => {
      if (!v) return [];
      if (Array.isArray(v)) return v.map((x) => String(x)).filter((x) => x.trim().length > 0);
      if (typeof v === 'string') return v.trim().length > 0 ? [v] : [];
      return [];
    };

    // Fire-and-forget creation of related subtables based on provided form values.
    // Failures in these should not rollback the base property creation.
    const tasks: Promise<unknown>[] = [];

    // Pictures (expects hosted URLs)
    if (form.images && form.images.length > 0) {
      const images = form.images as unknown[];
      images.forEach((imageItem, i) => {
        const url = typeof imageItem === 'string' ? imageItem.trim() : '';
        if (!/^https?:\/\//i.test(url)) return; // skip non-URL items
        const payload: PictureCreateDto = {
          propertyId,
          imageData: url,
          altText: `Property image ${i + 1}`,
          isPrimary: i === 0,
        };
        tasks.push(api.post('/property/picture/create', payload));
      });
    }

    // HeatingSystem (may be single or multiple)
    toArray(form.heatingSystem).forEach((hs) => {
      const payload: HeatingSystemCreateDto = {
        propertyId,
        heatingSystem: hs as HeatingSystemEnum,
      };
      tasks.push(api.post('/property/heating-system/create', payload));
    });

    // CoolingSystem (single in form, create one if present)
    toArray(form.coolingSystem).forEach((cs) => {
      const payload: CoolingSystemCreateDto = {
        propertyId,
        coolingSystem: cs as CoolingSystemEnum,
      };
      tasks.push(api.post('/property/cooling-system/create', payload));
    });

    // Kitchen (single in form)
    toArray(form.kitchen).forEach((k) => {
      const payload: KitchenCreateDto = {
        propertyId,
        kitchen: k as KitchenEnum,
      };
      tasks.push(api.post('/property/kitchen/create', payload));
    });

    // Security (multi)
    toArray(form.security).forEach((sec) => {
      const payload: SecurityCreateDto = {
        propertyId,
        security: sec as SecurityEnum,
      };
      tasks.push(api.post('/property/security/create', payload));
    });

    // Utility (multi)
    toArray(form.utility).forEach((u) => {
      const payload: UtilityCreateDto = {
        propertyId,
        utility: u as UtilityEnum,
      };
      tasks.push(api.post('/property/utility/create', payload));
    });

    // SmartHomeFeature (multi)
    toArray(form.smartHomeFeature).forEach((f) => {
      const payload: SmartHomeFeatureCreateDto = {
        propertyId,
        smartHomeFeature: f as SmartHomeFeatureEnum,
      };
      tasks.push(api.post('/property/smart-home-feature/create', payload));
    });

    // OtherFeature (multi)
    toArray(form.otherFeature).forEach((of) => {
      const payload: OtherFeatureCreateDto = {
        propertyId,
        otherFeature: of as OtherFeatureEnum,
      };
      tasks.push(api.post('/property/other-feature/create', payload));
    });

    // InvestmentGoalTag (multi)
    toArray(form.investmentGoalTag).forEach((g) => {
      const payload: InvestmentGoalTagCreateDto = {
        propertyId,
        investmentGoalTag: g as InvestmentGoalTagEnum,
      };
      tasks.push(api.post('/property/investment-goal-tag/create', payload));
    });

    // LocationBenefitTag (multi)
    toArray(form.locationBenefitTag).forEach((b) => {
      const payload: LocationBenefitTagCreateDto = {
        propertyId,
        locationBenefitTag: b as LocationBenefitTagEnum,
      };
      tasks.push(api.post('/property/location-benefit-tag/create', payload));
    });

    // Execute all subtable creations in parallel, but don't block return; wait to propagate errors if any
    try {
      await Promise.all(tasks);
    } catch {
      // partial failures in subtable creation are tolerated
    }

    // After related data is created, calculate score and persist it
    try {
      const { data: calcScore } = await api.post(`/property/create-score/${propertyId}`);
      if (typeof calcScore === 'number') {
        // Persist the newly calculated score on the property
        await api.patch(`/property/update-score/${propertyId}`, { score: calcScore });
      }
    } catch {
      // Non-critical: score calculation failures should not block property creation
    }

    return createdProperty;
  } catch (err: unknown) {
    console.error('❌ Error creating property');
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      // Check if it's an Axios error with response data
      const axiosErr = err as { response?: { data?: unknown; status?: number; statusText?: string } };
      if (axiosErr.response?.data) {
        console.error('Backend error response (data):', JSON.stringify(axiosErr.response.data, null, 2));
        console.error('Backend error status:', axiosErr.response.status);
        console.error('Backend error statusText:', axiosErr.response.statusText);
      }
    }
    throw err;
  }
}

// Retrieve all base properties for a given agency (portfolio)
export interface PortfolioProperty {
  id: string | number;
  title?: string;
  price?: number;
  yield?: number;
  score?: number;
  bedrooms?: number;
  bathrooms?: number;
  rooms?: number;
  cityId?: number;
  countryId?: number;
}

export async function getPortfolioForAgency(agencyId: string): Promise<PortfolioProperty[]> {
  try {
    const { data } = await api.get(`/property/retrieve-portfolio/${agencyId}`);
    return Array.isArray(data) ? (data as PortfolioProperty[]) : [];
  } catch {
    return [] as PortfolioProperty[];
  }
}

// Retrieve full property details (including pictures and related subtables)
// Minimal details type for UI needs
export interface PropertyDetails {
  id?: string | number;
  title?: string;
  price?: number;
  cityId?: number;
  countryId?: number;
  picture?: Array<{ imageData?: string }>;
  propertyPictures?: Array<{ imageData?: string }>;
  [k: string]: unknown;
}

export async function getPropertyDetails(propertyId: string): Promise<PropertyDetails | null> {
  try {
    const { data } = await api.get(`/property/retrieve-details/${propertyId}`);
    return data as PropertyDetails;
  } catch {
    return null;
  }
}

// Analytics: Saved (likes)
export async function getSavedForUser(userId: string) {
  try {
    const { data } = await api.get(`/analytics/saved/retrieve/for-user/${userId}`);
    return Array.isArray(data) ? (data as Array<{ propertyId: string; userId: string; createdAt?: string }>) : [];
  } catch {
    return [] as Array<{ propertyId: string; userId: string; createdAt?: string }>;
  }
}

export async function getSavesForProperty(propertyId: string) {
  try {
    const { data } = await api.get(`/analytics/saved/retrieve/for-property/${propertyId}`);
    return Array.isArray(data) ? (data as Array<{ propertyId: string; userId: string; createdAt?: string }>) : [];
  } catch {
    return [] as Array<{ propertyId: string; userId: string; createdAt?: string }>;
  }
}

// Save (like) a property for a user
export async function savePropertyForUser(userId: string, propertyId: string): Promise<boolean> {
  try {
    await api.post('/analytics/saved/create', {
      userId,
      propertyId,
      savedAt: new Date().toISOString(),
    });
    return true;
  } catch (e) {
    // If already saved, treat as non-fatal success for UI purposes
    try {
      let msg = '';
      const resp = (e as { response?: { data?: unknown } }).response?.data;
      if (typeof resp === 'string') {
        msg = resp;
      } else if (resp && typeof resp === 'object' && 'message' in (resp as Record<string, unknown>)) {
        const m = (resp as Record<string, unknown>).message;
        if (typeof m === 'string') msg = m;
      } else if (e instanceof Error && typeof e.message === 'string') {
        msg = e.message;
      }
      if (msg.toLowerCase().includes('already exists')) return false;
    } catch {}
    return false;
  }
}

// Unsave (remove like) a property for a user
export async function unsavePropertyForUser(userId: string, propertyId: string): Promise<boolean> {
  try {
    await api.delete(`/analytics/saved/delete/for-user-and-property/${userId}/${propertyId}`);
    return true;
  } catch {
    return false;
  }
}

// Delete a property by id
export async function deletePropertyById(propertyId: string): Promise<void> {
  await api.delete(`/property/delete-property/${propertyId}`);
}

// Pictures API helpers
export async function deletePictureById(pictureId: string): Promise<boolean> {
  try {
    await api.delete(`/property/picture/delete-picture/${pictureId}`);
    return true;
  } catch {
    return false;
  }
}

// Analytics: Performance (views, inquiries, bounceRate, conversionRate)
export interface PropertyPerformance {
  propertyId: string;
  views?: number;
  inquiries?: number;
  bounceRate?: number;
  conversionRate?: number;
  lastUpdated?: string | Date;
}

export async function getPerformanceForProperty(propertyId: string): Promise<PropertyPerformance | null> {
  try {
    const { data } = await api.get(`/analytics/performance/retrieve/${propertyId}`);
    return (data ?? null) as PropertyPerformance | null;
  } catch {
    return null;
  }
}

// Analytics: CTR
export interface PropertyCtr { propertyId: string; ctr?: number }
export async function getCtrForProperty(propertyId: string): Promise<PropertyCtr | null> {
  try {
    const { data } = await api.get(`/analytics/ctr/retrieve/${propertyId}`);
    return (data ?? null) as PropertyCtr | null;
  } catch {
    return null;
  }
}

// Analytics: Active Leads
export interface PropertyActiveLeads { propertyId: string; lead?: number }
export async function getActiveLeadsForProperty(propertyId: string): Promise<PropertyActiveLeads | null> {
  try {
    const { data } = await api.get(`/analytics/active-leads/retrieve/${propertyId}`);
    return (data ?? null) as PropertyActiveLeads | null;
  } catch {
    return null;
  }
}

// Analytics: Yield per property (fallback if not using base property yield)
export interface PropertyYield { propertyId: string; yield?: number }
export async function getYieldForProperty(propertyId: string): Promise<PropertyYield[] | []> {
  try {
    const { data } = await api.get(`/analytics/yield/retrieve/for-property/${propertyId}`);
    return Array.isArray(data) ? (data as PropertyYield[]) : [];
  } catch {
    return [] as PropertyYield[];
  }
}

// Analytics: Global Market Insights
export interface GlobalInsightsResult {
  propertyCount: number;
  avgRentalYield: number;
  avgROI: number;
  avgCTR: number;
  activeLeads: number;
  avgInquiries: number;
}

export async function getGlobalInsights(): Promise<GlobalInsightsResult | null> {
  try {
    const { data } = await api.get(`/analytics/market/global-insights`);
    return data as GlobalInsightsResult;
  } catch {
    return null;
  }
}

// Update an existing property
export async function updateProperty(propertyId: string, form: PropertyFormData) {
  const result = validateAndMapPropertyDto(form);
  if (!result.ok) {
    const msg = `Missing or invalid fields: ${result.missing.join(', ')}`;
    throw new Error(msg);
  }
  const { dto } = result;

  try {
    // Update the base property
    const { data: updatedProperty } = await api.patch(`/property/update/${propertyId}`, dto);

    const toArray = (v: unknown): string[] => {
      if (!v) return [];
      if (Array.isArray(v)) return v.map((x) => String(x)).filter((x) => x.trim().length > 0);
      if (typeof v === 'string') return v.trim().length > 0 ? [v] : [];
      return [];
    };

    // Fire-and-forget updates for related subtables
    const tasks: Promise<unknown>[] = [];

    // Pictures (expects hosted URLs)
    if (form.images && form.images.length > 0) {
      const images = form.images as unknown[];
      images.forEach((imageItem, i) => {
        const url = typeof imageItem === 'string' ? imageItem.trim() : '';
        if (!/^https?:\/\//i.test(url)) return;
        const payload: PictureCreateDto = {
          propertyId,
          imageData: url,
          altText: `Property image ${i + 1}`,
          isPrimary: i === 0,
        };
        tasks.push(api.post('/property/picture/create', payload));
      });
    }

    // HeatingSystem
    toArray(form.heatingSystem).forEach((hs) => {
      const payload: HeatingSystemCreateDto = {
        propertyId,
        heatingSystem: hs as HeatingSystemEnum,
      };
      tasks.push(api.post('/property/heating-system/create', payload));
    });

    // CoolingSystem
    toArray(form.coolingSystem).forEach((cs) => {
      const payload: CoolingSystemCreateDto = {
        propertyId,
        coolingSystem: cs as CoolingSystemEnum,
      };
      tasks.push(api.post('/property/cooling-system/create', payload));
    });

    // Kitchen
    toArray(form.kitchen).forEach((k) => {
      const payload: KitchenCreateDto = {
        propertyId,
        kitchen: k as KitchenEnum,
      };
      tasks.push(api.post('/property/kitchen/create', payload));
    });

    // Security
    toArray(form.security).forEach((sec) => {
      const payload: SecurityCreateDto = {
        propertyId,
        security: sec as SecurityEnum,
      };
      tasks.push(api.post('/property/security/create', payload));
    });

    // Utility
    toArray(form.utility).forEach((u) => {
      const payload: UtilityCreateDto = {
        propertyId,
        utility: u as UtilityEnum,
      };
      tasks.push(api.post('/property/utility/create', payload));
    });

    // SmartHomeFeature
    toArray(form.smartHomeFeature).forEach((f) => {
      const payload: SmartHomeFeatureCreateDto = {
        propertyId,
        smartHomeFeature: f as SmartHomeFeatureEnum,
      };
      tasks.push(api.post('/property/smart-home-feature/create', payload));
    });

    // OtherFeature
    toArray(form.otherFeature).forEach((of) => {
      const payload: OtherFeatureCreateDto = {
        propertyId,
        otherFeature: of as OtherFeatureEnum,
      };
      tasks.push(api.post('/property/other-feature/create', payload));
    });

    // InvestmentGoalTag
    toArray(form.investmentGoalTag).forEach((g) => {
      const payload: InvestmentGoalTagCreateDto = {
        propertyId,
        investmentGoalTag: g as InvestmentGoalTagEnum,
      };
      tasks.push(api.post('/property/investment-goal-tag/create', payload));
    });

    // LocationBenefitTag
    toArray(form.locationBenefitTag).forEach((b) => {
      const payload: LocationBenefitTagCreateDto = {
        propertyId,
        locationBenefitTag: b as LocationBenefitTagEnum,
      };
      tasks.push(api.post('/property/location-benefit-tag/create', payload));
    });

    // Execute all subtable updates in parallel
    try {
      await Promise.all(tasks);
    } catch {
      // partial failures in subtable updates are tolerated
    }

    // Recalculate and persist updated score after modifications
    try {
      const { data: calcScore } = await api.post(`/property/create-score/${propertyId}`);
      console.log(`🔄 Updating property ${propertyId} with new calculated score: ${calcScore}`);
      if (typeof calcScore === 'number') {
        await api.patch(`/property/update-score/${propertyId}`, { score: calcScore });
      }
    } catch {
      // Silent fail; UI can display stale score until next refresh
    }

    return updatedProperty;
  } catch (err: unknown) {
    console.error('❌ Error updating property');
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      const axiosErr = err as { response?: { data?: unknown; status?: number; statusText?: string } };
      if (axiosErr.response?.data) {
        console.error('Backend error response (data):', JSON.stringify(axiosErr.response.data, null, 2));
        console.error('Backend error status:', axiosErr.response.status);
        console.error('Backend error statusText:', axiosErr.response.statusText);
      }
    }
    throw err;
  }
}

