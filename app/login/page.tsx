
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          throw error;
        }

        setMessage(
          data.session
            ? "Account created successfully."
            : "Account created. Check your email to confirm your address before signing in."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        router.push("/client");
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.25em] text-cyan-400"
        >
          VEXORA
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {mode === "login"
            ? "Sign in to access your VEXORA client account."
            : "Create an account to get started with VEXORA."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm text-slate-300"
              >
                Full name
              </label>

              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-slate-300"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="At least 6 characters"
            />
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-lg border border-white/10 bg-slate-900 p-3 text-sm leading-6 text-slate-300"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-slate-500 hover:text-white"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
