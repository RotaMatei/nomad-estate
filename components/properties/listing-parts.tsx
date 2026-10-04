'use client';

import { Bath, BedDouble, Heart, ImageOff, Ruler } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { flagEmoji } from '@/lib/properties/filters';
import { formatArea } from '@/lib/properties/format';
import { useSavedProperties } from '@/lib/properties/saved';
import type { Listing } from '@/lib/properties/types';
import { cn } from '@/lib/utils';

/** Listing photos come from the API as data URIs or arbitrary hosts, so the optimiser is bypassed for now (PROGRESS B2). */
export function ListingImage({ listing, sizes, className, priority }: { listing: Listing; sizes: string; className?: string; priority?: boolean }) {
  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {listing.image ? (
        <Image src={listing.image} alt="" fill sizes={sizes} unoptimized priority={priority} className="object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <ImageOff className="size-5" aria-hidden />
          <span className="sr-only">No photo yet</span>
        </div>
      )}
    </div>
  );
}

export function ListingPlace({ listing, className }: { listing: Listing; className?: string }) {
  const place = [listing.cityName, listing.countryName].filter(Boolean).join(', ');
  if (!place) return null;
  return (
    <p className={cn('truncate text-muted-foreground', className)}>
      <span aria-hidden className="mr-1">
        {flagEmoji(listing.countryCode)}
      </span>
      {place}
    </p>
  );
}

export function ListingFacts({ listing, className }: { listing: Listing; className?: string }) {
  return (
    <ul className={cn('tabular flex items-center gap-3 text-muted-foreground', className)}>
      <li className="flex items-center gap-1">
        <BedDouble className="size-3.5" aria-hidden />
        {listing.bedrooms === 0 ? 'Studio' : listing.bedrooms}
        <span className="sr-only">{listing.bedrooms === 0 ? '' : 'bedrooms'}</span>
      </li>
      <li className="flex items-center gap-1">
        <Bath className="size-3.5" aria-hidden />
        {listing.bathrooms}
        <span className="sr-only">bathrooms</span>
      </li>
      <li className="flex items-center gap-1">
        <Ruler className="size-3.5" aria-hidden />
        {formatArea(listing.area)}
      </li>
    </ul>
  );
}

/** Score out of 100 as a small ring: readable at a glance, comparable down a list. */
export function ScoreRing({ score, className }: { score: number; className?: string }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <span className={cn('relative inline-flex size-10 shrink-0 items-center justify-center', className)} title="Investment score out of 100">
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="18" cy="18" r={r} fill="none" strokeWidth="3" className="stroke-border" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(100, score)) / 100)}
          className="stroke-beacon"
        />
      </svg>
      <span className="tabular text-xs font-semibold">{score}</span>
      <span className="sr-only">investment score out of 100</span>
    </span>
  );
}

export function SaveButton({ listing, className, withLabel }: { listing: Listing; className?: string; withLabel?: boolean }) {
  const { canSave, isAgency, savedIds, toggle } = useSavedProperties();
  const saved = savedIds.includes(listing.id);
  const router = useRouter();

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAgency) return void toast.info('Saving is for investor accounts. Sign in as an investor to keep a shortlist.');
    if (!canSave) return void toast.info('Sign in to save properties', { action: { label: 'Sign in', onClick: () => router.push('/login') } });
    try {
      await toggle({ id: listing.id, save: !saved });
      toast.success(saved ? 'Removed from saved properties' : 'Saved to your properties');
    } catch (err) {
      toast.error(err instanceof Error ? `${err.message}. Try again.` : 'Something went wrong. Try again.');
    }
  };

  return (
    <Button
      type="button"
      variant={withLabel ? 'outline' : 'ghost'}
      size={withLabel ? 'default' : 'icon'}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : saved ? `Remove ${listing.title} from saved properties` : `Save ${listing.title}`}
      onClick={onClick}
      className={cn('rounded-full', className)}
    >
      <Heart className={cn('size-4', saved && 'fill-destructive text-destructive')} aria-hidden />
      {withLabel && (saved ? 'Saved' : 'Save property')}
    </Button>
  );
}
