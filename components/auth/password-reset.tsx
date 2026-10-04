'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, MailCheck } from 'lucide-react';
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
import { errorStatus, requestPasswordReset, resetPassword } from '@/lib/auth/session';

const backToSignIn = (
  <>
    Remembered it?{' '}
    <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
      Sign in
    </Link>
  </>
);

// ── /forgot-password ──────────────────────────────────────────────────────────
const emailSchema = z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email address.') });
type EmailValues = z.infer<typeof emailSchema>;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const form = useForm<EmailValues>({ resolver: zodResolver(emailSchema), defaultValues: { email: '' } });

  const onSubmit = async ({ email }: EmailValues) => {
    try {
      await requestPasswordReset(email);
      setSentTo(email);
    } catch (e) {
      const status = errorStatus(e);
      form.setError('email', {
        message:
          status === 503
            ? 'Password reset by email is not available right now.'
            : status === 429
              ? 'Too many attempts. Wait a minute and try again.'
              : 'The request did not go through. Try again in a moment.',
      });
    }
  };

  if (sentTo) {
    return (
      <AuthShell title="Check your inbox" footer={backToSignIn}>
        <div role="status" className="flex flex-col items-center py-2 text-center">
          <MailCheck className="size-10 text-positive" aria-hidden />
          <p className="mt-4 text-muted-foreground">
            If <span className="font-medium break-all text-foreground">{sentTo}</span> has an account, a link to choose a new password is on its way. It works for 30 minutes.
          </p>
          <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSentTo(null)}>
            Use a different address
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset your password" description="Enter the email of your account and we will send you a link." footer={backToSignIn}>
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
          <Button type="submit" className="h-11 w-full rounded-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Sending the link' : 'Send the link'}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}

// ── /reset-password?token= ────────────────────────────────────────────────────
const passwordSchema = z
  .object({
    newPassword: z.string().min(8, 'Use at least 8 characters.').max(128, 'Use 128 characters or fewer.'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { message: 'The two passwords are different.', path: ['confirmPassword'] });
type PasswordValues = z.infer<typeof passwordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get('token');
  const [expired, setExpired] = React.useState(!token);
  const form = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema), defaultValues: { newPassword: '', confirmPassword: '' } });

  const onSubmit = async ({ newPassword }: PasswordValues) => {
    if (!token) return;
    try {
      await resetPassword(token, newPassword);
      toast.success('Password changed. Sign in with the new one.');
      router.push('/login');
    } catch (e) {
      const status = errorStatus(e);
      if (status === 401 || status === 404) setExpired(true);
      else if (status === 400) form.setError('newPassword', { message: 'That password was not accepted. Use 8 to 128 characters.' });
      else toast.error('The password was not changed. Try again in a moment.');
    }
  };

  if (expired) {
    return (
      <AuthShell title="Reset your password" footer={backToSignIn}>
        <div role="alert" className="flex flex-col items-center py-2 text-center">
          <CircleX className="size-10 text-destructive" aria-hidden />
          <p className="mt-4 text-lg font-medium">This link did not work</p>
          <p className="mt-1 text-muted-foreground">
            {token ? 'It has expired or was used already. Links work once, for 30 minutes.' : 'The link is missing its code. Open it again from the email.'}
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/forgot-password">Send a new link</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  const fields: [keyof PasswordValues, string][] = [
    ['newPassword', 'New password'],
    ['confirmPassword', 'Repeat the new password'],
  ];
  return (
    <AuthShell title="Choose a new password" description="You will be signed out everywhere and asked to sign in again." footer={backToSignIn}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {fields.map(([name, text]) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{text}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" className="h-11 w-full rounded-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving the password' : 'Save the password'}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
