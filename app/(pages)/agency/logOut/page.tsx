import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignOutPanel } from '@/components/auth/account-forms';

export const metadata: Metadata = { title: 'Sign out' };

export default function Page() {
  return (
    <Suspense>
      <SignOutPanel kind="agency" />
    </Suspense>
  );
}
