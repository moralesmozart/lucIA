import { useState } from 'react'
import { UserRound } from 'lucide-react'
import { getStudentDisplayName, setStudentDisplayName } from '../../lib/luciaPersistence'
import { usePersistListener } from '../../hooks/usePersistListener'

/** Nombre que aparece en bandeja docente y en el log de ejercicios (persistente en este navegador). */
export function StudentIdentityBar() {
  usePersistListener()
  const [val, setVal] = useState(getStudentDisplayName())
  const [editing, setEditing] = useState(false)

  function save() {
    setStudentDisplayName(val.trim() || 'Estudiante demo')
    setVal(getStudentDisplayName())
    setEditing(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-lucia-ink/10 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-lucia-ink/5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
        <UserRound className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-lucia-ink/45">Tu nombre en lucIA</p>
        {editing ? (
          <div className="mt-1 flex flex-wrap gap-2">
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="min-w-[180px] flex-1 rounded-xl border border-lucia-ink/15 px-3 py-1.5 text-sm font-semibold"
              placeholder="Ej. Mozart · grupo tarde"
            />
            <button
              type="button"
              onClick={save}
              className="rounded-xl bg-lucia-moss px-3 py-1.5 text-xs font-bold text-white"
            >
              Guardar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setVal(getStudentDisplayName())
              setEditing(true)
            }}
            className="mt-0.5 text-left font-display text-lg font-bold text-lucia-ink hover:text-lucia-moss"
          >
            {getStudentDisplayName()}
            <span className="ml-2 text-xs font-normal text-lucia-moss">Editar</span>
          </button>
        )}
      </div>
    </div>
  )
}
