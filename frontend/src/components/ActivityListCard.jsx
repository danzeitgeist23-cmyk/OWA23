import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useT } from '../i18n/LanguageContext';

// Civitatis-style horizontal list row. On mobile it stacks (image on top, then
// the full content INCLUDING the description, then the price block) so the
// description is always visible on phones. On md+ it becomes a 3-column grid:
// image | content | price.
export default function ActivityListCard({ activity }) {
  const { format } = useCurrency();
  const t = useT();

  const description = activity.shortDescription || activity.description;
  const cancellation = activity.cancellationPolicy?.short;
  const discount = activity.originalPrice
    ? Math.round((1 - activity.price / activity.originalPrice) * 100)
    : null;

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_14px_36px_-26px_rgba(11,33,61,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-28px_rgba(11,33,61,0.5)]">
      <Link
        to={`/activity/${activity.id}`}
        className="block min-w-0 md:grid md:grid-cols-[230px_minmax(0,1fr)_170px]"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 md:aspect-auto md:min-h-full">
          <img
            src={activity.image}
            alt={activity.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {activity.featured && (
            <span className="absolute left-3 top-3 rounded-md bg-[#1fa5a3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
              {t('card.featured')}
            </span>
          )}
          {discount ? (
            <span className="absolute right-3 top-3 rounded-md bg-[#c8a25a] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
              -{discount}%
            </span>
          ) : null}
        </div>

        {/* Content (always shown, including description) */}
        <div className="relative z-10 min-w-0 bg-white p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4 flex-shrink-0 text-[#1fa5a3]" />
            <span className="truncate">{activity.location}</span>
          </div>

          <h3 className="mt-2 break-words text-lg font-bold leading-snug text-[#14213d] transition-colors group-hover:text-[#1fa5a3] sm:text-xl">
            {activity.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {activity.rating && activity.reviews > 0 ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#14213d]">
                <Star className="h-4 w-4 fill-[#c8a25a] text-[#c8a25a]" />
                {activity.rating}
                <span className="font-normal text-gray-500">({activity.reviews} {t('card.reviews')})</span>
              </span>
            ) : (
              <span className="font-semibold text-[#1fa5a3]">{t('card.noReviews')}</span>
            )}
            {activity.duration && (
              <span className="inline-flex items-center gap-1.5 text-gray-500">
                <Clock className="h-4 w-4" />
                {activity.duration}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-4 break-words text-sm leading-relaxed text-gray-600 line-clamp-3">
              {description}
            </p>
          )}

          {cancellation && (
            <div className="mt-4 flex min-w-0 items-start gap-2 text-xs font-medium text-gray-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1fa5a3]" />
              <span className="min-w-0 break-words">{cancellation}</span>
            </div>
          )}
        </div>

        {/* Price / CTA */}
        <div className="flex flex-col items-stretch gap-4 border-t border-gray-100 bg-[#fbfcfd] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 md:flex-col md:items-end md:justify-end md:border-l md:border-t-0 md:p-6">
          <div className="text-left md:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">{t('card.from')}</p>
            <div className="mt-1 flex items-baseline gap-2 md:justify-end">
              <span className="text-2xl font-bold text-[#1fa5a3]">{format(activity.price)}</span>
              {activity.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{format(activity.originalPrice)}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-400">{t('card.perPerson')}</p>
          </div>
          <span className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c8a25a] px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-[#b08c49]">
            {t('card.viewDetails')}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
