/**
 * CONTENT CONTRACT — Full-Stack Agent Playground (bilingual EN/AR)
 * Every string is drawn from the manual itself (upload/full-stack-agent-playground.md).
 * No lorem, no placeholder, no fabricated proof (§1.1 law 3, §13 rules 1–3).
 * This file is the single source of copy truth for the whole page.
 */

export type Locale = "ar" | "en";
export type Bi<T = string> = { ar: T; en: T };

export const ui = {
  skipToContent: { ar: "تخطَّ إلى المحتوى الرئيسي", en: "Skip to main content" },
  toggleTheme: {
    ar: "تبديل المظهر الفاتح والداكن",
    en: "Toggle light and dark theme",
  },
  switchToEnglish: { ar: "التبديل إلى الإنجليزية", en: "Switch to Arabic" },
  openMenu: { ar: "فتح قائمة التنقل", en: "Open navigation menu" },
  closeMenu: { ar: "إغلاق القائمة", en: "Close menu" },
  copyCommands: { ar: "نسخ كل الأوامر", en: "Copy all commands" },
  copied: { ar: "تم النسخ", en: "Copied" },
  copyFailed: { ar: "تعذّر النسخ", en: "Copy failed" },
  resetGates: { ar: "إعادة تعيين البوابات", en: "Reset gates" },
  gatesPassed: { ar: "بوابات ناجحة", en: "gates passing" },
  allGreen: {
    ar: "كل البوابات خضراء — توقّف. لا تذهيب بعد الآن.",
    en: "All gates green — STOP. No gold-plating.",
  },
  inProgress: { ar: "قيد التنفيذ", en: "In progress" },
  backToTop: { ar: "العودة إلى الأعلى", en: "Back to top" },
  terminalTitle: { ar: "اللوح النهائي — اقرأه أخيراً", en: "The terminal block — read last" },
} satisfies Record<string, Bi>;

export const nav = [
  { id: "laws", label: { ar: "القوانين السبعة", en: "Seven Laws" } },
  { id: "workflow", label: { ar: "سير العمل", en: "Workflow" } },
  { id: "stack", label: { ar: "عقد التقنيات", en: "Stack Contract" } },
  { id: "gates", label: { ar: "بوابات التحقق", en: "Gate Battery" } },
  { id: "discipline", label: { ar: "مكافحة السلوب", en: "Anti-Slop" } },
  { id: "never", label: { ar: "اللوح النهائي", en: "NEVER Block" } },
] as const;

export const hero = {
  kicker: { ar: "دليل تشغيلي · الإصدار 1.0.0", en: "Operating manual · v1.0.0" },
  title: {
    ar: "الدليل التشغيلي لبناء مواقع الويب بجودة إنتاجية",
    en: "The operating manual for building production-grade websites",
  },
  sub: {
    ar: "انضباطُ بناءٍ متكامل للوكلاء الذكيين: استلامٌ بالعقود، وتقنياتٌ تُثبَّت بالقانون، ورموزٌ تصميمية واحدة، وحِرفيةٌ مضادة للسلوب، وتسليمٌ بالأدلة — ثنائي اللغة، ومُتحقَّقٌ منه في الاتجاهين.",
    en: "A complete build discipline for AI agents: contract-first intake, stack pinned by law, one design-token file, anti-slop craft, and evidence-based delivery — bilingual by design, verified in both directions.",
  },
  goldenRuleLabel: { ar: "القاعدة الذهبية", en: "The golden rule" },
  goldenRule: {
    ar: "كل شيء عبر ملفات العقود، وكل تسليم مصحوب بدليل، وكل بُعد غير محدد يُسأل عنه أو يُسجَّل — ولا يُخترع أبداً.",
    en: "Everything through contract files, every delivery carries evidence, every unspecified dimension is asked about or logged — never invented.",
  },
  ctaPrimary: { ar: "استكشف القوانين السبعة", en: "Explore the seven laws" },
  ctaSecondary: { ar: "شغّل بوابات التحقق", en: "Run the gate battery" },
  verifiedLine: {
    ar: "يُتحقَّق منه في: RTL/LTR × داكن/فاتح × 1440/768/375",
    en: "Verified in: RTL/LTR × dark/light × 1440/768/375",
  },
  stackChips: [
    "Next.js 16",
    "React 19",
    "TypeScript strict",
    "Tailwind CSS 4",
    "shadcn/ui",
    "Prisma",
  ],
} satisfies { [K in keyof typeof hero]: Bi | string[] };

