// Slims scripts/data/earth-countries.json (Natural Earth, ~1.5 MB of attributes) down to what the globe needs:
// geometry + ISO code + name, coordinates rounded to 3 decimals.  →  public/map/countries.json
//   node scripts/build-countries.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const src = JSON.parse(await readFile(new URL('./data/earth-countries.json', import.meta.url), 'utf8'));
const round = (c) => (typeof c[0] === 'number' ? [Math.round(c[0] * 1000) / 1000, Math.round(c[1] * 1000) / 1000] : c.map(round));
const valid = (v) => typeof v === 'string' && /^[A-Z]{2}$/.test(v);

const features = src.features.map((f) => {
  const p = f.properties;
  const code = [p.ISO_A2, p.ISO_A2_EH, p.WB_A2].find(valid) ?? '';
  return { type: 'Feature', properties: { code, name: p.NAME }, geometry: { type: f.geometry.type, coordinates: round(f.geometry.coordinates) } };
});

await mkdir(new URL('../public/map/', import.meta.url), { recursive: true });
const out = JSON.stringify({ type: 'FeatureCollection', features });
await writeFile(new URL('../public/map/countries.json', import.meta.url), out);
console.log(`${features.length} countries, ${(out.length / 1024).toFixed(0)} kB, ${features.filter((f) => !f.properties.code).map((f) => f.properties.name).join(', ') || 'none'} without a code`);
