import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MailOpen,
  MessageCircle,
  Send,
  Clock,
  User,
  ChevronDown,
  CheckCircle2,
  Eye,
  Loader2,
} from 'lucide-react'
import { usePersistListener } from '../../hooks/usePersistListener'
import {
  type TextSubmission,
  type SubmissionStatus,
  PERSIST_EVENT,
} from '../../lib/luciaPersistence'
import {
  fetchSubmissionsForAdmin,
  patchSubmission,
} from '../../services/textSubmissions'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  nuevo: 'Por revisar',
  en_revision: 'En revisión',
  devuelto: 'Devuelto al estudiante',
}

export function AdminBandejaPage() {
  usePersistListener()
  const [rows, setRows] = useState<TextSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const data = await fetchSubmissionsForAdmin()
    setRows(data)
    return data
  }, [])

  useEffect(() => {
    void refresh().finally(() => setLoading(false))
  }, [refresh])

  useEffect(() => {
    const fn = () => void refresh()
    window.addEventListener(PERSIST_EVENT, fn)
    return () => window.removeEventListener(PERSIST_EVENT, fn)
  }, [refresh])

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const t = window.setInterval(() => void refresh(), 30000)
    return () => window.clearInterval(t)
  }, [refresh])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-lucia-ink">Bandeja de textos</h1>
        <p className="mt-2 max-w-2xl text-sm text-lucia-ink/65">
          Abrís cada envío, dejás notas y marcás el estado.{' '}
          {isSupabaseConfigured()
            ? 'Los datos se guardan en Supabase y el estudiante los ve actualizados en el aula.'
            : 'En modo demo todo vive en el navegador de quien envía y el docente debe usar el mismo equipo para verlo.'}
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20 text-lucia-moss">
          <Loader2 className="h-10 w-10 animate-spin" aria-hidden />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-lucia-ink/20 bg-white/80 px-8 py-16 text-center">
          <MailOpen className="mx-auto h-12 w-12 text-lucia-ink/25" />
          <p className="mt-4 font-display text-lg font-bold text-lucia-ink">Aún no hay textos</p>
          <p className="mt-2 text-sm text-lucia-ink/55">
            Cuando un estudiante envíe escritura desde el aula, aparecerá aquí.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((s) => (
            <SubmissionCard
              key={s.id}
              s={s}
              expanded={openId === s.id}
              onToggle={() => setOpenId((id) => (id === s.id ? null : s.id))}
              onRefresh={refresh}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function SubmissionCard({
  s,
  expanded,
  onToggle,
  onRefresh,
}: {
  s: TextSubmission
  expanded: boolean
  onToggle: () => void
  onRefresh: () => Promise<TextSubmission[]>
}) {
  const [comment, setComment] = useState(s.adminComment)
  const [status, setStatus] = useState<SubmissionStatus>(s.status)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setComment(s.adminComment)
    setStatus(s.status)
  }, [s.id, s.adminComment, s.status])

  async function save(patch: Partial<TextSubmission>) {
    setSaving(true)
    try {
      await patchSubmission(s.id, patch)
      await onRefresh()
    } finally {
      setSaving(false)
    }
    if (patch.adminComment !== undefined) setComment(patch.adminComment)
    if (patch.status !== undefined) setStatus(patch.status)
  }

  return (
    <li className="overflow-hidden rounded-2xl border border-lucia-ink/10 bg-white shadow-md ring-1 ring-lucia-ink/5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-lucia-cream/40 md:items-center"
      >
        <span
          className={`mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:mt-0 ${
            s.status === 'devuelto' ? 'bg-lucia-moss/15 text-lucia-moss' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {s.status === 'devuelto' ? <CheckCircle2 className="h-5 w-5" /> : <MailOpen className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold text-lucia-ink">{s.title}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-lucia-ink/50">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {s.studentDisplayName}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {new Date(s.createdAt).toLocaleString('es')}
            </span>
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">{STATUS_LABEL[status]}</span>
          </p>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-lucia-ink/40 transition ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-lucia-ink/10 bg-lucia-cream/30"
          >
            <div className="grid gap-6 p-4 md:grid-cols-2 md:p-6">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lucia-moss">
                  <Eye className="h-4 w-4" />
                  Texto del estudiante
                </p>
                <div className="mt-3 max-h-72 overflow-y-auto rounded-xl bg-white p-4 text-sm leading-relaxed text-lucia-ink/85 shadow-inner ring-1 ring-lucia-ink/10">
                  <p className="whitespace-pre-wrap">{s.body}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-lucia-ink/55">
                    Tu comentario (visible para el estudiante en el aula)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    className="mt-2 w-full resize-y rounded-xl border border-lucia-ink/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lucia-moss/30"
                    placeholder="Ánimo, marcas sobre registro, conectores sugeridos…"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-lucia-ink/55">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => {
                      const next = e.target.value as SubmissionStatus
                      setStatus(next)
                      void save({ status: next })
                    }}
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-lucia-ink/15 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    {(Object.keys(STATUS_LABEL) as SubmissionStatus[]).map((k) => (
                      <option key={k} value={k}>
                        {STATUS_LABEL[k]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save({ adminComment: comment, status: 'en_revision' })}
                    className="inline-flex items-center gap-2 rounded-xl bg-lucia-moss px-4 py-2 text-sm font-bold text-white shadow-md disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                    Guardar borrador
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save({ adminComment: comment, status: 'devuelto' })}
                    className="inline-flex items-center gap-2 rounded-xl border border-lucia-moss bg-white px-4 py-2 text-sm font-bold text-lucia-moss disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    Marcar devuelto
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
