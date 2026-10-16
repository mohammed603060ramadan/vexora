import Image from "next/image";
import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Software Development",
    description:
      "Modern websites, web applications, and custom software built around your business needs.",
    tags: ["Web Development", "Web Applications", "Custom Software"],
    href: "/services/software-development",
  },
  {
    number: "02",
    title: "Cybersecurity",
    description:
      "Practical security solutions to identify risks, strengthen protection, and support safer digital operations.",
    tags: ["Security Assessment", "Risk Analysis", "Protection"],
    href: "/services/cybersecurity",
  },
  {
    number: "03",
    title: "Networks & Infrastructure",
    description:
      "Reliable network design and IT infrastructure solutions that help your technology work together.",
    tags: ["Networking", "Infrastructure", "IT Solutions"],
    href: "/services/networks-infrastructure",
  },
  {
    number: "04",
    title: "Data Analytics",
    description:
      "Turn complex data into clear insights that help you understand performance and make informed decisions.",
    tags: ["Data Analysis", "Reporting", "Insights"],
    href: "/services/data-analytics",
  },
  {
    number: "05",
    title: "Digital Marketing",
    description:
      "Strategic digital marketing focused on reaching the right audience and improving campaign performance.",
    tags: ["Digital Strategy", "Campaigns", "Optimization"],
    href: "/services/digital-marketing",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b10] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[88px] max-w-screen-2xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <Link href="/" aria-label="VEXORA Home" className="shrink-0">
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={190}
              height={70}
              priority
              className="h-auto max-h-[66px] w-auto max-w-[190px] object-contain"
            />
          </Link>

          <nav className="flex items-center gap-5 text-sm text-gray-300 sm:gap-8">
            <Link href="/" className="transition hover:text-[#45a5ff]">
              Home
            </Link>
            <Link href="/services" className="text-[#45a5ff]">
              Services
            </Link>
            <Link href="/#about" className="transition hover:text-[#45a5ff]">
              About
            </Link>
            <Link href="/#contact" className="transition hover:text-[#45a5ff]">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative border-b border-white/5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-[#087bff]/15 blur-[120px]"
        />

        <div className="relative mx-auto max-w-screen-2xl px-6 py-24 sm:py-32 lg:px-10">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
            What We Do
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Technology that moves your business forward.
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            From software development to digital strategy, VEXORA brings
            technology and practical thinking together to help your business
            move forward.
          </p>

          <Link
            href="/#contact"
            className="relative z-10 mt-10 inline-flex rounded-full bg-[#1687ff] px-7 py-4 text-sm font-semibold transition hover:bg-[#45a5ff]"
          >
            Discuss Your Project
            <span className="ml-3" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#45a5ff]">
              Our Expertise
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Our Services
            </h2>
          </div>

          <p className="max-w-lg leading-7 text-gray-400">
            Flexible technology services designed to solve real challenges
            and support your next stage of growth.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.number}
              href={service.href}
              aria-label={`Explore ${service.title}`}
              className="relative z-10 group block rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#278cff]/50 hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45a5ff] sm:p-8"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="text-sm font-medium tracking-widest text-[#45a5ff]">
                  {service.number}
                </span>

                <span
                  aria-hidden="true"
                  className="text-xl text-gray-500 transition group-hover:text-[#45a5ff]"
                >
                  ↗
                </span>
              </div>

              <h3 className="text-xl font-semibold sm:text-2xl">
                {service.title}
              </h3>

              <p className="mt-4 min-h-20 leading-7 text-gray-400">
                {service.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-7 px-6 py-20 sm:flex-row sm:items-center sm:justify-between lg:px-10 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#45a5ff]">
              Have a project in mind?
            </p>

            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Let&apos;s find the right solution for you.
            </h2>
          </div>

          <Link
            href="/#contact"
            className="relative z-10 inline-flex w-fit shrink-0 rounded-full border border-[#278cff]/60 px-7 py-4 text-sm font-medium transition hover:border-[#1687ff] hover:bg-[#1687ff]"
          >
            Contact VEXORA
            <span className="ml-3" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-7 text-center text-sm text-gray-500">
        © 2026 VEXORA. All rights reserved.
      </footer>
    </main>
  );
}