"use client";

import { useEffect, useState } from "react";

type AssistantStatus = {
  configured: boolean;
  provider: string;
  model: string | null;
};

const suggestions = [
  "Create a practical 30-day sales and client acquisition plan for VEXORA.",
  "Review this software feature idea and turn it into a technical implementation plan.",
  "Build a defensive cybersecurity assessment checklist for a small business.",
  "Suggest useful KPIs for projects, clients, delivery, and business performance.",
];

export default function AdminAiPage() {
  const [status, setStatus] = useState<AssistantStatus | null>(null);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/ai", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not check AI configuration.");
        if (active) setStatus(data as AssistantStatus);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Could not check AI configuration.");
      });
    return () => { active = false; };
  }, []);

  async function submitPrompt(value = prompt) {
    const cleanPrompt = value.trim();
    if (!cleanPrompt || loading) return;
    setPrompt(cleanPrompt);
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The AI request failed.");
      setAnswer(typeof data.answer === "string" ? data.answer : "");
      if (typeof data.model === "string") {
        setStatus((current) => current ? { ...current, model: data.model } : current);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The AI request failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-12">
      <section className="relative overflow-hidden rounded-[28px] border border-sky-300/20 bg-[linear-gradient(120deg,#071426,#0a1b32_58%,#102b49)] p-6 shadow-[0_24px_80px_rgba(0,0,0,.24)] sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-sky-300/10 [box-shadow:0_0_0_32px_rgba(56,189,248,.025),0_0_0_72px_rgba(56,189,248,.018)]" />
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[.3em] text-sky-300">VEXORA Intelligence / AI Core</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">AI Assistant<span className="text-sky-400">.</span></h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">A private AI workspace for planning, technical analysis, cybersecurity guidance, data strategy, and daily operations.</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 text-slate-300">OpenAI Responses API</span>
            <span className={`rounded-full border px-3 py-1.5 ${status?.configured ? "border-emerald-300/20 bg-emerald-300/[.07] text-emerald-200" : "border-amber-300/20 bg-amber-300/[.07] text-amber-200"}`}>
              {status ? (status.configured ? "Provider configured" : "Configuration required") : "Checking configuration"}
            </span>
            {status?.model && <span className="rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 text-slate-400">{status.model}</span>}
          </div>
        </div>
      </section>

      {!status?.configured && status && (
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[.05] p-5 text-sm text-amber-100">
          <p className="font-semibold">Connect the AI provider to activate this workspace.</p>
          <p className="mt-2 leading-6 text-amber-100/75">Add OPENAI_API_KEY and OPENAI_MODEL as server-side environment variables in Vercel, then redeploy. Do not add the API key to any NEXT_PUBLIC variable or commit it to GitHub.</p>
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#091321]/90 p-5 sm:p-7">
        <label htmlFor="ai-prompt" className="text-sm font-semibold text-white">What should VEXORA AI help you with?</label>
        <textarea id="ai-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={8000} rows={6} placeholder="Ask for a business plan, technical review, project breakdown, defensive security checklist, or data analysis..." className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-[#050c17] p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-300/50 focus:ring-2 focus:ring-sky-300/10" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">{prompt.length.toLocaleString()} / 8,000 characters · Admin-only · No conversation storage</span>
          <button type="button" onClick={() => void submitPrompt()} disabled={loading || !prompt.trim() || !status?.configured} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Thinking..." : "Ask VEXORA AI"} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[.2em] text-slate-400">Suggested starting points</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" disabled={!status?.configured || loading} onClick={() => { setPrompt(suggestion); void submitPrompt(suggestion); }} className="rounded-xl border border-white/[.08] bg-[#091321]/70 p-4 text-left text-xs leading-6 text-slate-300 transition hover:border-sky-300/30 hover:bg-sky-400/[.04] disabled:cursor-not-allowed disabled:opacity-40">{suggestion}</button>
          ))}
        </div>
      </section>

      {error && <div role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[.06] p-4 text-sm leading-6 text-rose-200">{error}</div>}
      {(loading || answer) && (
        <section aria-live="polite" className="rounded-2xl border border-sky-300/15 bg-[#091321]/90 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-sky-200">VEXORA AI Response</h2>
            {loading && <span className="animate-pulse text-[10px] font-semibold uppercase tracking-widest text-sky-300">Generating</span>}
          </div>
          {loading ? <p className="mt-5 text-sm text-slate-400">Analyzing your request...</p> : <pre className="mt-5 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-200">{answer}</pre>}
        </section>
      )}
      <p className="text-[11px] leading-5 text-slate-600">AI output can be inaccurate. Review important business, technical, and security decisions before acting. This first release does not read or modify company database records.</p>
    </div>
  );
}
