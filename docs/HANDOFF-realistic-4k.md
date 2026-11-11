# Brief: realistic, 4K-crisp UI and 3D for Nomad Estate

You are continuing a design pass on the Next.js frontend `nomad-estate` (branch `redesign`). Read this whole brief
before touching anything. Work through the packages in order, one commit per package, and do not stop between
packages unless you hit one of the "ask the owner" points. Ask the owner with the question tool, never in prose.

## 1. What the owner asked for

In the owner's words: "Make the UI design more complex, not by adding more elements, but by detailing them and
adding texture. The 3D models also should be better. Make everything look realistic and 4k."

Decided with the owner on 2026-11-11:

- **Realistic** means one consistent physical world: every surface is a material (frosted glass, coated paper,
  soft plastic, plaster), lit by one soft light from above, with shadows that match how high the surface floats.
  Nothing perfectly flat, nothing perfectly uniform. It does not mean wood grain, leather, heavy bevels or glare.
- **4K** means crisp on 4K and retina screens, not shipping 4K files. Vector textures, canvases drawn at the
  screen's pixel density (capped at 2), photos served at the right size. No page may make the visitor wait more
  than 5 to 7 seconds.
- **3D models are built in code with three.js** (a new dependency, loaded only when a 3D section nears the
  screen): an architect's scale model, with physically based materials, studio lighting and soft shadows.
- **No new elements.** Detail goes onto what exists: CSS on existing elements, pseudo-elements, tokens.
- Inspiration: Awwwards real-estate winners (editorial type, glass over imagery) and Airbnb (soft depth, cards).

## 2. Ground rules

- Repo: `D:\Desktop\NomadEstate\nomad-estate`. Other sessions work in that folder and may have uncommitted
  files: never touch, stash or commit files you did not change. Work on your own branch made from
  `origin/redesign`, stage files by path (never `git add -A` in a shared checkout), then
  `git pull --rebase origin redesign` and `git push origin HEAD:redesign`. Never commit to `main`, `stable` or
  `current`, never force-push, never `git reset --hard`, never a bare `git stash`.
- Node is portable: put `D:\Desktop\NomadEstate\.tools\node-v20.19.5-win-x64` on PATH.
- Checks before every push: `npm run typecheck && npm run lint && npm run build` (0 errors; 8 lint warnings exist).
- `NEXT_PUBLIC_*` values are fixed at build time. For local checks build with
  `NEXT_PUBLIC_API_URL=http://localhost:4010 NEXT_PUBLIC_API_FLAVOR=nest`.
- Playwright: use `chromium.launchServer()`, kill its process tree with `taskkill /F /T /PID`, never call
  `process.exit()` while a browser is open. `scripts/shots.mjs` already does this; use it.
- This machine: files are CRLF, so edit with the edit tool, not scripted multi-line replaces. Shell heredocs that
  contain apostrophes fail here: create files with the write tool.
- `PROGRESS.md` is the hand-off log: update the heartbeat when you start, add a session-log line when you finish.
- Match the code's voice: comments say why, in plain words; no abstractions nobody asked for.

## 3. What exists (do not rebuild it)

| Thing | Where |
|---|---|
| Colour tokens, light and dark, `.glass`, `.shadow-float`, `.liquid`, all keyframes | `app/globals.css` |
| Reveal, Tilt, Magnetic, Words (scroll and pointer motion) | `components/site/reveal.tsx` |
| CSS 3D house (loader, 404, home closing panel) | `components/site/house-3d.tsx`, `.house` rules in `globals.css` |
| CSS 3D skyline, data-driven tower heights, hover linked to the list | `MarketSkyline` in `components/home/home-extras.tsx` |
| Photo flying from card to property page (view transition) | `lib/photo-flight.ts` |
| Hero globe (MapLibre) with still frame first, live later | `components/globe/`, `scripts/globe-posters.mjs` |
| Lazy-load helpers | `useNear` in `home-extras.tsx`, `hooks/use-after-first-paint.ts`, `hooks/use-when-quiet.ts` |
| Screenshots: whole pages / close-ups | `npm run screens` / `node scripts/shots.mjs <spec.json>` |
| Lighthouse | `node scripts/lighthouse.mjs` (read its header) |

