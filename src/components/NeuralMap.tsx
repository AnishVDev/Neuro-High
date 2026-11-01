"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Flame,
  Skull,
  Sparkles,
  Zap,
} from "lucide-react";
import { MODULES, lessonPath, lessonsOf } from "@/content";
import { BADGES, nextRank, rankFor } from "@/lib/gamification";
import { useProgress } from "./ProgressProvider";

const INK = "#171321";
const LIME = "#C6F32E";
const SUN = "#FFD645";

const SVG_W = 900;
const SVG_H = 520;
const COL_CENTERS = [150, 450, 750];

function rowYs(count: number): number[] {
  const top = 115;
  const bottom = 455;
  if (count <= 1) return [(top + bottom) / 2];
  return Array.from(
    { length: count },
    (_, i) => top + (i * (bottom - top)) / (count - 1),
  );
}

export default function NeuralMap({ compact = false }: { compact?: boolean }) {
  const { state, isCompleted, loading } = useProgress();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const xp = state?.learner.xp ?? 0;
  const streak = state?.learner.streak ?? 1;
  const badgeCount = state?.badges.length ?? 0;
  const rank = rankFor(xp);
  const upcoming = nextRank(xp);

  const rankPct = upcoming
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(((xp - rank.minXp) / (upcoming.minXp - rank.minXp)) * 100),
        ),
      )
    : 100;

  const layers = useMemo(
    () =>
      MODULES.map((mod, colIdx) => {
        const list = lessonsOf(mod.slug);
        const ys = rowYs(list.length);
        const nodes = list.map((lesson, rowIdx) => ({
          lesson,
          done: isCompleted(lesson.slug),
          x: COL_CENTERS[colIdx] ?? 450,
          y: ys[rowIdx] ?? 260,
        }));
        const clearedCount = nodes.filter((n) => n.done).length;
        return {
          mod,
          colIdx,
          x: COL_CENTERS[colIdx] ?? 450,
          nodes,
          clearedCount,
          isComplete: nodes.length > 0 && clearedCount === nodes.length,
        };
      }),
    [isCompleted],
  );

  const allNodes = useMemo(
    () =>
      layers.flatMap((l) =>
        l.nodes.map((n) => ({
          ...n,
          modTitle: l.mod.title,
          modCode: l.mod.codename,
          modColor: l.mod.color,
        })),
      ),
    [layers],
  );

  const totalCount = allNodes.length;
  const clearedCount = allNodes.filter((n) => n.done).length;
  const integrity = totalCount
    ? Math.round((clearedCount / totalCount) * 100)
    : 0;

  const nextUp = loading ? undefined : allNodes.find((n) => !n.done);
  const activeNode =
    allNodes.find((n) => n.lesson.slug === hoveredSlug) ??
    nextUp ??
    allNodes[0];

  // Build clean curved neural connections between adjacent columns
  const synapses = useMemo(() => {
    return layers.slice(0, -1).flatMap((layer, li) => {
      const nextLayer = layers[li + 1];
      const midX = (layer.x + nextLayer.x) / 2;

      return layer.nodes.flatMap((fromNode, fi) =>
        nextLayer.nodes
          .filter((_, ti) => Math.abs(ti - fi) <= 1)
          .map((toNode) => {
            const bothDone = fromNode.done && toNode.done;
            const oneDone = fromNode.done || toNode.done;
            const isHovered =
              hoveredSlug === fromNode.lesson.slug ||
              hoveredSlug === toNode.lesson.slug;

            return {
              id: `${fromNode.lesson.slug}->${toNode.lesson.slug}`,
              d: `M ${fromNode.x} ${fromNode.y} C ${midX} ${fromNode.y}, ${midX} ${toNode.y}, ${toNode.x} ${toNode.y}`,
              bothDone,
              oneDone,
              isHovered,
              color: layer.mod.color,
            };
          }),
      );
    });
  }, [layers, hoveredSlug]);

  return (
    <section
      className="sticker-lg overflow-hidden bg-paper text-ink"
      aria-label="Interactive Neural Skill Tree"
    >
      {/* ── TOP HERO BAR (Matches Homepage Neo-Brutalist Style) ── */}
      <div className="border-b-2 border-ink bg-cream p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          {/* Left: Headline + NOVA Copilot Bubble */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip bg-sun text-ink">
                <BrainCircuit className="size-3.5" /> Neural Skill Tree
              </span>
              <span className="chip bg-white text-ink">
                {clearedCount}/{totalCount} Neurons Lit
              </span>
              {streak > 1 && (
                <span className="chip bg-coral text-ink">
                  <Flame className="size-3.5" /> {streak} Day Streak
                </span>
              )}
            </div>

            <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              Wire up your{" "}
              <span className="inline-block bg-lime px-2">AI brain.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/75 sm:text-base">
              Every mission you pass fires a neuron and banks XP. Clear all 5
              missions in a column to energize that layer of your network.
            </p>

            {/* NOVA Copilot Callout */}
            <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border-2 border-ink bg-white p-3 shadow-[3px_3px_0_#171321]">
              <Image
                src="/img/nova-bot.png"
                alt="NOVA copilot"
                width={44}
                height={44}
                className="size-11 shrink-0 rounded-xl border-2 border-ink bg-vio/15 object-cover"
              />
              <div className="pr-2">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-vio">
                  NOVA // Tactical Readout
                </p>
                <p className="text-xs font-semibold text-ink sm:text-sm">
                  {loading
                    ? "Scanning your browser storage…"
                    : nextUp
                      ? `Next target: "${nextUp.lesson.title}" (+${nextUp.lesson.xp} XP)`
                      : "All 15 neurons firing! Full Stack Human achieved."}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Gamified Player HUD Sticker Card */}
          <div className="sticker bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                  Network Integrity
                </p>
                <p className="mt-1 font-display text-5xl font-extrabold leading-none tracking-tight text-ink">
                  <span className="bg-lime px-1.5">
                    {loading ? "—" : `${integrity}%`}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border-2 border-ink bg-sun px-3.5 py-2 text-right shadow-[2px_2px_0_#171321]">
                <p className="flex items-center justify-end gap-1 font-display text-2xl font-extrabold leading-none text-ink">
                  <Zap className="size-5 fill-ink" />
                  {loading ? "—" : xp.toLocaleString()}
                </p>
                <p className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/75">
                  Total XP
                </p>
              </div>
            </div>

            {/* Rank & Level Progress Bar */}
            <div className="mt-5 rounded-xl border-2 border-ink bg-paper p-3">
              <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
                <span className="text-vio">Rank: {rank.name}</span>
                <span className="text-ink/60">
                  {upcoming
                    ? `${upcoming.minXp - xp} XP to ${upcoming.name}`
                    : "MAX RANK"}
                </span>
              </div>
              <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full border-2 border-ink bg-white p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-vio via-aqua to-lime transition-all duration-500"
                  style={{ width: `${loading ? 0 : rankPct}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink/55">
                <span>{rank.tagline}</span>
                <span>
                  {badgeCount}/{BADGES.length} Badges
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LEGEND & QUICK LAUNCH BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-white px-5 py-3 sm:px-7">
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] font-bold uppercase tracking-wider text-ink/70">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-5 items-center justify-center rounded-full border-2 border-ink bg-vio text-white">
              <Check className="size-3" strokeWidth={3.5} />
            </span>
            Cleared
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-5 items-center justify-center rounded-full border-2 border-ink bg-lime font-mono text-[10px] text-ink">
              !
            </span>
            Next Target
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-5 items-center justify-center rounded-full border-2 border-ink bg-white font-mono text-[10px] text-ink">
              1
            </span>
            Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-5 items-center justify-center rounded-full border-2 border-ink bg-ink text-sun">
              <Skull className="size-3" />
            </span>
            Boss Fight
          </span>
        </div>

        {nextUp && (
          <Link
            href={lessonPath(nextUp.lesson)}
            className="btn btn-primary !py-2 !text-xs"
          >
            Continue: {nextUp.lesson.title} <ArrowRight className="size-4" />
          </Link>
        )}
      </div>

      {/* ── MAIN INTERACTIVE NEURAL NETWORK BOARD ── */}
      <div className="relative bg-paper p-5 sm:p-7">
        {/* Background SVG Synapse Cables (Visible on Desktop) */}
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          {synapses.map((s) => (
            <g key={s.id}>
              {/* Thick black casing for energized or hovered cables */}
              {(s.bothDone || s.isHovered) && (
                <path
                  d={s.d}
                  fill="none"
                  stroke={INK}
                  strokeWidth={s.isHovered ? 8 : 6}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {/* Inner colored signal line */}
              <path
                d={s.d}
                fill="none"
                stroke={
                  s.bothDone
                    ? LIME
                    : s.isHovered
                      ? SUN
                      : s.oneDone
                        ? s.color
                        : INK
                }
                strokeWidth={s.bothDone || s.isHovered ? 3.5 : s.oneDone ? 2.5 : 1.5}
                strokeOpacity={
                  s.bothDone || s.isHovered ? 1 : s.oneDone ? 0.55 : 0.16
                }
                strokeDasharray={s.bothDone ? "8 8" : s.oneDone ? "4 6" : undefined}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>

        {/* 3 Module Columns (Layers) */}
        <div className="relative z-10 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {layers.map((layer) => (
            <div
              key={layer.mod.slug}
              className="flex flex-col rounded-2xl border-2 border-ink bg-cream/90 p-4 shadow-[5px_5px_0_#171321] backdrop-blur-[2px]"
            >
              {/* Module Layer Header */}
              <div
                className="rounded-xl border-2 border-ink p-3.5 shadow-[3px_3px_0_#171321]"
                style={{ backgroundColor: layer.mod.color }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md border-2 border-ink bg-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                    {layer.mod.codename}
                  </span>
                  <span className="rounded-md border-2 border-ink bg-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-paper">
                    {layer.isComplete
                      ? "★ LAYER COMPLETE"
                      : `${layer.clearedCount}/${layer.nodes.length} CLEARED`}
                  </span>
                </div>

                <h3
                  className={`mt-2 font-display text-xl font-extrabold leading-tight ${
                    layer.colIdx === 0 ? "text-white" : "text-ink"
                  }`}
                >
                  {layer.mod.title}
                </h3>

                {/* Layer Mini Progress Pips */}
                <div className="mt-2.5 flex gap-1.5">
                  {layer.nodes.map((n) => (
                    <span
                      key={n.lesson.slug}
                      className="h-2 flex-1 rounded-full border border-ink"
                      style={{
                        backgroundColor: n.done ? LIME : "rgba(255,255,255,0.65)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Neuron Nodes List */}
              <ol className="mt-4 flex flex-col gap-3">
                {layer.nodes.map((node) => {
                  const { lesson, done } = node;
                  const isBoss = lesson.kind === "boss";
                  const isNext = nextUp?.lesson.slug === lesson.slug;
                  const isSelected = activeNode?.lesson.slug === lesson.slug;

                  return (
                    <li key={lesson.slug}>
                      <motion.div
                        whileHover={{ y: -2, x: -1 }}
                        whileTap={{ y: 1, x: 1 }}
                      >
                        <Link
                          href={lessonPath(lesson)}
                          onMouseEnter={() => setHoveredSlug(lesson.slug)}
                          onFocus={() => setHoveredSlug(lesson.slug)}
                          className={`group relative flex items-center gap-3.5 rounded-xl border-2 border-ink p-3 transition-colors ${
                            done
                              ? "bg-white shadow-[3px_3px_0_#171321]"
                              : isNext
                                ? "bg-lime shadow-[4px_4px_0_#171321]"
                                : isBoss
                                  ? "bg-ink text-paper shadow-[3px_3px_0_#171321]"
                                  : "bg-white/90 hover:bg-white shadow-[3px_3px_0_#171321]"
                          } ${isSelected ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""}`}
                        >
                          {/* PERFECTLY CENTERED NEURON CIRCLE (Flexbox, zero SVG offset) */}
                          <span
                            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink shadow-[2px_2px_0_#171321] transition-transform group-hover:scale-105"
                            style={{
                              backgroundColor: done
                                ? layer.mod.color
                                : isNext
                                  ? SUN
                                  : isBoss
                                    ? "#2A2438"
                                    : "#FFF6E9",
                              color:
                                done && layer.colIdx === 0
                                  ? "#FFFFFF"
                                  : isBoss && !done && !isNext
                                    ? SUN
                                    : INK,
                            }}
                          >
                            {done ? (
                              <Check className="size-5" strokeWidth={3.5} />
                            ) : isBoss ? (
                              <Skull className="size-5" strokeWidth={2.4} />
                            ) : (
                              <span className="font-mono text-sm font-bold leading-none">
                                0{lesson.index + 1}
                              </span>
                            )}
                          </span>

                          {/* Mission Title & Meta */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                                  isBoss && !done && !isNext
                                    ? "text-sun"
                                    : "text-ink/55"
                                }`}
                              >
                                {isBoss
                                  ? "Boss Fight"
                                  : `Mission 0${lesson.index + 1}`}
                              </span>
                              <span
                                className={`rounded border border-ink px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase ${
                                  done
                                    ? "bg-lime text-ink"
                                    : isNext
                                      ? "bg-white text-ink"
                                      : "bg-sun text-ink"
                                }`}
                              >
                                {done ? "Cleared" : `+${lesson.xp} XP`}
                              </span>
                            </div>

                            <p
                              className={`mt-0.5 font-display text-sm font-extrabold leading-snug ${
                                isBoss && !done && !isNext
                                  ? "text-paper"
                                  : "text-ink"
                              }`}
                            >
                              {lesson.title}
                            </p>
                          </div>

                          <ArrowRight
                            className={`size-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                              isBoss && !done && !isNext
                                ? "text-sun"
                                : "text-ink"
                            }`}
                          />

                          {isNext && (
                            <span className="absolute -right-2 -top-2.5 rotate-3 rounded-md border-2 border-ink bg-sun px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_#171321]">
                              Next Up
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM MISSION INSPECTOR / LAUNCHPAD ── */}
      {!compact && activeNode && (
        <div className="border-t-2 border-ink bg-ink px-5 py-4 text-paper sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
                <Sparkles className="size-3.5" />
                {hoveredSlug ? "Inspecting Neuron" : "Recommended Mission"} ·{" "}
                {activeNode.modCode} ({activeNode.modTitle})
              </div>
              <p className="mt-1 font-display text-xl font-extrabold text-paper">
                {activeNode.lesson.title}
              </p>
              <p className="mt-0.5 text-xs text-paper/70">
                {activeNode.lesson.subtitle} · {activeNode.lesson.minutes} min ·{" "}
                {activeNode.done
                  ? "Already cleared (replay for practice)"
                  : `Worth ${activeNode.lesson.xp} XP + combo bonus`}
              </p>
            </div>

            <Link
              href={lessonPath(activeNode.lesson)}
              className="btn btn-primary shrink-0"
            >
              {activeNode.done
                ? "Replay Mission"
                : activeNode.lesson.kind === "boss"
                  ? "Enter Boss Arena"
                  : "Launch Mission"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
