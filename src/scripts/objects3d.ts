// The stills as real objects. Each system's still is modelled in three.js with the same shape,
// a matte plaster finish and the same soft key light, and turns slowly about its vertical axis;
// the pointer leans it a few degrees. One WebGL renderer draws every visible object in turn and
// copies the frame into that still's own canvas, so the page holds a single GPU context however
// many stills it shows. The generated image stays as the first paint and as the fallback: with
// no WebGL, no JavaScript or reduced motion, nothing here runs and the still is what you see.
import type * as THREE_NS from "three";

type Three = typeof THREE_NS;
type Scheme = "dark" | "light";

interface Entry {
  figure: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  model: THREE_NS.Group;
  pivot: THREE_NS.Group;
  base: number;
  phase: number;
  speed: number;
  rock: boolean;
  visible: boolean;
  tiltX: number;
  tiltY: number;
  targetX: number;
  targetY: number;
}

const SIZE = 640; // internal render size; canvases scale it to their box
const TURN_SECONDS = 46; // one full turn
let THREE: Three | null = null;
let renderer: THREE_NS.WebGLRenderer | null = null;
let scene: THREE_NS.Scene | null = null;
let camera: THREE_NS.PerspectiveCamera | null = null;
let floor: THREE_NS.Mesh | null = null;
let materials: Record<string, THREE_NS.Material> = {};
let entries: Entry[] = [];
let observer: IntersectionObserver | null = null;
let raf = 0;
let scheme: Scheme = "dark";
let started = 0;

function currentScheme(): Scheme {
  const forced = document.documentElement.getAttribute("data-theme");
  if (forced === "light" || forced === "dark") return forced;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function grainTexture(T: Three): THREE_NS.Texture {
  // Fine plaster grain as a bump map: soft noise, tiled.
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const img = g.createImageData(256, 256);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + rand() * 40;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const tex = new T.CanvasTexture(c);
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  tex.repeat.set(5, 5);
  return tex;
}

function buildMaterials(T: Three, s: Scheme): void {
  const grain = (materials.plaster as THREE_NS.MeshStandardMaterial | undefined)?.bumpMap ?? grainTexture(T);
  Object.values(materials).forEach((m) => m.dispose());
  materials = {
    plaster: new T.MeshStandardMaterial({
      color: s === "dark" ? 0xe7e3db : 0x45433f,
      roughness: 0.94,
      metalness: 0,
      bumpMap: grain,
      bumpScale: 2.2,
    }),
    ring: new T.MeshBasicMaterial({ color: s === "dark" ? 0xffffff : 0xe2dfd8 }),
    glow: new T.MeshBasicMaterial({
      color: s === "dark" ? 0xffffff : 0xf3f1ec,
      transparent: true,
      opacity: s === "dark" ? 0.22 : 0.0,
      depthWrite: false,
      blending: T.AdditiveBlending,
    }),
    shadow: new T.ShadowMaterial({ opacity: s === "dark" ? 0.55 : 0.16 }),
  };
}

// ------------------------------------------------------------------ models
// Each builder returns a group in arbitrary units; normalise() centres and scales it so every
// object fills the same share of its square, as the stills do.

async function rounded(T: Three) {
  const mod = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
  return (w: number, h: number, d: number, r = 0.03) => new mod.RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2));
}

type Box = (w: number, h: number, d: number, r?: number) => THREE_NS.BufferGeometry;

function mesh(T: Three, geo: THREE_NS.BufferGeometry, mat = "plaster"): THREE_NS.Mesh {
  const m = new T.Mesh(geo, materials[mat]);
  m.castShadow = mat === "plaster";
  m.receiveShadow = mat === "plaster";
  m.userData.mat = mat;
  return m;
}