export const lawsSection = {
  index: "§1",
  kicker: { ar: "دستور التشغيل — القوانين السبعة", en: "The operating constitution — seven laws" },
  title: { ar: "القوانين السبعة", en: "The Seven Laws" },
  intro: {
    ar: "سبعة قوانين تحكم كل بناء. من يدخل هذا الملف مطيعاً لها، يخرج منه بموقعٍ يعمل.",
    en: "Seven laws govern every build. Enter this file obeying them, and you leave with a website that works.",
  },
  laws: [
    {
      n: "01",
      title: { ar: "العقود أولاً", en: "Contract-first" },
      desc: {
        ar: "كل مدخلٍ يشكّل البناء هو ملف: موجز، رموز، مخطط، جدول مسارات، محتوى. الكلام في الدردشة ليس عقداً.",
        en: "Every input that shapes the build is a file: brief, tokens, schema, route table, content. Chat prose is not a contract.",
      },
    },
    {
      n: "02",
      title: { ar: "لا اختراع أبداً", en: "Never invent" },
      desc: {
        ar: "«غير محدد» يعني: يُسأل عنه أو يُسجَّل — ولا يُتخيَّل أبداً. المجهول البسيط يذهب إلى ASSUMPTIONS.md، والمؤثر يُصعَّد كـ BLOCKED.",
        en: "Unspecified means asked about or logged — never imagined. Trivial unknowns go to ASSUMPTIONS.md; blocking ones become a BLOCKED report.",
      },
    },
    {
      n: "03",
      title: { ar: "الوكيل يقلّد مدخلاته", en: "Agents imitate their input" },
      desc: {
        ar: "نصٌّ وهميٌّ داخلاً يعني موقعاً عاماً خارجاً؛ ومحتوى حقيقياً وبيانات حقيقية تعني منتجاً حقيقياً. لا يُشحن محتوى وهمي أبداً.",
        en: "Lorem in, generic site out; real copy and real data in, real product out. Never ship placeholder content.",
      },
    },
    {
      n: "04",
      title: { ar: "الأدلة قبل الادعاءات", en: "Evidence over claims" },
      desc: {
        ar: "«تم» تعني: البوابات خضراء، والمصفوفة معبّأة، ولقطات الشاشة مرفقة. التقرير الذاتي ليس قبولاً أبداً.",
        en: "\u201cDone\u201d means gates green, matrix filled, screenshots attached. Self-report is never acceptance.",
      },
    },
    {
      n: "05",
      title: { ar: "عملٌ محدودٌ بحدود", en: "Bounded work" },
      desc: {
        ar: "مهمة واحدة = شريحة رأسية واحدة = خمسة ملفات كحد أقصى = التزام واحد = دورة تحقق واحدة.",
        en: "One task = one vertical slice = \u22645 files = one commit = one verification pass.",
      },
    },
    {
      n: "06",
      title: { ar: "الرموز قبل المكونات", en: "Tokens before components" },
      desc: {
        ar: "عقد الرموز التصميمية يُكتب قبل أول مكوّن؛ ممنوعٌ إطلاق أنماط افتراضية ثم «التخصيص لاحقاً».",
        en: "The design-token contract is written before the first component; never emit default styles and \u201ccustomize later\u201d.",
      },
    },
    {
      n: "07",
      title: { ar: "الأجزاء «المملة» بجودةٍ عالية", en: "Ship the boring parts right" },
      desc: {
        ar: "الحالات (فارغ/تحميل/خطأ)، الوصولية، التباين، reduced-motion، وRTL — هذه أرضيتك لا صقلُك اللاحق.",
        en: "States, a11y, contrast, reduced-motion, RTL — these are your floor, not polish.",
      },
    },
  ],
} as const;

