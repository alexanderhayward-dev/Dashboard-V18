# Dashboard V18

Neutrales Demo-Dashboard, um die Bewegung aus dem Instagram-Video „code.xr Dashboard V18“ nachzubauen:
gestaffeltes Einblenden aus der Unschärfe, wachsende Seitenleiste, gleitende Aktiv-Indikatoren,
hochzählende Zahlen, wachsende Balken und weiche Tab-Wechsel. Eigener Code, eigene Texte und Grafiken.

```bash
npm install
npm run dev
```

- **Analyse und Regeln:** [`DESIGN.md`](DESIGN.md), dort stehen die Zeitachse aus dem Video und die verbindlichen Bewegungsregeln.
- **Technik:** Vite, React 19, TypeScript, Tailwind v4, `motion`, `lucide-react`.
- **Bewegungs-Presets:** [`src/lib/motion.tsx`](src/lib/motion.tsx), zentral für alle Seiten, inklusive `prefers-reduced-motion`.
- **Bausteine:** [`src/components/ui.tsx`](src/components/ui.tsx) (`Card`, `Item`, `Section`, `Swap`, `BlurText`, `CountUp`, `Bar`, `Segmented`, `Tabs`).
- **Seiten:** Übersicht, Profil, Gespeichert, Cloud und Videos. Nachrichten, Einstellungen und Anrufe sind Platzhalter.
- **Intro erneut abspielen:** unteres Icon in der Seitenleiste.
- **Avatare:** einmalig erzeugt mit `npm run avatars` (DiceBear „notionists“, nur Dev-Abhängigkeit).
