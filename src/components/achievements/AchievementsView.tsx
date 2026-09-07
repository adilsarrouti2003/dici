import React from 'react';
import confetti from 'canvas-confetti';
import { useHabits } from '../../context/HabitsContext';
import { useLanguage } from '../../context/LanguageContext';
import { DynamicIcon } from '../common/DynamicIcon';
import { Trophy, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { achievements } = useHabits();
  const { t } = useLanguage();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleTestCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            {t('achievements')} & Badges
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
            Milestone Honors
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Earn badges as you hit consistency streaks and conquer 30-day phases.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold text-xs shadow-xs">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{unlockedCount} of {achievements.length} Unlocked</span>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((item) => {
          return (
            <div
              key={item.id}
              onClick={item.unlocked ? handleTestCelebrate : undefined}
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col items-center text-center select-none ${
                item.unlocked
                  ? 'bg-gradient-to-b from-white to-amber-50/40 dark:from-slate-900 dark:to-amber-950/20 border-amber-300 dark:border-amber-700 shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5'
                  : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              {/* Unlocked status badge */}
              {item.unlocked && (
                <div className="absolute top-3 right-3 text-amber-500">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              {/* Icon Container */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform ${
                  item.unlocked
                    ? 'bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-lg scale-105'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {item.unlocked ? (
                  <DynamicIcon name={item.icon} className="w-8 h-8" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>

              <h4 className="text-sm font-black text-slate-900 dark:text-white font-['Cairo'] mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                {item.description}
              </p>

              {item.unlocked ? (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-auto bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                  ✓ Unlocked
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-400 mt-auto bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Locked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
