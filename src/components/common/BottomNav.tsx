import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Grid, CheckSquare, Calendar, BarChart3, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { t } = useLanguage();

  const items = [
    { id: 'dashboard', label: t('dashboard'), icon: Grid },
    { id: 'today', label: t('today'), icon: CheckSquare },
    { id: 'tracker', label: t('tracker90'), icon: Calendar },
    { id: 'progress', label: t('progress'), icon: BarChart3 },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <div className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all select-none cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-none tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
