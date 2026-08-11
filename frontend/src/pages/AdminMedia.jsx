import React, { useDeferredValue, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, ImagePlus, Images, Search, Sparkles } from 'lucide-react';
import PortalPageShell from '../components/PortalPageShell';
import { createMediaAsset, fetchMediaLibrary, updateMediaAsset } from '../lib/portalApi';

function formatTimestamp(value) {
  if (!value) {
    return 'Sin fecha';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminMedia() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({
    title: '',
    alt: '',
    category: 'library',
    sourceUrl: '',
  });
  const [uploadError, setUploadError] = useState('');
  const [uploadDone, setUploadDone] = useState('');

  const mediaQuery = useQuery({
    queryKey: ['admin', 'media-library'],
    queryFn: fetchMediaLibrary,
  });

  const createAssetMutation = useMutation({
    mutationFn: createMediaAsset,
    onSuccess: async () => {
      setUploadError('');
      setUploadDone('Asset enviado. Si el backend ya esta cableado, deberia aparecer al refrescar la libreria.');
      setForm({ title: '', alt: '', category: 'library', sourceUrl: '' });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'media-library'] });
    },
    onError: (error) => {
      setUploadDone('');
      setUploadError(error.message || 'No se pudo registrar la imagen.');
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: ({ assetId, fields }) => updateMediaAsset(assetId, fields),
    onSuccess: async () => {
      setUploadDone('Cambio enviado. Refresca o espera la respuesta del backend para ver el estado final.');
      setUploadError('');
      await queryClient.invalidateQueries({ queryKey: ['admin', 'media-library'] });
    },
    onError: (error) => {
      setUploadDone('');
      setUploadError(error.message || 'No se pudo actualizar el asset.');
    },
  });

  const assets = mediaQuery.data?.items || [];
  const source = mediaQuery.data?.source || 'api';
  const filteredAssets = assets.filter((asset) => {
    const haystack = `${asset.title} ${asset.alt} ${asset.category} ${asset.tags.join(' ')}`.toLowerCase();
    return haystack.includes(deferredSearch.trim().toLowerCase());
  });

  const selectedAsset = filteredAssets.find((asset) => asset.id === selectedId) || filteredAssets[0] || null;

  const handleCreateAsset = async (event) => {
    event.preventDefault();
    setUploadDone('');
    setUploadError('');

    await createAssetMutation.mutateAsync({
      title: form.title.trim(),
      alt: form.alt.trim(),
      category: form.category.trim(),
      source_url: form.sourceUrl.trim(),
    });
  };

  const copyAssetUrl = async (assetUrl) => {
    try {
      await navigator.clipboard.writeText(assetUrl);
      setUploadDone('URL copiada al portapapeles.');
      setUploadError('');
    } catch {
      setUploadError('No se pudo copiar la URL desde este navegador.');
    }
  };

  return (
    <PortalPageShell
      eyebrow="Admin visual"
      title="Media library ligera para web y contenidos"
      description="Vista base para revisar imagenes, categorias y metadatos sin tocar backend. Si el endpoint aun no existe, la pantalla cae a demo visual."
      widthClassName="max-w-7xl"
      actions={(
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Fuente: {source}
        </div>
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr_0.85fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.24)] xl:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#14213d]">Libreria</h2>
              <p className="mt-1 text-sm text-slate-500">Buscador simple + preview visual para home, blog y actividades.</p>
            </div>
            <label className="relative block md:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="Buscar por titulo, alt o tag"
              />
            </label>
          </div>

          {mediaQuery.isError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {mediaQuery.error.message || 'No se pudo cargar la libreria visual.'}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelectedId(asset.id)}
                className={`overflow-hidden rounded-[24px] border text-left transition ${
                  selectedAsset?.id === asset.id
                    ? 'border-[#1fa5a3] bg-[#f4fbfa] shadow-[0_20px_60px_-34px_rgba(31,165,163,0.7)]'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="aspect-[4/3] bg-slate-100">
                  <img src={asset.thumb || asset.url} alt={asset.alt || asset.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="line-clamp-1 text-sm font-semibold text-[#14213d]">{asset.title}</p>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {asset.category}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{asset.alt || 'Sin alt text'}</p>
                </div>
              </button>
            ))}
          </div>

          {filteredAssets.length === 0 && !mediaQuery.isLoading ? (
            <div className="mt-8 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <Images className="mx-auto h-10 w-10 text-[#1fa5a3]" />
              <h3 className="mt-4 text-xl font-semibold text-[#14213d]">No hay resultados</h3>
              <p className="mt-2 text-sm text-slate-500">Prueba con otro termino o carga nuevos assets desde la columna derecha.</p>
            </div>
          ) : null}
        </section>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.24)]">
            <h2 className="text-xl font-bold text-[#14213d]">Preview</h2>
            {selectedAsset ? (
              <>
                <div className="mt-5 aspect-[4/3] overflow-hidden rounded-[24px] bg-slate-100">
                  <img src={selectedAsset.url} alt={selectedAsset.alt || selectedAsset.title} className="h-full w-full object-cover" />
                </div>
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Titulo</p>
                    <p className="mt-1 text-sm font-semibold text-[#14213d]">{selectedAsset.title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Alt text</p>
                    <p className="mt-1 text-sm text-slate-600">{selectedAsset.alt || 'Sin alt text'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-500">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Estado</p>
                      <p className="mt-1 font-medium text-[#14213d]">{selectedAsset.status}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Actualizado</p>
                      <p className="mt-1 font-medium text-[#14213d]">{formatTimestamp(selectedAsset.updated_at)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedAsset.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#f4fbfa] px-3 py-1 text-xs font-semibold text-[#1fa5a3]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => copyAssetUrl(selectedAsset.url)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#14213d] transition hover:border-[#1fa5a3] hover:text-[#1fa5a3]"
                    >
                      <Copy className="h-4 w-4" />
                      Copiar URL
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAssetMutation.mutate({ assetId: selectedAsset.id, fields: { featured: true } })}
                      className="inline-flex items-center gap-2 rounded-full bg-[#14213d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f1a31]"
                    >
                      <Sparkles className="h-4 w-4" />
                      Marcar destacada
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                Selecciona una imagen para ver detalles.
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.24)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#14213d] text-white">
                <ImagePlus className="h-5 w-5 text-[#c8a25a]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#14213d]">Nuevo asset</h2>
                <p className="text-sm text-slate-500">Formulario base para URL remota o upload posterior.</p>
              </div>
            </div>

            <form onSubmit={handleCreateAsset} className="mt-5 space-y-4">
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="Titulo interno"
                required
              />
              <input
                type="url"
                value={form.sourceUrl}
                onChange={(event) => setForm((current) => ({ ...current, sourceUrl: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="https://..."
                required
              />
              <textarea
                value={form.alt}
                onChange={(event) => setForm((current) => ({ ...current, alt: event.target.value }))}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="Alt text descriptivo"
              />
              <input
                type="text"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="Categoria"
              />

              {uploadError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {uploadError}
                </div>
              ) : null}
              {uploadDone ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {uploadDone}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={createAssetMutation.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1fa5a3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#188b89] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ImagePlus className="h-4 w-4" />
                {createAssetMutation.isPending ? 'Enviando...' : 'Registrar imagen'}
              </button>
            </form>
          </section>
        </aside>
      </div>
    </PortalPageShell>
  );
}
