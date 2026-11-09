---
name: Brian Fong
description: One dark signal system for projects, learnings, and writing — a portfolio navigated as a graph, with a matrix motif made of the site's own words.
colors:
  ink-0: "#0b0f0d"
  ink-1: "#111714"
  ink-2: "#172019"
  ink-3: "#1f2a23"
  line: "#223029"
  line-strong: "#31443a"
  text: "#e3eae5"
  text-2: "#a7b6ac"
  text-3: "#7d8f84"
  signal: "#5cf08f"
  signal-strong: "#9dffbd"
  signal-dim: "#2f9c5b"
  signal-ink: "#04120a"
  lime: "#d2f27a"
  data-blue: "#7fb2e8"
  data-blue-strong: "#b9d4f2"
  data-blue-soft: "#16263a"
  positive: "#5fd38f"
  positive-soft: "#11291c"
  negative: "#ff7d82"
  negative-soft: "#2c1517"
typography:
  display:
    fontFamily: "Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 4.6rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  articleDisplay:
    fontFamily: "Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 7.5vw, 5.6rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.2rem)"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  articleBody:
    fontFamily: "Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.06rem"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Geist Mono, Cascadia Code, ui-monospace, Consolas, monospace"
    fontSize: "0.82rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.04em"
  meta:
    fontFamily: "Geist Mono, Cascadia Code, ui-monospace, Consolas, monospace"
    fontSize: "0.74rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  control: "8px"
  card: "12px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  card:
    backgroundColor: "{colors.ink-1}"
    textColor: "{colors.text-2}"
    rounded: "{rounded.card}"
    padding: "26px"
  input:
    backgroundColor: "{colors.ink-1}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  chip:
    backgroundColor: "{colors.ink-0}"
    textColor: "{colors.text-2}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
---

# Design System: Brian Fong

## Overview

**Creative North Star: "Quiet Signal"**

The site is a portfolio you navigate. Every page — home, projects, learnings, about, the blog index, and every article — shares one dark ground and one shell: the top bar, a command palette, dropdown navigation, footer, type pairing, and green signal accent. Articles keep their own layouts and data visualisations but use the same palette, so moving between the main site and the blog never changes worlds.

Three ideas carry the identity:

- **The source field** — the matrix motif, built from the page's own words instead of random glyphs. A dim printout of the page's title and copy fills the hero; slow signal streams light those real characters as they pass; under the pointer the field becomes legible.
- **The site map** — the home page's moment: everything on the site as one graph (you → areas → topics → pages). It extends the About page's career graph to the whole site, and it is a real way to navigate.
- **Jump to anything** — a command palette (Ctrl/⌘+K, `/`, or the search button) that reaches every page, post, topic, and tutorial.

**Key characteristics:**
- One ground, one shell, one accent across the main site and blog.
- Sans for reading; mono for labels, navigation, metadata, paths, and data.
- Tonal surface steps and 1px lines instead of glow.
- Motion in three places only: the hero's field, the map's entrance and camera, and the page transition.

## Colors

### Ground and shell
- **Ink 0** (`#0b0f0d`): page ground and footer. **Ink 1** (`#111714`): cards, inputs, menus, panels. **Ink 2 / Ink 3** (`#172019` / `#1f2a23`): secondary buttons, hover and selected surfaces.
- **Line / Line strong** (`#223029` / `#31443a`): dividers and borders.
- **Text** (`#e3eae5`) primary, **Text 2** (`#a7b6ac`) secondary, **Text 3** (`#7d8f84`) metadata.

### Signal
- **Signal** (`#5cf08f`): primary action, current page, links, focus, lit map routes, the field's streams. **Signal strong** (`#9dffbd`): hover and stream heads. **Signal ink** (`#04120a`): text on a signal fill. **Lime** (`#d2f27a`): caveats only.

