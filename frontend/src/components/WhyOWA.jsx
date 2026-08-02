import React from 'react';
import { Compass, Award, HeartHandshake, ShieldCheck } from 'lucide-react';
import { stats } from '../mock';

const features = [
  {
    icon: Compass,
    title: 'Guías locales',
    text: 'Nuestro equipo son canarios de nacimiento que conocen cada rincón de las islas.',
  },
  {
    icon: Award,
    title: 'Aventuras premium',
    text: 'Experiencias cuidadas al detalle, no tours de agencia genéricos.',
  },
  {
    icon: HeartHandshake,
    title: 'Grupos pequeños',
    text: 'Máximo 8 personas por actividad. Más cerca, más auténtico.',
  },
  {
    icon: ShieldCheck,
    title: 'Reserva segura',
    text: 'Cancelación gratuita hasta 24 horas antes. Pago 100% seguro.',
  },
];

export default function WhyOWA() {
  return (
    <section className="py-20 md:py-28 bg-[#0a1929] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#0b7285] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#f4623a] blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#f4623a] text-sm font-semibold tracking-widest uppercase mb-3">Where adventure begins</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'Playfair Display' }}>
              No para todos.<br /><span className="italic font-medium text-white/80">Solo para exploradores.</span>
            </h2>
            <p className="mt-6 text-white/70 text-lg leading-relaxed">
              OWA nace de la pasión por lo salvaje. No vendemos tours: creamos aventuras a medida por mar, aire y tierra en las islas más espectaculares del Atlántico.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">
              {stats.map((s, i) => (
                <div key={i} className="border-l-2 border-[#f4623a] pl-4">
                  <div className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Playfair Display' }}>{s.number}</div>
                  <div className="text-sm text-white/60 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#0b7285] transition-all">
                <div className="w-12 h-12 rounded-full bg-[#0b7285]/20 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-[#f4623a]" />
                </div>
                <h4 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>{f.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
