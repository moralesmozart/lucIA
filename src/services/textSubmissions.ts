import { getSupabase } from '../lib/supabaseClient'
import {
  notifyPersist,
  buildSubmissionRow,
  appendSubmissionLocal,
  listSubmissions as listAllLocalSubmissions,
  listMineSubmissionsLocal,
  updateSubmission as updateLocalSubmission,
  getStudentLocalId,
  type TextSubmission,
  type SubmissionStatus,
} from '../lib/luciaPersistence'

type DbSubmission = {
  id: string
  student_label: string
  student_local_id: string | null
  title: string
  body: string
  status: string
  admin_comment: string | null
  created_at: string
  updated_at: string
}

function dbRowToSubmission(r: DbSubmission): TextSubmission {
  return {
    id: r.id,
    studentDisplayName: r.student_label,
    studentLocalId: r.student_local_id?.trim() || undefined,
    title: r.title,
    body: r.body,
    status: r.status as SubmissionStatus,
    adminComment: r.admin_comment ?? '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

function submissionToDb(s: TextSubmission) {
  return {
    id: s.id,
    student_label: s.studentDisplayName,
    student_local_id: s.studentLocalId ?? getStudentLocalId(),
    title: s.title,
    body: s.body,
    status: s.status,
    admin_comment: s.adminComment,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  }
}

/** Panel docente: todos los envíos. */
export async function fetchSubmissionsForAdmin(): Promise<TextSubmission[]> {
  const sb = getSupabase()
  if (!sb) return listAllLocalSubmissions()
  const { data, error } = await sb
    .from('text_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('[lucIA] Supabase fetchSubmissionsForAdmin:', error.message)
    return listAllLocalSubmissions()
  }
  return ((data ?? []) as DbSubmission[]).map(dbRowToSubmission)
}

/** Aula estudiante: solo textos de este navegador (student_local_id). */
export async function fetchSubmissionsForStudent(): Promise<TextSubmission[]> {
  const sb = getSupabase()
  if (!sb) return listMineSubmissionsLocal()
  const lid = getStudentLocalId()
  const { data, error } = await sb
    .from('text_submissions')
    .select('*')
    .eq('student_local_id', lid)
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('[lucIA] Supabase fetchSubmissionsForStudent:', error.message)
    return listMineSubmissionsLocal()
  }
  return ((data ?? []) as DbSubmission[]).map(dbRowToSubmission)
}

export async function createStudentSubmission(title: string, body: string): Promise<TextSubmission> {
  const row = buildSubmissionRow(title, body)
  const sb = getSupabase()
  if (!sb) {
    appendSubmissionLocal(row)
    notifyPersist()
    return row
  }
  const { error } = await sb.from('text_submissions').insert(submissionToDb(row))
  if (error) {
    console.warn('[lucIA] Supabase insert submission:', error.message)
    appendSubmissionLocal(row)
    notifyPersist()
    return row
  }
  notifyPersist()
  return row
}

export async function patchSubmission(id: string, patch: Partial<TextSubmission>): Promise<void> {
  const sb = getSupabase()
  if (!sb) {
    updateLocalSubmission(id, patch)
    return
  }
  const dbPatch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (patch.adminComment !== undefined) dbPatch.admin_comment = patch.adminComment
  if (patch.status !== undefined) dbPatch.status = patch.status
  const { error } = await sb.from('text_submissions').update(dbPatch).eq('id', id)
  if (error) {
    console.warn('[lucIA] Supabase patch submission:', error.message)
    updateLocalSubmission(id, patch)
    return
  }
  notifyPersist()
}
