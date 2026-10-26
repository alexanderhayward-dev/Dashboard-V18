import { useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Bell, BellOff, ChevronLeft, ChevronRight, CircleArrowUp, CirclePlus, Clock, Link2, RotateCcw, X } from 'lucide-react'
import { Flower, Spiral } from '../components/art/Art'
import { Avatar, VideoCard } from '../components/shared'
import { Bar, BlurText, Card, CardTitle, CountUp, IconButton, Item, PillButton, Section, Segmented, Swap, Tabs, cn } from '../components/ui'
import { notices, people, reminders, videos } from '../lib/data'
import { easeOut, snappy, spring, usePresets, useStartDelay } from '../lib/motion'

export function Home() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid grid-cols-1 content-start gap-4">
        <Banner />
        <div className="grid gap-4 md:grid-cols-[1.25fr_1fr_0.62fr]">
          <Members />
          <FocusTime />
          <Impact />
        </div>
        <div className="grid gap-4 md:grid-cols-[1.35fr_1fr]">
          <Statistics />
          <div className="grid gap-4">
            <Reminders />
            <Upsell />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 content-start gap-6 xl:pl-2">
        <WeekStrip />
        <LastVideos />
        <Notifications />
      </div>
    </div>
  )
}

function Banner() {
  return (
    <Card bare lift={false} className="relative overflow-hidden bg-lavender p-6 sm:p-7">
      <Flower className="pointer-events-none absolute -right-10 -top-14 size-[230px] opacity-90 sm:right-2" />
      <div className="relative grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end sm:pr-48">
        <Item className="max-w-[440px]">
          <BlurText text="Gemeinsam läuft's einfach besser" className="text-[24px] font-semibold leading-tight tracking-[-0.02em] sm:text-[27px]" />
          <Item className="mt-2 text-[13px] leading-relaxed text-ink/70">
            Lade dein Team ein, um zusammenzuarbeiten und auf einen Blick zu sehen, was gerade passiert.
          </Item>
        </Item>
        <Item>
          <PillButton>
            <CirclePlus className="size-4" strokeWidth={1.8} />
            Mitglied hinzufügen
          </PillButton>
        </Item>
      </div>
    </Card>
  )
}

function Members() {
  return (
    <Card className="flex flex-col p-5">
      <Item className="flex items-center justify-between">
        <CardTitle>Team</CardTitle>
        <IconButton label="Mitglied hinzufügen" className="-mr-1.5 text-muted"><CirclePlus className="size-[18px]" strokeWidth={1.7} /></IconButton>
      </Item>
      <Item className="no-scrollbar mt-3 grid max-h-[176px] grid-cols-3 gap-x-2 gap-y-4 overflow-y-auto [mask-image:linear-gradient(to_bottom,#000_78%,transparent)] pb-4">
        {people.map((p) => (
          <Item key={p.name} className="flex flex-col items-center text-center">
            <motion.div whileHover={{ scale: 1.08, rotate: -3 }} transition={spring}>
              <Avatar person={p} className="size-[52px]" />
            </motion.div>
            <span className="mt-1.5 text-[11.5px] leading-tight text-ink/80">{p.name.split(' ')[0]}<br />{p.name.split(' ')[1]}</span>
          </Item>
        ))}
      </Item>
    </Card>
  )
}

const focusSegments = [
  { label: '7 h 39 m', share: 5, color: 'bg-ink', delta: '+50 %', dot: 'bg-ink' },
  { label: '2 h 06 m', share: 3.3, color: 'bg-lavender', delta: '+33 %', dot: 'bg-lavender' },
  { label: '33 m', share: 1.7, color: 'bg-pink', delta: '+17 %', dot: 'bg-pink' },
]

