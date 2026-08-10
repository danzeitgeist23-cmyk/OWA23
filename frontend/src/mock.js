// Mock data for OWA - Origin Wild Adventure

export const destinations = [
  {
    id: 'gran-canaria',
    name: 'Gran Canaria',
    activityCount: 24,
    image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fuerteventura',
    name: 'Fuerteventura',
    activityCount: 18,
    image: 'https://images.unsplash.com/photo-1635463498136-96e4df88bac8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tenerife',
    name: 'Tenerife',
    activityCount: 21,
    image: 'https://images.unsplash.com/photo-1671976847791-44be0409b487?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lanzarote',
    name: 'Lanzarote',
    activityCount: 15,
    image: 'https://images.unsplash.com/photo-1643965304951-07a7ebb783a0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'la-palma',
    name: 'La Palma',
    activityCount: 9,
    image: 'https://images.unsplash.com/photo-1605714726527-411541ab17f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'isla-de-lobos',
    name: 'Isla de Lobos',
    activityCount: 5,
    image: 'https://images.unsplash.com/photo-1696454138713-570f884ba261?auto=format&fit=crop&w=800&q=80',
  },
];

export const categories = [
  { id: 'nauticas', name: 'Actividades Náuticas', icon: 'Sailboat' },
  { id: 'buceo', name: 'Buceo & Snorkel', icon: 'Fish' },
  { id: 'aventura', name: 'Aventura & Tierra', icon: 'Mountain' },
  { id: 'aire', name: 'Deportes Aéreos', icon: 'Wind' },
  { id: 'naturaleza', name: 'Naturaleza & Fauna', icon: 'Leaf' },
  { id: 'gastronomia', name: 'Gastronomía', icon: 'UtensilsCrossed' },
];

