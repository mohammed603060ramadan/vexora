
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";

export default function AccountSecurityPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !user) {
        router.replace("/login?next=/account/security");
        return;
      }

      setEmail(user.email ?? "");
      setCheckingSession(false);
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (password.length < 8) {
      setMessage("The new password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
      setMessage("Your password has been changed successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <p className="text-sm text-slate-400">
          Checking your account...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.25em] text-cyan-400"
        >
          VEXORA
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          Account security
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Change your password to help keep your account secure.
        </p>

        <div className="mt-6 rounded-lg border border-white/10 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Signed in as
          </p>
          <p className="mt-1 break-all text-sm text-slate-200">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm text-slate-300"
            >
              New password
            </label>

            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm text-slate-300"
            >
              Confirm new password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="Enter the new password again"
            />
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`rounded-lg border p-3 text-sm leading-6 ${
                success
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-white/10 bg-slate-900 text-slate-300"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm">
          <Link
            href="/student"
            className="text-slate-400 hover:text-white"
          >
            Student portal
          </Link>

          <Link
            href="/client"
            className="text-slate-400 hover:text-white"
          >
            Client portal
          </Link>

          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
