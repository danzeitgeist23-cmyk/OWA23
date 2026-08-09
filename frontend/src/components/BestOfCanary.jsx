import React, { useState } from 'react';
import { activities, categories } from '../mock';
import ActivityCard from './ActivityCard';
import { Sailboat, Fish, Mountain, Wind, Leaf, UtensilsCrossed } from 'lucide-react';

const iconMap = { Sailboat, Fish, Mountain, Wind, Leaf, UtensilsCrossed };

export default function BestOfCanary() {
  const [active, setActive] = useState('all');
  const filtered = active === 'all' ? activities : activities.filter((a) => a.category === active);
  const list = filtered.slice(0, 6);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">Lo mejor de Canarias</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#14213d]">
            Best of <span className="italic font-medium">Canary</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 mt-4">
            Actividades cuidadosamente seleccionadas por nuestros guías locales. Filtra por categoría y encuentra tu próxima aventura.
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
            Todas
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
