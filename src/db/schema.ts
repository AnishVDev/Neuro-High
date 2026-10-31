import { pgTable, uuid, text, integer, timestamp, serial, uniqueIndex } from "drizzle-orm/pg-core";

export const learners = pgTable("learners", {
  id: uuid("id").defaultRandom().primaryKey(),
  codename: text("codename").notNull(),
  xp: integer("xp").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(1),
  lastActiveDate: text("last_active_date").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const lessonCompletions = pgTable(
  "lesson_completions",
  {
    id: serial("id").primaryKey(),
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learners.id, { onDelete: "cascade" }),
    lessonSlug: text("lesson_slug").notNull(),
    xpAwarded: integer("xp_awarded").notNull().default(0),
    correct: integer("correct").notNull().default(0),
    total: integer("total").notNull().default(0),
    maxCombo: integer("max_combo").notNull().default(0),
    attempts: integer("attempts").notNull().default(1),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("lesson_completions_learner_lesson").on(t.learnerId, t.lessonSlug)],
);

export const badgeAwards = pgTable(
  "badge_awards",
  {
    id: serial("id").primaryKey(),
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learners.id, { onDelete: "cascade" }),
    badgeId: text("badge_id").notNull(),
    awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("badge_awards_learner_badge").on(t.learnerId, t.badgeId)],
);
