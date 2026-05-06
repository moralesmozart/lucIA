import type { BookPage } from './bookContent'
import { FICTIONAL_BOOK } from './bookContent'
import { listCustomBooks } from '../lib/luciaPersistence'

export type ReadingVolume = {
  id: string
  title: string
  tags: string[]
  funFacts: string[]
  pages: BookPage[]
  source: 'builtin' | 'custom'
}

/** Libro demo + libros publicados creados desde el panel (localStorage / futuro Supabase). */
export function getReadingVolumes(): ReadingVolume[] {
  const builtin: ReadingVolume = {
    id: 'builtin-amanece',
    title: 'Amanece en el puerto',
    tags: ['Demo', 'Lectura guiada'],
    funFacts: ['Las notas al margen enlazan con palabras resaltadas en el texto.'],
    pages: FICTIONAL_BOOK,
    source: 'builtin',
  }
  const customs = listCustomBooks()
    .filter((b) => b.published)
    .map(
      (b): ReadingVolume => ({
        id: b.id,
        title: b.title,
        tags: b.tags,
        funFacts: b.funFacts,
        pages: b.pages,
        source: 'custom',
      }),
    )
  return [builtin, ...customs]
}
