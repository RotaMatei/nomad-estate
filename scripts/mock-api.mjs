// Fixture API for local UI work and screenshots.
//   npm run mock-api            → http://localhost:4010/api
//   NEXT_PUBLIC_API_URL=http://localhost:4010 npm run dev
// Mirrors the Nest routes the frontend reads. Data is deterministic (seeded), nothing is persisted.
import http from 'node:http';

const PORT = Number(process.env.MOCK_API_PORT || 4010);

// name, ISO2, currency, symbol, cities: [name, lat, lng, base price per m² (USD), base yield %]
const MARKETS = [
  ['Romania', 'RO', 'RON', 'lei', [['Bucharest', 44.4268, 26.1025, 2100, 6.4], ['Cluj-Napoca', 46.7712, 23.6236, 2600, 5.6], ['Brașov', 45.6427, 25.5887, 2000, 6.1]]],
  ['Portugal', 'PT', 'EUR', '€', [['Lisbon', 38.7223, -9.1393, 5400, 4.6], ['Porto', 41.1579, -8.6291, 3600, 5.4], ['Faro', 37.0194, -7.9304, 3300, 5.9]]],
  ['Spain', 'ES', 'EUR', '€', [['Madrid', 40.4168, -3.7038, 4900, 4.8], ['Valencia', 39.4699, -0.3763, 2900, 6.0], ['Málaga', 36.7213, -4.4214, 3700, 5.7]]],
  ['Italy', 'IT', 'EUR', '€', [['Milan', 45.4642, 9.19, 5600, 4.2], ['Palermo', 38.1157, 13.3615, 1500, 6.8]]],
  ['Greece', 'GR', 'EUR', '€', [['Athens', 37.9838, 23.7275, 2700, 5.9], ['Thessaloniki', 40.6401, 22.9444, 2100, 6.2]]],
  ['France', 'FR', 'EUR', '€', [['Paris', 48.8566, 2.3522, 10800, 3.1], ['Marseille', 43.2965, 5.3698, 3900, 5.0]]],
  ['Germany', 'DE', 'EUR', '€', [['Berlin', 52.52, 13.405, 5700, 3.4], ['Leipzig', 51.3397, 12.3731, 3100, 4.4]]],
  ['United Kingdom', 'GB', 'GBP', '£', [['London', 51.5072, -0.1276, 11200, 3.6], ['Manchester', 53.4808, -2.2426, 4300, 6.1]]],
  ['Ireland', 'IE', 'EUR', '€', [['Dublin', 53.3498, -6.2603, 6100, 5.2]]],
  ['Netherlands', 'NL', 'EUR', '€', [['Amsterdam', 52.3676, 4.9041, 8200, 3.8]]],
  ['Poland', 'PL', 'PLN', 'zł', [['Warsaw', 52.2297, 21.0122, 3900, 5.3], ['Kraków', 50.0647, 19.945, 3700, 5.5]]],
  ['Hungary', 'HU', 'HUF', 'Ft', [['Budapest', 47.4979, 19.0402, 3300, 5.0]]],
  ['Bulgaria', 'BG', 'BGN', 'лв', [['Sofia', 42.6977, 23.3219, 2200, 5.4], ['Varna', 43.2141, 27.9147, 1700, 6.0]]],
  ['Croatia', 'HR', 'EUR', '€', [['Split', 43.5081, 16.4402, 4300, 4.9]]],
  ['Turkey', 'TR', 'TRY', '₺', [['Istanbul', 41.0082, 28.9784, 1900, 7.1], ['Antalya', 36.8969, 30.7133, 1500, 7.6]]],
  ['Georgia', 'GE', 'GEL', '₾', [['Tbilisi', 41.7151, 44.8271, 1300, 8.4], ['Batumi', 41.6168, 41.6367, 1200, 9.1]]],
  ['United Arab Emirates', 'AE', 'AED', 'د.إ', [['Dubai', 25.2048, 55.2708, 4700, 6.9], ['Abu Dhabi', 24.4539, 54.3773, 3800, 6.5]]],
  ['Thailand', 'TH', 'THB', '฿', [['Bangkok', 13.7563, 100.5018, 3400, 5.2], ['Phuket', 7.8804, 98.3923, 3000, 6.6]]],
  ['Indonesia', 'ID', 'IDR', 'Rp', [['Canggu', -8.6478, 115.1385, 2600, 9.4], ['Jakarta', -6.2088, 106.8456, 2100, 6.3]]],
  ['Vietnam', 'VN', 'VND', '₫', [['Ho Chi Minh City', 10.8231, 106.6297, 2800, 4.7], ['Da Nang', 16.0544, 108.2022, 1900, 5.8]]],
  ['Malaysia', 'MY', 'MYR', 'RM', [['Kuala Lumpur', 3.139, 101.6869, 2300, 5.1]]],
  ['Philippines', 'PH', 'PHP', '₱', [['Manila', 14.5995, 120.9842, 2700, 6.0], ['Cebu City', 10.3157, 123.8854, 1900, 6.7]]],
  ['Japan', 'JP', 'JPY', '¥', [['Tokyo', 35.6762, 139.6503, 8600, 3.7], ['Osaka', 34.6937, 135.5023, 5200, 4.6]]],
  ['Australia', 'AU', 'AUD', 'A$', [['Sydney', -33.8688, 151.2093, 9400, 3.2], ['Brisbane', -27.4698, 153.0251, 5600, 4.3]]],
  ['New Zealand', 'NZ', 'NZD', 'NZ$', [['Auckland', -36.8509, 174.7645, 6200, 3.6]]],
  ['United States', 'US', 'USD', '$', [['Miami', 25.7617, -80.1918, 5900, 5.4], ['Austin', 30.2672, -97.7431, 3800, 5.0], ['Cleveland', 41.4993, -81.6944, 1300, 9.2]]],
  ['Canada', 'CA', 'CAD', 'C$', [['Toronto', 43.6532, -79.3832, 7600, 3.9], ['Calgary', 51.0447, -114.0719, 3500, 5.6]]],
  ['Mexico', 'MX', 'MXN', 'MX$', [['Mexico City', 19.4326, -99.1332, 2400, 6.2], ['Tulum', 20.2114, -87.4654, 3100, 8.1], ['Mérida', 20.9674, -89.5926, 1500, 7.0]]],
  ['Costa Rica', 'CR', 'CRC', '₡', [['Tamarindo', 10.2993, -85.8371, 2900, 7.4]]],
  ['Panama', 'PA', 'PAB', 'B/.', [['Panama City', 8.9824, -79.5199, 2300, 6.8]]],
  ['Colombia', 'CO', 'COP', 'COL$', [['Medellín', 6.2476, -75.5658, 1700, 7.8], ['Cartagena', 10.391, -75.4794, 2400, 7.3]]],
  ['Brazil', 'BR', 'BRL', 'R$', [['São Paulo', -23.5505, -46.6333, 2200, 5.6], ['Florianópolis', -27.5949, -48.5482, 2000, 6.1]]],
  ['Argentina', 'AR', 'ARS', 'AR$', [['Buenos Aires', -34.6037, -58.3816, 2300, 5.3]]],
  ['Uruguay', 'UY', 'UYU', '$U', [['Montevideo', -34.9011, -56.1645, 2900, 5.0]]],
  ['South Africa', 'ZA', 'ZAR', 'R', [['Cape Town', -33.9249, 18.4241, 2500, 7.2]]],
  ['Kenya', 'KE', 'KES', 'KSh', [['Nairobi', -1.2921, 36.8219, 1400, 8.0]]],
  ['Morocco', 'MA', 'MAD', 'DH', [['Marrakesh', 31.6295, -7.9811, 1600, 6.6]]],
  ['Mauritius', 'MU', 'MUR', '₨', [['Grand Baie', -20.0064, 57.5802, 3200, 5.5]]],
  ['Cyprus', 'CY', 'EUR', '€', [['Limassol', 34.7071, 33.0226, 3900, 5.3]]],
  ['Montenegro', 'ME', 'EUR', '€', [['Kotor', 42.4247, 18.7712, 3300, 5.8]]],
];

