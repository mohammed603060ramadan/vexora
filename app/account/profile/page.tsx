"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/browser";

type AccountType = "student" | "client";
type Activity = { id: string; title: string; description: string | null; created_at: string; activity_type: string };

export default function AccountProfilePage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("client");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const logActivity = useCallback(async (activity_type: string) => {
    const response = await fetch("/api/account/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activity_type }),
    });
    if (!response.ok) throw new Error("The activity could not be recorded.");
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!active) return;
      if (authError || !user) {
        router.replace("/login?next=/account/profile");
        return;
      }
      const [{ data: profile, error: profileError }, historyResponse] = await Promise.all([
        supabase.from("profiles").select("full_name,avatar_url,account_type").eq("id", user.id).maybeSingle(),
        fetch("/api/account/activity", { cache: "no-store" }),
      ]);
      const historyPayload = historyResponse.ok ? await historyResponse.json() as { activities?: Activity[] } : { activities: [] };
      if (!active) return;
      if (profileError || !profile || (profile.account_type !== "student" && profile.account_type !== "client")) {
        setError("We could not verify your account profile. Please contact VEXORA support.");
        setLoading(false);
        return;
      }
      setAccountType(profile.account_type);
      setFullName(profile.full_name || user.user_metadata?.full_name || "");
      setAvatarUrl(profile.avatar_url || "");
      setEmail(user.email || "");
      setActivities(Array.isArray(historyPayload.activities) ? historyPayload.activities : []);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [router]);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setNotice("");
    if (fullName.trim().length < 2) { setError("Enter a name with at least 2 characters."); return; }
    if (avatarUrl.trim()) {
      try {
        const parsed = new URL(avatarUrl.trim());
        if (parsed.protocol !== "https:") throw new Error();
      } catch { setError("Avatar image must use a valid HTTPS URL."); return; }
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    const { error: updateError } = await supabase.from("profiles").update({
      full_name: fullName.trim(),
      avatar_url: avatarUrl.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    if (updateError) { setError(updateError.message); setSaving(false); return; }
    try { await logActivity("profile_updated"); } catch { /* profile save remains successful */ }
    setNotice("Your profile has been saved.");
    setSaving(false);
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    if (password.length < 8) { setError("Use at least 8 characters for your new password."); return; }
    if (password !== confirmPassword) { setError("The passwords do not match."); return; }
    setPasswordBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) { setError(updateError.message); setPasswordBusy(false); return; }
    try { await logActivity("password_changed"); } catch { /* do not misreport a successful password update */ }
    setPassword(""); setConfirmPassword("");
    setNotice("Your password was changed successfully.");
    setPasswordBusy(false);
  }

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try { await logActivity("logout"); } catch { /* sign out must remain available */ }
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) { setError(signOutError.message); setSigningOut(false); return; }
    router.replace("/login"); router.refresh();
  }

  if (loading) return <main className="min-h-screen grid place-items-center bg-[#060b14] text-slate-300">Loading secure account settings…</main>;

  return (
    <main className="min-h-screen bg-[#060b14] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><Link href={accountType === "student" ? "/student" : "/client"} className="text-sm text-cyan-300 hover:text-white">← Back to {accountType === "student" ? "Student Space" : "Client Portal"}</Link><p className="mt-4 text-xs font-bold uppercase tracking-[.28em] text-cyan-400">VEXORA / ACCOUNT CENTER</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Profile & Security</h1><p className="mt-2 text-sm text-slate-400">Manage your identity, credentials and account activity.</p></div>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">{accountType} account</span>
        </header>
        {(error || notice) && <div role="status" className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"}`}>{error || notice}</div>}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#111f32] to-[#0a111d] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold">Personal information</h2><p className="mt-1 text-sm text-slate-400">Keep your VEXORA account details up to date.</p>
            <form onSubmit={saveProfile} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-300">Full name<input value={fullName} onChange={e=>setFullName(e.target.value)} required minLength={2} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1b] px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="block text-sm text-slate-300">Email address <span className="ml-1 text-xs text-slate-500">Managed by secure sign-in</span><input value={email} readOnly className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-slate-400" /></label>
              <label className="block text-sm text-slate-300">Avatar image URL <span className="text-xs text-slate-500">(optional HTTPS)</span><input value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} type="url" placeholder="https://…" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1b] px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <button disabled={saving} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50">{saving ? "Saving…" : "Save profile"}</button>
            </form>
          </section>
          <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#111f32] to-[#0a111d] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold">Password & access</h2><p className="mt-1 text-sm text-slate-400">Choose a strong password that you do not reuse elsewhere.</p>
            <form onSubmit={changePassword} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-300">New password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" minLength={8} required className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1b] px-4 py-3 outline-none focus:border-cyan-300" /></label>
              <label className="block text-sm text-slate-300">Confirm new password<input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} autoComplete="new-password" minLength={8} required className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1b] px-4 py-3 outline-none focus:border-cyan-300" /></label>
              <button disabled={passwordBusy} className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/20 disabled:opacity-50">{passwordBusy ? "Updating…" : "Change password"}</button>
            </form>
            <div className="mt-8 border-t border-white/10 pt-5"><button onClick={()=>void signOut()} disabled={signingOut} className="w-full rounded-xl border border-rose-400/30 bg-rose-400/[.07] px-4 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-400/15 disabled:opacity-50">{signingOut ? "Signing out…" : "Sign out of VEXORA"}</button><p className="mt-2 text-xs text-slate-500">Your session will end on this device.</p></div>
          </section>
        </div>
        <section className="mt-6 rounded-2xl border border-white/10 bg-[#0c1523] p-6">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.24em] text-cyan-400">ACCOUNT AUDIT</p><h2 className="mt-2 text-xl font-semibold">Recent activity</h2><p className="mt-1 text-sm text-slate-400">A private timeline of activity recorded for your account.</p></div><span className="text-xs text-slate-500">Latest 30 events</span></div>
          <div className="mt-6 space-y-4">
            {activities.length ? activities.map(item=><article key={item.id} className="flex gap-4 border-l border-cyan-400/30 pl-4"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_14px_#67e8f9]" /><div className="min-w-0"><h3 className="text-sm font-semibold">{item.title}</h3><p className="mt-1 text-sm text-slate-400">{item.description}</p><time className="mt-2 block text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</time></div></article>) : <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-slate-500">No activity has been recorded yet. New account events will appear here.</p>}
          </div>
        </section>
        <p className="mt-8 text-center text-xs text-slate-600">VEXORA • Secure account management</p>
      </div>
    </main>
  );
}
