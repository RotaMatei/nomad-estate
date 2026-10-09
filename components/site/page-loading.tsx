import { LogoMark } from './logo';

/** Shown while a page's data is on its way: the mark drawing itself, with what is loading said in words. */
export function PageLoading({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <LogoMark animated className="h-14" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
