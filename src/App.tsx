import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { HabitsProvider, useHabits } from './context/HabitsContext';
import { Habit } from './types';

// Components
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { Dashboard } from './components/dashboard/Dashboard';
import { TrackerView } from './components/tracker/TrackerView';
import { TodayView } from './components/today/TodayView';
import { ProgressView } from './components/progress/ProgressView';
import { CalendarView } from './components/calendar/CalendarView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { ProfileView } from './components/profile/ProfileView';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { AddHabitModal } from './components/habits/AddHabitModal';
import { EditHabitModal } from './components/habits/EditHabitModal';
import { ShareCardModal } from './components/social/ShareCardModal';
import { AchievementModal } from './components/achievements/AchievementModal';

function AppContent() {
  const { user, loading } = useAuth();
  const { isRTL } = useLanguage();
  const { newAchievementUnlocked, dismissAchievementModal } = useHabits();

  // Active view tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [addHabitMonth, setAddHabitMonth] = useState<number | undefined>(undefined);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleOpenAddHabit = (month?: number) => {
    setAddHabitMonth(month);
    setIsAddHabitOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0d284f] text-white flex items-center justify-center font-black text-lg animate-pulse shadow-md">
            90
          </div>
          <span className="text-xs font-bold text-slate-400 font-['Cairo']">
            Loading your 90-day challenge...
          </span>
        </div>
      </div>
    );
  }

  // If user is not logged in, display the landing page with Auth Modal trigger
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar
          currentTab="landing"
          onTabChange={() => {}}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <main className="flex-1">
          <LandingPage
            onStart={() => setIsAuthOpen(true)}
            onExplore={() => setIsAuthOpen(true)}
          />
        </main>
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => {}}
        />
        <PwaInstallPrompt />
      </div>
    );
  }

  // If user is newly registered and hasn't finished onboarding
  if (!user.isOnboarded) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar
          currentTab="onboarding"
          onTabChange={() => {}}
          onOpenAuth={() => {}}
        />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <OnboardingWizard onComplete={() => setCurrentTab('dashboard')} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Sticky Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-12">
        {currentTab === 'dashboard' && (
          <Dashboard
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAddHabit={() => handleOpenAddHabit()}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {currentTab === 'today' && (
          <TodayView
            onOpenAddHabit={() => handleOpenAddHabit()}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {currentTab === 'tracker' && (
          <TrackerView
            onOpenAddHabit={(month) => handleOpenAddHabit(month)}
            onEditHabit={(h) => setEditingHabit(h)}
          />
        )}

        {currentTab === 'progress' && <ProgressView />}

        {currentTab === 'calendar' && <CalendarView />}

        {currentTab === 'achievements' && <AchievementsView />}

        {currentTab === 'profile' && (
          <ProfileView onOpenShareModal={() => setIsShareModalOpen(true)} />
        )}

        {currentTab === 'landing' && (
          <LandingPage
            onStart={() => setCurrentTab('dashboard')}
            onExplore={() => setCurrentTab('tracker')}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* Modals & Dialogs */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => setIsAuthOpen(false)}
      />

      <AddHabitModal
        isOpen={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
        defaultMonth={addHabitMonth}
      />

      <EditHabitModal
        habit={editingHabit}
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
      />

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AchievementModal
        achievement={newAchievementUnlocked}
        onClose={dismissAchievementModal}
      />

      {/* PWA Home Screen Install Banner */}
      <PwaInstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <HabitsProvider>
            <AppContent />
          </HabitsProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
