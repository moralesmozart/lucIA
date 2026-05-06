import { WritingBlock } from '../components/dashboard/WritingBlock'
import { QuizBlock } from '../components/dashboard/QuizBlock'
import { BookReader } from '../components/dashboard/BookReader'
import { GrammarUno } from '../components/dashboard/GrammarUno'
import { CalendarBlock } from '../components/dashboard/CalendarBlock'
import { StudentIdentityBar } from '../components/dashboard/StudentIdentityBar'

const NATURE_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large-web.mp4'

export function DashboardPage() {
  return (
    <div className="bg-lucia-cream/50">
      <div className="relative h-40 w-full overflow-hidden md:h-48">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src={NATURE_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-lucia-cream/40 via-lucia-cream/85 to-lucia-cream" />
        <div className="relative mx-auto flex h-full max-w-6xl items-end px-4 pb-4">
          <div className="rounded-2xl bg-white/90 px-5 py-4 shadow-md ring-1 ring-lucia-ink/10 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-lucia-moss">Aula demo</p>
            <h1 className="font-display text-2xl font-bold text-lucia-ink md:text-3xl">
              Hola, estudiante lucIA
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        <StudentIdentityBar />
        <WritingBlock />
        <QuizBlock />
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-lucia-ink md:text-3xl">
            Gamificación
          </h2>
          <BookReader />
          <GrammarUno />
        </section>
        <CalendarBlock />
      </div>
    </div>
  )
}
