export const WHATSAPP_CONTACT = {
  name: 'Andres',
  phoneDisplay: '+34 673 55 27 72',
  phoneInternational: '34673552772',
};

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_CONTACT.phoneInternational}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppMessage() {
  return `Hola Andres, quiero información sobre una experiencia de aventura en Gran Canaria.`;
}

export function buildActivityWhatsAppMessage({
  activity,
  date,
  timeSlot,
  quantities,
}) {
  const selectedTickets = activity.ticketTypes
    .map((ticket) => {
      const quantity = quantities[ticket.id] || 0;
      return quantity ? `${quantity} ${ticket.label.toLowerCase()}` : null;
    })
    .filter(Boolean);

  return [
    'Hola Andres, quiero consultar disponibilidad para esta experiencia:',
    `Actividad: ${activity.title}`,
    `Fecha: ${date || 'por confirmar'}`,
    `Hora: ${timeSlot || 'por confirmar'}`,
    `Participantes: ${selectedTickets.length ? selectedTickets.join(', ') : 'por confirmar'}`,
    '',
    '¿Puedes confirmarme la disponibilidad y los próximos pasos?',
  ].join('\n');
}
