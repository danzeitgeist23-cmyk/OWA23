import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: '¡Estás dentro!',
      description: 'Te enviaremos las mejores ofertas de aventuras en Canarias.',
    });
    setEmail('');
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1535262412227-85541e910204?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0a1929]/70" />
      </div>

      <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center text-white">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#f4623a] mb-6">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
          Ofertas exclusivas <span className="italic font-medium">para wild explorers</span>
        </h2>
        <p className="mt-4 text-white/70 text-lg">
          Suscríbete y recibe descuentos secretos y las mejores aventuras cada semana.
        </p>

        <form onSubmit={submit} className="mt-10 max-w-xl mx-auto bg-white rounded-full p-1.5 flex items-center">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email"
            className="flex-1 px-5 py-3 bg-transparent text-[#14213d] outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-6 md:px-8 py-3 bg-[#f4623a] text-white rounded-full font-semibold hover:bg-[#e05027] transition-all"
          >
            Suscribirme
          </button>
        </form>

        <p className="mt-4 text-white/50 text-sm">Sin spam. Puedes darte de baja en cualquier momento.</p>
      </div>
    </section>
  );
}
