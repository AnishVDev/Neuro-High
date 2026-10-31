"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Gavel, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Scenario } from "@/content/types";

export default function ScenarioDeck({
  scenarios,
  accent = "#7B5CFF",
  label = "Judgment call",
}: {
  scenarios: Scenario[];
  accent?: string;
  label?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const scenario = scenarios[idx];
  const picked = choice === "A" ? scenario?.choiceA : scenario?.choiceB;

  const pick = (c: "A" | "B") => {
    if (choice) return;
    setChoice(c);
    const good = c === "A" ? scenario.choiceA.good : scenario.choiceB.good;
    if (good) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= scenarios.length) setDone(true);
    else {
      setIdx((i) => i + 1);
      setChoice(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setChoice(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const perfect = score === scenarios.length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border-2 border-ink bg-ink p-6 text-center text-paper"
      >
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-paper/50">Deck cleared</p>
        <p className="mt-2 font-display text-5xl font-extrabold" style={{ color: perfect ? "#C6F32E" : "#FFD645" }}>
          {score}/{scenarios.length}
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-paper/75">
          {perfect
            ? "Flawless judgment. Your instincts are officially upgraded."
            : score >= scenarios.length - 1
              ? "Nearly perfect. Re-run the deck and lock the pattern in."
              : "Judgment is a muscle — re-run the deck and watch the misses flip."}
        </p>
        <button onClick={restart} className="btn btn-primary mx-auto mt-5">
          <RotateCcw className="size-4" /> Re-run the deck
        </button>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white">
      <div className="flex items-center justify-between border-b-2 border-ink bg-paper px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60">
          <Gavel className="size-4" style={{ color: accent }} /> {label}
        </span>
        <div className="flex items-center gap-1.5" aria-label={`Scenario ${idx + 1} of ${scenarios.length}`}>
          {scenarios.map((_, i) => (
            <span
              key={i}
              className="size-2.5 rounded-full border border-ink"
              style={{ backgroundColor: i < idx ? "#C6F32E" : i === idx ? accent : "#fff" }}
            />
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.18 }}
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ink/45">
              Scenario {idx + 1}
            </p>
            <p className="mt-1.5 font-display text-lg font-bold leading-snug text-ink sm:text-xl">
              {scenario.setup}
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {(["A", "B"] as const).map((c) => {
                const opt = c === "A" ? scenario.choiceA : scenario.choiceB;
                const isPicked = choice === c;
                const revealed = choice !== null;
                let cls = "border-ink/25 bg-white hover:border-ink hover:-translate-y-0.5";
                if (revealed && opt.good) cls = "border-ink bg-lime/30";
                if (revealed && isPicked && !opt.good) cls = "border-ink bg-coral/25";
                if (revealed && !isPicked && !opt.good) cls = "border-ink/15 bg-white opacity-50";
                return (
                  <button
                    key={c}
                    onClick={() => pick(c)}
                    disabled={revealed}
                    className={`rounded-xl border-2 p-3.5 text-left text-[13.5px] font-medium leading-snug text-ink shadow-[2.5px_2.5px_0_#171321] transition-all ${cls}`}
                  >
                    <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/50">
                      {revealed && opt.good ? (
                        <ThumbsUp className="size-3.5 text-[#2E7D0F]" />
                      ) : revealed && isPicked ? (
                        <ThumbsDown className="size-3.5 text-[#B42318]" />
                      ) : null}
                      Move {c}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {choice && picked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 rounded-xl border-2 border-ink p-4 ${
                    picked.good ? "bg-lime/25" : "bg-coral/20"
                  }`}
                >
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
                    {picked.good ? "Strong move" : "Costly move"}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/85">{picked.feedback}</p>
                  <button onClick={next} className="btn btn-ghost mt-3 !py-2">
                    {idx + 1 >= scenarios.length ? "See results" : "Next scenario"} <ArrowRight className="size-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