Leave alone: the MapLibre globe, the Vaul sheet fix in `components/properties/properties-view.tsx` (the
`Dialog.Root modal={false}` wrapper and the Tab handler), `ogl` (the sign-in background uses it).

## 4. Traps already found in this codebase

1. CSS written outside an `@layer` in `globals.css` beats every Tailwind utility (`.house { position: relative }`
   silently overrode `absolute`). Put shared styles in `@layer components` unless they must win.
2. Never put `transform`, `filter`, `perspective`, `backdrop-filter` or `will-change: transform` on a wrapper of
   a whole page: `/properties` is one fixed full-screen view and collapses (see `app/(pages)/template.tsx`).
3. `animation-timeline: view()` binds to the nearest `overflow: hidden` ancestor. Use `scroll(root block)`.
4. No `mix-blend-mode` on large layers and no new `backdrop-filter` surfaces: both are expensive while scrolling.
5. Tailwind v4 builds every shadow as
   `box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)`.
   To add an edge highlight to anything that has a shadow utility, set `--tw-inset-shadow` on it; the focus ring
   keeps working. Do not write a raw `box-shadow` on buttons or inputs: it erases the focus ring.
6. Headless WebGL is software-rendered: fine for looks, useless for speed, and a phone-size screenshot of the
   home page can time out. Judge speed only with the Lighthouse script.
7. Baseline (mobile, real throttling): `/properties` performance 73 to 74; home blocking time about 2,000 ms.
   Lighthouse cannot score the home page at all right now (it finds no largest paint): compare blocking time,
   first paint and speed index instead. That, a slider without a name and one low-contrast text style on the
   home page are known problems: do not fix them silently, do not make them worse.

## 5. Package 1: materials (CSS only)

Add the tokens, then make the primitives use them. Values below were rendered and checked in both themes; treat
them as the starting point and tune within the stated range by looking at 2x close-ups.

Tokens (`:root` / `.dark`):

| Token | Light | Dark | Use |
|---|---|---|---|
| `--edge-light` | `rgb(255 255 255 / 0.9)` | `rgb(255 255 255 / 0.08)` | 1px highlight on the top inner edge |
| `--edge-shade` | `rgb(30 27 46 / 0.05)` | `rgb(0 0 0 / 0.3)` | 1px shade on the bottom inner edge |
| `--sheen` | `rgb(255 255 255 / 0.5)` | `rgb(255 255 255 / 0.04)` | light pooling at the top of a surface |
| `--grain-opacity` | `0.05` (0.04 to 0.06) | `0.07` (0.06 to 0.09) | film grain |

Grain: one fixed layer, `body::after { position: fixed; inset: 0; pointer-events: none; z-index: 90;
background-image: var(--grain); background-size: 200px 200px; opacity: var(--grain-opacity) }`, plain alpha.
`--grain` is this SVG, with `0` in the three marked places by day (dark specks) and `1` at night (light specks):

```
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 X  0 0 0 0 X  0 0 0 0 X  1.4 0 0 0 -0.35'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")
```

Elevation, four levels, all from the existing `--shadow-color` (light falls from above, shadows fall down):

- Level 1, resting card: `0 1px 1px hsl(var(--shadow-color) / .05), 0 4px 8px -2px hsl(var(--shadow-color) / .08), 0 14px 28px -10px hsl(var(--shadow-color) / .14)`
- Level 2, hovered card: level 1 with the last layer at `0 24px 44px -14px … / .2`, plus a 4px lift.
- Level 3, floating glass (`.shadow-float`: header, filter bar, sheets, chips): `0 1px 2px … / .06, 0 6px 12px -4px … / .1, 0 18px 36px -12px … / .18, 0 40px 64px -32px … / .2`
- Level 4, dialogs and menus: level 3 with every blur and offset times 1.5.

