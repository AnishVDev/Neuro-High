"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, Check, Skull, Sparkles, Zap } from "lucide-react";
import { MODULES, lessonPath, lessonsOf } from "@/content";
import { nextRank, rankFor } from "@/lib/gamification";
import { useProgress } from "./ProgressProvider";

/**
 * Your progress builds a neural network: each mission is a neuron, each module
 * is a layer. Styled to match the rest of NEURO//HIGH (cream + ink + stickers).
 */

const INK = "#171321";
const LIME = "#C6F32E";
const SUN = "#FFD645";

const MAP_W = 1000; // virtual width for the connection lines
const FIRST_Y = 160; // y of the first node's centre
const ROW_GAP = 118;
const WRAP = 68; // node footprint (px)

function hintFor(cleared: number, total: number) {
  if (total === 0) return "";
  if (cleared === 0) return "Every network starts dark. Clear your first mission to light a neuron.";
  if (cleared === total) return "Every neuron is lit. Full stack human, confirmed.";
  if (cleared / total < 0.5) return "Signal's building. Keep wiring.";
  return "Past halfway. The network is humming.";
}

const edgeWeight = (e: { source: { done: boolean }; target: { done: boolean } }) =>
  e.source.done && e.target.done ? 2 : e.source.done || e.target.done ? 1 : 0;

