# Living Knowledge Studio — GoodNotes & Apple Notes Tablet Experience Overhaul

This upgrade transforms the Living Knowledge Studio into a tactile, zero-bug tablet note-taking and active-recall environment inspired by GoodNotes, Apple Notes, and Samsung Notes—completely removing the Spaced Repetition (SRS) system in favor of automatic "Neglected Sheets" tracking, restoring every header/theme/dock control, enabling smooth finger/stylus slide-painting for highlights and masks, anchoring stylus handwriting directly to the sheet page, and adding movable/resizable pasted images and visual cards.

---

## User Review & Confirmed Decisions

> [!IMPORTANT]
> All four architectural preferences from our design discussion are locked into this plan, alongside a complete fix for every broken button, theme switch, and selection handler audited in the Knowledge Studio.

- **Confirmed Decision 1 — Complete Removal of SRS & Auto-Tracked Neglected Sheets**: The Spaced Repetition (`SRS`) system, rating bars, and interval badges are completely removed. The studio now automatically logs when each sheet is opened and lets you filter or sort by **Neglected Sheets** (never opened, not opened in $3+$ or $7+$ days, or oldest read first).
- **Confirmed Decision 2 — Instant Brush-Drag Painting + Single-Tap for Highlight & Mask**: When Highlight or Mask mode is active in the bottom dock, sliding your finger or stylus across text smoothly paints a live range selection across words and formulas (`pointerdown` → `pointermove` → `pointerup`) and applies an occurrence-exact highlight or mask on release, while tapping a single word or existing highlight/mask toggles that exact instance.
- **Confirmed Decision 3 — Page-Anchored Stylus Ink Layer**: Direct stylus handwriting is rendered on a high-DPI vector canvas anchored directly inside the Knowledge Sheet folio page so handwritten derivations, arrows, and underlines scroll naturally with the paragraphs and formulas they annotate.
- **Confirmed Decision 4 — Dual-Mode Interactive Media & Visual Blocks**: Images (via direct clipboard paste, drag-and-drop, or upload) and visual sticky cards can be placed on any Knowledge Sheet and switched between **Free-Floating Movable/Resizable Cards** over the page and **Inline Resizable Blocks** snapped into the document flow.

---

## 1. Overview & Core Concept

- **What It Does**: Evolves the Knowledge Studio from a static web reader into an interactive academic folio where candidates can read across three eye-safe paper surfaces, slide their finger or stylus to highlight and mask exact word/phrase occurrences, write directly onto the sheet paper with a stylus, paste and maneuver diagrams/screenshots freely, and drill linked SSC CGL questions without leaving their study flow.
- **Target Audience / Persona**: Tablet and mobile exam aspirants using a stylus (such as OnePlus Stylo 2) or touch gestures across 370+ high-density Quant, Reasoning, English, and General Awareness sheets.
- **Key Value**: Eliminates broken UI controls and awkward mobile long-press selection traps while giving complete spatial control over handwritten annotations, pasted diagrams, and neglected-topic discovery.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Zero-Friction Reading & Surface Switching**:
   - Tapping the `🌑 Obsidian`, `🪨 Warm Charcoal`, or `📜 Warm Sepia Paper` buttons in the top Zen header immediately switches the entire folio workspace, typography contrast, table headers, and callout surfaces, saving your preference per sheet (with automatic fallback to the global app theme).
   - Tapping the `•••` overflow button opens the studio menu for typography zoom (`A-`, `100%`, `A+`), AI Sheet Architect, Omni-Search, Markdown editing, and sheet creation/deletion.
2. **Smooth Finger/Stylus Brush-Drag Highlighting & Masking**:
   - Activating `🖌️ Mask` or `🖍️ Highlight` (with `🟡 Yellow`, `🟢 Green`, `🔴 Red`, or `🟣 Purple` swatches) in the floating bottom dock switches the sheet into direct brush-painting mode.
   - Sliding a finger or stylus across any phrase or line visually highlights the live character range in real time and commits an occurrence-indexed mask or 4-color highlight on lift—without requiring a browser long-press. Tapping any single word or existing mask/highlight toggles that exact instance on or off.
3. **Page-Anchored Direct Stylus Handwriting**:
   - Tapping `✏️ Ink on Sheet` activates the page-anchored vector ink layer directly inside the A4 folio surface.
   - A compact floating ink pill lets you switch between Fine Ballpoint Pen, Chisel Highlighter, and Stroke Eraser, pick from 5 ink colors, toggle **Stylus-Only vs. Finger Draw** (so 1-finger touch scrolls the page effortlessly while the stylus writes immediately), and undo or clear strokes. All handwriting scrolls locked to the sheet text and auto-saves per sheet.
