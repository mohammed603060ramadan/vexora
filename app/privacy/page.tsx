"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type IconName =
  | "software"
  | "security"
  | "network"
  | "analytics"
  | "marketing"
  | "technology";

type Service = {
  id: IconName;
  short: string;
  title: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  problems: string[];
  process: string[];
  route: string;
  accent: {
    text: string;
    border: string;
    bg: string;
    glow: string;
  };
};

const WHATSAPP_NUMBER = "01115449868";
const WHATSAPP_BASE_URL = "https://wa.me/201115449868";

function createWhatsAppUrl(serviceName: string) {
  const message = encodeURIComponent(
    `مرحبًا VEXORA، أريد الاستفسار عن خدمة ${serviceName}.`
  );

  return `${WHATSAPP_BASE_URL}?text=${message}`;
}

function ServiceIcon({
  name,
  size = 24,
}: {
  name: IconName;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "software":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 18v3" />
          <path d="m8 9 2.5 2L8 13" />
          <path d="M13.5 13H16" />
        </svg>
      );

    case "security":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5c0 5.2-3.3 8.7-8 10-4.7-1.3-8-4.8-8-10V6l8-3Z" />
          <rect x="9" y="10" width="6" height="5" rx="1" />
          <path d="M10.5 10V8.5a1.5 1.5 0 0 1 3 0V10" />
        </svg>
      );

    case "network":
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <rect x="3" y="17" width="6" height="4" rx="1" />
          <rect x="15" y="17" width="6" height="4" rx="1" />
          <path d="M12 7v4" />
          <path d="M6 17v-3h12v3" />
          <path d="M12 11 6 14" />
          <path d="m12 11 6 3" />
        </svg>
      );

    case "analytics":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 3-4 3 2 5-6" />
          <circle cx="7" cy="15" r="1" />
          <circle cx="10" cy="11" r="1" />
          <circle cx="13" cy="13" r="1" />
          <circle cx="18" cy="7" r="1" />
        </svg>
      );

    case "marketing":
      return (
        <svg {...common}>
          <path d="M4 11v2" />
          <path d="M7 9v6" />
          <path d="M10 7v10" />
          <path d="M13 5v14" />
          <path d="M16 8v8" />
          <path d="M19 10v4" />
          <path d="M21 9v6" />
        </svg>
      );

    case "technology":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
          <path d="m4.93 4.93 2.12 2.12" />
          <path d="m16.95 16.95 2.12 2.12" />
          <path d="M2 12h3" />
          <path d="M19 12h3" />
          <path d="m4.93 19.07 2.12-2.12" />
          <path d="m16.95 7.05 2.12-2.12" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      );
  }
}

