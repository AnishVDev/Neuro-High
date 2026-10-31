"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Award, BrainCircuit, Cpu, Crown, Flame, HeartHandshake, SearchCheck, Sparkles, Target, Wand2, Wrench, Zap } from "lucide-react";
import type { Badge, Rank } from "@/lib/gamification";
import type { Lesson } from "@/content/types";

export type CompletionInfo = {
  correct: number;
  total: number;
  maxCombo: number;
  attempts: number;
  at: string;
};

export type LearnerState = {
  learner: { codename: string; xp: number; streak: number };
  completed: Record<string, CompletionInfo>;
  badges: string[];
};

type QuizResult = { correct: number; total: number; maxCombo: number; attempts: number };

type ToastPayload =
  | { kind: "xp"; xp: number; title: string }
  | { kind: "badge"; badge: Badge }
  | { kind: "info"; title: string; text: string };

type Toast = ToastPayload & { id: number };

type Ctx = {
  state: LearnerState | null;
  loading: boolean;
  isCompleted: (slug: string) => boolean;
  completion: (slug: string) => CompletionInfo | undefined;
  /** Complete a lesson after passing its checkpoint. */
  complete: (lesson: Lesson, result: QuizResult, hints?: string[]) => Promise<void>;
  /** Fire badge hints from interactives (no lesson completion). */
  pingBadges: (hints: string[]) => Promise<void>;
  rename: (codename: string) => Promise<boolean>;
  reset: () => Promise<void>;
};

const ProgressCtx = createContext<Ctx | null>(null);

