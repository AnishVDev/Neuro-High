"use client";

import Link from "next/link";
import {
  useId,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Skull,
  Zap,
} from "lucide-react";
import { MODULES, lessonPath, lessonsOf } from "@/content";
import { nextRank, rankFor } from "@/lib/gamification";
import { useProgress } from "./ProgressProvider";

// Colors are local to this component; the site's global theme stays unchanged.
const PALETTE = [
  { accent: "#7047EB", soft: "#F1ECFF" },
  { accent: "#087F8C", soft: "#E5F6F7" },
  { accent: "#C24A2D", soft: "#FFF0E9" },
];

const MAP_WIDTH = 1000;
const FIRST_NODE_Y = 132;
const ROW_GAP = 112;
const NODE_BOX = 56;

export default function NeuralMap({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { state, isCompleted, loading } = useProgress();
  const mapId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);

  const xp = state?.learner.xp ?? 0;
  const rank = rankFor(xp);
  const upcomingRank = nextRank(xp);

  const layers = useMemo(
    () =>
      MODULES.map((mod, index) => ({
        mod,
        theme: PALETTE[index % PALETTE.length],
        x: ((index + 0.5) / MODULES.length) * MAP_WIDTH,
        nodes: lessonsOf(mod.slug).map((lesson, lessonIndex) => ({
          lesson,
          done: isCompleted(lesson.slug),
          y: FIRST_NODE_Y + lessonIndex * ROW_GAP,
        })),
      })),
    [isCompleted],
  );

  const nodes = layers.flatMap((layer) =>
    layer.nodes.map((node) => ({
      ...node,
      moduleTitle: layer.mod.title,
    })),
  );

  const total = nodes.length;
  const cleared = nodes.filter((node) => node.done).length;
  const integrity = total > 0 ? Math.round((cleared / total) * 100) : 0;

  const nextNode = nodes.find((node) => !node.done);
  const activeSlug = focusedSlug ?? hoveredSlug;

  const preview =
    nodes.find((node) => node.lesson.slug === activeSlug) ??
    nextNode ??
    nodes[0];

  const maxRows = Math.max(1, ...layers.map((layer) => layer.nodes.length));
  const mapHeight = FIRST_NODE_Y + (maxRows - 1) * ROW_GAP + 84;

  // A simplified network: nearby connections rather than an all-to-all mesh.
  // These connections are decorative, not lesson prerequisites.
  const edges = layers.slice(0, -1).flatMap((layer, layerIndex) => {
    const targetLayer = layers[layerIndex + 1];
    const midpoint = (layer.x + targetLayer.x) / 2;

    return layer.nodes.flatMap((source, sourceIndex) => {
      const alignedIndex = Math.round(
        (sourceIndex / Math.max(1, layer.nodes.length - 1)) *
          Math.max(0, targetLayer.nodes.length - 1),
      );

      return targetLayer.nodes
        .filter((_, targetIndex) => Math.abs(targetIndex - alignedIndex) <= 1)
        .map((target) => ({
          source,
          target,
          layerIndex,
          path: [
            `M ${layer.x} ${source.y}`,
            `C ${midpoint} ${source.y},`,
            `${midpoint} ${target.y},`,
            `${targetLayer.x} ${target.y}`,
          ].join(" "),
        }));
    });
  });

  return (
    <section
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white text-slate-900 shadow-[0_16px_50px_-24px_rgba(31,41,72,0.3)]"
      aria-label="Your AI learning network"
      aria-busy={loading}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-5 p-5 sm:p-6">
        <div className="max-w-lg">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-violet-700">
            Your neural build
          </p>

          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Build your AI skill network
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Each node is a lesson. Clear its checkpoint to make a new connection.
          </p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
          <p className="flex items-center gap-2 font-display text-xl font-extrabold text-violet-800">
            <Zap className="size-5" aria-hidden="true" />
            {loading ? "—" : xp.toLocaleString()} XP
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {loading ? "Loading progress…" : rank.name}
          </p>

          {!loading && upcomingRank && (
            <p className="mt-1 text-xs text-slate-600">
              {Math.max(0, upcomingRank.minXp - xp).toLocaleString()} XP to{" "}
              {upcomingRank.name}
            </p>
          )}

          {!loading && !upcomingRank && (
            <p className="mt-1 text-xs text-slate-600">
              Highest rank reached
            </p>
          )}
        </div>
      </div>

      {/* Overall progress and next action */}
      <div className="px-5 pb-5 sm:px-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">
            {loading
              ? "Loading your build…"
              : `${cleared} / ${total} lessons completed`}
          </p>

          <span className="font-mono text-sm font-bold text-violet-700">
            {loading ? "—" : `${integrity}%`}
          </span>
        </div>

        <div
          className="h-2.5 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label="Lessons completed"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={loading ? undefined : integrity}
          aria-valuetext={
            loading
              ? "Loading progress"
              : `${cleared} of ${total} lessons completed`
          }
        >
          <div
            className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
            style={{
              width: `${loading ? 0 : integrity}%`,
              background:
                "linear-gradient(90deg, #7047EB 0%, #087F8C 65%, #C24A2D 100%)",
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2
                className="size-4 text-violet-700"
                aria-hidden="true"
              />
              Completed
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-3 rounded-full border-2 border-slate-400 bg-white"
                aria-hidden="true"
              />
              Available
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-3 rounded-full border-2 border-violet-600 ring-2 ring-violet-100"
                aria-hidden="true"
              />
              Up next
            </span>
          </div>

          {!loading && nextNode && (
            <Link
              href={lessonPath(nextNode.lesson)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
            >
              {cleared > 0 ? "Continue learning" : "Start learning"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}

          {!loading && total > 0 && !nextNode && (
            <p className="inline-flex items-center gap-2 text-sm font-bold text-violet-700">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Network complete
            </p>
          )}
        </div>
      </div>

      {/* Responsive network: diagram on desktop, lesson lists on mobile */}
      <div
        className="network-board border-y border-slate-200"
        style={{ "--map-height": `${mapHeight}px` } as CSSProperties}
      >
        {/* Decorative SVG only. The interactive nodes below are HTML links. */}
        <svg
          className="network-svg"
          viewBox={`0 0 ${MAP_WIDTH} ${mapHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {layers.slice(0, -1).map((layer, index) => (
              <linearGradient
                key={layer.mod.slug}
                id={`${mapId}-edge-${index}`}
                gradientUnits="userSpaceOnUse"
                x1={layer.x}
                y1={0}
                x2={layers[index + 1].x}
                y2={0}
              >
                <stop offset="0%" stopColor={layer.theme.accent} />
                <stop
                  offset="100%"
                  stopColor={layers[index + 1].theme.accent}
                />
              </linearGradient>
            ))}
          </defs>

          {/* Soft column backgrounds */}
          {layers.map((layer, index) => (
            <rect
              key={layer.mod.slug}
              x={(index / layers.length) * MAP_WIDTH + 10}
              y={10}
              width={MAP_WIDTH / layers.length - 20}
              height={mapHeight - 20}
              rx={22}
              fill={layer.theme.soft}
              fillOpacity={0.7}
            />
          ))}

          {/* Curved connections */}
          {edges.map((edge) => {
            const highlighted =
              edge.source.lesson.slug === activeSlug ||
              edge.target.lesson.slug === activeSlug;

            const bothDone = edge.source.done && edge.target.done;
            const started = edge.source.done || edge.target.done;
            const flowing = started && highlighted;

            return (
              <path
                key={`${edge.source.lesson.slug}-${edge.target.lesson.slug}`}
                d={edge.path}
                fill="none"
                stroke={
                  started || highlighted
                    ? `url(#${mapId}-edge-${edge.layerIndex})`
                    : "#AEBBD0"
                }
                strokeWidth={highlighted ? 2.5 : bothDone ? 2 : 1.4}
                strokeOpacity={
                  highlighted ? 0.95 : bothDone ? 0.7 : started ? 0.5 : 0.3
                }
                strokeLinecap="round"
                strokeDasharray={flowing ? "6 10" : undefined}
                vectorEffect="non-scaling-stroke"
                className={flowing ? "network-flow" : undefined}
              />
            );
          })}
        </svg>

        {/* Actual interactive content */}
        {layers.map((layer, layerIndex) => {
          const completedCount = layer.nodes.filter((node) => node.done).length;
          const layerComplete =
            layer.nodes.length > 0 && completedCount === layer.nodes.length;

          const layerPercent =
            layer.nodes.length > 0
              ? (completedCount / layer.nodes.length) * 100
              : 0;

          return (
            <div
              key={layer.mod.slug}
              className="network-layer rounded-2xl border border-slate-200 bg-white p-3 md:rounded-none md:border-0 md:bg-transparent md:p-0"
              style={
                {
                  "--layer-left": `${(layerIndex / layers.length) * 100}%`,
                  "--layer-width": `${100 / layers.length}%`,
                } as CSSProperties
              }
            >
              <div className="px-2 pb-4 pt-2 md:px-3 md:pt-4 md:text-center">
                <p
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: layer.theme.accent }}
                >
                  {layer.mod.codename}
                </p>

                <h3 className="mt-1 font-display text-base font-extrabold text-slate-900">
                  {layer.mod.title}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 md:justify-center">
                  {layerComplete && (
                    <CheckCircle2
                      className="size-3.5"
                      style={{ color: layer.theme.accent }}
                      aria-hidden="true"
                    />
                  )}
                  {loading
                    ? "Loading…"
                    : `${completedCount}/${layer.nodes.length} cleared`}
                  {layerComplete && " · Layer complete"}
                </p>

                <div className="mt-2 h-1 w-28 overflow-hidden rounded-full bg-white md:mx-auto">
                  <div
                    className="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
                    style={{
                      width: `${layerPercent}%`,
                      backgroundColor: layer.theme.accent,
                    }}
                  />
                </div>
              </div>

              <ol
                className="m-0 grid list-none gap-2 p-0 md:block"
                role="list"
              >
                {layer.nodes.map((node) => {
                  const isNext =
                    !loading && node.lesson.slug === nextNode?.lesson.slug;
                  const isBoss = node.lesson.kind === "boss";

                  const status = node.done
                    ? "Completed. Replay for practice; no extra XP."
                    : `${node.lesson.xp} base XP plus combo bonus.${
                        isNext ? " Recommended next lesson." : ""
                      }`;

                  return (
                    <li
                      key={node.lesson.slug}
                      className="network-node"
                      style={
                        {
                          "--node-top": `${node.y - NODE_BOX / 2}px`,
                        } as CSSProperties
                      }
                    >
                      <Link
                        href={lessonPath(node.lesson)}
                        onMouseEnter={() => setHoveredSlug(node.lesson.slug)}
                        onMouseLeave={() => setHoveredSlug(null)}
                        onFocus={() => setFocusedSlug(node.lesson.slug)}
                        onBlur={() => setFocusedSlug(null)}
                        aria-label={`${node.lesson.title}. ${status}`}
                        title={`${node.lesson.title} — ${status}`}
                        className="group flex items-center gap-3 rounded-xl px-2 py-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600 md:flex-col md:gap-1 md:px-0 md:py-0 md:text-center"
                      >
                        <span className="network-orb-wrap">
                          {isNext && (
                            <span
                              className="network-next-ring"
                              style={{ borderColor: layer.theme.accent }}
                              aria-hidden="true"
                            />
                          )}

                          <span
                            className={`network-orb${isBoss ? " boss" : ""}`}
                            style={{
                              backgroundColor: node.done
                                ? layer.theme.accent
                                : "#FFFFFF",
                              color: node.done
                                ? "#FFFFFF"
                                : layer.theme.accent,
                              borderColor:
                                node.done || isNext
                                  ? layer.theme.accent
                                  : "#CBD5E1",
                              boxShadow: node.done
                                ? `0 6px 18px ${layer.theme.accent}35`
                                : "0 3px 8px rgba(30, 41, 59, 0.06)",
                            }}
                          >
                            {node.done ? (
                              <Check
                                className="size-6"
                                strokeWidth={3}
                                aria-hidden="true"
                              />
                            ) : isBoss ? (
                              <Skull
                                className="size-6"
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                className="font-mono text-sm font-bold"
                                aria-hidden="true"
                              >
                                {node.lesson.index + 1}
                              </span>
                            )}
                          </span>
                        </span>

                        <span className="min-w-0 flex-1 md:flex-none">
                          <span className="block rounded-lg px-1 py-0.5 text-[13px] font-semibold leading-snug text-slate-800 md:bg-white/90">
                            {node.lesson.title}
                          </span>

                          <span className="mt-0.5 block text-xs text-slate-600 md:hidden">
                            {isBoss ? "Boss challenge · " : ""}
                            {node.done
                              ? "Completed"
                              : `${isNext ? "Up next · " : ""}${
                                  node.lesson.xp
                                } base XP`}
                          </span>
                        </span>

                        <ArrowRight
                          className="ml-auto size-4 shrink-0 text-slate-500 md:hidden"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>

      {/* Preview panel: hover/focus updates it; links work without it. */}
      {!compact && preview && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
              {activeSlug
                ? "Lesson preview"
                : nextNode
                  ? "Your next connection"
                  : "Keep your skills sharp"}
            </p>

            <p className="mt-1 font-display text-lg font-bold text-slate-900">
              {preview.lesson.title}
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {preview.moduleTitle}
              {" · "}
              {preview.done
                ? "Completed · Replays award 0 XP"
                : `${preview.lesson.xp} base XP + combo bonus`}
            </p>
          </div>

          <Link
            href={lessonPath(preview.lesson)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:border-violet-400 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
          >
            {preview.done ? "Review lesson" : "Open lesson"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}

      <p className="border-t border-slate-100 px-5 py-3 text-[11px] leading-relaxed text-slate-600 sm:px-6">
        Choose any lesson to explore. Connections visualize your learning, not
        prerequisites. Progress is stored in this browser.
      </p>

      <style jsx>{`
        .network-board {
          position: relative;
          display: grid;
          gap: 12px;
          padding: 16px;
          background-color: #f8faff;
          background-image: radial-gradient(
            #dce3f0 0.7px,
            transparent 0.7px
          );
          background-size: 18px 18px;
        }

        .network-svg {
          display: none;
          pointer-events: none;
        }

        .network-orb-wrap {
          position: relative;
          display: grid;
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          place-items: center;
        }

        .network-orb {
          position: relative;
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border: 2px solid;
          border-radius: 999px;
          transition: transform 160ms ease;
        }

        .network-orb.boss {
          width: 56px;
          height: 56px;
        }

        .network-node:hover .network-orb,
        .network-node:focus-within .network-orb {
          transform: translateY(-2px) scale(1.06);
        }

        .network-next-ring {
          position: absolute;
          inset: -4px;
          border: 2px solid;
          border-radius: 999px;
          animation: network-beacon 2.6s ease-in-out infinite;
        }

        .network-flow {
          animation: network-flow 2s linear infinite;
        }

        @keyframes network-beacon {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.25;
          }
        }

        @keyframes network-flow {
          to {
            stroke-dashoffset: -32;
          }
        }

        @media (min-width: 768px) {
          .network-board {
            display: block;
            height: var(--map-height);
            padding: 0;
          }

          .network-svg {
            position: absolute;
            inset: 0;
            display: block;
            width: 100%;
            height: 100%;
          }

          .network-layer {
            position: absolute;
            top: 0;
            bottom: 0;
            left: var(--layer-left);
            width: var(--layer-width);
          }

          .network-node {
            position: absolute;
            top: var(--node-top);
            left: 50%;
            width: min(220px, 88%);
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .network-next-ring,
          .network-flow {
            animation: none;
          }

          .network-orb {
            transition: none;
          }

          .network-node:hover .network-orb,
          .network-node:focus-within .network-orb {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