const services: Service[] = [
  {
    id: "software",
    short: "Software",
    title: "Software Development",
    subtitle: "نحوّل الفكرة إلى منتج رقمي قابل للنمو",
    description:
      "في VEXORA بنساعد الشركات على بناء أنظمة ومواقع ومنصات رقمية مصممة حول احتياجات العمل الفعلية، من مرحلة تحليل الفكرة وحتى الإطلاق والتطوير المستمر.",
    capabilities: [
      "تطوير مواقع ومنصات ويب حديثة وسريعة.",
      "أنظمة إدارة داخلية ولوحات تحكم مخصصة.",
      "تطبيقات وخدمات رقمية مرتبطة بقواعد البيانات والـ APIs.",
      "تصميم معماري قابل للتوسع مع نمو المشروع.",
      "ربط الأنظمة والخدمات الخارجية بطريقة منظمة.",
      "تحسين الأداء وتجربة المستخدم والاستجابة لجميع الشاشات.",
    ],
    problems: [
      "موقع قديم أو بطيء لا يعكس مستوى الشركة.",
      "عمليات العمل اليدوية التي تستهلك وقت الفريق.",
      "أنظمة منفصلة تحتاج إلى الربط مع بعضها.",
      "صعوبة تطوير المنتج بسبب بنية تقنية غير منظمة.",
    ],
    process: [
      "فهم احتياجات المشروع والأهداف التجارية.",
      "تحديد البنية والتقنيات المناسبة.",
      "تصميم تجربة الاستخدام والواجهات.",
      "التطوير والاختبار بشكل تدريجي.",
      "الإطلاق والمتابعة والتحسين المستمر.",
    ],
    route: "/services/software-development",
    accent: {
      text: "text-blue-300",
      border: "border-blue-400/20",
      bg: "bg-blue-500/10",
      glow: "shadow-blue-500/10",
    },
  },
  {
    id: "security",
    short: "Cybersecurity",
    title: "Cybersecurity",
    subtitle: "نساعدك تحمي الأنظمة والبيانات والبنية الرقمية",
    description:
      "الأمن السيبراني بالنسبة لنا جزء أساسي من بناء التكنولوجيا، وليس إضافة في آخر المشروع. نساعدك على تقليل المخاطر وتحسين حماية الحسابات والأنظمة والبيانات.",
    capabilities: [
      "مراجعة نقاط الضعف والمخاطر في الأنظمة.",
      "تحسين آليات تسجيل الدخول والصلاحيات والوصول.",
      "تصميم سياسات وصول مناسبة لكل نوع مستخدم.",
      "حماية APIs والبيانات الحساسة.",
      "مراجعة إعدادات قواعد البيانات وRow Level Security.",
      "المساعدة في وضع أساس أمني للمشاريع الجديدة.",
    ],
    problems: [
      "صلاحيات مستخدمين أوسع من المطلوب.",
      "تخزين أو التعامل غير الآمن مع البيانات الحساسة.",
      "واجهات API غير محمية بالشكل الكافي.",
      "غياب تصور واضح لمن يستطيع الوصول لكل جزء من النظام.",
    ],
    process: [
      "فهم النظام والأصول الرقمية المهمة.",
      "تحديد نقاط الدخول والصلاحيات والمخاطر.",
      "مراجعة البنية والتدفقات الحساسة.",
      "اقتراح وتنفيذ التحسينات الأمنية.",
      "اختبار ومراجعة النتائج بشكل مستمر.",
    ],
    route: "/services/cybersecurity",
    accent: {
      text: "text-cyan-300",
      border: "border-cyan-400/20",
      bg: "bg-cyan-500/10",
      glow: "shadow-cyan-500/10",
    },
  },
  {
    id: "network",
    short: "Networks",
    title: "Networks & Infrastructure",
    subtitle: "بنية تقنية مستقرة وقابلة للاعتماد",
    description:
      "نساعد الشركات في تنظيم البنية التحتية والاتصالات والأنظمة التي تعتمد عليها العمليات اليومية، مع التركيز على الاستقرار والأمان وقابلية التوسع.",
    capabilities: [
      "تصميم وتنظيم الشبكات والبنية التحتية.",
      "مراجعة توزيع الأنظمة والخدمات.",
      "تحسين الاتصال والاعتمادية.",
      "تنظيم الوصول بين مكونات البنية التقنية.",
      "المساعدة في بيئات السيرفرات والخدمات السحابية.",
      "مراقبة الأداء وتحديد نقاط الاختناق.",
    ],
    problems: [
      "انقطاع متكرر أو ضعف في الاتصال.",
      "بنية تقنية غير منظمة.",
      "صعوبة معرفة سبب مشاكل الشبكة.",
      "عدم وجود تصور واضح للتوسع المستقبلي.",
    ],
    process: [
      "تحليل البيئة الحالية.",
      "تحديد المتطلبات ونقاط الضعف.",
      "تصميم البنية المقترحة.",
      "التنفيذ والتنظيم.",
      "المراقبة والتحسين.",
    ],
    route: "/services/networks-infrastructure",
    accent: {
      text: "text-sky-300",
      border: "border-sky-400/20",
      bg: "bg-sky-500/10",
      glow: "shadow-sky-500/10",
    },
  },
  {
    id: "analytics",
    short: "Analytics",
    title: "Data Analytics",
    subtitle: "نحوّل البيانات إلى قرارات أوضح",
    description:
      "البيانات الموجودة داخل الشركة يمكن أن تكون مصدرًا قويًا لاتخاذ القرار. نساعدك في تنظيم البيانات وتحليلها وعرض المؤشرات المهمة بطريقة تساعد الإدارة والفريق.",
    capabilities: [
      "تجميع وتنظيم البيانات من مصادر مختلفة.",
      "لوحات معلومات ومؤشرات أداء مخصصة.",
      "تحليل الاتجاهات والنتائج.",
      "تقارير تساعد الإدارة على اتخاذ القرار.",
      "ربط البيانات بالعمليات اليومية.",
      "تحسين جودة البيانات قبل الاعتماد عليها.",
    ],
    problems: [
      "بيانات كثيرة بدون صورة واضحة.",
      "تقارير يدوية تستغرق وقتًا طويلًا.",
      "صعوبة متابعة مؤشرات الأداء.",
      "قرارات تعتمد على التخمين بدل الأرقام.",
    ],
    process: [
      "تحديد الأسئلة التي تحتاج الشركة للإجابة عنها.",
      "تحديد مصادر البيانات.",
      "تنظيف وتنظيم البيانات.",
      "بناء المؤشرات والتقارير.",
      "تحويل النتائج إلى قرارات قابلة للتنفيذ.",
    ],
    route: "/services/data-analytics",
    accent: {
      text: "text-violet-300",
      border: "border-violet-400/20",
      bg: "bg-violet-500/10",
      glow: "shadow-violet-500/10",
    },
  },
  {
    id: "marketing",
    short: "Marketing",
    title: "Digital Marketing",
    subtitle: "نربط الحضور الرقمي بأهداف العمل",
    description:
      "التسويق الرقمي الناجح مش مجرد نشر محتوى. نساعدك في بناء حضور رقمي منظم وربطه بأهداف واضحة مثل الوصول والعملاء والتحويلات والنمو.",
    capabilities: [
      "استراتيجية حضور رقمي مناسبة لطبيعة الشركة.",
      "تحسين المحتوى والرسائل الرقمية.",
      "تحليل أداء القنوات الرقمية.",
      "تحسين صفحات الخدمات والمنتجات.",
      "تنظيم الحملات الرقمية ومؤشرات قياسها.",
      "ربط التسويق بالبيانات والنتائج.",
    ],
    problems: [
      "وجود رقمي بدون استراتيجية واضحة.",
      "محتوى لا يعكس قيمة الشركة.",
      "صعوبة قياس نتيجة الحملات.",
      "زيارات كثيرة بدون نتائج تجارية واضحة.",
    ],
    process: [
      "فهم السوق والجمهور المستهدف.",
      "تحديد الأهداف والمؤشرات.",
      "بناء الرسائل والمحتوى.",
      "تنفيذ وتحليل الحملات.",
      "التحسين اعتمادًا على النتائج.",
    ],
    route: "/services/digital-marketing",
    accent: {
      text: "text-fuchsia-300",
      border: "border-fuchsia-400/20",
      bg: "bg-fuchsia-500/10",
      glow: "shadow-fuchsia-500/10",
    },
  },
  {
    id: "technology",
    short: "Integration",
    title: "Integrated Technology",
    subtitle: "حل تقني متكامل بدل حلول منفصلة",
    description:
      "أحيانًا المشكلة ليست في خدمة واحدة، ولكن في عدم اتصال أجزاء المنظومة ببعضها. هنا بنساعدك في تصميم حل يجمع البرمجيات والبيانات والأمان والبنية التحتية في منظومة واحدة.",
    capabilities: [
      "ربط أنظمة الشركة مع بعضها.",
      "تصميم حلول تجمع أكثر من تخصص تقني.",
      "تنظيم تدفق البيانات بين الأنظمة.",
      "تحسين العمليات الرقمية الداخلية.",
      "تصميم حلول قابلة للتوسع.",
      "توحيد تجربة المستخدم عبر الأنظمة المختلفة.",
    ],
    problems: [
      "أنظمة كثيرة لا تتحدث مع بعضها.",
      "تكرار إدخال البيانات.",
      "عمليات داخلية معقدة.",
      "صعوبة التوسع بسبب حلول منفصلة.",
    ],
    process: [
      "تحليل الصورة الكاملة للمنظومة.",
      "تحديد الأنظمة ومصادر البيانات.",
      "تحديد نقاط الربط والتكامل.",
      "بناء الحل واختباره.",
      "المراقبة والتطوير مع نمو الشركة.",
    ],
    route: "/services/software-development",
    accent: {
      text: "text-emerald-300",
      border: "border-emerald-400/20",
      bg: "bg-emerald-500/10",
      glow: "shadow-emerald-500/10",
    },
  },
];

