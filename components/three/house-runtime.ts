import { createStage, type Frame } from './stage';
import { buildHouse } from './house-model';

/**
 * What has to stay in view: the plinth turning on the spot (9.1 m across at its corners, and the shadow it throws) and the beacon above the roof.
 * The poster script and the page use the same frame, so the still and the live scene sit in the same place.
 */
export const HOUSE_FRAME: Frame = { width: 11.8, height: 10.4, centerY: 1.6 };

export interface Running {
  dispose(): void;
}

/**
 * Starts the house in `canvas`: a slow turn, a turn that follows the page's scroll when `scroll` is set, a damped lean
 * towards the pointer (mouse only, at most 6 degrees), and a beacon that breathes. It draws only while the canvas is on
 * screen and the tab is visible; under reduced motion it draws one still frame (and again when the size or theme changes).
 * Everything is released by `dispose`.
 */
export function mountHouse(canvas: HTMLCanvasElement, { scroll, onReady }: { scroll: boolean; onReady: () => void }): Running {
  const stage = createStage(canvas, HOUSE_FRAME);
  const house = buildHouse();
  stage.scene.add(house.group);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const night = () => root.classList.contains('dark');
  const applyTheme = () => {
    stage.setNight(night());
    house.setNight(night());
  };
  applyTheme();

  let onScreen = false;
  let frame = 0;
  let ready = false;
  const lean = { x: 0, y: 0, tx: 0, ty: 0 };
  const start = performance.now();

  const draw = (time: number) => {
    const seconds = (time - start) / 1000;
    if (!reduced) {
      lean.x += (lean.tx - lean.x) * 0.06;
      lean.y += (lean.ty - lean.y) * 0.06;
      house.group.rotation.y = seconds * 0.15 + (scroll ? window.scrollY * 0.004 : 0) + lean.x;
      house.group.rotation.x = lean.y;
      house.beacon.scale.setScalar(1.3 + 0.2 * Math.sin(seconds * 2.2));
    }
    stage.render();
    if (!ready) {
      ready = true;
      onReady();
    }
  };
  const loop = (time: number) => {
    draw(time);
    frame = requestAnimationFrame(loop);
  };
  const play = () => {
    if (reduced || frame || !onScreen || document.hidden) return;
    frame = requestAnimationFrame(loop);
  };
  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const once = () => requestAnimationFrame(draw);

  const resize = new ResizeObserver(() => {
    stage.resize();
    if (reduced || !frame) once();
  });
  resize.observe(canvas);
  stage.resize();

  const visible = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) play();
    else pause();
  });
  visible.observe(canvas);

  const theme = new MutationObserver(() => {
    applyTheme();
    if (reduced || !frame) once();
  });
  theme.observe(root, { attributes: true, attributeFilter: ['class'] });

  const hidden = () => (document.hidden ? pause() : play());
  document.addEventListener('visibilitychange', hidden);

  // the lean: where the pointer is in the window, from -1 to 1, at most 6 degrees of turn
  const point = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    lean.tx = (e.clientX / window.innerWidth - 0.5) * 2 * 0.105;
    lean.ty = (e.clientY / window.innerHeight - 0.5) * 2 * 0.05;
  };
  if (!reduced) window.addEventListener('pointermove', point, { passive: true });

  once();

  return {
    dispose() {
      pause();
      resize.disconnect();
      visible.disconnect();
      theme.disconnect();
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener('pointermove', point);
      stage.dispose();
    },
  };
}
