import Link from "next/link";

const values = [
  {
    number: "01",
    title: "Innovation",
    description:
      "We explore modern technologies and practical ideas to build smarter digital solutions.",
  },
  {
    number: "02",
    title: "Security First",
    description:
      "We consider security and reliability essential parts of every technology solution.",
  },
  {
    number: "03",
    title: "Client Focus",
    description:
      "We work to understand each business challenge and deliver solutions aligned with real goals.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b10] text-white">
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/" className="text-2xl font-bold tracking-[0.2em]">
            VEXORA<span className="text-[#1687ff]">.</span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-gray-300">
            <Link href="/" className="transition hover:text-[#45a5ff]">
              Home
            </Link>
            <Link
              href="/services"
              className="transition hover:text-[#45a5ff]"
            >
              Services
            </Link>
            <Link href="/about" className="text-[#45a5ff]">
              About
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative border-b border-white/10">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#1687ff]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-[#45a5ff]">
            About VEXORA
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
            Technology with purpose.
            <span className="block text-[#45a5ff]">
              Solutions built for what’s next.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            VEXORA is a technology company focused on helping businesses
            navigate the digital world through software development,
            cybersecurity, network infrastructure, data analytics, and digital
            marketing.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="rounded-lg bg-[#1687ff] px-6 py-3 font-semibold transition hover:bg-[#0875e5]"
            >
              Explore Our Services
            </Link>
            <Link
              href="/#contact"
              className="rounded-lg border border-white/15 px-6 py-3 font-semibold transition hover:border-[#45a5ff] hover:text-[#45a5ff]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
            Who We Are
          </p>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            A technology partner for a changing world.
          </h2>
        </div>

        <div className="space-y-5 text-base leading-8 text-gray-400">
          <p>
            Technology should solve real problems, create opportunities, and
            make businesses more capable of achieving their goals.
          </p>
          <p>
            That belief drives our approach at VEXORA. We bring together
            digital expertise across multiple disciplines to help organizations
            build, protect, and improve their technology.
          </p>
          <p>
            From developing software to strengthening digital security and
            turning data into insights, our focus is on useful solutions,
            thoughtful execution, and long-term value.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
              What Guides Us
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              The principles behind our work.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.number}
                className="rounded-2xl border border-white/10 bg-[#0c1119] p-7 transition hover:-translate-y-1 hover:border-[#1687ff]/50"
              >
                <p className="text-sm font-semibold tracking-widest text-[#45a5ff]">
                  {value.number}
                </p>
                <h3 className="mt-6 text-xl font-semibold">{value.title}</h3>
                <p className="mt-4 leading-7 text-gray-400">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10 lg:py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
          Let’s Build Something Better
        </p>
        <h2 className="mx-auto max-w-3xl text-3xl font-bold sm:text-5xl">
          Have a challenge in mind? Let’s work on it together.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
          Explore how VEXORA can support your next digital project.
        </p>
        <Link
          href="/#contact"
          className="mt-8 inline-flex rounded-lg bg-[#1687ff] px-7 py-3 font-semibold transition hover:bg-[#0875e5]"
        >
          Discuss Your Project
        </Link>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        © 2026 VEXORA. All rights reserved.
      </footer>
    </main>
  );
}
