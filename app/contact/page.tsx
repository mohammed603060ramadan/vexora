
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

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

const inputClassName =
  "mt-2 w-full rounded-lg border border-white/10 bg-[#080b10] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#1687ff]";

const labelClassName = "block text-sm font-medium text-gray-300";

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  subject: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function updateField(
    field: keyof FormData,
    value: string,
  ) {
    setForm((current) => ({ ...current, [field]: value }));

    if (feedback) {
      setFeedback(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          service: form.service,
          subject: form.subject,
          message: form.message,
        }),
      });

      const result: { success?: boolean; error?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "We could not send your inquiry. Please try again.",
        );
      }

      setFeedback({
        type: "success",
        message:
          "Thank you! Your inquiry has been received. Our team will review your message.",
      });

      setForm(initialForm);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b10] text-white">
      <header className="border-b border-white/10">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6 lg:px-10"
        >
          <Link
            href="/"
            className="shrink-0 text-2xl font-bold tracking-[0.2em]"
          >
            VEXORA<span className="text-[#1687ff]">.</span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-gray-300 sm:gap-6">
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
              href="/about"
              className="transition hover:text-[#45a5ff]"
            >
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
            Let&apos;s build
            <span className="block text-[#45a5ff]">
              what comes next.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Have a project in mind, a technical challenge to solve, or an
            idea you want to explore? Get in touch with our team and let&apos;s
            discuss how we can help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
            Get in Touch
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Tell us what you&apos;re working on.
          </h2>

          <p className="mt-6 max-w-lg leading-8 text-gray-400">
            Whether you need software development, cybersecurity, network
            infrastructure, data analytics, or digital marketing, tell us
            about your goals and we&apos;ll help you find the right solution.
          </p>

          <div className="mt-8 space-y-4">
            {contactMethods.map((method) => (
              <a
                key={method.number}
                href={method.href}
                target={
                  method.href.startsWith("https://")
                    ? "_blank"
                    : undefined
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

        <div
          id="contact-form"
          className="rounded-2xl border border-white/10 bg-[#0c1119] p-6 sm:p-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
            Start a Conversation
          </p>

          <h3 className="mt-4 text-2xl font-bold">
            Tell us about your project.
          </h3>

          <p className="mt-4 leading-7 text-gray-400">
            Complete the form below. Your inquiry will be sent to our team
            and saved for follow-up.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className={labelClassName}>
                  Full name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="Your name"
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className={labelClassName}>
                  Email address *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  placeholder="you@example.com"
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className={labelClassName}>
                  Phone number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="Your phone number"
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="contact-company" className={labelClassName}>
                  Company
                </label>
                <input
                  id="contact-company"
                  name="company"
                  autoComplete="organization"
                  maxLength={150}
                  value={form.company}
                  onChange={(event) =>
                    updateField("company", event.target.value)
                  }
                  placeholder="Company name (optional)"
                  className={inputClassName}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-service" className={labelClassName}>
                Service you&apos;re interested in
              </label>
              <select
                id="contact-service"
                name="service"
                value={form.service}
                onChange={(event) =>
                  updateField("service", event.target.value)
                }
                className={inputClassName}
              >
                <option value="">Select a service (optional)</option>
                <option value="Software Development">
                  Software Development
                </option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Networks & Infrastructure">
                  Networks &amp; Infrastructure
                </option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-subject" className={labelClassName}>
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                maxLength={200}
                value={form.subject}
                onChange={(event) =>
                  updateField("subject", event.target.value)
                }
                placeholder="What is your inquiry about?"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="contact-message" className={labelClassName}>
                Project details *
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={6}
                value={form.message}
                onChange={(event) =>
                  updateField("message", event.target.value)
                }
                placeholder="Tell us about your goals, requirements, or technical challenge..."
                className={`${inputClassName} resize-y`}
              />
              <p className="mt-2 text-right text-xs text-gray-500">
                {form.message.length}/5000 characters
              </p>
            </div>

            {feedback && (
              <div
                role={feedback.type === "success" ? "status" : "alert"}
                aria-live="polite"
                className={`rounded-lg border p-4 text-sm leading-6 ${
                  feedback.type === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-300"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-lg bg-[#1687ff] px-6 py-3.5 font-semibold transition hover:bg-[#0875e5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending inquiry..." : "Send Inquiry"}
            </button>

            <p className="text-xs leading-5 text-gray-500">
              Fields marked with * are required. Your information will be
              used to respond to your inquiry.
            </p>
          </form>
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
        &copy; 2026 VEXORA. All rights reserved.
      </footer>
    </main>
  );
}
