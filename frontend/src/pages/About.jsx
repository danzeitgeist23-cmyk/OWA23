import React from 'react';
import { Target, Heart, Leaf, Users } from 'lucide-react';
import { stats } from '../mock';

export default function About() {
  return (
    <div className="pt-24 pb-20 bg-white">
      {/* Intro */}
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16">
          <div>
            <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-3">Sobre OWA</p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#14213d] leading-tight">
              Aventuras diseñadas <span className="italic font-medium">para exploradores</span>
            </h1>
            <p className="text-gray-600 text-lg mt-6 leading-relaxed">
              OWA — Orient Wild Adventure nace en 2018 en Gran Canaria con un objetivo claro: ofrecer experiencias auténticas, sostenibles y memorables en las Islas Canarias. Nada de tours multitudinarios. Solo grupos pequeños, guías locales y las mejores localizaciones.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-4xl font-bold text-[#1fa5a3]">{s.number}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1571328532572-cb7899a8be7e?auto=format&fit=crop&w=1200&q=80" alt="" className="rounded-2xl w-full aspect-square object-cover" />
            <div className="absolute -bottom-6 -left-6 bg-[#c8a25a] rounded-xl px-6 py-4 text-white shadow-xl">
              <div className="text-2xl font-bold">7+ años</div>
              <div className="text-sm opacity-90">creando aventuras</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">Nuestros valores</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#14213d]">Lo que nos <span className="italic font-medium">mueve</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: 'Autenticidad', text: 'Rutas y experiencias reales, lejos de las masas.' },
              { icon: Heart, title: 'Pasión', text: 'Cada aventura está creada con amor por el detalle.' },
              { icon: Leaf, title: 'Sostenibilidad', text: 'Cuidamos las islas para las próximas generaciones.' },
              { icon: Users, title: 'Comunidad', text: 'Trabajamos con proveedores 100% canarios locales.' },
            ].map((v, i) => (
              <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:border-[#1fa5a3] hover:shadow-[0_20px_40px_-20px_rgba(11,33,61,0.2)] transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1fa5a3]/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-[#1fa5a3]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#14213d]">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
