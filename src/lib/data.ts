import type { BlobHue } from '../components/art/Art'
import { avatars } from './avatars.generated'

/** Avatar als Daten-URI (erzeugt mit `npm run avatars`), Fallback: farbiger Kreis */
export function avatar(name: string, bg: string) {
  return (
    avatars[name] ??
    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><circle cx=".5" cy=".5" r=".5" fill="#${bg}"/></svg>`)}`
  )
}

export type Person = { name: string; role: string; bg: string }

export const people: Person[] = [
  { name: 'Mara Lind', role: 'UX Research', bg: 'e9e3fa' },
  { name: 'Jonas Weber', role: 'Frontend', bg: 'f9e1ef' },
  { name: 'Elif Kaya', role: 'Produkt', bg: 'd9e4f7' },
  { name: 'Theo Brandt', role: 'Motion Design', bg: 'd5ebd9' },
  { name: 'Nora Vogel', role: 'Content', bg: 'fdebd3' },
  { name: 'Samir Haddad', role: 'Backend', bg: 'e9e3fa' },
]

export const me = { name: 'Lena Hoffmann', bg: 'f9e1ef' }

export type VideoItem = { title: string; hue: BlobHue; seed: number; minutes: number; date: string; views: number; comments: number }

export const videos: VideoItem[] = [
  { title: 'Designsystem aufräumen in zehn Schritten', hue: 'violet', seed: 3, minutes: 4, date: '2. Okt.', views: 312, comments: 15 },
  { title: 'Nutzerinterviews auswerten ohne Chaos', hue: 'blue', seed: 8, minutes: 8, date: '30. Sep.', views: 188, comments: 12 },
  { title: 'Bewegung, die Orientierung gibt', hue: 'rose', seed: 5, minutes: 6, date: '24. Sep.', views: 421, comments: 31 },
  { title: 'Prototypen testen mit echten Daten', hue: 'teal', seed: 11, minutes: 11, date: '19. Sep.', views: 97, comments: 4 },
]

export type Notice = { who: Person; text: string; kind: string; time: string; tab: 'overview' | 'shared' | 'comments' }

export const notices: Notice[] = [
  { who: people[0], text: 'Mara lädt dich zum Termin „Roadmap Q1 festlegen“ ein', kind: 'Einladung', time: 'vor 30 Min.', tab: 'overview' },
  { who: people[2], text: 'Elif hat dein Video „Bewegung, die Orientierung gibt“ kommentiert', kind: 'Kommentar', time: 'vor 1 Std.', tab: 'comments' },
  { who: people[3], text: 'Theo hat die Datei „Onboarding-Flow v3“ mit dir geteilt', kind: 'Freigabe', time: 'vor 2 Std.', tab: 'shared' },
  { who: people[1], text: 'Jonas hat „Komponenten-Inventar“ für das Team freigegeben', kind: 'Freigabe', time: 'vor 3 Std.', tab: 'shared' },
  { who: people[4], text: 'Nora fragt: „Passt der neue Teaser so für Freitag?“', kind: 'Kommentar', time: 'gestern', tab: 'comments' },
]

export const reminders = [
  { title: 'Design-Review Onboarding', time: '12:45' },
  { title: 'Sync mit Engineering', time: '14:00' },
  { title: 'Feedbackrunde Kampagne', time: '16:30' },
]

export type SavedKind = 'video' | 'doc' | 'link'
export type SavedItem = {
  id: string
  kind: SavedKind
  title: string
  source: string
  date: string
  hue?: BlobHue
  seed?: number
  tint?: string
}

