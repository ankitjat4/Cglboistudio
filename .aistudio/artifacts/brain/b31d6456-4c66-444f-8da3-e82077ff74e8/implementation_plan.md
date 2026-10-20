# Production-Grade Academic Reader, Tablet Studio & Systemic Telemetry Upgrade

This plan transforms the Living Knowledge Studio and Question Showcase from a congested, border-heavy web layout into a calm, distraction-free **Academic Reader & Tablet Studio** (inspired by GoodNotes, LiquidText, Apple Books, and Readwise Reader)—while permanently fixing the **Global Word-Masking Regex Bug** and closing the **Systemic Preparation & Telemetry Blind Spots** across Dojo Clinic, Mistake Debt, Spaced Repetition, and Daily Autopilot.

---

### User Review & Confirmed Architectural Decisions

> [!IMPORTANT]
> The following architectural decisions and systemic fixes are locked into this implementation blueprint:

1. **Confirmed UX Decision 1 — Tablet Landscape Split-Studio**: On tablet landscape viewports (`min-width: 820px` and `orientation: landscape`), Knowledge Studio renders a side-by-side workspace with the elevated **A4 Academic Folio** on the left (`65%` width) and a dedicated **Margin Notes, Recall Mastery & Linked Questions Rail** on the right (`35%` width).
2. **Confirmed UX Decision 2 — Reading Surface Presets**: Knowledge Studio follows the global Midnight/Charcoal theme by default and adds an instant **Paper Surface Switcher** (`Obsidian Studio`, `Warm Charcoal`, and `Warm Sepia / Ivory Paper`) with per-sheet and studio-level persistence to eliminate astigmatism halation during daytime study.
3. **Confirmed UX Decision 3 — Dual-Trigger Highlighter & Recall Masking**: Both workflows operate seamlessly:
   - **Floating Selection Action Bar**: Selecting any text pops up a contextual pill with `[ 🙈 Mask ]`, 4 semantic highlighter swatches (`🟡 Fact`, `🟢 Formula`, `🔴 Trap`, `🟣 Vocab`), and `[ 📌 Cue ]`.
   - **Persistent Dock Highlighter / Mask Mode**: Tapping `🖌️ Mask` or `🖍️ Highlight` in the bottom Floating Action Dock lets you continuously tap or drag across words/formulas with your OnePlus Stylo 2 or finger.
4. **Systemic Fix Part I — Occurrence-Indexed & Source-Anchored Masking/Highlighting**: Replaces the global `new RegExp(..., "g")` word-masking bug with **Exact Occurrence Indexing (`phrase::occurrenceIndex`)**. Tapping or selecting `"home"`, `"1/2"`, or `"angle"` in Paragraph 3 masks or highlights *only* that exact $k$-th occurrence in the document—never touching other instances of the same word elsewhere on the sheet.
5. **Systemic Fix Part II — Closing the "Half-Built Bridges" (Dojo Telemetry, Sheet SRS & Bi-Directional Trap Alerts)**:
   - **Dojo Clinic & Showcase Telemetry Bridge**: Solves in Untimed Dojo and Master Showcase persist immediately to a dedicated `DOJO_CLINIC` telemetry ledger so practiced questions graduate out of `Unseen`, and correctly solved `Mistake Debt` questions are redeemed—without polluting Timed Mock ERI or score averages.
   - **Sheet Spaced-Repetition (SRS) & Active Recall Progress**: Tracks per-sheet recall progress (`Recalled X / Y Masks`) and 1-tap SRS confidence scheduling (`🔴 Forgot 1d`, `🟡 Effortful 4d`, `🟢 Mastered 10d`) that feeds directly into Daily Autopilot.
   - **Bi-Directional Mistake & Trap Callouts on Sheets**: Opening any Knowledge Sheet surfaces past exam mistakes and cognitive traps (`FORMULA_AMNESIA`, `TIME_TRAP_Q4`, etc.) from linked questions right inside the Margin Rail / Sheet Header.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. **De-Congests the Reader Geometry**: Replaces the 4 stacked header bars (~190px of vertical chrome) and nested box-in-box borders with a single **52px Auto-Collapsing Zen Header**, a centered **Floating Glass Action Dock**, and an elevated **A4 Academic Folio** (`max-width: 740px`) with generous paper margins and clean editorial typography.
  2. **Fixes Global Word-Masking Collisions**: Upgrades custom masks and 4-color highlights from flat string regexes to **occurrence-indexed DOM/text anchors (`phrase::occurrenceIndex`)**, plus optional direct Markdown `{{...}}` surgical wrapping.
  3. **Unifies the SSC CGL Preparation Loop**: Connects Untimed Dojo Clinic, Master Showcase, Timed Mocks, Mistake Debt, and Living Knowledge Sheets into a single closed-loop telemetry engine.

