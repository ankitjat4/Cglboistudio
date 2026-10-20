# SSC CGL Intelligence OS (V9.0) — Embedded GoodNotes & LiquidText PDF Studio, Supercharged Ink Engine & Systemic Telemetry Bridges

This upgrade transforms the Living Knowledge Studio into a unified Markdown + multi-page PDF annotation and active-recall workspace powered by `pdf.js` and `pdf-lib`, adds GoodNotes and LiquidText ink superpowers across both the Sheet Folio and Global Scratchpad, replaces blocking browser alerts with a 60fps floating glass toast HUD, and completes the four systemic telemetry bridges across Mock Arena, Dojo, and Daily Autopilot.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices were confirmed during Phase 1 clarification and govern the V9.0 implementation:

- **Confirmed Decision 1 — Natural PDF Rendering with Optional Dark Invert Toggle**: Imported PDF pages render in their natural colors by default even when Midnight or Charcoal themes are active, accompanied by a 1-tap `🌗 Invert PDF` toggle in the PDF Studio bar for low-light reading comfort.
- **Confirmed Decision 2 — Non-Destructive Dual Persistence on "Bake & Save PDF"**: Tapping **Bake & Save PDF** writes all vector strokes, shapes, highlights, and sticky callouts into the stored PDF binary via `pdf-lib` while simultaneously preserving the live editable vector ink layer in IndexedDB so future Undo, Recall Tape toggling, and Lasso translations remain active.
- **Confirmed Decision 3 — Composite Excerpt Capture (PDF + Ink Annotations)**: Dragging a rectangle with the LiquidText **Excerpt (`✂️`)** tool composites both the underlying rendered PDF/Sheet region and any active ink annotations drawn over that region before pinning to the Margin Rail or extracting to the Question Creator.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Embedded Multi-Page PDF Studio (`pdf.js` + `pdf-lib`)**: Imports local PDFs directly into the existing 3-tab architecture inside the Living Knowledge Studio, supporting high-DPI page rendering, thumbnail scrubbing (All, Annotated, Bookmarked), inserting blank A4 calculation pages mid-PDF, and baking vector ink/sticky notes into downloadable PDF binaries.
  2. **GoodNotes & LiquidText Ink Superpowers**: Adds **Recall Tape (`🩹`)** for tap-to-reveal occlusion over formulas/diagrams, **350ms Hold-to-Snap Geometric Shapes** (lines, circles/ellipses, rectangles, triangles), **Polygon Lasso (`🪢`)** for selecting and translating ink strokes, **LiquidText Excerpt (`✂️`)** for cropping regions with deep-link page badges to the Margin Rail or Question Creator, and **2-Finger Natural Scroll** while in single-finger draw mode.
  3. **Non-Blocking Floating Glass Toast HUD**: Replaces disruptive `alert(...)` calls with a 60fps top-right glass toast notification stack while preserving `confirm(...)` strictly for destructive deletions.
  4. **Four Systemic Telemetry Bridges**: Enforces an 18-hour spaced cooling lock on mistake debts in Timed Daily Sprints, persists Dojo `[Setup | Calc]` stopwatch splits to the Master Question Showcase, captures `ABANDONED_TIME_SINK` (>45s unattempted questions) in mock submissions and AI biopsies, and adds a 1-tap **Save Mutant to Bank** promotion workflow in Dojo.
