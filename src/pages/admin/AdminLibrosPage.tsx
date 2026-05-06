import { useMemo, useState } from 'react'
import { BookMarked, Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import type { BookPage } from '../../data/bookContent'
import { usePersistListener } from '../../hooks/usePersistListener'
import {
  listCustomBooks,
  upsertCustomBook,
  deleteCustomBook,
  type CustomBook,
} from '../../lib/luciaPersistence'

const SAMPLE_PAGES: BookPage[] = [
  {
    page: 1,
    title: 'Capítulo demo',
    paragraphs: ['Primer párrafo del libro.', 'Segundo párrafo con más detalle para la lectura.'],
    notes: [
      {
        id: 'n1',
        title: 'Nota de Lucía',
        body: 'Ejemplo de nota al margen.',
        anchor: 'demo',
      },
    ],
  },
]

export function AdminLibrosPage() {
  usePersistListener()
  const books = listCustomBooks()
  const [editorId, setEditorId] = useState<string | 'new' | null>(null)
  const editing = useMemo(() => {
    if (editorId === 'new')
      return null as unknown as CustomBook // handled by form empty
    if (!editorId) return null
    return books.find((b) => b.id === editorId) ?? null
  }, [editorId, books])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-lucia-ink">Libros con notas</h1>
        <p className="mt-2 max-w-2xl text-sm text-lucia-ink/65">
          Creá lecturas con etiquetas y “datos curiosos” que aparecen como chips en el aula. Las páginas usan el
          mismo formato JSON que el libro demo (título, párrafos, notas).
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditorId('new')}
          className="inline-flex items-center gap-2 rounded-full bg-lucia-moss px-4 py-2 text-sm font-bold text-white shadow-md"
        >
          <Plus className="h-4 w-4" />
          Nuevo libro
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ul className="space-y-2 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-1">
          {books.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-lucia-ink/10 bg-white px-4 py-3 shadow-sm"
            >
              <button type="button" onClick={() => setEditorId(b.id)} className="min-w-0 text-left">
                <p className="flex items-center gap-2 font-display font-bold text-lucia-ink">
                  <BookMarked className="h-4 w-4 shrink-0 text-amber-600" />
                  <span className="truncate">{b.title}</span>
                </p>
                <p className="mt-1 text-xs text-lucia-ink/50">
                  {b.pages.length} págs · {b.published ? 'Publicado' : 'Borrador'}{' '}
                  {b.tags.length ? `· ${b.tags.join(', ')}` : ''}
                </p>
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCustomBook(b.id)
                  if (editorId === b.id) setEditorId(null)
                }}
                className="rounded-xl p-2 text-red-600 hover:bg-red-50"
                aria-label="Eliminar libro"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        {editorId !== null ? (
          <BookEditor
            key={editorId === 'new' ? 'new' : editorId}
            initial={editorId === 'new' ? null : editing ?? null}
            onClose={() => setEditorId(null)}
            onSaved={() => setEditorId(null)}
          />
        ) : (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-lucia-ink/20 bg-white/70 p-8 text-center text-sm text-lucia-ink/55">
            Elegí un libro de la lista o pulsá «Nuevo libro».
          </div>
        )}
      </div>
    </div>
  )
}

function BookEditor({
  initial,
  onClose,
  onSaved,
}: {
  initial: CustomBook | null
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [tags, setTags] = useState(initial?.tags.join(', ') ?? '')
  const [funFacts, setFunFacts] = useState(initial?.funFacts.join('\n') ?? '')
  const [pagesJson, setPagesJson] = useState(
    JSON.stringify(initial?.pages ?? SAMPLE_PAGES, null, 2),
  )
  const [published, setPublished] = useState(initial?.published ?? true)
  const [err, setErr] = useState<string | null>(null)

  function parsePages(): BookPage[] | null {
    try {
      const raw = JSON.parse(pagesJson) as unknown
      if (!Array.isArray(raw)) {
        setErr('Las páginas deben ser un array JSON.')
        return null
      }
      for (const p of raw) {
        if (
          typeof p !== 'object' ||
          p === null ||
          typeof (p as BookPage).page !== 'number' ||
          typeof (p as BookPage).title !== 'string' ||
          !Array.isArray((p as BookPage).paragraphs) ||
          !Array.isArray((p as BookPage).notes)
        ) {
          setErr('Cada página necesita page (número), title, paragraphs[], notes[].')
          return null
        }
      }
      setErr(null)
      return raw as BookPage[]
    } catch {
      setErr('JSON inválido. Revisá comillas y comas.')
      return null
    }
  }

  function handleSave() {
    const pages = parsePages()
    if (!pages || !title.trim()) return
    const book: CustomBook = {
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      funFacts: funFacts
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean),
      pages,
      published,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    }
    upsertCustomBook(book)
    onSaved()
  }

  return (
    <div className="rounded-2xl border border-lucia-ink/10 bg-white p-5 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-lucia-ink">
          {initial ? 'Editar libro' : 'Libro nuevo'}
        </h2>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-lucia-moss hover:underline">
          Cerrar
        </button>
      </div>
      <label className="mt-4 block text-xs font-bold uppercase text-lucia-ink/50">Título</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2 font-semibold"
      />
      <label className="mt-3 block text-xs font-bold uppercase text-lucia-ink/50">
        Etiquetas (coma)
      </label>
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="C1, Cultura, Colombia…"
        className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2 text-sm"
      />
      <label className="mt-3 block text-xs font-bold uppercase text-lucia-ink/50">
        Datos curiosos (uno por línea)
      </label>
      <textarea
        value={funFacts}
        onChange={(e) => setFunFacts(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2 text-sm"
      />
      <label className="mt-3 block text-xs font-bold uppercase text-lucia-ink/50">Páginas (JSON)</label>
      <textarea
        value={pagesJson}
        onChange={(e) => setPagesJson(e.target.value)}
        rows={14}
        spellCheck={false}
        className="mt-1 w-full resize-y rounded-xl border border-lucia-ink/15 bg-lucia-cream/40 px-3 py-2 font-mono text-xs leading-relaxed"
      />
      {err && <p className="mt-2 text-sm font-semibold text-red-600">{err}</p>}
      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-bold text-lucia-ink">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        {published ? (
          <>
            <Eye className="h-4 w-4 text-lucia-moss" /> Visible en el aula
          </>
        ) : (
          <>
            <EyeOff className="h-4 w-4 text-lucia-ink/40" /> Borrador (oculto)
          </>
        )}
      </label>
      <button
        type="button"
        onClick={handleSave}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-lucia-gold px-4 py-2.5 text-sm font-bold text-lucia-ink shadow-md"
      >
        <Save className="h-4 w-4" />
        Guardar libro
      </button>
    </div>
  )
}