### Article data hues
Articles keep a separate data vocabulary so charts stay readable next to the signal accent:
- **Data blue** (`#7fb2e8`, strong `#b9d4f2`, soft fill `#16263a`): structure, selection, and categorical marks inside articles.
- **Positive** (`#5fd38f` on `#11291c`) and **Negative** (`#ff7d82` on `#2c1517`): financial direction only.
- Formerly inverted panels (navy fill, white text) are now light data-blue fills with ink text, so they stay inverted on the dark ground.

**The Live Signal Rule.** Green means state or action. One filled primary per area; a grid of destinations uses secondary buttons.

**The No-Glow Rule.** No neon halos, animated borders, scan lines, or grid overlays. Depth is tonal steps and lines; only floating layers (menu, palette, map preview) carry an offset shadow.

## Typography

**Sans:** Segoe UI with system-ui, -apple-system, Helvetica Neue, and Arial fallbacks — headings and prose everywhere.
**Mono:** Geist Mono (Google Fonts, imported by `style.css`) with Cascadia Code, ui-monospace, and Consolas fallbacks — labels, buttons, nav, metadata, paths, the source field, map hub labels, and data.

### Hierarchy
- **Display** (700, `clamp(2.6rem, 6vw, 4.6rem)`, 1.02, -0.035em): page titles. Article titles use `clamp(3rem, 7.5vw, 5.6rem)`.
- **Headline** (650, `clamp(1.6rem, 3vw, 2.2rem)`, 1.12): section headings.
- **Lead** (1.12rem, 1.7): hero copy, max 62ch. **Body** (1rem, 1.6): default; article prose 1.06rem at 1.8.
- **Label / Meta** (mono, 0.7–0.82rem, +0.04em).

**The Path Rule.** Pages show a mono location path (`~/learnings`) above the title, never a marketing kicker; on the home page the role sits below the name.

**The Line-Box Rule.** Display headings reserve `0.12em` (`0.16em` on articles) of block padding.

**The Article Metric Rule.** Body line-height stays at 1.6; article components were tuned to it.

## Layout

A centered 1100px column with a 20px gutter (16px on phones); hero and sections share one left edge. The map section is wider (1280px). Sections are 72px apart (56px on phones). No page scrolls sideways at 390px.

## Elevation & Depth

Cards are flat `ink-1` with a 1px line. Hover steps one ink level and moves the border to the signal line. Floating layers use `0 18px 40px rgba(0,0,0,0.45)` (palette: `0 30px 80px rgba(0,0,0,0.6)`). The top bar is translucent ink with a 10px backdrop blur.

## Shapes

Controls 8px, cards 12px, palette 14px, chips pills. Elevation is declared once per element.

## Motion

Easing `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`. UI transitions stay under 300ms. Nothing animates on scroll except the map's one-time entrance.

### Source field (the hero's one loop)
- A `<canvas class="signal-field">` created once and re-seeded with the new page's words on every page change.
- Base layer: the page's title and copy, lowercased, written row-major in 12px mono at 6% signal alpha, pre-rendered offscreen and drawn with one `drawImage` per frame.
- Streams: about one per 16 columns (22 on touch), 3–8 rows/s. Trails light the real characters; only the head glyph changes.
- Lens (fine pointers only): characters within 130px brighten toward legible text; position and strength are eased.
- Masked to fade downward and to stay quieter under the text column. DPR capped at 1.5; pauses when the tab is hidden or the hero has scrolled away; reduced motion shows the still base layer.

### Site map
- **Entrance (once, when 25% visible):** edges draw out from the center over 900ms; nodes appear by depth (you, areas, topics, pages), 160ms apart.
- **Camera:** 520ms quartic ease-out with zoom interpolated in log space; every tween has a time limit.
- **Opening a node:** the camera eases into it, then the page transition runs.
- **Hover/focus:** lights the node's route back to you plus its children, and dims the rest.

### Page transition (glyph decode)
1. **Exit (~200ms):** headings in view scramble into code glyphs on aria-hidden overlay layers while the content fades up 6px; the field's streams speed up and a progress line runs under the top bar.
2. **Swap:** fetch, wait for stylesheets, replace content, re-seed the field, scroll to top or the hash target.
3. **Enter (~420–460ms):** content settles from 10px below while in-view headings resolve left to right.

