import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminProtectedRoute } from './components/AdminProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminBandejaPage } from './pages/admin/AdminBandejaPage'
import { AdminLibrosPage } from './pages/admin/AdminLibrosPage'
import { AdminEjerciciosPage } from './pages/admin/AdminEjerciciosPage'
import { AdminAgendaPage } from './pages/admin/AdminAgendaPage'
import { AdminIdeasPage } from './pages/admin/AdminIdeasPage'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="bandeja" replace />} />
              <Route path="bandeja" element={<AdminBandejaPage />} />
              <Route path="libros" element={<AdminLibrosPage />} />
              <Route path="ejercicios" element={<AdminEjerciciosPage />} />
              <Route path="agenda" element={<AdminAgendaPage />} />
              <Route path="ideas" element={<AdminIdeasPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
