import type { Lesson, Module, ModuleSlug } from "./types";
import { FOUNDATIONS_LESSONS } from "./foundations";
import { TOOLKIT_LESSONS } from "./toolkit";
import { ETHICS_LESSONS } from "./ethics";

export const MODULES: Module[] = [
  {
    slug: "foundations",
    order: 1,
    title: "How AI Works",
    codename: "MODULE 01",
    tagline: "What's really happening inside AI tools",
    description:
      "AI isn't magic, and it doesn't think the way people do. In this unit, you'll learn what machine learning is, how a neural network learns from examples, and why chatbots sometimes say things that aren't true.",
    color: "#7B5CFF",
    softColor: "#EEE8FF",
    emblem: "/img/emblem-foundations.png",
    outcomes: [
      "Explain how a program that learns is different from one that follows rules",
      "Train a simple classifier by labeling examples yourself",
      "Explain why chatbots sometimes make up facts",
    ],
  },
  {
    slug: "toolkit",
    order: 2,
    title: "Using AI Effectively",
    codename: "MODULE 02",
    tagline: "Get better results from AI tools",
    description:
      "In this unit, you'll learn how to write clear prompts, improve a response by revising your request, and check AI answers for mistakes. You'll also practice five ways to use a chatbot as a study partner that helps you learn instead of just giving you answers.",
    color: "#0EA8CC",
    softColor: "#E0F7FD",
    emblem: "/img/emblem-toolkit.png",
    outcomes: [
      "Write prompts that clearly describe what you want",
      "Improve AI responses with feedback and follow-up questions",
      "Fact-check AI answers and spot made-up information",
    ],
  },
  {
    slug: "ethics",
    order: 3,
    title: "Using AI Responsibly",
    codename: "MODULE 03",
    tagline: "Make thoughtful choices about AI",
    description:
      "When is it okay to use AI for schoolwork, and when does it cross the line? In this unit, you'll think through questions about academic honesty, learn how AI can repeat and spread bias, practice spotting deepfakes, and find out how to protect your personal information.",
    color: "#F0503C",
    softColor: "#FFEBE6",
    emblem: "/img/emblem-ethics.png",
    outcomes: [
      "Decide when using AI on schoolwork is appropriate and explain your reasoning",
      "Recognize signs of bias, deepfakes, and misleading content",
      "Protect your personal data and give credit when you use AI",
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

/** Flat ordered list of every lesson, used for prev/next navigation. */
export const ALL_LESSON_LIST = ALL_LESSONS.slice().sort((a, b) => {
  const ma = MODULES.find((m) => m.slug === a.module)!.order;
  const mb = MODULES.find((m) => m.slug === b.module)!.order;
  return ma - mb || a.index - b.index;
});

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
