export interface PropertyFormData {
  streetAddress?: string;
  postalCode?: string;
  cityId?: number;
  stateId?: number;
  countryId?: number;
  latitude?: number;
  longitude?: number;
  agencyId?: string;
  agentId?: string;
  title?: string;
  description?: string;
  type?: string; // Could be PropertyTypeEnum
  status?: string; // Could be StatusEnum
  price?: number;
  yield?: number;
  score?: number;
  energyEfficiencyRating?: string;
  orientation?: string;
  parking?: string;
  balconyType?: string;
  balconyTotalSize?: number;
  balconyNumber?: number;
  heatingSystem?: string;
  coolingSystem?: string;
  kitchen?: string;
  security?: string;
  utility?: string;
  smartHomeFeature?: string;
  otherFeature?: string;
  investmentGoalTag?: string;
  locationBenefitTag?: string;
  ownershipStatus?: boolean;
  propertyTaxes?: number;
  HOAFees?: number;
  // Dates captured as strings (e.g., YYYY-MM-DD) then converted to ISO during submit
  constructionDate?: string;
  availabilityDateStart?: string;
  availabilityDateEnd?: string;
  builtArea?: number;
  landArea?: number;
  totalArea?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  floorLevel?: number;
  // Image URLs or File objects
  images?: string[] | File[];
  // Allow additional dynamically added fields without using 'any'
  [key: string]: unknown;
}