export function useProgress(): Ctx {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

export const BADGE_ICONS: Record<string, typeof Sparkles> = {
  "first-contact": Sparkles,
  flawless: Target,
  "hot-streak": Flame,
  promptsmith: Wand2,
  "hallucination-hunter": SearchCheck,
  "data-whisperer": BrainCircuit,
  "kit-master": Wrench,
  "team-human": HeartHandshake,
  "triple-threat": Crown,
};

export function BadgeIcon({ id, className }: { id: string; className?: string }) {
  const Icon = BADGE_ICONS[id] ?? Award;
  return <Icon className={className} aria-hidden />;
}

let toastId = 0;

export default function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearnerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [rankUp, setRankUp] = useState<Rank | null>(null);
  const busyRef = useRef(false);

  const pushToast = useCallback((t: ToastPayload) => {
    const id = ++toastId;
    setToasts((prev) => [...prev.slice(-3), { ...t, id } as Toast]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/progress")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setState(d.state);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const handleAwarded = useCallback(
    (awarded: { xp: number; badges: Badge[]; rankUp: Rank | null; already?: boolean }) => {
      if (awarded.xp > 0) {
        pushToast({ kind: "xp", xp: awarded.xp, title: "XP banked" });
      }
      awarded.badges.forEach((b, i) => {
        window.setTimeout(() => pushToast({ kind: "badge", badge: b }), 450 + i * 400);
      });
      if (awarded.rankUp) {
        window.setTimeout(() => setRankUp(awarded.rankUp), 900 + awarded.badges.length * 400);
      }
    },
    [pushToast],
  );

  const complete = useCallback(
    async (lesson: Lesson, result: QuizResult, hints: string[] = []) => {
      if (busyRef.current) return;
      busyRef.current = true;
      try {
        const r = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonSlug: lesson.slug, ...result, badgeHints: hints }),
        });
        const d = await r.json();
        if (r.ok && d.state) {
          setState(d.state);
          handleAwarded({ ...d.awarded, badges: d.awarded.badges ?? [] });
        }
      } finally {
        busyRef.current = false;
      }
    },
    [handleAwarded],
  );

  const pingBadges = useCallback(
    async (hints: string[]) => {
      try {
        const r = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ badgeHints: hints }),
        });
        const d = await r.json();
        if (r.ok && d.state) {
          setState(d.state);
          handleAwarded({ ...d.awarded, badges: d.awarded.badges ?? [], rankUp: null });
        }
      } catch {
        /* offline-tolerant */
      }
    },
    [handleAwarded],
  );

  const rename = useCallback(async (codename: string) => {
    try {
      const r = await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codename }),
      });
      if (r.ok) {
        setState((s) => (s ? { ...s, learner: { ...s.learner, codename } } : s));
        return true;
      }
    } catch {
      /* noop */
    }
    return false;
  }, []);

  const reset = useCallback(async () => {
    try {
      await fetch("/api/progress", { method: "DELETE" });
      setState({ learner: { codename: "", xp: 0, streak: 1 }, completed: {}, badges: [] });
      // Re-hydrate a fresh learner
      const r = await fetch("/api/progress");
      const d = await r.json();
      if (d.state) setState(d.state);
    } catch {
      /* noop */
    }
  }, []);

  const isCompleted = useCallback((slug: string) => !!state?.completed[slug], [state]);
  const completion = useCallback((slug: string) => state?.completed[slug], [state]);

  return (
    <ProgressCtx.Provider
      value={{ state, loading, isCompleted, completion, complete, pingBadges, rename, reset }}
    >
      {children}

      {/* ── Toast stack ─────────────────────────────────────────── */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[min(92vw,340px)] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ x: 120, opacity: 0, rotate: 2 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: 120, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="sticker pointer-events-auto flex items-center gap-3 bg-white p-3.5"
              role="status"
            >
              {t.kind === "xp" && (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-sun">
                    <Zap className="size-5 text-ink" strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="font-display text-xl font-extrabold leading-none text-ink">+{t.xp} XP</p>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-ink/60">{t.title}</p>
                  </div>
                </>
              )}
              {t.kind === "badge" && (
                <>
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-ink"
                    style={{ backgroundColor: t.badge.color }}
                  >
                    <BadgeIcon id={t.badge.id} className="size-5 text-ink" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/50">Badge unlocked</p>
                    <p className="font-display text-base font-extrabold leading-tight text-ink">{t.badge.name}</p>
                    <p className="text-[11px] leading-snug text-ink/60">{t.badge.flavor}</p>
                  </div>
                </>
              )}
              {t.kind === "info" && (
                <div>
                  <p className="font-display text-base font-extrabold text-ink">{t.title}</p>
                  <p className="text-[11px] text-ink/60">{t.text}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Rank-up ceremony ────────────────────────────────────── */}
      <AnimatePresence>
        {rankUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/70 p-5 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Rank up"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -4, y: 40 }}
              animate={{ scale: 1, rotate: -1.5, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="sticker-lg relative w-full max-w-md bg-paper p-8 pt-16 text-center"
            >
              <motion.div
                initial={{ y: -30, scale: 0 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 14 }}
                className="absolute -top-16 left-1/2 -translate-x-1/2"
              >
                <Image
                  src="/img/nova-gold.png"
                  alt="NOVA celebrating with a trophy"
                  width={130}
                  height={130}
                  className="rounded-full border-[3px] border-ink shadow-[4px_4px_0_#171321]"
                  priority
                />
              </motion.div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-coral">Rank up</p>
              <h2 className="mt-1 font-display text-5xl font-extrabold uppercase leading-none tracking-tight text-ink">
                {rankUp.name}
              </h2>
              <p className="mt-3 text-sm text-ink/70">{rankUp.tagline}</p>
              <div className="mx-auto mt-5 h-1.5 w-40 rounded-full bg-gradient-to-r from-vio via-blush to-sun" />
              <button
                onClick={() => setRankUp(null)}
                className="btn btn-primary mx-auto mt-6"
                autoFocus
              >
                <Cpu className="size-4" aria-hidden /> Systems upgraded
              </button>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ink/40">
                keep climbing — singularity awaits
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProgressCtx.Provider>
  );
}
