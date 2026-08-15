import React from 'react';
import { BadgeEuro, ShieldCheck, MessageCircle } from 'lucide-react';

const items = [
  {
    icon: BadgeEuro,
    title: 'Precio justo y transparente',
    text: 'El precio que ves es el que pagas, sin cargos ocultos ni sorpresas.',
  },
  {
    icon: ShieldCheck,
    title: 'Cancelación clara',
    text: 'Cada actividad muestra su política de cancelación antes de reservar.',
  },
  {
    icon: MessageCircle,
    title: 'Atención directa',
    text: 'Te asesoramos y confirmamos disponibilidad al momento por WhatsApp.',
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3 rounded-2xl bg-[#f7f9fb] p-5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-[#1fa5a3] shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-[#14213d]">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
