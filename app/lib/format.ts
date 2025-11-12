export function formatMoney(value: number | string | null | undefined, currencySymbol = ''): string {
  if (value === null || value === undefined) return 'N/A';
  const num = typeof value === 'number' ? value : Number(String(value).trim().replace(/[,\s]/g, ''));
  if (!isFinite(num)) return 'N/A';

  const hasFraction = Math.abs(num % 1) > 1e-6;
  if (!hasFraction) {
    const intGrouped = Math.trunc(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
    return currencySymbol ? `${currencySymbol}${intGrouped}` : intGrouped;
  }

  // Round to 2 decimals, then trim any trailing zeros
  const fixed = num.toFixed(2);
  const [intPart, decPartRaw] = fixed.split('.');
  const decPart = decPartRaw.replace(/0+$/,'');
  const groupedInt = Number(intPart).toLocaleString('en-US');
  const result = `${groupedInt}${decPart.length ? '.' + decPart : ''}`;
  return currencySymbol ? `${currencySymbol}${result}` : result;
}

export function formatEnumLabel(value: string | null | undefined): string {
  if (!value) return '';
  // Preserve known acronyms fully uppercased (ROI, EU, USA etc.)
  const ACRONYMS = new Set(['ROI','EU','USA']);
  const parts = String(value).trim().split('_').filter(Boolean);
  return parts
    .map(p => {
      const upper = p.toUpperCase();
      if (ACRONYMS.has(upper)) return upper; // preserve acronym
      // Special handling: singular words that should remain all-caps
      if (upper === 'ROI') return 'ROI';
      // Default: Capitalize first letter only
      return upper[0] + upper.slice(1).toLowerCase();
    })
    .join(' ');
}
