"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Terminal } from "lucide-react";

type Scenario = {
  id: string;
  prompt: string;
  blankHint: string;
  options: { token: string; prob: number; note: string }[];
  insight: { title: string; text: string };
};

const SCENARIOS: Scenario[] = [
  {
    id: "eiffel",
    prompt: "The Eiffel Tower is located in the city of",
    blankHint: "???",
    options: [
      { token: "Paris", prob: 93, note: "Context pinned the answer down completely." },
      { token: "France", prob: 4, note: "Grammatically fine, factually odd — 'city of France'." },
      { token: "London", prob: 1.5, note: "Wrong country. Low probability, non-zero." },
      { token: "the", prob: 1, note: "Grammatically plausible, semantically weird." },
      { token: "spaghetti", prob: 0.1, note: "Technically possible. Practically never." },
    ],
    insight: {
      title: "Certainty looks like this",
      text: "When context fully determines the answer, one token hogs almost all the probability. The model isn't 'sure' — the distribution is just spiky. There's no fact database being consulted here, only pattern memory.",
    },
  },
  {
    id: "dog",
    prompt: "My dog dug a hole in the backyard and buried his favorite",
    blankHint: "???",
    options: [
      { token: "bone", prob: 41, note: "The classic. Highest probability, still under half." },
      { token: "toy", prob: 24, note: "Very plausible." },
      { token: "ball", prob: 15, note: "Totally reasonable." },
      { token: "stick", prob: 6, note: "Possible. Dogs vary." },
      { token: "secrets", prob: 0.7, note: "Exotic but poetic — low odds, not zero." },
    ],
    insight: {
      title: "Ambiguity spreads the vote",
      text: "No single token dominates when context under-determines the answer. Run this twice and you can get different outputs — the model samples from this spread. That's why chatbots give you a different draft every time.",
    },
  },
  {
    id: "mito",
    prompt: "The mitochondria is the",
    blankHint: "???",
    options: [
      { token: "powerhouse", prob: 87, note: "The most clichéd biology sentence ever written." },
      { token: "site", prob: 5, note: "More scientific, far less meme-famous." },
      { token: "energy", prob: 4, note: "Decent continuation." },
      { token: "reason", prob: 2, note: "Poetic. Wrong vibe for a test." },
      { token: "kitchen", prob: 0.3, note: "A metaphor, technically, but odd." },
    ],
    insight: {
      title: "Clichés are probability monsters",
      text: "Phrases repeated millions of times in training data become gravitational wells. This is why unedited AI text defaults to predictable phrasing — and why your own voice is the ingredient the machine can't supply.",
    },
  },
];

const LOOP_TOKENS = ["Sure,", "here's", "a", "plan", "for", "your", "history", "project", "…"];

export default function TokenPredictor() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState(0);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  // ambient autocomplete loop
  useEffect(() => {
    const id = setInterval(() => setTyped((t) => (t + 1) % (LOOP_TOKENS.length + 5)), 340);
    return () => clearInterval(id);
  }, []);

  const select = (id: string) => {
    setScenarioId(id);
    setPicked(null);
  };

  const chosen = scenario.options.find((o) => o.token === picked);

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-ink text-paper">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-paper/20 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-coral" />
        <span className="size-2.5 rounded-full bg-sun" />
        <span className="size-2.5 rounded-full bg-lime" />
        <span className="ml-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-paper/50">
          <Terminal className="size-3.5" /> inside-the-model.exe
        </span>
        <span className="ml-auto hidden font-mono text-[11px] text-paper/40 sm:block">
          {LOOP_TOKENS.slice(0, Math.min(typed, LOOP_TOKENS.length)).join(" ")}
          <span className="animate-blink text-lime">▊</span>
        </span>
      </div>

      {/* scenario tabs */}
      <div className="flex flex-wrap gap-2 px-4 pt-4">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => select(s.id)}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
              s.id === scenarioId
                ? "border-lime bg-lime/15 text-lime"
                : "border-paper/25 text-paper/55 hover:border-paper/50 hover:text-paper"
            }`}
          >
            {s.prompt.slice(0, 26)}…
          </button>
        ))}
      </div>

      {/* sentence */}
      <div className="px-4 pt-4">
        <p className="font-display text-xl font-bold leading-relaxed sm:text-2xl">
          {scenario.prompt}{" "}
          {picked ? (
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block rounded-lg border-2 border-ink bg-vio px-2 py-0.5 text-white"
            >
              {picked}
            </motion.span>
          ) : (
            <span className="inline-block animate-pulse rounded-lg border-2 border-dashed border-paper/40 px-3 py-0.5 font-mono text-paper/50">
              {scenario.blankHint}
            </span>
          )}
          .
        </p>
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">
          {picked ? "Next-token prediction complete" : "Your move: pick the token the model would predict"}
        </p>
      </div>

      {/* options */}
      <div className="grid gap-2 px-4 py-4 sm:grid-cols-2">
        {scenario.options.map((o) => {
          const isPicked = picked === o.token;
          return (
            <button
              key={o.token}
              onClick={() => setPicked(o.token)}
              className={`group relative overflow-hidden rounded-xl border-2 p-3 text-left transition-all ${
                isPicked
                  ? "border-lime bg-lime/10"
                  : picked
                    ? "border-paper/15 opacity-70 hover:opacity-100"
                    : "border-paper/25 hover:border-paper/60 hover:bg-paper/5"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-base font-bold text-paper">“{o.token}”</span>
                {picked && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`font-mono text-sm font-bold ${isPicked ? "text-lime" : "text-paper/50"}`}
                  >
                    {o.prob}%
                  </motion.span>
                )}
              </div>
              {picked && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                  className={`mt-2 h-1.5 origin-left rounded-full ${isPicked ? "bg-lime" : "bg-paper/30"}`}
                  style={{ width: `${o.prob}%` }}
                />
              )}
              {isPicked && (
                <p className="mt-2 text-[11px] leading-snug text-paper/70">{o.note}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* insight */}
      {picked ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 rounded-xl border border-paper/20 bg-paper/5 p-4"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sun">{scenario.insight.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-paper/80">{scenario.insight.text}</p>
          <p className="mt-2 text-sm leading-relaxed text-paper/80">
            Chosen: <span className="font-mono font-bold text-lime">“{chosen?.token}”</span> — {chosen?.note}
          </p>
          <p className="mt-3 border-t border-paper/15 pt-3 font-mono text-[11px] uppercase tracking-wider text-paper/45">
            Repeat this loop ~1,000 times and you get a chatbot answer. Autocomplete, all the way down.
          </p>
          <button
            onClick={() => setPicked(null)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-paper/40 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-paper/80 hover:border-paper hover:text-paper"
          >
            <RotateCcw className="size-3.5" /> Run it again
          </button>
        </motion.div>
      ) : (
        <p className="px-4 pb-4 font-mono text-[11px] text-paper/40">
          The bars reveal each token&apos;s probability — the ONLY thing the model knows.
        </p>
      )}
    </div>
  );
}
