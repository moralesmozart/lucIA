import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdminAuthed } = useAuth()
  const loc = useLocation()
  if (!isAdminAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />
  }
  return <>{children}</>
}
