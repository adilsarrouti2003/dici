import React, { useState, useRef } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { 
  X, 
  ShieldCheck, 
  Download, 
  Upload, 
  Database, 
  CheckCircle2, 
  Calendar, 
  RotateCcw, 
  Info,
  Clock
} from 'lucide-react';

interface DataTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataTransparencyModal: React.FC<DataTransparencyModalProps> = ({ isOpen, onClose }) => {
  const { habits, completions, lastSaved, exportBackup, importBackup, resetToDefaultHabits } = useHabits();
  const { user } = useAuth();

  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const metrics = user ? StorageService.getStorageTransparencyInfo(user.id) : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importBackup(content);
        if (result.success) {
          setImportStatus({ type: 'success', message: result.message });
        } else {
          setImportStatus({ type: 'error', message: result.message });
        }
      }
    };
    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'حدث خطأ أثناء قراءة الملف.' });
    };
    reader.readAsText(file);
    // Reset file input so user can pick the same file again if desired
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl p-6 relative overflow-hidden font-['Cairo'] text-right max-h-[90vh] overflow-y-auto"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                شفافية البيانات وضمان الحفظ الدائم
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                محفوظ 100%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              بياناتك محفوظة بشكل دائم في متصفحك، مع إمكانية تصديرها واسترجاعها في أي لحظة.
            </p>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold">العادات النشطة</span>
            <span className="text-xl font-black text-[#0d284f] dark:text-blue-400">{habits.length}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold">الخانات المنجزة</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics?.completionsCount ?? 0}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold">حجم التخزين</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-200">
              {metrics?.bytesUsed ?? 0} <span className="text-xs font-normal">KB</span>
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold">آخر حفظ آلي</span>
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-blue-500" />
              {lastSaved || metrics?.lastSaved || 'الآن'}
            </span>
          </div>
        </div>

        {/* Guarantees Box */}
        <div className="space-y-3 mb-5">
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-black text-blue-950 dark:text-blue-200">
                الحفظ التلقائي عند إغلاق الموقع
              </h4>
              <p className="text-blue-900/80 dark:text-blue-300 leading-relaxed">
                كل علامة صح أو مهمة جديدة يتم حفظها ومزامنتها فوراً في التخزين المحلي الدائم (LocalStorage) مع نسخة أمان احتياطية تلقائية. عند إغلاق الموقع أو المتصفح والعودة لاحقاً، ستجد كل بياناتك وإنجازاتك كما تركتها تماماً.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-black text-amber-950 dark:text-amber-200">
                مرونة تخصيص الشهور (الشهر الأول، الثاني، الثالث)
              </h4>
              <p className="text-amber-900/80 dark:text-amber-300 leading-relaxed">
                يمكنك بكل سهولة تخصيص مهمات خاصة بالشهر الثاني (الأيام 31-60) أو الثالث (الأيام 61-90) دون المساس بمهام الشهر الأول أو علامات الإنجاز السابقة. تظل جميع علاماتك ثابتة ومستقرة تماماً.
              </p>
            </div>
          </div>
        </div>

        {/* Import Status feedback banner */}
        {importStatus && (
          <div className={`p-3 rounded-xl mb-4 text-xs font-bold border ${
            importStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300'
          }`}>
            {importStatus.message}
          </div>
        )}

        {/* Action Controls: Export & Import */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            النسخ الاحتياطي ونقل البيانات
          </h4>

          <div className="flex flex-wrap gap-2">
            {/* Export Button */}
            <button
              type="button"
              onClick={exportBackup}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0d284f] hover:bg-[#153d75] dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تصدير نسخة احتياطية (ملف JSON)</span>
            </button>

            {/* Import Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>استيراد واسترجاع البيانات</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
          </div>

          {/* Reset to 13 defaults option */}
          <div className="pt-2 flex items-center justify-between">
            {showResetConfirm ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-600 dark:text-red-400 font-bold">هل أنت متأكد؟</span>
                <button
                  type="button"
                  onClick={() => {
                    resetToDefaultHabits();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold cursor-pointer"
                >
                  نعم، استرجع نموذج الـ 13
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 text-slate-500 hover:underline cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط العادات إلى قائمة الـ 13 الأصلية</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
