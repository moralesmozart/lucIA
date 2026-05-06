import { Download } from 'lucide-react'
import { usePersistListener } from '../../hooks/usePersistListener'
import { listAttempts } from '../../lib/luciaPersistence'

export function AdminEjerciciosPage() {
  usePersistListener()
  const attempts = listAttempts()

  function csv() {
    const header = ['fecha', 'estudiante', 'ejercicio', 'nivel', 'acierto', 'puntos']
    const lines = attempts.map((a) =>
      [
        a.attemptedAt,
        a.studentDisplayName,
        a.exerciseSummary.replace(/,/g, ';'),
        a.level,
        a.correct ? 'sí' : 'no',
        String(a.scorePercent),
      ].join(','),
    )
    const blob = new Blob([[header.join(','), ...lines].join('\n')], {
      type: 'text/csv;charset=utf-8',
    })
    const u = URL.createObjectURL(blob)
    const el = document.createElement('a')
    el.href = u
    el.download = `lucia-intentos-${new Date().toISOString().slice(0, 10)}.csv`
    el.click()
    URL.revokeObjectURL(u)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-lucia-ink">Registro de ejercicios</h1>
          <p className="mt-2 max-w-2xl text-sm text-lucia-ink/65">
            Cada vez que un estudiante pulsa «Comprobar» en el quiz, guardamos nivel, resultado y momento. Ideal para
            ver constancia antes de integrar Supabase.
          </p>
        </div>
        <button
          type="button"
          onClick={csv}
          disabled={attempts.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-lucia-ink/15 bg-white px-4 py-2 text-sm font-bold text-lucia-ink shadow-sm disabled:opacity-40"
        >
          <Download className="h-4 w-4" />
          CSV
        </button>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-lucia-ink/10 bg-white shadow-md">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-lucia-ink/10 bg-lucia-cream/60 text-xs font-bold uppercase tracking-wider text-lucia-ink/55">
            <tr>
              <th className="px-4 py-3">Fecha y hora</th>
              <th className="px-4 py-3">Estudiante</th>
              <th className="px-4 py-3">Ejercicio</th>
              <th className="px-4 py-3">Nivel</th>
              <th className="px-4 py-3">Resultado</th>
              <th className="px-4 py-3">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {attempts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-lucia-ink/45">
                  Sin intentos todavía. Jugá un quiz en el aula con la sesión de estudiante abierta.
                </td>
              </tr>
            ) : (
              attempts.map((a) => (
                <tr key={a.id} className="border-b border-lucia-ink/5 hover:bg-violet-50/40">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-lucia-ink/80">
                    {new Date(a.attemptedAt).toLocaleString('es')}
                  </td>
                  <td className="px-4 py-3 font-semibold text-lucia-ink">{a.studentDisplayName}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-lucia-ink/75">{a.exerciseSummary}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-lucia-gold/35 px-2 py-0.5 text-xs font-bold">{a.level}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${a.correct ? 'text-lucia-moss' : 'text-red-600'}`}
                    >
                      {a.correct ? 'Correcto' : 'A revisar'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-lucia-ink">{a.scorePercent}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
