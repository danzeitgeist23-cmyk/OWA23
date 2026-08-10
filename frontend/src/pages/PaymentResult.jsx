import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, RefreshCw, XCircle } from 'lucide-react';
import { apiRequest } from '../lib/api';

const euroFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

const statusContent = {
  confirmed: {
    icon: CheckCircle2,
    iconClass: 'text-[#1fa5a3]',
    title: 'Pago confirmado',
    description: 'Tu reserva ha quedado registrada. Conserva esta página como referencia.',
  },
  payment_failed: {
    icon: XCircle,
    iconClass: 'text-red-500',
    title: 'El pago no se ha completado',
    description: 'SumUp ha indicado que el pago ha fallado. Puedes volver a la actividad e intentarlo de nuevo.',
  },
  payment_expired: {
    icon: XCircle,
    iconClass: 'text-[#c8a25a]',
    title: 'El enlace de pago ha caducado',
    description: 'Vuelve a la actividad para crear una nueva reserva.',
  },
  payment_pending: {
    icon: Clock3,
    iconClass: 'text-[#c8a25a]',
    title: 'Estamos verificando el pago',
    description: 'SumUp todavía no ha confirmado el resultado. Actualiza el estado dentro de unos segundos.',
  },
};

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      setError('Falta el identificador de la reserva.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await apiRequest(`/api/payments/sumup/bookings/${encodeURIComponent(bookingId)}`);
      setBooking(result);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo consultar la reserva.');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const state = booking
    ? (statusContent[booking.status] || statusContent.payment_pending)
    : statusContent.payment_pending;
  const StatusIcon = state.icon;

  return (
    <div className="pt-32 pb-24 bg-[#f7f9fb] min-h-screen">
      <div className="max-w-2xl mx-auto px-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_20px_50px_-15px_rgba(11,33,61,0.15)] p-8 md:p-10 text-center">
          {loading ? (
            <>
              <RefreshCw className="w-12 h-12 text-[#1fa5a3] mx-auto mb-5 animate-spin" />
              <h1 className="text-3xl font-bold text-[#14213d]">Verificando tu reserva</h1>
              <p className="text-gray-500 mt-3">Estamos consultando el estado directamente con SumUp.</p>
            </>
          ) : error ? (
            <>
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-5" />
              <h1 className="text-3xl font-bold text-[#14213d]">No pudimos consultar la reserva</h1>
              <p className="text-gray-500 mt-3">{error}</p>
            </>
          ) : (
            <>
              <StatusIcon className={`w-12 h-12 mx-auto mb-5 ${state.iconClass}`} />
              <h1 className="text-3xl font-bold text-[#14213d]">{state.title}</h1>
              <p className="text-gray-500 mt-3">{state.description}</p>

              <div className="mt-8 text-left rounded-xl bg-[#f7f9fb] p-5 space-y-3">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Actividad</span>
                  <span className="font-semibold text-[#14213d] text-right">{booking.activity_title}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Fecha y hora</span>
                  <span className="font-semibold text-[#14213d]">{booking.service_date} · {booking.time_slot}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Total</span>
                  <span className="font-semibold text-[#1fa5a3]">{euroFormatter.format(booking.amount)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Referencia</span>
                  <span className="font-mono text-xs text-[#14213d] break-all text-right">{booking.booking_id}</span>
                </div>
              </div>
            </>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            {(!booking || booking.status === 'payment_pending') && (
              <button onClick={loadBooking} disabled={loading} className="px-6 py-3 bg-[#c8a25a] hover:bg-[#b08c49] text-white rounded-full font-semibold transition-all disabled:opacity-60">
                Actualizar estado
              </button>
            )}
            <Link to="/actividades" className="px-6 py-3 border border-gray-200 hover:border-[#1fa5a3] text-[#14213d] rounded-full font-semibold transition-all">
              Ver actividades
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
