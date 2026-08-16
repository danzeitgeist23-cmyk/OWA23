import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Heart } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useT } from '../i18n/LanguageContext';

export default function ActivityCard({ activity }) {
  const [saved, setSaved] = React.useState(false);
  const { format } = useCurrency();
  const t = useT();

  return (
    <Link
      to={`/activity/${activity.id}`}
      className="group block bg-white rounded-2xl overflow-hidden owa-card shadow-[0_10px_30px_-15px_rgba(11,33,61,0.15)] hover:shadow-[0_20px_50px_-15px_rgba(11,33,61,0.28)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={activity.image} alt={activity.title} className="w-full h-full object-cover owa-card-image" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {activity.featured && (
            <span className="px-2.5 py-1 rounded-md bg-[#1fa5a3] text-white text-[11px] font-semibold uppercase tracking-wider">
              {t('card.featured')}
            </span>
          )}
          {activity.originalPrice && (
            <span className="px-2.5 py-1 rounded-md bg-[#c8a25a] text-white text-[11px] font-semibold uppercase tracking-wider">
              -{Math.round((1 - activity.price / activity.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setSaved(!saved);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/70 backdrop-blur flex items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-all"
          aria-label="guardar"
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-[#c8a25a] text-[#c8a25a]' : 'text-[#14213d] dark:text-white'}`} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{activity.location}</span>
        </div>

        <h3 className="text-[17px] font-semibold text-[#14213d] leading-snug min-h-[48px] group-hover:text-[#1fa5a3] transition-colors">
          {activity.title}
        </h3>

        <div className="flex items-center gap-1.5 mt-3 text-sm min-h-6">
          {activity.rating && activity.reviews > 0 ? (
            <>
              <Star className="w-4 h-4 fill-[#c8a25a] text-[#c8a25a]" />
              <span className="font-semibold text-[#14213d]">{activity.rating}</span>
              <span className="text-gray-500">({activity.reviews} {t('card.reviews')})</span>
            </>
          ) : (
            <span className="inline-flex items-center rounded-full bg-[#f7f9fb] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#1fa5a3]">
              {t('card.noReviews')}
            </span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase text-gray-400 tracking-wide font-medium">{t('card.from')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1fa5a3]">{format(activity.price)}</span>
              {activity.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{format(activity.originalPrice)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{activity.duration}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
