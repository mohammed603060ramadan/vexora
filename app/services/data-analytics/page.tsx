
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    const duration = 1800;
    let startTime = 0;

    const animate = (time: number) => {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
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

const services = [
  {
    number: "01",
    title: "Business Intelligence",
    description:
      "Transform business information into clear insights that help you understand performance and make informed decisions.",
    tags: ["KPIs", "Dashboards", "Reporting"],
    icon: "◫",
  },
  {
    number: "02",
    title: "Data Analysis",
    description:
      "Discover patterns, trends, and opportunities hidden in your data through structured analytical methods.",
    tags: ["Data Cleaning", "Exploration", "Insights"],
    icon: "⌁",
  },
  {
    number: "03",
    title: "Data Visualization",
    description:
      "Present complex information through clear visualizations that make important findings easier to understand.",
    tags: ["Charts", "Visual Reports", "Analytics"],
    icon: "▥",
  },
  {
    number: "04",
    title: "Data Management",
    description:
      "Improve data consistency, accessibility, organization, and reliability across your business workflows.",
    tags: ["Data Quality", "Organization", "Integration"],
    icon: "⌘",
  },
];

const process = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understand your business goals, data sources, and key challenges.",
  },
  {
    number: "02",
    title: "Analyze",
    description:
      "Prepare the data and identify meaningful patterns and findings.",
  },
  {
    number: "03",
    title: "Visualize",
    description:
      "Turn results into clear reports and useful visual insights.",
  },
  {
    number: "04",
    title: "Improve",
    description:
      "Use your findings to support better decisions and next steps.",
  },
];

const chartBars = [35, 52, 43, 68, 57, 78, 63, 91, 72, 100, 81, 94];

