export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type ExerciseKind = 'choice' | 'fill' | 'match'

export type Exercise =
  | {
      id: string
      level: Level
      kind: 'choice'
      prompt: string
      options: string[]
      correctIndex: number
    }
  | {
      id: string
      level: Level
      kind: 'fill'
      template: string
      answers: string[]
      hint?: string
    }
  | {
      id: string
      level: Level
      kind: 'match'
      left: string[]
      right: string[]
      /** for each left row index, index in `right` */
      solution: number[]
    }

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const COUNTS: Record<Level, number> = {
  A1: 18,
  A2: 17,
  B1: 17,
  B2: 17,
  C1: 16,
  C2: 15,
}

function shuffleInPlace<T>(arr: T[], seed: number): number {
  let s = seed
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = s % (i + 1)
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return s
}

type ChoiceTpl = { prompt: string; options: string[]; answer: string }
type FillTpl = { template: string; answers: string[]; hint?: string }
type MatchTpl = { left: string[]; right: string[]; solution: number[] }

const choiceTemplates: Record<Level, ChoiceTpl[]> = {
  A1: [
    {
      prompt: '“Hola” significa…',
      options: ['adiós', 'hello', 'gracias', 'por favor'],
      answer: 'hello',
    },
    {
      prompt: '¿Cómo se dice “water”?',
      options: ['fuego', 'agua', 'pan', 'casa'],
      answer: 'agua',
    },
    {
      prompt: 'Yo ___ de Madrid.',
      options: ['eres', 'soy', 'es', 'somos'],
      answer: 'soy',
    },
    {
      prompt: '“Buenos días” se usa…',
      options: ['por la noche', 'por la mañana', 'al despedirse', 'nunca'],
      answer: 'por la mañana',
    },
    {
      prompt: '___ libro (artículo)',
      options: ['La', 'El', 'Los', 'Las'],
      answer: 'El',
    },
    {
      prompt: 'Número “cinco”:',
      options: ['cuatro', 'cinco', 'seis', 'siete'],
      answer: 'cinco',
    },
    {
      prompt: 'Yo ___ una manzana.',
      options: ['bebo', 'como', 'duermo', 'corro'],
      answer: 'como',
    },
    {
      prompt: '“Gracias” → respuesta común',
      options: ['lo siento', 'de nada', 'hola', 'quizás'],
      answer: 'de nada',
    },
    {
      prompt: 'Ellos ___ estudiantes.',
      options: ['es', 'son', 'está', 'están'],
      answer: 'son',
    },
    {
      prompt: '¿Dónde ___ el baño?',
      options: ['está', 'estás', 'estoy', 'estamos'],
      answer: 'está',
    },
  ],
  A2: [
    {
      prompt: 'Ayer yo ___ al cine.',
      options: ['voy', 'fui', 'iba', 'iré'],
      answer: 'fui',
    },
    {
      prompt: 'Mañana nosotros ___ paella.',
      options: ['cocinamos', 'cocinábamos', 'cocinaremos', 'cocinaban'],
      answer: 'cocinaremos',
    },
    {
      prompt: 'No tengo ___ tiempo.',
      options: ['muchos', 'mucho', 'muchas', 'pocas'],
      answer: 'mucho',
    },
    {
      prompt: '¿___ vas a la fiesta?',
      options: ['Quién', 'Cuándo', 'Dónde', 'Por qué'],
      answer: 'Cuándo',
    },
    {
      prompt: 'Me gusta ___ música.',
      options: ['el', 'la', 'los', 'las'],
      answer: 'la',
    },
    {
      prompt: 'Ella ___ español muy bien.',
      options: ['hablo', 'hablas', 'habla', 'hablamos'],
      answer: 'habla',
    },
    {
      prompt: 'Prefiero el té ___ el café.',
      options: ['que', 'a', 'de', 'en'],
      answer: 'a',
    },
    {
      prompt: 'Vivo ___ Barcelona.',
      options: ['a', 'en', 'por', 'de'],
      answer: 'en',
    },
    {
      prompt: 'Nunca ___ tarde.',
      options: ['llego', 'llegas', 'llega', 'llegamos'],
      answer: 'llego',
    },
  ],
  B1: [
    {
      prompt: 'Si llueve, nosotros ___ en casa.',
      options: ['nos quedamos', 'quedamos', 'quedáis', 'quedarán'],
      answer: 'nos quedamos',
    },
    {
      prompt: 'Ojalá ___ tiempo mañana.',
      options: ['tengo', 'tenga', 'tendré', 'tenía'],
      answer: 'tenga',
    },
    {
      prompt: 'Cuando era niño, siempre ___ al parque.',
      options: ['voy', 'iba', 'fui', 'iré'],
      answer: 'iba',
    },
    {
      prompt: 'No creo que ___ razón.',
      options: ['tienes', 'tengas', 'tendrás', 'tenías'],
      answer: 'tengas',
    },
    {
      prompt: 'Llevo tres años ___ español.',
      options: ['estudiar', 'estudiando', 'estudiado', 'estudio'],
      answer: 'estudiando',
    },
    {
      prompt: 'Te llamo ___ llegue.',
      options: ['cuando', 'mientras', 'aunque', 'para que'],
      answer: 'cuando',
    },
    {
      prompt: 'Es la ciudad ___ más me gusta.',
      options: ['que', 'quien', 'cuyo', 'donde'],
      answer: 'que',
    },
    {
      prompt: 'Antes de ___, desayuno.',
      options: ['salir', 'salgo', 'saliera', 'salí'],
      answer: 'salir',
    },
  ],
  B2: [
    {
      prompt: 'Aunque ___, salió a correr.',
      options: ['llovía', 'llovió', 'llueva', 'lloverá'],
      answer: 'llovía',
    },
    {
      prompt: 'No había nadie que ___ la verdad.',
      options: ['supiera', 'sabía', 'sepa', 'sabrá'],
      answer: 'supiera',
    },
    {
      prompt: 'El informe, ___ redacté yo, fue aprobado.',
      options: ['el cual', 'que', 'quien', 'cuyo'],
      answer: 'el cual',
    },
    {
      prompt: 'Para entonces ya ___ el trabajo.',
      options: ['habré terminado', 'terminaré', 'había terminado', 'terminaba'],
      answer: 'habré terminado',
    },
    {
      prompt: 'Me molesta que ___ sin avisar.',
      options: ['vienes', 'vengas', 'vendrás', 'vinieras'],
      answer: 'vengas',
    },
    {
      prompt: 'Fue la primera vez que ___ Andalucía.',
      options: ['visito', 'visitaba', 'visité', 'había visitado'],
      answer: 'visité',
    },
    {
      prompt: 'No ___ más remedio que aceptar.',
      options: ['tuve', 'tenía', 'tengo', 'tendré'],
      answer: 'tuve',
    },
    {
      prompt: '___ que llueva, la excursión sigue.',
      options: ['A pesar', 'Aunque', 'Siempre', 'Mientras'],
      answer: 'Aunque',
    },
  ],
  C1: [
    {
      prompt: '___ aprobada la ley, hubo debate.',
      options: ['Haber sido', 'Al haber sido', 'Habiendo sido', 'Sido'],
      answer: 'Habiendo sido',
    },
    {
      prompt: 'No ___ lugar a dudas sobre su competencia.',
      options: ['cabía', 'cabe', 'cupo', 'cabrá'],
      answer: 'cabe',
    },
    {
      prompt: 'El autor ___ en una prosa barroca.',
      options: ['se complacía', 'complacía', 'complació', 'había complacido'],
      answer: 'se complacía',
    },
    {
      prompt: '___ más hubieras estudiado, habrías aprobado.',
      options: ['De', 'Si', 'Como', 'Aunque'],
      answer: 'Si',
    },
    {
      prompt: 'Es un tema ___ no cabe simplificación.',
      options: ['en el que', 'del que', 'al que', 'por el que'],
      answer: 'en el que',
    },
    {
      prompt: '___ decir verdad, no me convence.',
      options: ['Por', 'A', 'Para', 'Sin'],
      answer: 'A',
    },
    {
      prompt: 'La medida, ___ dudosa resulte, fue adoptada.',
      options: ['por muy', 'por más', 'aunque', 'si bien'],
      answer: 'por más',
    },
    {
      prompt: '___ el esfuerzo, no alcanzó la meta.',
      options: ['Pese a', 'A pesar', 'Con', 'Sin'],
      answer: 'Pese a',
    },
  ],
  C2: [
    {
      prompt: '___ la gravedad del asunto, optaron por el silencio.',
      options: ['En vista de', 'A la vista de', 'Con vista a', 'Por vista de'],
      answer: 'En vista de',
    },
    {
      prompt: 'No es que no ___, es que no quiere.',
      options: ['pueda', 'puede', 'pudiera', 'pudo'],
      answer: 'puede',
    },
    {
      prompt: 'Se mostró ___ con la crítica.',
      options: ['displicente', 'complaciente', 'indiferente', 'deferente'],
      answer: 'displicente',
    },
    {
      prompt: 'El discurso, ___ en apariencia, esconde matices.',
      options: ['llano', 'lano', 'liano', 'plano'],
      answer: 'llano',
    },
    {
      prompt: '___ arriesgado que parezca, merece la pena.',
      options: ['Por muy', 'Por mucho', 'Aun', 'Si bien'],
      answer: 'Por muy',
    },
    {
      prompt: '___ mal que nos pese, debemos reconocerlo.',
      options: ['Por', 'A', 'Para', 'Con'],
      answer: 'A',
    },
    {
      prompt: '___ circunstancias, la decisión fue acertada.',
      options: ['Bajo las', 'Bajo', 'Debajo las', 'Tras las'],
      answer: 'Bajo las',
    },
    {
      prompt: 'Hablaba con un deje ___ que irritaba.',
      options: ['condescendiente', 'condescendido', 'condescendiendo', 'condescendencia'],
      answer: 'condescendiente',
    },
  ],
}

