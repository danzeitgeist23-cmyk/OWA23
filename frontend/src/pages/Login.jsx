import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import PortalPageShell from '../components/PortalPageShell';
import { LOGIN } from '../constants/testIds';
import { loginUser } from '../lib/portalApi';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextPath = location.state?.from?.pathname || '/mi-cuenta';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginUser({
        email: values.email.trim(),
        password: values.password,
      });

      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'No se pudo iniciar sesion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalPageShell
      eyebrow="Area cliente"
      title="Acceso rapido para clientes y operadores"
      description="Esta base deja lista la entrada a la zona privada sin tocar checkout ni backend. Puedes conectar el login real cuando el endpoint este disponible."
      widthClassName="max-w-5xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-[0_28px_80px_-36px_rgba(11,28,38,0.28)] backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-[#14213d] mb-2">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={values.email}
                data-testid={LOGIN.emailInput}
                onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="login-password" className="block text-sm font-semibold text-[#14213d]">
                  Contrasena
                </label>
                <Link
                  to="/contacto"
                  data-testid={LOGIN.forgotPasswordLink}
                  className="text-sm font-medium text-[#1fa5a3] hover:text-[#158582]"
                >
                  Recuperar acceso
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                value={values.password}
                data-testid={LOGIN.passwordInput}
                onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1fa5a3] focus:ring-4 focus:ring-[#1fa5a3]/10"
                placeholder="Tu contrasena"
                autoComplete="current-password"
                required
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              data-testid={LOGIN.submitButton}
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#14213d] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f1a31] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <KeyRound className="h-4 w-4" />
              {isSubmitting ? 'Accediendo...' : 'Entrar a mi cuenta'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <span>Todavia no tienes cuenta de cliente?</span>
            <Link
              to="/registro"
              data-testid={LOGIN.registerLink}
              className="inline-flex items-center gap-2 font-semibold text-[#1fa5a3]"
            >
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <aside className="rounded-[28px] bg-[#0b1c26] p-8 text-white shadow-[0_28px_80px_-36px_rgba(11,28,38,0.5)]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck className="h-6 w-6 text-[#c8a25a]" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">Lo que ya queda preparado</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-white/78">
            <li>Acceso directo a reservas futuras y datos de perfil.</li>
            <li>Persistencia ligera de sesion en localStorage para iterar rapido.</li>
            <li>Estructura lista para conectar JWT o cookie session desde FastAPI.</li>
          </ul>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a25a]">Backend hook</p>
            <p className="mt-3 text-sm text-white/72">
              Endpoint esperado por defecto: <code className="rounded bg-white/10 px-2 py-1">POST /api/auth/login</code>
            </p>
          </div>
        </aside>
      </div>
    </PortalPageShell>
  );
}
