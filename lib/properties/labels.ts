import {
  INVESTMENT_GOAL_TAGS,
  LOCATION_BENEFIT_TAGS,
  type InvestmentGoalTagEnum,
  type LocationBenefitTagEnum,
} from '@/app/enums';

export { INVESTMENT_GOAL_TAGS, LOCATION_BENEFIT_TAGS };
export type { InvestmentGoalTagEnum, LocationBenefitTagEnum };

export const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'DUPLEX', 'STUDIO'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  VILLA: 'Villa',
  DUPLEX: 'Duplex',
  STUDIO: 'Studio',
};

export const GOAL_LABEL: Record<InvestmentGoalTagEnum, string> = {
  HIGH_ROI: 'High ROI',
  CASH_FLOW_POSITIVE: 'Cash-flow positive',
  SHORT_TERM_RENTAL_READY: 'Short-term rental ready',
  LONG_TERM_RENTAL_STABLE: 'Stable long-term rental',
  FIX_AND_FLIP: 'Fix and flip',
  NEW_DEVELOPMENT: 'New development',
  BELOW_MARKET_VALUE: 'Below market value',
  TURNKEY_INVESTMENT: 'Turnkey',
  MULTI_UNIT: 'Multi-unit',
  STUDENT_HOUSING: 'Student housing',
  RETIREMENT_INCOME: 'Retirement income',
  VACATION_HOME_INCOME: 'Holiday-home income',
  COMMERCIAL_CONVERSION: 'Commercial conversion',
};

export const BENEFIT_LABEL: Record<LocationBenefitTagEnum, string> = {
  TAX_FREE_ZONE: 'Tax-free zone',
  LOW_PROPERTY_TAX: 'Low property tax',
  URBAN_GROWTH_ZONE: 'Urban growth zone',
  TOURIST_HOTSPOT: 'Tourist hotspot',
  NEAR_INFRASTUCTURE_PROJECT: 'Near new infrastructure',
  ECONOMIC_HUB: 'Economic hub',
  EXPAT_FRIENDLY: 'Expat friendly',
  GREEN_ZONE: 'Green zone',
  HERITAGE_ZONE: 'Heritage zone',
  SAFE_NEIGHBORHOOD: 'Safe neighbourhood',
  SCHOOL_DISTRICT: 'Good schools nearby',
  COASTAL_ACCESS: 'Coastal access',
  MOUNTAIN_VIEW: 'Mountain view',
  EU_RESIDENCY_ELIGIBLE: 'EU residency eligible',
  GOLDEN_VISA: 'Golden visa eligible',
};
