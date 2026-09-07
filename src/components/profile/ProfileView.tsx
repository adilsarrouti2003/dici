import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useHabits } from '../../context/HabitsContext';
import { Language, Theme } from '../../types';
import { 
  User as UserIcon, 
  Settings, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  LogOut, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  Share2,
  Database
} from 'lucide-react';
import { DataTransparencyModal } from '../common/DataTransparencyModal';

interface ProfileViewProps {
  onOpenShareModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenShareModal }) => {
  const { user, logout, updateUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { stats, currentDay } = useHabits();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    updateUser({ displayName: displayName.trim() });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const formattedStartDate = user?.journeyStartDate
    ? new Date(user.journeyStartDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Day 1';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in pb-16">
      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0d284f] to-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
          {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
        </div>

        <div className="text-center sm:text-left rtl:sm:text-right flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Cairo'] truncate">
              {user?.displayName || 'Champion'}
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              90 Days Journey
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {user?.email} • Started {formattedStartDate}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
            <button
              type="button"
              onClick={onOpenShareModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('shareProgress')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-level Journey Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{t('currentDay')}</span>
          <div className="text-xl font-black text-slate-900 dark:text-white font-['Cairo'] mt-1">
            DAY {currentDay} / 90
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{t('currentStreak')}</span>
          <div className="text-xl font-black text-amber-500 font-['Cairo'] mt-1 flex items-center justify-center gap-1">
            <span>{stats.currentStreak}d</span>
            <span>🔥</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{t('bestStreak')}</span>
          <div className="text-xl font-black text-slate-900 dark:text-white font-['Cairo'] mt-1">
            {stats.bestStreak}d
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{t('overallProgress')}</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-['Cairo'] mt-1">
            {stats.overallCompletionPercentage}%
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h4 className="text-base font-black text-slate-900 dark:text-white font-['Cairo'] mb-4 flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-blue-600" />
          <span>Edit Profile</span>
        </h4>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Cairo']"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ✓ Saved successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d284f] dark:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer hover:opacity-90"
            >
              <Save className="w-4 h-4" />
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Settings & Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <h4 className="text-base font-black text-slate-900 dark:text-white font-['Cairo'] flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-600" />
          <span>{t('settings')} & Preferences</span>
        </h4>

        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>{t('language')}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Arabic includes full native right-to-left layout shifting.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { code: 'en', label: 'English' },
              { code: 'ar', label: 'العربية' },
              { code: 'fr', label: 'Français' },
              { code: 'es', label: 'Español' },
            ].map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code as Language)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  language === l.code
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{t('theme')}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Switch between daylight and comfortable night mode.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'light', label: t('light') },
              { id: 'dark', label: t('dark') },
              { id: 'system', label: t('system') },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setTheme(th.id as Theme)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  theme === th.id
                    ? 'bg-[#0d284f] dark:bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Reminder Settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-slate-400" />
              <span>{t('dailyReminder')}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Receive a daily prompt to keep your streak alive.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setDailyReminder(!dailyReminder)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                dailyReminder ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  dailyReminder ? 'right-1 rtl:right-auto rtl:left-1' : 'left-1 rtl:left-auto rtl:right-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Persistence & Transparency Settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>شفافية البيانات والحفظ التلقائي (Data & Backup)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              بياناتك محفوظة محلياً فورياً عند كل تعديل. يمكنك استخراج نسخة احتياطية أو استعادتها بأمان.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTransparencyOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors cursor-pointer self-start sm:self-auto"
          >
            إدارة البيانات والنسخ الاحتياطي
          </button>
        </div>

        {/* Logout Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Data Transparency Modal */}
      <DataTransparencyModal
        isOpen={isTransparencyOpen}
        onClose={() => setIsTransparencyOpen(false)}
      />
    </div>
  );
};
