"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ClipboardCopy, Hammer } from "lucide-react";
import { useProgress } from "../ProgressProvider";

type Chip = { id: string; text: string; pts: number; note: string };
type Slot = { id: string; name: string; q: string; color: string; chips: Chip[] };

const SLOTS: Slot[] = [
  {
    id: "role",
    name: "Role",
    q: "Who should it be?",
    color: "#7B5CFF",
    chips: [
      { id: "r0", text: "— skip role —", pts: 0, note: "No role = default generic assistant voice." },
      { id: "r1", text: "You are an AI assistant.", pts: 2, note: "That's its factory settings. Adds nothing." },
      { id: "r2", text: "You are a world-famous scientist.", pts: 6, note: "Fancy — but 'famous' isn't a teaching method." },
      { id: "r3", text: "You are a patient Socratic tutor for a 10th-grade biology student.", pts: 16, note: "Role + audience + method. The model now knows exactly how to behave." },
    ],
  },
  {
    id: "task",
    name: "Task",
    q: "The exact verb",
    color: "#43D9FF",
    chips: [
      { id: "t0", text: "— skip task —", pts: 0, note: "No task? The model will invent one. Bold strategy." },
      { id: "t1", text: "Help me with biology.", pts: 3, note: "A vibe, not a task. 'Help' can mean anything." },
      { id: "t2", text: "Explain cellular respiration.", pts: 8, note: "A real verb — but how? For whom? To what depth?" },
      { id: "t3", text: "Quiz me with 10 questions on cellular respiration, from easy to brutal.", pts: 20, note: "Verb + quantity + difficulty ramp. Zero ambiguity." },
      { id: "t4", text: "Write my lab report for me.", pts: 1, note: "Off-task AND an integrity foul. The Forge docks signal for that." },
    ],
  },
  {
    id: "context",
    name: "Context",
    q: "What it needs to know",
    color: "#C6F32E",
    chips: [
      { id: "c0", text: "— skip context —", pts: 0, note: "The model will now guess what your situation is." },
      { id: "c1", text: "It's for school.", pts: 4, note: "Bare minimum. Which year? What's your actual sticking point?" },
      { id: "c2", text: "I read chapter 7 twice and it still didn't stick.", pts: 7, note: "Useful signal — the model knows reading didn't work." },
      { id: "c3", text: "My bio test is Friday and I keep mixing up glycolysis with the Krebs cycle.", pts: 16, note: "Deadline + specific weak spot = targeted practice instead of generic review." },
    ],
  },
  {
    id: "format",
    name: "Format",
    q: "Shape of the answer",
    color: "#FFD645",
    chips: [
      { id: "f0", text: "— skip format —", pts: 0, note: "Untold, the model will freestyle an essay." },
      { id: "f1", text: "Make it look nice.", pts: 2, note: "'Nice' means nothing to a token predictor." },
      { id: "f2", text: "Use exactly 3 paragraphs.", pts: 8, note: "Structure helps — just check it doesn't fight your task." },
      { id: "f3", text: "Ask one question at a time. Don't reveal answers until I respond.", pts: 15, note: "You just programmed the conversation's behavior. Power move." },
    ],
  },
  {
    id: "constraint",
    name: "Constraints",
    q: "The guardrails",
    color: "#FF8BD1",
    chips: [
      { id: "k0", text: "— skip constraints —", pts: 0, note: "Free-range output. Some chaos expected." },
      { id: "k1", text: "Be smart.", pts: 1, note: "That's the model's default aspiration, not a constraint." },
      { id: "k2", text: "Keep it under 100 words.", pts: 6, note: "Length caps are easy wins — though they can clash with quizzing." },
      { id: "k3", text: "No jargon without defining it. If I miss twice, re-explain with an analogy.", pts: 17, note: "Two behavioral rules the model can actually enforce on itself." },
    ],
  },
];

function verdict(score: number): { label: string; text: string; color: string } {
  if (score >= 90) return { label: "FORGED", color: "#C6F32E", text: "Certified promptsmith. This spec leaves the model almost nothing to guess." };
  if (score >= 70) return { label: "STRONG", color: "#43D9FF", text: "Pro territory. A couple of open gaps, but the output will be sharp." };
  if (score >= 45) return { label: "VAGUE", color: "#FFD645", text: "Better than most — but the model is still filling important blanks." };
  if (score >= 20) return { label: "MUSH", color: "#FF6B4A", text: "You're asking the machine to read your mind. It can't." };
  return { label: "STATIC", color: "#171321", text: "Almost no signal. Feed the machine something to work with." };
}

export default function PromptBuilder() {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [forged, setForged] = useState(false);
  const [copied, setCopied] = useState(false);
  const { pingBadges } = useProgress();
  const pinged = useRef(false);

  const score = useMemo(() => {
    let s = 8;
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
    return parts.length ? parts.join(" ") : "// your prompt will assemble here…";
  }, [picked]);

  const v = verdict(score);
  const slotsFilled = Object.values(picked).filter(Boolean).length;

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
          Mission: get AI to help you study cellular respiration for Friday&apos;s bio test
        </p>
        <p className="mt-0.5 text-xs text-ink/50">
          Pick ONE chip per ingredient. Some choices look fine but are secretly mush — read the feedback, chase 90+ signal.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        {/* chips */}
        <div className="space-y-5 p-4 sm:p-5">
          {SLOTS.map((slot) => (
            <fieldset key={slot.id}>
              <legend className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink">
                <span className="size-2.5 rounded-full border border-ink" style={{ backgroundColor: slot.color }} />
                {slot.name} <span className="font-normal normal-case tracking-normal text-ink/50">— {slot.q}</span>
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
                          style={{ color: chip.pts >= 12 ? "#2E7D0F" : chip.pts >= 6 ? "#B45309" : "#B42318" }}
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
            live prompt preview
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
                {slotsFilled}/5 ingredients
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
                disabled={slotsFilled < 5}
                className="btn btn-primary !border-paper !shadow-[3px_3px_0_rgba(255,246,233,0.35)] disabled:opacity-40"
              >
                <Hammer className="size-4" /> Forge it
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
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            {forged && score >= 90 && (
              <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-wider text-lime">
                ★ Promptsmith badge transmitted to your build
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
