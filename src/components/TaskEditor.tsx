import React, { useState } from 'react';
import { HabitTask, DEFAULT_TASKS } from '../types';
import { Plus, Trash2, ArrowUp, ArrowDown, RotateCcw, Sparkles, Check, Edit2, X } from 'lucide-react';

interface TaskEditorProps {
  tasks: HabitTask[];
  onAddTask: (title: string) => void;
  onRemoveTask: (id: string) => void;
  onUpdateTask: (id: string, title: string) => void;
  onMoveTask: (index: number, direction: 'up' | 'down') => void;
  onResetToDefault: () => void;
  onClearAll: () => void;
}

const QUICK_SUGGESTIONS = [
  'حفظ صفحة من القرآن',
  'الاستيقاظ قبل الفجر',
  'صلاة الفجر في وقتها',
  'رياضة 30 دقيقة',
  'شرب 2.5 لتر ماء',
  'تعلم مهارة جديدة',
  'قراءة 20 صفحة',
  'النوم قبل 11:00 ليلاً',
  'مشي 8,000 خطوة',
  'تدوين يومياتي',
];

export const TaskEditor: React.FC<TaskEditorProps> = ({
  tasks,
  onAddTask,
  onRemoveTask,
  onUpdateTask,
  onMoveTask,
  onResetToDefault,
  onClearAll,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim());
    setNewTitle('');
  };

  const startEdit = (task: HabitTask) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) {
      onUpdateTask(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 md:p-6 mb-8 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-800 font-['Cairo'] flex items-center gap-2">
            <span>قائمة المهام والعادات للـ 90 يوماً</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
              {tasks.length} مهمة
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            أدخل كل خدمة أو عادة ترغب في الالتزام بها لمدة 90 يوماً. ستظهر تلقائياً في الجداول الثلاثة.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="استرجاع المهام الأصلية الموجودة في ملف الـ PDF"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            استرجاع نموذج الـ PDF الأصلي
          </button>

          {tasks.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              مسح الكل
            </button>
          )}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="اكتب المهمة أو العادة هنا (مثال: صلاة الفجر، رياضة 30 دقيقة، قراءة كتاب...)"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-['Cairo'] bg-slate-50/50"
          />
        </div>
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#0d284f] hover:bg-[#143d75] disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed font-['Cairo'] shrink-0"
        >
          <Plus className="w-4 h-4" />
          إضافة مهمة
        </button>
      </form>

      {/* Quick suggestions chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          اقتراحات سريعة:
        </span>
        {QUICK_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onAddTask(suggestion)}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-600 transition-colors cursor-pointer font-['Cairo']"
          >
            + {suggestion}
          </button>
        ))}
      </div>

      {/* Task List items */}
      <div className="mt-5 space-y-2 max-h-[340px] overflow-y-auto pr-1">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg hover:border-slate-300 transition-colors group"
          >
            {/* Number + Content */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#0d284f] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>

              {editingId === task.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs border border-blue-400 rounded bg-white font-['Cairo']"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(task.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit(task.id)}
                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    title="حفظ"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                    title="إلغاء"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-semibold text-slate-800 font-['Cairo'] truncate">
                  {task.title}
                </span>
              )}
            </div>

            {/* Actions: Reorder & Delete */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onMoveTask(index, 'up')}
                disabled={index === 0}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                title="تحريك لأعلى"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onMoveTask(index, 'down')}
                disabled={index === tasks.length - 1}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                title="تحريك لأسفل"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => startEdit(task)}
                className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                title="تعديل النص"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onRemoveTask(task.id)}
                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                title="حذف المهمة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
