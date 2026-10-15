

import Image from "next/image";

const services = [
  {
    number: "01",
    title: "Software Development",
    description:
      "We build modern websites, web applications, and software solutions designed around your business needs.",
    tags: ["Web Development", "Web Applications", "Software"],
  },
  {
    number: "02",
    title: "Cybersecurity",
    description:
    
      "We help businesses identify security risks and strengthen their digital protection.",
    tags: ["Security Assessment", "Risk Analysis", "Protection"],
  },
  {
    number: "03",
    title: "Networks & Infrastructure",
    description:
      "We support reliable network infrastructure, connectivity, and technology environments.",
    tags: ["Networking", "Infrastructure", "IT Solutions"],
  },
  {
    number: "04",
    title: "Data Analytics",
    description:
      "We turn business data into meaningful insights that support smarter decisions.",
    tags: ["Data Analysis", "Reporting", "Insights"],
  },
  {
    number: "05",
    title: "Digital Marketing",
    description:
      "We combine marketing strategy, audience understanding, and performance measurement to improve campaigns.",
    tags: ["Digital Strategy", "Media Buying", "Optimization"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b10] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[88px] max-w-screen-2xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <a
            href="#home"
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
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 text-sm text-gray-300 md:flex"
          >
            <a href="#services" className="transition hover:text-[#45a5ff]">
              Services
            </a>
            <a href="#about" className="transition hover:text-[#45a5ff]">
              About
            </a>
            <a href="#contact" className="transition hover:text-[#45a5ff]">
              Contact
            </a>
          </nav>

          <a
            href="#contact"
            className="shrink-0 rounded-full border border-[#278cff]/60 px-5 py-3 text-sm font-medium transition hover:bg-[#1687ff] hover:border-[#1687ff]"
          >
            Let&apos;s Talk <span aria-hidden="true">â†—</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative isolate border-b border-white/5"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-[#087bff]/10 blur-[130px]"
        />

        <div className="mx-auto max-w-screen-2xl px-6 pb-24 pt-24 lg:px-10 lg:pb-32 lg:pt-32">
          <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-xs tracking-[0.16em] text-gray-300 sm:text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#45a5ff]" />
            TECHNOLOGY THAT MOVES YOU FORWARD
          </div>

          <h1 className="max-w-5xl text-5xl font-bold leading-[1.06] tracking-[-0.055em] sm:text-7xl lg:text-[108px]">
            Engineering
            <br />
            what&apos;s{" "}
            <span className="bg-gradient-to-r from-[#dce8f8] to-[#349cff] bg-clip-text text-transparent">
              next.
            </span>
          </h1>

          <p className="mt-10 max-w-3xl text-base leading-8 text-gray-400 sm:text-xl sm:leading-9">
            VEXORA brings software engineering, cybersecurity, data analytics,
            networking, and digital marketing together to help businesses move
            forward with confidence.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#services"
              className="rounded-full bg-[#1687ff] px-7 py-4 font-semibold text-white transition hover:bg-[#0872e5]"
            >
              Explore Our Services <span aria-hidden="true">â†’</span>
            </a>

            <a
              href="#about"
              className="rounded-full border border-white/15 px-7 py-4 font-semibold text-gray-200 transition hover:border-[#45a5ff] hover:text-[#45a5ff]"
            >
              Discover VEXORA
            </a>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7 text-xs tracking-[0.12em] text-gray-500 sm:text-sm">
            <span>SOFTWARE</span>
            <span>CYBERSECURITY</span>
            <span>NETWORKS</span>
            <span>DATA</span>
            <span>DIGITAL MARKETING</span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-10 py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
              WHAT WE DO
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Technology built around your goals.
            </h2>

            <p className="mt-6 max-w-2xl leading-8 text-gray-400">
              Explore the capabilities that help us approach business
              challenges through engineering, security, data, and strategy.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="group rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#278cff]/50 hover:bg-white/[0.045]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm tracking-widest text-[#45a5ff]">
                    {service.number}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xl text-gray-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#45a5ff]"
                  >
                    â†—
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold">
                  {service.title}
                </h3>

                <p className="mt-4 min-h-24 text-sm leading-7 text-gray-400">
                  {service.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="scroll-mt-10 border-y border-white/5 bg-[#0b1018] py-24 lg:py-32"
      >
        <div className="mx-auto grid max-w-screen-2xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
              ABOUT VEXORA
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Technology should solve real problems, not create new ones.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-gray-400">
            <p>
              VEXORA brings together technology and business thinking to help
              organizations approach their challenges with clarity and purpose.
            </p>

            <p>
              Our approach connects software development, cybersecurity,
              networks, data analytics, and digital marketing around practical
              business needs.
            </p>

            <p>
              We believe in building thoughtfully, understanding the problem
              first, and choosing solutions that make sense for each project.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-10 py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#101b2a] to-[#090d13] p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#45a5ff]">
              LET&apos;S BUILD SOMETHING
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Have a challenge in mind?
            </h2>

            <p className="mt-6 max-w-2xl leading-8 text-gray-400">
              Tell us about your business needs and the technology challenges
              you want to solve. Let&apos;s explore the next step together.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="mailto:vexore.mr@gmail.com"
                className="inline-flex items-center gap-3 rounded-full bg-[#1687ff] px-7 py-4 font-semibold transition hover:bg-[#0872e5]"
              >
                Email Us <span aria-hidden="true">â†—</span>
              </a>

              <a
                href="https://wa.me/201115449868"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-[#25D366] px-7 py-4 font-semibold text-[#25D366] transition hover:bg-[#25D366]/10"
              >
                WhatsApp <span aria-hidden="true">â†—</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>Â© 2026 VEXORA. All rights reserved.</p>

          <p>Software Â· Security Â· Data Â· Networks Â· Digital</p>

          <a
            href="#home"
            className="transition hover:text-[#45a5ff]"
          >
            Back to top â†‘
          </a>
        </div>
      </footer>
    </main>
  );
}

