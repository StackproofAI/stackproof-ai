/**
 * Lazy 3D hero (desktop + capable GPU only; see motion/capability.ts).
 * The five blocks of the mark are extruded separately from the master SVG so they can
 * spread apart and assemble. Scroll progress (heroState.press) drives:
 *   0 → blocks apart, staggered in depth      1 → assembled, lime middle block glowing ("proven")
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

const LIME = new Color('#C6FF00');
const WHITE = new Color('#F4F7FA');

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

  // ── Build the five blocks from the master SVG ──
  const data = new SVGLoader().parse(markSvg);
  const byId = new Map<string, ReturnType<SVGLoader['parse']>['paths'][number]>();
  for (const p of data.paths) byId.set((p.userData?.node as Element | undefined)?.id ?? '', p);
  const geoms: BufferGeometry[] = [];
  const mats: Material[] = [];
  const extrude = (id: string, depth: number) => {
    const p = byId.get(id);
    if (!p) throw new Error(`hero3d: missing ${id}`);
    const g = new ExtrudeGeometry(p.toShapes(), {
      depth, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.5, bevelSegments: 3, curveSegments: 18,
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
  // SVG space: y down, 200×200, centred → flip Y.
  mark.scale.set(1, -1, 1);
  mark.position.set(-100, 100, 0);
  const middleMat = mat(LIME.clone(), 0.38);
  const DIRS: Record<string, [number, number, number]> = { left: [-1, 0, 0.6], top: [0, -1, -0.6], right: [1, 0, -0.6], bottom: [0, 1, 0.6], middle: [0, 0, 1.4] };
  const blocks = (['left', 'top', 'right', 'bottom', 'middle'] as const).map((id) => {
    const m = new Mesh(extrude(`block-${id}`, 18), id === 'middle' ? middleMat : mat(WHITE.clone(), 0.5));
    mark.add(m);
    return { m, dir: DIRS[id] };
  });
  const pivot = new Group();
  pivot.add(mark);
  pivot.scale.setScalar(2.3); // sits inside the verification ring (same footprint as the SVG mark)
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
  const SPREAD = 26;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    const p = heroState.press;
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    // In SVG space y is down; blocks start out along their own direction (and in depth), then assemble.
    const k = 1 - ease;
    for (const b of blocks) b.m.position.set(b.dir[0] * SPREAD * k, b.dir[1] * SPREAD * k, b.dir[2] * 30 * k);
    middleMat.emissive.copy(LIME).multiplyScalar(0.22 * Math.max(0, (p - 0.7) / 0.3));
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
    canvas.remove();
  }
  return teardown;
}