export const savedItems: SavedItem[] = [
  { id: 's1', kind: 'video', title: 'Designsystem aufräumen in zehn Schritten', source: 'Letzte Videos', date: 'Gespeichert 3. Okt.', hue: 'violet', seed: 3 },
  { id: 's2', kind: 'doc', title: 'Q3-Review: Erkenntnisse und nächste Schritte', source: 'Studio Nordlicht', date: 'Gespeichert 28. Sep.', tint: 'bg-lavender' },
  { id: 's3', kind: 'link', title: 'Leitfaden für Animationen in Oberflächen', source: 'motion-notes.dev', date: 'Gespeichert 22. Sep.', tint: 'bg-pink-soft' },
  { id: 's4', kind: 'video', title: 'Bewegung, die Orientierung gibt', source: 'Bibliothek', date: 'Gespeichert 18. Sep.', hue: 'rose', seed: 5 },
  { id: 's5', kind: 'doc', title: 'Checkliste für neue Teammitglieder', source: 'People & Culture', date: 'Gespeichert 12. Sep.', tint: 'bg-mint' },
  { id: 's6', kind: 'link', title: 'Barrierefreie Muster zum Nachschlagen', source: 'a11y-patterns.org', date: 'Gespeichert 9. Sep.', tint: 'bg-sky' },
  { id: 's7', kind: 'video', title: 'Prototypen testen mit echten Daten', source: 'Bibliothek', date: 'Gespeichert 2. Sep.', hue: 'teal', seed: 11 },
]

export const collections = [
  { name: 'Designsystem-Referenz', count: 24, fill: 72, tone: 'dark' },
  { name: 'Inspiration', count: 41, fill: 58, tone: 'lavender' },
  { name: 'Onboarding', count: 9, fill: 26, tone: 'pink' },
  { name: 'Später lesen', count: 17, fill: 12, tone: 'lavender' },
] as const

export const folders = [
  { name: 'Kundenprojekte', meta: '128 Dateien · 24,1 GB', tint: 'bg-lavender-soft text-[#7a63d6]' },
  { name: 'Präsentationen', meta: '64 Dateien · 3,8 GB', tint: 'bg-pink-soft text-[#c0558f]' },
  { name: 'Markenassets', meta: '212 Dateien · 9,1 GB', tint: 'bg-mint text-[#3f8a55]' },
  { name: 'Team-Aufnahmen', meta: '37 Dateien · 27,2 GB', tint: 'bg-sky text-[#4a6fb8]' },
]

export type FileRow = { name: string; type: 'video' | 'image' | 'doc' | 'archive'; size: string; owner: Person; changed: string }

export const files: FileRow[] = [
  { name: 'Kickoff-Workshop.mp4', type: 'video', size: '1,2 GB', owner: people[3], changed: 'heute, 09:12' },
  { name: 'Moodboard-Herbst.png', type: 'image', size: '8,4 MB', owner: people[0], changed: 'heute, 08:40' },
  { name: 'Angebot-Relaunch.pdf', type: 'doc', size: '2,1 MB', owner: people[2], changed: 'gestern' },
  { name: 'Icons-Export.zip', type: 'archive', size: '46 MB', owner: people[1], changed: 'gestern' },
  { name: 'Interview-Notizen.docx', type: 'doc', size: '310 KB', owner: people[4], changed: '22. Okt.' },
  { name: 'Produktfilm-Rohschnitt.mov', type: 'video', size: '3,7 GB', owner: people[3], changed: '21. Okt.' },
]

export const storage = {
  total: 100,
  parts: [
    { label: 'Videos', value: 38.4, color: '#151418' },
    { label: 'Bilder', value: 14.6, color: '#b7a6ec' },
    { label: 'Dokumente', value: 11.2, color: '#f0a9d2' },
  ],
}

export const focusWeek = [
  { day: 'Mo', hours: 6.2 },
  { day: 'Di', hours: 5.4 },
  { day: 'Mi', hours: 9.1 },
  { day: 'Do', hours: 4.8 },
  { day: 'Fr', hours: 7.3 },
  { day: 'Sa', hours: 1.6 },
  { day: 'So', hours: 1.1 },
]

export const activity = [
  { text: 'Video „Bewegung, die Orientierung gibt“ hochgeladen', time: 'vor 2 Std.' },
  { text: 'Kommentar zu „Onboarding-Flow v3“ beantwortet', time: 'vor 5 Std.' },
  { text: 'Sammlung „Inspiration“ um 4 Einträge ergänzt', time: 'gestern' },
  { text: 'Projekt „Relaunch Kundenportal“ abgeschlossen', time: '21. Okt.' },
]

export const skills = ['Produktstrategie', 'Designsysteme', 'Prototyping', 'Motion', 'Workshops']
