"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ClipboardCopy, Hammer } from "lucide-react";
import { useProgress } from "../ProgressProvider";

type Chip = { id: string; text: string; pts: number; note: string };
type Slot = { id: string; name: string; q: string; color: string; chips: Chip[] };

// Base score plus the highest-scoring chip in each slot (16 + 84) = 100.
const BASE_SCORE = 16;

const SLOTS: Slot[] = [
  {
    id: "role",
    name: "Role",
    q: "Who should the AI act as?",
    color: "#7B5CFF",
    chips: [
      {
        id: "r0",
        text: "— skip role —",
        pts: 0,
        note: "Without a role, the AI uses its general default voice.",
      },
      {
        id: "r1",
        text: "You are an AI assistant.",
        pts: 2,
        note: "This is already the default, so it adds almost no direction.",
      },
      {
        id: "r2",
        text: "You are a world-famous scientist.",
        pts: 6,
        note: "This sets a tone, but it does not explain how the AI should teach.",
      },
      {
        id: "r3",
        text: "You are a patient Socratic tutor for a 10th-grade biology student.",
        pts: 16,
        note: "This names a role, an audience, and a teaching method. The AI has a clear sense of how to respond.",
      },
    ],
  },
  {
    id: "task",
    name: "Task",
    q: "What exactly should it do?",
    color: "#43D9FF",
    chips: [
      {
        id: "t0",
        text: "— skip task —",
        pts: 0,
        note: "Without a task, the AI has to choose one for you, which may not be what you wanted.",
      },
      {
        id: "t1",
        text: "Help me with biology.",
        pts: 3,
        note: "This describes a general subject, not a specific action. 'Help' could mean many things.",
      },
      {
        id: "t2",
        text: "Explain cellular respiration.",
        pts: 8,
        note: "This names a clear action, but it does not say how detailed the explanation should be or who it is for.",
      },
      {
        id: "t3",
        text: "Quiz me with 10 questions on cellular respiration, from easy to brutal.",
        pts: 20,
        note: "This gives an action, a number, a topic, and a difficulty range, so the request is specific.",
      },
      {
        id: "t4",
        text: "Write my lab report for me.",
        pts: 1,
        note: "This asks the AI to do the assignment for you. It also raises an academic integrity concern, so it earns very little credit.",
      },
    ],
  },
  {
    id: "context",
    name: "Context",
    q: "What does the AI need to know about your situation?",
    color: "#C6F32E",
    chips: [
      {
        id: "c0",
        text: "— skip context —",
        pts: 0,
        note: "Without context, the AI has to guess about your situation and what you already know.",
      },
      {
        id: "c1",
        text: "It's for school.",
        pts: 4,
        note: "This is a start, but it does not explain the grade level, the deadline, or where you are getting stuck.",
      },
      {
        id: "c2",
        text: "I read chapter 7 twice and it still didn't stick.",
        pts: 7,
        note: "This tells the AI that rereading did not help, which points toward a different study approach.",
      },
      {
        id: "c3",
        text: "My bio test is Friday, and I keep mixing up glycolysis with the Krebs cycle.",
        pts: 16,
        note: "A deadline and a specific confusion give the AI a clear focus for your practice.",
      },
    ],
  },
  {
    id: "format",
    name: "Format",
    q: "How should the answer be organized?",
    color: "#FFD645",
    chips: [
      {
        id: "f0",
        text: "— skip format —",
        pts: 0,
        note: "Without a format, the AI will choose one, often a long written explanation.",
      },
      {
        id: "f1",
        text: "Make it look nice.",
        pts: 2,
        note: "'Nice' is too vague to guide the response. Describe the structure instead.",
      },
      {
        id: "f2",
        text: "Use exactly 3 paragraphs.",
        pts: 8,
        note: "A clear structure helps. Make sure it does not conflict with the task, such as a quiz that needs a list.",
      },
      {
        id: "f3",
        text: "Ask one question at a time. Don't reveal answers until I respond.",
        pts: 15,
        note: "This describes how the back-and-forth should work, so the AI knows how to run the practice session.",
      },
    ],
  },
  {
    id: "constraint",
    name: "Constraints",
    q: "What limits should the AI follow?",
    color: "#FF8BD1",
    chips: [
      {
        id: "k0",
        text: "— skip constraints —",
        pts: 0,
        note: "Without limits, the response may be longer or less focused than you need.",
      },
      {
        id: "k1",
        text: "Be smart.",
        pts: 1,
        note: "This describes a quality the AI already aims for. It is not a specific limit.",
      },
      {
        id: "k2",
        text: "Keep it under 100 words.",
        pts: 6,
        note: "A length limit is useful, though it may conflict with a detailed quiz or explanation.",
      },
      {
        id: "k3",
        text: "No jargon without defining it. If I miss twice, re-explain with an analogy.",
        pts: 17,
        note: "These are two clear rules the AI can follow during the conversation.",
      },
    ],
  },
];

