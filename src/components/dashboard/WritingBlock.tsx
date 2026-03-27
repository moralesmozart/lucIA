import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Send,
  Eye,
  CheckCircle2,
  MessageSquare,
  Highlighter,
  Mic,
} from 'lucide-react'

type Submitted = {
  title: string
  body: string
  opened: boolean
  reviewed: boolean
}

export function WritingBlock() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitted, setSubmitted] = useState<Submitted | null>(null)

  function handleSubmit() {
    if (!title.trim() || !body.trim()) return
    setSubmitted({
      title: title.trim(),
      body: body.trim(),
      opened: false,
      reviewed: false,
    })
    setTimeout(() => {
      setSubmitted((s) => (s ? { ...s, opened: true } : s))
    }, 1200)
    setTimeout(() => {
      setSubmitted((s) => (s ? { ...s, reviewed: true } : s))
    }, 2800)
  }

  return (
    <section className="rounded-3xl border border-lucia-ink/10 bg-white p-6 shadow-lg md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-lucia-ink">Escritura con Lucía</h2>
          <p className="mt-1 max-w-2xl text-sm text-lucia-ink/65">
            Escribe como en un documento y envía. Lucía lee, marca dudas y te devuelve comentarios en texto o
            audio — <strong>sin IA sustituyendo su mirada</strong> (demo simulada).
          </p>
        </div>
      </div>

      {!submitted ? (
        <div className="mt-6 space-y-4">
          <input
            placeholder="Título del texto"
            className="w-full rounded-2xl border border-lucia-ink/15 bg-lucia-cream/40 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-lucia-moss/40"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="min-h-[200px] w-full resize-y rounded-2xl border border-lucia-ink/15 bg-white px-4 py-3 font-sans leading-relaxed outline-none focus:ring-2 focus:ring-lucia-moss/40"
            placeholder="Escribe aquí tu texto para la corrección..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-lucia-coral px-5 py-3 font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
            Enviar a Lucía
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <motion.div
            layout
            className="rounded-2xl border border-lucia-ink/10 bg-lucia-cream/50 p-5"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-lucia-ink">
              <FileText className="h-4 w-4 text-lucia-moss" />
              {submitted.title}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-lucia-ink/85">{submitted.body}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <StatusPill
                icon={Eye}
                label="Lucía abrió el texto"
                active={submitted.opened}
              />
              <StatusPill
                icon={CheckCircle2}
                label="Primera revisión"
                active={submitted.reviewed}
              />
            </div>
          </motion.div>
          <AnimatePresence>
            {submitted.reviewed && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4 rounded-2xl border border-lucia-moss/20 bg-lucia-moss/5 p-5"
              >
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-lucia-ink">
                  <MessageSquare className="h-5 w-5 text-lucia-moss" />
                  Vista profesora (demo)
                </h3>
                <div className="rounded-xl bg-white/90 p-3 text-sm ring-1 ring-lucia-ink/10">
                  <p className="flex items-center gap-2 font-semibold text-lucia-moss">
                    <Highlighter className="h-4 w-4" />
                    Marcas sugeridas
                  </p>
                  <p className="mt-2 text-lucia-ink/80">
                    “…<span className="bg-amber-200/80 px-0.5">pollo asado</span>” — concordancia perfecta
                    aquí; cuidado con el registro si es texto académico.
                  </p>
                </div>
                <div className="rounded-xl bg-white/90 p-3 text-sm ring-1 ring-lucia-ink/10">
                  <p className="flex items-center gap-2 font-semibold text-lucia-coral">
                    <Mic className="h-4 w-4" />
                    Comentario final (audio simulado)
                  </p>
                  <p className="mt-2 text-lucia-ink/80">
                    “Me encanta el tono. Para C2, añade un conector más formal en la última frase. Te mando
                    nota de voz en la versión real de lucIA.”
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

function StatusPill({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Eye
  label: string
  active: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
        active ? 'bg-lucia-moss text-white' : 'bg-lucia-ink/10 text-lucia-ink/40'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}
