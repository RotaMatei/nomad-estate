'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthShell } from './auth-shell';
import api from '@/app/lib/api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { errorStatus, googleSignInUrl, persistSession, signIn, type AuthResponse } from '@/lib/auth/session';

const schema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});
type Values = z.infer<typeof schema>;

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.300-2.100 3.500-5.200 3.500-8.800Z" />
      <path fill="#34A853" d="M12 24c3.200 0 6-1.100 8-2.900l-3.900-3a7.200 7.200 0 0 1-10.800-3.800H1.300v3.100A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.300 14.300a7.200 7.200 0 0 1 0-4.600V6.600H1.300a12 12 0 0 0 0 10.800l4-3.100Z" />
      <path fill="#EA4335" d="M12 4.800c1.800 0 3.400.6 4.600 1.800l3.500-3.500A12 12 0 0 0 1.300 6.600l4 3.100A7.200 7.200 0 0 1 12 4.800Z" />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [googleBusy, setGoogleBusy] = React.useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  // Google sends people back with `?code=`; exchange it for a session.
  const code = params.get('code');
  React.useEffect(() => {
    if (!code) return;
    let cancelled = false;
    api
      .get<AuthResponse>('/oauth/user/google/callback', { params: { code } })
      .then(({ data }) => {
        if (cancelled || !data?.accessToken) return;
        persistSession(data, 'user');
        router.replace('/properties');
      })
      .catch(() => !cancelled && toast.error('Google sign-in did not finish. Try again, or sign in with your email.'));
    return () => {
      cancelled = true;
    };
  }, [code, router]);

  const onSubmit = async ({ email, password }: Values) => {
    setFormError(null);
    try {
      const kind = await signIn(email, password);
      router.push(kind === 'agency' ? '/dashboard' : '/properties');
    } catch (e) {
      const status = errorStatus(e);
      setFormError(
        status === 429
          ? 'Too many attempts. Wait a minute, then try again.'
          : status == null || status >= 500
            ? 'The server did not answer. Check your connection and try again.'
            : 'That email and password do not match an account. Check both and try again.',
      );
    }
  };

  const withGoogle = async () => {
    setGoogleBusy(true);
    try {
      window.location.assign(await googleSignInUrl());
    } catch {
      setGoogleBusy(false);
      toast.error('Google sign-in is not available right now. Sign in with your email instead.');
    }
  };

  return (
    <AuthShell
      title="Sign in"
      description="Investor and agency accounts use the same form."
      footer={
        <>
          New to Nomad Estate?{' '}
          <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" inputMode="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {formError && (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}
          <Button type="submit" className="h-11 w-full rounded-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button type="button" variant="outline" className="h-11 w-full rounded-full" onClick={withGoogle} disabled={googleBusy}>
        <GoogleMark /> Continue with Google
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">Google sign-in is for investor accounts.</p>
    </AuthShell>
  );
}
