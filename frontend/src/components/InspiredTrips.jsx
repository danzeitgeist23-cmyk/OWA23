import React from 'react';
import { Link } from 'react-router-dom';
import { activities } from '../mock';
import ActivityCard from './ActivityCard';

export default function InspiredTrips() {
  const inspired = activities.slice(0, 6);
  return (
    <section className="py-20 md:py-28 bg-[#f7f9fb]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">Inspiration</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#14213d]">
              Get inspired for your <span className="italic font-medium">next trip</span>
            </h2>
          </div>
          <Link to="/actividades" className="text-[#1fa5a3] font-semibold hover:text-[#c8a25a] transition-colors self-start md:self-end">
            Ver todas las actividades →
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
