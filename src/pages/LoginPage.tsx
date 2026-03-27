import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Lock, User, ArrowRight, Sparkles } from 'lucide-react'

const NATURE_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large-web.mp4'

export function LoginPage() {
  const { login, isAuthed } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = (loc.state as { from?: string } | null)?.from || '/app'

  useEffect(() => {
    if (isAuthed) nav(from, { replace: true })
  }, [isAuthed, from, nav])
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(false)
    if (login(user, pass)) {
      nav(from, { replace: true })
    } else {
      setErr(true)
    }
  }

  return (
    <div className="min-h-[calc(100svh-56px)]">
      <div className="relative h-[38vh] min-h-[220px] w-full overflow-hidden bg-lucia-moss">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster=""
          aria-label="Naturaleza en movimiento, estilo fotográfico"
        >
          <source src={NATURE_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-lucia-ink/80 via-lucia-ink/20 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 mx-auto max-w-lg px-4 text-center">
          <p className="font-display text-2xl font-bold text-white drop-shadow-md md:text-3xl">
            Bienvenido a lucIA
          </p>
          <p className="mt-1 text-sm text-white/85">
            La misma luz que en sus fotos: claridad para tu español.
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-10 max-w-md px-4 pb-16">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl border border-lucia-ink/10 bg-white p-8 shadow-xl shadow-lucia-ink/10"
        >
          <div className="mb-6 flex justify-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lucia-gold/30 text-lucia-ink">
              <Sparkles className="h-7 w-7" />
            </span>
          </div>
          <h1 className="text-center font-display text-2xl font-bold text-lucia-ink">Acceso demo</h1>
          <p className="mt-2 text-center text-sm text-lucia-ink/60">
            Credenciales: usuario <strong>lucIA</strong> · contraseña <strong>lucIA</strong>
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
              Usuario o contraseña incorrectos. Usa lucIA / lucIA.
            </p>
          )}
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-lucia-moss py-3.5 text-base font-bold text-white shadow-lg shadow-lucia-moss/30 transition hover:brightness-105"
          >
            Entrar al aula
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="mt-6 text-center text-sm text-lucia-ink/50">
            <Link to="/" className="font-semibold text-lucia-moss hover:underline">
              Volver al inicio
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  )
}
