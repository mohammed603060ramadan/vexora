import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Network Design & Setup",
    description:
      "Network solutions designed around your business requirements, devices, and connectivity needs.",
    code: "NET//01",
  },
  {
    number: "02",
    title: "Network Infrastructure",
    description:
      "Reliable infrastructure planning to support communication, connectivity, and daily operations.",
    code: "INFRA//02",
  },
  {
    number: "03",
    title: "Network Security",
    description:
      "Security-focused network configurations that help reduce risks and protect business resources.",
    code: "SEC//03",
  },
  {
    number: "04",
    title: "Server & System Setup",
    description:
      "Server and system environments configured to support your applications, users, and services.",
    code: "SRV//04",
  },
  {
    number: "05",
    title: "Infrastructure Optimization",
    description:
      "Review and improve infrastructure performance, reliability, and resource utilization.",
    code: "OPT//05",
  },
  {
    number: "06",
    title: "IT Consulting & Support",
    description:
      "Practical technical guidance to help you plan, maintain, and improve your IT environment.",
    code: "IT//06",
  },
];

const process = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understand your business, current infrastructure, and connectivity requirements.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Plan a solution that fits your operational needs and available resources.",
  },
  {
    number: "03",
    title: "Implement",
    description:
      "Configure and implement the agreed infrastructure solution.",
  },
  {
    number: "04",
    title: "Optimize",
    description:
      "Review the result and identify opportunities for improvement.",
  },
];

