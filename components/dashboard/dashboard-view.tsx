'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Building2, MoreHorizontal, Plus, Search, Trash2, UserPlus, WifiOff } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { ListingImage, ListingPlace, ScoreRing } from '@/components/properties/listing-parts';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from '@/hooks/use-session';
import { useAgents, useDeleteProperty, usePortfolio, useUserSearch } from '@/lib/dashboard/queries';
import { formatPrice, formatYield } from '@/lib/properties/format';
import { PROPERTY_TYPE_LABEL } from '@/lib/properties/labels';
import type { Listing } from '@/lib/properties/types';

export function DashboardView() {
  const { session } = useSession();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[70vh] w-full max-w-[1200px] px-5 pt-8 pb-20 sm:px-8">
        {!session ? (
          <Gate title="Sign in to open the dashboard" body="The dashboard belongs to an agency account." href="/login" action="Sign in" />
        ) : !session.isAgency ? (
          <Gate title="The dashboard is for agencies" body="You are signed in as an investor. Your saved properties are on your profile." href="/user" action="Open my profile" />
        ) : (
          <AgencyDashboard agencyId={session.id} name={session.name} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function Gate({ title, body, href, action }: { title: string; body: string; href: string; action: string }) {
  return (
    <Empty className="py-24">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Building2 />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{body}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href={href}>{action}</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function AgencyDashboard({ agencyId, name }: { agencyId: string; name: string | null }) {
  const { listings, isLoading, isError, refetch } = usePortfolio(agencyId);

  return (
    <div className="min-w-0 space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Dashboard</h1>
          {name && <p className="mt-1 text-muted-foreground">{name}</p>}
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard/properties/new">
            <Plus aria-hidden /> Add property
          </Link>
        </Button>
      </header>

      {isError ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WifiOff />
            </EmptyMedia>
            <EmptyTitle>Your listings did not load</EmptyTitle>
            <EmptyDescription>The server did not answer. Check your connection and load them again.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => void refetch()}>Load listings again</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <Kpis listings={listings} loading={isLoading} />
          {listings.length > 0 && <Charts listings={listings} />}
          <ListingsTable agencyId={agencyId} listings={listings} loading={isLoading} />
        </>
      )}
      <AgentsManager agencyId={agencyId} />
    </div>
  );
}

// ── KPI tiles ─────────────────────────────────────────────────────────────────
function Kpis({ listings, loading }: { listings: Listing[]; loading: boolean }) {
  const n = listings.length;
  const total = listings.reduce((s, l) => s + l.price, 0);
  const tiles: [string, string][] = [
    ['Listings', String(n)],
    ['Portfolio value', formatPrice(total, { compact: true })],
    ['Average yield', n ? formatYield(listings.reduce((s, l) => s + l.yieldPct, 0) / n) : 'No data'],
    ['Average score', n ? String(Math.round(listings.reduce((s, l) => s + l.score, 0) / n)) : 'No data'],
  ];
  return (
    <section aria-label="Portfolio summary">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4">
        {tiles.map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse bg-card p-5 sm:p-6">
            <dt className="mt-1 text-sm text-muted-foreground">{label}</dt>
            <dd className="font-display tabular text-2xl font-semibold sm:text-3xl">{loading ? <Skeleton className="h-8 w-24" /> : value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ── charts ────────────────────────────────────────────────────────────────────
const yieldConfig = { yieldPct: { label: 'Gross yield', color: 'var(--chart-1)' } } satisfies ChartConfig;
const countryConfig = { count: { label: 'Listings', color: 'var(--chart-2)' } } satisfies ChartConfig;

function Charts({ listings }: { listings: Listing[] }) {
  const byYield = React.useMemo(
    () =>
      [...listings]
        .sort((a, b) => b.yieldPct - a.yieldPct)
        .slice(0, 8)
        .map((l) => ({ name: l.cityName ?? l.title.slice(0, 14), title: l.title, yieldPct: Number(l.yieldPct.toFixed(2)) })),
    [listings],
  );
  const byCountry = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const l of listings) m.set(l.countryName ?? 'Unknown', (m.get(l.countryName ?? 'Unknown') ?? 0) + 1);
    return [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [listings]);

  return (
    <section aria-label="Portfolio charts" className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <figure className="min-w-0 rounded-xl border bg-card p-5 sm:p-6">
        <figcaption>
          <h2 className="font-semibold">Highest-yield listings</h2>
          <p className="text-sm text-muted-foreground">Gross yield, percent per year</p>
        </figcaption>
        <ChartContainer config={yieldConfig} className="mt-4 h-64 w-full">
          <BarChart data={byYield} margin={{ left: -16, right: 4 }} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} interval={0} tickFormatter={(v: string) => (v.length > 9 ? `${v.slice(0, 8)}…` : v)} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}%`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(_, p) => p?.[0]?.payload?.title} />} />
            <Bar dataKey="yieldPct" fill="var(--color-yieldPct)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </figure>
      <figure className="min-w-0 rounded-xl border bg-card p-5 sm:p-6">
        <figcaption>
          <h2 className="font-semibold">Listings by country</h2>
          <p className="text-sm text-muted-foreground">Where your portfolio is</p>
        </figcaption>
        <ChartContainer config={countryConfig} className="mt-4 h-64 w-full">
          <BarChart data={byCountry} layout="vertical" margin={{ left: 8, right: 12 }} accessibilityLayer>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" width={104} interval={0} tickLine={false} axisLine={false} tickFormatter={(v: string) => (v.length > 13 ? `${v.slice(0, 12)}…` : v)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ChartContainer>
      </figure>
    </section>
  );
}

// ── listings table ────────────────────────────────────────────────────────────
function SortHeader({ label, sorted, onClick, align }: { label: string; sorted: false | 'asc' | 'desc'; onClick: () => void; align?: 'right' }) {
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown;
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center gap-1.5 hover:text-foreground ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      {label}
      <Icon className="size-3.5" aria-hidden />
      <span className="sr-only">{sorted ? `sorted ${sorted === 'asc' ? 'ascending' : 'descending'}` : 'not sorted'}</span>
    </button>
  );
}

function ListingsTable({ agencyId, listings, loading }: { agencyId: string; listings: Listing[]; loading: boolean }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filter, setFilter] = React.useState('');
  const [toDelete, setToDelete] = React.useState<Listing | null>(null);
  const remove = useDeleteProperty(agencyId);

  const columns = React.useMemo<ColumnDef<Listing>[]>(
    () => [
      {
        id: 'title',
        accessorFn: (l) => `${l.title} ${l.cityName ?? ''} ${l.countryName ?? ''}`,
        header: ({ column }) => <SortHeader label="Property" sorted={column.getIsSorted()} onClick={() => column.toggleSorting()} />,
        cell: ({ row: { original: l } }) => (
          <Link href={`/details/${l.id}`} className="group flex min-w-56 items-center gap-3">
            <ListingImage listing={l} sizes="48px" className="size-12 shrink-0 rounded-md" />
            <span className="min-w-0">
              <span className="block max-w-72 truncate font-medium group-hover:underline">{l.title}</span>
              <ListingPlace listing={l} className="text-xs" />
            </span>
          </Link>
        ),
      },
      { id: 'type', accessorFn: (l) => (l.type ? PROPERTY_TYPE_LABEL[l.type] : ''), header: 'Type', enableSorting: false },
      {
        accessorKey: 'price',
        header: ({ column }) => <SortHeader align="right" label="Price" sorted={column.getIsSorted()} onClick={() => column.toggleSorting()} />,
        cell: ({ getValue }) => formatPrice(getValue<number>()),
        meta: { numeric: true },
      },
      {
        accessorKey: 'yieldPct',
        header: ({ column }) => <SortHeader align="right" label="Yield" sorted={column.getIsSorted()} onClick={() => column.toggleSorting()} />,
        cell: ({ getValue }) => <span className="text-positive">{formatYield(getValue<number>())}</span>,
        meta: { numeric: true },
      },
      {
        accessorKey: 'score',
        header: ({ column }) => <SortHeader align="right" label="Score" sorted={column.getIsSorted()} onClick={() => column.toggleSorting()} />,
        cell: ({ getValue }) => <ScoreRing score={getValue<number>()} className="ml-auto size-9" />,
        meta: { numeric: true },
      },
      {
        id: 'actions',
        enableSorting: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row: { original: l } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 rounded-full" aria-label={`Actions for ${l.title}`}>
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/details/${l.id}`}>View listing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/properties/${l.id}/edit`}>Edit property</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setToDelete(l)}>
                <Trash2 aria-hidden /> Delete property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages its own state
  const table = useReactTable({
    data: listings,
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });
  const rows = table.getRowModel().rows;

  return (
    <section aria-labelledby="listings-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="listings-title" className="text-xl font-semibold">
          Your listings
        </h2>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Find a listing" aria-label="Find a listing by title or place" className="rounded-full pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="mt-4 space-y-2" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <Empty className="mt-4 rounded-xl border py-16">
          <EmptyHeader>
            <EmptyTitle>No listings yet</EmptyTitle>
            <EmptyDescription>Add your first property and it appears on the globe for every investor.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/dashboard/properties/new">Add property</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className="mt-4 overflow-hidden rounded-xl border bg-card">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((group) => (
                  <TableRow key={group.id}>
                    {group.headers.map((h) => (
                      <TableHead key={h.id} className={(h.column.columnDef.meta as { numeric?: boolean } | undefined)?.numeric ? 'text-right' : undefined} aria-sort={h.column.getIsSorted() === 'asc' ? 'ascending' : h.column.getIsSorted() === 'desc' ? 'descending' : undefined}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      No listing matches “{filter}”.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className={(cell.column.columnDef.meta as { numeric?: boolean } | undefined)?.numeric ? 'tabular text-right' : undefined}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {table.getPageCount() > 1 && (
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span className="tabular">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  Previous page
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Next page
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this property?</AlertDialogTitle>
            <AlertDialogDescription>
              “{toDelete?.title}” is removed from the globe and from investors’ saved lists. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep property</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!toDelete) return;
                const title = toDelete.title;
                remove.mutate(toDelete.id, {
                  onSuccess: () => toast.success(`Deleted “${title}”`),
                  onError: () => toast.error('The property was not deleted. Try again in a moment.'),
                });
              }}
            >
              Delete property
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

// ── agents ────────────────────────────────────────────────────────────────────
const personName = (p: { firstName?: string | null; lastName?: string | null; email?: string | null }) =>
  [p.firstName, p.lastName].filter(Boolean).join(' ') || p.email || 'Unnamed user';

function AgentsManager({ agencyId }: { agencyId: string }) {
  const { agents, isLoading, add, remove } = useAgents(agencyId);
  const [term, setTerm] = React.useState('');
  const search = useUserSearch(term);
  const existing = new Set(agents.map((a) => a.userId));
  const candidates = (search.data ?? []).filter((u) => !existing.has(u.id)).slice(0, 6);

  return (
    <section aria-labelledby="agents-title" className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="min-w-0">
        <h2 id="agents-title" className="text-xl font-semibold">
          Agents
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Agents are the contact people on your listings and receive the inquiries.</p>
        {isLoading ? (
          <Skeleton className="mt-4 h-24 w-full rounded-xl" />
        ) : agents.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">No agents yet. Find a registered user on the right and add them.</p>
        ) : (
          <ul className="mt-4 divide-y rounded-xl border bg-card">
            {agents.map((a) => (
              <li key={a.id} className="flex items-center gap-3 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                  {personName(a.user ?? {}).slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{personName(a.user ?? {})}</span>
                  <span className="block truncate text-sm text-muted-foreground">{[a.user?.email, a.user?.phoneNumber].filter(Boolean).join(', ')}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground hover:text-destructive"
                  disabled={remove.isPending}
                  onClick={() =>
                    remove.mutate(a.userId, {
                      onSuccess: () => toast.success('Agent removed'),
                      onError: () => toast.error('The agent was not removed. Try again in a moment.'),
                    })
                  }
                >
                  Remove agent
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border bg-card p-5">
        <label htmlFor="agent-search" className="text-sm font-medium">
          Add an agent
        </label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input id="agent-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Name of a registered user" className="pl-9" />
        </div>
        <div aria-live="polite" className="mt-3">
          {term.trim().length < 2 ? (
            <p className="text-sm text-muted-foreground">Type at least two letters of their name.</p>
          ) : search.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : candidates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No user with that name. They need a Nomad Estate account first.</p>
          ) : (
            <ul className="space-y-1">
              {candidates.map((u) => (
                <li key={u.id} className="flex items-center gap-2">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{u.fullName || personName(u)}</span>
                    {u.email && <span className="block truncate text-xs text-muted-foreground">{u.email}</span>}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    disabled={add.isPending}
                    onClick={() =>
                      add.mutate(u.id, {
                        onSuccess: () => {
                          toast.success('Agent added');
                          setTerm('');
                        },
                        onError: () => toast.error('The agent was not added. Try again in a moment.'),
                      })
                    }
                  >
                    <UserPlus aria-hidden /> Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
