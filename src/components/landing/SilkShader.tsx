"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Domain-warped fbm noise, lit like folded silk (diffuse + tight specular sheen).
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
float field(vec2 p, float t){
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.6)), fbm(p + vec2(5.2, 1.3) - t * 0.4));
  vec2 r = vec2(fbm(p + 1.4 * q + vec2(1.7, 9.2) + t * 0.3), fbm(p + 1.4 * q + vec2(8.3, 2.8) - t * 0.2));
  return fbm(p + 1.4 * r);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0) * 1.0 + uMouse * 0.15;
  float t = uTime * 0.07;
  float e = 0.012;
  float f = field(p, t);
  float fx = field(p + vec2(e, 0.0), t) - f;
  float fy = field(p + vec2(0.0, e), t) - f;
  vec3 n = normalize(vec3(-fx / e * 0.16, -fy / e * 0.16, 1.0));
  vec3 l = normalize(vec3(0.5 + uMouse.x * 0.3, 0.7 + uMouse.y * 0.3, 0.8));
  float diff = clamp(dot(n, l), 0.0, 1.0);
  vec3 h = normalize(l + vec3(0.0, 0.0, 1.0));
  float spec = pow(clamp(dot(n, h), 0.0, 1.0), 28.0);

  vec3 deep = vec3(0.008, 0.05, 0.04);
  vec3 mid  = vec3(0.02, 0.24, 0.17);
  vec3 lite = vec3(0.2, 0.62, 0.46);
  vec3 col = mix(deep, mid, smoothstep(0.2, 0.8, f));
  col = mix(col, lite, smoothstep(0.6, 1.0, diff) * 0.4);
  col += spec * vec3(0.6, 0.95, 0.8) * 0.22;
  col *= mix(0.45, 1.0, smoothstep(0.0, 1.0, uv.x));
  col *= 1.0 - 0.5 * dot(uv - 0.5, uv - 0.5) * 1.6;
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/** Full-size animated silk background. Falls back to the CSS gradient behind it if WebGL is unavailable. */
export function SilkShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCALE = 0.5; // render at half resolution: silk is smooth, and it keeps the GPU cost low
    let raf = 0;
    let visible = true;
    let time = 3; // start on a pleasant frame
    let last = performance.now();
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.floor(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };

    const draw = () => {
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      time += (now - last) / 1000;
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduce || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    window.addEventListener("pointermove", onMove, { passive: true });
    draw();
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_10%,#0f8a5f_0%,#064e3b_45%,#03130e_100%)]", className)}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
