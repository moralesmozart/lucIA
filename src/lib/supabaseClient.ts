import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Optional Supabase client. When env vars are missing, lucIA runs in **demo mode**
 * using browser persistence (`luciaPersistence.ts`).
 *
 * Next steps after creating a Supabase project:
 * 1. Run SQL in `supabase/migrations/00001_initial.sql`
 * 2. Enable Auth (email magic link or OAuth for students/admins)
 * 3. Replace local persistence calls with Supabase queries + RLS policies
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
/** Legacy anon JWT or new publishable key (`sb_publishable_…`). Never use service_role here. */
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let client: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anon && url.startsWith('http'))
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(url!, anon!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return client
}
