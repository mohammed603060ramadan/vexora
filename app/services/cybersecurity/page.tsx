import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Security Assessment",
    description:
      "Evaluate your systems, applications, and infrastructure to identify security weaknesses and understand your current security posture.",
    code: "SEC.ASSESS",
    type: "assessment",
  },
  {
    number: "02",
    title: "Vulnerability Assessment",
    description:
      "Identify and prioritize technical vulnerabilities so your team can focus on the risks that matter most.",
    code: "VULN.SCAN",
    type: "vulnerability",
  },
  {
    number: "03",
    title: "Network Security",
    description:
      "Review network architecture, access controls, and security configurations to help protect your business environment.",
    code: "NET.SEC",
    type: "network",
  },
  {
    number: "04",
    title: "Web Application Security",
    description:
      "Assess web applications for common security weaknesses and recommend practical measures to reduce exposure.",
    code: "APP.SEC",
    type: "application",
  },
  {
    number: "05",
    title: "Security Hardening",
    description:
      "Improve system configurations, access permissions, and security practices to reduce avoidable risks.",
    code: "SYS.HARDEN",
    type: "hardening",
  },
  {
    number: "06",
    title: "Security Consulting",
    description:
      "Get clear, practical guidance on security priorities, risk management, and improvements suited to your business.",
    code: "SEC.CONSULT",
    type: "consulting",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We discuss your environment, business objectives, systems, and authorized assessment scope.",
  },
  {
    number: "02",
    title: "Assess",
    description:
      "We review the agreed systems and identify potential weaknesses and security risks.",
  },
  {
    number: "03",
    title: "Prioritize",
    description:
      "We organize findings by risk and provide recommendations based on business impact.",
  },
  {
    number: "04",
    title: "Improve",
    description:
      "We help you plan remediation and strengthen your security posture through practical next steps.",
  },
];

function CyberVisual() {
  return (
    <div className="relative h-[430px] w-full overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[#06101b] shadow-[0_0_100px_rgba(0,153,255,0.12)] sm:h-[520px]">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(55,170,255,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(55,170,255,.10) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Moving grid */}
      <div
        className="absolute inset-0 opacity-20 animate-[gridMove_18s_linear_infinite]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      {/* Blue atmosphere */}
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#087eff]/15 blur-[90px]" />

      {/* Scan */}
      <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#39b9ff] to-transparent shadow-[0_0_18px_#39b9ff] animate-[scan_5s_linear_infinite]" />

      {/* Header */}
      <div className="absolute left-7 right-7 top-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] text-cyan-300/60">
            VEXORA / SECURITY
          </p>
          <p className="mt-1 font-mono text-[8px] text-gray-600">
            ILLUSTRATIVE SECURITY CONCEPT
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          <span className="font-mono text-[8px] tracking-wider text-emerald-300">
            CONCEPT
          </span>
        </div>
      </div>

      {/* Central shield */}
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full border border-cyan-300/10 animate-[pulseRing_4s_ease-in-out_infinite]" />

        <div className="absolute inset-6 rounded-full border border-cyan-300/20 border-dashed animate-[rotateRing_20s_linear_infinite]" />

        <div className="absolute inset-14 rounded-full border border-blue-400/20 animate-[rotateRingReverse_14s_linear_infinite]" />

        <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-[#071625]/95 shadow-[0_0_50px_rgba(0,174,255,0.18)]">
          <div className="absolute inset-3 rounded-[1.5rem] border border-white/5" />

          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="h-16 w-16 text-cyan-300 drop-shadow-[0_0_15px_rgba(45,190,255,.7)]"
            aria-hidden="true"
          >
            <path
              d="M32 6L51 14V28C51 40.5 43.5 51.2 32 57C20.5 51.2 13 40.5 13 28V14L32 6Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M23 31L29 37L42 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Orbit points */}
      <div className="absolute left-[18%] top-[30%] animate-[floatNode_4s_ease-in-out_infinite]">
        <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_15px_#45a5ff]" />
        <span className="absolute left-4 top-[-3px] whitespace-nowrap font-mono text-[7px] text-blue-300/50">
          NODE_01
        </span>
      </div>

      <div className="absolute right-[17%] top-[36%] animate-[floatNode_5s_ease-in-out_infinite_reverse]">
        <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_15px_#67e8f9]" />
        <span className="absolute right-4 top-[-3px] whitespace-nowrap font-mono text-[7px] text-cyan-300/50">
          NODE_02
        </span>
      </div>

      <div className="absolute bottom-[28%] left-[23%] animate-[floatNode_4.5s_ease-in-out_infinite_reverse]">
        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]" />
      </div>

      <div className="absolute bottom-[25%] right-[23%] animate-[floatNode_5s_ease-in-out_infinite]">
        <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_15px_#45a5ff]" />
      </div>

      {/* Connection lines */}
      <div className="absolute left-[20%] top-[32%] h-px w-[23%] rotate-[18deg] bg-gradient-to-r from-blue-400/60 to-transparent" />

      <div className="absolute right-[20%] top-[38%] h-px w-[22%] -rotate-[20deg] bg-gradient-to-l from-cyan-300/60 to-transparent" />

      <div className="absolute bottom-[30%] left-[25%] h-px w-[22%] -rotate-[18deg] bg-gradient-to-r from-emerald-400/40 to-transparent" />

      {/* Bottom telemetry */}
      <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-white/5 bg-black/30 p-3 backdrop-blur-md">
          <p className="font-mono text-[7px] tracking-widest text-gray-600">
            THREAT VISIBILITY
          </p>
          <p className="mt-1 text-[10px] text-emerald-300">ILLUSTRATIVE</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-black/30 p-3 backdrop-blur-md">
          <p className="font-mono text-[7px] tracking-widest text-gray-600">
            NETWORK
          </p>
          <p className="mt-1 text-[10px] text-cyan-300">PROTECTION</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-black/30 p-3 backdrop-blur-md">
          <p className="font-mono text-[7px] tracking-widest text-gray-600">
            SYSTEM
          </p>
          <p className="mt-1 text-[10px] text-blue-300">RESILIENCE</p>
        </div>
      </div>

      {/* Side telemetry */}
      <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
        <span className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-300/50 to-transparent" />
        <span className="font-mono text-[7px] tracking-widest text-gray-600 [writing-mode:vertical-rl]">
          ENCRYPTED CHANNEL
        </span>
        <span className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-300/50 to-transparent" />
      </div>
    </div>
  );
}