const TYPES = ['APARTMENT', 'APARTMENT', 'APARTMENT', 'HOUSE', 'VILLA', 'DUPLEX', 'STUDIO'];
const GOALS = ['HIGH_ROI', 'CASH_FLOW_POSITIVE', 'SHORT_TERM_RENTAL_READY', 'LONG_TERM_RENTAL_STABLE', 'FIX_AND_FLIP', 'NEW_DEVELOPMENT', 'BELOW_MARKET_VALUE', 'TURNKEY_INVESTMENT', 'MULTI_UNIT', 'STUDENT_HOUSING', 'RETIREMENT_INCOME', 'VACATION_HOME_INCOME', 'COMMERCIAL_CONVERSION'];
const BENEFITS = ['TAX_FREE_ZONE', 'LOW_PROPERTY_TAX', 'URBAN_GROWTH_ZONE', 'TOURIST_HOTSPOT', 'NEAR_INFRASTUCTURE_PROJECT', 'ECONOMIC_HUB', 'EXPAT_FRIENDLY', 'GREEN_ZONE', 'HERITAGE_ZONE', 'SAFE_NEIGHBORHOOD', 'SCHOOL_DISTRICT', 'COASTAL_ACCESS', 'MOUNTAIN_VIEW', 'EU_RESIDENCY_ELIGIBLE', 'GOLDEN_VISA'];
const ADJ = ['Sunlit', 'Renovated', 'Quiet', 'Corner', 'Top-floor', 'Garden', 'Riverside', 'Central', 'Modern', 'Period', 'Sea-view', 'Newly built'];
const NOUN = { APARTMENT: 'apartment', HOUSE: 'house', VILLA: 'villa', DUPLEX: 'duplex', STUDIO: 'studio' };
const AREAS = ['Old Town', 'the harbour', 'the business district', 'the university quarter', 'the park', 'the waterfront', 'the hills', 'the market square'];

