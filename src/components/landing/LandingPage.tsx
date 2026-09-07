import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Flame, 
  Calendar, 
  Sparkles, 
  Trophy, 
  ShieldCheck, 
  Smartphone, 
  Moon, 
  Languages, 
  Layers, 
  Play
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExplore }) => {
  const { t, isRTL } = useLanguage();
  
  // Interactive mini preview checkboxes state
  const [previewChecks, setPreviewChecks] = useState<Record<string, boolean>>({
    'h1_d1': true, 'h1_d2': true, 'h1_d3': true, 'h1_d4': true, 'h1_d5': false,
    'h2_d1': true, 'h2_d2': true, 'h2_d3': true, 'h2_d4': false, 'h2_d5': true,
    'h3_d1': true, 'h3_d2': true, 'h3_d3': false, 'h3_d4': true, 'h3_d5': true,
  });

  const togglePreview = (key: string) => {
    setPreviewChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const previewHabits = [
    { id: 'h1', title: 'صلاة الفجر في وقتها' },
    { id: 'h2', title: 'رياضة 30 دقيقة' },
    { id: 'h3', title: 'قراءة كتاب 20 دقيقة' },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 dark:from-blue-950/20 to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold mb-6 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>The Proven 90-Day Transformation Methodology</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 font-['Cairo']">
            {t('tagline')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            {t('subheadline')}
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0d284f] hover:bg-[#143d75] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer font-['Cairo']"
            >
              <span>{t('startMy90Days')}</span>
              {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t('seeHowItWorks')}</span>
            </a>
          </div>

          {/* Interactive Preview of the 90-Day Tracker */}
          <div className="mt-14 max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 text-left rtl:text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-2">Interactive 90-Day Live Preview</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Phase 1: Days 1–30
              </span>
            </div>

            {/* Mini preview table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" dir="ltr">
                <thead>
                  <tr className="bg-[#0d284f] text-white">
                    <th className="py-2 px-3 text-center text-xs font-bold font-['Cairo'] w-1/3">المهمة</th>
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <th key={d} className="py-1 px-1 text-center text-[10px] font-bold border-l border-white/20">
                        DAY {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewHabits.map((habit) => (
                    <tr key={habit.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="bg-[#0d284f] text-white py-2 px-3 text-xs font-bold font-['Cairo'] text-center">
                        {habit.title}
                      </td>
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => {
                        const key = `${habit.id}_d${d}`;
                        const checked = previewChecks[key];
                        return (
                          <td 
                            key={d} 
                            onClick={() => togglePreview(key)}
                            className="bg-[#edf6fb] dark:bg-slate-800/80 border-l border-[#b5d5e9] dark:border-slate-700 p-2 text-center cursor-pointer hover:bg-[#e1f0f8] dark:hover:bg-slate-700 transition-colors"
                          >
                            <div className="flex items-center justify-center">
                              <div className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-all ${
                                checked 
                                  ? 'bg-[#0d284f] dark:bg-blue-600 border-[#0d284f] text-white' 
                                  : 'bg-white dark:bg-slate-900 border-slate-400'
                              }`}>
                                {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
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
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-3 font-medium">
              💡 Click any checkbox above to test the responsive check-in engine!
            </p>
          </div>
        </div>
      </section>

      {/* Motivational Section Banner */}
      <section className="bg-gradient-to-r from-[#0c2340] via-[#12396d] to-[#0c2340] text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl sm:text-2xl md:text-3xl font-black font-['Cairo'] tracking-wide">
            "{t('quote')}"
          </p>
          <p className="text-xs sm:text-sm text-blue-200 mt-2 font-medium">
            Proven by 10,000+ strivers who completed their 90-day metamorphosis.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS Section */}
      <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
            {t('howItWorks')}
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Cairo']">
            Your 4-Step Road to Habit Mastery
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '01', title: t('step1Title'), desc: t('step1Desc'), icon: Sparkles },
            { step: '02', title: t('step2Title'), desc: t('step2Desc'), icon: CheckCircle2 },
            { step: '03', title: t('step3Title'), desc: t('step3Desc'), icon: Flame },
            { step: '04', title: t('step4Title'), desc: t('step4Desc'), icon: Trophy },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow relative"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white mb-2 font-['Cairo']">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              {t('features')}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Cairo']">
              Engineered for Global Habit Builders
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: t('feature1'), desc: t('feature1Desc'), icon: Calendar },
              { title: t('feature2'), desc: t('feature2Desc'), icon: CheckCircle2 },
              { title: t('feature3'), desc: t('feature3Desc'), icon: Layers },
              { title: t('feature4'), desc: t('feature4Desc'), icon: Flame },
              { title: t('feature5'), desc: t('feature5Desc'), icon: Sparkles },
              { title: t('feature6'), desc: t('feature6Desc'), icon: Languages },
              { title: t('feature7'), desc: t('feature7Desc'), icon: Moon },
              { title: t('feature8'), desc: t('feature8Desc'), icon: Smartphone },
              { title: t('feature9'), desc: t('feature9Desc'), icon: ShieldCheck },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 font-['Cairo']">
                    {f.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Final CTA */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 font-['Cairo']">
          Ready to Start Day 1?
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8">
          Join thousands of achievers taking the 90-day consistency pledge today.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#0d284f] hover:bg-[#143d75] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer font-['Cairo']"
        >
          <span>{t('startMy90Days')}</span>
          {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </section>
    </div>
  );
};
