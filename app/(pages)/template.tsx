'use client';

import * as React from 'react';

// False for the first page of a visit (it must paint at once, and the loading screen covers it anyway),
// true for every page reached from it.
let navigated = false;

/** Eases each page in when it is reached by a link. A template, unlike a layout, mounts again on every navigation. */
export default function PageTemplate({ children }: { children: React.ReactNode }) {
  const [enter] = React.useState(() => navigated);
  React.useEffect(() => {
    navigated = true;
  }, []);
  return <div className={enter ? 'page-enter' : undefined}>{children}</div>;
}
