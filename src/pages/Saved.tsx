import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bookmark, CirclePlus, ExternalLink, FileText, Folder, Globe, RotateCcw } from 'lucide-react'
import { Blob } from '../components/art/Art'
import { PageHeader } from '../components/shared'
import { Bar, Card, CardTitle, CountUp, IconButton, Item, PillButton, Segmented, cn } from '../components/ui'
import { collections, savedItems, type SavedKind } from '../lib/data'
import { spring, usePresets } from '../lib/motion'

type Filter = 'all' | SavedKind

const kindLabel: Record<SavedKind, string> = { video: 'Video', doc: 'Dok', link: 'Link' }

export function Saved() {
  const [filter, setFilter] = useState<Filter>('all')
  const [removed, setRemoved] = useState<string[]>([])
  const { card, reduced } = usePresets()
  // Nach der ersten Interaktion steuern neu eingeblendete Karten ihren Auftritt selbst
  const interacted = useRef(false)
  const act = (fn: () => void) => {
    interacted.current = true
    fn()
  }

  const kept = savedItems.filter((i) => !removed.includes(i.id))
  const visible = kept.filter((i) => filter === 'all' || i.kind === filter)
  const own = interacted.current

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Für später gespeichert"
        sub="Videos, Dokumente und Links, die du im Workspace gemerkt hast."
        action={
          <>
            <Segmented
              id="saved-filter"
              value={filter}
              onChange={(v) => act(() => setFilter(v))}
              options={[
                { value: 'all', label: 'Alle' },
                { value: 'video', label: 'Videos' },
                { value: 'doc', label: 'Dokumente' },
                { value: 'link', label: 'Links' },
              ]}
            />
            <PillButton
              disabled={removed.length === 0}
              onClick={() => act(() => setRemoved([]))}
              className={cn('transition-opacity', removed.length === 0 && 'pointer-events-none opacity-35')}
            >
              <RotateCcw className="size-3.5" />
              Alle wiederherstellen
            </PillButton>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((it) => (
              <motion.article
                key={it.id}
                layout
                variants={card}
                initial={own ? 'hidden' : undefined}
                animate={own ? 'show' : undefined}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.88, filter: 'blur(8px)', transition: { duration: 0.22 } }}
                whileHover={reduced ? undefined : { y: -4 }}
                transition={spring}
                className="card-surface p-2 hover:shadow-[0_14px_34px_-18px_rgba(21,20,24,0.28)]"
              >
                <div
                  className={cn(
                    'relative grid h-[118px] place-items-center overflow-hidden rounded-[14px]',
                    it.kind === 'video' ? 'bg-gradient-to-b from-[#f3f2f7] to-[#e4e3ea]' : it.tint,
                  )}
                >
                  {it.kind === 'video' ? (
                    <Blob hue={it.hue} seed={it.seed} className="h-full" />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-[14px] bg-white/70 backdrop-blur">
                      {it.kind === 'doc' ? <FileText className="size-5" strokeWidth={1.6} /> : <Globe className="size-5" strokeWidth={1.6} />}
                    </span>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-white">{kindLabel[it.kind]}</span>
                </div>
                <h3 className="mt-2.5 min-h-[36px] px-1 text-[13px] font-medium leading-snug">{it.title}</h3>
                <div className="mt-2 flex items-end justify-between gap-2 px-1 pb-1">
                  <div className="min-w-0">
                    <p className="truncate text-[11.5px]">{it.source}</p>
                    <p className="text-[10.5px] text-muted">{it.date}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <IconButton label="Öffnen" className="size-7 bg-soft"><ExternalLink className="size-3.5" /></IconButton>
                    <IconButton
                      label="Aus Gespeichert entfernen"
                      onClick={() => act(() => setRemoved((r) => [...r, it.id]))}
                      className="size-7 bg-lavender-soft text-[#5b47b5] hover:bg-lavender"
                    >
                      <Bookmark className="size-3.5" fill="currentColor" />
                    </IconButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {visible.length === 0 && (
              <motion.div
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
                className="col-span-full grid place-items-center rounded-[20px] border border-dashed border-faint/60 py-16 text-center text-[13px] text-muted"
              >
                <Bookmark className="mb-2 size-5 text-ink" strokeWidth={1.6} />
                Hier ist gerade nichts gespeichert.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Card lift={false} className="self-start p-5">
          <Item className="flex items-center justify-between">
            <CardTitle>Sammlungen</CardTitle>
            <IconButton label="Sammlung anlegen" className="-mr-1.5 text-muted"><CirclePlus className="size-[18px]" strokeWidth={1.7} /></IconButton>
          </Item>
          <Item className="mt-3 grid gap-4">
            {collections.map((c, i) => (
              <Item key={c.name} className="flex items-center gap-3">
                <span
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-[10px]',
                    c.tone === 'dark' ? 'bg-ink text-white' : c.tone === 'pink' ? 'bg-pink-soft text-[#c0558f]' : 'bg-lavender-soft text-[#7a63d6]',
                  )}
                >
                  <Folder className="size-3.5" strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12.5px] font-medium">{c.name}</span>
                    <span className="shrink-0 text-[10.5px] text-muted">{c.count} Einträge</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-soft">
                    <Bar
                      axis="x"
                      value={c.fill}
                      at={0.7 + i * 0.1}
                      className={cn('h-full rounded-full', c.tone === 'dark' ? 'bg-ink' : c.tone === 'pink' ? 'bg-pink' : 'bg-lavender-strong')}
                    />
                  </div>
                </div>
              </Item>
            ))}
          </Item>
          <Item className="mt-5 flex items-baseline gap-2 border-t border-line pt-4">
            <span className="text-[28px] font-medium leading-none"><CountUp value={kept.length} at={0.8} duration={0.9} /></span>
            <span className="text-[12px] text-muted">Einträge gerade gespeichert</span>
          </Item>
        </Card>
      </div>
    </div>
  )
}
