import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  Inbox,
  BookMarked,
  Brain,
  CalendarDays,
  Lightbulb,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: 'bandeja', label: 'Bandeja', icon: Inbox },
  { to: 'libros', label: 'Libros', icon: BookMarked },
  { to: 'ejercicios', label: 'Ejercicios', icon: Brain },
  { to: 'agenda', label: 'Agenda', icon: CalendarDays },
  { to: 'ideas', label: 'Ideas', icon: Lightbulb },
] as const

export function AdminLayout() {
  const { logoutAdmin } = useAuth()

  return (
    <div className="min-h-[calc(100svh-56px)] bg-gradient-to-br from-lucia-cream via-white to-violet-50/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:py-8">
        <div className="flex items-center justify-between md:hidden">
          <span className="font-display text-lg font-bold text-lucia-ink">Panel lucIA</span>
          <button
            type="button"
            onClick={() => logoutAdmin()}
            className="rounded-full border border-lucia-ink/15 px-3 py-1.5 text-xs font-bold text-lucia-ink"
          >
            Salir
          </button>
        </div>
      <div className="flex gap-6">
        <aside className="hidden w-56 shrink-0 flex-col rounded-3xl border border-lucia-ink/10 bg-white/90 p-4 shadow-lg md:flex">
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-lucia-ink px-3 py-2 text-white">
            <Sparkles className="h-5 w-5 text-lucia-gold" />
            <span className="font-display text-sm font-bold">lucIA panel</span>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? 'bg-lucia-moss text-white shadow-md'
                      : 'text-lucia-ink/70 hover:bg-lucia-cream'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => logoutAdmin()}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-lucia-ink/15 py-2.5 text-sm font-bold text-lucia-ink/80 hover:bg-lucia-cream"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
          <Link
            to="/"
            className="mt-2 text-center text-xs font-semibold text-lucia-moss underline-offset-2 hover:underline"
          >
            Ver web pública
          </Link>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap gap-2 md:hidden">
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-xs font-bold ${
                    isActive ? 'bg-lucia-moss text-white' : 'bg-white text-lucia-ink/70 ring-1 ring-lucia-ink/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <Outlet />
        </div>
      </div>
      </div>
    </div>
  )
}
