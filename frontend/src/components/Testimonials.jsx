import React from 'react';
import { useT } from '../i18n/LanguageContext';

export default function Testimonials() {
  const t = useT();

  return (
    <section className="py-20 md:py-28 bg-[#f7f9fb]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">{t('testimonials.eyebrow')}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#14213d]">
            {t('testimonials.title').split(' ').slice(0, -1).join(' ')} <span className="italic font-medium">{t('testimonials.title').split(' ').slice(-1)[0]}</span>
          </h2>
        </div>

        <div className="text-center text-gray-500 text-lg py-12">
          {t('testimonials.empty')}
        </div>
      </div>
    </section>
  );
}
