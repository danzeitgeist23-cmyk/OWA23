import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e) => {
    e.preventDefault();
    toast({ title: '¡Mensaje enviado!', description: 'Te responderemos en menos de 24 horas.' });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">Contacto</p>
          <h1 className="text-4xl md:text-6xl font-bold text-[#14213d]">Estamos aquí <span className="italic font-medium">para ti</span></h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Cuéntanos qué aventura tienes en mente y te ayudaremos a hacerla realidad.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: MapPin, title: 'Oficina central', lines: ['Avda. Marítima 24', 'Las Palmas de Gran Canaria'] },
            { icon: Phone, title: 'Llámanos', lines: ['+34 928 123 456', 'Lun – Dom 9:00 – 21:00'] },
            { icon: Mail, title: 'Email', lines: ['hola@owawild.com', 'reservas@owawild.com'] },
          ].map((c, i) => (
            <div key={i} className="p-8 rounded-2xl bg-[#f7f9fb] hover:bg-white hover:shadow-[0_20px_50px_-15px_rgba(11,33,61,0.15)] transition-all">
              <div className="w-12 h-12 rounded-full bg-[#1fa5a3] flex items-center justify-center mb-5">
                <c.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#14213d]">{c.title}</h3>
              {c.lines.map((l, idx) => <p key={idx} className="text-gray-600">{l}</p>)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#f7f9fb] p-8 md:p-12 rounded-2xl">
          <div>
            <h3 className="text-3xl font-bold text-[#14213d] mb-4">Escríbenos</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Rellena el formulario y nuestro equipo se pondrá en contacto contigo lo antes posible.</p>
            <div className="aspect-video rounded-2xl overflow-hidden">
              <iframe title="map" src="https://www.google.com/maps?q=Las+Palmas+de+Gran+Canaria&output=embed" className="w-full h-full border-0" loading="lazy" />
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#1fa5a3]" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#1fa5a3]" />
            </div>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Asunto" className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#1fa5a3]" />
            <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Cuéntanos qué aventura te interesa..." className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#1fa5a3] resize-none" />
            <button type="submit" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c8a25a] hover:bg-[#b08c49] text-white rounded-full font-semibold transition-all">
              <Send className="w-4 h-4" /> Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
