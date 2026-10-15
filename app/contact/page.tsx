import Link from "next/link";

const contactMethods = [
  {
    number: "01",
    title: "Email",
    description: "Send us details about your project or inquiry.",
    value: "vexore.mr@gmail.com",
    href: "mailto:vexore.mr@gmail.com",
  },
  {
    number: "02",
    title: "WhatsApp",
    description: "Contact us directly to discuss your requirements.",
    value: "Chat with VEXORA",
    href: "https://wa.me/201115449868",
  },
];

export default function ContactPage() {
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
            <Link
              href="/projects"
              className="transition hover:text-[#45a5ff]"
            >
              Projects
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative border-b border-white/10">
        <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-[#1687ff]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-[#45a5ff]">
            Contact VEXORA
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Let’s build
            <span className="block text-[#45a5ff]">what comes next.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Have a project in mind, a technical challenge to solve, or an idea
            you want to explore? Get in touch with our team and let’s discuss
            how we can help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
            Get in Touch
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Tell us what you’re working on.
          </h2>

          <p className="mt-6 max-w-lg leading-8 text-gray-400">
            Whether you need software development, cybersecurity, network
            infrastructure, data analytics, or digital marketing, you can
            contact us through either channel.
          </p>

          <div className="mt-8 space-y-4">
            {contactMethods.map((method) => (
              <a
                key={method.number}
                href={method.href}
                target={
                  method.href.startsWith("https://") ? "_blank" : undefined
                }
                rel={
                  method.href.startsWith("https://")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex items-start gap-5 rounded-2xl border border-white/10 bg-[#0c1119] p-6 transition hover:border-[#1687ff]/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1687ff]/30 bg-[#1687ff]/10 text-sm font-semibold text-[#45a5ff]">
                  {method.number}
                </span>

                <span className="min-w-0">
                  <span className="block text-lg font-semibold">
                    {method.title}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-gray-400">
                    {method.description}
                  </span>
                  <span className="mt-3 block break-words text-sm font-medium text-[#45a5ff] transition group-hover:text-white">
                    {method.value}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c1119] p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
            Start a Conversation
          </p>

          <h3 className="mt-4 text-2xl font-bold">
            Ready to take the next step?
          </h3>

          <p className="mt-4 leading-7 text-gray-400">
            Contact us with a short description of your goals, your current
            challenge, or the solution you have in mind.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href="mailto:vexore.mr@gmail.com?subject=Project%20Inquiry%20-%20VEXORA"
              className="flex w-full items-center justify-center rounded-lg bg-[#1687ff] px-6 py-3 font-semibold transition hover:bg-[#0875e5]"
            >
              Email Our Team
            </a>

            <a
              href="https://wa.me/201115449868"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-lg border border-white/15 px-6 py-3 font-semibold transition hover:border-[#45a5ff] hover:text-[#45a5ff]"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-sm leading-7 text-gray-500">
              To help us understand your needs, include your project goals,
              expected features, and any relevant timeline in your message.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center lg:px-10">
          <p className="text-gray-400">
            Not sure which service you need?
            <Link
              href="/services"
              className="ml-2 font-semibold text-[#45a5ff] transition hover:text-white"
            >
              Explore our services
            </Link>
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        © 2026 VEXORA. All rights reserved.
      </footer>
    </main>
  );
}