export default function DataAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a10] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-[-160px] top-[650px] h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-[1100px] h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070a10]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="group shrink-0">
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={150}
              height={55}
              priority
              className="h-auto w-[120px] transition duration-300 group-hover:opacity-80 sm:w-[140px]"
            />
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-gray-300 md:flex">
            <Link href="/" className="transition hover:text-sky-300">
              Home
            </Link>
            <Link
              href="/services"
              className="transition hover:text-sky-300"
            >
              Services
            </Link>
            <Link
              href="/projects"
              className="transition hover:text-sky-300"
            >
              Projects
            </Link>
            <Link href="/about" className="transition hover:text-sky-300">
              About
            </Link>
          </nav>

          <Link
            href="/contact"
            className="rounded-full border border-sky-400/30 bg-sky-400/[0.08] px-4 py-2.5 text-xs font-semibold text-sky-200 transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-400/15 sm:px-5 sm:text-sm"
          >
            Let&apos;s Talk <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-20 md:grid-cols-2 md:pb-32 md:pt-28">
        <div className="animate-[fadeInUp_.8s_ease-out_both]">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-sky-400/20 bg-sky-400/[0.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300 sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
            </span>
            Data Analytics & Intelligence
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            Make your data
            <span className="mt-3 block bg-gradient-to-r from-sky-300 via-blue-400 to-slate-200 bg-clip-text pb-2 text-transparent">
              work for you.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-gray-400 sm:text-lg">
            Transform complex information into meaningful insights. Discover
            patterns, understand performance, and make smarter business
            decisions with data-driven solutions.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30"
            >
              Discuss Your Project
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-gray-300 transition duration-300 hover:border-sky-400/40 hover:bg-white/[0.04] hover:text-white"
            >
              Explore Services <span>↓</span>
            </a>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-5">
            <div className="group">
              <p className="text-lg font-semibold transition-colors group-hover:text-sky-300 sm:text-xl">
                Insights
              </p>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                Understand trends
              </p>
            </div>
            <div className="group">
              <p className="text-lg font-semibold transition-colors group-hover:text-sky-300 sm:text-xl">
                Clarity
              </p>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                Visualize results
              </p>
            </div>
            <div className="group">
              <p className="text-lg font-semibold transition-colors group-hover:text-sky-300 sm:text-xl">
                Decisions
              </p>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                Act confidently
              </p>
            </div>
          </div>
        </div>

        {/* Animated analytics dashboard */}
        <div className="relative mx-auto w-full max-w-xl animate-[fadeInUp_1s_ease-out_both]">
          <div className="absolute inset-8 rounded-full bg-blue-500/15 blur-[90px]" />

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c121d]/95 p-4 shadow-2xl shadow-blue-950/40 transition duration-500 hover:border-sky-400/30 sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-400/[0.04] via-transparent to-blue-600/[0.06]" />

            <div className="relative flex items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-semibold tracking-wide">
                  Analytics Dashboard
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Interactive design preview
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-300">
                  Live animation
                </span>
              </div>
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition duration-300 hover:border-sky-400/40 hover:bg-sky-400/[0.04]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-400">Records analyzed</p>
                  <span className="text-sky-300">◫</span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  <AnimatedNumber value={12840} suffix="+" />
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[82%] origin-left animate-[growWidth_1.5s_ease-out_both] rounded-full bg-gradient-to-r from-blue-600 to-sky-300" />
                  </div>
                  <span className="text-[10px] text-sky-300">Data</span>
                </div>
              </div>

              <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition duration-300 hover:border-sky-400/40 hover:bg-sky-400/[0.04]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-400">Quality score</p>
                  <span className="text-sky-300">✦</span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  <AnimatedNumber value={98.6} suffix="%" decimals={1} />
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[98.6%] origin-left animate-[growWidth_1.7s_ease-out_both] rounded-full bg-gradient-to-r from-blue-600 to-sky-300" />
                  </div>
                  <span className="text-[10px] text-sky-300">Score</span>
                </div>
              </div>
            </div>

            <div className="relative mt-4 rounded-2xl border border-white/[0.08] bg-[#090e17]/80 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Data performance</p>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Illustrative values · Not live metrics
                  </p>
                </div>
                <div className="flex gap-1 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">
                  {["Overview", "Trends", "Reports"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-lg px-2 py-1.5 text-[10px] transition duration-300 sm:px-3 ${
                        activeTab === tab
                          ? "bg-sky-400/15 text-sky-200 shadow-sm shadow-sky-500/10"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex h-36 items-end gap-2 sm:gap-3">
                {chartBars.map((height, index) => (
                  <div
                    key={index}
                    className="group relative flex h-full flex-1 items-end"
                  >
                    <div
                      className={`w-full origin-bottom rounded-t-md transition-all duration-500 group-hover:scale-x-110 group-hover:brightness-125 ${
                        activeTab === "Trends"
                          ? "bg-gradient-to-t from-indigo-700/80 to-violet-300"
                          : activeTab === "Reports"
                            ? "bg-gradient-to-t from-slate-500/80 to-slate-200"
                            : "bg-gradient-to-t from-blue-700/80 to-sky-300"
                      }`}
                      style={{
                        height: `${height}%`,
                        animation: `barRise .8s ease-out ${index * 65}ms both`,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between text-[9px] text-gray-600">
                <span>Period 01</span>
                <span>Period 04</span>
                <span>Period 08</span>
                <span>Period 12</span>
              </div>
            </div>

            <div className="relative mt-4 flex items-center gap-3 rounded-2xl border border-sky-400/15 bg-gradient-to-r from-sky-400/[0.07] to-blue-500/[0.02] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.08] text-xl text-sky-300">
                ✧
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {activeTab === "Overview"
                    ? "From data to direction"
                    : activeTab === "Trends"
                      ? "Discover meaningful patterns"
                      : "Turn findings into reports"}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Explore the dashboard preview using the tabs above.
                </p>
              </div>
              <span className="animate-pulse text-sky-300">✦</span>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-3 top-20 hidden animate-[float_4s_ease-in-out_infinite] rounded-2xl border border-sky-300/20 bg-[#101b2b]/95 px-4 py-3 shadow-xl shadow-blue-950/30 sm:block">
            <p className="text-[10px] text-gray-400">Analytics</p>
            <p className="mt-1 text-sm font-semibold text-sky-200">
              Data → Insights
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="relative z-10 border-t border-white/[0.07] bg-[#0a0f17]/70 px-6 py-24 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                What We Do
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Data that drives
                <span className="text-gray-500"> better decisions.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-gray-400">
              Practical analytical services designed to make information
              easier to understand and more useful to your organization.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.number}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d131e] p-6 transition duration-500 hover:-translate-y-2 hover:border-sky-400/40 hover:shadow-xl hover:shadow-blue-950/30"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sky-500/0 blur-3xl transition duration-500 group-hover:bg-sky-500/15" />

                <div className="relative flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/[0.07] text-2xl text-sky-300 transition duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-sky-400/15">
                    {service.icon}
                  </span>
                  <span className="text-xs tracking-widest text-gray-600">
                    {service.number}
                  </span>
                </div>

                <h3 className="relative mt-7 text-lg font-semibold transition-colors group-hover:text-sky-200">
                  {service.title}
                </h3>
                <p className="relative mt-3 min-h-[112px] text-sm leading-7 text-gray-400">
                  {service.description}
                </p>

                <div className="relative mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] text-gray-400 transition group-hover:border-sky-400/20 group-hover:text-sky-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="relative mt-6 h-px w-full overflow-hidden bg-white/[0.07]">
                  <div className="h-full w-0 bg-gradient-to-r from-blue-600 to-sky-300 transition-all duration-500 group-hover:w-full" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative z-10 px-6 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                How We Work
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                A clear path from
                <span className="text-gray-500"> data to insight.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
                Every project starts with your business goals. We build the
                analytical approach around the questions you need answered.
              </p>
              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-medium text-sky-300 transition hover:text-white"
              >
                Talk to our team
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {process.map((step) => (
                <div
                  key={step.number}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-sky-400/[0.03]"
                >
                  <span className="text-sm font-medium tracking-widest text-sky-400 transition-colors group-hover:text-sky-200">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative z-10 px-6 pb-24 md:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-sky-400/20 bg-gradient-to-br from-[#101d32] via-[#0b1220] to-[#0b0f16] px-7 py-12 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/15 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-32 left-10 h-60 w-60 rounded-full bg-sky-400/[0.08] blur-[80px]" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
                Let&apos;s Work Together
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                Ready to discover what your data can tell you?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400">
                Tell us about your goals, and let&apos;s explore the right
                analytical solution for your business.
              </p>
            </div>

            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-sky-400 px-7 py-4 text-sm font-semibold text-[#07101d] transition duration-300 hover:-translate-y-1 hover:bg-sky-300 hover:shadow-lg hover:shadow-sky-400/20"
            >
              Contact VEXORA
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-9px);
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
