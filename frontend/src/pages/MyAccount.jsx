import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, CreditCard, LogOut, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react';
import PortalPageShell from '../components/PortalPageShell';
import { fetchCurrentUser, fetchMyBookings, getCurrentSession, logoutUser } from '../lib/portalApi';
import { getSessionEventName, hasAuthSession } from '../lib/api';

const euroFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

const statusLabels = {
  confirmed: 'Confirmada',
  payment_pending: 'Pago pendiente',
  payment_failed: 'Pago fallido',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
};

export default function MyAccount() {
  const [session, setSession] = useState(getCurrentSession());
  const [logoutDone, setLogoutDone] = useState(false);
  const isLoggedIn = hasAuthSession();

  useEffect(() => {
    const syncSession = () => setSession(getCurrentSession());
    const sessionEvent = getSessionEventName();

    window.addEventListener(sessionEvent, syncSession);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener(sessionEvent, syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const userQuery = useQuery({
    queryKey: ['account', 'user'],
    queryFn: fetchCurrentUser,
    enabled: isLoggedIn,
    initialData: session.user,
  });

  const bookingsQuery = useQuery({
    queryKey: ['account', 'bookings'],
    queryFn: fetchMyBookings,
    enabled: isLoggedIn,
    initialData: [],
  });

  const user = userQuery.data || session.user;
  const bookings = bookingsQuery.data || [];

  const handleLogout = () => {
    logoutUser();
    setSession(getCurrentSession());
    setLogoutDone(true);
  };

  if (!isLoggedIn) {
    return (
      <PortalPageShell
        eyebrow="Mi cuenta"
        title="Panel listo para conectar con auth real"
        description="La estructura del area privada ya esta preparada. Cuando conectes el backend, aqui podras mostrar reservas, pagos y datos del cliente."
        widthClassName="max-w-4xl"
      >
        <div className="rounded-[30px] border border-white/70 bg-white/90 p-8 md:p-10 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.28)]">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#14213d]">No hay sesion activa</h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Puedes entrar con el endpoint de login cuando este cableado o seguir usando checkout publico sin afectar el resto de rutas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/login" className="rounded-full bg-[#14213d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f1a31]">
                Iniciar sesion
              </Link>
              <Link to="/register" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-[#14213d] transition hover:border-[#1fa5a3] hover:text-[#1fa5a3]">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </PortalPageShell>
    );
  }

  return (
    <PortalPageShell
      eyebrow="Area privada"
      title={user?.name ? `Hola, ${user.name}` : 'Mi cuenta'}
      description="Vista ligera para cliente o admin con resumen de perfil, reservas y accesos rapidos a la libreria visual."
      actions={(
        <>
          <Link to="/admin/media" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#14213d] transition hover:border-[#1fa5a3] hover:text-[#1fa5a3]">
            Media library
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full bg-[#14213d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f1a31]"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </>
      )}
    >
      {logoutDone ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Sesion cerrada correctamente.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-7 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.24)]">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14213d] text-white">
              <UserRound className="h-6 w-6 text-[#c8a25a]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#14213d]">Perfil</h2>
              <p className="mt-1 text-sm text-slate-500">Datos minimos para gestion de reservas.</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {[
              { icon: Mail, label: 'Email', value: user?.email || 'Pendiente de backend' },
              { icon: Phone, label: 'Telefono', value: user?.phone || 'Pendiente de backend' },
              { icon: ShieldCheck, label: 'Rol', value: user?.role || 'customer' },
              { icon: MapPin, label: 'Empresa', value: user?.company || 'Cliente directo' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <item.icon className="h-5 w-5 text-[#1fa5a3]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-[#14213d]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/90 p-7 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.24)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#14213d]">Mis reservas</h2>
              <p className="mt-1 text-sm text-slate-500">Lista preparada para historial, futuras salidas y estados de pago.</p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {bookingsQuery.isFetching ? 'Actualizando' : `${bookings.length} items`}
            </div>
          </div>

          {bookingsQuery.isError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {bookingsQuery.error.message || 'No se pudieron cargar las reservas.'}
            </div>
          ) : null}

          {bookings.length === 0 && !bookingsQuery.isLoading ? (
            <div className="mt-8 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-[#1fa5a3]" />
              <h3 className="mt-4 text-xl font-semibold text-[#14213d]">Sin reservas todavia</h3>
              <p className="mt-2 text-sm text-slate-500">
                En cuanto el backend devuelva reservas, esta vista mostrara proximas actividades, importes y estados.
              </p>
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1fa5a3]">
                      {statusLabels[booking.status] || booking.status}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-[#14213d]">{booking.title}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#c8a25a]" />
                        {booking.date || 'Fecha pendiente'}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-[#c8a25a]" />
                        {booking.amount > 0 ? euroFormatter.format(booking.amount) : 'Importe pendiente'}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Referencia</p>
                    <p className="mt-1 text-sm font-medium text-[#14213d]">{booking.id}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PortalPageShell>
  );
}
