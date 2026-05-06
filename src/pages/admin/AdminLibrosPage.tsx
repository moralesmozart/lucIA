import { useMemo, useState } from 'react'
import {
  BookMarked,
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  StickyNote,
  FileText,
} from 'lucide-react'
import type { BookPage, SidebarNote } from '../../data/bookContent'
import { usePersistListener } from '../../hooks/usePersistListener'
import {
  listCustomBooks,
  upsertCustomBook,
  deleteCustomBook,
  type CustomBook,
} from '../../lib/luciaPersistence'

type NoteDraft = {
  id: string
  title: string
  body: string
  /** frase opcional que se resalta en el texto del estudiante */
  anchor: string
}

type PageDraft = {
  id: string
  title: string
  /** Un bloque de texto; los párrafos se separan con una línea en blanco. */
  bodyText: string
  notes: NoteDraft[]
}

function emptyNote(): NoteDraft {
  return { id: crypto.randomUUID(), title: '', body: '', anchor: '' }
}

function emptyPage(): PageDraft {
  return {
    id: crypto.randomUUID(),
    title: '',
    bodyText: '',
    notes: [emptyNote()],
  }
}

function bookPageToDraft(p: BookPage): PageDraft {
  return {
    id: crypto.randomUUID(),
    title: p.title,
    bodyText: p.paragraphs.join('\n\n'),
    notes:
      p.notes.length > 0
        ? p.notes.map((n) => ({
            id: n.id || crypto.randomUUID(),
            title: n.title,
            body: n.body,
            anchor: n.anchor ?? '',
          }))
        : [emptyNote()],
  }
}

function draftsToBookPages(drafts: PageDraft[]): BookPage[] {
  return drafts.map((d, i) => {
    const paragraphs = d.bodyText
      .split(/\n\s*\n/)
      .map((t) => t.trim())
      .filter(Boolean)
    const notes: SidebarNote[] = d.notes
      .filter((n) => n.title.trim() || n.body.trim())
      .map((n, ni) => ({
        id: n.id || `n${i}-${ni}`,
        title: n.title.trim() || 'Nota',
        body: n.body.trim(),
        anchor: n.anchor.trim() || undefined,
      }))
    return {
      page: i + 1,
      title: d.title.trim() || `Página ${i + 1}`,
      paragraphs: paragraphs.length > 0 ? paragraphs : ['Escribí el texto de esta página arriba.'],
      notes,
    }
  })
}

const DEFAULT_DRAFTS: PageDraft[] = [
  {
    id: crypto.randomUUID(),
    title: 'Primera página',
    bodyText: 'Escribí aquí el primer párrafo.\n\nOpcionalmente, una línea en blanco separa párrafos.',
    notes: [{ id: crypto.randomUUID(), title: 'Bienvenida', body: 'Podés añadir notas al margen abajo.', anchor: '' }],
  },
]