// mulberry32: small deterministic PRNG so fixtures are stable between runs
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20261004);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const sample = (arr, n) => [...arr].sort(() => rand() - 0.5).slice(0, n);
const between = (lo, hi) => lo + rand() * (hi - lo);
const uuid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const emojiU = (code) => [...code].map((c) => `U+${(0x1f1e6 + c.charCodeAt(0) - 65).toString(16).toUpperCase()}`).join(' ');

// Placeholder photos are served by this mock (GET /api/img/<seed>.svg), so listings carry a URL like the real API.
const picture = (seed, label) => `http://localhost:${PORT}/api/img/${seed}.svg?label=${encodeURIComponent(label)}`;

function pictureSvg(seed, label) {
  const hue = (seed * 47) % 360;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">` +
    `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${hue} 45% 62%)"/><stop offset="1" stop-color="hsl(${(hue + 30) % 360} 40% 82%)"/></linearGradient></defs>` +
    `<rect width="800" height="600" fill="url(#s)"/>` +
    `<rect y="430" width="800" height="170" fill="hsl(${hue} 22% 30%)"/>` +
    `<rect x="${140 + (seed % 5) * 30}" y="${190 + (seed % 3) * 30}" width="${300 + (seed % 4) * 50}" height="${240 - (seed % 3) * 30}" fill="hsl(${hue} 18% 93%)"/>` +
    `<rect x="${190 + (seed % 5) * 30}" y="300" width="70" height="130" fill="hsl(${hue} 30% 38%)"/>` +
    `<text x="24" y="580" font-family="sans-serif" font-size="22" fill="hsl(${hue} 20% 88%)">${label}</text>` +
    `</svg>`;
  return svg;
}

const countries = MARKETS.map(([name, code, currency, currencySymbol], i) => ({
  id: i + 1,
  name,
  code,
  phonecode: '',
  currency,
  currencySymbol,
  timezones: '[]',
  emojiU: emojiU(code),
  userCount: 0,
  agencyCount: 0,
}));

