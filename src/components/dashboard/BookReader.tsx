import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BookMarked, ChevronLeft, ChevronRight, StickyNote } from 'lucide-react'
import { FICTIONAL_BOOK } from '../../data/bookContent'

export function BookReader() {
  const [page, setPage] = useState(0)
  const p = FICTIONAL_BOOK[page]!

  return (
    <div className="rounded-3xl border border-lucia-ink/10 bg-gradient-to-br from-amber-50/80 to-white p-6 shadow-inner md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-xl font-bold text-lucia-ink">
          <BookMarked className="h-6 w-6 text-amber-600" />
          Leer con notas de Lucía
        </h3>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
          Libro demo · {FICTIONAL_BOOK.length} páginas
        </span>
      </div>
      <p className="mt-2 text-sm text-lucia-ink/65">
        Vista tipo “Kindle” con cajas al margen: gramática, registro y cultura. Más adelante Lucía subirá sus
        propios materiales a lucIA.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <motion.article
          key={p.page}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-md ring-1 ring-lucia-ink/5"
        >
          <header className="border-b border-lucia-ink/10 pb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Página {p.page} / {FICTIONAL_BOOK.length}
            </p>
            <h4 className="font-display text-2xl font-bold text-lucia-ink">{p.title}</h4>
          </header>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-lucia-ink/90">
            {p.paragraphs.map((para, i) => (
              <p key={i}>
                {highlightAnchors(para, p.notes)}
              </p>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((x) => Math.max(0, x - 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-lucia-ink/15 px-4 py-2 text-sm font-bold disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <button
              type="button"
              disabled={page >= FICTIONAL_BOOK.length - 1}
              onClick={() => setPage((x) => Math.min(FICTIONAL_BOOK.length - 1, x + 1))}
              className="inline-flex items-center gap-1 rounded-xl bg-lucia-moss px-4 py-2 text-sm font-bold text-white disabled:opacity-30"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.article>

        <aside className="space-y-3 lg:col-span-2">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lucia-ink/45">
            <StickyNote className="h-4 w-4" />
            Notas al margen
          </p>
          {p.notes.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4 shadow-sm"
            >
              {n.anchor && (
                <p className="text-xs font-bold uppercase text-amber-800">“{n.anchor}”</p>
              )}
              <p className="font-display text-base font-bold text-lucia-ink">{n.title}</p>
              <p className="mt-1 text-sm text-lucia-ink/75">{n.body}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}

function highlightAnchors(text: string, notes: { anchor?: string }[]) {
  const anchors = notes.map((n) => n.anchor).filter(Boolean) as string[]
  if (!anchors.length) return text
  const parts: ReactNode[] = []
  let remaining = text
  while (remaining.length) {
    let hit: { idx: number; a: string } | null = null
    for (const a of anchors) {
      const i = remaining.indexOf(a)
      if (i >= 0 && (hit === null || i < hit.idx)) hit = { idx: i, a }
    }
    if (!hit) {
      parts.push(remaining)
      break
    }
    if (hit.idx > 0) parts.push(remaining.slice(0, hit.idx))
    parts.push(
      <mark
        key={parts.length + hit.a}
        className="rounded bg-amber-200/90 px-0.5 font-semibold text-lucia-ink"
      >
        {hit.a}
      </mark>,
    )
    remaining = remaining.slice(hit.idx + hit.a.length)
  }
  return <>{parts}</>
}
