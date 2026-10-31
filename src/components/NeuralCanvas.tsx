"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
};

const COLORS = ["#7B5CFF", "#FF6B4A", "#43D9FF", "#C6F32E", "#FFD645", "#FF8BD1"];

/** Animated drifting neural network that reacts to the pointer. */
export default function NeuralCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let nodes: Node[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 2 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const LINK = 130;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = 1 - Math.sqrt(d2) / LINK;
            ctx.strokeStyle = `rgba(23,19,33,${alpha * 0.14})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // link to pointer
        const m = mouse.current;
        if (m) {
          const dx = a.x - m.x;
          const dy = a.y - m.y;
          const d2 = dx * dx + dy * dy;
          const R = 180;
          if (d2 < R * R) {
            const alpha = 1 - Math.sqrt(d2) / R;
            ctx.strokeStyle = `rgba(123,92,255,${alpha * 0.5})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10) n.x = w + 10;
        if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        if (n.y > h + 10) n.y = -10;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(23,19,33,0.7)";
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => (mouse.current = null);

    build();
    tick();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
