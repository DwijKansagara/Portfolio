import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** A toroidal point field, rendered without WebGL or external assets. */
export default function ParticleSculpture({
  paused,
  light,
}: {
  paused: boolean;
  light: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const ctx = element.getContext("2d");
    if (!ctx) return;
    let width = 1,
      height = 1,
      frame = 0,
      t = phase.current,
      visible = true,
      last = 0;
    let px = 0,
      py = 0,
      mx = 0,
      my = 0;
    const points: { x: number; y: number; z: number; hue: number }[] = [];
    for (let i = 0; i < 145; i++) {
      const u = (i / 145) * Math.PI * 2;
      for (let j = 0; j < 42; j++) {
        const v = (j / 42) * Math.PI * 2;
        const twist = v + u * 1.5;
        const r = 1.02 + 0.37 * Math.cos(twist);
        points.push({
          x: r * Math.cos(u),
          y: r * Math.sin(u),
          z: 0.37 * Math.sin(twist),
          hue: (Math.sin(u + v) + 1) / 2,
        });
      }
    }
    function draw(timestamp: number) {
      if (!ctx || !element) return;
      if (visible && !document.hidden && timestamp - last > 30) {
        const dt = Math.min(timestamp - last, 60);
        last = timestamp;
        if (!paused && !reduced) {
          t += dt * 0.00015;
          phase.current = t;
        }
        mx += (px - mx) * 0.055;
        my += (py - my) * 0.055;
        ctx.clearRect(0, 0, width, height);
        const a = -0.55 + (reduced ? 0 : my * 0.25),
          b = 0.55 + t + (reduced ? 0 : mx * 0.25);
        const ca = Math.cos(a),
          sa = Math.sin(a),
          cb = Math.cos(b),
          sb = Math.sin(b);
        const size = Math.min(width, height) * 0.285;
        const projected = points
          .map((p) => {
            const x = p.x * cb + p.z * sb,
              z = -p.x * sb + p.z * cb;
            return {
              x,
              y: p.y * ca - z * sa,
              z: p.y * sa + z * ca,
              hue: p.hue,
            };
          })
          .sort((a, b) => a.z - b.z);
        for (const p of projected) {
          const perspective = 4 / (4 - p.z),
            depth = (p.z + 1.4) / 2.8;
          const x = width / 2 + p.x * size * perspective,
            y = height / 2 + p.y * size * perspective;
          ctx.fillStyle = light
            ? `rgba(${30 + p.hue * 35},${72 + p.hue * 25},30,${0.15 + depth * 0.8})`
            : `rgba(${150 + p.hue * 83},${173 + p.hue * 72},${105 + (1 - p.hue) * 70},${0.15 + depth * 0.85})`;
          ctx.beginPath();
          ctx.arc(x, y, (0.55 + depth * 0.8) * perspective, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!paused && !reduced) frame = requestAnimationFrame(draw);
    }
    const resize = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      element.width = width * dpr;
      element.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (paused || reduced) {
        last = 0;
        draw(performance.now());
      }
    });
    resize.observe(element);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && (paused || reduced)) {
        last = 0;
        draw(performance.now());
      }
    });
    intersection.observe(element);
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      px = (event.clientX - rect.left) / rect.width - 0.5;
      py = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const leave = () => {
      px = 0;
      py = 0;
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    draw(performance.now());
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, [paused, light, reduced]);
  return (
    <canvas
      ref={canvas}
      className="particle-canvas"
      role="img"
      aria-label="An animated sculpture of thousands of lime particles twisting into an orbit"
    />
  );
}
