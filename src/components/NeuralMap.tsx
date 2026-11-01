"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Skull } from "lucide-react";
import { MODULES, lessonPath, lessonsOf } from "@/content";
import { useProgress } from "./ProgressProvider";
import { Check, Skull, Zap } from "lucide-react";
import { rankFor } from "@/lib/gamification";

/**
 * The signature mechanic: your progress literally builds a neural network.
 * Each lesson is a neuron; each module is a layer. Complete lessons light nodes
 * and energize the connections between layers.
 */

const VIEW_W = 940;
const VIEW_H = 400;
const COL_X = [130, 470, 810];

function nodeYs(count: number): number[] {
  const top = 80;
  const bottom = 330;
  if (count === 1) return [(top + bottom) / 2];
  return Array.from({ length: count }, (_, i) => top + (i * (bottom - top)) / (count - 1));
}

export default function NeuralMap({ compact = false }: { compact?: boolean }) {
  const { state, isCompleted, loading } = useProgress();
  const xp = state?.learner.xp ?? 0;
  const rank = rankFor(xp);

  const layers = useMemo(
    () =>
      MODULES.map((m, li) => ({
        mod: m,
        x: COL_X[li],
        nodes: lessonsOf(m.slug).map((lesson, i) => ({
          lesson,
          y: nodeYs(lessonsOf(m.slug).length)[i],
          done: isCompleted(lesson.slug),
        })),
      })),
    [isCompleted],
  );

  // Announce pulses on edges whose endpoints are both lit
  const integrity = useMemo(() => {
    const all = layers.flatMap((l) => l.nodes);
    const done = all.filter((n) => n.done).length;
    return Math.round((done / all.length) * 100);
  }, [layers]);

  // "Next up" = first uncompleted node across layers (by module order)
  const nextSlug = layers.flatMap((l) => l.nodes).find((n) => !n.done)?.lesson.slug;

  return (
    <div className="sticker-lg relative overflow-hidden bg-ink text-paper">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-aqua">Your neural build</p>
          <p className="mt-1 font-display text-2xl font-extrabold tracking-tight">
            Network integrity: <span className="text-lime">{integrity}%</span>
          </p>
          <p className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/10 px-2.5 py-1 font-bold text-lime">
              <Zap className="size-3.5" /> {loading ? "—" : xp.toLocaleString()} XP
            </span>
            <span>{loading ? "syncing…" : rank.name}</span>
          </p>
        </div>
        <div className="flex gap-3 font-mono text-[10px] uppercase tracking-wider text-paper/50">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border border-paper/40 bg-paper/20" /> dormant
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-lime" /> firing
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mt-2 min-w-[680px]"
          role="img"
          aria-label={`Neural network progress map, ${integrity}% complete`}
        >
          {/* inter-layer edges */}
          {layers.slice(0, 2).map((layer, li) =>
            layer.nodes.map((a) =>
              layers[li + 1].nodes.map((b) => {
                const lit = a.done && b.done;
                return (
                  <line
                    key={`${a.lesson.slug}-${b.lesson.slug}`}
                    x1={layer.x}
                    y1={a.y}
                    x2={layers[li + 1].x}
                    y2={b.y}
                    stroke={lit ? "#C6F32E" : "rgba(255,246,233,0.13)"}
                    strokeWidth={lit ? 1.6 : 1}
                    strokeDasharray={lit ? "5 5" : undefined}
                    className={lit ? "nn-flow" : undefined}
                  />
                );
              }),
            ),
          )}

          {/* nodes */}
          {layers.map((layer) => (
            <g key={layer.mod.slug}>
              {layer.nodes.map((n) => {
                const isNext = n.lesson.slug === nextSlug;
                const r = n.lesson.kind === "boss" ? 26 : 19;
                return (
                  <g key={n.lesson.slug}>
                    {isNext && !loading && (
                      <circle cx={layer.x} cy={n.y} r={r + 9} fill="none" stroke="#FFD645" strokeWidth={2} strokeDasharray="4 6" className="nn-pulse-ring" />
                    )}
                    <circle
                      cx={layer.x}
                      cy={n.y}
                      r={r}
                      fill={n.done ? layer.mod.color : "rgba(255,246,233,0.07)"}
                      stroke={n.done ? layer.mod.color : "rgba(255,246,233,0.35)"}
                      strokeWidth={2}
                    />
                    {n.done ? (
                      <foreignObject x={layer.x - r / 1.6} y={n.y - r / 1.6} width={r * 1.4} height={r * 1.4}>
                        <Check className="size-[70%] text-white" strokeWidth={3.2} />
                      </foreignObject>
                    ) : n.lesson.kind === "boss" ? (
                      <foreignObject x={layer.x - r / 1.9} y={n.y - r / 1.9} width={r * 1.15} height={r * 1.15}>
                        <Skull className="size-[80%] text-paper/50" strokeWidth={2.2} />
                      </foreignObject>
                    ) : (
                      <text
                        x={layer.x}
                        y={n.y + 4}
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontSize={11}
                        fontWeight={700}
                        fill="rgba(255,246,233,0.5)"
                      >
                        {n.lesson.index + 1}
                      </text>
                    )}
                    {/* label */}
                    <text
                      x={layer.x}
                      y={n.y + r + 16}
                      textAnchor="middle"
                      fontSize={9.5}
                      fontFamily="monospace"
                      fill={n.done ? "rgba(255,246,233,0.85)" : "rgba(255,246,233,0.4)"}
                    >
                      {n.lesson.title.length > 22 ? n.lesson.title.slice(0, 21) + "…" : n.lesson.title}
                    </text>
                  </g>
                );
              })}
              {/* column label */}
              <text x={layer.x} y={34} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={layer.mod.color} letterSpacing={2}>
                {layer.mod.codename}
              </text>
              <text x={layer.x} y={50} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="rgba(255,246,233,0.85)">
                {layer.mod.title}
              </text>
            </g>
          ))}

          {/* io caps */}
          <text x={24} y={205} fontSize={10} fontFamily="monospace" fill="rgba(255,246,233,0.4)" transform="rotate(-90 30 205)">
            INPUT: YOU, DAY ONE
          </text>
          <text x={VIEW_W - 14} y={205} fontSize={10} fontFamily="monospace" fill="rgba(255,246,233,0.4)" transform="rotate(90 916 205)">
            OUTPUT: FULL STACK HUMAN
          </text>
        </svg>
      </div>

      {/* clickable node strip (accessible navigation) */}
      {!compact && (
        <div className="grid gap-2 border-t border-paper/15 bg-paper/5 p-4 sm:grid-cols-3">
          {layers.map((layer) => (
            <div key={layer.mod.slug}>
              <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper/45">
                {layer.mod.title}
              </p>
              <ul className="space-y-1">
                {layer.nodes.map((n) => (
                  <li key={n.lesson.slug}>
                    <Link
                      href={lessonPath(n.lesson)}
                      className="group flex items-center gap-2 text-xs text-paper/70 transition-colors hover:text-paper"
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: n.done ? layer.mod.color : "rgba(255,246,233,0.25)" }}
                      />
                      <span className="group-hover:translate-x-0.5 transition-transform">{n.lesson.title}</span>
                      {n.done && <Check className="size-3 text-lime" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="px-5 pb-4 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/35"
      >
        every lesson you clear lights a neuron — finish a module to energize a full layer
      </motion.p>

      <style jsx>{`
        .nn-flow {
          animation: nnflow 0.9s linear infinite;
        }
        @keyframes nnflow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .nn-pulse-ring {
          animation: nnring 2s ease-in-out infinite;
        }
        @keyframes nnring {
          0%, 100% {
            opacity: 0.9;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
