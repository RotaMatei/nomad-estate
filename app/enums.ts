export enum RoleEnum {
  INVESTOR = 'INVESTOR',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

// Shared tag enums for frontend usage. These mirror backend enums.
export type InvestmentGoalTagEnum =
  | 'HIGH_ROI'
  | 'CASH_FLOW_POSITIVE'
  | 'SHORT_TERM_RENTAL_READY'
  | 'LONG_TERM_RENTAL_STABLE'
  | 'FIX_AND_FLIP'
  | 'NEW_DEVELOPMENT'
  | 'BELOW_MARKET_VALUE'
  | 'TURNKEY_INVESTMENT'
  | 'MULTI_UNIT'
  | 'STUDENT_HOUSING'
  | 'RETIREMENT_INCOME'
  | 'VACATION_HOME_INCOME'
  | 'COMMERCIAL_CONVERSION';

export type LocationBenefitTagEnum =
  | 'TAX_FREE_ZONE'
  | 'LOW_PROPERTY_TAX'
  | 'URBAN_GROWTH_ZONE'
  | 'TOURIST_HOTSPOT'
  | 'NEAR_INFRASTUCTURE_PROJECT'
  | 'ECONOMIC_HUB'
  | 'EXPAT_FRIENDLY'
  | 'GREEN_ZONE'
  | 'HERITAGE_ZONE'
  | 'SAFE_NEIGHBORHOOD'
  | 'SCHOOL_DISTRICT'
  | 'COASTAL_ACCESS'
  | 'MOUNTAIN_VIEW'
  | 'EU_RESIDENCY_ELIGIBLE'
  | 'GOLDEN_VISA';

export const INVESTMENT_GOAL_TAGS: readonly InvestmentGoalTagEnum[] = [
  'HIGH_ROI',
  'CASH_FLOW_POSITIVE',
  'SHORT_TERM_RENTAL_READY',
  'LONG_TERM_RENTAL_STABLE',
  'FIX_AND_FLIP',
  'NEW_DEVELOPMENT',
  'BELOW_MARKET_VALUE',
  'TURNKEY_INVESTMENT',
  'MULTI_UNIT',
  'STUDENT_HOUSING',
  'RETIREMENT_INCOME',
  'VACATION_HOME_INCOME',
  'COMMERCIAL_CONVERSION',
] as const;

export const LOCATION_BENEFIT_TAGS: readonly LocationBenefitTagEnum[] = [
  'TAX_FREE_ZONE',
  'LOW_PROPERTY_TAX',
  'URBAN_GROWTH_ZONE',
  'TOURIST_HOTSPOT',
  'NEAR_INFRASTUCTURE_PROJECT',
  'ECONOMIC_HUB',
  'EXPAT_FRIENDLY',
  'GREEN_ZONE',
  'HERITAGE_ZONE',
  'SAFE_NEIGHBORHOOD',
  'SCHOOL_DISTRICT',
  'COASTAL_ACCESS',
  'MOUNTAIN_VIEW',
  'EU_RESIDENCY_ELIGIBLE',
  'GOLDEN_VISA',
] as const;

export const isInvestmentGoalTag = (v: string): v is InvestmentGoalTagEnum => (
  (INVESTMENT_GOAL_TAGS as readonly string[]).includes(v)
);

export const isLocationBenefitTag = (v: string): v is LocationBenefitTagEnum => (
  (LOCATION_BENEFIT_TAGS as readonly string[]).includes(v)
);
