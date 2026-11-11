import {
  type BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  IcosahedronGeometry,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  ShadowMaterial,
  Shape,
  Sprite,
  SpriteMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * An architect's scale model, in metres, on a plinth: an L-shaped house (a gabled main volume and a flat-roofed wing),
 * a standing-seam roof with a chimney, recessed windows, a door with a canopy, a paved path, a few trees and hedges,
 * and a beacon above the roof (the same pin as on the globe).
 *
 * Every edge that would be razor sharp is bevelled: real objects catch the light on their edges, and that is the
 * biggest single cue that this is an object and not a drawing. Static parts are merged by material (one draw call per
 * material) so the whole model stays small for the GPU.
 */

// plan: the main volume stands left of centre, the wing on its right and a little further forward
const W = 3.6; // main width (x)
const D = 3.0; // main depth (z)
const WALL = 2.6; // eave height
const RISE = 1.1; // from the eaves to the ridge
const XC = -0.8; // main centre
const ZB = -1.8; // main back wall
const ZF = ZB + D; // main front wall: 1.2
const ZC = (ZB + ZF) / 2;
const WING = { x0: 1.0, x1: 3.0, z0: -0.6, z1: 1.8, h: 2.2 };

type Bucket = BufferGeometry[];

/** Adds `geometry` to a bucket, moved by `matrix`; every geometry in a bucket has the same attributes so it can be merged. */
function put(bucket: Bucket, geometry: BufferGeometry, matrix: Matrix4) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name);
  g.applyMatrix4(matrix);
  bucket.push(g);
  geometry.dispose();
}

const move = (x: number, y: number, z: number) => new Matrix4().makeTranslation(x, y, z);
const turn = (angle: number) => new Matrix4().makeRotationY(angle);
/** `base`, then moved by (x, y, z) in base's own axes */
const local = (base: Matrix4, x: number, y: number, z: number) => base.clone().multiply(move(x, y, z));

/** A bevelled box centred on (0,0,0), placed by `matrix`. */
function box(bucket: Bucket, matrix: Matrix4, w: number, h: number, d: number, radius = 0.02, segments = 2) {
  put(bucket, new RoundedBoxGeometry(w, h, d, segments, Math.min(radius, w / 2.01, h / 2.01, d / 2.01)), matrix);
}

/** Fine grey noise for a bump map: plaster, grass. Seeded, so every render (and every poster) is the same. */
function noise(seed: number, repeat: number, contrast: number) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  const image = context.createImageData(size, size);
  let s = seed;
  const random = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let i = 0; i < size * size; i++) {
    const v = 128 + (random() + random() + random() - 1.5) * contrast;
    image.data.set([v, v, v, 255], i * 4);
  }
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  return texture;
}

/** The pentagon of a gabled house (walls and gable in one piece), bevelled, standing on y = 0 with its back at z = ZB. */
function gabledBody() {
  const bevel = 0.03;
  const half = W / 2 - bevel;
  const shape = new Shape();
  shape.moveTo(-half, bevel);
  shape.lineTo(half, bevel);
  shape.lineTo(half, WALL - bevel);
  shape.lineTo(0, WALL + RISE - bevel);
  shape.lineTo(-half, WALL - bevel);
  shape.closePath();
  const g = new ExtrudeGeometry(shape, { depth: D - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 1 });
  g.translate(0, 0, bevel);
  return g;
}

export interface House {
  group: Group;
  /** the pulsing glow above the roof */
  beacon: Sprite;
  /** warm light in the windows at night */
  setNight(night: boolean): void;
}

