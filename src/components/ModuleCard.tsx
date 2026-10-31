"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Module } from "@/content/types";
import { lessonsOf } from "@/content";
import { useProgress } from "./ProgressProvider";

export default function ModuleCard({ mod, index = 0 }: { mod: Module; index?: number }) {
  const { isCompleted } = useProgress();
  const lessons = lessonsOf(mod.slug);
  const done = lessons.filter((l) => isCompleted(l.slug)).length;
  const pct = Math.round((done / lessons.length) * 100);
  const completeAll = done === lessons.length;
  const nextUp = lessons.find((l) => !isCompleted(l.slug));

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -6, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
      className="sticker-lg group relative flex flex-col overflow-hidden bg-white"
    >
      {/* header band */}
      <div className="relative border-b-2 border-ink px-5 pb-4 pt-5" style={{ backgroundColor: mod.softColor }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: mod.color }}>
              {mod.codename}
            </p>
            <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">{mod.title}</h3>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/50">{mod.tagline}</p>
          </div>
          <motion.div
            whileHover={{ rotate: -8, scale: 1.06 }}
            className="shrink-0"
          >
            <Image
              src={mod.emblem}
              alt={`${mod.title} emblem`}
              width={86}
              height={86}
              className="size-20 rounded-2xl border-2 border-ink bg-paper object-cover shadow-[3px_3px_0_#171321] sm:size-[86px]"
            />
          </motion.div>
        </div>
        {completeAll && (
          <span className="chip absolute -bottom-3 right-5 bg-lime text-ink">
            <CheckCircle2 className="size-3.5" /> Module cleared
          </span>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[13.5px] leading-relaxed text-ink/75">{mod.description}</p>
        <ul className="mt-3 space-y-1.5">
          {mod.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2 text-[12.5px] text-ink/70">
              <span className="mt-1.5 size-2 shrink-0 rounded-full border border-ink" style={{ backgroundColor: mod.color }} />
              {o}
            </li>
          ))}
        </ul>

        {/* progress */}
        <div className="mt-4">
          <div className="flex justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-ink/55">
            <span>{done}/{lessons.length} missions</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-1 h-3 rounded-full border-2 border-ink bg-white p-[2px]">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: mod.color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
            />
          </div>
        </div>

        <div className="mt-5 flex-1" />
        <Link
          href={nextUp ? `/learn/${mod.slug}/${nextUp.slug}` : `/learn/${mod.slug}`}
          className="btn w-full !py-3"
          style={{ backgroundColor: mod.color, color: "#fff" }}
        >
          {done === 0 ? "Start module" : completeAll ? "Review module" : "Continue"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