export default function PrivacyPage() {
  const [activeId, setActiveId] = useState<IconName>("software");

  const activeService = useMemo(
    () => services.find((service) => service.id === activeId) ?? services[0],
    [activeId]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080d] text-[#f5f7fa]">
      {/* =========================
          Animated technical background
      ========================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(22,135,255,0.18),transparent_38%),radial-gradient(circle_at_100%_80%,rgba(69,165,255,0.09),transparent_30%),#05080d]" />

        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(69,165,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(69,165,255,0.055)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        <div className="absolute left-[8%] top-[15%] h-72 w-72 animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute right-[5%] top-[40%] h-80 w-80 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-cyan-400/5 blur-3xl" />

        <div className="absolute bottom-[-120px] left-[35%] h-96 w-96 animate-[pulse_7s_ease-in-out_infinite] rounded-full bg-blue-600/5 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-32 animate-[scan_8s_linear_infinite] bg-gradient-to-b from-transparent via-blue-400/[0.035] to-transparent" />
      </div>

      {/* =========================
          Header
      ========================== */}

      <header className="relative z-30 border-b border-white/[0.07] bg-[#05080d]/80 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            aria-label="VEXORA Home"
            className="group flex items-center gap-3"
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-1.5 shadow-[0_0_30px_rgba(22,135,255,0.08)] transition duration-300 group-hover:border-blue-400/30 group-hover:shadow-[0_0_35px_rgba(22,135,255,0.18)]">
              <Image
                src="/vexora-logo.png"
                alt="VEXORA"
                fill
                priority
                sizes="48px"
                className="object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <div className="text-sm font-semibold tracking-[0.28em] text-white">
                VEXORA
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Technology Solutions
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300/80 sm:inline-flex">
              System Online
            </span>

            <Link
              href="/contact"
              className="rounded-lg border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:border-blue-300/40 hover:bg-blue-500/15"
            >
              Contact
            </Link>
          </div>
        </div>
      </header>

      {/* =========================
          Main
      ========================== */}

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        {/* Welcome */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-[0_0_60px_rgba(22,135,255,0.12)]">
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={96}
              height={96}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.25em] text-blue-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            VEXORA Technology Core
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Technology that moves
            <span className="block bg-gradient-to-r from-blue-300 via-white to-cyan-300 bg-clip-text text-transparent">
              your business forward.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            استكشف المجالات التقنية التي تستطيع VEXORA مساعدتك فيها، واختر
            المجال من القائمة الجانبية لمعرفة الخدمات والحلول التي يمكننا
            تقديمها.
          </p>
        </div>

        {/* =========================
            Services workspace
        ========================== */}

        <div className="relative mt-14 grid gap-5 lg:grid-cols-[88px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <nav
              aria-label="VEXORA technology services"
              className="flex gap-2 overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#080d15]/80 p-2 backdrop-blur-xl lg:flex-col lg:overflow-visible"
            >
              {services.map((service) => {
                const active = activeId === service.id;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActiveId(service.id)}
                    aria-label={`عرض ${service.title}`}
                    aria-pressed={active}
                    title={service.title}
                    className={`group relative flex h-16 min-w-16 shrink-0 items-center justify-center rounded-xl border transition duration-300 lg:h-[70px] lg:min-w-0 ${
                      active
                        ? `${service.accent.border} ${service.accent.bg} ${service.accent.text} shadow-[0_0_28px_rgba(22,135,255,0.08)]`
                        : "border-transparent text-slate-500 hover:border-white/10 hover:bg-white/[0.035] hover:text-slate-200"
                    }`}
                  >
                    {active && (
                      <span className="absolute -left-[3px] top-1/2 hidden h-8 w-1 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(69,165,255,0.8)] lg:block" />
                    )}

                    <ServiceIcon name={service.id} size={25} />

                    <span className="sr-only">{service.title}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Active content */}
          <div
            key={activeService.id}
            className="min-w-0 animate-[fadeIn_.35s_ease-out]"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080d15]/90 shadow-[0_25px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              {/* Card top glow */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${activeService.accent.bg}`}
              />

              <div className="relative p-6 sm:p-8 lg:p-10">
                {/* Active service heading */}
                <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="mb-5 flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border ${activeService.accent.border} ${activeService.accent.bg} ${activeService.accent.text}`}
                      >
                        <ServiceIcon name={activeService.id} size={25} />
                      </div>

                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
                          VEXORA / SERVICE
                        </div>
                        <div
                          className={`mt-1 text-xs font-semibold ${activeService.accent.text}`}
                        >
                          {activeService.short}
                        </div>
                      </div>
                    </div>

                    <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                      {activeService.title}
                    </h2>

                    <p className="mt-3 text-base font-medium text-slate-300">
                      {activeService.subtitle}
                    </p>

                    <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                      {activeService.description}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="shrink-0 rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>

                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Available
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      Technology support
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-gradient-to-r from-white/10 via-white/[0.05] to-transparent" />

                {/* Details grid */}
                <div className="grid gap-5 md:grid-cols-2">
                  {/* What we provide */}
                  <section className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(69,165,255,0.8)]" />

                      <h3 className="text-sm font-semibold text-white">
                        What VEXORA can provide
                      </h3>
                    </div>

                    <ul className="space-y-3">
                      {activeService.capabilities.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-slate-400"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-400/80" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Problems */}
                  <section className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />

                      <h3 className="text-sm font-semibold text-white">
                        Problems we can help solve
                      </h3>
                    </div>

                    <ul className="space-y-3">
                      {activeService.problems.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-slate-400"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Process */}
                <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                        Workflow
                      </div>

                      <h3 className="mt-1 text-sm font-semibold text-white">
                        How we approach the work
                      </h3>
                    </div>

                    <span className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-600 sm:block">
                      VEXORA PROCESS
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {activeService.process.map((step, index) => (
                      <div
                        key={step}
                        className="relative rounded-xl border border-white/[0.06] bg-black/20 p-4"
                      >
                        <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg border border-blue-400/15 bg-blue-500/[0.07] text-[10px] font-semibold text-blue-300">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <p className="text-xs leading-5 text-slate-400">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* CTA */}
                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-blue-400/10 bg-gradient-to-r from-blue-500/[0.07] via-transparent to-cyan-500/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      عندك مشروع أو مشكلة تقنية؟
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      تواصل مع VEXORA وخلينا نفهم احتياجك ونحدد الحل المناسب.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={activeService.route}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      تفاصيل الخدمة
                    </Link>

                    <a
                      href={createWhatsAppUrl(activeService.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-xs font-semibold text-emerald-300 transition hover:border-emerald-300/40 hover:bg-emerald-400/15"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="mt-3 text-center text-[10px] tracking-[0.08em] text-slate-600">
                  WhatsApp: {WHATSAPP_NUMBER}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            Bottom CTA
        ========================== */}

        <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#080d15]/75 p-7 backdrop-blur-xl sm:p-9">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,135,255,0.12),transparent_45%)]"
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.06] text-blue-300">
              <ServiceIcon name="technology" size={20} />
            </div>

            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">
              مش لاقي المجال المناسب؟
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
              بعض المشاريع تحتاج أكثر من تخصص في نفس الوقت. ابعت لنا فكرتك أو
              المشكلة التي تواجهك، ونحدد معك أفضل طريقة للتنفيذ.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={createWhatsAppUrl("استشارة تقنية")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-blue-500 px-6 py-3 text-xs font-semibold text-white shadow-[0_0_30px_rgba(22,135,255,0.18)] transition hover:bg-blue-400"
              >
                تحدث معنا على WhatsApp
              </a>

              <Link
                href="/contact"
                className="rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                صفحة التواصل
              </Link>
            </div>
          </div>
        </section>
      </section>

      {/* =========================
          Footer
      ========================== */}

      <footer className="relative z-10 border-t border-white/[0.06] bg-[#04070b]/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-1">
              <Image
                src="/vexora-logo.png"
                alt="VEXORA"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>

            <div>
              <div className="text-xs font-semibold tracking-[0.22em] text-slate-300">
                VEXORA
              </div>

              <div className="mt-1 text-[10px] text-slate-600">
                Technology Solutions
              </div>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
            Technology • Security • Data • Infrastructure
          </div>
        </div>
      </footer>
    </main>
  );
}