export function buildHouse(): House {
  const group = new Group();
  const props = new Group(); // everything that stands on the lawn
  props.position.y = 0.06;
  group.add(props);

  // ---- materials
  const bumpPlaster = noise(7, 3, 70);
  const bumpGrass = noise(11, 7, 110);
  const mats = {
    plaster: new MeshStandardMaterial({ color: 0xf1ebe4, roughness: 0.92, bumpMap: bumpPlaster, bumpScale: 0.5 }),
    base: new MeshStandardMaterial({ color: 0xaebbd9, roughness: 0.85, bumpMap: bumpPlaster, bumpScale: 0.6 }),
    trim: new MeshStandardMaterial({ color: 0xfbf8f4, roughness: 0.55 }),
    roof: new MeshStandardMaterial({ color: 0xc9655b, roughness: 0.48, metalness: 0.3 }),
    rib: new MeshStandardMaterial({ color: 0xdd8077, roughness: 0.4, metalness: 0.4 }),
    flat: new MeshStandardMaterial({ color: 0xd6d1dc, roughness: 0.85 }),
    glass: new MeshPhysicalMaterial({ color: 0x9fb6d8, roughness: 0.05, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.8, emissive: 0xffc979, emissiveIntensity: 0 }),
    door: new MeshStandardMaterial({ color: 0xa569bd, roughness: 0.45 }),
    panel: new MeshStandardMaterial({ color: 0x8e55a6, roughness: 0.5 }),
    metal: new MeshStandardMaterial({ color: 0xe0d2b0, roughness: 0.28, metalness: 1 }),
    chimney: new MeshStandardMaterial({ color: 0xd9c6ba, roughness: 1, bumpMap: bumpPlaster, bumpScale: 1.2 }),
    flue: new MeshStandardMaterial({ color: 0x2a2433, roughness: 1 }),
    plinth: new MeshStandardMaterial({ color: 0xf3eef6, roughness: 0.75 }),
    lawn: new MeshStandardMaterial({ color: 0x9db395, roughness: 1, bumpMap: bumpGrass, bumpScale: 1.4 }),
    paver: new MeshStandardMaterial({ color: 0xe6e0e8, roughness: 0.9 }),
    trunk: new MeshStandardMaterial({ color: 0x8c6b5a, roughness: 1 }),
    leaf: new MeshStandardMaterial({ color: 0x88ad84, roughness: 0.95 }),
    hedge: new MeshStandardMaterial({ color: 0x6f9a78, roughness: 1, bumpMap: bumpGrass, bumpScale: 1.2 }),
  };
  type Key = keyof typeof mats;
  const buckets = Object.fromEntries((Object.keys(mats) as Key[]).map((k) => [k, [] as Bucket])) as Record<Key, Bucket>;

  // ---- plinth and lawn
  box(buckets.plinth, move(0, -0.175, 0), 6.4, 0.35, 6.4, 0.12, 3);
  box(buckets.lawn, move(0, 0.03, 0), 6.0, 0.06, 6.0, 0.03, 2);

  // ---- walls
  put(buckets.plaster, gabledBody(), move(XC, 0, ZB));
  box(buckets.plaster, move((WING.x0 + WING.x1) / 2, WING.h / 2, (WING.z0 + WING.z1) / 2), WING.x1 - WING.x0, WING.h, WING.z1 - WING.z0, 0.03, 3);
  // the darker base course
  box(buckets.base, move(XC, 0.075, ZC), W + 0.05, 0.15, D + 0.05, 0.03);
  box(buckets.base, move((WING.x0 + WING.x1) / 2 + 0.01, 0.075, (WING.z0 + WING.z1) / 2), WING.x1 - WING.x0 + 0.05, 0.15, WING.z1 - WING.z0 + 0.05, 0.03);

  // ---- roof of the main volume: two standing-seam slopes, a ridge cap, edge boards, a chimney
  const halfW = W / 2;
  const slope = Math.hypot(halfW, RISE);
  const theta = Math.atan2(RISE, halfW);
  const OVER = 0.28;
  const THICK = 0.08;
  const slabLength = slope + 0.3;
  const slabDepth = D + 2 * OVER;
  const ridge = new Vector3(XC, WALL + RISE, ZC);
  for (const side of [1, -1] as const) {
    const down = new Vector3(side * Math.cos(theta), -Math.sin(theta), 0);
    const out = new Vector3(side * Math.sin(theta), Math.cos(theta), 0);
    const centre = ridge.clone().addScaledVector(down, (slope + 0.2) / 2).addScaledVector(out, THICK / 2 + 0.005);
    const slab = move(centre.x, centre.y, centre.z).multiply(new Matrix4().makeRotationZ(-side * theta));
    box(buckets.roof, slab, slabLength, THICK, slabDepth, 0.02, 1);
    // standing seams every 0.3 down the slope
    const seams = Math.floor((slabDepth / 2 - 0.12) / 0.3);
    for (let i = -seams; i <= seams; i++) box(buckets.rib, local(slab, 0, THICK / 2 + 0.0125, i * 0.3), slabLength - 0.12, 0.025, 0.035, 0.01, 1);
    // the board along the eave, and one along each sloping edge of the gables
    box(buckets.trim, local(slab, side * (slabLength / 2 - 0.02), -0.05, 0), 0.04, 0.14, slabDepth, 0.012, 1);
    for (const end of [1, -1]) box(buckets.trim, local(slab, 0, -0.03, end * (slabDepth / 2 - 0.025)), slabLength, THICK + 0.06, 0.05, 0.012, 1);
  }
  box(buckets.roof, move(XC, WALL + RISE + 0.035, ZC), 0.26, 0.1, slabDepth + 0.04, 0.04, 1);

  // chimney on the right-hand slope
  const chimneyX = XC + 0.8;
  const chimneyZ = ZC - 0.45;
  const roofAtChimney = WALL + RISE * (1 - 0.8 / halfW);
  const chimneyTop = roofAtChimney + 0.85;
  const chimneyBottom = roofAtChimney - 0.35;
  box(buckets.chimney, move(chimneyX, (chimneyTop + chimneyBottom) / 2, chimneyZ), 0.46, chimneyTop - chimneyBottom, 0.46, 0.015, 1);
  box(buckets.trim, move(chimneyX, chimneyTop + 0.04, chimneyZ), 0.6, 0.08, 0.6, 0.02, 1);
  box(buckets.flue, move(chimneyX, chimneyTop + 0.085, chimneyZ), 0.34, 0.02, 0.34, 0.005, 1);

  // ---- the wing: a flat roof with a parapet
  const wingCx = (WING.x0 + WING.x1) / 2;
  const wingCz = (WING.z0 + WING.z1) / 2;
  const [wingW, wingD] = [WING.x1 - WING.x0, WING.z1 - WING.z0];
  box(buckets.flat, move(wingCx, WING.h + 0.05, wingCz), wingW + 0.24, 0.1, wingD + 0.24, 0.035, 1);
  const rim = WING.h + 0.1 + 0.045;
  box(buckets.trim, move(wingCx, rim, wingCz + wingD / 2 + 0.09), wingW + 0.24, 0.09, 0.06, 0.02, 1);
  box(buckets.trim, move(wingCx, rim, wingCz - wingD / 2 - 0.09), wingW + 0.24, 0.09, 0.06, 0.02, 1);
  box(buckets.trim, move(WING.x1 + 0.09, rim, wingCz), 0.06, 0.09, wingD + 0.24, 0.02, 1);
  box(buckets.trim, move(WING.x0 - 0.09, rim, wingCz), 0.06, 0.09, wingD + 0.24, 0.02, 1);

  // ---- windows: a frame standing proud of the wall (so the glass reads as recessed), glass, a cross of bars, a sill
  const facing = { '+z': 0, '+x': Math.PI / 2, '-z': Math.PI, '-x': -Math.PI / 2 } as const;
  const frameBar = 0.07;
  function addWindow(x: number, y: number, z: number, side: keyof typeof facing, w: number, h: number) {
    const base = move(x, y, z).multiply(turn(facing[side]));
    // glass flush with the wall, frame 0.06 proud of it: the reveal is the inside of the frame
    put(buckets.glass, new RoundedBoxGeometry(w, h, 0.03, 1, 0.012), local(base, 0, 0, 0.005));
    box(buckets.trim, local(base, 0, h / 2 - frameBar / 2, 0.02), w, frameBar, 0.1, 0.015, 1);
    box(buckets.trim, local(base, 0, -h / 2 + frameBar / 2, 0.02), w, frameBar, 0.1, 0.015, 1);
    for (const end of [1, -1]) box(buckets.trim, local(base, end * (w / 2 - frameBar / 2), 0, 0.02), frameBar, h - 0.02, 0.1, 0.015, 1);
    box(buckets.trim, local(base, 0, 0, 0.04), 0.035, h - 0.1, 0.04, 0.01, 1);
    box(buckets.trim, local(base, 0, 0.05, 0.04), w - 0.1, 0.035, 0.04, 0.01, 1);
    box(buckets.trim, local(base, 0, -h / 2 - 0.03, 0.08), w + 0.16, 0.06, 0.16, 0.02, 1);
  }
  // round window high in a gable
  function roundWindow(z: number, side: keyof typeof facing) {
    const base = move(XC, WALL + 0.5, z).multiply(turn(facing[side]));
    put(buckets.glass, new CircleGeometry(0.22, 24), local(base, 0, 0, 0.012));
    put(buckets.trim, new TorusGeometry(0.22, 0.04, 8, 24), local(base, 0, 0, 0.02));
    box(buckets.trim, local(base, 0, 0, 0.03), 0.03, 0.4, 0.03, 0.008, 1);
    box(buckets.trim, local(base, 0, 0, 0.03), 0.4, 0.03, 0.03, 0.008, 1);
  }
  addWindow(0.0, 1.35, ZF, '+z', 0.9, 1.1);
  addWindow(XC, 1.35, ZB, '-z', 0.9, 1.1);
  addWindow(XC - W / 2, 1.35, ZB + 0.8, '-x', 0.8, 1.0);
  addWindow(XC - W / 2, 1.35, ZB + 2.2, '-x', 0.8, 1.0);
  addWindow(XC + W / 2, 1.35, ZB + 0.6, '+x', 0.7, 1.0);
  addWindow(wingCx, 1.3, WING.z1, '+z', 1.2, 1.3);
  addWindow(WING.x1, 1.3, wingCz, '+x', 1.0, 1.2);
  addWindow(wingCx, 1.3, WING.z0, '-z', 0.7, 0.9);
  roundWindow(ZF, '+z');
  roundWindow(ZB, '-z');

  // ---- front door: recessed panel in a frame, two inset panels, a handle, a step and a small canopy
  const doorX = XC - 0.7;
  const door = move(doorX, 0.9, ZF);
  box(buckets.door, local(door, 0, 0, 0.005), 0.9, 1.8, 0.05, 0.02, 1);
  box(buckets.panel, local(door, 0, 0.45, 0.035), 0.6, 0.55, 0.02, 0.01, 1);
  box(buckets.panel, local(door, 0, -0.38, 0.035), 0.6, 0.7, 0.02, 0.01, 1);
  box(buckets.trim, local(door, 0, 0.9 - 0.035, 0.02), 1.04, 0.07, 0.1, 0.015, 1);
  for (const end of [1, -1]) box(buckets.trim, local(door, end * 0.485, -0.035, 0.02), 0.07, 1.83, 0.1, 0.015, 1);
  put(buckets.metal, new CylinderGeometry(0.018, 0.018, 0.1, 10).rotateX(Math.PI / 2), local(door, 0.32, 0, 0.1));
  put(buckets.metal, new SphereGeometry(0.035, 12, 8), local(door, 0.32, 0, 0.15));
  box(buckets.trim, move(doorX, 0.05, ZF + 0.28), 1.5, 0.1, 0.56, 0.03, 2);
  box(buckets.trim, move(doorX, 2.1, ZF + 0.38), 1.6, 0.07, 0.8, 0.025, 1);
  for (const end of [1, -1]) put(buckets.trim, new CylinderGeometry(0.03, 0.03, 2.1, 10), move(doorX + end * 0.68, 1.05, ZF + 0.7));

  // ---- a paved path from the step to the edge of the lawn
  for (let i = 0; i < 3; i++) box(buckets.paver, move(doorX, 0.02, ZF + 0.8 + i * 0.4), 0.8, 0.04, 0.32, 0.015, 1);

  // ---- planting
  const tree = (x: number, z: number, scale: number) => {
    put(buckets.trunk, new CylinderGeometry(0.06, 0.09, 0.9, 8), move(x, 0.45 * scale, z).multiply(new Matrix4().makeScale(scale, scale, scale)));
    put(buckets.leaf, new IcosahedronGeometry(0.55, 2), move(x, 1.25 * scale, z).multiply(new Matrix4().makeScale(scale, scale * 1.15, scale)));
  };
  tree(-2.5, 2.2, 1.15);
  tree(2.3, -2.3, 1);
  tree(-2.6, -2.4, 0.85);
  tree(2.5, 2.5, 0.7);
  box(buckets.hedge, move(-0.1, 0.25, 2.55), 1.5, 0.5, 0.42, 0.14, 3);
  box(buckets.hedge, move(-2.9, 0.22, 0.4), 0.42, 0.44, 1.7, 0.14, 3);
  box(buckets.hedge, move(1.2, 0.2, 2.75), 1.0, 0.4, 0.38, 0.13, 3);

  // ---- merge by material, and every mesh casts and receives shadows
  for (const key of Object.keys(buckets) as Key[]) {
    if (!buckets[key].length) continue;
    const merged = mergeGeometries(buckets[key], false);
    buckets[key].forEach((g) => g.dispose());
    if (!merged) continue;
    const mesh = new Mesh(merged, mats[key]);
    mesh.castShadow = key !== 'lawn' && key !== 'paver';
    mesh.receiveShadow = true;
    (key === 'plinth' || key === 'lawn' ? group : props).add(mesh);
  }

  // ---- the beacon: a coral core and a soft halo that breathes
  const core = new Mesh(new SphereGeometry(0.13, 20, 14), new MeshStandardMaterial({ color: 0xf08a80, emissive: 0xf08a80, emissiveIntensity: 0.9, roughness: 0.4 }));
  core.position.set(XC, WALL + RISE + 1.15, ZC);
  const halo = document.createElement('canvas');
  halo.width = halo.height = 128;
  const hc = halo.getContext('2d')!;
  const gradient = hc.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 170, 160, 0.9)');
  gradient.addColorStop(0.35, 'rgba(240, 138, 128, 0.35)');
  gradient.addColorStop(1, 'rgba(240, 138, 128, 0)');
  hc.fillStyle = gradient;
  hc.fillRect(0, 0, 128, 128);
  const beacon = new Sprite(new SpriteMaterial({ map: new CanvasTexture(halo), transparent: true, depthWrite: false }));
  beacon.position.copy(core.position);
  beacon.scale.setScalar(1.3);
  props.add(core, beacon);

  // the soft shadow of the plinth on the page: a plane that shows only the shadow (it is not part of the turning model)
  const shadow = new Mesh(new PlaneGeometry(22, 22).rotateX(-Math.PI / 2), new ShadowMaterial({ opacity: 0.2 }));
  shadow.position.y = -0.352;
  shadow.receiveShadow = true;
  group.add(shadow);

  return {
    group,
    beacon,
    setNight(night) {
      mats.glass.emissiveIntensity = night ? 1 : 0;
      (shadow.material as ShadowMaterial).opacity = night ? 0.35 : 0.2;
    },
  };
}
