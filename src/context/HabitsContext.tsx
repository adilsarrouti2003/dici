import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Habit, Achievement, OverallStats, HabitStats } from '../types';
import { StorageService } from '../services/storage';
import { useAuth } from './AuthContext';

interface HabitsContextType {
  habits: Habit[];
  completions: Record<string, boolean>;
  achievements: Achievement[];
  stats: OverallStats;
  currentDay: number;
  lastSaved: string;
  toggleDay: (habitId: string, dayNumber: number) => void;
  addHabit: (data: { name: string; category: string; icon: string; color: string; activeMonths?: number[] }) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  reorderHabits: (reordered: Habit[]) => void;
  resetToDefaultHabits: () => void;
  getHabitStats: (habitId: string) => HabitStats;
  filterHabitsByMonth: (monthNumber: number) => Habit[];
  exportBackup: () => void;
  importBackup: (jsonContent: string) => { success: boolean; message: string };
  reloadData: () => void;
  newAchievementUnlocked: Achievement | null;
  dismissAchievementModal: () => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest_default';

  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievementUnlocked, setNewAchievementUnlocked] = useState<Achievement | null>(null);
  const [lastSaved, setLastSaved] = useState<string>('الآن');

  // Load state when user changes
  const reloadData = useCallback(() => {
    if (!user) return;
    const userHabits = StorageService.getHabits(user.id);
    const userCompletions = StorageService.getCompletions(user.id);
    const userAchievements = StorageService.getAchievements(user.id);
    setHabits(userHabits);
    setCompletions(userCompletions);
    setAchievements(userAchievements);
    setLastSaved(new Date().toLocaleTimeString());
  }, [user]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const currentDay = user ? StorageService.calculateDayFromDate(user.journeyStartDate) : 1;

  // Recalculate overall stats
  const stats = user
    ? StorageService.getOverallStats(user.id, user, habits)
    : {
        currentDay: 1,
        daysCompleted: 0,
        overallCompletionPercentage: 0,
        currentStreak: 0,
        bestStreak: 0,
        habitsCompletedToday: 0,
        totalHabitsCount: habits.length,
        totalCheckboxesChecked: 0,
      };

  // Check achievements after a completion
  const checkAchievements = useCallback((currentCompletions: Record<string, boolean>) => {
    if (!user) return;
    const totalChecks = Object.values(currentCompletions).filter(Boolean).length;
    
    // Check first day
    if (totalChecks >= 1) {
      if (StorageService.unlockAchievement(user.id, 'first_day')) {
        celebrateAchievement('first_day');
      }
    }
    // Check 100 checkins
    if (totalChecks >= 100) {
      if (StorageService.unlockAchievement(user.id, 'checkins_100')) {
        celebrateAchievement('checkins_100');
      }
    }
    // Check streaks
    if (stats.currentStreak >= 7) {
      if (StorageService.unlockAchievement(user.id, 'streak_7')) {
        celebrateAchievement('streak_7');
      }
    }
    if (stats.currentStreak >= 14) {
      if (StorageService.unlockAchievement(user.id, 'streak_14')) {
        celebrateAchievement('streak_14');
      }
    }
    if (currentDay >= 30 && stats.overallCompletionPercentage >= 50) {
      if (StorageService.unlockAchievement(user.id, 'phase_1_done')) {
        celebrateAchievement('phase_1_done');
      }
    }
    if (currentDay >= 60 && stats.overallCompletionPercentage >= 50) {
      if (StorageService.unlockAchievement(user.id, 'phase_2_done')) {
        celebrateAchievement('phase_2_done');
      }
    }
    if (currentDay >= 90 && stats.overallCompletionPercentage >= 60) {
      if (StorageService.unlockAchievement(user.id, 'legend_90')) {
        celebrateAchievement('legend_90');
      }
    }
  }, [user, currentDay, stats.currentStreak, stats.overallCompletionPercentage]);

  const celebrateAchievement = (achievementId: string) => {
    if (!user) return;
    const all = StorageService.getAchievements(user.id);
    const item = all.find((a) => a.id === achievementId);
    if (item) {
      setNewAchievementUnlocked(item);
      setAchievements([...all]);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const toggleDay = (habitId: string, dayNumber: number) => {
    if (!user) return;
    StorageService.toggleCompletion(user.id, habitId, dayNumber);
    const updated = StorageService.getCompletions(user.id);
    setCompletions(updated);
    setLastSaved(new Date().toLocaleTimeString());
    checkAchievements(updated);
  };

  const addHabit = (data: {
    name: string;
    category: string;
    icon: string;
    color: string;
    activeMonths?: number[];
  }) => {
    if (!user) throw new Error('User required');
    const newHabit = StorageService.addHabit(user.id, {
      ...data,
      goalFrequency: 'daily',
    });
    setHabits(StorageService.getHabits(user.id));
    setLastSaved(new Date().toLocaleTimeString());
    return newHabit;
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    if (!user) return;
    StorageService.updateHabit(user.id, id, updates);
    setHabits(StorageService.getHabits(user.id));
    setLastSaved(new Date().toLocaleTimeString());
  };

  const deleteHabit = (id: string) => {
    if (!user) return;
    StorageService.deleteHabit(user.id, id);
    setHabits(StorageService.getHabits(user.id));
    setLastSaved(new Date().toLocaleTimeString());
  };

  const reorderHabits = (reordered: Habit[]) => {
    if (!user) return;
    StorageService.reorderHabits(user.id, reordered);
    setHabits(reordered);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const resetToDefaultHabits = () => {
    if (!user) return;
    const defaults = StorageService.initDefaultHabits(user.id);
    setHabits(defaults);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const getHabitStats = (habitId: string): HabitStats => {
    return StorageService.getHabitStats(habitId, completions, currentDay);
  };

  const filterHabitsByMonth = (monthNumber: number): Habit[] => {
    return habits.filter((h) => {
      if (!h.activeMonths || h.activeMonths.length === 0) return true;
      return h.activeMonths.includes(monthNumber);
    });
  };

  const exportBackup = () => {
    if (!user) return;
    const json = StorageService.exportAllData(user.id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `90-Days-Habit-Tracker-Backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importBackup = (jsonContent: string) => {
    if (!user) return { success: false, message: 'مستخدم غير معرف' };
    const result = StorageService.importAllData(user.id, jsonContent);
    if (result.success) {
      reloadData();
    }
    return result;
  };

  const dismissAchievementModal = () => {
    setNewAchievementUnlocked(null);
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        completions,
        achievements,
        stats,
        currentDay,
        lastSaved,
        toggleDay,
        addHabit,
        updateHabit,
        deleteHabit,
        reorderHabits,
        resetToDefaultHabits,
        getHabitStats,
        filterHabitsByMonth,
        exportBackup,
        importBackup,
        reloadData,
        newAchievementUnlocked,
        dismissAchievementModal,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = (): HabitsContextType => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};
