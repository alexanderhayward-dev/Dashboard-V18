import { useState } from 'react'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { PageHeader, VideoCard } from '../components/shared'
import { Card, Item, PillButton, Segmented } from '../components/ui'
import { videos } from '../lib/data'
import { spring, usePresets } from '../lib/motion'
import type { PageId } from '../components/Sidebar'

export function Videos() {
  const [sort, setSort] = useState<'new' | 'popular'>('new')
  const list = sort === 'new' ? videos : [...videos].sort((a, b) => b.views - a.views)
  return (
    <div className="grid gap-5">
      <PageHeader
        title="Videos"
        sub="Aufzeichnungen, Tutorials und Workshops aus dem Team."
        action={
          <Segmented
            id="video-sort"
            value={sort}
            onChange={setSort}
            options={[
              { value: 'new', label: 'Neueste' },
              { value: 'popular', label: 'Beliebt' },
            ]}
          />
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((v) => (
          <motion.div key={v.title} layout transition={spring}>
            <VideoCard video={v} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const titles: Partial<Record<PageId, [string, string]>> = {
  messages: ['Nachrichten', 'Direkte Unterhaltungen mit deinem Team.'],
  settings: ['Einstellungen', 'Konto, Benachrichtigungen und Darstellung.'],
  calls: ['Anrufe', 'Geplante und vergangene Gespräche.'],
}

export function Placeholder({ id, onNavigate }: { id: PageId; onNavigate: (id: PageId) => void }) {
  const [title, sub] = titles[id] ?? ['Seite', '']
  const { reduced } = usePresets()
  return (
    <div className="grid gap-5">
      <PageHeader title={title} sub={sub} />
      <Card lift={false} className="grid place-items-center px-6 py-16 text-center">
        <Item>
          <motion.span
            animate={reduced ? undefined : { rotate: [0, 12, -8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto grid size-14 place-items-center rounded-full bg-lavender-soft text-[#7a63d6]"
          >
            <Sparkles className="size-6" strokeWidth={1.6} />
          </motion.span>
        </Item>
        <Item className="mt-4 text-[17px] font-semibold">In dieser Demo nicht ausgebaut</Item>
        <Item className="mt-1 max-w-sm text-[13px] text-muted">
          Der Seitenwechsel funktioniert trotzdem. Die vollständigen Seiten aus dem Video sind Übersicht, Profil,
          Gespeichert und Cloud.
        </Item>
        <Item className="mt-5 flex flex-wrap justify-center gap-2">
          <PillButton onClick={() => onNavigate('home')}>Zur Übersicht</PillButton>
          <PillButton onClick={() => onNavigate('saved')} className="bg-soft! text-ink!">Gespeichert</PillButton>
        </Item>
      </Card>
    </div>
  )
}
