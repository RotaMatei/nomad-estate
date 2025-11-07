"use client";

import { Typography, Container, Divider } from '@mui/material';
import SectionHeader from './SectionHeader';
import InfoGrid from './InfoGrid';

// Define a narrowed type for display (subset of full DTO)
interface DisplayProperty {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  price?: number;
  yield?: number;
  score?: number;
  streetAddress?: string;
  postalCode?: string;
  cityId?: number;
  stateId?: number;
  countryId?: number;
  latitude?: number;
  longitude?: number;
  builtArea?: number;
  landArea?: number;
  totalArea?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  floorLevel?: number;
  energyEfficiencyRating?: string;
  orientation?: string;
  parking?: string;
  balconyType?: string;
  balconyTotalSize?: number;
  balconyNumber?: number;
  ownershipStatus?: boolean;
  availabilityDateStart?: string;
  availabilityDateEnd?: string;
  heatingSystem?: string;
  coolingSystem?: string;
  kitchen?: string;
  security?: string;
  utility?: string;
  smartHomeFeature?: string;
  investmentGoalTag?: string;
  locationBenefitTag?: string;
  otherFeature?: string;
  propertyTaxes?: number;
  HOAFees?: number;
}

interface PropertyDetailsProps {
  property: DisplayProperty;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {property.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {property.description}
      </Typography>

      <Divider />

      <SectionHeader title="🏠 Basic Info" />
      <InfoGrid
        items={[
          { label: 'Type', value: property.type },
          { label: 'Status', value: property.status },
          { label: 'Price', value: `${property.price} €` },
          { label: 'Yield', value: `${property.yield}%` },
          { label: 'Score', value: property.score },
        ]}
      />

      <SectionHeader title="📍 Location" />
      <InfoGrid
        items={[
          { label: 'Street', value: property.streetAddress },
          { label: 'Postal Code', value: property.postalCode },
          { label: 'City ID', value: property.cityId },
          { label: 'State ID', value: property.stateId },
          { label: 'Country ID', value: property.countryId },
          { label: 'Latitude', value: property.latitude },
          { label: 'Longitude', value: property.longitude },
        ]}
      />

      <SectionHeader title="📐 Dimensions" />
      <InfoGrid
        items={[
          { label: 'Built Area', value: `${property.builtArea} m²` },
          { label: 'Land Area', value: `${property.landArea} m²` },
          { label: 'Total Area', value: `${property.totalArea} m²` },
          { label: 'Rooms', value: property.rooms },
          { label: 'Bedrooms', value: property.bedrooms },
          { label: 'Bathrooms', value: property.bathrooms },
          { label: 'Floors', value: property.floors },
          { label: 'Floor Level', value: property.floorLevel },
        ]}
      />

      <SectionHeader title="🔧 Features" />
      <InfoGrid
        items={[
          { label: 'Energy Rating', value: property.energyEfficiencyRating },
          { label: 'Orientation', value: property.orientation },
          { label: 'Parking', value: property.parking },
          { label: 'Balcony Type', value: property.balconyType },
          { label: 'Balcony Size', value: `${property.balconyTotalSize} m²` },
          { label: 'Balconies', value: property.balconyNumber },
          { label: 'Ownership', value: property.ownershipStatus ? 'Owned' : 'Not Owned' },
        ]}
      />

      <SectionHeader title="📅 Availability" />
      <InfoGrid
        items={[
          { label: 'Available From', value: property.availabilityDateStart?.slice(0, 10) },
          { label: 'Available Until', value: property.availabilityDateEnd?.slice(0, 10) },
        ]}
      />

      <SectionHeader title="💡 Systems & Utilities" />
      <InfoGrid
        items={[
          { label: 'Heating', value: property.heatingSystem },
          { label: 'Cooling', value: property.coolingSystem },
          { label: 'Kitchen', value: property.kitchen },
          { label: 'Security', value: property.security },
          { label: 'Utility', value: property.utility },
          { label: 'Smart Home', value: property.smartHomeFeature },
        ]}
      />

      <SectionHeader title="🎯 Investment & Location Tags" />
      <InfoGrid
        items={[
          { label: 'Investment Goal', value: property.investmentGoalTag },
          { label: 'Location Benefit', value: property.locationBenefitTag },
        ]}
      />

      <SectionHeader title="🔥 Extras" />
      <InfoGrid
        items={[
          { label: 'Other Feature', value: property.otherFeature },
          { label: 'Property Taxes', value: `${property.propertyTaxes} €` },
          { label: 'HOA Fees', value: `${property.HOAFees} €` },
        ]}
      />
    </Container>
  );
}