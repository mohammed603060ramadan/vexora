import Link from "next/link";

const projects = [
  {
    number: "01",
    category: "Software Development",
    title: "Digital Business Platform",
    description:
      "A concept for a modern digital platform designed to streamline business operations and improve the customer experience.",
    tags: ["Web Applications", "UI/UX", "Business Solutions"],
  },
  {
    number: "02",
    category: "Cybersecurity",
    title: "Security & Risk Assessment",
    description:
      "A concept for assessing digital risks, identifying potential weaknesses, and improving an organization's security posture.",
    tags: ["Risk Analysis", "Security", "Protection"],
  },
  {
    number: "03",
    category: "Networks & Infrastructure",
    title: "Connected Infrastructure",
    description:
      "A concept for reliable network infrastructure that supports connectivity, performance, and scalable IT operations.",
    tags: ["Networking", "Infrastructure", "IT"],
  },
  {
    number: "04",
    category: "Data Analytics",
    title: "Business Intelligence Dashboard",
    description:
      "A concept for transforming business data into clear dashboards and useful insights to support better decisions.",
    tags: ["Data Visualization", "Analytics", "Reporting"],
  },
  {
    number: "05",
    category: "Digital Marketing",
    title: "Digital Growth Strategy",
    description:
      "A concept for improving online visibility through structured digital campaigns, audience research, and performance analysis.",
    tags: ["Digital Strategy", "Campaigns", "Optimization"],
  },
  {
    number: "06",
    category: "Integrated Technology",
    title: "Smart Business Ecosystem",
    description:
      "A concept bringing software, infrastructure, data, and security together in one coordinated digital environment.",
    tags: ["Integration", "Automation", "Technology"],
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b10] text-white">
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/" className="text-2xl font-bold tracking-[0.2em]">
            VEXORA<span className="text-[#1687ff]">.</span>
          </Link>

          <div className="flex items-center gap-4 text-sm text-gray-300 sm:gap-6">
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
            <Link href="/projects" className="text-[#45a5ff]">
              Projects
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative border-b border-white/10">
        <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-[#1687ff]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-[#45a5ff]">
            Our Projects
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Ideas into
            <span className="block text-[#45a5ff]">digital solutions.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Explore example concepts across software, cybersecurity,
            infrastructure, analytics, and digital growth. Each concept
            represents the kind of challenge VEXORA can help businesses
            approach.
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
              Discuss Your Project
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
              Selected Concepts
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Technology across disciplines.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-gray-400">
            Illustrative project concepts, not claims of completed client work.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.number}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#0c1119] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#1687ff]/50"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-sm font-semibold tracking-widest text-[#45a5ff]">
                  {project.number}
                </span>
                <span className="h-10 w-10 rounded-xl border border-[#1687ff]/30 bg-[#1687ff]/10 transition group-hover:bg-[#1687ff]/20" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                {project.category}
              </p>

              <h3 className="mt-3 text-xl font-semibold leading-snug">
                {project.title}
              </h3>

              <p className="mt-4 flex-1 text-sm leading-7 text-gray-400">
                {project.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
            Have an Idea?
          </p>

          <h2 className="mx-auto max-w-3xl text-3xl font-bold sm:text-5xl">
            Your next project starts with a conversation.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
            Tell us what you want to build, improve, or protect. Let’s explore
            the right solution for your business.
          </p>

          <Link
            href="/#contact"
            className="mt-8 inline-flex rounded-lg bg-[#1687ff] px-7 py-3 font-semibold transition hover:bg-[#0875e5]"
          >
            Contact VEXORA
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        © 2026 VEXORA. All rights reserved.
      </footer>
    </main>
  );
}
