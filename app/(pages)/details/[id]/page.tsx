import PropertyDetails from '../../../components/detailsComponents/PropertyDetails';
import api from '@/app/lib/api';

interface PropertyPictureDto {
  id: string;
  propertyId: string;
  imageData: string; // base64 from backend
  altText?: string | null;
  isPrimary: boolean;
}

interface PropertyDto {
  title?: string; description?: string; type?: string; status?: string; price?: number; yield?: number; score?: number;
  streetAddress?: string; postalCode?: string; cityId?: number; stateId?: number; countryId?: number; latitude?: number; longitude?: number;
  builtArea?: number; landArea?: number; totalArea?: number; rooms?: number; bedrooms?: number; bathrooms?: number; floors?: number; floorLevel?: number;
  energyEfficiencyRating?: string; orientation?: string; parking?: string; balconyType?: string; balconyTotalSize?: number; balconyNumber?: number;
  ownershipStatus?: boolean; propertyTaxes?: number; HOAFees?: number; availabilityDateStart?: string; availabilityDateEnd?: string;
  heatingSystem?: string; coolingSystem?: string; kitchen?: string; security?: string; utility?: string; smartHomeFeature?: string; otherFeature?: string;
  investmentGoalTag?: string; locationBenefitTag?: string;
  picture?: PropertyPictureDto[];
}

async function fetchProperty(id: string): Promise<PropertyDto | null> {
  try {
    const res = await api.get(`/property/retrieve-details/${id}`);
    return res.data || null;
  } catch {
    return null;
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await fetchProperty(id);
  if (!property) {
    return <div style={{ padding: 32 }}>Failed to load property details.</div>;
  }
  return <PropertyDetails property={property} />;
}