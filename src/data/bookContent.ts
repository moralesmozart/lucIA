export type SidebarNote = {
  id: string
  title: string
  body: string
  /** phrase in text to highlight (optional) */
  anchor?: string
}

export type BookPage = {
  page: number
  title: string
  paragraphs: string[]
  notes: SidebarNote[]
}

/** Demo lectura: ~500 caracteres por página (objetivo pedagógico). */
export const FICTIONAL_BOOK: BookPage[] = [
  {
    page: 1,
    title: 'Amanece en el puerto',
    paragraphs: [
      'El faro todavía parpadeaba sobre el agua gris cuando Marta cerró la ventana con un gesto lento, como quien cierra también un poco de ruido interior. Afuera, el mar olía a sal y a metal mojado, y pensó, sin dramatizar pero con honestidad: joder, qué frío hacía a esa hora, cuando el día apenas desperezaba.',
      '"Hoy hablo con Lucía", se dijo en voz baja, como quien confirma una cita decisiva. Llevaba semanas mezclando tiempos verbales sin querer, como quien mezcla té con vino, y sentía que cada frase salía bien en la cabeza y torcida en la boca.',
      'No buscaba perfección de laboratorio; buscaba fluidez con alguien que escuchara hasta el final. Quería que el español volviera a ser un lugar habitable, no una lista de errores que la empujara a callarse.',
    ],
    notes: [
      {
        id: 'n1',
        title: '“joder”',
        body: 'Muletilla muy común en España (registro informal). En clase formal suele evitarse; en novela refleja voz del personaje.',
        anchor: 'joder',
      },
      {
        id: 'n2',
        title: 'Pretérito imperfecto',
        body: '“olía”, “hacía”: fondo descriptivo, acciones habituales o estados en el pasado.',
        anchor: 'olía',
      },
    ],
  },
  {
    page: 2,
    title: 'Un café antes de clase',
    paragraphs: [
      'Marta había preparado tres párrafos para su presentación y los había leído en voz alta frente al espejo del pasillo, como si el reflejo fuera un público exigente pero comprensivo. No eran perfectos, pero eran suyos: llevaban su ritmo, sus miedos y también sus pequeñas victorias de la semana.',
      'Había subrayado dudas en rojo suave —no en alarmas— y dejó una nota al margen: “preguntar esto”. Cuando Lucía entró en la videollamada, todo se calmó. No era magia: era escucha real, esa que ordena el aire y hace posible pensar en español sin apagar la persona.',
      'Lucía saludó con una sonrisa breve, como quien reconoce el esfuerzo antes que el resultado. “Empezamos por lo que tú quieras”, dijo, y Marta sintió que podía respirar otra vez dentro del idioma.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Pretérito pluscuamperfecto',
        body: '“había preparado”: acción anterior a otra del pasado (la videollamada).',
        anchor: 'había preparado',
      },
    ],
  },
  {
    page: 3,
    title: 'El subjuntivo asoma',
    paragraphs: [
      'Lucía le pidió que explicara su tesis sin leer, con la calma de quien sabe que la memoria se entrena con paciencia. “Quiero que suenes como tú”, dijo, y esa frase quedó flotando en la pantalla como una meta posible, no como una amenaza de juicio.',
      'Marta dudaba de que pudiera hacerlo tan bien como en su idioma materno, pero intentó: soltó la primera idea, luego la segunda, y descubrió que el subjuntivo no era un monstruo, sino una puerta que se abría cuando el habla se volvía humana.',
      'Al final, Lucía asintió. “Así”, dijo. “Con duda y con valentía. El español avanza cuando dejas de esconderte detrás del papel.”',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Subjuntivo tras influencia',
        body: '“Quiero que suenes”: deseo → subjuntivo (tú suenes).',
        anchor: 'quiero que suenes',
      },
      {
        id: 'n2',
        title: 'Duda + subjuntivo',
        body: '“dudaba de que pudiera”: duda → subjuntivo.',
        anchor: 'pudiera',
      },
    ],
  },
  {
    page: 4,
    title: 'Argentina, a la tarde',
    paragraphs: [
      'Un estudiante desde Buenos Aires contó, con una sonrisa cómplice, que “el mate” no se comparte igual que un café: hay reglas tácitas, pausas, una ceremonia pequeña que enseña cercanía sin invadir el espacio del otro.',
      '“Che, esto es cultura”, dijo, y todos rieron porque era verdad: no era una anécdota decorativa, sino una lección viva sobre cómo el español cambia de textura según la mesa donde se bebe.',
      'Lucía anotó una palabra en el chat y luego la amplió en voz alta: léxico, gesto, contexto. “Aprender idioma es aprender formas de cuidarse”, resumió, y la frase sonó simple y profunda a la vez.',
    ],
    notes: [
      {
        id: 'n1',
        title: '“che”',
        body: 'Vocativo típico rioplatense (Argentina, Uruguay), similar a “oye” o “mira”.',
        anchor: 'Che',
      },
    ],
  },
  {
    page: 5,
    title: 'México y el diminutivo',
    paragraphs: [
      'Lucía recordó cuando en Ciudad de México le ofrecieron un “cafecito” aunque el vaso fuera grande, y cómo esa palabra diminuta no mentía sobre el tamaño: mentía sobre la intención, suavizando el pedido como quien extiende una mano antes de hablar de dinero o de tiempo.',
      'Los diminutivos, explicó, no siempre son infantiles; a menudo son cortesía, cariño, ironía suave o una forma de bajar la tensión en una conversación difícil.',
      'Marta escribió en su cuaderno tres ejemplos y subrayó el matiz: en un sitio puede sonar natural; en otro, forzado. “Por eso leemos y viajamos con oídos”, cerró Lucía, y el grupo asintió como quien acepta una tarea hermosa.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Diminutivo afectivo',
        body: '“cafecito”: cortesía y cercanía, muy frecuente en México.',
        anchor: 'cafecito',
      },
    ],
  },
  {
    page: 6,
    title: 'Chile y el “po”',
    paragraphs: [
      'Alguien escribió en el chat: “Es fácil, po”. Otros alumnos preguntaron qué era “po”, y la pregunta abrió una ventana pequeña pero luminosa sobre cómo las partículas coloquiales sostienen identidad y ritmo.',
      'Lucía explicó que es una reducción de “pues”, muy característica de Chile en registro informal, y que funciona casi como un punto suave al final: no cierra el debate, lo afloja.',
      '“No lo uséis en un email formal”, advirtió con humor, “pero entendedlo cuando lo escuchéis: a veces la amistad empieza en una partícula.” La clase rio, y Marta sintió que el mapa del español se hacía más humano.',
    ],
    notes: [
      {
        id: 'n1',
        title: '“po”',
        body: 'Reducción de “pues”, muy característica de Chile en registro informal.',
        anchor: 'po',
      },
    ],
  },
  {
    page: 7,
    title: 'España: ustedes vs vosotros',
    paragraphs: [
      'En la península muchos profes usan “vosotros” en clase con naturalidad, como una forma de incluir al grupo sin distancia excesiva. En América casi siempre se dice “ustedes” para el plural de “tú”, y esa diferencia no es un error: es una foto de historia y de convivencia.',
      'Lucía dibujó una línea imaginaria en el aire y dijo, sin dramatismo: no hay ganador, hay contexto. Lo importante es reconocer el interlocutor y el espacio: aula, trabajo, chat, familia.',
      'Marta pensó en sus metas: presentaciones, amistades, lectura. “Yo elijo una base y aprendo la otra como visitante”, escribió. Lucía respondió con un “exacto” que sonó a libertad, no a regla rígida.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Diatópica',
        body: 'Variación geográfica del español: ambas formas son correctas en su registro.',
      },
    ],
  },
  {
    page: 8,
    title: 'Ser y estar otra vez',
    paragraphs: [
      'Marta estaba nerviosa, pero su exposición era clara: el mensaje tenía forma, ejemplos y un hilo conductor que ya no se perdía en tangentes culpables. Estar, pensó, era el pulso del momento; ser, una línea más estable que atravesaba lo que había aprendido con esfuerzo.',
      'Lucía subrayó una frase en pantalla: “Estoy orgullosa de ti”. No “Soy orgullosa”, porque aquí no se describe un rasgo permanente de personalidad, sino un estado emocional vivido en el presente del habla.',
      '“Ser y estar vuelven una y otra vez”, dijo Lucía, “no para fastidiar, sino porque el mundo real mezcla identidad y circunstancia.” Marta asintió: ya no era una tabla vacía, era una herramienta para sonar natural.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Colocación',
        body: 'Con emociones puntuales suele usarse “estar” + adjetivo (estoy nerviosa).',
      },
    ],
  },
  {
    page: 9,
    title: 'Conectores',
    paragraphs: [
      'En lugar de encadenar todo con “y, y, y”, Marta probó “además”, “sin embargo”, “es decir”, y notó cómo el texto respiraba: cada conector abría una pequeña señal de tráfico para quien escuchaba o leía.',
      'Lucía comparó los conectores con gestos de manos en una conversación: no son adorno; guían la atención, marcan contraste, añaden matices y evitan que la idea se sienta plana o abrupta.',
      'Al finalizar el párrafo, Marta leyó en voz alta y sorprendió a su propio oído: sonaba más adulta, más calmada, como si hubiera aprendido a caminar sin tropezar en cada esquina del discurso.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Cohesión',
        body: 'Conectores guían al lector: contraste (sin embargo), adición (además), reformulación (es decir).',
      },
    ],
  },
  {
    page: 10,
    title: 'La voz pasiva refleja',
    paragraphs: [
      '“Se habla español aquí” suena natural en la calle, en un cartel, en una charla rápida. “El español es hablado aquí” puede sonar correcta, a veces demasiado de manual, y por eso Lucía insistió en el matiz: no se trata de prohibir, sino de elegir según registro y intención.',
      'La pasiva refleja —ese “se” con verbo en tercera persona— sirve para generalizar sin señalar un culpable ni un héroe: describe hábitos, normas sociales, costumbres compartidas.',
      'Marta anotó tres ejemplos cotidianos y subrayó el tono: “se venden entradas”, “se necesita ayuda”, “se recomienda leer”. “Esto es español vivo”, dijo Lucía, y Marta sintió que la gramática se le pegaba al cuerpo.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Pasiva refleja',
        body: '“Se + verbo 3ª persona”: generalizaciones (“se venden entradas”).',
        anchor: 'Se habla',
      },
    ],
  },
  {
    page: 11,
    title: 'Perífrasis',
    paragraphs: [
      'Marta empezó a notar cómo “volver a”, “dejar de”, “echarse a” cambiaban el ritmo de una frase como un metrónomo emocional: no eran adorno, eran precisión sobre inicio, fin, repetición o impulso repentino.',
      'Lucía propuso un juego breve: misma idea, tres perífrasis distintas. La clase probó, se equivocó, rio, corrigió. El error dejó de ser vergüenza y pasó a ser materia prima.',
      '“Las perífrasis te enseñan a pensar el tiempo verbal como narrativa”, cerró Lucía. Marta guardó la frase como quien guarda una brújula: no para presumir, para orientarse cuando escribiera tarde, otra vez, frente a la pantalla encendida.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Perífrasis verbales',
        body: 'Combinaciones (empezar a, dejar de) que matizan aspecto o inicio/fin de acción.',
      },
    ],
  },
  {
    page: 12,
    title: 'C2: matices',
    paragraphs: [
      'Lucía propuso sustituir “muy difícil” por “arduo”, “complejo”, “intrincado”, según el registro, y aclaró algo importante: C2 no es coleccionar palabras raras para impresionar, sino elegir la palabra justa para el contexto y para la persona que te escucha.',
      'Marta probó una oración en voz alta y sintió la diferencia: una variante sonaba académica, otra periodística, otra íntima. “El matiz es respeto”, dijo Lucía, y la sala guardó silencio un segundo, como si esa idea fuera demasiado verdadera para apresurarse.',
      'Al final, cada estudiante eligió un párrafo propio y lo “afinó” sin perder su voz. Marta pensó que eso era lo más difícil y lo más hermoso: sonar uno mismo, pero con más herramientas.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Registro',
        body: 'C2 no es “palabras raras”: es elegir la palabra justa para el contexto.',
      },
    ],
  },
  {
    page: 13,
    title: 'Escuchar para hablar',
    paragraphs: [
      'Cada semana reservaban diez minutos de charla libre, sin agenda apretada: familia, miedos, sueños, recetas, música, el barrio, el clima, lo trivial que en realidad sostiene la confianza. Lucía escuchaba con atención de verdad, no con la prisa de corregirlo todo al instante.',
      'El español dejaba de ser un examen y pasaba a ser un lugar compartido, con bancos para sentarse y ventanas para mirar afuera. Marta notó que entendía más cuando dejaba de traducir palabra por palabra y seguía el hilo emocional.',
      '“Input afectivo”, dijo Lucía, citando ideas de adquisición, pero sin convertirlo en teoría fría. “Comprensible + humano = memoria que se queda”, tradujo, y el grupo sonrió como quien acepta una receta buena.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Input afectivo',
        body: 'Krashen en práctica: comprensible + emocional = adquisición más feliz.',
      },
    ],
  },
  {
    page: 14,
    title: 'Errores con cariño',
    paragraphs: [
      'Lucía marcaba palabras en rojo suave, no en alarmas, y comentaba con frases cortas: “Esto casi”, “Aquí ajustamos”, “Me gusta tu idea; retamos la forma”. Marta aprendió que corregir también puede ser un abrazo, si el tono lo permite.',
      'Cuando la frustración asomaba, Lucía nombraba el sentimiento sin infantilizar: “Es normal cansarse; el idioma pide constancia, no castigo.” Esa frase le devolvió a Marta el impulso de seguir, no de rendirse.',
      'En lucIA, pensó Marta, la tecnología podría ordenar tareas y rutinas, pero la mirada seguía siendo de persona: alguien que entendía que estudiar español es también sostener una biografía en otra lengua.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Feedback humano',
        body: 'lucIA guarda el espíritu: tecnología para organizar; la mirada sigue siendo de persona.',
      },
    ],
  },
  {
    page: 15,
    title: 'Colombia y “parcero”',
    paragraphs: [
      'Un alumno contó que “parcero” significa amigo en su ciudad, pero no en todas partes, y que a veces una misma palabra cambia de registro si cruzas un barrio o una generación. El mapa del español, dijo Lucía, es un mapa de historias, no solo de fronteras.',
      'Marta imaginó una conversación en un mercado, en un metro, en una novela: el léxico local como huella de comunidad. “Aprender esto es aprender respeto”, añadió alguien en el chat, y Lucía respondió con un corazón simple, sin exagerar el emoji.',
      'La clase cerró el tema con una lista corta de palabras para investigar, no memorizar a la fuerza: curiosidad como método, no ansiedad como jefe.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Léxico local',
        body: '“Parcero/a”: colombianismo frecuente; conviene conocerlo si viajas o lees novelas.',
        anchor: 'parcero',
      },
    ],
  },
  {
    page: 16,
    title: 'Oraciones condicionales',
    paragraphs: [
      'Si practicas tres veces por semana, avanzas con más calma que si te exiges un milagro diario; si practicaras más horas cada día, quizá volarías, pero también te quemarías. Lucía escribió ambas frases y dejó que el contraste hablara solo: real e irreal no son competencia, son herramientas.',
      'El tiempo verbal abre mundos: uno describe probabilidades cotidianas; otro imagina escenarios para reflexionar sin compromiso inmediato. Marta subrayó los verbos y vio el patrón como una melodía, no como una trampa.',
      '“Las condicionales enseñan tacto”, dijo Lucía. “Te enseñan a proponer sin imponer, a sugerir sin asustar.” Marta pensó en su trabajo, en su familia, en su futuro académico: sí, tacto también era español.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Tipo 1 vs 2',
        body: 'Real probable: presente + futuro/futuro. Irreal presente: imperfecto subj + condicional.',
      },
    ],
  },
  {
    page: 17,
    title: 'Pronombres DO / IO',
    paragraphs: [
      '“Te lo digo” — dos pronombres, un orden, una promesa breve. Marta antes los perdía en mitad de la frase, como quien suelta cromos al viento; ahora los buscaba como tesoros pequeños que cerraban el sentido sin repetir palabras de más.',
      'Lucía dibujó flechas en pantalla: objeto directo, indirecto, combinaciones, colocación. El caos se ordenó en esquema, pero luego volvieron a la conversación, porque el esquema sirve para hablar, no para congelarse.',
      'Al practicar oralmente, Marta se equivocó, se rio, repitió, y la corrección llegó sin humillación. “Ahí”, dijo Lucía, “eso es aprender: volver a intentar con la boca, no solo con el cuaderno.”',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Orden clíticos',
        body: 'Combinaciones le/les + lo/la/los/las: reglas de colocación (me lo, te lo, se lo…).',
        anchor: 'Te lo digo',
      },
    ],
  },
  {
    page: 18,
    title: 'Escritura nocturna',
    paragraphs: [
      'Marta escribía tarde, cuando el día dejaba de pedirle cuentas y podía pensar en párrafos largos que, de pronto, se partían en dos como un tronco que encuentra una grieta sana: respiraba mejor, y el lector también.',
      'Lucía leía cada envío y dejaba comentarios que sonaban a conversación, no a robot: preguntas, sugerencias, un “me gusta esto” cuando la idea merecía defensa frente al perfeccionismo.',
      '“Ritmo sintáctico”, escribió Lucía en un margen digital. Las oraciones largas no son delito, pero en oralidad escrita conviene alternar longitudes para que el ojo y el oído no se cansen del mismo modo.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Ritmo sintáctico',
        body: 'Oraciones largas no son malas, pero en oralidad escrita conviene alternar longitudes.',
      },
    ],
  },
  {
    page: 19,
    title: 'Presentación final',
    paragraphs: [
      'El día llegó con café temprano y manos más calmadas de lo esperado. Marta habló de fotografía y memoria, en español, con ejemplos que eligió ella misma y transiciones que ya no sonaban a plantilla robada.',
      'Lucía asintió en los momentos justos, tomó notas discretas y dejó brillar el mérito donde correspondía: no era una clase de aplausos vacíos, era reconocimiento preciso.',
      'Al final, Lucía sonrió con una frase simple que Marta guardaría para siempre: “Esto es tuyo.” No “perfecto”, no “terminaste”: tuyo. Y en esa palabra cabía un mundo entero de estudio compartido.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Competencia discursiva',
        body: 'C1/C2: estructura, transiciones, conclusión con cierre personal (no solo resumen).',
      },
    ],
  },
  {
    page: 20,
    title: 'Epílogo: lucIA',
    paragraphs: [
      'La plataforma no reemplaza la mirada de una profesora: la hace visible en rutinas, lecturas, juegos y pequeños hitos que antes se perdían entre PDFs y chats sueltos. lucIA propone orden sin frialdad, progreso sin humillación, y un puente claro hacia la corrección humana cuando el texto pide matices finos.',
      'Porque aprender español también es compartir vida: el idioma atraviesa trabajo, familia, sueños, errores y abrazos. Eso no se automatiza del todo; se acompaña, se nombra, se practica con paciencia.',
      'Marta cerró el cuaderno y miró la pantalla apagada un segundo. El faro del puerto seguía ahí afuera en su memoria, parpadeando como metáfora cómoda, y ella sonrió: ya no necesitaba metáforas para atreverse a hablar.',
    ],
    notes: [
      {
        id: 'n1',
        title: 'Human-in-the-loop',
        body: 'lucIA organiza y celebra el avance; las correcciones profundas siguen viniendo de Lucía.',
      },
    ],
  },
]
