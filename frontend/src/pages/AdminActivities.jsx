import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, Star, X } from 'lucide-react';
import PortalPageShell from '../components/PortalPageShell';
import { categories } from '../mock';
import { useCurrency } from '../context/CurrencyContext';
import {
  apiEnabled,
  fetchAdminActivities,
  fetchAdminDestinations,
  toActivityPayload,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../lib/adminActivities';

const EMPTY_FORM = {
  slug: '', title_es: '', title_en: '', excerpt_es: '', excerpt_en: '',
  description_es: '', description_en: '', island: 'gran-canaria', category: 'nauticas',
  price: '', original_price: '', price_unit: 'persona', duration: '', location: '',
  image: '', featured: false, booking_enabled: false,
};

// Read either the API doc shape (i18n objects, island/excerpt) or the static
// frontend shape (plain strings, destination/shortDescription) into the form.
function activityToForm(a) {
  const es = (v) => (v && typeof v === 'object' ? v.es : v) || '';
  const en = (v) => (v && typeof v === 'object' ? v.en : v) || '';
  return {
    slug: a.slug || a.id || '',
    title_es: es(a.title), title_en: en(a.title),
    excerpt_es: es(a.excerpt ?? a.shortDescription), excerpt_en: en(a.excerpt ?? a.shortDescription),
    description_es: es(a.description), description_en: en(a.description),
    island: a.island || a.destination || 'gran-canaria',
    category: a.category || 'nauticas',
    price: a.price ?? '', original_price: a.original_price ?? a.originalPrice ?? '',
    price_unit: a.price_unit || a.priceUnit || 'persona',
    duration: a.duration || '', location: a.location || '',
    image: a.image || '', featured: Boolean(a.featured),
    booking_enabled: Boolean(a.booking_enabled ?? a.bookingEnabled),
  };
}

function activityTitle(a) {
  return (a.title && typeof a.title === 'object' ? a.title.es : a.title) || a.slug || a.id;
}

const inputCls =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10';

export default function AdminActivities() {
  const queryClient = useQueryClient();
  const { format } = useCurrency();
  const destinations = useMemo(fetchAdminDestinations, []);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState(null);
  const [msg, setMsg] = useState({ ok: '', err: '' });

  const listQuery = useQuery({ queryKey: ['admin', 'activities'], queryFn: fetchAdminActivities });
  const items = listQuery.data?.items || [];

  const set = (k, v) => setForm((c) => ({ ...c, [k]: v }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingSlug(null); };
  const startEdit = (a) => { setForm(activityToForm(a)); setEditingSlug(a.slug || a.id); setMsg({ ok: '', err: '' }); };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'activities'] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = toActivityPayload(form);
      return editingSlug ? updateActivity(editingSlug, payload) : createActivity(payload);
    },
    onSuccess: async () => {
      setMsg({ ok: editingSlug ? 'Actividad actualizada.' : 'Actividad creada.', err: '' });
      resetForm();
      await invalidate();
    },
    onError: (e) => setMsg({ ok: '', err: e.message || 'No se pudo guardar.' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug) => deleteActivity(slug),
    onSuccess: async () => { setMsg({ ok: 'Actividad eliminada.', err: '' }); await invalidate(); },
    onError: (e) => setMsg({ ok: '', err: e.message || 'No se pudo eliminar.' }),
  });

  const filtered = items.filter((a) =>
    activityTitle(a).toLowerCase().includes(search.trim().toLowerCase())
  );

  const submit = (e) => {
    e.preventDefault();
    if (!apiEnabled) { setMsg({ ok: '', err: 'Backend no conectado: define REACT_APP_API_BASE_URL para guardar.' }); return; }
    if (!form.slug.trim() || !form.title_es.trim()) { setMsg({ ok: '', err: 'Slug y título (ES) son obligatorios.' }); return; }
    saveMutation.mutate();
  };

  return (
    <PortalPageShell
      eyebrow="Admin"
      title="Actividades"
      description="Crea, edita y elimina actividades. Se guardan en la base de datos; el precio de reserva lo sigue validando el servidor."
      widthClassName="max-w-7xl"
      actions={(
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {listQuery.data?.source === 'api' ? 'Fuente: API' : 'Fuente: estática'}
        </div>
      )}
    >
      {!apiEnabled ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          El backend no está conectado (falta <code>REACT_APP_API_BASE_URL</code>). Se muestra la lista en modo lectura;
          crear/editar/eliminar se activará al desplegar la API.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* List */}
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.24)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#14213d]">{filtered.length} actividades</h2>
              <p className="mt-1 text-sm text-slate-500">Busca, edita o elimina.</p>
            </div>
            <label className="relative block md:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#1fa5a3]" />
            </label>
          </div>

          {msg.ok ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg.ok}</div> : null}
          {msg.err ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{msg.err}</div> : null}
          {listQuery.isError ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">No se pudo cargar la lista.</div> : null}

          <div className="mt-5 divide-y divide-slate-100">
            {filtered.map((a) => {
              const slug = a.slug || a.id;
              return (
                <div key={slug} className="flex items-center gap-3 py-3">
                  <img src={a.image} alt="" className="h-12 w-16 flex-shrink-0 rounded-lg object-cover bg-slate-100" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#14213d]">{activityTitle(a)}</p>
                    <p className="truncate text-xs text-slate-500">
                      {a.island || a.destination} · {a.category} · {format(a.price)}
                      {a.featured ? <span className="ml-1 inline-flex items-center gap-0.5 text-[#c8a25a]"><Star className="h-3 w-3 fill-[#c8a25a]" />destacada</span> : null}
                    </p>
                  </div>
                  <button type="button" onClick={() => startEdit(a)} className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-[#1fa5a3] hover:text-[#1fa5a3]" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                  <button type="button" disabled={!apiEnabled || deleteMutation.isPending}
                    onClick={() => { if (window.confirm(`¿Eliminar "${activityTitle(a)}"?`)) deleteMutation.mutate(slug); }}
                    className="rounded-full border border-slate-200 p-2 text-red-500 hover:border-red-300 disabled:opacity-40" aria-label="Eliminar"><Trash2 className="h-4 w-4" /></button>
                </div>
              );
            })}
            {filtered.length === 0 && !listQuery.isLoading ? <p className="py-8 text-center text-sm text-slate-500">Sin resultados.</p> : null}
          </div>
        </section>

        {/* Form */}
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.24)] h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#14213d]">{editingSlug ? 'Editar actividad' : 'Nueva actividad'}</h2>
            {editingSlug ? <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#1fa5a3]"><X className="h-4 w-4" />Cancelar</button> : null}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3">
            <input className={inputCls} placeholder="Slug (único, ej. jet-ski-safari)" value={form.slug}
              onChange={(e) => set('slug', e.target.value)} disabled={Boolean(editingSlug)} required />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputCls} placeholder="Título (ES)" value={form.title_es} onChange={(e) => set('title_es', e.target.value)} required />
              <input className={inputCls} placeholder="Title (EN)" value={form.title_en} onChange={(e) => set('title_en', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select className={inputCls} value={form.island} onChange={(e) => set('island', e.target.value)}>
                {destinations.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
              <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <input className={inputCls} placeholder="Ubicación (ej. Puerto Rico, Gran Canaria)" value={form.location} onChange={(e) => set('location', e.target.value)} />
            <div className="grid grid-cols-3 gap-3">
              <input className={inputCls} type="number" min="0" step="0.01" placeholder="Precio €" value={form.price} onChange={(e) => set('price', e.target.value)} required />
              <input className={inputCls} type="number" min="0" step="0.01" placeholder="Antes €" value={form.original_price} onChange={(e) => set('original_price', e.target.value)} />
              <input className={inputCls} placeholder="Duración" value={form.duration} onChange={(e) => set('duration', e.target.value)} />
            </div>
            <input className={inputCls} type="url" placeholder="URL de imagen" value={form.image} onChange={(e) => set('image', e.target.value)} />
            <textarea className={`${inputCls} min-h-20`} placeholder="Descripción corta (ES)" value={form.excerpt_es} onChange={(e) => set('excerpt_es', e.target.value)} />
            <textarea className={`${inputCls} min-h-28`} placeholder="Descripción larga (ES)" value={form.description_es} onChange={(e) => set('description_es', e.target.value)} />
            <div className="flex flex-wrap gap-5 pt-1">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />Destacada</label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.booking_enabled} onChange={(e) => set('booking_enabled', e.target.checked)} />Reserva online (SumUp)</label>
            </div>
            <button type="submit" disabled={saveMutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1fa5a3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#188b89] disabled:opacity-60">
              <Plus className="h-4 w-4" />{saveMutation.isPending ? 'Guardando…' : editingSlug ? 'Guardar cambios' : 'Crear actividad'}
            </button>
          </form>
        </section>
      </div>
    </PortalPageShell>
  );
}
