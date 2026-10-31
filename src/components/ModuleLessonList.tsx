"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Clock3, Play, Skull, Zap } from "lucide-react";
import type { Lesson, Module } from "@/content/types";
import { useProgress } from "./ProgressProvider";

export default function ModuleLessonList({ mod, lessons }: { mod: Module; lessons: Lesson[] }) {
  const { isCompleted } = useProgress();

  return (
    <ol className="relative space-y-4">
      {lessons.map((lesson, i) => {
        const done = isCompleted(lesson.slug);
        const boss = lesson.kind === "boss";
        return (
          <motion.li
            key={lesson.slug}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/learn/${mod.slug}/${lesson.slug}`}
              className={`sticker group flex items-center gap-4 bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#171321] ${
                boss ? "!border-[3px]" : ""
              }`}
              style={boss ? { backgroundColor: done ? undefined : mod.softColor } : undefined}
            >
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-xl border-2 border-ink font-display text-lg font-extrabold ${
                  done ? "text-white" : "bg-white text-ink"
                }`}
                style={done ? { backgroundColor: mod.color } : boss ? { backgroundColor: "#171321", color: "#FFD645" } : undefined}
              >
                {done ? <Check className="size-5" strokeWidth={3} /> : boss ? <Skull className="size-5" /> : `0${i + 1}`}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-display text-lg font-extrabold tracking-tight text-ink">
                    {lesson.title}
                  </span>
                  {boss && (
                    <span className="chip shrink-0 bg-sun !text-[9px] text-ink">boss</span>
                  )}
                </span>
                <span className="block truncate text-[13px] text-ink/60">{lesson.subtitle}</span>
                <span className="mt-1.5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-ink/50">
                  <span className="flex items-center gap-1">
                    <Clock3 className="size-3" /> {lesson.minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="size-3 text-vio" /> {lesson.xp} XP
                  </span>
                  {done && <span className="font-bold text-[#2E7D0F]">cleared</span>}
                </span>
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper transition-all group-hover:bg-lime">
                <Play className="size-4 fill-ink text-ink" />
              </span>
            </Link>
          </motion.li>
        );
      })}
    </ol>
  );
}
