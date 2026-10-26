import { useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bookmark, Cloud, MessageCircle, PhoneCall, RotateCcw, Settings, User, Video } from 'lucide-react'
import { DotsIcon, Logo } from './art/Art'
import { cn } from './ui'
import { easeOut, snappy, spring, usePresets } from '../lib/motion'

export type PageId = 'videos' | 'profile' | 'home' | 'saved' | 'cloud' | 'messages' | 'settings' | 'calls'

type NavEntry = { id: PageId; label: string; icon: ComponentType<{ className?: string; strokeWidth?: number }> }

export const nav: NavEntry[] = [
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'home', label: 'Übersicht', icon: DotsIcon },
  { id: 'saved', label: 'Gespeichert', icon: Bookmark },
  { id: 'cloud', label: 'Cloud', icon: Cloud },
  { id: 'messages', label: 'Nachrichten', icon: MessageCircle },
  { id: 'settings', label: 'Einstellungen', icon: Settings },
  { id: 'calls', label: 'Anrufe', icon: PhoneCall },
]

// Zeitplan des Intros (DESIGN.md §1): Leiste wächst ab 0,12 s, Icons ab 0,38 s
const GROW_DELAY = 0.12
const ICON_DELAY = 0.38

export function Sidebar({ active, onSelect, onReplay }: { active: PageId; onSelect: (id: PageId) => void; onReplay: () => void }) {
  const [hover, setHover] = useState<string | null>(null)
  const { reduced } = usePresets()

  const appear = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, scale: 0.6, filter: 'blur(6px)' },
          animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
          transition: { delay: ICON_DELAY + i * 0.045, duration: 0.45, ease: easeOut },
        }

  const entry = (id: string, label: string, i: number, on: boolean, onClick: () => void, icon: NavEntry['icon']) => {
    const Icon = icon
    const shown = hover === id
    return (
      <li key={id} className="relative flex w-full justify-center">
        <motion.button
          {...appear(i)}
          onClick={onClick}
          onMouseEnter={() => setHover(id)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(id)}
          onBlur={() => setHover(null)}
          aria-label={label}
          aria-current={on ? 'page' : undefined}
          whileTap={{ scale: 0.88 }}
          className={cn('relative grid size-10 place-items-center rounded-full transition-colors', on ? 'text-ink' : 'text-[#8e8c95] hover:text-white')}
        >
          {shown && !on && <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-white/10" transition={snappy} />}
          {on && (
            <motion.span layoutId="nav-active" className="absolute inset-0" transition={spring}>
              <motion.span
                key={id}
                initial={reduced ? false : { scale: 1.5, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={spring}
                className="block size-full rounded-full bg-active"
              />
            </motion.span>
          )}
          <Icon className="relative size-[18px]" strokeWidth={1.8} />
        </motion.button>

        {on && (
          <motion.span
            layoutId="nav-notch"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...spring, opacity: { delay: ICON_DELAY + 0.1, duration: 0.3 } }}
            className="absolute -right-[11px] top-[calc(50%-7px)] h-[14px] w-[7px] rounded-r-full bg-rail"
          />
        )}

        <AnimatePresence>
          {shown && (
            <motion.span
              role="tooltip"
              initial={{ opacity: 0, x: -6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -4, filter: 'blur(4px)', transition: { duration: 0.12 } }}
              transition={{ duration: 0.22, ease: easeOut }}
              className="pointer-events-none absolute left-[calc(100%+20px)] top-[calc(50%-12px)] z-30 whitespace-nowrap rounded-lg bg-rail px-2.5 py-1 text-[11px] font-medium text-white shadow-lg"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </li>
    )
  }

  return (
    <nav aria-label="Hauptnavigation" className="relative z-20 flex w-14 shrink-0 flex-col items-center py-4 sm:w-16">
      {/* Schwarze Pille, die beim Start von oben nach unten wächst */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 rounded-full bg-rail"
        initial={reduced ? false : { height: 84, opacity: 0.65 }}
        animate={{ height: '100%', opacity: 1 }}
        transition={{ delay: GROW_DELAY, duration: 0.55, ease: easeOut }}
      />

      <motion.div
        className="relative mb-6 mt-1 grid size-10 place-items-center text-white"
        initial={reduced ? false : { opacity: 0, rotate: -40, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ ...spring, delay: ICON_DELAY - 0.08 }}
      >
        <Logo className="size-6" />
      </motion.div>

      <ul className="relative flex w-full flex-1 flex-col items-center gap-2.5">
        {nav.map((n, i) => entry(n.id, n.label, i, n.id === active, () => onSelect(n.id), n.icon))}
      </ul>

      <ul className="relative mt-4 w-full">{entry('replay', 'Intro wiederholen', nav.length, false, onReplay, RotateCcw)}</ul>
    </nav>
  )
}
