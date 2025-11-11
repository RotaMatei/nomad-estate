import api from './api';
import { PropertyFormData } from '../components/createPropertyComponents/types';

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
    parking: optionalString(form.parking) ?? 'NONE',
    balconyType: optionalString(form.balconyType) ?? 'NONE',
    balconyTotalSize: optionalNumber(form.balconyTotalSize) ?? 0,
    balconyNumber: optionalNumber(form.balconyNumber) ?? 0,
    ownershipStatus: form.ownershipStatus ?? true,
    propertyTaxes: optionalNumber(form.propertyTaxes) ?? 0,
    HOAFees: optionalNumber(form.HOAFees) ?? 0,
    availabilityDateStart: optionalDate(form.availabilityDateStart) ?? new Date().toISOString(),
    availabilityDateEnd: optionalDate(form.availabilityDateEnd),  // nullable in schema
    // Multi-select fields (take first value if array)
    heatingSystem: optionalStringOrArray(form.heatingSystem) ?? 'NATURAL_GAS',
    coolingSystem: optionalString(form.coolingSystem) ?? 'NO_COOLING',
    security: optionalStringOrArray(form.security),
    utility: optionalStringOrArray(form.utility),
    smartHomeFeature: optionalStringOrArray(form.smartHomeFeature),
    otherFeature: optionalStringOrArray(form.otherFeature),
    investmentGoalTag: optionalStringOrArray(form.investmentGoalTag),
    locationBenefitTag: optionalStringOrArray(form.locationBenefitTag),
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

    // Upload images if any exist
    if (form.images && form.images.length > 0) {
      const propertyId = createdProperty.id;
      
      try {
        for (let i = 0; i < form.images.length; i++) {
          const imageItem = form.images[i] as unknown;
          // Expecting imageItem to be a hosted URL string (e.g., from imgbb)
          const url = typeof imageItem === 'string' ? imageItem.trim() : '';
          if (!/^https?:\/\//i.test(url)) {
            console.warn('[createProperty] Skipping non-URL image item', imageItem);
            continue;
          }

          await api.post('/property/picture/create', {
            propertyId,
            imageData: url,
            altText: `Property image ${i + 1}`,
            isPrimary: i === 0, // First image is primary
          });
        }
      } catch {
        // Don't throw - property was created successfully, just images failed
        // You might want to notify the user about partial failure
      }
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
