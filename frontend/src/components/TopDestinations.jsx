import React from 'react';
import { Link } from 'react-router-dom';
import { destinations } from '../mock';

export default function TopDestinations() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">Explora</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#14213d]">
              Los mejores destinos<br /><span className="italic font-medium">de Canarias</span>
            </h2>
          </div>
          <Link to="/destinos" className="text-[#1fa5a3] font-semibold hover:text-[#c8a25a] transition-colors self-start md:self-end">
            Ver todos los destinos →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {destinations.map((d, idx) => (
            <Link
              key={d.id}
              to={`/actividades?destination=${d.id}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden mb-4 owa-card">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover owa-card-image"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b1c26]/40 group-hover:to-[#0b1c26]/60 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-[#14213d] group-hover:text-[#1fa5a3]">
                {d.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{d.activityCount} actividades</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
