import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useHabits } from '../../context/HabitsContext';
import { GoalCategory } from '../../types';
import { ONBOARDING_SUGGESTIONS } from '../../constants/defaults';
import { 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Heart, 
  Dumbbell, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Flame, 
  Compass
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const CATEGORIES: { id: GoalCategory; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'Health', label: 'Health & Wellness', icon: Heart, color: 'text-rose-500' },
  { id: 'Fitness', label: 'Fitness & Physical', icon: Dumbbell, color: 'text-emerald-500' },
  { id: 'Learning', label: 'Learning & Skills', icon: BookOpen, color: 'text-blue-500' },
  { id: 'Productivity', label: 'Productivity & Focus', icon: Briefcase, color: 'text-indigo-500' },
  { id: 'Business', label: 'Business & Career', icon: TrendingUp, color: 'text-amber-500' },
  { id: 'Personal Growth', label: 'Personal Growth', icon: Sparkles, color: 'text-purple-500' },
  { id: 'Spiritual', label: 'Spiritual & Inner Peace', icon: Flame, color: 'text-sky-500' },
  { id: 'Other', label: 'Custom Mastery', icon: Compass, color: 'text-slate-500' },
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { updateUser } = useAuth();
  const { t, isRTL } = useLanguage();
  const { habits, addHabit, deleteHabit } = useHabits();

  const [step, setStep] = useState<number>(1);
  const [selectedGoal, setSelectedGoal] = useState<GoalCategory>('Learning');
  const [customHabitText, setCustomHabitText] = useState('');
  const [durationDays, setDurationDays] = useState(90);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Finish onboarding
      updateUser({
        goal: selectedGoal,
        durationDays,
        journeyStartDate: new Date().toISOString(),
        isOnboarded: true,
      });
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHabitText.trim()) return;
    addHabit({
      name: customHabitText.trim(),
      category: selectedGoal,
      icon: 'CheckCircle2',
      color: '#0284c7',
    });
    setCustomHabitText('');
  };

  const currentSuggestions = ONBOARDING_SUGGESTIONS[selectedGoal] || ONBOARDING_SUGGESTIONS.Learning;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-6 sm:p-10 transition-all">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>Step {step} of 4</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">{step * 25}% Complete</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0d284f] to-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>

        {/* STEP 1: What's your main goal? */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
                {t('onboardingStep1')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('selectCategory')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedGoal === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedGoal(cat.id)}
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                    <span className="text-xs font-bold font-['Cairo']">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Choose your habits */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
                {t('onboardingStep2')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Add, remove, or customize the habits you will stick to for 90 days.
              </p>
            </div>

            {/* Suggestions Chips */}
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Suggested for {selectedGoal}:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentSuggestions.map((suggestion) => {
                  const alreadyAdded = habits.some((h) => h.name === suggestion);
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => {
                        addHabit({
                          name: suggestion,
                          category: selectedGoal,
                          icon: 'CheckCircle2',
                          color: '#3b82f6',
                        });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        alreadyAdded
                          ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60 cursor-not-allowed'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {alreadyAdded ? '✓ ' : '+ '}
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input */}
            <form onSubmit={handleAddCustom} className="flex gap-2">
              <input
                type="text"
                value={customHabitText}
                onChange={(e) => setCustomHabitText(e.target.value)}
                placeholder={t('customHabitPlaceholder')}
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Cairo']"
              />
              <button
                type="submit"
                disabled={!customHabitText.trim()}
                className="px-4 py-2 bg-[#0d284f] dark:bg-blue-600 text-white rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Active Selected Habits */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {habits.map((h, idx) => (
                <div 
                  key={h.id} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-['Cairo']">
                      {h.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteHabit(h.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: How many days? */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in text-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
                {t('onboardingStep3')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('daysDurationNotice')}
              </p>
            </div>

            <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-blue-950/40 border-2 border-blue-600 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-[#0d284f] dark:bg-blue-600 text-white flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-lg">
                90
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-['Cairo']">
                90 Consecutive Days
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Divided into 3 focused 30-day phases.
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-blue-200 dark:border-slate-700 text-center">
                <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-500">Days 1–30</div>
                  <div className="text-xs font-black text-blue-900 dark:text-blue-300">Phase 1: Spark</div>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-500">Days 31–60</div>
                  <div className="text-xs font-black text-blue-900 dark:text-blue-300">Phase 2: Rhythm</div>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-500">Days 61–90</div>
                  <div className="text-xs font-black text-blue-900 dark:text-blue-300">Phase 3: Identity</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Start your journey */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0d284f] to-blue-600 text-white flex items-center justify-center mx-auto shadow-xl">
              <Calendar className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
                You Are Ready for Day 1!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
                Your 90-day tracking matrix has been configured with {habits.length} habits. Every checkbox marked is a brick in your future self.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
              💡 Daily check-in rule: Mark your habits once per day before sleeping or right after completing them.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('back')}
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#0d284f] hover:bg-[#143d75] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all cursor-pointer font-['Cairo']"
          >
            <span>{step === 4 ? t('startJourneyBtn') : t('next')}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