- **Target Audience / Persona**: SSC CGL 2026 Tier-1 & Tier-2 aspirants studying on Android tablets (OnePlus Pad / Stylo 2), phones, and desktop browsers who combine dense textbook PDFs, coaching sheets, and markdown formula compendiums with high-velocity timed drills.
- **Key Value**: Eliminates context switching between external PDF readers and the test engine—every coaching PDF, rough derivation page, cropped diagram excerpt, and mistake telemetry metric lives inside a single offline-first IndexedDB workspace.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Importing & Studying a PDF in the Knowledge Studio**:
     - User opens the Sheet Switcher Drawer or Master Sheets Index and taps **📄 + Import PDF**, selecting any local `.pdf` file and assigning it to the active Subject and Chapter.
     - Selecting a PDF tab switches the Folio into **PDF Studio Mode**, revealing the top PDF Page Navigation & Action Bar (`◀ Prev`, `Page X of N` jump input, `Next ▶`, `🗂️ Thumbnails`, `⭐ Bookmark Page`, `🌗 Invert PDF`, `📄 + Blank Page`, `💾 Bake & Save PDF`, `📥 Download Annotated PDF`).
     - Tapping **📄 + Blank Page** uses `PDFLib.PDFDocument` to splice a clean A4 page right after the current page for handwritten derivations and persists the updated binary to IndexedDB.
  2. **Using GoodNotes & LiquidText Ink Tools**:
     - **Recall Tape (`🩹 Tape`)**: User drags a 22px frosted cyan/purple tape ribbon over a PDF theorem or diagram label. Tapping the ribbon when not drawing (or in Recall Mode) toggles its opacity between `0.96` (masked) and `0.12` (revealed) and updates the Active Recall counter.
     - **Hold-to-Snap Shapes (350ms)**: Drawing a line, circle, ellipse, triangle, or rectangle with Pen or Marker and holding the stylus/finger stationary for `350ms` at the end of the stroke snaps the freehand points into crisp geometry with a subtle `18ms` haptic pulse.
     - **Lasso (`🪢 Lasso`)**: User draws a freehand selection loop around ink strokes; enclosed strokes highlight inside a dashed cyan bounding box and can be dragged to reposition them anywhere on the page.
     - **Excerpt (`✂️ Excerpt`)**: User drags a rectangular crop marquee over a PDF diagram or sheet formula. A compact floating action bar offers **📌 Pin Excerpt to Margin Rail** (creating a persistent visual card with a `🔗 Page X` deep-link jump button) or **⚡ Extract to Question Creator** (opening the Question Creator with the cropped diagram pre-attached and Subject/Chapter pre-filled).
  3. **Practicing & Promoting Telemetry-Linked Questions**:
     - In Dojo, tapping **⏱️ Split** marks the transition from problem setup to calculation; answering the question records `lastSetupSec` and `lastCalcSec` and displays `⏱️ Split: Xs Setup / Ys Calc` in the Master Showcase.
     - When practicing an AI-generated mutant question (`q.ephemeral === true`) in Dojo, tapping **📥 Save Mutant to Bank** promotes the question permanently into `store_questions`.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-craft academic folio and precision telemetry HUD tailored for zero eye strain during 6+ hour tablet study sessions.
  - *Color Palette & Mood*: Preserves the three user-selectable workspace themes (**Midnight OLED `#04060b`**, **Warm Charcoal `#12151e`**, and **Warm Sepia Paper `#f4ecd8`**) with high-intent semantic accents (`--accent-cyan: #38bdf8`, `--accent-purple-light: #a78bfa`, `--status-green: #10b981`, `--status-amber: #f59e0b`, `--status-red: #f43f5e`). PDF pages render natively in crisp full fidelity with an optional `filter: invert(0.92) hue-rotate(180deg)` dark-mode comfort toggle.
  - *Typography & Hierarchy*: Clean sans-serif UI labels paired with `KaTeX` math typesetting and tabular monospace (`var(--font-mono)`, `tabular-nums`) for timers, page counters, and split telemetry badges.
  - *Interactive Feedback & Motion*: Top-right floating glass toasts (`.cgl-toast-item`) enter with `cubic-bezier(0.22, 1, 0.36, 1)` transform/opacity transitions under 200ms and auto-dismiss without blocking pointer or stylus input.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Unified Markdown + PDF Studio Inside `#compendium-fullscreen-view`**
  - *Chosen Approach*: Embed the PDF renderer (`#comp-pdf-render-canvas`), thumbnail scrubber, and PDF binary tools directly inside `#comp-folio-page` rather than adding a 4th primary navigation tab.
  - *Why*: Preserves the strict 3-tab mobile/tablet navigation contract while allowing PDFs and Markdown sheets to share the exact same Page-Anchored Ink Engine, Floating Media Layer, Margin Rail, and Chapter Taxonomy.
  - *Alternatives Considered*: A separate PDF viewer modal or 4th tab, which would fragment chapter organization and duplicate the ink/annotation toolbars.

