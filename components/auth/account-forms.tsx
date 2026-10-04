'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, CircleX } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthShell } from './auth-shell';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useSession } from '@/hooks/use-session';
import { changePassword, confirmEmail, errorStatus, type AccountKind } from '@/lib/auth/session';

// ── /verify?token= ────────────────────────────────────────────────────────────
export function VerifyEmail() {
  const token = useSearchParams().get('token');
  const [state, setState] = React.useState<'working' | 'done' | 'failed'>(token ? 'working' : 'failed');

  React.useEffect(() => {
    if (!token) return;
    let cancelled = false;
    confirmEmail(token).then(
      () => !cancelled && setState('done'),
      () => !cancelled && setState('failed'),
    );
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <AuthShell title="Email confirmation">
      <div role="status" className="flex flex-col items-center py-2 text-center">
        {state === 'working' ? (
          <>
            <Spinner className="size-8" />
            <p className="mt-4 text-muted-foreground">Confirming your email address.</p>
          </>
        ) : state === 'done' ? (
          <>
            <CircleCheck className="size-10 text-positive" aria-hidden />
            <p className="mt-4 text-lg font-medium">Your email is confirmed</p>
            <p className="mt-1 text-muted-foreground">You can sign in now.</p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/login">Sign in</Link>
            </Button>
          </>
        ) : (
          <>
            <CircleX className="size-10 text-destructive" aria-hidden />
            <p className="mt-4 text-lg font-medium">This link did not work</p>
            <p className="mt-1 text-muted-foreground">
              {token ? 'It may have expired or been used already. Sign in to request a new one.' : 'The link is missing its confirmation code. Open it again from the email.'}
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-full">
              <Link href="/login">Go to sign in</Link>
            </Button>
          </>
        )}
      </div>
    </AuthShell>
  );
}

/** Auth pages for a specific account type send everyone else to sign in. */
function useAccount(kind: AccountKind) {
  const { session, signOut } = useSession();
  const matches = !!session && session.isAgency === (kind === 'agency');
  return { session: matches ? session : null, signOut };
}

function NeedsSignIn() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Sign in to the account you want to change.</p>
      <Button asChild className="rounded-full">
        <Link href="/login">Sign in</Link>
      </Button>
    </div>
  );
}

// ── change password ───────────────────────────────────────────────────────────
const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: z.string().min(8, 'Use at least 8 characters.').max(128, 'Use 128 characters or fewer.'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { message: 'The two new passwords are different.', path: ['confirmPassword'] })
  .refine((v) => v.newPassword !== v.oldPassword, { message: 'Choose a password you have not just used.', path: ['newPassword'] });
type PasswordValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm({ kind }: { kind: AccountKind }) {
  const router = useRouter();
  const { session, signOut } = useAccount(kind);
  const form = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema), defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' } });

  const onSubmit = async (values: PasswordValues) => {
    if (!session) return;
    try {
      await changePassword(kind, session.id, values.oldPassword, values.newPassword);
      // Old tokens are no longer trustworthy after a password change: start a fresh session.
      await signOut();
      toast.success('Password changed. Sign in with the new one.');
      router.push('/login');
    } catch (e) {
      const status = errorStatus(e);
      if (status === 401 || status === 403 || status === 400) form.setError('oldPassword', { message: 'That is not your current password.' });
      else toast.error('The password was not changed. Try again in a moment.');
    }
  };

  const fields: [keyof PasswordValues, string, string][] = [
    ['oldPassword', 'Current password', 'current-password'],
    ['newPassword', 'New password', 'new-password'],
    ['confirmPassword', 'Repeat the new password', 'new-password'],
  ];
  return (
    <AuthShell title="Change password" description={session ? 'You will be signed out everywhere and asked to sign in again.' : undefined}>
      {!session ? (
        <NeedsSignIn />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {fields.map(([name, text, autoComplete]) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{text}</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete={autoComplete} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="rounded-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Changing password' : 'Change password'}
              </Button>
              <Button type="button" variant="ghost" className="rounded-full" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </AuthShell>
  );
}

// ── sign out ──────────────────────────────────────────────────────────────────
export function SignOutPanel({ kind }: { kind: AccountKind }) {
  const router = useRouter();
  const { session, signOut } = useAccount(kind);
  const [busy, setBusy] = React.useState(false);

  return (
    <AuthShell title="Sign out" description={session ? `You are signed in${session.name ? ` as ${session.name}` : ''}.` : 'You are not signed in.'}>
      {session ? (
        <div className="flex gap-2">
          <Button
            className="rounded-full"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await signOut();
              router.push('/');
            }}
          >
            {busy ? 'Signing out' : 'Sign out'}
          </Button>
          <Button variant="ghost" className="rounded-full" onClick={() => router.back()}>
            Stay signed in
          </Button>
        </div>
      ) : (
        <Button asChild className="rounded-full">
          <Link href="/">Go to the home page</Link>
        </Button>
      )}
    </AuthShell>
  );
}
