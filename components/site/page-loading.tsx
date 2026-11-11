import { House3D } from './house-3d';

/** Shown while a page's data is on its way: a little house hopping on the spot, with what is loading said in words. */
export function PageLoading({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <House3D />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
