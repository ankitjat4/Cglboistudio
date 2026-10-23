# WebAPK & PDF Zoom Stabilization Plan (V9.7)

## Goal
Resolve all stability, touch/gesture, zooming, ink/media alignment, floating orb positioning, timer, split-view, and offline caching issues in the SSC CGL Intelligence OS WebAPK without adding any new features.

---

## Root Causes Identified & Planned Fixes

### 1. PDF Pinch-Zoom Stability, Focal-Point Anchoring & Zero Left-Edge Clipping
* **Root Causes**:
  1. **Triple Scroll Mutation on 2-Finger Touch**: During a 2-finger gesture, `#comp-folio-ink-canvas` runs its own 2-finger `scrollCompendiumBy(dx, dy)` listener while `#comp-studio-canvas` simultaneously applies `scrollHost.scrollLeft += panDx; scrollHost.scrollTop += panDy;` and `applyLivePdfZoomDimensions(nextScale, midX, midY)`—causing three competing scroll mutations on every frame.
  2. **Canvas Bitmap Reallocation During Live Pinch**: `applyLivePdfZoomDimensions()` calls `syncSheetInkCanvasGeometry()` on every `touchmove` frame, which reallocates `inkCanvas.width` and `inkCanvas.height` at full DPR while pinching, causing severe frame drops and visual flickering.
  3. **Conflicting Scroll Restoration on Button Zoom**: `adjustCompendiumZoom()` calls `applyLivePdfZoomDimensions()` (which sets `scrollTop`) and then immediately overwrites `scrollTop` via `restoreActivePdfAnchorOffset()`.
  4. **Flexbox Left-Edge Clipping When Zoomed (>100%)**: Because `#comp-pdf-continuous-container` and `#comp-pdf-canvas-wrap` use `display: flex; flex-direction: column; align-items: center;`, any PDF page wider than the viewport overflows symmetrically into negative X space where `scrollLeft` cannot scroll, cutting off the left side of the page.
* **Fixes**:
  - Unify 2-finger pinch-zoom and 2-finger pan into a single deterministic focal-point state machine on `#comp-studio-canvas` / `#comp-studio-workspace`, and disable the duplicate 2-finger scroll handler on `#comp-folio-ink-canvas` when PDF or pinch-zoom is active.
  - Anchor the exact document point `(docX, docY)` under the initial pinch midpoint `(midX, midY)` (or viewport center for `+`/`-` buttons) so panning and scaling occur in a single unified calculation with zero jumps.
  - Defer heavy `<canvas>` backing-store resizing (`inkCanvas.width`/`height` and PDF.js `sharpenPdfPagesAtCurrentZoom()`) until pinch-zoom ends (`touchend` / `touchcancel`), using CSS sizing + CSS transform scaling during the live 60fps gesture.
  - Replace horizontal flex-centering overflow clipping with safe horizontal centering (`margin: 0 auto` on `.comp-pdf-page-slot` and `#comp-pdf-single-stage` inside a scrollable `overflow-x: auto` container) so zoomed pages can always be panned cleanly from the far-left margin to the far-right margin.

### 2. Stop Browser UI / HUD from Zooming with the PDF
* **Root Cause**: `index.html` sets `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">`, and CSS `touch-action: pan-x pan-y pinch-zoom` allows Android WebAPK's native browser pinch-zoom to scale the entire application shell (headers, docks, orbs) when a two-finger gesture starts near edges or toolbars.
* **Fixes**:
  - Lock the WebAPK shell viewport in `index.html` (`maximum-scale=1.0, user-scalable=no`) and block browser-level multi-touch zoom gestures on fixed HUD chrome so only the PDF/sheet canvas zooms while all toolbars, headers, and floating orbs stay crisp at 100% native scale.

