import {
  type BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  ShadowMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * The market skyline: one tower per country on the same plinth, in the same light and materials as the house (see
 * house-model.ts). A tower is as tall as the number of listings in its country. Towers grow from the ground one after
 * another; the active tower (the one hovered here, or its row in the list) lights its windows and raises a beacon.
 */

export interface TowerInput {
  id: number;
  count: number;
}

export interface Skyline {
  group: Group;
  /** the meshes a pointer can hit, each with `userData.id` */
  bodies: Mesh[];
  /** how far each tower has grown, 0 to 1, by its place in the list (the first grows first) */
  grow(progress: (index: number) => number): void;
  setActive(id: number | null): void;
  setNight(night: boolean): void;
  /** the beacons breathe */
  breathe(seconds: number): void;
}

const SIZE = 1.35; // footprint of a tower
const STEP = 1.9; // distance between tower centres: a 3 by 3 block
const FLOOR = 0.55;
const PLASTERS = [0xf2c4bd, 0xbfcdf0, 0xe0c8ec]; // coral, periwinkle and orchid, softened
const cells = [-STEP, 0, STEP].flatMap((x) => [-STEP, 0, STEP].map((z) => ({ x, z })));
// the camera looks from the front right: the tallest towers go to the back left so they do not hide the others
const AWAY = cells.slice().sort((a, b) => a.x * 0.57 + a.z * 0.82 - (b.x * 0.57 + b.z * 0.82));

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

const keep = new Set(['position', 'normal', 'uv']);
function flat(geometry: BufferGeometry, matrix: Matrix4) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  for (const name of Object.keys(g.attributes)) if (!keep.has(name)) g.deleteAttribute(name);
  g.applyMatrix4(matrix);
  geometry.dispose();
  return g;
}
const at = (x: number, y: number, z: number) => new Matrix4().makeTranslation(x, y, z);

