import { useState, type Ref } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FileArchive, FileText, Film, Folder, Image, Search, Upload } from 'lucide-react'
import { Avatar, PageHeader } from '../components/shared'
import { Card, CardTitle, CountUp, Item, PillButton, Section, cn } from '../components/ui'
import { files, folders, me, storage, type FileRow } from '../lib/data'
import { easeOut, spring, usePresets, useStartDelay } from '../lib/motion'

const typeIcon = {
  video: { icon: Film, tint: 'bg-lavender-soft text-[#7a63d6]' },
  image: { icon: Image, tint: 'bg-pink-soft text-[#c0558f]' },
  doc: { icon: FileText, tint: 'bg-sky text-[#4a6fb8]' },
  archive: { icon: FileArchive, tint: 'bg-mint text-[#3f8a55]' },
}

type Row = FileRow & { id: string; uploading?: boolean }

export function Cloud() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<Row[]>(() => files.map((f, i) => ({ ...f, id: `f${i}` })))
  const [uploads, setUploads] = useState(0)

  const upload = () => {
    const n = uploads + 1
    setUploads(n)
    setRows((r) => [
      { id: `u${n}`, name: `Entwurf-${n}.pdf`, type: 'doc', size: '1,4 MB', owner: { name: me.name, role: '', bg: me.bg }, changed: 'gerade eben', uploading: true },
      ...r,
    ])
  }
  const finish = (id: string) => setRows((r) => r.map((x) => (x.id === id ? { ...x, uploading: false } : x)))

  const shown = rows.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Cloud-Speicher"
        sub="Alles, was dein Team hochgeladen, sortiert und gesichert hat."
        action={
          <PillButton onClick={upload}>
            <Upload className="size-3.5" />
            Datei hochladen
          </PillButton>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <StorageCard />
        <Section>
          <div className="flex items-baseline justify-between">
            <CardTitle>Ordner</CardTitle>
            <span className="text-[11px] text-muted">{folders.length} Ordner</span>
          </div>
          <Item className="mt-3 grid grid-cols-2 gap-3">
            {folders.map((f) => (
              <Item key={f.name}>
                <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} transition={spring} className="card-surface w-full p-4 text-left">
                  <span className={cn('grid size-9 place-items-center rounded-[11px]', f.tint)}>
                    <Folder className="size-4" strokeWidth={1.8} />
                  </span>
                  <span className="mt-3 block text-[13px] font-medium">{f.name}</span>
                  <span className="block text-[11px] text-muted">{f.meta}</span>
                </motion.button>
              </Item>
            ))}
          </Item>
        </Section>
      </div>

      <Card lift={false} className="p-5">
        <Item className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Zuletzt geändert</CardTitle>
          <label className="flex w-full items-center gap-2 rounded-full bg-soft px-3 py-1.5 text-[12.5px] sm:w-64">
            <Search className="size-3.5 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Dateien durchsuchen"
              aria-label="Dateien durchsuchen"
              className="w-full bg-transparent outline-none placeholder:text-muted"
            />
          </label>
        </Item>
        <Item className="mt-4 hidden grid-cols-[minmax(0,2.4fr)_0.8fr_1.2fr_1fr] gap-3 border-b border-line px-2 pb-2 text-[11px] text-muted sm:grid">
          <span>Name</span>
          <span>Größe</span>
          <span>Besitzer</span>
          <span>Geändert</span>
        </Item>
        <Item className="relative">
          <ul>
            <AnimatePresence initial={false} mode="popLayout">
              {shown.map((r) => (
                <FileLine key={r.id} row={r} onDone={() => finish(r.id)} />
              ))}
            </AnimatePresence>
          </ul>
          <AnimatePresence>
            {shown.length === 0 && (
              <motion.p
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                className="py-10 text-center text-[13px] text-muted"
              >
                Keine Datei passt zu „{query}“.
              </motion.p>
            )}
          </AnimatePresence>
        </Item>
      </Card>
    </div>
  )
}

