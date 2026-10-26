import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react'
import { AnimatePresence, animate, motion } from 'motion/react'
import { growSpring, snappy, spring, usePresets, useStartDelay } from '../lib/motion'

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

type DivProps = ComponentProps<typeof motion.div>

/** Kartenfläche. Erbt den Aufbau von der Seite und staffelt ihre eigenen Items. */
export function Card({ className, lift = true, bare = false, children, ...rest }: DivProps & { lift?: boolean; bare?: boolean }) {
  const { card, reduced } = usePresets()
  return (
    <motion.div
      variants={card}
      whileHover={lift && !reduced ? { y: -4 } : undefined}
      transition={spring}
      className={cn(
        bare ? 'rounded-[20px] transition-shadow duration-300' : 'card-surface',
        lift && 'hover:shadow-[0_14px_34px_-18px_rgba(21,20,24,0.28)]',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Bereich ohne Kartenfläche, der sich wie eine Karte in den Seitenaufbau einreiht. */
export function Section({ className, children, ...rest }: DivProps) {
  const { card } = usePresets()
  return (
    <motion.div variants={card} className={className} {...rest}>
      {children}
    </motion.div>
  )
}

/** Inhalt innerhalb einer Karte, blendet nach der Fläche aus der Unschärfe ein. */
export function Item({ className, children, ...rest }: DivProps) {
  const { item } = usePresets()
  return (
    <motion.div variants={item} className={className} {...rest}>
      {children}
    </motion.div>
  )
}

/**
 * Wechselnder Inhalt (Tabs, Filter): beim ersten Aufbau erbt er den Rhythmus der Seite,
 * bei jedem Wechsel kurzer Exit und gestaffelter Neuaufbau der Items.
 */
export function Swap({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const firstId = useRef(id)
  const changed = useRef(false)
  if (id !== firstId.current) changed.current = true
  const own = changed.current
  const { reduced } = usePresets()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        className={className}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
          exit: reduced ? {} : { opacity: 0, filter: 'blur(4px)', transition: { duration: 0.12 } },
        }}
        initial={own ? 'hidden' : undefined}
        animate={own ? 'show' : undefined}
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/** Überschrift, die Wort für Wort aus der Unschärfe erscheint. */
export function BlurText({ text, className, as = 'h1' }: { text: string; className?: string; as?: 'h1' | 'h2' | 'p' }) {
  const { words, word } = usePresets()
  const Tag = motion[as]
  return (
    <Tag variants={words} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} variants={word} aria-hidden className="inline-block whitespace-pre">
          {w}
          {i < text.split(' ').length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}

const formatters = new Map<number, Intl.NumberFormat>()
function fmt(v: number, decimals: number) {
  if (!formatters.has(decimals)) {
    formatters.set(decimals, new Intl.NumberFormat('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }))
  }
  return formatters.get(decimals)!.format(v)
}

/**
 * Zählt beim ersten Erscheinen von 0 hoch, danach vom alten zum neuen Wert.
 * `at` ist der Startzeitpunkt relativ zum Seitenaufbau.
 */
export function CountUp({ value, decimals = 0, at = 0.5, duration = 1.5, suffix = '', className }: {
  value: number
  decimals?: number
  at?: number
  duration?: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef<number | null>(null)
  const delay = useStartDelay(at)
  const { reduced } = usePresets()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const first = prev.current === null
    const from = prev.current ?? 0
    prev.current = value
    if (reduced) {
      node.textContent = fmt(value, decimals) + suffix
      return
    }
    const controls = animate(from, value, {
      duration: first ? duration : 0.8,
      delay: first ? delay : 0,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (node.textContent = fmt(v, decimals) + suffix),
    })
    return () => controls.stop()
  }, [value, decimals, suffix, duration, delay, reduced])

  return (
    <span ref={ref} className={cn('tabular', className)}>
      {fmt(reduced ? value : 0, decimals) + suffix}
    </span>
  )
}

/** Balken, der von unten (oder links) auf seinen Wert wächst. */
export function Bar({ value, at = 0.6, axis = 'y', className }: { value: number; at?: number; axis?: 'x' | 'y'; className?: string }) {
  const delay = useStartDelay(at)
  const prop = axis === 'y' ? 'height' : 'width'
  return (
    <motion.div
      className={className}
      initial={{ [prop]: '0%' }}
      animate={{ [prop]: `${Math.max(0, Math.min(100, value))}%` }}
      transition={{ ...growSpring, delay }}
    />
  )
}

type Option<T extends string> = { value: T; label: ReactNode }

/** Segment-Schalter mit gleitender Pille (geteiltes Layout). */
export function Segmented<T extends string>({ id, options, value, onChange, size = 'sm', className }: {
  id: string
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'xs'
  className?: string
}) {
  return (
    <div role="tablist" className={cn('flex items-center gap-0.5 rounded-full bg-soft p-1', className)}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative rounded-full font-medium transition-colors',
              size === 'sm' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]',
              on ? 'text-white' : 'text-muted hover:text-ink',
            )}
          >
            {on && <motion.span layoutId={id} className="absolute inset-0 rounded-full bg-ink" transition={snappy} />}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Textreiter mit gleitendem Unterstrich. */
export function Tabs<T extends string>({ id, options, value, onChange }: {
  id: string
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div role="tablist" className="flex gap-4 text-[13px]">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={cn('relative pb-1.5 transition-colors', on ? 'text-ink' : 'text-muted hover:text-ink')}
          >
            {o.label}
            {on && <motion.span layoutId={id} className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-ink" transition={snappy} />}
          </button>
        )
      })}
    </div>
  )
}

export function IconButton({ className, children, label, ...rest }: ComponentProps<typeof motion.button> & { label: string }) {
  return (
    <motion.button
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.9 }}
      transition={snappy}
      className={cn('grid size-8 place-items-center rounded-full text-ink transition-colors hover:bg-soft', className)}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

export function PillButton({ className, children, ...rest }: ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={snappy}
      className={cn('inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white', className)}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-[17px] font-semibold tracking-[-0.01em]', className)}>{children}</h2>
}