const MODELS: Record<string, (T: Three, box: Box) => THREE_NS.Group> = {
  // A seesaw: a plank on a square pyramid with a ball at each end, the left end raised.
  "cost-deep-dive": (T, box) => {
    const g = new T.Group();
    const fulcrum = mesh(T, new T.ConeGeometry(0.36, 0.52, 4, 1));
    fulcrum.rotation.y = Math.PI / 4;
    fulcrum.position.y = 0.26;
    g.add(fulcrum);
    const beam = new T.Group();
    beam.position.y = 0.54;
    beam.add(mesh(T, box(3.4, 0.06, 0.24, 0.02)));
    for (const x of [-1.5, 1.5]) {
      const ball = mesh(T, new T.SphereGeometry(0.2, 48, 32));
      ball.position.set(x, 0.23, 0);
      beam.add(ball);
    }
    beam.rotation.z = -0.07;
    beam.name = "beam";
    g.add(beam);
    return g;
  },
  // A thick ring with a narrow cut at the top, standing upright.
  "data-access-governance": (T) => {
    const g = new T.Group();
    const R = 1, r = 0.42, gap = 0.1;
    const ring = new T.Group();
    ring.add(mesh(T, new T.TorusGeometry(R, r, 64, 160, Math.PI * 2 - gap)));
    // Cap the two cut faces so the tube reads as solid.
    for (const a of [0, Math.PI * 2 - gap]) {
      const cap = mesh(T, new T.CircleGeometry(r, 64));
      cap.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
      const tangent = new T.Vector3(-Math.sin(a), Math.cos(a), 0).multiplyScalar(a === 0 ? -1 : 1);
      cap.lookAt(cap.position.clone().add(tangent));
      ring.add(cap);
    }
    ring.rotation.z = Math.PI / 2 + gap / 2 - 0.12;
    g.add(ring);
    return g;
  },
  // A straight flight of eight steps rising to the right.
  "data-foundation-plan": (T, box) => {
    const g = new T.Group();
    const n = 8, run = 0.34, rise = 0.15, depth = 1.0;
    for (let i = 0; i < n; i++) {
      const h = rise * (i + 1);
      const step = mesh(T, box(run + 0.002, h, depth, 0.015));
      step.position.set(i * run, h / 2, 0);
      g.add(step);
    }
    return g;
  },
  // A tetrahedron frame: a ball at each vertex, rods along the edges.
  "data-marts-core": (T) => {
    const g = new T.Group();
    const s = 1.3;
    const v = [
      new T.Vector3(0, s * 1.15, 0),
      new T.Vector3(-s, 0, -s * 0.58),
      new T.Vector3(s, 0, -s * 0.58),
      new T.Vector3(0, 0, s * 1.15),
    ];
    for (const p of v) {
      const ball = mesh(T, new T.SphereGeometry(0.16, 40, 28));
      ball.position.copy(p);
      g.add(ball);
    }
    const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]];
    for (const [a, b] of pairs) {
      const len = v[a].distanceTo(v[b]);
      const rod = mesh(T, new T.CylinderGeometry(0.06, 0.06, len, 24));
      rod.position.copy(v[a]).add(v[b]).multiplyScalar(0.5);
      rod.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), v[b].clone().sub(v[a]).normalize());
      g.add(rod);
    }
    return g;
  },
  // A grid of small blocks, most level, some raised a block or two.
  "enterprise-data-platform-migration": (T, box) => {
    const g = new T.Group();
    const n = 7, s = 0.26, gap = 0.035;
    let seed = 11;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const r = rand();
        const levels = r > 0.9 ? 3 : r > 0.72 ? 2 : 1;
        const h = s * levels;
        const b = mesh(T, box(s, h, s, 0.018));
        b.position.set((i - (n - 1) / 2) * (s + gap), h / 2, (j - (n - 1) / 2) * (s + gap));
        g.add(b);
      }
    }
    return g;
  },
  // One block.
  knowsee: (T, box) => {
    const g = new T.Group();
    const b = mesh(T, box(1.3, 1.3, 1.3, 0.05));
    b.position.y = 0.65;
    g.add(b);
    return g;
  },
  // A sphere with a lit band around its equator, the axis tipped so the band wobbles as it turns.
  orca: (T) => {
    const g = new T.Group();
    const body = new T.Group();
    body.add(mesh(T, new T.SphereGeometry(1, 128, 96)));
    body.add(mesh(T, new T.TorusGeometry(1.003, 0.011, 16, 220), "ring"));
    body.add(mesh(T, new T.TorusGeometry(1.004, 0.032, 16, 220), "glow"));
    body.rotation.x = Math.PI / 2;
    const tip = new T.Group();
    tip.rotation.z = 0.16;
    tip.add(body);
    tip.position.y = 1;
    g.add(tip);
    return g;
  },
  // Five thin plates stacked with a little air between, each turned a hair from the last.
  "orca-semantics": (T, box) => {
    const g = new T.Group();
    for (let i = 0; i < 5; i++) {
      const p = mesh(T, box(2.2, 0.075, 2.2, 0.02));
      p.position.y = 0.04 + i * 0.13;
      p.rotation.y = [0, 0.02, -0.015, 0.025, -0.01][i];
      g.add(p);
    }
    return g;
  },
  // Three bars: short, tall, middle.
  "orca-visuals": (T, box) => {
    const g = new T.Group();
    const bars: [number, number, number][] = [[-0.62, 0.95, 0.05], [0, 2.0, -0.05], [0.62, 1.4, 0.12]];
    for (const [x, h, z] of bars) {
      const b = mesh(T, box(0.38, h, 0.38, 0.015));
      b.position.set(x, h / 2, z);
      g.add(b);
    }
    return g;
  },
};

