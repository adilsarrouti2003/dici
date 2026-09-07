import React, { useState } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Habit } from '../../types';
import { exportPdfFromElements } from '../../utils/pdfExport';
import { PrintablePdfDocument } from './PrintablePdfDocument';
import { DataTransparencyModal } from '../common/DataTransparencyModal';
import { 
  Download, 
  Printer, 
  Plus, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Check, 
  Loader2,
  FileText,
  Eye,
  CheckSquare,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';

interface TrackerViewProps {
  onOpenAddHabit: (defaultMonth?: number) => void;
  onEditHabit: (habit: Habit) => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({ onOpenAddHabit, onEditHabit }) => {
  const { 
    habits, 
    completions, 
    toggleDay, 
    currentDay, 
    lastSaved,
    reorderHabits, 
    resetToDefaultHabits 
  } = useHabits();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  const [activePhase, setActivePhase] = useState<'phase1' | 'phase2' | 'phase3' | 'all'>('phase1');
  const [viewMode, setViewMode] = useState<'matrix' | 'preview'>('matrix');
  const [includeChecksInPdf, setIncludeChecksInPdf] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);

  const getPhaseRange = () => {
    switch (activePhase) {
      case 'phase1':
        return { start: 1, end: 30, title: 'المرحلة 1: الأيام (1–30)', month: 1 };
      case 'phase2':
        return { start: 31, end: 60, title: 'المرحلة 2: الأيام (31–60)', month: 2 };
      case 'phase3':
        return { start: 61, end: 90, title: 'المرحلة 3: الأيام (61–90)', month: 3 };
      case 'all':
      default:
        return { start: 1, end: 90, title: 'كافة الأيام (90 يوماً)', month: null };
    }
  };

  const currentRange = getPhaseRange();
  const currentMonthNumber = currentRange.month;

  // Filter habits active for current month
  const displayedHabits = habits.filter((h) => {
    if (!currentMonthNumber) return true; // When viewing all 90 days, show all
    if (!h.activeMonths || h.activeMonths.length === 0) return true;
    return h.activeMonths.includes(currentMonthNumber);
  });

  const daysArray = Array.from(
    { length: currentRange.end - currentRange.start + 1 },
    (_, i) => currentRange.start + i
  );

  const handleMove = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= displayedHabits.length) return;
    const copy = [...displayedHabits];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    reorderHabits(copy);
  };

  const handleDownloadFullPdf = async () => {
    try {
      setIsExporting(true);
      await exportPdfFromElements(
        'print-export-container-p1',
        'print-export-container-p2',
        '90-Days-Habit-Tracker.pdf'
      );
    } catch {
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header & Actions */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {t('tracker90')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
            مخطط الـ 90 يوماً للعادات
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تتبع إنجازك اليومي، خصص مهمات كل شهر بسهولة، مع بقاء بياناتك ثابتة ومحفوظة تلقائياً.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-[#0d284f] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>الجدول التفاعلي</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-[#0d284f] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة الـ PDF A4</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsTransparencyOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer shadow-xs"
            title="شفافية البيانات، الحفظ التلقائي، والنسخ الاحتياطي"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>شفافية البيانات</span>
          </button>

          <button
            type="button"
            onClick={resetToDefaultHabits}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer shadow-xs"
            title="استرجاع الـ 13 مهمة الأصلية الموجودة في ملف الـ PDF"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">استرجاع نموذج الـ 13</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer shadow-xs"
            title="طباعة الجداول الثلاثة على ورق A4"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{t('printTracker')}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFullPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d284f] dark:bg-blue-600 hover:bg-[#153d75] dark:hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{t('downloadPdf')}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAddHabit(currentMonthNumber || 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addHabit')}</span>
          </button>
        </div>
      </div>

      {/* Month Customization & Auto-save Status Banner */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-blue-50/90 via-slate-50 to-emerald-50/70 dark:from-slate-800 dark:via-slate-850 dark:to-emerald-950/30 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs font-['Cairo']">
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Auto-save badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>محفوظ تلقائياً في المتصفح</span>
            <span className="text-[10px] opacity-75 font-mono">({lastSaved})</span>
          </div>

          <div className="text-slate-700 dark:text-slate-300 font-medium">
            {currentMonthNumber ? (
              <span>
                مهمات <span className="font-bold text-blue-700 dark:text-blue-300">الشهر {currentMonthNumber}</span> ({displayedHabits.length} مهمة) • يمكنك تغييرها دون المساس بالأشهر الأخرى
              </span>
            ) : (
              <span>عرض شامل لكافة الـ 90 يوماً ({habits.length} مهمة إجمالية)</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentMonthNumber && (
            <button
              type="button"
              onClick={() => onOpenAddHabit(currentMonthNumber)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>مهمة خاصة بالشهر {currentMonthNumber}</span>
            </button>
          )}

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={includeChecksInPdf}
              onChange={(e) => setIncludeChecksInPdf(e.target.checked)}
              className="rounded border-blue-400 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-[11px]">تضمين الإنجازات في الـ PDF</span>
          </label>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE HABIT MATRIX */}
      {viewMode === 'matrix' && (
        <div className="space-y-6">
          {/* Phase Switcher Tabs */}
          <div className="no-print flex items-center gap-1.5 p-1.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl max-w-2xl text-xs font-bold overflow-x-auto">
            <button
              type="button"
              onClick={() => setActivePhase('phase1')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activePhase === 'phase1'
                  ? 'bg-white dark:bg-slate-900 text-[#0d284f] dark:text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              الشهر 1 (1–30)
            </button>

            <button
              type="button"
              onClick={() => setActivePhase('phase2')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activePhase === 'phase2'
                  ? 'bg-white dark:bg-slate-900 text-[#0d284f] dark:text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              الشهر 2 (31–60)
            </button>

            <button
              type="button"
              onClick={() => setActivePhase('phase3')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activePhase === 'phase3'
                  ? 'bg-white dark:bg-slate-900 text-[#0d284f] dark:text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              الشهر 3 (61–90)
            </button>

            <button
              type="button"
              onClick={() => setActivePhase('all')}
              className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activePhase === 'all'
                  ? 'bg-white dark:bg-slate-900 text-[#0d284f] dark:text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              كل الـ 90 يوماً
            </button>
          </div>

          {/* Decorative Title Matching Original PDF */}
          <div className="no-print flex items-center justify-center gap-3 w-full my-4 select-none">
            <div className="flex items-center h-1 flex-1 max-w-[120px] md:max-w-[200px]">
              <div className="h-[3.5px] rounded-l-full flex-1 bg-[#00a3e8]"></div>
              <div className="h-[3.5px] w-10 bg-[#ffcc00]"></div>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-[#0c2340] dark:text-white font-['Cairo'] tracking-tight px-3 whitespace-nowrap">
              {activePhase === 'all' ? '90 يوماً متواصلة' : `30 يوم • ${currentRange.title}`}
            </h3>

            <div className="flex items-center h-1 flex-1 max-w-[120px] md:max-w-[200px]">
              <div className="h-[3.5px] w-10 bg-[#ffcc00]"></div>
              <div className="h-[3.5px] rounded-r-full flex-1 bg-[#00a3e8]"></div>
            </div>
          </div>

          {/* Core Scrollable Tracker Table (with Sticky Columns) */}
          <div className="no-print w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto relative">
              <table 
                className="w-full border-collapse text-center" 
                dir="ltr"
                style={{ minWidth: activePhase === 'all' ? '2200px' : '980px', tableLayout: 'fixed' }}
              >
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#0d284f] text-white">
                    {/* Sticky Habit Column Header */}
                    <th
                      className="sticky left-0 z-20 bg-[#0d284f] text-white py-3 px-3 text-center text-xs md:text-sm font-bold font-['Cairo'] w-[220px] md:w-[260px] shadow-sm"
                      dir="rtl"
                    >
                      المهمة / العادة ({displayedHabits.length})
                    </th>

                    {/* Day Headers */}
                    {daysArray.map((day) => {
                      const isToday = day === currentDay;
                      return (
                        <th
                          key={day}
                          className={`py-1.5 px-0.5 border-l border-white/20 text-center transition-colors ${
                            isToday ? 'bg-blue-600 text-amber-300 ring-1 ring-amber-300' : 'text-white'
                          }`}
                          style={{ width: `${Math.max(100 / (daysArray.length + 3), 2.5)}%` }}
                        >
                          <div className="text-[7px] md:text-[8px] font-bold tracking-tighter opacity-80">
                            DAY
                          </div>
                          <div className="text-[10px] md:text-[11px] font-black leading-none">
                            {day}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {displayedHabits.length === 0 ? (
                    <tr>
                      <td colSpan={daysArray.length + 1} className="py-8 text-center text-slate-400 font-['Cairo']">
                        لا توجد مهمات مخصصة لهذا الشهر حتى الآن. اضغط على "مهمة خاصة بهذا الشهر" لإضافة مهمة!
                      </td>
                    </tr>
                  ) : (
                    displayedHabits.map((habit, rIdx) => (
                      <tr 
                        key={habit.id}
                        className="border-t border-[#1e3a64]/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Sticky Task Label Cell */}
                        <td 
                          className="sticky left-0 z-10 bg-[#0d284f] text-white py-2 px-3 border-r border-[#1e3a64]/30 text-xs font-semibold font-['Cairo'] text-right shadow-sm group"
                          dir="rtl"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span 
                                className="w-2 h-2 rounded-full shrink-0" 
                                style={{ backgroundColor: habit.color || '#3b82f6' }}
                              />
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="truncate whitespace-pre-line leading-tight text-[11px] md:text-xs">
                                  {habit.name}
                                </span>
                                {habit.activeMonths && habit.activeMonths.length < 3 && (
                                  <span className="text-[9px] text-blue-200/80 font-normal">
                                    شهر {habit.activeMonths.join('، ')} فقط
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action buttons for habit */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleMove(rIdx, 'up')}
                                disabled={rIdx === 0}
                                className="p-1 hover:bg-white/10 rounded text-slate-300 disabled:opacity-20 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMove(rIdx, 'down')}
                                disabled={rIdx === displayedHabits.length - 1}
                                className="p-1 hover:bg-white/10 rounded text-slate-300 disabled:opacity-20 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onEditHabit(habit)}
                                className="p-1 hover:bg-white/10 rounded text-blue-300 cursor-pointer"
                                title="Edit Habit / Change Month"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Day Checkboxes */}
                        {daysArray.map((day) => {
                          const isChecked = completions[`${habit.id}_day_${day}`] || completions[`${habit.id}-${day}`];
                          const isToday = day === currentDay;

                          return (
                            <td
                              key={day}
                              onClick={() => toggleDay(habit.id, day)}
                              className={`border-l border-b border-[#b5d5e9] dark:border-slate-700/80 p-0 text-center align-middle h-9 cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-[#e2f1fa] dark:bg-blue-950/40'
                                  : isToday
                                  ? 'bg-blue-50/80 dark:bg-slate-800/80 hover:bg-blue-100'
                                  : 'bg-[#edf6fb] dark:bg-slate-850 hover:bg-[#e1eff8] dark:hover:bg-slate-800'
                              }`}
                              title={`Day ${day} • ${habit.name}`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                <div
                                  className={`w-4 h-4 rounded-[2px] border transition-all flex items-center justify-center select-none ${
                                    isChecked
                                      ? 'bg-[#0d284f] dark:bg-blue-600 border-[#0d284f] text-white scale-105 shadow-xs'
                                      : 'bg-white dark:bg-slate-900 border-[#546e7a] hover:border-blue-500'
                                  }`}
                                >
                                  {isChecked && (
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PRINTABLE A4 PREVIEW */}
      {viewMode === 'preview' && (
        <div className="no-print space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <span>
              💡 هذه المعاينة المباشرة توضح شكل الصفحتين A4 عند الطباعة أو التصدير، مع مطابقة خطوط وجداول الملف الأصلي بدقة.
            </span>
            <button
              type="button"
              onClick={handleDownloadFullPdf}
              disabled={isExporting}
              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold shadow-xs cursor-pointer disabled:opacity-50"
            >
              تحميل الـ PDF الآن
            </button>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-100 dark:bg-slate-950 overflow-x-auto">
            <PrintablePdfDocument
              habits={habits}
              completions={completions}
              userName={user?.displayName}
              showChecks={includeChecksInPdf}
            />
          </div>
        </div>
      )}

      {/* Permanent Document Container for Background PDF Generation & Print Media */}
      <div 
        className={viewMode === 'preview' ? 'hidden' : 'printable-pdf-wrapper'}
        style={viewMode === 'preview' ? {} : { position: 'absolute', left: '-99999px', top: '0', pointerEvents: 'none' }}
      >
        <PrintablePdfDocument
          habits={habits}
          completions={completions}
          userName={user?.displayName}
          showChecks={includeChecksInPdf}
        />
      </div>

      {/* Data Transparency & Backup Modal */}
      <DataTransparencyModal
        isOpen={isTransparencyOpen}
        onClose={() => setIsTransparencyOpen(false)}
      />
    </div>
  );
};