function FocusTime() {
  return (
    <Card className="flex flex-col p-5">
      <Item className="flex items-center justify-between text-[13px] text-muted">
        Fokuszeit heute
        <ArrowRight className="size-4 text-ink" strokeWidth={1.8} />
      </Item>
      <Item className="mt-2 text-[40px] font-medium leading-none tracking-[-0.03em]">
        <CountUp value={10.3} decimals={1} suffix=" h" at={0.55} />
      </Item>
      <Item className="mt-auto grid pt-5" style={{ gridTemplateColumns: focusSegments.map((s) => `${s.share}fr`).join(' ') }}>
        {focusSegments.map((s, i) => (
          <div key={s.label} className={cn('flex flex-col', i > 0 && 'border-l border-line pl-1.5', i < 2 && 'pr-1.5')}>
            <span className="truncate pb-4 text-[10px] text-muted">{s.label}</span>
            <div className="h-2 overflow-hidden rounded-full">
              <Bar axis="x" value={100} at={0.75 + i * 0.12} className={cn('h-full rounded-full', s.color)} />
            </div>
            <span className="mt-2.5 flex items-center gap-1 text-[10px] font-medium">
              <span className={cn('size-1.5 rounded-full', s.dot)} />
              {s.delta}
            </span>
          </div>
        ))}
      </Item>
    </Card>
  )
}

function Impact() {
  const tipDelay = useStartDelay(1.4)
  const { reduced } = usePresets()
  const bars = [
    { v: 46, c: 'bg-pink-soft' },
    { v: 100, c: 'bg-lavender' },
    { v: 72, c: 'bg-pink-soft' },
  ]
  return (
    <Card className="flex flex-col p-5">
      <Item className="text-[13px] text-muted">Wirkung</Item>
      <Item className="relative mt-3 flex min-h-[120px] flex-1 items-end justify-center gap-2 pt-7">
        {bars.map((b, i) => (
          <div key={i} className="relative flex h-full w-full max-w-[26px] items-end">
            <Bar value={b.v} at={0.7 + i * 0.1} className={cn('w-full rounded-full', b.c)} />
            {i === 1 && (
              <motion.span
                initial={reduced ? false : { opacity: 0, y: 6, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...spring, delay: tipDelay }}
                className="absolute -top-6 left-1/2 -ml-[19px] w-[38px] rounded-full bg-ink py-0.5 text-center text-[10px] font-medium text-white"
              >
                +24 %
              </motion.span>
            )}
          </div>
        ))}
      </Item>
    </Card>
  )
}

const statsData = {
  week: { done: 48, total: 78, finished: 21, running: 14 },
  month: { done: 186, total: 240, finished: 63, running: 41 },
}

function Statistics() {
  const [range, setRange] = useState<'week' | 'month'>('week')
  const s = statsData[range]
  return (
    <Card className="p-5">
      <Item className="flex items-center justify-between gap-3">
        <CardTitle>Statistik</CardTitle>
        <Segmented
          id="stats-range"
          value={range}
          onChange={setRange}
          options={[
            { value: 'week', label: 'Woche' },
            { value: 'month', label: 'Monat' },
          ]}
        />
      </Item>
      <Item className="mt-4 flex items-baseline gap-3">
        <span className="text-[40px] font-medium leading-none tracking-[-0.03em]">
          <CountUp value={s.done} at={0.6} />
        </span>
        <span className="h-8 w-px self-center bg-line" />
        <span className="text-[40px] font-medium leading-none tracking-[-0.03em]">
          <CountUp value={s.total} at={0.6} />
        </span>
        <span className="ml-1 text-[12px] text-muted">Aufgaben erledigt</span>
      </Item>
      <Item className="mt-5 grid grid-cols-2 gap-3">
        <StatTile icon={<SquaresIcon />} value={s.finished} label="Projekte abgeschlossen" at={0.8} />
        <StatTile icon={<CirclesIcon />} value={s.running} label="Projekte in Arbeit" at={0.9} />
      </Item>
    </Card>
  )
}

function StatTile({ icon, value, label, at }: { icon: ReactNode; value: number; label: string; at: number }) {
  return (
    <Item className="flex flex-col items-center rounded-[14px] bg-soft px-3 pb-4 pt-5 text-center">
      <motion.div whileHover={{ rotate: -8, scale: 1.08 }} transition={spring} className="size-11">
        {icon}
      </motion.div>
      <span className="mt-4 text-[13px] font-medium"><CountUp value={value} at={at} /></span>
      <span className="mt-0.5 text-[12px] text-muted">{label}</span>
    </Item>
  )
}

const SquaresIcon = () => (
  <svg viewBox="0 0 44 44" className="size-full" aria-hidden>
    <rect x="16" y="16" width="20" height="20" rx="3" fill="#d9cff6" stroke="#151418" strokeWidth="1.4" />
    <rect x="8" y="8" width="20" height="20" rx="3" fill="none" stroke="#151418" strokeWidth="1.4" />
  </svg>
)

