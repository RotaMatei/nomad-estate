import type { Metadata } from 'next';
import { PropertyDetailsView } from '@/components/details/property-details';

export const metadata: Metadata = { title: 'Property details' };

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropertyDetailsView id={id} />;
}
