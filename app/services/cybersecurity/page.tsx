
import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Security Assessment",
    description:
      "Evaluate your systems, applications, and infrastructure to identify security weaknesses and understand your current security posture.",
  },
  {
    number: "02",
    title: "Vulnerability Assessment",
    description:
      "Identify and prioritize technical vulnerabilities so your team can focus on the risks that matter most.",
  },
  {
    number: "03",
    title: "Network Security",
    description:
      "Review network architecture, access controls, and security configurations to help protect your business environment.",
  },
  {
    number: "04",
    title: "Web Application Security",
    description:
      "Assess web applications for common security weaknesses and recommend practical measures to reduce exposure.",
  },
  {
    number: "05",
    title: "Security Hardening",
    description:
      "Improve system configurations, access permissions, and security practices to reduce avoidable risks.",
  },
  {
    number: "06",
    title: "Security Consulting",
    description:
      "Get clear, practical guidance on security priorities, risk management, and improvements suited to your business.",
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

export default function CybersecurityPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b10] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/" aria-label="VEXORA Home">
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={190}
              height={70}
              priority
              className="h-auto w-36 sm:w-44"
            />
          </Link>

          <nav className="flex items-center gap-3 text-sm text-gray-300 sm:gap-8">
            <Link href="/" className="transition hover:text-[#45a5ff]">
              Home
            </Link>
            <Link
              href="/services"
              className="transition hover:text-[#45a5ff]"
            >
              Services
            </Link>
            <Link href="/about" className="transition hover:text-[#45a5ff]">
              About
            </Link>
            <Link href="/contact" className="transition hover:text-[#45a5ff]">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#45a5ff]"
          >
            <span aria-hidden="true">←</span>
            Back to Services
          </Link>

          <p className="mt-10 text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
            CYBERSECURITY
          </p>

          <h1 className="mt-5 max-w-5xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Protect your business.
            <br />
            <span className="bg-gradient-to-r from-[#dce8f8] to-[#349cff] bg-clip-text text-transparent">
              Strengthen your security.
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-gray-400 sm:text-xl sm:leading-9">
            Identify security risks, improve protection, and make informed
            decisions with practical cybersecurity services designed around
            your business, systems, and priorities.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[#1687ff] px-7 py-4 font-semibold text-white transition hover:bg-[#0872e5]"
            >
              Discuss Your Security Needs
              <span aria-hidden="true"> ↗</span>
            </Link>

            <a
              href="#capabilities"
              className="rounded-full border border-white/15 px-7 py-4 font-semibold text-gray-200 transition hover:border-[#45a5ff] hover:text-[#45a5ff]"
            >
              Explore Our Services
            </a>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7 text-xs tracking-[0.12em] text-gray-500 sm:text-sm">
            <span>RISK ASSESSMENT</span>
            <span>NETWORK SECURITY</span>
            <span>APPLICATION SECURITY</span>
            <span>SECURITY CONSULTING</span>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section
        id="capabilities"
        className="scroll-mt-10 border-y border-white/5 bg-[#0b1018] py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
              OUR EXPERTISE
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Security built around your risks.
            </h2>

            <p className="mt-6 leading-8 text-gray-400">
              Every business faces different technology risks. We help you
              understand your exposure and identify practical ways to improve
              protection and resilience.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                key={capability.number}
                className="group rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#278cff]/50 hover:bg-white/[0.045]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm tracking-widest text-[#45a5ff]">
                    {capability.number}
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-xl text-gray-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#45a5ff]"
                  >
                    ↗
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold">
                  {capability.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
              HOW WE WORK
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              From security questions to clear next steps.
            </h2>

            <p className="mt-6 leading-8 text-gray-400">
              A structured process helps keep security work focused,
              understandable, and aligned with your business priorities.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
              >
                <span className="text-sm tracking-widest text-[#45a5ff]">
                  STEP {step.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-7 text-gray-500">
            Security assessments are performed only on systems and assets
            that the client owns or is explicitly authorized to have assessed.
            Scope and deliverables are agreed upon before work begins.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#101b2a] to-[#090d13] p-8 sm:p-12 lg:p-16">
          <p className="text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
            SECURE YOUR NEXT STEP
          </p>

          <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Let&apos;s talk about your security priorities.
          </h2>

          <p className="mt-6 max-w-2xl leading-8 text-gray-400">
            Tell us about your systems, concerns, and goals. We can discuss
            your requirements and identify a practical starting point.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-[#1687ff] px-7 py-4 font-semibold transition hover:bg-[#0872e5]"
            >
              Contact VEXORA
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-3 rounded-full border border-white/15 px-7 py-4 font-semibold text-gray-200 transition hover:border-[#45a5ff] hover:text-[#45a5ff]"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 VEXORA. All rights reserved.</p>

          <p>Software · Security · Data · Networks · Digital</p>

          <Link
            href="/"
            className="transition hover:text-[#45a5ff]"
          >
            Back to Home ↑
          </Link>
        </div>
      </footer>
    </main>
  );
}
