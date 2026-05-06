import { useState } from 'react'
import { CalendarClock, ExternalLink, Link2 } from 'lucide-react'
import { usePersistListener } from '../../hooks/usePersistListener'
import {
  deleteScheduledSession,
  listScheduledSessions,
  upsertScheduledSession,
  type ScheduledSession,
} from '../../lib/luciaPersistence'

export function AdminAgendaPage() {
  usePersistListener()
  const sessions = listScheduledSessions()
  const [student, setStudent] = useState('')
  const [title, setTitle] = useState('Clase 1:1')
  const [notes, setNotes] = useState('')
  const [datetime, setDatetime] = useState('')

  function addSession() {
    if (!student.trim() || !datetime) return
    const row: ScheduledSession = {
      id: crypto.randomUUID(),
      studentDisplayName: student.trim(),
      title: title.trim() || 'Clase',
      notes: notes.trim(),
      startsAt: new Date(datetime).toISOString(),
    }
    upsertScheduledSession(row)
    setNotes('')
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-lucia-ink">Agenda</h1>
        <p className="mt-2 max-w-2xl text-sm text-lucia-ink/65">
          Planificá clases con nombre del estudiante y recordatorios. La integración con Google Calendar llega en un
          siguiente paso técnico (OAuth + eventos).
        </p>
      </header>

      <section className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-white p-6 shadow-inner">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-lucia-ink">
          <Link2 className="h-5 w-5 text-sky-600" />
          Conectar Google Calendar
        </h2>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-lucia-ink/75">
          <li>Crear proyecto en Google Cloud Console y activar Google Calendar API.</li>
          <li>Configurar pantalla OAuth y obtener client ID (web / apps internas).</li>
          <li>
            En producción con Supabase: Edge Function o backend que cree eventos con el token del admin (nunca en el
            navegador expuesto).
          </li>
          <li>Mapear cada fila de esta agenda a <code className="rounded bg-white/80 px-1">google_event_id</code> en la base (ver migración SQL).</li>
        </ol>
        <a
          href="https://developers.google.com/calendar/api/guides/overview"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:underline"
        >
          Documentación oficial
          <ExternalLink className="h-4 w-4" />
        </a>
      </section>

      <section className="rounded-2xl border border-lucia-ink/10 bg-white p-6 shadow-md">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-lucia-ink">
          <CalendarClock className="h-5 w-5 text-lucia-coral" />
          Añadir sesión local
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-lucia-ink">
            Estudiante
            <input
              value={student}
              onChange={(e) => setStudent(e.target.value)}
              className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-bold text-lucia-ink">
            Título
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-bold text-lucia-ink sm:col-span-2">
            Fecha y hora (local)
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-bold text-lucia-ink sm:col-span-2">
            Notas
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={addSession}
          className="mt-4 rounded-xl bg-lucia-coral px-4 py-2.5 text-sm font-bold text-white shadow-md"
        >
          Guardar en agenda local
        </button>
      </section>

      <ul className="space-y-2">
        {sessions.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-lucia-ink/15 py-12 text-center text-sm text-lucia-ink/45">
            No hay sesiones. Añadí la primera arriba.
          </li>
        ) : (
          sessions.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-lucia-ink/10 bg-white px-4 py-3 shadow-sm"
            >
              <div>
                <p className="font-display font-bold text-lucia-ink">{s.title}</p>
                <p className="text-sm text-lucia-ink/60">
                  {s.studentDisplayName} · {new Date(s.startsAt).toLocaleString('es')}
                </p>
                {s.notes && <p className="mt-1 text-sm text-lucia-ink/55">{s.notes}</p>}
              </div>
              <button
                type="button"
                onClick={() => deleteScheduledSession(s.id)}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
