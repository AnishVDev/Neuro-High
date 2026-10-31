"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Shuffle } from "lucide-react";

type Weights = { w1: number[][]; w2: number[][] };

const PRESETS: { name: string; desc: string; w: Weights }[] = [
  {
    name: "Curious",
    desc: "Weights tuned to amplify both inputs",
    w: {
      w1: [
        [0.8, 0.5, -0.2, 0.6],
        [0.6, -0.4, 0.9, 0.3],
        [0.4, 0.7, 0.5, -0.5],
      ],
      w2: [
        [0.9, 0.4],
        [0.7, -0.6],
        [0.5, 0.8],
        [-0.3, 0.6],
      ],
    },
  },
  {
    name: "Chaotic",
    desc: "Untrained random dials — pure noise",
    w: {
      w1: [
        [1.4, -1.2, 0.2, -0.9],
        [-1.1, 1.3, -0.4, 0.5],
        [0.3, -0.8, 1.5, -1.0],
      ],
      w2: [
        [-1.2, 1.1],
        [0.9, -1.3],
        [1.4, 0.2],
        [-0.6, -0.8],
      ],
    },
  },
  {
    name: "Focused",
    desc: "Weights tuned to care about one input",
    w: {
      w1: [
        [1.2, 0.1, 0.05, 0.9],
        [-0.1, 0.05, 0.1, 0.1],
        [0.9, -0.05, 0.1, 0.7],
      ],
      w2: [
        [1.1, 0.05],
        [0.02, 0.03],
        [0.9, 0.08],
        [0.6, 0.04],
      ],
    },
  },
];

const tanh = (x: number) => Math.tanh(x);
const relu = (x: number) => Math.max(0, x);

function forward(input: number[], w: Weights) {
  const hidden = w.w1[0].map((_, j) =>
    relu(input[0] * w.w1[0][j] + input[1] * w.w1[1][j] + input[2] * w.w1[2][j]),
  );
  const out = w.w2[0].map((_, k) =>
    tanh(hidden[0] * w.w2[0][k] + hidden[1] * w.w2[1][k] + hidden[2] * w.w2[2][k] + hidden[3] * w.w2[3][k]),
  );
  return { hidden, out };
}

const INPUT_LABELS = ["HOURS STUDIED", "SLEEP (HRS)", "PRACTICE TESTS"];
const OUT_LABELS = ["PASS", "FAIL"];

const X_POS = [60, 300, 540];
const INPUT_Y = [60, 160, 260];
const HIDDEN_Y = [45, 120, 195, 270];
const OUT_Y = [100, 220];

