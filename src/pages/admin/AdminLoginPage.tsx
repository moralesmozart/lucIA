import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth, demoAdminCredentialsHint } from '../../context/AuthContext'
import { Lock, User, ArrowRight, Shield } from 'lucide-react'

export function AdminLoginPage() {
  const { loginAdmin, isAdminAuthed } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = (loc.state as { from?: string } | null)?.from || '/admin/bandeja'
  const hint = demoAdminCredentialsHint()

  useEffect(() => {
    if (isAdminAuthed) nav(from, { replace: true })
  }, [isAdminAuthed, from, nav])

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(false)
    if (loginAdmin(user, pass)) {
      nav(from, { replace: true })
    } else {
      setErr(true)
    }
  }

  return (
    <div className="min-h-[calc(100svh-56px)] bg-gradient-to-b from-lucia-ink via-lucia-ink to-lucia-moss/30">
      <div className="mx-auto max-w-md px-4 py-16">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/40"
        >
          <div className="mb-6 flex justify-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lucia-moss text-white shadow-lg">
              <Shield className="h-7 w-7" />
            </span>
          </div>
          <h1 className="text-center font-display text-2xl font-bold text-lucia-ink">Panel lucIA</h1>
          <p className="mt-2 text-center text-sm text-lucia-ink/60">
            Acceso docente · usuario <strong>{hint.user}</strong> · contraseña{' '}
            <strong>{hint.pass}</strong>
          </p>
          <label className="mt-6 block text-sm font-bold text-lucia-ink">
            Usuario
            <span className="mt-1 flex items-center gap-2 rounded-2xl border border-lucia-ink/15 bg-lucia-cream/50 px-4 py-3">
              <User className="h-5 w-5 text-lucia-moss" />
              <input
                className="w-full bg-transparent outline-none"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
              />
            </span>
          </label>
          <label className="mt-4 block text-sm font-bold text-lucia-ink">
            Contraseña
            <span className="mt-1 flex items-center gap-2 rounded-2xl border border-lucia-ink/15 bg-lucia-cream/50 px-4 py-3">
              <Lock className="h-5 w-5 text-lucia-moss" />
              <input
                type="password"
                className="w-full bg-transparent outline-none"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
              />
            </span>
          </label>
          {err && (
            <p className="mt-3 text-center text-sm font-semibold text-red-600">
              Credenciales incorrectas.
            </p>
          )}
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-lucia-ink py-3.5 text-base font-bold text-white shadow-lg transition hover:brightness-110"
          >
            Entrar al panel
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="mt-6 text-center text-sm text-lucia-ink/50">
            <Link to="/login" className="font-semibold text-lucia-moss hover:underline">
              Soy estudiante · ir al aula
            </Link>
            {' · '}
            <Link to="/" className="font-semibold text-lucia-moss hover:underline">
              Inicio
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  )
}
