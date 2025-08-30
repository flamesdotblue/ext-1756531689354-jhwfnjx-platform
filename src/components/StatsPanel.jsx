import { Activity, Timer, Calendar } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex items-center gap-4">
      <div className="shrink-0 h-11 w-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm text-slate-600">{label}</div>
        <div className="text-2xl font-bold text-slate-900 leading-tight">{value}</div>
        {sub ? <div className="text-xs text-slate-500 mt-0.5">{sub}</div> : null}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function StatsPanel({ state }) {
  const { streak, totalSessions, totalMinutes, lastCheckin } = state;

  // Simple weekly progress: how many check-ins this week inferred from streak proximity to 7
  // Not exact, but gives a sense of momentum. We keep UI minimal.
  const weeklyRatio = Math.min(1, streak / 7);

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Your mindful stats</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <StatCard icon={Activity} label="Total sessions" value={totalSessions} sub="Daily check-ins + breath sessions" />
        <StatCard icon={Timer} label="Mindful minutes" value={totalMinutes} sub="Cumulative practice time" />
        <StatCard icon={Calendar} label="Last check-in" value={formatDate(lastCheckin)} sub={`${streak} day${streak === 1 ? "" : "s"} streak`} />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Weekly momentum</span>
          <span className="text-sm text-slate-600">{Math.round(weeklyRatio * 100)}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${weeklyRatio * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