export const workflowSection = {
  index: "§3",
  kicker: { ar: "قواعد المراحل — ترتيب ثابت لا يُخترق", en: "The phase grammar — a fixed order" },
  title: { ar: "سير العمل", en: "The Workflow" },
  intro: {
    ar: "من العقود إلى بوابات الإصدار: كل مرحلة تُسلّم قيمة، ولا طبقات أفقية أبداً — بل شرائح رأسية كاملة.",
    en: "From contracts to release gates: every phase delivers value, and never horizontal layers — full vertical slices only.",
  },
  phases: [
    {
      n: "01",
      title: { ar: "العقود", en: "Contracts" },
      desc: {
        ar: "الرموز والمخطط جذرا الـDAG؛ كل شيء آخر يعتمد عليهما.",
        en: "Tokens and schema are the two DAG roots; everything else depends on them.",
      },
    },
    {
      n: "02",
      title: { ar: "الهيكل الماشي", en: "Walking skeleton" },
      desc: {
        ar: "2–3 كيانات أساسية من طرفٍ إلى طرف — أخطر بندٍ وأول تسليم قيمة.",
        en: "2–3 core entities end-to-end — the riskiest item and the first value delivery.",
      },
    },
    {
      n: "03",
      title: { ar: "الشرائح الرأسية", en: "Vertical slices" },
      desc: {
        ar: "صفحة أو ميزة واحدة كل مرة بكامل المكدس — أبداً «كل الأنماط أولاً».",
        en: "One page/feature at a time, full stack — never \u201call styles first\u201d.",
      },
    },
    {
      n: "04",
      title: { ar: "المحتوى والصقل", en: "Content & polish" },
      desc: {
        ar: "نصٌّ حقيقي، حركةٌ منضبطة، وحوافٌ مصمَّمة: 404، الحالات الفارغة، حلقات التركيز.",
        en: "Real copy, disciplined motion, designed edges: 404, empty states, focus rings.",
      },
    },
    {
      n: "05",
      title: { ar: "التكامل", en: "Integration" },
      desc: {
        ar: "تدفقاتٌ عابرة للصفحات + بطاقةُ البوابات كاملة + مصفوفةُ التحقق.",
        en: "Cross-page flows + the full gate battery + the verification matrix.",
      },
    },
    {
      n: "06",
      title: { ar: "بوابات الإصدار", en: "Release gates" },
      desc: {
        ar: "تقرير تسليم + اختبار البارد-ستارت: وكيلٌ جديد يقرأ من القرص بأسئلةٍ صفرية.",
        en: "Delivery report + cold-start test: a fresh agent resumes from disk with zero questions.",
      },
    },
  ],
} as const;