const cities = [];
MARKETS.forEach(([, , , , list], ci) => {
  for (const [name, lat, lng, ppm, yld] of list) {
    cities.push({ id: cities.length + 1, name, countryId: ci + 1, stateId: null, lat, lng, ppm, yld });
  }
});

const agencies = ['Meridian Estates', 'Northlight Property', 'Atlas & Vale', 'Harbour Row Realty', 'Longitude Homes'].map((name, i) => ({
  id: uuid(900 + i),
  name,
  companyName: name,
  companyWebsite: `https://${name.toLowerCase().replace(/[^a-z]+/g, '')}.example`,
  establishedYear: 2004 + i * 3,
  phoneNumber: `+40 21 555 01${String(i).padStart(2, '0')}`,
  email: `hello@${name.toLowerCase().replace(/[^a-z]+/g, '')}.example`,
  phone: `+40 21 555 01${String(i).padStart(2, '0')}`,
  description: `${name} lists verified investment property and handles viewings, due diligence and closing.`,
  isVerified: true,
}));

const PROPERTY_COUNT = 150;
const properties = [];
for (let n = 1; n <= PROPERTY_COUNT; n++) {
  // every city gets at least one listing, the rest are spread at random
  const city = n <= cities.length ? cities[n - 1] : pick(cities);
  const type = pick(TYPES);
  const bedrooms = type === 'STUDIO' ? 0 : type === 'VILLA' ? 3 + Math.floor(rand() * 4) : 1 + Math.floor(rand() * 4);
  const totalArea = Math.round(type === 'STUDIO' ? between(24, 42) : type === 'VILLA' ? between(160, 420) : between(45, 70) + bedrooms * between(14, 26));
  const price = Math.round((totalArea * city.ppm * between(0.75, 1.35)) / 500) * 500;
  const yieldPct = Math.max(2.2, city.yld + between(-1.4, 1.8));
  const score = Math.max(38, Math.min(97, Math.round(48 + yieldPct * 4.2 + between(-9, 12))));
  const title = `${pick(ADJ)} ${NOUN[type]} near ${pick(AREAS)}, ${city.name}`;
  const id = uuid(n);
  const agency = pick(agencies);
  const created = new Date(Date.UTC(2026, 9, 1) - Math.floor(between(0, 240)) * 86400000).toISOString();
  properties.push({
    id,
    agencyId: agency.id,
    agentId: uuid(800 + (n % 7)),
    title,
    description: `${title}. ${totalArea} m² over ${type === 'VILLA' || type === 'HOUSE' ? 'two floors' : 'one level'}, let-ready, with a projected gross yield of ${yieldPct.toFixed(1)}%. Figures come from the listing agency and local rental comparables.`,
    type,
    status: 'ACTIVE',
    price: price.toFixed(2),
    yield: yieldPct.toFixed(2),
    score,
    streetAddress: `${1 + Math.floor(rand() * 180)} ${pick(['Harbour', 'Station', 'Garden', 'Market', 'Hill', 'Mill'])} Street`,
    stateId: null,
    postalCode: String(10000 + Math.floor(rand() * 89999)),
    countryId: city.countryId,
    cityId: city.id,
    latitude: (city.lat + between(-0.09, 0.09)).toFixed(6),
    longitude: (city.lng + between(-0.12, 0.12)).toFixed(6),
    constructionDate: new Date(Date.UTC(1965 + Math.floor(rand() * 60), 0, 1)).toISOString(),
    builtArea: (totalArea * 0.9).toFixed(3),
    landArea: (type === 'VILLA' || type === 'HOUSE' ? totalArea * between(1.5, 4) : 0).toFixed(3),
    totalArea: totalArea.toFixed(3),
    rooms: bedrooms + 1 + Math.floor(rand() * 2),
    bedrooms,
    bathrooms: Math.max(1, Math.round(bedrooms / 1.6)),
    floors: type === 'VILLA' || type === 'HOUSE' || type === 'DUPLEX' ? 2 : 1,
    floorLevel: type === 'APARTMENT' || type === 'STUDIO' ? 1 + Math.floor(rand() * 12) : null,
    energyEfficiencyRating: pick(['A', 'B', 'C', 'D']),
    orientation: pick(['NORTH', 'SOUTH', 'EAST', 'WEST']),
    parking: pick(['NONE', 'GARAGE', 'STREET']),
    balconyType: pick(['NONE', 'BALCONY', 'TERRACE', 'BOTH']),
    balconyTotalSize: Math.floor(rand() * 30),
    balconyNumber: Math.floor(rand() * 3),
    ownershipStatus: true,
    propertyTaxes: (price * between(0.002, 0.011)).toFixed(3),
    HOAFees: type === 'APARTMENT' || type === 'STUDIO' ? between(300, 2400).toFixed(3) : null,
    availabilityDateStart: created,
    availabilityDateEnd: null,
    createdAt: created,
    updatedAt: null,
    propertyPictures: [0, 1, 2, 3].map((k) => ({
      id: uuid(n * 10 + k + 100000),
      propertyId: id,
      imageData: picture(n * 7 + k * 13, k === 0 ? city.name : `${city.name} ${k + 1}`),
      altText: k === 0 ? `Exterior of ${title}` : `${title}, photo ${k + 1}`,
      isPrimary: k === 0,
    })),
    propertyInvestmentGoalTags: sample(GOALS, 1 + Math.floor(rand() * 3)).map((investmentGoalTag) => ({ propertyId: id, investmentGoalTag })),
    propertyLocationBenefitTags: sample(BENEFITS, 1 + Math.floor(rand() * 3)).map((locationBenefitTag) => ({ propertyId: id, locationBenefitTag })),
  });
}

