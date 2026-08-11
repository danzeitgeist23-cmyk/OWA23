import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, UserPlus } from 'lucide-react';
import PortalPageShell from '../components/PortalPageShell';
import { REGISTER } from '../constants/testIds';
import { registerUser } from '../lib/portalApi';

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values.password !== values.passwordConfirm) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await registerUser({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
      });

      navigate('/account', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'No se pudo crear la cuenta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalPageShell
      eyebrow="Nuevo usuario"
      title="Registro simple para ventas directas y recurrencia"
      description="Esta pantalla deja listo el alta de cliente con una UX clara para conectar datos personales, futuras reservas y comunicaciones posteriores."
      widthClassName="max-w-5xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.28)] backdrop-blur">
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="register-name" className="block text-sm font-semibold text-[#14213d] mb-2">
                Nombre completo
              </label>
              <input
                id="register-name"
                type="text"
                value={values.name}
                data-testid={REGISTER.nameInput}
                onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="Nombre y apellidos"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-semibold text-[#14213d] mb-2">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={values.email}
                data-testid={REGISTER.emailInput}
                onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="register-phone" className="block text-sm font-semibold text-[#14213d] mb-2">
                Telefono
              </label>
              <input
                id="register-phone"
                type="tel"
                value={values.phone}
                onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="+34 600 000 000"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-semibold text-[#14213d] mb-2">
                Contrasena
              </label>
              <input
                id="register-password"
                type="password"
                value={values.password}
                data-testid={REGISTER.passwordInput}
                onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="Minimo 8 caracteres"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label htmlFor="register-password-confirm" className="block text-sm font-semibold text-[#14213d] mb-2">
                Repetir contrasena
              </label>
              <input
                id="register-password-confirm"
                type="password"
                value={values.passwordConfirm}
                data-testid={REGISTER.passwordConfirmInput}
                onChange={(event) => setValues((current) => ({ ...current, passwordConfirm: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="Repite la contrasena"
                autoComplete="new-password"
                required
              />
            </div>

            {error ? (
              <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Link
                to="/login"
                data-testid={REGISTER.loginLink}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1fa5a3]"
              >
                Ya tengo cuenta
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="submit"
                data-testid={REGISTER.submitButton}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1fa5a3] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#188b89] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" />
                {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        </section>

        <aside className="rounded-[28px] border border-[#14213d]/10 bg-[#f7f9fb] p-8 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.18)]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14213d] text-white">
            <BadgeCheck className="h-6 w-6 text-[#c8a25a]" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-[#14213d]">Pensado para un onboarding ligero</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <li>Formulario corto para no frenar conversion en mobile.</li>
            <li>Preparado para persistir sesion tras registro y enviar al panel.</li>
            <li>Listo para ampliar con consentimiento marketing o doble opt-in.</li>
          </ul>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1fa5a3]">Backend hook</p>
            <p className="mt-3 text-sm text-slate-600">
              Endpoint esperado por defecto: <code className="rounded bg-slate-100 px-2 py-1">POST /api/auth/register</code>
            </p>
          </div>
        </aside>
      </div>
    </PortalPageShell>
  );
}
