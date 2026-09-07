import React from 'react';
import { MOTIVATIONAL_MESSAGES } from '../../constants/defaults';
import { Sparkles, Flag, Flame, Trophy } from 'lucide-react';

interface JourneyProgressBarProps {
  currentDay: number;
  totalDays?: number;
  completionPercentage: number;
}

export const JourneyProgressBar: React.FC<JourneyProgressBarProps> = ({
  currentDay,
  totalDays = 90,
  completionPercentage,
}) => {
  const progressRatio = Math.min(Math.max(currentDay / totalDays, 0), 1);

  // Motivational quote based on closest milestone
  const milestoneKeys = [90, 89, 75, 60, 45, 30, 21, 14, 7, 3, 1];
  const matchedDay = milestoneKeys.find((k) => currentDay >= k) || 1;
  const quote = MOTIVATIONAL_MESSAGES[matchedDay];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      {/* Top Details */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            {currentDay}
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white font-['Cairo'] leading-none">
              DAY {currentDay} of {totalDays}
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {completionPercentage}% Overall Habit Completion
            </span>
          </div>
        </div>

        {/* Phase Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
          <Flag className="w-3.5 h-3.5 text-blue-600" />
          <span>
            {currentDay <= 30
              ? 'Phase 1: Spark (Days 1–30)'
              : currentDay <= 60
              ? 'Phase 2: Rhythm (Days 31–60)'
              : 'Phase 3: Identity (Days 61–90)'}
          </span>
        </div>
      </div>

      {/* Visual Progress Bar with Current Marker */}
      <div className="relative pt-4 pb-2">
        <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
          {/* Phase partition markers */}
          <div className="absolute top-0 bottom-0 left-[33.33%] w-[2px] bg-white dark:bg-slate-900 z-10 opacity-70" />
          <div className="absolute top-0 bottom-0 left-[66.66%] w-[2px] bg-white dark:bg-slate-900 z-10 opacity-70" />

          {/* Filled Bar */}
          <div
            className="h-full bg-gradient-to-r from-[#0d284f] via-blue-600 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>

        {/* Step labels */}
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">
          <span>DAY 1</span>
          <span className="text-blue-600 dark:text-blue-400 font-extrabold">DAY 30</span>
          <span className="text-blue-600 dark:text-blue-400 font-extrabold">DAY 60</span>
          <span>DAY 90 🏆</span>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="font-semibold italic font-['Cairo']">{quote}</span>
      </div>
    </div>
  );
};
