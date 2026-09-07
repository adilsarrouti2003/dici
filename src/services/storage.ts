import { User, Habit, HabitCompletion, UserSettings, Achievement, HabitStats, OverallStats } from '../types';
import { DEFAULT_HABITS_LIST, INITIAL_ACHIEVEMENTS } from '../constants/defaults';

const USERS_KEY = 'ninety_days_users';
const CURRENT_USER_KEY = 'ninety_days_current_user_id';
const HABITS_KEY = 'ninety_days_habits_';
const COMPLETIONS_KEY = 'ninety_days_completions_';
const SETTINGS_KEY = 'ninety_days_settings_';
const ACHIEVEMENTS_KEY = 'ninety_days_achievements_';
const MASTER_BACKUP_KEY = 'ninety_days_master_backup';

export class StorageService {
  // Sync master backup to ensure zero data loss across browser reloads
  private static syncMasterBackup(userId: string): void {
    try {
      const users = this.getUsers();
      const user = users.find((u) => u.id === userId) || this.getCurrentUser();
      const habits = this.getHabits(userId);
      const completions = this.getCompletions(userId);
      const settings = this.getSettings(userId);
      const achievements = this.getAchievements(userId);

      const backupBundle = {
        version: 2,
        lastSaved: new Date().toISOString(),
        userId,
        user,
        habits,
        completions,
        settings,
        achievements,
      };

      localStorage.setItem(MASTER_BACKUP_KEY, JSON.stringify(backupBundle));
    } catch (err) {
      console.warn('Failed to sync master backup:', err);
    }
  }

  // --- USERS & AUTH ---
  static getUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static getCurrentUserId(): string | null {
    const id = localStorage.getItem(CURRENT_USER_KEY);
    if (id) return id;
    // Check if backup has userId
    try {
      const backup = localStorage.getItem(MASTER_BACKUP_KEY);
      if (backup) {
        const parsed = JSON.parse(backup);
        if (parsed?.userId) {
          localStorage.setItem(CURRENT_USER_KEY, parsed.userId);
          return parsed.userId;
        }
      }
    } catch {}
    return 'local_user';
  }

