
import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Network Design & Setup",
    description:
      "Network solutions designed around your business requirements, devices, and connectivity needs.",
  },
  {
    number: "02",
    title: "Network Infrastructure",
    description:
      "Reliable infrastructure planning to support communication, connectivity, and daily operations.",
  },
  {
    number: "03",
    title: "Network Security",
    description:
      "Security-focused network configurations that help reduce risks and protect business resources.",
  },
  {
    number: "04",
    title: "Server & System Setup",
    description:
      "Server and system environments configured to support your applications, users, and services.",
  },
  {
    number: "05",
    title: "Infrastructure Optimization",
    description:
      "Review and improve infrastructure performance, reliability, and resource utilization.",
  },
  {
    number: "06",
    title: "IT Consulting & Support",
    description:
      "Practical technical guidance to help you plan, maintain, and improve your IT environment.",
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

export default function NetworksInfrastructurePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b10] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[88px] max-w-screen-2xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <Link
            href="/"
            aria-label="VEXORA Home"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology logo"
              width={190}
              height={70}
              priority
              className="h-auto max-h-[66px] w-auto max-w-[190px] object-contain"
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 text-sm text-gray-300 md:flex"
          >
            <Link href="/" className="transition hover:text-[#45a5ff]">
              Home
            </Link>
            <Link
              href="/services"
              className="transition hover:text-[#45a5ff]"
            >
              Services
            </Link>
            <Link
              href="/#about"
              className="transition hover:text-[#45a5ff]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition hover:text-[#45a5ff]"
            >
              Contact
            </Link>
          </nav>

          <Link
            href="/contact"
            className="rounded-full bg-[#1687ff] px-5 py-3 text-sm font-semibold transition hover:bg-[#0872e5]"
          >
            Let&apos;s Talk <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate border-b border-white/5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-[#087bff]/10 blur-[130px]"
        />

        <div className="mx-auto max-w-screen-2xl px-6 py-24 lg:px-10 lg:py-32">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#45a5ff]"
          >
            <span aria-hidden="true">←</span> Back to Services
          </Link>

          <p className="mt-12 text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
            NETWORKS & INFRASTRUCTURE
          </p>

          <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-6xl lg:text-8xl">
            Build a stronger foundation for your business.
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-gray-400 sm:text-xl sm:leading-9">
            We help businesses plan, build, and improve reliable network and
            IT infrastructure that supports secure connectivity and efficient
            operations.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[#1687ff] px-7 py-4 font-semibold transition hover:bg-[#0872e5]"
            >
              Discuss Your Infrastructure{" "}
              <span aria-hidden="true">↗</span>
            </Link>

            <a
              href="#capabilities"
              className="rounded-full border border-white/15 px-7 py-4 font-semibold text-gray-200 transition hover:border-[#45a5ff] hover:text-[#45a5ff]"
            >
              Explore Capabilities
            </a>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7 text-xs tracking-[0.12em] text-gray-500 sm:text-sm">
            <span>CONNECTIVITY</span>
            <span>INFRASTRUCTURE</span>
            <span>NETWORK SECURITY</span>
            <span>IT SOLUTIONS</span>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section
        id="capabilities"
        className="scroll-mt-10 py-24 lg:py-32"
      >
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
              OUR EXPERTISE
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Infrastructure that works for you.
            </h2>

            <p className="mt-6 max-w-2xl leading-8 text-gray-400">
              From network planning to infrastructure optimization, we focus
              on practical solutions aligned with your business requirements.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <article
                key={item.number}
                className="group rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#278cff]/50 hover:bg-white/[0.045]"
              >
                <span className="text-sm tracking-widest text-[#45a5ff]">
                  {item.number}
                </span>

                <h3 className="mt-8 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-white/5 bg-[#0b1018] py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
              HOW WE WORK
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              A clear path from planning to implementation.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <div
                key={step.number}
                className="border-t border-white/15 pt-6"
              >
                <span className="text-sm tracking-widest text-[#45a5ff]">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#101b2a] to-[#090d13] p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
              LET&apos;S CONNECT
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Ready to strengthen your infrastructure?
            </h2>

            <p className="mt-6 max-w-2xl leading-8 text-gray-400">
              Tell us about your network and IT requirements. Let&apos;s
              explore a practical solution for your business.
            </p>

            <div className="mt-9">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-[#1687ff] px-7 py-4 font-semibold transition hover:bg-[#0872e5]"
              >
                Contact VEXORA <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
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
    </main>
  );
}
