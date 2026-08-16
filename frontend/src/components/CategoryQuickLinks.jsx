import React from 'react';
import { Link } from 'react-router-dom';
import { Sailboat, Fish, Waves, Mountain, Anchor, Users } from 'lucide-react';
import { CATEGORY_QUICK_LINKS } from '../lib/seoCategories';

const iconMap = {
  barco: Sailboat,
  delfines: Fish,
  'jet-ski': Waves,
  buggy: Mountain,
  buceo: Anchor,
  familias: Users,
};

export default function CategoryQuickLinks() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CATEGORY_QUICK_LINKS.map(({ slug, label }) => {
            const Icon = iconMap[slug] || Waves;
            return (
              <Link
                key={slug}
                to={`/activities/${slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-[#14213d] transition-all hover:border-[#1fa5a3] hover:text-[#1fa5a3]"
              >
                <Icon className="h-4 w-4 text-[#c8a25a]" /> {label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
