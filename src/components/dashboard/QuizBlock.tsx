import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Check, X, Link2 } from 'lucide-react'
import {
  type Level,
  type Exercise,
  exercisesForLevel,
} from '../../data/exercises'
import { addAttempt, getStudentDisplayName } from '../../lib/luciaPersistence'

const LEVELS: (Level | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export function QuizBlock() {
  const [filter, setFilter] = useState<Level | 'all'>('A1')
  const list = useMemo(() => exercisesForLevel(filter), [filter])
  const [idx, setIdx] = useState(0)
  const ex = list[idx % list.length]

  const [picked, setPicked] = useState<number | null>(null)
  const [fillVal, setFillVal] = useState('')
  const [matchSel, setMatchSel] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'ok' | 'no' | null>(null)

  function resetInputs() {
    setPicked(null)
    setFillVal('')
    setMatchSel([])
    setFeedback(null)
  }

  function next() {
    setIdx((i) => (i + 1) % list.length)
    resetInputs()
  }

  function exerciseSummary(exercise: Exercise): string {
    if (exercise.kind === 'choice') return exercise.prompt.slice(0, 120)
    if (exercise.kind === 'fill') return exercise.template.slice(0, 120)
    return `Empareja (${exercise.left.length} ítems)`
  }

  function check(exercise: Exercise) {
    let ok = false
    if (exercise.kind === 'choice') {
      if (picked === null) return
      ok = picked === exercise.correctIndex
      setFeedback(ok ? 'ok' : 'no')
    } else if (exercise.kind === 'fill') {
      const v = fillVal.trim().toLowerCase()
      ok = exercise.answers.some((a) => a.toLowerCase() === v)
      setFeedback(ok ? 'ok' : 'no')
    } else {
      if (matchSel.length !== exercise.left.length) return
      ok = matchSel.every((r, li) => r === exercise.solution[li])
      setFeedback(ok ? 'ok' : 'no')
    }
    addAttempt({
      studentDisplayName: getStudentDisplayName(),
      exerciseId: exercise.id,
      exerciseSummary: exerciseSummary(exercise),
      level: exercise.level,
      correct: ok,
      scorePercent: ok ? 100 : 0,
    })
  }

  return (
    <section className="rounded-3xl border border-lucia-ink/10 bg-white p-6 shadow-lg md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-lucia-ink">Sesiones de quiz</h2>
          <p className="mt-1 text-sm text-lucia-ink/65">
            {exercisesForLevel('all').length} ejercicios repartidos en niveles A1–C2 · estilo rápido y
            colorido.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
          <Brain className="h-4 w-4" />
          Demo local
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {LEVELS.map((lv) => (
          <button
            key={lv}
            type="button"
            onClick={() => {
              setFilter(lv)
              setIdx(0)
              resetInputs()
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filter === lv
                ? 'bg-lucia-gold text-lucia-ink shadow-md'
                : 'bg-lucia-ink/5 text-lucia-ink/60 hover:bg-lucia-ink/10'
            }`}
          >
            {lv === 'all' ? 'Todos' : lv}
          </button>
        ))}
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-lucia-ink/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-lucia-moss to-lucia-sky"
          animate={{ width: `${((idx + 1) / list.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120 }}
        />
      </div>
      <p className="mt-1 text-xs text-lucia-ink/45">
        Progreso de sesión · ejercicio {idx + 1} de {list.length} (filtro actual)
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={ex.id + String(idx)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-6 rounded-2xl border-2 border-dashed border-lucia-moss/30 bg-gradient-to-br from-white to-lucia-cream/80 p-6"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-lucia-moss">
            {ex.level} · {ex.kind === 'choice' ? 'Opción múltiple' : ex.kind === 'fill' ? 'Completa' : 'Empareja'}
          </p>
          {ex.kind === 'choice' && (
            <ChoiceView
              ex={ex}
              picked={picked}
              setPicked={setPicked}
              feedback={feedback}
            />
          )}
          {ex.kind === 'fill' && (
            <FillView ex={ex} value={fillVal} setValue={setFillVal} feedback={feedback} />
          )}
          {ex.kind === 'match' && (
            <MatchView
              ex={ex}
              matchSel={matchSel}
              setMatchSel={setMatchSel}
              feedback={feedback}
            />
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => check(ex)}
              className="rounded-2xl bg-lucia-moss px-5 py-2.5 font-bold text-white shadow-md"
            >
              Comprobar
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-2xl border border-lucia-ink/15 px-5 py-2.5 font-bold text-lucia-ink hover:bg-white"
            >
              Siguiente
            </button>
          </div>
          {feedback === 'ok' && (
            <p className="mt-3 flex items-center gap-2 font-bold text-lucia-moss">
              <Check className="h-5 w-5" /> ¡Muy bien!
            </p>
          )}
          {feedback === 'no' && (
            <p className="mt-3 flex items-center gap-2 font-bold text-red-600">
              <X className="h-5 w-5" /> Revisa e inténtalo de nuevo.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function ChoiceView({
  ex,
  picked,
  setPicked,
  feedback,
}: {
  ex: Extract<Exercise, { kind: 'choice' }>
  picked: number | null
  setPicked: (n: number) => void
  feedback: 'ok' | 'no' | null
}) {
  return (
    <>
      <p className="mt-3 font-display text-xl font-bold text-lucia-ink">{ex.prompt}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {ex.options.map((opt, i) => {
          const selected = picked === i
          const show =
            feedback &&
            (i === ex.correctIndex ? 'correct' : selected && i !== ex.correctIndex ? 'wrong' : null)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setPicked(i)}
              className={`rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${
                show === 'correct'
                  ? 'border-lucia-moss bg-lucia-moss/15'
                  : show === 'wrong'
                    ? 'border-red-400 bg-red-50'
                    : selected
                      ? 'border-lucia-gold bg-lucia-gold/20'
                      : 'border-lucia-ink/10 bg-white hover:border-lucia-moss/40'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </>
  )
}

function FillView({
  ex,
  value,
  setValue,
  feedback,
}: {
  ex: Extract<Exercise, { kind: 'fill' }>
  value: string
  setValue: (s: string) => void
  feedback: 'ok' | 'no' | null
}) {
  return (
    <>
      <p className="mt-3 font-display text-xl font-bold text-lucia-ink">{ex.template}</p>
      {ex.hint && <p className="mt-2 text-sm text-lucia-ink/55">Pista: {ex.hint}</p>}
      <input
        className={`mt-4 w-full rounded-2xl border-2 px-4 py-3 font-semibold outline-none ${
          feedback === 'no' ? 'border-red-300' : 'border-lucia-ink/15'
        }`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tu respuesta"
      />
    </>
  )
}

function MatchView({
  ex,
  matchSel,
  setMatchSel,
  feedback,
}: {
  ex: Extract<Exercise, { kind: 'match' }>
  matchSel: number[]
  setMatchSel: (v: number[]) => void
  feedback: 'ok' | 'no' | null
}) {
  const sel = matchSel.length ? matchSel : ex.left.map(() => -1)
  return (
    <>
      <p className="mt-3 flex items-center gap-2 font-display text-lg font-bold text-lucia-ink">
        <Link2 className="h-5 w-5 text-lucia-sky" />
        Une cada elemento de la izquierda con su pareja
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ul className="space-y-2">
          {ex.left.map((l, li) => (
            <li
              key={l}
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold ring-1 ring-lucia-ink/10"
            >
              {li + 1}. {l}
            </li>
          ))}
        </ul>
        <div className="space-y-2">
          {ex.left.map((_, li) => (
            <select
              key={li}
              className="w-full rounded-xl border border-lucia-ink/15 bg-lucia-cream/40 px-3 py-2 text-sm font-semibold"
              value={sel[li] ?? -1}
              onChange={(e) => {
                const v = Number(e.target.value)
                const next = [...(matchSel.length ? matchSel : ex.left.map(() => -1))]
                next[li] = v
                setMatchSel(next)
              }}
            >
              <option value={-1}>Elige pareja…</option>
              {ex.right.map((r, ri) => (
                <option key={r} value={ri}>
                  {r}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>
      {feedback === 'no' && (
        <p className="mt-2 text-sm text-red-600">Alguna pareja no coincide. ¡Revisa!</p>
      )}
    </>
  )
}
