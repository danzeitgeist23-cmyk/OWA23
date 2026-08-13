import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarCheck, MessageSquare, Ticket, Users } from 'lucide-react';
import PortalPageShell from '../components/PortalPageShell';
import {
  apiEnabled,
  fetchAdminSummary,
  fetchAdminBookings,
  fetchAdminRequests,
  updateBookingStatus,
  updateRequestStatus,
  BOOKING_STATUSES,
  REQUEST_STATUSES,
  STATUS_LABELS,
} from '../lib/adminReservations';

function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4fbfa] text-[#1fa5a3]"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-2xl font-bold text-[#14213d]">{value ?? '—'}</p>
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

function Row({ item, statuses, onChange, pending }) {
  const c = item.customer || {};
  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#14213d]">{item.activity_title || item.activity_id}</p>
        <p className="truncate text-xs text-slate-500">{c.name || 'Sin nombre'} · {c.email || '—'} · {fmtDate(item.service_date)}</p>
      </div>
      <select
        value={item.status}
        disabled={!apiEnabled || pending}
        onChange={(e) => onChange(item.id, e.target.value)}
        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#14213d] outline-none focus:border-[#1fa5a3] disabled:opacity-50"
      >
        {statuses.map((s) => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
      </select>
    </div>
  );
}

export default function AdminReservations() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('bookings');

  const summaryQuery = useQuery({ queryKey: ['admin', 'summary'], queryFn: fetchAdminSummary, enabled: apiEnabled });
  const bookingsQuery = useQuery({ queryKey: ['admin', 'bookings'], queryFn: () => fetchAdminBookings() });
  const requestsQuery = useQuery({ queryKey: ['admin', 'requests'], queryFn: () => fetchAdminRequests() });
  const s = summaryQuery.data;

  const bookingMut = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
  });
  const requestMut = useMutation({
    mutationFn: ({ id, status }) => updateRequestStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'requests'] }),
  });

  const bookings = bookingsQuery.data?.items || [];
  const requests = requestsQuery.data?.items || [];

  return (
    <PortalPageShell
      eyebrow="Admin"
      title="Reservas"
      description="Gestiona reservas online y solicitudes de consulta. Cambia el estado de cada una."
      widthClassName="max-w-6xl"
    >
      {!apiEnabled ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          El backend no está conectado (falta <code>REACT_APP_API_BASE_URL</code>). Al desplegar la API verás aquí las reservas reales.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={Ticket} label="Reservas" value={s?.bookings_total} />
        <SummaryCard icon={CalendarCheck} label="Pagadas" value={s?.bookings_paid} />
        <SummaryCard icon={MessageSquare} label="Solicitudes pend." value={s?.requests_pending} />
        <SummaryCard icon={Users} label="Actividades" value={s?.activities} />
      </div>

      <div className="mt-8 rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.24)]">
        <div className="mb-4 flex gap-2">
          {[['bookings', `Reservas (${bookings.length})`], ['requests', `Solicitudes (${requests.length})`]].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === id ? 'bg-[#1fa5a3] text-white' : 'bg-slate-100 text-slate-600 hover:text-[#1fa5a3]'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'bookings' ? (
          bookings.length ? (
            <div>{bookings.map((b) => <Row key={b.id} item={b} statuses={BOOKING_STATUSES} pending={bookingMut.isPending} onChange={(id, status) => bookingMut.mutate({ id, status })} />)}</div>
          ) : <p className="py-8 text-center text-sm text-slate-500">{apiEnabled ? 'Sin reservas todavía.' : 'Sin datos (backend no conectado).'}</p>
        ) : (
          requests.length ? (
            <div>{requests.map((r) => <Row key={r.id} item={r} statuses={REQUEST_STATUSES} pending={requestMut.isPending} onChange={(id, status) => requestMut.mutate({ id, status })} />)}</div>
          ) : <p className="py-8 text-center text-sm text-slate-500">{apiEnabled ? 'Sin solicitudes todavía.' : 'Sin datos (backend no conectado).'}</p>
        )}
      </div>
    </PortalPageShell>
  );
}