export const stackSection = {
  index: "§4",
  kicker: { ar: "التقنيات المثبَّتة قانونٌ — وعادات الحقبَ السابقة مصدرُ العلل الأول", en: "The pinned stack is law — cross-era habits are the #1 bug source" },
  title: { ar: "عقد التقنيات", en: "The Stack Contract" },
  intro: {
    ar: "أربعُ لوحاتِ قانون: إطار العمل، ومكتبة العرض، وطبقة البيانات، والتحقق. اختر لوحةً واقرأ قوانينها.",
    en: "Four panels of law: the framework, the view library, the data layer, and validation. Pick a panel and read its laws.",
  },
  tabs: [
    {
      id: "nextjs",
      label: { ar: "Next.js 16", en: "Next.js 16" },
      laws: [
        {
          ar: "المعاملات وعناوين البحث Promises في الصفحات والمعالجات — انتظرها دائماً.",
          en: "params & searchParams are Promises in pages and route handlers — always await them.",
        },
        {
          ar: "الطلبات و GET غير مخزَّنين افتراضياً؛ فعِّل التخزين صراحةً وأنهِ كل تعديلٍ بـ revalidate.",
          en: "fetch and GET route handlers are uncached by default; opt in explicitly and end every mutation with revalidate.",
        },
        {
          ar: "redirect() يرمي NEXT_REDIRECT — لا تضعه في نفس try/catch مع منطق قاعدة البيانات.",
          en: "redirect() throws NEXT_REDIRECT — never inside the same try/catch as DB logic.",
        },
        {
          ar: "الوسيط تجربةُ مستخدمٍ لا أمنٌ؛ التفويض الحقيقي يعيش داخل الصفحات والإجراءات.",
          en: "Middleware is UX, not security; real authorization lives in pages and actions.",
        },
        {
          ar: "next build لا يشغّل ESLint في الإصدار 16 — فـ eslint . بوابةٌ مستقلة بذاتها.",
          en: "next build no longer runs ESLint in 16 — eslint . is its own gate.",
        },
      ],
    },
    {
      id: "react",
      label: { ar: "React 19", en: "React 19" },
      laws: [
        {
          ar: "useActionState للنماذج — لا useFormState القديم، و ref خاصيةٌ تُمرَّر مباشرة بلا forwardRef.",
          en: "useActionState for forms — not the old useFormState; ref is a prop, no new forwardRef.",
        },
        {
          ar: "لا حالةٌ مشتقةٌ داخل useState، ومفاتيحُ مستقرةٌ لكل قائمة — أبداً فهرس المصفوفة.",
          en: "Never store derived state in useState; stable unique keys — never array indexes on dynamic lists.",
        },
        {
          ar: "كل تأثيرٍ غير متزامنٍ يحصل على AbortController في التنظيف — وStrictMode يبقى.",
          en: "Every async effect gets AbortController cleanup — and StrictMode stays.",
        },
        {
          ar: "use client على الأوراق التفاعلية فقط — أبداً على الصفحات أو الـ barrels.",
          en: "\u201cuse client\u201d at interactive leaves only — never on pages, layouts, or barrels.",
        },
        {
          ar: "عدم تطابق Hydration له ثلاثة أسباب: عرضٌ غير حتمي، تداخلُ HTML غير صالح، ومخازن تُرطَّب فوراً.",
          en: "Hydration mismatch has 3 causes: non-deterministic render, invalid HTML nesting, instantly-hydrating persisted stores.",
        },
      ],
    },
    {
      id: "prisma",
      label: { ar: "Prisma", en: "Prisma" },
      laws: [
        {
          ar: "النقود Decimal أو وحداتٌ صغرى صحيحة مع رمز عملة ISO — أبداً Float.",
          en: "Money: Decimal or integer minor units + ISO currency code — NEVER Float.",
        },
        {
          ar: "عميلٌ واحد لكل عملية: singleton عبر globalThis — وإلا استُنفدت الحوض عند إعادة التحميل.",
          en: "One PrismaClient per process: globalThis singleton — or the pool exhausts on hot reload.",
        },
        {
          ar: "select حدودٌ أمنية: include الكامل قد يشحن passwordHash إلى العميل.",
          en: "select is a security boundary — a full include can ship passwordHash to the client.",
        },
        {
          ar: "الكتابات متعددة الخطوات داخل $transaction، ولا انتظار لـ Prisma داخل الحلقات.",
          en: "Multi-step writes inside $transaction; never await Prisma in loops.",
        },
        {
          ar: "خريطة أخطاء Prisma إلى استجابات المجال: P2002→409، P2025→404، P2003→400/409.",
          en: "Map Prisma errors to domain responses: P2002\u2192409, P2025\u2192404, P2003\u2192400/409.",
        },
      ],
    },
    {
      id: "zod",
      label: { ar: "Zod", en: "Zod" },
      laws: [
        {
          ar: "مخططُ زودٍ واحدٌ مشتركٌ لكل شكل بيانات — تستهلكه النماذج والمعالجات معاً.",
          en: "One shared Zod schema per data shape — consumed by forms and handlers alike.",
        },
        {
          ar: "safeParse عند كل حدٍّ — لا استثناءاتٍ صامتةً تعبر طبقات التحقق.",
          en: "safeParse at every boundary — no silent exceptions crossing validation layers.",
        },
        {
          ar: "‎.strict() ضد الإسناد الجماعي — أبداً انشر جسم الطلب في data الخاص بـ Prisma.",
          en: ".strict() against mass assignment — never spread request bodies into Prisma data.",
        },
        {
          ar: "الطلبات تحمل النوايا لا النتائج: أعِد حساب السعر من قاعدة البيانات والصلاحيات من الخادم.",
          en: "Requests carry intents, never outcomes: recompute money from the DB and permissions from server checks.",
        },
      ],
    },
  ],
} as const;

