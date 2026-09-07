import React from 'react';
import { Habit } from '../../types';

interface PrintablePdfDocumentProps {
  habits: Habit[];
  completions?: Record<string, boolean>;
  userName?: string;
  showChecks?: boolean;
}

export const PrintablePdfDocument: React.FC<PrintablePdfDocumentProps> = ({
  habits,
  completions = {},
  userName = '',
  showChecks = false,
}) => {
  const days1to30 = Array.from({ length: 30 }, (_, i) => i + 1);
  const days31to60 = Array.from({ length: 30 }, (_, i) => i + 31);
  const days61to90 = Array.from({ length: 30 }, (_, i) => i + 61);

  const renderDecorativeTitle = (title: string) => (
    <div className="flex items-center justify-center gap-3 w-full my-2 select-none">
      <div className="flex items-center h-1 flex-1 max-w-[140px]">
        <div className="h-[3.5px] rounded-l-full flex-1 bg-[#00a3e8]"></div>
        <div className="h-[3.5px] w-12 bg-[#ffcc00]"></div>
      </div>
      <h2 className="text-xl font-black text-[#0c2340] tracking-tight px-3 font-['Cairo'] whitespace-nowrap">
        {title}
      </h2>
      <div className="flex items-center h-1 flex-1 max-w-[140px]">
        <div className="h-[3.5px] w-12 bg-[#ffcc00]"></div>
        <div className="h-[3.5px] rounded-r-full flex-1 bg-[#00a3e8]"></div>
      </div>
    </div>
  );

  const renderTable = (days: number[], tableKey: string, monthNumber: number) => {
    const tableHabits = habits.filter(
      (h) => !h.activeMonths || h.activeMonths.length === 0 || h.activeMonths.includes(monthNumber)
    );
    const activeList = tableHabits.length > 0 ? tableHabits : habits;

    return (
      <div className="w-full border border-[#0d284f] bg-white rounded-sm overflow-hidden mb-3">
        <table className="w-full border-collapse text-center" dir="ltr" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr className="bg-[#0d284f] text-white">
              <th 
                className="py-1.5 px-2 text-center text-xs font-bold font-['Cairo'] w-[22%] text-white" 
                dir="rtl"
              >
                المهمة
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="py-1 px-0.5 text-center text-white border-l border-white/20"
                  style={{ width: `${78 / 30}%` }}
                >
                  <div className="text-[6.5px] leading-tight font-semibold tracking-tighter opacity-90">
                    DAY
                  </div>
                  <div className="text-[9.5px] leading-none font-bold">
                    {day}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeList.map((habit) => (
              <tr key={`${tableKey}-${habit.id}`} className="border-t border-[#1e3a64]/40">
                <td 
                  className="bg-[#0d284f] text-white px-2 py-1 font-['Cairo'] text-[10.5px] font-semibold text-center border-r border-[#1e3a64]/30 leading-snug"
                  dir="rtl"
                >
                  <div className="whitespace-pre-line break-words max-h-8 overflow-hidden flex items-center justify-center min-h-[22px]">
                    {habit.name}
                  </div>
                </td>
                {days.map((day) => {
                  const isChecked = showChecks && (completions[`${habit.id}_day_${day}`] || completions[`${habit.id}-${day}`]);
                  return (
                    <td
                      key={day}
                      className="bg-[#edf6fb] border-l border-b border-[#b5d5e9] p-0 text-center align-middle h-6"
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <div 
                          className={`w-3 h-3 rounded-[1.5px] border flex items-center justify-center ${
                            isChecked 
                              ? 'bg-[#0d284f] border-[#0d284f] text-white' 
                              : 'bg-white border-[#546e7a]'
                          }`}
                        >
                          {isChecked && (
                            <svg className="w-2 h-2 stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="printable-pdf-wrapper text-slate-900 bg-white font-['Cairo']">
      {/* ================= PAGE 1 (Days 1–30 & Days 31–60) ================= */}
      <div 
        id="print-export-container-p1" 
        className="print-page w-[1000px] min-h-[1414px] bg-white p-6 mx-auto flex flex-col justify-between"
        style={{ boxSizing: 'border-box' }}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#0d284f] pb-3 mb-2" dir="rtl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0d284f] text-[#ffcc00] flex items-center justify-center text-xl font-black shadow-sm">
                90
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#0d284f] tracking-tight leading-none">
                  مخطط الـ 90 يوماً لبناء العادات
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  90-Day Habit Transformation Matrix • رحلة الالتزام والانضباط
                </p>
              </div>
            </div>

            {/* User details line */}
            <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
              <div className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50">
                <span>الاسم: </span>
                <span className="text-[#0d284f] font-black">{userName || '.....................'}</span>
              </div>
              <div className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50">
                <span>الهدف الرئيسي: </span>
                <span className="text-[#0d284f] font-black">.......................................</span>
              </div>
            </div>
          </div>

          {/* Table 1: Days 1–30 */}
          {renderDecorativeTitle('30 يوم')}
          {renderTable(days1to30, 't1', 1)}

          {/* Table 2: Days 31–60 */}
          {renderDecorativeTitle('30 يوم')}
          {renderTable(days31to60, 't2', 2)}
        </div>

        {/* Page 1 Footer */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-semibold" dir="rtl">
          <span>الصفحة 1 من 2 • الأيام (1 إلى 60)</span>
          <span>"النجاح مجموع قرارات صغيرة تتكرر كل يوم"</span>
        </div>
      </div>

      {/* ================= PAGE 2 (Days 61–90 & Notes) ================= */}
      <div 
        id="print-export-container-p2" 
        className="print-page print-page-break w-[1000px] min-h-[1414px] bg-white p-6 mx-auto flex flex-col justify-between mt-8"
        style={{ boxSizing: 'border-box' }}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#0d284f] pb-3 mb-2" dir="rtl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0d284f] text-[#ffcc00] flex items-center justify-center text-xl font-black shadow-sm">
                90
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#0d284f] tracking-tight leading-none">
                  مخطط الـ 90 يوماً — المرحلة الأخيرة
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Phase 3: The Identity Phase (Days 61–90) • مرحلة ترسيخ الهوية
                </p>
              </div>
            </div>

            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-1">
              ✓ مرحلة الانضباط الأبدي والتحول الكامل
            </div>
          </div>

          {/* Table 3: Days 61–90 */}
          {renderDecorativeTitle('30 يوم')}
          {renderTable(days61to90, 't3', 3)}

          {/* Notes & Evaluation Section */}
          <div className="mt-4 border border-[#0d284f]/30 rounded-lg p-4 bg-slate-50/70" dir="rtl">
            <h3 className="text-sm font-black text-[#0d284f] mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffcc00]"></span>
              تقييم وملاحظات رحلة الـ 90 يوماً
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-700">
              <div className="space-y-2">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-[#0d284f] block mb-1">أهم الإنجازات المحققة:</span>
                  <div className="border-b border-dotted border-slate-300 h-5"></div>
                  <div className="border-b border-dotted border-slate-300 h-5"></div>
                  <div className="border-b border-dotted border-slate-300 h-5"></div>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-[#0d284f] block mb-1">العادات الأكثر ثباتاً وتأثيراً:</span>
                  <div className="border-b border-dotted border-slate-300 h-5"></div>
                  <div className="border-b border-dotted border-slate-300 h-5"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-[#0d284f] block mb-1">تحديات تم تجاوزها:</span>
                  <div className="border-b border-dotted border-slate-300 h-5"></div>
                  <div className="border-b border-dotted border-slate-300 h-5"></div>
                  <div className="border-b border-dotted border-slate-300 h-5"></div>
                </div>

                {/* Commitment pledge */}
                <div className="bg-amber-50/80 p-2.5 rounded border border-amber-200/80 text-amber-900">
                  <span className="font-black block mb-0.5">عهد الالتزام والاستمرارية:</span>
                  <p className="text-[11px] leading-relaxed">
                    "ألتزم بمواصلة هذه العادات كأسلوب حياة دائم. الانضباط هو الجسر بين الأهداف والإنجاز."
                  </p>
                  <div className="mt-2 flex justify-between items-center text-[10px] font-bold text-amber-800">
                    <span>التوقيع: .....................</span>
                    <span>التاريخ: ..... / ..... / 202...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-semibold" dir="rtl">
          <span>الصفحة 2 من 2 • الأيام (61 إلى 90) والتقييم النهائي</span>
          <span>90 Days Habit Tracker • تم التوليد بنجاح</span>
        </div>
      </div>
    </div>
  );
};
