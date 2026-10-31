import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_LESSON_LIST, getLesson, getModule } from "@/content";
import LessonShell from "@/components/LessonShell";

export function generateStaticParams() {
  return ALL_LESSON_LIST.map((l) => ({ module: l.module, lesson: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}): Promise<Metadata> {
  const { module, lesson } = await params;
  const l = getLesson(module, lesson);
  if (!l) return {};
  return {
    title: `${l.title} — NEURO//HIGH`,
    description: l.hook,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  const { module, lesson } = await params;
  const l = getLesson(module, lesson);
  const mod = getModule(module);
  if (!l || !mod) notFound();
  return <LessonShell lesson={l} mod={mod} />;
}
