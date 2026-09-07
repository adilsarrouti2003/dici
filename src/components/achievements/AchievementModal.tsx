import React from 'react';
import { Achievement } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';
import { Trophy, X, Sparkles } from 'lucide-react';

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400 dark:border-amber-500 w-full max-w-sm p-6 text-center relative overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl">
          <DynamicIcon name={achievement.icon} className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Achievement Unlocked!</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Cairo']">
          {achievement.title}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
          {achievement.description}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-[#0d284f] dark:bg-blue-600 hover:bg-[#143d75] dark:hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer font-['Cairo']"
        >
          Claim Honor & Continue
        </button>
      </div>
    </div>
  );
};
