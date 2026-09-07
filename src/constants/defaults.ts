import { Habit, Achievement, GoalCategory } from '../types';

export const DEFAULT_HABITS_LIST = [
  { name: 'الصلاة', category: 'Spiritual', icon: 'Sparkles', color: '#0284c7' },
  { name: 'تعلم 4 مهارات', category: 'Learning', icon: 'BookOpen', color: '#6366f1' },
  { name: 'تطبيق المهارات في مشاريع مختلفة', category: 'Productivity', icon: 'Briefcase', color: '#8b5cf6' },
  { name: 'مونتاج 5 فيديوهات', category: 'Business', icon: 'Video', color: '#ec4899' },
  { name: 'إضافة شيء جديد في المونتاج — ممنوع تكرار نفس الشيء —', category: 'Personal Growth', icon: 'Zap', color: '#f59e0b' },
  { name: 'كاليستينيكس', category: 'Fitness', icon: 'Dumbbell', color: '#10b981' },
  { name: 'راحة', category: 'Health', icon: 'Heart', color: '#06b6d4' },
  { name: 'جري', category: 'Fitness', icon: 'Flame', color: '#ef4444' },
  { name: 'التعرف على 5 أشخاص جدد كل 7 أيام', category: 'Personal Growth', icon: 'Users', color: '#3b82f6' },
  { name: 'المشاركة في عمل اجتماعي كل 7 أيام', category: 'Spiritual', icon: 'Smile', color: '#14b8a6' },
  { name: 'ساعة تعلم الإنجليزية', category: 'Learning', icon: 'Languages', color: '#84cc16' },
  { name: 'ساعة تعلم الألمانية', category: 'Learning', icon: 'GraduationCap', color: '#eab308' },
  { name: 'قراءة من كتاب 20 دقيقة في يوم', category: 'Learning', icon: 'BookMarked', color: '#f97316' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_day',
    title: 'First Step',
    description: 'Complete your first habit on Day 1.',
    icon: 'Flame',
    unlocked: false,
    category: 'days',
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    description: 'Keep the momentum burning for 7 consecutive days.',
    icon: 'Zap',
    unlocked: false,
    category: 'streak',
  },
  {
    id: 'streak_14',
    title: '14-Day Warrior',
    description: 'Two full weeks of unwavering consistency.',
    icon: 'Award',
    unlocked: false,
    category: 'streak',
  },
  {
    id: 'phase_1_done',
    title: 'Phase 1 Victor (Day 30)',
    description: 'Finish the foundational 30 days of the journey.',
    icon: 'Trophy',
    unlocked: false,
    category: 'days',
  },
  {
    id: 'phase_2_done',
    title: 'Phase 2 Master (Day 60)',
    description: 'Conquer 60 days. Habits are becoming your lifestyle.',
    icon: 'Medal',
    unlocked: false,
    category: 'days',
  },
  {
    id: 'legend_90',
    title: '90-Day Legend (Day 90)',
    description: 'Completed the full 90-day transformation challenge!',
    icon: 'Crown',
    unlocked: false,
    category: 'days',
  },
  {
    id: 'checkins_100',
    title: 'Century Club',
    description: 'Log 100 total habit check-ins.',
    icon: 'CheckCircle2',
    unlocked: false,
    category: 'checkins',
  },
  {
    id: 'perfect_week',
    title: 'Flawless Week',
    description: 'Complete 100% of all habits for 7 straight days.',
    icon: 'Star',
    unlocked: false,
    category: 'special',
  },
];

export const MOTIVATIONAL_MESSAGES: Record<number, string> = {
  1: 'Your journey starts today. Small beginnings lead to monumental transformations.',
  3: 'Day 3: You are building early momentum. Keep showing up!',
  7: '7 days! The first week is in the books. You proved you can do this.',
  14: '14 days strong. Consistency is turning into second nature.',
  21: '21 days! Your brain neural pathways are physically adapting to your habits.',
  30: '30 DAYS COMPLETE! Phase 1 conquered! Take pride in how far you have come.',
  45: 'Day 45: Halfway through the 90-day marathon! Unstoppable discipline.',
  60: '60 DAYS! Phase 2 finished. These are no longer chores—they are who you are.',
  75: 'Day 75: The finish line is within sight. Finish with ferocious focus.',
  89: 'Day 89: Tomorrow is graduation day. Reflect on your metamorphosis.',
  90: 'YOU DID IT! 90 DAYS COMPLETE! You have built a new, stronger version of yourself! 🏆',
};

export const ONBOARDING_SUGGESTIONS: Record<GoalCategory, string[]> = {
  Health: ['Drink 2.5L water', 'Sleep before 11 PM', 'Eat clean / No sugar', 'Take vitamins', '10-minute stretch'],
  Fitness: ['Exercise / Gym 45 min', 'Walk 10,000 steps', 'Running 30 min', 'Calisthenics workout', 'Morning mobility'],
  Learning: ['Read 20 minutes', 'Learn English', 'Learn German', 'Practice coding', 'Watch educational lecture'],
  Productivity: ['Deep work 90 min', 'Zero inbox', 'Plan tomorrow tonight', 'Wake up at 6:00 AM', 'Limit screen time'],
  Business: ['Outreach / 5 connections', 'Create 1 piece of content', 'Review financials', 'Customer feedback', 'Study market'],
  'Personal Growth': ['Journaling daily', 'Meditation 15 min', 'Gratitude log', 'Quit a bad habit', 'Read self-help book'],
  Spiritual: ['Pray daily on time', 'Read holy scriptures', 'Charity / Kind deed', 'Reflection in nature', 'Silence & mindfulness'],
  Other: ['Custom daily goal 1', 'Custom daily goal 2', 'Creative practice', 'Music instrument', 'Family quality time'],
};
