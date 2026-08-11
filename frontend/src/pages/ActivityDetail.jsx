import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { activities } from '../siteData';
import { apiRequest } from '../lib/api';
import { Calendar } from '../components/ui/calendar';
import { Checkbox } from '../components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCurrency } from '../context/CurrencyContext';
import {
  Star, MapPin, Clock, Users, Calendar as CalendarIcon, Check, X,
  ShieldCheck, Award, ChevronLeft, ChevronRight, Share2, Heart,
} from 'lucide-react';

function buildTicketTypes(activity) {
  if (Array.isArray(activity?.ticketTypes) && activity.ticketTypes.length > 0) {
    return activity.ticketTypes;
  }

  const adultPrice = Number(activity?.price || 0);
  return [
    { id: 'adult', label: 'Adultos', price: adultPrice, min: 1, max: 12, default: 2 },
    { id: 'child', label: 'Ninos', price: Number((adultPrice * 0.6).toFixed(2)), min: 0, max: 12, default: 0 },
  ];
}

function initialQuantities(activity) {
  return Object.fromEntries(buildTicketTypes(activity).map((ticket) => [ticket.id, ticket.default || 0]));
}

function priceDecimals(amount) {
  return Number(amount) % 1 ? 2 : 0;
}

export default function ActivityDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { currency, format: formatPrice, formatText } = useCurrency();
  const activity = activities.find((item) => item.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [date, setDate] = useState();
  const [quantities, setQuantities] = useState(() => initialQuantities(activity));
  const [timeSlot, setTimeSlot] = useState(activity?.timeSlots?.[0] || '10:00');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setQuantities(initialQuantities(activity));
    setTimeSlot(activity?.timeSlots?.[0] || '10:00');
    setAcceptedTerms(false);
  }, [activity]);

  const ticketTypes = useMemo(() => buildTicketTypes(activity), [activity]);
  const totalPrice = useMemo(
    () => ticketTypes.reduce(
      (total, ticket) => total + ticket.price * (quantities[ticket.id] || 0),
      0
    ),
    [quantities, ticketTypes]
  );

  if (!activity) {
    return (
      <div className="pt-40 pb-20 text-center">
        <p>Actividad no encontrada.</p>
        <Link to="/actividades" className="text-[#1fa5a3] underline">Volver a actividades</Link>
      </div>
    );
  }

  const hasPublicApi = Boolean(process.env.REACT_APP_API_BASE_URL);
  const canPayOnline = activity.bookingEnabled === true && hasPublicApi;
  const paymentReady = activity.bookingEnabled === true;
  const timeSlots = activity.timeSlots?.length ? activity.timeSlots : ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'];
  const gallery = activity.gallery?.length ? activity.gallery : [activity.image];
  const providerUrl = activity.provider?.activityUrl;
  const providerName = activity.provider?.name || 'OWA';
  const cancellationPolicy = activity.cancellationPolicy || {
    short: 'Cancelacion sujeta a confirmacion del operador.',
    details: 'Contactaremos contigo para confirmar disponibilidad y condiciones finales antes de cerrar la reserva.',
    sourceUrl: providerUrl || '',
  };
  const pickupText = activity.pickup || 'Te confirmaremos el punto exacto y las condiciones de recogida tras la reserva.';
  const groupSize = activity.groupSize || 'Grupo reducido';
  const insurance = activity.insurance || 'Incluido';
  const languages = activity.languages || 'ES / EN';
  const restrictions = activity.restrictions || [];
  const hasReviews = activity.rating && activity.reviews > 0;

  const updateQuantity = (ticket, delta) => {
    setQuantities((current) => {
      const nextValue = Math.min(
        ticket.max,
        Math.max(ticket.min, (current[ticket.id] || 0) + delta)
      );
      return { ...current, [ticket.id]: nextValue };
    });
  };

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const handleBook = async () => {
    if (!date) {
      toast({ title: 'Selecciona una fecha', description: 'Por favor elige el dia para tu actividad.' });
      return;
    }
    if (!timeSlot) {
      toast({ title: 'Selecciona una hora', description: 'Elige uno de los horarios disponibles.' });
      return;
    }
    if (totalPrice <= 0) {
      toast({ title: 'Selecciona participantes', description: 'Anade al menos una plaza antes de continuar.' });
      return;
    }

    if (!canPayOnline) {
      toast({
        title: paymentReady ? 'Pago online en preparacion' : 'Solicitud de reserva enviada',
        description: paymentReady
          ? 'La integracion con SumUp ya esta hecha, pero falta publicar el backend seguro y las credenciales reales antes de activarla.'
          : `${activity.title} · ${format(date, 'd MMM yyyy', { locale: es })} · ${timeSlot}`,
      });
      return;
    }

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      toast({ title: 'Completa tus datos', description: 'Necesitamos nombre, email y telefono para gestionar la reserva.' });
      return;
    }
    if (!acceptedTerms) {
      toast({ title: 'Acepta la cancelacion', description: 'Debes aceptar la politica especifica de esta actividad.' });
      return;
    }

    setIsBooking(true);
    try {
      const checkout = await apiRequest('/api/payments/sumup/checkouts', {
        method: 'POST',
        body: JSON.stringify({
          activity_id: activity.id,
          service_date: format(date, 'yyyy-MM-dd'),
          time_slot: timeSlot,
          quantities,
          customer: {
            name: customer.name.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim(),
          },
          accepted_terms: true,
        }),
      });

      window.location.assign(checkout.hosted_checkout_url);
    } catch (error) {
      toast({
        title: 'No se pudo iniciar el pago',
        description: error.message || 'Intentalo de nuevo en unos minutos.',
        variant: 'destructive',
      });
      setIsBooking(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#1fa5a3]">Inicio</Link> / <Link to="/actividades" className="hover:text-[#1fa5a3]">Actividades</Link> / <span className="text-[#14213d]">{activity.title}</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-500 mb-3">
            <MapPin className="w-4 h-4" /><span>{activity.location}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <h1 className="text-3xl md:text-5xl font-bold text-[#14213d] leading-tight max-w-3xl">
              {activity.title}
            </h1>
            <div className="flex items-center gap-3">
              <button aria-label="Compartir actividad" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Share2 className="w-4 h-4" /></button>
              <button aria-label="Guardar actividad" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Heart className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
            {hasReviews ? (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#c8a25a] text-[#c8a25a]" />
                <span className="font-semibold text-[#14213d]">{activity.rating}</span>
                <span className="text-gray-500">({activity.reviews} resenas)</span>
              </div>
            ) : (
              <span className="font-medium text-[#1fa5a3]">Nueva actividad en OWA</span>
            )}
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5 text-gray-600"><Clock className="w-4 h-4" /> {activity.duration}</div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5 text-gray-600"><Award className="w-4 h-4" /> {paymentReady ? 'Operador local verificado' : 'Reserva bajo peticion'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 mb-12">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
            <img src={gallery[selectedImage]} alt={activity.title} className="w-full h-full object-cover" />
            {gallery.length > 1 && (
              <>
                <button aria-label="Imagen anterior" onClick={() => setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button aria-label="Imagen siguiente" onClick={() => setSelectedImage((selectedImage + 1) % gallery.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {gallery.slice(0, 2).concat(gallery.length < 2 ? [gallery[0]] : []).slice(0, 2).map((img, index) => (
              <button key={`${img}-${index}`} aria-label={`Ver imagen ${index + 1}`} onClick={() => setSelectedImage(index)} className="relative aspect-[16/10] md:aspect-auto rounded-2xl overflow-hidden bg-gray-100">
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          <div>
            <Tabs defaultValue="desc" className="w-full">
              <TabsList className="bg-transparent p-0 h-auto border-b border-gray-200 rounded-none w-full justify-start gap-6">
                {['desc', 'incluido', 'punto', 'resenas'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="px-0 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#1fa5a3] data-[state=active]:text-[#1fa5a3] data-[state=active]:shadow-none font-medium"
                  >
                    {tab === 'desc' && 'Descripcion'}
                    {tab === 'incluido' && 'Que incluye'}
                    {tab === 'punto' && 'Punto de encuentro'}
                    {tab === 'resenas' && `Resenas (${activity.reviews || 0})`}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="desc" className="pt-8">
                <h3 className="text-2xl font-semibold mb-4">Sobre la experiencia</h3>
                <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="p-4 rounded-xl bg-[#f7f9fb]">
                    <Clock className="w-5 h-5 text-[#1fa5a3] mb-2" />
                    <div className="text-xs text-gray-500">Duracion</div>
                    <div className="font-semibold">{activity.duration}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f9fb]">
                    <Users className="w-5 h-5 text-[#1fa5a3] mb-2" />
                    <div className="text-xs text-gray-500">Grupo</div>
                    <div className="font-semibold">{groupSize}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f9fb]">
                    <ShieldCheck className="w-5 h-5 text-[#1fa5a3] mb-2" />
                    <div className="text-xs text-gray-500">Seguro</div>
                    <div className="font-semibold">{insurance}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f9fb]">
                    <Award className="w-5 h-5 text-[#1fa5a3] mb-2" />
                    <div className="text-xs text-gray-500">Idiomas</div>
                    <div className="font-semibold">{languages}</div>
                  </div>
                </div>

                <div className="mt-8 p-5 rounded-xl bg-[#f7f9fb]">
                  <h4 className="font-semibold text-[#14213d] mb-2">Politica de cancelacion</h4>
                  <p className="text-gray-600">{cancellationPolicy.details}</p>
                  {cancellationPolicy.sourceUrl && (
                    <a href={cancellationPolicy.sourceUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 text-sm font-semibold text-[#1fa5a3] hover:text-[#c8a25a]">
                      Ver condiciones del proveedor →
                    </a>
                  )}
                </div>

                {restrictions.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-semibold text-[#14213d] mb-4">Requisitos importantes</h4>
                    <ul className="space-y-3">
                      {restrictions.map((restriction) => (
                        <li key={restriction} className="flex items-start gap-2 text-gray-600">
                          <Check className="w-5 h-5 text-[#1fa5a3] flex-shrink-0 mt-0.5" /> {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="incluido" className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4 text-[#14213d]">Incluido</h4>
                    <ul className="space-y-3">
                      {(activity.included || []).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-gray-600">
                          <Check className="w-5 h-5 text-[#1fa5a3] flex-shrink-0 mt-0.5" /> {formatText(item)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 text-[#14213d]">No incluido</h4>
                    <ul className="space-y-3">
                      {(activity.notIncluded || []).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-gray-600">
                          <X className="w-5 h-5 text-[#c8a25a] flex-shrink-0 mt-0.5" /> {formatText(item)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="punto" className="pt-8">
                <h4 className="font-semibold mb-4 text-[#14213d]">Donde nos encontramos</h4>
                <p className="text-gray-600 mb-2">{activity.meetingPoint}</p>
                <p className="text-sm text-gray-500 mb-4">{pickupText}</p>
                {providerUrl && (
                  <p className="text-sm text-gray-500 mb-5">
                    Operador: <a href={providerUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#1fa5a3] hover:text-[#c8a25a]">{providerName}</a>
                  </p>
                )}
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <iframe
                    title="map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${activity.meetingPoint}, Islas Canarias`)}&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </TabsContent>

              <TabsContent value="resenas" className="pt-8">
                {hasReviews ? (
                  <div className="p-8 rounded-xl bg-[#f7f9fb] text-center">
                    <Star className="w-7 h-7 text-[#c8a25a] mx-auto mb-3" />
                    <h4 className="font-semibold text-[#14213d]">{activity.rating} sobre 5</h4>
                    <p className="text-gray-500 mt-2">{activity.reviews} resenas mostradas por el proveedor. Publicaremos resenas verificadas propias cuando haya reservas directas en OWA.</p>
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-[#f7f9fb] text-center">
                    <Star className="w-7 h-7 text-[#c8a25a] mx-auto mb-3" />
                    <h4 className="font-semibold text-[#14213d]">Nueva actividad en OWA</h4>
                    <p className="text-gray-500 mt-2">Publicaremos resenas verificadas cuando se completen las primeras reservas.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_20px_50px_-15px_rgba(11,33,61,0.15)] p-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-gray-500">Desde</span>
                <span className="text-3xl font-bold text-[#1fa5a3]">{formatPrice(activity.price, { decimals: priceDecimals(activity.price) })}</span>
                <span className="text-sm text-gray-500">/ {activity.priceUnit || 'persona'}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">Fecha</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-left hover:border-[#1fa5a3]">
                        <CalendarIcon className="w-4 h-4 text-[#1fa5a3]" />
                        <span className={date ? 'text-[#14213d]' : 'text-gray-400'}>
                          {date ? format(date, 'd MMM yyyy', { locale: es }) : 'Selecciona fecha'}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} locale={es} disabled={(calendarDate) => calendarDate < new Date(new Date().setHours(0, 0, 0, 0))} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">Hora</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTimeSlot(slot)}
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                          timeSlot === slot ? 'bg-[#1fa5a3] text-white border-[#1fa5a3]' : 'bg-white text-[#14213d] border-gray-200 hover:border-[#1fa5a3]'
                        }`}
                      >{slot}</button>
                    ))}
                  </div>
                </div>

                <div className={`grid gap-3 ${ticketTypes.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {ticketTypes.map((ticket) => {
                    const quantity = quantities[ticket.id] || 0;
                    return (
                      <div key={ticket.id}>
                        <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">
                          {ticket.label}
                        </label>
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            aria-label={`Quitar ${ticket.label}`}
                            disabled={quantity <= ticket.min}
                            onClick={() => updateQuantity(ticket, -1)}
                            className="px-3 py-2 text-gray-500 hover:text-[#1fa5a3] disabled:opacity-30"
                          >-</button>
                          <span className="flex-1 text-center font-semibold">{quantity}</span>
                          <button
                            aria-label={`Anadir ${ticket.label}`}
                            disabled={quantity >= ticket.max}
                            onClick={() => updateQuantity(ticket, 1)}
                            className="px-3 py-2 text-gray-500 hover:text-[#1fa5a3] disabled:opacity-30"
                          >+</button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">{formatPrice(ticket.price, { decimals: priceDecimals(ticket.price) })} cada uno</p>
                      </div>
                    );
                  })}
                </div>

                {paymentReady && (
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label htmlFor="booking-name" className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">Nombre completo</label>
                      <input id="booking-name" value={customer.name} onChange={(event) => updateCustomer('name', event.target.value)} autoComplete="name" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1fa5a3]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="booking-email" className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">Email</label>
                        <input id="booking-email" type="email" value={customer.email} onChange={(event) => updateCustomer('email', event.target.value)} autoComplete="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1fa5a3]" />
                      </div>
                      <div>
                        <label htmlFor="booking-phone" className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">Telefono</label>
                        <input id="booking-phone" type="tel" value={customer.phone} onChange={(event) => updateCustomer('phone', event.target.value)} autoComplete="tel" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1fa5a3]" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                  {ticketTypes.map((ticket) => {
                    const quantity = quantities[ticket.id] || 0;
                    if (!quantity) return null;
                    return (
                      <div key={ticket.id} className="flex justify-between text-gray-600">
                        <span>{formatPrice(ticket.price, { decimals: priceDecimals(ticket.price) })} × {quantity} {ticket.label.toLowerCase()}</span>
                        <span>{formatPrice(ticket.price * quantity, { decimals: priceDecimals(ticket.price * quantity) })}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                    <span className="text-[#14213d]">Total</span>
                    <span className="text-[#1fa5a3]">{formatPrice(totalPrice, { decimals: priceDecimals(totalPrice) })}</span>
                  </div>
                  {paymentReady && currency !== (activity.paymentCurrency || 'EUR') && (
                    <p className="text-xs text-gray-500">El importe definitivo se procesa en EUR al precio oficial del proveedor.</p>
                  )}
                </div>

                {paymentReady ? (
                  <label htmlFor="accept-cancellation" className="flex items-start gap-2 cursor-pointer text-xs text-gray-600 leading-relaxed">
                    <Checkbox id="accept-cancellation" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked === true)} className="mt-0.5" />
                    <span>Acepto la politica de esta actividad: {cancellationPolicy.short}</span>
                  </label>
                ) : (
                  <p className="text-xs text-gray-500">{cancellationPolicy.short}</p>
                )}

                <button
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full py-3.5 bg-[#c8a25a] hover:bg-[#b08c49] text-white rounded-full font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {canPayOnline
                    ? (isBooking ? 'Abriendo SumUp...' : 'Pagar de forma segura con SumUp')
                    : (paymentReady ? 'Pago online en preparacion' : 'Solicitar reserva')}
                </button>
                <p className="text-xs text-center text-gray-500">
                  {canPayOnline
                    ? `${cancellationPolicy.short} · Pago total en EUR`
                    : (paymentReady
                      ? 'El checkout ya esta integrado. Falta publicar el backend seguro y las credenciales reales.'
                      : 'Te contactaremos para confirmar disponibilidad y condiciones finales.')}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
