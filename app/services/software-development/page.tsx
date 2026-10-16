
import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Responsive, modern websites designed to present your business professionally and turn visitors into potential customers.",
  },
  {
    number: "02",
    title: "Web Applications",
    description:
      "Interactive web applications that help your team manage workflows, serve customers, and simplify daily operations.",
  },
  {
    number: "03",
    title: "Custom Software",
    description:
      "Software solutions tailored to your business processes, requirements, and long-term growth.",
  },
  {
    number: "04",
    title: "System Integration",
    description:
      "Connect your tools and platforms to improve information flow and reduce repetitive work.",
  },
  {
    number: "05",
    title: "Maintenance & Support",
    description:
      "Ongoing technical support and improvements to help your digital products remain reliable and up to date.",
  },
  {
    number: "06",
    title: "UI/UX Implementation",
    description:
      "User-focused interfaces that make your digital products clear, accessible, and easy to use.",
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

export default function SoftwareDevelopmentPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b10] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
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

          <nav className="flex items-center gap-4 text-sm text-gray-300 sm:gap-8">
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

      <section className="relative px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div className="absolute -right-40 -top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#45a5ff]"
          >
            <span aria-hidden="true">â†</span>
            All Services
          </Link>

          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
            Software Development
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Digital solutions built around your business.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            From business websites to custom applications, VEXORA helps
            organizations turn ideas into practical digital products designed
            for usability, reliability, and growth.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-[#1687ff] px-7 py-4 text-sm font-semibold transition hover:bg-[#45a5ff]"
            >
              Discuss Your Project
              <span className="ml-3" aria-hidden="true">
                â†’
              </span>
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center rounded-full border border-white/15 px-7 py-4 text-sm font-semibold transition hover:border-[#45a5ff] hover:text-[#45a5ff]"
            >
              View Our Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold text-[#45a5ff]">01</p>
            <h2 className="mt-3 text-lg font-semibold">Business-focused</h2>
            <p className="mt-3 leading-7 text-gray-400">
              Solutions shaped around your actual goals and workflows.
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-[#45a5ff]">02</p>
            <h2 className="mt-3 text-lg font-semibold">Built to grow</h2>
            <p className="mt-3 leading-7 text-gray-400">
              Flexible foundations that can evolve as your business changes.
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-[#45a5ff]">03</p>
            <h2 className="mt-3 text-lg font-semibold">Quality-driven</h2>
            <p className="mt-3 leading-7 text-gray-400">
              Careful implementation with usability and maintainability in mind.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
              Our Capabilities
            </p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">
              Software services for real business needs.
            </h2>
            <p className="mt-5 leading-8 text-gray-400">
              Whether you are launching a new idea or improving an existing
              system, we help you choose an appropriate technical solution.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                key={capability.number}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition duration-300 hover:border-[#1687ff]/50 hover:bg-white/[0.04]"
              >
                <p className="text-sm font-medium tracking-widest text-[#45a5ff]">
                  {capability.number}
                </p>

                <h3 className="mt-5 text-xl font-semibold">
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

      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
              How We Work
            </p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">
              From the first idea to delivery.
            </h2>
            <p className="mt-5 leading-8 text-gray-400">
              A clear process helps us align expectations, prioritize the
              important work, and keep the project moving forward.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="border-t border-[#1687ff]/50 pt-6"
              >
                <p className="text-sm font-semibold tracking-widest text-[#45a5ff]">
                  {step.number}
                </p>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1727] to-[#080b10] p-8 sm:p-12 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
              Have a project in mind?
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
              Let&apos;s build something useful together.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-gray-400">
              Tell us about your idea, your goals, and the challenge you want
              to solve. We can discuss the right next step for your business.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit shrink-0 items-center rounded-full bg-[#1687ff] px-7 py-4 text-sm font-semibold transition hover:bg-[#45a5ff]"
          >
            Contact VEXORA
            <span className="ml-3" aria-hidden="true">
              â†’
            </span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-7 text-center text-sm text-gray-500">
        Â© 2026 VEXORA. All rights reserved.
      </footer>
    </main>
  );
}

