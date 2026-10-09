import type { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/dashboard-view';

export const metadata: Metadata = { title: 'Agency dashboard' };

export default function DashboardPage() {
  // the agency's side of the site: coral leads here
  return (
    <div className="audience-agency">
      <DashboardView />
    </div>
  );
}
