import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../mock';
import { ArrowUpRight } from 'lucide-react';
import { useT } from '../i18n/LanguageContext';

export default function Stories() {
  const t = useT();

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[#c8a25a] text-sm font-semibold tracking-widest uppercase mb-2">{t('blog.eyebrow')}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#14213d]">
              {t('blog.title')}
            </h2>
          </div>
          <Link to="/blog" className="text-[#1fa5a3] font-semibold hover:text-[#c8a25a] transition-colors self-start md:self-end">
            {t('blog.viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(0, 6).map((p) => (
            <article key={p.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 owa-card shadow-[0_10px_30px_-15px_rgba(11,33,61,0.15)]">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover owa-card-image" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md bg-white/95 text-[11px] font-bold tracking-wider text-[#1fa5a3]">{p.category}</span>
                </div>
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-[#1fa5a3]" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2">{p.date}</p>
              <h3 className="text-xl font-semibold text-[#14213d] group-hover:text-[#1fa5a3] transition-colors leading-snug">
                {p.title}
              </h3>
              <p className="text-gray-500 mt-2 leading-relaxed line-clamp-2">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
