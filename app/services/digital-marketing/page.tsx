"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const services = [
  {
    number: "01",
    icon: "↗",
    title: "Media Buying",
    subtitle: "Paid Advertising & Performance",
    description:
      "Plan, launch, test, and optimize paid campaigns across digital advertising platforms with a focus on measurable business goals.",
    tags: ["Campaign Strategy", "A/B Testing", "ROAS"],
  },
  {
    number: "02",
    icon: "✳",
    title: "Graphic Design",
    subtitle: "Visual Identity & Creative",
    description:
      "Create standout visual identities, advertising creatives, social media designs, and campaign assets that fit your brand.",
    tags: ["Branding", "Ad Creatives", "Social Design"],
  },
  {
    number: "03",
    icon: "▶",
    title: "Video Editing",
    subtitle: "Reels, Ads & Motion Graphics",
    description:
      "Transform raw footage into polished videos with dynamic editing, color grading, transitions, subtitles, and motion graphics.",
    tags: ["Reels", "Video Ads", "Motion Design"],
  },
  {
    number: "04",
    icon: "◎",
    title: "Photography",
    subtitle: "Commercial & Product Shoots",
    description:
      "Create product photography, promotional visuals, and commercial content designed for digital campaigns and brand storytelling.",
    tags: ["Product Shoots", "Studio", "Campaigns"],
  },
  {
    number: "05",
    icon: "◉",
    title: "Social Media Management",
    subtitle: "Strategy, Publishing & Community",
    description:
      "Build a consistent social presence through content planning, publishing calendars, audience engagement, and performance reviews.",
    tags: ["Content Calendar", "Community", "Insights"],
  },
  {
    number: "06",
    icon: "✎",
    title: "Content Creation",
    subtitle: "Copywriting & Creative Strategy",
    description:
      "Develop campaign concepts, compelling copy, content ideas, and creative messaging tailored to your audience.",
    tags: ["Copywriting", "Scripts", "Storytelling"],
  },
  {
    number: "07",
    icon: "⌕",
    title: "SEO & Organic Growth",
    subtitle: "Search Visibility",
    description:
      "Improve website discoverability through keyword research, on-page optimization, content structure, and technical recommendations.",
    tags: ["Keyword Research", "On-page SEO", "Content"],
  },
  {
    number: "08",
    icon: "✉",
    title: "Email Marketing",
    subtitle: "Retention & Customer Journeys",
    description:
      "Plan email campaigns and customer journeys that help businesses communicate with their audience and nurture leads.",
    tags: ["Newsletters", "Automation Strategy", "Retention"],
  },
  {
    number: "09",
    icon: "⌘",
    title: "Marketing Analytics",
    subtitle: "Tracking, Reporting & Insights",
    description:
      "Organize campaign reporting, evaluate performance indicators, and identify opportunities for better marketing decisions.",
    tags: ["KPIs", "Attribution", "Reporting"],
  },
];

const creativeWork = [
  {
    category: "Design",
    title: "Brand Identity",
    subtitle: "Visual direction & brand systems",
    image:
      "https://images.unsplash.com/photo-1634942536790-2534dbd3d5b3?auto=format&fit=crop&w=900&q=85",
    className: "md:col-span-2",
  },
  {
    category: "Video",
    title: "Video Production",
    subtitle: "Cinematic storytelling",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85",
    className: "",
  },
  {
    category: "Photography",
    title: "Creative Photography",
    subtitle: "Visuals made to stand out",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=85",
    className: "",
  },
  {
    category: "Design",
    title: "Digital Campaigns",
    subtitle: "Creative concepts & advertising",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85",
    className: "md:col-span-2",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understand your business, target audience, objectives, and competitive landscape.",
  },
  {
    number: "02",
    title: "Create",
    description:
      "Build the strategy, advertising concepts, content, and creative assets.",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "Deploy campaigns, verify tracking, and establish a performance baseline.",
  },
  {
    number: "04",
    title: "Optimize",
    description:
      "Review results, test variations, and refine the next round of activity.",
  },
];

