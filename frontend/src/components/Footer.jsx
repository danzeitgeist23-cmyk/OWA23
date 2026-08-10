import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b1c26] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <img
                src="%PUBLIC_URL%/owa-logo-footer.webp"
                alt="OWA Wild Adventure"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-white/70 text-[15px] leading-relaxed mb-5">
              Orient Wild Adventure. Diseñada para quienes buscan más que un tour convencional en las Islas Canarias.
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
            <h4 className="text-lg font-semibold mb-5">Compañía</h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li><Link to="/nosotros" className="hover:text-white">Sobre nosotros</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Trabaja con nosotros</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Prensa</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Afiliados</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Ayuda</h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li><Link to="/contacto" className="hover:text-white">Centro de ayuda</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Política de cancelación</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Seguridad y confianza</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Términos y condiciones</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Privacidad</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Contacto</h4>
            <ul className="space-y-4 text-white/70 text-[15px]">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-[#c8a25a] mt-1 flex-shrink-0" />
                <span>Avda. Marítima 24<br />Las Palmas de Gran Canaria, Islas Canarias</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-[#c8a25a] mt-1 flex-shrink-0" />
                <span>+34 928 123 456</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-[#c8a25a] mt-1 flex-shrink-0" />
                <span>hola@owawild.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/50">
          <p>© 2025 OWA — Orient Wild Adventure. Todos los derechos reservados.</p>
          <p>Made with care in the Canary Islands</p>
        </div>
      </div>
    </footer>
  );
}
