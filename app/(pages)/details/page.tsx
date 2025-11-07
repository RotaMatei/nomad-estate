import PropertyDetails from '../../components/detailsComponents/PropertyDetails';

async function getProperty(id: string) {
  // Replace with actual API call
  return {
    title: 'Downtown Tineretului-Poppy',
    description: 'Self Check-in, Tram & Metro access, cozy and clean.',
    type: 'APARTMENT',
    status: 'AVAILABLE',
    price: 65000,
    yield: 6.5,
    score: 8,
    streetAddress: 'Strada Tineretului 12',
    postalCode: '040353',
    cityId: 1,
    stateId: 10,
    countryId: 40,
    latitude: 44.4167,
    longitude: 26.1000,
    builtArea: 45,
    landArea: 0,
    totalArea: 45,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    floors: 10,
    floorLevel: 4,
    energyEfficiencyRating: 'B',
    orientation: 'SE',
    parking: 'STREET_PARKING',
    balconyType: 'BALCONY',
    balconyTotalSize: 5,
    balconyNumber: 1,
    ownershipStatus: true,
    propertyTaxes: 120,
    HOAFees: 30,
    availabilityDateStart: '2023-01-01',
    availabilityDateEnd: '2023-12-31',
    heatingSystem: 'CENTRAL',
    coolingSystem: 'AC',
    kitchen: 'FURNISHED',
    security: 'CAMERAS',
    utility: 'WATER',
    smartHomeFeature: 'LOCKS',
    otherFeature: 'BBQ_AREA',
    investmentGoalTag: 'SHORT_TERM_RENTAL_READY',
    locationBenefitTag: 'TOURIST_HOTSPOT',
  };
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  return <PropertyDetails property={property} />;
}