export default function NetworkViz() {
  const [inputs, setInputs] = useState([0.7, 0.5, 0.4]);
  const [preset, setPreset] = useState(0);
  const [fireStage, setFireStage] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout>[]>([]);

  const { hidden, out } = useMemo(() => forward(inputs, PRESETS[preset].w), [inputs, preset]);

  const fire = () => {
    timer.current.forEach(clearTimeout);
    setFireStage(0);
    [400, 800, 1250].forEach((ms, i) => {
      timer.current.push(setTimeout(() => setFireStage(i + 1), ms));
    });
    timer.current.push(setTimeout(() => setFireStage(-1), 3200));
  };

  const w = PRESETS[preset].w;
  const edgeAlpha = (abs: number) => 0.12 + Math.min(abs, 1.2) * 0.55;
  const glow = (on: boolean) =>
    on ? { filter: "drop-shadow(0 0 6px rgba(123,92,255,0.9))" } : undefined;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-ink bg-paper px-3 py-2.5">
        {PRESETS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setPreset(i)}
            className={`rounded-lg border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
              preset === i ? "bg-vio text-white" : "bg-white text-ink/60 hover:bg-ink/5"
            }`}
            title={p.desc}
          >
            {p.name} weights
          </button>
        ))}
        <button
          onClick={fire}
          className="ml-auto flex items-center gap-1.5 rounded-lg border-2 border-ink bg-lime px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink shadow-[2.5px_2.5px_0_#171321] transition-transform hover:-translate-y-0.5"
        >
          <Play className="size-3.5" /> Fire signal
        </button>
      </div>

      <div className="grid gap-0 md:grid-cols-[240px_1fr]">
        {/* input sliders */}
        <div className="border-b-2 border-ink bg-cream p-4 md:border-b-0 md:border-r-2">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Inputs — you control these</p>
          {INPUT_LABELS.map((label, i) => (
            <label key={label} className="mt-4 block">
              <span className="mb-1 flex justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                {label}
                <span className="text-vio">{Math.round(inputs[i] * 100)}</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(inputs[i] * 100)}
                onChange={(e) =>
                  setInputs((s) => {
                    const n = [...s];
                    n[i] = Number(e.target.value) / 100;
                    return n;
                  })
                }
                className="w-full accent-[#7B5CFF]"
                aria-label={label}
              />
            </label>
          ))}
          <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
            <Shuffle className="mr-1 inline size-3" /> Switch weight presets above — same inputs, different network, different answer.
          </p>
        </div>

        {/* svg network */}
        <div className="relative bg-[#FBF7EE]">
          <svg viewBox="0 0 600 330" className="h-auto w-full" role="img" aria-label="A small neural network diagram">
            {/* edges input→hidden */}
            {INPUT_Y.map((y1, i) =>
              HIDDEN_Y.map((y2, j) => (
                <line
                  key={`e1-${i}-${j}`}
                  x1={X_POS[0]}
                  y1={y1}
                  x2={X_POS[1]}
                  y2={y2}
                  stroke="#7B5CFF"
                  strokeOpacity={edgeAlpha(Math.abs(w.w1[i][j]))}
                  strokeWidth={Math.max(1, Math.abs(w.w1[i][j]) * 3)}
                  strokeDasharray={fireStage === 1 ? "6 6" : undefined}
                  className={fireStage === 1 ? "edge-flow" : ""}
                />
              )),
            )}
            {/* edges hidden→out */}
            {HIDDEN_Y.map((y1, j) =>
              OUT_Y.map((y2, k) => (
                <line
                  key={`e2-${j}-${k}`}
                  x1={X_POS[1]}
                  y1={y1}
                  x2={X_POS[2]}
                  y2={y2}
                  stroke="#FF6B4A"
                  strokeOpacity={edgeAlpha(Math.abs(w.w2[j][k]))}
                  strokeWidth={Math.max(1, Math.abs(w.w2[j][k]) * 3)}
                  strokeDasharray={fireStage === 2 ? "6 6" : undefined}
                  className={fireStage === 2 ? "edge-flow" : ""}
                />
              )),
            )}
            {/* input nodes */}
            {INPUT_Y.map((y, i) => (
              <g key={`in-${i}`} style={glow(fireStage === 0)}>
                <circle cx={X_POS[0]} cy={y} r={14 + inputs[i] * 10} fill="#43D9FF" stroke="#171321" strokeWidth={2.5} />
                <text x={X_POS[0]} y={y + 4} textAnchor="middle" fontFamily="monospace" fontSize={11} fontWeight={700} fill="#171321">
                  {Math.round(inputs[i] * 100)}
                </text>
              </g>
            ))}
            {/* hidden nodes */}
            {HIDDEN_Y.map((y, j) => (
              <g key={`h-${j}`} style={glow(fireStage === 2)}>
                <circle cx={X_POS[1]} cy={y} r={13 + hidden[j] * 10} fill="#7B5CFF" stroke="#171321" strokeWidth={2.5} />
                <text x={X_POS[1]} y={y + 4} textAnchor="middle" fontFamily="monospace" fontSize={11} fontWeight={700} fill="#fff">
                  {hidden[j].toFixed(1)}
                </text>
              </g>
            ))}
            {/* output nodes */}
            {OUT_Y.map((y, k) => (
              <g key={`o-${k}`} style={glow(fireStage === 3)}>
                <circle
                  cx={X_POS[2]}
                  cy={y}
                  r={18}
                  fill={k === 0 ? "#C6F32E" : "#FFD645"}
                  stroke="#171321"
                  strokeWidth={2.5}
                />
                <text x={X_POS[2]} y={y + 4} textAnchor="middle" fontFamily="monospace" fontSize={10} fontWeight={700} fill="#171321">
                  {OUT_LABELS[k]}
                </text>
              </g>
            ))}
          </svg>

          {/* output bars */}
          <div className="border-t-2 border-ink bg-white px-4 py-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
              Output — the network&apos;s prediction
            </p>
            {OUT_LABELS.map((label, k) => (
              <div key={label} className="mt-2 flex items-center gap-2">
                <span className={`chip w-16 justify-center ${k === 0 ? "bg-lime" : "bg-sun"}`}>{label}</span>
                <div className="h-4 flex-1 rounded-full border-2 border-ink bg-white">
                  <motion.div
                    className={`h-full rounded-full ${k === 0 ? "bg-lime" : "bg-sun"}`}
                    animate={{ width: `${Math.max(2, Math.round(((out[k] + 1) / 2) * 100))}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-xs font-bold text-ink">
                  {Math.round(((out[k] + 1) / 2) * 100)}
                </span>
              </div>
            ))}
            <p className="mt-2 text-[11px] text-ink/60">
              The numbers INSIDE the connections are the weights — the only difference between the three presets. Same inputs, different dials, different answer. Training is just automated dial-turning.
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .edge-flow {
          animation: dashmove 0.5s linear infinite;
        }
        @keyframes dashmove {
          to {
            stroke-dashoffset: -12;
          }
        }
      `}</style>
    </div>
  );
}
