---
name: Brian Fong
description: A signal intelligence console for personal projects, learnings, and analysis.
colors:
  void: "#02060d"
  console-black: "#010402"
  panel-green-black: "#010803"
  signal-green: "#35ff6b"
  signal-green-strong: "#1fe056"
  signal-green-muted: "#68c77d"
  phosphor-text: "#c9ffd7"
  warning-lime: "#9aff57"
  editorial-paper: "#f4f1ea"
  editorial-white: "#ffffff"
  editorial-ink: "#17263a"
  editorial-muted: "#5c6877"
  editorial-blue: "#24599a"
  editorial-blue-deep: "#173f72"
  editorial-blue-soft: "#dbe5f0"
  editorial-blue-pale: "#eef3f8"
  editorial-track: "#dfe4e8"
  editorial-line: "#cbd3dc"
  editorial-line-blue: "#9fb2c7"
  editorial-zero-line: "#8491a1"
  editorial-positive: "#247a4d"
  editorial-positive-soft: "#e4f1e9"
  editorial-negative: "#b43a3f"
  editorial-negative-soft: "#f7e6e6"
  editorial-footer: "#e7e3da"
  editorial-panel-raised: "#f8fafc"
typography:
  display:
    fontFamily: "Courier New, Consolas, monospace"
    fontSize: "clamp(2.5rem, 5vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "0.12em"
  body:
    fontFamily: "Courier New, Consolas, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.02em"
  label:
    fontFamily: "Courier New, Consolas, monospace"
    fontSize: "0.88rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
  editorialDisplay:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "clamp(3.2rem, 7.5vw, 6rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  editorialHeadline:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  editorialDisplayCompact:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 14vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  editorialBody:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  editorialLabel:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  editorialMicro:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.2
  editorialTiny:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 700
    lineHeight: 1.2
  editorialMeta:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "0.76rem"
    fontWeight: 700
    lineHeight: 1.2
  editorialSmall:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1.45
  editorialBodyCompact:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "1.06rem"
    fontWeight: 400
    lineHeight: 1.8
  editorialBodyLarge:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 400
    lineHeight: 1.65
  editorialLead:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "1.26rem"
    fontWeight: 400
    lineHeight: 1.65
  editorialTitle:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.2
  editorialMetric:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.4rem, 2.5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.1
  editorialVerdict:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.35rem)"
    fontWeight: 700
    lineHeight: 1.12
  editorialDeck:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1rem, 1.4vw, 1.16rem)"
    fontWeight: 400
    lineHeight: 1.75
  editorialSection:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
  editorialBlogCompact:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "clamp(3rem, 16vw, 4.6rem)"
    fontWeight: 700
    lineHeight: 0.92
rounded:
  editorial-control: "6px"
  control: "10px"
  panel: "14px"
  hero: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "18px"
  lg: "24px"
  xl: "36px"
components:
  button-primary:
    backgroundColor: "{colors.panel-green-black}"
    textColor: "{colors.signal-green}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  card:
    backgroundColor: "{colors.panel-green-black}"
    textColor: "{colors.phosphor-text}"
    rounded: "{rounded.panel}"
    padding: "24px"
---

# Design System: Brian Fong

## Overview

**Creative North Star: "Signal Intelligence Console"**

The site behaves like a personal analysis terminal: dark layered surfaces, precise phosphor-green signals, measured motion, and visible system state. It is expressive without obscuring the work. Dense information is welcome when alignment, hierarchy, and interaction make it legible.

Depth is layered and precise. Glow is reserved for focus, live data, and active paths rather than coating every surface.

The blog is an intentional editorial branch called the **Financial Research Desk**. It replaces the terminal treatment with warm paper, navy ink, blue analytical structure, and semantic green/red financial direction. This branch uses Segoe UI with Arial and sans-serif fallbacks and removes glyph, scan, and neon effects.

**Key Characteristics:**
- Near-black backgrounds with a single green signal family.
- Monospaced typography used as the site's established voice and data notation.
- Scanning, tracing, and glyph motion that communicates system activity.
- Strong alignment, tabular numerals, and responsive information density.
- A light research-desk branch for blog and finance surfaces.

## Colors

The palette uses near-black green surfaces with phosphor text and increasingly bright greens for state and emphasis.

### Primary
- **Signal Green** (`#35ff6b`): Primary actions, active data, focus, and headline emphasis.
- **Strong Signal Green** (`#1fe056`): Pressed and concentrated active states.

### Secondary
- **Warning Lime** (`#9aff57`): Exceptions, caveats, and high-priority callouts.
- **Muted Signal Green** (`#68c77d`): Secondary copy and inactive measurement labels.