- **Decision 2: Per-Page IndexedDB Vector Layer + On-Demand `pdf-lib` Flattening**
  - *Chosen Approach*: Store raw PDF bytes in `store_notes` (`pdf_doc_${id}`) alongside lightweight index metadata in `store_config` (`pdf_library_index`), and persist vector strokes, Recall Tapes, floating cards, and excerpts per page (`sheet_ink_${pdfId}_p${pageNum}`). When the user taps **Bake & Save PDF** or **Download Annotated PDF**, `PDFLib.PDFDocument` draws the vector paths and callouts onto the PDF pages in coordinate space.
  - *Why*: Keeps page turns and stroke undos instantaneous (`<16ms`) without re-serializing multi-megabyte PDF binaries on every pen stroke, while still producing standard portable annotated PDF files when baked or exported.

- **Decision 3: 18-Hour Spaced Cooling Lock on Timed Mistake Debts**
  - *Chosen Approach*: Track `lastIncorrectEpoch` per question in `PerformanceService.getQuestionPerformanceMap()`. Exclude failed questions from the **Timed Daily Priority Sprint** until `18 hours` have elapsed since the last wrong attempt, while keeping them immediately accessible when launching in **Untimed Dojo**.
  - *Why*: Prevents short-term rote memory from artificially inflating timed sprint scores on the same day a question was missed, while still allowing immediate untimed remediation in Dojo.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        SSC CGL INTELLIGENCE OS (V9.0)                        │
