import React from 'react';
import { MessageCircle } from 'lucide-react';
import {
  buildGeneralWhatsAppMessage,
  buildWhatsAppUrl,
} from '../lib/whatsapp';

export default function WhatsAppButton({
  message = buildGeneralWhatsAppMessage(),
  className = '',
  label = 'WhatsApp',
  compact = false,
}) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Contactar por WhatsApp: ${label}`}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all ${className}`}
    >
      <MessageCircle className="w-5 h-5 flex-shrink-0" />
      {!compact && <span>{label}</span>}
    </a>
  );
}