function verdict(score: number): { label: string; text: string; color: string } {
  if (score >= 90)
    return {
      label: "FORGED",
      color: "#C6F32E",
      text: "Excellent. This prompt leaves the AI very little to guess.",
    };
  if (score >= 70)
    return {
      label: "STRONG",
      color: "#43D9FF",
      text: "A solid prompt. A few small gaps remain that you could close.",
    };
  if (score >= 45)
    return {
      label: "VAGUE",
      color: "#FFD645",
      text: "A reasonable start, but the AI still has to fill in several important details.",
    };
  if (score >= 20)
    return {
      label: "MUSH",
      color: "#FF6B4A",
      text: "The AI would have to guess most of what you want.",
    };
  return {
    label: "STATIC",
    color: "#171321",
    text: "There is very little information here. Add details so the AI has something to work with.",
  };
}

export default function PromptBuilder() {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [forged, setForged] = useState(false);
  const [copied, setCopied] = useState(false);
  const { pingBadges } = useProgress();
  const pinged = useRef(false);

  const score = useMemo(() => {
    let s = BASE_SCORE;
    for (const slot of SLOTS) {
      const chip = slot.chips.find((c) => c.id === picked[slot.id]);
      if (chip) s += chip.pts;
    }
    return Math.min(100, s);
  }, [picked]);

  const prompt = useMemo(() => {
    const parts: string[] = [];
    for (const slot of SLOTS) {
      const chip = slot.chips.find((c) => c.id === picked[slot.id]);
      if (chip && chip.pts > 0) parts.push(chip.text);
    }
    return parts.length ? parts.join(" ") : "Your prompt will appear here as you make choices.";
  }, [picked]);

  const v = verdict(score);
  const choicesMade = Object.values(picked).filter(Boolean).length;

  const doForge = () => {
    setForged(true);
    if (score >= 90 && !pinged.current) {
      pinged.current = true;
      pingBadges(["promptsmith"]);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white">
      <div className="border-b-2 border-ink bg-paper px-4 py-3">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60">
          Mission: Use AI to study cellular respiration for Friday&apos;s biology test
        </p>
        <p className="mt-0.5 text-xs text-ink/50">
          Choose one option for each element. Some options look reasonable but are still vague. Read the feedback, then try to reach a score of 90 or higher.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        {/* chips */}
        <div className="space-y-5 p-4 sm:p-5">
          {SLOTS.map((slot) => (
            <fieldset key={slot.id}>
              <legend className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink">
                <span className="size-2.5 rounded-full border border-ink" style={{ backgroundColor: slot.color }} />
                {slot.name}{" "}
                <span className="font-normal normal-case tracking-normal text-ink/50">— {slot.q}</span>
              </legend>
              <div className="flex flex-col gap-1.5">
                {slot.chips.map((chip) => {
                  const active = picked[slot.id] === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => setPicked((p) => ({ ...p, [slot.id]: chip.id }))}
                      aria-pressed={active}
                      className={`relative rounded-xl border-2 px-3 py-2 text-left text-[13px] leading-snug transition-all ${
                        active
                          ? "border-ink text-ink shadow-[2.5px_2.5px_0_#171321]"
                          : "border-ink/25 bg-white text-ink/65 hover:border-ink/60 hover:text-ink"
                      }`}
                      style={active ? { backgroundColor: `${slot.color}33` } : undefined}
                    >
                      {chip.text}
                      {active && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-1 block border-t border-ink/15 pt-1 font-mono text-[10px] uppercase tracking-wide"
                          style={{
                            color: chip.pts >= 12 ? "#2E7D0F" : chip.pts >= 6 ? "#B45309" : "#B42318",
                          }}
                        >
                          {chip.pts >= 12 ? "+ strong" : chip.pts >= 6 ? "± partial" : "− weak"} · {chip.note}
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {/* forge panel */}
        <div className="flex flex-col border-t-2 border-ink bg-ink text-paper lg:border-l-2 lg:border-t-0">
          <div className="border-b border-paper/15 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-paper/50">
            Live prompt preview
          </div>
          <div className="flex-1 px-4 py-4">
            <p className="min-h-24 font-mono text-[13px] leading-relaxed text-lime/90">{prompt}</p>
          </div>
          <div className="border-t border-paper/15 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45">Signal score</p>
                <p className="font-display text-5xl font-extrabold leading-none" style={{ color: v.color }}>
                  {forged ? score : "??"}
                </p>
              </div>
              <div className="text-right font-mono text-[10px] uppercase tracking-wider text-paper/45">
                {choicesMade}/5 choices made
              </div>
            </div>
            <div className="mt-3 h-3.5 rounded-full border border-paper/30 bg-paper/10">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: v.color }}
                animate={{ width: forged ? `${score}%` : "0%" }}
                transition={{ type: "spring", stiffness: 60, damping: 16 }}
              />
            </div>
            {forged && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: v.color }}>
                  {v.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-paper/75">{v.text}</p>
              </motion.div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={doForge}
                disabled={choicesMade < 5}
                className="btn btn-primary !border-paper !shadow-[3px_3px_0_rgba(255,246,233,0.35)] disabled:opacity-40"
              >
                <Hammer className="size-4" /> Check my prompt
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(prompt).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="btn !border-paper bg-transparent text-paper !shadow-[3px_3px_0_rgba(255,246,233,0.35)]"
              >
                {copied ? <Check className="size-4" /> : <ClipboardCopy className="size-4" />}
                {copied ? "Copied" : "Copy prompt"}
              </button>
            </div>
            {forged && score >= 90 && (
              <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-wider text-lime">
                ★ Promptsmith badge earned
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
