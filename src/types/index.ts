export type Language = 'en' | 'ar' | 'fr' | 'es';
export type Theme = 'light' | 'dark' | 'system';

export type GoalCategory = 
  | 'Health'
  | 'Fitness'
  | 'Learning'
  | 'Productivity'
  | 'Business'
  | 'Personal Growth'
  | 'Spiritual'
  | 'Other';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  goal?: GoalCategory;
  journeyStartDate: string; // ISO date string
  durationDays: number; // default 90
  isOnboarded: boolean;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  category: GoalCategory | string;
  icon: string; // Lucide icon identifier
  color: string; // Hex or Tailwind color token
  createdAt: string;
  order: number;
  active: boolean;
  goalFrequency?: 'daily' | 'weekly';
  activeMonths?: number[]; // [1, 2, 3] by default; or specific months [1], [2], [3]
}

export interface HabitCompletion {
  id: string; // `${userId}_${habitId}_day_${dayNumber}`
  userId: string;
  habitId: string;
  dayNumber: number; // 1 to 90
  completed: boolean;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'days' | 'checkins' | 'special';
}

export interface UserSettings {
  userId: string;
  theme: Theme;
  language: Language;
  dailyReminder: boolean;
  reminderTime: string; // "09:00"
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletedDays: number;
  completionPercentage: number;
}

export interface OverallStats {
  currentDay: number;
  daysCompleted: number;
  overallCompletionPercentage: number;
  currentStreak: number;
  bestStreak: number;
  habitsCompletedToday: number;
  totalHabitsCount: number;
  totalCheckboxesChecked: number;
}