### 3. Fix Ink & Media Shifting / Scaling Mismatch on PDF Zoom
* **Root Causes**:
  1. **Stroke Width Mismatch Across Zoom Levels**: `drawSingleStrokeOnCtx()` draws strokes using raw unscaled pixel widths (`stroke.size`, `22px` for recall tape, `eraserWidth` for pixel erasers) regardless of the current PDF zoom scale (`w`). When zooming to 200%, the PDF text doubles in size while ink strokes, highlighter markers, recall tape, and pixel erasers stay at 1x thickness, making highlights and recall tapes shift/shrink relative to the underlying words.
  2. **Floating Media Cards (Sticky Notes & Visuals) Not Scaling Position on PDF Zoom**: `createSheetMediaCardDOM()` positions cards using static pixel offsets (`blk.x`, `blk.y`). When the PDF page width changes during zoom, sticky notes and images remain at their old pixel coordinates instead of staying anchored to the PDF content.
* **Fixes**:
  - Scale vector ink stroke thicknesses (`pen`, `fountain`, `marker`, `dashed`, `laser`, `tape`, `eraser`) proportionally to the rendered page width relative to a canonical base width (`w / 720`), so strokes, highlighters, recall tapes, and erasers remain 100% locked to the underlying PDF text at every zoom percentage (`65%` to `260%`).
  - Persist and compute normalized page coordinates (`nx`, `ny`, `nw`) for PDF media/sticky cards alongside pixel fallbacks, and dynamically reposition media cards inside `applyLivePdfZoomDimensions()` so sticky notes and visual cards stay pinned to their exact PDF location when zooming in or out.

### 4. Truly Dynamic Floating Orbs & Popover Drawers
* **Root Causes**:
  - When `#scratchpad-floating-orb`, `#comp-pdf-floating-hud-pill`, or `#comp-folio-ink-toolbar` (circular orb mode) are dragged across the screen or when the tablet rotates/resizes, their expanded drawers (`#scratchpad-toolbar-dock`, `#comp-pdf-tools-drawer`, and `.ink-studio-expanded-card`) can clip off-screen or open at stale offsets.
* **Fixes**:
  - Update `positionScratchpadDockFromOrb()`, `positionCompPdfDrawerFromOrb()`, and the Folio Ink Studio orb expansion logic to dynamically compute quadrant-aware placement (`left`/`right` and `top`/`bottom` flips with safe viewport clamping) every time the orb is tapped, dragged, or the viewport resizes.

### 5. Exam Arena, Dojo Timers & 7:5 Split-Sheet Layout Polish
* **Fixes**:
  - Audit and harden `startExamTimers()`, `renderActiveExamQuestion()`, `startDojoStopwatch()`, `navDojoArena()`, and `renderDojoArenaQuestion()` so cumulative question timers never flicker or reset on option click, bookmark toggle, or Split-Sheet toggle, and pause cleanly when a modal/backdrop or exit confirmation opens.
  - Ensure Split-Sheet companion view (`#arena-split-workspace.split-sheet-active`) in both portrait and landscape on 7:5 tablets cleanly scrolls both the question pane and reference sheet pane independently without layout overflow.

### 6. Offline PDF & Asset Caching in WebAPK (`sw.js` & `manifest.json`)
* **Root Cause**: `sw.js` references `?v=9.6` instead of `?v=9.7` and does not pre-cache `pdf.min.js`, `pdf.worker.min.js`, `pdf-lib.min.js`, or KaTeX assets, causing PDF rendering or math typesetting to fail when launching the installed WebAPK offline.
* **Fixes**:
  - Bump `CACHE_NAME` in `sw.js` to `ssc-cgl-os-v9.7-elite`, update versioned asset URLs (`style.css?v=9.7`, `app.js?v=9.7`), and include `./pdf.min.js`, `./pdf.worker.min.js`, `./pdf-lib.min.js`, and CDN KaTeX/font caching in the Service Worker so PDF viewing, page surgery, and math rendering work 100% offline.

---

## Verification Plan
1. Run `lint_applet` and `compile_applet` to verify zero syntax or runtime errors.
2. Verify 2-finger pinch-zoom and `+`/`-` button zoom in both Continuous and Single-Page PDF modes across zoom levels (`65%`–`260%`), checking left/right edge panning, ink/highlighter alignment, sticky-note anchoring, and dynamic orb/drawer positioning.
