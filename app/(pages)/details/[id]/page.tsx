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
  cityName?: string;
  stateName?: string;
  countryName?: string;
}

async function fetchProperty(id: string): Promise<PropertyDto | null> {
  try {
    const res = await api.get(`/property/retrieve-details/${id}`);
    const property = res.data || null;
    
    if (!property) return null;

    // Fetch location names if IDs are available
    let cityName: string | undefined;
    let stateName: string | undefined;
    let countryName: string | undefined;

    // Fetch city name
    if (property.cityId) {
      try {
        const cityRes = await api.get(`/cities/retrieve/${property.cityId}`);
        cityName = cityRes.data?.name;
      } catch (error) {
        console.warn(`Failed to fetch city name for ID ${property.cityId}`);
      }
    }

    // Fetch state name
    if (property.stateId) {
      try {
        const stateRes = await api.get(`/states/retrieve/${property.stateId}`);
        stateName = stateRes.data?.name;
      } catch (error) {
        console.warn(`Failed to fetch state name for ID ${property.stateId}`);
      }
    }

    // Fetch country name
    if (property.countryId) {
      try {
        const countryRes = await api.get(`/countries/retrieve/${property.countryId}`);
        countryName = countryRes.data?.name;
      } catch (error) {
        console.warn(`Failed to fetch country name for ID ${property.countryId}`);
      }
    }

    return {
      ...property,
      cityName,
      stateName,
      countryName,
    };
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