import React from 'react';
import { destinations, activities } from '../mock';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function Destinations() {
  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[#f4623a] text-sm font-semibold tracking-widest uppercase mb-2">Destinos</p>
          <h1 className="text-4xl md:text-6xl font-bold text-[#14213d]" style={{ fontFamily: 'Playfair Display' }}>
            Islas <span className="italic font-medium">Canarias</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Ocho islas volcánicas, playas doradas, cielos limpios y actividades infinitas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => {
            const count = activities.filter((a) => a.destination === d.id).length;
            return (
              <Link
                key={d.id}
                to={`/actividades?destination=${d.id}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] owa-card shadow-[0_15px_40px_-15px_rgba(11,33,61,0.2)]"
              >
                <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover owa-card-image" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/85 via-[#0a1929]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/80 mb-1">
                    <MapPin className="w-3.5 h-3.5" /> Islas Canarias
                  </div>
                  <h3 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display' }}>{d.name}</h3>
                  <p className="mt-1 text-white/70">{count} actividades disponibles</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
