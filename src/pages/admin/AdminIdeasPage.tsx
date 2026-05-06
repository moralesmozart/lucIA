import { Bell, Heart, LayoutGrid, Zap } from 'lucide-react'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

export function AdminIdeasPage() {
  const supa = isSupabaseConfigured()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-lucia-ink">Siguientes mejoras</h1>
        <p className="mt-2 text-sm text-lucia-ink/65">
          Ideas rápidas para cuando conectes base de datos real. Estado Supabase:{' '}
          <strong>{supa ? 'variables detectadas (probar Auth)' : 'modo demo · localStorage'}</strong>.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <IdeaCard
          icon={Heart}
          title="Feedback en tiempo casi real"
          body="Supabase Realtime en text_submissions para que la bandeja se actualice sola cuando llegue un texto nuevo."
          accent="bg-rose-100 text-rose-700"
        />
        <IdeaCard
          icon={Bell}
          title="Avisos gentiles"
          body="Plantillas de correo o push para «tu texto tiene comentarios» sin sonar robótico."
          accent="bg-amber-100 text-amber-800"
        />
        <IdeaCard
          icon={LayoutGrid}
          title="Tablero por estudiante"
          body="Vista tipo CRM: última clase, último ejercicio, racha de escritura."
          accent="bg-violet-100 text-violet-800"
        />
        <IdeaCard
          icon={Zap}
          title="Atajos de teclado"
          body="En la bandeja: J/K para navegar, R para marcar revisión, Escape para cerrar."
          accent="bg-lucia-moss/15 text-lucia-moss"
        />
      </div>
    </div>
  )
}

function IdeaCard({
  icon: Icon,
  title,
  body,
  accent,
}: {
  icon: typeof Heart
  title: string
  body: string
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-lucia-ink/10 bg-white p-5 shadow-sm">
      <span className={`inline-flex rounded-xl p-2 ${accent}`}>
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-3 font-display text-lg font-bold text-lucia-ink">{title}</h3>
      <p className="mt-2 text-sm text-lucia-ink/70">{body}</p>
    </div>
  )
}
