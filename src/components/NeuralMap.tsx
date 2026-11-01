"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Skull, Zap } from "lucide-react";
import { MODULES, lessonPath, lessonsOf } from "@/content";
import { useProgress } from "./ProgressProvider";
import { rankFor } from "@/lib/gamification";

/**
 * Signature mechanic: your progress builds a neural network.
 * Each lesson is a neuron; each module is a layer.
 */

const VIEW_W = 1000;
const VIEW_H = 480;
const COL_X = [140, 500, 860];

function nodeYs(count: number): number[] {
  const top = 110;
  const bottom = 370;
  if (count === 1) return [(top + bottom) / 2];
  return Array.from({ length: count }, (_, i) => top + (i * (bottom - top)) / (count - 1));
}

export default function NeuralMap({ compact = false }: { compact?: boolean }) {
  const { state, isCompleted, loading } = useProgress();
  const xp = state?.learner.xp ?? 0;
  const rank = rankFor(xp);

  const layers = useMemo(
    () =>
      MODULES.map((m, li) => {
        const lessonList = lessonsOf(m.slug);
        const ys = nodeYs(lessonList.length);
        return {
          mod: m,
          x: COL_X[li],
          nodes: lessonList.map((lesson, i) => ({
            lesson,
            y: ys[i],
            done: isCompleted(lesson.slug),
          })),
        };
      }),
    [isCompleted],
  );

  const integrity = useMemo(() => {
    const all = layers.flatMap((l) => l.nodes);
    const done = all.filter((n) => n.done).length;
    return all.length ? Math.round((done / all.length) * 100) : 0;
  }, [layers]);

  const nextSlug = layers.flatMap((l) => l.nodes).find((n) => !n.done)?.lesson.slug;

  return (
    <div className="sticker-lg relative overflow-hidden bg-ink text-paper">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-aqua">
            Your neural build
          </p>
          <div className="mt-1 flex items-center gap-3">
            <div className="text-2xl font-extrabold tracking-tight">
              Network integrity: <span className="text-lime">{integrity}%</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-lime/30 bg-lime/5 px-4 py-2">
              <Zap className="size-4 text-lime" />
              <span className="font-mono text-sm font-bold text-lime">
                {loading ? "—" : xp.toLocaleString()}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-lime/60">
                XP · {rank.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 font-mono text-[10px] uppercase tracking-wider text-paper/50">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border border-paper/40 bg-paper/20" /> dormant
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-lime shadow-[0_0_12px_rgba(198,243,46,0.4)]" />
            firing
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mt-2 min-w-[720px] max-h-[480px] drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          role="img"
          aria-label={`Neural network progress map, ${integrity}% complete`}
        >
          <defs>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="gradNext" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD645" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* background grid */}
          <pattern id="grid" width="40" height="40" patternType="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,246,233,0.05)"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* inter-layer edges */}
          {layers.slice(0, 2).map((layer, li) =>
            layer.nodes.map((a) =>
              layers[li + 1].nodes.map((b) => {
                const bothDone = a.done && b.done;
                const sourceDone = a.done;
                return (
                  <line
                    key={`${a.lesson.slug}-${b.lesson.slug}`}
                    x1={layer.x}
                    y1={a.y}
                    x2={layers[li + 1].x}
                    y2={b.y}
                    stroke={
                      bothDone
                        ? "#C6F32E"
                        : sourceDone
                          ? layer.mod.color
                          : "rgba(255,246,233,0.06)"
                    }
                    strokeWidth={bothDone ? 2.5 : sourceDone ? 1.5 : 1}
                    strokeDasharray={bothDone ? "6 4" : undefined}
                    className={bothDone ? "nn-flow" : undefined}
                    opacity={bothDone ? 1 : sourceDone ? 0.45 : 0.12}
                  />
                );
              }),
            ),
          )}

          {/* nodes */}
          {layers.map((layer) => {
            const doneCount = layer.nodes.filter((n) => n.done).length;
            const total = layer.nodes.length;
            const moduleProgress = total ? Math.round((doneCount / total) * 100) : 0;

            return (
              <g key={layer.mod.slug}>
                {layer.nodes.map((n) => {
                  const isNext = n.lesson.slug === nextSlug && !n.done && !loading;
                  const r = n.lesson.kind === "boss" ? 24 : 18;
                  const iconSize = r * 0.65;

                  return (
                    <a key={n.lesson.slug} href={lessonPath(n.lesson)} className="no-underline">
                      <g className="cursor-pointer node-group">
                        {/* next-up pulse ring */}
                        {isNext && (
                          <circle
                            cx={layer.x}
                            cy={n.y}
                            r={r + 14}
                            fill="none"
                            stroke="url(#gradNext)"
                            strokeWidth={3}
                            strokeDasharray="10 8"
                            className="animate-ping"
                          />
                        )}

                        {/* node body */}
                        <circle
                          cx={layer.x}
                          cy={n.y}
                          r={r}
                          fill={
                            n.done
                              ? layer.mod.color
                              : isNext
                                ? "rgba(255,214,69,0.12)"
                                : "rgba(255,246,233,0.04)"
                          }
                          stroke={
                            n.done
                              ? layer.mod.color
                              : isNext
                                ? "#FFD645"
                                : "rgba(255,246,233,0.25)"
                          }
                          strokeWidth={n.done || isNext ? 3 : 2}
                          filter={n.done ? "url(#nodeGlow)" : undefined}
                          className="transition-all duration-200"
                        />

                        {/* centered icon / checkmark */}
                        {n.done ? (
                          <text
                            x={layer.x}
                            y={n.y + r * 0.05}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={r * 0.55}
                            fontWeight="900"
                            fill="white"
                            className="select-none"
                          >
                            ✔
                          </text>
                        ) : n.lesson.kind === "boss" ? (
                          <g transform={`translate(${layer.x - iconSize / 2}, ${n.y - iconSize / 2})`}>
                            <Skull
                              size={iconSize}
                              stroke="rgba(255,246,233,0.55)"
                              strokeWidth={2}
                            />
                          </g>
                        ) : (
                          <text
                            x={layer.x}
                            y={n.y + r * 0.05}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={12}
                            fontWeight="900"
                            fill="rgba(255,246,233,0.45)"
                            className="select-none"
                          >
                            {n.lesson.index + 1}
                          </text>
                        )}

                        {/* label */}
                        <text
                          x={layer.x}
                          y={n.y + r + 18}
                          textAnchor="middle"
                          fontSize={9}
                          fontFamily="monospace"
                          fontWeight={800}
                          fill={
                            n.done
                              ? "rgba(255,246,233,0.85)"
                              : isNext
                                ? "#FFD645"
                                : "rgba(255,246,233,0.35)"
                          }
                          className="uppercase tracking-wider"
                        >
                          {n.lesson.title.length > 18 ? n.lesson.title.slice(0, 17) + "…" : n.lesson.title}
                        </text>
                      </g>
                    </a>
                  );
                })}

                {/* column header + mini progress ring */}
                <g>
                  <text
                    x={layer.x}
                    y={36}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={900}
                    fontFamily="monospace"
                    fill={layer.mod.color}
                    letterSpacing={3}
                    className="uppercase"
                  >
                    {layer.mod.codename}
                  </text>
                  <text
                    x={layer.x}
                    y={54}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={900}
                    fill="rgba(255,246,233,0.9)"
                  >
                    {layer.mod.title}
                  </text>
                  <circle
                    cx={layer.x}
                    cy={30}
                    r={14}
                    fill="none"
                    stroke="rgba(255,246,233,0.1)"
                    strokeWidth={3}
                  />
                  <circle
                    cx={layer.x}
                    cy={30}
                    r={14}
                    fill="none"
                    stroke={layer.mod.color}
                    strokeWidth={3.5}
                    strokeDasharray={`${moduleProgress} 100`}
                    strokeDashoffset="25"
                    transform={`rotate(-90 ${layer.x} 30)`}
                    className="transition-all duration-700"
                  />
                  <text
                    x={layer.x}
                    y={34}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10}
                    fontWeight="900"
                    fill={layer.mod.color}
                  >
                    {moduleProgress}%
                  </text>
                </g>
              </g>
            );
          })}

          {/* io caps */}
          <text
            x={24}
            y={VIEW_H / 2}
            fontSize={10}
            fontFamily="monospace"
            fill="rgba(255,246,233,0.35)"
            textAnchor="middle"
            transform={`rotate(-90 30 ${VIEW_H / 2})`}
          >
            INPUT: YOU, DAY ONE
          </text>
          <text
            x={VIEW_W - 24}
            y={VIEW_H / 2}
            fontSize={10}
            fontFamily="monospace"
            fill="rgba(255,246,233,0.35)"
            textAnchor="middle"
            transform={`rotate(90 ${VIEW_W - 30} ${VIEW_H / 2})`}
          >
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
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {n.lesson.title}
                      </span>
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
          animation: nnflow 1s linear infinite;
        }
        @keyframes nnflow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .node-group:hover {
          filter: brightness(1.15);
        }
      `}</style>
    </div>
  );
}
