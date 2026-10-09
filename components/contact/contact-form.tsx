'use client';

import { Check } from 'lucide-react';
import * as React from 'react';
import { apiConfig } from '@/app/config/env';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

const TOPICS = ['I am an investor', 'I represent an agency', 'Press', 'Something else'];

/** The contact form: sends to the API's contact inbox (`POST /mail/contact`, multipart: email, message). */
export function ContactForm() {
  const [topic, setTopic] = React.useState(TOPICS[0]);
  const [state, setState] = React.useState<{ kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }>({ kind: 'idle' });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = new FormData();
    body.set('email', String(form.get('email') ?? '').trim());
    body.set('message', `[${topic}] ${String(form.get('name') ?? '').trim()}\n\n${String(form.get('message') ?? '').trim()}`);
    setState({ kind: 'sending' });
    try {
      const response = await fetch(`${apiConfig.baseURL}/mail/contact`, { method: 'POST', body });
      if (response.ok) return setState({ kind: 'sent' });
      const answer = (await response.json().catch(() => null)) as { message?: string } | null;
      setState({ kind: 'error', message: answer?.message ?? 'The message could not be sent. Write to us by email instead.' });
    } catch {
      setState({ kind: 'error', message: 'The message could not be sent. Check your connection, or write to us by email.' });
    }
  };

  if (state.kind === 'sent') {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-2xl border bg-card p-8">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
          <Check className="size-5 text-positive" aria-hidden />
        </span>
        <h2 className="text-xl font-semibold">Message sent</h2>
        <p className="text-muted-foreground">We answer within two working days, at the address you gave.</p>
        <Button variant="outline" className="rounded-full" onClick={() => setState({ kind: 'idle' })}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border bg-card p-6 sm:p-8">
      <fieldset>
        <legend className="text-sm font-medium">What is it about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className={`h-9 rounded-full border px-4 text-sm transition-colors ${topic === t ? 'border-foreground bg-foreground text-background' : 'hover:bg-accent'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Your name</Label>
          <Input id="contact-name" name="name" autoComplete="name" required maxLength={120} className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" autoComplete="email" required className="h-11" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" required minLength={10} maxLength={4000} rows={6} />
      </div>
      {state.kind === 'error' && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
      <Button type="submit" className="h-11 rounded-full px-6" disabled={state.kind === 'sending'}>
        {state.kind === 'sending' && <Spinner aria-label="Sending" />}
        Send message
      </Button>
    </form>
  );
}
