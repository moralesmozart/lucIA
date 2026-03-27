import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Heart,
  MessageCircle,
  BookOpen,
  Trophy,
  Camera,
  Globe2,
  ArrowRight,
  Quote,
} from 'lucide-react'

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5 },
}

export function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 md:pt-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lucia-gold/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-40 h-64 w-64 rounded-full bg-lucia-sky/25 blur-3xl" />
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <motion.p
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-lucia-moss shadow-sm"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Globe2 className="h-4 w-4" />
              Español real · +200 estudiantes · A1 → C2
            </motion.p>
            <motion.h1
              className="font-display text-4xl font-bold leading-tight text-lucia-ink md:text-5xl lg:text-6xl text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              Aprende español con calidez, rigor y conversaciones que importan.
            </motion.h1>
            <motion.p
              className="mt-6 max-w-xl text-lg text-lucia-ink/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <strong className="text-lucia-ink">lucIA</strong> es el espacio donde tu progreso se ve,
              donde practicas con juegos y lecturas, y donde{' '}
              <strong className="text-lucia-coral">Lucía</strong> —fotógrafa, cineasta y profesora— sigue
              leyendo tus textos con ojos humanos, no de robot.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-lucia-coral px-6 py-3 text-base font-bold text-white shadow-lg shadow-lucia-coral/35 transition hover:brightness-105"
              >
                Probar demo
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#lucia"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-lucia-ink/15 bg-white/70 px-6 py-3 font-bold text-lucia-ink hover:bg-white"
              >
                Conocer a Lucía
              </a>
            </motion.div>
          </div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-lucia-ink/10 bg-gradient-to-br from-lucia-moss via-lucia-moss to-lucia-sky p-1 shadow-2xl shadow-lucia-moss/20">
              <div className="rounded-[1.85rem] bg-lucia-cream p-8 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-lucia-moss">Tu racha</p>
                    <p className="font-display text-5xl font-bold text-lucia-ink">12</p>
                    <p className="text-sm text-lucia-ink/60">días seguidos (demo)</p>
                  </div>
                  <Trophy className="h-12 w-12 text-lucia-gold" />
                </div>
                <div className="mt-8 space-y-3">
                  {['Escritura con Lucía', 'Quiz C1', 'Lectura: “Amanece en el puerto”'].map((t, i) => (
                    <div
                      key={t}
                      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-lucia-ink/5"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lucia-gold/30 text-sm font-bold text-lucia-ink">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-lucia-ink/90">{t}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-xs text-lucia-ink/50">
                  Estilo “aprender jugando” · sin perder el contacto humano
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="por-que" className="bg-white/70 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div {...fade}>
            <h2 className="font-display text-3xl font-bold text-lucia-ink md:text-4xl text-balance">
              Por qué existe <span className="text-lucia-coral">lucIA</span>
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-lucia-ink/75">
              Lucía lleva años acompañando a personas de todo el mundo desde cero hasta C2. Su método mezcla
              gramática sólida, conversación auténtica y curiosidad genuina por la vida de quien estudia.
              lucIA nace para que ese acompañamiento tenga un hogar digital: progreso visible, rutinas claras y
              siempre un puente hacia la corrección humana.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Heart,
                title: 'Centrado en personas',
                body: 'La tecnología organiza; la mirada de Lucía orienta. Menos frío, más conversación.',
                color: 'bg-rose-100 text-rose-600',
              },
              {
                icon: MessageCircle,
                title: 'Habla de verdad',
                body: 'Temas reales: presentaciones C2, el día a día, cultura de España y Latinoamérica.',
                color: 'bg-sky-100 text-sky-600',
              },
              {
                icon: BookOpen,
                title: 'Lectura con notas',
                body: 'Libros y apuntes con cajas al margen: léxico, registro y matices por país.',
                color: 'bg-amber-100 text-amber-700',
              },
            ].map((c) => (
              <motion.div
                key={c.title}
                {...fade}
                className="rounded-3xl border border-lucia-ink/10 bg-lucia-cream/80 p-6 shadow-sm"
              >
                <div className={`inline-flex rounded-2xl p-3 ${c.color}`}>
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-lucia-ink">{c.title}</h3>
                <p className="mt-2 text-lucia-ink/70">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="lucia" className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div {...fade}>
            <h2 className="font-display text-3xl font-bold text-lucia-ink md:text-4xl">Quién es Lucía</h2>
            <p className="mt-4 text-lg text-lucia-ink/75">
              Lucía Alonso es <strong>fotógrafa y cineasta</strong> —puedes ver su mirada en{' '}
              <a
                href="https://www.luciaalonso.net/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-lucia-moss underline-offset-2 hover:underline"
              >
                luciaalonso.net
              </a>
              — y profesora de español con cientos de estudiantes online. En sus clases no solo “explica la
              lección”: comparte trozos de su mundo, escucha el tuyo y convierte el idioma en un lugar
              habitable.
            </p>
            <ul className="mt-6 space-y-3 text-lucia-ink/80">
              <li className="flex gap-3">
                <Camera className="mt-0.5 h-5 w-5 shrink-0 text-lucia-coral" />
                Sensibilidad visual y narrativa: útil para presentaciones y escritura creativa.
              </li>
              <li className="flex gap-3">
                <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-lucia-moss" />
                Acompañamiento de principiante absoluto hasta C2, con foco en tu objetivo real.
              </li>
            </ul>
            <p className="mt-6 text-center text-sm font-semibold uppercase tracking-widest text-lucia-ink/45">
              Fotografía · Cine · Español
            </p>
          </motion.div>
        </div>
      </section>

      <section id="testimonios" className="bg-lucia-moss/10 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2
            {...fade}
            className="font-display text-3xl font-bold text-lucia-ink md:text-4xl"
          >
            Voces de estudiantes
          </motion.h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                q: 'Pasé de bloquearme en presentaciones a disfrutarlas. Lucía ensaya contigo como si fuera el día D.',
                a: 'Mozart · meta C2',
              },
              {
                q: 'No es una app más: es alguien que te lee y te corrige con cariño. Eso acelera todo.',
                a: 'Estudiante demo · B2',
              },
              {
                q: 'Mezcla cultura, risas y gramática sin humillarte por los errores. Eso es raro y valioso.',
                a: 'Estudiante demo · A2',
              },
            ].map((t) => (
              <motion.figure
                key={t.a}
                {...fade}
                className="flex h-full flex-col rounded-3xl border border-lucia-ink/10 bg-white p-6 shadow-md"
              >
                <Quote className="h-8 w-8 text-lucia-gold" />
                <blockquote className="mt-3 flex-1 text-lucia-ink/85">“{t.q}”</blockquote>
                <figcaption className="mt-4 text-sm font-bold text-lucia-moss">{t.a}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-gradient-to-r from-lucia-coral to-lucia-gold p-[2px] shadow-xl">
          <div className="rounded-[1.9rem] bg-lucia-ink px-8 py-12 text-center text-white">
            <h2 className="font-display text-3xl font-bold">Entra al aula demo</h2>
            <p className="mt-3 text-white/80">
              Usuario y contraseña: <code className="rounded bg-white/10 px-2 py-0.5">lucIA</code> · Explora
              escritura, quizzes, lectura gamificada y calendario.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3 font-bold text-lucia-ink hover:bg-lucia-cream"
            >
              Ir al login
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
