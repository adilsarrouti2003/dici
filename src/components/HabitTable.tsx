import React from 'react';
import { HabitTask } from '../types';

interface HabitTableProps {
  startDay: number;
  endDay: number;
  tasks: HabitTask[];
  checkedDays?: Record<string, boolean>; // key: `${taskId}-${dayNumber}`
  onToggleDay?: (taskId: string, day: number) => void;
  interactive?: boolean;
  tableIndex: number;
}

export const HabitTable: React.FC<HabitTableProps> = ({
  startDay,
  endDay,
  tasks,
  checkedDays = {},
  onToggleDay,
  interactive = false,
  tableIndex,
}) => {
  const days = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);

  return (
    <div className="w-full flex flex-col items-center select-none" id={`habit-table-block-${tableIndex}`}>
      {/* Decorative Title: —— 30 يوم —— matching the exact PDF style */}
      <div className="flex items-center justify-center gap-3 w-full my-3">
        {/* Left segmented bar: cyan on outside, yellow on inside */}
        <div className="flex items-center h-1 flex-1 max-w-[140px] md:max-w-[200px]">
          <div className="h-[3.5px] rounded-l-full flex-1 bg-[#00a3e8]"></div>
          <div className="h-[3.5px] w-12 bg-[#ffcc00]"></div>
        </div>

        {/* Title Text */}
        <h2 className="text-2xl md:text-3xl font-black text-[#0c2340] tracking-tight px-3 font-['Cairo'] whitespace-nowrap">
          30 يوم
        </h2>

        {/* Right segmented bar: yellow on inside, cyan on outside */}
        <div className="flex items-center h-1 flex-1 max-w-[140px] md:max-w-[200px]">
          <div className="h-[3.5px] w-12 bg-[#ffcc00]"></div>
          <div className="h-[3.5px] rounded-r-full flex-1 bg-[#00a3e8]"></div>
        </div>
      </div>

      {/* Main Table Structure (LTR layout so المهمة is left and Day 1..30 go left-to-right) */}
      <div className="w-full overflow-x-auto shadow-sm rounded-sm border border-[#0d284f]/20 bg-white">
        <table 
          className="w-full border-collapse text-center" 
          dir="ltr" 
          style={{ minWidth: '780px', tableLayout: 'fixed' }}
        >
          <thead>
            <tr className="bg-[#0d284f] text-white divide-x divide-white/20">
              {/* Task Column Header */}
              <th 
                className="py-2.5 px-2 text-center text-sm md:text-base font-bold tracking-wide w-[20%] text-white font-['Cairo']"
                dir="rtl"
              >
                المهمة
              </th>

              {/* 30 Day Headers */}
              {days.map((day) => (
                <th
                  key={day}
                  className="py-1 px-0.5 text-center text-white border-l border-white/20 w-[2.66%]"
                >
                  <div className="text-[7.5px] leading-tight font-semibold tracking-tighter opacity-90">
                    DAY
                  </div>
                  <div className="text-[10px] leading-none font-bold">
                    {day}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={31} className="py-8 text-center text-slate-400 font-['Cairo'] text-sm" dir="rtl">
                  لا توجد مهام مضافة حالياً. أضف مهامك من الأعلى.
                </td>
              </tr>
            ) : (
              tasks.map((task, rIndex) => (
                <tr 
                  key={task.id} 
                  className="border-t border-[#1e3a64]/40 transition-colors"
                >
                  {/* Task Name Cell (Navy Blue Background, White text) */}
                  <td 
                    className="bg-[#0d284f] text-white px-2 py-1.5 font-['Cairo'] text-xs font-semibold text-center border-r border-[#1e3a64]/30 leading-snug"
                    dir="rtl"
                  >
                    <div className="whitespace-pre-line break-words max-h-12 overflow-hidden flex items-center justify-center min-h-[28px]">
                      {task.title}
                    </div>
                  </td>

                  {/* 30 Day Checkbox Cells (Ice blue background with centered checkbox) */}
                  {days.map((day) => {
                    const isChecked = checkedDays[`${task.id}-${day}`];
                    return (
                      <td
                        key={day}
                        onClick={() => interactive && onToggleDay?.(task.id, day)}
                        className={`bg-[#edf6fb] border-l border-b border-[#b5d5e9] p-0 text-center align-middle h-8 ${
                          interactive ? 'cursor-pointer hover:bg-[#e0eff8]' : ''
                        }`}
                        title={`اليوم ${day} - ${task.title}`}
                      >
                        <div className="flex items-center justify-center w-full h-full">
                          <div 
                            className={`w-3.5 h-3.5 rounded-[2px] border transition-all flex items-center justify-center ${
                              isChecked 
                                ? 'bg-[#0d284f] border-[#0d284f] text-white shadow-xs' 
                                : 'bg-white border-[#546e7a]'
                            }`}
                          >
                            {isChecked && (
                              <svg 
                                className="w-2.5 h-2.5 stroke-current stroke-[2.5]" 
                                viewBox="0 0 24 24" 
                                fill="none"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
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
  );
};
