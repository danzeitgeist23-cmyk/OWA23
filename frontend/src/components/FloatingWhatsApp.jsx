import React from 'react';
import WhatsAppButton from './WhatsAppButton';

export default function FloatingWhatsApp() {
  return (
    <WhatsAppButton
      label="¿Te ayudamos?"
      className="fixed right-5 bottom-5 z-40 min-h-12 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_12px_28px_-10px_rgba(37,211,102,0.75)] hover:-translate-y-0.5"
    />
  );
}