/** Centre the model on its own vertical axis, rest it on the floor and scale it so every object
 *  fills the same share of its square whichever way it faces. Returns the scaled height. */
// Solid masses read larger than open frames at the same size; these sit a little smaller.
const FILL: Record<string, number> = { knowsee: 0.78, "orca-visuals": 0.94, orca: 0.96 };

function normalise(T: Three, model: THREE_NS.Group, fill = 1): number {
  model.updateMatrixWorld(true);
  const box = new T.Box3().setFromObject(model);
  const centre = box.getCenter(new T.Vector3());
  // The widest the object gets as it turns: the furthest vertex from its vertical axis.
  let reach = 0;
  const v = new T.Vector3();
  model.traverse((o) => {
    const m = o as THREE_NS.Mesh;
    const pos = m.isMesh ? (m.geometry.getAttribute("position") as THREE_NS.BufferAttribute) : null;
    if (!pos) return;
    for (let i = 0; i < pos.count; i += 3) {
      v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
      reach = Math.max(reach, Math.hypot(v.x - centre.x, v.z - centre.z));
    }
  });
  const height = box.max.y - box.min.y;
  const scale = (1.62 * fill) / Math.max(height, reach * 1.7);
  model.position.set(-centre.x * scale, -box.min.y * scale, -centre.z * scale);
  model.scale.setScalar(scale);
  return height * scale;
}

// ------------------------------------------------------------------ rendering

function setupScene(T: Three): void {
  scene = new T.Scene();
  camera = new T.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 2.25, 6.4);
  camera.lookAt(0, 0.86, 0);
  const key = new T.DirectionalLight(0xffffff, 3.1);
  key.position.set(-1.4, 7, 2.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 10;
  key.shadow.bias = -0.0005;
  const cam = key.shadow.camera as THREE_NS.OrthographicCamera;
  cam.left = cam.bottom = -2.5;
  cam.right = cam.top = 2.5;
  cam.near = 1;
  cam.far = 14;
  scene.add(key);
  const rim = new T.DirectionalLight(0xffffff, 1.1);
  rim.position.set(3.5, 2.4, -4);
  scene.add(rim);
  scene.add(new T.HemisphereLight(0xffffff, 0x1c1b19, 0.38));
  floor = new T.Mesh(new T.PlaneGeometry(12, 12), materials.shadow);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.userData.mat = "shadow";
  scene.add(floor);
}

function applyScheme(): void {
  const next = currentScheme();
  if (!THREE || next === scheme) return;
  scheme = next;
  buildMaterials(THREE, scheme);
  scene?.traverse((o) => {
    const m = o as THREE_NS.Mesh;
    if (m.isMesh && m.userData.mat) m.material = materials[m.userData.mat];
  });
  entries.forEach((e) =>
    e.model.traverse((o) => {
      const m = o as THREE_NS.Mesh;
      if (m.isMesh && m.userData.mat) m.material = materials[m.userData.mat];
    }),
  );
  if (renderer) renderer.toneMappingExposure = scheme === "dark" ? 1.0 : 1.12;
}

function draw(now: number): void {
  if (!renderer || !scene || !camera) return;
  const t = (now - started) / 1000;
  let any = false;
  for (const e of entries) {
    if (!e.visible) continue;
    any = true;
    e.tiltX += (e.targetX - e.tiltX) * 0.08;
    e.tiltY += (e.targetY - e.tiltY) * 0.08;
    e.pivot.rotation.y = e.phase + (t * Math.PI * 2 * e.speed) / TURN_SECONDS + e.tiltY;
    e.pivot.rotation.x = e.tiltX;
    if (e.rock) {
      const beam = e.model.getObjectByName("beam");
      if (beam) beam.rotation.z = -0.07 + Math.sin(t * 0.55 + e.phase) * 0.05;
    }
    if (floor) floor.position.y = e.base;
    scene.add(e.pivot);
    renderer.render(scene, camera);
    scene.remove(e.pivot);
    e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
    e.ctx.drawImage(renderer.domElement, 0, 0, e.canvas.width, e.canvas.height);
    if (!e.figure.dataset.three) {
      e.figure.dataset.three = "on";
    }
  }
  raf = any && !document.hidden ? requestAnimationFrame(draw) : 0;
}