**The Real Text Rule.** Decode never edits real text; layers live in a clipped root and the content is `aria-busy` while routing.

**The Never-Wait Rule.** Every animated step has a time limit, so navigation completes even when frames are throttled.

**The Frequency Rule.** Keyboard-opened UI (the palette) appears instantly; filters, menus, and hovers use short transitions only.

## Components

### Buttons
Primary: signal fill, signal-ink mono label, 44px, 8px corners; hover → signal strong; press → `scale(0.97)`. Secondary: ink-2 (transparent in the hero) with a line-strong border. Hover effects are gated behind `(hover: hover) and (pointer: fine)`.

### Top bar and navigation
A fixed 60px bar holds the home icon, an "All blogs" / "More recipes" link on articles, the **Jump to** trigger (a search icon on phones), and the menu toggle. The dropdown scales in from the top-right corner; links are lowercase mono with a square marker that turns signal green for the current page.

### Command palette
A modal dialog with a combobox input and a listbox. It searches pages, posts, topics, tutorials, and projects using subsequence matching, with matched letters highlighted in signal. ↑/↓ move, Enter opens through the page transition, Esc closes and returns focus. The empty state suggests what to type.

### Site map
- Nodes are real links. You are the root; Writing, Learnings, and Projects are hubs; blog topics and individual pages hang beneath them.
- Layout: seeded radial fans, then a rectangle-overlap relaxation pass (no label collisions). In portrait the tree is rotated 90° so it grows downward.
- Input: drag to pan (vertical swipes still scroll the page on touch); Ctrl/⌘ + wheel or pinch to zoom (a plain wheel scrolls the page and shows a hint); +/−/fit buttons.
- Keyboard: arrow keys move spatially between nodes, Enter opens, Esc fits.
- Filters: All / Writing / Learnings / Projects mute the rest and fit the camera.
- Preview: a card top-right (a bottom sheet on phones) with kind, title, description, and Open. On touch, the first tap selects and Open navigates.
- The Index section below repeats the same destinations as plain links and a filterable list.

### Career map (About)
- Same engine (`graph-view.js`), radial tree, curved edges, relaxation, entrance, and input as the site map. Branches leave you for study, the internships, full-time security into AI, and life outside work, and grow outward in the order they happened.
- Stops are tagged with the dates or labels written for them (Fall 2018, March 2020, 5+ Years, Current); no invented dates.
- Selecting a stop shows its story in the preview card; stops are buttons, not links.
- **Play the story** walks the camera through every stop in order, dwelling by text length; any drag, zoom, key, or the Pause button stops it.
- Code split: `graph-view.js` (shared engine, `GraphView.relax`, `GraphView.rotateForPortrait`), `site-map.js` (home data + seed), `about-graph.js` (career data + seed + tour).

### Cards, lists, inputs
Cards: ink-1, 1px line, 12px corners. The blog index uses editorial rows. Inputs: ink-1, line-strong border, signal border plus a 3px soft ring on focus.

### Browser surfaces
Selection, caret, focus ring, scrollbars, and `kbd` hints are themed from the palette.

## Do's and Don'ts

### Do:
- **Do** keep one ground and one shell on every page, articles included.
- **Do** raise shell selector specificity (`.sidebar .nav-links a`, `body .footer`) rather than letting article CSS restyle it.
- **Do** give every graph or animated explanation an equivalent list or text path.
- **Do** keep pointer-only effects behind `(hover: hover) and (pointer: fine)` and give touch its own interaction (tap to select, then Open).

### Don't:
- **Don't** reintroduce paper or light grounds for articles; use the data hues for charts instead.
- **Don't** use random glyphs as decoration; the motif is the site's own words.
- **Don't** add glow, animated borders, scan lines, grid overlays, or scroll-triggered reveals.
- **Don't** put a kicker above a heading, set prose in mono, or mutate real text for an effect.
- **Don't** hijack the scroll wheel; zoom needs a modifier.
