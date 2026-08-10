import React from 'react';
import { Compass, Award, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useT } from '../i18n/LanguageContext';

export default function WhyOWA() {
  const t = useT();

  const features = [
    {
      icon: Compass,
      title: t('why.feature1Title'),
      text: t('why.feature1Text'),
    },
    {
      icon: Award,
      title: t('why.feature2Title'),
      text: t('why.feature2Text'),
    },
    {
      icon: HeartHandshake,
      title: t('why.feature3Title'),
      text: t('why.feature3Text'),
    },
    {
      icon: ShieldCheck,
      title: t('why.feature4Title'),
      text: t('why.feature4Text'),
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#0b1c26] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#1fa5a3] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#c8a25a] blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-3">{t('why.eyebrow')}</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {t('why.title')}<br /><span className="italic font-medium text-white/80">{t('why.titleAccent')}</span>
            </h2>
            <p className="mt-6 text-white/70 text-lg leading-relaxed">
              {t('why.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#1fa5a3] transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1fa5a3]/20 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-[#c8a25a]" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{f.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
