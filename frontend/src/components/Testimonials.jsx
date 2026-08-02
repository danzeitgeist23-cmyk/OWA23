import React from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../mock';

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-[#f7f9fb]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[#f4623a] text-sm font-semibold tracking-widest uppercase mb-2">Testimonios</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#14213d]" style={{ fontFamily: 'Playfair Display' }}>
            Historias reales de <span className="italic font-medium">exploradores</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-[0_15px_40px_-15px_rgba(11,33,61,0.2)] transition-all">
              <Quote className="w-8 h-8 text-[#f4623a] mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                ))}
              </div>
              <p className="text-[#14213d] leading-relaxed mb-6">“{t.text}”</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-[#14213d]">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.country} · {t.activity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
