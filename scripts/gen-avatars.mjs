// Erzeugt die Avatare einmalig als Daten-URIs, damit DiceBear nicht im Bundle landet.
// Aufruf: npm run avatars
import { writeFileSync } from 'node:fs'
import { createAvatar } from '@dicebear/core'
import * as notionists from '@dicebear/notionists'

const people = [
  ['Mara Lind', 'e9e3fa'],
  ['Jonas Weber', 'f9e1ef'],
  ['Elif Kaya', 'd9e4f7'],
  ['Theo Brandt', 'd5ebd9'],
  ['Nora Vogel', 'fdebd3'],
  ['Samir Haddad', 'e9e3fa'],
  ['Lena Hoffmann', 'f9e1ef'],
]

const entries = people.map(([name, bg]) => {
  const uri = createAvatar(notionists, { seed: name, backgroundColor: [bg], radius: 50 }).toDataUri()
  return `  ${JSON.stringify(name)}: ${JSON.stringify(uri)},`
})

writeFileSync(
  new URL('../src/lib/avatars.generated.ts', import.meta.url),
  `// Automatisch erzeugt von scripts/gen-avatars.mjs – nicht von Hand bearbeiten.\nexport const avatars: Record<string, string> = {\n${entries.join('\n')}\n}\n`,
)
console.log(`${people.length} Avatare geschrieben`)
