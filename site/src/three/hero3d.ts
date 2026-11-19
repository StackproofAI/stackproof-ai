/**
 * Lazy 3D hero (desktop + capable GPU only; see motion/capability.ts).
 * The three layers are extruded separately from the approved SVG paths so they can
 * separate and press together. Scroll progress (heroState.press) drives:
 *   0 → layers apart, top layer unlit (steel)      1 → pressed together, top layer lime ("proven")
 * Hygiene: DPR ≤ 2, renders only while visible (IntersectionObserver + page visibility),
 * frame-time probe falls back to the SVG hero, full dispose on teardown / context loss.
 */
import {
  AmbientLight, Color, DirectionalLight, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial,
  PerspectiveCamera, Scene, WebGLRenderer, type BufferGeometry, type Material,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import markSvg from '../../brand/stackproof-mark.svg?raw';
import { heroState } from '../motion/heroState';

const LIME = new Color('#CEF949');
const STEEL = new Color('#75879A');
const UNLIT = new Color('#3A4250');
const VOID = new Color('#040508');

export function mountHero3D(host: HTMLElement, art: HTMLElement): () => void {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 10, 5000);
  camera.position.set(0, 0, 1900);

  scene.add(new AmbientLight(0xffffff, 1.1));
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-400, 600, 900);
  scene.add(key);
  const rim = new DirectionalLight(LIME, 0.9);
  rim.position.set(600, -300, -400);
  scene.add(rim);

  // ── Build layers from the master SVG ──
  const data = new SVGLoader().parse(markSvg);
  const byId = new Map<string, ReturnType<SVGLoader['parse']>['paths'][number]>();
  for (const p of data.paths) byId.set((p.userData?.node as Element | undefined)?.id ?? '', p);
  const geoms: BufferGeometry[] = [];
  const mats: Material[] = [];
  const extrude = (id: string, depth: number) => {
    const p = byId.get(id);
    if (!p) throw new Error(`hero3d: missing ${id}`);
    const g = new ExtrudeGeometry(p.toShapes(true), {
      depth, bevelEnabled: true, bevelThickness: 6, bevelSize: 4, bevelSegments: 3, curveSegments: 18,
    });
    geoms.push(g);
    return g;
  };
  const mat = (color: Color, rough = 0.42) => {
    const m = new MeshStandardMaterial({ color, roughness: rough, metalness: 0.08 });
    mats.push(m);
    return m;
  };

  const mark = new Group();
  // SVG space: y down, 780×656, centred → flip Y.
  mark.scale.set(1, -1, 1);
  mark.position.set(-390, 328, 0);
  const topMat = mat(UNLIT.clone());
  const layers = {
    bottom: new Mesh(extrude('layer-bottom', 36), mat(LIME.clone())),
    middle: new Mesh(extrude('layer-middle', 36), mat(STEEL.clone(), 0.55)),
    top: new Mesh(extrude('layer-top', 36), topMat),
  };
  const check = new Mesh(extrude('check', 10), mat(VOID.clone(), 0.7));
  check.position.z = 38; // sits on the top face
  layers.top.add(check);
  mark.add(layers.bottom, layers.middle, layers.top);
  const pivot = new Group();
  pivot.add(mark);
  pivot.scale.setScalar(0.92);
  scene.add(pivot);

  // ── Size ──
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // ── Loop (only while visible) ──
  let raf = 0, visible = true, running = false, t0 = performance.now();
  let probeFrames = 0, probeStart = 0, failed = false;
  const SPREAD = 70;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    const p = heroState.press;
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    // In SVG space y is down: top layer moves up (−y), bottom down (+y); depth separation in z.
    layers.top.position.set(0, -SPREAD * (1 - ease), 40 * (1 - ease));
    layers.bottom.position.set(0, SPREAD * (1 - ease), -40 * (1 - ease));
    topMat.color.copy(UNLIT).lerp(LIME, Math.min(1, Math.max(0, (p - 0.45) / 0.45)));
    topMat.emissive.copy(LIME).multiplyScalar(0.12 * Math.max(0, (p - 0.8) / 0.2));
    // slow idle rotation that settles as the stack is proven
    const sway = 1 - 0.7 * ease;
    pivot.rotation.y = Math.sin(t * 0.35) * 0.32 * sway;
    pivot.rotation.x = 0.12 + Math.sin(t * 0.27) * 0.06 * sway;
    renderer.render(scene, camera);

    // Frame-time probe over the first 40 frames: fall back to SVG if the GPU struggles.
    if (probeFrames < 40) {
      if (probeFrames === 5) probeStart = now;
      probeFrames++;
      if (probeFrames === 40 && (now - probeStart) / 35 > 22) { failed = true; teardown(); }
    }
  };
  const start = () => { if (!running && visible && !document.hidden) { running = true;  raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
  io.observe(host);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); teardown(); }, { once: true });

  // Reveal only once the first frame has rendered (no flash, no layout shift: canvas is absolutely positioned).
  requestAnimationFrame(() => requestAnimationFrame(() => { if (!failed) art.classList.add('is-3d'); }));
  start();

  function teardown() {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    art.classList.remove('is-3d');
    geoms.forEach((g) => g.dispose());
    mats.forEach((m) => m.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }
  return teardown;
}
