// Hosts whose photos go through the Next.js image optimiser (resized, WebP/AVIF). Shared by next.config.ts and the
// components, so a host is added in one place. Photos from any other host are shown as they are.
export const OPTIMISED_IMAGE_HOSTS = [
  'i.ibb.co', // ImgBB: where the agency property form uploads
  'picsum.photos', // placeholder photos in the development seed
  'fastly.picsum.photos',
];

/** True when `src` is an https URL on one of the hosts above. */
export function canOptimise(src) {
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && OPTIMISED_IMAGE_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}
