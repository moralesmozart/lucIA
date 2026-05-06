import { useEffect, useReducer } from 'react'
import { PERSIST_EVENT } from '../lib/luciaPersistence'

/** Re-render when lucIA local persistence changes (same tab + other tabs). */
export function usePersistListener() {
  const [, bump] = useReducer((n: number) => n + 1, 0)
  useEffect(() => {
    const fn = () => bump()
    window.addEventListener('storage', fn)
    window.addEventListener(PERSIST_EVENT, fn)
    return () => {
      window.removeEventListener('storage', fn)
      window.removeEventListener(PERSIST_EVENT, fn)
    }
  }, [])
}