export default function NeuralMap({ compact = false }: { compact?: boolean }) {
  const { state, isCompleted, loading } = useProgress();
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const xp = state?.learner.xp ?? 0;
  const rank = rankFor(xp);
  const upcoming = nextRank(xp);
  const rankPct = upcoming
    ? Math.round(((xp - rank.minXp) / (upcoming.minXp - rank.minXp)) * 100)
    : 100;

  const layers = useMemo(
    () =>
      MODULES.map((mod, i) => {
        const nodes = lessonsOf(mod.slug).map((lesson, j) => ({
          lesson,
          done: isCompleted(lesson.slug),
          y: FIRST_Y + j * ROW_GAP,
        }));
        const count = nodes.filter((n) => n.done).length;
        return {
          mod,
          x: ((i + 0.5) / MODULES.length) * MAP_W,
          nodes,
          count,
          full: nodes.length > 0 && count === nodes.length,
        };
      }),
    [isCompleted],
  );

  const allNodes = layers.flatMap((l) => l.nodes.map((n) => ({ ...n, moduleTitle: l.mod.title })));
  const total = allNodes.length;
  const cleared = allNodes.filter((n) => n.done).length;
  const integrity = total ? Math.round((cleared / total) * 100) : 0;

  const nextNode = loading ? undefined : allNodes.find((n) => !n.done);
  const activeSlug = focused ?? hovered;
  const preview = allNodes.find((n) => n.lesson.slug === activeSlug) ?? nextNode ?? allNodes[0];

  const maxRows = Math.max(1, ...layers.map((l) => l.nodes.length));
  const mapH = FIRST_Y + (maxRows - 1) * ROW_GAP + 96;

  // Decorative connections between neighbouring layers (not prerequisites).
  const edges = layers
    .slice(0, -1)
    .flatMap((layer, li) => {
      const target = layers[li + 1];
      const mid = (layer.x + target.x) / 2;
      return layer.nodes.flatMap((source, si) => {
        const aligned = Math.round(
          (si / Math.max(1, layer.nodes.length - 1)) * Math.max(0, target.nodes.length - 1),
        );
        return target.nodes
          .filter((_, ti) => Math.abs(ti - aligned) <= 1)
          .map((t) => ({
            source,
            target: t,
            color: layer.mod.color,
            d: `M ${layer.x} ${source.y} C ${mid} ${source.y}, ${mid} ${t.y}, ${target.x} ${t.y}`,
          }));
      });
    })
    .sort((a, b) => edgeWeight(a) - edgeWeight(b)); // lit cables paint on top

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="sticker-lg relative overflow-hidden bg-paper text-ink"
        aria-label="Your neural build"
        aria-busy={loading}
      >
        {/* ── Header: big stat + rank card ───────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-6 p-5 sm:p-7">
          <div className="min-w-0">
            <span className="chip bg-sun text-ink">
              <Sparkles className="size-3.5" aria-hidden /> Your neural build
            </span>
            <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ink/55">
              Network integrity
            </p>
            <p className="mt-1 font-display text-6xl font-extrabold leading-none tracking-tight sm:text-7xl">
              <span className="relative z-0 inline-block px-1">
                <span aria-hidden className="absolute inset-x-0 bottom-1 -z-10 h-[38%] bg-lime" />
                {loading ? "—" : `${integrity}%`}
              </span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
              <strong className="text-ink">{loading ? "…" : cleared}</strong> of {total} neurons firing.{" "}
              {!loading && hintFor(cleared, total)}
            </p>
          </div>

          <div className="sticker w-full bg-white p-4 sm:w-72">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-sun">
                <Zap className="size-5 text-ink" strokeWidth={2.5} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-display text-2xl font-extrabold leading-none text-ink">
                  {loading ? "—" : xp.toLocaleString()} XP
                </p>
                <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wider text-vio">
                  {loading ? "syncing…" : `Rank · ${rank.name}`}
                </p>
              </div>
            </div>
            <div className="mt-3 h-3 rounded-full border-2 border-ink bg-paper p-[1.5px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-vio via-blush to-sun transition-[width] duration-700 motion-reduce:transition-none"
                style={{ width: `${loading ? 0 : rankPct}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ink/55">
              {loading
                ? " "
                : upcoming
                  ? `${Math.max(0, upcoming.minXp - xp).toLocaleString()} XP to ${upcoming.name}`
                  : "Max rank. Singularity achieved."}
            </p>
          </div>
        </div>

        {/* ── Action row ─────────────────────────────────────────── */}
        {!compact && (
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 pb-5 sm:px-7">
            {nextNode ? (
              <Link href={lessonPath(nextNode.lesson)} className="btn btn-primary">
                {cleared > 0 ? "Continue your build" : "Start your build"}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : !loading && total > 0 ? (
              <span className="chip bg-lime text-ink">
                <Zap className="size-3.5" aria-hidden /> Network complete
              </span>
            ) : (
              <span />
            )}

            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/60">
              <li className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-full border-2 border-ink bg-vio" /> cleared
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-full border-2 border-ink bg-white" /> open
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-full border-2 border-ink bg-lime" /> up next
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-full border-2 border-ink bg-ink" /> boss
              </li>
            </ul>
          </div>
        )}

        {/* ── The network ────────────────────────────────────────── */}
        <div
          className="nnm-board border-y-2 border-ink bg-cream"
          style={{ "--map-h": `${mapH}px` } as CSSProperties}
        >
          {/* layer lanes (desktop only) */}
          {layers.map((layer, i) => (
            <div
              key={`lane-${layer.mod.slug}`}
              aria-hidden
              className={`nnm-lane${layer.full ? " is-full" : ""}`}
              style={
                {
                  "--left": `${(i / layers.length) * 100}%`,
                  "--w": `${100 / layers.length}%`,
                  "--c": layer.mod.color,
                } as CSSProperties
              }
            />
          ))}

          {/* connections (desktop only, decorative) */}
          <svg
            className="nnm-svg"
            viewBox={`0 0 ${MAP_W} ${mapH}`}
            preserveAspectRatio="none"
            aria-hidden
            focusable="false"
          >
            {edges.map((e) => {
              const hot =
                activeSlug === e.source.lesson.slug || activeSlug === e.target.lesson.slug;
              const both = e.source.done && e.target.done;
              const some = e.source.done || e.target.done;
              return (
                <g key={`${e.source.lesson.slug}>${e.target.lesson.slug}`}>
                  {both && (
                    <path
                      d={e.d}
                      fill="none"
                      stroke={INK}
                      strokeWidth={6}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  <path
                    d={e.d}
                    fill="none"
                    stroke={both ? LIME : hot || some ? e.color : INK}
                    strokeWidth={both ? 3 : hot ? 3 : some ? 2.5 : 1.5}
                    strokeOpacity={both || hot ? 1 : some ? 0.75 : 0.16}
                    strokeLinecap="round"
                    strokeDasharray={both ? "8 10" : undefined}
                    vectorEffect="non-scaling-stroke"
                    className={both ? "nnm-flow" : undefined}
                  />
                </g>
              );
            })}
          </svg>

          {/* layers + nodes (real links, keyboard accessible) */}
          {layers.map((layer, layerIndex) => (
            <div
              key={layer.mod.slug}
              className="nnm-layer rounded-2xl border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#171321] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none"
              style={
                {
                  "--left": `${(layerIndex / layers.length) * 100}%`,
                  "--w": `${100 / layers.length}%`,
                } as CSSProperties
              }
            >
              <div className="pb-3 md:px-3 md:pb-0 md:pt-6 md:text-center">
                <span className="chip text-ink" style={{ backgroundColor: layer.mod.color }}>
                  {layer.mod.codename}
                </span>
                <h3 className="mt-2 font-display text-xl font-extrabold leading-tight tracking-tight text-ink">
                  {layer.mod.title}
                </h3>
                <div className="mt-2 flex items-center gap-2 md:justify-center">
                  <div className="flex gap-1" aria-hidden>
                    {layer.nodes.map((n) => (
                      <span
                        key={n.lesson.slug}
                        className="h-2 w-5 rounded-full border border-ink/50"
                        style={{ backgroundColor: n.done ? layer.mod.color : "#fff" }}
                      />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/60">
                    {layer.full && <Zap className="size-3" aria-hidden />}
                    {loading ? "…" : layer.full ? "Layer energized" : `${layer.count}/${layer.nodes.length} cleared`}
                  </span>
                </div>
              </div>

              <ol className="m-0 grid list-none gap-1 p-0 md:block">
                {layer.nodes.map((node) => {
                  const slug = node.lesson.slug;
                  const isBoss = node.lesson.kind === "boss";
                  const isNext = nextNode?.lesson.slug === slug;

                  let bg = "#FFFFFF";
                  let fg = INK;
                  if (node.done) bg = layer.mod.color;
                  else if (isBoss) {
                    bg = INK;
                    fg = isNext ? LIME : SUN;
                  } else if (isNext) bg = LIME;

                  const iconSize = isBoss ? "size-7" : "size-6";
                  const kindLabel = isBoss ? "Boss fight" : `Mission 0${node.lesson.index + 1}`;

                  return (
                    <li
                      key={slug}
                      className="nnm-node"
                      style={{ "--top": `${node.y - WRAP / 2}px` } as CSSProperties}
                    >
                      <Link
                        href={lessonPath(node.lesson)}
                        onMouseEnter={() => setHovered(slug)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setFocused(slug)}
                        onBlur={() => setFocused(null)}
                        aria-label={`${node.lesson.title}. ${kindLabel}. ${
                          node.done ? "Cleared" : `${node.lesson.xp} XP plus combo bonus`
                        }${isNext ? ". Up next" : ""}`}
                        className="nnm-link flex items-center gap-3 rounded-2xl py-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ink md:w-full md:flex-col md:items-center md:gap-2 md:py-0"
                      >
                        <span className="nnm-wrap">
                          {isNext && <span aria-hidden className="nnm-halo" />}
                          {isNext && <span aria-hidden className={`nnm-ring${isBoss ? " is-boss" : ""}`} />}

                          <motion.span
                            className={`nnm-orb${isBoss ? " is-boss" : ""}`}
                            style={{ backgroundColor: bg, color: fg }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{
                              type: "spring",
                              stiffness: 320,
                              damping: 18,
                              delay: layerIndex * 0.12 + node.lesson.index * 0.06,
                            }}
                          >
                            {node.done ? (
                              <Check className={iconSize} strokeWidth={3.5} aria-hidden />
                            ) : isBoss ? (
                              <Skull className={iconSize} strokeWidth={2.4} aria-hidden />
                            ) : (
                              <span className="font-display text-lg font-extrabold leading-none" aria-hidden>
                                {node.lesson.index + 1}
                              </span>
                            )}
                          </motion.span>

                          {isNext && (
                            <span
                              aria-hidden
                              className="absolute -right-5 -top-1 z-10 rotate-6 rounded-md border-2 border-ink bg-sun px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_#171321]"
                            >
                              Next
                            </span>
                          )}
                        </span>

                        <span className="min-w-0 flex-1 md:flex-none">
                          <span
                            className={`block font-display text-[15px] font-bold leading-tight text-ink md:max-w-[240px] md:rounded-lg md:border-2 md:border-ink md:px-2 md:py-1 md:text-center md:text-[12.5px] md:shadow-[2px_2px_0_#171321] ${
                              isNext ? "md:bg-sun" : "md:bg-white"
                            }`}
                          >
                            {node.lesson.title}
                          </span>
                          <span className="mt-0.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-ink/55 md:hidden">
                            {kindLabel} · {node.done ? "Cleared" : `${node.lesson.xp} XP`}
                          </span>
                        </span>

                        <ArrowRight className="size-4 shrink-0 text-ink/40 md:hidden" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>

        {!compact && (
          <>
            <p className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45 sm:px-7">
              Every mission you clear lights a neuron · finish a module to energize a layer · nothing is locked ·
              progress saves in this browser
            </p>

            {/* ── Scanner bar: follows hover / focus ──────────────── */}
            {!loading && preview && (
              <div className="border-t-2 border-ink bg-ink text-paper">
                <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-7">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
                      <span className="size-2.5 animate-pulse rounded-full bg-lime" />
                      {activeSlug ? "Scanning node" : nextNode ? "Next target" : "Network online"}
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold">{preview.lesson.title}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-paper/60">
                      {preview.moduleTitle} ·{" "}
                      {preview.lesson.kind === "boss" ? "Boss fight" : `Mission 0${preview.lesson.index + 1}`} ·{" "}
                      {preview.lesson.minutes} min ·{" "}
                      {preview.done ? "Cleared · replays pay 0 XP" : `${preview.lesson.xp} XP + combo`}
                    </p>
                  </div>
                  <Link
                    href={lessonPath(preview.lesson)}
                    className={
                      preview.done
                        ? "btn !border-paper bg-transparent text-paper !shadow-[3px_3px_0_rgba(255,246,233,0.35)]"
                        : "btn btn-primary"
                    }
                  >
                    {preview.done ? "Replay mission" : preview.lesson.kind === "boss" ? "Start boss fight" : "Open mission"}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        <style>{CSS}</style>
      </section>
    </MotionConfig>
  );
}

const CSS = `
.nnm-board {
  position: relative;
  display: grid;
  gap: 16px;
  padding: 16px;
  background-image: radial-gradient(rgba(23,19,33,0.13) 1px, transparent 1px);
  background-size: 20px 20px;
}
.nnm-lane, .nnm-svg { display: none; }

.nnm-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: ${WRAP}px;
  height: ${WRAP}px;
  flex-shrink: 0;
  transition: transform 160ms ease;
}
.nnm-orb {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border: 2.5px solid ${INK};
  border-radius: 9999px;
  box-shadow: 3px 3px 0 ${INK};
  transition: box-shadow 160ms ease;
}
.nnm-orb.is-boss { width: 62px; height: 62px; }

.nnm-link:hover .nnm-wrap,
.nnm-link:focus-visible .nnm-wrap { transform: translate(-2px, -3px); }
.nnm-link:hover .nnm-orb,
.nnm-link:focus-visible .nnm-orb { box-shadow: 6px 7px 0 ${INK}; }
.nnm-link:active .nnm-wrap { transform: translate(1px, 1px); }
.nnm-link:active .nnm-orb { box-shadow: 1px 1px 0 ${INK}; }

.nnm-ring {
  position: absolute;
  inset: 3px;
  z-index: 2;
  border: 3px dashed ${INK};
  border-radius: 9999px;
  pointer-events: none;
  animation: nnm-spin 9s linear infinite;
}
.nnm-ring.is-boss { inset: 0; }
.nnm-halo {
  position: absolute;
  inset: -10px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(198,243,46,0.75), rgba(198,243,46,0) 68%);
  animation: nnm-halo 2s ease-in-out infinite;
}
.nnm-flow { animation: nnm-flow 1s linear infinite; }

@keyframes nnm-spin { to { transform: rotate(360deg); } }
@keyframes nnm-halo { 0%, 100% { opacity: 0.55; transform: scale(0.92); } 50% { opacity: 1; transform: scale(1.08); } }
@keyframes nnm-flow { to { stroke-dashoffset: -36; } }

@media (min-width: 768px) {
  .nnm-board { display: block; height: var(--map-h); padding: 0; }
  .nnm-svg { display: block; position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
  .nnm-lane {
    display: block;
    position: absolute;
    top: 14px;
    bottom: 14px;
    left: calc(var(--left) + 10px);
    width: calc(var(--w) - 20px);
    border: 2px dashed rgba(23,19,33,0.22);
    border-radius: 28px;
    background: color-mix(in srgb, var(--c) 13%, transparent);
    pointer-events: none;
    transition: background 400ms ease, box-shadow 400ms ease;
  }
  .nnm-lane.is-full {
    border: 2px solid ${INK};
    background: color-mix(in srgb, var(--c) 26%, transparent);
    box-shadow: 4px 4px 0 ${INK};
  }
  .nnm-layer { position: absolute; top: 0; bottom: 0; left: var(--left); width: var(--w); }
  .nnm-node { position: absolute; top: var(--top); left: 0; right: 0; margin-inline: auto; width: min(240px, 92%); }
}

@media (prefers-reduced-motion: reduce) {
  .nnm-ring, .nnm-halo, .nnm-flow { animation: none; }
  .nnm-wrap, .nnm-orb { transition: none; }
}
`;