Recipes:

- **Paper** (every rounded, bordered panel on the card colour, and `[data-slot='card']`):
  `background-image: linear-gradient(to bottom, var(--sheen), transparent 40%)`, `--tw-inset-shadow: inset 0 1px 0 var(--edge-light)`, level 1.
- **Glass** (`.glass`): same sheen to 60%, `--tw-inset-shadow: inset 0 1px 0 var(--edge-light), inset 0 -1px 0 var(--edge-shade)`.
- **Button** (variants default, secondary, outline, destructive; not ghost or link):
  `background-image: linear-gradient(to bottom, rgb(255 255 255 / .28), transparent 55%, rgb(0 0 0 / .04))`,
  inset `0 1px 0 rgb(255 255 255 / .55)` and `0 -1px 0 rgb(30 27 46 / .1)`, drop `0 1px 2px … / .14, 0 3px 8px -2px … / .12`.
  Pressed: swap to `inset 0 2px 3px rgb(0 0 0 / .14)` and no drop shadow.
- **Tinted panel** (the Investors and Agencies cards): `radial-gradient(120% 90% at 0% 0%, rgb(255 255 255 / .5), transparent 55%)`
  over `radial-gradient(90% 70% at 100% 100%, rgb(30 27 46 / .1), transparent 60%)`, inset white ring at .22, and a
  shadow in the panel's own strong colour: `0 30px 60px -30px var(--investor-strong)`.
- **Field** (inputs, textareas, select triggers): recessed, `--tw-inset-shadow: inset 0 1px 2px hsl(var(--shadow-color) / .07)`.
- **Photo** (`ListingImage` in `components/properties/listing-parts.tsx`): a 1px inset ring at 6% ink on top of the
  image, so a pale photo never bleeds into a pale card.

Level of detail every card-like thing must reach: border, top edge light, sheen, layered shadow of its level,
inner radius equal to outer radius minus padding (concentric corners), hover that raises it one level in 300 ms,
pressed state. If a texture is noticeable at arm's length, it is too strong: halve it.

Done when: close-ups at 2x of the header, hero search, a listing card, the tinted panels, a button in each state,
the sign-in card and the property page's price panel show all of the above in both themes, text contrast on every
changed surface is at least 4.5:1, and focus rings are still visible.

## 6. Package 2: 4K audit

Capture at 1920x1080 with `dpr: 2`, at 3840x2160 with `dpr: 1`, and at 390x844 with `dpr: 3`. Fix: anything
blurry (bitmaps drawn larger than their pixels, including `public/globe/*.webp`, which are about 1,092 px wide:
regenerate at 2x with `scripts/globe-posters.mjs` if they look soft), `sizes` attributes that make `next/image`
pick too small a file, layouts that fall apart or look lost at 3840 wide, and canvases that ignore
`devicePixelRatio` (cap at 2). Do not raise image quality settings or add larger files without measuring weight.

## 7. Package 3: the house, in three.js

Install `three` and `@types/three`. All three.js code lives behind `dynamic(() => import(...), { ssr: false })`
and loads only when its section is near the screen (`useNear`). Verify in the network log that no three.js chunk
is requested on first load of any page.

Shared stage (`components/three/stage.ts`), used by both scenes:

```ts
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping; // keeps the pastels true
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; // three/addons/environments/RoomEnvironment.js
scene.environmentIntensity = 0.8;
const key = new THREE.DirectionalLight(0xfff4ea, 3); // above, left, in front: the same light as the UI
key.position.set(-4, 7, 5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.radius = 5;
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.02;
```

