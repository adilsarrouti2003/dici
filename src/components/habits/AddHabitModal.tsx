import React, { useState } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Sparkles } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMonth?: number;
}

const ICONS = ['Sparkles', 'BookOpen', 'Dumbbell', 'Flame', 'Heart', 'Briefcase', 'GraduationCap', 'Languages', 'Smile', 'Video', 'Zap', 'Coffee', 'Moon', 'Sun'];
const COLORS = ['#0284c7', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#14b8a6'];
const CATEGORIES = ['Health', 'Fitness', 'Learning', 'Productivity', 'Business', 'Personal Growth', 'Spiritual', 'Other'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, defaultMonth }) => {
  const { addHabit } = useHabits();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Learning');
  const [icon, setIcon] = useState('Sparkles');
  const [color, setColor] = useState('#0284c7');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([1, 2, 3]);

  React.useEffect(() => {
    if (defaultMonth && [1, 2, 3].includes(defaultMonth)) {
      setSelectedMonths([defaultMonth]);
    } else {
      setSelectedMonths([1, 2, 3]);
    }
  }, [defaultMonth, isOpen]);

  if (!isOpen) return null;

  const toggleMonth = (m: number) => {
    if (selectedMonths.includes(m)) {
      if (selectedMonths.length === 1) return; // keep at least one
      setSelectedMonths(selectedMonths.filter((x) => x !== m));
    } else {
      setSelectedMonths([...selectedMonths, m].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({
      name: name.trim(),
      category,
      icon,
      color,
      activeMonths: selectedMonths,
    });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-slate-900 dark:text-white font-['Cairo'] mb-4">
          {t('addHabit')}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-left rtl:text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Habit Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning 20-min Walk"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Cairo']"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Cairo']"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Month Target Selection */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 font-['Cairo']">
                تطبيق المهمة على أي شهر؟
              </label>
              <div className="flex gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setSelectedMonths([1, 2, 3])}
                  className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200"
                >
                  الكل (90 يوم)
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { m: 1, label: 'الشهر الأول', days: 'يوم 1 - 30' },
                { m: 2, label: 'الشهر الثاني', days: 'يوم 31 - 60' },
                { m: 3, label: 'الشهر الثالث', days: 'يوم 61 - 90' },
              ].map(({ m, label, days }) => {
                const isSelected = selectedMonths.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMonth(m)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {days}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-['Cairo']">
              يمكنك تخصيص مهمات مختلفة للشهر الثاني أو الثالث دون التأثير على الأشهر الأخرى.
            </p>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Theme Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                    color === c ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 text-xs font-bold bg-[#0d284f] dark:bg-blue-600 text-white rounded-xl hover:opacity-90 disabled:opacity-40"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