const fillTemplates: Record<Level, FillTpl[]> = {
  A1: [
    { template: 'Me llamo Ana y ___ de México.', answers: ['soy'] },
    { template: 'Tengo ___ años.', answers: ['veinte', '20', 'treinta', '30'] },
    { template: 'Hoy hace mucho ___.', answers: ['calor', 'frío'] },
    { template: 'Quiero ___ agua, por favor.', answers: ['un', 'una'] },
    { template: '___ casa es grande.', answers: ['Mi', 'Tu'] },
  ],
  A2: [
    {
      template: 'Cuando era pequeño, ___ mucho al fútbol.',
      answers: ['jugaba'],
      hint: 'imperfecto',
    },
    {
      template: 'Necesito que me ___ el favor.',
      answers: ['hagas'],
      hint: 'subjuntivo',
    },
    { template: 'Si ___ libre, te llamo.', answers: ['estoy', 'estuviera'] },
    { template: 'Ya ___ las noticias.', answers: ['he visto', 'vi'] },
  ],
  B1: [
    {
      template: 'Si ___ tiempo, viajaría.',
      answers: ['tuviera', 'tuviese'],
      hint: 'subj. imperfecto',
    },
    { template: 'Es importante que ___ puntual.', answers: ['seas', 'eres'] },
    { template: 'Desde que ___, vivo aquí.', answers: ['llegué', 'llego'] },
  ],
  B2: [
    {
      template: 'No hay quien le ___ la paciencia.',
      answers: ['igualara', 'iguale'],
    },
    { template: '___ el informe, descansaremos.', answers: ['Terminado', 'Acabado'] },
    { template: 'Aun ___ así, insistió.', answers: ['sabiendo', 'sabiéndolo'] },
  ],
  C1: [
    { template: '___ bien que no es ideal, es viable.', answers: ['Siendo'] },
    { template: 'El texto, ___ su dureza, es honesto.', answers: ['pese a', 'a pesar de'] },
    { template: '___ donde mires, hay contradicción.', answers: ['Por', 'Dondequiera'] },
  ],
  C2: [
    {
      template: '___ más en serio el asunto, no perderíamos tiempo.',
      answers: ['De haberlo tomado', 'Si lo hubiéramos tomado'],
    },
    { template: 'Es de ___ que mejore la situación.', answers: ['esperar', 'suponer'] },
    { template: '___ que no lo creas, es cierto.', answers: ['Aun', 'Aunque'] },
  ],
}