---

### 2. User Experience & Visual Design

#### A. Zen Immersive Chrome & Floating Glass Action Dock
- **Single Top Bar (`52px`) + Auto-Hide on Scroll**:
  - Displays `← Back`, the active **Chapter / Sheet Switcher Trigger** (`📑 QA_TRIGONOMETRY • Sheet 1/6 ▾`), and the `[ ••• ]` Studio Overflow Menu.
  - Scrolling down `> 30px` smoothly retracts the top bar (`transform: translateY(-100%)`), yielding **100% full-screen reading real estate**. Scrolling up `> 15px` or tapping near the top edge restores it.
- **Floating Bottom Glass Dock (`#comp-floating-dock`)**:
  - Sits at the bottom-center (`backdrop-filter: blur(16px)`) with 5 core single-line studio tools:
    - `[ 📑 Sheets ]` — Toggles the collapsible Chapter/Sheet Switcher & 370-Sheet Index
    - `[ 🙈 Recall ]` — Toggles Active Recall Blur + shows live `Recalled X/Y` counter & `+Auto-Blur`
    - `[ 🖌️ Mask ]` — Toggles occurrence-exact Stylo/Finger Recall Masking mode
    - `[ 🖍️ Highlight ]` — Toggles 4-Color Highlighter mode + inline color dot picker (`🟡 🟢 🔴 🟣`)
    - `[ ⚡ Drill Qs ]` — Launches Untimed Dojo or Timed Sprint for the sheet's linked questions
  - Secondary tools (`A- / 100% / A+` zoom, Reading Surface Presets, `✏️ Sketchpad Ink`, `🪄 AI Architect`, `🔍 Omni-Search`, `✎ Edit Markdown`, `🗑 Delete Sheet`) reside cleanly inside the `[ ••• ]` Studio Popover.

#### B. Three Reading Surface Presets & Editorial Typography
- **Surface Presets**:
  1. **Obsidian Studio (`preset-obsidian`)**: Deep slate canvas (`#060912`), elevated folio (`#0b101e`), crisp alabaster ink (`#f1f5f9`).
  2. **Warm Charcoal (`preset-charcoal`)**: Low-glare matte canvas (`#14161b`), warm graphite folio (`#1c1f26`), soft warm-white ink (`#e5e7eb`).
  3. **Warm Sepia / Ivory Paper (`preset-sepia`)**: Textbook ivory paper folio (`#f6f1e7`) on warm stone backdrop (`#e6dfd3`), deep slate-navy ink (`#1e293b`), and high-contrast KaTeX math (`#0f172a`) for zero daytime halation.
- **De-Boxed Editorial Rhythm**:
  - `###` and `##` headings use generous top breathing room (`26px` top, `10px` bottom) with a subtle hairline divider rather than boxed sub-cards.
  - Bullet rows use clean hanging indents (`1.15em` spacing) without per-bullet border noise.

---

### 3. Deep Audit Fixes: Masking Engine & Systemic Preparation Loop

#### Part I: Permanent Fix for the Global Word-Masking Bug (`phrase::occurrenceIndex`)
- **Root Cause Eliminated**:
  - Previously, `activeSheetCustomMasks` stored raw strings like `["home", "180°"]` and `formatRichText()` ran `new RegExp(escapeRegExp(cleanP), "g")`, which blindly masked every occurrence of `"home"` across the entire sheet.
- **New Occurrence-Indexed Mask & Highlight Engine**:
  1. **Exact Occurrence Calculation (`computeOccurrenceIndexInContainer`)**:
     - When you tap a word/formula or select a phrase inside `#comp-studio-doc-content` (or `#split-sheet-body`), the engine walks the rendered text nodes up to your exact tap/selection `Range` and counts which occurrence ($0$-based index $k$) of `phrase` you targeted.
  2. **Targeted Token Encoding (`phrase::k`)**:
     - Custom masks are stored in `store_notes` (`masks_${sheet.id}`) as `"phrase::k"` (with full backward compatibility for legacy un-indexed phrases).
     - Multi-color highlights are stored in `store_notes` (`highlights_${sheet.id}`) as `{ phrase, occurrence: k, color: 'yellow'|'green'|'red'|'purple' }`.
  3. **Occurrence-Aware Replacement in `formatRichText()`**:
     - During rendering, `formatRichText()` tracks a running match counter `matchIdx` for each target phrase and wraps **only** the exact occurrence `matchIdx === k` in `<span class="user-recall-mask" data-mask-key="phrase::k">...</span>` or `<mark class="user-hl user-hl-color" data-hl-key="phrase::k">...</mark>`.
     - Tapping an already-masked or highlighted span reads its exact `data-mask-key` / `data-hl-key` and removes only that specific instance.

