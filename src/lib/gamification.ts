// ─── Gamification engine: ranks, badges, XP math (shared client/server) ─────

export type Rank = {
  name: string;
  minXp: number;
  tagline: string;
  /** Background color of the rank's icon tile */
  color: string;
  /** Color of the built-in fallback icon drawn on the tile */
  iconColor: string;
  /** Custom artwork path — files live in /public/images/ranks/ */
  image: string;
};

/**
 * Flip to true once all eight rank images exist in /public/images/ranks/.
 * While false, each rank uses its own built-in icon instead.
 */
export const USE_RANK_IMAGES = false;

export const RANKS: Rank[] = [
  { name: "Bootloader", minXp: 0, tagline: "System online. Welcome aboard.", color: "#EEE8FF", iconColor: "#171321", image: "/images/ranks/bootloader.png" },
  { name: "Cipher", minXp: 150, tagline: "You speak a little machine now.", color: "#43D9FF", iconColor: "#171321", image: "/images/ranks/cipher.png" },
  { name: "Operator", minXp: 420, tagline: "Buttons pressed with intent.", color: "#C6F32E", iconColor: "#171321", image: "/images/ranks/operator.png" },
  { name: "Promptsmith", minXp: 760, tagline: "Words bend to your will.", color: "#FFD645", iconColor: "#171321", image: "/images/ranks/promptsmith.png" },
  { name: "Systems Tuner", minXp: 1150, tagline: "You hear the hum beneath.", color: "#FF8BD1", iconColor: "#171321", image: "/images/ranks/systems-tuner.png" },
  { name: "Architect", minXp: 1600, tagline: "You design the machine's day.", color: "#FF6B4A", iconColor: "#171321", image: "/images/ranks/architect.png" },
  { name: "Visionary", minXp: 2150, tagline: "Future-facing, guardrails on.", color: "#7B5CFF", iconColor: "#FFFFFF", image: "/images/ranks/visionary.png" },
  { name: "Singularity", minXp: 2800, tagline: "Full stack human. Certified.", color: "#171321", iconColor: "#FFD645", image: "/images/ranks/singularity.png" },
];

export function rankFor(xp: number): Rank {
  let r = RANKS[0];
  for (const rank of RANKS) if (xp >= rank.minXp) r = rank;
  return r;
}

export function nextRank(xp: number): Rank | null {
  for (const rank of RANKS) if (xp < rank.minXp) return rank;
  return null;
}

export function rankIndex(xp: number): number {
  let i = 0;
  RANKS.forEach((r, idx) => {
    if (xp >= r.minXp) i = idx;
  });
  return i;
}

// ─── Badges ──────────────────────────────────────────────────────────────────

export type BadgeId =
  | "first-contact"
  | "flawless"
  | "hot-streak"
  | "promptsmith"
  | "hallucination-hunter"
  | "data-whisperer"
  | "kit-master"
  | "team-human"
  | "triple-threat";

export type Badge = {
  id: BadgeId;
  name: string;
  flavor: string;
  how: string;
  color: string;
};

export const BADGES: Badge[] = [
  { id: "first-contact", name: "First Contact", flavor: "Boot sequence complete.", how: "Finish your very first lesson.", color: "#7B5CFF" },
  { id: "flawless", name: "No Notes", flavor: "Aced a checkpoint, first try.", how: "Get every checkpoint question right with zero misses.", color: "#43D9FF" },
  { id: "hot-streak", name: "Overclocked", flavor: "5-arrow combo in a boss fight.", how: "Answer 5 boss questions correctly in a row.", color: "#FF6B4A" },
  { id: "promptsmith", name: "Certified Promptsmith", flavor: "90+ signal in the Prompt Forge.", how: "Build a prompt that scores 90 or higher.", color: "#C6F32E" },
  { id: "hallucination-hunter", name: "Hallucination Hunter", flavor: "Caught every fabricated fact. Zero false alarms.", how: "Flag all five fakes in the Source Check lab — without flagging a real one.", color: "#FFD645" },
  { id: "data-whisperer", name: "Data Whisperer", flavor: "Inside the Machine: cleared.", how: "Complete every mission in Module 01.", color: "#7B5CFF" },
  { id: "kit-master", name: "Loaded Toolkit", flavor: "The Toolkit: cleared.", how: "Complete every mission in Module 02.", color: "#43D9FF" },
  { id: "team-human", name: "Team Human", flavor: "Human in the Loop: cleared.", how: "Complete every mission in Module 03.", color: "#FF6B4A" },
  { id: "triple-threat", name: "Full Network", flavor: "Every neuron lit. All of it.", how: "Complete all three modules.", color: "#FF8BD1" },
];

export const badgeById = (id: string) => BADGES.find((b) => b.id === id);

// ─── XP math ─────────────────────────────────────────────────────────────────

/** Combo bonus: +12 XP per combo step, capped at 5 steps (+60). */
export function comboBonus(maxCombo: number): number {
  return Math.min(Math.max(maxCombo, 0), 5) * 12;
}

export function lessonXp(base: number, maxCombo: number): number {
  return base + comboBonus(maxCombo);
}

// ─── Codename generator ──────────────────────────────────────────────────────

const CODE_ADJ = [
  "Neon", "Quantum", "Turbo", "Pixel", "Hyper", "Glitch", "Astro", "Cyber",
  "Voltage", "Midnight", "Solar", "Static", "Cosmic", "Rogue", "Chrome", "Vivid",
];
const CODE_NOUN = [
  "Falcon", "Badger", "Lynx", "Otter", "Cobra", "Raven", "Fox", "Mantis",
  "Kraken", "Comet", "Viper", "Panda", "Wolf", "Hawk", "Gecko", "Orca",
];

export function randomCodename(): string {
  const a = CODE_ADJ[Math.floor(Math.random() * CODE_ADJ.length)];
  const n = CODE_NOUN[Math.floor(Math.random() * CODE_NOUN.length)];
  return `${a} ${n}`;
}

// ─── Streak math ─────────────────────────────────────────────────────────────

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function bumpStreak(lastDate: string, current: number): { days: number; date: string } {
  const today = todayKey();
  if (lastDate === today) return { days: Math.max(current, 1), date: today };
  const yesterday = todayKey(new Date(Date.now() - 86400000));
  if (lastDate === yesterday) return { days: current + 1, date: today };
  return { days: 1, date: today };
}
