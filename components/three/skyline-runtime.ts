import { Raycaster, Vector2 } from 'three';
import { createStage, type Frame } from './stage';
import { buildSkyline, type TowerInput } from './skyline-model';

/** The plinth and the tallest tower. The CSS skyline in the same box is what shows until this is ready. */
export const SKYLINE_FRAME: Frame = { width: 11.6, height: 10.2, centerY: 1.5 };

export interface RunningSkyline {
  setActive(id: number | null): void;
  dispose(): void;
}

const GROW = 900; // ms for a tower to grow
const STAGGER = 70; // ms between one tower and the next

/**
 * Starts the skyline in `canvas`. It draws only when something changes: the towers growing (the first time it is on
 * screen), the pointer leaning the block a few degrees, the active tower, the size or the theme. `onHover` reports the
 * tower under the mouse (or null); `setActive` lights a tower from outside (its row in the list). Reduced motion: no
 * growing, no leaning.
 */
export function mountSkyline(
  canvas: HTMLCanvasElement,
  { towers, onHover, onReady }: { towers: TowerInput[]; onHover: (id: number | null) => void; onReady: () => void },
): RunningSkyline {
  const stage = createStage(canvas, SKYLINE_FRAME);
  const skyline = buildSkyline(towers);
  stage.scene.add(skyline.group);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const applyTheme = () => {
    stage.setNight(root.classList.contains('dark'));
    skyline.setNight(root.classList.contains('dark'));
  };
  applyTheme();

  const lean = { x: 0, tx: 0 };
  let growStart = reduced ? -Infinity : 0; // set when the canvas first comes on screen
  let onScreen = false;
  let frame = 0;
  let ready = false;
  let hovered: number | null = null;

  const draw = (time: number) => {
    frame = 0;
    let busy = false;
    if (growStart !== -Infinity) {
      if (!growStart) growStart = time;
      const elapsed = time - growStart;
      skyline.grow((i) => {
        const x = Math.min(1, Math.max(0, (elapsed - i * STAGGER) / GROW));
        return 1 - (1 - x) ** 3;
      });
      busy = elapsed < GROW + STAGGER * 9;
    } else skyline.grow(() => 1);
    if (!reduced) {
      lean.x += (lean.tx - lean.x) * 0.08;
      stage.scene.rotation.y = lean.x;
      busy ||= Math.abs(lean.tx - lean.x) > 0.0004;
    }
    skyline.breathe(time / 1000);
    stage.render();
    if (!ready) {
      ready = true;
      onReady();
    }
    if (busy && onScreen && !document.hidden) frame = requestAnimationFrame(draw);
  };
  const invalidate = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const resize = new ResizeObserver(() => {
    stage.resize();
    invalidate();
  });
  resize.observe(canvas);
  stage.resize();

  const visible = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) invalidate();
  });
  visible.observe(canvas);

  const theme = new MutationObserver(() => {
    applyTheme();
    invalidate();
  });
  theme.observe(root, { attributes: true, attributeFilter: ['class'] });

  // the tower under the mouse
  const ray = new Raycaster();
  const pointer = new Vector2();
  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const box = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - box.left) / box.width) * 2 - 1, -(((e.clientY - box.top) / box.height) * 2 - 1));
    stage.scene.updateMatrixWorld();
    ray.setFromCamera(pointer, stage.camera);
    const hit = ray.intersectObjects(skyline.bodies, false)[0];
    const id = (hit?.object.userData.id as number | undefined) ?? null;
    if (id !== hovered) {
      hovered = id;
      canvas.style.cursor = id == null ? '' : 'pointer';
      onHover(id);
    }
  };
  const leave = () => {
    if (hovered !== null) {
      hovered = null;
      canvas.style.cursor = '';
      onHover(null);
    }
  };
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerleave', leave);

  // the block leans a few degrees towards the pointer
  const point = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || reduced) return;
    lean.tx = (e.clientX / window.innerWidth - 0.5) * 2 * 0.09;
    invalidate();
  };
  window.addEventListener('pointermove', point, { passive: true });

  skyline.setActive(null);
  invalidate();

  return {
    setActive(id) {
      skyline.setActive(id);
      invalidate();
    },
    dispose() {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visible.disconnect();
      theme.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointermove', point);
      stage.dispose();
    },
  };
}