function kick(): void {
  if (!raf && entries.some((e) => e.visible)) raf = requestAnimationFrame(draw);
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

function teardown(): void {
  cancelAnimationFrame(raf);
  raf = 0;
  observer?.disconnect();
  entries.forEach((e) => e.model.traverse((o) => (o as THREE_NS.Mesh).geometry?.dispose()));
  entries = [];
}

export async function initObjects(): Promise<void> {
  teardown();
  const figures = [...document.querySelectorAll<HTMLElement>(".still[data-object]")];
  if (figures.length === 0) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!supportsWebGL()) return;

  THREE ??= await import("three");
  const T = THREE;
  const box = await rounded(T);
  if (!renderer) {
    scheme = currentScheme();
    buildMaterials(T, scheme);
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: "low-power" });
    renderer.setPixelRatio(1);
    renderer.setSize(SIZE, SIZE, false);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = scheme === "dark" ? 1.0 : 1.12;
    renderer.outputColorSpace = T.SRGBColorSpace;
    setupScene(T);
    const recheck = () => {
      applyScheme();
      kick();
    };
    new MutationObserver(recheck).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", recheck);
    document.addEventListener("visibilitychange", kick);
  } else {
    applyScheme();
  }
  started = performance.now();

  observer = new IntersectionObserver(
    (list) => {
      for (const it of list) {
        const e = entries.find((x) => x.figure === it.target);
        if (e) e.visible = it.isIntersecting;
      }
      kick();
    },
    { rootMargin: "120px 0px" },
  );

  figures.forEach((figure, i) => {
    const build = MODELS[figure.dataset.object ?? ""];
    if (!build) return;
    const model = build(T, box);
    const height = normalise(T, model, FILL[figure.dataset.object ?? ""] ?? 1);
    const pivot = new T.Group();
    pivot.add(model);
    // Every object's middle sits at the same height, so short ones are not left low in the frame.
    const base = 0.86 - height / 2;
    pivot.position.y = base;
    const canvas = document.createElement("canvas");
    const px = Math.round(Math.min(figure.clientWidth || 420, 420) * Math.min(window.devicePixelRatio || 1, 2));
    canvas.width = canvas.height = Math.max(px, 256);
    canvas.setAttribute("aria-hidden", "true");
    figure.appendChild(canvas);
    const entry: Entry = {
      figure,
      canvas,
      ctx: canvas.getContext("2d")!,
      model,
      pivot,
      base,
      phase: -0.5 + i * 1.3,
      speed: i % 2 === 0 ? 1 : -1,
      rock: figure.dataset.object === "cost-deep-dive",
      visible: false,
      tiltX: 0,
      tiltY: 0,
      targetX: 0,
      targetY: 0,
    };
    entries.push(entry);
    observer!.observe(figure);
    // The pointer leans the object a few degrees toward itself while it is over the row.
    const row = figure.closest<HTMLElement>(".still-row");
    if (row && window.matchMedia("(pointer: fine)").matches) {
      row.addEventListener("pointermove", (ev) => {
        const r = figure.getBoundingClientRect();
        const x = (ev.clientX - (r.left + r.width / 2)) / r.width;
        const y = (ev.clientY - (r.top + r.height / 2)) / r.height;
        entry.targetY = Math.max(-1, Math.min(1, x)) * 0.35;
        entry.targetX = Math.max(-1, Math.min(1, y)) * 0.12;
      }, { passive: true });
      row.addEventListener("pointerleave", () => {
        entry.targetX = entry.targetY = 0;
      });
    }
  });
  kick();
}

/**
 * The film's product shots (scripts/make_film.py). Builds one renderer at `size` in the dark scheme
 * and returns a function that draws a system's object, turned to `angle` radians, into a canvas.
 * The angle is the only input, so a frame seeked twice draws the same picture.
 */
export async function stageObjects(size: number): Promise<(slug: string, angle: number, target: HTMLCanvasElement) => void> {
  THREE ??= await import("three");
  const T = THREE;
  const box = await rounded(T);
  scheme = "dark";
  buildMaterials(T, scheme);
  const r = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1);
  r.setSize(size, size, false);
  r.setClearColor(0x000000, 0);
  r.shadowMap.enabled = true;
  r.shadowMap.type = T.PCFShadowMap;
  r.toneMapping = T.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.0;
  r.outputColorSpace = T.SRGBColorSpace;
  renderer = r;
  setupScene(T);
  const built = new Map<string, { pivot: THREE_NS.Group; base: number }>();
  return (slug, angle, target) => {
    let b = built.get(slug);
    if (!b) {
      const model = MODELS[slug](T, box);
      const height = normalise(T, model, FILL[slug] ?? 1);
      const pivot = new T.Group();
      pivot.add(model);
      b = { pivot, base: 0.86 - height / 2 };
      pivot.position.y = b.base;
      built.set(slug, b);
    }
    b.pivot.rotation.y = angle;
    if (floor) floor.position.y = b.base;
    scene!.add(b.pivot);
    r.render(scene!, camera!);
    scene!.remove(b.pivot);
    const ctx = target.getContext("2d")!;
    ctx.clearRect(0, 0, target.width, target.height);
    ctx.drawImage(r.domElement, 0, 0, target.width, target.height);
  };
}
