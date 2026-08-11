import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Twitter, MapPin, Mail } from 'lucide-react';
import { useT } from '../i18n/LanguageContext';

export default function Footer() {
  const t = useT();

  return (
    <footer className="bg-[#0b1c26] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <img
                src="/owa-logo-footer.webp"
                alt="OWA Wild Adventure"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-white/70 text-[15px] leading-relaxed mb-5">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-[#1fa5a3] hover:border-[#1fa5a3] transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-5">{t('footer.company')}</h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li><Link to="/about" className="hover:text-white">{t('footer.about')}</Link></li>
              <li><Link to="/blog" className="hover:text-white">{t('footer.blog')}</Link></li>
              <li><Link to="/contact" className="hover:text-white">{t('footer.careers')}</Link></li>
              <li><Link to="/contact" className="hover:text-white">{t('footer.press')}</Link></li>
              <li><Link to="/contact" className="hover:text-white">{t('footer.affiliates')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-5">{t('footer.help')}</h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li><Link to="/contact" className="hover:text-white">{t('footer.helpCenter')}</Link></li>
              <li><a href="/terms#cancellation" className="hover:text-white">{t('footer.cancellation')}</a></li>
              <li><a href="/terms#safety" className="hover:text-white">{t('footer.safety')}</a></li>
              <li><a href="/terms" className="hover:text-white">{t('footer.terms')}</a></li>
              <li><a href="/privacy" className="hover:text-white">{t('footer.privacy')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-5">{t('footer.contact')}</h4>
            <ul className="space-y-4 text-white/70 text-[15px]">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-[#c8a25a] mt-1 flex-shrink-0" />
                <span>Muelle Deportivo s/n<br />Las Palmas de Gran Canaria, Islas Canarias</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-[#c8a25a] mt-1 flex-shrink-0" />
                <span>info@owawild.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/50">
          <p>© 2025 OWA — Origin Wild Adventure. {t('footer.rights')}</p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
