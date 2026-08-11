import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { activities } from '../siteData';
import ActivityCard from './ActivityCard';
import { useT } from '../i18n/LanguageContext';

export default function InspiredTrips() {
  const t = useT()

  const inspired = useMemo(() => {
    const seenCategories = new Set()
    const selected = []

    for (const activity of activities) {
      if (selected.length >= 6) break
      if (!seenCategories.has(activity.category)) {
        selected.push(activity)
        seenCategories.add(activity.category)
      }
    }

    if (selected.length < 6) {
      for (const activity of activities) {
        if (selected.length >= 6) break
        if (!selected.includes(activity)) {
          selected.push(activity)
        }
      }
    }

    return selected
  }, [])

  return (
    <section className="py-20 md:py-28 bg-[#f7f9fb]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">{t('inspired.eyebrow')}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#14213d]">
              {t('inspired.title')}
            </h2>
          </div>
          <Link to="/activities" className="text-[#1fa5a3] font-semibold hover:text-[#c8a25a] transition-colors self-start md:self-end">
            {t('inspired.viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspired.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
