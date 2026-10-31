// ─── Structured lesson content model ────────────────────────────────────────

export type ModuleSlug = "foundations" | "toolkit" | "ethics";

export type InteractiveId =
  | "teachable-machine"
  | "token-predictor"
  | "prompt-builder"
  | "scenario-deck"
  | "hallucination-hunt"
  | "network-viz";

export type Block =
  | { type: "lead"; text: string }
  | { type: "text"; heading?: string; kicker?: string; body: string[] }
  | { type: "list"; heading?: string; style: "check" | "x" | "arrow" | "bolt"; items: { title?: string; text: string }[] }
  | { type: "steps"; heading?: string; steps: { title: string; text: string }[] }
  | { type: "compare"; heading?: string; weak: { label: string; text: string }; strong: { label: string; text: string }; note?: string }
  | { type: "callout"; variant: "nova" | "warn" | "key"; title: string; text: string }
  | { type: "terms"; terms: { term: string; def: string }[] }
  | { type: "stat"; stats: { value: string; label: string }[]; note?: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "interactive"; id: InteractiveId; title: string; caption: string };

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Scenario = {
  setup: string;
  choiceA: { label: string; good: boolean; feedback: string };
  choiceB: { label: string; good: boolean; feedback: string };
};

export type Lesson = {
  slug: string;
  module: ModuleSlug;
  index: number; // position within module
  kind: "lesson" | "boss";
  title: string;
  subtitle: string;
  hook: string;
  minutes: number;
  xp: number;
  blocks: Block[];
  scenarios?: Scenario[];
  quiz: QuizQuestion[];
};

export type Module = {
  slug: ModuleSlug;
  order: number;
  title: string;
  codename: string;
  tagline: string;
  description: string;
  color: string; // hex accent
  softColor: string; // tinted bg
  emblem: string;
  outcomes: string[];
};
