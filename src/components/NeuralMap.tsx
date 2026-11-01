"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Check, Flame, Skull, Zap } from "lucide-react";
import { MODULES, lessonPath, lessonsOf } from "@/content";
import { nextRank, rankFor } from "@/lib/gamification";
import { useProgress } from "./ProgressProvider";

const VIEW_W = 1000;
const NODE_TOP = 128;
const NODE_GAP = 88;
const NODE_R = 20;
const BOSS_R = 26;

const truncate = (s: string, n = 18) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

export default function NeuralMap({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { state, isCompleted, loading } = useProgress();

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);

  const xp = state?.learner.xp ?? 0;
  const streak = state?.learner.streak ?? 1;
  const rank = rankFor(xp);
  const upcoming = nextRank(xp);

  const layers = useMemo(() => {
    const xs = MODULES.map(
      (_, i) => 170 + i * ((VIEW_W - 340) / Math.max(1, MODULES.length - 1)),
    );
    return MODULES.map((mod, i) => {
      const list = lessonsOf(mod.slug);
      return {
        mod,
        x: xs[i],
        nodes: list.map((lesson, j) => ({
          lesson,
          done: isCompleted(lesson.slug),
          y: NODE_TOP + j * NODE_GAP,
        })),
      };
    });
  }, [isCompleted]);

  const nodes = layers.flatMap((l) =>
    l.nodes.map((n) => ({ ...n, x: l.x, mod: l.mod })),
  );

  const total = nodes.length;
  const cleared = nodes.filter((n) => n.done).length;
  const integrity = total > 0 ? Math.round((cleared / total) * 100) : 0;
  const nextNode = nodes.find((n) => !n.done);
  const preview =
    nodes.find((n) => n.lesson.slug === (focusedSlug ?? activeSlug)) ?? nextNode;

  const maxRows = Math.max(1, ...layers.map((l) => l.nodes.length));
  const viewH = NODE_TOP + (maxRows - 1) * NODE_GAP + 116;

  // Animated integrity counter
  const mv = useMotionValue(0);
  const spring = useSpring(useTransform(mv, (v) => `${Math.round(v)}`), {
    stiffness: 90,
    damping: 18,
  });
  useEffect(() => {
    const controls = animate(mv, integrity, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [integrity, mv]);

  const complete = !loading && total > 0 && cleared === total;

  return (
    <section
      className="sticker-lg overflow-hidden bg-paper text-ink"
      aria-label="Your AI learning network"
      aria-busy={loading}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="border-b-2 border-ink bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-vio">
              Your neural build
            </p>
            <h2 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Network integrity:{" "}
              <span className="relative inline-block px-1">
                <span className="absolute inset-0 -rotate-1 rounded-sm bg-lime" aria-hidden />
                <span className="relative">
                  <motion.span>{spring}</motion.span>%
                </span>
              </span>
            </h2>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
              {loading
                ? "syncing your build…"
                : upcoming
                  ? `${Math.max(0, upcoming.minXp - xp).toLocaleString()} XP to rank ${upcoming.name}`
                  : "top rank reached"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="chip bg-sun text-ink">
              <Zap className="size-3.5" strokeWidth={2.6} />
              {loading ? "—" : xp.toLocaleString()} XP
            </span>
            <span className="chip bg-white text-ink/70">{rank.name}</span>
            {streak > 1 && (
              <span className="chip bg-white text-ink/70">
                <Flame className="size-3.5 text-coral" strokeWidth={2.6} />
                {streak}-day streak
              </span>
            )}
          </div>
        </div>

        {/* overall bar */}
        <div className="mt-4 flex items-center gap-3">
          <div
            className="h-3.5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white"
            role="progressbar"
            aria-label="Lessons completed"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={loading ? undefined : integrity}
            aria-valuetext={loading ? "Loading" : `${cleared} of ${total} lessons`}
          >
            <div
              className="nn-fill h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
              style={{ width: `${loading ? 0 : integrity}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-ink/60">
            {loading ? "—" : `${cleared}/${total}`}
          </span>
        </div>

        {/* legend */}
        <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider text-ink/55">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full border-2 border-ink bg-white" /> dormant
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full border-2 border-ink bg-lime" /> firing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full border-2 border-ink bg-white ring-2 ring-sun" /> up next
          </span>
        </div>
      </div>

      {/* 100% banner */}
      {complete && (
        <div className="border-b-2 border-ink bg-lime px-5 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-ink">
          ⚡ network complete — you are the full stack human ⚡
        </div>
      )}

      {/* ── Map ────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${viewH}`}
          className="min-w-[760px] w-full"
          role="img"
          aria-label={`Neural network progress map, ${integrity}% complete`}
        >
          <defs>
            <pattern id="nn-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1.2" fill="#171321" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nn-dots)" />

          {/* edges */}
          {layers.slice(0, -1).flatMap((layer, li) =>
            layer.nodes.flatMap((a) =>
              layers[li + 1].nodes.map((b) => {
                const both = a.done && b.done;
                const started = a.done || b.done;
                const hot = activeSlug === a.lesson.slug || activeSlug === b.lesson.slug;
                const key = `${a.lesson.slug}-${b.lesson.slug}`;
                const x2 = layers[li + 1].x;

                if (both) {
                  return (
                    <g key={key}>
                      <line x1={layer.x} y1={a.y} x2={x2} y2={b.y} stroke="#171321" strokeWidth={hot ? 3 : 2.25} opacity={hot ? 1 : 0.85} />
                      <line
                        x1={layer.x} y1={a.y} x2={x2} y2={b.y}
                        stroke="#A9D418" strokeWidth={hot ? 3 : 2.25}
                        strokeDasharray="10 12" strokeLinecap="round"
                        className="nn-flow"
                      />
                    </g>
                  );
                }
                return (
                  <line
                    key={key}
                    x1={layer.x} y1={a.y} x2={x2} y2={b.y}
                    stroke={started ? (a.done ? layer.mod.color : layers[li + 1].mod.color) : "#171321"}
                    strokeWidth={hot ? 2.5 : 1.6}
                    opacity={hot ? 0.9 : started ? 0.45 : 0.1}
                  />
                );
              }),
            ),
          )}

          {/* column headers */}
          {layers.map((layer) => {
            const doneCount = layer.nodes.filter((n) => n.done).length;
            const pct = layer.nodes.length ? Math.round((doneCount / layer.nodes.length) * 100) : 0;
            const online = layer.nodes.length > 0 && doneCount === layer.nodes.length;
            return (
              <g key={layer.mod.slug} transform={`translate(${layer.x} 0)`}>
                <text y={42} textAnchor="middle" fontFamily="var(--f-mono), monospace" fontSize={11} fontWeight={700} letterSpacing={2.5} fill={layer.mod.color}>
                  {layer.mod.codename}
                </text>
                <text y={63} textAnchor="middle" fontFamily="var(--f-display), sans-serif" fontSize={16} fontWeight={800} fill="#171321">
                  {layer.mod.title}
                </text>
                {online ? (
                  <>
                    <rect x={-60} y={74} width={120} height={21} rx={10.5} fill="#C6F32E" stroke="#171321" strokeWidth={1.5} />
                    <text y={88} textAnchor="middle" fontFamily="var(--f-mono), monospace" fontSize={9} fontWeight={700} letterSpacing={1.5} fill="#171321">
                      LAYER ONLINE
                    </text>
                  </>
                ) : (
                  <text y={89} textAnchor="middle" fontFamily="var(--f-mono), monospace" fontSize={10} fontWeight={700} fill="#171321" opacity={0.45}>
                    {doneCount}/{layer.nodes.length} · {pct}%
                  </text>
                )}
              </g>
            );
          })}

          {/* nodes — outer <g> positions, inner <g> handles hover zoom so CSS transform never overrides the translate */}
          {layers.flatMap((layer) =>
            layer.nodes.map((n) => {
              const isNext = !loading && !n.done && n.lesson.slug === nextNode?.lesson.slug;
              const isActive = activeSlug === n.lesson.slug || focusedSlug === n.lesson.slug;
              const r = n.lesson.kind === "boss" ? BOSS_R : NODE_R;
              const go = () => router.push(lessonPath(n.lesson));
              return (
                <g key={n.lesson.slug} transform={`translate(${layer.x} ${n.y})`}>
                  <g
                    className="nn-zoom"
                    role="link"
                    tabIndex={0}
                    aria-label={`${n.lesson.title} — ${n.done ? "completed" : `${n.lesson.xp} XP`}`}
                    onClick={go}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go()}
                    onMouseEnter={() => setActiveSlug(n.lesson.slug)}
                    onMouseLeave={() => setActiveSlug(null)}
                    onFocus={() => setFocusedSlug(n.lesson.slug)}
                    onBlur={() => setFocusedSlug(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {isNext && (
                      <circle r={r + 11} fill="rgba(255,214,69,0.18)" stroke="#FFD645" strokeWidth={3} strokeDasharray="7 7" className="nn-spin" />
                    )}
                    {focusedSlug === n.lesson.slug && (
                      <circle r={r + 6} fill="none" stroke="#7B5CFF" strokeWidth={2.5} strokeDasharray="4 4" />
                    )}
                    <circle
                      r={r}
                      fill={n.done ? layer.mod.color : "#FFFFFF"}
                      stroke="#171321"
                      strokeWidth={2.5}
                      className="nn-node-body"
                    />
                    {n.done ? (
                      // perfectly centered by construction: path drawn around (0,0)
                      <path d="M -7.5 0 L -2.5 5.5 L 8 -6.5" fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                    ) : n.lesson.kind === "boss" ? (
                      <foreignObject x={-r * 0.62} y={-r * 0.62} width={r * 1.24} height={r * 1.24}>
                        <div className="flex h-full w-full items-center justify-center">
                          <Skull size={r * 0.85} className="text-ink/45" strokeWidth={2} />
                        </div>
                      </foreignObject>
                    ) : (
                      <text y={1} textAnchor="middle" dominantBaseline="central" fontFamily="var(--f-mono), monospace" fontSize={12} fontWeight={700} fill="#171321" opacity={0.55}>
                        {n.lesson.index + 1}
                      </text>
                    )}
                    <text
                      y={r + 17}
                      textAnchor="middle"
                      fontFamily="var(--f-mono), monospace"
                      fontSize={10}
                      fontWeight={700}
                      fill={n.done ? "#171321" : "#171321"}
                      opacity={n.done ? 0.85 : isNext ? 1 : 0.4}
                    >
                      {truncate(n.lesson.title)}
                    </text>
                    {isNext && (
                      <text y={-r - 14} textAnchor="middle" fontFamily="var(--f-mono), monospace" fontSize={9} fontWeight={700} letterSpacing={1.5} fill="#B8860B">
                        NEXT
                      </text>
                    )}
                  </g>
                </g>
              );
            }),
          )}

          {/* io caps */}
          <text x={30} y={viewH / 2} fontFamily="var(--f-mono), monospace" fontSize={10} fill="#171321" opacity={0.35} textAnchor="middle" transform={`rotate(-90 34 ${viewH / 2})`}>
            INPUT: YOU, DAY ONE
          </text>
          <text x={VIEW_W - 30} y={viewH / 2} fontFamily="var(--f-mono), monospace" fontSize={10} fill="#171321" opacity={0.35} textAnchor="middle" transform={`rotate(90 ${VIEW_W - 34} ${viewH / 2})`}>
            OUTPUT: FULL STACK HUMAN
          </text>
        </svg>
      </div>

      {/* ── Preview / CTA ──────────────────────────────────── */}
      {!compact && preview && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink bg-white p-4 sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-vio">
              {activeSlug || focusedSlug ? "lesson preview" : cleared > 0 ? "next connection" : "your first neuron"}
            </p>
            <p className="mt-1 truncate font-display text-xl font-extrabold text-ink">
              {preview.lesson.title}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink/50">
              {preview.mod.codename} — {preview.mod.title}
              {" · "}
              {preview.done ? "cleared · replay = 0 XP" : `${preview.lesson.xp} XP + combo bonus`}
              {isNextLabel(preview, nextNode) ? " · recommended" : ""}
            </p>
          </div>
          <Link href={lessonPath(preview.lesson)} className="btn btn-primary shrink-0">
            {preview.done ? "Review" : cleared > 0 ? "Continue" : "Start"} <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      {/* ── Accessible link strip ──────────────────────────── */}
      {!compact && (
        <div className="grid gap-4 border-t-2 border-ink bg-paper p-4 sm:grid-cols-3 sm:px-6">
          {layers.map((layer) => (
            <div key={layer.mod.slug}>
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: layer.mod.color }}>
                {layer.mod.codename} · {layer.mod.title}
              </p>
              <ul className="space-y-1">
                {layer.nodes.map((n) => (
                  <li key={n.lesson.slug}>
                    <Link
                      href={lessonPath(n.lesson)}
                      className="group flex items-center gap-2 text-xs font-medium text-ink/70 transition-colors hover:text-ink"
                    >
                      <span
                        className="size-2.5 shrink-0 rounded-full border border-ink"
                        style={{ backgroundColor: n.done ? layer.mod.color : "#fff" }}
                      />
                      <span className="transition-transform group-hover:translate-x-0.5">{n.lesson.title}</span>
                      {n.done && <Check className="size-3.5 text-[#2E7D0F]" strokeWidth={3} />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <p className="border-t border-ink/10 px-5 py-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 sm:px-6">
        every lesson you clear lights a neuron — progress saves in this browser
      </p>

      <style jsx>{`
        .nn-fill {
          background-color: #c6f32e;
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(23, 19, 33, 0.16) 0 8px,
            transparent 8px 16px
          );
          animation: nnstripes 0.9s linear infinite;
        }
        @keyframes nnstripes {
          to { background-position: 22.6px 0; }
        }
        .nn-flow { animation: nnflow 1s linear infinite; }
        @keyframes nnflow {
          to { stroke-dashoffset: -22; }
        }
        .nn-spin {
          transform-box: fill-box;
          transform-origin: center;
          animation: nnspin 7s linear infinite;
        }
        @keyframes nnspin {
          to { transform: rotate(360deg); }
        }
        .nn-zoom {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.15s ease;
          outline: none;
        }
        .nn-zoom:hover { transform: scale(1.13); }
        .nn-node-body {
          transition: filter 0.15s ease;
        }
        .nn-zoom:hover .nn-node-body {
          filter: drop-shadow(2.5px 3.5px 0 rgba(23, 19, 33, 0.9));
        }
        @media (prefers-reduced-motion: reduce) {
          .nn-fill, .nn-flow, .nn-spin { animation: none; }
          .nn-zoom { transition: none; }
          .nn-zoom:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}

function isNextLabel(
  node: { lesson: { slug: string } },
  nextNode: { lesson: { slug: string } } | undefined,
) {
  return !!nextNode && node.lesson.slug === nextNode.lesson.slug;
}
