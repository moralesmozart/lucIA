import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, Hand, Trophy } from 'lucide-react'
import {
  shuffleDeck,
  shuffleIntoDrawPile,
  LABEL_UNO,
  type GrammarCard,
} from '../../data/grammarUno'

const HAND_SIZE = 7

function newGame(seed: number) {
  const deck = shuffleDeck(seed)
  const starter = deck[0]!
  const rest = deck.slice(1)
  const hand = rest.slice(0, HAND_SIZE)
  const pile = rest.slice(HAND_SIZE)
  return { starter, hand, pile, discard: [] as GrammarCard[] }
}

function initialState(seed: number) {
  const g = newGame(seed)
  return { ...g, msg: null as string | null, won: false }
}

type TurnPhase = 'match' | 'chooseTable'

export function GrammarUno() {
  const [seed, setSeed] = useState(11)
  const [phase, setPhase] = useState<TurnPhase>('match')
  const [table, setTable] = useState<GrammarCard | null>(() => initialState(11).starter)
  const [hand, setHand] = useState<GrammarCard[]>(() => initialState(11).hand)
  const [pile, setPile] = useState<GrammarCard[]>(() => initialState(11).pile)
  const [discardPile, setDiscardPile] = useState<GrammarCard[]>(() => initialState(11).discard)
  const [msg, setMsg] = useState<string | null>(null)
  const [won, setWon] = useState(false)
  const reshuffleNonce = useRef(0)

  function restart() {
    const next = seed + 1
    const g = newGame(next)
    reshuffleNonce.current = 0
    setSeed(next)
    setPhase('match')
    setTable(g.starter)
    setHand(g.hand)
    setPile(g.pile)
    setDiscardPile(g.discard)
    setMsg(null)
    setWon(false)
  }

  /** Paso 1: carta de la mano coincide con la mesa → ambas al descarte. */
  function playMatch(card: GrammarCard) {
    if (won || phase !== 'match' || !table) return
    if (card.label !== table.label) {
      setMsg('La carta debe compartir la misma estructura gramatical que la mesa.')
      return
    }
    setMsg(null)
    setDiscardPile((d) => [...d, table, card])
    setHand((h) => {
      const next = h.filter((c) => c.id !== card.id)
      if (next.length === 0) {
        setWon(true)
        setTable(null)
      } else {
        setTable(null)
        setPhase('chooseTable')
        setMsg('Las dos cartas van al descarte. Elegí una carta de tu mano para dejarla en la mesa.')
      }
      return next
    })
  }

  /** Paso 2: nueva carta visible en la mesa (cualquiera de la mano). */
  function placeTableFromHand(card: GrammarCard) {
    if (won || phase !== 'chooseTable') return
    setTable(card)
    setHand((h) => {
      const next = h.filter((c) => c.id !== card.id)
      if (next.length === 0) setWon(true)
      return next
    })
    setPhase('match')
    setMsg(null)
  }

  function onHandCardClick(card: GrammarCard) {
    if (won) return
    if (phase === 'match') playMatch(card)
    else placeTableFromHand(card)
  }

  function draw() {
    if (won || phase === 'chooseTable') return

    let nextPile = [...pile]
    let nextDiscard = [...discardPile]
    let justReshuffled = false

    if (nextPile.length === 0) {
      if (nextDiscard.length === 0) {
        setMsg('No quedan cartas en el mazo ni en el descarte.')
        return
      }
      reshuffleNonce.current += 1
      const mixSeed = seed + reshuffleNonce.current * 9973 + 50_000
      nextPile = shuffleIntoDrawPile(nextDiscard, mixSeed)
      nextDiscard = []
      justReshuffled = true
    }

    const [drawn, ...rest] = nextPile
    if (!drawn) return

    setPile(rest)
    setDiscardPile(nextDiscard)
    setHand((h) => [...h, drawn])
    setMsg(
      justReshuffled
        ? 'El mazo se había acabado: se barajó el descarte y robaste una carta.'
        : 'Robaste una carta. Si puedes jugar, hazlo.',
    )
  }

  const drawTotal = pile.length + discardPile.length

  return (
    <div className="rounded-3xl border border-lucia-ink/10 bg-gradient-to-br from-violet-50 to-white p-6 shadow-lg md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-xl font-bold text-lucia-ink">
          <Hand className="h-6 w-6 text-violet-600" />
          UNO gramatical
        </h3>
        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white"
        >
          <Shuffle className="h-4 w-4" />
          Nueva partida
        </button>
      </div>
      <p className="mt-2 text-sm text-lucia-ink/65">
        Recibes {HAND_SIZE} cartas. Si juegas una carta que <strong>coincide en estructura</strong> con la mesa,
        las <strong>dos</strong> van al descarte; después debes <strong>elegir</strong> una carta de tu mano para
        volver a dejar la mesa. Cuando el mazo se acaba, el descarte se baraja y puedes robar.
      </p>

      {won && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 flex items-center gap-3 rounded-2xl bg-lucia-gold/40 px-4 py-3 font-bold text-lucia-ink"
        >
          <Trophy className="h-8 w-8" />
          ¡Ganaste la ronda demo! Vacíaste la mano con el nuevo ritmo de parejas y elección de mesa.
        </motion.div>
      )}

      <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-violet-300 bg-white/90 p-4 md:flex-row md:items-start md:justify-center">
        <div className="text-center">
          <p className="text-xs font-bold uppercase text-violet-600">Mazo</p>
          <DrawPileStack count={drawTotal} disabled={won || phase === 'chooseTable'} onDraw={draw} />
          <p className="mt-1 text-[10px] text-lucia-ink/50">
            {pile.length} robo · {discardPile.length} descarte
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold uppercase text-violet-600">Mesa</p>
          <div className="mt-2 flex min-h-[280px] justify-center">
            {table ? (
              <UnoCard card={table} size="lg" />
            ) : (
              <div className="flex w-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-400 bg-violet-50/80 px-4 py-6 text-center">
                <p className="text-sm font-bold text-violet-800">Sin carta en la mesa</p>
                <p className="mt-2 text-xs text-lucia-ink/65">
                  Elegí una carta de tu mano para colocarla aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {msg && <p className="mt-3 text-sm font-semibold text-red-600">{msg}</p>}

      <div className="mt-6">
        <p className="text-xs font-bold uppercase text-lucia-ink/45">Tu mano</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start md:gap-3">
          {hand.map((c) => {
            const canMatch = phase === 'match' && table !== null && c.label === table.label
            const choosing = phase === 'chooseTable'
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onHandCardClick(c)}
                disabled={won || (phase === 'match' && table !== null && c.label !== table.label)}
                className={`rounded-2xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                  choosing
                    ? 'ring-2 ring-amber-500 ring-offset-2 scale-[1.02] hover:opacity-100'
                    : canMatch
                      ? 'ring-2 ring-lucia-moss ring-offset-2 scale-[1.02] hover:opacity-100'
                      : 'opacity-90 hover:opacity-100'
                }`}
              >
                <UnoCard card={c} size="sm" />
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={draw}
          disabled={won || drawTotal === 0 || phase === 'chooseTable'}
          className="rounded-2xl border border-lucia-ink/15 px-5 py-2 text-sm font-bold hover:bg-white disabled:opacity-40"
        >
          Robar carta ({drawTotal} disponibles)
        </button>
      </div>
    </div>
  )
}

function DrawPileStack({
  count,
  disabled,
  onDraw,
}: {
  count: number
  disabled: boolean
  onDraw: () => void
}) {
  const layers = count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil(count / 8)))
  return (
    <button
      type="button"
      onClick={onDraw}
      disabled={disabled || count === 0}
      className="relative mx-auto mt-2 flex h-[168px] w-[118px] shrink-0 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
      aria-label="Robar carta del mazo"
    >
      {layers === 0 && (
        <span className="rounded-xl border-2 border-dashed border-lucia-ink/20 px-2 py-8 text-[10px] font-bold text-lucia-ink/35">
          —
        </span>
      )}
      {[...Array(layers)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-xl border-2 border-lucia-ink/80 bg-gradient-to-br from-red-600 via-amber-500 to-blue-700 shadow-md"
          style={{
            width: 118,
            height: 168,
            left: i * 3,
            top: i * 3,
            zIndex: layers - i,
          }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-[10px] border-2 border-white/30 p-2">
            <span className="font-display text-2xl font-black tracking-tight text-white drop-shadow-md">lucIA</span>
          </div>
        </div>
      ))}
    </button>
  )
}

function UnoCard({ card, size }: { card: GrammarCard; size: 'sm' | 'lg' }) {
  const u = LABEL_UNO[card.label]
  const isLg = size === 'lg'
  const w = isLg ? 200 : 118
  const h = isLg ? 280 : 168
  const abbrSize = isLg ? 'text-sm' : 'text-[10px]'
  const bodySize = isLg ? 'text-sm leading-snug' : 'text-[9px] leading-tight'

  return (
    <div
      className="relative shrink-0 rounded-xl border-[3px] border-black/25 shadow-[4px_6px_0_rgba(0,0,0,0.12)]"
      style={{ width: w, height: h, backgroundColor: u.fill }}
    >
      <span
        className={`absolute left-1.5 top-1.5 font-black ${abbrSize} ${u.cornerClass}`}
        style={{ writingMode: 'horizontal-tb' }}
      >
        {u.abbr}
      </span>
      <div className="absolute inset-0 flex items-center justify-center px-2 pt-6 pb-6">
        <div
          className="flex max-h-[78%] w-[88%] items-center justify-center rounded-[50%] bg-white px-2 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]"
          style={{ aspectRatio: '1 / 1.15' }}
        >
          <p className={`text-center font-semibold text-lucia-ink ${bodySize} ${isLg ? 'line-clamp-6' : 'line-clamp-5'}`}>
            {card.sentence}
          </p>
        </div>
      </div>
      <span
        className={`absolute bottom-1.5 right-1.5 rotate-180 font-black ${abbrSize} ${u.cornerClass}`}
      >
        {u.abbr}
      </span>
    </div>
  )
}
