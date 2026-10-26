import { useId } from 'react'
import { motion } from 'motion/react'
import { usePresets } from '../../lib/motion'

const useSvgId = () => useId().replace(/[^a-zA-Z0-9]/g, '')

/** Windrad-Blüte aus gebogenen Blättern, dreht sich sehr langsam. */
export function Flower({ className }: { className?: string }) {
  const id = useSvgId()
  const { reduced } = usePresets()
  const blade = 'M0 0 C 14 -22, 62 -46, 90 -22 C 76 -6, 34 4, 0 0 Z'
  return (
    <motion.svg
      viewBox="-100 -100 200 200"
      className={className}
      aria-hidden
      animate={reduced ? undefined : { rotate: 360 }}
      transition={{ duration: 80, ease: 'linear', repeat: Infinity }}
    >
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6f2ff" />
          <stop offset=".5" stopColor="#c9b8f4" />
          <stop offset="1" stopColor="#9a82e4" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9a5ef" />
        </linearGradient>
        <radialGradient id={`${id}c`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 12 }, (_, i) => (
        <path key={`o${i}`} d={blade} transform={`rotate(${i * 30})`} fill={`url(#${id}a)`} stroke="#fff" strokeOpacity=".5" strokeWidth=".8" />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <path key={`i${i}`} d={blade} transform={`rotate(${i * 36 + 14}) scale(.58)`} fill={`url(#${id}b)`} opacity=".85" />
      ))}
      <circle r="16" fill={`url(#${id}c)`} />
    </motion.svg>
  )
}

const blobPalettes = {
  violet: ['#ead9ff', '#9d5ce6', '#43188f'],
  blue: ['#d6e4ff', '#4f78ee', '#1b3487'],
  rose: ['#ffd9e6', '#d8487e', '#76123a'],
  teal: ['#d2fff3', '#33b49b', '#0d5a4f'],
  amber: ['#fff0cf', '#eaa23a', '#8a4a09'],
} as const
export type BlobHue = keyof typeof blobPalettes

/** Zerknitterter, plastisch beleuchteter Blob als Video-Vorschaubild. */
export function Blob({ hue = 'violet', seed = 3, className }: { hue?: BlobHue; seed?: number; className?: string }) {
  const id = useSvgId()
  const [light, mid, dark] = blobPalettes[hue]
  const { reduced } = usePresets()
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}g`} cx=".36" cy=".3" r=".8">
          <stop offset="0" stopColor={light} />
          <stop offset=".45" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <filter id={`${id}f`} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency=".22" numOctaves="2" seed={seed + 7} result="n2" />
          <feDiffuseLighting in="n2" surfaceScale="1.6" lightingColor="#fff" result="l">
            <feDistantLight azimuth="235" elevation="52" />
          </feDiffuseLighting>
          <feComposite in="l" in2="d" operator="in" result="lit" />
          <feBlend in="d" in2="lit" mode="multiply" />
        </filter>
        <filter id={`${id}s`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <ellipse cx="80" cy="92" rx="36" ry="5" fill="#2a2440" opacity=".16" filter={`url(#${id}s)`} />
      <motion.g
        animate={reduced ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 4 + (seed % 3), repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M44 52c0-20 16-32 36-32s38 9 38 30-14 34-38 34-36-12-36-32z"
          fill={`url(#${id}g)`}
          filter={`url(#${id}f)`}
        />
      </motion.g>
    </svg>
  )
}

/** Gewundene Spirale aus gestapelten Ringen. */
export function Spiral({ className }: { className?: string }) {
  const id = useSvgId()
  return (
    <svg viewBox="0 0 100 170" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe3f1" />
          <stop offset=".5" stopColor="#e9a9d4" />
          <stop offset="1" stopColor="#b9a2ee" />
        </linearGradient>
      </defs>
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse
          key={i}
          cx="52"
          cy={22 + i * 21}
          rx="34"
          ry="11"
          fill="none"
          stroke={`url(#${id}r)`}
          strokeWidth="13"
          transform={`rotate(-14 52 ${22 + i * 21})`}
        />
      ))}
    </svg>
  )
}

/** Eigenes Logo: Ring mit Punkt. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="11" cy="13" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="18.5" cy="5.5" r="2.6" fill="#d9cff6" />
    </svg>
  )
}

/** Vier Punkte als Übersichts-Icon (passend zur Strichstärke von lucide). */
export function DotsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <circle cx="9" cy="9" r="1.6" />
      <circle cx="15" cy="9" r="1.6" />
      <circle cx="9" cy="15" r="1.6" />
      <circle cx="15" cy="15" r="1.6" />
    </svg>
  )
}
