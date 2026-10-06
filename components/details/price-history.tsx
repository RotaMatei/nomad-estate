'use client';

import * as React from 'react';
import { formatPrice } from '@/lib/properties/format';
import { usePriceHistory, type PricePoint } from '@/lib/properties/details';

const W = 320;
const H = 64;
const PAD = { top: 10, right: 8, bottom: 10, left: 4 };

const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Only the moments the asking price itself changed: a status change at the same price is not a point on the line. */
function priceChanges(points: PricePoint[]) {
  const out: { at: number; price: number }[] = [];
  for (const p of points) {
    const at = new Date(p.changedAt).getTime();
    if (!Number.isFinite(at) || !Number.isFinite(p.price)) continue;
    if (out.length === 0 || out[out.length - 1].price !== p.price) out.push({ at, price: p.price });
  }
  return out;
}

/**
 * The asking price over time, as a small step line under the price: it appears once the price has changed at least
 * once. Prices move in steps, so the line does too. The sentence under it and the list for screen readers carry
 * everything the line shows.
 */
export function PriceHistory({ propertyId }: { propertyId: string }) {
  // the line runs up to the moment the history was fetched
  const { data, dataUpdatedAt: now } = usePriceHistory(propertyId);
  const changes = React.useMemo(() => priceChanges(data?.points ?? []), [data]);
  const [active, setActive] = React.useState<number | null>(null);
  if (changes.length < 2) return null;

  const first = changes[0];
  const last = changes[changes.length - 1];
  const end = Math.max(now, last.at + 1);
  const prices = changes.map((c) => c.price);
  const [min, max] = [Math.min(...prices), Math.max(...prices)];
  const x = (t: number) =>
    PAD.left + ((t - first.at) / (end - first.at)) * (W - PAD.left - PAD.right);
  const y = (p: number) =>
    max === min ? H / 2 : PAD.top + (1 - (p - min) / (max - min)) * (H - PAD.top - PAD.bottom);

  let path = `M${x(first.at).toFixed(1)},${y(first.price).toFixed(1)}`;
  for (let i = 1; i < changes.length; i++)
    path += ` H${x(changes[i].at).toFixed(1)} V${y(changes[i].price).toFixed(1)}`;
  path += ` H${x(end).toFixed(1)}`;

  const delta = ((last.price - first.price) / first.price) * 100;
  const direction = delta < 0 ? 'lower' : 'higher';
  const shown = active != null ? changes[active] : null;
  // each price holds from its own date to the next change: that stretch is its hover area
  const spans = changes.map((c, i) => ({
    from: x(c.at),
    to: x(i + 1 < changes.length ? changes[i + 1].at : end),
  }));

  return (
    <div className="mt-2">
      {/* the strip above the line is kept free for the hover label, so it never covers the price */}
      <div className="relative pt-6">
        <div className="relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-16 w-full"
            preserveAspectRatio="none"
            aria-hidden
            onPointerLeave={() => setActive(null)}
          >
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="text-muted-foreground"
            />
            {spans.map((s, i) => (
              <rect
                key={i}
                x={s.from}
                y={0}
                width={Math.max(s.to - s.from, 1)}
                height={H}
                fill="transparent"
                onPointerEnter={() => setActive(i)}
                onPointerDown={() => setActive(i)}
              />
            ))}
          </svg>
          {/* markers are HTML so they stay round while the line stretches to the width of the panel */}
          {[shown ?? last].map((c) => (
            <span
              key={c.at}
              aria-hidden
              className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-beacon ring-2 ring-card"
              style={{
                left: `${(x(shown ? c.at : end) / W) * 100}%`,
                top: `${(y(c.price) / H) * 100}%`,
              }}
            />
          ))}
        </div>
        {shown && (
          <p
            aria-hidden
            className="pointer-events-none absolute top-0 z-10 rounded-md border bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground shadow-sm"
            style={
              x(shown.at) > W * 0.6
                ? { right: `${100 - (x(shown.at) / W) * 100}%` }
                : { left: `${(x(shown.at) / W) * 100}%` }
            }
          >
            <span className="tabular font-medium">{formatPrice(shown.price)}</span>{' '}
            <span className="text-muted-foreground">from {day.format(shown.at)}</span>
          </p>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Listed at <span className="tabular">{formatPrice(first.price)}</span> on{' '}
        {day.format(first.at)}. <span className="tabular">{formatPrice(last.price)}</span> since{' '}
        {day.format(last.at)}
        {Math.abs(delta) >= 0.05 ? `, ${Math.abs(delta).toFixed(1)}% ${direction}` : ''}.
      </p>
      <ol className="sr-only" aria-label="Price history">
        {changes.map((c) => (
          <li key={c.at}>
            {formatPrice(c.price)} from {day.format(c.at)}
          </li>
        ))}
      </ol>
    </div>
  );
}
