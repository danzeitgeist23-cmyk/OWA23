const siteOrigin = (process.env.REACT_APP_SITE_URL || '').replace(/\/+$/, '');

export const defaultSeo = {
  title: 'OWA Wild Adventure',
  description: 'Salidas de naturaleza, avistamiento y experiencias marinas en Canarias con una marca ligera, clara y pensada para convertir.',
  image: '/owa-share-cover.jpg',
  robots: 'index,follow',
  type: 'website',
};

function buildAbsoluteUrl(pathname) {
  const base = siteOrigin || window.location.origin;
  return `${base}${pathname}`;
}

export function getRouteSeo(pathname) {
  const routeMeta = [
    {
      match: (path) => path === '/',
      title: 'OWA Wild Adventure | Actividades marinas en Canarias',
      description: 'Reserva experiencias marinas y escapadas de naturaleza en Canarias con una web ligera, clara y orientada a conversion.',
    },
    {
      match: (path) => path === '/actividades',
      title: 'Actividades | OWA Wild Adventure',
      description: 'Explora actividades de mar y naturaleza con informacion clara, precios visibles y un checkout preparado para venta directa.',
    },
    {
      match: (path) => path.startsWith('/actividad/'),
      title: 'Detalle de actividad | OWA Wild Adventure',
      description: 'Consulta itinerario, imagenes, horarios y reserva online de la actividad seleccionada en OWA.',
    },
    {
      match: (path) => path === '/destinos',
      title: 'Destinos | OWA Wild Adventure',
      description: 'Descubre destinos y zonas de salida de OWA para planificar una escapada marina en Canarias.',
    },
    {
      match: (path) => path === '/blog' || path.startsWith('/blog/'),
      title: 'Blog | OWA Wild Adventure',
      description: 'Guias, noticias y contenido editorial para potenciar el SEO base de OWA con contenido evergreen.',
    },
    {
      match: (path) => path === '/nosotros',
      title: 'Nosotros | OWA Wild Adventure',
      description: 'Conoce la propuesta de valor de OWA, su enfoque local y la experiencia que quiere construir alrededor del mar.',
    },
    {
      match: (path) => path === '/contacto',
      title: 'Contacto | OWA Wild Adventure',
      description: 'Contacta con OWA para soporte, dudas comerciales y coordinacion de experiencias personalizadas.',
    },
    {
      match: (path) => path === '/acceso',
      title: 'Acceso clientes | OWA Wild Adventure',
      description: 'Inicia sesion para ver reservas, datos de cuenta y tu historial de experiencias en OWA.',
      robots: 'noindex,nofollow',
    },
    {
      match: (path) => path === '/registro',
      title: 'Crear cuenta | OWA Wild Adventure',
      description: 'Crea tu cuenta de cliente para centralizar reservas, datos y futuras gestiones.',
      robots: 'noindex,nofollow',
    },
    {
      match: (path) => path === '/mi-cuenta',
      title: 'Mi cuenta | OWA Wild Adventure',
      description: 'Panel ligero de cliente con datos personales, reservas y accesos rapidos.',
      robots: 'noindex,nofollow',
    },
    {
      match: (path) => path === '/admin/media',
      title: 'Media library | OWA Wild Adventure',
      description: 'Vista ligera de libreria visual para revisar imagenes, categorias y metadatos.',
      robots: 'noindex,nofollow',
    },
    {
      match: (path) => path === '/pago/resultado',
      title: 'Resultado del pago | OWA Wild Adventure',
      description: 'Consulta el estado de tu reserva y el resultado del pago en OWA.',
      robots: 'noindex,nofollow',
    },
  ];

  const matchedMeta = routeMeta.find((route) => route.match(pathname));

  return {
    ...defaultSeo,
    ...(matchedMeta || {}),
    canonical: buildAbsoluteUrl(pathname),
  };
}
