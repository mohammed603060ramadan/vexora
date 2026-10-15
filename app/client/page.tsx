
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/browser";

type Profile = {
  full_name: string | null;
};

export default function ClientPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checking, setChecking] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error || !data.session) {
        setChecking(false);
        router.replace("/login");
        return;
      }

      setUser(data.session.user);
      setChecking(false);
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (!session) {
        setUser(null);
        router.replace("/login");
        return;
      }

      setUser(session.user);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!user) return;

    let active = true;

    async function loadProfile() {
      setLoadingProfile(true);
      setMessage("");

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user!.id)
          .maybeSingle();

        if (!active) return;

        if (error) {
          console.error("Profile loading error:", error);

          const details = [
            error.message,
            error.code ? `Code: ${error.code}` : "",
            error.details ? `Details: ${error.details}` : "",
            error.hint ? `Hint: ${error.hint}` : "",
          ]
            .filter(Boolean)
            .join(" | ");

          setMessage(
            details || "Unable to load your profile. Please try again."
          );
        } else {
          setProfile(data);
        }
      } catch (error) {
        if (!active) return;

        const details =
          error instanceof Error ? error.message : String(error);

        console.error("Unexpected profile error:", details);
        setMessage(`Profile request failed: ${details}`);
      } finally {
        if (active) setLoadingProfile(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [user]);

  async function handleSignOut() {
    setSigningOut(true);
    setMessage("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(`Sign out error: ${error.message}`);
      setSigningOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Checking your account...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <p className="text-slate-400">Redirecting to sign in...</p>
      </main>
    );
  }

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    "VEXORA Client";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.25em] text-cyan-400"
          >
            VEXORA
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-transparent p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Client Portal
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
            Welcome, {displayName}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Welcome to your VEXORA client space. You can use this
            portal to follow your account and access future project
            updates and services.
          </p>
        </section>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mt-6 break-words rounded-lg border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200"
          >
            {message}
          </p>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold">Your account</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">Full name</p>
              <p className="mt-3 text-lg font-semibold">
                {loadingProfile ? "Loading..." : displayName}
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-slate-400">Email address</p>
              <p className="mt-3 break-all text-lg font-semibold">
                {user.email || "No email available"}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">Your workspace</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-semibold">My Projects</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Project tracking will be available here when we
                connect the projects database.
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-semibold">My Services</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Review your requested services as the client
                services module is developed.
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-semibold">Support</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Support requests and communication tools will be
                added in a later step.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
