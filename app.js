/**
 * ============================================================================
 * SSC CGL INTELLIGENCE OS — CORE ENGINE (ARCHITECTURE V7.2)
 * Master Application Controller — PART 1 OF 3 (Sections 1 - 17)
 * Architecture: Mobile + Pad/Tablet Responsive WebAPK | IndexedDB Engine (v16)
 * Candidate: Ankit Kumar (SSC CGL 2026 Tier 1 & Tier 2 Master Preparation)
 * ============================================================================
 */

window.CGL_OS = window.CGL_OS || {};

const CGL_OS = (() => {
  /* ==========================================================================
   * SECTION 1: CITATION ARTIFACT SANITIZER & UNICODE MOJIBAKE HEALER
   * ========================================================================== */
  function stripCitationArtifacts(str) {
    if (!str || typeof str !== "string") return str;
    return str
      .replace(/\[span_\d+\]\((?:start|end)_span\)/g, "")
      .replace(/\[cite:\s*[\d,\s]+\]/g, "");
  }

  function cleanMojibake(str) {
    if (!str || typeof str !== "string") return str;
    let s = stripCitationArtifacts(str);
    if (!/[\u00F0\u00E2\u00C2]/.test(s)) return s;

    s = s.replace(/[\u00F0\u00E2\u00C2\u0178\u201D\u2019\u0027\u00A5\uFFFD]+\s*Export/g, "\uD83D\uDCE5 Export");
    s = s.replace(/[\u00F0\u00E2\u00C2\u0178\u201D\u2019\u0027\u00A5\uFFFD]+\s*Re-attempt/g, "\uD83D\uDD01 Re-attempt");
    s = s.replace(/[\u00F0\u00E2\u00C2\u0178\u201D\u2019\u0027\uFFFD]+\s*(Submit Final Section)/g, "\uD83D\uDD12 $1");
    s = s.replace(/[\u00F0\u00E2\u00C2\u0178\u201D\u2019\u0027\uFFFD]+\s*(End Section Early)/g, "\uD83D\uDD12 $1");
    s = s.replace(/[\u00F0\u00E2\u00C2\u0178\u201D\u2019\u0027\uFFFD]+\s*(Lock &amp; Submit|Lock & Submit|End &amp; Advance|End & Advance)/g, "\uD83D\uDD12 $1");
    s = s.replace(/[\u00E2\u008F\u00B3\uFFFD]+\s*(English|QA|REAS|GA|Quant|General)/g, "\u23F3 $1");
    s = s.replace(/[\u00F0\u00E2\u00C2\u0178\u201D\u2019\uFFFD]+\s*Solve/g, "\u26A1 Solve");
    s = s.replace(/[\u00F0\u00E2\u00C2\u0178\u201D\u2019\uFFFD]+\s*Drill/g, "\u26A1 Drill");
    s = s.replace(/[\u00F0\u00E2\u00C2\u0178\u201D\u2019\uFFFD]+\s*(Browse Sheets|Sheet:)/g, "\uD83D\uDCD6 $1");
    s = s.replace(/[\u00E2\u201C\u2713\uFFFD]+\s*CORRECT/g, "\u2713 CORRECT");
    s = s.replace(/[\u00E2\u2014\u2717\uFFFD]+\s*INCORRECT/g, "\u2717 INCORRECT");
    s = s.replace(/[\u00E2\u26AA\uFFFD]+\s*UNATTEMPTED/g, "\u26AA UNATTEMPTED");

    s = s.replace(/\u00E2\u0161\u00A1/g, "\u26A1");
    s = s.replace(/\u00E2\u2021\u201E/g, "\u21C4");
    s = s.replace(/\u00E2\u0153\u2022/g, "\u2715");
    s = s.replace(/\u00E2\u2013\u00BC/g, "\u25BC");
    s = s.replace(/\u00E2\u2013\u00B2/g, "\u25B2");
    s = s.replace(/\u00C2\u20AC\u00A2|\u00E2\u20AC\u00A2|\u00E2\u00A0\u00A2/g, "\u2022");
    s = s.replace(/\u00E2\u017E\u201D/g, "\u2794");
    s = s.replace(/\u00E2\u20AC\u201D/g, "\u2014");
    s = s.replace(/\u00C2\u0161/g, "");
    s = s.replace(/\u00E2\u008F\u00B3|\u00E2\u00A0\u00B3/g, "\u23F3");
    s = s.replace(/\u00E2\u0161\u00AA/g, "\u26AA");
    s = s.replace(/\u00E2\u0153\u201C/g, "\u2713");
    s = s.replace(/\u00E2\u0153\u2017/g, "\u2717");

    return s;
  }

  function safeBind(id, event, handler) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener(event, handler);
      return true;
    }
    return false;
  }

  function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = (text === undefined || text === null) ? "" : cleanMojibake(String(text));
  }

  function safeSetHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = (html === undefined || html === null) ? "" : cleanMojibake(String(html));
  }

  function safeSetValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = (val === undefined || val === null) ? "" : val;
  }

  function safeSetDisplay(id, displayStyle) {
    const el = document.getElementById(id);
    if (el) el.style.display = displayStyle;
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* ==========================================================================
   * SECTION 1B: NON-BLOCKING FLOATING GLASS TOAST HUD (V9.0)
   * ========================================================================== */
  function showToast(message, type = "cyan", durationMs = 2400) {
    const container = document.getElementById("cgl-toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    const validType = ["cyan", "emerald", "amber", "rose", "purple"].includes(type) ? type : "cyan";
    toast.className = `cgl-toast-item toast-${validType}`;
    toast.innerText = String(message || "");
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
      toast.style.transition = "all 0.2s ease";
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    }, Math.max(900, durationMs));
  }

  // Route internal non-destructive alert(...) notifications through the non-blocking Glass Toast HUD
  function alert(msg) {
    const text = String(msg || "");
    let tone = "cyan";
    if (/✓|saved|copied|cloned|restored|complete|success|promoted/i.test(text)) tone = "emerald";
    else if (/error|failed|invalid|cannot|empty|required/i.test(text)) tone = "rose";
    else if (/⚠️|warning|cooldown|select|enter/i.test(text)) tone = "amber";
    showToast(text, tone, text.length > 85 ? 3600 : 2500);
  }

  /* ==========================================================================
   * SECTION 2: RESILIENT 3-TIER DOWNLOAD PIPELINE (WEBAPK / WEBVIEW SHIELD)
   * ========================================================================== */
  let fallbackDownloadPayload = "";

  async function downloadFileResilient(filename, mimeType, contentPayload) {
    const isBinary = (contentPayload instanceof Uint8Array) || (contentPayload instanceof ArrayBuffer) || (contentPayload instanceof Blob);
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([contentPayload], filename, { type: mimeType });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: filename,
            text: `SSC CGL Intelligence OS Data Export: ${filename}`
          });
          return { method: "SHARE_API", success: true };
        }
      } catch (shareErr) {
        if (shareErr.name === "AbortError") {
          return { method: "SHARE_ABORTED", success: false };
        }
      }
    }

    try {
      const blob = contentPayload instanceof Blob ? contentPayload : new Blob([contentPayload], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      return { method: "BLOB_URL", success: true };
    } catch (uriErr) {
      console.warn("Blob download failed, opening Tier 3 buffer:", uriErr);
    }

    if (isBinary) {
      showToast("Binary download blocked by browser container.", "rose");
      return { method: "BINARY_BLOCKED", success: false };
    }

    fallbackDownloadPayload = contentPayload;
    safeSetText("download-fallback-title", `File: ${filename}`);
    safeSetValue("download-fallback-text", contentPayload);
    const modal = document.getElementById("modal-download-fallback");
    if (modal) {
      modal.classList.add("active");
      pushHistoryState("modal-download-fallback");
    }
    return { method: "MODAL_FALLBACK", success: true };
  }

  function copyDownloadFallbackToClipboard() {
    const textarea = document.getElementById("download-fallback-text");
    if (!textarea) return;
    textarea.select();
    navigator.clipboard.writeText(textarea.value)
      .then(() => showToast("\u2713 Export payload copied directly to clipboard!", "emerald"))
      .catch(() => showToast("Select all and copy manually from text box.", "amber"));
  }

  /* ==========================================================================
   * SECTION 3: ACCURATE UNIVERSAL ENGAGEMENT & STUDY TIME TRACKER
   * ========================================================================== */
  let unsyncedStudySeconds = 0;
  let lastUserInteractionEpoch = Date.now();
  let universalEngagementInterval = null;
  const IDLE_CUTOFF_MS = 60000;

  function initUniversalEngagementTracker() {
    const registerInteraction = () => {
      lastUserInteractionEpoch = Date.now();
    };

    window.addEventListener("pointerdown", registerInteraction, { passive: true });
    window.addEventListener("keydown", registerInteraction, { passive: true });
    window.addEventListener("scroll", registerInteraction, { passive: true });

    if (universalEngagementInterval) clearInterval(universalEngagementInterval);

    universalEngagementInterval = setInterval(async () => {
      const now = Date.now();
      const isExamRunning = activeExam && !activeExam.isPaused && !activeExam.isReviewMode;
      if (!isExamRunning && (now - lastUserInteractionEpoch < IDLE_CUTOFF_MS)) {
        unsyncedStudySeconds++;
        if (unsyncedStudySeconds >= 30) {
          await persistEngagementTelemetry();
        }
      }
    }, 1000);
  }

  async function persistEngagementTelemetry() {
    if (unsyncedStudySeconds <= 0) return;
    const deltaToCommit = unsyncedStudySeconds;
    unsyncedStudySeconds = 0;
    try {
      const currentStored = await getRecord("store_config", "telemetry_active_study_time_sec");
      const baseSec = currentStored && typeof currentStored.value === "number" ? currentStored.value : 0;
      await putRecord("store_config", {
        key: "telemetry_active_study_time_sec",
        value: baseSec + deltaToCommit
      });
    } catch (e) {
      unsyncedStudySeconds += deltaToCommit;
    }
  }

  /* ==========================================================================
   * SECTION 4: CONSTANTS, SUBJECT PAR MATRIX & V7.2 RUNTIME EXECUTION STATE
   * ========================================================================== */
  const DB_NAME = "cgl_os_db";
  const DB_VERSION = 16;
  let db = null;
  let dbInitPromise = null;

  let SUBJECT_PAR_CONFIG = {
    GA:   { parSec: 14, trapSec: 35, masterySec: 8 },
    ENG:  { parSec: 20, trapSec: 45, masterySec: 10 },
    REAS: { parSec: 35, trapSec: 70, masterySec: 15 },
    QA:   { parSec: 50, trapSec: 95, masterySec: 20 }
  };

  function getSubjectThresholds(subKey) {
    return SUBJECT_PAR_CONFIG[subKey] || { parSec: 40, trapSec: 85, masterySec: 12 };
  }

  // Active Timed Exam, Preview Queue & Dojo Stopwatch State
  let activeExam = null;
  let examTimerInterval = null;
  let lastTimerTickEpoch = 0;
  let dojoExam = null;
  let dojoStopwatchInterval = null;
  let dojoStopwatchSec = 0;
  let dojoSetupSplitSec = null;
  let activeReviewAttempt = null;
  let previewedMockInstance = null;
  let showPreviewAnswerKeys = false;

  // Practice Lab / Question Control Center State
  let practiceSearchQuery = "";
  let practiceSelectedIds = new Set();
  let practiceActiveQuickFilter = "ALL";
  let practiceViewMode = "SHOWCASE";
  let practiceShowcaseRevealAll = false;
  let practiceSelectedSubjects = new Set();
  let practiceSelectedChapters = new Set();
  let practiceSelectedSubtopics = new Set();
  let practiceSelectedStatuses = new Set();
  let practiceSelectedDifficulties = new Set();
  let practiceShowcaseRevealedIds = new Set();
  let practiceShowcaseSelectedOptionByQ = {};
  let practiceSortBy = "HIERARCHY";
  let practiceSavedPresets = [];
  let practiceCurrentPage = 1;
  const PRACTICE_PAGE_SIZE = 20;

  // Granular Multi-Chapter Matrix State in Mock Lab
  let mockLabSelectedMatrixChapters = new Set();

  // Full-Screen Living Compendium Studio, Occurrence-Indexed Masks, 4-Color Highlights & Surface Presets
  let activeCompSubject = "QA";
  let activeCompChapter = "QA_PERCENTAGE";
  let activeCompSheetIndex = 0;
  let currentCompSheets = [];
  let currentConceptImageBase64 = "";
  let compendiumRecallMode = false;
  let compendiumMaskEditMode = false;
  let compendiumHighlightMode = false;
  let compendiumHighlightColor = "yellow";
  let compendiumActiveHighlightColor = "yellow";
  let compendiumAutoBlurAll = false;
  let activeSheetCustomMasks = [];
  let activeSheetCustomHighlights = [];
  let activeSheetHighlights = [];
  let compendiumPaperPreset = "FOLLOW_GLOBAL";
  let compendiumReadingSurface = "obsidian";
  let compendiumZoomScale = 1.0;

  // Split-Screen Sheet + Question Drawer State
  let activeSplitSheetId = null;
  let activeSplitSheetSubject = null;
  let activeSplitSheetChapter = null;

  // Reader Typography Scale
  let readerFontScale = 1.0;

  // Global Scroll-Synchronized OnePlus Stylo 2 / Tablet Ink State & Per-Item Memory
  let scratchpadActive = false;
  let scratchpadScrollPassthrough = true;
  let scratchpadFingerDraw = false; // Default false: Stylus draws, 1-Finger scrolls naturally
  let scratchpadLaserMode = false;
  let scratchpadMode = "PEN";
  let scratchpadColor = "#38bdf8";
  let scratchpadDrawing = false;
  let scratchpadStrokes = [];
  let currentStroke = [];
  let inkMemoryByContextKey = {};
  let activeInkContextKey = "global_default";

  // Floating Text Selection Popover State
  let pendingSelectedText = "";
  let pendingSelectedOccurrence = null;
  let pendingSelectionOccurrence = null;
  let pendingSelectionSheetId = null;
  let pendingSelectionContext = null;

  // AI Tutor Modal State
  let activeAiTutorContext = "DOJO";
  let lastAiTutorPlainText = "";

  // Synapse Knowledge Explorer State
  let synapseCurrentLevel = "SUBJECTS";
  let synapseActiveSubject = null;
  let synapseActiveChapter = null;

  // Interactive Cognitive Trap Clinic & Disaster Recovery
  let activeClinicTrapType = "TIME_TRAP_Q4";
  let activeClinicQuestions = [];
  let pendingHydrationData = null;

  // Native Question GUI Creator State
  let currentQuestionImageBase64 = "";

  // Standard Cognitive Trap Classifications
  let customMistakeTags = [
    "CALCULATION_SLIP",
    "READING_TRAP",
    "FORMULA_AMNESIA",
    "CONCEPT_VOID",
    "RUSHED_PANIC",
    "PANIC_SLIP",
    "TIME_TRAP_Q4",
    "SECOND_GUESS_BLUNDER",
    "SPEED_MISREAD",
    "VALID_CALCULATED_RISK"
  ];

  /* ==========================================================================
   * SECTION 5: CANONICAL INITIAL TAXONOMY SEED & ATOMIC PASSAGE BANK
   * ========================================================================== */
  const DEFAULT_TAXONOMY = {
    QA: {
      name: "Quantitative Aptitude",
      order: 1,
      chapters: [
        "QA_PERCENTAGE", "QA_PROFIT_LOSS", "QA_DISCOUNT", "QA_SI_CI",
        "QA_SI_CI_INSTALLMENT", "QA_RATIO_PROP", "QA_AGE", "QA_PARTNERSHIP",
        "QA_AVERAGE", "QA_MIXTURE_ALLIGATION", "QA_TIME_WORK", "QA_WORK_WAGES",
        "QA_PIPE_CISTERN", "QA_SPEED_DIST", "QA_BOAT_STREAM", "QA_RACE",
        "QA_NUM_SYS", "QA_SEQUENCE_SERIES", "QA_SIMPLIFICATION", "QA_SURDS_INDICES",
        "QA_LCM_HCF", "QA_ALGEBRA", "QA_GEOMETRY", "QA_MENSURATION", "QA_TRIGONOMETRY"
      ]
    },
    REAS: {
      name: "General Intelligence & Reasoning",
      order: 2,
      chapters: [
        "REAS_ANALOGY", "REAS_SERIES", "REAS_CODING", "REAS_BLOOD_REL",
        "REAS_SYLLOGISM", "REAS_ORDER_RANK", "REAS_FIGURES", "REAS_DICE_CUBE",
        "REAS_CLOCK_CALENDAR", "REAS_VENN", "REAS_DIRECTION"
      ]
    },
    ENG: {
      name: "English Comprehension",
      order: 3,
      chapters: [
        "ENG_SYN_ANT", "ENG_OWS", "ENG_IDIOMS", "ENG_SPOTTING", "ENG_IMPROVE",
        "ENG_ACTIVE_PASS", "ENG_DIRECT_INDR", "ENG_CLOZE_TEST", "ENG_READING_COMP", "ENG_PARAJUMBLES"
      ]
    },
    GA: {
      name: "General Awareness",
      order: 4,
      chapters: [
        "GA_POLITY", "GA_HISTORY_MOD", "GA_HISTORY_ANC", "GA_HISTORY_MED",
        "GA_GEOGRAPHY_IN", "GA_GEOGRAPHY_WORLD", "GA_ECONOMY", "GA_PHYSICS",
        "GA_CHEMISTRY", "GA_BIOLOGY", "GA_STATIC_GK", "GA_CA_ANNUAL"
      ]
    }
  };

  let TAXONOMY = JSON.parse(JSON.stringify(DEFAULT_TAXONOMY));

  const SEED_QUESTIONS = [
    {
      id: "q_cgl_ga_polity_014",
      subject: "GA",
      chapter: "GA_POLITY",
      subtopic: "Judiciary",
      method: "Constitutional Articles",
      parentPassageId: null,
      passageText: "",
      setOrder: 1,
      setTotal: 1,
      conceptId: "top_ga_polity_judiciary",
      conceptIds: ["top_ga_polity_judiciary"],
      questionText: "Which Article of the Constitution of India provides for the establishment and constitution of the Supreme Court of India?",
      imageUrl: "",
      options: ["Article 124", "Article 131", "Article 214", "Article 143"],
      correctIndex: 0,
      explanation: "Article 124 establishes the Supreme Court of India, detailing its composition, appointment of judges, and jurisdictional authority.",
      source: "PYQ Tier-1",
      difficulty: "EASY",
      tags: ["Polity", "SupremeCourt", "Articles"],
      bookmarked: false,
      annotation: ""
    },
    {
      id: "q_cgl_qa_geom_011",
      subject: "QA",
      chapter: "QA_GEOMETRY",
      subtopic: "Circles",
      method: "Cyclic Quadrilateral Angles",
      parentPassageId: null,
      passageText: "",
      setOrder: 1,
      setTotal: 1,
      conceptId: "top_qa_geo_circles",
      conceptIds: ["top_qa_geo_circles", "top_qa_geo_triangles"],
      questionText: "In a cyclic quadrilateral $ABCD$, opposite angles $\\angle A$ and $\\angle C$ satisfy $\\angle A = (2x + 10)^\\circ$ and $\\angle C = (3x + 20)^\\circ$. What is the measure of $\\angle A$?",
      imageUrl: "",
      options: ["$60^\\circ$", "$70^\\circ$", "$80^\\circ$", "$75^\\circ$"],
      correctIndex: 1,
      explanation: "Opposite angles sum to $180^\\circ$: $(2x + 10) + (3x + 20) = 180 \\implies 5x + 30 = 180 \\implies 5x = 150 \\implies x = 30^\\circ$. Therefore, $\\angle A = 2(30) + 10 = 70^\\circ$.",
      source: "PYQ Tier-1",
      difficulty: "MEDIUM",
      tags: ["Geometry", "CyclicQuadrilateral", "Formula"],
      bookmarked: false,
      annotation: ""
    },
    {
      id: "q_cgl_eng_rc_001",
      subject: "ENG",
      chapter: "ENG_READING_COMP",
      subtopic: "Central Idea & Theme",
      method: "Inference & Fact Extraction",
      parentPassageId: "psg_cgl_rc_demo",
      passageText: "The Indian monsoon is not merely a weather pattern; it is the economic pulse of the subcontinent. Over 50 percent of India's arable land depends entirely on rainfed irrigation. A normal monsoon cushions rural demand, restrains food inflation, and stabilizes fiscal balances. However, climate variability has intensified erratic precipitation events, resulting in localized droughts juxtaposed with urban cloudbursts, severely straining reservoir replenishment infrastructure.",
      setOrder: 1,
      setTotal: 2,
      conceptId: "",
      conceptIds: [],
      questionText: "According to the passage, what is the primary macroeconomic hazard of erratic monsoon precipitation?",
      imageUrl: "",
      options: [
        "Uncontrollable urban industrial migration",
        "Food inflation spikes and fiscal balance instability",
        "Total shutdown of dryland irrigation systems",
        "Permanent depletion of continental groundwater tables"
      ],
      correctIndex: 1,
      explanation: "The text directly states that normal monsoons restrain food inflation and stabilize fiscal balances; erratic monsoons compromise these cushions.",
      source: "PYQ Tier-1 Mock Archetype",
      difficulty: "MEDIUM",
      tags: ["RC", "Inference", "PassageSet"],
      bookmarked: false,
      annotation: ""
    },
    {
      id: "q_cgl_eng_rc_002",
      subject: "ENG",
      chapter: "ENG_READING_COMP",
      subtopic: "Vocabulary in Context",
      method: "Contextual Synonym",
      parentPassageId: "psg_cgl_rc_demo",
      passageText: "The Indian monsoon is not merely a weather pattern; it is the economic pulse of the subcontinent. Over 50 percent of India's arable land depends entirely on rainfed irrigation. A normal monsoon cushions rural demand, restrains food inflation, and stabilizes fiscal balances. However, climate variability has intensified erratic precipitation events, resulting in localized droughts juxtaposed with urban cloudbursts, severely straining reservoir replenishment infrastructure.",
      setOrder: 2,
      setTotal: 2,
      conceptId: "",
      conceptIds: [],
      questionText: "What does the word **'juxtaposed'** most nearly mean in the context of the passage?",
      imageUrl: "",
      options: [
        "Replaced consecutively in time",
        "Placed closely together to show contrast",
        "Suppressed by overarching meteorological forces",
        "Dispersed uniformly across geographical territories"
      ],
      correctIndex: 1,
      explanation: "Juxtaposed means placing contrasting elements side-by-side (here, localized droughts side-by-side with urban cloudbursts).",
      source: "PYQ Tier-1 Mock Archetype",
      difficulty: "EASY",
      tags: ["RC", "Vocabulary", "PassageSet"],
      bookmarked: false,
      annotation: ""
    },
    {
      id: "q_cgl_qa_tw_010",
      subject: "QA",
      chapter: "QA_PIPE_CISTERN",
      subtopic: "Pipes & Cisterns",
      method: "Combined Rate of Flow",
      parentPassageId: null,
      passageText: "",
      setOrder: 1,
      setTotal: 1,
      conceptId: "",
      conceptIds: [],
      questionText: "Pipe $A$ fills a tank in $12\\text{ hours}$ and Pipe $B$ fills it in $18\\text{ hours}$. If both are opened simultaneously, in how many hours will the tank be full?",
      imageUrl: "",
      options: ["$7.2\\text{ hours}$", "$7.5\\text{ hours}$", "$8.0\\text{ hours}$", "$6.8\\text{ hours}$"],
      correctIndex: 0,
      explanation: "Combined rate $= \\frac{1}{12} + \\frac{1}{18} = \\frac{5}{36}\\text{ tank/hour}$. Total time $= \\frac{36}{5} = 7.2\\text{ hours}$.",
      source: "PYQ Tier-1",
      difficulty: "EASY",
      tags: ["Pipes", "CombinedRate"],
      bookmarked: false,
      annotation: ""
    },
    {
      id: "q_cgl_reas_analogy_012",
      subject: "REAS",
      chapter: "REAS_ANALOGY",
      subtopic: "Number Analogy",
      method: "n(n + 1) Product Form",
      parentPassageId: null,
      passageText: "",
      setOrder: 1,
      setTotal: 1,
      conceptId: "",
      conceptIds: [],
      questionText: "Select the related number: **$14 : 210 :: 18 : \\underline{\\quad ? \\quad}$**",
      imageUrl: "",
      options: ["$324$", "$342$", "$360$", "$306$"],
      correctIndex: 1,
      explanation: "Pattern: $n : n(n + 1)$. Here, $14 \\times 15 = 210$. Similarly, $18 \\times 19 = 342$.",
      source: "PYQ Tier-1",
      difficulty: "EASY",
      tags: ["Reasoning", "Analogy"],
      bookmarked: false,
      annotation: ""
    },
    {
      id: "q_qa_geom_002",
      subject: "QA",
      chapter: "QA_GEOMETRY",
      subtopic: "Triangles & Incenters",
      method: "Internal Angle Bisector Angle",
      parentPassageId: null,
      passageText: "",
      setOrder: 1,
      setTotal: 1,
      conceptId: "top_qa_geo_triangles",
      conceptIds: ["top_qa_geo_triangles"],
      questionText: "In $\\triangle ABC$, the bisectors of $\\angle B$ and $\\angle C$ intersect at point $I$ inside the triangle. If $\\angle BAC = 68^\\circ$, find the measure of $\\angle BIC$.",
      imageUrl: "",
      options: ["$124^\\circ$", "$136^\\circ$", "$112^\\circ$", "$146^\\circ$"],
      correctIndex: 0,
      explanation: "Incenter formula: $\\angle BIC = 90^\\circ + \\frac{\\angle A}{2} = 90^\\circ + 34^\\circ = 124^\\circ$.",
      source: "PYQ Tier-1",
      difficulty: "EASY",
      tags: ["Geometry", "Incenter", "Formula"],
      bookmarked: false,
      annotation: ""
    }
  ];

  const SEED_TOPIC_DOSSIERS = [
    {
      id: "top_qa_geo_triangles",
      subject: "QA",
      chapter: "QA_GEOMETRY",
      title: "Triangles & Incenters",
      subtitle: "Incenters, Circumcenters & Angle Bisectors",
      content: "### Internal Angle Bisector Theorem\nIf $AD$ bisects $\\angle A$ and meets $BC$ at $D$:\n$${{\\frac{BD}{DC} = \\frac{AB}{AC}}}$$\n\n> [!formula]\n> **Incenter Angle Rule:**\n> The angle formed at the incenter $I$ satisfies:\n> $${{\\angle BIC = 90^\\circ + \\frac{\\angle A}{2}}}$$\n\n### Right-Angled Triangle Inradius\nFor legs $P, B$ and hypotenuse $H$:\n$${{r = \\frac{P + B - H}{2}}}$$\n\n> [!trap]\n> **Critical TCS Trap:**\n> Always verify whether the problem asks for inradius $r$ or {{circumradius $R = \\frac{H}{2}$}}.",
      imageUrl: "",
      timestamp: Date.now()
    },
    {
      id: "top_qa_geo_circles",
      subject: "QA",
      chapter: "QA_GEOMETRY",
      title: "Circles & Tangents",
      subtitle: "Secants, Power of Point & Tangent Lengths",
      content: "### Tangent-Secant Theorem (Power of a Point)\nFrom external point $P$, if $PT$ is tangent and $PAB$ is secant:\n$${{PT^2 = PA \\cdot PB}}$$\n\n### Common Tangent Lengths\nFor radii $r_1, r_2$ and center separation $d$:\n* **Direct Common Tangent (DCT):**\n$${{DCT = \\sqrt{d^2 - (r_1 - r_2)^2}}}$$\n* **Transverse Common Tangent (TCT):**\n$${{TCT = \\sqrt{d^2 - (r_1 + r_2)^2}}}$$\n\n> [!trap]\n> **Externally Touching Circles:**\n> When $d = r_1 + r_2$, the transverse tangent drops to $0$ and {{$DCT = 2\\sqrt{r_1 r_2}$}}.",
      imageUrl: "",
      timestamp: Date.now()
    },
    {
      id: "top_ga_polity_judiciary",
      subject: "GA",
      chapter: "GA_POLITY",
      title: "Supreme Court & Writ Jurisdiction",
      subtitle: "Articles 32, 124, 131, 226",
      content: "### Constitutional Architecture\n* **{{Article 124}}:** Establishment and constitution of the Supreme Court of India.\n* **{{Article 131}}:** Original jurisdiction of the Supreme Court (Federal inter-state disputes).\n* **{{Article 143}}:** Advisory jurisdiction on Presidential references.\n* **{{Article 226}}:** High Courts writ jurisdiction for Fundamental and statutory rights.",
      imageUrl: "",
      timestamp: Date.now()
    }
  ];

  const SEED_SAVED_MOCKS = [
    {
      id: "bp_tier1_standard",
      type: "DYNAMIC_BLUEPRINT",
      title: "Tier 1 Standard Full Mock (100 Qs)",
      isSectionLocked: true,
      positiveMarks: 2.0,
      negativeMarks: 0.5,
      selectionRule: { mode: "RANDOM", count: 100, positiveMarks: 2.0, negativeMarks: 0.5 },
      sections: [
        { id: 1, subject: "REAS", count: 25, durationMin: 15 },
        { id: 2, subject: "GA", count: 25, durationMin: 15 },
        { id: 3, subject: "QA", count: 25, durationMin: 15 },
        { id: 4, subject: "ENG", count: 25, durationMin: 15 }
      ],
      questions: null
    },
    {
      id: "bp_qa_speed_blitz",
      type: "DYNAMIC_BLUEPRINT",
      title: "QA Speed Blitz (25 Qs - 15 Mins)",
      isSectionLocked: false,
      positiveMarks: 2.0,
      negativeMarks: 0.5,
      selectionRule: { subject: "QA", mode: "RANDOM", count: 25, positiveMarks: 2.0, negativeMarks: 0.5 },
      sections: [
        { id: 1, subject: "QA", count: 25, durationMin: 15 }
      ],
      questions: null
    }
  ];

  /* ==========================================================================
   * SECTION 6: DUAL-TEMPORAL & INDIAN STANDARD TIME (IST) UTILITIES
   * ========================================================================== */
  function formatISTDate(epochMs = Date.now()) {
    try {
      const d = new Date(epochMs);
      return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(d) + " IST";
    } catch (e) {
      return new Date(epochMs).toISOString();
    }
  }

  function getDiurnalSlot(epochMs = Date.now()) {
    try {
      const d = new Date(epochMs);
      const hours = parseInt(new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false
      }).format(d), 10);
      if (hours >= 4 && hours < 8) return "EARLY_MORNING";
      if (hours >= 8 && hours < 12) return "MORNING";
      if (hours >= 12 && hours < 17) return "AFTERNOON";
      if (hours >= 17 && hours < 21) return "EVENING";
      return "NIGHT";
    } catch (e) {
      return "DAY";
    }
  }

  function calcGapDays(timeRecent, timePrior) {
    if (!timePrior || timePrior === 0) return 0;
    return parseFloat((Math.abs(timeRecent - timePrior) / (1000 * 60 * 60 * 24)).toFixed(1));
  }

  /* ==========================================================================
   * SECTION 7: TYPESETTER, CUSTOM {{RECALL MASKS}} & KATEX ISOLATION
   * ========================================================================== */
  function formatRichText(str, customMaskPhrases = []) {
    if (!str) return "";
    let out = stripCitationArtifacts(cleanMojibake(String(str)));

    // 1. Convert explicit {{...}} and ==...== user-defined occlusion syntax before math isolation
    out = out.replace(/\{\{([\s\S]+?)\}\}/g, '<span class="user-recall-mask">$1</span>');
    out = out.replace(/==([^\n=]+?)==/g, '<span class="user-recall-mask">$1</span>');

    // 2. Isolate LaTeX math into protected tokens
    const mathTokens = [];
    out = out.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      mathTokens.push({ display: true, formula: formula.trim() });
      return `___CGL_MATH_${mathTokens.length - 1}___`;
    });
    out = out.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
      mathTokens.push({ display: false, formula: formula.trim() });
      return `___CGL_MATH_${mathTokens.length - 1}___`;
    });

    // 3. Escape stray < and > outside blockquote directives or intentional span tags
    out = out.replace(/<(?![\/!]?(?:span|div|b|strong|em|i|code|br|h1|h2|h3|h4|table|thead|tbody|tr|th|td)\b)/gi, "&lt;");

    // 4. Multi-Line Callout Blocks ([!trap], [!formula], [!tip])
    out = out.replace(/(?:^|\n)>\s*\[!trap\]([^\n]*(?:\n>[^\n]*)*)/gi, (match, body) => {
      const cleanBody = body.replace(/^\s*>\s?/gm, "").trim();
      return `<div class="callout-box trap"><b>\u26A0\uFE0F Cognitive Trap:</b><br>${cleanBody}</div>`;
    });
    out = out.replace(/(?:^|\n)>\s*\[!formula\]([^\n]*(?:\n>[^\n]*)*)/gi, (match, body) => {
      const cleanBody = body.replace(/^\s*>\s?/gm, "").trim();
      return `<div class="callout-box formula"><b>\u26A1 Formula / Identity:</b><br>${cleanBody}</div>`;
    });
    out = out.replace(/(?:^|\n)>\s*\[!tip\]([^\n]*(?:\n>[^\n]*)*)/gi, (match, body) => {
      const cleanBody = body.replace(/^\s*>\s?/gm, "").trim();
      return `<div class="callout-box"><b>\uD83D\uDCA1 Tactical Tip:</b><br>${cleanBody}</div>`;
    });

    // 5. Headings with Anchors for Sheet TOC Generation (De-Boxed Editorial Rhythm)
    out = out.replace(/^#### (.*$)/gim, '<h4 style="font-size:14px; font-weight:800; color:var(--accent-purple-light); margin:18px 0 6px 0;">$1</h4>');
    out = out.replace(/^### (.*$)/gim, (match, title) => {
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<h3 id="sec-${anchor}" class="comp-heading-h3">${title}</h3>`;
    });
    out = out.replace(/^## (.*$)/gim, (match, title) => {
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<h2 id="sec-${anchor}" class="comp-heading-h2">${title}</h2>`;
    });
    out = out.replace(/^# (.*$)/gim, '<h1 class="comp-heading-h1">$1</h1>');

    // 6. Bold, Italics & Inline Code
    out = out.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, "<em>$1</em>");
    out = out.replace(/`([^`\n]+)`/g, '<code style="background:#111828; color:var(--accent-cyan); padding:1px 5px; border-radius:4px; font-family:var(--font-mono); font-size:0.92em;">$1</code>');

    // 7. Assertions & Reasons
    out = out.replace(/(?:Assertion\s*\(?A\)?|Assertion\s*:)\s*([^\n]+)/gi, '<div class="q-assertion-box"><b>[A] Assertion:</b> $1</div>');
    out = out.replace(/(?:Reason\s*\(?R\)?|Reason\s*:)\s*([^\n]+)/gi, '<div class="q-reason-box"><b>[R] Reason:</b> $1</div>');

    // 8. Syllogisms & Structured Item Rows
    out = out.replace(/(?:Statements?\s*:)\s*([\s\S]+?)(?=(?:Conclusions?\s*:|Conclusions?|$))/i, (match, body) => {
      const items = body.split(/(?:\(\d+\)|\(\w+\)|\d+\.|\n\u2022|\n\*|\n-)/).map(s => s.trim()).filter(Boolean);
      const rows = items.map((item, idx) => `
        <div class="q-itemized-row">
          <span class="q-item-num">(${idx + 1})</span>
          <span>${item}</span>
        </div>
      `).join("");
      return `<div class="q-structured-block"><div class="q-block-header"><span>\uD83D\uDCCB Statements:</span></div>${rows}</div>`;
    });

    out = out.replace(/(?:Conclusions?\s*:)\s*([\s\S]+?)(?=(?:\n\n[A-Z]|Options?|$))/i, (match, body) => {
      const roman = ["I", "II", "III", "IV", "V", "VI"];
      const items = body.split(/(?:\(\d+\)|\(\w+\)|\[\w+\]|\d+\.|\n\u2022|\n\*|\n-)/).map(s => s.trim()).filter(Boolean);
      const rows = items.map((item, idx) => `
        <div class="q-itemized-row">
          <span class="q-item-num">[${roman[idx] || (idx + 1)}]</span>
          <span>${item}</span>
        </div>
      `).join("");
      return `<div class="q-structured-block" style="margin-top:6px;"><div class="q-block-header"><span style="color:var(--accent-purple-light);">\uD83C\uDFAF Conclusions:</span></div>${rows}</div>`;
    });

    // 9. Responsive Markdown Tables
    out = out.replace(/(\|[^\n]+\|\r?\n)((?:\|:?[-]+:?)+\|)(\r?\n(?:\|[^\n]+\|\r?\n?)+)/g, (match, headerLine, alignLine, bodyLines) => {
      const headers = headerLine.trim().split("|").filter(c => c.trim().length > 0).map(c => `<th>${c.trim()}</th>`).join("");
      const rows = bodyLines.trim().split("\n").map(row => {
        const cells = row.trim().split("|").filter(c => c.trim().length > 0).map(c => `<td>${c.trim()}</td>`).join("");
        return `<tr>${cells}</tr>`;
      }).join("");
      return `<div class="table-responsive"><table class="document-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
    });

    // 10. Markdown Bullet Lists (*, -, •)
    out = out.replace(/^(?:\s*[\*\-\u2022]\s+)(.+)$/gm, '<div class="md-bullet-row"><span class="md-bullet-dot">\u2022</span><span>$1</span></div>');

    // 11. Convert regular linebreaks to <br> outside block tags
    out = out.replace(/\n/g, "<br>");
    out = out.replace(/(<\/div>|<\/h1>|<\/h2>|<\/h3>|<\/h4>)<br>/g, "$1");

    // 12. Re-inject KaTeX math tokens safely
    out = out.replace(/___CGL_MATH_(\d+)___/g, (match, index) => {
      const item = mathTokens[Number(index)];
      if (!item) return "";
      let innerFormula = item.formula;
      let isWrappedMask = false;
      if (/^\{\{[\s\S]+\}\}$/.test(innerFormula)) {
        innerFormula = innerFormula.slice(2, -2).trim();
        isWrappedMask = true;
      }
      let rendered = "";
      if (window.katex) {
        try {
          rendered = katex.renderToString(innerFormula, {
            displayMode: item.display,
            throwOnError: false
          });
        } catch (err) {
          rendered = item.display ? `$$${innerFormula}$$` : `$${innerFormula}$`;
        }
      } else {
        rendered = item.display ? `$$${innerFormula}$$` : `$${innerFormula}$`;
      }
      return isWrappedMask ? `<span class="user-recall-mask" data-inline-mask="true">${rendered}</span>` : rendered;
    });

    // 13. Occurrence-Aware Fallback for Direct String Callers (e.g. Print View)
    if (Array.isArray(customMaskPhrases) && customMaskPhrases.length > 0) {
      customMaskPhrases.forEach(rawEntry => {
        const rawStr = String(rawEntry || "").trim();
        if (!rawStr || rawStr.startsWith("MATH::")) return;
        let cleanP = rawStr;
        let targetOcc = 0;
        const occMatch = rawStr.match(/^([\s\S]+)::(\d+)$/);
        if (occMatch) {
          cleanP = occMatch[1].trim();
          targetOcc = parseInt(occMatch[2], 10);
        }
        if (cleanP.length >= 1) {
          let matchCounter = 0;
          const rx = new RegExp(`(?![^<]*>)(${escapeRegExp(cleanP)})`, "g");
          out = out.replace(rx, (m, g1) => {
            const cur = matchCounter++;
            if (cur === targetOcc) {
              const keyAttr = encodeURIComponent(`${cleanP}::${cur}`);
              return `<span class="user-recall-mask" data-mask-key="${keyAttr}">${g1}</span>`;
            }
            return m;
          });
        }
      });
    }

    return out;
  }

  /**
   * OCCURRENCE-INDEXED DOM MASKING & 4-COLOR HIGHLIGHTING ENGINE (PART I FIX)
   * Eliminates global regex word-masking collisions by computing and wrapping the
   * exact k-th occurrence (phrase::k or MATH::k) inside the rendered sheet DOM.
   */
  function getSearchableTextNodes(rootEl) {
    const nodes = [];
    let fullText = "";
    if (!rootEl) return { nodes, fullText };

    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest(".katex-mathml, script, style")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let current;
    while ((current = walker.nextNode())) {
      const txt = current.nodeValue || "";
      if (txt.length > 0) {
        const start = fullText.length;
        fullText += txt;
        nodes.push({
          node: current,
          start,
          end: fullText.length,
          text: txt
        });
      }
    }
    return { nodes, fullText };
  }

  function parseMaskOrHighlightKey(rawKey) {
    if (rawKey && typeof rawKey === "object") {
      const p = String(rawKey.phrase || "").replace(/\s+/g, " ").trim();
      const occ = (rawKey.occurrence !== undefined && rawKey.occurrence !== null && !Number.isNaN(Number(rawKey.occurrence)))
        ? parseInt(rawKey.occurrence, 10)
        : 0;
      return { phrase: p, occurrence: occ, key: `${p}::${occ}` };
    }
    const str = String(rawKey || "").trim();
    const m = str.match(/^([\s\S]+)::(\d+)$/);
    if (m) {
      const p = m[1].replace(/\s+/g, " ").trim();
      const occ = parseInt(m[2], 10);
      return { phrase: p, occurrence: occ, key: `${p}::${occ}` };
    }
    return { phrase: str, occurrence: 0, key: `${str}::0` };
  }

  function computePhraseOccurrenceAtRange(rootEl, range, phraseText) {
    const cleanP = String(phraseText || "").replace(/\s+/g, " ").trim();
    if (!rootEl || !cleanP) return 0;

    const { nodes, fullText } = getSearchableTextNodes(rootEl);
    if (!fullText) return 0;

    let targetCharPos = 0;
    if (range && range.startContainer) {
      const sc = range.startContainer;
      if (sc.nodeType === 3) {
        const found = nodes.find(n => n.node === sc);
        if (found) {
          targetCharPos = found.start + (range.startOffset || 0);
        }
      } else if (sc instanceof Element) {
        const found = nodes.find(n => sc.contains(n.node));
        if (found) targetCharPos = found.start;
      }
    }

    const normFull = fullText.toLowerCase();
    const normClean = cleanP.toLowerCase();
    let pos = 0;
    let occIdx = 0;
    let bestOcc = 0;
    let minDistance = Infinity;

    while (pos <= normFull.length) {
      const idx = normFull.indexOf(normClean, pos);
      if (idx === -1) break;
      const dist = Math.abs(idx - targetCharPos);
      if (dist < minDistance) {
        minDistance = dist;
        bestOcc = occIdx;
      }
      occIdx++;
      pos = idx + 1;
    }

    return bestOcc;
  }

  function wrapOccurrenceInDom(rootEl, cleanP, targetOcc, tagName, className, dataAttrName, rawKey) {
    if (!rootEl || !cleanP || cleanP === "[object Object]") return false;

    if (cleanP === "MATH") {
      const mathEls = rootEl.querySelectorAll(".katex-display, .katex");
      const targetMath = mathEls[targetOcc];
      if (!targetMath) return false;
      if (targetMath.parentElement && targetMath.parentElement.hasAttribute(dataAttrName)) return false;
      const wrap = document.createElement(tagName);
      wrap.className = className;
      wrap.setAttribute(dataAttrName, encodeURIComponent(rawKey));
      wrap.setAttribute(dataAttrName === "data-mask-key" ? "data-mask-phrase" : "data-hl-phrase", "MATH");
      wrap.setAttribute(dataAttrName === "data-mask-key" ? "data-mask-occ" : "data-hl-occ", String(targetOcc));
      targetMath.parentNode.insertBefore(wrap, targetMath);
      wrap.appendChild(targetMath);
      return true;
    }

    const { nodes, fullText } = getSearchableTextNodes(rootEl);
    if (!fullText) return false;

    let pos = 0;
    let occ = 0;
    let matchStart = -1;
    while (pos <= fullText.length) {
      const idx = fullText.indexOf(cleanP, pos);
      if (idx === -1) break;
      if (occ === targetOcc) {
        matchStart = idx;
        break;
      }
      occ++;
      pos = idx + 1;
    }

    if (matchStart === -1) {
      const lowerFull = fullText.toLowerCase();
      const lowerTarget = cleanP.toLowerCase();
      pos = 0;
      occ = 0;
      while (pos <= lowerFull.length) {
        const idx = lowerFull.indexOf(lowerTarget, pos);
        if (idx === -1) break;
        if (occ === targetOcc) {
          matchStart = idx;
          break;
        }
        occ++;
        pos = idx + 1;
      }
    }

    if (matchStart === -1) return false;
    const matchEnd = matchStart + cleanP.length;

    const overlapping = nodes.filter(n => n.end > matchStart && n.start < matchEnd);
    if (overlapping.length === 0) return false;

    const encodedKey = encodeURIComponent(rawKey);
    for (let i = overlapping.length - 1; i >= 0; i--) {
      const item = overlapping[i];
      const localStart = Math.max(0, matchStart - item.start);
      const localEnd = Math.min(item.text.length, matchEnd - item.start);
      if (localEnd <= localStart) continue;

      try {
        const r = document.createRange();
        r.setStart(item.node, localStart);
        r.setEnd(item.node, localEnd);
        const wrapper = document.createElement(tagName);
        wrapper.className = className;
        wrapper.setAttribute(dataAttrName, encodedKey);
        if (dataAttrName === "data-mask-key") {
          wrapper.setAttribute("data-mask-phrase", cleanP);
          wrapper.setAttribute("data-mask-occ", String(targetOcc));
        } else if (dataAttrName === "data-hl-key") {
          wrapper.setAttribute("data-hl-phrase", cleanP);
          wrapper.setAttribute("data-hl-occ", String(targetOcc));
        }
        r.surroundContents(wrapper);
      } catch (_) {}
    }
    return true;
  }

  function tokenizeFolioWords(rootEl) {
    if (!rootEl) return;
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest(".katex, .katex-mathml, script, style, .folio-word, .folio-ws")) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.nodeValue || node.nodeValue.length === 0) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    let cur;
    while ((cur = walker.nextNode())) {
      textNodes.push(cur);
    }

    let wordCounter = 0;
    textNodes.forEach(tNode => {
      const raw = tNode.nodeValue || "";
      if (!/\S/.test(raw)) return;
      const parts = raw.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          const wsSpan = document.createElement("span");
          wsSpan.className = "folio-ws";
          wsSpan.setAttribute("data-after-widx", String(Math.max(0, wordCounter - 1)));
          wsSpan.textContent = part;
          frag.appendChild(wsSpan);
        } else {
          const wSpan = document.createElement("span");
          wSpan.className = "folio-word";
          wSpan.setAttribute("data-widx", String(wordCounter));
          wSpan.textContent = part;
          wordCounter++;
          frag.appendChild(wSpan);
        }
      });
      if (tNode.parentNode) {
        tNode.parentNode.replaceChild(frag, tNode);
      }
    });
  }

  function applyDomMasksAndHighlights(rootEl, customMasks = [], customHighlights = []) {
    if (!rootEl) return;

    // 1. Apply 4-color highlights first
    if (Array.isArray(customHighlights)) {
      const validColors = ["yellow", "amber", "green", "emerald", "cyan", "blue", "red", "pink", "rose", "purple"];
      customHighlights.forEach(hl => {
        if (!hl || !hl.phrase || hl.phrase === "[object Object]") return;
        const cleanP = String(hl.phrase).replace(/\s+/g, " ").trim();
        const occ = typeof hl.occurrence === "number" ? hl.occurrence : 0;
        const color = validColors.includes(hl.color) ? hl.color : "yellow";
        const rawKey = `${cleanP}::${occ}`;
        wrapOccurrenceInDom(rootEl, cleanP, occ, "mark", `user-hl user-highlight user-hl-${color}`, "data-hl-key", rawKey);
      });
    }

    // 2. Apply occurrence-indexed recall masks
    if (Array.isArray(customMasks)) {
      customMasks.forEach(entry => {
        const parsed = parseMaskOrHighlightKey(entry);
        if (!parsed.phrase || parsed.phrase === "[object Object]") return;
        wrapOccurrenceInDom(rootEl, parsed.phrase, parsed.occurrence, "span", "user-recall-mask", "data-mask-key", parsed.key);
      });
    }

    // 3. Tokenize words into .folio-word spans for instant tap & brush-drag painting
    tokenizeFolioWords(rootEl);
  }

  function adjustReaderFontScale(delta) {
    readerFontScale = Math.min(1.35, Math.max(0.84, parseFloat((readerFontScale + delta).toFixed(2))));
    document.documentElement.style.setProperty("--reader-font-scale", String(readerFontScale));
    compendiumZoomScale = readerFontScale;
    const pctBtn = document.getElementById("comp-zoom-pct-btn") || document.getElementById("comp-zoom-badge");
    if (pctBtn) pctBtn.innerText = `${Math.round(readerFontScale * 100)}%`;
    const docEl = document.getElementById("comp-studio-doc-content");
    if (docEl) {
      docEl.style.zoom = Math.abs(readerFontScale - 1.0) < 0.02 ? "" : String(readerFontScale);
    }
    putRecord("store_config", { key: "reader_font_scale", value: readerFontScale });
  }

  function compressImageFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxW = 900;
          if (width > maxW) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.80));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ==========================================================================
   * SECTION 8: LIFO NAVIGATION STACK & MODAL LAYER ROUTER
   * ========================================================================== */
  const navStack = [];

  function pushNavLayer(layerId, closeFn) {
    const idx = navStack.findIndex(l => l.id === layerId);
    if (idx !== -1) navStack.splice(idx, 1);
    navStack.push({ id: layerId, close: closeFn });
    history.pushState({ layerId: layerId, depth: navStack.length }, "");
  }

  function popNavLayer() {
    if (navStack.length > 0) {
      const top = navStack.pop();
      if (top && typeof top.close === "function") {
        top.close();
      }
    }
  }

  function pushHistoryState(name) {
    pushNavLayer(name, () => {
      const el = document.getElementById(name);
      if (el) {
        if (el.classList.contains("modal-overlay")) el.classList.remove("active");
        else el.style.display = "none";
      }
    });
  }

  /* ==========================================================================
   * SECTION 9: HARDENED INDEXEDDB ENGINE
   * ========================================================================== */
  function getDB() {
    if (db) return Promise.resolve(db);
    if (dbInitPromise) return dbInitPromise;

    dbInitPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onblocked = () => {
        if (db) { db.close(); db = null; }
      };

      req.onupgradeneeded = (e) => {
        const d = e.target.result;
        const canonicalStores = [
          { name: "store_questions", key: "id" },
          { name: "store_attempts", key: "sessionId" },
          { name: "store_flashcards", key: "id" },
          { name: "store_concepts", key: "id" },
          { name: "store_notes", key: "id" },
          { name: "store_saved_mocks", key: "id" },
          { name: "store_ai_consultations", key: "id" },
          { name: "store_active_session", key: "id" },
          { name: "store_config", key: "key" }
        ];

        canonicalStores.forEach(s => {
          if (!d.objectStoreNames.contains(s.name)) {
            d.createObjectStore(s.name, { keyPath: s.key });
          }
        });
      };

      req.onsuccess = async (e) => {
        db = e.target.result;
        db.onversionchange = () => {
          if (db) { db.close(); db = null; dbInitPromise = null; }
        };
        try {
          await seedData(db);
        } catch (err) {
          console.warn("Bootstrap notice:", err);
        }
        resolve(db);
      };

      req.onerror = () => {
        dbInitPromise = null;
        reject(req.error);
      };
    });

    return dbInitPromise;
  }

  async function runTx(storeNames, mode, callback) {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(storeNames, mode);
      tx.oncomplete = () => resolve(true);
      tx.onerror = (e) => reject(tx.error || e);
      tx.onabort = (e) => reject(tx.error || e);
      try {
        callback(tx);
      } catch (err) {
        reject(err);
      }
    });
  }

  async function seedData(database) {
    const d = database || await getDB();

    if (d.objectStoreNames.contains("store_flashcards")) {
      try {
        await new Promise((res) => {
          const tx = d.transaction(["store_flashcards"], "readwrite");
          tx.objectStore("store_flashcards").clear();
          tx.oncomplete = () => res(true);
          tx.onerror = () => res(false);
        });
      } catch (e) {}
    }

    const existingCount = await new Promise((res) => {
      try {
        const tx = d.transaction(["store_questions"], "readonly");
        const countReq = tx.objectStore("store_questions").count();
        countReq.onsuccess = () => res(countReq.result || 0);
        countReq.onerror = () => res(0);
      } catch (e) { res(0); }
    });

    if (existingCount === 0) {
      await runTx(["store_questions", "store_concepts", "store_saved_mocks"], "readwrite", (tx) => {
        const stQ = tx.objectStore("store_questions");
        SEED_QUESTIONS.forEach(q => stQ.put(q));

        const stC = tx.objectStore("store_concepts");
        SEED_TOPIC_DOSSIERS.forEach(t => stC.put(t));

        const stB = tx.objectStore("store_saved_mocks");
        SEED_SAVED_MOCKS.forEach(b => stB.put(b));
      });
    }

    const savedMistakeConfig = await getRecord("store_config", "custom_mistake_tags");
    if (savedMistakeConfig && Array.isArray(savedMistakeConfig.value)) {
      customMistakeTags = [...new Set([...customMistakeTags, ...savedMistakeConfig.value])];
    } else {
      await putRecord("store_config", { key: "custom_mistake_tags", value: customMistakeTags });
    }

    const savedTaxonomyConfig = await getRecord("store_config", "system_taxonomy");
    if (savedTaxonomyConfig && savedTaxonomyConfig.value && typeof savedTaxonomyConfig.value === "object") {
      TAXONOMY = savedTaxonomyConfig.value;
    } else {
      TAXONOMY = JSON.parse(JSON.stringify(DEFAULT_TAXONOMY));
      await putRecord("store_config", { key: "system_taxonomy", value: TAXONOMY });
    }
  }

  async function getAllRecords(sName) {
    try {
      const d = await getDB();
      if (!d.objectStoreNames.contains(sName)) return [];
      return new Promise(res => {
        const tx = d.transaction([sName], "readonly");
        const req = tx.objectStore(sName).getAll();
        req.onsuccess = () => res(req.result || []);
        req.onerror = () => res([]);
      });
    } catch (e) { return []; }
  }

  async function getRecord(sName, key) {
    try {
      const d = await getDB();
      if (!d.objectStoreNames.contains(sName)) return null;
      return new Promise(res => {
        const tx = d.transaction([sName], "readonly");
        const req = tx.objectStore(sName).get(key);
        req.onsuccess = () => res(req.result || null);
        req.onerror = () => res(null);
      });
    } catch (e) { return null; }
  }

  async function putRecord(sName, record) {
    try {
      const cleanRecord = JSON.parse(JSON.stringify(record));
      return await runTx([sName], "readwrite", (tx) => {
        tx.objectStore(sName).put(cleanRecord);
      });
    } catch (e) {
      console.error(`Exception writing to ${sName}:`, e);
      return false;
    }
  }

  async function deleteRecordFromStore(sName, key) {
    try {
      return await runTx([sName], "readwrite", (tx) => {
        tx.objectStore(sName).delete(key);
      });
    } catch (e) { return false; }
  }

  async function clearStore(sName) {
    try {
      return await runTx([sName], "readwrite", (tx) => {
        tx.objectStore(sName).clear();
      });
    } catch (e) { return false; }
  }

  /* ==========================================================================
   * SECTION 10: FULL BACKUP (WITH API KEY PRIVACY SHIELD) & SANITIZERS
   * ========================================================================== */
  async function exportFullBackup() {
    const includeKeys = document.getElementById("backup-include-api-keys")?.checked ?? false;
    let configRecords = await getAllRecords("store_config");
    if (!includeKeys) {
      configRecords = configRecords.filter(r => r.key !== "ai_api_key_vault");
    }

    const envelope = {
      cgl_os_envelope: {
        magic_header: "CGL_INTELLIGENCE_OS_BACKUP",
        engine_version: DB_VERSION,
        exported_at: Date.now(),
        exported_ist: formatISTDate(Date.now()),
        exported_date: new Date().toISOString()
      },
      stores: {
        store_questions: await getAllRecords("store_questions"),
        store_attempts: await getAllRecords("store_attempts"),
        store_concepts: await getAllRecords("store_concepts"),
        store_notes: await getAllRecords("store_notes"),
        store_saved_mocks: await getAllRecords("store_saved_mocks"),
        store_ai_consultations: await getAllRecords("store_ai_consultations"),
        store_config: configRecords
      }
    };

    const filename = `cgl_os_backup_${Date.now()}.json`;
    await downloadFileResilient(filename, "application/json", JSON.stringify(envelope, null, 2));
  }

  function openBackupRestoreModal() {
    pendingHydrationData = null;
    safeSetValue("restore-backup-file-input", "");
    const execBtn = document.getElementById("btn-execute-restore");
    if (execBtn) execBtn.disabled = true;
    safeSetDisplay("restore-file-preview-stats", "none");
    pushHistoryState("modal-backup-restore");
    const m = document.getElementById("modal-backup-restore");
    if (m) m.classList.add("active");
  }

  function handleBackupFileSelect(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        pendingHydrationData = normalizeBackupStructure(parsed);

        const statsBox = document.getElementById("restore-file-preview-stats");
        if (statsBox) {
          statsBox.style.display = "block";
          statsBox.innerHTML = `
            <b>Backup File Validated:</b><br>
            \u2022 Questions: ${pendingHydrationData.store_questions.length}<br>
            \u2022 Attempts & Scores: ${pendingHydrationData.store_attempts.length}<br>
            \u2022 Living Knowledge Sheets: ${pendingHydrationData.store_concepts.length}<br>
            \u2022 Clinical AI Consultations: ${pendingHydrationData.store_ai_consultations.length}<br>
            \u2022 Saved Blueprints & Papers: ${pendingHydrationData.store_saved_mocks.length}
          `;
        }
        const execBtn = document.getElementById("btn-execute-restore");
        if (execBtn) execBtn.disabled = false;
      } catch (err) {
        alert("Corrupted Backup File: " + err.message);
        const execBtn = document.getElementById("btn-execute-restore");
        if (execBtn) execBtn.disabled = true;
      }
    };
    reader.readAsText(file);
  }

  function normalizeBackupStructure(raw) {
    let stores = {};
    if (raw.cgl_os_envelope && raw.stores) {
      stores = raw.stores;
    } else if (raw.cgl_os_knowledge_export && Array.isArray(raw.concepts)) {
      stores.store_concepts = raw.concepts;
    } else if (Array.isArray(raw)) {
      stores.store_questions = raw;
    } else {
      stores.store_questions = raw.questions || raw.masterQuestionBank || raw.store_questions || [];
      stores.store_attempts = raw.attempts || raw.store_attempts || [];
      stores.store_concepts = raw.concepts || raw.knowledgeCompendium || raw.formulas || raw.store_concepts || [];
      stores.store_notes = raw.notes || raw.store_notes || [];
      stores.store_saved_mocks = raw.savedMocks || raw.store_saved_mocks || [];
      stores.store_ai_consultations = raw.consultations || raw.recentConsultations || raw.store_ai_consultations || [];
      stores.store_config = raw.config || raw.store_config || [];
    }

    stores.store_questions = (stores.store_questions || []).map(sanitizeQuestion);
    stores.store_concepts = (stores.store_concepts || []).map(sanitizeDossier);
    stores.store_attempts = (stores.store_attempts || []).map(sanitizeAttempt);
    stores.store_saved_mocks = (stores.store_saved_mocks || []).map(sanitizeSavedMock);
    stores.store_ai_consultations = stores.store_ai_consultations || [];
    stores.store_notes = stores.store_notes || [];
    stores.store_config = stores.store_config || [];

    return stores;
  }

  function sanitizeQuestion(q, idx = 0) {
    let conceptIds = [];
    if (Array.isArray(q.conceptIds) && q.conceptIds.length > 0) {
      conceptIds = q.conceptIds.map(s => String(s).trim()).filter(Boolean);
    }
    if (q.conceptId && typeof q.conceptId === "string" && q.conceptId.trim().length > 0) {
      const single = q.conceptId.trim();
      if (!conceptIds.includes(single)) {
        conceptIds.unshift(single);
      }
    }

    return {
      id: q.id || `q_manual_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 5)}`,
      subject: q.subject || "QA",
      chapter: q.chapter || "QA_GENERAL",
      subtopic: cleanMojibake(q.subtopic || ""),
      method: cleanMojibake(q.method || ""),
      parentPassageId: q.parentPassageId || null,
      passageText: stripCitationArtifacts(cleanMojibake(q.passageText || "")),
      setOrder: typeof q.setOrder === "number" ? q.setOrder : 1,
      setTotal: typeof q.setTotal === "number" ? q.setTotal : 1,
      conceptId: conceptIds[0] || "",
      conceptIds: conceptIds,
      remediatesQuestionId: q.remediatesQuestionId || null,
      ephemeral: !!q.ephemeral,
      questionText: stripCitationArtifacts(cleanMojibake(q.questionText || "")),
      imageUrl: q.imageUrl || "",
      options: Array.isArray(q.options) && q.options.length === 4
        ? q.options.map(o => stripCitationArtifacts(cleanMojibake(String(o))))
        : ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctIndex: (typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3) ? q.correctIndex : 0,
      explanation: stripCitationArtifacts(cleanMojibake(q.explanation || "")),
      source: cleanMojibake(q.source || "Manual Entry"),
      difficulty: q.difficulty || "MEDIUM",
      tags: Array.isArray(q.tags) ? q.tags : ["Hydrated"],
      bookmarked: !!q.bookmarked,
      annotation: cleanMojibake(q.annotation || ""),
      createdAt: q.createdAt || Date.now(),
      updatedAt: Date.now()
    };
  }

  function sanitizeDossier(d, idx = 0) {
    return {
      id: d.id || `top_restored_${Date.now()}_${idx}`,
      subject: d.subject || "QA",
      chapter: d.chapter || "QA_GENERAL",
      title: stripCitationArtifacts(cleanMojibake(d.title || d.word || "Untitled Topic")),
      subtitle: stripCitationArtifacts(cleanMojibake(d.subtitle || d.root || "")),
      content: stripCitationArtifacts(cleanMojibake(d.content || d.meaning || "")),
      imageUrl: d.imageUrl || "",
      tags: Array.isArray(d.tags) ? d.tags : [],
      timestamp: d.timestamp || Date.now(),
      updatedAt: Date.now()
    };
  }

  function sanitizeAttempt(a, idx = 0) {
    const epoch = a.timestamp || Date.now();
    return {
      sessionId: a.sessionId || `mock_${epoch}_${idx}`,
      parentSessionId: a.parentSessionId || null,
      attemptNumber: typeof a.attemptNumber === "number" ? a.attemptNumber : 1,
      title: cleanMojibake(a.title || "SSC CGL Practice Mock"),
      timestamp: epoch,
      timeIST: a.timeIST || formatISTDate(epoch),
      diurnalSlot: a.diurnalSlot || getDiurnalSlot(epoch),
      mockType: a.mockType || "CUSTOM",
      positiveMarks: typeof a.positiveMarks === "number" ? a.positiveMarks : 2.0,
      negativeMarks: typeof a.negativeMarks === "number" ? a.negativeMarks : 0.5,
      signatureTag: a.signatureTag || "",
      finalScore: typeof a.finalScore === "number" ? a.finalScore : 0,
      correctCount: typeof a.correctCount === "number" ? a.correctCount : 0,
      incorrectCount: typeof a.incorrectCount === "number" ? a.incorrectCount : 0,
      q4Traps: typeof a.q4Traps === "number" ? a.q4Traps : 0,
      penaltyDrag: typeof a.penaltyDrag === "number" ? a.penaltyDrag : 0,
      switchDelta: typeof a.switchDelta === "number" ? a.switchDelta : 0,
      completed: a.completed !== undefined ? a.completed : true,
      isSectionLocked: !!a.isSectionLocked,
      questions: Array.isArray(a.questions) ? a.questions.map(sanitizeQuestion) : [],
      userResponses: (a.userResponses && typeof a.userResponses === "object") ? a.userResponses : {},
      sections: Array.isArray(a.sections) ? a.sections : []
    };
  }

  function sanitizeSavedMock(b, idx = 0) {
    return {
      id: b.id || `preset_${Date.now()}_${idx}`,
      type: b.type || (b.questions ? "FIXED_PAPER" : "DYNAMIC_BLUEPRINT"),
      title: cleanMojibake(b.title || `Saved Setup ${idx + 1}`),
      isSectionLocked: b.isSectionLocked !== undefined ? b.isSectionLocked : true,
      positiveMarks: typeof b.positiveMarks === "number" ? b.positiveMarks : 2.0,
      negativeMarks: typeof b.negativeMarks === "number" ? b.negativeMarks : 0.5,
      selectionRule: b.selectionRule || null,
      sections: Array.isArray(b.sections) ? b.sections : [{ id: 1, subject: "QA", count: 25, durationMin: 15 }],
      questions: Array.isArray(b.questions) ? b.questions.map(sanitizeQuestion) : null,
      createdAt: b.createdAt || Date.now(),
      updatedAt: Date.now()
    };
  }

  async function executeHydrationRestore() {
    if (!pendingHydrationData) return;
    const modeEl = document.getElementById("restore-hydration-mode");
    const mode = modeEl ? modeEl.value : "SAFE_MERGE";

    try {
      const storeKeys = [
        "store_questions", "store_attempts", "store_concepts",
        "store_notes", "store_saved_mocks", "store_ai_consultations", "store_config"
      ];

      if (mode === "WIPE_REPLACE") {
        for (const sName of storeKeys) {
          if (sName === "store_config") {
            const existingVault = await getRecord("store_config", "ai_api_key_vault");
            await clearStore(sName);
            if (existingVault) await putRecord("store_config", existingVault);
          } else {
            await clearStore(sName);
          }
        }
      }

      for (const sName of storeKeys) {
        const items = pendingHydrationData[sName] || [];
        if (items.length > 0) {
          await runTx([sName], "readwrite", (tx) => {
            const st = tx.objectStore(sName);
            items.forEach(item => st.put(item));
          });
        }
      }

      alert("Disaster Recovery Complete! All records hydrated and sanitized.");
      const modal = document.getElementById("modal-backup-restore");
      if (modal) modal.classList.remove("active");
      SearchService.invalidate();
      await AiGatewayService.loadVault();
      await syncAllTaxonomyDropdowns();
      await renderDashboard();
      if (typeof renderPracticeQuestionsTable === "function") {
        await renderPracticeQuestionsTable();
      }
    } catch (err) {
      alert("Hydration Error: " + err.message);
    }
  }

  /* ==========================================================================
   * SECTION 11: SHARED SERVICE — TAXONOMY SERVICE
   * ========================================================================== */
  const TaxonomyService = {
    async getTaxonomy() {
      const rec = await getRecord("store_config", "system_taxonomy");
      if (rec && rec.value && typeof rec.value === "object") {
        TAXONOMY = rec.value;
      }
      return TAXONOMY;
    },

    async saveTaxonomy() {
      await putRecord("store_config", { key: "system_taxonomy", value: TAXONOMY });
      SearchService.invalidate();
      await syncAllTaxonomyDropdowns();
    },

    async addSubject(key, name) {
      const cleanKey = String(key).trim().toUpperCase().replace(/\s+/g, "_");
      const cleanName = String(name).trim();
      if (!cleanKey || !cleanName) throw new Error("Both Key and Full Name are required.");
      if (TAXONOMY[cleanKey]) throw new Error(`Subject ${cleanKey} already exists.`);

      const maxOrder = Math.max(0, ...Object.values(TAXONOMY).map(s => s.order || 0));
      TAXONOMY[cleanKey] = {
        name: cleanName,
        order: maxOrder + 1,
        chapters: [`${cleanKey}_GENERAL`]
      };
      await this.saveTaxonomy();
      return TAXONOMY[cleanKey];
    },

    async renameSubject(key, newName) {
      if (!TAXONOMY[key]) throw new Error(`Subject ${key} not found.`);
      TAXONOMY[key].name = String(newName).trim();
      await this.saveTaxonomy();
    },

    async deleteSubject(key) {
      if (!TAXONOMY[key]) throw new Error(`Subject ${key} not found.`);
      const allQs = await getAllRecords("store_questions");
      const qCount = allQs.filter(q => q.subject === key).length;
      const allConcepts = await getAllRecords("store_concepts");
      const cCount = allConcepts.filter(c => c.subject === key).length;

      if (qCount > 0 || cCount > 0) {
        throw new Error(`Cannot delete subject ${key}. It contains ${qCount} questions and ${cCount} sheets. Reassign them first.`);
      }

      delete TAXONOMY[key];
      await this.saveTaxonomy();
    },

    async addChapter(subKey, chapterName) {
      if (!TAXONOMY[subKey]) throw new Error(`Subject ${subKey} does not exist.`);
      const cleanChap = String(chapterName).trim().toUpperCase().replace(/\s+/g, "_");
      if (!cleanChap) throw new Error("Chapter name cannot be empty.");
      if (!TAXONOMY[subKey].chapters.includes(cleanChap)) {
        TAXONOMY[subKey].chapters.push(cleanChap);
        await this.saveTaxonomy();
      }
      return cleanChap;
    },

    async renameChapter(subKey, oldChap, newChap) {
      if (!TAXONOMY[subKey]) throw new Error(`Subject ${subKey} does not exist.`);
      const cleanNew = String(newChap).trim().toUpperCase().replace(/\s+/g, "_");
      if (!cleanNew) throw new Error("New chapter name cannot be empty.");
      if (!TAXONOMY[subKey].chapters.includes(oldChap)) throw new Error(`Chapter ${oldChap} does not exist.`);

      const idx = TAXONOMY[subKey].chapters.indexOf(oldChap);
      TAXONOMY[subKey].chapters[idx] = cleanNew;
      await this.saveTaxonomy();
      await this.reassignChapterContent(subKey, oldChap, cleanNew);
    },

    async deleteChapter(subKey, chap, action = "PRESERVE_UNASSIGNED", targetChap = null) {
      if (!TAXONOMY[subKey]) throw new Error(`Subject ${subKey} does not exist.`);
      TAXONOMY[subKey].chapters = TAXONOMY[subKey].chapters.filter(c => c !== chap);
      await this.saveTaxonomy();

      if (action === "MERGE" && targetChap) {
        await this.reassignChapterContent(subKey, chap, targetChap);
      } else if (action === "PRESERVE_UNASSIGNED") {
        const unassignedChap = `${subKey}_UNASSIGNED`;
        if (!TAXONOMY[subKey].chapters.includes(unassignedChap)) {
          TAXONOMY[subKey].chapters.push(unassignedChap);
          await this.saveTaxonomy();
        }
        await this.reassignChapterContent(subKey, chap, unassignedChap);
      }
    },

    async mergeChapters(subKey, sourceChap, targetChap) {
      if (!TAXONOMY[subKey]) throw new Error(`Subject ${subKey} does not exist.`);
      if (!TAXONOMY[subKey].chapters.includes(targetChap)) {
        throw new Error(`Target chapter ${targetChap} does not exist in ${subKey}.`);
      }

      await this.reassignChapterContent(subKey, sourceChap, targetChap);
      TAXONOMY[subKey].chapters = TAXONOMY[subKey].chapters.filter(c => c !== sourceChap);
      await this.saveTaxonomy();
    },

    async reassignChapterContent(subKey, fromChap, toChap) {
      const allQs = await getAllRecords("store_questions");
      const affectedQs = allQs.filter(q => q.subject === subKey && q.chapter === fromChap);
      for (const q of affectedQs) {
        q.chapter = toChap;
        q.updatedAt = Date.now();
        await putRecord("store_questions", q);
      }

      const allConcepts = await getAllRecords("store_concepts");
      const affectedConcepts = allConcepts.filter(c => c.subject === subKey && c.chapter === fromChap);
      for (const c of affectedConcepts) {
        c.chapter = toChap;
        c.updatedAt = Date.now();
        await putRecord("store_concepts", c);
      }

      SearchService.invalidate();
    }
  };

  /* ==========================================================================
   * SECTION 12: SHARED SERVICE — QUESTION SERVICE
   * ========================================================================== */
  const QuestionService = {
    generateId(subject = "QA") {
      const prefix = String(subject).toLowerCase();
      return `q_manual_${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    },

    validate(q) {
      if (!q.questionText || !String(q.questionText).trim()) {
        throw new Error("Question text cannot be empty.");
      }
      if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some(o => !String(o).trim())) {
        throw new Error("Questions must contain exactly 4 non-empty options.");
      }
      if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3) {
        throw new Error("A valid correct answer option (0-3) must be designated.");
      }
      if (!q.subject || !q.chapter) {
        throw new Error("Subject and Chapter tags are mandatory.");
      }
      return true;
    },

    async get(id) {
      return await getRecord("store_questions", id);
    },

    async getByPassageId(parentPassageId) {
      if (!parentPassageId) return [];
      const all = await getAllRecords("store_questions");
      return all
        .filter(q => q.parentPassageId === parentPassageId)
        .sort((a, b) => (a.setOrder || 1) - (b.setOrder || 1));
    },

    async create(questionData) {
      const sanitized = sanitizeQuestion(questionData);
      this.validate(sanitized);

      const existing = await getRecord("store_questions", sanitized.id);
      if (existing) {
        throw new Error(`A question with ID '${sanitized.id}' already exists.`);
      }

      await putRecord("store_questions", sanitized);
      SearchService.invalidate();
      return sanitized;
    },

    async update(id, questionData) {
      const existing = await getRecord("store_questions", id);
      if (!existing) throw new Error(`Question ${id} not found.`);

      const merged = { ...existing, ...questionData, id: id };
      if (questionData.conceptId !== undefined && questionData.conceptIds === undefined) {
        merged.conceptIds = questionData.conceptId ? [String(questionData.conceptId).trim()] : [];
      }

      const updated = sanitizeQuestion(merged);
      this.validate(updated);

      await putRecord("store_questions", updated);
      SearchService.invalidate();
      return updated;
    },

    async toggleStar(id) {
      const existing = await getRecord("store_questions", id);
      if (!existing) return null;
      existing.bookmarked = !existing.bookmarked;
      existing.updatedAt = Date.now();
      await putRecord("store_questions", existing);
      SearchService.invalidate();
      return existing;
    },

    async delete(id) {
      const existing = await getRecord("store_questions", id);
      if (!existing) throw new Error(`Question ${id} not found.`);

      await deleteRecordFromStore("store_questions", id);
      SearchService.invalidate();
      return { id: id, deleted: true };
    },

    async duplicate(id) {
      const source = await getRecord("store_questions", id);
      if (!source) throw new Error(`Question ${id} not found.`);

      const clone = JSON.parse(JSON.stringify(source));
      clone.id = this.generateId(clone.subject);
      clone.source = `${source.source || "Original"} (Variant)`;
      clone.annotation = `Cloned from ${id} on ${formatISTDate(Date.now())}`;
      clone.createdAt = Date.now();
      clone.updatedAt = Date.now();

      await putRecord("store_questions", clone);
      SearchService.invalidate();
      return clone;
    },

    async bulkCreate(questionsArray, provenance = "SOURCE") {
      if (!Array.isArray(questionsArray)) throw new Error("Expected array of questions.");
      const sanitizedList = questionsArray.map((q, idx) => {
        const item = sanitizeQuestion(q, idx);
        if (provenance) item.source = item.source || provenance;
        this.validate(item);
        return item;
      });

      await runTx(["store_questions"], "readwrite", (tx) => {
        const st = tx.objectStore("store_questions");
        sanitizedList.forEach(q => st.put(q));
      });

      SearchService.invalidate();
      return sanitizedList.length;
    }
  };

  /* ==========================================================================
   * SECTION 13: SHARED SERVICE — CONCEPT SERVICE (LIVING KNOWLEDGE STUDIO)
   * ========================================================================== */
  const ConceptService = {
    async get(id) {
      return await getRecord("store_concepts", id);
    },

    async getAll() {
      return await getAllRecords("store_concepts");
    },

    async create(conceptData) {
      const sanitized = sanitizeDossier(conceptData);
      if (!sanitized.title.trim() || !sanitized.content.trim()) {
        throw new Error("Title and Markdown content are mandatory.");
      }
      await putRecord("store_concepts", sanitized);
      SearchService.invalidate();
      return sanitized;
    },

    async update(id, conceptData) {
      const existing = await getRecord("store_concepts", id);
      if (!existing) throw new Error(`Concept sheet ${id} not found.`);

      const updated = sanitizeDossier({ ...existing, ...conceptData, id: id });
      await putRecord("store_concepts", updated);
      SearchService.invalidate();
      return updated;
    },

    async delete(id) {
      await deleteRecordFromStore("store_concepts", id);
      SearchService.invalidate();
      return true;
    },

    async getLinkedQuestions(conceptId, chapterFallback = null) {
      const allQs = await getAllRecords("store_questions");
      let linked = allQs.filter(q =>
        (Array.isArray(q.conceptIds) && q.conceptIds.includes(conceptId)) ||
        q.conceptId === conceptId
      );

      if (linked.length === 0 && chapterFallback) {
        linked = allQs.filter(q => q.chapter === chapterFallback);
      }
      return linked;
    },

    generateTOC(content) {
      if (!content) return [];
      const lines = content.split("\n");
      const toc = [];
      lines.forEach(line => {
        const h3 = line.match(/^###\s+(.+)$/);
        const h2 = line.match(/^##\s+(.+)$/);
        if (h3) {
          toc.push({ level: 3, title: h3[1].trim(), anchor: "sec-" + h3[1].toLowerCase().replace(/[^a-z0-9]+/g, "-") });
        } else if (h2) {
          toc.push({ level: 2, title: h2[1].trim(), anchor: "sec-" + h2[1].toLowerCase().replace(/[^a-z0-9]+/g, "-") });
        }
      });
      return toc;
    }
  };

  /* ==========================================================================
   * SECTION 14: SHARED SERVICE — SEARCH SERVICE
   * ========================================================================== */
  const SearchService = {
    cache: {
      questions: null,
      concepts: null,
      lastIndexed: 0
    },

    invalidate() {
      this.cache.questions = null;
      this.cache.concepts = null;
      this.cache.lastIndexed = 0;
    },

    async warmCache() {
      if (!this.cache.questions) {
        this.cache.questions = await getAllRecords("store_questions");
      }
      if (!this.cache.concepts) {
        this.cache.concepts = await getAllRecords("store_concepts");
      }
      this.cache.lastIndexed = Date.now();
    },

    async searchAll(queryStr, filters = {}, limit = 50) {
      await this.warmCache();
      const term = String(queryStr || "").trim().toLowerCase();

      const matchedQuestions = this.filterQuestions(this.cache.questions, term, filters).slice(0, limit);
      const matchedConcepts = this.filterConcepts(this.cache.concepts, term, filters).slice(0, limit);

      return {
        query: queryStr,
        totalQuestions: matchedQuestions.length,
        totalConcepts: matchedConcepts.length,
        questions: matchedQuestions,
        concepts: matchedConcepts
      };
    },

    filterQuestions(pool, term, filters) {
      return pool.filter(q => {
        if (filters.subject && filters.subject !== "ALL" && q.subject !== filters.subject) return false;
        if (filters.chapter && filters.chapter !== "ALL" && q.chapter !== filters.chapter) return false;
        if (filters.method && filters.method !== "ALL" && q.method !== filters.method) return false;
        if (filters.source && filters.source !== "ALL" && q.source !== filters.source) return false;
        if (filters.difficulty && filters.difficulty !== "ALL" && q.difficulty !== filters.difficulty) return false;
        if (filters.bookmarked === true && !q.bookmarked) return false;

        if (term) {
          const inId = (q.id || "").toLowerCase().includes(term);
          const inText = (q.questionText || "").toLowerCase().includes(term);
          const inPassage = (q.passageText || "").toLowerCase().includes(term);
          const inExp = (q.explanation || "").toLowerCase().includes(term);
          const inSubtopic = (q.subtopic || "").toLowerCase().includes(term);
          const inMethod = (q.method || "").toLowerCase().includes(term);
          const inOpts = Array.isArray(q.options) && q.options.some(o => (o || "").toLowerCase().includes(term));
          const inTags = Array.isArray(q.tags) && q.tags.some(t => (t || "").toLowerCase().includes(term));
          if (!inId && !inText && !inPassage && !inExp && !inSubtopic && !inMethod && !inOpts && !inTags) return false;
        }

        return true;
      });
    },

    filterConcepts(pool, term, filters) {
      return pool.filter(c => {
        if (filters.subject && filters.subject !== "ALL" && c.subject !== filters.subject) return false;
        if (filters.chapter && filters.chapter !== "ALL" && c.chapter !== filters.chapter) return false;

        if (term) {
          const inId = (c.id || "").toLowerCase().includes(term);
          const inTitle = (c.title || "").toLowerCase().includes(term);
          const inSub = (c.subtitle || "").toLowerCase().includes(term);
          const inContent = (c.content || "").toLowerCase().includes(term);
          const inChap = (c.chapter || "").toLowerCase().includes(term);
          if (!inId && !inTitle && !inSub && !inContent && !inChap) return false;
        }

        return true;
      });
    }
  };

  /* ==========================================================================
   * SECTION 14B: PRIORITY WATERFALL API KEY VAULT & MICRO-TASK ROUTER
   * - Local storage in store_config ("ai_api_key_vault")
   * - Priority Tiers: HIGH ➔ MEDIUM ➔ LOW with Round-Robin + Reordering
   * - Task-Specific Key Allocation & Manual Key Override per UI action
   * - Auto-repair of JSON/LaTeX backslashes + Graceful Clipboard Degradation
   * ========================================================================== */
  const AiGatewayService = {
    keys: [],
    taskRoutes: {
      SHORTCUT: "WATERFALL_AUTO",
      MUTANT: "WATERFALL_AUTO",
      SMART_PARSE: "WATERFALL_AUTO",
      SHEET_EDIT: "WATERFALL_AUTO"
    },
    roundRobinIndex: 0,

    async loadVault() {
      const rec = await getRecord("store_config", "ai_api_key_vault");
      if (rec && rec.value && typeof rec.value === "object") {
        this.keys = Array.isArray(rec.value.keys) ? rec.value.keys : [];
        if (rec.value.taskRoutes) {
          this.taskRoutes = { ...this.taskRoutes, ...rec.value.taskRoutes };
        }
      }
      renderApiVaultUI();
      return this.keys;
    },

    async saveVault() {
      await putRecord("store_config", {
        key: "ai_api_key_vault",
        value: {
          keys: this.keys,
          taskRoutes: this.taskRoutes
        }
      });
      renderApiVaultUI();
    },

    repairAiJson(rawText) {
      if (!rawText) throw new Error("Empty AI response.");
      let cleaned = String(rawText).trim();
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }

      try {
        return JSON.parse(cleaned);
      } catch (initialErr) {
        // Auto-heal unescaped LaTeX backslashes inside JSON string literals
        const healed = cleaned.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
        return JSON.parse(healed);
      }
    },

    isKeyRestedAndUnderRpm(k, now) {
      if (!k || k.enabled === false) return { ready: false, reason: "DISABLED" };
      if (k.cooldownUntil && k.cooldownUntil > now) return { ready: false, reason: "COOLDOWN" };

      if (!Array.isArray(k.requestTimestamps)) k.requestTimestamps = [];
      k.requestTimestamps = k.requestTimestamps.filter(ts => now - ts < 60000);

      const maxRpm = k.maxRpm || ((k.provider || "GEMINI").toUpperCase() === "GROQ" ? 20 : 10);
      if (k.requestTimestamps.length >= maxRpm) {
        k.cooldownUntil = k.requestTimestamps[0] + 61000;
        k.lastStatus = "RPM_CAP";
        return { ready: false, reason: "RPM_CAP" };
      }

      const minGapMs = (k.minGapSec || 6) * 1000;
      if (k.lastUsedEpoch && (now - k.lastUsedEpoch) < minGapMs) {
        return { ready: false, reason: "BREATHER" };
      }

      return { ready: true, reason: "READY" };
    },

    buildOrderedKeyQueue(taskType, manualKeyId = null) {
      const now = Date.now();
      const restedQueue = [];
      const breatherFallbackQueue = [];
      const seen = new Set();

      const considerKey = (k, forceImmediate = false) => {
        if (!k || seen.has(k.id) || k.enabled === false) return;
        if (k.cooldownUntil && k.cooldownUntil > now && !forceImmediate) return;

        const check = this.isKeyRestedAndUnderRpm(k, now);
        if (check.ready || forceImmediate) {
          seen.add(k.id);
          restedQueue.push(k);
        } else if (check.reason === "BREATHER") {
          seen.add(k.id);
          breatherFallbackQueue.push(k);
        }
      };

      // 1. Explicit Manual Override from UI Dropdown
      if (manualKeyId && manualKeyId !== "WATERFALL_AUTO") {
        const manualKey = this.keys.find(k => k.id === manualKeyId);
        if (manualKey) considerKey(manualKey, true);
      }

      // 2. Task-Specific Allocated Key
      const mappedId = this.taskRoutes[taskType];
      if (mappedId && mappedId !== "WATERFALL_AUTO") {
        const taskKey = this.keys.find(k => k.id === mappedId);
        if (taskKey) considerKey(taskKey, false);
      }

      // 3. Strict Top-Down Priority Waterfall (#1 to #N within HIGH -> MEDIUM -> LOW, no round-robin rotation!)
      const tierOrder = taskType === "SHEET_EDIT"
        ? ["LOW", "MEDIUM", "HIGH"]
        : ["HIGH", "MEDIUM", "LOW"];

      tierOrder.forEach(tier => {
        const tierKeys = this.keys.filter(k => k.priority === tier);
        for (let i = 0; i < tierKeys.length; i++) {
          considerKey(tierKeys[i], false);
        }
      });

      return [...restedQueue, ...breatherFallbackQueue];
    },

    async callSingleProviderKey(keyObj, systemPrompt, userPrompt, expectJson = false) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const provider = (keyObj.provider || "GEMINI").toUpperCase();
        const model = (keyObj.model || "gemini-2.5-flash").trim();
        const secret = (keyObj.secret || "").trim();

        const now = Date.now();
        keyObj.lastUsedEpoch = now;
        if (!Array.isArray(keyObj.requestTimestamps)) keyObj.requestTimestamps = [];
        keyObj.requestTimestamps = keyObj.requestTimestamps.filter(ts => now - ts < 60000);
        keyObj.requestTimestamps.push(now);

        if (provider === "GEMINI") {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(secret)}`;
          const body = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              temperature: expectJson ? 0.25 : 0.4
            }
          };
          if (expectJson) {
            body.generationConfig.responseMimeType = "application/json";
          }

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal
          });

          if (!res.ok) {
            const retryHeader = res.headers ? res.headers.get("Retry-After") : null;
            const errTxt = await res.text();
            const err = new Error(`HTTP ${res.status}: ${errTxt.slice(0, 120)}`);
            err.status = res.status;
            if (retryHeader && !isNaN(parseInt(retryHeader, 10))) {
              err.retryAfterSec = parseInt(retryHeader, 10);
            }
            throw err;
          }
          const data = await res.json();
          const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (!textOut) throw new Error("Empty response from Gemini API.");
          return textOut;
        } else {
          // GROQ, OPENROUTER, or CUSTOM OpenAI-Compatible Endpoint
          let endpoint = "https://api.groq.com/openai/v1/chat/completions";
          if (provider === "OPENROUTER") endpoint = "https://openrouter.ai/api/v1/chat/completions";
          else if (provider === "CUSTOM" && keyObj.customUrl) endpoint = keyObj.customUrl.trim();

          const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${secret}`
          };

          const body = {
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: expectJson ? 0.2 : 0.4
          };

          const res = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
            signal: controller.signal
          });

          if (!res.ok) {
            const retryHeader = res.headers ? res.headers.get("Retry-After") : null;
            const errTxt = await res.text();
            const err = new Error(`HTTP ${res.status}: ${errTxt.slice(0, 120)}`);
            err.status = res.status;
            if (retryHeader && !isNaN(parseInt(retryHeader, 10))) {
              err.retryAfterSec = parseInt(retryHeader, 10);
            }
            throw err;
          }
          const data = await res.json();
          const textOut = data?.choices?.[0]?.message?.content || "";
          if (!textOut) throw new Error("Empty response from OpenAI-compatible API.");
          return textOut;
        }
      } finally {
        clearTimeout(timeoutId);
      }
    },

    async executeMicroTask({ taskType = "SHORTCUT", systemPrompt, userPrompt, expectJson = false, validatorFn = null, manualKeyId = null }) {
      const queue = this.buildOrderedKeyQueue(taskType, manualKeyId);

      if (queue.length === 0) {
        const clipPayload = `${systemPrompt}\n\n${userPrompt}`;
        try { await navigator.clipboard.writeText(clipPayload); } catch (e) {}
        throw new Error("No active API keys available (or all on cooldown). Prompt copied to your clipboard for manual Gemini Chat!");
      }

      let lastError = null;
      for (const keyObj of queue) {
        try {
          const rawText = await this.callSingleProviderKey(keyObj, systemPrompt, userPrompt, expectJson);
          let parsedData = rawText;

          if (expectJson) {
            parsedData = this.repairAiJson(rawText);
            if (typeof validatorFn === "function") {
              validatorFn(parsedData);
            }
          }

          keyObj.lastSuccessEpoch = Date.now();
          keyObj.cooldownUntil = 0;
          keyObj.lastStatus = "READY";
          await this.saveVault();

          return {
            success: true,
            data: parsedData,
            rawText: rawText,
            sourceLabel: `${keyObj.label} (${keyObj.provider} \u2022 ${keyObj.model})`,
            keyId: keyObj.id
          };
        } catch (err) {
          lastError = err;
          keyObj.lastError = err.message;
          const isRateLimit = err.status === 429 || /429|rate|quota|exhausted/i.test(err.message);
          const cooldownSec = err.retryAfterSec || (isRateLimit ? 65 : 30);
          keyObj.cooldownUntil = Date.now() + (cooldownSec * 1000);
          keyObj.lastStatus = "COOLDOWN";
          console.warn(`Waterfall failover: Key '${keyObj.label}' failed (${err.message}). Cooldown ${cooldownSec}s. Trying next key...`);
        }
      }

      await this.saveVault();
      const clipPayload = `${systemPrompt}\n\n${userPrompt}`;
      try { await navigator.clipboard.writeText(clipPayload); } catch (e) {}
      throw new Error(`All tried API keys failed (${lastError ? lastError.message : "Rate limit"}). Prompt copied to clipboard for manual chat!`);
    }
  };

  let editingApiKeyId = null;
  let revealedApiKeyIds = new Set();

  function maskSecretKey(secret) {
    const s = String(secret || "").trim();
    if (!s) return "••••••••";
    if (s.length <= 10) return s.slice(0, 3) + "••••" + s.slice(-2);
    return s.slice(0, 6) + "••••••••••••" + s.slice(-4);
  }

  function toggleApiKeyInputVisibility() {
    const input = document.getElementById("api-key-secret");
    const btn = document.getElementById("btn-toggle-api-secret-vis");
    if (!input) return;
    const isNowText = input.type === "password";
    input.type = isNowText ? "text" : "password";
    if (btn) {
      btn.innerText = isNowText ? "🙈 Hide" : "👁️ Show";
      btn.classList.toggle("btn-cyan", isNowText);
      btn.classList.toggle("btn-secondary", !isNowText);
    }
  }

  function toggleSavedApiKeyReveal(id) {
    if (revealedApiKeyIds.has(id)) {
      revealedApiKeyIds.delete(id);
    } else {
      revealedApiKeyIds.add(id);
    }
    renderApiVaultUI();
  }

  async function copySavedApiKeySecret(id) {
    const k = AiGatewayService.keys.find(item => item.id === id);
    if (!k || !k.secret) return;
    try {
      await navigator.clipboard.writeText(k.secret);
    } catch (_) {}
  }

  function editApiKeyInVault(id) {
    const k = AiGatewayService.keys.find(item => item.id === id);
    if (!k) return;

    editingApiKeyId = k.id;
    safeSetValue("api-key-label", k.label || "");
    safeSetValue("api-key-provider", k.provider || "GEMINI");
    const customWrap = document.getElementById("api-custom-url-wrap");
    if (customWrap) customWrap.style.display = k.provider === "CUSTOM" ? "block" : "none";
    safeSetValue("api-key-model", k.model || "gemini-2.5-flash");
    safeSetValue("api-key-priority", k.priority || "MEDIUM");
    safeSetValue("api-key-custom-url", k.customUrl || "");
    safeSetValue("api-key-secret", k.secret || "");

    const titleEl = document.getElementById("api-form-header-title");
    if (titleEl) {
      titleEl.innerText = `✎ Editing Key: ${k.label}`;
      titleEl.style.color = "var(--status-amber)";
    }
    const saveBtn = document.getElementById("btn-save-api-key");
    if (saveBtn) {
      saveBtn.innerText = "💾 Update Key";
      saveBtn.className = "btn btn-emerald";
    }
    const cancelBtn = document.getElementById("btn-cancel-api-key-edit");
    if (cancelBtn) cancelBtn.style.display = "inline-flex";

    const formCard = document.getElementById("api-key-form-card");
    if (formCard) {
      formCard.style.borderColor = "var(--status-amber)";
      formCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function cancelApiKeyEdit() {
    editingApiKeyId = null;
    safeSetValue("api-key-label", "");
    safeSetValue("api-key-secret", "");
    safeSetValue("api-key-custom-url", "");

    const secretInput = document.getElementById("api-key-secret");
    const visBtn = document.getElementById("btn-toggle-api-secret-vis");
    if (secretInput) secretInput.type = "password";
    if (visBtn) {
      visBtn.innerText = "👁️ Show";
      visBtn.className = "btn btn-secondary";
    }

    const titleEl = document.getElementById("api-form-header-title");
    if (titleEl) {
      titleEl.innerText = "+ Add Key to Waterfall Vault";
      titleEl.style.color = "var(--accent-cyan)";
    }
    const saveBtn = document.getElementById("btn-save-api-key");
    if (saveBtn) {
      saveBtn.innerText = "+ Save Key";
      saveBtn.className = "btn btn-purple";
    }
    const cancelBtn = document.getElementById("btn-cancel-api-key-edit");
    if (cancelBtn) cancelBtn.style.display = "none";

    const formCard = document.getElementById("api-key-form-card");
    if (formCard) formCard.style.borderColor = "var(--border-color)";
  }

  function handleApiProviderPresetChange(provider) {
    const modelInput = document.getElementById("api-key-model");
    const customWrap = document.getElementById("api-custom-url-wrap");
    if (customWrap) customWrap.style.display = provider === "CUSTOM" ? "block" : "none";
    if (!modelInput) return;

    if (provider === "GEMINI") modelInput.value = "gemini-2.5-flash";
    else if (provider === "GROQ") modelInput.value = "llama-3.3-70b-versatile";
    else if (provider === "OPENROUTER") modelInput.value = "deepseek/deepseek-r1:free";
  }

  async function addApiKeyToVault() {
    const label = document.getElementById("api-key-label")?.value.trim() || `Key #${AiGatewayService.keys.length + 1}`;
    const provider = document.getElementById("api-key-provider")?.value || "GEMINI";
    const model = document.getElementById("api-key-model")?.value.trim() || "gemini-2.5-flash";
    const priority = document.getElementById("api-key-priority")?.value || "MEDIUM";
    const customUrl = document.getElementById("api-key-custom-url")?.value.trim() || "";
    const secret = document.getElementById("api-key-secret")?.value.trim() || "";

    if (!secret) {
      alert("Please paste a valid API key.");
      return;
    }

    if (editingApiKeyId) {
      const existing = AiGatewayService.keys.find(k => k.id === editingApiKeyId);
      if (existing) {
        existing.label = label;
        existing.provider = provider;
        existing.model = model;
        existing.priority = priority;
        existing.customUrl = customUrl;
        existing.secret = secret;
        existing.cooldownUntil = 0;
        existing.lastStatus = "READY";
      }
      cancelApiKeyEdit();
      await AiGatewayService.saveVault();
      return;
    }

    AiGatewayService.keys.push({
      id: "key_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      label,
      provider,
      model,
      priority,
      customUrl,
      secret,
      enabled: true,
      cooldownUntil: 0,
      lastStatus: "READY"
    });

    cancelApiKeyEdit();
    await AiGatewayService.saveVault();
  }

  async function deleteApiKeyFromVault(id) {
    if (editingApiKeyId === id) {
      cancelApiKeyEdit();
    }
    revealedApiKeyIds.delete(id);
    AiGatewayService.keys = AiGatewayService.keys.filter(k => k.id !== id);
    await AiGatewayService.saveVault();
  }

  async function moveApiKeyOrder(idx, dir) {
    const target = idx + dir;
    if (target < 0 || target >= AiGatewayService.keys.length) return;
    const temp = AiGatewayService.keys[idx];
    AiGatewayService.keys[idx] = AiGatewayService.keys[target];
    AiGatewayService.keys[target] = temp;
    await AiGatewayService.saveVault();
  }

  async function testSingleApiKey(id) {
    const k = AiGatewayService.keys.find(item => item.id === id);
    if (!k) return;
    try {
      const out = await AiGatewayService.callSingleProviderKey(
        k,
        "You are a fast connectivity checker.",
        "Reply with the exact word: ONLINE",
        false
      );
      k.cooldownUntil = 0;
      k.lastStatus = "READY";
      await AiGatewayService.saveVault();
      alert(`✅ Key "${k.label}" (${k.model}) is ONLINE!\nResponse: ${out.slice(0, 60)}`);
    } catch (err) {
      k.cooldownUntil = Date.now() + 60000;
      k.lastStatus = "COOLDOWN";
      await AiGatewayService.saveVault();
      alert(`❌ Key "${k.label}" test failed:\n${err.message}`);
    }
  }

  async function resetAllApiCooldowns() {
    AiGatewayService.keys.forEach(k => {
      k.cooldownUntil = 0;
      k.lastStatus = "READY";
    });
    await AiGatewayService.saveVault();
  }

  async function saveTaskRoutingConfig() {
    ["SHORTCUT", "MUTANT", "SMART_PARSE", "SHEET_EDIT"].forEach(t => {
      const sel = document.getElementById(`task-route-${t}`);
      if (sel) AiGatewayService.taskRoutes[t] = sel.value;
    });
    await AiGatewayService.saveVault();
  }

  function renderApiVaultUI() {
    const listEl = document.getElementById("api-vault-keys-list");
    const badgeEl = document.getElementById("api-vault-status-badge");
    const keys = AiGatewayService.keys || [];
    const now = Date.now();
    const readyCount = keys.filter(k => !k.cooldownUntil || k.cooldownUntil <= now).length;

    if (badgeEl) {
      badgeEl.innerText = `${readyCount} / ${keys.length} Keys Ready`;
    }

    if (listEl) {
      listEl.innerHTML = "";
      if (keys.length === 0) {
        listEl.innerHTML = `<div style="font-size:11.5px; color:var(--text-muted); text-align:center; padding:10px; background:#070a12; border-radius:8px;">No API keys added yet. Add free Gemini / Groq / OpenRouter keys above to enable 1-tap in-app AI micro-tasks.</div>`;
      } else {
        keys.forEach((k, idx) => {
          const onCooldown = k.cooldownUntil && k.cooldownUntil > now;
          const remSec = onCooldown ? Math.ceil((k.cooldownUntil - now) / 1000) : 0;
          const recentReqs = Array.isArray(k.requestTimestamps)
            ? k.requestTimestamps.filter(ts => now - ts < 60000).length
            : 0;
          const maxRpm = k.maxRpm || ((k.provider || "GEMINI").toUpperCase() === "GROQ" ? 20 : 10);
          const inBreather = !onCooldown && k.lastUsedEpoch && (now - k.lastUsedEpoch) < ((k.minGapSec || 6) * 1000);
          const breatherSec = inBreather ? Math.ceil((((k.minGapSec || 6) * 1000) - (now - k.lastUsedEpoch)) / 1000) : 0;

          let statusHtml = `<span class="badge" style="background:rgba(16,185,129,0.2); color:var(--status-green);">\uD83D\uDFE2 Ready (${recentReqs}/${maxRpm} RPM)</span>`;
          if (onCooldown) {
            statusHtml = `<span class="badge" style="background:rgba(245,158,11,0.2); color:var(--status-amber);">\u23F3 Cooldown (${remSec}s \u2022 ${recentReqs}/${maxRpm} RPM)</span>`;
          } else if (inBreather) {
            statusHtml = `<span class="badge" style="background:rgba(56,189,248,0.2); color:var(--accent-cyan);">\uD83D\uDCA8 Breather (${breatherSec}s \u2022 ${recentReqs}/${maxRpm} RPM)</span>`;
          }

          const isRevealed = revealedApiKeyIds.has(k.id);
          const displaySecret = isRevealed ? (k.secret || "") : maskSecretKey(k.secret);

          const row = document.createElement("div");
          row.className = "api-key-row";
          row.style.flexDirection = "column";
          row.style.alignItems = "stretch";
          row.style.gap = "6px";
          row.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span class="badge" style="background:#1e293b; color:var(--text-reading); font-family:var(--font-mono);">#${idx + 1}</span>
                <span class="api-tier-badge tier-${k.priority}">${k.priority}</span>
                <b style="font-size:12.5px; color:#fff;">${k.label}</b>
                <span style="font-size:11px; font-family:var(--font-mono); color:var(--accent-cyan);">${k.provider} \u2022 ${k.model}</span>
                ${statusHtml}
              </div>
              <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap;">
                <button class="btn btn-secondary" style="padding:2px 7px; font-size:10px;" onclick="CGL_OS.toggleSavedApiKeyReveal('${k.id}')" title="View or Hide API Key">${isRevealed ? "\uD83D\uDE48 Hide" : "\uD83D\uDC41\uFE0F View"}</button>
                <button class="btn btn-secondary" style="padding:2px 7px; font-size:10px;" onclick="CGL_OS.copySavedApiKeySecret('${k.id}')" title="Copy API Key">\uD83D\uDCCB Copy</button>
                <button class="btn btn-purple" style="padding:2px 8px; font-size:10px;" onclick="CGL_OS.editApiKeyInVault('${k.id}')" title="Edit Key Label, Model, Priority, or Secret">\u270E Edit</button>
                <button class="btn btn-secondary" style="padding:2px 7px; font-size:10px;" onclick="CGL_OS.moveApiKeyOrder(${idx}, -1)" title="Move Up">\u25B2</button>
                <button class="btn btn-secondary" style="padding:2px 7px; font-size:10px;" onclick="CGL_OS.moveApiKeyOrder(${idx}, 1)" title="Move Down">\u25BC</button>
                <button class="btn btn-cyan" style="padding:2px 8px; font-size:10px;" onclick="CGL_OS.testSingleApiKey('${k.id}')">\u26A1 Test</button>
                <button class="btn btn-danger" style="padding:2px 7px; font-size:10px;" onclick="CGL_OS.deleteApiKeyFromVault('${k.id}')" title="Delete Key">\u2715</button>
              </div>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.28); padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.05); font-family:var(--font-mono); font-size:11px; color:${isRevealed ? "var(--accent-cyan)" : "var(--text-muted)"}; word-break:break-all;">
              <span>Key: ${displaySecret}</span>
              ${k.customUrl ? `<span style="font-size:10px; color:var(--text-dim);">URL: ${k.customUrl}</span>` : ""}
            </div>
          `;
          listEl.appendChild(row);
        });
      }
    }

    // Populate Task Route & Manual Override Selectors across the App
    const overrideSelectIds = [
      "task-route-SHORTCUT",
      "task-route-MUTANT",
      "task-route-SMART_PARSE",
      "task-route-SHEET_EDIT",
      "ai-tutor-key-override",
      "ai-sheet-key-override",
      "smart-parse-key-override"
    ];

    overrideSelectIds.forEach(selId => {
      const sel = document.getElementById(selId);
      if (!sel) return;
      const curVal = sel.value;
      sel.innerHTML = `<option value="WATERFALL_AUTO">🌊 Waterfall Auto (Priority Failover)</option>`;
      keys.forEach(k => {
        const opt = document.createElement("option");
        opt.value = k.id;
        opt.innerText = `🔑 ${k.label} (${k.model} • ${k.priority})`;
        sel.appendChild(opt);
      });

      if (selId.startsWith("task-route-")) {
        const taskKey = selId.replace("task-route-", "");
        sel.value = AiGatewayService.taskRoutes[taskKey] || "WATERFALL_AUTO";
      } else if (curVal && keys.some(k => k.id === curVal)) {
        sel.value = curVal;
      }
    });
  }

  /* ==========================================================================
   * SECTION 15: DYNAMIC TAXONOMY & SELECTOR SYNCHRONIZER UI
   * ========================================================================== */
  async function syncAllTaxonomyDropdowns() {
    await TaxonomyService.getTaxonomy();
    const subKeys = Object.keys(TAXONOMY);

    const populateSelect = (elementId, includeAll = false) => {
      const el = document.getElementById(elementId);
      if (!el) return;
      const currentVal = el.value;
      el.innerHTML = "";

      if (includeAll) {
        const optAll = document.createElement("option");
        optAll.value = "ALL";
        optAll.innerText = "All Subjects";
        el.appendChild(optAll);
      }

      subKeys.forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.innerText = `${TAXONOMY[k].name} (${k})`;
        el.appendChild(opt);
      });

      if (subKeys.includes(currentVal) || (includeAll && currentVal === "ALL")) {
        el.value = currentVal;
      } else if (subKeys.length > 0) {
        el.value = subKeys[0];
      }
    };

    populateSelect("comp-studio-subject-select", false);
    populateSelect("print-subject", true);
    populateSelect("concept-edit-subject", false);
    populateSelect("edit-q-subject", false);
    populateSelect("new-q-subject", false);
    populateSelect("scoped-export-subject", true);
    populateSelect("practice-filter-subject", true);
    populateSelect("builder-subject", true);
    populateSelect("global-search-filter-sub", true);
    populateSelect("sheets-index-filter-sub", true);

    const practiceSub = document.getElementById("practice-filter-subject");
    if (practiceSub) handlePracticeSubjectChange(practiceSub.value);
    const builderSub = document.getElementById("builder-subject");
    if (builderSub) updateBuilderChapters(builderSub.value);
    const newQSub = document.getElementById("new-q-subject");
    if (newQSub) syncNewQuestionChapterSelect(newQSub.value);
  }

  function openTaxonomyManagerModal() {
    renderTaxonomyManagerList();
    pushHistoryState("modal-taxonomy-manager");
    const m = document.getElementById("modal-taxonomy-manager");
    if (m) m.classList.add("active");
  }

  async function renderTaxonomyManagerList() {
    const container = document.getElementById("taxonomy-manager-list");
    if (!container) return;
    container.innerHTML = "";

    const allQs = await getAllRecords("store_questions");
    const allConcepts = await getAllRecords("store_concepts");

    Object.keys(TAXONOMY).forEach(subKey => {
      const sub = TAXONOMY[subKey];
      const div = document.createElement("div");
      div.className = "card";
      div.style.padding = "10px";
      div.style.marginBottom = "8px";

      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div>
            <b style="color:#fff; font-size:13px;">${sub.name}</b>
            <span class="badge" style="background:#1f6feb; margin-left:6px;">${subKey}</span>
          </div>
          <div style="display:flex; gap:4px;">
            <button class="btn btn-secondary" style="padding:2px 6px; font-size:10px; color:var(--accent-cyan);" onclick="CGL_OS.promptAddChapterToSubject('${subKey}')">+ Chapter</button>
            <button class="btn btn-secondary" style="padding:2px 6px; font-size:10px; color:var(--status-red);" onclick="CGL_OS.deleteSubjectAction('${subKey}')">Delete</button>
          </div>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:4px;">
          ${sub.chapters.map(c => {
            const qCount = allQs.filter(q => q.subject === subKey && q.chapter === c).length;
            const cCount = allConcepts.filter(t => t.subject === subKey && t.chapter === c).length;
            return `
              <span style="font-size:10.5px; font-family:var(--font-mono); background:var(--bg-elevated); border:1px solid var(--border-color); padding:3px 8px; border-radius:5px; display:inline-flex; align-items:center; gap:6px;">
                <span>${c} <small style="color:var(--accent-cyan);">(${qCount}Q/${cCount}S)</small></span>
                <span title="Merge or Reassign Chapter" style="cursor:pointer; color:var(--accent-cyan); font-weight:bold;" onclick="CGL_OS.openChapterMergeModal('${subKey}', '${c}')">\u21C4</span>
                <span title="Delete Chapter" style="cursor:pointer; color:var(--status-red); opacity:0.7;" onclick="CGL_OS.deleteChapterFromSubject('${subKey}', '${c}')">\u2715</span>
              </span>
            `;
          }).join("")}
        </div>
      `;
      container.appendChild(div);
    });
  }

  async function addNewSubjectAction() {
    const keyInput = document.getElementById("new-sub-key");
    const nameInput = document.getElementById("new-sub-name");
    const key = keyInput ? keyInput.value.trim().toUpperCase().replace(/\s+/g, "_") : "";
    const name = nameInput ? nameInput.value.trim() : "";

    if (!key || !name) {
      alert("Both Key and Full Name are required.");
      return;
    }

    try {
      await TaxonomyService.addSubject(key, name);
      if (keyInput) keyInput.value = "";
      if (nameInput) nameInput.value = "";
      renderTaxonomyManagerList();
      await renderDashboard();
    } catch (err) {
      alert(err.message);
    }
  }

  async function promptAddChapterToSubject(subKey) {
    const chap = prompt(`Enter chapter tag for ${subKey} (e.g. ${subKey}_TOPIC):`);
    if (!chap || !chap.trim()) return;

    try {
      await TaxonomyService.addChapter(subKey, chap);
      renderTaxonomyManagerList();
      await renderDashboard();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteChapterFromSubject(subKey, chap) {
    const allQs = await getAllRecords("store_questions");
    const qCount = allQs.filter(q => q.subject === subKey && q.chapter === chap).length;
    const allConcepts = await getAllRecords("store_concepts");
    const cCount = allConcepts.filter(c => c.subject === subKey && c.chapter === chap).length;

    if (qCount > 0 || cCount > 0) {
      const choice = confirm(`Chapter ${chap} contains ${qCount} questions and ${cCount} sheets.\n\nClick OK to preserve all content under ${subKey}_UNASSIGNED and remove the taxonomy entry.\nClick Cancel to keep the chapter.`);
      if (!choice) return;
      await TaxonomyService.deleteChapter(subKey, chap, "PRESERVE_UNASSIGNED");
    } else {
      if (confirm(`Remove empty chapter ${chap} from ${subKey}?`)) {
        await TaxonomyService.deleteChapter(subKey, chap, "PRESERVE_UNASSIGNED");
      }
    }

    renderTaxonomyManagerList();
    await renderDashboard();
  }

  async function openChapterMergeModal(subKey, sourceChap) {
    const targetChap = prompt(`Merge chapter ${sourceChap} into another chapter in ${subKey}.\nEnter exact TARGET chapter name:`);
    if (!targetChap || !targetChap.trim()) return;

    try {
      await TaxonomyService.mergeChapters(subKey, sourceChap, targetChap.trim().toUpperCase());
      alert(`Merged all questions and sheets from ${sourceChap} into ${targetChap.trim().toUpperCase()}.`);
      renderTaxonomyManagerList();
      await renderDashboard();
    } catch (err) {
      alert("Merge error: " + err.message);
    }
  }

  async function deleteSubjectAction(subKey) {
    try {
      if (confirm(`Permanently remove subject ${subKey}?`)) {
        await TaxonomyService.deleteSubject(subKey);
        renderTaxonomyManagerList();
        await renderDashboard();
      }
    } catch (err) {
      alert(err.message);
    }
  }

  function syncEditorChapterDropdown(subKey) {
    const chapInput = document.getElementById("concept-edit-chapter");
    if (chapInput && TAXONOMY[subKey] && TAXONOMY[subKey].chapters.length > 0) {
      chapInput.value = TAXONOMY[subKey].chapters[0];
    }
  }

  function syncNewQuestionChapterSelect(subKey) {
    const sel = document.getElementById("new-q-chapter");
    if (!sel || !TAXONOMY[subKey]) return;
    sel.innerHTML = "";
    TAXONOMY[subKey].chapters.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.innerText = c;
      sel.appendChild(opt);
    });
  }

  /* ==========================================================================
   * SECTION 16: NATIVE QUESTION GUI CREATOR, SMART PARSE & EDITOR
   * ========================================================================== */
  function openNewQuestionCreatorModal(presetSub = null, presetChap = null) {
    currentQuestionImageBase64 = "";
    const sub = presetSub || (document.getElementById("practice-filter-subject")?.value !== "ALL" ? document.getElementById("practice-filter-subject")?.value : "QA");
    safeSetValue("new-q-subject", sub);
    syncNewQuestionChapterSelect(sub);
    if (presetChap) safeSetValue("new-q-chapter", presetChap);

    safeSetValue("new-q-smart-raw-input", "");
    safeSetDisplay("smart-parse-source-badge", "none");
    safeSetValue("new-q-subtopic", "");
    safeSetValue("new-q-method", "");
    safeSetValue("new-q-difficulty", "MEDIUM");
    safeSetValue("new-q-parent-passage-id", "");
    safeSetValue("new-q-set-order", "");
    safeSetValue("new-q-set-total", "");
    safeSetValue("new-q-passage-text", "");
    safeSetValue("new-q-text", "");
    safeSetValue("new-q-img-url", "");
    safeSetValue("new-q-img-file", "");
    safeSetDisplay("new-q-img-preview-box", "none");
    safeSetValue("new-q-opt-0", "");
    safeSetValue("new-q-opt-1", "");
    safeSetValue("new-q-opt-2", "");
    safeSetValue("new-q-opt-3", "");
    safeSetValue("new-q-correct", "0");
    safeSetValue("new-q-source", "Manual Entry");
    safeSetValue("new-q-explanation", "");
    safeSetValue("new-q-tags", "");
    safeSetValue("new-q-concepts", "");

    renderApiVaultUI();
    pushHistoryState("modal-new-question-creator");
    const m = document.getElementById("modal-new-question-creator");
    if (m) m.classList.add("active");
  }

  async function smartParseRawQuestionText() {
    const rawText = document.getElementById("new-q-smart-raw-input")?.value.trim() || "";
    if (!rawText) {
      alert("Paste raw question text into the Smart Parse box first.");
      return;
    }

    const manualKeyId = document.getElementById("smart-parse-key-override")?.value || "WATERFALL_AUTO";
    const badge = document.getElementById("smart-parse-source-badge");
    if (badge) {
      badge.style.display = "inline-flex";
      badge.innerText = "\u23F3 Parsing via API...";
    }

    const systemPrompt = `You are a precision SSC CGL question parser. Convert the user's raw question text into a clean JSON object with EXACTLY these 7 keys:
{
  "questionText": "Full stem with LaTeX math wrapped in $...$",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Step-by-step derivation and shortcut",
  "subtopic": "Short concept name",
  "method": "Solving method name",
  "difficulty": "EASY" | "MEDIUM" | "HARD"
}
Return ONLY valid JSON.`;

    try {
      const res = await AiGatewayService.executeMicroTask({
        taskType: "SMART_PARSE",
        systemPrompt,
        userPrompt: rawText,
        expectJson: true,
        manualKeyId,
        validatorFn: (obj) => {
          if (!obj.questionText || !Array.isArray(obj.options) || obj.options.length !== 4) {
            throw new Error("Parsed output missing questionText or 4 options.");
          }
        }
      });

      const d = res.data;
      safeSetValue("new-q-text", d.questionText || "");
      safeSetValue("new-q-opt-0", d.options[0] || "");
      safeSetValue("new-q-opt-1", d.options[1] || "");
      safeSetValue("new-q-opt-2", d.options[2] || "");
      safeSetValue("new-q-opt-3", d.options[3] || "");
      safeSetValue("new-q-correct", String(typeof d.correctIndex === "number" ? d.correctIndex : 0));
      safeSetValue("new-q-explanation", d.explanation || "");
      safeSetValue("new-q-subtopic", d.subtopic || "");
      safeSetValue("new-q-method", d.method || "");
      if (["EASY", "MEDIUM", "HARD"].includes(d.difficulty)) {
        safeSetValue("new-q-difficulty", d.difficulty);
      }

      if (badge) {
        badge.innerText = `\u2713 Parsed by: ${res.sourceLabel}`;
      }
    } catch (err) {
      if (badge) badge.innerText = "\u26A0\uFE0F Fallback to Clipboard";
      alert(err.message);
    }
  }

  async function handleNewQuestionImageUpload(input) {
    if (input.files && input.files[0]) {
      currentQuestionImageBase64 = await compressImageFile(input.files[0]);
      const pBox = document.getElementById("new-q-img-preview-box");
      if (pBox) {
        pBox.style.display = "block";
        pBox.innerHTML = `<img src="${currentQuestionImageBase64}" style="max-height:120px; border-radius:6px; border:1px solid var(--border-color);">`;
      }
    }
  }

  async function submitNewQuestionCreator(keepOpen = false) {
    const sub = document.getElementById("new-q-subject")?.value || "QA";
    const chap = document.getElementById("new-q-chapter")?.value || "QA_PERCENTAGE";
    const text = document.getElementById("new-q-text")?.value.trim() || "";
    const opt0 = document.getElementById("new-q-opt-0")?.value.trim() || "";
    const opt1 = document.getElementById("new-q-opt-1")?.value.trim() || "";
    const opt2 = document.getElementById("new-q-opt-2")?.value.trim() || "";
    const opt3 = document.getElementById("new-q-opt-3")?.value.trim() || "";
    const correctIdx = parseInt(document.getElementById("new-q-correct")?.value || "0", 10);
    const rawConcepts = document.getElementById("new-q-concepts")?.value.trim() || "";
    const parsedConcepts = rawConcepts.split(",").map(s => s.trim()).filter(Boolean);

    const parentPassageId = document.getElementById("new-q-parent-passage-id")?.value.trim() || null;
    const passageText = document.getElementById("new-q-passage-text")?.value.trim() || "";
    const setOrder = parseInt(document.getElementById("new-q-set-order")?.value || "1", 10) || 1;
    const setTotal = parseInt(document.getElementById("new-q-set-total")?.value || "1", 10) || 1;

    if (!text || !opt0 || !opt1 || !opt2 || !opt3) {
      alert("Question stem and all 4 options are mandatory.");
      return;
    }

    const qObj = {
      id: QuestionService.generateId(sub),
      subject: sub,
      chapter: chap,
      subtopic: document.getElementById("new-q-subtopic")?.value.trim() || "",
      method: document.getElementById("new-q-method")?.value.trim() || "",
      difficulty: document.getElementById("new-q-difficulty")?.value || "MEDIUM",
      parentPassageId: parentPassageId,
      passageText: passageText,
      setOrder: setOrder,
      setTotal: setTotal,
      conceptId: parsedConcepts[0] || "",
      conceptIds: parsedConcepts,
      questionText: text,
      imageUrl: currentQuestionImageBase64 || document.getElementById("new-q-img-url")?.value.trim() || "",
      options: [opt0, opt1, opt2, opt3],
      correctIndex: correctIdx,
      explanation: document.getElementById("new-q-explanation")?.value.trim() || "",
      source: document.getElementById("new-q-source")?.value.trim() || "Manual Entry",
      tags: (document.getElementById("new-q-tags")?.value || "").split(",").map(s => s.trim()).filter(Boolean),
      bookmarked: false,
      annotation: ""
    };

    try {
      await QuestionService.create(qObj);
      alert(`Question created successfully: ${qObj.id}`);
      await renderDashboard();
      if (typeof renderPracticeQuestionsTable === "function") {
        await renderPracticeQuestionsTable();
      }

      if (keepOpen) {
        safeSetValue("new-q-smart-raw-input", "");
        safeSetValue("new-q-text", "");
        safeSetValue("new-q-img-url", "");
        safeSetValue("new-q-img-file", "");
        safeSetDisplay("new-q-img-preview-box", "none");
        currentQuestionImageBase64 = "";
        safeSetValue("new-q-opt-0", "");
        safeSetValue("new-q-opt-1", "");
        safeSetValue("new-q-opt-2", "");
        safeSetValue("new-q-opt-3", "");
        safeSetValue("new-q-explanation", "");
        if (parentPassageId) {
          safeSetValue("new-q-set-order", setOrder + 1);
        }
      } else {
        const m = document.getElementById("modal-new-question-creator");
        if (m) m.classList.remove("active");
      }
    } catch (err) {
      alert("Creation Error: " + err.message);
    }
  }

  function openEditQuestionModal(qData = null, presetSub = null, presetChap = null) {
    if (!qData) {
      openNewQuestionCreatorModal(presetSub, presetChap);
      return;
    }

    currentQuestionImageBase64 = "";
    safeSetText("editor-title", `Edit Question (${qData.id})`);
    safeSetValue("edit-q-id", qData.id);

    const subSelect = document.getElementById("edit-q-subject");
    if (subSelect) subSelect.value = qData.subject;

    safeSetValue("edit-q-chapter", qData.chapter);
    safeSetValue("edit-q-subtopic", qData.subtopic || "");
    safeSetValue("edit-q-method", qData.method || "");
    safeSetValue("edit-q-difficulty", qData.difficulty || "MEDIUM");
    safeSetValue("edit-q-source", qData.source || "Manual Entry");
    safeSetValue("edit-q-tags", Array.isArray(qData.tags) ? qData.tags.join(", ") : "");

    safeSetValue("edit-q-parent-passage-id", qData.parentPassageId || "");
    safeSetValue("edit-q-set-order", qData.setOrder || "1");
    safeSetValue("edit-q-set-total", qData.setTotal || "1");
    safeSetValue("edit-q-passage-text", qData.passageText || "");

    const cIds = (Array.isArray(qData.conceptIds) && qData.conceptIds.length > 0)
      ? qData.conceptIds.join(", ")
      : (qData.conceptId || "");
    safeSetValue("edit-q-concept-ids", cIds);

    safeSetValue("edit-q-text", qData.questionText);
    safeSetValue("edit-q-img-url", qData.imageUrl || "");
    safeSetValue("edit-q-img-file", "");

    safeSetValue("edit-opt-0", qData.options[0] || "");
    safeSetValue("edit-opt-1", qData.options[1] || "");
    safeSetValue("edit-opt-2", qData.options[2] || "");
    safeSetValue("edit-opt-3", qData.options[3] || "");

    safeSetValue("edit-q-correct", qData.correctIndex || 0);
    safeSetValue("edit-q-explanation", qData.explanation || "");

    safeSetDisplay("btn-delete-q", "block");
    safeSetDisplay("btn-dup-q", "block");

    pushHistoryState("modal-question-editor");
    const m = document.getElementById("modal-question-editor");
    if (m) m.classList.add("active");
  }

  async function openEditCurrentArenaQuestion() {
    if (!activeExam) return;
    const curQ = activeExam.questions[activeExam.currentQuestionIndex];
    if (!curQ) return;
    const canonical = await QuestionService.get(curQ.id);
    openEditQuestionModal(canonical || curQ);
  }

  function openEditCurrentDojoQuestion() {
    if (!dojoExam) return;
    openEditQuestionModal(dojoExam.questions[dojoExam.currentIndex]);
  }

  async function handleQuestionImageUpload(input) {
    if (input.files && input.files[0]) {
      currentQuestionImageBase64 = await compressImageFile(input.files[0]);
    }
  }

  async function saveQuestionEditor() {
    const id = document.getElementById("edit-q-id")?.value.trim() || "";
    const urlInput = document.getElementById("edit-q-img-url")?.value.trim() || "";
    const rawConceptIds = document.getElementById("edit-q-concept-ids")?.value.trim() || "";
    const parsedConceptIds = rawConceptIds.split(",").map(s => s.trim()).filter(Boolean);
    const rawTags = document.getElementById("edit-q-tags")?.value.trim() || "";
    const parsedTags = rawTags ? rawTags.split(",").map(s => s.trim()).filter(Boolean) : ["UserSaved"];

    const existing = await QuestionService.get(id);

    const qObj = {
      id: id,
      subject: document.getElementById("edit-q-subject")?.value || (existing ? existing.subject : "QA"),
      chapter: (document.getElementById("edit-q-chapter")?.value || (existing ? existing.chapter : "QA_PERCENTAGE")).trim().toUpperCase(),
      subtopic: document.getElementById("edit-q-subtopic")?.value.trim() || "",
      method: document.getElementById("edit-q-method")?.value.trim() || "",
      difficulty: document.getElementById("edit-q-difficulty")?.value || (existing ? existing.difficulty : "MEDIUM"),
      parentPassageId: document.getElementById("edit-q-parent-passage-id")?.value.trim() || null,
      passageText: document.getElementById("edit-q-passage-text")?.value.trim() || "",
      setOrder: parseInt(document.getElementById("edit-q-set-order")?.value || "1", 10) || 1,
      setTotal: parseInt(document.getElementById("edit-q-set-total")?.value || "1", 10) || 1,
      conceptId: parsedConceptIds[0] || "",
      conceptIds: parsedConceptIds,
      questionText: document.getElementById("edit-q-text")?.value.trim() || "",
      imageUrl: currentQuestionImageBase64 || urlInput || (existing ? existing.imageUrl : ""),
      options: [
        document.getElementById("edit-opt-0")?.value.trim() || "",
        document.getElementById("edit-opt-1")?.value.trim() || "",
        document.getElementById("edit-opt-2")?.value.trim() || "",
        document.getElementById("edit-opt-3")?.value.trim() || ""
      ],
      correctIndex: parseInt(document.getElementById("edit-q-correct")?.value || "0", 10),
      explanation: document.getElementById("edit-q-explanation")?.value.trim() || "",
      source: document.getElementById("edit-q-source")?.value.trim() || (existing ? existing.source : "Manual Entry"),
      tags: parsedTags,
      bookmarked: existing ? !!existing.bookmarked : false,
      annotation: existing ? (existing.annotation || "") : ""
    };

    try {
      if (existing) {
        await QuestionService.update(id, qObj);
      } else {
        await QuestionService.create(qObj);
      }
      const m = document.getElementById("modal-question-editor");
      if (m) m.classList.remove("active");

      if (dojoExam && dojoExam.questions[dojoExam.currentIndex]?.id === id) {
        dojoExam.questions[dojoExam.currentIndex] = { ...dojoExam.questions[dojoExam.currentIndex], ...qObj };
        renderDojoArenaQuestion();
      }
      if (activeExam && activeExam.questions[activeExam.currentQuestionIndex]?.id === id) {
        activeExam.questions[activeExam.currentQuestionIndex] = { ...activeExam.questions[activeExam.currentQuestionIndex], ...qObj };
        renderActiveExamQuestion();
      }
      await renderDashboard();
      if (typeof renderPracticeQuestionsTable === "function") {
        await renderPracticeQuestionsTable();
      }
      alert(`Question ${id} saved successfully.`);
    } catch (err) {
      alert("Save Error: " + err.message);
    }
  }

  async function duplicateCurrentEditingQuestion() {
    const id = document.getElementById("edit-q-id")?.value.trim();
    if (!id) return;
    try {
      const clone = await QuestionService.duplicate(id);
      const m = document.getElementById("modal-question-editor");
      if (m) m.classList.remove("active");
      alert(`Duplicated as new question: ${clone.id}`);
      openEditQuestionModal(clone);
    } catch (err) {
      alert("Duplicate failed: " + err.message);
    }
  }

  async function deleteCurrentEditingQuestion() {
    const id = document.getElementById("edit-q-id")?.value.trim();
    if (!id) return;
    if (confirm(`Permanently delete question ${id}? (Historical attempts referencing this question remain preserved)`)) {
      await QuestionService.delete(id);
      const m = document.getElementById("modal-question-editor");
      if (m) m.classList.remove("active");

      if (dojoExam) {
        dojoExam.questions = dojoExam.questions.filter(q => q.id !== id);
        if (dojoExam.currentIndex >= dojoExam.questions.length) dojoExam.currentIndex = 0;
        if (dojoExam.questions.length > 0) renderDojoArenaQuestion();
        else exitDojoArena();
      }
      await renderDashboard();
      if (typeof renderPracticeQuestionsTable === "function") {
        await renderPracticeQuestionsTable();
      }
      alert(`Question ${id} removed.`);
    }
  }

  /* ==========================================================================
   * SECTION 17: SHARED SERVICE — PERFORMANCE SERVICE & UNTIMED DOJO BRIDGE
   * - Official Timed Mock metrics (ERI, Mock Accuracy, Mock Scorecards) strictly
   *   exclude mockType === "DOJO_CLINIC".
   * - Question-level Mastery, Unseen Graduation, Mistake Debt Redemption, and
   *   Chapter Neglect include "DOJO_CLINIC" so untimed Dojo & Showcase solves
   *   count toward mastery in real time!
   * ========================================================================== */
  const PerformanceService = {
    async getHistoricalAttempts(includeUntimedDojo = false) {
      const attempts = await getAllRecords("store_attempts");
      return attempts.filter(a => {
        if (!a.completed || a.mockType === "STUDY_VIEW") return false;
        if (!includeUntimedDojo && a.mockType === "DOJO_CLINIC") return false;
        return true;
      });
    },

    async recordUntimedPracticeSolve(q, selectedOptIdx, timeSpentSec = 15, setupSec = null, calcSec = null) {
      if (!q || !q.id) return;
      const now = Date.now();
      const dayKey = new Date(now).toISOString().slice(0, 10);
      const ledgerId = `dojo_ledger_${dayKey}`;

      let ledger = await getRecord("store_attempts", ledgerId);
      if (!ledger) {
        ledger = {
          sessionId: ledgerId,
          parentSessionId: null,
          attemptNumber: 1,
          timestamp: now,
          timeIST: formatISTDate(now),
          diurnalSlot: getDiurnalSlot(now),
          title: `Untimed Dojo & Showcase Practice (${dayKey})`,
          mockType: "DOJO_CLINIC",
          completed: true,
          questions: [],
          userResponses: {},
          correctCount: 0,
          incorrectCount: 0,
          finalScore: 0
        };
      }

      if (selectedOptIdx === null || selectedOptIdx === undefined) {
        delete ledger.userResponses[q.id];
        ledger.questions = (ledger.questions || []).filter(item => item.id !== q.id);
      } else {
        const exists = (ledger.questions || []).some(item => item.id === q.id);
        if (!exists) {
          ledger.questions.push({
            id: q.id,
            subject: q.subject || "QA",
            chapter: q.chapter || "QA_PERCENTAGE",
            subtopic: q.subtopic || "",
            method: q.method || "",
            correctIndex: q.correctIndex,
            remediatesQuestionId: q.remediatesQuestionId || null
          });
        } else {
          const idx = ledger.questions.findIndex(item => item.id === q.id);
          if (idx !== -1) ledger.questions[idx].correctIndex = q.correctIndex;
        }

        ledger.userResponses[q.id] = {
          selectedOption: selectedOptIdx,
          status: "answered",
          timeSpentSec: Math.max(2, Math.min(300, timeSpentSec || 15)),
          setupSec: setupSec !== null && setupSec !== undefined ? Number(setupSec) : null,
          calcSec: calcSec !== null && calcSec !== undefined ? Number(calcSec) : null,
          timestamp: now
        };
      }

      let cor = 0, inc = 0;
      (ledger.questions || []).forEach(item => {
        const r = ledger.userResponses[item.id];
        if (r && r.selectedOption !== null && r.selectedOption !== undefined) {
          if (r.selectedOption === item.correctIndex) cor++;
          else inc++;
        }
      });
      ledger.correctCount = cor;
      ledger.incorrectCount = inc;
      ledger.timestamp = now;
      ledger.timeIST = formatISTDate(now);

      await putRecord("store_attempts", ledger);
    },

    async calculateGlobalMetrics() {
      const completed = await this.getHistoricalAttempts(false);
      const storedEngagement = await getRecord("store_config", "telemetry_active_study_time_sec");
      const universalStudyTimeSec = (storedEngagement && typeof storedEngagement.value === "number" ? storedEngagement.value : 0) + unsyncedStudySeconds;

      if (completed.length === 0) {
        return {
          totalMocks: 0,
          accuracy: 0,
          avgSpeed: 0,
          trapsHit: 0,
          eri: "0.0",
          accComp: 0,
          velComp: 0,
          consistencyComp: 0,
          totalStudyTimeSec: universalStudyTimeSec,
          neglectAlert: null
        };
      }

      let totalCor = 0, totalAtt = 0, totalQuestionsInMocks = 0;
      let totalMockSec = 0, totalParWeightedRatio = 0, traps = 0;
      let standardMocksCount = 0;

      completed.forEach(c => {
        const qList = Array.isArray(c.questions) ? c.questions : [];
        if (qList.length >= 10 && c.mockType !== "MICRO_DRILL") {
          standardMocksCount++;
        }
        totalQuestionsInMocks += qList.length;
        totalCor += (c.correctCount || 0);
        totalAtt += ((c.correctCount || 0) + (c.incorrectCount || 0));
        traps += (c.q4Traps || 0);

        if (c.userResponses && typeof c.userResponses === "object") {
          qList.forEach(q => {
            const r = c.userResponses[q.id];
            if (r) {
              const spent = r.timeSpentSec || 0;
              totalMockSec += spent;
              if (r.selectedOption !== null && r.selectedOption !== undefined) {
                const par = getSubjectThresholds(q.subject).parSec;
                totalParWeightedRatio += (spent / par);
              }
            }
          });
        }
      });

      const rawAcc = totalAtt > 0 ? (totalCor / totalAtt) * 100 : 0;
      const acc = Math.round(rawAcc);
      const avgSpeed = totalAtt > 0 ? Math.round(totalMockSec / totalAtt) : 0;

      const attemptRatio = totalQuestionsInMocks > 0 ? Math.min(1, (totalAtt / totalQuestionsInMocks) / 0.70) : 1;
      const effectiveAcc = rawAcc * (0.4 + 0.6 * attemptRatio);
      const accComp = parseFloat((effectiveAcc * 0.50).toFixed(1));

      const avgParRatio = totalAtt > 0 ? (totalParWeightedRatio / totalAtt) : 1;
      let velScore = 100;
      if (avgParRatio > 1.0) {
        velScore = Math.max(20, 100 - (avgParRatio - 1.0) * 55);
      }
      const velComp = parseFloat((velScore * 0.30).toFixed(1));

      const volumeBonus = Math.min(100, (standardMocksCount * 10) + (totalAtt * 0.25));
      const consistencyComp = parseFloat((volumeBonus * 0.20).toFixed(1));
      const totalERI = Math.min(100, Math.max(5, accComp + velComp + consistencyComp)).toFixed(1);

      return {
        totalMocks: standardMocksCount || completed.length,
        accuracy: acc,
        avgSpeed: avgSpeed,
        trapsHit: traps,
        eri: totalERI,
        accComp: accComp,
        velComp: velComp,
        consistencyComp: consistencyComp,
        totalStudyTimeSec: totalMockSec + universalStudyTimeSec
      };
    },

    async getChapterStats(subKey, chapter) {
      const completed = await this.getHistoricalAttempts(true);
      let attempted = 0, correct = 0, totalTimeSec = 0, wrongCount = 0, lastSeenEpoch = 0;

      completed.forEach(att => {
        if (Array.isArray(att.questions) && att.userResponses) {
          att.questions.forEach(q => {
            if (q.subject === subKey && q.chapter === chapter) {
              const resp = att.userResponses[q.id];
              if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
                attempted++;
                totalTimeSec += (resp.timeSpentSec || 0);
                lastSeenEpoch = Math.max(lastSeenEpoch, resp.timestamp || att.timestamp || 0);
                if (resp.selectedOption === q.correctIndex) {
                  correct++;
                } else {
                  wrongCount++;
                }
              }
            }
          });
        }
      });

      const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      const avgSpeed = attempted > 0 ? Math.round(totalTimeSec / attempted) : 0;
      const daysSinceLast = lastSeenEpoch > 0 ? calcGapDays(Date.now(), lastSeenEpoch) : 99;
      const unifiedNc = attempted > 0
        ? Math.min(1.0, ((daysSinceLast / 14) * 0.65) + (Math.max(0, 1 - attempted / 40) * 0.35)).toFixed(2)
        : "1.00";

      return {
        subject: subKey,
        chapter: chapter,
        attempted: attempted,
        correct: correct,
        wrong: wrongCount,
        accuracy: accuracy,
        avgSpeed: avgSpeed,
        lastSeenEpoch: lastSeenEpoch,
        daysSinceLast: daysSinceLast,
        neglectIndex: unifiedNc,
        isWeak: attempted >= 2 && accuracy < 65
      };
    },

    async getWeakChapters(subKey = null) {
      const taxonomy = await TaxonomyService.getTaxonomy();
      const weakList = [];

      for (const sKey of Object.keys(taxonomy)) {
        if (subKey && subKey !== "ALL" && sKey !== subKey) continue;
        for (const chap of taxonomy[sKey].chapters) {
          const stats = await this.getChapterStats(sKey, chap);
          if (stats.attempted > 0 && stats.accuracy < 65) {
            weakList.push(stats);
          }
        }
      }
      return weakList.sort((a, b) => a.accuracy - b.accuracy);
    },

    async getQuestionPerformanceMap() {
      const completed = await this.getHistoricalAttempts(true);
      const map = {};

      completed.slice().sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)).forEach(att => {
        if (Array.isArray(att.questions) && att.userResponses) {
          att.questions.forEach(q => {
            const resp = att.userResponses[q.id];
            if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
              const targetIds = [q.id];
              if (q.remediatesQuestionId) {
                targetIds.push(q.remediatesQuestionId);
              }

              targetIds.forEach(tId => {
                if (!map[tId]) {
                  map[tId] = {
                    attempts: 0,
                    correct: 0,
                    incorrect: 0,
                    totalTime: 0,
                    lastAttemptEpoch: 0,
                    lastIncorrectEpoch: 0,
                    lastWasIncorrect: false,
                    lastSetupSec: null,
                    lastCalcSec: null,
                    traps: []
                  };
                }
                const stats = map[tId];
                const eventEpoch = resp.timestamp || att.timestamp || 0;
                stats.attempts++;
                stats.totalTime += (resp.timeSpentSec || 0);
                stats.lastAttemptEpoch = Math.max(stats.lastAttemptEpoch, eventEpoch);

                if (resp.setupSec !== null && resp.setupSec !== undefined) {
                  stats.lastSetupSec = resp.setupSec;
                  stats.lastCalcSec = resp.calcSec !== null && resp.calcSec !== undefined ? resp.calcSec : 0;
                }

                if (resp.selectedOption === q.correctIndex) {
                  stats.correct++;
                  const par = getSubjectThresholds(q.subject).parSec;
                  if (att.mockType === "DOJO_CLINIC" || (resp.timeSpentSec || 0) <= par * 1.35) {
                    stats.lastWasIncorrect = false;
                  }
                } else {
                  stats.incorrect++;
                  stats.lastWasIncorrect = true;
                  stats.lastIncorrectEpoch = Math.max(stats.lastIncorrectEpoch || 0, eventEpoch);
                  if (resp.errorTag && resp.errorTag !== "UNCLASSIFIED") {
                    stats.traps.push(resp.errorTag);
                  }
                }
              });
            }
          });
        }
      });
      return map;
    },

    async calculateNeglect() {
      const completed = await this.getHistoricalAttempts(true);
      if (completed.length === 0) return null;

      const taxonomy = await TaxonomyService.getTaxonomy();
      const now = Date.now();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      let worstChapter = null;
      let maxNeglectMs = 0;

      for (const sKey of Object.keys(taxonomy)) {
        for (const chap of taxonomy[sKey].chapters) {
          let lastSeen = 0;
          for (const att of completed) {
            if (Array.isArray(att.questions) && att.questions.some(q => q.chapter === chap)) {
              lastSeen = Math.max(lastSeen, att.timestamp);
            }
          }

          if (lastSeen > 0) {
            const diff = now - lastSeen;
            if (diff > sevenDaysMs && diff > maxNeglectMs) {
              maxNeglectMs = diff;
              worstChapter = {
                subject: sKey,
                chapter: chap,
                days: Math.floor(diff / (24 * 60 * 60 * 1000)),
                isNever: false
              };
            }
          }
        }
      }
      return worstChapter;
    }
  };
  /* ==========================================================================
   * SECTION 18: SHARED SERVICE — MOCK SERVICE & OPTION PERMUTATION ENGINE
   * ========================================================================== */
  const MockService = {
    shuffle(array, seed = null) {
      let m = array.length, t, i;
      let randomFn = Math.random;

      if (seed && typeof seed === "string") {
        let hash = 0;
        for (let j = 0; j < seed.length; j++) {
          hash = (hash << 5) - hash + seed.charCodeAt(j);
          hash |= 0;
        }
        randomFn = () => {
          hash = (hash * 9301 + 49297) % 233280;
          return Math.abs(hash / 233280);
        };
      }

      while (m) {
        i = Math.floor(randomFn() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    },

    permuteQuestionOptions(q, seed = null) {
      const clone = JSON.parse(JSON.stringify(q));
      if (!Array.isArray(clone.options) || clone.options.length !== 4) return clone;
      const indexed = clone.options.map((text, idx) => ({
        text,
        isCorrect: idx === clone.correctIndex
      }));
      this.shuffle(indexed, seed ? `${seed}_${clone.id}` : null);
      clone.options = indexed.map(item => item.text);
      clone.correctIndex = indexed.findIndex(item => item.isCorrect);
      return clone;
    },

    async generate(config) {
      const {
        title = "SSC CGL Practice Mock",
        count = 25,
        durationMin = 15,
        subject = "ALL",
        chapter = "ALL",
        chapters = [],
        difficulty = "ALL",
        mode = "RANDOM",
        excludeRecentMocks = false,
        recentMockWindow = 3,
        randomizeOrder = true,
        shuffleOptions = false,
        allowFallbackPadding = false,
        positiveMarks = 2.0,
        negativeMarks = 0.5,
        isSectionLocked = false,
        ephemeral = false,
        persistQuestions = true,
        explicitQuestionIds = [],
        customQuestions = [],
        sections = null,
        seed = null
      } = config;

      const isEphemeralMock = (ephemeral === true || persistQuestions === false);
      const isLocked = (isSectionLocked === true || isSectionLocked === "YES");
      const allBankQuestions = await getAllRecords("store_questions");
      const attempts = await getAllRecords("store_attempts");
      const completed = attempts.filter(a => a.completed).sort((a, b) => b.timestamp - a.timestamp);
      const perfMap = await PerformanceService.getQuestionPerformanceMap();

      let sectionConfigs = [];
      if (Array.isArray(sections) && sections.length > 0) {
        sectionConfigs = sections.map((s, idx) => ({
          id: s.id || `SEC_${idx + 1}_${s.subject || "GEN"}`,
          subject: s.subject || "ALL",
          name: s.name || `${TAXONOMY[s.subject]?.name || s.subject || "Section"} (Part ${idx + 1})`,
          count: parseInt(s.count, 10) || Math.round(count / sections.length),
          durationMin: parseInt(s.durationMin, 10) || Math.round(durationMin / sections.length),
          explicitQuestionIds: Array.isArray(s.explicitQuestionIds) ? s.explicitQuestionIds : [],
          customQuestions: Array.isArray(s.customQuestions) ? s.customQuestions : [],
          chapter: s.chapter || "ALL",
          chapters: Array.isArray(s.chapters) ? s.chapters : [],
          mode: s.mode || mode,
          difficulty: s.difficulty || difficulty
        }));
      } else if (subject === "ALL" && (count === 100 || count >= 80) && mode !== "WEAKNESS" && mode !== "STARRED") {
        const tier1Subs = ["REAS", "GA", "QA", "ENG"];
        const secDuration = Math.round(durationMin / tier1Subs.length);
        const secCount = Math.round(count / tier1Subs.length);
        sectionConfigs = tier1Subs.map((subKey, idx) => ({
          id: `SEC_${idx + 1}_${subKey}`,
          subject: subKey,
          name: `${TAXONOMY[subKey]?.name || subKey}`,
          count: secCount,
          durationMin: secDuration,
          explicitQuestionIds: [],
          customQuestions: [],
          chapter: "ALL",
          chapters: [],
          mode: mode,
          difficulty: difficulty
        }));
      } else {
        sectionConfigs = [{
          id: "SEC_1",
          subject: subject,
          name: title,
          count: count,
          durationMin: durationMin,
          explicitQuestionIds: Array.isArray(explicitQuestionIds) ? explicitQuestionIds : [],
          customQuestions: Array.isArray(customQuestions) ? customQuestions : [],
          chapter: chapter,
          chapters: chapters,
          mode: mode,
          difficulty: difficulty
        }];
      }

      if (sectionConfigs.length > 1) {
        if (Array.isArray(explicitQuestionIds) && explicitQuestionIds.length > 0) {
          explicitQuestionIds.forEach(id => {
            const found = allBankQuestions.find(q => q.id === id);
            if (found) {
              const targetSec = sectionConfigs.find(s => s.subject === found.subject) || sectionConfigs[0];
              if (!targetSec.explicitQuestionIds.includes(id)) {
                targetSec.explicitQuestionIds.push(id);
              }
            }
          });
        }
        if (Array.isArray(customQuestions) && customQuestions.length > 0) {
          customQuestions.forEach(cq => {
            const targetSec = sectionConfigs.find(s => s.subject === cq.subject) || sectionConfigs[0];
            targetSec.customQuestions.push(cq);
          });
        }
      }

      const allFinalQuestions = [];
      const configuredSections = [];
      let globalCounter = 1;
      const sessionGlobalUsedIds = new Set();

      for (let sIdx = 0; sIdx < sectionConfigs.length; sIdx++) {
        const secCfg = sectionConfigs[sIdx];
        const secQuestions = [];
        const secUsedIds = new Set();
        const secTarget = Math.max(secCfg.count, secCfg.explicitQuestionIds.length + secCfg.customQuestions.length);

        for (const id of secCfg.explicitQuestionIds) {
          if (secQuestions.length >= secTarget) break;
          const found = allBankQuestions.find(q => q.id === id);
          if (found && !sessionGlobalUsedIds.has(found.id) && !secUsedIds.has(found.id)) {
            secQuestions.push({ ...found });
            secUsedIds.add(found.id);
            sessionGlobalUsedIds.add(found.id);
          }
        }

        for (const rawCustom of secCfg.customQuestions) {
          if (secQuestions.length >= secTarget) break;
          const item = sanitizeQuestion(rawCustom);
          const shouldPersist = (rawCustom.ephemeral === false || rawCustom.persist === true) && !isEphemeralMock;

          if (shouldPersist) {
            await putRecord("store_questions", item);
            SearchService.invalidate();
          } else {
            item.ephemeral = true;
          }

          if (!sessionGlobalUsedIds.has(item.id) && !secUsedIds.has(item.id)) {
            secQuestions.push(item);
            secUsedIds.add(item.id);
            sessionGlobalUsedIds.add(item.id);
          }
        }

        const needed = secTarget - secQuestions.length;
        if (needed > 0) {
          const targetChapters = (secCfg.chapters && secCfg.chapters.length > 0)
            ? secCfg.chapters
            : (secCfg.chapter !== "ALL" ? [secCfg.chapter] : []);

          let candidatePool = allBankQuestions.filter(q => {
            if (secCfg.subject !== "ALL" && q.subject !== secCfg.subject) return false;
            if (targetChapters.length > 0 && !targetChapters.includes(q.chapter)) return false;
            if (secCfg.difficulty !== "ALL" && q.difficulty !== secCfg.difficulty) return false;
            if (sessionGlobalUsedIds.has(q.id) || secUsedIds.has(q.id)) return false;
            return true;
          });

          if (excludeRecentMocks && completed.length > 0) {
            const recentQIds = new Set();
            completed.slice(0, recentMockWindow).forEach(att => {
              (att.questions || []).forEach(q => recentQIds.add(q.id));
            });
            const filteredPool = candidatePool.filter(q => !recentQIds.has(q.id));
            if (filteredPool.length >= Math.min(needed, candidatePool.length)) {
              candidatePool = filteredPool;
            }
          }

          let prioritized = candidatePool;
          if (secCfg.mode === "UNATTEMPTED" || secCfg.mode === "UNSEEN") {
            const p = candidatePool.filter(q => !perfMap[q.id] || perfMap[q.id].attempts === 0);
            if (p.length > 0) prioritized = p;
          } else if (secCfg.mode === "INCORRECT") {
            const p = candidatePool.filter(q => perfMap[q.id] && (perfMap[q.id].lastWasIncorrect || perfMap[q.id].incorrect > 0));
            if (p.length > 0) prioritized = p;
          } else if (secCfg.mode === "WEAKNESS") {
            const p = candidatePool.filter(q => {
              const st = perfMap[q.id];
              return st && st.attempts > 0 && (st.lastWasIncorrect || Math.round((st.correct / st.attempts) * 100) < 65 || st.traps.length > 0);
            });
            if (p.length > 0) prioritized = p;
          } else if (secCfg.mode === "STARRED") {
            const p = candidatePool.filter(q => q.bookmarked);
            if (p.length > 0) prioritized = p;
          } else if (secCfg.mode === "IGNORED") {
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            const p = candidatePool.filter(q => perfMap[q.id] && perfMap[q.id].lastAttemptEpoch < sevenDaysAgo);
            if (p.length > 0) prioritized = p;
          }

          const shuffledCandidates = this.shuffle([...prioritized], seed);

          for (const q of shuffledCandidates) {
            if (secQuestions.length >= secTarget) break;
            if (sessionGlobalUsedIds.has(q.id) || secUsedIds.has(q.id)) continue;

            if (q.parentPassageId) {
              const siblings = allBankQuestions
                .filter(item => item.parentPassageId === q.parentPassageId)
                .sort((a, b) => (a.setOrder || 1) - (b.setOrder || 1));
              const unadded = siblings.filter(s => !sessionGlobalUsedIds.has(s.id) && !secUsedIds.has(s.id));

              if (secQuestions.length + unadded.length <= secTarget || secQuestions.length === 0) {
                for (const sib of unadded) {
                  if (secQuestions.length < secTarget) {
                    secQuestions.push({ ...sib });
                    secUsedIds.add(sib.id);
                    sessionGlobalUsedIds.add(sib.id);
                  }
                }
              }
            } else {
              secQuestions.push({ ...q });
              secUsedIds.add(q.id);
              sessionGlobalUsedIds.add(q.id);
            }
          }

          if (allowFallbackPadding && secQuestions.length < secTarget) {
            const fallbackBank = allBankQuestions.filter(q => {
              if (secCfg.subject !== "ALL" && q.subject !== secCfg.subject) return false;
              return !sessionGlobalUsedIds.has(q.id) && !secUsedIds.has(q.id);
            });
            const shuffledFallback = this.shuffle([...fallbackBank], seed);
            for (const fq of shuffledFallback) {
              if (secQuestions.length >= secTarget) break;
              secQuestions.push({ ...fq });
              secUsedIds.add(fq.id);
              sessionGlobalUsedIds.add(fq.id);
            }
          }
        }

        let finalSectionList = secQuestions;
        if (randomizeOrder) {
          const blocks = [];
          const seenPassages = new Set();
          secQuestions.forEach(q => {
            if (q.parentPassageId) {
              if (!seenPassages.has(q.parentPassageId)) {
                seenPassages.add(q.parentPassageId);
                const s = secQuestions.filter(item => item.parentPassageId === q.parentPassageId);
                blocks.push(s);
              }
            } else {
              blocks.push([q]);
            }
          });
          this.shuffle(blocks, seed);
          finalSectionList = [];
          blocks.forEach(b => finalSectionList.push(...b));
        }

        finalSectionList.forEach((q, lIdx) => {
          const finalQ = shuffleOptions ? this.permuteQuestionOptions(q, seed) : { ...q };
          finalQ.sectionIndex = sIdx;
          finalQ.sectionName = secCfg.name;
          finalQ.localNumber = lIdx + 1;
          finalQ.globalNumber = globalCounter++;
          allFinalQuestions.push(finalQ);
        });

        configuredSections.push({
          id: secCfg.id,
          subject: secCfg.subject,
          name: secCfg.name,
          durationSec: secCfg.durationMin * 60,
          questionCount: finalSectionList.length,
          locked: false
        });
      }

      return {
        title: title,
        durationMin: durationMin,
        positiveMarks: parseFloat(positiveMarks) || 2.0,
        negativeMarks: parseFloat(negativeMarks) >= 0 ? parseFloat(negativeMarks) : 0.5,
        isSectionLocked: isLocked,
        isEphemeral: isEphemeralMock,
        sections: configuredSections,
        questions: allFinalQuestions,
        seed: seed || Date.now().toString(),
        totalSelected: allFinalQuestions.length
      };
    },

    async saveMockDefinition(mockData) {
      const clean = sanitizeSavedMock(mockData);
      await putRecord("store_saved_mocks", clean);
      return clean;
    },

    async deleteMock(mockId) {
      const existing = await getRecord("store_saved_mocks", mockId);
      if (!existing) throw new Error(`Saved mock ${mockId} not found.`);

      await deleteRecordFromStore("store_saved_mocks", mockId);
      return { id: mockId, deleted: true };
    },

    async launchMockSession(mockInstance) {
      const { title, questions, durationMin, isSectionLocked, sections, isEphemeral, positiveMarks, negativeMarks } = mockInstance;
      if (!questions || questions.length === 0) {
        alert("Zero matching questions found in the bank for this scope.");
        return;
      }
      await compileAndLaunchArena(title, questions, durationMin, isSectionLocked, sections, isEphemeral, positiveMarks, negativeMarks);
    }
  };

  /* ==========================================================================
   * SECTION 19: MOCK LAB / BUILDER & FULL-FIDELITY PREVIEW / CURATION MODAL
   * ========================================================================== */
  let activeMockStrategy = "RANDOM";
  let customSequenceRows = [];

  function handleMarkingPresetChange(preset) {
    const posEl = document.getElementById("builder-mark-pos");
    const negEl = document.getElementById("builder-mark-neg");
    if (!posEl || !negEl) return;

    if (preset === "TIER_1") {
      posEl.value = "2.0";
      negEl.value = "0.5";
    } else if (preset === "TIER_2") {
      posEl.value = "3.0";
      negEl.value = "1.0";
    } else if (preset === "PRACTICE") {
      posEl.value = "1.0";
      negEl.value = "0.0";
    }
  }

  function setMockStrategy(strategy, btnEl) {
    activeMockStrategy = strategy;
    document.querySelectorAll('[id^="strat-pill-"]').forEach(el => el.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");

    const wrap = document.getElementById("custom-sequence-stack-wrap");
    if (strategy === "CUSTOM_BUILDER") {
      if (wrap) wrap.style.display = "block";
      if (customSequenceRows.length === 0) {
        customSequenceRows = [
          { id: 1, subject: "QA", chapter: "ALL", count: 25, durationMin: 15 },
          { id: 2, subject: "ENG", chapter: "ALL", count: 25, durationMin: 15 }
        ];
      }
      renderCustomSequenceRows();
    } else {
      if (wrap) wrap.style.display = "none";
    }

    updateBuilderPoolEstimate();
  }

  function updateBuilderChapters(subKey) {
    const sel = document.getElementById("builder-chapter");
    if (sel) {
      sel.innerHTML = `<option value="ALL">All Chapters (Use Matrix Below)</option>`;
    }

    const chipsWrap = document.getElementById("builder-chapter-chips-wrap");
    if (chipsWrap) chipsWrap.innerHTML = "";

    const availableChapters = [];
    if (subKey === "ALL") {
      Object.keys(TAXONOMY).forEach(k => {
        if (Array.isArray(TAXONOMY[k].chapters)) {
          TAXONOMY[k].chapters.forEach(c => availableChapters.push(c));
        }
      });
    } else {
      const sub = TAXONOMY[subKey];
      if (sub && Array.isArray(sub.chapters)) {
        sub.chapters.forEach(c => {
          availableChapters.push(c);
          if (sel) {
            const opt = document.createElement("option");
            opt.value = c;
            opt.innerText = c;
            sel.appendChild(opt);
          }
        });
      }
    }

    if (chipsWrap) {
      availableChapters.forEach(chap => {
        const chip = document.createElement("div");
        chip.className = "matrix-chip" + (mockLabSelectedMatrixChapters.has(chap) ? " selected" : "");
        chip.innerText = chap;
        chip.onclick = () => handleBuilderChapterChipToggle(chap, chip);
        chipsWrap.appendChild(chip);
      });
    }

    updateBuilderPoolEstimate();
    if (activeMockStrategy === "CUSTOM_BUILDER") {
      renderCustomSequenceRows();
    }
  }

  function handleBuilderChapterSelectChange(val) {
    if (val !== "ALL") {
      mockLabSelectedMatrixChapters.clear();
      mockLabSelectedMatrixChapters.add(val);
      syncBuilderMatrixChipsDisplay();
    }
    updateBuilderPoolEstimate();
  }

  function handleBuilderChapterChipToggle(chap, chipEl) {
    if (mockLabSelectedMatrixChapters.has(chap)) {
      mockLabSelectedMatrixChapters.delete(chap);
      chipEl.classList.remove("selected");
    } else {
      mockLabSelectedMatrixChapters.add(chap);
      chipEl.classList.add("selected");
    }
    updateBuilderPoolEstimate();
  }

  function toggleAllBuilderMatrixChips(selectAll) {
    const chips = document.querySelectorAll("#builder-chapter-chips-wrap .matrix-chip");
    chips.forEach(chip => {
      const chap = chip.innerText.trim();
      if (selectAll) {
        mockLabSelectedMatrixChapters.add(chap);
        chip.classList.add("selected");
      } else {
        mockLabSelectedMatrixChapters.delete(chap);
        chip.classList.remove("selected");
      }
    });
    updateBuilderPoolEstimate();
  }

  function syncBuilderMatrixChipsDisplay() {
    const chips = document.querySelectorAll("#builder-chapter-chips-wrap .matrix-chip");
    chips.forEach(chip => {
      chip.classList.toggle("selected", mockLabSelectedMatrixChapters.has(chip.innerText.trim()));
    });
  }

  async function updateBuilderPoolEstimate() {
    const sub = document.getElementById("builder-subject")?.value || "ALL";
    const diff = document.getElementById("builder-difficulty")?.value || "ALL";
    const allQs = await getAllRecords("store_questions");

    const pool = allQs.filter(q => {
      if (sub !== "ALL" && q.subject !== sub) return false;
      if (diff !== "ALL" && q.difficulty !== diff) return false;
      if (mockLabSelectedMatrixChapters.size > 0 && !mockLabSelectedMatrixChapters.has(q.chapter)) return false;
      return true;
    });

    safeSetText("builder-pool-estimate", `Estimated pool: ${pool.length} matching questions`);
  }

  /**
   * INTERACTIVE FULL-FIDELITY MOCK PREVIEW & CURATION MODAL:
   * Displays all N sampled questions with KaTeX math, options, toggleable answer
   * keys, and per-question Swap / Remove actions.
   */
  async function previewMockSelection() {
    try {
      const config = getActiveBuilderConfig();
      previewedMockInstance = await MockService.generate(config);
      if (!previewedMockInstance.questions || previewedMockInstance.questions.length === 0) {
        alert("Zero matching questions in current scope.");
        return;
      }
      showPreviewAnswerKeys = false;
      const keyBtn = document.getElementById("btn-preview-toggle-keys");
      if (keyBtn) keyBtn.innerText = "\uD83D\uDC41\uFE0F Show Answer Keys";

      renderMockPreviewModalContent();
      pushHistoryState("modal-mock-preview");
      const m = document.getElementById("modal-mock-preview");
      if (m) m.classList.add("active");
    } catch (err) {
      alert("Preview Error: " + err.message);
    }
  }

  function renderMockPreviewModalContent() {
    if (!previewedMockInstance) return;
    const qs = previewedMockInstance.questions || [];
    safeSetText("mock-preview-modal-title", previewedMockInstance.title);
    safeSetText(
      "mock-preview-modal-sub",
      `${qs.length} Questions Sampled \u2022 Marking: +${previewedMockInstance.positiveMarks} / -${previewedMockInstance.negativeMarks} \u2022 Duration: ${previewedMockInstance.durationMin}m`
    );

    const listEl = document.getElementById("mock-preview-questions-list");
    if (!listEl) return;
    listEl.innerHTML = "";

    if (qs.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Queue is empty.</div>`;
      return;
    }

    qs.forEach((q, idx) => {
      const card = document.createElement("div");
      card.className = "mock-preview-q-card";

      const optsHtml = (q.options || []).map((opt, oIdx) => {
        const isCor = showPreviewAnswerKeys && oIdx === q.correctIndex;
        return `<div class="mock-preview-opt-item ${isCor ? "correct-opt" : ""}"><b>(${oIdx + 1})</b> ${formatRichText(opt)} ${isCor ? "\u2713" : ""}</div>`;
      }).join("");

      const expHtml = showPreviewAnswerKeys
        ? `<div style="margin-top:10px; padding:8px 10px; background:#070a12; border-left:3px solid var(--status-green); border-radius:4px; font-size:12px;"><b>Key: Option ${q.correctIndex + 1}</b><br>${formatRichText(q.explanation || "No derivation registered.")}</div>`
        : "";

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span class="q-number-pill" style="padding:2px 8px; font-size:11px;">Q${idx + 1}</span>
            <span class="badge" style="background:#1f6feb;">${q.subject} \u2022 ${q.chapter}</span>
            <span class="badge" style="background:#151a24; color:var(--accent-cyan);">${q.difficulty || "MEDIUM"}</span>
            <span style="font-family:var(--font-mono); font-size:10.5px; color:var(--text-muted);">${q.id}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary" style="padding:2px 8px; font-size:10.5px; color:var(--accent-cyan);" onclick="CGL_OS.swapPreviewedQuestion(${idx})" title="Swap with another question from pool">\uD83D\uDD04 Swap</button>
            <button class="btn btn-danger" style="padding:2px 8px; font-size:10.5px;" onclick="CGL_OS.removePreviewedQuestion(${idx})" title="Remove from queue">\u2715 Remove</button>
          </div>
        </div>
        ${q.passageText ? `<div class="q-passage-container" style="font-size:12px; padding:8px 10px; margin-bottom:8px;"><b>Passage:</b> ${formatRichText(q.passageText)}</div>` : ""}
        <div style="font-size:13.8px; color:#fff; line-height:1.6;">${formatRichText(q.questionText)}</div>
        ${q.imageUrl ? `<div style="text-align:center; margin:8px 0;"><img src="${q.imageUrl}" style="max-height:140px; border-radius:6px;"></div>` : ""}
        <div class="mock-preview-opt-grid">${optsHtml}</div>
        ${expHtml}
      `;
      listEl.appendChild(card);
    });
  }

  function toggleMockPreviewAnswerKeys() {
    showPreviewAnswerKeys = !showPreviewAnswerKeys;
    const btn = document.getElementById("btn-preview-toggle-keys");
    if (btn) {
      btn.innerText = showPreviewAnswerKeys ? "\uD83D\uDE48 Hide Answer Keys" : "\uD83D\uDC41\uFE0F Show Answer Keys";
    }
    renderMockPreviewModalContent();
  }

  async function swapPreviewedQuestion(idx) {
    if (!previewedMockInstance || !previewedMockInstance.questions[idx]) return;
    const targetQ = previewedMockInstance.questions[idx];
    const usedIds = new Set(previewedMockInstance.questions.map(q => q.id));
    const allQs = await getAllRecords("store_questions");

    let candidates = allQs.filter(q => q.chapter === targetQ.chapter && !usedIds.has(q.id));
    if (candidates.length === 0) {
      candidates = allQs.filter(q => q.subject === targetQ.subject && !usedIds.has(q.id));
    }
    if (candidates.length === 0) {
      alert("No alternative unused questions available in this chapter/subject pool to swap.");
      return;
    }

    const replacement = { ...candidates[Math.floor(Math.random() * candidates.length)] };
    replacement.sectionIndex = targetQ.sectionIndex;
    replacement.sectionName = targetQ.sectionName;
    replacement.localNumber = targetQ.localNumber;
    replacement.globalNumber = targetQ.globalNumber;

    previewedMockInstance.questions[idx] = replacement;
    renderMockPreviewModalContent();
  }

  function removePreviewedQuestion(idx) {
    if (!previewedMockInstance || !previewedMockInstance.questions[idx]) return;
    previewedMockInstance.questions.splice(idx, 1);
    previewedMockInstance.questions.forEach((q, i) => {
      q.globalNumber = i + 1;
    });
    renderMockPreviewModalContent();
  }

  async function launchPreviewedQueueInDojo() {
    if (!previewedMockInstance || previewedMockInstance.questions.length === 0) return;
    document.getElementById("modal-mock-preview")?.classList.remove("active");
    document.getElementById("modal-mock-builder")?.classList.remove("active");
    await openDojoSessionWithQuestions(previewedMockInstance.questions, `${previewedMockInstance.title} (Dojo)`);
  }

  async function launchPreviewedQueueAsMock() {
    if (!previewedMockInstance || previewedMockInstance.questions.length === 0) return;
    document.getElementById("modal-mock-preview")?.classList.remove("active");
    document.getElementById("modal-mock-builder")?.classList.remove("active");
    await MockService.launchMockSession(previewedMockInstance);
  }

  async function savePreviewedQueueAsFixedPaper() {
    if (!previewedMockInstance || previewedMockInstance.questions.length === 0) return;
    const title = prompt("Enter title for this Curated Fixed Paper:", previewedMockInstance.title);
    if (!title || !title.trim()) return;

    await MockService.saveMockDefinition({
      title: title.trim(),
      type: "FIXED_PAPER",
      isSectionLocked: previewedMockInstance.isSectionLocked,
      positiveMarks: previewedMockInstance.positiveMarks,
      negativeMarks: previewedMockInstance.negativeMarks,
      sections: previewedMockInstance.sections,
      questions: previewedMockInstance.questions
    });

    alert(`Saved curated fixed paper "${title.trim()}" to Dashboard!`);
    await renderDashboardBlueprints();
  }

  function getActiveBuilderConfig() {
    const sub = document.getElementById("builder-subject")?.value || "ALL";
    const count = parseInt(document.getElementById("builder-count")?.value || "25", 10);
    const duration = parseInt(document.getElementById("builder-duration")?.value || "15", 10);
    const diff = document.getElementById("builder-difficulty")?.value || "ALL";
    const avoidRecent = document.getElementById("builder-avoid-recent")?.checked ?? true;
    const shuffle = document.getElementById("builder-shuffle")?.checked ?? true;
    const shuffleOptions = document.getElementById("builder-shuffle-options")?.checked ?? false;
    const strictPool = document.getElementById("builder-strict-pool")?.checked ?? true;
    const posMarks = parseFloat(document.getElementById("builder-mark-pos")?.value || "2.0");
    const negMarks = parseFloat(document.getElementById("builder-mark-neg")?.value || "0.5");

    const chosenChapters = Array.from(mockLabSelectedMatrixChapters);

    return {
      title: chosenChapters.length > 0
        ? `${chosenChapters.slice(0, 2).join(" & ")} Practice`
        : (sub !== "ALL" ? `${sub} Sectional (${activeMockStrategy})` : `Targeted ${activeMockStrategy} Mock`),
      subject: sub,
      chapter: "ALL",
      chapters: chosenChapters,
      count: count,
      durationMin: duration,
      difficulty: diff,
      mode: activeMockStrategy,
      excludeRecentMocks: avoidRecent,
      randomizeOrder: shuffle,
      shuffleOptions: shuffleOptions,
      allowFallbackPadding: !strictPool,
      positiveMarks: isNaN(posMarks) ? 2.0 : posMarks,
      negativeMarks: isNaN(negMarks) ? 0.5 : negMarks,
      isSectionLocked: false
    };
  }

  function openCustomMockModal() {
    setMockStrategy("RANDOM", document.getElementById("strat-pill-random"));
    updateBuilderChapters("ALL");
    pushHistoryState("modal-mock-builder");
    const m = document.getElementById("modal-mock-builder");
    if (m) m.classList.add("active");
  }

  function addCustomSectionRow() {
    const nextId = customSequenceRows.length + 1;
    customSequenceRows.push({ id: nextId, subject: "QA", chapter: "ALL", count: 25, durationMin: 15 });
    renderCustomSequenceRows();
  }

  function removeCustomSectionRow(idx) {
    if (customSequenceRows.length > 1) {
      customSequenceRows.splice(idx, 1);
      renderCustomSequenceRows();
    }
  }

  function renderCustomSequenceRows() {
    const container = document.getElementById("custom-sequence-rows-container");
    if (!container) return;
    container.innerHTML = "";

    customSequenceRows.forEach((row, idx) => {
      const div = document.createElement("div");
      div.style.background = "var(--bg-elevated)";
      div.style.border = "1px solid var(--border-color)";
      div.style.borderRadius = "8px";
      div.style.padding = "10px";
      div.style.marginBottom = "8px";

      const subChapters = TAXONOMY[row.subject] ? TAXONOMY[row.subject].chapters : [];
      const activeMatrixForSub = Array.from(mockLabSelectedMatrixChapters).filter(c => subChapters.includes(c));
      const matrixBadge = activeMatrixForSub.length > 0
        ? `<span style="font-size:10px; color:var(--accent-cyan); font-weight:700;">[Matrix: ${activeMatrixForSub.length} chapter(s) active]</span>`
        : `<span style="font-size:10px; color:var(--text-muted);">[Matrix: All chapters]</span>`;

      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; font-size:12px; color:var(--accent-cyan);">Section ${idx + 1}</span>
            ${matrixBadge}
          </div>
          ${customSequenceRows.length > 1 ? `<button class="btn btn-secondary" style="padding:2px 6px; font-size:10px; color:var(--status-red);" onclick="CGL_OS.removeCustomSectionRow(${idx})">Remove</button>` : ""}
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:6px;">
          <div>
            <label style="font-size:10px; color:var(--text-muted);">Subject</label>
            <select class="form-control" style="padding:6px; font-size:11px;" onchange="CGL_OS.updateCustomRowSubject(${idx}, this.value)">
              ${Object.keys(TAXONOMY).map(k => `<option value="${k}" ${row.subject === k ? "selected" : ""}>${k}</option>`).join("")}
            </select>
          </div>
          <div>
            <label style="font-size:10px; color:var(--text-muted);">Chapter</label>
            <select class="form-control" style="padding:6px; font-size:11px;" onchange="CGL_OS.updateCustomRowChapter(${idx}, this.value)">
              <option value="ALL">All (Use Matrix)</option>
              ${subChapters.map(c => `<option value="${c}" ${row.chapter === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
          <div>
            <label style="font-size:10px; color:var(--text-muted);">Qs</label>
            <input type="number" class="form-control" style="padding:6px; font-size:11px;" value="${row.count}" min="1" max="100" onchange="CGL_OS.updateCustomRowCount(${idx}, this.value)">
          </div>
          <div>
            <label style="font-size:10px; color:var(--text-muted);">Mins</label>
            <input type="number" class="form-control" style="padding:6px; font-size:11px;" value="${row.durationMin}" min="1" max="120" onchange="CGL_OS.updateCustomRowDuration(${idx}, this.value)">
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  }

  function updateCustomRowSubject(idx, val) {
    customSequenceRows[idx].subject = val;
    customSequenceRows[idx].chapter = "ALL";
    renderCustomSequenceRows();
  }
  function updateCustomRowChapter(idx, val) { customSequenceRows[idx].chapter = val; }
  function updateCustomRowCount(idx, val) { customSequenceRows[idx].count = parseInt(val, 10) || 25; }
  function updateCustomRowDuration(idx, val) { customSequenceRows[idx].durationMin = parseInt(val, 10) || 15; }

  function openSaveBlueprintModal(mode = "DYNAMIC_BLUEPRINT", targetId = "") {
    safeSetValue("save-preset-mode", mode);
    safeSetValue("save-preset-target-id", targetId);
    safeSetText("save-preset-modal-title", mode === "FIXED_PAPER" ? "Freeze Mock as Fixed Paper" : "Save Mock Blueprint");
    safeSetValue("blueprint-title-input", "");

    pushHistoryState("modal-save-blueprint");
    const m = document.getElementById("modal-save-blueprint");
    if (m) m.classList.add("active");
  }

  async function saveCurrentPresetAction() {
    const mode = document.getElementById("save-preset-mode")?.value || "DYNAMIC_BLUEPRINT";
    const targetId = document.getElementById("save-preset-target-id")?.value || "";
    const title = document.getElementById("blueprint-title-input")?.value.trim() || "";

    if (!title) {
      alert("Blueprint title is required.");
      return;
    }

    let record;
    if (mode === "FIXED_PAPER") {
      const attempts = await getAllRecords("store_attempts");
      const target = attempts.find(a => a.sessionId === targetId);
      if (!target || !target.questions || target.questions.length === 0) {
        alert("Unable to locate questions for fixed paper.");
        return;
      }

      record = {
        id: "paper_" + Date.now(),
        type: "FIXED_PAPER",
        title: title,
        isSectionLocked: !!target.isSectionLocked,
        positiveMarks: target.positiveMarks || 2.0,
        negativeMarks: target.negativeMarks !== undefined ? target.negativeMarks : 0.5,
        sections: target.sections ? JSON.parse(JSON.stringify(target.sections)) : [],
        questions: JSON.parse(JSON.stringify(target.questions))
      };
    } else {
      const isLock = document.getElementById("builder-sectional-lock")?.value === "YES";
      const cfg = getActiveBuilderConfig();
      record = {
        id: "bp_" + Date.now(),
        type: "DYNAMIC_BLUEPRINT",
        title: title,
        isSectionLocked: isLock,
        positiveMarks: cfg.positiveMarks,
        negativeMarks: cfg.negativeMarks,
        selectionRule: cfg,
        sections: JSON.parse(JSON.stringify(customSequenceRows)),
        questions: null
      };
    }

    await MockService.saveMockDefinition(record);
    const m = document.getElementById("modal-save-blueprint");
    if (m) m.classList.remove("active");
    alert(`Saved "${title}" (${mode === "FIXED_PAPER" ? "Fixed Question Paper" : "Dynamic Blueprint"}) to Dashboard.`);
    await renderDashboardBlueprints();
  }

  async function launchSavedPreset(id) {
    const preset = await getRecord("store_saved_mocks", id);
    if (!preset) return;

    if (preset.type === "FIXED_PAPER" && preset.questions && preset.questions.length > 0) {
      await MockService.launchMockSession(preset);
    } else {
      const rule = preset.selectionRule || {
        title: preset.title,
        count: 25,
        mode: "RANDOM",
        positiveMarks: preset.positiveMarks || 2.0,
        negativeMarks: preset.negativeMarks !== undefined ? preset.negativeMarks : 0.5
      };
      const instance = await MockService.generate(rule);
      await MockService.launchMockSession(instance);
    }
  }

  async function deleteSavedPreset(id) {
    if (confirm("Delete this saved mock setup? (Underlying question records will NOT be deleted)")) {
      await MockService.deleteMock(id);
      await renderDashboardBlueprints();
    }
  }

  async function launchConfiguredDojo() {
    const modal = document.getElementById("modal-mock-builder");
    if (modal) modal.classList.remove("active");
    const config = getActiveBuilderConfig();
    const instance = await MockService.generate(config);
    if (!instance.questions || instance.questions.length === 0) {
      alert("Zero matching questions found for this Dojo setup.");
      return;
    }
    await openDojoSessionWithQuestions(instance.questions, `${config.title} (Dojo Clinic)`);
  }

  async function launchConfiguredMock() {
    const modal = document.getElementById("modal-mock-builder");
    if (modal) modal.classList.remove("active");
    const baseCfg = getActiveBuilderConfig();

    if (activeMockStrategy === "CUSTOM_BUILDER") {
      const isLock = document.getElementById("builder-sectional-lock")?.value === "YES";
      const allQuestions = await getAllRecords("store_questions");

      let sections = [];
      let flattened = [];
      let signatureTags = [];
      let globalCounter = 1;

      for (let sIdx = 0; sIdx < customSequenceRows.length; sIdx++) {
        const row = customSequenceRows[sIdx];
        let pool = allQuestions.filter(q => q.subject === row.subject);

        const matrixChapsForSub = Array.from(mockLabSelectedMatrixChapters).filter(c => {
          return TAXONOMY[row.subject] && TAXONOMY[row.subject].chapters.includes(c);
        });

        if (row.chapter && row.chapter !== "ALL") {
          pool = pool.filter(q => q.chapter === row.chapter);
        } else if (matrixChapsForSub.length > 0) {
          pool = pool.filter(q => matrixChapsForSub.includes(q.chapter));
        }

        if (pool.length === 0 && !baseCfg.allowFallbackPadding) {
          continue;
        }
        if (pool.length === 0) pool = allQuestions.filter(q => q.subject === row.subject);

        const shuffled = MockService.shuffle([...pool]);
        const sectionQuestions = shuffled.slice(0, Math.min(row.count, shuffled.length));
        signatureTags.push(row.subject);

        const secObj = {
          id: `SEC_${sIdx + 1}_${row.subject}`,
          subject: row.subject,
          name: `${TAXONOMY[row.subject] ? TAXONOMY[row.subject].name : row.subject} (Sec ${sIdx + 1})`,
          durationSec: row.durationMin * 60,
          questionCount: sectionQuestions.length,
          locked: false
        };
        sections.push(secObj);

        sectionQuestions.forEach((q, qIdx) => {
          const itemQ = baseCfg.shuffleOptions ? MockService.permuteQuestionOptions(q) : { ...q };
          flattened.push({
            ...itemQ,
            sectionIndex: sIdx,
            sectionName: secObj.name,
            localNumber: qIdx + 1,
            globalNumber: globalCounter++
          });
        });
      }

      await compileAndLaunchArena(
        `Custom Routine (${signatureTags.join("\u2794")})`,
        flattened,
        customSequenceRows.reduce((a, b) => a + b.durationMin, 0),
        isLock,
        sections,
        false,
        baseCfg.positiveMarks,
        baseCfg.negativeMarks
      );
    } else {
      const instance = await MockService.generate(baseCfg);
      await MockService.launchMockSession(instance);
    }
  }

  async function launchConfiguredMockDirect(sub, chap, count, durMin) {
    const instance = await MockService.generate({
      title: `${chap === "ALL" ? sub : chap} Blitz Drill`,
      subject: sub,
      chapter: chap,
      count: count,
      durationMin: durMin,
      mode: "RANDOM",
      shuffleOptions: true
    });
    await MockService.launchMockSession(instance);
  }

  /* ==========================================================================
   * SECTION 20: TIMED EXAM ARENA, SPLIT-SCREEN SHEET DRAWER & AI TUTOR
   * ========================================================================== */
  function startExamTimers() {
    clearInterval(examTimerInterval);

    if (activeExam && activeExam.isReviewMode) {
      safeSetText("hud-countdown", "REVIEW");
      const cEl = document.getElementById("hud-countdown");
      if (cEl) cEl.className = "hud-timer";
      return;
    }

    lastTimerTickEpoch = Date.now();

    examTimerInterval = setInterval(() => {
      if (!activeExam || activeExam.isPaused || activeExam.isReviewMode) {
        lastTimerTickEpoch = Date.now();
        return;
      }

      const now = Date.now();
      const elapsedSec = Math.max(1, Math.round((now - lastTimerTickEpoch) / 1000));
      lastTimerTickEpoch = now;

      activeExam.sectionRemainingSec = Math.max(0, activeExam.sectionRemainingSec - elapsedSec);
      activeExam.currentQTimeSpentSec += elapsedSec;

      const curQ = activeExam.questions[activeExam.currentQuestionIndex];
      if (curQ && activeExam.userResponses[curQ.id]) {
        activeExam.userResponses[curQ.id].timeSpentSec += elapsedSec;
      }

      const m = Math.floor(activeExam.sectionRemainingSec / 60);
      const s = activeExam.sectionRemainingSec % 60;
      const clockEl = document.getElementById("hud-countdown");
      if (clockEl) {
        clockEl.innerText = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        if (activeExam.sectionRemainingSec < 180) clockEl.className = "hud-timer crimson";
        else if (activeExam.sectionRemainingSec < 300) clockEl.className = "hud-timer amber";
        else clockEl.className = "hud-timer";
      }

      const qm = Math.floor(activeExam.currentQTimeSpentSec / 60);
      const qs = activeExam.currentQTimeSpentSec % 60;
      safeSetText("arena-q-timer", `${String(qm).padStart(2, "0")}:${String(qs).padStart(2, "0")}`);
      safeSetText("hud-pacing-status", `${activeExam.currentQTimeSpentSec}s on Q`);

      if (activeExam.sectionRemainingSec <= 0) {
        handleSectionLockTransition(true);
      }
    }, 1000);
  }

  function persistActiveSessionSilently() {
    if (!activeExam || activeExam.isReviewMode || activeExam.completed) return;
    putRecord("store_active_session", { id: "current_session", session: activeExam });
  }

  function requestEndSectionEarly() {
    if (!activeExam || activeExam.isReviewMode) return;
    const curSec = activeExam.sections[activeExam.activeSectionIndex];
    const m = Math.floor(activeExam.sectionRemainingSec / 60);
    const s = activeExam.sectionRemainingSec % 60;

    safeSetHtml("lock-confirm-msg", `
      You have <b>${m}m ${s}s</b> remaining in <b>${curSec ? curSec.name : "this section"}</b>.<br><br>
      Locking early will permanently seal this section. You cannot return to it.
    `);
    const modal = document.getElementById("modal-section-lock-confirm");
    if (modal) modal.classList.add("active");
  }

  function confirmEndSectionEarly() {
    const modal = document.getElementById("modal-section-lock-confirm");
    if (modal) modal.classList.remove("active");
    handleSectionLockTransition(false);
  }

  function handleSectionLockTransition(isAutoExpired) {
    if (!activeExam) return;
    if (activeExam.sections[activeExam.activeSectionIndex]) {
      activeExam.sections[activeExam.activeSectionIndex].locked = true;
    }

    if (activeExam.activeSectionIndex < activeExam.sections.length - 1) {
      activeExam.activeSectionIndex++;
      const nextSec = activeExam.sections[activeExam.activeSectionIndex];
      activeExam.sectionRemainingSec = nextSec.durationSec;
      lastTimerTickEpoch = Date.now();
      const nextIdx = activeExam.questions.findIndex(q => q.sectionIndex === activeExam.activeSectionIndex);
      if (nextIdx !== -1) activeExam.currentQuestionIndex = nextIdx;

      persistActiveSessionSilently();
      showSectionToast(isAutoExpired
        ? `Section time expired! Locked and transitioned to: ${nextSec.name}`
        : `Section locked early! Transitioned to: ${nextSec.name}`);

      renderActiveExamQuestion();
    } else {
      submitExamSession();
    }
  }

  function showSectionToast(msg) {
    const toast = document.getElementById("arena-lock-toast");
    if (!toast) return;
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3500);
  }

  async function toggleCurrentArenaQuestionStar() {
    if (!activeExam) return;
    const q = activeExam.questions[activeExam.currentQuestionIndex];
    if (!q) return;
    q.bookmarked = !q.bookmarked;
    if (!q.ephemeral) {
      await QuestionService.toggleStar(q.id);
    }
    persistActiveSessionSilently();
    renderActiveExamQuestion();
  }

  /**
   * SIDE-BY-SIDE SPLIT-SCREEN SHEET + QUESTION DRAWER:
   * Opens any linked Knowledge Sheet alongside the active question in Review
   * or Dojo Mode without hiding the question.
   */
  async function openSplitSheetDrawer(conceptId, fallbackSub, fallbackChap) {
    let sheet = null;
    if (conceptId) {
      sheet = await ConceptService.get(conceptId);
    }
    if (!sheet && fallbackChap) {
      const all = await ConceptService.getAll();
      sheet = all.find(c => c.chapter === fallbackChap);
    }
    if (!sheet) {
      alert(`No Knowledge Sheet found for ${conceptId || fallbackChap}.`);
      return;
    }

    activeSplitSheetId = sheet.id;
    activeSplitSheetSubject = sheet.subject;
    activeSplitSheetChapter = sheet.chapter;

    safeSetText("split-sheet-title", `${sheet.title} (${sheet.chapter})`);
    const savedMasksRec = await getRecord("store_notes", `masks_${sheet.id}`);
    const masks = savedMasksRec && Array.isArray(savedMasksRec.masks) ? savedMasksRec.masks : [];
    const savedHlRec = await getRecord("store_notes", `highlights_${sheet.id}`);
    const highlights = savedHlRec && Array.isArray(savedHlRec.highlights) ? savedHlRec.highlights : [];

    safeSetHtml("split-sheet-body", `
      <div style="font-size:11.5px; color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom:8px;">${sheet.subtitle || ""}</div>
      <div id="split-sheet-render-body">${formatRichText(sheet.content, [])}</div>
    `);
    const renderBody = document.getElementById("split-sheet-render-body");
    if (renderBody) {
      applyDomMasksAndHighlights(renderBody, masks, highlights);
    }

    const drawer = document.getElementById("arena-split-sheet-drawer");
    if (drawer) drawer.classList.add("open");
    document.body.classList.add("split-sheet-docked");
  }

  function closeSplitSheetDrawer() {
    const drawer = document.getElementById("arena-split-sheet-drawer");
    if (drawer) drawer.classList.remove("open");
    document.body.classList.remove("split-sheet-docked");
  }

  function expandSplitSheetToFullStudio() {
    const id = activeSplitSheetId;
    const sub = activeSplitSheetSubject;
    const chap = activeSplitSheetChapter;
    closeSplitSheetDrawer();
    openCompendiumToSheet(id, sub, chap);
  }

  function renderActiveExamQuestion() {
    if (!activeExam || !activeExam.questions || activeExam.questions.length === 0) return;
    const q = activeExam.questions[activeExam.currentQuestionIndex];
    if (!q) return;

    // Switch per-question ink context automatically
    switchScratchpadContext(`exam_q_${q.id}`);

    const resp = activeExam.userResponses[q.id] || {};
    const isRev = !!activeExam.isReviewMode;
    const posM = activeExam.positiveMarks !== undefined ? activeExam.positiveMarks : 2.0;
    const negM = activeExam.negativeMarks !== undefined ? activeExam.negativeMarks : 0.5;

    safeSetDisplay("btn-arena-edit-q", isRev ? "inline-flex" : "none");
    safeSetDisplay("btn-arena-ai-assist", isRev ? "inline-flex" : "none");
    safeSetDisplay("btn-arena-mutant-clone", isRev ? "inline-flex" : "none");
    safeSetText("hud-marking-pill", `+${posM.toFixed(1)} / -${negM.toFixed(2)}`);

    const starBtn = document.getElementById("btn-arena-star");
    if (starBtn) {
      starBtn.classList.toggle("starred", !!q.bookmarked);
      starBtn.innerText = q.bookmarked ? "\u2605 Starred" : "\u2606 Star / Doubt";
    }

    if (isRev) {
      safeSetDisplay("btn-arena-pause", "none");
      safeSetDisplay("btn-arena-exit-review", "inline-flex");
      safeSetDisplay("btn-arena-early-lock", "none");
      safeSetDisplay("btn-drawer-early-lock", "none");
      safeSetDisplay("btn-q-review", "none");
      safeSetText("btn-q-save-next", "Next Question \u25BA");
      safeSetDisplay("btn-submit-exam", "none");
      safeSetText("palette-drawer-title", "Review Palette");
      safeSetHtml("palette-legend-bar", `
        <span>\uD83D\uDFE2 Correct</span>
        <span>\uD83D\uDD34 Incorrect</span>
        <span>\u26AA Unattempted</span>
      `);
      safeSetDisplay("hud-panic-flag", resp.isPanicSlip ? "inline-block" : "none");

      const spent = resp.timeSpentSec || 0;
      const mSpent = Math.floor(spent / 60);
      const sSpent = spent % 60;
      safeSetText("arena-q-timer", `${String(mSpent).padStart(2, "0")}:${String(sSpent).padStart(2, "0")}`);
      safeSetText("hud-pacing-status", `${spent}s on Q (Par: ${getSubjectThresholds(q.subject).parSec}s)`);
    } else {
      closeSplitSheetDrawer();
      safeSetDisplay("btn-arena-pause", "inline-flex");
      safeSetDisplay("btn-arena-exit-review", "none");
      safeSetDisplay("btn-q-review", "inline-flex");
      safeSetText("btn-q-save-next", "Save & Next");
      safeSetDisplay("btn-submit-exam", "block");
      safeSetText("palette-drawer-title", "Question Palette");
      safeSetDisplay("hud-panic-flag", "none");

      if (activeExam.isSectionLocked) {
        safeSetDisplay("btn-arena-early-lock", "inline-flex");
        safeSetDisplay("btn-drawer-early-lock", "block");
        const isLast = activeExam.activeSectionIndex === activeExam.sections.length - 1;
        safeSetText("btn-arena-early-lock", isLast ? "\uD83D\uDD12 Submit Final Section" : "\uD83D\uDD12 End Section Early");
        safeSetText("btn-drawer-early-lock", isLast ? "\uD83D\uDD12 Lock & Submit Final Section" : "\uD83D\uDD12 End & Advance Section Early");
      } else {
        safeSetDisplay("btn-arena-early-lock", "none");
        safeSetDisplay("btn-drawer-early-lock", "none");
      }
    }

    const secQs = activeExam.questions.filter(item => item.sectionIndex === q.sectionIndex);
    safeSetText("hud-section-badge", `${q.sectionName ? q.sectionName.toUpperCase() : "EXAM"}`);
    safeSetText("hud-section-qinfo", `Sec Q${q.localNumber || (activeExam.currentQuestionIndex + 1)} of ${secQs.length} (Global Q${q.globalNumber || (activeExam.currentQuestionIndex + 1)})`);
    safeSetText("arena-q-num", `Q${q.globalNumber || (activeExam.currentQuestionIndex + 1)}`);

    const passageContainer = document.getElementById("arena-passage-container");
    const arenaBody = document.getElementById("arena-body");
    const hasPassage = !!(q.passageText && q.passageText.trim().length > 0);
    if (arenaBody) {
      arenaBody.classList.toggle("has-passage", hasPassage);
    }
    if (passageContainer) {
      if (hasPassage) {
        passageContainer.style.display = "block";
        safeSetText("arena-passage-tag", `${q.chapter.replace(/^ENG_/, "").replace(/^QA_/, "")} CONTEXT`);
        safeSetText("arena-passage-set-badge", `SET Q ${q.setOrder || 1}/${q.setTotal || 1}`);
        safeSetHtml("arena-passage-body", formatRichText(q.passageText));
      } else {
        passageContainer.style.display = "none";
      }
    }

    safeSetHtml("arena-q-text", formatRichText(q.questionText));

    const revBtn = document.getElementById("btn-q-review");
    if (!isRev && revBtn) {
      if (resp.status === "marked") {
        revBtn.style.color = "#fff";
        revBtn.style.background = "var(--accent-purple)";
        revBtn.innerText = "Unmark Review";
      } else {
        revBtn.style.color = "var(--accent-purple)";
        revBtn.style.background = "var(--bg-elevated)";
        revBtn.innerText = "Mark Review";
      }
    }

    const imgBox = document.getElementById("arena-image-container");
    if (imgBox) {
      if (q.imageUrl && q.imageUrl.trim().length > 0) {
        imgBox.style.display = "block";
        imgBox.innerHTML = `<img src="${q.imageUrl}" alt="Question Diagram">`;
      } else {
        imgBox.style.display = "none";
        imgBox.innerHTML = "";
      }
    }

    const conceptBridgeBox = document.getElementById("arena-concept-bridge-box");
    if (isRev && conceptBridgeBox) {
      conceptBridgeBox.style.display = "block";
      const pillsWrap = document.getElementById("arena-concept-pills-wrap");
      if (pillsWrap) {
        pillsWrap.innerHTML = "";
        const linkedIds = (Array.isArray(q.conceptIds) && q.conceptIds.length > 0)
          ? q.conceptIds
          : (q.conceptId ? [q.conceptId] : []);

        if (linkedIds.length === 0) {
          const pinBtn = document.createElement("button");
          pinBtn.className = "btn btn-purple";
          pinBtn.style.cssText = "padding:5px 10px; font-size:11.5px; font-weight:700;";
          pinBtn.innerText = `\uD83D\uDCCC Pin ${q.chapter} Sheet`;
          pinBtn.onclick = () => openSplitSheetDrawer(null, q.subject, q.chapter);
          pillsWrap.appendChild(pinBtn);

          const fullBtn = document.createElement("button");
          fullBtn.className = "btn btn-cyan";
          fullBtn.style.cssText = "padding:5px 10px; font-size:11.5px; font-weight:700;";
          fullBtn.innerText = `\uD83D\uDCD6 Full Studio`;
          fullBtn.onclick = () => openCompendiumToSheet(null, q.subject, q.chapter);
          pillsWrap.appendChild(fullBtn);
        } else {
          linkedIds.forEach(cId => {
            const cleanName = cId.replace(/^top_/, "").replace(/_/g, " ");
            const pinBtn = document.createElement("button");
            pinBtn.className = "btn btn-purple";
            pinBtn.style.cssText = "padding:5px 10px; font-size:11.5px; font-weight:700;";
            pinBtn.innerText = `\uD83D\uDCCC Pin: ${cleanName}`;
            pinBtn.onclick = () => openSplitSheetDrawer(cId, q.subject, q.chapter);
            pillsWrap.appendChild(pinBtn);

            const fullBtn = document.createElement("button");
            fullBtn.className = "btn btn-cyan";
            fullBtn.style.cssText = "padding:5px 10px; font-size:11.5px; font-weight:700;";
            fullBtn.innerText = `\uD83D\uDCD6 Studio: ${cleanName}`;
            fullBtn.onclick = () => openCompendiumToSheet(cId, q.subject, q.chapter);
            pillsWrap.appendChild(fullBtn);
          });
        }
      }
    } else if (conceptBridgeBox) {
      conceptBridgeBox.style.display = "none";
    }

    const telemBanner = document.getElementById("arena-review-telemetry-banner");
    const solutionBlock = document.getElementById("arena-review-solution-block");

    if (isRev && telemBanner && solutionBlock) {
      const isAtt = resp.selectedOption !== null && resp.selectedOption !== undefined;
      const isCor = isAtt && resp.selectedOption === q.correctIndex;
      const parSec = getSubjectThresholds(q.subject).parSec;

      telemBanner.style.display = "block";
      telemBanner.innerHTML = `
        <div style="background:var(--bg-elevated); border:1px solid ${isCor ? "var(--status-green)" : (isAtt ? "var(--status-red)" : "var(--border-color)")}; border-radius:8px; padding:10px; font-size:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <span style="font-weight:800; color:${isCor ? "var(--status-green)" : (isAtt ? "var(--status-red)" : "var(--text-muted)")};">
              ${isCor ? `\u2713 CORRECT (+${posM.toFixed(1)})` : (isAtt ? `\u2717 INCORRECT (-${negM.toFixed(2)})` : "\u26AA UNATTEMPTED (0.0)")}
            </span>
            <span style="font-family:var(--font-mono); color:var(--text-muted);">${resp.timeSpentSec || 0}s spent (Target Par: ${parSec}s)</span>
          </div>
          ${resp.decisionTrail && resp.decisionTrail.length > 0 ? `
            <div style="margin-top:6px; color:var(--accent-cyan); font-size:11px;">
              <b>Hesitation Trail:</b> ${resp.decisionTrail.map(d => `Opt ${d.opt} (${d.atSec}s)`).join(" \u2794 ")}
            </div>
          ` : ""}
          ${resp.isPanicSlip ? `<div style="margin-top:4px; color:var(--status-red); font-size:11px; font-weight:700;">\u26A0\uFE0F Detected as Panic Slip (&le;8s solve with &lt;90s left on section clock).</div>` : ""}
          ${resp.errorTag && resp.errorTag !== "UNCLASSIFIED" && resp.errorTag !== "VALID_CALCULATED_RISK" ? `<div style="margin-top:4px; color:#f87171; font-size:11px;"><b>Active Classification:</b> #${resp.errorTag}</div>` : ""}
          ${resp.errorTag === "VALID_CALCULATED_RISK" ? `<div style="margin-top:4px; color:var(--status-green); font-size:11px;"><b>Tag Cleared:</b> Valid Calculated Risk / Speed Move</div>` : ""}
        </div>
      `;

      solutionBlock.style.display = "block";
      const currentTag = resp.errorTag || "UNCLASSIFIED";

      let optionsHtml = `
        <option value="UNCLASSIFIED" ${currentTag === "UNCLASSIFIED" ? "selected" : ""}>Override Mistake Tag...</option>
        <option value="VALID_CALCULATED_RISK" ${currentTag === "VALID_CALCULATED_RISK" ? "selected" : ""}>\u2713 Valid Calculated Risk (Clear Trap Penalty)</option>
      `;
      customMistakeTags.forEach(t => {
        if (t !== "VALID_CALCULATED_RISK") {
          optionsHtml += `<option value="${t}" ${currentTag === t ? "selected" : ""}>${t.replace(/_/g, " ")}</option>`;
        }
      });
      optionsHtml += `<option value="__NEW_TAG__">+ Create New Custom Tag...</option>`;

      solutionBlock.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:700; color:var(--accent-cyan); font-size:13px;">Method &amp; Detailed Solution</span>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn btn-purple" style="padding:3px 9px; font-size:11px;" onclick="CGL_OS.openAiQuestionTutorModal('ARENA')">\uD83E\uDDE0 AI Shortcut / Tutor</button>
            ${isAtt ? `
              <select onchange="CGL_OS.handleMistakeTagSelect('${q.id}', this.value)" style="background:#151a24; color:#fff; border:1px solid #da3633; font-size:11px; padding:4px 8px; border-radius:4px;">
                ${optionsHtml}
              </select>
            ` : ""}
          </div>
        </div>
        <div style="font-size:calc(13.8px * var(--reader-font-scale)); line-height:1.68;">${formatRichText(q.explanation || "No method registered.")}</div>
        ${q.annotation ? `<div class="callout-box" style="margin-top:10px;"><b>Personal Solving Cue:</b><br>${formatRichText(q.annotation)}</div>` : ""}
      `;
    } else {
      if (telemBanner) telemBanner.style.display = "none";
      if (solutionBlock) solutionBlock.style.display = "none";
    }

    const container = document.getElementById("arena-options-container");
    if (!container) return;
    container.innerHTML = "";

    q.options.forEach((optText, idx) => {
      const card = document.createElement("div");
      card.className = "opt-card";

      if (isRev) {
        if (idx === q.correctIndex) card.classList.add("correct-peek");
        else if (idx === resp.selectedOption) card.classList.add("wrong-peek");
      } else {
        if (resp.selectedOption === idx) card.classList.add("selected");
        if (resp.struck && resp.struck.includes(idx)) card.classList.add("struck-through");

        card.addEventListener("click", () => {
          if (resp.struck && resp.struck.includes(idx)) return;
          if (navigator.vibrate) navigator.vibrate(15);

          // 1-Tap Unselect when clicking already-selected option
          if (resp.selectedOption === idx) {
            resp.selectedOption = null;
            if (resp.status === "answered") resp.status = "unanswered";
            persistActiveSessionSilently();
            renderActiveExamQuestion();
            return;
          }

          if (resp.initialOption === null) resp.initialOption = idx;
          if (resp.selectedOption !== null && resp.selectedOption !== idx) resp.switches++;

          resp.selectedOption = idx;
          resp.sectionRemainingAtAnswerSec = activeExam.sectionRemainingSec;

          if (!resp.decisionTrail) resp.decisionTrail = [];
          resp.decisionTrail.push({
            opt: idx + 1,
            atSec: activeExam.currentQTimeSpentSec,
            secRem: activeExam.sectionRemainingSec
          });
          if (resp.status !== "marked") resp.status = "answered";
          persistActiveSessionSilently();
          renderActiveExamQuestion();
        });

        let timer;
        card.addEventListener("touchstart", () => {
          timer = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate([25, 40]);
            if (!resp.struck) resp.struck = [];
            if (resp.struck.includes(idx)) {
              resp.struck = resp.struck.filter(i => i !== idx);
            } else {
              resp.struck.push(idx);
              if (resp.selectedOption === idx) {
                resp.selectedOption = null;
                if (resp.status === "answered") resp.status = "unanswered";
              }
            }
            persistActiveSessionSilently();
            renderActiveExamQuestion();
          }, 550);
        });
        card.addEventListener("touchend", () => clearTimeout(timer));
      }

      card.innerHTML = `
        <span style="font-weight:700; color:var(--text-muted); font-size:13px;">${idx + 1}.</span>
        <div style="flex:1;">${formatRichText(optText)}</div>
        ${isRev && idx === q.correctIndex ? '<span style="font-size:11px; font-weight:800; color:var(--status-green);">\u2713 Correct</span>' : ""}
        ${isRev && idx === resp.selectedOption && idx !== q.correctIndex ? '<span style="font-size:11px; font-weight:800; color:var(--status-red);">\u2717 Your Pick</span>' : ""}
      `;
      container.appendChild(card);
    });

    if (!isRev) activeExam.currentQTimeSpentSec = 0;
  }

  /* ==========================================================================
   * SECTION 20A: AI QUESTION COPILOT & 1-TAP ADVERSARIAL MUTANT CLONE ENGINE
   * ========================================================================== */
  function getActiveQuestionForAiContext(contextMode) {
    if (contextMode === "ARENA" && activeExam) {
      return activeExam.questions[activeExam.currentQuestionIndex];
    }
    if (dojoExam && dojoExam.questions) {
      return dojoExam.questions[dojoExam.currentIndex];
    }
    if (activeExam && activeExam.questions) {
      return activeExam.questions[activeExam.currentQuestionIndex];
    }
    return null;
  }

  function openAiQuestionTutorModal(contextMode = "DOJO") {
    activeAiTutorContext = contextMode;
    const q = getActiveQuestionForAiContext(contextMode);
    if (!q) return;

    renderApiVaultUI();
    safeSetText("ai-tutor-q-meta", `${q.id} \u2022 ${q.subject} \u2022 ${q.chapter}`);
    safeSetText("ai-tutor-source-badge", "\uD83E\uDD16 Ready (Waterfall Router)");
    safeSetDisplay("btn-ai-tutor-save-cue", "none");
    safeSetHtml("ai-tutor-response-box", `Select a 1-tap micro-task above or ask a specific doubt about <b>${q.id}</b>.`);

    pushHistoryState("modal-ai-tutor");
    const m = document.getElementById("modal-ai-tutor");
    if (m) m.classList.add("active");
  }

  async function runAiTutorMicroTask(mode) {
    const q = getActiveQuestionForAiContext(activeAiTutorContext);
    if (!q) return;

    const manualKeyId = document.getElementById("ai-tutor-key-override")?.value || "WATERFALL_AUTO";
    const badge = document.getElementById("ai-tutor-source-badge");
    const box = document.getElementById("ai-tutor-response-box");
    const customInput = document.getElementById("ai-tutor-custom-prompt")?.value.trim() || "";

    if (badge) badge.innerText = "\u23F3 Querying API Waterfall...";
    if (box) box.innerHTML = `<div style="color:var(--accent-cyan);">Generating crisp response...</div>`;

    const qContext = `Question (${q.subject} - ${q.chapter}): ${q.questionText}\nOptions: (1) ${q.options[0]} | (2) ${q.options[1]} | (3) ${q.options[2]} | (4) ${q.options[3]}\nCorrect Answer: Option ${q.correctIndex + 1} (${q.options[q.correctIndex]})\nExisting Explanation: ${q.explanation || "None"}`;

    let systemPrompt = "You are an elite SSC CGL Tier-1/Tier-2 coach. Be concise, crisp, and use $...$ for LaTeX math.";
    let userPrompt = "";

    if (mode === "SHORTCUT") {
      userPrompt = `${qContext}\n\nProvide a 2-to-4 line exam-hall speed shortcut (ratio, value-putting, unit digit, options elimination, or direct theorem) to solve this in under 20 seconds.`;
    } else if (mode === "EXPLAIN") {
      userPrompt = `${qContext}\n\nBreak down the step-by-step derivation clearly so the candidate understands why Option ${q.correctIndex + 1} is unequivocally correct.`;
    } else if (mode === "TRAP_CHECK") {
      userPrompt = `${qContext}\n\nExplain the specific cognitive trap or common calculation slip that leads candidates to pick the wrong distractors here, and how to avoid it.`;
    } else {
      if (!customInput) {
        alert("Enter your question in the input box first.");
        return;
      }
      userPrompt = `${qContext}\n\nCandidate Question: ${customInput}`;
    }

    try {
      const res = await AiGatewayService.executeMicroTask({
        taskType: "SHORTCUT",
        systemPrompt,
        userPrompt,
        expectJson: false,
        manualKeyId
      });

      lastAiTutorPlainText = res.rawText.trim();
      if (badge) badge.innerText = `\u2713 Source: ${res.sourceLabel}`;
      if (box) box.innerHTML = formatRichText(lastAiTutorPlainText);
      safeSetDisplay("btn-ai-tutor-save-cue", "inline-flex");
    } catch (err) {
      if (badge) badge.innerText = "\u26A0\uFE0F Fallback to Clipboard";
      if (box) box.innerHTML = `<span style="color:var(--status-amber);">${err.message}</span>`;
    }
  }

  async function saveAiTutorOutputToQuestionCue() {
    const q = getActiveQuestionForAiContext(activeAiTutorContext);
    if (!q || !lastAiTutorPlainText) return;

    const updatedCue = q.annotation
      ? `${q.annotation}\n\n[AI Shortcut]: ${lastAiTutorPlainText}`
      : `[AI Shortcut]: ${lastAiTutorPlainText}`;

    q.annotation = updatedCue;
    if (!q.ephemeral) {
      await QuestionService.update(q.id, { annotation: updatedCue });
    }
    if (dojoExam) {
      safeSetValue("dojo-arena-annotation", updatedCue);
    }
    if (activeExam && activeExam.isReviewMode) {
      renderActiveExamQuestion();
    }
    alert("Saved to Personal Solving Cue for this question!");
  }

  /**
   * 🧬 1-TAP ADVERSARIAL MUTANT CLONE GENERATOR:
   * Uses the deterministic JS compiler pattern: API only generates the 6 flat
   * content fields, while app.js enforces id, subject, chapter, conceptIds,
   * ephemeral: true, and remediatesQuestionId.
   */
  async function generateInstantMutantClone(sourceContext = "DOJO") {
    const ctx = sourceContext === "MODAL" ? activeAiTutorContext : sourceContext;
    const parentQ = getActiveQuestionForAiContext(ctx);
    if (!parentQ) return;

    const manualKeyId = document.getElementById("ai-tutor-key-override")?.value || "WATERFALL_AUTO";
    const badge = document.getElementById("ai-tutor-source-badge");
    if (badge) badge.innerText = "\u23F3 Synthesizing Mutant Clone...";

    const systemPrompt = `You are an adversarial SSC CGL problem designer. Given a canonical question, create a mutated variant that tests the EXACT same mathematical/linguistic theorem and trap, but with new numbers, changed surface entities, and recomputed options.
 Verify your arithmetic step-by-step BEFORE choosing correctIndex (0, 1, 2, or 3).
Return ONLY a valid JSON object with these 4 keys:
{
  "questionText": "Mutated stem with LaTeX in $...$",
  "options": ["Opt 1", "Opt 2", "Opt 3", "Opt 4"],
  "correctIndex": 0,
  "explanation": "Complete step-by-step verification proof"
}`;

    const userPrompt = `Parent Question (${parentQ.subject} - ${parentQ.chapter} - ${parentQ.method || parentQ.subtopic}):
Stem: ${parentQ.questionText}
Options: ${JSON.stringify(parentQ.options)}
Correct Index: ${parentQ.correctIndex}
Explanation: ${parentQ.explanation}`;

    try {
      const res = await AiGatewayService.executeMicroTask({
        taskType: "MUTANT",
        systemPrompt,
        userPrompt,
        expectJson: true,
        manualKeyId,
        validatorFn: (obj) => {
          if (!obj.questionText || !Array.isArray(obj.options) || obj.options.length !== 4) {
            throw new Error("Mutant JSON missing questionText or 4 options.");
          }
          if (typeof obj.correctIndex !== "number" || obj.correctIndex < 0 || obj.correctIndex > 3) {
            throw new Error("Mutant JSON has invalid correctIndex.");
          }
        }
      });

      const d = res.data;
      const mutantQ = sanitizeQuestion({
        id: `q_eph_mut_${Date.now()}`,
        subject: parentQ.subject,
        chapter: parentQ.chapter,
        subtopic: parentQ.subtopic,
        method: parentQ.method,
        conceptId: parentQ.conceptId,
        conceptIds: parentQ.conceptIds,
        remediatesQuestionId: parentQ.id,
        ephemeral: true,
        questionText: d.questionText,
        options: d.options,
        correctIndex: d.correctIndex,
        explanation: `[Mutant by ${res.sourceLabel}]\n${d.explanation || ""}`,
        source: `Mutant Clone of ${parentQ.id}`,
        difficulty: parentQ.difficulty || "MEDIUM",
        tags: [...(parentQ.tags || []), "MutantClone"]
      });

      document.getElementById("modal-ai-tutor")?.classList.remove("active");

      if (dojoExam && document.getElementById("dojo-arena-view")?.style.display === "flex") {
        const insertIdx = dojoExam.currentIndex + 1;
        dojoExam.questions.splice(insertIdx, 0, mutantQ);
        dojoExam.questions.forEach((q, i) => { q.dojoSequentialNum = i + 1; });
        dojoExam.userResponses[mutantQ.id] = { selectedOption: null, status: "unanswered", revealed: false };
        dojoExam.currentIndex = insertIdx;
        renderDojoArenaQuestion();
        alert(`🧬 Mutant Clone generated by ${res.sourceLabel} and mounted right here in Dojo!`);
      } else {
        await openDojoSessionWithQuestions([mutantQ], `🧬 Mutant Probe (${parentQ.chapter})`);
      }
    } catch (err) {
      if (badge) badge.innerText = "\u26A0\uFE0F Fallback to Clipboard";
      alert(err.message);
    }
  }

  // Safe Navigation Event Bindings
  safeBind("btn-q-save-next", "click", () => {
    if (!activeExam) return;
    const q = activeExam.questions[activeExam.currentQuestionIndex];
    const resp = activeExam.userResponses[q.id];

    if (!activeExam.isReviewMode && resp.selectedOption !== null && resp.status !== "marked") {
      resp.status = "answered";
    }
    persistActiveSessionSilently();

    const nextIdx = activeExam.currentQuestionIndex + 1;
    if (nextIdx < activeExam.questions.length) {
      if (activeExam.isReviewMode || !activeExam.isSectionLocked || activeExam.questions[nextIdx].sectionIndex === activeExam.activeSectionIndex) {
        activeExam.currentQuestionIndex = nextIdx;
        renderActiveExamQuestion();
        return;
      }
    }
    toggleExamPalette(true);
  });

  safeBind("btn-q-prev", "click", () => {
    if (!activeExam) return;
    const prevIdx = activeExam.currentQuestionIndex - 1;
    if (prevIdx >= 0) {
      if (activeExam.isReviewMode || !activeExam.isSectionLocked || activeExam.questions[prevIdx].sectionIndex === activeExam.activeSectionIndex) {
        activeExam.currentQuestionIndex = prevIdx;
        renderActiveExamQuestion();
      }
    }
  });

  safeBind("btn-q-review", "click", () => {
    if (!activeExam || activeExam.isReviewMode) return;
    const q = activeExam.questions[activeExam.currentQuestionIndex];
    const resp = activeExam.userResponses[q.id];
    if (resp.status === "marked") {
      resp.status = resp.selectedOption !== null ? "answered" : "unanswered";
    } else {
      resp.status = "marked";
    }
    persistActiveSessionSilently();
    renderActiveExamQuestion();
  });

  function toggleExamPalette(forceOpen = null) {
    if (document.activeElement) document.activeElement.blur();
    const drawer = document.getElementById("exam-palette-drawer");
    const overlay = document.getElementById("exam-drawer-overlay");
    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.contains("open");
    const shouldOpen = forceOpen !== null ? forceOpen : !isOpen;

    if (shouldOpen) {
      renderExamPaletteGrid();
      drawer.classList.add("open");
      overlay.classList.add("active");
    } else {
      drawer.classList.remove("open");
      overlay.classList.remove("active");
    }
  }

  function renderExamPaletteGrid(filterSectionIndex = null) {
    const grid = document.getElementById("exam-palette-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const tabsWrap = document.getElementById("exam-palette-section-tabs");
    if (tabsWrap) tabsWrap.innerHTML = "";

    const isRev = !!activeExam.isReviewMode;
    const isLocked = activeExam.isSectionLocked && !isRev;

    if (tabsWrap) {
      activeExam.sections.forEach((sec, sIdx) => {
        const tabBtn = document.createElement("button");
        tabBtn.className = "anchor-pill" + (sIdx === activeExam.activeSectionIndex ? " active" : "");

        if (isLocked && sec.locked) {
          tabBtn.innerText = `\uD83D\uDD12 ${sec.name.split(" ")[0]}`;
          tabBtn.style.opacity = "0.5";
          tabBtn.style.cursor = "not-allowed";
        } else if (isLocked && sIdx > activeExam.activeSectionIndex) {
          tabBtn.innerText = `\u23F3 ${sec.name.split(" ")[0]}`;
          tabBtn.style.opacity = "0.6";
        } else {
          tabBtn.innerText = sec.name.split(" ")[0];
          tabBtn.addEventListener("click", () => {
            if (isLocked && sIdx !== activeExam.activeSectionIndex) {
              alert("Sectional lock is active! Sections must be completed sequentially.");
              return;
            }
            activeExam.activeSectionIndex = sIdx;
            renderExamPaletteGrid(sIdx);
          });
        }
        tabsWrap.appendChild(tabBtn);
      });
    }

    const targetSec = filterSectionIndex !== null
      ? filterSectionIndex
      : (isLocked ? activeExam.activeSectionIndex : null);

    const displayedQs = targetSec !== null
      ? activeExam.questions.filter(q => q.sectionIndex === targetSec)
      : activeExam.questions;

    if (!isRev) {
      let ans = 0, marked = 0, unans = 0;
      activeExam.questions.forEach(q => {
        const resp = activeExam.userResponses[q.id];
        if (resp.status === "answered") ans++;
        else if (resp.status === "marked") marked++;
        else unans++;
      });
      safeSetText("exam-count-ans", ans);
      safeSetText("exam-count-marked", marked);
      safeSetText("exam-count-unans", unans);
    }

    displayedQs.forEach(q => {
      const resp = activeExam.userResponses[q.id] || {};
      const isSecLocked = isLocked && activeExam.sections[q.sectionIndex] && activeExam.sections[q.sectionIndex].locked;

      const cell = document.createElement("div");
      cell.className = "palette-cell";
      if (q.bookmarked) cell.classList.add("starred-cell");

      if (isRev) {
        const isAtt = resp.selectedOption !== null && resp.selectedOption !== undefined;
        const isCor = isAtt && resp.selectedOption === q.correctIndex;
        if (isCor) cell.classList.add("rev-correct");
        else if (isAtt) cell.classList.add("rev-incorrect");
        else cell.classList.add("rev-unanswered");
      } else {
        if (isSecLocked) cell.classList.add("locked-cell");
        else if (resp.status === "answered") cell.classList.add("answered");
        else if (resp.status === "marked") cell.classList.add("marked");
        else cell.classList.add("unanswered");
      }

      if (activeExam.questions[activeExam.currentQuestionIndex].id === q.id) {
        cell.classList.add("current");
      }

      cell.innerText = q.globalNumber || (activeExam.questions.findIndex(item => item.id === q.id) + 1);

      cell.addEventListener("click", () => {
        if (isSecLocked) {
          alert("This section is sealed and locked!");
          return;
        }
        if (isLocked && q.sectionIndex !== activeExam.activeSectionIndex) {
          alert("Cannot access future sections until current section is locked!");
          return;
        }
        activeExam.currentQuestionIndex = activeExam.questions.findIndex(item => item.id === q.id);
        toggleExamPalette(false);
        renderActiveExamQuestion();
      });

      grid.appendChild(cell);
    });
  }

  // Safe Arena Pause & Minimize Bindings
  safeBind("btn-arena-pause", "pointerdown", async (e) => {
    e.preventDefault();
    if (!activeExam || activeExam.isReviewMode) return;
    activeExam.isPaused = true;
    clearInterval(examTimerInterval);
    await putRecord("store_active_session", { id: "current_session", session: activeExam });

    const shield = document.getElementById("pause-shield");
    if (shield) shield.style.setProperty("display", "flex", "important");
  });

  safeBind("btn-resume-exam", "click", () => {
    const shield = document.getElementById("pause-shield");
    if (shield) shield.style.setProperty("display", "none", "important");
    if (activeExam) {
      activeExam.isPaused = false;
      startExamTimers();
    }
  });

  safeBind("btn-minimize-exam", "click", async () => {
    const shield = document.getElementById("pause-shield");
    if (shield) shield.style.setProperty("display", "none", "important");
    safeSetDisplay("exam-arena", "none");
    toggleScratchpadCanvas(false);
    closeSplitSheetDrawer();
    updateMiniPlayerDock();
  });

  safeBind("btn-exit-exam", "click", async () => {
    if (confirm("Abandon active mock test? Current unsubmitted progress will be lost.")) {
      const shield = document.getElementById("pause-shield");
      if (shield) shield.style.setProperty("display", "none", "important");
      safeSetDisplay("exam-arena", "none");
      toggleScratchpadCanvas(false);
      closeSplitSheetDrawer();
      clearInterval(examTimerInterval);
      await deleteRecordFromStore("store_active_session", "current_session");
      activeExam = null;
      hideMiniPlayer();
      renderDashboard();
    }
  });

  function updateMiniPlayerDock() {
    if (!activeExam || activeExam.isReviewMode) {
      hideMiniPlayer();
      return;
    }
    const dock = document.getElementById("mini-player-dock");
    if (!dock) return;

    const q = activeExam.questions[activeExam.currentQuestionIndex];
    const m = Math.floor(activeExam.sectionRemainingSec / 60);
    const s = activeExam.sectionRemainingSec % 60;
    let ansCount = 0;
    Object.values(activeExam.userResponses).forEach(r => { if (r.status === "answered") ansCount++; });

    safeSetText("mini-player-title", activeExam.title);
    safeSetText("mini-player-sub", `${q && q.sectionName ? q.sectionName.split(" ")[0] : "Exam"} \u2022 Q${q ? (q.globalNumber || 1) : 1}`);
    safeSetText("mini-player-time", `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    safeSetText("mini-player-ans", `${ansCount}/${activeExam.questions.length} Ans`);

    dock.style.display = "flex";
  }

  function hideMiniPlayer() {
    safeSetDisplay("mini-player-dock", "none");
  }

  async function resumeFromMiniPlayer() {
    if (!activeExam) {
      const saved = await getRecord("store_active_session", "current_session");
      if (saved && saved.session) activeExam = saved.session;
    }
    if (!activeExam) return;

    hideMiniPlayer();
    activeExam.isPaused = false;
    pushNavLayer("exam-arena", () => {
      const pauseBtn = document.getElementById("btn-arena-pause");
      if (pauseBtn) pauseBtn.click();
    });
    safeSetDisplay("exam-arena", "flex");
    renderActiveExamQuestion();
    startExamTimers();
  }

  safeBind("btn-submit-exam", "click", () => {
    if (confirm("Confirm final submission of full mock test?")) {
      toggleExamPalette(false);
      submitExamSession();
    }
  });

  async function submitExamSession() {
    clearInterval(examTimerInterval);
    toggleScratchpadCanvas(false);
    closeSplitSheetDrawer();

    let correct = 0, incorrect = 0, traps = 0, totalMarks = 0;
    let penaltyDrag = 0, switchDelta = 0;
    const posMarks = activeExam.positiveMarks !== undefined ? activeExam.positiveMarks : 2.0;
    const negMarks = activeExam.negativeMarks !== undefined ? activeExam.negativeMarks : 0.5;

    for (const q of activeExam.questions) {
      const resp = activeExam.userResponses[q.id];
      const thresholds = getSubjectThresholds(q.subject);

      if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
        const isCorrect = resp.selectedOption === q.correctIndex;
        const secRemWhenAnswered = resp.sectionRemainingAtAnswerSec !== undefined
          ? resp.sectionRemainingAtAnswerSec
          : activeExam.sectionRemainingSec;

        if (!isCorrect && resp.timeSpentSec <= 8 && secRemWhenAnswered < 90) {
          resp.isPanicSlip = true;
        } else {
          resp.isPanicSlip = false;
        }

        if (isCorrect) {
          totalMarks += posMarks;
          correct++;
          if (resp.initialOption !== null && resp.initialOption !== q.correctIndex) {
            switchDelta++;
          }
          if (resp.timeSpentSec <= thresholds.masterySec) {
            resp.errorTag = "SPEED_MASTERY";
          }
        } else {
          totalMarks -= negMarks;
          penaltyDrag += negMarks;
          incorrect++;

          if (resp.initialOption === q.correctIndex) {
            switchDelta--;
          }

          if (resp.timeSpentSec > thresholds.trapSec) traps++;

          if (!resp.errorTag || resp.errorTag === "UNCLASSIFIED") {
            if (resp.isPanicSlip) {
              resp.errorTag = "PANIC_SLIP";
            } else if (resp.switches > 0 && resp.initialOption === q.correctIndex) {
              resp.errorTag = "SECOND_GUESS_BLUNDER";
            } else if (resp.timeSpentSec > thresholds.trapSec) {
              resp.errorTag = "TIME_TRAP_Q4";
            } else if (resp.timeSpentSec <= 10 && secRemWhenAnswered >= 180) {
              resp.errorTag = "SPEED_MISREAD";
            } else {
              resp.errorTag = "CONCEPT_VOID";
            }
          }
        }
      } else if (resp && (resp.timeSpentSec || 0) > 45) {
        traps++;
        resp.errorTag = "ABANDONED_TIME_SINK";
      }
    }

    const now = Date.now();
    activeExam.completed = true;
    activeExam.timestamp = now;
    activeExam.timeIST = formatISTDate(now);
    activeExam.diurnalSlot = getDiurnalSlot(now);
    activeExam.positiveMarks = posMarks;
    activeExam.negativeMarks = negMarks;
    activeExam.finalScore = parseFloat(totalMarks.toFixed(2));
    activeExam.correctCount = correct;
    activeExam.incorrectCount = incorrect;
    activeExam.q4Traps = traps;
    activeExam.penaltyDrag = parseFloat(penaltyDrag.toFixed(2));
    activeExam.switchDelta = switchDelta;

    await deleteRecordFromStore("store_active_session", "current_session");
    hideMiniPlayer();

    await putRecord("store_attempts", activeExam);

    safeSetDisplay("exam-arena", "none");
    await renderDashboard();
    openMockReview(activeExam);
  }

  async function reattemptMock(sessionId) {
    const attempts = await getAllRecords("store_attempts");
    const target = attempts.find(a => a.sessionId === sessionId);
    if (!target) return;

    const modalReview = document.getElementById("modal-mock-review");
    if (modalReview) modalReview.classList.remove("active");
    const modalArchive = document.getElementById("modal-history-archive");
    if (modalArchive) modalArchive.classList.remove("active");

    const rootId = target.parentSessionId || target.sessionId;
    const threadAttempts = attempts.filter(a => a.sessionId === rootId || a.parentSessionId === rootId);
    const nextAttemptNumber = threadAttempts.length + 1;

    const parsedSections = target.sections && target.sections.length > 0
      ? JSON.parse(JSON.stringify(target.sections)).map(s => ({ ...s, locked: false }))
      : [{ id: "SEC_1", name: "Section 1", durationSec: 900, locked: false }];

    const allCanonical = await getAllRecords("store_questions");
    const canonMap = {};
    allCanonical.forEach(cq => { canonMap[cq.id] = cq; });

    const now = Date.now();
    activeExam = {
      sessionId: "mock_re_" + now,
      parentSessionId: rootId,
      attemptNumber: nextAttemptNumber,
      timestamp: now,
      timeIST: formatISTDate(now),
      diurnalSlot: getDiurnalSlot(now),
      title: `${target.title.replace(/^Re-attempt:\s*/i, "")}`,
      mockType: target.mockType || "CUSTOM",
      positiveMarks: target.positiveMarks !== undefined ? target.positiveMarks : 2.0,
      negativeMarks: target.negativeMarks !== undefined ? target.negativeMarks : 0.5,
      signatureTag: target.signatureTag || "",
      isSectionLocked: !!target.isSectionLocked,
      isEphemeral: !!target.isEphemeral,
      sections: parsedSections,
      activeSectionIndex: 0,
      currentQuestionIndex: 0,
      questions: target.questions.map((q, idx) => {
        const baseQ = canonMap[q.id] ? { ...q, ...canonMap[q.id] } : { ...q };
        const permuted = MockService.permuteQuestionOptions(baseQ, `re_${now}_${idx}`);
        return {
          ...permuted,
          sectionIndex: (typeof q.sectionIndex === "number" && q.sectionIndex >= 0 && q.sectionIndex < parsedSections.length) ? q.sectionIndex : 0,
          globalNumber: idx + 1
        };
      }),
      sectionRemainingSec: parsedSections[0].durationSec || 900,
      currentQTimeSpentSec: 0,
      userResponses: {},
      isPaused: false,
      isReviewMode: false
    };

    activeExam.questions.forEach(q => {
      activeExam.userResponses[q.id] = {
        selectedOption: null,
        initialOption: null,
        status: "unanswered",
        switches: 0,
        decisionTrail: [],
        timeSpentSec: 0,
        struck: []
      };
    });

    await putRecord("store_active_session", { id: "current_session", session: activeExam });
    hideMiniPlayer();

    if (document.activeElement) document.activeElement.blur();
    pushNavLayer("exam-arena", () => {
      const pauseBtn = document.getElementById("btn-arena-pause");
      if (pauseBtn) pauseBtn.click();
    });
    safeSetDisplay("exam-arena", "flex");
    renderActiveExamQuestion();
    startExamTimers();
  }

  async function enterFullScreenReviewArena() {
    if (!activeReviewAttempt) return;
    const m = document.getElementById("modal-mock-review");
    if (m) m.classList.remove("active");

    const allCanonical = await getAllRecords("store_questions");
    const canonMap = {};
    allCanonical.forEach(cq => { canonMap[cq.id] = cq; });

    const clonedAttempt = JSON.parse(JSON.stringify(activeReviewAttempt));
    if (Array.isArray(clonedAttempt.questions)) {
      clonedAttempt.questions = clonedAttempt.questions.map(q => {
        const live = canonMap[q.id];
        if (!live) return q;
        return {
          ...q,
          explanation: live.explanation || q.explanation,
          conceptId: live.conceptId || q.conceptId,
          conceptIds: (Array.isArray(live.conceptIds) && live.conceptIds.length > 0) ? live.conceptIds : (q.conceptIds || []),
          annotation: live.annotation || q.annotation,
          bookmarked: !!live.bookmarked
        };
      });
    }

    activeExam = {
      ...clonedAttempt,
      isReviewMode: true,
      activeSectionIndex: 0,
      currentQuestionIndex: 0,
      currentQTimeSpentSec: 0,
      isPaused: false
    };

    pushNavLayer("exam-arena", () => {
      safeSetDisplay("exam-arena", "none");
      toggleScratchpadCanvas(false);
      closeSplitSheetDrawer();
    });
    safeSetDisplay("exam-arena", "flex");
    renderActiveExamQuestion();
    startExamTimers();
  }

  function exitReviewArena() {
    safeSetDisplay("exam-arena", "none");
    toggleScratchpadCanvas(false);
    closeSplitSheetDrawer();
    const wasStudyView = activeExam && activeExam.mockType === "STUDY_VIEW";
    activeExam = null;
    if (!wasStudyView && activeReviewAttempt) {
      openMockReview(activeReviewAttempt);
    }
  }

  async function compileAndLaunchArena(title, questionsPool, durationMin, isSectionLocked = false, customSections = null, isEphemeral = false, positiveMarks = 2.0, negativeMarks = 0.5) {
    clearInterval(examTimerInterval);
    toggleScratchpadCanvas(false);
    closeSplitSheetDrawer();

    if (!questionsPool || questionsPool.length === 0) {
      alert("Cannot launch arena: question pool is empty.");
      return;
    }

    const lockActive = (isSectionLocked === true || isSectionLocked === "YES");
    let configuredSections = [];
    let flattenedQuestions = [];
    let globalCounter = 1;

    if (Array.isArray(customSections) && customSections.length > 0) {
      configuredSections = customSections.map((sec, sIdx) => ({
        id: sec.id || `SEC_${sIdx + 1}`,
        subject: sec.subject || "QA",
        name: sec.name || `${TAXONOMY[sec.subject]?.name || sec.subject} (Part ${sIdx + 1})`,
        durationSec: sec.durationSec || (sec.durationMin ? sec.durationMin * 60 : Math.round((durationMin * 60) / customSections.length)),
        questionCount: sec.questionCount || 0,
        locked: false
      }));

      flattenedQuestions = questionsPool.map((q, idx) => ({
        ...q,
        sectionIndex: typeof q.sectionIndex === "number" ? q.sectionIndex : 0,
        sectionName: q.sectionName || (configuredSections[q.sectionIndex || 0]?.name || title),
        localNumber: q.localNumber || (idx + 1),
        globalNumber: q.globalNumber || (idx + 1)
      }));
    } else {
      const rawSections = {};
      questionsPool.forEach((q) => {
        const sKey = (q.sectionIndex !== undefined && q.sectionName)
          ? `${q.sectionIndex}_${q.sectionName}`
          : `sub_${q.subject || "GEN"}`;
        if (!rawSections[sKey]) {
          rawSections[sKey] = {
            subject: q.subject || "QA",
            name: q.sectionName || (TAXONOMY[q.subject] ? TAXONOMY[q.subject].name : q.subject || "Section"),
            questions: []
          };
        }
        rawSections[sKey].questions.push(q);
      });

      const secKeys = Object.keys(rawSections);

      if (secKeys.length > 1) {
        const secDuration = Math.round((durationMin * 60) / secKeys.length);
        secKeys.forEach((sKey, sIdx) => {
          const secData = rawSections[sKey];
          const secObj = {
            id: `SEC_${sIdx + 1}`,
            subject: secData.subject,
            name: secData.name,
            durationSec: secDuration,
            questionCount: secData.questions.length,
            locked: false
          };
          configuredSections.push(secObj);

          secData.questions.forEach((q, lIdx) => {
            flattenedQuestions.push({
              ...q,
              sectionIndex: sIdx,
              sectionName: secData.name,
              localNumber: lIdx + 1,
              globalNumber: globalCounter++
            });
          });
        });
      } else {
        configuredSections = [{
          id: "SEC_1",
          subject: questionsPool[0]?.subject || "QA",
          name: title || "Diagnostic Arena",
          durationSec: durationMin * 60,
          questionCount: questionsPool.length,
          locked: false
        }];
        flattenedQuestions = questionsPool.map((q, idx) => ({
          ...q,
          sectionIndex: 0,
          sectionName: title || "Diagnostic Arena",
          localNumber: idx + 1,
          globalNumber: idx + 1
        }));
      }
    }

    const now = Date.now();
    const isMicroDrill = flattenedQuestions.length < 10;

    activeExam = {
      sessionId: "ai_mock_" + now,
      parentSessionId: null,
      attemptNumber: 1,
      timestamp: now,
      timeIST: formatISTDate(now),
      diurnalSlot: getDiurnalSlot(now),
      title: title || "AI Practice Arena",
      mockType: isMicroDrill ? "MICRO_DRILL" : (configuredSections.length > 1 ? "CUSTOM" : "SECTIONAL"),
      positiveMarks: parseFloat(positiveMarks) || 2.0,
      negativeMarks: parseFloat(negativeMarks) >= 0 ? parseFloat(negativeMarks) : 0.5,
      isSectionLocked: lockActive,
      isEphemeral: !!isEphemeral,
      sections: configuredSections,
      activeSectionIndex: 0,
      currentQuestionIndex: 0,
      questions: flattenedQuestions,
      sectionRemainingSec: configuredSections[0].durationSec,
      currentQTimeSpentSec: 0,
      userResponses: {},
      isPaused: false,
      isReviewMode: false
    };

    activeExam.questions.forEach(q => {
      activeExam.userResponses[q.id] = {
        selectedOption: null,
        initialOption: null,
        status: "unanswered",
        switches: 0,
        decisionTrail: [],
        timeSpentSec: 0,
        struck: []
      };
    });

    await putRecord("store_active_session", { id: "current_session", session: activeExam });
    hideMiniPlayer();

    if (document.activeElement) document.activeElement.blur();
    pushNavLayer("exam-arena", () => {
      const pauseBtn = document.getElementById("btn-arena-pause");
      if (pauseBtn) pauseBtn.click();
    });
    safeSetDisplay("exam-arena", "flex");
    renderActiveExamQuestion();
    startExamTimers();
  }

  /* ==========================================================================
   * SECTION 20B: GLOBAL SCROLL-SYNCHRONIZED ONEPLUS STYLO 2 / TABLET INK ENGINE
   * - Zero-Mode-Switch Stylus vs. Finger Separation:
   *   * Stylus (pointerType === 'pen') or Mouse draws immediately on contact
   *   * 1-Finger (pointerType === 'touch') scrolls the underlying page naturally
   *     via CSS touch-action: pan-y (unless user toggles Finger: Draw mode on phone)
   * - World-space coordinates (clientY + scrollContainer.scrollTop)
   * - Per-Question & Per-Sheet Ink Memory during session + 4 Ink Colors
   * ========================================================================== */
  function getActiveScrollContainerForInk() {
    const compView = document.getElementById("compendium-fullscreen-view");
    if (compView && compView.style.display === "flex") {
      return document.getElementById("comp-studio-canvas");
    }
    const dojoView = document.getElementById("dojo-arena-view");
    if (dojoView && dojoView.style.display === "flex") {
      return document.getElementById("dojo-arena-body");
    }
    const examView = document.getElementById("exam-arena");
    if (examView && examView.style.display === "flex") {
      return document.getElementById("arena-body");
    }
    return document.scrollingElement || document.documentElement;
  }

  function switchScratchpadContext(newContextKey) {
    if (activeInkContextKey) {
      inkMemoryByContextKey[activeInkContextKey] = [...scratchpadStrokes];
    }
    activeInkContextKey = newContextKey || "global_default";
    scratchpadStrokes = inkMemoryByContextKey[activeInkContextKey]
      ? [...inkMemoryByContextKey[activeInkContextKey]]
      : [];
    currentStroke = [];
    if (scratchpadActive) {
      redrawScratchpad();
    }
  }

  function syncScratchpadModeUI() {
    const overlay = document.getElementById("scratchpad-overlay");
    const btn = document.getElementById("btn-scratch-finger-mode");
    const isScrollMode = !scratchpadFingerDraw;

    scratchpadScrollPassthrough = isScrollMode;

    if (overlay) {
      overlay.classList.toggle("finger-draw-enabled", !isScrollMode);
      overlay.classList.toggle("scroll-passthrough", isScrollMode);
      if (isScrollMode) {
        overlay.classList.remove("pen-active-stroke");
      }
    }

    if (btn) {
      if (isScrollMode) {
        btn.className = "btn btn-emerald";
        btn.innerText = "\uD83D\uDC46 Scroll ON (Tap to Draw)";
      } else {
        btn.className = "btn btn-amber";
        btn.innerText = "\u270D\uFE0F Draw ON (Tap to Scroll)";
      }
    }
  }

  function initScratchpadCanvasListeners() {
    const canvas = document.getElementById("scratchpad-canvas");
    const overlay = document.getElementById("scratchpad-overlay");
    if (!canvas || canvas.dataset.bound === "true") return;
    canvas.dataset.bound = "true";

    let scratchHoldToSnapTimer = null;
    let scratchLastMovePos = null;
    let scratchMultiTouchActive = false;

    const clearScratchHoldTimer = () => {
      if (scratchHoldToSnapTimer) {
        clearTimeout(scratchHoldToSnapTimer);
        scratchHoldToSnapTimer = null;
      }
    };

    // Bind scroll listeners on all primary reading/solving containers + window so ink stays locked to text
    ["arena-body", "dojo-arena-body", "comp-studio-canvas"].forEach(cid => {
      const sc = document.getElementById(cid);
      if (sc) {
        sc.addEventListener("scroll", () => {
          if (scratchpadActive) redrawScratchpad();
        }, { passive: true });
      }
    });

    window.addEventListener("scroll", () => {
      if (scratchpadActive) redrawScratchpad();
    }, { passive: true });

    window.addEventListener("resize", () => {
      if (scratchpadActive) resizeScratchpadCanvas();
    });

    // 2-Finger Natural Scroll Passthrough while in Finger-Draw Mode
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches.length >= 2) {
        scratchMultiTouchActive = true;
        clearScratchHoldTimer();
        if (scratchpadDrawing) {
          scratchpadDrawing = false;
          currentStroke = [];
          redrawScratchpad();
        }
        if (overlay) {
          overlay.classList.add("scroll-passthrough");
          overlay.classList.remove("finger-draw-enabled");
        }
      }
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      if (scratchMultiTouchActive && (!e.touches || e.touches.length === 0)) {
        scratchMultiTouchActive = false;
        syncScratchpadModeUI();
      }
    }, { passive: true });

    // Forward mouse wheel scrolling even when Draw Mode is active so wheel scrolling always works
    canvas.addEventListener("wheel", (e) => {
      if (!scratchpadActive) return;
      const sc = getActiveScrollContainerForInk();
      if (sc) {
        sc.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: "auto" });
        redrawScratchpad();
      }
    }, { passive: true });

    const getWorldPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const sc = getActiveScrollContainerForInk();
      const sTop = sc ? sc.scrollTop : 0;
      const sLeft = sc ? sc.scrollLeft : 0;
      return {
        x: (e.clientX - rect.left) + sLeft,
        y: (e.clientY - rect.top) + sTop
      };
    };

    const startStrokeFromEvent = (e) => {
      if (scratchMultiTouchActive) return;
      const isHardwareEraser = (e.pointerType === "pen" && (e.buttons === 32 || e.button === 5));
      const effectiveMode = isHardwareEraser ? "ERASER" : scratchpadMode;
      const pressure = (e.pointerType === "pen" && e.pressure > 0) ? e.pressure : 0.5;

      scratchpadDrawing = true;
      clearScratchHoldTimer();
      const pos = getWorldPos(e);
      scratchLastMovePos = { x: pos.x, y: pos.y };
      currentStroke = [{
        x: pos.x,
        y: pos.y,
        mode: effectiveMode,
        color: scratchpadColor,
        pressure: pressure
      }];
      redrawScratchpad();
    };

    const moveStrokeFromEvent = (e) => {
      if (scratchMultiTouchActive || !scratchpadDrawing || !scratchpadActive) return;
      const activeMode = currentStroke[0] ? currentStroke[0].mode : scratchpadMode;
      const activeCol = currentStroke[0] ? currentStroke[0].color : scratchpadColor;
      const pressure = (e.pointerType === "pen" && e.pressure > 0) ? e.pressure : 0.5;

      const pos = getWorldPos(e);
      currentStroke.push({
        x: pos.x,
        y: pos.y,
        mode: activeMode,
        color: activeCol,
        pressure: pressure
      });
      redrawScratchpad();

      if (activeMode !== "ERASER") {
        const moved = scratchLastMovePos ? Math.hypot(pos.x - scratchLastMovePos.x, pos.y - scratchLastMovePos.y) : 99;
        if (moved >= 4.2) {
          scratchLastMovePos = { x: pos.x, y: pos.y };
          clearScratchHoldTimer();
          scratchHoldToSnapTimer = setTimeout(() => {
            if (!scratchpadDrawing || currentStroke.length < 6) return;
            const snapped = snapStrokeToGeometricShape(currentStroke, canvas.width || 1000, canvas.height || 1000, false);
            if (snapped && snapped.length >= 2) {
              currentStroke = snapped;
              if (navigator.vibrate) navigator.vibrate(18);
              redrawScratchpad();
            }
          }, 350);
        }
      }
    };

    const finishStroke = () => {
      clearScratchHoldTimer();
      if (!scratchpadDrawing) return;
      scratchpadDrawing = false;
      if (overlay) overlay.classList.remove("pen-active-stroke");
      if (currentStroke.length > 0) {
        const committedStroke = [...currentStroke];
        scratchpadStrokes.push(committedStroke);
        inkMemoryByContextKey[activeInkContextKey] = [...scratchpadStrokes];
        currentStroke = [];

        if (scratchpadLaserMode) {
          setTimeout(() => {
            const idx = scratchpadStrokes.indexOf(committedStroke);
            if (idx !== -1) {
              scratchpadStrokes.splice(idx, 1);
              inkMemoryByContextKey[activeInkContextKey] = [...scratchpadStrokes];
              redrawScratchpad();
            }
          }, 2800);
        }
      }
      redrawScratchpad();
    };

    // 1. Direct Canvas Pointer Listeners (Active when Draw Mode is ON)
    canvas.addEventListener("pointerdown", (e) => {
      if (!scratchpadActive || scratchMultiTouchActive) return;
      if (!e.isPrimary) return;
      if (scratchpadScrollPassthrough && e.pointerType !== "pen") return;

      e.preventDefault();
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
      startStrokeFromEvent(e);
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!scratchpadDrawing || !scratchpadActive || scratchMultiTouchActive) return;
      e.preventDefault();
      moveStrokeFromEvent(e);
    });

    canvas.addEventListener("pointerup", finishStroke);
    canvas.addEventListener("pointercancel", finishStroke);

    // 2. Global Stylo 2 / Active Stylus Auto-Ink Capture (Even when Scroll Mode is ON!)
    window.addEventListener("pointerdown", (e) => {
      if (!scratchpadActive || e.pointerType !== "pen") return;
      if (!scratchpadScrollPassthrough) return; // Already handled by canvas when Draw Mode is ON
      if (e.target && e.target.closest(".scratchpad-toolbar, button, input, select, textarea, a, .arena-header, .arena-footer")) {
        return;
      }
      if (overlay) overlay.classList.add("pen-active-stroke");
      e.preventDefault();
      startStrokeFromEvent(e);
    }, { capture: true });

    window.addEventListener("pointermove", (e) => {
      if (!scratchpadDrawing || !scratchpadActive || e.pointerType !== "pen") return;
      if (!scratchpadScrollPassthrough) return;
      e.preventDefault();
      moveStrokeFromEvent(e);
    }, { capture: true });

    window.addEventListener("pointerup", (e) => {
      if (scratchpadDrawing && e.pointerType === "pen") {
        finishStroke();
      }
    }, { capture: true });
  }

  function resizeScratchpadCanvas() {
    const canvas = document.getElementById("scratchpad-canvas");
    const overlay = document.getElementById("scratchpad-overlay");
    if (!canvas || !overlay) return;
    canvas.width = overlay.clientWidth || window.innerWidth;
    canvas.height = overlay.clientHeight || (window.innerHeight - 56);
    redrawScratchpad();
  }

  function redrawScratchpad() {
    const canvas = document.getElementById("scratchpad-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sc = getActiveScrollContainerForInk();
    const sTop = sc ? sc.scrollTop : 0;
    const sLeft = sc ? sc.scrollLeft : 0;

    const allStrokes = currentStroke.length > 0 ? [...scratchpadStrokes, currentStroke] : scratchpadStrokes;
    allStrokes.forEach(stroke => {
      if (!stroke || stroke.length === 0) return;
      ctx.save();
      ctx.beginPath();
      const isEraser = stroke[0].mode === "ERASER";
      const strokeCol = stroke[0].color || "#38bdf8";
      const avgPressure = stroke[0].pressure || 0.5;
      ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = isEraser ? 28 : Math.max(1.8, Math.min(4.8, 2.0 + avgPressure * 2.2));
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (scratchpadLaserMode && !isEraser) {
        ctx.shadowColor = strokeCol;
        ctx.shadowBlur = 10;
      }

      ctx.moveTo(stroke[0].x - sLeft, stroke[0].y - sTop);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x - sLeft, stroke[i].y - sTop);
      }
      ctx.stroke();
      ctx.restore();
    });
    ctx.globalCompositeOperation = "source-over";
  }

  function toggleScratchpadCanvas(forceState = null) {
    const overlay = document.getElementById("scratchpad-overlay");
    if (!overlay) return;
    scratchpadActive = forceState !== null ? forceState : !scratchpadActive;
    overlay.classList.toggle("active", scratchpadActive);

    if (scratchpadActive) {
      // Preserve OnePlus Stylo 2 / Tablet natural workflow:
      // Default scratchpadFingerDraw = false (1-finger scrolls & taps options naturally, while Stylo 2 pen draws immediately on contact!)
      syncScratchpadModeUI();
      initScratchpadCanvasListeners();
      setTimeout(resizeScratchpadCanvas, 20);
    } else {
      scratchpadDrawing = false;
      overlay.classList.remove("finger-draw-enabled", "scroll-passthrough", "pen-active-stroke");
    }

    const btn = document.getElementById("btn-arena-scratchpad");
    if (btn) btn.classList.toggle("active", scratchpadActive);
    const dojoBtn = document.getElementById("btn-dojo-scratchpad");
    if (dojoBtn) dojoBtn.classList.toggle("active", scratchpadActive);
  }

  function toggleScratchpadLaserMode(forceState = null) {
    scratchpadLaserMode = typeof forceState === "boolean" ? forceState : !scratchpadLaserMode;
    const btn = document.getElementById("btn-scratch-laser");
    if (btn) {
      btn.className = scratchpadLaserMode ? "btn btn-purple" : "btn btn-secondary";
      btn.innerText = scratchpadLaserMode ? "\u2728 Laser ON (3s)" : "\u2728 Laser (3s)";
    }
  }

  function toggleScratchpadFingerDraw(forceDrawState = null) {
    scratchpadFingerDraw = typeof forceDrawState === "boolean" ? forceDrawState : !scratchpadFingerDraw;
    syncScratchpadModeUI();
  }

  function toggleScratchpadScrollMode() {
    toggleScratchpadFingerDraw();
  }

  function setScratchpadColor(colorHex, btnEl) {
    scratchpadColor = colorHex || "#38bdf8";
    if (scratchpadMode === "ERASER") {
      setScratchpadMode("PEN");
    }
    if (!scratchpadFingerDraw) {
      toggleScratchpadFingerDraw(true);
    }
    document.querySelectorAll(".ink-color-dot").forEach(dot => {
      dot.classList.toggle("active", dot === btnEl || dot.dataset.color === scratchpadColor);
    });
  }

  function setScratchpadMode(mode) {
    scratchpadMode = mode === "ERASER" ? "ERASER" : "PEN";
    if (!scratchpadFingerDraw) {
      toggleScratchpadFingerDraw(true);
    }
    const penBtn = document.getElementById("btn-scratch-pen");
    const erBtn = document.getElementById("btn-scratch-eraser");
    if (penBtn) {
      penBtn.className = scratchpadMode === "PEN" ? "btn btn-cyan" : "btn btn-secondary";
    }
    if (erBtn) {
      erBtn.className = scratchpadMode === "ERASER" ? "btn btn-cyan" : "btn btn-secondary";
    }
  }

  function undoScratchpadStroke() {
    scratchpadStrokes.pop();
    inkMemoryByContextKey[activeInkContextKey] = [...scratchpadStrokes];
    redrawScratchpad();
  }

  function clearScratchpadCanvas() {
    scratchpadStrokes = [];
    currentStroke = [];
    inkMemoryByContextKey[activeInkContextKey] = [];
    redrawScratchpad();
  }
  /* ==========================================================================
   * SECTION 21: OMNIPOTENT CONSOLE COMMAND BUS (V3) & AI PERSISTENT MEMORY
   * ========================================================================== */
  const COMMAND_REGISTRY = {
    CREATE_MOCK: async (payload) => {
      const isEphemeral = (payload.ephemeral === true || payload.persistQuestions === false);
      const isLocked = (payload.isSectionLocked === true || payload.isSectionLocked === "YES");
      const config = {
        ...(payload.selection || payload),
        isSectionLocked: isLocked,
        ephemeral: isEphemeral,
        persistQuestions: !isEphemeral
      };
      const instance = await MockService.generate(config);

      let savedRecord = null;
      if (!isEphemeral && (payload.saveAsPreset || payload.saveBlueprint)) {
        savedRecord = await MockService.saveMockDefinition({
          title: payload.title || instance.title,
          type: payload.selection ? "DYNAMIC_BLUEPRINT" : "FIXED_PAPER",
          positiveMarks: instance.positiveMarks,
          negativeMarks: instance.negativeMarks,
          selectionRule: payload.selection || null,
          isSectionLocked: instance.isSectionLocked,
          sections: instance.sections,
          questions: instance.questions
        });
      }

      if (payload.launchImmediately) {
        await MockService.launchMockSession(instance);
      }

      return {
        mockId: savedRecord ? savedRecord.id : `instance_${Date.now()}`,
        title: instance.title,
        questionCount: instance.totalSelected,
        positiveMarks: instance.positiveMarks,
        negativeMarks: instance.negativeMarks,
        isSectionLocked: instance.isSectionLocked,
        sectionsCount: instance.sections ? instance.sections.length : 1,
        isEphemeral: isEphemeral,
        questionIds: instance.questions.map(q => q.id),
        launched: !!payload.launchImmediately
      };
    },

    CREATE_AND_SAVE_FIXED_MOCK: async (payload) => {
      return await COMMAND_REGISTRY.CREATE_MOCK({ ...payload, saveAsPreset: true });
    },

    LAUNCH_DOJO: async (payload) => {
      const {
        title = "AI Prescribed Dojo Clinic",
        subject = "ALL",
        chapter = "ALL",
        method = "ALL",
        formulaBrief = null,
        explicitQuestionIds = [],
        customQuestions = [],
        shuffleOptions = false
      } = payload || {};

      const allQs = await getAllRecords("store_questions");
      let pool = [];

      if (Array.isArray(explicitQuestionIds) && explicitQuestionIds.length > 0) {
        const idSet = new Set(explicitQuestionIds);
        pool.push(...allQs.filter(q => idSet.has(q.id)));
      }
      if (Array.isArray(customQuestions) && customQuestions.length > 0) {
        for (const rawQ of customQuestions) {
          const item = sanitizeQuestion(rawQ);
          if (rawQ.ephemeral === false || rawQ.persist === true) {
            await putRecord("store_questions", item);
            SearchService.invalidate();
          }
          pool.push(item);
        }
      }
      if (pool.length === 0) {
        pool = allQs.filter(q => {
          if (subject !== "ALL" && q.subject !== subject) return false;
          if (chapter !== "ALL" && q.chapter !== chapter) return false;
          if (method !== "ALL" && q.method !== method) return false;
          return true;
        });
      }

      if (shuffleOptions) {
        pool = pool.map(q => MockService.permuteQuestionOptions(q));
      }

      await openDojoSessionWithQuestions(pool, title, formulaBrief);
      return {
        launchedDojo: true,
        title: title,
        questionCount: pool.length,
        questionIds: pool.map(q => q.id)
      };
    },

    GET_SYSTEM_STATS: async () => {
      const allQs = await getAllRecords("store_questions");
      const allAttempts = await getAllRecords("store_attempts");
      const allConcepts = await ConceptService.getAll();
      const allPresets = await getAllRecords("store_saved_mocks");
      const allConsultations = await getAllRecords("store_ai_consultations");

      const bySubject = {};
      const byChapter = {};
      const sheetsByChapter = {};
      allQs.forEach(q => {
        const s = q.subject || "UNKNOWN";
        const c = q.chapter || "UNKNOWN";
        bySubject[s] = (bySubject[s] || 0) + 1;
        byChapter[c] = (byChapter[c] || 0) + 1;
      });
      allConcepts.forEach(c => {
        const ch = c.chapter || "UNKNOWN";
        sheetsByChapter[ch] = (sheetsByChapter[ch] || 0) + 1;
      });

      return {
        totalQuestions: allQs.length,
        questionsBySubject: bySubject,
        questionsByChapter: byChapter,
        sheetsByChapter: sheetsByChapter,
        completedMocksCount: allAttempts.filter(a => a.completed && a.mockType !== "STUDY_VIEW").length,
        totalAttemptsCount: allAttempts.length,
        livingSheetsCount: allConcepts.length,
        savedMocksCount: allPresets.length,
        consultationsCount: allConsultations.length,
        apiKeysConfigured: AiGatewayService.keys.length,
        schemaVersion: DB_VERSION,
        subjectParConfig: SUBJECT_PAR_CONFIG,
        taxonomy: TAXONOMY
      };
    },

    GET_CHAPTER_BLUEPRINT: async (payload) => {
      const { subject = "ALL", chapter = "ALL" } = payload || {};
      const allQs = await getAllRecords("store_questions");
      const allConcepts = await ConceptService.getAll();
      const perfMap = await PerformanceService.getQuestionPerformanceMap();

      const scopedConcepts = allConcepts.filter(c => {
        if (subject !== "ALL" && c.subject !== subject) return false;
        if (chapter !== "ALL" && c.chapter !== chapter) return false;
        return true;
      });

      const scopedQs = allQs.filter(q => {
        if (subject !== "ALL" && q.subject !== subject) return false;
        if (chapter !== "ALL" && q.chapter !== chapter) return false;
        return true;
      });

      return {
        scope: { subject, chapter },
        sheetsCount: scopedConcepts.length,
        questionsCount: scopedQs.length,
        sheets: scopedConcepts.map(c => ({
          id: c.id,
          chapter: c.chapter,
          title: c.title,
          subtitle: c.subtitle
        })),
        archetypes: scopedQs.map(q => {
          const st = perfMap[q.id];
          return {
            id: q.id,
            chapter: q.chapter,
            subtopic: q.subtopic,
            method: q.method,
            difficulty: q.difficulty,
            conceptIds: q.conceptIds || [],
            bookmarked: !!q.bookmarked,
            attempts: st ? st.attempts : 0,
            acc: st && st.attempts > 0 ? Math.round((st.correct / st.attempts) * 100) : null
          };
        })
      };
    },

    AUDIT_DATA_INTEGRITY: async () => {
      const allQs = await getAllRecords("store_questions");
      const allConcepts = await ConceptService.getAll();
      const taxonomy = await TaxonomyService.getTaxonomy();
      const conceptIdSet = new Set(allConcepts.map(c => c.id));

      const validChaptersBySub = {};
      Object.keys(taxonomy).forEach(sKey => {
        validChaptersBySub[sKey] = new Set(taxonomy[sKey].chapters || []);
      });

      const orphanQuestions = allQs.filter(q => !validChaptersBySub[q.subject] || !validChaptersBySub[q.subject].has(q.chapter));
      const orphanConcepts = allConcepts.filter(c => !validChaptersBySub[c.subject] || !validChaptersBySub[c.subject].has(c.chapter));

      const unlinkedQuestions = [];
      const brokenConceptLinks = [];
      const stemMap = {};
      const duplicateQuestionPairs = [];

      allQs.forEach(q => {
        const cIds = Array.isArray(q.conceptIds) ? q.conceptIds : (q.conceptId ? [q.conceptId] : []);
        if (cIds.length === 0) {
          unlinkedQuestions.push(q.id);
        } else {
          cIds.forEach(cid => {
            if (!conceptIdSet.has(cid)) {
              brokenConceptLinks.push({ questionId: q.id, missingConceptId: cid });
            }
          });
        }

        const normStem = (q.questionText || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 120);
        if (normStem.length > 20) {
          if (stemMap[normStem]) {
            duplicateQuestionPairs.push([stemMap[normStem], q.id]);
          } else {
            stemMap[normStem] = q.id;
          }
        }
      });

      const titleMap = {};
      const duplicateSheetCandidates = [];
      const sheetsWithCitationLeaks = [];
      allConcepts.forEach(c => {
        if (/\[span_\d+\]/.test(c.content || "")) {
          sheetsWithCitationLeaks.push(c.id);
        }
        const key = `${c.chapter}::${(c.subtitle || "").toLowerCase().slice(0, 35)}`;
        if (c.subtitle && titleMap[key]) {
          duplicateSheetCandidates.push([titleMap[key], c.id]);
        } else if (c.subtitle) {
          titleMap[key] = c.id;
        }
      });

      return {
        totalQuestions: allQs.length,
        totalConcepts: allConcepts.length,
        unlinkedQuestionsCount: unlinkedQuestions.length,
        unlinkedQuestionIds: unlinkedQuestions.slice(0, 50),
        brokenConceptLinksCount: brokenConceptLinks.length,
        brokenConceptLinks: brokenConceptLinks.slice(0, 50),
        duplicateQuestionPairs,
        duplicateSheetCandidates,
        sheetsWithCitationLeaks,
        taxonomyOrphans: {
          questions: orphanQuestions.map(q => ({ id: q.id, subject: q.subject, chapter: q.chapter })),
          concepts: orphanConcepts.map(c => ({ id: c.id, subject: c.subject, chapter: c.chapter }))
        }
      };
    },

    CLEANUP_COMPENDIUM_STORE: async () => {
      const allConcepts = await ConceptService.getAll();
      const allQs = await getAllRecords("store_questions");

      const worldGeoIds = new Set([
        "top_ga_geo_climatology_circulation",
        "top_ga_geo_geodesy_earth_motions",
        "top_ga_geo_geomorphology_landforms",
        "top_ga_geo_interior_seismology",
        "top_ga_geo_oceanography_dynamics",
        "top_ga_geo_petrology_rock_cycle",
        "top_ga_geo_plate_tectonics_volcanism"
      ]);

      const duplicateRedirects = {
        "top_eng_ows_medical_pathology": "top_eng_ows_domain_medical_sciences",
        "top_eng_ows_phobias_manias": "top_eng_ows_domain_phobias_manias",
        "top_eng_ows_habitats_enclosures": "top_eng_ows_domain_places_habitats",
        "top_eng_ows_killings_killers": "top_eng_ows_roots_killing_cide",
        "top_eng_synant_frugality_extravagance": "top_eng_synant_affluence_penury"
      };

      const conceptMap = {};
      allConcepts.forEach(c => { conceptMap[c.id] = c; });

      let sanitizedCount = 0;
      let reassignedGeoCount = 0;
      let mergedDuplicatesCount = 0;

      for (const [dupId, primaryId] of Object.entries(duplicateRedirects)) {
        const dupSheet = conceptMap[dupId];
        const primarySheet = conceptMap[primaryId];
        if (dupSheet && primarySheet) {
          if (!primarySheet.content.includes(dupSheet.title)) {
            primarySheet.content = `${stripCitationArtifacts(primarySheet.content)}\n\n---\n\n${stripCitationArtifacts(dupSheet.content)}`;
          }
          await putRecord("store_concepts", sanitizeDossier(primarySheet));
          await deleteRecordFromStore("store_concepts", dupId);
          delete conceptMap[dupId];
          mergedDuplicatesCount++;
        }
      }

      for (const c of Object.values(conceptMap)) {
        let modified = false;
        const cleaned = stripCitationArtifacts(cleanMojibake(c.content || ""));
        if (cleaned !== c.content) {
          c.content = cleaned;
          modified = true;
          sanitizedCount++;
        }
        if (worldGeoIds.has(c.id) && c.chapter !== "GA_GEOGRAPHY_WORLD") {
          c.chapter = "GA_GEOGRAPHY_WORLD";
          modified = true;
          reassignedGeoCount++;
        }
        if (modified) {
          await putRecord("store_concepts", sanitizeDossier(c));
        }
      }

      let questionsRelinked = 0;
      for (const q of allQs) {
        let qChanged = false;
        if (Array.isArray(q.conceptIds)) {
          const updatedIds = q.conceptIds.map(cid => {
            if (duplicateRedirects[cid]) {
              qChanged = true;
              return duplicateRedirects[cid];
            }
            return cid;
          });
          q.conceptIds = [...new Set(updatedIds)];
          q.conceptId = q.conceptIds[0] || "";
        }
        if (qChanged) {
          await putRecord("store_questions", sanitizeQuestion(q));
          questionsRelinked++;
        }
      }

      SearchService.invalidate();
      return {
        sanitizedSheetsCount: sanitizedCount,
        reassignedWorldGeoCount: reassignedGeoCount,
        mergedDuplicateSheetsCount: mergedDuplicatesCount,
        questionsRelinkedCount: questionsRelinked
      };
    },

    BULK_PATCH_RECORDS: async (payload) => {
      const { store = "store_questions", patches = [], filter = null, updates = null } = payload || {};
      const allowed = ["store_questions", "store_concepts", "store_saved_mocks", "store_notes"];
      if (!allowed.includes(store)) throw new Error(`Disallowed store for bulk patch: ${store}`);

      let updatedCount = 0;
      const allRecords = await getAllRecords(store);
      const recordMap = {};
      allRecords.forEach(r => { recordMap[r.id] = r; });

      if (Array.isArray(patches) && patches.length > 0) {
        for (const p of patches) {
          const target = recordMap[p.id];
          if (target) {
            const merged = { ...target, ...(p.updates || p) };
            const clean = store === "store_questions" ? sanitizeQuestion(merged) : (store === "store_concepts" ? sanitizeDossier(merged) : merged);
            await putRecord(store, clean);
            updatedCount++;
          }
        }
      } else if (filter && updates) {
        for (const r of allRecords) {
          let match = true;
          for (const [k, v] of Object.entries(filter)) {
            if (r[k] !== v) { match = false; break; }
          }
          if (match) {
            const merged = { ...r, ...updates };
            const clean = store === "store_questions" ? sanitizeQuestion(merged) : (store === "store_concepts" ? sanitizeDossier(merged) : merged);
            await putRecord(store, clean);
            updatedCount++;
          }
        }
      }

      SearchService.invalidate();
      return { store, updatedCount };
    },

    SET_UI_CONFIG: async (payload) => {
      const { readerScale, subjectParTimes, heroSubtitle, customMistakeTagsList } = payload || {};
      if (typeof readerScale === "number") {
        readerFontScale = Math.min(1.35, Math.max(0.84, readerScale));
        document.documentElement.style.setProperty("--reader-font-scale", String(readerFontScale));
        await putRecord("store_config", { key: "reader_font_scale", value: readerFontScale });
      }
      if (subjectParTimes && typeof subjectParTimes === "object") {
        SUBJECT_PAR_CONFIG = { ...SUBJECT_PAR_CONFIG, ...subjectParTimes };
        await putRecord("store_config", { key: "subject_par_config", value: SUBJECT_PAR_CONFIG });
      }
      if (typeof heroSubtitle === "string") {
        safeSetText("dash-hero-sub", heroSubtitle);
        await putRecord("store_config", { key: "hero_subtitle", value: heroSubtitle });
      }
      if (Array.isArray(customMistakeTagsList)) {
        customMistakeTags = [...new Set([...customMistakeTags, ...customMistakeTagsList])];
        await putRecord("store_config", { key: "custom_mistake_tags", value: customMistakeTags });
      }
      return {
        readerFontScale,
        subjectParConfig: SUBJECT_PAR_CONFIG,
        customMistakeTagsCount: customMistakeTags.length
      };
    },

    INJECT_CUSTOM_CSS: async (payload) => {
      const css = (payload && payload.css !== undefined) ? String(payload.css) : "";
      let styleTag = document.getElementById("cgl-os-custom-css");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "cgl-os-custom-css";
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = css;
      await putRecord("store_config", { key: "custom_css_overrides", value: css });
      return { injected: true, length: css.length };
    },

    RUN_SANDBOX_QUERY: async (payload) => {
      const { store = "store_questions", where = {}, groupBy = null, select = null, limit = 100 } = payload || {};
      const records = await getAllRecords(store);

      const matched = records.filter(r => {
        for (const [k, cond] of Object.entries(where)) {
          const val = r[k];
          if (cond && typeof cond === "object" && !Array.isArray(cond)) {
            if (cond.$eq !== undefined && val !== cond.$eq) return false;
            if (cond.$ne !== undefined && val === cond.$ne) return false;
            if (cond.$in !== undefined && Array.isArray(cond.$in) && !cond.$in.includes(val)) return false;
            if (cond.$regex !== undefined && !new RegExp(cond.$regex, "i").test(String(val || ""))) return false;
            if (cond.$gt !== undefined && !(val > cond.$gt)) return false;
            if (cond.$lt !== undefined && !(val < cond.$lt)) return false;
          } else if (val !== cond) {
            return false;
          }
        }
        return true;
      });

      if (groupBy) {
        const groups = {};
        matched.forEach(r => {
          const gKey = r[groupBy] || "UNDEFINED";
          groups[gKey] = (groups[gKey] || 0) + 1;
        });
        return { store, totalMatched: matched.length, groupedBy: groupBy, groups };
      }

      const sliced = matched.slice(0, limit);
      const projected = Array.isArray(select) && select.length > 0
        ? sliced.map(r => {
            const obj = {};
            select.forEach(f => { obj[f] = r[f]; });
            return obj;
          })
        : sliced;

      return { store, totalMatched: matched.length, returnedCount: projected.length, results: projected };
    },

    FETCH_QUESTIONS: async (payload) => {
      const allQs = await getAllRecords("store_questions");
      const { ids, subject, chapter, difficulty, limit = 50, offset = 0, idsOnly = false } = payload || {};

      let filtered = allQs;
      if (Array.isArray(ids) && ids.length > 0) {
        const idSet = new Set(ids);
        filtered = allQs.filter(q => idSet.has(q.id));
      } else {
        if (subject && subject !== "ALL") filtered = filtered.filter(q => q.subject === subject);
        if (chapter && chapter !== "ALL") filtered = filtered.filter(q => q.chapter === chapter);
        if (difficulty && difficulty !== "ALL") filtered = filtered.filter(q => q.difficulty === difficulty);
      }

      const totalMatching = filtered.length;
      const numLimit = (limit === "ALL" || limit === -1) ? totalMatching : parseInt(limit, 10);
      const sliced = filtered.slice(offset, offset + numLimit);

      return {
        totalMatching: totalMatching,
        returnedCount: sliced.length,
        offset: offset,
        questions: idsOnly ? sliced.map(q => q.id) : sliced
      };
    },

    FETCH_STORE_RECORDS: async (payload) => {
      const { store, keys, limit = 50, offset = 0 } = payload || {};
      if (!store) throw new Error("A valid store name is required.");
      const records = await getAllRecords(store);

      let filtered = records;
      if (Array.isArray(keys) && keys.length > 0) {
        const keySet = new Set(keys);
        filtered = records.filter(r => keySet.has(r.id || r.sessionId || r.key));
      }

      const totalRecords = filtered.length;
      const numLimit = (limit === "ALL" || limit === -1) ? totalRecords : parseInt(limit, 10);
      const sliced = filtered.slice(offset, offset + numLimit);

      return {
        store: store,
        totalRecords: totalRecords,
        returnedCount: sliced.length,
        records: sliced
      };
    },

    VERIFY_QUESTION_EXISTS: async (payload) => {
      const { ids = [] } = payload || {};
      const allQs = await getAllRecords("store_questions");
      const existingSet = new Set(allQs.map(q => q.id));
      const found = ids.filter(id => existingSet.has(id));
      const missing = ids.filter(id => !existingSet.has(id));
      return { totalQueried: ids.length, foundCount: found.length, missingCount: missing.length, found, missing };
    },

    SEARCH_QUESTIONS: async (payload) => {
      const res = await SearchService.searchAll(payload.query, payload.filters || payload, payload.limit || 25);
      return { count: res.totalQuestions, results: res.questions };
    },

    SEARCH_CONCEPTS: async (payload) => {
      const res = await SearchService.searchAll(payload.query, payload.filters || payload, payload.limit || 25);
      return { count: res.totalConcepts, results: res.concepts };
    },

    GET_TAXONOMY: async () => {
      return await TaxonomyService.getTaxonomy();
    },

    GET_PERFORMANCE: async (payload) => {
      if (payload && payload.subject && payload.chapter) {
        return await PerformanceService.getChapterStats(payload.subject, payload.chapter);
      }
      return await PerformanceService.calculateGlobalMetrics();
    },

    GET_WEAK_CHAPTERS: async (payload) => {
      return await PerformanceService.getWeakChapters(payload ? payload.subject : null);
    },

    GET_MOCK: async (payload) => {
      return await getRecord("store_saved_mocks", payload.mockId);
    },

    LIST_MOCKS: async () => {
      return await getAllRecords("store_saved_mocks");
    },

    CREATE_QUESTION: async (payload) => {
      const q = await QuestionService.create(payload.question || payload);
      SearchService.invalidate();
      return { created: true, id: q.id, question: q };
    },

    UPDATE_QUESTION: async (payload) => {
      const q = await QuestionService.update(payload.id, payload.updates || payload);
      SearchService.invalidate();
      return { updated: true, id: q.id };
    },

    DELETE_QUESTION: async (payload) => {
      const res = await QuestionService.delete(payload.id);
      SearchService.invalidate();
      return res;
    },

    DELETE_MOCK: async (payload) => {
      return await MockService.deleteMock(payload.mockId);
    },

    CREATE_CONCEPT: async (payload) => {
      const c = await ConceptService.create(payload.concept || payload);
      SearchService.invalidate();
      return { created: true, id: c.id, concept: c };
    },

    UPDATE_CONCEPT: async (payload) => {
      const c = await ConceptService.update(payload.id, payload.updates || payload);
      SearchService.invalidate();
      return { updated: true, id: c.id };
    },

    DELETE_CONCEPT: async (payload) => {
      await ConceptService.delete(payload.id);
      SearchService.invalidate();
      return { deleted: true, id: payload.id };
    },

    ADD_CHAPTER: async (payload) => {
      const chap = await TaxonomyService.addChapter(payload.subject, payload.chapter);
      return { success: true, chapter: chap };
    },

    MERGE_CHAPTERS: async (payload) => {
      await TaxonomyService.mergeChapters(payload.subject, payload.sourceChapter, payload.targetChapter);
      return { success: true, merged: `${payload.sourceChapter} \u2794 ${payload.targetChapter}` };
    },

    SAVE_AI_INSIGHT: async (payload) => {
      const insight = {
        id: payload.insightId || `insight_${Date.now()}`,
        type: payload.type || "weakness",
        subject: payload.subject || "QA",
        chapter: payload.chapter || "",
        concept: payload.concept || "",
        statement: payload.statement || "",
        evidenceIds: Array.isArray(payload.evidence) ? payload.evidence : [],
        confidence: payload.confidence || 0.85,
        status: payload.status || "active",
        recommendedAction: payload.recommendedAction || "",
        createdAt: payload.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      await putRecord("store_ai_consultations", insight);
      return { success: true, insightId: insight.id };
    },

    SAVE_AI_PLAN: async (payload) => {
      const plan = {
        id: payload.planId || `plan_${Date.now()}`,
        goal: payload.goal || "Remediation",
        subject: payload.subject || "QA",
        steps: Array.isArray(payload.steps) ? payload.steps : [],
        successCondition: payload.successCondition || "\u226580% accuracy",
        status: payload.status || "active",
        createdAt: Date.now()
      };
      await putRecord("store_ai_consultations", plan);
      return { success: true, planId: plan.id };
    },

    GET_AI_CONTEXT: async () => {
      const allConsultations = await getAllRecords("store_ai_consultations");
      const attempts = await getAllRecords("store_attempts");
      const global = await PerformanceService.calculateGlobalMetrics();
      const weak = await PerformanceService.getWeakChapters();
      const allQs = await getAllRecords("store_questions");
      const starredIds = allQs.filter(q => q.bookmarked).map(q => q.id);

      return {
        timestampIST: formatISTDate(Date.now()),
        globalMetrics: global,
        weakAreas: weak.slice(0, 8),
        starredQuestionIds: starredIds,
        recentCompletedAttemptsCount: attempts.filter(a => a.completed && a.mockType !== "STUDY_VIEW").length,
        persistedAiConsultations: allConsultations.slice(-10)
      };
    },

    RAW_DB_OPERATION: async (payload) => {
      const { store, operation, key, record, confirmationToken } = payload;
      const allowedStores = [
        "store_questions", "store_concepts",
        "store_notes", "store_saved_mocks", "store_ai_consultations", "store_config"
      ];
      if (!allowedStores.includes(store)) throw new Error(`Disallowed store: ${store}`);

      if (operation === "CLEAR") {
        if (confirmationToken !== "CONFIRM_DESTROY_STORE") {
          throw new Error("Destructive operation blocked: Missing valid confirmationToken.");
        }
        await clearStore(store);
        SearchService.invalidate();
        return { success: true, operation: "CLEAR", store };
      } else if (operation === "PUT") {
        await putRecord(store, record);
        SearchService.invalidate();
        return { success: true, operation: "PUT", store };
      } else if (operation === "DELETE") {
        await deleteRecordFromStore(store, key);
        SearchService.invalidate();
        return { success: true, operation: "DELETE", store, key };
      }
      throw new Error(`Unsupported raw operation: ${operation}`);
    },

    BATCH_INGEST_QUESTIONS: async (payload) => {
      const count = await QuestionService.bulkCreate(payload.questions, payload.source || "Ingested Bank");
      SearchService.invalidate();
      return { success: true, count: count };
    },

    BATCH_INGEST_COMPENDIUM: async (payload) => {
      const dossiers = (payload.dossiers || []).map(sanitizeDossier);
      await runTx(["store_concepts"], "readwrite", (tx) => {
        const stC = tx.objectStore("store_concepts");
        dossiers.forEach(d => stC.put(d));
      });
      SearchService.invalidate();
      return { success: true, count: dossiers.length };
    },

    INGEST_AND_ASSEMBLE_COMPLETE_MOCK: async (payload) => {
      const {
        title = "Curated Practice Mock",
        launchImmediately = false,
        launchInDojo = false,
        isSectionLocked = false,
        positiveMarks = 2.0,
        negativeMarks = 0.5,
        durationMin = 20,
        dossiers = [],
        newQuestions = [],
        linkExistingQuestions = [],
        orderedMockQuestionIds = [],
        sections = null
      } = payload;

      const isLocked = (isSectionLocked === true || isSectionLocked === "YES");

      if (dossiers.length > 0) {
        await runTx(["store_concepts"], "readwrite", (tx) => {
          const st = tx.objectStore("store_concepts");
          dossiers.forEach(d => st.put(sanitizeDossier(d)));
        });
      }
      if (newQuestions.length > 0) {
        for (const nq of newQuestions) {
          const item = sanitizeQuestion(nq);
          if (item.ephemeral !== true && nq.persist !== false) {
            await putRecord("store_questions", item);
          }
        }
      }
      if (linkExistingQuestions.length > 0) {
        for (const link of linkExistingQuestions) {
          const oldQ = await QuestionService.get(link.questionId);
          if (oldQ) {
            const newCIds = Array.isArray(link.assignConceptIds) ? link.assignConceptIds : [link.assignConceptId];
            oldQ.conceptIds = [...new Set([...(oldQ.conceptIds || []), ...newCIds])];
            oldQ.conceptId = oldQ.conceptIds[0] || "";
            await putRecord("store_questions", oldQ);
          }
        }
      }

      const allQs = await getAllRecords("store_questions");
      const resolved = [];
      const addedIds = new Set();

      orderedMockQuestionIds.forEach(id => {
        const found = allQs.find(q => q.id === id);
        if (found && !addedIds.has(found.id)) {
          resolved.push({ ...found });
          addedIds.add(found.id);
        }
      });

      newQuestions.forEach(nq => {
        const item = sanitizeQuestion(nq);
        if (!addedIds.has(item.id)) {
          resolved.push(item);
          addedIds.add(item.id);
        }
      });

      let resolvedSections = sections;
      if (!resolvedSections || resolvedSections.length === 0) {
        const rawSecMap = {};
        resolved.forEach(q => {
          const sub = q.subject || "QA";
          if (!rawSecMap[sub]) rawSecMap[sub] = [];
          rawSecMap[sub].push(q);
        });

        const subKeys = Object.keys(rawSecMap);
        const secDuration = Math.round(durationMin / Math.max(1, subKeys.length));
        resolvedSections = subKeys.map((sKey, idx) => ({
          id: `SEC_${idx + 1}_${sKey}`,
          subject: sKey,
          name: `${TAXONOMY[sKey]?.name || sKey}`,
          count: rawSecMap[sKey].length,
          durationMin: secDuration
        }));
      }

      const paper = await MockService.saveMockDefinition({
        title: title,
        type: "FIXED_PAPER",
        positiveMarks: positiveMarks,
        negativeMarks: negativeMarks,
        isSectionLocked: isLocked,
        sections: resolvedSections,
        questions: resolved
      });

      SearchService.invalidate();

      if (launchInDojo) {
        await openDojoSessionWithQuestions(resolved, title);
      } else if (launchImmediately) {
        await compileAndLaunchArena(title, resolved, durationMin, isLocked, resolvedSections, false, positiveMarks, negativeMarks);
      }

      return {
        success: true,
        mockId: paper.id,
        questionsCount: resolved.length,
        isSectionLocked: isLocked,
        sectionsCount: resolvedSections.length
      };
    },

    EXECUTE_AI_CONSULTATION_BUNDLE: async (payload) => {
      const { consultationDossier, actions = [] } = payload;
      if (consultationDossier) {
        const now = Date.now();
        consultationDossier.id = consultationDossier.consultationId || `consult_${now}`;
        consultationDossier.timestamp = now;
        consultationDossier.timeIST = formatISTDate(now);
        await putRecord("store_ai_consultations", consultationDossier);
      }

      const actionResults = [];
      for (const act of actions) {
        const handler = COMMAND_REGISTRY[act.action];
        if (handler) {
          const res = await handler(act.payload || {});
          actionResults.push({ action: act.action, result: res });
        }
      }
      SearchService.invalidate();
      return { success: true, actionsExecuted: actionResults.length, actionResults };
    },

    BATCH_COMMANDS: async (payload) => {
      const commands = Array.isArray(payload) ? payload : (payload.commands || []);
      const results = [];
      for (const cmd of commands) {
        const handler = COMMAND_REGISTRY[cmd.action];
        if (!handler) throw new Error(`Unrecognized command in batch: ${cmd.action}`);
        const res = await handler(cmd.payload || {});
        results.push({ action: cmd.action, status: "SUCCESS", data: res });
      }
      return { totalExecuted: results.length, results };
    },

    REQUEST_HISTORICAL_DUMP: async (payload) => {
      const { targetSubject, timeframeDays = 30 } = payload;
      const cutoff = timeframeDays > 0 ? Date.now() - (timeframeDays * 24 * 60 * 60 * 1000) : 0;
      const allAttempts = await getAllRecords("store_attempts");
      const dump = allAttempts.filter(a => a.completed && a.mockType !== "STUDY_VIEW" && a.timestamp >= cutoff).map(a => ({
        sessionId: a.sessionId,
        timeIST: a.timeIST || formatISTDate(a.timestamp),
        diurnalSlot: a.diurnalSlot || getDiurnalSlot(a.timestamp),
        score: a.finalScore,
        questions: (a.questions || []).filter(q => !targetSubject || q.subject === targetSubject).map(q => ({
          id: q.id,
          chapter: q.chapter,
          resp: a.userResponses[q.id]
        }))
      }));
      return { targetSubject, timeframeDays, count: dump.length, dump };
    },

    INGEST_AND_LAUNCH_MOCK: async (payload) => {
      const isEphemeral = (payload.ephemeral === true || payload.persistQuestions === false);
      const isLocked = (payload.isSectionLocked === true || payload.isSectionLocked === "YES");
      const posMarks = payload.positiveMarks !== undefined ? payload.positiveMarks : 2.0;
      const negMarks = payload.negativeMarks !== undefined ? payload.negativeMarks : 0.5;
      const rawQuestions = Array.isArray(payload.questions) ? payload.questions : [];
      const questions = [];

      for (const q of rawQuestions) {
        const item = sanitizeQuestion(q);
        const itemEphemeral = q.ephemeral === true || isEphemeral;
        if (!itemEphemeral) {
          await putRecord("store_questions", item);
        } else {
          item.ephemeral = true;
        }
        questions.push(item);
      }

      if (!isEphemeral) SearchService.invalidate();

      if (payload.launchInDojo) {
        await openDojoSessionWithQuestions(questions, payload.title || "AI Dojo Clinic", payload.formulaBrief || null);
        return {
          success: true,
          launchedInDojo: true,
          questionCount: questions.length
        };
      }

      let resolvedSections = payload.sections;
      if (!resolvedSections || resolvedSections.length === 0) {
        const rawSecMap = {};
        questions.forEach(q => {
          const sub = q.subject || "QA";
          if (!rawSecMap[sub]) rawSecMap[sub] = [];
          rawSecMap[sub].push(q);
        });

        const subKeys = Object.keys(rawSecMap);
        const secDuration = Math.round((payload.durationMin || 15) / Math.max(1, subKeys.length));
        resolvedSections = subKeys.map((sKey, idx) => ({
          id: `SEC_${idx + 1}_${sKey}`,
          subject: sKey,
          name: `${TAXONOMY[sKey]?.name || sKey}`,
          count: rawSecMap[sKey].length,
          durationMin: secDuration
        }));
      }

      await compileAndLaunchArena(payload.title || "AI Practice Mock", questions, payload.durationMin || 15, isLocked, resolvedSections, isEphemeral, posMarks, negMarks);
      return {
        success: true,
        launched: true,
        isEphemeral: isEphemeral,
        isSectionLocked: isLocked,
        sectionsCount: resolvedSections.length,
        questionCount: questions.length
      };
    },

    AI_PRESCRIBE_REMEDY: async (payload) => {
      const qIds = payload.questionIds || [];
      const newQuestions = (payload.newQuestions || []).map(sanitizeQuestion);
      if (newQuestions.length > 0) {
        await QuestionService.bulkCreate(newQuestions, "Remedial Question");
        SearchService.invalidate();
      }
      const allQs = await getAllRecords("store_questions");
      let remedialPool = allQs.filter(q => qIds.includes(q.id));
      if (newQuestions.length > 0) remedialPool = [...remedialPool, ...newQuestions];

      if (payload.launchInDojo) {
        await openDojoSessionWithQuestions(remedialPool, payload.title || "AI Remedial Dojo Clinic", payload.formulaBrief || null);
      } else {
        await compileAndLaunchArena(payload.title || "AI Prescribed Remedial Blitz", remedialPool, payload.durationMin || 10, false);
      }
      return { success: true, remedialLaunched: true, count: remedialPool.length };
    },

    SAVE_MOCK_PRESET: async (payload) => {
      const preset = sanitizeSavedMock(payload, Date.now());
      await MockService.saveMockDefinition(preset);
      return { success: true, savedPreset: preset.title };
    },

    MODIFY_TAXONOMY: async (payload) => {
      const { operation, subject, chapter, newName, targetChapter } = payload;
      if (operation === "ADD_SUBJECT") {
        await TaxonomyService.addSubject(subject, newName || subject);
      } else if (operation === "ADD_CHAPTER") {
        await TaxonomyService.addChapter(subject, chapter);
      } else if (operation === "RENAME_CHAPTER") {
        await TaxonomyService.renameChapter(subject, chapter, newName);
      } else if (operation === "MERGE_CHAPTERS") {
        await TaxonomyService.mergeChapters(subject, chapter, targetChapter);
      } else if (operation === "DELETE_CHAPTER") {
        await TaxonomyService.deleteChapter(subject, chapter, "PRESERVE_UNASSIGNED");
      }
      return { success: true, operation, subject, chapter };
    }
  };

  async function executeConsoleCommand(overrideRaw = null) {
    const rawInput = document.getElementById("console-payload");
    const consoleOutput = document.getElementById("console-output-box");
    const raw = (overrideRaw !== null ? overrideRaw : (rawInput ? rawInput.value : "")).trim();
    if (!raw) return;

    let cmd;
    try {
      cmd = JSON.parse(raw);
    } catch (err) {
      alert("Invalid JSON Syntax: " + err.message);
      return;
    }

    try {
      let result;
      let actionLabel = "BATCH_ARRAY";

      if (Array.isArray(cmd)) {
        result = await COMMAND_REGISTRY.BATCH_COMMANDS(cmd);
      } else {
        actionLabel = cmd.action;
        const handler = COMMAND_REGISTRY[cmd.action];
        if (!handler) {
          throw new Error(`Unrecognized command action: ${cmd.action}`);
        }
        result = await handler(cmd.payload || {});
      }

      const responsePayload = {
        status: "SUCCESS",
        action: actionLabel,
        timestampIST: formatISTDate(Date.now()),
        data: result
      };

      const formattedJson = JSON.stringify(responsePayload, null, 2);
      if (consoleOutput) {
        consoleOutput.innerText = formattedJson;
        consoleOutput.style.display = "block";
      }

      await renderDashboard();
      await syncAllTaxonomyDropdowns();
      if (typeof renderPracticeQuestionsTable === "function") {
        await renderPracticeQuestionsTable();
      }
      return responsePayload;
    } catch (execErr) {
      const errPayload = {
        status: "ERROR",
        action: cmd && cmd.action ? cmd.action : "BATCH",
        timestampIST: formatISTDate(Date.now()),
        error: execErr.message
      };
      const formattedErr = JSON.stringify(errPayload, null, 2);
      if (consoleOutput) {
        consoleOutput.innerText = formattedErr;
        consoleOutput.style.display = "block";
      } else {
        alert("Command Execution Error: " + execErr.message);
      }
      return errPayload;
    }
  }

  async function pasteAndExecuteClipboardCommand() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        alert("Clipboard is empty.");
        return;
      }
      safeSetValue("console-payload", text.trim());
      const res = await executeConsoleCommand(text.trim());
      if (res && res.status === "SUCCESS") {
        await navigator.clipboard.writeText(JSON.stringify(res, null, 2));
      }
    } catch (err) {
      alert("Clipboard read permission denied or invalid content. Paste manually into the box and tap Execute.");
    }
  }

  async function runConsoleQuickAction(actionName, payload = {}) {
    const cmdObj = { action: actionName, payload: payload };
    safeSetValue("console-payload", JSON.stringify(cmdObj, null, 2));
    await executeConsoleCommand();
  }

  async function copyCompactAiContextToClipboard() {
    const contextData = await COMMAND_REGISTRY.GET_AI_CONTEXT();
    const stats = await COMMAND_REGISTRY.GET_SYSTEM_STATS();
    const payload = {
      cgl_os_ai_context_bridge: {
        generatedAtIST: formatISTDate(Date.now()),
        diurnalSlot: getDiurnalSlot(Date.now()),
        schemaVersion: DB_VERSION
      },
      aiContext: contextData,
      inventorySummary: {
        totalQuestions: stats.totalQuestions,
        questionsBySubject: stats.questionsBySubject,
        livingSheetsCount: stats.livingSheetsCount,
        completedMocksCount: stats.completedMocksCount
      }
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(jsonStr)
      .then(() => alert("Compact AI Context & Rolling Clinical Memory copied to clipboard! Paste directly into Gemini."))
      .catch(() => downloadFileResilient(`cgl_ai_context_${Date.now()}.json`, "application/json", jsonStr));
  }

  function loadSamplePayload(type) {
    if (type === "COMPLETE_BUNDLE") {
      const sample = {
        action: "EXECUTE_AI_CONSULTATION_BUNDLE",
        payload: {
          consultationDossier: {
            consultationId: "consult_sample_" + Date.now(),
            summary: "Sample Omnipotent V3 Bundle",
            cumulativeNarrative: "[CGL_OS CLINICAL MEMORY — ROLLING BASELINE]\n1. ACTIVE SURVEILLANCE: QA_GEOMETRY (Tangents), ENG_CLOZE_TEST (Prepositions)"
          },
          actions: [
            {
              action: "GET_CHAPTER_BLUEPRINT",
              payload: { subject: "QA", chapter: "QA_GEOMETRY" }
            }
          ]
        }
      };
      safeSetValue("console-payload", JSON.stringify(sample, null, 2));
    }
  }

  /* ==========================================================================
   * SECTION 22: PRACTICE LAB — COMBINATORIAL SUBTOPIC ATLAS & DUAL-MODE SHOWCASE
   * - Multi-Select Subjects, Chapters, Auto-Discovered Subtopics & Methods
   * - Combinatorial Status & Difficulty Pills
   * - Dual-Mode Execution:
   *   * Mode 1: Interactive Solve (Launch Dojo or Timed Sprint from Filtered Pool)
   *   * Mode 2: Master Showcase (Textbook-Grade Pattern Encyclopedia grouped by
   *     Chapter -> Subtopic -> Method Archetype with 1-Tap Solution & Cue Drawer)
   * ========================================================================== */
  function openSheetsForPracticeFilter() {
    const firstSub = practiceSelectedSubjects.size > 0
      ? Array.from(practiceSelectedSubjects)[0]
      : (document.getElementById("practice-filter-subject")?.value || "QA");
    const firstChap = practiceSelectedChapters.size > 0
      ? Array.from(practiceSelectedChapters)[0]
      : (document.getElementById("practice-filter-chapter")?.value || "ALL");

    const resolvedSub = (firstSub === "ALL" || !TAXONOMY[firstSub]) ? "QA" : firstSub;
    const resolvedChap = (firstChap === "ALL")
      ? (TAXONOMY[resolvedSub]?.chapters?.[0] || "QA_PERCENTAGE")
      : firstChap;
    openCompendiumToSheet(null, resolvedSub, resolvedChap);
  }

  function handlePracticeSearchInput(val) {
    practiceSearchQuery = String(val || "").trim().toLowerCase();
    practiceCurrentPage = 1;
    renderPracticeQuestionsTable();
  }

  function handlePracticeSubjectChange(subKey) {
    practiceSelectedSubjects.clear();
    if (subKey && subKey !== "ALL") {
      practiceSelectedSubjects.add(subKey);
    }
    practiceSelectedChapters.clear();
    practiceSelectedSubtopics.clear();
    practiceCurrentPage = 1;
    renderPracticeQuestionsTable();
  }

  function togglePracticeSubjectFilter(subKey) {
    if (!subKey || subKey === "ALL") {
      practiceSelectedSubjects.clear();
    } else if (practiceSelectedSubjects.has(subKey)) {
      practiceSelectedSubjects.delete(subKey);
    } else {
      practiceSelectedSubjects.add(subKey);
    }
    practiceCurrentPage = 1;
    renderPracticeQuestionsTable();
  }

  function togglePracticeChapterFilter(chapKey) {
    if (!chapKey || chapKey === "ALL") {
      practiceSelectedChapters.clear();
      practiceSelectedSubtopics.clear();
    } else if (practiceSelectedChapters.has(chapKey)) {
      practiceSelectedChapters.delete(chapKey);
    } else {
      practiceSelectedChapters.add(chapKey);
    }
    practiceCurrentPage = 1;
    renderPracticeQuestionsTable();
  }

  function togglePracticeSubtopicFilter(subtopicKey) {
    if (!subtopicKey) return;
    if (practiceSelectedSubtopics.has(subtopicKey)) {
      practiceSelectedSubtopics.delete(subtopicKey);
    } else {
      practiceSelectedSubtopics.add(subtopicKey);
    }
    practiceCurrentPage = 1;
    renderPracticeQuestionsTable();
  }

  function clearPracticeSubtopicPills() {
    practiceSelectedSubtopics.clear();
    practiceCurrentPage = 1;
    renderPracticeQuestionsTable();
  }

  function togglePracticeStatusFilter(statusKey, btnEl) {
    if (statusKey === "ALL") {
      practiceSelectedStatuses.clear();
      practiceActiveQuickFilter = "ALL";
      document.querySelectorAll('[id^="pill-filter-"]').forEach(el => el.classList.remove("active"));
      const allBtn = document.getElementById("pill-filter-all");
      if (allBtn) allBtn.classList.add("active");
    } else {
      const allBtn = document.getElementById("pill-filter-all");
      if (allBtn) allBtn.classList.remove("active");

      if (practiceSelectedStatuses.has(statusKey)) {
        practiceSelectedStatuses.delete(statusKey);
        if (btnEl) btnEl.classList.remove("active");
      } else {
        practiceSelectedStatuses.add(statusKey);
        if (btnEl) btnEl.classList.add("active");
      }

      if (practiceSelectedStatuses.size === 0 && allBtn) {
        allBtn.classList.add("active");
      }
    }
    practiceCurrentPage = 1;
    renderPracticeQuestionsTable();
  }

  function togglePracticeDifficultyFilter(diffKey, btnEl) {
    if (practiceSelectedDifficulties.has(diffKey)) {
      practiceSelectedDifficulties.delete(diffKey);
      if (btnEl) btnEl.classList.remove("active");
    } else {
      practiceSelectedDifficulties.add(diffKey);
      if (btnEl) btnEl.classList.add("active");
    }
    practiceCurrentPage = 1;
    renderPracticeQuestionsTable();
  }

  function resetPracticeLabFilters() {
    practiceSearchQuery = "";
    practiceSelectedSubjects.clear();
    practiceSelectedChapters.clear();
    practiceSelectedSubtopics.clear();
    practiceSelectedStatuses.clear();
    practiceSelectedDifficulties.clear();
    practiceActiveQuickFilter = "ALL";
    practiceSortBy = "HIERARCHY";
    practiceCurrentPage = 1;

    safeSetValue("practice-search-input", "");
    safeSetValue("practice-sort-select", "HIERARCHY");
    document.querySelectorAll('[id^="pill-filter-"], [id^="pill-diff-"]').forEach(el => el.classList.remove("active"));
    const allBtn = document.getElementById("pill-filter-all");
    if (allBtn) allBtn.classList.add("active");

    renderPracticeQuestionsTable();
  }

  function handlePracticeSortChange(val) {
    practiceSortBy = val || "HIERARCHY";
    practiceCurrentPage = 1;
    renderPracticeQuestionsTable();
  }

  async function loadPracticeSavedPresets() {
    const rec = await getRecord("store_config", "practice_filter_presets");
    practiceSavedPresets = (rec && Array.isArray(rec.value)) ? rec.value : [];
    renderPracticeSavedPresetsBar();
  }

  function renderPracticeSavedPresetsBar() {
    const row = document.getElementById("practice-saved-presets-row");
    if (!row) return;
    row.innerHTML = "";
    if (!Array.isArray(practiceSavedPresets) || practiceSavedPresets.length === 0) {
      row.innerHTML = `<span style="font-size:10.5px; color:var(--text-dim);">No saved filter presets yet. Select chapters/statuses above and tap <b>+ Save Filter Preset</b>.</span>`;
      return;
    }

    practiceSavedPresets.forEach(p => {
      const chip = document.createElement("div");
      chip.className = "anchor-pill";
      chip.style.cssText = "display:inline-flex; align-items:center; gap:6px; padding:3px 9px; font-size:10.5px; cursor:pointer;";
      chip.innerHTML = `
        <span onclick="CGL_OS.applyPracticeFilterPreset('${p.id}')">\uD83D\uDD16 ${p.name}</span>
        <span style="color:var(--status-red); font-weight:900; padding-left:4px;" onclick="event.stopPropagation(); CGL_OS.deletePracticeFilterPreset('${p.id}')" title="Delete Preset">\u00D7</span>
      `;
      row.appendChild(chip);
    });
  }

  async function saveCurrentPracticeFilterPreset() {
    const defaultLabel = [
      ...Array.from(practiceSelectedSubjects),
      ...Array.from(practiceSelectedChapters).slice(0, 2),
      ...Array.from(practiceSelectedStatuses)
    ].join(" + ") || "Custom Filter Mix";

    const name = prompt("Enter a name for this Practice Filter Preset:", defaultLabel);
    if (!name || !name.trim()) return;

    const preset = {
      id: "fpreset_" + Date.now(),
      name: name.trim(),
      subjects: Array.from(practiceSelectedSubjects),
      chapters: Array.from(practiceSelectedChapters),
      subtopics: Array.from(practiceSelectedSubtopics),
      statuses: Array.from(practiceSelectedStatuses),
      difficulties: Array.from(practiceSelectedDifficulties),
      sortBy: practiceSortBy || "HIERARCHY"
    };

    practiceSavedPresets.push(preset);
    await putRecord("store_config", { key: "practice_filter_presets", value: practiceSavedPresets });
    renderPracticeSavedPresetsBar();
  }

  function applyPracticeFilterPreset(presetId) {
    const p = practiceSavedPresets.find(item => item.id === presetId);
    if (!p) return;

    practiceSelectedSubjects = new Set(p.subjects || []);
    practiceSelectedChapters = new Set(p.chapters || []);
    practiceSelectedSubtopics = new Set(p.subtopics || []);
    practiceSelectedStatuses = new Set(p.statuses || []);
    practiceSelectedDifficulties = new Set(p.difficulties || []);
    practiceSortBy = p.sortBy || "HIERARCHY";
    practiceCurrentPage = 1;

    safeSetValue("practice-sort-select", practiceSortBy);
    document.querySelectorAll('[id^="pill-filter-"], [id^="pill-diff-"]').forEach(el => el.classList.remove("active"));

    if (practiceSelectedStatuses.size === 0) {
      document.getElementById("pill-filter-all")?.classList.add("active");
    } else {
      const statusToBtnId = {
        UNSEEN: "pill-filter-unseen",
        WEAK: "pill-filter-weak",
        WRONG: "pill-filter-wrong",
        SLOW: "pill-filter-slow",
        STARRED: "pill-filter-starred",
        HAS_CUE: "pill-filter-hascue",
        IGNORED: "pill-filter-ignored",
        WITH_SHEET: "pill-filter-withsheet"
      };
      practiceSelectedStatuses.forEach(st => {
        const bid = statusToBtnId[st];
        if (bid) document.getElementById(bid)?.classList.add("active");
      });
    }

    practiceSelectedDifficulties.forEach(df => {
      document.getElementById(`pill-diff-${df.toLowerCase()}`)?.classList.add("active");
    });

    renderPracticeQuestionsTable();
  }

  async function deletePracticeFilterPreset(presetId) {
    practiceSavedPresets = practiceSavedPresets.filter(item => item.id !== presetId);
    await putRecord("store_config", { key: "practice_filter_presets", value: practiceSavedPresets });
    renderPracticeSavedPresetsBar();
  }

  function setPracticeLabViewMode(mode) {
    practiceViewMode = mode === "COMPACT" ? "COMPACT" : "SHOWCASE";
    const showBtn = document.getElementById("btn-lab-mode-showcase");
    const compBtn = document.getElementById("btn-lab-mode-compact");
    if (showBtn) showBtn.classList.toggle("active", practiceViewMode === "SHOWCASE");
    if (compBtn) compBtn.classList.toggle("active", practiceViewMode === "COMPACT");
    renderPracticeQuestionsTable();
  }

  function togglePracticeShowcaseRevealAll() {
    practiceShowcaseRevealAll = !practiceShowcaseRevealAll;
    const btn = document.getElementById("btn-showcase-reveal-all");
    if (btn) {
      btn.innerText = practiceShowcaseRevealAll ? "\uD83D\uDE48 Collapse All Solutions" : "\uD83D\uDC41\uFE0F Reveal All Solutions";
      btn.classList.toggle("btn-cyan", practiceShowcaseRevealAll);
      btn.classList.toggle("btn-secondary", !practiceShowcaseRevealAll);
    }
    renderPracticeQuestionsTable();
  }

  function toggleShowcaseCardSolution(qId) {
    if (practiceShowcaseRevealedIds.has(qId)) {
      practiceShowcaseRevealedIds.delete(qId);
    } else {
      practiceShowcaseRevealedIds.add(qId);
    }
    const drawer = document.getElementById(`showcase-sol-${qId}`);
    const btn = document.getElementById(`btn-showcase-sol-${qId}`);
    const isNowOpen = practiceShowcaseRevealedIds.has(qId);
    if (drawer) drawer.style.display = isNowOpen ? "block" : "none";
    if (btn) btn.innerText = isNowOpen ? "\uD83D\uDE48 Hide Solution" : "\uD83D\uDCA1 Solution & Cue";
  }

  async function selectShowcaseCardOption(qId, optIdx) {
    const q = await QuestionService.get(qId);
    if (practiceShowcaseSelectedOptionByQ[qId] === optIdx) {
      delete practiceShowcaseSelectedOptionByQ[qId];
      practiceShowcaseRevealedIds.delete(qId);
      if (q) await PerformanceService.recordUntimedPracticeSolve(q, null, 0);
    } else {
      practiceShowcaseSelectedOptionByQ[qId] = optIdx;
      practiceShowcaseRevealedIds.add(qId);
      if (q) await PerformanceService.recordUntimedPracticeSolve(q, optIdx, 18);
    }
    await renderPracticeQuestionsTable();
  }

  function setPracticeQuickFilter(filterType, btnEl) {
    togglePracticeStatusFilter(filterType, btnEl);
  }

  function togglePracticeQuestionSelection(id, checked) {
    if (checked) practiceSelectedIds.add(id);
    else practiceSelectedIds.delete(id);
  }

  function selectAllVisiblePractice() {}

  function navPracticePage(direction) {
    practiceCurrentPage += direction;
    renderPracticeQuestionsTable();
  }

  function togglePracticeStemExpansion(stemId) {
    const stemEl = document.getElementById(stemId);
    if (!stemEl) return;
    const isExpanded = stemEl.classList.toggle("expanded");
    const toggleBtn = document.getElementById(`toggle-${stemId}`);
    if (toggleBtn) {
      toggleBtn.innerText = isExpanded ? "[ Collapse \u25B2 ]" : "[ Read Full Stem \u25BC ]";
    }
  }

  async function toggleQuestionStarFromPractice(id) {
    await QuestionService.toggleStar(id);
    await renderPracticeQuestionsTable();
  }

  function renderPracticeFilterMatrix(allQs) {
    const subRow = document.getElementById("practice-subject-pills-row");
    const chapRow = document.getElementById("practice-chapter-pills-row");
    const subtopicWrap = document.getElementById("practice-subtopic-atlas-wrap");
    const subtopicRow = document.getElementById("practice-subtopic-pills-row");

    const subCounts = {};
    const chapCounts = {};
    allQs.forEach(q => {
      subCounts[q.subject] = (subCounts[q.subject] || 0) + 1;
      chapCounts[q.chapter] = (chapCounts[q.chapter] || 0) + 1;
    });

    if (subRow) {
      subRow.innerHTML = "";
      const allPill = document.createElement("button");
      allPill.className = "anchor-pill" + (practiceSelectedSubjects.size === 0 ? " active" : "");
      allPill.innerText = `All Subjects (${allQs.length})`;
      allPill.onclick = () => togglePracticeSubjectFilter("ALL");
      subRow.appendChild(allPill);

      Object.keys(TAXONOMY).forEach(sKey => {
        const pill = document.createElement("button");
        pill.className = "anchor-pill" + (practiceSelectedSubjects.has(sKey) ? " active" : "");
        pill.innerText = `${sKey} (${subCounts[sKey] || 0})`;
        pill.onclick = () => togglePracticeSubjectFilter(sKey);
        subRow.appendChild(pill);
      });
    }

    if (chapRow) {
      chapRow.innerHTML = "";
      const activeSubjects = practiceSelectedSubjects.size > 0
        ? Array.from(practiceSelectedSubjects)
        : Object.keys(TAXONOMY);

      const candidateChapters = [];
      activeSubjects.forEach(sKey => {
        if (TAXONOMY[sKey] && Array.isArray(TAXONOMY[sKey].chapters)) {
          TAXONOMY[sKey].chapters.forEach(ch => {
            if (!candidateChapters.includes(ch)) candidateChapters.push(ch);
          });
        }
      });

      safeSetText(
        "practice-chapters-selected-badge",
        practiceSelectedChapters.size > 0
          ? `${practiceSelectedChapters.size} Chapter(s) Active \u2022 Tap to Toggle`
          : `All ${candidateChapters.length} Chapters in Scope`
      );

      candidateChapters.forEach(ch => {
        const cnt = chapCounts[ch] || 0;
        const chip = document.createElement("div");
        chip.className = "matrix-chip" + (practiceSelectedChapters.has(ch) ? " selected" : "");
        chip.innerText = `${ch} (${cnt})`;
        chip.onclick = () => togglePracticeChapterFilter(ch);
        chapRow.appendChild(chip);
      });
    }

    // Dynamic Subtopic & Method Atlas Discovery
    if (subtopicWrap && subtopicRow) {
      const scopeQs = allQs.filter(q => {
        if (practiceSelectedSubjects.size > 0 && !practiceSelectedSubjects.has(q.subject)) return false;
        if (practiceSelectedChapters.size > 0 && !practiceSelectedChapters.has(q.chapter)) return false;
        return true;
      });

      const subtopicTally = {};
      scopeQs.forEach(q => {
        const label = (q.subtopic && q.subtopic !== "General")
          ? q.subtopic
          : ((q.method && q.method !== "General") ? q.method : null);
        if (label) {
          subtopicTally[label] = (subtopicTally[label] || 0) + 1;
        }
      });

      const distinctSubtopics = Object.keys(subtopicTally).sort((a, b) => subtopicTally[b] - subtopicTally[a]);
      if ((practiceSelectedChapters.size > 0 || practiceSelectedSubjects.size > 0 || practiceSelectedSubtopics.size > 0) && distinctSubtopics.length > 0) {
        subtopicWrap.style.display = "block";
        subtopicRow.innerHTML = "";
        distinctSubtopics.slice(0, 36).forEach(stLabel => {
          const chip = document.createElement("div");
          chip.className = "matrix-chip subtopic-chip" + (practiceSelectedSubtopics.has(stLabel) ? " selected" : "");
          chip.innerText = `${stLabel} (${subtopicTally[stLabel]})`;
          chip.onclick = () => togglePracticeSubtopicFilter(stLabel);
          subtopicRow.appendChild(chip);
        });
      } else {
        subtopicWrap.style.display = "none";
      }
    }
  }

  async function getCurrentlyFilteredPracticeQuestions() {
    const legacySub = document.getElementById("practice-filter-subject")?.value || "ALL";
    const legacyChap = document.getElementById("practice-filter-chapter")?.value || "ALL";
    const legacyDiff = document.getElementById("practice-filter-difficulty")?.value || "ALL";
    const legacyPerf = document.getElementById("practice-filter-performance")?.value || "ALL";

    const allQs = await getAllRecords("store_questions");
    renderPracticeFilterMatrix(allQs);

    const perfMap = await PerformanceService.getQuestionPerformanceMap();
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    return allQs.filter(q => {
      if (practiceSelectedSubjects.size > 0) {
        if (!practiceSelectedSubjects.has(q.subject)) return false;
      } else if (legacySub !== "ALL" && q.subject !== legacySub) {
        return false;
      }

      if (practiceSelectedChapters.size > 0) {
        if (!practiceSelectedChapters.has(q.chapter)) return false;
      } else if (legacyChap !== "ALL" && q.chapter !== legacyChap) {
        return false;
      }

      if (practiceSelectedSubtopics.size > 0) {
        const st = q.subtopic || "";
        const mt = q.method || "";
        if (!practiceSelectedSubtopics.has(st) && !practiceSelectedSubtopics.has(mt)) return false;
      }

      if (practiceSelectedDifficulties.size > 0) {
        if (!practiceSelectedDifficulties.has(q.difficulty || "MEDIUM")) return false;
      } else if (legacyDiff !== "ALL" && q.difficulty !== legacyDiff) {
        return false;
      }

      const pStats = perfMap[q.id];
      const attempts = pStats ? pStats.attempts : 0;
      const acc = attempts > 0 ? Math.round((pStats.correct / attempts) * 100) : 0;
      const parSec = getSubjectThresholds(q.subject).parSec;

      if (legacyPerf !== "ALL") {
        if (legacyPerf === "WEAK" && (attempts === 0 || acc >= 60)) return false;
        if (legacyPerf === "WRONG" && (!pStats || (!pStats.lastWasIncorrect && pStats.incorrect === 0))) return false;
        if (legacyPerf === "STARRED" && !q.bookmarked) return false;
        if (legacyPerf === "UNSEEN" && attempts > 0) return false;
        if (legacyPerf === "SLOW" && (!pStats || Math.round(pStats.totalTime / attempts) <= parSec * 1.4)) return false;
        if (legacyPerf === "STRONG" && (attempts === 0 || acc < 80)) return false;
      }

      if (practiceSelectedStatuses.size > 0) {
        for (const stFilter of practiceSelectedStatuses) {
          if (stFilter === "WEAK" && (attempts === 0 || acc >= 60)) return false;
          if (stFilter === "WRONG" && (!pStats || (!pStats.lastWasIncorrect && pStats.incorrect === 0))) return false;
          if (stFilter === "STARRED" && !q.bookmarked) return false;
          if (stFilter === "UNSEEN" && attempts > 0) return false;
          if (stFilter === "SLOW" && (!pStats || attempts === 0 || Math.round(pStats.totalTime / attempts) <= parSec * 1.35)) return false;
          if (stFilter === "IGNORED" && (!pStats || pStats.lastAttemptEpoch >= sevenDaysAgo)) return false;
          if (stFilter === "WITH_SHEET" && (!q.conceptId && (!Array.isArray(q.conceptIds) || q.conceptIds.length === 0))) return false;
          if (stFilter === "HAS_CUE" && (!q.annotation || !q.annotation.trim())) return false;
        }
      }

      if (practiceSearchQuery) {
        const inId = q.id.toLowerCase().includes(practiceSearchQuery);
        const inText = q.questionText.toLowerCase().includes(practiceSearchQuery);
        const inPassage = (q.passageText || "").toLowerCase().includes(practiceSearchQuery);
        const inMethod = (q.method || "").toLowerCase().includes(practiceSearchQuery);
        const inSubtopic = (q.subtopic || "").toLowerCase().includes(practiceSearchQuery);
        const inChap = (q.chapter || "").toLowerCase().includes(practiceSearchQuery);
        const inTags = Array.isArray(q.tags) && q.tags.some(t => t.toLowerCase().includes(practiceSearchQuery));
        if (!inId && !inText && !inPassage && !inMethod && !inSubtopic && !inChap && !inTags) return false;
      }

      return true;
    });
  }

  async function renderPracticeQuestionsTable() {
    const container = document.getElementById("practice-question-rows");
    if (!container) return;

    renderPracticeSavedPresetsBar();
    const rawFiltered = await getCurrentlyFilteredPracticeQuestions();
    const perfMap = await PerformanceService.getQuestionPerformanceMap();

    let filtered = [];
    if (practiceSortBy === "WEAKEST") {
      filtered = [...rawFiltered].sort((a, b) => {
        const pa = perfMap[a.id];
        const pb = perfMap[b.id];
        const accA = pa && pa.attempts > 0 ? (pa.correct / pa.attempts) : -1;
        const accB = pb && pb.attempts > 0 ? (pb.correct / pb.attempts) : -1;
        if (accA === -1 && accB === -1) return 0;
        if (accA === -1) return 1;
        if (accB === -1) return -1;
        return accA - accB;
      });
    } else if (practiceSortBy === "SLOWEST") {
      filtered = [...rawFiltered].sort((a, b) => {
        const pa = perfMap[a.id];
        const pb = perfMap[b.id];
        const avgA = pa && pa.attempts > 0 ? (pa.totalTime / pa.attempts) : -1;
        const avgB = pb && pb.attempts > 0 ? (pb.totalTime / pb.attempts) : -1;
        return avgB - avgA;
      });
    } else if (practiceSortBy === "RECENT") {
      filtered = [...rawFiltered].reverse();
    } else {
      filtered = sortQuestionsHierarchical(rawFiltered);
    }

    safeSetText("practice-filtered-count", filtered.length);

    const rawPages = Math.ceil(filtered.length / PRACTICE_PAGE_SIZE);
    const totalPages = rawPages > 0 ? rawPages : 1;
    if (practiceCurrentPage < 1) practiceCurrentPage = 1;
    if (practiceCurrentPage > totalPages) practiceCurrentPage = totalPages;

    safeSetText("practice-page-info", `Page ${practiceCurrentPage} of ${totalPages} (${filtered.length} Qs)`);
    const prevBtn = document.getElementById("btn-practice-prev-page");
    if (prevBtn) prevBtn.disabled = practiceCurrentPage <= 1;
    const nextBtn = document.getElementById("btn-practice-next-page");
    if (nextBtn) nextBtn.disabled = practiceCurrentPage >= totalPages;

    const pagedSlice = filtered.slice((practiceCurrentPage - 1) * PRACTICE_PAGE_SIZE, practiceCurrentPage * PRACTICE_PAGE_SIZE);
    container.innerHTML = "";

    if (pagedSlice.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:40px 14px; color:var(--text-muted); font-size:12.5px;">No questions match current combinatorial filters. Tap <b>\u21BA Reset Filters</b> or author a new question.</div>';
      return;
    }

    // MODE 2: 📖 STRUCTURED MASTER SHOWCASE (EDITORIAL PATTERN ENCYCLOPEDIA)
    if (practiceViewMode === "SHOWCASE") {
      let currentChap = null;
      let currentSubtopic = null;

      pagedSlice.forEach((q, idx) => {
        const globalIdx = (practiceCurrentPage - 1) * PRACTICE_PAGE_SIZE + idx + 1;
        const subtopicName = q.subtopic || q.method || "Core Archetypes";

        if (q.chapter !== currentChap) {
          currentChap = q.chapter;
          currentSubtopic = null;
          const chapHeader = document.createElement("div");
          chapHeader.className = "showcase-chapter-header";
          chapHeader.innerHTML = `
            <div>
              <span style="font-size:10px; font-family:var(--font-mono); color:var(--accent-cyan); font-weight:800;">// CHAPTER ATLAS</span>
              <div style="font-size:15px; font-weight:900; color:#fff;">${q.subject} \u2022 ${q.chapter}</div>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="btn btn-purple" style="padding:4px 10px; font-size:10.5px;" onclick="CGL_OS.openCompendiumToSheet(null, '${q.subject}', '${q.chapter}')">\uD83D\uDCD6 Chapter Sheets</button>
              <button class="btn btn-emerald" style="padding:4px 10px; font-size:10.5px;" onclick="CGL_OS.launchDirectChapterDrill('${q.subject}', '${q.chapter}', true)">\uD83E\uDDD8 Dojo Chapter</button>
            </div>
          `;
          container.appendChild(chapHeader);
        }

        if (subtopicName !== currentSubtopic) {
          currentSubtopic = subtopicName;
          const subBanner = document.createElement("div");
          subBanner.className = "showcase-subtopic-banner";
          subBanner.innerHTML = `
            <span>\u25C6 SUBTOPIC / ARCHETYPE: ${subtopicName}</span>
            <span style="font-size:10px; color:var(--text-muted);">${q.method && q.method !== subtopicName ? `Method: ${q.method}` : ""}</span>
          `;
          container.appendChild(subBanner);
        }

        const pStats = perfMap[q.id];
        const attempts = pStats ? pStats.attempts : 0;
        const acc = attempts > 0 ? Math.round((pStats.correct / attempts) * 100) : 0;
        let statusBadge = '<span class="badge" style="background:#151a24; color:var(--text-muted);">Unseen</span>';
        if (attempts > 0) {
          if (acc >= 80 && !pStats.lastWasIncorrect) {
            statusBadge = `<span class="badge" style="background:rgba(16,185,129,0.2); color:var(--status-green);">\uD83D\uDFE2 ${acc}% (${attempts}A)</span>`;
          } else if (acc >= 60 && !pStats.lastWasIncorrect) {
            statusBadge = `<span class="badge" style="background:rgba(245,158,11,0.2); color:var(--status-amber);">\uD83D\uDFE1 ${acc}% (${attempts}A)</span>`;
          } else {
            statusBadge = `<span class="badge" style="background:rgba(244,63,94,0.2); color:var(--status-red);">\uD83D\uDD34 ${acc}% (${attempts}A)</span>`;
          }
        }
        const splitBadgeHtml = (pStats && pStats.lastSetupSec !== null && pStats.lastSetupSec !== undefined)
          ? `<span class="badge" style="background:rgba(56,189,248,0.14); color:#38bdf8; font-family:var(--font-mono); font-size:9.5px;">\u23F1\uFE0F Split: ${pStats.lastSetupSec}s Setup / ${pStats.lastCalcSec ?? 0}s Calc</span>`
          : "";

        const starClass = q.bookmarked ? "starred" : "";
        const starIcon = q.bookmarked ? "\u2605" : "\u2606";
        const isSolOpen = practiceShowcaseRevealAll || practiceShowcaseRevealedIds.has(q.id);
        const pickedOpt = practiceShowcaseSelectedOptionByQ[q.id];
        const linkedSheetId = (Array.isArray(q.conceptIds) && q.conceptIds[0]) ? q.conceptIds[0] : (q.conceptId || "");

        const optsHtml = (q.options || []).map((optText, oIdx) => {
          let optClass = "showcase-opt-pill";
          if (isSolOpen || pickedOpt !== undefined) {
            if (oIdx === q.correctIndex) optClass += " revealed-correct";
            else if (pickedOpt === oIdx) optClass += " revealed-wrong";
          }
          return `
            <div class="${optClass}" onclick="CGL_OS.selectShowcaseCardOption('${q.id}', ${oIdx})">
              <b style="font-family:var(--font-mono); color:var(--accent-cyan);">(${oIdx + 1})</b>
              <div style="flex:1;">${formatRichText(optText)}</div>
              ${(isSolOpen || pickedOpt !== undefined) && oIdx === q.correctIndex ? '<span style="color:var(--status-green); font-weight:800;">\u2713</span>' : ""}
            </div>
          `;
        }).join("");

        const card = document.createElement("div");
        card.className = "showcase-q-card";
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span class="q-number-pill" style="padding:2px 8px; font-size:11px;">#${globalIdx}</span>
              <span class="practice-q-id">${q.id}</span>
              <span class="badge" style="background:#151a24; color:var(--accent-cyan);">${q.difficulty || "MEDIUM"}</span>
              ${statusBadge}
              ${splitBadgeHtml}
            </div>
            <div style="display:flex; gap:5px; flex-wrap:wrap; align-items:center;">
              <button class="star-flag-btn ${starClass}" style="padding:2px 7px; font-size:10.5px;" onclick="CGL_OS.toggleQuestionStarFromPractice('${q.id}')">${starIcon}</button>
              <button class="btn btn-secondary" id="btn-showcase-sol-${q.id}" style="padding:3px 9px; font-size:10.5px; color:var(--accent-cyan);" onclick="CGL_OS.toggleShowcaseCardSolution('${q.id}')">
                ${isSolOpen ? "\uD83D\uDE48 Hide Solution" : "\uD83D\uDCA1 Solution & Cue"}
              </button>
              ${linkedSheetId ? `<button class="btn btn-purple" style="padding:3px 8px; font-size:10.5px;" onclick="CGL_OS.openCompendiumToSheet('${linkedSheetId}', '${q.subject}', '${q.chapter}')">\uD83D\uDCD6 Sheet</button>` : ""}
              <button class="btn btn-emerald" style="padding:3px 8px; font-size:10.5px;" onclick="CGL_OS.launchSingleQuestionDojo('${q.id}')">\uD83E\uDDD8 Dojo</button>
              <button class="btn btn-secondary" style="padding:3px 7px; font-size:10px;" onclick="CGL_OS.QuestionService.get('${q.id}').then(item => CGL_OS.openEditQuestionModal(item))">\u270E</button>
              <button class="btn btn-secondary" style="padding:3px 7px; font-size:10px;" onclick="CGL_OS.duplicateCurrentEditingQuestionFromId('${q.id}')" title="Clone Question">\u29C9</button>
            </div>
          </div>

          ${q.passageText ? `<div class="q-passage-container" style="margin-top:10px; font-size:12.5px;"><b>Passage Context (${q.setOrder || 1}/${q.setTotal || 1}):</b><br>${formatRichText(q.passageText)}</div>` : ""}

          <div class="showcase-q-stem">${formatRichText(q.questionText)}</div>

          ${q.imageUrl ? `<div style="text-align:center; margin:10px 0;"><img src="${q.imageUrl}" style="max-height:200px; max-width:100%; border-radius:8px; border:1px solid var(--border-color);"></div>` : ""}

          <div class="showcase-opt-grid">${optsHtml}</div>

          <div id="showcase-sol-${q.id}" class="showcase-solution-drawer" style="display:${isSolOpen ? "block" : "none"};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
              <strong style="color:var(--status-green); font-size:12px;">\u2713 Correct Key: Option ${q.correctIndex + 1} \u2022 Method: ${q.method || q.subtopic || "Standard Derivation"}</strong>
              <span style="font-size:10.5px; color:var(--text-muted);">Source: ${q.source || "Canonical Bank"}</span>
            </div>
            <div>${formatRichText(q.explanation || "No derivation registered yet.")}</div>
            ${q.annotation ? `<div class="callout-box" style="margin-top:8px; padding:8px 12px;"><b>Personal Solving Cue:</b> ${formatRichText(q.annotation)}</div>` : ""}
          </div>
        `;
        container.appendChild(card);
      });
      return;
    }

    // COMPACT CARDS MODE (Clean, Zero Checkboxes)
    pagedSlice.forEach((q, idx) => {
      const pStats = perfMap[q.id];
      const attempts = pStats ? pStats.attempts : 0;
      const acc = attempts > 0 ? Math.round((pStats.correct / attempts) * 100) : 0;
      let statusBadge = '<span class="badge" style="background:#151a24; color:var(--text-muted);">Unseen</span>';
      if (attempts > 0) {
        if (acc >= 80 && !pStats.lastWasIncorrect) {
          statusBadge = '<span class="badge" style="background:rgba(16,185,129,0.2); color:var(--status-green);">\uD83D\uDFE2 ' + acc + '% (' + attempts + 'A)</span>';
        } else if (acc >= 60 && !pStats.lastWasIncorrect) {
          statusBadge = '<span class="badge" style="background:rgba(245,158,11,0.2); color:var(--status-amber);">\uD83D\uDFE1 ' + acc + '% (' + attempts + 'A)</span>';
        } else {
          statusBadge = '<span class="badge" style="background:rgba(244,63,94,0.2); color:var(--status-red);">\uD83D\uDD34 ' + acc + '% (' + attempts + 'A)</span>';
        }
      }

      const stemDomId = "practice-stem-" + practiceCurrentPage + "-" + idx;
      const card = document.createElement("div");
      card.className = "practice-q-card";
      card.dataset.id = q.id;

      const setOrd = q.setOrder ? q.setOrder : 1;
      const setTot = q.setTotal ? q.setTotal : 1;
      const passageBadgeHtml = q.parentPassageId
        ? '<span class="q-passage-set-badge">SET ' + setOrd + '/' + setTot + '</span>'
        : "";

      const methodLabel = q.method ? q.method : (q.subtopic ? q.subtopic : "General");
      const diffLabel = q.difficulty ? q.difficulty : "MEDIUM";
      const sourceLabel = q.source ? q.source : "Manual";
      const starClass = q.bookmarked ? "starred" : "";
      const starIcon = q.bookmarked ? "\u2605" : "\u2606";

      card.innerHTML = `
        <div class="practice-q-main">
          <div class="practice-q-header">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span class="practice-q-id">${q.id}</span>
              <span class="badge" style="background:#1f6feb;">${q.subject} \u2022 ${q.chapter}</span>
              <span class="badge" style="background:#151a24; color:var(--accent-purple-light);">${q.subtopic || methodLabel}</span>
              ${passageBadgeHtml}
              ${statusBadge}
            </div>
            <div class="practice-q-actions">
              <button class="star-flag-btn ${starClass}" style="padding:2px 6px; font-size:10px;" onclick="CGL_OS.toggleQuestionStarFromPractice('${q.id}')" title="Star / Bookmark">${starIcon}</button>
              <button class="btn btn-secondary" style="padding:2px 6px; font-size:10px;" onclick="CGL_OS.QuestionService.get('${q.id}').then(q => CGL_OS.openEditQuestionModal(q))">Edit</button>
              <button class="btn btn-secondary" style="padding:2px 6px; font-size:10px; color:var(--accent-cyan);" onclick="CGL_OS.duplicateCurrentEditingQuestionFromId('${q.id}')">Clone</button>
              <button class="btn btn-emerald" style="padding:2px 8px; font-size:10px; font-weight:700;" onclick="CGL_OS.launchSingleQuestionDojo('${q.id}')" title="Untimed Active Recall in Dojo">\uD83E\uDDD8 Dojo</button>
              <button class="btn btn-cyan" style="padding:2px 8px; font-size:10px; font-weight:700;" onclick="CGL_OS.launchSingleQuestionPractice('${q.id}')" title="Timed Sprint">\u26A1 Timed</button>
            </div>
          </div>
          <div id="${stemDomId}" class="practice-q-stem" onclick="CGL_OS.togglePracticeStemExpansion('${stemDomId}')">${formatRichText(q.questionText)}</div>
          <span id="toggle-${stemDomId}" class="practice-q-stem-toggle" onclick="CGL_OS.togglePracticeStemExpansion('${stemDomId}')">[ Read Full Stem \u25BC ]</span>
          <div class="practice-q-footer">
            <span>Method: <b>${methodLabel}</b> (${diffLabel})</span>
            <span>Source: <i>${sourceLabel}</i></span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  async function duplicateCurrentEditingQuestionFromId(id) {
    try {
      const clone = await QuestionService.duplicate(id);
      alert(`Cloned as ${clone.id}.`);
      openEditQuestionModal(clone);
    } catch (err) {
      alert("Clone Error: " + err.message);
    }
  }

  async function launchSingleQuestionDojo(id) {
    const searchModal = document.getElementById("modal-global-search");
    if (searchModal && searchModal.classList.contains("active")) {
      searchModal.classList.remove("active");
    }
    const q = await QuestionService.get(id);
    if (!q) return;
    let pool = [q];
    if (q.parentPassageId) {
      const siblings = await QuestionService.getByPassageId(q.parentPassageId);
      if (siblings.length > 0) pool = siblings;
    }
    await openDojoSessionWithQuestions(pool, `Dojo Clinic: ${q.chapter}`);
  }

  async function launchSingleQuestionPractice(id) {
    const searchModal = document.getElementById("modal-global-search");
    if (searchModal && searchModal.classList.contains("active")) {
      searchModal.classList.remove("active");
    }

    const q = await QuestionService.get(id);
    if (!q) return;

    let pool = [q];
    if (q.parentPassageId) {
      const siblings = await QuestionService.getByPassageId(q.parentPassageId);
      if (siblings.length > 0) pool = siblings;
    }

    await compileAndLaunchArena(`Focus Drill: ${q.chapter}`, pool, Math.max(5, pool.length * 2), false);
  }

  async function sampleActivePracticePool() {
    const filtered = await getCurrentlyFilteredPracticeQuestions();
    if (filtered.length === 0) return [];
    const countVal = document.getElementById("practice-launch-count-select")?.value || "25";
    if (countVal === "ALL") return filtered;
    const limit = parseInt(countVal, 10) || 25;
    if (filtered.length <= limit) return filtered;

    // Equal-Balance Multi-Chapter / Multi-Subtopic Round-Robin Sampler
    const bucketsMap = {};
    filtered.forEach(q => {
      const bKey = `${q.chapter}::${q.subtopic || q.method || "General"}`;
      if (!bucketsMap[bKey]) bucketsMap[bKey] = [];
      bucketsMap[bKey].push(q);
    });

    const bucketKeys = Object.keys(bucketsMap);
    if (bucketKeys.length <= 1) {
      return MockService.shuffle([...filtered]).slice(0, limit);
    }

    bucketKeys.forEach(k => {
      bucketsMap[k] = MockService.shuffle(bucketsMap[k]);
    });

    const balancedSelection = [];
    let addedInPass = true;
    while (balancedSelection.length < limit && addedInPass) {
      addedInPass = false;
      for (const bKey of bucketKeys) {
        if (balancedSelection.length >= limit) break;
        if (bucketsMap[bKey].length > 0) {
          balancedSelection.push(bucketsMap[bKey].pop());
          addedInPass = true;
        }
      }
    }

    return sortQuestionsHierarchical(balancedSelection);
  }

  async function launchDojoFromPracticePool() {
    const pool = await sampleActivePracticePool();
    if (pool.length === 0) {
      alert("No questions match the active filters to launch in Dojo.");
      return;
    }
    await openDojoSessionWithQuestions(pool, `Dojo Clinic (${pool.length} Qs)`);
  }

  async function launchTimedSprintFromPracticePool() {
    const pool = await sampleActivePracticePool();
    if (pool.length === 0) {
      alert("No questions match the active filters to launch a Timed Sprint.");
      return;
    }
    await compileAndLaunchArena(`Timed Sprint (${pool.length} Qs)`, pool, Math.max(5, Math.round(pool.length * 1.0)), false);
  }

  async function launchDojoFromPracticeSelection() {
    await launchDojoFromPracticePool();
  }

  async function launchPracticeSelectedSession() {
    await launchTimedSprintFromPracticePool();
  }

  async function launchSeeQuestions() {
    setPracticeLabViewMode("SHOWCASE");
    if (!practiceShowcaseRevealAll) {
      togglePracticeShowcaseRevealAll();
    }
  }

  async function buildMockFromPracticeSelection() {
    const selected = await sampleActivePracticePool();
    if (selected.length === 0) {
      alert("No questions in the active filter pool to save as a fixed paper.");
      return;
    }
    const title = prompt("Enter title for this Custom Fixed Mock Paper:", `Curated Atlas Paper (${selected.length} Qs)`);
    if (!title || !title.trim()) return;

    const paper = await MockService.saveMockDefinition({
      title: title.trim(),
      type: "FIXED_PAPER",
      isSectionLocked: false,
      sections: [{ id: 1, subject: selected[0]?.subject || "QA", count: selected.length, durationMin: Math.max(5, Math.round(selected.length * 1.2)) }],
      questions: selected
    });

    alert(`Saved fixed mock "${paper.title}" (${selected.length} Qs) to Dashboard!`);
    await renderDashboard();
  }

  /* ==========================================================================
   * SECTION 23: UNTIMED DOJO PRACTICE, STOPWATCH SPLIT & SPLIT-SHEET PINS
   * ========================================================================== */
  function startDojoStopwatch() {
    clearInterval(dojoStopwatchInterval);
    dojoStopwatchSec = 0;
    dojoSetupSplitSec = null;
    safeSetText("dojo-stopwatch-display", "00:00");
    safeSetText("dojo-stopwatch-splits", "");

    dojoStopwatchInterval = setInterval(() => {
      const dojoView = document.getElementById("dojo-arena-view");
      if (!dojoExam || !dojoView || dojoView.style.display !== "flex") return;
      dojoStopwatchSec++;
      const m = Math.floor(dojoStopwatchSec / 60);
      const s = dojoStopwatchSec % 60;
      safeSetText("dojo-stopwatch-display", `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }, 1000);
  }

  function recordDojoStopwatchSplit() {
    if (dojoSetupSplitSec === null) {
      dojoSetupSplitSec = dojoStopwatchSec;
      safeSetText("dojo-stopwatch-splits", `[Setup: ${dojoSetupSplitSec}s]`);
    } else {
      const calcSec = Math.max(0, dojoStopwatchSec - dojoSetupSplitSec);
      safeSetText("dojo-stopwatch-splits", `[Setup: ${dojoSetupSplitSec}s | Calc: ${calcSec}s]`);
    }
  }

  async function openDojoSessionWithQuestions(questionsArray, title = "Dojo Practice Clinic", customFormulaBrief = null) {
    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      alert("No questions available for this Dojo session.");
      return;
    }

    const firstQ = questionsArray[0];
    let resolvedBrief = customFormulaBrief;
    if (!resolvedBrief && firstQ) {
      const allDossiers = await ConceptService.getAll();
      const cId = (Array.isArray(firstQ.conceptIds) && firstQ.conceptIds[0]) || firstQ.conceptId;
      const matched = cId ? allDossiers.find(d => d.id === cId) : allDossiers.find(d => d.chapter === firstQ.chapter);
      if (matched) resolvedBrief = `**${matched.title}:** ${matched.subtitle || ""}`;
    }

    dojoExam = {
      subject: firstQ.subject || "QA",
      chapter: firstQ.chapter || "ALL",
      method: firstQ.method || "ALL",
      title: title,
      formulaBrief: resolvedBrief,
      questions: questionsArray.map((q, idx) => ({ ...q, dojoSequentialNum: idx + 1 })),
      currentIndex: 0,
      userResponses: {}
    };

    dojoExam.questions.forEach(q => {
      dojoExam.userResponses[q.id] = {
        selectedOption: null,
        status: "unanswered",
        revealed: false
      };
    });

    pushNavLayer("dojo-arena-view", () => {
      safeSetDisplay("dojo-arena-view", "none");
      clearInterval(dojoStopwatchInterval);
      toggleScratchpadCanvas(false);
      closeSplitSheetDrawer();
    });
    safeSetDisplay("dojo-arena-view", "flex");
    renderDojoArenaQuestion();
  }

  async function launchWeakAreasDojo() {
    const inst = await MockService.generate({
      subject: "ALL",
      mode: "WEAKNESS",
      count: 25,
      shuffleOptions: true
    });
    if (!inst.questions || inst.questions.length === 0) {
      alert("No weak questions detected yet! Complete a mock or practice new questions first.");
      return;
    }
    await openDojoSessionWithQuestions(inst.questions, "Weakness Remediation Dojo");
  }

  async function launchDojoFromMockMistakes() {
    if (!activeReviewAttempt || !Array.isArray(activeReviewAttempt.questions)) return;
    const failedOrUnans = activeReviewAttempt.questions.filter(q => {
      const r = activeReviewAttempt.userResponses ? activeReviewAttempt.userResponses[q.id] : null;
      return !r || r.selectedOption === null || r.selectedOption === undefined || r.selectedOption !== q.correctIndex || q.bookmarked;
    });
    const pool = failedOrUnans.length > 0 ? failedOrUnans : activeReviewAttempt.questions;
    const m = document.getElementById("modal-mock-review");
    if (m) m.classList.remove("active");
    await openDojoSessionWithQuestions(pool, `Mistake Clinic: ${activeReviewAttempt.title}`);
  }

  function exitDojoArena() {
    safeSetDisplay("dojo-arena-view", "none");
    clearInterval(dojoStopwatchInterval);
    toggleScratchpadCanvas(false);
    closeSplitSheetDrawer();
  }

  async function toggleCurrentDojoQuestionStar() {
    if (!dojoExam) return;
    const q = dojoExam.questions[dojoExam.currentIndex];
    if (!q) return;
    q.bookmarked = !q.bookmarked;
    if (!q.ephemeral) {
      await QuestionService.toggleStar(q.id);
    }
    renderDojoArenaQuestion(false);
  }

  async function promoteActiveMutantToBank() {
    if (!dojoExam || !dojoExam.questions) return;
    const q = dojoExam.questions[dojoExam.currentIndex];
    if (!q) return;

    q.ephemeral = false;
    const canonicalCopy = { ...q };
    delete canonicalCopy.dojoSequentialNum;
    await putRecord("store_questions", canonicalCopy);
    SearchService.invalidate();
    safeSetDisplay("btn-dojo-promote-mutant", "none");
    showToast("\u2713 Mutant Question Promoted to Permanent Bank!", "emerald");
  }

  function renderDojoArenaQuestion(resetStopwatch = true) {
    if (!dojoExam || !dojoExam.questions || dojoExam.questions.length === 0) return;
    const q = dojoExam.questions[dojoExam.currentIndex];
    const resp = dojoExam.userResponses[q.id];

    // Switch per-question ink context automatically
    switchScratchpadContext(`dojo_q_${q.id}`);

    if (resetStopwatch && resp.status === "unanswered") {
      startDojoStopwatch();
    }

    safeSetText("dojo-arena-title", dojoExam.title);
    safeSetText("dojo-arena-chap-badge", q.chapter);
    safeSetText("dojo-arena-method-badge", q.method || q.subtopic || "General");
    safeSetText("dojo-arena-qnum", q.dojoSequentialNum);
    safeSetText("dojo-arena-total-tag", `Question ${q.dojoSequentialNum} of ${dojoExam.questions.length}`);

    const starBtn = document.getElementById("btn-dojo-star");
    if (starBtn) {
      starBtn.classList.toggle("starred", !!q.bookmarked);
      starBtn.innerText = q.bookmarked ? "\u2605 Starred" : "\u2606 Star";
    }

    const promoteMutantBtn = document.getElementById("btn-dojo-promote-mutant");
    if (promoteMutantBtn) {
      promoteMutantBtn.style.display = q.ephemeral ? "inline-flex" : "none";
    }

    const dojoPassageBox = document.getElementById("dojo-passage-container");
    const dojoBody = document.getElementById("dojo-arena-body");
    const hasPassage = !!(q.passageText && q.passageText.trim().length > 0);
    if (dojoBody) {
      dojoBody.classList.toggle("has-passage", hasPassage);
    }
    if (dojoPassageBox) {
      if (hasPassage) {
        dojoPassageBox.style.display = "block";
        safeSetText("dojo-passage-tag", `${q.chapter.replace(/^ENG_/, "").replace(/^QA_/, "")} CONTEXT`);
        safeSetText("dojo-passage-set-badge", `SET Q ${q.setOrder || 1}/${q.setTotal || 1}`);
        safeSetHtml("dojo-passage-body", formatRichText(q.passageText));
      } else {
        dojoPassageBox.style.display = "none";
      }
    }

    safeSetHtml("dojo-arena-qtext", formatRichText(q.questionText));

    const imgBox = document.getElementById("dojo-image-container");
    if (imgBox) {
      if (q.imageUrl && q.imageUrl.trim().length > 0) {
        imgBox.style.display = "block";
        imgBox.innerHTML = `<img src="${q.imageUrl}" alt="Diagram">`;
      } else {
        imgBox.style.display = "none";
        imgBox.innerHTML = "";
      }
    }

    const dojoPillsWrap = document.getElementById("dojo-concept-pills-wrap");
    if (dojoPillsWrap) {
      dojoPillsWrap.innerHTML = "";
      const linkedIds = (Array.isArray(q.conceptIds) && q.conceptIds.length > 0)
        ? q.conceptIds
        : (q.conceptId ? [q.conceptId] : []);

      if (linkedIds.length === 0) {
        const pinBtn = document.createElement("button");
        pinBtn.className = "btn btn-purple";
        pinBtn.style.cssText = "padding:2px 8px; font-size:10.5px;";
        pinBtn.innerText = `\uD83D\uDCCC Pin ${q.chapter} Sheet`;
        pinBtn.onclick = () => openSplitSheetDrawer(null, q.subject, q.chapter);
        dojoPillsWrap.appendChild(pinBtn);

        const fullBtn = document.createElement("button");
        fullBtn.className = "btn btn-secondary";
        fullBtn.style.cssText = "padding:2px 8px; font-size:10.5px; color:var(--accent-cyan);";
        fullBtn.innerText = `\uD83D\uDCD6 Studio`;
        fullBtn.onclick = () => openCompendiumToSheet(null, q.subject, q.chapter);
        dojoPillsWrap.appendChild(fullBtn);
      } else {
        linkedIds.forEach(cId => {
          const cleanName = cId.replace(/^top_/, "").replace(/_/g, " ");
          const pinBtn = document.createElement("button");
          pinBtn.className = "btn btn-purple";
          pinBtn.style.cssText = "padding:2px 8px; font-size:10.5px;";
          pinBtn.innerText = `\uD83D\uDCCC Pin: ${cleanName}`;
          pinBtn.onclick = () => openSplitSheetDrawer(cId, q.subject, q.chapter);
          dojoPillsWrap.appendChild(pinBtn);

          const fullBtn = document.createElement("button");
          fullBtn.className = "btn btn-secondary";
          fullBtn.style.cssText = "padding:2px 8px; font-size:10.5px; color:var(--accent-cyan);";
          fullBtn.innerText = `\uD83D\uDCD6 Studio`;
          fullBtn.onclick = () => openCompendiumToSheet(cId, q.subject, q.chapter);
          dojoPillsWrap.appendChild(fullBtn);
        });
      }
    }

    const theoryBanner = document.getElementById("dojo-theory-banner");
    if (theoryBanner) {
      if (dojoExam.formulaBrief) {
        theoryBanner.style.display = "block";
        theoryBanner.innerHTML = `<strong>Active Sheet Cue:</strong> ${formatRichText(dojoExam.formulaBrief)}`;
      } else {
        theoryBanner.style.display = "none";
      }
    }

    safeSetDisplay("dojo-arena-feedback", "none");

    const mb = document.getElementById("dojo-arena-method-box");
    if (mb) {
      mb.style.display = resp.revealed ? "block" : "none";
      mb.innerHTML = `<strong>Solution &amp; Method:</strong><br>${formatRichText(q.explanation || "No method registered.")}`;
    }

    safeSetValue("dojo-arena-annotation", q.annotation || "");

    const optContainer = document.getElementById("dojo-arena-options");
    if (!optContainer) return;
    optContainer.innerHTML = "";

    q.options.forEach((optText, idx) => {
      const card = document.createElement("div");
      card.className = "opt-card" + (resp.selectedOption === idx ? " selected" : "");

      if (resp.selectedOption !== null) {
        if (idx === q.correctIndex) card.classList.add("correct-peek");
        else if (resp.selectedOption === idx) card.classList.add("wrong-peek");
      }

      card.innerHTML = `
        <span style="font-weight:700; color:var(--text-muted); font-size:13px;">${idx + 1}.</span>
        <div style="flex:1;">${formatRichText(optText)}</div>
      `;

      card.addEventListener("click", async () => {
        // 1-Tap Unselect when clicking the already-selected option in Dojo Clinic
        if (resp.selectedOption === idx) {
          resp.selectedOption = null;
          resp.status = "unanswered";
          resp.revealed = false;
          safeSetDisplay("dojo-arena-feedback", "none");
          await PerformanceService.recordUntimedPracticeSolve(q, null, 0);
          renderDojoArenaQuestion(false);
          return;
        }

        const perfBefore = await PerformanceService.getQuestionPerformanceMap();
        const wasMistakeDebt = !!(perfBefore[q.id] && perfBefore[q.id].lastWasIncorrect);

        resp.selectedOption = idx;
        resp.status = "answered";
        resp.revealed = true;
        clearInterval(dojoStopwatchInterval);
        const solveTimeSec = Math.max(2, dojoStopwatchSec || 12);

        let recordedSetupSec = null;
        let recordedCalcSec = null;
        if (dojoSetupSplitSec !== null) {
          recordedSetupSec = dojoSetupSplitSec;
          recordedCalcSec = Math.max(0, dojoStopwatchSec - dojoSetupSplitSec);
          safeSetText("dojo-stopwatch-splits", `[Setup: ${recordedSetupSec}s | Calc: ${recordedCalcSec}s | Total: ${dojoStopwatchSec}s]`);
        } else {
          safeSetText("dojo-stopwatch-splits", `[Solved in ${dojoStopwatchSec}s]`);
        }

        // Persist Untimed Dojo solve + [Setup | Calc] splits to DOJO_CLINIC telemetry ledger
        await PerformanceService.recordUntimedPracticeSolve(q, idx, solveTimeSec, recordedSetupSec, recordedCalcSec);

        if (navigator.vibrate) navigator.vibrate(idx === q.correctIndex ? 25 : [40, 40]);

        renderDojoArenaQuestion(false);
        const fb = document.getElementById("dojo-arena-feedback");
        if (fb) {
          fb.style.display = "block";
          if (idx === q.correctIndex) {
            fb.style.background = "rgba(16, 185, 129, 0.22)";
            fb.style.color = "var(--status-green)";
            fb.innerText = wasMistakeDebt
              ? "\u2713 Correct Answer! \uD83C\uDF89 Mistake Debt Redeemed & Graduated!"
              : "\u2713 Correct Answer! (Logged to Practice Mastery)";
          } else {
            fb.style.background = "rgba(244, 63, 94, 0.22)";
            fb.style.color = "var(--status-red)";
            fb.innerText = `\u2717 Incorrect. Correct is Option ${q.correctIndex + 1}. (Flagged in Mistake Debt Queue)`;
          }
        }
      });

      optContainer.appendChild(card);
    });
  }

  function navDojoArena(step) {
    if (!dojoExam) return;
    const next = dojoExam.currentIndex + step;
    if (next >= 0 && next < dojoExam.questions.length) {
      dojoExam.currentIndex = next;
      renderDojoArenaQuestion(true);
    }
  }

  function toggleDojoMethod() {
    if (!dojoExam) return;
    const q = dojoExam.questions[dojoExam.currentIndex];
    const resp = dojoExam.userResponses[q.id];
    resp.revealed = !resp.revealed;
    const mb = document.getElementById("dojo-arena-method-box");
    if (mb) mb.style.display = resp.revealed ? "block" : "none";
  }

  async function autoSaveDojoAnnotation(val) {
    if (!dojoExam) return;
    const q = dojoExam.questions[dojoExam.currentIndex];
    q.annotation = val;
    if (!q.ephemeral) {
      await putRecord("store_questions", q);
    }
  }

  function toggleDojoPalette(open) {
    const drawer = document.getElementById("dojo-palette-drawer");
    const overlay = document.getElementById("dojo-drawer-overlay");
    if (!drawer || !overlay) return;

    if (open) {
      renderDojoPaletteGrid();
      drawer.classList.add("open");
      overlay.classList.add("active");
    } else {
      drawer.classList.remove("open");
      overlay.classList.remove("active");
    }
  }

  function renderDojoPaletteGrid() {
    const scrollBody = document.getElementById("dojo-palette-scroll-body");
    if (!scrollBody || !dojoExam) return;
    scrollBody.innerHTML = "";
    safeSetText("dojo-palette-count-badge", `${dojoExam.questions.length} Qs`);

    const grouped = {};
    dojoExam.questions.forEach((q, idx) => {
      const ch = q.chapter || "GENERAL";
      if (!grouped[ch]) grouped[ch] = [];
      grouped[ch].push({ q, idx });
    });

    Object.keys(grouped).forEach(chapterKey => {
      const items = grouped[chapterKey];
      const header = document.createElement("div");
      header.style.cssText = "padding:6px 0; font-size:11px; font-weight:700; color:var(--accent-cyan);";
      header.innerText = `${chapterKey} (${items.length} Qs)`;
      scrollBody.appendChild(header);

      const grid = document.createElement("div");
      grid.className = "palette-grid";

      items.forEach(item => {
        const resp = dojoExam.userResponses[item.q.id];
        const cell = document.createElement("div");
        cell.className = "palette-cell" +
          (resp.status === "answered" ? " answered" : " unanswered") +
          (item.idx === dojoExam.currentIndex ? " current" : "") +
          (item.q.bookmarked ? " starred-cell" : "");

        cell.innerText = item.q.dojoSequentialNum;
        cell.addEventListener("click", () => {
          dojoExam.currentIndex = item.idx;
          toggleDojoPalette(false);
          renderDojoArenaQuestion(true);
        });

        grid.appendChild(cell);
      });

      scrollBody.appendChild(grid);
    });
  }

  /* ==========================================================================
   * SECTION 24: REVIEW COCKPIT, CONFIGURABLE SCORING & MISTAKE BIOPSY
   * ========================================================================== */
  async function openMockReview(attemptOrId) {
    let att = typeof attemptOrId === "string"
      ? (await getAllRecords("store_attempts")).find(a => a.sessionId === attemptOrId)
      : attemptOrId;

    if (!att) return;
    activeReviewAttempt = att;

    const archiveModal = document.getElementById("modal-history-archive");
    if (archiveModal && archiveModal.classList.contains("active")) {
      archiveModal.classList.remove("active");
    }

    const posM = att.positiveMarks !== undefined ? att.positiveMarks : 2.0;
    const negM = att.negativeMarks !== undefined ? att.negativeMarks : 0.5;

    safeSetText("review-modal-title", `${att.title}${att.attemptNumber > 1 ? ` (Attempt ${att.attemptNumber})` : ""} [+${posM}/-${negM}]`);
    safeSetText("review-modal-date", att.timeIST || formatISTDate(att.timestamp));
    safeSetText("rev-score", (att.finalScore || 0).toFixed(2));

    const totalAtt = (att.correctCount || 0) + (att.incorrectCount || 0);
    safeSetText("rev-acc", totalAtt > 0 ? `${Math.round((att.correctCount / totalAtt) * 100)}%` : "0%");
    safeSetText("rev-cor", att.correctCount || 0);
    safeSetText("rev-inc", att.incorrectCount || 0);
    safeSetText("rev-penalty", `-${(att.penaltyDrag || 0).toFixed(2)}`);
    safeSetText("rev-switch-delta", `${att.switchDelta > 0 ? "+" : ""}${att.switchDelta || 0} Net`);
    safeSetText("rev-traps", att.q4Traps || 0);

    const reattemptBtn = document.getElementById("btn-review-reattempt");
    if (reattemptBtn) reattemptBtn.onclick = () => reattemptMock(att.sessionId);
    const saveFixedBtn = document.getElementById("btn-review-save-fixed");
    if (saveFixedBtn) saveFixedBtn.onclick = () => openSaveBlueprintModal("FIXED_PAPER", att.sessionId);

    const rootId = att.parentSessionId || att.sessionId;
    const allAttempts = await getAllRecords("store_attempts");
    const thread = allAttempts.filter(a => a.sessionId === rootId || a.parentSessionId === rootId);

    const switchWrap = document.getElementById("rev-attempt-switcher-wrap");
    const switchSelect = document.getElementById("rev-attempt-select");

    if (thread.length > 1 && switchWrap && switchSelect) {
      switchWrap.style.display = "flex";
      switchSelect.innerHTML = "";
      thread.sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1));
      thread.forEach(iter => {
        const opt = document.createElement("option");
        opt.value = iter.sessionId;
        opt.innerText = `Attempt ${iter.attemptNumber || 1}: ${(iter.finalScore || 0).toFixed(1)} pts (${iter.timeIST ? iter.timeIST.split(",")[0] : "Past"})`;
        if (iter.sessionId === att.sessionId) opt.selected = true;
        switchSelect.appendChild(opt);
      });
    } else if (switchWrap) {
      switchWrap.style.display = "none";
    }

    const secGrid = document.getElementById("rev-sectional-breakdown-grid");
    if (secGrid) {
      secGrid.innerHTML = "";
      const secScores = {};

      if (att.questions && Array.isArray(att.questions) && att.userResponses) {
        att.questions.forEach(q => {
          const secName = q.subject || "GEN";
          if (!secScores[secName]) {
            secScores[secName] = { score: 0, cor: 0, inc: 0, unans: 0, att: 0, penalty: 0, totalTimeSec: 0 };
          }
          const resp = att.userResponses[q.id];
          secScores[secName].totalTimeSec += (resp ? (resp.timeSpentSec || 0) : 0);

          if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
            secScores[secName].att++;
            if (resp.selectedOption === q.correctIndex) {
              secScores[secName].score += posM;
              secScores[secName].cor++;
            } else {
              secScores[secName].score -= negM;
              secScores[secName].penalty += negM;
              secScores[secName].inc++;
            }
          } else {
            secScores[secName].unans++;
          }
        });
      }

      Object.keys(secScores).forEach(sKey => {
        const s = secScores[sKey];
        const mDwell = Math.floor(s.totalTimeSec / 60);
        const sDwell = s.totalTimeSec % 60;
        const acc = s.att > 0 ? Math.round((s.cor / s.att) * 100) : 0;

        const card = document.createElement("div");
        card.className = "sec-fidelity-card";
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px; margin-bottom:6px;">
            <b style="color:var(--accent-cyan); font-size:12px;">${TAXONOMY[sKey] ? TAXONOMY[sKey].name.split(" ")[0] : sKey}</b>
            <span style="font-weight:800; font-size:13px; color:#fff;">${s.score.toFixed(2)} pts</span>
          </div>
          <div class="sec-fidelity-metric-row">
            <span>Accuracy:</span> <b style="color:${acc >= 80 ? "var(--status-green)" : (acc >= 60 ? "var(--status-amber)" : "var(--status-red)")};">${acc}%</b>
          </div>
          <div class="sec-fidelity-metric-row">
            <span>Split (\uD83D\uDFE2/\uD83D\uDD34/\u26AA):</span> <b>${s.cor} / ${s.inc} / ${s.unans}</b>
          </div>
          <div class="sec-fidelity-metric-row">
            <span>Penalty Drag:</span> <b style="color:#f87171;">-${s.penalty.toFixed(2)}</b>
          </div>
          <div class="sec-fidelity-metric-row">
            <span>Section Dwell:</span> <b style="font-family:var(--font-mono);">${String(mDwell).padStart(2, "0")}:${String(sDwell).padStart(2, "0")}</b>
          </div>
        `;
        secGrid.appendChild(card);
      });
    }

    const tagPills = document.getElementById("rev-mistake-tags-pills");
    if (tagPills) {
      tagPills.innerHTML = "";
      const tagCounts = {};
      if (att.userResponses) {
        Object.values(att.userResponses).forEach(r => {
          if (r && r.errorTag && r.errorTag !== "UNCLASSIFIED" && r.errorTag !== "VALID_CALCULATED_RISK") {
            tagCounts[r.errorTag] = (tagCounts[r.errorTag] || 0) + 1;
          }
        });
      }

      if (Object.keys(tagCounts).length === 0) {
        tagPills.innerHTML = `<span style="font-size:11px; color:var(--text-muted);">Zero active trap penalties logged for this attempt.</span>`;
      } else {
        Object.keys(tagCounts).forEach(tag => {
          const span = document.createElement("span");
          span.className = "badge";
          span.style.background = "#5a1e1e";
          span.style.color = "#f87171";
          span.innerText = `${tag.replace(/_/g, " ")}: ${tagCounts[tag]}`;
          tagPills.appendChild(span);
        });
      }
    }

    pushNavLayer("modal-mock-review", () => {
      const m = document.getElementById("modal-mock-review");
      if (m) m.classList.remove("active");
    });
    const m = document.getElementById("modal-mock-review");
    if (m) m.classList.add("active");
  }

  function switchReviewAttempt(targetSessionId) {
    openMockReview(targetSessionId);
  }

  async function handleMistakeTagSelect(qId, val) {
    if (val === "__NEW_TAG__") {
      const raw = prompt("Enter new custom mistake tag (e.g., RUSHED_PANIC):");
      if (!raw || !raw.trim()) return;
      const formatted = raw.trim().toUpperCase().replace(/\s+/g, "_");
      if (!customMistakeTags.includes(formatted)) {
        customMistakeTags.push(formatted);
        await putRecord("store_config", { key: "custom_mistake_tags", value: customMistakeTags });
      }
      await setMistakeTag(qId, formatted);
    } else {
      await setMistakeTag(qId, val);
    }
  }

  async function setMistakeTag(qId, tag) {
    if (!activeReviewAttempt || !activeReviewAttempt.userResponses) return;
    if (activeReviewAttempt.userResponses[qId]) {
      activeReviewAttempt.userResponses[qId].errorTag = tag;
      if (tag === "VALID_CALCULATED_RISK" || tag === "UNCLASSIFIED") {
        activeReviewAttempt.userResponses[qId].isPanicSlip = false;
      }
      await putRecord("store_attempts", activeReviewAttempt);
    }
    await renderDashboard();
    openMockReview(activeReviewAttempt);
  }

  async function openTrapClinicModal(trapType) {
    activeClinicTrapType = trapType;
    safeSetText("trap-clinic-title", `Trap Clinic: #${trapType.replace(/_/g, " ")}`);

    const allAttempts = await getAllRecords("store_attempts");
    const completed = allAttempts.filter(a => a.completed && a.mockType !== "STUDY_VIEW");
    activeClinicQuestions = [];

    completed.forEach(att => {
      if (att.questions && Array.isArray(att.questions) && att.userResponses) {
        att.questions.forEach(q => {
          const resp = att.userResponses[q.id];
          if (resp && resp.errorTag === trapType) {
            activeClinicQuestions.push({
              mockTitle: att.title,
              mockDate: att.timeIST || formatISTDate(att.timestamp),
              question: q,
              response: resp
            });
          }
        });
      }
    });

    safeSetText("trap-clinic-summary-badge", `${activeClinicQuestions.length} Vulnerabilities Registered`);

    const list = document.getElementById("trap-clinic-question-list");
    if (!list) return;
    list.innerHTML = "";

    if (activeClinicQuestions.length === 0) {
      list.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">Zero recorded errors matching #${trapType}. Excellent mastery!</p>`;
    } else {
      activeClinicQuestions.forEach((item) => {
        const div = document.createElement("div");
        div.className = "card";
        div.style.padding = "12px";
        div.style.marginBottom = "8px";
        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span class="badge" style="background:#1f6feb;">${item.question.subject} \u2022 ${item.question.chapter}</span>
            <span style="font-family:var(--font-mono); font-size:11px; color:#f87171;">${item.response.timeSpentSec || 0}s spent</span>
          </div>
          <div style="font-size:13px; color:#fff; line-height:1.5; margin:6px 0;">${formatRichText(item.question.questionText)}</div>
          <div style="font-size:11.5px; color:var(--text-muted); line-height:1.4;">
            <b>Solution Key:</b> Option ${item.question.correctIndex + 1} | <i>${formatRichText(item.question.explanation || "No derivation registered.")}</i>
          </div>
        `;
        list.appendChild(div);
      });
    }

    pushNavLayer("modal-trap-clinic", () => {
      const m = document.getElementById("modal-trap-clinic");
      if (m) m.classList.remove("active");
    });
    const m = document.getElementById("modal-trap-clinic");
    if (m) m.classList.add("active");
  }

  async function drillFilteredTrapQuestions(openInDojo = false) {
    if (activeClinicQuestions.length === 0) {
      alert("No trap questions available to drill.");
      return;
    }
    const modal = document.getElementById("modal-trap-clinic");
    if (modal) modal.classList.remove("active");

    const uniquePool = [];
    activeClinicQuestions.forEach(item => {
      if (!uniquePool.some(q => q.id === item.question.id)) {
        uniquePool.push(item.question);
      }
    });

    if (openInDojo) {
      await openDojoSessionWithQuestions(uniquePool, `Dojo Trap Clinic: #${activeClinicTrapType}`);
    } else {
      await compileAndLaunchArena(`Trap Drill: #${activeClinicTrapType}`, uniquePool, Math.max(5, uniquePool.length * 2), false);
    }
  }

  async function openSubjectDiagnosticModal(subKey) {
    const sub = TAXONOMY[subKey];
    if (!sub) return;

    safeSetText("diag-subject-name", `${sub.name} (${subKey})`);
    safeSetText("diag-subject-sub", `Complete Syllabus & Chapter Analysis (Par: ${getSubjectThresholds(subKey).parSec}s/Q)`);

    const completed = await PerformanceService.getHistoricalAttempts();

    let subAtt = 0, subCor = 0;
    completed.forEach(c => {
      if (c.questions && Array.isArray(c.questions)) {
        c.questions.forEach(q => {
          if (q.subject === subKey) {
            const resp = (c.userResponses && typeof c.userResponses === "object") ? c.userResponses[q.id] : null;
            if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
              subAtt++;
              if (resp.selectedOption === q.correctIndex) subCor++;
            }
          }
        });
      }
    });

    const acc = subAtt > 0 ? Math.round((subCor / subAtt) * 100) : 0;
    safeSetText("diag-subject-acc", subAtt > 0 ? `${acc}%` : "--");
    safeSetText("diag-subject-counts", `${subAtt} Solved \u2022 ${subCor} Correct`);

    const gauge = document.getElementById("diag-acc-gauge");
    if (gauge) {
      gauge.setAttribute("stroke-dasharray", `${acc}, 100`);
      gauge.style.stroke = acc >= 80 ? "var(--status-green-border)" : (acc >= 65 ? "var(--status-amber)" : "var(--status-red)");
    }

    const chapList = document.getElementById("diag-chapter-coverage-list");
    if (chapList) {
      chapList.innerHTML = "";
      sub.chapters.forEach(chap => {
        let cAtt = 0, cCor = 0;
        completed.forEach(c => {
          if (c.questions && Array.isArray(c.questions)) {
            c.questions.forEach(q => {
              if (q.chapter === chap) {
                const resp = (c.userResponses && typeof c.userResponses === "object") ? c.userResponses[q.id] : null;
                if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
                  cAtt++;
                  if (resp.selectedOption === q.correctIndex) cCor++;
                }
              }
            });
          }
        });

        const cAcc = cAtt > 0 ? Math.round((cCor / cAtt) * 100) : 0;
        const div = document.createElement("div");
        div.className = "card";
        div.style.padding = "8px 10px";
        div.style.marginBottom = "6px";
        div.style.cursor = "pointer";
        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-weight:700; font-family:var(--font-mono); font-size:12px;">${chap}</span>
            <span class="badge" style="background:${cAtt > 0 ? "#1b4d2e" : "#151a24"}; color:${cAtt > 0 ? "#4ade80" : "#8b949e"};">
              ${cAtt > 0 ? `${cAcc}% (${cAtt} Qs)` : "0 Qs"}
            </span>
          </div>
          <div class="battery-bar-container" style="height:6px;">
            <div class="battery-bar-fill" style="width:${cAcc}%; background:${cAcc >= 80 ? "var(--status-green)" : (cAcc >= 60 ? "var(--status-amber)" : "var(--accent-blue)")};"></div>
          </div>
        `;
        div.onclick = () => {
          const m = document.getElementById("modal-subject-diagnostic");
          if (m) m.classList.remove("active");
          openChapterInspector(subKey, chap);
        };
        chapList.appendChild(div);
      });
    }

    const blitzBtn = document.getElementById("btn-launch-subject-blitz");
    if (blitzBtn) {
      blitzBtn.onclick = () => {
        const m = document.getElementById("modal-subject-diagnostic");
        if (m) m.classList.remove("active");
        launchConfiguredMockDirect(subKey, "ALL", 10, 8);
      };
    }

    pushHistoryState("modal-subject-diagnostic");
    const m = document.getElementById("modal-subject-diagnostic");
    if (m) m.classList.add("active");
  }

  function openHistoryArchiveModal() {
    pushNavLayer("modal-history-archive", () => {
      const m = document.getElementById("modal-history-archive");
      if (m) m.classList.remove("active");
    });
    const m = document.getElementById("modal-history-archive");
    if (m) m.classList.add("active");
    renderArchiveList("ALL");
  }

  async function renderArchiveList(filterType) {
    const includePractice = filterType === "ALL" || filterType === "DOJO_CLINIC";
    const completed = await PerformanceService.getHistoricalAttempts(includePractice);
    const container = document.getElementById("archive-list-container");
    if (!container) return;
    container.innerHTML = "";

    let list = completed.slice().sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (filterType === "TIER_1") {
      list = list.filter(a => a.mockType === "TIER_1" || (a.questions && a.questions.length >= 80) || /tier[\s_-]?[12]/i.test(a.title || ""));
    } else if (filterType !== "ALL") {
      list = list.filter(a => a.mockType === filterType);
    }

    if (list.length === 0) {
      container.innerHTML = `<p style="font-size:12px; color:var(--text-muted); text-align:center; padding:12px;">No tests found in this category.</p>`;
      return;
    }

    const threads = {};
    list.forEach(att => {
      const rootId = att.parentSessionId || att.sessionId;
      if (!threads[rootId]) threads[rootId] = [];
      threads[rootId].push(att);
    });

    Object.keys(threads).forEach(rootId => {
      const threadAttempts = threads[rootId].sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1));
      const latest = threadAttempts[threadAttempts.length - 1];
      const isUntimed = latest.mockType === "DOJO_CLINIC" || latest.mockType === "SHOWCASE_PRACTICE";

      const div = document.createElement("div");
      div.className = "attempt-thread-group";

      const header = document.createElement("div");
      header.className = "attempt-thread-header";
      header.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <b style="font-size:13.5px; color:#fff;">${latest.title}</b>
            ${isUntimed ? `<span class="badge" style="background:rgba(16,185,129,0.18); color:#34d399; border:1px solid rgba(16,185,129,0.4); font-size:9.5px;">\uD83E\uDDD8 UNTIMED PRACTICE</span>` : ""}
            ${threadAttempts.length > 1 ? `<span class="badge" style="background:#8957e5; font-size:10px;">${threadAttempts.length} Attempts</span>` : ""}
            <span class="badge-slot slot-${(latest.diurnalSlot || "morning").toLowerCase()}">${latest.diurnalSlot || "DAY"}</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Latest: ${latest.timeIST || formatISTDate(latest.timestamp)}</div>
        </div>
        <div style="text-align:right;">
          ${isUntimed
            ? `<span style="font-size:13px; font-weight:800; color:#34d399;">${latest.correctCount || 0}/${latest.attemptedCount || (latest.questions ? latest.questions.length : 0)} Solved</span>`
            : `<span style="font-size:15px; font-weight:800; color:var(--accent-cyan);">${(latest.finalScore || 0).toFixed(2)} pts</span>`}
        </div>
      `;

      const subList = document.createElement("div");
      subList.style.display = threadAttempts.length > 1 ? "none" : "block";

      threadAttempts.forEach(iter => {
        const iterUntimed = iter.mockType === "DOJO_CLINIC" || iter.mockType === "SHOWCASE_PRACTICE";
        const row = document.createElement("div");
        row.className = "attempt-sub-row";
        row.innerHTML = `
          <div>
            <b>${iterUntimed ? "Practice Log" : `Attempt ${iter.attemptNumber || 1}`}</b> \u2022 <span style="color:var(--text-muted);">${iter.timeIST ? iter.timeIST.split(",")[1] : ""}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; color:${iterUntimed ? "#34d399" : "var(--accent-cyan)"};">${iterUntimed ? `${iter.correctCount || 0} Correct` : `${(iter.finalScore || 0).toFixed(2)} pts`}</span>
            <button class="btn btn-secondary" style="padding:2px 8px; font-size:11px; color:var(--accent-cyan);" onclick="CGL_OS.exportMockByIdJson('${iter.sessionId}')">\uD83D\uDCE5 Export</button>
            <button class="btn btn-secondary" style="padding:2px 8px; font-size:11px;" onclick="CGL_OS.openMockReview('${iter.sessionId}')">Inspect</button>
            <button class="btn btn-danger" style="padding:2px 8px; font-size:11px;" onclick="CGL_OS.deleteAttemptSession('${iter.sessionId}')">\uD83D\uDDD1</button>
          </div>
        `;
        subList.appendChild(row);
      });

      if (threadAttempts.length > 1) {
        header.onclick = () => {
          const isOpen = subList.style.display === "block";
          subList.style.display = isOpen ? "none" : "block";
          header.classList.toggle("open", !isOpen);
        };
      }

      div.appendChild(header);
      div.appendChild(subList);
      container.appendChild(div);
    });
  }

  async function deleteAttemptSession(sessionId) {
    if (confirm("Delete this completed attempt record? Derived performance statistics will recalculate immediately. (Question bank remains intact)")) {
      await deleteRecordFromStore("store_attempts", sessionId);
      await renderDashboard();
      renderArchiveList("ALL");
      alert("Attempt record deleted and statistics updated.");
    }
  }

  /* ==========================================================================
   * SECTION 25: LIVING KNOWLEDGE STUDIO (GOODNOTES / APPLE NOTES TABLET ENGINE)
   * - Unified 3 Reading Surface Presets (Obsidian, Warm Charcoal, Warm Sepia Paper)
   * - Instant Brush-Drag Painting across Words + Single-Tap Word Masking & Highlighting
   * - Page-Anchored Direct Stylus Handwriting Layer (#comp-folio-ink-canvas)
   * - Interactive Copy-Paste / Upload Movable & Inline Images + Sticky Callout Cards
   * - Auto-Tracked Last Opened Date + Neglected Sheets Filter (Zero SRS Bloat)
   * ========================================================================== */
  let compSheetInkMode = false;
  let compSheetInkTool = "pen"; // 'pen' | 'marker' | 'tape' | 'lasso' | 'excerpt' | 'stroke_eraser' | 'eraser'
  let compSheetInkColor = "#38bdf8";
  let compSheetInkSize = 2.5;
  let compSheetInkFingerDraw = true;
  let activeSheetInkStrokes = [];
  let isDrawingSheetInk = false;
  let currentSheetInkStroke = null;
  let activeSheetMediaBlocks = [];

  // --- V9.0 GoodNotes / LiquidText PDF Studio & Excerpt State ---
  let compendiumActiveDocType = "SHEET"; // 'SHEET' | 'PDF'
  let activePdfId = null;
  let activePdfDocProxy = null;
  let activePdfBytes = null;
  let activePdfMeta = null;
  let activePdfPageNum = 1;
  let activePdfPageCount = 1;
  let pdfThumbnailFilterMode = "ALL"; // 'ALL' | 'ANNOTATED' | 'BOOKMARKED'
  let stagedExcerptCrop = null; // { dataUrl, docType, docId, pageNum, scrollTop, normRect }
  let activeDocPinnedExcerpts = [];
  let lassoSelectionBox = null; // { minNx, minNy, maxNx, maxNy, polyPts }
  let lassoSelectedStrokeIndices = [];
  let isDraggingLassoSelection = false;
  let lassoDragLastPt = null;

  /**
   * Hold-to-Snap Geometric Shape Recognizer (350ms Stationary Hold at Stroke End)
   * Supports both normalized [0..1] coordinates (`nx`, `ny`) and pixel coordinates (`x`, `y`).
   * Automatically snaps to:
   *  - Straight Line (with horizontal/vertical/45-deg snap within 6 degrees)
   *  - 64-Point Smooth Circle / Ellipse
   *  - Closed 3-Vertex Triangle or 4-Vertex Axis-Aligned / Rotated Rectangle
   */
  function snapStrokeToGeometricShape(rawPoints, canvasW = 800, canvasH = 1000, isNormalized = true) {
    if (!Array.isArray(rawPoints) || rawPoints.length < 6) return null;
    const pts = rawPoints.map(p => ({
      px: isNormalized ? (p.nx * canvasW) : p.x,
      py: isNormalized ? (p.ny * canvasH) : p.y,
      raw: p
    }));

    const first = pts[0];
    const last = pts[pts.length - 1];
    const directDist = Math.hypot(last.px - first.px, last.py - first.py);

    let pathLength = 0;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (p.px < minX) minX = p.px;
      if (p.px > maxX) maxX = p.px;
      if (p.py < minY) minY = p.py;
      if (p.py > maxY) maxY = p.py;
      if (i > 0) {
        pathLength += Math.hypot(p.px - pts[i - 1].px, p.py - pts[i - 1].py);
      }
    }

    const boxW = Math.max(1, maxX - minX);
    const boxH = Math.max(1, maxY - minY);
    const diag = Math.hypot(boxW, boxH);
    if (pathLength < 24) return null;

    const toOutputPt = (px, py) => {
      if (isNormalized) {
        return {
          nx: Math.max(0, Math.min(1, px / Math.max(1, canvasW))),
          ny: Math.max(0, Math.min(1, py / Math.max(1, canvasH)))
        };
      }
      const template = rawPoints[0] || {};
      return {
        ...template,
        x: px,
        y: py
      };
    };

    // 1. Straight Line Detection (path is nearly colinear)
    if (directDist / pathLength >= 0.86) {
      let x2 = last.px;
      let y2 = last.py;
      const dx = x2 - first.px;
      const dy = y2 - first.py;
      const len = Math.hypot(dx, dy);
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
      const absDeg = Math.abs(deg);

      if (absDeg <= 6 || Math.abs(absDeg - 180) <= 6) {
        y2 = first.py;
      } else if (Math.abs(absDeg - 90) <= 6) {
        x2 = first.px;
      } else if (Math.abs(absDeg - 45) <= 6 || Math.abs(absDeg - 135) <= 6) {
        const snapRad = (Math.round(deg / 45) * 45 * Math.PI) / 180;
        x2 = first.px + Math.cos(snapRad) * len;
        y2 = first.py + Math.sin(snapRad) * len;
      }

      const linePts = [];
      const steps = 16;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        linePts.push(toOutputPt(first.px + (x2 - first.px) * t, first.py + (y2 - first.py) * t));
      }
      return linePts;
    }

    // 2. Closed Loop Detection (Circle / Ellipse / Rectangle / Triangle)
    const isClosedLoop = directDist <= Math.max(48, diag * 0.34) && boxW >= 18 && boxH >= 18;
    if (!isClosedLoop) {
      // Even if open, if user held at end of an L/V or 2-segment stroke, snap to clean polyline or line
      let maxDev = 0;
      for (const p of pts) {
        const d = Math.sqrt(distToSegmentSq(p.px, p.py, first.px, first.py, last.px, last.py));
        if (d > maxDev) maxDev = d;
      }
      if (maxDev <= Math.max(18, directDist * 0.14)) {
        const linePts = [];
        for (let s = 0; s <= 16; s++) {
          const t = s / 16;
          linePts.push(toOutputPt(first.px + (last.px - first.px) * t, first.py + (last.py - first.py) * t));
        }
        return linePts;
      }
      return null;
    }

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const rx = boxW / 2;
    const ry = boxH / 2;

    // Measure normalized radial variance against an ideal ellipse
    let radialErrSum = 0;
    let rectEdgeErrSum = 0;
    pts.forEach(p => {
      const normEll = Math.hypot((p.px - cx) / Math.max(1, rx), (p.py - cy) / Math.max(1, ry));
      radialErrSum += Math.abs(normEll - 1);

      const dLeft = Math.abs(p.px - minX);
      const dRight = Math.abs(maxX - p.px);
      const dTop = Math.abs(p.py - minY);
      const dBottom = Math.abs(maxY - p.py);
      rectEdgeErrSum += Math.min(dLeft, dRight, dTop, dBottom) / Math.max(1, Math.min(boxW, boxH));
    });
    const meanRadialErr = radialErrSum / pts.length;
    const meanRectErr = rectEdgeErrSum / pts.length;

    // Detect sharp corners for Triangle vs Rectangle vs Circle
    const corners = [first];
    const stepSample = Math.max(2, Math.floor(pts.length / 28));
    for (let i = stepSample; i < pts.length - stepSample; i += stepSample) {
      const pPrev = pts[i - stepSample];
      const pCurr = pts[i];
      const pNext = pts[i + stepSample];
      const a1 = Math.atan2(pCurr.py - pPrev.py, pCurr.px - pPrev.px);
      const a2 = Math.atan2(pNext.py - pCurr.py, pNext.px - pCurr.px);
      let diff = Math.abs(a2 - a1);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      if (diff > 0.72) {
        const prevCorner = corners[corners.length - 1];
        if (Math.hypot(pCurr.px - prevCorner.px, pCurr.py - prevCorner.py) > diag * 0.22) {
          corners.push(pCurr);
        }
      }
    }

    if (corners.length === 3 && meanRadialErr > 0.17) {
      const triPts = [];
      const verts = [...corners, corners[0]];
      for (let v = 0; v < 3; v++) {
        for (let s = 0; s < 12; s++) {
          const t = s / 12;
          triPts.push(toOutputPt(
            verts[v].px + (verts[v + 1].px - verts[v].px) * t,
            verts[v].py + (verts[v + 1].py - verts[v].py) * t
          ));
        }
      }
      triPts.push(toOutputPt(verts[0].px, verts[0].py));
      return triPts;
    }

    if (meanRectErr < 0.13 && meanRectErr < meanRadialErr * 0.92) {
      const rectVerts = [
        { px: minX, py: minY },
        { px: maxX, py: minY },
        { px: maxX, py: maxY },
        { px: minX, py: maxY },
        { px: minX, py: minY }
      ];
      const rectPts = [];
      for (let edge = 0; edge < 4; edge++) {
        for (let s = 0; s < 12; s++) {
          const t = s / 12;
          rectPts.push(toOutputPt(
            rectVerts[edge].px + (rectVerts[edge + 1].px - rectVerts[edge].px) * t,
            rectVerts[edge].py + (rectVerts[edge + 1].py - rectVerts[edge].py) * t
          ));
        }
      }
      rectPts.push(toOutputPt(minX, minY));
      return rectPts;
    }

    // Default closed shape: 64-point smooth Circle (if near-equal aspect) or Ellipse
    const aspect = boxW / boxH;
    const finalRx = (aspect >= 0.80 && aspect <= 1.25) ? (rx + ry) / 2 : rx;
    const finalRy = (aspect >= 0.80 && aspect <= 1.25) ? (rx + ry) / 2 : ry;
    const circlePts = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      circlePts.push(toOutputPt(cx + Math.cos(theta) * finalRx, cy + Math.sin(theta) * finalRy));
    }
    return circlePts;
  }

  function pointInPolygonNormalized(nx, ny, polyPts) {
    if (!Array.isArray(polyPts) || polyPts.length < 3) return false;
    let inside = false;
    for (let i = 0, j = polyPts.length - 1; i < polyPts.length; j = i++) {
      const xi = polyPts[i].nx, yi = polyPts[i].ny;
      const xj = polyPts[j].nx, yj = polyPts[j].ny;
      const intersect = ((yi > ny) !== (yj > ny)) &&
        (nx < ((xj - xi) * (ny - yi)) / ((yj - yi) || 1e-7) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /* ==========================================================================
   * V9.0 GOODNOTES / LIQUIDTEXT EMBEDDED PDF STUDIO ENGINE
   * ========================================================================== */
  async function getPdfLibraryIndex() {
    const rec = await getRecord("store_config", "pdf_library_index");
    return (rec && Array.isArray(rec.value)) ? rec.value : [];
  }

  async function savePdfLibraryIndex(list) {
    await putRecord("store_config", {
      key: "pdf_library_index",
      value: Array.isArray(list) ? list : []
    });
  }

  function triggerPdfUploadPrompt() {
    closeCompMorePopover();
    const fileInput = document.getElementById("comp-pdf-file-input");
    if (fileInput) {
      fileInput.value = "";
      fileInput.click();
    }
  }

  async function handlePdfDocumentUpload(input) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      showToast("Please select a valid .pdf document.", "rose");
      return;
    }

    try {
      showToast(`\u23F3 Importing "${file.name}" into Local Vault...`, "cyan", 2600);
      const arrayBuf = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuf);

      let pageCount = 1;
      if (window.pdfjsLib) {
        const loadingTask = window.pdfjsLib.getDocument({ data: uint8.slice() });
        const pdfDoc = await loadingTask.promise;
        pageCount = pdfDoc.numPages || 1;
      } else if (window.PDFLib) {
        const pdfDoc = await window.PDFLib.PDFDocument.load(uint8);
        pageCount = pdfDoc.getPageCount() || 1;
      }

      const id = "pdf_" + Date.now();
      const cleanTitle = file.name.replace(/\.pdf$/i, "").trim() || "Imported Study PDF";
      const sub = activeCompSubject || "QA";
      const chap = activeCompChapter || (TAXONOMY[sub]?.chapters?.[0] || "QA_PERCENTAGE");
      const now = Date.now();

      await putRecord("store_notes", {
        id: `pdf_doc_${id}`,
        pdfId: id,
        title: cleanTitle,
        subject: sub,
        chapter: chap,
        pageCount: pageCount,
        bookmarks: [],
        pdfBytes: uint8,
        createdAt: now,
        lastOpenedAt: now
      });

      const idxList = await getPdfLibraryIndex();
      const metaEntry = {
        id,
        title: cleanTitle,
        subject: sub,
        chapter: chap,
        pageCount,
        bookmarks: [],
        createdAt: now,
        lastOpenedAt: now
      };
      idxList.unshift(metaEntry);
      await savePdfLibraryIndex(idxList);

      showToast(`\u2713 Imported "${cleanTitle}" (${pageCount} pages)!`, "emerald");
      const compView = document.getElementById("compendium-fullscreen-view");
      if (!compView || compView.style.display !== "flex") {
        await openCompendiumStudio();
      }
      await openPdfInCompendiumStudio(id, 1);
      const idxModal = document.getElementById("modal-all-sheets-index");
      if (idxModal && idxModal.classList.contains("active")) {
        await renderAllSheetsIndexList();
      }
    } catch (err) {
      console.error("PDF Import Error:", err);
      showToast("PDF Import Failed: " + (err.message || "Invalid PDF"), "rose", 3500);
    }
  }

  async function openPdfInCompendiumStudio(pdfId, initialPage = 1) {
    if (!pdfId) return;
    const rec = await getRecord("store_notes", `pdf_doc_${pdfId}`);
    if (!rec || !rec.pdfBytes) {
      showToast("PDF binary record not found in local storage.", "rose");
      return;
    }

    compendiumActiveDocType = "PDF";
    activePdfId = pdfId;
    activePdfMeta = {
      id: pdfId,
      title: rec.title || "Study PDF",
      subject: rec.subject || activeCompSubject || "QA",
      chapter: rec.chapter || activeCompChapter || "QA_PERCENTAGE",
      pageCount: rec.pageCount || 1,
      bookmarks: Array.isArray(rec.bookmarks) ? rec.bookmarks : []
    };
    activeCompSubject = activePdfMeta.subject;
    activeCompChapter = activePdfMeta.chapter;

    const rawBytes = rec.pdfBytes instanceof Uint8Array
      ? rec.pdfBytes
      : new Uint8Array(rec.pdfBytes.buffer || rec.pdfBytes);
    activePdfBytes = rawBytes;

    if (window.pdfjsLib) {
      const loadingTask = window.pdfjsLib.getDocument({ data: activePdfBytes.slice() });
      activePdfDocProxy = await loadingTask.promise;
      activePdfPageCount = activePdfDocProxy.numPages || activePdfMeta.pageCount || 1;
    } else {
      activePdfDocProxy = null;
      activePdfPageCount = activePdfMeta.pageCount || 1;
    }
    activePdfMeta.pageCount = activePdfPageCount;

    const now = Date.now();
    await putRecord("store_notes", {
      id: `last_opened_${pdfId}`,
      sheetId: pdfId,
      lastOpenedAt: now,
      openCount: 1
    });

    const idxList = await getPdfLibraryIndex();
    const metaIdx = idxList.findIndex(item => item.id === pdfId);
    if (metaIdx !== -1) {
      idxList[metaIdx].lastOpenedAt = now;
      idxList[metaIdx].pageCount = activePdfPageCount;
      await savePdfLibraryIndex(idxList);
    }

    safeSetDisplay("comp-studio-doc-content", "none");
    safeSetDisplay("comp-pdf-studio-bar", "flex");
    safeSetDisplay("comp-pdf-canvas-wrap", "flex");

    safeSetText("comp-studio-header-title", `\uD83D\uDCC4 ${activePdfMeta.title}`);
    safeSetText("comp-studio-header-sub", `${activePdfMeta.chapter} \u2022 PDF (${activePdfPageCount} Pages)`);

    await renderCompStudioSheets();
    await loadAndRenderActiveDocPinnedExcerpts(pdfId);

    const noteRec = await getRecord("store_notes", `scratch_${pdfId}`);
    safeSetValue("comp-studio-scratchpad", noteRec ? noteRec.content : "");

    const targetPage = Math.max(1, Math.min(activePdfPageCount, Number(initialPage) || 1));
    await renderActivePdfPage(targetPage);
  }

  async function renderActivePdfPage(pageNum = 1) {
    if (compendiumActiveDocType !== "PDF" || !activePdfId) return;
    activePdfPageNum = Math.max(1, Math.min(activePdfPageCount || 1, Number(pageNum) || 1));

    safeSetDisplay("comp-studio-doc-content", "none");
    safeSetDisplay("comp-pdf-studio-bar", "flex");
    safeSetDisplay("comp-pdf-canvas-wrap", "flex");

    const pageInput = document.getElementById("comp-pdf-page-input");
    if (pageInput) {
      pageInput.value = String(activePdfPageNum);
      pageInput.max = String(activePdfPageCount);
    }
    safeSetText("comp-pdf-page-total", `of ${activePdfPageCount}`);
    safeSetText("comp-studio-header-sub", `${activePdfMeta?.chapter || activeCompChapter} \u2022 Page ${activePdfPageNum} of ${activePdfPageCount}`);

    // Sync Bookmark Button State
    const bmBtn = document.getElementById("btn-pdf-bookmark-page");
    const isBookmarked = Array.isArray(activePdfMeta?.bookmarks) && activePdfMeta.bookmarks.includes(activePdfPageNum);
    if (bmBtn) {
      bmBtn.innerText = isBookmarked ? "\u2605 Bookmarked" : "\u2606 Page";
      bmBtn.classList.toggle("btn-amber", isBookmarked);
      bmBtn.classList.toggle("btn-secondary", !isBookmarked);
    }

    // Switch Global Scratchpad context per PDF page
    switchScratchpadContext(`pdf_${activePdfId}_p${activePdfPageNum}`);

    // Render PDF Page via PDF.js onto #comp-pdf-render-canvas
    const pdfCanvas = document.getElementById("comp-pdf-render-canvas");
    if (pdfCanvas && activePdfDocProxy) {
      try {
        const page = await activePdfDocProxy.getPage(activePdfPageNum);
        const pageEl = document.getElementById("comp-folio-page");
        const availW = Math.max(320, Math.min(920, (pageEl ? pageEl.clientWidth : 780) - 24));
        const unscaledVp = page.getViewport({ scale: 1 });
        const cssScale = (availW / Math.max(1, unscaledVp.width)) * (compendiumZoomScale || 1);
        const dpr = Math.min(window.devicePixelRatio || 1, 2.25);
        const renderVp = page.getViewport({ scale: cssScale * dpr });

        pdfCanvas.width = Math.round(renderVp.width);
        pdfCanvas.height = Math.round(renderVp.height);
        pdfCanvas.style.width = `${Math.round(renderVp.width / dpr)}px`;
        pdfCanvas.style.height = `${Math.round(renderVp.height / dpr)}px`;

        const ctx = pdfCanvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport: renderVp }).promise;
      } catch (renderErr) {
        console.warn("PDF page render notice:", renderErr);
      }
    }

    // Load Per-Page Ink (`sheet_ink_${activePdfId}_p${activePdfPageNum}`) & Per-Page Floating Media
    const inkKey = `sheet_ink_${activePdfId}_p${activePdfPageNum}`;
    const savedInkRec = await getRecord("store_notes", inkKey);
    activeSheetInkStrokes = (savedInkRec && Array.isArray(savedInkRec.strokes)) ? savedInkRec.strokes : [];
    sheetInkUndoStack = [];
    lastClearedSheetInkBackup = null;
    currentSheetInkStroke = null;
    lassoSelectionBox = null;
    lassoSelectedStrokeIndices = [];

    const mediaKey = `sheet_media_${activePdfId}_p${activePdfPageNum}`;
    const savedMediaRec = await getRecord("store_notes", mediaKey);
    activeSheetMediaBlocks = (savedMediaRec && Array.isArray(savedMediaRec.blocks)) ? savedMediaRec.blocks : [];

    renderActiveSheetMediaBlocks();
    updateCompMaskAndHighlightBadge();
    updateRecallProgressCounter();
    syncSheetInkPointerPassthrough();
    setTimeout(syncSheetInkCanvasGeometry, 40);

    const strip = document.getElementById("comp-pdf-thumbnail-strip");
    if (strip && strip.style.display !== "none") {
      await renderPdfThumbnailStrip();
    }
  }

  function navActivePdfPage(delta) {
    if (compendiumActiveDocType !== "PDF" || !activePdfId) return;
    const next = activePdfPageNum + Number(delta || 0);
    if (next < 1 || next > activePdfPageCount) return;
    renderActivePdfPage(next);
  }

  function jumpToPdfPage(pageVal) {
    if (compendiumActiveDocType !== "PDF" || !activePdfId) return;
    const target = Math.max(1, Math.min(activePdfPageCount, parseInt(pageVal, 10) || 1));
    renderActivePdfPage(target);
  }

  async function toggleActivePdfPageBookmark() {
    if (compendiumActiveDocType !== "PDF" || !activePdfId || !activePdfMeta) return;
    if (!Array.isArray(activePdfMeta.bookmarks)) activePdfMeta.bookmarks = [];
    const idx = activePdfMeta.bookmarks.indexOf(activePdfPageNum);
    if (idx === -1) {
      activePdfMeta.bookmarks.push(activePdfPageNum);
      activePdfMeta.bookmarks.sort((a, b) => a - b);
      showToast(`\u2605 Bookmarked Page ${activePdfPageNum}`, "amber", 1800);
    } else {
      activePdfMeta.bookmarks.splice(idx, 1);
      showToast(`Removed bookmark from Page ${activePdfPageNum}`, "cyan", 1800);
    }

    const rec = await getRecord("store_notes", `pdf_doc_${activePdfId}`);
    if (rec) {
      rec.bookmarks = activePdfMeta.bookmarks;
      await putRecord("store_notes", rec);
    }
    const idxList = await getPdfLibraryIndex();
    const mIdx = idxList.findIndex(i => i.id === activePdfId);
    if (mIdx !== -1) {
      idxList[mIdx].bookmarks = activePdfMeta.bookmarks;
      await savePdfLibraryIndex(idxList);
    }
    await renderActivePdfPage(activePdfPageNum);
  }

  async function togglePdfThumbnailStrip(forceState = null) {
    const strip = document.getElementById("comp-pdf-thumbnail-strip");
    const btn = document.getElementById("btn-pdf-thumb-toggle");
    if (!strip) return;
    const isHidden = strip.style.display === "none" || !strip.style.display;
    const nextState = typeof forceState === "boolean" ? forceState : isHidden;
    strip.style.display = nextState ? "block" : "none";
    if (btn) btn.classList.toggle("btn-cyan", nextState);
    if (nextState) {
      await renderPdfThumbnailStrip();
    }
  }

  async function setPdfThumbnailFilter(mode = "ALL") {
    pdfThumbnailFilterMode = mode || "ALL";
    ["ALL", "ANNOTATED", "BOOKMARKED"].forEach(k => {
      const btn = document.getElementById(`btn-pdf-filter-${k.toLowerCase()}`);
      if (btn) {
        btn.classList.toggle("btn-cyan", k === pdfThumbnailFilterMode);
        btn.classList.toggle("btn-secondary", k !== pdfThumbnailFilterMode);
      }
    });
    await renderPdfThumbnailStrip();
  }

  async function renderPdfThumbnailStrip() {
    const listEl = document.getElementById("comp-pdf-thumbnail-cards");
    if (!listEl || compendiumActiveDocType !== "PDF" || !activePdfId) return;
    listEl.innerHTML = "";

    const allNotes = await getAllRecords("store_notes");
    const annotatedPages = new Set();
    const prefix = `sheet_ink_${activePdfId}_p`;
    const mediaPrefix = `sheet_media_${activePdfId}_p`;

    allNotes.forEach(n => {
      if (!n || typeof n.id !== "string") return;
      if (n.id.startsWith(prefix) && Array.isArray(n.strokes) && n.strokes.length > 0) {
        const pNum = parseInt(n.id.slice(prefix.length), 10);
        if (pNum) annotatedPages.add(pNum);
      }
      if (n.id.startsWith(mediaPrefix) && Array.isArray(n.blocks) && n.blocks.length > 0) {
        const pNum = parseInt(n.id.slice(mediaPrefix.length), 10);
        if (pNum) annotatedPages.add(pNum);
      }
    });

    const bookmarks = new Set(Array.isArray(activePdfMeta?.bookmarks) ? activePdfMeta.bookmarks : []);
    let shownCount = 0;

    for (let p = 1; p <= activePdfPageCount; p++) {
      const isAnn = annotatedPages.has(p);
      const isBm = bookmarks.has(p);
      if (pdfThumbnailFilterMode === "ANNOTATED" && !isAnn) continue;
      if (pdfThumbnailFilterMode === "BOOKMARKED" && !isBm) continue;

      shownCount++;
      const card = document.createElement("div");
      card.className = "pdf-thumb-card" + (p === activePdfPageNum ? " active" : "");
      card.innerHTML = `
        <div style="font-size:11px; font-weight:800; color:${p === activePdfPageNum ? "#38bdf8" : "#e2e8f0"};">P.${p}</div>
        <div style="font-size:10px; display:flex; gap:3px; justify-content:center; min-height:14px;">
          ${isAnn ? '<span title="Has Ink/Sticky Annotations">\u270F\uFE0F</span>' : ""}
          ${isBm ? '<span title="Bookmarked Page" style="color:#f59e0b;">\u2605</span>' : ""}
        </div>
      `;
      card.onclick = () => renderActivePdfPage(p);
      listEl.appendChild(card);
    }

    if (shownCount === 0) {
      listEl.innerHTML = `<div style="font-size:11px; color:var(--text-muted); padding:6px 10px;">No pages match "${pdfThumbnailFilterMode}" filter.</div>`;
    }
  }

  async function insertBlankPageIntoActivePdf() {
    if (compendiumActiveDocType !== "PDF" || !activePdfId || !activePdfBytes) return;
    if (!window.PDFLib) {
      showToast("pdf-lib is still loading. Try again in a moment.", "amber");
      return;
    }

    try {
      const pdfDoc = await window.PDFLib.PDFDocument.load(activePdfBytes);
      const refPage = pdfDoc.getPage(Math.max(0, activePdfPageNum - 1));
      const { width, height } = refPage ? refPage.getSize() : { width: 595.28, height: 841.89 };
      const insertIdx = Math.min(pdfDoc.getPageCount(), activePdfPageNum);
      const blankPage = pdfDoc.insertPage(insertIdx, [width, height]);

      // Draw subtle dark study paper background & faint dot grid on the new blank scratch page
      const rgb = window.PDFLib.rgb;
      blankPage.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.06, 0.09, 0.14)
      });

      const updatedBytes = await pdfDoc.save();
      activePdfBytes = new Uint8Array(updatedBytes);

      // Shift per-page ink & media records for pages > activePdfPageNum up by 1 so annotations stay aligned
      for (let p = activePdfPageCount; p >= activePdfPageNum + 1; p--) {
        const oldInk = await getRecord("store_notes", `sheet_ink_${activePdfId}_p${p}`);
        if (oldInk) {
          await putRecord("store_notes", {
            ...oldInk,
            id: `sheet_ink_${activePdfId}_p${p + 1}`,
            sheetId: `${activePdfId}_p${p + 1}`
          });
          await deleteRecordFromStore("store_notes", `sheet_ink_${activePdfId}_p${p}`);
        }
        const oldMedia = await getRecord("store_notes", `sheet_media_${activePdfId}_p${p}`);
        if (oldMedia) {
          await putRecord("store_notes", {
            ...oldMedia,
            id: `sheet_media_${activePdfId}_p${p + 1}`,
            sheetId: `${activePdfId}_p${p + 1}`
          });
          await deleteRecordFromStore("store_notes", `sheet_media_${activePdfId}_p${p}`);
        }
      }

      activePdfPageCount = pdfDoc.getPageCount();
      activePdfMeta.pageCount = activePdfPageCount;

      const rec = await getRecord("store_notes", `pdf_doc_${activePdfId}`);
      if (rec) {
        rec.pdfBytes = activePdfBytes;
        rec.pageCount = activePdfPageCount;
        await putRecord("store_notes", rec);
      }
      const idxList = await getPdfLibraryIndex();
      const mIdx = idxList.findIndex(i => i.id === activePdfId);
      if (mIdx !== -1) {
        idxList[mIdx].pageCount = activePdfPageCount;
        await savePdfLibraryIndex(idxList);
      }

      if (window.pdfjsLib) {
        activePdfDocProxy = await window.pdfjsLib.getDocument({ data: activePdfBytes.slice() }).promise;
      }

      showToast(`\u2713 Inserted Blank Scratch Page at P.${insertIdx + 1}!`, "emerald");
      await renderCompStudioSheets();
      await renderActivePdfPage(insertIdx + 1);
    } catch (err) {
      console.error("Insert Blank Page Error:", err);
      showToast("Could not insert blank page: " + err.message, "rose");
    }
  }

  async function renderStrokesToPngDataUrl(strokes, widthPx = 1200, heightPx = 1600) {
    const offscreen = document.createElement("canvas");
    offscreen.width = widthPx;
    offscreen.height = heightPx;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return null;

    strokes.forEach(stroke => {
      if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) return;
      const toolType = String(stroke.tool || "pen").toLowerCase();
      if (toolType === "stroke_eraser") return;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (toolType === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = (stroke.eraserWidth || getEffectiveEraserPixelWidth(stroke.size)) * 1.3;
      } else if (toolType === "tape") {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = stroke.revealed ? 0.18 : 0.92;
        ctx.strokeStyle = stroke.color || "#38bdf8";
        ctx.lineWidth = 28;
      } else if (toolType === "marker") {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 0.36;
        ctx.strokeStyle = stroke.color || "#facc15";
        ctx.lineWidth = Math.max(18, (stroke.size || 3.0) * 7.5);
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = stroke.color || "#38bdf8";
        ctx.lineWidth = (stroke.size || 3.0) * 1.4;
      }

      const pts = stroke.points.map(pt => ({
        x: (pt.nx !== undefined ? pt.nx * widthPx : pt.x),
        y: (pt.ny !== undefined ? pt.ny * heightPx : pt.y)
      }));

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      if (pts.length === 1) {
        ctx.lineTo(pts[0].x + 0.1, pts[0].y + 0.1);
      } else {
        for (let i = 1; i < pts.length - 1; i++) {
          const midX = (pts[i].x + pts[i + 1].x) / 2;
          const midY = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
      ctx.restore();
    });

    return offscreen.toDataURL("image/png");
  }

  async function flattenAndSaveActivePdf(downloadCopy = false) {
    if (compendiumActiveDocType !== "PDF" || !activePdfId || !activePdfBytes) return;
    if (!window.PDFLib) {
      showToast("pdf-lib is still loading. Try again in a moment.", "amber");
      return;
    }

    try {
      showToast("\u23F3 Baking vector ink annotations into PDF pages...", "cyan", 2200);
      const pdfDoc = await window.PDFLib.PDFDocument.load(activePdfBytes);
      const totalPages = pdfDoc.getPageCount();
      let bakedCount = 0;

      for (let p = 1; p <= totalPages; p++) {
        const inkKey = `sheet_ink_${activePdfId}_p${p}`;
        const inkRec = await getRecord("store_notes", inkKey);
        const strokes = (inkRec && Array.isArray(inkRec.strokes)) ? inkRec.strokes : [];
        if (strokes.length === 0) continue;

        const pdfPage = pdfDoc.getPage(p - 1);
        const { width, height } = pdfPage.getSize();
        const pngDataUrl = await renderStrokesToPngDataUrl(strokes, Math.round(width * 2), Math.round(height * 2));
        if (pngDataUrl) {
          const pngImage = await pdfDoc.embedPng(pngDataUrl);
          pdfPage.drawImage(pngImage, {
            x: 0,
            y: 0,
            width,
            height
          });
          bakedCount++;
          if (!downloadCopy) {
            await putRecord("store_notes", {
              id: inkKey,
              sheetId: `${activePdfId}_p${p}`,
              strokes: [],
              timestamp: Date.now()
            });
          }
        }
      }

      const finalBytes = new Uint8Array(await pdfDoc.save());

      if (downloadCopy) {
        const safeName = `${(activePdfMeta?.title || "Annotated_Study_Sheet").replace(/[^a-zA-Z0-9_-]+/g, "_")}_Annotated.pdf`;
        await downloadFileResilient(safeName, "application/pdf", finalBytes);
        showToast(`\u2713 Downloaded Annotated PDF (${bakedCount} page${bakedCount === 1 ? "" : "s"} with ink)!`, "emerald");
      } else {
        activePdfBytes = finalBytes;
        const rec = await getRecord("store_notes", `pdf_doc_${activePdfId}`);
        if (rec) {
          rec.pdfBytes = activePdfBytes;
          await putRecord("store_notes", rec);
        }
        if (window.pdfjsLib) {
          activePdfDocProxy = await window.pdfjsLib.getDocument({ data: activePdfBytes.slice() }).promise;
        }
        activeSheetInkStrokes = [];
        await renderActivePdfPage(activePdfPageNum);
        showToast(`\u2713 Baked & Saved ${bakedCount} annotated page${bakedCount === 1 ? "" : "s"} into PDF Vault!`, "emerald");
      }
    } catch (err) {
      console.error("PDF Bake Error:", err);
      showToast("Failed to bake PDF annotations: " + err.message, "rose");
    }
  }

  async function deleteActivePdfDocument() {
    if (compendiumActiveDocType !== "PDF" || !activePdfId) return;
    const title = activePdfMeta?.title || activePdfId;
    if (!confirm(`Permanently delete PDF "${title}" and its page annotations from local storage?`)) return;

    const targetId = activePdfId;
    await deleteRecordFromStore("store_notes", `pdf_doc_${targetId}`);
    for (let p = 1; p <= (activePdfPageCount || 1); p++) {
      await deleteRecordFromStore("store_notes", `sheet_ink_${targetId}_p${p}`);
      await deleteRecordFromStore("store_notes", `sheet_media_${targetId}_p${p}`);
    }
    const idxList = (await getPdfLibraryIndex()).filter(i => i.id !== targetId);
    await savePdfLibraryIndex(idxList);

    compendiumActiveDocType = "SHEET";
    activePdfId = null;
    activePdfDocProxy = null;
    activePdfBytes = null;
    activePdfMeta = null;

    showToast(`Deleted PDF "${title}".`, "amber");
    await renderCompStudioSheets();
  }

  /* ==========================================================================
   * V9.0 LIQUIDTEXT CROP EXCERPT & MARGIN RAIL DEEP-LINK ENGINE
   * ========================================================================== */
  async function captureCropExcerptFromFolio(normRect) {
    const pageEl = document.getElementById("comp-folio-page");
    if (!pageEl || !normRect) return null;

    const outW = 560;
    const aspect = Math.max(0.25, Math.min(3.0, (normRect.h || 0.15) / Math.max(0.05, normRect.w || 0.25)));
    const outH = Math.round(outW * aspect);
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, outW, outH);

    // 1. If in PDF mode, crop directly from #comp-pdf-render-canvas + #comp-folio-ink-canvas
    const pdfCanvas = document.getElementById("comp-pdf-render-canvas");
    const inkCanvas = document.getElementById("comp-folio-ink-canvas");
    if (compendiumActiveDocType === "PDF" && pdfCanvas && pdfCanvas.width > 0) {
      const sx = Math.max(0, Math.round(normRect.x * pdfCanvas.width));
      const sy = Math.max(0, Math.round(normRect.y * pdfCanvas.height));
      const sw = Math.max(16, Math.min(pdfCanvas.width - sx, Math.round(normRect.w * pdfCanvas.width)));
      const sh = Math.max(16, Math.min(pdfCanvas.height - sy, Math.round(normRect.h * pdfCanvas.height)));
      ctx.drawImage(pdfCanvas, sx, sy, sw, sh, 0, 0, outW, outH);
    } else {
      // 2. In Markdown Sheet mode, capture visible text inside the selection box + render clean card snapshot
      const pageRect = pageEl.getBoundingClientRect();
      const boxLeft = pageRect.left + normRect.x * pageRect.width;
      const boxTop = pageRect.top + normRect.y * pageRect.height;
      const boxRight = boxLeft + normRect.w * pageRect.width;
      const boxBottom = boxTop + normRect.h * pageRect.height;

      const words = [];
      pageEl.querySelectorAll(".folio-word, h1, h2, h3, td, th, .katex").forEach(el => {
        if (el.children.length > 0 && !el.classList.contains("katex")) return;
        const r = el.getBoundingClientRect();
        if (r.right >= boxLeft && r.left <= boxRight && r.bottom >= boxTop && r.top <= boxBottom) {
          const txt = (el.innerText || el.textContent || "").trim();
          if (txt) words.push(txt);
        }
      });

      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, outW - 8, outH - 8);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 15px Inter, sans-serif";
      const activeTitle = currentCompSheets[activeCompSheetIndex]?.title || activeCompChapter || "Sheet Excerpt";
      ctx.fillText(`\uD83D\uDCD6 ${activeTitle}`, 18, 28);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "14px Inter, sans-serif";
      const fullLine = words.join(" ").slice(0, 380) || "Visual diagram / formula region excerpt";
      const tokens = fullLine.split(/\s+/);
      let line = "";
      let yCursor = 56;
      for (const tk of tokens) {
        const test = line ? `${line} ${tk}` : tk;
        if (ctx.measureText(test).width > outW - 36) {
          ctx.fillText(line, 18, yCursor);
          line = tk;
          yCursor += 22;
          if (yCursor > outH - 18) break;
        } else {
          line = test;
        }
      }
      if (line && yCursor <= outH - 12) {
        ctx.fillText(line, 18, yCursor);
      }
    }

    if (inkCanvas && inkCanvas.width > 0) {
      const ix = Math.max(0, Math.round(normRect.x * inkCanvas.width));
      const iy = Math.max(0, Math.round(normRect.y * inkCanvas.height));
      const iw = Math.max(16, Math.min(inkCanvas.width - ix, Math.round(normRect.w * inkCanvas.width)));
      const ih = Math.max(16, Math.min(inkCanvas.height - iy, Math.round(normRect.h * inkCanvas.height)));
      ctx.drawImage(inkCanvas, ix, iy, iw, ih, 0, 0, outW, outH);
    }

    return canvas.toDataURL("image/png");
  }

  function cancelStagedExcerpt() {
    stagedExcerptCrop = null;
    safeSetDisplay("comp-excerpt-action-popover", "none");
  }

  async function loadAndRenderActiveDocPinnedExcerpts(docId = null) {
    const resolvedDocId = docId || (compendiumActiveDocType === "PDF" ? activePdfId : currentCompSheets[activeCompSheetIndex]?.id);
    if (!resolvedDocId) {
      activeDocPinnedExcerpts = [];
      renderActiveDocPinnedExcerpts();
      return;
    }
    const rec = await getRecord("store_notes", `excerpts_${resolvedDocId}`);
    activeDocPinnedExcerpts = (rec && Array.isArray(rec.excerpts)) ? rec.excerpts : [];
    renderActiveDocPinnedExcerpts();
  }

  function renderActiveDocPinnedExcerpts() {
    const listEl = document.getElementById("comp-rail-excerpts-list");
    safeSetText("comp-rail-excerpt-count", `${activeDocPinnedExcerpts.length}`);
    if (!listEl) return;

    if (activeDocPinnedExcerpts.length === 0) {
      listEl.innerHTML = `<span style="font-size:11px; color:var(--text-muted);">Select <b>✂️ Excerpt</b> in the Ink bar and drag over any PDF region or formula to pin linked visual cards here.</span>`;
      return;
    }

    listEl.innerHTML = activeDocPinnedExcerpts.map(ex => `
      <div class="pinned-excerpt-card">
        <img src="${ex.dataUrl}" alt="Pinned Excerpt" onclick="CGL_OS.jumpToPinnedExcerptSource('${ex.id}')" style="cursor:pointer;" title="Tap to jump back to exact page & scroll position">
        <div class="pinned-excerpt-meta">
          <span class="badge" style="background:rgba(56,189,248,0.2); color:#38bdf8; cursor:pointer; font-size:9.5px;" onclick="CGL_OS.jumpToPinnedExcerptSource('${ex.id}')">
            \uD83D\uDD17 ${ex.docType === "PDF" ? `Page ${ex.pageNum || 1}` : "Sheet Spot"} Jump
          </span>
          <button class="btn btn-danger" style="padding:1px 6px; font-size:9.5px;" onclick="CGL_OS.deletePinnedExcerpt('${ex.id}')">\u2715</button>
        </div>
      </div>
    `).join("");
  }

  async function pinStagedExcerptToMarginRail() {
    if (!stagedExcerptCrop || !stagedExcerptCrop.dataUrl) return;
    const docId = stagedExcerptCrop.docId;
    if (!docId) return;

    const item = {
      id: "exc_" + Date.now(),
      dataUrl: stagedExcerptCrop.dataUrl,
      docType: stagedExcerptCrop.docType,
      docId: docId,
      pageNum: stagedExcerptCrop.pageNum || 1,
      scrollTop: stagedExcerptCrop.scrollTop || 0,
      timestamp: Date.now()
    };

    activeDocPinnedExcerpts.unshift(item);
    await putRecord("store_notes", {
      id: `excerpts_${docId}`,
      docId,
      excerpts: activeDocPinnedExcerpts,
      timestamp: Date.now()
    });
    cancelStagedExcerpt();
    renderActiveDocPinnedExcerpts();
    showToast("\uD83D\uDCCC Excerpt pinned to Margin Rail with deep-link!", "emerald");
  }

  async function jumpToPinnedExcerptSource(excerptId) {
    const ex = activeDocPinnedExcerpts.find(item => item.id === excerptId);
    if (!ex) return;

    if (ex.docType === "PDF" && ex.docId) {
      if (activePdfId !== ex.docId || compendiumActiveDocType !== "PDF") {
        await openPdfInCompendiumStudio(ex.docId, ex.pageNum || 1);
      } else if (activePdfPageNum !== ex.pageNum) {
        await renderActivePdfPage(ex.pageNum || 1);
      }
    }
    const sc = document.getElementById("comp-studio-canvas");
    if (sc && typeof ex.scrollTop === "number") {
      sc.scrollTo({ top: ex.scrollTop, behavior: "smooth" });
    }
    showToast(`\uD83D\uDD17 Jumped to ${ex.docType === "PDF" ? `Page ${ex.pageNum}` : "Sheet Spot"}`, "cyan", 1600);
  }

  async function deletePinnedExcerpt(excerptId) {
    const docId = compendiumActiveDocType === "PDF" ? activePdfId : currentCompSheets[activeCompSheetIndex]?.id;
    if (!docId) return;
    activeDocPinnedExcerpts = activeDocPinnedExcerpts.filter(item => item.id !== excerptId);
    await putRecord("store_notes", {
      id: `excerpts_${docId}`,
      docId,
      excerpts: activeDocPinnedExcerpts,
      timestamp: Date.now()
    });
    renderActiveDocPinnedExcerpts();
  }

  async function extractStagedExcerptToQuestionCreator() {
    if (!stagedExcerptCrop || !stagedExcerptCrop.dataUrl) return;
    const cropDataUrl = stagedExcerptCrop.dataUrl;
    const sub = activeCompSubject || "QA";
    const chap = activeCompChapter || "QA_PERCENTAGE";
    const sourceLabel = compendiumActiveDocType === "PDF" && activePdfMeta
      ? `${activePdfMeta.title} (P.${stagedExcerptCrop.pageNum || 1})`
      : (currentCompSheets[activeCompSheetIndex]?.title || "Compendium Excerpt");

    cancelStagedExcerpt();
    closeCompendiumStudio();

    await openNewQuestionCreatorModal();
    currentQuestionImageBase64 = cropDataUrl;
    const prevBox = document.getElementById("new-q-img-preview-box");
    if (prevBox) {
      prevBox.style.display = "block";
      prevBox.innerHTML = `<img src="${cropDataUrl}" style="max-height:140px; border-radius:8px; border:1px solid var(--border-color);">`;
    }
    safeSetValue("new-q-subject", sub);
    await syncNewQuestionChapterSelect(sub, chap);
    safeSetValue("new-q-source", sourceLabel);
    showToast("\u26A1 Excerpt attached to Question Creator!", "purple");
  }

  function toggleCompSheetSwitcherDrawer(forceState = null) {
    if (forceState && typeof forceState === "object") {
      if (forceState.stopPropagation) forceState.stopPropagation();
      forceState = null;
    }
    const drawer = document.getElementById("comp-sheet-switcher-drawer");
    const dockBtn = document.getElementById("btn-dock-sheets") || document.getElementById("dock-btn-sheets");
    if (!drawer) return;
    const nextState = typeof forceState === "boolean" ? forceState : !drawer.classList.contains("open");
    drawer.classList.toggle("open", nextState);
    if (dockBtn) dockBtn.classList.toggle("active", nextState);
    if (nextState) {
      document.getElementById("comp-zen-header")?.classList.remove("comp-zen-header-hidden");
    }
  }

  function toggleCompHighlightPopover(forceState = null) {
    if (forceState && typeof forceState === "object") {
      if (forceState.stopPropagation) forceState.stopPropagation();
      forceState = null;
    }
    const strip = document.getElementById("comp-dock-hl-swatches") || document.getElementById("dock-hl-color-strip");
    if (strip) {
      const nextState = typeof forceState === "boolean" ? forceState : !compendiumHighlightMode;
      toggleCompendiumHighlightMode(nextState);
      return;
    }
    const pop = document.getElementById("comp-dock-highlight-popover");
    if (!pop) return;
    const nextState = typeof forceState === "boolean" ? forceState : !pop.classList.contains("open");
    pop.classList.toggle("open", nextState);
    if (nextState && !compendiumHighlightMode) {
      toggleCompendiumHighlightMode(true);
    }
  }

  function toggleCompStudioMoreMenu(forceState = null) {
    if (forceState && typeof forceState === "object") {
      if (forceState.stopPropagation) forceState.stopPropagation();
      forceState = null;
    }
    const pop = document.getElementById("comp-more-popover") || document.getElementById("comp-dock-more-popover");
    if (!pop) return;
    const isCurrentlyOpen = pop.classList.contains("open") || pop.style.display === "block";
    const nextState = typeof forceState === "boolean" ? forceState : !isCurrentlyOpen;
    pop.classList.toggle("open", nextState);
    pop.style.display = nextState ? "block" : "none";
  }

  function toggleCompMorePopover(forceState = null) {
    toggleCompStudioMoreMenu(forceState);
  }

  function closeCompMorePopover() {
    toggleCompStudioMoreMenu(false);
  }

  async function setCompendiumPaperPreset(mode = "FOLLOW_GLOBAL", saveOverride = true) {
    const raw = String(mode || "FOLLOW_GLOBAL").trim().toUpperCase();
    compendiumPaperPreset = raw;

    const fsView = document.getElementById("compendium-fullscreen-view");
    const folio = document.getElementById("comp-folio-page") || document.getElementById("comp-studio-folio");
    const globalTheme = document.documentElement?.getAttribute("data-theme") || "midnight";

    let effectiveSurface = raw;
    if (raw === "FOLLOW_GLOBAL" || raw === "GLOBAL") {
      effectiveSurface = globalTheme === "charcoal" ? "CHARCOAL" : "OBSIDIAN";
    }

    const surfaceLower = effectiveSurface.toLowerCase(); // 'obsidian' | 'charcoal' | 'sepia'
    compendiumReadingSurface = surfaceLower;
    if (fsView) {
      fsView.classList.remove("folio-preset-obsidian", "folio-preset-charcoal", "folio-preset-sepia");
      fsView.classList.add(`folio-preset-${surfaceLower}`);
    }
    if (folio) {
      folio.setAttribute("data-paper-preset", effectiveSurface);
      folio.classList.remove("folio-preset-obsidian", "folio-preset-charcoal", "folio-preset-sepia");
      folio.classList.add(`folio-preset-${surfaceLower}`);
    }

    const btnGroups = {
      obsidian: [
        document.getElementById("btn-surface-obsidian"),
        document.getElementById("preset-btn-obsidian"),
        document.getElementById("preset-chip-OBSIDIAN")
      ],
      charcoal: [
        document.getElementById("btn-surface-charcoal"),
        document.getElementById("preset-btn-charcoal"),
        document.getElementById("preset-chip-CHARCOAL")
      ],
      sepia: [
        document.getElementById("btn-surface-sepia"),
        document.getElementById("preset-btn-sepia"),
        document.getElementById("preset-chip-SEPIA")
      ]
    };
    Object.keys(btnGroups).forEach(k => {
      btnGroups[k].forEach(el => {
        if (el) el.classList.toggle("active", k === surfaceLower);
      });
    });

    if (saveOverride && currentCompSheets[activeCompSheetIndex]) {
      const sheet = currentCompSheets[activeCompSheetIndex];
      await putRecord("store_notes", {
        id: `paper_preset_${sheet.id}`,
        preset: effectiveSurface,
        timestamp: Date.now()
      });
    }
  }

  async function setCompendiumReadingSurface(surface = "obsidian") {
    await setCompendiumPaperPreset(String(surface || "obsidian").toUpperCase(), true);
  }

  function updateRecallProgressCounter() {
    const canvas = document.getElementById("comp-studio-canvas");
    const progText = document.getElementById("comp-recall-progress-text");
    if (!canvas || !progText) return;
    const selector = compendiumAutoBlurAll
      ? ".user-recall-mask, #comp-studio-doc-body strong, #comp-studio-doc-body .katex-display, #comp-studio-doc-body td"
      : ".user-recall-mask";
    const allTargets = compendiumActiveDocType === "PDF" ? [] : Array.from(canvas.querySelectorAll(selector));
    const revealedDomCount = allTargets.filter(el => el.classList.contains("recall-revealed")).length;

    const tapeStrokes = Array.isArray(activeSheetInkStrokes)
      ? activeSheetInkStrokes.filter(s => s && String(s.tool || "").toLowerCase() === "tape")
      : [];
    const revealedTapeCount = tapeStrokes.filter(s => !!s.revealed).length;

    const totalMasks = allTargets.length + tapeStrokes.length;
    const totalRevealed = revealedDomCount + revealedTapeCount;
    progText.innerText = `\uD83D\uDE48 Recalled: ${totalRevealed} / ${totalMasks} Masks${tapeStrokes.length > 0 ? ` (${tapeStrokes.length} Tape)` : ""}`;
  }

  function revealNextCompendiumMask() {
    if (!compendiumRecallMode) toggleCompendiumRecallMode(true);
    const canvas = document.getElementById("comp-studio-canvas");
    if (!canvas) return;
    const selector = compendiumAutoBlurAll
      ? ".user-recall-mask, #comp-studio-doc-body strong, #comp-studio-doc-body .katex-display, #comp-studio-doc-body td"
      : ".user-recall-mask";
    const nextUnrevealed = Array.from(canvas.querySelectorAll(selector)).find(el => !el.classList.contains("recall-revealed"));
    if (nextUnrevealed) {
      nextUnrevealed.classList.add("recall-revealed");
      nextUnrevealed.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (Array.isArray(activeSheetInkStrokes)) {
      const nextTape = activeSheetInkStrokes.find(s => s && String(s.tool || "").toLowerCase() === "tape" && !s.revealed);
      if (nextTape) {
        nextTape.revealed = true;
        redrawSheetInkCanvas();
      }
    }
    updateRecallProgressCounter();
  }

  function resetCompendiumRevealedMasks() {
    const canvas = document.getElementById("comp-studio-canvas");
    if (canvas) {
      canvas.querySelectorAll(".recall-revealed").forEach(el => el.classList.remove("recall-revealed"));
    }
    if (Array.isArray(activeSheetInkStrokes)) {
      activeSheetInkStrokes.forEach(s => {
        if (s && String(s.tool || "").toLowerCase() === "tape") s.revealed = false;
      });
      redrawSheetInkCanvas();
    }
    updateRecallProgressCounter();
  }

  function toggleCompendiumRecallMode(forceState = null) {
    if (forceState && typeof forceState === "object") forceState = null;
    compendiumRecallMode = typeof forceState === "boolean" ? forceState : !compendiumRecallMode;
    if (compendiumRecallMode) {
      if (compendiumMaskEditMode) toggleCompendiumMaskEditMode(false);
      if (compendiumHighlightMode) toggleCompendiumHighlightMode(false);
      if (compSheetInkMode) toggleCompSheetInkMode(false);
    }

    const canvas = document.getElementById("comp-studio-canvas");
    const btn = document.getElementById("btn-comp-recall-mode");
    const lbl = document.getElementById("lbl-comp-recall-mode");
    const dockBtn = document.getElementById("dock-btn-recall");
    const dockLbl = document.getElementById("dock-recall-label");
    const progBar = document.getElementById("comp-recall-progress-bar");
    const autoBlurBtn = document.getElementById("btn-comp-auto-blur-all");

    if (canvas) {
      canvas.classList.toggle("recall-mode-active", compendiumRecallMode);
      if (!compendiumRecallMode) {
        canvas.querySelectorAll(".recall-revealed").forEach(el => el.classList.remove("recall-revealed"));
      }
    }
    if (btn) {
      btn.classList.toggle("active", compendiumRecallMode);
      if (!lbl) {
        btn.innerText = compendiumRecallMode ? "\uD83D\uDC41\uFE0F Recall ON" : "\uD83D\uDE48 Recall Mode";
      }
    }
    if (lbl) {
      lbl.innerText = compendiumRecallMode ? "Recall ON" : "Recall";
    }
    if (dockBtn) {
      dockBtn.classList.toggle("active", compendiumRecallMode);
    }
    if (dockLbl) {
      dockLbl.innerText = compendiumRecallMode ? "Recall ON" : "Recall";
    }
    if (progBar) {
      progBar.style.display = compendiumRecallMode ? "flex" : "none";
    }
    if (autoBlurBtn) {
      autoBlurBtn.style.display = compendiumRecallMode ? "inline-flex" : "none";
    }
    if (compendiumRecallMode) {
      updateRecallProgressCounter();
    }
  }

  function toggleCompendiumAutoBlurAll() {
    compendiumAutoBlurAll = !compendiumAutoBlurAll;
    const canvas = document.getElementById("comp-studio-canvas");
    const btn = document.getElementById("btn-comp-auto-blur-all");
    if (canvas) {
      canvas.classList.toggle("recall-auto-blur-all", compendiumAutoBlurAll);
    }
    if (btn) {
      btn.classList.toggle("btn-cyan", compendiumAutoBlurAll);
      btn.innerText = compendiumAutoBlurAll ? "\u2713 Auto-Blur ON" : "+Auto-Blur All";
    }
    updateRecallProgressCounter();
  }

  function toggleCompendiumMaskEditMode(forceState = null) {
    if (forceState && typeof forceState === "object") forceState = null;
    compendiumMaskEditMode = typeof forceState === "boolean" ? forceState : !compendiumMaskEditMode;
    if (compendiumMaskEditMode) {
      if (compendiumRecallMode) toggleCompendiumRecallMode(false);
      if (compendiumHighlightMode) toggleCompendiumHighlightMode(false);
      if (compSheetInkMode) toggleCompSheetInkMode(false);
    }
    const canvas = document.getElementById("comp-studio-canvas");
    const btn = document.getElementById("btn-comp-edit-masks");
    const lbl = document.getElementById("lbl-comp-edit-masks");
    const dockBtn = document.getElementById("dock-btn-mask");
    const dockLbl = document.getElementById("dock-mask-label");
    if (canvas) {
      canvas.classList.toggle("mask-edit-mode-active", compendiumMaskEditMode);
    }
    if (btn) {
      btn.classList.toggle("btn-amber", compendiumMaskEditMode);
      btn.classList.toggle("active-amber", compendiumMaskEditMode);
      btn.classList.toggle("active", compendiumMaskEditMode);
      if (!lbl) {
        btn.innerText = compendiumMaskEditMode ? "\u2713 Done Masking" : "\uD83D\uDD8C\uFE0F Edit Masks";
      }
    }
    if (lbl) {
      lbl.innerText = compendiumMaskEditMode ? "Mask ON" : "Mask";
    }
    if (dockBtn) {
      dockBtn.classList.toggle("active-amber", compendiumMaskEditMode);
      dockBtn.classList.toggle("active", compendiumMaskEditMode);
    }
    if (dockLbl) {
      dockLbl.innerText = compendiumMaskEditMode ? "Mask ON" : "Mask";
    }
  }

  function toggleCompendiumHighlightMode(forceState = null) {
    if (forceState && typeof forceState === "object") forceState = null;
    compendiumHighlightMode = typeof forceState === "boolean" ? forceState : !compendiumHighlightMode;
    if (compendiumHighlightMode) {
      if (compendiumRecallMode) toggleCompendiumRecallMode(false);
      if (compendiumMaskEditMode) toggleCompendiumMaskEditMode(false);
      if (compSheetInkMode) toggleCompSheetInkMode(false);
      if (!compendiumActiveHighlightColor) compendiumActiveHighlightColor = "yellow";
    } else {
      document.getElementById("comp-dock-highlight-popover")?.classList.remove("open");
    }

    const canvas = document.getElementById("comp-studio-canvas");
    const btn = document.getElementById("btn-comp-highlight-mode");
    const lbl = document.getElementById("lbl-comp-highlight-mode");
    const dockBtn = document.getElementById("dock-btn-highlight");
    const dockLbl = document.getElementById("dock-hl-label");
    const colorStrip = document.getElementById("dock-hl-color-strip");

    if (canvas) {
      canvas.classList.toggle("highlight-edit-mode-active", compendiumHighlightMode);
      canvas.classList.toggle("highlight-mode-active", compendiumHighlightMode);
      canvas.setAttribute("data-active-hl", compendiumActiveHighlightColor || "yellow");
    }
    if (btn) {
      btn.classList.toggle("active", compendiumHighlightMode);
    }
    if (lbl) {
      lbl.innerText = compendiumHighlightMode ? "Highlight ON" : "Highlight";
    }
    if (dockBtn) {
      dockBtn.classList.toggle("active", compendiumHighlightMode);
    }
    if (dockLbl) {
      dockLbl.innerText = compendiumHighlightMode ? "Highlight ON" : "Highlight";
    }
    if (colorStrip) {
      colorStrip.style.display = compendiumHighlightMode ? "inline-flex" : "none";
    }
  }

  function setCompendiumHighlightColor(color, btnEl = null) {
    const normMap = {
      yellow: "yellow",
      amber: "yellow",
      green: "green",
      emerald: "green",
      cyan: "cyan",
      blue: "cyan",
      pink: "pink",
      rose: "pink",
      red: "pink",
      purple: "purple"
    };
    const raw = String(color || "yellow").toLowerCase();
    compendiumActiveHighlightColor = normMap[raw] || "yellow";
    compendiumHighlightColor = compendiumActiveHighlightColor;

    const dotMap = {
      yellow: "hl-dot-yellow",
      green: "hl-dot-green",
      pink: "hl-dot-pink",
      purple: "hl-dot-purple"
    };
    Object.keys(dotMap).forEach(k => {
      const dotEl = document.getElementById(dotMap[k]);
      if (dotEl) dotEl.classList.toggle("active", k === compendiumActiveHighlightColor);
    });

    document.querySelectorAll("#comp-dock-hl-swatches .hl-dock-dot").forEach(el => {
      const attr = String(el.getAttribute("data-hlcolor") || "").toLowerCase();
      const mapped = normMap[attr] || attr;
      el.classList.toggle("active", el === btnEl || mapped === compendiumActiveHighlightColor);
    });

    const canvas = document.getElementById("comp-studio-canvas");
    if (canvas) {
      canvas.setAttribute("data-active-hl", compendiumActiveHighlightColor);
    }

    if (!compendiumHighlightMode) {
      toggleCompendiumHighlightMode(true);
    }
  }

  /**
   * GOODNOTES / LIQUIDTEXT PAGE-ANCHORED STYLUS INK ENGINE (V9.0)
   * Vector handwriting strokes are stored in normalized page coordinates (0..1)
   * inside `store_notes` (`sheet_ink_${sheetId}` or `sheet_ink_${pdfId}_p${pageNum}`).
   * Supports:
   *  - 🖊️ Pen (S / M / L) + 350ms Hold-to-Snap Geometric Shapes
   *  - 🖍️ Marker (Chisel Highlighter) + 350ms Hold-to-Snap
   *  - 🩹 Tape (GoodNotes Recall Tape — 22px occlusion ribbon, tap-to-reveal)
   *  - 🪢 Lasso (Select & translate ink strokes across the page)
   *  - ✂️ Excerpt (LiquidText rectangle crop -> Pin to Margin Rail or Extract to Question Creator)
   *  - 🧽 Stroke Eraser & 🧼 Wide Area Pixel Eraser
   *  - 2-Finger Natural Scroll while in Finger-Draw Mode
   */
  let lastClearedSheetInkBackup = null;
  let sheetInkUndoStack = [];
  let activeEraserCursorPreview = null; // { nx, ny, radiusPx }

  function pushSheetInkUndoSnapshot() {
    if (!Array.isArray(activeSheetInkStrokes)) return;
    const cloned = activeSheetInkStrokes.map(s => ({
      ...s,
      points: Array.isArray(s.points) ? s.points.map(pt => ({ ...pt })) : []
    }));
    sheetInkUndoStack.push(cloned);
    if (sheetInkUndoStack.length > 30) {
      sheetInkUndoStack.shift();
    }
  }

  function syncSheetInkCanvasGeometry() {
    const pageEl = document.getElementById("comp-folio-page");
    const inkCanvas = document.getElementById("comp-folio-ink-canvas");
    if (!pageEl || !inkCanvas) return;

    const prevStyleH = inkCanvas.style.height;
    inkCanvas.style.height = "0px";
    const w = Math.max(pageEl.scrollWidth, pageEl.clientWidth, 320);
    const h = Math.max(pageEl.scrollHeight, pageEl.clientHeight, 480);
    inkCanvas.style.height = prevStyleH;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);

    if (inkCanvas.width !== targetW || inkCanvas.height !== targetH || inkCanvas.style.height !== `${h}px`) {
      inkCanvas.width = targetW;
      inkCanvas.height = targetH;
      inkCanvas.style.width = `${w}px`;
      inkCanvas.style.height = `${h}px`;
    }
    redrawSheetInkCanvas();
  }

  function getEffectiveEraserPixelWidth(sizeVal) {
    const s = Number(sizeVal) || 3.0;
    if (s <= 2.0) return 38;
    if (s <= 3.5) return 68;
    if (s <= 6.0) return 104;
    return 148;
  }

  function redrawSheetInkCanvas() {
    const inkCanvas = document.getElementById("comp-folio-ink-canvas");
    if (!inkCanvas) return;
    const ctx = inkCanvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = Math.max(inkCanvas.width / dpr, 1);
    const h = Math.max(inkCanvas.height / dpr, 1);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
    ctx.scale(dpr, dpr);

    const drawSingleStroke = (stroke) => {
      if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) return;
      const toolType = String(stroke.tool || "pen").toLowerCase();
      if (toolType === "stroke_eraser") return;

      const pts = stroke.points.map(pt => ({
        x: (pt.nx !== undefined ? pt.nx * w : pt.x),
        y: (pt.ny !== undefined ? pt.ny * h : pt.y)
      }));

      ctx.save();
      if (toolType === "lasso") {
        ctx.globalCompositeOperation = "source-over";
        ctx.setLineDash([6, 5]);
        ctx.lineWidth = 2.0;
        ctx.strokeStyle = "#38bdf8";
        ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        return;
      }

      if (toolType === "excerpt") {
        const p0 = pts[0];
        const pLast = pts[pts.length - 1];
        const rx = Math.min(p0.x, pLast.x);
        const ry = Math.min(p0.y, pLast.y);
        const rw = Math.abs(pLast.x - p0.x);
        const rh = Math.abs(pLast.y - p0.y);
        ctx.globalCompositeOperation = "source-over";
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = "#a855f7";
        ctx.fillStyle = "rgba(168, 85, 247, 0.14)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.restore();
        return;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (toolType === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = stroke.eraserWidth || getEffectiveEraserPixelWidth(stroke.size);
      } else if (toolType === "tape") {
        ctx.globalCompositeOperation = "source-over";
        ctx.lineCap = "butt";
        ctx.globalAlpha = stroke.revealed ? 0.14 : 0.95;
        ctx.strokeStyle = stroke.color === "#38bdf8" ? "#1e293b" : (stroke.color || "#1e293b");
        ctx.lineWidth = 22;
      } else if (toolType === "marker") {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 0.36;
        ctx.strokeStyle = stroke.color || "#facc15";
        ctx.lineWidth = Math.max(16, (stroke.size || 3.0) * 6.8);
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = stroke.color || "#38bdf8";
        ctx.lineWidth = stroke.size || 3.0;
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      if (pts.length === 1) {
        ctx.lineTo(pts[0].x + 0.1, pts[0].y + 0.1);
      } else {
        for (let i = 1; i < pts.length - 1; i++) {
          const midX = (pts[i].x + pts[i + 1].x) / 2;
          const midY = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();

      // Subtle cyan dashed border around GoodNotes Recall Tape so user sees it clearly
      if (toolType === "tape") {
        ctx.save();
        ctx.globalAlpha = stroke.revealed ? 0.45 : 0.85;
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#38bdf8";
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    };

    if (Array.isArray(activeSheetInkStrokes)) {
      activeSheetInkStrokes.forEach(drawSingleStroke);
    }
    if (currentSheetInkStroke) {
      drawSingleStroke(currentSheetInkStroke);
    }

    // Draw Lasso Bounding Box if active
    if (lassoSelectionBox && lassoSelectedStrokeIndices.length > 0) {
      const bx = lassoSelectionBox.minNx * w - 6;
      const by = lassoSelectionBox.minNy * h - 6;
      const bw = (lassoSelectionBox.maxNx - lassoSelectionBox.minNx) * w + 12;
      const bh = (lassoSelectionBox.maxNy - lassoSelectionBox.minNy) * h + 12;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#38bdf8";
      ctx.fillStyle = "rgba(56, 189, 248, 0.09)";
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.restore();
    }

    // Draw live circular Eraser cursor indicator when erasing
    if (activeEraserCursorPreview && isDrawingSheetInk) {
      const ex = activeEraserCursorPreview.nx * w;
      const ey = activeEraserCursorPreview.ny * h;
      const r = activeEraserCursorPreview.radiusPx || 32;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.arc(ex, ey, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244, 63, 94, 0.16)";
      ctx.fill();
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = "rgba(251, 113, 133, 0.92)";
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  function distToSegmentSq(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return (px - x1) * (px - x1) + (py - y1) * (py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * (x2 - x1);
    const projY = y1 + t * (y2 - y1);
    return (px - projX) * (px - projX) + (py - projY) * (py - projY);
  }

  function findHitRecallTapeStrokeAtNormPoint(normPt) {
    const inkCanvas = document.getElementById("comp-folio-ink-canvas");
    if (!inkCanvas || !Array.isArray(activeSheetInkStrokes)) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = Math.max(inkCanvas.width / dpr, 1);
    const h = Math.max(inkCanvas.height / dpr, 1);
    const px = normPt.nx * w;
    const py = normPt.ny * h;
    const hitSq = 18 * 18;

    for (let sIdx = activeSheetInkStrokes.length - 1; sIdx >= 0; sIdx--) {
      const st = activeSheetInkStrokes[sIdx];
      if (!st || String(st.tool || "").toLowerCase() !== "tape" || !Array.isArray(st.points)) continue;
      const pts = st.points.map(pt => ({
        x: pt.nx !== undefined ? pt.nx * w : pt.x,
        y: pt.ny !== undefined ? pt.ny * h : pt.y
      }));
      if (pts.length === 1) {
        if ((px - pts[0].x) ** 2 + (py - pts[0].y) ** 2 <= hitSq) return st;
      } else {
        for (let i = 0; i < pts.length - 1; i++) {
          if (distToSegmentSq(px, py, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y) <= hitSq) {
            return st;
          }
        }
      }
    }
    return null;
  }

  function eraseWholeStrokesAlongSegment(prevNormPt, currNormPt, hitRadiusPx = 28) {
    const inkCanvas = document.getElementById("comp-folio-ink-canvas");
    if (!inkCanvas || !Array.isArray(activeSheetInkStrokes) || activeSheetInkStrokes.length === 0) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = Math.max(inkCanvas.width / dpr, 1);
    const h = Math.max(inkCanvas.height / dpr, 1);

    const p0x = (prevNormPt ? prevNormPt.nx : currNormPt.nx) * w;
    const p0y = (prevNormPt ? prevNormPt.ny : currNormPt.ny) * h;
    const p1x = currNormPt.nx * w;
    const p1y = currNormPt.ny * h;
    const moveDist = Math.hypot(p1x - p0x, p1y - p0y);
    const steps = Math.max(1, Math.ceil(moveDist / 6));

    const samplePoints = [];
    for (let s = 0; s <= steps; s++) {
      const frac = s / steps;
      samplePoints.push({
        x: p0x + (p1x - p0x) * frac,
        y: p0y + (p1y - p0y) * frac
      });
    }

    let removedAny = false;
    activeSheetInkStrokes = activeSheetInkStrokes.filter(stroke => {
      if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) return false;
      const tType = String(stroke.tool || "pen").toLowerCase();
      if (tType === "eraser") return true;
      const strokeHalfW = tType === "marker" || tType === "tape"
        ? Math.max(16, (stroke.size || 3.0) * 6.8) / 2
        : (stroke.size || 3.0) / 2;
      const thresholdSq = (hitRadiusPx + strokeHalfW) * (hitRadiusPx + strokeHalfW);

      const pts = stroke.points.map(pt => ({
        x: pt.nx !== undefined ? pt.nx * w : pt.x,
        y: pt.ny !== undefined ? pt.ny * h : pt.y
      }));

      for (const sp of samplePoints) {
        if (pts.length === 1) {
          const dSq = (sp.x - pts[0].x) * (sp.x - pts[0].x) + (sp.y - pts[0].y) * (sp.y - pts[0].y);
          if (dSq <= thresholdSq) {
            removedAny = true;
            return false;
          }
        } else {
          for (let i = 0; i < pts.length - 1; i++) {
            if (distToSegmentSq(sp.x, sp.y, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y) <= thresholdSq) {
              removedAny = true;
              return false;
            }
          }
        }
      }
      return true;
    });

    if (removedAny && !activeSheetInkStrokes.some(s => s && String(s.tool || "pen").toLowerCase() !== "eraser")) {
      activeSheetInkStrokes = [];
    }

    return removedAny;
  }

  async function saveActiveSheetInkStrokes() {
    if (compendiumActiveDocType === "PDF" && activePdfId) {
      const inkKey = `sheet_ink_${activePdfId}_p${activePdfPageNum || 1}`;
      await putRecord("store_notes", {
        id: inkKey,
        sheetId: `${activePdfId}_p${activePdfPageNum || 1}`,
        strokes: activeSheetInkStrokes,
        timestamp: Date.now()
      });
      updateCompMaskAndHighlightBadge();
      updateRecallProgressCounter();
      return;
    }
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet) return;
    await putRecord("store_notes", {
      id: `sheet_ink_${sheet.id}`,
      sheetId: sheet.id,
      strokes: activeSheetInkStrokes,
      timestamp: Date.now()
    });
    updateCompMaskAndHighlightBadge();
    updateRecallProgressCounter();
  }

  function syncSheetInkPointerPassthrough() {
    const inkCanvas = document.getElementById("comp-folio-ink-canvas");
    const pageEl = document.getElementById("comp-folio-page");
    if (!inkCanvas) return;
    if (!compSheetInkMode) {
      inkCanvas.style.pointerEvents = "none";
      inkCanvas.style.touchAction = "auto";
      if (pageEl) {
        pageEl.classList.remove("stylus-only-scroll");
        pageEl.style.touchAction = "";
      }
      return;
    }
    if (compSheetInkFingerDraw) {
      inkCanvas.style.pointerEvents = "auto";
      inkCanvas.style.touchAction = "none";
      if (pageEl) {
        pageEl.classList.remove("stylus-only-scroll");
        pageEl.style.touchAction = "";
      }
    } else {
      inkCanvas.style.pointerEvents = "none";
      inkCanvas.style.touchAction = "pan-y pinch-zoom";
      if (pageEl) {
        pageEl.classList.add("stylus-only-scroll");
        pageEl.style.touchAction = "pan-y pinch-zoom";
      }
    }
  }

  function toggleCompSheetInkMode(forceState = null) {
    if (forceState && typeof forceState === "object") forceState = null;
    compSheetInkMode = typeof forceState === "boolean" ? forceState : !compSheetInkMode;
    if (compSheetInkMode) {
      if (compendiumRecallMode) toggleCompendiumRecallMode(false);
      if (compendiumMaskEditMode) toggleCompendiumMaskEditMode(false);
      if (compendiumHighlightMode) toggleCompendiumHighlightMode(false);
    } else {
      isDrawingSheetInk = false;
      currentSheetInkStroke = null;
      activeEraserCursorPreview = null;
      lassoSelectionBox = null;
      lassoSelectedStrokeIndices = [];
    }

    const pageEl = document.getElementById("comp-folio-page");
    const toolbarEl = document.getElementById("comp-folio-ink-toolbar");
    const dockBtn = document.getElementById("btn-dock-folio-ink") || document.getElementById("dock-btn-ink");
    const dockLbl = document.getElementById("lbl-dock-folio-ink") || document.getElementById("dock-ink-label");
    const zenBtn = document.getElementById("btn-comp-folio-ink") || document.getElementById("btn-zen-sheet-ink");

    if (pageEl) pageEl.classList.toggle("sheet-ink-mode-active", compSheetInkMode);
    syncSheetInkPointerPassthrough();
    if (toolbarEl) toolbarEl.style.display = compSheetInkMode ? "flex" : "none";
    if (dockBtn) dockBtn.classList.toggle("active", compSheetInkMode);
    if (dockLbl) dockLbl.innerText = compSheetInkMode ? "Ink ON" : "Ink";
    if (zenBtn) zenBtn.classList.toggle("active", compSheetInkMode);

    syncSheetInkCanvasGeometry();
  }

  function toggleCompendiumFolioInkMode(forceState = null) {
    toggleCompSheetInkMode(forceState);
  }

  function setCompSheetInkTool(tool = "pen") {
    const norm = String(tool || "pen").toLowerCase();
    if (norm === "stroke_eraser") compSheetInkTool = "stroke_eraser";
    else if (norm === "eraser") compSheetInkTool = "eraser";
    else if (norm === "marker") compSheetInkTool = "marker";
    else if (norm === "tape") compSheetInkTool = "tape";
    else if (norm === "lasso") compSheetInkTool = "lasso";
    else if (norm === "excerpt") compSheetInkTool = "excerpt";
    else compSheetInkTool = "pen";

    if (compSheetInkTool !== "lasso") {
      lassoSelectionBox = null;
      lassoSelectedStrokeIndices = [];
      redrawSheetInkCanvas();
    }

    const penBtn = document.getElementById("btn-folio-pen") || document.getElementById("ink-tool-pen");
    const markerBtn = document.getElementById("btn-folio-marker");
    const tapeBtn = document.getElementById("btn-folio-tape");
    const lassoBtn = document.getElementById("btn-folio-lasso");
    const excerptBtn = document.getElementById("btn-folio-excerpt");
    const strokeEraserBtn = document.getElementById("btn-folio-stroke-eraser");
    const eraserBtn = document.getElementById("btn-folio-eraser") || document.getElementById("ink-tool-eraser");

    const syncBtn = (btn, isActive) => {
      if (!btn) return;
      btn.classList.toggle("active", isActive);
      btn.classList.toggle("btn-cyan", isActive);
      btn.classList.toggle("btn-secondary", !isActive);
    };

    syncBtn(penBtn, compSheetInkTool === "pen");
    syncBtn(markerBtn, compSheetInkTool === "marker");
    syncBtn(tapeBtn, compSheetInkTool === "tape");
    syncBtn(lassoBtn, compSheetInkTool === "lasso");
    syncBtn(excerptBtn, compSheetInkTool === "excerpt");
    syncBtn(strokeEraserBtn, compSheetInkTool === "stroke_eraser");
    syncBtn(eraserBtn, compSheetInkTool === "eraser");
  }

  function setCompendiumFolioInkTool(tool = "PEN") {
    setCompSheetInkTool(tool);
  }

  function setCompSheetInkColor(color = "#38bdf8", btnEl = null) {
    compSheetInkColor = color;
    if (compSheetInkTool === "eraser" || compSheetInkTool === "stroke_eraser" || compSheetInkTool === "lasso" || compSheetInkTool === "excerpt") {
      setCompSheetInkTool("pen");
    }
    document.querySelectorAll("#comp-folio-ink-toolbar .folio-ink-swatch, #comp-folio-ink-toolbar .ink-swatch").forEach(el => {
      const attr = el.getAttribute("data-inkcolor") || el.getAttribute("data-ink-color");
      el.classList.toggle("active", el === btnEl || attr === color);
    });
  }

  function setCompendiumFolioInkColor(color = "#38bdf8", btnEl = null) {
    setCompSheetInkColor(color, btnEl);
  }

  function toggleCompendiumFolioInkFingerMode() {
    compSheetInkFingerDraw = !compSheetInkFingerDraw;
    const btn = document.getElementById("btn-folio-ink-finger-toggle");
    if (btn) {
      btn.classList.toggle("btn-emerald", compSheetInkFingerDraw);
      btn.classList.toggle("btn-secondary", !compSheetInkFingerDraw);
      btn.innerText = compSheetInkFingerDraw
        ? "\u270D\uFE0F Finger & Stylus: Write"
        : "\uD83D\uDD8A\uFE0F Stylus Only (1-Finger Scrolls)";
    }
    syncSheetInkPointerPassthrough();
  }

  function setCompSheetInkSize(size = 3.0, btnEl = null) {
    compSheetInkSize = Number(size) || 3.0;
    document.querySelectorAll("#comp-folio-ink-toolbar .ink-size-btn").forEach(el => {
      const isMatch = el === btnEl;
      el.classList.toggle("active", isMatch);
      el.classList.toggle("btn-cyan", isMatch);
      el.classList.toggle("btn-secondary", !isMatch);
    });
  }

  async function undoCompSheetInk() {
    if (sheetInkUndoStack.length > 0) {
      activeSheetInkStrokes = sheetInkUndoStack.pop();
      redrawSheetInkCanvas();
      await saveActiveSheetInkStrokes();
      return;
    }
    if ((!activeSheetInkStrokes || activeSheetInkStrokes.length === 0) && Array.isArray(lastClearedSheetInkBackup) && lastClearedSheetInkBackup.length > 0) {
      activeSheetInkStrokes = [...lastClearedSheetInkBackup];
      lastClearedSheetInkBackup = null;
      redrawSheetInkCanvas();
      await saveActiveSheetInkStrokes();
      return;
    }
    if (!activeSheetInkStrokes || activeSheetInkStrokes.length === 0) return;
    activeSheetInkStrokes.pop();
    redrawSheetInkCanvas();
    await saveActiveSheetInkStrokes();
  }

  async function undoCompendiumFolioInkStroke() {
    await undoCompSheetInk();
  }

  async function clearCompSheetInk() {
    if (Array.isArray(activeSheetInkStrokes) && activeSheetInkStrokes.length > 0) {
      pushSheetInkUndoSnapshot();
      lastClearedSheetInkBackup = [...activeSheetInkStrokes];
    }
    activeSheetInkStrokes = [];
    currentSheetInkStroke = null;
    activeEraserCursorPreview = null;
    lassoSelectionBox = null;
    lassoSelectedStrokeIndices = [];
    isDrawingSheetInk = false;
    redrawSheetInkCanvas();
    await saveActiveSheetInkStrokes();

    const sheet = currentCompSheets[activeCompSheetIndex];
    if (sheet && activeInkContextKey === `sheet_${sheet.id}`) {
      scratchpadStrokes = [];
      inkMemoryByContextKey[activeInkContextKey] = [];
      redrawScratchpad();
    }
  }

  async function clearCompendiumFolioInk() {
    await clearCompSheetInk();
  }

  function bindSheetInkCanvasEvents() {
    const inkCanvas = document.getElementById("comp-folio-ink-canvas");
    const pageEl = document.getElementById("comp-folio-page");
    if (!inkCanvas || inkCanvas.dataset.inkBound === "true") return;
    inkCanvas.dataset.inkBound = "true";

    let strokeEraserModified = false;
    let lastEraserNormPt = null;
    let holdToSnapTimer = null;
    let lastMovePixelPos = null;
    let multiTouchActive = false;

    const clearHoldToSnapTimer = () => {
      if (holdToSnapTimer) {
        clearTimeout(holdToSnapTimer);
        holdToSnapTimer = null;
      }
    };

    const getNormalizedPoint = (e) => {
      const rect = inkCanvas.getBoundingClientRect();
      const w = Math.max(rect.width, 1);
      const h = Math.max(rect.height, 1);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return {
        nx: Math.max(0, Math.min(1, x / w)),
        ny: Math.max(0, Math.min(1, y / h)),
        px: x,
        py: y,
        w,
        h
      };
    };

    const getUnderlyingInteractiveControl = (clientX, clientY) => {
      const prevPe = inkCanvas.style.pointerEvents;
      inkCanvas.style.pointerEvents = "none";
      const elUnder = document.elementFromPoint(clientX, clientY);
      inkCanvas.style.pointerEvents = prevPe;
      if (!elUnder) return null;
      return elUnder.closest("button, a, input, select, textarea, .sheet-media-card, .comp-folio-ink-toolbar, .folio-sheet-nav-footer, .folio-header-meta, .sheet-toc-pill-wrap, .comp-pdf-studio-bar, .comp-excerpt-action-popover");
    };

    // 2-Finger Natural Scroll Passthrough while in Finger-Draw Mode
    inkCanvas.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches.length >= 2) {
        multiTouchActive = true;
        clearHoldToSnapTimer();
        if (isDrawingSheetInk) {
          isDrawingSheetInk = false;
          currentSheetInkStroke = null;
          activeEraserCursorPreview = null;
          if (sheetInkUndoStack.length > 0) sheetInkUndoStack.pop();
          redrawSheetInkCanvas();
        }
        inkCanvas.style.touchAction = "pan-y pinch-zoom";
        inkCanvas.style.pointerEvents = "none";
      }
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      if (multiTouchActive && (!e.touches || e.touches.length === 0)) {
        multiTouchActive = false;
        syncSheetInkPointerPassthrough();
      }
    }, { passive: true });

    // Tap-to-Reveal GoodNotes Recall Tape when tapping on the page in Recall Mode or non-drawing tap
    if (pageEl) {
      pageEl.addEventListener("click", async (e) => {
        if (isDrawingSheetInk) return;
        if (!Array.isArray(activeSheetInkStrokes) || !activeSheetInkStrokes.some(s => s && s.tool === "tape")) return;
        const rect = inkCanvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const normPt = {
          nx: (e.clientX - rect.left) / rect.width,
          ny: (e.clientY - rect.top) / rect.height
        };
        const hitTape = findHitRecallTapeStrokeAtNormPoint(normPt);
        if (hitTape) {
          e.preventDefault();
          e.stopPropagation();
          hitTape.revealed = !hitTape.revealed;
          redrawSheetInkCanvas();
          await saveActiveSheetInkStrokes();
        }
      });
    }

    const beginInkAtEvent = (e) => {
      if (multiTouchActive) return;
      const isHardwareEraser = (e.pointerType === "pen" && (e.buttons === 32 || e.button === 5));
      const effectiveTool = isHardwareEraser ? "stroke_eraser" : compSheetInkTool;
      const pt = getNormalizedPoint(e);
      const eraserW = getEffectiveEraserPixelWidth(compSheetInkSize);

      // If tapping an existing Recall Tape ribbon with any non-eraser tool (quick tap check handled on pointerup if tiny stroke),
      // or if dragging inside active Lasso selection box:
      if (effectiveTool === "lasso" && lassoSelectionBox && lassoSelectedStrokeIndices.length > 0) {
        if (
          pt.nx >= lassoSelectionBox.minNx - 0.02 &&
          pt.nx <= lassoSelectionBox.maxNx + 0.02 &&
          pt.ny >= lassoSelectionBox.minNy - 0.02 &&
          pt.ny <= lassoSelectionBox.maxNy + 0.02
        ) {
          pushSheetInkUndoSnapshot();
          isDrawingSheetInk = true;
          isDraggingLassoSelection = true;
          lassoDragLastPt = { nx: pt.nx, ny: pt.ny };
          return;
        }
      }

      lassoSelectionBox = null;
      lassoSelectedStrokeIndices = [];
      isDraggingLassoSelection = false;

      isDrawingSheetInk = true;
      strokeEraserModified = false;
      lastEraserNormPt = { nx: pt.nx, ny: pt.ny };
      lastMovePixelPos = { x: pt.px, y: pt.py };
      clearHoldToSnapTimer();

      if (effectiveTool === "stroke_eraser") {
        const hitRadius = Math.max(20, Math.round(eraserW * 0.55));
        activeEraserCursorPreview = { nx: pt.nx, ny: pt.ny, radiusPx: hitRadius };
        currentSheetInkStroke = { tool: "stroke_eraser", points: [{ nx: pt.nx, ny: pt.ny }] };
        pushSheetInkUndoSnapshot();
        if (eraseWholeStrokesAlongSegment(pt, pt, hitRadius)) {
          strokeEraserModified = true;
        }
        redrawSheetInkCanvas();
        return;
      }

      if (effectiveTool === "lasso" || effectiveTool === "excerpt") {
        activeEraserCursorPreview = null;
        currentSheetInkStroke = {
          tool: effectiveTool,
          points: [{ nx: pt.nx, ny: pt.ny }]
        };
        redrawSheetInkCanvas();
        return;
      }

      pushSheetInkUndoSnapshot();

      if (effectiveTool === "eraser") {
        activeEraserCursorPreview = { nx: pt.nx, ny: pt.ny, radiusPx: Math.round(eraserW / 2) };
      } else {
        activeEraserCursorPreview = null;
      }

      currentSheetInkStroke = {
        tool: effectiveTool,
        color: compSheetInkColor,
        size: compSheetInkSize,
        eraserWidth: eraserW,
        revealed: false,
        snappedShape: false,
        points: [{ nx: pt.nx, ny: pt.ny }]
      };
      redrawSheetInkCanvas();
    };

    const moveInkAtEvent = (e) => {
      if (multiTouchActive || !compSheetInkMode || !isDrawingSheetInk) return;
      const pt = getNormalizedPoint(e);

      if (isDraggingLassoSelection && lassoDragLastPt && lassoSelectionBox) {
        const dnx = pt.nx - lassoDragLastPt.nx;
        const dny = pt.ny - lassoDragLastPt.ny;
        lassoDragLastPt = { nx: pt.nx, ny: pt.ny };
        lassoSelectionBox.minNx += dnx;
        lassoSelectionBox.maxNx += dnx;
        lassoSelectionBox.minNy += dny;
        lassoSelectionBox.maxNy += dny;
        lassoSelectedStrokeIndices.forEach(sIdx => {
          const st = activeSheetInkStrokes[sIdx];
          if (st && Array.isArray(st.points)) {
            st.points.forEach(p => {
              p.nx = Math.max(0, Math.min(1, p.nx + dnx));
              p.ny = Math.max(0, Math.min(1, p.ny + dny));
            });
          }
        });
        redrawSheetInkCanvas();
        return;
      }

      if (!currentSheetInkStroke) return;
      const eraserW = getEffectiveEraserPixelWidth(compSheetInkSize);

      if (currentSheetInkStroke.tool === "stroke_eraser") {
        const hitRadius = Math.max(20, Math.round(eraserW * 0.55));
        activeEraserCursorPreview = { nx: pt.nx, ny: pt.ny, radiusPx: hitRadius };
        if (eraseWholeStrokesAlongSegment(lastEraserNormPt || pt, pt, hitRadius)) {
          strokeEraserModified = true;
        }
        lastEraserNormPt = { nx: pt.nx, ny: pt.ny };
        redrawSheetInkCanvas();
        return;
      }

      if (currentSheetInkStroke.tool === "eraser") {
        activeEraserCursorPreview = { nx: pt.nx, ny: pt.ny, radiusPx: Math.round(eraserW / 2) };
      }

      currentSheetInkStroke.points.push({ nx: pt.nx, ny: pt.ny });
      redrawSheetInkCanvas();

      // 350ms Stationary Hold-to-Snap Geometric Shape Timer for PEN, MARKER, and TAPE
      const tType = currentSheetInkStroke.tool;
      if ((tType === "pen" || tType === "marker" || tType === "tape") && !currentSheetInkStroke.snappedShape) {
        const movedPx = lastMovePixelPos ? Math.hypot(pt.px - lastMovePixelPos.x, pt.py - lastMovePixelPos.y) : 99;
        if (movedPx >= 4.2) {
          lastMovePixelPos = { x: pt.px, y: pt.py };
          clearHoldToSnapTimer();
          holdToSnapTimer = setTimeout(() => {
            if (!isDrawingSheetInk || !currentSheetInkStroke || currentSheetInkStroke.snappedShape) return;
            const snappedPts = snapStrokeToGeometricShape(currentSheetInkStroke.points, pt.w, pt.h, true);
            if (snappedPts && snappedPts.length >= 2) {
              currentSheetInkStroke.points = snappedPts;
              currentSheetInkStroke.snappedShape = true;
              if (navigator.vibrate) navigator.vibrate(18);
              redrawSheetInkCanvas();
            }
          }, 350);
        }
      }
    };

    const finishStroke = async (e) => {
      clearHoldToSnapTimer();
      if (!isDrawingSheetInk) return;
      isDrawingSheetInk = false;
      activeEraserCursorPreview = null;
      lastEraserNormPt = null;
      if (e && e.pointerId !== undefined) {
        try { inkCanvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }
      if (!compSheetInkFingerDraw && pageEl) {
        pageEl.style.touchAction = "pan-y pinch-zoom";
      }

      if (isDraggingLassoSelection) {
        isDraggingLassoSelection = false;
        lassoDragLastPt = null;
        redrawSheetInkCanvas();
        await saveActiveSheetInkStrokes();
        return;
      }

      if (!currentSheetInkStroke) {
        redrawSheetInkCanvas();
        return;
      }

      // 1. Stroke Eraser
      if (currentSheetInkStroke.tool === "stroke_eraser") {
        currentSheetInkStroke = null;
        redrawSheetInkCanvas();
        if (strokeEraserModified) {
          strokeEraserModified = false;
          await saveActiveSheetInkStrokes();
        } else if (sheetInkUndoStack.length > 0) {
          sheetInkUndoStack.pop();
        }
        return;
      }

      // 2. GoodNotes Lasso Selection Completion
      if (currentSheetInkStroke.tool === "lasso") {
        const polyPts = currentSheetInkStroke.points || [];
        currentSheetInkStroke = null;
        if (polyPts.length >= 4 && Array.isArray(activeSheetInkStrokes)) {
          const selectedIndices = [];
          let minNx = 1, maxNx = 0, minNy = 1, maxNy = 0;
          activeSheetInkStrokes.forEach((st, idx) => {
            if (!st || !Array.isArray(st.points) || st.tool === "eraser") return;
            const insideCount = st.points.filter(p => pointInPolygonNormalized(p.nx, p.ny, polyPts)).length;
            if (insideCount > 0 && insideCount >= Math.min(2, Math.ceil(st.points.length * 0.25))) {
              selectedIndices.push(idx);
              st.points.forEach(p => {
                if (p.nx < minNx) minNx = p.nx;
                if (p.nx > maxNx) maxNx = p.nx;
                if (p.ny < minNy) minNy = p.ny;
                if (p.ny > maxNy) maxNy = p.ny;
              });
            }
          });
          if (selectedIndices.length > 0) {
            lassoSelectedStrokeIndices = selectedIndices;
            lassoSelectionBox = { minNx, maxNx, minNy, maxNy, polyPts };
            showToast(`\uD83E\uDEA2 Selected ${selectedIndices.length} stroke${selectedIndices.length === 1 ? "" : "s"}. Drag box to move!`, "cyan", 1900);
          }
        }
        redrawSheetInkCanvas();
        return;
      }

      // 3. LiquidText Crop Excerpt Completion
      if (currentSheetInkStroke.tool === "excerpt") {
        const pts = currentSheetInkStroke.points || [];
        currentSheetInkStroke = null;
        redrawSheetInkCanvas();
        if (pts.length >= 2) {
          const p0 = pts[0];
          const p1 = pts[pts.length - 1];
          const normRect = {
            x: Math.min(p0.nx, p1.nx),
            y: Math.min(p0.ny, p1.ny),
            w: Math.abs(p1.nx - p0.nx),
            h: Math.abs(p1.ny - p0.ny)
          };
          if (normRect.w >= 0.03 && normRect.h >= 0.02) {
            const dataUrl = await captureCropExcerptFromFolio(normRect);
            if (dataUrl) {
              const sc = document.getElementById("comp-studio-canvas");
              const docId = compendiumActiveDocType === "PDF" ? activePdfId : currentCompSheets[activeCompSheetIndex]?.id;
              stagedExcerptCrop = {
                dataUrl,
                docType: compendiumActiveDocType,
                docId,
                pageNum: compendiumActiveDocType === "PDF" ? activePdfPageNum : 1,
                scrollTop: sc ? sc.scrollTop : 0,
                normRect
              };
              const previewImg = document.getElementById("comp-excerpt-preview-img");
              if (previewImg) previewImg.src = dataUrl;
              const pop = document.getElementById("comp-excerpt-action-popover");
              const pageRect = pageEl ? pageEl.getBoundingClientRect() : { width: 700, height: 900 };
              if (pop) {
                pop.style.left = `${Math.max(16, Math.min(pageRect.width - 250, normRect.x * pageRect.width))}px`;
                pop.style.top = `${Math.max(24, (normRect.y + normRect.h) * pageRect.height + 10)}px`;
                pop.style.display = "block";
              }
            }
          }
        }
        return;
      }

      // 4. Quick-Tap on an existing Recall Tape ribbon toggles reveal!
      const pts = currentSheetInkStroke.points || [];
      if (pts.length <= 4) {
        const p0 = pts[0];
        const pLast = pts[pts.length - 1];
        const dNorm = p0 && pLast ? Math.hypot(pLast.nx - p0.nx, pLast.ny - p0.ny) : 1;
        if (dNorm < 0.012 && p0) {
          const hitTape = findHitRecallTapeStrokeAtNormPoint(p0);
          if (hitTape) {
            currentSheetInkStroke = null;
            if (sheetInkUndoStack.length > 0) sheetInkUndoStack.pop();
            hitTape.revealed = !hitTape.revealed;
            redrawSheetInkCanvas();
            await saveActiveSheetInkStrokes();
            return;
          }
        }
      }

      if (currentSheetInkStroke && currentSheetInkStroke.points.length > 0) {
        activeSheetInkStrokes.push(currentSheetInkStroke);
        currentSheetInkStroke = null;
        redrawSheetInkCanvas();
        await saveActiveSheetInkStrokes();
      } else {
        currentSheetInkStroke = null;
        redrawSheetInkCanvas();
      }
    };

    inkCanvas.addEventListener("pointerdown", (e) => {
      if (!compSheetInkMode || multiTouchActive) return;
      if (!compSheetInkFingerDraw && e.pointerType !== "pen") return;
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;

      const interactiveEl = getUnderlyingInteractiveControl(e.clientX, e.clientY);
      if (interactiveEl) {
        const clickable = interactiveEl.closest("button, a, input, select, textarea") || interactiveEl;
        if (typeof clickable.click === "function") clickable.click();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      try { inkCanvas.setPointerCapture(e.pointerId); } catch (_) {}
      beginInkAtEvent(e);
    });

    inkCanvas.addEventListener("pointermove", (e) => {
      if (!compSheetInkMode || !isDrawingSheetInk || multiTouchActive) return;
      e.preventDefault();
      e.stopPropagation();
      moveInkAtEvent(e);
    });

    inkCanvas.addEventListener("pointerup", finishStroke);
    inkCanvas.addEventListener("pointercancel", finishStroke);

    if (pageEl) {
      pageEl.addEventListener("pointerover", (e) => {
        if (!compSheetInkMode || compSheetInkFingerDraw) return;
        if (e.pointerType === "pen") {
          pageEl.style.touchAction = "none";
        } else if (e.pointerType === "touch") {
          pageEl.style.touchAction = "pan-y pinch-zoom";
        }
      }, { capture: true });

      pageEl.addEventListener("pointerdown", (e) => {
        if (!compSheetInkMode || compSheetInkFingerDraw) return;
        if (e.pointerType === "touch") {
          pageEl.style.touchAction = "pan-y pinch-zoom";
          return;
        }
        if (e.pointerType !== "pen") return;
        if (e.target && e.target.closest("button, a, input, select, textarea, .sheet-media-card, .comp-folio-ink-toolbar, .folio-sheet-nav-footer, .folio-header-meta, .sheet-toc-pill-wrap, .comp-pdf-studio-bar, .comp-excerpt-action-popover")) {
          return;
        }
        pageEl.style.touchAction = "none";
        e.preventDefault();
        e.stopPropagation();
        beginInkAtEvent(e);
      }, { capture: true });

      pageEl.addEventListener("pointermove", (e) => {
        if (!compSheetInkMode || compSheetInkFingerDraw || !isDrawingSheetInk) return;
        if (e.pointerType !== "pen") return;
        e.preventDefault();
        e.stopPropagation();
        moveInkAtEvent(e);
      }, { capture: true });

      pageEl.addEventListener("touchmove", (e) => {
        if (compSheetInkMode && isDrawingSheetInk && !multiTouchActive && e.cancelable) {
          e.preventDefault();
        }
      }, { passive: false });

      pageEl.addEventListener("pointerup", (e) => {
        if (isDrawingSheetInk && !compSheetInkFingerDraw && e.pointerType === "pen") {
          finishStroke(e);
        }
      }, { capture: true });

      pageEl.addEventListener("pointercancel", (e) => {
        if (isDrawingSheetInk && !compSheetInkFingerDraw) {
          finishStroke(e);
        }
      }, { capture: true });
    }

    window.addEventListener("pointerup", (e) => {
      if (isDrawingSheetInk) finishStroke(e);
    });
    window.addEventListener("pointercancel", (e) => {
      if (isDrawingSheetInk) finishStroke(e);
    });
  }

  /**
   * INTERACTIVE SHEET IMAGES & MOVABLE STICKY CALLOUT CARDS
   * Supports both Free-Floating Movable/Resizable Cards and Inline Document Blocks.
   */
  let stagedSheetMediaBase64 = "";
  let stagedSheetMediaPlacement = "floating";

  function getActiveCompendiumScrollTop() {
    const pageEl = document.getElementById("comp-folio-page");
    if (pageEl) {
      const rect = pageEl.getBoundingClientRect();
      // Compute exact vertical offset of the visible viewport top inside #comp-folio-page
      if (rect.top < 75) {
        return Math.max(0, Math.round(75 - rect.top));
      }
    }
    const canvas = document.getElementById("comp-studio-canvas");
    const ws = document.querySelector("#compendium-fullscreen-view .comp-studio-workspace");
    return Math.max(canvas ? canvas.scrollTop : 0, ws ? ws.scrollTop : 0);
  }

  function setSheetMediaPlacementMode(mode = "floating") {
    stagedSheetMediaPlacement = mode === "inline" ? "inline" : "floating";
    const floatBtn = document.getElementById("btn-media-mode-floating");
    const inlineBtn = document.getElementById("btn-media-mode-inline");
    if (floatBtn) {
      floatBtn.className = stagedSheetMediaPlacement === "floating" ? "btn btn-cyan" : "btn btn-secondary";
    }
    if (inlineBtn) {
      inlineBtn.className = stagedSheetMediaPlacement === "inline" ? "btn btn-cyan" : "btn btn-secondary";
    }
  }

  function updateSheetMediaModalPreview(src) {
    stagedSheetMediaBase64 = src || "";
    const wrap = document.getElementById("sheet-media-preview-wrap");
    const img = document.getElementById("sheet-media-preview-img");
    if (wrap && img) {
      if (stagedSheetMediaBase64) {
        img.src = stagedSheetMediaBase64;
        wrap.style.display = "block";
      } else {
        img.src = "";
        wrap.style.display = "none";
      }
    }
  }

  async function handleSheetMediaStudioFile(input) {
    if (!input || !input.files || !input.files[0]) return;
    const base64 = await compressImageFile(input.files[0]);
    if (base64) {
      updateSheetMediaModalPreview(base64);
    }
  }

  function handleSheetMediaStudioUrl(urlVal) {
    const clean = String(urlVal || "").trim();
    if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:image/")) {
      updateSheetMediaModalPreview(clean);
    }
  }

  async function handleMediaModalPasteEvent(ev) {
    if (!ev) return;
    const items = ev.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            ev.preventDefault();
            const base64 = await compressImageFile(file);
            if (base64) {
              updateSheetMediaModalPreview(base64);
            }
          }
          return;
        }
      }
    }
    const text = (ev.clipboardData?.getData("text/plain") || "").trim();
    if (text.startsWith("http://") || text.startsWith("https://") || text.startsWith("data:image/")) {
      ev.preventDefault();
      safeSetValue("sheet-media-url-input", text);
      updateSheetMediaModalPreview(text);
    }
  }

  async function insertSheetMediaFromUrlInput() {
    await commitSheetMediaFromModal();
  }

  async function commitSheetMediaFromModal() {
    const urlInput = document.getElementById("sheet-media-url-input")?.value.trim() || "";
    const finalSrc = stagedSheetMediaBase64 || urlInput;
    if (!finalSrc) {
      alert("Please choose an image file, paste an image from your clipboard, or enter an image URL first.");
      return;
    }
    const caption = document.getElementById("sheet-media-caption-input")?.value.trim() || "";
    const scrollY = getActiveCompendiumScrollTop();
    const existingCount = Array.isArray(activeSheetMediaBlocks) ? activeSheetMediaBlocks.length : 0;
    const cascade = (existingCount % 5) * 20;
    await insertMediaBlockIntoActiveSheet({
      type: "image",
      mode: stagedSheetMediaPlacement || "floating",
      src: finalSrc,
      caption,
      x: 28 + cascade,
      y: Math.max(95, scrollY + 60 + cascade),
      width: 260
    });
    document.getElementById("modal-sheet-media-studio")?.classList.remove("active");
  }

  function openAddSheetMediaPrompt(defaultMode = "floating") {
    closeCompMorePopover();
    stagedSheetMediaBase64 = "";
    setSheetMediaPlacementMode(defaultMode);
    safeSetValue("sheet-media-studio-file", "");
    safeSetValue("sheet-media-url-input", "");
    safeSetValue("sheet-media-caption-input", "");
    updateSheetMediaModalPreview("");

    pushHistoryState("modal-sheet-media-studio");
    const m = document.getElementById("modal-sheet-media-studio");
    if (m) m.classList.add("active");
  }

  function triggerCompSheetImageUpload() {
    openAddSheetMediaPrompt("floating");
  }

  async function handleCompSheetImageUpload(input) {
    if (!input || !input.files || !input.files[0]) return;
    const base64 = await compressImageFile(input.files[0]);
    if (base64) {
      const scrollY = getActiveCompendiumScrollTop();
      await insertMediaBlockIntoActiveSheet({
        type: "image",
        mode: "floating",
        src: base64,
        caption: "",
        x: 32,
        y: Math.max(95, scrollY + 65),
        width: 260
      });
    }
  }

  async function handleCompSheetMediaFileUpload(input) {
    await handleCompSheetImageUpload(input);
  }

  async function pasteClipboardImageToSheet() {
    closeCompMorePopover();
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imgType = item.types.find(t => t.startsWith("image/"));
          if (imgType) {
            const blob = await item.getType(imgType);
            const file = new File([blob], "clipboard-image.png", { type: imgType });
            const base64 = await compressImageFile(file);
            if (base64) {
              openAddSheetMediaPrompt("floating");
              updateSheetMediaModalPreview(base64);
              return;
            }
          }
        }
      }
      if (navigator.clipboard && navigator.clipboard.readText) {
        const txt = (await navigator.clipboard.readText() || "").trim();
        if (txt.startsWith("http://") || txt.startsWith("https://") || txt.startsWith("data:image/")) {
          openAddSheetMediaPrompt("floating");
          safeSetValue("sheet-media-url-input", txt);
          updateSheetMediaModalPreview(txt);
          return;
        }
      }
    } catch (_) {}
    openAddSheetMediaPrompt("floating");
  }

  let topStickyZCounter = 100;

  async function addCompSheetStickyNote() {
    closeCompMorePopover();
    // Ensure active brush/ink modes don't intercept typing or dragging on the newly created sticky note
    if (compSheetInkMode) toggleCompSheetInkMode(false);
    if (compendiumMaskEditMode) toggleCompendiumMaskEditMode(false);
    if (compendiumHighlightMode) toggleCompendiumHighlightMode(false);

    const scrollOffset = getActiveCompendiumScrollTop();
    const pageEl = document.getElementById("comp-folio-page");
    const pageW = pageEl ? pageEl.clientWidth : 360;
    const existingStickies = Array.isArray(activeSheetMediaBlocks)
      ? activeSheetMediaBlocks.filter(b => b && b.type === "sticky" && b.mode !== "inline").length
      : 0;
    const cascade = (existingStickies % 5) * 22;
    const cardW = Math.min(255, Math.max(195, pageW - 44));
    const startX = Math.max(12, Math.min(pageW - cardW - 12, 24 + cascade));
    const startY = Math.max(96, scrollOffset + 55 + cascade);

    const createdBlock = await insertMediaBlockIntoActiveSheet({
      type: "sticky",
      mode: "floating",
      theme: "amber",
      collapsed: false,
      text: "",
      x: startX,
      y: startY,
      width: cardW,
      height: 110
    });

    setTimeout(() => {
      if (!createdBlock) return;
      const cardEl = document.querySelector(`.sheet-media-card[data-media-id="${createdBlock.id}"]`);
      if (cardEl) {
        topStickyZCounter++;
        cardEl.style.zIndex = String(topStickyZCounter);
        const ta = cardEl.querySelector(".sheet-media-sticky-body");
        if (ta) {
          ta.focus();
        }
      }
    }, 50);
  }

  async function addFloatingStickyNoteCard() {
    await addCompSheetStickyNote();
  }

  async function insertMediaBlockIntoActiveSheet(blockSpec) {
    const isPdf = compendiumActiveDocType === "PDF" && activePdfId;
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!isPdf && !sheet) return null;
    const newBlock = {
      id: "media_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      type: blockSpec.type || "image",
      mode: isPdf ? "floating" : (blockSpec.mode || "floating"),
      theme: blockSpec.theme || "amber",
      collapsed: Boolean(blockSpec.collapsed),
      src: blockSpec.src || "",
      caption: blockSpec.caption || "",
      text: blockSpec.text || "",
      x: typeof blockSpec.x === "number" ? blockSpec.x : 32,
      y: typeof blockSpec.y === "number" ? blockSpec.y : 110,
      width: typeof blockSpec.width === "number" ? blockSpec.width : 250,
      height: typeof blockSpec.height === "number" ? blockSpec.height : 110
    };
    activeSheetMediaBlocks.push(newBlock);
    await saveActiveSheetMediaBlocks();
    renderActiveSheetMediaBlocks();
    setTimeout(syncSheetInkCanvasGeometry, 60);
    return newBlock;
  }

  async function saveActiveSheetMediaBlocks() {
    if (compendiumActiveDocType === "PDF" && activePdfId) {
      const mediaKey = `sheet_media_${activePdfId}_p${activePdfPageNum || 1}`;
      await putRecord("store_notes", {
        id: mediaKey,
        sheetId: `${activePdfId}_p${activePdfPageNum || 1}`,
        blocks: activeSheetMediaBlocks,
        timestamp: Date.now()
      });
      return;
    }
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet) return;
    await putRecord("store_notes", {
      id: `sheet_media_${sheet.id}`,
      sheetId: sheet.id,
      blocks: activeSheetMediaBlocks,
      timestamp: Date.now()
    });
  }

  async function toggleCompSheetMediaBlockMode(blockId) {
    const blk = activeSheetMediaBlocks.find(b => b.id === blockId);
    if (!blk) return;
    blk.mode = blk.mode === "floating" ? "inline" : "floating";
    if (blk.mode === "floating") {
      const scrollY = getActiveCompendiumScrollTop();
      blk.y = Math.max(96, scrollY + 60);
    }
    await saveActiveSheetMediaBlocks();
    renderActiveSheetMediaBlocks();
    setTimeout(syncSheetInkCanvasGeometry, 60);
  }

  async function setCompSheetStickyTheme(blockId, themeName) {
    const blk = activeSheetMediaBlocks.find(b => b.id === blockId);
    if (!blk) return;
    blk.theme = themeName || "amber";
    await saveActiveSheetMediaBlocks();
    const card = document.querySelector(`.sheet-media-card[data-media-id="${blockId}"]`);
    if (card) {
      card.classList.remove("sticky-theme-amber", "sticky-theme-cyan", "sticky-theme-emerald", "sticky-theme-rose");
      card.classList.add(`sticky-theme-${blk.theme}`);
      card.querySelectorAll(".sticky-color-dot").forEach(dot => {
        dot.classList.toggle("active", dot.getAttribute("data-theme") === blk.theme);
      });
    }
  }

  async function toggleCompSheetStickyCollapse(blockId) {
    const blk = activeSheetMediaBlocks.find(b => b.id === blockId);
    if (!blk) return;
    blk.collapsed = !blk.collapsed;
    await saveActiveSheetMediaBlocks();
    renderActiveSheetMediaBlocks();
  }

  async function deleteCompSheetMediaBlock(blockId) {
    const idx = activeSheetMediaBlocks.findIndex(b => b.id === blockId);
    if (idx === -1) return;
    activeSheetMediaBlocks.splice(idx, 1);
    await saveActiveSheetMediaBlocks();
    renderActiveSheetMediaBlocks();
    setTimeout(syncSheetInkCanvasGeometry, 60);
  }

  async function updateCompSheetMediaCaption(blockId, val) {
    const blk = activeSheetMediaBlocks.find(b => b.id === blockId);
    if (!blk) return;
    blk.caption = val;
    await saveActiveSheetMediaBlocks();
  }

  async function updateCompSheetStickyText(blockId, val) {
    const blk = activeSheetMediaBlocks.find(b => b.id === blockId);
    if (!blk) return;
    blk.text = val;
    await saveActiveSheetMediaBlocks();
  }

  function renderActiveSheetMediaBlocks() {
    const floatingLayer = document.getElementById("comp-floating-media-layer") || document.getElementById("comp-folio-floating-media-layer");
    const inlineSlot = document.getElementById("comp-studio-inline-media-slot") || document.getElementById("comp-inline-media-container");
    const legacyInlineSlot = document.getElementById("comp-inline-media-container");
    if (floatingLayer) floatingLayer.innerHTML = "";
    if (inlineSlot) inlineSlot.innerHTML = "";
    if (legacyInlineSlot && legacyInlineSlot !== inlineSlot) legacyInlineSlot.innerHTML = "";

    if (!Array.isArray(activeSheetMediaBlocks) || activeSheetMediaBlocks.length === 0) return;

    activeSheetMediaBlocks.forEach((blk, idx) => {
      const card = document.createElement("div");
      const isFloating = blk.mode !== "inline";
      const isSticky = blk.type === "sticky";
      const theme = blk.theme || "amber";
      card.className = `sheet-media-card ${isFloating ? "floating-card" : "inline-card"} ${isSticky ? `sticky-card sticky-theme-${theme}` : ""} ${blk.collapsed ? "sticky-collapsed" : ""}`;
      card.setAttribute("data-media-id", blk.id);

      if (isFloating) {
        card.style.left = `${Math.max(4, blk.x || 24)}px`;
        card.style.top = `${Math.max(8, blk.y || 80)}px`;
        card.style.width = `${Math.max(165, blk.width || 245)}px`;
        card.style.zIndex = String(96 + idx);
      } else {
        card.style.width = `${Math.min(640, Math.max(210, blk.width || 360))}px`;
      }

      // Bring floating card to front on tap/focus
      card.addEventListener("pointerdown", (ev) => {
        ev.stopPropagation();
        if (isFloating) {
          topStickyZCounter++;
          card.style.zIndex = String(topStickyZCounter);
        }
      });

      const modeSwitchLabel = isFloating ? "\uD83D\uDCCC Inline" : "\uD83E\uDE9F Float";
      const headerLabel = isSticky
        ? (blk.collapsed && blk.text ? `\uD83D\uDCDD ${blk.text.slice(0, 18)}${blk.text.length > 18 ? "\u2026" : ""}` : "\uD83D\uDCDD Sticky")
        : "\uD83D\uDDBC\uFE0F Visual";

      const dragBar = document.createElement("div");
      dragBar.className = "sheet-media-drag-bar";

      const colorSwatchesHtml = isSticky
        ? `<div style="display:inline-flex; align-items:center; gap:3px; margin-right:2px;">
             <button type="button" class="sticky-color-dot ${theme === "amber" ? "active" : ""}" data-theme="amber" style="background:#f59e0b;" title="Amber Note"></button>
             <button type="button" class="sticky-color-dot ${theme === "cyan" ? "active" : ""}" data-theme="cyan" style="background:#38bdf8;" title="Cyan Concept"></button>
             <button type="button" class="sticky-color-dot ${theme === "emerald" ? "active" : ""}" data-theme="emerald" style="background:#10b981;" title="Emerald Formula"></button>
             <button type="button" class="sticky-color-dot ${theme === "rose" ? "active" : ""}" data-theme="rose" style="background:#f43f5e;" title="Rose Exam Trap"></button>
           </div>`
        : "";

      const collapseBtnHtml = isSticky
        ? `<button type="button" class="sheet-media-btn btn-sticky-collapse" title="${blk.collapsed ? "Expand Sticky" : "Minimize Sticky"}">${blk.collapsed ? "+" : "\u2013"}</button>`
        : "";

      dragBar.innerHTML = `
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">\u283F ${headerLabel}</span>
        <div class="sheet-media-card-actions">
          ${colorSwatchesHtml}
          ${collapseBtnHtml}
          <button type="button" class="sheet-media-btn btn-sticky-mode" title="Switch between Free-Floating and Inline mode">${modeSwitchLabel}</button>
          <button type="button" class="sheet-media-btn btn-sticky-del" style="color:#fb7185;" title="Delete block">\u2715</button>
        </div>
      `;

      dragBar.querySelectorAll(".sticky-color-dot").forEach(dot => {
        dot.addEventListener("click", (ev) => {
          ev.stopPropagation();
          setCompSheetStickyTheme(blk.id, dot.getAttribute("data-theme"));
        });
      });

      const collapseBtn = dragBar.querySelector(".btn-sticky-collapse");
      if (collapseBtn) {
        collapseBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          toggleCompSheetStickyCollapse(blk.id);
        });
      }

      const modeBtn = dragBar.querySelector(".btn-sticky-mode");
      if (modeBtn) {
        modeBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          toggleCompSheetMediaBlockMode(blk.id);
        });
      }

      const delBtn = dragBar.querySelector(".btn-sticky-del");
      if (delBtn) {
        delBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          deleteCompSheetMediaBlock(blk.id);
        });
      }

      card.appendChild(dragBar);

      if (isSticky) {
        const ta = document.createElement("textarea");
        ta.className = "sheet-media-sticky-body";
        ta.value = blk.text || "";
        ta.style.height = `${Math.max(88, blk.height || 110)}px`;
        ta.placeholder = "Type formula shortcut, mnemonic, or revision note...";
        ta.addEventListener("input", (ev) => {
          updateCompSheetStickyText(blk.id, ev.target.value);
          if (ev.target.scrollHeight > ev.target.clientHeight) {
            const newH = Math.min(360, ev.target.scrollHeight + 4);
            ev.target.style.height = `${newH}px`;
            blk.height = newH;
          }
        });
        card.appendChild(ta);
      } else {
        const imgWrap = document.createElement("div");
        imgWrap.className = "sheet-media-img-wrap";
        imgWrap.innerHTML = `<img src="${blk.src}" alt="Sheet Visual">`;
        card.appendChild(imgWrap);

        const capInput = document.createElement("input");
        capInput.type = "text";
        capInput.className = "sheet-media-caption";
        capInput.placeholder = "Add diagram caption / formula note...";
        capInput.value = blk.caption || "";
        capInput.addEventListener("input", (ev) => updateCompSheetMediaCaption(blk.id, ev.target.value));
        card.appendChild(capInput);
      }

      const resizeHandle = document.createElement("div");
      resizeHandle.className = "sheet-media-resize-handle";
      resizeHandle.title = "Drag corner to resize width & height";
      card.appendChild(resizeHandle);

      // Smooth Pointer-Captured Dragging for Floating Cards
      if (isFloating) {
        dragBar.addEventListener("pointerdown", (e) => {
          if (e.target.closest("button")) return;
          e.preventDefault();
          e.stopPropagation();
          try { dragBar.setPointerCapture(e.pointerId); } catch (_) {}
          topStickyZCounter++;
          card.style.zIndex = String(topStickyZCounter);

          const pageEl = document.getElementById("comp-folio-page");
          const startX = e.clientX;
          const startY = e.clientY;
          const origX = blk.x || 24;
          const origY = blk.y || 80;

          const onMove = (me) => {
            const maxX = pageEl ? Math.max(12, pageEl.clientWidth - (blk.width || 220) - 6) : 520;
            const maxY = pageEl ? Math.max(60, pageEl.scrollHeight - 48) : 2400;
            blk.x = Math.max(4, Math.min(maxX, Math.round(origX + (me.clientX - startX))));
            blk.y = Math.max(8, Math.min(maxY, Math.round(origY + (me.clientY - startY))));
            card.style.left = `${blk.x}px`;
            card.style.top = `${blk.y}px`;
          };
          const onUp = async (ue) => {
            if (ue && ue.pointerId !== undefined) {
              try { dragBar.releasePointerCapture(ue.pointerId); } catch (_) {}
            }
            dragBar.removeEventListener("pointermove", onMove);
            dragBar.removeEventListener("pointerup", onUp);
            dragBar.removeEventListener("pointercancel", onUp);
            await saveActiveSheetMediaBlocks();
          };
          dragBar.addEventListener("pointermove", onMove);
          dragBar.addEventListener("pointerup", onUp);
          dragBar.addEventListener("pointercancel", onUp);
        });
      }

      // 2D Width + Height Resizing for both Floating & Inline Cards
      resizeHandle.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        try { resizeHandle.setPointerCapture(e.pointerId); } catch (_) {}
        const startX = e.clientX;
        const startY = e.clientY;
        const origW = blk.width || 245;
        const taEl = card.querySelector(".sheet-media-sticky-body");
        const origH = taEl ? taEl.offsetHeight : (blk.height || 110);
        const pageEl = document.getElementById("comp-folio-page");
        const maxW = pageEl ? Math.max(180, pageEl.clientWidth - 16) : 640;

        const onMove = (me) => {
          blk.width = Math.max(160, Math.min(maxW, Math.round(origW + (me.clientX - startX))));
          card.style.width = `${blk.width}px`;
          if (isSticky && taEl) {
            blk.height = Math.max(72, Math.min(520, Math.round(origH + (me.clientY - startY))));
            taEl.style.height = `${blk.height}px`;
          }
        };
        const onUp = async (ue) => {
          if (ue && ue.pointerId !== undefined) {
            try { resizeHandle.releasePointerCapture(ue.pointerId); } catch (_) {}
          }
          resizeHandle.removeEventListener("pointermove", onMove);
          resizeHandle.removeEventListener("pointerup", onUp);
          resizeHandle.removeEventListener("pointercancel", onUp);
          await saveActiveSheetMediaBlocks();
          syncSheetInkCanvasGeometry();
        };
        resizeHandle.addEventListener("pointermove", onMove);
        resizeHandle.addEventListener("pointerup", onUp);
        resizeHandle.addEventListener("pointercancel", onUp);
      });

      if (isFloating && floatingLayer) {
        floatingLayer.appendChild(card);
      } else if (inlineSlot) {
        inlineSlot.appendChild(card);
      }
    });
  }

  /**
   * OCCURRENCE-INDEXED SURGICAL RECALL MASKING:
   * Stores { phrase, occurrence } so tapping or brush-dragging across the k-th instance
   * of a word/phrase ONLY masks that exact k-th occurrence!
   */
  async function toggleCustomMaskPhraseOnActiveSheet(phraseText, occurrence = null, targetSheetId = null) {
    const sheetId = targetSheetId || (currentCompSheets[activeCompSheetIndex] && currentCompSheets[activeCompSheetIndex].id);
    if (!sheetId) return;
    const cleanP = String(phraseText || "").replace(/\s+/g, " ").trim();
    if (cleanP.length < 1) return;

    const normTarget = cleanP.toLowerCase();
    const hasOcc = occurrence !== null && occurrence !== undefined && !Number.isNaN(Number(occurrence));
    const targetOcc = hasOcc ? Number(occurrence) : null;

    let masksList = activeSheetCustomMasks;
    if (targetSheetId && (!currentCompSheets[activeCompSheetIndex] || currentCompSheets[activeCompSheetIndex].id !== targetSheetId)) {
      const rec = await getRecord("store_notes", `masks_${sheetId}`);
      masksList = rec && Array.isArray(rec.masks) ? rec.masks : [];
    }

    const existingIdx = masksList.findIndex(item => {
      const parsed = parseMaskOrHighlightKey(item);
      const itemPhrase = String(parsed.phrase || "").replace(/\s+/g, " ").trim().toLowerCase();
      const itemOcc = typeof parsed.occurrence === "number" ? parsed.occurrence : null;
      if (itemPhrase !== normTarget) return false;
      if (targetOcc !== null && itemOcc !== null) return itemOcc === targetOcc;
      return true;
    });

    if (existingIdx !== -1) {
      masksList.splice(existingIdx, 1);
    } else {
      masksList.push({
        phrase: cleanP,
        occurrence: targetOcc !== null ? targetOcc : 0
      });
    }

    if (!targetSheetId || (currentCompSheets[activeCompSheetIndex] && currentCompSheets[activeCompSheetIndex].id === sheetId)) {
      activeSheetCustomMasks = masksList;
    }

    await putRecord("store_notes", {
      id: `masks_${sheetId}`,
      masks: masksList,
      timestamp: Date.now()
    });

    if (currentCompSheets[activeCompSheetIndex] && currentCompSheets[activeCompSheetIndex].id === sheetId) {
      refreshActiveSheetDomAnnotationsOnly();
    }
    if (activeSplitSheetId === sheetId && document.getElementById("arena-split-sheet-drawer")?.classList.contains("open")) {
      await openSplitSheetDrawer(sheetId, activeSplitSheetSubject, activeSplitSheetChapter);
    }
  }

  /**
   * OCCURRENCE-INDEXED 4-COLOR SEMANTIC HIGHLIGHTER:
   * Stores { phrase, color, occurrence } in store_notes (highlights_${sheetId}).
   */
  async function toggleCustomHighlightOnActiveSheet(phraseText, color = "yellow", occurrence = null, targetSheetId = null) {
    const sheetId = targetSheetId || (currentCompSheets[activeCompSheetIndex] && currentCompSheets[activeCompSheetIndex].id);
    if (!sheetId) return;
    const cleanP = String(phraseText || "").replace(/\s+/g, " ").trim();
    if (cleanP.length < 1) return;

    const normMap = {
      yellow: "yellow", amber: "yellow",
      green: "green", emerald: "green",
      cyan: "cyan", blue: "cyan",
      pink: "pink", rose: "pink", red: "pink",
      purple: "purple"
    };
    const normColor = normMap[String(color || "yellow").toLowerCase()] || "yellow";

    const normTarget = cleanP.toLowerCase();
    const hasOcc = occurrence !== null && occurrence !== undefined && !Number.isNaN(Number(occurrence));
    const targetOcc = hasOcc ? Number(occurrence) : 0;

    let hlList = activeSheetHighlights;
    if (targetSheetId && (!currentCompSheets[activeCompSheetIndex] || currentCompSheets[activeCompSheetIndex].id !== targetSheetId)) {
      const rec = await getRecord("store_notes", `highlights_${sheetId}`);
      hlList = rec && Array.isArray(rec.highlights) ? rec.highlights : [];
    }

    const existingIdx = hlList.findIndex(item => {
      if (!item || !item.phrase) return false;
      const itemPhrase = String(item.phrase).replace(/\s+/g, " ").trim().toLowerCase();
      const itemOcc = typeof item.occurrence === "number" ? item.occurrence : 0;
      return itemPhrase === normTarget && itemOcc === targetOcc;
    });

    if (existingIdx !== -1) {
      if (hlList[existingIdx].color === normColor) {
        hlList.splice(existingIdx, 1);
      } else {
        hlList[existingIdx].color = normColor;
      }
    } else {
      hlList.push({
        phrase: cleanP,
        color: normColor,
        occurrence: targetOcc
      });
    }

    if (!targetSheetId || (currentCompSheets[activeCompSheetIndex] && currentCompSheets[activeCompSheetIndex].id === sheetId)) {
      activeSheetHighlights = hlList;
    }

    await putRecord("store_notes", {
      id: `highlights_${sheetId}`,
      highlights: hlList,
      timestamp: Date.now()
    });

    if (currentCompSheets[activeCompSheetIndex] && currentCompSheets[activeCompSheetIndex].id === sheetId) {
      refreshActiveSheetDomAnnotationsOnly();
    }
    if (activeSplitSheetId === sheetId && document.getElementById("arena-split-sheet-drawer")?.classList.contains("open")) {
      await openSplitSheetDrawer(sheetId, activeSplitSheetSubject, activeSplitSheetChapter);
    }
  }

  function updateCompMaskAndHighlightBadge() {
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet) return;
    const inlineBraceCount = (sheet.content.match(/\{\{[\s\S]+?\}\}/g) || []).length;
    const totalMasks = activeSheetCustomMasks.length + inlineBraceCount;
    const inkCount = Array.isArray(activeSheetInkStrokes) ? activeSheetInkStrokes.length : 0;
    safeSetText(
      "comp-mask-count-badge",
      `${totalMasks} Mask${totalMasks === 1 ? "" : "s"} \u2022 ${activeSheetHighlights.length} Highlight${activeSheetHighlights.length === 1 ? "" : "s"}${inkCount > 0 ? ` \u2022 ${inkCount} Ink` : ""}`
    );
  }

  /**
   * Re-renders only `#comp-studio-doc-body` + margin annotations without resetting scroll position!
   */
  function refreshActiveSheetDomAnnotationsOnly() {
    const sheet = currentCompSheets[activeCompSheetIndex];
    const bodyEl = document.getElementById("comp-studio-doc-body");
    if (!sheet || !bodyEl) return;
    bodyEl.innerHTML = formatRichText(sheet.content, []);
    applyDomMasksAndHighlights(bodyEl, activeSheetCustomMasks, activeSheetHighlights);
    updateCompMaskAndHighlightBadge();
    renderCompMarginAnnotationsList();
  }

  async function removeCustomMaskByIndex(idx) {
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet || idx < 0 || idx >= activeSheetCustomMasks.length) return;
    activeSheetCustomMasks.splice(idx, 1);
    await putRecord("store_notes", {
      id: `masks_${sheet.id}`,
      masks: activeSheetCustomMasks,
      timestamp: Date.now()
    });
    refreshActiveSheetDomAnnotationsOnly();
  }

  async function removeCustomHighlightByIndex(idx) {
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet || idx < 0 || idx >= activeSheetHighlights.length) return;
    activeSheetHighlights.splice(idx, 1);
    await putRecord("store_notes", {
      id: `highlights_${sheet.id}`,
      highlights: activeSheetHighlights,
      timestamp: Date.now()
    });
    refreshActiveSheetDomAnnotationsOnly();
  }

  // Legacy stub kept so external calls never throw
  async function rateCurrentSheetRecall() {}

  function formatLastOpenedBadgeText(prevOpenedEpoch) {
    if (!prevOpenedEpoch) {
      return { text: "\u2728 First Open", color: "var(--accent-cyan)", bg: "rgba(56,189,248,0.14)" };
    }
    const diffMs = Date.now() - prevOpenedEpoch;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays <= 0) {
      return { text: "\u2713 Opened Today", color: "#34d399", bg: "rgba(16,185,129,0.15)" };
    }
    if (diffDays === 1) {
      return { text: "Opened Yesterday", color: "#94a3b8", bg: "rgba(148,163,184,0.14)" };
    }
    if (diffDays >= 7) {
      return { text: `\uD83D\uDD52 Neglected (${diffDays}d ago)`, color: "#fbbf24", bg: "rgba(245,158,11,0.18)" };
    }
    return { text: `Opened ${diffDays}d ago`, color: "#94a3b8", bg: "rgba(148,163,184,0.14)" };
  }

  function applyCompendiumZoomStyle() {
    const docEl = document.getElementById("comp-studio-doc-content");
    const badgeEl = document.getElementById("comp-zoom-pct-btn") || document.getElementById("comp-zoom-badge");
    if (badgeEl) {
      badgeEl.innerText = `${Math.round(compendiumZoomScale * 100)}%`;
    }
    if (docEl) {
      if (Math.abs(compendiumZoomScale - 1.0) < 0.02) {
        docEl.style.zoom = "";
        docEl.style.transform = "";
      } else {
        docEl.style.zoom = String(compendiumZoomScale);
      }
    }
    setTimeout(syncSheetInkCanvasGeometry, 40);
  }

  function adjustCompendiumZoom(delta) {
    compendiumZoomScale = Math.max(0.75, Math.min(2.2, Math.round((compendiumZoomScale + delta) * 100) / 100));
    readerFontScale = compendiumZoomScale;
    document.documentElement.style.setProperty("--reader-font-scale", String(readerFontScale));
    applyCompendiumZoomStyle();
  }

  function resetCompendiumZoom() {
    compendiumZoomScale = 1.0;
    readerFontScale = 1.0;
    document.documentElement.style.setProperty("--reader-font-scale", "1");
    putRecord("store_config", { key: "reader_font_scale", value: 1.0 });
    applyCompendiumZoomStyle();
  }

  /**
   * Helper to get word-snapped caret boundary at (clientX, clientY) inside containerEl.
   */
  function getWordBoundaryAtPoint(containerEl, clientX, clientY) {
    let caretRange = null;
    if (document.caretRangeFromPoint) {
      caretRange = document.caretRangeFromPoint(clientX, clientY);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(clientX, clientY);
      if (pos) {
        caretRange = document.createRange();
        caretRange.setStart(pos.offsetNode, pos.offset);
        caretRange.collapse(true);
      }
    }
    if (!caretRange || !caretRange.startContainer || caretRange.startContainer.nodeType !== 3) return null;
    const textNode = caretRange.startContainer;
    if (!containerEl.contains(textNode)) return null;
    const text = textNode.textContent || "";
    const offset = caretRange.startOffset;
    let start = offset;
    let end = offset;
    const wordCharRegex = /[\w\d.%₹+\-°/()]/;
    while (start > 0 && wordCharRegex.test(text[start - 1])) start--;
    while (end < text.length && wordCharRegex.test(text[end])) end++;
    return { textNode, start, end, rawOffset: offset, word: text.slice(start, end).trim() };
  }

  function extractWordAndOccurrenceAtPoint(containerEl, clientX, clientY) {
    const wb = getWordBoundaryAtPoint(containerEl, clientX, clientY);
    if (!wb || !wb.word) return null;
    const wordRange = document.createRange();
    wordRange.setStart(wb.textNode, wb.start);
    wordRange.setEnd(wb.textNode, wb.end);
    const occurrence = computePhraseOccurrenceAtRange(containerEl, wordRange, wb.word);
    return { word: wb.word, occurrence };
  }

  function findFolioWordElementAtPoint(docBody, clientX, clientY) {
    if (!docBody) return null;
    const hit = document.elementFromPoint(clientX, clientY);
    if (hit && docBody.contains(hit)) {
      const directWord = hit.closest(".folio-word");
      if (directWord && docBody.contains(directWord)) return directWord;
      const ws = hit.closest(".folio-ws");
      if (ws && docBody.contains(ws)) {
        const nextW = ws.nextElementSibling?.classList?.contains("folio-word")
          ? ws.nextElementSibling
          : ws.previousElementSibling;
        if (nextW && nextW.classList?.contains("folio-word")) return nextW;
      }
    }
    const offsets = [
      [-6, 0], [6, 0], [0, -5], [0, 5], [-10, 0], [10, 0]
    ];
    for (const [dx, dy] of offsets) {
      const probe = document.elementFromPoint(clientX + dx, clientY + dy);
      if (probe && docBody.contains(probe)) {
        const w = probe.closest(".folio-word");
        if (w && docBody.contains(w)) return w;
      }
    }
    return null;
  }

  function computeWordSpanOccurrenceInDoc(docBody, wordSpanList, phraseText) {
    const cleanP = String(phraseText || "").replace(/\s+/g, " ").trim();
    if (!docBody || !cleanP || !wordSpanList || wordSpanList.length === 0) return 0;
    const firstSpan = wordSpanList[0];
    const r = document.createRange();
    try {
      r.selectNodeContents(firstSpan);
      return computePhraseOccurrenceAtRange(docBody, r, cleanP);
    } catch (_) {
      return 0;
    }
  }

  function initCompendiumRecallTapHandler() {
    const canvas = document.getElementById("comp-studio-canvas");
    if (!canvas || canvas.dataset.recallBound === "true") return;
    canvas.dataset.recallBound = "true";

    // Close Top-Right More Popover when clicking outside
    document.addEventListener("click", (ev) => {
      const pop = document.getElementById("comp-more-popover");
      const btn = document.getElementById("btn-comp-more-menu");
      if (pop && (pop.classList.contains("open") || pop.style.display === "block")) {
        if (!pop.contains(ev.target) && (!btn || !btn.contains(ev.target))) {
          toggleCompStudioMoreMenu(false);
        }
      }
    });

    // Global Clipboard Image Paste into Active Knowledge Sheet or Sheet Media Modal
    document.addEventListener("paste", async (ev) => {
      const fsView = document.getElementById("compendium-fullscreen-view");
      if (!fsView || fsView.style.display === "none") return;
      const mediaModal = document.getElementById("modal-sheet-media-studio");
      const isMediaModalOpen = mediaModal && mediaModal.classList.contains("active");

      const activeTag = document.activeElement?.tagName;
      if (!isMediaModalOpen && (activeTag === "INPUT" || activeTag === "TEXTAREA")) return;

      const items = ev.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            ev.preventDefault();
            const base64 = await compressImageFile(file);
            if (base64) {
              if (isMediaModalOpen) {
                updateSheetMediaModalPreview(base64);
              } else {
                const scrollY = getActiveCompendiumScrollTop();
                await insertMediaBlockIntoActiveSheet({
                  type: "image",
                  mode: "floating",
                  src: base64,
                  caption: "Pasted visual",
                  x: 38,
                  y: Math.max(70, scrollY + 90),
                  width: 260
                });
              }
            }
          }
          break;
        }
      }
    });

    // Auto-Collapsing Zen Header on Scroll (binds both desktop #comp-studio-canvas and mobile .comp-studio-workspace)
    let lastScrollTop = 0;
    const handleStudioScroll = (scrollContainer) => {
      const st = scrollContainer.scrollTop || 0;
      const delta = st - lastScrollTop;
      const zenHeader = document.getElementById("comp-zen-header");
      if (zenHeader) {
        if (st > 48 && delta > 7) {
          zenHeader.classList.add("comp-zen-header-hidden");
          document.getElementById("comp-sheet-switcher-drawer")?.classList.remove("open");
          document.getElementById("dock-btn-sheets")?.classList.remove("active");
          toggleCompStudioMoreMenu(false);
        } else if (delta < -8 || st <= 24) {
          zenHeader.classList.remove("comp-zen-header-hidden");
        }
      }
      lastScrollTop = st;
    };
    canvas.addEventListener("scroll", () => handleStudioScroll(canvas), { passive: true });
    const wsEl = document.querySelector("#compendium-fullscreen-view .comp-studio-workspace");
    if (wsEl) {
      wsEl.addEventListener("scroll", () => handleStudioScroll(wsEl), { passive: true });
    }

    /**
     * INSTANT BRUSH-DRAG PAINTING ENGINE FOR HIGHLIGHT & MASK MODES:
     * Uses discrete `.folio-word[data-widx]` tokens instead of native browser text selection
     * so sliding 1 finger or stylus across words on Android/tablet NEVER triggers Copy/Select
     * popups, paints words smoothly in real time, and commits exact occurrences on release!
     */
    let brushSession = null;
    let suppressNextClickAfterBrush = false;

    const clearBrushPreviewClasses = (docBody) => {
      if (!docBody) return;
      docBody.querySelectorAll(".brush-drag-hl, .brush-drag-mask").forEach(el => {
        el.classList.remove("brush-drag-hl", "brush-drag-mask");
      });
    };

    const paintBrushPreviewRange = (docBody, minWidx, maxWidx) => {
      if (!docBody) return;
      const cls = compendiumMaskEditMode ? "brush-drag-mask" : "brush-drag-hl";
      docBody.querySelectorAll(".folio-word").forEach(wEl => {
        const idx = Number(wEl.getAttribute("data-widx"));
        wEl.classList.toggle(cls, idx >= minWidx && idx <= maxWidx);
      });
      docBody.querySelectorAll(".folio-ws").forEach(wsEl => {
        const afterIdx = Number(wsEl.getAttribute("data-after-widx"));
        wsEl.classList.toggle(cls, afterIdx >= minWidx && afterIdx < maxWidx);
      });
    };

    const startBrushAtPoint = (clientX, clientY) => {
      if (!compendiumMaskEditMode && !compendiumHighlightMode) return null;
      const docBody = document.getElementById("comp-studio-doc-body");
      if (!docBody) return null;
      const wordEl = findFolioWordElementAtPoint(docBody, clientX, clientY);
      if (!wordEl) return null;
      const widx = Number(wordEl.getAttribute("data-widx"));
      if (Number.isNaN(widx)) return null;

      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();

      return {
        startX: clientX,
        startY: clientY,
        startWidx: widx,
        endWidx: widx,
        isDragging: false
      };
    };

    const updateBrushToPoint = (clientX, clientY, rawEvent) => {
      if (!brushSession) return;
      const dist = Math.hypot(clientX - brushSession.startX, clientY - brushSession.startY);
      if (!brushSession.isDragging && dist < 5) return;

      brushSession.isDragging = true;
      canvas.classList.add("brush-painting-active");
      if (rawEvent && rawEvent.cancelable) rawEvent.preventDefault();

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) sel.removeAllRanges();

      const docBody = document.getElementById("comp-studio-doc-body");
      if (!docBody) return;
      const curWordEl = findFolioWordElementAtPoint(docBody, clientX, clientY);
      if (curWordEl) {
        const curIdx = Number(curWordEl.getAttribute("data-widx"));
        if (!Number.isNaN(curIdx)) {
          brushSession.endWidx = curIdx;
        }
      }

      const minIdx = Math.min(brushSession.startWidx, brushSession.endWidx);
      const maxIdx = Math.max(brushSession.startWidx, brushSession.endWidx);
      paintBrushPreviewRange(docBody, minIdx, maxIdx);
    };

    const commitBrushSession = async () => {
      if (!brushSession) return;
      const session = brushSession;
      brushSession = null;
      canvas.classList.remove("brush-painting-active");

      const docBody = document.getElementById("comp-studio-doc-body");
      clearBrushPreviewClasses(docBody);

      if (!session.isDragging) return;
      suppressNextClickAfterBrush = true;
      setTimeout(() => { suppressNextClickAfterBrush = false; }, 260);

      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      document.getElementById("selection-action-popover")?.classList.remove("active");

      if (!docBody) return;
      const minIdx = Math.min(session.startWidx, session.endWidx);
      const maxIdx = Math.max(session.startWidx, session.endWidx);

      const selectedWords = Array.from(docBody.querySelectorAll(".folio-word")).filter(el => {
        const idx = Number(el.getAttribute("data-widx"));
        return idx >= minIdx && idx <= maxIdx;
      });
      if (selectedWords.length === 0) return;

      const blockGroups = [];
      let currentGroup = [];
      let currentBlock = null;
      selectedWords.forEach(wEl => {
        const blk = wEl.closest("p, li, td, th, h1, h2, h3, h4, .md-bullet-row, .clinical-callout") || docBody;
        if (blk !== currentBlock) {
          if (currentGroup.length > 0) blockGroups.push(currentGroup);
          currentGroup = [wEl];
          currentBlock = blk;
        } else {
          currentGroup.push(wEl);
        }
      });
      if (currentGroup.length > 0) blockGroups.push(currentGroup);

      for (const group of blockGroups) {
        const phraseText = group.map(w => w.textContent || "").join(" ").replace(/\s+/g, " ").trim();
        if (phraseText.length >= 1 && phraseText.length <= 360) {
          const occ = computeWordSpanOccurrenceInDoc(docBody, group, phraseText);
          if (compendiumMaskEditMode) {
            await toggleCustomMaskPhraseOnActiveSheet(phraseText, occ);
          } else if (compendiumHighlightMode) {
            await toggleCustomHighlightOnActiveSheet(phraseText, compendiumActiveHighlightColor, occ);
          }
        }
      }
    };

    canvas.addEventListener("contextmenu", (e) => {
      if (compendiumMaskEditMode || compendiumHighlightMode || compSheetInkMode) {
        e.preventDefault();
      }
    });

    canvas.addEventListener("selectstart", (e) => {
      if (e.target && e.target.closest && e.target.closest(".sheet-media-card")) return;
      if (compendiumMaskEditMode || compendiumHighlightMode || compSheetInkMode) {
        e.preventDefault();
      }
    });

    // Touch Brush-Drag + 2-Finger Pinch-to-Zoom
    let pinchStartDist = 0;
    let pinchBaseScale = 1.0;

    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        brushSession = null;
        canvas.classList.remove("brush-painting-active");
        clearBrushPreviewClasses(document.getElementById("comp-studio-doc-body"));
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDist = Math.hypot(dx, dy);
        pinchBaseScale = compendiumZoomScale;
        return;
      }
      if (e.touches.length === 1 && (compendiumMaskEditMode || compendiumHighlightMode)) {
        const t = e.touches[0];
        const docBody = document.getElementById("comp-studio-doc-body");
        if (docBody && docBody.contains(e.target)) {
          brushSession = startBrushAtPoint(t.clientX, t.clientY);
          if (brushSession) {
            paintBrushPreviewRange(docBody, brushSession.startWidx, brushSession.startWidx);
          }
        }
      }
    }, { passive: true });

    canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && pinchStartDist > 20) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const ratio = dist / pinchStartDist;
        compendiumZoomScale = Math.max(0.75, Math.min(2.2, Math.round(pinchBaseScale * ratio * 100) / 100));
        applyCompendiumZoomStyle();
        return;
      }
      if (e.touches.length === 1 && brushSession && (compendiumMaskEditMode || compendiumHighlightMode)) {
        const t = e.touches[0];
        updateBrushToPoint(t.clientX, t.clientY, e);
      }
    }, { passive: false });

    canvas.addEventListener("touchend", async (e) => {
      if (e.touches.length < 2) pinchStartDist = 0;
      if (brushSession) {
        await commitBrushSession();
      }
    }, { passive: true });

    canvas.addEventListener("touchcancel", () => {
      brushSession = null;
      canvas.classList.remove("brush-painting-active");
      clearBrushPreviewClasses(document.getElementById("comp-studio-doc-body"));
    }, { passive: true });

    // Mouse / Stylus Brush-Drag on Desktop & Tablet
    canvas.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      if (!compendiumMaskEditMode && !compendiumHighlightMode) return;
      const docBody = document.getElementById("comp-studio-doc-body");
      if (docBody && docBody.contains(e.target)) {
        brushSession = startBrushAtPoint(e.clientX, e.clientY);
        if (brushSession) {
          paintBrushPreviewRange(docBody, brushSession.startWidx, brushSession.startWidx);
        }
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!brushSession) return;
      if (e.buttons !== 1) {
        commitBrushSession();
        return;
      }
      updateBrushToPoint(e.clientX, e.clientY, e);
    });

    canvas.addEventListener("mouseup", async () => {
      if (brushSession) {
        await commitBrushSession();
      }
    });

    canvas.addEventListener("click", async (e) => {
      if (suppressNextClickAfterBrush) return;
      const docBody = document.getElementById("comp-studio-doc-body") || document.getElementById("comp-studio-doc-content");
      if (!docBody || !docBody.contains(e.target)) return;

      // 1. In 🖌️ Edit Masks Mode: tapping any existing mask or any `.folio-word` toggles ONLY that occurrence!
      if (compendiumMaskEditMode) {
        const existingMask = e.target.closest(".user-recall-mask");
        if (existingMask && docBody.contains(existingMask)) {
          e.preventDefault();
          e.stopPropagation();
          let attrPhrase = existingMask.getAttribute("data-mask-phrase");
          let attrOcc = existingMask.getAttribute("data-mask-occ");
          if (!attrPhrase && existingMask.getAttribute("data-mask-key")) {
            const parsed = parseMaskOrHighlightKey(decodeURIComponent(existingMask.getAttribute("data-mask-key")));
            attrPhrase = parsed.phrase;
            attrOcc = String(parsed.occurrence);
          }
          attrPhrase = attrPhrase || (existingMask.innerText || "").trim();
          if (attrOcc === "INLINE_BRACE" || existingMask.hasAttribute("data-inline-mask")) {
            const sheet = currentCompSheets[activeCompSheetIndex];
            if (sheet && attrPhrase) {
              const escaped = attrPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              sheet.content = sheet.content.replace(new RegExp(`\\{\\{\\s*${escaped}\\s*\\}\\}`), attrPhrase);
              await ConceptService.update(sheet.id, sheet);
              await renderActiveCompSheet();
            }
            return;
          }
          const occNum = attrOcc !== null && attrOcc !== "" ? Number(attrOcc) : null;
          if (attrPhrase.length >= 1) {
            await toggleCustomMaskPhraseOnActiveSheet(attrPhrase, occNum);
          }
          return;
        }

        const structTarget = e.target.closest(".katex-display, .katex");
        if (structTarget && docBody.contains(structTarget)) {
          e.preventDefault();
          e.stopPropagation();
          const mathEls = Array.from(docBody.querySelectorAll(".katex-display, .katex"));
          const mathIdx = mathEls.indexOf(structTarget);
          if (mathIdx !== -1) {
            await toggleCustomMaskPhraseOnActiveSheet("MATH", mathIdx);
          }
          return;
        }

        const wordEl = findFolioWordElementAtPoint(docBody, e.clientX, e.clientY);
        if (wordEl) {
          e.preventDefault();
          e.stopPropagation();
          const wordText = (wordEl.textContent || "").trim();
          if (wordText.length >= 1) {
            const occ = computeWordSpanOccurrenceInDoc(docBody, [wordEl], wordText);
            await toggleCustomMaskPhraseOnActiveSheet(wordText, occ);
          }
          return;
        }

        const extracted = extractWordAndOccurrenceAtPoint(docBody, e.clientX, e.clientY);
        if (extracted && extracted.word.length >= 1) {
          e.preventDefault();
          e.stopPropagation();
          await toggleCustomMaskPhraseOnActiveSheet(extracted.word, extracted.occurrence);
        }
        return;
      }

      // 2. In 🖍️ Highlight Mode: tapping an existing highlight or any `.folio-word` applies/toggles ONLY that occurrence!
      if (compendiumHighlightMode) {
        const existingHl = e.target.closest(".user-highlight, .user-hl");
        if (existingHl && docBody.contains(existingHl)) {
          e.preventDefault();
          e.stopPropagation();
          let attrPhrase = existingHl.getAttribute("data-hl-phrase");
          let attrOcc = existingHl.getAttribute("data-hl-occ");
          if (!attrPhrase && existingHl.getAttribute("data-hl-key")) {
            const parsed = parseMaskOrHighlightKey(decodeURIComponent(existingHl.getAttribute("data-hl-key")));
            attrPhrase = parsed.phrase;
            attrOcc = String(parsed.occurrence);
          }
          attrPhrase = attrPhrase || (existingHl.innerText || "").trim();
          const occNum = attrOcc !== null && attrOcc !== "" ? Number(attrOcc) : 0;
          if (attrPhrase.length >= 1) {
            await toggleCustomHighlightOnActiveSheet(attrPhrase, compendiumActiveHighlightColor, occNum);
          }
          return;
        }

        const wordEl = findFolioWordElementAtPoint(docBody, e.clientX, e.clientY);
        if (wordEl) {
          e.preventDefault();
          e.stopPropagation();
          const wordText = (wordEl.textContent || "").trim();
          if (wordText.length >= 1) {
            const occ = computeWordSpanOccurrenceInDoc(docBody, [wordEl], wordText);
            await toggleCustomHighlightOnActiveSheet(wordText, compendiumActiveHighlightColor, occ);
          }
          return;
        }

        const extracted = extractWordAndOccurrenceAtPoint(docBody, e.clientX, e.clientY);
        if (extracted && extracted.word.length >= 1) {
          e.preventDefault();
          e.stopPropagation();
          await toggleCustomHighlightOnActiveSheet(extracted.word, compendiumActiveHighlightColor, extracted.occurrence);
        }
        return;
      }

      // 3. In 🙈 Recall Mode: tapping any blurred element reveals/unblurs it on the spot!
      if (compendiumRecallMode) {
        const target = e.target.closest(".user-recall-mask, strong, .katex-display, td");
        if (target && docBody.contains(target)) {
          target.classList.toggle("recall-revealed");
          updateRecallProgressCounter();
        }
      }
    });
  }

  async function openAllSheetsIndexModal() {
    await renderAllSheetsIndexList();
    pushHistoryState("modal-all-sheets-index");
    const m = document.getElementById("modal-all-sheets-index");
    if (m) m.classList.add("active");
    setTimeout(() => {
      document.getElementById("sheets-index-search")?.focus();
    }, 100);
  }

  async function renderAllSheetsIndexList() {
    const listEl = document.getElementById("all-sheets-index-list");
    if (!listEl) return;

    const subFilter = document.getElementById("sheets-index-filter-sub")?.value || "ALL";
    const neglectedFilter = (
      document.getElementById("sheets-index-filter-neglected")?.value ||
      document.getElementById("sheets-index-filter-srs")?.value ||
      "ALL"
    );
    const term = (document.getElementById("sheets-index-search")?.value || "").trim().toLowerCase();
    const allConcepts = await ConceptService.getAll();
    const pdfIndex = await getPdfLibraryIndex();
    const allNotes = await getAllRecords("store_notes");
    const openedMap = {};
    const now = Date.now();

    allNotes.forEach(n => {
      if (n && typeof n.id === "string" && n.id.startsWith("last_opened_")) {
        openedMap[n.id.replace("last_opened_", "")] = n;
      }
    });

    const combinedDocs = [
      ...pdfIndex.map(p => ({
        ...p,
        isPdf: true,
        subtitle: `PDF Document \u2022 ${p.pageCount || 1} Pages`,
        content: ""
      })),
      ...allConcepts.map(c => ({ ...c, isPdf: false }))
    ];

    const filtered = combinedDocs.filter(c => {
      if (subFilter !== "ALL" && c.subject !== subFilter) return false;
      const openedRec = openedMap[c.id];
      const lastEpoch = openedRec && openedRec.lastOpenedAt ? openedRec.lastOpenedAt : (c.lastOpenedAt || 0);
      const daysSince = lastEpoch > 0 ? (now - lastEpoch) / 86400000 : Infinity;

      if (neglectedFilter === "NEGLECTED_3D") {
        if (daysSince < 3) return false;
      } else if (neglectedFilter === "NEGLECTED_7D") {
        if (daysSince < 7) return false;
      } else if (neglectedFilter === "NEGLECTED_14D") {
        if (daysSince < 14) return false;
      } else if (neglectedFilter === "NEVER_OPENED") {
        if (lastEpoch > 0) return false;
      } else if (neglectedFilter === "RECENT_TODAY") {
        if (daysSince > 1) return false;
      } else if (neglectedFilter === "RECENTLY_OPENED") {
        if (daysSince > 7) return false;
      }

      if (term) {
        const inTitle = (c.title || "").toLowerCase().includes(term);
        const inSub = (c.subtitle || "").toLowerCase().includes(term);
        const inChap = (c.chapter || "").toLowerCase().includes(term);
        const inId = (c.id || "").toLowerCase().includes(term);
        const inContent = (c.content || "").toLowerCase().includes(term);
        if (!inTitle && !inSub && !inChap && !inId && !inContent) return false;
      }
      return true;
    });

    if (neglectedFilter === "NEGLECTED_7D" || neglectedFilter === "NEGLECTED_14D") {
      filtered.sort((a, b) => {
        const tA = openedMap[a.id]?.lastOpenedAt || a.lastOpenedAt || 0;
        const tB = openedMap[b.id]?.lastOpenedAt || b.lastOpenedAt || 0;
        return tA - tB;
      });
    } else if (neglectedFilter === "RECENTLY_OPENED") {
      filtered.sort((a, b) => {
        const tA = openedMap[a.id]?.lastOpenedAt || a.lastOpenedAt || 0;
        const tB = openedMap[b.id]?.lastOpenedAt || b.lastOpenedAt || 0;
        return tB - tA;
      });
    }

    safeSetText("all-sheets-index-sub", `Showing ${filtered.length} of ${combinedDocs.length} Living Sheets & PDFs`);
    listEl.innerHTML = "";

    if (filtered.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">No sheets or PDFs match your filter.</div>`;
      return;
    }

    const grouped = {};
    filtered.forEach(s => {
      const ch = `${s.subject} \u2022 ${s.chapter}`;
      if (!grouped[ch]) grouped[ch] = [];
      grouped[ch].push(s);
    });

    Object.keys(grouped).forEach(groupKey => {
      const head = document.createElement("div");
      head.style.cssText = "font-size:11px; font-weight:800; color:var(--accent-cyan); margin:10px 0 6px 0; text-transform:uppercase; font-family:var(--font-mono);";
      head.innerText = `// ${groupKey} (${grouped[groupKey].length} Item${grouped[groupKey].length === 1 ? "" : "s"})`;
      listEl.appendChild(head);

      grouped[groupKey].forEach(sheet => {
        const rec = openedMap[sheet.id];
        const lastOpenedAt = (rec && rec.lastOpenedAt) || sheet.lastOpenedAt || 0;
        let statusPill = `<span class="badge" style="background:rgba(245,158,11,0.16); color:#fbbf24; font-size:9.5px;">\uD83D\uDD52 Never Opened</span>`;
        if (lastOpenedAt) {
          const days = Math.floor((now - lastOpenedAt) / 86400000);
          if (days <= 0) {
            statusPill = `<span class="badge" style="background:rgba(16,185,129,0.16); color:#34d399; font-size:9.5px;">\u2713 Today</span>`;
          } else if (days >= 7) {
            statusPill = `<span class="badge" style="background:rgba(244,63,94,0.18); color:#fb7185; font-size:9.5px;">\uD83D\uDD52 ${days}d ago</span>`;
          } else {
            statusPill = `<span class="badge" style="background:rgba(148,163,184,0.14); color:#cbd5e1; font-size:9.5px;">${days}d ago</span>`;
          }
        }

        let contentMatchSnippetHtml = "";
        if (term && sheet.content && sheet.content.toLowerCase().includes(term)) {
          const lowerBody = sheet.content.toLowerCase();
          const mIdx = lowerBody.indexOf(term);
          const start = Math.max(0, mIdx - 36);
          const end = Math.min(sheet.content.length, mIdx + term.length + 54);
          const rawSnip = sheet.content.slice(start, end).replace(/[\r\n#*`>|]+/g, " ").trim();
          const escTerm = escapeRegExp(term);
          const highlighted = rawSnip.replace(new RegExp(`(${escTerm})`, "ig"), `<mark style="background:rgba(56,189,248,0.28); color:#fff; padding:0 3px; border-radius:3px;">$1</mark>`);
          contentMatchSnippetHtml = `<div style="font-size:10.5px; color:#94a3b8; margin-top:3px; font-style:italic;">\u2026${highlighted}\u2026</div>`;
        }

        const typeBadge = sheet.isPdf
          ? `<span class="badge" style="background:rgba(56,189,248,0.2); color:#38bdf8; font-size:9.5px;">\uD83D\uDCC4 PDF (${sheet.pageCount || 1}p)</span>`
          : "";

        const row = document.createElement("div");
        row.className = "tree-node-row";
        row.style.marginBottom = "6px";
        row.innerHTML = `
          <div style="overflow:hidden; flex:1;">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <b style="font-size:13px; color:#fff;">${sheet.isPdf ? "\uD83D\uDCC4" : "\uD83D\uDCD6"} ${sheet.title}</b>
              ${typeBadge}
              ${statusPill}
            </div>
            <div style="font-size:11px; color:var(--text-muted);">${sheet.subtitle || sheet.id}</div>
            ${contentMatchSnippetHtml}
          </div>
          <button class="btn btn-cyan" style="padding:3px 10px; font-size:11px; flex-shrink:0;">Open \u2794</button>
        `;
        row.onclick = async () => {
          document.getElementById("modal-all-sheets-index")?.classList.remove("active");
          if (sheet.isPdf) {
            await openCompendiumStudio();
            await openPdfInCompendiumStudio(sheet.id);
          } else {
            await openCompendiumToSheet(sheet.id, sheet.subject, sheet.chapter);
          }
        };
        listEl.appendChild(row);
      });
    });
  }

  function openAiSheetArchitectModal() {
    renderApiVaultUI();
    safeSetText("ai-sheet-source-badge", "\uD83E\uDD16 Ready");
    pushHistoryState("modal-ai-sheet-architect");
    const m = document.getElementById("modal-ai-sheet-architect");
    if (m) m.classList.add("active");
  }

  async function runAiSheetArchitectTask(mode) {
    const sheet = currentCompSheets[activeCompSheetIndex];
    const manualKeyId = document.getElementById("ai-sheet-key-override")?.value || "WATERFALL_AUTO";
    const badge = document.getElementById("ai-sheet-source-badge");
    const customInst = document.getElementById("ai-sheet-custom-instruction")?.value.trim() || "";

    if (!sheet && mode !== "CUSTOM") {
      alert("Select or create a sheet first.");
      return;
    }

    if (badge) badge.innerText = "\u23F3 Generating Sheet Markdown...";

    let systemPrompt = "You are an elite SSC CGL Living Knowledge Sheet Architect. Return ONLY clean Markdown with KaTeX math ($...$ or $$...$$) and {{...}} around high-yield recall targets.";
    let userPrompt = "";

    if (mode === "AUTO_MASK") {
      userPrompt = `Wrap the 8 to 12 most important formulas, constitutional articles, key definitions, or exam traps inside this sheet with double curly braces {{...}} so they act as active recall masks. Preserve 100% of the existing Markdown text and structure:\n\n${sheet.content}`;
    } else if (mode === "ADD_TRAPS") {
      userPrompt = `Take this existing SSC CGL Knowledge Sheet and append a comprehensive '> [!trap]' callout block and a Markdown summary comparison table at the bottom covering high-frequency TCS traps for this topic:\n\n${sheet.content}`;
    } else {
      if (!customInst) {
        alert("Enter your custom instruction first.");
        return;
      }
      userPrompt = sheet
        ? `Current Sheet (${sheet.chapter} - ${sheet.title}):\n${sheet.content}\n\nInstruction: ${customInst}\nReturn the complete updated Markdown sheet.`
        : `Author a complete SSC CGL Living Knowledge Sheet for chapter ${activeCompChapter} on: ${customInst}. Use ### headings, > [!formula] and > [!trap] callouts, Markdown tables, and {{...}} around key recall facts.`;
    }

    try {
      const res = await AiGatewayService.executeMicroTask({
        taskType: "SHEET_EDIT",
        systemPrompt,
        userPrompt,
        expectJson: false,
        manualKeyId
      });

      if (badge) badge.innerText = `\u2713 Staged by: ${res.sourceLabel}`;
      document.getElementById("modal-ai-sheet-architect")?.classList.remove("active");

      openConceptEditorModal(!sheet);
      safeSetValue("concept-edit-body", res.rawText.trim());
      alert(`🪄 Sheet staged by ${res.sourceLabel}! Review the Markdown in the editor and tap 'Save Living Sheet' to commit.`);
    } catch (err) {
      if (badge) badge.innerText = "\u26A0\uFE0F Fallback to Clipboard";
      alert(err.message);
    }
  }

  async function openCompendiumToSheet(conceptId, targetSub, targetChap) {
    const openModals = document.querySelectorAll(".modal-overlay.active");
    openModals.forEach(m => m.classList.remove("active"));

    compendiumActiveDocType = "SHEET";
    activePdfId = null;

    let item = null;
    if (conceptId) {
      item = await ConceptService.get(conceptId);
    }
    if (!item && targetChap) {
      const all = await ConceptService.getAll();
      item = all.find(c => c.chapter === targetChap);
    }

    activeCompSubject = item ? item.subject : (targetSub || "QA");
    activeCompChapter = item ? item.chapter : (targetChap || "QA_PERCENTAGE");

    pushNavLayer("compendium-fullscreen-view", () => {
      safeSetDisplay("compendium-fullscreen-view", "none");
      toggleScratchpadCanvas(false);
    });
    safeSetDisplay("compendium-fullscreen-view", "flex");
    initCompendiumRecallTapHandler();
    bindSheetInkCanvasEvents();

    const subSelect = document.getElementById("comp-studio-subject-select");
    if (subSelect) subSelect.value = activeCompSubject;

    await handleCompStudioSubjectChange(activeCompSubject);
    if (item) {
      const chapSelect = document.getElementById("comp-studio-chapter-select");
      if (chapSelect && chapSelect.value !== item.chapter) {
        activeCompChapter = item.chapter;
        chapSelect.value = activeCompChapter;
        await renderCompStudioSheets();
      }
      const sheetIdx = currentCompSheets.findIndex(s => s.id === item.id);
      if (sheetIdx !== -1) {
        activeCompSheetIndex = sheetIdx;
        await renderActiveCompSheet();
      }
    }
  }

  async function handleCompStudioSubjectChange(sub) {
    activeCompSubject = sub;
    compendiumActiveDocType = "SHEET";
    activePdfId = null;
    const chapSelect = document.getElementById("comp-studio-chapter-select");
    if (!chapSelect) return;
    chapSelect.innerHTML = "";

    const allDossiers = await ConceptService.getAll();
    const canonChaps = (TAXONOMY[sub] && Array.isArray(TAXONOMY[sub].chapters)) ? TAXONOMY[sub].chapters : [];
    const existingChaps = [...new Set(allDossiers.filter(d => d.subject === sub).map(d => d.chapter))];
    const combined = [...new Set([...canonChaps, ...existingChaps])];

    combined.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.innerText = c;
      chapSelect.appendChild(opt);
    });

    if (combined.length > 0) {
      if (!combined.includes(activeCompChapter)) {
        activeCompChapter = combined[0];
      }
      chapSelect.value = activeCompChapter;
    }
    await renderCompStudioSheets();
  }

  async function handleCompStudioChapterChange(chap) {
    activeCompChapter = chap;
    compendiumActiveDocType = "SHEET";
    activePdfId = null;
    activeCompSheetIndex = 0;
    await renderCompStudioSheets();
  }

  async function renderCompStudioSheets() {
    const allDossiers = await ConceptService.getAll();
    currentCompSheets = allDossiers.filter(d => d.subject === activeCompSubject && d.chapter === activeCompChapter);
    const pdfIndex = await getPdfLibraryIndex();
    const chapterPdfs = pdfIndex.filter(p => p.subject === activeCompSubject && p.chapter === activeCompChapter);
    const otherSubPdfs = pdfIndex.filter(p => p.subject === activeCompSubject && p.chapter !== activeCompChapter);
    const visiblePdfs = [...chapterPdfs, ...otherSubPdfs];

    const tabsBar = document.getElementById("comp-studio-sheet-tabs");
    const docContent = document.getElementById("comp-studio-doc-content");
    if (tabsBar) tabsBar.innerHTML = "";
    if (docContent && compendiumActiveDocType !== "PDF") docContent.innerHTML = "";

    if (tabsBar) {
      visiblePdfs.forEach(pdfMeta => {
        const pTab = document.createElement("button");
        const isCurrentPdf = compendiumActiveDocType === "PDF" && activePdfId === pdfMeta.id;
        pTab.className = "comp-sheet-tab" + (isCurrentPdf ? " active" : "");
        pTab.innerHTML = `<span class="badge" style="background:rgba(56,189,248,0.22); color:#38bdf8; font-size:9px; margin-right:4px;">\uD83D\uDCC4 PDF</span>${pdfMeta.title} (${pdfMeta.pageCount || 1}p)`;
        pTab.addEventListener("click", () => {
          openPdfInCompendiumStudio(pdfMeta.id);
        });
        tabsBar.appendChild(pTab);
      });

      currentCompSheets.forEach((sheet, idx) => {
        const tab = document.createElement("button");
        const isCurrentSheet = compendiumActiveDocType === "SHEET" && idx === activeCompSheetIndex;
        tab.className = "comp-sheet-tab" + (isCurrentSheet ? " active" : "");
        tab.innerText = sheet.title || `Sheet ${idx + 1}`;
        tab.addEventListener("click", () => {
          compendiumActiveDocType = "SHEET";
          activePdfId = null;
          activeCompSheetIndex = idx;
          renderActiveCompSheet();
        });
        tabsBar.appendChild(tab);
      });
    }

    if (compendiumActiveDocType === "PDF" && activePdfId) {
      return;
    }

    if (currentCompSheets.length === 0) {
      if (chapterPdfs.length > 0) {
        await openPdfInCompendiumStudio(chapterPdfs[0].id);
        return;
      }
      if (docContent) {
        docContent.innerHTML = `
          <div style="text-align:center; padding:50px 14px; color:var(--text-muted);">
            <h3 style="font-size:16px; margin-bottom:8px; color:#fff;">No Topic Sheets in ${activeCompChapter}</h3>
            <p style="font-size:12px; margin-bottom:14px;">This chapter has no living sheets yet. Author your first sheet below, import a PDF, or use 🪄 AI Sheet Architect.</p>
            <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
              <button class="btn" onclick="CGL_OS.openConceptEditorModal(true)">+ Create First Sheet</button>
              <button class="btn btn-cyan" onclick="CGL_OS.triggerPdfUploadPrompt()">\uD83D\uDCC4 + Import PDF</button>
            </div>
          </div>
        `;
      }
      safeSetText("comp-linked-q-count", "0 Questions Linked");
      safeSetText("dock-drill-q-badge", "0 Qs");
      safeSetText("comp-mask-count-badge", "0 Masks \u2022 0 Highlights");
      return;
    }

    if (activeCompSheetIndex >= currentCompSheets.length) activeCompSheetIndex = 0;

    await renderActiveCompSheet();
  }

  async function renderActiveCompSheet() {
    if (compendiumActiveDocType === "PDF" && activePdfId) {
      await renderActivePdfPage(activePdfPageNum || 1);
      return;
    }

    compendiumActiveDocType = "SHEET";
    safeSetDisplay("comp-pdf-studio-bar", "none");
    safeSetDisplay("comp-pdf-thumbnail-strip", "none");
    safeSetDisplay("comp-pdf-canvas-wrap", "none");
    safeSetDisplay("comp-studio-doc-content", "block");

    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet) return;

    // Switch per-sheet ink context automatically
    switchScratchpadContext(`sheet_${sheet.id}`);

    const pdfCountInTabs = document.querySelectorAll("#comp-studio-sheet-tabs .comp-sheet-tab .badge").length;
    document.querySelectorAll("#comp-studio-sheet-tabs .comp-sheet-tab").forEach((t, i) => {
      const sheetIdx = i - pdfCountInTabs;
      t.classList.toggle("active", compendiumActiveDocType === "SHEET" && sheetIdx === activeCompSheetIndex);
    });

    safeSetText("comp-studio-header-title", sheet.title);
    safeSetText("comp-studio-header-sub", `${sheet.chapter} \u2022 Sheet ${activeCompSheetIndex + 1}/${currentCompSheets.length}`);

    // Load Paper Surface Preset (per-sheet override or follow global)
    const presetRec = await getRecord("store_notes", `paper_preset_${sheet.id}`);
    const savedPreset = presetRec && presetRec.preset ? presetRec.preset : "FOLLOW_GLOBAL";
    await setCompendiumPaperPreset(savedPreset, false);

    // Auto-Track Last Opened Date & Display Neglected/Recent Badge in Zen Header
    const prevOpenRec = await getRecord("store_notes", `last_opened_${sheet.id}`);
    const prevEpoch = prevOpenRec && prevOpenRec.lastOpenedAt ? prevOpenRec.lastOpenedAt : null;
    const badgeSpec = formatLastOpenedBadgeText(prevEpoch);
    const lastOpenedBadge = document.getElementById("comp-zen-last-opened-badge");
    if (lastOpenedBadge) {
      lastOpenedBadge.innerText = badgeSpec.text;
      lastOpenedBadge.style.color = badgeSpec.color;
      lastOpenedBadge.style.background = badgeSpec.bg;
    }
    await putRecord("store_notes", {
      id: `last_opened_${sheet.id}`,
      sheetId: sheet.id,
      lastOpenedAt: Date.now(),
      openCount: (prevOpenRec && prevOpenRec.openCount ? prevOpenRec.openCount : 0) + 1
    });

    const linkedQs = await ConceptService.getLinkedQuestions(sheet.id, sheet.chapter);
    safeSetText("comp-linked-q-count", `${linkedQs.length} Associated Question${linkedQs.length === 1 ? "" : "s"}`);
    safeSetText("dock-drill-q-badge", `${linkedQs.length} Qs`);
    safeSetText("comp-rail-q-badge", `${linkedQs.length} Qs`);
    safeSetText("comp-dock-drill-label", `Drill (${linkedQs.length})`);

    // Load persisted occurrence-indexed custom masks & 4-color highlights for this sheet
    const savedMasksRec = await getRecord("store_notes", `masks_${sheet.id}`);
    const rawMasks = savedMasksRec && Array.isArray(savedMasksRec.masks) ? savedMasksRec.masks : [];
    activeSheetCustomMasks = rawMasks.filter(m => {
      const p = parseMaskOrHighlightKey(m);
      return p.phrase && p.phrase !== "[object Object]";
    });

    const savedHlRec = await getRecord("store_notes", `highlights_${sheet.id}`);
    const rawHls = savedHlRec && Array.isArray(savedHlRec.highlights) ? savedHlRec.highlights : [];
    activeSheetHighlights = rawHls.filter(h => h && h.phrase && h.phrase !== "[object Object]");

    // Load persisted page-anchored stylus ink strokes & interactive media blocks
    const savedInkRec = await getRecord("store_notes", `sheet_ink_${sheet.id}`);
    activeSheetInkStrokes = savedInkRec && Array.isArray(savedInkRec.strokes) ? savedInkRec.strokes : [];
    sheetInkUndoStack = [];
    lastClearedSheetInkBackup = null;
    currentSheetInkStroke = null;
    activeEraserCursorPreview = null;
    lassoSelectionBox = null;
    lassoSelectedStrokeIndices = [];
    isDrawingSheetInk = false;

    const savedMediaRec = await getRecord("store_notes", `sheet_media_${sheet.id}`);
    activeSheetMediaBlocks = savedMediaRec && Array.isArray(savedMediaRec.blocks) ? savedMediaRec.blocks : [];

    await loadAndRenderActiveDocPinnedExcerpts(sheet.id);
    updateCompMaskAndHighlightBadge();

    // Live Mistake-to-Sheet Callout Banner & Rail Linked Questions List
    const perfMap = await PerformanceService.getQuestionPerformanceMap();
    const failedLinkedQs = linkedQs.filter(q => perfMap[q.id] && (perfMap[q.id].lastWasIncorrect || perfMap[q.id].wrong > 0));
    const mistakeSlot = document.getElementById("comp-sheet-trap-banner") || document.getElementById("comp-mistake-alert-slot");
    if (mistakeSlot) {
      if (failedLinkedQs.length > 0) {
        const unresolvedCount = failedLinkedQs.filter(q => perfMap[q.id]?.lastWasIncorrect).length;
        mistakeSlot.style.display = "block";
        mistakeSlot.innerHTML = `
          <div class="comp-mistake-callout-banner">
            <div>
              <div style="font-size:11.5px; font-weight:800; color:#fda4af;">
                \u26A0\uFE0F Exam Vulnerability Link: ${failedLinkedQs.length} Mistake Question${failedLinkedQs.length === 1 ? "" : "s"} Tied to This Sheet
                ${unresolvedCount > 0 ? `<span class="badge" style="background:#e11d48; color:#fff; font-size:9.5px; margin-left:4px;">${unresolvedCount} Unresolved Debt</span>` : ""}
              </div>
              <div style="font-size:10.5px; color:var(--text-muted); margin-top:2px;">
                Review the highlighted traps below, then clear your mistake debt in Untimed Dojo.
              </div>
            </div>
            <button class="btn btn-emerald" style="padding:4px 10px; font-size:11px; flex-shrink:0;" onclick="CGL_OS.launchFailedSheetQuestionsDojo()">\uD83E\uDDD8 Fix ${failedLinkedQs.length} Mistake${failedLinkedQs.length === 1 ? "" : "s"} in Dojo</button>
          </div>
        `;
      } else {
        mistakeSlot.style.display = "none";
        mistakeSlot.innerHTML = "";
      }
    }

    const railQsList = document.getElementById("comp-rail-linked-qs-list");
    if (railQsList) {
      if (linkedQs.length === 0) {
        railQsList.innerHTML = `<div style="color:var(--text-muted); font-size:11px; padding:6px 0;">No questions linked to ${sheet.chapter} yet.</div>`;
      } else {
        railQsList.innerHTML = linkedQs.slice(0, 12).map((q, idx) => {
          const p = perfMap[q.id];
          const statusDot = p
            ? (p.lastWasIncorrect ? `<span style="color:#fb7185;" title="Unresolved Mistake">\u25CF</span>` : `<span style="color:#34d399;" title="Solved">\u25CF</span>`)
            : `<span style="color:#64748b;" title="Unseen">\u25CB</span>`;
          const plainStem = String(q.questionText || "").replace(/[$#*`_~]/g, "").slice(0, 68);
          return `
            <div style="padding:5px 6px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center; gap:6px; cursor:pointer;" onclick="CGL_OS.closeCompendiumStudio(); CGL_OS.launchSingleQuestionDojo('${q.id}')">
              <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
                ${statusDot} <b style="color:var(--folio-heading, #e2e8f0);">Q${idx + 1}:</b> <span style="color:var(--text-muted);">${plainStem}...</span>
              </div>
              <span style="font-size:10px; color:var(--accent-cyan); flex-shrink:0;">Dojo \u2794</span>
            </div>
          `;
        }).join("");
      }
    }

    const toc = ConceptService.generateTOC(sheet.content);
    let tocHtml = "";
    if (toc.length > 0) {
      tocHtml = `
        <div class="sheet-toc-pill-wrap">
          <span style="font-size:10px; font-weight:800; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.8px; align-self:center;">Sections:</span>
          ${toc.map(item => `
            <a href="#${item.anchor}" class="anchor-pill" onclick="document.getElementById('${item.anchor}')?.scrollIntoView({behavior:'smooth'}); return false;">
              ${item.title}
            </a>
          `).join("")}
        </div>
      `;
    }

    let imgHtml = "";
    if (sheet.imageUrl && sheet.imageUrl.trim().length > 0) {
      imgHtml = `<div style="text-align:center; margin:18px 0;"><img src="${sheet.imageUrl}" style="max-height:300px; max-width:100%; border-radius:10px; border:1px solid var(--border-color);"></div>`;
    }

    const docContent = document.getElementById("comp-studio-doc-content");
    if (docContent) {
      docContent.innerHTML = `
        <div class="folio-header-meta" style="position:relative; z-index:45;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <span class="badge" style="background:#1f6feb;">${sheet.chapter}</span>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <button class="btn btn-secondary" style="padding:2px 8px; font-size:10px;" onclick="CGL_OS.triggerPdfUploadPrompt()" title="Import a local PDF into this chapter">\uD83D\uDCC4 +PDF</button>
              <button class="btn btn-secondary" style="padding:2px 8px; font-size:10px;" onclick="CGL_OS.triggerCompSheetImageUpload()" title="Insert or paste an image onto this sheet">\uD83D\uDDBC\uFE0F +Image</button>
              <button class="btn btn-secondary" style="padding:2px 8px; font-size:10px;" onclick="CGL_OS.addCompSheetStickyNote()" title="Add a movable sticky callout card">\uD83D\uDCCC +Sticky</button>
              <button class="btn btn-secondary" style="padding:2px 8px; font-size:10px;" onclick="CGL_OS.toggleCompendiumFolioInkMode()" title="Write directly on this sheet with stylus or finger">\u270D\uFE0F Direct Ink</button>
              <span style="font-size:10.5px; color:var(--text-muted); font-family:var(--font-mono);">ID: ${sheet.id}</span>
            </div>
          </div>
          <h1 class="folio-doc-title">${sheet.title}</h1>
          ${sheet.subtitle ? `<div class="folio-doc-subtitle">${sheet.subtitle}</div>` : ""}
        </div>
        ${tocHtml}
        ${imgHtml}
        <div id="comp-studio-doc-body" class="folio-prose-body">${formatRichText(sheet.content, [])}</div>
        <div id="comp-studio-inline-media-slot" style="margin-top:16px;"></div>

        <div class="folio-sheet-nav-footer" style="position:relative; z-index:45; display:flex; justify-content:space-between; align-items:center; margin-top:34px; padding-top:16px; border-top:1px solid var(--border-color);">
          <button class="btn btn-secondary" onclick="CGL_OS.navCompStudioSheet(-1)">[ \u2190 ] Previous Sheet</button>
          <span style="font-size:12px; font-weight:700; color:var(--text-muted); font-family:var(--font-mono);">Sheet ${activeCompSheetIndex + 1} of ${currentCompSheets.length}</span>
          <button class="btn btn-secondary" onclick="CGL_OS.navCompStudioSheet(1)">Next Sheet [ \u2192 ]</button>
        </div>
      `;
      const bodyEl = document.getElementById("comp-studio-doc-body");
      if (bodyEl) {
        applyDomMasksAndHighlights(bodyEl, activeSheetCustomMasks, activeSheetHighlights);
      }
      renderActiveSheetMediaBlocks();
      applyCompendiumZoomStyle();
      updateRecallProgressCounter();
      syncSheetInkPointerPassthrough();
      setTimeout(syncSheetInkCanvasGeometry, 60);
    }

    renderCompMarginAnnotationsList();

    const noteKey = `scratch_${sheet.id}`;
    const savedNote = await getRecord("store_notes", noteKey);
    safeSetValue("comp-studio-scratchpad", savedNote ? savedNote.content : "");
  }

  function renderCompMarginAnnotationsList() {
    const listEl = document.getElementById("comp-rail-annotations-list") || document.getElementById("comp-margin-annotations-list");
    const totalCount = activeSheetCustomMasks.length + activeSheetHighlights.length;
    safeSetText("comp-rail-ann-count", `${totalCount} item${totalCount === 1 ? "" : "s"}`);
    if (!listEl) return;

    if (totalCount === 0) {
      listEl.innerHTML = `<span style="font-size:11px; color:var(--text-muted);">Slide your finger/stylus across words in 🖌️ Mask or 🖍️ Highlight mode (or tap any word) to build your surgical sheet index.</span>`;
      return;
    }

    const chips = [];
    activeSheetCustomMasks.forEach((m, idx) => {
      const parsed = parseMaskOrHighlightKey(m);
      const phrase = parsed.phrase;
      const occ = typeof parsed.occurrence === "number" ? `#${parsed.occurrence + 1}` : "#1";
      if (!phrase) return;
      chips.push(`
        <span class="margin-ann-chip mask-chip" title="Tap to remove custom mask" onclick="CGL_OS.removeCustomMaskByIndex(${idx})">
          \uD83D\uDE48 ${phrase.length > 24 ? phrase.slice(0, 22) + "\u2026" : phrase} <small style="opacity:0.7;">(${occ}) \u2715</small>
        </span>
      `);
    });

    activeSheetHighlights.forEach((h, idx) => {
      if (!h || !h.phrase) return;
      const occ = typeof h.occurrence === "number" ? `#${h.occurrence + 1}` : "#1";
      const c = h.color || "yellow";
      chips.push(`
        <span class="margin-ann-chip hl-chip-${c}" title="Tap to remove highlight" onclick="CGL_OS.removeCustomHighlightByIndex(${idx})">
          \uD83D\uDD8D\uFE0F ${h.phrase.length > 24 ? h.phrase.slice(0, 22) + "\u2026" : h.phrase} <small style="opacity:0.7;">(${occ}) \u2715</small>
        </span>
      `);
    });

    listEl.innerHTML = chips.join("");
  }

  async function launchFailedSheetQuestionsDojo() {
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet) return;
    const linked = await ConceptService.getLinkedQuestions(sheet.id, sheet.chapter);
    const perfMap = await PerformanceService.getQuestionPerformanceMap();
    const failed = linked.filter(q => perfMap[q.id] && (perfMap[q.id].lastWasIncorrect || perfMap[q.id].wrong > 0));
    if (failed.length === 0) {
      alert("No failed questions linked to this sheet.");
      return;
    }
    closeCompendiumStudio();
    await openDojoSessionWithQuestions(failed, `Mistake Clinic: ${sheet.title}`, `**${sheet.title}:** Clearing ${failed.length} linked mistake(s)`);
  }

  function navCompStudioSheet(step) {
    if (compendiumActiveDocType === "PDF" && activePdfId) {
      navActivePdfPage(step);
      return;
    }
    if (currentCompSheets.length === 0) return;
    activeCompSheetIndex += step;
    if (activeCompSheetIndex < 0) activeCompSheetIndex = currentCompSheets.length - 1;
    if (activeCompSheetIndex >= currentCompSheets.length) activeCompSheetIndex = 0;
    renderActiveCompSheet();
  }

  async function autoSaveCompScratchpad(val) {
    const docKey = compendiumActiveDocType === "PDF" && activePdfId
      ? `scratch_${activePdfId}`
      : (currentCompSheets[activeCompSheetIndex] ? `scratch_${currentCompSheets[activeCompSheetIndex].id}` : null);
    if (!docKey) return;
    await putRecord("store_notes", { id: docKey, content: val, timestamp: Date.now() });
    const st = document.getElementById("comp-scratchpad-status");
    if (st) {
      st.style.display = "inline";
      setTimeout(() => { st.style.display = "none"; }, 1500);
    }
  }

  async function deleteCurrentCompendiumSheet() {
    if (compendiumActiveDocType === "PDF" && activePdfId) {
      await deleteActivePdfDocument();
      return;
    }
    if (!currentCompSheets || currentCompSheets.length === 0) return;
    const curr = currentCompSheets[activeCompSheetIndex];
    if (confirm(`Permanently delete living sheet: "${curr.title}"?`)) {
      await ConceptService.delete(curr.id);
      await renderCompStudioSheets();
    }
  }

  async function promptCreateNewChapter() {
    const chapName = prompt(`Enter new chapter tag for ${activeCompSubject} (e.g. ${activeCompSubject}_NEW_TOPIC):`);
    if (!chapName || !chapName.trim()) return;

    try {
      const formatted = await TaxonomyService.addChapter(activeCompSubject, chapName);
      await handleCompStudioSubjectChange(activeCompSubject);
      const cSel = document.getElementById("comp-studio-chapter-select");
      if (cSel) cSel.value = formatted;
      await handleCompStudioChapterChange(formatted);
    } catch (err) {
      alert(err.message);
    }
  }

  function insertDossierSnippet(type) {
    const textarea = document.getElementById("concept-edit-body");
    if (!textarea) return;
    let snippet = "";
    if (type === "MASK") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        const selected = textarea.value.substring(start, end);
        textarea.value = textarea.value.substring(0, start) + `{{${selected}}}` + textarea.value.substring(end);
        textarea.focus();
        return;
      }
      snippet = "{{target formula or term}}";
    }
    if (type === "FORMULA") snippet = "\n> [!formula]\n> **Core Identity:**\n> $${{a^2 + b^2 = c^2}}$$\n";
    if (type === "TRAP") snippet = "\n> [!trap]\n> **Critical TCS Trap:**\n> Verify whether {{radius or diameter}} is specified.\n";
    if (type === "TABLE") snippet = "\n| Condition | Method | Shortcut |\n| :--- | :--- | :--- |\n| Case 1 | Direct Tangent | {{$2\\sqrt{r_1 r_2}$}} |\n";
    textarea.value += snippet;
    textarea.focus();
  }

  async function launchCurrentSheetQuestionsDrill(openInDojo = false) {
    const sheet = currentCompSheets[activeCompSheetIndex];
    const chap = (compendiumActiveDocType === "PDF" ? activeCompChapter : (sheet ? sheet.chapter : activeCompChapter));
    const sheetId = sheet ? sheet.id : null;
    const titleLabel = compendiumActiveDocType === "PDF" && activePdfMeta ? activePdfMeta.title : (sheet ? sheet.title : chap);

    closeCompendiumStudio();
    const linked = await ConceptService.getLinkedQuestions(sheetId, chap);

    if (linked.length === 0) {
      alert(`No questions in bank for ${chap}.`);
      return;
    }

    if (openInDojo) {
      await openDojoSessionWithQuestions(linked, `Sheet Dojo: ${titleLabel}`, `**${titleLabel}**`);
    } else {
      const instance = await MockService.generate({
        title: `Sheet Practice: ${titleLabel}`,
        explicitQuestionIds: linked.map(q => q.id),
        count: Math.min(25, linked.length),
        mode: "RANDOM"
      });
      await MockService.launchMockSession(instance);
    }
  }

  function openCompendiumStudio() {
    pushNavLayer("compendium-fullscreen-view", () => {
      safeSetDisplay("compendium-fullscreen-view", "none");
      toggleScratchpadCanvas(false);
    });
    safeSetDisplay("compendium-fullscreen-view", "flex");
    initCompendiumRecallTapHandler();
    bindSheetInkCanvasEvents();
    handleCompStudioSubjectChange(activeCompSubject || "QA");
  }

  function closeCompendiumStudio() {
    safeSetDisplay("compendium-fullscreen-view", "none");
    toggleScratchpadCanvas(false);
    if (compSheetInkMode) toggleCompSheetInkMode(false);
    toggleCompStudioMoreMenu(false);
    cancelStagedExcerpt();
    document.getElementById("comp-dock-highlight-popover")?.classList.remove("open");
  }

  async function openConceptEditorModal(isNew = true) {
    closeCompMorePopover();
    currentConceptImageBase64 = "";
    safeSetText("concept-editor-title", isNew ? "Add Topic Sheet" : "Edit Topic Sheet");

    const subSel = document.getElementById("concept-edit-subject");
    if (subSel && subSel.options.length === 0) {
      await syncAllTaxonomyDropdowns();
    }

    if (isNew || currentCompSheets.length === 0) {
      const targetSub = activeCompSubject || "QA";
      safeSetValue("concept-edit-id", "top_" + Date.now());
      safeSetValue("concept-edit-subject", targetSub);
      await syncEditorChapterDropdown("concept-edit-subject", "concept-edit-chapter");
      safeSetValue("concept-edit-chapter", activeCompChapter || "QA_PERCENTAGE");
      safeSetValue("concept-edit-title", "");
      safeSetValue("concept-edit-sub", "");
      safeSetValue("concept-edit-body", "");
      safeSetValue("concept-edit-img-url", "");
      safeSetValue("concept-edit-img-file", "");
    } else {
      const curr = currentCompSheets[activeCompSheetIndex];
      safeSetValue("concept-edit-id", curr.id);
      safeSetValue("concept-edit-subject", curr.subject);
      await syncEditorChapterDropdown("concept-edit-subject", "concept-edit-chapter");
      if (curr.chapter) {
        const chSel = document.getElementById("concept-edit-chapter");
        if (chSel && !Array.from(chSel.options).some(o => o.value === curr.chapter)) {
          const opt = document.createElement("option");
          opt.value = curr.chapter;
          opt.innerText = curr.chapter;
          chSel.appendChild(opt);
        }
      }
      safeSetValue("concept-edit-chapter", curr.chapter);
      safeSetValue("concept-edit-title", curr.title);
      safeSetValue("concept-edit-sub", curr.subtitle || "");
      safeSetValue("concept-edit-body", curr.content);
      safeSetValue("concept-edit-img-url", curr.imageUrl || "");
      safeSetValue("concept-edit-img-file", "");
    }

    pushHistoryState("modal-concept-editor");
    const m = document.getElementById("modal-concept-editor");
    if (m) m.classList.add("active");
  }

  async function handleConceptImageUpload(input) {
    if (input.files && input.files[0]) {
      currentConceptImageBase64 = await compressImageFile(input.files[0]);
    }
  }

  async function saveConceptCard() {
    const id = document.getElementById("concept-edit-id")?.value;
    const subject = document.getElementById("concept-edit-subject")?.value;
    const chapter = document.getElementById("concept-edit-chapter")?.value.trim().toUpperCase();
    const title = document.getElementById("concept-edit-title")?.value.trim();
    const subtitle = document.getElementById("concept-edit-sub")?.value.trim();
    const content = document.getElementById("concept-edit-body")?.value.trim();
    const urlInput = document.getElementById("concept-edit-img-url")?.value.trim();

    if (!title || !content || !chapter) {
      alert("Chapter, Topic Title, and Content are required.");
      return;
    }

    const obj = {
      id: id,
      subject: subject,
      chapter: chapter,
      title: title,
      subtitle: subtitle,
      content: content,
      imageUrl: currentConceptImageBase64 || urlInput,
      timestamp: Date.now()
    };

    const existing = await ConceptService.get(id);
    if (existing) {
      await ConceptService.update(id, obj);
    } else {
      await ConceptService.create(obj);
    }

    const m = document.getElementById("modal-concept-editor");
    if (m) m.classList.remove("active");
    openCompendiumToSheet(id, subject, chapter);
  }

  function openOmniSearchModal() {
    openAllSheetsIndexModal();
  }

  async function executeOmniSearch(keyword) {
    const list = document.getElementById("comp-omni-results-list");
    if (!list) return;
    const term = keyword.trim().toLowerCase();
    if (!term) {
      list.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px;">Type keywords above to query across all living sheets.</p>`;
      return;
    }

    const allDossiers = await ConceptService.getAll();
    const results = allDossiers.filter(d =>
      (d.id && d.id.toLowerCase().includes(term)) ||
      (d.title && d.title.toLowerCase().includes(term)) ||
      (d.subtitle && d.subtitle.toLowerCase().includes(term)) ||
      (d.chapter && d.chapter.toLowerCase().includes(term)) ||
      (d.content && d.content.toLowerCase().includes(term))
    );

    list.innerHTML = "";
    if (results.length === 0) {
      list.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px;">No matching formulas, traps, or sheets found.</p>`;
      return;
    }

    results.forEach(res => {
      const div = document.createElement("div");
      div.className = "card";
      div.style.padding = "10px";
      div.style.marginBottom = "8px";
      div.style.cursor = "pointer";
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span class="badge" style="background:#1f6feb;">${res.subject} \u2022 ${res.chapter}</span>
          <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-muted);">${res.id}</span>
        </div>
        <b style="font-size:14px; color:#fff;">${res.title}</b>
        <div style="font-size:11px; color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom:4px;">${res.subtitle || ""}</div>
        <div style="font-size:12px; color:var(--text-muted); max-height:40px; overflow:hidden; text-overflow:ellipsis;">${res.content.slice(0, 100)}...</div>
      `;
      div.addEventListener("click", () => {
        const modal = document.getElementById("modal-comp-omni-search");
        if (modal) modal.classList.remove("active");
        openCompendiumToSheet(res.id, res.subject, res.chapter);
      });
      list.appendChild(div);
    });
  }
  /* ==========================================================================
   * SECTION 26: SYNAPSE KNOWLEDGE EXPLORER (WITH DOJO & TIMED DRILL LAUNCH)
   * ========================================================================== */
  async function openSynapseGraphModal() {
    synapseCurrentLevel = "SUBJECTS";
    synapseActiveSubject = null;
    synapseActiveChapter = null;
    renderSynapseExplorer();

    pushNavLayer("modal-synapse-tree", () => {
      const m = document.getElementById("modal-synapse-tree");
      if (m) m.classList.remove("active");
    });
    const m = document.getElementById("modal-synapse-tree");
    if (m) m.classList.add("active");
  }

  async function renderSynapseExplorer() {
    const rootContainer = document.getElementById("synapse-dom-tree-root");
    if (!rootContainer) return;
    rootContainer.innerHTML = "";

    const allQs = await getAllRecords("store_questions");
    const allConcepts = await ConceptService.getAll();
    const taxonomy = await TaxonomyService.getTaxonomy();

    const breadcrumb = document.createElement("div");
    breadcrumb.style.cssText = "display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:12px; color:var(--accent-cyan); flex-wrap:wrap;";
    breadcrumb.innerHTML = `
      <span style="cursor:pointer;" onclick="CGL_OS.setSynapseLevel('SUBJECTS')">All Subjects</span>
      ${synapseActiveSubject ? ` \u2794 <span style="cursor:pointer;" onclick="CGL_OS.setSynapseLevel('CHAPTERS', '${synapseActiveSubject}')">${synapseActiveSubject}</span>` : ""}
      ${synapseActiveChapter ? ` \u2794 <b>${synapseActiveChapter}</b>` : ""}
    `;
    rootContainer.appendChild(breadcrumb);

    if (synapseCurrentLevel === "SUBJECTS") {
      const grid = document.createElement("div");
      grid.style.cssText = "display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;";
      Object.keys(taxonomy).forEach(sKey => {
        const sub = taxonomy[sKey];
        const qCount = allQs.filter(q => q.subject === sKey).length;
        const cCount = allConcepts.filter(c => c.subject === sKey).length;

        const tile = document.createElement("div");
        tile.className = "card";
        tile.style.cssText = "cursor:pointer; padding:14px; margin-bottom:0;";
        tile.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <b style="font-size:14px; color:#fff;">${sub.name}</b>
            <span class="badge" style="background:#1f6feb;">${sKey}</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:8px;">
            ${sub.chapters.length} Chapters \u2022 ${qCount} Questions \u2022 ${cCount} Sheets
          </div>
        `;
        tile.onclick = () => setSynapseLevel("CHAPTERS", sKey);
        grid.appendChild(tile);
      });
      rootContainer.appendChild(grid);
    } else if (synapseCurrentLevel === "CHAPTERS") {
      const sub = taxonomy[synapseActiveSubject];
      const list = document.createElement("div");

      sub.chapters.forEach(chap => {
        const chapQs = allQs.filter(q => q.subject === synapseActiveSubject && q.chapter === chap);
        const chapSheets = allConcepts.filter(c => c.subject === synapseActiveSubject && c.chapter === chap);

        const row = document.createElement("div");
        row.className = "tree-node-row";
        row.style.marginBottom = "6px";
        row.innerHTML = `
          <div style="overflow:hidden; flex:1;" onclick="CGL_OS.setSynapseLevel('CONCEPTS', '${synapseActiveSubject}', '${chap}')">
            <b style="color:#fff; font-size:13px;">${chap}</b>
            <div style="font-size:10.5px; color:var(--text-muted);">${chapQs.length} Qs \u2022 ${chapSheets.length} Living Sheets</div>
          </div>
          <div style="display:flex; gap:5px; flex-wrap:wrap;">
            <button class="btn btn-emerald" style="padding:2px 8px; font-size:10.5px;" onclick="CGL_OS.launchDirectChapterDrill('${synapseActiveSubject}', '${chap}', true)">\uD83E\uDDD8 Dojo</button>
            <button class="btn btn-secondary" style="padding:2px 8px; font-size:10.5px;" onclick="CGL_OS.launchDirectChapterDrill('${synapseActiveSubject}', '${chap}', false)">\u26A1 Timed</button>
            <button class="btn btn-cyan" style="padding:2px 8px; font-size:10.5px;" onclick="CGL_OS.setSynapseLevel('CONCEPTS', '${synapseActiveSubject}', '${chap}')">Sheets \u2794</button>
          </div>
        `;
        list.appendChild(row);
      });
      rootContainer.appendChild(list);
    } else if (synapseCurrentLevel === "CONCEPTS") {
      const chapSheets = allConcepts.filter(c => c.subject === synapseActiveSubject && c.chapter === synapseActiveChapter);
      const chapQs = allQs.filter(q => q.subject === synapseActiveSubject && q.chapter === synapseActiveChapter);

      const header = document.createElement("div");
      header.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;";
      header.innerHTML = `
        <span style="font-weight:700; color:#fff;">${synapseActiveChapter} Inventory (${chapQs.length} Qs, ${chapSheets.length} Sheets)</span>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-emerald" style="padding:4px 10px; font-size:11px;" onclick="CGL_OS.launchDirectChapterDrill('${synapseActiveSubject}', '${synapseActiveChapter}', true)">\uD83E\uDDD8 Dojo Chapter</button>
          <button class="btn" style="padding:4px 10px; font-size:11px;" onclick="CGL_OS.launchDirectChapterDrill('${synapseActiveSubject}', '${synapseActiveChapter}', false)">\u26A1 Timed Chapter (${chapQs.length} Qs)</button>
        </div>
      `;
      rootContainer.appendChild(header);

      chapSheets.forEach(sheet => {
        const item = document.createElement("div");
        item.className = "card";
        item.style.padding = "10px";
        item.style.marginBottom = "8px";
        item.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <div>
              <b style="color:var(--accent-cyan); font-size:13px;">\uD83D\uDCD6 ${sheet.title}</b>
              <div style="font-size:11px; color:var(--text-muted);">${sheet.subtitle || ""}</div>
            </div>
            <div style="display:flex; gap:5px;">
              <button class="btn btn-secondary" style="padding:3px 8px; font-size:10px;" onclick="CGL_OS.openCompendiumToSheet('${sheet.id}', '${synapseActiveSubject}', '${synapseActiveChapter}')">Read Sheet</button>
              <button class="btn btn-emerald" style="padding:3px 8px; font-size:10px;" onclick="CGL_OS.launchDirectSheetDrill('${sheet.id}', '${synapseActiveSubject}', '${synapseActiveChapter}', true)">\uD83E\uDDD8 Dojo</button>
              <button class="btn btn-cyan" style="padding:3px 8px; font-size:10px;" onclick="CGL_OS.launchDirectSheetDrill('${sheet.id}', '${synapseActiveSubject}', '${synapseActiveChapter}', false)">\u26A1 Drill</button>
            </div>
          </div>
        `;
        rootContainer.appendChild(item);
      });
    }
  }

  function setSynapseLevel(level, subject = null, chapter = null) {
    synapseCurrentLevel = level;
    if (subject) synapseActiveSubject = subject;
    if (chapter) synapseActiveChapter = chapter;
    renderSynapseExplorer();
  }

  async function launchDirectChapterDrill(subKey, chap, openInDojo = false) {
    const modal = document.getElementById("modal-synapse-tree");
    if (modal) modal.classList.remove("active");
    const instance = await MockService.generate({
      title: `${chap} Master Drill`,
      subject: subKey,
      chapter: chap,
      count: 25,
      mode: "RANDOM",
      shuffleOptions: true
    });
    if (!instance.questions || instance.questions.length === 0) {
      alert(`Zero questions currently banked in ${chap}.`);
      return;
    }
    if (openInDojo) {
      await openDojoSessionWithQuestions(instance.questions, `${chap} Dojo Clinic`);
    } else {
      await MockService.launchMockSession(instance);
    }
  }

  async function launchDirectSheetDrill(conceptId, subject, chapter, openInDojo = false) {
    const modal = document.getElementById("modal-synapse-tree");
    if (modal) modal.classList.remove("active");
    const linkedQs = await ConceptService.getLinkedQuestions(conceptId, chapter);
    if (linkedQs.length === 0) {
      alert(`No questions linked to sheet ${conceptId}.`);
      return;
    }
    if (openInDojo) {
      await openDojoSessionWithQuestions(linkedQs, `Sheet Dojo: ${conceptId}`);
    } else {
      const instance = await MockService.generate({
        title: `Sheet Practice: ${conceptId}`,
        explicitQuestionIds: linkedQs.map(q => q.id),
        count: linkedQs.length,
        mode: "RANDOM"
      });
      await MockService.launchMockSession(instance);
    }
  }

  /* ==========================================================================
   * SECTION 27: DASHBOARD & DAILY AUTOPILOT ROUTINE CONTROLLER
   * ========================================================================== */
  function switchDashboardDiagnosticTab(tabKey, btnEl) {
    ["dash-diag-tab-mastery", "dash-diag-tab-syllabus", "dash-diag-tab-traps"].forEach(id => {
      const b = document.getElementById(id);
      if (b) b.classList.toggle("active", b === btnEl);
    });
    document.querySelectorAll(".dash-diag-tab-btn").forEach(b => {
      b.classList.toggle("active", b === btnEl);
    });
    const panes = ["MASTERY", "SYLLABUS", "TRAPS"];
    panes.forEach(k => {
      const pane = document.getElementById(`dash-diag-pane-${k}`);
      if (pane) {
        const isActive = k === tabKey;
        pane.classList.toggle("active", isActive);
        pane.style.display = isActive ? "block" : "none";
      }
    });
  }

  async function renderDashboard() {
    const allQs = await getAllRecords("store_questions");
    const allConcepts = await ConceptService.getAll();
    const metrics = await PerformanceService.calculateGlobalMetrics();
    const weakChapters = await PerformanceService.getWeakChapters();
    const neglect = await PerformanceService.calculateNeglect();
    const completedAttempts = await PerformanceService.getHistoricalAttempts();
    const perfMap = await PerformanceService.getQuestionPerformanceMap();

    safeSetText("dash-stat-questions", allQs.length);
    safeSetText("dash-stat-sheets", allConcepts.length);
    safeSetText("dash-stat-accuracy", metrics.totalMocks > 0 ? `${metrics.accuracy}%` : "--");
    safeSetText("dash-stat-weak", weakChapters.length);
    const hrs = Math.floor((metrics.totalStudyTimeSec || 0) / 3600);
    const mins = Math.floor(((metrics.totalStudyTimeSec || 0) % 3600) / 60);
    safeSetText("dash-stat-time", `${hrs}h ${mins}m`);

    const mistakeDebtCount = allQs.filter(q => perfMap[q.id] && perfMap[q.id].lastWasIncorrect).length;
    const starredCount = allQs.filter(q => q.bookmarked).length;

    if (completedAttempts.length === 0) {
      safeSetText("dash-continue-title", "Baseline Calibration Needed");
      safeSetText("dash-continue-sub", "Zero completed tests detected. Tap to run diagnostic onboarding mock.");
    } else if (mistakeDebtCount > 0 || starredCount > 0) {
      safeSetText("dash-continue-title", `Daily Priority Queue (${mistakeDebtCount} Mistake Debts \u2022 ${starredCount} Starred)`);
      safeSetText("dash-continue-sub", `Combines unresolved mistakes, ${neglect ? neglect.chapter + " decay" : "weak chapters"}, and unseen problems`);
    } else if (weakChapters.length > 0) {
      const targetWeak = weakChapters[0];
      safeSetText("dash-continue-title", `${targetWeak.chapter} \u2014 Weakness Drill`);
      safeSetText("dash-continue-sub", `Current accuracy: ${targetWeak.accuracy}% (${targetWeak.wrong} incorrect answers recorded)`);
    } else {
      safeSetText("dash-continue-title", "Comprehensive Practice \u2014 Daily Sprint");
      safeSetText("dash-continue-sub", "All syllabus chapters currently within nominal accuracy bands");
    }

    const weakListContainer = document.getElementById("dash-weak-areas-list");
    if (weakListContainer) {
      weakListContainer.innerHTML = "";
      if (completedAttempts.length === 0) {
        weakListContainer.innerHTML = `<p style="font-size:11.5px; color:var(--text-muted); padding:10px 0;">Awaiting baseline diagnostic telemetry.</p>`;
      } else if (weakChapters.length === 0) {
        weakListContainer.innerHTML = `<p style="font-size:12px; color:var(--status-green); padding:10px 0;">\u2713 Zero weak chapters detected! Excellent mastery.</p>`;
      } else {
        weakChapters.slice(0, 4).forEach((w, i) => {
          const colorIcon = i === 0 ? "\uD83D\uDD34" : (i === 1 ? "\uD83D\uDFE0" : "\uD83D\uDFE1");
          const row = document.createElement("div");
          row.className = "weak-item-row";
          row.style.cursor = "pointer";
          row.innerHTML = `
            <span>${colorIcon} <b>${w.chapter}</b></span>
            <span style="font-family:var(--font-mono); color:var(--status-red);">${w.accuracy}% (${w.attempted}Q)</span>
          `;
          row.onclick = () => openChapterInspector(w.subject, w.chapter);
          weakListContainer.appendChild(row);
        });
      }
    }

    renderDashboardSubjectBatteries(completedAttempts);

    safeSetText("kpi-total-mocks", metrics.totalMocks);
    safeSetText("kpi-global-acc", metrics.totalMocks > 0 ? `${metrics.accuracy}%` : "--");
    safeSetText("kpi-avg-speed", metrics.totalMocks > 0 ? `${metrics.avgSpeed}s` : "--");
    safeSetText("kpi-traps-hit", metrics.trapsHit);

    const circleGauge = document.getElementById("gauge-acc-circle");
    if (circleGauge) {
      circleGauge.setAttribute("stroke-dasharray", `${metrics.accuracy}, 100`);
      circleGauge.style.stroke = metrics.accuracy >= 80 ? "var(--status-green-border)" : (metrics.accuracy >= 65 ? "var(--status-amber)" : "var(--status-red)");
    }

    const eriVal = document.getElementById("eri-score-val");
    const eriTier = document.getElementById("eri-status-tier");
    const eriCircle = document.getElementById("eri-gauge-circle");
    if (eriVal) eriVal.innerText = metrics.eri;
    if (eriCircle) eriCircle.setAttribute("stroke-dasharray", `${metrics.eri}, 100`);
    if (eriTier) {
      eriTier.innerText = metrics.eri >= 80 ? "Tier-1 Formidable" : (metrics.eri >= 65 ? "Competitive Form" : "Calibrating");
    }

    safeSetText("eri-sub-acc", `Acc: ${metrics.accComp}/50`);
    safeSetText("eri-sub-vel", `Vel: ${metrics.velComp}/30`);
    safeSetText("eri-sub-exp", `Exp: ${metrics.consistencyComp}/20`);

    renderDashboardTrapHeatBar(completedAttempts);

    const negAlert = document.getElementById("dash-neglect-alert");
    if (negAlert) {
      if (neglect) {
        negAlert.style.display = "flex";
        safeSetText("dash-neglect-text", `${neglect.chapter} untouched for ${neglect.days} days.`);
        const drillBtn = document.getElementById("btn-neglect-drill");
        if (drillBtn) {
          drillBtn.onclick = () => launchDirectChapterDrill(neglect.subject, neglect.chapter, false);
        }
      } else {
        negAlert.style.display = "none";
      }
    }

    await renderDashboardBlueprints();
    await renderRecentHistory(completedAttempts);
    await renderDrilldownSubjectLevel();
  }

  function renderDashboardTrapHeatBar(completed) {
    const heatBar = document.getElementById("dash-trap-heat-bar");
    const legend = document.getElementById("dash-trap-legend");
    if (!heatBar || !legend) return;

    heatBar.innerHTML = "";
    legend.innerHTML = "";

    const trapTally = {};
    let totalTraps = 0;

    completed.forEach(att => {
      if (att.userResponses) {
        Object.values(att.userResponses).forEach(r => {
          if (r && r.errorTag && r.errorTag !== "UNCLASSIFIED" && r.errorTag !== "VALID_CALCULATED_RISK" && r.errorTag !== "SPEED_MASTERY") {
            trapTally[r.errorTag] = (trapTally[r.errorTag] || 0) + 1;
            totalTraps++;
          }
        });
      }
    });

    const trapColors = {
      TIME_TRAP_Q4: "#f43f5e",
      ABANDONED_TIME_SINK: "#f97316",
      SECOND_GUESS_BLUNDER: "#f59e0b",
      PANIC_SLIP: "#e11d48",
      SPEED_MISREAD: "#ec4899",
      CALCULATION_SLIP: "#38bdf8",
      CONCEPT_VOID: "#8b5cf6",
      FORMULA_AMNESIA: "#a855f7",
      READING_TRAP: "#06b6d4"
    };

    if (totalTraps === 0) {
      heatBar.innerHTML = `<div style="width:100%; height:100%; background:rgba(16,185,129,0.2); display:flex; align-items:center; justify-content:center; font-size:10px; color:var(--status-green);">Zero cognitive trap penalties recorded. Clean execution!</div>`;
      legend.innerHTML = `<span style="font-size:10px; color:var(--status-green);">Clean Decision Trail \u2022 No Traps</span>`;
      return;
    }

    Object.keys(trapTally).forEach(trap => {
      const count = trapTally[trap];
      const pct = ((count / totalTraps) * 100).toFixed(1);
      const color = trapColors[trap] || "#64748b";

      const seg = document.createElement("div");
      seg.className = "trap-heat-seg";
      seg.style.width = `${pct}%`;
      seg.style.backgroundColor = color;
      seg.title = `${trap.replace(/_/g, " ")}: ${count} (${pct}%)`;
      seg.onclick = () => openTrapClinicModal(trap);
      heatBar.appendChild(seg);

      const leg = document.createElement("div");
      leg.className = "trap-legend-pill";
      leg.innerHTML = `<span style="width:7px; height:7px; border-radius:50%; background:${color};"></span><span>${trap.replace(/_/g, " ")} (${count})</span>`;
      leg.onclick = () => openTrapClinicModal(trap);
      legend.appendChild(leg);
    });
  }

  async function launchContinueTrainingDrill(openInDojo = false) {
    const completed = await PerformanceService.getHistoricalAttempts();
    if (completed.length === 0 && !openInDojo) {
      pushHistoryState("modal-onboarding-baseline");
      const modal = document.getElementById("modal-onboarding-baseline");
      if (modal) modal.classList.add("active");
      return;
    }

    const allQs = await getAllRecords("store_questions");
    const perfMap = await PerformanceService.getQuestionPerformanceMap();
    const neglect = await PerformanceService.calculateNeglect();
    const weaks = await PerformanceService.getWeakChapters();

    const selectedQueue = [];
    const usedIds = new Set();
    const targetCount = 20;
    const nowEpoch = Date.now();
    const EIGHTEEN_HOURS_MS = 18 * 3600 * 1000;

    // 18-Hour Spaced Cooling Lock for Timed Daily Priority Queue (prevent rote option recall)
    const cooledDebtCandidates = allQs.filter(q => {
      const st = perfMap[q.id];
      const isDebt = st && st.lastWasIncorrect;
      if (!isDebt && !q.bookmarked) return false;
      if (!openInDojo && isDebt) {
        const elapsed = nowEpoch - (st.lastIncorrectEpoch || st.lastAttemptEpoch || 0);
        return elapsed >= EIGHTEEN_HOURS_MS;
      }
      return true;
    });

    const fallbackAllDebts = allQs.filter(q => (perfMap[q.id] && perfMap[q.id].lastWasIncorrect) || q.bookmarked);
    const debtPool = MockService.shuffle(cooledDebtCandidates.length > 0 ? cooledDebtCandidates : fallbackAllDebts);
    for (const q of debtPool) {
      if (selectedQueue.length >= 8) break;
      if (!q.parentPassageId && !usedIds.has(q.id)) {
        selectedQueue.push(MockService.permuteQuestionOptions(q));
        usedIds.add(q.id);
      }
    }

    const focusChapter = neglect ? neglect.chapter : (weaks.length > 0 ? weaks[0].chapter : null);
    if (focusChapter) {
      const chapPool = MockService.shuffle(allQs.filter(q => q.chapter === focusChapter && !usedIds.has(q.id)));
      for (const q of chapPool) {
        if (selectedQueue.length >= 14) break;
        if (!q.parentPassageId) {
          selectedQueue.push(MockService.permuteQuestionOptions(q));
          usedIds.add(q.id);
        }
      }
    }

    const unseenPool = MockService.shuffle(allQs.filter(q => (!perfMap[q.id] || perfMap[q.id].attempts === 0) && !usedIds.has(q.id)));
    for (const q of unseenPool) {
      if (selectedQueue.length >= targetCount) break;
      if (!q.parentPassageId) {
        selectedQueue.push({ ...q });
        usedIds.add(q.id);
      }
    }

    if (selectedQueue.length < targetCount) {
      const anyPool = MockService.shuffle(allQs.filter(q => !usedIds.has(q.id)));
      for (const q of anyPool) {
        if (selectedQueue.length >= targetCount) break;
        selectedQueue.push(MockService.permuteQuestionOptions(q));
        usedIds.add(q.id);
      }
    }

    if (selectedQueue.length === 0) {
      alert("Question bank is currently empty.");
      return;
    }

    if (openInDojo) {
      await openDojoSessionWithQuestions(selectedQueue, "Daily Autopilot Dojo Clinic");
    } else {
      await compileAndLaunchArena("Daily Autopilot Priority Sprint", selectedQueue, Math.max(10, Math.round(selectedQueue.length * 0.8)), false);
    }
  }

  async function launchOnboardingDiagnosticMock() {
    const modal = document.getElementById("modal-onboarding-baseline");
    if (modal) modal.classList.remove("active");

    const inst = await MockService.generate({
      title: "Diagnostic Baseline Mock (12 Qs)",
      count: 12,
      durationMin: 10,
      mode: "RANDOM",
      allowFallbackPadding: true
    });
    await MockService.launchMockSession(inst);
  }

  function renderDashboardSubjectBatteries(completed) {
    const container = document.getElementById("dash-subject-batteries");
    if (!container) return;
    container.innerHTML = "";

    Object.keys(TAXONOMY).forEach(subKey => {
      let subAtt = 0, subCor = 0;
      completed.forEach(c => {
        if (c.questions && Array.isArray(c.questions)) {
          c.questions.forEach(q => {
            if (q.subject === subKey) {
              const resp = (c.userResponses && typeof c.userResponses === "object") ? c.userResponses[q.id] : null;
              if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
                subAtt++;
                if (resp.selectedOption === q.correctIndex) subCor++;
              }
            }
          });
        }
      });

      const acc = subAtt > 0 ? Math.round((subCor / subAtt) * 100) : 0;
      const div = document.createElement("div");
      div.style.marginBottom = "8px";
      div.style.cursor = "pointer";
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:2px;">
          <span style="font-weight:700;">${TAXONOMY[subKey].name} (${subKey})</span>
          <span style="font-family:var(--font-mono); color:${acc >= 80 ? "var(--status-green)" : (acc >= 60 ? "var(--status-amber)" : "var(--text-muted)")};">${subAtt > 0 ? `${acc}% (${subAtt} Qs)` : "0%"}</span>
        </div>
        <div class="battery-bar-container">
          <div class="battery-bar-fill" style="width:${acc}%; background:${acc >= 80 ? "var(--status-green)" : (acc >= 60 ? "var(--status-amber)" : "var(--accent-blue)")};"></div>
        </div>
      `;
      div.addEventListener("click", () => openSubjectDiagnosticModal(subKey));
      container.appendChild(div);
    });
  }

  async function renderDashboardBlueprints() {
    const pillsContainer = document.getElementById("dash-blueprints-pills");
    if (!pillsContainer) return;
    pillsContainer.innerHTML = "";
    const blueprints = await getAllRecords("store_saved_mocks");

    if (blueprints.length === 0) {
      pillsContainer.innerHTML = `<span style="font-size:11px; color:var(--text-muted);">Zero saved setups. Blueprints created via Console or Builder will appear here.</span>`;
      return;
    }

    blueprints.forEach(bp => {
      const pill = document.createElement("button");
      pill.className = "anchor-pill";
      const icon = bp.type === "FIXED_PAPER" ? "\uD83D\uDCCC" : "\u26A1";
      pill.innerHTML = `<span>${icon} ${bp.title}</span><span style="opacity:0.6; font-size:9px;" onclick="event.stopPropagation(); CGL_OS.deleteSavedPreset('${bp.id}')">\u2715</span>`;
      pill.onclick = () => launchSavedPreset(bp.id);
      pillsContainer.appendChild(pill);
    });
  }

  async function renderRecentHistory(completed) {
    const container = document.getElementById("mock-history-container");
    if (!container) return;
    if (completed.length === 0) {
      container.innerHTML = `<p style="font-size:12px; color:var(--text-muted); text-align:center; padding:10px;">No mocks submitted yet. Launch your first mock above.</p>`;
      return;
    }

    container.innerHTML = "";
    const sorted = completed.slice().sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    sorted.slice(0, 3).forEach(att => {
      const posM = att.positiveMarks !== undefined ? att.positiveMarks : 2.0;
      const negM = att.negativeMarks !== undefined ? att.negativeMarks : 0.5;
      const secScores = {};
      if (att.questions && Array.isArray(att.questions) && att.userResponses) {
        att.questions.forEach(q => {
          const secName = q.subject || "GEN";
          if (!secScores[secName]) secScores[secName] = 0;
          const resp = att.userResponses[q.id];
          if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
            if (resp.selectedOption === q.correctIndex) secScores[secName] += posM;
            else secScores[secName] -= negM;
          }
        });
      }

      const card = document.createElement("div");
      card.className = "ticket-card";
      card.innerHTML = `
        <div class="ticket-header">
          <div>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <b style="font-size:14px; color:#fff;">${att.title || "SSC CGL Mock"}</b>
              ${att.attemptNumber > 1 ? `<span class="badge" style="background:#8957e5; font-size:9px;">Attempt ${att.attemptNumber}</span>` : ""}
              <span class="badge-slot slot-${(att.diurnalSlot || "morning").toLowerCase()}">${att.diurnalSlot || "DAY"}</span>
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${att.timeIST || formatISTDate(att.timestamp)}</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:16px; font-weight:800; color:var(--accent-cyan);">${(att.finalScore || 0).toFixed(2)} pts</span>
          </div>
        </div>
        <div class="ticket-pills-row">
          ${Object.keys(secScores).map(k => `<span class="ticket-sec-pill"><b>${k}:</b> ${secScores[k].toFixed(1)}</span>`).join("")}
          <span class="ticket-sec-pill" style="color:var(--status-red);">Traps: ${att.q4Traps || 0}</span>
        </div>
        <div class="ticket-actions-bar">
          <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--accent-cyan);" onclick="CGL_OS.exportMockByIdJson('${att.sessionId}')">\uD83D\uDCE5 Export</button>
          <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--status-green);" onclick="CGL_OS.reattemptMock('${att.sessionId}')">\uD83D\uDD01 Re-attempt</button>
          <button class="btn btn-secondary" style="padding:4px 10px; font-size:11px;" onclick="CGL_OS.openMockReview('${att.sessionId}')">Inspect Solutions</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  async function renderDrilldownSubjectLevel() {
    safeSetText("drilldown-breadcrumb", "Global");
    safeSetText("drill-level-tag", "LEVEL: SUBJECT");
    const list = document.getElementById("drilldown-list");
    if (!list) return;
    list.innerHTML = "";

    const completed = await PerformanceService.getHistoricalAttempts();

    Object.keys(TAXONOMY).forEach(subKey => {
      const sub = TAXONOMY[subKey];
      let subAtt = 0, subCor = 0;
      completed.forEach(c => {
        if (c.questions && Array.isArray(c.questions)) {
          c.questions.forEach(q => {
            if (q.subject === subKey) {
              const resp = (c.userResponses && typeof c.userResponses === "object") ? c.userResponses[q.id] : null;
              if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
                subAtt++;
                if (resp.selectedOption === q.correctIndex) subCor++;
              }
            }
          });
        }
      });

      const div = document.createElement("div");
      div.className = "card";
      div.style.padding = "12px";
      div.style.marginBottom = "8px";
      div.style.cursor = "pointer";
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700;">${sub.name} (${subKey})</div>
            <div style="font-size:11px; color:var(--text-muted);">${sub.chapters.length} Standard Chapters \u2022 Target Par: ${getSubjectThresholds(subKey).parSec}s/Q</div>
          </div>
          <div style="text-align:right;">
            <span class="badge" style="background:#151a24; color:#38bdf8;">
              ${subAtt > 0 ? `Acc: ${Math.round((subCor / subAtt) * 100)}%` : "Unattempted"}
            </span>
          </div>
        </div>
      `;
      div.addEventListener("click", () => renderDrilldownChapterLevel(subKey));
      list.appendChild(div);
    });
  }

  async function renderDrilldownChapterLevel(subKey) {
    const sub = TAXONOMY[subKey];
    safeSetHtml("drilldown-breadcrumb", `<span onclick="CGL_OS.renderDashboard()">Global</span> &gt; <b>${subKey}</b>`);
    safeSetText("drill-level-tag", "LEVEL: CHAPTERS");

    const list = document.getElementById("drilldown-list");
    if (!list) return;
    list.innerHTML = "";

    const allQuestions = await getAllRecords("store_questions");
    const allConcepts = await ConceptService.getAll();

    for (const chap of sub.chapters) {
      const cStats = await PerformanceService.getChapterStats(subKey, chap);
      const totalInBank = allQuestions.filter(q => q.chapter === chap).length;
      const totalSheets = allConcepts.filter(c => c.chapter === chap).length;

      const div = document.createElement("div");
      div.className = "card";
      div.style.padding = "12px";
      div.style.marginBottom = "8px";
      div.style.cursor = "pointer";

      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; font-family:var(--font-mono); font-size:13px;">${chap}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
              Bank: ${totalInBank} Qs \u2022 ${totalSheets} Sheets \u2022 ${cStats.attempted > 0 ? `Speed: ${cStats.avgSpeed}s \u2022 Nc: ${cStats.neglectIndex}` : "No solve data"}
            </div>
          </div>
          <div style="text-align:right;">
            <span class="badge" style="background:${cStats.attempted > 0 ? "#1b4d2e" : "#151a24"}; color:${cStats.attempted > 0 ? "#4ade80" : "#8b949e"};">
              ${cStats.attempted > 0 ? `Acc: ${cStats.accuracy}%` : "Unattempted"}
            </span>
          </div>
        </div>
      `;
      div.addEventListener("click", () => openChapterInspector(subKey, chap));
      list.appendChild(div);
    }
  }

  async function openChapterInspector(subKey, chap) {
    safeSetText("insp-chapter-title", chap);
    safeSetText("insp-subject-title", TAXONOMY[subKey] ? TAXONOMY[subKey].name : subKey);

    const cStats = await PerformanceService.getChapterStats(subKey, chap);
    safeSetText("insp-acc", cStats.attempted > 0 ? `${cStats.accuracy}%` : "--");
    safeSetText("insp-speed", cStats.attempted > 0 ? `${cStats.avgSpeed}s` : "--");
    safeSetText("insp-nc", cStats.neglectIndex);

    const sheetsBtn = document.getElementById("btn-launch-chapter-sheets");
    if (sheetsBtn) {
      sheetsBtn.onclick = () => {
        const m = document.getElementById("modal-chapter-inspector");
        if (m) m.classList.remove("active");
        openCompendiumToSheet(null, subKey, chap);
      };
    }

    const dojoBtn = document.getElementById("btn-launch-chapter-dojo");
    if (dojoBtn) {
      dojoBtn.onclick = () => {
        const m = document.getElementById("modal-chapter-inspector");
        if (m) m.classList.remove("active");
        launchDirectChapterDrill(subKey, chap, true);
      };
    }

    const blitzBtn = document.getElementById("btn-launch-chapter-blitz");
    if (blitzBtn) {
      blitzBtn.onclick = () => {
        const m = document.getElementById("modal-chapter-inspector");
        if (m) m.classList.remove("active");
        launchConfiguredMockDirect(subKey, chap, 10, 8);
      };
    }

    const vulnList = document.getElementById("insp-vulnerability-list");
    if (vulnList) {
      vulnList.innerHTML = "";
      const completed = await PerformanceService.getHistoricalAttempts();
      const errorMap = [];

      completed.forEach(att => {
        if (att.questions && Array.isArray(att.questions) && att.userResponses) {
          att.questions.forEach(q => {
            if (q.chapter === chap) {
              const resp = att.userResponses[q.id];
              if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined && resp.selectedOption !== q.correctIndex) {
                errorMap.push({ q, resp, timeIST: att.timeIST });
              }
            }
          });
        }
      });

      if (errorMap.length === 0) {
        vulnList.innerHTML = `<span style="color:var(--status-green);">Zero recorded mistakes in ${chap}.</span>`;
      } else {
        errorMap.slice(-6).forEach(err => {
          const div = document.createElement("div");
          div.style.padding = "6px 0";
          div.style.borderBottom = "1px solid var(--border-color)";
          div.innerHTML = `
            <div style="display:flex; justify-content:space-between; color:#f87171; font-weight:700;">
              <span>${err.q.id}</span>
              <span>#${err.resp.errorTag || "UNCLASSIFIED"} (${err.resp.timeSpentSec || 0}s)</span>
            </div>
            <div style="color:var(--text-muted); font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${err.q.questionText}
            </div>
          `;
          vulnList.appendChild(div);
        });
      }
    }

    pushHistoryState("modal-chapter-inspector");
    const m = document.getElementById("modal-chapter-inspector");
    if (m) m.classList.add("active");
  }

  /* ==========================================================================
   * SECTION 28 & 29: PUBLISHING PRINT ENGINE, 1-TAP AI BIOPSY & DATA MATRIX
   * ========================================================================== */
  async function openPrintConfigModal() {
    await updatePrintChapters();
    await populatePrintMockDropdown();
    pushHistoryState("modal-print-config");
    const m = document.getElementById("modal-print-config");
    if (m) m.classList.add("active");
  }

  async function populatePrintMockDropdown() {
    const attempts = await PerformanceService.getHistoricalAttempts();
    const select = document.getElementById("print-mock-select");
    if (!select) return;
    select.innerHTML = "";
    attempts.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.sessionId;
      opt.innerText = `${a.title} (${a.timeIST || formatISTDate(a.timestamp)})`;
      select.appendChild(opt);
    });
  }

  function handlePrintTypeChange(type) {
    const isQ = type === "QUESTIONS" || type === "COMPENDIUM";
    const isMock = type === "PAST_MOCK";
    safeSetDisplay("print-sub-wrap", isQ ? "block" : "none");
    safeSetDisplay("print-chap-wrap", isQ ? "block" : "none");
    safeSetDisplay("print-mock-select-wrap", isMock ? "block" : "none");
  }

  async function updatePrintChapters() {
    const sub = document.getElementById("print-subject")?.value || "ALL";
    const chapSelect = document.getElementById("print-chapter");
    if (!chapSelect) return;
    chapSelect.innerHTML = `<option value="ALL">All Chapters</option>`;

    const allQs = await getAllRecords("store_questions");
    const allConcepts = await ConceptService.getAll();
    const qChaps = allQs.filter(q => sub === "ALL" || q.subject === sub).map(q => q.chapter);
    const cChaps = allConcepts.filter(c => sub === "ALL" || c.subject === sub).map(c => c.chapter);
    const chaps = [...new Set([...qChaps, ...cChaps])];

    chaps.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.innerText = c;
      chapSelect.appendChild(opt);
    });
  }

  function sortQuestionsHierarchical(questions) {
    const subOrder = ["QA", "REAS", "ENG", "GA"];
    return questions.slice().sort((a, b) => {
      const sA = subOrder.indexOf(a.subject || "") !== -1 ? subOrder.indexOf(a.subject || "") : 99;
      const sB = subOrder.indexOf(b.subject || "") !== -1 ? subOrder.indexOf(b.subject || "") : 99;
      if (sA !== sB) return sA - sB;
      const chapA = a.chapter || "";
      const chapB = b.chapter || "";
      if (chapA !== chapB) return chapA.localeCompare(chapB);
      const subA = a.subtopic || "";
      const subB = b.subtopic || "";
      if (subA !== subB) return subA.localeCompare(subB);
      return (a.id || "").localeCompare(b.id || "");
    });
  }

  async function generateAndPrintSheet() {
    const modal = document.getElementById("modal-print-config");
    if (modal) modal.classList.remove("active");
    const pType = document.getElementById("print-type")?.value || "COMPENDIUM";
    const sub = document.getElementById("print-subject")?.value || "ALL";
    const chap = document.getElementById("print-chapter")?.value || "ALL";
    const ansMode = document.getElementById("print-include-ans")?.value || "APPENDIX";

    const root = document.getElementById("print-sheet-root");
    if (!root) return;
    root.innerHTML = "";

    const timestampIST = formatISTDate(Date.now());

    if (pType === "COMPENDIUM") {
      const dossiers = await ConceptService.getAll();
      let pool = sub === "ALL" ? dossiers : dossiers.filter(d => d.subject === sub);
      if (chap !== "ALL") pool = pool.filter(d => d.chapter === chap);

      pool.sort((a, b) => {
        const sA = a.subject || "";
        const sB = b.subject || "";
        if (sA !== sB) return sA.localeCompare(sB);
        return (a.chapter || "").localeCompare(b.chapter || "");
      });

      const tocMap = {};
      pool.forEach(item => {
        const s = item.subject || "QA";
        const c = item.chapter || "GENERAL";
        if (!tocMap[s]) tocMap[s] = {};
        if (!tocMap[s][c]) tocMap[s][c] = [];
        tocMap[s][c].push(item.title);
      });

      let tocHtml = `<div class="print-toc-container"><div class="print-toc-heading">Table of Contents</div>`;
      let secCounter = 1;
      Object.keys(tocMap).forEach(s => {
        const subName = TAXONOMY[s] ? TAXONOMY[s].name : s;
        tocHtml += `<div style="font-weight:bold; margin-top:8px; font-size:11pt;">${secCounter++}. ${subName} (${s})</div>`;
        Object.keys(tocMap[s]).forEach(c => {
          tocHtml += `<div style="padding-left:14px; font-weight:600; color:#333; margin-top:3px;">\u2022 ${c}</div>`;
          tocMap[s][c].forEach(title => {
            tocHtml += `<div class="print-toc-item" style="padding-left:28px;"><span>${title}</span><span style="color:#777;">Engineering Sheet</span></div>`;
          });
        });
      });
      tocHtml += `</div>`;

      let content = `
        <div class="print-book-cover">
          <div class="print-book-title">SSC CGL 2026 Master Preparation Compendium</div>
          <div class="print-book-meta">
            Candidate: Ankit Kumar &nbsp;|&nbsp; Generated: ${timestampIST} &nbsp;|&nbsp; Scope: ${sub} (${chap}) &nbsp;|&nbsp; Total Sheets: ${pool.length}
          </div>
          ${tocHtml}
        </div>
      `;

      let curSub = "";
      let curChap = "";

      pool.forEach(sheet => {
        if (sheet.subject !== curSub) {
          curSub = sheet.subject;
          content += `
            <div class="print-subject-divider">
              <div class="print-subject-title">${TAXONOMY[curSub] ? TAXONOMY[curSub].name : curSub} (${curSub})</div>
            </div>
          `;
        }
        if (sheet.chapter !== curChap) {
          curChap = sheet.chapter;
          content += `<div class="print-chapter-title">Chapter: ${curChap}</div>`;
        }

        let img = sheet.imageUrl ? `<div style="text-align:center; margin:8px 0;"><img src="${sheet.imageUrl}" style="max-height:160px; max-width:85%;"></div>` : "";

        content += `
          <div class="print-comp-entry">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
              <b style="font-size:12pt;">${sheet.title}</b>
              <span style="font-size:9pt; color:#666;">${sheet.chapter}</span>
            </div>
            ${sheet.subtitle ? `<div style="font-size:9.5pt; font-style:italic; color:#444; margin-bottom:6px;">${sheet.subtitle}</div>` : ""}
            <div>${formatRichText(sheet.content)}</div>
            ${img}
          </div>
        `;
      });

      root.innerHTML = content;
    } else if (pType === "QUESTIONS") {
      const allQs = await getAllRecords("store_questions");
      let pool = sub === "ALL" ? allQs : allQs.filter(q => q.subject === sub);
      if (chap !== "ALL") pool = pool.filter(q => q.chapter === chap);

      pool = sortQuestionsHierarchical(pool);

      let content = `
        <div class="print-book-cover">
          <div class="print-book-title">SSC CGL Practice Exam Paper</div>
          <div class="print-book-meta">
            Target: 2026 Tier 1 / Tier 2 &nbsp;|&nbsp; Generated: ${timestampIST} &nbsp;|&nbsp; Total Questions: ${pool.length}
          </div>
        </div>
        <div class="print-dual-col">
      `;

      let curSub = "";
      pool.forEach((q, idx) => {
        if (q.subject !== curSub) {
          curSub = q.subject;
          content += `<div style="column-span:all; font-weight:800; font-size:13pt; border-bottom:1.5pt solid #000; margin:12px 0 8px 0; text-transform:uppercase;">${TAXONOMY[curSub] ? TAXONOMY[curSub].name : curSub}</div>`;
        }

        let passage = q.passageText ? `<div class="q-passage-container" style="font-size:8.5pt; padding:6px; margin-bottom:6px;"><b>Passage:</b> ${formatRichText(q.passageText)}</div>` : "";
        let img = q.imageUrl ? `<br><img src="${q.imageUrl}" style="max-height:120px; max-width:100%;">` : "";
        content += `
          <div class="print-question">
            ${passage}
            <strong>Q${idx + 1}.</strong> ${formatRichText(q.questionText)}${img}<br>
            <div style="margin-top:4px;">
              ${q.options.map((opt, i) => `(${i + 1}) ${formatRichText(opt)} &nbsp; `).join("")}
            </div>
            ${ansMode === "INLINE" ? `<div style="font-size:9pt; margin-top:6px; color:#222; background:#f4f4f4; padding:4px;"><b>Correct: Option ${q.correctIndex + 1}</b><br><i>${formatRichText(q.explanation || "")}</i></div>` : ""}
          </div>
        `;
      });

      content += `</div>`;

      if (ansMode === "APPENDIX") {
        content += `
          <div class="print-appendix">
            <h2 style="font-size:16pt; font-weight:900; margin-bottom:12px; text-transform:uppercase;">Appendix: Answer Keys &amp; Step-by-Step Solutions</h2>
            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px; margin-bottom:18px; font-size:10pt;">
              ${pool.map((q, idx) => `<div><b>Q${idx + 1}:</b> Opt ${q.correctIndex + 1}</div>`).join("")}
            </div>
            <hr style="margin-bottom:14px;">
            ${pool.map((q, idx) => `
              <div style="font-size:9.5pt; margin-bottom:10px; page-break-inside:avoid; break-inside:avoid;">
                <b>Q${idx + 1} Explanation:</b><br>${formatRichText(q.explanation || "No method registered.")}
              </div>
            `).join("")}
          </div>
        `;
      }

      root.innerHTML = content;
    } else if (pType === "PAST_MOCK") {
      const mockId = document.getElementById("print-mock-select")?.value;
      const attempts = await getAllRecords("store_attempts");
      const targetMock = attempts.find(a => a.sessionId === mockId);
      if (!targetMock) return;

      let content = `
        <div class="print-book-cover">
          <div class="print-book-title">${targetMock.title} (Performance Audit)</div>
          <div class="print-book-meta">
            Attempt Score: ${(targetMock.finalScore || 0).toFixed(2)} pts &nbsp;|&nbsp; Correct: ${targetMock.correctCount} &nbsp;|&nbsp; Incorrect: ${targetMock.incorrectCount} &nbsp;|&nbsp; IST Date: ${targetMock.timeIST || formatISTDate(targetMock.timestamp)}
          </div>
        </div>
        <div class="print-dual-col">
      `;

      targetMock.questions.forEach((q, idx) => {
        const resp = targetMock.userResponses && targetMock.userResponses[q.id] ? targetMock.userResponses[q.id] : {};
        const isCor = resp.selectedOption === q.correctIndex;
        let passage = q.passageText ? `<div class="q-passage-container" style="font-size:8.5pt; padding:6px; margin-bottom:6px;"><b>Passage:</b> ${formatRichText(q.passageText)}</div>` : "";
        let img = q.imageUrl ? `<br><img src="${q.imageUrl}" style="max-height:120px; max-width:100%;">` : "";

        content += `
          <div class="print-question">
            ${passage}
            <strong>Q${idx + 1}.</strong> ${formatRichText(q.questionText)}${img}<br>
            <div style="margin-top:4px;">
              ${q.options.map((opt, i) => `(${i + 1}) ${formatRichText(opt)} &nbsp; `).join("")}
            </div>
            <div style="font-size:9pt; margin-top:6px; background:#f4f4f4; padding:6px; border-left:3px solid ${isCor ? "#238636" : "#da3633"};">
              <b>Your Pick:</b> Option ${resp.selectedOption !== null && resp.selectedOption !== undefined ? resp.selectedOption + 1 : "None"} (${isCor ? "\u2713 Correct" : "\u2717 Incorrect"}) | <b>Time:</b> ${resp.timeSpentSec || 0}s<br>
              <b>Key:</b> Option ${q.correctIndex + 1} | <i>${formatRichText(q.explanation || "")}</i>
            </div>
          </div>
        `;
      });

      content += `</div>`;
      root.innerHTML = content;
    }

    setTimeout(() => {
      window.print();
    }, 250);
  }

  function exportCurrentReviewMockJson() {
    if (!activeReviewAttempt) {
      alert("No active mock review loaded.");
      return;
    }
    exportSpecificMockJson(activeReviewAttempt);
  }

  async function exportMockByIdJson(sessionId) {
    const attempts = await getAllRecords("store_attempts");
    const target = attempts.find(a => a.sessionId === sessionId);
    if (!target) {
      alert(`Mock session ${sessionId} not found.`);
      return;
    }
    exportSpecificMockJson(target);
  }

  async function exportSpecificMockJson(mockObj) {
    const payload = {
      cgl_os_mock_export: {
        engine: "SSC_CGL_INTELLIGENCE_OS",
        schemaVersion: DB_VERSION,
        exportedAtEpoch: Date.now(),
        exportedAtIST: formatISTDate(Date.now()),
        sessionId: mockObj.sessionId,
        title: mockObj.title,
        attemptNumber: mockObj.attemptNumber || 1,
        positiveMarks: mockObj.positiveMarks || 2.0,
        negativeMarks: mockObj.negativeMarks !== undefined ? mockObj.negativeMarks : 0.5,
        finalScore: mockObj.finalScore,
        accuracyPercent: mockObj.correctCount + mockObj.incorrectCount > 0
          ? Math.round((mockObj.correctCount / (mockObj.correctCount + mockObj.incorrectCount)) * 100)
          : 0
      },
      attemptData: mockObj
    };

    await downloadFileResilient(`cgl_mock_${mockObj.sessionId}_${Date.now()}.json`, "application/json", JSON.stringify(payload, null, 2));
  }

  async function exportKnowledgeBankJson() {
    const concepts = await ConceptService.getAll();
    const now = Date.now();
    const payload = {
      cgl_os_knowledge_export: {
        engine: "SSC_CGL_INTELLIGENCE_OS",
        schemaVersion: DB_VERSION,
        exportedAtEpoch: now,
        exportedAtIST: formatISTDate(now),
        totalSheets: concepts.length
      },
      concepts: concepts
    };

    await downloadFileResilient(`cgl_knowledge_compendium_${now}.json`, "application/json", JSON.stringify(payload, null, 2));
  }

  async function exportCurrentSelectedStoreJson() {
    const storeName = document.getElementById("db-store-select")?.value;
    if (!storeName) return;
    let records = await getAllRecords(storeName);
    if (storeName === "store_config") {
      const includeKeys = document.getElementById("backup-include-api-keys")?.checked ?? false;
      if (!includeKeys) {
        records = records.filter(r => r.key !== "ai_api_key_vault");
      }
    }
    const now = Date.now();

    const payload = {
      cgl_os_table_dump: {
        engine: "SSC_CGL_INTELLIGENCE_OS",
        storeName: storeName,
        schemaVersion: DB_VERSION,
        exportedAtEpoch: now,
        exportedAtIST: formatISTDate(now),
        recordCount: records.length
      },
      records: records
    };

    await downloadFileResilient(`cgl_dump_${storeName}_${now}.json`, "application/json", JSON.stringify(payload, null, 2));
  }

  async function exportScopedForensicDossier() {
    const sub = document.getElementById("scoped-export-subject")?.value || "ALL";
    const timeframe = document.getElementById("scoped-export-timeframe")?.value || "15D";
    const filter = document.getElementById("scoped-export-filter")?.value || "ALL";
    const encoding = document.getElementById("scoped-export-encoding")?.value || "HYBRID_CSV";
    await exportDossierInternal(sub, timeframe, filter, encoding, false);
  }

  async function exportGlobalMasterDossier() {
    await exportDossierInternal("ALL", "ALL", "ALL", "HYBRID_CSV", true);
  }

  async function exportDossierInternal(sub, timeframe, filter, encoding, isGlobalMaster = false) {
    const allAttempts = await getAllRecords("store_attempts");
    const consultations = await getAllRecords("store_ai_consultations");

    const now = Date.now();
    let cutoff = 0;
    if (timeframe === "7D") cutoff = now - (7 * 24 * 60 * 60 * 1000);
    else if (timeframe === "15D") cutoff = now - (15 * 24 * 60 * 60 * 1000);
    else if (timeframe === "30D") cutoff = now - (30 * 24 * 60 * 60 * 1000);

    const filteredAttempts = allAttempts.filter(a => a.completed && a.mockType !== "STUDY_VIEW" && a.timestamp >= cutoff);
    const exposureMap = {};

    allAttempts.filter(a => a.completed && a.mockType !== "STUDY_VIEW").sort((a, b) => a.timestamp - b.timestamp).forEach(att => {
      if (att.questions && Array.isArray(att.questions) && att.userResponses) {
        att.questions.forEach(q => {
          if (sub === "ALL" || q.subject === sub) {
            const resp = att.userResponses[q.id];
            if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
              if (!exposureMap[q.id]) {
                exposureMap[q.id] = {
                  totalExposures: 0,
                  firstSeenIST: att.timeIST || formatISTDate(att.timestamp),
                  lastSeenIST: att.timeIST || formatISTDate(att.timestamp),
                  spacingHistory: []
                };
              }
              const hist = exposureMap[q.id];
              const priorEpoch = hist.spacingHistory.length > 0 ? hist.spacingHistory[hist.spacingHistory.length - 1].epochMs : 0;
              hist.totalExposures++;
              hist.lastSeenIST = att.timeIST || formatISTDate(att.timestamp);
              hist.spacingHistory.push({
                attemptNum: hist.totalExposures,
                epochMs: att.timestamp,
                dateIST: att.timeIST || formatISTDate(att.timestamp),
                timeSpentSec: resp.timeSpentSec || 0,
                outcome: resp.selectedOption === q.correctIndex ? 1 : 0,
                gapDays: calcGapDays(att.timestamp, priorEpoch)
              });
            }
          }
        });
      }
    });

    const telemetryRows = [];
    const decisionTrails = {};

    filteredAttempts.forEach(att => {
      if (att.questions && Array.isArray(att.questions) && att.userResponses) {
        att.questions.forEach(q => {
          if (sub === "ALL" || q.subject === sub) {
            const resp = att.userResponses[q.id];
            const trapThreshold = getSubjectThresholds(q.subject).trapSec;
            if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
              const isCor = resp.selectedOption === q.correctIndex ? 1 : 0;
              const isTrap = (resp.timeSpentSec > trapThreshold && isCor === 0) || (resp.isPanicSlip) || (resp.switches > 0 && isCor === 0);

              if (filter === "ALL" || (filter === "TRAPS_ONLY" && isTrap) || (filter === "PANIC_ONLY" && resp.isPanicSlip)) {
                telemetryRows.push({
                  mockId: att.sessionId,
                  mockIST: att.timeIST || formatISTDate(att.timestamp),
                  slot: att.diurnalSlot || getDiurnalSlot(att.timestamp),
                  qId: q.id,
                  subject: q.subject,
                  chapter: q.chapter,
                  sel: resp.selectedOption,
                  cor: q.correctIndex,
                  t: resp.timeSpentSec || 0,
                  sw: resp.switches || 0,
                  panic: resp.isPanicSlip ? 1 : 0,
                  tag: resp.errorTag || "UNCLASSIFIED"
                });

                if (resp.decisionTrail && resp.decisionTrail.length > 0) {
                  decisionTrails[`${att.sessionId}_${q.id}`] = resp.decisionTrail;
                }
              }
            }
          }
        });
      }
    });

    let telemetryPayload;
    if (encoding === "HYBRID_CSV") {
      let csv = "mockId,mockIST,slot,qId,subject,chapter,sel,cor,t,sw,panic,tag\n";
      telemetryRows.forEach(r => {
        csv += `${r.mockId},${r.mockIST},${r.slot},${r.qId},${r.subject},${r.chapter},${r.sel},${r.cor},${r.t},${r.sw},${r.panic},${r.tag}\n`;
      });
      telemetryPayload = csv;
    } else {
      telemetryPayload = telemetryRows;
    }

    const dossierEnvelope = {
      __os_manifest: {
        engine: "SSC_CGL_INTELLIGENCE_OS",
        version: DB_VERSION,
        exportedAtEpoch: now,
        exportedAtIST: formatISTDate(now),
        diurnalSlot: getDiurnalSlot(now),
        exportScope: isGlobalMaster ? "GLOBAL_360_MASTER_DOSSIER" : `${sub}_${timeframe}_${filter}`,
        encoding: encoding
      },
      cumulativeClinicalNarrative: consultations.length > 0 ? consultations[consultations.length - 1].cumulativeNarrative || "Baseline initialized." : "No prior consultations logged.",
      recentConsultationLogs: consultations.slice(-5),
      candidateProfile: {
        target: "SSC CGL 2026 Tier 1 & Tier 2 Master Preparation",
        scopedAttemptsEvaluated: filteredAttempts.length,
        scopedTelemetryCount: telemetryRows.length
      },
      questionExposuresAndSpacing: exposureMap,
      telemetryData: telemetryPayload,
      decisionTrails: decisionTrails
    };

    const filename = isGlobalMaster
      ? `cgl_master_forensic_dossier_360_${now}.json`
      : `cgl_forensic_dossier_${sub}_${timeframe}_${now}.json`;

    await downloadFileResilient(filename, "application/json", JSON.stringify(dossierEnvelope, null, 2));
  }

  async function exportUnifiedAiHandoffPackage() {
    const now = Date.now();
    const allAttempts = await getAllRecords("store_attempts");
    const allQuestions = await getAllRecords("store_questions");
    const allConcepts = await ConceptService.getAll();
    const consultations = await getAllRecords("store_ai_consultations");
    const completedAttempts = allAttempts.filter(a => a.completed && a.mockType !== "STUDY_VIEW");

    const masterPackage = {
      cgl_os_master_handoff: {
        engine: "SSC_CGL_INTELLIGENCE_OS",
        schemaVersion: DB_VERSION,
        generatedAtEpoch: now,
        generatedAtIST: formatISTDate(now),
        candidate: "Ankit Kumar",
        targetExam: "SSC CGL 2026 Tier 1 & Tier 2 Master Preparation"
      },
      runtimeManifest: {
        masterQuestionCount: allQuestions.length,
        completedMocksCount: completedAttempts.length,
        livingSheetsCount: allConcepts.length,
        consultationsCount: consultations.length,
        taxonomy: TAXONOMY
      },
      knowledgeCompendium: allConcepts,
      masterQuestionBank: sortQuestionsHierarchical(allQuestions),
      recentConsultations: consultations.slice(-10)
    };

    await downloadFileResilient(`cgl_ai_master_handoff_package_${now}.json`, "application/json", JSON.stringify(masterPackage, null, 2));
  }

  async function refreshDbInspector() {
    const storeSelect = document.getElementById("db-store-select");
    if (!storeSelect) return;
    const storeName = storeSelect.value;
    const records = await getAllRecords(storeName);
    const list = document.getElementById("db-inspector-list");
    if (!list) return;
    list.innerHTML = "";

    records.forEach(rec => {
      const key = rec.id || rec.sessionId || rec.questionId || rec.key;
      const row = document.createElement("div");
      row.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--border-color);";
      row.innerHTML = `
        <span style="font-family:var(--font-mono); font-size:11.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:70%;">${key}</span>
        <button class="btn btn-secondary" style="padding:2px 8px; font-size:11px;" onclick="CGL_OS.editDbRecordModal('${storeName}', '${key}')">Inspect</button>
      `;
      list.appendChild(row);
    });
  }

  let activeInspectedJsonString = "";

  async function editDbRecordModal(sName, key) {
    const rec = await getRecord(sName, key);
    if (!rec) return;

    if (sName === "store_questions") {
      openEditQuestionModal(rec);
    } else if (sName === "store_concepts") {
      openCompendiumToSheet(rec.id, rec.subject, rec.chapter);
    } else {
      activeInspectedJsonString = JSON.stringify(rec, null, 2);
      safeSetText("db-inspect-modal-title", `${sName} Record`);
      safeSetText("db-inspect-modal-key", `KEY: ${key}`);
      safeSetText("db-inspect-code-content", activeInspectedJsonString);

      pushNavLayer("modal-db-inspector-viewer", () => {
        const m = document.getElementById("modal-db-inspector-viewer");
        if (m) m.classList.remove("active");
      });
      const m = document.getElementById("modal-db-inspector-viewer");
      if (m) m.classList.add("active");
    }
  }

  function copyInspectedJsonToClipboard() {
    if (!activeInspectedJsonString) return;
    navigator.clipboard.writeText(activeInspectedJsonString);
    alert("Record JSON copied to clipboard!");
  }

  async function wipeTestAttempts() {
    if (confirm("Permanently clear mock test history? (Question bank and Living Sheets remain 100% intact)")) {
      await clearStore("store_attempts");
      alert("Test history cleared.");
      await renderDashboard();
      refreshDbInspector();
    }
  }

  async function factoryResetAll() {
    if (confirm("WARNING: Complete factory reset will wipe user stores and restore clean defaults! Export Full Backup first!")) {
      const storeKeys = [
        "store_questions", "store_attempts", "store_flashcards",
        "store_concepts", "store_notes", "store_saved_mocks",
        "store_ai_consultations", "store_active_session", "store_config"
      ];
      for (const sName of storeKeys) {
        await clearStore(sName);
      }
      await seedData();
      alert("Factory reset complete.");
      SearchService.invalidate();
      await AiGatewayService.loadVault();
      await syncAllTaxonomyDropdowns();
      await renderDashboard();
      refreshDbInspector();
    }
  }

  async function generateCompactBiopsyPayload(att) {
    const consultations = await getAllRecords("store_ai_consultations");
    const allCanonical = await getAllRecords("store_questions");
    const canonMap = {};
    allCanonical.forEach(cq => { canonMap[cq.id] = cq; });

    const criticalQuestions = [];
    const cleanSolvedIds = [];

    (att.questions || []).forEach(q => {
      const liveQ = canonMap[q.id] ? { ...q, ...canonMap[q.id] } : q;
      const r = (att.userResponses && att.userResponses[q.id]) ? att.userResponses[q.id] : {};
      const isAtt = r.selectedOption !== null && r.selectedOption !== undefined;
      const isCor = isAtt && r.selectedOption === q.correctIndex;
      const parSec = getSubjectThresholds(q.subject).parSec;
      const isSlow = (r.timeSpentSec || 0) > parSec * 1.35;
      const hasSwitch = (r.switches || 0) > 0;
      const isStarred = !!liveQ.bookmarked;

      if (!isCor || isSlow || hasSwitch || isStarred) {
        criticalQuestions.push({
          id: q.id,
          subject: q.subject,
          chapter: q.chapter,
          subtopic: liveQ.subtopic || "",
          method: liveQ.method || "",
          conceptIds: liveQ.conceptIds || (liveQ.conceptId ? [liveQ.conceptId] : []),
          bookmarked: isStarred,
          outcome: isCor ? "CORRECT_BUT_FLAGGED" : (isAtt ? "INCORRECT" : "UNATTEMPTED"),
          userSelectedOptionIndex: isAtt ? r.selectedOption : null,
          userSelectedOptionText: isAtt && q.options[r.selectedOption] ? q.options[r.selectedOption] : null,
          correctOptionIndex: q.correctIndex,
          correctOptionText: q.options[q.correctIndex],
          timeSpentSec: r.timeSpentSec || 0,
          targetParSec: parSec,
          switches: r.switches || 0,
          decisionTrail: r.decisionTrail || [],
          errorTag: r.errorTag || "UNCLASSIFIED",
          questionText: q.questionText,
          options: q.options,
          explanation: liveQ.explanation || q.explanation || "",
          candidateAnnotation: liveQ.annotation || ""
        });
      } else {
        cleanSolvedIds.push({ id: q.id, chapter: q.chapter, t: r.timeSpentSec || 0 });
      }
    });

    return {
      action: "AI_COMPACT_MOCK_BIOPSY",
      mockSummary: {
        sessionId: att.sessionId,
        title: att.title,
        attemptNumber: att.attemptNumber || 1,
        timestampIST: att.timeIST || formatISTDate(att.timestamp),
        diurnalSlot: att.diurnalSlot || getDiurnalSlot(att.timestamp),
        markingScheme: `+${att.positiveMarks || 2.0} / -${att.negativeMarks !== undefined ? att.negativeMarks : 0.5}`,
        finalScore: att.finalScore,
        correctCount: att.correctCount,
        incorrectCount: att.incorrectCount,
        penaltyDrag: att.penaltyDrag,
        switchDelta: att.switchDelta,
        q4Traps: att.q4Traps
      },
      rollingClinicalMemory: consultations.length > 0 ? consultations[consultations.length - 1] : null,
      criticalQuestionsForBiopsy: criticalQuestions,
      cleanFastSolvedSummary: cleanSolvedIds
    };
  }

  async function copyCompactBiopsyToClipboard() {
    if (!activeReviewAttempt) return;
    const biopsyObj = await generateCompactBiopsyPayload(activeReviewAttempt);
    const jsonStr = JSON.stringify(biopsyObj, null, 2);
    navigator.clipboard.writeText(jsonStr)
      .then(() => alert(`1-Tap AI Biopsy copied (${biopsyObj.criticalQuestionsForBiopsy.length} critical questions + Rolling Clinical Memory)! Paste directly into Gemini.`))
      .catch(() => downloadFileResilient(`cgl_biopsy_${activeReviewAttempt.sessionId}.json`, "application/json", jsonStr));
  }

  function openAiExportModal() {
    if (!activeReviewAttempt) return;
    pushHistoryState("modal-ai-export");
    const m = document.getElementById("modal-ai-export");
    if (m) m.classList.add("active");
    updateAiExportPreview();
  }

  async function updateAiExportPreview() {
    const mode = document.getElementById("ai-export-mode")?.value || "COMPACT_BIOPSY";
    const att = activeReviewAttempt;
    if (!att) return;
    let payload = "";

    if (mode === "COMPACT_BIOPSY") {
      const biopsyObj = await generateCompactBiopsyPayload(att);
      payload = JSON.stringify(biopsyObj, null, 2);
    } else if (mode === "LEAN_GEM") {
      payload = JSON.stringify({
        action: "FEEDBACK_AUDIT",
        mockTitle: att.title,
        attemptNumber: att.attemptNumber || 1,
        timestampIST: att.timeIST,
        diurnalSlot: att.diurnalSlot,
        score: att.finalScore,
        penalty: att.penaltyDrag,
        traps: att.q4Traps,
        telemetry: att.questions.map(q => {
          const r = att.userResponses && att.userResponses[q.id] ? att.userResponses[q.id] : {};
          return {
            id: q.id,
            parentPassageId: q.parentPassageId || null,
            sel: r.selectedOption !== undefined ? r.selectedOption : null,
            cor: q.correctIndex,
            t: r.timeSpentSec || 0,
            trail: (r.decisionTrail || []).map(d => d.opt)
          };
        })
      }, null, 2);
    } else if (mode === "DEEP_AUDIT") {
      payload = JSON.stringify({
        meta: {
          title: att.title,
          attemptNumber: att.attemptNumber || 1,
          timestampIST: att.timeIST,
          diurnalSlot: att.diurnalSlot,
          finalScore: att.finalScore
        },
        questions: att.questions.map(q => {
          const r = att.userResponses && att.userResponses[q.id] ? att.userResponses[q.id] : {};
          return {
            id: q.id,
            parentPassageId: q.parentPassageId || null,
            passageText: q.passageText || "",
            chapter: q.chapter,
            conceptId: q.conceptId || "",
            conceptIds: q.conceptIds || (q.conceptId ? [q.conceptId] : []),
            text: q.questionText,
            options: q.options,
            userOption: r.selectedOption !== undefined ? r.selectedOption : null,
            correctIndex: q.correctIndex,
            timeSpentSec: r.timeSpentSec || 0,
            decisionTrail: r.decisionTrail || [],
            explanation: q.explanation
          };
        })
      }, null, 2);
    } else if (mode === "LONGITUDINAL") {
      const global = await PerformanceService.calculateGlobalMetrics();
      const weak = await PerformanceService.getWeakChapters();
      payload = JSON.stringify({
        generatedAtIST: formatISTDate(Date.now()),
        globalMetrics: global,
        weakChapters: weak
      }, null, 2);
    }

    safeSetValue("ai-export-preview", payload);
  }

  function copyAiExportToClipboard() {
    const text = document.getElementById("ai-export-preview")?.value || "";
    navigator.clipboard.writeText(text);
    alert("Payload copied! Paste into chat with AI coach to diagnose vulnerabilities.");
    const m = document.getElementById("modal-ai-export");
    if (m) m.classList.remove("active");
  }

  function openMasterLedgerExportModal() {
    pushHistoryState("modal-ledger-export");
    const m = document.getElementById("modal-ledger-export");
    if (m) m.classList.add("active");
  }

  async function downloadLedgerJson() {
    const includeImages = document.getElementById("ledger-include-images")?.checked ?? false;
    const allQs = await getAllRecords("store_questions");
    const sorted = sortQuestionsHierarchical(allQs);

    const sanitized = sorted.map(q => {
      if (!includeImages) {
        const copy = { ...q };
        if (copy.imageUrl && copy.imageUrl.startsWith("data:image")) {
          copy.imageUrl = "[BASE64_IMAGE_OMITTED_FOR_LIGHTWEIGHT_LEDGER]";
        }
        return copy;
      }
      return q;
    });

    await downloadFileResilient(`cgl_master_bank_ledger_${Date.now()}.json`, "application/json", JSON.stringify(sanitized, null, 2));
    const m = document.getElementById("modal-ledger-export");
    if (m) m.classList.remove("active");
  }

  async function downloadLedgerMarkdown() {
    const allQs = await getAllRecords("store_questions");
    const sorted = sortQuestionsHierarchical(allQs);

    let txt = `# SSC CGL MASTER QUESTION BANK REFERENCE LEDGER\nGenerated on: ${formatISTDate(Date.now())}\nTotal Questions: ${sorted.length}\n\n`;
    let curSubject = "";
    let curChapter = "";

    sorted.forEach((q, idx) => {
      if (q.subject !== curSubject) {
        curSubject = q.subject;
        txt += `\n=======================================================\n`;
        txt += `=== SUBJECT: ${TAXONOMY[curSubject] ? TAXONOMY[curSubject].name : curSubject} (${curSubject}) ===\n`;
        txt += `=======================================================\n\n`;
      }
      if (q.chapter !== curChapter) {
        curChapter = q.chapter;
        txt += `--- CHAPTER: ${curChapter} ---\n\n`;
      }

      const pInfo = q.parentPassageId ? ` | PASSAGE_SET: ${q.parentPassageId} (${q.setOrder}/${q.setTotal})` : "";
      txt += `[RECORD ${idx + 1}] ID: ${q.id} | TOPIC: ${q.subtopic || "General"} | METHOD: ${q.method || "General"}${pInfo} | CONCEPTS: ${(q.conceptIds || [q.conceptId]).filter(Boolean).join(", ") || "None"}\n`;
      if (q.passageText) txt += `PASSAGE: ${q.passageText}\n`;
      txt += `QUESTION: ${q.questionText}\n`;
      q.options.forEach((opt, oIdx) => {
        txt += `  (${oIdx + 1}) ${opt}\n`;
      });
      txt += `CORRECT OPTION: ${q.correctIndex + 1}\n`;
      txt += `EXPLANATION: ${q.explanation || "None"}\n\n`;
    });

    await downloadFileResilient(`cgl_master_bank_gem_pack_${Date.now()}.txt`, "text/plain", txt);
    const m = document.getElementById("modal-ledger-export");
    if (m) m.classList.remove("active");
  }

  async function copyLiveSystemManifestToClipboard() {
    const questions = await getAllRecords("store_questions");
    const attempts = await getAllRecords("store_attempts");
    const concepts = await ConceptService.getAll();
    const consultations = await getAllRecords("store_ai_consultations");

    const manifest = `# SSC CGL Intelligence OS - Live Runtime Introspection Manifest (V7.2)
Generated at: ${formatISTDate(Date.now())}
Target Candidate: Ankit Kumar (SSC CGL 2026 Tier 1 & Tier 2 Master Preparation)

## 1. Live Telemetry Metrics
- Master Question Pool: ${questions.length}
- Completed Mocks: ${attempts.filter(a => a.completed && a.mockType !== "STUDY_VIEW").length}
- Living Knowledge Sheets: ${concepts.length}
- Clinical Consultations Logged: ${consultations.length}
- Local Waterfall API Keys Configured: ${AiGatewayService.keys.length}

## 2. Active System Taxonomy & Chapters
${JSON.stringify(TAXONOMY, null, 2)}

## 3. Supported JSON Action Contracts (Single or Batch Array)
- CREATE_MOCK / CREATE_AND_SAVE_FIXED_MOCK (Supports ephemeral: true, remediatesQuestionId, positiveMarks, negativeMarks, shuffleOptions)
- LAUNCH_DOJO (Opens Untimed Dojo Clinic with custom questions, explicit IDs, or chapter/method filters)
- GET_SYSTEM_STATS
- GET_CHAPTER_BLUEPRINT (Compact index of sheet IDs, titles, and question archetypes in a chapter)
- AUDIT_DATA_INTEGRITY (Detects duplicates, broken concept links, citation leaks, and taxonomy orphans)
- CLEANUP_COMPENDIUM_STORE (Deduplicates twin sheets, strips citation tags, fixes World Geography chapter tags)
- BULK_PATCH_RECORDS (Mass update questions or sheets by ID list or filter)
- SET_UI_CONFIG / INJECT_CUSTOM_CSS (Persistent runtime customization via store_config)
- RUN_SANDBOX_QUERY (Declarative filter, groupBy, and projection over any store)
- SEARCH_QUESTIONS / SEARCH_CONCEPTS / FETCH_QUESTIONS / FETCH_STORE_RECORDS / VERIFY_QUESTION_EXISTS
- CREATE_QUESTION / UPDATE_QUESTION / DELETE_QUESTION
- CREATE_CONCEPT / UPDATE_CONCEPT / DELETE_CONCEPT
- SAVE_AI_INSIGHT / SAVE_AI_PLAN / GET_AI_CONTEXT
- INGEST_AND_ASSEMBLE_COMPLETE_MOCK / INGEST_AND_LAUNCH_MOCK / AI_PRESCRIBE_REMEDY
- EXECUTE_AI_CONSULTATION_BUNDLE / BATCH_COMMANDS
- BATCH_INGEST_COMPENDIUM / BATCH_INGEST_QUESTIONS
- REQUEST_HISTORICAL_DUMP / SAVE_MOCK_PRESET / MODIFY_TAXONOMY / RAW_DB_OPERATION
`;
    navigator.clipboard.writeText(manifest);
    alert("Live AI Introspection Manifest (V7.2) copied to clipboard!");
  }

  /* ==========================================================================
   * SECTION 30: GLOBAL SEARCH, TEXT-SELECTION POPOVER, UNIVERSAL SWIPES & API
   * ========================================================================== */
  function openGlobalSearchModal() {
    pushHistoryState("modal-global-search");
    const m = document.getElementById("modal-global-search");
    if (m) m.classList.add("active");
    safeSetValue("global-search-input", "");
    safeSetHtml("global-search-results-list", `<p style="color:var(--text-muted); text-align:center; padding:30px;">Type keywords above to query the complete database.</p>`);
    setTimeout(() => {
      const inp = document.getElementById("global-search-input");
      if (inp) inp.focus();
    }, 150);
  }

  async function handleGlobalSearchInput(val) {
    const list = document.getElementById("global-search-results-list");
    if (!list) return;
    const term = String(val || "").trim();
    if (!term) {
      list.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:30px;">Type keywords above to query the complete database.</p>`;
      return;
    }

    const subFilter = document.getElementById("global-search-filter-sub")?.value || "ALL";
    const res = await SearchService.searchAll(term, { subject: subFilter }, 40);

    list.innerHTML = "";
    if (res.totalQuestions === 0 && res.totalConcepts === 0) {
      list.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:30px;">Zero matching items found across questions or sheets.</p>`;
      return;
    }

    if (res.questions.length > 0) {
      const qHead = document.createElement("div");
      qHead.style.cssText = "font-size:11px; font-weight:800; color:var(--accent-cyan); text-transform:uppercase; margin:8px 0 4px 0;";
      qHead.innerText = `// Question Matches (${res.questions.length})`;
      list.appendChild(qHead);

      res.questions.forEach(q => {
        const div = document.createElement("div");
        div.className = "card";
        div.style.padding = "10px";
        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; flex-wrap:wrap; gap:6px;">
            <span class="badge" style="background:#1f6feb;">${q.subject} \u2022 ${q.chapter} (${q.id})</span>
            <div style="display:flex; gap:5px;">
              <button class="btn btn-emerald" style="padding:2px 8px; font-size:10px;" onclick="CGL_OS.launchSingleQuestionDojo('${q.id}')">\uD83E\uDDD8 Dojo</button>
              <button class="btn btn-secondary" style="padding:2px 8px; font-size:10px;" onclick="CGL_OS.launchSingleQuestionPractice('${q.id}')">\u26A1 Timed</button>
            </div>
          </div>
          <div style="font-size:13px; line-height:1.5; color:#fff;">${formatRichText(q.questionText)}</div>
        `;
        list.appendChild(div);
      });
    }

    if (res.concepts.length > 0) {
      const cHead = document.createElement("div");
      cHead.style.cssText = "font-size:11px; font-weight:800; color:var(--accent-purple-light); text-transform:uppercase; margin:14px 0 4px 0;";
      cHead.innerText = `// Knowledge Sheet Matches (${res.concepts.length})`;
      list.appendChild(cHead);

      res.concepts.forEach(c => {
        const div = document.createElement("div");
        div.className = "card";
        div.style.padding = "10px";
        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <b style="font-size:13.5px; color:#fff;">\uD83D\uDCD6 ${c.title}</b>
            <button class="btn btn-secondary" style="padding:2px 8px; font-size:10px;" onclick="CGL_OS.openCompendiumToSheet('${c.id}', '${c.subject}', '${c.chapter}')">Read Sheet</button>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">${c.subtitle || ""}</div>
        `;
        list.appendChild(div);
      });
    }
  }

  /**
   * FLOATING TEXT-SELECTION ACTION POPOVER ([ 🙈 Mask ] | [ 🟡 🟢 🔵 🔴 Highlight ] | [ 📌 Cue ])
   */
  function initTextSelectionPopover() {
    const popover = document.getElementById("selection-action-popover");
    if (!popover) return;

    const handleSelectionCheck = () => {
      if (compendiumMaskEditMode || compendiumHighlightMode) {
        popover.classList.remove("active");
        return;
      }
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        popover.classList.remove("active");
        return;
      }
      const txt = sel.toString().replace(/\s+/g, " ").trim();
      if (txt.length < 2 || txt.length > 260) {
        popover.classList.remove("active");
        return;
      }

      const anchorNode = sel.anchorNode;
      const el = anchorNode && anchorNode.nodeType === 3 ? anchorNode.parentElement : anchorNode;
      if (!el) return;

      const inCompendium = el.closest("#comp-studio-doc-body, #comp-studio-doc-content, #split-sheet-render-body, #split-sheet-body");
      const inQuestion = el.closest("#dojo-arena-body, #arena-body");

      if (!inCompendium && !inQuestion) {
        popover.classList.remove("active");
        return;
      }

      try {
        const range = sel.getRangeAt(0);
        pendingSelectedText = txt;
        pendingSelectionContext = inCompendium ? "SHEET" : "QUESTION";
        if (inCompendium) {
          const isSplit = !!el.closest("#split-sheet-body");
          const containerRoot = isSplit
            ? (document.getElementById("split-sheet-render-body") || document.getElementById("split-sheet-body"))
            : (document.getElementById("comp-studio-doc-body") || document.getElementById("comp-studio-doc-content"));
          pendingSelectionOccurrence = computePhraseOccurrenceAtRange(containerRoot, range, txt);
          pendingSelectionSheetId = isSplit
            ? activeSplitSheetId
            : (currentCompSheets[activeCompSheetIndex] ? currentCompSheets[activeCompSheetIndex].id : null);
        } else {
          pendingSelectionOccurrence = null;
          pendingSelectionSheetId = null;
        }

        const rect = range.getBoundingClientRect();
        const topPos = Math.max(12, rect.top - 48);
        const leftPos = Math.min(window.innerWidth - 280, Math.max(10, rect.left));
        popover.style.top = `${topPos}px`;
        popover.style.left = `${leftPos}px`;
        popover.classList.add("active");
      } catch (e) {
        popover.classList.remove("active");
      }
    };

    document.addEventListener("mouseup", () => setTimeout(handleSelectionCheck, 40));
    document.addEventListener("touchend", () => setTimeout(handleSelectionCheck, 120), { passive: true });
  }

  async function applySelectionRecallMask() {
    const popover = document.getElementById("selection-action-popover");
    if (popover) popover.classList.remove("active");
    if (!pendingSelectedText) return;

    await toggleCustomMaskPhraseOnActiveSheet(pendingSelectedText, pendingSelectionOccurrence, pendingSelectionSheetId);
    window.getSelection()?.removeAllRanges();
  }

  async function applySelectionHighlight(color = "amber") {
    const popover = document.getElementById("selection-action-popover");
    if (popover) popover.classList.remove("active");
    if (!pendingSelectedText) return;

    if (pendingSelectionContext === "SHEET") {
      await toggleCustomHighlightOnActiveSheet(pendingSelectedText, color, pendingSelectionOccurrence, pendingSelectionSheetId);
    } else {
      await saveSelectionToPersonalCue();
      return;
    }
    window.getSelection()?.removeAllRanges();
  }

  async function saveSelectionToPersonalCue() {
    const popover = document.getElementById("selection-action-popover");
    if (popover) popover.classList.remove("active");
    if (!pendingSelectedText) return;

    if (pendingSelectionContext === "SHEET") {
      const sheet = currentCompSheets[activeCompSheetIndex];
      if (sheet) {
        const scratchEl = document.getElementById("comp-studio-scratchpad");
        const cur = scratchEl ? scratchEl.value.trim() : "";
        const updated = cur ? `${cur}\n• ${pendingSelectedText}` : `• ${pendingSelectedText}`;
        safeSetValue("comp-studio-scratchpad", updated);
        await autoSaveCompScratchpad(updated);
      }
    } else {
      const q = (dojoExam && document.getElementById("dojo-arena-view")?.style.display === "flex")
        ? dojoExam.questions[dojoExam.currentIndex]
        : (activeExam ? activeExam.questions[activeExam.currentQuestionIndex] : null);

      if (q) {
        const updated = q.annotation ? `${q.annotation}\n• ${pendingSelectedText}` : `• ${pendingSelectedText}`;
        q.annotation = updated;
        if (!q.ephemeral) {
          await QuestionService.update(q.id, { annotation: updated });
        }
        safeSetValue("dojo-arena-annotation", updated);
      }
    }

    window.getSelection()?.removeAllRanges();
    alert("Saved highlight to your Personal Cue!");
  }

  function switchTab(tId, btn) {
    document.querySelectorAll(".view-container").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));

    const targetEl = document.getElementById(tId);
    if (targetEl) targetEl.classList.add("active");

    const targetNavBtn = btn || document.getElementById(`nav-btn-${tId}`);
    if (targetNavBtn) targetNavBtn.classList.add("active");

    if (tId === "tab-dashboard") renderDashboard();
    if (tId === "tab-dojo") renderPracticeQuestionsTable();
    if (tId === "tab-console") {
      renderApiVaultUI();
      refreshDbInspector();
    }
  }

  function initGestureControllers() {
    window.addEventListener("popstate", () => {
      if (navStack.length > 0) {
        popNavLayer();
      } else {
        const arenaView = document.getElementById("exam-arena");
        if (arenaView && arenaView.style.display === "flex") {
          if (activeExam && activeExam.isReviewMode) exitReviewArena();
          else document.getElementById("btn-arena-pause")?.click();
          return;
        }

        const compView = document.getElementById("compendium-fullscreen-view");
        if (compView && compView.style.display === "flex") {
          closeCompendiumStudio();
          return;
        }

        const dojoView = document.getElementById("dojo-arena-view");
        if (dojoView && dojoView.style.display === "flex") {
          exitDojoArena();
        }
      }
    });

    // Bulletproof Scroll-Safe Horizontal Ancestor Guard
    const hasHorizontallyScrollableAncestor = (targetEl, stopAtRootEl) => {
      if (!targetEl || !(targetEl instanceof Element)) return false;
      if (targetEl.closest("#practice-subject-pills-row, #practice-chapter-pills-row, #practice-subtopic-pills-row, #practice-saved-presets-row, #dash-blueprints-pills, .comp-tabs-bar, .table-responsive, .katex-display, .scratchpad-toolbar, .matrix-chip-grid, .lab-pill-row, textarea, input, select")) {
        return true;
      }
      let curr = targetEl;
      while (curr && curr !== stopAtRootEl && curr !== document.body && curr !== document.documentElement) {
        const style = window.getComputedStyle(curr);
        const ox = style ? style.overflowX : "";
        if ((ox === "auto" || ox === "scroll") && curr.scrollWidth > curr.clientWidth + 2) {
          return true;
        }
        curr = curr.parentElement;
      }
      return false;
    };

    // Helper for horizontal swipe detection that ignores horizontal scroll tables, pill strips & zoomed sheets
    const bindHorizontalSwipe = (elementId, onSwipeLeft, onSwipeRight) => {
      const el = document.getElementById(elementId);
      if (!el) return;
      let startX = 0;
      let startY = 0;
      let ignoreSwipe = false;

      el.addEventListener("touchstart", (e) => {
        if (scratchpadDrawing || (scratchpadActive && scratchpadFingerDraw)) {
          ignoreSwipe = true;
          return;
        }
        if (elementId === "compendium-fullscreen-view" && compendiumZoomScale > 1.03) {
          ignoreSwipe = true;
          return;
        }
        if (e.touches.length !== 1 || hasHorizontallyScrollableAncestor(e.target, el)) {
          ignoreSwipe = true;
          return;
        }
        ignoreSwipe = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });

      el.addEventListener("touchend", (e) => {
        if (ignoreSwipe || scratchpadDrawing || (scratchpadActive && scratchpadFingerDraw)) return;
        if (elementId === "compendium-fullscreen-view" && compendiumZoomScale > 1.03) return;
        if (e.changedTouches.length === 1) {
          const deltaX = e.changedTouches[0].clientX - startX;
          const deltaY = e.changedTouches[0].clientY - startY;
          if (Math.abs(deltaX) > 58 && Math.abs(deltaX) > 2.1 * Math.abs(deltaY)) {
            if (deltaX < 0) onSwipeLeft();
            else onSwipeRight();
          }
        }
      }, { passive: true });
    };

    // 1. Exam & Review Arena Swipes
    bindHorizontalSwipe(
      "exam-arena",
      () => document.getElementById("btn-q-save-next")?.click(),
      () => document.getElementById("btn-q-prev")?.click()
    );

    // 2. Untimed Dojo Clinic Swipes
    bindHorizontalSwipe(
      "dojo-arena-view",
      () => navDojoArena(1),
      () => navDojoArena(-1)
    );
    // Horizontal swipe in Living Knowledge Studio (#compendium-fullscreen-view) is intentionally disabled
    // so sliding across text to Highlight, Mask, or Write with Stylus never switches sheets.

    // 4. Root 3-Tab Bar Swipes
    const viewportRoot = document.getElementById("app-viewport-root");
    if (viewportRoot) {
      let rootStartX = 0;
      let rootStartY = 0;
      let rootIgnoreSwipe = false;
      const tabs = ["tab-dashboard", "tab-dojo", "tab-console"];

      viewportRoot.addEventListener("touchstart", (e) => {
        const isModalOpen = document.querySelector(".modal-overlay.active");
        const isArenaOpen = document.getElementById("exam-arena")?.style.display === "flex";
        const isDojoOpen = document.getElementById("dojo-arena-view")?.style.display === "flex";
        const isCompOpen = document.getElementById("compendium-fullscreen-view")?.style.display === "flex";
        if (isModalOpen || isArenaOpen || isDojoOpen || isCompOpen) {
          rootIgnoreSwipe = true;
          return;
        }

        if (e.touches.length !== 1 || hasHorizontallyScrollableAncestor(e.target, viewportRoot)) {
          rootIgnoreSwipe = true;
          return;
        }

        rootIgnoreSwipe = false;
        rootStartX = e.touches[0].clientX;
        rootStartY = e.touches[0].clientY;
      }, { passive: true });

      viewportRoot.addEventListener("touchend", (e) => {
        if (rootIgnoreSwipe) return;
        const isModalOpen = document.querySelector(".modal-overlay.active");
        const isArenaOpen = document.getElementById("exam-arena")?.style.display === "flex";
        const isDojoOpen = document.getElementById("dojo-arena-view")?.style.display === "flex";
        const isCompOpen = document.getElementById("compendium-fullscreen-view")?.style.display === "flex";
        if (isModalOpen || isArenaOpen || isDojoOpen || isCompOpen) return;

        if (e.changedTouches.length === 1) {
          const deltaX = e.changedTouches[0].clientX - rootStartX;
          const deltaY = e.changedTouches[0].clientY - rootStartY;

          if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > 2.0 * Math.abs(deltaY)) {
            const activeTabEl = document.querySelector(".view-container.active");
            if (!activeTabEl) return;
            const currentIdx = tabs.indexOf(activeTabEl.id);
            if (currentIdx === -1) return;

            if (deltaX < 0 && currentIdx < tabs.length - 1) {
              switchTab(tabs[currentIdx + 1]);
            } else if (deltaX > 0 && currentIdx > 0) {
              switchTab(tabs[currentIdx - 1]);
            }
          }
        }
      }, { passive: true });
    }
  }

  const THEME_STORAGE_KEY = "cgl_os_theme_mode";
  let deferredWebApkPrompt = null;

  function initWebApkServiceWorkerAndInstallPrompt() {
    if (typeof window === "undefined") return;

    // Register Offline-First Service Worker (works on HTTPS / GitHub Pages & localhost)
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
      });
    }

    // Hide install button if already running as installed standalone WebAPK
    const isStandalone =
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true;
    const installBtn = document.getElementById("btn-install-webapk");
    if (isStandalone && installBtn) {
      installBtn.style.display = "none";
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredWebApkPrompt = e;
      const btn = document.getElementById("btn-install-webapk");
      const lbl = document.getElementById("install-webapk-label");
      if (btn) btn.style.display = "inline-flex";
      if (lbl) lbl.innerText = "Install WebAPK";
    });

    window.addEventListener("appinstalled", () => {
      deferredWebApkPrompt = null;
      const btn = document.getElementById("btn-install-webapk");
      if (btn) btn.style.display = "none";
    });
  }

  async function triggerWebApkInstall() {
    if (deferredWebApkPrompt) {
      deferredWebApkPrompt.prompt();
      try {
        await deferredWebApkPrompt.userChoice;
      } catch (_) {}
      deferredWebApkPrompt = null;
      return;
    }
    const modal = document.getElementById("modal-webapk-guide");
    if (modal) modal.classList.add("active");
  }

  function setThemeMode(mode) {
    const normalized = mode === "charcoal" ? "charcoal" : "midnight";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, normalized);
    } catch (_) {}

    if (document.documentElement) {
      document.documentElement.setAttribute("data-theme", normalized);
    }
    if (document.body) {
      document.body.setAttribute("data-theme", normalized);
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", normalized === "charcoal" ? "#181a20" : "#04060b");
    }

    const iconEl = document.getElementById("theme-toggle-icon");
    const labelEl = document.getElementById("theme-toggle-label");
    if (iconEl) iconEl.innerText = normalized === "charcoal" ? "🪨" : "🌙";
    if (labelEl) labelEl.innerText = normalized === "charcoal" ? "Charcoal" : "Midnight";

    if (compendiumPaperPreset === "FOLLOW_GLOBAL") {
      setCompendiumPaperPreset("FOLLOW_GLOBAL", false);
    }
  }

  function toggleThemeMode() {
    let current = "midnight";
    try {
      current = localStorage.getItem(THEME_STORAGE_KEY) || "midnight";
    } catch (_) {}
    const next = current === "charcoal" ? "midnight" : "charcoal";
    setThemeMode(next);
  }

  async function hydratePersistedUiConfig() {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "midnight";
      setThemeMode(savedTheme);
    } catch (_) {
      setThemeMode("midnight");
    }

    const scaleRec = await getRecord("store_config", "reader_font_scale");
    if (scaleRec && typeof scaleRec.value === "number") {
      readerFontScale = scaleRec.value;
      document.documentElement.style.setProperty("--reader-font-scale", String(readerFontScale));
    }
    const parRec = await getRecord("store_config", "subject_par_config");
    if (parRec && parRec.value && typeof parRec.value === "object") {
      SUBJECT_PAR_CONFIG = { ...SUBJECT_PAR_CONFIG, ...parRec.value };
    }
    const heroRec = await getRecord("store_config", "hero_subtitle");
    if (heroRec && typeof heroRec.value === "string") {
      safeSetText("dash-hero-sub", heroRec.value);
    }
    const cssRec = await getRecord("store_config", "custom_css_overrides");
    if (cssRec && typeof cssRec.value === "string" && cssRec.value.trim()) {
      await COMMAND_REGISTRY.INJECT_CUSTOM_CSS({ css: cssRec.value });
    }
  }

  async function initializeApplication() {
    const shield = document.getElementById("pause-shield");
    if (shield) shield.style.setProperty("display", "none", "important");

    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "midnight";
      setThemeMode(savedTheme);
    } catch (_) {}

    initWebApkServiceWorkerAndInstallPrompt();

    try {
      await getDB();
      await hydratePersistedUiConfig();
      await AiGatewayService.loadVault();
      await loadPracticeSavedPresets();
      initUniversalEngagementTracker();
      await syncAllTaxonomyDropdowns();
      await renderDashboard();
      initGestureControllers();
      initTextSelectionPopover();

      const savedSessionRec = await getRecord("store_active_session", "current_session");
      if (savedSessionRec && savedSessionRec.session && !savedSessionRec.session.completed) {
        activeExam = savedSessionRec.session;
        activeExam.isPaused = true;
        updateMiniPlayerDock();
      }
    } catch (e) {
      console.error("CGL_OS boot notice:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApplication);
  } else {
    initializeApplication();
  }

  // --- Complete Public API Export (V9.0) ---
  return {
    TaxonomyService,
    QuestionService,
    ConceptService,
    SearchService,
    MockService,
    PerformanceService,
    AiGatewayService,

    showToast,
    switchTab,
    pushNavLayer,
    popNavLayer,
    adjustReaderFontScale,
    setThemeMode,
    toggleThemeMode,
    triggerWebApkInstall,

    handleApiProviderPresetChange,
    toggleApiKeyInputVisibility,
    toggleSavedApiKeyReveal,
    copySavedApiKeySecret,
    editApiKeyInVault,
    cancelApiKeyEdit,
    addApiKeyToVault,
    deleteApiKeyFromVault,
    moveApiKeyOrder,
    testSingleApiKey,
    resetAllApiCooldowns,
    saveTaskRoutingConfig,

    openSheetsForPracticeFilter,
    handlePracticeSearchInput,
    handlePracticeSubjectChange,
    togglePracticeSubjectFilter,
    togglePracticeChapterFilter,
    togglePracticeSubtopicFilter,
    clearPracticeSubtopicPills,
    togglePracticeStatusFilter,
    togglePracticeDifficultyFilter,
    resetPracticeLabFilters,
    handlePracticeSortChange,
    saveCurrentPracticeFilterPreset,
    applyPracticeFilterPreset,
    deletePracticeFilterPreset,
    setPracticeLabViewMode,
    togglePracticeShowcaseRevealAll,
    toggleShowcaseCardSolution,
    selectShowcaseCardOption,
    launchDojoFromPracticePool,
    launchTimedSprintFromPracticePool,
    setPracticeQuickFilter,
    togglePracticeQuestionSelection,
    selectAllVisiblePractice,
    renderPracticeQuestionsTable,
    togglePracticeStemExpansion,
    toggleQuestionStarFromPractice,
    navPracticePage,
    launchPracticeSelectedSession,
    launchDojoFromPracticeSelection,
    buildMockFromPracticeSelection,
    launchSingleQuestionPractice,
    launchSingleQuestionDojo,
    launchSeeQuestions,

    openNewQuestionCreatorModal,
    smartParseRawQuestionText,
    handleNewQuestionImageUpload,
    submitNewQuestionCreator,
    syncNewQuestionChapterSelect,
    openEditQuestionModal,
    openEditCurrentArenaQuestion,
    openEditCurrentDojoQuestion,
    handleQuestionImageUpload,
    saveQuestionEditor,
    duplicateCurrentEditingQuestion,
    duplicateCurrentEditingQuestionFromId,
    deleteCurrentEditingQuestion,

    handleMarkingPresetChange,
    setMockStrategy,
    updateBuilderChapters,
    handleBuilderChapterSelectChange,
    handleBuilderChapterChipToggle,
    toggleAllBuilderMatrixChips,
    updateBuilderPoolEstimate,
    previewMockSelection,
    toggleMockPreviewAnswerKeys,
    swapPreviewedQuestion,
    removePreviewedQuestion,
    launchPreviewedQueueInDojo,
    launchPreviewedQueueAsMock,
    savePreviewedQueueAsFixedPaper,
    openCustomMockModal,
    addCustomSectionRow,
    removeCustomSectionRow,
    updateCustomRowSubject,
    updateCustomRowChapter,
    updateCustomRowCount,
    updateCustomRowDuration,
    openSaveBlueprintModal,
    saveCurrentPresetAction,
    launchSavedPreset,
    deleteSavedPreset,
    launchConfiguredDojo,
    launchConfiguredMock,

    requestEndSectionEarly,
    confirmEndSectionEarly,
    resumeFromMiniPlayer,
    reattemptMock,
    enterFullScreenReviewArena,
    exitReviewArena,
    toggleExamPalette,
    toggleCurrentArenaQuestionStar,

    openSplitSheetDrawer,
    closeSplitSheetDrawer,
    expandSplitSheetToFullStudio,

    openAiQuestionTutorModal,
    runAiTutorMicroTask,
    saveAiTutorOutputToQuestionCue,
    generateInstantMutantClone,
    promoteActiveMutantToBank,

    toggleScratchpadCanvas,
    toggleScratchpadLaserMode,
    toggleScratchpadFingerDraw,
    toggleScratchpadScrollMode,
    setScratchpadMode,
    setScratchpadColor,
    undoScratchpadStroke,
    clearScratchpadCanvas,

    openCompendiumStudio,
    closeCompendiumStudio,
    openCompendiumToSheet,
    openAllSheetsIndexModal,
    renderAllSheetsIndexList,
    toggleCompSheetSwitcherDrawer,
    toggleCompHighlightPopover,
    toggleCompStudioMoreMenu,
    toggleCompMorePopover,
    closeCompMorePopover,
    setCompendiumPaperPreset,
    setCompendiumReadingSurface,
    toggleCompendiumRecallMode,
    toggleCompendiumAutoBlurAll,
    revealNextCompendiumMask,
    resetCompendiumRevealedMasks,
    toggleCompendiumMaskEditMode,
    toggleCompendiumHighlightMode,
    setCompendiumHighlightColor,
    toggleCompSheetInkMode,
    toggleCompendiumFolioInkMode,
    setCompSheetInkTool,
    setCompendiumFolioInkTool,
    setCompSheetInkColor,
    setCompendiumFolioInkColor,
    toggleCompendiumFolioInkFingerMode,
    setCompSheetInkSize,
    undoCompSheetInk,
    undoCompendiumFolioInkStroke,
    clearCompSheetInk,
    clearCompendiumFolioInk,
    triggerPdfUploadPrompt,
    handlePdfDocumentUpload,
    openPdfInCompendiumStudio,
    renderActivePdfPage,
    navActivePdfPage,
    jumpToPdfPage,
    jumpToActivePdfPage: jumpToPdfPage,
    toggleActivePdfPageBookmark,
    togglePdfThumbnailStrip,
    togglePdfThumbnailScrubber: togglePdfThumbnailStrip,
    setPdfThumbnailFilter,
    renderPdfThumbnailStrip,
    insertBlankPageIntoActivePdf,
    flattenAndSaveActivePdf,
    deleteActivePdfDocument,
    pinStagedExcerptToMarginRail,
    extractStagedExcerptToQuestionCreator,
    jumpToPinnedExcerptSource,
    deletePinnedExcerpt,
    cancelStagedExcerpt,
    triggerCompSheetImageUpload,
    handleCompSheetImageUpload,
    handleCompSheetMediaFileUpload,
    pasteClipboardImageToSheet,
    addCompSheetStickyNote,
    addFloatingStickyNoteCard,
    openAddSheetMediaPrompt,
    setSheetMediaPlacementMode,
    handleSheetMediaStudioFile,
    handleSheetMediaStudioUrl,
    handleMediaModalPasteEvent,
    insertSheetMediaFromUrlInput,
    commitSheetMediaFromModal,
    toggleCompSheetMediaBlockMode,
    deleteCompSheetMediaBlock,
    removeCustomMaskByIndex,
    removeCustomHighlightByIndex,
    rateCurrentSheetRecall,
    launchFailedSheetQuestionsDojo,
    adjustCompendiumZoom,
    resetCompendiumZoom,
    openAiSheetArchitectModal,
    runAiSheetArchitectTask,
    handleCompStudioSubjectChange,
    handleCompStudioChapterChange,
    renderCompStudioSheets,
    renderActiveCompSheet,
    navCompStudioSheet,
    autoSaveCompScratchpad,
    deleteCurrentCompendiumSheet,
    promptCreateNewChapter,
    insertDossierSnippet,
    launchCurrentSheetQuestionsDrill,
    openConceptEditorModal,
    handleConceptImageUpload,
    saveConceptCard,

    applySelectionRecallMask,
    applySelectionHighlight,
    saveSelectionToPersonalCue,

    openOmniSearchModal,
    executeOmniSearch,
    openGlobalSearchModal,
    handleGlobalSearchInput,

    openSynapseGraphModal,
    renderSynapseExplorer,
    setSynapseLevel,
    launchDirectChapterDrill,
    launchDirectSheetDrill,

    openDojoSessionWithQuestions,
    recordDojoStopwatchSplit,
    launchWeakAreasDojo,
    launchDojoFromMockMistakes,
    exitDojoArena,
    navDojoArena,
    toggleDojoMethod,
    autoSaveDojoAnnotation,
    toggleDojoPalette,
    toggleCurrentDojoQuestionStar,

    openMockReview,
    switchReviewAttempt,
    handleMistakeTagSelect,
    setMistakeTag,
    openTrapClinicModal,
    drillFilteredTrapQuestions,
    openSubjectDiagnosticModal,
    openHistoryArchiveModal,
    renderArchiveList,
    deleteAttemptSession,

    openTaxonomyManagerModal,
    renderTaxonomyManagerList,
    addNewSubjectAction,
    promptAddChapterToSubject,
    deleteChapterFromSubject,
    openChapterMergeModal,
    deleteSubjectAction,
    syncEditorChapterDropdown,

    openPrintConfigModal,
    populatePrintMockDropdown,
    handlePrintTypeChange,
    updatePrintChapters,
    generateAndPrintSheet,
    sortQuestionsHierarchical,

    executeConsoleCommand,
    pasteAndExecuteClipboardCommand,
    runConsoleQuickAction,
    copyCompactAiContextToClipboard,
    copyCompactBiopsyToClipboard,
    loadSamplePayload,
    copyLiveSystemManifestToClipboard,
    openAiExportModal,
    updateAiExportPreview,
    copyAiExportToClipboard,
    openMasterLedgerExportModal,
    downloadLedgerJson,
    downloadLedgerMarkdown,
    openBackupRestoreModal,
    handleBackupFileSelect,
    executeHydrationRestore,
    exportFullBackup,
    exportCurrentReviewMockJson,
    exportMockByIdJson,
    exportKnowledgeBankJson,
    exportCurrentSelectedStoreJson,
    exportScopedForensicDossier,
    exportGlobalMasterDossier,
    exportUnifiedAiHandoffPackage,
    copyDownloadFallbackToClipboard,
    refreshDbInspector,
    editDbRecordModal,
    copyInspectedJsonToClipboard,
    wipeTestAttempts,
    factoryResetAll,
    switchDashboardDiagnosticTab,
    renderDashboard,
    launchContinueTrainingDrill,
    launchOnboardingDiagnosticMock
  };
})();

window.CGL_OS = CGL_OS;