function NetworkBackground() {
  const nodes = [
    { left: "10%", top: "22%", delay: "0s" },
    { left: "22%", top: "68%", delay: "1.2s" },
    { left: "42%", top: "35%", delay: "0.5s" },
    { left: "58%", top: "72%", delay: "1.8s" },
    { left: "73%", top: "25%", delay: "0.8s" },
    { left: "89%", top: "58%", delay: "2.2s" },
    { left: "52%", top: "15%", delay: "1.4s" },
    { left: "32%", top: "82%", delay: "2.5s" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="network-base" />
      <div className="network-grid" />
      <div className="network-scan" />

      <div className="network-glow network-glow-one" />
      <div className="network-glow network-glow-two" />

      <div className="network-lines network-line-one" />
      <div className="network-lines network-line-two" />
      <div className="network-lines network-line-three" />

      {nodes.map((node, index) => (
        <div
          key={index}
          className="network-node"
          style={{
            left: node.left,
            top: node.top,
            animationDelay: node.delay,
          }}
        >
          <span />
        </div>
      ))}

      <div className="network-telemetry network-telemetry-one">
        NETWORK STATUS // ONLINE
      </div>

      <div className="network-telemetry network-telemetry-two">
        PACKETS // 98.7%
      </div>

      <div className="network-telemetry network-telemetry-three">
        SECURITY // ACTIVE
      </div>
    </div>
  );
}

function NetworkVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="network-visual-glow" />

      <div className="network-dashboard">
        <div className="network-dashboard-header">
          <div className="flex items-center gap-2">
            <span className="network-window-dot" />
            <span className="network-window-dot" />
            <span className="network-window-dot" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
            VEXORA / NETWORK CORE
          </span>

          <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#6ee7b7]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6ee7b7] shadow-[0_0_10px_rgba(110,231,183,.9)]" />
            Operational
          </span>
        </div>

        <div className="network-dashboard-content">
          <div className="network-map">
            <div className="network-map-ring network-map-ring-one" />
            <div className="network-map-ring network-map-ring-two" />

            <div className="network-core">
              <div className="network-core-inner">
                <span>CORE</span>
                <strong>VXR</strong>
              </div>
            </div>

            <div className="network-map-node node-a">
              <span />
              <small>SRV-01</small>
            </div>

            <div className="network-map-node node-b">
              <span />
              <small>GW-02</small>
            </div>

            <div className="network-map-node node-c">
              <span />
              <small>SEC-03</small>
            </div>

            <div className="network-map-node node-d">
              <span />
              <small>DB-04</small>
            </div>

            <div className="network-connection connection-a" />
            <div className="network-connection connection-b" />
            <div className="network-connection connection-c" />
            <div className="network-connection connection-d" />
          </div>

          <div className="network-stats">
            <div className="network-stat">
              <span>Network</span>
              <strong>98.7%</strong>
              <div className="network-stat-bar">
                <i style={{ width: "98.7%" }} />
              </div>
            </div>

            <div className="network-stat">
              <span>Security</span>
              <strong>99.2%</strong>
              <div className="network-stat-bar">
                <i style={{ width: "99.2%" }} />
              </div>
            </div>

            <div className="network-stat">
              <span>Availability</span>
              <strong>99.9%</strong>
              <div className="network-stat-bar">
                <i style={{ width: "99.9%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="network-dashboard-footer">
          <span>TRAFFIC MONITORING</span>

          <div className="network-traffic">
            {Array.from({ length: 24 }).map((_, index) => (
              <span
                key={index}
                style={{
                  height: `${20 + ((index * 17) % 65)}%`,
                  animationDelay: `${index * 0.08}s`,
                }}
              />
            ))}
          </div>

          <span className="text-[#45a5ff]">LIVE</span>
        </div>
      </div>

      <div className="network-floating-card network-floating-card-one">
        <div className="network-floating-icon">⌁</div>

        <div>
          <p>LATENCY</p>
          <strong>12ms</strong>
        </div>
      </div>

      <div className="network-floating-card network-floating-card-two">
        <div className="network-security-icon">
          <span />
        </div>

        <div>
          <p>FIREWALL</p>
          <strong>ACTIVE</strong>
        </div>
      </div>
    </div>
  );
}

export default function NetworksInfrastructurePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080d] text-white">
      <NetworkBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05080d]/80 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[82px] max-w-screen-2xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
            <Link
              href="/"
              aria-label="VEXORA Home"
              className="group relative flex shrink-0 items-center"
            >
              <div className="absolute inset-0 rounded-full bg-[#1687ff]/20 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

              <Image
                src="/vexora-logo.png"
                alt="VEXORA Technology logo"
                width={190}
                height={70}
                priority
                className="relative h-auto max-h-[66px] w-auto max-w-[190px] object-contain"
              />
            </Link>

            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-8 text-sm text-white/55 md:flex"
            >
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
                href="/#about"
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
              className="network-primary-button rounded-full px-5 py-3 text-sm font-semibold"
            >
              Let&apos;s Talk <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-white/[0.07]">
          <div className="mx-auto max-w-screen-2xl px-6 pb-28 pt-16 lg:px-10 lg:pb-36 lg:pt-24">
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_.95fr]">
              <div>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-sm text-white/45 backdrop-blur-md transition hover:border-[#1687ff]/40 hover:text-[#45a5ff]"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>
                  Back to Services
                </Link>

                <div className="mt-10 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#1687ff]" />

                  <p className="text-xs font-semibold tracking-[0.28em] text-[#45a5ff]">
                    NETWORKS &amp; INFRASTRUCTURE
                  </p>
                </div>

                <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-[1.04] tracking-[-0.05em] sm:text-6xl lg:text-[5.5rem]">
                  Build a stronger
                  <span className="block bg-gradient-to-r from-white via-[#c3e2ff] to-[#45a5ff] bg-clip-text text-transparent">
                    foundation.
                  </span>
                </h1>

                <p className="mt-8 max-w-3xl text-base leading-8 text-white/50 sm:text-lg sm:leading-9">
                  We help businesses plan, build, and improve reliable network
                  and IT infrastructure that supports secure connectivity and
                  efficient operations.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="network-primary-button inline-flex items-center rounded-full px-7 py-4 font-semibold"
                  >
                    Discuss Your Infrastructure
                    <span className="ml-3" aria-hidden="true">
                      ↗
                    </span>
                  </Link>

                  <a
                    href="#capabilities"
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] px-7 py-4 font-semibold text-white/70 backdrop-blur-md transition duration-300 hover:border-[#45a5ff]/50 hover:text-[#45a5ff]"
                  >
                    Explore Capabilities
                  </a>
                </div>

                <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.08] pt-7 text-[10px] tracking-[0.16em] text-white/30 sm:text-xs">
                  <span>CONNECTIVITY</span>
                  <span>INFRASTRUCTURE</span>
                  <span>NETWORK SECURITY</span>
                  <span>IT SOLUTIONS</span>
                </div>
              </div>

              <NetworkVisual />
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section
          id="capabilities"
          className="relative scroll-mt-20 px-6 py-28 lg:px-10 lg:py-36"
        >
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[#1687ff]" />

                  <p className="text-xs font-semibold tracking-[0.28em] text-[#45a5ff]">
                    OUR EXPERTISE
                  </p>
                </div>

                <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
                  Infrastructure that
                  <span className="text-[#45a5ff]"> works for you.</span>
                </h2>
              </div>

              <p className="max-w-2xl text-sm leading-8 text-white/40 lg:justify-self-end">
                From network planning to infrastructure optimization, we focus
                on practical solutions aligned with your business requirements.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item) => (
                <article
                  key={item.number}
                  className="network-capability-card group"
                >
                  <div className="flex items-start justify-between">
                    <div className="network-card-icon">
                      <span />
                      <span />
                      <span />
                    </div>

                    <span className="text-[10px] tracking-[0.2em] text-white/20 transition group-hover:text-[#45a5ff]/60">
                      {item.code}
                    </span>
                  </div>

                  <div className="mt-9">
                    <span className="text-xs font-semibold tracking-[0.2em] text-[#45a5ff]">
                      {item.number}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-white/45">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/20 transition group-hover:text-[#45a5ff]/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1687ff] shadow-[0_0_12px_rgba(22,135,255,.8)]" />
                    Infrastructure Module
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#07101a]/80 px-6 py-28 backdrop-blur-sm lg:px-10 lg:py-36">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#1687ff]/[0.055] blur-[120px]" />

          <div className="relative mx-auto max-w-screen-2xl">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#1687ff]" />

                <p className="text-xs font-semibold tracking-[0.28em] text-[#45a5ff]">
                  HOW WE WORK
                </p>
              </div>

              <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
                A clear path from
                <span className="block text-white/45">
                  planning to implementation.
                </span>
              </h2>
            </div>

            <div className="relative mt-16">
              <div className="absolute left-0 right-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-[#1687ff]/50 to-transparent lg:block" />

              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {process.map((step, index) => (
                  <article key={step.number} className="relative pt-7">
                    <div className="absolute left-0 top-0 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#1687ff]/50 bg-[#07101a] shadow-[0_0_20px_rgba(22,135,255,.18)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#45a5ff] shadow-[0_0_10px_rgba(69,165,255,.8)]" />
                    </div>

                    <span className="text-xs font-semibold tracking-[0.2em] text-[#45a5ff]">
                      {step.number}
                    </span>

                    <h3 className="mt-5 text-xl font-semibold">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-white/40">
                      {step.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/20">
                      <span>INFRA PHASE</span>
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

        {/* CTA */}
        <section className="relative px-6 py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-screen-2xl">
            <div className="network-cta relative overflow-hidden rounded-[2rem] border border-[#1687ff]/20 bg-[#081321]/90 p-8 shadow-[0_0_90px_rgba(22,135,255,.07)] backdrop-blur-xl sm:p-12 lg:p-16">
              <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#1687ff]/15 blur-3xl" />

              <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#45a5ff]/10 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#6ee7b7] shadow-[0_0_14px_rgba(110,231,183,.9)]" />

                    <p className="text-xs font-semibold tracking-[0.25em] text-[#45a5ff]">
                      LET&apos;S CONNECT
                    </p>
                  </div>

                  <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
                    Ready to strengthen
                    <span className="block text-[#45a5ff]">
                      your infrastructure?
                    </span>
                  </h2>

                  <p className="mt-6 max-w-2xl text-sm leading-8 text-white/40">
                    Tell us about your network and IT requirements. Let&apos;s
                    explore a practical solution for your business.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="network-primary-button inline-flex w-fit shrink-0 items-center gap-3 rounded-full px-7 py-4 font-semibold"
                >
                  Contact VEXORA
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>

              <div className="relative mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/[0.08] pt-6 text-[9px] uppercase tracking-[0.18em] text-white/25">
                <span>VEXORA TECHNOLOGY</span>
                <span>NETWORK SYSTEMS</span>
                <span>INFRASTRUCTURE</span>
                <span>SECURE CONNECTIVITY</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.08] bg-[#03060a]/80">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-6 py-8 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <p>© 2026 VEXORA. All rights reserved.</p>

            <p>Software · Security · Data · Networks · Digital</p>

            <Link
              href="/services"
              className="transition hover:text-[#45a5ff]"
            >
              Back to Services →
            </Link>
          </div>
        </footer>
      </div>

      <style>{`
        .network-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 15% 18%,
              rgba(22, 135, 255, 0.10),
              transparent 28%
            ),
            radial-gradient(
              circle at 84% 34%,
              rgba(69, 165, 255, 0.075),
              transparent 27%
            ),
            radial-gradient(
              circle at 50% 88%,
              rgba(22, 135, 255, 0.055),
              transparent 30%
            ),
            #05080d;
        }

        .network-grid {
          position: absolute;
          inset: -100px;
          opacity: 0.19;
          background-image:
            linear-gradient(
              rgba(69, 165, 255, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(69, 165, 255, 0.08) 1px,
              transparent 1px
            );
          background-size: 68px 68px;
          transform: perspective(900px) rotateX(58deg) scale(1.8);
          transform-origin: center top;
          animation: networkGridMove 18s linear infinite;
        }

        .network-scan {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 4px,
            rgba(255, 255, 255, 0.35) 5px
          );
          animation: networkScan 8s linear infinite;
        }

        .network-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
        }

        .network-glow-one {
          left: -140px;
          top: 18%;
          width: 340px;
          height: 340px;
          background: rgba(22, 135, 255, 0.12);
          animation: networkGlowOne 12s ease-in-out infinite;
        }

        .network-glow-two {
          right: -180px;
          top: 45%;
          width: 400px;
          height: 400px;
          background: rgba(69, 165, 255, 0.09);
          animation: networkGlowTwo 15s ease-in-out infinite;
        }

        .network-lines {
          position: absolute;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69, 165, 255, 0.18),
            transparent
          );
          transform-origin: left center;
          opacity: 0.7;
        }

        .network-line-one {
          width: 42%;
          left: 10%;
          top: 28%;
          transform: rotate(18deg);
        }

        .network-line-two {
          width: 36%;
          right: 9%;
          top: 52%;
          transform: rotate(-22deg);
        }

        .network-line-three {
          width: 30%;
          left: 30%;
          top: 72%;
          transform: rotate(-9deg);
        }

        .network-node {
          position: absolute;
          width: 7px;
          height: 7px;
          border: 1px solid rgba(69, 165, 255, 0.6);
          border-radius: 50%;
          background: #07101a;
          box-shadow:
            0 0 0 5px rgba(69, 165, 255, 0.025),
            0 0 18px rgba(69, 165, 255, 0.45);
          animation: networkNodePulse 3s ease-in-out infinite;
        }

        .network-node span {
          position: absolute;
          inset: 2px;
          border-radius: 50%;
          background: #45a5ff;
          box-shadow: 0 0 10px rgba(69, 165, 255, 0.9);
        }

        .network-telemetry {
          position: absolute;
          font-family: var(--font-geist-mono), monospace;
          font-size: 8px;
          letter-spacing: 0.18em;
          color: rgba(69, 165, 255, 0.18);
          white-space: nowrap;
        }

        .network-telemetry-one {
          left: 4%;
          top: 43%;
        }

        .network-telemetry-two {
          right: 5%;
          top: 25%;
        }

        .network-telemetry-three {
          right: 9%;
          bottom: 17%;
        }

        .network-visual-glow {
          position: absolute;
          inset: 15%;
          border-radius: 999px;
          background: rgba(22, 135, 255, 0.13);
          filter: blur(90px);
        }

        .network-dashboard {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(69, 165, 255, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(9, 21, 34, 0.97),
              rgba(3, 8, 14, 0.98)
            );
          box-shadow:
            0 45px 100px rgba(0, 0, 0, 0.48),
            0 0 80px rgba(22, 135, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transform: perspective(1200px) rotateY(-4deg) rotateX(2deg);
          transition: transform 500ms ease;
        }

        .network-dashboard:hover {
          transform: perspective(1200px) rotateY(0deg) rotateX(0deg)
            translateY(-5px);
        }

        .network-dashboard::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(69, 165, 255, 0.05),
              transparent
            );
          transform: translateX(-120%);
          animation: networkSweep 5s ease-in-out infinite;
        }

        .network-dashboard-header {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          padding: 16px 18px;
        }

        .network-window-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
        }

        .network-dashboard-content {
          position: relative;
          display: grid;
          gap: 20px;
          padding: 22px;
        }

        .network-map {
          position: relative;
          min-height: 310px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 18px;
          background:
            radial-gradient(
              circle at center,
              rgba(22, 135, 255, 0.11),
              transparent 35%
            ),
            rgba(255, 255, 255, 0.015);
        }

        .network-map::before,
        .network-map::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              rgba(69, 165, 255, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(69, 165, 255, 0.04) 1px,
              transparent 1px
            );
          background-size: 36px 36px;
        }

        .network-map-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(69, 165, 255, 0.12);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .network-map-ring-one {
          width: 180px;
          height: 180px;
          animation: networkRing 6s linear infinite;
        }

        .network-map-ring-two {
          width: 280px;
          height: 280px;
          border-style: dashed;
          animation: networkRing 10s linear infinite reverse;
        }

        .network-core {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 5;
          display: flex;
          height: 82px;
          width: 82px;
          transform: translate(-50%, -50%);
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(69, 165, 255, 0.45);
          border-radius: 50%;
          background: rgba(5, 16, 27, 0.95);
          box-shadow:
            0 0 0 10px rgba(22, 135, 255, 0.035),
            0 0 40px rgba(22, 135, 255, 0.25);
          animation: corePulse 3s ease-in-out infinite;
        }

        .network-core-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .network-core-inner span {
          font-size: 7px;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.3);
        }

        .network-core-inner strong {
          color: #45a5ff;
          font-size: 17px;
          letter-spacing: 0.12em;
        }

        .network-map-node {
          position: absolute;
          z-index: 6;
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255, 255, 255, 0.42);
          font-family: var(--font-geist-mono), monospace;
          font-size: 7px;
          letter-spacing: 0.08em;
        }

        .network-map-node span {
          display: block;
          width: 8px;
          height: 8px;
          border: 1px solid rgba(69, 165, 255, 0.65);
          border-radius: 50%;
          background: #07101a;
          box-shadow: 0 0 14px rgba(69, 165, 255, 0.65);
        }

        .node-a {
          left: 13%;
          top: 23%;
        }

        .node-b {
          right: 12%;
          top: 24%;
        }

        .node-c {
          left: 13%;
          bottom: 21%;
        }

        .node-d {
          right: 12%;
          bottom: 21%;
        }

        .network-connection {
          position: absolute;
          z-index: 2;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69, 165, 255, 0.45),
            transparent
          );
          transform-origin: center;
        }

        .connection-a {
          width: 32%;
          left: 19%;
          top: 31%;
          transform: rotate(25deg);
        }

        .connection-b {
          width: 32%;
          right: 19%;
          top: 31%;
          transform: rotate(-25deg);
        }

        .connection-c {
          width: 32%;
          left: 19%;
          bottom: 31%;
          transform: rotate(-25deg);
        }

        .connection-d {
          width: 32%;
          right: 19%;
          bottom: 31%;
          transform: rotate(25deg);
        }

        .network-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .network-stat {
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
          padding: 12px;
        }

        .network-stat span {
          display: block;
          color: rgba(255, 255, 255, 0.3);
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .network-stat strong {
          display: block;
          margin-top: 5px;
          color: #45a5ff;
          font-family: var(--font-geist-mono), monospace;
          font-size: 14px;
        }

        .network-stat-bar {
          height: 2px;
          margin-top: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
        }

        .network-stat-bar i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #1687ff, #45a5ff);
          box-shadow: 0 0 10px rgba(69, 165, 255, 0.45);
        }

        .network-dashboard-footer {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          padding: 14px 18px;
          color: rgba(255, 255, 255, 0.25);
          font-family: var(--font-geist-mono), monospace;
          font-size: 8px;
          letter-spacing: 0.14em;
        }

        .network-traffic {
          display: flex;
          height: 20px;
          align-items: flex-end;
          gap: 3px;
        }

        .network-traffic span {
          flex: 1;
          min-width: 2px;
          max-width: 5px;
          border-radius: 999px;
          background: linear-gradient(
            to top,
            #1687ff,
            #45a5ff
          );
          opacity: 0.6;
          animation: trafficPulse 1.8s ease-in-out infinite;
        }

        .network-floating-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(69, 165, 255, 0.18);
          border-radius: 14px;
          background: rgba(5, 14, 24, 0.88);
          padding: 12px 14px;
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(22, 135, 255, 0.07);
          backdrop-filter: blur(16px);
        }

        .network-floating-card p {
          margin: 0;
          color: rgba(255, 255, 255, 0.28);
          font-size: 8px;
          letter-spacing: 0.16em;
        }

        .network-floating-card strong {
          display: block;
          margin-top: 3px;
          color: #45a5ff;
          font-size: 12px;
        }

        .network-floating-card-one {
          left: -28px;
          bottom: 10%;
          animation: networkFloatOne 5s ease-in-out infinite;
        }

        .network-floating-card-two {
          right: -25px;
          top: 10%;
          animation: networkFloatTwo 6s ease-in-out infinite;
        }

        .network-floating-icon,
        .network-security-icon {
          display: flex;
          height: 34px;
          width: 34px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(69, 165, 255, 0.2);
          border-radius: 10px;
          background: rgba(22, 135, 255, 0.06);
          color: #45a5ff;
        }

        .network-security-icon span {
          height: 10px;
          width: 10px;
          border: 1px solid #6ee7b7;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(110, 231, 183, 0.6);
        }

        .network-capability-card {
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
            background 350ms ease,
            box-shadow 350ms ease;
        }

        .network-capability-card::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69, 165, 255, 0.7),
            transparent
          );
          opacity: 0;
          transition: opacity 350ms ease;
        }

        .network-capability-card::after {
          content: "";
          position: absolute;
          right: -70px;
          top: -70px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(22, 135, 255, 0.09);
          filter: blur(30px);
          opacity: 0;
          transition: opacity 350ms ease;
        }

        .network-capability-card:hover {
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

        .network-capability-card:hover::before,
        .network-capability-card:hover::after {
          opacity: 1;
        }

        .network-card-icon {
          display: flex;
          height: 42px;
          width: 42px;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 1px solid rgba(69, 165, 255, 0.16);
          border-radius: 12px;
          background: rgba(22, 135, 255, 0.06);
        }

        .network-card-icon span {
          width: 4px;
          border-radius: 999px;
          background: #45a5ff;
          box-shadow: 0 0 8px rgba(69, 165, 255, 0.55);
          animation: networkBars 1.8s ease-in-out infinite;
        }

        .network-card-icon span:nth-child(1) {
          height: 10px;
        }

        .network-card-icon span:nth-child(2) {
          height: 19px;
          animation-delay: 0.2s;
        }

        .network-card-icon span:nth-child(3) {
          height: 14px;
          animation-delay: 0.4s;
        }

        .network-cta {
          isolation: isolate;
        }

        .network-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            120deg,
            rgba(22, 135, 255, 0.42),
            transparent 35%,
            transparent 65%,
            rgba(69, 165, 255, 0.24)
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        .network-primary-button {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1687ff, #0b66c7);
          box-shadow:
            0 12px 35px rgba(22, 135, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.22);
          transition:
            transform 300ms ease,
            box-shadow 300ms ease,
            background 300ms ease;
        }

        .network-primary-button::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          transform: translateX(-160%) skewX(-20deg);
          background: rgba(255, 255, 255, 0.18);
          animation: networkButtonSweep 4s ease-in-out infinite;
        }

        .network-primary-button:hover {
          transform: translateY(-3px);
          background: linear-gradient(135deg, #2793ff, #0872e5);
          box-shadow:
            0 18px 45px rgba(22, 135, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.28);
        }

        @keyframes networkGridMove {
          from {
            transform: perspective(900px) rotateX(58deg) scale(1.8)
              translateY(0);
          }
          to {
            transform: perspective(900px) rotateX(58deg) scale(1.8)
              translateY(68px);
          }
        }

        @keyframes networkScan {
          from {
            transform: translateY(-20px);
          }
          to {
            transform: translateY(20px);
          }
        }

        @keyframes networkGlowOne {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(45px, -30px);
          }
        }

        @keyframes networkGlowTwo {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-45px, 30px);
          }
        }

        @keyframes networkNodePulse {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.25);
            opacity: 1;
          }
        }

        @keyframes networkSweep {
          0%, 35% {
            transform: translateX(-120%);
          }
          65%, 100% {
            transform: translateX(120%);
          }
        }

        @keyframes networkRing {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes corePulse {
          0%, 100% {
            box-shadow:
              0 0 0 10px rgba(22, 135, 255, 0.035),
              0 0 35px rgba(22, 135, 255, 0.18);
          }
          50% {
            box-shadow:
              0 0 0 16px rgba(22, 135, 255, 0.025),
              0 0 55px rgba(22, 135, 255, 0.35);
          }
        }

        @keyframes trafficPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scaleY(0.75);
          }
          50% {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        @keyframes networkFloatOne {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-11px);
          }
        }

        @keyframes networkFloatTwo {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes networkBars {
          0%, 100% {
            transform: scaleY(0.7);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1.15);
            opacity: 1;
          }
        }

        @keyframes networkButtonSweep {
          0%, 55% {
            transform: translateX(-160%) skewX(-20deg);
          }
          75%, 100% {
            transform: translateX(320%) skewX(-20deg);
          }
        }

        @media (max-width: 900px) {
          .network-dashboard {
            transform: none;
          }

          .network-telemetry {
            display: none;
          }

          .network-floating-card-one {
            left: 5px;
          }

          .network-floating-card-two {
            right: 5px;
          }
        }

        @media (max-width: 640px) {
          .network-grid {
            opacity: 0.1;
          }

          .network-stats {
            grid-template-columns: 1fr;
          }

          .network-map {
            min-height: 260px;
          }

          .network-floating-card {
            transform: scale(0.82);
          }

          .network-floating-card-one {
            left: -8px;
          }

          .network-floating-card-two {
            right: -8px;
          }

          .network-dashboard-footer {
            grid-template-columns: 1fr auto;
          }

          .network-dashboard-footer > span:first-child {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .network-grid,
          .network-scan,
          .network-glow,
          .network-node,
          .network-dashboard::before,
          .network-map-ring,
          .network-core,
          .network-traffic span,
          .network-floating-card,
          .network-card-icon span,
          .network-primary-button::before {
            animation: none !important;
          }

          .network-dashboard,
          .network-capability-card,
          .network-primary-button {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}