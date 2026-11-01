"use client";

import Link from "next/link";
import { useId, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  Check,
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

export default function NeuralMap({ compact = false }: { compact?: boolean }) {
  const { state, loading, isCompleted } = useProgress();
  const titleId = useId();

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);

  const layers = useMemo(
    () =>
      MODULES.map((mod) => {
        const nodes = lessonsOf(mod.slug).map((lesson) => ({
          lesson,
          done: isCompleted(lesson.slug),
        }));

        const count = nodes.filter((node) => node.done).length;

        return {
          mod,
          nodes,
          count,
          full: nodes.length > 0 && count === nodes.length,
        };
      }),
    [isCompleted],
  );

  const allNodes = layers.flatMap((layer) =>
    layer.nodes.map((node) => ({
      ...node,
      moduleTitle: layer.mod.title,
      moduleColor: layer.mod.color,
    })),
  );

  const total = allNodes.length;
  const cleared = allNodes.filter((node) => node.done).length;
  const integrity = total ? Math.round((cleared / total) * 100) : 0;

  const nextNode = loading
    ? undefined
    : allNodes.find((node) => !node.done);

  const activeSlug = focusedSlug ?? hoveredSlug;
  const preview =
    allNodes.find((node) => node.lesson.slug === activeSlug) ??
    nextNode ??
    allNodes[allNodes.length - 1];

  const xp = state?.learner.xp ?? 0;
  const rank = rankFor(xp);
  const upcomingRank = nextRank(xp);

  const rankProgress = upcomingRank
    ? Math.min(
        100,
        Math.max(
          0,
          ((xp - rank.minXp) /
            (upcomingRank.minXp - rank.minXp)) *
            100,
        ),
      )
    : 100;

  const bossCount = allNodes.filter(
    (node) => node.lesson.kind === "boss",
  ).length;

  return (
    <section
      className="sticker-lg overflow-hidden bg-paper text-ink"
      aria-labelledby={titleId}
      aria-busy={loading}
    >
      {/* Editorial-style header, using the same visual language as the homepage. */}
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div>
          <span className="chip bg-vio text-white">
            <BrainCircuit className="size-4" aria-hidden="true" />
            Your neural build
          </span>

          <h2
            id={titleId}
            className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
          >
            Power up your <span className="bg-lime px-1">network.</span>
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">
            Every checkpoint lights a node. Clear a module to power its
            connection to the next layer.
          </p>

          <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
            <strong
              className="inline-block font-display text-6xl font-extrabold leading-none tracking-tight"
              style={{ boxShadow: `inset 0 -0.32em 0 ${LIME}` }}
            >
              {loading ? "—" : `${integrity}%`}
            </strong>

            <span className="pb-1 font-mono text-[11px] font-bold uppercase leading-relaxed tracking-wider text-ink/60">
              Network integrity
              <br />
              {loading ? "Loading…" : `${cleared} of ${total} neurons online`}
            </span>
          </div>

          {/* One segment per lesson: more tangible than a generic progress bar. */}
          <div
            className="mt-4 flex max-w-xl gap-1"
            role="progressbar"
            aria-label="Lessons completed"
            aria-valuemin={0}
            aria-valuemax={Math.max(total, 1)}
            aria-valuenow={loading ? undefined : cleared}
            aria-valuetext={
              loading
                ? "Loading progress"
                : `${cleared} of ${total} lessons completed`
            }
          >
            {allNodes.map((node) => (
              <span
                key={node.lesson.slug}
                className="h-3 min-w-0 flex-1 rounded-sm border border-ink/50 transition-colors duration-300"
                style={{
                  backgroundColor: node.done
                    ? node.moduleColor
                    : node.lesson.slug === nextNode?.lesson.slug
                      ? SUN
                      : "#FFFFFF",
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* XP is read from the existing provider; no second XP system. */}
        <div className="sticker h-fit bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-ink bg-sun">
              <Zap
                className="size-6 text-ink"
                strokeWidth={2.6}
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="font-display text-3xl font-extrabold leading-none">
                {loading ? "—" : xp.toLocaleString()}
                <span className="ml-1 text-lg">XP</span>
              </p>
              <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-vio">
                {loading ? "Loading rank…" : `Rank // ${rank.name}`}
              </p>
            </div>
          </div>

          <div
            className="mt-4 h-3 overflow-hidden rounded-full border-2 border-ink bg-paper p-[1px]"
            role="progressbar"
            aria-label="Progress toward next rank"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              loading ? undefined : Math.round(rankProgress)
            }
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-vio via-blush to-sun transition-[width] duration-500 motion-reduce:transition-none"
              style={{
                width: `${loading ? 0 : rankProgress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/55">
            <span>
              {loading
                ? "Syncing…"
                : upcomingRank
                  ? `${(upcomingRank.minXp - xp).toLocaleString()} XP to ${upcomingRank.name}`
                  : "Top rank reached"}
            </span>
            <span>
              {loading
                ? "—"
                : `${state?.badges.length ?? 0}/${BADGES.length}`}{" "}
              badges
            </span>
          </div>
        </div>
      </div>

      {/* A prominent next step, like the calls to action elsewhere on the site. */}
      {!compact && !loading && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-y-[3px] border-ink bg-sun px-5 py-3 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-ink text-sun">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/65">
                {nextNode ? "Next target" : "Full network"}
              </p>
              <p className="font-display text-base font-extrabold leading-tight sm:text-lg">
                {nextNode?.lesson.title ?? "Every neuron is online."}
              </p>
              {nextNode && (
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/65">
                  {nextNode.moduleTitle} · {nextNode.lesson.minutes} min ·{" "}
                  {nextNode.lesson.xp} base XP
                </p>
              )}
            </div>
          </div>

          {nextNode && (
            <Link
              href={lessonPath(nextNode.lesson)}
              className="btn btn-violet shrink-0"
            >
              {nextNode.lesson.kind === "boss"
                ? "Start boss fight"
                : "Launch mission"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}

      {/* Actual game board. No fixed SVG positioning or foreignObject icons. */}
      <div className="nm-board bg-ink px-4 pb-6 pt-5 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-paper/70">
          <span className="flex items-center gap-2 text-lime">
            <span
              className="nm-beacon size-2.5 rounded-full bg-lime"
              aria-hidden="true"
            />
            Circuit view // live
          </span>

          <span>
            {layers.length} layers · {total} nodes · {bossCount} bosses
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-3 lg:gap-7">
          {layers.map((layer, layerIndex) => {
            const remaining = layer.nodes.length - layer.count;

            return (
              <div key={layer.mod.slug} className="relative min-w-0">
                <section
                  aria-labelledby={`${titleId}-layer-${layerIndex}`}
                  className="flex h-full flex-col overflow-hidden rounded-[20px] border-[3px] border-ink bg-paper"
                  style={{
                    boxShadow: `5px 5px 0 ${layer.mod.color}`,
                  }}
                >
                  <div
                    className="h-2 border-b-2 border-ink"
                    style={{ backgroundColor: layer.mod.color }}
                    aria-hidden="true"
                  />

                  <div className="border-b-2 border-ink bg-white px-4 pb-4 pt-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="rounded-lg border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: layer.mod.color,
                          color: layerIndex === 0 ? "#FFFFFF" : INK,
                        }}
                      >
                        {layer.mod.codename}
                      </span>

                      <span
                        className={`rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          layer.full ? "bg-lime" : "bg-paper"
                        }`}
                      >
                        {loading
                          ? "…"
                          : layer.full
                            ? "Online"
                            : `${layer.count}/${layer.nodes.length}`}
                      </span>
                    </div>

                    <h3
                      id={`${titleId}-layer-${layerIndex}`}
                      className="mt-3 font-display text-xl font-extrabold leading-tight tracking-tight"
                    >
                      {layer.mod.title}
                    </h3>

                    <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/50">
                      Neural layer {String(layerIndex + 1).padStart(2, "0")}
                    </p>

                    <div className="mt-3 flex gap-1" aria-hidden="true">
                      {layer.nodes.map((node) => (
                        <span
                          key={node.lesson.slug}
                          className="h-2 flex-1 rounded-full border border-ink/40"
                          style={{
                            backgroundColor: node.done
                              ? layer.mod.color
                              : "#FFFFFF",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <ol className="m-0 list-none px-3 py-4">
                    {layer.nodes.map((node, nodeIndex) => {
                      const { lesson } = node;
                      const isBoss = lesson.kind === "boss";
                      const isNext =
                        lesson.slug === nextNode?.lesson.slug;
                      const darkBoss = isBoss && !node.done;

                      const nextInLayer =
                        layer.nodes[nodeIndex + 1];

                      const connectionLit =
                        !!nextInLayer &&
                        node.done &&
                        nextInLayer.done;

                      const connectionScanned =
                        !!nextInLayer &&
                        (activeSlug === lesson.slug ||
                          activeSlug ===
                            nextInLayer.lesson.slug);

                      const orbBackground = node.done
                        ? layer.mod.color
                        : isBoss
                          ? SUN
                          : isNext
                            ? "#FFFFFF"
                            : "#FFF6E9";

                      // Purple gets a white check; the brighter module colors
                      // get an ink check for contrast.
                      const orbForeground =
                        node.done && layerIndex === 0
                          ? "#FFFFFF"
                          : INK;

                      return (
                        <li key={lesson.slug}>
                          <Link
                            href={lessonPath(lesson)}
                            onMouseEnter={() =>
                              setHoveredSlug(lesson.slug)
                            }
                            onMouseLeave={() =>
                              setHoveredSlug(null)
                            }
                            onFocus={() =>
                              setFocusedSlug(lesson.slug)
                            }
                            onBlur={() =>
                              setFocusedSlug(null)
                            }
                            aria-label={`${lesson.title}. ${
                              isBoss ? "Boss fight. " : ""
                            }${
                              node.done
                                ? "Cleared; replay earns no additional XP."
                                : `${lesson.xp} base XP plus combo bonus.`
                            }${isNext ? " Recommended next mission." : ""}`}
                            className={`nm-mission group relative flex min-h-[82px] items-center gap-3 rounded-xl border-2 border-ink px-3 py-2 shadow-[3px_3px_0_#171321] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-sun ${
                              darkBoss
                                ? "bg-ink text-paper"
                                : isBoss && node.done
                                  ? "bg-sun text-ink"
                                  : isNext
                                    ? "nm-next bg-lime text-ink"
                                    : "bg-white text-ink"
                            }`}
                            style={
                              {
                                "--nm-accent": layer.mod.color,
                              } as CSSProperties
                            }
                          >
                            <span
                              className="nm-orb grid size-12 shrink-0 place-items-center rounded-full border-[3px] border-ink"
                              style={{
                                backgroundColor: orbBackground,
                                color: orbForeground,
                              }}
                              aria-hidden="true"
                            >
                              {node.done ? (
                                <Check
                                  className="block size-6"
                                  strokeWidth={3.2}
                                />
                              ) : isBoss ? (
                                <Skull
                                  className="block size-6"
                                  strokeWidth={2.3}
                                />
                              ) : (
                                <span className="font-display text-lg font-extrabold leading-none">
                                  {lesson.index + 1}
                                </span>
                              )}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span
                                className={`block font-mono text-[10px] font-bold uppercase tracking-wider ${
                                  darkBoss
                                    ? "text-sun"
                                    : "text-ink/55"
                                }`}
                              >
                                {isBoss
                                  ? node.done
                                    ? "Boss cleared"
                                    : "Boss fight"
                                  : `Mission ${String(
                                      lesson.index + 1,
                                    ).padStart(2, "0")}`}
                              </span>

                              <span
                                className={`mt-0.5 block font-display text-[14px] font-extrabold leading-snug ${
                                  darkBoss
                                    ? "text-paper"
                                    : "text-ink"
                                }`}
                              >
                                {lesson.title}
                              </span>

                              <span
                                className={`mt-1 block font-mono text-[10px] font-bold uppercase tracking-wider ${
                                  darkBoss
                                    ? "text-paper/65"
                                    : "text-ink/55"
                                }`}
                              >
                                {node.done
                                  ? "Cleared · replay for practice"
                                  : `${lesson.xp} base XP + combo`}
                              </span>
                            </span>

                            <ArrowRight
                              className={`size-4 shrink-0 ${
                                darkBoss
                                  ? "text-sun"
                                  : "text-ink/45"
                              }`}
                              aria-hidden="true"
                            />

                            {isNext && (
                              <span
                                className="absolute -right-1 -top-2.5 rotate-6 rounded-md border-2 border-ink bg-sun px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_#171321]"
                                aria-hidden="true"
                              >
                                Next
                              </span>
                            )}
                          </Link>

                          {/* The wire lights fully only when both endpoints
                              are cleared; a single cleared endpoint powers
                              the first half. */}
                          {nextInLayer && (
                            <span
                              className="ml-[34px] block h-3 w-[5px] border-x border-ink/30"
                              style={{
                                background: connectionLit
                                  ? layer.mod.color
                                  : connectionScanned
                                    ? SUN
                                    : node.done
                                      ? `linear-gradient(to bottom, ${layer.mod.color} 50%, #C8C2D0 50%)`
                                      : "#C8C2D0",
                              }}
                              aria-hidden="true"
                            />
                          )}
                        </li>
                      );
                    })}
                  </ol>

                  <div
                    className={`mt-auto flex items-center gap-2 border-t-2 border-ink px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider ${
                      layer.full
                        ? "bg-lime text-ink"
                        : "bg-white text-ink/65"
                    }`}
                  >
                    {layer.full ? (
                      <>
                        <Zap
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        {layerIndex < layers.length - 1
                          ? "Layer energized · bridge live"
                          : "Layer energized · full network"}
                      </>
                    ) : (
                      <>
                        <BrainCircuit
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        {remaining} more to energize this layer
                      </>
                    )}
                  </div>
                </section>

                {/* Connect the module boards. A completed module powers
                    its outgoing bridge even before the next module begins. */}
                {layerIndex < layers.length - 1 && (
                  <>
                    <div
                      className="absolute -right-[30px] top-1/2 z-10 hidden h-9 w-[30px] -translate-y-1/2 items-center justify-center lg:flex"
                      aria-hidden="true"
                    >
                      <span
                        className="absolute inset-x-0 h-2 rounded-full border-y-2 border-ink"
                        style={{
                          backgroundColor: layer.full
                            ? LIME
                            : "#FFF6E9",
                        }}
                      />
                      <span
                        className={`relative grid size-6 place-items-center rounded-full border-2 border-ink ${
                          layer.full ? "bg-lime" : "bg-paper"
                        }`}
                      >
                        <Zap className="size-3" />
                      </span>
                    </div>

                    <div
                      className={`mx-auto mt-4 grid size-8 place-items-center rounded-full border-2 border-ink lg:hidden ${
                        layer.full ? "bg-lime" : "bg-white"
                      }`}
                      aria-hidden="true"
                    >
                      <ArrowDown className="size-4" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Hover/focus gives feedback; on touch, this defaults to next up. */}
        {!compact && !loading && preview && (
          <div
            className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 bg-paper/10 p-4 text-paper"
            style={{ borderColor: preview.moduleColor }}
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
                <span
                  className="size-2 rounded-full bg-lime"
                  aria-hidden="true"
                />
                {activeSlug
                  ? "Node scan"
                  : nextNode
                    ? "Recommended next"
                    : "Network complete"}
              </p>

              <p className="mt-1 font-display text-xl font-extrabold">
                {preview.lesson.title}
              </p>

              <p className="mt-1 font-mono text-[10px] uppercase leading-relaxed tracking-wider text-paper/65">
                {preview.moduleTitle} · {preview.lesson.minutes} min ·{" "}
                {preview.done
                  ? "Cleared · replays are for practice"
                  : `${preview.lesson.xp} base XP + combo bonus`}
              </p>
            </div>

            <Link
              href={lessonPath(preview.lesson)}
              className="btn btn-primary shrink-0"
            >
              {preview.done
                ? "Review mission"
                : preview.lesson.kind === "boss"
                  ? "Start boss fight"
                  : "Open mission"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        )}

        <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-wider text-paper/55">
          All lessons are open. XP is banked after passing a checkpoint.
          This circuit visualizes learning progress; it is not a trained AI
          model. Progress saves in this browser.
        </p>
      </div>

      <style>{`
        .nm-board {
          background-image: radial-gradient(
            rgba(255, 246, 233, 0.12) 0.8px,
            transparent 0.8px
          );
          background-size: 18px 18px;
        }

        .nm-mission {
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .nm-orb {
          transition: transform 180ms ease;
        }

        .nm-mission:hover,
        .nm-mission:focus-visible {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--nm-accent);
        }

        .nm-mission:hover .nm-orb,
        .nm-mission:focus-visible .nm-orb {
          transform: scale(1.08);
        }

        .nm-next {
          animation: nm-target 2.6s ease-in-out infinite;
        }

        .nm-beacon {
          animation: nm-beacon 2.3s ease-in-out infinite;
        }

        @keyframes nm-target {
          0%, 100% {
            box-shadow: 3px 3px 0 #171321;
          }
          50% {
            box-shadow:
              3px 3px 0 #171321,
              0 0 0 4px rgba(198, 243, 46, 0.55);
          }
        }

        @keyframes nm-beacon {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nm-next,
          .nm-beacon {
            animation: none;
          }

          .nm-mission,
          .nm-orb {
            transition: none;
          }

          .nm-mission:hover,
          .nm-mission:focus-visible,
          .nm-mission:hover .nm-orb,
          .nm-mission:focus-visible .nm-orb {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
