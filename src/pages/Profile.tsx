import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CirclePlus, Clock, Mail, MapPin, Pencil, Star, Upload, Users, Video } from 'lucide-react'
import { Flower } from '../components/art/Art'
import { Avatar } from '../components/shared'
import { Bar, Card, CardTitle, CountUp, IconButton, Item, PillButton, cn } from '../components/ui'
import { activity, focusWeek, me, people, skills } from '../lib/data'
import { easeOut, snappy, spring, usePresets } from '../lib/motion'

export function Profile() {
  return (
    <div className="grid gap-4">
      <Header />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Star} label="Projekte ausgeliefert" value={36} sub="+6 in diesem Quartal" at={0.5} />
        <Stat icon={Video} label="Videos veröffentlicht" value={117} sub="Top: Bewegung, die Orientierung gibt" at={0.58} />
        <Stat icon={Users} label="Follower" value={2278} sub="+64 in diesem Monat" at={0.66} />
        <Stat icon={Clock} label="Fokusstunden" value={366} sub="seit Januar" at={0.74} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <About />
        <FocusWeek />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <Activity />
        <Team />
      </div>
    </div>
  )
}

function Header() {
  const [available, setAvailable] = useState(true)
  const { reduced } = usePresets()
  return (
    <Card lift={false} className="overflow-hidden">
      <div className="relative h-[110px] overflow-hidden bg-gradient-to-r from-lavender via-[#dccff5] to-pink-soft sm:h-[128px]">
        <Item className="absolute -top-16 right-6 sm:right-16">
          <Flower className="size-[230px]" />
        </Item>
      </div>
      <div className="flex flex-wrap items-end gap-4 px-5 pb-5 sm:px-6">
        <Item className="-mt-11">
          <motion.div
            initial={reduced ? false : { scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...spring, delay: 0.45 }}
            whileHover={{ scale: 1.05 }}
            className="rounded-full bg-white p-1"
          >
            <Avatar person={me} className="size-[84px]" />
          </motion.div>
        </Item>
        <Item className="min-w-0 flex-1 pb-0.5">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">{me.name}</h1>
          <p className="text-[13px] text-ink/75">Lead Product Designerin · Studio Nordlicht</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted">
            <span className="inline-flex items-center gap-1"><MapPin className="size-3" />Hamburg</span>
            <span className="inline-flex items-center gap-1"><Mail className="size-3" />lena@studio-nordlicht.de</span>
          </p>
        </Item>
        <Item className="flex items-center gap-2">
          <motion.button
            layout
            onClick={() => setAvailable((a) => !a)}
            transition={snappy}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12.5px] font-medium transition-colors duration-300',
              available ? 'bg-ok-soft text-ok' : 'bg-pink-soft text-[#c0558f]',
            )}
          >
            <span className="relative flex size-2">
              {available && !reduced && <span className="absolute inset-0 animate-ping rounded-full bg-ok/60" />}
              <span className={cn('relative size-2 rounded-full', available ? 'bg-ok' : 'bg-[#c0558f]')} />
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={String(available)}
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.25, ease: easeOut }}
              >
                {available ? 'Verfügbar' : 'Im Fokus'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <PillButton>
            <Pencil className="size-3.5" />
            Profil bearbeiten
          </PillButton>
        </Item>
      </div>
    </Card>
  )
}

function Stat({ icon: Icon, label, value, sub, at }: { icon: typeof Star; label: string; value: number; sub: string; at: number }) {
  return (
    <Card className="p-5">
      <Item className="flex items-center gap-2 text-[12.5px] text-ink/80">
        <span className="grid size-7 place-items-center rounded-full bg-lavender-soft">
          <Icon className="size-3.5 text-[#7a63d6]" strokeWidth={1.8} />
        </span>
        {label}
      </Item>
      <Item className="mt-3 text-[32px] font-medium leading-none tracking-[-0.03em]">
        <CountUp value={value} at={at} />
      </Item>
      <Item className="mt-2 truncate text-[11.5px] text-muted">{sub}</Item>
    </Card>
  )
}

