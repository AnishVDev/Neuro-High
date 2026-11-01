"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useMemo, useState, type CSSProperties } from "react";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, Skull, Sparkles, Zap } from "lucide-react";
import { MODULES, lessonPath, lessonsOf } from "@/content";
import { nextRank, rankFor } from "@/lib/gamification";
import { useProgress } from "./ProgressProvider";

const INK = "#171321";
const LIME = "#C6F32E";
const SUN = "#FFD645";
const ROW_HEIGHT = 76;
const BRIDGE_WIDTH = 48;

function CenteredCheck() {
  const path = "M5 12.5 9.6 17 19 7.5";

  return (
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      aria-hidden="true"
      className="block"
    >
      <path
        d={path}
        fill="none"
        stroke={INK}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={path}
        fill="none"
        stroke="white"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NeuralMap({ compact = false }: { compact?: boolean }) {
  const { state, isCompleted, loading } = useProgress();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);

  const xp = state?.learner?.xp ?? 0;
  const rank = rankFor(xp);
  const upcomingRank = nextRank(xp);

  const layers = useMemo(
    () =>
      MODULES.map((mod) => {
        const nodes = lessonsOf(mod.slug).map((lesson) => ({
          lesson,
          done: isCompleted(lesson.slug),
        }));

        const cleared = nodes.filter((node) => node.done).length;

        return {
          mod,
          nodes,
          cleared,
          complete: nodes.length > 0 && cleared === nodes.length,
        };
      }),
    [isCompleted, state],
  );

  const allNodes = layers.flatMap((layer) =>
    layer.nodes.map((node) => ({ ...node, mod: layer.mod })),
  );

  const total = allNodes.length;
  const cleared = allNodes.filter((node) => node.done).length;
  const progressReady = !loading && state !== null;

  const nextNode = progressReady
    ? allNodes.find((node) => !node.done)
    : undefined;

  const activeSlug = focusedSlug ?? hoveredSlug;
  const activeNode = allNodes.find(
    (node) => node.lesson.slug === activeSlug,
  );

  const rankSpan = upcomingRank ? upcomingRank.minXp - rank.minXp : 0;
  const rankProgress = upcomingRank
    ? Math.max(
        0,
        Math.min(
          100,
          rankSpan > 0 ? ((xp - rank.minXp) / rankSpan) * 100 : 100,
        ),
      )
    : 100;

  const nextLayer = nextNode
    ? layers.find((layer) => layer.mod.slug === nextNode.mod.slug)
    : undefined;

  let novaHint = "Syncing your build…";

  if (!loading && !state) {
    novaHint = "Progress couldn't load. Check this browser's storage settings.";
  } else if (progressReady && cleared === 0) {
    novaHint = "Every network starts dark. Clear your first mission to light a neuron.";
  } else if (progressReady && !nextNode) {
    novaHint = "Every neuron is lit. Full stack human, confirmed.";
  } else if (nextNode?.lesson.kind === "boss") {
    novaHint = "Boss fight next. Keep your combo going to chase the Overclocked badge.";
  } else if (nextLayer) {
    const remaining = nextLayer.nodes.filter((node) => !node.done).length;
    novaHint = `${remaining} more mission${remaining === 1 ? "" : "s"} to energize ${nextLayer.mod.title}.`;
  }

  const desktopColumns = layers
    .map((_, index) =>
      index < layers.length - 1
        ? `minmax(0, 1fr) ${BRIDGE_WIDTH}px`
        : "minmax(0, 1fr)",
    )
    .join(" ");

  const tape = [
    "Clear missions",
    "Light neurons",
    "Build your AI toolkit",
    "Beat the boss fights",
    "Use AI with confidence",
    "Full stack human",
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="neural-rehab sticker-lg overflow-hidden bg-paper text-ink"
        aria-label="Your AI learning progress"
        aria-busy={loading}
      >
        {/* Header */}
        <header className="grid gap-5 border-b-2 border-ink bg-paper p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip bg-sun text-ink">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Your neural build
              </span>
              <span className="chip bg-white text-ink/60">
                {layers.length} modules · {total} missions
              </span>
            </div>

            <h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl">
              Your AI skills.
              <br />
              <span className="neural-highlight">Built by you.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/70 sm:text-base">
              Clear a mission to light a neuron. Finish a module to energize the
              whole layer. Pick up where you left off—or explore any lesson.
            </p>
          </div>

          {!compact && (
            <div className="flex items-center gap-3 self-center rounded-xl border-2 border-ink bg-white p-2 shadow-[3px_3px_0_#171321]">
              <Image
                src="/img/nova-bot.png"
                alt="NOVA, your AI copilot"
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-lg border-2 border-ink bg-cream object-cover"
              />
          
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-coral">
                  NOVA // field note
                </p>
                <p className="mt-1 text-xs leading-snug text-ink/75">
                  {novaHint}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Prominent next mission */}
        {!compact && (
          <div className="border-b-2 border-ink bg-lime p-4 sm:p-5">
            {nextNode ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-ink bg-white font-mono text-lg font-bold shadow-[3px_3px_0_#171321]">
                    {String(nextNode.lesson.index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                      Mission queued · {nextNode.mod.title}
                    </p>
                    <p className="mt-0.5 truncate font-display text-xl font-extrabold leading-tight sm:text-2xl">
                      {nextNode.lesson.title}
                    </p>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/60">
                      {nextNode.lesson.minutes} min · {nextNode.lesson.xp} base XP + combo
                    </p>
                  </div>
                </div>

                <Link
                  href={lessonPath(nextNode.lesson)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-paper shadow-[3px_3px_0_#171321] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  Launch mission
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ) : loading ? (
              <p className="font-mono text-sm font-bold uppercase tracking-wider">
                Loading your next mission…
              </p>
            ) : state && total > 0 ? (
              <p className="font-display text-xl font-extrabold">
                ⚡ Network complete. Full stack human confirmed.
              </p>
            ) : (
              <p className="font-mono text-sm font-bold">
                Progress is unavailable in this browser.
              </p>
            )}
          </div>
        )}

        {/* Module board */}
        <div className="neural-board p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-vio">
                Campaign map // {layers.length} layers
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                Your missions, connected.
              </h3>
            </div>

            <p className="max-w-sm text-xs leading-relaxed text-ink/55">
              Connections show your progress—not prerequisites. Every mission
              is open.
            </p>
          </div>

          <div
            className="neural-layer-grid"
            style={{ "--neural-columns": desktopColumns } as CSSProperties}
          >
            {layers.map((layer, layerIndex) => {
              const nextLayerData = layers[layerIndex + 1];
              const bridgeActive =
                !!nextLayerData && (layer.cleared > 0 || nextLayerData.cleared > 0);
              const bridgeComplete =
                !!nextLayerData && layer.complete && nextLayerData.complete;
              const bridgeHot =
                !!nextLayerData &&
                (activeNode?.mod.slug === layer.mod.slug ||
                  activeNode?.mod.slug === nextLayerData.mod.slug);

              return (
                <Fragment key={layer.mod.slug}>
                  <motion.article
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ delay: layerIndex * 0.08, duration: 0.3 }}
                    className="neural-module-card sticker bg-white"
                    style={{ "--neural-accent": layer.mod.color } as CSSProperties}
                    aria-label={`${layer.mod.title}: ${layer.cleared} of ${layer.nodes.length} missions cleared`}
                  >
                    <header className="neural-module-header">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="chip text-ink"
                          style={{ backgroundColor: layer.mod.color }}
                        >
                          {layer.mod.codename}
                        </span>

                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-ink/45">
                          Layer {String(layerIndex + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h4 className="mt-3 font-display text-xl font-extrabold leading-tight">
                        {layer.mod.title}
                      </h4>

                      <div className="mt-3 flex items-center gap-2">
                        <div
                          className="flex min-w-0 flex-1 gap-1"
                          aria-label={`${layer.cleared} of ${layer.nodes.length} cleared`}
                        >
                          {layer.nodes.map((node) => (
                            <span
                              key={node.lesson.slug}
                              aria-hidden="true"
                              className="h-2.5 flex-1 rounded-full border border-ink/60"
                              style={{
                                backgroundColor: node.done ? layer.mod.color : "white",
                              }}
                            />
                          ))}
                        </div>

                        <span className="whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-wider text-ink/60">
                          {loading ? "…" : `${layer.cleared}/${layer.nodes.length}`}
                        </span>
                      </div>

                      {layer.complete && (
                        <motion.span
                          initial={{ scale: 0.8, rotate: -5 }}
                          animate={{ scale: 1, rotate: -3 }}
                          className="neural-energized-stamp"
                        >
                          <Zap className="size-3" aria-hidden="true" />
                          Energized
                        </motion.span>
                      )}
                    </header>

                    <ol className="neural-mission-list">
                      {layer.nodes.map((node, nodeIndex) => {
                        const lesson = node.lesson;
                        const isBoss = lesson.kind === "boss";
                        const isNext = nextNode?.lesson.slug === lesson.slug;
                        const followingNode = layer.nodes[nodeIndex + 1];
                        const cableState =
                          node.done && followingNode?.done
                            ? "is-lit"
                            : node.done || followingNode?.done
                              ? "is-charged"
                              : "is-dormant";

                        const rowClasses = [
                          "neural-mission-row",
                          node.done ? "is-done" : "",
                          isNext ? "is-next" : "",
                          isBoss ? "is-boss" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <li
                            key={lesson.slug}
                            className="neural-mission-item"
                            style={{ height: ROW_HEIGHT }}
                          >
                            {followingNode && (
                              <span
                                aria-hidden="true"
                                className={`neural-node-cable ${cableState}`}
                              />
                            )}

                            <Link
                              href={lessonPath(lesson)}
                              onMouseEnter={() => setHoveredSlug(lesson.slug)}
                              onMouseLeave={() => setHoveredSlug(null)}
                              onFocus={() => setFocusedSlug(lesson.slug)}
                              onBlur={() => setFocusedSlug(null)}
                              aria-label={`${lesson.title}. ${
                                isBoss ? "Boss fight." : ""
                              }${
                                node.done
                                  ? "Completed. Replay for practice."
                                  : `${lesson.xp} base XP plus combo bonus.`
                              }${isNext ? " Recommended next mission." : ""}`}
                              aria-current={isNext ? "step" : undefined}
                              className={rowClasses}
                              style={{ "--neural-accent": layer.mod.color } as CSSProperties}
                            >
                              <span className="neural-node-wrap">
                                {isNext && (
                                  <span
                                    aria-hidden="true"
                                    className="neural-next-ring"
                                  />
                                )}

                                <span
                                  className={[
                                    "neural-node-orb",
                                    node.done ? "is-done" : "",
                                    isBoss ? "is-boss" : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" ")}
                                  style={{
                                    backgroundColor: node.done
                                      ? layer.mod.color
                                      : isBoss
                                        ? INK
                                        : isNext
                                          ? SUN
                                          : "white",
                                  }}
                                >
                                  {node.done ? (
                                    <CenteredCheck />
                                  ) : isBoss ? (
                                    <Skull
                                      className="block size-6 text-sun"
                                      strokeWidth={2.4}
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <span className="font-display text-lg font-extrabold leading-none text-ink">
                                      {lesson.index + 1}
                                    </span>
                                  )}
                                </span>
                              </span>

                              <span className="neural-mission-copy">
                                <span className="neural-mission-title">
                                  {lesson.title}
                                </span>
                                <span className="neural-mission-meta">
                                  {node.done
                                    ? "Cleared · replay = 0 XP"
                                    : isBoss
                                      ? `Boss fight · ${lesson.minutes} min · ${lesson.xp} XP`
                                      : `${lesson.minutes} min · ${lesson.xp} XP + combo`}
                                </span>
                              </span>

                              {isNext && (
                                <span className="neural-next-tag">Next</span>
                              )}

                              <ArrowRight
                                className="neural-row-arrow"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                  </motion.article>

                  {nextLayerData && (
                    <div
                      aria-hidden="true"
                      className={[
                        "neural-bridge",
                        bridgeActive ? "is-active" : "",
                        bridgeComplete ? "is-complete" : "",
                        bridgeHot ? "is-hot" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={
                        {
                          "--bridge-from": layer.mod.color,
                          "--bridge-to": nextLayerData.mod.color,
                        } as CSSProperties
                      }
                    >
                      <span className="neural-bridge-source" />
                      <span className="neural-bridge-wire" />
                      <span className="neural-bridge-target" />
                      <span className="neural-bridge-label">signal</span>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* Homepage-style marquee */}
        {!compact && (
          <div className="neural-tape" aria-hidden="true">
            <div className="neural-tape-track">
              {[...tape, ...tape].map((item, index) => (
                <span className="neural-tape-item" key={`${item}-${index}`}>
                  {item}
                  <span className="neural-tape-star">✦</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="border-t-2 border-ink bg-paper px-5 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">
          Progress saves in this browser · Nothing is locked · Build at your pace
        </p>

        {/* Hover/focus preview */}
        {!compact && activeNode && (
          <div className="border-t-2 border-ink bg-ink px-5 py-3 text-paper">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
              Mission preview
            </p>
            <p className="mt-1 font-display text-lg font-extrabold">
              {activeNode.lesson.title}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-paper/55">
              {activeNode.mod.title} · {activeNode.lesson.minutes} min ·{" "}
              {activeNode.done
                ? "Cleared"
                : `${activeNode.lesson.xp} base XP + combo`}
            </p>
          </div>
        )}

        <style>{CSS}</style>
      </section>
    </MotionConfig>
  );
}

const CSS = `
.neural-highlight {
  position: relative;
  z-index: 0;
  display: inline-block;
}
.neural-highlight::before {
  position: absolute;
  z-index: -1;
  right: -4px;
  bottom: 3px;
  left: -4px;
  height: 38%;
  background: ${LIME};
  content: "";
  transform: rotate(-1.2deg);
}

.neural-stat {
  min-width: 0;
  padding: 14px 18px;
  border-right: 1px solid rgba(23, 19, 33, 0.15);
}
.neural-stat:last-child { border-right: 0; }

.neural-board {
  background-color: #fffaf0;
  background-image: radial-gradient(rgba(23,19,33,0.12) 1px, transparent 1px);
  background-size: 18px 18px;
}

.neural-layer-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
}

.neural-module-card {
  position: relative;
  z-index: 1;
  min-width: 0;
  overflow: visible;
  border: 2px solid ${INK};
  border-radius: 18px;
  box-shadow: 5px 5px 0 ${INK};
}

.neural-module-header {
  position: relative;
  min-height: 128px;
  padding: 14px;
  border-bottom: 2px solid ${INK};
  border-radius: 15px 15px 0 0;
  background: color-mix(in srgb, var(--neural-accent) 16%, white);
}

.neural-energized-stamp {
  position: absolute;
  top: 8px;
  right: 9px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border: 2px solid ${INK};
  border-radius: 6px;
  background: ${LIME};
  color: ${INK};
  font-family: var(--f-mono), monospace;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  transform: rotate(-4deg);
}

.neural-mission-list {
  margin: 0;
  padding: 8px 0;
  list-style: none;
}

.neural-mission-item {
  position: relative;
  padding: 2px 9px;
}

.neural-node-cable {
  position: absolute;
  z-index: 0;
  top: 38px;
  bottom: -38px;
  left: 33px;
  width: 3px;
  border-radius: 999px;
}
.neural-node-cable.is-dormant {
  background: repeating-linear-gradient(
    to bottom,
    rgba(23,19,33,0.22) 0 4px,
    transparent 4px 8px
  );
}
.neural-node-cable.is-charged {
  background: color-mix(in srgb, var(--neural-accent) 55%, white);
}
.neural-node-cable.is-lit {
  background: ${LIME};
  box-shadow: 0 0 0 1px ${INK};
}

.neural-mission-row {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  gap: 10px;
  padding: 7px;
  border: 2px solid transparent;
  border-radius: 12px;
  color: ${INK};
  text-decoration: none;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease,
    background-color 150ms ease;
}
.neural-mission-row.is-done {
  background: color-mix(in srgb, var(--neural-accent) 12%, white);
}
.neural-mission-row.is-next {
  border-color: ${INK};
  background: #fff4c2;
}
.neural-mission-row.is-boss:not(.is-done) {
  border-color: ${INK};
  background: ${INK};
  color: white;
}
.neural-mission-row:hover,
.neural-mission-row:focus-visible {
  z-index: 2;
  transform: translate(-2px, -2px);
  border-color: ${INK};
  box-shadow: 3px 3px 0 ${INK};
  outline: none;
}
.neural-mission-row:active {
  transform: translate(1px, 1px);
  box-shadow: 0 0 0 ${INK};
}

.neural-node-wrap {
  position: relative;
  z-index: 1;
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
}
.neural-node-orb {
  position: relative;
  z-index: 1;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 2px solid ${INK};
  border-radius: 999px;
  box-shadow: 2px 2px 0 ${INK};
}
.neural-node-orb.is-boss {
  width: 46px;
  height: 46px;
}
.neural-next-ring {
  position: absolute;
  inset: 0;
  border: 2px dashed ${INK};
  border-radius: 999px;
  animation: neural-ring 7s linear infinite;
}
.neural-next-tag {
  position: absolute;
  top: -5px;
  right: 2px;
  z-index: 2;
  padding: 2px 5px;
  border: 1.5px solid ${INK};
  border-radius: 5px;
  background: ${SUN};
  color: ${INK};
  font-family: var(--f-mono), monospace;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.neural-mission-copy {
  display: block;
  min-width: 0;
  flex: 1;
}
.neural-mission-title {
  display: block;
  overflow: hidden;
  color: ${INK};
  font-family: var(--f-display), sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}
.neural-mission-meta {
  display: block;
  overflow: hidden;
  margin-top: 4px;
  color: rgba(23,19,33,0.55);
  font-family: var(--f-mono), monospace;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}
.neural-mission-row.is-boss:not(.is-done) .neural-mission-title {
  color: white;
}
.neural-mission-row.is-boss:not(.is-done) .neural-mission-meta {
  color: ${SUN};
}
.neural-row-arrow {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  color: rgba(23,19,33,0.35);
  opacity: 0;
  transition: opacity 150ms ease;
}
.neural-mission-row:hover .neural-row-arrow,
.neural-mission-row:focus-visible .neural-row-arrow {
  opacity: 1;
}
.neural-mission-row.is-boss:not(.is-done) .neural-row-arrow {
  color: white;
}

.neural-bridge {
  position: relative;
  min-height: 48px;
  color: ${INK};
}
.neural-bridge-wire {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 30px;
  background: repeating-linear-gradient(
    to bottom,
    rgba(23,19,33,0.45) 0 4px,
    transparent 4px 8px
  );
  transform: translate(-50%, -50%);
}
.neural-bridge.is-active .neural-bridge-wire {
  background: linear-gradient(
    to bottom,
    var(--bridge-from),
    var(--bridge-to)
  );
}
.neural-bridge.is-complete .neural-bridge-wire {
  background: ${LIME};
  box-shadow: 0 0 0 1px ${INK};
}
.neural-bridge-source,
.neural-bridge-target {
  position: absolute;
  left: 50%;
  z-index: 1;
  width: 11px;
  height: 11px;
  border: 2px solid ${INK};
  border-radius: 999px;
  background: white;
  transform: translateX(-50%);
}
.neural-bridge-source { top: 2px; }
.neural-bridge-target { bottom: 2px; }
.neural-bridge.is-active .neural-bridge-source { background: var(--bridge-from); }
.neural-bridge.is-active .neural-bridge-target { background: var(--bridge-to); }
.neural-bridge.is-complete .neural-bridge-source,
.neural-bridge.is-complete .neural-bridge-target { background: ${LIME}; }

.neural-bridge-label {
  position: absolute;
  top: 50%;
  left: calc(50% + 10px);
  color: rgba(23,19,33,0.5);
  font-family: var(--f-mono), monospace;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transform: translateY(-50%);
}

.neural-tape {
  overflow: hidden;
  border-top: 2px solid ${INK};
  border-bottom: 2px solid ${INK};
  background: ${SUN};
  transform: rotate(-0.6deg) scale(1.01);
}
.neural-tape-track {
  display: flex;
  width: max-content;
  animation: neural-marquee 32s linear infinite;
}
.neural-tape-item {
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 9px 14px;
  color: ${INK};
  font-family: var(--f-mono), monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.neural-tape-star { opacity: 0.5; }

@keyframes neural-ring {
  to { transform: rotate(360deg); }
}
@keyframes neural-marquee {
  to { transform: translateX(-50%); }
}

@media (min-width: 768px) {
  .neural-stat {
    padding: 16px 22px;
  }
  .neural-layer-grid {
    grid-template-columns: var(--neural-columns);
    align-items: stretch;
  }
  .neural-bridge {
    min-height: 100%;
  }
  .neural-bridge-wire {
    top: 70px;
    left: 0;
    width: 100%;
    height: 4px;
    background: repeating-linear-gradient(
      to right,
      rgba(23,19,33,0.45) 0 5px,
      transparent 5px 10px
    );
    transform: none;
  }
  .neural-bridge.is-active .neural-bridge-wire {
    background: linear-gradient(
      to right,
      var(--bridge-from),
      var(--bridge-to)
    );
  }
  .neural-bridge.is-complete .neural-bridge-wire {
    background: ${LIME};
  }
  .neural-bridge-source,
  .neural-bridge-target {
    top: 65px;
    bottom: auto;
    width: 14px;
    height: 14px;
  }
  .neural-bridge-source { left: -1px; }
  .neural-bridge-target { left: auto; right: -1px; }
  .neural-bridge-label {
    top: 84px;
    left: 50%;
    padding: 2px 4px;
    background: #fffaf0;
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .neural-next-ring,
  .neural-tape-track {
    animation: none;
  }
  .neural-mission-row,
  .neural-row-arrow {
    transition: none;
  }
  .neural-mission-row:hover,
  .neural-mission-row:focus-visible {
    transform: none;
  }
}
`;
