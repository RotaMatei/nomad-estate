import type {
  PropertyTypeEnum,
  StatusEnum,
  EnergyRatingEnum,
  OrientationEnum,
  ParkingEnum,
  BalconyTypeEnum,
  HeatingSystemEnum,
  CoolingSystemEnum,
  KitchenEnum,
  SecurityEnum,
  UtilityEnum,
  SmartHomeFeatureEnum,
  OtherFeatureEnum,
  InvestmentGoalTagEnum,
  LocationBenefitTagEnum,
} from './Enums';

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
  type?: PropertyTypeEnum;
  status?: StatusEnum;
  price?: number;
  yield?: number;
  score?: number;
  energyEfficiencyRating?: EnergyRatingEnum;
  orientation?: OrientationEnum;
  parking?: ParkingEnum | ParkingEnum[];
  balconyType?: BalconyTypeEnum;
  balconyTotalSize?: number;
  balconyNumber?: number;
  heatingSystem?: HeatingSystemEnum | HeatingSystemEnum[];
  coolingSystem?: CoolingSystemEnum | CoolingSystemEnum[];
  kitchen?: KitchenEnum | KitchenEnum[];
  security?: SecurityEnum | SecurityEnum[];
  utility?: UtilityEnum | UtilityEnum[];
  smartHomeFeature?: SmartHomeFeatureEnum | SmartHomeFeatureEnum[];
  otherFeature?: OtherFeatureEnum | OtherFeatureEnum[];
  investmentGoalTag?: InvestmentGoalTagEnum | InvestmentGoalTagEnum[];
  locationBenefitTag?: LocationBenefitTagEnum | LocationBenefitTagEnum[];
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
