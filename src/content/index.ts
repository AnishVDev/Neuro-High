import type { Lesson, Module, ModuleSlug } from "./types";
import { FOUNDATIONS_LESSONS } from "./foundations";
import { TOOLKIT_LESSONS } from "./toolkit";
import { ETHICS_LESSONS } from "./ethics";

export const MODULES: Module[] = [
  {
    slug: "foundations",
    order: 1,
    title: "Inside the Machine",
    codename: "MODULE 01",
    tagline: "How AI actually works",
    description:
      "No hype, no sci-fi. Learn what machine learning really is, how neural nets set their dials, and why chatbots predict words instead of knowing facts.",
    color: "#7B5CFF",
    softColor: "#EEE8FF",
    emblem: "/img/emblem-foundations.png",
    outcomes: [
      "Explain the difference between rules and learning",
      "Train a real classifier with your own clicks",
      "Trace how prediction machines invent fake facts",
    ],
  },
  {
    slug: "toolkit",
    order: 2,
    title: "The Toolkit",
    codename: "MODULE 02",
    tagline: "Use AI like a pro",
    description:
      "Prompt anatomy, iteration loops, verification discipline, and five study moves that turn a chatbot into the best tutor you've ever had.",
    color: "#0EA8CC",
    softColor: "#E0F7FD",
    emblem: "/img/emblem-toolkit.png",
    outcomes: [
      "Write spec-sheet prompts that actually work",
      "Iterate, chain, and critique like a power user",
      "Catch hallucinations before they catch you",
    ],
  },
  {
    slug: "ethics",
    order: 3,
    title: "Human in the Loop",
    codename: "MODULE 03",
    tagline: "Use AI right",
    description:
      "Academic integrity in the gray zone, bias at machine scale, deepfake literacy, and protecting your data — the skills that make you a full stack human.",
    color: "#F0503C",
    softColor: "#FFEBE6",
    emblem: "/img/emblem-ethics.png",
    outcomes: [
      "Draw your own integrity line — and defend it",
      "Spot bias, deepfakes, and manipulation tells",
      "Handle data and attribution like a professional",
    ],
  },
];

const ALL_LESSONS: Lesson[] = [...FOUNDATIONS_LESSONS, ...TOOLKIT_LESSONS, ...ETHICS_LESSONS];

export function lessonsOf(moduleSlug: ModuleSlug): Lesson[] {
  return ALL_LESSONS.filter((l) => l.module === moduleSlug).sort((a, b) => a.index - b.index);
}

export function getModule(slug: string): Module | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getLesson(moduleSlug: string, lessonSlug: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.module === moduleSlug && l.slug === lessonSlug);
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.slug === slug);
}

export const ALL_LESSON_LIST = ALL_LESSONS.slice().sort((a, b) => {
  const ma = MODULES.find((m) => m.slug === a.module)!.order;
  const mb = MODULES.find((m) => m.slug === b.module)!.order;
  return ma - mb || a.index - b.index;
});

/** Flat ordered list of every lesson — used for prev/next navigation. */
export function nextLesson(lesson: Lesson): Lesson | null {
  const flat = ALL_LESSON_LIST;
  const i = flat.findIndex((l) => l.slug === lesson.slug && l.module === lesson.module);
  return i >= 0 && i < flat.length - 1 ? flat[i + 1] : null;
}

export function prevLesson(lesson: Lesson): Lesson | null {
  const flat = ALL_LESSON_LIST;
  const i = flat.findIndex((l) => l.slug === lesson.slug && l.module === lesson.module);
  return i > 0 ? flat[i - 1] : null;
}

export const TOTAL_LESSONS = ALL_LESSON_LIST.length;
export const MAX_XP =
  ALL_LESSON_LIST.reduce((s, l) => s + l.xp, 0) + ALL_LESSON_LIST.length * 60; // with max combos

export const lessonPath = (l: Lesson) => `/learn/${l.module}/${l.slug}`;
export const modulePath = (slug: ModuleSlug) => `/learn/${slug}`;
