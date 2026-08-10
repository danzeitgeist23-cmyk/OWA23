import React from 'react';
import { useT } from '../i18n/LanguageContext';

// TODO LEGAL: este texto es una base estructural.
// DEBE revisarlo un abogado antes del lanzamiento comercial.
export default function Terms() {
  const t = useT();
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="mb-8 text-4xl font-extrabold text-foreground">
        {t('footer.terms')}
      </h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">1. Scope</h2>
          <p>These terms govern the booking of experiences offered by OWA — Origin Wild Adventure through owawild.com.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">2. Bookings</h2>
          <p>A booking is confirmed once payment of the required deposit is received and a confirmation email has been issued. The customer is responsible for providing accurate contact details.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">3. Prices and taxes</h2>
          <p>{t('footer.taxNote')} Prices are shown per person unless stated otherwise.</p>
        </section>
        <section id="cancellation">
          <h2 className="mb-2 text-xl font-bold text-foreground">4. Cancellation policy</h2>
          <p>Free cancellation up to 24 hours before the scheduled start. Cancellations within 24 hours are non-refundable. If OWA or the operator cancels due to weather or safety conditions, you will be offered a full refund or a date change at no cost.</p>
        </section>
        <section id="safety">
          <h2 className="mb-2 text-xl font-bold text-foreground">5. Safety and liability</h2>
          <p>Customers must follow the operator&apos;s safety instructions at all times and declare any medical condition that may affect participation. OWA acts as an intermediary between the customer and the certified operator delivering the activity.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">6. Governing law</h2>
          <p>These terms are governed by Spanish law. Any dispute shall be submitted to the courts of Las Palmas de Gran Canaria.</p>
        </section>
      </div>
    </main>
  );
}
