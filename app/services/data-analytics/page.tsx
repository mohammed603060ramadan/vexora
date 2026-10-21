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

const dataStreams = [
  "010101",
  "DATA",
  "101100",
  "01",
  "ANALYTICS",
  "110010",
  "01",
  "INSIGHT",
  "100101",
  "DATA",
];

const telemetry = [
  { label: "DATA FLOW", value: "ACTIVE" },
  { label: "PIPELINE", value: "ONLINE" },
  { label: "QUALITY", value: "98.6%" },
];

export default function DataAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080d] text-white">
      {/* =========================================================
          TECHNOLOGY BACKGROUND
      ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Deep atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,132,255,0.13),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(0,210,255,0.08),transparent_25%),radial-gradient(circle_at_50%_78%,rgba(30,90,255,0.07),transparent_30%)]" />

        {/* Technical grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(72,150,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(72,150,255,0.055)_1px,transparent_1px)] bg-[size:55px_55px] opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_92%)] animate-[gridDrift_24s_linear_infinite]" />

        {/* Fine grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:11px_11px] opacity-40" />

        {/* Scan line */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent shadow-[0_0_25px_rgba(56,189,248,0.8)] animate-[scanScreen_9s_linear_infinite]" />

        {/* Left glow */}
        <div className="absolute -left-56 top-20 h-[520px] w-[520px] rounded-full bg-blue-600/[0.08] blur-[140px] animate-[orbFloat_12s_ease-in-out_infinite_alternate]" />

        {/* Right glow */}
        <div className="absolute -right-60 top-[560px] h-[560px] w-[560px] rounded-full bg-cyan-500/[0.07] blur-[150px] animate-[orbFloatReverse_15s_ease-in-out_infinite_alternate]" />

        {/* Bottom glow */}
        <div className="absolute left-1/2 top-[1250px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-indigo-600/[0.06] blur-[150px]" />

        {/* Data streams */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {dataStreams.map((stream, index) => (
            <div
              key={`${stream}-${index}`}
              className="absolute whitespace-nowrap font-mono text-[9px] tracking-[0.35em] text-sky-400/60"
              style={{
                left: `${5 + index * 10}%`,
                top: `${8 + ((index * 17) % 78)}%`,
                animation: `dataFloat ${
                  7 + (index % 4)
                }s ease-in-out infinite`,
                animationDelay: `${index * -1.4}s`,
              }}
            >
              {stream}
            </div>
          ))}
        </div>

        {/* Horizontal telemetry lines */}
        <div className="absolute left-0 right-0 top-[28%] h-px bg-gradient-to-r from-transparent via-sky-500/10 to-transparent" />
        <div className="absolute left-0 right-0 top-[61%] h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
        <div className="absolute left-0 right-0 top-[82%] h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />

        {/* Floating nodes */}
        <span className="absolute left-[8%] top-[25%] h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.9)] animate-pulse" />
        <span className="absolute right-[14%] top-[35%] h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.9)] animate-pulse" />
        <span className="absolute left-[22%] top-[68%] h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-pulse" />
        <span className="absolute right-[8%] top-[74%] h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.9)] animate-pulse" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,5,10,0.72)_100%)]" />

        {/* Subtle scanlines */}
        <div className="absolute inset-0 opacity-[0.035] [background-image:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.35)_4px)]" />
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05080d]/75 backdrop-blur-2xl">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/"
            aria-label="VEXORA Home"
            className="group relative shrink-0"
          >
            <div className="absolute -inset-3 rounded-2xl bg-sky-400/0 blur-xl transition duration-500 group-hover:bg-sky-400/10" />

            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={150}
              height={55}
              priority
              className="relative h-auto w-[120px] transition duration-300 group-hover:scale-[1.03] group-hover:brightness-110 sm:w-[140px]"
            />
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-gray-300 md:flex">
            <Link
              href="/"
              className="relative transition duration-300 hover:text-sky-300"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="relative text-sky-300 transition duration-300"
            >
              Services
              <span className="absolute -bottom-5 left-1/2 h-px w-5 -translate-x-1/2 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            </Link>

            <Link
              href="/projects"
              className="transition duration-300 hover:text-sky-300"
            >
              Projects
            </Link>

            <Link
              href="/about"
              className="transition duration-300 hover:text-sky-300"
            >
              About
            </Link>
          </nav>

          <Link
            href="/contact"
            className="group relative overflow-hidden rounded-full border border-sky-400/30 bg-sky-400/[0.07] px-4 py-2.5 text-xs font-semibold text-sky-200 transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-400/15 hover:shadow-[0_0_25px_rgba(56,189,248,0.12)] sm:px-5 sm:text-sm"
          >
            <span className="relative z-10">
              Let&apos;s Talk <span aria-hidden="true">↗</span>
            </span>

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-20 md:grid-cols-2 md:pb-32 md:pt-28">
        <div className="animate-[fadeInUp_.8s_ease-out_both]">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-sky-400/20 bg-sky-400/[0.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.06)] sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
            </span>
            Data Analytics & Intelligence
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            Make your data
            <span className="relative mt-3 block bg-gradient-to-r from-sky-300 via-blue-400 to-slate-200 bg-clip-text pb-2 text-transparent">
              work for you.
              <span className="absolute -bottom-1 left-0 h-px w-28 bg-gradient-to-r from-sky-400 to-transparent opacity-70" />
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
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <span className="relative z-10">
                Discuss Your Project
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>

              <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-full skew-x-[-20deg] bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-[400%]" />
            </Link>

            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-gray-300 transition duration-300 hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-sky-400/[0.04] hover:text-white"
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

        {/* =======================================================
            ANALYTICS DASHBOARD
        ======================================================= */}
        <div className="relative mx-auto w-full max-w-xl animate-[fadeInUp_1s_ease-out_both]">
          <div className="absolute inset-8 rounded-full bg-blue-500/15 blur-[90px] animate-[dashboardGlow_6s_ease-in-out_infinite_alternate]" />

          <div className="relative overflow-hidden rounded-3xl border border-sky-400/10 bg-[#09111d]/95 p-4 shadow-2xl shadow-blue-950/50 backdrop-blur-xl transition duration-500 hover:border-sky-400/30 sm:p-6">
            {/* Dashboard technical grid */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.035)_1px,transparent_1px)] bg-[size:28px_28px]" />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-400/[0.05] via-transparent to-blue-600/[0.08]" />

            <div className="relative flex items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                  <p className="text-sm font-semibold tracking-wide">
                    Analytics Dashboard
                  </p>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Intelligence monitoring interface
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="text-[10px] text-emerald-300">
                  System online
                </span>
              </div>
            </div>

            {/* Telemetry */}
            <div className="relative mt-4 grid grid-cols-3 gap-2">
              {telemetry.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                >
                  <p className="text-[8px] tracking-[0.16em] text-gray-600">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-sky-300">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative mt-4 grid grid-cols-2 gap-3">
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
                    <div className="h-full w-[82%] origin-left animate-[growWidth_1.5s_ease-out_both] rounded-full bg-gradient-to-r from-blue-600 to-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.35)]" />
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
                    <div className="h-full w-[98.6%] origin-left animate-[growWidth_1.7s_ease-out_both] rounded-full bg-gradient-to-r from-blue-600 to-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.35)]" />
                  </div>

                  <span className="text-[10px] text-sky-300">Score</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="relative mt-4 rounded-2xl border border-white/[0.08] bg-[#070d16]/90 p-4 sm:p-5">
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

              <div className="relative mt-5 flex h-36 items-end gap-2 sm:gap-3">
                <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-white/[0.04]" />
                <div className="pointer-events-none absolute inset-x-0 top-1/3 border-t border-white/[0.04]" />
                <div className="pointer-events-none absolute inset-x-0 top-2/3 border-t border-white/[0.04]" />

                {chartBars.map((height, index) => (
                  <div
                    key={index}
                    className="group relative flex h-full flex-1 items-end"
                  >
                    <div
                      className={`w-full origin-bottom rounded-t-md transition-all duration-500 group-hover:scale-x-110 group-hover:brightness-125 ${
                        activeTab === "Trends"
                          ? "bg-gradient-to-t from-indigo-700/80 to-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                          : activeTab === "Reports"
                            ? "bg-gradient-to-t from-slate-500/80 to-slate-200"
                            : "bg-gradient-to-t from-blue-700/80 to-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                      }`}
                      style={{
                        height: `${height}%`,
                        animation: `barRise .8s ease-out ${
                          index * 65
                        }ms both`,
                      }}
                    />

                    <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-sky-300 opacity-0 transition-opacity group-hover:opacity-100">
                      {height}
                    </span>
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

            {/* Intelligence status */}
            <div className="relative mt-4 flex items-center gap-3 overflow-hidden rounded-2xl border border-sky-400/15 bg-gradient-to-r from-sky-400/[0.07] to-blue-500/[0.02] p-4">
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-sky-400 to-transparent animate-[statusLine_2.5s_linear_infinite]" />

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.08] text-xl text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.08)]">
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

          {/* Floating status */}
          <div className="pointer-events-none absolute -right-3 top-20 hidden animate-[float_4s_ease-in-out_infinite] rounded-2xl border border-sky-300/20 bg-[#101b2b]/95 px-4 py-3 shadow-xl shadow-blue-950/30 backdrop-blur-md sm:block">
            <p className="text-[10px] text-gray-400">Analytics Engine</p>

            <p className="mt-1 text-sm font-semibold text-sky-200">
              Data → Insights
            </p>

            <div className="mt-2 flex items-center gap-1">
              <span className="h-1 w-1 animate-pulse rounded-full bg-sky-300" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-sky-300 [animation-delay:150ms]" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-sky-300 [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section
        id="services"
        className="relative z-10 border-t border-white/[0.07] bg-[#070d15]/75 px-6 py-24 backdrop-blur-[2px] md:py-28"
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
                className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b121d]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition duration-500 hover:-translate-y-2 hover:border-sky-400/40 hover:shadow-xl hover:shadow-blue-950/30"
              >
                {/* Card glow */}
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sky-500/0 blur-3xl transition duration-500 group-hover:bg-sky-500/15" />

                {/* Card grid */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.025)_1px,transparent_1px)] bg-[size:22px_22px] opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative flex items-center justify-between">
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/[0.07] text-2xl text-sky-300 transition duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-sky-400/15 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]">
                    {service.icon}

                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-sky-300 opacity-0 shadow-[0_0_10px_rgba(56,189,248,0.9)] transition duration-300 group-hover:opacity-100" />
                  </span>

                  <span className="font-mono text-xs tracking-widest text-gray-600">
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
                      className="rounded-full border border-white/[0.08] bg-white/[0.015] px-2.5 py-1 text-[10px] text-gray-400 transition group-hover:border-sky-400/20 group-hover:text-sky-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="relative mt-6 h-px w-full overflow-hidden bg-white/[0.07]">
                  <div className="h-full w-0 bg-gradient-to-r from-blue-600 to-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.6)] transition-all duration-500 group-hover:w-full" />
                </div>

                <div className="mt-4 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-gray-600">
                  <span>Analytics Module</span>
                  <span className="text-sky-400/70">Ready</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PROCESS
      ========================================================= */}
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

            <div className="relative grid gap-4 sm:grid-cols-2">
              {/* Connecting line */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-400/20 to-transparent sm:block" />

              {process.map((step) => (
                <div
                  key={step.number}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-sky-400/[0.03]"
                >
                  <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-sky-500/0 blur-2xl transition duration-500 group-hover:bg-sky-500/10" />

                  <div className="relative flex items-center justify-between">
                    <span className="text-sm font-medium tracking-widest text-sky-400 transition-colors group-hover:text-sky-200">
                      {step.number}
                    </span>

                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400/30 transition duration-300 group-hover:bg-sky-300 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                  </div>

                  <h3 className="relative mt-4 text-lg font-semibold">
                    {step.title}
                  </h3>

                  <p className="relative mt-2 text-sm leading-7 text-gray-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT CTA
      ========================================================= */}
      <section className="relative z-10 px-6 pb-24 md:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-sky-400/20 bg-gradient-to-br from-[#101d32] via-[#0b1220] to-[#080d15] px-7 py-12 shadow-2xl shadow-blue-950/30 sm:px-12 sm:py-16">
          {/* CTA grid */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />

          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/15 blur-[90px] animate-[orbFloat_9s_ease-in-out_infinite_alternate]" />

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
              className="group relative inline-flex shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full bg-sky-400 px-7 py-4 text-sm font-semibold text-[#07101d] transition duration-300 hover:-translate-y-1 hover:bg-sky-300 hover:shadow-lg hover:shadow-sky-400/20"
            >
              <span className="relative z-10">
                Contact VEXORA
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>

              <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-full skew-x-[-20deg] bg-white/40 blur-md transition-transform duration-700 group-hover:translate-x-[400%]" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="relative z-10 border-t border-white/[0.08] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <Link
            href="/"
            aria-label="VEXORA home"
            className="group"
          >
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={115}
              height={42}
              className="h-auto w-[105px] opacity-80 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
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
          PAGE ANIMATIONS
          Normal style tag — no styled-jsx
      ========================================================= */}
      <style>{`
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

        @keyframes gridDrift {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(55px, 55px, 0);
          }
        }

        @keyframes scanScreen {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }

          8% {
            opacity: 1;
          }

          50% {
            opacity: 0.7;
          }

          92% {
            opacity: 1;
          }

          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes orbFloat {
          0% {
            transform: translate3d(-10px, -8px, 0) scale(1);
          }

          100% {
            transform: translate3d(25px, 25px, 0) scale(1.08);
          }
        }

        @keyframes orbFloatReverse {
          0% {
            transform: translate3d(15px, 15px, 0) scale(1.05);
          }

          100% {
            transform: translate3d(-20px, -20px, 0) scale(0.95);
          }
        }

        @keyframes dashboardGlow {
          0% {
            opacity: 0.5;
            transform: scale(0.95);
          }

          100% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        @keyframes dataFloat {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.25;
          }

          50% {
            transform: translateY(-18px);
            opacity: 0.7;
          }
        }

        @keyframes statusLine {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateY(400%);
            opacity: 0;
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