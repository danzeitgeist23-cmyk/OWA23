import React, { useState, useMemo } from 'react';
import { categories } from '../mock';
import { activities } from '../siteData';
import ActivityCard from './ActivityCard';
import { Sailboat, Fish, Mountain, Wind, Leaf, UtensilsCrossed } from 'lucide-react';
import { useT } from '../i18n/LanguageContext';

const iconMap = { Sailboat, Fish, Mountain, Wind, Leaf, UtensilsCrossed };

export default function BestOfCanary() {
  const t = useT();
  const [active, setActive] = useState('all');

  const filtered = active === 'all' ? activities : activities.filter((a) => a.category === active);

  const list = useMemo(() => {
    if (active !== 'all') {
      return filtered.slice(0, 6);
    }
    // When showing all categories, diversify by picking from different categories
    const seenCategories = new Set();
    const selected = [];
    for (const activity of filtered) {
      if (selected.length >= 6) break;
      if (!seenCategories.has(activity.category)) {
        selected.push(activity);
        seenCategories.add(activity.category);
      }
    }
    // Fill remaining slots if fewer than 6 categories
    if (selected.length < 6) {
      for (const activity of filtered) {
        if (selected.length >= 6) break;
        if (!selected.includes(activity)) {
          selected.push(activity);
        }
      }
    }
    return selected;
  }, [active, filtered]);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">{t('bestOf.eyebrow')}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#14213d]">
            {t('bestOf.title').split(' ').slice(0, -1).join(' ')} <span className="italic font-medium">{t('bestOf.title').split(' ').slice(-1)[0]}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 mt-4">
            {t('bestOf.description')}
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-3 mb-12">
          <button
            onClick={() => setActive('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
              active === 'all'
                ? 'bg-[#1fa5a3] text-white border-[#1fa5a3]'
                : 'bg-white text-[#14213d] border-gray-200 hover:border-[#1fa5a3]'
            }`}
          >
            {t('bestOf.filterAll')}
          </button>
          {categories.map((c) => {
            const Icon = iconMap[c.icon];
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                  active === c.id
                    ? 'bg-[#1fa5a3] text-white border-[#1fa5a3]'
                    : 'bg-white text-[#14213d] border-gray-200 hover:border-[#1fa5a3]'
                }`}
              >
                <Icon className="w-4 h-4" /> {c.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((a) => <ActivityCard key={a.id} activity={a} />)}
        </div>
      </div>
    </section>
  );
}
