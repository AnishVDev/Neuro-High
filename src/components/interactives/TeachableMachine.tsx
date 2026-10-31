"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eraser, FlaskConical, HelpCircle, Sparkles } from "lucide-react";

type Pt = { x: number; y: number; cls: 0 | 1 };

const CLASSES = [
  { name: "ZORP", color: "#7B5CFF", emoji: "◆" },
  { name: "BLIP", color: "#FF6B4A", emoji: "●" },
];

function knnClassify(x: number, y: number, data: Pt[], k: number): { cls: 0 | 1 | null; conf: number } {
  if (data.length === 0) return { cls: null, conf: 0 };
  const dists = data
    .map((p) => ({ p, d: (p.x - x) ** 2 + (p.y - y) ** 2 }))
    .sort((a, b) => a.d - b.d)
    .slice(0, Math.min(k, data.length));
  let votes = 0;
  for (const d of dists) if (d.p.cls === 1) votes++;
  const cls = votes * 2 >= dists.length ? 1 : 0;
  const conf = cls === 1 ? votes / dists.length : 1 - votes / dists.length;
  return { cls, conf };
}

export default function TeachableMachine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<Pt[]>([
    { x: 0.22, y: 0.3, cls: 0 },
    { x: 0.3, y: 0.62, cls: 0 },
    { x: 0.72, y: 0.35, cls: 1 },
    { x: 0.78, y: 0.66, cls: 1 },
  ]);
  const [activeCls, setActiveCls] = useState<0 | 1>(0);
  const [mode, setMode] = useState<"train" | "test">("train");
  const [tests, setTests] = useState<{ x: number; y: number; pred: 0 | 1 | null; conf: number }[]>([]);

  const counts = useMemo(
    () => [data.filter((p) => p.cls === 0).length, data.filter((p) => p.cls === 1).length],
    [data],
  );

  const insight = useMemo(() => {
    const [a, b] = counts;
    if (a + b < 6) return "Feed the machine more examples — under 6 points, its guesses are shaky.";
    if (Math.abs(a - b) >= 6)
      return `Lopsided training: ${a > b ? "ZORP" : "BLIP"} dominates ${Math.max(a, b)}:${Math.min(
        a,
        b,
      )}. Watch the boundary swallow the minority class.`;
    if (a + b >= 14) return "Solid dataset. The boundary is stabilizing — this is what 'learning' looks like.";
    return "Keep going — balance matters as much as volume.";
  }, [counts]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = rect.width;
    const hgt = rect.height;
    canvas.width = w * dpr;
    canvas.height = hgt * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // decision regions
    const cell = 16;
    for (let cy = 0; cy < hgt; cy += cell) {
      for (let cx = 0; cx < w; cx += cell) {
        const { cls, conf } = knnClassify(cx / w, cy / hgt, data, 5);
        if (cls === null) continue;
        ctx.fillStyle = cls === 0 ? `rgba(123,92,255,${0.05 + conf * 0.1})` : `rgba(255,107,74,${0.05 + conf * 0.1})`;
        ctx.fillRect(cx, cy, cell, cell);
      }
    }

    // training points
    for (const p of data) {
      const x = p.x * w;
      const y = p.y * hgt;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = CLASSES[p.cls].color;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#171321";
      ctx.stroke();
    }

    // test points
    for (const t of tests) {
      const x = t.x * w;
      const y = t.y * hgt;
      if (t.pred === null) {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#171321";
        ctx.stroke();
        continue;
      }
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#171321";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = CLASSES[t.pred].color;
      ctx.fill();
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(x, y, 15 + (1 - t.conf) * 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(23,19,33,0.35)";
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [data, tests]);

  useEffect(() => {
    draw();
    const ro = new ResizeObserver(draw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [draw]);

  const onTap = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (mode === "train") {
      setData((d) => [...d.slice(-59), { x, y, cls: activeCls }]);
    } else {
      const { cls, conf } = knnClassify(x, y, data, 5);
      setTests((t) => [...t.slice(-14), { x, y, pred: cls, conf }]);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-ink bg-paper px-3 py-2.5">
        <div className="flex overflow-hidden rounded-lg border-2 border-ink">
          {([0, 1] as const).map((c) => (
            <button
              key={c}
              onClick={() => {
                setActiveCls(c);
                setMode("train");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeCls === c && mode === "train" ? "text-white" : "text-ink/60 hover:bg-ink/5"
              }`}
              style={activeCls === c && mode === "train" ? { backgroundColor: CLASSES[c].color } : undefined}
              aria-pressed={activeCls === c && mode === "train"}
            >
              <Sparkles className="size-3.5" /> Train {CLASSES[c].name} · {counts[c]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setMode("test")}
          className={`flex items-center gap-1.5 rounded-lg border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider ${
            mode === "test" ? "bg-sun text-ink" : "bg-white text-ink/60 hover:bg-ink/5"
          }`}
          aria-pressed={mode === "test"}
        >
          <FlaskConical className="size-3.5" /> Test mode
        </button>
        <button
          onClick={() => {
            setData([]);
            setTests([]);
          }}
          className="ml-auto flex items-center gap-1.5 rounded-lg border-2 border-ink bg-white px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink/60 hover:bg-coral hover:text-ink"
        >
          <Eraser className="size-3.5" /> Wipe
        </button>
      </div>

      {/* canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onPointerDown={onTap}
          className="block h-[340px] w-full cursor-crosshair touch-none bg-[#FBF7EE] sm:h-[380px]"
          role="img"
          aria-label="Interactive classifier training field. Click to place training examples."
        />
        <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-ink/20 bg-white/85 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink/70">
          {mode === "train"
            ? `Click anywhere → teach it a ${CLASSES[activeCls].name}`
            : "Click anywhere → ask it to classify a wild critter"}
        </div>
      </div>

      {/* readout */}
      <div className="flex items-start gap-2 border-t-2 border-ink bg-lime/25 px-3 py-2.5">
        <HelpCircle className="mt-0.5 size-4 shrink-0 text-ink/70" />
        <p className="text-xs leading-relaxed text-ink/80">{insight}</p>
      </div>
    </div>
  );
}
