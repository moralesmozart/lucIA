export type GrammarLabel =
  | 'Pretérito perfecto compuesto'
  | 'Pretérito indefinido'
  | 'Imperfecto'
  | 'Futuro simple'
  | 'Condicional'
  | 'Subjuntivo presente'
  | 'Presente simple'

export type GrammarCard = {
  id: string
  label: GrammarLabel
  sentence: string
}

/** UNO-style face: bold color per “suit”, short code on corners */
export const LABEL_UNO: Record<
  GrammarLabel,
  { abbr: string; fill: string; cornerClass: string }
> = {
  'Pretérito perfecto compuesto': {
    abbr: 'PPC',
    fill: '#d62828',
    cornerClass: 'text-white drop-shadow-sm',
  },
  'Pretérito indefinido': {
    abbr: 'IND',
    fill: '#1565c0',
    cornerClass: 'text-white drop-shadow-sm',
  },
  Imperfecto: {
    abbr: 'IMP',
    fill: '#2e7d32',
    cornerClass: 'text-white drop-shadow-sm',
  },
  'Futuro simple': {
    abbr: 'FUT',
    fill: '#f9a825',
    cornerClass: 'text-black/90 drop-shadow-sm',
  },
  Condicional: {
    abbr: 'COND',
    fill: '#c2185b',
    cornerClass: 'text-white drop-shadow-sm',
  },
  'Subjuntivo presente': {
    abbr: 'SUBJ',
    fill: '#ef6c00',
    cornerClass: 'text-white drop-shadow-sm',
  },
  'Presente simple': {
    abbr: 'PRS',
    fill: '#4527a0',
    cornerClass: 'text-white drop-shadow-sm',
  },
}

export const GRAMMAR_LABELS: GrammarLabel[] = [
  'Pretérito perfecto compuesto',
  'Pretérito indefinido',
  'Imperfecto',
  'Futuro simple',
  'Condicional',
  'Subjuntivo presente',
  'Presente simple',
]

export const GRAMMAR_DECK: GrammarCard[] = [
  {
    id: 'c1',
    label: 'Pretérito perfecto compuesto',
    sentence: 'Yo he hecho pollo asado.',
  },
  {
    id: 'c2',
    label: 'Pretérito perfecto compuesto',
    sentence: 'Ella ha vivido en tres países.',
  },
  {
    id: 'c3',
    label: 'Pretérito perfecto compuesto',
    sentence: 'Hemos aprendido mucho esta semana.',
  },
  {
    id: 'c4',
    label: 'Pretérito indefinido',
    sentence: 'Ayer cociné para toda la familia.',
  },
  {
    id: 'c5',
    label: 'Pretérito indefinido',
    sentence: 'Ellos viajaron sin maleta.',
  },
  {
    id: 'c6',
    label: 'Pretérito indefinido',
    sentence: 'Tú hablaste con claridad.',
  },
  {
    id: 'c7',
    label: 'Imperfecto',
    sentence: 'Cuando era niño, leía cada noche.',
  },
  {
    id: 'c8',
    label: 'Imperfecto',
    sentence: 'Llovía y yo escuchaba música.',
  },
  {
    id: 'c9',
    label: 'Imperfecto',
    sentence: 'Siempre íbamos al mercado los sábados.',
  },
  {
    id: 'c10',
    label: 'Futuro simple',
    sentence: 'Mañana estudiaré dos horas.',
  },
  {
    id: 'c11',
    label: 'Futuro simple',
    sentence: 'Lucía corregirá los textos el viernes.',
  },
  {
    id: 'c12',
    label: 'Futuro simple',
    sentence: 'Nosotros viajaremos en primavera.',
  },
  {
    id: 'c13',
    label: 'Condicional',
    sentence: 'Yo viajaría si tuviera vacaciones.',
  },
  {
    id: 'c14',
    label: 'Condicional',
    sentence: 'Ella sería feliz en ese barrio.',
  },
  {
    id: 'c15',
    label: 'Condicional',
    sentence: 'Compraríamos entradas juntos.',
  },
  {
    id: 'c16',
    label: 'Subjuntivo presente',
    sentence: 'Quiero que practiques todos los días.',
  },
  {
    id: 'c17',
    label: 'Subjuntivo presente',
    sentence: 'Es posible que llueva por la tarde.',
  },
  {
    id: 'c18',
    label: 'Subjuntivo presente',
    sentence: 'Dudo que sea tan difícil.',
  },
  {
    id: 'c19',
    label: 'Presente simple',
    sentence: 'Yo estudio español con Lucía.',
  },
  {
    id: 'c20',
    label: 'Presente simple',
    sentence: 'Tú vives lejos del centro.',
  },
  {
    id: 'c21',
    label: 'Presente simple',
    sentence: 'Ellos trabajan desde casa.',
  },
]

function seededShuffle<T>(items: T[], seed: number): T[] {
  const a = [...items]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function shuffleDeck(seed: number): GrammarCard[] {
  return seededShuffle([...GRAMMAR_DECK], seed)
}

/** Reshuffle discard into a new draw pile (same RNG style as initial deal). */
export function shuffleIntoDrawPile(cards: GrammarCard[], seed: number): GrammarCard[] {
  return seededShuffle([...cards], seed)
}
