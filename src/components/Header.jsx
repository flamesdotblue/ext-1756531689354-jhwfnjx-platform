import { Leaf, Flame } from "lucide-react";

export default function Header({ affirmation, streak }) {
  return (
    <header className="flex flex-col gap-3 sm:gap-4 items-start">
      <div className="inline-flex items-center gap-2 text-emerald-700">
        <Leaf className="h-6 w-6" />
        <span className="font-semibold tracking-wide">Mindful Micro Habits</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
        Build calm, one tiny practice at a time
      </h1>
      <p className="text-slate-600 text-base sm:text-lg">
        {affirmation}
      </p>
      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
        <Flame className="h-4 w-4" />
        <span>Current streak: <span className="font-semibold">{streak}</span> {streak === 1 ? "day" : "days"}</span>
      </div>
    </header>
  );
}
