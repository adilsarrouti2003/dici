import React from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, XCircle, Clock, Flame, Calendar as CalendarIcon } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { habits, completions, currentDay, stats } = useHabits();
  const { t } = useLanguage();

  const activeHabits = habits.filter((h) => h.active);

  // Analyze all 90 days
  const daysData = Array.from({ length: 90 }, (_, i) => {
    const day = i + 1;
    let completedCount = 0;
    activeHabits.forEach((h) => {
      if (completions[`${h.id}_day_${day}`]) completedCount++;
    });

    const isPast = day < currentDay;
    const isToday = day === currentDay;
    const isFuture = day > currentDay;
    const ratio = activeHabits.length > 0 ? completedCount / activeHabits.length : 0;
    const isComplete = ratio >= 0.6; // 60%+ considered completed day

    let status: 'completed' | 'partial' | 'missed' | 'today' | 'future' = 'future';
    if (isToday) {
      status = 'today';
    } else if (isPast) {
      if (isComplete) status = 'completed';
      else if (completedCount > 0) status = 'partial';
      else status = 'missed';
    }

    return {
      day,
      completedCount,
      total: activeHabits.length,
      ratio,
      status,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          {t('calendar')} & Heatmap
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
          90-Day Journey Matrix
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Visual heat status for each day of your 90-day transformation.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-md bg-emerald-500" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">Completed Day (60%+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-md bg-amber-500" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">Partially Done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-md bg-rose-500/80" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">Missed Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-md bg-blue-600 ring-2 ring-blue-300" />
          <span className="text-slate-900 dark:text-white font-bold">Today (Day {currentDay})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-md bg-slate-100 dark:bg-slate-800" />
          <span className="text-slate-400 font-medium">Upcoming Day</span>
        </div>
      </div>

      {/* 90-Day Grid (Divided by Phases) */}
      {[
        { title: 'Phase 1: Days 1–30', start: 1, end: 30, color: 'border-blue-500' },
        { title: 'Phase 2: Days 31–60', start: 31, end: 60, color: 'border-indigo-500' },
        { title: 'Phase 3: Days 61–90', start: 61, end: 90, color: 'border-purple-500' },
      ].map((phase, pIdx) => (
        <div
          key={pIdx}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs"
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-black text-slate-900 dark:text-white font-['Cairo']">
              {phase.title}
            </h4>
            <span className="text-xs text-slate-400 font-medium">30 Days</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {daysData
              .filter((d) => d.day >= phase.start && d.day <= phase.end)
              .map((item) => {
                let cellStyle = 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 border-transparent';
                if (item.status === 'completed') {
                  cellStyle = 'bg-emerald-500 text-white font-bold shadow-xs';
                } else if (item.status === 'partial') {
                  cellStyle = 'bg-amber-500 text-white font-bold shadow-xs';
                } else if (item.status === 'missed') {
                  cellStyle = 'bg-rose-500 text-white font-bold';
                } else if (item.status === 'today') {
                  cellStyle = 'bg-blue-600 text-white font-black ring-2 ring-blue-300 dark:ring-blue-400 shadow-md scale-105';
                }

                return (
                  <div
                    key={item.day}
                    className={`h-12 rounded-xl border flex flex-col items-center justify-center p-1 transition-all cursor-default select-none ${cellStyle}`}
                    title={`Day ${item.day}: ${item.completedCount}/${item.total} completed (${Math.round(item.ratio * 100)}%)`}
                  >
                    <span className="text-[9px] opacity-70 leading-none">D</span>
                    <span className="text-xs font-black leading-none mt-0.5">{item.day}</span>
                    <span className="text-[8px] opacity-90 mt-0.5">
                      {item.completedCount}/{item.total}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};
