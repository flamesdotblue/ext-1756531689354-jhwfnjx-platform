import { useMemo } from "react";
import { Calendar, CheckCircle, Flame } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "No check-ins yet";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function DailyCheckIn({ lastCheckin, streak, onCheckIn }) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const alreadyCheckedIn = useMemo(() => {
    if (!lastCheckin) return false;
    const last = new Date(lastCheckin);
    last.setHours(0, 0, 0, 0);
    return last.getTime() === today.getTime();
  }, [lastCheckin, today]);

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Daily mindful moment</h2>
          <p className="text-slate-600 mt-1">Check in once a day to keep your streak alive.</p>
        </div>
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
          <Flame className="h-4 w-4" />
          <span className="text-sm font-medium">{streak}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={onCheckIn}
          disabled={alreadyCheckedIn}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
            alreadyCheckedIn
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          }`}
        >
          {alreadyCheckedIn ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Checked in today
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              Mark mindful moment
            </>
          )}
        </button>

        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Last check-in: <span className="font-medium text-slate-800">{formatDate(lastCheckin)}</span></span>
        </div>
      </div>

      <ul className="mt-5 text-sm text-slate-600 list-disc ml-5 space-y-1">
        <li>Check in once per day to grow your streak.</li>
        <li>Each check-in adds 1 mindful minute to your totals.</li>
      </ul>
    </div>
  );
}