Size the canvas from a `ResizeObserver`. Draw only when something changed or an animation is running; stop when
the canvas is off screen or the tab is hidden; dispose geometry, materials, textures and the renderer on unmount.
Read colours from the CSS tokens with `getComputedStyle` and re-read them when the theme changes.

The model is an architect's scale model, in metres, on a plinth. Parts and the detail each needs:

- Plinth: rounded slab 6.4 x 0.35 x 6.4, matte off-white, lawn inset on top with a fine noise normal map.
- House: two volumes for an L-shaped plan: gabled main volume 3.6 x 2.6 x 3.0 and a flat-roofed wing 2.0 x 2.2 x 2.4.
  Plaster walls (roughness 0.9, faint normal noise), a darker 0.15 base course.
- Roof: 0.25 overhang, 0.08 thick, fascia boards, ridge cap, standing-seam ribs every 0.3. Chimney with a cap.
- Windows: recessed 0.08 into the wall, frame, mullions, sill; glass as `MeshPhysicalMaterial` roughness 0.05 that
  reflects the environment (no `transmission`: it costs a second render pass); warm emissive glow at night.
- Door: recessed, two inset panels, metal handle, step slab, small canopy. Paver path to the plinth edge.
- Two or three model trees (trunk plus a matte icosphere crown), rounded hedge blocks.
- A coral beacon floating above the roof, softly pulsing: the same pin as on the globe.
- **Every edge that would be razor sharp gets a 0.02 to 0.04 bevel** (`RoundedBoxGeometry`): real objects catch
  light on their edges, and this is the single biggest realism cue. Merge static parts by material
  (`BufferGeometryUtils.mergeGeometries`). Budget: 60k triangles, 60 draw calls.

Camera: perspective, field of view 30, three-quarter view (35 degrees round, 25 degrees up), the plinth framed
with an 8% margin. Motion: a slow turn, plus the scroll turn the CSS house has now, plus a damped lean towards
the pointer of at most 6 degrees. Reduced motion: one still frame.

Where it goes: the home page's closing panel (now also on phones, smaller) and the 404 page. Follow the globe's
pattern: a still frame first (`scripts/model-posters.mjs`, modelled on `scripts/globe-posters.mjs`: transparent
WebP at 2x, both themes, 60 kB at most each), the live scene fading in over it. **The loading animation stays
the CSS house**: it must appear instantly and without a download. Give its faces shading gradients and the same
proportions so it reads as the same house.

Done when: 2x close-ups in both themes show soft contact shadows, visible edge highlights, readable window and
door detail, no jagged edges, no flat unlit faces; the three.js chunk is under 200 kB gzipped and absent from
first load; Lighthouse is within noise of the baseline.

## 8. Package 4: the skyline, in three.js

Same stage. A 3 by 3 block of towers on a plinth; heights from the existing `markets` data in `MarketSkyline`
(keep the mapping). Each tower: bevelled box in one of three pastel plasters, window grid from a `CanvasTexture`
whose repeat follows the height so windows keep their size, parapet rim, a roof unit or two, an antenna on the
tallest. Towers grow from the ground with the existing 70 ms stagger. Keep the two-way hover link with the list
(raycast on pointer move sets `active`; an active tower lights its windows and raises a beacon). The CSS skyline
stays as what is shown until the scene is ready and where WebGL is missing. The picture stays `aria-hidden`.

## 9. How to check your own work

For every package: build, capture close-ups with `scripts/shots.mjs` (light and dark, `dpr: 2`), open the images
and answer honestly: Is there one light direction? Does every raised surface have an edge light and a shadow that
matches its height? Is any face or panel a single flat colour? Is anything blurry or jagged at 2x? Is any texture
loud? Fix and capture again; expect at least three rounds per package. Then run the three checks, the Lighthouse
script, and test keyboard focus and reduced motion. Report what you measured, what you could not verify, and
show the owner the before and after images.

Ask the owner before: adding any dependency other than `three`, changing copy or layout, fixing the known
problems in section 4.7, or exceeding a budget.