export const gatesSection = {
  index: "§11",
  kicker: { ar: "الأرخص والأدق أولاً — ثم تقرير DONE بالأدلة", en: "Cheapest-deterministic-first — then a DONE report with evidence" },
  title: { ar: "بطاقة البوابات", en: "The Gate Battery" },
  intro: {
    ar: "اثنتا عشرة بوابةً تحسم «تم». فعِّل كل بوابةٍ اجتازها بناءُك وشاهد حكم الإنهاء: عند اخضرارها جميعاً — توقّف.",
    en: "Twelve gates decide \u201cdone\u201d. Toggle each gate your build passes and watch the termination contract: when they all turn green — STOP.",
  },
  terminalName: "verify.sh",
  gates: [
    {
      n: "01",
      label: { ar: "فحص الأنواع", en: "Typecheck gate" },
      command: "npx tsc --noEmit",
      desc: { ar: "خروجٌ بصفر — بلا استثناءات", en: "Exit 0 — no exceptions" },
    },
    {
      n: "02",
      label: { ar: "بوابة Lint", en: "Lint gate" },
      command: "npx eslint . --max-warnings 0",
      desc: { ar: "صفر تحذيرات، لا تُسكَت قاعدةٌ بلا مبررٍ موثق", en: "Zero warnings; no rule silenced without a logged reason" },
    },
    {
      n: "03",
      label: { ar: "بناء الإنتاج وجدول المسارات", en: "Production build & route table" },
      command: "npm run build",
      desc: { ar: "جدول المسارات كما في العقد: ○/ƒ/ISR لكل مسار", en: "Route table as spec'd: \u25cb/\u0192/ISR per route" },
    },
    {
      n: "04",
      label: { ar: "بوابات grep", en: "grep gates" },
      command: 'grep -rE "sk_live|whsec_|ignoreBuildErrors" .next',
      desc: { ar: "أسرارٌ وحقنٌ وكواتم — صفر إصابات", en: "Secrets, injection, silencers — zero hits" },
    },
    {
      n: "05",
      label: { ar: "مسح Playwright", en: "Playwright sweep" },
      command: "npx playwright test",
      desc: { ar: "لقطاتٌ عند 375/768/1440، فاتحٌ وداكن، LTR وRTL — لا تمريرٌ أفقي عند 375", en: "Screenshots at 375/768/1440, light + dark, LTR + RTL — no horizontal scroll at 375" },
    },
    {
      n: "06",
      label: { ar: "جولة لوحة المفاتيح", en: "Keyboard walkthrough" },
      command: "tab-order \u00b7 focus \u00b7 esc",
      desc: { ar: "ترتيب Tab سليم، تركيزٌ مرئي، Esc يغلق، ولا مصائد", en: "Sane Tab order, visible focus, Esc closes, no traps" },
    },
    {
      n: "07",
      label: { ar: "رحلات E2E الحرجة", en: "E2E critical journeys" },
      command: "next build && next start",
      desc: { ar: "5–10 رحلاتٍ على حزمة الإنتاج: مصفوفة authz، والتلاعب بالسعر يُرجع 400 لا 500", en: "5–10 journeys on the production bundle: authz matrix; price-tamper returns 400, never 500" },
    },
    {
      n: "08",
      label: { ar: "بوابات الأداء المعملية", en: "Lab performance gates" },
      command: "npx lighthouse --form-factor=mobile",
      desc: { ar: "أداء ≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms — ثلاث تشغيلات", en: "Perf \u226590 \u00b7 LCP \u22642.5s \u00b7 CLS \u22640.1 \u00b7 TBT \u2264300ms — 3 runs" },
    },
    {
      n: "09",
      label: { ar: "تباين الوضعين", en: "Both-theme contrast" },
      command: "node scripts/contrast-audit.mjs",
      desc: { ar: "نصٌّ مرئيٌّ 4.5:1، وغير نصي 3:1 — في الفاتح والداكن معاً", en: "4.5:1 body text, 3:1 non-text — in light AND dark" },
    },
    {
      n: "10",
      label: { ar: "عرضٌ بلا JavaScript", en: "JS-disabled render" },
      command: "javascript: false",
      desc: { ar: "محتوى فوق الطية مرئي — لا صفحاتٍ بيضاء تنتظر JS", en: "Above-fold content visible — no blank-until-JS shells" },
    },
    {
      n: "11",
      label: { ar: "محاكاة الحركة المخفَّضة", en: "Reduced-motion emulation" },
      command: "prefers-reduced-motion: reduce",
      desc: { ar: "فرقٌ بصريٌّ يؤكد إزالة الحركة واكتمال المحتوى", en: "Visual diff: motion removed, content complete" },
    },
    {
      n: "12",
      label: { ar: "وحدة تحكم نظيفة", en: "Clean console" },
      command: "console.error === 0",
      desc: { ar: "صفر أخطاءٍ في أي مسارٍ مدقَّق", en: "Zero errors on any audited route" },
    },
  ],
} as const;

