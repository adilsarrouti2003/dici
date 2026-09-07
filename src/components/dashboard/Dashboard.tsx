import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHabits } from '../../context/HabitsContext';
import { useLanguage } from '../../context/LanguageContext';
import { JourneyProgressBar } from './JourneyProgressBar';
import { 
  Flame, 
  CheckCircle2, 
  Calendar, 
  Trophy, 
  ArrowRight, 
  ArrowLeft,
  Share2, 
  Plus, 
  Sparkles,
  BarChart3,
  Check
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onOpenAddHabit: () => void;
  onOpenShareModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenAddHabit,
  onOpenShareModal,
}) => {
  const { user } = useAuth();
  const { habits, completions, stats, currentDay, toggleDay } = useHabits();
  const { t, isRTL } = useLanguage();

  const activeHabits = habits.filter((h) => h.active);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner & Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            {t('yourJourney')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo'] mt-0.5">
            Welcome back, {user?.displayName || 'Champion'}!
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4 text-blue-500" />
            <span>{t('shareProgress')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddHabit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d284f] dark:bg-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addHabit')}</span>
          </button>
        </div>
      </div>

      {/* 90-Day Visual Progress Bar */}
      <JourneyProgressBar
        currentDay={currentDay}
        completionPercentage={stats.overallCompletionPercentage}
      />

      {/* Top Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Day */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('currentDay')}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
            DAY {currentDay} <span className="text-xs text-slate-400 font-bold">/ 90</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {90 - currentDay} days remaining
          </span>
        </div>

        {/* Metric 2: Current Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('currentStreak')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo'] flex items-center gap-1.5">
            <span>{stats.currentStreak} Days</span>
            <span className="text-xl">🔥</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Best streak: {stats.bestStreak} days
          </span>
        </div>

        {/* Metric 3: Overall Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('overallProgress')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
            {stats.overallCompletionPercentage}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.totalCheckboxesChecked} total checks logged
          </span>
        </div>

        {/* Metric 4: Today's Completion */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('habitsToday')}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
            {stats.habitsCompletedToday} <span className="text-xs text-slate-400 font-bold">/ {activeHabits.length}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {activeHabits.length > 0 
              ? `${Math.round((stats.habitsCompletedToday / activeHabits.length) * 100)}% done today`
              : 'No habits added'}
          </span>
        </div>
      </div>

      {/* TODAY'S HABIT QUICK CHECK-IN SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-['Cairo'] flex items-center gap-2">
              <span>{t('todayFocus')} — DAY {currentDay}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                {stats.habitsCompletedToday} of {activeHabits.length} Done
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tap any habit below to mark it completed for today.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('today')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Today View</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Habits list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {activeHabits.map((habit) => {
            const isCompleted = completions[`${habit.id}_day_${currentDay}`];
            return (
              <div
                key={habit.id}
                onClick={() => toggleDay(habit.id, currentDay)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-100 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: habit.color || '#3b82f6' }}
                  />
                  <span className={`text-xs font-semibold font-['Cairo'] truncate ${isCompleted ? 'line-through opacity-80' : ''}`}>
                    {habit.name}
                  </span>
                </div>

                {/* Checkbox button */}
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-transform ${
                    isCompleted
                      ? 'bg-[#0d284f] dark:bg-blue-600 border-[#0d284f] text-white scale-110 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('tracker')}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#0c2340] to-[#163f73] text-white cursor-pointer shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 group"
        >
          <Calendar className="w-6 h-6 text-blue-300 mb-3" />
          <h4 className="text-base font-black font-['Cairo'] mb-1">90-Day Tracker Matrix</h4>
          <p className="text-xs text-blue-200 leading-relaxed">
            The full interactive 30-day phase table matching the original printable blueprint.
          </p>
        </div>

        <div
          onClick={() => onNavigate('progress')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white cursor-pointer shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <BarChart3 className="w-6 h-6 text-emerald-500 mb-3" />
          <h4 className="text-base font-black font-['Cairo'] mb-1">{t('progress')} Analytics</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Detailed weekly rates, best habits, and streak momentum charts.
          </p>
        </div>

        <div
          onClick={() => onNavigate('achievements')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white cursor-pointer shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <Trophy className="w-6 h-6 text-amber-500 mb-3" />
          <h4 className="text-base font-black font-['Cairo'] mb-1">{t('achievements')} Badges</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Unlock milestone medals for streaks, phase graduations, and check-ins.
          </p>
        </div>
      </div>
    </div>
  );
};
