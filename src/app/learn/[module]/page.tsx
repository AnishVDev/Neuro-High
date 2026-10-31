import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Target } from "lucide-react";
import { MODULES, getModule, lessonsOf } from "@/content";
import ModuleLessonList from "@/components/ModuleLessonList";

export function generateStaticParams() {
  return MODULES.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module } = await params;
  const mod = getModule(module);
  if (!mod) return {};
  return {
    title: `${mod.codename}: ${mod.title} — NEURO//HIGH`,
    description: mod.description,
  };
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const mod = getModule(module);
  if (!mod) notFound();
  const lessons = lessonsOf(mod.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/#modules"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink/60 hover:text-ink"
      >
        <ArrowLeft className="size-4" /> All modules
      </Link>

      {/* module hero */}
      <header className="sticker-lg relative mt-6 overflow-hidden bg-white">
        <div className="h-3 w-full" style={{ background: `repeating-linear-gradient(45deg, ${mod.color}, ${mod.color} 12px, #171321 12px, #171321 14px)` }} />
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <Image
            src={mod.emblem}
            alt={`${mod.title} emblem`}
            width={150}
            height={150}
            className="size-32 shrink-0 -rotate-2 rounded-2xl border-2 border-ink object-cover shadow-[4px_4px_0_#171321] sm:size-[150px]"
          />
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: mod.color }}>
              {mod.codename} · {mod.tagline}
            </p>
            <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {mod.title}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/75">{mod.description}</p>
          </div>
        </div>
        <div className="border-t-2 border-ink bg-paper px-6 py-4 sm:px-8">
          <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50">
            <Target className="size-4" style={{ color: mod.color }} /> You&apos;ll walk out able to
          </p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
            {mod.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2 text-[12.5px] leading-snug text-ink/75">
                <span className="mt-1 size-2 shrink-0 rounded-full border border-ink" style={{ backgroundColor: mod.color }} />
                {o}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* mission timeline */}
      <div className="mt-10">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          The mission log
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Four missions, then the boss. Clear each checkpoint to bank XP and light your build.
        </p>
        <div className="mt-5">
          <ModuleLessonList mod={mod} lessons={lessons} />
        </div>
      </div>
    </div>
  );
}
