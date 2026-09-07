import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHabits } from '../../context/HabitsContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Share2, Copy, Check, Sparkles, Flame, Trophy } from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { stats, currentDay } = useHabits();
  const { t } = useLanguage();

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `I am on Day ${currentDay} of my 90-Day Challenge with a ${stats.currentStreak}-day streak and ${stats.overallCompletionPercentage}% completion! Tracking with 90 Days.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My 90 Days Progress',
          text: shareText,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-slate-900 dark:text-white font-['Cairo'] mb-4 text-center">
          {t('shareProgress')}
        </h3>

        {/* The Visual Social Share Card */}
        <div className="bg-gradient-to-br from-[#0c2340] via-[#103460] to-[#0c2340] text-white p-6 rounded-2xl shadow-xl text-center relative overflow-hidden mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white font-black text-xs flex items-center justify-center">
                90
              </div>
              <span className="text-xs font-black tracking-wider font-['Cairo']">90 DAYS</span>
            </div>
            <span className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">
              HABIT CHALLENGE
            </span>
          </div>

          <div className="my-6">
            <span className="text-xs text-blue-300 font-bold uppercase tracking-widest">
              {user?.displayName || 'Champion'}'s Journey
            </span>
            <h4 className="text-4xl font-black font-['Cairo'] tracking-tight mt-1 text-white">
              DAY {currentDay} <span className="text-xl text-blue-300">/ 90</span>
            </h4>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10 text-center">
            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-blue-200 block uppercase font-semibold">Streak</span>
              <div className="text-lg font-black text-amber-300 flex items-center justify-center gap-1">
                <span>{stats.currentStreak} Days</span>
                <span>🔥</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-blue-200 block uppercase font-semibold">Completion</span>
              <div className="text-lg font-black text-emerald-300">
                {stats.overallCompletionPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-3 px-4 bg-[#0d284f] dark:bg-blue-600 hover:bg-[#143d75] dark:hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-['Cairo']"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Progress</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