function CapabilityVisual({
  type,
}: {
  type: string;
}) {
  if (type === "network") {
    return (
      <div className="relative mt-7 h-16 overflow-hidden rounded-xl border border-white/5 bg-black/20">
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_15px_#45a5ff]" />

        <span className="absolute left-[20%] top-[25%] h-2 w-2 rounded-full bg-cyan-300" />
        <span className="absolute right-[20%] top-[25%] h-2 w-2 rounded-full bg-cyan-300" />
        <span className="absolute left-[20%] bottom-[25%] h-2 w-2 rounded-full bg-cyan-300" />
        <span className="absolute right-[20%] bottom-[25%] h-2 w-2 rounded-full bg-cyan-300" />

        <span className="absolute left-[23%] top-[29%] h-px w-[26%] rotate-[15deg] bg-cyan-300/40" />
        <span className="absolute right-[23%] top-[29%] h-px w-[26%] -rotate-[15deg] bg-cyan-300/40" />
        <span className="absolute left-[23%] bottom-[29%] h-px w-[26%] -rotate-[15deg] bg-cyan-300/40" />
        <span className="absolute right-[23%] bottom-[29%] h-px w-[26%] rotate-[15deg] bg-cyan-300/40" />
      </div>
    );
  }

  if (type === "application") {
    return (
      <div className="mt-7 rounded-xl border border-white/5 bg-black/20 p-3 font-mono text-[8px] leading-4 text-cyan-300/60">
        <div>
          <span className="text-blue-400">EXAMPLE</span> application request
        </div>
        <div>
          <span className="text-emerald-400">DEMO</span> response status
        </div>
        <div>
          <span className="text-violet-300">AUTH</span> control example
        </div>
      </div>
    );
  }

  if (type === "vulnerability") {
    return (
      <div className="mt-7 flex h-16 items-end gap-1.5 rounded-xl border border-white/5 bg-black/20 px-4 pb-3">
        {[35, 50, 28, 70, 45, 85, 55, 42, 65, 32, 78, 48].map(
          (height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-500/20 to-cyan-300/70 animate-[barPulse_2s_ease-in-out_infinite]"
              style={{
                height: `${height}%`,
                animationDelay: `${index * 0.12}s`,
              }}
            />
          ),
        )}
      </div>
    );
  }

  if (type === "hardening") {
    return (
      <div className="mt-7 flex h-16 items-center gap-2 rounded-xl border border-white/5 bg-black/20 px-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-2 flex-1 overflow-hidden rounded-full bg-white/5"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
              style={{ width: `${item * 18}%` }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === "consulting") {
    return (
      <div className="relative mt-7 h-16 overflow-hidden rounded-xl border border-white/5 bg-black/20">
        <div className="absolute inset-x-3 bottom-3 h-px bg-white/10" />
        <div className="absolute inset-x-3 bottom-3 h-10">
          <svg
            viewBox="0 0 300 50"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M0 42 C30 40 38 25 62 29 C88 34 91 15 120 21 C145 26 153 8 178 14 C203 20 218 7 241 10 C263 13 274 4 300 5"
              fill="none"
              stroke="rgba(69,165,255,.8)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-7 flex h-16 items-center justify-center rounded-xl border border-white/5 bg-black/20">
      <div className="relative h-9 w-9 rounded-full border border-blue-400/40">
        <div className="absolute inset-2 rounded-full border border-cyan-300/50" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
      </div>
    </div>
  );
}

export default function CybersecurityPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03070c] text-white">
      {/* =========================================================
          GLOBAL BACKGROUND
      ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Main grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(50,160,255,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(50,160,255,.10) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Moving data columns */}
        <div className="absolute left-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-[dataLine_7s_linear_infinite]" />

        <div className="absolute left-[32%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent animate-[dataLine_10s_linear_infinite_reverse]" />

        <div className="absolute right-[24%] top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-400/10 to-transparent animate-[dataLine_8s_linear_infinite]" />

        <div className="absolute right-[7%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent animate-[dataLine_12s_linear_infinite_reverse]" />

        {/* Atmospheric lights */}
        <div className="absolute left-[-15%] top-[-15%] h-[700px] w-[700px] rounded-full bg-blue-600/[0.08] blur-[150px] animate-[ambient_12s_ease-in-out_infinite_alternate]" />

        <div className="absolute right-[-15%] top-[15%] h-[650px] w-[650px] rounded-full bg-cyan-500/[0.055] blur-[150px] animate-[ambient_15s_ease-in-out_infinite_alternate_reverse]" />

        <div className="absolute bottom-[-20%] left-[25%] h-[600px] w-[600px] rounded-full bg-indigo-600/[0.035] blur-[160px]" />

        {/* Scan overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/[0.015] to-transparent bg-[length:100%_9px]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(1,4,8,.75)_100%)]" />
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="relative z-30 border-b border-white/[0.07] bg-[#03070c]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-5">
          <Link
            href="/"
            aria-label="VEXORA Home"
            className="group relative shrink-0"
          >
            <div className="absolute -inset-4 rounded-2xl bg-blue-500/10 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={190}
              height={70}
              priority
              className="relative h-auto w-32 transition duration-300 group-hover:brightness-125 sm:w-40"
            />
          </Link>

          <nav className="flex items-center gap-3 text-xs text-gray-400 sm:gap-8 sm:text-sm">
            <Link
              href="/"
              className="transition duration-300 hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="relative py-2 text-white"
            >
              Services
              <span className="absolute bottom-0 left-0 h-px w-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
            </Link>

            <Link
              href="/about"
              className="transition duration-300 hover:text-white"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-white/10 px-4 py-2 transition duration-300 hover:border-cyan-300/40 hover:bg-cyan-300/5 hover:text-cyan-300"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative z-10 px-6 pb-28 pt-16 sm:pb-36 sm:pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-xs text-gray-500 transition duration-300 hover:border-cyan-300/30 hover:text-cyan-300"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              Back to Services
            </Link>

            <div className="mt-9 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />

              <span className="font-mono text-[10px] font-semibold tracking-[0.3em] text-cyan-300">
                CYBERSECURITY
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[5.6rem]">
              Protect your business.
              <span className="mt-2 block bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                Strengthen your security.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg sm:leading-9">
              Identify security risks, improve protection, and make informed
              decisions with practical cybersecurity services designed around
              your business, systems, and priorities.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-xl border border-blue-400/30 bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-sm font-semibold shadow-[0_0_35px_rgba(22,135,255,.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(22,135,255,.3)]"
              >
                Discuss Your Security Needs
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </Link>

              <a
                href="#capabilities"
                className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-6 py-4 text-sm font-semibold text-gray-300 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:text-cyan-300"
              >
                Explore Our Services
                <span>↓</span>
              </a>
            </div>

            {/* Status bar */}
            <div className="mt-12 grid max-w-2xl grid-cols-2 border-y border-white/[0.07] sm:grid-cols-4">
              <div className="border-r border-white/[0.07] py-4 pr-4">
                <p className="font-mono text-[8px] tracking-[0.2em] text-gray-600">
                  SECURITY
                </p>
                <p className="mt-1 text-xs text-gray-300">ASSESSMENT</p>
              </div>

              <div className="border-r border-white/[0.07] px-4 py-4">
                <p className="font-mono text-[8px] tracking-[0.2em] text-gray-600">
                  NETWORK
                </p>
                <p className="mt-1 text-xs text-gray-300">PROTECTION</p>
              </div>

              <div className="border-r border-white/[0.07] px-4 py-4">
                <p className="font-mono text-[8px] tracking-[0.2em] text-gray-600">
                  APPLICATION
                </p>
                <p className="mt-1 text-xs text-gray-300">SECURITY</p>
              </div>

              <div className="py-4 pl-4">
                <p className="font-mono text-[8px] tracking-[0.2em] text-gray-600">
                  CONSULTING
                </p>
                <p className="mt-1 text-xs text-gray-300">STRATEGY</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <CyberVisual />
          </div>
        </div>
      </section>

      {/* =========================================================
          CAPABILITIES
      ========================================================= */}

      <section
        id="capabilities"
        className="relative z-10 scroll-mt-10 border-y border-white/[0.07] bg-[#050b13]/80 py-24 backdrop-blur-xl lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-blue-400" />

              <span className="font-mono text-[10px] tracking-[0.3em] text-blue-300">
                OUR EXPERTISE
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Security built around
              <span className="block bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                your risks.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl leading-8 text-gray-400">
              Every business faces different technology risks. We help you
              understand your exposure and identify practical ways to improve
              protection and resilience.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                key={capability.number}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#08111c]/75 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-[#0a1624]"
              >
                {/* Glow */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

                {/* Top */}
                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-blue-300">
                    {capability.number}
                  </span>

                  <span className="font-mono text-[8px] tracking-[0.18em] text-gray-600">
                    {capability.code}
                  </span>
                </div>

                {/* Icon */}
                <div className="relative mt-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/[0.06]">
                  <div className="absolute inset-2 rounded-xl border border-blue-400/10 transition duration-500 group-hover:rotate-45 group-hover:border-blue-400/30" />

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="relative h-6 w-6 text-blue-300 transition duration-500 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3L19 6V11C19 15.5 16.3 19.3 12 21C7.7 19.3 5 15.5 5 11V6L12 3Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M9.5 12L11.3 13.8L14.8 10.3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h3 className="relative mt-7 text-xl font-semibold tracking-tight">
                  {capability.title}
                </h3>

                <p className="relative mt-4 text-sm leading-7 text-gray-400">
                  {capability.description}
                </p>

                <CapabilityVisual type={capability.type} />

                <div className="relative mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="flex items-center gap-2 font-mono text-[8px] tracking-[0.2em] text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    SERVICE OFFERING
                  </span>

                  <span className="text-sm text-gray-600 transition duration-300 group-hover:translate-x-1 group-hover:text-blue-300">
                    ↗
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-blue-500 via-cyan-300 to-transparent transition-all duration-700 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PROCESS
      ========================================================= */}

      <section className="relative z-10 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-cyan-300" />

                <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-300">
                  HOW WE WORK
                </span>
              </div>

              <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
                From questions
                <span className="block text-gray-500">
                  to clear action.
                </span>
              </h2>

              <p className="mt-6 leading-8 text-gray-400">
                A structured process helps keep security work focused,
                understandable, and aligned with your business priorities.
              </p>

              <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />

                  <span className="font-mono text-[9px] tracking-[0.2em] text-emerald-300">
                    ENGAGEMENT WORKFLOW
                  </span>
                </div>

              </div>
            </div>

            <div className="relative">
              {/* vertical line */}
              <div className="absolute bottom-8 left-7 top-8 w-px bg-gradient-to-b from-blue-400/40 via-cyan-300/20 to-transparent sm:left-8" />

              <div className="space-y-5">
                {processSteps.map((step) => (
                  <div
                    key={step.number}
                    className="group relative flex gap-5 rounded-2xl border border-white/[0.07] bg-[#07101a]/70 p-5 backdrop-blur-xl transition duration-500 hover:-translate-x-1 hover:border-cyan-300/25 sm:gap-7 sm:p-7"
                  >
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/25 bg-[#081522] font-mono text-xs text-blue-300 shadow-[0_0_25px_rgba(22,135,255,.08)] sm:h-16 sm:w-16">
                      {step.number}
                    </div>

                    <div className="pt-1">
                      <p className="font-mono text-[8px] tracking-[0.25em] text-gray-600">
                        SECURITY PROCESS
                      </p>

                      <h3 className="mt-2 text-xl font-semibold">
                        {step.title}
                      </h3>

                      <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                        {step.description}
                      </p>
                    </div>

                    <span className="absolute right-5 top-5 text-gray-700 transition duration-300 group-hover:text-cyan-300">
                      ↗
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside aria-labelledby="ethical-security-heading" className="mt-10 rounded-2xl border border-cyan-300/15 bg-gradient-to-r from-cyan-300/[0.06] to-blue-500/[0.025] p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] font-mono text-sm text-cyan-300">01</span>
              <div>
                <p className="font-mono text-[9px] tracking-[0.25em] text-cyan-300">ETHICAL SECURITY PRACTICE</p>
                <h3 id="ethical-security-heading" className="mt-2 text-lg font-semibold text-white">Authorized, agreed, and clearly scoped.</h3>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-400">
                  Security assessments are performed only on systems and assets that the client owns or is explicitly authorized to have assessed. Scope, objectives, and deliverables are agreed upon before work begins.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="relative z-10 px-6 pb-24 lg:pb-32">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-blue-400/15 bg-[#07111d] p-8 shadow-[0_30px_100px_rgba(0,0,0,.4)] sm:p-12 lg:p-16">
          {/* CTA background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(69,165,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(69,165,255,.15) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />

          <div className="absolute right-[-120px] top-[-120px] h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />

          <div className="relative max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />

              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-300">
                SECURE YOUR NEXT STEP
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Let&apos;s talk about your
              <span className="block bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                security priorities.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl leading-8 text-gray-400">
              Tell us about your systems, concerns, and goals. We can discuss
              your requirements and identify a practical starting point.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 text-sm font-semibold shadow-[0_0_35px_rgba(22,135,255,.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(22,135,255,.3)]"
              >
                Contact VEXORA
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-7 py-4 text-sm font-semibold text-gray-300 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:text-cyan-300"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="relative z-10 border-t border-white/[0.07] bg-[#02050a]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-9 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 VEXORA. All rights reserved.</p>

          <p className="font-mono text-[9px] tracking-[0.18em]">
            SOFTWARE · SECURITY · DATA · NETWORKS · DIGITAL
          </p>

          <Link
            href="/"
            className="transition duration-300 hover:text-cyan-300"
          >
            Back to Home ↑
          </Link>
        </div>
      </footer>

      {/* =========================================================
          ANIMATIONS
      ========================================================= */}

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes gridMove {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(42px, 42px, 0);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          50% {
            opacity: 0.8;
          }

          90% {
            opacity: 1;
          }

          100% {
            transform: translateY(520px);
            opacity: 0;
          }
        }

        @keyframes pulseRing {
          0%,
          100% {
            transform: scale(0.94);
            opacity: 0.3;
          }

          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes rotateRing {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateRingReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes floatNode {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes barPulse {
          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes dataLine {
          0% {
            transform: translateY(-30%);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateY(30%);
            opacity: 0;
          }
        }

        @keyframes ambient {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          100% {
            transform: translate3d(60px, 30px, 0) scale(1.1);
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