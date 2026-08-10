import React from 'react';
import { useT } from '../i18n/LanguageContext';

// TODO LEGAL: este texto es una base estructural.
// DEBE revisarlo un abogado antes del lanzamiento comercial.
export default function Privacy() {
  const t = useT();
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="mb-8 text-4xl font-extrabold text-foreground">
        {t('footer.privacy')}
      </h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">1. Data controller</h2>
          <p>
            OWA — Origin Wild Adventure<br />
            Muelle Deportivo s/n, Puerto Rico de Gran Canaria, 35130<br />
            Canary Islands, Spain<br />
            <a href="mailto:info@owawild.com" className="text-primary">info@owawild.com</a>
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">2. Data we collect</h2>
          <p>Booking data (name, email, phone, date of activity), payment data processed by our payment provider, and technical data (IP, browser, device) for analytics purposes.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">3. Purpose and legal basis</h2>
          <p>We process your data to manage your booking (contract performance), to comply with tax and tourism regulations (legal obligation), and to send marketing communications where you have given consent.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">4. Recipients</h2>
          <p>Your data may be shared with the activity operator strictly to deliver the booked experience, and with our payment and email service providers acting as data processors.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">5. Retention</h2>
          <p>Booking data is retained for the period required by Spanish tax law. Marketing data is retained until you withdraw consent.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-foreground">6. Your rights</h2>
          <p>You may request access, rectification, erasure, restriction, portability or object to processing by writing to <a href="mailto:info@owawild.com" className="text-primary">info@owawild.com</a>. You also have the right to lodge a complaint with the Spanish Data Protection Agency (AEPD).</p>
        </section>
      </div>
    </main>
  );
}
