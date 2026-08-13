import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, MessageCircle } from 'lucide-react';
import { destinations } from '../mock';
import { useActivities } from '../hooks/use-activities';
import ActivityListCard from '../components/ActivityListCard';
import { buildWhatsAppUrl, buildGeneralWhatsAppMessage } from '../lib/whatsapp';

export default function Destination() {
  const { slug } = useParams();
  const island = destinations.find((d) => d.id === slug);
  const { data, isLoading } = useActivities({ island: slug, limit: 200 });
  const items = data?.items || [];

  if (!island) {
    return (
      <div className="pt-40 pb-20 text-center">
        <p className="text-gray-600">Isla no encontrada.</p>
        <Link to="/destinations" className="text-[#1fa5a3] underline">Ver todos los destinos</Link>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(buildGeneralWhatsAppMessage());

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Island hero */}
      <div className="relative h-[46vh] min-h-[320px] w-full flex items-end overflow-hidden">
        <img src={island.image} alt={island.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a2b]/90 via-[#071a2b]/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto w-full px-5 md:px-8 pb-10 text-white">
          <Link to="/destinations" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-3">
            <ArrowLeft className="w-4 h-4" /> Todos los destinos
          </Link>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/80 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#c8a25a]" /> Islas Canarias
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">{island.name}</h1>
          {island.description ? <p className="mt-3 max-w-2xl text-white/85">{island.description}</p> : null}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <div className="flex items-end justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#14213d]">
            Experiencias en {island.name}
          </h2>
          <Link to={`/activities?destination=${island.id}`} className="text-[#1fa5a3] font-semibold hover:text-[#c8a25a] whitespace-nowrap">
            Ver en el catálogo →
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="rounded-2xl border border-gray-100 bg-gray-100 h-40 animate-pulse" />)}
          </div>
        ) : items.length ? (
          <div className="space-y-4">
            {items.map((a) => <ActivityListCard key={a.id} activity={a} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-[#f7f9fb] px-6 py-14 text-center">
            <h3 className="text-xl font-semibold text-[#14213d]">Aún estamos preparando {island.name}</h3>
            <p className="mt-2 max-w-xl mx-auto text-gray-500">
              Todavía no hay experiencias publicadas en esta isla. Cuéntanos qué buscas y te preparamos una propuesta personalizada.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href={whatsappUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:brightness-95">
                <MessageCircle className="w-4 h-4" /> Consultar por WhatsApp
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-[#14213d] hover:border-[#1fa5a3] hover:text-[#1fa5a3]">
                Contáctanos
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