const matchTemplates: Record<Level, MatchTpl[]> = {
  A1: [
    {
      left: ['Hola', 'Gracias', 'Adiós'],
      right: ['Hello', 'Thanks', 'Bye'],
      solution: [0, 1, 2],
    },
    {
      left: ['lunes', 'viernes', 'domingo'],
      right: ['week start', 'work week end', 'weekend'],
      solution: [0, 1, 2],
    },
  ],
  A2: [
    {
      left: ['ayer', 'mañana', 'ahora'],
      right: ['past', 'future', 'present'],
      solution: [0, 1, 2],
    },
    {
      left: ['más…que', 'tan…como', 'menos…que'],
      right: ['inequality', 'equality', 'less than'],
      solution: [0, 1, 2],
    },
  ],
  B1: [
    {
      left: ['para que', 'aunque', 'cuando'],
      right: ['finalidad', 'concesión', 'tiempo'],
      solution: [0, 1, 2],
    },
    {
      left: ['haber', 'ser', 'estar'],
      right: ['aux. perfecto', 'identidad', 'estado'],
      solution: [0, 1, 2],
    },
  ],
  B2: [
    {
      left: ['pluscuamperfecto', 'indefinido', 'imperfecto'],
      right: ['había + participio', 'hecho puntual', 'fondo narrativo'],
      solution: [0, 1, 2],
    },
    {
      left: ['concordancia', 'estilo indirecto', 'voz pasiva'],
      right: ['matching forms', 'reported speech', 'fue hecho'],
      solution: [0, 1, 2],
    },
  ],
  C1: [
    {
      left: ['anacoluto', 'polisemia', 'deíxis'],
      right: ['syntax break', 'many meanings', 'context pointer'],
      solution: [0, 1, 2],
    },
    {
      left: ['subjuntivo', 'indicativo', 'imperativo'],
      right: ['duda / deseo', 'hechos', 'órdenes'],
      solution: [0, 1, 2],
    },
  ],
  C2: [
    {
      left: ['matiz', 'ironía', 'eufemismo'],
      right: ['nuance', 'inverse meaning', 'soften'],
      solution: [0, 1, 2],
    },
    {
      left: ['sinestesia', 'metáfora', 'hipérbole'],
      right: ['sense mix', 'comparison', 'exaggeration'],
      solution: [0, 1, 2],
    },
  ],
}

