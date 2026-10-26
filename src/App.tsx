import { useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Sidebar, type PageId } from './components/Sidebar'
import { PageDelayProvider, PresetProvider, usePresets } from './lib/motion'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Saved } from './pages/Saved'
import { Cloud } from './pages/Cloud'
import { Placeholder, Videos } from './pages/Other'

// Beim ersten Laden wartet der Inhalt, bis die Leiste gewachsen ist.
// Beim Tab-Wechsel: alter Inhalt raus (~140 ms), kurze Leerpause, dann Neuaufbau.
const INTRO_DELAY = 0.42
const SWITCH_DELAY = 0.2

export default function App() {
  return (
    <PresetProvider>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </PresetProvider>
  )
}

function Shell() {
  const [active, setActive] = useState<PageId>('home')
  const [run, setRun] = useState(0)
  const navigated = useRef(false)
  const main = useRef<HTMLElement>(null)
  const { page, reduced } = usePresets()

  const select = (id: PageId) => {
    if (id === active) return
    navigated.current = true
    setActive(id)
  }
  const replay = () => {
    navigated.current = false
    setActive('home')
    setRun((r) => r + 1)
  }

  const delay = reduced ? 0 : navigated.current ? SWITCH_DELAY : INTRO_DELAY

  return (
    <div className="h-dvh bg-white p-2 sm:p-4">
      <motion.div
        key={run}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex h-full gap-3 rounded-[28px] bg-frame p-2.5 sm:gap-5 sm:p-3"
      >
        <Sidebar active={active} onSelect={select} onReplay={replay} />
        <motion.main ref={main} layoutScroll className="no-scrollbar min-w-0 flex-1 overflow-y-auto rounded-[20px] py-2 pr-1 sm:pr-2">
          <AnimatePresence mode="wait" onExitComplete={() => main.current?.scrollTo({ top: 0 })}>
            <motion.div key={active} variants={page} custom={delay} initial="hidden" animate="show" exit="exit">
              <PageDelayProvider value={delay}>
                <Page id={active} onNavigate={select} />
              </PageDelayProvider>
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </motion.div>
    </div>
  )
}

function Page({ id, onNavigate }: { id: PageId; onNavigate: (id: PageId) => void }) {
  switch (id) {
    case 'home':
      return <Home />
    case 'profile':
      return <Profile />
    case 'saved':
      return <Saved />
    case 'cloud':
      return <Cloud />
    case 'videos':
      return <Videos />
    default:
      return <Placeholder id={id} onNavigate={onNavigate} />
  }
}