export const disciplineSection = {
  index: "§8",
  kicker: { ar: "السلوب = افتراضٌ بلا مبرر — وكل بُعدٍ غير محددٍ صوتٌ للوسيط", en: "Slop = unjustified default — every unspecified dimension votes for the median" },
  title: { ar: "مكافحة السلوب", en: "Anti-Slop Discipline" },
  intro: {
    ar: "جردُ المحظورات قابلٌ للفحص بـ grep، وكل محظورٍ مقترنٌ بمرساةٍ إيجابية تُحل محله.",
    en: "A grep-checkable banned inventory — every NEVER paired with the ALWAYS that replaces it.",
  },
  neverLabel: { ar: "ممنوعٌ دائماً", en: "NEVER" },
  alwaysLabel: { ar: "الصحيح بدلاً منه", en: "ALWAYS" },
  pairs: [
    {
      never: {
        ar: "تدرجات بنفسجية/نيلية، وأزرارٌ متدرجة، ونصُّ جسمٍ متدرج",
        en: "Purple/indigo\u2192violet gradient heroes, gradient buttons, gradient body text",
      },
      always: {
        ar: "رموزُ علامةٍ مسطَّحة؛ لحظةُ تدرجٍ واحدة مبررةٌ كحدٍّ أقصى بـ oklab",
        en: "Flat brand tokens; ONE justified brand gradient moment max, in oklab",
      },
    },
    {
      never: {
        ar: "فقاعاتٌ زجاجيةٌ وشفقٌ (aurora) في كل مكان",
        en: "Glass blobs / aurora everywhere",
      },
      always: {
        ar: "الزجاج ≤ سطحين فوق محتوى ملونٍ فعلي",
        en: "Glass \u22642 chrome surfaces over real colorful content",
      },
    },
    {
      never: {
        ar: "ثلاث بطاقاتٍ متطابقةٍ في صفٍّ واحد",
        en: "3 identical cards in a row",
      },
      always: {
        ar: "تدرجٌ هرمي: عنصرٌ بارز، صفوفُ مقاييس، شبكةٌ غير متناظرة",
        en: "Hierarchy: featured span, metric rows, asymmetric grid",
      },
    },
    {
      never: {
        ar: "إيموجي كأيقونات، وعائلاتُ أيقوناتٍ مختلطة",
        en: "Emoji as icons; mixed icon families",
      },
      always: {
        ar: "عائلةٌ واحدة (Lucide)، مقاسات 16/20/24، وقاعدةُ خطٍّ واحدة",
        en: "One family (Lucide), 16/20/24, one stroke rule",
      },
    },
    {
      never: {
        ar: "ادعاءاتٌ إنشائية: «سلس، ثوري، فائق، يُطلق قدراتك»",
        en: "Slop copy: \u201cseamlessly, revolutionary, effortlessly, unlock\u201d",
      },
      always: {
        ar: "كل ادعاءٍ يحمل رقماً أو اسماً أو تاريخاً",
        en: "Every claim carries a number, a name, or a date",
      },
    },
    {
      never: {
        ar: "شهاداتٌ ومقاييسُ وشعاراتٌ مختلَقة",
        en: "Fabricated testimonials, metrics, logos",
      },
      always: {
        ar: "إن لم يوجد إثباتٌ حقيقي يُحذف القسم — لا يُزوَّر أبداً",
        en: "If real proof doesn't exist, the section is deleted — never faked",
      },
    },
  ],
} as const;

