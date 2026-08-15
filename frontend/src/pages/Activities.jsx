import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { destinations, categories } from '../mock';
import ActivityCard from '../components/ActivityCard';
import ActivityListCard from '../components/ActivityListCard';
import { Filter, LayoutGrid, List, Search } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useActivities } from '../hooks/use-activities';

export default function Activities() {
  const [params] = useSearchParams();
  const { currency, format: formatPrice } = useCurrency();
  const [q, setQ] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState([0, 1200]);
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, isError } = useActivities({ limit: 200 });
  const activities = useMemo(() => data?.items || [], [data]);

  useEffect(() => {
    const d = params.get('destination');
    if (d) setSelectedDestinations([d]);
    const query = params.get('q');
    if (query) setQ(query);
  }, [params]);

  const filtered = useMemo(() => {
    let list = [...activities];
    if (q) list = list.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()) || a.location.toLowerCase().includes(q.toLowerCase()));
    if (selectedDestinations.length) list = list.filter((a) => selectedDestinations.includes(a.destination));
    if (selectedCategories.length) list = list.filter((a) => selectedCategories.includes(a.category));
    list = list.filter((a) => a.price >= price[0] && a.price <= price[1]);
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'featured') list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }, [activities, q, selectedDestinations, selectedCategories, price, sort]);

  const toggle = (arr, setArr, v) => setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[42vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1647002408653-129115ac90e1?auto=format&fit=crop&w=2000&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0b1c26]/50" />
        <div className="relative text-center text-white px-5">
          <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-3">Actividades</p>
          <h1 className="text-4xl md:text-6xl font-bold">Todas las <span className="italic font-medium">aventuras</span></h1>
          <p className="mt-4 text-white/80 max-w-xl mx-auto">Encuentra tu próxima experiencia entre más de 120 actividades curadas.</p>
        </div>
      </div>

      {/* Mobile filters toggle */}
      <div className="lg:hidden max-w-7xl mx-auto px-5 md:px-8 pt-8">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#14213d] hover:border-[#1fa5a3] hover:text-[#1fa5a3]"
        >
          <Filter className="w-4 h-4" /> {showFilters ? 'Ocultar filtros' : 'Filtros'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 lg:py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Filters */}
        <aside className={`space-y-8 bg-[#f7f9fb] p-6 rounded-2xl h-fit lg:sticky lg:top-24 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div>
            <div className="flex items-center gap-2 font-semibold text-[#14213d] mb-4">
              <Filter className="w-4 h-4" /> Filtros
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#1fa5a3]"
              />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#14213d] mb-3 text-sm uppercase tracking-wide">Destinos</h4>
            <div className="space-y-2">
              {destinations.map((d) => (
                <label key={d.id} className="flex items-center gap-2 cursor-pointer text-[15px] text-gray-700">
                  <Checkbox
                    checked={selectedDestinations.includes(d.id)}
                    onCheckedChange={() => toggle(selectedDestinations, setSelectedDestinations, d.id)}
                  />
                  <span>{d.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#14213d] mb-3 text-sm uppercase tracking-wide">Categorías</h4>
            <div className="space-y-2">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer text-[15px] text-gray-700">
                  <Checkbox
                    checked={selectedCategories.includes(c.id)}
                    onCheckedChange={() => toggle(selectedCategories, setSelectedCategories, c.id)}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#14213d] mb-4 text-sm uppercase tracking-wide">Precio ({currency})</h4>
            <Slider min={0} max={1200} step={10} value={price} onValueChange={setPrice} />
            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <span>{formatPrice(price[0])}</span>
              <span>{formatPrice(price[1])}</span>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <p className="text-gray-600"><span className="font-semibold text-[#14213d]">{filtered.length}</span> actividades encontradas</p>
            <div className="flex items-center gap-3">
              {/* View toggle: list (default) / grid */}
              <div className="hidden sm:flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  aria-label="Ver en lista"
                  aria-pressed={view === 'list'}
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${view === 'list' ? 'bg-[#1fa5a3] text-white' : 'text-gray-500 hover:text-[#1fa5a3]'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  aria-label="Ver en cuadrícula"
                  aria-pressed={view === 'grid'}
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${view === 'grid' ? 'bg-[#1fa5a3] text-white' : 'text-gray-500 hover:text-[#1fa5a3]'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
              <label className="text-sm text-gray-500">Ordenar:</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1fa5a3]">
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-gray-100 h-40 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-gray-500">
              No pudimos cargar las actividades ahora mismo. Inténtalo de nuevo en unos minutos.
            </div>
          ) : filtered.length ? (
            view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((a) => <ActivityCard key={a.id} activity={a} />)}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((a) => <ActivityListCard key={a.id} activity={a} />)}
              </div>
            )
          ) : (
            <div className="text-center py-20 text-gray-500">No hay actividades con estos filtros.</div>
          )}
        </div>
      </div>
    </div>
  );
}
