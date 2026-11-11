import {
  type Camera,
  DirectionalLight,
  MathUtils,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/** The part of the scene that has to stay in view, in metres: the plinth turning on the spot, with the tallest thing on it. */
export interface Frame {
  width: number;
  height: number;
  /** the height of the point the camera looks at */
  centerY: number;
}

export interface Stage {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  /** day light: soft and warm; night: dim and blue */
  setNight(night: boolean): void;
  /** match the canvas to its box (and the pixel density, up to 2) and frame the scene again */
  resize(): void;
  render(): void;
  dispose(): void;
}

/**
 * The studio shared by the 3D scenes: one soft key light from above, left and in front (the same light the UI is lit
 * by), a room-like environment for fill and reflections, neutral tone mapping so the pastels stay true, soft shadows.
 * The camera looks at the model from the front right and a little above, like a photo of an architect's scale model.
 */
export function createStage(canvas: HTMLCanvasElement, frame: Frame): Stage {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  // PCFSoftShadowMap is gone from three: PCFShadowMap is the soft one now, and `shadow.radius` widens its edge
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = environment.texture;
  pmrem.dispose();

  const key = new DirectionalLight(0xfff4ea, 3);
  key.position.set(-3.5, 9, 4.5);
  key.target.position.set(0, 1, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 5;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  // the model turns on the spot, so the shadow camera covers the whole plinth in every position
  Object.assign(key.shadow.camera, { left: -5.5, right: 5.5, top: 5.5, bottom: -5.5, near: 1, far: 22 });
  scene.add(key, key.target);

  const camera = new PerspectiveCamera(30, 1, 0.1, 80);

  const stage: Stage = {
    renderer,
    scene,
    camera,
    setNight(night) {
      key.color.set(night ? 0x9db4f0 : 0xfff4ea);
      key.intensity = night ? 1.7 : 3;
      scene.environmentIntensity = night ? 0.5 : 0.8;
    },
    resize() {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // distance at which the frame fits the canvas in both directions
      const t = Math.tan(MathUtils.degToRad(camera.fov / 2));
      const distance = Math.max(frame.height / 2 / t, frame.width / 2 / (t * camera.aspect));
      const [azimuth, elevation] = [MathUtils.degToRad(35), MathUtils.degToRad(25)];
      camera.position.set(
        Math.sin(azimuth) * Math.cos(elevation) * distance,
        frame.centerY + Math.sin(elevation) * distance,
        Math.cos(azimuth) * Math.cos(elevation) * distance,
      );
      camera.lookAt(0, frame.centerY, 0);
    },
    render() {
      renderer.render(scene, camera as Camera);
    },
    dispose() {
      scene.traverse((object) => {
        const item = object as { geometry?: { dispose(): void }; material?: unknown };
        item.geometry?.dispose();
        for (const material of [item.material].flat() as ({ dispose(): void; [k: string]: unknown } | undefined)[]) {
          if (!material) continue;
          for (const value of Object.values(material)) if (value && typeof (value as { dispose?: unknown }).dispose === 'function' && (value as { isTexture?: boolean }).isTexture) (value as { dispose(): void }).dispose();
          material.dispose();
        }
      });
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
  stage.setNight(false);
  return stage;
}