export const neverSection = {
  index: "§13",
  kicker: { ar: "لوحٌ نهائي — يُقرأ أخيراً ويُنفَّذ دائماً", en: "Terminal — read last, obeyed always" },
  title: { ar: "اللوح النهائي: لا تُطلقاً", en: "The NEVER Block" },
  intro: {
    ar: "خمسةَ عشرَ «لا» نهائيةً. كل واحدةٍ منها حاجزٌ مانعٌ لا تحذيرٌ يقبل التفاوض.",
    en: "Fifteen terminal \u201cnevers\u201d. Each one is a blocking wall, not a warning to negotiate.",
  },
  rules: [
    {
      ar: "لا اختراعَ لنقاط نهايةٍ أو نصوصٍ أو مكوناتٍ أو بيانات — اسأل أو سجِّل.",
      en: "Never invent endpoints, copy, components, or data — ask or log.",
    },
    {
      ar: "لا شحنَ Lorem أو Acme Corp أو محتوى وهميٍّ في المكونات.",
      en: "Never ship lorem, Acme Corp, or placeholder content in components.",
    },
    {
      ar: "لا شهاداتٍ أو مقاييسَ أو شعاراتٍ مختلَقة — احذف القسم بدلاً من تزييفه.",
      en: "Never fabricate testimonials, metrics, or logos — delete the section instead.",
    },
    {
      ar: "لا أنماطَ خارج نظام الرموز: لا hex خاماً في JSX ولا مسافاتٍ اعتباطية.",
      en: "Never style outside the token system: no raw hex in JSX, no arbitrary spacing.",
    },
    {
      ar: "لا شحنَ ثيم shadcn الافتراضي دون إعادة تلوينٍ أو تايبوغرافيا Inter وحيدة.",
      en: "Never ship the untouched default shadcn theme or Inter-only typography.",
    },
    {
      ar: "لا كتمَ بوابات: ignoreBuildErrors ولا eslint-disable بلا مبررٍ موثق.",
      en: "Never silence gates: no ignoreBuildErrors, no unjustified eslint-disable.",
    },
    {
      ar: "لا تعديلَ الاختبارات أو العتبات أو الخطوط الأساسية لتجاوز الفحوص.",
      en: "Never edit tests, thresholds, or baselines to make checks pass.",
    },
    {
      ar: "لا أسرارَ في NEXT_PUBLIC_ أو كود العميل — الكشفُ يعني التدوير أولاً.",
      en: "Never put secrets in NEXT_PUBLIC_ or client code — exposure means rotate FIRST.",
    },
    {
      ar: "لا ثقةَ بأسعارٍ أو أدوارٍ أو معرِّفات مرسلةٍ من العميل — أعِد الحساب خادمياً.",
      en: "Never trust client-sent prices, roles, or userIds — recompute server-side.",
    },
    {
      ar: "لا تحميلَ كسولاً لعنصر LCP ولا بواباتِ أنيميشنٍ فوق الطية.",
      en: "Never lazy-load the LCP hero or gate above-fold content behind animations.",
    },
    {
      ar: "لا 100vh على الجوال، ولا عناصرَ تعمل بالتمرير فقط، ولا أيقونات إيموجي، ولا transition-all.",
      en: "Never 100vh on mobile, hover-only affordances, emoji icons, or transition-all.",
    },
    {
      ar: "لا تحريكَ سوى transform/opacity، ولا حركةً بلا إيقاف، ولا تجاوزَ reduced-motion.",
      en: "Never animate anything but transform/opacity; never ship motion without a pause; never skip reduced-motion.",
    },
    {
      ar: "لا تعديلاتِ GET ولا كشفَ Server Actions ولا ويبهوكاتٍ بلا توقيعٍ أو idempotency.",
      en: "Never mutate on GET, expose Server Actions, or ship unsigned webhooks.",
    },
    {
      ar: "لا كسرَ RTL: لا خصائصَ فيزيائية، ولا تباعدَ أحرفٍ على العربية أبداً.",
      en: "Never break RTL: no physical direction classes, never letter-spacing on Arabic.",
    },
    {
      ar: "لا متابعةً بعد فشل بوابة، ولا وسمَ ما تعذَّر التحقق منه «منجزاً»، ولا تذهيبَ بعد نجاح الكل.",
      en: "Never continue past failing gates, mark unverifiable work done, or gold-plate after all AC pass.",
    },
  ],
} as const;

export const footer = {
  builtLine: {
    ar: "مبنيٌّ وفق الدليل نفسه: رموز OKLCH معاد تلوينها، حبيباتُ SVG، خصائصُ منطقية، وتحققٌ في الاتجاهين.",
    en: "Built by the manual itself: re-skinned OKLCH tokens, SVG grain, logical properties, verified in both directions.",
  },
  metaLine: {
    ar: "Next.js 16 · React 19 · TypeScript strict · Tailwind CSS 4 — الإصدار 1.0.0",
    en: "Next.js 16 · React 19 · TypeScript strict · Tailwind CSS 4 — v1.0.0",
  },
  license: { ar: "ترخيص خاص", en: "Proprietary license" },
  sectionsLabel: { ar: "أقسام الدليل", en: "Manual sections" },
} as const;
