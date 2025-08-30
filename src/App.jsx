import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import DailyCheckIn from "./components/DailyCheckIn";
import BreathTimer from "./components/BreathTimer";
import StatsPanel from "./components/StatsPanel";

const STORAGE_KEY = "mindful_micro_state_v1";

const startState = {
  streak: 0,
  lastCheckin: null,
  totalSessions: 0,
  totalMinutes: 0,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return startState;
    const parsed = JSON.parse(raw);
    return { ...startState, ...parsed };
  } catch {
    return startState;
  }
}

export default function App() {
  const [state, setState] = useState(startState);
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const affirmations = useMemo(
    () => [
      "Small breaths, big change.",
      "Be where your feet are.",
      "One mindful minute matters.",
      "Exhale tension, inhale ease.",
      "Slow is smooth. Smooth is fast.",
    ],
    []
  );

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const id = setInterval(() => {
      setAffirmationIndex((i) => (i + 1) % affirmations.length);
    }, 5000);
    return () => clearInterval(id);
  }, [affirmations.length]);

  const handleCheckIn = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last = state.lastCheckin ? new Date(state.lastCheckin) : null;
    if (last) last.setHours(0, 0, 0, 0);

    let newStreak = state.streak;
    if (!last) {
      newStreak = 1;
    } else {
      const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        // already checked in today; do nothing to streak
        newStreak = state.streak;
      } else if (diffDays === 1) {
        newStreak = state.streak + 1;
      } else {
        newStreak = 1;
      }
    }

    // Only increment sessions/minutes if not already done today
    const alreadyToday = last && (today - last === 0);

    setState((s) => ({
      ...s,
      streak: newStreak,
      lastCheckin: today.toISOString(),
      totalSessions: s.totalSessions + (alreadyToday ? 0 : 1),
      totalMinutes: s.totalMinutes + (alreadyToday ? 0 : 1),
    }));
  };

  const handleBreathComplete = (minutes) => {
    setState((s) => ({
      ...s,
      totalSessions: s.totalSessions + 1,
      totalMinutes: s.totalMinutes + minutes,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <Header
          affirmation={affirmations[affirmationIndex]}
          streak={state.streak}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6">
          <AnimatePresence>
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="order-1"
            >
              <DailyCheckIn
                lastCheckin={state.lastCheckin}
                streak={state.streak}
                onCheckIn={handleCheckIn}
              />
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.05 }}
              className="order-2"
            >
              <BreathTimer onComplete={handleBreathComplete} />
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="order-3 md:col-span-2"
            >
              <StatsPanel state={state} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
