"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BadgeCheck, Crosshair, RotateCcw, ShieldCheck } from "lucide-react";
import { useProgress } from "../ProgressProvider";

type Claim = {
  text: string;
  fake: boolean;
  genre: string;
  reveal: string;
};

const CLAIMS: Claim[] = [
  {
    text: "Ada Lovelace is widely considered the first computer programmer, having written an algorithm for Charles Babbage's Analytical Engine in the 1840s.",
    fake: false,
    genre: "Historical fact",
    reveal: "REAL. Lovelace's 1843 notes on the Analytical Engine include what's regarded as the first published algorithm.",
  },
  {
    text: "Alan Turing introduced the Turing Test in his 1953 paper 'Computing Machinery and the Human Mind.'",
    fake: true,
    genre: "Wrong date + wrong title",
    reveal: "FAKE. The paper is real — but it's from 1950 and titled 'Computing Machinery and Intelligence.' Hallucinations love swapping dates and titles.",
  },
  {
    text: "In 2012, a neural network called AlexNet dominated the ImageNet image-recognition competition, kicking off the modern deep learning boom.",
    fake: false,
    genre: "Historical fact",
    reveal: "REAL. AlexNet's 2012 ImageNet win is a documented inflection point for deep learning.",
  },
  {
    text: "OpenAI's GPT-3, released in 2020, has 175 trillion parameters, making it the largest model ever trained.",
    fake: true,
    genre: "Inflated number",
    reveal: "FAKE. GPT-3 has 175 BILLION parameters — the claim is inflated 1,000×. Number inflation is a classic hallucination genre.",
  },
  {
    text: "In 2021, Busan, South Korea became the first city to pass a law granting legal personhood to AI systems.",
    fake: true,
    genre: "Invented law",
    reveal: "FAKE. No such law exists anywhere. Fabricated legislation is a common confabulation — it sounds like the kind of thing that would be true.",
  },
  {
    text: "Google DeepMind's AlphaFold predicted the 3D structures of over 200 million proteins, released as a free database for researchers.",
    fake: false,
    genre: "Documented fact",
    reveal: "REAL. The AlphaFold Protein Structure Database launched in 2022 with 200M+ predicted structures.",
  },
  {
    text: "The International AI Safety Accord, signed by 74 countries in Geneva in 2023, bans training any model larger than 10²⁶ FLOPs.",
    fake: true,
    genre: "Invented treaty",
    reveal: "FAKE. There are real AI safety summits and executive orders — but this exact 'Accord' with these specifics is confabulated.",
  },
  {
    text: "Psychologist Dr. Elena Vasquez coined the term 'hallucination' for AI in her 2019 paper 'Machines That Dream.'",
    fake: true,
    genre: "Fabricated citation",
    reveal: "FAKE. Invented person, invented paper. The term 'AI hallucination' drifted in from image-generation research — no single coiner.",
  },
];

export default function HallucinationHunt() {
  const [judged, setJudged] = useState<Record<number, "fake" | "real">>({});
  const { pingBadges } = useProgress();
  const awardedRef = useRef(false);

  const done = Object.keys(judged).length === CLAIMS.length;

  const results = useMemo(() => {
    if (!done) return null;
    let correct = 0;
    let fakesFound = 0;
    let falseAlarms = 0;
    for (const [k, v] of Object.entries(judged)) {
      const i = Number(k);
      if ((v === "fake") === CLAIMS[i].fake) correct++;
      if (v === "fake" && CLAIMS[i].fake) fakesFound++;
      if (v === "fake" && !CLAIMS[i].fake) falseAlarms++;
    }
    return { correct, fakesFound, falseAlarms, totalFakes: CLAIMS.filter((c) => c.fake).length };
  }, [done, judged]);

  if (done && results && !awardedRef.current) {
    awardedRef.current = true;
    if (results.fakesFound === results.totalFakes && results.falseAlarms === 0) {
      pingBadges(["hallucination-hunter"]);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-ink bg-paper px-4 py-3">
        <Crosshair className="size-5 text-coral" />
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink/70">
          Case file: 8 AI-generated claims · 5 are fabricated · judge each one
        </p>
        <span className="ml-auto font-mono text-[11px] font-bold text-ink/60">
          {Object.keys(judged).length}/{CLAIMS.length} judged
        </span>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {CLAIMS.map((claim, i) => {
          const verdict = judged[i];
          const revealed = done;
          const wasRight = revealed && (verdict === "fake") === claim.fake;
          return (
            <div
              key={i}
              className={`relative flex flex-col rounded-xl border-2 p-3.5 transition-colors ${
                revealed
                  ? wasRight
                    ? "border-ink bg-lime/20"
                    : "border-ink bg-coral/25"
                  : verdict
                    ? "border-ink bg-paper"
                    : "border-ink/25 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="chip bg-white !text-[9px] text-ink/60">{claim.genre}</span>
                {revealed &&
                  (wasRight ? (
                    <BadgeCheck className="size-5 shrink-0 text-[#2E7D0F]" />
                  ) : (
                    <AlertTriangle className="size-5 shrink-0 text-[#B42318]" />
                  ))}
              </div>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink/85">{claim.text}</p>

              {!verdict && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setJudged((j) => ({ ...j, [i]: "fake" }))}
                    className="flex-1 rounded-lg border-2 border-ink bg-coral px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_#171321] transition-transform hover:-translate-y-0.5"
                  >
                    Fabricated
                  </button>
                  <button
                    onClick={() => setJudged((j) => ({ ...j, [i]: "real" }))}
                    className="flex-1 rounded-lg border-2 border-ink bg-lime px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_#171321] transition-transform hover:-translate-y-0.5"
                  >
                    Looks real
                  </button>
                </div>
              )}
              {verdict && !revealed && (
                <p className="mt-2.5 font-mono text-[10px] uppercase tracking-wider text-ink/50">
                  You judged: <span className="font-bold text-ink">{verdict === "fake" ? "fabricated" : "real"}</span> — locked in
                </p>
              )}
              {revealed && (
                <p className="mt-2.5 border-t border-ink/15 pt-2 text-[11.5px] leading-snug text-ink/70">{claim.reveal}</p>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {done && results && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t-2 border-ink bg-ink p-5 text-center text-paper"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-paper/50">Investigation closed</p>
            <p className="mt-1.5 font-display text-4xl font-extrabold text-sun">
              {results.correct}/{CLAIMS.length} correct
            </p>
            <p className="mx-auto mt-2 flex max-w-md items-center justify-center gap-2 text-sm text-paper/80">
              <ShieldCheck className="size-4 shrink-0 text-lime" />
              {results.fakesFound === results.totalFakes && results.falseAlarms === 0
                ? "Every fake caught, zero false alarms. Hallucination Hunter badge transmitted."
                : results.fakesFound < results.totalFakes
                  ? `${results.totalFakes - results.fakesFound} fake${results.totalFakes - results.fakesFound > 1 ? "s" : ""} slipped past you. In the wild, you'd have cited fiction.`
                  : "You caught the fakes but flagged real facts too — over-suspicion is its own bug. Verify, then trust what's verified."}
            </p>
            <button
              onClick={() => {
                setJudged({});
                awardedRef.current = false;
              }}
              className="btn mt-4 !border-paper bg-transparent text-paper !shadow-[3px_3px_0_rgba(255,246,233,0.35)]"
            >
              <RotateCcw className="size-4" /> Reopen the case
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