function FileLine({ row, onDone, ref }: { row: Row; onDone: () => void; ref?: Ref<HTMLLIElement> }) {
  const { item, reduced } = usePresets()
  const t = typeIcon[row.type]
  return (
    <motion.li
      ref={ref}
      layout
      variants={item}
      initial={row.uploading ? { opacity: 0, y: -12, filter: 'blur(8px)' } : undefined}
      animate={row.uploading ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)', transition: { duration: 0.18 } }}
      transition={spring}
      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] px-2 py-2.5 transition-colors hover:bg-soft sm:grid-cols-[minmax(0,2.4fr)_0.8fr_1.2fr_1fr]"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className={cn('grid size-8 shrink-0 place-items-center rounded-[10px]', t.tint)}>
          <t.icon className="size-3.5" strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12.5px] font-medium">{row.name}</span>
          {row.uploading !== undefined && (
            <span className="mt-1 block h-1 overflow-hidden rounded-full bg-soft">
              <motion.span
                className="block h-full rounded-full bg-lavender-strong"
                initial={{ width: reduced ? '100%' : '0%' }}
                animate={{ width: '100%', opacity: row.uploading ? 1 : 0 }}
                transition={{ width: { duration: reduced ? 0 : 1.8, ease: easeOut }, opacity: { duration: 0.4, delay: 0.3 } }}
                onAnimationComplete={() => row.uploading && onDone()}
              />
            </span>
          )}
        </span>
      </span>
      <span className="text-[12px] text-muted">{row.uploading ? 'lädt …' : row.size}</span>
      <span className="hidden items-center gap-2 text-[12px] sm:flex">
        <Avatar person={row.owner} className="size-6" />
        {row.owner.name.split(' ')[0]}
      </span>
      <span className="hidden text-[12px] text-muted sm:block">{row.changed}</span>
    </motion.li>
  )
}

function StorageCard() {
  const used = storage.parts.reduce((a, p) => a + p.value, 0)
  const delay = useStartDelay(0.6)
  const { reduced } = usePresets()
  const r = 52
  let start = 0
  return (
    <Card lift={false} className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
      <Item className="sm:col-span-2"><CardTitle>Speicher</CardTitle></Item>
      <Item className="relative mx-auto size-[156px]">
        <svg viewBox="0 0 132 132" className="size-full -rotate-90" aria-hidden>
          <circle cx="66" cy="66" r={r} fill="none" stroke="var(--color-soft)" strokeWidth="12" />
          {storage.parts.map((p, i) => {
            const frac = p.value / storage.total
            const offset = start
            start += frac
            return (
              <motion.circle
                key={p.label}
                cx="66"
                cy="66"
                r={r}
                fill="none"
                stroke={p.color}
                strokeWidth="12"
                strokeLinecap="round"
                initial={reduced ? false : { pathLength: 0, pathOffset: offset }}
                animate={{ pathLength: Math.max(frac - 0.025, 0.01), pathOffset: offset }}
                transition={{ duration: 1.1, ease: easeOut, delay: delay + i * 0.18 }}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span className="text-[30px] font-medium leading-none tracking-[-0.03em]"><CountUp value={used} decimals={1} at={0.6} /></span>
          <span className="mt-1 text-[10.5px] text-muted">von {storage.total} GB belegt</span>
        </div>
      </Item>
      <Item className="grid gap-3">
        {storage.parts.map((p, i) => (
          <Item key={p.label} className="flex items-center gap-2.5 text-[12.5px]">
            <span className="size-2.5 rounded-[4px]" style={{ background: p.color }} />
            <span className="flex-1">{p.label}</span>
            <span className="font-medium"><CountUp value={p.value} decimals={1} suffix=" GB" at={0.7 + i * 0.1} /></span>
          </Item>
        ))}
        <Item className="flex items-center gap-2.5 border-t border-line pt-3 text-[12.5px] text-muted">
          <span className="size-2.5 rounded-[4px] bg-soft ring-1 ring-line" />
          <span className="flex-1">Frei</span>
          <span><CountUp value={storage.total - used} decimals={1} suffix=" GB" at={0.9} /></span>
        </Item>
      </Item>
    </Card>
  )
}
