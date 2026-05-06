import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Send,
  Eye,
  CheckCircle2,
  MessageSquare,
  Highlighter,
  Mic,
  Loader2,
  PenLine,
} from 'lucide-react'
import {
  type TextSubmission,
  PERSIST_EVENT,
  listMineSubmissionsLocal,
} from '../../lib/luciaPersistence'
import { usePersistListener } from '../../hooks/usePersistListener'
import {
  createStudentSubmission,
  fetchSubmissionsForStudent,
} from '../../services/textSubmissions'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

export function WritingBlock() {
  usePersistListener()
  const [mine, setMine] = useState<TextSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [draftMode, setDraftMode] = useState(false)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const refreshMine = useCallback(async () => {
    try {
      const rows = await fetchSubmissionsForStudent()
      setMine(rows)
      return rows
    } catch {
      const fallback = listMineSubmissionsLocal()
      setMine(fallback)
      return fallback
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const rows = await refreshMine()
      if (!cancelled && rows.length > 0) {
        setDraftMode(false)
        setFocusId(rows[0]!.id)
      }
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshMine])

  useEffect(() => {
    const fn = () => {
      void refreshMine()
    }
    window.addEventListener(PERSIST_EVENT, fn)
    const onVis = () => {
      if (document.visibilityState === 'visible') void refreshMine()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener(PERSIST_EVENT, fn)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [refreshMine])

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const t = window.setInterval(() => void refreshMine(), 25000)
    return () => window.clearInterval(t)
  }, [refreshMine])

  const selectedId = draftMode ? null : focusId ?? mine[0]?.id ?? null
  const active =
    selectedId !== null ? mine.find((s) => s.id === selectedId) ?? mine[0] : mine[0]

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) return
    setSubmitting(true)
    try {
      const row = await createStudentSubmission(title.trim(), body.trim())
      await refreshMine()
      setFocusId(row.id)
      setDraftMode(false)
      setTitle('')
      setBody('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-3xl border border-lucia-ink/10 bg-white p-6 shadow-lg md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-lucia-ink">Escritura con Lucía</h2>
          <p className="mt-1 max-w-2xl text-sm text-lucia-ink/65">
            Tu texto queda guardado en{' '}
            <strong>{isSupabaseConfigured() ? 'Supabase (nube)' : 'este navegador'}</strong> y lo ves aquí abajo.
            También llega a la bandeja del panel docente.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center py-12 text-lucia-moss">
          <Loader2 className="h-10 w-10 animate-spin" aria-hidden />
        </div>
      ) : (
        <>
          {mine.length > 0 && (
            <div className="mt-6 rounded-2xl border border-lucia-ink/10 bg-lucia-cream/40 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-lucia-ink/45">
                Tus envíos ({mine.length})
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mine.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setFocusId(s.id)
                      setDraftMode(false)
                    }}
                    className={`max-w-full truncate rounded-full px-4 py-2 text-left text-xs font-bold transition ${
                      selectedId === s.id
                        ? 'bg-lucia-moss text-white shadow-md'
                        : 'bg-white text-lucia-ink ring-1 ring-lucia-ink/10 hover:ring-lucia-moss/40'
                    }`}
                  >
                    {s.title}
                    <span className="ml-2 font-normal opacity-80">
                      ·{' '}
                      {s.status === 'devuelto'
                        ? 'Devuelto'
                        : s.status === 'en_revision'
                          ? 'En revisión'
                          : 'Enviado'}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDraftMode(true)}
                  className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-lucia-moss/40 px-4 py-2 text-xs font-bold text-lucia-moss hover:bg-white"
                >
                  <PenLine className="h-4 w-4" />
                  Nuevo texto
                </button>
              </div>
            </div>
          )}

          {draftMode || mine.length === 0 ? (
            <Composer
              title={title}
              setTitle={setTitle}
              body={body}
              setBody={setBody}
              onSubmit={() => void handleSubmit()}
              submitting={submitting}
              mineEmpty={mine.length === 0}
            />
          ) : active ? (
            <SubmissionView
              submission={active}
              onWriteAnother={() => {
                setDraftMode(true)
                setTitle('')
                setBody('')
              }}
            />
          ) : (
            <Composer
              title={title}
              setTitle={setTitle}
              body={body}
              setBody={setBody}
              onSubmit={() => void handleSubmit()}
              submitting={submitting}
              mineEmpty
            />
          )}
        </>
      )}
    </section>
  )
}

