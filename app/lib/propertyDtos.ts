// Frontend DTO interfaces mirroring backend subtable DTOs
// These are used when creating related records after a property is created.

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
} from './property/enums';

export interface PictureCreateDto {
  propertyId: string;
  imageData: string; // URL to hosted image
  altText?: string;
  isPrimary?: boolean;
}

export interface HeatingSystemCreateDto {
  propertyId: string;
  heatingSystem: HeatingSystemEnum;
}

export interface CoolingSystemCreateDto {
  propertyId: string;
  coolingSystem: CoolingSystemEnum;
}

export interface KitchenCreateDto {
  propertyId: string;
  kitchen: KitchenEnum;
}

export interface SecurityCreateDto {
  propertyId: string;
  security: SecurityEnum;
}

export interface UtilityCreateDto {
  propertyId: string;
  utility: UtilityEnum;
}

export interface SmartHomeFeatureCreateDto {
  propertyId: string;
  smartHomeFeature: SmartHomeFeatureEnum;
}

export interface OtherFeatureCreateDto {
  propertyId: string;
  otherFeature: OtherFeatureEnum;
}

export interface InvestmentGoalTagCreateDto {
  propertyId: string;
  investmentGoalTag: InvestmentGoalTagEnum;
}

export interface LocationBenefitTagCreateDto {
  propertyId: string;
  locationBenefitTag: LocationBenefitTagEnum;
}