export function buildSkyline(towers: TowerInput[]): Skyline {
  const group = new Group();
  const props = new Group();
  props.position.y = 0.06;
  group.add(props);

  const bump = noise(5, 3, 70);
  const plinth = new Mesh(new RoundedBoxGeometry(6.4, 0.35, 6.4, 3, 0.12), new MeshStandardMaterial({ color: 0xf3eef6, roughness: 0.75 }));
  plinth.position.y = -0.175;
  const plaza = new Mesh(new RoundedBoxGeometry(6.0, 0.06, 6.0, 2, 0.03), new MeshStandardMaterial({ color: 0xe3dde8, roughness: 0.9, bumpMap: noise(13, 6, 100), bumpScale: 1 }));
  plaza.position.y = 0.03;
  for (const m of [plinth, plaza]) {
    m.castShadow = m === plinth;
    m.receiveShadow = true;
    group.add(m);
  }

  const trim = new MeshStandardMaterial({ color: 0xfbf8f4, roughness: 0.55 });
  const unit = new MeshStandardMaterial({ color: 0xd6d1dc, roughness: 0.8 });
  const windowBox = new RoundedBoxGeometry(0.2, 0.3, 0.05, 1, 0.015);
  const most = Math.max(1, ...towers.map((t) => t.count));

  const states = towers.slice(0, 9).map((tower, index) => {
    const cell = AWAY[index];
    const height = 1.1 + (tower.count / most) * 3.4;
    const root = new Group();
    root.position.set(cell.x, 0, cell.z);
    props.add(root);

    const body = new Mesh(
      new RoundedBoxGeometry(SIZE, height, SIZE, 2, 0.05),
      new MeshStandardMaterial({ color: PLASTERS[index % 3], roughness: 0.9, bumpMap: bump, bumpScale: 0.5, emissive: 0xffe3c0, emissiveIntensity: 0 }),
    );
    body.position.y = height / 2;
    body.castShadow = body.receiveShadow = true;
    body.userData.id = tower.id;
    root.add(body);

    // windows: a grid on every wall, one instanced mesh per tower
    const floors = Math.max(1, Math.floor((height - 0.5) / FLOOR));
    const glass = new MeshPhysicalMaterial({ color: 0x9fb6d8, roughness: 0.05, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.8, emissive: 0xffc979, emissiveIntensity: 0 });
    const windows = new InstancedMesh(windowBox, glass, floors * 3 * 4);
    let n = 0;
    for (let face = 0; face < 4; face++) {
      const turn = new Matrix4().makeRotationY((face * Math.PI) / 2);
      for (let f = 0; f < floors; f++) for (let c = -1; c <= 1; c++) windows.setMatrixAt(n++, turn.clone().multiply(at(c * 0.42, 0.45 + f * FLOOR, SIZE / 2 + 0.01)));
    }
    windows.frustumCulled = false;
    root.add(windows);

    // the roof: a parapet and a unit or two, and an antenna on the tallest tower
    const parts: BufferGeometry[] = [flat(new RoundedBoxGeometry(SIZE + 0.1, 0.1, SIZE + 0.1, 1, 0.03), at(0, height + 0.05, 0))];
    const roofUnits: BufferGeometry[] = [
      flat(new RoundedBoxGeometry(0.42, 0.24, 0.36, 1, 0.03), at(-0.3, height + 0.22, 0.22)),
      flat(new RoundedBoxGeometry(0.26, 0.18, 0.26, 1, 0.03), at(0.32, height + 0.19, -0.3)),
    ];
    if (index === 0) roofUnits.push(flat(new CylinderGeometry(0.02, 0.025, 1, 8), at(0.38, height + 0.6, 0.38)));
    const roof = new Group();
    const parapet = new Mesh(mergeGeometries(parts, false), trim);
    const units = new Mesh(mergeGeometries(roofUnits, false), unit);
    for (const m of [parapet, units]) {
      m.castShadow = m.receiveShadow = true;
      roof.add(m);
    }
    root.add(roof);

    // the beacon of the active tower
    const core = new Mesh(new SphereGeometry(0.12, 18, 12), new MeshStandardMaterial({ color: 0xf08a80, emissive: 0xf08a80, emissiveIntensity: 0.9, roughness: 0.4 }));
    const halo = document.createElement('canvas');
    halo.width = halo.height = 128;
    const hc = halo.getContext('2d')!;
    const gradient = hc.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 170, 160, 0.9)');
    gradient.addColorStop(0.35, 'rgba(240, 138, 128, 0.35)');
    gradient.addColorStop(1, 'rgba(240, 138, 128, 0)');
    hc.fillStyle = gradient;
    hc.fillRect(0, 0, 128, 128);
    const glow = new Sprite(new SpriteMaterial({ map: new CanvasTexture(halo), transparent: true, depthWrite: false }));
    core.position.set(0, height + 0.95, 0);
    glow.position.copy(core.position);
    core.visible = glow.visible = false;
    root.add(core, glow);

    return { id: tower.id, root, body, glass, core, glow };
  });

  const shadow = new Mesh(new PlaneGeometry(22, 22).rotateX(-Math.PI / 2), new ShadowMaterial({ opacity: 0.2 }));
  shadow.position.y = -0.352;
  shadow.receiveShadow = true;
  group.add(shadow);

  let night = false;
  let active: number | null = null;
  const light = () => {
    for (const s of states) {
      const on = s.id === active;
      s.glass.emissiveIntensity = on ? (night ? 1.6 : 1) : night ? 0.8 : 0;
      (s.body.material as MeshStandardMaterial).emissiveIntensity = on ? 0.16 : 0;
      s.core.visible = s.glow.visible = on;
    }
  };

  return {
    group,
    bodies: states.map((s) => s.body),
    grow(progress) {
      states.forEach((s, i) => s.root.scale.setScalar(1).setY(Math.max(0.001, progress(i))));
    },
    setActive(id) {
      active = id;
      light();
    },
    setNight(value) {
      night = value;
      (shadow.material as ShadowMaterial).opacity = value ? 0.35 : 0.2;
      light();
    },
    breathe(seconds) {
      for (const s of states) s.glow.scale.setScalar(1.3 + 0.2 * Math.sin(seconds * 2.2));
    },
  };
}
