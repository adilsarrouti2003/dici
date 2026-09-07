export * from './types/index';

export interface HabitTask {
  id: string;
  title: string;
}

export const DEFAULT_TASKS: HabitTask[] = [
  { id: '1', title: 'الصلاة' },
  { id: '2', title: 'تعلم 4 مهارات' },
  { id: '3', title: 'تطبيق المهارات في مشاريع مختلفة' },
  { id: '4', title: 'مونتاج 5 فيديوهات' },
  { id: '5', title: 'إضافة شيء جديد في المونتاج\n- ممنوع تكرار نفس الشيء -' },
  { id: '6', title: 'كاليستينيكس' },
  { id: '7', title: 'راحة' },
  { id: '8', title: 'جري' },
  { id: '9', title: 'التعرف على 5 أشخاص جدد كل 7 أيام' },
  { id: '10', title: 'المشاركة في عمل اجتماعي كل 7 أيام' },
  { id: '11', title: 'ساعة تعلم الإنجليزية' },
  { id: '12', title: 'ساعة تعلم الألمانية' },
  { id: '13', title: 'قراءة من كتاب 20 دقيقة في يوم' },
];
