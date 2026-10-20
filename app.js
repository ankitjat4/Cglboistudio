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
   * SECTION 2: RESILIENT 3-TIER DOWNLOAD PIPELINE (WEBAPK / WEBVIEW SHIELD)
   * ========================================================================== */
  let fallbackDownloadPayload = "";

  async function downloadFileResilient(filename, mimeType, contentString) {
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([contentString], filename, { type: mimeType });
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
      const blob = new Blob([contentString], { type: mimeType });
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

    fallbackDownloadPayload = contentString;
    safeSetText("download-fallback-title", `File: ${filename}`);
    safeSetValue("download-fallback-text", contentString);
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
      .then(() => alert("Export payload copied directly to clipboard!"))
      .catch(() => alert("Select all and copy manually from text box."));
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
  let practiceCurrentPage = 1;
  const PRACTICE_PAGE_SIZE = 20;

  // Granular Multi-Chapter Matrix State in Mock Lab
  let mockLabSelectedMatrixChapters = new Set();

  // Full-Screen Living Compendium Studio & User-Defined Recall Masks State
  let activeCompSubject = "QA";
  let activeCompChapter = "QA_PERCENTAGE";
  let activeCompSheetIndex = 0;
  let currentCompSheets = [];
  let currentConceptImageBase64 = "";
  let compendiumRecallMode = false;
  let compendiumMaskEditMode = false;
  let compendiumAutoBlurAll = false;
  let activeSheetCustomMasks = [];

  // Split-Screen Sheet + Question Drawer State
  let activeSplitSheetId = null;
  let activeSplitSheetSubject = null;
  let activeSplitSheetChapter = null;

  // Reader Typography Scale
  let readerFontScale = 1.0;

  // Global Scroll-Synchronized OnePlus Stylo 2 / Tablet Ink State & Per-Item Memory
  let scratchpadActive = false;
  let scratchpadScrollPassthrough = false;
  let scratchpadFingerDraw = false; // Default false: Stylus draws, 1-Finger scrolls naturally
  let scratchpadMode = "PEN";
  let scratchpadColor = "#38bdf8";
  let scratchpadDrawing = false;
  let scratchpadStrokes = [];
  let currentStroke = [];
  let inkMemoryByContextKey = {};
  let activeInkContextKey = "global_default";

  // Floating Text Selection Popover State
  let pendingSelectedText = "";
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

    // 5. Headings with Anchors for Sheet TOC Generation
    out = out.replace(/^#### (.*$)/gim, '<h4 style="font-size:14px; font-weight:800; color:var(--accent-purple-light); margin:10px 0 4px 0;">$1</h4>');
    out = out.replace(/^### (.*$)/gim, (match, title) => {
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<h3 id="sec-${anchor}" class="comp-heading-h3" style="font-size:15.5px; font-weight:800; color:var(--accent-cyan); margin:14px 0 5px 0;">${title}</h3>`;
    });
    out = out.replace(/^## (.*$)/gim, (match, title) => {
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<h2 id="sec-${anchor}" class="comp-heading-h2" style="font-size:17.5px; font-weight:800; color:#fff; margin:16px 0 6px 0;">${title}</h2>`;
    });
    out = out.replace(/^# (.*$)/gim, '<h1 class="comp-heading-h1" style="font-size:19.5px; font-weight:800; color:#fff; margin:18px 0 8px 0;">$1</h1>');

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
      return isWrappedMask ? `<span class="user-recall-mask">${rendered}</span>` : rendered;
    });

    // 13. Apply persisted per-sheet custom mask phrases (from 🖌️ Edit Masks or Selection Popover)
    if (Array.isArray(customMaskPhrases) && customMaskPhrases.length > 0) {
      customMaskPhrases.forEach(phrase => {
        const cleanP = String(phrase || "").trim();
        if (cleanP.length >= 2) {
          const rx = new RegExp(`(?![^<]*>)(${escapeRegExp(cleanP)})`, "g");
          out = out.replace(rx, '<span class="user-recall-mask" data-mask-phrase="true">$1</span>');
        }
      });
    }

    return out;
  }

  function adjustReaderFontScale(delta) {
    readerFontScale = Math.min(1.35, Math.max(0.84, parseFloat((readerFontScale + delta).toFixed(2))));
    document.documentElement.style.setProperty("--reader-font-scale", String(readerFontScale));
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

    buildOrderedKeyQueue(taskType, manualKeyId = null) {
      const now = Date.now();
      const available = this.keys.filter(k => k.enabled !== false && (!k.cooldownUntil || k.cooldownUntil <= now));
      const queue = [];
      const seen = new Set();

      const pushUnique = (k) => {
        if (k && !seen.has(k.id)) {
          seen.add(k.id);
          queue.push(k);
        }
      };

      // 1. Explicit Manual Override from UI Dropdown
      if (manualKeyId && manualKeyId !== "WATERFALL_AUTO") {
        const manualKey = this.keys.find(k => k.id === manualKeyId);
        if (manualKey) pushUnique(manualKey);
      }

      // 2. Task-Specific Allocated Key
      const mappedId = this.taskRoutes[taskType];
      if (mappedId && mappedId !== "WATERFALL_AUTO") {
        const taskKey = available.find(k => k.id === mappedId) || this.keys.find(k => k.id === mappedId);
        if (taskKey) pushUnique(taskKey);
      }

      // 3. Priority Waterfall: HIGH -> MEDIUM -> LOW
      const tierOrder = taskType === "SHEET_EDIT"
        ? ["LOW", "MEDIUM", "HIGH"]
        : ["HIGH", "MEDIUM", "LOW"];

      tierOrder.forEach(tier => {
        const tierKeys = available.filter(k => k.priority === tier);
        if (tierKeys.length > 0) {
          const offset = this.roundRobinIndex % tierKeys.length;
          for (let i = 0; i < tierKeys.length; i++) {
            pushUnique(tierKeys[(offset + i) % tierKeys.length]);
          }
        }
      });

      this.roundRobinIndex++;
      return queue;
    },

    async callSingleProviderKey(keyObj, systemPrompt, userPrompt, expectJson = false) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const provider = (keyObj.provider || "GEMINI").toUpperCase();
        const model = (keyObj.model || "gemini-2.5-flash").trim();
        const secret = (keyObj.secret || "").trim();

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
            const errTxt = await res.text();
            throw new Error(`HTTP ${res.status}: ${errTxt.slice(0, 120)}`);
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
            const errTxt = await res.text();
            throw new Error(`HTTP ${res.status}: ${errTxt.slice(0, 120)}`);
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
          keyObj.cooldownUntil = Date.now() + 60000; // 60s automatic cooldown
          keyObj.lastStatus = "COOLDOWN";
          console.warn(`Waterfall failover: Key '${keyObj.label}' failed (${err.message}). Trying next key...`);
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
          const statusHtml = onCooldown
            ? `<span class="badge" style="background:rgba(245,158,11,0.2); color:var(--status-amber);">\u23F3 Cooldown (${remSec}s)</span>`
            : `<span class="badge" style="background:rgba(16,185,129,0.2); color:var(--status-green);">\uD83D\uDFE2 Ready</span>`;

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
   * SECTION 17: SHARED SERVICE — PERFORMANCE SERVICE
   * ========================================================================== */
  const PerformanceService = {
    async getHistoricalAttempts() {
      const attempts = await getAllRecords("store_attempts");
      return attempts.filter(a => a.completed && a.mockType !== "STUDY_VIEW");
    },

    async calculateGlobalMetrics() {
      const completed = await this.getHistoricalAttempts();
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
      const completed = await this.getHistoricalAttempts();
      let attempted = 0, correct = 0, totalTimeSec = 0, wrongCount = 0, lastSeenEpoch = 0;

      completed.forEach(att => {
        if (Array.isArray(att.questions) && att.userResponses) {
          att.questions.forEach(q => {
            if (q.subject === subKey && q.chapter === chapter) {
              const resp = att.userResponses[q.id];
              if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
                attempted++;
                totalTimeSec += (resp.timeSpentSec || 0);
                lastSeenEpoch = Math.max(lastSeenEpoch, att.timestamp || 0);
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
      const completed = await this.getHistoricalAttempts();
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
                    lastWasIncorrect: false,
                    traps: []
                  };
                }
                const stats = map[tId];
                stats.attempts++;
                stats.totalTime += (resp.timeSpentSec || 0);
                stats.lastAttemptEpoch = Math.max(stats.lastAttemptEpoch, att.timestamp || 0);

                if (resp.selectedOption === q.correctIndex) {
                  stats.correct++;
                  const par = getSubjectThresholds(q.subject).parSec;
                  if ((resp.timeSpentSec || 0) <= par * 1.35) {
                    stats.lastWasIncorrect = false;
                  }
                } else {
                  stats.incorrect++;
                  stats.lastWasIncorrect = true;
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
      const completed = await this.getHistoricalAttempts();
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

    safeSetHtml("split-sheet-body", `
      <div style="font-size:11.5px; color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom:8px;">${sheet.subtitle || ""}</div>
      <div>${formatRichText(sheet.content, masks)}</div>
    `);

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
      const isHardwareEraser = (e.pointerType === "pen" && (e.buttons === 32 || e.button === 5));
      const effectiveMode = isHardwareEraser ? "ERASER" : scratchpadMode;
      const pressure = (e.pointerType === "pen" && e.pressure > 0) ? e.pressure : 0.5;

      scratchpadDrawing = true;
      const pos = getWorldPos(e);
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
      if (!scratchpadDrawing || !scratchpadActive) return;
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
    };

    const finishStroke = () => {
      if (!scratchpadDrawing) return;
      scratchpadDrawing = false;
      if (overlay) overlay.classList.remove("pen-active-stroke");
      if (currentStroke.length > 0) {
        scratchpadStrokes.push([...currentStroke]);
        inkMemoryByContextKey[activeInkContextKey] = [...scratchpadStrokes];
        currentStroke = [];
      }
      redrawScratchpad();
    };

    // 1. Direct Canvas Pointer Listeners (Active when Draw Mode is ON)
    canvas.addEventListener("pointerdown", (e) => {
      if (!scratchpadActive) return;
      if (!e.isPrimary) return;
      if (scratchpadScrollPassthrough && e.pointerType !== "pen") return;

      e.preventDefault();
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
      startStrokeFromEvent(e);
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!scratchpadDrawing || !scratchpadActive) return;
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
      ctx.beginPath();
      const isEraser = stroke[0].mode === "ERASER";
      const strokeCol = stroke[0].color || "#38bdf8";
      const avgPressure = stroke[0].pressure || 0.5;
      ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = isEraser ? 28 : Math.max(1.8, Math.min(4.8, 2.0 + avgPressure * 2.2));
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(stroke[0].x - sLeft, stroke[0].y - sTop);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x - sLeft, stroke[i].y - sTop);
      }
      ctx.stroke();
    });
    ctx.globalCompositeOperation = "source-over";
  }

  function toggleScratchpadCanvas(forceState = null) {
    const overlay = document.getElementById("scratchpad-overlay");
    if (!overlay) return;
    scratchpadActive = forceState !== null ? forceState : !scratchpadActive;
    overlay.classList.toggle("active", scratchpadActive);

    if (scratchpadActive) {
      // Default to Draw ON when opening the Sketchpad so drawing works immediately,
      // and 1 tap on "Scroll ON" lets all scrolls, swipes, and clicks pass straight through!
      scratchpadFingerDraw = true;
      syncScratchpadModeUI();
      initScratchpadCanvasListeners();
      setTimeout(resizeScratchpadCanvas, 20);
    } else {
      scratchpadDrawing = false;
      scratchpadScrollPassthrough = false;
      overlay.classList.remove("finger-draw-enabled", "scroll-passthrough", "pen-active-stroke");
    }

    const btn = document.getElementById("btn-arena-scratchpad");
    if (btn) btn.classList.toggle("active", scratchpadActive);
    const dojoBtn = document.getElementById("btn-dojo-scratchpad");
    if (dojoBtn) dojoBtn.classList.toggle("active", scratchpadActive);
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
    practiceCurrentPage = 1;

    safeSetValue("practice-search-input", "");
    document.querySelectorAll('[id^="pill-filter-"], [id^="pill-diff-"]').forEach(el => el.classList.remove("active"));
    const allBtn = document.getElementById("pill-filter-all");
    if (allBtn) allBtn.classList.add("active");

    renderPracticeQuestionsTable();
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

  function selectShowcaseCardOption(qId, optIdx) {
    practiceShowcaseSelectedOptionByQ[qId] = optIdx;
    practiceShowcaseRevealedIds.add(qId);
    renderPracticeQuestionsTable();
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

    const filtered = sortQuestionsHierarchical(await getCurrentlyFilteredPracticeQuestions());
    const perfMap = await PerformanceService.getQuestionPerformanceMap();

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
    return MockService.shuffle([...filtered]).slice(0, limit);
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

      card.addEventListener("click", () => {
        resp.selectedOption = idx;
        resp.status = "answered";
        resp.revealed = true;
        clearInterval(dojoStopwatchInterval);
        if (dojoSetupSplitSec !== null) {
          const calcSec = Math.max(0, dojoStopwatchSec - dojoSetupSplitSec);
          safeSetText("dojo-stopwatch-splits", `[Setup: ${dojoSetupSplitSec}s | Calc: ${calcSec}s | Total: ${dojoStopwatchSec}s]`);
        } else {
          safeSetText("dojo-stopwatch-splits", `[Solved in ${dojoStopwatchSec}s]`);
        }

        if (navigator.vibrate) navigator.vibrate(idx === q.correctIndex ? 25 : [40, 40]);

        renderDojoArenaQuestion(false);
        const fb = document.getElementById("dojo-arena-feedback");
        if (fb) {
          fb.style.display = "block";
          if (idx === q.correctIndex) {
            fb.style.background = "rgba(16, 185, 129, 0.22)";
            fb.style.color = "var(--status-green)";
            fb.innerText = "\u2713 Correct Answer!";
          } else {
            fb.style.background = "rgba(244, 63, 94, 0.22)";
            fb.style.color = "var(--status-red)";
            fb.innerText = `\u2717 Incorrect. Correct is Option ${q.correctIndex + 1}.`;
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
    const completed = await PerformanceService.getHistoricalAttempts();
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

      const div = document.createElement("div");
      div.className = "attempt-thread-group";

      const header = document.createElement("div");
      header.className = "attempt-thread-header";
      header.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <b style="font-size:13.5px; color:#fff;">${latest.title}</b>
            ${threadAttempts.length > 1 ? `<span class="badge" style="background:#8957e5; font-size:10px;">${threadAttempts.length} Attempts</span>` : ""}
            <span class="badge-slot slot-${(latest.diurnalSlot || "morning").toLowerCase()}">${latest.diurnalSlot || "DAY"}</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Latest: ${latest.timeIST || formatISTDate(latest.timestamp)}</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:15px; font-weight:800; color:var(--accent-cyan);">${(latest.finalScore || 0).toFixed(2)} pts</span>
        </div>
      `;

      const subList = document.createElement("div");
      subList.style.display = threadAttempts.length > 1 ? "none" : "block";

      threadAttempts.forEach(iter => {
        const row = document.createElement("div");
        row.className = "attempt-sub-row";
        row.innerHTML = `
          <div>
            <b>Attempt ${iter.attemptNumber || 1}</b> \u2022 <span style="color:var(--text-muted);">${iter.timeIST ? iter.timeIST.split(",")[1] : ""}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; color:var(--accent-cyan);">${(iter.finalScore || 0).toFixed(2)} pts</span>
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
   * SECTION 25: LIVING KNOWLEDGE STUDIO, USER-DEFINED 🙈 RECALL MASKS,
   * ALL-SHEETS MASTER INDEX & 🪄 AI SHEET ARCHITECT
   * ========================================================================== */
  function toggleCompendiumRecallMode(forceState = null) {
    compendiumRecallMode = forceState !== null ? forceState : !compendiumRecallMode;
    if (compendiumRecallMode && compendiumMaskEditMode) {
      toggleCompendiumMaskEditMode(false);
    }

    const canvas = document.getElementById("comp-studio-canvas");
    const btn = document.getElementById("btn-comp-recall-mode");
    const autoBlurBtn = document.getElementById("btn-comp-auto-blur-all");

    if (canvas) {
      canvas.classList.toggle("recall-mode-active", compendiumRecallMode);
      if (!compendiumRecallMode) {
        canvas.querySelectorAll(".recall-revealed").forEach(el => el.classList.remove("recall-revealed"));
      }
    }
    if (btn) {
      btn.classList.toggle("active", compendiumRecallMode);
      btn.innerText = compendiumRecallMode ? "\uD83D\uDC41\uFE0F Recall ON" : "\uD83D\uDE48 Recall Mode";
    }
    if (autoBlurBtn) {
      autoBlurBtn.style.display = compendiumRecallMode ? "inline-flex" : "none";
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
  }

  function toggleCompendiumMaskEditMode(forceState = null) {
    compendiumMaskEditMode = forceState !== null ? forceState : !compendiumMaskEditMode;
    if (compendiumMaskEditMode && compendiumRecallMode) {
      toggleCompendiumRecallMode(false);
    }
    const canvas = document.getElementById("comp-studio-canvas");
    const btn = document.getElementById("btn-comp-edit-masks");
    if (canvas) {
      canvas.classList.toggle("mask-edit-mode-active", compendiumMaskEditMode);
    }
    if (btn) {
      btn.classList.toggle("btn-amber", compendiumMaskEditMode);
      btn.innerText = compendiumMaskEditMode ? "\u2713 Done Masking" : "\uD83D\uDD8C\uFE0F Edit Masks";
    }
  }

  async function toggleCustomMaskPhraseOnActiveSheet(phraseText) {
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet) return;
    const cleanP = String(phraseText || "").trim();
    if (cleanP.length < 2) return;

    const existingIdx = activeSheetCustomMasks.indexOf(cleanP);
    if (existingIdx !== -1) {
      activeSheetCustomMasks.splice(existingIdx, 1);
    } else {
      activeSheetCustomMasks.push(cleanP);
    }

    await putRecord("store_notes", {
      id: `masks_${sheet.id}`,
      masks: activeSheetCustomMasks,
      timestamp: Date.now()
    });
    await renderActiveCompSheet();
  }

  function initCompendiumRecallTapHandler() {
    const canvas = document.getElementById("comp-studio-canvas");
    if (!canvas || canvas.dataset.recallBound === "true") return;
    canvas.dataset.recallBound = "true";

    canvas.addEventListener("click", async (e) => {
      // 1. In 🖌️ Edit Masks Mode: tapping any formula, cell, bold term, or existing mask toggles it!
      if (compendiumMaskEditMode) {
        const target = e.target.closest(".user-recall-mask, strong, em, td, .katex, .md-bullet-row span:last-child");
        if (target && canvas.contains(target)) {
          e.preventDefault();
          e.stopPropagation();
          const textVal = (target.innerText || "").trim();
          if (textVal.length >= 2) {
            await toggleCustomMaskPhraseOnActiveSheet(textVal);
          }
        }
        return;
      }

      // 2. In 🙈 Recall Mode: tapping any blurred element reveals/unblurs it on the spot!
      if (compendiumRecallMode) {
        const target = e.target.closest(".user-recall-mask, strong, .katex-display, td");
        if (target && canvas.contains(target)) {
          target.classList.toggle("recall-revealed");
        }
      }
    });
  }

  async function openAllSheetsIndexModal() {
    await renderAllSheetsIndexList();
    pushHistoryState("modal-all-sheets-index");
    const m = document.getElementById("modal-all-sheets-index");
    if (m) m.classList.add("active");
  }

  async function renderAllSheetsIndexList() {
    const listEl = document.getElementById("all-sheets-index-list");
    if (!listEl) return;

    const subFilter = document.getElementById("sheets-index-filter-sub")?.value || "ALL";
    const term = (document.getElementById("sheets-index-search")?.value || "").trim().toLowerCase();
    const allConcepts = await ConceptService.getAll();

    const filtered = allConcepts.filter(c => {
      if (subFilter !== "ALL" && c.subject !== subFilter) return false;
      if (term) {
        const inTitle = (c.title || "").toLowerCase().includes(term);
        const inSub = (c.subtitle || "").toLowerCase().includes(term);
        const inChap = (c.chapter || "").toLowerCase().includes(term);
        const inId = (c.id || "").toLowerCase().includes(term);
        if (!inTitle && !inSub && !inChap && !inId) return false;
      }
      return true;
    });

    safeSetText("all-sheets-index-sub", `Showing ${filtered.length} of ${allConcepts.length} Living Knowledge Sheets`);
    listEl.innerHTML = "";

    if (filtered.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">No sheets match your filter.</div>`;
      return;
    }

    const grouped = {};
    filtered.forEach(s => {
      const ch = `${s.subject} \u2022 ${s.chapter}`;
      if (!grouped[ch]) grouped[ch] = [];
      grouped[ch].push(s);
    });

    Object.keys(grouped).sort().forEach(groupKey => {
      const head = document.createElement("div");
      head.style.cssText = "font-size:11px; font-weight:800; color:var(--accent-cyan); margin:10px 0 6px 0; text-transform:uppercase; font-family:var(--font-mono);";
      head.innerText = `// ${groupKey} (${grouped[groupKey].length} Sheets)`;
      listEl.appendChild(head);

      grouped[groupKey].forEach(sheet => {
        const row = document.createElement("div");
        row.className = "tree-node-row";
        row.style.marginBottom = "6px";
        row.innerHTML = `
          <div style="overflow:hidden;">
            <b style="font-size:13px; color:#fff;">\uD83D\uDCD6 ${sheet.title}</b>
            <div style="font-size:11px; color:var(--text-muted);">${sheet.subtitle || sheet.id}</div>
          </div>
          <button class="btn btn-cyan" style="padding:3px 10px; font-size:11px; flex-shrink:0;">Open \u2794</button>
        `;
        row.onclick = () => {
          document.getElementById("modal-all-sheets-index")?.classList.remove("active");
          openCompendiumToSheet(sheet.id, sheet.subject, sheet.chapter);
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

      // Open in Staging Editor (#modal-concept-editor) so user inspects and approves before saving!
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
    activeCompSheetIndex = 0;
    await renderCompStudioSheets();
  }

  async function renderCompStudioSheets() {
    const allDossiers = await ConceptService.getAll();
    currentCompSheets = allDossiers.filter(d => d.subject === activeCompSubject && d.chapter === activeCompChapter);

    const tabsBar = document.getElementById("comp-studio-sheet-tabs");
    const docContent = document.getElementById("comp-studio-doc-content");
    if (tabsBar) tabsBar.innerHTML = "";
    if (docContent) docContent.innerHTML = "";

    if (currentCompSheets.length === 0) {
      if (docContent) {
        docContent.innerHTML = `
          <div style="text-align:center; padding:50px 14px; color:var(--text-muted);">
            <h3 style="font-size:16px; margin-bottom:8px; color:#fff;">No Topic Sheets in ${activeCompChapter}</h3>
            <p style="font-size:12px; margin-bottom:14px;">This chapter has no living sheets yet. Author your first sheet below or use 🪄 AI Sheet Architect.</p>
            <button class="btn" onclick="CGL_OS.openConceptEditorModal(true)">+ Create First Sheet</button>
          </div>
        `;
      }
      safeSetText("comp-linked-q-count", "0 Questions Linked");
      safeSetText("comp-mask-count-badge", "0 Custom Masks");
      return;
    }

    if (activeCompSheetIndex >= currentCompSheets.length) activeCompSheetIndex = 0;

    if (tabsBar) {
      currentCompSheets.forEach((sheet, idx) => {
        const tab = document.createElement("button");
        tab.className = "comp-sheet-tab" + (idx === activeCompSheetIndex ? " active" : "");
        tab.innerText = sheet.title || `Sheet ${idx + 1}`;
        tab.addEventListener("click", () => {
          activeCompSheetIndex = idx;
          renderActiveCompSheet();
        });
        tabsBar.appendChild(tab);
      });
    }

    await renderActiveCompSheet();
  }

  async function renderActiveCompSheet() {
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet) return;

    // Switch per-sheet ink context automatically
    switchScratchpadContext(`sheet_${sheet.id}`);

    document.querySelectorAll(".comp-sheet-tab").forEach((t, i) => {
      t.classList.toggle("active", i === activeCompSheetIndex);
    });

    safeSetText("comp-studio-header-title", sheet.title);
    safeSetText("comp-studio-header-sub", `${sheet.chapter} \u2022 Sheet ${activeCompSheetIndex + 1} of ${currentCompSheets.length} \u2022 Swipe Left/Right`);

    const linkedQs = await ConceptService.getLinkedQuestions(sheet.id, sheet.chapter);
    safeSetText("comp-linked-q-count", `${linkedQs.length} Associated Questions Linked`);

    // Load persisted user-defined custom masks for this sheet
    const savedMasksRec = await getRecord("store_notes", `masks_${sheet.id}`);
    activeSheetCustomMasks = savedMasksRec && Array.isArray(savedMasksRec.masks) ? savedMasksRec.masks : [];

    const inlineBraceCount = (sheet.content.match(/\{\{[\s\S]+?\}\}/g) || []).length;
    const totalMasks = activeSheetCustomMasks.length + inlineBraceCount;
    safeSetText("comp-mask-count-badge", `${totalMasks} Custom Mask${totalMasks === 1 ? "" : "s"}`);

    const toc = ConceptService.generateTOC(sheet.content);
    let tocHtml = "";
    if (toc.length > 0) {
      tocHtml = `
        <div class="sheet-toc-pill-wrap">
          <span style="font-size:10px; font-weight:800; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.8px; align-self:center;">Jump to:</span>
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
      imgHtml = `<div style="text-align:center; margin:16px 0;"><img src="${sheet.imageUrl}" style="max-height:280px; max-width:100%; border-radius:8px; border:1px solid var(--border-color);"></div>`;
    }

    const docContent = document.getElementById("comp-studio-doc-content");
    if (docContent) {
      docContent.innerHTML = `
        <div style="border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <span class="badge" style="background:#1f6feb;">${sheet.chapter}</span>
            <span style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">ID: ${sheet.id}</span>
          </div>
          <h1 style="font-size:22px; font-weight:800; color:#fff; margin-top:8px;">${sheet.title}</h1>
          ${sheet.subtitle ? `<div style="font-size:13px; color:var(--accent-cyan); font-family:var(--font-mono); margin-top:2px;">${sheet.subtitle}</div>` : ""}
        </div>
        ${tocHtml}
        ${imgHtml}
        <div style="font-size:calc(14.5px * var(--reader-font-scale)); line-height:1.78; color:var(--text-reading);">${formatRichText(sheet.content, activeSheetCustomMasks)}</div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:28px; padding-top:14px; border-top:1px solid var(--border-color);">
          <button class="btn btn-secondary" onclick="CGL_OS.navCompStudioSheet(-1)">[ \u2190 ] Previous Sheet</button>
          <span style="font-size:12px; font-weight:700; color:var(--text-muted);">${activeCompSheetIndex + 1} / ${currentCompSheets.length}</span>
          <button class="btn btn-secondary" onclick="CGL_OS.navCompStudioSheet(1)">Next Sheet [ \u2192 ]</button>
        </div>
      `;
    }

    const noteKey = `scratch_${sheet.id}`;
    const savedNote = await getRecord("store_notes", noteKey);
    safeSetValue("comp-studio-scratchpad", savedNote ? savedNote.content : "");
  }

  function navCompStudioSheet(step) {
    if (currentCompSheets.length === 0) return;
    activeCompSheetIndex += step;
    if (activeCompSheetIndex < 0) activeCompSheetIndex = currentCompSheets.length - 1;
    if (activeCompSheetIndex >= currentCompSheets.length) activeCompSheetIndex = 0;
    renderActiveCompSheet();
  }

  async function autoSaveCompScratchpad(val) {
    const sheet = currentCompSheets[activeCompSheetIndex];
    if (!sheet) return;
    await putRecord("store_notes", { id: `scratch_${sheet.id}`, content: val, timestamp: Date.now() });
    const st = document.getElementById("comp-scratchpad-status");
    if (st) {
      st.style.display = "inline";
      setTimeout(() => { st.style.display = "none"; }, 1500);
    }
  }

  async function deleteCurrentCompendiumSheet() {
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
    if (!sheet) return;

    closeCompendiumStudio();
    const linked = await ConceptService.getLinkedQuestions(sheet.id, sheet.chapter);

    if (linked.length === 0) {
      alert(`No questions in bank for ${sheet.chapter}.`);
      return;
    }

    if (openInDojo) {
      await openDojoSessionWithQuestions(linked, `Sheet Dojo: ${sheet.title}`, `**${sheet.title}:** ${sheet.subtitle || ""}`);
    } else {
      const instance = await MockService.generate({
        title: `Sheet Practice: ${sheet.title}`,
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
    handleCompStudioSubjectChange(activeCompSubject || "QA");
  }

  function closeCompendiumStudio() {
    safeSetDisplay("compendium-fullscreen-view", "none");
    toggleScratchpadCanvas(false);
  }

  function openConceptEditorModal(isNew = true) {
    currentConceptImageBase64 = "";
    safeSetText("concept-editor-title", isNew ? "Add Topic Sheet" : "Edit Topic Sheet");

    if (isNew || currentCompSheets.length === 0) {
      safeSetValue("concept-edit-id", "top_" + Date.now());
      safeSetValue("concept-edit-subject", activeCompSubject || "QA");
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
    pushHistoryState("modal-comp-omni-search");
    const m = document.getElementById("modal-comp-omni-search");
    if (m) m.classList.add("active");
    safeSetValue("comp-omni-search-input", "");
    safeSetHtml("comp-omni-results-list", `<p style="color:var(--text-muted); text-align:center; padding:20px;">Type keywords above to query across all living sheets.</p>`);
    setTimeout(() => {
      const inp = document.getElementById("comp-omni-search-input");
      if (inp) inp.focus();
    }, 150);
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

    const debtPool = MockService.shuffle(allQs.filter(q => (perfMap[q.id] && perfMap[q.id].lastWasIncorrect) || q.bookmarked));
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
   * FLOATING TEXT-SELECTION ACTION POPOVER ([ 🙈 Mask for Recall ] | [ 📌 Save to Cue ])
   */
  function initTextSelectionPopover() {
    const popover = document.getElementById("selection-action-popover");
    if (!popover) return;

    const handleSelectionCheck = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        popover.classList.remove("active");
        return;
      }
      const txt = sel.toString().trim();
      if (txt.length < 2 || txt.length > 260) {
        popover.classList.remove("active");
        return;
      }

      const anchorNode = sel.anchorNode;
      const el = anchorNode && anchorNode.nodeType === 3 ? anchorNode.parentElement : anchorNode;
      if (!el) return;

      const inCompendium = el.closest("#comp-studio-doc-content, #split-sheet-body");
      const inQuestion = el.closest("#dojo-arena-body, #arena-body");

      if (!inCompendium && !inQuestion) {
        popover.classList.remove("active");
        return;
      }

      pendingSelectedText = txt;
      pendingSelectionContext = inCompendium ? "SHEET" : "QUESTION";

      try {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const topPos = Math.max(12, rect.top - 46);
        const leftPos = Math.min(window.innerWidth - 230, Math.max(10, rect.left));
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

    await toggleCustomMaskPhraseOnActiveSheet(pendingSelectedText);
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

    // Helper for horizontal swipe detection that ignores horizontal scroll tables & math blocks
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
        const target = e.target;
        if (target && target.closest(".table-responsive, .katex-display, .comp-tabs-bar, .scratchpad-toolbar, textarea, input, select")) {
          ignoreSwipe = true;
          return;
        }
        ignoreSwipe = false;
        if (e.touches.length === 1) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        }
      }, { passive: true });

      el.addEventListener("touchend", (e) => {
        if (ignoreSwipe || scratchpadDrawing || (scratchpadActive && scratchpadFingerDraw)) return;
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

    // 3. Living Knowledge Studio Swipes
    bindHorizontalSwipe(
      "compendium-fullscreen-view",
      () => navCompStudioSheet(1),
      () => navCompStudioSheet(-1)
    );

    // 4. Root 3-Tab Bar Swipes
    const viewportRoot = document.getElementById("app-viewport-root");
    if (viewportRoot) {
      let rootStartX = 0;
      let rootStartY = 0;
      const tabs = ["tab-dashboard", "tab-dojo", "tab-console"];

      viewportRoot.addEventListener("touchstart", (e) => {
        const isModalOpen = document.querySelector(".modal-overlay.active");
        const isArenaOpen = document.getElementById("exam-arena")?.style.display === "flex";
        const isDojoOpen = document.getElementById("dojo-arena-view")?.style.display === "flex";
        const isCompOpen = document.getElementById("compendium-fullscreen-view")?.style.display === "flex";
        if (isModalOpen || isArenaOpen || isDojoOpen || isCompOpen) return;

        const target = e.target;
        if (target && target.closest("#dash-blueprints-pills, .comp-tabs-bar, .table-responsive, .matrix-chip-grid, .lab-pill-row")) {
          return;
        }

        if (e.touches.length === 1) {
          rootStartX = e.touches[0].clientX;
          rootStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      viewportRoot.addEventListener("touchend", (e) => {
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

  // --- Complete Public API Export (V8.0) ---
  return {
    TaxonomyService,
    QuestionService,
    ConceptService,
    SearchService,
    MockService,
    PerformanceService,
    AiGatewayService,

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

    toggleScratchpadCanvas,
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
    toggleCompendiumRecallMode,
    toggleCompendiumAutoBlurAll,
    toggleCompendiumMaskEditMode,
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
