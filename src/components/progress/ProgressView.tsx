import React from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Flame, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Award, 
  AlertCircle, 
  CheckCircle2,
  BarChart3,
  Sparkles
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { habits, completions, currentDay, stats, getHabitStats } = useHabits();
  const { t } = useLanguage();

  const activeHabits = habits.filter((h) => h.active);

  // Calculate habit stats
  const habitPerformances = activeHabits.map((h) => ({
    habit: h,
    stats: getHabitStats(h.id),
  }));

  // Sort to find best and weakest
  const sortedHabits = [...habitPerformances].sort(
    (a, b) => b.stats.completionPercentage - a.stats.completionPercentage
  );

  const bestHabit = sortedHabits[0];
  const weakestHabit = sortedHabits[sortedHabits.length - 1];

  // Calculate Monthly Breakdown
  // Month 1: Days 1–30, Month 2: Days 31–60, Month 3: Days 61–90
  const getMonthStats = (start: number, end: number) => {
    const totalSlots = activeHabits.length * (end - start + 1);
    let checks = 0;
    for (let d = start; d <= end; d++) {
      activeHabits.forEach((h) => {
        if (completions[`${h.id}_day_${d}`]) checks++;
      });
    }
    return {
      checks,
      totalSlots,
      percentage: totalSlots > 0 ? Math.round((checks / totalSlots) * 100) : 0,
    };
  };

  const month1 = getMonthStats(1, 30);
  const month2 = getMonthStats(31, 60);
  const month3 = getMonthStats(61, 90);

  // Calculate Weekly breakdown for first 12 weeks
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const start = i * 7 + 1;
    const end = Math.min(start + 6, 90);
    const totalSlots = activeHabits.length * (end - start + 1);
    let checks = 0;
    for (let d = start; d <= end; d++) {
      activeHabits.forEach((h) => {
        if (completions[`${h.id}_day_${d}`]) checks++;
      });
    }
    return {
      weekNumber: i + 1,
      start,
      end,
      percentage: totalSlots > 0 ? Math.round((checks / totalSlots) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          {t('progress')} & Metrics
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
          Comprehensive Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics calculated from your 90-day activity matrix.
        </p>
      </div>

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{t('overallProgress')}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
            {stats.overallCompletionPercentage}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across all 90 days
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{t('streak')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Cairo'] flex items-center gap-1">
            <span>{stats.currentStreak}d</span>
            <span className="text-xl">🔥</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {t('bestStreak')}: {stats.bestStreak} days
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{t('totalCheckboxes')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
            {stats.totalCheckboxesChecked}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Completed boxes
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{t('daysCompleted')}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
            {stats.daysCompleted} / {currentDay}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Days with &gt;60% completion
          </span>
        </div>
      </div>

      {/* Best & Weakest Habit Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best Habit */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-950/60 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
            <Award className="w-4 h-4" />
            <span>{t('bestHabit')} (Highest Discipline)</span>
          </div>

          {bestHabit ? (
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white font-['Cairo'] truncate">
                {bestHabit.habit.name}
              </h4>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{bestHabit.stats.totalCompletedDays} of 90 days completed</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {bestHabit.stats.completionPercentage}% Rate
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${bestHabit.stats.completionPercentage}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No habit data logged yet.</p>
          )}
        </div>

        {/* Weakest Habit */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-amber-200/80 dark:border-amber-950/60 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3">
            <AlertCircle className="w-4 h-4" />
            <span>{t('weakestHabit')} (Focus Area)</span>
          </div>

          {weakestHabit ? (
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white font-['Cairo'] truncate">
                {weakestHabit.habit.name}
              </h4>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{weakestHabit.stats.totalCompletedDays} of 90 days completed</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {weakestHabit.stats.completionPercentage}% Rate
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${weakestHabit.stats.completionPercentage}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No habit data logged yet.</p>
          )}
        </div>
      </div>

      {/* Monthly Breakdown Phase Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-black text-slate-900 dark:text-white font-['Cairo'] mb-4">
          30-Day Phase Breakdown (Monthly)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phase 1 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">
              Days 1–30
            </span>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Phase 1: Spark</h5>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {month1.percentage}%
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${month1.percentage}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {month1.checks} of {month1.totalSlots} boxes checked
            </span>
          </div>

          {/* Phase 2 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
              Days 31–60
            </span>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Phase 2: Rhythm</h5>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {month2.percentage}%
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${month2.percentage}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {month2.checks} of {month2.totalSlots} boxes checked
            </span>
          </div>

          {/* Phase 3 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">
              Days 61–90
            </span>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Phase 3: Identity</h5>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {month3.percentage}%
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${month3.percentage}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {month3.checks} of {month3.totalSlots} boxes checked
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Visual Momentum Chart (12 Weeks) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-black text-slate-900 dark:text-white font-['Cairo'] mb-4">
          Weekly Consistency Bar Graph (12 Weeks)
        </h3>

        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2">
          {weeks.map((w) => (
            <div key={w.weekNumber} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[9px] font-bold text-slate-400">
                {w.percentage}%
              </span>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-28 flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-[#0d284f] to-blue-500 rounded-t-lg transition-all duration-300"
                  style={{ height: `${Math.max(w.percentage, 4)}%` }}
                />
              </div>
              <span className="text-[9px] font-bold text-slate-500">
                W{w.weekNumber}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Habit-by-Habit Detailed Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-black text-slate-900 dark:text-white font-['Cairo'] mb-4">
          Individual Habit Performance
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rtl:text-right">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2.5 font-bold">Habit</th>
                <th className="py-2.5 font-bold text-center">Current Streak</th>
                <th className="py-2.5 font-bold text-center">Best Streak</th>
                <th className="py-2.5 font-bold text-center">Total Days</th>
                <th className="py-2.5 font-bold text-right rtl:text-left">Completion %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {habitPerformances.map(({ habit, stats }) => (
                <tr key={habit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200 font-['Cairo'] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color || '#3b82f6' }} />
                    <span>{habit.name}</span>
                  </td>
                  <td className="py-3 text-center font-bold text-amber-500">
                    {stats.currentStreak}d 🔥
                  </td>
                  <td className="py-3 text-center font-bold text-slate-600 dark:text-slate-300">
                    {stats.longestStreak}d
                  </td>
                  <td className="py-3 text-center font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalCompletedDays} / 90
                  </td>
                  <td className="py-3 text-right rtl:text-left font-black text-slate-900 dark:text-white">
                    {stats.completionPercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