4. **Interactive Pasted Images & Movable Visual Cards**:
   - Pressing `Ctrl+V` / tapping `🖼️ Add Image / Card` pastes a clipboard screenshot or uploads an image directly onto the active sheet.
   - Any image or sticky visual block can be dragged anywhere on the sheet (`Free-Floating Mode`) or snapped inline (`Inline Block Mode`), resized smoothly via corner/width drag handles, captioned, or deleted.
5. **Finding Neglected Sheets (Zero SRS Clutter)**:
   - Opening `📑 Index` (or the collapsible Sheet Switcher) displays each sheet's clean "Last Read" status (`Never read`, `Read today`, `8d ago`) with one-tap filters for **Neglected (7+ Days / Unread)**, **Neglected (3+ Days)**, **Never Read**, and **Has Mistake Debt**, sorted oldest-first so neglected topics surface immediately.

### Visual Identity & Theme

- **Aesthetic Direction**: Tactile Academic Folio & Digital Paper Studio (GoodNotes / Apple Books / Readwise Reader).
- **Color Palette & Surface Tokens**:
  - *Obsidian Studio (`folio-preset-obsidian`)*: Deep OLED canvas (`#050811`), elevated folio sheet (`#0b101d`), crisp bone-white prose (`#f1f5f9`), cyan/purple structural accents.
  - *Warm Charcoal (`folio-preset-charcoal`)*: Low-glare slate backdrop (`#12141a`), warm graphite sheet (`#1a1d24`), soft alabaster text (`#e5e7eb`).
  - *Warm Sepia Paper (`folio-preset-sepia`)*: Archival daylight parchment (`#f5efe6`), espresso ink prose (`#27211c`), warm umber headings (`#7c2d12`), and high-contrast warm highlight washes.
- **Typography & Hierarchy**: Editorial serif/sans reading measure (`68ch` max prose width inside an `820px` folio page), generous `1.78` line height, tabular numerals for mathematical tables, and zero code-comment clutter.
- **Layout & Ergonomics**: Auto-collapsing `52px` top Zen bar, floating glass bottom action dock (`44px+` touch targets), and a responsive 2-column split workspace on tablet landscape (`65%` A4 Folio with page-anchored ink + `35%` Margin Rail for Linked Questions, Personal Cue, and Mask/Highlight index).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Custom Pointer-Range Brush Engine vs. Native OS Text Selection in Dock Modes**
  - *Chosen Approach*: Implement a dedicated `pointerdown` / `pointermove` / `pointerup` character-range tracker using `caretRangeFromPoint` / `caretPositionFromPoint` when Mask or Highlight mode is active in the dock.
  - *Why*: Mobile and tablet browsers block immediate drag-selection unless the user performs a slow 600ms long-press, which caused the "can only tap one word at a time" bug. A live pointer-range brush lets users slide across words or lines in one fluid motion while still supporting single-word tap toggling and native selection popovers in standard reading mode.
- **Decision 2: Folio-Embedded Ink Canvas vs. Fixed Viewport Overlay**
  - *Chosen Approach*: Mount a dedicated `<canvas id="comp-folio-ink-canvas">` inside `.comp-folio-page` sized dynamically via `ResizeObserver` to match the full scrollable height of the sheet, storing strokes in normalized folio coordinates (`xRatio`, `yPx`).
  - *Why*: A fixed viewport canvas detaches handwriting from the underlying text as soon as the user scrolls. Anchoring the canvas inside `.comp-folio-page` ensures underlined words, circled formulas, and margin notes stay permanently aligned with the sheet content.
- **Decision 3: Passive Activity Telemetry ("Neglected Sheets") vs. Spaced Repetition (SRS)**
  - *Chosen Approach*: Remove all manual SRS grading buttons and interval math; automatically record `lastOpenedEpoch` and `openCount` whenever a sheet is viewed.
  - *Why*: Manual SRS grading adds cognitive friction and visual clutter to every sheet. Automatic timestamp tracking lets the user effortlessly filter for sheets they haven't touched in days without ever clicking a grading button.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                  LIVING KNOWLEDGE STUDIO (#compendium-fullscreen-view)       │
