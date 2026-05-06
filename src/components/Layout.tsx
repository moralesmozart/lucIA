import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Sparkles, LogIn, LogOut, LayoutDashboard, Shield } from 'lucide-react'

/** Landing anchors work on GitHub Pages (/lucIA/#section) and locally (/#section). */
function homeHash(id: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}/#${id}`
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isStudentAuthed, isAdminAuthed, logoutStudent } = useAuth()
  const loc = useLocation()
  const isApp = loc.pathname.startsWith('/app')
  const isAdminZone = loc.pathname.startsWith('/admin') && loc.pathname !== '/admin/login'

  return (
    <div className="min-h-svh flex flex-col">
      <header className="sticky top-0 z-50 border-b border-lucia-ink/10 bg-lucia-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-lucia-ink">
            <motion.span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lucia-moss text-white shadow-lg shadow-lucia-moss/25"
              whileHover={{ scale: 1.05, rotate: -3 }}
            >
              <Sparkles className="h-5 w-5" aria-hidden />
            </motion.span>
            <span>
              luc<span className="text-lucia-coral">IA</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            {!isApp && !isAdminZone && (
              <>
                <a
                  href={homeHash('por-que')}
                  className="rounded-full px-3 py-1.5 text-lucia-ink/80 hover:bg-white/80"
                >
                  Por qué lucIA
                </a>
                <a
                  href={homeHash('lucia')}
                  className="rounded-full px-3 py-1.5 text-lucia-ink/80 hover:bg-white/80"
                >
                  Lucía
                </a>
                <a
                  href={homeHash('testimonios')}
                  className="rounded-full px-3 py-1.5 text-lucia-ink/80 hover:bg-white/80"
                >
                  Testimonios
                </a>
              </>
            )}
            {isAdminZone && isAdminAuthed && (
              <>
                <Link
                  to="/app"
                  className="rounded-full px-3 py-1.5 text-lucia-ink/80 hover:bg-white/80"
                >
                  Ver aula (estudiante)
                </Link>
                <span className="rounded-full bg-lucia-ink/10 px-3 py-1.5 text-xs font-bold text-lucia-ink/70">
                  Modo docente
                </span>
              </>
            )}
            {isStudentAuthed && (
              <>
                <Link
                  to="/app"
                  className="inline-flex items-center gap-1 rounded-full bg-lucia-moss px-4 py-2 text-white shadow-md shadow-lucia-moss/30"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Aula demo
                </Link>
                <button
                  type="button"
                  onClick={() => logoutStudent()}
                  className="inline-flex items-center gap-1 rounded-full border border-lucia-ink/15 px-3 py-2 text-lucia-ink/80 hover:bg-white/80"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </button>
              </>
            )}
            {!isStudentAuthed && loc.pathname !== '/login' && !isAdminZone && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 rounded-full bg-lucia-coral px-4 py-2 text-white shadow-md shadow-lucia-coral/30"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            )}
            {isAdminAuthed && !loc.pathname.startsWith('/admin') && (
              <Link
                to="/admin/bandeja"
                className="inline-flex items-center gap-1 rounded-full bg-lucia-ink px-4 py-2 text-white shadow-md"
              >
                <Shield className="h-4 w-4" />
                Panel docente
              </Link>
            )}
            {!isAdminAuthed &&
              !isStudentAuthed &&
              loc.pathname !== '/admin/login' && (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1 rounded-full border border-lucia-ink/20 bg-white/80 px-3 py-2 text-lucia-ink/80 hover:bg-white"
              >
                <Shield className="h-4 w-4" />
                Acceso docente
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-lucia-ink/10 bg-white/60 py-8 text-center text-sm text-lucia-ink/60">
        <p>
          lucIA · Inspirado en el método de{' '}
          <a
            href="https://www.luciaalonso.net/"
            className="font-semibold text-lucia-moss underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Lucía Alonso
          </a>
        </p>
      </footer>
    </div>
  )
}
