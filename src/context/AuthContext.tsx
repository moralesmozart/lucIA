import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const DEMO_STUDENT_USER = 'lucIA'
const DEMO_STUDENT_PASS = 'lucIA'

/** Credenciales demo equipo docente — cambiar en Supabase Auth cuando migres. */
const DEMO_ADMIN_USER = 'lucIA-admin'
const DEMO_ADMIN_PASS = 'lucIA-admin'

const SK_STUDENT = 'lucia_demo_student_auth'
const SK_ADMIN = 'lucia_demo_admin_auth'

type AuthContextValue = {
  isStudentAuthed: boolean
  isAdminAuthed: boolean
  loginStudent: (user: string, pass: string) => boolean
  loginAdmin: (user: string, pass: string) => boolean
  logoutStudent: () => void
  logoutAdmin: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isStudentAuthed, setStudentAuthed] = useState(() => readFlag(SK_STUDENT))
  const [isAdminAuthed, setAdminAuthed] = useState(() => readFlag(SK_ADMIN))

  const loginStudent = useCallback((user: string, pass: string) => {
    if (user === DEMO_STUDENT_USER && pass === DEMO_STUDENT_PASS) {
      writeFlag(SK_STUDENT, true)
      setStudentAuthed(true)
      return true
    }
    return false
  }, [])

  const loginAdmin = useCallback((user: string, pass: string) => {
    if (user === DEMO_ADMIN_USER && pass === DEMO_ADMIN_PASS) {
      writeFlag(SK_ADMIN, true)
      setAdminAuthed(true)
      return true
    }
    return false
  }, [])

  const logoutStudent = useCallback(() => {
    writeFlag(SK_STUDENT, false)
    setStudentAuthed(false)
  }, [])

  const logoutAdmin = useCallback(() => {
    writeFlag(SK_ADMIN, false)
    setAdminAuthed(false)
  }, [])

  const value = useMemo(
    () => ({
      isStudentAuthed,
      isAdminAuthed,
      loginStudent,
      loginAdmin,
      logoutStudent,
      logoutAdmin,
    }),
    [
      isStudentAuthed,
      isAdminAuthed,
      loginStudent,
      loginAdmin,
      logoutStudent,
      logoutAdmin,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function readFlag(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key: string, on: boolean) {
  try {
    if (on) sessionStorage.setItem(key, '1')
    else sessionStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

/** Demo admin credentials for onboarding copy in UI (not secrets — swap with env + Supabase). */
export function demoAdminCredentialsHint() {
  return { user: DEMO_ADMIN_USER, pass: DEMO_ADMIN_PASS }
}

// eslint-disable-next-line react-refresh/only-export-components -- context hook pair
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
