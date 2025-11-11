/**
 * Image utility functions for converting various image data formats to displayable URLs
 */

/**
 * Convert Uint8Array (or number[]) to base64 string
 */
export function uint8ArrayToBase64(data: number[]): string {
  const bytes = new Uint8Array(data);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

/**
 * Infer MIME type from the first few bytes (magic numbers)
 */
export function inferMimeFromBytes(data: number[] | Uint8Array | undefined): string {
  if (!data || (Array.isArray(data) && data.length < 4)) return 'image/jpeg';
  const bytes = Array.isArray(data) ? new Uint8Array(data) : data;
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return 'image/png';
  // GIF: 47 49 46 38 ("GIF8")
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'image/gif';
  // WEBP: RIFF....WEBP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Convert binary data to an object URL (Blob)
 */
export function toObjectUrl(imageData?: unknown, mime?: string): string | undefined {
  if (!imageData) return undefined;
  try {
    if (Array.isArray(imageData)) {
      const u8 = new Uint8Array(imageData);
      const type = mime || inferMimeFromBytes(u8);
      const blob = new Blob([u8], { type });
      return URL.createObjectURL(blob);
    }
    if (typeof imageData === 'object' && imageData !== null && Array.isArray((imageData as { data?: unknown }).data)) {
      const u8 = new Uint8Array((imageData as { data: number[] }).data);
      const type = mime || inferMimeFromBytes(u8);
      const blob = new Blob([u8], { type });
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.warn('[imageUtils] toObjectUrl failed:', e);
  }
  return undefined;
}

/**
 * Convert any imageData format (number[], string, Buffer-like object) to displayable image URL
 * @param imageData - Image data in various formats (number[], base64 string, Buffer-like object, or data URL)
 * @param mime - MIME type for data URL construction (default: 'image/jpeg')
 * @returns Data URL string or undefined if conversion fails
 */
export function toImageSrc(imageData?: unknown, mime = 'image/jpeg'): string | undefined {
  if (!imageData) {
    console.log('[imageUtils] toImageSrc: imageData is falsy');
    return undefined;
  }

  console.log('[imageUtils] toImageSrc received:', {
    type: typeof imageData,
    isArray: Array.isArray(imageData),
    isObject: typeof imageData === 'object',
    length: Array.isArray(imageData) ? imageData.length : undefined,
    sample: Array.isArray(imageData) ? (imageData as number[]).slice(0, 5) : undefined,
  });

  // Already a data URL string or direct URL
  if (typeof imageData === 'string') {
    const trimmed = imageData.trim();
    if (!trimmed) {
      console.log('[imageUtils] String imageData is empty after trim');
      return undefined;
    }
    
    // Already a data URL or external URL
    if (trimmed.startsWith('data:image')) {
      console.log('[imageUtils] String is already a data URL, returning as-is');
      return trimmed;
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      console.log('[imageUtils] String is external URL, returning as-is');
      return trimmed;
    }
    if (trimmed.startsWith('/') || trimmed.startsWith('.')) {
      console.log('[imageUtils] String is relative URL, returning as-is');
      return trimmed;
    }
    
    // Assume it's base64 if nothing else matches
    console.log('[imageUtils] Treating string as base64, wrapping with data URL prefix');
    return `data:${mime};base64,${trimmed}`;
  }

  // number[] (Uint8Array from backend)
  if (Array.isArray(imageData)) {
    try {
      const inferred = inferMimeFromBytes(imageData as number[]);
      const chosenMime = mime || inferred;
      console.log(`[imageUtils] Converting number[] (${imageData.length} bytes) to base64; mime=${chosenMime}`);
      const base64 = uint8ArrayToBase64(imageData as number[]);
      console.log(`[imageUtils] Base64 conversion successful, result length: ${base64.length}`);
      const result = `data:${chosenMime};base64,${base64}`;
      console.log(`[imageUtils] Final data URL length: ${result.length}`);
      return result;
    } catch (e) {
      console.error('[imageUtils] Failed to convert array to base64:', e);
      return undefined;
    }
  }

  // Buffer-like object { data: number[] }
  if (typeof imageData === 'object' && imageData !== null) {
    const bufferLike = imageData as { data?: unknown };
    if (Array.isArray(bufferLike.data)) {
      try {
        const inferred = inferMimeFromBytes(bufferLike.data as number[]);
        const chosenMime = mime || inferred;
        console.log(`[imageUtils] Converting buffer-like object with ${(bufferLike.data as number[]).length} bytes to base64; mime=${chosenMime}`);
        const base64 = uint8ArrayToBase64(bufferLike.data as number[]);
        console.log(`[imageUtils] Base64 conversion successful, result length: ${base64.length}`);
        const result = `data:${chosenMime};base64,${base64}`;
        console.log(`[imageUtils] Final data URL length: ${result.length}`);
        return result;
      } catch (e) {
        console.error('[imageUtils] Failed to convert buffer object to base64:', e);
        return undefined;
      }
    }
  }

  console.log('[imageUtils] toImageSrc: no matching format found for imageData');
  return undefined;
}
