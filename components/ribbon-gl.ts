/**
 * FITA DOURADA — WebGL (OGL). Uma fita em S (o S do monograma) feita de uma
 * tira de triângulos que ondula, torce e brilha com gradiente metálico.
 * Carregado sob demanda só no hero; pausa fora da viewport.
 */
import { Renderer, Camera, Program, Mesh, Geometry, Transform } from "ogl";

const vertex = /* glsl */ `
precision highp float;
attribute vec2 position; // x = t (0..1 ao longo da fita), y = lado (-1..1)
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uTime;
uniform vec2 uMouse;   // em coordenadas locais da fita
uniform float uHover;
uniform float uWidth;
varying float vT;
varying float vSide;
varying vec3 vNormal;
varying vec3 vViewPos;

#define PI 3.14159265

vec3 sCurve(float t) {
  vec3 p;
  if (t < 0.5) {
    float a = mix(0.28, 1.5 * PI, t / 0.5);
    p = vec3(cos(a) * 1.18, 1.0 + sin(a), 0.0);
  } else {
    float a = mix(0.5 * PI, -PI + 0.28, (t - 0.5) / 0.5);
    p = vec3(cos(a) * 1.18, -1.0 + sin(a), 0.0);
  }
  // ondulação orgânica
  p.x += 0.07 * sin(uTime * 0.7 + t * 9.0);
  p.y += 0.05 * sin(uTime * 0.55 + t * 7.0);
  p.z += 0.38 * sin(t * PI * 2.0 + uTime * 0.45);
  return p;
}

vec3 deform(vec3 p, out float f) {
  vec2 d = p.xy - uMouse;
  float dist2 = dot(d, d);
  f = exp(-dist2 * 2.4) * uHover;
  p.z += f * 0.9;
  p.xy += normalize(d + 1e-4) * f * 0.22;
  return p;
}

void main() {
  float t = position.x;
  float side = position.y;
  float e = 0.0025;
  float f0, f1, f2;
  vec3 c = deform(sCurve(t), f0);
  vec3 cA = deform(sCurve(clamp(t - e, 0.0, 1.0)), f1);
  vec3 cB = deform(sCurve(clamp(t + e, 0.0, 1.0)), f2);
  vec3 T = normalize(cB - cA + vec3(1e-5));
  vec3 N = normalize(vec3(-T.y, T.x, 0.0));
  vec3 B = normalize(cross(T, N));

  float twist = 0.35 + 0.95 * sin(t * PI * 3.0 + uTime * 0.6) + f0 * 2.2;
  vec3 D = cos(twist) * N + sin(twist) * B;

  float taper = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.95, t);
  float w = uWidth * (0.82 + 0.18 * sin(t * PI)) * taper;
  vec3 pos = c + D * w * side;

  vNormal = normalize(normalMatrix * normalize(cross(T, D)));
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vViewPos = mv.xyz;
  vT = t;
  vSide = side;
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uOpacity;
varying float vT;
varying float vSide;
varying vec3 vNormal;
varying vec3 vViewPos;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(-vViewPos);
  if (dot(n, v) < 0.0) n = -n; // iluminação dos dois lados da fita
  vec3 l1 = normalize(vec3(0.35, 0.65, 1.0));
  vec3 l2 = normalize(vec3(-0.7, -0.3, 0.6));

  float diff = 0.18 + max(dot(n, l1), 0.0) * 0.72 + max(dot(n, l2), 0.0) * 0.3;
  float spec = pow(max(dot(n, normalize(l1 + v)), 0.0), 48.0);
  float spec2 = pow(max(dot(n, normalize(l2 + v)), 0.0), 24.0) * 0.4;
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.5);

  vec3 dark = vec3(0.42, 0.31, 0.1);
  vec3 mid = vec3(0.79, 0.635, 0.294);   // #C9A24B
  vec3 light = vec3(0.94, 0.835, 0.54);  // #F0D58A
  vec3 white = vec3(1.0, 0.965, 0.85);

  vec3 col = mix(dark, mid, clamp(diff + fres * 0.35, 0.0, 1.0));
  col = mix(col, light, clamp(spec * 1.2 + spec2, 0.0, 1.0));
  col += white * spec * 0.35;

  // fios escovados ao longo da fita
  col *= 0.94 + 0.06 * sin(vSide * 34.0);

  // brilho que percorre a fita
  float band = fract(vT * 0.9 - uTime * 0.09);
  float sweep = smoothstep(0.06, 0.0, abs(band - 0.5));
  col += light * sweep * 0.32;

  // bordas levemente mais escuras (volume)
  col *= mix(0.72, 1.0, smoothstep(1.0, 0.7, abs(vSide)));

  float a = smoothstep(0.0, 0.04, vT) * smoothstep(1.0, 0.96, vT) * uOpacity;
  gl_FragColor = vec4(col, a);
}
`;

