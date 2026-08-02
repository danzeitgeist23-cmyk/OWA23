import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar as CalendarIcon, Search, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { destinations } from '../mock';

const heroImage = 'https://images.unsplash.com/photo-1602523034192-56b472acfb94?auto=format&fit=crop&w=2000&q=80';

export default function Hero() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('destination', location);
    if (startDate) params.set('from', format(startDate, 'yyyy-MM-dd'));
    if (endDate) params.set('to', format(endDate, 'yyyy-MM-dd'));
    navigate(`/actividades?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="OWA Adventure" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="relative z-10 max-w-6xl w-full px-5 md:px-8 pt-24 pb-10 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white text-xs md:text-sm tracking-widest font-medium mb-6 animate-fadeup">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f4623a]" /> ORIENT WILD ADVENTURE
        </span>
        <h1 className="text-white text-[46px] md:text-[76px] leading-[1.05] font-bold animate-fadeup"
          style={{ fontFamily: 'Playfair Display' }}
        >
          One Wild Adventure<br />
          <span className="italic font-medium text-white/90">Not for everyone.</span>
        </h1>
        <p className="mt-6 text-white/85 text-lg md:text-xl max-w-2xl animate-fadeup">
          Diseñada para quienes buscan más que un tour típico. Descubre las Islas Canarias por mar, aire y tierra.
        </p>

        {/* Search Bar */}
        <div className="mt-12 w-full max-w-5xl bg-white rounded-full search-shadow p-1.5 pr-1.5 flex flex-col md:flex-row items-stretch gap-1 animate-fadeup">
          <div className="flex-1 flex items-center gap-3 px-5 py-3 md:py-4 rounded-full hover:bg-gray-50">
            <MapPin className="w-5 h-5 text-[#0b7285] flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#14213d]">Destino</div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-0 h-auto p-0 shadow-none text-[15px] text-gray-500 focus:ring-0 hover:bg-transparent">
                  <SelectValue placeholder="¿A dónde vamos?" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden md:block w-px bg-gray-200 my-3" />

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex-1 flex items-center gap-3 px-5 py-3 md:py-4 rounded-full hover:bg-gray-50 text-left">
                <CalendarIcon className="w-5 h-5 text-[#0b7285] flex-shrink-0" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[#14213d]">Ida</div>
                  <div className="text-[15px] text-gray-500">
                    {startDate ? format(startDate, "d MMM yyyy", { locale: es }) : 'Añadir fecha'}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={es} disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} />
            </PopoverContent>
          </Popover>

          <div className="hidden md:flex items-center px-2">
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex-1 flex items-center gap-3 px-5 py-3 md:py-4 rounded-full hover:bg-gray-50 text-left">
                <CalendarIcon className="w-5 h-5 text-[#0b7285] flex-shrink-0" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[#14213d]">Vuelta</div>
                  <div className="text-[15px] text-gray-500">
                    {endDate ? format(endDate, "d MMM yyyy", { locale: es }) : 'Añadir fecha'}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={es} disabled={(d) => d < (startDate || new Date(new Date().setHours(0,0,0,0)))} />
            </PopoverContent>
          </Popover>

          <button
            onClick={handleSearch}
            className="ml-0 md:ml-2 mt-1 md:mt-0 h-14 md:h-auto px-6 md:px-8 bg-[#f4623a] text-white rounded-full font-semibold hover:bg-[#e05027] transition-all flex items-center justify-center gap-2 group"
          >
            <Search className="w-4 h-4" /> Buscar
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm animate-fadeup">
          <div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#f4623a]" /> Cancelación gratis 24h</div>
          <div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#f4623a]" /> Reserva con solo 20%</div>
          <div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#f4623a]" /> Guías locales certificados</div>
        </div>
      </div>

      {/* Wave bottom */}
      <svg className="absolute bottom-0 left-0 right-0 w-full text-white" viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none">
        <path d="M0,60 C300,10 600,90 900,50 C1200,15 1440,70 1440,70 L1440,90 L0,90 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