function Composer({
  title,
  setTitle,
  body,
  setBody,
  onSubmit,
  submitting,
  mineEmpty,
}: {
  title: string
  setTitle: (s: string) => void
  body: string
  setBody: (s: string) => void
  onSubmit: () => void
  submitting: boolean
  mineEmpty: boolean
}) {
  return (
    <div className="mt-6 space-y-4">
      {!mineEmpty && (
        <p className="text-sm font-semibold text-lucia-moss">
          Redactá un nuevo texto para enviarlo a la bandeja.
        </p>
      )}
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
        onClick={onSubmit}
        disabled={!title.trim() || !body.trim() || submitting}
        className="inline-flex items-center gap-2 rounded-2xl bg-lucia-coral px-5 py-3 font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        ) : (
          <Send className="h-5 w-5" />
        )}
        {submitting ? 'Enviando…' : 'Enviar a la bandeja'}
      </button>
    </div>
  )
}

function SubmissionView({
  submission,
  onWriteAnother,
}: {
  submission: TextSubmission
  onWriteAnother: () => void
}) {
  usePersistListener()
  const s = submission

  const opened = s.status !== 'nuevo'
  const reviewed = s.status === 'devuelto' || s.adminComment.trim().length > 0

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <motion.div layout className="rounded-2xl border border-lucia-ink/10 bg-lucia-cream/50 p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-lucia-ink">
          <FileText className="h-4 w-4 text-lucia-moss" />
          {s.title}
        </div>
        <p className="mt-3 whitespace-pre-wrap text-lucia-ink/85">{s.body}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <StatusPill icon={Eye} label="En bandeja / en curso" active={opened} />
          <StatusPill icon={CheckCircle2} label="Tiene respuesta docente" active={reviewed} />
        </div>
        <button
          type="button"
          onClick={onWriteAnother}
          className="mt-4 text-sm font-bold text-lucia-moss underline-offset-2 hover:underline"
        >
          Enviar otro texto
        </button>
      </motion.div>
      <AnimatePresence>
        {(s.adminComment.trim() || s.status === 'devuelto') && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 rounded-2xl border border-lucia-moss/20 bg-lucia-moss/5 p-5"
          >
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-lucia-ink">
              <MessageSquare className="h-5 w-5 text-lucia-moss" />
              Comentarios del equipo
            </h3>
            {s.adminComment.trim() ? (
              <div className="rounded-xl bg-white/90 p-3 text-sm ring-1 ring-lucia-ink/10">
                <p className="whitespace-pre-wrap text-lucia-ink/85">{s.adminComment}</p>
              </div>
            ) : (
              <p className="text-sm text-lucia-ink/55">Marcado como devuelto sin nota todavía.</p>
            )}
            <div className="rounded-xl bg-white/90 p-3 text-sm ring-1 ring-lucia-ink/10">
              <p className="flex items-center gap-2 font-semibold text-lucia-moss">
                <Highlighter className="h-4 w-4" />
                Próximo paso
              </p>
              <p className="mt-2 text-lucia-ink/80">
                Revisá las sugerencias, reescribí un párrafo y volvé a enviar cuando quieras.
              </p>
            </div>
            <div className="rounded-xl bg-white/90 p-3 text-sm ring-1 ring-lucia-ink/10">
              <p className="flex items-center gap-2 font-semibold text-lucia-coral">
                <Mic className="h-4 w-4" />
                Audio en producción
              </p>
              <p className="mt-2 text-lucia-ink/80">
                En lucIA completo podrás adjuntar notas de voz desde el panel docente.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
