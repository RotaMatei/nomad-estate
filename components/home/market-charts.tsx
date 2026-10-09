'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import { formatPrice, formatYield } from '@/lib/properties/format';
import type { Country, Pin } from '@/lib/properties/types';

/** One series per chart, so each takes one colour and its title names it: no legend needed. */
const yieldConfig = { yield: { label: 'Average gross yield', color: 'var(--chart-1)' } } satisfies ChartConfig;
const priceConfig = { count: { label: 'Listings', color: 'var(--chart-3)' } } satisfies ChartConfig;
const scatterConfig = { listing: { label: 'Listing', color: 'var(--chart-2)' } } satisfies ChartConfig;

const PRICE_BANDS: [number, number, string][] = [
  [0, 100_000, 'Under $100K'],
  [100_000, 200_000, '$100K to $200K'],
  [200_000, 350_000, '$200K to $350K'],
  [350_000, 500_000, '$350K to $500K'],
  [500_000, 1_000_000, '$500K to $1M'],
  [1_000_000, Infinity, 'Over $1M'],
];

function Tip({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-float">
      <p className="font-medium">{title}</p>
      {rows.map(([k, v]) => (
        <p key={k} className="mt-0.5 flex justify-between gap-4 text-muted-foreground">
          {k}
          <span className="tabular font-medium text-foreground">{v}</span>
        </p>
      ))}
    </div>
  );
}

function Figure({ title, note, table, children }: { title: string; note: string; table: { head: [string, string]; rows: [string, string][] }; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col rounded-2xl border bg-card p-5 sm:p-6">
      <figcaption>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{note}</p>
      </figcaption>
      <div className="mt-5 flex-1">{children}</div>
      {/* the same numbers as a table, for screen readers and for anyone who would rather read than look */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Show as a table</summary>
        <table className="tabular mt-2 w-full text-left">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th className="py-1 font-normal">{table.head[0]}</th>
              <th className="py-1 text-right font-normal">{table.head[1]}</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map(([a, b]) => (
              <tr key={a} className="border-t">
                <td className="py-1">{a}</td>
                <td className="py-1 text-right">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

/** Three views of what is on the platform right now, drawn from the same listings the globe shows. */
export default function MarketCharts({ pins, countries }: { pins: Pin[]; countries: Country[] }) {
  const byCountry = React.useMemo(() => {
    const names = new Map(countries.map((c) => [c.id, c.name]));
    const groups = new Map<string, { sum: number; n: number }>();
    for (const p of pins) {
      const name = p.countryId != null ? names.get(p.countryId) : undefined;
      if (!name) continue;
      const g = groups.get(name) ?? { sum: 0, n: 0 };
      g.sum += p.yieldPct;
      g.n += 1;
      groups.set(name, g);
    }
    return [...groups].map(([name, g]) => ({ name, yield: Math.round((g.sum / g.n) * 10) / 10, listings: g.n })).sort((a, b) => b.yield - a.yield).slice(0, 8);
  }, [pins, countries]);

  const bands = React.useMemo(
    () => PRICE_BANDS.map(([min, max, label]) => ({ label, count: pins.filter((p) => p.price >= min && p.price < max).length })),
    [pins],
  );
  const dots = React.useMemo(() => pins.map((p) => ({ price: p.price, yield: p.yieldPct })), [pins]);
  const busiest = bands.reduce((a, b) => (b.count > a.count ? b : a), bands[0]);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Figure
        title="Average gross yield by country"
        note="The eight highest, in percent per year."
        table={{ head: ['Country', 'Average yield'], rows: byCountry.map((c) => [c.name, formatYield(c.yield)]) }}
      >
        <ChartContainer config={yieldConfig} className="aspect-auto h-[280px] w-full">
          <BarChart data={byCountry} layout="vertical" margin={{ left: 0, right: 44, top: 0, bottom: 0 }} barCategoryGap={6}>
            <CartesianGrid horizontal={false} strokeDasharray="2 4" />
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis type="category" dataKey="name" width={104} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <ChartTooltip
              cursor={{ fill: 'var(--muted)' }}
              content={({ active, payload }) =>
                active && payload?.[0] ? <Tip title={payload[0].payload.name} rows={[['Average yield', formatYield(payload[0].payload.yield)], ['Listings', String(payload[0].payload.listings)]]} /> : null
              }
            />
            <Bar dataKey="yield" fill="var(--color-yield)" radius={[0, 4, 4, 0]} maxBarSize={18}>
              <LabelList dataKey="yield" position="right" formatter={(v) => formatYield(Number(v))} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </Figure>

      <Figure
        title="Listings by asking price"
        note={`Most listings are ${busiest.label.replace(/^\$/, 'priced $').replace('Under', 'under').replace('Over', 'over')}.`}
        table={{ head: ['Price band', 'Listings'], rows: bands.map((b) => [b.label, String(b.count)]) }}
      >
        <ChartContainer config={priceConfig} className="aspect-auto h-[280px] w-full">
          <BarChart data={bands} margin={{ left: 0, right: 0, top: 18, bottom: 0 }} barCategoryGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.replace(/\$/g, '').replace(' to ', '–').replace('Under ', '<').replace('Over ', '>')} />
            <YAxis hide />
            <ChartTooltip cursor={{ fill: 'var(--muted)' }} content={({ active, payload }) => (active && payload?.[0] ? <Tip title={payload[0].payload.label} rows={[['Listings', String(payload[0].payload.count)]]} /> : null)} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={44}>
              {bands.map((b) => (
                // the busiest band is the point of the chart: the others step back
                <Cell key={b.label} fill="var(--color-count)" fillOpacity={b === busiest ? 1 : 0.45} />
              ))}
              <LabelList dataKey="count" position="top" className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </Figure>

      <Figure
        title="Price against yield"
        note="Each dot is a listing. Cheaper homes tend to yield more."
        table={{ head: ['Measure', 'Value'], rows: [['Listings', String(dots.length)], ['Lowest price', dots.length ? formatPrice(Math.min(...dots.map((d) => d.price))) : '–'], ['Highest yield', dots.length ? formatYield(Math.max(...dots.map((d) => d.yield))) : '–']] }}
      >
        <ChartContainer config={scatterConfig} className="aspect-auto h-[280px] w-full">
          <ScatterChart margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" />
            <XAxis type="number" dataKey="price" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatPrice(v, { compact: true })} domain={[0, 'dataMax']} />
            <YAxis type="number" dataKey="yield" width={34} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} domain={[0, 'dataMax']} />
            <ZAxis range={[60, 60]} />
            <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => (active && payload?.[0] ? <Tip title="Listing" rows={[['Price', formatPrice(payload[0].payload.price)], ['Gross yield', formatYield(payload[0].payload.yield)]]} /> : null)} />
            <Scatter data={dots} fill="var(--color-listing)" fillOpacity={0.75} stroke="var(--card)" strokeWidth={2} />
          </ScatterChart>
        </ChartContainer>
      </Figure>
    </div>
  );
}
