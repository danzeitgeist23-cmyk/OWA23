import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { activities } from '../mock';
import { Calendar } from '../components/ui/calendar';
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

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { format: formatPrice, formatText } = useCurrency();
  const activity = activities.find((a) => a.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [date, setDate] = useState();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [timeSlot, setTimeSlot] = useState('10:00');

  if (!activity) {
    return (
      <div className="pt-40 pb-20 text-center">
        <p>Actividad no encontrada.</p>
        <Link to="/actividades" className="text-[#1fa5a3] underline">Volver a actividades</Link>
      </div>
    );
  }

  const timeSlots = ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'];
  const gallery = activity.gallery && activity.gallery.length ? activity.gallery : [activity.image];
  const totalPrice = activity.price * adults + activity.price * 0.6 * children;

  const handleBook = () => {
    if (!date) {
      toast({ title: 'Selecciona una fecha', description: 'Por favor elige el día para tu actividad.' });
      return;
    }
    toast({
      title: '¡Reserva confirmada!',
      description: `${activity.title} · ${format(date, "d MMM yyyy", { locale: es })} · ${timeSlot} · ${adults} adultos${children ? ' + ' + children + ' niños' : ''}`,
    });
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#1fa5a3]">Inicio</Link> / <Link to="/actividades" className="hover:text-[#1fa5a3]">Actividades</Link> / <span className="text-[#14213d]">{activity.title}</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-500 mb-3">
            <MapPin className="w-4 h-4" /><span>{activity.location}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <h1 className="text-3xl md:text-5xl font-bold text-[#14213d] leading-tight max-w-3xl">
              {activity.title}
            </h1>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Share2 className="w-4 h-4" /></button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Heart className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-[#c8a25a] text-[#c8a25a]" />
              <span className="font-semibold text-[#14213d]">{activity.rating}</span>
              <span className="text-gray-500">({activity.reviews} reseñas)</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5 text-gray-600"><Clock className="w-4 h-4" /> {activity.duration}</div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5 text-gray-600"><Award className="w-4 h-4" /> Best seller</div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 mb-12">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
            <img src={gallery[selectedImage]} alt="" className="w-full h-full object-cover" />
            {gallery.length > 1 && (
              <>
                <button onClick={() => setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setSelectedImage((selectedImage + 1) % gallery.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {gallery.slice(0, 2).concat(gallery.length < 2 ? [gallery[0]] : []).slice(0, 2).map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className="relative aspect-[16/10] md:aspect-auto rounded-2xl overflow-hidden bg-gray-100">
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          {/* Left */}
          <div>
            <Tabs defaultValue="desc" className="w-full">
              <TabsList className="bg-transparent p-0 h-auto border-b border-gray-200 rounded-none w-full justify-start gap-6">
                {['desc', 'incluido', 'punto', 'reseñas'].map((t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="px-0 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#1fa5a3] data-[state=active]:text-[#1fa5a3] data-[state=active]:shadow-none font-medium"
                  >
                    {t === 'desc' && 'Descripción'}
                    {t === 'incluido' && 'Qué incluye'}
                    {t === 'punto' && 'Punto de encuentro'}
                    {t === 'reseñas' && `Reseñas (${activity.reviews})`}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="desc" className="pt-8">
                <h3 className="text-2xl font-semibold mb-4">Sobre la experiencia</h3>
                <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="p-4 rounded-xl bg-[#f7f9fb]">
                    <Clock className="w-5 h-5 text-[#1fa5a3] mb-2" />
                    <div className="text-xs text-gray-500">Duración</div>
                    <div className="font-semibold">{activity.duration}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f9fb]">
                    <Users className="w-5 h-5 text-[#1fa5a3] mb-2" />
                    <div className="text-xs text-gray-500">Grupo</div>
                    <div className="font-semibold">Máx 8 pers.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f9fb]">
                    <ShieldCheck className="w-5 h-5 text-[#1fa5a3] mb-2" />
                    <div className="text-xs text-gray-500">Seguro</div>
                    <div className="font-semibold">Incluido</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f9fb]">
                    <Award className="w-5 h-5 text-[#1fa5a3] mb-2" />
                    <div className="text-xs text-gray-500">Idiomas</div>
                    <div className="font-semibold">ES / EN</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="incluido" className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4 text-[#14213d]">Incluido</h4>
                    <ul className="space-y-3">
                      {activity.included.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <Check className="w-5 h-5 text-[#1fa5a3] flex-shrink-0 mt-0.5" /> {formatText(i)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 text-[#14213d]">No incluido</h4>
                    <ul className="space-y-3">
                      {activity.notIncluded.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <X className="w-5 h-5 text-[#c8a25a] flex-shrink-0 mt-0.5" /> {formatText(i)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="punto" className="pt-8">
                <h4 className="font-semibold mb-4 text-[#14213d]">Dónde nos encontramos</h4>
                <p className="text-gray-600 mb-4">{activity.meetingPoint}</p>
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <iframe
                    title="map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(activity.meetingPoint + ', Islas Canarias')}&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </TabsContent>

              <TabsContent value="reseñas" className="pt-8">
                <div className="space-y-6">
                  {[1,2,3].map((r) => (
                    <div key={r} className="p-6 rounded-xl bg-[#f7f9fb]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#1fa5a3]/20 flex items-center justify-center text-[#1fa5a3] font-bold text-sm">{['A','D','L'][r-1]}</div>
                        <div>
                          <div className="font-semibold text-[#14213d]">{['Ana P.', 'David M.', 'Lucia F.'][r-1]}</div>
                          <div className="flex gap-1 mt-1">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#c8a25a] text-[#c8a25a]" />)}</div>
                        </div>
                      </div>
                      <p className="text-gray-600">{[
                        'Experiencia única, los guías hicieron que todo fuera perfecto. Sin duda repetiremos.',
                        'Excelente organización, seguridad y unos paisajes que te dejan sin palabras.',
                        'Muy recomendable! Todo puntual y muy profesional. Vale cada euro.',
                      ][r-1]}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_20px_50px_-15px_rgba(11,33,61,0.15)] p-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-gray-500">Desde</span>
                <span className="text-3xl font-bold text-[#1fa5a3]">{formatPrice(activity.price)}</span>
                {activity.originalPrice && (
                  <span className="text-gray-400 line-through">{formatPrice(activity.originalPrice)}</span>
                )}
                <span className="text-sm text-gray-500">/ pers.</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">Fecha</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-left hover:border-[#1fa5a3]">
                        <CalendarIcon className="w-4 h-4 text-[#1fa5a3]" />
                        <span className={date ? 'text-[#14213d]' : 'text-gray-400'}>
                          {date ? format(date, "d MMM yyyy", { locale: es }) : 'Selecciona fecha'}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} locale={es} disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">Hora</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeSlot(t)}
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                          timeSlot === t ? 'bg-[#1fa5a3] text-white border-[#1fa5a3]' : 'bg-white text-[#14213d] border-gray-200 hover:border-[#1fa5a3]'
                        }`}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">Adultos</label>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="px-3 py-2 text-gray-500 hover:text-[#1fa5a3]">-</button>
                      <span className="flex-1 text-center font-semibold">{adults}</span>
                      <button onClick={() => setAdults(adults + 1)} className="px-3 py-2 text-gray-500 hover:text-[#1fa5a3]">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1.5 block">Niños</label>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="px-3 py-2 text-gray-500 hover:text-[#1fa5a3]">-</button>
                      <span className="flex-1 text-center font-semibold">{children}</span>
                      <button onClick={() => setChildren(children + 1)} className="px-3 py-2 text-gray-500 hover:text-[#1fa5a3]">+</button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{formatPrice(activity.price)} × {adults} adultos</span>
                    <span>{formatPrice(activity.price * adults)}</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>{formatPrice(activity.price * 0.6)} × {children} niños</span>
                      <span>{formatPrice(activity.price * 0.6 * children)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                    <span className="text-[#14213d]">Total</span>
                    <span className="text-[#1fa5a3]">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  className="w-full py-3.5 bg-[#c8a25a] hover:bg-[#b08c49] text-white rounded-full font-semibold transition-all"
                >
                  Reservar ahora
                </button>
                <p className="text-xs text-center text-gray-500">Cancelación gratis 24h antes · Solo 20% ahora</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
