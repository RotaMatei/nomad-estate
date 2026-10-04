import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChangePasswordForm } from '@/components/auth/account-forms';

export const metadata: Metadata = { title: 'Change password' };

export default function Page() {
  return (
    <Suspense>
      <ChangePasswordForm kind="user" />
    </Suspense>
  );
}
