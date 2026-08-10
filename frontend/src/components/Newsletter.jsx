import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useT } from '../i18n/LanguageContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const t = useT();

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: t('newsletter.success'),
      description: t('newsletter.description'),
    });
    setEmail('');
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1535262412227-85541e910204?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0b1c26]/70" />
      </div>

      <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center text-white">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c8a25a] mb-6">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold">
          {t('newsletter.title')}
        </h2>
        <p className="mt-4 text-white/70 text-lg">
          {t('newsletter.description')}
        </p>

        <form onSubmit={submit} className="mt-10 max-w-xl mx-auto bg-white rounded-full p-1.5 flex items-center">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            className="flex-1 px-5 py-3 bg-transparent text-[#14213d] outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-6 md:px-8 py-3 bg-[#c8a25a] text-white rounded-full font-semibold hover:bg-[#b08c49] transition-all"
          >
            {t('newsletter.button')}
          </button>
        </form>

        <p className="mt-4 text-white/50 text-sm">{t('newsletter.disclaimer')}</p>
      </div>
    </section>
  );
}
