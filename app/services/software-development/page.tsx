/* eslint-disable react/jsx-no-comment-textnodes */
import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Responsive, modern websites designed to present your business professionally and turn visitors into potential customers.",
    code: "WEB//01",
  },
  {
    number: "02",
    title: "Web Applications",
    description:
      "Interactive web applications that help your team manage workflows, serve customers, and simplify daily operations.",
    code: "APP//02",
  },
  {
    number: "03",
    title: "Custom Software",
    description:
      "Software solutions tailored to your business processes, requirements, and long-term growth.",
    code: "SYS//03",
  },
  {
    number: "04",
    title: "System Integration",
    description:
      "Connect your tools and platforms to improve information flow and reduce repetitive work.",
    code: "INT//04",
  },
  {
    number: "05",
    title: "Maintenance & Support",
    description:
      "Ongoing technical support and improvements to help your digital products remain reliable and up to date.",
    code: "OPS//05",
  },
  {
    number: "06",
    title: "UI/UX Implementation",
    description:
      "User-focused interfaces that make your digital products clear, accessible, and easy to use.",
    code: "UX//06",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We learn about your business, goals, users, and technical requirements.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "We define the scope, priorities, solution architecture, and delivery plan.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We develop and test your solution with a focus on quality and usability.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "We prepare your solution for launch and help you plan the next improvements.",
  },
];

