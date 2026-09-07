import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useHabits } from '../../context/HabitsContext';
import { useLanguage } from '../../context/LanguageContext';
import { DynamicIcon } from '../common/DynamicIcon';
import { 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Check, 
  Plus, 
  Share2, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface TodayViewProps {
  onOpenAddHabit: () => void;
  onOpenShareModal: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ onOpenAddHabit, onOpenShareModal }) => {
  const { habits, completions, currentDay, toggleDay, stats } = useHabits();
  const { t } = useLanguage();

  // Allow viewing adjacent days if user wants to backfill yesterday or preview tomorrow
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const activeHabits = habits.filter((h) => h.active);
  const completedCount = activeHabits.filter((h) => completions[`${h.id}_day_${selectedDay}`]).length;
  const percentage = activeHabits.length > 0 ? Math.round((completedCount / activeHabits.length) * 100) : 0;
  const isAllDone = activeHabits.length > 0 && completedCount === activeHabits.length;

  const handleCompleteAllToday = () => {
    activeHabits.forEach((h) => {
      if (!completions[`${h.id}_day_${selectedDay}`]) {
        toggleDay(h.id, selectedDay);
      }
    });
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in pb-12">
      {/* Day Selector & Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          disabled={selectedDay <= 1}
          onClick={() => setSelectedDay(selectedDay - 1)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {selectedDay === currentDay ? 'TODAY' : `DAY ${selectedDay}`}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo'] leading-tight">
            DAY {selectedDay} <span className="text-xs text-slate-400 font-bold">/ 90</span>
          </h2>
          {selectedDay !== currentDay && (
            <button
              type="button"
              onClick={() => setSelectedDay(currentDay)}
              className="text-[10px] text-blue-600 hover:underline font-bold mt-0.5 block"
            >
              Jump back to Today (Day {currentDay})
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={selectedDay >= 90}
          onClick={() => setSelectedDay(selectedDay + 1)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Completion Rate Banner */}
      <div className="bg-gradient-to-br from-[#0c2340] to-[#143c70] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Streak: {stats.currentStreak} Days</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-['Cairo']">
              {completedCount} of {activeHabits.length} Habits Done
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              {isAllDone 
                ? '🌟 Phenomenal! You conquered every single habit today!' 
                : 'Keep your momentum strong. Complete each daily habit one by one.'}
            </p>
          </div>

          {/* Progress Circular / Ring Stat */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full border-4 border-blue-400/40 flex items-center justify-center font-black text-2xl font-['Cairo'] bg-black/20 shadow-inner">
              {percentage}%
            </div>
          </div>
        </div>

        {/* Linear gauge */}
        <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Habits Check-in List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Today's Checklist
          </h4>
          <button
            type="button"
            onClick={onOpenAddHabit}
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addHabit')}</span>
          </button>
        </div>

        {activeHabits.map((habit, idx) => {
          const isDone = completions[`${habit.id}_day_${selectedDay}`];
          return (
            <div
              key={habit.id}
              onClick={() => toggleDay(habit.id, selectedDay)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-4 group ${
                isDone
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: habit.color || '#3b82f6' }}
                >
                  <DynamicIcon name={habit.icon} className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {habit.category}
                    </span>
                  </div>
                  <h5 className={`text-sm sm:text-base font-bold font-['Cairo'] text-slate-900 dark:text-white mt-0.5 leading-snug truncate ${
                    isDone ? 'line-through opacity-75' : ''
                  }`}>
                    {habit.name}
                  </h5>
                </div>
              </div>

              {/* Big Checkbox */}
              <div
                className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${
                  isDone
                    ? 'bg-[#0d284f] dark:bg-blue-600 border-[#0d284f] dark:border-blue-600 text-white scale-105 shadow-md'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-blue-500'
                }`}
              >
                {isDone && <Check className="w-5 h-5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete All Celebration Button */}
      {!isAllDone && activeHabits.length > 0 && (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={handleCompleteAllToday}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer font-['Cairo']"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mark All Habits Completed for Day {selectedDay}!</span>
          </button>
        </div>
      )}

      {/* Share Badge CTA */}
      {isAllDone && (
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center animate-in zoom-in-95">
          <Award className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-200 font-['Cairo']">
            {t('allDoneToday')}
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 mb-4">
            You completed 100% of your commitments for today. Share your victory with friends!
          </p>
          <button
            type="button"
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('shareProgress')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
