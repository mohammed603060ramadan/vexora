/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";

type Mode = "login" | "signup" | "forgot" | "reset";
type AccountType = "student" | "client";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [accountType, setAccountType] =
    useState<AccountType>("client");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      new URLSearchParams(window.location.search).get("recovery") === "1"
    ) {
      setMode("reset");
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setMessage("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function routeUser() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw userError ?? new Error("Please sign in again.");
    }

    // Existing linked client accounts keep access to the client portal.
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (clientError) throw clientError;

    if (client) {
      router.replace("/client");
      router.refresh();
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    if (profile?.account_type === "student") {
      router.replace("/student");
    } else {
      // Keep legacy accounts working even if their profile type is null.
      router.replace("/client");
    }

    router.refresh();
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "forgot") {
        const { error } =
          await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/login?recovery=1`,
          });

        if (error) throw error;

        setMessage(
          "If an account exists for this email, a password reset link will be sent. Please check your inbox."
        );
        return;
      }

      if (mode === "reset") {
        if (password.length < 8) {
          throw new Error(
            "Your new password must contain at least 8 characters."
          );
        }

        if (password !== confirmPassword) {
          throw new Error("The passwords do not match.");
        }

        const { error } = await supabase.auth.updateUser({
          password,
        });

        if (error) throw error;

        setPassword("");
        setConfirmPassword("");
        setMessage("Password updated successfully. You can now sign in.");

        await supabase.auth.signOut();
        setMode("login");
        return;
      }

      if (mode === "signup") {
        if (fullName.trim().length < 2) {
          throw new Error("Please enter your full name.");
        }

        if (password.length < 8) {
          throw new Error(
            "Your password must contain at least 8 characters."
          );
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              account_type: accountType,
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          await routeUser();
        } else {
          setMessage(
            "Account created. Check your email to confirm your address before signing in."
          );
        }

        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      await routeUser();
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

  const heading = {
    login: "Welcome back",
    signup: "Create your account",
    forgot: "Reset your password",
    reset: "Choose a new password",
  }[mode];

  const description = {
    login: "Sign in to access your VEXORA account.",
    signup: "Join VEXORA by creating a student or client account.",
    forgot: "Enter your email and we’ll send you a password reset link if an account matches.",
    reset: "Enter and confirm your new password below.",
  }[mode];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.25em] text-cyan-400"
        >
          VEXORA
        </Link>

        <h1 className="mt-8 text-3xl font-bold">{heading}</h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {mode === "signup" && (
            <>
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

              <div>
                <label
                  htmlFor="accountType"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Account type
                </label>

                <select
                  id="accountType"
                  value={accountType}
                  onChange={(event) =>
                    setAccountType(event.target.value as AccountType)
                  }
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                >
                  <option value="client">Client</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </>
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

          {mode !== "forgot" && (
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-slate-300"
              >
                {mode === "reset" ? "New password" : "Password"}
              </label>

              <input
                id="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
                minLength={mode === "login" ? 6 : 8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder={
                  mode === "login"
                    ? "Your password"
                    : "At least 8 characters"
                }
              />
            </div>
          )}

          {mode === "reset" && (
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
          )}

          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setMessage("");
                }}
                className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Forgot password?
              </button>
            </div>
          )}

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
              : {
                  login: "Sign in",
                  signup: "Create account",
                  forgot: "Send reset link",
                  reset: "Update password",
                }[mode]}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {mode === "login" && (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                }}
                className="font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Create one
              </button>
            </>
          )}

          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
                className="font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Sign in
              </button>
            </>
          )}

          {(mode === "forgot" || mode === "reset") && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMessage("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Back to sign in
            </button>
          )}
        </div>

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
