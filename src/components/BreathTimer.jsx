import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PHASES = [
  { name: "Inhale", seconds: 4 },
  { name: "Hold", seconds: 4 },
  { name: "Exhale", seconds: 6 },
];

export default function BreathTimer({ onComplete }) {
  const [minutes, setMinutes] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseRemaining, setPhaseRemaining] = useState(PHASES[0].seconds);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const totalSeconds = useMemo(() => minutes * 60, [minutes]);
  const progress = totalSeconds > 0 ? Math.min(1, elapsed / totalSeconds) : 0;
  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    if (!isRunning) return;
    if (elapsed >= totalSeconds) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      onComplete?.(minutes);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
      setPhaseRemaining((r) => {
        if (r > 1) return r - 1;
        // advance to next phase
        setPhaseIndex((i) => (i + 1) % PHASES.length);
        return PHASES[(phaseIndex + 1) % PHASES.length].seconds;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, elapsed, totalSeconds, minutes, phaseIndex]);

  const start = () => {
    if (elapsed >= totalSeconds) reset();
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
    setPhaseIndex(0);
    setPhaseRemaining(PHASES[0].seconds);
  };

  const handleMinutesChange = (m) => {
    setMinutes(m);
    setElapsed(0);
    setPhaseIndex(0);
    setPhaseRemaining(PHASES[0].seconds);
    setIsRunning(false);
  };

  const ringCircumference = 2 * Math.PI * 56; // r=56
  const ringOffset = ringCircumference * (1 - progress);

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Breath timer</h2>
          <p className="text-slate-600 mt-1">Follow the rhythm: 4-4-6. Choose a short session and press start.</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
          <Timer className="h-4 w-4" />
          <span className="text-sm font-medium">{minutes} min</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-40 w-40">
            <svg className="h-40 w-40 -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="56" stroke="#e2e8f0" strokeWidth="12" fill="none" />
              <motion.circle
                cx="70"
                cy="70"
                r="56"
                stroke="#10b981"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                style={{ strokeDasharray: ringCircumference, strokeDashoffset: ringOffset }}
                animate={{ strokeDashoffset: ringOffset }}
                transition={{ type: "tween", ease: "linear", duration: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentPhase.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-slate-900 text-lg font-semibold"
                >
                  {currentPhase.name}
                </motion.div>
              </AnimatePresence>
              <div className="text-2xl font-bold text-slate-800 tabular-nums">{phaseRemaining}s</div>
              <div className="text-xs text-slate-500 mt-1">{Math.max(0, totalSeconds - elapsed)}s left</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={start}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2.5 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
              >
                <Play className="h-4 w-4" /> Start
              </button>
            ) : (
              <button
                onClick={pause}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <Pause className="h-4 w-4" /> Pause
              </button>
            )}
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <label className="text-sm font-medium text-slate-700">Session length</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[1, 3, 5].map((m) => (
                <button
                  key={m}
                  onClick={() => handleMinutesChange(m)}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    minutes === m
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900">How it works</h3>
            <ul className="mt-2 text-sm text-slate-600 list-disc ml-5 space-y-1">
              <li>Inhale 4s, hold 4s, exhale 6s. Repeat until the timer ends.</li>
              <li>Completing a session adds its minutes to your totals.</li>
              <li>Short and consistent sessions build the habit.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
