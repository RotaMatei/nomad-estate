import type { Metadata } from 'next';
import { NewPropertyPage } from '@/components/dashboard/property-form';

export const metadata: Metadata = { title: 'Add a property' };

export default function Page() {
  return <NewPropertyPage />;
}
