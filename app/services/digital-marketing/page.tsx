
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
    <main className="relative min-h-screen overflow-hidden bg-[#070910] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="absolute -right-40 top-[700px] h-96 w-96 rounded-full bg-cyan-500/[0.09] blur-[130px]" />
        <div className="absolute left-1/3 top-[1600px] h-96 w-96 rounded-full bg-indigo-500/[0.08] blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070910]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <Link href="/" className="shrink-0">
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={145}
              height={52}
              priority
              className="h-auto w-[115px] transition duration-300 hover:opacity-80 sm:w-[135px]"
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-gray-300 lg:flex">
            <Link href="/" className="transition hover:text-sky-300">
              Home
            </Link>
            <Link
              href="/services"
              className="transition hover:text-sky-300"
            >
              Services
            </Link>
            <a
              href="#creative"
              className="transition hover:text-sky-300"
            >
              Creative Studio
            </a>
            <a
              href="#performance"
              className="transition hover:text-sky-300"
            >
              Performance
            </a>
          </nav>

          <Link
            href="/contact"
            className="shrink-0 rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2.5 text-xs font-semibold text-sky-200 transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-400/20 sm:px-5 sm:text-sm"
          >
            Start a Project ↗
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-20 md:grid-cols-2 md:pb-32 md:pt-28">
        <div className="animate-[fadeInUp_.8s_ease-out_both]">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/[0.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-200 sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-sky-300 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-sky-300" />
            </span>
            Digital Marketing & Creative Studio
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Creativity that
            <span className="mt-3 block bg-gradient-to-r from-sky-300 via-blue-400 to-slate-100 bg-clip-text pb-2 text-transparent">
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
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:shadow-blue-400/30"
            >
              Build Your Campaign
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <a
              href="#creative"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm text-gray-300 transition hover:border-sky-300/40 hover:bg-white/[0.04] hover:text-white"
            >
              Explore Our Capabilities ↓
            </a>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-5">
            <div>
              <p className="text-lg font-semibold sm:text-xl">Strategy</p>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                Built around goals
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold sm:text-xl">Creative</p>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                Made to stand out
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold sm:text-xl">Analytics</p>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                Measured & refined
              </p>
            </div>
          </div>
        </div>

        {/* Hero creative collage */}
        <div className="relative mx-auto w-full max-w-xl animate-[fadeInUp_1s_ease-out_both]">
          <div className="absolute inset-10 rounded-full bg-blue-500/20 blur-[100px]" />

          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            <div className="group relative mt-8 h-56 overflow-hidden rounded-2xl border border-white/10 bg-[#101827] sm:h-72">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-[#060a12]/10 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] text-sky-200 backdrop-blur">
                  CREATIVE DESIGN
                </span>
                <p className="mt-2 text-sm font-semibold">Visual Identity</p>
              </div>
            </div>

            <div className="group relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#101827] sm:h-80">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-[#060a12]/10 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] text-sky-200 backdrop-blur">
                  VIDEO PRODUCTION
                </span>
                <p className="mt-2 text-sm font-semibold">Motion & Storytelling</p>
              </div>
            </div>

            <div className="col-span-2 rounded-2xl border border-sky-300/20 bg-gradient-to-r from-[#101c30] via-[#0d1421] to-[#10101c] p-4 sm:p-5">
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
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#101827] bg-gradient-to-br from-blue-500 to-sky-300 text-xs font-bold text-[#07101d]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full origin-left animate-[growWidth_1.5s_ease-out_both] rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-slate-200" />
              </div>
              <p className="mt-2 text-[10px] text-gray-500">
                Strategy · Design · Production · Measurement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Media buying dashboard */}
      <section
        id="performance"
        className="relative z-10 border-y border-white/[0.07] bg-[#0a0f18]/80 px-6 py-24 md:py-28"
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

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b111c] p-4 shadow-2xl shadow-blue-950/20 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
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
                  className={`rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-1 sm:p-5 ${
                    activeMetric === metric.name
                      ? "border-sky-300/40 bg-sky-300/[0.07] shadow-lg shadow-blue-950/20"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
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
                      decimals={metric.name === "CPC" ? 2 : metric.name === "ROAS" || metric.name === "CTR" ? 1 : 0}
                    />
                  </p>
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full origin-left animate-[growWidth_1.5s_ease-out_both] rounded-full bg-gradient-to-r from-blue-600 to-sky-300"
                      style={{
                        width:
                          metric.name === "ROAS"
                            ? "76%"
                            : metric.name === "CTR"
                              ? "59%"
                              : metric.name === "CPC"
                                ? "37%"
                                : "86%",
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
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedMetric.label}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {selectedMetric.note}
                    </p>
                  </div>
                  <span className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-[10px] text-gray-400">
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
                          className="w-full origin-bottom rounded-t-md bg-gradient-to-t from-blue-700/70 via-blue-500 to-sky-300 transition duration-500 group-hover:brightness-125"
                          style={{
                            height: `${height}%`,
                            animation: `barRise .8s ease-out ${index * 55}ms both`,
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

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
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
                    className="mt-4 w-full cursor-pointer accent-sky-400"
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
                    className="mt-4 w-full cursor-pointer accent-sky-400"
                  />
                  <div className="mt-2 flex justify-between text-[10px] text-gray-600">
                    <span>500</span>
                    <span>20,000</span>
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-sky-300/15 bg-sky-300/[0.04] p-4">
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

      {/* Services */}
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
                className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b111c]/90 p-6 transition duration-500 hover:-translate-y-2 hover:border-sky-300/35 hover:shadow-2xl hover:shadow-blue-950/30 sm:p-7"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-400/0 blur-3xl transition duration-500 group-hover:bg-sky-400/10" />

                <div className="relative flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/[0.06] text-2xl text-sky-200 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {service.icon}
                  </span>
                  <span className="text-xs tracking-widest text-gray-600">
                    {service.number}
                  </span>
                </div>

                <h3 className="relative mt-7 text-xl font-semibold transition-colors group-hover:text-sky-200">
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
                      className="rounded-full border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-gray-400 transition group-hover:border-sky-300/20 group-hover:text-sky-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="relative mt-6 h-px overflow-hidden bg-white/[0.07]">
                  <div className="h-full w-0 bg-gradient-to-r from-blue-600 to-sky-300 transition-all duration-500 group-hover:w-full" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Creative portfolio */}
      <section
        id="creative"
        className="relative z-10 border-y border-white/[0.07] bg-[#0a0f18]/70 px-6 py-24 md:py-28"
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
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-200 transition hover:text-white"
            >
              Request Creative Work <span>↗</span>
            </Link>
          </div>

          <div className="mb-7 flex flex-wrap gap-2">
            {["All", "Design", "Video", "Photography"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-xs transition duration-300 ${
                  activeFilter === filter
                    ? "border-sky-300/40 bg-sky-300/10 text-sky-200"
                    : "border-white/10 text-gray-400 hover:border-white/25 hover:text-white"
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
                className={`group relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#101827] sm:min-h-[360px] ${work.className}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url("${work.image}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/15 to-transparent transition duration-300 group-hover:from-[#050811]/95" />

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

      {/* Production workflow */}
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-300/30 hover:bg-sky-300/[0.025]"
              >
                <span className="text-sm tracking-widest text-sky-300">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 pb-24 md:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-sky-300/20 bg-gradient-to-br from-[#101e35] via-[#0c1423] to-[#0a0d15] px-7 py-12 sm:px-12 sm:py-16">
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
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-sky-300 px-7 py-4 text-sm font-semibold text-[#07101d] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-sky-400/20"
            >
              Discuss Your Campaign
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes barRise {
          from {
            opacity: 0;
            transform: scaleY(0.08);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        @keyframes growWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
