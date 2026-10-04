'use client';

import * as React from 'react';

/** Last-resort boundary around the whole app: a render error shows a way forward instead of a blank page. */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="mx-auto flex min-h-[100svh] max-w-xl flex-col justify-center px-5 py-20">
        <h1 className="font-display text-3xl font-semibold">Something on this page broke</h1>
        <p className="mt-3 text-muted-foreground">Reloading usually fixes it. If it keeps happening, go back to the home page and try a different route.</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={() => window.location.reload()} className="h-10 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">
            Reload the page
          </button>
          {/* A full page load on purpose: the React tree has crashed, so client navigation cannot be trusted. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="flex h-10 items-center rounded-full border px-5 text-sm font-medium">
            Go to the home page
          </a>
        </div>
      </main>
    );
  }
}