function About() {
  const { item } = usePresets()
  return (
    <Card className="p-5">
      <Item><CardTitle>Über mich</CardTitle></Item>
      <Item className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-ink/75">
        Ich gestalte Werkzeuge für die Zusammenarbeit in Teams und mache aus unübersichtlichen Abläufen ruhige, klare
        Oberflächen. Vorher war ich in zwei Start-ups im Gesundheitsbereich. Am liebsten arbeite ich an Details, die
        man erst bemerkt, wenn sie fehlen.
      </Item>
      <Item className="mt-5 text-[12px] font-medium">
        Skills <span className="font-normal text-muted">· nach Schwerpunkt</span>
      </Item>
      <Item className="mt-2.5 flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <motion.span
            key={s}
            variants={item}
            whileHover={{ y: -2 }}
            className={cn(
              'cursor-default rounded-full px-3 py-1.5 text-[12px] font-medium',
              i === 0 ? 'bg-ink text-white' : i === 1 ? 'bg-lavender-soft text-[#5b47b5]' : 'border border-line text-ink/80',
            )}
          >
            {s}
          </motion.span>
        ))}
      </Item>
    </Card>
  )
}

function FocusWeek() {
  const max = Math.max(...focusWeek.map((d) => d.hours))
  const peak = focusWeek.findIndex((d) => d.hours === max)
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? peak
  const total = focusWeek.reduce((a, d) => a + d.hours, 0)

  return (
    <Card className="p-5">
      <Item className="flex items-baseline justify-between">
        <CardTitle>Fokus diese Woche</CardTitle>
        <span className="text-[15px] font-semibold"><CountUp value={total} decimals={1} suffix=" h" at={0.7} /></span>
      </Item>
      <Item className="mt-5 grid grid-cols-7 gap-2" onMouseLeave={() => setHover(null)}>
        {focusWeek.map((d, i) => (
          <button
            key={d.day}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            aria-label={`${d.day}: ${d.hours.toLocaleString('de-DE')} Stunden`}
            className="group flex flex-col items-center gap-2"
          >
            <div className="relative flex h-[150px] w-full max-w-[30px] items-end rounded-full bg-soft">
              <Bar
                value={(d.hours / max) * 100}
                at={0.75 + i * 0.07}
                className={cn('w-full rounded-full transition-colors', i === shown ? 'bg-lavender-strong' : 'bg-pink group-hover:bg-lavender')}
              />
              {i === shown && (
                <motion.span
                  layoutId="focus-tip"
                  transition={snappy}
                  className="absolute left-1/2 top-2 -ml-[18px] w-[36px] rounded-full bg-ink py-0.5 text-center text-[10px] font-medium text-white"
                >
                  {d.hours.toLocaleString('de-DE')} h
                </motion.span>
              )}
            </div>
            <span className={cn('text-[11px] transition-colors', i === shown ? 'text-ink' : 'text-muted')}>{d.day}</span>
          </button>
        ))}
      </Item>
    </Card>
  )
}

function Activity() {
  return (
    <Card className="p-5">
      <Item><CardTitle>Letzte Aktivität</CardTitle></Item>
      <Item className="mt-3 grid">
        {activity.map((a, i) => (
          <Item key={a.text} className="flex items-center gap-3 border-b border-line py-3 last:border-0">
            <span className={cn('grid size-8 shrink-0 place-items-center rounded-full', i % 2 ? 'bg-pink-soft' : 'bg-lavender-soft')}>
              <Upload className="size-3.5" strokeWidth={1.8} />
            </span>
            <span className="flex-1 text-[12.5px]">{a.text}</span>
            <span className="shrink-0 text-[11px] text-muted">{a.time}</span>
          </Item>
        ))}
      </Item>
    </Card>
  )
}

function Team() {
  return (
    <Card className="p-5">
      <Item className="flex items-center justify-between">
        <CardTitle>Team</CardTitle>
        <IconButton label="Mitglied hinzufügen" className="-mr-1.5 text-muted"><CirclePlus className="size-[18px]" strokeWidth={1.7} /></IconButton>
      </Item>
      <Item className="mt-2 grid">
        {people.slice(0, 4).map((p, i) => (
          <Item key={p.name} className="flex items-center gap-3 py-2">
            <Avatar person={p} className="size-9" />
            <span className="flex-1">
              <span className="block text-[12.5px] font-medium">{p.name}</span>
              <span className="block text-[11px] text-muted">{p.role}</span>
            </span>
            <span className={cn('size-2 rounded-full', i < 2 ? 'bg-ok' : 'bg-faint')} title={i < 2 ? 'online' : 'offline'} />
          </Item>
        ))}
      </Item>
    </Card>
  )
}
