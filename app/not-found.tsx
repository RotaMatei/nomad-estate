import type { Metadata } from 'next';
import { NoticePage } from '@/components/site/notice-page';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return <NoticePage code="404" title="This page is off the map" body="The address may be mistyped, or the page was moved. Every property is still on the globe." />;
}
