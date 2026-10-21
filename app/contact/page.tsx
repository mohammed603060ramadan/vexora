"use client";

import Image from "next/image";
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

const socialLinks = [
  {
    name: "LinkedIn",
    shortName: "IN",
    href: "https://www.linkedin.com/in/mohammad-ramadan-706b89440?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    description: "Connect with Mohammad Ramadan on LinkedIn",
  },
  {
    name: "Instagram",
    shortName: "IG",
    href: "https://www.instagram.com/vexoramohammed/",
    description: "Follow VEXORA on Instagram",
  },
  {
    name: "Facebook",
    shortName: "FB",
    href: "https://www.facebook.com/share/19hrz2yVC7/",
    description: "Follow VEXORA on Facebook",
  },
  {
    name: "TikTok",
    shortName: "TK",
    href: "https://www.tiktok.com/@vexoramohammed",
    description: "Follow VEXORA on TikTok",
  },
];

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#080c13]/90 px-4 py-3.5 text-white outline-none transition-all duration-300 placeholder:text-gray-600 hover:border-white/20 focus:border-[#1687ff] focus:bg-[#0a1019] focus:ring-2 focus:ring-[#1687ff]/10";

const labelClassName =
  "block text-sm font-medium tracking-wide text-gray-300";

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

function SocialIcon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  if (name === "LinkedIn") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V8.99h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.56 20.45h3.57V8.99H3.56v11.46ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={className}
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "Facebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.71 4.53-4.71 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.07 24 18.09 24 12.07Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93Zm-1.29 19.52h2.04L6.48 3.2H4.29L17.61 20.67Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path d="M4 10h11" />
      <path d="m11 5 5 5-5 5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M11 3h6v6" />
      <path d="m17 3-8 8" />
      <path d="M15 11v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

