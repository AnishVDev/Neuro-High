import { Sparkle } from "lucide-react";

const ITEMS = [
  "AI in the classroom",
  "think critically",
  "smarter study strategies",
  "research with confidence",
  "recognize misinformation",
  "prepare for the future",
  "creativity meets technology",
  "academic integrity matters",
  "turn curiosity into discovery",
  "learn beyond the textbook",
  "make informed decisions",
  "technology, on your terms",
];

export default function Marquee({
  bg = "#FFD645",
  rotate = true,
}: {
  bg?: string;
  rotate?: boolean;
}) {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-4 px-4 py-2.5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-ink">
          {item}
          <Sparkle className="size-4 text-ink/60" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden border-y-2 border-ink ${rotate ? "-mx-2 -rotate-1 scale-[1.01]" : ""}`}
      style={{ backgroundColor: bg }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
