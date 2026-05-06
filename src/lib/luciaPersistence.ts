import type { BookPage } from '../data/bookContent'

export const PERSIST_EVENT = 'lucia-persist-change'

export function notifyPersist(): void {
  window.dispatchEvent(new Event(PERSIST_EVENT))
}

const K = {
  submissions: 'lucia_v1_submissions',
  attempts: 'lucia_v1_attempts',
  books: 'lucia_v1_custom_books',
  schedule: 'lucia_v1_schedule',
  studentDisplay: 'lucia_student_display_name',
  studentLocalId: 'lucia_student_local_id_v1',
} as const

export type SubmissionStatus = 'nuevo' | 'en_revision' | 'devuelto'

export type TextSubmission = {
  id: string
  studentDisplayName: string
  /** Mismo navegador siempre; usado para filtrar “mis textos” con Supabase. */
  studentLocalId?: string
  title: string
  body: string
  status: SubmissionStatus
  /** Comentarios visibles para el estudiante (demo local). */
  adminComment: string
  createdAt: string
  updatedAt: string
}

export type ExerciseAttempt = {
  id: string
  studentDisplayName: string
  exerciseId: string
  exerciseSummary: string
  level: string
  correct: boolean
  scorePercent: number
  attemptedAt: string
}

export type CustomBook = {
  id: string
  title: string
  tags: string[]
  funFacts: string[]
  pages: BookPage[]
  published: boolean
  createdAt: string
}

export type ScheduledSession = {
  id: string
  studentDisplayName: string
  title: string
  notes: string
  startsAt: string
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
  notifyPersist()
}

export function getStudentDisplayName(): string {
  try {
    let v = localStorage.getItem(K.studentDisplay)?.trim()
    if (!v) {
      const legacy = sessionStorage.getItem(K.studentDisplay)?.trim()
      if (legacy) {
        localStorage.setItem(K.studentDisplay, legacy)
        sessionStorage.removeItem(K.studentDisplay)
        v = legacy
      }
    }
    return v || 'Estudiante demo'
  } catch {
    return 'Estudiante demo'
  }
}

export function setStudentDisplayName(name: string) {
  try {
    const n = name.trim() || 'Estudiante demo'
    localStorage.setItem(K.studentDisplay, n)
    sessionStorage.removeItem(K.studentDisplay)
  } catch {
    /* ignore */
  }
  notifyPersist()
}

/** UUID estable por navegador para enlazar envíos sin Auth todavía. */
export function getStudentLocalId(): string {
  try {
    let id = localStorage.getItem(K.studentLocalId)?.trim()
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(K.studentLocalId, id)
    }
    return id
  } catch {
    return 'anonymous-local'
  }
}

export function listSubmissions(): TextSubmission[] {
  return readJson<TextSubmission[]>(K.submissions, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

/** Textos del estudiante actual (localStorage): por id local o, si es legacy, por nombre. */
export function listMineSubmissionsLocal(): TextSubmission[] {
  const lid = getStudentLocalId()
  const name = getStudentDisplayName().trim()
  return listSubmissions()
    .filter(
      (s) =>
        (s.studentLocalId != null &&
          s.studentLocalId !== '' &&
          s.studentLocalId === lid) ||
        ((!s.studentLocalId || s.studentLocalId === '') &&
          s.studentDisplayName.trim() === name),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function buildSubmissionRow(title: string, body: string): TextSubmission {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    studentDisplayName: getStudentDisplayName(),
    studentLocalId: getStudentLocalId(),
    title,
    body,
    status: 'nuevo',
    adminComment: '',
    createdAt: now,
    updatedAt: now,
  }
}

export function appendSubmissionLocal(row: TextSubmission) {
  const all = readJson<TextSubmission[]>(K.submissions, [])
  writeJson(K.submissions, [row, ...all])
}

export function addSubmission(title: string, body: string): TextSubmission {
  const row = buildSubmissionRow(title, body)
  appendSubmissionLocal(row)
  return row
}

export function updateSubmission(id: string, patch: Partial<TextSubmission>) {
  const all = readJson<TextSubmission[]>(K.submissions, [])
  const next = all.map((s) =>
    s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s,
  )
  writeJson(K.submissions, next)
}

export function listAttempts(): ExerciseAttempt[] {
  return readJson<ExerciseAttempt[]>(K.attempts, []).sort(
    (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime(),
  )
}

export function addAttempt(entry: Omit<ExerciseAttempt, 'id' | 'attemptedAt'>) {
  const row: ExerciseAttempt = {
    ...entry,
    id: crypto.randomUUID(),
    attemptedAt: new Date().toISOString(),
  }
  const all = readJson<ExerciseAttempt[]>(K.attempts, [])
  writeJson(K.attempts, [row, ...all])
}

export function listCustomBooks(): CustomBook[] {
  return readJson<CustomBook[]>(K.books, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function upsertCustomBook(book: CustomBook) {
  const all = readJson<CustomBook[]>(K.books, [])
  const idx = all.findIndex((b) => b.id === book.id)
  const next = idx >= 0 ? [...all.slice(0, idx), book, ...all.slice(idx + 1)] : [book, ...all]
  writeJson(K.books, next)
}

export function deleteCustomBook(id: string) {
  const all = readJson<CustomBook[]>(K.books, [])
  writeJson(
    K.books,
    all.filter((b) => b.id !== id),
  )
}

export function listScheduledSessions(): ScheduledSession[] {
  return readJson<ScheduledSession[]>(K.schedule, []).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  )
}

export function upsertScheduledSession(s: ScheduledSession) {
  const all = readJson<ScheduledSession[]>(K.schedule, [])
  const idx = all.findIndex((x) => x.id === s.id)
  const next = idx >= 0 ? [...all.slice(0, idx), s, ...all.slice(idx + 1)] : [...all, s]
  writeJson(K.schedule, next)
}

export function deleteScheduledSession(id: string) {
  writeJson(
    K.schedule,
    readJson<ScheduledSession[]>(K.schedule, []).filter((x) => x.id !== id),
  )
}
