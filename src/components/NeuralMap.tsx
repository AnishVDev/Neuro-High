"use client";

import { useProgress } from "./ProgressProvider";

export default function NeuralMap({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { state, loading, isCompleted } = useProgress();

  return (
    <section
      style={{
        backgroundColor: "#0047FF",
        color: "#FFFFFF",
        minHeight: "500px",
        padding: "40px",
        border: "14px solid #FF1744",
        borderRadius: "30px",
        boxShadow: "16px 16px 0 #171321",
        fontFamily: "sans-serif",
      }}
      aria-label="Neural map test"
    >
      <div
        style={{
          backgroundColor: "#FFD645",
          color: "#171321",
          padding: "16px 24px",
          border: "5px solid #171321",
          borderRadius: "16px",
          fontSize: "18px",
          fontWeight: 900,
          display: "inline-block",
          transform: "rotate(-2deg)",
        }}
      >
        NEURAL MAP TEST VERSION
      </div>

      <h2
        style={{
          marginTop: "40px",
          fontSize: "clamp(42px, 8vw, 100px)",
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.05em",
        }}
      >
        IF THIS IS BLUE,
        <br />
        YOUR EDIT WORKED.
      </h2>

      <div
        style={{
          marginTop: "40px",
          padding: "24px",
          backgroundColor: "#C6F32E",
          color: "#171321",
          border: "6px solid #171321",
          borderRadius: "20px",
          boxShadow: "8px 8px 0 #171321",
          fontSize: "24px",
          fontWeight: 900,
        }}
      >
        <p>Progress provider status: {loading ? "LOADING" : "LOADED"}</p>
        <p>XP: {state?.learner.xp ?? 0}</p>
        <p>
          Completed lessons:{" "}
          {state ? Object.keys(state.completed).length : 0}
        </p>
        <p>Compact mode: {compact ? "YES" : "NO"}</p>
        <p>
          Provider test:{" "}
          {isCompleted("__test__") ? "COMPLETED" : "CONNECTED"}
        </p>
      </div>

      <p
        style={{
          marginTop: "36px",
          padding: "18px",
          backgroundColor: "#171321",
          color: "#FFD645",
          borderRadius: "12px",
          fontFamily: "monospace",
          fontSize: "18px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        This is a temporary diagnostic component.
      </p>
    </section>
  );
}