export type RibbonHandle = {
  destroy: () => void;
  setVisible: (v: boolean) => void;
};

type Opts = {
  /** 0..1 — progresso da rolagem do hero (a fita gira e sobe). */
  getProgress: () => number;
};

export function createRibbon(container: HTMLElement, { getProgress }: Opts): RibbonHandle | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 1.75),
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  if (!gl) return null;
  gl.clearColor(0, 0, 0, 0);
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  container.appendChild(canvas);

  const camera = new Camera(gl, { fov: 30 });
  camera.position.set(0, 0, 9);
  const scene = new Transform();

  const SEG = 420;
  const pos = new Float32Array((SEG + 1) * 4);
  const idx = new Uint16Array(SEG * 6);
  for (let i = 0; i <= SEG; i++) pos.set([i / SEG, -1, i / SEG, 1], i * 4);
  for (let i = 0; i < SEG; i++) {
    const a = i * 2;
    idx.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], i * 6);
  }
  const geometry = new Geometry(gl, {
    position: { size: 2, data: pos },
    index: { data: idx },
  });

  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    cullFace: null,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: [10, 10] },
      uHover: { value: 0 },
      uWidth: { value: 0.2 },
      uOpacity: { value: 0 },
    },
  });

  const mesh = new Mesh(gl, { geometry, program, frustumCulled: false });
  mesh.setParent(scene);

  let aspect = 1;
  let baseScale = 1;
  const resize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    aspect = w / h;
    camera.perspective({ aspect });
    baseScale = aspect < 0.8 ? 0.62 : aspect < 1.2 ? 0.85 : 1.08;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // cursor / giroscópio
  const target = { x: 0, y: 0, hover: 0 };
  const cur = { x: 0, y: 0, hover: 0 };
  const onMove = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    target.hover = 1;
  };
  const onLeave = () => {
    target.hover = 0;
  };
  const onTilt = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    target.x = Math.max(-1, Math.min(1, e.gamma / 30));
    target.y = Math.max(-1, Math.min(1, (45 - e.beta) / 30));
    target.hover = 0.8;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  window.addEventListener("deviceorientation", onTilt, { passive: true });

  let raf = 0;
  let visible = true;
  let running = false;
  let last = performance.now();
  let time = 0;
  let fadeIn = 0;
  const born = performance.now();

  const halfH = Math.tan(((30 / 2) * Math.PI) / 180) * 9;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // timestamps do rAF podem ser anteriores ao performance.now() do start()
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
    last = now;
    time += dt;
    fadeIn = Math.min(1, Math.max(0, (now - born) / 1400));

    cur.x += (target.x - cur.x) * 0.06;
    cur.y += (target.y - cur.y) * 0.06;
    cur.hover += (target.hover - cur.hover) * 0.04;

    const p = getProgress();
    const scale = baseScale * (1 + p * 0.55);
    const rotZ = -0.24 + p * 0.5 + cur.x * 0.06;
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.set(cur.y * 0.18 - p * 0.3, cur.x * 0.32 + p * 1.6, rotZ);
    mesh.position.set(aspect < 0.8 ? 0.15 : 0.35, p * 1.4, 0);

    // mouse do mundo → espaço local aproximado da fita
    const wx = cur.x * halfH * aspect - mesh.position.x;
    const wy = cur.y * halfH - mesh.position.y;
    const c = Math.cos(-rotZ);
    const s = Math.sin(-rotZ);
    program.uniforms.uMouse.value = [(wx * c - wy * s) / scale, (wx * s + wy * c) / scale];
    program.uniforms.uHover.value = cur.hover;
    program.uniforms.uTime.value = time;
    program.uniforms.uOpacity.value = (aspect < 0.8 ? 0.5 : 1) * fadeIn * Math.max(0, 1 - p * 1.25);

    renderer.render({ scene, camera });
  };

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !document.hidden) start();
    else stop();
  });
  io.observe(container);
  const onVis = () => (document.hidden || !visible ? stop() : start());
  document.addEventListener("visibilitychange", onVis);
  start();

  return {
    setVisible(v: boolean) {
      visible = v;
      if (v) start();
      else stop();
    },
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onTilt);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
}
