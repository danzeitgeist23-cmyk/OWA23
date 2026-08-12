import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { useT } from '../i18n/LanguageContext';
import { useDestinations } from '../hooks/use-activities';

export default function TopDestinations() {
  const t = useT();
  const { data } = useDestinations();
  const destinations = data || [];
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">{t('destinations.eyebrow')}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#14213d]">
              {t('destinations.title')}<br /><span className="italic font-medium">{t('destinations.titleAccent')}</span>
            </h2>
          </div>
          <Link to="/destinations" className="text-[#1fa5a3] font-semibold hover:text-[#c8a25a] transition-colors self-start md:self-end">
            {t('destinations.viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((d) => {
            const activityCount = d.activity_count;
            const countLabel = activityCount === 1 ? t('destinations.activityCountOne') : t('destinations.activityCount');
            return (
            <Link
              key={d.slug}
              to={`/activities?destination=${d.slug}`}
              className="group relative min-h-[210px] min-w-0 overflow-hidden rounded-xl bg-[#0b1c26] aspect-[16/10] shadow-[0_16px_35px_-24px_rgba(11,33,61,0.55)]"
            >
              <img
                src={d.image}
                alt={d.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071a2b]/95 via-[#071a2b]/20 to-transparent transition-colors group-hover:from-[#071a2b]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-white/75">
                    <MapPin className="h-3.5 w-3.5 text-[#c8a25a]" /> {t('destinations.eyebrow')}
                  </div>
                  <h3 className="break-words text-2xl font-bold leading-tight">{d.name}</h3>
                  <p className="mt-1 text-sm text-white/75">{activityCount} {countLabel}</p>
                </div>
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition-all group-hover:border-[#c8a25a] group-hover:bg-[#c8a25a]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
