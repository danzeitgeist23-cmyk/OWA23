import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { useDestinations } from '../hooks/use-activities';

export default function Destinations() {
  const { data, isLoading, isError } = useDestinations();
  const items = data || [];

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">Destinos</p>
          <h1 className="text-4xl md:text-6xl font-bold text-[#14213d]">
            Islas <span className="italic font-medium">Canarias</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Ocho islas volcánicas, playas doradas, cielos limpios y actividades infinitas.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl aspect-[16/10] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-gray-500">
            No pudimos cargar los destinos ahora mismo. Inténtalo de nuevo en unos minutos.
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Aún no hay destinos publicados.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d) => (
              <Link
                key={d.slug}
                to={`/destinations/${d.slug}`}
                className="group relative min-h-[230px] overflow-hidden rounded-2xl aspect-[16/10] bg-[#0b1c26] shadow-[0_16px_40px_-24px_rgba(11,33,61,0.5)]"
              >
                <img src={d.image} alt={d.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071a2b]/95 via-[#071a2b]/20 to-transparent transition-colors group-hover:from-[#071a2b]" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/80 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#c8a25a]" /> Islas Canarias
                    </div>
                    <h3 className="text-3xl font-bold break-words">{d.name}</h3>
                    <p className="mt-1 text-white/70">{d.activity_count} actividades disponibles</p>
                  </div>
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition-all group-hover:border-[#c8a25a] group-hover:bg-[#c8a25a]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
