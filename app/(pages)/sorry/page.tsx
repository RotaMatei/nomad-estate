import type { Metadata } from 'next';
import { NoticePage } from '@/components/site/notice-page';

export const metadata: Metadata = { title: 'Coming soon' };

export default function ComingSoon() {
  return <NoticePage code="Soon" title="This part of Nomad Estate is still being built" body="It is not ready to use yet. Searching, saving and contacting agencies all work today." />;
}
