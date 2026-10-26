# DESIGN.md – Dashboard V18 (eigener Nachbau)

Neutrales Beispiel-Dashboard, inspiriert vom Instagram-Video „code.xr Dashboard V18“.
Quellcode des Originals liegt nicht vor. Alles hier ist aus dem Video abgeleitet
(6 s, 30 fps, Frame für Frame ausgewertet) und mit eigenem Code, eigenen Texten und
eigenen Grafiken umgesetzt. Kern des Projekts ist **die Bewegung**, nicht die Optik.

---

## 1. Was das Video zeigt (Analyse)

Zeitachse in Frames (1 Frame ≈ 33 ms):

| Frames | Geschehen |
|---|---|
| 0–3 | Weiße Fläche, dann blendet der hellgraue App-Rahmen ein (Opacity). |
| 4–15 | **Seitenleiste wächst von oben nach unten**: kurze Pille (~90 px), die sich in ~350 ms auf volle Höhe streckt, Ease-out. Dabei von Grau (halbtransparent) zu Schwarz. |
| 11–28 | Inhalt baut sich **gestaffelt** auf: Banner → Karten Reihe 1 → Reihe 2 → rechte Spalte. Jede Karte erscheint zuerst als **leere, unscharfe, blasse Fläche**, danach blendet ihr Inhalt ein. |
| 12–20 | Icons der Seitenleiste erscheinen nacheinander von oben nach unten. |
| 20–30 | Überschrift „…better together“ erscheint **Wort für Wort aus der Unschärfe**. |
| 28–60 | **Zahlen zählen hoch** (0,0 h → 10,3 h; 5 0 → 48 78; 0 → 21/14), Balken wachsen von unten, Fortschrittsbalken wachsen in der Breite. Das Hochzählen dauert ~1,5 s und läuft weich aus. |
| 58 | Klick auf ein anderes Icon in der Seitenleiste. |
| 59–60 | **Alter Inhalt ist sofort weg** (≤ 1–2 Frames). Der lila Kreis (aktiver Tab) springt zum neuen Icon, die kleine schwarze „Nase“ rechts an der Leiste wandert mit. Der Kreis „poppt“ dabei kurz größer auf. |
| 60–69 | ~300 ms **bewusst leer**. Nur die Leiste mit Tooltip ist zu sehen. |
| 69–100 | Neue Seite baut sich auf wie beim Start: Banner/Kopf → Karten-Platzhalter → Inhalte → Zahlen zählen, Balken wachsen. |

Weitere Details:
- **Tooltips** an der Leiste: schwarze Pille mit weißem Text rechts neben dem Icon (Profil, Gespeichert, Cloud …), blendet weich ein.
- **Hover**: Icons bekommen einen dezenten grauen Kreis, Karten heben sich leicht (`whileHover y: -5`, laut Code-Ausschnitt im Video).
- **Seiten im Video**: Home (Raster-Icon, Start), Profil, Gespeichert, Cloud. Weitere Icons: Videos, Nachrichten, Einstellungen, Anrufe, Abmelden.
- **Wiederkehrende Bausteine**: Segment-Schalter (Weekly/Monthly, All/Videos/Docs/Links), Tabs mit Unterstrich (Overview/Shared/Comments), Wochenleiste mit schwarzer Tages-Pille, Fortschrittsbalken in Listen, Ring-Diagramm, vertikale Balken mit Wert-Tooltip.

## 2. Bewegungsregeln (verbindlich)

1. **Einblenden = Opacity + Blur + kleiner Versatz.** Von `opacity 0, blur(12px), y 10px, scale .985` zu klar. Die Unschärfe macht den Unterschied: Elemente „materialisieren“ sich.
2. **Zweistufig**: zuerst die Karte (Fläche), 80–120 ms später ihr Inhalt, der wiederum gestaffelt ist.
3. **Staffelung** 60–80 ms zwischen Geschwistern, Gesamtaufbau einer Seite höchstens ~1,2 s bis alles sichtbar ist.
4. **Federn** statt fester Dauer für alles Räumliche (Indikatoren, Hover, Layout-Wechsel). Opacity/Blur mit Ease-out-Kurve `[0.22, 1, 0.36, 1]`.
5. **Raus schnell, rein langsam.** Exit ≤ 150 ms, kurze Leerpause, dann Neuaufbau.
6. **Geteilte Indikatoren** (`layoutId`) für alles „Aktive“: Seitenleiste, Segment-Schalter, Tabs, Kalendertag.
7. **Daten bauen sich auf**: Zahlen zählen hoch (auch beim Umschalten vom alten zum neuen Wert), Balken wachsen, Ringe zeichnen sich.
8. **Listen reflowen** beim Filtern/Entfernen mit `layout`-Animation statt zu springen.
9. **`prefers-reduced-motion`**: keine Bewegung, kein Blur, Zahlen sofort am Ziel.

## 3. Optik

| Rolle | Wert |
|---|---|
| Seitenhintergrund | `#FFFFFF` |
| App-Rahmen | `#ECEBEF`, Radius 28 px |
| Karte | `#FFFFFF`, Radius 20 px, kaum Schatten |
| Karte innen (verschachtelt) | `#F5F4F7`, Radius 14 px |
| Seitenleiste | `#141316`, Pille, Icons `#8E8C95` |
| Aktiv-Kreis | Lavendel `#D9CFF6`, Icon dunkel |
| Lavendel (Banner, Balken) | `#CFC3EE`, kräftig `#B7A6EC` |
| Rosa | `#F4C8E3`, hell `#F9E1EF` |
| Mint / Himmel (Kachelfarben) | `#D5EBD9` / `#D9E4F7` |
| Text | `#151418`, gedämpft `#8A8892` |
| Primärbutton | schwarz `#151418`, weiße Schrift, Pille |
| Status „verfügbar“ | Grund `#E4F5E9`, Text `#2E9B57` |

- Schrift: Inter (variabel), Überschriften 600, Zahlen groß und leicht (500), Labels 12–13 px gedämpft.
- Radien verschachtelt: innen = außen − Abstand.
- Grafiken (Blüte, Blobs, Spirale) sind eigene SVGs mit Verläufen.

## 4. Nicht übernehmen
- Texte, Namen, Branding und Logo des Creators. Inhalte hier sind deutsch und frei erfunden.
- Das Originalvideo liegt nur lokal als Referenz im Repo und wird nicht veröffentlicht (`.gitignore`).
