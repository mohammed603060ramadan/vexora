"use client";

import Link from "next/link";
import { useState } from "react";

type FormKind = "client" | "student";
type FormState = {
  fullName: string; email: string; phone: string; company: string; service: string;
  budget: string; message: string; country: string; educationLevel: string;
  track: string; experience: string; motivation: string; website: string;
};
const initialForm: FormState = {
  fullName: "", email: "", phone: "", company: "", service: "", budget: "",
  message: "", country: "", educationLevel: "", track: "", experience: "",
  motivation: "", website: "",
};
const fieldClass = "mt-2 w-full rounded-xl border border-white/10 bg-[#080d16] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10";

export default function RegistrationForm({ kind }: { kind: FormKind }) {
  const isStudent = kind === "student";
  const [form, setForm] = useState<FormState>(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setSuccess(false);
    const endpoint = isStudent ? "/api/student-registration" : "/api/contact";
    const payload = isStudent ? {
      full_name: form.fullName, email: form.email, phone: form.phone,
      country: form.country, education_level: form.educationLevel, track: form.track,
      experience: form.experience, motivation: form.motivation, website: form.website,
    } : {
      name: form.fullName, email: form.email, phone: form.phone, company: form.company,
      service: form.service,
      subject: form.budget ? "Estimated budget: " + form.budget : "Website client inquiry",
      message: form.message, website: form.website,
    };
    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) { setError(result.error || "We could not submit the form. Please try again."); return; }
      setForm(initialForm); setSuccess(true);
    } catch {
      setError("A network error occurred. Please check your connection and try again.");
    } finally { setBusy(false); }
  }
  return (
    <main className="min-h-screen bg-[#060a11] px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-300 transition hover:text-white"><span aria-hidden="true">←</span> Back to VEXORA</Link>
        <header className={"mt-8 rounded-3xl border p-6 sm:p-9 " + (isStudent ? "border-cyan-400/15 bg-gradient-to-br from-[#10283a] via-[#0c1421] to-[#090e17]" : "border-blue-400/15 bg-gradient-to-br from-[#12213a] via-[#0c1421] to-[#090e17]")}>
          <p className={"text-xs font-semibold uppercase tracking-[0.22em] " + (isStudent ? "text-cyan-300" : "text-blue-300")}>{isStudent ? "VEXORA Academy / Registration" : "VEXORA / Business"}</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{isStudent ? "Start your learning journey" : "Tell us about your project"}<span className={isStudent ? "text-cyan-300" : "text-blue-400"}>.</span></h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{isStudent ? "Tell us about yourself and the technology track you want to explore. Your registration will be saved for the Academy team to review." : "Share your contact details and what you want to achieve. Your inquiry will be saved for the VEXORA team to review."}</p>
        </header>
        {success && <div role="status" className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-4 text-sm leading-6 text-emerald-200">{isStudent ? "Registration received successfully. This request does not automatically create a student account or enroll you in a course." : "Your inquiry has been received. The VEXORA team can now review it in the administration workspace."}</div>}
        {error && <div role="alert" className="mt-5 rounded-2xl border border-rose-400/25 bg-rose-400/[0.07] p-4 text-sm leading-6 text-rose-200">{error}</div>}
        <form onSubmit={submit} className="mt-6 space-y-5 rounded-3xl border border-white/[0.08] bg-[#0b1019] p-5 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">Full name *
              <input className={fieldClass} autoComplete="name" maxLength={100} required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Your full name" />
            </label>
            <label className="block text-sm text-slate-300">Email address *
              <input className={fieldClass} type="email" autoComplete="email" maxLength={254} required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
            </label>
            <label className="block text-sm text-slate-300">Phone number
              <input className={fieldClass} type="tel" autoComplete="tel" maxLength={40} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+20 ..." />
            </label>
            {isStudent ? (
              <label className="block text-sm text-slate-300">Country
                <input className={fieldClass} autoComplete="country-name" maxLength={100} value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Your country" />
              </label>
            ) : (
              <label className="block text-sm text-slate-300">Company / organization
                <input className={fieldClass} autoComplete="organization" maxLength={150} value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Company name (optional)" />
              </label>
            )}
          </div>
          {isStudent ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">Education level
                  <select className={fieldClass} value={form.educationLevel} onChange={(e) => update("educationLevel", e.target.value)}>
                    <option value="">Select (optional)</option><option>Secondary school</option><option>University student</option><option>Graduate</option><option>Working professional</option><option>Other</option>
                  </select>
                </label>
                <label className="block text-sm text-slate-300">Learning track *
                  <select className={fieldClass} required value={form.track} onChange={(e) => update("track", e.target.value)}>
                    <option value="">Choose a track</option><option>Software Development</option><option>Cybersecurity</option><option>Networks & Infrastructure</option><option>Data Analytics</option><option>Digital Marketing</option><option>General Technology</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm text-slate-300">Current experience
                <textarea className={fieldClass} rows={3} maxLength={2000} value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="Current skills or experience (optional)." />
              </label>
              <label className="block text-sm text-slate-300">Why do you want to join?
                <textarea className={fieldClass} rows={4} maxLength={3000} value={form.motivation} onChange={(e) => update("motivation", e.target.value)} placeholder="Your goals and what you hope to learn (optional)." />
              </label>
            </>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">Service you are interested in
                  <select className={fieldClass} value={form.service} onChange={(e) => update("service", e.target.value)}>
                    <option value="">Choose a service</option><option>Software Development</option><option>Cybersecurity</option><option>Networks & Infrastructure</option><option>Data Analytics</option><option>Digital Marketing</option><option>Other / Not sure yet</option>
                  </select>
                </label>
                <label className="block text-sm text-slate-300">Estimated budget
                  <select className={fieldClass} value={form.budget} onChange={(e) => update("budget", e.target.value)}>
                    <option value="">Prefer to discuss</option><option>Under $500</option><option>$500–$2,000</option><option>$2,000–$5,000</option><option>$5,000+</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm text-slate-300">Project details *
                <textarea className={fieldClass} rows={6} minLength={10} maxLength={5000} required value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Describe your goals, needs, timeline, or challenges..." />
              </label>
            </>
          )}
          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></label>
          </div>
          <button type="submit" disabled={busy} className={"inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 " + (isStudent ? "bg-cyan-500 text-slate-950 hover:bg-cyan-300" : "bg-blue-500 text-white hover:bg-blue-400")}>{busy ? "Submitting..." : isStudent ? "Submit student registration" : "Send project inquiry"}</button>
          <p className="text-xs leading-5 text-slate-500">{isStudent ? "Submitting this form does not create a login account, enroll you in a course, or issue a certificate automatically." : "Submitting this form sends an inquiry only; it does not automatically create a client account or start a project."}</p>
        </form>
      </div>
    </main>
  );
}
