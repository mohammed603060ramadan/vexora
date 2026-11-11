"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

const WHATSAPP_NUMBER = "201115449868";
const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "Technology strategy",
  message: "",
};

const fieldClass = "mt-2 w-full rounded-xl border border-white/10 bg-[#060d16] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-400/10";

export default function ConsultationPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const whatsappHref = useMemo(() => {
    const message = [
      "Hello VEXORA, I would like to request a free consultation.",
      "",
      `Name: ${form.name || "Not provided"}`,
      `Email: ${form.email || "Not provided"}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Company / Project: ${form.company || "Not provided"}`,
      `Consultation area: ${form.service}`,
      "",
      "How can VEXORA help?",
      form.message || "I would like to discuss my requirements.",
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [form]);

  async function submitConsultation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: "Free consultation request" }),
      });
      const result = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || "We could not submit your request. Please try again.");
      setFeedback({ type: "success", message: "Your consultation request has been sent successfully. The VEXORA team will contact you soon." });
      setForm(initialForm);
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "A network error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050a12] px-4 py-12 text-white sm:px-6 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(22,135,255,.16),transparent_38%),radial-gradient(ellipse_at_90%_75%,rgba(34,211,238,.09),transparent_35%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(125,180,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(125,180,255,.15)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="relative mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-sky-300">← Back to VEXORA</Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
          <section className="pt-2">
            <p className="text-xs font-bold uppercase tracking-[.28em] text-sky-300">VEXORA / ADVISORY</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl xl:text-6xl">Let&apos;s find the <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-200 bg-clip-text text-transparent">right next step.</span></h1>
            <p className="mt-6 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">Tell us what you are working on, what is holding you back, or where you want to grow. Request a complimentary first consultation with the VEXORA team.</p>

            <div className="mt-9 space-y-5">
              {[
                ["01", "Understand your needs", "We review your goals, challenges, and current situation."],
                ["02", "Explore suitable solutions", "We identify practical options across technology and digital services."],
                ["03", "Agree on clear next steps", "You get an initial direction with no consultation fee or obligation."],
              ].map(([number, title, detail]) => (
                <div key={number} className="flex gap-4 border-l border-sky-400/30 pl-4">
                  <span className="pt-1 font-mono text-xs text-sky-300">{number}</span>
                  <div><h2 className="text-sm font-semibold text-white">{title}</h2><p className="mt-1 text-xs leading-6 text-slate-400">{detail}</p></div>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-md text-xs leading-6 text-slate-500">The initial consultation and recommendations are free. Any separately agreed implementation or delivery work is outside this session.</p>
          </section>

          <section className="rounded-3xl border border-sky-300/15 bg-[#0b1624]/90 p-5 shadow-[0_28px_100px_rgba(0,0,0,.4)] backdrop-blur-xl sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-sky-300">Start a conversation</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Request your free consultation</h2><p className="mt-2 text-sm leading-6 text-slate-400">Complete the form, then choose how you would like to reach us.</p></div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-sky-300/20 bg-sky-300/[.07] text-xl text-sky-200">✳</span>
            </div>

            <form onSubmit={submitConsultation}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-300">Full name *<input required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={fieldClass} placeholder="Your name" /></label>
                <label className="text-xs font-semibold text-slate-300">Email address *<input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className={fieldClass} placeholder="you@example.com" /></label>
                <label className="text-xs font-semibold text-slate-300">Phone / WhatsApp<input type="tel" maxLength={40} autoComplete="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className={fieldClass} placeholder="+20..." /></label>
                <label className="text-xs font-semibold text-slate-300">Company / project<input maxLength={150} value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className={fieldClass} placeholder="Optional" /></label>
                <label className="text-xs font-semibold text-slate-300 sm:col-span-2">Consultation area<select value={form.service} onChange={(event) => setForm((current) => ({ ...current, service: event.target.value }))} className={fieldClass}><option>Technology strategy</option><option>Software development</option><option>Cybersecurity</option><option>Networks & infrastructure</option><option>Data analytics</option><option>Digital marketing</option><option>Other / not sure yet</option></select></label>
                <label className="text-xs font-semibold text-slate-300 sm:col-span-2">Your message *<textarea required minLength={10} maxLength={5000} rows={5} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className={`${fieldClass} resize-y leading-7`} placeholder="Describe what you need help with, your goals, or the challenge you are facing..." /></label>
              </div>

              {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${feedback.type === "success" ? "border-emerald-300/20 bg-emerald-300/[.06] text-emerald-100" : "border-rose-300/20 bg-rose-300/[.06] text-rose-200"}`}>{feedback.message}</p>}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="submit" disabled={loading} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Sending request..." : "Send consultation request"} <span aria-hidden="true">↗</span></button>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/[.08] px-5 py-4 text-sm font-bold text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-emerald-400/[.14]"><span aria-hidden="true">◉</span> Continue with WhatsApp</a>
              </div>
              <p className="mt-4 text-center text-[10px] leading-5 text-slate-500">Send saves your request to VEXORA. WhatsApp opens a prepared message for you to send directly.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
