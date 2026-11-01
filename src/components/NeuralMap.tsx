"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Skull, Sparkles, Zap } from "lucide-react";
import { MODULES, lessonPath, lessonsOf } from "@/content";
import { nextRank, rankFor } from "@/lib/gamification";
import { useProgress } from "./ProgressProvider";

/**
 * NEURO//HIGH neural build.
 * Each module is a layer (sticker card), each mission is a neuron (row).
 * Wires between cards light up as you clear missions.
 */

const INK = "#171321";
const LIME = "#C6F32E";
const SUN = "#FFD645";

// Geometry. Rows have fixed heights so the wires line up with the ports.
const BORDER = 2; // card border width (border-2)
const HEADER_H = 128; // layer card header height on desktop
const PAD = 10; // vertical padding of the lesson list
const ROW_H = 76; // height of one lesson row
const GAP_W = 64; // width of the wire channel between cards

const rowCenter = (i: number) => BORDER + HEADER_H + PAD + i * ROW_H + ROW_H / 2;

/** Checkmark drawn so its visual center is exactly (12, 12). */
function CheckMark({ size = 22 }: { size?: number }) {
  const d = "M5 12.25 9.8 16.75 19 7.25";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className="block">
      <path d={d} fill="none" stroke={INK} strokeWidth={6.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NeuralMap({ compact = false }: { compact?: boolean }) {
  const { state, isCompleted, loading } = useProgress();
  const [hot, setHot] = useState<string | null>(null);

  const xp = state?.learner.xp ?? 0;
  const rank = rankFor(xp);
  const upcoming = nextRank(xp);

  const layers = useMemo(
    () =>
      MODULES.map((mod) => {
        const nodes = lessonsOf(mod.slug).map((lesson) => ({
          lesson,
          done: isCompleted(lesson.slug),
        }));
        const count = nodes.filter((n) => n.done).length;
        return { mod, nodes, count, full: nodes.length > 0 && count === nodes.length };
      }),
    [isCompleted],
  );

  const all = layers.flatMap((l) => l.nodes);
  const total = all.length;
  const cleared = all.filter((n) => n.done).length;
  const integrity = total ? Math.round((cleared / total) * 100) : 0;
  const layersFull = layers.filter((l) => l.full).length;

  const nextNode = loading ? undefined : all.find((n) => !n.done);
  const nextLayer = nextNode ? layers.find((l) => l.nodes.includes(nextNode)) : undefined;

  const maxRows = Math.max(1, ...layers.map((l) => l.nodes.length));
  const boardH = BORDER * 2 + HEADER_H + PAD * 2 + maxRows * ROW_H;
  const gridCols = layers.map(() => "minmax(0,1fr)").join(` ${GAP_W}px `);

  // NOVA's contextual hint
  let hint = "syncing your build…";
  if (!loading) {
    if (cleared === 0) hint = "psst — every network starts dark. clear mission one and watch it spark.";
    else if (!nextNode) hint = "every neuron lit. you're officially a full stack human.";
    else if (nextNode.lesson.kind === "boss")
      hint = "boss fight next. land 5 in a row for the Overclocked badge.";
    else if (nextLayer) {
      const left = nextLayer.nodes.length - nextLayer.count;
      hint = `${left} more mission${left === 1 ? "" : "s"} to energize ${nextLayer.mod.title}.`;
    }
  }

  const tape = [
    "Input: you, day one",
    `${layers.length} layers`,
    `${total} neurons`,
    "Clear missions",
    "Beat the bosses",
    "Output: full stack human",
  ];

  return (
    <section
      className="sticker-lg relative overflow-hidden bg-paper text-ink"
      aria-label="Your neural build"
      aria-busy={loading}
    >
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-coral">
            Your neural build
          </p>
          <h2 className="mt-2 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl">
            Wire up your <span className="nm-outline">brain.</span>
          </h2>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <div>
              <dd className="font-display text-3xl font-extrabold leading-none">
                <span className="relative z-0 inline-block">
                  <span aria-hidden className="absolute -inset-x-1 bottom-0.5 -z-10 h-[42%] -rotate-1 bg-lime" />
                  {loading ? "—" : `${integrity}%`}
                </span>
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-ink/55">network integrity</dt>
            </div>
            <div>
              <dd className="font-display text-3xl font-extrabold leading-none">
                {loading ? "—" : cleared}
                <span className="text-ink/30">/{total}</span>
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-ink/55">neurons lit</dt>
            </div>
            <div>
              <dd className="font-display text-3xl font-extrabold leading-none">
                {loading ? "—" : layersFull}
                <span className="text-ink/30">/{layers.length}</span>
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-ink/55">layers energized</dt>
            </div>
            <div>
              <dd className="font-display text-3xl font-extrabold leading-none">
                {loading ? "—" : xp.toLocaleString()}
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-ink/55">
                {loading ? "xp" : upcoming ? `xp · ${upcoming.minXp - xp} to ${upcoming.name}` : `xp · ${rank.name}`}
              </dt>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {nextNode ? (
              <Link href={lessonPath(nextNode.lesson)} className="btn btn-primary">
                {cleared > 0 ? "Continue your build" : "Start your build"}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : !loading && total > 0 ? (
              <span className="chip bg-lime text-ink">
                <Zap className="size-3.5" aria-hidden /> Network complete
              </span>
            ) : null}
            {!loading && (
              <span className="chip bg-white text-ink/70">
                <Sparkles className="size-3.5" aria-hidden /> Rank · {rank.name}
              </span>
            )}
          </div>
        </div>

        {/* NOVA */}
        {!compact && (
          <div className="flex items-end gap-3 lg:flex-col lg:items-center">
            <div className="relative max-w-[230px] -rotate-2 rounded-2xl border-2 border-ink bg-white px-4 py-3 font-mono text-[12px] leading-snug text-ink shadow-[4px_4px_0_#171321]">
              {hint}
              <span
                aria-hidden
                className="absolute -bottom-[9px] left-8 size-4 rotate-45 border-b-2 border-r-2 border-ink bg-white lg:left-1/2"
              />
            </div>
            <Image
              src="/img/nova-bot.png"
              alt="NOVA, your AI copilot"
              width={104}
              height={104}
              className="nm-bob size-[104px] shrink-0 rounded-2xl border-2 border-ink bg-white object-cover shadow-[4px_4px_0_#171321]"
            />
          </div>
        )}
      </div>

      {/* ── Marquee tape ─────────────────────────────────────── */}
      <div className="relative z-20 -ml-[5%] w-[110%] -rotate-1 overflow-hidden border-y-2 border-ink bg-sun py-2" aria-hidden>
        <div className="nm-marquee flex w-max gap-8 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ink">
          {[...tape, ...tape, ...tape, ...tape].map((t, i) => (
            <span key={i} className="flex items-center gap-8">
              {t} <span className="text-ink/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── The network ──────────────────────────────────────── */}
      <div className="nm-board -mt-3 bg-cream px-4 pb-6 pt-9 sm:px-6">
        <div className="nm-grid" style={{ "--cols": gridCols } as CSSProperties}>
          {layers.map((layer, li) => {
            const tint = `color-mix(in srgb, ${layer.mod.color} 18%, #ffffff)`;
            const isLast = li === layers.length - 1;
            const nextLayerData = layers[li + 1];

            return (
              <Fragment key={layer.mod.slug}>
                {/* Layer card */}
                <article
                  className="relative z-10 rounded-2xl border-2 border-ink bg-white shadow-[5px_5px_0_#171321]"
                  aria-label={`${layer.mod.title}: ${layer.count} of ${layer.nodes.length} cleared`}
                >
                  <header
                    className="flex flex-col justify-between gap-2 rounded-t-[14px] border-b-2 border-ink px-4 py-3 md:h-[128px]"
                    style={{ background: tint }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="chip text-ink" style={{ backgroundColor: layer.mod.color }}>
                        {layer.mod.codename}
                      </span>
                      {layer.full && (
                        <motion.span
                          initial={{ scale: 0, rotate: -25 }}
                          animate={{ scale: 1, rotate: -6 }}
                          transition={{ type: "spring", stiffness: 320, damping: 14 }}
                          className="chip bg-lime text-ink"
                        >
                          <Zap className="size-3.5" aria-hidden /> Energized
                        </motion.span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-extrabold leading-tight tracking-tight">
                      {layer.mod.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-1 gap-1" aria-hidden>
                        {layer.nodes.map((n) => (
                          <span
                            key={n.lesson.slug}
                            className="h-2.5 flex-1 rounded-full border-[1.5px] border-ink"
                            style={{ backgroundColor: n.done ? layer.mod.color : "#fff" }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/60">
                        {loading ? "…" : `${layer.count}/${layer.nodes.length}`}
                      </span>
                    </div>
                  </header>

                  <ol className="m-0 list-none p-0" style={{ paddingBlock: PAD }}>
                    {layer.nodes.map((node) => {
                      const { lesson, done } = node;
                      const isBoss = lesson.kind === "boss";
                      const isNext = nextNode?.lesson.slug === lesson.slug;
                      const kind = isBoss ? "Boss fight" : `Mission ${String(lesson.index + 1).padStart(2, "0")}`;
                      const orbBg = done ? layer.mod.color : isNext ? LIME : isBoss ? SUN : "#FFFFFF";
                      const meta = done
                        ? `${isBoss ? "Defeated" : "Cleared"} · replay 0 XP`
                        : `${kind} · ${lesson.minutes} min · ${lesson.xp} XP`;

                      const rowClass = isBoss
                        ? "border-ink bg-ink text-paper"
                        : isNext
                          ? "border-ink bg-sun/45"
                          : "border-transparent hover:border-ink hover:bg-white";

                      return (
                        <li key={lesson.slug} className="relative px-2 py-1" style={{ height: ROW_H }}>
                          {/* ports on the card edges (desktop) */}
                          {li > 0 && (
                            <span
                              aria-hidden
                              className="absolute left-[-9px] top-1/2 z-20 hidden size-3.5 -translate-y-1/2 rounded-full border-2 border-ink md:block"
                              style={{ backgroundColor: done ? LIME : "#fff" }}
                            />
                          )}
                          {!isLast && (
                            <span
                              aria-hidden
                              className="absolute right-[-9px] top-1/2 z-20 hidden size-3.5 -translate-y-1/2 rounded-full border-2 border-ink md:block"
                              style={{ backgroundColor: done ? LIME : "#fff" }}
                            />
                          )}

                          <Link
                            href={lessonPath(lesson)}
                            onMouseEnter={() => setHot(lesson.slug)}
                            onMouseLeave={() => setHot(null)}
                            onFocus={() => setHot(lesson.slug)}
                            onBlur={() => setHot(null)}
                            aria-label={`${lesson.title}. ${kind}. ${
                              done ? "Cleared" : `${lesson.xp} XP plus combo bonus`
                            }${isNext ? ". Up next" : ""}`}
                            className={`nm-row group relative flex h-full items-center gap-3 rounded-xl border-2 px-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vio ${rowClass}`}
                          >
                            <span className="relative grid shrink-0 place-items-center">
                              {isNext && <span aria-hidden className="nm-ring absolute -inset-[7px] rounded-full border-2 border-dashed border-ink" />}
                              <span
                                className={`nm-pop relative grid place-items-center rounded-full border-2 border-ink shadow-[2px_2px_0_#171321] ${
                                  isBoss ? "size-12" : "size-11"
                                }`}
                                style={{ backgroundColor: orbBg, animationDelay: `${li * 120 + lesson.index * 60}ms` }}
                              >
                                {done ? (
                                  <CheckMark size={isBoss ? 26 : 22} />
                                ) : isBoss ? (
                                  <Skull className="block size-6 text-ink" strokeWidth={2.4} aria-hidden />
                                ) : (
                                  <span className="font-display text-lg font-extrabold leading-none text-ink">
                                    {lesson.index + 1}
                                  </span>
                                )}
                              </span>
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="line-clamp-2 font-display text-[14px] font-bold leading-snug">
                                {lesson.title}
                              </span>
                              <span
                                className={`mt-0.5 block truncate font-mono text-[10px] font-bold uppercase tracking-wider ${
                                  isBoss ? (done ? "text-lime" : "text-sun") : done ? "text-ink/45" : "text-ink/60"
                                }`}
                              >
                                {meta}
                              </span>
                            </span>

                            <ArrowRight
                              aria-hidden
                              className={`size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
                                isBoss ? "text-paper" : "text-ink"
                              }`}
                            />

                            {isNext && (
                              <span className="absolute -top-2.5 right-2 rotate-3 rounded-md border-2 border-ink bg-lime px-1.5 font-mono text-[9px] font-bold uppercase leading-4 tracking-wider text-ink shadow-[2px_2px_0_#171321]">
                                Next up
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </article>

                {/* Wire channel to the next layer */}
                {!isLast && nextLayerData && (
                  <div aria-hidden className="relative">
                    <svg
                      className="hidden md:block"
                      width="100%"
                      height={boardH}
                      viewBox={`0 0 100 ${boardH}`}
                      preserveAspectRatio="none"
                    >
                      {layer.nodes
                        .flatMap((s, si) => {
                          const aligned = Math.round(
                            (si / Math.max(1, layer.nodes.length - 1)) *
                              Math.max(0, nextLayerData.nodes.length - 1),
                          );
                          return nextLayerData.nodes
                            .map((t, ti) => ({ s, t, si, ti }))
                            .filter((e) => Math.abs(e.ti - aligned) <= 1);
                        })
                        .sort(
                          (a, b) =>
                            Number(a.s.done) + Number(a.t.done) - (Number(b.s.done) + Number(b.t.done)),
                        )
                        .map(({ s, t, si, ti }) => {
                          const y1 = rowCenter(si);
                          const y2 = rowCenter(ti);
                          const d = `M 0 ${y1} C 50 ${y1}, 50 ${y2}, 100 ${y2}`;
                          const both = s.done && t.done;
                          const some = s.done || t.done;
                          const isHot = hot === s.lesson.slug || hot === t.lesson.slug;
                          const key = `${s.lesson.slug}>${t.lesson.slug}`;

                          if (both) {
                            return (
                              <g key={key}>
                                <path d={d} fill="none" stroke={INK} strokeWidth={isHot ? 7 : 6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                <path d={d} fill="none" stroke={LIME} strokeWidth={isHot ? 3.5 : 3} strokeLinecap="round" strokeDasharray="7 9" vectorEffect="non-scaling-stroke" className="nm-flow" />
                              </g>
                            );
                          }
                          if (some) {
                            return (
                              <path
                                key={key}
                                d={d}
                                fill="none"
                                stroke={s.done ? layer.mod.color : nextLayerData.mod.color}
                                strokeWidth={isHot ? 3 : 2.2}
                                strokeOpacity={isHot ? 1 : 0.75}
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                              />
                            );
                          }
                          return (
                            <path
                              key={key}
                              d={d}
                              fill="none"
                              stroke={INK}
                              strokeWidth={isHot ? 2.2 : 1.5}
                              strokeOpacity={isHot ? 0.75 : 0.22}
                              strokeDasharray="2 6"
                              strokeLinecap="round"
                              vectorEffect="non-scaling-stroke"
                            />
                          );
                        })}
                    </svg>

                    {/* mobile connector */}
                    <div className="flex flex-col items-center py-2 md:hidden">
                      <span className="h-6 border-l-2 border-dashed border-ink/40" />
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-ink/45">signal</span>
                      <span className="h-6 border-l-2 border-dashed border-ink/40" />
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {!compact && (
          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
            Nothing is locked — jump into any mission · clear all of a layer to energize it · progress saves in this
            browser
          </p>
        )}
      </div>

      <style>{CSS}</style>
    </section>
  );
}

const CSS = `
.nm-outline { color: transparent; -webkit-text-stroke: 2px ${INK}; }

.nm-board {
  background-image: radial-gradient(rgba(23,19,33,0.12) 1px, transparent 1px);
  background-size: 20px 20px;
}

.nm-grid { display: grid; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 768px) {
  .nm-grid { grid-template-columns: var(--cols); align-items: start; }
}

.nm-row { transition: transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease; }
.nm-row:hover, .nm-row:focus-visible { transform: translate(-2px, -2px); box-shadow: 3px 3px 0 ${INK}; }
.nm-row:active { transform: translate(1px, 1px); box-shadow: 0 0 0 ${INK}; }

.nm-ring { animation: nm-spin 8s linear infinite; }
.nm-flow { animation: nm-flow 1s linear infinite; }
.nm-pop { animation: nm-pop 420ms cubic-bezier(.34,1.56,.64,1) both; }
.nm-marquee { animation: nm-marquee 38s linear infinite; }
.nm-bob { animation: nm-bob 3.2s ease-in-out infinite; }

@keyframes nm-spin { to { transform: rotate(360deg); } }
@keyframes nm-flow { to { stroke-dashoffset: -32; } }
@keyframes nm-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes nm-marquee { to { transform: translateX(-50%); } }
@keyframes nm-bob { 0%, 100% { transform: translateY(0) rotate(2deg); } 50% { transform: translateY(-5px) rotate(-1deg); } }

@media (prefers-reduced-motion: reduce) {
  .nm-ring, .nm-flow, .nm-pop, .nm-marquee, .nm-bob { animation: none; }
  .nm-row { transition: none; }
  .nm-row:hover, .nm-row:focus-visible { transform: none; }
}
`;