#### Part II: Systemic Preparation Upgrades (Closing the 4 Execution Flaws)

1. **Bridge 1 — Dojo Clinic & Showcase Telemetry Persistence (`recordUntimedPracticeSolve`)**:
   - **Problem**: Practicing 30 questions in Untimed Dojo or Master Showcase existed only in RAM (`dojoExam.userResponses`) and vanished on exit—leaving practiced questions stuck as `Unseen` and mastered mistakes stuck in `Mistake Debt`.
   - **Solution**:
     - Whenever you answer a question in **Dojo Clinic** (`renderDojoArenaQuestion`) or **Master Showcase** (`selectShowcaseCardOption`), the engine immediately records the outcome (`questionId`, `isCorrect`, `timeSpentSec`, `timestamp`) into a persistent `store_attempts` session (`sessionId: "dojo_ledger_" + YYYY_MM_DD`, `mockType: "DOJO_CLINIC"`, `completed: true`).
     - **Clean Separation of Official Mock Metrics vs. Question Mastery**:
       - `PerformanceService.calculateGlobalMetrics()` and `renderRecentHistory()` exclude `mockType === "DOJO_CLINIC"` so untimed Dojo practice **never distorts your official Timed Mock ERI, Mock Accuracy, or Mock History cards**.
       - `PerformanceService.getQuestionPerformanceMap()`, `getChapterStats()`, and `calculateNeglect()` **include `DOJO_CLINIC` records** so:
         - Questions solved in Dojo immediately graduate from `Unseen` to `Attempted` (`🟢 / 🟡 / 🔴` badge in Practice Lab).
         - Solving a `Mistake Debt` (`lastWasIncorrect: true`) question **correctly** on the first try in Dojo redeems `lastWasIncorrect = false` so your Mistake Debt counter drops in real time!
         - Missing a question in Dojo flags `lastWasIncorrect = true` so it automatically enters your Mistake Debt & Daily Autopilot queue.
     - **End-of-Dojo Session Summary Toast/Modal**: Exiting Dojo displays a concise summary (`Solved: 18 • Accuracy: 83% • 5 Mistake Debts Redeemed`).

2. **Bridge 2 — Sheet Spaced-Repetition (SRS) & Active Recall Progress Bar**:
   - **Problem**: All 370+ Knowledge Sheets were static documents with no memory of which sheets you mastered vs. forgot, or how many masks you recalled.
   - **Solution**:
     - **Live Recall Progress Counter**: When `🙈 Recall Mode` is active, a floating progress bar at the top of the folio shows `Recalled: 0 / N Masks` with `[ 👁️ Reveal Next ]` and `[ ↺ Reset Masks ]`. Tapping each blurred mask increments your recalled count.
     - **1-Tap Sheet SRS Check-In Footer**: At the bottom of every sheet (and in the Tablet Margin Rail), a compact **Sheet Mastery Check-In Bar** lets you rate the sheet:
       - `[ 🔴 Hard / Forgot (Review in 1d) ]`
       - `[ 🟡 Good Recall (Review in 4d) ]`
       - `[ 🟢 Mastered (Review in 10d) ]`
     - Stores `{ id: "srs_" + sheet.id, rating, lastReviewedEpoch, nextDueEpoch, reviewCount }` in `store_notes`.
     - **370-Sheet Index & Dashboard Integration**: Adds a `🔥 Due for Recall` filter in the Sheet Index Modal and surfaces due sheets in the Dashboard's Daily Priority Queue.

3. **Bridge 3 — Bi-Directional Exam Trap & Mistake Alert Inside Knowledge Studio**:
   - **Problem**: Tagging an error (`FORMULA_AMNESIA`, `CALCULATION_SLIP`, `TIME_TRAP_Q4`) in Mock Review never warned you when reading the corresponding Knowledge Sheet later.
   - **Solution**:
     - When `renderActiveCompSheet()` loads a sheet, it cross-checks `PerformanceService.getQuestionPerformanceMap()` for all linked questions.
     - If any linked questions have `lastWasIncorrect === true` or recorded `traps`, the Folio & Margin Rail display a **"⚠️ Past Exam Vulnerability on This Topic"** card listing the exact trap tags and question IDs with a 1-tap `[ 🧘 Remediate N Mistakes in Dojo ]` button.

