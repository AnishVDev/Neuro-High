"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { ALL_LESSON_LIST, lessonPath } from "@/content";
import { useProgress } from "./ProgressProvider";

export default function StartCta({ className = "btn btn-primary", small = false }: { className?: string; small?: boolean }) {
  const { state } = useProgress();
  const done = Object.keys(state?.completed ?? {}).length;
  const nextUp = ALL_LESSON_LIST.find((l) => !state?.completed[l.slug]) ?? ALL_LESSON_LIST[0];

  if (done > 0) {
    return (
      <Link href={done >= ALL_LESSON_LIST.length ? "/dashboard" : lessonPath(nextUp)} className={className}>
        {done >= ALL_LESSON_LIST.length ? "View your build" : "Continue your build"}
        <ArrowRight className={small ? "size-4" : "size-5"} />
      </Link>
    );
  }
  return (
    <Link href="/learn/foundations/not-magic" className={className}>
      <Play className={small ? "size-4" : "size-5"} /> Start your build
    </Link>
  );
}