export function AdminLibrosPage() {
  usePersistListener()
  const books = listCustomBooks()
  const [editorId, setEditorId] = useState<string | 'new' | null>(null)
  const editing = useMemo(() => {
    if (editorId === 'new') return null
    if (!editorId) return null
    return books.find((b) => b.id === editorId) ?? null
  }, [editorId, books])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-lucia-ink">Libros con notas</h1>
        <p className="mt-2 max-w-2xl text-sm text-lucia-ink/65">
          Armá el libro como en un procesador de textos: <strong>una página tras otra</strong>, título, cuerpo y
          notas al margen. No hace falta JSON: el aula sigue leyendo el mismo formato por dentro.
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
  const [published, setPublished] = useState(initial?.published ?? true)
  const [pageDrafts, setPageDrafts] = useState<PageDraft[]>(() =>
    initial?.pages?.length ? initial.pages.map(bookPageToDraft) : DEFAULT_DRAFTS,
  )

  function movePage(index: number, dir: -1 | 1) {
    setPageDrafts((d) => {
      const j = index + dir
      if (j < 0 || j >= d.length) return d
      const next = [...d]
      ;[next[index], next[j]] = [next[j]!, next[index]!]
      return next
    })
  }

  function removePage(index: number) {
    setPageDrafts((d) => (d.length <= 1 ? d : d.filter((_, i) => i !== index)))
  }

  function addPage() {
    setPageDrafts((d) => [...d, emptyPage()])
  }

  function updatePage(index: number, patch: Partial<PageDraft>) {
    setPageDrafts((d) => d.map((p, i) => (i === index ? { ...p, ...patch } : p)))
  }

  function updateNote(pageIndex: number, noteIndex: number, patch: Partial<NoteDraft>) {
    setPageDrafts((d) =>
      d.map((p, i) => {
        if (i !== pageIndex) return p
        const notes = p.notes.map((n, ni) => (ni === noteIndex ? { ...n, ...patch } : n))
        return { ...p, notes }
      }),
    )
  }

  function addNote(pageIndex: number) {
    setPageDrafts((d) =>
      d.map((p, i) => (i === pageIndex ? { ...p, notes: [...p.notes, emptyNote()] } : p)),
    )
  }

  function removeNote(pageIndex: number, noteIndex: number) {
    setPageDrafts((d) =>
      d.map((p, i) => {
        if (i !== pageIndex) return p
        if (p.notes.length <= 1) return p
        return { ...p, notes: p.notes.filter((_, ni) => ni !== noteIndex) }
      }),
    )
  }

  function handleSave() {
    if (!title.trim()) return
    const pages = draftsToBookPages(pageDrafts)
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
    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-lucia-ink/10 bg-white p-5 shadow-lg lg:max-h-[75vh]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-lucia-ink">
          {initial ? 'Editar libro' : 'Libro nuevo'}
        </h2>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-lucia-moss hover:underline">
          Cerrar
        </button>
      </div>

      <label className="mt-4 block text-xs font-bold uppercase text-lucia-ink/50">Título del libro</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2 font-semibold"
      />
      <label className="mt-3 block text-xs font-bold uppercase text-lucia-ink/50">Etiquetas (separadas por coma)</label>
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="C1, Cultura, Colombia…"
        className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2 text-sm"
      />
      <label className="mt-3 block text-xs font-bold uppercase text-lucia-ink/50">
        Datos curiosos (uno por línea, aparecen como chips en el aula)
      </label>
      <textarea
        value={funFacts}
        onChange={(e) => setFunFacts(e.target.value)}
        rows={2}
        className="mt-1 w-full rounded-xl border border-lucia-ink/15 px-3 py-2 text-sm"
      />

      <div className="mt-6 border-t border-lucia-ink/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-bold text-lucia-ink">
            <FileText className="h-4 w-4 text-amber-600" />
            Páginas ({pageDrafts.length})
          </p>
          <button
            type="button"
            onClick={addPage}
            className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Añadir página
          </button>
        </div>
        <p className="mt-2 text-xs text-lucia-ink/55">
          En cada página: título, texto largo y, si querés, varios párrafos dejando <strong>una línea en blanco</strong>{' '}
          entre bloques.
        </p>

        <ul className="mt-4 space-y-6">
          {pageDrafts.map((page, pi) => (
            <li
              key={page.id}
              className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                  Página {pi + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={pi === 0}
                    onClick={() => movePage(pi, -1)}
                    className="rounded-lg p-1.5 text-lucia-ink hover:bg-white disabled:opacity-30"
                    aria-label="Subir página"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={pi === pageDrafts.length - 1}
                    onClick={() => movePage(pi, 1)}
                    className="rounded-lg p-1.5 text-lucia-ink hover:bg-white disabled:opacity-30"
                    aria-label="Bajar página"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={pageDrafts.length <= 1}
                    onClick={() => removePage(pi)}
                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-30"
                    aria-label="Eliminar página"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <label className="mt-3 block text-xs font-bold uppercase text-lucia-ink/50">Título de la página</label>
              <input
                value={page.title}
                onChange={(e) => updatePage(pi, { title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-lucia-ink/15 bg-white px-3 py-2 text-sm font-semibold"
                placeholder="Ej. Un café antes de clase"
              />

              <label className="mt-3 block text-xs font-bold uppercase text-lucia-ink/50">
                Texto (párrafos = bloques separados por línea en blanco)
              </label>
              <textarea
                value={page.bodyText}
                onChange={(e) => updatePage(pi, { bodyText: e.target.value })}
                rows={8}
                className="mt-1 w-full resize-y rounded-xl border border-lucia-ink/15 bg-white px-3 py-2 text-sm leading-relaxed"
                placeholder={'Primer párrafo del capítulo…\n\nSegundo párrafo, si lo hay.'}
              />

              <div className="mt-4 rounded-xl bg-white/80 p-3 ring-1 ring-lucia-ink/8">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase text-lucia-ink/50">
                    <StickyNote className="h-3.5 w-3.5 text-amber-700" />
                    Notas al margen
                  </p>
                  <button
                    type="button"
                    onClick={() => addNote(pi)}
                    className="text-xs font-bold text-lucia-moss hover:underline"
                  >
                    + Nota
                  </button>
                </div>
                <ul className="mt-3 space-y-3">
                  {page.notes.map((note, ni) => (
                    <li key={note.id} className="rounded-lg border border-lucia-ink/10 bg-lucia-cream/40 p-3">
                      <div className="mb-2 flex justify-end">
                        {page.notes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNote(pi, ni)}
                            className="text-xs font-bold text-red-600 hover:underline"
                          >
                            Quitar
                          </button>
                        )}
                      </div>
                      <input
                        value={note.title}
                        onChange={(e) => updateNote(pi, ni, { title: e.target.value })}
                        className="w-full rounded-lg border border-lucia-ink/10 bg-white px-2 py-1.5 text-xs font-bold"
                        placeholder="Título de la nota"
                      />
                      <textarea
                        value={note.body}
                        onChange={(e) => updateNote(pi, ni, { body: e.target.value })}
                        rows={2}
                        className="mt-2 w-full rounded-lg border border-lucia-ink/10 bg-white px-2 py-1.5 text-xs"
                        placeholder="Explicación para el estudiante…"
                      />
                      <input
                        value={note.anchor}
                        onChange={(e) => updateNote(pi, ni, { anchor: e.target.value })}
                        className="mt-2 w-full rounded-lg border border-lucia-ink/10 bg-white px-2 py-1.5 text-xs"
                        placeholder="Palabra o frase a resaltar en el texto (opcional)"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm font-bold text-lucia-ink">
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
        disabled={!title.trim()}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-lucia-gold px-4 py-2.5 text-sm font-bold text-lucia-ink shadow-md disabled:opacity-40"
      >
        <Save className="h-4 w-4" />
        Guardar libro
      </button>
    </div>
  )
}
