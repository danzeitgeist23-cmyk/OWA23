import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useActivities } from '../hooks/use-activities';
import { resolveCategory } from '../lib/seoCategories';
import ActivityListCard from '../components/ActivityListCard';

export default function CategoryLanding() {
  const { category } = useParams();
  const config = resolveCategory(category);
  const { data, isLoading } = useActivities({ limit: 200 });

  const items = useMemo(() => {
    if (!config) return [];
    return (data?.items || []).filter(config.match);
  }, [config, data]);

  if (!config) {
    return (
      <div className="pt-40 pb-20 text-center">
        <p className="text-gray-600">Categoría no encontrada.</p>
        <Link to="/activities" className="text-[#1fa5a3] underline">Ver todas las actividades</Link>
      </div>
    );
  }

  const heroImage = items[0]?.image || 'https://images.unsplash.com/photo-1647002408653-129115ac90e1?auto=format&fit=crop&w=2000&q=80';

  return (
    <div className="pt-20 bg-white min-h-screen">
      <div className="relative h-[40vh] min-h-[300px] w-full flex items-end overflow-hidden">
        <img src={heroImage} alt={config.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a2b]/90 via-[#071a2b]/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto w-full px-5 md:px-8 pb-10 text-white">
          <Link to="/activities" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-3">
            <ArrowLeft className="w-4 h-4" /> Todas las actividades
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold">{config.title}</h1>
          <p className="mt-3 max-w-2xl text-white/85">{config.intro}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <p className="text-gray-600 mb-6"><span className="font-semibold text-[#14213d]">{items.length}</span> experiencias</p>
        {isLoading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="rounded-2xl border border-gray-100 bg-gray-100 h-40 animate-pulse" />)}</div>
        ) : items.length ? (
          <div className="space-y-4">{items.map((a) => <ActivityListCard key={a.id} activity={a} />)}</div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-[#f7f9fb] px-6 py-14 text-center">
            <h3 className="text-xl font-semibold text-[#14213d]">Pronto más experiencias</h3>
            <p className="mt-2 text-gray-500">Estamos ampliando el catálogo de esta categoría. Mientras, explora todas las actividades.</p>
            <Link to="/activities" className="mt-5 inline-flex rounded-full bg-[#1fa5a3] px-6 py-3 text-sm font-semibold text-white hover:bg-[#188b89]">Ver el catálogo</Link>
          </div>
        )}
      </div>
    </div>
  );
}