function NetworkVisual() {
  return (
    <div
      className="relative h-[390px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101a]/80 shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(22,135,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(22,135,255,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(22,135,255,0.16),transparent_42%)]" />

      <div className="absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-[#45a5ff] shadow-[0_0_20px_#1687ff] vexora-pulse-dot" />
      <div className="absolute right-[17%] top-[28%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_#22d3ee] vexora-pulse-dot" />
      <div className="absolute left-[23%] bottom-[25%] h-2 w-2 rounded-full bg-[#45a5ff] shadow-[0_0_20px_#1687ff] vexora-pulse-dot" />
      <div className="absolute right-[25%] bottom-[20%] h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_20px_#1687ff] vexora-pulse-dot" />

      <div className="absolute left-[14%] top-[23%] h-px w-[70%] rotate-[17deg] bg-gradient-to-r from-transparent via-[#1687ff]/50 to-transparent" />
      <div className="absolute left-[20%] top-[50%] h-px w-[62%] -rotate-[19deg] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="absolute left-[25%] top-[27%] h-[48%] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-[#1687ff]/35 to-transparent" />

      <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#1687ff]/30 bg-[#07111d]/90 shadow-[0_0_70px_rgba(22,135,255,0.22)]">
        <div className="absolute inset-3 rounded-full border border-[#45a5ff]/20" />
        <div className="absolute inset-6 rounded-full border border-cyan-300/10" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#1687ff]/40 bg-[#0b1725] shadow-[0_0_35px_rgba(22,135,255,0.25)]">
          <span className="text-lg font-black tracking-[0.18em] text-white">
            VX
          </span>
        </div>
      </div>

      <div className="absolute left-6 top-6 rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-gray-500 backdrop-blur-md">
        VEXORA / CHANNEL
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 font-mono text-[10px] tracking-[0.15em] text-emerald-300 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
        SECURE / READY
      </div>

      <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1687ff]/10 animate-[spin_18s_linear_infinite]" />
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function updateField(field: keyof FormData, value: string) {
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
    <main className="relative min-h-screen overflow-hidden bg-[#05080d] text-white selection:bg-[#1687ff]/30">
      {/* Global technical atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(22,135,255,0.12),transparent_30%),radial-gradient(circle_at_85%_40%,rgba(34,211,238,0.06),transparent_25%),radial-gradient(circle_at_50%_100%,rgba(22,135,255,0.07),transparent_35%)]" />

        <div className="absolute left-[-10%] top-[15%] h-[28rem] w-[28rem] rounded-full bg-[#1687ff]/7 blur-[130px]" />
        <div className="absolute right-[-10%] top-[45%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/5 blur-[140px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1687ff]/60 to-transparent" />

        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#45a5ff]/30 to-transparent animate-[vexora-scan_7s_linear_infinite]" />

        <div className="absolute left-[8%] top-[35%] h-[1px] w-[84%] rotate-[-8deg] bg-gradient-to-r from-transparent via-[#1687ff]/10 to-transparent" />
        <div className="absolute left-[5%] top-[70%] h-[1px] w-[90%] rotate-[6deg] bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05080d]/75 backdrop-blur-2xl">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-6 lg:px-10"
          >
            <Link
              href="/"
              className="group relative shrink-0"
              aria-label="VEXORA Home"
            >
              <span className="absolute -inset-3 rounded-2xl bg-[#1687ff]/10 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

              <Image
                src="/vexora-logo.png"
                alt="VEXORA"
                width={180}
                height={58}
                priority
                className="relative h-auto w-[145px] object-contain sm:w-[165px]"
              />
            </Link>

            <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-gray-300 sm:gap-5 sm:text-sm">
              <Link
                href="/"
                className="rounded-lg px-2 py-2 transition hover:bg-white/5 hover:text-[#45a5ff]"
              >
                Home
              </Link>

              <Link
                href="/services"
                className="rounded-lg px-2 py-2 transition hover:bg-white/5 hover:text-[#45a5ff]"
              >
                Services
              </Link>

              <Link
                href="/about"
                className="rounded-lg px-2 py-2 transition hover:bg-white/5 hover:text-[#45a5ff]"
              >
                About
              </Link>

              <Link
                href="/projects"
                className="rounded-lg px-2 py-2 transition hover:bg-white/5 hover:text-[#45a5ff]"
              >
                Projects
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section className="relative border-b border-white/10">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10 lg:py-28">
            <div>
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#1687ff]/20 bg-[#1687ff]/5 px-4 py-2 font-mono text-[10px] tracking-[0.22em] text-[#45a5ff] shadow-[0_0_30px_rgba(22,135,255,0.08)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#45a5ff] shadow-[0_0_12px_#1687ff]" />
                CONTACT VEXORA
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
                Let&apos;s build
                <span className="block bg-gradient-to-r from-[#45a5ff] via-[#7cc4ff] to-white bg-clip-text text-transparent">
                  what comes next.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
                Have a project in mind, a technical challenge to solve, or an
                idea you want to explore? Get in touch with our team and let&apos;s
                discuss how we can help.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500">
                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  RESPONSE / FAST
                </span>
                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  CHANNEL / SECURE
                </span>
                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  STATUS / ONLINE
                </span>
              </div>
            </div>

            <NetworkVisual />
          </div>
        </section>

        {/* Main Contact Area */}
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          {/* Contact Information */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
              Get in Touch
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
                  className="group relative flex items-start gap-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#1687ff]/40 hover:bg-[#1687ff]/[0.045] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                >
                  <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#1687ff] to-transparent opacity-0 transition group-hover:opacity-100" />

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1687ff]/30 bg-[#1687ff]/10 text-sm font-semibold text-[#45a5ff] shadow-[0_0_25px_rgba(22,135,255,0.08)]">
                    {method.number}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-lg font-semibold">
                      {method.title}
                    </span>

                    <span className="mt-2 block text-sm leading-6 text-gray-400">
                      {method.description}
                    </span>

                    <span className="mt-3 flex items-center gap-2 break-words text-sm font-medium text-[#45a5ff] transition group-hover:text-white">
                      {method.value}
                      <ArrowIcon />
                    </span>
                  </span>
                </a>
              ))}
            </div>

            {/* Social Media */}
            <div className="mt-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.25em] text-gray-500">
                  CONNECT / SOCIAL
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.description}
                    title={social.description}
                    className="group relative flex min-h-[108px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#1687ff]/40 hover:bg-[#1687ff]/[0.06] hover:shadow-[0_18px_50px_rgba(22,135,255,0.12)]"
                  >
                    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1687ff] to-transparent opacity-0 transition group-hover:opacity-100" />

                    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-[#45a5ff] transition-all duration-300 group-hover:border-[#1687ff]/40 group-hover:bg-[#1687ff]/10 group-hover:text-white">
                      <SocialIcon name={social.name} />
                    </span>

                    <span className="text-xs font-semibold text-gray-300 transition group-hover:text-white">
                      {social.name}
                    </span>

                    <span className="mt-1 font-mono text-[8px] tracking-[0.18em] text-gray-600 group-hover:text-[#45a5ff]/70">
                      OPEN
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            id="contact-form"
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-10"
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#1687ff] to-transparent" />

            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#1687ff]/8 blur-[80px]" />

            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
                  Start a Conversation
                </p>

                <span className="hidden items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 font-mono text-[9px] tracking-[0.14em] text-emerald-300 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
                  ONLINE
                </span>
              </div>

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
                    <label
                      htmlFor="contact-company"
                      className={labelClassName}
                    >
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
                    <option value="Digital Marketing">
                      Digital Marketing
                    </option>
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
                    className={`rounded-xl border p-4 text-sm leading-6 ${
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
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-[#1687ff]/40 bg-[#1687ff] px-6 py-3.5 font-semibold shadow-[0_12px_35px_rgba(22,135,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0875e5] hover:shadow-[0_18px_45px_rgba(22,135,255,0.28)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Sending inquiry..." : "Send Inquiry"}
                  </span>

                  {!isSubmitting && (
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  )}
                </button>

                <p className="text-xs leading-5 text-gray-500">
                  Fields marked with * are required. Your information will be
                  used to respond to your inquiry.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Social Network Strip */}
        <section className="border-y border-white/10 bg-white/[0.015]">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-[#45a5ff]">
                  VEXORA NETWORK
                </p>

                <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Stay connected with VEXORA.
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={`network-${social.name}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.description}
                    className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300 transition-all duration-300 hover:border-[#1687ff]/40 hover:bg-[#1687ff]/10 hover:text-white"
                  >
                    <SocialIcon
                      name={social.name}
                      className="h-4 w-4 text-[#45a5ff] transition group-hover:text-white"
                    />

                    <span>{social.name}</span>

                    <ExternalIcon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Existing CTA */}
        <section className="border-t border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-14 text-center lg:px-10">
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

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#03060a] px-6 py-10 text-center text-sm text-gray-500">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6">
            <Link
              href="/"
              aria-label="VEXORA Home"
              className="group relative"
            >
              <span className="absolute -inset-3 rounded-xl bg-[#1687ff]/10 opacity-0 blur-xl transition group-hover:opacity-100" />

              <Image
                src="/vexora-logo.png"
                alt="VEXORA"
                width={160}
                height={52}
                className="relative h-auto w-[125px] object-contain opacity-80 transition group-hover:opacity-100"
              />
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={`footer-${social.name}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.description}
                  title={social.description}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1687ff]/40 hover:bg-[#1687ff]/10 hover:text-[#45a5ff]"
                >
                  <SocialIcon name={social.name} className="h-4 w-4" />
                </a>
              ))}
            </div>

            <p>&copy; 2026 VEXORA. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes vexora-scan {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          50% {
            opacity: 0.7;
          }

          90% {
            opacity: 1;
          }

          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}