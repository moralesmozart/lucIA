import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const DEMO_USER = 'lucIA'
const DEMO_PASS = 'lucIA'

type AuthContextValue = {
  isAuthed: boolean
  login: (user: string, pass: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem('lucia_demo_auth') === '1'
    } catch {
      return false
    }
  })

  const login = useCallback((user: string, pass: string) => {
    if (user === DEMO_USER && pass === DEMO_PASS) {
      try {
        sessionStorage.setItem('lucia_demo_auth', '1')
      } catch {
        /* ignore */
      }
      setAuthed(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem('lucia_demo_auth')
    } catch {
      /* ignore */
    }
    setAuthed(false)
  }, [])

  const value = useMemo(
    () => ({ isAuthed, login, logout }),
    [isAuthed, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Hook colocated with provider (fast-refresh exception). */
// eslint-disable-next-line react-refresh/only-export-components -- context hook pair
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
