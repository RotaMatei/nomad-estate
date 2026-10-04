import type { Metadata } from 'next';
import { EditPropertyPage } from '@/components/dashboard/property-form';

export const metadata: Metadata = { title: 'Edit property' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditPropertyPage id={id} />;
}