const byId = new Map(properties.map((p) => [p.id, p]));
const arr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const publicCity = ({ id, name, countryId, stateId }) => ({ id, name, countryId, stateId });

// Same semantics as FilterDto + InvG/LocB on the Nest search route.
function search(f) {
  const countryIds = new Set(arr(f.countryIds).map(Number));
  const cityTags = new Set(arr(f.cityTags).map((c) => String(c).toLowerCase()));
  const goals = arr(f.InvG);
  const benefits = arr(f.LocB);
  return properties.filter((p) => {
    if (f.minimumPrice != null && Number(p.price) < Number(f.minimumPrice)) return false;
    if (f.maximumPrice != null && Number(p.price) > Number(f.maximumPrice)) return false;
    if (f.propertyType && p.type !== f.propertyType) return false;
    if (f.minimumScore != null && p.score < Number(f.minimumScore)) return false;
    if (f.minimumYield != null && Number(p.yield) < Number(f.minimumYield)) return false;
    if (f.minimumNoBedrooms != null && p.bedrooms < Number(f.minimumNoBedrooms)) return false;
    if (countryIds.size && !countryIds.has(p.countryId)) return false;
    if (cityTags.size && !cityTags.has(cities[p.cityId - 1].name.toLowerCase())) return false;
    if (goals.length && !goals.some((g) => p.propertyInvestmentGoalTags.some((t) => t.investmentGoalTag === g))) return false;
    if (benefits.length && !benefits.some((b) => p.propertyLocationBenefitTags.some((t) => t.locationBenefitTag === b))) return false;
    return true;
  });
}