---

### 4. Technical Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     KNOWLEDGE STUDIO (#compendium-fullscreen-view)           │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Zen Auto-Hide Top Bar (52px)]  ←── Scroll ΔY Detector (>30px hide)         │
│   ├── ← Back  │  📑 Subject / Chapter / Sheet Drawer  │  [•••] Studio Menu   │
│   └── Collapsible Drawer: Subject/Chapter Selects + Horizontal Sheet Tabs    │
├───────────────────────────────────────────────┬──────────────────────────────┤
│  LEFT / CENTER: A4 ACADEMIC FOLIO SURFACE     │  RIGHT: TABLET LANDSCAPE     │
│  (.comp-folio-page | max-width: 740px)        │  MARGIN RAIL (≥820px Land.)  │
│  ┌─────────────────────────────────────────┐  │  ┌────────────────────────┐  │
│  │ • Surface: Obsidian | Charcoal | Sepia  │  │  │ ⚠️ Past Exam Traps &   │  │
│  │ • Recall Progress: [Recalled 4/12 Masks]│  │  │    Mistake Debt Alert  │  │
│  │ • In-Sheet TOC Anchor Pills             │  │  ├────────────────────────┤  │
│  │ • Occurrence-Exact Masks (phrase::k)    │  │  │ 📌 Sheet Revision Cue  │  │
│  │ • 4-Color Highlights (.user-hl-*)       │  │  ├────────────────────────┤  │
│  │ • Sheet SRS Footer: [🔴 1d][🟡 4d][🟢10d]│  │  │ 🖍️ Active Highlights & │  │
│  └─────────────────────────────────────────┘  │  │ ⚡ Linked Questions    │  │
│                                               │  └────────────────────────┘  │
├───────────────────────────────────────────────┴──────────────────────────────┤
│              FLOATING BOTTOM GLASS DOCK (#comp-floating-dock)                │
│   [ 📑 Sheets ] • [ 🙈 Recall ] • [ 🖌️ Mask ] • [ 🖍️ Highlight ] • [ ⚡ Drill ]│
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Summary of Files & Sections to Update
- **`index.html`**:
  - Replace the 4 stacked Compendium bars with the **Zen Top Header**, collapsible **Sheet Switcher Drawer**, **Split-Studio Workspace** (`#comp-folio-column` + `#comp-margin-rail`), **Floating Bottom Glass Dock** (`#comp-floating-dock`), and **`[ ••• ]` Studio Overflow Popover**.
  - Upgrade `#selection-action-popover` with `[ 🙈 Mask ]`, 4 semantic highlight color dots (`🟡 🟢 🔴 🟣`), and `[ 📌 Cue ]`.
- **`style.css`**:
  - Add `.comp-folio-page` A4 geometry, `.folio-preset-obsidian`, `.folio-preset-charcoal`, and `.folio-preset-sepia` theme variables, `.zen-header-hidden` smooth scroll transition, `.comp-floating-dock` glass pill styling, `.user-hl-{yellow|green|red|purple}` multi-color highlight styles, and `@media (min-width: 820px) and (orientation: landscape)` split-studio layout rules.
- **`app.js`**:
  - **Section 7 (`formatRichText`)**: Replace global regex custom masking with occurrence-indexed masking (`phrase::k`) and 4-color highlight injection (`highlights_${sheet.id}`), plus de-boxed editorial spacing.
  - **Section 17 (`PerformanceService`)**: Integrate `DOJO_CLINIC` telemetry records into `getQuestionPerformanceMap()`, `getChapterStats()`, and `calculateNeglect()` while keeping `calculateGlobalMetrics()` strictly scoped to Timed Mocks.
  - **Section 22 & 23 (`selectShowcaseCardOption` & `renderDojoArenaQuestion`)**: Call `recordUntimedPracticeSolve()` on option selection so Unseen status and Mistake Debt update live in IndexedDB.
  - **Section 25 (`Knowledge Studio`)**: Implement Zen scroll controller, Reading Surface Preset switcher, Occurrence-Indexed Mask & 4-Color Highlight engines, Sheet SRS confidence rating (`rateCurrentSheetRecall`), Recall Progress counter, and Tablet Margin Rail synchronization.
