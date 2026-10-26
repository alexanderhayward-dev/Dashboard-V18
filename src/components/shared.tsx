import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Calendar, Eye, MessageCircle } from 'lucide-react'
import { Blob } from './art/Art'
import { BlurText, Item, cn } from './ui'
import { avatar, type Person, type VideoItem } from '../lib/data'
import { spring, usePresets } from '../lib/motion'

export function Avatar({ person, className }: { person: Pick<Person, 'name' | 'bg'>; className?: string }) {
  return <img src={avatar(person.name, person.bg)} alt={person.name} draggable={false} className={cn('rounded-full', className)} />
}

export function VideoCard({ video, className }: { video: VideoItem; className?: string }) {
  const { item, reduced } = usePresets()
  return (
    <motion.article
      variants={item}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={spring}
      className={cn('card-surface cursor-pointer p-2 hover:shadow-[0_14px_30px_-18px_rgba(21,20,24,0.3)]', className)}
    >
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[14px] bg-gradient-to-b from-[#f3f2f7] to-[#e4e3ea]">
        <Blob hue={video.hue} seed={video.seed} className="w-[92%]" />
        <span className="absolute bottom-2 right-2 rounded-full bg-ink/90 px-2 py-0.5 text-[10px] font-medium text-white">{video.minutes} Min.</span>
      </div>
      <h3 className="mt-2.5 line-clamp-3 px-1 text-[12.5px] font-medium leading-snug">{video.title}</h3>
      <div className="mt-2 flex items-center gap-2 whitespace-nowrap px-1 pb-1 text-[10.5px] text-muted">
        <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{video.date}</span>
        <span className="inline-flex items-center gap-1"><Eye className="size-3" />{video.views}</span>
        <span className="inline-flex items-center gap-1"><MessageCircle className="size-3" />{video.comments}</span>
      </div>
    </motion.article>
  )
}

/** Seitenkopf mit Wort-für-Wort-Titel, Untertitel und optionaler Aktion rechts. */
export function PageHeader({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  const { item } = usePresets()
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <Item>
        <BlurText text={title} className="text-[28px] font-semibold tracking-[-0.02em] sm:text-[32px]" />
        <motion.p variants={item} className="mt-1 text-[13px] text-muted">{sub}</motion.p>
      </Item>
      {action && <Item className="flex flex-wrap items-center gap-3">{action}</Item>}
    </div>
  )
}
