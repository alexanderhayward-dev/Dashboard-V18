import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useReducedMotion, type Transition, type Variants } from 'motion/react'

// Weiche Ease-out-Kurve für Opacity/Blur, Federn für alles Räumliche (DESIGN.md §2)
export const easeOut = [0.22, 1, 0.36, 1] as const
export const spring: Transition = { type: 'spring', stiffness: 380, damping: 32, mass: 0.9 }
export const snappy: Transition = { type: 'spring', stiffness: 520, damping: 40 }
export const growSpring: Transition = { type: 'spring', stiffness: 110, damping: 18, mass: 1 }

export type Presets = {
  reduced: boolean
  /** Seitencontainer: staffelt Karten, `custom` = Startverzögerung in s */
  page: Variants
  /** Kartenfläche: erscheint zuerst, danach ihr Inhalt */
  card: Variants
  /** Inhalt innerhalb einer Karte, kann selbst wieder staffeln */
  item: Variants
  words: Variants
  word: Variants
}

const still: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0 } },
}

function build(reduced: boolean): Presets {
  if (reduced) return { reduced, page: still, card: still, item: still, words: still, word: still }
  return {
    reduced,
    page: {
      hidden: {},
      show: (delay: number = 0.2) => ({ transition: { delayChildren: delay, staggerChildren: 0.075 } }),
      // Raus schnell: alter Inhalt ist nach ~140 ms weg
      exit: { opacity: 0, filter: 'blur(6px)', transition: { duration: 0.14, ease: 'easeIn' } },
    },
    card: {
      hidden: { opacity: 0, y: 12, scale: 0.985, filter: 'blur(12px)' },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.7, ease: easeOut, delayChildren: 0.12, staggerChildren: 0.055 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 8, filter: 'blur(8px)' },
      show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.55, ease: easeOut, delayChildren: 0.06, staggerChildren: 0.05 },
      },
    },
    words: { hidden: {}, show: { transition: { staggerChildren: 0.075 } } },
    word: {
      hidden: { opacity: 0, y: 4, filter: 'blur(10px)' },
      show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: easeOut } },
    },
  }
}

const PresetContext = createContext<Presets>(build(false))

export function PresetProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false
  const presets = useMemo(() => build(reduced), [reduced])
  return <PresetContext.Provider value={presets}>{children}</PresetContext.Provider>
}

export const usePresets = () => useContext(PresetContext)

// Startzeitpunkt der aktuellen Seite, damit Zähler und Balken zum Aufbau passen
const PageDelayContext = createContext(0.2)
export const PageDelayProvider = PageDelayContext.Provider

/** Verzögerung für Datenanimationen relativ zum Seitenstart */
export function useStartDelay(offset: number) {
  const base = useContext(PageDelayContext)
  const { reduced } = usePresets()
  return reduced ? 0 : base + offset
}