export const activities = [
  {
    id: 'water-taxi-lobos',
    title: 'Isla de Lobos Escape — Water Taxi Experience',
    location: 'Corralejo, Fuerteventura',
    destination: 'fuerteventura',
    category: 'nauticas',
    price: 17,
    originalPrice: null,
    duration: '2-3 horas',
    rating: 4.9,
    reviews: 127,
    featured: true,
    image: 'https://images.unsplash.com/photo-1696454138713-570f884ba261?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1696454138713-570f884ba261?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1526621480041-c4e2027dfe69?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1571328532572-cb7899a8be7e?auto=format&fit=crop&w=1400&q=80',
    ],
    shortDescription: 'Cruza a la Isla de Lobos en un cómodo water taxi y explora una reserva natural de aguas turquesas.',
    description: 'Descubre uno de los rincones más vírgenes del archipiélago canario. Nuestro water taxi te lleva directamente desde Corralejo hasta la mágica Isla de Lobos, donde tendrás tiempo libre para nadar, hacer snorkel y disfrutar de la reserva natural.',
    included: ['Trayecto en barco ida y vuelta', 'Chaleco salvavidas', 'Guía a bordo', 'Seguro de actividad'],
    notIncluded: ['Comida y bebidas', 'Equipo de snorkel (alquiler disponible)'],
    meetingPoint: 'Puerto de Corralejo, muelle norte',
  },
  {
    id: 'ocean-giants-cruise',
    title: 'Ocean Giants: Atlantic Wildlife Cruise — Gran Canaria',
    location: 'Puerto Rico, Gran Canaria',
    destination: 'gran-canaria',
    category: 'naturaleza',
    price: 40,
    originalPrice: 55,
    duration: '4 horas',
    rating: 4.8,
    reviews: 342,
    featured: true,
    image: 'https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1400&q=80',
    ],
    shortDescription: 'Avistamiento de ballenas y delfines en su hábitat natural con guía biólogo marino.',
    description: 'Embárcate en una expedición de 4 horas por las aguas del Atlántico frente a Gran Canaria. Con más del 98% de éxito en avistamientos, es una experiencia inolvidable para toda la familia.',
    included: ['Bebidas y snacks a bordo', 'Guía biólogo marino', 'Baño en cala secreta', 'Seguro completo'],
    notIncluded: ['Traslado al puerto', 'Propinas'],
    meetingPoint: 'Puerto Rico Marina, Gran Canaria',
  },
  {
    id: 'safari-buggy',
    title: 'Safari Buggy — Barrancos Volcánicos y Cañones del Sur',
    location: 'Maspalomas, Gran Canaria',
    destination: 'gran-canaria',
    category: 'aventura',
    price: 95,
    originalPrice: null,
    duration: '2.5 horas',
    rating: 4.9,
    reviews: 218,
    featured: true,
    image: 'https://images.unsplash.com/photo-1704287824391-b3bc1e04ea33?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1704287824391-b3bc1e04ea33?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1704287994766-3d76e0ca3264?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1698245674677-6267b312d29d?auto=format&fit=crop&w=1400&q=80',
    ],
    shortDescription: 'Conduce un buggy por barrancos volcánicos, cañones y miradores del sur de Gran Canaria.',
    description: 'Vive una aventura off-road única atravesando paisajes volcánicos, cañones ancestrales y miradores impresionantes. Ideal para quienes buscan adrenalina y descubrir la cara salvaje de Gran Canaria.',
    included: ['Buggy 2 plazas', 'Casco y gafas', 'Guía en ruta', 'Fotos incluidas'],
    notIncluded: ['Combustible (aprox 15€)', 'Almuerzo'],
    meetingPoint: 'Base OWA Maspalomas',
  },
  {
    id: 'jet-ski-tenerife',
    title: 'Moto de Agua & Circuito Costero — Tenerife Sur',
    location: 'Los Cristianos, Tenerife',
    destination: 'tenerife',
    category: 'nauticas',
    price: 65,
    originalPrice: 80,
    duration: '1 hora',
    rating: 4.9,
    reviews: 189,
    featured: false,
    image: 'https://images.unsplash.com/photo-1564633351631-e85bd59a91af?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1564633351631-e85bd59a91af?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Pilota una moto de agua Yamaha por la costa sur de Tenerife.',
    description: 'Siente la velocidad y libertad pilotando una moto de agua última generación. Recorre acantilados, playas escondidas y descubre la costa sur de Tenerife como nunca.',
    included: ['Moto de agua Yamaha VX', 'Instructor', 'Chaleco salvavidas', 'Combustible'],
    notIncluded: ['Fotos (opcional 15€)'],
    meetingPoint: 'Marina Los Cristianos',
  },
  {
    id: 'parasailing-lanzarote',
    title: 'Parasailing sobre Playa Blanca — Vuelo Panorámico',
    location: 'Playa Blanca, Lanzarote',
    destination: 'lanzarote',
    category: 'aire',
    price: 55,
    originalPrice: null,
    duration: '45 minutos',
    rating: 4.8,
    reviews: 156,
    featured: false,
    image: 'https://images.unsplash.com/photo-1560419656-c2fe828696af?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1560419656-c2fe828696af?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Vuela a 80 metros sobre el mar con vistas a los Volcanes de Timanfaya.',
    description: 'El parasailing es la mejor forma de admirar Lanzarote desde las alturas. Vuela solo, en pareja o incluso trío sobre las aguas cristalinas frente a Playa Blanca.',
    included: ['Vuelo 15-20 min', 'Equipo homologado', 'Traslado en lancha', 'Foto digital'],
    notIncluded: ['Video HD (opcional 20€)'],
    meetingPoint: 'Muelle deportivo Playa Blanca',
  },
  {
    id: 'banana-boat',
    title: 'Banana Boat & Sofá Volador — Diversión en Familia',
    location: 'Corralejo, Fuerteventura',
    destination: 'fuerteventura',
    category: 'nauticas',
    price: 25,
    originalPrice: null,
    duration: '30 minutos',
    rating: 4.7,
    reviews: 98,
    featured: false,
    image: 'https://images.unsplash.com/photo-1505738313577-5357ff512f16?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1505738313577-5357ff512f16?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Diversión garantizada para toda la familia sobre la clásica banana hinchable.',
    description: 'Un clásico de las vacaciones. Sube a la banana boat con hasta 6 personas y déjate arrastrar por lanchas rápidas por la costa de Corralejo. Risas garantizadas.',
    included: ['30 min de recorrido', 'Chaleco salvavidas', 'Instructor'],
    notIncluded: ['Fotos'],
    meetingPoint: 'Playa de Corralejo Viejo',
  },
  {
    id: 'boat-rental',
    title: 'Alquiler de Barco sin Licencia — Día Completo',
    location: 'Puerto Mogán, Gran Canaria',
    destination: 'gran-canaria',
    category: 'nauticas',
    price: 180,
    originalPrice: 220,
    duration: '8 horas',
    rating: 4.9,
    reviews: 76,
    featured: true,
    image: 'https://images.unsplash.com/photo-1571328532572-cb7899a8be7e?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1571328532572-cb7899a8be7e?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Alquila un barco de recreo sin licencia y navega libremente por la costa sur.',
    description: 'Vive un día en el mar a tu ritmo. Barcos modernos de 40cv sin licencia, aptos para hasta 6 personas. Ideal para calas, snorkel y baño en aguas turquesas.',
    included: ['Barco hasta 6 pers.', 'Combustible incluido', 'Nevera con hielo', 'Ancla y equipo náutico'],
    notIncluded: ['Comida', 'Snorkel (alquiler 5€)'],
    meetingPoint: 'Puerto Mogán',
  },
  {
    id: 'catamaran-sunset',
    title: 'Catamarán al Atardecer con Cena a Bordo',
    location: 'Costa Adeje, Tenerife',
    destination: 'tenerife',
    category: 'nauticas',
    price: 75,
    originalPrice: null,
    duration: '3 horas',
    rating: 4.9,
    reviews: 412,
    featured: true,
    image: 'https://images.unsplash.com/photo-1564555449603-b0eefe1b9094?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1564555449603-b0eefe1b9094?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Vive el atardecer más romántico navegando en catamarán con cena y barra libre.',
    description: 'Navega frente a los acantilados de Los Gigantes mientras el sol se pone. Incluye cena, barra libre de bebidas locales y música en directo.',
    included: ['Cena buffet', 'Barra libre', 'DJ a bordo', 'Baño en cala'],
    notIncluded: ['Traslado'],
    meetingPoint: 'Puerto Colón, Costa Adeje',
  },
  {
    id: 'snorkel-teno',
    title: 'Snorkel en Reserva Marina de Teno',
    location: 'Los Gigantes, Tenerife',
    destination: 'tenerife',
    category: 'buceo',
    price: 45,
    originalPrice: null,
    duration: '3 horas',
    rating: 4.8,
    reviews: 203,
    featured: false,
    image: 'https://images.unsplash.com/photo-1524482131769-b23c0f633d7c?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1524482131769-b23c0f633d7c?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Descubre la biodiversidad marina en la reserva protegida de Teno.',
    description: 'Bucea con tortugas, peces loro, morenas y bancos de sardinas en una de las reservas marinas mejor conservadas de Canarias.',
    included: ['Equipo completo de snorkel', 'Instructor titulado', 'Traslado en lancha', 'Bebida'],
    notIncluded: ['Fotos submarinas'],
    meetingPoint: 'Puerto Los Gigantes',
  },
  {
    id: 'buceo-lanzarote',
    title: 'Bautismo de Buceo en Arrecifes Volcánicos',
    location: 'Puerto del Carmen, Lanzarote',
    destination: 'lanzarote',
    category: 'buceo',
    price: 80,
    originalPrice: null,
    duration: '3 horas',
    rating: 5.0,
    reviews: 145,
    featured: false,
    image: 'https://images.unsplash.com/photo-1658298208155-ab71765747a1?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1658298208155-ab71765747a1?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Tu primera inmersión de buceo con instructor PADI, sin experiencia previa.',
    description: 'Sumérgete hasta 6m con instructor PADI en formaciones volcánicas y cuevas submarinas únicas del atlántico canario.',
    included: ['Equipo completo de buceo', 'Instructor PADI', 'Seguro de buceo', 'Certificado PADI Discover'],
    notIncluded: ['Traslado', 'Fotos'],
    meetingPoint: 'Centro de buceo Puerto del Carmen',
  },
  {
    id: 'kayak-cuevas',
    title: 'Kayak & Cuevas Marinas — Mogán',
    location: 'Puerto Mogán, Gran Canaria',
    destination: 'gran-canaria',
    category: 'nauticas',
    price: 35,
    originalPrice: null,
    duration: '3 horas',
    rating: 4.8,
    reviews: 167,
    featured: false,
    image: 'https://images.unsplash.com/photo-1620903669944-de50fbe78210?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1620903669944-de50fbe78210?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Explora cuevas marinas y calas ocultas remando en kayak transparente.',
    description: 'Recorre acantilados vírgenes, cuevas marinas y bahías escondidas remando en kayak transparente con guía experto.',
    included: ['Kayak individual/doble', 'Chaleco', 'Snorkel', 'Guía + fotos'],
    notIncluded: ['Bebidas'],
    meetingPoint: 'Playa de Mogán',
  },
  {
    id: 'teide-hike',
    title: 'Ascenso al Teide al Amanecer + Estrellas',
    location: 'Parque Nacional del Teide, Tenerife',
    destination: 'tenerife',
    category: 'aventura',
    price: 110,
    originalPrice: 130,
    duration: '10 horas',
    rating: 5.0,
    reviews: 89,
    featured: true,
    image: 'https://images.unsplash.com/photo-1616628950295-d3288bd7a96d?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1616628950295-d3288bd7a96d?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Sube al pico más alto de España al amanecer y observa las estrellas antes.',
    description: 'Una experiencia única: observación astronómica desde 2.400m, cena en refugio de montaña, ascenso nocturno al Teide y amanecer sobre el mar de nubes.',
    included: ['Guía de montaña', 'Cena', 'Permiso Teide', 'Telescopio', 'Traslado'],
    notIncluded: ['Equipo personal'],
    meetingPoint: 'Punto encuentro Puerto de la Cruz',
  },
  {
    id: 'paragliding',
    title: 'Parapente Biplaza sobre Costa Sur',
    location: 'Ifonche, Tenerife',
    destination: 'tenerife',
    category: 'aire',
    price: 120,
    originalPrice: null,
    duration: '1.5 horas',
    rating: 4.9,
    reviews: 74,
    featured: false,
    image: 'https://images.unsplash.com/photo-1620649332832-45f944292179?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1620649332832-45f944292179?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Vuelo tándem en parapente sobre acantilados y mar con piloto certificado.',
    description: 'Despega desde 800m en Ifonche y aterriza en la playa. Vuelo de 20-25 min con piloto profesional. Video HD incluido.',
    included: ['Piloto certificado', 'Equipo completo', 'Video HD + fotos', 'Traslado despegue'],
    notIncluded: ['Traslado desde hotel'],
    meetingPoint: 'Base Ifonche, Adeje',
  },
  {
    id: 'stand-up-paddle',
    title: 'Stand Up Paddle al Atardecer',
    location: 'Sotavento, Fuerteventura',
    destination: 'fuerteventura',
    category: 'nauticas',
    price: 30,
    originalPrice: null,
    duration: '2 horas',
    rating: 4.7,
    reviews: 112,
    featured: false,
    image: 'https://images.unsplash.com/photo-1613857794632-052edbb98d58?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1613857794632-052edbb98d58?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Sesión guiada de SUP en la laguna de Sotavento al atardecer.',
    description: 'Aprende SUP en las aguas tranquilas de la laguna de Sotavento, uno de los mejores spots del mundo, con guía profesional.',
    included: ['Tabla SUP', 'Traje neopreno', 'Instructor', 'Fotos'],
    notIncluded: ['Traslado'],
    meetingPoint: 'Playa Sotavento',
  },
  {
    id: 'wine-tour',
    title: 'Ruta del Vino & Bodegas Volcánicas',
    location: 'La Geria, Lanzarote',
    destination: 'lanzarote',
    category: 'gastronomia',
    price: 60,
    originalPrice: null,
    duration: '5 horas',
    rating: 4.8,
    reviews: 92,
    featured: false,
    image: 'https://images.unsplash.com/photo-1575450411797-d1aed117d091?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1575450411797-d1aed117d091?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'Cata de vinos volcánicos con visita a 3 bodegas históricas.',
    description: 'Descubre el sabor único de los vinos malvasía cultivados en suelo volcánico. Visita 3 bodegas familiares con maridaje canario.',
    included: ['Traslado', 'Guía', '3 bodegas', 'Cata + tapas'],
    notIncluded: ['Compras adicionales'],
    meetingPoint: 'Playa Blanca / Puerto del Carmen',
  },
  {
    id: 'stargazing',
    title: 'Observación de Estrellas — Cielos La Palma',
    location: 'Roque de los Muchachos, La Palma',
    destination: 'la-palma',
    category: 'naturaleza',
    price: 50,
    originalPrice: null,
    duration: '3 horas',
    rating: 4.9,
    reviews: 65,
    featured: false,
    image: 'https://images.unsplash.com/photo-1488330890490-c291ecf62571?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1488330890490-c291ecf62571?auto=format&fit=crop&w=1400&q=80'],
    shortDescription: 'La Palma es Reserva Starlight: observa la Vía Láctea desde el mejor cielo del mundo.',
    description: 'Con guía astrónomo y telescopio profesional observarás planetas, galaxias y nebulosas desde el Roque de los Muchachos, uno de los mejores puntos de observación del planeta.',
    included: ['Telescopio profesional', 'Astrónomo guía', 'Manta térmica', 'Chocolate caliente'],
    notIncluded: ['Traslado'],
    meetingPoint: 'El Paso, La Palma',
  },
];

