import { useMemo } from 'react'
import { CalendarDays, Clock, PartyPopper } from 'lucide-react'
import { DEMO_BOOKED, SPANISH_WORLD_HOLIDAYS } from '../../data/holidays'

const MONTH = 2
const YEAR = 2026

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}

function startWeekday(y: number, m: number) {
  return new Date(y, m, 1).getDay()
}

export function CalendarBlock() {
  const dim = daysInMonth(YEAR, MONTH)
  const start = startWeekday(YEAR, MONTH)
  const cells = useMemo(() => {
    const arr: (number | null)[] = []
    for (let i = 0; i < start; i++) arr.push(null)
    for (let d = 1; d <= dim; d++) arr.push(d)
    return arr
  }, [dim, start])

  const holidayMap = useMemo(() => {
    const m: Record<string, typeof SPANISH_WORLD_HOLIDAYS> = {}
    for (const h of SPANISH_WORLD_HOLIDAYS) {
      const [hm, hd] = h.date.split('-').map(Number)
      if (hm === MONTH + 1) {
        const key = String(hd)
        m[key] = m[key] ? [...m[key], h] : [h]
      }
    }
    return m
  }, [])

  const classMap = useMemo(() => {
    const m: Record<string, (typeof DEMO_BOOKED)[0][]> = {}
    for (const c of DEMO_BOOKED) {
      const d = new Date(c.date + 'T12:00:00')
      if (d.getFullYear() === YEAR && d.getMonth() === MONTH) {
        const key = String(d.getDate())
        m[key] = m[key] ? [...m[key], c] : [c]
      }
    }
    return m
  }, [])

  return (
    <section className="rounded-3xl border border-lucia-ink/10 bg-white p-6 shadow-lg md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-lucia-ink">
            <CalendarDays className="h-7 w-7 text-lucia-sky" />
            Calendario
          </h2>
          <p className="mt-1 text-sm text-lucia-ink/65">
            Clases reservadas (demo) y fechas señaladas en el mundo hispanohablante.
          </p>
        </div>
        <div className="rounded-2xl bg-lucia-sky/15 px-4 py-2 text-center">
          <p className="text-xs font-bold uppercase text-lucia-ink/50">Vista</p>
          <p className="font-display text-lg font-bold text-lucia-ink">
            {monthNames[MONTH]} {YEAR}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-lucia-ink/40">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={`e-${i}`} className="aspect-square" />
              const key = String(d)
              const hol = holidayMap[key]
              const cls = classMap[key]
              return (
                <div
                  key={d}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-sm font-bold ${
                    cls?.length
                      ? 'border-lucia-moss bg-lucia-moss/15 text-lucia-moss'
                      : hol?.length
                        ? 'border-lucia-gold bg-lucia-gold/20 text-lucia-ink'
                        : 'border-lucia-ink/10 bg-lucia-cream/30 text-lucia-ink/70'
                  }`}
                >
                  {d}
                  {hol?.length ? <PartyPopper className="mt-0.5 h-3 w-3" /> : null}
                  {cls?.length ? <Clock className="mt-0.5 h-3 w-3" /> : null}
                </div>
              )
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase text-lucia-moss">Próximas clases (demo)</p>
            <ul className="mt-2 space-y-2">
              {DEMO_BOOKED.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-lucia-moss/20 bg-lucia-moss/5 px-3 py-2 text-sm"
                >
                  <span className="font-bold text-lucia-ink">{c.title}</span>
                  <span className="mt-1 block text-xs text-lucia-ink/60">
                    {c.date} · {c.time} · {c.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-lucia-gold">Fiestas del mes (muestra)</p>
            <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto text-sm">
              {SPANISH_WORLD_HOLIDAYS.filter((h) => {
                const [m] = h.date.split('-').map(Number)
                return m === MONTH + 1
              }).map((h) => (
                <li key={h.date + h.label} className="flex gap-2 rounded-lg bg-amber-50/80 px-2 py-1">
                  <span>{h.flag}</span>
                  <span>
                    <strong>{h.date}</strong> · {h.label}{' '}
                    <span className="text-lucia-ink/55">({h.country})</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
