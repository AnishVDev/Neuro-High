"use client";

import Image from "next/image";
import { useState } from "react";
import { Atom, Eye, KeyRound, Layers, Power, SlidersHorizontal, Terminal, Wand2 } from "lucide-react";
import { USE_RANK_IMAGES, type Rank } from "@/lib/gamification";

/** Built-in icons used until the custom rank images are added. */
const FALLBACK_ICONS: Record<string, typeof Power> = {
  Bootloader: Power,
  Cipher: KeyRound,
  Operator: Terminal,
  Promptsmith: Wand2,
  "Systems Tuner": SlidersHorizontal,
  Architect: Layers,
  Visionary: Eye,
  Singularity: Atom,
};

export default function RankIcon({
  rank,
  size = 36,
  className = "",
}: {
  rank: Rank;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const Icon = FALLBACK_ICONS[rank.name] ?? Power;
  const showImage = USE_RANK_IMAGES && !failed;

  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-lg border-2 border-ink ${className}`}
      style={{ width: size, height: size, backgroundColor: rank.color }}
      title={rank.name}
    >
      {showImage ? (
        <Image
          src={rank.image}
          alt=""
          width={size}
          height={size}
          unoptimized
          onError={() => setFailed(true)}
          className="size-full object-contain p-0.5"
        />
      ) : (
        <Icon
          size={Math.round(size * 0.5)}
          color={rank.iconColor}
          strokeWidth={2.4}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