├──────────────────────────────────────────────────────────────────────────────┤
│  GLOBAL HUD LAYER                                                            │
│  ├── #cgl-toast-container (60fps Glass Toast Stack: cyan/emerald/amber/red)  │
│  └── #scratchpad-overlay (Pen, Laser, Eraser, 350ms Shape Snap, 2F Scroll)   │
├──────────────────────────────────────────────────────────────────────────────┤
│  LIVING KNOWLEDGE STUDIO (#compendium-fullscreen-view)                       │
│  ├── Switcher Drawer & Master Index (#modal-all-sheets-index)                │
│  │   ├── Markdown Sheets (store_concepts) + Full-Body Snippet Search         │
│  │   └── PDF Documents (store_config: pdf_library_index + store_notes bytes) │
│  ├── #comp-folio-ink-toolbar                                                 │
│  │   └── [Pen] [Marker] [🩹 Tape] [🪢 Lasso] [✂️ Excerpt] [Erasers] [Sizes]  │
│  ├── #comp-folio-page (Dual-Mode Academic Surface)                           │
│  │   ├── Mode A: Markdown Sheet (#comp-studio-doc-content + Word Tokenizer)  │
│  │   ├── Mode B: PDF Studio Bar + Thumbnail Scrubber + #comp-pdf-render-canvas│
│  │   ├── #comp-floating-media-layer (Movable/Resizable Images & Sticky Notes)│
│  │   └── #comp-folio-ink-canvas (Vector Strokes, Tape Occlusion, Lasso, Snap)│
│  └── #comp-margin-rail                                                       │
│      ├── Linked Questions & Traps                                            │
│      ├── Pinned LiquidText Excerpt Cards (with 🔗 Page X Deep-Link Jump)     │
│      └── Personal Scratchpad & Sheet Masks/Highlights Ledger                 │
├──────────────────────────────────────────────────────────────────────────────┤
│  SYSTEMIC TELEMETRY BRIDGES (IndexedDB v16)                                  │
│  ├── Bridge 1: 18h Mistake Debt Cooling Lock (lastIncorrectEpoch check)      │
│  ├── Bridge 2: Dojo [Setup | Calc] Split Persistence ➔ Master Showcase Badge │
│  ├── Bridge 3: ABANDONED_TIME_SINK (>45s Unattempted) ➔ Mock & AI Biopsy     │
│  └── Bridge 4: 1-Tap [📥 Save Mutant to Bank] in Dojo Banner                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State (`DB_VERSION = 16` Preserved)**:
  - **`store_config` (`key: "pdf_library_index"`)**: Array of PDF descriptors `{ id, title, fileName, subject, chapter, pageCount, addedAt, lastOpenedAt, bookmarkedPages: [], annotatedPages: [], darkInvert: false }`.
  - **`store_notes` (`id: "pdf_doc_${pdfId}"`)**: Stores `{ id, pdfId, base64Data, updatedAt }` containing the raw/modified PDF binary.
  - **`store_notes` (`id: "sheet_ink_${sheetOrPdfId}"` or `"sheet_ink_${pdfId}_p${pageNum}"`)**: Stores `{ id, strokes: [...], excerpts: [...] }` where each stroke supports `{ tool: "pen"|"marker"|"tape"|"eraser", color, size, points: [{x,y}], revealed: false, shapeType: null|"line"|"circle"|"rect"|"triangle" }`.
  - **`store_attempts` & `PerformanceService` Map**: Extends per-question aggregated stats with `lastIncorrectEpoch`, `lastSetupSec`, and `lastCalcSec`, and tags unattempted mock questions with `timeSpentSec > 45` as `errorTag: "ABANDONED_TIME_SINK"`.

- **Interactive Component & State Mapping**:
  - **PDF Studio Lifecycle**: `triggerPdfUploadPrompt()` ➔ `handlePdfDocumentUpload(input)` reads file bytes, parses page count via `pdfjsLib.getDocument`, writes `pdf_doc_${id}` and `pdf_library_index`, and opens the document in `#compendium-fullscreen-view`. Page changes (`navCompPdfPage`, `jumpToCompPdfPage`) re-render `#comp-pdf-render-canvas` at `devicePixelRatio` and swap the active ink/floating media context key to `${pdfId}_p${pageNum}`.
  - **PDF Binary Mutation (`pdf-lib`)**: `insertBlankPageIntoActivePdf()` loads the stored PDF into `PDFLib.PDFDocument`, inserts an A4 page (`[595.28, 841.89]`) at `currentPageIndex + 1`, shifts page-indexed ink keys accordingly, saves the new bytes, and re-renders. `flattenAndSaveActivePdf(downloadAfter)` maps normalized canvas coordinates to PDF page dimensions, draws vector strokes/tapes/sticky notes into the PDF pages, updates `store_notes` while keeping vector strokes intact, and optionally triggers `downloadFileResilient`.
  - **Ink Superpowers State Machine**:
    - *Hold-to-Snap*: A `350ms` timer resets on pointer move (`>5px`); if triggered while drawing with `PEN` or `MARKER`, `snapStrokeToGeometricShape(points)` classifies open vs. closed paths, computes bounding-box radial variance or Ramer-Douglas-Peucker corner vertices, replaces the stroke points with geometric vertices, redraws the canvas, and fires `navigator.vibrate(18)`.
    - *Recall Tape*: Drawing with `TAPE` records a `22px` stroke with `tool: "tape", revealed: false`. Pointer tap hit-testing checks distance to any `tape` stroke segment (`<16px`) and toggles `stroke.revealed`, updating `#comp-recall-progress-text`.
    - *Lasso & Excerpt*: `LASSO` collects a closed polygon, tests stroke point inclusion via ray-casting, and translates selected strokes on drag. `EXCERPT` drags a selection rectangle, composites `#comp-pdf-render-canvas` (or sheet DOM preview) + `#comp-folio-ink-canvas` into an offscreen canvas data URL, and presents 1-tap actions to pin to `#comp-margin-rail` (with `jumpToExcerptSource(pdfId, pageNum, scrollTop)`) or populate `#modal-new-question-creator`.