function details(p) {
  const r = rng(Number(p.id.slice(-6)));
  const some = (list) => list.filter(() => r() > 0.45);
  return {
    ...p,
    picture: p.propertyPictures,
    investmentGoal: p.propertyInvestmentGoalTags,
    locationBenefit: p.propertyLocationBenefitTags,
    heatingSystem: some(['CENTRAL', 'UNDERFLOOR', 'HEAT_PUMP']).map((heatingSystem) => ({ propertyId: p.id, heatingSystem })),
    coolingSystem: some(['AIR_CONDITIONING', 'CEILING_FANS']).map((coolingSystem) => ({ propertyId: p.id, coolingSystem })),
    kitchen: some(['FITTED', 'OPEN_PLAN', 'ISLAND']).map((kitchen) => ({ propertyId: p.id, kitchen })),
    security: some(['ALARM', 'CCTV', 'GATED', 'CONCIERGE']).map((security) => ({ propertyId: p.id, security })),
    utility: some(['FIBER_INTERNET', 'SOLAR_PANELS', 'WATER_HEATER']).map((utility) => ({ propertyId: p.id, utility })),
    smartHomeFeature: some(['SMART_LOCK', 'SMART_THERMOSTAT', 'SMART_LIGHTING']).map((smartHomeFeature) => ({ propertyId: p.id, smartHomeFeature })),
    otherFeature: some(['ELEVATOR', 'STORAGE', 'POOL', 'GYM']).map((otherFeature) => ({ propertyId: p.id, otherFeature })),
  };
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Fixture sign-ins for local UI work only. The tokens are unsigned and accepted by nothing but this mock.
const DEMO_ACCOUNTS = [
  { kind: 'user', id: uuid(700), email: 'investor@nomad.test', password: 'demo-investor', firstName: 'Ada', lastName: 'Investor' },
  { kind: 'agency', id: uuid(900), email: 'agency@nomad.test', password: 'demo-agency', firstName: 'Meridian', lastName: 'Estates' },
];
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
function session(a) {
  const exp = Math.floor(Date.now() / 1000) + 86400;
  const accessToken = [b64({ alg: 'none', typ: 'JWT' }), b64({ sub: a.id, role: a.kind === 'agency' ? 'AGENCY' : 'INVESTOR', exp }), 'mock'].join('.');
  return { accessToken, refreshToken: accessToken, RefreshJTI: 'mock-jti', sub: a.id, firstName: a.firstName, lastName: a.lastName };
}

const people = [["Ioana", "Marin"], ["Tomas", "Novak"], ["Leila", "Haddad"], ["Marco", "Bianchi"], ["Sofia", "Almeida"], ["Daniel", "Okafor"]].map(([firstName, lastName], i) => ({
  id: uuid(800 + i),
  firstName,
  lastName,
  email: (firstName + "." + lastName).toLowerCase() + "@nomad.test",
  phoneNumber: "+40 712 000 10" + i,
}));
const agents = people.slice(0, 2).map((user, i) => ({ id: uuid(600 + i), userId: user.id, agencyId: uuid(900), user }));

const saved = new Map(); // userId → Set(propertyId), in memory only

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api/, '').replace(/\/$/, '');
  const method = req.method;
  const send = (status, body) => {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] || 'content-type, authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    });
    res.end(body === undefined ? '' : JSON.stringify(body));
  };
  if (method === 'OPTIONS') return send(204);
  const query = (k) => (url.searchParams.getAll(k).length ? url.searchParams.getAll(k) : url.searchParams.getAll(`${k}[]`));
  let m;

  if (method === 'GET' && path === '/health') return send(200, { ok: true });
  if (method === 'GET' && (m = path.match(/^\/img\/(\d+)\.svg$/))) {
    res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400', 'Access-Control-Allow-Origin': '*' });
    return res.end(pictureSvg(Number(m[1]), (url.searchParams.get('label') || '').replace(/[<>&"]/g, '')));
  }
  // Mock-only: a ready-made session for scripts/screens.mjs ("user" or "agency")
  if (method === 'GET' && (m = path.match(/^\/__demo-session\/(user|agency)$/))) {
    const account = DEMO_ACCOUNTS.find((a) => a.kind === m[1]);
    return send(200, { ...session(account), role: m[1] === 'agency' ? 'AGENCY' : 'INVESTOR' });
  }
  if (method === 'GET' && path === '/property/stats-home')
    return send(200, { countries: new Set(properties.map((p) => p.countryId)).size, properties: properties.length, partners: agencies.length });
  if (path === '/property/retrieve-search' && (method === 'POST' || method === 'GET')) {
    const body = method === 'POST' ? await readBody(req) : {};
    return send(200, search({ ...body, InvG: body.InvG ?? query('InvG'), LocB: body.LocB ?? query('LocB') }));
  }
  if (method === 'GET' && path === '/property/retrieve-search-by-name') {
    const q = (url.searchParams.get('q') || '').toLowerCase();
    return send(200, properties.filter((p) => p.title.toLowerCase().includes(q) || countries[p.countryId - 1].name.toLowerCase().includes(q)));
  }
  if (method === 'GET' && (m = path.match(/^\/property\/retrieve-details\/(.+)$/))) {
    const p = byId.get(m[1]);
    return p ? send(200, details(p)) : send(404, { statusCode: 404, message: 'Property not found' });
  }
  if (method === 'GET' && (m = path.match(/^\/property\/retrieve-portfolio\/(.+)$/))) return send(200, properties.filter((p) => p.agencyId === m[1]));

  if (method === 'GET' && path === '/countries/retrieve/get-all') return send(200, countries);
  if (method === 'GET' && (m = path.match(/^\/countries\/retrieve\/(\d+)$/))) return send(200, countries[Number(m[1]) - 1] ?? null);
  if (method === 'GET' && (path === '/cities/retrieve/get-all' || path === '/cities/retrieve/all')) return send(200, cities.map(publicCity));
  if (method === 'GET' && path === '/cities/retrieve/search') {
    const q = (url.searchParams.get('q') || url.searchParams.get('name') || '').toLowerCase();
    return send(200, cities.filter((c) => c.name.toLowerCase().includes(q)).map(publicCity));
  }
  if (method === 'GET' && (m = path.match(/^\/cities\/retrieve\/(\d+)$/))) {
    const c = cities[Number(m[1]) - 1];
    return send(200, c ? publicCity(c) : null);
  }
  if (method === 'GET' && (m = path.match(/^\/agency\/retrieve\/(.+)$/))) return send(200, agencies.find((a) => a.id === m[1]) ?? agencies[0]);

  if (method === 'GET' && (m = path.match(/^\/analytics\/saved\/retrieve\/for-user\/(.+)$/)))
    return send(200, [...(saved.get(m[1]) ?? [])].map((propertyId) => ({ userId: m[1], propertyId })));
  if (method === 'POST' && path === '/analytics/saved/create') {
    const { userId, propertyId } = await readBody(req);
    if (!saved.has(userId)) saved.set(userId, new Set());
    saved.get(userId).add(propertyId);
    return send(201, { userId, propertyId });
  }
  if (method === 'DELETE' && (m = path.match(/^\/analytics\/saved\/delete\/for-user-and-property\/([^/]+)\/(.+)$/))) {
    saved.get(m[1])?.delete(m[2]);
    return send(200, { ok: true });
  }

  if (method === "GET" && (m = path.match(/^[/]user[/]retrieve[/](.+)$/))) {
    const a = DEMO_ACCOUNTS.find((x) => x.id === m[1]) ?? people.find((x) => x.id === m[1]);
    return a ? send(200, { firstName: a.firstName, lastName: a.lastName, email: a.email, emailVerified: true, phoneNumber: a.phoneNumber ?? "+40 712 000 000", role: "INVESTOR" }) : send(404, { statusCode: 404, message: "User not found" });
  }
  // Agency dashboard fixtures (in memory)
  if (method === "GET" && (m = path.match(/^[/]agent[/]retrieve[/]agents-for-agency[/](.+)$/))) return send(200, agents.filter((a) => a.agencyId === m[1]));
  if (method === "POST" && path === "/agent/create") {
    const { userId, agencyId } = await readBody(req);
    const user = people.find((u) => u.id === userId);
    if (!user) return send(404, { statusCode: 404, message: "User not found" });
    agents.push({ id: uuid(600 + agents.length), userId, agencyId, user });
    return send(201, { ok: true });
  }
  if (method === "DELETE" && (m = path.match(/^[/]agent[/]delete[/]([^/]+)[/](.+)$/))) {
    const i = agents.findIndex((a) => a.userId === m[1] && a.agencyId === m[2]);
    if (i >= 0) agents.splice(i, 1);
    return send(200, { ok: true });
  }
  if (method === "GET" && (m = path.match(/^[/]user[/]search[/](.+)$/))) {
    const q = decodeURIComponent(m[1]).toLowerCase();
    return send(200, people.filter((u) => (u.firstName + " " + u.lastName).toLowerCase().includes(q)));
  }
  if (method === "DELETE" && (m = path.match(/^[/]property[/]delete-property[/](.+)$/))) {
    const i = properties.findIndex((p) => p.id === m[1]);
    if (i >= 0) properties.splice(i, 1);
    byId.delete(m[1]);
    return send(200, { ok: true });
  }
  if (method === "POST" && path === "/property/create") {
    const body = await readBody(req);
    const id = uuid(5000 + properties.length);
    const created = { ...body, id, price: String(body.price), yield: String(body.yield ?? 0), score: 60, createdAt: new Date().toISOString(), propertyPictures: [], propertyInvestmentGoalTags: [], propertyLocationBenefitTags: [] };
    properties.push(created);
    byId.set(id, created);
    return send(201, created);
  }
  if (method === "PATCH" && (m = path.match(/^[/]property[/]update[/](.+)$/))) {
    const p = byId.get(m[1]);
    if (!p) return send(404, { statusCode: 404, message: "Property not found" });
    Object.assign(p, await readBody(req));
    return send(200, p);
  }
  if (method === "POST" && path === "/property/picture/create") {
    const body = await readBody(req);
    const p = byId.get(body.propertyId);
    if (p) p.propertyPictures.push({ id: uuid(9000 + p.propertyPictures.length), ...body });
    return send(201, body);
  }
  if (method === "POST" && (m = path.match(/^[/]property[/]create-score[/](.+)$/))) return send(201, 72);
  // remaining property sub-resources (features, tags, score update, picture delete) are accepted and ignored
  if (/^[/]property[/]/.test(path) && ["POST", "PATCH", "DELETE"].includes(method)) return send(method === "POST" ? 201 : 200, { ok: true });

  // Auth fixtures. Demo sign-ins (any other email is rejected): see DEMO_ACCOUNTS at the top of this block.
  if (method === 'POST' && (m = path.match(/^\/auth\/(user|agency)\/login$/))) {
    const { email, password } = await readBody(req);
    const account = DEMO_ACCOUNTS.find((a) => a.kind === m[1] && a.email === email && a.password === password);
    return account ? send(201, session(account)) : send(401, { statusCode: 401, message: 'Invalid credentials' });
  }
  if (method === 'POST' && (m = path.match(/^\/auth\/(user|agency)\/register$/))) {
    const body = await readBody(req);
    if (DEMO_ACCOUNTS.some((a) => a.email === body.email)) return send(409, { statusCode: 409, message: 'Email already registered' });
    return send(201, session({ kind: m[1], id: uuid(m[1] === 'agency' ? 900 : 700), firstName: body.firstName, lastName: body.lastName }));
  }
  if (method === 'POST' && /^\/auth\/(user|agency)\/(logout|confirm)$/.test(path)) return send(201, { ok: true });
  if (method === 'PATCH' && /^\/auth\/(user|agency)\/change-password\//.test(path)) return send(200, { ok: true });
  if (method === 'GET' && /^\/states\/retrieve\/get-all\/\d+$/.test(path)) return send(200, []);
  if (method === 'GET' && (m = path.match(/^\/cities\/retrieve\/get-all-by-country\/(\d+)$/)))
    return send(200, cities.filter((c) => c.countryId === Number(m[1])).map(publicCity));

  if (method === 'POST' && path === '/inquiry/create') return send(201, { ...(await readBody(req)), status: 'PENDING' });

  console.warn(`[mock-api] no fixture for ${method} ${url.pathname}`);
  return send(404, { statusCode: 404, message: `No fixture for ${method} ${url.pathname}` });
});

server.listen(PORT, () => {
  console.log(`[mock-api] ${properties.length} properties, ${countries.length} countries, ${cities.length} cities → http://localhost:${PORT}/api`);
});
