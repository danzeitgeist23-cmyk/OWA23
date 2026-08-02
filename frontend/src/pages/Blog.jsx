import React from 'react';
import { blogPosts } from '../mock';
import { ArrowUpRight } from 'lucide-react';

export default function Blog() {
  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[#f4623a] text-sm font-semibold tracking-widest uppercase mb-2">Blog</p>
          <h1 className="text-4xl md:text-6xl font-bold text-[#14213d]" style={{ fontFamily: 'Playfair Display' }}>
            Stories, tips & <span className="italic font-medium">guides</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Inspiración, consejos y guías para descubrir las Islas Canarias como un local.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((p) => (
            <article key={p.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 owa-card shadow-[0_10px_30px_-15px_rgba(11,33,61,0.15)]">
                <img src={p.image} alt="" className="w-full h-full object-cover owa-card-image" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-white/95 text-[11px] font-bold tracking-wider text-[#0b7285]">{p.category}</span>
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-[#0b7285]" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2">{p.date}</p>
              <h3 className="text-xl font-semibold text-[#14213d] group-hover:text-[#0b7285] leading-snug" style={{ fontFamily: 'Manrope' }}>{p.title}</h3>
              <p className="text-gray-500 mt-2 leading-relaxed">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
