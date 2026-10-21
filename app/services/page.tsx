"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Service = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  icon: string;
  code: string;
  metric: string;
  visual: string;
};

const services: Service[] = [
  {
    number: "01",
    title: "Software Development",
    description:
      "Modern websites, web applications, and custom software built around your business needs — with scalable architecture, strong performance, and a polished user experience.",
    tags: ["Web Development", "Web Applications", "Custom Software"],
    href: "/services/software-development",
    icon: "⌘",
    code: "BUILD_SYSTEM",
    metric: "DIGITAL PRODUCTS",
    visual: "01",
  },
  {
    number: "02",
    title: "Cybersecurity",
    description:
      "Practical security solutions to identify risks, strengthen protection, and support safer digital operations across your systems, applications, and data.",
    tags: ["Security Assessment", "Risk Analysis", "Protection"],
    href: "/services/cybersecurity",
    icon: "◈",
    code: "SECURE_CORE",
    metric: "SECURITY LAYER",
    visual: "02",
  },
  {
    number: "03",
    title: "Networks & Infrastructure",
    description:
      "Reliable network design and IT infrastructure solutions that help your technology work together with better stability, visibility, security, and room to grow.",
    tags: ["Networking", "Infrastructure", "IT Solutions"],
    href: "/services/networks-infrastructure",
    icon: "⌁",
    code: "NETWORK_CORE",
    metric: "INFRASTRUCTURE",
    visual: "03",
  },
  {
    number: "04",
    title: "Data Analytics",
    description:
      "Turn complex data into clear insights that help you understand performance, discover patterns, monitor important metrics, and make informed decisions.",
    tags: ["Data Analysis", "Reporting", "Insights"],
    href: "/services/data-analytics",
    icon: "◫",
    code: "DATA_ENGINE",
    metric: "INTELLIGENCE",
    visual: "04",
  },
  {
    number: "05",
    title: "Digital Marketing",
    description:
      "Strategic digital marketing focused on reaching the right audience, improving campaign performance, and connecting digital activity with real business objectives.",
    tags: ["Digital Strategy", "Campaigns", "Optimization"],
    href: "/services/digital-marketing",
    icon: "✦",
    code: "GROWTH_ENGINE",
    metric: "DIGITAL GROWTH",
    visual: "05",
  },
];

const codeFragments = [
  "010101",
  "VEXORA_CORE",
  "SYSTEM_READY",
  "01::01::01",
  "SECURE",
  "BUILD",
  "DATA",
  "NETWORK",
  "API",
  "ACCESS",
  "DEPLOY",
  "ANALYTICS",
];

const networkNodes = [
  { left: "8%", top: "24%", delay: "0s" },
  { left: "22%", top: "68%", delay: "1.4s" },
  { left: "38%", top: "35%", delay: "2.2s" },
  { left: "58%", top: "72%", delay: "0.8s" },
  { left: "73%", top: "27%", delay: "2.8s" },
  { left: "88%", top: "58%", delay: "1.8s" },
];

