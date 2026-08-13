import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Search, Users, Minus, Plus, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useT } from '../i18n/LanguageContext';
import { destinations } from '../mock';

const heroImage = 'https://images.unsplash.com/photo-1602523034192-56b472acfb94?auto=format&fit=crop&w=2000&q=80';

export default function Hero() {
  const navigate = useNavigate();
  const t = useT();
  const [island, setIsland] = useState('');
  const [query, setQuery] = useState('');
  const [date, setDate] = useState();
  const [participants, setParticipants] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (island) params.set('destination', island);
    if (query.trim()) params.set('q', query.trim());
    if (date) params.set('from', format(date, 'yyyy-MM-dd'));
    if (participants) params.set('participants', String(participants));
    navigate(`/activities?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="OWA Adventure" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="relative z-10 max-w-6xl w-full px-5 md:px-8 pt-24 pb-10 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white text-xs md:text-sm tracking-widest font-medium mb-6 animate-fadeup">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8a25a]" /> {t('hero.eyebrow')}
        </span>
        <h1 className="text-white text-[46px] md:text-[76px] leading-[1.05] font-bold animate-fadeup">
          {t('hero.title')}<br />
          <span className="italic font-medium text-white/90">{t('hero.subtitle')}</span>
        </h1>
        <p className="mt-6 text-white/85 text-lg md:text-xl max-w-2xl animate-fadeup">
          {t('hero.description')}
        </p>

        {/* Search Bar — civitatis style: stacked on mobile (rounded cards), pill on desktop */}
        <div className="mt-12 w-full max-w-5xl bg-white rounded-2xl md:rounded-full search-shadow p-1.5 flex flex-col md:flex-row items-stretch gap-1 animate-fadeup">
          {/* Island */}
          <div className="relative min-w-0 flex-1">
            <div className="flex items-center gap-3 px-4 py-3.5 md:py-4 rounded-xl md:rounded-full hover:bg-[#f7f9fb] focus-within:bg-[#f7f9fb] transition-colors">
              <MapPin className="w-5 h-5 text-[#1fa5a3] flex-shrink-0" />
              <div className="min-w-0 flex-1 text-left">
                <label htmlFor="hero-island" className="block text-[10px] uppercase tracking-[0.14em] font-semibold text-[#14213d]">Isla</label>
                <select
                  id="hero-island"
                  value={island}
                  onChange={(e) => setIsland(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-[15px] text-[#14213d] focus:outline-none cursor-pointer"
                >
                  <option value="">Todas las islas</option>
                  {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px bg-gray-200 my-3" />

          {/* Activity or place */}
          <div className="relative min-w-0 flex-[1.7]">
            <div className="flex items-center gap-3 px-4 py-3.5 md:py-4 rounded-xl md:rounded-full hover:bg-[#f7f9fb] focus-within:bg-[#f7f9fb] transition-colors">
              <Search className="w-5 h-5 text-[#1fa5a3] flex-shrink-0" />
              <div className="min-w-0 flex-1 text-left">
                <label htmlFor="hero-q" className="block text-[10px] uppercase tracking-[0.14em] font-semibold text-[#14213d]">{t('hero.searchActivity')}</label>
                <input
                  id="hero-q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={t('hero.searchActivityPlaceholder')}
                  className="w-full bg-transparent border-0 p-0 text-[15px] text-[#14213d] placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px bg-gray-200 my-3" />

          {/* Date */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 md:py-4 rounded-xl md:rounded-full text-left hover:bg-[#f7f9fb] transition-colors">
                <CalendarIcon className="w-5 h-5 text-[#1fa5a3] flex-shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.14em] font-semibold text-[#14213d]">{t('hero.searchDate')}</span>
                  <span className="block truncate text-[15px] text-gray-500">
                    {date ? format(date, 'd MMM yyyy', { locale: es }) : t('hero.searchAnyDate')}
                  </span>
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} locale={es} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} />
            </PopoverContent>
          </Popover>

          <div className="hidden md:block w-px bg-gray-200 my-3" />

          {/* Participants */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 md:py-4 rounded-xl md:rounded-full text-left hover:bg-[#f7f9fb] transition-colors">
                <Users className="w-5 h-5 text-[#1fa5a3] flex-shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.14em] font-semibold text-[#14213d]">{t('hero.searchParticipants')}</span>
                  <span className="block truncate text-[15px] text-gray-500">{participants} {t('hero.searchPeople')}</span>
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4" align="start">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#14213d]">{t('hero.searchParticipants')}</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setParticipants((n) => Math.max(1, n - 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#14213d] hover:border-[#1fa5a3] hover:text-[#1fa5a3]" aria-label="menos">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-5 text-center font-semibold">{participants}</span>
                  <button type="button" onClick={() => setParticipants((n) => Math.min(20, n + 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#14213d] hover:border-[#1fa5a3] hover:text-[#1fa5a3]" aria-label="más">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <button
            onClick={handleSearch}
            className="min-h-14 px-7 md:px-9 mt-2 md:mt-0 md:ml-2 inline-flex items-center justify-center gap-2 rounded-xl md:rounded-full bg-[#c8a25a] text-white font-semibold hover:bg-[#b08c49] transition-colors"
          >
            <Search className="w-4 h-4" /> {t('hero.searchButton')}
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm animate-fadeup">
          <div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#c8a25a]" /> {t('trust.freeCancellation')}</div>
          <div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#c8a25a]" /> {t('trust.deposit')}</div>
          <div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#c8a25a]" /> {t('trust.localGuides')}</div>
        </div>
      </div>

      {/* Wave bottom */}
      <svg className="absolute bottom-0 left-0 right-0 w-full text-white" viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none">
        <path d="M0,60 C300,10 600,90 900,50 C1200,15 1440,70 1440,70 L1440,90 L0,90 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