  static setCurrentUserId(id: string | null): void {
    if (id) {
      localStorage.setItem(CURRENT_USER_KEY, id);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, 'local_user');
    }
  }

  static getCurrentUser(): User | null {
    const id = this.getCurrentUserId();
    const users = this.getUsers();
    const found = users.find((u) => u.id === id);
    if (found) return found;

    // Try recovery from backup
    try {
      const backup = localStorage.getItem(MASTER_BACKUP_KEY);
      if (backup) {
        const parsed = JSON.parse(backup);
        if (parsed?.user) return parsed.user;
      }
    } catch {}

    return null;
  }

  static createOrUpdateUser(userData: Partial<User> & { id: string }): User {
    const users = this.getUsers();
    const existingIndex = users.findIndex((u) => u.id === userData.id);

    let updatedUser: User;
    if (existingIndex >= 0) {
      updatedUser = { ...users[existingIndex], ...userData };
      users[existingIndex] = updatedUser;
    } else {
      updatedUser = {
        id: userData.id,
        email: userData.email || 'user@90days.local',
        displayName: userData.displayName || '90-Day Champion',
        journeyStartDate: userData.journeyStartDate || new Date().toISOString(),
        durationDays: 90,
        isOnboarded: userData.isOnboarded ?? true,
        createdAt: new Date().toISOString(),
        ...userData,
      };
      users.push(updatedUser);
      // Initialize default habits for this new user if none exist
      this.initDefaultHabits(updatedUser.id);
    }

    this.saveUsers(users);
    this.setCurrentUserId(updatedUser.id);
    this.syncMasterBackup(updatedUser.id);
    return updatedUser;
  }

  // --- HABITS ---
  static getHabits(userId: string): Habit[] {
    try {
      const raw = localStorage.getItem(HABITS_KEY + userId);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Ensure every habit has activeMonths defined (default to all 3 months)
          return parsed.map((h: Habit) => ({
            ...h,
            activeMonths: h.activeMonths && h.activeMonths.length > 0 ? h.activeMonths : [1, 2, 3],
          }));
        }
      }

      // Check master backup before generating defaults
      const backup = localStorage.getItem(MASTER_BACKUP_KEY);
      if (backup) {
        const parsed = JSON.parse(backup);
        if (Array.isArray(parsed?.habits) && parsed.habits.length > 0) {
          this.saveHabits(userId, parsed.habits);
          return parsed.habits;
        }
      }
    } catch {}
    return this.initDefaultHabits(userId);
  }

  static saveHabits(userId: string, habits: Habit[]): void {
    const normalized = habits.map((h, i) => ({
      ...h,
      order: i,
      activeMonths: h.activeMonths && h.activeMonths.length > 0 ? h.activeMonths : [1, 2, 3],
    }));
    localStorage.setItem(HABITS_KEY + userId, JSON.stringify(normalized));
    this.syncMasterBackup(userId);
  }

  static initDefaultHabits(userId: string): Habit[] {
    const initial: Habit[] = DEFAULT_HABITS_LIST.map((item, index) => ({
      id: `habit_default_${index}`,
      userId,
      name: item.name,
      category: item.category,
      icon: item.icon,
      color: item.color,
      createdAt: new Date().toISOString(),
      order: index,
      active: true,
      goalFrequency: 'daily',
      activeMonths: [1, 2, 3], // Active in all 3 months by default
    }));
    localStorage.setItem(HABITS_KEY + userId, JSON.stringify(initial));
    this.syncMasterBackup(userId);
    return initial;
  }

  static addHabit(
    userId: string,
    habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'order' | 'active'> & { activeMonths?: number[] }
  ): Habit {
    const habits = this.getHabits(userId);
    const newHabit: Habit = {
      ...habitData,
      id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId,
      createdAt: new Date().toISOString(),
      order: habits.length,
      active: true,
      activeMonths: habitData.activeMonths && habitData.activeMonths.length > 0 ? habitData.activeMonths : [1, 2, 3],
    };
    habits.push(newHabit);
    this.saveHabits(userId, habits);
    return newHabit;
  }

  static updateHabit(userId: string, habitId: string, updates: Partial<Habit>): void {
    const habits = this.getHabits(userId);
    const index = habits.findIndex((h) => h.id === habitId);
    if (index >= 0) {
      habits[index] = { ...habits[index], ...updates };
      this.saveHabits(userId, habits);
    }
  }

  static deleteHabit(userId: string, habitId: string): void {
    let habits = this.getHabits(userId);
    habits = habits.filter((h) => h.id !== habitId);
    this.saveHabits(userId, habits);
  }

  static reorderHabits(userId: string, reordered: Habit[]): void {
    this.saveHabits(userId, reordered);
  }

  // --- COMPLETIONS ---
  static getCompletions(userId: string): Record<string, boolean> {
    try {
      const data = localStorage.getItem(COMPLETIONS_KEY + userId);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static toggleCompletion(userId: string, habitId: string, dayNumber: number): boolean {
    const completions = this.getCompletions(userId);
    const key = `${habitId}_day_${dayNumber}`;
    const newState = !completions[key];

    if (newState) {
      completions[key] = true;
    } else {
      delete completions[key];
    }

    localStorage.setItem(COMPLETIONS_KEY + userId, JSON.stringify(completions));
    this.syncMasterBackup(userId);
    return newState;
  }

  // --- SETTINGS ---
  static getSettings(userId: string): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY + userId);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      userId,
      theme: 'system',
      language: 'en',
      dailyReminder: true,
      reminderTime: '20:00',
    };
  }

  static saveSettings(userId: string, settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings(userId);
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY + userId, JSON.stringify(updated));
    this.syncMasterBackup(userId);
    return updated;
  }

  // --- ACHIEVEMENTS ---
  static getAchievements(userId: string): Achievement[] {
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_KEY + userId);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_ACHIEVEMENTS;
  }

  static unlockAchievement(userId: string, achievementId: string): boolean {
    const achievements = this.getAchievements(userId);
    const item = achievements.find((a) => a.id === achievementId);
    if (item && !item.unlocked) {
      item.unlocked = true;
      item.unlockedAt = new Date().toISOString();
      localStorage.setItem(ACHIEVEMENTS_KEY + userId, JSON.stringify(achievements));
      this.syncMasterBackup(userId);
      return true;
    }
    return false;
  }

  // --- DATA TRANSPARENCY, EXPORT & IMPORT ---
  static exportAllData(userId: string): string {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId) || this.getCurrentUser();
    const habits = this.getHabits(userId);
    const completions = this.getCompletions(userId);
    const settings = this.getSettings(userId);
    const achievements = this.getAchievements(userId);

    const exportBundle = {
      app: '90-Days-Habit-Tracker',
      version: 2,
      exportedAt: new Date().toISOString(),
      userId,
      user,
      habits,
      completions,
      settings,
      achievements,
      summary: {
        totalHabits: habits.length,
        totalCompletions: Object.values(completions).filter(Boolean).length,
      },
    };

    return JSON.stringify(exportBundle, null, 2);
  }

  static importAllData(userId: string, jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || (!parsed.habits && !parsed.completions)) {
        return { success: false, message: 'ملف غير صالح أو لا يحتوي على بيانات عادات.' };
      }

      if (Array.isArray(parsed.habits)) {
        const normalized = parsed.habits.map((h: Habit, idx: number) => ({
          ...h,
          userId,
          order: typeof h.order === 'number' ? h.order : idx,
          activeMonths: h.activeMonths && h.activeMonths.length > 0 ? h.activeMonths : [1, 2, 3],
        }));
        this.saveHabits(userId, normalized);
      }

      if (parsed.completions && typeof parsed.completions === 'object') {
        localStorage.setItem(COMPLETIONS_KEY + userId, JSON.stringify(parsed.completions));
      }

      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings(userId, parsed.settings);
      }

      if (Array.isArray(parsed.achievements)) {
        localStorage.setItem(ACHIEVEMENTS_KEY + userId, JSON.stringify(parsed.achievements));
      }

      if (parsed.user && typeof parsed.user === 'object') {
        this.createOrUpdateUser({ ...parsed.user, id: userId });
      }

      this.syncMasterBackup(userId);
      return { success: true, message: 'تم استيراد واسترجاع جميع بياناتك بنجاح تام!' };
    } catch (err) {
      return { success: false, message: `فشل في قراءة الملف: ${(err as Error).message}` };
    }
  }

  static getStorageTransparencyInfo(userId: string) {
    const habits = this.getHabits(userId);
    const completions = this.getCompletions(userId);
    const completedCount = Object.values(completions).filter(Boolean).length;

    let bytesUsed = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ninety_days')) {
          bytesUsed += (key.length + (localStorage.getItem(key)?.length || 0)) * 2;
        }
      }
    } catch {}

    let lastSavedTime = 'الآن';
    try {
      const backup = localStorage.getItem(MASTER_BACKUP_KEY);
      if (backup) {
        const parsed = JSON.parse(backup);
        if (parsed?.lastSaved) {
          lastSavedTime = new Date(parsed.lastSaved).toLocaleTimeString();
        }
      }
    } catch {}

    return {
      habitsCount: habits.length,
      completionsCount: completedCount,
      bytesUsed: Math.round(bytesUsed / 1024), // in KB
      lastSaved: lastSavedTime,
      isPermanent: true,
    };
  }

  // --- CALCULATIONS: STREAKS & OVERALL STATS ---
  static calculateDayFromDate(startDateStr: string): number {
    const start = new Date(startDateStr);
    const now = new Date();
    // Normalize to midnight
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(diffDays, 1), 90);
  }

  static getOverallStats(userId: string, user: User, habits: Habit[]): OverallStats {
    const completions = this.getCompletions(userId);
    const currentDay = this.calculateDayFromDate(user.journeyStartDate);

    const activeHabits = habits.filter((h) => h.active);
    const totalHabitsCount = activeHabits.length;

    let totalCheckboxesChecked = 0;
    let habitsCompletedToday = 0;

    // Daily completion tracking up to day 90
    const dayCompletedFlags: boolean[] = [];

    for (let day = 1; day <= 90; day++) {
      let dayCompletedHabits = 0;
      activeHabits.forEach((h) => {
        if (completions[`${h.id}_day_${day}`]) {
          totalCheckboxesChecked++;
          dayCompletedHabits++;
          if (day === currentDay) {
            habitsCompletedToday++;
          }
        }
      });
      // A day is considered completed if at least 60% of habits were done
      const isDayComplete = totalHabitsCount > 0 && dayCompletedHabits >= Math.ceil(totalHabitsCount * 0.6);
      dayCompletedFlags.push(isDayComplete);
    }

    // Streaks calculation based on consecutive days
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < currentDay; i++) {
      if (dayCompletedFlags[i]) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }
    currentStreak = tempStreak;

    const daysCompleted = dayCompletedFlags.slice(0, currentDay).filter(Boolean).length;
    const totalPossibleSlots = totalHabitsCount * 90;
    const overallCompletionPercentage = totalPossibleSlots > 0 
      ? Math.round((totalCheckboxesChecked / totalPossibleSlots) * 100) 
      : 0;

    return {
      currentDay,
      daysCompleted,
      overallCompletionPercentage,
      currentStreak,
      bestStreak,
      habitsCompletedToday,
      totalHabitsCount,
      totalCheckboxesChecked,
    };
  }

  static getHabitStats(habitId: string, completions: Record<string, boolean>, currentDay: number): HabitStats {
    let completedCount = 0;
    let tempStreak = 0;
    let currentStreak = 0;
    let longestStreak = 0;

    for (let d = 1; d <= 90; d++) {
      if (completions[`${habitId}_day_${d}`]) {
        completedCount++;
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        if (d <= currentDay) {
          tempStreak = 0;
        }
      }
    }

    // calculate current streak ending at today
    let backStreak = 0;
    for (let d = currentDay; d >= 1; d--) {
      if (completions[`${habitId}_day_${d}`]) {
        backStreak++;
      } else {
        break;
      }
    }
    currentStreak = backStreak;

    return {
      habitId,
      currentStreak,
      longestStreak,
      totalCompletedDays: completedCount,
      completionPercentage: Math.round((completedCount / 90) * 100),
    };
  }
}