export function buildAllExercises(): Exercise[] {
  const list: Exercise[] = []
  let seed = 42

  LEVELS.forEach((level) => {
    const total = COUNTS[level]
    const ch = choiceTemplates[level]
    const fi = fillTemplates[level]
    const ma = matchTemplates[level]
    for (let i = 0; i < total; i++) {
      const id = `${level}-${String(i + 1).padStart(2, '0')}`
      const kind = i % 3
      if (kind === 0) {
        const tpl = ch[i % ch.length]!
        const options = [...tpl.options]
        seed = shuffleInPlace(options, seed + i)
        const correctIndex = options.indexOf(tpl.answer)
        list.push({
          id,
          level,
          kind: 'choice',
          prompt: tpl.prompt,
          options,
          correctIndex,
        })
      } else if (kind === 1) {
        const tpl = fi[i % fi.length]!
        list.push({
          id,
          level,
          kind: 'fill',
          template: tpl.template,
          answers: tpl.answers,
          hint: tpl.hint,
        })
      } else {
        const tpl = ma[i % ma.length]!
        const right = [...tpl.right]
        const perm = right.map((_, j) => j)
        seed = shuffleInPlace(perm, seed + i * 3)
        const shuffledRight = perm.map((j) => tpl.right[j]!)
        const solution = tpl.solution.map((origR) => perm.indexOf(origR))
        list.push({
          id,
          level,
          kind: 'match',
          left: tpl.left,
          right: shuffledRight,
          solution,
        })
      }
    }
  })

  return list
}

export const ALL_EXERCISES: Exercise[] = buildAllExercises()

export function exercisesForLevel(level: Level | 'all'): Exercise[] {
  if (level === 'all') return ALL_EXERCISES
  return ALL_EXERCISES.filter((e) => e.level === level)
}