### Neutral
- **Void** (`#02060d`): Deep page background.
- **Console Black** (`#010402`): Main background field.
- **Panel Green-Black** (`#010803`): Raised information surfaces.
- **Phosphor Text** (`#c9ffd7`): Primary readable copy.

### Editorial branch
- **Research Paper** (`#f4f1ea`): Blog and finance page canvas.
- **Editorial Ink** (`#17263a`): Primary type and rules.
- **Analytical Blue** (`#24599a`): Selection, navigation, and chart structure.
- **Positive Green** (`#247a4d`): Positive values and rightward flows only.
- **Negative Red** (`#b43a3f`): Negative values and leftward flows only.

**The Live Signal Rule.** Bright green and glow identify activity or hierarchy; inactive decoration stays dark and quiet.

## Typography

**Display Font:** Courier New (with Consolas and monospace fallbacks)  
**Body Font:** Courier New (with Consolas and monospace fallbacks)  
**Label/Mono Font:** Courier New
**Editorial Font:** Segoe UI (with Arial and sans-serif fallbacks)

**Character:** The incumbent monospaced voice makes prose feel authored inside the same instrument as code and data. Hierarchy comes from scale, weight, spacing, and alignment rather than font switching.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 5vw, 4.4rem)`, 1.02): Page thesis and primary title.
- **Headline** (700, `clamp(1.65rem, 3vw, 2.2rem)`, 1.15): Major sections.
- **Body** (400, `1rem`, 1.6): Explanations with a target measure of 65-75 characters.
- **Label** (700, `0.78rem-0.88rem`, tracked uppercase): Controls, dates, and measurement metadata.

**The Data Alignment Rule.** Financial values use tabular numerals and consistent units so scale can be compared before copy is read.

**The Editorial Separation Rule.** Blog pages never inherit terminal glyph motion, neon glow, or monospaced body copy.

**The Editorial Line-Box Rule.** Display and section headings reserve `0.12em` of block padding so Segoe UI glyphs never overrun their measured line boxes.

## Layout

Content uses a centered container capped at 1100px with 24-36px panel padding and generous 48px section separation. Grid layouts expand into multiple columns above 700-900px and collapse into a single reading sequence on smaller screens. Dense data may scroll horizontally only when a stacked alternative would destroy comparability.

## Elevation & Depth

Depth combines tonal layering, one-pixel signal borders, inset definition, and soft offset shadows. Glows appear around active or important elements; ambient surfaces remain restrained.

### Shadow Vocabulary
- **Panel depth** (`0 8px 24px rgba(0, 0, 0, 0.34)`): Separates panels from the background.
- **Live signal** (`0 6px 22px rgba(53, 255, 107, 0.16)`): Active controls, selected paths, and hover states.

**The Restrained Glow Rule.** A zero-offset halo never substitutes for structure; combine signal light with tonal or offset depth.

## Shapes

Panels use 14-16px corners, controls use 10px corners, and metadata uses pill shapes. One-pixel borders, corner brackets, rails, and traced edges reinforce the console silhouette without boxing every datum.

## Components

### Buttons
- **Shape:** Compact rounded control (10px).
- **Primary:** Dark green-black fill, signal-green text and border, 11px by 18px padding.
- **Hover / Focus:** Small lift, brighter border, visible focus outline, and restrained live-signal shadow.
- **Secondary:** Quiet translucent signal fill with phosphor text.

### Chips
- **Style:** Pill metadata with a faint green fill, one-pixel border, and compact tracked label.
- **State:** Selected chips use signal-green text and a stronger surface fill.

### Cards / Containers
- **Corner Style:** 14px radius.
- **Background:** Layered green-black.
- **Shadow Strategy:** Tonal depth at rest; live-signal shadow only when interactive.
- **Border:** One-pixel translucent green.
- **Internal Padding:** 22-28px.

### Inputs / Fields
- **Style:** Dark recessed surface, signal border, and phosphor text.
- **Focus:** Bright outline and border without layout shift.
- **Error / Disabled:** Error copy names recovery; disabled state reduces contrast without hiding its label.

### Navigation
- Fixed top bar and compact dropdown navigation use dark layered surfaces, active-path highlighting, and clear keyboard focus. Motion may trace or scramble during navigation but must honor reduced-motion preferences.

## Do's and Don'ts

### Do:
- **Do** use brightness to encode state, emphasis, or data activity.
- **Do** keep comparison values aligned and source notes adjacent to claims.
- **Do** provide static equivalents for animated or interactive explanations.

### Don't:
- **Don't** cover every panel in equal glow or animated borders.
- **Don't** sacrifice body-copy measure or mobile reading order for terminal styling.
- **Don't** introduce unrelated accent colors without a semantic data role.
