import api from './api';
import { PropertyFormData } from '../components/createPropertyComponents/types';

// Keys required by backend PropertyDto. All must be present and with correct types.
const REQUIRED_FIELDS = [
  'agencyId',
  'agentId',
  'title',
  'description',
  'type',
  'status',
  'price',
  'yield',
  'score',
  'streetAddress',
  'stateId',
  'postalCode',
  'countryId',
  'cityId',
  'latitude',
  'longitude',
  'constructionDate',
  'builtArea',
  'landArea',
  'totalArea',
  'rooms',
  'bedrooms',
  'bathrooms',
  'floors',
  'floorLevel',
  'energyEfficiencyRating',
  'orientation',
  'parking',
  'balconyType',
  'balconyTotalSize',
  'balconyNumber',
  'ownershipStatus',
  'propertyTaxes',
  'HOAFees',
  'availabilityDateStart',
  'availabilityDateEnd',
] as const;

type RequiredField = (typeof REQUIRED_FIELDS)[number];

function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string' || !value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function ensureNumber(n: unknown): n is number {
  return typeof n === 'number' && !isNaN(n);
}

function ensureString(s: unknown): s is string {
  return typeof s === 'string' && s.trim().length > 0;
}

function ensureBoolean(b: unknown): b is boolean {
  return typeof b === 'boolean';
}

export function validateAndMapPropertyDto(form: PropertyFormData) {
  const missing: string[] = [];

  // Validate primitives according to expected types
  const checkString = (key: RequiredField) => {
    if (!ensureString(form[key])) missing.push(key);
  };
  const checkNumber = (key: RequiredField) => {
    if (!ensureNumber(form[key])) missing.push(key);
  };
  const checkBoolean = (key: RequiredField) => {
    if (!ensureBoolean(form[key])) missing.push(key);
  };
  const checkDate = (key: RequiredField) => {
    if (!isValidDateString(form[key])) missing.push(key);
  };

  // Strings / enums
  ['agencyId', 'agentId', 'title', 'description', 'type', 'status', 'streetAddress', 'postalCode', 'energyEfficiencyRating', 'orientation', 'parking', 'balconyType']
    .forEach((k) => checkString(k as RequiredField));

  // Numbers (ints/decimals)
  ['price', 'yield', 'score', 'stateId', 'countryId', 'cityId', 'latitude', 'longitude', 'builtArea', 'landArea', 'totalArea', 'rooms', 'bedrooms', 'bathrooms', 'floors', 'floorLevel', 'balconyTotalSize', 'balconyNumber', 'propertyTaxes', 'HOAFees']
    .forEach((k) => checkNumber(k as RequiredField));

  // Boolean
  checkBoolean('ownershipStatus');

  // Dates
  ['constructionDate', 'availabilityDateStart', 'availabilityDateEnd']
    .forEach((k) => checkDate(k as RequiredField));

  if (missing.length) {
    return { ok: false as const, missing };
  }

  // Safe to map now (type assertions because we've validated)
  const dto = {
    agencyId: form.agencyId as string,
    agentId: form.agentId as string,
    title: form.title as string,
    description: form.description as string,
    type: form.type as string,
    status: form.status as string,
    price: form.price as number,
    yield: form.yield as number,
    score: form.score as number,
    streetAddress: form.streetAddress as string,
    stateId: form.stateId as number,
    postalCode: form.postalCode as string,
    countryId: form.countryId as number,
    cityId: form.cityId as number,
    latitude: form.latitude as number,
    longitude: form.longitude as number,
    constructionDate: new Date(form.constructionDate as string).toISOString(),
    builtArea: form.builtArea as number,
    landArea: form.landArea as number,
    totalArea: form.totalArea as number,
    rooms: form.rooms as number,
    bedrooms: form.bedrooms as number,
    bathrooms: form.bathrooms as number,
    floors: form.floors as number,
    floorLevel: form.floorLevel as number,
    energyEfficiencyRating: form.energyEfficiencyRating as string,
    orientation: form.orientation as string,
    parking: form.parking as string,
    balconyType: form.balconyType as string,
    balconyTotalSize: form.balconyTotalSize as number,
    balconyNumber: form.balconyNumber as number,
    ownershipStatus: form.ownershipStatus as boolean,
    propertyTaxes: form.propertyTaxes as number,
    HOAFees: form.HOAFees as number,
    availabilityDateStart: new Date(form.availabilityDateStart as string).toISOString(),
    availabilityDateEnd: new Date(form.availabilityDateEnd as string).toISOString(),
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
  const { data } = await api.post('/property/create', dto);
  return data;
}
