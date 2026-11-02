import type { Metadata } from "next";
import { LeaderboardFull } from "@/components/Leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard — NEURO//HIGH",
  description: "See how your XP and rank compare on the NEURO//HIGH leaderboard.",
};

export default function LeaderboardPage() {
  return <LeaderboardFull />;
}