function ServiceVisual({ service }: { service: Service }) {
  const visualClass =
    service.number === "01"
      ? "service-visual-software"
      : service.number === "02"
        ? "service-visual-security"
        : service.number === "03"
          ? "service-visual-network"
          : service.number === "04"
            ? "service-visual-data"
            : "service-visual-marketing";

  return (
    <div
      className={`service-visual relative h-56 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#05090f] ${visualClass}`}
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(69,165,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(69,165,255,0.07)_1px,transparent_1px)] [background-size:30px_30px]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:8px_8px]"
      />

      {/* Atmosphere */}
      <div
        aria-hidden="true"
        className="service-visual-glow absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
      />

      {/* Rotating rings */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15 animate-[spin_18s_linear_infinite]"
      />

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 border-dashed animate-[spin_12s_linear_infinite_reverse]"
      />

      {/* =====================================================
          SOFTWARE DEVELOPMENT VISUAL
      ====================================================== */}

      {service.number === "01" && (
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-blue-300/20 bg-[#07101c]/90 p-4 shadow-[0_0_50px_rgba(22,135,255,0.14)] backdrop-blur-md">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400/60" />
              <span className="h-2 w-2 rounded-full bg-yellow-300/60" />
              <span className="h-2 w-2 rounded-full bg-emerald-300/60" />

              <span className="ml-auto font-mono text-[7px] text-slate-600">
                VXR_DEV
              </span>
            </div>

            <div className="space-y-2 font-mono text-[8px]">
              <div className="flex gap-2">
                <span className="text-blue-400/50">01</span>
                <span className="text-cyan-300/70">
                  const <span className="text-blue-300">system</span>
                </span>
              </div>

              <div className="flex gap-2">
                <span className="text-blue-400/50">02</span>
                <span className="pl-3 text-slate-500">
                  build<span className="text-blue-300">()</span>
                </span>
              </div>

              <div className="flex gap-2">
                <span className="text-blue-400/50">03</span>
                <span className="pl-3 text-cyan-200/60">
                  deploy<span className="text-blue-300">()</span>
                </span>
              </div>

              <div className="flex gap-2">
                <span className="text-blue-400/50">04</span>
                <span className="pl-3 text-emerald-300/60">
                  system.ready
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 right-4 h-3 w-[2px] bg-blue-300 animate-[cursorBlink_1s_step-end_infinite]" />
          </div>

          <span className="absolute left-[16%] top-[28%] h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_16px_rgba(69,165,255,0.9)] animate-pulse" />

          <span className="absolute right-[17%] bottom-[27%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)] animate-pulse" />

          <div className="absolute bottom-4 left-4 font-mono text-[7px] tracking-[0.2em] text-blue-300/30">
            CODE // BUILD // DEPLOY
          </div>
        </div>
      )}

      {/* =====================================================
          CYBERSECURITY VISUAL
      ====================================================== */}

      {service.number === "02" && (
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2">
            <svg
              viewBox="0 0 120 140"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              <path
                d="M60 8 L105 25 V62 C105 94 85 118 60 132 C35 118 15 94 15 62 V25 Z"
                fill="rgba(34,211,238,0.045)"
                stroke="rgba(103,232,249,0.55)"
                strokeWidth="1.5"
                className="animate-[shieldPulse_2.8s_ease-in-out_infinite]"
              />

              <path
                d="M60 24 L91 36 V62 C91 84 77 101 60 112 C43 101 29 84 29 62 V36 Z"
                fill="none"
                stroke="rgba(34,211,238,0.2)"
                strokeWidth="1"
              />

              <path
                d="M43 69 L54 80 L78 53"
                fill="none"
                stroke="rgba(103,232,249,0.8)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[checkDraw_2.5s_ease-in-out_infinite]"
              />
            </svg>

            <div className="absolute left-[-25%] top-[45%] h-px w-[150%] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent animate-[securityScan_2.4s_linear_infinite]" />
          </div>

          <div className="absolute left-[13%] top-[22%] rounded-md border border-cyan-300/10 bg-cyan-400/[0.035] px-2 py-1 font-mono text-[7px] text-cyan-200/50">
            THREAT / 0
          </div>

          <div className="absolute bottom-[18%] right-[12%] flex items-center gap-2 font-mono text-[7px] text-emerald-300/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
            PROTECTED
          </div>
        </div>
      )}

      {/* =====================================================
          NETWORK VISUAL
      ====================================================== */}

      {service.number === "03" && (
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 500 220"
            className="absolute inset-0 h-full w-full"
          >
            <path
              d="M95 75 L250 110 L405 72"
              fill="none"
              stroke="rgba(69,165,255,0.3)"
              strokeWidth="1"
            />

            <path
              d="M95 75 L150 170 L250 110 L350 165 L405 72"
              fill="none"
              stroke="rgba(34,211,238,0.18)"
              strokeWidth="1"
            />

            <path
              d="M150 170 L350 165"
              fill="none"
              stroke="rgba(69,165,255,0.18)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            <circle
              cx="95"
              cy="75"
              r="7"
              fill="rgba(69,165,255,0.12)"
              stroke="rgba(69,165,255,0.65)"
            />

            <circle
              cx="250"
              cy="110"
              r="9"
              fill="rgba(34,211,238,0.12)"
              stroke="rgba(34,211,238,0.75)"
            />

            <circle
              cx="405"
              cy="72"
              r="7"
              fill="rgba(69,165,255,0.12)"
              stroke="rgba(69,165,255,0.65)"
            />

            <circle
              cx="150"
              cy="170"
              r="6"
              fill="rgba(69,165,255,0.12)"
              stroke="rgba(69,165,255,0.5)"
            />

            <circle
              cx="350"
              cy="165"
              r="6"
              fill="rgba(34,211,238,0.12)"
              stroke="rgba(34,211,238,0.5)"
            />

            <circle
              r="4"
              fill="rgba(103,232,249,0.95)"
              className="network-packet network-packet-one"
            />

            <circle
              r="3"
              fill="rgba(96,165,250,0.9)"
              className="network-packet network-packet-two"
            />
          </svg>

          <div className="absolute left-4 top-4 font-mono text-[7px] uppercase tracking-[0.2em] text-blue-300/40">
            NETWORK TOPOLOGY
          </div>

          <div className="absolute bottom-4 right-4 rounded-md border border-blue-300/10 bg-blue-400/[0.035] px-2 py-1 font-mono text-[7px] text-blue-200/50">
            NODES / 05
          </div>
        </div>
      )}

      {/* =====================================================
          DATA ANALYTICS VISUAL
      ====================================================== */}

      {service.number === "04" && (
        <div className="absolute inset-0">
          <div className="absolute left-[13%] top-[25%] h-[58%] w-[74%] rounded-xl border border-violet-300/10 bg-violet-400/[0.025] p-4">
            <div className="absolute inset-x-4 top-4 h-px bg-white/[0.04]" />

            <div className="absolute inset-x-4 top-[38%] h-px bg-white/[0.035]" />

            <div className="absolute inset-x-4 top-[65%] h-px bg-white/[0.035]" />

            <div className="absolute bottom-4 left-4 right-4 flex h-[68%] items-end justify-between gap-2">
              <span className="analytics-bar h-[32%]" />
              <span className="analytics-bar h-[48%]" />
              <span className="analytics-bar h-[40%]" />
              <span className="analytics-bar h-[67%]" />
              <span className="analytics-bar h-[58%]" />
              <span className="analytics-bar h-[86%]" />
              <span className="analytics-bar h-[100%]" />
            </div>

            <svg
              viewBox="0 0 400 130"
              className="absolute inset-x-4 bottom-5 h-[62%] w-[calc(100%-2rem)] overflow-visible"
              preserveAspectRatio="none"
            >
              <path
                d="M0 110 C45 95, 70 105, 110 75 S180 95, 225 55 S300 68, 400 18"
                fill="none"
                stroke="rgba(167,139,250,0.75)"
                strokeWidth="2"
                className="analytics-line"
              />

              <circle
                cx="400"
                cy="18"
                r="4"
                fill="rgba(196,181,253,0.95)"
                className="animate-pulse"
              />
            </svg>
          </div>

          <div className="absolute right-[13%] top-[16%] rounded-md border border-violet-300/15 bg-violet-400/[0.04] px-3 py-1.5 font-mono text-[8px] text-violet-200/65">
            +24.8%
          </div>

          <div className="absolute bottom-[15%] left-[13%] font-mono text-[7px] tracking-[0.2em] text-violet-300/40">
            LIVE ANALYTICS
          </div>
        </div>
      )}

      {/* =====================================================
          DIGITAL MARKETING VISUAL
      ====================================================== */}

      {service.number === "05" && (
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 500 220"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="growthGradient" x1="0" x2="1">
                <stop offset="0%" stopColor="rgba(52,211,153,0)" />
                <stop offset="50%" stopColor="rgba(52,211,153,0.45)" />
                <stop offset="100%" stopColor="rgba(110,231,183,0.9)" />
              </linearGradient>
            </defs>

            <path
              d="M55 175 L130 145 L205 155 L285 105 L365 75 L445 35"
              fill="none"
              stroke="url(#growthGradient)"
              strokeWidth="2"
            />

            <path
              d="M55 175 L130 145 L205 155 L285 105 L365 75 L445 35"
              fill="none"
              stroke="rgba(52,211,153,0.2)"
              strokeWidth="10"
              className="marketing-glow-line"
            />

            {[55, 130, 205, 285, 365, 445].map((cx, index) => {
              const cy = [175, 145, 155, 105, 75, 35][index];

              return (
                <circle
                  key={cx}
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill="rgba(52,211,153,0.8)"
                  className="marketing-node"
                  style={{ animationDelay: `${index * 0.18}s` }}
                />
              );
            })}
          </svg>

          <div className="absolute left-[12%] top-[18%] rounded-md border border-emerald-300/10 bg-emerald-400/[0.035] px-2 py-1 font-mono text-[7px] text-emerald-200/50">
            CAMPAIGN / LIVE
          </div>

          <div className="absolute bottom-[17%] right-[11%] flex items-center gap-2 rounded-md border border-emerald-300/10 bg-emerald-400/[0.035] px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />

            <span className="font-mono text-[7px] text-emerald-200/60">
              GROWTH
            </span>
          </div>
        </div>
      )}

      {/* Central icon */}
      <div className="service-visual-icon absolute left-1/2 top-1/2 z-20 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border bg-[#07101a]/90 text-2xl backdrop-blur-xl">
        <span className="relative z-10">{service.icon}</span>

        <span
          aria-hidden="true"
          className="absolute inset-[-8px] rounded-2xl border border-white/[0.04] animate-[iconRing_3s_ease-in-out_infinite]"
        />
      </div>

      {/* Module */}
      <div className="absolute left-4 top-4 z-30">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-blue-400/70">
          MODULE / {service.visual}
        </span>
      </div>

      {/* Metric */}
      <div className="absolute right-4 top-4 z-30 rounded-md border border-white/[0.06] bg-black/30 px-2.5 py-1.5 backdrop-blur-sm">
        <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-slate-500">
          {service.metric}
        </span>
      </div>

      {/* Code */}
      <div className="absolute bottom-4 left-4 z-30 font-mono text-[8px] uppercase tracking-[0.16em] text-slate-600">
        {service.code}
      </div>

      {/* Status */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 font-mono text-[8px] text-blue-400/50">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
        STATUS::ONLINE
      </div>

      {/* Moving scan beam */}
      <div
        aria-hidden="true"
        className="service-beam absolute left-0 top-0 z-40 h-px w-1/2 bg-gradient-to-r from-transparent via-blue-400/80 to-transparent"
      />

      {/* HUD corners */}
      <span className="absolute left-3 top-3 z-40 h-4 w-4 border-l border-t border-blue-400/20" />
      <span className="absolute right-3 top-3 z-40 h-4 w-4 border-r border-t border-blue-400/20" />
      <span className="absolute bottom-3 left-3 z-40 h-4 w-4 border-b border-l border-blue-400/20" />
      <span className="absolute bottom-3 right-3 z-40 h-4 w-4 border-b border-r border-blue-400/20" />
    </div>
  );
}

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(services[0]);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const activeIndex = useMemo(
    () =>
      services.findIndex(
        (service) => service.number === activeService.number
      ),
    [activeService]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080d] text-white">
      {/* =====================================================
          GLOBAL TECHNOLOGY BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(22,135,255,0.18),transparent_38%),radial-gradient(circle_at_100%_70%,rgba(34,211,238,0.07),transparent_28%),radial-gradient(circle_at_0%_90%,rgba(59,130,246,0.06),transparent_30%),#05080d]" />

        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(69,165,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(69,165,255,0.045)_1px,transparent_1px)] [background-size:48px_48px] animate-[gridMove_25s_linear_infinite]" />

        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:12px_12px]" />

        <div className="absolute left-0 top-[-20%] h-[25%] w-full bg-gradient-to-b from-transparent via-blue-400/[0.04] to-transparent animate-[scanPage_10s_linear_infinite]" />

        <div className="absolute left-[-10%] top-[15%] h-96 w-96 rounded-full bg-blue-500/[0.065] blur-[110px] animate-[ambientFloat_12s_ease-in-out_infinite_alternate]" />

        <div className="absolute right-[-10%] top-[45%] h-96 w-96 rounded-full bg-cyan-400/[0.04] blur-[120px] animate-[ambientFloat_15s_ease-in-out_infinite_alternate-reverse]" />

        <div className="absolute left-[35%] top-[70%] h-80 w-80 rounded-full bg-indigo-500/[0.035] blur-[120px] animate-[ambientFloat_18s_ease-in-out_infinite_alternate]" />

        <div className="absolute left-0 top-[28%] h-px w-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-[dataFlow_8s_linear_infinite]" />

        <div className="absolute left-0 top-[70%] h-px w-full bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent animate-[dataFlowReverse_11s_linear_infinite]" />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-[8%] top-[24%] h-px w-[30%] rotate-[15deg] bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-blue-400/0" />

          <div className="absolute left-[38%] top-[35%] h-px w-[35%] rotate-[-12deg] bg-gradient-to-r from-cyan-300/0 via-cyan-300/30 to-cyan-300/0" />

          <div className="absolute left-[22%] top-[68%] h-px w-[38%] rotate-[10deg] bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0" />

          <div className="absolute left-[58%] top-[72%] h-px w-[30%] rotate-[-16deg] bg-gradient-to-r from-cyan-300/0 via-cyan-300/30 to-cyan-300/0" />
        </div>

        {networkNodes.map((node) => (
          <span
            key={`${node.left}-${node.top}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-blue-300/30 shadow-[0_0_12px_rgba(69,165,255,0.5)] animate-pulse"
            style={{
              left: node.left,
              top: node.top,
              animationDelay: node.delay,
            }}
          />
        ))}

        <div className="absolute inset-0 overflow-hidden opacity-[0.085]">
          {codeFragments.map((code, index) => (
            <span
              key={`${code}-${index}`}
              className="absolute top-[-20%] whitespace-pre font-mono text-[9px] leading-5 tracking-[0.15em] text-blue-300"
              style={{
                left: `${5 + index * 8}%`,
                animation: `codeFall ${
                  12 + (index % 5) * 2
                }s linear infinite`,
                animationDelay: `${index * -1.4}s`,
              }}
            >
              {`${code}
${code}
0101
${code}
0011
SYSTEM
${code}`}
            </span>
          ))}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(2,5,9,0.55)_100%)]" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="relative z-30 border-b border-white/[0.07] bg-[#05080d]/75 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[88px] max-w-screen-2xl items-center justify-between gap-6 px-5 py-4 sm:px-7 lg:px-10">
          <Link
            href="/"
            aria-label="VEXORA Home"
            className="group flex shrink-0 items-center"
          >
            <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025] px-2 py-1 transition duration-500 group-hover:border-blue-400/30 group-hover:bg-blue-500/[0.04] group-hover:shadow-[0_0_40px_rgba(22,135,255,0.14)]">
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <Image
                src="/vexora-logo.png"
                alt="VEXORA Technology"
                width={190}
                height={70}
                priority
                className="relative z-10 h-auto max-h-[66px] w-auto max-w-[190px] object-contain transition duration-500 group-hover:brightness-125"
              />
            </div>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="h-px w-8 bg-blue-400/30" />

            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">
              VXR / TECHNOLOGY PLATFORM
            </span>

            <span className="h-px w-8 bg-blue-400/30" />
          </div>

          <nav className="flex items-center gap-4 text-xs text-slate-400 sm:gap-7 sm:text-sm">
            <Link href="/" className="transition hover:text-blue-300">
              Home
            </Link>

            <Link href="/services" className="text-blue-300">
              Services
            </Link>

            <Link href="/#about" className="transition hover:text-blue-300">
              About
            </Link>

            <Link href="/#contact" className="transition hover:text-blue-300">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto grid max-w-screen-2xl gap-12 px-5 py-20 sm:px-7 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-emerald-400/15 bg-emerald-400/[0.035] px-4 py-2 shadow-[0_0_30px_rgba(52,211,153,0.04)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              </span>

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-300/80">
                Technology Systems Online
              </span>

              {time && (
                <span className="hidden border-l border-white/10 pl-3 font-mono text-[9px] text-slate-600 sm:block">
                  {time}
                </span>
              )}
            </div>

            <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
              VEXORA / WHAT WE DO
            </p>

            <h1 className="max-w-5xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
              Technology that
              <span className="block bg-gradient-to-r from-blue-300 via-white to-cyan-300 bg-clip-text text-transparent animate-[gradientShift_7s_ease_infinite]">
                moves your business forward.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
              From software development to digital strategy, VEXORA brings
              technology and practical thinking together to help your business
              move forward with better systems, stronger infrastructure, and
              smarter digital solutions.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#contact"
                className="group relative inline-flex w-fit items-center justify-center overflow-hidden rounded-xl bg-[#1687ff] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(22,135,255,0.18)] transition duration-300 hover:bg-[#45a5ff] hover:shadow-[0_0_50px_rgba(22,135,255,0.3)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative">Discuss Your Project</span>

                <span
                  aria-hidden="true"
                  className="relative ml-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  ↗
                </span>
              </Link>

              <a
                href="#services"
                className="group inline-flex w-fit items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-slate-300 transition duration-300 hover:border-blue-400/25 hover:bg-blue-500/[0.04] hover:text-white"
              >
                Explore Services

                <span className="ml-2 text-blue-400/60 transition-transform duration-300 group-hover:translate-y-1">
                  ↓
                </span>
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 border-y border-white/[0.06] py-5">
              <div>
                <div className="font-mono text-xl text-white">05</div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-slate-600">
                  Core Services
                </div>
              </div>

              <div className="border-l border-white/[0.06] pl-5">
                <div className="font-mono text-xl text-white">24/7</div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-slate-600">
                  Digital Systems
                </div>
              </div>

              <div className="border-l border-white/[0.06] pl-5">
                <div className="font-mono text-xl text-blue-300">VXR</div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-slate-600">
                  Technology Core
                </div>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative aspect-square">
              <div className="absolute inset-[5%] rounded-full border border-blue-400/10 animate-[spin_25s_linear_infinite]" />

              <div className="absolute inset-[14%] rounded-full border border-dashed border-blue-300/10 animate-[spin_18s_linear_infinite_reverse]" />

              <div className="absolute inset-[23%] rounded-full border border-cyan-300/10 animate-[spin_14s_linear_infinite]" />

              <div className="absolute inset-[31%] rounded-full border border-blue-300/[0.07] animate-[spin_22s_linear_infinite_reverse]" />

              <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[70px] animate-pulse" />

              <div className="absolute left-1/2 top-[7%] h-[86%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-blue-400/[0.08] to-transparent" />

              <div className="absolute left-[7%] top-1/2 h-px w-[86%] -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-400/[0.08] to-transparent" />

              <div className="group absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-white/10 bg-[#080d15]/90 p-8 shadow-[0_0_80px_rgba(22,135,255,0.15)] backdrop-blur-xl transition duration-700 hover:scale-105 hover:border-blue-400/25 hover:shadow-[0_0_100px_rgba(22,135,255,0.22)] sm:h-48 sm:w-48">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-400/[0.06] via-transparent to-cyan-300/[0.04]" />

                <Image
                  src="/vexora-logo.png"
                  alt="VEXORA Technology"
                  width={180}
                  height={180}
                  priority
                  className="relative z-10 h-full w-full object-contain transition duration-500 group-hover:brightness-125"
                />
              </div>

              <div className="absolute left-[7%] top-[30%] flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#080d15]/80 px-3 py-2 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-blue-400/25">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(69,165,255,0.8)]" />
                <span className="font-mono text-[8px] text-slate-500">
                  SOFTWARE
                </span>
              </div>

              <div className="absolute right-[4%] top-[24%] flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#080d15]/80 px-3 py-2 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-400/25">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <span className="font-mono text-[8px] text-slate-500">
                  SECURITY
                </span>
              </div>

              <div className="absolute bottom-[25%] left-[2%] flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#080d15]/80 px-3 py-2 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                <span className="font-mono text-[8px] text-slate-500">
                  DATA
                </span>
              </div>

              <div className="absolute bottom-[18%] right-[2%] flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#080d15]/80 px-3 py-2 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-violet-400/25">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                <span className="font-mono text-[8px] text-slate-500">
                  INFRASTRUCTURE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ====================================================== */}

      <section
        id="services"
        className="relative z-10 mx-auto max-w-screen-2xl px-5 py-20 sm:px-7 lg:px-10 lg:py-28"
      >
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-400">
              VEXORA / EXPERTISE
            </p>

            <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
              Technology services built around real business challenges.
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-500 lg:justify-self-end">
            Flexible technology services designed to solve real challenges,
            improve digital operations, and support your next stage of growth.
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((service) => {
            const isActive = activeService.number === service.number;

            return (
              <button
                key={service.number}
                type="button"
                onClick={() => setActiveService(service)}
                className={`group flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition duration-300 ${
                  isActive
                    ? "border-blue-400/30 bg-blue-500/[0.08] text-white shadow-[0_0_30px_rgba(22,135,255,0.08)]"
                    : "border-white/[0.07] bg-white/[0.02] text-slate-500 hover:border-white/15 hover:bg-white/[0.035] hover:text-slate-300"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border font-mono text-[10px] ${
                    isActive
                      ? "border-blue-400/25 bg-blue-400/[0.08] text-blue-300"
                      : "border-white/[0.06] text-slate-600"
                  }`}
                >
                  {service.number}
                </span>

                <span className="text-xs font-medium">
                  {service.title}
                </span>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_10px_rgba(69,165,255,0.9)] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Featured service */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080d15]/85 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative border-b border-white/[0.06] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-[90px]" />

              <div className="relative">
                <div className="mb-7 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-400">
                    ACTIVE MODULE / {activeService.number}
                  </span>

                  <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-emerald-300/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.8)]" />
                    Online
                  </span>
                </div>

                <h3 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                  {activeService.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-slate-400">
                  {activeService.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {activeService.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[10px] text-slate-400 transition duration-300 hover:border-blue-400/20 hover:bg-blue-500/[0.04] hover:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={activeService.href}
                  className="group mt-8 inline-flex items-center rounded-xl border border-blue-400/25 bg-blue-500/[0.06] px-5 py-3 text-xs font-semibold text-blue-300 transition duration-300 hover:border-blue-300/40 hover:bg-blue-500/[0.1] hover:shadow-[0_0_30px_rgba(22,135,255,0.08)]"
                >
                  Explore {activeService.title}

                  <span className="ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </Link>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8">
              <ServiceVisual service={activeService} />
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const isActive = activeService.number === service.number;

            return (
              <Link
                key={service.number}
                href={service.href}
                onMouseEnter={() => setActiveService(service)}
                aria-label={`Explore ${service.title}`}
                className={`group relative block overflow-hidden rounded-2xl border p-6 transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:p-7 ${
                  isActive
                    ? "border-blue-400/25 bg-blue-500/[0.045] shadow-[0_20px_70px_rgba(22,135,255,0.08)]"
                    : "border-white/[0.08] bg-white/[0.018] hover:-translate-y-1 hover:border-blue-400/25 hover:bg-white/[0.035] hover:shadow-[0_20px_70px_rgba(22,135,255,0.06)]"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/[0.07] blur-3xl opacity-0 transition duration-500 group-hover:opacity-100"
                />

                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-transparent via-blue-400/70 to-transparent transition-all duration-700 group-hover:w-full"
                />

                <div className="relative">
                  <div className="mb-8 flex items-center justify-between">
                    <span
                      className={`font-mono text-[10px] tracking-[0.18em] ${
                        isActive ? "text-blue-300" : "text-blue-400/60"
                      }`}
                    >
                      {service.number}
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-sm text-slate-500 transition duration-300 group-hover:scale-110 group-hover:border-blue-400/20 group-hover:bg-blue-500/[0.06] group-hover:text-blue-300">
                      {service.icon}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-white">
                    {service.title}
                  </h3>

                  <p className="mt-4 min-h-[105px] text-sm leading-7 text-slate-500 transition-colors duration-300 group-hover:text-slate-400">
                    {service.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/[0.06] bg-black/10 px-2.5 py-1.5 text-[9px] text-slate-500 transition duration-300 group-hover:border-blue-400/[0.12]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">
                      {service.code}
                    </span>

                    <span className="text-xs text-slate-600 transition duration-300 group-hover:translate-x-1 group-hover:text-blue-300">
                      Explore ↗
                    </span>
                  </div>
                </div>

                {index === activeIndex && (
                  <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="relative z-10 border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-5 py-20 sm:px-7 sm:py-24 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-400">
              VEXORA / NEXT STEP
            </p>

            <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
              Have a project in mind?
              <span className="block text-slate-500">
                Let&apos;s find the right technology solution.
              </span>
            </h2>
          </div>

          <Link
            href="/#contact"
            className="group inline-flex w-fit shrink-0 items-center rounded-xl border border-blue-400/40 bg-blue-500/[0.06] px-7 py-4 text-sm font-semibold text-blue-200 transition duration-300 hover:border-blue-300/60 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_40px_rgba(22,135,255,0.2)]"
          >
            Contact VEXORA

            <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-10 border-t border-white/[0.07] bg-[#04070b]/80">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-5 px-5 py-8 sm:px-7 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.025] p-1">
              <Image
                src="/vexora-logo.png"
                alt="VEXORA"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>

            <div>
              <div className="text-xs font-semibold tracking-[0.2em] text-slate-300">
                VEXORA
              </div>

              <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-slate-600">
                Technology Solutions
              </div>
            </div>
          </div>

          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-700">
            © 2026 VEXORA / ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </footer>

      {/* =====================================================
          PAGE LOCAL ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes gridMove {
          0% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(24px, 24px, 0);
          }

          100% {
            transform: translate3d(48px, 48px, 0);
          }
        }

        @keyframes scanPage {
          0% {
            transform: translateY(-20%);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          70% {
            opacity: 0.8;
          }

          100% {
            transform: translateY(520%);
            opacity: 0;
          }
        }

        @keyframes ambientFloat {
          0% {
            transform: translate3d(-10px, -10px, 0) scale(1);
          }

          50% {
            transform: translate3d(20px, 15px, 0) scale(1.06);
          }

          100% {
            transform: translate3d(-5px, 25px, 0) scale(0.98);
          }
        }

        @keyframes dataFlow {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(200%);
          }
        }

        @keyframes dataFlowReverse {
          0% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(-200%);
          }
        }

        @keyframes codeFall {
          0% {
            transform: translateY(-30%);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          80% {
            opacity: 0.8;
          }

          100% {
            transform: translateY(145vh);
            opacity: 0;
          }
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes serviceBeam {
          0% {
            transform: translateX(-130%);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateX(280%);
            opacity: 0;
          }
        }

        @keyframes cursorBlink {
          0%,
          45% {
            opacity: 1;
          }

          46%,
          100% {
            opacity: 0;
          }
        }

        @keyframes iconRing {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.25;
          }

          50% {
            transform: scale(1.08);
            opacity: 0.8;
          }
        }

        @keyframes securityScan {
          0% {
            transform: translateY(-55px);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateY(55px);
            opacity: 0;
          }
        }

        @keyframes shieldPulse {
          0%,
          100% {
            opacity: 0.65;
            filter: drop-shadow(0 0 5px rgba(34, 211, 238, 0.1));
          }

          50% {
            opacity: 1;
            filter: drop-shadow(0 0 16px rgba(34, 211, 238, 0.35));
          }
        }

        @keyframes checkDraw {
          0%,
          100% {
            opacity: 0.35;
            stroke-dasharray: 0 100;
          }

          45% {
            opacity: 1;
            stroke-dasharray: 100 0;
          }

          70% {
            opacity: 1;
          }
        }

        @keyframes networkPacketOne {
          0% {
            transform: translate(95px, 75px);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          45% {
            transform: translate(250px, 110px);
          }

          80% {
            transform: translate(405px, 72px);
          }

          100% {
            transform: translate(405px, 72px);
            opacity: 0;
          }
        }

        @keyframes networkPacketTwo {
          0% {
            transform: translate(150px, 170px);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          50% {
            transform: translate(250px, 110px);
          }

          85% {
            transform: translate(350px, 165px);
          }

          100% {
            transform: translate(350px, 165px);
            opacity: 0;
          }
        }

        .network-packet-one {
          animation: networkPacketOne 3.5s linear infinite;
        }

        .network-packet-two {
          animation: networkPacketTwo 4.2s linear infinite;
          animation-delay: 1s;
        }

        .analytics-bar {
          display: block;
          width: 9%;
          min-height: 8px;
          border-radius: 5px 5px 2px 2px;
          background: linear-gradient(
            to top,
            rgba(139, 92, 246, 0.12),
            rgba(196, 181, 253, 0.55)
          );
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.08);
          transform-origin: bottom;
          animation: analyticsBars 2.6s ease-in-out infinite alternate;
        }

        .analytics-bar:nth-child(2) {
          animation-delay: 0.2s;
        }

        .analytics-bar:nth-child(3) {
          animation-delay: 0.4s;
        }

        .analytics-bar:nth-child(4) {
          animation-delay: 0.6s;
        }

        .analytics-bar:nth-child(5) {
          animation-delay: 0.8s;
        }

        .analytics-bar:nth-child(6) {
          animation-delay: 1s;
        }

        .analytics-bar:nth-child(7) {
          animation-delay: 1.2s;
        }

        @keyframes analyticsBars {
          from {
            transform: scaleY(0.72);
            opacity: 0.45;
          }

          to {
            transform: scaleY(1);
            opacity: 0.95;
          }
        }

        .analytics-line {
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
          animation: analyticsLine 4s ease-in-out infinite;
        }

        @keyframes analyticsLine {
          0% {
            stroke-dashoffset: 800;
            opacity: 0.25;
          }

          30% {
            opacity: 1;
          }

          70%,
          100% {
            stroke-dashoffset: 0;
            opacity: 0.8;
          }
        }

        .marketing-glow-line {
          stroke-dasharray: 12 12;
          animation: marketingFlow 2.2s linear infinite;
        }

        @keyframes marketingFlow {
          to {
            stroke-dashoffset: -48;
          }
        }

        .marketing-node {
          animation: marketingNode 2.4s ease-in-out infinite;
        }

        @keyframes marketingNode {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.85);
          }

          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        .service-beam {
          animation: serviceBeam 4.5s linear infinite;
        }

        .service-visual {
          isolation: isolate;
        }

        .service-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              transparent 0%,
              rgba(255, 255, 255, 0.018) 50%,
              transparent 100%
            );
          opacity: 0.7;
        }

        .service-visual-icon {
          border-color: rgba(69, 165, 255, 0.28);
          color: rgb(147 197 253);
          box-shadow:
            0 0 45px rgba(22, 135, 255, 0.16),
            inset 0 0 30px rgba(22, 135, 255, 0.04);
          transition:
            transform 500ms ease,
            box-shadow 500ms ease,
            border-color 500ms ease;
        }

        .service-visual:hover .service-visual-icon {
          transform:
            translate(-50%, -50%)
            scale(1.08)
            rotate(3deg);

          border-color: rgba(69, 165, 255, 0.45);

          box-shadow:
            0 0 60px rgba(22, 135, 255, 0.24),
            inset 0 0 35px rgba(22, 135, 255, 0.07);
        }

        .service-visual-glow {
          background: rgba(22, 135, 255, 0.11);
          animation: ambientFloat 7s ease-in-out infinite alternate;
        }

        .service-visual-security .service-visual-glow {
          background: rgba(34, 211, 238, 0.1);
        }

        .service-visual-network .service-visual-glow {
          background: rgba(69, 165, 255, 0.1);
        }

        .service-visual-data .service-visual-glow {
          background: rgba(139, 92, 246, 0.11);
        }

        .service-visual-marketing .service-visual-glow {
          background: rgba(52, 211, 153, 0.1);
        }

        .service-visual-security .service-visual-icon {
          border-color: rgba(34, 211, 238, 0.28);
          color: rgb(103 232 249);
        }

        .service-visual-network .service-visual-icon {
          border-color: rgba(69, 165, 255, 0.3);
          color: rgb(147 197 253);
        }

        .service-visual-data .service-visual-icon {
          border-color: rgba(139, 92, 246, 0.3);
          color: rgb(196 181 253);
        }

        .service-visual-marketing .service-visual-icon {
          border-color: rgba(52, 211, 153, 0.3);
          color: rgb(110 231 183);
        }

        @media (max-width: 640px) {
          .service-visual {
            height: 210px;
          }

          .service-visual-icon {
            width: 62px;
            height: 62px;
            font-size: 1.25rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}