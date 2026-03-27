export type Holiday = {
  date: string
  label: string
  country: string
  flag: string
}

/** Fixed calendar dates (MM-DD) for demo year display */
export const SPANISH_WORLD_HOLIDAYS: Holiday[] = [
  { date: '01-01', label: 'Año Nuevo', country: 'Varios', flag: '🌍' },
  { date: '01-06', label: 'Reyes Magos', country: 'España', flag: '🇪🇸' },
  { date: '02-24', label: 'Día de la Bandera', country: 'México', flag: '🇲🇽' },
  { date: '03-19', label: 'San José / Padre', country: 'España', flag: '🇪🇸' },
  { date: '03-24', label: 'Día de la Memoria', country: 'Argentina', flag: '🇦🇷' },
  { date: '05-01', label: 'Día del Trabajo', country: 'Hispanoamérica', flag: '🌎' },
  { date: '05-25', label: 'Revolución de Mayo', country: 'Argentina', flag: '🇦🇷' },
  { date: '06-29', label: 'San Pedro y San Pablo', country: 'Perú', flag: '🇵🇪' },
  { date: '07-16', label: 'Virgen del Carmen', country: 'Chile', flag: '🇨🇱' },
  { date: '07-28', label: 'Fiestas Patrias (inicio)', country: 'Perú', flag: '🇵🇪' },
  { date: '09-16', label: 'Grito / Independencia', country: 'México', flag: '🇲🇽' },
  { date: '09-18', label: 'Fiestas Patrias', country: 'Chile', flag: '🇨🇱' },
  { date: '10-12', label: 'Hispanidad / Día de la Raza', country: 'España / LA', flag: '🌎' },
  { date: '11-01', label: 'Día de Todos los Santos', country: 'España', flag: '🇪🇸' },
  { date: '11-02', label: 'Día de Muertos', country: 'México', flag: '🇲🇽' },
  { date: '11-20', label: 'Revolución Mexicana', country: 'México', flag: '🇲🇽' },
  { date: '12-06', label: 'Día de la Constitución', country: 'España', flag: '🇪🇸' },
  { date: '12-08', label: 'Inmaculada Concepción', country: 'España', flag: '🇪🇸' },
  { date: '12-25', label: 'Navidad', country: 'Varios', flag: '🌍' },
]

export type BookedClass = {
  id: string
  title: string
  date: string
  time: string
  level: string
}

export const DEMO_BOOKED: BookedClass[] = [
  {
    id: '1',
    title: 'Conversación C1 — presentación oral',
    date: '2026-03-28',
    time: '18:00',
    level: 'C1',
  },
  {
    id: '2',
    title: 'Repaso subjuntivo',
    date: '2026-04-02',
    time: '10:30',
    level: 'B2',
  },
  {
    id: '3',
    title: 'Club de lectura — cuento corto',
    date: '2026-04-05',
    time: '19:00',
    level: 'B1+',
  },
]