const CirclesIcon = () => (
  <svg viewBox="0 0 44 44" className="size-full" aria-hidden>
    <circle cx="26" cy="17" r="10" fill="#d9cff6" stroke="#151418" strokeWidth="1.4" />
    <circle cx="17" cy="27" r="10" fill="none" stroke="#151418" strokeWidth="1.4" />
  </svg>
)

function Reminders() {
  const [list, setList] = useState(reminders)
  const { reduced } = usePresets()
  return (
    <Card bare lift={false} className="flex min-h-[112px] flex-col justify-center bg-rail px-4 py-5">
      <Item className="relative h-[60px]">
        <AnimatePresence initial={false}>
          {list.slice(0, 3).map((r, i) => (
            <motion.div
              key={r.title}
              className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-2.5"
              style={{ zIndex: 3 - i, transformOrigin: '50% 0%' }}
              initial={reduced ? false : { y: 26, scale: 0.8, opacity: 0 }}
              animate={{ y: i * 8, scale: 1 - i * 0.07, opacity: i === 0 ? 1 : 0.5 - (i - 1) * 0.2 }}
              exit={{ x: 80, opacity: 0, filter: 'blur(6px)', transition: { duration: 0.28, ease: easeOut } }}
              transition={spring}
              aria-hidden={i > 0}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lavender-soft">
                <Clock className="size-4 text-[#7a63d6]" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium">{r.title}</span>
                <span className="block text-[10.5px] text-muted">{r.time} Uhr</span>
              </span>
              {i === 0 && (
                <IconButton label="Erinnerung schließen" onClick={() => setList((l) => l.slice(1))} className="size-7 border border-line">
                  <X className="size-3.5" strokeWidth={2} />
                </IconButton>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {list.length === 0 && (
            <motion.div
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-between gap-3 text-[13px] text-white/80"
            >
              Für heute alles erledigt.
              <button onClick={() => setList(reminders)} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] text-white hover:bg-white/20">
                <RotateCcw className="size-3.5" /> Zurück
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Item>
    </Card>
  )
}

function Upsell() {
  return (
    <Card className="grid grid-cols-[96px_1fr] gap-4 p-3 pr-5">
      <Item className="overflow-hidden rounded-[14px] bg-pink-soft">
        <Spiral className="h-full w-full scale-110" />
      </Item>
      <Item className="flex flex-col justify-center py-2">
        <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em]">Mehr aus deinem Team holen</h3>
        <p className="mt-1.5 text-[12px] text-muted">Alle Profi-Funktionen in einem Abo.</p>
        <PillButton className="mt-3 self-start bg-active! py-1.5! pl-2! text-ink!">
          <CircleArrowUp className="size-4" strokeWidth={1.8} />
          Plan upgraden
        </PillButton>
      </Item>
    </Card>
  )
}

const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const monthFmt = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })

function startOfWeek(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  return x
}

function WeekStrip() {
  const today = useMemo(() => new Date(), [])
  const [offset, setOffset] = useState(0)
  const [dir, setDir] = useState(1)
  const [day, setDay] = useState((today.getDay() + 6) % 7)

  const days = useMemo(() => {
    const start = startOfWeek(today)
    start.setDate(start.getDate() + offset * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [today, offset])

  const go = (step: number) => {
    setDir(step)
    setOffset((o) => o + step)
  }
  const label = monthFmt.format(days[day])

  return (
    <Section>
      <div className="flex items-center justify-between">
        <div className="relative h-9 flex-1 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h2
              key={label}
              initial={{ opacity: 0, y: 14 * dir, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14 * dir, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="absolute text-[26px] font-semibold tracking-[-0.02em]"
            >
              {label}
            </motion.h2>
          </AnimatePresence>
        </div>
        <div className="flex gap-1.5">
          <IconButton label="Vorherige Woche" onClick={() => go(-1)} className="bg-white"><ChevronLeft className="size-4" /></IconButton>
          <IconButton label="Nächste Woche" onClick={() => go(1)} className="bg-white"><ChevronRight className="size-4" /></IconButton>
        </div>
      </div>
      <div className="relative mt-3 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={offset}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: 48 * d, opacity: 0, filter: 'blur(6px)' }),
              center: { x: 0, opacity: 1, filter: 'blur(0px)' },
              exit: (d: number) => ({ x: -48 * d, opacity: 0, filter: 'blur(6px)' }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: easeOut }}
            className="grid grid-cols-7 gap-1"
          >
            {days.map((d, i) => {
              const on = i === day
              const isToday = d.toDateString() === today.toDateString()
              return (
                <button
                  key={i}
                  onClick={() => setDay(i)}
                  aria-pressed={on}
                  className={cn('relative flex flex-col items-center gap-1.5 rounded-[14px] py-2 text-[11px] transition-colors', on ? 'text-white' : 'text-muted hover:text-ink')}
                >
                  {on && <motion.span layoutId="week-day" className="absolute inset-0 rounded-[14px] bg-ink" transition={snappy} />}
                  <span className="relative">{dayNames[i]}</span>
                  <span className={cn('relative text-[14px] font-medium', on ? 'text-white' : 'text-ink')}>{d.getDate()}</span>
                  {isToday && <span className={cn('absolute bottom-1 size-1 rounded-full', on ? 'bg-active' : 'bg-lavender-strong')} />}
                </button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}

function LastVideos() {
  return (
    <Section>
      <div className="flex items-center justify-between">
        <CardTitle>Letzte Videos</CardTitle>
        <IconButton label="Video hinzufügen" className="-mr-1.5 text-muted"><CirclePlus className="size-[18px]" strokeWidth={1.7} /></IconButton>
      </div>
      <Item className="no-scrollbar -mx-1 mt-2 flex snap-x gap-3 overflow-x-auto px-1 pb-3 pt-1">
        {videos.map((v) => (
          <VideoCard key={v.title} video={v} className="w-[164px] shrink-0 snap-start" />
        ))}
      </Item>
    </Section>
  )
}

type NoticeTab = 'overview' | 'shared' | 'comments'

function Notifications() {
  const [tab, setTab] = useState<NoticeTab>('overview')
  const [muted, setMuted] = useState(false)
  const list = tab === 'overview' ? notices : notices.filter((n) => n.tab === tab)

  return (
    <Section>
      <div className="flex items-center justify-between">
        <CardTitle>Benachrichtigungen</CardTitle>
        <div className="flex gap-1">
          {[
            { on: false, label: 'Benachrichtigungen an', icon: Bell },
            { on: true, label: 'Benachrichtigungen pausieren', icon: BellOff },
          ].map((b) => {
            const active = muted === b.on
            return (
              <button key={b.label} aria-label={b.label} aria-pressed={active} onClick={() => setMuted(b.on)} className="relative grid size-8 place-items-center rounded-full">
                {active && <motion.span layoutId="bell-mode" className="absolute inset-0 rounded-full bg-ink" transition={snappy} />}
                <b.icon className={cn('relative size-4 transition-colors', active ? 'text-white' : 'text-muted')} strokeWidth={1.8} />
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-2 border-b border-line">
        <Tabs
          id="notice-tab"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'overview', label: 'Übersicht' },
            { value: 'shared', label: 'Geteilt' },
            { value: 'comments', label: 'Kommentare' },
          ]}
        />
      </div>
      <Swap id={muted ? 'muted' : tab} className="mt-3 grid gap-2.5">
        {muted ? (
          <Item className="card-surface flex flex-col items-center gap-2 px-4 py-8 text-center text-[13px] text-muted">
            <BellOff className="size-5 text-ink" strokeWidth={1.6} />
            Benachrichtigungen sind pausiert.
          </Item>
        ) : (
          list.map((n) => (
            <Item key={n.text} className="card-surface flex gap-3 p-3">
              <Avatar person={n.who} className="size-9 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] leading-snug">{n.text}</p>
                <div className="mt-1.5 flex justify-between text-[10.5px] text-muted">
                  <span>{n.kind}</span>
                  <span>{n.time}</span>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.92 }} className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-ink px-2 text-[10.5px] font-medium text-white">
                <Link2 className="size-3" /> Link
              </motion.button>
            </Item>
          ))
        )}
      </Swap>
    </Section>
  )
}
