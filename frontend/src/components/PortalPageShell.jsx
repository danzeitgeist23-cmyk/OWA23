import React from 'react';

export default function PortalPageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  widthClassName = 'max-w-6xl',
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(31,165,163,0.18),_transparent_42%),linear-gradient(180deg,_#f4fbfa_0%,_#ffffff_38%,_#f7f9fb_100%)] pt-32 pb-20">
      <div className={`${widthClassName} mx-auto px-5 md:px-8`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
          <div className="max-w-2xl">
            {eyebrow ? (
              <div className="inline-flex items-center rounded-full border border-[#1fa5a3]/20 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#1fa5a3]">
                {eyebrow}
              </div>
            ) : null}
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-[#14213d] leading-tight">{title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {children}
      </div>
    </div>
  );
}