function TechBackground() {
  const particles = Array.from({ length: 18 });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="software-base" />
      <div className="software-grid" />
      <div className="software-scanlines" />

      <div className="software-orb software-orb-one" />
      <div className="software-orb software-orb-two" />
      <div className="software-orb software-orb-three" />

      <div className="software-code software-code-left">
        <span>const</span> solution = VEXORA;
        <br />
        <span>if</span> (business.ready) {"{"}
        <br />
        &nbsp;&nbsp;build();
        <br />
        &nbsp;&nbsp;deploy();
        <br />
        {"}"}
      </div>

      <div className="software-code software-code-right">
        {"<system>"}
        <br />
        &nbsp;&nbsp;architecture: scalable
        <br />
        &nbsp;&nbsp;status: operational
        <br />
        &nbsp;&nbsp;security: enabled
        <br />
        {"</system>"}
      </div>

      {particles.map((_, index) => (
        <span
          key={index}
          className="software-particle"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 53) % 100}%`,
            animationDelay: `${(index % 7) * 0.7}s`,
            animationDuration: `${5 + (index % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}

function CodeVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="software-visual-glow" />

      <div className="software-terminal">
        <div className="software-terminal-top">
          <div className="flex items-center gap-2">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
          </div>

          <span className="text-[10px] font-medium tracking-[0.2em] text-white/35">
            VEXORA / DEVELOPMENT
          </span>

          <span className="text-[10px] text-[#45a5ff]">ONLINE</span>
        </div>

        <div className="software-terminal-body">
          <div className="software-terminal-line">
            <span className="text-white/25">01</span>
            <span className="text-[#45a5ff]">import</span>
            <span className="text-white/75">{"{ build }"}</span>
            <span className="text-white/35">from</span>
            <span className="text-[#72c7ff]">&quot;vexora&quot;</span>
          </div>

          <div className="software-terminal-line">
            <span className="text-white/25">02</span>
            <span className="text-[#45a5ff]">const</span>
            <span className="text-white/75">product</span>
            <span className="text-white/35">=</span>
            <span className="text-[#9bd7ff]">business.solution()</span>
          </div>

          <div className="software-terminal-line">
            <span className="text-white/25">03</span>
            <span className="text-white/30">
              // architecture designed for growth
            </span>
          </div>

          <div className="software-terminal-line">
            <span className="text-white/25">04</span>
            <span className="text-[#45a5ff]">await</span>
            <span className="text-white/75">build</span>
            <span className="text-white/40">(product)</span>
          </div>

          <div className="software-terminal-line">
            <span className="text-white/25">05</span>
            <span className="text-[#45a5ff]">return</span>
            <span className="text-[#8ee6bd]">production.ready</span>
          </div>

          <div className="software-progress">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
              <span className="text-white/40">Build Progress</span>
              <span className="text-[#45a5ff]">94%</span>
            </div>

            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="software-progress-bar h-full w-[94%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="software-floating-card software-floating-card-one">
        <span className="software-status-dot" />
        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">
            System
          </p>
          <p className="mt-1 text-xs font-semibold text-white">Operational</p>
        </div>
      </div>

      <div className="software-floating-card software-floating-card-two">
        <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">
          Performance
        </p>
        <p className="mt-1 text-lg font-semibold text-[#45a5ff]">98.7%</p>
      </div>
    </div>
  );
}

export default function SoftwareDevelopmentPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080d] text-white">
      <TechBackground />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05080d]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              aria-label="VEXORA Home"
              className="group relative"
            >
              <div className="absolute inset-0 rounded-full bg-[#1687ff]/20 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

              <Image
                src="/vexora-logo.png"
                alt="VEXORA Technology"
                width={190}
                height={70}
                priority
                className="relative h-auto w-32 sm:w-40"
              />
            </Link>

            <nav className="hidden items-center gap-8 text-sm text-white/55 md:flex">
              <Link
                href="/"
                className="transition duration-300 hover:text-[#45a5ff]"
              >
                Home
              </Link>

              <Link
                href="/services"
                className="text-[#45a5ff] transition duration-300"
              >
                Services
              </Link>

              <Link
                href="/about"
                className="transition duration-300 hover:text-[#45a5ff]"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="transition duration-300 hover:text-[#45a5ff]"
              >
                Contact
              </Link>
            </nav>

            <Link
              href="/contact"
              className="rounded-full border border-[#1687ff]/40 bg-[#1687ff]/10 px-4 py-2 text-xs font-semibold text-[#8dccff] transition duration-300 hover:border-[#45a5ff] hover:bg-[#1687ff]/20"
            >
              Start a Project
            </Link>
          </div>
        </header>

        <section className="relative px-6 pb-28 pt-16 sm:pb-36 sm:pt-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/45 backdrop-blur-md transition hover:border-[#1687ff]/40 hover:text-[#45a5ff]"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>
                  All Services
                </Link>

                <div className="mt-10 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#1687ff]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
                    Software Development
                  </p>
                </div>

                <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-[5.25rem]">
                  Digital solutions
                  <span className="block bg-gradient-to-r from-white via-[#b8dcff] to-[#45a5ff] bg-clip-text text-transparent">
                    built around you.
                  </span>
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
                  From business websites to custom applications, VEXORA helps
                  organizations turn ideas into practical digital products
                  designed for usability, reliability, and growth.
                </p>

                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="software-primary-button inline-flex items-center rounded-full px-7 py-4 text-sm font-semibold"
                  >
                    Discuss Your Project
                    <span
                      className="ml-3 transition-transform duration-300"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>

                  <Link
                    href="/projects"
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] px-7 py-4 text-sm font-semibold text-white/75 backdrop-blur-md transition duration-300 hover:border-[#1687ff]/50 hover:text-[#45a5ff]"
                  >
                    View Our Projects
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap gap-7 border-t border-white/[0.08] pt-7">
                  <div>
                    <p className="text-lg font-semibold text-white">01</p>
                    <p className="mt-1 text-xs text-white/35">
                      Business focused
                    </p>
                  </div>

                  <div className="h-10 w-px bg-white/10" />

                  <div>
                    <p className="text-lg font-semibold text-white">02</p>
                    <p className="mt-1 text-xs text-white/35">Built to grow</p>
                  </div>

                  <div className="h-10 w-px bg-white/10" />

                  <div>
                    <p className="text-lg font-semibold text-white">03</p>
                    <p className="mt-1 text-xs text-white/35">
                      Quality driven
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <CodeVisual />
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-y border-white/[0.08] bg-[#07101b]/75 px-6 py-20 backdrop-blur-sm sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,135,255,0.12),transparent_45%)]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-5 md:grid-cols-3">
              <article className="software-feature-card">
                <div className="software-feature-number">01</div>

                <div>
                  <h2 className="text-lg font-semibold">Business-focused</h2>
                  <p className="mt-3 text-sm leading-7 text-white/45">
                    Solutions shaped around your actual goals and workflows.
                  </p>
                </div>
              </article>

              <article className="software-feature-card">
                <div className="software-feature-number">02</div>

                <div>
                  <h2 className="text-lg font-semibold">Built to grow</h2>
                  <p className="mt-3 text-sm leading-7 text-white/45">
                    Flexible foundations that can evolve as your business
                    changes.
                  </p>
                </div>
              </article>

              <article className="software-feature-card">
                <div className="software-feature-number">03</div>

                <div>
                  <h2 className="text-lg font-semibold">Quality-driven</h2>
                  <p className="mt-3 text-sm leading-7 text-white/45">
                    Careful implementation with usability and maintainability
                    in mind.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="relative px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[#1687ff]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#45a5ff]">
                    Our Capabilities
                  </p>
                </div>

                <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                  Software services for
                  <span className="text-[#45a5ff]"> real business needs.</span>
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-7 text-white/40 lg:justify-self-end">
                Whether you are launching a new idea or improving an existing
                system, we help you choose an appropriate technical solution.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((capability) => (
                <article
                  key={capability.number}
                  className="software-capability-card group"
                >
                  <div className="flex items-start justify-between">
                    <span className="software-capability-icon">
                      <span />
                      <span />
                      <span />
                    </span>

                    <span className="text-[10px] font-medium tracking-[0.2em] text-white/20 transition group-hover:text-[#45a5ff]/60">
                      {capability.code}
                    </span>
                  </div>

                  <div className="mt-9">
                    <p className="text-xs font-semibold tracking-[0.2em] text-[#45a5ff]">
                      {capability.number}
                    </p>

                    <h3 className="mt-4 text-xl font-semibold">
                      {capability.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-white/45">
                      {capability.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/25 transition group-hover:text-[#45a5ff]/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1687ff] shadow-[0_0_10px_rgba(22,135,255,0.9)]" />
                    Development Module
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-white/[0.08] bg-[#07101a]/80 px-6 py-28 backdrop-blur-sm sm:py-36">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#1687ff]/[0.06] blur-[120px]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mb-14 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#1687ff]" />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#45a5ff]">
                  How We Work
                </p>
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                From the first idea
                <span className="block text-white/45">to delivery.</span>
              </h2>

              <p className="mt-5 text-sm leading-8 text-white/40">
                A clear process helps us align expectations, prioritize the
                important work, and keep the project moving forward.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-0 right-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-[#1687ff]/50 to-transparent lg:block" />

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {processSteps.map((step, index) => (
                  <article key={step.number} className="relative pt-7">
                    <div className="absolute left-0 top-0 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#1687ff]/50 bg-[#07101a] shadow-[0_0_20px_rgba(22,135,255,0.18)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#45a5ff]" />
                    </div>

                    <p className="text-xs font-semibold tracking-[0.2em] text-[#45a5ff]">
                      {step.number}
                    </p>

                    <h3 className="mt-4 text-xl font-semibold">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/40">
                      {step.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/20">
                      <span>PHASE</span>
                      <span className="text-[#1687ff]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="software-cta relative overflow-hidden rounded-[2rem] border border-[#1687ff]/20 bg-[#081321]/90 p-8 shadow-[0_0_80px_rgba(22,135,255,0.08)] backdrop-blur-xl sm:p-12 lg:p-16">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1687ff]/15 blur-3xl" />
              <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#45a5ff]/10 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#45a5ff] shadow-[0_0_15px_rgba(69,165,255,0.9)]" />

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
                      Have a project in mind?
                    </p>
                  </div>

                  <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    Let&apos;s build something
                    <span className="text-[#45a5ff]"> useful together.</span>
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-8 text-white/40">
                    Tell us about your idea, your goals, and the challenge you
                    want to solve. We can discuss the right next step for your
                    business.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="software-primary-button inline-flex w-fit shrink-0 items-center rounded-full px-7 py-4 text-sm font-semibold"
                >
                  Contact VEXORA
                  <span
                    className="ml-3 transition-transform duration-300"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </div>

              <div className="relative mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/[0.08] pt-6 text-[9px] uppercase tracking-[0.18em] text-white/25">
                <span>VEXORA TECHNOLOGY</span>
                <span>SOFTWARE SYSTEMS</span>
                <span>DIGITAL PRODUCTS</span>
                <span>ENGINEERING</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/[0.08] bg-[#03060a]/80 px-6 py-8 text-center text-xs text-white/30">
          © 2026 VEXORA. All rights reserved.
        </footer>
      </div>

      <style>{`
        .software-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 15% 20%, rgba(22, 135, 255, 0.10), transparent 28%),
            radial-gradient(circle at 85% 30%, rgba(69, 165, 255, 0.07), transparent 26%),
            radial-gradient(circle at 50% 85%, rgba(22, 135, 255, 0.06), transparent 30%),
            #05080d;
        }

        .software-grid {
          position: absolute;
          inset: -80px;
          opacity: 0.22;
          background-image:
            linear-gradient(rgba(69, 165, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(69, 165, 255, 0.08) 1px, transparent 1px);
          background-size: 70px 70px;
          transform: perspective(900px) rotateX(58deg) scale(1.8);
          transform-origin: center top;
          animation: softwareGridMove 18s linear infinite;
        }

        .software-scanlines {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 4px,
            rgba(255, 255, 255, 0.25) 5px
          );
          animation: softwareScan 8s linear infinite;
        }

        .software-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(80px);
          opacity: 0.35;
        }

        .software-orb-one {
          width: 300px;
          height: 300px;
          left: -120px;
          top: 18%;
          background: rgba(22, 135, 255, 0.14);
          animation: softwareFloatOne 11s ease-in-out infinite;
        }

        .software-orb-two {
          width: 360px;
          height: 360px;
          right: -180px;
          top: 42%;
          background: rgba(69, 165, 255, 0.10);
          animation: softwareFloatTwo 14s ease-in-out infinite;
        }

        .software-orb-three {
          width: 260px;
          height: 260px;
          left: 45%;
          bottom: -100px;
          background: rgba(22, 135, 255, 0.08);
          animation: softwareFloatThree 12s ease-in-out infinite;
        }

        .software-code {
          position: absolute;
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          line-height: 2;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.08);
          white-space: nowrap;
        }

        .software-code span {
          color: rgba(69, 165, 255, 0.18);
        }

        .software-code-left {
          left: 4%;
          top: 36%;
          animation: softwareCodeFloat 10s ease-in-out infinite;
        }

        .software-code-right {
          right: 4%;
          top: 66%;
          animation: softwareCodeFloat 13s ease-in-out infinite reverse;
        }

        .software-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #45a5ff;
          box-shadow: 0 0 10px rgba(69, 165, 255, 0.9);
          opacity: 0;
          animation-name: softwareParticle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .software-visual-glow {
          position: absolute;
          inset: 15% 5%;
          border-radius: 999px;
          background: rgba(22, 135, 255, 0.12);
          filter: blur(80px);
        }

        .software-terminal {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(69, 165, 255, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(10, 22, 36, 0.96), rgba(4, 9, 15, 0.98)),
            #07101a;
          box-shadow:
            0 40px 100px rgba(0, 0, 0, 0.45),
            0 0 80px rgba(22, 135, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transform: perspective(1200px) rotateY(-4deg) rotateX(2deg);
          transition: transform 500ms ease;
        }

        .software-terminal:hover {
          transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(-5px);
        }

        .software-terminal::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(69, 165, 255, 0.05) 50%,
              transparent 100%
            );
          transform: translateX(-100%);
          animation: terminalSweep 5s ease-in-out infinite;
        }

        .software-terminal-top {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          padding: 16px 18px;
        }

        .terminal-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
        }

        .software-terminal-body {
          position: relative;
          padding: 28px 24px 26px;
        }

        .software-terminal-line {
          display: grid;
          grid-template-columns: 28px auto auto auto auto;
          align-items: center;
          gap: 8px;
          min-height: 32px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          white-space: nowrap;
        }

        .software-progress {
          margin-top: 26px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 20px;
        }

        .software-progress-bar {
          position: relative;
          overflow: hidden;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            #1687ff,
            #45a5ff,
            #8dccff
          );
          box-shadow: 0 0 16px rgba(69, 165, 255, 0.35);
          animation: progressPulse 3s ease-in-out infinite;
        }

        .software-progress-bar::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.65),
            transparent
          );
          animation: progressSweep 2.5s linear infinite;
        }

        .software-floating-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(69, 165, 255, 0.18);
          border-radius: 14px;
          background: rgba(6, 15, 25, 0.85);
          padding: 12px 14px;
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.35),
            0 0 30px rgba(22, 135, 255, 0.06);
          backdrop-filter: blur(16px);
        }

        .software-floating-card-one {
          left: -28px;
          bottom: 12%;
          animation: floatingCardOne 5s ease-in-out infinite;
        }

        .software-floating-card-two {
          right: -25px;
          top: 12%;
          display: block;
          min-width: 110px;
          animation: floatingCardTwo 6s ease-in-out infinite;
        }

        .software-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5ee1a0;
          box-shadow: 0 0 12px rgba(94, 225, 160, 0.8);
          animation: statusPulse 2s ease-in-out infinite;
        }

        .software-feature-card {
          position: relative;
          display: flex;
          gap: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.025);
          padding: 26px;
          backdrop-filter: blur(12px);
          transition:
            transform 300ms ease,
            border-color 300ms ease,
            background 300ms ease;
        }

        .software-feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(22, 135, 255, 0.28);
          background: rgba(22, 135, 255, 0.045);
        }

        .software-feature-number {
          display: flex;
          height: 42px;
          width: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(69, 165, 255, 0.22);
          border-radius: 12px;
          background: rgba(22, 135, 255, 0.07);
          color: #45a5ff;
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
        }

        .software-capability-card {
          position: relative;
          min-height: 290px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.012)
            );
          padding: 28px;
          backdrop-filter: blur(14px);
          transition:
            transform 350ms ease,
            border-color 350ms ease,
            box-shadow 350ms ease,
            background 350ms ease;
        }

        .software-capability-card::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69, 165, 255, 0.65),
            transparent
          );
          opacity: 0;
          transition: opacity 350ms ease;
        }

        .software-capability-card::after {
          content: "";
          position: absolute;
          right: -70px;
          top: -70px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(22, 135, 255, 0.08);
          filter: blur(30px);
          opacity: 0;
          transition: opacity 350ms ease;
        }

        .software-capability-card:hover {
          transform: translateY(-8px);
          border-color: rgba(22, 135, 255, 0.35);
          background:
            linear-gradient(
              145deg,
              rgba(22, 135, 255, 0.065),
              rgba(255, 255, 255, 0.018)
            );
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.28);
        }

        .software-capability-card:hover::before,
        .software-capability-card:hover::after {
          opacity: 1;
        }

        .software-capability-icon {
          position: relative;
          display: flex;
          height: 42px;
          width: 42px;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: 1px solid rgba(69, 165, 255, 0.16);
          border-radius: 12px;
          background: rgba(22, 135, 255, 0.06);
        }

        .software-capability-icon span {
          width: 3px;
          border-radius: 999px;
          background: #45a5ff;
          box-shadow: 0 0 8px rgba(69, 165, 255, 0.5);
          animation: iconBars 1.8s ease-in-out infinite;
        }

        .software-capability-icon span:nth-child(1) {
          height: 10px;
          animation-delay: 0s;
        }

        .software-capability-icon span:nth-child(2) {
          height: 18px;
          animation-delay: 0.2s;
        }

        .software-capability-icon span:nth-child(3) {
          height: 13px;
          animation-delay: 0.4s;
        }

        .software-cta {
          isolation: isolate;
        }

        .software-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            120deg,
            rgba(22, 135, 255, 0.4),
            transparent 35%,
            transparent 65%,
            rgba(69, 165, 255, 0.25)
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        .software-primary-button {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1687ff, #0b66c7);
          box-shadow:
            0 12px 35px rgba(22, 135, 255, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.22);
          transition:
            transform 300ms ease,
            box-shadow 300ms ease;
        }

        .software-primary-button::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          transform: translateX(-150%) skewX(-20deg);
          background: rgba(255, 255, 255, 0.18);
          animation: buttonSweep 4s ease-in-out infinite;
        }

        .software-primary-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 18px 45px rgba(22, 135, 255, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.28);
        }

        @keyframes softwareGridMove {
          from {
            transform: perspective(900px) rotateX(58deg) scale(1.8)
              translateY(0);
          }
          to {
            transform: perspective(900px) rotateX(58deg) scale(1.8)
              translateY(70px);
          }
        }

        @keyframes softwareScan {
          from {
            transform: translateY(-20px);
          }
          to {
            transform: translateY(20px);
          }
        }

        @keyframes softwareFloatOne {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(45px, -35px, 0);
          }
        }

        @keyframes softwareFloatTwo {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-40px, 30px, 0);
          }
        }

        @keyframes softwareFloatThree {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(35px, -25px, 0);
          }
        }

        @keyframes softwareCodeFloat {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-14px);
            opacity: 1;
          }
        }

        @keyframes softwareParticle {
          0% {
            transform: translate3d(0, 30px, 0) scale(0.4);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translate3d(0, -90px, 0) scale(1);
            opacity: 0;
          }
        }

        @keyframes terminalSweep {
          0%, 35% {
            transform: translateX(-120%);
          }
          65%, 100% {
            transform: translateX(120%);
          }
        }

        @keyframes progressPulse {
          0%, 100% {
            filter: brightness(0.95);
          }
          50% {
            filter: brightness(1.25);
          }
        }

        @keyframes progressSweep {
          from {
            transform: translateX(-120%);
          }
          to {
            transform: translateX(320%);
          }
        }

        @keyframes floatingCardOne {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes floatingCardTwo {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes statusPulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes iconBars {
          0%, 100% {
            transform: scaleY(0.7);
            opacity: 0.55;
          }
          50% {
            transform: scaleY(1.15);
            opacity: 1;
          }
        }

        @keyframes buttonSweep {
          0%, 55% {
            transform: translateX(-150%) skewX(-20deg);
          }
          75%, 100% {
            transform: translateX(320%) skewX(-20deg);
          }
        }

        @media (max-width: 900px) {
          .software-code {
            display: none;
          }

          .software-floating-card-one {
            left: 5px;
          }

          .software-floating-card-two {
            right: 5px;
          }

          .software-terminal {
            transform: none;
          }
        }

        @media (max-width: 640px) {
          .software-grid {
            opacity: 0.12;
          }

          .software-floating-card {
            transform: scale(0.82);
          }

          .software-floating-card-one {
            left: -8px;
            bottom: 7%;
          }

          .software-floating-card-two {
            right: -8px;
            top: 7%;
          }

          .software-terminal-line {
            grid-template-columns: 22px auto;
            font-size: 8px;
          }

          .software-terminal-line span:nth-child(n + 3) {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .software-grid,
          .software-scanlines,
          .software-orb,
          .software-code,
          .software-particle,
          .software-terminal::before,
          .software-progress-bar,
          .software-progress-bar::after,
          .software-floating-card,
          .software-status-dot,
          .software-capability-icon span,
          .software-primary-button::before {
            animation: none !important;
          }

          .software-terminal,
          .software-capability-card,
          .software-feature-card,
          .software-primary-button {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}