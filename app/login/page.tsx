

"use client";

import Image from "next/image";
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let active = true;

    async function handleAuthCallback() {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );

      const code = params.get("code");
      const tokenType =
        hashParams.get("type") ?? params.get("type");

      const isInvite = tokenType === "invite";
      const isRecovery = tokenType === "recovery";
      const hasPasswordFlow = params.get("recovery") === "1";

      if (code) {
        const { error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (!active) return;

        if (error) {
          console.error(
            "Authentication callback failed:",
            error.message
          );

          setMode("login");
          setMessage(
            "This invitation or password reset link is invalid, expired, or already used. Request a new link and try again."
          );
          return;
        }

        // Remove the one-time code while preserving the safe post-auth destination.
        const returnParams = new URLSearchParams(window.location.search);
        returnParams.delete("code");
        if (isInvite || isRecovery || hasPasswordFlow) {
          returnParams.set("recovery", "1");
        } else {
          returnParams.delete("recovery");
        }
        const returnQuery = returnParams.toString();
        window.history.replaceState(
          {},
          document.title,
          `${window.location.pathname}${returnQuery ? `?${returnQuery}` : ""}`
        );

        if (isInvite || isRecovery || hasPasswordFlow) {
          setMode("reset");
          setMessage(
            isInvite
              ? "Welcome to VEXORA. Create a password for your administrator account."
              : "Create and confirm your new password."
          );
        } else {
          await routeUser();
        }
        return;
      }

      if (isInvite || isRecovery) {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!active) return;

        if (error || !session) {
          setMode("login");
          setMessage(
            "This invitation or reset link could not be verified. Request a new link and try again."
          );
          return;
        }

        setMode("reset");
        setMessage(
          isInvite
            ? "Welcome to VEXORA. Create a password for your administrator account."
            : "Create and confirm your new password."
        );

        return;
      }

      if (hasPasswordFlow) {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!active) return;

        if (error || !session) {
          setMode("login");
          setMessage(
            "The password setup link is invalid or expired. Request a new link and try again."
          );
          return;
        }

        setMode("reset");
        setMessage("Create and confirm your new password.");
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return;

      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setMessage("Create and confirm your new password.");
      }
    });

    void handleAuthCallback().catch((error: unknown) => {
      if (!active) return;

      console.error("Authentication callback error:", error);
      setMode("login");
      setMessage(
        "We could not verify this link. Request a new invitation or password reset link."
      );
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function routeUser() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw userError ?? new Error("Please sign in again.");
    }

    if (user.app_metadata?.role === "admin") {
      router.replace("/admin");
      router.refresh();
      return;
    }

    const requestedNext = new URLSearchParams(window.location.search).get("next");
    const safeNext =
      requestedNext &&
      requestedNext.startsWith("/") &&
      !requestedNext.startsWith("//") &&
      !requestedNext.startsWith("/admin")
        ? requestedNext
        : null;

    if (safeNext) {
      router.replace(safeNext);
      router.refresh();
      return;
    }

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
          await supabase.auth.resetPasswordForEmail(
            email.trim(),
            {
              redirectTo: `${window.location.origin}/login?recovery=1`,
            }
          );

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

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (user?.app_metadata?.role === "admin") {
          setMessage(
            "Password updated successfully. Redirecting to the admin dashboard..."
          );
          await routeUser();
          return;
        }

        await supabase.auth.signOut();

        setMode("login");
        setMessage(
          "Password updated successfully. You can now sign in with your new password."
        );
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

        const requestedNext = new URLSearchParams(window.location.search).get("next");
        const safeNext =
          requestedNext &&
          requestedNext.startsWith("/") &&
          !requestedNext.startsWith("//") &&
          !requestedNext.startsWith("/admin")
            ? requestedNext
            : null;

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login${safeNext ? `?next=${encodeURIComponent(safeNext)}` : ""}`,
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
    reset: "Set your password",
  }[mode];

  const description = {
    login: "Sign in to access your VEXORA account.",
    signup: "Join VEXORA by creating a student or client account.",
    forgot:
      "Enter your email and we’ll send you a password reset link if an account matches.",
    reset:
      "Create and confirm a new password below. Use at least 8 characters.",
  }[mode];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05080e] px-4 py-12 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(22,135,255,0.17),transparent_35%),radial-gradient(ellipse_at_90%_85%,rgba(69,165,255,0.08),transparent_35%)]" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0a111d]/95 p-6 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-9">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="VEXORA home" className="inline-flex items-center">
            <Image src="/vexora-logo.png" alt="VEXORA" width={150} height={56} priority className="h-12 w-auto object-contain" />
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
            Secure access
          </span>
        </div>

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
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
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
                type={showPassword ? "text" : "password"}
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
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="mt-2 text-xs font-medium text-cyan-300 transition hover:text-white"
              >
                {showPassword ? "Hide password" : "Show password"}
              </button>
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
                  reset: "Save password",
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
