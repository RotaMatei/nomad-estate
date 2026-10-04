'use client';

import { X } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ListingFacts, ListingImage, ListingPlace, SaveButton, ScoreRing } from './listing-parts';
import { Button } from '@/components/ui/button';
import { formatCoords, formatPrice, formatYield } from '@/lib/properties/format';
import type { Listing } from '@/lib/properties/types';
import { cn } from '@/lib/utils';

/** Opens when a pin or a result is selected; the map flies to the same listing. */
export function PreviewCard({ listing, onClose, className }: { listing: Listing; onClose: () => void; className?: string }) {
  const coords = formatCoords(listing.lat, listing.lng);
  return (
    <motion.article
      key={listing.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      aria-label={`Selected property: ${listing.title}`}
      className={cn('glass shadow-float overflow-hidden rounded-xl', className)}
    >
      <div className="relative">
        <ListingImage listing={listing} sizes="(max-width: 1024px) 100vw, 360px" className="aspect-[16/9] w-full max-lg:aspect-[21/9]" priority />
        <Button
          variant="secondary"
          size="icon"
          onClick={onClose}
          aria-label="Close property preview"
          className="absolute top-2 right-2 size-8 rounded-full bg-background/85 backdrop-blur hover:bg-background"
        >
          <X className="size-4" aria-hidden />
        </Button>
        {coords && (
          <span className="tabular absolute bottom-2 left-2 rounded-full bg-background/85 px-2 py-0.5 text-[11px] backdrop-blur">{coords}</span>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h2 className="line-clamp-2 text-base leading-snug font-semibold">{listing.title}</h2>
          <ListingPlace listing={listing} className="mt-0.5 text-sm" />
        </div>

        <dl className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <dt className="text-xs text-muted-foreground">Price</dt>
            <dd className="tabular font-display truncate text-xl font-semibold">{formatPrice(listing.price)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Gross yield</dt>
            <dd className="tabular text-xl font-semibold text-positive">{formatYield(listing.yieldPct)}</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="sr-only">Investment score</dt>
            <dd>
              <ScoreRing score={listing.score} className="size-11" />
            </dd>
          </div>
        </dl>

        <ListingFacts listing={listing} className="text-sm" />

        <div className="flex gap-2 pt-1">
          <Button asChild className="flex-1 rounded-full">
            <Link href={`/details/${listing.id}`}>View property</Link>
          </Button>
          <SaveButton listing={listing} withLabel />
        </div>
      </div>
    </motion.article>
  );
}
