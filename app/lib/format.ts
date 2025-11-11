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
  const str = String(value).trim().replace(/_/g, ' ').toLowerCase();
  return str.length ? str[0].toUpperCase() + str.slice(1) : '';
}