function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start = 0;
    const duration = 1700;

    const animate = (time: number) => {
      if (!start) start = time;

      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCount(value * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <>
      {count.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}

export default function DigitalMarketingPage() {
  const [activeMetric, setActiveMetric] = useState("ROAS");
  const [activeFilter, setActiveFilter] = useState("All");
  const [budget, setBudget] = useState(1000);
  const [monthlyClicks, setMonthlyClicks] = useState(2500);

  const metricValues: Record<
    string,
    { value: number; suffix: string; label: string; note: string }
  > = {
    ROAS: {
      value: 3.8,
      suffix: "x",
      label: "Return on Ad Spend",
      note: "Illustrative return multiple",
    },
    CTR: {
      value: 2.9,
      suffix: "%",
      label: "Click-Through Rate",
      note: "Illustrative click rate",
    },
    CPC: {
      value: 0.42,
      suffix: "$",
      label: "Cost Per Click",
      note: "Illustrative cost per click",
    },
    Leads: {
      value: 186,
      suffix: "",
      label: "Conversions",
      note: "Illustrative conversion count",
    },
  };

  const selectedMetric = metricValues[activeMetric];

  const filteredWork =
    activeFilter === "All"
      ? creativeWork
      : creativeWork.filter((work) => work.category === activeFilter);

  const estimatedClicks = Math.round(monthlyClicks);
  const estimatedCost = budget;
  const estimatedCpc =
    estimatedClicks > 0 ? estimatedCost / estimatedClicks : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070c] text-white selection:bg-sky-300/30 selection:text-white">
      {/* =========================================================
          VEXORA TECH BACKGROUND
          ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(37,99,235,0.18),transparent_42%),radial-gradient(circle_at_0%_40%,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_100%_70%,rgba(59,130,246,0.07),transparent_30%)]" />

        <div className="marketing-grid absolute inset-0 opacity-60" />

        <div className="marketing-grid-fine absolute inset-0 opacity-35" />

        <div className="marketing-scan absolute inset-0" />

        <div className="marketing-vignette absolute inset-0" />

        <div className="marketing-orb marketing-orb-one absolute -left-40 top-48 h-[32rem] w-[32rem]" />
        <div className="marketing-orb marketing-orb-two absolute -right-48 top-[55rem] h-[30rem] w-[30rem]" />
        <div className="marketing-orb marketing-orb-three absolute left-[30%] top-[115rem] h-[28rem] w-[28rem]" />

        <div className="marketing-beam marketing-beam-one" />
        <div className="marketing-beam marketing-beam-two" />
        <div className="marketing-beam marketing-beam-three" />

        <div className="absolute left-[7%] top-[19%] hidden h-1 w-1 animate-pulse rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.9)] lg:block" />
        <div className="absolute right-[11%] top-[32%] hidden h-1 w-1 animate-pulse rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.9)] lg:block" />
        <div className="absolute left-[15%] top-[71%] hidden h-1 w-1 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)] lg:block" />
      </div>

      {/* =========================================================
          HEADER
          ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#05070c]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
          <Link
            href="/"
            className="group relative shrink-0"
            aria-label="VEXORA home"
          >
            <div className="absolute inset-0 rounded-full bg-sky-400/10 blur-xl transition duration-500 group-hover:bg-sky-400/20" />

            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={145}
              height={52}
              priority
              className="relative h-auto w-[115px] transition duration-300 group-hover:brightness-110 sm:w-[135px]"
            />
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-gray-400 lg:flex">
            <Link
              href="/"
              className="relative transition duration-300 hover:text-white"
            >
              Home
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-sky-300 transition-all duration-300 hover:w-full" />
            </Link>

            <Link
              href="/services"
              className="transition duration-300 hover:text-sky-300"
            >
              Services
            </Link>

            <a
              href="#creative"
              className="transition duration-300 hover:text-sky-300"
            >
              Creative Studio
            </a>

            <a
              href="#performance"
              className="transition duration-300 hover:text-sky-300"
            >
              Performance
            </a>
          </nav>

          <Link
            href="/contact"
            className="marketing-header-cta group relative shrink-0 overflow-hidden rounded-full border border-sky-300/30 bg-sky-400/[0.08] px-4 py-2.5 text-xs font-semibold text-sky-100 transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/60 hover:bg-sky-300/[0.14] sm:px-5 sm:text-sm"
          >
            <span className="relative z-10">Start a Project ↗</span>
            <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/15 transition-all duration-700 group-hover:left-[130%]" />
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO
          ========================================================= */}

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-20 md:grid-cols-[1.03fr_.97fr] md:pb-32 md:pt-28">
        <div className="marketing-reveal">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/[0.05] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-200 shadow-[0_0_30px_rgba(56,189,248,0.05)] sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-sky-300 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.9)]" />
            </span>
            Digital Marketing & Creative Studio
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-[4.35rem]">
            Creativity that
            <span className="marketing-gradient-text mt-3 block pb-2">
              moves numbers.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-gray-400 sm:text-lg">
            Performance marketing, powerful creative, and data-driven
            strategy. We help businesses build a stronger digital presence
            and make every campaign more purposeful.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="marketing-primary-button group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold text-white"
            >
              <span className="relative z-10">Build Your Campaign</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <a
              href="#creative"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.015] px-6 py-3.5 text-sm text-gray-300 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-sky-300/40 hover:bg-white/[0.04] hover:text-white"
            >
              Explore Our Capabilities ↓
            </a>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-5">
            <div className="marketing-mini-stat">
              <p className="text-lg font-semibold sm:text-xl">Strategy</p>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                Built around goals
              </p>
            </div>

            <div className="marketing-mini-stat">
              <p className="text-lg font-semibold sm:text-xl">Creative</p>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                Made to stand out
              </p>
            </div>

            <div className="marketing-mini-stat">
              <p className="text-lg font-semibold sm:text-xl">Analytics</p>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                Measured & refined
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            HERO CREATIVE SYSTEM
            ========================================================= */}

        <div className="relative mx-auto w-full max-w-xl marketing-hero-visual">
          <div className="marketing-hero-glow absolute inset-8 rounded-full" />

          <div className="marketing-hero-grid absolute inset-0 rounded-[2rem]" />

          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            <div className="marketing-media-card group relative mt-8 h-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0b111b] sm:h-72">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85)",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#04070c] via-[#04070c]/20 to-transparent" />

              <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                <span className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
                  VISUAL SYSTEM
                </span>

                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/25 text-xs text-sky-200 backdrop-blur">
                  01
                </span>
              </div>

              <div className="absolute bottom-4 left-4">
                <span className="rounded-full border border-sky-300/20 bg-black/30 px-3 py-1 text-[10px] text-sky-200 backdrop-blur">
                  CREATIVE DESIGN
                </span>

                <p className="mt-2 text-sm font-semibold">Visual Identity</p>
              </div>
            </div>

            <div className="marketing-media-card group relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b111b] sm:h-80">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85)",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#04070c] via-[#04070c]/15 to-transparent" />

              <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                <span className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
                  MOTION LAB
                </span>

                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/25 text-xs text-sky-200 backdrop-blur">
                  02
                </span>
              </div>

              <div className="absolute bottom-4 left-4">
                <span className="rounded-full border border-sky-300/20 bg-black/30 px-3 py-1 text-[10px] text-sky-200 backdrop-blur">
                  VIDEO PRODUCTION
                </span>

                <p className="mt-2 text-sm font-semibold">
                  Motion & Storytelling
                </p>
              </div>
            </div>

            <div className="marketing-approach-card col-span-2 rounded-2xl border border-sky-300/20 bg-gradient-to-r from-[#0d1a2d] via-[#0b121f] to-[#0a0d16] p-4 shadow-[0_20px_70px_rgba(15,23,42,0.45)] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    Our Approach
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    Creative meets performance.
                  </p>
                </div>

                <div className="flex -space-x-2">
                  {["M", "D", "V", "A"].map((letter, index) => (
                    <div
                      key={letter}
                      className="marketing-avatar flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#101827] bg-gradient-to-br from-blue-500 to-sky-300 text-xs font-bold text-[#07101d]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="marketing-progress h-full w-full origin-left rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-slate-200" />
              </div>

              <p className="mt-2 text-[10px] text-gray-500">
                Strategy · Design · Production · Measurement
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-8 -left-8 hidden rounded-xl border border-sky-300/15 bg-[#07101a]/70 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block">
            <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">
              Creative Engine
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
              <span className="text-[10px] font-medium text-emerald-200">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MEDIA BUYING DASHBOARD
          ========================================================= */}

      <section
        id="performance"
        className="relative z-10 border-y border-white/[0.07] bg-[#080d15]/80 px-6 py-24 backdrop-blur-sm md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                Media Buying & Performance
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Every click has
                <span className="text-gray-500"> a story.</span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-gray-400">
              Explore a sample campaign dashboard with interactive performance
              indicators. Actual results depend on the campaign, market,
              audience, offer, and budget.
            </p>
          </div>

          <div className="marketing-dashboard relative overflow-hidden rounded-3xl border border-white/10 bg-[#090f19]/95 p-4 shadow-[0_35px_100px_rgba(0,0,0,0.45)] sm:p-7 lg:p-8">
            <div className="marketing-dashboard-grid pointer-events-none absolute inset-0 opacity-60" />

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                  <p className="text-sm font-semibold">
                    Campaign Performance Lab
                  </p>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Illustrative dashboard · Not connected to an ad account
                </p>
              </div>

              <span className="rounded-full border border-sky-300/20 bg-sky-300/[0.06] px-3 py-1.5 text-[10px] text-sky-200">
                INTERACTIVE DEMO
              </span>
            </div>

            <div className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "ROAS",
                  value: 3.8,
                  suffix: "x",
                  icon: "↗",
                  color: "text-sky-300",
                },
                {
                  name: "CTR",
                  value: 2.9,
                  suffix: "%",
                  icon: "◎",
                  color: "text-cyan-300",
                },
                {
                  name: "CPC",
                  value: 0.42,
                  suffix: "$",
                  icon: "⌁",
                  color: "text-indigo-300",
                },
                {
                  name: "Conversions",
                  value: 186,
                  suffix: "",
                  icon: "✦",
                  color: "text-emerald-300",
                },
              ].map((metric) => (
                <button
                  key={metric.name}
                  type="button"
                  onClick={() => setActiveMetric(metric.name)}
                  className={`marketing-metric-card rounded-2xl border p-4 text-left sm:p-5 ${
                    activeMetric === metric.name
                      ? "marketing-metric-active border-sky-300/40 bg-sky-300/[0.07] shadow-[0_15px_45px_rgba(14,116,144,0.12)]"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {metric.name}
                    </span>

                    <span className={`text-lg ${metric.color}`}>
                      {metric.icon}
                    </span>
                  </div>

                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    <AnimatedNumber
                      value={metric.value}
                      suffix={metric.suffix}
                      decimals={
                        metric.name === "CPC"
                          ? 2
                          : metric.name === "ROAS" || metric.name === "CTR"
                            ? 1
                            : 0
                      }
                    />
                  </p>

                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full origin-left rounded-full bg-gradient-to-r from-blue-600 to-sky-300"
                      style={{
                        width:
                          metric.name === "ROAS"
                            ? "76%"
                            : metric.name === "CTR"
                              ? "59%"
                              : metric.name === "CPC"
                                ? "37%"
                                : "86%",
                        animation: "marketingGrowWidth 1.2s ease-out both",
                      }}
                    />
                  </div>

                  <p className="mt-3 text-[10px] text-gray-500">
                    Click to explore
                  </p>
                </button>
              ))}
            </div>

            <div className="relative mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="marketing-inner-panel rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedMetric.label}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {selectedMetric.note}
                    </p>
                  </div>

                  <span className="rounded-lg border border-white/[0.08] bg-black/10 px-3 py-1.5 text-[10px] text-gray-400">
                    Sample data
                  </span>
                </div>

                <div className="mt-8 flex h-44 items-end gap-2 sm:gap-3">
                  {[32, 48, 39, 61, 51, 73, 58, 86, 68, 96, 77, 100].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="group flex h-full flex-1 items-end"
                      >
                        <div
                          className="marketing-chart-bar w-full origin-bottom rounded-t-md bg-gradient-to-t from-blue-700/70 via-blue-500 to-sky-300"
                          style={{
                            height: `${height}%`,
                            animation: `marketingBarRise .8s ease-out ${index * 55}ms both`,
                          }}
                        />
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-3 flex justify-between text-[9px] text-gray-600">
                  <span>Week 01</span>
                  <span>Week 02</span>
                  <span>Week 03</span>
                  <span>Week 04</span>
                </div>

                <p className="mt-5 rounded-xl border border-white/[0.06] bg-black/20 p-3 text-xs leading-6 text-gray-400">
                  <span className="font-semibold text-sky-200">
                    Selected metric:
                  </span>{" "}
                  {activeMetric}. Use these example indicators to explore how
                  a campaign dashboard can present performance.
                </p>
              </div>

              <div className="marketing-inner-panel rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
                <p className="text-sm font-semibold">
                  Budget & Traffic Sandbox
                </p>

                <p className="mt-1 text-xs leading-6 text-gray-500">
                  Adjust the values to explore a simple budget scenario.
                </p>

                <div className="mt-7">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="budget"
                      className="text-xs text-gray-400"
                    >
                      Monthly budget
                    </label>

                    <span className="text-sm font-semibold text-sky-200">
                      ${budget.toLocaleString("en-US")}
                    </span>
                  </div>

                  <input
                    id="budget"
                    type="range"
                    min={500}
                    max={10000}
                    step={250}
                    value={budget}
                    onChange={(event) => setBudget(Number(event.target.value))}
                    className="marketing-range mt-4 w-full cursor-pointer"
                  />

                  <div className="mt-2 flex justify-between text-[10px] text-gray-600">
                    <span>$500</span>
                    <span>$10,000</span>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="clicks"
                      className="text-xs text-gray-400"
                    >
                      Example monthly clicks
                    </label>

                    <span className="text-sm font-semibold text-sky-200">
                      {monthlyClicks.toLocaleString("en-US")}
                    </span>
                  </div>

                  <input
                    id="clicks"
                    type="range"
                    min={500}
                    max={20000}
                    step={500}
                    value={monthlyClicks}
                    onChange={(event) =>
                      setMonthlyClicks(Number(event.target.value))
                    }
                    className="marketing-range mt-4 w-full cursor-pointer"
                  />

                  <div className="mt-2 flex justify-between text-[10px] text-gray-600">
                    <span>500</span>
                    <span>20,000</span>
                  </div>
                </div>

                <div className="marketing-result-card mt-7 rounded-xl border border-sky-300/15 bg-sky-300/[0.04] p-4">
                  <p className="text-xs text-gray-400">
                    Illustrative cost per click
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-sky-200">
                    ${estimatedCpc.toFixed(2)}
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-gray-500">
                    Calculated as budget ÷ example clicks. This is a
                    mathematical scenario, not a forecast or guaranteed
                    advertising result.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
          ========================================================= */}

      <section id="services" className="relative z-10 px-6 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              Our Capabilities
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything your brand needs
              <span className="text-gray-500"> to grow digitally.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400">
              From campaign planning and paid advertising to content
              production, creative design, and analytics, our services cover
              the core building blocks of digital growth.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="marketing-service-card group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#090f19]/90 p-6 sm:p-7"
              >
                <div className="marketing-card-line absolute left-0 top-0 h-px w-full" />

                <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-sky-400/0 blur-3xl transition duration-700 group-hover:bg-sky-400/10" />

                <div className="absolute right-5 top-5 h-12 w-12 opacity-20">
                  <span className="absolute right-0 top-0 h-px w-12 bg-sky-300" />
                  <span className="absolute right-0 top-0 h-12 w-px bg-sky-300" />
                  <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.9)]" />
                </div>

                <div className="relative flex items-center justify-between">
                  <span className="marketing-service-icon flex h-12 w-12 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/[0.06] text-2xl text-sky-200">
                    {service.icon}
                  </span>

                  <span className="text-xs tracking-widest text-gray-600">
                    {service.number}
                  </span>
                </div>

                <h3 className="relative mt-7 text-xl font-semibold transition-colors duration-300 group-hover:text-sky-200">
                  {service.title}
                </h3>

                <p className="relative mt-2 text-xs font-medium text-sky-300/80">
                  {service.subtitle}
                </p>

                <p className="relative mt-4 min-h-[105px] text-sm leading-7 text-gray-400">
                  {service.description}
                </p>

                <div className="relative mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.08] bg-white/[0.015] px-2.5 py-1.5 text-[10px] text-gray-400 transition duration-300 group-hover:border-sky-300/20 group-hover:text-sky-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="relative mt-6 h-px overflow-hidden bg-white/[0.07]">
                  <div className="h-full w-0 bg-gradient-to-r from-blue-600 via-sky-400 to-transparent transition-all duration-700 group-hover:w-full" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CREATIVE PORTFOLIO
          ========================================================= */}

      <section
        id="creative"
        className="relative z-10 border-y border-white/[0.07] bg-[#080d15]/75 px-6 py-24 backdrop-blur-sm md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                Creative Studio
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Ideas made
                <span className="text-gray-500"> visual.</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400">
                Explore visual directions across design, video, and
                photography. The gallery below uses illustrative reference
                imagery, not a claim of completed VEXORA client projects.
              </p>
            </div>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-sm font-medium text-sky-200 transition hover:text-white"
            >
              Request Creative Work
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          </div>

          <div className="mb-7 flex flex-wrap gap-2">
            {["All", "Design", "Video", "Photography"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`marketing-filter rounded-full border px-4 py-2 text-xs ${
                  activeFilter === filter
                    ? "marketing-filter-active border-sky-300/40 bg-sky-300/10 text-sky-200"
                    : "border-white/10 text-gray-400"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {filteredWork.map((work) => (
              <article
                key={work.title}
                className={`marketing-gallery-card group relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#101827] sm:min-h-[360px] ${work.className}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url("${work.image}")` }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/15 to-transparent transition duration-500 group-hover:from-[#050811]/95" />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 opacity-0 transition duration-500 group-hover:opacity-100">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-sky-200 backdrop-blur">
                    VEXORA CREATIVE
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/25 text-sm text-white backdrop-blur">
                    ↗
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-sky-200 backdrop-blur">
                    {work.category}
                  </span>

                  <h3 className="mt-4 text-xl font-semibold sm:text-2xl">
                    {work.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-300">
                    {work.subtitle}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-medium text-white/80 transition group-hover:text-sky-200">
                    Explore creative direction
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCTION WORKFLOW
          ========================================================= */}

      <section className="relative z-10 px-6 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              Our Process
            </p>

            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              From first idea
              <span className="text-gray-500"> to measurable action.</span>
            </h2>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-transparent via-sky-300/30 to-transparent lg:block"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="marketing-process-card group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-300/20 bg-sky-300/[0.05] text-xs font-semibold text-sky-200 transition duration-300 group-hover:border-sky-300/50 group-hover:bg-sky-300/10">
                      {step.number}
                    </span>

                    <span className="h-px w-10 bg-gradient-to-r from-sky-300/40 to-transparent lg:hidden" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold transition-colors duration-300 group-hover:text-sky-200">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
          ========================================================= */}

      <section className="relative z-10 px-6 pb-24 md:pb-28">
        <div className="marketing-cta relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-sky-300/20 bg-gradient-to-br from-[#101e35] via-[#0c1423] to-[#080b12] px-7 py-12 sm:px-12 sm:py-16">
          <div className="marketing-cta-grid pointer-events-none absolute inset-0 opacity-50" />

          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/15 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-28 left-10 h-60 w-60 rounded-full bg-sky-300/[0.08] blur-[90px]" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
                Let&apos;s Create Something Great
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                Your next campaign deserves a better strategy.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400">
                Tell us about your business, creative ideas, or advertising
                goals. Let&apos;s build a digital marketing plan around what
                matters to you.
              </p>
            </div>

            <Link
              href="/contact"
              className="marketing-cta-button group inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-sky-300 px-7 py-4 text-sm font-semibold text-[#07101d]"
            >
              <span>Discuss Your Campaign</span>

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
          ========================================================= */}

      <footer className="relative z-10 border-t border-white/[0.08] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <Link href="/" aria-label="VEXORA home">
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={115}
              height={42}
              className="h-auto w-[105px] opacity-80 transition hover:opacity-100"
            />
          </Link>

          <p className="text-xs text-gray-500">
            © 2026 VEXORA Technology. All rights reserved.
          </p>

          <Link
            href="/services"
            className="text-xs text-gray-400 transition hover:text-sky-300"
          >
            All Services →
          </Link>
        </div>
      </footer>

      {/* =========================================================
          LOCAL VISUAL SYSTEM
          Plain <style> intentionally used instead of styled-jsx.
          ========================================================= */}

      <style>{`
        @keyframes marketingGridMove {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(42px, 42px, 0);
          }
        }

        @keyframes marketingGridFineMove {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-28px, 28px, 0);
          }
        }

        @keyframes marketingScanMove {
          0% {
            transform: translateY(-110%);
          }
          100% {
            transform: translateY(110%);
          }
        }

        @keyframes marketingOrbFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(35px, -25px, 0) scale(1.08);
          }
        }

        @keyframes marketingBeamMove {
          0% {
            transform: translateX(-130%) rotate(-18deg);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          70% {
            opacity: 0.45;
          }
          100% {
            transform: translateX(180%) rotate(-18deg);
            opacity: 0;
          }
        }

        @keyframes marketingReveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes marketingMediaFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes marketingAvatarPulse {
          0%,
          100% {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(56, 189, 248, 0);
          }
          50% {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(56, 189, 248, 0.16);
          }
        }

        @keyframes marketingGrowWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes marketingBarRise {
          from {
            opacity: 0;
            transform: scaleY(0.08);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        @keyframes marketingBeamPulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.7;
          }
        }

        .marketing-grid {
          background-image:
            linear-gradient(rgba(56, 189, 248, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.055) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
          animation: marketingGridMove 22s linear infinite;
        }

        .marketing-grid-fine {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
          background-size: 16px 16px;
          mask-image: linear-gradient(to bottom, transparent, black 18%, black 65%, transparent);
          animation: marketingGridFineMove 28s linear infinite;
        }

        .marketing-scan {
          height: 22%;
          top: -22%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(56, 189, 248, 0.035),
            rgba(125, 211, 252, 0.06),
            transparent
          );
          filter: blur(10px);
          animation: marketingScanMove 11s linear infinite;
        }

        .marketing-vignette {
          background:
            radial-gradient(circle at center, transparent 35%, rgba(0, 0, 0, 0.2) 72%, rgba(0, 0, 0, 0.48) 100%);
        }

        .marketing-orb {
          border-radius: 999px;
          filter: blur(100px);
          animation: marketingOrbFloat 10s ease-in-out infinite;
        }

        .marketing-orb-one {
          background: rgba(37, 99, 235, 0.1);
        }

        .marketing-orb-two {
          background: rgba(6, 182, 212, 0.075);
          animation-delay: -3s;
          animation-duration: 13s;
        }

        .marketing-orb-three {
          background: rgba(99, 102, 241, 0.065);
          animation-delay: -6s;
          animation-duration: 15s;
        }

        .marketing-beam {
          position: absolute;
          left: -35%;
          width: 170%;
          height: 1px;
          transform-origin: center;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(56, 189, 248, 0.1),
            rgba(125, 211, 252, 0.75),
            rgba(56, 189, 248, 0.1),
            transparent
          );
          filter: blur(0.5px);
          animation: marketingBeamMove 13s linear infinite;
        }

        .marketing-beam-one {
          top: 27%;
          animation-delay: -1s;
        }

        .marketing-beam-two {
          top: 58%;
          animation-delay: -7s;
          animation-duration: 17s;
        }

        .marketing-beam-three {
          top: 82%;
          animation-delay: -10s;
          animation-duration: 15s;
        }

        .marketing-reveal {
          animation: marketingReveal 0.8s ease-out both;
        }

        .marketing-gradient-text {
          background: linear-gradient(
            100deg,
            #7dd3fc 0%,
            #60a5fa 35%,
            #93c5fd 62%,
            #f8fafc 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 180% 100%;
          animation: marketingGradientShift 7s ease-in-out infinite;
        }

        @keyframes marketingGradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .marketing-header-cta {
          box-shadow:
            inset 0 0 20px rgba(56, 189, 248, 0.03),
            0 0 0 rgba(56, 189, 248, 0);
        }

        .marketing-header-cta:hover {
          box-shadow:
            inset 0 0 25px rgba(56, 189, 248, 0.08),
            0 0 28px rgba(56, 189, 248, 0.1);
        }

        .marketing-primary-button {
          position: relative;
          overflow: hidden;
          background: linear-gradient(100deg, #1d4ed8, #0284c7, #38bdf8);
          background-size: 180% 100%;
          box-shadow:
            0 12px 35px rgba(37, 99, 235, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition:
            transform 300ms ease,
            box-shadow 300ms ease,
            background-position 600ms ease;
        }

        .marketing-primary-button::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          border: 1px solid rgba(255, 255, 255, 0.13);
          pointer-events: none;
        }

        .marketing-primary-button:hover {
          transform: translateY(-3px);
          background-position: 100% 50%;
          box-shadow:
            0 18px 45px rgba(37, 99, 235, 0.3),
            0 0 30px rgba(56, 189, 248, 0.1);
        }

        .marketing-mini-stat {
          position: relative;
          transition: transform 300ms ease;
        }

        .marketing-mini-stat::before {
          content: "";
          position: absolute;
          left: 0;
          top: -7px;
          width: 18px;
          height: 1px;
          background: linear-gradient(90deg, rgba(125, 211, 252, 0.65), transparent);
          transition: width 300ms ease;
        }

        .marketing-mini-stat:hover {
          transform: translateY(-2px);
        }

        .marketing-mini-stat:hover::before {
          width: 42px;
        }

        .marketing-hero-visual {
          perspective: 1200px;
          animation: marketingMediaFloat 7s ease-in-out infinite;
        }

        .marketing-hero-glow {
          background:
            radial-gradient(circle, rgba(59, 130, 246, 0.2), rgba(14, 165, 233, 0.06) 35%, transparent 70%);
          filter: blur(25px);
        }

        .marketing-hero-grid {
          background-image:
            linear-gradient(rgba(125, 211, 252, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.045) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(circle at center, black 25%, transparent 78%);
        }

        .marketing-media-card {
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.35),
            inset 0 0 0 1px rgba(255, 255, 255, 0.015);
          transition:
            transform 500ms ease,
            border-color 500ms ease,
            box-shadow 500ms ease;
        }

        .marketing-media-card:hover {
          transform: translateY(-7px);
          border-color: rgba(125, 211, 252, 0.3);
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.45),
            0 0 35px rgba(56, 189, 248, 0.08);
        }

        .marketing-approach-card {
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 25px 70px rgba(0, 0, 0, 0.25);
        }

        .marketing-avatar {
          animation: marketingAvatarPulse 4s ease-in-out infinite;
        }

        .marketing-progress {
          animation: marketingGrowWidth 1.5s ease-out both;
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.25);
        }

        .marketing-dashboard {
          box-shadow:
            0 35px 100px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .marketing-dashboard-grid {
          background-image:
            linear-gradient(rgba(125, 211, 252, 0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.028) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: linear-gradient(to bottom, black, transparent);
        }

        .marketing-metric-card {
          position: relative;
          overflow: hidden;
          transition:
            transform 300ms ease,
            border-color 300ms ease,
            background 300ms ease,
            box-shadow 300ms ease;
        }

        .marketing-metric-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 20%,
            rgba(125, 211, 252, 0.045) 50%,
            transparent 80%
          );
          transform: translateX(-100%);
          transition: transform 700ms ease;
        }

        .marketing-metric-card:hover {
          transform: translateY(-4px);
          border-color: rgba(125, 211, 252, 0.3);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.2);
        }

        .marketing-metric-card:hover::before {
          transform: translateX(100%);
        }

        .marketing-metric-active {
          box-shadow:
            0 15px 45px rgba(14, 116, 144, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .marketing-inner-panel {
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.025),
            0 18px 50px rgba(0, 0, 0, 0.12);
        }

        .marketing-chart-bar {
          transition:
            filter 300ms ease,
            transform 300ms ease;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.06);
        }

        .marketing-chart-bar:hover {
          filter: brightness(1.2);
          transform: scaleY(1.02);
        }

        .marketing-range {
          appearance: none;
          height: 5px;
          border-radius: 999px;
          outline: none;
          background: linear-gradient(
            90deg,
            rgba(14, 165, 233, 0.7),
            rgba(255, 255, 255, 0.1)
          );
        }

        .marketing-range::-webkit-slider-thumb {
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid #7dd3fc;
          background: #07101d;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.45);
        }

        .marketing-range::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid #7dd3fc;
          background: #07101d;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.45);
        }

        .marketing-result-card {
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.025),
            0 15px 45px rgba(14, 116, 144, 0.05);
        }

        .marketing-service-card {
          box-shadow:
            0 18px 55px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
          transition:
            transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 450ms ease,
            box-shadow 450ms ease,
            background 450ms ease;
        }

        .marketing-service-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background:
            radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.07), transparent 28%),
            linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.025), transparent 60%);
          opacity: 0;
          transition: opacity 500ms ease;
        }

        .marketing-service-card:hover {
          transform: translateY(-8px);
          border-color: rgba(125, 211, 252, 0.32);
          background: rgba(10, 17, 29, 0.96);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.36),
            0 0 35px rgba(56, 189, 248, 0.06);
        }

        .marketing-service-card:hover::after {
          opacity: 1;
        }

        .marketing-card-line {
          transform: scaleX(0);
          transform-origin: left;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(56, 189, 248, 0.8),
            transparent
          );
          transition: transform 600ms ease;
        }

        .marketing-service-card:hover .marketing-card-line {
          transform: scaleX(1);
        }

        .marketing-service-icon {
          transition:
            transform 350ms ease,
            border-color 350ms ease,
            box-shadow 350ms ease;
        }

        .marketing-service-card:hover .marketing-service-icon {
          transform: translateY(-2px) rotate(3deg);
          border-color: rgba(125, 211, 252, 0.45);
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.1);
        }

        .marketing-filter {
          transition:
            transform 250ms ease,
            border-color 250ms ease,
            background 250ms ease,
            color 250ms ease;
        }

        .marketing-filter:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.25);
          color: white;
        }

        .marketing-filter-active {
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.06);
        }

        .marketing-gallery-card {
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
          transition:
            transform 500ms ease,
            border-color 500ms ease,
            box-shadow 500ms ease;
        }

        .marketing-gallery-card:hover {
          transform: translateY(-7px);
          border-color: rgba(125, 211, 252, 0.28);
          box-shadow:
            0 35px 90px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(56, 189, 248, 0.06);
        }

        .marketing-process-card {
          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.02);
          transition:
            transform 350ms ease,
            border-color 350ms ease,
            background 350ms ease,
            box-shadow 350ms ease;
        }

        .marketing-process-card:hover {
          transform: translateY(-5px);
          border-color: rgba(125, 211, 252, 0.25);
          background: rgba(56, 189, 248, 0.025);
          box-shadow:
            0 25px 65px rgba(0, 0, 0, 0.25),
            0 0 25px rgba(56, 189, 248, 0.04);
        }

        .marketing-cta {
          box-shadow:
            0 35px 100px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .marketing-cta-grid {
          background-image:
            linear-gradient(rgba(125, 211, 252, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.035) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to right, transparent, black 35%, black 70%, transparent);
        }

        .marketing-cta-button {
          box-shadow:
            0 15px 35px rgba(56, 189, 248, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          transition:
            transform 300ms ease,
            background 300ms ease,
            box-shadow 300ms ease;
        }

        .marketing-cta-button:hover {
          transform: translateY(-3px);
          background: white;
          box-shadow:
            0 20px 45px rgba(56, 189, 248, 0.2),
            0 0 30px rgba(56, 189, 248, 0.08);
        }

        @media (max-width: 767px) {
          .marketing-grid {
            background-size: 46px 46px;
          }

          .marketing-grid-fine {
            background-size: 14px 14px;
          }

          .marketing-beam {
            opacity: 0.5;
          }

          .marketing-hero-visual {
            animation-duration: 9s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marketing-grid,
          .marketing-grid-fine,
          .marketing-scan,
          .marketing-orb,
          .marketing-beam,
          .marketing-reveal,
          .marketing-hero-visual,
          .marketing-avatar,
          .marketing-progress,
          .marketing-primary-button,
          .marketing-gradient-text {
            animation: none !important;
          }

          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}