'use client';

import Link from 'next/link';
import * as React from 'react';
import { useWhenQuiet } from '@/hooks/use-when-quiet';

/**
 * A `next/link` that holds back route prefetching until the page is quiet. A screen full of links otherwise starts a
 * dozen downloads the moment it hydrates, competing with the page's own scripts on a slow phone. Once the visitor
 * interacts, or the page has settled, the links prefetch as usual.
 */
export function QuietLink({ prefetch, ...props }: React.ComponentProps<typeof Link>) {
  const quiet = useWhenQuiet();
  return <Link prefetch={quiet ? prefetch : false} {...props} />;
}
