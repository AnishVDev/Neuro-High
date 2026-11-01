"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Check,
  Compass,
  Flame,
  LayoutDashboard,
  ListChecks,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import StartCta from "@/components/StartCta";
import { BadgeShelf, CodenameEditor, RankLadder, XpBar } from "@/components/widgets";
import { ALL_LESSON_LIST, TOTAL_LESSONS } from "@/content";
import { BADGES } from "@/lib/gamification";
import { useProgress } from "@/components/ProgressProvider";

export default function DashboardClient() {
  const { state, loading, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAllMissions, setShowAllMissions] = useState(false);

  const done = Object.keys(state?.completed ?? {}).length;
  const badges = state?.badges.length ?? 0;
  const streak = state?.learner.streak ?? 1;

  const nextUpIndex = ALL_LESSON_LIST.findIndex((l) => !state?.completed[l.slug]);
  const nextUp = nextUpIndex >= 0 ? ALL_LESSON_LIST[nextUpIndex] : undefined;
  const pct = TOTAL_LESSONS > 0 ? Math.round((done / TOTAL_LESSONS) * 100) : 0;

  // Show a 4-mission window centered around the active mission (or full list if toggled)
  const pivotIndex =
    nextUpIndex === -1
      ? Math.max(0, ALL_LESSON_LIST.length - 4)
      : Math.max(0, Math.min(nextUpIndex - 1, ALL_LESSON_LIST.length - 4));
  const visibleMissions = showAllMissions
    ? ALL_LESSON_LIST.map((lesson, idx) => ({ lesson, idx }))
    : ALL_LESSON_LIST.slice(pivotIndex, pivotIndex + 4).map((lesson, offset) => ({
        lesson,
        idx: pivotIndex + offset,
      }));

  const halfwayTarget = Math.max(1, Math.ceil(TOTAL_LESSONS / 2));
  const badgeTarget = Math.max(1, Math.min(3, BADGES.length));

  const milestones = [
    {
      id: "first-contact",
      label: "First contact",
      detail: "Clear your opening mission",
      current: Math.min(done, 1),
      target: 1,
    },
    {
      id: "streak-3",
      label: "3-day streak",
      detail: "Finish missions three days in a row",
      current: Math.min(streak, 3),
      target: 3,
    },
    {
      id: "halfway",
      label: "Halfway checkpoint",
      detail: `Clear ${halfwayTarget} of ${TOTAL_LESSONS} missions`,
      current: Math.min(done, halfwayTarget),
      target: halfwayTarget,
    },
    {
      id: "badge-hunter",
      label: "Hardware hunter",
      detail: `Unlock ${badgeTarget} badge${badgeTarget === 1 ? "" : "s"}`,
      current: Math.min(badges, badgeTarget),
      target: badgeTarget,
    },
    {
      id: "full-clearance",
      label: "Full clearance",
      detail: `Complete all ${TOTAL_LESSONS} missions`,
      current: Math.min(done, Math.max(1, TOTAL_LESSONS)),
      target: Math.max(1, TOTAL_LESSONS),
    },
  ];

  const milestonesDone = milestones.filter((m) => m.current >= m.target).length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      {/* header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-vio">
          <LayoutDashboard className="size-4" /> Mission control
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          {loading ? (
            <div className="h-12 w-72 animate-pulse rounded-xl border-2 border-ink/10 bg-white" />
          ) : (
            <CodenameEditor />
          )}
          <span className="chip bg-white text-ink/60">agent on record</span>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
          Your codename, your XP, your badges, and your active mission briefing. Everything
          below is earned, none of it is given.
        </p>
      </motion.div>

      {/* stat row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]"
      >
        <div className="sticker bg-white p-5 lg:col-span-1">
          <XpBar tall />
        </div>
        <div className="sticker flex flex-col justify-between bg-white p-5">
          <p className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
            Missions cleared <Target className="size-4 text-vio" />
          </p>
          <p className="font-display text-4xl font-extrabold text-ink">
            {done}
            <span className="text-ink/30">/{TOTAL_LESSONS}</span>
          </p>
          <div className="mt-1 h-2.5 rounded-full border border-ink/40 bg-paper p-[1.5px]">
            <div
              className="h-full rounded-full bg-vio transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="sticker flex flex-col justify-between bg-white p-5">
          <p className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
            Badges <Award className="size-4 text-sun" />
          </p>
          <p className="font-display text-4xl font-extrabold text-ink">
            {badges}
            <span className="text-ink/30">/{BADGES.length}</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink/50">
            {badges === 0
              ? "the shelf is hungry"
              : badges >= BADGES.length
                ? "complete set. ridiculous."
                : "keep hunting"}
          </p>
        </div>
        <div className="sticker flex flex-col justify-between bg-white p-5">
          <p className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
            Day streak <Flame className="size-4 text-coral" />
          </p>
          <p className="font-display text-4xl font-extrabold text-ink">
            {streak}
            <span className="text-lg text-ink/30"> day{streak === 1 ? "" : "s"}</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink/50">
            finish a lesson today to grow it
          </p>
        </div>
      </motion.div>

      {/* active directive + field milestones */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]"
      >
        {/* active briefing */}
        <section className="sticker flex flex-col justify-between bg-white p-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-vio">
                <Compass className="size-4" />
                {nextUp ? "Active directive" : "Campaign debrief"}
              </p>
              <span className="chip bg-paper text-ink/70">
                {nextUp
                  ? `Mission ${String(nextUpIndex + 1).padStart(2, "0")} / ${String(TOTAL_LESSONS).padStart(2, "0")}`
                  : "100% cleared"}
              </span>
            </div>

            {loading ? (
              <div className="mt-4 h-9 w-3/4 animate-pulse rounded-lg bg-ink/10" />
            ) : (
              <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {nextUp ? nextUp.title : "Every mission cleared. Take a bow, agent."}
              </h2>
            )}

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
              {!nextUp
                ? "Nothing left on the board. You ran the entire curriculum from start to finish—revisit any lesson anytime to sharpen up."
                : done === 0
                  ? "Your dossier is open and your first briefing is queued up. Clear it to earn your opening XP and kick off your streak."
                  : "Pick up right where you left off. Clearing this mission pushes your rank forward and locks in today's streak."}
            </p>

            {/* segmented campaign track */}
            <div className="mt-5">
              <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                <span>Campaign flight plan</span>
                <span>{pct}% complete</span>
              </div>
              <div className="mt-2 flex gap-1">
                {ALL_LESSON_LIST.map((lesson, idx) => {
                  const isDone = Boolean(state?.completed[lesson.slug]);
                  const isCurrent = idx === nextUpIndex;
                  return (
                    <div
                      key={lesson.slug}
                      title={`${idx + 1}. ${lesson.title}`}
                      className={`h-2.5 flex-1 rounded-sm border border-ink/35 transition-all ${
                        isDone
                          ? "bg-vio"
                          : isCurrent
                            ? "bg-sun"
                            : "bg-paper"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* mission queue */}
            <div className="mt-5 rounded-xl border-2 border-ink/15 bg-paper p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/55">
                  {showAllMissions ? "All missions" : "On radar"}
                </span>
                {ALL_LESSON_LIST.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllMissions((v) => !v)}
                    className="font-mono text-[10px] font-bold uppercase tracking-wider text-vio hover:underline"
                  >
                    {showAllMissions ? "Compact view" : `View all (${TOTAL_LESSONS})`}
                  </button>
                )}
              </div>

              <ul
                className={`mt-2.5 space-y-1.5 ${
                  showAllMissions ? "max-h-60 overflow-y-auto pr-1" : ""
                }`}
              >
                {visibleMissions.map(({ lesson, idx }) => {
                  const isDone = Boolean(state?.completed[lesson.slug]);
                  const isCurrent = idx === nextUpIndex;

                  return (
                    <li
                      key={lesson.slug}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs transition-colors ${
                        isCurrent
                          ? "border-ink bg-white font-semibold text-ink"
                          : isDone
                            ? "border-ink/10 bg-white/60 text-ink/55"
                            : "border-transparent text-ink/50"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] font-bold ${
                            isDone
                              ? "border-ink bg-vio text-white"
                              : isCurrent
                                ? "border-ink bg-sun text-ink"
                                : "border-ink/25 bg-white text-ink/45"
                          }`}
                        >
                          {isDone ? <Check className="size-3" /> : idx + 1}
                        </span>
                        <span className={`truncate ${isDone ? "line-through" : ""}`}>
                          {lesson.title}
                        </span>
                      </div>

                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider">
                        {isDone ? (
                          <span className="text-vio">Cleared</span>
                        ) : isCurrent ? (
                          <span className="text-coral">Up next</span>
                        ) : (
                          <span className="text-ink/35">Queued</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-ink/15 pt-4">
            <StartCta />
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink/45">
              {nextUp
                ? `${TOTAL_LESSONS - done} mission${TOTAL_LESSONS - done === 1 ? "" : "s"} remaining`
                : "All directives fulfilled"}
            </p>
          </div>
        </section>

        {/* field milestones */}
        <section className="sticker flex flex-col justify-between bg-white p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-vio">
                <ListChecks className="size-4" /> Field milestones
              </p>
              <span className="chip bg-paper text-ink/70">
                {milestonesDone}/{milestones.length} cleared
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">
              Tactical targets
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-ink/60">
              Short-range checkpoints that track consistency, breadth, and badge hunting.
            </p>

            <ul className="mt-5 space-y-3">
              {milestones.map((m) => {
                const cleared = m.current >= m.target;
                const progress = Math.min(100, Math.round((m.current / m.target) * 100));

                return (
                  <li
                    key={m.id}
                    className={`rounded-xl border-2 p-3 transition-colors ${
                      cleared
                        ? "border-ink bg-paper"
                        : "border-ink/15 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                            cleared
                              ? "border-ink bg-vio text-white"
                              : "border-ink/30 bg-paper text-ink/30"
                          }`}
                        >
                          <Check className="size-3" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-ink">{m.label}</p>
                          <p className="text-[11px] text-ink/55">{m.detail}</p>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/55">
                        {cleared ? "Done" : `${m.current}/${m.target}`}
                      </span>
                    </div>

                    {!cleared && (
                      <div className="mt-2.5 h-2 rounded-full border border-ink/30 bg-paper p-[1px]">
                        <div
                          className="h-full rounded-full bg-sun transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-ink/60">
            <Sparkles className="size-3.5 shrink-0 text-vio" />
            <span>
              {milestonesDone === milestones.length
                ? "Every milestone checked off. Certified overachiever."
                : "Tip: daily streaks + new missions unlock badges faster"}
            </span>
          </div>
        </section>
      </motion.div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Badge shelf
          </h2>
          <div className="mt-4">
            <BadgeShelf />
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Rank ladder
          </h2>
          <div className="mt-4">
            <RankLadder />
          </div>
        </section>
      </div>

      {/* danger zone */}
      <div className="mt-14 border-t-2 border-dashed border-ink/25 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/45">
            Danger zone — wipe your build and start fresh
          </p>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="btn btn-ghost !py-2 !text-[10px] text-ink/60"
            >
              <RotateCcw className="size-3.5" /> Reset progress
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  await reset();
                  setConfirmReset(false);
                }}
                className="btn btn-coral !py-2 !text-[10px]"
              >
                <Trash2 className="size-3.5" /> Yes, wipe it
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="btn btn-ghost !py-2 !text-[10px]"
              >
                Keep my build
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
