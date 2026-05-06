import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isStudentAuthed } = useAuth()
  const loc = useLocation()
  if (!isStudentAuthed) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }
  return <>{children}</>
}
