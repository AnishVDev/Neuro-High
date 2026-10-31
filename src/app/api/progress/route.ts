import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { badgeAwards, learners, lessonCompletions } from "@/db/schema";
import { BADGES, BadgeId, bumpStreak, lessonXp, nextRank, randomCodename, rankFor } from "@/lib/gamification";
import { getLessonBySlug, lessonsOf } from "@/content";
import type { Lesson } from "@/content/types";

export const dynamic = "force-dynamic";

const COOKIE = "neurohigh_learner";

type CompletionMap = Record<
  string,
  { correct: number; total: number; maxCombo: number; attempts: number; at: string }
>;

async function loadState(learnerId: string) {
  const [learner] = await db.select().from(learners).where(eq(learners.id, learnerId));
  const completions = await db.select().from(lessonCompletions).where(eq(lessonCompletions.learnerId, learnerId));
  const badges = await db.select().from(badgeAwards).where(eq(badgeAwards.learnerId, learnerId));

  const completed: CompletionMap = {};
  for (const c of completions) {
    completed[c.lessonSlug] = {
      correct: c.correct,
      total: c.total,
      maxCombo: c.maxCombo,
      attempts: c.attempts,
      at: c.completedAt.toISOString(),
    };
  }
  return {
    learner: {
      codename: learner?.codename ?? "Anon",
      xp: learner?.xp ?? 0,
      streak: learner?.streakDays ?? 1,
    },
    completed,
    badges: badges.map((b) => b.badgeId),
  };
}

async function getOrCreateLearner(req: NextRequest): Promise<{ id: string; fresh: boolean }> {
  const cookieId = req.cookies.get(COOKIE)?.value;
  if (cookieId) {
    const [existing] = await db.select({ id: learners.id }).from(learners).where(eq(learners.id, cookieId));
    if (existing) return { id: existing.id, fresh: false };
  }
  const [created] = await db.insert(learners).values({ codename: randomCodename() }).returning({ id: learners.id });
  return { id: created.id, fresh: true };
}

function setCookie(res: NextResponse, id: string) {
  res.cookies.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function GET(req: NextRequest) {
  const { id, fresh } = await getOrCreateLearner(req);
  const state = await loadState(id);
  const res = NextResponse.json({ state });
  if (fresh) setCookie(res, id);
  return res;
}

/** Compute every badge the learner has earned right now. */
function earnedBadges(
  completed: CompletionMap,
  hints: string[],
): string[] {
  const earned = new Set<string>();
  const slugs = Object.keys(completed);
  if (slugs.length >= 1) earned.add("first-contact");
  if (slugs.some((s) => completed[s].correct === completed[s].total && completed[s].attempts === 1))
    earned.add("flawless");
  if (slugs.some((s) => completed[s].maxCombo >= 5)) earned.add("hot-streak");
  for (const moduleSlug of ["foundations", "toolkit", "ethics"] as const) {
    const all = lessonsOf(moduleSlug).every((l: Lesson) => completed[l.slug]);
    if (!all) continue;
    if (moduleSlug === "foundations") earned.add("data-whisperer");
    if (moduleSlug === "toolkit") earned.add("kit-master");
    if (moduleSlug === "ethics") earned.add("team-human");
  }
  const allModules = (["foundations", "toolkit", "ethics"] as const).every((m) =>
    lessonsOf(m).every((l) => completed[l.slug]),
  );
  if (allModules) earned.add("triple-threat");
  for (const h of hints) if (BADGES.some((b) => b.id === h)) earned.add(h);
  return Array.from(earned);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const lessonSlug = typeof body?.lessonSlug === "string" ? body.lessonSlug : null;
  const hints: string[] = Array.isArray(body?.badgeHints) ? body.badgeHints.filter((h: unknown) => typeof h === "string") : [];

  const { id } = await getOrCreateLearner(req);

  // Hints-only request (interactive badge triggers, streak ping)
  if (!lessonSlug) {
    const state = await loadState(id);
    const current = earnedBadges(state.completed, hints);
    const newOnes = current.filter((b: string) => !state.badges.includes(b));
    for (const b of newOnes) await db.insert(badgeAwards).values({ learnerId: id, badgeId: b }).onConflictDoNothing();
    const res = NextResponse.json({
      state: { ...state, badges: [...state.badges, ...newOnes] },
      awarded: { xp: 0, badges: newOnes.map((b) => BADGES.find((x) => x.id === b)).filter(Boolean), rankUp: null },
    });
    setCookie(res, id);
    return res;
  }

  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) return NextResponse.json({ error: "Unknown lesson" }, { status: 400 });

  const total = lesson.quiz.length;
  const correct = Math.min(Math.max(Number(body?.correct) || 0, 0), total);
  const attempts = Math.max(Number(body?.attempts) || 1, 1);
  const maxCombo = Math.min(Math.max(Number(body?.maxCombo) || 0, 0), total);
  if (correct < total) return NextResponse.json({ error: "Lesson not passed" }, { status: 400 });

  const before = await loadState(id);
  const oldRankIdx = rankFor(before.learner.xp).minXp;

  // Insert completion (idempotent — replay awards no XP twice)
  const inserted = await db
    .insert(lessonCompletions)
    .values({ learnerId: id, lessonSlug, correct, total, maxCombo, attempts })
    .onConflictDoNothing()
    .returning({ id: lessonCompletions.id });

  let gained = 0;
  if (inserted.length > 0) {
    gained = lessonXp(lesson.xp, maxCombo);
    const [learner] = await db.select().from(learners).where(eq(learners.id, id));
    const streak = bumpStreak(learner.lastActiveDate, learner.streakDays);
    await db
      .update(learners)
      .set({ xp: learner.xp + gained, streakDays: streak.days, lastActiveDate: streak.date })
      .where(eq(learners.id, id));
  }

  const after = await loadState(id);
  const current = earnedBadges(after.completed, [...hints, ...(before.badges as string[])]);
  const newOnes = current.filter((b: string) => !after.badges.includes(b) && b !== undefined) as BadgeId[];
  for (const b of newOnes) await db.insert(badgeAwards).values({ learnerId: id, badgeId: b }).onConflictDoNothing();

  const newRank = rankFor(after.learner.xp);
  const rankUp = newRank.minXp !== oldRankIdx ? newRank : null;

  const res = NextResponse.json({
    state: { ...after, badges: [...after.badges, ...newOnes] },
    awarded: {
      xp: gained,
      already: inserted.length === 0,
      badges: newOnes.map((b) => BADGES.find((x) => x.id === b)).filter(Boolean),
      rankUp,
      nextRank: nextRank(after.learner.xp),
    },
  });
  setCookie(res, id);
  return res;
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const raw = typeof body?.codename === "string" ? body.codename.trim().slice(0, 24) : "";
  if (raw.length < 2) return NextResponse.json({ error: "Invalid codename" }, { status: 400 });
  const cookieId = req.cookies.get(COOKIE)?.value;
  if (!cookieId) return NextResponse.json({ error: "No learner" }, { status: 400 });
  await db.update(learners).set({ codename: raw }).where(eq(learners.id, cookieId));
  return NextResponse.json({ ok: true, codename: raw });
}

export async function DELETE(req: NextRequest) {
  const cookieId = req.cookies.get(COOKIE)?.value;
  if (cookieId) {
    await db.delete(learners).where(eq(learners.id, cookieId));
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