export const blogPosts = [
  {
    id: 'lobos-guide',
    category: 'GUÍAS',
    title: 'Guía completa para visitar la Isla de Lobos',
    excerpt: 'Todo lo que debes saber antes de embarcar hacia esta joya virgen del Atlántico: rutas, horarios, qué llevar y cómo reservar.',
    image: 'https://images.unsplash.com/photo-1547205725-2a24bf99d0b8?auto=format&fit=crop&w=900&q=80',
    date: '15 Jul 2025',
  },
  {
    id: 'teide-experience',
    category: 'AVENTURA',
    title: 'Amanecer en el Teide: la experiencia definitiva',
    excerpt: 'Nuestros guías te llevan a los 3.718m sobre un mar de nubes. Descubre por qué es la actividad más pedida en Tenerife.',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80',
    date: '08 Jul 2025',
  },
  {
    id: 'ballenas-canarias',
    category: 'NATURALEZA',
    title: '5 especies de ballenas que puedes ver en Canarias',
    excerpt: 'Canarias es santuario de cetáceos. Aprende a reconocerlos y descubre cuándo y dónde avistarlos con más probabilidad.',
    image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=900&q=80',
    date: '01 Jul 2025',
    readTime: '8 min',
    author: 'Equipo OWA',
    tags: ['ballenas', 'cetáceos', 'avistamiento', 'Gran Canaria', 'Tenerife', 'naturaleza'],
    content: `Canarias es uno de los mejores lugares del mundo para el avistamiento de cetáceos. Sus aguas profundas, cercanas a la costa y ricas en nutrientes, convierten al archipiélago en un auténtico santuario natural donde viven o pasan más de **30 especies de cetáceos** durante todo el año. En esta guía te contamos las 5 especies de ballenas más emblemáticas que puedes encontrar, cómo identificarlas y los mejores consejos para que tu experiencia sea inolvidable.

---

## 1. Calderón tropical (Globicephala macrorhynchus) — El residente fiel

El **calderón tropical** (o *pilot whale*) es la estrella indiscutible de las aguas canarias. Es la **especie más avistada** con diferencia: se estima que hay una población residente de unos **400-500 individuos** solo en el suroeste de Tenerife y sur de Gran Canaria, lo que garantiza avistamientos durante todo el año con tasas de éxito superiores al 95 %.

### Cómo reconocerlo
- **Talla:** 4-6 metros (machos hasta 7 m)
- **Color:** Negro intenso o gris muy oscuro
- **Cabeza:** Redondeada, bulbosa, sin pico marcado (de ahí su nombre)
- **Aleta dorsal:** Ancha, redondeada y situada muy atrás, con base muy ancha
- **Comportamiento:** Nadadores lentos, a menudo en reposo en superficie (*logging*); grupos de 10-30 individuos, muy cohesionados

### Dónde y cuándo verlo
- **Zona top:** Canal entre Tenerife y La Gomera, suroeste de Gran Canaria (Puerto Rico, Mogán)
- **Época:** **Todo el año** — es sedentario, no migra
- **Mejor hora:** Mañana temprano (mar más llano) o última hora de la tarde

> **Dato curioso:** Los calderones tropicales son de la familia de los delfines (Delphinidae), no de las ballenas verdaderas. Son extremadamente sociales y tienen dialectos propios por grupo familiar.

---

## 2. Rorcual común (Balaenoptera physalus) — El gigante del Atlántico

El **rorcual común** es el **segundo animal más grande del planeta** (solo superado por la ballena azul). En Canarias no es residente, pero **pasa regularmente** en sus rutas migratorias entre zonas de alimentación en el norte y zonas de cría en el sur.

### Cómo reconocerlo
- **Talla:** 18-24 metros (hembras mayores que machos)
- **Color:** Gris pizarra dorsalmente, blanco ventralmente
- **Cabeza:** En forma de V, asimétrica (mandíbula izquierda gris, derecha blanca)
- **Soplido:** Alto, columnar, 4-6 metros, visible a gran distancia
- **Aleta dorsal:** Pequeña, falcada, situada muy atrás (último tercio)
- **Comportamiento:** Nada rápido, secuencia de 5-8 soplidos seguida de inmersión profunda (5-15 min); rara vez muestra la cola al sumergirse

### Dónde y cuándo verlo
- **Zona top:** Aguas profundas al norte de Gran Canaria, oeste de Fuerteventura, canal entre islas orientales
- **Época:** **Invierno-primavera** (dic-jun) — paso migratorio hacia el norte
- **Mejor hora:** Cualquier hora con buena visibilidad; requiere mar tranquilo (Beaufort ≤ 2)

> **Conservación:** Catalogado como **Vulnerable** (UICN). Canarias es zona de paso crítica; el tráfico marítimo y el ruido submarino son sus mayores amenazas aquí.

---

## 3. Cachalote (Physeter macrocephalus) — El rey de lo profundo

El **cachalote** es el mayor depredador dentado del mundo y el **cetáceo que más profundo bucea** (hasta 2.000-3.000 m). En Canarias existe una población **residente y semi-residente**, especialmente en el suroeste de Gran Canaria y aguas entre Tenerife y La Gomera.

### Cómo reconocerlo
- **Talla:** 11-18 m (machos mucho mayores que hembras)
- **Color:** Gris oscuro a marrón, con piel arrugada característica
- **Cabeza:** **Enorme** (1/3 del cuerpo), cuadrada, con el espiráculo desplazado a la izquierda
- **Soplido:** Bajo, inclinado 45° hacia la izquierda, muy característico
- **Aleta dorsal:** Joroba baja y redondeada + serie de «nudillos» dorsales tras ella
- **Cola:** Ancha, triangular, **se muestra siempre al iniciar inmersión profunda**
- **Comportamiento:** Inmersiones de 30-60 min; en superficie 8-12 min respirando; a menudo en grupos de hembras con crías

### Dónde y cuándo verlo
- **Zona top:** Sureste de Gran Canaria (Taliarte, Pasito Blanco), suroeste Tenerife
- **Época:** **Todo el año** — población residente
- **Mejor hora:** Mediodía-primeras horas de la tarde (bucean más cuando hay más luz para sus presas)

> **Dato fascinante:** Su cerebro es el más grande del reino animal (hasta 8 kg). Usan *clicks* de alta intensidad (230 dB) para «ver» con sonar en la oscuridad total de las profundidades.

---

## 4. Ballena de Bryde (Balaenoptera edeni) — La gran desconocida

La **ballena de Bryde** (pronunciada *bruu-da*) es un rorcual mediano de aguas templado-cálidas. En Canarias es **residente todo el año**, pero su comportamiento esquivo y su parecido con el rorcual común la hacen pasar desapercibida con frecuencia.

### Cómo reconocerlo
- **Talla:** 12-16 metros
- **Color:** Gris oscuro dorsalmente, garganta con pliegues ventrales prominentes
- **Cabeza:** **Tres crestas longitudinales** en el rostro (única ballena con 3 crestas)
- **Soplido:** 3-4 metros, denso y columnar
- **Aleta dorsal:** Falcada, erguida, situada en el último tercio — más alta y curvada que en rorcual común
- **Comportamiento:** Nada errático, cambios bruscos de dirección; a menudo alimenta en superficie (lunge feeding); **muestra la cabeza al salir a respirar**

### Dónde y cuándo verlo
- **Zona top:** Aguas entre Gran Canaria y Fuerteventura, sur de Lanzarote
- **Época:** **Todo el año** — población residente canaria
- **Mejor hora:** Mañana con mar llano; busca concentraciones de peces (boquerones, sardinas) y aves marinas

> **Clave de identificación:** Si ves un rorcual mediano que **muestra la cabeza al respirar**, tiene **3 crestas en el hocico** y una aleta dorsal **más alta y curvada**, es Bryde. El rorcual común solo tiene 1 cresta y aleta más pequeña.

---

## 5. Zifio de Cuvier (Ziphius cavirostris) — El fantasma de las profundidades

El **zifio de Cuvier** ostenta el récord mundial de inmersión: **2.992 metros de profundidad** y **222 minutos** sin respirar. Es el cetáceo más esquivo de Canarias, pero el archipiélago alberga una de las **poblaciones mejor estudiadas del mundo** (especialmente en El Hierro y sur de Tenerife).

### Cómo reconocerlo
- **Talla:** 5-7 metros
- **Color:** Variable: gris pizarra, marrón, blanquecino; machos muy cicatrizados (blancos) por luchas y depredadores
- **Cabeza:** **Pico corto** (tipo «pico de ganso»), frente abombada, **dos dientes en la mandíbula inferior** (solo machos, visibles al saltar)
- **Soplido:** Bajo, difuso, difícil de ver
- **Aleta dorsal:** Pequeña, triangular, muy retrasada
- **Comportamiento:** **Extremadamente esquivo**; evita barcos; inmersiones profundas de 40-60 min; en superficie solo 2-3 min; a menudo solo o en grupos de 2-3

### Dónde y cuándo verlo
- **Zona top:** Aguas profundas (>1.000 m) al sur de El Hierro, suroeste Tenerife, sur de La Palma
- **Época:** **Todo el año** — residente
- **Mejor hora:** Requiere **mar absolutamente llano (Beaufort 0-1)** y mucha paciencia; salida en zodiac o barco pequeño

> **Nota realista:** Ver un zifio en Canarias es un **privilegio raro**. La mayoría de avistamientos son fortuitos durante travesías a actividades de buceo profundo o en barcos de investigación. Si lo ves, has tenido suerte de las que se cuentan.

---

## Tabla resumen: 5 ballenas canarias a golpe de vista

| Especie | Talla | Residente | Mejor época | Dificultad | Zona estrella |
|---------|-------|-----------|-------------|------------|---------------|
| Calderón tropical | 4-7 m | ✅ Sí | **Todo el año** | ⭐ Fácil | SW Tenerife / S Gran Canaria |
| Rorcual común | 18-24 m | ❌ Migratorio | Dic-Jun | ⭐⭐ Media | Norte Gran Canaria |
| Cachalote | 11-18 m | ✅ Sí | **Todo el año** | ⭐⭐ Media | SE Gran Canaria |
| Ballena de Bryde | 12-16 m | ✅ Sí | **Todo el año** | ⭐⭐⭐ Difícil | Entre GC y Fuerteventura |
| Zifio de Cuvier | 5-7 m | ✅ Sí | **Todo el año** | ⭐⭐⭐⭐⭐ Muy difícil | El Hierro / SW Tenerife |

---

## Consejos prácticos para tu avistamiento

### 1. Elige la excursión adecuada
- **Barco pequeño / zodiac (8-12 pax):** Mejor maniobrabilidad, menos ruido, más respeto, más cerca del agua
- **Guía biólogo marino a bordo:** Identifica especies, explica comportamiento, garantiza código de conducta
- **Hidrófono a bordo:** Escucha *clicks* de cachalotes y calderones en tiempo real — experiencia única
- **Código de conducta ACCOBAMS:** Barco que se acerca a < 60 m, no persigue, no separa grupos, motor en neutro cerca de animales

### 2. Qué llevar
- Prismáticos 7x50 o 8x42 (imprescindibles para rorcuales y zifios)
- Cámara con teleobjetivo (200-400 mm) o móvil con zoom óptico
- Protección solar, gorra, chaqueta cortaviento (en mar refresca)
- Medicación mareo **30 min antes** si eres propenso

### 3. Cuándo reservar
- **Calderones y cachalotes:** Cualquier día del año, pero reserva con 2-3 días de antelación en verano
- **Rorcual común:** Enero-junio, mira partes meteorológicos (mar llano imprescindible)
- **Bryde y zifio:** Oportunidad + condiciones perfectas; no se garantizan

### 4. Normativa y ética
- **Real Decreto 1727/2007** y **ACCOBAMS**: Prohibido molestar, perseguir, alimentar, nadar con cetáceos
- Distancia mínima: **60 m** (300 m si hay crías)
- Tiempo máx. observación: **30 min** por grupo
- Denuncia infracciones: 112 / Guardia Civil (SEPRONA)

---

## ¿Por qué Canarias es único para ballenas?

1. **Profundidad inmediata:** A 2-3 km de la costa ya hay 1.000-3.000 m de fondo → especies oceánicas cerca de puerto
2. **Afloramiento (upwelling) permanente:** Corrientes frías ricas en nutrientes → productividad alta → alimento abundante
3. **Clima estable:** 300+ días de sol al año, vientos alisios moderados → operatividad casi continua
4. **Diversidad sin igual:** 30+ especies cetáceas (residentes, estacionales, ocasionales) en 500 km de costa
5. **Investigación pionera:** Universidad de La Laguna, SECAC, Gesellschaft für Meeressäugetiere — décadas de datos

---

## Vive la experiencia con OWA

En **OWA Wild Adventure** salimos desde **Puerto Rico (Gran Canaria)** y **Costa Adeje (Tenerife)** con:

- ✅ Barcos de 10-12 plazas (respeto total, sin masificación)
- ✅ Guía biólogo marino certificado en cada salida
- ✅ Hidrófono profesional para escuchar el océano
- ✅ **98 % éxito en calderones** + avistamientos frecuentes de cachalotes, delfines mulares, manchados y tortugas
- ✅ Baño en cala secreta incluido (actividad *Ocean Giants Cruise*)
- ✅ Fotos de la experiencia regaladas
- ✅ Código de conducta ACCOBAMS estricto

> **¿Listo para conocer a los gigantes del Atlántico?**
> 
> 👉 [Reserva tu Ocean Giants Cruise](/actividad/ocean-giants-cruise) — 4 horas, desde 40 €
> 
> *¿Preguntas? [Escríbenos](/contacto) y te asesoramos sin compromiso.*

---

## Preguntas frecuentes (FAQ)

### ¿Qué ballena se ve seguro al 100 %?
**Ninguna es 100 % garantizada** (son animales salvajes), pero el **calderón tropical** roza el 98-99 % de éxito en salidas específicas desde SW Tenerife y S Gran Canaria.

### ¿Puedo ver ballenas azules en Canarias?
**Muy raro**. Hay registros esporádicos (últimos confirmados: 2017, 2021) en aguas profundas del norte. No es objetivo realista de una excursión comercial.

### ¿Es mejor mañana o tarde?
**Mañana temprano** (primer turno 9-10 h): mar más llano, mejor luz para fotos, animales más activos en superficie. Tarde: buena luz dorada, pero más viento alisio.

### ¿Qué pasa si no vemos nada?
En OWA, si no hay avistamiento de calderones en *Ocean Giants Cruise*, **te invitamos a repetir gratis** en la próxima salida disponible (sujeto a disponibilidad).

### ¿Afecta el mareo a la experiencia?
Sí. Barco pequeño = más movimiento. Toma biodramina/cafeína 30 min antes, mira al horizonte, estate en cubierta central. Si te mareas fuerte, avisa a la tripulación: tienen protocolos.

---

*Artículo escrito por el equipo de biólogos y guías de **OWA Wild Adventure**. Última actualización: julio 2025. Las tasas de avistamiento y zonas pueden variar según temporada y condiciones oceanográficas.`
  },
  {
    id: 'family-canarias',
    category: 'FAMILIA',
    title: 'Las 10 mejores actividades para disfrutar en familia',
    excerpt: 'Desde el banana boat hasta el kayak transparente: nuestras favoritas para las vacaciones con niños.',
    image: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?auto=format&fit=crop&w=900&q=80',
    date: '22 Jun 2025',
  },
  {
    id: 'lanzarote-volcanes',
    category: 'VIAJE',
    title: 'Ruta en buggy por los volcanes de Lanzarote',
    excerpt: 'Recorremos Timanfaya, La Geria y el Golfo con nuestros guías locales. Un día que no olvidarás.',
    image: 'https://images.unsplash.com/photo-1720670272553-d352388d54d0?auto=format&fit=crop&w=900&q=80',
    date: '14 Jun 2025',
  },
  {
    id: 'starlight',
    category: 'ESTRELLAS',
    title: 'La Palma, la isla del cielo más limpio del mundo',
    excerpt: '¿Por qué La Palma tiene el cielo mejor conservado del planeta? Te lo explicamos con datos y las mejores observaciones.',
    image: 'https://images.unsplash.com/photo-1770838916964-0ae934bf7632?auto=format&fit=crop&w=900&q=80',
    date: '05 Jun 2025',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'María González',
    country: 'España',
    avatar: 'https://i.pravatar.cc/100?img=45',
    rating: 5,
    text: 'La excursión a Lobos fue inolvidable. Todo perfectamente organizado, guías atentos y unas vistas de otro mundo.',
    activity: 'Isla de Lobos Escape',
  },
  {
    id: 2,
    name: 'James Anderson',
    country: 'Reino Unido',
    avatar: 'https://i.pravatar.cc/100?img=13',
    rating: 5,
    text: 'Best buggy tour of my life. Volcanic canyons of Gran Canaria are simply magical. Highly recommended.',
    activity: 'Safari Buggy Gran Canaria',
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    country: 'Francia',
    avatar: 'https://i.pravatar.cc/100?img=32',
    rating: 5,
    text: 'Le catamaran au coucher du soleil à Tenerife était magique. Repas délicieux et équipe incroyable.',
    activity: 'Catamarán Sunset',
  },
];

export const stats = [
  { number: '50K+', label: 'Clientes felices' },
  { number: '120+', label: 'Actividades' },
  { number: '8', label: 'Islas cubiertas' },
  { number: '4.9★', label: 'Valoración media' },
];