├──────────────────────────────────────────────────────────────────────────────┤
│  TOP ZEN HEADER (#comp-zen-header)                                           │
│  ├── Sheet Switcher Pill ──► Collapsible Drawer (#comp-sheet-switcher-drawer)│
│  ├── Surface Presets ──────► [🌑 Obsidian] [🪨 Charcoal] [📜 Sepia]          │
│  ├── Studio Quick Actions ─► [📑 Index (Neglected Filter)] [✏️ Sheet Ink]    │
│  └── Overflow Menu (•••) ──► [A-/100%/A+] [🖼️ Paste/Add Image] [🪄 AI] [✎]  │
├──────────────────────────────────────┬───────────────────────────────────────┤
│  LEFT: A4 ACADEMIC FOLIO PAGE        │  RIGHT: TABLET MARGIN RAIL            │
│  (#comp-folio-page)                  │  (#comp-margin-rail)                  │
│  ├── Active Recall HUD Bar           │  ├── ⚡ Linked Questions & Trap List   │
│  │   [Reveal Next] [Reset] [+Auto]   │  │   [🧘 Dojo Drill] [⚡ Timed Sprint] │
│  ├── Exam Vulnerability Callout      │  ├── 📌 Personal Margin Notes & Cue   │
│  ├── Prose & KaTeX Body              │  └── 🖍️ Active Sheet Masks &          │
│  │   ├── Occurrence-Exact Masks      │      4-Color Highlights Ledger        │
│  │   ├── 4-Color Semantic Highlights │      (1-tap jump or remove)           │
│  │   └── Inline Resizable Images     │                                       │
│  ├── Free-Floating Movable Cards     │                                       │
│  │   (Drag + Corner Resize Handles)  │                                       │
│  └── Page-Anchored Stylus Ink Layer  │                                       │
│      (#comp-folio-ink-canvas)        │                                       │
├──────────────────────────────────────┴───────────────────────────────────────┤
│  FLOATING BOTTOM GLASS DOCK (#comp-floating-dock)                            │
│  [📑 Sheets] • [🙈 Recall] • [🖌️ Mask] • [🖍️ Highlight 🟡🟢🔴🟣] •          │
│  [✏️ Ink] • [🖼️ Media] • [⚡ Drill Qs]                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Local Persistence (`store_notes` in IndexedDB)

1. **Sheet Activity & Neglected Tracker (`sheet_activity_${sheetId}`)**:
   - `{ id: "sheet_activity_<sheetId>", sheetId, lastOpenedEpoch, openCount }`
   - Updated automatically whenever `renderActiveCompSheet()` or `openSplitSheetDrawer()` opens a sheet. Any legacy `srs_*` records are ignored and cleaned up.
2. **Occurrence-Exact Masks (`masks_${sheetId}`) & 4-Color Highlights (`highlights_${sheetId}`)**:
   - Masks: `[{ phrase, occurrence }]` rendered as `<span class="user-recall-mask" data-mask-key="phrase::occurrence">`.
   - Highlights: `[{ phrase, color: "yellow"|"green"|"red"|"purple", occurrence }]` rendered as `<mark class="user-hl user-hl-${color}" data-hl-key="phrase::occurrence">`.
3. **Page-Anchored Sheet Ink (`folio_ink_${sheetId}`)**:
   - `{ id: "folio_ink_<sheetId>", strokes: [{ mode: "pen"|"highlighter", color, size, points: [{ xRatio, yRatio, yPx }] }], baseHeight }`
   - Rendered onto `#comp-folio-ink-canvas` inside `#comp-folio-page` so strokes scroll natively with the document and scale cleanly across zoom levels.
4. **Interactive Sheet Media & Visual Cards (`media_blocks_${sheetId}`)**:
   - `{ id: "media_blocks_<sheetId>", blocks: [{ blockId, type: "image"|"note", layout: "floating"|"inline", dataUrl, caption, xPct, yPx, widthPct, heightPx }] }`
   - Supports direct clipboard image paste (`paste` event listener when Knowledge Studio is open), file upload, drag-to-move, corner-handle resize, and 1-tap toggle between Free-Floating and Inline Snapped modes.

### Interactive Component & Handler Mapping

- **Header & Overflow Handlers**: Unify `setCompendiumReadingSurface`, `toggleCompMorePopover`, `closeCompMorePopover`, `adjustReaderFontScale`, and `resetCompendiumZoom` with the exact DOM IDs in `index.html`.
- **Brush-Drag & Tap Engine**: Bind pointer listeners on `#comp-studio-doc-body` that detect whether `compendiumMaskEditMode` or `compendiumHighlightMode` is active; on drag, compute the start-to-end DOM `Range` via `caretRangeFromPoint`, preview the selection highlight, and persist the exact phrase + occurrence index on `pointerup`.
- **Margin Rail & Recall Progress Synchronization**: Populate `#comp-rail-linked-qs-list`, `#comp-rail-q-badge`, `#comp-rail-annotations-list`, `#comp-rail-ann-count`, `#comp-sheet-trap-banner`, and `#comp-recall-progress-bar` (`revealNextCompendiumMask`, `resetCompendiumRevealedMasks`) on every sheet render and mask/highlight update.
